# ESPECIFICAÇÃO DO IHFR v0.1 (MVP) — “CONTRATO MATEMÁTICO”

## Objetivo do IHFR (definição operacional)

O Índice HidroFlorestal de Risco (IHFR) estima o risco hidroambiental da área, com foco em propensão à seca funcional do solo e impactos associados (baixa infiltração, baixa retenção, degradação/solo exposto e risco de salinização/escassez de água). Ele sintetiza variáveis de Água, Solo, Vegetação/Paisagem e Contexto Territorial.

**Saídas obrigatórias do IHFR:**

- `ihfr_score` (0.00 a 1.00)
- `ihfr_class` (baixo/moderado/alto/crítico)
- `ihfr_explanation` (texto curto padrão, com “porquês”)
- `component_scores` (pontuação por dimensão)
- `algorithm_version` (“IHFR_v0.1”)
- `data_quality` (completude/confiança)

## 1) Estrutura do índice (dimensões e pesos)

Para o MVP, usar 4 dimensões com pesos iguais (simples, transparente, fácil de calibrar depois):

- **W — Água (Water):** 0.25
- **S — Solo (Soil):** 0.25
- **V — Vegetação/Paisagem (Vegetation/Landscape):** 0.25
- **T — Território/Contexto (Terrain/Context):** 0.25

### Fórmula geral

$$
\mathrm{IHFR} = 0.25 \cdot W + 0.25 \cdot S + 0.25 \cdot V + 0.25 \cdot T
$$

Observação: como o projeto já define coleta modular (Água/Solo/Vegetação) e mapa/contexto territorial, essa estrutura “encaixa” diretamente.

## 2) Convenções de pontuação

Cada variável de entrada deve ser convertida para **score de risco entre 0 e 1**, onde:

- **0 = baixo risco (condição favorável / resiliente)**
- **1 = alto risco (condição crítica / vulnerável)**

Depois, cada dimensão é a **média dos scores das suas variáveis disponíveis**.

## 3) Variáveis mínimas do MVP (por módulo)

### 3.1 Módulo Água (W)

**Entradas MVP:**

1. `water_source_type` (`enum`)

   - valores: `river_stream`, `spring`, `shallow_well`, `tubular_well`, `cistern`, `other`
   - score (risco) sugerido:

     - `spring`: 0.2
     - `river_stream`: 0.4
     - `cistern`: 0.5
     - `tubular_well`: 0.6
     - `shallow_well`: 0.7
     - `other`: 0.5

2. `has_spring` (`bool`)

   - `true` → 0.2
   - `false` → 0.8

3. `well_depth_m` (`num`, opcional)

   - normalização (quanto mais raso, maior risco):

     - se vazio → “missing”
     - clamp 0–60 m
     - risco = 1 - (depth/60)

4. `water_availability` (`enum`)

   - `permanent`, `seasonal`, `scarce`
   - risco:

     - `permanent`: 0.2
     - `seasonal`: 0.6
     - `scarce`: 0.9

5. `salinity_indicator` (`enum` simples de campo)

   - `none`, `suspected`, `confirmed`
   - risco:

     - `none`: 0.2
     - `suspected`: 0.7
     - `confirmed`: 0.95

### Cálculo da dimensão Água

$$
W = \operatorname{mean}(\text{risk\_scores\_available})
$$

### 3.2 Módulo Solo (S)

**Entradas MVP:**

1. `infiltration_rate_mm_h` (`num`) (**prioritário do kit**)

   - clamp 0–60 mm/h
   - risco alto se infiltração baixa:

     - risco = 1 - (infiltration/60)
     - (se infiltration=0 → risco 1.0; infiltration=60 → risco 0.0)

2. `compaction_level` (`enum`)

   - `low`, `moderate`, `high`
   - risco:

     - `low`: 0.2
     - `moderate`: 0.6
     - `high`: 0.9

3. `erosion_signs` (`enum`)

   - `none`, `laminar`, `rills_gullies`
   - risco:

     - `none`: 0.2
     - `laminar`: 0.6
     - `rills_gullies`: 0.9

4. `soil_texture` (`enum`)

   - `sandy`, `medium`, `clayey`
   - risco (pensado para Itapecuru com limitações de infiltração/coesão em argilosos):

     - `sandy`: 0.5 (seca rápido, mas infiltra)
     - `medium`: 0.4
     - `clayey`: 0.7

