---

description: "Tarefas executáveis da IMP-006 — Diagnóstico IHFR experimental"
---

# Tasks: Diagnóstico IHFR experimental

**Input**: artefatos de design em `specs/006-ihfr-diagnosis/`

**Prerequisites**: `spec.md`, `plan.md`, `research.md`, `data-model.md`, `quickstart.md`, `contracts/**`, `docs/governance/ADR-0001-contrato-experimental-ihfr-v0-1.md`

**Contrato ativo**: `ihfr-math-experimental-v0.1.0`, hash `sha256:5285d52ec70e0b0f8a951d40dd54f052e02be1556dd310e3cef0b3b4f6bc684b`, sempre rotulado `CONTRATO_EXPERIMENTAL`, `VALIDACAO_CIENTIFICA_PENDENTE`, `SUJEITO_A_RECALIBRACAO` e `NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO`.

**Compatibilidade exata**: `ihfr-measurement-v1` + `ihfr-diagnosis-input-experimental-v0.1.0` + `ihfr-math-experimental-v0.1.0` + `ihfr-evaluator-ts-v0.1.0` + hash normativo acima.

**`landUseType` exato**: `FOREST=0.20`, `AGROFORESTRY=0.25`, `CROPLAND=0.60`, `PASTURE=0.65`, `DEGRADED_PASTURE=0.80`, `BARE_SOIL=0.95`, `URBAN=0.70`; não há alias, mudança de caixa, `OTHER`, `OTHERS`, média ou composição mista.

**Estados externos distintos**: ciclo `CURRENT`/`SUPERSEDED`/`REVOKED`; avaliação `INSUFFICIENT_DATA`; protocolo `INCOMPATIBLE_VERSION`/`IDEMPOTENCY_CONFLICT`/`STATE_CONFLICT`; falha `TECHNICAL_FAILURE`; entrada desconhecida `INVALID_INPUT`.

**TDD**: cada história começa por shell compilável, depois testes e RED comprovado; implementação, GREEN, regressões e critério independente vêm nessa ordem. Teste de caracterização que já deve passar não é evidência RED.

## Formato: `[ID] [P?] [Story?] Descrição com caminho`

- **[P]**: pode executar em paralelo sem colidir em arquivo ou depender de tarefa incompleta.
- **[US1] / [US2]**: rastreia a história da spec.
- Tarefas sem história são gates, fundamentos ou trabalho transversal.

## Phase 1: Setup e confirmação dos gates

**Purpose**: impedir implementação sobre baseline, feature ou autoridade divergentes.

- [ ] T001 Confirmar branch `006-ihfr-diagnosis`, HEAD publicado esperado, upstream `0/0`, árvore limpa e ancestrais de IMP-005, IMP-007 e `origin/development`, interrompendo em qualquer divergência antes de tocar `specs/006-ihfr-diagnosis/tasks.md`
- [ ] T002 Executar `.specify/scripts/bash/setup-tasks.sh --json` e confirmar que `FEATURE_DIR` resolve para `specs/006-ihfr-diagnosis` e que `.specify/feature.json` mantém esse ponteiro
- [ ] T003 Revalidar ausência de hooks executáveis em `.specify/extensions.yml` e registrar qualquer hook futuro como gate antes de continuar em `specs/006-ihfr-diagnosis/implementation-evidence.md`
- [ ] T004 Conferir que `specs/006-ihfr-diagnosis/contracts/ihfr-math-experimental-v0.1.0.json`, `specs/006-ihfr-diagnosis/contracts/ihfr-diagnosis-input-experimental-v0.1.0.schema.json` e `specs/006-ihfr-diagnosis/contracts/ihfr-diagnosis-api.openapi.yaml` permanecem idênticos ao pacote analisado
- [ ] T005 [P] Caracterizar os scripts existentes de unit, integration, migration, E2E, lint, typecheck e build em `package.json`, sem adicionar dependência, Python, FastAPI, IA ou serviço externo
- [ ] T006 [P] Caracterizar o schema legado, `EnvironmentalMeasurementSet` e as relações IMP-005 em `prisma/schema.prisma`, provando que `IHFRDiagnosis` não será promovido nem receberá backfill
- [ ] T007 [P] Caracterizar os tipos e fontes atuais do dashboard, comprovando somente `AREA_CREATED` e `COLLECTION_CONFIRMED` e ausência de diagnóstico ou auditoria paralela em `src/types/dashboard.type.ts` e `src/app/api/server/services/dashboard.service.ts`
- [ ] T008 Registrar PASS/FAIL dos gates G1, G2-ENG, G2-SCI, G3-ENG e da baseline em `specs/006-ihfr-diagnosis/implementation-evidence.md`, mantendo G2-SCI como `NAO_VERIFICADO_VALIDACAO_POSTERIOR`

**Blocking gate**: T001–T008 devem passar. Divergência material ou alteração concorrente interrompe a implementação.

---

## Phase 2: Fundamentos compartilhados

**Purpose**: criar shells compiláveis e fronteiras comuns, sem comportamento de produção antecipado.

