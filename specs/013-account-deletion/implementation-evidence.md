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
isolada. Não houve push, merge, force-push ou alteração de produção. Homologação
de exclusão e aprovação humana ainda pendentes; não declarar Gate B encerrado.
As pendências prévias da Fase 2 continuam em seus próprios registros.
