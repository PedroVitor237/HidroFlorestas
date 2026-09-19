# Modelo de dados: Dashboard e histórico básico

## Natureza do modelo

O dashboard não adiciona persistência. Este documento descreve models de origem integrados e projeções transitórias de leitura. Identificadores de item, totais e cursores não são entidades de domínio nem logs de auditoria.

## Models persistidos de origem

### LaboratoryRoom

Campos consumidos:

- `id: UUID` — laboratório explicitamente selecionado;
- `name: string` — identidade exibida;
- `isActive: boolean` — projetado como `ACTIVE` ou `INACTIVE`.

Relações relevantes:

- possui vínculos `ResearchersLinked`;
- possui `CollectionArea` e `CollectionData`.

Regra: `id` isolado não concede acesso. O laboratório só entra na projeção após vínculo atual e conta elegível.

### ResearchersLinked

Campos consumidos:

- chave composta `userId + laboratoryRoomId`;
- `role: OWNER | ADMIN | MEMBER`.

Uso: autorização e derivação de ações visíveis. O vínculo não é copiado para o histórico.

### CollectionArea

Campos consumidos:

- `id: UUID`;
- `laboratoryRoomId: UUID`;
- `name: string`;
- `createdAt: DateTime`.

Campos deliberadamente não consumidos: `userId`, `updatedAt`, `isActive`, coordenadas, município, estado, tipo de terreno, descrição e imagem.

Elegibilidade: pertencer ao laboratório autorizado. O contrato integrado lista todas as áreas do laboratório sem interpretar `isActive`; o dashboard preserva o mesmo conjunto.

### CollectionData

Campos consumidos:

- `id: UUID`;
- `laboratoryRoomId: UUID`;
- `collectionAreaId: UUID`;
- `confirmedAt: DateTime`;
- `occurredAt: DateTime`;
- `occurrenceOffset: string`;
- `confirmationKey: string` apenas no predicado de completude, nunca no DTO;
- relação `collectionArea { id, name }`.

Campos deliberadamente não consumidos/publicados: `userId`, `createdAt`, `updatedAt`, observações, chave de confirmação e relações científicas.

Elegibilidade: pertencer ao laboratório autorizado e possuir `occurredAt`, `occurrenceOffset`, `confirmedAt` e `confirmationKey` não nulos. Essa é a mesma tupla aceita pelo detalhe integrado.

## Projeções transitórias

### LaboratoryDashboardContext

| Campo | Tipo | Origem/regra |
|---|---|---|
| `id` | UUID | `LaboratoryRoom.id` autorizado |
| `name` | string | `LaboratoryRoom.name` |
| `status` | `ACTIVE \| INACTIVE` | `isActive` |
| `membershipRole` | `OWNER \| ADMIN \| MEMBER` | vínculo atual |
| `readOnly` | boolean | `!isActive` |

Não é persistido. Deve ser reconstruído em cada endpoint pelo guard integrado.

### DashboardSummary

| Campo | Tipo | Origem/regra |
|---|---|---|
| `context` | `LaboratoryDashboardContext` | autorização atual |
| `totals.areas` | inteiro >= 0 | contagem de áreas elegíveis |
| `totals.confirmedCollections` | inteiro >= 0 | contagem de coletas com tupla completa |
| `links.areas` | path contextual | `/dashboard/laboratories/{lab}/areas` |

Invariantes:

- zero só é emitido por resposta bem-sucedida;
- totais não incluem dados ambientais, diagnósticos ou objetos legados sem confirmação;
- contagem e links usam o mesmo laboratório autorizado.

### DerivedHistoryItem

União discriminada:

#### AreaCreatedItem

| Campo | Tipo | Regra |
|---|---|---|
| `id` | string | `AREA_CREATED:{areaId}` |
| `type` | `AREA_CREATED` | literal |
| `label` | `Área criada` | literal de interface |
| `eventAt` | ISO 8601 | `CollectionArea.createdAt` |
| `area` | `{ id, name }` | origem |
| `collection` | ausente | não aplicável |
| `destination` | path | detalhe contextual da área |

#### CollectionConfirmedItem

| Campo | Tipo | Regra |
|---|---|---|
| `id` | string | `COLLECTION_CONFIRMED:{collectionId}` |
| `type` | `COLLECTION_CONFIRMED` | literal |
| `label` | `Coleta confirmada` | literal de interface |
| `eventAt` | ISO 8601 | `CollectionData.confirmedAt` |
| `occurredAt` | ISO 8601 | ocorrência em campo, informação secundária |
| `area` | `{ id, name }` | relação de origem |
| `collection` | `{ id }` | origem |
| `destination` | path | detalhe contextual da coleta |

