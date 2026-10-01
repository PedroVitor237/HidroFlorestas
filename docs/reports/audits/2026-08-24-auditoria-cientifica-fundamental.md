# Auditoria científica fundamental do IHFR

## Identificação, estado e limites

- **Identificador:** `DOC-009`
- **Data:** 2026-08-24
- **Estado documental:** `CANONICO_ATUAL`, exclusivamente como relatório analítico aprovado
- **Plano:** [`DOC-PLAN-003`](../../plans/completed/auditoria-cientifica-fundamental.md)
- **Aprovação analítica:** aprovação humana registrada na solicitação da Etapa 5, condicionada à correção conceitual de `SCI-FND-011`, aplicada em 2026-08-25
- **Fontes profundamente auditadas:** `DOC-RAW-007`, `DOC-RAW-008`, `DOC-RAW-009` e `DOC-RAW-011`
- **Autoridade científica:** não especificada; dependente de `PD-002`
- **Natureza:** Relatório analítico de auditoria interna, sem autoridade para validar cientificamente ou atualizar normas.

Este relatório avalia coerência, rastreabilidade e suficiência documental interna. Sua aprovação é exclusivamente analítica: não valida cientificamente o conteúdo, não transforma achados em regras normativas, não escolhe uma fonte como correta, não altera documentação normativa, não compara com código e não resolve `PD-002`. Declarações localizadas são `FATO_DOCUMENTADO`; relações derivadas são `INFERENCIA`; ausências são `NAO_ESPECIFICADO`; decisões científicas permanecem `PENDENCIA_DE_DECISAO` sob `PD-002`.

Os localizadores em linhas referem-se ao conteúdo imutável observado em 2026-08-24 e aos checksums registrados em `DOCUMENT_REGISTER.md`.

## Método e corpus

As quatro fontes foram lidas integralmente, totalizando 809 linhas físicas informadas por `wc -l` (o numerador de `nl -ba` alcança 138, 175, 226 e 272 devido à última linha sem quebra em duas fontes). Para cada fonte foram percorridos títulos, parágrafos, listas, tabelas e fórmulas. A busca de cobertura considerou nome exato, variação morfológica e contexto; equivalências não declaradas foram marcadas como `INFERENCIA`.

Nenhum dos outros nove documentos de `docs/raw/` foi lido profundamente. Seus identificadores, títulos, caminhos, estados e referências já registradas foram usados somente nos encaminhamentos futuros. Nenhuma fonte externa foi consultada.

## Identificação das fontes

### `DOC-RAW-007` — Matriz de variáveis do IHFR

| Campo | Registro rastreável |
|---|---|
| Identificador, título e caminho | `DOC-RAW-007`; “MATRIZ DE VARIÁVEIS DO IHFR”; `docs/raw/matriz-de-variaveis-do-ihfr.md`; título nas linhas 1–3. |
| Finalidade declarada | Organizar os indicadores ambientais usados no cálculo do IHFR em quatro dimensões e converter cada variável em risco normalizado de 0 a 1; linhas 5–12. |
| Escopo declarado | Dimensões hídrica, pedológica, vegetação/paisagem e territorial; estrutura e classes do índice; aplicações em propriedades, assentamentos, bacias e municípios; linhas 5–10, 14–108 e 110–134. |
| Conceitos centrais | Indicador ambiental, variável, dimensão, risco normalizado, IHFR, risco hidroambiental, interpretação ecológica e validação/calibração futura; linhas 5–12, 26–28, 42–44, 57–59, 71–73, 75–108 e 126–134. |
| Estrutura de seções | Quatro dimensões com tabelas de variáveis; estrutura final; classificação; interpretação; potencial de aplicação; validação científica; conclusão; linhas 14–138. |
| Entradas | Dezessete variáveis ambientais e seus valores/categorias, inventariados como `VAR-001` a `VAR-017`; linhas 18–24, 34–40, 50–55 e 65–69. |
| Saídas | Risco por variável, média por dimensão, IHFR, classe e interpretação ecológica; linhas 12, 75–108. |
| Dependências declaradas | Validação futura por análise estatística, regressões e comparação com indicadores hidrológicos; calibração futura de pesos; linhas 126–134. Não há dependência documental nomeada. |
| Limitações explicitamente declaradas | A validação e a calibração de pesos são futuras; linhas 126–134. Versão, origem, responsável, desenho amostral, controle de qualidade e tratamento de ausências não são declarados. |
| Termos definidos | As quatro dimensões recebem função textual; variáveis recebem descrições e unidades; classes recebem interpretação; linhas 14–73 e 92–108. |
| Termos usados sem definição operacional suficiente | “indicadores ambientais”, “normalizado”, “índice” de densidade de drenagem, “grau” de fragmentação, “nível geral” de degradação, “SAF”, “APP”, “suspeita” e “confirmado”; linhas 5, 12, 24, 53–55 e 68–69. |
| Localizadores principais | Linhas 5–12; 14–73; 75–108; 110–134. |

### `DOC-RAW-008` — Modelo científico do IHFR

| Campo | Registro rastreável |
|---|---|
| Identificador, título e caminho | `DOC-RAW-008`; “MODELO CIENTÍFICO DO IHFR”; `docs/raw/modelo-cientifico-do-ihfr.md`; linhas 1–5. |
| Finalidade declarada | Apresentar o IHFR como indicador sintético da capacidade funcional de paisagens rurais para infiltrar, armazenar e regular água; linhas 13–17. |
| Escopo declarado | Paisagens rurais, vulnerabilidade hidroambiental, quatro dimensões, formulação, classes, aplicações e integração digital; linhas 7–175. |
| Conceitos centrais | Vulnerabilidade hidroambiental, segurança hídrica, capacidade hidroecológica, infiltração, armazenamento, evapotranspiração, escoamento, resiliência, quatro dimensões e indicador sintético; linhas 9–17 e 19–47. |
| Estrutura de seções | Introdução; fundamentos; estrutura; quatro dimensões; formulação; classes; aplicações; integração digital; perspectivas; conclusão; linhas 7–175. |
| Entradas | Conjuntos de variáveis por dimensão, em enumerações textuais; linhas 49–100. |
| Saídas | Valor normalizado do IHFR, classe, diagnóstico e apoio à restauração/manejo; linhas 102–160. |
| Dependências declaradas | Dados coletados em campo, georreferenciamento e, futuramente, sensoriamento remoto, modelagem, monitoramento e calibração empírica; linhas 148–171. Nenhum documento é nomeado. |
| Limitações explicitamente declaradas | Melhorias e calibração empírica são futuras; linhas 162–171. A fonte não explicita protocolo de medição, fonte bibliográfica, dados faltantes, controle de qualidade nem autoridade de aprovação. |
| Termos definidos | O IHFR é caracterizado nas linhas 15–17; três processos principais nas linhas 21–36; quatro dimensões nas linhas 38–100; direção da escala nas linhas 121–122. |
| Termos usados sem definição operacional suficiente | “escassez hídrica funcional”, “capacidade hidroecológica”, “qualidade” da água, “grau de intervenção antrópica”, “precisão” e “calibração empírica”; linhas 31–36, 51, 98 e 162–171. |
| Localizadores principais | Linhas 9–17; 19–47; 49–100; 102–134; 148–171. |

### `DOC-RAW-009` — Modelo conceitual do IHFR

| Campo | Registro rastreável |
|---|---|
| Identificador, título e caminho | `DOC-RAW-009`; “MODELO CONCEITUAL DO IHFR”; `docs/raw/modelo-conceitual-do-ihfr.md`; linhas 1–3. |
| Finalidade declarada | Representar, como framework científico, a interação entre componentes ecológicos, a capacidade de regular água e o fluxo conceitual até diagnóstico e recomendações; linhas 5–23 e 25–90. |
| Escopo declarado | Modelo conceitual científico do índice e sua tradução em fluxo computacional/plataforma; linhas 5–226. Não é um modelo de domínio do produto. |
| Conceitos centrais | Vulnerabilidade, capacidade hidroecológica, seca funcional, clima/precipitação, quatro dimensões, processos ecológicos, integração, cálculo, classificação, diagnóstico e restauração; linhas 5–23, 25–122. |
| Estrutura de seções | Princípio; sistema; interpretação; relações ecológicas; fluxo operacional; escala; integração com plataforma; restauração; evolução; conclusão; linhas 5–226. |
| Entradas | Clima/precipitação como fator externo, dados de campo e variáveis ambientais; linhas 29–68, 94–100 e 124–136. |
| Saídas | IHFR, classificação, diagnóstico territorial/hidroambiental e recomendações; linhas 74–90, 140–160 e 173–201. |
| Dependências declaradas | Dados de campo, normalização, cálculo de dimensões, algoritmo IHFR, mapa territorial e integrações futuras; linhas 124–160, 173–220. Nenhum documento é nomeado. |
| Limitações explicitamente declaradas | Integrações de sensoriamento, clima, modelagem e monitoramento são futuras; linhas 213–222. Métodos, unidades, fontes bibliográficas, regras de dados ausentes e critérios de validação não são declarados. |
| Termos definidos | Quatro componentes nas linhas 7–14; seca funcional nas linhas 16–23; relações ecológicas nas linhas 102–122; classes e interpretações nas linhas 162–171. |
| Termos usados sem definição operacional suficiente | “organização espacial”, “degradação da paisagem”, “colapso hidroecológico”, “recomendações técnicas” e “precisão”; linhas 57–68, 166–171, 201 e 213–222. |
| Localizadores principais | Linhas 5–23; 25–90; 92–122; 124–171; 173–222. |

### `DOC-RAW-011` — Protocolo de campo do IHFR

| Campo | Registro rastreável |
|---|---|
| Identificador, título e caminho | `DOC-RAW-011`; “PROTOCOLO DE CAMPO DO IHFR”; `docs/raw/protocolo-de-campo-do-ihfr.md`; linhas 1–3. |
| Finalidade declarada | Padronizar a coleta de dados ambientais do IHFR para avaliar propriedades rurais; linhas 5–9. |
| Escopo declarado | Paisagens rurais do Maranhão, com foco no Baixo Itapecuru; propriedade, comunidade e microbacia; unidades de paisagem em áreas maiores; linhas 7–21. |
| Conceitos centrais | Área/unidade amostral, georreferenciamento, fonte hídrica, infiltração, compactação, erosão, cobertura, fragmentação, mata ciliar, declividade, uso da terra, registro, normalização, cálculo e diagnóstico; linhas 23–272. |
| Estrutura de seções | Objetivo; escalas; equipamentos; delimitação; coleta hídrica, solo, vegetação e território; registro; cálculo; classificação; interpretação; recomendações; conclusão; linhas 5–272. |
| Entradas | Observações e medições de 11 procedimentos nomeados de variáveis, além da delimitação/georreferenciamento da área; linhas 36–209. |
| Saídas | Planilha de dados, IHFR, classe, interpretação e recomendações; linhas 210–268. |
| Dependências declaradas | Equipamentos simples e dados de campo; linhas 23–35. A fórmula depende de variáveis normalizadas, sem método declarado de normalização; linhas 223–238. |
| Limitações explicitamente declaradas | Foco regional nas linhas 7–9 e recomendação de subdivisão para propriedades maiores na linha 21. A fonte não declara repetição, número de pontos, agregação, periodicidade, impossibilidade de coleta, dados faltantes nem controle de qualidade. |
| Termos definidos | Escalas de aplicação nas linhas 11–21; equipamentos e finalidades nas linhas 23–35; classificações por procedimento nas linhas 55–209; classes/diagnóstico nas linhas 240–258. |
| Termos usados sem definição operacional suficiente | “principal” fonte, profundidade “aproximada”, salinização “confirmada”, volume “conhecido”, cobertura por “método visual ou por amostragem”, observação do relevo e “unidades homogêneas”; linhas 36–53, 57–97, 101–109, 150–160 e 182–195. |
| Localizadores principais | Linhas 5–21; 23–53; 55–209; 210–258; 260–272. |

## Léxico científico comparado

