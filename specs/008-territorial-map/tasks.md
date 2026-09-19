---

description: "Tarefas executáveis da IMP-008 — mapa e visualização territorial"
---

# Tasks: Mapa e visualização territorial

**Input**: artefatos de design em `/specs/008-territorial-map/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/territorial-map-api.openapi.yaml` e `quickstart.md`

**Tests**: obrigatórios. Cada bloco de comportamento segue preparação compilável, teste, RED comportamental, implementação e GREEN. Falha de importação, TypeScript, fixture, ambiente ou infraestrutura deve ser corrigida antes de registrar o RED.

**Organization**: tarefas agrupadas por fundamentos e pelas quatro histórias da spec. Nenhuma história isolada constitui o mapa mínimo: o incremento vertical obrigatório termina somente após US1–US4 e os gates da Fase 7.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: pode executar em paralelo somente após as dependências declaradas, em arquivos diferentes e sem depender de tarefa incompleta.
- **[Story]**: história da spec (`US1`–`US4`); Setup, Foundational e Polish não recebem esse rótulo.
- Todos os itens citam caminhos concretos; validações sem escrita apontam os arquivos cujo comportamento ou escopo verificam.

## Phase 1: Setup (preparação compartilhada)

**Purpose**: criar costuras compiláveis e dados de teste sem implementar antecipadamente o comportamento territorial.

- [x] T001 Criar os esqueletos compiláveis e injetáveis da projeção territorial, com tipos fechados e comportamento explícito ainda não implementado, em `src/types/territorial-map.type.ts`, `src/app/api/server/territorial-map/territorial-map.contracts.ts`, `src/app/api/server/services/territorial-map.service.ts` e `src/app/api/laboratories/[laboratoryId]/territorial-map/route.ts`
- [ ] T002 [P] Criar builders determinísticos, IDs opacos e matriz em memória de dois laboratórios, cinco áreas e seis coletas em `tests/fixtures/territorial-map.ts`, sem banco, schema ou dependência nova
- [x] T003 Confirmar que a preparação importa e compila antes dos testes comportamentais com `npm run typecheck`, corrigindo apenas os esqueletos em `src/types/territorial-map.type.ts`, `src/app/api/server/territorial-map/territorial-map.contracts.ts`, `src/app/api/server/services/territorial-map.service.ts` e `src/app/api/laboratories/[laboratoryId]/territorial-map/route.ts`

**Checkpoint**: imports, tipos, factories e fixtures compilam; nenhum RED é aceito enquanto este checkpoint falhar.

---

## Phase 2: Foundational (projeção, autorização e contrato bloqueantes)

**Purpose**: entregar a fronteira server-side compartilhada por todas as histórias: projeção transitória, DTO mínimo, autorização contextual e GET privado.

**⚠️ CRITICAL**: nenhuma história começa antes do GREEN de T015.

### Contrato e serialização

- [x] T004 Escrever testes unitários do DTO fechado e serializer em `tests/unit/territorial-map-contracts.test.ts`, cobrindo localização válida, extremos inclusivos, não finito/ausente/fora dos limites como `null`, no máximo seis casas, temporalidade reconstruída, contagem derivada e ausência dos campos proibidos por FR-006/FR-007/FR-010/FR-011/FR-015/FR-018/FR-022/FR-023
- [ ] T005 Executar isoladamente `tests/unit/territorial-map-contracts.test.ts` e registrar RED causado por asserções comportamentais do serializer, nunca por importação, TypeScript, fixture ou infraestrutura
- [x] T006 Implementar tipos, validação defensiva de coordenadas, reconstrução temporal e allowlist do DTO em `src/types/territorial-map.type.ts` e `src/app/api/server/territorial-map/territorial-map.contracts.ts`, sem persistência, precisão inventada ou coordenada própria de coleta
- [x] T007 Executar `tests/unit/territorial-map-contracts.test.ts` até GREEN e confirmar que a resposta serializada não contém autoria, e-mail, avatar, código de acesso, descrição, observações, `confirmationKey`, credencial, dado ambiental, IHFR ou evidência restrita

### Serviço autorizado e projeção transitória

