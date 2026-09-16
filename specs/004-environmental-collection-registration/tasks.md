# Tasks: Registro geral de coleta ambiental

**Input**: artefatos de design em `specs/004-environmental-collection-registration/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/collection-registration-api.openapi.yaml`, `quickstart.md`

**Tests**: obrigatórios e anteriores à implementação correspondente. Cada ciclo deve registrar shell compilável, RED funcional, GREEN real, regressão e validação independente em `specs/004-environmental-collection-registration/implementation-evidence.md`.

**Organization**: tarefas agrupadas por setup/gate, fundação de dados, quatro histórias priorizadas, contratos, validações e fechamento. `[P]` indica somente trabalho concorrente em arquivos distintos depois das dependências declaradas.

**Inventory**: 110 tarefas contínuas, de T001 a T110.

**Current lifecycle**: especificação, planejamento e geração de tarefas concluídos; análises e findings editoriais remediados; IMP-003 integrada e T005 comprovada em 2026-09-16. `$speckit-implement` não foi executado; a implementação está liberada para iniciar pela Phase 1 restante.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: executável em paralelo somente quando não colide em arquivo nem consome tarefa incompleta.
- **[US1]** a **[US4]**: história atendida; setup, fundação e fechamento não recebem rótulo.
- **[DB]** e **[Browser]** nas descrições identificam tarefas que exigem, respectivamente, PostgreSQL isolado permitido ou Chromium/Neon E2E autorizado; não são marcadores de formato.

---

## Phase 1: Setup, baseline seguro e gate da IMP-003

**Purpose**: registrar um ponto de partida reproduzível e impedir qualquer implementação sobre contratos ainda apenas planejados.

**⚠️ BLOCKING GATE**: T005 não pode ser concluída pela mera existência de documentos da IMP-003. Se faltar evidência executada ou houver divergência material, registrar o bloqueio e parar antes da Phase 2.

- [X] T001 Criar o ledger com seções para baseline, gate IMP-003, arquivos previstos, RED/GREEN, migration, segurança, validações, métricas humanas, bloqueios e estado final em `specs/004-environmental-collection-registration/implementation-evidence.md`
- [X] T002 Registrar branch, HEAD, upstream, divergência, worktrees, status inicial e inventário dos caminhos previstos sem copiar valores de ambiente em `specs/004-environmental-collection-registration/implementation-evidence.md`
- [X] T003 Registrar versões efetivas de Node/npm, dependências, lockfile, scripts, Prisma, PostgreSQL/Neon e Playwright sem instalar ou atualizar pacotes em `specs/004-environmental-collection-registration/implementation-evidence.md`
- [X] T004 Confirmar por `package.json`, `package-lock.json` e APIs nativas que nenhuma nova dependência de produção ou desenvolvimento é necessária; registrar qualquer divergência como bloqueio e proibir `npm audit fix`, especialmente `--force`, em `specs/004-environmental-collection-registration/implementation-evidence.md`
- [X] T005 Comprovar no código integrado, migrations e resultados reais do T111 da IMP-003: `area.id` estável, relação área–laboratório, rotas contextuais, `authorizeLaboratoryAccess` testado, `OWNER`/`ADMIN`/`MEMBER`, `CREATE_COLLECTION`, ativo para mutação, leitura de inativo, autoria pelo principal, DTO mínimo de área e regressões IMP-001/002; se houver divergência funcional de intenção, comportamento externo, permissão, escopo, requisito ou critério, interromper e retornar ao fluxo de especificação/clarificação/planejamento/tarefas; se a divergência for somente técnica, revisar coordenadamente os artefatos técnicos e tarefas afetados; em ambos os casos revisar `spec.md`, checklist, `plan.md`, `research.md`, `data-model.md`, OpenAPI, `quickstart.md` e `tasks.md`, atualizar apenas o que for afetado e registrar o bloqueio em `specs/004-environmental-collection-registration/implementation-evidence.md`, sem alterar silenciosamente contrato funcional
- [X] T006 Após T005, inspecionar o `prisma/schema.prisma`, histórico em `prisma/migrations/`, guard em `src/app/api/server/areas/area.authorization.ts`, serviços/adapters/DTOs de área e registrar a paridade efetivamente integrada em `specs/004-environmental-collection-registration/implementation-evidence.md`
- [X] T007 Auditar o guard fail-closed, recurso Neon dedicado, `playwright.config.ts`, `tests/fixtures/auth-users.ts`, `tests/fixtures/laboratories.ts`, fixtures IMP-003 e allowlists; provar recusa anterior à conexão quando ambiente não for teste, URLs coincidirem ou confirmação falhar, sem imprimir secrets/URLs, em `specs/004-environmental-collection-registration/implementation-evidence.md`
- [X] T008 Reconciliar migrations versionadas/aplicadas em modo somente leitura e registrar preflight, backup/snapshot/PITR, forward-fix e rollback como estratégia de recuperação; distinguir requisitos do desenvolvimento isolado dos gates futuros de deploy em `specs/004-environmental-collection-registration/implementation-evidence.md`

**Checkpoint**: baseline e segurança registrados, T111 comprovado por implementação/testes e nenhuma credencial exposta.

---

## Phase 2: Fundamentos — migration, integridade, fixtures e contrato-base

**Purpose**: provar o modelo compartilhado em PostgreSQL isolado antes de qualquer história consumi-lo.

**⚠️ BLOCKING**: nenhuma história começa antes de T009–T031 concluírem com Prisma Client atualizado, migration validada e banco descartável limpo.

