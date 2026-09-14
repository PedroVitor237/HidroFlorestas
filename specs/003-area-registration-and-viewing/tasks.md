# Tasks: Cadastro e consulta espacial de área

**Input**: artefatos de design em `specs/003-area-registration-and-viewing/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/area-registration-api.openapi.yaml`, `quickstart.md`

**Tests**: obrigatórios e anteriores à implementação correspondente. Cada ciclo registra RED válido e GREEN real em `specs/003-area-registration-and-viewing/implementation-evidence.md`.

**Organization**: tarefas agrupadas pelas quatro histórias, precedidas pelos gates de segurança e pela migration compartilhada. `[P]` aparece somente quando os arquivos e dependências permitem execução concorrente.

## Phase 1: Setup e baseline seguro

**Purpose**: registrar um ponto de partida reproduzível sem acessar ou modificar dados de produção.

- [ ] T001 Criar o ledger de evidências com seções para baseline, RED/GREEN, migration, validações, bloqueios e estado final em `specs/003-area-registration-and-viewing/implementation-evidence.md`
- [ ] T002 Registrar branch, HEAD, `origin/development`, status inicial, worktrees e inventário de arquivos previstos sem expor valores de ambiente em `specs/003-area-registration-and-viewing/implementation-evidence.md`
- [ ] T003 Registrar versões efetivas de Node/npm, manifesto, lockfile, scripts e baseline do lint — incluindo identidade exata dos quatro warnings preexistentes, se confirmados — em `specs/003-area-registration-and-viewing/implementation-evidence.md`
- [ ] T004 Auditar o guard de banco, o recurso Neon de testes, fixtures allowlisted e configuração E2E em `tests/fixtures/auth-users.ts`, `tests/fixtures/laboratories.ts`, `playwright.config.ts` e registrar em `specs/003-area-registration-and-viewing/implementation-evidence.md` que nenhuma conexão de produção é aceita e que produção ainda não existe no escopo conhecido
- [ ] T005 Reconciliar o histórico versionado/aplicado de migrations em modo somente leitura e registrar preflight, recuperação, backup/PITR como gate futuro de deploy — não bloqueio de bancos isolados — em `specs/003-area-registration-and-viewing/implementation-evidence.md`

**Checkpoint**: baseline e limites de segurança registrados; nenhuma conexão sensível foi impressa.

---

## Phase 2: Fundamentos — migration e integridade

**Purpose**: construir e provar em banco isolado o modelo comum às quatro histórias.

**⚠️ BLOCKING**: nenhuma história começa antes de T006–T019 concluírem com banco descartável limpo.

- [ ] T006 Criar harness transacional de migration com validação de ambiente, banco descartável e teardown garantido em `tests/migration/migration-test-harness.ts`
- [ ] T007 Adicionar o script isolado `test:migration` sem alterar versões ou scripts não relacionados em `package.json`
- [ ] T008 [P] Criar testes reais de migration/integração sobre o harness/SQL, sem importar o Prisma Client ainda não regenerado, para reconciliação, preflight, backfills, IDs opacos, proprietário único, precisão decimal, opcionais, campos legados, abort antes do drop e rollback; incluir a transação integrada da IMP-002 que remove vínculos, exclui o laboratório, confirma commit aceito pela trigger diferível e ausência de dados inválidos em `tests/migration/area-registration-migration.test.ts`
- [ ] T009 [P] Criar e validar primeiro um shell compilável do preflight que retorna `NOT_IMPLEMENTED`; somente depois criar testes unitários para criador sem vínculo, limite de cinco, vínculos inconsistentes, coordenadas inválidas/órfãs/compartilhadas e saída sem dados sensíveis em `scripts/imp-003-migration-preflight.ts` e `tests/unit/area-migration-preflight.test.ts`
- [ ] T010 Executar e registrar T008 e T009 separadamente por arquivo/camada no ambiente isolado, identificando para cada RED a invariante ausente esperada; falha de import, compilação, configuração, banco ou dependência não conta como RED funcional em `specs/003-area-registration-and-viewing/implementation-evidence.md`
- [ ] T011 Implementar o preflight bloqueante e sanitizado, sem corrigir dados automaticamente, em `scripts/imp-003-migration-preflight.ts`
- [ ] T012 Modelar `LaboratoryMembershipRole`, `ResearchersLinked.id/role`, chave composta preservada, latitude `Decimal(8,6)`, longitude `Decimal(9,6)` e opcionais/legados de `CollectionArea` sem alterar `UserRole`, `User.role` ou `User.isAdmin` em `prisma/schema.prisma`
- [ ] T013 Criar a migration transacional com backfill determinístico `OWNER`/`MEMBER`, nenhum `ADMIN` automático, índice parcial, trigger diferível que exige exatamente um `OWNER` somente para laboratório ainda existente e ignora/trata laboratório já excluído na transação administrativa da IMP-002, checks, conversão/validação das coordenadas e remoção tardia de `Coordinates` em `prisma/migrations/20260914000100_area_registration_and_membership_roles/migration.sql`
- [ ] T014 Incluir exclusivamente a migration da IMP-003 na allowlist, preservando as regras existentes, em `.gitignore`
- [ ] T015 Após T012–T014 e antes de fixtures, serviços ou testes que importem o novo Prisma Client, executar e registrar em ordem `prisma format`, `prisma validate` e `prisma generate`; então executar preflight e migration tests até GREEN em banco isolado, provar inclusive a exclusão administrativa da IMP-002 sem rejeição da trigger, confirmar rollback/teardown e registrar resultados/contagens em `specs/003-area-registration-and-viewing/implementation-evidence.md`
- [ ] T016 Criar e validar primeiro exports compiláveis sem comportamento da fixture; somente depois criar testes do guard para ambiente isolado, prefixos/IDs allowlisted, ordem de exclusão e rejeição de banco inseguro em `tests/fixtures/areas.ts` e `tests/unit/area-fixture-guard.test.ts`
- [ ] T017 Executar e registrar T016 separadamente por arquivo/camada, confirmar RED funcional pela ausência da fixture segura e rejeitar como RED qualquer falha de import, compilação, configuração, banco ou dependência em `specs/003-area-registration-and-viewing/implementation-evidence.md`
- [ ] T018 Implementar usuários, vínculos, laboratórios ativo/inativo, áreas cruzadas, mutações controladas e teardown seletivo em `tests/fixtures/areas.ts`
- [ ] T019 Reexecutar T016 até GREEN, executar setup/teardown em banco isolado, confirmar contagem final zero da allowlist e registrar em `specs/003-area-registration-and-viewing/implementation-evidence.md`

