# Validação da `007-ihfr-evolution`

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

## Limites desta rodada

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

## Estado resumido

`EVIDENCIA_IMPLEMENTACAO`: todas as etapas do fluxo possuem rotas, formulários,
serviços e persistência conectados por inspeção. O fluxo completo não foi
executado pelo navegador e, portanto, permanece `NAO_VERIFICADO_EM_RUNTIME`.

Há dois defeitos funcionais reproduzidos sem banco: o avaliador aceita ausência
de campo obrigatório quando chamado diretamente, e a consulta normal omite
parte da proveniência, versões, vigência e datas exigidas por FR-005/SC-001. A
prontidão da branch está bloqueada mesmo que as demais etapas venham a funcionar.

## Índice

- [`validation-report.md`](validation-report.md): escopo, fluxo, comandos,
  resultados e liberação condicionada dos testes com banco.
- [`end-to-end-checklist.md`](end-to-end-checklist.md): roteiro reproduzível de
  navegador e vetor técnico esperado.
- [`findings.md`](findings.md): achados classificados, reprodução, impacto e
  origem histórica sustentada.