- [X] T009 Confirmar e reutilizar o script isolado `test:migration` integrado pela IMP-003, ajustando-o somente se estiver ausente ou incompatível e sem alterar versões ou scripts alheios, em `package.json`
- [X] T010 Reutilizar o harness PostgreSQL da IMP-003 e criar apenas a adaptação mínima para IMP-004, com guard anterior à conexão, transação, restore e teardown garantido, em `tests/migration/migration-test-harness.ts`
- [X] T011 Criar shell compilável do preflight que retorna `NOT_IMPLEMENTED`, sem consultar banco nem importar Prisma Client desatualizado, em `scripts/imp-004-migration-preflight.ts`
- [X] T012 [P] Escrever testes do preflight para drift, órfãos, área sem laboratório derivável, relação divergente, contagens sanitizadas e abort anterior a writes em `tests/unit/collection-migration-preflight.test.ts`
- [X] T013 [P] Escrever testes PostgreSQL da migration para base vazia/legada, `CollectionData` aditiva, ID opaco preservado, laboratório/área/autor, `timestamptz(3)`, offset, confirmação sem default, chave idempotente, tupla todos-nulos/todos-presentes, backfill determinístico, FK composta, índices, checks, unicidade, triggers de update/delete, rollback e filhos científicos intactos em `tests/migration/collection-registration-migration.test.ts`
- [X] T014 Executar T012 e T013 separadamente e registrar RED pela ausência funcional do preflight/DDL; falha de import, Prisma Client, pacote, configuração, banco ou infraestrutura não conta como RED em `specs/004-environmental-collection-registration/implementation-evidence.md`
- [X] T015 Implementar preflight bloqueante, somente diagnóstico, sem autocorreção e sem imprimir conteúdo, IDs ou URLs sensíveis, em `scripts/imp-004-migration-preflight.ts`
- [X] T016 Evoluir aditivamente `CollectionData` e relações inversas com `laboratoryRoomId`, `occurredAt`, `occurrenceOffset`, `confirmedAt` sem default e `confirmationKey`, preservando `observations` e filhos científicos sem novos campos de medição, em `prisma/schema.prisma`
- [X] T017 Criar migration transacional expand-first com backfill exclusivo de laboratório derivável da área, abort para registros não deriváveis, FK composta `CollectionData(collectionAreaId,laboratoryRoomId)` → `CollectionArea(id,laboratoryRoomId)`, `RESTRICT`, tupla completa, offset canônico, índices, unicidade `(userId,confirmationKey)` e trigger de imutabilidade para linhas confirmadas em `prisma/migrations/20260915000100_collection_registration_metadata/migration.sql`
- [X] T018 Incluir exclusivamente a migration da IMP-004 na allowlist, preservando migrations anteriores e todas as demais regras, em `.gitignore`
- [X] T019 Executar `npx prisma format`, revisar somente a formatação esperada de `prisma/schema.prisma` e registrar o resultado em `specs/004-environmental-collection-registration/implementation-evidence.md`
- [X] T020 Executar `npx prisma validate` com configuração segura, sem revelar URLs, e registrar o resultado separado em `specs/004-environmental-collection-registration/implementation-evidence.md`
- [X] T021 Executar `npx prisma generate` somente após T019–T020, verificar que apenas artefatos gerados ignorados mudaram e registrar o resultado em `specs/004-environmental-collection-registration/implementation-evidence.md`
- [X] T022 [DB] Executar o preflight e `tests/unit/collection-migration-preflight.test.ts` até GREEN, depois executar `tests/migration/collection-registration-migration.test.ts` em PostgreSQL isolado até GREEN, registrando cada comando, causa e contagens sem valores sensíveis em `specs/004-environmental-collection-registration/implementation-evidence.md`
- [X] T023 [DB] Ensaiar falha transacional, restauração/forward-fix e rollback de aplicação; provar ausência de remoção ou reclassificação de `WaterData`, `SoilData`, `VegetationData`, `TerrainData` e `IHFRDiagnosis` em `tests/migration/collection-registration-migration.test.ts` e registrar em `specs/004-environmental-collection-registration/implementation-evidence.md`
- [X] T024 Criar shell compilável e fail-closed da fixture de coleta, compondo os guards/fixtures integrados sem conexão nem write, em `tests/fixtures/collections.ts`
- [X] T025 [P] Escrever testes da fixture para variáveis ausentes, URLs inválidas/iguais, confirmação incorreta, IDs/prefixos fora da allowlist, ordem de FKs, setup precedido de cleanup e teardown após falha em `tests/unit/collection-fixture-guard.test.ts`
- [X] T026 [P] Criar teste estrutural inicial para OpenAPI 3.1, duas operações exatas, refs locais, `operationId` únicos, exemplos, erros tipados, `no-store`, idempotência, tempo, schemas fechados, `Location` como URI canônica da API distinta da rota de interface, `400 INVALID_REQUEST` restrito a chave ausente/malformada/fora do perfil UUID, `409 CONFLICT` para chave já usada com tupla divergente e ausência de campos científicos/privilegiados em `tests/unit/collection-openapi-contract.test.ts`
- [X] T027 Executar T025 isoladamente e registrar RED funcional da fixture ainda ausente; executar T026 como baseline contratual e registrar seu resultado sem fabricar RED quando o artefato documental já estiver conforme em `specs/004-environmental-collection-registration/implementation-evidence.md`
- [X] T028 Implementar setup, transições de vínculo/estado, coletas determinísticas, concorrência e cleanup seletivo na ordem das FKs usando somente IDs/prefixos allowlisted em `tests/fixtures/collections.ts`
- [X] T029 Reexecutar `tests/unit/collection-fixture-guard.test.ts` até GREEN e registrar separadamente o resultado em `specs/004-environmental-collection-registration/implementation-evidence.md`
- [X] T030 [DB] Executar setup/teardown da fixture no banco isolado, inclusive após falha induzida, e confirmar zero registros allowlisted e nenhuma relação órfã em `tests/fixtures/collections.ts` e `specs/004-environmental-collection-registration/implementation-evidence.md`
- [X] T031 Revisar o diff de `package.json`, `prisma/schema.prisma`, `.gitignore`, `scripts/imp-004-migration-preflight.ts`, `prisma/migrations/20260915000100_collection_registration_metadata/migration.sql`, `tests/migration/` e fixtures, confirmando que gerar SQL não foi tratado como conclusão da migration, em `specs/004-environmental-collection-registration/implementation-evidence.md`

