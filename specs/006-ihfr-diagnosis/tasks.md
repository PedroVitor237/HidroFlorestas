# Tasks: Diagnóstico IHFR experimental

**Input**: [spec.md](spec.md), [plan.md](plan.md), [research.md](research.md), [data-model.md](data-model.md), [quickstart.md](quickstart.md) e [contracts/](contracts/).

**Status**: sequência remediada em 2026-09-20; implementação não iniciada. `G2-SCI` permanece `NAO_VERIFICADO_VALIDACAO_POSTERIOR` e não bloqueia a implementação experimental rotulada.

**Formato**: `- [ ] TNNN [P?] [US?] ação com caminho`. `[P]` aparece somente quando as tarefas podem ser executadas simultaneamente sem escrever o mesmo arquivo nem depender de resultado ainda não produzido.

## Phase 1 — Setup, guards e caracterização integrada

**Objetivo**: confirmar o baseline e congelar as fronteiras existentes antes de qualquer alteração de implementação.

- [X] T001 Registrar branch, HEAD, upstream, divergência e working tree inicial em `specs/006-ihfr-diagnosis/evidence/implementation.md`
- [X] T002 Confirmar `origin/development@df856194b3341137d6d863feefcb0a203deb5905` e o head IMP-008 `c6c13f7dc97d4ed873f67cb99fb6c36d60579601` como ancestrais e registrar em `specs/006-ihfr-diagnosis/evidence/implementation.md`
- [X] T003 Executar os hooks Spec Kit aplicáveis, se `.specify/extensions.yml` vier a existir, e registrar resultado/ausência em `specs/006-ihfr-diagnosis/evidence/implementation.md`
- [X] T004 Validar os dois manifestos, reproduzir seus hashes e provar que `contracts/ihfr-math-experimental-v0.1.0.json` não mudou e está inativo em `specs/006-ihfr-diagnosis/evidence/implementation.md`
- [X] T005 Caracterizar scripts, versões Node/Prisma e comandos de teste atuais em `specs/006-ihfr-diagnosis/evidence/implementation.md`
- [X] T006 Caracterizar schema, migrations, models legados e implementação da IMP-005 em `specs/006-ihfr-diagnosis/evidence/implementation.md`
- [X] T007 Caracterizar autenticação, autorização contextual e semântica de laboratório inativo das IMP-003/004/005 em `specs/006-ihfr-diagnosis/evidence/implementation.md`
- [X] T008 Caracterizar resumo/histórico da IMP-007 e confirmar ausência de projeção IHFR em `specs/006-ihfr-diagnosis/evidence/implementation.md`
- [X] T009 Caracterizar mapa/lista/endpoint da IMP-008 e confirmar ausência de score, classe, risco, `landUseType` e auditoria IHFR em `specs/006-ihfr-diagnosis/evidence/implementation.md`
- [X] T010 Fixar a matriz inicial de comandos, resultados esperados e stop conditions em `specs/006-ihfr-diagnosis/evidence/implementation.md`

**Checkpoint**: baseline e fronteiras documentados; nenhuma alteração funcional ainda realizada.

---

## Phase 2 — Preflight de banco, Prisma, migration e fixtures

**Objetivo**: tornar schema, client e dados de teste reais disponíveis antes dos testes comportamentais.