As equivalências abaixo só são “explícitas” quando a própria fonte aproxima os termos. Aproximações entre documentos são `INFERENCIA` e não unificam o vocabulário.

| ID | Termo | Definição ou uso em cada fonte | Fonte e localizador | Equivalência explicitamente declarada | Variações | Ambiguidade | Estado de alinhamento | Validação necessária |
|---|---|---|---|---|---|---|---|---|
| `LEX-001` | Índice HidroFlorestal de Risco — IHFR | 007: índice que integra quatro dimensões em risco; 008: indicador sintético da capacidade funcional da paisagem; 009: sistema que captura vulnerabilidade e produz diagnóstico; 011: índice calculado com dados de campo. | 007:5–12, 75–108; 008:13–17; 009:7–23, 74–90; 011:5–9, 223–258 | Nome e sigla aparecem em todas. | índice, indicador sintético, mecanismo central, algoritmo IHFR | A identidade nominal está alinhada, mas a definição operacional completa não está concentrada em uma fonte. | `ALINHAMENTO_DOCUMENTAL` parcial | Sim, sob `PD-002`. |
| `LEX-002` | vulnerabilidade hidroambiental | 007: associada a inclinação/uso e classes de risco; 008: objeto avaliado pelo indicador; 009: resultado da interação dos componentes; 011: condição avaliada em propriedades. | 007:71–73, 101–108; 008:5, 13–15; 009:7–23, 92–100; 011:5–9 | 009 relaciona vulnerabilidade à interação dos quatro componentes. | vulnerabilidade, risco hidroambiental, degradação hidroambiental | Relação entre “vulnerabilidade” e “risco” não é formalmente definida. | `AMBIGUIDADE` | Sim. |
| `LEX-003` | capacidade hidroecológica da paisagem | 007: não usa o termo; 008: capacidade do território de responder a variações e de infiltrar/armazenar/regular; 009: componente sistêmico que regula o ciclo; 011: não usa o termo. | 008:15, 21–36; 009:25–40, 94–100 | 008 explicita os processos que compõem a capacidade; 009 a posiciona no sistema. | capacidade funcional, capacidade hidroecológica, paisagem funcional | A correspondência entre “funcional” e “hidroecológica” é `INFERENCIA`. | `ALINHAMENTO_DOCUMENTAL` parcial | Sim. |
| `LEX-004` | seca funcional da paisagem | 007: “seca funcional” na interpretação crítica; 008: “escassez hídrica funcional”; 009: define “seca funcional da paisagem” por quatro manifestações; 011: não usa o termo. | 007:101–108; 008:29–36; 009:16–23, 98–100 | 009 fornece caracterização explícita da seca funcional. | seca funcional; escassez hídrica funcional | Equivalência entre seca e escassez funcional não é declarada. | `AMBIGUIDADE` | Sim. |
| `LEX-005` | dimensão hídrica | 007: disponibilidade e estabilidade de recursos locais; 008: disponibilidade e qualidade; 009: água, nascentes, poços e salinização; 011: seção de coleta hídrica. | 007:14–28; 008:49–61; 009:43–48; 011:55–97 | As fontes associam explicitamente água/fontes/salinização à dimensão ou coleta hídrica. | condição hídrica, disponibilidade hídrica, dados hídricos | “estabilidade” e “qualidade” ampliam o escopo de formas diferentes. | `ALINHAMENTO_DOCUMENTAL` parcial | Sim. |
| `LEX-006` | dimensão pedológica | 007: capacidade de infiltrar e armazenar; 008: condições físicas do solo; 009: infiltração, compactação, textura e erosão; 011: coleta de dados do solo. | 007:30–44; 008:63–75; 009:50–55; 011:99–146 | 007 e 008 relacionam explicitamente solo, infiltração e armazenamento. | condição estrutural do solo; solo; dimensão pedológica | Limite entre condição, dimensão e processo não é formalizado. | `ALINHAMENTO_DOCUMENTAL` | Sim. |
| `LEX-007` | dimensão da vegetação e paisagem | 007: regulação hidrológica pela cobertura; 008: cobertura e organização da paisagem; 009: cobertura, fragmentação, APP e degradação; 011: coleta de vegetação. | 007:46–59; 008:77–88; 009:57–62; 011:148–180 | Associação da cobertura/fragmentação é explícita em todas as fontes aplicáveis. | dimensão da vegetação; vegetação e paisagem; coleta de vegetação | APP e mata ciliar não têm equivalência integral declarada. | `ALINHAMENTO_DOCUMENTAL` parcial | Sim. |
| `LEX-008` | dimensão territorial | 007: geomorfologia e uso, com declividade, uso e densidade de drenagem; 008: espaço, declividade, uso e intervenção antrópica; 009: declividade, uso e organização espacial; 011: declividade e uso. | 007:61–73; 008:90–100; 009:64–68; 011:182–208 | Declividade e uso da terra são comuns e explícitos. | contexto territorial; características territoriais; organização espacial | O terceiro elemento territorial varia entre densidade de drenagem, intervenção antrópica e organização espacial. | `DIVERGENCIA_DOCUMENTAL` | Sim. |
| `LEX-009` | infiltração | 007: velocidade em mm/h; 008: processo e variável do solo; 009: processo favorecido por cobertura e estrutura; 011: teste do anel e faixas. | 007:32–44; 008:23–36, 63–75; 009:18, 52, 98–112; 011:101–115 | As fontes relacionam explicitamente infiltração, solo e regulação hídrica. | taxa de infiltração; infiltração hídrica; infiltração da água | Conversão contínua da matriz e classes do protocolo não são equivalentes declaradas. | `ALINHAMENTO_DOCUMENTAL` conceitual; `DIVERGENCIA_DOCUMENTAL` operacional | Sim. |
| `LEX-010` | armazenamento/retenção hídrica | 007: função da dimensão pedológica; 008: processo principal no perfil do solo; 009: efeito de infiltração/boa estrutura; 011: não mede diretamente. | 007:30–32; 008:23–27, 65–75; 009:18–20, 98–112; 011:99–146 | 008 e 009 relacionam explicitamente armazenamento/retensão ao solo. | armazenamento hídrico; retenção de água; retenção hídrica | Equivalência terminológica é plausível, mas não declarada entre fontes. | `INFERENCIA` | Sim. |
| `LEX-011` | regulação da evapotranspiração | 007: não usa o termo; 008: processo principal pela cobertura; 009: não usa o termo; 011: não mede. | 008:23–27 | Nenhuma equivalência transversal declarada. | não especificado | Processo científico aparece em uma única fonte e não possui variável ou método correspondente. | `NAO_COMPARAVEL` | Sim. |
| `LEX-012` | escoamento superficial | 007: consequência de solo compactado/baixa infiltração; 008: consequência da degradação; 009: manifestação da seca funcional e relação com declividade; 011: não mede diretamente. | 007:42–44; 008:29–36, 75; 009:16–20, 98–120 | Relações causais são explícitas nas três fontes conceituais. | escoamento superficial; perda de água | A expressão “perda de água” é mais ampla; equivalência é `INFERENCIA`. | `ALINHAMENTO_DOCUMENTAL` | Sim. |
| `LEX-013` | salinização | 007: indício de água salobra em três categorias; 008: indícios de salinização da água; 009: item da dimensão hídrica; 011: avaliação por indicadores e três classes. | 007:24, 26–28; 008:49–61; 009:43–48; 011:81–97 | Tema comum e explicitamente hídrico. | indícios de salinização; salinização da água; água salobra | “confirmado” não tem critério instrumental e a matriz usa “nenhum”, enquanto o protocolo usa “ausência”. | `ALINHAMENTO_DOCUMENTAL` parcial | Sim. |
| `LEX-014` | cobertura vegetal | 007: percentual da área; 008: percentual e regulador hidrológico; 009: fator de infiltração/proteção; 011: estimativa percentual visual ou amostral. | 007:46–59; 008:77–88; 009:57–62, 102–108; 011:148–160 | Percentual e função protetora aparecem explicitamente. | cobertura vegetal; percentual de cobertura | Método visual e amostragem não são especificados nem conciliados. | `ALINHAMENTO_DOCUMENTAL` conceitual; `AMBIGUIDADE` metodológica | Sim. |
| `LEX-015` | fragmentação | 007: grau da vegetação; 008: grau da vegetação; 009: item da dimensão; 011: continuidade com três condições. | 007:53; 008:81–86; 009:57–62; 011:162–170 | Associação à vegetação/paisagem é explícita. | fragmentação da vegetação; fragmentação da paisagem; continuidade | Não há regra declarada que converta continuidade em baixa/moderada/alta fragmentação. | `AMBIGUIDADE` | Sim. |
| `LEX-016` | APP/mata ciliar | 007: presença de mata ciliar ou APP, binária; 008: presença de APP; 009: “APP”; 011: presença de mata ciliar em três estados de conservação. | 007:54; 008:81–86; 009:57–62; 011:172–180 | 007 aproxima explicitamente mata ciliar e APP com “ou”. | presença de APP; áreas de preservação permanente; mata ciliar | A extensão conceitual e a cardinalidade binária versus três estados divergem. | `DIVERGENCIA_DOCUMENTAL` | Sim. |
| `LEX-017` | degradação da paisagem | 007: nível geral em três categorias; 008: variável e condição geral; 009: item da dimensão e processo; 011: não possui procedimento próprio. | 007:55, 57–59; 008:79–88; 009:16–23, 57–62; 011:148–180 | 007–009 associam explicitamente o termo à vegetação/paisagem. | degradação da paisagem; paisagem degradada; degradação ecológica | Critério e relação com erosão, solo exposto e fragmentação não são definidos. | `AMBIGUIDADE` | Sim. |
| `LEX-018` | normalização/risco normalizado | 007: cada variável vira 0–1 por mapeamentos/fórmulas; 008: cada dimensão é normalizada 0–1; 009: etapa do fluxo; 011: variáveis são normalizadas sem método. | 007:12, 18–24, 34–40, 50–55, 65–69; 008:102–121; 009:124–148; 011:223–230 | Todas afirmam normalização ou escala, mas não declaram equivalência de método. | normalização dos dados; dimensão normalizada; escala de risco | Unidade normalizada (variável versus dimensão) e conversão entre classes e números não são especificadas de modo comum. | `DIVERGENCIA_DOCUMENTAL` | Sim; análise matemática na Etapa 5. |
| `LEX-019` | diagnóstico | 007: interpretação ecológica por classe; 008: diagnóstico ambiental; 009: diagnóstico hidroambiental e territorial; 011: interpretação do diagnóstico. | 007:101–108; 008:150–158; 009:74–90, 124–160, 173–201; 011:249–258 | Todos ligam resultado/classificação a uma leitura da condição ambiental. | diagnóstico ambiental, hidroambiental, territorial | Escopo e conteúdo mínimo do diagnóstico não são definidos. | `AMBIGUIDADE` | Sim. |
| `LEX-020` | recomendações de restauração | 007: áreas prioritárias e tipos de intervenção; 008: apoio a restauração; 009: saída do fluxo; 011: lista de ações possíveis. | 007:110–124; 008:134–158; 009:74–90, 152–160, 203–211; 011:260–268 | Relação entre diagnóstico e recomendações é explícita em 009 e 011. | recomendações de restauração, técnicas, ecológicas | Regra de derivação por classe/variável não é especificada. | `ALINHAMENTO_DOCUMENTAL` parcial | Sim. |
| `LEX-021` | modelo conceitual científico | 007: não usa; 008: “fundamentos conceituais”, mas não define artefato; 009: framework científico de processos e fluxo; 011: não usa. | 008:19–36; 009:1–3, 5–27, 92–160 | 009 declara a natureza científica do framework. | fundamentos conceituais; framework científico; modelo conceitual | Não deve ser confundido com futuro modelo de domínio do produto; nenhuma fonte estabelece essa equivalência. | `NAO_COMPARAVEL` ao modelo de domínio | Validação científica para o conteúdo; autoridade de produto/dados para eventual modelo de domínio. |

## Dimensões, componentes e processos do IHFR

Foram identificadas quatro dimensões recorrentes e 14 componentes/processos estruturais. A contagem não inclui cada variável novamente.

