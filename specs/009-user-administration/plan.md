# Implementation Plan: Administracao de usuarios

**Branch**: `009-user-administration` | **Date**: 2026-09-19 | **Spec**: [spec.md](spec.md)

## Summary

Implementar uma superficie administrativa exclusiva para `User.role = ADMIN`, com consultas allowlisted, mudancas concorrentes de estado e papel, protecao atomica do ultimo ADMIN ativo e auditoria funcional. A implementacao centraliza autoridade em `role`, revalida estado/papel no servidor e remove `isAdmin` por migration posterior validada em branch Neon isolada.

## Technical Context

**Language/Version**: TypeScript 5, Node.js >=20.9.0  
**Primary Dependencies**: Next.js 16.1.6, React 19.2.4, Prisma 7.4.2, PostgreSQL/Neon, JWT existente, Tailwind 4, Lucide React  
**Storage**: PostgreSQL via Prisma; migrations para revisao concorrente/auditoria e remocao posterior de `isAdmin`, ambas validadas em PostgreSQL isolado
**Testing**: Node test runner + `tsx`, Playwright, ESLint, TypeScript, build Next.js  
**Target Platform**: aplicacao web full-stack responsiva  
**Performance Goals**: p95 percebido de ate 2 s para consultas de ate 50 contas  
**Constraints**: negacao por padrao, revalidacao server-side, allowlists, mutacao/auditoria atomicas, concorrencia, sem dependencia nova prevista  
**Scale/Scope**: quatro jornadas, cinco endpoints, shell administrativo com visao geral e pagina de usuarios, migracao de legado e testes proporcionais

## Constitution Check

*GATE: aprovado antes da pesquisa e reavaliado depois do desenho.*

| Principle | Evaluation |
|---|---|
| Source hierarchy | PASS — mandato define o recorte; Code-First e codigo sao classificados, nao promovidos. |
| Vertical delivery | PASS — consulta, mutacoes e auditoria sao verificaveis; RBAC generico fica fora. |
| Per-feature artifacts | PASS — tudo fica em `specs/009-user-administration/**`. |
| Evidence and traceability | PASS — decisoes, evidencias, recomendacoes e riscos permanecem separados. |
| Quality and security | PASS — fronteira server-side, minimizacao, concorrencia e testes sao explicitos. |
| Evolving documentation | PASS — `docs/raw/**` e documentos globais permanecem intactos. |
| Teamwork | PASS — branch/worktree exclusivos; arquivos compartilhados so na futura implementacao coordenada. |

**Post-design re-check**: PASS; modelo, contratos e quickstart nao ampliam o recorte.

## Baseline Inventory

| Concern | Observed baseline | Planned destination |
|---|---|---|
| Global authority | `admin.middleware.ts` verifica `isAdmin` | politica central verifica `role === ADMIN` e `status === ACTIVE` atuais |
| Principal | `auth.core.ts` carrega `isAdmin`, nao `role` | principal interno allowlisted carrega `role`; DTO publico nao muda |
| User queries | selects de auth usam `isAdmin`; metodos genericos podem retornar registro inteiro | selects por finalidade e projecao administrativa fechada |
| Session | JWT contem apenas `userId`; auth reconsulta identidade | preservar claim de identidade e reconsultar estado/papel |
| Superadmin | grava `role` e `isAdmin` | compatibilidade temporaria, depois `role` somente |
| Laboratory role | `ResearchersLinked.role` contextual | nunca satisfaz autoridade global |
| Audit/version | nao observados | revisao e evento imutavel na mesma transacao |

## Authorization and Session Design

1. `requireAuth` autentica pelo identificador da sessao e registro atual.
2. Politica global central aceita somente `ACTIVE + ADMIN`; autoridade enviada pelo cliente e ignorada.
3. Handlers dependem da politica e servicos especializados; visibilidade na UI nao substitui API.
4. Servico revalida ator/alvo e aplica autoalteracao, revisao esperada e ultimo ADMIN dentro da transacao.
5. Mudancas de bloqueio, inativacao ou papel valem na proxima validacao protegida; nao se promete revogacao push instantanea.

## Safe `isAdmin` Transition

1. Caracterizar comportamento e inventariar toda leitura/gravação/tipo/teste de `isAdmin`, `role`, `status` e sessao.
2. Executar preflight que detecta contradicoes sem corrigi-las silenciosamente.
3. Fazer principal e politica usarem `role` atual; manter compatibilidade apenas para consumidor ainda nao migrado.
4. Migrar middleware, servicos, script e testes; confirmar zero consumidores.
5. Remover gravacoes e, somente em migration posterior revisavel, remover a coluna.

