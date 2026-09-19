# Research: Mapa e visualização territorial

**Feature**: IMP-008

**Date**: 2026-09-18
**Status**: complete

`DECISAO_DE_PLANEJAMENTO` identifica escolhas locais e reversíveis desta feature. `EVIDENCIA_IMPLEMENTACAO` descreve somente o baseline integrado. `PENDENCIA_DE_DECISAO` preserva assuntos que este plano não pode resolver.

## R-001 — Baseline e dependências

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: executar sobre `origin/development@10fdb8bbb8e4895614575fedc9de8e08a5121afe`, incorporada pelo merge `46b22d1`, com IMP-003/004/005/007 integradas. Tratar a IMP-006 `ab5e30b...` como fonte documental não integrada e não bloqueante do mapa mínimo.

**Rationale**: `git fetch origin` confirmou a integração das IMP-005/007 e a divergência documental da IMP-006. O runtime integrado fornece guard, critério de confirmação, landing/navegação e padrões de estado; nenhum deles autoriza camada ambiental ou diagnóstico por inferência.

**Alternatives considered**:

- Incorporar commits das branches futuras: rejeitado por ampliar escopo e contrariar a solicitação.
- Bloquear o mapa até dados ambientais/IHFR/dashboard: rejeitado porque pontos e coletas confirmadas já formam um incremento verificável.
- Tratar contratos publicados como implementação: rejeitado; planejamento e tasks não provam runtime integrado.

## R-002 — Fonte e fronteira de leitura

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: criar um serviço territorial de leitura que usa diretamente `CollectionArea` e a relação `CollectionData`, dentro da mesma transação que revalida o contexto. A projeção não é persistida.

**Rationale**: o schema integrado possui ponto direto na área e FK composta coleta–área–laboratório. Uma projeção transitória evita contador, cópia, evento ou fonte de verdade paralela.

**Alternatives considered**:

- Persistir tabela/materialized view territorial: rejeitado sem necessidade de escala, histórico ou snapshot.
- Consultar áreas e depois uma request por área: rejeitado por N+1 e risco de estados divergentes.
- Consumir o dashboard integrado como fonte: rejeitado porque seu contrato exclui coordenadas e sua projeção não é fonte do mapa; reutilizam-se apenas guard, critério de confirmação, navegação e padrões de estado.

## R-003 — Endpoint territorial próprio

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: expor apenas `GET /api/laboratories/{laboratoryId}/territorial-map`, com um envelope fechado `{ context, areas }` e `Cache-Control: no-store`.

**Rationale**: o endpoint da IMP-003 serve listagem/cadastro de áreas e não deve carregar coletas para consumidores existentes. Uma fronteira própria torna minimização, falhas e testes auditáveis sem criar endpoints por marcador.

**Alternatives considered**:

- Expandir `GET .../areas`: rejeitado por alterar contrato integrado e aumentar payload de uma tela que não precisa das relações.
- Buscar somente por Server Component sem contrato HTTP: rejeitado porque retry, troca contextual, integração e validação do DTO ficam menos explícitos.
- Endpoint por área/coleta: rejeitado por multiplicar chamadas e autorizações.

## R-004 — Autorização e erros

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: reutilizar `requireAuth` e `authorizeLaboratoryAccess(..., "READ_AREAS")` antes de qualquer consulta territorial. Retornar `401` para sessão ausente/conta inelegível, `404` uniforme para laboratório/vínculo/contexto inacessível e `500` sanitizado; laboratório inativo retorna leitura `200` com `readOnly`.

**Rationale**: é a semântica integrada das IMP-003/004. Todos os papéis contextuais atuais podem ler, portanto não há caso normal de `403` nesta operação.

**Alternatives considered**:

- Guard apenas na página: rejeitado porque o endpoint continuaria acessível diretamente.
- Confiar em `membershipRole` do cliente: rejeitado por ser estado adulterável/desatualizado.
- Diferenciar recurso cruzado com `403`: rejeitado porque revelaria existência.

