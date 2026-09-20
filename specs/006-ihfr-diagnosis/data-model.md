# Data Model: Diagnóstico IHFR experimental

**Date**: 2026-09-19
**Status**: desenho lógico da v0.1; `CONTRATO_EXPERIMENTAL`, `VALIDACAO_CIENTIFICA_PENDENTE`, `SUJEITO_A_RECALIBRACAO`, `NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO`.

## 1. Relações

```text
LaboratoryRoom 1 ── * CollectionArea 1 ── * CollectionData
                                              │
                                              ├── 1 EnvironmentalMeasurementSet
                                              ├── * ExperimentalIHFRInputSupplement
                                              ├── * ExperimentalIHFRDiagnosis
                                              ├── 0..1 CurrentExperimentalIHFRDiagnosis
                                              ├── * IHFRDiagnosisOperation
                                              └── * IHFRDiagnosisLifecycleEvent
```

`IHFRDiagnosis` legado permanece separado e não é origem, destino ou fallback da v0.1.

## 2. ExperimentalIHFRInputSupplement

Snapshot fechado `ihfr-diagnosis-input-experimental-v0.1.0` consumido por exatamente um diagnóstico.

| Campo | Regra |
|---|---|
| `id` | UUID, PK |
| `collectionDataId` | FK obrigatória para a coleta contextual, `RESTRICT` |
| `environmentalMeasurementSetId` | FK obrigatória para o conjunto consumido, `RESTRICT` |
| `createdByUserId` | autoria interna derivada do principal, FK `RESTRICT` |
| `inputContractVersion` | literal `ihfr-diagnosis-input-experimental-v0.1.0` |
| `landUseType` | enum fechado com os sete valores do manifesto |
| `provenance` | JSON fechado com `kind` e `observedAt`; sem texto livre/PPI desnecessária |
| `payloadHash` | SHA-256 interno do suplemento canônico mais referências de origem |
| `confirmedAt` | instante do servidor |
| `createdAt` | instante técnico |

Invariantes:

- `UNIQUE(collectionDataId, payloadHash)` evita duplicação acidental sem impedir novo snapshot quando a entrada muda;
- relação 1:1 com `ExperimentalIHFRDiagnosis` por unique no diagnóstico;
- trigger recusa `UPDATE` e `DELETE` após criação;
- `CollectionArea.landType`, drenagem, elevação e tamanho não alimentam o campo;
- `soilTexture`, `landscapeDegradation`, `vegetationCoverPercent`, declividade e os demais campos ambientais não substituem o uso da terra;
- uso misto exige uma única categoria predominante; não existe array, composição ou média entre categorias;
- categoria fora dos sete valores exatos retorna `INVALID_INPUT`; não existe `OTHER`, alias ou fallback;
- ausência ou predominância indeterminável não persiste como `null` nem vira zero: produz operação `INSUFFICIENT_DATA`.

### LandUseTypeExperimentalV01

| Valor | Score normativo |
|---|---:|
| `FOREST` | 0.20 |
| `AGROFORESTRY` | 0.25 |
| `CROPLAND` | 0.60 |
| `PASTURE` | 0.65 |
| `DEGRADED_PASTURE` | 0.80 |
| `BARE_SOIL` | 0.95 |
| `URBAN` | 0.70 |

O score não é armazenado no suplemento como nova autoridade; ele aparece na decomposição produzida pelo manifesto.

Os sete valores são a transformação lexical um a um do `lower_snake_case` de `DOC-RAW-013` para `UPPER_SNAKE_CASE`. Nenhuma categoria foi agrupada ou criada por inferência. `BARE_SOIL` como uso predominante em `T` permanece distinto de `soilExposedPercent` em `S`.

## 3. ExperimentalIHFRDiagnosis

Snapshot técnico/científico imutável de um cálculo suficiente.

