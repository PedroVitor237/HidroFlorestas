# Feature Specification: Mapa e visualização territorial

**Feature Branch**: `008-territorial-map`

**Created**: 2026-09-18

**Status**: Ready for Independent Re-analysis

**Delivery State**: `tasks.md` contém T001–T055. A branch incorporou `origin/development@10fdb8bbb8e4895614575fedc9de8e08a5121afe` pelo merge `46b22d183bc720c840cba8fbeb9a71b9e008bb66`; a IMP-005 e a IMP-007 estão integradas. Nenhuma implementação específica da IMP-008 foi iniciada e uma nova análise independente deve validar esta reconciliação antes do código.

**Input**: IMP-008 — permitir que o usuário represente áreas e relacione visualmente coletas, dados e resultados aplicáveis aos respectivos registros de origem, preservando o laboratório selecionado, a autorização contextual e os limites dos contratos efetivamente integrados.

## Objective and Product Outcome

Permitir que qualquer participante atualmente autorizado consulte, no laboratório explicitamente selecionado, uma visão territorial das áreas-ponto já cadastradas e reconheça quais coletas confirmadas pertencem a cada área. A visão deve manter navegação rastreável aos detalhes autorizados, continuar útil quando a base cartográfica estiver indisponível e não ampliar a exposição de coordenadas ou dados pessoais além dos contratos integrados.

O incremento mínimo usa somente a cadeia integrada `laboratório → área-ponto → coleta confirmada`. Dados ambientais, diagnósticos IHFR, gráficos e outras camadas permanecem condicionados à implementação, integração e reconciliação de seus contratos de origem. O mapa não cria fonte paralela de verdade, não atribui coordenada própria à coleta e não transforma estruturas legadas ou planejadas em informação científica disponível.

## Authority, Baseline and Scope Levels

### Nível 1 — comportamento sustentado pelas IMP-003/004/005/007 integradas

- `EVIDENCIA_IMPLEMENTACAO` — `origin/development` em `10fdb8bbb8e4895614575fedc9de8e08a5121afe` contém as IMP-003/004, a IMP-005 integrada pelo merge `5d9ca6f8f848867e8152bc25e86abc9a6e73358f` e a IMP-007 integrada pelo merge `10fdb8bbb8e4895614575fedc9de8e08a5121afe`.
- `EVIDENCIA_IMPLEMENTACAO` — a área atual não usa o antigo modelo `Coordinates`: cada `CollectionArea` possui latitude e longitude obrigatórias, persistidas com seis casas decimais, e pertence a um laboratório. O cadastro e o detalhe já representam exclusivamente um ponto confirmado.
- `EVIDENCIA_IMPLEMENTACAO` — qualquer membro com vínculo atual pode ler áreas do laboratório selecionado; laboratório inativo permanece consultável em modo somente leitura; vínculo revogado, contexto cruzado e recurso inacessível não podem ser distinguidos de recurso inexistente.
- `EVIDENCIA_IMPLEMENTACAO` — cada coleta confirmada pertence imutavelmente a uma área do mesmo laboratório. A coleta não possui coordenada própria; sua relação territorial é herdada da área.
- `EVIDENCIA_IMPLEMENTACAO` — o cadastro e o detalhe de uma área já usam um mapa de ponto baseado em Leaflet, com base cartográfica configurável, estado de carregamento e fallback quando a configuração do mapa não está disponível. Essa evidência não seleciona por si só provedor, biblioteca ou arquitetura definitiva para a visão agregada.
- `EVIDENCIA_IMPLEMENTACAO` — a IMP-005 fornece `EnvironmentalMeasurementSet` e contratos HTTP reais, mas a exclusão de valores e camadas ambientais do mapa mínimo é uma decisão explícita de escopo e minimização, não ausência de implementação.
- `EVIDENCIA_IMPLEMENTACAO` — a IMP-007 fornece a landing contextual do laboratório, resumo, histórico, navegação, estados de loading/erro/retry e projeções transitórias. A IMP-008 integra seu destino nessa navegação, mas consulta diretamente as fontes canônicas e não duplica o resumo, o histórico ou suas contagens.
- `DECISAO_CONFIRMADA_PARA_A_ESPECIFICACAO` — o mínimo implementável da IMP-008 é uma projeção somente leitura das áreas e coletas confirmadas autorizadas do laboratório selecionado. Cada área válida aparece uma única vez no próprio ponto; suas coletas são relacionadas ao mesmo ponto por identificação e contagem, com acesso individual aos detalhes autorizados.

