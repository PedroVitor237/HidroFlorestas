# Ambiguidades documentais do HidroFlorestas e decisões adotadas

**Destinatário:** professor Fábio Mesquita de Souza.

**Data de corte:** 1º de outubro de 2026, America/Fortaleza.

**Base examinada:** `development`, commit `68328682cf2990d787b596493999330602e63cd3`, acrescida do relato do solicitante sobre o mapa em produção nesta data.

**Estado:** relatório documental entregue para revisão; não constitui parecer científico nem nova decisão de produto. Elaboração: Codex, sob solicitação do usuário.

## 1. Finalidade e conclusão principal

Os documentos históricos do HidroFlorestas apresentam alternativas que não poderiam ser combinadas automaticamente em um único sistema: há diferenças de fórmula, categorias, tratamento de dados ausentes e significado de alguns termos. A equipe registrou decisões que permitiram implementar uma primeira versão experimental, mantendo as alternativas disponíveis para avaliação posterior.

O ponto central para a discussão com o professor é distinguir duas perguntas: **o programa executa uma regra definida de maneira reproduzível?** e **essa regra representa adequadamente o fenômeno ambiental no território estudado?** As decisões de engenharia e os testes dão suporte à primeira. A segunda continua dependendo de revisão especializada, calibração e campo, conforme [ADR-0001](../../governance/ADR-0001-contrato-experimental-ihfr-v0-1.md) e `PD-002` no [registro de pendências](../../governance/PENDING_DECISIONS.md).

O IHFR v0.1 mantém os qualificadores **`CONTRATO_EXPERIMENTAL`**, **`VALIDACAO_CIENTIFICA_PENDENTE`**, **`SUJEITO_A_RECALIBRACAO`** e **`NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO`**. O perfil denominado `GENERAL_EXPERIMENTAL` não comprova universalidade nem validade territorial.

## 2. Como as fontes foram usadas

A base principal foi a [política de autoridade](../../governance/SOURCE_AUTHORITY.md), o [inventário documental](../../governance/DOCUMENT_REGISTER.md), a [auditoria consolidada de 26/08](../audits/2026-08-26-auditoria-documental-consolidada.md), os [registros técnicos](../../../TECH_DECISIONS.md), as pendências e o ADR-0001. As auditorias anteriores ajudam a localizar questões; sua aprovação analítica não é aprovação científica. Os exemplos abaixo foram reconferidos nos arquivos originais, preservados sem edição.

Neste texto, **`FATO_DOCUMENTADO`** identifica o que a fonte declara; **`DECISAO_CONFIRMADA`** identifica uma escolha com origem registrada; **`PENDENCIA_DE_DECISAO`** identifica o que ainda depende de autoridade ou validação; **`INFERENCIA`** e **`RECOMENDACAO`** delimitam conclusões e orientações do agente. A expressão `DECISAO_EXPERIMENTAL_DE_ENGENHARIA`, quando atribuída ao ADR, conserva sua qualificação específica.

“Resolvido no recorte” significa que existe regra suficiente para aquela entrega. “Provisório para ciência” significa que a regra pode ser executada, mas ainda precisa de validação científica. Nenhum desses estados encerra automaticamente todas as pendências globais.

O ADR registra que a equipe informou, em 18/09/2026, a concepção histórica do IHFR pelo professor Fábio Mesquita e autorizou sua utilização experimental. Isso não identifica a autoria material de cada arquivo histórico nem atribui ao professor todas as decisões de engenharia posteriores.

## 3. Questões científicas e matemáticas

### 3.1 Pesos iguais ou maior peso para água e solo?

**FATO_DOCUMENTADO.** O [contrato matemático, §1, L16–31](../../raw/specificacao-do-ihfr-v0-1-mvp-contrato-matematico.md) define 25% para cada dimensão. A [especificação técnica, §3, L49–68](../../raw/especificacao-tecnica-sistema-plataforma-hidroflorestas-mvp.md) e o [modelo regional, §4, L111–128](../../raw/modelo-regional-do-ihfr-calibracao-ecologica-baixo-itapecuru-maranhao.md) apresentam 35% para água, 30% para solo, 25% para vegetação e 10% para território. O [protocolo de campo, §10](../../raw/protocolo-de-campo-do-ihfr.md) também apresenta a composição ponderada. A matriz de variáveis, §5, usa média simples.