| ID | Nome exato e fonte/localizador | Definição e função declarada | Relações e variáveis associadas | Procedimento de campo | Presença nas demais fontes | Divergências ou lacunas | Estado de validação |
|---|---|---|---|---|---|---|---|
| `DIM-001` | “dimensão hídrica” — 007:14–28; 008:49–61; 009:43–48 | Avaliar disponibilidade/estabilidade/qualidade da água local. | `VAR-001` a `VAR-005`; recarga, circulação e escassez. | Fonte, profundidade e salinização em 011:55–97. | Presente nas quatro. | Presença de nascente e disponibilidade anual não localizadas no protocolo; estabilidade/qualidade variam. | `AGUARDANDO_VALIDACAO_CIENTIFICA` |
| `DIM-002` | “dimensão pedológica” / “condição estrutural do solo” — 007:30–44; 008:63–75; 009:50–55 | Avaliar condições físicas que controlam infiltração e armazenamento. | `VAR-006` a `VAR-010`; infiltração, escoamento e recarga. | Infiltração, compactação e erosão em 011:99–146. | Presente nas quatro sob variações. | Textura não localizada; solo exposto aparece como categoria de uso, não como percentual medido. | `AGUARDANDO_VALIDACAO_CIENTIFICA` |
| `DIM-003` | “dimensão da vegetação e paisagem” — 007:46–59; 008:77–88; “DIMENSÃO VEGETAÇÃO” — 009:57–62 | Avaliar regulação hidrológica, proteção do solo e organização da paisagem. | `VAR-011` a `VAR-014`; infiltração, erosão e degradação. | Cobertura, fragmentação e mata ciliar em 011:148–180. | Presente nas quatro. | APP/mata ciliar e suas classes divergem; degradação não tem procedimento próprio. | `AGUARDANDO_VALIDACAO_CIENTIFICA` |
| `DIM-004` | “dimensão territorial” — 007:61–73; 008:90–100; 009:64–68 | Avaliar geomorfologia, espaço e uso da terra. | `VAR-015` a `VAR-017`; declividade, uso, drenagem/intervenção/organização. | Declividade e uso em 011:182–208. | Presente nas quatro. | Terceiro elemento varia e não tem método no protocolo. | `AGUARDANDO_VALIDACAO_CIENTIFICA` |
| `PROC-001` | “CLIMA REGIONAL” e “PRECIPITAÇÃO” — 009:29–39 | Fatores externos a montante da capacidade hidroecológica. | Influenciam o sistema; nenhuma variável correspondente em 007. | Não especificado em 011. | Clima é contexto em 008:9–15, 21–36. | Papel de entrada, covariável ou contexto não definido. | `AGUARDANDO_VALIDACAO_CIENTIFICA` |
| `PROC-002` | “CAPACIDADE HIDROECOLÓGICA DA PAISAGEM” — 009:39–74; capacidade funcional — 008:15–36 | Regular fluxos e responder a variações climáticas. | Integra as quatro dimensões e processos de água/solo/vegetação. | Não há medição direta declarada. | Conceito próximo em 008; não nomeado em 007/011. | Equivalência entre capacidade funcional e hidroecológica é `INFERENCIA`. | `AGUARDANDO_VALIDACAO_CIENTIFICA` |
| `PROC-003` | “infiltração” — 008:23–36; 009:18, 52, 102–112 | Entrada de água no solo; favorecida por vegetação/estrutura. | `DIM-002`, `VAR-006`; relacionada a cobertura e escoamento. | Anel de infiltração, 011:101–115. | Presente nas quatro. | Fórmula contínua e faixas de campo divergem documentalmente. | `ENCAMINHADO_ETAPA_5` quanto à normalização; método aguarda validação. |
| `PROC-004` | “armazenamento hídrico” / “retenção” — 008:23–27; 009:98–112 | Reter água no perfil do solo. | Resultado de infiltração e boa estrutura; `DIM-002`. | Não há variável ou medição direta. | Função citada em 007:30–32. | Sem variável, unidade ou método; ausência não tratada como erro automático. | `AGUARDANDO_VALIDACAO_CIENTIFICA` |
| `PROC-005` | “regulação da evapotranspiração” — 008:23–27 | Regulação pela cobertura vegetal. | `DIM-003`; associação específica a variável não declarada. | Não localizado. | Não nomeado nas outras três. | `NAO_COMPARAVEL` transversalmente. | `AGUARDANDO_VALIDACAO_CIENTIFICA` |
| `PROC-006` | “escoamento superficial” — 007:42–44; 008:29–36; 009:18–20, 98–120 | Resposta ampliada por degradação, compactação e declividade. | `DIM-002` e `DIM-004`; `VAR-006`, `VAR-007`, `VAR-009`, `VAR-015`. | Não medido diretamente. | Conceitualmente presente em 007–009. | Ligações com variáveis são parcialmente explícitas; nenhuma unidade/métrica. | `AGUARDANDO_VALIDACAO_CIENTIFICA` |
| `PROC-007` | “seca funcional da paisagem” / “escassez hídrica funcional” — 007:101–108; 008:29–36; 009:16–23 | Condição de baixa infiltração, maior escoamento, menor retenção e degradação. | Resultado associado às quatro dimensões. | Diagnóstico por classe, sem medição própria. | Não nomeado em 011. | Equivalência lexical e critério diagnóstico não definidos. | `AGUARDANDO_VALIDACAO_CIENTIFICA` |
| `PROC-008` | “degradação do solo” — 008:29–34; 009:114–116 | Processo associado a uso intensivo, compactação e erosão. | `DIM-002`/`DIM-004`; `VAR-007`, `VAR-009`, `VAR-016`. | Compactação e erosão em 011:117–146. | Relação ecológica explícita em 009. | Não há métrica agregada de degradação do solo. | `AGUARDANDO_VALIDACAO_CIENTIFICA` |
| `PROC-009` | “perda de resiliência ecológica” — 008:29–36 | Consequência do comprometimento dos processos principais. | Relacionada à vulnerabilidade; variáveis não explicitadas. | Não localizado. | Não nomeada nas demais fontes. | `NAO_COMPARAVEL`; definição/métrica ausentes. | `AGUARDANDO_VALIDACAO_CIENTIFICA` |
| `PROC-010` | “INTEGRAÇÃO DAS DIMENSÕES” — 009:74–78, 140–148 | Combinar dimensões antes do cálculo do índice. | Recebe `DIM-001` a `DIM-004`. | Não é procedimento de coleta; 011 apenas afirma integração, linhas 223–230. | Presente em 007:75–90 e 008:102–121. | Regra matemática diverge; Etapa 5. | `ENCAMINHADO_ETAPA_5` |
| `PROC-011` | “CÁLCULO DO IHFR” — 009:78–82, 148–152 | Produzir valor do índice. | Recebe integração/normalização e gera classe. | Fórmula em 011:223–238. | Fórmulas em 007 e 008. | Pesos incompatíveis entre fontes. | `ENCAMINHADO_ETAPA_5` |
| `PROC-012` | “CLASSIFICAÇÃO DE RISCO” — 009:82–86, 152–156 | Converter IHFR em quatro níveis. | Saída do cálculo; entrada do diagnóstico. | Classes em 011:240–247. | Presente em todas. | Intervalos contínuos deixam fronteiras intermediárias ambíguas. | `ENCAMINHADO_ETAPA_5` |
| `PROC-013` | “DIAGNÓSTICO HIDROAMBIENTAL” / “DIAGNÓSTICO TERRITORIAL” — 009:86–90, 156–160 | Interpretar a classe/condição ambiental. | Recebe classificação; conduz a recomendações. | Interpretação em 011:249–258. | Interpretação em 007 e diagnóstico em 008. | Conteúdo e escopo mínimo não especificados. | `AGUARDANDO_VALIDACAO_CIENTIFICA` |
| `PROC-014` | “RECOMENDAÇÕES DE RESTAURAÇÃO” — 009:88–90, 158–160 | Orientar restauração/manejo a partir do diagnóstico. | Saída final do fluxo. | Ações exemplificadas em 011:260–268. | Aplicações em 007/008. | Regra de derivação não especificada. | `AGUARDANDO_VALIDACAO_CIENTIFICA` |

## Inventário completo de variáveis de `DOC-RAW-007`

Foram extraídas 17 de 17 linhas de variáveis. Os IDs são chaves desta auditoria e não alteram a fonte. “Tipo não especificado” evita deduzir um tipo de dado apenas pela unidade.

### Identidade, medição e interpretação

| ID | Nome exato | Dimensão | Definição | Finalidade | Tipo e unidade | Método e instrumento | Escala/faixa/direção declarada | Localizador |
|---|---|---|---|---|---|---|---|---|
| `VAR-001` | tipo de fonte hídrica | Hídrica | Origem da água utilizada. | `INFERENCIA`: representar condição/disponibilidade da fonte na dimensão. | Categórica; unidade registrada como “categórica”. | Não especificados em 007. | nascente 0.2; rio 0.4; cisterna 0.5; poço tubular 0.6; poço raso 0.7; maior valor indica maior risco pela regra geral. | 007:18–20; direção geral 007:12. |
| `VAR-002` | presença de nascente | Hídrica | Existência de nascente na área. | `INFERENCIA`: representar presença de sistema hídrico local. | Binária; unidade “binária”. | Não especificados em 007. | sim 0.2; não 0.8; maior valor indica maior risco. | 007:18–21. |
| `VAR-003` | profundidade do poço | Hídrica | Profundidade da captação. | `INFERENCIA`: representar condição da captação. | Tipo não especificado; metros. | Não especificados em 007. | risco = 1 − profundidade/60; faixa de entrada e limites da saída não especificados; maior profundidade reduz o risco pela fórmula. | 007:18–22. |
| `VAR-004` | disponibilidade hídrica | Hídrica | Regularidade da água ao longo do ano. | Representar disponibilidade/estabilidade hídrica. | Categórica; unidade “categórica”. | Não especificados em 007. | permanente 0.2; sazonal 0.6; escassa 0.9; maior valor indica maior risco. | 007:16, 18–23. |
| `VAR-005` | indícios de salinização | Hídrica | Presença de água salobra. | `INFERENCIA`: representar comprometimento de recarga/circulação e condição da água. | Categórica; unidade “categórica”. | Não especificados em 007. | nenhum 0.2; suspeita 0.7; confirmado 0.95; maior valor indica maior risco. | 007:18–28. |
| `VAR-006` | taxa de infiltração | Pedológica | Velocidade de infiltração da água. | Representar capacidade do solo de infiltrar água. | Tipo não especificado; mm/h. | Não especificados em 007. | risco = 1 − infiltração/60; faixa de entrada e limites da saída não especificados; maior infiltração reduz risco. | 007:30–36. |
| `VAR-007` | compactação do solo | Pedológica | Grau de compactação superficial. | `INFERENCIA`: representar limitação à infiltração e armazenamento. | Categórica; unidade “categórica”. | Não especificados em 007. | baixa 0.2; moderada 0.6; alta 0.9; maior categoria/valor indica maior risco. | 007:32–37, 42–44. |
| `VAR-008` | textura do solo | Pedológica | Proporção de areia, silte e argila. | `INFERENCIA`: representar condição física associada à água no solo. | Categórica; unidade “categórica”. | Não especificados em 007. | arenoso 0.5; médio 0.4; argiloso 0.7; direção ordinal não declarada. | 007:34–38. |
| `VAR-009` | erosão | Pedológica | Evidências de processos erosivos. | `INFERENCIA`: representar degradação física do solo. | Categórica; unidade “categórica”. | Não especificados em 007. | nenhuma 0.2; laminar 0.6; sulcos/voçorocas 0.9; maior valor indica maior risco. | 007:34–39. |
| `VAR-010` | solo exposto | Pedológica | Percentual de solo sem cobertura. | `INFERENCIA`: representar exposição/degradação do solo. | Tipo não especificado; %. | Não especificados em 007. | risco = percentual/100; faixa física implícita não convertida em declaração; maior percentual aumenta risco. | 007:34–40. |
| `VAR-011` | cobertura vegetal | Vegetação e paisagem | Percentual da área coberta por vegetação. | Representar regulação do ciclo, proteção do solo e infiltração. | Tipo não especificado; %. | Não especificados em 007. | risco = 1 − cobertura/100; maior cobertura reduz risco. | 007:46–52, 57–59. |
| `VAR-012` | fragmentação da vegetação | Vegetação e paisagem | Grau de fragmentação da paisagem. | `INFERENCIA`: representar organização/continuidade da vegetação. | Categórica; unidade “categórica”. | Não especificados em 007. | baixa 0.2; moderada 0.6; alta 0.9; maior valor indica maior risco. | 007:50–53. |
| `VAR-013` | presença de APP | Vegetação e paisagem | Presença de mata ciliar ou APP. | `INFERENCIA`: representar proteção vegetal associada a áreas/cursos d’água. | Binária; unidade “binária”. | Não especificados em 007. | sim 0.2; não 0.85; ausência indica maior risco. | 007:50–54. |
| `VAR-014` | degradação da paisagem | Vegetação e paisagem | Nível geral de degradação. | `INFERENCIA`: representar condição geral da paisagem. | Categórica; unidade “categórica”. | Não especificados em 007. | baixa 0.2; moderada 0.6; alta 0.9; maior valor indica maior risco. | 007:50–55. |
| `VAR-015` | declividade | Territorial | Inclinação média do terreno. | Representar característica geomorfológica/vulnerabilidade. | Tipo não especificado; %. | Não especificados em 007. | risco = declividade/45; faixa de entrada e limites da saída não especificados; maior declividade aumenta risco. | 007:61–67, 71–73. |
| `VAR-016` | uso da terra | Territorial | Tipo predominante de uso. | Representar intensidade/tipo de ocupação territorial. | Categórica; unidade “categórica”. | Não especificados em 007. | floresta 0.2; SAF 0.25; agricultura 0.6; pastagem 0.65; pastagem degradada 0.8; solo exposto 0.95; maior valor indica maior risco. | 007:61–68, 71–73. |
| `VAR-017` | densidade de drenagem | Territorial | Concentração de cursos d’água. | `INFERENCIA`: representar organização hidrogeomorfológica territorial. | Tipo não especificado; unidade registrada como “índice”. | Não especificados em 007. | “normalização 0–1”; faixa original e direção interpretativa não especificadas. | 007:65–69. |

