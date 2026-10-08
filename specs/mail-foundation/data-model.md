# Modelo técnico aditivo

- `User.emailVerifiedAt`: nullable timestamptz, sem backfill. `credentialVersion`: inteiro >=0, default 0; JWT atual não consulta nem emite esta versão.
- `AccountEmailChallenge`: id UUID textual; userId FK Restrict; purpose EMAIL_VERIFICATION/PASSWORD_RESET; emailBindingMac e proofDigest opacos, proofKeyId externo, expiresAt, attemptCount/maxAttempts fornecidos pelo futuro contrato; consumedAt/invalidatedAt; unique parcial de desafio não consumido/inválido por conta/finalidade. Expiração temporal não libera unique automaticamente: futuro produtor invalida anterior em transação.
- `MailOutbox`: id UUID; idempotencyKey opaca única; contentMac HMAC; template enum versionado; encryptedPayload JSON nullable (recipient, dados e URL-base confiável); expiresAt/availableAt; status PENDING/PROCESSING/SENT/DEAD/EXPIRED/CANCELLED; attempts/maxAttempts; claimToken/leaseUntil; challengeId opcional FK Restrict; lastError enum redigido; acceptedAt/createdAt/updatedAt UTC.
- Checks impedem payload em terminal, ausência de payload em ativo, posse incompleta, tentativas fora do limite e validade anterior à criação. Índices status/availableAt, leaseUntil, expiresAt, challengeId.
- `MailRateLimitBucket`: subjectMac HMAC 64 hex + action allowlisted + windowStart chave composta; windowEnd; contador >=0. Incremento condicional atômico; nenhum e-mail/IP em claro. Janela/limite fornecidos pelo chamador; nenhuma política pública ativada.

Transições: PENDING → PROCESSING → SENT/DEAD/PENDING; ativo expirado → EXPIRED; invalidação → CANCELLED. Lease vencido recupera PROCESSING com novo token ou DEAD ao atingir limite. Resultado exige token vigente, lease válido e estado PROCESSING. SMTP fora de transação. Limpeza terminal e buckets vencidos por lote via SKIP LOCKED.