- [X] T011 Criar o preflight estático do schema e do legado em `tests/migration/ihfr-diagnosis-preflight.test.ts`
- [X] T012 Executar o preflight contra o baseline ainda não alterado e registrar as invariantes legadas em `specs/006-ihfr-diagnosis/evidence/implementation.md`
- [X] T013 Verificar que `prisma/migrations/20260920000100_ihfr_experimental_diagnosis/migration.sql` está livre e que nenhuma migration posterior invalida a ordem; parar a implementação se qualquer condição falhar
- [X] T014 Projetar enums, suplemento, diagnóstico, ponteiro, operação e evento em `prisma/schema.prisma`, preservando `UNIQUE(collectionDataId,payloadHash)` e sem `UNIQUE(inputSupplementId)`
- [X] T015 Criar a migration aditiva em `prisma/migrations/20260920000100_ihfr_experimental_diagnosis/migration.sql`, incluindo FK/constraints/índices/triggers e sem backfill
- [X] T016 Executar `prisma format` e inspecionar somente as mudanças esperadas em `prisma/schema.prisma`
- [X] T017 Inspecionar SQL, ordem, nomes, reversibilidade operacional e preservação do legado em `prisma/migrations/20260920000100_ihfr_experimental_diagnosis/migration.sql`
- [X] T018 Executar `prisma validate` antes de aplicar a migration e registrar o resultado em `specs/006-ihfr-diagnosis/evidence/implementation.md`
- [X] T019 Criar o lifecycle de schema PostgreSQL por execução em `tests/fixtures/postgresql-schema-lifecycle.ts`
- [X] T020 Preparar baseline vazio e baseline com legado para migration em `tests/fixtures/ihfr-diagnosis-migration-baseline.ts`
- [X] T021 Aplicar a cadeia real de migrations nos schemas isolados vazio e legado, sem desabilitar triggers, e registrar em `specs/006-ihfr-diagnosis/evidence/implementation.md`
- [X] T022 Verificar objetos, constraints, triggers, zero backfill e ordem aplicada nos schemas isolados em `tests/migration/ihfr-diagnosis-preflight.test.ts`
- [X] T023 Executar `prisma generate` somente após a aplicação isolada bem-sucedida e registrar o resultado em `specs/006-ihfr-diagnosis/evidence/implementation.md`
- [X] T024 [P] Criar fixtures explícitas de OWNER/ADMIN/MEMBER, usuário sem vínculo, conta ativa/inativa, vínculo atual/revogado e laboratório ativo/inativo em `tests/fixtures/ihfr-diagnosis-actors.ts`
- [X] T025 [P] Criar fixtures de dois laboratórios, áreas, coletas confirmadas próprias/cruzadas e `EnvironmentalMeasurementSet` presente/ausente em `tests/fixtures/ihfr-diagnosis-contexts.ts`
- [X] T026 [P] Criar fixtures de suplemento válido/inválido/ausente, diagnósticos CURRENT/SUPERSEDED/REVOKED, operações idempotentes, eventos restritos, conflitos e dados insuficientes em `tests/fixtures/ihfr-diagnosis-domain.ts`
- [X] T027 [P] Criar vetores técnicos de manifesto, limites, opcionais conhecidos e entradas desconhecidas em `tests/fixtures/ihfr-diagnosis-technical-vectors.ts`
- [X] T028 Integrar criação, limpeza entre cenários e descarte final em `tests/fixtures/ihfr-diagnosis-fixtures.ts`
- [X] T029 Provar em smoke PostgreSQL que fixtures sobem e que o teardown remove o schema mesmo após falha injetada em `tests/integration/ihfr-diagnosis-fixture-lifecycle.test.ts`
- [X] T030 Registrar contagens baseline, schemas e processos antes dos testes comportamentais em `specs/006-ihfr-diagnosis/evidence/implementation.md`

**Checkpoint**: migration aplicada em ambiente isolado, client gerado e fixtures executáveis; testes RED posteriores podem falhar por comportamento ausente, não por infraestrutura inexistente.

---

## Phase 3 — Shells compiláveis compartilhados

**Objetivo**: criar fronteiras mínimas compiláveis sem implementar comportamento de negócio.