**Checkpoint**: schema e migration estão comprovados localmente; nenhuma migration remota ou de produção foi aplicada.

---

## Phase 3: User Story 1 — Papéis contextuais mínimos (Priority: P1) 🎯 MVP técnico

**Goal**: todo vínculo possui papel contextual; o criador é o único `OWNER` e somente ele promove/rebaixa vínculos `MEMBER ↔ ADMIN`.

**Independent Test**: preparar laboratórios novos e migrados, verificar `OWNER`/`MEMBER`, exercer promoção/rebaixamento, concorrência e negações, sem alterar papéis globais nem contratos públicos da IMP-002.

### Tests for User Story 1 — escrever antes da implementação

- [ ] T020 [P] [US1] Criar e validar primeiro exports compiláveis que retornam falha controlada; somente depois criar testes dos parsers, transições fechadas, identificador opaco, DTO `{id,name,initials,role}` e ausência de campos privilegiados em `src/app/api/server/laboratories/laboratory-membership.contracts.ts` e `tests/unit/laboratory-membership-contracts.test.ts`
- [ ] T021 [P] [US1] Criar e validar primeiro um shell injetável compilável; somente depois criar testes do serviço para proprietário único, promoção, rebaixamento, compare-and-set, `OWNER` protegido, laboratório inativo e `UserRole.ADMIN` global sem privilégio contextual em `src/app/api/server/services/laboratory-memberships.service.ts` e `tests/unit/laboratory-memberships-service.test.ts`
- [ ] T022 [P] [US1] Criar e validar primeiro factories compiláveis sem comportamento; somente depois criar testes dos handlers GET/PATCH para autenticação, sequência de autorização, `404` uniforme, `403` em laboratório ativo, `409` para membro atual em laboratório inativo, `500 INTERNAL_ERROR` sanitizado sem detalhe/stack/dado privilegiado, `no-store` em todas as respostas e não inferência em `src/app/api/laboratories/[laboratoryId]/memberships/route.ts`, `src/app/api/laboratories/[laboratoryId]/memberships/[membershipId]/route.ts` e `tests/integration/laboratory-memberships-route.test.ts`
- [ ] T023 [P] [US1] Acrescentar testes da criação atômica de laboratório com vínculo `OWNER`, limite cinco e rollback preservados em `tests/unit/laboratories-service.test.ts`
- [ ] T024 [P] [US1] Criar cenário Playwright de proprietário promovendo/rebaixando, papéis sem controles, conflito e laboratório inativo somente leitura em `tests/e2e/laboratory-membership-roles.spec.ts`
- [ ] T025 [US1] Executar T020–T024 e registrar cada arquivo/camada separadamente, com a causa funcional esperada de cada RED; falha de import, browser, dependência ou infraestrutura não conta como RED em `specs/003-area-registration-and-viewing/implementation-evidence.md`

### Implementation for User Story 1

