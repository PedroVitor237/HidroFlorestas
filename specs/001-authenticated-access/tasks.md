# Tasks: Acesso autenticado seguro

**Input**: documentos de desenho em `specs/001-authenticated-access/`

**Prerequisites**: `spec.md`, `plan.md`, `research.md`, `data-model.md`,
`contracts/auth-api.openapi.yaml` e `quickstart.md`

**Tests**: testes são parte obrigatória desta entrega. Em cada história, escreva os testes antes
da implementação correspondente e confirme que falham pelo motivo esperado.

**Organization**: tarefas agrupadas por preparação, fundação compartilhada, histórias de usuário
priorizadas e acabamento. Cada tarefa contém o caminho exato afetado.

**Inventory**: 44 tarefas contínuas, de T001 a T044.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: pode ser executada em paralelo somente depois das dependências declaradas, pois afeta
  arquivos diferentes e não depende de outra tarefa incompleta do mesmo grupo.
- **[US1]**, **[US2]**, **[US3]**: história de usuário atendida.
- Tarefas de setup, fundação e acabamento não recebem rótulo de história.

---

## Phase 1: Setup (Shared Test Infrastructure)

**Purpose**: preparar somente a infraestrutura de testes prevista no plano, sem alterar schema,
migrations, CI global ou dependências de produção.

- [x] T001 Adicionar somente `@playwright/test` às `devDependencies` e atualizar o lockfile correspondente em `package.json` e `package-lock.json`
- [x] T002 Registrar os scripts `test:fixtures:auth`, `test:unit`, `test:integration`, `test:e2e`, `test` e `typecheck` com os comandos definidos no quickstart em `package.json`
- [x] T003 Instalar Chromium com `npx playwright install chromium` e verificar a instalação por lançamento headless controlado com `chromium.launch()` e encerramento imediato, sem usar `--with-deps` como requisito geral
- [x] T004 [P] Configurar Playwright para `tests/e2e`, Chromium, `workers: 1`, `PLAYWRIGHT_BASE_URL` opcional e servidor local controlado em `playwright.config.ts`

**Checkpoint**: runners e comandos mínimos definidos; nenhuma fixture ou implementação executada.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: estabelecer contratos, sessão, consulta autoritativa e fixtures compartilhadas que
bloqueiam todas as histórias.

**CRITICAL**: nenhuma história começa antes da conclusão desta fase.

### Tests for the foundation

- [x] T005 [P] Escrever testes unitários inicialmente falhos para parser de entrada, `trim`, rejeição de chaves extras/whitespace, emails válidos e inválidos pela regra `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`, `400 INVALID_REQUEST` antes de consulta e serializer com saída exata `{ firstName, lastName, image }` sem campos proibidos em `tests/unit/auth-contracts.test.ts`
- [x] T006 [P] Escrever testes unitários inicialmente falhos para `JWT_SECRET` obrigatório, payload `{ userId }`, allowlist `HS256`, tokens válidos/adulterados/expirados e coerência entre criação e remoção do cookie de sete dias em `tests/unit/session.test.ts`
- [x] T007 [P] Escrever testes unitários inicialmente falhos do núcleo de autenticação com fakes manuais injetados para busca de usuário, comparação de senha e emissão/verificação de token, cobrindo cookie ausente, token inválido/expirado, payload inválido, usuário inexistente, `ACTIVE`, demais estados, falha de repositório e produção exata de `AuthenticatedPrincipal` em `tests/unit/auth-core.test.ts`
- [x] T008 [P] Escrever testes de integração inicialmente falhos do adapter `requireAuth` pelo harness de Next.js que controla leitura de cookie e captura do resultado sem banco real, cobrindo passagem do token ao núcleo, retorno do principal, falha controlada e ausência de autoridade no adapter em `tests/integration/auth-guard.test.ts`
- [x] T009 [P] Escrever testes unitários inicialmente falhos do guard da fixture para cada variável ausente, confirmação incorreta, URLs malformadas, URLs normalizadas iguais, proibição de fallback e combinação válida, comprovando recusa anterior a conexão ou escrita em `tests/unit/auth-fixture-guard.test.ts`

