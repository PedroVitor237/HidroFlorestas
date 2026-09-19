# Feature Specification: Administracao de usuarios

**Feature Branch**: `009-user-administration`
**Created**: 2026-09-19
**Status**: Ready for Planning
**Input**: IMP-009 — uma autoridade global autorizada consulta contas existentes e administra estado e papel global com menor privilegio, auditoria e protecoes contra elevacao indevida.

## Objective and Product Outcome

Permitir que uma autoridade administrativa global consulte contas existentes e altere, dentro de regras explicitas, o estado da conta e o papel global. O resultado deve ser seguro, auditavel e coerente diante de concorrencia, sessoes anteriores e papeis de laboratorio, sem expor credenciais ou criar uma segunda fonte de autoridade.

### Problem

`EVIDENCIA_IMPLEMENTACAO`: a baseline possui `User.role`, `User.status` e o sinalizador redundante `User.isAdmin`; a autorizacao administrativa observada usa `isAdmin`, enquanto o provisionamento de superadministrador grava `role = ADMIN` e `isAdmin = true`. Essa duplicidade admite estados contraditorios. `ResearchersLinked.role` representa autoridade apenas no laboratorio correspondente.

### Actors

- **ADMIN global**: unica autoridade que pode usar a administracao de contas deste recorte.
- **Usuario-alvo**: titular de uma conta existente consultada ou alterada.
- **USER, DEVELOPER e MODERATOR**: papeis globais sem autoridade administrativa nesta feature.
- **OWNER, ADMIN ou MEMBER de laboratorio**: papel contextual que nao concede autoridade global.

## Clarifications

### Session 2026-09-19

- Q: Quais acoes integram o primeiro recorte? → A: listar e consultar contas existentes, alterar estado, alterar papel global e consultar auditoria dessas acoes.
- Q: Como autoalteracao e administradores existentes sao protegidos? → A: nenhuma autoalteracao de papel ou estado; outro ADMIN pode ser alterado, exceto se isso remover o ultimo ADMIN ativo.
- Q: Qual e a diferenca observavel entre INACTIVE e BLOCKED? → A: ambos perdem acesso normal; INACTIVE e desativacao administrativa reversivel e BLOCKED e negacao por seguranca, distinguida no estado e na auditoria.
- Q: O que acontece com sessoes anteriores? → A: bloqueio, inativacao ou rebaixamento valem na proxima validacao protegida, que reconsulta estado e papel atuais; nao se promete revogacao instantanea entre validacoes.
- Q: Como conflitos concorrentes sao tratados? → A: alteracoes exigem versao esperada e falham sem sobrescrever quando a conta mudou; a protecao do ultimo ADMIN ativo e atomica.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consultar contas com seguranca (Priority: P1)

Como ADMIN global, quero pesquisar, filtrar e consultar contas existentes para identificar com seguranca a conta e seu estado antes de qualquer alteracao.

**Why this priority**: a consulta com dados minimizados e a fronteira de autorizacao sustentam todas as mutacoes posteriores.

**Independent Test**: pode ser validada com contas existentes, cobrindo lista paginada, filtros, detalhe, ausencia, autenticacao e papeis sem autoridade, sem executar mutacoes.

**Acceptance Scenarios**:

1. **Given** um ADMIN global autenticado, **When** consulta a lista, **Then** recebe resultados paginados com identificador, nome, email, papel global, estado e datas administrativas necessarias, sem campos sensiveis.
2. **Given** um ADMIN global, **When** pesquisa por nome ou email e filtra por papel ou estado, **Then** recebe somente contas correspondentes, em ordem estavel.
3. **Given** uma conta existente, **When** o ADMIN consulta seu detalhe, **Then** recebe a mesma projecao administrativa segura e a versao necessaria para alteracao concorrente.
4. **Given** uma conta inexistente, **When** o ADMIN consulta seu detalhe, **Then** recebe resultado controlado de nao encontrado.
5. **Given** ausencia de sessao ou um USER, MODERATOR, DEVELOPER ou administrador apenas de laboratorio, **When** tenta qualquer consulta administrativa, **Then** nenhum dado administrativo e retornado.