- [ ] T026 [US1] Definir papel, contexto e DTOs públicos adicionais sem modificar os tipos estritos existentes da IMP-002 em `src/types/laboratory.type.ts`
- [ ] T027 [US1] Implementar allowlist de `{expectedRole,role}`, serializers, mensagens e erros fechados de vínculo em `src/app/api/server/laboratories/laboratory-membership.contracts.ts`
- [ ] T028 [US1] Implementar a matriz `MANAGE_ROLES` e a base reutilizável de autorização por vínculo atual em `src/app/api/server/areas/area.authorization.ts`
- [ ] T029 [US1] Implementar repository port/Prisma, listagem mínima e compare-and-set transacional, bloqueando `OWNER` e qualquer mutação em laboratório inativo, em `src/app/api/server/services/laboratory-memberships.service.ts`
- [ ] T030 [US1] Adaptar `createAtomic` para persistir o vínculo `OWNER` na mesma transação serializável sem alterar limite ou DTO da IMP-002 em `src/app/api/server/services/laboratories.service.ts`
- [ ] T031 [US1] Implementar GET autenticado e `no-store` da lista de vínculos, incluindo `500 INTERNAL_ERROR` sanitizado sem detalhe interno, stack trace ou dado privilegiado, em `src/app/api/laboratories/[laboratoryId]/memberships/route.ts`
- [ ] T032 [US1] Implementar PATCH autenticado, fechado e concorrente de papel, incluindo `500 INTERNAL_ERROR` sanitizado e `no-store` em toda resposta, em `src/app/api/laboratories/[laboratoryId]/memberships/[membershipId]/route.ts`
- [ ] T033 [US1] Implementar lista e controles acessíveis de promoção/rebaixamento com loading, sucesso, erro e conflito em `src/components/laboratories/laboratory-memberships.tsx`
- [ ] T034 [US1] Implementar a página mínima de membros, sem convite/remoção/transferência e com modo somente leitura em `src/app/(private)/dashboard/laboratories/[laboratoryId]/members/page.tsx`
- [ ] T035 [US1] Reexecutar testes unitários e de integração de T020–T023 até GREEN e registrar resultados reais em `specs/003-area-registration-and-viewing/implementation-evidence.md`
- [ ] T036 [US1] Executar T024 uma vez no recurso E2E autorizado, garantir teardown mesmo após erro e registrar GREEN ou bloqueio de infraestrutura distinto de falha funcional em `specs/003-area-registration-and-viewing/implementation-evidence.md`

**Checkpoint**: US1 funciona por API e UI com propriedade única e separação dos papéis globais.

---

## Phase 4: User Story 2 — Contexto explícito do laboratório (Priority: P2)

**Goal**: a pessoa escolhe um laboratório, a URL preserva a escolha e cada operação revalida vínculo, papel, estado e recurso sem permitir inferência.

**Independent Test**: com dois laboratórios, selecionar um no workspace, navegar/recarregar e comprovar contexto; revogar vínculo ou cruzar IDs e obter negação uniforme sem dados residuais.

### Tests for User Story 2 — escrever antes da implementação

- [ ] T037 [P] [US2] Criar testes da sequência principal autenticado/conta elegível→laboratório filtrado pelo vínculo→papel e estado do laboratório→permissão→recurso subordinado, incluindo conta inelegível, revogação, `404` inacessível, `409` para qualquer membro atual que tente mutação em laboratório inativo e `403` por papel insuficiente em laboratório ativo em `tests/unit/area-authorization.test.ts`
- [ ] T038 [P] [US2] Criar testes de integração do contexto para laboratório válido, inativo, inexistente, inacessível, cruzado e revalidado sem cache em `tests/integration/laboratory-context-access.test.ts`
- [ ] T039 [P] [US2] Criar cenários Playwright de escolha explícita, ausência de seleção automática, URL contextual, reload, links, revogação e `404` uniforme em `tests/e2e/laboratory-context.spec.ts`
- [ ] T040 [US2] Executar T037–T039 e registrar cada arquivo/camada separadamente, identificando o comportamento contextual ausente de cada RED; falha de import, browser, dependência ou infraestrutura não conta como RED funcional em `specs/003-area-registration-and-viewing/implementation-evidence.md`

### Implementation for User Story 2

- [ ] T041 [US2] Completar `authorizeLaboratoryAccess` na ordem principal autenticado/conta elegível→laboratório filtrado pelo vínculo→papel e estado→permissão→recurso subordinado, com `READ_AREAS`, `CREATE_AREA`, `MANAGE_ROLES`, fronteira `CREATE_COLLECTION`, `readOnly`, `404` inacessível, `409` para mutação por membro atual em laboratório inativo e `403` por papel insuficiente em laboratório ativo em `src/app/api/server/areas/area.authorization.ts`
- [ ] T042 [US2] Implementar projeção server-side do laboratório selecionado com vínculo/papel atuais e nenhuma persistência em cookie/localStorage em `src/components/workspace/laboratory-context.tsx`
- [ ] T043 [US2] Criar layout contextual dinâmico com identificação do laboratório, papel, status e somente leitura em `src/app/(private)/dashboard/laboratories/[laboratoryId]/layout.tsx`
- [ ] T044 [US2] Alterar “ACESSAR LABORATÓRIO” para navegar explicitamente ao `laboratoryId`, preservando escolha após reload, em `src/components/workspace/laboratory-workspace.tsx`
- [ ] T045 [US2] Orientar acesso sem contexto para a escolha explícita do workspace em `src/app/(private)/dashboard/page.tsx`
- [ ] T046 [US2] Redirecionar a rota legada sem contexto para o workspace sem escolher laboratório automaticamente em `src/app/(private)/dashboard/collects/page.tsx`
- [ ] T047 [US2] Tornar links desktop/mobile dependentes do `laboratoryId` presente na rota, sem guardar autorização no cliente, em `src/components/sidebar/index.tsx`
- [ ] T048 [US2] Criar a página contextual inicial de áreas para sustentar a jornada de seleção antes da listagem persistente em `src/app/(private)/dashboard/laboratories/[laboratoryId]/areas/page.tsx`
- [ ] T049 [US2] Reexecutar T037–T038 até GREEN, verificar `no-store` onde houver resposta HTTP e registrar resultados em `specs/003-area-registration-and-viewing/implementation-evidence.md`
- [ ] T050 [US2] Executar T039 com reload e revogação segura, garantir teardown e registrar GREEN ou bloqueio externo sem repetição indefinida em `specs/003-area-registration-and-viewing/implementation-evidence.md`