- [X] T031 [P] Criar tipos públicos/fechados, incluindo `PublicDiagnosis.areaId`, em `src/types/ihfr-diagnosis.type.ts`
- [X] T032 [P] Criar constantes de versões, hashes, rótulos e capacidades em `src/app/api/server/ihfr-diagnosis/ihfr-diagnosis.constants.ts`
- [X] T033 [P] Criar interfaces de store, relógio e transação em `src/app/api/server/services/ihfr-diagnosis.store.ts`
- [X] T034 [P] Criar shell do carregador fail-closed em `src/app/api/server/ihfr-diagnosis/manifest-loader.ts`
- [X] T035 [P] Criar shell do avaliador puro em `src/app/api/server/ihfr-diagnosis/evaluator.ts`
- [X] T036 [P] Criar shell do parser de request/response em `src/app/api/server/ihfr-diagnosis/ihfr-diagnosis.contracts.ts`
- [X] T037 [P] Criar shell de adaptação HTTP e erros sanitizados em `src/app/api/server/ihfr-diagnosis/ihfr-diagnosis.http.ts`
- [X] T038 Criar shell do serviço e assinaturas de leitura/escrita em `src/app/api/server/services/ihfr-diagnosis.service.ts`
- [X] T039 Criar os seis route handlers contextuais como shells compiláveis sob `src/app/api/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/ihfr-diagnosis/`
- [X] T040 Executar typecheck focal dos shells e corrigir apenas erros estruturais, sem implementar os comportamentos que os testes RED devem dirigir

**Checkpoint**: imports e assinaturas compilam; nenhuma história é considerada entregue.

---

## Phase 4 — User Story 1: consultar diagnóstico e origem (P1)

**Objetivo**: entregar consulta segura e independente sobre diagnósticos já preparados pelas fixtures.

**Independent Test**: com fixture de diagnóstico vigente, consultar current/detail como OWNER, ADMIN e MEMBER e verificar score, origem, `areaId`, versões/hash, rótulos e minimização; também cobrir ausência, inatividade, isolamento e legado.

### Testes RED da US1

- [X] T041 [P] [US1] Criar testes do DTO e de `areaId` derivado/coerente em `tests/unit/ihfr-diagnosis-public-dto.test.ts`
- [X] T042 [P] [US1] Criar testes de projeção de ciclo CURRENT/SUPERSEDED/REVOKED em `tests/unit/ihfr-diagnosis-lifecycle-projection.test.ts`
- [X] T043 [P] [US1] Criar testes de autorização de leitura e 404 indistinguível em `tests/integration/ihfr-diagnosis-read-authorization.test.ts`
- [X] T044 [P] [US1] Criar testes do endpoint current, incluindo ausência, em `tests/integration/ihfr-diagnosis-current-route.test.ts`
- [X] T045 [P] [US1] Criar testes do endpoint detail, legado e minimização em `tests/integration/ihfr-diagnosis-detail-route.test.ts`
- [X] T046 [P] [US1] Criar jornada de consulta/ausência/inatividade em `tests/e2e/ihfr-diagnosis-read.spec.ts`
- [X] T047 [US1] Executar os testes T041–T046 e registrar RED comportamental esperado, sem erro de schema/client/fixture, em `specs/006-ihfr-diagnosis/evidence/implementation.md`

### Implementação da US1

- [X] T048 [US1] Implementar lookup laboratório → área → coleta → diagnóstico em `src/app/api/server/services/ihfr-diagnosis.service.ts`
- [X] T049 [US1] Implementar autorização READ e semântica de laboratório inativo em `src/app/api/server/services/ihfr-diagnosis.service.ts`
- [X] T050 [US1] Implementar projeção pública allowlist com `areaId` server-derived em `src/app/api/server/ihfr-diagnosis/ihfr-diagnosis.contracts.ts`
- [X] T051 [US1] Implementar estado de ciclo derivado de ponteiro/eventos em `src/app/api/server/services/ihfr-diagnosis.service.ts`
- [X] T052 [P] [US1] Implementar GET current em `src/app/api/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/ihfr-diagnosis/current/route.ts`
- [X] T053 [P] [US1] Implementar GET detail em `src/app/api/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/ihfr-diagnosis/diagnoses/[diagnosisId]/route.ts`
- [X] T054 [US1] Implementar mapeamento uniforme 401/404/500 e `Cache-Control: no-store` em `src/app/api/server/ihfr-diagnosis/ihfr-diagnosis.http.ts`
- [X] T055 [P] [US1] Criar componente de estado experimental e quatro rótulos em `src/components/ihfr-diagnosis/experimental-diagnosis-summary.tsx`
- [X] T056 [P] [US1] Criar componente de ausência sem score/classe inventados em `src/components/ihfr-diagnosis/no-current-diagnosis.tsx`
- [X] T057 [US1] Integrar consulta read-only na superfície contextual da coleta em `src/app/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/page.tsx`