### Implementation for the foundation

- [x] T010 Definir `PublicUserDto`, envelopes públicos de sucesso/falha e parser cliente do envelope tipado sem imports de Prisma em `src/types/auth.type.ts`
- [x] T011 Implementar parser runtime allowlisted com `trim` e validação sintática do email pela regra aprovada antes de consulta, além do serializer campo a campo para `PublicUserDto`, em `src/app/api/server/auth/auth.contracts.ts`
- [x] T012 [P] Centralizar nome, TTL, atributos de criação/remoção do cookie, leitura do segredo, emissão e verificação JWT fail-closed em `src/app/api/server/auth/session.ts`
- [x] T013 [P] Adicionar consultas Prisma com `select` explícito: credencial interna e identidade atual contendo somente `id`, `firstName`, `lastName`, `image`, `status` e `isAdmin`, sem devolver registros brutos aos handlers, em `src/app/api/server/services/users.service.ts`
- [x] T014 Criar o núcleo independente do Next.js com dependências injetáveis e `AuthenticatedPrincipal { id, firstName, lastName, image, isAdmin }` em `src/app/api/server/auth/auth.core.ts`, e tornar `src/app/api/server/middlewares/auth.middleware.ts` um adapter fino de `cookies()` que preserva `isAdmin` para `requireAdmin` sem expor o principal ao cliente
- [x] T015 [P] Criar fixture fictícia determinística em `tests/fixtures/auth-users.ts` que, antes de conectar ou escrever, exige `NODE_ENV=test`, `TEST_DATABASE_URL`, confirmação exata e URLs válidas/normalizadas diferentes; usa explicitamente `TEST_DATABASE_URL`; restringe setup/update/teardown aos quatro IDs e emails reservados; não usa fallback, `truncate` nem remoção sem filtro estrito; e restaura `ACTIVE` após a transição

**Checkpoint**: fundação testável pronta; presença de cookie ou estado React isolados continuam sem
autoridade de segurança.

---

## Phase 3: User Story 1 - Iniciar acesso protegido (Priority: P1) MVP

**Goal**: permitir que uma conta preexistente e atualmente `ACTIVE` faça login e alcance
`/workspace`, negando credenciais inválidas e todos os demais estados sem expor dados sensíveis.

**Independent Test**: usar `/login` e as quatro fixtures, sem depender da restauração desta
entrega, para verificar sucesso de `ACTIVE`, falhas genéricas, criação/ausência de cookie e chegada
ao `/workspace`.

### Tests for User Story 1

- [x] T016 [P] [US1] Escrever testes unitários inicialmente falhos para usuário ausente, senha incorreta, comparação bcrypt, igualdade estrita `ACTIVE`, rejeição uniforme de `PENDING`/`BLOCKED`/`INACTIVE`, erro interno e retorno público do serviço em `tests/unit/auth-service.test.ts`
- [x] T017 [P] [US1] Escrever testes de integração inicialmente falhos do adapter fino `POST /api/auth/sign-in` pelo harness controlado, com request/cookie/response e dependências do núcleo injetadas, para JSON inválido, email sintaticamente inválido antes de consulta, credenciais válidas/inválidas, quatro estados, `400/401/500`, `Set-Cookie` e envelope sem campos proibidos em `tests/integration/auth-sign-in.test.ts`

### Implementation for User Story 1