| Campo | Regra |
|---|---|
| `id` | UUID, PK |
| `collectionDataId` | FK da coleta, `RESTRICT` |
| `environmentalMeasurementSetId` | FK do conjunto exato, `RESTRICT` |
| `inputSupplementId` | FK obrigatória e única, `RESTRICT` |
| `rawScore` | double precision finito em `[0,1]`, não arredondado |
| `displayScore` | decimal de duas casas, half-up, somente apresentação |
| `ihfrClass` | `LOW`, `MODERATE`, `HIGH`, `CRITICAL` |
| `dataQuality` | `LOW`, `MEDIUM`, `HIGH` |
| `componentScores` | JSON fechado `{W,S,V,T}`, valores finitos `[0,1]` |
| `decomposition` | JSON fechado com score por variável, bruto, transformação, entrada normalizada, `clamped` e disponibilidade |
| `drivers` | lista ordenada dos dois maiores componentes, desempate W/S/V/T |
| `explanation` | texto determinístico das templates do manifesto; nunca IA |
| `measurementContractVersion` | literal `ihfr-measurement-v1` |
| `inputContractVersion` | literal do suplemento v0.1.0 |
| `mathContractVersion` | literal `ihfr-math-experimental-v0.1.0` |
| `algorithmVersion` | literal `ihfr-evaluator-ts-v0.1.0` |
| `contractHash` | hash normativo completo com prefixo `sha256:` |
| `calculatedAt` | instante do servidor fornecido pela camada de aplicação |
| `scientificState` | literal `EXPERIMENTAL` |
| `createdAt` | instante técnico |

Invariantes:

- só existe para avaliação `SUFFICIENT`; insuficiência/falha não cria linha;
- raw/classificação/componentes são calculados sem arredondamento intermediário;
- decomposição preserva `terrain.slopePercent` original e registra saturação em 45 somente quando aplicável;
- os quatro rótulos de limitação são constantes de projeção/contrato, validados contra `scientificState`;
- trigger recusa `UPDATE` e `DELETE`;
- nenhuma coluna substitui outra versão/referência.

## 4. CurrentExperimentalIHFRDiagnosis

Ponteiro operacional, não parte do snapshot científico.

| Campo | Regra |
|---|---|
| `collectionDataId` | PK/FK para coleta |
| `diagnosisId` | FK única para diagnóstico experimental |
| `validFrom` | instante da operação que tornou vigente |
| `operationId` | FK para operação responsável |

Invariantes:

- a PK garante no máximo um `CURRENT` por coleta;
- diagnóstico e coleta do ponteiro devem coincidir, reforçados por FK composta ou trigger;
- substituição troca o ponteiro na mesma transação que cria o novo snapshot/eventos;
- revogação remove o ponteiro na mesma transação que cria o evento;
- estado de um diagnóstico é `CURRENT` se apontado, `REVOKED` se seu evento terminal for revogação, caso contrário `SUPERSEDED` depois de ter sido vigente.

## 5. IHFRDiagnosisOperation

Ledger interno para idempotência e recuperação após timeout.

| Campo | Regra |
|---|---|
| `id` | UUID, PK interno |
| `laboratoryRoomId`, `collectionAreaId`, `collectionDataId` | contexto materializado e validado |
| `actorUserId` | principal interno; nunca DTO normal |
| `idempotencyKey` | UUID fornecido em `Idempotency-Key` |
| `requestHash` | SHA-256 de request canônico próprio da operação |
| `operationType` | `CREATE_OR_REPLACE` ou `REVOKE` |
| `outcome` | `SUCCEEDED`, `INSUFFICIENT_DATA` ou `INCOMPATIBLE_VERSION` |
| `diagnosisId` | nullable; presente quando a resposta terminal o possui |
| `responseSnapshot` | JSON interno mínimo para replay fiel, sem ser fonte do domínio |
| `createdAt`, `completedAt` | instantes do servidor |

Constraints:

- `UNIQUE(actorUserId, idempotencyKey)`;
- mesmo ator+chave+hash/contexto recupera a resposta; qualquer divergência dá `IDEMPOTENCY_CONFLICT`;
- `confirmationKey` e `payloadHash` da IMP-005 nunca são copiados como identidade desta operação;
- o endpoint de recuperação reautoriza o contexto antes de projetar qualquer resposta;
- falha técnica antes do commit não deixa sucesso nem domínio parcial. Uma linha `PENDING` transitória, se usada pela implementação, não pode ser confundida com sucesso e precisa de política explícita de abandono; a recomendação é commit terminal atômico.

## 6. IHFRDiagnosisLifecycleEvent

Registro append-only de ciclo e auditoria restrita.