### GREEN da US1

- [X] T058 [US1] Executar unitários da US1 até GREEN e registrar em `specs/006-ihfr-diagnosis/evidence/implementation.md`
- [X] T059 [US1] Executar integração PostgreSQL da US1 até GREEN e registrar em `specs/006-ihfr-diagnosis/evidence/implementation.md`
- [ ] T060 [US1] Executar E2E da US1 até GREEN e registrar em `specs/006-ihfr-diagnosis/evidence/implementation.md` — `SKIP` registrado; revalidar em T116 quando houver fixture isolada persistente visível pelo servidor
- [X] T061 [US1] Verificar manualmente navegação por teclado, foco e leitura dos rótulos experimentais e registrar resultado real em `specs/006-ihfr-diagnosis/evidence/implementation.md`
- [X] T062 [US1] Confirmar que ator, idempotency key, request/payload hash, payload ambiental e evidência restrita não aparecem no DTO/UI em `tests/integration/ihfr-diagnosis-detail-route.test.ts`
- [X] T063 [US1] Confirmar leitura autorizada em laboratório inativo e zero controles de escrita em `tests/e2e/ihfr-diagnosis-read.spec.ts`
- [X] T064 [US1] Registrar checkpoint independente da US1, incluindo comandos e limitações, em `specs/006-ihfr-diagnosis/evidence/implementation.md`

**Checkpoint**: US1 entrega consulta independente sem depender do fluxo de criação pela UI.

---

## Phase 5 — User Story 2: calcular, substituir, revogar e recuperar (P2)

**Objetivo**: entregar avaliação determinística, persistência atômica e ciclo seguro.

**Independent Test**: criar diagnóstico suficiente com chave própria, repetir para replay, substituir com ID esperado, revogar e recuperar após timeout; provar insuficiência, incompatibilidade, isolamento, cardinalidade 1:N e concorrência.

### Testes RED da US2

- [X] T065 [P] [US2] Criar testes de canonicalização e hashes v0.1.0/v0.1.1 em `tests/unit/ihfr-diagnosis-manifest-loader.test.ts`
- [X] T066 [P] [US2] Criar testes de parser fechado e condicionais `mode=CREATE/REPLACE` em `tests/unit/ihfr-diagnosis-contracts.test.ts`
- [X] T067 [P] [US2] Criar testes de scores, limites, classes, precisão e drivers em `tests/unit/ihfr-diagnosis-evaluator.test.ts`
- [X] T068 [P] [US2] Criar testes de ausência opcional conhecida versus campo/enum desconhecido em `tests/unit/ihfr-diagnosis-input-policy.test.ts`
- [X] T069 [P] [US2] Criar testes de elegibilidade e `400 INVALID_REQUEST` em `tests/integration/ihfr-diagnosis-eligibility-route.test.ts`
- [ ] T070 [P] [US2] Criar testes de CREATE/REPLACE, insuficiência e incompatibilidade em `tests/integration/ihfr-diagnosis-write-route.test.ts`
- [ ] T071 [P] [US2] Criar testes de replay, divergência e recuperação por chave em `tests/integration/ihfr-diagnosis-idempotency.test.ts`
- [ ] T072 [P] [US2] Criar testes de concorrência e ID vigente esperado em `tests/integration/ihfr-diagnosis-concurrency.test.ts`
- [ ] T073 [P] [US2] Criar testes de cardinalidade/reuso do suplemento em `tests/integration/ihfr-diagnosis-supplement-cardinality.test.ts`
- [ ] T074 [P] [US2] Criar testes de revogação, correção por substituição e imutabilidade em `tests/integration/ihfr-diagnosis-revocation.test.ts`
- [ ] T075 [P] [US2] Criar jornada de gestão OWNER/ADMIN/MEMBER em `tests/e2e/ihfr-diagnosis-manage.spec.ts`
- [ ] T076 [US2] Executar T065–T075 e registrar RED comportamental esperado, sem erro de schema/client/fixture, em `specs/006-ihfr-diagnosis/evidence/implementation.md`