Rollback deve ser por fase e nunca reintroduzir concessao via dado contraditorio. Nenhum rollback pode apagar eventos de auditoria persistidos, reduzir ou reinicializar `Account.revision`, restaurar autorizacao por `isAdmin` ou reconstruir `isAdmin` a partir de registros contraditorios. Mudanca destrutiva exige migration compensatoria propria, backup verificado e revisao separada. Depois da remocao fisica, rollback exige plano de migration proprio.

## Data, Concurrency and Audit

- `User.revision` implementado como inteiro monotono e `AdministrativeAuditEvent` imutavel que rollback nao pode apagar.
- Transacao PostgreSQL: reconsultar ator/alvo, validar revisao, serializar invariante de ADMIN ativo, alterar, incrementar revisao e auditar.
- Revisao obsoleta ou ultimo ADMIN produz `409`; no-op atual nao incrementa nem audita.
- Falha entre mutacao e auditoria desfaz ambas.
- Contradicoes `role/isAdmin` bloqueiam migracao automatica e requerem politica explicita revisada.

### Transactional conflict evaluation

Dentro da mesma transacao: revalidar ator `ACTIVE + ADMIN`; serializar os registros necessarios; reconsultar alvo; comparar `expectedRevision`; comparar `expectedStatus` ou `expectedRole`; proteger o ultimo `ACTIVE + ADMIN`; detectar no-op; e somente entao alterar, incrementar a revisao e auditar. Todo conflito retorna `409` sem mutacao, incremento ou evento.

| Code | Condition | Recovery |
|---|---|---|
| `STALE_REVISION` | expected revision differs | `REFRESH_TARGET`, reload and reconfirm |
| `EXPECTED_STATE_MISMATCH` | revision matches but status differs | `REFRESH_TARGET`, reload and reconfirm |
| `EXPECTED_ROLE_MISMATCH` | revision matches but role differs | `REFRESH_TARGET`, reload and reconfirm |
| `LAST_ACTIVE_ADMIN` | change would leave zero active admins | `ENSURE_ANOTHER_ACTIVE_ADMIN`; no automatic retry |

## API and UI

- Contrato: [contracts/admin-users.openapi.yaml](contracts/admin-users.openapi.yaml).
- Rotas planejadas: `/api/admin/users`, `/{userId}`, `/status`, `/role`, `/audit`.
- Area global: `/admin`, protegida no servidor por `User.role === ADMIN` e estado atual `ACTIVE`, com shell responsivo proprio, visao geral sem metricas inventadas e retorno explicito ao ambiente operacional.
- Pagina canonica: `/admin/users`, com busca/filtros/cursor, detalhe, confirmacao e recuperacao de conflito. `/dashboard/admin/users` contem somente redirecionamento server-side temporario para a rota canonica. Lista e auditoria usam `createdAt DESC, id DESC` e cursores com ambos os valores.
- Pos-login: a API retorna somente o destino allowlisted derivado depois da autenticacao; `ACTIVE + ADMIN` recebe `/admin`, e os demais papeis ativos recebem `/workspace`. Sessao restaurada reconsulta papel/estado atuais antes de redirecionar.
- Estados: loading, vazio, erro, conflito e sucesso; teclado, foco visivel e texto independente de cor.
- Cursores sao opacos, codificam `createdAt`, `id` e uma impressao dos filtros normalizados; cursor malformado retorna `INVALID_CURSOR`, e cursor de outro conjunto de filtros retorna `CURSOR_FILTER_MISMATCH`. A consulta usa comparacao lexicografica estrita e `limit + 1`, sem repetir itens.
- Dialogos registram o acionador, contem `Tab`/`Shift+Tab`, tornam o fundo inerte, associam titulo/descricao e aceitam `Escape` somente antes de uma operacao enviada. Cancelamento devolve foco ao acionador. Durante envio, duplicacao e bloqueada e `Processando...` e anunciado. Sucesso fecha o dialogo e foca o resumo atualizado; conflito foca `role="alert"`, oferece `Atualizar dados` e exige nova confirmacao; `LAST_ACTIVE_ADMIN` nunca oferece repeticao automatica.

