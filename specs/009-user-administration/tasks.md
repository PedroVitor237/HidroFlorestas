# Tasks: Administracao de usuarios

**Input**: `spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`  
**Tests**: required by the feature's measurable security, concurrency, accessibility and migration criteria. Write relevant tests first and observe failure.

## Phase 1: Baseline Characterization and Coordination

**Purpose**: prove the current authority behavior and reserve shared paths before changing them.

- [X] T001 Record implementation authorization, ownership of shared auth/schema paths, baseline commit and preservation checks in `specs/009-user-administration/implementation-evidence.md`
- [X] T002 Inventory every `isAdmin`, `User.role`, `User.status`, session-claim and global-admin consumer/writer in `specs/009-user-administration/implementation-evidence.md`
- [X] T003 [P] Add characterization tests for current authentication state revalidation and internal principal authority in `tests/unit/auth-core.test.ts` and `tests/integration/auth-guard.test.ts`
- [X] T004 [P] Add characterization tests for current superadmin role/isAdmin writes without executing provisioning in `tests/unit/superadmin-contract.test.ts`
- [X] T005 [P] Add sensitive-field regression assertions for auth/admin projections in `tests/unit/auth-contracts.test.ts`

---

## Phase 2: Foundational Authority, Persistence and Contracts

**Purpose**: establish shared, blocking foundations for every story.

- [ ] T006 Write migration preflight tests for all four `role/isAdmin` consistency classes and non-sensitive diagnostics in `tests/unit/user-administration-migration-preflight.test.ts`
- [ ] T007 Add failing PostgreSQL migration tests for account revision, audit relations, constraints and rollback-on-failure behavior in `tests/migration/user-administration-migration.test.ts`
- [X] T008 Implement the reviewed revision/audit schema and preflight migration in `prisma/schema.prisma` and `prisma/migrations/<timestamp>_user_administration/migration.sql`
- [ ] T009 Run the migration against an authorized isolated PostgreSQL target and record actual migration/persistence evidence in `specs/009-user-administration/implementation-evidence.md`
- [X] T010 [P] Add failing unit tests for role/status authority, laboratory-role denial and client-claim rejection in `tests/unit/global-authority.test.ts`
- [X] T011 Implement the centralized ACTIVE+ADMIN global policy and typed errors in `src/app/api/server/user-administration/global-authority.ts`
- [X] T012 Update current-identity selects and the internal authenticated principal to carry current `role` while keeping public DTOs unchanged in `src/app/api/server/services/users.service.ts` and `src/app/api/server/auth/auth.core.ts`
- [X] T013 Replace `isAdmin` authorization in `src/app/api/server/middlewares/admin.middleware.ts` with the centralized current-role policy and controlled 401/403 semantics
- [X] T014 [P] Add parsers, allowlisted serializers, filter-bound cursor helpers, stable internal error/recovery mapping and unit tests in `src/app/api/server/user-administration/user-administration.contracts.ts` and `tests/unit/user-administration-contracts.test.ts`
- [X] T015 [P] Add OpenAPI conformance and forbidden-field tests in `tests/unit/user-administration-openapi-contract.test.ts`
- [ ] T016 [P] Add fixture factories with synthetic accounts, revisions, roles and states in `tests/fixtures/user-administration.ts`
- [X] T017 Implement transaction-facing service foundations, actor revalidation and shared errors in `src/app/api/server/services/user-administration.service.ts`

**Checkpoint**: no story starts until migration, central authority, safe projections and transaction foundation pass.

---

## Phase 3: User Story 1 - Consultar contas com seguranca (Priority: P1) MVP

**Goal**: authorized list, search, filters and detail with no sensitive data.

**Independent Test**: exercise list/detail as global ADMIN and denied principals without any mutation.