### Nível 2 — relação condicionada à IMP-006 e extensões futuras

- `DECISAO_CONFIRMADA_PARA_A_ESPECIFICACAO` — embora a IMP-005 esteja implementada e integrada, nenhum grupo, valor, indicador ou camada ambiental integra o mapa mínimo. Uma extensão futura exige decisão própria de produto/UX/privacidade, projeção territorial minimizada e rastreabilidade ao registro autorizado.
- `FATO_DOCUMENTADO` — a IMP-006 publicada em `ab5e30b2cf1e78c5ab20c9467d003cba1041d8ec` possui somente especificação e checklist próprios; não está integrada e mantém implementação bloqueada por ciência e ciclo operacional. Nenhum score, classe, risco, diagnóstico, cor temática ou gráfico IHFR integra o mapa mínimo.
- `FATO_DOCUMENTADO` — uma extensão futura somente poderá entrar no mapa após implementação e integração do contrato pertinente, reconciliação explícita e comprovação de que cada elemento conduz ao registro de origem autorizado.

### Nível 3 — decisões ainda abertas

- `PENDENCIA_DE_DECISAO` — geometrias diferentes do ponto atual, localização própria da coleta, agrupamento, sobreposição, filtros, camadas temáticas, simbologia científica, comparação temporal, busca geográfica, desenho/edição no mapa e compartilhamento externo exigem definição de produto, UX, dados, privacidade ou ciência conforme o assunto.
- `PENDENCIA_DE_DECISAO` — qualquer redução, generalização ou ocultação adicional da precisão das coordenadas exige política de privacidade e caso de uso aprovados. No mínimo atual, a visão autenticada usa somente o ponto já acessível aos mesmos membros e não fabrica precisão além das seis casas persistidas.
- `PENDENCIA_DE_DECISAO` — `TD-008`, `TD-011` e `TD-014` permanecem respectivamente em avaliação/proposta para base cartográfica, biblioteca e arquitetura definitiva. A implementação existente de Leaflet em cadastro/detalhe e sua escolha local para o mapa mínimo não aprovam automaticamente outro motor cartográfico ou toda visualização territorial.
- `DECISAO_CONFIRMADA_PARA_A_ESPECIFICACAO` — por solicitação explícita da equipe nesta atualização de 2026-09-18, Plotly é a direção futura para gráficos e visualizações analíticas relacionados aos registros exibidos no contexto territorial. Essa implementação ocorrerá sempre depois da IMP-009, em entrega própria ainda sem identificador atribuído, e poderá ser executada em paralelo com a IMP-010; esse paralelismo não cria dependência da IMP-010 nem aprovação antecipada da entrega futura.
- `PENDENCIA_DE_DECISAO` — a forma de integração do Plotly, inclusive uso no frontend ou de Plotly Python, será definida no planejamento dessa entrega futura. A decisão não introduz automaticamente Python, PostGIS, um segundo motor cartográfico, dependência, gráfico ou tarefa implementável na IMP-008; a eventual adoção dessas tecnologias ou arquiteturas continua dependente de necessidade demonstrada e decisão aplicável.
- `DECISAO_CONFIRMADA_PARA_A_ESPECIFICACAO` — dados ambientais somente poderão alimentar gráficos após decisão e reconciliação territorial próprias sobre o contrato integrado; diagnósticos IHFR exigem também implementação, integração e aprovação científica aplicável. A integração técnica das IMP-005/007 não inclui seus dados no mapa por inferência.

### Relação com a IMP-007 integrada

`EVIDENCIA_IMPLEMENTACAO` — a IMP-007 integrada em `10fdb8bbb8e4895614575fedc9de8e08a5121afe` implementa a página contextual do laboratório e resumo/histórico como projeções transitórias dos registros de origem. A IMP-008 reutiliza o guard, o critério runtime de coleta confirmada, os padrões de estado e a navegação contextual, mas não replica histórico, não consome o dashboard como fonte e não cria contagens persistidas.