## R-005 — Critério de coleta confirmada

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: incluir somente linhas com `occurredAt`, `occurrenceOffset`, `confirmedAt` e `confirmationKey` não nulos, reproduzindo a tupla de completude exigida pelo serviço de detalhe da IMP-004.

**Rationale**: a migration preserva linhas legadas parciais; presença isolada no model não torna uma linha coleta confirmada. `confirmationKey` participa apenas do filtro e nunca do DTO.

**Alternatives considered**:

- Usar apenas `confirmedAt`: rejeitado por aceitar linha inconsistente/legada fora do contrato integrado.
- Contar todas as `CollectionData`: rejeitado por violar FR-014/018.
- Duplicar status persistido: rejeitado por criar estado redundante sem migration autorizada.

## R-006 — DTO, coordenadas e precisão

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: cada área expõe `id`, `name`, `location` (`{ latitude, longitude }` ou `null`) e `confirmedCollections`; cada coleta expõe somente `id`, `occurredAt` e `confirmedAt`. Contagem e destinos são derivados desses IDs. Coordenadas são validadas e enviadas como números com precisão persistida máxima de seis casas.

**Rationale**: é o menor conjunto para posicionamento, identificação temporal, contagem e navegação. `location: null` protege contra legado/corrupção mesmo com colunas atualmente obrigatórias. A formatação textual remove zeros finais e não fabrica casas.

**Alternatives considered**:

- Reutilizar `AreaDetailDto`: rejeitado porque inclui descrição, tipo e data não necessários.
- Incluir `confirmedCollectionCount` além do array: rejeitado por redundância e risco de inconsistência.
- Enviar coordenada como string fixa com seis casas: rejeitado por acrescentar zeros que sugerem precisão textual.
- Incluir autoria, observações ou `confirmationKey`: rejeitado por minimização.

## R-007 — Leaflet agregado

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: reutilizar Leaflet 1.9.4/React-Leaflet 5 já integrados, o CSS e o padrão `next/dynamic({ ssr: false })`; criar componente de múltiplos pontos separado do mapa de cadastro/detalhe da IMP-003.

**Rationale**: não há nova necessidade de renderização que justifique outra biblioteca. O componente existente mistura clique para edição e um único marker, enquanto a visão agregada exige seleção, fit e estados de tiles. React-Leaflet documenta `MapContainer` com `bounds`, e Next.js restringe `ssr: false` a Client Components: <https://react-leaflet.js.org/docs/api-map/> e <https://nextjs.org/docs/app/guides/lazy-loading>.

**Alternatives considered**:

- Reusar `AreaMap` sem alteração: rejeitado porque seu contrato é ponto único/editável.
- Plotly no mapa mínimo: rejeitado por não resolver melhor o mapa interativo de pontos/tiles; sua escolha posterior para gráficos analíticos tem finalidade e entrega distintas.
- MapLibre ou nova biblioteca: rejeitado por peso e duplicidade sem caso de uso.
- Canvas/CSS próprio: rejeitado por interação, acessibilidade e manutenção.

## R-008 — Enquadramento e pontos coincidentes

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: aplicar `fitBounds` a todas as localizações válidas com padding e zoom máximo; para um ponto, usar `setView` com zoom moderado. Não agrupar, deslocar nem deduplicar coordenadas iguais.

**Rationale**: Leaflet oferece `fitBounds` e `maxZoom` nativamente: <https://leafletjs.com/reference.html#map-fitbounds>. IDs, não coordenadas, definem identidade. A lista garante distinção mesmo quando markers se sobrepõem.

**Alternatives considered**:

- Centro fixo do Brasil: rejeitado porque pode esconder pontos e exige suposição territorial.
- Cluster/spiderfy/jitter: rejeitado por FR-013/031 e por introduzir semântica não aprovada.
- Um marker por coleta: rejeitado porque coleta não possui coordenada própria.

