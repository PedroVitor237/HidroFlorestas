# WIREFRAMES FUNCIONAIS DO MVP DA PLATAFORMA HIDROFLORESTAS

Este documento descreve a estrutura das telas do MVP da plataforma HidroFlorestas, indicando:

- organização dos elementos da interface
- campos de entrada
- visualização de resultados
- fluxo de navegação do usuário

O objetivo é orientar o desenvolvimento da interface de forma clara e funcional.

## VISÃO GERAL DO FLUXO DO SISTEMA

```text
              Login
                ↓
            Dashboard
                ↓
     Cadastro de Área (Mapa)
                ↓
  Inserção de Dados Ambientais
                ↓
         Processamento
                ↓
         Resultado IHFR
```

## TELA 1 — LOGIN

### Objetivo

Permitir acesso à plataforma.

### Estrutura

```text
-----------------------------------
      HIDROFLORESTAS
-----------------------------------

Email
[______________________]

Senha
[______________________]

[ Entrar ]

-----------------------------------
Esqueceu senha?
Criar conta
-----------------------------------
```

### Campos

| Campo | Tipo |
|---|---|
| email | texto |
| senha | senha |

## TELA 2 — DASHBOARD

### Objetivo

Painel inicial de inteligência territorial.

Exibe:

- áreas cadastradas
- resultados IHFR
- histórico
- mapa geral

### Estrutura da tela

```text
--------------------------------------------------
MENU LATERAL
Dashboard
Áreas
Novo Diagnóstico
Histórico
Configurações
--------------------------------------------------
PAINEL PRINCIPAL
Indicadores principais
IHFR atual
[ 0.63 ]
Classe: ALTO RISCO
--------------------------------------------------
Indicadores ambientais resumidos
Disponibilidade hídrica
Infiltração do solo
Cobertura vegetal
Degradação da paisagem
--------------------------------------------------
Mapa territorial
[ mapa interativo ]
cores das áreas:
     🟢 baixo risco
     🟡 moderado
     🟠 alto
     🔴 crítico
--------------------------------------------------
Histórico de análises
Área A — IHFR 0.45
Área B — IHFR 0.72
Área C — IHFR 0.33
```

## TELA 3 — CADASTRO DA ÁREA

### Objetivo

Registrar área territorial para análise.

### Estrutura

```text
--------------------------------------------------
Cadastro da Área

Nome da área
[________________]

Município
[________________]

Estado
[________________]

Tamanho da área (ha)
[________________]

Tipo de uso da terra

( ) floresta
( ) agrofloresta
( ) agricultura
( ) pastagem
( ) pastagem degradada
( ) solo exposto
--------------------------------------------------

Mapa da área

[ MAPA INTERATIVO ]

Ferramentas:

     [Ícone de marcador] marcar ponto
     [Ícone de quadrado preto] desenhar polígono
     [Ícone de antena/GPS] capturar GPS
--------------------------------------------------

[ Salvar área ]
```

## TELA 4 — INSERÇÃO DE DADOS AMBIENTAIS

Essa tela possui seções modulares.

### BLOCO 1 — DADOS HÍDRICOS

```text
Fonte de água
( ) nascente
( ) rio/igarapé
( ) poço raso
( ) poço tubular
( ) cisterna

Existe nascente na área?
( ) sim
( ) não

Profundidade do poço (m)
[________]

Disponibilidade hídrica
( ) permanente
( ) sazonal
( ) escassa

Indícios de salinização
( ) não
( ) suspeita
( ) confirmada
```

### BLOCO 2 — DADOS DO SOLO

```text
Tipo de solo
( ) arenoso
( ) médio
( ) argiloso

Taxa de infiltração (mm/h)
[________]

Compactação do solo
( ) baixa
( ) moderada
( ) alta

Sinais de erosão
( ) nenhum
( ) erosão laminar
( ) sulcos/voçorocas

Solo exposto (%)

[________]
```

### BLOCO 3 — VEGETAÇÃO E PAISAGEM

```text
Cobertura vegetal (%)

[________]

Fragmentação da vegetação
( ) baixa
( ) moderada
( ) alta

Existe APP ou mata ciliar?
( ) sim
( ) não

Nível de degradação da paisagem
( ) baixo
( ) moderado
( ) alto

Botão de processamento
[ CALCULAR IHFR ]
```

## TELA 5 — RESULTADO DO IHFR

### Objetivo

Apresentar diagnóstico ambiental da área.

### Estrutura

```text
--------------------------------------------------
RESULTADO DO DIAGNÓSTICO
Área: Fazenda Santa Rita
IHFR
0.68
Classe
ALTO RISCO
--------------------------------------------------
Componentes do índice
Água ............ 0.62
Solo ............ 0.81
Vegetação ....... 0.55
Território ...... 0.74
--------------------------------------------------
Interpretação
Risco elevado devido principalmente à baixa infiltração
do solo e alto grau de degradação da paisagem.
--------------------------------------------------
Recomendações técnicas
• recuperar cobertura do solo
• implantar sistemas agroflorestais
• reduzir compactação
• proteger áreas de recarga hídrica
--------------------------------------------------
[ Salvar diagnóstico ]
[ Voltar ao dashboard ]
```

## MAPA — FUNCIONALIDADES

O mapa deve permitir:

**funções básicas**

- zoom
- navegação
- visualização de áreas

**funções de cadastro**

- desenhar polígono
- marcar ponto
- capturar GPS

**visualização**

- cores por classe IHFR

## CORES PADRÃO DO IHFR

| Classe | Cor |
|---|---|
| baixo | verde |
| moderado | amarelo |
| alto | laranja |
| crítico | vermelho |

## CRITÉRIOS DE ACEITAÇÃO

### Dashboard

Quando existir diagnóstico salvo:

- o IHFR deve aparecer
- o mapa deve mostrar a área
- o histórico deve listar análises

### Cadastro da área

Usuário deve conseguir:

- inserir dados básicos
- marcar área no mapa
- salvar área

### Inserção de dados

Sistema deve aceitar:

- dados hídricos
- dados do solo
- dados de vegetação

### Resultado

Sistema deve mostrar:

- valor do IHFR
- classe de risco
- explicação do resultado
- recomendações técnicas

Observação importante: O cálculo do IHFR deve utilizar a especificação descrita no documento:  
ESPECIFICAÇÃO DO IHFR v0.1 e registrar a versão do algoritmo utilizada.