**Checkpoint**: modelo aditivo comprovado em PostgreSQL isolado, contrato-base conhecido e fixtures seguras sem resíduos.

---

## Phase 3: User Story 1 — Iniciar coleta na área correta (Priority: P1) 🎯 MVP de navegação

**Goal**: iniciar uma tentativa volátil somente a partir do laboratório e da área explicitamente autorizados, exibindo o contexto correto sem persistir.

**Independent Test**: com uma pessoa vinculada a dois laboratórios, abrir a nova coleta em cada área e tentar IDs cruzados/inexistentes e laboratório inativo; o contexto correto aparece, acessos indevidos são uniformes e nenhuma coleta é criada.

### Tests for User Story 1 — escrever antes da implementação

- [X] T032 [US1] Criar shells compiláveis com estado `NOT_IMPLEMENTED` para tipos, estado do formulário, formulário e página contextual em `src/types/collection.type.ts`, `src/components/collections/collection-form-state.ts`, `src/components/collections/collection-form.tsx` e `src/app/(private)/dashboard/laboratories/[laboratoryId]/areas/[areaId]/collections/new/page.tsx`
- [X] T033 [P] [US1] Escrever testes de estado para laboratório/área explícitos e não editáveis, troca de contexto invalidando revisão, ausência de rascunho/storage/write e preservação da tentativa em `tests/unit/collection-form-state.test.ts`
- [X] T034 [P] [US1] Escrever cenários de navegador para entrada pelo detalhe da área, `OWNER`/`ADMIN`/`MEMBER`, dois laboratórios, URL contextual, IDs cruzados/inexistentes, vínculo ausente/revogado, conta inelegível e laboratório inativo sem ação mutável em `tests/e2e/collection-registration.spec.ts`
- [X] T035 [US1] Executar T033 e o subconjunto US1 de T034 separadamente, registrar RED pela ausência comportamental esperada e rejeitar falha de import, browser, banco, pacote ou infraestrutura como RED válido em `specs/004-environmental-collection-registration/implementation-evidence.md`

### Implementation for User Story 1

- [X] T036 [P] [US1] Definir tipos fechados do contexto e tentativa volátil sem autoria, confirmação, medição ou campo de área editável em `src/types/collection.type.ts`
- [X] T037 [P] [US1] Implementar estado inicial e transições de contexto em memória, sem `localStorage`, `sessionStorage` ou request, em `src/components/collections/collection-form-state.ts`
- [X] T038 [US1] Implementar formulário acessível que apresenta laboratório e área como referências não editáveis e mantém o primeiro write indisponível nesta etapa em `src/components/collections/collection-form.tsx`
- [X] T039 [US1] Proteger acesso direto e renderizar a página com contexto obtido/revalidado pelos contratos integrados da IMP-003, sem duplicar `authorizeLaboratoryAccess`, em `src/app/(private)/dashboard/laboratories/[laboratoryId]/areas/[areaId]/collections/new/page.tsx`
- [X] T040 [US1] Expor “Registrar coleta” no detalhe da área apenas quando a decisão contextual integrada permitir `CREATE_COLLECTION`, sem guardar autorização no cliente, em `src/app/(private)/dashboard/laboratories/[laboratoryId]/areas/[areaId]/page.tsx`
- [X] T041 [US1] Reexecutar `tests/unit/collection-form-state.test.ts` até GREEN e executar regressão dos testes de contexto/área da IMP-003, registrando resultados reais em `specs/004-environmental-collection-registration/implementation-evidence.md`
- [X] T042 [US1] [Browser] Executar uma tentativa limitada do subconjunto US1 em `tests/e2e/collection-registration.spec.ts`, garantir teardown e registrar GREEN ou bloqueio de infraestrutura distinto de falha funcional em `specs/004-environmental-collection-registration/implementation-evidence.md`

**Checkpoint**: US1 inicia a jornada no contexto correto e continua sem qualquer persistência.

---

## Phase 4: User Story 2 — Informar e validar o momento da coleta (Priority: P2)

**Goal**: preparar um instante de ocorrência RFC 3339 inequívoco, preservando offset e valores corrigíveis, sem confundi-lo com confirmação.

**Independent Test**: exercitar ocorrências válidas, ausentes, impossíveis, futuras e malformadas; somente valores com offset explícito e até milissegundos avançam para revisão, sem write.

### Tests for User Story 2 — escrever antes da implementação

- [X] T043 [US2] Criar shell compilável de contratos com parser/serializer retornando falha `NOT_IMPLEMENTED` e relógio injetável em `src/app/api/server/collections/collection.contracts.ts`
- [X] T044 [P] [US2] Escrever testes para body fechado `{ occurredAt }`, RFC 3339, `Z`/offset numérico, data impossível, ausência de offset, `-00:00`, segundo `60`, offset fora de `-14:00`–`+14:00`, fração acima de três dígitos, igualdade ao relógio, futuro, UTC normalizado e offset original preservado em `tests/unit/collection-contracts.test.ts`
- [X] T045 [P] [US2] Acrescentar testes de formulário para erros compreensíveis por data/horário/fuso, preservação dos demais valores, alteração que invalida revisão e nenhuma correção/arredondamento/truncamento silencioso em `tests/unit/collection-form-state.test.ts`
- [X] T046 [P] [US2] Acrescentar cenários temporais do formulário, teclado, foco e persistência zero ao subconjunto US2 em `tests/e2e/collection-registration.spec.ts`
- [X] T047 [US2] Executar T044–T046 por arquivo/camada e registrar cada RED funcional; import quebrado, client desatualizado, browser indisponível, banco incorreto ou infraestrutura externa não conta como RED em `specs/004-environmental-collection-registration/implementation-evidence.md`