- [x] T018 [US1] Refatorar login para receber entrada validada, comparar a senha com bcrypt, aceitar somente `status === "ACTIVE"`, emitir sessão após elegibilidade e retornar resultado discriminado com `PublicUserDto` em `src/app/api/server/services/auth.service.ts`
- [x] T019 [US1] Implementar o adapter fino `POST /api/auth/sign-in` com body `unknown`, chamada ao núcleo, adaptação de request/response/cookie, códigos `INVALID_REQUEST`/`INVALID_CREDENTIALS`/`INTERNAL_ERROR`, cookie somente no sucesso e `AuthSuccess` sem token em `src/app/api/auth/sign-in/route.ts`
- [x] T020 [US1] Migrar o estado para `PublicUserDto`, fazer parse do envelope tipado, decidir o fluxo de login por `code`, tratar `INVALID_CREDENTIALS`, usar `message` pública segura como fallback e navegar para `/workspace` somente após sucesso em `src/contexts/auth.context.tsx`
- [x] T021 [US1] Manter validação cliente apenas como conveniência e apresentar a falha controlada produzida pelo parser cliente, sem revelar estado de conta nem duplicar autoridade do servidor, em `src/app/login/page.tsx`
- [ ] T022 [US1] Implementar cenários Playwright por HTTP real de login `ACTIVE`, email sintaticamente inválido com `400`, credenciais bem formadas inválidas com `401`, demais estados, chegada ao `/workspace`, atributos do cookie e serialização exata de `user` em `tests/e2e/authenticated-access.spec.ts`

**Checkpoint**: US1 entrega o MVP e pode ser validada isoladamente pela página de login.

---

## Phase 4: User Story 2 - Restaurar e proteger a sessão (Priority: P2)

**Goal**: restaurar apenas sessão válida de usuário ainda `ACTIVE` e negar conteúdo de
`/workspace/**` e `/dashboard/**` nas demais condições, com decisão autoritativa no servidor.

**Independent Test**: preparar cookies diretamente, sem usar o formulário de login, e acessar ou
recarregar as duas árvores privadas para cada estado de sessão e conta.

### Tests for User Story 2

- [x] T023 [P] [US2] Escrever testes de integração inicialmente falhos do adapter fino `GET /api/auth/me` pelo harness controlado de request/cookie/response, sem banco real, para sessão válida, ausente, inválida, expirada, payload inválido, usuário inexistente, `ACTIVE → BLOCKED`, demais estados, falha interna, `no-store`, expiração do cookie e serialização do principal em DTO público exato em `tests/integration/auth-me.test.ts`
- [x] T024 [P] [US2] Escrever testes unitários inicialmente falhos do proxy para ausência de cookie nas duas árvores, passagem otimista de cookie arbitrário, acesso livre a `/login` e ausência de consulta a banco/autorização no proxy em `tests/unit/proxy.test.ts`

### Implementation for User Story 2

- [x] T025 [P] [US2] Converter restauração para o adapter fino `GET /api/auth/me`, chamar o guard autoritativo, nunca devolver `AuthenticatedPrincipal` diretamente, serializar `PublicUserDto`, aplicar `Cache-Control: no-store` e expirar cookie obsoleto em `UNAUTHENTICATED` em `src/app/api/auth/me/route.ts`
- [x] T026 [P] [US2] Converter o layout privado em Server Component que valida a identidade atual antes de renderizar ou redireciona para `/login`, protegendo `/workspace/**` e `/dashboard/**` sem flash de conteúdo em `src/app/(private)/layout.tsx`
- [x] T027 [P] [US2] Limitar o proxy ao redirecionamento otimista quando o cookie estiver ausente nas duas árvores, sem banco, sem conceder acesso e sem afastar `/login` pela mera presença de cookie em `src/proxy.ts`
- [x] T028 [US2] Restaurar o contexto com `GET /api/auth/me`, fazer parse do envelope tipado, decidir por `UNAUTHENTICATED`, limpar somente o estado local sem logout recursivo, usar `message` pública segura como fallback e manter o contexto cliente sem autoridade em `src/contexts/auth.context.tsx`
- [ ] T029 [US2] Acrescentar cenários Playwright serializados para reload de `/workspace`, acesso a `/dashboard`, cookie ausente/malformado/adulterado/expirado/órfão, usuário não `ACTIVE`, transição `ACTIVE → BLOCKED` e ausência de conteúdo protegido em `tests/e2e/authenticated-access.spec.ts`