## Actors

- **Participante autorizado**: pessoa autenticada, com conta elegível e vínculo atual `OWNER`, `ADMIN` ou `MEMBER` no laboratório explicitamente selecionado.
- **Membro em laboratório inativo**: participante autorizado a consultar a projeção territorial existente em modo somente leitura.
- **Pessoa sem acesso atual**: conta inelegível, vínculo revogado ou pessoa tentando acessar laboratório ou recurso de outro contexto; não recebe a projeção nem indício sobre sua existência.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visualizar áreas do laboratório selecionado (Priority: P1)

Como participante autorizado, quero ver em conjunto as áreas-ponto do laboratório que selecionei, para reconhecer sua distribuição territorial e abrir o registro correto sem misturar contextos.

**Why this priority**: Esta é a menor entrega territorial útil sustentada pela área persistida e fecha a substituição do placeholder sem depender de ciência ou módulos futuros.

**Independent Test**: Preparar dois laboratórios e áreas com pontos conhecidos, abrir a visão em cada contexto e comparar marcadores, lista textual, enquadramento e destinos com os registros autorizados de origem.

**Acceptance Scenarios**:

1. **Given** participante elegível, vínculo atual e laboratório explicitamente selecionado com áreas válidas, **When** abre a visão territorial, **Then** vê a identidade e o estado do laboratório e exatamente um ponto por área autorizada, sem áreas de outro laboratório.
2. **Given** uma área representada no mapa, **When** a pessoa seleciona seu ponto ou item textual correspondente, **Then** identifica nome e coordenadas na precisão permitida e pode abrir o detalhe contextual autorizado da mesma área.
3. **Given** áreas distribuídas em mais de uma localização, **When** a visão termina de carregar, **Then** todas as áreas válidas ficam alcançáveis sem exigir conhecimento prévio de suas coordenadas.
4. **Given** laboratório sem áreas, **When** a visão termina de carregar, **Then** apresenta estado vazio verdadeiro e orientação compatível com papel e estado do laboratório, sem ponto, card ou número fictício.

---

### User Story 2 - Relacionar coletas confirmadas às áreas (Priority: P2)

Como participante autorizado, quero reconhecer quais coletas confirmadas pertencem a cada área mostrada, para percorrer a relação territorial até o registro que originou a informação.

**Why this priority**: A IMP-004 já estabilizou a associação imutável entre coleta e área; expô-la sem inventar coordenadas entrega rastreabilidade territorial real.

**Independent Test**: Preparar áreas com zero, uma e múltiplas coletas confirmadas, selecionar cada área e verificar contagem, identificação temporal mínima e destinos individuais contra os detalhes integrados da IMP-004.

**Acceptance Scenarios**:

1. **Given** uma área com coletas confirmadas, **When** seu ponto ou item textual é selecionado, **Then** a visão informa a quantidade real e relaciona cada coleta ao mesmo ponto da área, sem criar localização própria para a coleta.
2. **Given** uma coleta relacionada, **When** a pessoa ativa seu destino, **Then** chega ao detalhe autorizado dentro da cadeia `laboratório → área → coleta` correspondente.
3. **Given** uma área sem coleta confirmada, **When** é selecionada, **Then** a visão comunica ausência de coletas sem fabricar ocorrência, medição, gráfico, risco ou diagnóstico.
4. **Given** registros incompletos que não satisfazem o contrato de coleta confirmada da IMP-004, **When** a projeção é formada, **Then** eles não são apresentados como coletas confirmadas nem alteram sua contagem.

---

### User Story 3 - Consultar a visão sob falhas e estados de acesso (Priority: P2)

Como participante autorizado, quero distinguir carregamento, ausência, erro de dados, coordenada inválida e falha da base cartográfica, para continuar usando os registros disponíveis sem interpretar uma falha como ausência territorial.

**Why this priority**: A utilidade e a segurança da visão dependem de não confundir falhas externas, dados indisponíveis e ausência real.

