# Análise preliminar da fase

Data: 2026-10-01, America/Fortaleza. Referência: `development@8d78d521cadf869379d1e25388ea8fd09fce17d4`. Mandato, prioridades, etapas e estados estão no [PLAN.md](PLAN.md). Este documento reúne evidências para planejamento, sem declarar correção ou validação funcional nesta rodada.

## 1. Método, alcance e estado encontrado

`EVIDENCIA_IMPLEMENTACAO` — A inspeção enumerou arquivos rastreados de aplicação, testes, Prisma, configuração, governança, auditorias e dez pacotes Spec Kit. Aprofundou leitura nos mapas, layouts autenticados, formulários de área/coleta/medições, gestão IHFR, validação temporal, serviços associados e identidade visual de login/cadastro. Os cinco JPG de Figma foram abertos e examinados visualmente. Governança e evidências históricas foram lidas em seções pertinentes; não houve revisão integral de todo o código, corpus histórico, specs, testes ou PRs.

O checkout começou limpo, sem alteração preexistente identificada; branch preservada. O pacote declara Next.js 16.3.6, React 19.2.4, Leaflet 1.9.4, React-Leaflet 5.0.0, Prisma 7.4.2, Tailwind 4 e Node `>=24.19.0 <25`. São declarações versionadas em [package.json](../../../../package.json), não atestado do runtime instalado ou publicado. A aplicação usa App Router, componentes React, APIs contextuais, serviços no backend TypeScript e PostgreSQL pelo Prisma. A inspeção não abriu valores de arquivos de ambiente nem acessou banco.