### Implementação da US2

- [ ] T077 [US2] Implementar canonicalização recursiva e verificação fail-closed da v0.1.1 em `src/app/api/server/ihfr-diagnosis/manifest-loader.ts`
- [ ] T078 [US2] Preservar leitura verificável da v0.1.0 histórica sem permitir ativação em `src/app/api/server/ihfr-diagnosis/manifest-loader.ts`
- [ ] T079 [US2] Implementar parser fechado, discriminador `mode` e request hash canônico em `src/app/api/server/ihfr-diagnosis/ihfr-diagnosis.contracts.ts`
- [ ] T080 [US2] Implementar mapeamentos exatos e política known-optional/unknown em `src/app/api/server/ihfr-diagnosis/evaluator.ts`
- [ ] T081 [US2] Implementar dimensões, suficiência, clamp e decomposição em `src/app/api/server/ihfr-diagnosis/evaluator.ts`
- [ ] T082 [US2] Implementar score, classe, qualidade, half-up e drivers determinísticos em `src/app/api/server/ihfr-diagnosis/evaluator.ts`
- [ ] T083 [US2] Implementar autorização WRITE, laboratório ativo e bloqueio de MEMBER/processo autônomo em `src/app/api/server/services/ihfr-diagnosis.service.ts`
- [ ] T084 [US2] Implementar elegibilidade sem persistência em `src/app/api/server/services/ihfr-diagnosis.service.ts`
- [ ] T085 [US2] Implementar criação/reuso atômico de suplemento por `(collectionDataId,payloadHash)` em `src/app/api/server/services/ihfr-diagnosis.service.ts`
- [ ] T086 [US2] Implementar CREATE suficiente/insuficiente/incompatível e ledger terminal em `src/app/api/server/services/ihfr-diagnosis.service.ts`
- [ ] T087 [US2] Implementar REPLACE serializável com `expectedCurrentDiagnosisId` em `src/app/api/server/services/ihfr-diagnosis.service.ts`
- [ ] T088 [US2] Implementar REVOKE append-only com motivo restrito em `src/app/api/server/services/ihfr-diagnosis.service.ts`
- [ ] T089 [US2] Implementar replay/conflito/recuperação reautorizada em `src/app/api/server/services/ihfr-diagnosis.service.ts`
- [ ] T090 [US2] Implementar precedência e rollback integral de falhas em `src/app/api/server/services/ihfr-diagnosis.service.ts`
- [ ] T091 [P] [US2] Implementar GET eligibility em `src/app/api/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/ihfr-diagnosis/eligibility/route.ts`
- [ ] T092 [P] [US2] Implementar POST diagnoses para CREATE/REPLACE em `src/app/api/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/ihfr-diagnosis/diagnoses/route.ts`
- [ ] T093 [P] [US2] Implementar POST revocations em `src/app/api/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/ihfr-diagnosis/diagnoses/[diagnosisId]/revocations/route.ts`
- [ ] T094 [P] [US2] Implementar GET operation em `src/app/api/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/ihfr-diagnosis/operations/[idempotencyKey]/route.ts`
- [ ] T095 [US2] Implementar envelopes 400/401/403/404/409/422/500 e `no-store` em `src/app/api/server/ihfr-diagnosis/ihfr-diagnosis.http.ts`
- [ ] T096 [P] [US2] Criar formulário de suplemento fechado e predominância em `src/components/ihfr-diagnosis/ihfr-diagnosis-form.tsx`
- [ ] T097 [P] [US2] Criar controles de substituir/revogar com confirmação e ID esperado em `src/components/ihfr-diagnosis/ihfr-diagnosis-actions.tsx`
- [ ] T098 [US2] Integrar elegibilidade, gestão, timeout e recuperação na página contextual em `src/app/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/page.tsx`

