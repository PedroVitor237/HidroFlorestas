# Decisões, recomendações e pendências

## Decisões confirmadas

| ID | Decisão | Origem | Efeito |
|---|---|---|---|
| DEC-001 | Enviar e-mails com Nodemailer via SMTP Gmail e senha de aplicativo. | Pedido anexado de 2026-10-03 | Fecha transporte inicial, não política de filas/validade. |
| DEC-002 | Verificar cadastro com código numérico textual de exatamente seis dígitos. | Pedido anexado | Fecha formato/finalidade; validade e tentativas seguem propostas. |
| DEC-003 | Usar API do Cloudinary para imagens, inicialmente plano gratuito. | Complemento explícito do usuário em 2026-10-03 | Substitui comparação aberta de provedor; não confirma quotas nem exposição pública. |
| DEC-004 | Produzir somente documentação nesta rodada. | Pedido anexado | Proíbe código, migrations, dependências, env, uploads/envios reais, push e PR. |

## Recomendações técnicas concretas

| ID | Recomendação | Justificativa | Aprovação necessária |
|---|---|---|---|
| REC-001 | Sessão restrita de verificação; nenhuma sessão normal antes de `emailVerifiedAt`. Manter estado administrativo `ACTIVE` separado. | Evita usar `PENDING` como dois conceitos e não transforma verificação em aprovação manual. | Produto/autenticação. |
| REC-002 | Código válido por 15 min, 5 tentativas, reenvio após 60 s, máximo 5 envios/h por conta e origem; novo código invalida anterior. | Parâmetros explícitos, configuráveis e testáveis para reduzir brute force/abuso. | Segurança/produto. |
| REC-003 | HMAC-SHA-256 do código com segredo separado e identificador de chave; comparação segura. | O espaço de 1 milhão torna hash simples enumerável. | Segurança. |
| REC-004 | Recuperação por token opaco aleatório de 32 bytes, 30 min, uso único; resposta uniforme. | Maior entropia e separação de finalidade. | Segurança/produto. |
| REC-005 | Adicionar `credentialVersion` à conta e ao JWT; incremento na redefinição, exigindo novo login. | Revoga concretamente sessões stateless antigas. | Arquitetura/autenticação. |
| REC-006 | Outbox PostgreSQL durável, worker agendado externo/Vercel Cron autenticado, leases e retries; payload sensível cifrado e TTL curto. | Funções serverless não podem depender de promessa não aguardada; hash do código não serve para enviar depois. | Operação/arquitetura. |
| REC-007 | Primeiro recorte de rascunho: um rascunho pessoal por `(user, collection)` para medições de coleta já confirmada; save explícito e retomada server-side. | Atende o preenchimento ambiental sem misturar metadados pré-coleta. | Produto/dados. |
| REC-008 | Rascunho com revisão otimista, retenção de 30 dias desde última edição e limpeza posterior; confirmação transacional e idempotente. | Evita sobrescrita silenciosa e acúmulo indefinido. | Produto/operação. |
| REC-009 | Primeiro recorte de imagem: uma foto de capa por área, pública apenas se a equipe aceitar exposição; upload Cloudinary assinado e autorizado pelo backend. | Compatível com campo singular atual e plano gratuito; galeria é extensão. | Privacidade/produto. |
| REC-010 | Persistir `assetId`, `publicId`, `version`, `secureUrl`, formato, bytes, dimensões e estado; substituição só remove a antiga após commit da nova. | URL isolada não suporta ownership, cleanup e reconciliação seguros. | Dados. |

## Pendências de decisão

| ID | Pergunta exata | Bloqueia | Padrão recomendado |
|---|---|---|---|
| PD-CRI-001 | Conta nova recebe sessão normal antes de verificar? | Verificação/UI/guards | Não; apenas sessão restrita. |
| PD-CRI-002 | Como tratar contas existentes e admins? | Backfill/rollout | Não marcar silenciosamente. Implantar modo compatível e campanha/aceite separado. |
| PD-CRI-003 | Quais remetente, nome e domínio público oficiais? | Templates/smoke SMTP | Definir `MAIL_FROM` e `APP_PUBLIC_URL` por ambiente. |
| PD-CRI-004 | Quem opera e monitora outbox/cron e troca credenciais? | Produção de e-mail | Responsável e runbook antes de ativar. |
| PD-CRI-005 | Rascunho é pessoal ou compartilhado no laboratório? | Permissões/modelo | Pessoal no primeiro recorte. |
| PD-CRI-006 | Retenção/auditoria de rascunhos descartados? | Cleanup/privacidade | 30 dias ativos; descarte lógico curto e purge, sem ledger permanente por padrão. |
| PD-CRI-007 | Imagens de áreas podem ser públicas por URL? | `type` Cloudinary e entrega | Considerar potencial dado sensível; usar acesso autenticado até decisão. |
| PD-CRI-008 | Uma capa ou galeria? | Modelo/UI/quotas | Uma capa; galeria posterior. |
| PD-CRI-009 | Limites de tamanho, formatos, dimensões e transformações? | Upload/preset/testes | JPEG/PNG/WebP; 10 MiB antes da transformação; remover metadados; limites configuráveis, sujeitos a validação. |
| PD-CRI-010 | Quem acompanha créditos/uso do plano gratuito Cloudinary? | Operação | Alertas e revisão antes de atingir limite; sem promessa de gratuidade permanente. |

Pendências bloqueiam somente a etapa indicada. Pesquisa, contratos e testes das partes independentes podem avançar sem promover o padrão recomendado a decisão.