---

### User Story 2 - Administrar estado da conta (Priority: P2)

Como ADMIN global, quero alterar o estado de outra conta para habilitar, desativar ou bloquear seu acesso com justificativa e rastreabilidade.

**Independent Test**: pode ser validada alterando outra conta entre estados permitidos, cobrindo autoalteracao, conflito concorrente e sessao anterior.

**Acceptance Scenarios**:

1. **Given** outra conta e sua versao atual, **When** o ADMIN solicita uma transicao valida com justificativa, **Then** o novo estado e persistido e uma auditoria registra ator, alvo, antes, depois, justificativa e instante.
2. **Given** a propria conta do ADMIN, **When** tenta alterar seu estado, **Then** a operacao e negada sem mutacao.
3. **Given** uma conta alterada desde a leitura, **When** o ADMIN envia a versao anterior, **Then** recebe conflito e nenhuma alteracao ou auditoria de sucesso e gravada.
4. **Given** uma sessao emitida antes de `INACTIVE` ou `BLOCKED`, **When** ela passa pela proxima validacao protegida, **Then** o acesso e negado conforme o estado atual.
5. **Given** repeticao do mesmo estado e mesma versao atual, **When** a solicitacao e valida, **Then** o resultado e idempotente e nao cria evento de mudanca ficticio.

---

### User Story 3 - Administrar papel global (Priority: P3)

Como ADMIN global, quero alterar o papel global de outra conta para conceder ou remover autoridade explicitamente, sem autoelevacao nem perda do ultimo administrador ativo.

**Independent Test**: pode ser validada com contas em cada papel global e dois administradores ativos, cobrindo promocao, rebaixamento, concorrencia e separacao laboratorial.

**Acceptance Scenarios**:

1. **Given** outra conta, **When** um ADMIN altera seu papel global com versao e justificativa validas, **Then** o papel e persistido e auditado.
2. **Given** a propria conta do ator, **When** tenta mudar o proprio papel, **Then** a operacao e negada, inclusive para rebaixamento ou elevacao.
3. **Given** o unico ADMIN global ativo, **When** outro fluxo tenta remove-lo de `ADMIN` ou torna-lo nao ativo, **Then** a operacao falha atomicamente e ao menos um ADMIN ativo permanece.
4. **Given** um ADMIN rebaixado com sessao anterior, **When** tenta a proxima operacao administrativa, **Then** sua autoridade atual e reavaliada e o acesso e negado.
5. **Given** um OWNER ou ADMIN de laboratorio sem `User.role = ADMIN`, **When** tenta alterar papel global, **Then** a operacao e negada.

---

### User Story 4 - Consultar rastreabilidade administrativa (Priority: P4)

Como ADMIN global, quero consultar os eventos administrativos deste recorte para entender quem alterou qual conta e por que, sem expor dados sensiveis.

**Independent Test**: pode ser validada consultando os eventos gerados pelas historias 2 e 3 e negando acesso a demais papeis.

**Acceptance Scenarios**:

1. **Given** eventos administrativos existentes, **When** um ADMIN consulta a auditoria de uma conta, **Then** recebe eventos paginados com ator, alvo, tipo, valores anteriores e novos permitidos, justificativa e instante.
2. **Given** um papel sem autoridade global, **When** tenta consultar a auditoria, **Then** nenhum evento e retornado.
3. **Given** uma operacao negada ou em conflito, **When** a resposta e produzida, **Then** nao existe evento que a apresente como alteracao concluida; sinais de seguranca de tentativas negadas ficam fora deste historico funcional minimo.

### Edge Cases