## R-009 — Tiles, atribuição e cache

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: manter URL/atribuição configuráveis; extrair helper genérico compartilhado com IMP-003. Produção sem configuração funciona sem base. Observar eventos do `TileLayer` para distinguir disponível, degradado e indisponível, mantendo a atribuição enquanto a camada estiver montada.

**Rationale**: Leaflet exige altura do container e oferece `tileload`, `tileerror` e `load`: <https://react-leaflet.js.org/docs/start-setup/> e <https://leafletjs.com/reference.html#gridlayer-event>. A política OSM exige atribuição visível, cache HTTP, referer e proíbe prefetch/offline: <https://operations.osmfoundation.org/policies/tiles/>.

**Alternatives considered**:

- Hardcode do servidor OSM em produção: rejeitado por disponibilidade best-effort e política operacional.
- Aplicar `no-store` aos tiles: rejeitado por contrariar cache do provedor; `no-store` pertence apenas aos dados privados.
- Ocultar a atribuição quando um tile falha: rejeitado se ainda houver conteúdo do provedor.
- Tratar um `tileerror` isolado como falha completa: rejeitado por conflitar com o edge case da spec.

## R-010 — Estados assíncronos e resposta tardia

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: usar máquina de estados explícita para dados, `AbortController` e contador de geração. Toda nova leitura limpa dados anteriores; somente a geração corrente pode publicar resultado. Estado de tiles e falha do módulo são independentes do estado de dados.

**Rationale**: abort reduz trabalho, mas o contador também protege contra mocks/drivers que concluam depois do abort. Separar estados impede que tiles indisponíveis pareçam laboratório vazio ou erro de autorização.

**Alternatives considered**:

- Manter payload stale durante retry: rejeitado por risco de laboratório anterior ou vínculo revogado.
- Um booleano `loading`: rejeitado por não distinguir vazio, erro, tiles e localização indisponível.
- Cache cliente compartilhado: rejeitado por privacidade e simplicidade.

## R-011 — Acessibilidade e equivalência textual

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: tratar a lista textual como interface completa e o mapa como representação sincronizada. Preservar navegação de teclado do Leaflet; fornecer nome único aos markers, foco perceptível, painel textual e status vivo. Testar com teclado e tecnologia assistiva real separadamente.

**Rationale**: Leaflet documenta mapa/markers operáveis por teclado por padrão e exige nome descritivo (`alt`/`title` ou HTML do `divIcon`): <https://leafletjs.com/examples/accessibility/>. A lista é necessária para falhas, sobreposições e pessoas que não percebem espacialmente o mapa.

**Alternatives considered**:

- Tornar o mapa decorativo: rejeitado porque a spec exige seleção essencial por marker.
- Popup como único detalhe: rejeitado por foco, responsividade e fallback.
- Depender de cor/posição: rejeitado por FR-027/028.

## R-012 — Limites, índices e metas proporcionais

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: não adicionar índice, paginação, cluster ou PostGIS. Separar a prova estrutural unitária em memória, com matriz sintética de 100 áreas/1.000 coletas confirmadas, da medição real em aplicação isolada e PostgreSQL descartável. Somente a segunda mede p95 do endpoint e produz `EXPLAIN` da query real; abrir otimização separada apenas com evidência registrada.

**Rationale**: os índices existentes cobrem área por laboratório e coleta por área/laboratório. Um double unitário prova cardinalidade, seleção e ausência de N+1, mas não representa rede, handler, Prisma ou PostgreSQL. Não existe volumetria real ou resultado medido que justifique migration. Truncar violaria a necessidade de tornar todas as áreas alcançáveis.

**Alternatives considered**:

- Índice lab-wide em coleta agora: rejeitado sem `EXPLAIN`/latência que demonstre necessidade.
- Limite silencioso de linhas: rejeitado por produzir sucesso incompleto.
- Paginação do mapa: rejeitada sem UX para enquadramento parcial.
- Infraestrutura espacial: rejeitada porque a consulta é relacional e os pontos já estão armazenados.

