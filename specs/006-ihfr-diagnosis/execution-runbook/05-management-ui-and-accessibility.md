# 05 — Interface de gestão e acessibilidade

## Status inicial

PENDENTE. A página real src/app/(private)/dashboard/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/page.tsx mostra somente resumo/ausência read-only. Os componentes ihfr-diagnosis-form.tsx e ihfr-diagnosis-actions.tsx ainda não existem. O E2E de gestão está definido mas foi SKIP por falta de fixture visível ao servidor.

## Tarefas Speckit abrangidas

T096, T097 e T098.

## Dependências

API da [etapa 04](04-http-api-and-error-contract.md) funcional; autorização server-side da etapa 02; [schema do suplemento](../contracts/ihfr-diagnosis-input-experimental-v0.1.0.schema.json) e OpenAPI. Reusar os componentes de leitura existentes sem inventar score, classe ou recomendação.

## Estado de entrada esperado

GET eligibility/current/detail e POST/GET de ciclo respondem sem 501; API informa acesso, estado do laboratório, conflito e insuficiência de modo confiável. A página contextual resolve laboratório/área/coleta sem rota duplicada.

## O QUÊ

Adicionar formulário fechado de categoria predominante e proveniência, ações CREATE/REPLACE/REVOKE e recuperação de timeout, com estados acessíveis e ausência completa de controles para MEMBER/laboratório inativo.

## POR QUÊ

A interface precisa guiar o observador no contrato experimental, impedir submissões incompletas acidentais e lidar com conflito/timeout sem anunciar sucesso falso. Ocultar controles por capacidade melhora UX, enquanto a API continua responsável por impor a autorização.

## Arquivos que provavelmente serão alterados

src/components/ihfr-diagnosis/ihfr-diagnosis-form.tsx, ihfr-diagnosis-actions.tsx; src/app/(private)/dashboard/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/page.tsx; estilos locais já utilizados; tests/e2e/ihfr-diagnosis-manage.spec.ts e tests/unit/ihfr-diagnosis-read-accessibility.test.tsx se exigido pelo comportamento. Não criar src/app/laboratories/.../page.tsx.

## Procedimento ordenado

1. Definir contrato do estado local: carregando, ausência, elegível, insuficiente, incompatível, enviando, sucesso terminal, conflito, falha técnica e resultado desconhecido após timeout. Renderizar cada estado com texto claro; current null mostra ausência sem valor numérico. Recarregar current/eligibility após transição terminal.
2. Formulário aceita somente inputContractVersion fixo, landUseType dentre FOREST, AGROFORESTRY, CROPLAND, PASTURE, DEGRADED_PASTURE, BARE_SOIL e URBAN e provenance.kind/observedAt válidos. Pedir escolha explícita da predominância; uso misto sem predominante permanece insuficiente, sem média/OTHER/fallback. Não preencher a partir de CollectionArea.landType ou outros campos ambientais.
3. Renderizar ações apenas para capacidade MANAGE_IHFR_DIAGNOSIS atual e laboratório ativo. Para MEMBER e laboratório inativo, nenhum botão ou controle de escrita no DOM; manter leitura e aviso de somente leitura. Mesmo quando controle some, API deve negar tentativa direta. Revalidar capacidade após navegação, sessão expirada ou mudança de vínculo.
4. CREATE envia mode CREATE, ID esperado ausente/null e nova chave UUID por tentativa lógica. REPLACE mostra o diagnóstico CURRENT, captura seu ID esperado, exige confirmação contextual e envia mode REPLACE com esse ID; se 409, informar que o estado mudou, recuperar current e não sobrescrever silenciosamente. Não reutilizar chave da IMP-005.
5. REVOKE exige confirmação explícita e motivo de 1–500 caracteres; mostrar qual diagnóstico será revogado; envia ID vigente esperado, diagnóstico do path e chave própria. Em sucesso, current passa a ausência e detalhe histórico permanece consultável. Motivo é restrito: não exibir em resumo ou log de navegador.
6. Timeout ou perda de resposta mantém a mesma chave, mostra “resultado ainda não confirmado”, consulta GET operation no mesmo contexto e só anuncia sucesso quando recuperar terminal. Falha de recuperação ou perda de autorização mostra erro/ação de recarga sem fabricar êxito; não reenviar com chave nova automaticamente.
7. Preservar sempre os quatro qualificadores: CONTRATO_EXPERIMENTAL, VALIDACAO_CIENTIFICA_PENDENTE, SUJEITO_A_RECALIBRACAO e NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO. Exibir origem, versões/hash permitido, classe/score somente quando diagnosis existe. Nunca chamar “aceito cientificamente”, “definitivo” ou “universal”.
8. Implementar rótulos associados a cada controle, erros por campo e resumo de erro com foco programático; status assíncrono anunciado por aria-live apropriado; teclado para abrir, navegar, confirmar/cancelar diálogo; foco inicial no diálogo, contenção por Tab, Escape/cancelamento, retorno ao acionador; foco no status após sucesso e no alerta após 400/409/500. Garantir que controles desabilitados indiquem motivo. Testar a 320, 768 e 1280 px sem overflow horizontal ou alvo inacessível.

## Regras e invariantes

Nenhuma decisão científica nova é tomada na UI. Payload é fechado; IDs de contexto/autoria derivam do servidor. Cada ação tem uma única tentativa lógica e chave estável durante recuperação; novo envio deliberado usa nova chave. A UI não retém payload ambiental completo, hashes internos, ator, evidência ou motivo de revogação fora do estado transitório necessário.

## Testes obrigatórios

Na etapa 08, executar tests/e2e/ihfr-diagnosis-manage.spec.ts com OWNER, ADMIN contextual, MEMBER e laboratório inativo em fixture isolada persistente. Cobrir CREATE/REPLACE/REVOKE/recovery, foco, Tab/Shift+Tab, Escape, mensagens aria-live, 400/409/422/500, ausência, 320/768/1280 px e ausência de controle para leitura apenas. Unitários de markup ajudam, mas não substituem navegador; revisão humana com leitor de tela fica NAO_VERIFICADO até realizada por pessoa/equipe.

## Evidências que devem ser registradas

Capturas/resultado de navegador sem PII, matriz de estados, sequência de foco e teclado, viewports, status E2E real, ausência de controles, resposta a timeout/conflito e quatro rótulos presentes. Anotar explicitamente qualquer SKIP.

## Condições de parada

UI concede escrita por User.role global, expõe controle a MEMBER/inativo, considera timeout sucesso, perde chave durante recuperação, revela evidência restrita, cria rota duplicada ou omite rótulos experimentais. Corrigir antes de chamar a jornada pronta.

## Critérios de conclusão

Formulário e ações seguem o contrato fechado, cada transição aparece honestamente, leitura apenas não mostra controles, acessibilidade de teclado/foco e responsividade passam no navegador, e a API mantém enforcement server-side.

## Estado de saída esperado

Jornada integrada pronta para execução GREEN da US2, ainda sujeita aos gates de banco/E2E da etapa 06/08.

## Checkpoint/commit sugerido

Sugestão futura: feat(ihfr): add accessible contextual diagnosis management. Escopo: componentes, página contextual e testes de UI; sem commit nesta execução.
