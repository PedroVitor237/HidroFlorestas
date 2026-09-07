# Implementation Plan: Criação mínima de laboratório

**Branch**: `002-criar-laboratorio` | **Date**: 2026-09-07 | **Spec**: [spec.md](spec.md)

## Summary

Entregar criação e listagem persistentes de laboratórios no workspace para o principal autenticado pela `IMP-001`. A entrada pública contém somente `name`; o servidor deriva `principal.id`, aplica limite de cinco vínculos, cria laboratório e vínculo inicial atomicamente, gera código único não exposto e devolve DTO por allowlist. A listagem é filtrada por vínculo e substitui o mock.

## Stacked Branch Baseline

- Base funcional `origin/001-authenticated-access`, commit `1cfbe43ee28532ed347e0a7129a931adbbc7a802`.
- Dependência temporária da `IMP-001`; a branch remota não havia avançado em 2026-09-07.
- Após o merge da IMP-001: atualizar refs, confirmar o commit em `development`, comparar contratos e solicitar autorização antes de rebase/reconciliação; repetir validações.
- Arquivos compartilhados da autenticação são consumidos, não alterados.
- Riscos: mudança futura de `requireAuth()`, conflito no workspace e pendências E2E/lint/typecheck/build/manual/documentais da IMP-001.
- Revalidação de 2026-09-07: `HEAD` e `origin/001-authenticated-access` permaneceram em `1cfbe43ee28532ed347e0a7129a931adbbc7a802`; nenhum merge ou rebase foi executado.

## Technical Context

**Language/Version**: TypeScript 5, Node.js >=20.9, React 19.2.4  
**Dependencies**: Next.js 16.1.6, Prisma 7.4.2, PostgreSQL/Neon, Tailwind CSS 4, Lucide React  
**Testing**: `node:test`/`tsx`; Playwright E2E  
**Constraints**: identidade somente de `requireAuth()`; DTO mínimo; máximo cinco vínculos; atomicidade; código único não exposto; sem novas dependências  
**Scope**: criação e listagem somente

## Constitution Check

| Principle | Result | Evidence |
|---|---|---|
| I. Hierarquia de fontes | PASS | Decisões humanas registradas; schema é baseline. |
| II. Entrega vertical | PASS | Criação, vínculo, listagem e reload formam resultado pequeno. |
| III. Spec por feature | PASS | Tudo em `specs/002-criar-laboratorio/**`. |
| IV. Evidência e rastreabilidade | PASS | IMP-002 e identificadores Code-First rastreados. |
| V. Qualidade e segurança | PASS | Autorização server-side, isolamento, allowlist e negativos. |
| VI. Documentação evolutiva | PASS | `docs/raw/**` intacto; evidência real no quickstart. |
| VII. Trabalho em equipe | PASS | Stacked branch isolada; auth somente consumida. |

## Architecture and Boundaries

- `GET` e `POST /api/laboratories` serão adapters finos; cada handler chama `requireAuth()` e usa só `principal.id`.
- `laboratory.contracts.ts` valida body `unknown` com chave exata `name`, trim e 1–100 caracteres; define envelopes e serializa apenas `name`, `createdAt`, `status`.
- `laboratories.service.ts` contém casos de uso com dependências injetáveis e adapter Prisma padrão.
- Listagem parte de `ResearchersLinked.userId` e usa `select` explícito.
- Criação usa transação interativa serializável: conta vínculos, recusa em cinco, cria laboratório com `userId` da sessão e cria vínculo inicial. Conflitos serializáveis têm retry limitado.
- Código é gerado criptograficamente e nunca serializado. `accessCode @unique` e migration incremental mínima garantem unicidade sob concorrência; aplicação remota não está autorizada.
- O workspace consulta o servidor como fonte de verdade, exibe loading/erro/retry/vazio/lista, bloqueia dupla submissão e refaz a consulta após sucesso. Não há contexto ativo automático.

## Public Contract

- Entrada: `{ name }`, sem campos extras.
- DTO: `{ name, createdAt, status }`.
- Listagem: `{ success: true, laboratories: DTO[] }`; criação: `{ success: true, laboratory: DTO }`.
- Falha: `{ success: false, code, message }`, sem detalhes internos.
- Status: `200`, `201`, `400`, `401`, `409`, `500`; `Cache-Control: no-store`.

## Testing Strategy

- Unit: parser/serializer e serviço (sucesso, limite, repetição de nome, isolamento, rollback/conflito).
- Integration: handlers injetados; autenticação, extras/`userId`, envelopes/status/no-store/allowlist.
- E2E: fixture allowlisted e banco isolado; criação, reload, isolamento, limite, dupla submissão e UI.
- Gates: Prisma format/validate/generate, unit, integration, lint, typecheck, build, E2E aplicável e diff check.
- Manual: móvel/amplo, teclado/foco, mensagens e Network allowlist.

## Project Structure

```text
prisma/schema.prisma
prisma/migrations/<timestamp>_unique_laboratory_access_code/migration.sql
src/app/api/laboratories/route.ts
src/app/api/server/laboratories/laboratory.contracts.ts
src/app/api/server/services/laboratories.service.ts
src/types/laboratory.type.ts
src/components/workspace/laboratory-workspace.tsx
src/app/(private)/workspace/page.tsx
tests/unit/laboratory-contracts.test.ts
tests/unit/laboratories-service.test.ts
tests/integration/laboratories-route.test.ts
tests/e2e/create-laboratory.spec.ts
tests/fixtures/laboratories.ts
```

## Post-design Constitution Check

PASS nos sete princípios. O desenho preserva a IMP-001, adiciona apenas a constraint materialmente necessária e vincula riscos a validação.

## Complexity Tracking

| Item | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| Constraint única + migration | Código único foi confirmado. | Checagem sem constraint sofre corrida. |
| Transação serializável + retry | Limite cinco e atomicidade sob concorrência. | Count/create comum pode exceder o limite. |