### GREEN da US2

- [ ] T099 [US2] Executar unitários da US2 até GREEN e registrar em `specs/006-ihfr-diagnosis/evidence/implementation.md`
- [ ] T100 [US2] Executar integração PostgreSQL da US2 até GREEN e registrar em `specs/006-ihfr-diagnosis/evidence/implementation.md`
- [ ] T101 [US2] Executar concorrência/replay/falha injetada até GREEN e registrar em `specs/006-ihfr-diagnosis/evidence/implementation.md`
- [ ] T102 [US2] Executar E2E da US2 até GREEN e registrar em `specs/006-ihfr-diagnosis/evidence/implementation.md`
- [ ] T103 [US2] Registrar checkpoint independente da US2, incluindo seis operações/sete comportamentos e limitações, em `specs/006-ihfr-diagnosis/evidence/implementation.md`

**Checkpoint**: US2 entrega o ciclo completo sem enfraquecer US1.

---

## Phase 6 — Contratos, segurança e migration

**Objetivo**: provar propriedades transversais depois das histórias estarem verdes.

- [ ] T104 [P] Validar OpenAPI 3.1, seis operações/sete comportamentos, `mode`, condicionais e respostas em `tests/contract/ihfr-diagnosis-openapi.test.ts`
- [ ] T105 [P] Validar schema do suplemento, sete enums e rejeição de extras em `tests/contract/ihfr-diagnosis-input-schema.test.ts`
- [ ] T106 [P] Validar manifesto v0.1.1 ativo e v0.1.0 histórico, hashes e ausência de alteração matemática em `tests/contract/ihfr-diagnosis-manifests.test.ts`
- [ ] T107 Criar testes de migration em banco vazio/legado e zero backfill em `tests/migration/ihfr-diagnosis-migration.test.ts`
- [ ] T108 Criar testes de FK, unique do ponteiro/ledger, deduplicação do suplemento e FK não única no diagnóstico em `tests/migration/ihfr-diagnosis-constraints.test.ts`
- [ ] T109 Criar testes de triggers append-only sem desabilitá-los em `tests/migration/ihfr-diagnosis-immutability.test.ts`
- [ ] T110 Criar testes que distingam rollback da migration em schema descartável, rollback transacional e recuperação operacional de produção, provando ausência de objetos parciais em `tests/migration/ihfr-diagnosis-rollback.test.ts`
- [ ] T111 Criar testes de teardown após falha, zero schemas/órfãos/processos em `tests/integration/ihfr-diagnosis-fixture-lifecycle.test.ts`
- [ ] T112 Criar matriz de segurança para IDs forjados, contexto cruzado, vínculo revogado e replay sem acesso em `tests/integration/ihfr-diagnosis-security.test.ts`
- [ ] T113 Criar teste de privacidade do DTO/eventos/evidência e `areaId` coerente em `tests/integration/ihfr-diagnosis-privacy.test.ts`
- [ ] T114 Executar suítes de contrato/unitárias completas e registrar resultado real em `specs/006-ihfr-diagnosis/evidence/implementation.md`
- [ ] T115 Executar suítes PostgreSQL de integração/migration completas e registrar resultado real em `specs/006-ihfr-diagnosis/evidence/implementation.md`

---

## Phase 7 — E2E, regressões e qualidade

**Objetivo**: provar a jornada integrada e preservar todas as entregas anteriores antes do teardown.

