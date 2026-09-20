# Evidência de implementação: IMP-009

## Estado inicial e autorização

- Autorização: pedido explícito do usuário para executar `speckit-implement`, com navegação e padrão visual preservados.
- Branch: `009-user-administration`.
- Baseline preservada: `4e70c736cd38fc3ee794a6700539deaa64fa27d6`.
- Escopo compartilhado necessário: autenticação, middleware administrativo, schema Prisma, layout/sidebar e testes correspondentes.
- `docs/raw/**` e `specs/006-*`: sem alterações observadas no fechamento desta execução.
- Nenhum commit, push, PR, merge ou migração em banco remoto foi realizado.

## Inventário de autoridade e compatibilidade

- Autoridade global de runtime: `User.role === ADMIN`, revalidada no banco com `status === ACTIVE` por operação.
- Estado de autenticação: `auth.core.ts` rejeita qualquer estado diferente de `ACTIVE`; `users.service.ts` recarrega papel e estado atuais.
- Middleware global: `admin.middleware.ts` delega exclusivamente à política central `requireGlobalAdmin`.
- Autoridade laboratorial: continua separada em `ResearchersLinked.role`; não concede administração global.
- `User.isAdmin`: permanece na persistência e em fixtures/escritores legados como compatibilidade. Não é lido pela nova política de autorização. O fluxo de superadmin grava `role: ADMIN` e `status: ACTIVE`; a remoção física da coluna permanece em seguimento técnico separado.
- Sessão: o papel não é aceito como autoridade enviada pelo cliente; o principal interno é reconstruído a partir do usuário atual.
- Projeções administrativas: selects e DTOs explícitos; senha, hash, token e `isAdmin` não são serializados.

## Implementação observada

- Migração aditiva com `User.revision`, eventos funcionais de auditoria, chaves, checks, índices e trigger de imutabilidade.
- Preflight interrompe contradições entre `role` e `isAdmin` sem promover dados automaticamente.
- APIs de lista, detalhe, mudança de estado, mudança de papel e histórico com `Cache-Control: no-store`.
- Paginação keyset estável por `createdAt DESC, id DESC`, cursor opaco ligado aos filtros e respostas de erro controladas.
- Mutações serializáveis com revisão esperada, proibição de autoalteração, proteção do último administrador ativo e auditoria na mesma transação.
- Página protegida e responsiva com busca, filtros, estados de carregamento/vazio/erro, detalhe, histórico, confirmações com justificativa, foco contido/restaurado e navegação visível apenas para ADMIN global.

## Validação executada em 2026-09-19

| Gate | Resultado |
|---|---|
| `npm ci` | passou; npm reportou 30 vulnerabilidades de dependências (2 baixas, 8 moderadas, 19 altas, 1 crítica); nenhuma correção automática foi aplicada |
| `npx prisma generate` | passou |
| `npm run typecheck` | passou após declarar o tipo dos assets PNG já existentes |
| `npm run lint` | passou com 4 avisos preexistentes, sem erro |
| `npm run test:unit` | passou: 41/41 arquivos antes da adição final do teste de superadmin; testes direcionados posteriores também passaram |
| `npm run test:integration` | 14/15 passaram; a única falha foi o teste PostgreSQL preexistente que exige `TEST_DATABASE_CONFIRMATION`; a nova suíte de rotas passou |
| `npm run build` | passou com acesso autorizado ao Google Fonts; todas as cinco APIs e a página administrativa foram compiladas |
| `git diff --check` | passou |

## Gates não concluídos

- Migração PostgreSQL real e testes de corrida: não executados porque nenhum alvo isolado/autorização de dados foi fornecido nesta execução.
- E2E autenticado: não executado por ausência de fixtures/ambiente autorizado de autenticação e banco.
- p95 com 50 contas: não medido sem banco isolado.
- Revisão humana com teclado, viewport móvel e tecnologia assistiva: `NAO_VERIFICADO`; automação não substitui essa evidência.
- Remoção física de `User.isAdmin`: fora da entrega funcional atual e dependente de autorização separada, backup verificado e prova de zero consumidores.

## Pendência de decisão

- A recomendação de tornar `PENDING` exclusivamente pré-ativação e impedir retorno a esse estado não foi confirmada como decisão normativa. A implementação preserva as transições entre os quatro estados conforme o contrato aprovado, até decisão posterior.
