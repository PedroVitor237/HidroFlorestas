# Contrato: exclusão da própria conta

GET `/api/auth/account-deletion`: cookie normal/restrito válido; só consulta.
200 `{success:true,canDelete,blockers:[{code,label,count}],returnTo}`. Categorias
fixas LABORATORIES, MEMBERSHIPS, AREAS, COLLECTIONS, MEASUREMENTS, IHFR_INPUTS,
IHFR_OPERATIONS, IHFR_HISTORY, ADMINISTRATIVE_HISTORY, LAST_ACTIVE_ADMIN.
Sem IDs/registro de terceiros/email/credencial/proof.

DELETE no mesmo endpoint: Content-Type JSON, corpo fechado
`{currentPassword:string,confirmDeletion:true}`; sem ID/query. CSRF e body limit
existentes. Senha atual mantém valor completo e limite de login, sem mínimo novo.
200 `{success:true}` após commit; expira ambos
cookies. 400 INVALID_REQUEST; 401 UNAUTHENTICATED/INVALID_CREDENTIALS;
403 FORBIDDEN; 409 ACCOUNT_LINKED com blockers; 429 RATE_LIMITED/Retry-After;
503 MAIL_CLEANUP_PENDING ou CONCURRENT_CHANGE recuperável; 500 INTERNAL_ERROR.
Senha errada/bloqueio não expira cookies nem altera domínio.

Headers privados no-store/no-referrer/Pragma; GET não muta estado. DELETE revalida
vínculos/último admin, mesmo após GET favorável. R1 preservado: remover linhas
recusa novo fence e completion tardio; SMTP previamente autorizado pode terminar.