- [ ] T008 Escrever testes unitários do serviço em `tests/unit/territorial-map-service.test.ts` para guard antes da query, OWNER/ADMIN/MEMBER, conta inelegível, vínculo ausente/revogado, laboratório inválido/inexistente/inacessível, laboratório inativo legível, filtro estrito por laboratório, ordenação determinística, seleção fechada, ausência de N+1 e sanitização de falha (FR-001–FR-006, FR-019, FR-022–FR-024; SC-001/SC-004/SC-005)
- [ ] T009 Executar isoladamente `tests/unit/territorial-map-service.test.ts` e registrar RED comportamental do guard/query/projeção, depois de comprovar que imports, tipos e doubles compilam
- [x] T010 Implementar a transação de leitura com `authorizeLaboratoryAccess(..., "READ_AREAS")`, query de `CollectionArea` limitada ao laboratório e projeção transitória sem cache ou escrita em `src/app/api/server/services/territorial-map.service.ts`, preservando leitura `readOnly` de laboratório inativo
- [x] T011 Executar `tests/unit/territorial-map-service.test.ts` até GREEN e confirmar que nenhuma consulta territorial ocorre antes da autorização e nenhum dado do contexto anterior é devolvido

### Endpoint GET e OpenAPI

- [x] T012 [P] Escrever o teste estático OpenAPI em `tests/unit/territorial-map-openapi-contract.test.ts` para OpenAPI 3.1, refs locais, único `operationId`, objetos fechados, UUID, exemplos, somente GET, status `200/401/404/500`, `Cache-Control: no-store` em todas as respostas, `components.securitySchemes.cookieAuth` compatível com a autenticação integrada (`apiKey` no cookie `auth_token`) e exigência global `security: [{ cookieAuth: [] }]`, rejeitando qualquer override que torne operação territorial pública
- [x] T013 Escrever testes de integração do handler em `tests/integration/territorial-map-route.test.ts` para principal derivado da sessão, parâmetros contextuais, envelope exato, `no-store`, `401` para sessão/conta inelegível, `404` indistinguível para UUID/laboratório/vínculo inacessível ou revogado, `200` inativo e `500` sanitizado; executar junto de `tests/unit/territorial-map-openapi-contract.test.ts` e registrar RED somente do comportamento ausente
- [x] T014 Implementar a factory e o GET contextual em `src/app/api/laboratories/[laboratoryId]/territorial-map/route.ts`, mapear erros sem revelar existência e alinhar o DTO à fonte `specs/008-territorial-map/contracts/territorial-map-api.openapi.yaml`, sempre com `Cache-Control: no-store`
- [x] T015 Executar `tests/unit/territorial-map-openapi-contract.test.ts` e `tests/integration/territorial-map-route.test.ts` até GREEN, incluindo laboratório inativo, perda de elegibilidade, vínculo revogado, recurso cruzado e falha inesperada sanitizada

**Checkpoint**: endpoint privado e projeção mínima de áreas estão utilizáveis e testados, mas o mapa mínimo ainda não está concluído.

---

## Phase 3: User Story 1 — Visualizar áreas do laboratório selecionado (Priority: P1)

**Goal**: mostrar todas as áreas autorizadas do laboratório atual em lista completa e mapa cliente, com seleção/detalhe coerentes, isolamento e pontos coincidentes distinguíveis.

**Independent Test**: abrir dois contextos com pontos conhecidos e comparar contexto, itens, marcadores, enquadramento, seleção e links com as áreas de origem; laboratório vazio deve produzir vazio verdadeiro.

### Preparação compilável

- [x] T016 [US1] Criar interfaces e componentes compiláveis ainda sem comportamento final em `src/components/territorial-map/territorial-map-state.ts`, `src/components/territorial-map/territorial-map-view.tsx`, `src/components/territorial-map/territorial-map.tsx`, `src/components/territorial-map/territorial-map.client.tsx` e `src/app/(private)/dashboard/laboratories/[laboratoryId]/map/page.tsx`, e confirmar `npm run typecheck`

### Tests for User Story 1