- [ ] T009 Criar constantes literais de versões, hash, rótulos científicos, sete `landUseType` e capacidades `READ_IHFR_DIAGNOSIS`/`MANAGE_IHFR_DIAGNOSIS` em `src/types/ihfr-diagnosis.type.ts`
- [ ] T010 [P] Criar tipos fechados para suplemento candidato/confirmado, insuficiência, decomposição, resultado do avaliador, ciclo, operação e `PublicDiagnosis` em `src/types/ihfr-diagnosis.type.ts`
- [ ] T011 [P] Criar shell compilável dos parsers de body, UUID, `Idempotency-Key`, versões e DTOs em `src/app/api/server/ihfr-diagnosis/ihfr-diagnosis.contracts.ts`
- [ ] T012 [P] Criar shell server-only do carregador/canonicalizador de manifesto em `src/app/api/server/ihfr-diagnosis/manifest-loader.ts`
- [ ] T013 [P] Criar assinatura pura `evaluate(input, manifest)` sem banco, sessão, relógio ou rede em `src/app/api/server/ihfr-diagnosis/evaluator.ts`
- [ ] T014 [P] Criar shell de erros sanitizados, `Cache-Control: no-store` e adaptadores HTTP em `src/app/api/server/ihfr-diagnosis/ihfr-diagnosis.http.ts`
- [ ] T015 Criar interfaces de store, autorização, relógio, UUID e comandos do serviço em `src/app/api/server/services/ihfr-diagnosis.service.ts`
- [ ] T016 [P] Criar estados puros de formulário, revisão, carregamento, vazio, insuficiência, erro e retry em `src/components/ihfr-diagnosis/ihfr-diagnosis-form-state.ts`
- [ ] T017 [P] Criar fixtures técnicas explicitamente rotuladas `TECHNICAL_CONTRACT_VECTOR` para as quatro classes e estados insuficientes em `tests/fixtures/ihfr-diagnosis.ts`
- [ ] T018 [P] Criar guard de fixtures que rejeite credenciais, PII e conexão fora do banco descartável em `tests/fixtures/ihfr-diagnosis-fixtures.ts`
- [ ] T019 Acrescentar as capacidades IHFR ao modelo de autorização contextual sem reutilizar `CREATE_ENVIRONMENTAL_DATA` em `src/app/api/server/areas/area.authorization.ts`
- [ ] T020 Fixar a matriz de compatibilidade entre `ihfr-measurement-v1`, suplemento v0.1.0, matemática v0.1.0, algoritmo v0.1.0 e hash normativo em `src/app/api/server/ihfr-diagnosis/ihfr-diagnosis.contracts.ts`
- [ ] T021 Executar `npm run typecheck` para provar que os shells mínimos compilam antes dos testes comportamentais e registrar o comando em `specs/006-ihfr-diagnosis/implementation-evidence.md`
- [ ] T022 Revisar imports e limites server/client para impedir que manifesto, auditoria ou lógica do avaliador entrem no bundle cliente em `src/app/api/server/ihfr-diagnosis/manifest-loader.ts` e `src/types/ihfr-diagnosis.type.ts`

**Checkpoint**: shells compilam; nenhum resultado ainda é apresentado como funcional.

---

## Phase 3: User Story 1 — Consultar diagnóstico experimental e sua origem (Priority: P1)

**Goal**: OWNER, ADMIN e MEMBER vinculados consultam vigente/detalhe, ausência e proveniência mínima, inclusive em laboratório inativo, sem dados restritos.

**Independent Test**: com snapshots preparados, current/detail exibem score, classe, componentes, qualidade, versões/hash, origem, vigência, datas e quatro rótulos; ausência retorna `null`; isolamento e minimização permanecem íntegros.

### Shell e testes da US1

- [ ] T023 [US1] Criar shells compiláveis para `eligibility`, `current` e `detail` no serviço e handlers em `src/app/api/server/services/ihfr-diagnosis.service.ts` e `src/app/api/server/ihfr-diagnosis/ihfr-diagnosis.http.ts`
- [ ] T024 [P] [US1] Escrever testes unitários RED dos DTOs fechados, estados distintos, versões literais e exclusão de ator/chaves/hashes internos/payload ambiental em `tests/unit/ihfr-diagnosis-contracts.test.ts`
- [ ] T025 [P] [US1] Escrever testes unitários RED da projeção vigente, detalhe preservado, ausência e legado não promovido em `tests/unit/ihfr-diagnosis-service-read.test.ts`
- [ ] T026 [P] [US1] Escrever testes de contrato RED para `cookieAuth`, rotas contextuais, `404` uniforme e `no-store` de elegibilidade/current/detail em `tests/unit/ihfr-diagnosis-openapi-contract.test.ts`
- [ ] T027 [P] [US1] Escrever testes de integração RED para OWNER/ADMIN/MEMBER, conta inativa, sem vínculo, vínculo revogado, laboratório inativo e cruzamentos de laboratório/área/coleta/diagnóstico em `tests/integration/ihfr-diagnosis-read-route.test.ts`
- [ ] T028 [P] [US1] Escrever testes unitários RED dos estados visuais experimental, vazio, insuficiente, loading, erro e retry em `tests/unit/ihfr-diagnosis-form-state.test.ts`
- [ ] T029 [P] [US1] Escrever jornada E2E RED de consulta por MEMBER, ausência sem zero falso, somente leitura e navegação por teclado em `tests/e2e/ihfr-diagnosis-read.spec.ts`
- [ ] T030 [US1] Executar os testes T024–T029 e registrar falhas comportamentais esperadas, sem contar caracterizações já verdes como RED, em `specs/006-ihfr-diagnosis/implementation-evidence.md`

