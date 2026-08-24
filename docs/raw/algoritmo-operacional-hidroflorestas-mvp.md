# ALGORITMO OPERACIONAL — HIDROFLORESTAS (MVP)

**Núcleo computacional do diagnóstico: IHFR + Recomendações**

## 1) Objetivo do algoritmo

Transformar dados ambientais de campo + dados territoriais (mapa) em:

1. **pontuações normalizadas (0–1)**
2. **IHFR (0–1)**
3. **classe de risco** (baixo/moderado/alto/crítico)
4. **explicação automática** (porquê do risco)
5. **recomendações técnicas** (lista objetiva de ações)

## 2) Entradas do algoritmo

### 2.1 Entradas do usuário (formulário)

**Água**

- water_source_type (enum)
- has_spring (bool)
- well_depth_m (float, opcional)
- water_availability (enum)
- salinity_indicator (enum, opcional)

**Solo**

- soil_texture (enum)
- infiltration_rate_mm_h (float)
- compaction_level (enum)
- erosion_signs (enum)
- soil_exposed_percent (float, opcional)

**Vegetação/Paisagem**

- vegetation_cover_percent (float)
- fragmentation_level (enum)
- has_riparian_app (bool, opcional)
- landscape_degradation (enum)

### 2.2 Entradas do mapa (geoespacial)

- geometry (ponto/polígono)
- centroid_lat, centroid_lon
- slope_percent (float, opcional no MVP; pode ser input manual)
- land_use_type (enum)
- area_size_ha (float, opcional)

### 2.3 Metadados obrigatórios

- survey_id
- area_id
- user_id
- algorithm_version = “IHFR_v0.1”
- timestamp

## 3) Regras de validação (antes de calcular)

### 3.1 Validação de faixas (hard rules)

- vegetation_cover_percent ∈ [0,100]
- soil_exposed_percent ∈ [0,100] (se preenchido)
- infiltration_rate_mm_h ∈ [0,60]
- slope_percent ∈ [0,45] (se preenchido)
- well_depth_m ∈ [0,60] (se preenchido)

Se qualquer valor estiver fora da faixa:

- o sistema deve **bloquear** o cálculo e pedir correção.

### 3.2 Validação de consistência (soft rules)

- se vegetation_cover_percent < 10% e land_use_type = forest, emitir alerta de consistência (“verifique uso da terra”)
- se has_spring = true e water_availability = scarce, emitir alerta (“inconsistência possível”)

Essas regras não bloqueiam, apenas alertam.

## 4) Normalização (converter para risco 0–1)

Regra geral:

- risco 0 = condição favorável
- risco 1 = condição crítica

### 4.1 Funções base

- clamp(x, lo, hi) limita faixa
- enum_score(value, mapping) converte categóricos em risco
- mean(values) média ignorando null

## 5) Cálculo por dimensões (W, S, V, T)

### 5.1 Dimensão Água (W)

Inputs → scores:

- water_source_type → mapping (risco)
- has_spring → 0.2/0.8
- well_depth_m → risco = 1 − (depth/60)
- water_availability → mapping
- salinity_indicator → mapping

$$
W = \operatorname{mean}(\text{scores\_agua\_disponíveis})
$$

### 5.2 Dimensão Solo (S)

- infiltration_rate_mm_h → risco = 1 − (infiltration/60)
- compaction_level → mapping
- erosion_signs → mapping
- soil_texture → mapping
- soil_exposed_percent → risco = exposed/100

$$
S = \operatorname{mean}(\text{scores\_solo\_disponíveis})
$$

### 5.3 Dimensão Vegetação/Paisagem (V)

- vegetation_cover_percent → risco = 1 − (cover/100)
- fragmentation_level → mapping
- has_riparian_app → 0.2/0.85
- landscape_degradation → mapping

$$
V = \operatorname{mean}(\text{scores\_veg\_disponíveis})
$$

### 5.4 Dimensão Território/Contexto (T)

- slope_percent → risco = slope/45
- land_use_type → mapping

$$
T = \operatorname{mean}(\text{scores\_território\_disponíveis})
$$

## 6) Regra para dados faltantes (data completeness)

Para cada dimensão:

- se tiver **menos de 2 variáveis válidas**, a dimensão é null e **não entra na média**.

Depois:

$$
IHFR = \operatorname{mean}(W, S, V, T\ \text{válidos})
$$

### 6.1 Cálculo de data_quality

Campos essenciais do MVP:

- infiltration_rate_mm_h
- compaction_level
- vegetation_cover_percent
- land_use_type
- water_availability

Regra:

- high se 5/5 essenciais presentes
- medium se 3–4/5
- low se 0–2/5

Se low, mostrar aviso: “Diagnóstico preliminar”.

## 7) Classificação do risco

Mapeamento do ihfr_score:

- 0.00–0.25 → **baixo**
- 0.26–0.50 → **moderado**
- 0.51–0.75 → **alto**
- 0.76–1.00 → **crítico**
- null → **insuficiente**

## 8) Motor de explicação automática (porquê)

### 8.1 Regras

1. Ordenar dimensões válidas por score desc
2. Selecionar as 2 maiores (drivers do risco)
3. Gerar texto usando templates

### 8.2 Templates (exemplos)

- Se S alto:
  - “O risco é elevado principalmente por **baixa infiltração/compactação** e/ou **solo exposto**, reduzindo a capacidade do solo de armazenar água.”
- Se V alto:
  - “O risco é elevado por **baixa cobertura vegetal** e **fragmentação/ausência de APP**, aumentando aquecimento do solo e escoamento superficial.”
- Se W alto:
  - “O risco é elevado por **disponibilidade hídrica sazonal/escassa** e/ou **indícios de salinização**, indicando vulnerabilidade de recarga.”
- Se T alto:
  - “O risco é elevado por **uso da terra com alta exposição** e/ou **declividade**, aumentando erosão e perda de água por escoamento.”

## 9) Motor de recomendações (o que fazer)

### 9.1 Regras gerais por classe

- **Baixo:** manutenção e monitoramento anual
- **Moderado:** manejo preventivo (cobertura + conservação)
- **Alto:** intervenção dirigida (solo + vegetação + água)
- **Crítico:** plano de restauração prioritário e proteção imediata

### 9.2 Regras condicionais por driver

Se S ≥ 0.7:

- adicionar recomendações:
  - “cobertura permanente do solo (palhada/adubação verde)”
  - “descompactação biológica (plantas de raiz pivotante)”
  - “cordões vegetados/curvas de nível”

Se V ≥ 0.7:

- “recomposição de cobertura com espécies nativas e/ou SAF”
- “proteção de APP/mata ciliar”
- “cercamento de regeneração natural”

Se W ≥ 0.7:

- “estruturas de retenção/infiltração (barraginhas, caixas secas)”
- “proteção de áreas de recarga”
- “captação de água de chuva (cisternas)”
- “monitoramento/mitigação de salinização”

Se T ≥ 0.7:

- “manejo do uso do solo para reduzir exposição”
- “obras simples anti-erosivas (bacias de contenção, terraceamento leve)”
- “adequação do pastejo (lotação/rodízio)”

## 10) Persistência e rastreabilidade (audit trail)

Para cada diagnóstico, salvar obrigatoriamente:

- todas as entradas (raw inputs)
- scores normalizados por variável
- scores por dimensão (W,S,V,T)
- IHFR final
- classe
- texto explicativo
- recomendações
- data_quality
- algorithm_version
- timestamp

Isso garante auditabilidade, coerente com o princípio do projeto de algoritmos transparentes

## 11) Saída do algoritmo (payload padrão)

Retornar ao frontend:

- ihfr_score
- ihfr_class
- component_scores
- drivers (duas dimensões mais críticas)
- explanation
- recommendations[]
- data_quality
- algorithm_version

## 12) Critérios de aceitação (para QA)

O algoritmo será considerado implementado quando:

1. Para um conjunto de entradas válidas, o sistema retorna ihfr_score ∈ [0,1]
2. A classificação segue rigorosamente os intervalos
3. O resultado é persistido com algorithm_version = IHFR_v0.1
4. O data_quality é calculado corretamente
5. A explicação cita os 2 drivers de maior risco
6. As recomendações mudam conforme drivers e classe
