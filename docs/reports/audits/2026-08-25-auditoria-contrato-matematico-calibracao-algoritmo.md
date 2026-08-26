# Auditoria do contrato matemático, da calibração regional e do algoritmo operacional do IHFR

## Identificação, estado e limites

- **Identificador:** `DOC-010`
- **Título:** Auditoria do contrato matemático, da calibração regional e do algoritmo operacional do IHFR
- **Estado documental:** `EM_REVISAO`
- **Data:** 2026-08-25
- **Escopo:** Etapa 5; auditoria documental interna das formulações matemáticas, da calibração declarada para o Baixo Itapecuru e do fluxo operacional do IHFR.
- **Fontes primárias:** `DOC-RAW-002`, `DOC-RAW-010` e `DOC-RAW-013`.
- **Fontes auxiliares:** seções matemáticas e operacionais pertinentes de `DOC-RAW-007`, `DOC-RAW-008`, `DOC-RAW-009` e `DOC-RAW-011`.
- **Entrada analítica:** `DOC-009`, sem tratá-lo como fonte científica primária.
- **Plano:** [`DOC-PLAN-004`](../../plans/active/auditoria-contrato-matematico-calibracao-algoritmo.md)
- **Responsável pela execução:** agente mantenedor.
- **Responsável científico:** não especificado; dependente de `PD-002`.
- **Autoridade:** este relatório não possui autoridade científica normativa.

Este documento registra o que as fontes históricas declaram e as consequências matemáticas internamente verificáveis. Não valida cientificamente fórmulas, variáveis, pesos, classes, parâmetros ou recomendações; não escolhe formulação normativa; não estabelece precedência; não compara com código, banco, testes ou implementação; não usa fontes externas; e não resolve `PD-002`.

Declarações literais localizadas são `FATO_DOCUMENTADO`. Equivalências, resultados algébricos e comparações derivadas são `INFERENCIA`. Ausências são `NAO_ESPECIFICADO`. Escolhas que dependem de autoridade científica são `PENDENCIA_DE_DECISAO`.

## Método e alcance da leitura

As três fontes primárias foram lidas integralmente com localizadores por linha: 275 linhas físicas em `DOC-RAW-002`, 225 em `DOC-RAW-010` e 277 em `DOC-RAW-013`, totalizando 777 linhas físicas informadas por `wc -l`. As quatro fontes auxiliares foram consultadas nas seções pertinentes a variáveis, fórmulas, classificação, aplicabilidade, normalização, fluxo e saídas; elas já haviam sido lidas integralmente na Etapa 4.

Os cálculos foram repetidos em comando efêmero de Node.js, sem arquivo temporário preservado e sem constituir implementação. A primeira invocação teve erro de sintaxe, não produziu resultado e não alterou o repositório; a invocação corrigida reproduziu somas, valores-limite, cenário regional e lacunas classificatórias. Nenhuma fonte científica externa foi consultada.

## Identificação das fontes

### Fontes primárias

| ID | Título interno e caminho | Versão e data declaradas | Escopo e aplicabilidade espacial declarados | Papel aparente | Proveniência e limites | Localizadores usados |
|---|---|---|---|---|---|---|
| `DOC-RAW-002` | “ALGORITMO OPERACIONAL — HIDROFLORESTAS (MVP)”; `docs/raw/algoritmo-operacional-hidroflorestas-mvp.md` | Versão documental: não especificada; data: não especificada; registra `algorithm_version = IHFR_v0.1`. | MVP da plataforma; nenhuma delimitação espacial explícita. | Fluxo operacional de validação, normalização, cálculo, explicação, recomendações, persistência e payload. | Origem, autoria, aprovação, bibliografia e relação documental com o contrato não especificadas. | 002:1–15, 15–90, 92–178, 180–275. |
| `DOC-RAW-010` | “MODELO REGIONAL DO IHFR — Calibração ecológica para o Baixo Itapecuru – Maranhão”; `docs/raw/modelo-regional-do-ihfr-calibracao-ecologica-baixo-itapecuru-maranhao.md` | Versão e data: não especificadas. | Região de Itapecuru-Mirim, bacia do Rio Itapecuru e Baixo Itapecuru; paisagens/propriedades rurais. Limites operacionais não declarados. | Modelo regional com contexto, faixas críticas, mapeamentos, pesos diferenciais e exemplo. | Origem, autoria, método de calibração, amostra, dados, bibliografia, aprovação e evidência empírica não especificados. | 010:1–19, 21–67, 69–128, 130–168, 170–225. |
| `DOC-RAW-013` | “ESPECIFICAÇÃO DO IHFR v0.1 (MVP) — ‘CONTRATO MATEMÁTICO’”; `docs/raw/specificacao-do-ihfr-v0-1-mvp-contrato-matematico.md` | `v0.1 (MVP)`; data não especificada; saída `algorithm_version = IHFR_v0.1`. | MVP; aplicabilidade espacial geral não especificada. A justificativa de `soil_texture` menciona Itapecuru sem delimitar o documento inteiro. | Contrato histórico de entradas, scores, dimensões, ausências, qualidade, classes e explicação. | Origem, autoria, aprovação, bibliografia, método científico e relação de precedência com algoritmo/regional não especificadas. | 013:1–40, 42–218, 220–278. |

### Fontes auxiliares

| ID | Título e caminho | Alcance consultado | Aplicabilidade/versão | Limite de uso nesta etapa |
|---|---|---|---|---|
| `DOC-RAW-007` | “MATRIZ DE VARIÁVEIS DO IHFR”; `docs/raw/matriz-de-variaveis-do-ihfr.md` | 17 variáveis, normalizações, composição, classes, aplicação e calibração futura; 007:5–12, 14–99, 110–134. | Versão/data não especificadas; aplicações amplas. | Comparação matemática; histórico sem autoridade normativa. |
| `DOC-RAW-008` | “MODELO CIENTÍFICO DO IHFR”; `docs/raw/modelo-cientifico-do-ihfr.md` | dimensões/variáveis, formulação v0.1, classes, integração e calibração futura; 008:38–132, 148–171. | Modelo `IHFR v0.1` nas linhas 104–121; versão documental/data não especificadas; aplicação ampla. | Comparação matemática; histórico sem validação científica registrada. |
| `DOC-RAW-009` | “MODELO CONCEITUAL DO IHFR”; `docs/raw/modelo-conceitual-do-ihfr.md` | integração e fluxo dados→recomendações; 009:74–90, 124–201. | Versão/data não especificadas; aplicação ampla. | Fluxo conceitual, sem fórmula operacional detalhada. |
| `DOC-RAW-011` | “PROTOCOLO DE CAMPO DO IHFR”; `docs/raw/protocolo-de-campo-do-ihfr.md` | escopo regional, faixas de variáveis, fórmula diferencial, classes e recomendações; 011:5–21, 55–268. | Maranhão, foco no Baixo Itapecuru; versão/data não especificadas. | Comparação de campo e matemática; não define precedência normativa. |

`DOC-009` foi usado somente para rastrear `SCI-FND-NNN`, `SCI-Q-NNN` e `E5-001` a `E5-010`. Sua aprovação analítica não transforma suas conclusões em regras científicas.

## Glossário, símbolos e termos operacionais

| ID | Símbolo/termo | Declaração ou uso | Fonte/localizador | Diferença ou ambiguidade |
|---|---|---|---|---|
| `SYM-001` | `IHFR` / `ihfr_score` | Índice/score final entre 0 e 1. | 013:5–14, 25–29; 002:7–13, 148–178. | Valor é declarado; precisão final e arredondamento não são. |
| `SYM-002` | `W` | Dimensão Água/Water no contrato e algoritmo. | 013:18–28, 44–95; 002:92–106. | A formulação regional usa `H` para a dimensão hídrica. |
| `SYM-003` | `H` | Dimensão hídrica nas fontes auxiliares e regional. | 007:79–88; 008:110–119; 010:115–124; 011:229–238. | A equivalência `H` ↔ `W` é `INFERENCIA`, embora os rótulos funcionais coincidam. |
| `SYM-004` | `S` | Dimensão Solo/Soil/pedológica. | 013:20–21, 97–144; 002:108–118; 010:115–124. | Uso alinhado; composição interna não é definida por 010. |
| `SYM-005` | `V` | Dimensão Vegetação/Paisagem. | 013:22, 146–181; 002:120–129; 010:115–124. | 010 abrevia como vegetação; alcance de paisagem não é detalhado. |
| `SYM-006` | `T` | Dimensão Território/Contexto. | 013:23, 183–218; 002:131–138; 010:115–124. | 007 inclui densidade de drenagem; 013/002 incluem `area_size_ha`, mas sem risco. |
| `SYM-007` | score de risco | Valor unitário em que 0 é favorável e 1 crítico. | 013:33–40; 002:79–90. | Garantia depende de validação/clipping e domínio das entradas. |
| `SYM-008` | `mean(values)` | Média ignorando `null`; usada em dimensões e resultado final. | 002:86–90, 104–150; 013:40, 91–95, 140–180, 214–230. | Denominador para conjunto vazio e precisão não especificados. |
| `SYM-009` | `clamp` | Limitação de faixa; contrato manda clamp em três entradas e usa a função sem limites explícitos em solo exposto. | 013:65–71, 101–107, 136–138, 189–194; 002:86–90. | 002 define a função, mas suas hard rules bloqueiam entradas fora da faixa antes do cálculo. |
| `SYM-010` | `enum_score` / `mapping` | Conversão de categoria em risco. | 002:86–90, 96–135; 013:48–89, 109–175, 196–207. | 002 não repete os mapas; dependência em 013 é aparente, mas não declarada. Categoria desconhecida não é tratada. |
| `SYM-011` | `null` / `missing` / válido | Ausência de variável ou dimensão; dimensão com menos de duas variáveis válidas fica `null`. | 013:65–71, 220–230; 002:86–90, 140–150, 178. | “Válida”, ausência de entrada declarada obrigatória e média sem dimensão válida não são definidos. |
| `SYM-012` | `data_quality` | Classe de completude/confiança baseada em cinco campos essenciais. | 013:7–14, 220–245; 002:152–168. | Regras discordam para quatro de cinco essenciais preenchidos. “Confiança” não possui cálculo independente. |
| `SYM-013` | `algorithm_version` | Rótulo obrigatório `IHFR_v0.1`. | 013:7–14; 002:50–56, 236–272. | Não prova versão documental, aprovação ou precedência. |
| `SYM-014` | `drivers` | Duas dimensões válidas com maior score. | 002:180–197, 253–264; 013:256–278. | Desempate e menos de duas dimensões válidas não são especificados. |
| `SYM-015` | classes | `baixo`, `moderado`, `alto`, `crítico`; 002 acrescenta `insuficiente` para `null`. | 013:247–254; 002:170–178; 007:92–99; 008:123–132; 011:240–247. | Intervalos deixam três faixas decimais abertas e a quinta classe não consta do contrato. |
| `SYM-016` | calibração regional | Ajuste de variáveis críticas e pesos para o Baixo Itapecuru. | 010:3–5, 65–128, 223–225. | Método, autoridade, versão e vínculo com o modelo geral não especificados. |
| `SYM-017` | entradas raw | Valores ambientais, territoriais, geometria e metadados recebidos/persistidos. | 002:15–56, 236–249. | Unidades erradas e proveniência do dado não têm validação declarada. |
| `SYM-018` | saídas | Score, classe, componentes, explicação, drivers, recomendações, qualidade, versão e trilha. | 013:7–14; 002:236–264. | `ihfr_explanation` versus `explanation`; persistência não aparece no payload. |
| `SYM-019` | unidade homogênea/paisagem | Unidade de coleta avaliada separadamente no protocolo. | 011:36–53. | Regra de agregação para propriedade/comunidade/microbacia não especificada. |
| `SYM-020` | campos essenciais | Infiltração, compactação, cobertura, uso da terra e disponibilidade hídrica. | 013:233–245; 002:152–166. | Essencialidade afeta `data_quality`, mas não é declarada como condição mínima do cálculo. |

