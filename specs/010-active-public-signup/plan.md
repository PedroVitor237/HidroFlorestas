# Implementation Plan: Cadastro público ativo

**Branch**: `development` | **Date**: 2026-09-28 | **Spec**: [spec.md](spec.md)
**Input**: decisão explícita da equipe no pedido anexado de 2026-09-28.

## Summary

Definir `ACTIVE` na criação feita por `AuthService.signUp`, manter o default Prisma `PENDING`, preservar a regra de login e projetar somente a identidade pública na resposta. Exercitar cadastro e login com dependências em memória, sem escrita no Neon.

## Technical Context

- **Language/Version**: TypeScript; Node conforme `package.json`.
- **Primary Dependencies**: Next.js, Prisma, bcrypt e autenticação existente.
- **Storage**: PostgreSQL/Neon no produto; testes unitários em memória.
- **Testing**: `node:test`, typecheck, ESLint e Prisma generate.
- **Target Platform**: aplicação web Next.js existente.
- **Project Type**: aplicação full-stack existente.
- **Performance Goals**: sem nova meta de desempenho; escopo de regra de criação.
- **Constraints**: sem migration, escrita real no banco, alteração do default ou revisão geral da autenticação.
- **Scale/Scope**: um fluxo público de cadastro e testes focais; fluxos administrativos preservados.

## Constitution Check

| Princípio | Resultado |
|---|---|
| Hierarquia de fontes | Decisão atual do pedido prevalece no recorte; Code-First em revisão e código como baseline. |
| Entrega vertical e spec por funcionalidade | `specs/010-active-public-signup/**` contém a entrega e sua rastreabilidade a `CF-PRD-FR-001`/`CF-UC-001`. |
| Segurança e evidência | Testes verificam hash, DTO público e estados inelegíveis sem alterar banco real. |
| Documentação evolutiva | Registrar `TD-017` em `TECH_DECISIONS.md` e ajustar somente a descrição Code-First diretamente afetada. |
| Branch própria | Exceção por instrução explícita da equipe de trabalhar na `development`; nenhum push ou merge. |

Revisão pós-design: os mesmos limites permanecem atendidos.

## Project Structure

```text
specs/010-active-public-signup/
  spec.md
  plan.md
  research.md
  data-model.md
  contracts/public-signup.md
  quickstart.md
  tasks.md
src/app/api/server/services/auth.service.ts
tests/unit/auth-service.test.ts
TECH_DECISIONS.md
docs/code-first-prd/specifications/use-cases.md
```

**Structure Decision**: Reutilizar o serviço e os contratos de autenticação já conectados; nenhum modelo ou rota nova.