**Checkpoint**: US2 pode ser validada com sessões preparadas e protege as duas árvores antes da
renderização, independentemente da UI de login.

---

## Phase 5: User Story 3 - Encerrar o acesso (Priority: P3)

**Goal**: encerrar cookie e estado cliente de forma idempotente e impedir recuperação do acesso
por navegação, voltar ou reload até nova autenticação.

**Independent Test**: partir de sessão `ACTIVE` preparada, executar `/logout` e tentar voltar,
recarregar e acessar diretamente as rotas protegidas; repetir também sem sessão válida.

### Tests for User Story 3

- [x] T030 [US3] Escrever testes de integração inicialmente falhos do adapter fino `POST /api/auth/logout` pelo harness controlado de cookie/response para sessão válida, ausente, inválida e expirada, repetição idempotente, `200`, falha controlada, envelope público e remoção consistente do cookie em `tests/integration/auth-logout.test.ts`

### Implementation for User Story 3

- [x] T031 [P] [US3] Reutilizar a política compartilhada para expirar `auth_token` com o mesmo path, `maxAge: 0` e data passada, preservando logout idempotente e erro interno controlado em `src/app/api/auth/logout/route.ts`
- [x] T032 [P] [US3] Aguardar a resposta de logout, fazer parse do envelope tipado, decidir o fluxo por `code`/sucesso, usar `message` pública segura como fallback, limpar `PublicUserDto` somente após sucesso e usar `router.replace("/login")` + `router.refresh()` sem declarar sucesso em falha em `src/contexts/auth.context.tsx`
- [x] T033 [US3] Tornar `/logout` estável para repetição, apresentar o estado controlado recebido do contexto sem expor detalhes e evitar navegação prematura em `src/app/logout/page.tsx`
- [ ] T034 [US3] Acrescentar cenários Playwright serializados de logout, voltar, reload, acesso direto a `/workspace` e `/dashboard`, repetição sem sessão e impossibilidade de restaurar acesso em `tests/e2e/authenticated-access.spec.ts`

**Checkpoint**: ciclo da sessão completo; logout repetido permanece seguro e nenhuma rota privada
é recuperada sem novo login.

---

## Phase 6: Polish & Cross-Cutting Validation

**Purpose**: executar a matriz integral, validar critérios de sucesso, atualizar somente a
documentação diretamente afetada e revisar escopo/rastreabilidade.

