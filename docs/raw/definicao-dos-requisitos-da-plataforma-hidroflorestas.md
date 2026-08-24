# DEFINIÇÃO DOS REQUISITOS DA PLATAFORMA HIDROFLORESTAS

## A PLATAFORMA PRECISA DE UM DASHBOARD?

Sim. A plataforma HidroFlorestas deve possuir um dashboard técnico inicial, que funcione como painel de inteligência territorial hidroflorestal.

## FINALIDADE DO DASHBOARD

- sintetizar os dados coletados em campo
- apresentar resultados do IHFR
- permitir visualização rápida da condição ambiental da área
- acompanhar histórico de análises territoriais

Informações recomendadas no dashboard

### 1. INDICADORES PRINCIPAIS

- Índice HidroFlorestal de Risco (IHFR)
- Nível de risco da área
  - baixo
  - moderado
  - alto
  - crítico

### 2. INDICADORES AMBIENTAIS RESUMIDOS

- disponibilidade hídrica estimada
- infiltração / retenção hídrica do solo
- cobertura vegetal da área
- grau de degradação da paisagem

### 3. RESULTADOS DAS ANÁLISES

- classificação da área para restauração
- potencial para sistemas agroflorestais
- necessidade de intervenção ecológica

### 4. HISTÓRICO

- lista de diagnósticos realizados
- evolução do IHFR ao longo do tempo

### 5. ALERTAS TÉCNICOS

- áreas prioritárias para restauração
- áreas com risco hídrico elevado

## A PLATAFORMA PRECISA DE MAPA?

Sim. O mapa é essencial para a lógica da startup. A HidroFlorestas é uma solução territorial e geoespacial, portanto o mapa é elemento central da interface.

## ONDE O MAPA DEVE APARECER

### 1. DASHBOARD INICIAL

Mapa mostrando:

- áreas analisadas
- localização das propriedades
- classificação IHFR por cores

Exemplo de cores:

- 🟢 baixo risco
- 🟡 médio risco
- 🟠 alto risco
- 🔴 risco crítico

### 2. TELA DE CADASTRO DA ÁREA

Usuário poderá:

- marcar área no mapa
- inserir coordenadas
- desenhar polígono da propriedade
- registrar ponto de coleta

Funções:

- GPS
- upload de shapefile (versão futura)
- desenhar polígono

### 3. TELA DE ANÁLISE TERRITORIAL

Mapa exibindo:

- área analisada
- dados ambientais associados
- resultado do IHFR

Possível camada futura:

- hidrografia
- solos
- vegetação
- uso da terra

### 4. ASSISTENTE DE IA

Mapa poderá aparecer para:

- contextualizar a análise
- permitir interpretação espacial da recomendação

Exemplo: “Área localizada em zona de baixa infiltração hídrica e baixa cobertura vegetal.”

## ESTRUTURA DAS FUNÇÕES DA PLATAFORMA

Aqui está uma decisão importante de arquitetura. A melhor solução não é um único formulário, nem muitos totalmente separados. A recomendação técnica é:

## SISTEMA MODULAR DE COLETA DE DADOS

**Módulo 1 — Identificação da área**

Dados básicos:

- nome da área
- município
- coordenadas
- tamanho da área
- tipo de uso da terra

**Módulo 2 — Dados hídricos**

Coleta informações como:

- tipo de fonte de água
- presença de nascente
- profundidade do poço
- disponibilidade hídrica
- sazonalidade

**Módulo 3 — Dados de solo**

- tipo de solo
- textura
- infiltração
- compactação
- erosão

**Módulo 4 — Vegetação e paisagem**

- cobertura vegetal
- fragmentação
- presença de APP
- nível de degradação

**Módulo 5 — Cálculo do IHFR**

Após inserção dos dados:

A plataforma executa scripts que:

- processam os dados
- geram o Índice HidroFlorestal de Risco

Resultado apresentado:

- valor numérico
- classe de risco
- interpretação

**Módulo 6 — Recomendações técnicas**

A plataforma gera:

- recomendações de restauração
- potencial para SAF
- necessidade de manejo do solo
- prioridade de intervenção

Essa etapa poderá ser assistida pela IA contextual.

## ARQUITETURA RESUMIDA DA PLATAFORMA

```text
          Dashboard
              │
      Mapa Territorial
              │
     Cadastro de Área
              │
      Coleta de Dados
            Água
             Solo
         Vegetação
              │
      Processamento
              │
           IHFR
              │
  Recomendações Técnicas
```