- [ ] T018 [P] [US1] Add service tests for canonical `createdAt DESC, id DESC` cursor ordering, search, filters, detail, not-found and projection allowlist in `tests/unit/user-administration-read-service.test.ts`
- [ ] T019 [P] [US1] Add route integration tests for 200/400/401/403/404/500 and laboratory-admin denial in `tests/integration/admin-users-read-routes.test.ts`
- [X] T020 [US1] Implement purpose-specific list/detail queries with explicit selects and opaque cursor pagination in `src/app/api/server/services/user-administration.service.ts`
- [X] T021 [US1] Implement GET list handler and route in `src/app/api/admin/users/route.handlers.ts` and `src/app/api/admin/users/route.ts`
- [X] T022 [US1] Implement GET detail handler and route in `src/app/api/admin/users/[userId]/route.handlers.ts` and `src/app/api/admin/users/[userId]/route.ts`
- [ ] T023 [P] [US1] Add accessible query/filter/pagination state helpers with tests in `src/components/user-administration/user-list-state.ts` and `tests/unit/user-list-state.test.ts`
- [X] T024 [US1] Implement the server-protected users page, list, filters, empty/error/loading states and detail navigation in `src/app/(private)/dashboard/admin/users/page.tsx` and `src/components/user-administration/user-administration-page.tsx`
- [X] T025 [US1] Add global-ADMIN-only sidebar visibility without treating it as authorization in `src/components/sidebar/index.tsx`
- [ ] T026 [US1] Add E2E coverage for list/search/filter/detail, direct API/page denial, responsive layout and keyboard focus in `tests/e2e/user-administration-read.spec.ts`

**Checkpoint**: US1 is demoable without enabling mutations.

---

## Phase 4: User Story 2 - Administrar estado da conta (Priority: P2)

**Goal**: atomic, concurrent and audited account-state changes with stale-session denial.

**Independent Test**: mutate another account through every state, then cover self-change, no-op, stale revision and prior session.

- [ ] T027 [P] [US2] Add failing service tests for state transitions, reason bounds, self-change, no-op, revision conflict and atomic audit in `tests/unit/user-administration-status-service.test.ts`
- [ ] T028 [P] [US2] Add integration tests for PATCH status 200/400/401/403/404/409/500, enumerated conflict recovery and non-destructive rollback in `tests/integration/admin-user-status-route.test.ts`
- [ ] T029 [P] [US2] Add concurrent integration tests proving the documented validation order, one winner per revision, enumerated conflict recovery and atomic mutation/audit in `tests/integration/user-administration-concurrency.test.ts`
- [X] T030 [US2] Implement transactional status mutation, revision increment, no-op and audit append in `src/app/api/server/services/user-administration.service.ts`
- [X] T031 [US2] Implement PATCH status handler and route in `src/app/api/admin/users/[userId]/status/route.handlers.ts` and `src/app/api/admin/users/[userId]/status/route.ts`
- [X] T032 [US2] Extend session/auth tests and implementation so PENDING/INACTIVE/BLOCKED existing sessions fail on next protected validation in `tests/unit/auth-core.test.ts` and `src/app/api/server/auth/auth.core.ts`
- [ ] T033 [US2] Implement accessible status confirmation with contained/restored focus, Escape cancellation, result/alert focus, reason, enumerated conflict recovery and textual announcements in `src/components/user-administration/user-administration-page.tsx`
- [ ] T034 [US2] Add E2E coverage for status transitions, no-op, conflict recovery, self-change denial and stale-session rejection in `tests/e2e/user-administration-status.spec.ts`

---

## Phase 5: User Story 3 - Administrar papel global (Priority: P3)

**Goal**: audited global-role changes with no self-change and atomic last-active-admin protection.

**Independent Test**: promote/rebalance another account, attempt self-change, race the last-admin invariant and deny laboratory authority.

- [ ] T035 [P] [US3] Add failing service tests for role changes, self-change, no-op and DEVELOPER/MODERATOR non-authority in `tests/unit/user-administration-role-service.test.ts`
- [ ] T036 [P] [US3] Add integration tests for PATCH role and current-session revalidation in `tests/integration/admin-user-role-route.test.ts`
- [ ] T037 [P] [US3] Add two-request race tests for last-active-admin preservation across role and status mutations in `tests/integration/user-administration-last-admin.test.ts`
- [X] T038 [US3] Implement transactional role mutation and serialized last-active-admin invariant in `src/app/api/server/services/user-administration.service.ts`
- [X] T039 [US3] Implement PATCH role handler and route in `src/app/api/admin/users/[userId]/role/route.handlers.ts` and `src/app/api/admin/users/[userId]/role/route.ts`
- [ ] T040 [US3] Implement accessible role confirmation with contained/restored focus, Escape cancellation, result/alert focus, reason, last-admin/conflict recovery and textual announcements in `src/components/user-administration/user-administration-page.tsx`
- [X] T041 [US3] Update internal authority revalidation and admin navigation after rebalancing in `src/app/api/server/middlewares/admin.middleware.ts` and `src/components/sidebar/index.tsx`
- [ ] T042 [US3] Add E2E coverage for promotion, rebalancing, last-admin race outcome, self-change and laboratory-admin denial in `tests/e2e/user-administration-role.spec.ts`

---

## Phase 6: User Story 4 - Consultar rastreabilidade (Priority: P4)

