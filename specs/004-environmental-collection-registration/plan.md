# Implementation Plan: Registro geral de coleta ambiental

**Branch**: `004-environmental-collection-registration` | **Date**: 2026-09-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-environmental-collection-registration/spec.md`

**Current lifecycle**: specification, planning and task generation are complete. The first `$speckit-analyze` was executed and its documentary findings were remediated; an independent re-analysis is required before implementation. T005 and the real IMP-003/T111 evidence remain blocking.

## Summary

Entregar o registro geral e imutável de uma coleta ambiental dentro da cadeia explícita laboratório → área → coleta. `OWNER`, `ADMIN` e `MEMBER` poderão confirmar uma coleta em laboratório ativo; membros atuais poderão consultar seu detalhe também em laboratório inativo. O request contém somente o instante da ocorrência em RFC 3339 com offset e uma chave idempotente em header; identificador, laboratório, área, autoria e confirmação são definidos ou revalidados no servidor. A solução evolui `CollectionData`, preserva relações científicas legadas sem expô-las, reutiliza o guard contextual planejado pela IMP-003 e mantém a revisão exclusivamente em memória.

## Technical Context

**Language/Version**: TypeScript 5, Node.js 20.19.2 no baseline local

**Primary Dependencies**: Next.js 16.1.6 App Router, React 19.2.4, Prisma ORM/Client 7.4.2, adapter Neon; nenhuma nova dependência planejada

**Storage**: PostgreSQL via Prisma; ocorrência em `timestamptz(3)` normalizado mais offset RFC 3339 preservado; confirmação separada em `timestamptz(3)`

**Testing**: `node:test` com `tsx` para unidade, contrato e integração; harness PostgreSQL descartável para migration; Playwright Chromium serial para E2E

**Target Platform**: aplicação web responsiva em navegadores modernos; servidor Next.js em Linux/Vercel e PostgreSQL Neon

**Project Type**: aplicação web full-stack monolítica

**Performance Goals**: nenhuma meta técnica nova foi aprovada; a jornada deve continuar responsiva, sem chamadas externas e com uma única confirmação em voo na interface, preservando os resultados mensuráveis da spec

**Constraints**: implementação bloqueada até a IMP-003; contexto e autorização revalidados no servidor; nenhum rascunho persistente; coleta confirmada imutável; dois endpoints apenas; DTOs fechados; `no-store`; nenhum dado científico; nenhum acesso a banco nesta etapa

**Scale/Scope**: quatro histórias, três papéis contextuais, duas páginas, duas operações HTTP, uma evolução de entidade e uma migration; sem listagem, histórico, edição, exclusão ou medições

## Constitution Check

*GATE: aprovado para o planejamento antes da Fase 0 e revalidado após o design da Fase 1. O gate de implementação da IMP-003 permanece separado e bloqueante.*

| Princípio | Verificação antes da Fase 0 | Verificação após a Fase 1 |
|---|---|---|
| I. Hierarquia de fontes | PASS — decisões explícitas da IMP-004 governam escopo e tempo; Code-First e código integrado são usados conforme seus estados. | PASS — schema científico legado foi inventariado como evidência, não promovido a contrato; RFC, PostgreSQL e Prisma fundamentam somente decisões técnicas temporais. |
| II. Entregas verticais | PASS — confirmação e detalhe formam um resultado pequeno e verificável. | PASS — apenas criação imutável e detalhe foram desenhados; todas as capacidades futuras continuam adiadas. |
| III. Especificação por funcionalidade | PASS — artefatos limitados a `specs/004-environmental-collection-registration/**`. | PASS — plano, pesquisa, modelo, contrato e quickstart estão no diretório; `tasks.md` não foi criado. |
| IV. Evidência e rastreabilidade | PASS — divergência entre código atual, IMP-003 planejada e intenção da IMP-004 está explícita. | PASS — decisões de planejamento, evidências, dependências e fontes são distinguíveis nos cinco artefatos. |
| V. Qualidade e segurança proporcionais | PASS — riscos centrais são isolamento, temporalidade, idempotência, imutabilidade e migration. | PASS — guard único, FK composta, constraints, transação, chave idempotente, DTOs fechados e matriz de testes cobrem esses riscos. |
| VI. Documentação evolutiva | PASS — nenhum documento histórico ou Code-First será alterado. | PASS — relações científicas e dados legados são preservados; nenhuma decisão científica foi inferida. |
| VII. Trabalho em equipe | PASS — branch própria sincronizada e sem merge/rebase; somente planejamento documental autorizado. | PASS — alteração futura de schema é sequenciada após a IMP-003 e concentrada em uma migration da feature. |

Não há violação constitucional a justificar. A ausência de contrato científico não viola o gate porque medições foram explicitamente excluídas.

## Project Structure

### Documentation (this feature)

```text
specs/004-environmental-collection-registration/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── collection-registration-api.openapi.yaml
├── checklists/
│   └── requirements.md
└── tasks.md                 # criado somente por $speckit-tasks
```

### Source Code (repository root)

```text
prisma/
├── schema.prisma
└── migrations/
    └── 20260915000100_collection_registration_metadata/
        └── migration.sql

scripts/
└── imp-004-migration-preflight.ts

src/
├── app/
│   ├── (private)/dashboard/laboratories/[laboratoryId]/areas/[areaId]/collections/
│   │   ├── new/page.tsx
│   │   └── [collectionId]/page.tsx
│   └── api/
│       ├── laboratories/[laboratoryId]/areas/[areaId]/collections/
│       │   ├── route.ts
│       │   └── [collectionId]/route.ts
│       └── server/
│           ├── areas/area.authorization.ts       # criado/integrado pela IMP-003; reutilizado
│           ├── collections/collection.contracts.ts
│           └── services/collections.service.ts
├── components/collections/
│   ├── collection-form-state.ts
│   ├── collection-form.tsx
│   ├── collection-review.tsx
│   └── collection-detail.tsx
└── types/collection.type.ts

tests/
├── fixtures/collections.ts
├── migration/
│   └── collection-registration-migration.test.ts
├── unit/
│   ├── collection-contracts.test.ts
│   ├── collection-form-state.test.ts
│   ├── collection-migration-preflight.test.ts
│   ├── collection-openapi-contract.test.ts
│   └── collections-service.test.ts
├── integration/collections-route.test.ts
└── e2e/collection-registration.spec.ts
```

**Structure Decision**: manter o monólito Next.js existente e o padrão real de handlers finos com factories injetáveis, contratos por allowlist e ports de persistência pequenos junto ao serviço. A IMP-004 não cria repository genérico nem autorização paralela; estende o guard de área planejado pela IMP-003 com leitura contextual de coleta.

## Baseline, Divergence and Implementation Gate

O planejamento partiu de `626a98e9cd76ccf69604b7262b8ce5dc602497fa`, sincronizado `0/0` com `origin/004-environmental-collection-registration`. Na preparação, `origin/development` estava em `f440282a9aefbbb85b5199d0610fdb9ecab3dc87` e `origin/003-area-registration-and-viewing` em `7b71346b571afc32feac452545022da14fcfa549`; nenhuma havia avançado além dos baselines registrados e nenhuma foi integrada.

`EVIDENCIA_IMPLEMENTACAO`: o código atual integra a IMP-001/002, mas ainda não contém `LaboratoryMembershipRole`, o ponto direto de `CollectionArea`, as rotas contextuais de área nem `authorizeLaboratoryAccess`. `CONTRATO_PLANEJADO`: esses elementos estão fechados nos artefatos da IMP-003. Portanto, documentação e tarefas da IMP-004 podem avançar, mas qualquer implementação fica bloqueada até:

1. a IMP-003 estar implementada e integrada na base de trabalho;
2. schema e migration da IMP-003 estarem reconciliados com os ambientes alvo;
3. testes de papéis, contexto, área, isolamento e laboratório inativo passarem;
4. o gate T111 da IMP-003 registrar `IMP_004_LIBERADA_PARA_IMPLEMENTACAO` ou estado equivalente, com `area.id`, relação área–laboratório, guard, `CREATE_COLLECTION`, autoria e DTO mínimo comprovados.

Não criar fallback sobre o schema atual nem duplicar o guard para contornar esse gate.

## Design and Delivery Strategy

### 1. Temporal representation

O request aceita exatamente um `occurredAt` em perfil canônico RFC 3339, com offset obrigatório e precisão máxima de milissegundos. `Z`, `+00:00` e offsets numéricos válidos representam fusos explícitos; `-00:00`, horário sem offset, segundo intercalar `:60`, data civil impossível e mais de três casas fracionárias são recusados. O servidor compara o instante parseado com um relógio injetável imediatamente antes da criação: igualdade é válida e qualquer instante futuro é recusado, sem tolerância ou correção silenciosa.

Persistir `occurredAt` como `timestamptz(3)` normalizado e `occurrenceOffset` separadamente preserva simultaneamente comparação inequívoca e apresentação posterior no offset informado. O DTO reconstrói a ocorrência no offset armazenado; nunca usa o fuso do servidor ou navegador. `confirmedAt` é outro `timestamptz(3)`, definido automaticamente na transação. `createdAt` e `updatedAt` legados permanecem internos e não são renomeados nem apresentados como ocorrência ou confirmação.

Não armazenar identificador IANA nesta entrega: a coleta representa um instante passado já desambiguado pelo offset, não uma agenda sujeita a regras futuras. Horário desconhecido/impreciso e zona IANA permanecem possibilidades futuras sem campo especulativo agora.

### 2. Data model and migration

Evoluir `CollectionData` em vez de substituí-lo. Adicionar relação direta com `LaboratoryRoom`, `occurredAt`, `occurrenceOffset`, `confirmedAt` e `confirmationKey`. `id` continua opaco; `userId` continua autoria interna; `observations`, `createdAt`, `updatedAt` e relações com diagnóstico/água/solo/vegetação/terreno permanecem legados, sem entrada, saída ou uso funcional na IMP-004.

A associação área–laboratório é protegida por chave estrangeira composta de `CollectionData(collectionAreaId, laboratoryRoomId)` para `CollectionArea(id, laboratoryRoomId)`, exigindo unicidade correspondente no pai. A chave idempotente é única por autor. Um check exige que `occurredAt`, `occurrenceOffset`, `confirmedAt` e `confirmationKey` sejam todos nulos em linha legada ou todos preenchidos em coleta IMP-004; outro valida o offset. Campos temporais permanecem fisicamente anuláveis apenas para não fabricar ocorrência/confirmação em linhas anteriores.

A migration é expand-first e posterior à IMP-003: preflight detecta drift, órfãos e relações inválidas; adiciona colunas; preenche somente `laboratoryRoomId` a partir da área; instala constraints, índices e trigger de imutabilidade; não altera ou remove dados científicos. A API nova cria e consulta apenas linhas com a tupla de confirmação completa. Se o backfill determinístico do laboratório não for possível, a migration aborta antes de constraints ou remoções. Nenhuma coluna é removida.

Rollback de aplicação é compatível porque código anterior ignora as novas colunas. Depois de existirem coletas IMP-004, não fazer rollback destrutivo das colunas: usar forward-fix ou restauração de snapshot/PITR ensaiada. A pasta da migration deverá ser explicitamente permitida pelo `.gitignore` durante implementação, como já ocorre para a migration da IMP-002.

### 3. Authorization and isolation

O handler autentica com `requireAuth`; o serviço usa o mesmo `authorizeLaboratoryAccess` da IMP-003. Na criação, solicita `CREATE_COLLECTION` e, dentro da mesma transação da persistência, revalida conta, laboratório filtrado pelo vínculo, papel/estado e área pelo par `{ id, laboratoryId }`. Os três papéis criam em laboratório ativo; membro atual de laboratório inativo recebe `409 READ_ONLY`; papel sem permissão em laboratório ativo permanece `403`, ainda que não exista hoje nessa matriz.

Para detalhe, o guard recebe a permissão de leitura de coleta no mesmo módulo, permite qualquer papel atual em laboratório ativo ou inativo e busca a coleta simultaneamente por `collectionId`, `areaId` e `laboratoryId`. Laboratório, vínculo, área ou coleta ausente/cruzado converge em `404 NOT_FOUND`. Replay idempotente também revalida acesso antes de devolver o registro, impedindo que uma chave restaure acesso revogado.

Autor, laboratório, área, papel e estado nunca são lidos do body. A rota fornece apenas referências a revalidar; identificadores não concedem acesso por si só. DTOs não expõem `userId`, autoria, chave idempotente, `createdAt`, `updatedAt`, observações ou relações científicas.

### 4. API, idempotency and immutability

As únicas operações são:

- `POST /api/laboratories/{laboratoryId}/areas/{areaId}/collections`;
- `GET /api/laboratories/{laboratoryId}/areas/{areaId}/collections/{collectionId}`.

O POST exige `Idempotency-Key` UUID criado uma vez por tentativa intencional e body fechado `{ occurredAt }`. Uma chave válida inédita é o caso normal da primeira confirmação; somente chave ausente, malformada ou fora do perfil UUID retorna `400 INVALID_REQUEST`. A primeira criação retorna `201`, `Location` e o detalhe; replay idêntico retorna `200`, o mesmo `Location` e o mesmo registro. Reuso da chave pelo mesmo autor com rota ou ocorrência diferente retorna `409 CONFLICT`. Conteúdo igual com chaves diferentes representa coletas intencionalmente distintas e não é deduplicado.

`Location` identifica a URI canônica do recurso na API, `/api/laboratories/{laboratoryId}/areas/{areaId}/collections/{collectionId}`. A interface valida esse header separadamente, mas não o abre nem converte como texto confiável: após o sucesso, constrói `/dashboard/laboratories/{laboratoryId}/areas/{areaId}/collections/{collectionId}` com o contexto já validado e o `collection.id` do body tipado.

O port do serviço expõe apenas criação atômica e detalhe. A transação revalida o contexto, busca chave existente, compara a tupla canônica ou cria a coleta. Unicidade `(userId, confirmationKey)` garante no máximo uma criação sob corrida; conflito único ou de serialização é relido/repetido de forma limitada e converge. Falha integral não deixa registro parcial. A interface desabilita submissão repetida, mas a garantia é do servidor/banco.

Não há `PATCH`, `DELETE`, listagem nem endpoint de rascunho. Uma trigger rejeita `UPDATE` ou `DELETE` de linha IMP-004 (`confirmedAt IS NOT NULL`), protegendo imutabilidade além do serviço; linhas legadas permanecem preservadas. Alteração futura dessa política exigirá migration explícita de outra feature.

Todos os retornos usam o envelope planejado mais recente da IMP-003 (`{ collection }` ou `{ error: { code, message } }`) e `Cache-Control: no-store`. Isso diverge do envelope `{ success, ... }` atualmente integrado na IMP-002, mas a IMP-004 só será implementada depois da IMP-003; a paridade com o contrato efetivamente integrado deve ser confirmada no gate, sem misturar formatos silenciosamente. Erros internos retornam `500 INTERNAL_ERROR` sanitizado.

### 5. Minimum interface

O detalhe contextual de área da IMP-003 oferece “Registrar coleta” somente quando o contexto permite mutação. A nova página contém campos para a ocorrência, referência visível e não editável de laboratório/área e ações “Revisar” e “Voltar e corrigir”. A revisão informa de forma acessível que a coleta será registrada pela pessoa autenticada, por exemplo “Será registrada por você”, sem mostrar `userId`, email, papel global ou permitir autoria editável. Editar e revisar usam apenas estado React em memória; não há request de persistência, storage local ou rascunho. Qualquer alteração invalida a revisão anterior.

Ao confirmar, a interface mantém a mesma chave idempotente até obter resultado final e bloqueia eventos repetidos em voo. Depois do sucesso, usa o `collection.id` validado do body e o contexto já autorizado para construir a rota de interface; o `Location` da API é validado separadamente e nunca aberto ou reinterpretado como rota confiável. Timeout oferece repetição segura da mesma ação, nunca uma chave nova automática. Nova chave nasce somente ao iniciar intencionalmente outra coleta.

O detalhe separa “Ocorrência em campo” e “Confirmação no sistema”, mostra identificador, laboratório, área e modo somente leitura, e não oferece edição/exclusão. Páginas cobrem loading, validação, erro, retry, perda de acesso, teclado, foco e viewports móvel/ampla. `/dashboard/collects` continua mock legado e não é convertido em listagem/histórico nesta feature.

### 6. Testing strategy

O ciclo posterior de implementação deve ser mecanicamente TDD: criar shells mínimos compiláveis que falhem como `NOT_IMPLEMENTED`; escrever teste comportamental; comprovar RED pela ausência funcional — nunca por import, configuração, banco ou navegador; implementar o mínimo; obter GREEN; executar regressão e validação independente.

| Camada | Cobertura planejada |
|---|---|
| Unidade — contratos/tempo | Body e header fechados; RFC 3339/offset; data impossível/futura; precisão; `-00:00`; serializer e allowlist; ocorrência distinta de confirmação. |
| Unidade — serviço/autorização | Três papéis; ativo/inativo; área composta; autoria derivada; revogação; atomicidade; chave repetida igual/divergente; corrida; erro sanitizado; nenhum método mutável. |
| Unidade — UI | edição → revisão sem efeito externo; voltar preserva valores; alteração invalida revisão; submit único; retry mantém chave; nova tentativa gera chave nova; estados e acessibilidade. |
| Contrato | OpenAPI 3.1 válido; dois `operationId`; refs; schemas fechados; exemplos; status; `no-store`; ausência de operações e dados excluídos. |
| Integração | Factories injetadas; params contextuais; principal exclusivo; status/envelopes/Location; `401/403/404/409/500`; isolamento e revalidação. |
| Migration/PostgreSQL | Base vazia e com legado científico; backfill do laboratório; tupla/checks/FKs/índices/trigger; concorrência real; contagens; abort/restore. |
| E2E | Partir do detalhe da área; P1–P4; revisão sem POST; correção; confirmação/detalhe; duplo clique; timeout/replay; perda de acesso; cruzamento; inativo; responsividade. |
| Regressão | Todas as suítes IMP-001/002/003, lint, typecheck e build no ambiente seguro de implementação. |

Fixtures compõem o guard fail-closed já aprovado: `NODE_ENV=test`, `TEST_DATABASE_URL` explícita e diferente de `DATABASE_URL`, confirmação exata e IDs/prefixos allowlisted antes de qualquer conexão. Setup é precedido por cleanup; teardown roda em `finally`/`afterAll` mesmo após falha, remove somente registros allowlisted na ordem das FKs e confirma contagem final zero. Produção e banco compartilhado nunca são aceitos.

Nenhum teste funcional, build, Prisma ou banco foi executado nesta etapa documental. SC-002 e SC-007 permanecem `NAO_VERIFICADO` até avaliação com participantes representativos, conduzida futuramente pela equipe de produto/pesquisa depois de existir incremento executável em ambiente adequado. Automação não substitui essa avaliação, cujo resultado será incorporado à evidência da feature sem bloquear automaticamente implementação, PR ou merge.

## Implementation Phases

1. Comprovar o gate T111 e integrar a IMP-003; reconciliar schema, migration e contratos reais.
2. Criar preflight e migration expand-first da coleta, com testes PostgreSQL descartáveis antes do código consumidor.
3. Criar shells compiláveis para contrato, serviço, handlers, tipos, estado de formulário e fixtures.
4. Implementar parsing temporal, DTO fechado e matriz de testes unitários RED/GREEN.
5. Implementar transação, idempotência, FK contextual, imutabilidade e handlers POST/GET.
6. Implementar formulário/revisão em memória e detalhe contextual sem lista ou mutação.
7. Completar integração, contrato, migration, E2E, regressão, teardown e evidências de entrega.

## Risks and Mitigations

| Risco | Mitigação planejada |
|---|---|
| Implementar contra contratos da IMP-003 ainda ausentes | Gate T111 obrigatório; nenhuma duplicação/fallback; reconciliar código integrado antes das tarefas consumidoras. |
| Perder o offset original ao normalizar `timestamptz` | Persistir offset canônico separado e reconstruir o DTO explicitamente. |
| Horário ambíguo ou inexistente | Exigir instante RFC 3339 já acompanhado de offset; não aceitar horário local solto nem inferir IANA. |
| Inventar ocorrência/confirmação para registros legados | Tupla nullable completa; backfill somente do laboratório; API exclui linhas sem confirmação IMP-004. |
| Área e laboratório divergirem | FK composta e consulta sempre contextual, além do guard. |
| Duplo envio criar registros duplicados | Chave única por autor, transação, replay convergente e botão em voo apenas como defesa de UX. |
| Outro caminho alterar coleta confirmada | Ausência de endpoints/métodos mutáveis e trigger de imutabilidade para linhas IMP-004. |
| Vazamento por ID, erro ou DTO | `404` uniforme, allowlists, `no-store` e `500` sanitizado. |
| Relações científicas legadas virarem escopo | Preservar sem incluir, expor ou testar como requisito científico; nenhuma migration destrutiva. |
| Histórico de migrations ignorado/incompleto | Preflight de drift, allowlist explícita da nova migration, ensaio em base descartável e plano de forward-fix/snapshot. |
| Vulnerabilidades globais ampliarem a entrega | Permanecem em `chore/dependency-security-audit`; nenhum `npm audit fix`, especialmente `--force`. |

## Deferred Possibilities

Sem requisitos, endpoints, colunas especulativas ou tarefas nesta feature: medições ambientais validadas; rascunho persistente e retomada; edição/exclusão; listagem/histórico; horário desconhecido ou impreciso; identificador IANA; diagnóstico/IHFR; dashboards, gráficos e mapas analíticos.

## Complexity Tracking

Não aplicável: o design usa as camadas existentes, não adiciona dependência e não viola os gates constitucionais.