**Independent Test**: Exercitar separadamente carregamento, resposta vazia, erro de projeção, área sem ponto utilizável e indisponibilidade de tiles, verificando que a lista e os destinos autorizados permanecem coerentes.

**Acceptance Scenarios**:

1. **Given** leitura ainda em andamento, **When** a visão é aberta, **Then** apresenta carregamento perceptível e não mostra vazio, zero ou dados anteriores como resultado final.
2. **Given** falha ao obter os registros territoriais, **When** a leitura termina, **Then** apresenta erro sanitizado e nova tentativa, sem manter dados de outro laboratório ou mostrar sucesso parcial como completo.
3. **Given** área autorizada sem coordenada finita dentro dos limites válidos, **When** a projeção é exibida, **Then** a área não gera ponto inválido, aparece em uma seção textual de localização indisponível e conserva navegação autorizada ao detalhe.
4. **Given** dados territoriais carregados e tiles indisponíveis, **When** a base cartográfica falha, **Then** a visão diferencia essa falha da leitura dos dados e mantém lista textual, coordenadas permitidas, relações de coletas e destinos utilizáveis.

---

### User Story 4 - Navegar de forma acessível e responsiva (Priority: P3)

Como participante que usa teclado, tecnologia assistiva ou uma tela pequena, quero acessar as mesmas áreas, relações e destinos sem depender de gestos, cor ou precisão visual no mapa.

**Why this priority**: O mapa não pode ser a única forma de compreender ou navegar pelos registros territoriais.

**Independent Test**: Percorrer a visão somente por teclado e com tecnologia assistiva nas larguras de 320 px, 768 px e 1280 px, conferindo foco, nomes, estados, correspondência mapa–lista e atribuição da base.

**Acceptance Scenarios**:

1. **Given** áreas e coletas disponíveis, **When** a pessoa percorre somente com teclado, **Then** alcança cada item textual, cada ação de detalhe e toda interação essencial do mapa com foco visível e ordem compreensível.
2. **Given** uma informação representada por marcador, contagem ou estado visual, **When** é lida por tecnologia assistiva, **Then** existe equivalente textual e nome acessível que não depende apenas de cor, posição ou ícone.
3. **Given** largura de tela a partir de 320 px, **When** a visão é usada, **Then** conteúdo essencial, estados e destinos permanecem disponíveis sem rolagem horizontal do conteúdo principal.
4. **Given** uma base cartográfica exibida, **When** a pessoa consulta a visão em qualquer largura, **Then** a atribuição obrigatória permanece visível, legível e acessível.

### Edge Cases

- A troca de laboratório durante o carregamento invalida resultados tardios do contexto anterior; nenhuma área ou coleta anterior pode aparecer no novo contexto.
- A perda de elegibilidade ou vínculo após a abertura retira os dados na próxima leitura ou navegação; conteúdo previamente carregado não funciona como autorização.
- Identificadores válidos de área ou coleta pertencentes a outro laboratório produzem o mesmo comportamento externo de recurso inexistente.
- Laboratório inativo conserva a mesma leitura autorizada, sinaliza modo somente leitura e não apresenta ações de criação ou alteração.
- Latitude exatamente `-90` ou `90` e longitude exatamente `-180` ou `180` são válidas; valor ausente, não finito ou fora desses limites não é plotado.
- Duas ou mais áreas com coordenadas iguais continuam registros distintos e permanecem alcançáveis pela alternativa textual; agrupamento ou deslocamento visual não é presumido.
- Muitas coletas ligadas a uma área não criam marcadores sobrepostos: a relação continua ancorada ao único ponto da área e cada detalhe permanece identificável.
- Falha de um tile isolado ou da base completa não converte dados já autorizados em erro de domínio nem remove a atribuição quando conteúdo do provedor continua sendo exibido.
- Uma área ou coleta deixa de ser elegível na origem: a projeção seguinte reflete a fonte atual e não conserva cópia territorial órfã.
- Dados ambientais ou diagnósticos presentes apenas no schema legado, em documentos ou em branches não integradas não aparecem como camada, indicador ou resultado.

## Requirements *(mandatory)*

### Functional Requirements

#### Contexto, autorização e origem

