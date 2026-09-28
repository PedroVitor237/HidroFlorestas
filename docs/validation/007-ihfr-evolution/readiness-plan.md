# Plano de validação do HEAD remoto da 007

- Identificador: `007-merge-readiness-2026-09-26`.
- Estado: `CONCLUIDO`.
- Objetivo: decidir com evidências reproduzidas se `c6e43026f7946bb37f207402986b5df2077657c1` completa o fluxo pela interface e pode integrar `origin/development`.
- Escopo de edição: somente `docs/validation/007-ihfr-evolution/`. Sem merge, push, mudança de implementação ou comunicação externa.
- Fontes: solicitação atual do responsável; constituição, PRD Code-First e `specs/006-ihfr-diagnosis/spec.md` para intenção; código, migrations, testes e execução no HEAD para comportamento; relatórios anteriores como evidência histórica. Inferências e recomendações serão identificadas.
- Estado inicial: branch local `007-ihfr-evolution@2c63c6749f43542cce4dafbdc452be773fee85fe`, worktree limpo; `origin/007-ihfr-evolution@c6e43026f7946bb37f207402986b5df2077657c1`, 15 commits à frente; `origin/development@100351e07d9f89f34ebb0ea4de17b526297d6350`. Os checkpoints `2295502` e `2c63c67` já eram ancestrais do remoto. Fast-forward sem conflito efetuado; checkpoint inicial vazio `1158a0d` criado com árvore limpa.
- Dependências e riscos: ambiente local com Node 20 e adapter Neon 7.7.0 anterior ao lockfile atualizado; banco E2E em `public` com dados sintéticos preservados; migration aditiva de integridade; identidade independente de branch Neon e validação científica ainda externas.
- Responsável pela execução: agente desta rodada. Revisão científica e decisão de merge: responsáveis não especificados.

## Etapas e critérios de conclusão

1. `CONCLUIDO`: examinar o grafo, os 15 commits, o diff e reconciliar por fast-forward sem perda documental.
2. `CONCLUIDO`: alinhar runtime ignorado pelo Git e repetir verificações sem banco necessárias para as correções.
3. `CONCLUIDO`: auditar somente leitura o destino E2E e os recursos históricos; aplicar apenas a migration pendente após conferir pré-condições e efeitos.
4. `CONCLUIDO_COM_RESSALVA`: reabrir a coleta histórica pela UI; criar o cenário novo pela UI, diagnosticar e verificar reload/histórico com oráculo independente. O runner versionado parou por timeout visual antes do diagnóstico; a continuação manual controlada concluiu o fluxo sem repetir a escrita.
5. `CONCLUIDO`: verificar integração com `origin/development`, registrar vereditos separados, revisar diff/segredos e criar commit documental final.

## Pontos de parada

- Destino de escrita divergente ou sem isolamento comprovável: suspender escrita e documentar.
- Migration incompatível com dados existentes: suspender deploy e preservar os dados.
- Conflito de fonte que dependa de autoridade científica/produto: registrar `PENDENCIA_DE_DECISAO`.

## Histórico

- 2026-09-26: plano iniciado após `git fetch`, inspeção do avanço direto e checkpoint local `1158a0d`.
- 2026-09-26: execução e decisão detalhadas na seção 13 de `validation-report.md`; prontidão para merge classificada `NAO_PRONTA` por runner integral vermelho e alertas de segurança ainda não triados. Nenhum merge, push ou alteração de implementação nesta rodada.