### Implementation for User Story 2

- [X] T048 [US2] Implementar parser allowlisted e valor temporal canônico com validação civil explícita, normalização UTC, offset separado e relógio injetável em `src/app/api/server/collections/collection.contracts.ts`
- [X] T049 [US2] Completar tipos de entrada, erro e projeção temporal sem identificador IANA nem horário desconhecido/impreciso em `src/types/collection.type.ts`
- [X] T050 [US2] Implementar transições de edição/validação/revisão temporal em memória, preservando entradas recuperáveis em `src/components/collections/collection-form-state.ts`
- [X] T051 [US2] Implementar controles e mensagens acessíveis da ocorrência com fuso explícito, sem depender do fuso do browser como autoridade, em `src/components/collections/collection-form.tsx`
- [X] T052 [US2] Reexecutar `tests/unit/collection-contracts.test.ts` e `tests/unit/collection-form-state.test.ts` separadamente até GREEN e registrar regressão US1 em `specs/004-environmental-collection-registration/implementation-evidence.md`
- [X] T053 [US2] [Browser] Executar o subconjunto US2 de `tests/e2e/collection-registration.spec.ts`, confirmar nenhum POST e teardown garantido, registrando resultado independente em `specs/004-environmental-collection-registration/implementation-evidence.md`

**Checkpoint**: US2 produz uma ocorrência revisável e inequívoca sem persistir nem introduzir IANA.

---

## Phase 5: User Story 3 — Revisar e confirmar o registro (Priority: P3)

**Goal**: revisar em memória e confirmar atomicamente uma única coleta com contexto/autoria atuais, retry seguro e imutabilidade no banco.

**Independent Test**: revisar uma tentativa válida, voltar/corrigir, confirmar, repetir após duplo clique/timeout/concorrência e alterar acesso antes do submit; no máximo um registro integral resulta e a chave divergente conflita.

### Tests for User Story 3 — escrever antes da implementação

- [X] T054 [US3] Criar shells compiláveis e injetáveis que retornam `NOT_IMPLEMENTED` para serviço, factory POST e revisão em `src/app/api/server/services/collections.service.ts`, `src/app/api/laboratories/[laboratoryId]/areas/[areaId]/collections/route.ts` e `src/components/collections/collection-review.tsx`
- [X] T055 [P] [US3] Escrever testes do serviço para `OWNER`/`ADMIN`/`MEMBER`, papel sem `CREATE_COLLECTION` quando aplicável, inativo, vínculo ausente/revogado, conta inelegível, laboratório/área inexistente ou cruzado, ordem principal→laboratório→papel/estado→permissão→área, autoria/confirmado server-side, chave inédita aceita, replay da mesma chave/autor/contexto/payload normalizado, conflito entre contextos ou payloads e isolamento entre autores, atomicidade, clock e erro sanitizado em `tests/unit/collections-service.test.ts`
- [X] T056 [P] [US3] Escrever testes do POST para autenticação, params contextuais, body/header fechados, chave idempotente ausente/malformada/fora do perfil em `400 INVALID_REQUEST`, chave UUID inédita aceita, chave usada com tupla divergente em `409 CONFLICT`, falsificação de laboratório/área/autor/ID/`confirmedAt`, `201/200/400/401/403/404/409/500`, `Location` contendo a URI canônica da API, envelopes exatos e `no-store` em `tests/integration/collections-route.test.ts`
- [X] T057 [P] [US3] Acrescentar testes de estado para revisão sem efeito externo, voltar/corrigir, confirmação explícita, single-flight, chave UUID estável em retry/timeout e chave nova somente para outra coleta intencional em `tests/unit/collection-form-state.test.ts`
- [X] T058 [P] [US3] Acrescentar cenários de revisão com indicação acessível de autoria derivada da sessão sem `userId`, email, papel global ou controle editável, nenhum POST prévio, sucesso, erro, perda de acesso, duplo clique, timeout/replay e submissões concorrentes ao subconjunto US3 em `tests/e2e/collection-registration.spec.ts`
- [X] T059 [US3] Executar T055–T058 separadamente e registrar RED pela ausência funcional esperada, nunca por import, Prisma, dependência, browser, banco ou infraestrutura, em `specs/004-environmental-collection-registration/implementation-evidence.md`

### Implementation for User Story 3