**Checkpoint**: US2 preserva contexto na rota e invalida acesso anterior na operação seguinte.

---

## Phase 5: User Story 3 — Cadastro espacial da área (Priority: P3)

**Goal**: `OWNER` e `ADMIN` criam uma única área-ponto confirmada em laboratório ativo por entrada manual, mapa ou geolocalização revisável.

**Independent Test**: criar áreas pelos três caminhos; validar papéis, ranges, normalização, opcionais, autoria, atomicidade, fallback e ausência de persistência intermediária.

### Tests for User Story 3 — escrever antes da implementação

- [ ] T051 [P] [US3] Criar e validar primeiro exports compiláveis de falha controlada; somente depois criar testes do parser/serializer fechado para normalização, limites de tamanho, opcionais nulos, ranges, não numéricos/não finitos, chaves extras e tolerância `1e-6` em `src/app/api/server/areas/area.contracts.ts` e `tests/unit/area-contracts.test.ts`
- [ ] T052 [P] [US3] Criar e validar primeiro um shell injetável compilável; somente depois criar testes do serviço para criação por `OWNER`/`ADMIN`, recusa de `MEMBER`/inativo conforme a ordem de autorização, autoria/contexto derivados, decimal canônico, atomicidade e falha sem parcial em `src/app/api/server/services/areas.service.ts` e `tests/unit/areas-service.test.ts`
- [ ] T053 [P] [US3] Criar e validar primeiro uma factory compilável sem comportamento; somente depois criar testes do POST para corpo fechado, identidade/laboratório forjados, códigos 201/400/401/403/404/409/500, `500 INTERNAL_ERROR` sanitizado sem detalhe/stack/dado privilegiado, `Location`, `no-store` em toda resposta e DTO mínimo em `src/app/api/laboratories/[laboratoryId]/areas/route.ts` e `tests/integration/areas-route.test.ts`
- [ ] T054 [P] [US3] Criar e validar primeiro um reducer compilável que retorna estado inicial; somente depois criar testes do estado do formulário para clique, digitação, marcador, submissão única e geolocalização concedida/negada/indisponível/timeout/inválida/tardia sem apagar correção em `src/components/areas/area-form-state.ts` e `tests/unit/area-form-state.test.ts`
- [ ] T055 [P] [US3] Criar cenários Playwright de criação como administrador, recusa de membro/inativo, mapa, manual, geolocalização, fallback com tiles indisponíveis mantendo entrada manual e atribuição obrigatória, nenhuma persistência antes da confirmação e viewports móvel/intermediária/ampla em `tests/e2e/area-registration.spec.ts`
- [ ] T056 [US3] Executar T051–T055 e registrar cada arquivo/camada separadamente, identificando a funcionalidade ausente esperada de cada RED; falha de dependência, import, browser ou infraestrutura não conta como RED funcional em `specs/003-area-registration-and-viewing/implementation-evidence.md`

### Implementation for User Story 3