**INFERENCIA — consequência prática.** As fórmulas podem produzir resultados diferentes para as mesmas observações; misturar pesos de uma fonte com regras de outra criaria uma terceira formulação sem aprovação.

**Decisão e justificativa.** Em 18/09, a equipe selecionou o contrato matemático `DOC-RAW-013` como base experimental versionada, com pesos iguais e menor necessidade de composição entre fontes. A decisão está no ADR §§1, 4 e 5 e em `TD-015`. O perfil regional foi preservado, inativo, para comparação e eventual nova versão.

**Estado:** resolvido para engenharia da v0.1; provisório para ciência. A definição dos pesos adequados ao território continua dependente de evidência e calibração. Referências de auditoria: `CON-FND-003` e `CON-FND-023`.

### 3.2 Valor acima do limite: bloquear ou limitar sua influência no cálculo?

**FATO_DOCUMENTADO.** O contrato matemático, §§3.1, 3.2 e 3.4, prevê limitar a normalização de profundidade e infiltração a 60 e de declividade a 45. Já o [algoritmo operacional, §3.1, L58–70](../../raw/algoritmo-operacional-hidroflorestas-mvp.md) determina bloquear o cálculo quando os valores saem dessas faixas. A especificação técnica, §§4.2 e 4.4, também apresenta faixas discretas, diferentes das funções contínuas do contrato.

**INFERENCIA — consequência prática.** Uma infiltração registrada acima de 60 mm/h poderia impedir o cálculo em uma interpretação e receber o score do teto em outra.

**Decisão e justificativa.** O ADR §5, pela decisão de 18/09, usa `clamp` somente na normalização: limita o valor utilizado para pontuar, preservando a medição bruta aceita pelo contrato técnico de captura. Não é autorização para aceitar qualquer valor inválido. Tipos, categorias e domínios da entrada continuam sujeitos a validação. As alternativas de bloqueio e de faixas discretas permanecem documentadas.

**Estado:** resolvido para execução experimental; direção das curvas, tetos e protocolos de medição permanecem sujeitos a especialistas e campo. Referências: `CON-FND-011` e `CON-FND-012`.

### 3.3 Dados incompletos: recalcular os pesos ou declarar insuficiência?

**FATO_DOCUMENTADO.** O contrato matemático, §4, L220–230, e o algoritmo operacional, §§5.4–6, excluem da média final dimensões com menos de duas variáveis válidas. Isso convive com a fórmula inicial de quatro pesos iguais. A [matriz de variáveis, §4, L61–69](../../raw/matriz-de-variaveis-do-ihfr.md) inclui densidade de drenagem, enquanto o contrato matemático pontua declividade e uso da terra; tamanho da área é contextual.

**INFERENCIA — consequência prática.** Excluir uma dimensão altera a contribuição relativa das restantes. Usar drenagem para completar território também exigiria uma função que a base escolhida não fornece integralmente.

**Decisão e justificativa.** O ADR §§4.2, 5 e 6 exige as quatro dimensões suficientes, cada qual com pelo menos dois scores. Território exige declividade e uso da terra. Se faltar uma dimensão, a tentativa resulta em `INSUFFICIENT_DATA`, sem produzir diagnóstico vigente e sem redistribuir pesos. Essa é uma resolução explícita da equipe, não uma transcrição integral da política de ausências de `DOC-RAW-013`. Drenagem e elevação não pontuam na versão; tamanho não altera o risco.

A clarificação de 20/09 distingue ausência permitida de campo conhecido de entrada desconhecida: ausência opcional pode ser excluída da média interna; campo ou categoria desconhecidos são inválidos. Ausência não vira zero, e `false` continua sendo uma observação válida.

**Estado:** resolvido para engenharia; suficiência científica, variáveis e política de ausência permanecem provisórias. Referências: `CON-FND-004`, `CON-FND-010` e `CON-FND-013`.

### 3.4 Quatro de cinco campos essenciais significam qualidade alta ou média?

**FATO_DOCUMENTADO.** O contrato matemático, §4, L233–245, define qualidade alta a partir de 80% dos essenciais. O algoritmo operacional, §6.1, L152–168, exige cinco de cinco para alta e classifica três ou quatro como média. Os cinco campos são infiltração, compactação, cobertura vegetal, uso da terra e disponibilidade hídrica.

