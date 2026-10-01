# Ambiguidades do Índice HidroFlorestal: decisões para a versão experimental e questões para avaliação científica

**Destinatários:** professor Fábio Mesquita de Souza e profissionais envolvidos na avaliação ambiental do HidroFlorestas.

**Período considerado:** desenvolvimento e decisões registrados até 1º de outubro de 2026.

## 1. Contexto e finalidade

O HidroFlorestas é uma plataforma em desenvolvimento no contexto de uma iniciativa de extensão e startup. Sua proposta envolve organizar áreas monitoradas, coletas de campo e registros ambientais, associando essas informações a um diagnóstico baseado no Índice HidroFlorestal de Risco, denominado IHFR.

Na formulação histórica examinada, o índice busca sintetizar condições relacionadas à água, ao solo, à vegetação e ao contexto territorial. Entre os aspectos considerados estão disponibilidade hídrica, infiltração, compactação, cobertura vegetal, uso da terra e declividade. As observações são transformadas em pontuações entre zero e um: valores menores representam condições consideradas mais favoráveis pela regra adotada, e valores maiores representam maior risco. As pontuações são reunidas em quatro dimensões e, depois, em um resultado geral.

A transformação dessa proposta em software exigiu comparar documentos que apresentavam diferenças de fórmula, categorias, pontuação e tratamento de informações incompletas. Um programa precisa executar uma regra definida para cada situação. Quando duas fontes permitem respostas diferentes para a mesma entrada, é necessário registrar uma escolha ou interromper aquela parte do desenvolvimento até obter uma definição.

Este relatório explica os principais problemas encontrados, os encaminhamentos adotados e as questões que permanecem abertas à avaliação do professor e dos especialistas. A equipe registrou, em setembro de 2026, a concepção histórica do IHFR pelo professor Fábio Mesquita. Esse registro não comprova a autoria de cada documento inicial nem significa que o professor tenha aprovado todas as escolhas posteriores de implementação.

**A versão descrita é experimental.** Seu conjunto de regras foi autorizado para permitir o desenvolvimento técnico, permanece sujeito a recalibração e ainda não foi aprovado como definição científica definitiva. Testar que o software executa uma regra corretamente não demonstra que a regra representa adequadamente as condições ambientais de um território.

## 2. Documentos examinados e alcance das decisões

A análise considerou documentos de naturezas distintas: a **Especificação do IHFR v0.1 — Contrato Matemático**, que descreve entradas, pontuações e cálculo; o **Algoritmo Operacional**, que organiza procedimentos de validação e processamento; a **Matriz de Variáveis do IHFR**; a **Especificação Técnica do Sistema**; o **Modelo Regional do IHFR — Baixo Itapecuru**; o **Protocolo de Campo do IHFR**; e registros posteriores das decisões da equipe. O termo “contrato matemático” designa aqui um conjunto explícito de regras para o cálculo, sem significar validação científica.

Em 18 de setembro de 2026, a equipe escolheu o contrato matemático como base da primeira versão experimental e definiu como tratar divergências que impediam a programação. Em 19 de setembro, detalhou a escolha das categorias de uso da terra. Em 20 de setembro, esclareceu o tratamento de informações ausentes e entradas desconhecidas. Essas decisões organizaram a execução do software; não eliminaram a necessidade de revisão ambiental das regras.

As questões a seguir distinguem o conteúdo declarado pelas fontes, as consequências práticas de suas diferenças e as escolhas operacionais realizadas. As alternativas históricas foram preservadas. Não se adotou a regra geral de que um documento mais recente, mais extenso ou mais completo seria necessariamente cientificamente correto.

## 3. Peso das dimensões no resultado final

O contrato matemático atribui o mesmo peso às quatro dimensões: água, solo, vegetação e território participam, cada um, com 25% do resultado. A matriz de variáveis também apresenta uma média simples. Já a especificação técnica, o modelo regional do Baixo Itapecuru e o protocolo de campo apresentam pesos diferentes:

| Dimensão | Formulação com pesos iguais | Formulação ponderada apresentada nas fontes regionais e técnicas |
|---|---:|---:|
| Água | 25% | 35% |
| Solo | 25% | 30% |
| Vegetação | 25% | 25% |
| Território | 25% | 10% |