## Catálogo de fórmulas

“Não especificado” significa que a fonte não fornece o campo; nenhuma convenção matemática foi promovida a regra.

| ID | Expressão literal; fonte/localizador | Finalidade, entradas e saída | Domínio/contradomínio e unidades | Coeficientes/condições/pressupostos | Arredondamento, clipping, faltantes, versão/aplicabilidade | Classificação |
|---|---|---|---|---|---|---|
| `FORM-001` | $IHFR=0.25W+0.25S+0.25V+0.25T$; 013:18–29. | Agregar quatro dimensões em score final. | Entradas 0–1 pela convenção; saída 0–1 é declarada em 013:7–10 e garantida algebricamente para quatro entradas válidas (`INFERENCIA`). Sem unidade. | Quatro coeficientes 0.25; soma 1. Requer quatro dimensões na expressão. | Arredondamento não especificado; clipping final não especificado; faltantes tratados posteriormente por `FORM-014`; v0.1 MVP; espaço não especificado. | Expressão: `FATO_DOCUMENTADO`; garantia: `INFERENCIA`. |
| `FORM-002` | $IHFR=(H+S+V+T)/4$; 007:75–90 e 008:102–121. | Agregar quatro dimensões. | Dimensões/saída 0–1 declaradas; sem unidade. | Denominador 4. Equivalência a quatro pesos 0.25 é `INFERENCIA` para 007; 008 declara pesos equivalentes. | Arredondamento, clipping e faltantes não especificados; 008 chama modelo de IHFR v0.1; aplicação ampla. | Fórmulas/declarações: `FATO_DOCUMENTADO`; equivalência: `INFERENCIA`. |
| `FORM-003` | $IHFR=0.35H+0.30S+0.25V+0.10T$; 010:111–128 e 011:223–238. | Agregar dimensões com pesos diferenciais regionais. | 011 declara variáveis normalizadas; saída 0–1 é `INFERENCIA` se entradas estiverem em 0–1. Sem unidade. | Coeficientes somam 1; 010 declara solo e água como críticos. | Arredondamento, clipping e faltantes não especificados; versão não especificada; Baixo Itapecuru/Maranhão. | `FATO_DOCUMENTADO`; contradomínio é `INFERENCIA`. |
| `FORM-004` | $risk=1-depth/60$; 013:65–71, 002:98–106 e 007:18–24. | Normalizar profundidade do poço em risco. Entrada m; saída sem unidade. | 013/002 delimitam 0–60 m; 007 não. Saída 0–1 no domínio. | Coeficiente $-1/60$ e intercepto 1. | 013 manda clamp; 002 bloqueia fora da faixa; 007 não trata limites. Faltante: `missing`/ignorado no mean em 013/002. Arredondamento não especificado. | Expressão e regras: `FATO_DOCUMENTADO`; incompatibilidade: `INFERENCIA` comparativa. |
| `FORM-005` | $risk=1-infiltration/60$; 013:101–107, 002:108–118 e 007:30–40. | Normalizar infiltração em mm/h. | 013/002: 0–60 mm/h; 007 sem limite. Saída 0–1 no domínio. | Coeficiente $-1/60$, intercepto 1. | 013 manda clamp; 002 bloqueia; 007 não trata. Campo essencial em 013/002. Arredondamento não especificado. | `FATO_DOCUMENTADO` + `INFERENCIA` comparativa. |
| `FORM-006` | $risk=clamp(soil\_exposed\_percent/100)$; 013:136–139. | Normalizar percentual de solo exposto. | Entrada declarada 0–100%; saída pretendida 0–1; sem unidade. | Divisor 100. Limites da chamada `clamp` não aparecem. | Arredondamento e faltante não especificados; versão v0.1; espaço não especificado. | `FATO_DOCUMENTADO`; limites do clamp: `NAO_ESPECIFICADO`. |
| `FORM-007` | $risk=exposed/100$; 002:108–118 e 007:34–40. | Normalizar solo exposto. | 002 valida 0–100%; 007 não declara domínio. Saída 0–1 apenas no domínio. | Divisor 100. | 002 bloqueia fora da faixa; 007 não trata; 002 marca entrada opcional. Sem arredondamento. | `FATO_DOCUMENTADO`; garantia fora do domínio não existe. |
| `FORM-008` | $risk=1-cover/100$; 013:146–153, 002:120–129 e 007:46–55. | Normalizar cobertura vegetal. | 013/002: 0–100%; 007 não declara limite. Saída 0–1 no domínio. | Coeficiente $-1/100$, intercepto 1. | Nenhum clamp literal; 002 bloqueia entrada fora da faixa; campo essencial. Sem arredondamento. | `FATO_DOCUMENTADO`. |
| `FORM-009` | $risk=slope/45$; 013:183–195, 002:131–138 e 007:61–69. | Normalizar declividade percentual. | 013/002: 0–45%; 007 sem limite. Saída 0–1 no domínio. | Divisor 45. | 013 manda clamp; 002 bloqueia; 007 não trata; 002 marca opcional. Sem arredondamento. | `FATO_DOCUMENTADO` + `INFERENCIA` comparativa. |
| `FORM-010` | $W=mean(risk\_scores\_available)$ / $mean(scores\_agua\_disponíveis)$; 013:91–95 e 002:94–106. | Agregar até cinco scores de Água. | Scores 0–1; saída 0–1 se ao menos um valor, por convexidade (`INFERENCIA`). | Pesos internos equivalentes entre valores disponíveis; denominador é a contagem válida (`INFERENCIA`). | Menos de 2 válidos torna dimensão `null`; vazio coberto por essa regra; sem arredondamento. v0.1/MVP. | Declaração: `FATO_DOCUMENTADO`; pesos/garantia: `INFERENCIA`. |
| `FORM-011` | $S=mean(risk\_scores\_available)$ / $mean(scores\_solo\_disponíveis)$; 013:140–144 e 002:108–118. | Agregar até cinco scores de Solo. | Idem `FORM-010`. | Pesos internos equivalentes entre disponíveis (`INFERENCIA`). | Menos de 2 válidos → `null`; sem arredondamento. | `FATO_DOCUMENTADO` + `INFERENCIA`. |
| `FORM-012` | $V=mean(risk\_scores\_available)$ / $mean(scores\_veg\_disponíveis)$; 013:177–181 e 002:120–129. | Agregar até quatro scores de Vegetação/Paisagem. | Idem `FORM-010`. | Pesos internos equivalentes entre disponíveis (`INFERENCIA`). | Menos de 2 válidos → `null`; sem arredondamento. | `FATO_DOCUMENTADO` + `INFERENCIA`. |
| `FORM-013` | $T=mean(risk\_scores\_available)$ / $mean(scores\_território\_disponíveis)$; 013:214–218 e 002:131–138. | Agregar slope e land use; `area_size_ha` não altera risco. | Idem `FORM-010`; T possui apenas dois scores de risco declarados. | Com mínimo 2, ambos são necessários para T válida (`INFERENCIA`). | Qualquer ausência entre os dois scores torna T `null`; sem arredondamento. | `FATO_DOCUMENTADO` + `INFERENCIA`. |
| `FORM-014` | $IHFR=mean(W,S,V,T\ válidos)$; 013:220–231 e 002:140–150. | Agregar somente dimensões válidas. | Dimensões 0–1; saída 0–1 se houver ao menos uma válida (`INFERENCIA`). | Pesos efetivos equivalentes e renormalizados pela quantidade válida (`INFERENCIA`). | Todas inválidas: denominador/resultado não especificados; 002 classifica score `null` como insuficiente, sem declarar como o `null` é produzido. Sem arredondamento. | Regra: `FATO_DOCUMENTADO`; renormalização/garantia: `INFERENCIA`. |
| `FORM-015` | $IHFR=0.35(0.70)+0.30(0.80)+0.25(0.75)+0.10(0.50)$; 010:130–154. | Aplicar `FORM-003` a cenário hipotético. | Entradas/saída sem unidade; valores 0–1. | Parcelas exatas 0.245, 0.24, 0.1875 e 0.05. | Fonte apresenta 0.72; valor exato é 0.7225. Regra de arredondamento/truncamento não especificada. Aplicação regional. | Expressão/0.72: `FATO_DOCUMENTADO`; 0.7225: `INFERENCIA` matemática. |
| `FORM-016` | Mapeamentos categóricos e binários para risco; 013:48–89, 109–175, 196–207; 007:18–69; 010:91–109. | Converter enum/bool em score. | Categorias enumeradas; saída em valores 0.2–0.95. | Coeficientes são tabelas discretas, não expressão contínua. | Categoria desconhecida, arredondamento e fallback não especificados; mapas regionais de APP têm cardinalidade diferente. | Valores: `FATO_DOCUMENTADO`; correspondência entre mapas: `INFERENCIA`. |

## Contrato das 17 variáveis da Etapa 4

### Cobertura e comportamento

