# Contrato focal do cadastro público

`POST /api/auth/sign-up` mantém corpo de sucesso `{ "success": true, "user": { "firstName": string, "lastName": string, "image": string } }` e o cookie de sessão existente. Falhas e mensagens permanecem no contrato atual. O registro persistido inclui `status = ACTIVE` e hash da senha, mas o corpo público não inclui e-mail, senha, hash, papel, estado nem token.

`POST /api/auth/sign-in` mantém seu contrato em `specs/001-authenticated-access/contracts/auth-api.openapi.yaml`: apenas `ACTIVE` autentica; senha incorreta e estados inelegíveis retornam `INVALID_CREDENTIALS`.
