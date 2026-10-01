# Tasks: Cadastro público ativo

**Input**: [spec.md](spec.md), [plan.md](plan.md) e artefatos desta pasta.
**Tests**: Solicitados pela equipe; executar antes da implementação.

## Phase 1: User Story 1 - Cadastro e login imediato (P1)

**Goal**: Conta pública nasce `ACTIVE` e entra com a mesma senha sem intervenção.
**Independent Test**: Teste unitário em memória de cadastro seguido de login.

- [x] T001 [US1] Criar teste de cadastro, hash, DTO público e login imediato em `tests/unit/auth-service.test.ts`.
- [x] T002 [US1] Definir `ACTIVE` no cadastro e limitar entrada e saída públicas em `src/app/api/server/services/auth.service.ts`.

## Phase 2: User Story 2 - Preservar estados (P2)

**Goal**: Os outros estados continuam disponíveis, e somente `ACTIVE` autentica.
**Independent Test**: Matriz atual de estados e senha incorreta em `tests/unit/auth-service.test.ts` e `tests/unit/auth-core.test.ts`.

- [x] T003 [US2] Verificar e completar, se necessário, testes de `PENDING`, `INACTIVE`, `BLOCKED`, `ACTIVE` e senha incorreta em `tests/unit/auth-service.test.ts`.

## Phase 3: Documentação e validação

- [x] T004 Registrar decisão `TD-017` com origem e histórico em `TECH_DECISIONS.md`.
- [x] T005 Atualizar o recorte do cadastro em `docs/code-first-prd/specifications/requirements.md`, `docs/code-first-prd/specifications/use-cases.md` e `docs/code-first-prd/specifications/user-stories.md`.
- [x] T006 Executar comandos de `specs/010-active-public-signup/quickstart.md` e conferir diff/status.

## Dependencies & Execution Order

T001 precede T002; T003 confirma a matriz preservada; T004 e T005 dependem do comportamento definido; T006 encerra a entrega. T001 e T003 podem ser verificados juntos. O MVP é a User Story 1.
