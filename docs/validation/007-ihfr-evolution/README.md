# Validação da `007-ihfr-evolution`

**Estado mais recente (2026-09-26):** consulte a seção 12 do [relatório de validação](validation-report.md) e o checkpoint ao final deste índice. As seções anteriores preservam o estado observado em cada rodada histórica.

## Objetivo

Este diretório registra a validação da continuidade da IMP-006 na branch
`007-ihfr-evolution`, com foco no fluxo real da plataforma:

`login → laboratório → área → coleta → dados ambientais → IHFR experimental`.

Os documentos distinguem comportamento observado no código, verificações
executadas nesta rodada, comportamento ainda dependente de navegador ou banco e
pendências científicas. A existência de uma rota, componente, tarefa concluída
ou evidência histórica não é tratada como prova de funcionamento integrado.

## Baseline

- Data da inspeção: 2026-09-25.
- Branch: `007-ihfr-evolution`.
- HEAD inicial: `3e6a97bdcaa8b598ee94b3e74c728b9cc104a41a`.
- Baseline do relatório anterior: `3e6a97bdcaa8b598ee94b3e74c728b9cc104a41a`.
- Diferença em relação ao baseline anterior: nenhuma.
- Estado inicial: worktree limpo e branch sincronizada com
  `origin/007-ihfr-evolution`.
- Pacote Spec Kit aplicável: [`specs/006-ihfr-diagnosis`](../../../specs/006-ihfr-diagnosis/).
- Checkpoint documental inicial desta continuidade:
  `498b26fd3355999ede1be1b528c1f186f109631e`.
- Continuidade com runtime executada sobre o código de `3e6a97b`; os commits
  documentais `498b26f` e `c8003bf` não alteraram código, testes ou migrations.

## Limites da inspeção anterior

- Nenhum teste com PostgreSQL, migration, fixture, seed ou aplicação conectada
  foi executado.
- Nenhuma dependência foi instalada ou atualizada.
- Nenhum arquivo de produção, teste existente, runner, configuração, migration
  ou documento canônico foi alterado.
- O conteúdo dos arquivos de ambiente não é reproduzido nestes documentos.
- Não houve commit, push, publicação ou comunicação externa.
- A v0.1 permanece `CONTRATO_EXPERIMENTAL`,
  `VALIDACAO_CIENTIFICA_PENDENTE`, `SUJEITO_A_RECALIBRACAO` e
  `NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO`.

## Estado resumido da inspeção inicial de 2026-09-25

`EVIDENCIA_IMPLEMENTACAO`: todas as etapas do fluxo possuem rotas, formulários,
serviços e persistência conectados por inspeção. O fluxo completo não foi
executado pelo navegador e, portanto, permanece `NAO_VERIFICADO_EM_RUNTIME`.

Há dois defeitos funcionais reproduzidos sem banco: o avaliador aceita ausência
de campo obrigatório quando chamado diretamente, e a consulta normal omite
parte da proveniência, versões, vigência e datas exigidas por FR-005/SC-001. A
prontidão da branch está bloqueada mesmo que as demais etapas venham a funcionar.

Na continuidade, o typecheck foi normalizado pela regeneração local e segura
do Prisma Client ignorado pelo Git. O preflight PostgreSQL somente leitura
confirmou conexão ao alvo de teste e separação técnica do alvo de desenvolvimento,
mas não foi possível obter da Neon Console/API a associação endpoint →
`branch_id`. Como esse gate cumulativo permaneceu aberto, nenhuma escrita, setup,
fixture, aplicação ou etapa de navegador foi executada.

### Continuidade posterior com runtime autorizado

Depois do fechamento documental acima, o usuário identificou explicitamente um
segundo destino Neon como branch de teste e autorizou migrations, fixtures e
execução ponta a ponta. Essa autorização permitiu prosseguir, mas não substitui
uma comprovação independente de `branch_id` pela Neon Console/API.

`EVIDENCIA_EXECUCAO`:

- o destino de teste tinha sete migrations e estava atualizado;
- o teste de concorrência ambiental pendente passou isoladamente;
- a suíte de integração passou em `106/106` depois de um cast temporário de
  `current_schema()` para `text`, necessário somente para compatibilidade do
  Prisma/adapter com o tipo PostgreSQL `name`;