- [ ] T116 Executar E2E completo da IMP-006, inclusive teclado/foco e rótulos científicos, e registrar em `specs/006-ihfr-diagnosis/evidence/implementation.md`
- [ ] T117 Executar regressões de autenticação, laboratório e papéis da IMP-003 e registrar em `specs/006-ihfr-diagnosis/evidence/implementation.md`
- [ ] T118 Executar regressões de coleta, detalhe e imutabilidade da IMP-004 e registrar em `specs/006-ihfr-diagnosis/evidence/implementation.md`
- [ ] T119 Executar regressões de captura/leitura ambiental, parser, idempotência e imutabilidade da IMP-005 e registrar em `specs/006-ihfr-diagnosis/evidence/implementation.md`
- [ ] T120 Executar regressões de resumo/histórico, paginação e minimização da IMP-007 e registrar em `specs/006-ihfr-diagnosis/evidence/implementation.md`
- [ ] T121 Confirmar que dashboard permanece sem eventos/projeção IHFR em `tests/integration/dashboard-api.test.ts`
- [ ] T122 Executar regressões territoriais unitárias e de integração da IMP-008, confirmando ausência de camada IHFR, e registrar em `specs/006-ihfr-diagnosis/evidence/implementation.md`
- [ ] T123 Executar `tests/e2e/territorial-map.spec.ts` com tiles interceptados antes de qualquer teardown/evidência final e registrar em `specs/006-ihfr-diagnosis/evidence/implementation.md`
- [ ] T124 Executar suíte geral, typecheck, lint e build e registrar resultados reais em `specs/006-ihfr-diagnosis/evidence/implementation.md`

---

## Phase 8 — Teardown, evidências e encerramento

**Objetivo**: remover estado de teste, consolidar evidência e fechar somente depois de todas as regressões.

- [ ] T125 Executar em bloco de finalização o descarte do schema PostgreSQL isolado, inclusive após falha anterior, usando `tests/fixtures/postgresql-schema-lifecycle.ts`
- [ ] T126 Verificar e registrar zero schemas da execução, zero registros órfãos, zero processos remanescentes e triggers nunca desabilitados em `specs/006-ihfr-diagnosis/evidence/implementation.md`
- [ ] T127 Consolidar comandos executados, versões, resultados, falhas e evidências sanitizadas em `specs/006-ihfr-diagnosis/evidence/implementation.md`
- [ ] T128 Registrar revisão do professor Fábio e dos demais especialistas como `NAO_VERIFICADO` (`VALIDACAO_POSTERIOR`), sem bloquear a entrega experimental, em `specs/006-ihfr-diagnosis/evidence/human-validation.md`
- [ ] T129 Registrar calibração, vetores científicos aprovados e testes de campo como `NAO_VERIFICADO` (`VALIDACAO_POSTERIOR`), bloqueando promoção definitiva, em `specs/006-ihfr-diagnosis/evidence/human-validation.md`
- [ ] T130 Atualizar `specs/006-ihfr-diagnosis/pr-description.md` com links, escopo real, comandos executados, resultados, limitações e estado humano sem inventar evidência
- [ ] T131 Validar links, referências, versões/hashes, seis operações/sete comportamentos e rastreabilidade FR/SC em `specs/006-ihfr-diagnosis/**`
- [ ] T132 Confirmar que o texto do PR preparado corresponde ao HEAD validado, à branch/base corretas e à evidência existente em `specs/006-ihfr-diagnosis/evidence/implementation.md`
- [ ] T133 Inspecionar diff e estado Git finais para excluir segredos, PII, alterações em `docs/raw/**`, mudanças fora do escopo e divergência não explicada; registrar em `specs/006-ihfr-diagnosis/evidence/implementation.md`
- [ ] T134 Confirmar que T001–T133 estão concluídas ou explicitamente justificadas, que não há estado residual e então registrar o fechamento real da implementação em `specs/006-ihfr-diagnosis/evidence/implementation.md`

---

## Dependencies and execution order

- Phase 1 bloqueia todas as demais.
- Phase 2 é obrigatória antes dos shells e dos RED comportamentais: schema aplicado, client gerado e fixtures disponíveis.
- Phase 3 bloqueia T041–T076; os RED devem falhar por comportamento ainda ausente, não por import, schema, client ou fixture.
- US1 pode ser entregue e testada com snapshots sem depender da UI de criação da US2.
- US2 depende da infraestrutura compartilhada e não pode regredir US1.
- Phase 6 depende das duas histórias verdes.
- Phase 7 ocorre integralmente antes do teardown.
- Phase 8 é serial; T134 é a última tarefa real e nenhuma tarefa pode ser acrescentada depois dela sem renumerar/reabrir o encerramento.