### Implementação mínima da US1

- [ ] T031 [US1] Implementar parsing e projeção allowlist de `EligibilityResponse` e `PublicDiagnosis` em `src/app/api/server/ihfr-diagnosis/ihfr-diagnosis.contracts.ts`
- [ ] T032 [US1] Implementar autorização contextual de leitura e resolução laboratório → área → coleta → diagnóstico, com conta ativa, vínculo atual e `404` indistinguível em `src/app/api/server/services/ihfr-diagnosis.service.ts`
- [ ] T033 [US1] Implementar elegibilidade sem persistência e sem expor payload ambiental, retornando somente razões allowlisted em `src/app/api/server/services/ihfr-diagnosis.service.ts`
- [ ] T034 [US1] Implementar projeções current/detail, estado derivado `CURRENT`/`SUPERSEDED`/`REVOKED`, ausência `null`, laboratório inativo legível e rejeição do legado em `src/app/api/server/services/ihfr-diagnosis.service.ts`
- [ ] T035 [US1] Implementar handlers GET finos, erros sanitizados e `Cache-Control: no-store` em `src/app/api/server/ihfr-diagnosis/ihfr-diagnosis.http.ts`
- [ ] T036 [P] [US1] Ligar GET de elegibilidade em `src/app/api/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/ihfr-diagnosis/eligibility/route.ts`
- [ ] T037 [P] [US1] Ligar GET do vigente em `src/app/api/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/ihfr-diagnosis/current/route.ts`
- [ ] T038 [P] [US1] Ligar GET do detalhe em `src/app/api/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/ihfr-diagnosis/diagnoses/[diagnosisId]/route.ts`
- [ ] T039 [US1] Implementar painel acessível com rótulo experimental, score bruto/apresentado, classe, qualidade, componentes, proveniência permitida, versões/hash e ciclo em `src/components/ihfr-diagnosis/ihfr-diagnosis-detail.tsx`
- [ ] T040 [US1] Implementar página responsiva com loading, vazio, erro, retry, foco e modo somente leitura em `src/app/(private)/dashboard/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/ihfr-diagnosis/page.tsx`
- [ ] T041 [US1] Adicionar acesso contextual ao diagnóstico sem projetá-lo no dashboard em `src/components/collections/collection-detail.tsx`

### GREEN, regressões e conclusão da US1

- [ ] T042 [US1] Executar `node --import=tsx --test tests/unit/ihfr-diagnosis-contracts.test.ts tests/unit/ihfr-diagnosis-service-read.test.ts tests/unit/ihfr-diagnosis-openapi-contract.test.ts tests/unit/ihfr-diagnosis-form-state.test.ts` e tornar a US1 GREEN
- [ ] T043 [US1] Executar `node --import=tsx --test --test-concurrency=1 tests/integration/ihfr-diagnosis-read-route.test.ts` e confirmar isolamento, inatividade, minimização e `404` uniforme
- [ ] T044 [US1] Executar regressões `tests/integration/auth-guard.test.ts`, `tests/integration/collections-route.test.ts` e `tests/integration/environmental-data-route.test.ts`
- [ ] T045 [US1] Executar `npx playwright test tests/e2e/ihfr-diagnosis-read.spec.ts --workers=1` e registrar o critério independente SC-001/SC-002/SC-003/SC-005 em `specs/006-ihfr-diagnosis/implementation-evidence.md`

**Checkpoint**: US1 é testável isoladamente com snapshots preparados, mas não constitui MVP publicável sem segurança, imutabilidade, versionamento e persistência das fases posteriores.

---

## Phase 4: User Story 2 — Calcular e tornar vigente o diagnóstico experimental (Priority: P2)

**Goal**: OWNER/ADMIN produzem, substituem, recuperam e revogam resultados imutáveis com avaliador exato, idempotência própria e concorrência transacional; MEMBER somente consulta.

**Independent Test**: conjunto `ihfr-measurement-v1`, slope presente, suplemento válido e manifesto/hash exatos geram um único `CURRENT`; replay não duplica, concorrência conflita com segurança, substituição/revogação preservam histórico e entradas insuficientes não criam diagnóstico.

### Shell e testes da US2