- os testes unitários passaram em `59/59`, os contratos em `2/2` e o E2E IHFR
  por Playwright em `6/6`;
- o fluxo persistente foi exercitado com usuário `OWNER`, laboratório, área,
  coleta, dados de água, solo, vegetação e terreno, elegibilidade, criação,
  substituição e revogação do diagnóstico;
- não foram observados erros no console do navegador; as rotas de criação e
  substituição responderam `201` e a revogação respondeu `200`;
- fixtures e schemas temporários foram auditados e removidos ao final.

Os achados `F-001` e `F-002` continuam abertos. A execução prova o caminho
técnico integrado, mas não transforma o contrato experimental em contrato
cientificamente validado. Os detalhes, limitações e soluções propostas estão em
[`validation-report.md`](validation-report.md) e [`findings.md`](findings.md).

## Índice

- [`continuity-checkpoint.md`](continuity-checkpoint.md): estado recuperável do
  banco E2E e instruções seguras para retomar o fluxo integral pela interface.
- [`validation-report.md`](validation-report.md): escopo, fluxo, comandos,
  resultados e liberação condicionada dos testes com banco.
- [`end-to-end-checklist.md`](end-to-end-checklist.md): roteiro reproduzível de
  navegador e vetor técnico esperado.
- [`findings.md`](findings.md): achados classificados, reprodução, impacto e
  origem histórica sustentada.

## Continuidade corretiva de 2026-09-25 no HEAD `2c63c674`

`EVIDENCIA_IMPLEMENTACAO`: a rodada atual corrigiu no diff local a ausência obrigatória no avaliador (F-001), ampliou a consulta pública (F-002), incorporou o cast Prisma (F-007) e acrescentou preflight e auditoria restrita (F-004/F-008/F-009). O Prisma Client local foi regenerado e o typecheck passou (F-003). O ZIP local foi comparado por SHA-256 com os cinco documentos deste diretório: conteúdo idêntico antes das edições.

`EVIDENCIA_IMPLEMENTACAO`: no PostgreSQL local próprio, contrato 2/2, migrations 23/23, integração 107/107 e E2E IHFR 6/6 passaram no diff, com schemas descartáveis, servidor encerrado e auditoria final de zero candidatos. O navegador confirmou os dados públicos de CURRENT e datas UTC após reload em 390 × 844. O teste também revelou um deslocamento de três horas no `PrismaPg` com sessão local não UTC; o harness agora seleciona UTC e a expectativa contratual permaneceu intacta.