- [x] T035 Executar `npm run test:unit`; exigir saída sem falhas e reconciliar os resultados de `tests/unit/auth-contracts.test.ts`, `tests/unit/session.test.ts`, `tests/unit/auth-core.test.ts`, `tests/unit/auth-service.test.ts`, `tests/unit/auth-fixture-guard.test.ts` e `tests/unit/proxy.test.ts` com `specs/001-authenticated-access/quickstart.md`
- [x] T036 Após T035, executar `npm run test:integration` em modo serial; exigir saída sem falhas e reconciliar `tests/integration/auth-sign-in.test.ts`, `tests/integration/auth-me.test.ts`, `tests/integration/auth-logout.test.ts` e `tests/integration/auth-guard.test.ts` com `specs/001-authenticated-access/quickstart.md`
- [ ] T037 Após T036, executar `npm run lint`, `npm run typecheck` e `npm run build`; exigir código de saída zero nos três comandos e inspecionar qualquer diagnóstico desta feature somente em `package.json`, `package-lock.json`, `playwright.config.ts`, `src/types/auth.type.ts`, `src/app/api/server/auth/auth.contracts.ts`, `src/app/api/server/auth/auth.core.ts`, `src/app/api/server/auth/session.ts`, `src/app/api/server/services/auth.service.ts`, `src/app/api/server/services/users.service.ts`, `src/app/api/server/middlewares/auth.middleware.ts`, `src/app/api/auth/sign-in/route.ts`, `src/app/api/auth/me/route.ts`, `src/app/api/auth/logout/route.ts`, `src/app/(private)/layout.tsx`, `src/contexts/auth.context.tsx`, `src/app/login/page.tsx`, `src/app/logout/page.tsx`, `src/proxy.ts`, `tests/fixtures/auth-users.ts`, os seis arquivos exatos de T035, os quatro arquivos exatos de T036 e `tests/e2e/authenticated-access.spec.ts`
- [ ] T038 Após T037 e o smoke de T003, confirmar visualmente que `TEST_DATABASE_URL` identifica o banco isolado; exigir sucesso do guard de T009/T015; executar setup allowlisted e `npm run test:e2e` em Chromium serial com `TEST_DATABASE_URL` fornecida ao processo filho como `DATABASE_URL`; e executar teardown em bloco `finally`, inclusive após falha, usando `tests/fixtures/auth-users.ts` e `tests/e2e/authenticated-access.spec.ts`
- [ ] T039 Após T038, validar manualmente ausência de flash protegido, envelope/DTO em Network, atributos do cookie em HTTPS e navegação pós-logout, registrando resultados e limitações em `specs/001-authenticated-access/quickstart.md`
- [ ] T040 Após T039, conduzir a validação humana de SC-006 e SC-007 com participantes ou representantes definidos pela equipe e registrar amostra, tempos, compreensão e resultado em `specs/001-authenticated-access/quickstart.md`
- [ ] T041 Após T040, atualizar o estado e as evidências observadas de `IMP-001` sem promover inferências ou propostas em `docs/code-first-prd/implementation/backlog.md`
- [ ] T042 Após T041, atualizar o estado da primeira entrega e impactos comprovados na sequência de módulos em `docs/code-first-prd/implementation/implementation-plan.md`
- [ ] T043 Após T042, reconciliar comportamento implementado, validações executadas, riscos e limitações reais sem alterar intenção nem duplicar `CF-TECH-001` em `specs/001-authenticated-access/plan.md` e `specs/001-authenticated-access/quickstart.md`
- [ ] T044 Por último e após T043, revisar o diff final contra FR-001–FR-014, os 13 cenários, SC-001–SC-007 e exclusões, confirmar somente caminhos autorizados e executar `git diff --check` usando `specs/001-authenticated-access/spec.md`, `specs/001-authenticated-access/plan.md` e `specs/001-authenticated-access/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 — Setup**: começa imediatamente; T002, T003 e T004 dependem de T001. Após T001, T002 e
  T004 podem avançar em paralelo; T003 termina somente com download e smoke headless aprovados.
- **Phase 2 — Foundational**: depende da Phase 1 e bloqueia todas as histórias. T005–T009 devem ser
  escritos primeiro; T010–T015 implementam a fundação até os testes passarem. T014 depende de T010,
  T012 e T013; T015 depende do guard especificado em T009.
- **Phase 3 — US1**: depende da fundação. T016 e T017 podem ser escritos em paralelo; T018 precede
  T019; T020 precede T021 e T022 valida o incremento completo.
- **Phase 4 — US2**: depende da fundação. T023 e T024 podem ser escritos em paralelo; depois,
  T025–T027 podem avançar em paralelo; T028 depende do contrato de T025 e T029 valida o incremento.
- **Phase 5 — US3**: depende da fundação. Após T030 falhar pelo motivo esperado, T031 e T032 podem
  avançar em paralelo; T033 depende de T032 e T034 valida o incremento.
- **Phase 6 — Polish**: depende das três histórias. Os gates automatizados seguem estritamente
  T035 → T036 → T037 → T038; T039 e T040 registram validações manual e humana; T041–T043 só usam
  evidência desses gates; T044 é obrigatoriamente a última tarefa.

### User Story Dependencies

- **US1 (P1)**: começa após a fundação e constitui o MVP.
- **US2 (P2)**: começa após a fundação e é testável com sessão preparada, sem depender da UI de
  US1.
- **US3 (P3)**: começa após a fundação e é testável com sessão preparada, sem depender da UI de
  US1 ou da restauração cliente de US2.
- **Colisões compartilhadas**: embora as histórias sejam funcionalmente independentes, T020,
  T028 e T032 editam `src/contexts/auth.context.tsx` e devem manter propriedade exclusiva e ordem
  de integração. T022, T029 e T034 editam `tests/e2e/authenticated-access.spec.ts` e também devem
  ser integradas sequencialmente.

### Dependency Graph

```text
Phase 1 Setup
    └── Phase 2 Foundation
          ├── US1 Login (MVP)
          ├── US2 Restore/Protect
          └── US3 Logout
                 └── Phase 6 Polish (após todas as histórias selecionadas)