- [X] T060 [US3] Completar parser fechado de `Idempotency-Key`, aceitando UUID válido inédito e retornando `400 INVALID_REQUEST` somente para chave ausente, malformada ou fora do perfil; manter `409 CONFLICT` para chave já usada com contexto/payload divergente e implementar mensagens e serializers de sucesso/erro sem aceitar autor, ID, laboratório, área ou `confirmedAt` no body em `src/app/api/server/collections/collection.contracts.ts`
- [X] T061 [US3] Implementar port/adapter Prisma e criação serializável que chama `authorizeLaboratoryAccess(principal, laboratoryId, "CREATE_COLLECTION", tx, true)`, revalida a área por `{ id, laboratoryId }` na mesma transação, gera ID/autoria/`confirmedAt`, persiste UTC+offset e converge `(userId,confirmationKey)` com retry limitado em `src/app/api/server/services/collections.service.ts`
- [X] T062 [US3] Implementar replay idêntico como `200` sem write, conflito de rota/ocorrência/offset como `409`, duas chaves distintas como duas coletas e reautorização antes de replay em `src/app/api/server/services/collections.service.ts`
- [X] T063 [US3] Implementar somente o POST autenticado com factory/DI, `Location`, `no-store`, allowlists, respostas tipadas e `500 INTERNAL_ERROR` sanitizado em `src/app/api/laboratories/[laboratoryId]/areas/[areaId]/collections/route.ts`
- [X] T064 [P] [US3] Implementar revisão acessível distinguindo ocorrência informada de laboratório/área derivados, exibindo “Será registrada por você” ou indicação equivalente de autoria derivada da sessão sem `userId`, email, papel global ou controle editável, e separando essa autoria prevista de ID/confirmação ainda não gerados, sem persistência em `src/components/collections/collection-review.tsx`
- [X] T065 [US3] Integrar edição↔revisão, confirmação single-flight e retry com a mesma chave sem `localStorage`/rascunho em `src/components/collections/collection-form-state.ts` e `src/components/collections/collection-form.tsx`
- [X] T066 [US3] Integrar o POST somente após confirmação; validar separadamente o `Location` como URI canônica da API e, depois de sucesso integral, construir a rota de interface `/dashboard/laboratories/{laboratoryId}/areas/{areaId}/collections/{collectionId}` exclusivamente com contexto já validado e `collection.id` do body tipado, sem abrir ou converter texto arbitrário do header, em `src/app/(private)/dashboard/laboratories/[laboratoryId]/areas/[areaId]/collections/new/page.tsx`
- [X] T067 [US3] Reexecutar `tests/unit/collections-service.test.ts`, `tests/unit/collection-contracts.test.ts` e `tests/unit/collection-form-state.test.ts` separadamente até GREEN em `specs/004-environmental-collection-registration/implementation-evidence.md`
- [X] T068 [US3] Reexecutar os cenários POST de `tests/integration/collections-route.test.ts` até GREEN e registrar paridade com `createEnvironmentalCollection` em `specs/004-environmental-collection-registration/implementation-evidence.md`
- [X] T069 [US3] [DB] Reexecutar concorrência, unicidade, atomicidade e triggers de update/delete em PostgreSQL isolado, provar um único registro e rollback sem parcial em `tests/migration/collection-registration-migration.test.ts` e registrar contagens em `specs/004-environmental-collection-registration/implementation-evidence.md`
- [X] T070 [US3] [Browser] Executar uma tentativa limitada do subconjunto US3 em `tests/e2e/collection-registration.spec.ts`, garantir teardown após sucesso/falha e registrar GREEN ou bloqueio externo sem repetição indefinida em `specs/004-environmental-collection-registration/implementation-evidence.md`

**Checkpoint**: US3 confirma exatamente uma coleta íntegra e imutável; frontend não é a garantia exclusiva contra duplicação.

---

## Phase 6: User Story 4 — Consultar a coleta confirmada (Priority: P4)

**Goal**: consultar o detalhe imutável no mesmo laboratório e área, inclusive em laboratório inativo, sem autoria, privilégios ou ciência.

**Independent Test**: consultar a coleta como cada papel em laboratório ativo/inativo e repetir com vínculo revogado, IDs inexistentes e outro contexto; somente membros atuais veem o DTO mínimo correto.

### Tests for User Story 4 — escrever antes da implementação

- [X] T071 [US4] Criar shells compiláveis de factory GET, detalhe e página que retornam estado `NOT_IMPLEMENTED` em `src/app/api/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/route.ts`, `src/components/collections/collection-detail.tsx` e `src/app/(private)/dashboard/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/page.tsx`
- [X] T072 [P] [US4] Acrescentar testes do serviço para consulta por `OWNER`/`ADMIN`/`MEMBER`, laboratório inativo, vínculo revogado, conta inelegível, laboratório/área/coleta inexistente ou cruzado, filtro triplo, ordem de autorização e `readOnly` em `tests/unit/collections-service.test.ts`
- [X] T073 [P] [US4] Acrescentar testes do GET para params, principal exclusivo, `200/401/404/500`, `no-store`, respostas externas uniformes e DTO fechado em `tests/integration/collections-route.test.ts`
- [X] T074 [P] [US4] Acrescentar cenários de detalhe para papéis, inativo, isolamento, loading, erro, reload, ocorrência com offset, confirmação UTC, identificadores opacos e ausência de autoria/segredos/observações/ciência ao subconjunto US4 em `tests/e2e/collection-registration.spec.ts`
- [X] T075 [US4] Executar T072–T074 separadamente e registrar RED pela consulta ausente, rejeitando import, browser, banco ou infraestrutura como RED válido em `specs/004-environmental-collection-registration/implementation-evidence.md`

### Implementation for User Story 4

- [X] T076 [US4] Implementar consulta no port/adapter por `(collectionId,collectionAreaId,laboratoryRoomId)` e tupla confirmada, reutilizando autorização contextual de leitura e sem método de update/delete, em `src/app/api/server/services/collections.service.ts`
- [X] T077 [US4] Implementar serializer campo a campo que reconstrói `occurredAt` no offset persistido, serializa `confirmedAt` em UTC e exclui autoria, vínculo, chave, timestamps técnicos, observações e relações científicas em `src/app/api/server/collections/collection.contracts.ts`
- [X] T078 [US4] Implementar somente o GET autenticado com factory/DI, filtro contextual, `no-store`, `404` uniforme e `500` sanitizado em `src/app/api/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/route.ts`
- [X] T079 [P] [US4] Implementar detalhe acessível com ID, área/laboratório mínimos, “Ocorrência em campo”, “Confirmação no sistema” e indicação somente leitura, sem edição/exclusão/lista, em `src/components/collections/collection-detail.tsx`
- [X] T080 [US4] Implementar página responsiva com loading/erro/retry e consulta independente de estado anterior do formulário em `src/app/(private)/dashboard/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/page.tsx`
- [X] T081 [US4] Reexecutar testes US4 de `tests/unit/collections-service.test.ts` e `tests/integration/collections-route.test.ts` separadamente até GREEN e registrar paridade com `getEnvironmentalCollection` em `specs/004-environmental-collection-registration/implementation-evidence.md`
- [X] T082 [US4] [Browser] Executar o subconjunto US4 em `tests/e2e/collection-registration.spec.ts` com teardown garantido e registrar GREEN ou bloqueio externo classificado em `specs/004-environmental-collection-registration/implementation-evidence.md`
- [X] T083 [US4] [Browser] Verificar detalhe por teclado/foco e viewports móvel, intermediária e ampla, incluindo estados loading/erro, inativo somente leitura e ausência de mutações/listagem, em `specs/004-environmental-collection-registration/implementation-evidence.md`
- [X] T084 [US4] [Browser] Executar o fluxo independente P1→P4 com duas áreas de dois laboratórios, validar o `Location` da API e reencontrar cada coleta pela rota de interface construída separadamente com contexto e `collection.id`, registrando ausência de navegação direta pelo header e de dependência de `/dashboard/collects` em `specs/004-environmental-collection-registration/implementation-evidence.md`