| VAR | Nome/dimensão | Tipo, unidade, categorias e codificação | Normalização, limites e 0–1 | Presença nas fontes primárias | Validação, ausência e inválido | Correspondência e localizadores |
|---|---|---|---|---|---|---|
| `VAR-001` | `water_source_type`; Água | enum/categórica: spring .2, river_stream .4, cistern .5, tubular_well .6, shallow_well .7, other .5. | `FORM-016`; saída dentro de 0–1. | 013 e 002 explícitas; 010 não parametriza. | Categoria desconhecida e ausência não especificadas; 002 não marca opcional e não declara validação enum. | Explícita 013↔002; parcial com 007/011 por vocabulário. 013:48–59; 002:19–25, 98; 007:20; 011:57–67. |
| `VAR-002` | `has_spring`; Água | bool/binária: true .2; false .8. | Mapeamento direto 0–1. | 013 e 002 explícitas; 010 ausente. | Não marcada opcional; ausência e tipo inválido não especificados. | Explícita 013↔002; ausente em 011 como procedimento próprio. 013:60–64; 002:21–25, 99; 007:21. |
| `VAR-003` | `well_depth_m`; Água | num/float opcional; metros. | `FORM-004`; clamp 0–60 em 013, hard range 0–60 em 002; saída 0–1. | 013/002 explícitas; 010 apenas cenário “poço raso”. | Ausente → missing/ignorado; fora da faixa: clamp em 013 e bloqueio em 002; unidade errada não tratada. | Explícita 013↔002; regional apenas contextual. 013:65–71; 002:23, 66, 100; 010:134–140. |
| `VAR-004` | `water_availability`; Água | enum: permanent .2; seasonal .6; scarce .9. | Mapeamento direto 0–1. | 013/002 explícitas; 010 descreve sazonalidade, sem mapa da variável. | Campo essencial; não marcado opcional; desconhecido/ausência não tratados no cálculo. | Explícita 013↔002; correspondência regional conceitual. 013:73–80, 239–245; 002:24, 101, 154–166; 010:13–19, 39–45. |
| `VAR-005` | `salinity_indicator`; Água | enum: none .2; suspected .7; confirmed .95. | Mapeamento direto 0–1. | 013/002 explícitas; 010 contextualiza poços salobros. | 002 marca opcional; 013 não. Categoria desconhecida/critério de confirmação não especificados. | Explícita no nome/mapeamento 013↔002; parcial com região/protocolo. 013:82–89; 002:25, 102; 010:49–63; 011:81–97. |
| `VAR-006` | `infiltration_rate_mm_h`; Solo | num/float; mm/h. | `FORM-005`; domínio 0–60 em 013/002. | 013/002 explícitas; 010 possui faixas regionais. | Essencial e prioritária; 002 bloqueia fora; 013 manda clamp; ausência apesar de essencial não define bloqueio. | Explícita; faixas regionais parciais. 013:101–107, 241; 002:30, 64, 110, 156; 010:71–79. |
| `VAR-007` | `compaction_level`; Solo | enum: low .2; moderate .6; high .9. | Mapeamento direto 0–1. | 013/002 e 010 explícitas. | Essencial; categoria desconhecida, ausência e critério de classe não especificados. | Mapeamento alinhado nas três e em 007/011. 013:109–116, 242; 002:31, 111, 157; 010:91–99. |
| `VAR-008` | `soil_texture`; Solo | enum: sandy .5; medium .4; clayey .7. | Mapeamento direto 0–1. | 013/002 explícitas; 010 lista classes pedológicas, não o mesmo enum. | Não marcada opcional; categoria desconhecida e ausência não especificadas. | 013↔002 explícita; relação com solos regionais é não comparável sem regra. 013:127–134; 002:29, 113; 010:21–35. |
| `VAR-009` | `erosion_signs`; Solo | enum: none .2; laminar .6; rills_gullies .9. | Mapeamento direto 0–1. | 013/002 explícitas; 010 apenas contexto de erosão. | Não marcada opcional; desconhecido/ausência não tratados. | Explícita 013↔002; 011 separa sulcos alto e voçoroca crítico, correspondência parcial. 013:118–125; 002:32, 112; 011:135–146. |
| `VAR-010` | `soil_exposed_percent`; Solo | num/float; 0–100%. | `FORM-006` em 013 e `FORM-007` em 002; esperado 0–1. | 013/002 explícitas; 010 ausente. | 002 marca opcional e bloqueia fora; 013 não marca opcional e chama clamp sem limites; ausência ambígua. | Explícita no campo; papel distinto da classe territorial bare soil. 013:136–139; 002:33, 63, 114; 007:40,68. |
| `VAR-011` | `vegetation_cover_percent`; Vegetação | num/float; 0–100%. | `FORM-008`; esperado 0–1. | 013/002 explícitas; 010 possui faixas regionais. | Essencial; 002 bloqueia fora; 013 só declara domínio. Ausência não define bloqueio. | Explícita; faixas regionais parciais. 013:150–153, 243; 002:37, 62, 122, 158; 010:81–89. |
| `VAR-012` | `fragmentation_level`; Vegetação | enum: low .2; moderate .6; high .9. | Mapeamento direto 0–1. | 013/002 explícitas; 010 ausente. | Não marcada opcional; desconhecido/ausência/critério de classe não tratados. | Explícita 013↔002; parcial com continuidade qualitativa de 011. 013:154–161; 002:38, 123; 011:162–170. |
| `VAR-013` | `has_riparian_app`; Vegetação | bool: true .2; false .85. | Mapeamento direto 0–1. | 013/002 explícitas; 010 usa ternário .2/.6/.9. | 002 marca opcional; 013 não. Conversão regional/binária, ausência e desconhecido não definidos. | Explícita 013↔002; divergência de cardinalidade/score regional. 013:163–166; 002:39,124; 010:101–109. |
| `VAR-014` | `landscape_degradation`; Vegetação | enum: low .2; moderate .6; high .9. | Mapeamento direto 0–1. | 013/002 explícitas; 010 usa conceito/problema, sem mapa próprio. | Não marcada opcional; desconhecido/ausência/critério de classe não tratados. | Explícita 013↔002; regional contextual. 013:168–175; 002:40,125; 010:47–63,178–183. |
| `VAR-015` | `slope_percent`; Território | num/float; 0–45%. | `FORM-009`; esperado 0–1. | 013/002 explícitas; 010 ausente. | 002 marca opcional e bloqueia fora; 013 manda clamp; unidade errada não tratada. | Explícita 013↔002; parcial com faixas de 011. 013:189–195; 002:46,65,133; 011:182–195. |
| `VAR-016` | `land_use_type`; Território | enum: forest .2, agroforestry .25, cropland .6, pasture .65, degraded_pasture .8, bare_soil .95, urban .7. | Mapeamento direto 0–1. | 013/002 explícitas; 010 usa categorias no cenário/contexto, sem mapa. | Essencial; não marcada opcional; desconhecido/ausência/regra de predominância não tratados. | Explícita 013↔002; 013 acrescenta urban versus 007/011. 013:196–207,244; 002:47,134,159; 010:49–54,134–140. |
| `VAR-017` | densidade de drenagem; Território | tipo/unidade original não especificados; “índice”; normalização 0–1 sem regra. | Fórmula, limites, direção e codificação ausentes. | Ausente em 013, 002 e 010. | Validação, ausência, inválido e efeito não especificados. | Ausência primária; aparece só em 007:65–69. A substituição por `area_size_ha` não é declarada. |

### Entradas adicionais não equivalentes a `VAR-NNN`

| ID | Entrada | Uso declarado | Fonte/localizador | Classificação e lacuna |
|---|---|---|---|---|
| `INP-001` | `area_size_ha` | Numérico opcional; exibição/relatório; não altera risco na v0.1; possível prioridade futura v0.2. | 013:183–218; 002:42–48. | `FATO_DOCUMENTADO`; não substitui `VAR-017`; unidade ha está no nome, validação ausente. |
| `INP-002` | `geometry` | Ponto/polígono como entrada geoespacial. | 002:42–48. | `FATO_DOCUMENTADO`; formato, CRS, validade e uso no cálculo não especificados. |
| `INP-003` | `centroid_lat`, `centroid_lon` | Coordenadas do centroide. | 002:42–48. | `FATO_DOCUMENTADO`; unidade, CRS, faixas e derivação não especificados. |
| `INP-004` | `survey_id`, `area_id`, `user_id` | Metadados obrigatórios. | 002:50–56. | `FATO_DOCUMENTADO`; tipos, formatos e vínculo com cálculo não especificados. |
| `INP-005` | `timestamp` | Metadado obrigatório e item da trilha persistida. | 002:50–56, 236–249. | `FATO_DOCUMENTADO`; formato, timezone e origem não especificados. |
| `INP-006` | `algorithm_version` | Constante `IHFR_v0.1`, persistida e devolvida. | 013:7–14; 002:50–56, 236–272. | `FATO_DOCUMENTADO`; não demonstra aprovação normativa. |
| `INP-007` | clima/precipitação | Contexto/fator regional; não entra nas fórmulas auditadas. | 010:7–19; 009:29–39. | `NAO_COMPARAVEL` como entrada algorítmica; papel operacional não especificado. |

## Agregação das dimensões

| Dimensão | Composição declarada em 013/002 | Comparação com auxiliares/regional | Denominador/pesos internos | Ausência, inválido e vazia | Precisão/clipping/garantia |
|---|---|---|---|---|---|
| Água `W`/`H` | `VAR-001` a `VAR-005`; `FORM-010`. | Alinha com 007/008; 010 não define composição interna. | Contagem de scores disponíveis (`INFERENCIA`); pesos internos equivalentes. | <2 válidas → `null`; inválidos numéricos bloqueiam em 002; enum inválido não tratado. | Sem arredondamento; garantia 0–1 depende dos mappings/domínios. |
| Solo `S` | `VAR-006` a `VAR-010`; `FORM-011`. | Alinha com 007/008; 010 realça infiltração/compactação, sem declarar novo denominador. | Idem. | <2 → `null`; clamp/bloqueio divergem para infiltração/percentual. | Idem. |
| Vegetação `V` | `VAR-011` a `VAR-014`; `FORM-012`. | Alinha com 007/008; 010 usa APP ternária e faixas de cobertura. | Idem. | <2 → `null`; cobertura inválida bloqueia em 002; enum/bool inválido não tratado. | Idem. |
| Território `T` | `VAR-015`, `VAR-016`; `area_size_ha` não pontua; `FORM-013`. | 007 usa declividade, uso e densidade de drenagem; 008 usa intervenção antrópica; 009 organização espacial; 010 não compõe T. | Média dos dois scores; ambos necessários pelo mínimo de 2 (`INFERENCIA`). | Ausência de slope ou land use → T `null`; `area_size_ha` não preenche score. | Sem arredondamento; slope é clamp em 013 e bloqueio em 002. |
| IHFR geral | `FORM-001` com quatro dimensões e `FORM-014` com somente válidas. | 007/008 usam `FORM-002`; 010/011 usam `FORM-003` regional. | Quatro pesos 0.25 quando completas; pesos efetivos $1/n$ entre válidas em `FORM-014` (`INFERENCIA`). | Nenhuma dimensão válida: resultado não especificado; 002 só mapeia `null` a insuficiente. | Sem precisão/arredondamento/clipping final; 0–1 garantido apenas sob premissas documentadas. |

Ordem declarada em 002: validação → normalização → dimensões → exclusão de dimensões com menos de duas variáveis → média das dimensões válidas → `data_quality` → classe → drivers/explicação/recomendações → persistência/payload. A posição exata de `data_quality` em relação à classificação não altera o score, mas a fonte a apresenta depois da média.

## Pesos, formulações e versões

