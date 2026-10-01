# ESPECIFICAÇÃO TÉCNICA DO SISTEMA - PLATAFORMA HIDROFLORESTAS – MVP

**Versão 1.0 — Documento para Desenvolvimento**

## 1. VISÃO GERAL DO SISTEMA

A plataforma HidroFlorestas é um sistema digital de inteligência territorial hidroambiental destinado a diagnosticar o risco hidroecológico de paisagens rurais. O núcleo analítico da plataforma é o IHFR — Índice HidroFlorestal de Risco, que integra variáveis ambientais associadas a:

- disponibilidade hídrica
- condição do solo
- cobertura vegetal
- características territoriais da paisagem

O modelo científico do índice parte da premissa de que a vulnerabilidade hidroambiental resulta da interação desses quatro componentes ecológicos que controlam a regulação do ciclo da água na paisagem.

## 2. OBJETIVO DO MVP

O MVP da plataforma deve permitir:

1. cadastro de áreas geográficas
2. inserção de dados ambientais coletados em campo
3. cálculo do IHFR
4. classificação de risco hidroambiental
5. geração de diagnóstico ambiental
6. recomendação de ações de restauração

Fluxo geral do sistema:

```text
                 Usuário
                    ↓
            Cadastro da área
                    ↓
      Inserção de dados ambientais
                    ↓
        Normalização dos dados
                    ↓
 Cálculo das dimensões ambientais
                    ↓
            Cálculo do IHFR
                    ↓
        Classificação de risco
                    ↓
        Diagnóstico ambiental
                    ↓
     Recomendações ecológicas
```

## 3. MODELO MATEMÁTICO DO IHFR

O índice é definido pela seguinte equação:

$$
IHFR = 0.35H + 0.30S + 0.25V + 0.10T
$$

Onde:

| variável | significado |
|---|---|
| H | dimensão hídrica |
| S | dimensão do solo |
| V | dimensão da vegetação |
| T | dimensão territorial |

Essa estrutura também está descrita no protocolo operacional do índice.

Todos os valores devem ser normalizados entre 0 e 1.

## 4. NORMALIZAÇÃO DAS VARIÁVEIS

Todas as variáveis ambientais devem ser convertidas para uma escala numérica entre 0 e 1, onde:

0 = condição ambiental ideal  
1 = condição de risco máximo

### 4.1 Fonte hídrica

| categoria | valor |
|---|---:|
| nascente | 0.1 |
| rio | 0.3 |
| cisterna | 0.5 |
| poço tubular | 0.6 |
| poço raso | 0.9 |

### 4.2 Profundidade do poço

| profundidade | valor |
|---|---:|
| 40 m | 0.2 |
| 20–40 m | 0.6 |
| < 20 m | 0.9 |

### 4.3 Salinização da água

| condição | valor |
|---|---:|
| ausente | 0.1 |
| suspeita | 0.5 |
| confirmada | 0.9 |

### 4.4 Taxa de infiltração

| infiltração | valor |
|---|---:|
| 40 mm/h | 0.2 |
| 20–40 mm/h | 0.6 |
| < 20 mm/h | 0.9 |

### 4.5 Compactação do solo

| condição | valor |
|---|---:|
| baixa | 0.2 |
| moderada | 0.6 |
| alta | 0.9 |

### 4.6 Erosão

| tipo | valor |
|---|---:|
| ausente | 0.1 |
| erosão laminar | 0.5 |
| sulcos | 0.8 |
| voçoroca | 1.0 |

### 4.7 Cobertura vegetal

| cobertura | valor |
|---|---:|
| 70% | 0.2 |
| 40–70% | 0.6 |
| <40% | 0.9 |

### 4.8 Fragmentação da paisagem

| condição | valor |
|---|---:|
| baixa | 0.2 |
| moderada | 0.6 |
| alta | 0.9 |

### 4.9 Mata ciliar

| condição | valor |
|---|---:|
| preservada | 0.2 |
| parcial | 0.6 |
| ausente | 0.9 |