**Decisão e justificativa.** A equipe adotou no ADR §§4.3 e 5 o limiar proporcional da fonte-base: quatro de cinco, equivalentes a 80%, recebem `HIGH`. Qualidade não substitui a exigência de suficiência de todas as dimensões. A alternativa de alta somente com cinco campos foi preservada.

**Estado:** resolvido para engenharia; provisório para ciência. O indicador mede completude segundo a regra experimental; não comprova precisão do diagnóstico ou confiança estatística. Referência: `CON-FND-014`.

### 3.5 Onde ficam valores entre os intervalos publicados?

**FATO_DOCUMENTADO.** O contrato matemático, §5, e a matriz, §6, mostram faixas como 0,00–0,25 e 0,26–0,50, sem fechar o tratamento de valores intermediários nem o momento do arredondamento.

**INFERENCIA — exemplo explicativo.** Um resultado interno de 0,255 fica entre as duas faixas escritas. Este exemplo ilustra a lacuna; não é medição de campo.

**Decisão e justificativa.** O ADR §4.3 fecha os intervalos: baixo até 0,25 inclusive; moderado acima de 0,25 até 0,50; alto acima de 0,50 até 0,75; crítico acima de 0,75 até 1. A classificação usa o valor interno, sem arredondamento intermediário. Só a apresentação usa duas casas decimais, com arredondamento decimal *half up*.

**Estado:** ambiguidade operacional resolvida; limiares científicos continuam experimentais. Referência: `CON-FND-015`.

### 3.6 Uso da terra: seis ou sete categorias, e quais scores?

**FATO_DOCUMENTADO.** As fontes conferidas apresentam:

| Categoria | Especificação técnica §4.11, L161–169 | Matriz §4, L61–69 | Contrato matemático §3.4, L196–207 |
|---|---:|---:|---:|
| Floresta | 0,10 | 0,20 | 0,20 |
| Sistema agroflorestal (SAF) | 0,20 | 0,25 | 0,25 |
| Agricultura | 0,60 | 0,60 | 0,60 |
| Pastagem | 0,70 | 0,65 | 0,65 |
| Pastagem degradada | 0,90 | 0,80 | 0,80 |
| Solo exposto | 1,00 | 0,95 | 0,95 |
| Urbano | não listado | não listado | 0,70 |

O protocolo de campo, §8, L182–208, apresenta seis categorias qualitativas e orienta registrar o uso predominante, sem fornecer sozinho todos os scores numéricos necessários.

**Decisão e justificativa.** A decisão focal da equipe de 19/09, registrada no ADR §7 e em `TD-016`, escolheu as sete categorias e os scores do contrato matemático. A justificativa “mais completa” é específica: essa fonte reúne domínio completo, scores, direção do risco, composição territorial e essencialidade em uma única versão; coincide com os seis scores da matriz e reduz inferências. Não existe autorização geral para escolher sempre o documento mais longo ou detalhado.

Uma observação deve indicar **um único uso predominante**. Não se faz média entre usos. Predominância indeterminada produz insuficiência; categoria desconhecida não recebe score neutro. O texto livre do cadastro da área não é reutilizado como classificação científica: a entrada do diagnóstico é um suplemento próprio, versionado e imutável.

**Estado:** resolvido e rastreável para engenharia da v0.1; provisório para ciência. Distinções de campo, como pastagem versus pastagem degradada, precisam de critérios observáveis validados. Não foram inventados limiares nesta redação. Referências: ADR §§7.1–7.6; `CON-FND-007` e `CON-FND-013` como questões relacionadas.

### 3.7 Solo exposto e APP: conceitos próximos não são intercambiáveis

**FATO_DOCUMENTADO.** O contrato matemático usa solo exposto como percentual no módulo Solo (§3.2) e como categoria de uso predominante no Território (§3.4). Na APP, a mesma fonte usa presença/ausência (§3.3, L163–166), enquanto o modelo regional (§3, L101–109) diferencia preservada, parcialmente degradada e ausente.

**Decisão e justificativa.** O ADR §§5 e 7.3 mantém percentual de solo exposto e uso da terra como entradas distintas. Para APP, conserva a regra binária da versão geral; ausência de informação não significa APP parcialmente degradada. O estado intermediário permanece alternativa regional, que exigiria captura e contrato próprios.