- [ ] T046 [US2] Criar shells compiláveis dos comandos create/replace/revoke/recover e resultados terminais em `src/app/api/server/services/ihfr-diagnosis.service.ts`
- [ ] T047 [P] [US2] Escrever testes unitários RED da canonicalização recursiva, preservação de arrays, reprodução do hash e bloqueio por estrutura/versão/hash divergentes em `tests/unit/ihfr-manifest-loader.test.ts`
- [ ] T048 [P] [US2] Escrever testes unitários RED do parser fechado do suplemento para sete categorias, aliases, caixa divergente, `OTHER`/`OTHERS`, autoria forjada, uso misto, ausência, proveniência e campos extras em `tests/unit/ihfr-diagnosis-contracts.test.ts`
- [ ] T049 [P] [US2] Escrever vetores técnicos RED para todos os mapeamentos enum/boolean, zero, `false`, opcionais `null`, funções lineares e limites/clamp em `tests/unit/ihfr-evaluator.test.ts`
- [ ] T050 [P] [US2] Escrever vetores técnicos RED para W/S/V/T, dois scores mínimos, quatro dimensões obrigatórias, pesos iguais e `INSUFFICIENT_DATA` em `tests/unit/ihfr-evaluator.test.ts`
- [ ] T051 [P] [US2] Escrever vetores técnicos RED para classes contínuas, tolerância `1e-12`, precisão interna, half-up apenas no display, qualidade HIGH em 4/5 e desempate W/S/V/T em `tests/unit/ihfr-evaluator.test.ts`
- [ ] T052 [P] [US2] Escrever teste RED da decomposição de slope acima de 45 com bruto preservado, `normalizedInput=45`, `clamped=true`, sem alteração do payload ambiental em `tests/unit/ihfr-evaluator.test.ts`
- [ ] T053 [P] [US2] Escrever testes RED de serviço para versões incompatíveis, autoria da sessão, vínculo contextual, `CollectionArea.landType` ignorado e nenhum substituto indevido de `landUseType` em `tests/unit/ihfr-diagnosis-service.test.ts`
- [ ] T054 [P] [US2] Escrever testes RED de idempotência própria, hash canônico por ação/contexto/body, replay, chave divergente e recuperação reautorizada em `tests/unit/ihfr-diagnosis-service.test.ts`
- [ ] T055 [P] [US2] Escrever preflight RED da migration aditiva, legado preservado, FKs `RESTRICT`, ponteiro único, ledger único e triggers append-only em `tests/unit/ihfr-diagnosis-migration-preflight.test.ts`
- [ ] T056 [P] [US2] Escrever testes de integração RED para cálculo, insuficiência, incompatibilidade, substituição, revogação, rollback e matriz OWNER/ADMIN/MEMBER em `tests/integration/ihfr-diagnosis-route.test.ts`
- [ ] T057 [P] [US2] Escrever testes PostgreSQL RED para duas criações/substituições concorrentes, expected current e no máximo um `CURRENT` em `tests/integration/ihfr-diagnosis-concurrency.test.ts`
- [ ] T058 [P] [US2] Escrever jornadas E2E RED de revisão de `landUseType`, confirmação, timeout/recovery, substituição e revogação em `tests/e2e/ihfr-diagnosis-management.spec.ts`
- [ ] T059 [US2] Executar T047–T058 e registrar o RED comportamental esperado por grupo em `specs/006-ihfr-diagnosis/implementation-evidence.md`

### Implementação mínima da US2