- **FR-001**: Toda leitura territorial MUST exigir participante autenticado e elegível, vínculo atual e laboratório explicitamente selecionado; papel global, autoria histórica ou identificador isolado MUST NOT conceder acesso.
- **FR-002**: O servidor MUST revalidar conta, vínculo, papel, estado do laboratório e associação dos recursos a cada leitura e navegação protegida, antes de formar ou entregar a projeção territorial.
- **FR-003**: A projeção MUST conter somente áreas pertencentes ao laboratório autorizado e coletas confirmadas simultaneamente subordinadas ao mesmo laboratório e à respectiva área.
- **FR-004**: Laboratório, área, coleta ou vínculo inexistente, revogado, inelegível ou pertencente a outro contexto MUST ter comportamento que não revele existência, contagem, coordenada ou outro dado inacessível.
- **FR-005**: Laboratório inativo MUST permitir a leitura territorial aos membros com vínculo atual, identificar claramente o modo somente leitura e MUST NOT oferecer mutação de domínio.
- **FR-006**: A visão MUST ser uma projeção transitória das fontes integradas e MUST NOT criar cadastro territorial, evento, contagem, histórico ou cópia persistente independente.

#### Áreas e representação espacial mínima

- **FR-007**: Cada área autorizada com latitude e longitude finitas dentro dos limites válidos MUST aparecer uma única vez em seu ponto persistido e MUST manter referência inequívoca ao próprio registro.
- **FR-008**: A visão MUST utilizar exclusivamente o ponto atual da área e MUST NOT inferir polígono, limite, raio, endereço, localização própria da coleta ou outra geometria.
- **FR-009**: A seleção de uma área MUST apresentar no mínimo seu nome, coordenadas na precisão permitida, quantidade de coletas confirmadas relacionadas e ação para o detalhe autorizado da área.
- **FR-010**: Coordenadas textuais MUST apresentar no máximo as seis casas decimais persistidas, sem acrescentar precisão fabricada; o navegador MUST receber a precisão necessária somente para posicionar os pontos já autorizados.
- **FR-011**: Área autorizada sem coordenada utilizável MUST permanecer identificável em alternativa textual com estado “localização indisponível” e destino autorizado, mas MUST NOT produzir marcador, posição padrão ou coordenada inventada.
- **FR-012**: A visão inicial MUST enquadrar ou tornar alcançáveis todas as áreas válidas do laboratório sem exigir que a pessoa informe coordenadas, aplique filtro ou conheça previamente a localização.
- **FR-013**: Áreas com o mesmo ponto MUST permanecer distinguíveis e navegáveis; a especificação não exige agrupamento, deslocamento ou agregação cartográfica.

#### Relação com coletas confirmadas

- **FR-014**: A projeção MUST considerar confirmada somente a coleta que satisfaz o contrato integrado da IMP-004 e MUST derivar a relação pelo identificador imutável da área e do laboratório.
- **FR-015**: Cada coleta exibida MUST compartilhar a referência espacial da sua área e MUST NOT receber marcador ou coordenada própria por inferência.
- **FR-016**: Para a área selecionada, a visão MUST distinguir zero, uma e múltiplas coletas confirmadas e MUST fornecer identificação temporal mínima e destino contextual individual para cada coleta apresentada.
- **FR-017**: O destino de uma coleta MUST preservar os identificadores autorizados de laboratório, área e coleta e aplicar novamente a autorização server-side; a projeção carregada MUST NOT substituir essa verificação.
- **FR-018**: A contagem de coletas MUST ser derivada dos registros confirmados então elegíveis e MUST NOT incluir rascunho, registro parcial, estrutura legada não confirmada ou número fixo.

#### Estados, privacidade e minimização