**Estado:** fronteiras resolvidas para a versão experimental; conceitos, protocolo e eventual representação mais detalhada permanecem sujeitos a revisão científica. Referências: `CON-FND-006` e `CON-FND-007`.

## 4. Questões de produto, dados e arquitetura

### 4.1 Coleta, medição e diagnóstico designam etapas diferentes

**FATO_DOCUMENTADO.** O [dicionário de dados, §3, L61–72](../../raw/dicionario-de-dados.md) chama `Survey` de diagnóstico e o descreve como coleta de campo. Os [requisitos históricos, “Modelo de dados”, L237–247](../../raw/definicao-dos-requisitos-da-plataforma-hidroflorestas.md) também associam `Survey/Diagnóstico` a uma rodada de coleta, além de listar `IHFRResult` separadamente.

**INFERENCIA — consequência prática.** Usar “diagnóstico” para o registro de campo e para o resultado calculado pode sugerir que uma coleta já contém avaliação ambiental, mesmo antes do cálculo.

**Decisões posteriores.** A [IMP-004](../../../specs/004-environmental-collection-registration/spec.md) define os metadados da coleta; a [IMP-005](../../../specs/005-environmental-collection-data/spec.md), por confirmação técnica de 17/09, define um conjunto integral e imutável de medições com contrato próprio; o ADR §§6 e 10 define o diagnóstico calculado e seu histórico. Essa separação permite confirmar observações sem declarar ciência validada e preservar resultados anteriores quando houver novo cálculo.

**Estado:** resolvido nos contratos dessas entregas. A aprovação global de toda a terminologia e do modelo de domínio não foi presumida; `PD-004`, `PD-014` e `PD-015` conservam seus escopos remanescentes.

### 4.2 Papéis profissionais não definem automaticamente permissões

**FATO_DOCUMENTADO.** Os requisitos históricos, “Perfis de usuário”, L219–226, propõem Administrador/Técnico e Usuário de Campo. O dicionário, §1, L27–31, separa `admin`, `technician` e `field_user`.

**Decisões posteriores.** A [IMP-003, “Authority and Decision Record”](../../../specs/003-area-registration-and-viewing/spec.md), registra em 14/09 os papéis contextuais `OWNER`, `ADMIN` e `MEMBER`. A [IMP-009, esclarecimentos de 19/09](../../../specs/009-user-administration/spec.md), separa o administrador global do administrador de laboratório. Permissões dependem da operação, vínculo e estado atuais; título profissional não concede autoridade automática.

**Estado:** resolvido para os recortes implementados; a taxonomia histórica não foi convertida integralmente nem apagada. Regras futuras de ingresso, convites e evolução de papéis precisam de definição própria. Referências: `CON-FND-031`, `CON-FND-032`, `PD-015` e `PD-016`.

### 4.3 Mapa, gráficos e inteligência artificial têm recortes distintos

**FATO_DOCUMENTADO.** Os requisitos históricos, “Onde o mapa deve aparecer”, incluem polígonos e cores de IHFR. O [roadmap, §3](../../raw/roadmap-tecnologico-arquitetura-recomendada-hidroflorestas.md), recomenda alternativas como FastAPI, PostGIS e Leaflet/OpenStreetMap. Essas propostas não constituem, isoladamente, decisões atuais.

**Decisões posteriores.** O ADR §10 escolhe cálculo determinístico no backend TypeScript existente, sem Python, FastAPI ou IA generativa na v0.1. A [IMP-008](../../../specs/008-territorial-map/spec.md) limita o mapa mínimo a áreas-ponto e coletas confirmadas, com lista textual equivalente; não inclui camadas científicas. `TD-010` confirma Plotly como direção futura, posterior à IMP-009, ainda sem implementação. Concluir a IMP-009 não implementa automaticamente essa direção.

**Atualização de 01/10 — DECISAO_CONFIRMADA.** O solicitante informou nesta conversa que OpenStreetMap foi escolhido para produção. **FATO_DOCUMENTADO:** relatou a configuração de `NEXT_PUBLIC_MAP_TILE_URL` e `NEXT_PUBLIC_MAP_ATTRIBUTION` na Vercel e confirmou o mapa funcionando no site publicado. É **validação manual relatada pelo solicitante**; o agente não inspecionou o painel Vercel nem verificou individualmente cadastro, detalhe e mapa territorial nesta rodada. O relato não incluiu deployment/SHA ou evidências de cada tela.

