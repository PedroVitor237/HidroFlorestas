# Tasks: Criação mínima de laboratório

**Input**: `specs/002-criar-laboratorio/{spec,plan,research,data-model,quickstart}.md` and `contracts/`

## Phase 1: Setup

- [X] T001 Confirmar stacked base, estado remoto da IMP-001 e caminhos exclusivos em `specs/002-criar-laboratorio/plan.md`
- [X] T002 [P] Criar testes inicialmente falhos do contrato público em `tests/unit/laboratory-contracts.test.ts`
- [X] T003 [P] Criar testes inicialmente falhos dos casos de uso, limite, atomicidade e isolamento em `tests/unit/laboratories-service.test.ts`
- [X] T004 [P] Criar testes inicialmente falhos dos handlers GET/POST, autenticação e allowlist em `tests/integration/laboratories-route.test.ts`

## Phase 2: Foundational

- [X] T005 Adicionar somente unicidade de `LaboratoryRoom.accessCode` em `prisma/schema.prisma`
- [X] T006 Criar migration incremental isolada em `prisma/migrations/20260907120000_unique_laboratory_access_code/migration.sql`
- [X] T007 [P] Definir DTOs e parser cliente em `src/types/laboratory.type.ts`
- [X] T008 Implementar validação runtime, mensagens e serializer em `src/app/api/server/laboratories/laboratory.contracts.ts`
- [X] T009 Implementar repositório Prisma transacional serializável, retry, limite cinco e casos de uso em `src/app/api/server/services/laboratories.service.ts`

## Phase 3: User Story 1 — Criar laboratório persistente (P1)

**Independent Test**: ACTIVE cria laboratório + vínculo com `{name}`; negativos não escrevem; falha de vínculo reverte.

- [ ] T010 [US1] Fazer T002–T004 falharem pelas ausências esperadas e registrar o baseline em `specs/002-criar-laboratorio/quickstart.md`
- [X] T011 [US1] Implementar POST autenticado, entrada exata, DTO e erros controlados em `src/app/api/laboratories/route.ts`
- [X] T012 [US1] Fazer testes unitários e de integração de criação passarem em `tests/unit/laboratory-contracts.test.ts`, `tests/unit/laboratories-service.test.ts` e `tests/integration/laboratories-route.test.ts`

## Phase 4: User Story 2 — Reencontrar laboratórios acessíveis (P2)

**Independent Test**: duas identidades listam apenas seus vínculos; reload conceitual consulta novamente dados persistidos.

- [X] T013 [US2] Implementar GET autenticado, no-store, filtro por vínculo e DTO mínimo em `src/app/api/laboratories/route.ts`
- [X] T014 [US2] Cobrir listagem vazia, ordenada, limitada e isolada em `tests/unit/laboratories-service.test.ts` e `tests/integration/laboratories-route.test.ts`

## Phase 5: User Story 3 — Workspace persistente (P3)

**Independent Test**: criar pela UI, refazer consulta e recarregar; verificar vazio/loading/sucesso/erro/limite sem contexto ativo.

- [X] T015 [P] [US3] Implementar formulário, lista, retry, bloqueio de submissão e acessibilidade em `src/components/workspace/laboratory-workspace.tsx`
- [X] T016 [US3] Substituir exclusivamente o mock de laboratório pela composição persistente em `src/app/(private)/workspace/page.tsx`
- [X] T017 [US3] Criar fixture allowlisted e teardown seletivo em `tests/fixtures/laboratories.ts`
- [X] T018 [US3] Criar cenários Playwright de criação, reload, isolamento, limite e UI em `tests/e2e/create-laboratory.spec.ts`

## Phase 6: Polish and Validation

- [X] T019 Executar Prisma format/validate/generate e registrar resultados em `specs/002-criar-laboratorio/quickstart.md`
- [X] T020 Executar `npm run test:unit` e `npm run test:integration` e registrar resultados em `specs/002-criar-laboratorio/quickstart.md`
- [ ] T021 Executar `npm run lint`, `npm run typecheck` e `npm run build` e registrar separadamente em `specs/002-criar-laboratorio/quickstart.md`
- [X] T022 Executar E2E/banco somente com ambiente isolado confirmado ou registrar bloqueio em `specs/002-criar-laboratorio/quickstart.md`
- [X] T023 Validar navegador, móvel/amplo, teclado/foco e Network ou registrar bloqueios em `specs/002-criar-laboratorio/quickstart.md`
- [X] T024 Reconsultar `origin/001-authenticated-access` sem merge/rebase e registrar risco de reconciliação em `specs/002-criar-laboratorio/plan.md`
- [X] T025 Revisar diff exclusivo, `docs/raw/**`, segredos, tarefas e executar `git diff --check`

## Phase 7: Configurações e ações de risco

- [X] T026 [US3] Ampliar DTOs públicos e contratos de confirmação em `src/types/laboratory.type.ts` e `src/app/api/server/laboratories/laboratory.contracts.ts`
- [X] T027 [US3] Implementar consulta protegida de membros e autorização de proprietário em `src/app/api/server/services/laboratories.service.ts`
- [X] T028 [US3] Implementar GET/PATCH/DELETE protegidos em `src/app/api/laboratories/[laboratoryId]/route.ts`
- [X] T029 [US3] Implementar popup, avatares por iniciais, rolagem e confirmações de risco em `src/components/workspace/laboratory-workspace.tsx`
- [X] T030 [US3] Atualizar cobertura de contratos, serviço e handlers em `tests/unit/` e `tests/integration/`
- [ ] T031 Validar typecheck, testes, build e comportamento visual do popup em `specs/002-criar-laboratorio/quickstart.md` (automação aprovada; navegador autenticado pendente)

## Dependencies

```text
T001 -> T002/T003/T004 -> T005 -> T006 -> T007 -> T008 -> T009
T009 -> US1(T010-T012) -> US2(T013-T014) -> US3(T015-T018) -> T019-T025
```

- T002–T004 são paralelas por arquivos distintos.
- T007 pode avançar após o modelo estar definido; T008 consome seus conceitos e T009 consome T008.
- T015 pode ser desenvolvido em paralelo à preparação T017/T018 após o contrato GET/POST estar estável.
- T021 é sequencial (`lint` → `typecheck` → `build`); falha interrompe o gate correspondente.

## Traceability

| Scope | Tasks |
|---|---|
| FR-001–FR-005, SC-001–SC-002, SC-008 | T002–T012 |
| FR-006–FR-009, SC-003–SC-004, SC-007 | T003–T004, T007–T014 |
| FR-010–FR-013, SC-005–SC-006 | T015–T018, T023 |
| FR-014 and stacked boundaries | T001, T024–T025 |

## Implementation Strategy

MVP é US1 após fundação; US2 prova isolamento/persistência; US3 conecta o workspace. Nenhuma tarefa marca a IMP-001, aplica migration remota, faz commit, push, PR, merge ou rebase.