- [ ] T060 [US2] Implementar leitura server-only, validação estrutural, canonicalização e SHA-256 fail-closed do manifesto em `src/app/api/server/ihfr-diagnosis/manifest-loader.ts`
- [ ] T061 [US2] Implementar parser fechado do candidato/suplemento, predominância única e separação `INVALID_INPUT` versus `INSUFFICIENT_DATA` em `src/app/api/server/ihfr-diagnosis/ihfr-diagnosis.contracts.ts`
- [ ] T062 [US2] Implementar mapeamentos por variável e normalizações com `clamp` preservando raw/normalized/transformation/score em `src/app/api/server/ihfr-diagnosis/evaluator.ts`
- [ ] T063 [US2] Implementar componentes W/S/V/T, suficiência, pesos `0.25`, score bruto, classes contínuas e qualidade em `src/app/api/server/ihfr-diagnosis/evaluator.ts`
- [ ] T064 [US2] Implementar display half-up, drivers determinísticos, explicação sem IA e decomposição de 16 entradas em `src/app/api/server/ihfr-diagnosis/evaluator.ts`
- [ ] T065 [US2] Acrescentar enums e models aditivos `ExperimentalIHFRInputSupplement`, `ExperimentalIHFRDiagnosis`, `CurrentExperimentalIHFRDiagnosis`, `IHFRDiagnosisOperation` e `IHFRDiagnosisLifecycleEvent` em `prisma/schema.prisma`
- [ ] T066 [US2] Criar migration aditiva com índices, constraints, FKs `RESTRICT`, ponteiro único e triggers contra update/delete de suplemento, snapshot e evento em `prisma/migrations/<timestamp>_experimental_ihfr_diagnosis/migration.sql`
- [ ] T067 [US2] Implementar store Prisma, lock por coleta e transações serializáveis sem reutilizar `confirmationKey`/`payloadHash` da IMP-005 em `src/app/api/server/services/ihfr-diagnosis.service.ts`
- [ ] T068 [US2] Implementar create suficiente atômico com suplemento, snapshot, ponteiro, operação e `CREATED_CURRENT` em `src/app/api/server/services/ihfr-diagnosis.service.ts`
- [ ] T069 [US2] Implementar terminais `INSUFFICIENT_DATA`/`INCOMPATIBLE_VERSION` sem suplemento confirmado, snapshot ou ponteiro em `src/app/api/server/services/ihfr-diagnosis.service.ts`
- [ ] T070 [US2] Implementar replace com `expectedCurrentDiagnosisId`, novo snapshot/suplemento, `SUPERSEDED`, novo `CURRENT` e histórico preservado em `src/app/api/server/services/ihfr-diagnosis.service.ts`
- [ ] T071 [US2] Implementar revoke com motivo restrito, `REVOKED`, remoção do ponteiro e snapshot preservado em `src/app/api/server/services/ihfr-diagnosis.service.ts`
- [ ] T072 [US2] Implementar ledger idempotente, replay fiel, conflito por divergência, recuperação após timeout e rollback de falha técnica em `src/app/api/server/services/ihfr-diagnosis.service.ts`
- [ ] T073 [US2] Implementar POST create/replace, POST revoke e GET recovery com autorização revalidada, erros 400/403/404/409/422/500 e `no-store` em `src/app/api/server/ihfr-diagnosis/ihfr-diagnosis.http.ts`
- [ ] T074 [P] [US2] Ligar POST create/replace em `src/app/api/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/ihfr-diagnosis/diagnoses/route.ts`
- [ ] T075 [P] [US2] Ligar POST revoke em `src/app/api/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/ihfr-diagnosis/diagnoses/[diagnosisId]/revocations/route.ts`
- [ ] T076 [P] [US2] Ligar GET recovery em `src/app/api/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/ihfr-diagnosis/operations/[idempotencyKey]/route.ts`
- [ ] T077 [US2] Implementar formulário acessível de `landUseType` com sete opções exatas, proveniência, revisão e confirmação exclusiva de OWNER/ADMIN em `src/components/ihfr-diagnosis/ihfr-diagnosis-form.tsx`
- [ ] T078 [US2] Implementar controles acessíveis de replace/revoke com confirmação, motivo, expected current, loading, erro e retry em `src/components/ihfr-diagnosis/ihfr-diagnosis-actions.tsx`
- [ ] T079 [US2] Integrar formulário, resultado, insuficiência e recuperação sem anunciar sucesso antes do terminal em `src/app/(private)/dashboard/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/ihfr-diagnosis/page.tsx`

### GREEN, regressões e conclusão da US2

- [ ] T080 [US2] Executar `node --import=tsx --test tests/unit/ihfr-manifest-loader.test.ts tests/unit/ihfr-evaluator.test.ts tests/unit/ihfr-diagnosis-contracts.test.ts tests/unit/ihfr-diagnosis-service.test.ts tests/unit/ihfr-diagnosis-migration-preflight.test.ts` e tornar unitários GREEN
- [ ] T081 [US2] Executar `node --import=tsx --test --test-concurrency=1 tests/integration/ihfr-diagnosis-route.test.ts tests/integration/ihfr-diagnosis-concurrency.test.ts` com guard de banco descartável e tornar integração GREEN
- [ ] T082 [US2] Executar regressões IMP-003/004/005 em `tests/integration/auth-guard.test.ts`, `tests/integration/collections-route.test.ts`, `tests/integration/environmental-data-route.test.ts` e `tests/integration/environmental-data-concurrency.test.ts`
- [ ] T083 [US2] Executar `npx playwright test tests/e2e/ihfr-diagnosis-management.spec.ts --workers=1` e registrar SC-004/SC-006/SC-007 como critério independente em `specs/006-ihfr-diagnosis/implementation-evidence.md`

**Checkpoint**: US2 completa o fluxo operacional; promoção continua bloqueada pelos gates transversais T084–T124.

---

## Phase 5: Contratos e segurança

**Purpose**: fechar superfície HTTP, autorização, privacidade e rastreabilidade normativa após as histórias.