| Fonte | Fórmula | H/W | S | V | T | Soma | Versão | Aplicabilidade | Justificativa/validação | Relação com outras formulações |
|---|---|---:|---:|---:|---:|---:|---|---|---|---|
| `DOC-RAW-007` | média simples `FORM-002` | 0.25 por equivalência | 0.25 por equivalência | 0.25 por equivalência | 0.25 por equivalência | 1 (`INFERENCIA`) | não especificada | aplicações amplas | calibração futura; não validada | A fonte declara média simples; pesos individuais são `INFERENCIA`. |
| `DOC-RAW-008` | média simples `FORM-002` e “peso equivalente” | 0.25 | 0.25 | 0.25 | 0.25 | 1 | IHFR v0.1 | geral/ampla | simples; calibração empírica futura; não validada | Equivalente a 013 (`INFERENCIA` comparativa). |
| `DOC-RAW-013` | `FORM-001` | 0.25 (`W`) | 0.25 | 0.25 | 0.25 | 1 | v0.1 MVP | espaço não especificado; textura menciona Itapecuru | simples, transparente e fácil de calibrar depois; não validada | Alinha algebricamente a 007/008; não declara dependência. |
| `DOC-RAW-002` | `FORM-014` para dimensões válidas | $1/n$ | $1/n$ | $1/n$ | $1/n$ | 1 entre válidas | `IHFR_v0.1` | espaço não especificado | não especificada; não validada | Coincide com pesos 0.25 se 4 válidas; renormaliza se menos (`INFERENCIA`). |
| `DOC-RAW-010` | `FORM-003` | 0.35 (`H`) | 0.30 | 0.25 | 0.10 | 1 | não especificada | Baixo Itapecuru/Itapecuru-Mirim | “solo e água” críticos; método/evidência não especificados | Formulação regional diferencial; precedência perante v0.1 geral não declarada. |
| `DOC-RAW-011` | `FORM-003` | 0.35 | 0.30 | 0.25 | 0.10 | 1 | não especificada | Maranhão, foco no Baixo Itapecuru | justificativa/validação não especificadas | Alinha literalmente com 010; relação documental não declarada. |

`INFERENCIA` — As formulações equivalentes e diferenciais produzem resultados distintos quando as dimensões não são iguais. A presença de escopo regional explícito em 010/011 pode explicar a diferença, mas as fontes não declaram a relação entre a calibração e a v0.1 geral. A revisão humana posterior aos resultados documentais desta etapa reclassificou `SCI-FND-011` como `DIVERGENCIA_DOCUMENTAL`; `MATH-FND-003` e `MATH-FND-004` aprofundam essa interpretação ao manter divergentes os pesos gerais e regionais e ambígua a relação geral–regional, sem escolher fórmula ou pesos.

## Calibração regional

### Parâmetros e ajustes declarados

| ID | Nome/valor/unidade | Fonte/localizador e justificativa declarada | População/território | Método/evidência empírica/versão | Relação com modelo geral e efeito esperado | Estado e lacunas |
|---|---|---|---|---|---|---|
| `REG-PAR-001` | precipitação anual média: 1600–2000 mm | 010:7–19; contexto de sazonalidade hídrica. | Região de Itapecuru-Mirim/bacia do Itapecuru. | Método, período de referência, dados, fonte e versão não especificados. | Contextual; não entra em fórmula. Efeito operacional não especificado. | Não validado; proveniência ausente. |
| `REG-PAR-002` | período chuvoso: janeiro–junho | 010:13–19. | Idem. | Método/evidência/versão não especificados. | Contextual; nenhuma variável temporal associada. | Não validado; limites/variabilidade ausentes. |
| `REG-PAR-003` | período seco: julho–dezembro | 010:13–19. | Idem. | Método/evidência/versão não especificados. | Contextual; associado à disponibilidade, mas sem regra algorítmica. | Não validado. |
| `REG-PAR-004` | solos: Argissolos, Latossolos, Neossolos e características textuais | 010:21–35; contexto pedológico. | Região declarada. | Método de levantamento, proporção e fonte não especificados. | Não há conversão para `soil_texture` nem score regional. | Não comparável operacionalmente; validação pendente. |
| `REG-PAR-005` | infiltração: >40 baixo; 20–40 moderado; <20 alto; mm/h | 010:65–80; sensibilidade à compactação. | Baixo Itapecuru. | Método de obtenção/evidência/versão não especificados. | Ajuste/faixa regional; não define score numérico nem substituição de `FORM-005`. | Não validado; limites exatos 20/40 se sobrepõem apenas à faixa moderada, mas conversão classe→score ausente. |
| `REG-PAR-006` | cobertura: >70 baixo; 40–70 moderado; <40 alto; % | 010:81–90; proteção do solo. | Baixo Itapecuru. | Método/evidência/versão não especificados. | Ajuste regional qualitativo; não substitui explicitamente `FORM-008`. | Não validado; conversão para score ausente. |
| `REG-PAR-007` | compactação: baixa .2; moderada .6; alta .9 | 010:91–100; comum em pastagens. | Baixo Itapecuru. | Método/evidência/versão não especificados. | Alinha ao mapa geral; reforça relevância sem alterar valor. | Não validado; critério de classe ausente. |
| `REG-PAR-008` | APP: preservada .2; parcialmente degradada .6; ausente .9 | 010:101–110; matas ciliares fundamentais. | Baixo Itapecuru. | Método/evidência/versão não especificados. | Altera cardinalidade/valores frente ao bool .2/.85 de 013. | Não validado; regra de conversão e precedência ausentes. |
| `REG-PAR-009` | peso H = .35 | 010:111–128. | Calibração regional do Baixo Itapecuru. | Método quantitativo/evidência/versão não especificados. | Aumenta contribuição hídrica frente a .25. | Não validado; símbolo H↔W e tratamento de missing ausentes. |
| `REG-PAR-010` | peso S = .30 | 010:111–128. | Idem. | Idem. | Aumenta contribuição do solo frente a .25. | Não validado. |
| `REG-PAR-011` | peso V = .25 | 010:111–128. | Idem. | Idem. | Mantém contribuição de V frente à formulação equivalente. | Não validado. |
| `REG-PAR-012` | peso T = .10 | 010:111–128. | Idem. | Idem. | Reduz contribuição territorial frente a .25. | Não validado. |
| `REG-PAR-013` | variáveis críticas: infiltração, cobertura, compactação e APP | 010:65–110; maior relevância regional. | Baixo Itapecuru. | Critério de seleção, dados e versão não especificados. | A fonte fornece faixas/mapas, mas não pesos internos especiais. | Efeito quantitativo dentro das dimensões não especificado. |

### Aplicabilidade e relação geral–regional

- `FATO_DOCUMENTADO` — 010 declara calibração para o Baixo Itapecuru e contexto de Itapecuru-Mirim/bacia do Rio Itapecuru; 011 declara Maranhão com foco no Baixo Itapecuru.
- `NAO_ESPECIFICADO` — Municípios, coordenadas, polígonos, critérios de inclusão/exclusão, escala operacional e regra para verificar se uma área pertence ao território.
- `NAO_ESPECIFICADO` — Processo estatístico, amostra, período, referência, incerteza, sensibilidade, validação cruzada, autoria, aprovação e autoridade da calibração.
- `INFERENCIA` — 010/011 formam um bloco regional coerente em pesos, faixas de infiltração/cobertura e APP ternária; nenhuma fonte declara dependência ou sucessão entre elas.
- `PENDENCIA_DE_DECISAO` — A autoridade científica deve decidir se e como a calibração se relaciona à v0.1 geral e em qual território pode ser aplicada.

## Algoritmo operacional

| ID | Ordem/descrição | Entrada → transformação → saída | Pré-condições/validações/erro/ausência | Dependências/fórmula/fonte | Determinismo e ambiguidade |
|---|---|---|---|---|---|
| `ALG-STEP-001` | 1. Receber entradas ambientais do formulário. | 14 campos ambientais → conjunto raw. | Tipos nomeados; opcionais marcados em parte; mensagem de ausência não especificada. | 002:15–40; relação com 013 não declarada. | Determinístico como coleta; obrigatoriedade parcial ambígua. |
| `ALG-STEP-002` | 2. Receber entradas geoespaciais. | geometry, centroid, slope, land use, area → contexto. | slope/area opcionais; validação de geometry/centroid não especificada. | 002:42–48. | Uso de geometry/centroid no cálculo não especificado. |
| `ALG-STEP-003` | 3. Associar metadados obrigatórios. | IDs, versão e timestamp → registro identificado. | Formatos/unicidade/timezone não especificados. | 002:50–56. | Timestamp varia entre execuções; demais determinismo não aplicável. |
| `ALG-STEP-004` | 4. Validar faixas numéricas. | Cinco campos → válido ou erro. | Fora da faixa bloqueia e pede correção. | 002:58–70. | Determinístico; texto/código do erro não especificado. |
| `ALG-STEP-005` | 5. Emitir alertas de consistência. | cobertura<10 + forest; spring=true + scarce → alerta. | Não bloqueia. | 002:72–77. | Determinístico; combinação com null/categorias desconhecidas não especificada. |
| `ALG-STEP-006` | 6. Normalizar scores. | Numéricos/bools/enums → risco 0–1 por clamp, mapping e fórmulas. | Hard rules já aprovadas; enum desconhecido não tratado; null ignorado no mean. | 002:79–90; `FORM-004` a `FORM-009`, `FORM-016`. | Scores determinísticos para input válido e mapa conhecido; mapas não repetidos em 002. |
| `ALG-STEP-007` | 7. Calcular Água. | Até cinco scores → W por `FORM-010`. | Menos de 2 válidos será tratado em passo 11. | 002:94–106. | Determinístico; denominador é inferido da função mean. |
| `ALG-STEP-008` | 8. Calcular Solo. | Até cinco scores → S por `FORM-011`. | Idem. | 002:108–118. | Determinístico sob mapas válidos. |
| `ALG-STEP-009` | 9. Calcular Vegetação. | Até quatro scores → V por `FORM-012`. | Idem. | 002:120–129. | Determinístico sob mapas válidos. |
| `ALG-STEP-010` | 10. Calcular Território. | slope e land use → T por `FORM-013`. | Com mínimo 2, os dois scores são necessários (`INFERENCIA`). | 002:131–138. | `area_size_ha` não entra; densidade de drenagem ausente. |
| `ALG-STEP-011` | 11. Invalidar dimensão insuficiente. | Contagem de variáveis válidas <2 → dimensão `null`. | Definição de “válida” para enum/required ausente. | 002:140–145. | Determinístico se validade definida; caso contrário ambíguo. |
| `ALG-STEP-012` | 12. Calcular IHFR. | Dimensões não null → média `FORM-014`. | Nenhuma dimensão válida: comportamento não especificado. | 002:146–150. | Determinístico com ≥1 válida; diverge de pesos regionais se aplicáveis. |
| `ALG-STEP-013` | 13. Calcular `data_quality`. | Cinco essenciais → high/medium/low. | 5/5 high; 3–4 medium; 0–2 low; low gera aviso. | 002:152–168. | Determinístico; conflita com 013 para 4/5. |
| `ALG-STEP-014` | 14. Classificar score. | score → baixo/moderado/alto/crítico; null → insuficiente. | Valores nas lacunas decimais não recebem classe; sem arredondamento. | 002:170–178. | Determinístico apenas para intervalos cobertos. |
| `ALG-STEP-015` | 15. Selecionar drivers. | Dimensões válidas ordenadas desc → duas maiores. | Menos de duas/ties não tratados. | 002:180–186. | Desempate não determinístico documentalmente. |
| `ALG-STEP-016` | 16. Gerar explicação. | Drivers → template textual. | Critério de dimensão “alta” não explicitado nessa seção; exemplos. | 002:188–197. | Template-base reproduzível; composição final e empates ambíguos. |
| `ALG-STEP-017` | 17. Gerar recomendações gerais. | Classe → conjunto de orientação. | Classe insuficiente não possui regra. | 002:199–206. | Determinístico para quatro classes se lista fixa; detalhe do payload não especificado. |
| `ALG-STEP-018` | 18. Acrescentar recomendações por driver. | S/V/W/T ≥.7 → ações correspondentes. | Combinação, ordem, duplicidade e classe insuficiente não tratadas. | 002:208–234. | Determinístico nos limiares; ordenação/consolidação ambígua. |
| `ALG-STEP-019` | 19. Persistir trilha. | Raw, scores, dimensões, IHFR, classe, texto, recomendações, qualidade, versão, timestamp → registro. | Falha de persistência, transação e identificador não tratados. | 002:236–251. | Conteúdo matemático auditável; formato/precisão não especificados. |
| `ALG-STEP-020` | 20. Retornar payload. | Resultado → frontend. | Tratamento de erro/insuficiência não detalhado. | 002:253–264. | Nome `explanation` difere de `ihfr_explanation` em 013. |
| `ALG-STEP-021` | 21. Verificar critérios de aceitação declarados. | Entrada válida → score, classe, versão, qualidade, drivers, recomendações. | Implementação não foi comparada; os critérios são documentais. | 002:266–275. | Não comprova implementação; classificação “rigorosa” é ambígua nas lacunas. |