| HTTP | Contract meaning |
|---:|---|
| 400 | entrada/query/precondicao malformada |
| 401 | sessao ausente ou invalida |
| 403 | ator sem autoridade ou autoalteracao |
| 404 | alvo inexistente para ator autorizado |
| 409 | `STALE_REVISION`, `EXPECTED_STATE_MISMATCH`, `EXPECTED_ROLE_MISMATCH` ou `LAST_ACTIVE_ADMIN`, cada um com recuperacao definida |
| 500 | falha controlada sem detalhes internos |

`422` nao e planejado porque os contratos atuais usam `400` para entrada semantica invalida.

Codigos internos sao estaveis: `INVALID_INPUT`, `INVALID_FILTER`, `INVALID_CURSOR`, `CURSOR_FILTER_MISMATCH`, `INVALID_REASON`, `UNAUTHENTICATED`, `ADMIN_AUTHORITY_REQUIRED`, `SELF_CHANGE_FORBIDDEN`, `USER_NOT_FOUND`, os quatro conflitos enumerados e `INTERNAL_ERROR`. `401`/`403` precedem consulta ao alvo; somente ator autorizado recebe `404`; no-op valido retorna `200`; falha transacional desfaz mutacao e auditoria.

## Test Strategy

- Caracterizacao dos consumidores atuais e exclusoes de DTO.
- Unitarios para contratos, politica global, transicoes, autoalteracao, ultimo ADMIN, no-op e erros.
- Migration para preflight de contradicoes, schema/auditoria/revisao e falhas reversiveis.
- Integracao para 401/403/404/409/500, atomicidade, corridas e revalidacao de sessao.
- E2E para lista/filtros/detalhe/mutacoes/auditoria, acesso direto negado, conflito, responsividade e acessibilidade.
- Gates independentes: Prisma, migration PostgreSQL autorizada, typecheck, lint, unit, integration, E2E, build e validacao humana.

## IMP-006 and Shared Files

IMP-006 permanece divergente e nao e dependencia material. Nao fazer merge, rebase, cherry-pick ou copiar conteudo exclusivo. Alteracoes futuras em schema/autenticacao exigem coordenacao. Documentos globais nao serao editados; necessidade futura sera follow-up.

## Project Structure

```text
specs/009-user-administration/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/admin-users.openapi.yaml
├── checklists/
└── tasks.md

prisma/schema.prisma
prisma/migrations/<timestamp>_user_administration/
src/app/(private)/admin/{layout.tsx,page.tsx,users/page.tsx}
src/app/(private)/dashboard/admin/users/page.tsx # redirect legado
src/app/api/admin/users/
src/app/api/server/{auth,middlewares,services,user-administration}/
src/components/user-administration/
src/app/api/server/scripts/superadmin.ts
tests/{unit,integration,migration,e2e}/
```

**Structure Decision**: preservar o monolito Next.js e as convencoes de handler/service/test; criar modulo focado, nao framework generico.

## Phases and Rollback Gates

1. Caracterizar/inventariar baseline; parar diante de contradicao nao classificada.
2. Adicionar migration revisada para revision/audit e validar em PostgreSQL.
3. Centralizar autorizacao por role com compatibilidade temporaria.
4. Implementar projecoes, servicos, contratos e invariantes.
5. Implementar API e UI protegidas; separar a administracao global em `/admin` do dashboard operacional.
6. Encerrar a entrega funcional com consumidores migrados para `role` e zero autoridade baseada em `isAdmin`.
7. No seguimento tecnico autorizado pelo pedido de finalizacao e pelo branch Neon descartavel, provar zero consumidores e remover fisicamente `isAdmin` por migration posterior com preflight e teste de rollback.
8. Executar gates e reconciliar documentacao.

Rollback e compensatorio: interromper mutacoes se necessario, identificar a fase, verificar auditoria/revisoes, criar backup ou ponto de restauracao Neon, preparar e revisar migration compensatoria, aplicar primeiro em branch Neon temporaria, validar integridade e somente entao aplicar ao ambiente de teste da feature. UI/rotas podem ser desativadas sem tocar dados; politica deve ser corrigida mantendo `role`; auditoria/revisao exigem compensacao monotona; remocao de `isAdmin` nunca restaura autoridade pelo booleano. Ao final, nenhum evento foi perdido, nenhuma revisao diminuiu, `role` permanece fonte unica e existe ao menos um `ACTIVE + ADMIN`.

## Complexity Tracking

Nenhuma violacao constitucional ou novo projeto/abstracao transversal e planejado.
