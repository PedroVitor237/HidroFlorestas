# Contrato HTTP de contas

Runtime Node.js, entradas fechadas, JSON limitado a 16 KiB e UTF-8 estrito, respostas `Cache-Control:no-store, private`, `Referrer-Policy:no-referrer`. CSRF same-origin em mutações; request sem Origin apenas para cliente não browser de mesmo padrão, Sec-Fetch-Site cross-site/same-site negado. Origin não serve como chave de abuso. Cookies HttpOnly/SameSite=Lax/Secure em produção. Nenhuma URL de retorno arbitrária.

Origem CSRF externa: `ACCOUNT_TRUSTED_INGRESS=vercel` exige `VERCEL=1` e comparação exata com `APP_PUBLIC_URL` HTTPS. Não usar x-forwarded-host como autoridade. Perfil próprio local exige flags de ownership e ingresso local: Host loopback3001 ou `ACCOUNT_LOCAL_APP_ORIGIN` exato server-side, loopback/root/sem credencial/query/hash. Seam de produção HTTPS ainda exige AUTH_HTTPS_E2E, confirmação de banco e flags de fixture; no Vercel é recusado. Resolve a normalização loopback→localhost feita pelo Next mantendo Origin nulo e origens arbitrárias negados.

| Endpoint | Entrada | Resposta |
|---|---|---|
| POST /api/auth/sign-up | firstName,lastName,email,password; Idempotency-Key UUID | 201 novo/200 retry: success,user público,destination:'/verify-email'; cookie verification_token30min; auth_token expirado |
| POST /api/auth/sign-in | email,password | success,user,destination normal ou '/verify-email'; senha antiga revisada atomicamente antes de emissão |
| GET /api/auth/email-verification | cookie restrito | success,status PENDING/VERIFIED,challengeId nullable,expiresAt/resendAvailableAt nullable,attemptsRemaining |
| POST /api/auth/email-verification/confirm | challengeId UUID,code textual6 | success,user,destination normal; substitui cookie; prova consumida não reemite |
| POST /api/auth/email-verification/resend | objeto vazio; Idempotency-Key UUID | estado allowlisted; cooldown/tetos429 com Retry-After |
| POST /api/auth/password-reset/request | email; Idempotency-Key UUID | 202 uniforme {success:true,message:'Se a conta puder receber a mensagem, confira seu e-mail.'}, também inelegível/limitado/retry |
| POST /api/auth/password-reset/confirm | token base64url43,newPassword,confirmPassword | success,message; expira cookies, exige novo login |
| POST /api/auth/change-password | currentPassword,newPassword,confirmPassword; normal | success,message; expira cookies, exige novo login |
| POST /api/auth/logout | sem corpo | success; expira ambos cookies |

Erros fechados `{success:false,code,message,retryAfterSeconds?}`; INVALID_REQUEST400, INVALID_CREDENTIALS401, UNAUTHENTICATED401, INVALID_PROOF400, RATE_LIMITED429, ACCOUNT_EXISTS409, IDEMPOTENCY_CONFLICT409, PROVIDER_UNAVAILABLE503, INTERNAL_ERROR500, FORBIDDEN403. Erros nunca incluem input/prova/configuração.

Sessão normal: purpose='session', credentialVersion>=0, issuer='hidroflorestas', audience='hidroflorestas-session', TTL7dias. Restrita: purpose='email-verification', audience='hidroflorestas-verification', TTL30min; cookie separado verification_token. Auth normal recusa JWT restrito mesmo se usuário ficou verificado. Compatibilidade sem versão somente coorte verificationRequired=false e versão0; HS256/expiração obrigatórios, nenhuma role no token.

Identidade: factual preservada, trim/lower para comparação; nenhum Gmail-only. Provas de código e reset não são intercambiáveis. Reset não marca verified e ACTIVE não verificada é elegível; PENDING/BLOCKED/INACTIVE não produzem mensagem pública de reset. Criações internas seguem defaulttrue e login pode criar desafio se inexistente, sem falseverification.

Idempotência: signup/resend/reset request exigem UUID opaco; mesma action/chave/ator+payload repete resultado sem nova conta/envio; payload diverge409 (reset público mantém202 uniforme). Cadastro replay só concede sessão restrita com credencial original válida, mesma version e conta ainda pendente. Repetir email de conta existente com nova chave exige login, sem editar senha/perfil. Retenção24h, conflitos persistentes durante TTL.

Limites: código 15 min/cinco tentativas; reenvio 60 s/cinco emissões por conta e ingresso/hora; reset 30 min/três pedidos por endereço e ingresso/hora. O contador `account-global` limita o total a 100 operações/hora entre signup/login/reenvio/confirmação/reset/troca; transação separada cobra antes dos locks da identidade e não é revertida por erro de domínio. Estado GET não cobra esse contador. Reset request conserva 202/corpo/headers neutros mesmo sob limite; negação global encerra antes de transação de identidade e negação por endereço/ingresso confirma somente counters, sem lookup/receipt. `AccountRequest` vencida é removida pelo worker em lotes de até 100, sem retenção de prova/senha em claro.

Senha nova: mínimo 15 codepoints Unicode/máximo 72 bytes UTF-8, bcrypt custo 10. Recusar valores compostos somente por whitespace, Unicode inválido e NUL; preservar demais espaços e valor completo, sem trim/normalização/truncamento/pré-hash. Login legado compara sem impor o novo mínimo. Política/ativação e coorte têm proveniência no [checkpoint aprovado pelo usuário](../remote-checkpoint.md); o requisito não vazio preserva o comportamento de login existente.

Consumo e tentativa errada reavaliam expiração em atualização condicional com `clock_timestamp()` após awaits/hashing. Finalidade, usuário, binding do e-mail e versão continuam vinculados; somente uma confirmação válida consome. Reset/troca atualizam hash/versão, invalidam provas e enfileiram aviso atomicamente.

Reset link compatível com template existente `/reset-password#token=...`. Captura em memória e remove URL; reload oferece reabrir mensagem ou solicitar novo link. GET/HEAD/scanner só apresenta tela, nenhum consumo; sem analytics/terceiros e no-referrer.