Essa diferença altera a contribuição de cada dimensão. Por exemplo, condições desfavoráveis de água têm maior influência na segunda formulação, enquanto o componente territorial tem menor influência. Portanto, os mesmos dados podem produzir resultados distintos, mesmo que as pontuações internas de cada dimensão sejam iguais.

As alternativas eram utilizar a média simples ou adotar a composição ponderada. A equipe escolheu os pesos iguais para a primeira versão porque estavam explicitados na fonte matemática selecionada e permitiam manter um conjunto coerente de regras, com menor combinação de documentos diferentes. A formulação regional foi preservada como alternativa, sem ativação automática no sistema.

Essa escolha não demonstra que pesos iguais sejam superiores. Ainda é necessário avaliar quais pesos são adequados a cada território, quais evidências sustentam a composição regional e como comparar as duas formulações. A denominação de perfil geral da versão experimental também não comprova que ela possa ser aplicada universalmente.

## 4. Transformação das medições em pontuações

### 4.1 Bloquear valores acima dos limites ou limitar sua pontuação?

O contrato matemático estabelece limites usados na transformação de algumas medições: 60 metros para profundidade de poço, 60 milímetros por hora para infiltração e 45% para declividade. Nessas funções, o valor utilizado para calcular a pontuação é limitado ao teto previsto. O algoritmo operacional, por outro lado, determina bloquear o cálculo quando essas entradas estão fora das faixas indicadas.

Assim, uma infiltração superior a 60 milímetros por hora poderia receber a pontuação correspondente ao teto em uma interpretação ou impedir o diagnóstico em outra. As duas respostas não são equivalentes: uma mantém o cálculo e limita a influência da medição; a outra exige correção ou tratamento prévio.

Para a versão experimental, a equipe decidiu preservar o valor medido e aplicar o limite apenas ao transformá-lo em pontuação. Na função de infiltração, o risco da variável diminui até atingir zero no teto; na de declividade, aumenta até atingir um. Essa regra não dispensa a validação de tipos, unidades e valores permitidos na entrada, nem transforma toda observação incorreta em dado aceitável.

A decisão permite executar o cálculo de maneira definida. Permanecem para apreciação especializada a direção das relações, os tetos utilizados e o procedimento adequado diante de medições extremas. Também precisa ser avaliado se valores acima do teto contêm diferenças ambientalmente relevantes que a pontuação atual deixa de representar.

### 4.2 Funções contínuas ou faixas de classificação?

A especificação técnica apresenta tabelas por faixas para variáveis como profundidade e infiltração. O contrato matemático utiliza funções contínuas, nas quais a pontuação varia com o valor medido até o limite estabelecido. Uma tabela atribui a mesma pontuação a observações dentro de determinada faixa; uma função contínua pode distinguir valores dentro desse intervalo.

A equipe manteve as funções contínuas da fonte-base, em vez de combinar essas funções com tabelas pertencentes a outra formulação. As faixas históricas continuam disponíveis para comparação. A decisão especializada pendente é determinar qual representação se ajusta melhor às evidências de campo e à precisão dos métodos de medição.

## 5. Informações ausentes e suficiência para calcular

O contrato matemático e o algoritmo operacional indicam que uma dimensão com menos de duas variáveis válidas deve ser excluída da média final. Essa orientação convive com a definição inicial de quatro dimensões com pesos fixos.

A exclusão de uma dimensão muda a participação efetiva das demais. Se uma média inicialmente formada por quatro componentes passar a usar três, cada componente restante deixa de representar um quarto do resultado. Isso altera o cálculo mesmo sem modificar explicitamente os pesos apresentados ao usuário.

Foram consideradas duas alternativas: calcular apenas com as dimensões disponíveis ou exigir informação suficiente nas quatro. A equipe escolheu exigir as quatro dimensões, cada uma com pelo menos duas pontuações válidas. Quando essa condição não é atendida, o sistema informa insuficiência de dados e não produz um novo diagnóstico vigente. Trata-se de uma decisão operacional explícita, diferente da exclusão de dimensões prevista no texto histórico.

