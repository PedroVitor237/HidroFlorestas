# Tasks: Dados ambientais da coleta

**Input**: `spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/` e `quickstart.md`.
**Prerequisite operacional**: reconciliar `005-environmental-collection-data` com `origin/development` contendo a IMP-004 antes de alterar código; a reconciliação Git exige autorização própria e não é executada por esta lista.

## Formato

`[ID] [P?] [US?] descrição com caminho exato`. `[P]` indica arquivos independentes; `[US1]` e `[US2]` garantem rastreabilidade às histórias.

## Phase 1 — Contrato executável e fundação

**Objetivo**: estabelecer representação, migração segura, tipos e validação compartilhados antes das histórias.

- [ ] T001 Conferir após a reconciliação que os contratos reais da IMP-004 em `src/app/api/server/collections/collection.contracts.ts`, `src/app/api/server/services/collections.service.ts`, `src/app/api/server/areas/area.authorization.ts` e `src/components/collections/collection-detail.tsx` correspondem ao baseline descrito em `plan.md`; registrar qualquer divergência em `specs/005-environmental-collection-data/implementation-evidence.md` antes de continuar.
- [ ] T002 [P] Formalizar os schemas request/response/status de GET e POST em `specs/005-environmental-collection-data/contracts/environmental-data-api.openapi.yaml`, sem ampliar o DTO da coleta e sem incluir cálculo IHFR.
- [ ] T003 [P] Criar vetores válidos, inválidos, limites, null/zero/false e campos extras para `ihfr-measurement-v1` em `tests/fixtures/environmental-data.ts`.
- [ ] T004 [P] Criar tipos públicos fechados, enums canônicos e `MEASUREMENT_CONTRACT_VERSION` em `src/types/environmental-data.type.ts`.
- [ ] T005 Implementar parser estrito, normalização canônica, serialização estável e hash do contrato v1 em `src/app/api/server/environmental-data/environmental-data.contracts.ts`, usando T003/T004 como referência.
- [ ] T006 [P] Escrever testes RED do parser, faixas, enums, condicionais, campos extras, null/zero/false, canonicalização e hash em `tests/unit/environmental-data-contracts.test.ts`.
- [ ] T007 [P] Escrever teste RED de paridade entre o OpenAPI, os tipos e os vetores v1 em `tests/unit/environmental-data-openapi-contract.test.ts`.
- [ ] T008 Adicionar `EnvironmentalMeasurementSet` e relações restritivas em `prisma/schema.prisma`, preservando sem alteração normativa `WaterData`, `SoilData`, `VegetationData` e `TerrainData`.
- [ ] T009 Criar migration em `prisma/migrations/<timestamp>_environmental_measurement_set/migration.sql` com FKs, unicidades, índices e trigger que bloqueie UPDATE/DELETE do conjunto confirmado, sem atualizar nem fazer backfill de `CollectionData` ou do legado.
- [ ] T010 [P] Escrever preflight seguro e testes RED de migration, constraints, rollback documentado, legado preservado e trigger em `tests/unit/environmental-data-migration-preflight.test.ts` e `tests/migration/environmental-data-migration.test.ts`.
- [ ] T011 Adicionar permissões explícitas `READ_ENVIRONMENTAL_DATA` e `CREATE_ENVIRONMENTAL_DATA` para OWNER/ADMIN/MEMBER, mantendo laboratório inativo somente leitura, em `src/app/api/server/areas/area.authorization.ts`.

**Checkpoint**: contrato, parser, modelo e autorização compartilhada estão verificáveis; nenhuma UI ou endpoint depende de ciência implícita.

## Phase 2 — User Story 1: registrar dados na coleta correta (P1, MVP)

**Goal**: revisar e confirmar uma única unidade ambiental integral, atômica, imutável e idempotente para uma coleta acessível.
**Independent test**: fixture cria a coleta; POST válido cria uma vez, replay retorna o mesmo conjunto, conflitos não sobrescrevem e o pai permanece byte-a-byte inalterado.

- [ ] T012 [P] [US1] Escrever testes RED do serviço para criação, autoria da sessão, versão fixa, transação, replay idêntico, chave divergente, segundo conjunto e preservação do pai em `tests/unit/environmental-data-service.test.ts`.
- [ ] T013 [P] [US1] Estender as fixtures isoladas com criação/limpeza allowlisted e contagem residual zero em `tests/fixtures/environmental-data.ts`.
- [ ] T014 [US1] Implementar `EnvironmentalDataService` com dependências injetáveis, lookup contextual, transação, hash/replay e mapeamento sanitizado de conflitos em `src/app/api/server/services/environmental-data.service.ts`.
- [ ] T015 [P] [US1] Escrever testes RED de rota POST para autenticação, elegibilidade, três papéis, revogação, inatividade, IDs cruzados, validação, status, Location, no-store e envelope em `tests/integration/environmental-data-route.test.ts`.
- [ ] T016 [US1] Implementar POST fino em `src/app/api/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/environmental-data/route.ts`, derivando autor no servidor e exigindo `Idempotency-Key` UUID.
- [ ] T017 [P] [US1] Implementar estado local e transformação formulário→DTO sem fórmula científica em `src/components/environmental-data/environmental-data-form-state.ts`.
- [ ] T018 [P] [US1] Escrever testes RED de grupos, validação, null/zero/false, navegação e chave estável de retry em `tests/unit/environmental-data-form-state.test.ts`.
- [ ] T019 [US1] Implementar formulário acessível e responsivo dos quatro grupos em `src/components/environmental-data/environmental-data-form.tsx`, com labels/unidades do contrato e erros associados aos campos.
- [ ] T020 [US1] Implementar revisão em memória e confirmação explícita em `src/components/environmental-data/environmental-data-review.tsx`, mantendo a mesma chave em retries e exibindo sucesso apenas após response persistido.
- [ ] T021 [US1] Criar página `src/app/(private)/dashboard/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/environmental-data/new/page.tsx` e integrar a ação de entrada em `src/components/collections/collection-detail.tsx`, sem permitir reassociação do contexto.
- [ ] T022 [P] [US1] Criar estados de carregamento e erro recuperável em `src/app/(private)/dashboard/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/environmental-data/new/loading.tsx` e `error.tsx`.
- [ ] T023 [US1] Escrever e fazer passar o fluxo Playwright de registro, revisão, validação, retry e modo inativo em `tests/e2e/environmental-data-registration.spec.ts`.

