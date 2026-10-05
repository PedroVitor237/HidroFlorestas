# Modelo: exclusão da conta

User e suas relações de domínio permanecem inalterados. Só ACTIVE autenticado
sem vínculos é removido; qualquer erro/bloqueio preserva dados.

MailOutbox adiciona `accountUserId String?`, índice e FK User RESTRICT, sem dado
pessoal novo. Migration resolve dono por challenge existente. Avisos antigos sem
dono permanecem sem atribuição inferida; guard operacional aguarda terminalização.

Requests/challenges/outbox próprios são removidos junto da conta. Limiter mantém
retenção pseudonimizada existente, evitando bypass por recadastro. Nova ação
`delete-account` admite cinco tentativas/hora por titular/ingresso e gate global.

Novo cadastro do endereço gera outro id/provas; não restaura identidade excluída.
Não há estado DELETED, anonimização, transferência ou cascade de domínio.
