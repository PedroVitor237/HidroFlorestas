# 09 — Evidência, governança e prontidão para merge

## Status inicial

PENDENTE. [implementation-evidence.md](../implementation-evidence.md) registra apenas execução até T082 e limites E2E; [pr-description.md](../pr-description.md) é texto preparado historicamente, não descrição de implementação final. evidence/human-validation.md ainda não existe. TD-015/TD-016 estão PARCIALMENTE_IMPLEMENTADO após reconciliação documental; só a entrega integral poderá mudar o estado para IMPLEMENTADO_VERIFICADO.

## Tarefas Speckit abrangidas

T127, T128, T129, T130, T131, T132, T133 e T134.

## Dependências

Etapa [08](08-e2e-regression-and-cleanup.md) integralmente concluída, inclusive T060/T116 sem SKIP e teardown comprovado. HEAD com código e evidências correspondentes; origin/development atualizado para comparação final. Revisão humana científica e campo permanecem futuras, sem ser simuladas por automação.

## Estado de entrada esperado

Seis operações/sete comportamentos implementados, suíte técnica completa GREEN, zero schema/processo residual, diff de implementação limitado à feature e documentação com links funcionais. Nenhum segredo/PII foi copiado à evidência.

## O QUÊ

Consolidar evidências reais, registrar validações humanas como não verificadas quando não realizadas, atualizar texto de PR, auditar links/hashes/escopo, reconciliar branch com development, estabelecer critérios objetivos de merge e fechar tarefas na ordem correta.

## POR QUÊ

Uma suíte verde em commit antigo, uma revisão humana presumida ou uma branch atrás da base não sustenta prontidão. O caráter experimental precisa permanecer visível mesmo depois de conformidade técnica integral.

## Arquivos que provavelmente serão alterados

[implementation-evidence.md](../implementation-evidence.md); criar specs/006-ihfr-diagnosis/evidence/human-validation.md apenas ao executar T128/T129; [pr-description.md](../pr-description.md); [tasks.md](../tasks.md) conforme conclusão real; [TECH_DECISIONS.md](../../../TECH_DECISIONS.md) para nova linha histórica e estado corrente somente se a IMP-006 integral estiver verificada. Atualizar DOCUMENT_REGISTER.md/PENDING_DECISIONS.md apenas se o caminho estiver autorizado e a entrega realmente mudar seu estado; caso contrário relatar a necessidade, sem edição silenciosa.

## Procedimento ordenado