- [x] T017 [P] [US1] Escrever testes unitários de formatação, seleção por `areaId`, localização disponível/indisponível e derivação única de mapa/lista em `tests/unit/territorial-map-state.test.ts` (FR-007–FR-013, FR-025/FR-026; SC-001/SC-002)
- [ ] T018 [P] [US1] Escrever cenários E2E de loading inicial, laboratório ativo/inativo/vazio, isolamento entre laboratórios, lista completa, um marcador por área válida, fit de um/múltiplos pontos, coordenadas extremas, pontos coincidentes e links contextuais em `tests/e2e/territorial-map.spec.ts`, sempre interceptando tiles (FR-001–FR-013, FR-019, FR-023/FR-025/FR-026; SC-001/SC-002/SC-004/SC-005)
- [ ] T019 [US1] Executar `tests/unit/territorial-map-state.test.ts` e os cenários US1 de `tests/e2e/territorial-map.spec.ts`, corrigir previamente qualquer falha de importação/fixture/ambiente e registrar RED nas asserções de comportamento territorial

### Implementation for User Story 1

- [x] T020 [P] [US1] Implementar formatação de até seis casas, seleção estável por ID, derivação de localização e utilitários de enquadramento sem deduplicar coordenadas em `src/components/territorial-map/territorial-map-state.ts`
- [x] T021 [P] [US1] Extrair a configuração substituível de tiles de `src/components/areas/map-config.ts` para `src/components/maps/map-config.ts` e atualizar `src/components/areas/area-map.client.tsx` para preservar integralmente o mapa da IMP-003, sem URL hardcoded nova ou dependência nova
- [x] T022 [US1] Implementar o mapa agregado client-only com `next/dynamic({ ssr: false })`, `MapContainer`, um marcador por área válida, identidade por `areaId`, `fitBounds`/`setView` e boundary cartográfico em `src/components/territorial-map/territorial-map.tsx` e `src/components/territorial-map/territorial-map.client.tsx` (depende de T020 e T021)
- [x] T023 [US1] Implementar fetch `cache: "no-store"`, contexto, loading, vazio verdadeiro, lista textual completa, seleção/painel e destinos autorizados em `src/components/territorial-map/territorial-map-view.tsx` e `src/app/(private)/dashboard/laboratories/[laboratoryId]/map/page.tsx`; adicionar o destino Mapa em `src/app/(private)/dashboard/laboratories/[laboratoryId]/layout.tsx` e retirar o placeholder/legenda de risco de `src/app/(private)/dashboard/maps.tsx` (depende de T022)
- [ ] T024 [US1] Executar `tests/unit/territorial-map-state.test.ts` e os cenários US1 de `tests/e2e/territorial-map.spec.ts` até GREEN, comprovando lista/mapa derivados do mesmo array, links de área autorizados e zero registro cruzado

**Checkpoint**: US1 é demonstrável de forma independente, mas não constitui o incremento mínimo enquanto coletas, fallback, acessibilidade e gates finais estiverem pendentes.

---

## Phase 4: User Story 2 — Relacionar coletas confirmadas às áreas (Priority: P2)

**Goal**: relacionar zero, uma ou múltiplas coletas confirmadas ao único ponto de sua área, com temporalidade mínima e navegação contextual, sem coordenada ou marcador próprio.

**Independent Test**: selecionar áreas com zero, uma e múltiplas coletas, incluindo linha parcial, e comparar itens, contagem, instantes e destinos com o contrato integrado da IMP-004.

### Preparação compilável

- [ ] T025 [US2] Estender os builders compiláveis de `tests/fixtures/territorial-map.ts` com zero/uma/múltiplas coletas, tupla completa e cada combinação parcial de `occurredAt`/`occurrenceOffset`/`confirmedAt`/`confirmationKey`, sem acessar banco, e confirmar `npm run typecheck`

### Tests for User Story 2

