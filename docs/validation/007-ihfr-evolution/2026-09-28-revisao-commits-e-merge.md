# Revisão dos seis commits após `9b2c989` — 2026-09-28

## Recorte e autoridade

- Branch examinada: `007-ihfr-evolution@94053dfee912ef9aa4c2444e3d10bea4eb2cbea1`.
- Base anterior: `9b2c9890393b34ab8300bf7dcc6a22f90875c22d` (relatório da rodada anterior).
- `EVIDENCIA_CODIGO`: o comparativo contém seis commits: `ef698a2` (conta e recursos do E2E), `073a9eb` (fluxo e diagnóstico do full UI), `b9d481f` (regressões geral/HTTPS e banco local), `2d21ea6` (evidências), `9638a6b` (nome do relatório) e `94053df` (reconciliação histórica). O commit `9b2c989` anterior também foi publicado e não integra esses seis.
- O comparativo de GitHub `development...007-ihfr-evolution` no momento da revisão indicou `behind_by=0`, `ahead_by=80`: integração por fast-forward é possível no grafo então observado. Não foi executado merge, build, Playwright ou operação no Neon nesta revisão documental.
- Fontes: diffs publicados; [execução pós-avaliação](2026-09-27-execucao-codex-ultra.md); [avaliação anterior](2026-09-27-avaliacao-tecnica-de-merge.md); `AGENTS.md`; ADR-0001. Resultados de execução foram relatados pelo outro desenvolvedor e examinados documentalmente, sem reprodução independente nesta sessão.

## O que mudou e o que foi comprovado

| Frente | Alteração observada | Evidência relatada e limite |
|---|---|---|
| Conta E2E e capacidade | Preflight read-only, conta sintética reservada, guarda de 5/5, lease e verificação de recursos locais antes do navegador. | Conta `reserve-01` criada sob guardas e usada em dois novos runs; 0/5 → 2/5. O lease possui limites temporais documentados; não é prova matemática de exclusividade permanente. |
| Full UI | Esperas HTTP antes do clique, separação entre resposta, navegação e renderização, logs sanitizados e recuperação por leitura, sem repetir POST incerto. | Dois percursos 1/1 em primeira tentativa; o segundo no patch final percorreu login → laboratório → área → coleta → dados → IHFR 0,29/MODERATE/HIGH → reload/histórico → REPLACE → REVOKE. Falhas antigas permanecem históricas, com causa exata indeterminada. |
| Playwright geral e HTTPS | Bancos locais v2 sob guardas, fixture UTC, proteções de baseURL e descarte apenas dos bancos próprios. Uma alteração em `src/app/api/server/lib/prisma.ts` restringe somente o caminho de regressão local pelo marcador de teste. | Geral 55/55 e HTTPS 2/2 na repetição final; a primeira execução geral teve falha de locator que foi registrada e corrigida. Auditoria local final: zero linhas e schemas após descarte/recriação controlado. |
| Build, dependências e IHFR isolado | Os seis commits não alteram `package.json`, lockfile, fórmula, pesos, classes ou migrations de produção. | Relatório registra build padrão, unitários 244/244, typecheck, lint, audits 0, migration 26/26, contrato 2/2, integração 107/107 e IHFR isolado 6/6. O hash distinto do lockfile em Windows/Linux foi atribuído a CRLF/LF sem diff versionado. |
| Neon E2E | Execuções no destino sanitizado `6903ad2ff1ef`, com oito migrations versionadas e dados do fluxo preservados em `public`. | Zero schemas temporários gerenciados ao fim, sem escrita relatada em DEV ou nos endpoints históricos. A ligação endpoint → `branch_id` não foi verificada independentemente nesta revisão. |

## Status externo observado nesta revisão

`EVIDENCIA_EXECUCAO` da API de status do GitHub para `94053df`: contexto **Vercel = failure**, descrição **“Deployment was blocked”**, criado em 2026-09-28 03:27:51 UTC. Não há workflow de pull request retornado para esse SHA nem diagnóstico do bloqueio de implantação nas evidências lidas. `CAUSA_INDETERMINADA`: o status não identifica falha de build/código, quota, política ou configuração; o build padrão passou no executor relatado. É necessário consultar a implantação correspondente no Vercel ou sua configuração antes de considerar o gate remoto resolvido. O status pode mudar; reconfirmá-lo na revisão final.

## Veredito para `development`

- **Fluxo técnico IHFR:** `PASS_RELATADO`, sustentado por dois percursos completos no patch final e persistência/consulta; sem reprodução independente nesta revisão.
- **Gates locais e E2E relatados:** `PASS_RELATADO`, com os resultados discriminados acima. A ciência permanece `CONTRATO_EXPERIMENTAL`, `VALIDACAO_CIENTIFICA_PENDENTE`, `SUJEITO_A_RECALIBRACAO` e `NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO`; validação de campo posterior não bloqueia automaticamente o merge técnico desta entrega experimental, conforme direção do responsável nesta conversa.
- **Integração Git:** fast-forward possível no snapshot examinado, sem conflito demonstrado.
- **Decisão de merge nesta revisão:** `AGUARDANDO_ESCLARECIMENTO_DO_STATUS_REMOTO_E_REVISAO_HUMANA`. O status Vercel “Deployment was blocked” está vermelho e sua causa não foi apurada; verificar se é gate exigido para merge e registrar sua resolução ou dispensa fundamentada. Conferir também a associação operacional do endpoint E2E a sua branch Neon por fonte independente, se for um gate da equipe. Não transformar pendência científica ou dados do endpoint histórico de outro validador em falha desta implementação.

`RECOMENDACAO`: compartilhar este relatório com o responsável pelo código, solicitar o detalhe do deployment Vercel e repetir somente o gate diretamente afetado se a causa envolver runtime/ambiente da branch. A documentação de uso foi atualizada separadamente em `docs/code-first-prd/specifications/` e no roteiro humano; nenhum código foi alterado nesta revisão.