**Goal**: paginated, minimized functional audit history for global ADMIN only.

**Independent Test**: query events from status/role fixtures and verify denied roles and failed operations do not appear as success.

- [ ] T043 [P] [US4] Add service tests for `createdAt DESC, id DESC` audit ordering and two-value cursor, target scoping, allowlist and absence of failed/no-op events in `tests/unit/user-administration-audit-service.test.ts`
- [ ] T044 [P] [US4] Add route integration tests for audit 200/400/401/403/404/500 in `tests/integration/admin-user-audit-route.test.ts`
- [X] T045 [US4] Implement purpose-specific audit query and stable cursor in `src/app/api/server/services/user-administration.service.ts`
- [X] T046 [US4] Implement GET audit handler and route in `src/app/api/admin/users/[userId]/audit/route.handlers.ts` and `src/app/api/admin/users/[userId]/audit/route.ts`
- [ ] T047 [US4] Implement accessible audit history with empty/error/loading and pagination states in `src/components/user-administration/user-administration-page.tsx`
- [ ] T048 [US4] Add E2E coverage for status/role audit records, failed/no-op exclusion and denied access in `tests/e2e/user-administration-audit.spec.ts`

---

## Phase 7: Legacy Removal, Hardening and Reconciliation

- [X] T049 Update the interactive superadmin flow to derive global authority from `role` and retain a compatibility write only while proven necessary in `src/app/api/server/scripts/superadmin.ts`
- [ ] T050 Migrate remaining types, consumers, fixtures and tests away from `isAdmin`, then record a zero-consumer search with false positives classified in `specs/009-user-administration/implementation-evidence.md`
- [ ] T051 In a separately authorized technical follow-up after the functional IMP-009 and T050, add and validate the migration that removes `User.isAdmin` with verified backup and non-destructive compensation rules in `prisma/schema.prisma`, `prisma/migrations/<later_timestamp>_remove_legacy_is_admin/migration.sql` and `tests/migration/user-administration-migration.test.ts`
- [ ] T052 [P] Run forbidden-field/security regression coverage for every admin response, audit event and error in `tests/unit/user-administration-openapi-contract.test.ts` and `tests/integration/admin-users-security.test.ts`
- [ ] T053 [P] Add p95 query validation for pages of 50 synthetic accounts without logging personal data in `tests/integration/user-administration-performance.test.ts`
- [ ] T054 Run all commands in `specs/009-user-administration/quickstart.md` and record each result and omitted human gate in `specs/009-user-administration/implementation-evidence.md`
- [ ] T055 Perform manual keyboard, responsive and assistive-technology review without inferring results; record evidence/status in `specs/009-user-administration/implementation-evidence.md`
- [X] T056 Reconcile actual implementation, contracts, migrations, validation results and remaining work in `specs/009-user-administration/spec.md`, `plan.md`, `tasks.md` and `implementation-evidence.md`
- [X] T057 Confirm final diff changes only authorized IMP-009 paths, preserves `docs/raw/**` and IMP-006, contains no secrets, and leaves global documentation follow-ups recorded in `specs/009-user-administration/implementation-evidence.md`

---

## Dependencies & Execution Order

- Phase 1 precedes all writes and stops on unknown ownership or unclassified contradiction.
- Phase 2 blocks all stories. T008 depends on T006-T007; T011-T013 depend on role availability design; T017 depends on T008, T011 and T014.
- US1 can ship after Phase 2 as the read-only MVP.
- US2 and US3 both depend on Phase 2 and reuse the same service file, so one owner should sequence them even though their tests/UI files can be prepared independently.
- US4 query work can begin after Phase 2; its meaningful end-to-end evidence depends on US2/US3 producing events.
- T049-T051 occur only after every authority consumer uses role. T054-T057 follow all selected stories.

## Parallel Opportunities

- T003-T005; T010, T014-T016; tests and UI-state helpers within each story are parallel when they do not edit shared service/auth files.
- API route files for distinct stories are separate, but `user-administration.service.ts`, `auth.core.ts`, `admin.middleware.ts`, `schema.prisma` and the sidebar require coordinated ownership.
- IMP-006 is never a parallel dependency or source.

## Implementation Strategy

1. Foundation first with characterization and migration gates.
2. Deliver US1 read-only MVP and validate independently.
3. Add US2, then US3 under one transaction-service owner.
4. Add US4 audit visibility.
5. Remove legacy only after zero-consumer proof; run all gates and reconcile.

No task is complete until its stated test/evidence is observed. Do not mark human validation complete from automation.