## Parallel execution examples

- T024–T027 escrevem quatro arquivos de fixture distintos depois de T023.
- T031–T037 criam shells em arquivos distintos; T038–T040 integram depois.
- T041–T046, T065–T075 e T104–T106 escrevem arquivos de teste distintos e só convergem nas respectivas tarefas de execução.
- T052/T053, T091–T094 e T096/T097 escrevem handlers/componentes distintos depois das dependências de serviço.
- Nenhuma tarefa marcada `[P]` escreve `prisma/schema.prisma`, a mesma migration, o mesmo serviço, o mesmo avaliador, o mesmo arquivo de evidência ou a mesma página contextual.

## Traceability summary

| Requisito/critério | Tarefas principais |
|---|---|
| FR-001–FR-002, SC-002/SC-005 | T007, T043–T054, T083, T112 |
| FR-003–FR-006, SC-001/SC-004 | T004, T031–T037, T041, T065–T082, T104–T106 |
| FR-007–FR-010, SC-003 | T042, T044–T057, T107 |
| FR-011–FR-012, SC-007 | T014–T029, T068, T073, T080–T086, T108–T110 |
| FR-013–FR-014, SC-006 | T071–T074, T087–T090, T093–T101 |
| FR-015–FR-017 | T034–T038, T077–T090, T109, T113 |
| FR-018 | T008–T009, T117–T123 |
| FR-019 | T066, T069, T079, T091–T095, T104 |
| FR-020, SC-008 | T019–T030, T107–T115, T125–T127 |

## Task distribution

| Recorte | Quantidade |
|---|---:|
| Phase 1 — setup/guards | 10 |
| Phase 2 — banco/Prisma/migration/fixtures | 20 |
| Phase 3 — shells | 10 |
| Phase 4 — US1 | 24 |
| Phase 5 — US2 | 39 |
| Phase 6 — contratos/segurança/migration | 12 |
| Phase 7 — E2E/regressões/qualidade | 9 |
| Phase 8 — teardown/evidências/fechamento | 10 |
| **Total** | **134** |

Há **41** marcações `[P]`, todas em arquivos distintos e condicionadas às dependências descritas. Por história, US1 possui 24 tarefas e US2 possui 39; as 71 restantes são setup, fundação ou validação transversal.

## Mapping of finding-cited legacy tasks

| IDs antigos | Destino remediado |
|---|---|
| T049–T052 | T067–T068 e T080–T082; vetores separados por arquivo e implementação serial no único `evaluator.ts` |
| T053–T054 | T066, T071, T079, T083, T089 e T112; contratos, idempotência e segurança agora têm arquivos/dependências explícitos |
| T117–T121 | T128–T129; validações humanas fundidas e serializadas antes da revisão final do PR |
| T122–T124 | conteúdo documental remediado agora e tarefa futura T130 para refletir somente evidência real da implementação |
| T125 | T132, correspondência PR preparado ↔ HEAD depois da revisão documental |
| T126 | T127 e T133, separando consolidação de evidência da inspeção final de diff/estado Git |
| T127 | T009 e T122–T123, com caracterização inicial e regressão territorial antes de teardown/evidências/fechamento |

## Notes

- Os vetores implementáveis são `TECHNICAL_CONTRACT_VECTOR`; não são evidência científica.
- A v0.1.0 e seu hash são imutáveis e históricos; novos diagnósticos usam exclusivamente v0.1.1/hash ativo.
- Revisão especializada, calibração e campo não bloqueiam a implementação experimental rotulada, mas bloqueiam promoção científica definitiva.
- Rollback transacional, limpeza entre cenários, rollback da migration, descarte do schema e recuperação operacional de produção são mecanismos distintos.