### Normalização, temporalidade, escala e presença cruzada

| ID | Normalização | Periodicidade | Escala espacial | Dados faltantes | Fonte original indicada | Presença em 008 | Presença em 009 | Presença em 011 | Campos não especificados e observações |
|---|---|---|---|---|---|---|---|---|---|
| `VAR-001` | Mapeamento categórico direto. | não especificada | Não especificada por variável; aplicações gerais em 007:110–117. | não especificada | não especificada | Variação “tipo de fonte de água”, 008:53–59. | Fontes/poços/nascentes, sem “tipo”, 009:43–48. | Procedimento correspondente, 011:57–67. | Método, instrumento, unidade amostral, frequência e regra de ausência. |
| `VAR-002` | Mapeamento binário direto. | não especificada | Idem. | não especificada | não especificada | “presença de nascentes”, 008:53–59. | “nascentes”, 009:43–48. | Não localizada como variável; menções a tipo e recuperação não são procedimento de presença. | Método, critério de existência, escala e ausência. |
| `VAR-003` | Fórmula linear declarada. | não especificada | Idem. | não especificada | não especificada | “profundidade de poços”, 008:53–59. | “poços”, sem profundidade, 009:43–48. | Medição aproximada e faixas, 011:69–79. | Instrumento, método, precisão, faixa, truncamento e ausência de poço. |
| `VAR-004` | Mapeamento categórico direto. | não especificada | Idem. | não especificada | não especificada | “ao longo do ano”, 008:53–59. | “disponibilidade de água”, 009:43–48. | Não localizada. | Método, janela temporal, frequência, evidência e ausência. |
| `VAR-005` | Mapeamento categórico direto. | não especificada | Idem. | não especificada | não especificada | Variação nominal, 008:53–59. | “salinização”, 009:43–48. | Indicadores e classes, 011:81–97. | Método de confirmação, instrumento, unidade, frequência e ausência. |
| `VAR-006` | Fórmula linear declarada. | não especificada | Idem. | não especificada | não especificada | “taxa de infiltração da água no solo”, 008:67–73. | “infiltração”, 009:50–55. | Anel, tempo e faixas em mm/h, 011:101–115. | Volume, área do anel, repetições, duração, agregação, truncamento e ausência. |
| `VAR-007` | Mapeamento categórico direto. | não especificada | Idem. | não especificada | não especificada | “nível de compactação”, 008:67–73. | “compactação”, 009:50–55. | Avaliação por indicadores, 011:117–133. | Instrumento decisório, limiares, pontos/repetições, agregação e ausência. |
| `VAR-008` | Mapeamento categórico direto. | não especificada | Idem. | não especificada | não especificada | “textura do solo”, 008:67–73. | “textura”, 009:50–55. | Não localizada; tipo de solo só aparece como critério de estratificação, 011:46–53. | Método, instrumento, classes, amostragem, normalização e ausência. |
| `VAR-009` | Mapeamento categórico direto. | não especificada | Idem. | não especificada | não especificada | “processos erosivos”, 008:67–73. | “erosão”, 009:50–55. | Identificação e tipos, 011:135–146. | Unidade amostral específica, extensão/severidade, repetição, agregação e correspondência voçoroca/sulcos. |
| `VAR-010` | Fórmula percentual direta. | não especificada | Idem. | não especificada | não especificada | “grau de exposição do solo”, 008:67–73. | Não localizada como item da dimensão pedológica. | “solo exposto” apenas como classe de uso, 011:197–208. | Método percentual, instrumento, distinção da classe de uso, amostragem e ausência. |
| `VAR-011` | Fórmula linear declarada. | não especificada | Idem. | não especificada | não especificada | “percentual de cobertura vegetal”, 008:81–86. | “cobertura vegetal”, 009:57–62. | Estimativa visual ou amostral e faixas, 011:150–160. | Escolha do método, desenho, instrumento, repetições, agregação e conversão das faixas. |
| `VAR-012` | Mapeamento categórico direto. | não especificada | Idem. | não especificada | não especificada | “grau de fragmentação”, 008:81–86. | “fragmentação”, 009:57–62. | Continuidade em três classes, 011:162–170. | Unidade espacial, método, limiares e equivalência entre vocabulários. |
| `VAR-013` | Mapeamento binário direto. | não especificada | Idem. | não especificada | não especificada | “presença de áreas de preservação permanente”, 008:81–86. | “APP”, 009:57–62. | Mata ciliar em três estados, 011:172–180. | Escopo APP/mata ciliar, método, unidade e conversão binária/ternária. |
| `VAR-014` | Mapeamento categórico direto. | não especificada | Idem. | não especificada | não especificada | “nível de degradação da paisagem”, 008:81–86. | “degradação da paisagem”, 009:57–62. | Não localizada como procedimento próprio. | Definição, método, critérios, possível sobreposição, amostragem e ausência. |
| `VAR-015` | Fórmula linear declarada. | não especificada | Idem. | não especificada | não especificada | “declividade do terreno”, 008:94–99. | “declividade”, 009:64–68. | GPS ou observação e faixas, 011:184–195. | Método preferencial, instrumento/precisão, agregação da média, truncamento e conversão. |
| `VAR-016` | Mapeamento categórico direto. | não especificada | Idem. | não especificada | não especificada | “tipo de uso da terra”, 008:94–99. | “uso da terra”, 009:64–68. | Registro predominante e classes, 011:197–208. | Regra de predominância, área mínima, mosaicos, frequência e ausência. |
| `VAR-017` | Declara apenas normalização 0–1. | não especificada | Idem. | não especificada | não especificada | Não localizada; 008 usa “grau de intervenção antrópica”, 008:94–99. | Não localizada; 009 usa “organização espacial”, 009:64–68. | Não localizada. | Tipo, unidade original, método, instrumento, escala, faixa, direção, normalização, frequência e ausência. |

## Cobertura do protocolo de campo

A unidade amostral geral é a “unidade homogênea” ou unidade de paisagem, avaliada separadamente (`FATO_DOCUMENTADO`, 011:36–53). O número de unidades, pontos e repetições é `NAO_ESPECIFICADO`. A planilha é o mecanismo geral de registro (011:210–221), mas não constitui, por si, controle de qualidade. Frequência, tratamento de impossibilidade de coleta e controle de qualidade são `NAO_ESPECIFICADO` para todas as variáveis.

| VAR | Nome/dimensão | Procedimento localizado | Unidade no protocolo | Instrumento | Unidade amostral e desenho | Frequência/impossibilidade/QC | Evidência | Estado |
|---|---|---|---|---|---|---|---|---|
| `VAR-001` | tipo de fonte hídrica / hídrica | Registrar a principal fonte utilizada e classificá-la. | Categorias; unidade não nomeada. | Planilha; instrumento específico não declarado. | Unidade de paisagem; divisão geral 011:36–53. | Todos não especificados; registro em planilha 011:210–221. | 011:57–67. | `COBERTA_EXPLICITAMENTE` |
| `VAR-002` | presença de nascente / hídrica | Não localizado após leitura integral. | não especificada | não especificado | Desenho geral apenas. | não especificados | Menções a “nascente” em 011:63 e recuperação em 011:268 não medem presença na área. | `NAO_LOCALIZADA` |
| `VAR-003` | profundidade do poço / hídrica | Medir profundidade aproximada e classificar por faixas. | m | não especificado | Unidade de paisagem; aplicabilidade quando houver poço não declarada. | não especificados | 011:69–79. | `COBERTA_EXPLICITAMENTE` |
| `VAR-004` | disponibilidade hídrica / hídrica | Não localizado após leitura integral. | não especificada | não especificado | Desenho geral apenas. | não especificados | A seção hídrica 011:55–97 não contém regularidade anual/permanente/sazonal/escassa. | `NAO_LOCALIZADA` |
| `VAR-005` | indícios de salinização / hídrica | Avaliar água por gosto salobro, manchas brancas e vegetação sensível; classificar. | Categorias; unidade não nomeada. | não especificado | Unidade de paisagem; ponto/volume de água não especificado. | não especificados | 011:81–97. | `COBERTA_EXPLICITAMENTE` |
| `VAR-006` | taxa de infiltração / pedológica | Inserir anel, adicionar volume conhecido e medir tempo; estimar mm/h. | mm/h | infiltrômetro simples/anel; água e cronômetro não listados explicitamente. | Unidade de paisagem; pontos e repetições não especificados. | não especificados | 011:23–35, 101–115. | `COBERTA_EXPLICITAMENTE` |
| `VAR-007` | compactação do solo / pedológica | Avaliar resistência pela inserção do trado, endurecimento e crosta; classificar. | Condições e valores 0.2/0.6/0.9. | trado ou pá; o indicador menciona trado. | Unidade de paisagem; pontos e repetições não especificados. | não especificados | 011:23–35, 117–133. | `COBERTA_EXPLICITAMENTE` |
| `VAR-008` | textura do solo / pedológica | Não localizado como medição; “tipo de solo” só estratifica unidades. | não especificada | trado ou pá têm finalidade geral de observar solo, sem método de textura. | Unidade de paisagem geral. | não especificados | 011:23–35, 46–53; ausência na coleta 011:99–146. | `NAO_LOCALIZADA` |
| `VAR-009` | erosão / pedológica | Identificar processos e classificar ausência, laminar, sulcos ou voçoroca. | Categorias; unidade não nomeada. | observação; instrumento não declarado. | Unidade de paisagem; extensão/pontos não especificados. | não especificados | 011:135–146. | `COBERTA_EXPLICITAMENTE` |
| `VAR-010` | solo exposto / pedológica | Não há procedimento percentual; “solo exposto” é classe de uso territorial. | Classe de uso, não %. | não especificado | Unidade de paisagem; uso predominante. | não especificados | 011:197–208 versus 007:40. | `AMBIGUA` |
| `VAR-011` | cobertura vegetal / vegetação | Estimar percentual, por método visual ou por amostragem, e classificar. | % | observação; câmera/celular disponível, sem vinculação metodológica explícita. | Unidade de paisagem; desenho de amostragem não especificado. | não especificados | 011:23–35, 150–160. | `COBERTA_EXPLICITAMENTE` |
| `VAR-012` | fragmentação da vegetação / vegetação | Avaliar continuidade e classificar contínua, fragmentada ou muito fragmentada. | Categorias; unidade não nomeada. | não especificado | Unidade de paisagem; extensão espacial não especificada. | não especificados | 011:162–170. | `COBERTA_EXPLICITAMENTE` |
| `VAR-013` | presença de APP / vegetação | Avaliar proteção por mata ciliar como preservada, parcialmente degradada ou ausente. | Categorias ternárias, não binária. | observação; instrumento não declarado. | Cursos d’água/unidade de paisagem; desenho não especificado. | não especificados | 011:172–180 versus 007:54. | `COBERTA_PARCIALMENTE` |
| `VAR-014` | degradação da paisagem / vegetação | Não localizado como procedimento próprio. | não especificada | não especificado | Desenho geral apenas. | não especificados | A coleta de vegetação 011:148–180 não contém nível geral de degradação. | `NAO_LOCALIZADA` |
| `VAR-015` | declividade / territorial | Estimar por aplicativo GPS ou observação do relevo e classificar. | % | aplicativo GPS ou observação; GPS/celular listado. | Unidade de paisagem; pontos/média não especificados. | não especificados | 011:23–35, 184–195. | `COBERTA_EXPLICITAMENTE` |
| `VAR-016` | uso da terra / territorial | Registrar uso predominante e classificar. | Categorias; unidade não nomeada. | observação/planilha; instrumento específico não declarado. | Unidade de paisagem; regra de predominância não especificada. | não especificados | 011:197–208. | `COBERTA_EXPLICITAMENTE` |
| `VAR-017` | densidade de drenagem / territorial | Não localizado após leitura integral. | não especificada | não especificado | Desenho geral apenas. | não especificados | A coleta territorial 011:182–208 contém apenas declividade e uso. | `NAO_LOCALIZADA` |