Invariantes comuns:

- o item existe somente enquanto sua origem permanece elegível e autorizada;
- não contém autor, PII, coordenadas, observações ou conteúdo científico;
- `destination` contém toda a cadeia autorizada;
- nenhuma transição adicional é inferida.

### HistoryCursor

Forma lógica antes da codificação opaca:

| Campo | Tipo | Validação |
|---|---|---|
| `version` | `1` | literal conhecido |
| `eventAt` | ISO 8601 | instante válido |
| `type` | tipo do histórico | allowlist de dois valores |
| `sourceId` | UUID | perfil UUID integrado |

O cursor representa a última chave retornada; não contém `userId` ou dados pessoais e não concede acesso. Depois de autenticar e autorizar o laboratório, cursor malformado retorna `400 INVALID_CURSOR` sem executar a consulta das fontes de área/coleta.

### HistoryPage

| Campo | Tipo | Regra |
|---|---|---|
| `context` | `LaboratoryDashboardContext` | autorização atual |
| `items` | `DerivedHistoryItem[]` | 0..20 itens |
| `page.nextCursor` | string ou `null` | existe somente quando há item elegível posterior |

## Ordem total e transição de páginas

1. `eventAt` descendente;
2. no mesmo instante, `AREA_CREATED` antes de `COLLECTION_CONFIRMED`;
3. no mesmo instante e tipo, `sourceId` descendente.

O primeiro request não possui cursor. O próximo request usa o cursor do último item apresentado e retorna somente chaves posteriores nessa ordem. O cliente pode retornar a uma parte anterior usando a pilha local de cursores; cada retorno reconsulta essa parte, e refresh descarta a pilha e reinicia na primeira parte.

O cursor não materializa snapshot nem congela o conjunto. Uma origem confirmada depois da leitura inicial, com chave mais recente que o cursor corrente, não aparece ao avançar para itens mais antigos e não deve duplicar item já apresentado. Ao voltar para uma parte mais recente ou executar refresh, a consulta usa as fontes atuais e pode incluir a nova origem, deslocando itens entre partes. Estabilidade integral e ausência de omissão são garantidas por SC-003 somente quando as fontes não mudam; sob mutação, a garantia é ordem total por resposta e continuação estrita após a chave fornecida.

## Estados da interface

Cada região possui exatamente um estado operacional:

- `loading`: ainda sem resultado definitivo;
- `success-data`: resposta com conteúdo;
- `success-empty`: resposta bem-sucedida com zero/nenhum item;
- `error`: falha sanitizada, sem payload anterior, com retry;
- `read-only`: atributo adicional do sucesso quando laboratório está inativo.

Trocar o laboratório reinicia região e cursor para `loading`; uma resposta abortada não produz transição.

## Relações e cardinalidades

```text
User 1 ── 0..* ResearchersLinked * ── 1 LaboratoryRoom
LaboratoryRoom 1 ── 0..* CollectionArea
LaboratoryRoom 1 ── 0..* CollectionData
CollectionArea 1 ── 0..* CollectionData

LaboratoryRoom + vínculo ──projeta── 1 LaboratoryDashboardContext
LaboratoryRoom ──projeta── 1 DashboardSummary por leitura
CollectionArea ──projeta── 0..1 AreaCreatedItem por leitura
CollectionData confirmada ──projeta── 0..1 CollectionConfirmedItem por leitura
```

## Dependências futuras não materializadas

- `EnvironmentalMeasurementSet` da IMP-005 está integrado, mas é deliberadamente excluído das projeções do incremento mínimo da IMP-007. Uma extensão posterior poderá consumi-lo sem alterar a fonte de verdade atual.
- O diagnóstico da IMP-006 não possui contrato técnico publicado; nenhum campo ou estado é reservado aqui.
- Uma extensão futura deverá acrescentar nova variante somente depois de reler models, datas, estados e destinos efetivamente integrados.

## Alterações de schema

Nenhuma. O incremento mínimo não cria migration, índice, coluna, constraint ou entidade de atividade. A necessidade de índice lab-wide para coletas será medida na implementação sem ampliar silenciosamente esta entrega.
