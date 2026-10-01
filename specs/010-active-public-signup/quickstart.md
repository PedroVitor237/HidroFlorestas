# Validação: cadastro público ativo

1. Execute `node --import=tsx tests/unit/auth-service.test.ts`. Ele cria uma conta em memória pelo serviço de cadastro e autentica a mesma senha pelo serviço de login; verifica hash, estado, DTO público e rejeições existentes.
2. Execute `npx prisma generate`, `npm run typecheck`, `npm run lint` e `npm run test:unit`.
3. Confirme `git diff --check`, ausência de migration e `@default(PENDING)` intacto em `prisma/schema.prisma`.

O roteiro não escreve no Neon. Uma conferência manual posterior, se autorizada em ambiente isolado, deve usar uma conta nova de teste e não alterar status manualmente.