## ESTRUTURA MÍNIMA DO MVP

Para o projeto aprovado, o MVP deve ter apenas 5 telas:

Login / usuário  
Dashboard  
Cadastro da área (com mapa)  
Inserção de dados ambientais  
Resultado IHFR

## ENTRA NO MVP:

- 5 telas
- cadastro de área com mapa (ponto/polígono)
- formulário modular (água/solo/vegetação)
- cálculo do IHFR com valor, classe e interpretação
- dashboard com indicadores e histórico

## NÃO ENTRA NO MVP (EXPLICITAMENTE “FUTURO”):

- upload de shapefile (versão futura)
- camadas avançadas (hidrografia/solos/vegetação/uso da terra como camadas prontas), ficam como “possível camada futura”

## PERFIS DE USUÁRIO E PERMISSÕES

Defina “papéis” simples (para o MVP basta 2):

1. Administrador/Técnico (IFMA/HidroFlorestas)
   - cria/edita áreas, lança análises, vê todas as áreas, exporta relatórios (se houver).
2. Usuário de Campo (agricultor/liderança/técnico parceiro)
   - cadastra área, insere dados, vê resultado, vê histórico da própria área.

## FLUXOS DE USO (USER JOURNEYS)

1. Login → Dashboard (lista de áreas + mapa)
2. Cadastrar Área → desenhar polígono ou inserir coordenadas
3. Inserir Dados → módulos Água/Solo/Vegetação
4. Processar → calcula IHFR e gera classe + interpretação
5. Resultado → salva no histórico (e aparece no dashboard)

## MODELO DE DADOS (ENTIDADES) — O QUE VAI PARA O BANCO

No MVP, precisa no mínimo destas entidades:

- **User**
- **Area** (nome, município, geometrias, tamanho, uso da terra)
- **Survey/Diagnóstico** (uma “rodada” de coleta)
- **SoilData** (textura, infiltração, compactação, erosão)
- **WaterData** (fonte, nascente, poço, disponibilidade, sazonalidade)
- **VegetationData** (cobertura, fragmentação, APP, degradação)
- **IHFRResult** (valor, classe, componentes, versão do algoritmo)
- **Alerts** (prioridade restauração / risco elevado)

Inclua “versão do algoritmo” no IHFRResult, porque o IHFR vai evoluir na validação de campo.

## ESPECIFICAÇÃO DO IHFR (O “CONTRATO MATEMÁTICO”)

**como calcular???????????????**

Você não precisa fechar “a ciência inteira” agora, mas precisa entregar:

1. **lista das variáveis de entrada** (com unidade e faixa esperada)
2. **normalização** (como vira 0–1)
3. **pesos** (mesmo que “provisórios”)
4. **regra de classificação** (baixo/moderado/alto/crítico)
5. **explicação curta do resultado** (texto padrão)

O IHFR deve gerar **valor numérico + classe + interpretação**

Minha recomendação para “não travar” a implementação:

- **Versão IHFR v0.1 (MVP):** pesos iguais por dimensão (água/solo/vegetação + contexto da área).
- **Versão v0.2 (pós-campo):** calibra pesos com dados reais (Meta 4)

## REQUISITOS FUNCIONAIS POR TELA (COM CRITÉRIOS DE ACEITAÇÃO)

Você transforma cada tela em checklist:

**Tela 2 — Dashboard**

- mostra IHFR atual e classe da última análise
- mostra indicadores ambientais resumidos
- mostra histórico de diagnósticos
- mostra alertas técnicos
- mostra mapa com áreas analisadas e cores por classe

**Critério de aceitação (exemplo):** “Dado que existe ao menos 1 área com diagnóstico, ao abrir o dashboard o usuário vê a última classe do IHFR e a área colorida no mapa.”

Repita isso para **Cadastro da Área, Inserção de dados, Resultado**.

## REQUISITOS NÃO FUNCIONAIS (MÍNIMO INDISPENSÁVEL)

- **Offline/baixa conectividade:** no mínimo “não perder dados”; ideal: salvar rascunho local e sincronizar depois (mesmo que parcial no MVP).
- **Auditabilidade:** “algoritmos simples, transparentes e auditáveis” é um princípio do projeto aprovado  
  Logo: guardar entradas, versão e resultado.
- **Usabilidade para não especialistas:** seu próprio texto exige resultados compreensíveis.
