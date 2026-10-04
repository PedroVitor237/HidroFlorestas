# Tasks: Verificação e recuperação de contas

**Input**: [spec.md](spec.md), [plan.md](plan.md), pesquisa/modelo/contratos; pedido integral de Execução 2. Testes explicitamente exigidos. Nenhum commit antes Gate A.

## Phase 1: Setup

- [x] T001 Registrar baseline/read-only original e decisões aprovadas em specs/012-account-verification-recovery/research.md.
- [x] T002 Gerar spec/plan/modelo/contratos pelo fluxo instalado em specs/012-account-verification-recovery/.
- [x] T003 [P] Preparar cluster/bancos/harness privados isolados em scripts/accounts-validation.ps1, scripts/accounts-local-postgresql.ps1 e scripts/accounts-database-setup.ts, preservando defaults históricos.

## Phase 2: Foundational

- [x] T004 Testar política/prova/sessões/idempotência/CSRF em tests/unit/account-contracts.test.ts, tests/unit/session.test.ts, tests/unit/account-security-review.test.ts e tests/mail/account-proof.test.ts.
- [x] T005 Modelar coorte/canônico/request/template e constraint de ações com migrations aditivas em prisma/schema.prisma, prisma/migrations/20261004000200_account_verification_recovery/migration.sql e prisma/migrations/20261004000300_account_rate_limit_actions/migration.sql.
- [x] T006 Implementar política/crypto/validação em src/app/api/server/accounts/policy.ts, proof.ts e contracts.ts.
- [x] T007 Ativar JWT versionado e guard atual em src/app/api/server/auth/session.ts, auth.core.ts e src/app/api/server/middlewares/auth.middleware.ts.
- [x] T008 [P] Verificar bootstrap/upgrade/constraints/collision em tests/migration/account-verification-recovery.test.ts e baseline formal pelo runner Bootstrap.

## Phase 3: US1 Cadastrar/verificar/retomar

Objetivo/teste independente: cadastro/challenge/outbox atomicamente, acesso privado negado até confirmação, reenvio e retomada completos.

- [x] T009 [US1] Escrever testes Pg de signup/idempotência/attempts/corridas em tests/integration/account-verification-recovery.test.ts.
- [x] T010 [US1] Implementar criação/login/estado/consumo/reenvio transacionais em src/app/api/server/accounts/service.ts.
- [x] T011 [US1] Implementar handlers fechados/CSRF/cookies em src/app/api/server/accounts/http.ts e src/app/api/auth/email-verification/.
- [x] T012 [P] [US1] Integrar telas/context/types e retomada em src/app/register/page.tsx, src/app/login/page.tsx, src/app/verify-email/page.tsx, src/types/auth.type.ts e src/contexts/auth.context.tsx.
- [x] T013 [P] [US1] Testar contrato/UI/teclado/mobile em tests/contract/account-api.test.ts e tests/e2e/account-verification-recovery.spec.ts.

## Phase 4: US2 Recuperar senha

Objetivo/teste independente: request neutro, recebimento por transporte, link não consumido por GET, reset e revogação em outro contexto.

- [x] T014 [US2] Testar neutralidade/expiry/concurrency/rollback/version em tests/integration/account-verification-recovery.test.ts.
- [x] T015 [US2] Implementar request/consumo/reset+notice em src/app/api/server/accounts/service.ts e src/app/api/auth/password-reset/.
- [x] T016 [US2] Acrescentar template sem prova em src/app/api/server/mail/contracts.ts, templates.ts, outbox.ts e worker.ts preservando os fences R1; manutenção limitada em src/app/api/server/accounts/maintenance.ts.
- [x] T017 [P] [US2] Entregar solicitação/captura segura de fragmento em src/app/forgot-password/page.tsx e src/app/reset-password/page.tsx.
- [x] T018 [P] [US2] Testar entrega/segundo contexto/replay/no-referrer em tests/e2e/account-verification-recovery.spec.ts.

## Phase 5: US3 Troca autenticada e legado

Objetivo/teste independente: senha atual obrigatória, versão incrementada, notice, login legado sem novo mínimo e coorte limitada.

- [x] T019 [US3] Centralizar writers e revalidar hash/version no login em src/app/api/server/services/auth.service.ts, users.service.ts e src/app/api/server/scripts/superadmin.ts.
- [x] T020 [US3] Implementar rota de troca e sessão revogada em src/app/api/auth/change-password/route.ts.
- [x] T021 [P] [US3] Entregar tela e acesso em src/app/(private)/change-password/page.tsx.
- [x] T022 [US3] Testar matriz estados/admin/internal/coorte/version/login-vs-reset em tests/integration/account-verification-recovery.test.ts, tests/migration/account-verification-recovery.test.ts e tests/unit/auth-core.test.ts.

## Phase 6: Gate A e revisão do candidato