- Busca vazia equivale a listagem paginada; termo composto apenas por espacos e normalizado como vazio.
- Email e nome sao pesquisados sem exigir correspondencia de maiusculas, mas o resultado nao revela se uma conta existe a quem nao tem autoridade.
- `PENDING` nao pode iniciar nem restaurar sessao; tornar a conta `ACTIVE` habilita autenticacao futura sem criar sessao automaticamente.
- `INACTIVE` e `BLOCKED` negam login, restauracao e acesso protegido. A diferenca observavel e o motivo administrativo persistido no estado e na auditoria; desbloqueio nao reativa automaticamente uma conta para outro estado.
- `DEVELOPER` e `MODERATOR` permanecem valores compativeis sem capacidades adicionais nesta feature.
- Mudancas concorrentes usam a versao observada; nenhum modelo de ultimo escritor vence pode contornar a protecao do ultimo ADMIN ativo.
- Falha entre mutacao e auditoria nao pode deixar apenas um dos dois persistido.
- Uma conta promovida a ADMIN so adquire autoridade quando a operacao subsequente revalidar o papel atual.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O produto MUST autorizar todas as consultas e mutacoes administrativas somente para uma conta autenticada, `ACTIVE` e com papel global atual `ADMIN`, reavaliado no servidor.
- **FR-002**: `User.role` MUST ser a unica fonte normativa de autoridade global; `isAdmin` MUST ser tratado como legado temporario, nunca como autorizacao independente.
- **FR-003**: Papeis `OWNER`, `ADMIN` e `MEMBER` de laboratorio MUST limitar-se ao laboratorio correspondente e MUST NOT conceder administracao global.
- **FR-004**: `USER`, `DEVELOPER` e `MODERATOR` MUST NOT receber autoridade administrativa nesta feature.
- **FR-005**: O produto MUST listar contas com paginacao opaca, ordenacao estavel e projecao allowlisted contendo somente `id`, nome, email, papel global, estado, datas administrativas necessarias e versao concorrente.
- **FR-006**: O produto MUST permitir pesquisa por nome ou email e filtros por papel global e estado; parametros invalidos MUST produzir resposta controlada.
- **FR-007**: O produto MUST permitir ao ADMIN consultar uma conta por identificador e MUST distinguir conta inexistente para o ator autorizado.
- **FR-008**: Lista, detalhe e auditoria MUST NOT retornar senha, hash, token, segredo, chave root, valor de ambiente, `isAdmin` ou relacoes internas desnecessarias.
- **FR-009**: O produto MUST permitir alterar o estado de outra conta para `ACTIVE`, `PENDING`, `INACTIVE` ou `BLOCKED` mediante estado/versao esperados e justificativa nao vazia.
- **FR-010**: `ACTIVE` MUST ser o unico estado elegivel para iniciar ou manter uso autenticado; `PENDING`, `INACTIVE` e `BLOCKED` MUST negar login, restauracao e validacao protegida.
- **FR-011**: `INACTIVE` MUST representar desativacao administrativa reversivel e `BLOCKED` negacao por seguranca; ambos permanecem distinguiveis no estado e na auditoria, sem diferenca adicional de permissao neste recorte.
- **FR-012**: O produto MUST permitir alterar o papel global de outra conta entre os valores existentes, mediante papel/versao esperados e justificativa; `DEVELOPER` e `MODERATOR` nao ganham capacidades implicitas.
- **FR-013**: O produto MUST negar qualquer alteracao do proprio estado ou papel pelo fluxo administrativo comum.
- **FR-014**: O produto MUST impedir atomicamente qualquer mudanca de papel ou estado que deixe zero contas simultaneamente `ACTIVE` e `ADMIN`.
- **FR-015**: Alteracoes MUST usar controle otimista de concorrencia; versao desatualizada ou precondicao de ultimo ADMIN MUST falhar sem sobrescrever estado atual.
- **FR-016**: Alterar estado ou papel e gravar o respectivo evento de auditoria MUST formar uma unica operacao atomica.
- **FR-017**: Cada mudanca concluida MUST registrar identificador do ator e alvo, tipo, valor anterior e novo permitidos, justificativa, instante e versao resultante; senha, tokens, segredos e dados livres desnecessarios MUST NOT ser registrados.
- **FR-018**: Apenas ADMIN global `ACTIVE` MUST consultar o historico funcional de auditoria, paginado e limitado a eventos deste recorte.
- **FR-019**: Uma solicitacao que repete o valor atual com precondicoes atuais MUST produzir resultado idempotente e MUST NOT fabricar evento de mudanca.
- **FR-020**: Bloqueio, inativacao ou rebaixamento MUST valer na proxima validacao protegida, que reconsulta estado e papel atuais; a feature MUST NOT prometer revogacao instantanea entre validacoes.
- **FR-021**: Respostas MUST distinguir entrada invalida, ausencia de autenticacao, falta de autoridade, alvo inexistente e conflito sem revelar detalhes internos.
- **FR-022**: A IMP-009 MUST administrar somente contas existentes e MUST NOT criar, excluir fisicamente, impersonar ou recuperar senha.
- **FR-023**: A futura transicao de `isAdmin` MUST inventariar consumidores, detectar registros divergentes, migrar autorizacao para `role`, manter compatibilidade somente quando necessaria e remover o campo apenas quando nenhum consumidor depender dele.
- **FR-024**: A administracao MUST oferecer estados de carregamento, vazio, erro e conflito, navegacao por teclado, foco perceptivel e comunicacao textual que nao dependa apenas de cor.
- **FR-025**: Todas as operacoes administrativas MUST aplicar negacao por padrao e ignorar qualquer papel ou autoridade enviado pelo cliente para identificar o ator.