1. Consolidar em implementation-evidence.md, por tarefa/FR/SC, HEAD, data, ambiente sanitizado, comando exato, exit code, contagens PASS/FAIL/SKIP, defeitos corrigidos, screenshots/logs permitidos, banco/schema/processos antes/depois e limitações. Revisar se toda alegação pode ser rastreada a teste/artefato do mesmo HEAD.
2. Criar evidence/human-validation.md com estado real. Sem revisão documentada do professor Fábio e especialistas, registrar NAO_VERIFICADO (VALIDACAO_POSTERIOR). Fazer o mesmo para calibração, vetores científicos aprovados e testes de campo. Identificar responsável/data como não especificado quando ausentes. Não transformar vetores TECHNICAL_CONTRACT_VECTOR em ciência aprovada.
3. Atualizar pr-description.md de texto futuro para descrição do delta real: escopo, baseline, migrations, autorização, API, UI, comandos/resultados, riscos, limites, cleanup, links de evidência e estado humano. Preservar os quatro qualificadores CONTRATO_EXPERIMENTAL, VALIDACAO_CIENTIFICA_PENDENTE, SUJEITO_A_RECALIBRACAO e NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO em resumo e limitação científica. Não anunciar PR aberto antes de existir.
4. Validar links relativos e paths em specs/006-ihfr-diagnosis/**, TECH_DECISIONS.md e README; conferir os hashes manifestos pela canonicalização independente, seis operações/sete comportamentos, sete landUseType, matriz FR-001–FR-020 e SC-001–SC-008. Usar verificação mecânica da lista de tarefas e procurar 501/NOT_IMPLEMENTED em fluxos de produção. Qualquer stub ainda acessível bloqueia pronto.
5. Executar git fetch origin, git status --short --branch, git merge-base origin/development HEAD, git rev-list --left-right --count origin/development...HEAD, git diff --name-status origin/development...HEAD e git diff --check. Se development avançou, comparar alterações sobrepostas, planejar integração normal da base na feature preservando ambos os lados, resolver conflitos por conteúdo e repetir toda validação afetada; não usar reset/rebase destrutivo nem forçar push. A branch development não é alterada pelo preparo de PR.
6. Inspecionar diff completo, arquivos não rastreados e staged, buscando segredo, token, cookie, URL de banco, PII, payload ambiental sensível, docs/raw/** e alterações fora do recorte. Confirmar que o arquivo não rastreado da IMP-005 continua fora do PR. Revisar também migrations, generated files e evidências de teardown.
7. Preparar comparação do PR com base development e head exato validado. Depois de eventual commit/push autorizado no fluxo da equipe, revalidar SHA remoto, checks e evidências; se HEAD mudou, executar novamente os gates afetados antes de dizer pronto. Abertura/merge do PR seguem o fluxo autorizado da equipe; este runbook apenas define critérios, não os executa.
8. Atualizar tarefas em tasks.md só com resultado real: nenhuma de T001–T133 fica marcada concluída por existência de arquivo, SKIP ou teste anterior ao HEAD. T134 é a última e somente fecha quando T001–T133 estiverem concluídas ou justificadas conforme contrato, zero estado residual e evidencia final/PR coerentes. Não acrescentar tarefas depois de T134 sem renumerar/reabrir encerramento.
9. Se a implementação integral foi verificada, acrescentar linhas históricas em TECH_DECISIONS.md para TD-015/TD-016 com origem técnica, comandos/artefatos e data; então atualizar estado corrente para IMPLEMENTADO_VERIFICADO. Se qualquer gate funcional obrigatório ficar aberto, manter PARCIALMENTE_IMPLEMENTADO. G2-SCI e PD-002 continuam abertos independentemente dos gates técnicos.

## Regras e invariantes

PR, HEAD e evidências devem corresponder; screenshot/teste de outro commit não fecha tarefa atual. Não apagar histórico de decisão nem alterar docs/raw/**. Conformidade técnica experimental não promove fórmula a ciência definitiva. Preservar fontes por autoridade: decisões confirmadas/ADR/manifesto governam o contrato experimental; código/migration/testes demonstram implementação; históricos são evidência de origem.

## Testes obrigatórios

Verificação de links/paths, hashes, task coverage, diff completo, git diff --check, varredura de segredos/PII, status Git e comparação development. Não repetir toda a suíte por rotina depois de um diff somente documental; repetir testes afetados se HEAD/integração alterar código, schema, contrato ou ambiente. Gates obrigatórios completos devem estar registrados da etapa 08, sem SKIP.

## Evidências que devem ser registradas

Tabela final de tarefas, comandos/resultados do HEAD, SHA/base/upstream/merge-base, arquivos do PR, checks, zero resíduos, revisão de segredos/PII, estado de cada validação humana, decisões técnicas históricas e razões de qualquer limitação. Nunca registrar credenciais, tokens ou dados pessoais desnecessários.

## Condições de parada

PR baseado em SHA não validado, development com drift material não reconciliado, teste obrigatório pulado, dado restrito no diff, docs/raw/** alterado, zero resíduo não provado, alteração científica sem decisão, ou PR descrevendo validação humana não realizada. Corrigir ou registrar bloqueio antes de afirmar prontidão.

## Critérios de conclusão

T001–T134 fechadas/justificadas de modo auditável; evidências e PR correspondem ao mesmo HEAD; branch reconciliada e sem arquivos fora do escopo; todos os gates técnicos executados GREEN e ambiente limpo; PD-002 explicitamente pendente. Prontidão para merge significa aptidão objetiva para revisão, não autorização automática para publicar/mesclar.

## Estado de saída esperado

Branch e descrição prontas para revisão de PR e eventual merge pelo fluxo da equipe, mantendo o contrato científico como experimental e a validação posterior aberta.

## Checkpoint/commit sugerido

Sugestão futura: docs(ihfr): record verified implementation and merge evidence. Escopo: evidência, tarefas, descrição de PR e histórico TD-015/TD-016 quando elegível; sem commit, push ou PR nesta execução.