### Síntese da cobertura

| Estado | Quantidade |
|---|---:|
| `COBERTA_EXPLICITAMENTE` | 10 |
| `COBERTA_PARCIALMENTE` | 1 |
| `NAO_LOCALIZADA` | 5 |
| `NAO_APLICAVEL_DECLARADO` | 0 |
| `AMBIGUA` | 1 |
| **Total** | **17** |

`NAO_LOCALIZADA` significa apenas ausência de procedimento correspondente nas 272 linhas do protocolo, não inexistência de método fora do corpus.

### Procedimentos sem variável correspondente na matriz

| ID | Procedimento | Localizador | Relação com variáveis | Observação |
|---|---|---|---|---|
| `FIELD-001` | Delimitar área, registrar coordenadas, dividir em unidades homogêneas e avaliar cada unidade separadamente. | 011:36–53 | Desenho transversal para todas as variáveis; não é uma variável de 007. | Critérios de estratificação são uso, solo, cobertura e relevo; número de unidades/pontos e agregação não especificados. |
| `FIELD-002` | Registrar todos os dados em planilha. | 011:210–221 | Registro transversal; não é uma variável de 007. | O exemplo contém infiltração, cobertura, compactação e uso; não define esquema completo nem controle de qualidade. |

Foram inventariados 13 procedimentos de campo/registro: os 11 procedimentos de variáveis nomeados nas seções 5 a 8, mais `FIELD-001` e `FIELD-002`. Cálculo, classificação, interpretação e recomendações das seções 10 a 13 são saídas/processos posteriores, não procedimentos de coleta; os tópicos matemáticos foram encaminhados à Etapa 5.

## Rastreabilidade conceitual

As 17 cadeias abaixo são contratos de auditoria, não contratos científicos. A ligação entre documentos por semelhança nominal é `INFERENCIA`, pois as fontes não declaram que o protocolo implementa a matriz.

| Cadeia | Elementos e fontes/localizadores | Ligações explícitas | Ligações inferidas | Quebra de rastreabilidade | Validação necessária |
|---|---|---|---|---|---|
| `CHAIN-001` | disponibilidade/qualidade hídrica (008:49–61) → `DIM-001` → `VAR-001` (007:20) → registro da fonte (011:57–67) | Dimensão–variável explícita em 007/008; procedimento nomeado em 011. | Variável–procedimento transversal. | Critério de fonte “principal”, unidade e correspondência número/classe. | Científica e protocolar. |
| `CHAIN-002` | disponibilidade hídrica/nascentes (009:43–48) → `DIM-001` → `VAR-002` (007:21) → método não localizado | Dimensão–variável explícita em 007/008. | Conceito–variável entre fontes. | Ausência de procedimento, método e critério de presença. | Científica e protocolar. |
| `CHAIN-003` | condição hídrica/poços (009:43–48) → `DIM-001` → `VAR-003` (007:22) → profundidade aproximada (011:69–79) | Dimensão–variável e procedimento em suas fontes. | Correspondência transversal. | Instrumento, precisão, ausência de poço e conversão fórmula/faixas. | Científica; matemática na Etapa 5. |
| `CHAIN-004` | disponibilidade ao longo do ano (008:53–59) → `DIM-001` → `VAR-004` (007:23) → método não localizado | Conceito/dimensão/variável explícitos. | Nenhuma ligação de campo. | Janela temporal, método, frequência e protocolo ausentes. | Científica e protocolar. |
| `CHAIN-005` | salinização/recarga (007:24–28; 009:43–48) → `DIM-001` → `VAR-005` → avaliação por indicadores (011:81–97) | Associação à dimensão e procedimento explícitos em cada fonte. | Equivalência “indícios”/“salinização”. | Confirmação, instrumento, ponto de coleta e conversão de classes. | Científica e protocolar. |
| `CHAIN-006` | infiltração/armazenamento (008:23–27) → `DIM-002` → `VAR-006` (007:36) → anel (011:101–115) | Relações conceito–dimensão–variável e procedimento explícitas. | Correspondência documental transversal. | Parâmetros, repetições, agregação e conversão fórmula/faixas. | Científica; matemática na Etapa 5. |
| `CHAIN-007` | compactação → menor infiltração (007:42–44) → `DIM-002` → `VAR-007` → resistência/indicadores (011:117–133) | Relação ecológica e variável explícitas; procedimento explícito. | Correspondência transversal. | Limiares, pontos/repetições e instrumento decisório. | Científica e protocolar. |
| `CHAIN-008` | estrutura/armazenamento do solo (008:63–75) → `DIM-002` → `VAR-008` (007:38) → método não localizado | Dimensão–variável explícita. | Função da textura no processo é `INFERENCIA` no corpus. | Método, classes, amostragem e protocolo. | Científica e protocolar. |
| `CHAIN-009` | degradação/escoamento (008:29–36) → `DIM-002` → `VAR-009` (007:39) → identificação de erosão (011:135–146) | Erosão associada à dimensão; procedimento explícito. | Conceito–variável e correspondência transversal. | Extensão/severidade, unidade e correspondência sulcos/voçoroca. | Científica e protocolar. |
| `CHAIN-010` | exposição/degradação do solo (008:67–75) → `DIM-002` → `VAR-010` (007:40) → método percentual não localizado | Dimensão–variável explícita em 007; exposição em 008. | Equivalência “grau de exposição”/“solo exposto”. | Protocolo usa o termo como classe de `VAR-016`, não como percentual. | Científica e protocolar. |
| `CHAIN-011` | cobertura → infiltração (009:102–108) → `DIM-003` → `VAR-011` (007:52) → estimativa visual/amostral (011:150–160) | Relação ecológica, variável e procedimento explícitos. | Correspondência transversal. | Escolha/desenho do método e conversão fórmula/faixas. | Científica; matemática na Etapa 5. |
| `CHAIN-012` | organização da paisagem (008:77–88) → `DIM-003` → `VAR-012` (007:53) → continuidade (011:162–170) | Dimensão–variável e procedimento explícitos. | Equivalência fragmentação/continuidade. | Unidade espacial, limiares e conversão entre vocabulários. | Científica e protocolar. |
| `CHAIN-013` | proteção do solo/cursos d’água (007:57–59; 011:172–180) → `DIM-003` → `VAR-013` (007:54) → estado da mata ciliar | Associação dimensional e procedimento explícitos. | Equivalência parcial APP/mata ciliar. | Escopo e conversão binária/ternária. | Científica e protocolar. |
| `CHAIN-014` | degradação ecológica/paisagem (009:16–23, 57–62) → `DIM-003` → `VAR-014` (007:55) → método não localizado | Conceito e variável presentes. | Relação entre degradação ecológica e variável geral. | Definição, sobreposição, método e protocolo. | Científica e protocolar. |
| `CHAIN-015` | declividade → escoamento (009:118–120) → `DIM-004` → `VAR-015` (007:67) → GPS/observação (011:184–195) | Relação ecológica, variável e métodos explícitos. | Correspondência transversal. | Método preferencial, precisão, média espacial e conversão fórmula/faixas. | Científica; matemática na Etapa 5. |
| `CHAIN-016` | uso → degradação do solo (009:114–116) → `DIM-004` → `VAR-016` (007:68) → uso predominante (011:197–208) | Relação, variável e procedimento explícitos. | Correspondência transversal. | Regra de predominância, mosaicos e conversão número/classe. | Científica e protocolar. |
| `CHAIN-017` | contexto territorial (008:90–100) → `DIM-004` → `VAR-017` (007:69) → método não localizado | Dimensão–variável explícita apenas em 007. | Drenagem como expressão do contexto territorial. | 008/009 nomeiam terceiros elementos diferentes; tipo, método, direção e protocolo ausentes. | Científica e protocolar. |

Resultado: 17 cadeias; nenhuma é integralmente explícita entre todos os documentos. Doze alcançam algum procedimento nomeado (incluindo a cobertura parcial/ambígua), e cinco terminam em `NAO_LOCALIZADA`; todas possuem pelo menos uma ligação transversal inferida ou uma quebra.

## Coerência interna de cada documento

| Fonte | Verificações e alinhamentos internos | Divergências, ambiguidades ou lacunas internas localizadas | Achados relacionados |
|---|---|---|---|
| `DOC-RAW-007` | Mantém quatro dimensões da abertura à fórmula; enumera 5+5+4+3 = 17 variáveis; usa direção geral de maior valor = maior risco; linhas 5–12, 14–90. | Fórmulas de profundidade/infiltração não declaram limites e podem sair de 0–1 para entradas não delimitadas; declividade não declara limite em 45%; densidade de drenagem não define regra/direção; intervalos de classe deixam valores contínuos entre 0.25 e 0.26 etc.; “solo exposto” também é classe de uso; linhas 22, 36, 40, 67–69, 92–99. | `SCI-FND-006`, `010`, `012` |
| `DOC-RAW-008` | Mantém quatro dimensões, enumera 5+5+4+3 fatores e explicita direção 0–1; linhas 38–121. A expressão “média ponderada” é seguida de pesos equivalentes e fórmula de média simples, o que é matematicamente compatível dentro da própria fonte. | “qualidade” entra na função hídrica sem variável de qualidade além de indícios de salinização; “grau de intervenção antrópica” aparece como terceiro fator territorial, mas sem definição/método; métodos, unidades, fontes e dados faltantes não são descritos; linhas 49–61, 90–100. | `SCI-FND-003`, `017` |
| `DOC-RAW-009` | O sistema mantém quatro componentes/dimensões e uma sequência coerente de dados → normalização → dimensões → índice → classe → diagnóstico → recomendações; linhas 5–90, 124–160. Quatro relações ecológicas são explicitadas; linhas 102–122. | “clima regional” e “precipitação” aparecem como entradas externas sem papel operacional; “organização espacial” não é definida; diagnóstico alterna “hidroambiental” e “territorial”; o fluxo não informa variáveis, unidades, métodos nem quebras; linhas 29–90, 124–160. | `SCI-FND-015`, `020` |
| `DOC-RAW-011` | Organiza a coleta pelas quatro áreas temáticas, declara divisão em unidades homogêneas e fornece 11 procedimentos nomeados; linhas 36–209. As faixas internas de profundidade, infiltração, cobertura e declividade cobrem os limites inteiros apresentados. | A alegação de procedimentos padronizados não é acompanhada de número de pontos/repetições, agregação, periodicidade, impossibilidade, dados faltantes ou QC; métodos alternativos não têm critério de escolha; o intervalo contínuo do IHFR tem lacunas; normalização não é especificada; linhas 5–9, 36–53, 69–97, 101–209, 223–247. | `SCI-FND-007`, `008`, `009`, `012` |