**Checkpoint**: US4 fecha o incremento vertical com detalhe contextual, mínimo e imutável.

---

## Phase 7: Contratos, regressão e sincronização

**Purpose**: provar que OpenAPI, handlers, testes e contratos herdados permanecem coerentes.

- [ ] T085 Acrescentar ao teste OpenAPI a paridade de status, headers, envelopes, exemplos e DTOs observados nos handlers POST/GET, validando separadamente `Location` como URI canônica da API e a rota de interface construída do contexto mais `collection.id`, sem aceitar `PATCH`, `DELETE`, listagem ou rascunho, em `tests/unit/collection-openapi-contract.test.ts`
- [ ] T086 Executar T085 isoladamente, registrar qualquer divergência por asserção contratual e não aceitar parser/import/configuração como falha funcional em `specs/004-environmental-collection-registration/implementation-evidence.md`
- [ ] T087 Reconciliar somente divergências técnicas entre OpenAPI, handlers, testes e quickstart que preservem integralmente a intenção funcional; diante de mudança em comportamento externo, permissão, escopo, requisito ou critério, interromper a implementação e retornar ao fluxo de especificação/clarificação/planejamento/tarefas, revisando coordenadamente `spec.md`, checklist, `plan.md`, `research.md`, `data-model.md`, OpenAPI, `quickstart.md` e `tasks.md`, sem autorizar mudança contratual funcional silenciosa
- [ ] T088 Reexecutar `tests/unit/collection-openapi-contract.test.ts` até GREEN e registrar OpenAPI 3.1, duas operações, refs, `operationId`, schemas fechados, exemplos, erros, `no-store`, idempotência e tempo em `specs/004-environmental-collection-registration/implementation-evidence.md`
- [ ] T089 [P] Acrescentar regressões direcionadas de autenticação/conta elegível e DTO público sem ampliação da IMP-001 em `tests/unit/auth-contracts.test.ts` e `tests/integration/auth-me.test.ts`
- [ ] T090 [P] Acrescentar regressões direcionadas de laboratório/vínculo/inatividade/criação/exclusão administrativa sem ampliação da IMP-002 em `tests/unit/laboratories-service.test.ts` e `tests/integration/laboratory-settings-route.test.ts`
- [ ] T091 [P] Acrescentar regressões direcionadas de papéis, guard, contexto, áreas e leitura em laboratório inativo sem duplicar infraestrutura da IMP-003 em `tests/unit/area-authorization.test.ts`, `tests/unit/areas-service.test.ts` e `tests/integration/areas-route.test.ts`
- [ ] T092 Executar T089–T091 separadamente antes e depois da integração final e registrar resultados reais e qualquer regressão bloqueante em `specs/004-environmental-collection-registration/implementation-evidence.md`
- [ ] T093 Verificar automaticamente que o contrato e os handlers expõem somente POST de coleção e GET de detalhe, sem campos de água/solo/vegetação/terreno/IHFR, autoria, chave ou dados privilegiados, em `tests/unit/collection-openapi-contract.test.ts`

**Checkpoint**: contratos da IMP-004 e regressões IMP-001/002/003 sincronizados sem ampliar escopo.

---

## Phase 8: Validações automatizadas e segurança final

**Purpose**: executar gates diagnosticáveis separadamente, limpar recursos e não transformar falha em aprovação.

- [ ] T094 Reexecutar `npx prisma format`, revisar o diff esperado e registrar resultado independente em `specs/004-environmental-collection-registration/implementation-evidence.md`
- [ ] T095 Reexecutar `npx prisma validate` com ambiente seguro e sem imprimir URLs em `specs/004-environmental-collection-registration/implementation-evidence.md`
- [ ] T096 Reexecutar `npx prisma generate`, verificar somente artefatos ignorados/esperados e registrar em `specs/004-environmental-collection-registration/implementation-evidence.md`
- [ ] T097 [DB] Executar `npm run test:migration`, exigir invariantes, recovery, rollback e teardown, e registrar contagens reais em `specs/004-environmental-collection-registration/implementation-evidence.md`
- [ ] T098 Executar isoladamente `tests/unit/collection-openapi-contract.test.ts` e registrar a validação OpenAPI/contrato em `specs/004-environmental-collection-registration/implementation-evidence.md`
- [ ] T099 Executar `npm run test:unit` e registrar quantidade/resultado reais sem antecipar aprovação em `specs/004-environmental-collection-registration/implementation-evidence.md`
- [ ] T100 [DB] Executar `npm run test:integration` serialmente com banco isolado e registrar quantidade/resultado reais em `specs/004-environmental-collection-registration/implementation-evidence.md`
- [ ] T101 Executar `npm run lint`, exigir zero erros e comparar warnings com a baseline de T003 em `specs/004-environmental-collection-registration/implementation-evidence.md`
- [ ] T102 Executar `npm run typecheck` e registrar resultado independente em `specs/004-environmental-collection-registration/implementation-evidence.md`
- [ ] T103 Executar `npm run build` e registrar resultado independente em `specs/004-environmental-collection-registration/implementation-evidence.md`
- [ ] T104 [Browser] Executar uma tentativa limitada de `tests/e2e/collection-registration.spec.ts` em Chromium serial e no único Neon E2E dedicado/permitido, com guard e fixtures allowlisted; diferenciar falha funcional de infraestrutura em `specs/004-environmental-collection-registration/implementation-evidence.md`
- [ ] T105 [DB] Executar teardown obrigatório em `finally` após sucesso ou falha de T104, na ordem das FKs e restrito às allowlists de `tests/fixtures/collections.ts`, registrando resultado em `specs/004-environmental-collection-registration/implementation-evidence.md`
- [ ] T106 [DB] Confirmar contagens finais zero, ausência de órfãos e nenhuma alteração fora dos IDs/prefixos permitidos em `specs/004-environmental-collection-registration/implementation-evidence.md`

