# Implementation Plan: Exclusão da própria conta

**Branch**: `feat/account-deletion` | **Date**: 2026-10-05 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/013-account-deletion/spec.md`

**Note**: This template is filled in by the `$speckit-plan` command; its definition describes the execution workflow.

## Summary

Remover fisicamente apenas a própria conta ativa, com senha atual e confirmação
explícita, quando não houver vínculos científicos/administrativos. Sessão normal
ou restrita de verificação pode realizar somente este fluxo. Exclusão serializável
revalida versão/estado/senha e último administrador, limpa insumos de autenticação
e cancela/remove mensagens da conta na mesma transação. Vínculos são apresentados
por categoria/contagem; não há remoção em cascata de domínio.

Migration aditiva identifica o dono das mensagens de contas, incluindo avisos sem
challenge. Mensagens antigas sem dono impedem temporariamente a exclusão enquanto
estão pendentes/em processamento; não são atribuídas por inferência ou decifradas
em massa. Conteúdo/MAC e R1 permanecem compatíveis.

## Technical Context



**Language/Version**: TypeScript, Node 24.19.0.

**Primary Dependencies**: Next 16.3.6, React 19.2.4, Prisma 7.4.2, bcrypt 6.

**Storage**: PostgreSQL 17; migration aditiva na outbox e ação do limiter.

**Testing**: node:test, PostgreSQL em schemas sintéticos próprios, Playwright.

**Target Platform**: navegador desktop/móvel e Node server; hosting existente.

**Project Type**: aplicação web fullstack existente.

**Performance Goals**: consulta indexada de vínculos/avisos; confirmação única sem
varrer payloads ou depender do tamanho do histórico de versões de credencial.

**Constraints**: senha não é retida em storage/log; origem confiável e corpo fechado;
cinco tentativas por conta/ingresso/hora e gate global existente; sem locks durante
SMTP; transporte já iniciado pode terminar. Só own fixtures são excluídas em testes.

**Scale/Scope**: um fluxo de titular, duas histórias, um endpoint GET/DELETE, uma tela,
links nas áreas autenticada/restrita e uma migration. Sem exclusão administrativa.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

PASS antes e após design: pedido e escolhas do usuário identificados; branch/spec
próprias; entrega vertical; histórico científico/administrativo não é alterado;
testes proporcionais ao risco; docs/raw e worktrees anteriores preservados.
FR-022 de IMP-009 continua aplicável à gestão administrativa. Não há extensão
com hooks neste checkout. Pesquisa delegada somente leitura conforme esta skill.

## Project Structure

### Documentation (this feature)

```text
specs/013-account-deletion/
├── plan.md              # This file ($speckit-plan command output)
├── research.md          # Phase 0 output ($speckit-plan command)
├── data-model.md        # Phase 1 output ($speckit-plan command)
├── quickstart.md        # Phase 1 output ($speckit-plan command)
├── contracts/           # Phase 1 output ($speckit-plan command)
└── tasks.md             # Phase 2 output ($speckit-tasks command - NOT created by $speckit-plan)
```

### Source Code (repository root)

```text
src/app/api/server/accounts/deletion.contracts.ts
src/app/api/server/accounts/service.ts
src/app/api/server/accounts/deletion.http.ts
src/app/api/auth/account-deletion/route.ts
src/app/(public)/delete-account/page.tsx
src/components/account/account-deletion-form.tsx
prisma/migrations/20261005000100_account_deletion_mail_ownership/migration.sql
tests/unit/account-deletion-contracts.test.ts
tests/integration/account-deletion.test.ts
tests/migration/account-deletion.test.ts
tests/e2e/account-deletion.spec.ts
```

**Structure Decision**: módulo focal reutiliza policy, JWT, CSRF, body e cookies
existentes. Adição de propriedade na mesma outbox, sem segunda fila/transporte.
Links nas áreas autenticada/restrita. Guias da versão instalada do Next lidos.

## Estado inicial e validação

Base completa `40190f751390e2115220944d93fca36e1d96044e`; worktree novo
`C:/projetos/consolidados/HidroFlorestas-account-deletion`, inicialmente limpo.
Worktree Fase 2 retém só AGENTS preexistente; homologação atual preservada.
Instalação própria pelo lock; nenhum dotenv remoto copiado.
Testes em schemas únicos do PostgreSQL próprio de contas, sem alterar bancos
de desenvolvimento/homologação. UI terá banco descartável próprio se necessário.
Gates afetados: unit, integration/concurrency, migration, contracts, R1, type,
lint, build e navegador. Commits candidatos depois de PASS; sem push experimental.