### Non-Functional Requirements

- **NFR-001 — Seguranca**: 100% das fronteiras administrativas devem validar identidade, estado e papel atual no servidor antes de ler ou alterar dados.
- **NFR-002 — Privacidade**: toda resposta e evento deve usar projecao allowlisted; campos sensiveis e internos proibidos devem permanecer ausentes.
- **NFR-003 — Consistencia**: protecao do ultimo ADMIN ativo, mutacao e auditoria devem resistir a duas solicitacoes concorrentes sem estado parcial.
- **NFR-004 — Desempenho**: 95% das consultas administrativas de ate 50 itens devem apresentar resultado em ate 2 segundos em validacao representativa.
- **NFR-005 — Acessibilidade**: todas as acoes essenciais devem ser realizaveis por teclado, manter foco identificavel e anunciar resultado ou erro por texto.
- **NFR-006 — Auditabilidade**: todo evento concluido deve ser atribuivel a ator e alvo existentes no momento da operacao e permanecer ordenavel de modo deterministico.

### Authority Matrix

| Action | USER | MODERATOR | DEVELOPER | Global ADMIN | Laboratory role |
|---|---:|---:|---:|---:|---:|
| Own profile | Yes | Yes | Yes | Yes | No additional grant |
| Administrative list/detail | No | No | No | Yes | No |
| Change another account state | No | No | No | Yes, constrained | No |
| Change another global role | No | No | No | Yes, constrained | No |
| Promote another account to ADMIN | No | No | No | Yes, audited | No |
| Change own role or state | No | No | No | No | No |
| Remove last active ADMIN | No | No | No | No | No |
| Manage laboratory membership | By laboratory contract | By laboratory contract | By laboratory contract | Not automatically | By laboratory contract |

### Key Entities

- **Account**: existing user identity with global `role`, account `status` and concurrency version.
- **Global role**: `USER`, `ADMIN`, `DEVELOPER` or `MODERATOR`; only `ADMIN` has authority here.
- **Account status**: `ACTIVE`, `PENDING`, `INACTIVE` or `BLOCKED`; only `ACTIVE` is session-eligible.
- **Laboratory membership**: contextual relation with `OWNER`, `ADMIN` or `MEMBER`, independent from global authority.
- **Administrative audit event**: immutable record of a successful state or global-role change, containing only allowlisted before/after facts.