**Checkpoint**: cada gate possui resultado próprio; banco e navegador não deixam estado residual.

---

## Phase 9: Documentação, escopo e fechamento

**Purpose**: consolidar evidências observadas, validações realmente executadas, revisão do escopo, inspeção do diff, estado Git observado e pendências, preparando a entrega para revisão e PR quando externamente autorizados.

- [ ] T107 Atualizar comandos, pré-condições, resultados reais, recovery e divergências coordenadamente em `specs/004-environmental-collection-registration/quickstart.md`, `specs/004-environmental-collection-registration/contracts/collection-registration-api.openapi.yaml` e `specs/004-environmental-collection-registration/implementation-evidence.md`; manter SC-002/SC-007 e qualquer métrica humana como `NAO_VERIFICADO` até avaliação representativa, sem tratar automação como substituta ou a pendência como bloqueio automático de implementação, PR ou merge
- [ ] T108 Executar `git diff --check`, inspecionar arquivos gerados/ignorados e o diff completo; verificar secrets, ausência de `npm audit fix`, nenhuma dependência incidental, nenhum arquivo `docs/raw/**`/Code-First e nenhum modelo/campo/endpoint para medições, IHFR, rascunho, retomada, edição, exclusão, listagem, histórico, mapas, IANA ou horário impreciso em `specs/004-environmental-collection-registration/implementation-evidence.md`
- [ ] T109 Reconciliar checkboxes e evidências contra FR-001–FR-032, SC-001–SC-008, quatro testes independentes, dois `operationId`, gates Prisma, migration real, teardown e bloqueios; registrar arquivos afetados, diff, estado Git observado, escopo, validações realmente executadas e pendências em `specs/004-environmental-collection-registration/tasks.md` e `specs/004-environmental-collection-registration/implementation-evidence.md`, reconhecendo a análise documental como gate anterior e sem exigir árvore limpa, commit, push, PR ou nova análise dentro da implementação
- [ ] T110 Registrar para a equipe de produto/pesquisa do HidroFlorestas a avaliação futura de SC-002 e SC-007 após existir incremento executável em ambiente adequado, com participantes representativos, método e métricas dos critérios, mantendo ambos `NAO_VERIFICADO` até resultados reais e incorporando-os posteriormente à documentação/evidência sem substituir a avaliação por automação nem bloquear automaticamente implementação, PR ou merge

---

## Dependencies & Execution Order

### Phase dependencies

```text
Phase 1 (T001–T008; T005 = gate T111 real)
  └─> Phase 2 (T009–T031) [BLOCKING: migration/Prisma/fixtures]
        └─> US1 (T032–T042) [contexto de início]
              └─> US2 (T043–T053) [tempo]
                    └─> US3 (T054–T070) [revisão/confirmação]
                          └─> US4 (T071–T084) [detalhe]
                                └─> Contratos/regressão (T085–T093)
                                      └─> Validações (T094–T106)
                                            └─> Fechamento (T107–T110)
```

### User story dependencies

- **US1 (P1)**: depende do gate IMP-003 e da fundação; inicia contexto sem persistência.
- **US2 (P2)**: depende de US1 para manter a tentativa contextual; sua validação temporal continua independentemente testável e sem write.
- **US3 (P3)**: depende de US1/US2 e da migration para transformar a tentativa revisada em registro atômico.
- **US4 (P4)**: depende da criação de US3 para fechar o fluxo por `Location`; seus testes de leitura podem usar fixtures confirmadas após T030.
- Contratos/regressão dependem dos dois handlers; validações finais dependem das quatro histórias.

### Blocking tasks

- T005 bloqueia todo código: documentação da IMP-003 isolada não satisfaz o gate.
- T007–T008 bloqueiam qualquer conexão por falta de isolamento/recovery comprovados.
- T010–T023 bloqueiam consumidores do novo Prisma Client; T021 só ocorre após schema/migration e gates de format/validate.
- T024–T030 bloqueiam testes com dados e browser; T105–T106 são obrigatórias mesmo se E2E falhar.
- T061–T063 bloqueiam confirmação; T076–T078 bloqueiam detalhe.
- T085–T093 bloqueiam declaração de sincronização contratual.

### TDD order inside every story

1. Criar shell mínimo que compila/importa e falha de modo controlado como `NOT_IMPLEMENTED`.
2. Escrever testes comportamentais antes do comportamento correspondente.
3. Executar cada arquivo/camada separadamente e comprovar RED pela ausência funcional esperada.
4. Implementar somente o necessário para os testes.
5. Reexecutar cada arquivo/camada até GREEN real.
6. Executar regressão da história anterior.
7. Executar o teste independente, teardown e registrar evidência.

Falha por import, Prisma Client desatualizado, pacote ausente, browser indisponível, banco incorreto, migration ausente ou infraestrutura externa não é RED válido.

---

## Parallel Opportunities

### Foundation

