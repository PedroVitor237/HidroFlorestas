# Evidência manual de acessibilidade — IMP-007

**Critério**: SC-008

**Tarefa**: T065

**Estado**: `PRONTO_PARA_EXECUCAO` — `NAO_VERIFICADO`

**Última preparação técnica**: 2026-09-18

Este documento recebe a evidência de uma pessoa operando tecnologia assistiva real. Testes automatizados, árvore de acessibilidade do navegador, inspeção de DOM ou execução pelo agente não substituem essa verificação.

## Evidência técnica já disponível

- Playwright: 25/25 cenários aprovados na rodada consolidada; 7 pertencem ao dashboard e 18 cobrem regressões de áreas e coletas.
- Viewports automatizados: 320 px, 768 px e 1280 px, sem overflow horizontal no conteúdo principal.
- Teclado e semântica automatizados: foco, nomes acessíveis, destinos, papéis e estados verificáveis.
- Estados cobertos: carregamento, conteúdo, vazio real, falha e retry, troca concorrente de contexto, perda de acesso e laboratório inativo em modo somente leitura.

Esses resultados cobrem a parcela automatizável de SC-008. A compreensão do anúncio e a operação com tecnologia assistiva permanecem pendentes.

## Ambiente da execução humana

Preencher sem registrar credenciais ou dados pessoais desnecessários.

| Campo | Evidência |
|---|---|
| Responsável | `A_PREENCHER` |
| Data e horário | `A_PREENCHER` |
| Sistema operacional e versão | `A_PREENCHER` |
| Navegador e versão | `A_PREENCHER` |
| Tecnologia assistiva e versão | `A_PREENCHER` |
| Build/commit avaliado | `A_PREENCHER` |
| URL ou ambiente, sem segredo | `A_PREENCHER` |

## Procedimento

Usar somente teclado e a tecnologia assistiva registrada acima. Para cada passo, anotar o nome anunciado, papel, estado/valor, ordem e visibilidade do foco, resultado e eventual desvio.

| Passo | Ação e resultado esperado | Resultado humano | Evidência/desvio |
|---|---|---|---|
| 1 | Entrar em laboratório ativo com dados; o laboratório e seu estado são anunciados de forma compreensível | `A_PREENCHER` | `A_PREENCHER` |
| 2 | Percorrer os totais de áreas e coletas; nomes, valores e destinos são compreensíveis e acionáveis | `A_PREENCHER` | `A_PREENCHER` |
| 3 | Percorrer o histórico; tipo, instante e destino de cada item são anunciados e o foco é perceptível | `A_PREENCHER` | `A_PREENCHER` |
| 4 | Acionar paginação e retornar; o controle, o estado de atualização e a posição do fluxo são compreensíveis | `A_PREENCHER` | `A_PREENCHER` |
| 5 | Exercitar falha e retry no ambiente de teste; mensagem e ação são anunciadas sem depender de cor ou ícone | `A_PREENCHER` | `A_PREENCHER` |
| 6 | Abrir laboratório vazio; a ausência real de registros é anunciada e não se confunde com carregamento | `A_PREENCHER` | `A_PREENCHER` |
| 7 | Abrir laboratório inativo; o estado somente leitura é anunciado e não há ação incompatível disponível | `A_PREENCHER` | `A_PREENCHER` |
| 8 | Revogar o vínculo no ambiente de teste e tentar nova leitura/navegação; a perda de acesso é comunicada sem expor dados anteriores | `A_PREENCHER` | `A_PREENCHER` |

## Resultado e decisão

| Controle | Registro |
|---|---|
| Controles avaliados | `A_PREENCHER` |
| Controles com foco perceptível | `A_PREENCHER` |
| Controles com nome compreensível | `A_PREENCHER` |
| Estados compreendidos sem depender de cor/ícone | `A_PREENCHER` |
| Desvios encontrados e correções | `A_PREENCHER` |
| Reexecução após correções | `A_PREENCHER` |
| Evidências vinculadas | `A_PREENCHER` |
| Decisão de SC-008 | `NAO_VERIFICADO` |

SC-008 só pode mudar para `APROVADO` quando todos os controles do fluxo principal satisfizerem o critério em uma execução humana real e os campos acima estiverem preenchidos. SC-009 usa outro protocolo e não substitui esta evidência.