- [ ] T084 [P] Validar o OpenAPI completo, todos os sete endpoints, métodos, headers, status e schemas fechados contra os handlers em `tests/unit/ihfr-diagnosis-openapi-contract.test.ts`
- [ ] T085 [P] Validar o JSON Schema do suplemento, sete categorias exatas, scores declarados, `additionalProperties=false` e divergência com aliases/caixa em `tests/unit/ihfr-diagnosis-json-schema-contract.test.ts`
- [ ] T086 [P] Validar manifesto, fórmula, pesos, entradas, classes, qualidade, versão, canonicalização e hash sem reescrita automática em `tests/unit/ihfr-manifest-contract.test.ts`
- [ ] T087 Cobrir IDs UUID válidos/inválidos e isolamento cruzado de laboratório, área, coleta e diagnóstico com `404` indistinguível em `tests/integration/ihfr-diagnosis-read-route.test.ts`
- [ ] T088 Cobrir OWNER, ADMIN, MEMBER, sem vínculo, vínculo revogado, conta inativa e laboratório inativo em toda rota de escrita em `tests/integration/ihfr-diagnosis-route.test.ts`
- [ ] T089 Testar que autoria enviada pelo cliente é rejeitada e que ator real deriva da sessão em `tests/integration/ihfr-diagnosis-route.test.ts`
- [ ] T090 Testar que identidade do produtor, chave idempotente, request/payload hashes, motivo/evidência restrita e payload ambiental completo nunca aparecem no DTO em `tests/unit/ihfr-diagnosis-contracts.test.ts`
- [ ] T091 Testar que eventos de auditoria são append-only, não têm endpoint público e não alimentam `src/app/api/server/services/dashboard.service.ts` em `tests/integration/ihfr-diagnosis-route.test.ts`
- [ ] T092 Confirmar `Cache-Control: no-store` em sucesso, ausência e todos os envelopes de erro no arquivo `tests/integration/ihfr-diagnosis-route.test.ts`
- [ ] T093 Executar `npm run test:unit` e `npm run test:integration`, registrando falhas e correções estritamente relacionadas em `specs/006-ihfr-diagnosis/implementation-evidence.md`

**Security gate**: T084–T093 são bloqueantes para qualquer MVP ou PR pronto para revisão.

---

## Phase 6: Migration e persistência

**Purpose**: provar evolução aditiva, imutabilidade, concorrência real e limpeza do banco.

- [ ] T094 Executar preflight que compara models/nomes existentes e falha diante de colisão ou alteração do legado em `tests/unit/ihfr-diagnosis-migration-preflight.test.ts`
- [ ] T095 Validar `npx prisma format`, inspecionar somente o diff esperado e manter o model legado intacto em `prisma/schema.prisma`
- [ ] T096 Executar `npx prisma validate` e `npx prisma generate` sem apontar para banco não autorizado, registrando resultado em `specs/006-ihfr-diagnosis/implementation-evidence.md`
- [ ] T097 [P] Criar baseline SQL com legado IHFR e ambiental representativo, sem dados reais ou PII, em `tests/migration/ihfr-diagnosis-baseline.sql`
- [ ] T098 Implementar teste de migration em banco vazio e com baseline legado, sem backfill ou alteração de linhas existentes, em `tests/migration/ihfr-diagnosis-migration.test.ts`
- [ ] T099 Testar FKs `RESTRICT`, ponteiro único, ledger ator+chave, cadeia contextual e impossibilidade de dois `CURRENT` em `tests/migration/ihfr-diagnosis-migration.test.ts`
- [ ] T100 Testar triggers de imutabilidade para update/delete de suplemento, resultado e evento, preservando somente troca/remoção transacional do ponteiro em `tests/migration/ihfr-diagnosis-migration.test.ts`
- [ ] T101 Testar rollback ou forward fix aprovado sem objetos parciais em `tests/migration/ihfr-diagnosis-migration.test.ts`
- [ ] T102 Executar `npm run test:migration` somente após o guard confirmar PostgreSQL isolado e descartável em `tests/migration/migration-test-harness.ts`
- [ ] T103 Executar os cenários de concorrência real e falha injetada com teardown em `tests/integration/ihfr-diagnosis-concurrency.test.ts`
- [ ] T104 Contar suplementos, snapshots, ponteiros, operações e eventos antes/depois e comprovar ausência de resíduos de teste em `specs/006-ihfr-diagnosis/implementation-evidence.md`

**Database gate**: nenhuma tarefa T097–T104 autoriza uso de banco; sem confirmação explícita do ambiente descartável, registrar `NAO_EXECUTADO` e interromper somente as validações dependentes de banco.

---

## Phase 7: Validações finais

**Purpose**: executar a matriz completa e comprovar ausência de regressão, escopo indevido e alegação científica falsa.

- [ ] T105 Executar `npm run test:unit` e registrar contagem/resultado em `specs/006-ihfr-diagnosis/implementation-evidence.md`
- [ ] T106 Executar `npm run test:integration` com guard seguro e registrar contagem/resultado em `specs/006-ihfr-diagnosis/implementation-evidence.md`
- [ ] T107 Executar `npm run test:migration` com guard seguro e registrar teardown/contagens em `specs/006-ihfr-diagnosis/implementation-evidence.md`
- [ ] T108 Executar `npm run test:e2e -- --workers=1` em ambiente isolado e registrar jornadas/resultado em `specs/006-ihfr-diagnosis/implementation-evidence.md`
- [ ] T109 Executar regressões explícitas IMP-003, IMP-004 e IMP-005 pelos arquivos `tests/integration/auth-guard.test.ts`, `tests/integration/collections-route.test.ts` e `tests/integration/environmental-data-route.test.ts`
- [ ] T110 Executar caracterização IMP-007 em `tests/unit/dashboard-contracts.test.ts`, `tests/unit/dashboard-service.test.ts` e `tests/integration/dashboard-routes.test.ts`, confirmando que diagnóstico não entrou na projeção nem criou auditoria paralela, e registrar eventual projeção canônica mínima como reconciliação futura não bloqueante em `specs/006-ihfr-diagnosis/implementation-evidence.md`
- [ ] T111 Executar `npm run lint`, `npm run typecheck` e `npm run build`, registrando cada resultado separadamente em `specs/006-ihfr-diagnosis/implementation-evidence.md`
- [ ] T112 Verificar responsividade, teclado, ordem de foco, nomes acessíveis, anúncios de erro/estado e laboratório inativo em `tests/e2e/ihfr-diagnosis-read.spec.ts` e `tests/e2e/ihfr-diagnosis-management.spec.ts`
- [ ] T113 Revisar que nenhuma UI chama resultado de aceito, definitivo, universal ou cientificamente validado em `src/components/ihfr-diagnosis/ihfr-diagnosis-detail.tsx`
- [ ] T114 Executar `git diff --check` e inspecionar o diff para ausência de mudanças em `docs/raw/`, contratos IMP-005, implementação IMP-007 ou arquivos fora do recorte
- [ ] T115 Auditar cobertura FR-001–FR-018, SC-001–SC-007, US1/US2, endpoints, schemas, estados e ADR em `specs/006-ihfr-diagnosis/implementation-evidence.md`