`FATO_DOCUMENTADO` — A API GitHub consultada nesta rodada confirma o [PR #30](https://github.com/PedroVitor237/HidroFlorestas/pull/30) integrado em `main` em 2026-10-01 às 03:32:30, America/Fortaleza; merge `cf6a7bdc9ca001d5a61845b1258395fe2cfb26c5`, head `8d78d52`. O diff de árvores entre esse merge e o HEAD local é vazio. A descrição ainda contém frases anteriores dizendo que o PR estaria aberto: o campo atual `merged_at` e o grafo Git comprovam a integração. Isso não comprova qual build serviu os testes manuais ou a configuração efetiva do domínio publicado.

### Inventário funcional preliminar para a fase

| Contexto | Caminhos de tela e componentes | Contratos e estados a preservar |
|---|---|---|
| Acesso público | `/`, `/login`, `/register`, `/logout`; contexto de autenticação | Cadastro público ativo conforme TD-017, sessão, falha e repetição de logout. Landing apenas enumerada; não revisada integralmente. |
| Workspace | `/workspace`; `LaboratoryWorkspace`, TopBar | Lista/criação de laboratórios, contexto explícito, limite de vínculos; ingresso ainda indisponível conforme Code-First. Formulários/modais exigem inventário detalhado antes do prompt. |
| Laboratório | `/dashboard/laboratories/[laboratoryId]`, `/members` | Resumo/histórico contextual, papéis e leitura em inatividade. |
| Áreas | `.../areas`, `.../areas/new`, `.../areas/[areaId]` | Nome, ponto latitude/longitude, Município/UF/tipo de terreno/descrição opcionais; seleção manual, mapa e geolocalização; lista/detalhe. |
| Coleta | `.../areas/[areaId]/collections/new` e `.../collections/[collectionId]` | Ocorrência com fuso, revisão, confirmação imutável, idempotência, detalhe e diagnóstico vinculado. |
| Medições | `.../collections/[collectionId]/environmental-data` e `/new` | Água, solo, vegetação e terreno; campos/unidades/opcionalidade em `ENVIRONMENTAL_FIELDS`; revisão/confirmar e leitura integral. |
| IHFR experimental | Gestão na tela da coleta; `IHFRDiagnosisManagement` | Sete usos da terra, origem/data da observação, elegibilidade, criação/substituição/revogação, insuficiência e recuperação da mesma operação. |
| Mapa territorial | `.../laboratories/[laboratoryId]/map` | Projeção autorizada, pontos das áreas, coletas vinculadas e lista equivalente; sem camada de risco científico. |
| Administração | `/admin`, `/admin/users`; `AdminShell` | Papel global separado dos vínculos locais, estados de conta, concorrência e auditoria. Inspeção focal do layout, sem auditoria completa das operações. |

Para o prompt futuro, completar por tela: campos, obrigatoriedade, permissões, carregamento, vazio, erro, perda de acesso, somente leitura, confirmação, resultado incerto e navegação. A enumeração acima não é esse inventário completo.

### Divergências e cautelas já localizadas

- [PROJECT_CONTEXT.md](../../../../PROJECT_CONTEXT.md) conserva a fase histórica de auditoria; o [README Code-First](../../../code-first-prd/README.md) já registra atualização funcional em 28/09. Não usar o contexto navegacional como estado operacional completo.
- [README das imagens](../../../figma-references/README.md) conserva pendência sobre como localizar áreas; a IMP-003 e o código já tratam um ponto, entrada manual, clique e dispositivo. A referência visual não reabre automaticamente polígono ou seleção de geometria.
- A [evidência IMP-008](../../../../specs/008-territorial-map/implementation-evidence.md) de 19/09 diz que a IMP-006 era apenas documental; o PR #29 e a implementação IHFR posterior evidenciam a evolução. A afirmação histórica não descreve o HEAD atual.
- [tasks.md da IMP-008](../../../../specs/008-territorial-map/tasks.md) contém 22 caixas abertas e 33 marcadas. Há tarefas abertas de código/testes com artefatos hoje existentes, além de verificações de performance ainda não comprovadas. Reconciliar item a item futuramente; não inferir entrega ausente nem validação atual a partir de checkbox.
- [PENDING_DECISIONS.md](../../../governance/PENDING_DECISIONS.md) mantém decisões amplas de mapas, UX e domínio abertas; escolhas locais das features não equivalem a arquitetura definitiva. `PD-002` científica segue aberta; `PD-018` HTTP e `PD-009` Plotly têm resolução registrada, com recortes próprios.

## 2. Mapa: fatos, hipótese principal e diagnóstico posterior

### Evidência estática

1. A mensagem exata “Mapa base indisponível. As coordenadas continuam disponíveis.” está em [area-map.client.tsx](../../../../src/components/areas/area-map.client.tsx), linha 15, condicionada a `!config`. Nesse caminho o `MapContainer`, os eventos de clique e o marcador continuam montados, mas `TileLayer` não é renderizado. A frase não é um detector de erro HTTP de tile.
2. [area-map.tsx](../../../../src/components/areas/area-map.tsx) é o componente compartilhado entre cadastro e detalhe de área. Carrega o cliente sem SSR e possui fallback de erro próprio, com outra mensagem.
3. Cadastro usa [area-form.tsx](../../../../src/components/areas/area-form.tsx), na rota `.../areas/new`; detalhe usa [página de detalhe da área](../../../../src/app/(private)/dashboard/laboratories/[laboratoryId]/areas/[areaId]/page.tsx). O terceiro contexto é o [mapa territorial](../../../../src/components/territorial-map/territorial-map.client.tsx), com componente diferente e configuração comum.
4. [maps/map-config.ts](../../../../src/components/maps/map-config.ts), linhas 3–9, exige `NEXT_PUBLIC_MAP_TILE_URL` e `NEXT_PUBLIC_MAP_ATTRIBUTION` não vazias, mais prefixo `https://` na URL. Fora de produção, a ausência dessa combinação ativa `https://tile.openstreetmap.org/{z}/{x}/{y}.png`, atribuído ao OpenStreetMap. Em produção retorna `null`. O provedor efetivamente configurado no deploy é **não verificado**; OpenStreetMap é o fallback local identificado.
5. O mapa territorial acompanha eventos `loading`, `tileload`, `tileerror` e `load`, distinguindo base ausente/degradada/indisponível; o mapa de área não possui esse acompanhamento de tiles.
6. CSS Leaflet é importado pelos dois clientes; há alturas explícitas (`h-72`/`sm:h-96` e `h-80`/`sm:h-[28rem]`). [next.config.ts](../../../../next.config.ts) não declara políticas de headers. Isso não comprova carregamento de CSS, dimensões computadas ou ausência de CSP/headers externos no deploy. `globals.css` aplica transição global, a observar se houver falha visual após excluir configuração/rede.
7. O diff `eee3bd8` mostra que a IMP-008 extraiu a configuração já existente da IMP-003 para módulo comum, preservando a regra de produção. Não é evidência de regressão causada pela extração.
8. [quickstart da IMP-003](../../../../specs/003-area-registration-and-viewing/quickstart.md), seção de tiles, já exige configuração e provedor aprovado em produção. Testes existentes de [cadastro](../../../../tests/e2e/area-registration.spec.ts), [consulta](../../../../tests/e2e/area-viewing.spec.ts) e [mapa territorial](../../../../tests/e2e/territorial-map.spec.ts) interceptam tiles em cenários de fallback. Seus sucessos históricos não certificam disponibilidade de um provedor real no site.

### Hipóteses verificáveis

Todas são `INFERENCIA`; nenhuma causa foi reproduzida nesta rodada.

| Hipótese | Evidência discriminante a coletar | Prioridade |
|---|---|---|
| Configuração pública ausente/inválida no build servido | Confirmar presença das duas variáveis, escopo Production/Preview, URL HTTPS e incorporação no bundle daquele SHA; DOM sem `img.leaflet-tile` e sem requisições de tile é compatível com `config=null`. Registrar apenas presença/validade, sem valores ou tokens. | Primeira: explica diretamente a frase exata no código inspecionado. |
| Build antigo, domínio/ambiente divergente ou configuração alterada depois do build | Correlacionar domínio, deployment, SHA, data e build; comparar ambiente do desenvolvedor. | Junto da primeira. |
| Bloqueio de rede/provedor, quota, autenticação, origem/referer, DNS/TLS ou extensão | Se houver `TileLayer`, capturar URL sanitizada, HTTP 401/403/404/429/5xx, falha de rede, tipo de conteúdo e erro no console; repetir em navegador/rede de controle. CORS só deve ser atribuído se a evidência o indicar. | Depois de confirmar configuração. |
| CSP, conteúdo misto, bundle/CSS ou dimensões | Headers reais e console, chunks/CSS, caixa computada maior que zero, overflow/z-index e resize. Verificar erro de módulo versus falha de imagem. | Condicional à evidência. |

`FATO_DOCUMENTADO` externo — O Next.js incorpora referências diretas `NEXT_PUBLIC_*` no bundle durante o build; mudanças posteriores exigem novo build para chegar ao cliente. Consultado em 01/10 na [documentação oficial](https://nextjs.org/docs/app/guides/environment-variables#bundling-environment-variables-for-the-browser). Isso fundamenta conferir o build, sem autorizar rebuild/deploy nesta execução.

### Roteiro objetivo da etapa 1

1. Fixar URL/deployment/SHA testados, horário, navegador/versão, dispositivo, viewport, rede e rota. Confirmar se o relato refere-se ao domínio indicado pelo PR #30 ou a outro ambiente. Usar conta e registros de teste autorizados; não gravar cookies, tokens, IDs pessoais ou coordenadas particulares em evidências compartilhadas.
2. Comparar desenvolvimento local, build local de produção e publicado na mesma referência de código. Antes de executar suítes, identificar destino descartável e preflights: os runners existentes podem preparar/remover fixtures e não devem ser apontados para dados manuais preexistentes.
3. No publicado, abrir Network/Console antes de recarregar a tela. Guardar captura visual e evidência sanitizada: frase, existência da camada, quantidade de imagens, dimensões, requisições/respostas e bloqueios. HAR somente após remoção de headers, cookies, query tokens e dados privados.
4. Confirmar a configuração do **build correspondente** por presença/validade e ambiente. Se a camada não existir, investigar esse ramo primeiro. Se existir, acompanhar uma pequena amostra manual de tiles e verificar status, conteúdo, atribuição e política do provedor. Não fazer carga automatizada contra tiles públicos.
5. Definir a menor correção sustentada pela reprodução. Se bastar corrigir a configuração aprovada, evitar trocar biblioteca ou provedor sem necessidade. Se não houver provedor escolhido para produção, registrar a decisão material; não habilitar silenciosamente fallback público. Testes automatizados deverão usar tiles controlados e cobrir configuração válida/ausente, sucesso, falha total e parcial quando aplicável.
6. Validar todas as telas abaixo; preservar seleção, coordenadas, lista, isolamento e navegação. Registrar commit/configuração, ambiente, evidência antes/depois, verificações executadas e limites. Se faltar acesso publicado, o resultado fica **validado apenas localmente** e a falha publicada permanece sem confirmação de resolução.

| Tela | Sucesso a demonstrar | Falha controlada a preservar |
|---|---|---|
| Cadastro de área | Base visível, atribuição, clique altera ponto correto; entrada manual e dispositivo continuam disponíveis; desktop/móvel. | Coordenadas/editabilidade continuam utilizáveis. Confirmação persistida somente em ambiente de teste autorizado. |
| Detalhe da área | Base e marcador no ponto persistido, reload e dimensões corretas. | Texto de coordenadas e navegação continuam acessíveis. |
| Mapa territorial do laboratório | Base, pontos, seleção pela lista/marcador, atribuição e destinos corretos; laboratório ativo/inativo. | Lista completa, estados distinguíveis, erro de dados separado de falha de tiles. |

Não houve acesso ao painel Vercel, inspeção de configuração publicada, reprodução em navegador, execução local ou correção nesta rodada. Comentário histórico do bot Vercel no PR #27 trata de permissão para um deploy daquela época; não comprova a causa atual do mapa.

## 3. Triagem das demais melhorias

`RECOMENDACAO` — As janelas abaixo começam **depois do mapa e dos dois relatórios**. Esforço é estimativa de engenharia (`INFERENCIA`), não compromisso: pequeno ≈ 0,5–2 dias; médio ≈ 2–5 dias; grande ≈ 5–10+ dias de trabalho focal, excluindo espera externa e revisão da equipe.

| Item | Comportamento e evidência | Camadas, dependências e riscos | Momento recomendado |
|---|---|---|---|
| A. Logout | Sidebar de `/dashboard` oferece `/logout`; AdminShell tem saída desktop/móvel. `/workspace` usa TopBar sem saída e oculto no móvel; layout privado raiz só restaura sessão. Infraestrutura POST `/api/auth/logout` e contexto já existem. | UI/layouts e sessão; pequeno. Reutilizar ação/rota existente, oferecer saída em workspace e demais contextos autenticados, com teclado/móvel, espera/erro/retry. Não exigir laboratório; verificar duplicação de cabeçalhos e manter comportamento quando o POST falha. | **Antes do Lovable**: corrigir acesso funcional agora na etapa própria; posição e acabamento podem evoluir na reformulação. |
| B. Município/UF | Geolocalização no `AreaForm` obtém apenas coordenadas. Município/UF são campos opcionais livres. Busca focal não localizou geocodificador reverso ou serviço equivalente. `pointReducer` já preserva edição de coordenadas contra resposta tardia. | UI + integração externa, possivelmente API; médio. Escolher serviço/licença/quota/custo, mapear município/UF brasileiros e tratar cidade ausente, fronteira, resultado estrangeiro, timeout, rate limit e privacidade da localização. Não derivar município apenas da latitude/longitude sem fonte geográfica. | **Funcionalidade separada**, preferencialmente após reformulação; decidir contrato antes do prompt se for entrar na primeira versão. Não bloqueia Lovable. |
| C. Data/hora | `createCollectionAttempt` começa vazio; input textual pede RFC 3339. Parser compartilhado frontend/backend exige segundos e offset, recusa calendário inválido e futuro. Banco guarda instante e offset em campos distintos. IHFR usa `datetime-local`, convertido por `new Date(observedAt).toISOString()`. | UI/adaptação temporal + revisão da spec; pequeno a médio. Sugestão inicial do dispositivo, editável, com fuso visível e revisão; evitar UTC indevidamente colocado no campo local, horário futuro por relógio incorreto e conversão silenciosa. Não requer migration se preservar contrato. | **Antes do Lovable**: estabilizar conversão e estados; levar comportamento validado ao prompt. |
| D. Uso da terra | Select de `IHFRDiagnosisManagement` exibe os sete tokens como texto. ADR §7 define valores, tradução de origem e predominância. | Apresentação + conteúdo de domínio; pequeno para rótulos, médio se exigir novas definições científicas. Preservar enums, scores, categoria única e ausências; ajuda via texto associado ou expansão acionável por teclado/toque. | **Junto da reformulação**, com dicionário e limites definidos antes do prompt. Pode antecipar rótulos se testes mostrarem impedimento recorrente. |
| E. Rascunhos ambientais | Formulário/revisão ficam em memória; não foi localizada persistência de rascunho. IMP-005 FR-016/017 e seção G3 definem confirmação integral e conjunto imutável; schema exige `confirmedAt` em `EnvironmentalMeasurementSet`. | Nova feature de UI, modelo, APIs, persistência, permissões, concorrência e promoção; grande. Não tornar opcionais os campos obrigatórios do registro confirmado. Garantir isolamento, retomada e exclusão dos rascunhos da elegibilidade/cálculo IHFR. | **Funcionalidade separada**, sem bloquear mapa, relatórios ou Lovable. Fazer antes do prompt apenas se a equipe a escolher para o primeiro frontend. |

Fontes focais da triagem: A — [layout do workspace](../../../../src/app/(private)/workspace/layout.tsx), [TopBar](../../../../src/components/top-bar/index.tsx), [Sidebar](../../../../src/components/sidebar/index.tsx), [AdminShell](../../../../src/components/admin-shell/admin-shell.tsx) e [contexto de autenticação](../../../../src/contexts/auth.context.tsx); B — [formulário de área](../../../../src/components/areas/area-form.tsx) e [controle de revisão do ponto](../../../../src/components/areas/area-form-state.ts); C — [formulário de coleta](../../../../src/components/collections/collection-form.tsx) e contratos detalhados abaixo; D — [gestão IHFR](../../../../src/components/ihfr-diagnosis/ihfr-diagnosis-management.tsx); E — [spec IMP-005](../../../../specs/005-environmental-collection-data/spec.md), [formulário ambiental](../../../../src/components/environmental-data/environmental-data-form.tsx), [validação dos campos](../../../../src/types/environmental-data.validation.ts) e [serviço ambiental](../../../../src/app/api/server/services/environmental-data.service.ts).

### B. Critérios propostos para preenchimento geográfico

`RECOMENDACAO` — Disparar consulta a partir do ponto confirmado/solicitação explícita, com indicador de tentativa e opção de revisão. Rastrear quais campos foram editados pelo usuário e a revisão do ponto; descartar resposta antiga, preencher apenas campos ainda elegíveis e nunca apagar valor manual por falha ou resultado parcial. Não substituir silenciosamente coordenadas nem impor campo obrigatório por causa do serviço. A escolha de frontend direto versus backend depende da autenticação e das condições do provedor; nenhum serviço foi selecionado nesta rodada.

### C. Apresentação, transporte e persistência temporal

- `EVIDENCIA_IMPLEMENTACAO` — [collection.contracts.ts](../../../../src/app/api/server/collections/collection.contracts.ts) parseia `occurredAt` em RFC 3339, produz `occurredAtUtc`, `occurrenceOffset` e representação canônica. [collections.service.ts](../../../../src/app/api/server/services/collections.service.ts) persiste o instante e reconstrói a apresentação com offset. [schema.prisma](../../../../prisma/schema.prisma), `CollectionData`, usa `occurredAt @db.Timestamptz(3)`, `occurrenceOffset @db.VarChar(6)` e `confirmedAt` separado. A exigência é também contrato/API, não só texto da UI; o banco não armazena a sintaxe visual do formulário.
- `RECOMENDACAO` — Exibir controle amigável de data/hora e fuso explícito; sugerir “agora no dispositivo” uma única vez na criação da tentativa, deixando claro que é sugestão e permitindo edição. Na revisão, distinguir ocorrência de confirmação. Preservar o offset declarado no transporte; `2026-09-15T09:00:00-03:00` representa o mesmo instante que `2026-09-15T12:00:00Z`, mas trocar para `Z` perderia a informação original de offset que a coleta hoje preserva.
- `RECOMENDACAO` — Montar o valor visual com componentes locais; não usar `toISOString().slice(0,16)` como horário local. Serializar componentes + offset coerente com a data selecionada e incluir segundos; definir tratamento explícito de segundos/milissegundos ao adotar precisão de minutos. Não recalcular a ocorrência quando a pessoa apenas avança/volta na revisão. Para horário de outro fuso, permitir declaração explícita em vez de assumir o fuso atual do dispositivo.
- `PENDENCIA_DE_DECISAO` — Registrar na futura spec a política de sugestão inicial, precisão e escolha de fuso. A [IMP-004 FR-015](../../../../specs/004-environmental-collection-registration/spec.md) proíbe conversão, arredondamento ou correção silenciosa. O pedido atual solicita avaliação; ainda não aprova uma nova política de captura. A UI IHFR serve como referência de interação, não como implementação pronta da preservação de offset da coleta.
- Verificar posteriormente: UTC−03 e UTC, offset positivo/fracionário, virada de dia, data editada, calendário inválido, ocorrência futura e relógio divergente; incluir transições ambíguas/inexistentes de fuso quando aplicáveis, erro sem perda de entrada e ida/volta API sem alterar o instante. Comparar valor exibido, payload, instante persistido e offset reconstituído.

### D. Vocabulário e ajuda

`RECOMENDACAO` baseada no [ADR-0001 §7.2–7.4](../../../governance/ADR-0001-contrato-experimental-ihfr-v0-1.md): apresentar `FOREST` como Floresta; `AGROFORESTRY` como Sistema agroflorestal (SAF); `CROPLAND` como Agricultura; `PASTURE` como Pastagem; `DEGRADED_PASTURE` como Pastagem degradada; `BARE_SOIL` como Solo exposto; `URBAN` como Área urbanizada. Payload mantém os sete valores exatos. O enum legado `LandType` com `OTHERS` não é o contrato experimental do suplemento.

A ajuda pode explicar, com base já documentada, “selecione um único uso predominante”, “solo exposto aqui é categoria territorial, diferente do percentual de solo exposto” e “se não puder determinar, mantenha indeterminado; pode haver insuficiência”. As fontes inspecionadas não fecham critérios de campo para todas as distinções, como limiar entre pastagem e pastagem degradada. Não inventar percentuais/limiares ou descrições científicas; registrar a lacuna e pedir conteúdo validado somente para essa parte. Preferir texto visível associado por `aria-describedby` ou botão de ajuda com foco/expansão, sem tooltip dependente apenas de mouse.

### E. Recorte próprio para rascunhos

`RECOMENDACAO` — Uma entidade de rascunho separada é a alternativa inicial mais compatível com a imutabilidade do conjunto confirmado; a escolha final exige spec. Definir propriedade individual versus compartilhada, retomada entre dispositivos, expiração/exclusão, concorrência/revisão, acesso após revogação de vínculo e bloqueio de escrita em laboratório inativo. LocalStorage, se escolhido, seria outra capacidade com limites de dispositivo e sessão, não equivalente à persistência autenticada.

Salvar incompleto usa validação parcial própria. Confirmar exige novamente validação integral de `ihfr-measurement-v1`, reautorização e transação/idempotência. O diagnóstico deve continuar consumindo somente `EnvironmentalMeasurementSet` confirmado e compatível; rascunhos não geram `CURRENT`, indicadores de completude confirmada ou scores. Cobrir retomada, perda de sessão, conflito de edição, rascunho após confirmação concorrente e impossibilidade de calcular a partir dele.

## 4. Fontes e desenho dos relatórios futuros

### Documento 1 — Ambiguidades documentais e decisões adotadas

Destinatário: professor Fábio Mesquita de Souza. `RECOMENDACAO` — Texto principal objetivo por tema, com referências verificáveis em notas/tabelas de apoio; não reproduzir o vocabulário extenso das auditorias em cada parágrafo.

Base já localizada:

| Fonte | Uso na próxima etapa e alcance desta leitura |
|---|---|
| [DOCUMENT_REGISTER](../../../governance/DOCUMENT_REGISTER.md), [SOURCE_AUTHORITY](../../../governance/SOURCE_AUTHORITY.md), [PENDING_DECISIONS](../../../governance/PENDING_DECISIONS.md) e [TRACEABILITY_MATRIX](../../../governance/TRACEABILITY_MATRIX.md) | Inventário/proveniência, autoridade e encaminhamento. Registro e pendências consultados em seções; matriz localizada, sem revisão integral de suas linhas. |
| [Auditoria consolidada de 26/08](../../../reports/audits/2026-08-26-auditoria-documental-consolidada.md) | Índice mestre dos conflitos e agrupamentos; método e catálogo amostrados. Sua aprovação é analítica, não científica. |
| [Ciência fundamental](../../../reports/audits/2026-08-24-auditoria-cientifica-fundamental.md), [matemática/algoritmo](../../../reports/audits/2026-08-25-auditoria-contrato-matematico-calibracao-algoritmo.md), [requisitos/domínio/UX](../../../reports/audits/2026-08-26-auditoria-requisitos-dominio-wireframes.md), [dados/arquitetura](../../../reports/audits/2026-08-26-auditoria-dados-arquitetura-execucao.md) | Localizadas e conferidas quanto à identificação/estado; aprofundar achados selecionados pelos IDs do consolidado. |
| [ADR-0001](../../../governance/ADR-0001-contrato-experimental-ihfr-v0-1.md), [TECH_DECISIONS](../../../../TECH_DECISIONS.md) e [plano da consolidação IMP-006](../../completed/consolidacao-decisoria-imp-006.md) | Decisões posteriores, origens, justificativas e alternativas preservadas; leitura focal do ADR e decisões, plano localizado. |
| [Corpus raw](../../../raw/) e [source-review IMP-005](../../../../specs/005-environmental-collection-data/source-review.md) | Confirmar exemplos pontuais; quatro trechos originais sobre uso da terra já examinados. Não alegar revisão completa nesta rodada. |

O exemplo de “versão mais completa” foi confirmado no **ADR-0001 §7.5**, para `landUseType`: `DOC-RAW-013` reúne sete categorias e scores, direção do risco, composição e essencialidade. A tabela de seis classes de `DOC-RAW-006` difere em scores; a matriz `DOC-RAW-007` coincide em seis, mas não inclui `urban`; o protocolo `DOC-RAW-011` é qualitativo/regional. Foram conferidos [contrato matemático L196–207](../../../raw/specificacao-do-ihfr-v0-1-mvp-contrato-matematico.md), [especificação técnica §4.11 L161–169](../../../raw/especificacao-tecnica-sistema-plataforma-hidroflorestas-mvp.md), [matriz §4 L61–69](../../../raw/matriz-de-variaveis-do-ihfr.md) e [protocolo §8 L182–208](../../../raw/protocolo-de-campo-do-ihfr.md). A seleção está registrada como decisão experimental da equipe em 19/09 (`TD-016`), não como validação definitiva nem atribuição pessoal ao professor.

A seleção mais ampla de fonte matemática está no ADR §3–5, ligada à decisão de 18/09 (`TD-015`). Outros temas candidatos: pesos gerais/regionais, clamp/rejeição, qualidade 4/5 versus 5/5, fronteiras de classes, APP binária/ternária, suficiência, separação medição/cálculo e papéis/permissões. Os exemplos além de uso da terra ainda devem ser reconferidos nas fontes originais; a matriz do ADR orienta essa consulta. Não existe evidência aqui de regra universal “escolher sempre o documento mais completo”.

Estrutura planejada: contexto; método/fontes; questões por tema; decisões que permitiram continuidade; alternativas preservadas; pendências para discussão; referências. Para cada questão, registrar fonte/seção/linhas, ambiguidade, consequência prática, alternativas, decisão/origem/justificativa e estado **resolvido**, **provisório** ou **pendente**, indicando o recorte. Uma decisão pode estar resolvida para engenharia e provisória para ciência.

Preservar `CONTRATO_EXPERIMENTAL`, `VALIDACAO_CIENTIFICA_PENDENTE`, `SUJEITO_A_RECALIBRACAO` e `NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO`. A origem científica informada no ADR não prova autoria material de cada documento raw. Não atribuir decisão a pessoa sem registro.

### Documento 2 — Relatório acadêmico do desenvolvimento

`RECOMENDACAO` — Definir novo corte no início da elaboração; usar esta referência de 01/10 como baseline preliminar. A estrutura será: contexto/objetivos; método; organização documental; planejamento; evolução das entregas; decisões técnicas; validações; dificuldades; resultados; limitações/pendências; contribuições e referências.

Fontes localizadas: [planos históricos](../../completed/), [Spec Kit](../../../../specs/) (`spec.md`, `plan.md`, `tasks.md`, contratos e evidências), [PRD Code-First](../../../code-first-prd/README.md), decisões/ADR, commits, PRs e [validação 007](../../../validation/007-ihfr-evolution/README.md). A [revisão de 28/09](../../../validation/007-ihfr-evolution/2026-09-28-revisao-commits-e-merge.md) foi lida; demais relatórios da série localizados, sem reexecução. A [auditoria de implementação de agosto](../../../reports/audits/2026-08-28-auditoria-implementacao-infraestrutura.md) é um snapshot em revisão, não diagnóstico atual automático.

A consulta remota listou PRs existentes no intervalo #1–#30, com seus títulos, estados e integração; usar os números efetivamente retornados, sem presumir continuidade numérica. Foram examinadas descrições #29/#30, ausência de descrição #27, comentários do bot em #27/#30 e lista de reviews #30 vazia. Os demais corpos/comentários/reviews e atribuições individuais exigem coleta na etapa do relatório. Não há bloqueio de acesso aos PRs nesta rodada; há limite de profundidade da amostragem.

| Evolução a reconstruir | Referências iniciais |
|---|---|
| Modelo, scripts, landing, infraestrutura inicial | Histórico Git e PRs #1–#12; só metadados preliminares nesta rodada. |
| Interfaces de acesso e áreas | PRs #13–#16; páginas atuais e diffs históricos a confrontar. |
| Governança/PRD, Spec Kit e guia | PRs #17–#19; planos e registros das auditorias. |
| Acesso, laboratório, áreas, coletas e medições | PRs #20, #21, #23, #24, #25; specs 001–005. PR #22: ajuste de ESLint. |
| Dashboard, mapa e administração | PRs #26–#28; specs 007–009 e evidências por entrega. |
| IHFR experimental e sua evolução | PR #29, specs 006, ADR e relatórios `007-ihfr-evolution`. O nome 007 da branch de evolução não substitui a spec 007 de dashboard. |
| Cadastro público ativo e promoção | Commit `208d639`, spec 010, TD-017; PR #30, merge `cf6a7bd`. |

Para cada resultado, separar **planejado** (spec/plano), **implementado** (arquivo/diff no SHA), **integrado** (ancestralidade e PR/base/data) e **validado** (comando, resultado, ambiente, data e fonte). Testes antigos devem ser descritos como executados em sua rodada, ou relatados/revisados quando essa é a evidência disponível. O PR #30 explicita validações parciais e suites de banco/E2E não reexecutadas; seu merge não as transforma em PASS. Comentário `Ready` da Vercel tampouco prova funcionamento do mapa.

Atribuição: confrontar autor e committer, coautoria, autoria de PR, revisões e relatos, sem emails no texto. Não atribuir todos os commits, ciência ou trabalho coletivo ao solicitante. Títulos genéricos, descrições ausentes e texto desatualizado exigem diffs selecionados. Lacunas de autoria/validação sem fonte permanecem explícitas; não são preenchidas por inferência. Esta rodada não redigiu o relatório nem apurou contribuições individuais por inteiro.

## 5. Lovable: viabilidade, referências reais e limites

`RECOMENDACAO` — A abordagem é viável como produção de proposta de frontend seguida de avaliação e adaptação por recortes no HidroFlorestas. Não há evidência de incorporação automática compatível com o monólito atual. O esforço de integração só pode ser estimado após conhecer o código gerado; comparar componentes, roteamento, dependências, boundaries cliente/servidor e contratos antes de aceitar mudanças.

`FATO_DOCUMENTADO` externo — Na consulta de 01/10, a [documentação oficial do Lovable/GitHub](https://docs.lovable.dev/integrations/github#limitations) informa que a integração cria um repositório para exportação/sincronização e não importa um repositório GitHub existente. Portanto, `RECOMENDACAO`: planejar proposta separada e adaptação pelo Codex; reconferir capacidades quando for executar. Nenhum projeto, conector, sincronização ou envio ao Lovable foi criado aqui. Fontes externas consultadas esclarecem ferramentas, sem autoridade sobre produto ou ciência do projeto.

### Paleta e linguagem visual extraídas do código

`EVIDENCIA_IMPLEMENTACAO` — Fontes principais: [login](../../../../src/app/login/page.tsx), [cadastro](../../../../src/app/register/page.tsx), [globals.css](../../../../src/app/globals.css) e [layout raiz](../../../../src/app/layout.tsx).

| Papel observado | Valor/token realmente presente |
|---|---|
| Fundo e superfícies | `#F9FAFB`, branco, campos `#EFEFEF`; painel do cadastro `#F3FAFF` → `#F4F4F4` com imagem e camada branca. |
| Texto e apoio | `#3E3E3E`, `#858585`, bordas preto com opacidade. |
| Títulos/rótulos e links de apoio | Login `amber-700`; cadastro `#A1640B`. São valores distintos, não um token único já consolidado. |
| Ação principal/identidade verde | Login `green-600`; cadastro `#00B51A`. Preservar a distinção no levantamento; harmonização posterior deve ser explícita. |
| Identidade azul | `#0084DD` no cadastro e hover de links do login. |
| Tipografia e composição | Poppins; cartões brancos com cantos de 20px, controles de 10px, sombra, ícones Lucide, logo existente; cadastro divide imagem/formulário no desktop. |

`RECOMENDACAO` — Respeitar o pedido de evitar neon: usar neutros como base e cores existentes em acentos controlados, sem ampliar saturação, brilho ou inventar novos hexadecimais. A eventual redução/substituição de uma cor intensa depende da revisão visual posterior. Não tratar utilitários Tailwind como equivalentes exatos aos hexadecimais do cadastro. Nenhuma paleta nova foi escolhida. Os tokens atuais não comprovam contraste acessível; isso deve ser medido na etapa de UI.

### Leitura visual das cinco imagens

Todas foram abertas nesta execução; nomes sozinhos não fundamentam as descrições. Classificação: referência complementar conforme [README](../../../figma-references/README.md), sem aprovação normativa. Conteúdo pessoal exemplificativo não deve ser reproduzido na proposta; usar dados sintéticos.

| Imagem | Composição observada | Orientação textual proposta e restrição |
|---|---|---|
| [Entrar ou criar laboratório](../../../figma-references/entrar-ou-criar-laboratorio.jpg) | Cabeçalho branco com marca/perfil, área central espaçosa, saudação, mensagem de ausência de vínculo e duas ações largas lado a lado. | Hierarquia clara para contexto vazio e criação/seleção; não habilitar ingresso enquanto o fluxo continuar indisponível. As faixas de amostras laterais não são navegação a implementar. |
| [Início após acessar laboratório](../../../figma-references/inicio-apos-acessar-laboratorio.jpg) | Barra lateral estreita, saída inferior, título e ação à direita, mapa grande, legenda colorida, três cards e histórico em painel branco. | Reaproveitar organização e hierarquia; derivar métricas reais. A legenda de risco não pertence ao mapa territorial mínimo atual e não deve ser importada. |
| [Áreas monitoradas](../../../figma-references/areas-monitoradas.jpg) | Título com retorno, ação de criar, cards com fotografia, datas/status, localização e botão de detalhes. | Usar cards responsivos e metadados que o contrato realmente fornece; fotografias, status de monitoramento e Google Maps não se tornam requisitos por aparecerem na imagem. |
| [Detalhe e dados da água](../../../figma-references/area-monitorada-com-formulario-de-dados-da-agua.jpg) | Conteúdo em duas colunas: mapa/indicadores/grupos ambientais à esquerda; painel HIDRO-AI com exportação à direita; seções ambientais coloridas e expansíveis. | Usar agrupamento legível e detalhe progressivo; preservar contrato de campos/unidades atual. IA generativa e PDF são propostas visuais, sem autorização para introduzir capacidades; separar área, coleta e resultado IHFR experimental. |
| [Cadastro de nova área](../../../figma-references/cadastro-de-nova-area.jpg) | Modal sobre a lista, título, área de upload, nome, latitude/longitude lado a lado e ação final. | Aproveitar foco do formulário; escolher página/modal por usabilidade móvel posterior. Upload não consta no cadastro de área inspecionado; preservar seleção de ponto, campos atuais e alternativas sem mapa. |

`RECOMENDACAO` — A reformulação pode trabalhar responsividade, consistência de cabeçalhos, tipografia, densidade, agrupamento de campos, estados e ajuda. Precisa preservar Next.js/App Router, guards e sessão, endpoints/DTOs, contextos e permissões, sem trocar banco/autenticação por backend gerado. Manter reautorização, erros 401/404/409/422 conforme cada contrato, idempotência, imutabilidade e avisos experimentais. Não enviar segredos, ambientes, registros reais ou o corpus inteiro como contexto indiscriminado.

Antes do prompt definitivo: inventário completo de telas/campos/estados, contratos e permissões revisados; resultado do mapa; decisão dos itens A–E; dicionário em português; tokens extraídos e descrição visual acima; critérios de aceite e limites do protótipo. Avaliação posterior: diff de dependências/rotas, contraste/foco/teclado/leitor de tela, móvel, fluxos autorizados, erros/retry e integração com API real em teste. Nenhum prompt definitivo foi produzido.

## 6. Evidências e verificações desta rodada

Leituras estáticas com `git ls-files`, `find`, `grep`, `sed`, Python para contagem de checkboxes; Git para status, SHA, histórico, diff focal `eee3bd8` e comparação de árvores; API GitHub somente leitura para lista/PRs/comentários/reviews; visualização local dos cinco JPG; documentação oficial de Next.js/Lovable. `rg` não estava instalado, então foram usadas ferramentas já disponíveis, sem instalar dependências.

Verificação de entrega: conferir links locais e caminhos citados nos dois novos documentos, whitespace/diff, escopo de arquivos, branch/HEAD preservados e ausência de mudanças em `docs/raw/`/código/configurações. Resultados finais ficam no PLAN. Testes de aplicação, lint/typecheck/build, E2E, migrations, banco, tiles reais e deploy **não executados**, por escopo documental e para não acionar preparação/limpeza de dados. Testes históricos acima são apenas fontes lidas.
