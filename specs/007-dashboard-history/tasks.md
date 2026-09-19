---

description: "Tarefas executáveis da IMP-007 — Dashboard e histórico básico"
---

# Tasks: Dashboard e histórico básico

**Input**: artefatos de design em `specs/007-dashboard-history/`

**Status**: T001–T064 preservadas após remediação documental da primeira análise cruzada; T065 acrescentada para evidência manual de SC-008. Nova análise independente pendente.

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/dashboard-api.openapi.yaml` e `quickstart.md`

**Tests**: abordagem TDD obrigatória para esta feature. Cada história prepara testes compiláveis, comprova RED comportamental, implementa o recorte e comprova GREEN antes da próxima história.

**Organization**: tarefas agrupadas por fundamentos e pelas quatro histórias para manter incrementos verificáveis e rastreabilidade a FR-001–FR-019 e SC-001–SC-009.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: pode executar em paralelo somente quando os arquivos são distintos e não há dependência incompleta.
- **[Story]**: história atendida (`US1`, `US2`, `US3` ou `US4`); setup, fundamentos e validação final não usam rótulo de história.
- Todo item possui caminho concreto; comandos citados devem ser executados a partir da raiz do repositório.

## Phase 1: Setup — baseline e testes seguros

**Purpose**: congelar o baseline observado, confirmar scripts/contratos e preparar fixtures protegidas antes de qualquer RED funcional.

- [ ] T001 Confirmar branch `007-dashboard-history`, HEAD/upstream, working tree limpa, `origin/development` e `.specify/feature.json`, registrar qualquer avanço impeditivo antes de marcar esta tarefa em `specs/007-dashboard-history/tasks.md`
- [ ] T002 Conferir os scripts `test:unit`, `test:integration`, `test:e2e`, `lint`, `typecheck` e `build`, a ausência de dependência/migration nova e o contrato publicado em `package.json`, `prisma/schema.prisma` e `specs/007-dashboard-history/contracts/dashboard-api.openapi.yaml`
- [ ] T003 Escrever primeiro os testes do guard de fixture IMP-007 para URL isolada, confirmação explícita, prefixos/UUIDs allowlisted, limpeza e contagem final em `tests/unit/dashboard-fixture-guard.test.ts`
- [ ] T004 Executar `node --import=tsx --test tests/unit/dashboard-fixture-guard.test.ts` e confirmar RED comportamental por ausência do guard, sem erro de importação ou configuração, em `tests/unit/dashboard-fixture-guard.test.ts`
- [ ] T005 Implementar fixtures determinísticas para dois laboratórios, vazio real, inatividade, vínculo revogável, conta inelegível, tuplas completas/incompletas, mais de 20 origens e empates, com cleanup em `finally` e guards herdados de IMP-003/004, em `tests/fixtures/dashboard-history.ts`
- [ ] T006 Reexecutar `node --import=tsx --test tests/unit/dashboard-fixture-guard.test.ts` e confirmar GREEN do ambiente seguro antes de qualquer teste com banco em `tests/unit/dashboard-fixture-guard.test.ts`

**Checkpoint**: baseline e fixture estão explícitos; nenhuma suite funcional foi executada antes da confirmação do ambiente isolado.

---

## Phase 2: Foundational — shells compiláveis e contrato compartilhado

**Purpose**: criar somente as superfícies compartilhadas necessárias para que RED funcional não seja confundido com falha de importação.

**CRITICAL**: concluir esta fase antes das histórias; os shells devem compilar, mas continuar sem comportamento de produção.

- [ ] T007 Criar tipos fechados compiláveis para contexto, resumo, itens discriminados, página, cursor e envelope de erro em `src/types/dashboard.type.ts`
- [ ] T008 Criar exports compiláveis, validadores/serializers ainda não implementados e erro explícito `NOT_IMPLEMENTED` em `src/app/api/server/dashboard/dashboard.contracts.ts`
- [ ] T009 Criar interfaces injetáveis de store/autorização e shells `summary`/`history` que falham explicitamente sem consultar dados em `src/app/api/server/services/dashboard.service.ts`
- [ ] T010 [P] Criar factory compilável do handler GET de resumo, injetável e ainda sem sucesso funcional, em `src/app/api/laboratories/[laboratoryId]/dashboard/summary/route.ts`
- [ ] T011 [P] Criar factory compilável do handler GET de histórico, injetável e ainda sem sucesso funcional, em `src/app/api/laboratories/[laboratoryId]/dashboard/history/route.ts`
- [ ] T012 [P] Criar shell acessível da região de resumo, sem números fictícios nem fallback, em `src/components/dashboard/dashboard-summary.tsx`
- [ ] T013 [P] Criar shell acessível da região de histórico, sem `ActivityLog`, pessoas ou destinos genéricos, em `src/components/dashboard/dashboard-history.tsx`
- [ ] T014 Executar `npm run typecheck` e corrigir apenas erros dos shells IMP-007 em `src/types/dashboard.type.ts`, `src/app/api/server/dashboard/dashboard.contracts.ts`, `src/app/api/server/services/dashboard.service.ts`, `src/app/api/laboratories/[laboratoryId]/dashboard/summary/route.ts`, `src/app/api/laboratories/[laboratoryId]/dashboard/history/route.ts`, `src/components/dashboard/dashboard-summary.tsx` e `src/components/dashboard/dashboard-history.tsx`
- [ ] T015 Criar teste de contrato OpenAPI 3.1 para dois `operationId`, resolução de todas as refs locais, DTOs fechados, allowlists, UUIDs estritos em IDs compostos/links, exemplos positivos e negativos, correspondência entre IDs/contexto/destinos, status, cursor, limite 20, erros sanitizados e `Cache-Control: no-store` em `tests/unit/dashboard-openapi-contract.test.ts`
- [ ] T016 Executar `node --import=tsx --test tests/unit/dashboard-openapi-contract.test.ts` como caracterização GREEN do contrato publicado antes de implementar runtime em `specs/007-dashboard-history/contracts/dashboard-api.openapi.yaml`

**Checkpoint**: imports e tipos compilam; o OpenAPI publicado está caracterizado; os shells ainda produzem RED quando exercitados funcionalmente.

---

## Phase 3: User Story 1 — Ver o resumo do laboratório selecionado (Priority: P1)

**Goal**: entregar identidade/estado e totais reais de áreas e coletas confirmadas do laboratório autorizado, com link contextual e zero somente após sucesso.

**Independent Test**: com laboratórios acessíveis contendo quantidades conhecidas e um laboratório vazio, comparar a resposta e a região de resumo com as fontes de cada laboratório, incluindo tupla de confirmação incompleta excluída.

### Tests and RED for User Story 1

- [ ] T017 [P] [US1] Escrever testes unitários do resumo para contagem de todas as áreas, elegibilidade pela tupla completa `occurredAt`/`occurrenceOffset`/`confirmedAt`/`confirmationKey`, isolamento, zero real, contexto inativo e DTO sem campos proibidos em `tests/unit/dashboard-service.test.ts`
- [ ] T018 [P] [US1] Escrever testes de integração do endpoint de resumo para `200/401/404/500`, autorização em cada chamada, erro sanitizado e `no-store` em `tests/integration/dashboard-routes.test.ts`
- [ ] T019 [P] [US1] Escrever cenários E2E do resumo, laboratório vazio, totais separados e link de áreas em uma ativação em `tests/e2e/dashboard-history.spec.ts`
- [ ] T020 [US1] Executar os recortes US1 de `tests/unit/dashboard-service.test.ts`, `tests/integration/dashboard-routes.test.ts` e `tests/e2e/dashboard-history.spec.ts` e confirmar ao menos um RED funcional esperado, com fixtures/imports já operacionais

### Implementation and GREEN for User Story 1

- [ ] T021 [US1] Implementar serializer/validação allowlist do `DashboardSummary`, contexto, totais e link contextual sem autoria, PII, coordenadas, observações ou ciência em `src/app/api/server/dashboard/dashboard.contracts.ts`
- [ ] T022 [US1] Implementar leitura transacional do resumo com `authorizeLaboratoryAccess(..., "READ_AREAS", tx)`, filtros por `laboratoryRoomId` e predicado da tupla completa em `src/app/api/server/services/dashboard.service.ts`
- [ ] T023 [US1] Implementar GET independente do resumo com `requireAuth`, factory injetável, mapeamento `200/401/404/500`, erro sanitizado e `Cache-Control: no-store` em `src/app/api/laboratories/[laboratoryId]/dashboard/summary/route.ts`
- [ ] T024 [US1] Implementar região de resumo com loading distinto de zero, sucesso vazio/real, nome/estado, modo somente leitura e link contextual em `src/components/dashboard/dashboard-summary.tsx`
- [ ] T025 [US1] Criar landing `/dashboard/laboratories/{laboratoryId}`, adicionar navegação “Resumo” e trocar “ACESSAR LABORATÓRIO” para a landing contextual em `src/app/(private)/dashboard/laboratories/[laboratoryId]/page.tsx`, `src/app/(private)/dashboard/laboratories/[laboratoryId]/layout.tsx` e `src/components/workspace/laboratory-workspace.tsx`
- [ ] T026 [US1] Reexecutar os recortes US1 de `tests/unit/dashboard-service.test.ts`, `tests/integration/dashboard-routes.test.ts` e `tests/e2e/dashboard-history.spec.ts` e confirmar GREEN somente do recorte de resumo de FR-001–FR-003 e FR-011–FR-013, com SC-001 para o resumo; não declarar FR-008 nem SC-002/SC-004/SC-005 concluídos antes das histórias correspondentes

**Checkpoint**: o resumo é utilizável e testável sozinho, sem depender do histórico.

---

## Phase 4: User Story 2 — Reencontrar registros no histórico (Priority: P1)

**Goal**: projetar somente área criada e coleta confirmada, ordenadas e paginadas por keyset, com destinos contextuais reais e sem retenção paralela.

**Independent Test**: atravessar mais de 20 origens com empates entre/dentro dos tipos e verificar identidade única, ordem repetível sem mudança das fontes, fim do histórico, retorno por pilha de cursores e detalhe de origem em uma ativação; inserir uma origem mais recente entre páginas para caracterizar continuação, retorno reconsultado e refresh sem alegar snapshot.

### Tests and RED for User Story 2

- [ ] T027 [P] [US2] Escrever testes unitários para cursor opaco válido/inválido, datas ISO, identidades/destinos correspondentes aos IDs/contexto do DTO, remoção da origem, ordenação `eventAt DESC`/tipo/sourceId, 20+1 candidatos, empate, próxima parte, fim e inserção mais recente entre páginas — excluída da continuação para itens antigos e incluída após reinício — em `tests/unit/dashboard-contracts.test.ts` e `tests/unit/dashboard-service.test.ts`
- [ ] T028 [P] [US2] Acrescentar testes de integração do endpoint de histórico para cursor ausente/válido/inválido, `200/400/401/404/500`, reautorização, ausência de consulta de fontes após cursor inválido autorizado e `no-store` em `tests/integration/dashboard-routes.test.ts`
- [ ] T029 [P] [US2] Acrescentar E2E de mais de 20 itens, empates, “Mais antigos”/“Mais recentes”, fim, vazio, destinos de área/coleta em uma ativação e inserção entre páginas, comprovando ausência de repetição ao avançar, retorno reconsultado que pode refletir a mutação e presença da nova origem após refresh em `tests/e2e/dashboard-history.spec.ts`
- [ ] T030 [US2] Executar os recortes US2 de `tests/unit/dashboard-contracts.test.ts`, `tests/unit/dashboard-service.test.ts`, `tests/integration/dashboard-routes.test.ts` e `tests/e2e/dashboard-history.spec.ts` e confirmar RED funcional sem falhas de infraestrutura

### Implementation and GREEN for User Story 2

- [ ] T031 [US2] Implementar codec versionado de cursor, comparação total, serializers dos dois tipos e DTO fechado sem autor/PII/coordenadas/observações/ciência em `src/app/api/server/dashboard/dashboard.contracts.ts`
- [ ] T032 [US2] Implementar queries limitadas a 21 candidatos por fonte, predicados keyset, união determinística, limite 20 e `nextCursor` somente quando houver posterior em `src/app/api/server/services/dashboard.service.ts`
- [ ] T033 [US2] Implementar GET independente do histórico com autorização antes da validação do cursor, `400 INVALID_CURSOR`, `200/401/404/500`, erro sanitizado e `Cache-Control: no-store` em `src/app/api/laboratories/[laboratoryId]/dashboard/history/route.ts`
- [ ] T034 [US2] Implementar histórico sem busca/filtros fictícios, com `<time dateTime>`, tipo/instante/origem, links contextuais e pilha local de cursores para avanços/retornos em `src/components/dashboard/dashboard-history.tsx`
- [ ] T035 [US2] Remover do fluxo e excluir o mock com `ActivityLog`, pessoas, datas/tipos inventados e destino `/dashboard/collects/area/*` em `src/app/(private)/dashboard/activity-history.tsx`
- [ ] T036 [US2] Reexecutar os recortes US2 de `tests/unit/dashboard-contracts.test.ts`, `tests/unit/dashboard-service.test.ts`, `tests/integration/dashboard-routes.test.ts` e `tests/e2e/dashboard-history.spec.ts` e confirmar GREEN de FR-004–FR-008, FR-013–FR-016 e SC-002–SC-003; SC-005 permanece para a matriz completa de US4

**Checkpoint (slice funcional P1)**: fases 1–4 entregam os dois endpoints e as duas regiões básicas, cada qual testável de modo independente. Este ponto não é o MVP completo e não autoriza encerramento: falha/retry, releitura, matriz de segurança, acessibilidade, responsividade e validações das fases 5–7 continuam obrigatórias. Extensões IMP-005/006 permanecem fora do runtime.

---

## Phase 5: User Story 3 — Acompanhar mudanças e estados de leitura (Priority: P2)

**Goal**: reler fontes após retorno/refresh e manter loading, vazio, erro e retry independentes sem payload anterior ou resposta tardia cruzada.

**Independent Test**: alterar uma fonte pelo fluxo autorizado, atualizar o dashboard, falhar uma região por vez, recuperar por retry e trocar de laboratório enquanto a resposta anterior está atrasada.

### Tests and RED for User Story 3

- [ ] T037 [P] [US3] Acrescentar E2E para refresh após área/coleta confirmada, loading não representado como zero/vazio, falhas e retries independentes e resposta tardia descartada na troca de laboratório em `tests/e2e/dashboard-history.spec.ts`
- [ ] T038 [P] [US3] Acrescentar integração que comprove consultas novas sem cache, falha isolada dos handlers e ausência de reutilização de payload entre chamadas em `tests/integration/dashboard-routes.test.ts`
- [ ] T039 [US3] Executar os recortes US3 de `tests/integration/dashboard-routes.test.ts` e `tests/e2e/dashboard-history.spec.ts` e confirmar RED funcional para estados/releitura, mantendo a fixture segura GREEN

### Implementation and GREEN for User Story 3

- [ ] T040 [P] [US3] Implementar ciclo independente do resumo com fetch `cache: "no-store"`, limpeza antes da leitura, `AbortController`, erro sanitizado e retry seguro em `src/components/dashboard/dashboard-summary.tsx`
- [ ] T041 [P] [US3] Implementar ciclo independente do histórico com fetch `cache: "no-store"`, limpeza/reset de cursores no contexto/refresh, `AbortController`, erro sanitizado e retry seguro em `src/components/dashboard/dashboard-history.tsx`
- [ ] T042 [US3] Integrar as regiões sem boundary compartilhado que converta falha parcial em falha total ou zero em `src/app/(private)/dashboard/laboratories/[laboratoryId]/page.tsx`
- [ ] T043 [US3] Verificar em `tests/e2e/dashboard-history.spec.ts` e por inspeção de `src/components/areas/area-form.tsx` e `src/components/collections/collection-form.tsx` que criação/confirmação preservam a navegação existente para os detalhes persistidos e que retornar à landing provoca nova leitura sem evento manual; editar os formulários somente se um RED comportamental específico provar necessidade
- [ ] T044 [US3] Reexecutar os recortes US3 de `tests/integration/dashboard-routes.test.ts` e `tests/e2e/dashboard-history.spec.ts` e confirmar GREEN de FR-009–FR-010, SC-006 e do recorte loading/vazio/erro/retry de SC-004; a conclusão integral de SC-004 permanece para T053

**Checkpoint**: mudanças persistidas aparecem por nova leitura e uma região permanece utilizável quando a outra falha.

---

## Phase 6: User Story 4 — Consultar com acesso e privacidade preservados (Priority: P2)

**Goal**: fechar a matriz de autorização/isolamento, inatividade somente leitura, minimização, acessibilidade e responsividade.

**Independent Test**: exercitar dois laboratórios, vínculo removido, conta inelegível, laboratório inativo e recursos cruzados; inspecionar API/UI e operar o fluxo por teclado em 320/768/1280 px.

### Tests and RED for User Story 4

- [ ] T045 [P] [US4] Acrescentar unidade para autorização chamada por leitura, filtros laboratoriais obrigatórios, vínculo revogado, conta inelegível, inativo legível e ausência de autoria/PII/coordenadas/observações/ciência em `tests/unit/dashboard-service.test.ts` e `tests/unit/dashboard-contracts.test.ts`
- [ ] T046 [P] [US4] Acrescentar integração para laboratórios cruzados/ausentes/sem vínculo indistinguíveis, inelegibilidade `401`, revogação entre leituras, inativo `200` read-only e ausência de payload em erros em `tests/integration/dashboard-routes.test.ts`
- [ ] T047 [P] [US4] Acrescentar E2E da matriz de acesso, links reautorizados, mutações omitidas em inativo, campos proibidos ausentes, teclado/foco/nomes/papéis/estados ARIA e viewports 320/768/1280 sem overflow principal em `tests/e2e/dashboard-history.spec.ts`, sem tratar automação como evidência de tecnologia assistiva real
- [ ] T048 [US4] Executar os recortes US4 de `tests/unit/dashboard-contracts.test.ts`, `tests/unit/dashboard-service.test.ts`, `tests/integration/dashboard-routes.test.ts` e `tests/e2e/dashboard-history.spec.ts` e confirmar ao menos um RED funcional específico de privacidade/estado/acessibilidade

### Implementation and GREEN for User Story 4

- [ ] T049 [US4] Endurecer store, seleção Prisma e serializers para autorizar primeiro, filtrar por laboratório e selecionar/publicar somente allowlists em `src/app/api/server/services/dashboard.service.ts` e `src/app/api/server/dashboard/dashboard.contracts.ts`
- [ ] T050 [US4] Implementar mensagens/ações de acesso perdido e inatividade, sem payload stale nem mutação, e sem depender de cor/ícone em `src/components/dashboard/dashboard-summary.tsx` e `src/components/dashboard/dashboard-history.tsx`
- [ ] T051 [US4] Ajustar landing e navegação contextual para foco visível, nomes acessíveis, ordem coerente, fluxo vertical em 320 px e ausência de overflow horizontal em `src/app/(private)/dashboard/laboratories/[laboratoryId]/page.tsx` e `src/app/(private)/dashboard/laboratories/[laboratoryId]/layout.tsx`
- [ ] T052 [US4] Verificar que destinos de área/coleta preservam a cadeia contextual e continuam reautorizando pelos guards integrados em `src/app/(private)/dashboard/laboratories/[laboratoryId]/areas/[areaId]/page.tsx` e `src/app/(private)/dashboard/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/page.tsx`
- [ ] T053 [US4] Reexecutar os recortes US4 de `tests/unit/dashboard-contracts.test.ts`, `tests/unit/dashboard-service.test.ts`, `tests/integration/dashboard-routes.test.ts` e `tests/e2e/dashboard-history.spec.ts` e confirmar GREEN de FR-001–FR-002, FR-011–FR-013, FR-017–FR-019, SC-001/SC-004–SC-005/SC-007 e somente dos aspectos automatizáveis de SC-008; manter tecnologia assistiva como `NAO_VERIFICADO` até T065

**Checkpoint**: as quatro histórias estão implementadas e testáveis; o dashboard permanece somente leitura e minimizado.

---

## Phase 7: Polish & Cross-Cutting Validation

**Purpose**: validar contrato, regressões, qualidade estática, escopo e a pendência humana sem ampliar a feature.

- [ ] T054 Executar `node --import=tsx --test tests/unit/dashboard-openapi-contract.test.ts tests/unit/dashboard-contracts.test.ts tests/unit/dashboard-service.test.ts tests/unit/dashboard-fixture-guard.test.ts` e confirmar OpenAPI estrutural/refs locais, UUIDs/destinos, contrato, privacidade e paginação GREEN em `tests/unit/`
- [ ] T055 Executar `npm run test:unit` e corrigir somente regressões causadas pela IMP-007 em `tests/unit/`
- [ ] T056 Executar `npm run test:integration` e confirmar handlers IMP-007 e regressões IMP-003/004 GREEN em `tests/integration/`
- [ ] T057 Executar `npx playwright test tests/e2e/dashboard-history.spec.ts` com ambiente isolado confirmado e comprovar cleanup final zero em `tests/e2e/dashboard-history.spec.ts` e `tests/fixtures/dashboard-history.ts`
- [ ] T058 Executar `npx playwright test tests/e2e/area-viewing.spec.ts tests/e2e/area-registration.spec.ts tests/e2e/collection-registration.spec.ts` e corrigir somente regressões pertinentes em `tests/e2e/`
- [ ] T059 Executar `npm run lint` separadamente e corrigir somente arquivos da IMP-007 em `src/components/dashboard/`, `src/app/api/server/dashboard/`, `src/app/api/laboratories/[laboratoryId]/dashboard/` e `tests/`
- [ ] T060 Executar `npm run typecheck` separadamente e corrigir somente incompatibilidades da IMP-007 em `src/types/dashboard.type.ts`, `src/components/dashboard/` e `src/app/api/`
- [ ] T061 Executar `npm run build` separadamente e confirmar ausência de import server-side em cliente, dependência, schema ou migration nova em `src/components/dashboard/`, `src/app/api/server/dashboard/`, `package.json` e `prisma/`
- [ ] T062 Executar `git diff --check`, `git status --short` e revisão de diff/escopo para confirmar somente caminhos autorizados, ausência de segredos/mocks/dados reais e nenhuma mudança em `docs/raw/`, `prisma/schema.prisma` ou `prisma/migrations/`, registrando o resultado em `specs/007-dashboard-history/tasks.md`
- [ ] T063 Auditar estaticamente a cobertura explícita de FR-001–FR-019 e SC-001–SC-009 contra testes e comportamento, sem declarar SC-009 aprovada, em `specs/007-dashboard-history/tasks.md`
- [ ] T064 Registrar SC-009 como validação humana pendente/agendada, com método, amostra, responsável e evidência a preencher pela equipe, sem resultado simulado pelo agente, em `specs/007-dashboard-history/quickstart.md`
- [ ] T065 Executar verificação manual do fluxo principal com tecnologia assistiva real e registrar responsável, data, sistema operacional, navegador, tecnologia/versões, procedimento, resultados e evidências em `specs/007-dashboard-history/accessibility-evidence.md`; manter SC-008 como `NAO_VERIFICADO` até a execução efetiva e não reutilizar a avaliação moderada de SC-009 como substituta

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 — Setup**: inicia imediatamente; T003 → T004 → T005 → T006 forma o ciclo RED/GREEN do guard de fixture.
- **Phase 2 — Foundational**: depende da Phase 1; T007 → T008 → T009, depois T010–T013 podem ocorrer em paralelo; T014 depende de todos os shells; T015 → T016 caracteriza o contrato.
- **Phase 3 — US1**: depende da Phase 2; T017–T019 podem ocorrer em paralelo, T020 prova RED, T021 → T022 → T023 e T024 → T025 implementam o recorte, T026 prova GREEN.
- **Phase 4 — US2**: depende da Phase 2 e deve seguir US1 quando houver uma única pessoa devido a arquivos compartilhados; T027–T029 podem ocorrer em paralelo, T030 prova RED, T031 → T032 → T033 → T034/T035 implementa e T036 prova GREEN.
- **Phase 5 — US3**: depende de US1 e US2; T037/T038 podem ocorrer em paralelo, T039 prova RED, T040/T041 podem ocorrer em paralelo, T042/T043 integra e T044 prova GREEN.
- **Phase 6 — US4**: depende dos endpoints e regiões das fases anteriores; T045–T047 podem ocorrer em paralelo, T048 prova RED, T049 → T050 → T051 → T052 endurece e T053 prova GREEN.
- **Phase 7 — Validation**: depende das quatro histórias; T054–T065 são sequenciais para preservar diagnóstico claro de falhas e separar as evidências humanas de SC-008/SC-009.

### User Story Dependencies

- **US1 (P1)**: independente após fundamentos e entrega o resumo.
- **US2 (P1)**: endpoint/serviço são verificáveis sem US1, mas compartilham contratos, página e fixtures; ordem recomendada US1 → US2. US1+US2 formam o slice P1, não o MVP completo.
- **US3 (P2)**: depende das duas regiões funcionais para validar falha/retry/refresh independentes.
- **US4 (P2)**: fecha segurança, privacidade e apresentação sobre os dois fluxos já funcionais; guards de IMP-003/004 são dependências integradas, não trabalho novo.

### RED/GREEN Discipline

- Fixtures e shells compiláveis precedem todo RED funcional.
- Cada tarefa RED deve falhar por comportamento ausente e não por import, variável de ambiente, conexão indevida ou contrato inválido.
- Nenhuma implementação da história começa antes do RED correspondente ser observado.
- A história só atinge o checkpoint após o GREEN direcionado; regressões completas ficam para a Phase 7.

---

## Parallel Execution Examples

### User Story 1

```text
T017 — unidade do serviço de resumo
T018 — integração da rota de resumo
T019 — E2E do resumo
```

### User Story 2

```text
T027 — unidade de cursor/união
T028 — integração da rota de histórico
T029 — E2E de paginação e destinos
```

### User Story 3

```text
T040 — ciclo cliente do resumo
T041 — ciclo cliente do histórico
```

### User Story 4

```text
T045 — unidade de isolamento/minimização
T046 — integração da matriz de acesso
T047 — E2E de acesso, acessibilidade e responsividade
```

---

## Implementation Strategy

### MVP Completion

1. Concluir Setup e Foundational.
2. Concluir US1 e validar o resumo isoladamente.
3. Concluir US2 e validar histórico/paginação isoladamente.
4. Tratar o checkpoint da Phase 4 somente como slice funcional P1; não encerrar a entrega nesse ponto.
5. Concluir US3 para releitura, falha parcial e retry.
6. Concluir US4 para segurança, privacidade, acessibilidade automatizável e responsividade.
7. Concluir T054–T065, incluindo a evidência manual de tecnologia assistiva de SC-008; SC-009 permanece explicitamente pendente até estudo moderado próprio.

### Incremental Delivery

1. Setup + Foundational → ambiente seguro e shells compiláveis.
2. US1 → resumo derivado e contextual.
3. US2 → histórico derivado e paginado; slice P1 completo, ainda não MVP.
4. US3 → atualização, loading, falha e retry independentes.
5. US4 → matriz de acesso, minimização, acessibilidade e responsividade.
6. Validação cruzada → contrato, regressões, lint, typecheck, build, diff, verificação manual de SC-008 e SC-009 explicitamente pendente.

---

## Future Reconciliation Gates (non-blocking)

- **IMP-005**: integrada em `development` e relida nesta reconciliação. Não adicionar nesta entrega enum, adaptador, total ou item ambiental; sua exclusão é decisão de escopo e uma extensão posterior não bloqueia T001–T065.
- **IMP-006**: ainda não oferece contrato técnico consumível para a IMP-007. Não reservar campo, estado, score, classe, diagnóstico ou evento; reavaliar somente após implementação e integração com gates científicos/operacionais satisfeitos.
- **SC-009**: requer participantes representativos e evidência humana. A automação cobre preparo e rastreabilidade, mas nunca equivale a aprovação.

## Scope Guardrails

- Não criar `ActivityLog`, retenção paralela, migration, índice especulativo ou nova fonte de verdade.
- Não calcular IHFR, capturar dados ambientais, editar registros, criar mapa territorial, gráficos analíticos, recomendações ou IA.
- Não executar projeções IMP-005/006 no incremento mínimo; somente os dois tipos integrados são válidos.
- Não promover models científicos legados do schema a contrato aprovado.

## Coverage Map

| Requirement / criterion | Primary tasks |
|---|---|
| FR-001, FR-002, FR-012; SC-001, SC-005 | T017–T023, T045–T053 |
| FR-003; SC-001, SC-006 | T017–T026, T037–T044 |
| FR-004, FR-005, FR-006, FR-008, FR-014; SC-002, SC-003 | T015–T016, T027–T036 |
| FR-007; SC-003 | T005, T027–T036, incluindo inserção entre páginas sem promessa de snapshot |
| FR-009, FR-010; SC-004, SC-006 | T037–T044 |
| FR-011; SC-004, SC-005 | T017–T026, T045–T053 |
| FR-013; SC-005 | T015–T016, T021, T027–T036, T045–T054 |
| FR-015, FR-016, FR-019 | T015–T016, T027–T036, T061–T063 and the future gates above |
| FR-017, FR-018; SC-007 | T047–T053, T057–T058 |
| SC-008 | T047–T053 e T057 para aspectos automatizáveis; T065 para tecnologia assistiva real, inicialmente `NAO_VERIFICADO` |
| SC-009 | T063–T064; human evidence remains pending |

## Notes

- `[P]` foi aplicado somente a arquivos distintos sem dependência funcional incompleta.
- As 17 tarefas marcadas `[P]` permanecem inalteradas e válidas; T065 é sequencial e não cria colisão de arquivos.
- Os testes OpenAPI caracterizam um contrato já publicado; os REDs funcionais começam somente depois dos shells compiláveis.
- O limite de 20, os empates, o fim do histórico e a inserção entre páginas devem ser comprovados tanto em unidade quanto em E2E; o cursor não é snapshot.
- O MVP só é completo após as fases 5–7 e T065; completar US1+US2 encerra apenas o slice P1.
- Commits devem agrupar passos lógicos; não marcar tarefa GREEN sem executar sua verificação indicada.
