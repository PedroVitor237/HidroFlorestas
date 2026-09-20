# Data Model: Mapa e visualização territorial

**Feature**: IMP-008

**Date**: 2026-09-18
**Persistence impact**: none

## 1. Model boundary

A IMP-008 não cria entidade persistente. Ela forma, por leitura autorizada, uma projeção transitória das fontes integradas:

```text
LaboratoryRoom
  └── ResearchersLinked (vínculo e papel atuais)
  └── CollectionArea (ponto atual)
        └── CollectionData (somente tupla confirmada IMP-004)
```

O mapa, o item textual, a seleção e a contagem não são registros. Nenhum estado de tile, enquadramento, seleção ou erro é persistido.

## 2. Fontes integradas

### LaboratoryRoom + ResearchersLinked

Campos lidos pelo guard, não por input do navegador:

| Campo | Uso territorial | Exposição |
|---|---|---|
| `LaboratoryRoom.id` | fronteira da query e navegação | sim |
| `LaboratoryRoom.name` | identifica contexto | sim |
| `LaboratoryRoom.isActive` | deriva `ACTIVE/INACTIVE` e `readOnly` | apenas estado derivado |
| `ResearchersLinked.role` | valida papel contextual e orienta UI | sim, como `membershipRole` |
| `ResearchersLinked.userId` | comprova vínculo com principal | não |
| `LaboratoryRoom.accessCode/userId` | sem uso na projeção | não |

### CollectionArea

| Campo | Uso territorial | Regra |
|---|---|---|
| `id` | identidade opaca e destino de detalhe | obrigatório |
| `name` | identifica marker/item/painel | obrigatório |
| `laboratoryRoomId` | filtro e isolamento | deve coincidir com contexto autorizado |
| `latitude` | ponto atual | finita e `-90 <= value <= 90` |
| `longitude` | ponto atual | finita e `-180 <= value <= 180` |
| demais campos | nenhum | não selecionar/não expor |

Latitude e longitude continuam fonte canônica na área. A validação defensiva do serializer pode transformar o par em localização indisponível, mas nunca corrige ou persiste o registro.

### CollectionData

Uma linha é elegível somente quando todos estes campos são não nulos:

- `occurredAt`;
- `occurrenceOffset`;
- `confirmedAt`;
- `confirmationKey`.

| Campo | Uso territorial | Exposição |
|---|---|---|
| `id` | identidade e destino contextual | sim |
| `collectionAreaId` | subordina à área | implícito pelo aninhamento |
| `laboratoryRoomId` | reforça cadeia contextual | não no DTO filho |
| `occurredAt` + `occurrenceOffset` | identifica ocorrência sem fuso implícito | `occurredAt` reconstruído |
| `confirmedAt` | identifica confirmação | sim |
| `confirmationKey` | comprova tupla confirmada no filtro | não |
| autoria/observações/ciência | nenhum | não selecionar/não expor |

## 3. Public transient projection

### TerritorialContext

| Field | Type | Validation/derivation |
|---|---|---|
| `id` | UUID string | laboratório autorizado |
| `name` | string | nome atual do laboratório |
| `status` | `ACTIVE \| INACTIVE` | de `isActive` |
| `membershipRole` | `OWNER \| ADMIN \| MEMBER` | do vínculo atual |
| `readOnly` | boolean | `status === INACTIVE` |

### TerritorialLocation

| Field | Type | Validation |
|---|---|---|
| `latitude` | number | finita, inclusiva em `[-90, 90]`, até seis casas persistidas |
| `longitude` | number | finita, inclusiva em `[-180, 180]`, até seis casas persistidas |

O objeto existe somente quando os dois valores são utilizáveis. Não há localização parcial.

### ConfirmedCollectionProjection

| Field | Type | Validation/derivation |
|---|---|---|
| `id` | UUID string | `CollectionData.id` elegível |
| `occurredAt` | RFC 3339 string | instante reconstruído no `occurrenceOffset` integrado |
| `confirmedAt` | RFC 3339 string | ISO do instante confirmado |

Não possui `location`, `latitude`, `longitude`, autoria, observação, chave ou dado científico.

### TerritorialAreaProjection

| Field | Type | Validation/derivation |
|---|---|---|
| `id` | UUID string | `CollectionArea.id` do contexto |
| `name` | string | nome atual |
| `location` | `TerritorialLocation \| null` | `null` para par ausente/inválido |
| `confirmedCollections` | array | somente projeções elegíveis, ordenadas deterministicamente |