- [ ] T026 [P] [US2] Ampliar `tests/unit/territorial-map-service.test.ts` com filtro pela tupla completa da IMP-004, FK composta área–laboratório, zero/uma/múltiplas, contagem pelo tamanho, ordenação temporal, seleção mínima e ausência de latitude/longitude no filho (FR-003/FR-014–FR-018/FR-022; SC-001–SC-003/SC-005)
- [ ] T027 [P] [US2] Adicionar em `tests/e2e/territorial-map.spec.ts` os cenários de coletas ancoradas somente no ponto da área, linha parcial excluída, muitos itens sem novos marcadores, uma ativação até cada detalhe e reautorização nas rotas existentes (FR-014–FR-018/FR-026; SC-002/SC-003)
- [ ] T028 [US2] Executar os cenários US2 de `tests/unit/territorial-map-service.test.ts` e `tests/e2e/territorial-map.spec.ts`, garantir preparação compilável e registrar RED nas asserções de filtro/relação/navegação

### Implementation for User Story 2

- [x] T029 [US2] Implementar em `src/app/api/server/services/territorial-map.service.ts` a seleção aninhada sem N+1, filtrada simultaneamente por `occurredAt`, `occurrenceOffset`, `confirmedAt` e `confirmationKey` não nulos e subordinada à mesma área/laboratório, sem expor a chave ou criar contador persistido
- [x] T030 [US2] Implementar zero/uma/múltiplas coletas, instantes mínimos, contagem derivada e links `/dashboard/laboratories/{laboratoryId}/areas/{areaId}/collections/{collectionId}` em `src/components/territorial-map/territorial-map-view.tsx`, sem marker ou localização de coleta
- [ ] T031 [US2] Executar os cenários US2 de `tests/unit/territorial-map-service.test.ts` e `tests/e2e/territorial-map.spec.ts` até GREEN e confirmar que as rotas de detalhe da IMP-004 continuam reautorizando o tuple contextual

**Checkpoint**: US1 e US2 entregam a cadeia `laboratório → área-ponto → coleta confirmada`, ainda sem encerrar o mínimo enquanto estados/fallback e acessibilidade estiverem pendentes.

---

## Phase 5: User Story 3 — Consultar sob falhas e mudanças de acesso (Priority: P2)

**Goal**: distinguir loading, vazio, erro, localização indisponível, tile degradado/indisponível e mapa indisponível; descartar respostas tardias e dados cujo acesso foi perdido.

**Independent Test**: provocar separadamente resposta pendente/vazia/falha, coordenada corrompida, configuração ausente, tiles parcial/totalmente falhos, erro do módulo, troca de laboratório e revogação após carregamento, mantendo lista e destinos somente quando ainda autorizados.

### Preparação compilável

- [ ] T032 [US3] Adicionar interfaces compiláveis para geração de request, `AbortController`, retry e ciclos `UNCONFIGURED/LOADING/AVAILABLE/DEGRADED/UNAVAILABLE` em `src/components/territorial-map/territorial-map-state.ts`, `src/components/territorial-map/territorial-map-view.tsx` e `src/components/territorial-map/territorial-map.client.tsx`, sem publicar ainda o comportamento, e confirmar `npm run typecheck`

### Tests for User Story 3

- [ ] T033 [P] [US3] Escrever testes unitários de transições loading/vazio/erro/sucesso, limpeza na nova geração, descarte após abort/resposta tardia, retry, seleção invalidada e classificação de ciclos de tile em `tests/unit/territorial-map-state.test.ts` (FR-019–FR-024; SC-004/SC-009)
- [ ] T034 [P] [US3] Adicionar em `tests/e2e/territorial-map.spec.ts` erros sanitizados e retry, resposta tardia Lab A→Lab B, revogação/inelegibilidade após carga, coordenada ausente/não finita/fora de limite, configuração ausente, tile isolado, todos os tiles abortados, falha do módulo e preservação da lista/links autorizados (FR-004/FR-011/FR-019–FR-025; SC-004/SC-005/SC-009)
- [ ] T035 [US3] Executar os testes US3 de `tests/unit/territorial-map-state.test.ts` e `tests/e2e/territorial-map.spec.ts`, corrigir previamente imports/fixtures/servidor e registrar RED apenas para estados, corrida, revogação e fallback ainda ausentes

### Implementation for User Story 3