**Engineering gate**: T105–T115 devem estar verdes ou possuir bloqueio explícito; sucesso técnico não altera G2-SCI.

---

## Phase 8: Evidências, validação científica futura e preparação do PR

**Purpose**: separar evidência executada, trabalho humano futuro e texto verificável do PR.

- [ ] T116 Registrar comandos realmente executados, commit, ambiente sanitizado, resultados, falhas, evidências reaproveitadas e não executadas em `specs/006-ihfr-diagnosis/implementation-evidence.md`
- [ ] T117 Registrar revisão humana futura do professor Fábio como `NAO_VERIFICADO`, sem automatizar aprovação, em `specs/006-ihfr-diagnosis/scientific-validation.md`
- [ ] T118 [P] Registrar revisão futura dos demais especialistas e vetores científicos de referência como `NAO_VERIFICADO` em `specs/006-ihfr-diagnosis/scientific-validation.md`
- [ ] T119 [P] Registrar avaliação humana futura das categorias/scores de `landUseType`, tetos de clamp, qualidade 4/5, APP binária, composição territorial e limiares em `specs/006-ihfr-diagnosis/scientific-validation.md`
- [ ] T120 [P] Registrar testes de campo, decisão de recalibração e análise da variante regional `0,35H + 0,30S + 0,25V + 0,10T` como futuros e inativos em `specs/006-ihfr-diagnosis/scientific-validation.md`
- [ ] T121 Explicitar em `specs/006-ihfr-diagnosis/scientific-validation.md` que T117–T120 não bloqueiam a implementação experimental rotulada, mas bloqueiam qualquer alegação científica definitiva
- [ ] T122 Atualizar `specs/006-ihfr-diagnosis/pr-description.md` com `DOC-RAW-013` e SHA-256, fórmula, versões/hash, quatro rótulos, sete categorias/scores, predominância, insuficiência, invalidade, fontes concorrentes e alternativa regional preservada
- [ ] T123 Acrescentar links relativos legíveis para ADR, manifesto, schema do suplemento, spec, plano, research, data-model, OpenAPI, quickstart e `specs/006-ihfr-diagnosis/implementation-evidence.md` em `specs/006-ihfr-diagnosis/pr-description.md`
- [ ] T124 Separar comandos executados, evidências reaproveitadas, validações humanas `NAO_VERIFICADO`, testes de campo futuros e limitações conhecidas em `specs/006-ihfr-diagnosis/pr-description.md`, sem inventar resultados
- [ ] T125 Conferir que o texto efetivamente usado no PR corresponde ao HEAD validado e ao conteúdo de `specs/006-ihfr-diagnosis/pr-description.md`
- [ ] T126 Executar `git diff --check`, conferir árvore e escopo finais e anexar o resultado à `specs/006-ihfr-diagnosis/implementation-evidence.md`

---

## Dependencies & Execution Order

### Phase dependencies

- **Phase 1** é gate absoluto; qualquer divergência interrompe tudo.
- **Phase 2** depende de Phase 1 e bloqueia as duas histórias.
- **US1 (Phase 3)** depende dos shells compartilhados e de persistência preparada por fixture; pode desenvolver leitura em paralelo com partes puras da US2, mas seu GREEN integrado depende dos models da T065/T066.
- **US2 (Phase 4)** depende de Phase 2; seus testes puros T047–T052 podem avançar em paralelo com US1. T067–T079 dependem de T060–T066.
- **Phase 5** depende da implementação das duas histórias e é gate obrigatório de segurança/contrato.
- **Phase 6** depende de T065/T066 e de autorização explícita para banco descartável.
- **Phase 7** depende das Phases 3–6 e não converte conformidade técnica em validação científica.
- **Phase 8** depende das evidências reais da Phase 7; T117–T121 são humanas/futuras e permanecem `NAO_VERIFICADO` até execução real.

### User story dependencies