Não foi localizada seção que se contradiga internamente de modo a atender aos quatro critérios de `CONFLITO_DOCUMENTAL`. As incompatibilidades formais identificadas são transversais.

## Comparação transversal

| Aspecto | Resultado documental | Classificação/encaminhamento |
|---|---|---|
| Nomes e quantidade de dimensões | Quatro em todas; nomes variam entre condição/componente/dimensão e entre vegetação/vegetação e paisagem. | Alinhamento com variação lexical; `SCI-FND-001`. |
| Conceitos e processos | Infiltração, armazenamento/retensão, cobertura e escoamento são recorrentes; evapotranspiração e resiliência aparecem apenas em 008; clima/precipitação como entrada apenas em 009. | Alinhamento parcial e `NAO_COMPARAVEL`; `SCI-FND-016`, `020`. |
| Lista de variáveis | 007 declara 17; 008 acompanha 14 hídricas/pedológicas/vegetação, mas troca o terceiro territorial; 009 usa rótulos conceituais; 011 possui 11 procedimentos nomeados. | Divergência/lacuna; `SCI-FND-003`, `004`. |
| Associação variável–dimensão | Coerente para os itens comuns; “solo exposto” é pedológico em 007 e categoria territorial de uso em 011; APP/mata ciliar varia. | Ambiguidade/divergência; `SCI-FND-005`, `006`. |
| Definições | 007 traz descrições curtas; 008/009 funções conceituais; 011 instruções; não há glossário comum. | Ambiguidade lexical; `SCI-FND-015`. |
| Unidades | 007 fornece unidade para todas as linhas, embora “índice” e categorias não sejam operacionais; 011 explicita m, mm/h e % em parte dos procedimentos. | Lacuna de correspondência e método; `SCI-FND-008`. |
| Métodos | Apenas 011 descreve métodos de campo; vários são breves ou alternativos e cinco variáveis não têm método localizado. | Lacuna; `SCI-FND-004`, `007`, `008`. |
| Instrumentos | 011 lista GPS/celular, trado/pá, anel, fita, câmera/celular e planilha; nem todos são vinculados a cada procedimento e itens necessários ao teste não são listados. | Lacuna; `SCI-FND-008`. |
| Escalas de risco | 007 mapeia categorias/números e fórmulas; 011 usa rótulos/limiares e poucos valores diretos; 008/009 focam escala final. | Divergência, Etapa 5; `SCI-FND-010`. |
| Periodicidade | Não especificada por variável/procedimento em nenhuma fonte; 008/009 só citam monitoramento temporal futuro. | Lacuna; `SCI-FND-009`. |
| Direção interpretativa | 007 e 008 afirmam maior valor = maior risco; 011 usa baixo→crítico, mas não define conversão completa; densidade de drenagem não tem direção. | Divergência/lacuna; `SCI-FND-010`. |
| Normalização | 007 detalha mapeamentos/fórmulas; 008 normaliza dimensões; 009 inclui etapa; 011 afirma sem método. | `ENCAMINHAR_ETAPA_5`; `SCI-FND-010`, `019`. |
| Dados faltantes | Não especificados por variável, protocolo ou cálculo. | Bloqueante para normatização; `SCI-FND-009`; Etapa 5 quanto ao cálculo. |
| Aplicabilidade espacial | 007: propriedade, assentamento, bacia, município; 008/009: paisagens rurais/contextos diversos; 011: Maranhão/Baixo Itapecuru e propriedade/comunidade/microbacia. | Ambiguidade/divergência; `SCI-FND-013`, `014`. |
| Tratamento de campo | 011 define unidades homogêneas e 11 procedimentos; relação com a matriz não é declarada e agregação não existe. | Lacuna de rastreabilidade; `SCI-FND-004`, `007`. |
| Controle de qualidade | Câmera e planilha são listadas, mas não há critérios de calibração, conferência, repetição, validação ou rejeição. | Lacuna; `SCI-FND-009`. |
| Dependências externas | 007/008 citam validação/calibração futura; 008/009 citam campo, georreferenciamento e integrações futuras; 011 depende de equipamentos simples. | Dependências sem documentos nomeados; metadados/fontes ausentes em `SCI-FND-017`; calibração na Etapa 5. |

## Registro de achados