- [x] T036 [US3] Implementar máquina de dados, limpeza imediata, fetch `no-store`, abort, geração monotônica, retry e descarte de resposta de laboratório/vínculo anterior em `src/components/territorial-map/territorial-map-state.ts` e `src/components/territorial-map/territorial-map-view.tsx`
- [x] T037 [US3] Implementar eventos `loading`/`tileload`/`tileerror`/`load`, estados separado disponível/degradado/indisponível, fundo neutro/configuração ausente e error boundary restrito ao mapa em `src/components/territorial-map/territorial-map.client.tsx` e `src/components/territorial-map/territorial-map.tsx`, mantendo atribuição enquanto houver conteúdo do provedor
- [ ] T038 [US3] Executar os testes US3 de `tests/unit/territorial-map-state.test.ts` e `tests/e2e/territorial-map.spec.ts` até GREEN, comprovando que falha cartográfica nunca vira vazio/erro de domínio e que perda de acesso remove a projeção anterior

**Checkpoint**: segurança assíncrona e fallback estão completos; acessibilidade/responsividade e gates finais ainda bloqueiam o incremento mínimo.

---

## Phase 6: User Story 4 — Navegar de forma acessível e responsiva (Priority: P3)

**Goal**: oferecer os mesmos registros, relações, estados e destinos por teclado, tecnologia assistiva e telas a partir de 320 px, sem depender de cor, posição, gesto ou tiles.

**Independent Test**: percorrer mapa, lista, seleção, retry e links apenas por teclado nas larguras 320/768/1280 px; verificar nomes, foco, anúncios, sobreposição de pontos, atribuição e ausência de overflow horizontal.

### Preparação compilável

- [ ] T039 [US4] Adicionar helpers compiláveis de foco, nome acessível, overflow e interceptação determinística de tiles nos cenários de `tests/e2e/territorial-map.spec.ts`, sem aceitar assertions ainda satisfeitas por ausência do componente, e confirmar `npm run typecheck`

### Tests for User Story 4

- [ ] T040 [US4] Escrever em `tests/e2e/territorial-map.spec.ts` cenários de Tab/Enter, nomes únicos e descritivos de marcadores, foco visível, ordem previsível, `ul/li`, headings, `role=status`/`role=alert`, anúncio da seleção e relação área–coletas, equivalência mapa/lista, pontos coincidentes, atribuição e viewports 320/768/1280 sem overflow (FR-025–FR-030; SC-006/SC-007/SC-009)
- [ ] T041 [US4] Executar os cenários US4 de `tests/e2e/territorial-map.spec.ts`, corrigir primeiro qualquer falha de ambiente/importação/fixture e registrar RED nas asserções reais de teclado, semântica, foco, texto equivalente ou responsividade

### Implementation for User Story 4

- [ ] T042 [US4] Implementar marcadores com teclado e nome único, seleção equivalente, lista semântica, botões/links separados, foco perceptível, região viva, mensagens não dependentes de cor e painel com heading em `src/components/territorial-map/territorial-map.client.tsx` e `src/components/territorial-map/territorial-map-view.tsx`
- [ ] T043 [US4] Implementar layout empilhado, `min-w-0`, quebra de texto, dimensões `20rem`/`28rem`, ausência de largura mínima acima do viewport e atribuição sempre legível em `src/components/territorial-map/territorial-map.client.tsx`, `src/components/territorial-map/territorial-map-view.tsx` e `src/app/(private)/dashboard/laboratories/[laboratoryId]/map/page.tsx`; executar os cenários US4 até GREEN

**Checkpoint**: as quatro histórias e todos os requisitos obrigatórios estão implementáveis; o incremento mínimo somente pode ser declarado após a Fase 7 inteira.

---

## Phase 7: Polish & Cross-Cutting Gates

**Purpose**: fechar contrato, escala proporcional, regressões, qualidade, escopo, evidência humana e reconciliações futuras sem ampliar a feature.