`EVIDENCIA_IMPLEMENTACAO`: não há `.env.e2e.local` nem variáveis de banco/conta E2E disponíveis neste workspace. As suítes Neon, a auditoria remota e o fluxo completo de UI preparado nesta rodada têm estado `NAO_EXECUTADO`. A autorização operacional histórica do destino e a lacuna de prova independente do provedor (F-005) permanecem separadas. Consulte a matriz e os comandos em [`validation-report.md`](validation-report.md#9-continuidade-corretiva-no-head-2c63c674-2026-09-25). As seções históricas acima permanecem evidência de suas próprias rodadas, sem aprovação transferida ao diff atual.

## Fechamento focal posterior — 2026-09-25

`EVIDENCIA_IMPLEMENTACAO`: a revisão focal sobre o HEAD inicial `85ce3c7a` fechou a aceitação indevida de strings em dois campos booleanos e completou o teste full UI com nova data de observação antes de REPLACE, vetor técnico literal e identidade do diagnóstico em CREATE/reload/histórico/REPLACE/REVOKE. Os gates locais e a auditoria passaram, como detalhado em [`validation-report.md`](validation-report.md). O percurso full UI e os gates Neon permanecem `NAO_EXECUTADO` por falta de configuração e conta sintética; nenhuma validação científica foi concluída.

## Saneamento de 2026-09-26 — gates Neon concluídos

`EVIDENCIA_IMPLEMENTACAO`: esta rodada começou em `007-ihfr-evolution@e491cb2278d3d098928abc2fb4c08276ff43ccda`. A execução Neon de 2026-09-25, registrada acima e no relatório, permanece evidência histórica de contrato 2/2, integração 107/107, migrations 23/23, E2E IHFR 6/6 e full UI 1/1 no código então testado. O novo diff alinha a família Prisma em `7.4.2`, fixa Node `24.19.0`, acrescenta uma migration aditiva de integridade do ciclo IHFR e separa auditoria read-only em `list` e `assert-zero`.

No E2E autorizado, o alvo DEV tem fingerprint sanitizado `ea797c501213` e o E2E direto `6903ad2ff1ef`. O schema residual exato `imp006_test_bce92440f0134780b9fcee23facfbeda` foi removido após conferir alvo, nome, prefixo, marcador, 11 tabelas vazias e exclusão de `public`; a auditoria final `list` e `assert-zero` encontrou zero candidatos. A migration nova foi aplicada no E2E após quatro contagens prévias iguais a zero, e o status de migrations ficou atualizado. No código atual, Prisma validate/generate, unitários 220/220, typecheck, lint sem erros, build, contrato Neon 2/2, migrations Neon 26/26, integração Neon 107/107, E2E IHFR Neon 6/6 e novo full UI 1/1 passaram. Localmente, integração 107/107 e migrations 26/26 passaram. Os comandos, o cenário novo e a matriz R-001–R-011 constam em [`validation-report.md`](validation-report.md).

**Fechamento técnico registrado:** T139 e T141 estão `[X]`; o Spec Kit registra 143/143 tarefas concluídas após os gates Neon, a auditoria limpa e a revisão de diff, segredos e commits de código/testes. A identidade independente endpoint → `branch_id` e a validação científica permanecem externas. A v0.1 conserva `CONTRATO_EXPERIMENTAL`, `VALIDACAO_CIENTIFICA_PENDENTE`, `SUJEITO_A_RECALIBRACAO` e `NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO`.

## Revalidação do remoto em 2026-09-26

`EVIDENCIA_EXECUCAO`: após fast-forward e checkpoint local `1158a0d`, o código testado foi `c6e43026f7946bb37f207402986b5df2077657c1`. Esta rodada usou outro destino E2E autorizado: DEV `ea062c117670`, E2E direto `d116d14859be`; não confundir com os fingerprints da rodada acima. A migration de integridade pendente foi aplicada após auditoria de dados existentes. A coleta histórica `f6e56569-a4c2-47e4-bc8d-c31311e0f344` e o diagnóstico `f98c2b71-cdc8-4992-b949-07681c54055c` foram reabertos no navegador, inclusive após reload, com resumo vigente completo. Um novo cenário também chegou ao diagnóstico 0.29 pela interface, persistiu e foi reaberto após reload e histórico. O runner integral versionado, porém, falhou por timeout de uma asserção visual após salvar a medição; a continuação controlada, sem recriar os recursos, comprovou as etapas restantes. Veja [`validation-report.md`](validation-report.md#13-revalidacao-do-head-remoto-c6e4302-2026-09-26), [`findings.md`](findings.md) e [`readiness-plan.md`](readiness-plan.md). O merge continua `NAO_PRONTO`: runner integral vermelho e alertas de segurança do Next ainda sem triagem. Nenhum merge ou push foi feito.

## Revalidação conjunta posterior — 2026-09-26

O commit remoto `9bbece0` publicou [relatório de outro validador](2026-09-26-revalidacao-playwright-neon-e-pendencias.md) sobre o mesmo runtime `c6e4302`, porém em Neon `568d60469278` e PostgreSQL local. Após examinar esse relatório, a branch foi reconciliada por fast-forward e recebeu checkpoint vazio `c79f14b`. A [revalidação conjunta](2026-09-26-revalidacao-conjunta-e-prontidao.md) repetiu os gates no E2E direto `d116d14859be`: full UI oficial 1/1, Playwright IHFR 6/6, contrato 2/2, integração 107/107, unitários 62/62, typecheck, lint e build com rede passaram. A primeira suíte de migrations foi 25/26, mas o teste focal 3/3 e a repetição completa 26/26 passaram; sua causa inicial ficou indeterminada. Dados históricos foram preservados, um novo cenário full UI ficou rastreado em `public`, e a auditoria final encontrou zero schemas temporários. O fluxo técnico funciona; a suíte geral e o runner HTTPS oficiais continuam sem gate verde, e os advisories de Next precisam de triagem. O veredito de merge continua `NAO_PRONTA`; a validação científica segue externa.