| ID | Tipo | Assunto e descrição neutra | Fontes/localizadores e evidência | Classificação | Impacto | Efeito sobre rastreabilidade/normatização | Autoridade necessária | Encaminhamento | Estado |
|---|---|---|---|---|---|---|---|---|---|
| `SCI-FND-001` | `ALINHAMENTO_DOCUMENTAL` | Estrutura em quatro dimensões. As quatro fontes organizam ou operacionalizam os mesmos quatro domínios gerais. | 007:5–10, 14–73; 008:38–100; 009:7–14, 43–68; 011:55–208. Evidência: recorrência explícita de hídrica, solo, vegetação/paisagem e território. | `FATO_DOCUMENTADO` | `INFORMATIVO` | Sustenta uma espinha dorsal comum, sem validar composição ou nomes. | Científica (`PD-002`) para uso normativo. | Preservar como alinhamento e submeter a validação futura. | `INFORMATIVO` |
| `SCI-FND-002` | `ALINHAMENTO_DOCUMENTAL` | Núcleo hídrico, pedológico e de vegetação. As enumerações de 008 e 009 cobrem conceitualmente as 14 variáveis dessas três dimensões de 007, com variações lexicais; 011 cobre apenas parte operacionalmente. | 007:18–55; 008:53–86; 009:43–62; 011:55–180. Evidência: nomes/descrições correspondentes, sem declaração de equivalência documental. | `INFERENCIA` | `INFORMATIVO` | Permite confronto, mas não prova derivação, identidade ou aprovação. | Científica. | Manter equivalências propostas rotuladas; validar termo a termo. | `INFORMATIVO` |
| `SCI-FND-003` | `DIVERGENCIA_DOCUMENTAL` | Composição territorial. 007 usa densidade de drenagem; 008 usa intervenção antrópica; 009 usa organização espacial; 011 mede apenas declividade e uso. | 007:65–69; 008:94–99; 009:64–68; 011:182–208. Evidência: terceiros itens diferentes sob a mesma dimensão/aplicabilidade geral. | `FATO_DOCUMENTADO` | `BLOQUEANTE_PARA_NORMATIZACAO` | Impede lista normativa única e quebra `CHAIN-017`. Não é conflito estrito porque as listas podem ser complementares. | Científica (`PD-002`). | Pergunta `SCI-Q-001`; não escolher item. | `AGUARDANDO_VALIDACAO_CIENTIFICA` |
| `SCI-FND-004` | `LACUNA` | Cobertura incompleta do protocolo. Presença de nascente, disponibilidade hídrica, textura, degradação da paisagem e densidade de drenagem não têm procedimento localizado. | 007:21, 23, 38, 55, 69; ausência nas seções 011:55–209. Evidência: busca integral resultou em cinco `NAO_LOCALIZADA`. | `NAO_ESPECIFICADO` | `BLOQUEANTE_PARA_NORMATIZACAO` | Cinco cadeias não alcançam método; não prova inexistência externa. | Científica/protocolo (`PD-002`). | Pergunta `SCI-Q-002`; declarar aplicabilidade ou método futuro. | `AGUARDANDO_VALIDACAO_CIENTIFICA` |
| `SCI-FND-005` | `DIVERGENCIA_DOCUMENTAL` | APP versus mata ciliar. 007 define presença binária de “mata ciliar ou APP”; 011 avalia mata ciliar em três estados; 008/009 usam APP. | 007:54; 008:81–86; 009:57–62; 011:172–180. Evidência: escopo lexical e cardinalidade distintos. | `FATO_DOCUMENTADO` | `ALTO` | A conversão e a cobertura de `VAR-013` não são rastreáveis integralmente. | Científica. | Pergunta `SCI-Q-003`; não unificar silenciosamente. | `AGUARDANDO_VALIDACAO_CIENTIFICA` |
| `SCI-FND-006` | `AMBIGUIDADE` | “Solo exposto” é variável pedológica percentual em 007 e categoria de uso territorial em 007/011. | 007:40 e 68; 011:197–208. Evidência: mesmo termo em papéis e unidades diferentes. | `FATO_DOCUMENTADO` | `ALTO` | Pode causar duplicação de entrada ou mapeamento incorreto; não foi classificado como `DUPLICIDADE` porque os papéis podem ser distintos. | Científica. | Pergunta `SCI-Q-004`; definir distinção/equivalência. | `AGUARDANDO_VALIDACAO_CIENTIFICA` |
| `SCI-FND-007` | `LACUNA` | Desenho amostral e agregação. O protocolo manda dividir em unidades homogêneas e avaliar separadamente, mas não declara número/localização de pontos, repetições nem como produzir valor de unidade/propriedade. | 011:36–53 e procedimentos 55–209. Evidência: instrução geral sem parâmetros/agrupamento. | `NAO_ESPECIFICADO` | `BLOQUEANTE_PARA_NORMATIZACAO` | Métodos não são reprodutíveis documentalmente e valores de dimensão não têm origem amostral definida. | Científica/protocolo. | Pergunta `SCI-Q-005`. | `AGUARDANDO_VALIDACAO_CIENTIFICA` |
| `SCI-FND-008` | `LACUNA` | Suficiência de métodos e instrumentos. Profundidade é aproximada sem instrumento; salinização não define confirmação; cobertura e declividade oferecem alternativas sem critério; infiltração omite parâmetros/repetições. | 011:23–35, 69–115, 150–160, 184–195. Evidência: instruções parciais e alternativas abertas. | `NAO_ESPECIFICADO` | `ALTO` | Limita reprodutibilidade e comparabilidade de `VAR-003`, `005`, `006`, `011` e `015`. | Científica/protocolo. | Pergunta `SCI-Q-006`; métodos externos não foram inventados. | `AGUARDANDO_VALIDACAO_CIENTIFICA` |
| `SCI-FND-009` | `LACUNA` | Temporalidade, impossibilidade, dados faltantes e controle de qualidade não são especificados. | 007:18–69, 008:49–121, 009:124–160, 011:36–225. Evidência: nenhuma regra localizada; planilha 011:210–221 é apenas registro. | `NAO_ESPECIFICADO` | `BLOQUEANTE_PARA_NORMATIZACAO` | Impede protocolo normativo e deixa cálculo sem política de ausência. | Científica; matemática na Etapa 5 para ausências no cálculo. | Pergunta `SCI-Q-007`; parte matemática em `E5-006`. | `AGUARDANDO_VALIDACAO_CIENTIFICA` |
| `SCI-FND-010` | `DIVERGENCIA_DOCUMENTAL` | Transformações de variáveis. 007 usa números/fórmulas 0–1; 011 usa classes/limiares para a maioria e não define conversão comum; 008 normaliza dimensões; 009 apenas nomeia a etapa. | 007:12, 18–69; 008:102–121; 009:124–148; 011:55–225. Evidência: unidades normalizadas e regras em níveis diferentes. | `FATO_DOCUMENTADO` | `BLOQUEANTE_PARA_NORMATIZACAO` | A cadeia variável→dimensão não possui regra única rastreável. | Científica (`PD-002`). | Pergunta `SCI-Q-008`; `E5-003`; sem análise conclusiva aqui. | `ENCAMINHADO_ETAPA_5` |
| `SCI-FND-011` | `DIVERGENCIA_DOCUMENTAL` | Composição por pesos. 007 declara a média simples $IHFR = (H + S + V + T)/4$; 008 declara pesos equivalentes e apresenta a mesma fórmula; 011 declara pesos diferenciais $IHFR = 0{,}35H + 0{,}30S + 0{,}25V + 0{,}10T$. A equivalência entre a média simples de quatro dimensões e pesos individuais de $0{,}25$ é `INFERENCIA` matemática, não declaração literal de 007. As fórmulas são diferentes e podem produzir resultados distintos; o recorte regional explícito de 011 pode explicar a diferença, mas nenhuma fonte declara como a formulação regional se relaciona à formulação geral. | 007:75–90; 008:102–121; 011:5–21, 223–238. `FATO_DOCUMENTADO`: fórmulas, declarações literais e recorte regional de cada fonte. `INFERENCIA`: os esquemas equivalente e diferencial podem produzir resultados distintos, e a delimitação regional pode explicar a diferença sem definir a relação entre os escopos. | `FATO_DOCUMENTADO` + `INFERENCIA` comparativa | `BLOQUEANTE_PARA_NORMATIZACAO` | Nenhuma fórmula pode ser promovida sem decisão da autoridade científica; afeta o resultado integral e mantém ambígua a aplicabilidade geral–regional. | Científica (`PD-002`). | Pergunta `SCI-Q-009`; `E5-001`/`E5-002`. | `ENCAMINHADO_ETAPA_5` |
| `SCI-FND-012` | `AMBIGUIDADE` | Intervalos contínuos. Todas as tabelas saltam de 0.25 para 0.26, de 0.50 para 0.51 e de 0.75 para 0.76, sem arredondamento declarado. | 007:92–99; 008:123–132; 011:240–247; 009 fornece classes sem intervalos, 162–171. Evidência: valores intermediários possíveis numa escala contínua ficam sem classe. | `FATO_DOCUMENTADO` + `INFERENCIA` quanto ao efeito | `ALTO` | Classificação não é total sem regra de precisão/arredondamento. | Científica. | Pergunta `SCI-Q-010`; `E5-004`/`E5-005`. | `ENCAMINHADO_ETAPA_5` |
| `SCI-FND-013` | `AMBIGUIDADE` | Aplicabilidade geográfica. 007/008/009 apresentam uso amplo; 011 declara Maranhão e foco no Baixo Itapecuru. | 007:110–117; 008:136–146; 009:203–222; 011:5–21. Evidência: escopo geral versus protocolo regional. | `FATO_DOCUMENTADO` | `BLOQUEANTE_PARA_NORMATIZACAO` | Não está definido se métodos/classes são gerais, regionais ou exemplo local. | Científica. | Pergunta `SCI-Q-011`; relação regional em `E5-008`. | `AGUARDANDO_VALIDACAO_CIENTIFICA` |
| `SCI-FND-014` | `DIVERGENCIA_DOCUMENTAL` | Escalas de aplicação. 007 lista propriedade, assentamento, bacia e município; 011 lista propriedade, comunidade e microbacia; 008/009 usam contextos mais gerais. | 007:110–117; 008:136–146; 009:203–222; 011:11–21. Evidência: enumerações não idênticas. | `FATO_DOCUMENTADO` | `MEDIO` | Exige distinguir equivalências e limites, mas listas podem ser complementares. | Científica e, futuramente, produto/escopo institucional. | Integrar à `SCI-Q-011`; não tratar ausência como erro. | `AGUARDANDO_VALIDACAO_CIENTIFICA` |
| `SCI-FND-015` | `AMBIGUIDADE` | Variações do léxico: risco/vulnerabilidade; seca/escassez funcional; capacidade funcional/hidroecológica; diagnóstico ambiental/hidroambiental/territorial. | 007:101–108; 008:13–36, 150–160; 009:16–23, 25–40, 74–90, 124–160; 011:249–258. | `INFERENCIA` | `MEDIO` | Pode gerar conceitos normativos distintos ou equivalências não autorizadas. | Científica; produto/dados para termos de domínio futuro. | Pergunta `SCI-Q-012`; glossário candidato futuro. | `AGUARDANDO_VALIDACAO_CIENTIFICA` |
| `SCI-FND-016` | `ALINHAMENTO_DOCUMENTAL` | Relações ecológicas centrais. Cobertura→infiltração, infiltração→armazenamento, uso→degradação e declividade→escoamento são explicitadas em 009 e apoiadas textualmente em 007/008. | 009:102–122; 007:42–44, 57–59, 71–73; 008:75, 79–100. | `FATO_DOCUMENTADO` para cada declaração; `INFERENCIA` para alinhamento entre fontes | `INFORMATIVO` | Dá coerência conceitual às cadeias, sem provar causalidade científica externa. | Científica para validação. | Preservar como alinhamento documental. | `INFORMATIVO` |
| `SCI-FND-017` | `LACUNA` | Proveniência e base científica. As quatro fontes não declaram origem, versão documental, data, responsável, bibliografia ou aprovação; 007/008 mencionam validação/calibração futura. | Registros de `DOC-RAW-007/008/009/011`; 007:126–134; 008:162–171. Evidência: metadados do baseline e ausência nas fontes. | `NAO_ESPECIFICADO` | `ALTO` | Limita autoridade, reprodutibilidade e vínculo com evidência científica. | Equipe e responsáveis científicos. | Preservar sob `GAP-001`/`PD-002`; não criar pendência duplicada. | `ABERTO` |
| `SCI-FND-018` | `PENDENCIA_DE_VALIDACAO_CIENTIFICA` | Nenhuma regra, variável, método, classe ou relação deste corpus possui validação científica registrada pela autoridade designada. | `SOURCE_AUTHORITY.md`; `PD-002`; estados históricos de `DOC-RAW-007/008/009/011`. | `PENDENCIA_DE_DECISAO` | `BLOQUEANTE_PARA_NORMATIZACAO` | Todos os resultados são analíticos e não podem atualizar normas. | Responsáveis científicos a designar em `PD-002`. | Aguardar validação; não resolver `PD-002`. | `AGUARDANDO_VALIDACAO_CIENTIFICA` |
| `SCI-FND-019` | `ENCAMINHAR_ETAPA_5` | Fórmula, pesos, normalização, faixas, arredondamento, ausências no cálculo, calibração e transformação algorítmica aparecem nas fontes, mas pertencem à Etapa 5. | 007:12, 18–99, 126–134; 008:102–132, 162–171; 009:124–160; 011:223–258. | `FATO_DOCUMENTADO` | `ALTO` | Delimita o ponto de parada e evita conclusão matemática prematura. | Científica; auditoria da Etapa 5. | `E5-001` a `E5-010`. | `ENCAMINHADO_ETAPA_5` |
| `SCI-FND-020` | `NAO_COMPARAVEL` | Clima/precipitação, evapotranspiração e resiliência aparecem como fatores/processos conceituais sem variável ou procedimento correspondente nas outras fontes. | 008:23–36; 009:29–39; ausência em 007 e 011 como variáveis/procedimentos. | `FATO_DOCUMENTADO` + `NAO_ESPECIFICADO` | `MEDIO` | A ausência não é erro automático; o papel desses elementos na fronteira do índice não está definido. | Científica. | Avaliar futuramente se são contexto, entrada, processo ou fora de escopo; sem nova pendência agora. | `INFORMATIVO` |

### Teste de divergência e critério de conflito documental

Nenhum achado da Etapa 4 satisfaz simultaneamente os quatro critérios de `CONFLITO_DOCUMENTAL`. Em `SCI-FND-011`:

1. as fontes tratam do mesmo conceito geral: composição/fórmula do IHFR;
2. `FATO_DOCUMENTADO`: 007 declara média simples, 008 declara pesos equivalentes e a mesma fórmula, e 011 declara pesos diferenciais;
3. o critério estrito de ausência de delimitação conciliadora não é satisfeito, pois 011 declara escopo para o Maranhão, com foco no Baixo Itapecuru, em 011:5–21; esse recorte regional explícito pode explicar a diferença, ainda que não determine a relação entre os escopos;
4. `INFERENCIA` matemática: a média simples de quatro dimensões equivale a pesos individuais de 0.25 e os esquemas equivalente e diferencial podem produzir resultados distintos; há localizadores verificáveis em 007:75–90, 008:102–121 e 011:223–238.

`SCI-FND-011` permanece, portanto, como `DIVERGENCIA_DOCUMENTAL` bloqueante para normatização. A relação geral–regional continua ambígua e depende da autoridade científica vinculada a `PD-002`; nenhuma formulação foi escolhida, validada, promovida, nem caracterizada por inferência como substituta, especialização ou complemento da outra. Listas possivelmente complementares, ausências, outras variações de escopo e transformações não conciliadas conservaram suas classificações anteriores.

### Síntese quantitativa dos achados

| Tipo | Quantidade |
|---|---:|
| `ALINHAMENTO_DOCUMENTAL` | 3 |
| `DIVERGENCIA_DOCUMENTAL` | 5 |
| `CONFLITO_DOCUMENTAL` | 0 |
| `AMBIGUIDADE` | 4 |
| `LACUNA` | 5 |
| `DUPLICIDADE` | 0 |
| `NAO_COMPARAVEL` | 1 |
| `ENCAMINHAR_ETAPA_5` | 1 |
| `PENDENCIA_DE_VALIDACAO_CIENTIFICA` | 1 |
| **Total** | **20** |

| Impacto | Quantidade |
|---|---:|
| `BLOQUEANTE_PARA_NORMATIZACAO` | 8 |
| `ALTO` | 6 |
| `MEDIO` | 3 |
| `BAIXO` | 0 |
| `INFORMATIVO` | 3 |
| **Total** | **20** |

| Estado | Quantidade |
|---|---:|
| `ABERTO` | 1 |
| `AGUARDANDO_VALIDACAO_CIENTIFICA` | 11 |
| `ENCAMINHADO_ETAPA_5` | 4 |
| `INFORMATIVO` | 4 |
| **Total** | **20** |

Os oito achados bloqueantes para normatização são `SCI-FND-003`, `004`, `007`, `009`, `010`, `011`, `013` e `018`. “Bloqueante” não interrompe as próximas auditorias documentais; impede somente converter o assunto em norma antes de resolução pela autoridade.

## Perguntas para a autoridade científica

As perguntas não sugerem uma alternativa preferida e não resolvem `PD-002`.