- **US1 (P1)**: leitura é independentemente demonstrável com fixtures; não depende do avaliador, mas depende da projeção canônica e não pode promover legado.
- **US2 (P2)**: produção depende de manifesto/suplemento/avaliador e persistence; reutiliza a projeção pública da US1 para resposta e replay.
- **MVP experimental publicável**: requer US1 + US2 + Phases 5–7 e rotulagem/evidência da Phase 8. US1 isolada não é declarada MVP completo.

### Ordem TDD obrigatória por história

1. shell compilável;
2. testes de contrato/unidade/integração/E2E aplicáveis;
3. RED registrado;
4. implementação mínima;
5. GREEN direcionado;
6. regressões relacionadas;
7. critério independente registrado.

---

## Parallel Opportunities

- T005–T007 podem ocorrer em paralelo após os gates Git.
- T010–T018 usam arquivos distintos; T019/T020 convergem em autorização/contratos e devem ser serializados com quem tocar esses arquivos.
- Na US1, T024–T029 podem ser escritos em paralelo; T036–T038 também.
- Na US2, T047–T058 podem ser divididos por arquivos; T074–T076 também. T060–T064 devem respeitar dependência carregador → avaliador e colisões por arquivo.
- T084–T086 são paralelizáveis por contrato; T087–T092 compartilham testes de integração e devem ser coordenadas.
- T117–T120 são levantamentos humanos independentes, mas nenhum pode ser marcado aprovado por automação.

## Parallel Example: User Story 1

```text
T024 DTO/contratos       || T025 serviço de leitura
T026 OpenAPI             || T027 integração de acesso
T028 estados de UI       || T029 E2E de consulta
```

## Parallel Example: User Story 2

```text
T047 manifesto/hash      || T048 suplemento
T049–T052 avaliador      || T053–T054 serviço/idempotência
T055 migration preflight || T056–T058 integração/concorrência/E2E
```

---

## Gates e validações não automatizáveis

| Gate | Natureza | Bloqueia implementação experimental? | Bloqueia alegação científica definitiva? |
|---|---|---:|---:|
| G1 — IMP-005 integrada | gate técnico já fechado; regressões obrigatórias | Sim, se regredir | Sim |
| G2-ENG — contrato e `landUseType` | gate técnico/normativo experimental | Sim | Sim |
| G3-ENG — ciclo operacional | gate técnico de segurança/imutabilidade | Sim | Sim |
| G2-SCI — especialistas, vetores e campo | validação humana futura | Não, se os quatro rótulos permanecerem | Sim |
| Banco descartável autorizado | gate operacional por execução | Sim para validações dependentes de banco | Não substitui G2-SCI |

## Traceability Map

| Fonte/requisito | Tarefas principais |
|---|---|
| US1; FR-001, FR-002, FR-005–FR-010; SC-001–SC-003, SC-005 | T023–T045, T084, T087–T093 |
| US2; FR-003, FR-004, FR-011–FR-017; SC-004, SC-006, SC-007 | T046–T083, T086, T088–T103 |
| FR-018 e fronteira IMP-007 | T007, T091, T109, T110, T114 |
| Manifesto/hash/versões | T004, T012, T020, T047, T060, T080, T086 |
| Suplemento e sete `landUseType` | T009–T011, T048, T061, T065–T066, T085 |
| Avaliador W/S/V/T, clamp, precisão, qualidade e decomposição | T013, T017, T049–T052, T062–T064, T080 |
| Estados e ciclo imutável | T010, T025, T034, T054–T057, T065–T072, T099–T103 |
| Sete endpoints OpenAPI e segurança | T023, T026–T027, T032–T038, T056, T073–T076, T084, T087–T092 |
| G1 / G2-ENG / G2-SCI / G3-ENG | T001–T008, T115–T121 |
| Evidência e PR futuro | T116, T122–T126 |

## Implementation Strategy

1. Fechar Setup e fundamentos sem ultrapassar shells compiláveis.
2. Entregar US1 por TDD com fixture canônica, sem chamá-la de MVP completo.
3. Entregar US2 por TDD, primeiro matemática pura e depois persistência/ciclo.
4. Fechar segurança, migration PostgreSQL e regressões antes de qualquer preparação de PR.
5. Preparar evidência e descrição apenas com resultados realmente obtidos.
6. Manter G2-SCI e as tarefas T117–T121 abertos até revisão humana real; futura recalibração gera nova versão/hash e novos diagnósticos.

## Notes

- Não editar `docs/raw/**`, contratos ou implementação da IMP-005/IMP-007 para fazer a IMP-006 passar.
- Não reutilizar `confirmationKey` ou `payloadHash` ambiental como identidade da operação IHFR.
- Não arredondar antes da apresentação e não usar `displayScore` para classe ou novo cálculo.
- Não persistir suplemento candidato ausente/inválido, diagnóstico insuficiente ou sucesso parcial.
- Não criar feed, dashboard, mapa, gráfico, recomendação, Python/FastAPI, serviço externo, IA ou processo autônomo.
- Nenhum teste automatizado pode marcar revisão científica, vetor científico ou campo como aprovado.