**Checkpoint**: US1 funciona isoladamente sem GET da US2 na UI e sem produzir diagnóstico.

## Phase 3 — User Story 2: consultar dados e origem (P2)

**Goal**: consultar o conjunto ou sua ausência, com origem clara, projeção mínima e leitura em laboratório inativo.
**Independent test**: fixture insere diretamente um conjunto válido; GET retorna projeção exata/null e nega contextos cruzados sem depender do formulário US1.

- [ ] T024 [P] [US2] Escrever testes RED do serviço para consulta, ausência, projeção allowlisted, laboratório inativo, revogação e indistinguibilidade em `tests/unit/environmental-data-service-read.test.ts`.
- [ ] T025 [US2] Implementar consulta contextual e projeção `PublicEnvironmentalData` em `src/app/api/server/services/environmental-data.service.ts`, sem expor autoria, chave, hash ou legado.
- [ ] T026 [P] [US2] Adicionar casos GET de sucesso, null, inativo, três papéis, revogação, IDs cruzados, no-store e erros ao `tests/integration/environmental-data-route.test.ts`.
- [ ] T027 [US2] Implementar GET na rota `src/app/api/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/environmental-data/route.ts` sem alterar o GET da coleta IMP-004.
- [ ] T028 [P] [US2] Implementar apresentação allowlisted de valores, unidades, origem, ausência e versão em `src/components/environmental-data/environmental-data-detail.tsx`.
- [ ] T029 [US2] Criar página de consulta em `src/app/(private)/dashboard/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/environmental-data/page.tsx` com modo somente leitura e navegação contextual.
- [ ] T030 [P] [US2] Criar estados de carregamento e erro em `src/app/(private)/dashboard/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/environmental-data/loading.tsx` e `error.tsx`.
- [ ] T031 [US2] Escrever e fazer passar fluxo Playwright de consulta, ausência, origem, inatividade, acessibilidade e layouts móvel/amplo em `tests/e2e/environmental-data-read.spec.ts`.

**Checkpoint**: US1 e US2 são testáveis independentemente e o DTO original da coleta permanece fechado.

## Phase 4 — Robustez, regressão e evidência

- [ ] T032 [P] Adicionar testes de concorrência PostgreSQL para duas chaves, mesma chave/payload e mesma chave/payload divergente em `tests/integration/environmental-data-concurrency.test.ts`.
- [ ] T033 [P] Provar que INSERT do conjunto não toca `CollectionData` e que UPDATE/DELETE do conjunto falham no banco em `tests/migration/environmental-data-migration.test.ts`.
- [ ] T034 Executar `npm run test:unit`, `npm run test:integration`, `npm run test:e2e -- --workers=1`, `npm run lint`, `npm run typecheck` e `npm run build`, registrando cada resultado separadamente em `specs/005-environmental-collection-data/implementation-evidence.md`.
- [ ] T035 Executar os cenários do `specs/005-environmental-collection-data/quickstart.md`, incluindo teardown residual zero e regressão IMP-001–004; documentar bloqueios ambientais sem tratá-los como sucesso.
- [ ] T036 [P] Verificar por revisão e teste que nenhum caminho da IMP-005 cria `IHFRDiagnosis`, usa `algorithmVersion`, executa pesos/limiares ou lê os quatro models legados como dado v1; registrar a evidência em `specs/005-environmental-collection-data/implementation-evidence.md`.
- [ ] T037 Realizar avaliação humana de SC-006 e registrar origem, ausência e somente leitura como `VERIFICADO` ou `NAO_VERIFICADO` em `specs/005-environmental-collection-data/implementation-evidence.md`, sem converter automação em evidência humana.
- [ ] T038 Atualizar `TECH_DECISIONS.md`, `docs/governance/DOCUMENT_REGISTER.md` e `docs/governance/PENDING_DECISIONS.md` com a resolução G2/G3 somente se esses caminhos forem autorizados no escopo de implementação; caso contrário, registrar a pendência em `specs/005-environmental-collection-data/implementation-evidence.md`.

## Dependências e ordem

- T001 bloqueia qualquer edição de código porque a branch atual não contém a IMP-004 integrada.
- T002–T004 podem avançar em paralelo após T001; T005 depende de T003/T004.
- T008 precede T009; T009/T010 e T011 bloqueiam as histórias.
- US1: testes RED T012/T015/T018 precedem T014/T016/T017–T023; serviço precede rota; estado precede formulário/revisão.
- US2 pode usar fixtures sem depender da UI US1, mas T025/T027 dependem do serviço/rota fundacionais criados em US1.
- Phase 4 começa após os checkpoints de US1 e US2.

## Estratégia de entrega

O MVP é Phase 1 + US1. Validá-lo antes de US2. Não iniciar IMP-006 nem preencher o contrato matemático com fórmulas até que coeficientes, limiares, política de ausências, hash do manifesto e vetores dourados sejam aprovados pela autoridade científica.
