# Plano de revalidação conjunta da 007

- Identificador: `007-revalidacao-conjunta-2026-09-26`.
- Estado: `CONCLUIDO`.
- Objetivo: reavaliar o runtime publicado, classificar com evidência os achados Playwright/Neon/versões de ambos os validadores e decidir a prontidão para merge.
- Escopo de edição: exclusivamente `docs/validation/007-ihfr-evolution/`; testes e consultas podem criar somente recursos sintéticos nos destinos explicitamente comprovados. Sem mudanças de código, testes, scripts, migrations, configuração versionada ou dependências; sem merge.
- Fontes: solicitação atual do responsável; `AGENTS.md`, constituição, ADR-0001 e Spec Kit para intenção; código, scripts e testes para implementação; resultados desta execução para observação; relatório `9bbece0` e anteriores como evidência histórica por destino. Inferências e recomendações serão rotuladas.
- Estado inicial: `007-ihfr-evolution@b23790969e5f3bcca7cf38992f32c527b8913375`, worktree e staging limpos, atrás de `origin/007-ihfr-evolution@9bbece041b6f69903c949be98ba75115c4156f47` por um commit documental; `origin/development@100351e07d9f89f34ebb0ea4de17b526297d6350`. `git fetch` não encontrou outros commits; `9bbece0` adiciona somente o relatório de outro validador, examinado antes do fast-forward. Reconciliação `--ff-only` sem conflito; checkpoint inicial vazio após stage limpo: `c79f14b`.
- Dependências e riscos: confirmar versões e Client local, separar os destinos Neon dos relatórios, impedir Playwright em servidor externo, preservar recursos em `public`, identificar qualquer concorrência e efeito de migration antes de escrita. A prova independente endpoint → `branch_id` e a ciência permanecem externas.
- Responsável pela execução documental: agente desta rodada. Revisão de implementação, segurança, ciência e decisão de merge: responsáveis não especificados.

## Etapas e critérios

1. `CONCLUIDO`: examinar o único commit remoto, classificar suas afirmações e reconciliar o Git com checkpoint vazio.
2. `CONCLUIDO`: scripts e runtime inspecionados; Node 24 usado, Client regenerado sem banco, unitários/typecheck/lint/build e audit executados; avisos Node/pg e advisories registrados.
3. `CONCLUIDO`: preflight técnico e SQL read-only confirmaram E2E distinto, `public`, nove migrations, recursos preservados e zero concorrência observada; não houve migration, seed ou limpeza.
4. `CONCLUIDO`: runner oficial full UI 1/1, IHFR isolado 6/6, contrato 2/2, integração 107/107; migrations 25/26 na primeira execução, focal 3/3 e repetição 26/26; dados novos preservados e auditados.
5. `CONCLUIDO`: evidências reconciliadas por destino/HEAD, vereditos e encaminhamentos registrados; diff/segredos, commit documental, fetch e política de push verificados no fechamento.

## Pontos de parada

- Identidade, isolamento ou efeitos de escrita inconclusivos: bloquear a escrita afetada e continuar apenas verificações independentes.
- Conflito de fonte que exija autoridade científica/produto: `PENDENCIA_DE_DECISAO`.
- Commit remoto novo ou push que carregaria implementação não revista: não publicar até reexaminar o grafo e o diff.

## Histórico

- 2026-09-26: plano aberto após inspeção do relatório `9bbece0`, fast-forward sem conflito e checkpoint `c79f14b`.
- 2026-09-26: etapas técnicas encerradas no relatório `2026-09-26-revalidacao-conjunta-e-prontidao.md`. Desenvolvimento pode prosseguir sobre os bloqueios descritos; merge continua não pronto. A primeira falha de migration foi mantida como `CAUSA_INDETERMINADA`, sem apagar a repetição verde.