## Contrato de saída

| Saída | Previsão explícita | Fonte/localizador | Precisão/arredondamento/persistência | Observação de rastreabilidade |
|---|---|---|---|---|
| Score final | `ihfr_score` 0.00–1.00 | 013:7–14; 002:7–13, 253–264. | Duas casas aparecem na descrição, mas regra de arredondamento não é declarada; persistência obrigatória em 002:236–249. | Fórmulas e dimensões devem ser salvas. |
| Classe | `ihfr_class`: quatro classes; 002 acrescenta insuficiente para null. | 013:7–14, 247–254; 002:170–178, 253–264. | Persistida; gaps e rounding não resolvidos. | Divergência de cardinalidade do contrato de classes. |
| Dimensões | `component_scores` W/S/V/T. | 013:7–14; 002:236–264. | Persistidas; precisão não especificada. | Permite explicar score, mas composição regional/geral precisa de versão. |
| Scores intermediários | Scores normalizados por variável. | 002:236–249. | Persistidos; não aparecem no payload padrão. | Explicitamente previstos na trilha, não no retorno. |
| Explicação | `ihfr_explanation` em 013; `explanation` em 002. | 013:7–14, 256–278; 002:180–197, 253–264. | Persistida como texto; formato/idioma não especificados. | Correspondência semântica é `INFERENCIA`; nome diverge. |
| Drivers | Duas dimensões mais críticas. | 002:180–186, 253–264; 013:256–260. | Payload explícito; persistência não usa o nome `drivers`. | Desempate/quantidade insuficiente não especificados. |
| Recomendações | Lista objetiva por classe e driver. | 002:199–234, 253–264; 010:170–219; 011:260–268. | Persistência obrigatória; ordem/formato não especificados. | Regional oferece exemplos, não regra de derivação adicional. |
| `data_quality` | high/medium/low; “completude/confiança”. | 013:7–14, 220–245; 002:152–168, 253–264. | Persistida/retornada. | Conflito para 4/5 essenciais; confiança não calculada separadamente. |
| Versão | `algorithm_version = IHFR_v0.1`. | 013:7–14; 002:50–56, 236–272. | Persistida/retornada. | Necessária, mas não distingue calibração regional. |
| Raw inputs | Todas as entradas. | 002:236–249. | Persistência obrigatória. | Formato/unidades/proveniência não especificados. |
| Timestamp | Tempo do diagnóstico. | 002:50–56, 236–249. | Persistido; não aparece no payload padrão. | Timezone/formato não especificados. |
| Diagnóstico | Texto/interpretação regional e auxiliar. | 010:170–183; 011:249–258; 009:152–201. | Campo próprio não aparece no payload, além de explanation. | Saída operacional própria é apenas inferida. |
| Mapa | Mapa de risco/potencial de plataforma. | 010:213–221; 009:173–201. | Persistência/estrutura não especificadas. | Não é saída explícita do algoritmo 002. |

## Testes documentais e matemáticos

Os testes avaliam somente o comportamento das regras escritas. “Observado” é resultado algébrico ou consequência lógica, não validação científica. Para números binários de ponto flutuante, os valores abaixo são apresentados em forma decimal matemática, sem promover a representação interna da ferramenta a regra de precisão.

| ID | Entradas | Regra aplicada | Esperado segundo a fonte | Resultado observado | Classificação | Limitação e fonte |
|---|---|---|---|---|---|---|
| `MATH-TEST-001` | quatro pesos .25 | soma de `FORM-001` | Pesos iguais da v0.1. | Soma = 1. | `ALINHAMENTO_DOCUMENTAL`; `INFERENCIA` aritmética. | Não valida os pesos; 013:18–29. |
| `MATH-TEST-002` | pesos .35/.30/.25/.10 | soma de `FORM-003` | Pesos regionais. | Soma = 1. | `ALINHAMENTO_DOCUMENTAL`; `INFERENCIA` aritmética. | Não valida a calibração; 010:111–128; 011:223–238. |
| `MATH-TEST-003` | H,S,V,T arbitrários | comparar `(H+S+V+T)/4` com `.25H+.25S+.25V+.25T`. | 007 declara média; 008/013 declaram equivalência/pesos iguais. | Expressões são equivalentes para qualquer quádrupla. | `INFERENCIA` matemática. | Não torna .25 declaração literal de 007; `FORM-001` e `FORM-002`. |
| `MATH-TEST-004` | .70/.80/.75/.50 | `FORM-002` versus `FORM-003`. | 010 aplica fórmula regional. | Equivalente = .6875; diferencial = .7225; diferença = .035. | `DIVERGENCIA_DOCUMENTAL`; `INFERENCIA`. | Não escolhe esquema; 010:141–164. |
| `MATH-TEST-005` | quatro dimensões 0 | `FORM-001`, `FORM-002` e `FORM-003`. | Score em 0–1. | Resultado 0 nos dois esquemas. | `ALINHAMENTO_DOCUMENTAL`. | Validade científica do extremo não avaliada. |
| `MATH-TEST-006` | quatro dimensões .5 | `FORM-001`, `FORM-002` e `FORM-003`. | Score intermediário. | Resultado .5 nos dois esquemas. | `ALINHAMENTO_DOCUMENTAL`. | Igualdade decorre de dimensões iguais. |
| `MATH-TEST-007` | quatro dimensões 1 | `FORM-001`, `FORM-002` e `FORM-003`. | Score em 0–1. | Resultado 1 nos dois esquemas. | `ALINHAMENTO_DOCUMENTAL`. | Idem. |
| `MATH-TEST-008` | profundidade 0 m | `FORM-004`. | 013/002: risco 1 após domínio/clamp. | 1. | `ALINHAMENTO_DOCUMENTAL`. | Não testa plausibilidade física. |
| `MATH-TEST-009` | profundidade 60 m | `FORM-004`. | Risco 0. | 0. | `ALINHAMENTO_DOCUMENTAL`. | Idem. |
| `MATH-TEST-010` | profundidade 61 m | 013 clamp; 002 hard rule. | 013 limita a 60; 002 bloqueia e pede correção. | 013 produziria 0; 002 não calcula. | `CONFLITO_DOCUMENTAL`. | Mesmo campo/versão operacional, comportamentos incompatíveis; 013:65–71; 002:60–70. |
| `MATH-TEST-011` | infiltração 0 mm/h | `FORM-005`. | Risco 1. | 1. | `ALINHAMENTO_DOCUMENTAL`. | 013:101–107; 002:101–118. |
| `MATH-TEST-012` | infiltração 60 mm/h | `FORM-005`. | Risco 0. | 0. | `ALINHAMENTO_DOCUMENTAL`. | Idem. |
| `MATH-TEST-013` | infiltração 61 mm/h | 013 clamp; 002 hard rule. | 013 limita a 60; 002 bloqueia. | 013 produziria 0; 002 não calcula. | `CONFLITO_DOCUMENTAL`. | 013:101–107; 002:60–70. |
| `MATH-TEST-014` | declividade 0% | `FORM-009`. | Risco 0. | 0. | `ALINHAMENTO_DOCUMENTAL`. | 013:189–195; 002:131–138. |
| `MATH-TEST-015` | declividade 45% | `FORM-009`. | Risco 1. | 1. | `ALINHAMENTO_DOCUMENTAL`. | Idem. |
| `MATH-TEST-016` | declividade 46% | 013 clamp; 002 hard rule. | 013 limita a 45; 002 bloqueia. | 013 produziria 1; 002 não calcula. | `CONFLITO_DOCUMENTAL`. | 013:189–195; 002:60–70. |
| `MATH-TEST-017` | solo exposto/cobertura 0%, 50%, 100% | `FORM-006`, `FORM-007` e `FORM-008`. | Scores unitários. | Solo exposto = 0/.5/1; risco de cobertura = 1/.5/0. | `ALINHAMENTO_DOCUMENTAL`. | `clamp` de 013 não tem limites escritos, mas entradas estão no domínio declarado. |
| `MATH-TEST-018` | percentuais -1% ou 101% | fórmulas percentuais e validação. | 002 bloqueia antes de calcular; 013 declara domínio 0–100 e não declara erro para cover. | Aplicação mecânica produziria score fora de 0–1 em `FORM-008`; comportamento contratual é indefinido, e 002 bloqueia. | `AMBIGUIDADE`/`DIVERGENCIA_DOCUMENTAL`. | Cálculo fora do domínio é apenas teste matemático, não regra proposta; 013:136–153; 002:60–70. |
| `MATH-TEST-019` | todas as normalizações | inventário de clipping. | 013: clamp em depth/infiltration/slope e chamada em exposed; 002: bloqueio e função base clamp. | Não há clipping final, de cover, de dimensões ou do IHFR explicitamente declarado. | `LACUNA`. | Ausência não autoriza adicionar clipping; 013:33–40, 65–71, 101–153, 189–194; 002:58–90. |
| `MATH-TEST-020` | 0, .25, .26, .50, .51, .75, .76, 1 | tabelas de classe. | Limites escritos. | 0/.25 baixo; .26/.50 moderado; .51/.75 alto; .76/1 crítico. | `ALINHAMENTO_DOCUMENTAL`. | Não testa valores entre os pares; 013:247–254; 002:170–178. |
| `MATH-TEST-021` | valores em (.25,.26), (.50,.51), (.75,.76) | união literal dos intervalos. | Nenhuma regra de arredondamento. | Três intervalos abertos não recebem classe. | `AMBIGUIDADE`. | Escala contínua presumida pelas fórmulas; efeito é `INFERENCIA`; fontes de classe citadas acima. |
| `MATH-TEST-022` | .255, .505, .755 | mapeamento literal sem arredondar. | Não especificado. | Todos ficam sem classe. | `AMBIGUIDADE`. | Arredondar para .26/.51/.76 seria regra nova; não aplicada. |
| `MATH-TEST-023` | cenário regional | soma exata das parcelas de 010. | Fonte apresenta IHFR .72 e “alto”. | Soma exata .7225; .72 é compatível com arredondamento a duas casas, mas a regra não é declarada. Ambas ficam em alto. | `AMBIGUIDADE`; arredondamento é `INFERENCIA`. | Não é possível distinguir arredondamento/truncamento/erro de apresentação; 010:150–168. |
| `MATH-TEST-024` | dimensão com 1 variável válida | mínimo de duas. | Dimensão `null` e excluída. | Regra é executável; denominador final diminui. | `FATO_DOCUMENTADO` + `INFERENCIA` sobre renormalização. | Entrada marcada obrigatória ainda pode estar ausente? não especificado; 013:220–231; 002:140–150. |
| `MATH-TEST-025` | 0 dimensão válida | `mean` das dimensões válidas. | 002 classifica score null como insuficiente, mas não define o resultado da média vazia. | Denominador zero/conjunto vazio; IHFR é não especificado. | `LACUNA`. | Não se atribuiu NaN, erro ou null por convenção; 002:140–178; 013:220–254. |
| `MATH-TEST-026` | uma variável não essencial ausente, dimensão ainda ≥2 | mean ignora null. | Cálculo prossegue. | Pesos internos dos restantes são renormalizados igualmente (`INFERENCIA`). | `ALINHAMENTO_DOCUMENTAL` com ambiguidade de obrigatoriedade. | Validade/required não definidos para todos os campos. |
| `MATH-TEST-027` | 4 de 5 essenciais presentes | regras de `data_quality`. | 013: 80% → high; 002: 4/5 → medium. | Saídas diferentes para a mesma completude. | `CONFLITO_DOCUMENTAL`. | Afeta output, não score; 013:233–245; 002:152–166. |
| `MATH-TEST-028` | enum fora do mapping | `enum_score`. | Não especificado. | Não há score, erro, fallback ou null declarado. | `LACUNA`. | Não se escolheu fallback; 002:86–90; 013:48–207. |
| `MATH-TEST-029` | número na unidade errada, mas dentro da faixa numérica | hard rules numéricas. | Unidades constam dos campos; validação de unidade não consta. | O valor pode passar pelas faixas documentadas apesar de semanticamente incompatível. | `LACUNA`; efeito `INFERENCIA`. | Nenhuma conversão/unidade foi inventada. |
| `MATH-TEST-030` | mapas compactação, APP, erosão, land use | confronto categórico. | Compactação alinha; APP regional é ternária; erosão 011 separa sulcos/voçoroca; urban só em 013. | Correspondência é parcial e não há conversão comum completa. | `DIVERGENCIA_DOCUMENTAL`. | Escopos geral/regional podem explicar parte; validação necessária. |
| `MATH-TEST-031` | parâmetros regionais aplicados fora do Baixo Itapecuru | regra de aplicabilidade. | Nenhuma regra operacional de território. | Não é possível decidir aplicação ou rejeição. | `LACUNA`/`PENDENCIA_DE_DECISAO`. | Não se presumiu limite geográfico; 010:3–9, 65–67, 223–225. |
| `MATH-TEST-032` | entradas ambientais idênticas em duas execuções | repetir steps 4–20. | Critério explícito de repetibilidade não consta. | Score/dimensões/classes cobertas são determinísticos (`INFERENCIA`); timestamp difere; empates de drivers e ordem das recomendações podem divergir. | `AMBIGUIDADE`. | Sem execução de implementação; apenas análise do fluxo declarado. |

