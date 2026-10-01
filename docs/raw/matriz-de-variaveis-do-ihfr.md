# MATRIZ DE VARIÁVEIS DO IHFR

**Índice HidroFlorestal de Risco**

A matriz de variáveis do IHFR organiza os indicadores ambientais utilizados no cálculo do índice em quatro dimensões principais:

1. dimensão hídrica
2. dimensão pedológica
3. dimensão da vegetação e paisagem
4. dimensão territorial

Cada variável é convertida em um valor de risco normalizado entre 0 e 1, permitindo sua integração no cálculo do índice.

## 1. DIMENSÃO HÍDRICA

Avalia a disponibilidade e estabilidade dos recursos hídricos locais.

| Variável | Descrição | Unidade | Escala de risco |
|---|---|---|---|
| tipo de fonte hídrica | origem da água utilizada | categórica | nascente (0.2), rio (0.4), cisterna (0.5), poço tubular (0.6), poço raso (0.7) |
| presença de nascente | existência de nascente na área | binária | sim (0.2), não (0.8) |
| profundidade do poço | profundidade da captação | metros | $\text{risco} = 1 - (\text{profundidade}/60)$ |
| disponibilidade hídrica | regularidade da água ao longo do ano | categórica | permanente (0.2), sazonal (0.6), escassa (0.9) |
| indícios de salinização | presença de água salobra | categórica | nenhum (0.2), suspeita (0.7), confirmado (0.95) |

**interpretação ecológica**

Ambientes com baixa disponibilidade hídrica ou presença de salinização indicam comprometimento dos sistemas de recarga e circulação subterrânea.

## 2. DIMENSÃO PEDOLÓGICA

Avalia a capacidade do solo de infiltrar e armazenar água.

| Variável | Descrição | Unidade | Escala de risco |
|---|---|---|---|
| taxa de infiltração | velocidade de infiltração da água | mm/h | $\text{risco} = 1 - (\text{infiltração}/60)$ |
| compactação do solo | grau de compactação superficial | categórica | baixa (0.2), moderada (0.6), alta (0.9) |
| textura do solo | proporção de areia, silte e argila | categórica | arenoso (0.5), médio (0.4), argiloso (0.7) |
| erosão | evidências de processos erosivos | categórica | nenhuma (0.2), laminar (0.6), sulcos/voçorocas (0.9) |
| solo exposto | percentual de solo sem cobertura | % | $\text{risco} = \text{percentual}/100$ |

**interpretação ecológica**

Solos compactados ou com baixa infiltração tendem a favorecer o escoamento superficial, reduzindo a recarga hídrica.

## 3. DIMENSÃO DA VEGETAÇÃO E PAISAGEM

Avalia a capacidade da cobertura vegetal de regular o ciclo hidrológico.

| Variável | Descrição | Unidade | Escala de risco |
|---|---|---|---|
| cobertura vegetal | percentual da área coberta por vegetação | % | $\text{risco} = 1 - (\text{cobertura}/100)$ |
| fragmentação da vegetação | grau de fragmentação da paisagem | categórica | baixa (0.2), moderada (0.6), alta (0.9) |
| presença de APP | presença de mata ciliar ou APP | binária | sim (0.2), não (0.85) |
| degradação da paisagem | nível geral de degradação | categórica | baixa (0.2), moderada (0.6), alta (0.9) |

**interpretação ecológica**

A cobertura vegetal protege o solo, aumenta a infiltração e reduz o impacto das chuvas.

## 4. DIMENSÃO TERRITORIAL

Avalia características geomorfológicas e uso da terra.

| Variável | Descrição | Unidade | Escala de risco |
|---|---|---|---|
| declividade | inclinação média do terreno | % | $\text{risco} = \text{declividade}/45$ |
| uso da terra | tipo predominante de uso | categórica | floresta (0.2), SAF (0.25), agricultura (0.6), pastagem (0.65), pastagem degradada (0.8), solo exposto (0.95) |
| densidade de drenagem | concentração de cursos d'água | índice | normalização 0–1 |

**interpretação ecológica**

Terrenos mais inclinados e intensamente utilizados tendem a apresentar maior vulnerabilidade hidroambiental.

## 5. ESTRUTURA FINAL DO ÍNDICE

O IHFR integra as quatro dimensões por meio de média simples.

$$
\mathrm{IHFR} = \frac{H + S + V + T}{4}
$$

onde:

$H$ = dimensão hídrica  
$S$ = dimensão pedológica  
$V$ = dimensão da vegetação  
$T$ = dimensão territorial

Cada dimensão corresponde à média das variáveis associadas.

## 6. CLASSIFICAÇÃO DO RISCO

| Intervalo do IHFR | Classe |
|---|---|
| 0.00 – 0.25 | baixo risco |
| 0.26 – 0.50 | risco moderado |
| 0.51 – 0.75 | alto risco |
| 0.76 – 1.00 | risco crítico |

## 7. INTERPRETAÇÃO ECOLÓGICA DO ÍNDICE

| Classe | Interpretação |
|---|---|
| baixo | paisagem com boa capacidade de regulação hídrica |
| moderado | presença de limitações ambientais |
| alto | risco significativo de degradação hidroambiental |
| crítico | paisagem altamente vulnerável à seca funcional |

## 8. POTENCIAL DE APLICAÇÃO

O IHFR pode ser utilizado em diferentes escalas territoriais:

- propriedades rurais
- assentamentos agrícolas
- bacias hidrográficas
- territórios municipais

Ele permite identificar áreas prioritárias para:

- restauração ecológica
- implantação de sistemas agroflorestais
- manejo conservacionista do solo
- proteção de nascentes

## 9. POTENCIAL DE VALIDAÇÃO CIENTÍFICA

A matriz de variáveis permite futura validação do índice por meio de:

- análise estatística multivariada
- regressões ambientais
- comparação com indicadores hidrológicos reais

Essa etapa permitirá calibrar os pesos das variáveis em versões futuras do índice.

## CONCLUSÃO

A matriz de variáveis do IHFR estabelece um modelo integrado de avaliação hidroambiental capaz de sintetizar informações hidrológicas, pedológicas, ecológicas e territoriais em um único indicador de risco. Sua aplicação em plataformas digitais amplia significativamente o potencial de geração de inteligência territorial voltada para segurança hídrica e restauração produtiva de paisagens rurais.