```

### Within Each User Story

1. Escrever testes e confirmar falha esperada.
2. Implementar serviços/guards antes dos handlers que os consomem.
3. Implementar contrato HTTP antes do consumo cliente dependente.
4. Validar a história isoladamente antes de integrar a próxima prioridade.

---

## Parallel Opportunities

- Após T001: T002 e T004 podem avançar em paralelo; T003 pode começar quando a dependência estiver
  registrada e termina somente após o smoke do Chromium.
- Fundação: T005–T009 podem ser escritos em paralelo; depois, T012, T013 e T015 afetam arquivos
  independentes, enquanto T014 aguarda T010, T012 e T013.
- US1: T016 e T017 podem ser escritos em paralelo.
- US2: T023 e T024 podem ser escritos em paralelo; depois T025, T026 e T027 podem ser
  implementados em paralelo sobre a fundação concluída.
- US3: T031 e T032 podem ser implementados em paralelo após T030.
- Histórias podem ter responsáveis distintos após a fundação, respeitando as colisões declaradas
  para o contexto cliente e o arquivo E2E compartilhado.

## Parallel Example: User Story 1

```text
T016: tests/unit/auth-service.test.ts
T017: tests/integration/auth-sign-in.test.ts
```

## Parallel Example: User Story 2

```text
T023: tests/integration/auth-me.test.ts
T024: tests/unit/proxy.test.ts