- **FR-019**: A visão MUST distinguir carregamento, vazio, erro de dados, localização indisponível, tiles indisponíveis e sucesso; nenhum desses estados MUST ser representado como outro.
- **FR-020**: Falha de dados MUST apresentar mensagem sanitizada e ação de nova tentativa sem usar mock, zero, dados antigos de outro contexto ou conteúdo não autorizado como fallback.
- **FR-021**: Indisponibilidade da base cartográfica MUST preservar a alternativa textual, as coordenadas permitidas, as relações de coletas e seus destinos e MUST ser comunicada separadamente do estado dos registros.
- **FR-022**: A projeção entregue ao navegador MUST limitar-se ao contexto mínimo do laboratório, identidade/nome/ponto das áreas e identidade/instantes necessários das coletas confirmadas para contagem, distinção e navegação. MUST NOT incluir autoria interna, e-mail, avatar, código de acesso, observações livres, descrição detalhada, chave de confirmação, credencial, medição ambiental, diagnóstico ou evidência restrita.
- **FR-023**: A visão autenticada MUST NOT publicar, exportar ou compartilhar coordenadas fora do conjunto de pessoas que já pode consultar a área; qualquer redução adicional de precisão ou acesso externo permanece decisão futura de privacidade.
- **FR-024**: Resultados tardios de outro laboratório ou de vínculo já inválido MUST ser descartados e MUST NOT ser mesclados à visão atual.

#### Interação, acessibilidade e responsividade

- **FR-025**: O mapa e uma lista textual equivalente MUST representar o mesmo conjunto de áreas; a lista MUST permanecer utilizável independentemente de tiles, ponteiro preciso ou percepção visual do mapa.
- **FR-026**: Selecionar uma área no mapa ou na lista MUST conduzir à mesma identificação e às mesmas ações permitidas, sem alterar registros.
- **FR-027**: Marcadores, itens, destinos e nova tentativa MUST ser operáveis por teclado, possuir nome acessível, ordem previsível e foco perceptível; interação essencial MUST NOT depender apenas de hover, gesto, cor, posição ou ícone.
- **FR-028**: Estados, seleção e relação área–coletas MUST possuir equivalente textual anunciado de forma compreensível por tecnologia assistiva.
- **FR-029**: A visão MUST preservar conteúdo essencial e operações em larguras de 320 px ou superiores, sem rolagem horizontal do conteúdo principal nem sobreposição que impeça navegação.
- **FR-030**: Sempre que tiles ou outra base de terceiros forem exibidos, a atribuição exigida pela fonte MUST permanecer visível, legível, acessível e não removível pela interação normal.

#### Limites e evolução condicionada

- **FR-031**: O incremento mínimo MUST NOT oferecer filtros, alternância de camadas, busca geográfica, desenho, edição, medição, comparação temporal, agrupamento, heatmap ou simbologia científica sem uma decisão futura vinculada a fonte e caso de uso aprovados.
- **FR-032**: Dados ambientais da IMP-005 somente MAY aparecer após implementação, integração e reconciliação do contrato real, com definição aprovada da projeção, unidade, precisão, privacidade, legenda e retorno ao registro de origem.
- **FR-033**: Diagnósticos ou resultados IHFR da IMP-006 somente MAY aparecer após implementação, integração e satisfação dos gates científicos, de proveniência e de ciclo; ausência, schema legado ou documento planejado MUST NOT ser apresentado como score, classe, risco, cor, gráfico ou diagnóstico.
- **FR-034**: A IMP-007 MUST NOT ser dependência automática da visão territorial. Se integrada, mapa e dashboard MAY reutilizar projeções compatíveis das mesmas fontes, mas nenhum deles MUST copiar, persistir ou contradizer a fonte do outro.
- **FR-035**: A especificação MUST permanecer neutra quanto a provedor e arquitetura cartográfica definitiva; Leaflet/React-Leaflet é a escolha local do mapa mínimo, enquanto OpenStreetMap, Plotly, PostGIS e Python MUST NOT ser promovidos a requisito funcional ou capacidade disponível por esta feature. A direção futura de Plotly para gráficos analíticos MUST NOT alterar o escopo implementável da IMP-008.

### Key Entities