No componente territorial, a regra atual utiliza declividade e uso da terra; ambos são necessários. A matriz de variáveis também menciona densidade de drenagem, mas a fonte matemática escolhida não fornece uma transformação completa dessa variável para compor a versão adotada. Drenagem e elevação não participam do cálculo experimental, e o tamanho da área permanece informação contextual, sem alterar diretamente a pontuação.

Há ainda uma diferença entre **informação ausente**, **valor zero** e **resposta negativa**. Não conhecer a infiltração não equivale a ter medido infiltração zero; não conhecer a presença de uma condição não equivale a afirmar que ela está ausente. Informações opcionais não preenchidas podem ficar fora da média interna da dimensão, respeitada a suficiência mínima. Já uma categoria que não existe na classificação aceita é uma entrada inválida, não uma ausência a ser ignorada.

A avaliação científica deve esclarecer se a exigência de todas as dimensões é adequada às condições reais de coleta, quais variáveis são indispensáveis e se alguma forma de cálculo parcial teria interpretação válida. Também precisa definir o papel futuro de drenagem, elevação e tamanho da área, antes de incorporá-los ao índice.

## 6. Qualidade dos dados: quatro ou cinco campos essenciais?

As fontes utilizam cinco informações essenciais para avaliar o preenchimento: infiltração, compactação, cobertura vegetal, uso da terra e disponibilidade hídrica. Entretanto, divergem no tratamento de quatro campos preenchidos:

| Situação | Contrato matemático | Algoritmo operacional |
|---|---|---|
| Quatro dos cinco essenciais presentes | Qualidade alta, pois corresponde a 80% | Qualidade média |
| Cinco dos cinco essenciais presentes | Qualidade alta | Qualidade alta |

A equipe adotou o limiar de pelo menos 80% da fonte matemática. A alternativa que exige os cinco campos foi preservada. Essa classificação de preenchimento não elimina a exigência de suficiência das quatro dimensões: um conjunto pode atingir o limiar de preenchimento e ainda não reunir as condições necessárias ao diagnóstico.

O nome “qualidade” precisa ser interpretado com cuidado. A regra descrita mede a presença de campos essenciais, não a precisão dos instrumentos, a concordância entre observadores ou a validade das observações. Até o corte, não havia demonstração de que esse indicador correspondesse a uma medida estatística de confiança do diagnóstico. Cabe aos especialistas avaliar tanto o limiar quanto o significado comunicado ao usuário.

## 7. Classes de risco e arredondamento

O contrato matemático e a matriz de variáveis apresentam intervalos como 0,00–0,25 para risco baixo e 0,26–0,50 para moderado. Essa escrita deixa indefinido o tratamento de números entre os limites. O valor 0,255, por exemplo, não pertence claramente a nenhuma dessas duas faixas. É um exemplo numérico ilustrativo, não um resultado de campo.

As alternativas incluíam arredondar o resultado antes de classificá-lo ou definir intervalos contínuos. A equipe escolheu classificar o valor calculado, antes do arredondamento de apresentação, com as seguintes faixas:

| Classe | Intervalo adotado na versão experimental |
|---|---|
| Baixo | De zero até 0,25, incluindo os dois limites |
| Moderado | Acima de 0,25 até 0,50, incluindo 0,50 |
| Alto | Acima de 0,50 até 0,75, incluindo 0,75 |
| Crítico | Acima de 0,75 até um, incluindo um |

O número mostrado ao usuário é arredondado para duas casas decimais; esse número de apresentação não é usado para refazer a classificação. No exemplo, 0,255 pertence à classe moderada e é apresentado como 0,26. A separação evita que a forma de exibir o resultado determine silenciosamente sua classe.

A solução elimina lacunas e sobreposições na execução. Ainda precisa ser avaliado se os limites entre classes têm sustentação ambiental e qual interpretação pode ser atribuída a cada classe. A programação de um intervalo, por si só, não comprova uma mudança real de condição ecológica naquele ponto.

## 8. Uso da terra: categorias e pontuações divergentes

As diferenças mais concretas aparecem nas tabelas de uso da terra. A especificação técnica e a matriz apresentam seis categorias; o contrato matemático acrescenta a categoria urbana. Algumas pontuações também mudam:

| Uso da terra | Especificação Técnica do Sistema | Matriz de Variáveis do IHFR | Contrato Matemático do IHFR |
|---|---:|---:|---:|
| Floresta | 0,10 | 0,20 | 0,20 |
| Sistema agroflorestal | 0,20 | 0,25 | 0,25 |
| Agricultura | 0,60 | 0,60 | 0,60 |
| Pastagem | 0,70 | 0,65 | 0,65 |
| Pastagem degradada | 0,90 | 0,80 | 0,80 |
| Solo exposto | 1,00 | 0,95 | 0,95 |
| Urbano | Não listado | Não listado | 0,70 |

Os números são pontuações de risco previstas nas fontes, e não resultados de medições realizadas para este relatório. O protocolo de campo apresenta seis categorias de uso da terra, associadas a classificações qualitativas de risco, como baixo, moderado e alto, e orienta registrar o uso predominante. Sozinho, ele não fornece toda a conversão numérica necessária ao cálculo.

Em 19 de setembro, a equipe escolheu as sete categorias e as pontuações do contrato matemático. **Foi nesta questão que se adotou a versão considerada mais completa:** ela reúne categorias, pontuações, direção do risco e papel do uso da terra no cálculo territorial. Também coincide com as seis pontuações compartilhadas pela matriz. Sua adoção exigia menos complementações por interpretação dos desenvolvedores.

Completude documental, nesse caso, significa dispor de uma regra executável para todas as categorias selecionadas. Não demonstra que as categorias sejam suficientes para todos os territórios, que as pontuações estejam calibradas ou que a ordem de risco seja cientificamente correta.

A versão atual exige um único uso predominante por observação. Não calcula uma média de diferentes usos em uma mesma área. Se a predominância não puder ser determinada, o diagnóstico fica sem informação suficiente; uma categoria não prevista não recebe pontuação neutra. A descrição livre do uso no cadastro da área também não é convertida automaticamente em classificação para o cálculo: a categoria utilizada no diagnóstico é registrada de forma específica e preservada com o resultado.

Persistem questões relevantes para campo: quais critérios distinguem pastagem de pastagem degradada? Como classificar mosaicos sem predominância clara? As sete categorias cobrem as situações de interesse? Como tratar ambientes que não se enquadram nelas? Responder a essas perguntas pode exigir uma nova classificação e uma nova versão do índice, sem alterar retroativamente os resultados já produzidos.

## 9. Solo exposto, cobertura vegetal e presença de APP

### 9.1 Solo exposto como percentual e como uso predominante

O contrato matemático utiliza “solo exposto” em dois lugares: como percentual na dimensão Solo e como categoria predominante na dimensão Território. Embora o termo seja o mesmo, uma informação descreve uma proporção observada e a outra classifica o uso predominante. Cobertura vegetal, por sua vez, possui uma pontuação própria na dimensão Vegetação.

Tratar esses campos como equivalentes permitiria preencher um a partir do outro sem uma regra aprovada. O encaminhamento adotado foi mantê-los separados: o percentual não determina automaticamente o uso da terra, e a categoria territorial não substitui a medição percentual. Não foi criada uma conversão entre essas informações.

A implementação preserva essa distinção documental. A avaliação ambiental ainda precisa examinar como observar cada campo e como interpretar sua participação conjunta no índice, sem presumir que a separação técnica resolva todas as relações entre os fenômenos representados.

### 9.2 APP presente, ausente ou parcialmente degradada

A sigla APP designa Área de Preservação Permanente. Nas fontes analisadas, o campo aparece associado à presença de APP ou mata ciliar. O contrato matemático usa duas respostas, presença e ausência, enquanto o modelo regional diferencia condição preservada, parcialmente degradada e ausente.

Essas representações recolhem informações diferentes. A existência de uma área ou faixa de vegetação e seu estado de conservação não são descritos com o mesmo detalhamento por uma pergunta de duas respostas. A categoria intermediária também não pode ser deduzida apenas porque o campo ficou sem preenchimento.