- [ ] T044 Escrever e executar em `tests/unit/territorial-map-service.test.ts` a prova estrutural em memória com 100 áreas/1.000 coletas confirmadas e ruído de outro laboratório, verificando ausência de N+1, seleção fechada, payload integral, zero cruzamento e tamanho do DTO, sem declarar p95 do endpoint, latência de PostgreSQL ou resultado de `EXPLAIN`
- [ ] T045 Em aplicação isolada e PostgreSQL de teste descartável, carregar a mesma matriz proporcional, executar o procedimento reproduzível de `quickstart.md` com 10 aquecimentos e 100 leituras autenticadas sequenciais, calcular o p95 real contra a meta técnica de 500 ms, medir a lista sem tiles, executar `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)` da query parametrizada e registrar ambiente, comandos, amostras, plano, tamanho do payload, resultados e limitações em `specs/008-territorial-map/implementation-evidence.md`; resultado não executado permanece `NAO_VERIFICADO`, e evidência de gargalo gera recomendação sem autorizar automaticamente índice, migration, paginação, cluster ou PostGIS
- [ ] T046 Executar separadamente a suíte unitária completa com `npm run test:unit`, cobrindo os quatro testes territoriais e regressões unitárias das IMP-003/004, e depois a suíte de integração completa com `npm run test:integration`, incluindo `tests/integration/territorial-map-route.test.ts`, `tests/integration/areas-route.test.ts` e `tests/integration/collections-route.test.ts`, sem mascarar falha entre os dois comandos
- [ ] T047 Executar `npx playwright test tests/e2e/territorial-map.spec.ts` com todas as requests de tile interceptadas e confirmar SC-001–SC-007 automatizável e SC-009 sem depender de serviço cartográfico público
- [ ] T048 Executar as regressões E2E integradas `tests/e2e/area-registration.spec.ts`, `tests/e2e/area-viewing.spec.ts` e `tests/e2e/collection-registration.spec.ts`, preservando mapas, rotas, autorização, temporalidade e fallback das IMP-003/004
- [x] T049 Executar separadamente `npm run typecheck` contra `tsconfig.json` e todos os arquivos alterados em `src/**` e `tests/**`, sem combinar este gate com lint ou build
- [x] T050 Executar separadamente `npm run lint` contra `eslint.config.mjs` e todos os arquivos alterados em `src/**` e `tests/**`, sem correções fora do escopo
- [x] T051 Executar separadamente `npm run build` contra `next.config.ts`, `src/app/(private)/dashboard/laboratories/[laboratoryId]/map/page.tsx` e `src/app/api/laboratories/[laboratoryId]/territorial-map/route.ts`, confirmando o mapa Leaflet ausente do SSR
- [x] T052 Executar separadamente `git diff --check` e revisar o diff de `specs/008-territorial-map/**`, `src/**` e `tests/**` para whitespace e referências quebradas
- [x] T053 Auditar o escopo no diff e registrar evidência em `specs/008-territorial-map/implementation-evidence.md`: nenhuma alteração em `prisma/schema.prisma`, `prisma/migrations/**`, `package.json` ou lockfile; nenhuma duplicação/alteração das projeções de resumo e histórico da IMP-007 além do destino contextual previsto em T023; nenhum filtro, polígono, camada ambiental, IHFR, gráfico, Plotly, Python, PostGIS, schema, migration, índice ou dependência nova (FR-031–FR-035)
- [ ] T054 Registrar em `specs/008-territorial-map/implementation-evidence.md` os resultados automatizados de SC-001–SC-007/SC-009 e manter `NAO_VERIFICADO`, sem presumir aprovação, a parcela de SC-007 que exige tecnologia assistiva real e SC-008 até avaliação moderada com participantes representativos
- [x] T055 Registrar em `specs/008-territorial-map/implementation-evidence.md` as fronteiras condicionadas: a IMP-005 integrada permanece fora do payload sem extensão territorial aprovada; a IMP-007 integrada fornece somente navegação/padrões reutilizados e não a fonte do mapa; aguardar implementação, integração e gates científicos/operacionais da IMP-006 antes de IHFR; não criar agora adaptadores, flags, campos-reserva ou dependência runtime