- [ ] T057 [US3] Instalar somente `leaflet@1.9.4`, `react-leaflet@5.0.0` e tipos compatíveis necessários, revisando que nenhuma outra versão mudou incidentalmente, em `package.json` e `package-lock.json`
- [ ] T058 [P] [US3] Implementar URL/atribuição configuráveis, preservar atribuição obrigatória visível, fallback OSM apenas manual/dev e falha segura sem tiles em `src/components/areas/map-config.ts`
- [ ] T059 [P] [US3] Definir inputs e DTOs fechados de área sem autoria ou campos legados em `src/types/area.type.ts`
- [ ] T060 [US3] Implementar parser, normalização, decimal/number serializer, mensagens e envelopes da área em `src/app/api/server/areas/area.contracts.ts`
- [ ] T061 [P] [US3] Implementar repository port e criação transacional subordinada ao laboratório/principal autorizados em `src/app/api/server/services/areas.service.ts`
- [ ] T062 [US3] Implementar POST autenticado com revalidação atual, allowlist, `Location`, `no-store` em toda resposta e `500 INTERNAL_ERROR` sanitizado sem detalhe interno, stack trace ou dado privilegiado em `src/app/api/laboratories/[laboratoryId]/areas/route.ts`
- [ ] T063 [P] [US3] Implementar estado canônico de coordenadas, token contra resposta tardia, descarte transitório e single-flight em `src/components/areas/area-form-state.ts`
- [ ] T064 [US3] Implementar mapa client-only com uma única importação do CSS do Leaflet, container com altura/dimensões não nulas e responsivas, clique, marcador próprio, sincronização e tiles com atribuição obrigatória preservada em `src/components/areas/area-map.client.tsx`
- [ ] T065 [US3] Criar wrapper dinâmico `ssr: false` com fallback acessível e entrada manual independente e funcional quando mapa ou tiles estiverem indisponíveis em `src/components/areas/area-map.tsx`
- [ ] T066 [US3] Implementar formulário responsivo com labels, foco, opcionais, geolocalização explícita, mensagens e confirmação única em `src/components/areas/area-form.tsx`
- [ ] T067 [US3] Implementar página de nova área vinculada ao contexto e bloqueada em modo somente leitura em `src/app/(private)/dashboard/laboratories/[laboratoryId]/areas/new/page.tsx`
- [ ] T068 [US3] Reexecutar T051–T054 até GREEN e registrar resultados unitários/de integração reais em `specs/003-area-registration-and-viewing/implementation-evidence.md`
- [ ] T069 [US3] Executar T055 com geolocalização controlada e tiles interceptados, garantir teardown e registrar GREEN ou classificação de infraestrutura em `specs/003-area-registration-and-viewing/implementation-evidence.md`
- [ ] T070 [US3] Verificar em browser nas viewports móvel, tablet/intermediária e ampla que o container do mapa mantém dimensões não nulas e comportamento responsivo e que teclado, foco, mensagens, atribuição e caminho manual sem tiles permanecem operáveis; registrar evidência em `specs/003-area-registration-and-viewing/implementation-evidence.md`
- [ ] T071 [US3] Confirmar no banco isolado uma área por submissão, autoria correta, somente ponto final e ausência de coordenadas/áreas órfãs após falha; limpar fixtures e registrar contagens em `specs/003-area-registration-and-viewing/implementation-evidence.md`

**Checkpoint**: US3 cadastra área persistente sem depender de geolocalização ou disponibilidade de tiles.

---

## Phase 6: User Story 4 — Listagem e detalhe persistentes (Priority: P4)

**Goal**: qualquer vínculo atual reencontra áreas do laboratório e abre detalhe com exatamente o ponto persistido, inclusive em modo somente leitura.

**Independent Test**: listar e detalhar áreas com os três papéis, laboratório inativo, vazio e IDs cruzados/inexistentes, confirmando DTO fechado e marcador único.

### Tests for User Story 4 — escrever antes da implementação

- [ ] T072 [P] [US4] Acrescentar testes de serviço para listagem completa sem paginação no contrato atual, ordenada/vazia, com todos os campos de FR-031, latitude/longitude serializadas como números e detalhe filtrado por `{id,laboratoryRoomId}` com os três papéis e laboratório inativo em `tests/unit/areas-service.test.ts`
- [ ] T073 [P] [US4] Acrescentar testes GET de lista/detalhe para `404` uniforme, `500 INTERNAL_ERROR` sanitizado sem detalhe/stack/dado privilegiado, `no-store` em toda resposta, todos os campos de FR-031, latitude/longitude numéricas, opcionais nulos no DTO, `readOnly` quando aplicável e ausência de autoria/userId/e-mail/código/CEP/imagem/estado funcional legado em `tests/integration/areas-route.test.ts`
- [ ] T074 [P] [US4] Criar cenários Playwright de lista com coordenadas textuais e sem mapa agregado, opcionais exibidos somente quando presentes, vazio, reload, detalhe, marcador, todos os papéis, indicação somente leitura, cruzamento, viewports móvel/intermediária/ampla e regressão dos mocks em `tests/e2e/area-viewing.spec.ts`
- [ ] T075 [US4] Executar T072–T074 e registrar cada arquivo/camada separadamente, identificando o fluxo de consulta ausente esperado de cada RED; falha de import, browser, dependência ou infraestrutura não conta como RED funcional em `specs/003-area-registration-and-viewing/implementation-evidence.md`

### Implementation for User Story 4

