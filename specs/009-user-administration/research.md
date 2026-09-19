# Research: Administracao de usuarios

## Classificacao

- `DECISAO_ADOTADA_PARA_O_RECORTE`: mandato IMP-009 e clarificacoes da spec.
- `INTENCAO_DOCUMENTADA`: pacote Code-First.
- `EVIDENCIA_IMPLEMENTACAO`: schema, auth, middleware, servicos, script e testes na baseline `df85619`.
- `RECOMENDACAO`: escolhas tecnicas abaixo, sujeitas a revisao na implementacao.

## Decisions

### 1. Global authority

**Decision**: somente `User.role = ADMIN` com `status = ACTIVE`; laboratorio nunca concede autoridade global.  
**Rationale**: fonte unica e menor privilegio.  
**Alternatives**: `isAdmin` principal ou `role OR isAdmin` rejeitados por duplicidade/elevacao; RBAC generico fora do escopo.

### 2. Session revalidation

**Decision**: manter JWT com apenas `userId` e reconsultar estado/papel na proxima validacao protegida.  
**Rationale**: aproveita o contrato existente e evita autoridade obsoleta no token.  
**Alternatives**: role sem reconsulta e blacklist/revogacao instantanea rejeitados.

### 3. Concurrency

**Decision**: revisao esperada + transacao; serializar/lockar operacoes que afetam ADMIN ativo.  
**Rationale**: detecta edicao obsoleta e protege o ultimo ADMIN sob corrida.  
**Alternatives**: last-write-wins, timestamp e contagem fora da transacao rejeitados.

### 4. Audit

**Decision**: evento imutavel na mesma transacao, apenas para mudancas concluidas, consultavel por ADMIN.  
**Rationale**: rastreabilidade verificavel sem auditoria corporativa.  
**Alternatives**: log de aplicacao, payload bruto e historico funcional de toda tentativa negada rejeitados/adiados.

### 5. `isAdmin` migration

**Decision**: inventario, preflight, role como autoridade, compatibilidade minima, zero consumidores e remocao posterior.  
**Rationale**: evita quebra e reconciliacao silenciosa.  
**Alternatives**: remocao imediata, sincronizacao permanente ou escolher valor mais privilegiado rejeitados.

### 6. Interface

**Decision**: REST focado, pagina no dashboard, cursor opaco, busca/papel/estado e limite 50.  
**Rationale**: segue baseline e reduz superficie.  
**Alternatives**: patch generico, GraphQL e exportacao em massa fora do recorte.

### 7. Account states

**Decision**: apenas ACTIVE autentica; INACTIVE e desativacao, BLOCKED e negacao de seguranca, ambos auditaveis e sem permissao.  
**Rationale**: preserva comportamento observado e diferenca testavel.  
**Alternatives**: remover estado ou permitir sessao limitada PENDING sem autoridade rejeitados.

## Current Consumer Inventory

| Area | Evidence | Future action |
|---|---|---|
| Prisma User | role/status/isAdmin coexistem | revision/audit primeiro; remocao depois |
| auth.core | principal usa isAdmin | incluir role atual; preservar DTO publico minimo |
| users.service | selects auth usam isAdmin; metodos genericos existem | selects por finalidade |
| admin.middleware | concede por isAdmin | politica central por role/status |
| superadmin | grava os dois campos | compatibilidade temporaria, depois role |
| IMP-001/tests | preservaram isAdmin internamente | atualizar caracterizacao sem exposicao publica |
| session | claim userId apenas | preservar |

## IMP-006

Nenhuma dependencia material com diagnostico IHFR foi encontrada. A branch permanece divergente; nenhum artefato exclusivo, decisao ou codigo foi incorporado. Reconciliacao futura so sera necessaria se houver disputa por schema/auth compartilhados.