**Final checkpoint — incremento vertical mínimo**: somente após T001–T055 em GREEN podem ser declarados concluídos o mapa e a lista mínimos. Segurança server-side, isolamento, DTO/no-store, coletas confirmadas, coordenadas inválidas, fallback de tiles/módulo, descarte de dados anteriores, acessibilidade automatizável, responsividade, contrato e regressões são partes inseparáveis da entrega. As avaliações humanas permanecem explicitamente pendentes, sem invalidar o incremento executável nem converter automação em aprovação humana.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 — Setup**: inicia imediatamente; T003 depende de T001 e T002.
- **Phase 2 — Foundational**: depende de T003. Cada bloco segue teste → RED → implementação → GREEN; T012 pode ser escrito em paralelo ao bloco de serviço depois de T003, mas T013–T015 dependem de T011.
- **Phase 3 — US1**: depende de T015; T017 e T018 podem ser escritos em paralelo após T016; T020 e T021 podem ser implementados em paralelo após T019; T022 depende de ambos e T023 depende de T022.
- **Phase 4 — US2**: depende de T024; T026 e T027 podem ser escritos em paralelo após T025; T029 e T030 são sequenciais porque UI depende do DTO/query confirmado.
- **Phase 5 — US3**: depende de T031; T033 e T034 podem ser escritos em paralelo após T032; T036 precede T037 para que o estado de dados esteja isolado do cartográfico.
- **Phase 6 — US4**: depende de T038; testes precedem implementação e GREEN.
- **Phase 7 — Gates**: depende de T043; T044 prova estrutura em memória, T045 mede endpoint/PostgreSQL reais e T046–T055 seguem em ordem para manter evidência inequívoca e não mascarar falhas entre gates.

### User Story Dependencies

- **US1 (P1)**: depende somente da fundação integrada; entrega áreas autorizadas e navegação de área dentro da experiência contextual da IMP-007.
- **US2 (P2)**: depende de US1 porque acrescenta relações ao mesmo painel/seleção e estende a query territorial.
- **US3 (P2)**: depende de US1/US2 para provar preservação ou descarte da projeção completa sob falhas e mudanças de contexto.
- **US4 (P3)**: depende de US1–US3 para validar acessibilidade e responsividade de todas as ações e estados reais.
- A ordem executável é `Setup → Foundational → US1 → US2 → US3 → US4 → Gates`; IMP-005/007 já integram a baseline, mas o endpoint territorial consulta diretamente área/coleta e a IMP-006 não é dependência runtime.

### RED/GREEN discipline

1. Concluir a preparação compilável da fase.
2. Escrever o teste contra o contrato esperado.
3. Executar o teste e observar falha de asserção sobre comportamento ausente; erro de importação, compilação, fixture, banco, servidor ou browser não é RED.
4. Implementar somente o comportamento coberto pela fase.
5. Executar os testes da fase até GREEN antes de avançar.

### Parallel Opportunities

- T002 pode ocorrer em paralelo a T001 por não importar os módulos de produção.
- T012 pode ser escrito em paralelo ao bloco T008–T011, pois lê apenas o OpenAPI já publicado.
- T017/T018, T026/T027 e T033/T034 são pares de testes em arquivos/camadas diferentes após suas respectivas preparações.
- T020/T021 são implementações independentes em estado puro e configuração do mapa, convergindo em T022.
- Não há `[P]` em tarefas que tocam `territorial-map-view.tsx`, `territorial-map.client.tsx`, o mesmo arquivo de teste ou dependem de um DTO/query ainda incompleto.

---

## Parallel Examples

### User Story 1

```text
Após T016:
Task T017: testes unitários em tests/unit/territorial-map-state.test.ts
Task T018: testes E2E em tests/e2e/territorial-map.spec.ts

Após T019:
Task T020: estado puro em src/components/territorial-map/territorial-map-state.ts
Task T021: configuração compartilhada em src/components/maps/map-config.ts
```

### User Story 2

```text
Após T025:
Task T026: testes do serviço em tests/unit/territorial-map-service.test.ts
Task T027: cenários de navegação em tests/e2e/territorial-map.spec.ts
```

### User Story 3

```text
Após T032:
Task T033: transições puras em tests/unit/territorial-map-state.test.ts
Task T034: corridas/fallback em tests/e2e/territorial-map.spec.ts
```

US4 permanece sequencial porque teste e implementação convergem nos mesmos componentes e na mesma spec E2E.

---

## Requirements & Success Criteria Coverage