| ID | Achado | Pergunta objetiva e alternativas documentadas | Por que a decisão é necessária | Documento normativo futuro afetado |
|---|---|---|---|---|
| `SCI-Q-001` | `SCI-FND-003` | Qual composição territorial deve ser validada diante das formas presentes: densidade de drenagem em 007, grau de intervenção antrópica em 008, organização espacial em 009 e somente declividade/uso em 011? | Define a lista e a cobertura da dimensão sem escolher silenciosamente entre fontes. | Modelo científico normativo e matriz normativa de variáveis. |
| `SCI-Q-002` | `SCI-FND-004` | Qual deve ser o tratamento protocolar de presença de nascente, disponibilidade hídrica, textura, degradação da paisagem e densidade de drenagem, que integram 007 mas não possuem procedimento localizado em 011? | Cinco cadeias terminam sem método, e o corpus não declara exclusão ou não aplicabilidade. | Matriz normativa de variáveis e protocolo normativo de campo. |
| `SCI-Q-003` | `SCI-FND-005` | Como devem ser relacionadas a presença binária de “mata ciliar ou APP” em 007, a “presença de áreas de preservação permanente” em 008, “APP” em 009 e os três estados de mata ciliar em 011? | É necessária para definir escopo, unidade e conversão sem equivalência presumida. | Glossário/modelo científico e matriz/protocolo normativos. |
| `SCI-Q-004` | `SCI-FND-006` | Como devem ser relacionados o percentual pedológico de “solo exposto” em 007 e a categoria territorial “solo exposto” do uso da terra em 007/011? | Evita dupla contagem ou perda de informação. | Matriz normativa de variáveis e futuro contrato matemático. |
| `SCI-Q-005` | `SCI-FND-007` | Para cada unidade homogênea, quantos pontos/repetições são necessários, como são selecionados e como os resultados são agregados em unidade, propriedade, comunidade ou microbacia? | Sem desenho/agrupamento, a coleta não é documentalmente reprodutível. | Protocolo normativo de campo e regras científicas de agregação. |
| `SCI-Q-006` | `SCI-FND-008` | Quais métodos e instrumentos devem ser aprovados para profundidade de poço, confirmação de salinização, infiltração, cobertura vegetal e declividade; quando 011 oferece alternativas, qual regra de escolha e precisão se aplica? | Métodos alternativos/parciais podem produzir dados não comparáveis. | Protocolo normativo e especificação de qualidade dos dados científicos. |
| `SCI-Q-007` | `SCI-FND-009` | Qual periodicidade se aplica, como registrar impossibilidade de coleta, quais controles de qualidade/recoleta são exigidos e como representar dados faltantes antes do cálculo? | Fecha lacunas transversais de validade e rastreabilidade do dado. | Protocolo normativo, matriz de variáveis e contrato matemático futuro. |
| `SCI-Q-008` | `SCI-FND-010` | Qual relação deve ser aprovada entre as fórmulas/mapeamentos 0–1 de 007, a normalização de dimensões em 008, a etapa de normalização em 009 e as faixas qualitativas de 011; em qual nível ocorre a normalização? | Define a cadeia variável→dimensão sem antecipar a análise matemática. | Contrato matemático e matriz normativa de variáveis; auditoria na Etapa 5. |
| `SCI-Q-009` | `SCI-FND-011` | A composição a validar usa a média simples declarada em 007, os pesos equivalentes explicitamente declarados com a mesma fórmula em 008 ou os pesos diferenciais H=0.35, S=0.30, V=0.25 e T=0.10 declarados em 011? Existe versão ou aplicabilidade distinta que reconcilie os esquemas? | Esclarece a divergência, a aplicabilidade, o versionamento e a relação entre modelo geral e regional, sem converter a equivalência matemática inferida para 007 em declaração literal nem escolher fórmula ou pesos por inferência. | Contrato matemático futuro; Etapa 5. |
| `SCI-Q-010` | `SCI-FND-012` | Como devem ser classificados valores entre os limites escritos (por exemplo 0.255), e qual precisão/arredondamento precede a classificação? | As faixas atuais não cobrem explicitamente toda a escala contínua. | Contrato matemático e regra normativa de classificação; Etapa 5. |
| `SCI-Q-011` | `SCI-FND-013`, `SCI-FND-014` | O protocolo e suas classes são específicos do Maranhão/Baixo Itapecuru ou aplicáveis ao escopo amplo de 007–009? Como se relacionam propriedade/assentamento/bacia/município com propriedade/comunidade/microbacia? | Define aplicabilidade geográfica e escalas sem tratar listas diferentes como erro. | Modelo científico, protocolo normativo e futuro modelo regional. |
| `SCI-Q-012` | `SCI-FND-015` | Quais equivalências terminológicas devem ser aprovadas entre risco e vulnerabilidade; seca e escassez funcional; capacidade funcional e hidroecológica; diagnóstico ambiental, hidroambiental e territorial? | Evita consolidar conceitos diferentes por semelhança lexical. | Glossário científico e modelo científico normativo. |

Quantidade: 12 perguntas, vinculadas a 13 achados relevantes (uma pergunta cobre um par de achados). Achados informativos, de metadados e a pendência geral `PD-002` não geraram perguntas redundantes.

## Encaminhamento para a Etapa 5

Esta seção registra presença e dependência, sem validar fórmula, peso, transformação ou resultado.

| ID | Fonte/localizador | Assunto | Relação com a Etapa 4 | Documentos a comparar na Etapa 5 | Impacto potencial | Limite |
|---|---|---|---|---|---|---|
| `E5-001` | 007:75–90; 008:102–121; 011:223–238 | Fórmula/composição matemática: média simples declarada em 007; pesos equivalentes e mesma fórmula declarados em 008; pesos diferenciais declarados em 011. | `SCI-FND-011`, `CHAIN-003/006/011/015/016`; equivalência média simples ↔ quatro pesos de 0.25 classificada como `INFERENCIA`. | `DOC-RAW-002`, `DOC-RAW-010`, `DOC-RAW-013`, além das fontes localizadas desta etapa | Altera integralmente o IHFR. | Sem conclusão sobre fórmula correta. |
| `E5-002` | 007:77–90, 126–134; 008:104–121; 011:5–21, 229–238 | Pesos equivalentes explicitamente declarados em 008 versus pesos diferenciais declarados em 011; 007 declara média simples, cuja equivalência a quatro pesos de 0.25 é `INFERENCIA`. | Divergência em `SCI-FND-011` e ambiguidade de aplicabilidade geral–regional; calibração futura mencionada. | `DOC-RAW-010`, `DOC-RAW-013`, `DOC-RAW-002` | Altera contribuição das dimensões e comparabilidade de versões. | Sem aprovação de peso. |
| `E5-003` | 007:12, 18–69; 008:121; 009:124–148; 011:223–225 | Normalização matemática | Divergência `SCI-FND-010` e observações de diversas variáveis. | `DOC-RAW-013`, `DOC-RAW-002`; confrontar com 007/008/009/011 | Define passagem de dado bruto a risco/dimensão. | Sem derivar regra ausente. |
| `E5-004` | 007:92–99; 008:123–132; 009:162–171; 011:240–247 | Faixas de classificação | Ambiguidade `SCI-FND-012`. | `DOC-RAW-013`, `DOC-RAW-002` e as quatro fontes atuais | Afeta classe e diagnóstico. | Sem reconciliar limites. |
| `E5-005` | Seções de classificação 007:92–99; 008:123–132; 011:240–247 | Arredondamento/precisão | Necessário para `SCI-Q-010`; não especificado nas seções. | `DOC-RAW-013`, `DOC-RAW-002` | Pode fechar ou ampliar lacunas de fronteira. | Registrar ausência, sem propor regra. |
| `E5-006` | Cálculo em 007:75–90; 008:102–121; 009:124–160; 011:223–238 | Dados faltantes no cálculo | Lacuna `SCI-FND-009`; nenhuma regra localizada. | `DOC-RAW-013`, `DOC-RAW-002`, possivelmente `DOC-RAW-005` apenas na etapa autorizada correspondente | Pode impedir cálculo ou alterar denominadores/agregação. | Sem preencher dados ausentes. |
| `E5-007` | 007:126–134; 008:162–171; metadados registrados de `DOC-RAW-010` | Calibração regional | Fontes atuais tratam calibração como futura; `SCI-FND-013`. | `DOC-RAW-010`, `DOC-RAW-013`, `DOC-RAW-002` | Pode alterar pesos, faixas e aplicabilidade. | `DOC-RAW-010` não foi lido profundamente nesta etapa. |
| `E5-008` | 007:110–117; 008:136–171; 009:203–222; 011:5–21 | Relação modelo geral–regional | Ambiguidade de aplicabilidade em `SCI-FND-013/014`. | `DOC-RAW-010`, `DOC-RAW-013` e modelos 007–009/protocolo 011 | Pode delimitar versão, território e escala. | Sem concluir precedência ou equivalência. |
| `E5-009` | 008:148–160; 009:124–201; 011:223–238 | Transformação de variáveis em entradas algorítmicas | Quebras nas 17 cadeias e `SCI-FND-010`. | `DOC-RAW-013`, `DOC-RAW-002`; referências de dados somente na etapa futura autorizada | Afeta contrato de entrada, validação e rastreabilidade. | Sem comparar com código ou definir schema. |
| `E5-010` | 007:75–108; 008:102–160; 009:124–201; 011:223–268 | Saídas matemáticas/operacionais | Valor, classe, diagnóstico e recomendações aparecem em níveis diferentes. | `DOC-RAW-013`, `DOC-RAW-002`, com confirmação dos modelos atuais | Afeta contrato de saída e uso de resultados. | Sem análise conclusiva nem regra de recomendação. |

## Candidatos a atualizações futuras

### Relações da matriz

- `RECOMENDACAO` — Após aprovação científica, revisar `TR-003`, `TR-004` e `TR-005`: a leitura aprofundada confirma sobreposição e encadeamento temático, mas a dependência entre documentos continua não declarada e não deve ser promovida automaticamente a fato.
- `RECOMENDACAO` — Avaliar relações rastreáveis entre `DOC-RAW-007` e `DOC-RAW-009`, e entre `DOC-RAW-008` e `DOC-RAW-011`, com estado inferencial enquanto não houver declaração/autoridade.
- `RECOMENDACAO` — Após a Etapa 5, revisar `TR-006` e `TR-007` à luz do contrato matemático, sem alterar essas relações nesta etapa.

### Lacunas candidatas da matriz

- Cobertura de cinco variáveis sem procedimento localizado (`SCI-FND-004`).
- Composição territorial não reconciliada (`SCI-FND-003`).
- Desenho amostral/agregação e suficiência metodológica (`SCI-FND-007`, `008`).
- Periodicidade, impossibilidade, dados faltantes e controle de qualidade (`SCI-FND-009`).
- Aplicabilidade geral/regional (`SCI-FND-013`, `014`).

Nenhuma lacuna foi acrescentada a `TRACEABILITY_MATRIX.md` nesta etapa; são candidatas para revisão humana.

### Pendências existentes e possíveis atualizações

- `PD-002` já cobre designação e validação de regras, variáveis, cálculo, métodos e protocolo; nenhuma nova pendência científica foi criada.
- `PD-001` poderá ser relevante para limites institucionais/geográficos, e `PD-003`/`PD-004` para futuros efeitos em produto/dados, sem atualização neste momento.
- `PENDING_DECISIONS.md` permaneceu inalterado, inclusive `PD-017` aberta.

### Documentos normativos possivelmente necessários

- `RECOMENDACAO` — Glossário científico canônico do IHFR, separado de glossário/modelo de domínio do produto.
- `RECOMENDACAO` — Modelo científico normativo com dimensões, processos, aplicabilidade e versões aprovadas.
- `RECOMENDACAO` — Matriz normativa de variáveis com definição, unidade, método, escala e regras de ausência.
- `RECOMENDACAO` — Protocolo normativo de campo com desenho amostral, instrumentos, QC e impossibilidade.
- `RECOMENDACAO` — Contrato matemático normativo somente após a Etapa 5 e validação científica.

## Resultados quantitativos consolidados

| Item | Quantidade |
|---|---:|
| Fontes lidas integralmente | 4 |
| Linhas físicas informadas por `wc -l` | 809 |
| Termos no léxico | 21 |
| Dimensões | 4 |
| Componentes/processos estruturais adicionais | 14 |
| Variáveis de `DOC-RAW-007` | 17 |
| Procedimentos de campo/registro | 13 |
| Procedimentos sem variável própria | 2 |
| Cadeias de rastreabilidade | 17 |
| Achados | 20 |
| Perguntas científicas | 12 |
| Encaminhamentos à Etapa 5 | 10 |

## Limitações e ponto de parada

- A auditoria é interna e documental; não avalia mérito científico externo.
- `PD-002` permanece aberta e impede qualquer promoção normativa científica.
- As fontes históricas não têm origem, bibliografia, versão documental, data, responsável ou aprovação registrados.
- Ausências significam somente “não localizado no corpus autorizado”.
- Os outros nove documentos históricos, código e fontes externas não foram auditados.
- Fórmula, pesos, normalização, classificação, arredondamento, ausências no cálculo, calibração e algoritmo foram apenas encaminhados.

O relatório está `CANONICO_ATUAL` exclusivamente como relatório analítico aprovado após a correção conceitual delimitada de `SCI-FND-011`, sem validação científica. Nenhum achado é solução aprovada ou regra normativa, e `PD-002` permanece aberta. A aprovação encerra administrativamente a Etapa 4 e não atualiza documentação científica normativa.
