# Data Model: Administracao de usuarios

Contrato de desenho para implementacao futura; nao altera o schema nesta fase.

## Account Projection

| Field | Rule | Exposure |
|---|---|---|
| id | identificador imutavel | list/detail/audit reference |
| firstName, lastName, email | identidade existente | list/detail |
| role | USER, ADMIN, DEVELOPER, MODERATOR | autoridade global normativa |
| status | ACTIVE, PENDING, INACTIVE, BLOCKED | elegibilidade da conta |
| revision | inteiro monotono futuro | detalhe e precondicao |
| createdAt, updatedAt | timestamps existentes | contexto administrativo |

Nunca projetar password/hash, tokens, segredos, valores de ambiente, `isAdmin` ou relacoes desnecessarias.

## AdministrativeAuditEvent

| Field | Rule |
|---|---|
| id | identificador imutavel |
| targetUserId, actorUserId | alvo e ADMIN ator; diferentes |
| action | ACCOUNT_STATUS_CHANGED ou GLOBAL_ROLE_CHANGED |
| beforeValue, afterValue | enums allowlisted coerentes com action |
| reason | justificativa obrigatoria, trimmed, limitada |
| targetRevision | revisao apos a mudanca |
| createdAt | timestamp do servidor/banco |

Eventos sao append-only. No-op, rejeicao ou conflito nao criam evento de sucesso.

## Relationships and Invariants

- Account tem eventos como alvo e ator; membership de laboratorio permanece independente.
- Toda mudanca exige ator atual ACTIVE+ADMIN e alvo diferente.
- Mudanca bem-sucedida incrementa revision uma vez e cria exatamente um evento na mesma transacao.
- Revisao obsoleta falha; no-op atual nao incrementa nem audita.
- Ultimo ACTIVE+ADMIN e protegido dentro da transacao serializada.
- Rollback nunca reduz `revision` nem apaga evento ja persistido; recuperacao destrutiva usa migration compensatoria revisada e backup verificado.
- Depois de qualquer compensacao, `role` permanece a unica autoridade, pelo menos um `ACTIVE + ADMIN` permanece e nenhum registro contraditorio ganha autoridade por `isAdmin`.

## State Transitions

Os quatro estados podem transitar para outro estado sob autorizacao. Apenas ACTIVE autentica. Papel global pode mudar entre enums existentes para outra conta; DEVELOPER/MODERATOR nao ganham autoridade.

## Legacy Consistency Classes

| role | isAdmin | Classification | Handling |
|---|---:|---|---|
| ADMIN | true | consistente legado | migrar consumidores |
| non-ADMIN | false | consistente legado | migrar consumidores |
| ADMIN | false | contradicao | bloquear automatismo; revisar |
| non-ADMIN | true | contradicao de privilegio | nao conceder; corrigir explicitamente |

Esta tabela e preflight, nao logica de autorizacao.