Derivações de interface:

- `confirmedCollectionCount = confirmedCollections.length`;
- destino da área = `/dashboard/laboratories/{context.id}/areas/{area.id}`;
- destino da coleta = `/dashboard/laboratories/{context.id}/areas/{area.id}/collections/{collection.id}`;
- estado de localização = `AVAILABLE` quando `location != null`, senão `UNAVAILABLE`.

Esses valores não precisam atravessar o contrato como campos redundantes.

### TerritorialMapResponse

| Field | Type | Invariant |
|---|---|---|
| `context` | `TerritorialContext` | corresponde ao guard da mesma leitura |
| `areas` | `TerritorialAreaProjection[]` | todas e somente as áreas do contexto |

## 4. Relationships and cardinality

```text
TerritorialMapResponse 1
  ├── 1 TerritorialContext
  └── 0..* TerritorialAreaProjection
          ├── 0..1 TerritorialLocation
          └── 0..* ConfirmedCollectionProjection
```

Regras:

1. Uma área aparece uma vez por `id`, mesmo que compartilhe coordenadas com outra.
2. Uma coleta aparece apenas sob sua área composta e laboratório atuais.
3. A coleta herda a referência espacial apenas pela relação; nenhuma coordenada é copiada ao filho.
4. Remoção/ineligibilidade na fonte retira o item na leitura seguinte.
5. Não há snapshot, histórico ou identidade territorial separada.

## 5. Query projection

A implementação deve expressar semanticamente esta seleção fechada:

```text
CollectionArea
where laboratoryRoomId = authorizedContext.id
select id, name, latitude, longitude
select collectionData where
  occurredAt != null AND
  occurrenceOffset != null AND
  confirmedAt != null AND
  confirmationKey != null
select collectionData.id, occurredAt, occurrenceOffset, confirmedAt
```

Ordenação:

- áreas: `name ASC`, `id ASC`;
- coletas dentro da área: `occurredAt DESC`, `id DESC`.

O guard ocorre antes da consulta. O `laboratoryRoomId` vem do parâmetro validado contra o vínculo, nunca do body.

## 6. Client-only view state

### DataState

```text
IDLE -> LOADING -> SUCCESS_EMPTY
                -> SUCCESS_WITH_DATA
                -> ERROR
ERROR -> LOADING (retry)
SUCCESS_* -> LOADING (laboratory change/refresh)
```

Toda transição para `LOADING` zera `data`, `selectedAreaId` e estados territoriais anteriores. Somente a geração de request corrente pode sair de `LOADING`.

### SelectionState

| Field | Type | Rule |
|---|---|---|
| `selectedAreaId` | UUID string or null | deve existir no array atual; origem mapa/lista é indiferente |

Troca de projeção invalida a seleção. Selecionar uma área sem localização continua válido pela lista.

### TileState

| State | Meaning | Effect on domain data |
|---|---|---|
| `UNCONFIGURED` | URL/atribuição ausente ou inválida | nenhum |
| `LOADING` | ciclo visível iniciou | nenhum |
| `AVAILABLE` | ciclo concluiu com tiles carregados e sem falha | nenhum |
| `DEGRADED` | houve sucessos e falhas | nenhum; mensagem separada |
| `UNAVAILABLE` | ciclo concluiu com erro e nenhum sucesso | nenhum; lista/painel permanecem |

Eventos `loading` reiniciam os contadores do ciclo; `tileload` incrementa sucesso; `tileerror` incrementa falha; `load` classifica o ciclo. A ausência do módulo Leaflet é capturada por error boundary separado e não é `TileState`.

## 7. Validation rules

- IDs de rota seguem o perfil UUID integrado e recurso inválido resulta em `404`.
- Nomes não recebem HTML confiável; React renderiza texto.
- Coordenadas exatamente nos extremos são válidas.
- Um valor inválido torna o par completo indisponível.
- Coordenadas textuais usam até seis casas, sem padding obrigatório.
- `confirmedCollections` nunca contém linha parcial.
- Schemas HTTP são fechados (`additionalProperties: false`).
- Respostas privadas, inclusive erros, são `no-store`.

## 8. Excluded/future models

Não fazem parte deste modelo: polígono, linha, buffer, bbox persistida, tile, camada, cluster, filtro, busca, dado ambiental, diagnóstico, score, classe, risco, evento, histórico, compartilhamento ou regra de precisão externa. Nenhum campo-reserva será criado para eles.