5. `soil_exposed_percent` (`num` 0–100)

   - risco = clamp(soil_exposed_percent/100)

### Cálculo da dimensão Solo

$$
S = \operatorname{mean}(\text{risk\_scores\_available})
$$

### 3.3 Módulo Vegetação/Paisagem (V)

**Entradas MVP:**

1. `vegetation_cover_percent` (`num` 0–100)

   - risco = 1 - (cover/100)

2. `fragmentation_level` (`enum`)

   - `low`, `moderate`, `high`
   - risco:

     - `low`: 0.2
     - `moderate`: 0.6
     - `high`: 0.9

3. `has_riparian_app` (`bool`) (APP/mata ciliar presente)

   - `true`: 0.2
   - `false`: 0.85

4. `landscape_degradation` (`enum`)

   - `low`, `moderate`, `high`
   - risco:

     - `low`: 0.2
     - `moderate`: 0.6
     - `high`: 0.9

### Cálculo da dimensão Vegetação/Paisagem

$$
V = \operatorname{mean}(\text{risk\_scores\_available})
$$

### 3.4 Dimensão Território/Contexto (T)

Essa dimensão usa o que já aparece no seu documento: **tamanho da área, uso do solo e declividade** (obtida pelo mapa/entrada simples).

**Entradas MVP:**

1. `slope_percent` (`num` 0–45)

   - clamp 0–45
   - risco cresce com declividade (erosão/escoamento):

     - risco = slope/45

2. `land_use_type` (`enum`)

   - `forest`, `agroforestry`, `cropland`, `pasture`, `degraded_pasture`, `bare_soil`, `urban`
   - risco sugerido:

     - `forest`: 0.2
     - `agroforestry`: 0.25
     - `cropland`: 0.6
     - `pasture`: 0.65
     - `degraded_pasture`: 0.8
     - `bare_soil`: 0.95
     - `urban`: 0.7

3. `area_size_ha` (`num`, opcional)

   - no MVP, esse campo não altera o risco diretamente (para não introduzir viés).
   - usar apenas para exibição/relatório. (Se quiser, na v0.2 a gente cria “prioridade de intervenção” com base em tamanho.)

### Cálculo da dimensão Território

$$
T = \operatorname{mean}(\text{risk\_scores\_available})
$$

## 4) Tratamento de dados faltantes (data quality)

Como o MVP vai operar em campo, precisamos de regra objetiva:

- Cada dimensão precisa de pelo menos **2 variáveis preenchidas**.
- Se uma dimensão tiver `<2` variáveis, ela entra com valor `null` e é excluída da média final.

Cálculo com dimensões válidas:

$$
\mathrm{IHFR} = \operatorname{mean}(W, S, V, T\ \text{válidos})
$$

E gerar `data_quality`:

- `high` se ≥ 80% dos campos essenciais preenchidos
- `medium` se 50–79%
- `low` se < 50%

Campos essenciais (mínimo):

- `infiltration_rate_mm_h`
- `compaction_level`
- `vegetation_cover_percent`
- `land_use_type`
- `water_availability`

## 5) Classificação do risco (classes)

Mapeamento do `ihfr_score`:

- **0.00 – 0.25 → “baixo”**
- **0.26 – 0.50 → “moderado”**
- **0.51 – 0.75 → “alto”**
- **0.76 – 1.00 → “crítico”**

## 6) Interpretação automática (texto padrão)

O MVP deve gerar uma explicação curta com base nos **componentes mais críticos**.

Regra: pegar as 2 dimensões com maior score.

Exemplo de templates:

- Se S alto:

  “Risco elevado por baixa infiltração/compactação e sinais de degradação do solo. Priorizar cobertura do solo e práticas de descompactação biológica.”

- Se V alto:

  “Risco elevado por baixa cobertura vegetal e fragmentação/ausência de APP. Recomenda-se recomposição de cobertura e proteção de áreas sensíveis.”

- Se W alto:

  “Risco elevado por disponibilidade hídrica sazonal/escassa e indícios de salinização. Priorizar estratégias de retenção/infiltração e proteção de recarga.”

- Se T alto:

  “Risco elevado por uso do solo com alta exposição e/ou declividade favorável ao escoamento superficial. Priorizar contenção de enxurradas e manejo do uso.”