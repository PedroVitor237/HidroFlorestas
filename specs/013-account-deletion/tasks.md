# Tasks: exclusão da própria conta

Input: [spec.md](spec.md), [plan.md](plan.md), pesquisa/modelo/contrato. Validação
automatizada exigida pela spec, proporcional à operação irreversível.

## Phase 1: Setup

- [x] T001 Registrar base/worktree limpo e escolhas confirmadas em specs/013-account-deletion/spec.md.
- [x] T002 Instalar pelo lock e gerar Prisma no worktree próprio; registrar specs/013-account-deletion/plan.md.
- [x] T003 Concluir design e checklist em specs/013-account-deletion/checklists/requirements.md.

## Phase 2: Foundation

- [x] T004 Criar testes de contrato/migration em tests/unit/account-deletion-contracts.test.ts e tests/migration/account-deletion.test.ts.
- [x] T005 Adicionar propriedade de mail e nova ação do limiter em prisma/schema.prisma e prisma/migrations/20261005000100_account_deletion_mail_ownership/migration.sql.
- [x] T006 Inferir/validar dono sem modificar MAC histórico em src/app/api/server/mail/outbox.ts e src/app/api/server/mail/contracts.ts.
- [x] T007 Identificar dono de avisos no produtor em src/app/api/server/accounts/service.ts.

## Phase 3: US1 — excluir conta elegível

Independent test: fixture sem vínculos excluída, sessão/provas antigas recusadas,
nenhum dado parcialmente removido em falha/senha incorreta.

- [x] T008 [US1] Cobrir senha/revogação/rollback e limpeza de mail em tests/integration/account-deletion.test.ts.
- [x] T009 [US1] Implementar parsing, sessão, limiter e transação de exclusão em src/app/api/server/accounts/deletion.contracts.ts e src/app/api/server/accounts/service.ts.
- [x] T010 [US1] Integrar GET/DELETE, CSRF/cookies e corpo fechado em src/app/api/server/accounts/deletion.http.ts e src/app/api/auth/account-deletion/route.ts.
- [x] T011 [US1] Implementar confirmação/senha/cancelamento/sucesso em src/components/account/account-deletion-form.tsx e src/app/(public)/delete-account/page.tsx.
- [x] T012 [US1] Disponibilizar links normal/restrito em src/components/top-bar/index.tsx, src/components/admin-shell/admin-shell.tsx e src/components/account/email-verification-form.tsx.

## Phase 4: US2 — preservar vínculos e último admin

Independent test: cada relação impede exclusão com contagem/motivo e permanece
intacta; concorrência não deixa zero admins, vínculos órfãos ou exclusão parcial.

- [x] T013 [US2] Implementar relatório de vínculos/guard legado/admin em src/app/api/server/accounts/service.ts.
- [x] T014 [US2] Cobrir relações, último admin e corridas em tests/integration/account-deletion.test.ts.
- [x] T015 [US2] Exibir bloqueios e atualização segura em src/components/account/account-deletion-form.tsx.

## Phase 5: Validação e entrega

- [x] T016 Cobrir navegador/teclado/mobile e restrita em tests/e2e/account-deletion.spec.ts usando banco descartável próprio.
- [x] T017 Validar unit/integration/migration/contracts/R1/type/lint/build e registrar specs/013-account-deletion/validation-results.json.
- [ ] T018 Conferir diff/segredos/ancestralidade, commits candidatos e handoff em specs/013-account-deletion/implementation-evidence.md.

## Dependencies & Execution Order

T001–T003 → T004–T007 → US1/US2 → T016–T018. Schema/produtor/serviço compartilhados
são sequenciais. SQL, build e navegador não concorrem por portas/.next/bancos.
Pesquisa foi delegada somente leitura; implementação tem um único owner.

## Parallel opportunities

Leitura de requisitos/UI pode acompanhar instalação. Testes SQL e aplicativo não
concorrem. Não há delegação de edição de schema/auth compartilhados.

## Implementation Strategy

Backend seguro com fixtures primeiro, UI integrada em seguida; validar a jornada
inteira antes de candidato/publicação. Não executar exclusão de conta real para
comprovar a feature, nem alterar a homologação durante implementação.