| Campo | Regra |
|---|---|
| `id` | UUID, PK |
| `collectionDataId` | contexto da coleta |
| `diagnosisId` | diagnóstico afetado |
| `eventType` | `CREATED_CURRENT`, `SUPERSEDED`, `REVOKED` |
| `replacementDiagnosisId` | obrigatório em `SUPERSEDED`, ausente nos demais |
| `actorUserId` | ator interno |
| `operationId` | operação idempotente responsável |
| `reason` | obrigatório e validado em revogação; interno/restrito |
| `occurredAt` | instante do servidor |
| `evidence` | JSON interno com referências, versões/hash e hashes das entradas; não payload público |

Invariantes:

- eventos não sofrem update/delete;
- criação gera `CREATED_CURRENT` para o novo diagnóstico;
- substituição gera `SUPERSEDED` para o anterior e `CREATED_CURRENT` para o novo;
- revogação gera `REVOKED` para o vigente;
- evento não é feed público e não é copiado para a IMP-007;
- retenção segue a política geral aplicável; nenhuma retenção nova é inventada por este plano.

## 7. Estados e transições

```text
sem vigente ── CREATE suficiente ──> CURRENT
CURRENT A ── REPLACE(expected=A) ──> SUPERSEDED A + CURRENT B
CURRENT A ── REVOKE(A, motivo) ────> REVOKED A + sem vigente
sem vigente após revogação ── CREATE suficiente ──> CURRENT C
```

Transições proibidas:

- editar snapshot, suplemento ou evento;
- revogar/sobrescrever diagnóstico que não é o vigente esperado;
- criar segundo vigente;
- reinterpretar resultado sob nova versão;
- tornar `INSUFFICIENT_DATA` vigente;
- promover legado ou chamar conformidade técnica de aceite científico.

## 8. Elegibilidade e insuficiência

A projeção de elegibilidade avalia, sem criar domínio:

- existência e versão exata do conjunto ambiental;
- presença de `terrain.slopePercent`;
- presença/validade do suplemento request quando aplicável;
- predominância única para uso misto; candidato ausente gera `MISSING_LAND_USE_TYPE`, enquanto token não reconhecido é `INVALID_INPUT`;
- suporte exato a manifesto, algoritmo e hash;
- suficiência de ao menos dois scores em W, S, V e T;
- estado atual da coleta e eventual diagnóstico vigente.

`eligible=false` retorna razões allowlisted como `MISSING_ENVIRONMENTAL_DATA`, `MISSING_SLOPE_PERCENT`, `MISSING_LAND_USE_TYPE`, `INSUFFICIENT_DIMENSION` ou `INCOMPATIBLE_VERSION`. Não retorna payload ambiental, identidades ou evidência restrita.

## 9. PublicDiagnosis DTO

Inclui somente:

- IDs contextuais de coleta/área e ID público do diagnóstico;
- `lifecycleState`, `rawScore`, `displayScore`, classe, qualidade, componentes e decomposição pública necessária;
- origem mínima: ID do conjunto e suplemento, datas e quatro versões/referências;
- `contractHash`, `calculatedAt`, `validFrom` e, quando aplicável, data pública da transição;
- quatro rótulos experimentais literais.

Exclui ator, `userId`, idempotency key, request/payload hashes internos, payload ambiental completo, motivo/evidência restrita, credenciais e PII.

## 10. Migration and legacy

A migration é aditiva: cria enums/models/índices/triggers e não modifica dados existentes. Deve validar:

- banco vazio e banco com `IHFRDiagnosis`/dados ambientais legados;
- ausência de backfill;
- FK `RESTRICT`, unique do ponteiro e do ledger;
- triggers de imutabilidade;
- rollback seguro antes de produção conforme prática do projeto.

O model legado permanece compilável e intacto. Nenhuma linha antiga recebe versão/hash ou aparece no endpoint experimental.

## 11. Fronteira com a projeção territorial integrada

A IMP-008 não acrescenta entidade persistente: seu mapa e sua lista derivam transitoriamente de `CollectionArea` e `CollectionData`. Nenhum model desta IMP-006 alimenta automaticamente essa projeção. `CurrentExperimentalIHFRDiagnosis`, snapshots e eventos restritos permanecem fora do DTO territorial.

Coordenadas, ponto da área e `CollectionArea.landType` não constituem suplemento nem substituem `landUseType`. Eventual relação territorial futura deve projetar dados mínimos a partir da fonte canônica do diagnóstico, sem copiar auditoria, criar contador ou introduzir segunda fonte de verdade.