- **Contexto territorial do laboratório**: laboratório explicitamente selecionado, seu estado e o vínculo/papel atuais que delimitam toda a projeção.
- **Área territorial**: projeção mínima do registro `CollectionArea`, com identidade opaca, nome e ponto válido; não cria geometria nova nem substitui o detalhe de origem.
- **Coleta confirmada relacionada**: projeção mínima do registro confirmado da IMP-004, subordinada à área e ao laboratório; herda o ponto da área somente para correlação visual.
- **Item com localização indisponível**: área autorizada cuja coordenada não pode ser plotada; permanece na alternativa textual sem posição fabricada.
- **Base cartográfica**: contexto visual externo sobre o qual pontos podem ser apresentados; sua falha é independente dos registros territoriais e seu uso exige atribuição.
- **Fonte futura condicionada**: dados ambientais ou diagnóstico que somente se torna elegível após integração e reconciliação do respectivo contrato.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em uma matriz com pelo menos dois laboratórios, cinco áreas e seis coletas confirmadas distribuídas entre eles, 100% dos pontos, contagens e destinos correspondem ao laboratório selecionado e zero registro cruza contextos.
- **SC-002**: Para 100% das áreas com coordenadas válidas, o ponto apresentado corresponde às coordenadas persistidas até a precisão permitida e conduz ao detalhe correto; zero coleta recebe coordenada própria inventada.
- **SC-003**: Para 100% das coletas confirmadas exibidas, o participante alcança o detalhe correto em uma única ativação a partir da relação da área; registros não confirmados contribuem com zero itens e zero contagem.
- **SC-004**: Em 100% dos cenários de carregamento, vazio, erro de dados, localização indisponível, tiles indisponíveis, laboratório inativo e perda de acesso, o estado correto é distinguível e nenhum mock, dado cruzado ou sucesso falso é mostrado.
- **SC-005**: Na matriz de privacidade e acesso, ocorrem zero exposições de coordenadas de outro laboratório e zero entregas dos campos proibidos por FR-022; vínculo revogado e recurso cruzado não revelam existência ou contagem.
- **SC-006**: Em verificação nas larguras de 320 px, 768 px e 1280 px, 100% das áreas, relações, estados, atribuição e destinos essenciais permanecem alcançáveis sem rolagem horizontal do conteúdo principal.
- **SC-007**: Em verificação somente por teclado e com tecnologia assistiva, 100% das ações essenciais recebem foco perceptível, possuem nome compreensível e podem ser concluídas sem depender de cor, posição, hover ou gesto.
- **SC-008**: Em teste moderado dos cenários principais com participantes representativos, pelo menos 90% identificam o laboratório, localizam uma área e alcançam uma coleta relacionada sem ajuda.
- **SC-009**: Com a base cartográfica indisponível, 100% das áreas autorizadas continuam identificáveis pela alternativa textual e 100% dos destinos de área e coleta permanecem utilizáveis.

**Human evaluation status**: a parcela de SC-007 que exige tecnologia assistiva e SC-008 permanecem `NAO_VERIFICADO` até avaliação registrada em ambiente apropriado. Essa medição posterior não deve ser declarada antecipadamente como aprovação ou falha.

## Assumptions

### Dependencies and Integration State

| Dependency | Published HEAD | Integration state at baseline | Consequence for IMP-008 |
|---|---|---|---|
| IMP-003 — áreas | `106e25f984df56384896729bf786e44104166570` | Integrada em `origin/development@10fdb8b` | Sustenta contexto, autorização, área-ponto, coordenadas e detalhe. |
| IMP-004 — coletas | `7c977147797ca8a8c167033fee6e7a8ab46f673f` | Integrada em `origin/development@10fdb8b` | Sustenta coleta confirmada, associação imutável à área e detalhe contextual; não fornece coordenada própria. |
| IMP-005 — dados ambientais | `e775ebcdc1112c0d18117e4023a578a4ef62cf1c` | Integrada pelo merge `5d9ca6f` | Fornece contrato/runtime real; permanece fora da projeção mínima por decisão explícita de escopo. |
| IMP-006 — diagnóstico IHFR | `ab5e30b2cf1e78c5ab20c9467d003cba1041d8ec` | Documentação não integrada e com gates abertos | Bloqueia score, classe, risco, gráfico ou diagnóstico no mapa mínimo. |
| IMP-007 — dashboard/histórico | `9e3a818be1690298e70586ac640151fecba02b82` | Integrada pelo merge `10fdb8b` | Fornece landing, navegação, estados e padrões de projeção; não é fonte de dados do mapa. |