### Síntese dos testes

- Testes executados: 32.
- Somas/equivalência/pesos: 4.
- Extremos e intermediário: 3.
- Limites/clamp/bloqueio numérico: 10.
- Classes/arredondamento: 4.
- Ausência/denominador/qualidade: 4.
- Categorias/unidades/aplicabilidade/repetibilidade: 5.
- Inventários transversais de clipping e mappings: 2.
- Comportamentos indefinidos confirmados: média vazia, categorias desconhecidas, unidade incorreta, três lacunas de classe, regra de arredondamento, território regional operacional, desempate e parte das ausências/obrigatoriedades.

## Achados

| ID | Título | Tipo | Impacto | Estado | Classificação | Fontes e evidências | Descrição/efeito | Decisão ou validação necessária; pendência/destino |
|---|---|---|---|---|---|---|---|---|
| `MATH-FND-001` | Núcleo de 16 variáveis alinhado | `ALINHAMENTO_DOCUMENTAL` | `INFORMATIVO` | `INFORMATIVO` | `FATO_DOCUMENTADO` + `INFERENCIA` transversal | 013:42–207; 002:15–48, 92–138. | Dezesseis `VAR-NNN` têm nomes/tipos ou papéis correspondentes em contrato e algoritmo; a relação documental não é declarada. | Confirmar futura dependência/precedência; `PD-002`; Etapa 8. |
| `MATH-FND-002` | Formulações equivalentes gerais | `ALINHAMENTO_DOCUMENTAL` | `INFORMATIVO` | `INFORMATIVO` | `FATO_DOCUMENTADO` + `INFERENCIA` matemática | `FORM-001`, `FORM-002`, `MATH-TEST-001` e `MATH-TEST-003`; 007:75–90; 008:102–121; 013:18–29. | Média simples e quatro pesos .25 são algebricamente equivalentes; somente 008/013 declaram pesos equivalentes/iguais. | Preservar distinção literal/inferida; futura validação em `PD-002`. |
| `MATH-FND-003` | Pesos gerais versus regionais | `DIVERGENCIA_DOCUMENTAL` | `BLOQUEANTE_PARA_NORMATIZACAO` | `AGUARDANDO_VALIDACAO_CIENTIFICA` | `FATO_DOCUMENTADO` + `INFERENCIA` comparativa | `FORM-001`, `FORM-002`, `FORM-003` e `MATH-TEST-004`; 010:111–128; 011:223–238. | Esquemas produzem resultados diferentes; 010/011 têm recorte regional que pode explicar a diferença, mas a relação não é declarada. | Escolher/relacionar somente por autoridade científica; `PD-002`; `SCI-FND-011`, `SCI-Q-009`; Etapa 8. |
| `MATH-FND-004` | Relação geral–regional não definida | `AMBIGUIDADE` | `BLOQUEANTE_PARA_NORMATIZACAO` | `AGUARDANDO_VALIDACAO_CIENTIFICA` | `NAO_ESPECIFICADO` + `INFERENCIA` | 008:104–121, 162–171; 010:3–5,65–128,223–225; 013:1–31. | Nenhuma fonte diz se a calibração especializa, substitui, complementa ou sucede a v0.1 geral. | Autoridade/aplicabilidade/versão; `PD-001`, `PD-002`; `SCI-Q-011`; Etapa 8. |
| `MATH-FND-005` | Clamp versus bloqueio | `CONFLITO_DOCUMENTAL` | `BLOQUEANTE_PARA_NORMATIZACAO` | `ABERTO` | `FATO_DOCUMENTADO` + `INFERENCIA` comparativa | 013:65–71,101–107,189–194; 002:58–70; `MATH-TEST-010`, `MATH-TEST-013` e `MATH-TEST-016`. | Para a mesma entrada fora da faixa, o contrato limita e calcula, enquanto o algoritmo bloqueia; altera comportamento operacional. | Definir precedência e regra; `PD-002` e futura autoridade operacional/produto; Etapa 8. |
| `MATH-FND-006` | `data_quality` diverge em 4/5 | `CONFLITO_DOCUMENTAL` | `ALTO` | `ABERTO` | `FATO_DOCUMENTADO` | 013:233–245; 002:152–166; `MATH-TEST-027`. | Quatro essenciais preenchidos geram high no contrato e medium no algoritmo. | Definir regra de v0.1; `PD-002`, com impacto futuro em produto/dados (`PD-003` e `PD-004`). |
| `MATH-FND-007` | Obrigatoriedade versus tolerância a ausências | `AMBIGUIDADE` | `ALTO` | `ABERTO` | `FATO_DOCUMENTADO` + `NAO_ESPECIFICADO` | 013:40,42–218,220–230; 002:15–48,86–90,140–150. | Poucos campos são marcados opcionais, mas `mean` ignora null e mínimo 2 sugere ausência tolerável; regra por campo não existe. | Definir required/optional/null; `PD-002`, futuros produto/dados. |
| `MATH-FND-008` | Composição territorial não reconciliada | `DIVERGENCIA_DOCUMENTAL` | `BLOQUEANTE_PARA_NORMATIZACAO` | `AGUARDANDO_VALIDACAO_CIENTIFICA` | `FATO_DOCUMENTADO` | 007:65–69; 008:90–100; 009:64–68; 013:183–218; 002:42–48,131–138. | Densidade de drenagem/intervenção/organização não aparecem no contrato/algoritmo; `area_size_ha` aparece sem risco e não é substituição declarada. | Validar composição; `PD-002`; `SCI-FND-003`, `SCI-Q-001`; Etapa 8. |
| `MATH-FND-009` | Validação de enum e unidade ausente | `LACUNA` | `ALTO` | `ABERTO` | `NAO_ESPECIFICADO` + `INFERENCIA` de efeito | 002:58–90; 013:42–218; `MATH-TEST-028` e `MATH-TEST-029`. | Hard rules cobrem faixas numéricas, mas não categorias desconhecidas, unidades, formatos ou coerência de tipos. | Definir contrato de validação; `PD-002`, futuros produto/dados; Etapa 8. |
| `MATH-FND-010` | Média de disponíveis e conjunto vazio | `AMBIGUIDADE` | `BLOQUEANTE_PARA_NORMATIZACAO` | `ABERTO` | `FATO_DOCUMENTADO` + `NAO_ESPECIFICADO` + `INFERENCIA` | `FORM-010`, `FORM-014`, `MATH-TEST-024`, `MATH-TEST-025` e `MATH-TEST-026`; 013:220–231; 002:86–90,140–178. | Pesos internos/finais são renormalizados entre disponíveis; nenhuma dimensão válida deixa denominador/resultado sem definição. | Definir mínimo global, erro/null e denominadores; `PD-002`. |
| `MATH-FND-011` | Faixas classificatórias descontínuas | `AMBIGUIDADE` | `BLOQUEANTE_PARA_NORMATIZACAO` | `AGUARDANDO_VALIDACAO_CIENTIFICA` | `FATO_DOCUMENTADO` + `INFERENCIA` | 013:247–254; 002:170–178; 007:92–99; 008:123–132; 011:240–247; `MATH-TEST-020`, `MATH-TEST-021` e `MATH-TEST-022`. | Valores contínuos entre .25/.26, .50/.51 e .75/.76 não têm classe sem regra de precisão. | Validar faixas e arredondamento; `PD-002`; `SCI-FND-012`, `SCI-Q-010`. |
| `MATH-FND-012` | Parâmetros regionais sem método empírico | `LACUNA` | `BLOQUEANTE_PARA_NORMATIZACAO` | `AGUARDANDO_VALIDACAO_CIENTIFICA` | `NAO_ESPECIFICADO` | `REG-PAR-001` a `013`; 010:7–128. | Não constam dados, amostra, método, incerteza, referência, calibração ou validação. | Responsáveis científicos devem validar/prover evidência; `PD-002`; Etapa 8. |
| `MATH-FND-013` | Território regional não operacionalizado | `LACUNA` | `BLOQUEANTE_PARA_NORMATIZACAO` | `AGUARDANDO_VALIDACAO_CIENTIFICA` | `FATO_DOCUMENTADO` + `NAO_ESPECIFICADO` | 010:3–9,65–67,223–225; 011:5–21; `MATH-TEST-031`. | O nome regional não fornece limites geográficos verificáveis nem regra de aplicação. | Confirmar escopo/autoridade; `PD-001`, `PD-002`; Etapa 8. |
| `MATH-FND-014` | APP binária versus ternária regional | `DIVERGENCIA_DOCUMENTAL` | `ALTO` | `AGUARDANDO_VALIDACAO_CIENTIFICA` | `FATO_DOCUMENTADO` | 013:163–166; 002:39,124; 010:101–109; 011:172–180; `MATH-TEST-030`. | Geral usa bool .2/.85; regional usa preservada/parcial/ausente .2/.6/.9. Escopo pode explicar, mas conversão/precedência não. | Validar variável e ajuste; `PD-002`; `SCI-FND-005`, `SCI-Q-003`. |
| `MATH-FND-015` | Exemplo regional sem regra de arredondamento | `AMBIGUIDADE` | `MEDIO` | `ABERTO` | `FATO_DOCUMENTADO` + `INFERENCIA` matemática | 010:141–168; `FORM-015`; `MATH-TEST-023`. | Parcelas somam .7225 e a fonte apresenta .72; classe não muda, mas precisão não é reproduzível documentalmente. | Definir precisão/arredondamento; `PD-002`. |
| `MATH-FND-016` | Contrato de saída não uniforme | `DIVERGENCIA_DOCUMENTAL` | `MEDIO` | `ENCAMINHADO_A_ETAPA_POSTERIOR` | `FATO_DOCUMENTADO` + `INFERENCIA` de correspondência | 013:7–14; 002:170–178,236–264. | `ihfr_explanation` versus `explanation`; insuficiente só em 002; intermediários/timestamp persistidos mas não retornados. | Definir nomes e saídas obrigatórias; `PD-003` e `PD-004`; Etapa 8. |
| `MATH-FND-017` | Drivers, textos e recomendações incompletamente determinados | `AMBIGUIDADE` | `MEDIO` | `ABERTO` | `FATO_DOCUMENTADO` + `NAO_ESPECIFICADO` | 002:180–234; 013:256–278; `MATH-TEST-032`. | Desempate, menos de dois drivers, composição/ordem, duplicidade e classe insuficiente não têm regra. | Definir contrato operacional sem inventar conteúdo; `PD-002` e `PD-003`; Etapa 8. |
| `MATH-FND-018` | Trilha de auditoria explicitamente prevista | `ALINHAMENTO_DOCUMENTAL` | `INFORMATIVO` | `INFORMATIVO` | `FATO_DOCUMENTADO` | 002:236–264; 013:7–14. | Raw, scores, dimensões, score, classe, texto, recomendações, qualidade, versão e timestamp são previstos. | Preservar; futura especificação de formato/dados sob `PD-004`. |
| `MATH-FND-019` | Reprodutibilidade completa não especificada | `LACUNA` | `ALTO` | `ENCAMINHADO_A_ETAPA_POSTERIOR` | `NAO_ESPECIFICADO` + `INFERENCIA` | 002:79–275; `MATH-TEST-032`. | Núcleo numérico é determinístico para entradas válidas, mas precisão, desempate, ordem, timestamp, versionamento regional e erros impedem contrato reprodutível completo. | Definir requisitos de reprodutibilidade; `PD-002` e `PD-004`; Etapa 8. |
| `MATH-FND-020` | Validação científica continua pendente | `PENDENCIA_DE_VALIDACAO_CIENTIFICA` | `BLOQUEANTE_PARA_NORMATIZACAO` | `AGUARDANDO_VALIDACAO_CIENTIFICA` | `PENDENCIA_DE_DECISAO` | `SOURCE_AUTHORITY.md`; `PD-002`; ausência de aprovação nas sete fontes. | Nenhuma fórmula, variável, faixa, peso, parâmetro ou regra pode ser promovida por esta auditoria. | Designar/registrar autoridade e validação em `PD-002`; nenhum documento normativo atualizado. |