**Estado:** escolha de produção confirmada e incidente encerrado para continuidade da fase, nesse alcance. `TD-008`, `PD-007` e o snapshot da política Code-First ainda descrevem o estado anterior e precisam de reconciliação canônica posterior, sem estender a escolha à arquitetura cartográfica definitiva. O [plano da fase](../../plans/active/estabilizacao-relatorios-interface/PLAN.md) registra a origem e essa pendência.

## 5. O que ainda precisa de apreciação

As questões abaixo são **PENDENCIA_DE_DECISAO** ou de validação já registradas, não decisões atribuídas ao professor por este relatório. Responsáveis adicionais e prazos: não especificados.

| Tema | Questão para a revisão competente | Referência e consequência |
|---|---|---|
| Validação do IHFR | Quais especialistas, dados, vetores de referência e critérios permitirão avaliar pesos, curvas, scores e classes? | `PD-002`; ADR §§8, 11 e 12. A versão permanece experimental. |
| Aplicabilidade territorial | Em quais territórios e unidades de análise a formulação deve ser testada? Como comparar a alternativa regional? | `CON-FND-016`, `CON-FND-023`; ADR §11. Não ativar o perfil regional por analogia. |
| Protocolo de campo | Como tornar repetíveis as classificações de uso, degradação, fragmentação e APP entre observadores? | ADR §6; auditorias científica e matemática. Rubricas e critérios de campo ainda exigem validação. |
| Ausência e qualidade | A exigência de quatro dimensões e o limiar de completude são adequados à coleta real? | ADR §§4.2–4.3. Qualquer mudança normativa deve criar nova versão. |
| Autoridades e termos | Quem confirma o escopo institucional, os conceitos e as regras que excedem as decisões locais das features? | `PD-001`, `PD-003`–`PD-006`, `PD-014`–`PD-017`. Não confundir delegação de uma entrega com aprovação global. |
| Reconciliação documental | Como incorporar a decisão atual de OpenStreetMap e os avanços das features sem apagar os snapshots anteriores? | `TD-008`, `PD-007` e registro documental. Atualização global fora desta entrega. |

**RECOMENDACAO.** Usar este documento como pauta de revisão, começando por aplicabilidade territorial, critérios de campo e desenho da validação científica. Registrar cada resposta com origem, data, responsável e recorte; mudanças matemáticas devem gerar nova versão/hash e novos resultados, preservando os anteriores. Esta entrega não encaminha mensagens ao professor nem presume sua aprovação.

## 6. Limites e referências de apoio

A pesquisa reconferiu exemplos selecionados, não refez integralmente as auditorias nem avaliou toda a literatura científica. Não houve experimento de campo, entrevista, avaliação estatística, execução do aplicativo ou inspeção de configuração remota nesta rodada. Os SHA-256 dos 13 arquivos de `docs/raw/` coincidem com os valores do inventário consultado; nenhuma fonte original foi alterada.

Além das fontes vinculadas por questão, foram consultados trechos das auditorias [científica fundamental](../audits/2026-08-24-auditoria-cientifica-fundamental.md), [matemática e algoritmo](../audits/2026-08-25-auditoria-contrato-matematico-calibracao-algoritmo.md), [requisitos e domínio](../audits/2026-08-26-auditoria-requisitos-dominio-wireframes.md) e [dados e arquitetura](../audits/2026-08-26-auditoria-dados-arquitetura-execucao.md), a [matriz de rastreabilidade](../../governance/TRACEABILITY_MATRIX.md), o [plano de consolidação da IMP-006](../../plans/completed/consolidacao-decisoria-imp-006.md) e a [revisão de fontes da IMP-005](../../../specs/005-environmental-collection-data/source-review.md). Os identificadores `CON-FND-*` pertencem à auditoria consolidada; este relatório não cria novos IDs canônicos nem declara encerrados todos os seus achados.

O [relatório acadêmico complementar](2026-10-01-relatorio-academico-do-desenvolvimento.md) apresenta a evolução do software, as contribuições verificáveis e os limites das validações técnicas.