- [ ] T076 [US4] Implementar listagem ordenada com todos os campos de FR-031, latitude/longitude serializadas como números, e detalhe composto sem filtro pelo `isActive` legado em `src/app/api/server/services/areas.service.ts`
- [ ] T077 [US4] Implementar GET de áreas com contexto, lista vazia, `readOnly`, `no-store` em toda resposta e `500 INTERNAL_ERROR` sanitizado sem detalhe interno, stack trace ou dado privilegiado em `src/app/api/laboratories/[laboratoryId]/areas/route.ts`
- [ ] T078 [US4] Implementar GET do detalhe subordinado ao laboratório com `404` uniforme, DTO mínimo, `no-store` em toda resposta e `500 INTERNAL_ERROR` sanitizado em `src/app/api/laboratories/[laboratoryId]/areas/[areaId]/route.ts`
- [ ] T079 [P] [US4] Implementar lista persistente acessível com identificador, nome, latitude/longitude textuais, município/UF somente quando presentes, link de detalhe, indicação somente leitura quando aplicável, nenhum mapa agregado nem campo privilegiado e estados loading/vazio/erro/sucesso em `src/components/areas/area-list.tsx`
- [ ] T080 [US4] Substituir a página contextual provisória pela listagem real e ação “Nova Área” sem `alert` em `src/app/(private)/dashboard/laboratories/[laboratoryId]/areas/page.tsx`
- [ ] T081 [P] [US4] Acrescentar modo somente leitura com exatamente um marcador persistido ao mapa compartilhado em `src/components/areas/area-map.client.tsx`
- [ ] T082 [US4] Implementar detalhe responsivo, opcionais somente quando presentes, contexto e indicação somente leitura em `src/app/(private)/dashboard/laboratories/[laboratoryId]/areas/[areaId]/page.tsx`
- [ ] T083 [US4] Remover os componentes de lista mock sem uso e verificar que nenhum import restante os referencia, sem recriar nem alterar o redirecionamento legado pertencente a T046, em `src/app/(private)/dashboard/collects/collect-card.tsx` e `src/app/(private)/dashboard/collects/collects-grid.tsx`
- [ ] T084 [US4] Reexecutar T072–T073 até GREEN e registrar resultados unitários/de integração em `specs/003-area-registration-and-viewing/implementation-evidence.md`
- [ ] T085 [US4] Executar T074 com tiles interceptados, reload e teardown garantido; registrar GREEN ou bloqueio externo classificado em `specs/003-area-registration-and-viewing/implementation-evidence.md`
- [ ] T086 [US4] Verificar listagem/detalhe em browser nas viewports móvel, tablet/intermediária e ampla, incluindo teclado, foco, coordenadas textuais sem mapa agregado na lista, opcionais somente quando presentes, marcador no detalhe e indicação somente leitura; registrar em `specs/003-area-registration-and-viewing/implementation-evidence.md`

**Checkpoint**: US4 fecha o fluxo persistente completo sem edição ou exclusão de área.

---

## Phase 7: Integração de contratos e regressão

**Purpose**: provar sincronização das cinco operações e compatibilidade com IMP-001/002.

- [ ] T087 Criar teste estrutural/de conformidade que exija OpenAPI 3.1 válido, cinco `operationId` únicos, refs locais resolvidas, schemas fechados, exemplos, ausência de campos privilegiados e resposta `500` nas cinco operações com schema tipado `INTERNAL_ERROR`, mensagem sanitizada e `no-store` em `tests/unit/area-openapi-contract.test.ts`
- [ ] T088 Executar T087 isoladamente e registrar RED pela causa contratual esperada por asserção, sem aceitar falha de import, parser, dependência ou configuração como RED funcional, em `specs/003-area-registration-and-viewing/implementation-evidence.md`
- [ ] T089 Sincronizar exemplos de sucesso/erro e descrições das cinco operações com DTOs/handlers, incluindo `500 INTERNAL_ERROR` sanitizado, sem detalhe interno, stack trace ou dado privilegiado e com `no-store`, sem ampliar o contrato, em `specs/003-area-registration-and-viewing/contracts/area-registration-api.openapi.yaml`
- [ ] T090 Reexecutar T087 até GREEN e registrar parser, refs, operações e schemas verificados em `specs/003-area-registration-and-viewing/implementation-evidence.md`
- [ ] T091 [P] Acrescentar regressões para `/api/auth/me`, papéis globais e DTOs/limite/criação/consulta/desativação da IMP-002; para exclusão, executar a transação real integrada que remove os vínculos e depois o laboratório, confirmar commit aceito pela trigger e ausência de dados inválidos em `tests/unit/auth-contracts.test.ts`, `tests/unit/laboratory-contracts.test.ts`, `tests/unit/laboratories-service.test.ts` e `tests/integration/laboratory-settings-route.test.ts`
- [ ] T092 Executar as regressões de T091 antes e depois da integração final e registrar resultados reais em `specs/003-area-registration-and-viewing/implementation-evidence.md`
- [ ] T093 Conferir paridade entre OpenAPI, handlers, tipos e cenários, atualizando coordenadamente qualquer mudança necessária em `specs/003-area-registration-and-viewing/contracts/area-registration-api.openapi.yaml`, `tests/unit/area-openapi-contract.test.ts` e `specs/003-area-registration-and-viewing/quickstart.md`

**Checkpoint**: contratos e regressões estão sincronizados; nenhuma API da IMP-001/002 foi ampliada incidentalmente.

---

## Phase 8: Validações automatizadas e segurança final

**Purpose**: executar gates separados, registrar resultados observados e deixar o ambiente isolado limpo.