### Aplicação do critério estrito de conflito

Somente `MATH-FND-005` e `MATH-FND-006` foram classificados como `CONFLITO_DOCUMENTAL`:

1. contrato e algoritmo tratam dos mesmos campos/saídas da v0.1;
2. clamp versus bloqueio e high versus medium são regras simultaneamente incompatíveis;
3. não há versão, território ou aplicabilidade que as reconcilie;
4. a escolha altera cálculo/comportamento operacional ou saída.

Pesos equivalentes versus diferenciais ficaram como divergência/ambiguidade, porque 010/011 declaram recorte regional que pode explicar a diferença, embora sua relação com a v0.1 geral permaneça não confirmada. A revisão humana posterior reclassificou `SCI-FND-011` como divergência; `MATH-FND-003` e `MATH-FND-004` aprofundam essa interpretação sem alterar suas próprias classificações, sem definir a relação geral–regional e sem escolher fórmula ou pesos.

### Contagens dos achados

| Tipo | Quantidade |
|---|---:|
| `ALINHAMENTO_DOCUMENTAL` | 3 |
| `DIVERGENCIA_DOCUMENTAL` | 4 |
| `CONFLITO_DOCUMENTAL` | 2 |
| `AMBIGUIDADE` | 6 |
| `LACUNA` | 4 |
| `NAO_COMPARAVEL` | 0 |
| `PENDENCIA_DE_VALIDACAO_CIENTIFICA` | 1 |
| **Total** | **20** |

| Impacto | Quantidade |
|---|---:|
| `BLOQUEANTE_PARA_NORMATIZACAO` | 9 |
| `ALTO` | 5 |
| `MEDIO` | 3 |
| `BAIXO` | 0 |
| `INFORMATIVO` | 3 |
| **Total** | **20** |

| Estado | Quantidade |
|---|---:|
| `ABERTO` | 7 |
| `AGUARDANDO_VALIDACAO_CIENTIFICA` | 8 |
| `ENCAMINHADO_A_ETAPA_POSTERIOR` | 2 |
| `INFORMATIVO` | 3 |
| **Total** | **20** |

Achados bloqueantes para futura normatização: `MATH-FND-003`, `004`, `005`, `008`, `010`, `011`, `012`, `013` e `020`. Eles não bloqueiam a conclusão documental desta Etapa 5.

## Perguntas para validação científica

Nenhuma pergunta é respondida nesta auditoria.

| ID | Achados | Pergunta | Assunto/destino |
|---|---|---|---|
| `MATH-Q-001` | `MATH-FND-002` e `MATH-FND-003` | Qual fórmula deve ser validada como composição da versão `IHFR_v0.1`, e qual fonte registra essa aprovação? | Fórmula oficial futura; `PD-002`. |
| `MATH-Q-002` | `MATH-FND-003` | A média simples/pesos equivalentes e os pesos .35/.30/.25/.10 representam versões, territórios ou finalidades diferentes? | Pesos e versões; `SCI-Q-009`. |
| `MATH-Q-003` | `MATH-FND-004` | A calibração regional especializa, complementa, substitui ou apenas propõe uma alternativa ao modelo geral? | Relação geral–regional; Etapa 8. |
| `MATH-Q-004` | `MATH-FND-004`, `MATH-FND-012` e `MATH-FND-020` | Quem possui autoridade para aprovar a calibração e qual registro comprovará a validação? | Autoridade; `PD-002`. |
| `MATH-Q-005` | `MATH-FND-013` | Quais limites geográficos e critérios operacionais definem o Baixo Itapecuru para aplicação da calibração? | Território; `PD-001` e `PD-002`. |
| `MATH-Q-006` | `MATH-FND-012` | Quais dados, amostra, período, método, incerteza e validação sustentam cada `REG-PAR-NNN`? | Evidência empírica. |
| `MATH-Q-007` | `MATH-FND-005` e `MATH-FND-009` | Entradas numéricas fora da faixa devem ser bloqueadas, limitadas por clamp ou tratadas de outra forma, e em que ordem? | Normalização/clipping/validação. |
| `MATH-Q-008` | `MATH-FND-011` e `MATH-FND-015` | Qual precisão deve ser mantida e qual regra de arredondamento ou truncamento ocorre antes da classe, exibição e persistência? | Arredondamento. |
| `MATH-Q-009` | `MATH-FND-011` | Como devem ser definidos intervalos contínuos que cubram valores entre .25/.26, .50/.51 e .75/.76? | Faixas classificatórias. |
| `MATH-Q-010` | `MATH-FND-007` e `MATH-FND-010` | Quais variáveis são obrigatórias/opcionais, como representar missing e como a ausência altera denominadores? | Dados faltantes. |
| `MATH-Q-011` | `MATH-FND-010` | Quantas variáveis por dimensão e quantas dimensões globais são necessárias; qual saída ocorre quando nenhuma dimensão é válida? | Mínimos/denominador zero. |
| `MATH-Q-012` | `MATH-FND-008` e `MATH-FND-019` | Como agregar pontos e unidades homogêneas em unidade, propriedade, comunidade ou microbacia antes do IHFR? | Agregação espacial; `SCI-Q-005`. |
| `MATH-Q-013` | `MATH-FND-009` | Como tratar categoria desconhecida, tipo inválido, unidade incorreta, conversão de unidade e valor não finito? | Contrato de validação. |
| `MATH-Q-014` | `MATH-FND-005` | Em divergência entre contrato matemático e algoritmo operacional, qual documento/versão tem precedência e como registrar exceções regionais? | Precedência documental; Etapa 8. |
| `MATH-Q-015` | `MATH-FND-017` e `MATH-FND-019` | Quais requisitos de repetibilidade, desempate, ordenação, precisão e versionamento se aplicam a score, drivers, textos e recomendações? | Reprodutibilidade. |
| `MATH-Q-016` | `MATH-FND-016` e `MATH-FND-018` | Quais saídas são obrigatórias, quais nomes canônicos usar e como representar resultado insuficiente, diagnóstico, intermediários e timestamp? | Contrato de saída; `PD-003` e `PD-004`. |
| `MATH-Q-017` | `MATH-FND-006` | Para quatro de cinco campos essenciais, `data_quality` deve ser high ou medium, e “confiança” depende de algo além da completude? | Qualidade do dado. |
| `MATH-Q-018` | `MATH-FND-014` | APP/mata ciliar deve ser binária ou ternária, quais scores se aplicam e a regra é geral ou regional? | Parâmetro/variável regional; `SCI-Q-003`. |