Depois dos testes:
T025: src/app/api/auth/me/route.ts
T026: src/app/(private)/layout.tsx
T027: src/proxy.ts
```

## Parallel Example: User Story 3

```text
Depois de T030:
T031: src/app/api/auth/logout/route.ts
T032: src/contexts/auth.context.tsx
```

---

## Traceability Coverage

### Functional Requirements

| Requirement | Primary task coverage |
|---|---|
| FR-001 | T017, T019–T022 |
| FR-002 | T007–T008, T014, T016–T019, T023, T025–T029 |
| FR-003 | T007–T008, T014, T016–T019, T022, T023, T025, T029 |
| FR-004 | T005, T011, T016–T019, T021–T022 |
| FR-005 | T019–T022, T026, T029 |
| FR-006 | T006–T008, T012–T014, T023, T025–T029 |
| FR-007 | T007–T008, T014, T023–T029, T034 |
| FR-008 | T007–T008, T014, T023–T029, T034 |
| FR-009 | T007–T008, T013–T014, T023, T025–T029 |
| FR-010 | T030–T034 |
| FR-011 | T026, T029–T034 |
| FR-012 | T005, T010–T011, T013, T016–T020, T022–T023, T025, T029, T039 |
| FR-013 | T005–T008, T011–T014, T016–T019, T021–T023, T025, T028, T030–T033 |
| FR-014 | T009, T015–T022, T038, T044 |

### Acceptance Scenarios

| Scenario | Primary task coverage |
|---|---|
| US1.1 — credencial correta e `ACTIVE` alcança `/workspace` | T007, T016–T022 |
| US1.2 — credencial inválida/incompleta não cria sessão | T005, T016–T019, T021–T022 |
| US1.3 — `PENDING`/`BLOCKED`/`INACTIVE` são recusados | T016–T019, T022 |
| US1.4 — resposta de login sem dados sensíveis | T005, T010–T011, T017–T019, T022 |
| US2.1 — reload restaura usuário ainda `ACTIVE` | T007–T008, T023, T025–T029 |
| US2.2 — sessão ausente não acessa as duas árvores | T007–T008, T023–T027, T029 |
| US2.3 — token inválido ou usuário inexistente não restaura | T006–T008, T023, T025–T026, T029 |
| US2.4 — sessão expirada exige nova autenticação | T006–T008, T023, T025–T029 |
| US2.5 — usuário deixa de ser `ACTIVE` e perde acesso | T007–T009, T014–T015, T023, T025–T026, T029 |
| US2.6 — restauração sem dados sensíveis | T005, T010–T011, T023, T025, T029, T039 |
| US3.1 — logout encerra cookie e contexto local | T030–T034 |
| US3.2 — voltar/reload/acesso direto continuam bloqueados | T026, T029, T030–T034 |
| US3.3 — logout sem sessão válida permanece controlado | T030–T034 |

### Success Criteria

| Criterion | Primary task coverage |
|---|---|
| SC-001 | T016–T022, T038 |
| SC-002 | T005–T009, T016–T019, T022–T029, T038 |
| SC-003 | T007–T008, T023, T025–T029, T038 |
| SC-004 | T030–T034, T038 |
| SC-005 | T005, T010–T011, T017–T019, T022–T023, T025, T029, T039 |
| SC-006 | T021, T040 |
| SC-007 | T021, T028, T033, T040 |

---

## Implementation Strategy

### MVP First

1. Concluir Phase 1.
2. Concluir e validar Phase 2.
3. Concluir Phase 3 (US1).
4. Parar e validar login `ACTIVE` e recusas de US1 de forma independente.

### Incremental Delivery

1. Setup + fundação estabelecem contrato e segurança compartilhada.
2. US1 entrega login útil e testável.
3. US2 acrescenta restauração e proteção autoritativa sem depender do formulário.
4. US3 completa o ciclo com logout idempotente.
5. Acabamento valida o percurso integral e atualiza evidências documentais.

## Risks, Boundaries, and Exclusions

- A sessão stateless não revoga uma cópia furtada do JWT antes do vencimento; blacklist ou refresh
  token permanecem fora do escopo.
- Fixture e E2E exigem banco explicitamente isolado; T038 não pode prosseguir sem confirmação do
  destino de `TEST_DATABASE_URL` nem sem aprovação do guard fail-closed.
- SC-006 e SC-007 dependem de validação humana e podem permanecer pendentes até a equipe fornecer
  participantes ou representantes adequados.
- Não criar tarefas para cadastro, recuperação/troca de senha, transições administrativas,
  autorização detalhada, domínio IHFR, schema, migrations, rate limiting, CI global ou auditoria
  geral.
- A atualização global do Next.js é risco externo conhecido e não é tarefa desta feature.
- `src/proxy.ts`, o contexto cliente e UI nunca substituem o guard, o layout server-side ou a
  validação própria de handlers e operações protegidas.

## Notes

- Todos os testes usam `node:test`/`tsx`, exceto o percurso Chromium com Playwright.
- O token permanece exclusivamente no cookie HTTP-only e nunca integra o envelope JSON.
- O DTO público dentro de `AuthSuccess.user` contém exatamente `firstName`, `lastName` e `image`;
  no OpenAPI atual, os três campos são obrigatórios e `image` é `string` não anulável.
- Não alterar `prisma/schema.prisma`, `prisma/migrations/**`, `src/app/api/auth/sign-up/route.ts`,
  `src/app/register/**` ou `src/app/api/server/middlewares/admin.middleware.ts` nesta feature.