- [ ] T094 Executar Prisma format somente após revisar o diff esperado do schema e registrar resultado em `specs/003-area-registration-and-viewing/implementation-evidence.md`
- [ ] T095 Executar Prisma validate contra configuração segura, sem imprimir URLs, e registrar resultado em `specs/003-area-registration-and-viewing/implementation-evidence.md`
- [ ] T096 Executar Prisma generate, verificar somente artefatos ignorados/esperados e registrar resultado em `specs/003-area-registration-and-viewing/implementation-evidence.md`
- [ ] T097 Executar `npm run test:migration` em banco descartável, confirmar invariantes/rollback/teardown e registrar contagens em `specs/003-area-registration-and-viewing/implementation-evidence.md`
- [ ] T098 Executar a validação OpenAPI isoladamente e registrar operações, refs e resultado em `specs/003-area-registration-and-viewing/implementation-evidence.md`
- [ ] T099 Executar `npm run test:unit` e registrar quantidade/resultado reais sem antecipar aprovação em `specs/003-area-registration-and-viewing/implementation-evidence.md`
- [ ] T100 Executar `npm run test:integration` serialmente no banco isolado e registrar quantidade/resultado reais em `specs/003-area-registration-and-viewing/implementation-evidence.md`
- [ ] T101 Executar `npm run lint`, exigir zero erros, comparar cada warning com a baseline de T003 e investigar qualquer warning novo em `specs/003-area-registration-and-viewing/implementation-evidence.md`
- [ ] T102 Executar `npm run typecheck` e registrar resultado independente em `specs/003-area-registration-and-viewing/implementation-evidence.md`
- [ ] T103 Executar `npm run build` e registrar resultado independente em `specs/003-area-registration-and-viewing/implementation-evidence.md`
- [ ] T104 Executar uma tentativa limitada de Playwright no único Neon E2E autorizado com guard, fixtures allowlisted, geolocalização controlada e tiles interceptados; distinguir falha funcional/infraestrutura em `specs/003-area-registration-and-viewing/implementation-evidence.md`
- [ ] T105 Executar teardown E2E obrigatório após sucesso ou falha de T104 e registrar o resultado sem expor conexão em `specs/003-area-registration-and-viewing/implementation-evidence.md`
- [ ] T106 Confirmar contagens finais zero para todas as fixtures allowlisted e ausência de área/coordenada/vínculo órfão no banco E2E em `specs/003-area-registration-and-viewing/implementation-evidence.md`
- [ ] T107 Executar `git diff --check`, revisar arquivos gerados/ignorados e registrar o diff final esperado em `specs/003-area-registration-and-viewing/implementation-evidence.md`
- [ ] T108 Verificar escopo, secrets, `docs/raw/**`, ausência de `npm audit fix`, mudanças incidentais de dependência e itens proibidos da feature em `specs/003-area-registration-and-viewing/implementation-evidence.md`

**Checkpoint**: cada gate possui resultado próprio; falha não é convertida em sucesso nem repetida indefinidamente.

---

## Phase 9: Documentação e fechamento

**Purpose**: consolidar evidências sem declarar validações ainda não executadas.

- [ ] T109 Atualizar comandos, pré-condições, provider/atribuição, recovery e resultados realmente observados no roteiro em `specs/003-area-registration-and-viewing/quickstart.md`
- [ ] T110 Registrar SC-009 e SC-010 como `NAO_VERIFICADO` e criar acompanhamento futuro para participantes reais, sem bloquear automaticamente implementação/PR/merge, em `specs/003-area-registration-and-viewing/implementation-evidence.md`
- [ ] T111 Executar o gate da IMP-004 confirmando estabilidade de `area.id`, associação área–laboratório, rotas, guard, inatividade, papéis, autoria derivada e DTO mínimo em `specs/003-area-registration-and-viewing/implementation-evidence.md`
- [ ] T112 Reconciliar checkboxes, evidências, arquivos alterados, bloqueios e prontidão para `$speckit-analyze` sem iniciar a skill seguinte em `specs/003-area-registration-and-viewing/tasks.md` e `specs/003-area-registration-and-viewing/implementation-evidence.md`

---

## Dependencies & Execution Order

### Phase dependencies

```text
Phase 1 (T001–T005)
  └─> Phase 2 (T006–T019) [BLOCKING: schema/migration/fixtures]
        └─> US1 (T020–T036) [BLOCKING: papéis]
              └─> US2 (T037–T050) [contexto/guard]
                    └─> US3 (T051–T071) [criação]
                          └─> US4 (T072–T086) [consulta]
                                └─> Contratos/regressão (T087–T093)
                                      └─> Validações (T094–T108)
                                            └─> Fechamento (T109–T112)
```

### User story dependencies

- **US1 (P1)**: depende da migration fundamental; é predecessora obrigatória porque define os papéis usados por todas as permissões.
- **US2 (P2)**: depende de US1; amplia o guard para contexto, revogação e recursos subordinados.
- **US3 (P3)**: depende de US2 e do ponto migrado; usa `CREATE_AREA` e produz a área persistente.
- **US4 (P4)**: depende de US3 para fechar a jornada de reencontro, embora seus testes possam usar fixtures de área após T019.
- A integração contratual depende das cinco operações implementadas; validações finais dependem das quatro histórias.

### Blocking tasks