- [x] T026 Executar matriz Gate A sequencial e instalação limpa, R1/regressão/E2E/HTTPS/typecheck/lint/build/audits; registrar specs/012-account-verification-recovery/validation-results.json.
- [x] T027 Revisar diff/segredos/bundle/ownership e atualizar rastreabilidade em specs/012-account-verification-recovery/implementation-evidence.md.

## Phase 7: US4 Homologação

Objetivo/teste independente: URL estável autorizada, bancos próprios, e-mails automáticos e duas jornadas reais. Preparação documental/configuração de T023 pode avançar em paralelo antes do Gate A; publicação T024 exige candidato já verificado e a etapa de commits de T028.

- [x] T023 [P] [US4] Preparar runbook/config/scheduler/destinos em docs/operations/account-homologation-runbook.md, .env.accounts.example e specs/012-account-verification-recovery/remote-checkpoint.md.
- [ ] T024 [US4] Publicar candidato após Gate A e configurar banco/secrets/worker nos destinos autorizados, registrando specs/012-account-verification-recovery/implementation-evidence.md.
- [ ] T025 [US4] Comprovar duas invocações automáticas, recuperação backlog e jornadas reais na evidência da feature.

## Phase 8: Commits e handoff

IDs e estados preservados. A etapa de commits de T028 ocorre após Gate A e antes de T024; o fechamento do handoff/estado final depende de T025 e Gate B, por isso o item permanece aberto até ambas as partes estarem verificadas.

- [ ] T028 Criar commits candidatos coerentes após Gate A, e fechar specs/012-account-verification-recovery/handoff.md e estado Gate B em docs/operations/account-homologation-runbook.md.

Parte de commits candidatos de T028 executada: `d341fe402323ddfda705b8546e9aa55886815502`, após Gate A; handoff local e bloqueios registrados. O item continua aberto pelo fechamento dependente de T024/T025/Gate B. Push/deploy/PR não executados. Etapas externas mínimas estão na [evidência](implementation-evidence.md); não representam pedido de nova aprovação das políticas/destinos já confirmados.

## Evidência de implementação e verificações focais

Os itens marcados cobrem o código/artefatos implementados e as verificações focais, não aceite final do candidato. Execuções em 2026-10-04: unitários 273 PASS (incluem contratos novos e revisão independente de sessões); provas/mail 5 PASS; contrato HTTP 4 PASS; auditoria independente reportou integração de contas 22/22 PASS e migration 6/6 PASS. Unitários de guard local 2 PASS e parser UI 3 PASS. O focal UI12 passou 7/7, snapshot `36f50445eb0fdc925a9781ac8575676fe2659c3ea479dbfcc6155da174413f25`, de 22:22:18.859 a 22:22:55.634 UTC: jornadas reais locais de verificação/reset/troca, entrega pelo worker com transporte sintético, revogação em outro contexto, recuperação antes de verificar e privacidade de URL/GET/storage.

T008 verificado no fingerprint `2df65d3ea2fff2e9f7579d18de5f0f36d5c6500a426524f14822af8cd7bee228`: bootstrap formal/setup de 11 migrations concluídas sem falha e checksums iguais; Migration 33/33 PASS, incluindo seis cenários 012/013. No mesmo fingerprint, Integration 157/157 PASS (25 cenários de contas), Contract 6/6 PASS e R1 17/17 PASS, reportados pela auditoria independente com registros do collector entre 22:28:04.679 e 22:29:42.493 UTC. Isso cobre os early-returns de reset sem escrita excedente.

T013/T018 também estão verificados pela regressão final E2E 62/62. T023/T026/T027 foram concluídos no fingerprint `cc77f24e65c66fbe2b56e248698ea2b710400d92490cfa352ba6fe5fc651dbaa`: 15 gates locais PASS, incluindo HTTPS 2/2 e schema audit zero; revisão independente do scheduler e exercício sintético 17/17 PASS. T024/T025 e o fechamento completo de T028 continuam pendentes de provisionamento, publicação e jornadas reais. Aprovação do checkpoint não comprova essas ações. Falhas preliminares/snapshots anteriores permanecem na [evidência final](implementation-evidence.md) e não foram promovidos a PASS do candidato.

## Dependencies & Execution Order

Setup → fundação → US1 → US2 → US3 → Gate A → US4/Gate B. UI/contratos e infra podem avançar em paralelo com ownership separado. Escritas em service.ts/schema/sharedauth são sequenciais. Testes Pg e E2E/build que compartilham banco/porta/.next são sequenciais.

## Parallel Example

Após contratos fechados: implementação own backend/schema/testes; policy_audit own UI/types/context/E2E; foundation_audit own infra/fixtures/Pg/ignore; root own operação/remotos/evidências. Sem edição concorrente dos mesmos arquivos.

## Implementation Strategy

Validar incremento US1 local, depois reset/troca e regressão completa. Persistir até jornada integral Gate B; qualquer bloqueio externo é documentado sem declarar conclusão integral. Gate A não depende de autorização redundante de commits; Gate B depende do checkpoint já aprovado e dos recursos concretos.