IMP-009 e IMP-010 já possuem itens próprios no backlog. A condição de implementar os gráficos Plotly sempre depois da IMP-009 rege somente a entrega futura ainda não identificada; ela não transforma a IMP-009 em pré-requisito do mapa mínimo. A possibilidade de execução paralela com a IMP-010 é apenas de sequenciamento e não cria dependência entre as duas entregas.

### Traceability

| Subject | Sources | Application in IMP-008 |
|---|---|---|
| Cadastro e representação espacial | `CF-PRD-FR-013`, `CF-UC-007`, `CF-UC-008`, `CF-PFLOW-004`; IMP-003 integrada | Reutiliza o ponto persistido e o detalhe autorizado; não altera cadastro nem geometria. |
| Associação espacial de coletas | `CF-PRD-FR-014`, `CF-UC-010`, `CF-PFLOW-005`; IMP-004 integrada | Relaciona coleta confirmada ao ponto de sua área, sem localização própria. |
| Visualização territorial e origem | `CF-PRD-FR-015`, `CF-UC-015`, `CF-PFLOW-007` | Exige projeção rastreável e retorno ao registro de origem; restringe o mínimo às fontes integradas. |
| Isolamento, privacidade e minimização | `CF-PRD-NFR-001` a `CF-PRD-NFR-005`; contratos integrados das IMP-003/004 | Revalidação server-side, resposta indistinguível, projeção mínima e nenhum campo pessoal desnecessário. |
| Acessibilidade e qualidade visual | `CF-PRD-NFR-006`; padrões implementados pela IMP-007 integrada | Lista equivalente, teclado, estados explícitos, responsividade e atribuição acessível. |
| Decisões cartográficas | `CF-Q-012`, `CF-Q-013`, `TD-008`, `TD-011`, `TD-014` | Leaflet/React-Leaflet é escolha local do mapa mínimo; provedor e arquitetura definitiva permanecem abertos. |
| Gráficos analíticos futuros | solicitação explícita da equipe nesta atualização de 2026-09-18; `TD-010` reconciliado no registro global | Plotly é direção futura após a IMP-009, sem implementação, dependência ou gráfico na IMP-008; IMP-005/007 integradas continuam fora desta projeção. |

### Scope Assumptions

- O mapa é somente leitura nesta feature. Cadastro e confirmação do ponto continuam pertencendo à IMP-003.
- Todas as áreas criadas pelo contrato integrado possuem ponto válido; o estado de localização indisponível protege contra legado, corrupção ou incompatibilidade sem inventar posição.
- A relação de coletas é obtida diretamente das fontes integradas no momento da leitura; não depende de histórico, evento ou contador persistido.
- Conectividade é necessária para obter dados atuais. Indisponibilidade dos tiles não impede o uso da alternativa textual depois que os registros forem carregados.
- A precisão atual é adequada apenas para participantes já autorizados a consultar a área. Qualquer audiência externa ou mudança de granularidade exige decisão específica de privacidade.

## Out of Scope

- Criar, editar, mover ou excluir área, ponto, coleta, dado ambiental ou diagnóstico.
- Polígonos, linhas, limites territoriais, buffers, localização própria de coleta, geocodificação, roteamento ou busca por endereço.
- Filtros, camadas alternáveis, clusters, heatmaps, comparação temporal, animação, desenho, medição ou exportação.
- Valores, grupos, indicadores ou gráficos ambientais até integração e reconciliação dos contratos pertinentes.
- Score, classe, risco, cor temática, interpretação, gráfico ou recomendação IHFR até integração do contrato pertinente e satisfação da aprovação científica aplicável.
- Dashboard, histórico, auditoria, retenção independente, notificações ou atualização em tempo real.
- Implementação ou integração de Plotly, inclusive no frontend ou via Plotly Python; seleção de OpenStreetMap, PostGIS, Python, segundo motor cartográfico, provedor de tiles, schema, endpoint ou arquitetura definitiva.
- Acesso público, compartilhamento externo, publicação de coordenadas ou mudança de precisão sem política aprovada.
- Alteração de código, schema, migration, dependência, configuração ou artefato das IMP-003 a IMP-007 nesta etapa de especificação.