### 4.10 Declividade

| declividade | valor |
|---|---:|
| <5% | 0.2 |
| 5–15% | 0.6 |
| 15% | 0.9 |

### 4.11 Uso da terra

| uso | valor |
|---|---:|
| floresta | 0.1 |
| SAF | 0.2 |
| agricultura | 0.6 |
| pastagem | 0.7 |
| pastagem degradada | 0.9 |
| solo exposto | 1.0 |

## 5. CÁLCULO DAS DIMENSÕES

Cada dimensão ambiental é calculada pela média simples das variáveis que a compõem.

**Dimensão hídrica (H)**

H = média (fonte hídrica,profundidade do poço,salinização)

**Dimensão solo (S)**

S = média (infiltração, compactação, erosão)

**Dimensão vegetação (V)**

V = média (cobertura vegetal, fragmentação, mata ciliar)

**Dimensão territorial (T)**

T = média (declividade, uso da terra)

## 6. CLASSIFICAÇÃO DO RISCO

Após o cálculo do índice:

| IHFR | classe |
|---|---|
| 0 – 0.25 | baixo risco |
| 0.26 – 0.50 | moderado |
| 0.51 – 0.75 | alto |
| 0.76 – 1.0 | crítico |

## 7. MOTOR DE RECOMENDAÇÃO

O sistema deve gerar recomendações automáticas baseadas nas variáveis.

**Regras iniciais**

**cobertura vegetal**

se cobertura < 40%  
recomendar reflorestamento

**infiltração**

se infiltração < 20 mm/h  
recomendar manejo conservacionista

**erosão**

se erosão >= sulcos  
recomendar controle de erosão

**mata ciliar**

se mata_ciliar = ausente  
recomendar recuperação de APP

**solo exposto**

recomendar cobertura vegetal

## 8. MODELO DE BANCO DE DADOS

### Tabela usuários

- id
- nome
- email
- senha_hash
- data_criacao

### Tabela áreas

- id
- usuario_id
- nome_area
- municipio
- estado
- area_ha
- geom (geometry)
- data_cadastro

### Tabela diagnósticos

- id
- area_id
- data_analise
- IHFR
- classe_risco
- versao_algoritmo

### Tabela variáveis ambientais

- diagnostico_id
- fonte_hidrica
- profundidade_poco
- salinizacao
- infiltracao
- compactacao
- erosao
- cobertura_vegetal
- fragmentacao
- mata_ciliar
- declividade
- uso_terra

## 9. API DO SISTEMA

**criar conta**

POST /users

**login**

POST /auth/login

**cadastrar área**

POST /areas

**listar áreas**

GET /areas

**criar diagnóstico**

POST /diagnostico

**calcular índice**

POST /calcular-ihfr

**obter diagnóstico**

GET /diagnostico/{id}

## 10. ARQUITETURA DO SISTEMA

Arquitetura recomendada:

**Frontend**  
React / Next.js

**Backend**  
Python (FastAPI)

**Banco de dados**  
PostgreSQL + PostGIS

**Mapas**  
Leaflet + OpenStreetMap

Essa arquitetura permite manipulação eficiente de dados geoespaciais e processamento ambiental.

## 11. FLUXO OPERACIONAL

```text
              login
                ↓
            dashboard
                ↓
     cadastrar área no mapa
                ↓
    inserir dados ambientais
                ↓
          calcular IHFR
                ↓
      visualizar resultado
                ↓
      gerar recomendações
```

Esse fluxo corresponde ao desenho das telas definidas nos wireframes do MVP.

## 12. SEGURANÇA E RASTREABILIDADE

Cada diagnóstico deve registrar:

id do usuário  
data da análise  
área analisada  
versão do algoritmo  
dados utilizados

Isso garante rastreabilidade científica do índice.

## 13. EVOLUÇÕES FUTURAS

O sistema poderá integrar futuramente:

- imagens de satélite
- dados climáticos
- sensores ambientais
- modelagem hidrológica
- monitoramento de restauração ecológica