```text
Após T011: T012 (preflight unitário) e T013 (migration PostgreSQL) escrevem arquivos distintos.
Após T024: T025 (guard da fixture) e T026 (OpenAPI estrutural) escrevem arquivos distintos.
```

### User Story 1

```text
Após T032: T033 (estado unitário) e T034 (cenários E2E) escrevem arquivos distintos.
Após T035: T036 (tipos) e T037 (estado) escrevem arquivos distintos; composição aguarda ambas.
```

### User Story 2

```text
Após T043: T044 (contratos), T045 (estado) e T046 (E2E) escrevem arquivos distintos e podem avançar em paralelo.
Implementação é sequencial em T048–T051 porque tipos, parser, estado e formulário se consomem diretamente.
```

### User Story 3

```text
Após T054: T055 (serviço), T056 (handler), T057 (estado) e T058 (E2E) escrevem arquivos distintos e podem avançar em paralelo.
Após T059: T064 (review component) pode avançar em paralelo a T060–T063 por arquivo distinto; T065 integra somente depois.
```

### User Story 4

```text
Após T071: T072 (serviço), T073 (handler) e T074 (E2E) escrevem arquivos distintos e podem avançar em paralelo.
Após T075: T079 (componente) pode avançar em paralelo a T076–T078 por arquivo distinto; T080 compõe os resultados.
```

### Cross-cutting

```text
Após T088: T089, T090 e T091 cobrem regressões de IMP-001, IMP-002 e IMP-003 em arquivos distintos.
T094–T110 permanecem sequenciais para preservar diagnóstico, teardown e estado final inequívocos.
```

---

## Traceability

| Requirements / outcomes | Primary tasks |
|---|---|
| FR-001, FR-004, FR-008 | T005–T007, T034–T042, T055–T063, T072–T078 |
| FR-002, FR-005, FR-006, FR-024, FR-027 | T032–T042, T055–T063, T071–T084 |
| FR-003, FR-007, FR-026 | T005, T034–T042, T055–T063, T072–T083 |
| FR-009, FR-010 | T013–T023, T055–T063 |
| FR-011, FR-014, FR-015, FR-016 | T043–T053 |
| FR-012, FR-013 | T013–T023, T043–T053, T055–T069, T071–T084 |
| FR-017, FR-018, FR-023 | T050–T053, T054–T070 |
| FR-019, FR-020, FR-021, FR-022 | T013–T023, T055–T070 |
| FR-025 | T071–T084, T085–T088 |
| FR-028 | T013, T017, T023, T055–T069, T071–T084, T093 |
| FR-029, FR-030, FR-031, FR-032 | T004–T008, T013–T018, T026, T085–T093, T107–T109 |
| SC-001, SC-004, SC-005 | T013–T023, T034–T042, T055–T070, T092 |
| SC-002 | T070, T104, T107, T110 (`NAO_VERIFICADO` até avaliação humana representativa) |
| SC-003 | T044–T053, T104 |
| SC-006 | T055, T072–T084, T104 |
| SC-007 | T064–T070, T104, T107, T110 (`NAO_VERIFICADO` até avaliação humana representativa) |
| SC-008 | T071–T084, T104 |
| `createEnvironmentalCollection` | T026, T054–T070, T085–T088, T098 |
| `getEnvironmentalCollection` | T026, T071–T088, T098 |

---

## Implementation Strategy

### MVP

1. Completar Phase 1 e provar o T111 da IMP-003.
2. Completar Phase 2 com migration real e ambiente limpo.
3. Entregar US1 e validar o início contextual sem persistência.
4. Parar e demonstrar o MVP de navegação; ele ainda não é o incremento vertical completo.

O primeiro resultado persistente surge em US3; o incremento de produto da IMP-004 somente fecha após US4 tornar a coleta reencontrável.

### Incremental delivery

1. Setup/gate → dependência real comprovada.
2. Fundação → modelo, migration e fixtures seguras.
3. US1 → início no laboratório/área corretos.
4. US2 → ocorrência temporal válida e revisável.
5. US3 → confirmação atômica, idempotente e imutável.
6. US4 → detalhe contextual e somente leitura.
7. Contratos/regressão → compatibilidade comprovada.
8. Validação/fechamento → evidências, validações executadas, revisão do escopo, inspeção do diff, estado Git observado, pendências e preparação para revisão e PR quando externamente autorizados.

## Operational and Scope Boundaries

- `[DB]` exige exclusivamente PostgreSQL/Neon dedicado e permitido, guard aprovado, fixtures allowlisted e teardown; nunca produção ou banco compartilhado.
- `[Browser]` exige Chromium disponível e, quando houver dados, o único Neon E2E autorizado; falha externa é classificada e não repetida indefinidamente.
- Backup/snapshot/PITR, revisão de provider e migrations remotas são gates futuros de deploy, não autorização para alterar produção durante desenvolvimento.
- Não executar `npm audit fix`, especialmente `--force`; atualização global de dependências pertence a outra entrega.
- Permanecem fora do escopo e sem tarefas de implementação: medições ambientais, IHFR, rascunho/retomada, edição/exclusão, listagem/histórico, mapas, IANA, horário desconhecido/impreciso e abstrações futuras.
- Nenhuma tarefa cria um guard paralelo, repository genérico, modelo científico ou fallback para substituir a IMP-003.

## Format Notes

- Todos os itens executáveis usam `- [ ] TNNN`, caminho concreto e rótulo de história somente em US1–US4.
- `[P]` nunca autoriza edições concorrentes em `prisma/schema.prisma`, migrations, configuração global, autenticação ou no mesmo teste compartilhado.
- Tarefas de migration só concluem após banco isolado, invariantes, rollback/recuperação e limpeza; SQL gerado isoladamente não basta.
- Resultados, contagens e métricas só podem ser declarados quando realmente executados; bloqueio de infraestrutura permanece bloqueio.
