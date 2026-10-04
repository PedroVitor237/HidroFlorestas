# Baseline e fontes

## Corte e método

Pesquisa estática na base `cfda9dfb65cc13186c76e69fbb2b385eb85783d6`. `EVIDENCIA_IMPLEMENTACAO` abaixo significa código/schema/teste conectado localizado, não execução nesta rodada. Os quatro relatórios de `docs/reports/estabilizacao-relatorios-interface/` foram lidos integralmente como corte histórico de 2026-10-01, não como prova automática do código de 2026-10-03.

## Inventário atual verificável

| Tema | Evidência e localização | Conclusão |
|---|---|---|
| Stack | `package.json:5-68` | Next.js 16.3.6/App Router, TypeScript, Prisma 7.4.2, PostgreSQL/Neon, bcrypt e JWT; não há Nodemailer ou Cloudinary declarados. |
| Cadastro | `src/app/api/server/services/auth.service.ts:67-106`; `src/app/api/auth/sign-up/route.ts:6-35` | Cria conta pública explicitamente `ACTIVE`, emite JWT e cookie imediatamente. |
| Estado padrão | `prisma/schema.prisma:10-47` | `User.status` conserva default `PENDING`; o cadastro público o sobrescreve. |
| Login/sessão | `auth.core.ts:57-105`; `session.ts:3-66` | Só `ACTIVE` autentica e cada request restaura identidade no banco. JWT HS256 tem apenas `userId`, TTL de sete dias; não há `sessionVersion`/`credentialVersion`. |
| Troca de senha | `auth.service.ts:124-151`; `users.service.ts:70-79` | Há troca autenticada com senha atual e bcrypt; não foi localizada rota pública de recuperação. A troca não revoga JWTs existentes. |
| Verificação/e-mail | buscas em `prisma/`, `src/` e `package.json` | Não foram localizados `emailVerifiedAt`, desafio, outbox, transporte SMTP ou templates. |
| Normalização de e-mail | `auth.service.ts:67-90`; `users.service.ts:60-67` | O serviço usa a string recebida para consulta/criação; não foi localizada normalização canônica compartilhada. |
| Imagem de área | `prisma/schema.prisma:108-133`; `area.contracts.ts:4-23`; `areas.service.ts:7-13` | `CollectionArea.image String?` existe, mas contratos, DTOs e criação não o usam; não há upload funcional. |
| Dados ambientais | `environmental-data.service.ts:20-76`; schema `EnvironmentalMeasurementSet`; `environmental-data-form.tsx:10-28` | Uma coleta confirmada recebe no máximo um conjunto confirmado, integral, versionado e imutável; autorização é revalidada e confirmação usa idempotência/transação serializável. |
| Rascunho | `environmental-data-form-state.ts:4-20`; formulário | Estado e revisão vivem apenas na memória do componente. Reload/outro dispositivo perde o conteúdo; não há persistência server-side. |
| Laboratório | `area.authorization.ts:13-25` | Laboratório inativo permite leitura autorizada e bloqueia mutações; vínculo/papel são reconsultados. |
| IHFR | specs/006 e serviços atuais | Consome dados confirmados compatíveis, não tentativas; histórico e caráter experimental devem ser preservados. |

## Contratos a preservar

1. Identidade e autoridade derivam da sessão validada e do estado atual no servidor; IDs do cliente não concedem acesso.
2. `ACTIVE`, `PENDING`, `INACTIVE` e `BLOCKED` são estados administrativos. Verificação de e-mail não deve reativar conta nem substituir papel/vínculo.
3. Laboratórios inacessíveis não podem vazar existência por diferenças desnecessárias de erro.
4. Dados ambientais confirmados são separados da coleta, imutáveis, um conjunto por coleta, com contrato `ihfr-measurement-v1` e confirmação idempotente.
5. Ausente, vazio, zero e `false` têm semânticas distintas.
6. Rascunhos não podem alimentar dashboard, histórico confirmado, elegibilidade ou diagnóstico IHFR.
7. `CollectionArea.image` não comprova fluxo de imagem; qualquer uso exige contrato e persistência explícitos.

## Fontes históricas e divergências

| Fonte | Uso | Limite |
|---|---|---|
| Relatórios de estabilização de 2026-10-01 | Contexto sobre cadastro ativo, tentativa volátil, imutabilidade e próximos recortes | Resultados/testes pertencem a SHAs e ambientes anteriores. |
| `specs/001-*` e `specs/010-*` | Contratos de sessão e decisão temporária de cadastro público ativo | Não decidiram verificação, recuperação ou revogação. |
| `specs/003-*`, `004-*`, `005-*`, `006-*`, `009-*`, `011-*` | Autoridade contextual, coleta, medição, IHFR, administração e UX atual | Não autorizam modelos novos automaticamente. |
| Plano Lovable | Inventário visual e menções a cards com foto/upload | Referência visual não transforma upload em capacidade implementada. |

`PENDENCIA_DE_DECISAO`: a exigência confirmada de verificação entra em tensão com a decisão vigente de cadastro público `ACTIVE` com sessão imediata (`specs/010`). A autoridade atual confirma a nova capacidade, mas não escolhe a política de acesso antes de verificar nem o tratamento das contas existentes. O pacote recomenda uma sessão restrita de verificação e mantém `ACTIVE` separado; implementação depende de decisão registrada.

## Referências externas consultadas em 2026-10-03

- Nodemailer SMTP: <https://nodemailer.com/smtp>
- Google App Passwords: <https://support.google.com/accounts/answer/185833>
- Limites do Gmail: <https://support.google.com/mail/answer/22839>
- Next.js Route Handlers: <https://nextjs.org/docs/app/getting-started/route-handlers>
- Prisma transactions/OCC: <https://www.prisma.io/docs/orm/v6/prisma-client/queries/transactions>
- Cloudinary uploads: <https://cloudinary.com/documentation/upload_images>
- Cloudinary Upload API: <https://cloudinary.com/documentation/image_upload_api_reference>
- Cloudinary client upload/security: <https://cloudinary.com/documentation/client_side_uploading>
- Cloudinary plans: <https://cloudinary.com/documentation/billing_and_plans>
- OWASP Forgot Password: <https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html>
- OWASP Authentication: <https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html>

Preços, créditos e quotas Cloudinary/Gmail não foram fixados neste documento: variam por plano/conta e devem ser reconferidos no console e páginas oficiais antes de implementação e operação.