- T004–T005 bloqueiam qualquer acesso a banco por falta de prova de isolamento/histórico.
- T006–T015 bloqueiam fixtures, serviços, testes e qualquer outro código dependente do novo Prisma Client; T015 gera o client intermediário somente depois das alterações estruturais de schema/migration.
- T016–T019 bloqueiam testes E2E das histórias.
- T020–T036 bloqueiam as permissões de US2–US4.
- T041 bloqueia qualquer endpoint de área.
- T057 bloqueia os componentes Leaflet, mas não o serviço/contrato de área.
- T087–T093 bloqueiam a declaração de sincronização contratual.
- T105–T106 são obrigatórias mesmo quando T104 falhar.

### TDD order inside every story

1. Criar o shell mínimo e validar que ele compila/importa sem executar ainda os testes comportamentais.
2. Escrever os testes identificados no início da fase.
3. Executar e registrar cada arquivo ou camada separadamente, identificando a causa funcional esperada do RED.
4. Implementar somente o comportamento coberto.
5. Reexecutar e registrar GREEN real por arquivo ou camada.
6. Executar o cenário independente e garantir limpeza.

Falha por import acidental, dependência ausente, banco/configuração incorretos, timeout externo ou infraestrutura não conta como RED válido.

---

## Parallel Opportunities

### User Story 1

```text
Após T019: T020, T021, T022, T023 e T024 podem criar testes em arquivos distintos.
Após T030: T031 e a preparação visual de T033 podem avançar em arquivos distintos; T033 só integra após T032.
```

### User Story 2

```text
Após US1: T037, T038 e T039 podem criar testes em paralelo.
Após T041: T042 e T044 podem avançar em arquivos distintos; layout/links são integrados depois.
```

### User Story 3

```text
Após US2: T051, T052, T053, T054 e T055 podem criar testes em paralelo.
Após T057: T058/T059 e, depois dos contratos, T061/T063 podem avançar em arquivos distintos.
```

### User Story 4

```text
Após US3: T072, T073 e T074 podem criar testes em paralelo.
Após T076: T077/T078 e T079/T081 podem avançar por pares em arquivos distintos antes da composição das páginas.
```

### Cross-cutting

```text
T091 pode ser preparado em paralelo ao refinamento documental T089, desde que T092 aguarde a integração.
Validações T094–T108 permanecem sequenciais para produzir diagnóstico e estado de árvore inequívocos.
```

---

## Traceability

| Requirements / outcomes | Primary tasks |
|---|---|
| FR-001–FR-007; SC-001–SC-002 | T008–T015, T020–T036 |
| FR-008–FR-015; SC-003–SC-005 | T028, T037–T050, T073, T078 |
| FR-016–FR-029; SC-006–SC-007 | T008–T015, T051–T071 |
| FR-030–FR-038; SC-004–SC-008, SC-011 | T072–T093, T099–T108 |
| SC-009–SC-010 | T110 (`NAO_VERIFICADO` até validação humana real) |
| `CF-PRD-FR-004`, `CF-PRD-FR-011` | T037–T050 |
| `CF-PRD-FR-005`, `CF-PRD-FR-012`, `CF-PRD-FR-013` | T051–T093 |
| Fronteira IMP-004 | T041, T111 |

---

## Implementation Strategy

### MVP técnico

1. Concluir Setup e Fundamentos.
2. Entregar US1 com migration provada, proprietário único e gestão mínima de papéis.
3. Parar e validar US1 independentemente.

US1 é o MVP técnico predecessor, mas o primeiro incremento vertical de produto da IMP-003 somente está completo após US4.

### Incremental delivery

1. Setup + Fundamentos → base íntegra e segura.
2. US1 → papéis contextuais verificáveis.
3. US2 → contexto explícito e isolamento.
4. US3 → cadastro persistente com fallback manual.
5. US4 → reencontro e detalhe, fechando o fluxo.
6. Contratos/regressão → compatibilidade provada.
7. Validações/fechamento → evidências e gate da IMP-004.

## Operational and Scope Boundaries

- Banco isolado e guard aprovado são requisitos para desenvolvimento; backup/PITR e provider de tiles aprovado são gates futuros de deploy.
- Permanecem fora do escopo: 6 vulnerabilidades moderadas, 15 altas e 1 crítica e a futura `chore/dependency-security-audit`; não executar `npm audit fix`, especialmente `--force`.
- Também permanecem fora: reativação, edição/exclusão de área, convite/remoção de membro, transferência de propriedade, mapa territorial da IMP-008 e coleta/modelo da IMP-004.
- Não criar recurso Neon adicional sem necessidade material; não imprimir secrets, tokens ou URLs de conexão.
- SC-009 e SC-010 continuam `NAO_VERIFICADO` até execução real com participantes representativos.

## Format Notes

- Todos os itens executáveis usam `- [ ] TNNN`, caminho concreto e rótulo de história somente nas fases US1–US4.
- `[P]` significa arquivo distinto e ausência de dependência não concluída; não autoriza edição concorrente do schema, autenticação ou configuração global.
- A conclusão de tarefa de migration exige teste em banco isolado, invariantes e limpeza; gerar SQL isoladamente não basta.