## R-013 — Estratégia de testes

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: manter `node:test`/`tsx`, factories injetáveis e Playwright. Extrair estado/formatação puros para unidade; validar OpenAPI estaticamente; testar fallback de tiles por configuração ausente e interceptação de rede; executar regressões IMP-003/004 na implementação.

**Rationale**: segue os padrões conectados do repositório e separa erros de serializer/autorização/estado de problemas de navegador. Tiles públicos não são infraestrutura de testes.

**Alternatives considered**:

- Somente E2E: rejeitado por diagnóstico ruim de filtros, DTO e corrida.
- Somente unidade: rejeitado por não provar foco, dimensões, links, abort e fallback real.
- Declarar SC-007/008 aprovados por automação: rejeitado; tecnologia assistiva e pesquisa moderada exigem evidência humana.

## R-014 — Reconciliação futura

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: não ler dados ambientais da IMP-005 integrada, não copiar resumo/histórico da IMP-007 integrada e manter a IMP-006 documental fora do runtime; nenhum enum, adaptador, flag, cor ou placeholder futuro entra no mapa mínimo.

**Rationale**: a IMP-005 implementa dados imutáveis, mas sua presença não aprova exposição territorial; a IMP-007 implementa projeções sem coordenadas e não deve ser duplicada; a IMP-006 não possui contrato implementável e mantém gates. Antecipar tipos criaria acoplamento e ampliaria o escopo.

**Alternatives considered**:

- Expor existência/payload ambiental agora: rejeitado por falta de decisão territorial, minimização e caso de uso aprovado, apesar da fonte integrada.
- Reservar risco/cor IHFR: rejeitado por falta de ciência aprovada.
- Fazer o endpoint do dashboard fornecer o mapa: rejeitado por dependência invertida e duplicação de contrato; a página contextual apenas oferece o destino de navegação.

## R-015 — Direção futura para gráficos analíticos

**Decision (`DECISAO_CONFIRMADA_PARA_A_ESPECIFICACAO`)**: por solicitação explícita da equipe nesta atualização de 2026-09-18, adotar Plotly como direção futura para gráficos e visualizações analíticas relacionados aos registros exibidos no contexto territorial. A implementação será sempre posterior à IMP-009, em entrega própria ainda sem identificador atribuído, e poderá ocorrer em paralelo com a IMP-010 sem depender dela nem representar aprovação antecipada.

**Rationale**: a decisão separa a finalidade analítica futura do motor cartográfico do mapa mínimo. O backlog já atribui IMP-009 e IMP-010 a outras entregas, portanto nenhum novo `IMP-*` foi inferido. `TD-010` e os registros Code-First diretamente pertinentes foram reconciliados nesta atualização autorizada, preservando o estado anterior de avaliação no histórico e sem declarar implementação.

**Conditions and open choices**:

- o mapa mínimo da IMP-008 continua em Leaflet/React-Leaflet, sustentado apenas por áreas e coletas integradas;
- T001–T055 não recebem instalação, implementação, critério ou dependência de Plotly;
- dados ambientais exigem integração e reconciliação dos contratos pertinentes antes de alimentar gráficos;
- IHFR exige também implementação, integração e aprovação científica aplicável;
- o planejamento da entrega futura decidirá integração no frontend ou via Plotly Python;
- a decisão não introduz Python, PostGIS, segundo motor cartográfico, dependência ou gráfico nesta feature; IMP-005/007 integradas continuam fora da projeção mínima e a IMP-006 continua não integrada.

## Conclusão da pesquisa

Todas as incertezas técnicas necessárias ao mapa mínimo foram resolvidas sem `NEEDS CLARIFICATION`. A escolha de Leaflet vale para esta entrega por reuso proporcional do baseline; não atualiza `TD-011`/`TD-014` nem aprova a arquitetura cartográfica definitiva. Plotly foi escolhido somente como direção de uma entrega analítica futura posterior à IMP-009, cuja integração técnica permanece aberta. Outras geometrias, camadas, filtros, compartilhamento, generalização e simbologia permanecem `PENDENCIA_DE_DECISAO`.