| Coverage group | Primary tasks | Evidence |
|---|---|---|
| FR-001–FR-006 | T008–T015, T018, T034 | guard antes da query, respostas indistinguíveis, inativo somente leitura, projeção transitória |
| FR-007–FR-013 | T004–T007, T017–T024, T034 | ponto atual, limites/extremos, precisão, `location: null`, fit e coincidência sem agregação |
| FR-014–FR-018 | T004–T007, T025–T031 | tupla completa IMP-004, subordinação área/lab, zero/uma/múltiplas e links contextuais |
| FR-019–FR-024 | T008–T015, T032–T038 | estados distintos, erro sanitizado, no-store, fallback e descarte de resposta/dados anteriores |
| FR-025–FR-030 | T017–T024, T033–T043 | lista equivalente, seleção, teclado, nomes/foco/texto, 320 px e atribuição |
| FR-031–FR-035 | T044, T052–T055 | auditoria de ausência de escopo futuro, preservação das projeções integradas e extensão somente após aprovação aplicável |
| SC-001–SC-005 | T002, T008–T015, T018, T024, T026–T031, T034–T038 | matriz multi-lab, origem/contagem/destino, estados e privacidade |
| SC-006 | T039–T043, T047 | 320/768/1280 px sem overflow e com conteúdo/destinos alcançáveis |
| SC-007 | T039–T043, T047, T054 | automação de teclado/nome/foco e pendência explícita de tecnologia assistiva real |
| SC-008 | T054 | avaliação moderada humana permanece `NAO_VERIFICADO` até evidência real |
| SC-009 | T033–T043, T047 | tiles/módulo indisponíveis com lista e destinos preservados |

Cobertura planejada: **35/35 requisitos funcionais** e **9/9 critérios de sucesso**, sendo SC-008 e a parcela humana de SC-007 acompanhamento de avaliação real, não aprovação automatizada.

---

## Implementation Strategy

### Incremento vertical mínimo obrigatório

1. Completar Setup e Foundational com endpoint autorizado, DTO fechado e contrato em GREEN.
2. Completar US1 para áreas, mapa/lista e navegação contextual.
3. Completar US2 para coletas confirmadas aninhadas sem localização própria.
4. Completar US3 para estados, fallback, revogação e descarte de respostas tardias.
5. Completar US4 para teclado, nomes, foco, alternativa textual e 320/768/1280 px.
6. Completar todos os gates T044–T055.
7. Somente então declarar o mapa mínimo implementado; US1 sozinha é uma demonstração intermediária, não MVP publicável desta spec.

### Future reconciliation (não bloqueante)

- IMP-005/007 fornecem código e contratos runtime integrados que devem ser preservados: a primeira continua fora do payload por escopo; a segunda fornece landing/navegação/estados, mas não a fonte territorial. A IMP-006 fornece somente documentação não integrada.
- Não antecipar camada ambiental, IHFR, dashboard, gráfico, filtro, polígono, PostGIS, implementação de Plotly, Python, schema, migration, índice ou dependência.
- Plotly é direção para gráficos analíticos em entrega própria sempre posterior à IMP-009, possivelmente paralela à IMP-010 sem depender dela; a forma de integração será planejada nessa entrega futura e, para IHFR, após contrato implementado/integrado e aprovação científica aplicável. Essa decisão não altera T001–T055 nem inclui dados da IMP-005 ou projeções da IMP-007 no mapa mínimo.
- Índice/paginação/agregação só entram em trabalho futuro após evidência registrada de volume, `EXPLAIN` ou latência e decisão de produto/UX compatível com FR-012.

## Notes

- `[P]` significa arquivos diferentes e dependências concluídas; não significa apenas “poderia ser feito por outra pessoa”.
- Commits podem agrupar ciclos RED/GREEN coerentes; nunca marcar GREEN sem executar o teste correspondente.
- Testes automatizados de browser interceptam tiles; nenhum gate depende de OpenStreetMap ou outro provedor público.
- A implementação preserva `src/components/areas/area-map.client.tsx` e as rotas de detalhe existentes como regressões obrigatórias das IMP-003/004.
- Nenhuma tarefa autoriza merge, rebase, schema, migration, dependência ou expansão científica.
