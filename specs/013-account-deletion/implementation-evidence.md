# Evidências: exclusão da própria conta

`DECISAO_CONFIRMADA`: pedido e duas escolhas explícitas do usuário nesta conversa,
2026-10-05: o titular confirma a senha; vínculos científicos/administrativos impedem
exclusão e devem ser explicados. [Spec](spec.md) registra a proveniência.

`EVIDENCIA_IMPLEMENTACAO`: branch `feat/account-deletion`, worktree isolado
`C:/projetos/consolidados/HidroFlorestas-account-deletion`, base `40190f7`.
Commits `d341fe4` e `3858c51` são ancestrais preservados. Os dois worktrees
anteriores e os recursos dos juniors não foram alterados.

GET/DELETE `/api/auth/account-deletion`, página `/delete-account` e links normal,
administrativo e restrito. Identidade vem somente do cookie JWT válido. Senha atual,
checkbox explícito, CSRF, corpo fechado, limiter durável antes de bcrypt e transação
serializável revalidam a conta. Vínculos são categorias e contagens sem IDs de terceiros.
Último administrador ativo é protegido. Nenhum dado científico/auditável é removido.

Migration aditiva `20261005000100_account_deletion_mail_ownership` identifica o
dono dos e-mails sem alterar conteúdo/MAC histórico. Backfill ocorre somente
quando um challenge prova a relação. Avisos antigos ainda ativos e sem dono
impedem temporariamente exclusão. Contadores pseudônimos conservam a retenção
existente para não permitir evasão por exclusão/recadastro.

Exclusão remove fisicamente a identidade, challenges, receipts e outbox próprios,
revoga sessões pela ausência da identidade e limpa os dois cookies após commit.
Recadastro é uma nova identidade. Transporte já autorizado pode terminar; teste
R1 comprova que sua conclusão tardia não recria mensagens removidas.

Validação local: 283 testes unitários + 17 de mail, 170 integrações PostgreSQL,
35 migrations, 6 contratos HTTP e 3 jornadas Playwright. Build e TypeScript PASS;
lint sem erros, com três warnings preexistentes. Navegador comprova cancelamento,
senha incorreta, confirmação por teclado/mobile, duas sessões, escopo restrito,
vínculos e último administrador. Somente fixtures sintéticas foram excluídas;
schemas próprios são removidos pelo harness após verificar seu marcador.

Ocorrências corrigidas: três testes administrativos inicialmente acionados no
modo Schema exigiam Regression; reexecutados corretamente. Uma fixture nova de
laboratório precisava incluir membership OWNER devido ao trigger existente.
Seletores Playwright foram ajustados para o anunciador do Next e o redirecionamento
privado já existente. O harness teve correção de tipagem NODE_ENV. Resultados finais
acima correspondem às correções, sem enfraquecer guards ou modificar o domínio.

Publicação Git continua pendente: integração histórica do origin não comprovada
isolada. Não houve push, merge, force-push ou alteração de produção. Aprovação
humana da jornada de exclusão ainda pendente; não declarar Gate B encerrado.
As pendências prévias da Fase 2 continuam em seus próprios registros.

## Publicação do candidato — 2026-10-05

`EVIDENCIA_IMPLEMENTACAO`: candidato `38811a16058a78d51f3422cbf28f8c586e7cc8b8`
publicado por arquivo conferido, sem contexto Git, no projeto já autorizado
`prj_OHzoR4hZ4MOrg2HOBvbZmiADrwaz` / equipe `team_YqedIK09zOGFeZ8M84kra0oM`.
Deployment `dpl_73P3jueQ2VWokPRTm8zamETNUN1q` READY, confirmado pela API oficial.
URL [Excluir minha conta](https://hidroflorestas-accounts-homologatio.vercel.app/delete-account).
Não há vínculo com thalesvalente nem modificação dos projetos existentes.

Fingerprint funcional `91b7b986811991510bb8c847ffbfceb2c6d17d8deea434629741b544bb7b76a3`;
486 blobs funcionais conferidos, 458 equivalências pelo filtro Git de fim de linha.
Arquivo exportado tem fingerprint `ee94d2e042df9ac17fc6995fc651856225bbb5b7de06f79e1a1782cd79fc7b23`.
Dry upload de 766 arquivos PASS na procura de caminhos privados, links e valores
privados conhecidos, sem registrar seus valores. Export e logs ficam só no mecanismo
local privado; não se publica dotenv, credencial ou recurso de depuração.

Neon próprio recebeu somente a migration aditiva de exclusão: 12 concluídas,
nenhuma falha. Duas migrations antigas diferiam apenas em LF/CRLF no checkout.
Runner privado usou exatamente os bytes anteriormente aplicados, conferidos contra
conteúdo Git normalizado; não editou migration versionada nem checksum no banco.
As 12 entradas foram conferidas por leitura. Contagem de contas (1), coletas (0)
e histórico administrativo (0) permaneceu igual antes/depois; sem exclusão real.

Checks HTTPS 10/10 em 21:55:59 UTC: página acessível, anonimato 401, CSRF 403,
worker sem segredo 401 e rotas anteriores 200. Cron próprio 8586345 continua
ativo e sem alteração; execução automática de 21:56:18 UTC retornou HTTP 200
em 1519 ms após READY. Não houve disparo manual autenticado para essa evidência.

`PENDENCIA_DE_DECISAO`: aprovação pelo titular da jornada real na homologação,
solicitada nesta conversa, exclusivamente em conta de teste que possa ser removida
permanentemente. Testes automatizados não substituem essa aprovação.