Para manter compatibilidade com a regra selecionada, a equipe adotou a representação de presença ou ausência na versão experimental. O modelo de três condições foi preservado como alternativa, cuja utilização exige definição de captura e pontuação próprias. Informação desconhecida não passou a significar degradação parcial.

A revisão especializada deve esclarecer o objeto observado, a relação entre APP e mata ciliar nesse campo, a necessidade de registrar conservação e os critérios para distinguir os estados. Este relatório descreve a variável experimental; não avalia a regularidade ambiental de áreas concretas.

## 10. Coleta, registros ambientais e diagnóstico

Documentos iniciais empregam “diagnóstico” tanto para uma rodada de coleta quanto para o resultado calculado. Essa ambiguidade pode levar à impressão de que o simples registro de campo já contém uma conclusão sobre a condição ambiental.

O desenvolvimento passou a distinguir três etapas. A **coleta** identifica o evento de observação, sua área e momento. Os **registros ambientais** contêm as medições e classificações associadas a esse evento. O **diagnóstico IHFR** é produzido depois, mediante verificação das entradas e aplicação de uma versão determinada das regras.

Essa separação foi adotada para preservar a origem das informações e permitir revisar o cálculo sem reescrever a observação que o fundamentou. Um novo diagnóstico pode substituir o vigente, mantendo o anterior no histórico. A existência de medições confirmadas não significa que o cálculo esteja cientificamente validado.

Para a primeira versão, a equipe também escolheu um cálculo determinístico: as mesmas entradas, processadas pela mesma versão, devem produzir o mesmo resultado. A explicação é baseada em regras definidas, sem geração livre por inteligência artificial. Isso facilita examinar como o resultado foi obtido, mas não acrescenta validade científica às regras utilizadas.

## 11. Pontos para manifestação do professor e dos especialistas

A finalidade desta apreciação é orientar a avaliação científica e possíveis revisões futuras. As escolhas operacionais descritas permitiram desenvolver a plataforma; a ausência de nova manifestação não deve ser entendida como aprovação científica dessas escolhas.

| Questão | Contexto necessário à resposta |
|---|---|
| Em quais territórios e unidades de análise o índice deve ser avaliado inicialmente? | A versão implementada usa pesos iguais; há alternativa regional com maior peso para água e solo. É necessário delimitar onde comparar as formulações e quais resultados de referência usar. |
| Quais funções e limites representam melhor as variáveis medidas? | Profundidade, infiltração e declividade usam funções contínuas com tetos. Existem tabelas históricas por faixas. A revisão deve considerar método de medição, precisão e significado de valores extremos. |
| Quais informações são indispensáveis a um diagnóstico interpretável? | A versão atual exige as quatro dimensões e, em território, declividade e uso da terra. A alternativa histórica excluía dimensões incompletas, alterando os pesos efetivos. |
| O indicador de preenchimento deve ser chamado de qualidade e qual limiar deve usar? | Quatro dos cinco essenciais já recebem classificação alta na regra adotada. Isso não mede exatidão das observações nem confiança estatística. |
| Como classificar o uso da terra de maneira repetível? | Há sete categorias, com uma predominante por observação. Faltam critérios validados para distinções como pastagem degradada e para situações sem predominância clara. |
| Como definir APP, mata ciliar, cobertura e solo exposto na observação de campo? | As fontes alternam presença e conservação de APP; solo exposto aparece como percentual e categoria territorial. São necessárias definições observáveis e orientação para casos ambíguos. |
| Quais evidências sustentarão os pesos, as pontuações e as classes de risco? | É necessário definir especialistas responsáveis, seleção e repetição das observações, comparação com casos de referência, métricas e critérios de aceitação. Os testes de software disponíveis verificam regras programadas, não desempenho ambiental. |

Sugere-se registrar as respostas com a justificativa, o âmbito de aplicação e os responsáveis pela avaliação. Mudanças no conteúdo do cálculo deverão gerar uma nova versão identificável, preservando as observações e os resultados anteriores.

Até 1º de outubro de 2026, os registros examinados não forneciam parecer científico definitivo, calibração concluída ou resultados de campo suficientes para encerrar essas questões. Este texto sintetiza fontes e decisões existentes; não apresenta novo experimento, revisão bibliográfica abrangente ou resultados empíricos adicionais.