### Out of Scope

- Criacao publica ou administrativa de contas, exclusao fisica, recuperacao de senha e envio de email.
- Administracao de laboratorios, areas, coletas, diagnostico IHFR ou vinculos laboratoriais.
- Impersonacao, permissoes configuraveis, RBAC/ABAC generico e auditoria corporativa avancada.
- Painel geral de metricas, IA e alteracao das capacidades de `DEVELOPER` ou `MODERATOR`.
- Revogacao instantanea push de sessao entre validacoes e registro funcional de toda tentativa negada.
- Implementacao, migration, mudanca de schema ou remocao fisica de `isAdmin` nesta execucao documental.

## Dependencies, Assumptions and Evidence

- `DECISAO_ADOTADA_PARA_O_RECORTE`: `User.role` e a fonte unica planejada de autoridade global; `isAdmin` e legado a descontinuar com migracao segura.
- `EVIDENCIA_IMPLEMENTACAO`: autenticacao atual reconsulta a identidade e exige `ACTIVE` em cada restauracao/validacao por `requireAuth`.
- `EVIDENCIA_IMPLEMENTACAO`: `requireAdmin` ainda usa `isAdmin`; o principal nao carrega `role`.
- `EVIDENCIA_IMPLEMENTACAO`: o provisionamento de superadmin grava simultaneamente `role = ADMIN` e `isAdmin = true`.
- `EVIDENCIA_IMPLEMENTACAO`: papeis de laboratorio estao persistidos separadamente em `ResearchersLinked.role`.
- `RECOMENDACAO_ADOTADA_PARA_O_RECORTE`: consultar auditoria integra o primeiro recorte para tornar a rastreabilidade observavel.
- A baseline normativa e tecnica e `origin/development` em `df85619`.

## Risks and Pending Decisions

- Registros existentes podem conter divergencia entre `role` e `isAdmin`; a implementacao futura deve inventariar antes de escolher estrategia de correcao.
- O mecanismo concreto de versao concorrente e o modelo persistido de auditoria pertencem ao plano e a futura implementacao.
- `INACTIVE` e `BLOCKED` diferem por semantica administrativa e rastreabilidade, mas compartilham negacao de acesso; simplificacao futura exige decisao propria.
- `DEVELOPER` e `MODERATOR` sao preservados por compatibilidade, sem escopo funcional aprovado nesta feature.
- A IMP-006 permanece divergente. Nenhuma dependencia material foi identificada para administrar contas; nenhum conteudo exclusivo dela e incorporado.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: em 100% dos cenarios de consulta, somente ADMIN global `ACTIVE` recebe a projecao administrativa allowlisted.
- **SC-002**: em 100% das respostas e eventos inspecionados, senha, hash, tokens, segredos, chave root, valores de ambiente e `isAdmin` estao ausentes.
- **SC-003**: em 100% dos cenarios de autoalteracao e remocao do ultimo ADMIN ativo, nenhuma mutacao e concluida.
- **SC-004**: em testes com duas alteracoes concorrentes, no maximo uma solicitacao com a mesma versao esperada altera a conta, sem perda silenciosa de atualizacao.
- **SC-005**: 100% das alteracoes concluidas de estado ou papel possuem exatamente um evento funcional correspondente; falhas nao aparecem como sucesso.
- **SC-006**: na proxima validacao protegida, 100% das sessoes de contas bloqueadas, inativadas ou rebaixadas deixam de obter o acesso que perderam.
- **SC-007**: 95% das consultas de ate 50 itens apresentam resultado em ate 2 segundos no ambiente representativo definido para validacao.
- **SC-008**: em validacao automatizada, 100% das operacoes essenciais sao alcancaveis por teclado e comunicam estados de carregamento, vazio, erro, conflito e sucesso sem depender apenas de cor.

