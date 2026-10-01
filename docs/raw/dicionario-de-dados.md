# PLATAFORMA HIDROFLORESTAS — MVP

Este documento define os campos de dados, tipos, validações e obrigatoriedades utilizados pela plataforma HidroFlorestas.

Ele serve como referência para:

- modelagem do banco de dados
- desenvolvimento da API
- construção dos formulários da interface
- processamento do IHFR

## 1. ENTIDADE: USER

Representa os usuários da plataforma.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| id | UUID | sim | identificador único do usuário |
| name | string | sim | nome do usuário |
| email | string | sim | email de login |
| password_hash | string | sim | senha criptografada |
| role | enum | sim | tipo de usuário |
| organization | string | não | instituição ou grupo |
| created_at | datetime | sim | data de criação |
| updated_at | datetime | sim | última atualização |

**valores possíveis para role**

- admin
- technician
- field_user

## 2. ENTIDADE: AREA

Representa uma área cadastrada para diagnóstico.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| id | UUID | sim | identificador da área |
| user_id | UUID | sim | usuário responsável |
| area_name | string | sim | nome da área |
| municipality | string | sim | município |
| state | string | sim | estado |
| geometry | geometry | sim | polígono ou ponto |
| centroid_lat | float | sim | latitude |
| centroid_lon | float | sim | longitude |
| area_size_ha | float | não | tamanho da área |
| land_use_type | enum | sim | tipo de uso da terra |
| created_at | datetime | sim | data de criação |

**valores possíveis para land_use_type**

- forest
- agroforestry
- cropland
- pasture
- degraded_pasture
- bare_soil
- urban

## 3. ENTIDADE: SURVEY (DIAGNÓSTICO)

Cada diagnóstico representa uma coleta de dados realizada em campo.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| id | UUID | sim | identificador |
| area_id | UUID | sim | área analisada |
| user_id | UUID | sim | usuário que realizou |
| survey_date | date | sim | data da coleta |
| notes | text | não | observações |
| created_at | datetime | sim | registro do diagnóstico |

## 4. ENTIDADE: WATER_DATA

Dados relacionados à disponibilidade hídrica.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| id | UUID | sim | identificador |
| survey_id | UUID | sim | diagnóstico associado |
| water_source_type | enum | sim | tipo de fonte de água |
| has_spring | boolean | sim | presença de nascente |
| well_depth_m | float | não | profundidade do poço |
| water_availability | enum | sim | disponibilidade hídrica |
| salinity_indicator | enum | não | indício de salinidade |

**valores possíveis**

water_source_type

- river_stream
- spring
- shallow_well
- tubular_well
- cistern
- other

water_availability

- permanent
- seasonal
- scarce

salinity_indicator

- none
- suspected
- confirmed

## 5. ENTIDADE: SOIL_DATA

Dados relacionados ao solo.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| id | UUID | sim | identificador |
| survey_id | UUID | sim | diagnóstico |
| soil_texture | enum | sim | textura do solo |
| infiltration_rate_mm_h | float | sim | taxa de infiltração |
| compaction_level | enum | sim | compactação |
| erosion_signs | enum | sim | sinais de erosão |
| soil_exposed_percent | float | não | solo exposto |

**valores possíveis**

soil_texture

- sandy
- medium
- clayey

compaction_level

- low
- moderate
- high

erosion_signs

- none
- laminar
- rills_gullies

## 6. ENTIDADE: VEGETATION_DATA

Dados relacionados à vegetação e paisagem.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| id | UUID | sim | identificador |
| survey_id | UUID | sim | diagnóstico |
| vegetation_cover_percent | float | sim | cobertura vegetal |
| fragmentation_level | enum | sim | fragmentação |
| has_riparian_app | boolean | não | presença de APP |
| landscape_degradation | enum | sim | degradação |

**valores possíveis**

fragmentation_level

- low
- moderate
- high

landscape_degradation

- low
- moderate
- high

## 7. ENTIDADE: TERRAIN_DATA

Dados de contexto territorial.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| id | UUID | sim | identificador |
| survey_id | UUID | sim | diagnóstico |
| slope_percent | float | não | declividade |
| elevation_m | float | não | altitude |
| drainage_density | float | não | densidade de drenagem |

## 8. ENTIDADE: IHFR_RESULT

Resultado do índice hidroflorestal.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| id | UUID | sim | identificador |
| survey_id | UUID | sim | diagnóstico associado |
| ihfr_score | float | sim | valor do índice |
| ihfr_class | enum | sim | classe de risco |
| water_score | float | sim | componente água |
| soil_score | float | sim | componente solo |
| vegetation_score | float | sim | componente vegetação |
| territory_score | float | sim | componente território |
| data_quality | enum | sim | qualidade dos dados |
| algorithm_version | string | sim | versão do algoritmo |
| explanation | text | sim | interpretação do índice |
| created_at | datetime | sim | data do cálculo |

**classes de risco**

- baixo
- moderado
- alto
- crítico

**qualidade de dados**

- high
- medium
- low

## 9. ENTIDADE: ALERTS

Alertas gerados automaticamente pela plataforma.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| id | UUID | sim | identificador |
| area_id | UUID | sim | área associada |
| ihfr_result_id | UUID | sim | diagnóstico |
| alert_type | enum | sim | tipo de alerta |
| severity | enum | sim | gravidade |
| message | text | sim | descrição |
| created_at | datetime | sim | data |

**tipos de alerta**

- high_hydric_risk
- restoration_priority
- salinity_risk
- erosion_risk

## 10. REGRAS DE VALIDAÇÃO

**valores percentuais**

Devem ser limitados entre: 0 e 100

**infiltração**

intervalo permitido 0 a 60 mm/h

**declividade**

intervalo permitido  
0 a 45 %

**profundidade de poço**

intervalo permitido  
0 a 60 m

## 11. RELAÇÕES ENTRE ENTIDADES

**Estrutura relacional:**

```text
       User
         │
       Area
         │
      Survey
    WaterData
     SoilData
  VegetationData
    TerrainData
         │
    IHFRResult
         │
      Alerts
```

## 12. VERSIONAMENTO DO ALGORITMO

O sistema deve registrar:

algorithm_version = "IHFR_v0.1"

Versões futuras poderão incluir:  
IHFR_v0.2  
IHFR_v1.0 para permitir comparabilidade histórica.