Quantidade: 18 perguntas, cobrindo fórmula, pesos, relação geral–regional, autoridade, território, evidência empírica, normalizações, clipping, arredondamento, classes, ausências, mínimos, agregação, categorias/unidades, precedência, reprodutibilidade, saídas e APP.

## Rastreabilidade com a Etapa 4

| E5 | SCI relacionado | Fórmulas/variáveis/parâmetros/passos/testes | Achados/perguntas desta etapa | Resultado de rastreabilidade |
|---|---|---|---|---|
| `E5-001` | `SCI-FND-011`; `SCI-Q-009` | `FORM-001`, `FORM-002`, `FORM-003`, `FORM-014`, `FORM-015`; `MATH-TEST-001` a `MATH-TEST-007` | `MATH-FND-002`, `MATH-FND-003`, `MATH-FND-004`; `MATH-Q-001`, `MATH-Q-002`, `MATH-Q-003` | Formulações catalogadas sem escolha. |
| `E5-002` | `SCI-FND-011`; `SCI-Q-009` | `REG-PAR-009` a `REG-PAR-012`; `MATH-TEST-001` a `MATH-TEST-004` | `MATH-FND-003`, `MATH-FND-004`; `MATH-Q-002`, `MATH-Q-004` | Pesos gerais e regionais distinguidos. |
| `E5-003` | `SCI-FND-010`; `SCI-Q-008` | `FORM-004` a `FORM-009` e `FORM-016`; `VAR-001` a `VAR-017`; `ALG-STEP-004` e `ALG-STEP-006` | `MATH-FND-005`, `MATH-FND-009`; `MATH-Q-007`, `MATH-Q-013` | Normalizações e validações confrontadas. |
| `E5-004` | `SCI-FND-012`; `SCI-Q-010` | Classes; `ALG-STEP-014`; `MATH-TEST-020` a `MATH-TEST-023` | `MATH-FND-011`, `MATH-FND-015`; `MATH-Q-008`, `MATH-Q-009` | Faixas e gaps documentados. |
| `E5-005` | `SCI-FND-012`; `SCI-Q-010` | `FORM-015`; `MATH-TEST-021`, `MATH-TEST-022`, `MATH-TEST-023` | `MATH-FND-011`, `MATH-FND-015`; `MATH-Q-008` | Arredondamento permanece ausente. |
| `E5-006` | `SCI-FND-009`; `SCI-Q-007` | `FORM-010` a `FORM-014`; `ALG-STEP-011` e `ALG-STEP-012`; `MATH-TEST-024` a `MATH-TEST-027` | `MATH-FND-006`, `MATH-FND-007`, `MATH-FND-010`; `MATH-Q-010`, `MATH-Q-011`, `MATH-Q-017` | Missing, mínimos, denominador e qualidade confrontados. |
| `E5-007` | `SCI-FND-013` | `REG-PAR-001` a `REG-PAR-013`; `MATH-TEST-031` | `MATH-FND-012`, `MATH-FND-013`, `MATH-FND-014`; `MATH-Q-004`, `MATH-Q-005`, `MATH-Q-006`, `MATH-Q-018` | Calibração inventariada sem validação. |
| `E5-008` | `SCI-FND-013` e `SCI-FND-014`; `SCI-Q-011` | Tabela de pesos; `REG-PAR-001` a `REG-PAR-013` | `MATH-FND-003`, `MATH-FND-004`, `MATH-FND-013`; `MATH-Q-003`, `MATH-Q-005` | Relação geral–regional e escalas permanecem pendentes. |
| `E5-009` | `SCI-FND-010`; `SCI-Q-008` | `VAR-001` a `VAR-017`; `ALG-STEP-001` a `ALG-STEP-014`; `MATH-TEST-028` a `MATH-TEST-030` | `MATH-FND-001`, `MATH-FND-005`, `MATH-FND-007`, `MATH-FND-008`, `MATH-FND-009`; `MATH-Q-007`, `MATH-Q-010`, `MATH-Q-013`, `MATH-Q-014` | Cadeia entrada→score→dimensão→IHFR reconstruída. |
| `E5-010` | `SCI-FND-019` | `ALG-STEP-015` a `ALG-STEP-021`; contrato de saída; `MATH-TEST-032` | `MATH-FND-016`, `MATH-FND-017`, `MATH-FND-018`, `MATH-FND-019`; `MATH-Q-015`, `MATH-Q-016` | Saídas, explicações, recomendações e trilha inventariadas. |

Todas as referências `VAR-NNN` permanecem as 17 chaves definidas em `DOC-009`; não foram convertidas em identificadores normativos.

## Candidatos e encaminhamentos futuros

### Relações candidatas para futura atualização da matriz

- `RECOMENDACAO` — Revisar `TR-006`: 16 das 17 variáveis de 007 têm correspondência explícita de assunto em 013, enquanto densidade de drenagem não aparece e `area_size_ha` surge sem risco; manter a relação como inferencial até declaração/autoridade.
- `RECOMENDACAO` — Revisar `TR-007`: 008 e 013 apresentam formulações equivalentes da v0.1; a equivalência é matemática/documental, não prova dependência ou precedência.
- `RECOMENDACAO` — Revisar `TR-008`: 010 apresenta formulação regional diferencial perante 013; registrar a divergência e o escopo sem afirmar substituição.
- `RECOMENDACAO` — Revisar `TR-009`: 013 e 002 compartilham entradas, versão e fluxo, mas clamp/data quality divergem; não promover dependência sem evidência explícita.
- `RECOMENDACAO` — Avaliar uma relação candidata inferencial entre 010 e 011 pela igualdade da fórmula regional e dos parâmetros de infiltração/cobertura/APP, sem declarar derivação.

Nenhuma dessas relações foi aplicada a `TRACEABILITY_MATRIX.md`.

### Lacunas candidatas

- Regra de precedência e versionamento geral–regional.
- Método/evidência/autoridade e limites geográficos da calibração.
- Clamp versus bloqueio e validação de categorias/unidades.
- Obrigatoriedade, mínimo global, conjunto vazio e denominadores.
- Regra contínua de classes, precisão e arredondamento.
- Divergência de `data_quality` e de nomes/cardinalidade de saída.
- Agregação de unidades de paisagem e requisitos de reprodutibilidade.

### Pendências existentes e possíveis pendências novas

- `PD-002` cobre validação de regras, variáveis, cálculo, pesos, parâmetros, faixas e autoridade científica.
- `PD-001` é pertinente aos limites de aplicação regional.
- `PD-003` e `PD-004` serão pertinentes ao contrato de saídas, validação e qualidade de dados, sem atualização nesta etapa.
- Nenhuma questão inteiramente nova exigiu criar pendência; `PENDING_DECISIONS.md` permaneceu inalterado.

### Possíveis documentos normativos futuros

- `RECOMENDACAO` — Contrato matemático normativo e versionado, após validação científica.
- `RECOMENDACAO` — Especificação de calibração regional com território, método, evidência, parâmetros, incerteza e aprovação.
- `RECOMENDACAO` — Algoritmo operacional normativo com validações, erros, missing, precisão, determinismo e payload.
- `RECOMENDACAO` — Especificação de reprodutibilidade e conjunto de testes de referência.
- `RECOMENDACAO` — Contrato de qualidade e proveniência dos dados científicos.

### Assuntos destinados à consolidação transversal da Etapa 8

- Precedência e versionamento entre modelo geral, contrato, calibração e algoritmo.
- Limites institucionais/geográficos e autoridades (`PD-001` e `PD-002`).
- Efeitos do contrato científico sobre produto e dados (`PD-003` e `PD-004`).
- Destino normativo de fórmulas, parâmetros, validações, saídas e trilha.
- Revisão dos candidatos de matriz somente após aprovação apropriada.

## Resultados quantitativos consolidados

| Item | Quantidade |
|---|---:|
| Fontes primárias lidas integralmente | 3 |
| Linhas físicas das fontes primárias | 777 |
| Fontes auxiliares consultadas nas seções pertinentes | 4 |
| Símbolos/termos inventariados | 20 |
| Famílias/ocorrências de fórmula catalogadas | 16 |
| Variáveis `VAR-NNN` confrontadas | 17 |
| Entradas adicionais | 7 |
| Dimensões | 4 |
| Parâmetros/ajustes regionais | 13 |
| Passos algorítmicos | 21 |
| Saídas/tipos de saída inventariados | 12 |
| Testes documentais e matemáticos | 32 |
| Achados | 20 |
| Perguntas | 18 |
| Encaminhamentos `E5-NNN` cobertos | 10/10 |

## Limitações e ponto de parada

- Esta é uma auditoria documental interna; não avalia mérito científico externo.
- Ausência significa apenas “não localizado no corpus autorizado”.
- Os outros seis documentos de `docs/raw/`, fontes externas, código, banco, testes e implementação não foram auditados.
- A ferramenta `rg` estava indisponível e foi substituída por `grep`, `awk`, `sed`, `find` e utilitários existentes, sem instalação.
- O comando efêmero de cálculo verificou somente aritmética; não constituiu implementação nem artefato do projeto.
- `PD-002` permanece aberta e bloqueia qualquer promoção normativa científica.
- `TRACEABILITY_MATRIX.md`, `PENDING_DECISIONS.md`, documentação normativa e `docs/raw/` permaneceram fora do escopo de alteração.

O relatório permanece em `EM_REVISAO`. Nenhuma fórmula, peso, faixa, parâmetro, comportamento ou saída foi declarada oficial. A Etapa 6 não foi iniciada.
