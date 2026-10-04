# Modelo de dados e estratégia de migrations

Todos os nomes são `PROPOSTA`. O schema final deve nascer nas specs futuras e ser reconciliado com a base então vigente.

## Modelos candidatos

| Modelo/campo essencial | Relações e invariantes |
|---|---|
| `User.emailVerifiedAt DateTime?` | Separado de `status`; não concede autoridade. |
| `User.credentialVersion Int @default(0)` | Incluído em novos JWTs; incremento atômico no reset. |
| `EmailVerificationChallenge` | `userId`, `emailCanonical`, `purpose`, `codeMac`, `keyId`, `expiresAt`, `attemptCount`, `maxAttempts`, `consumedAt`, `invalidatedAt`, `createdAt`; um vigente por conta/finalidade. |
| `PasswordResetChallenge` | `userId`, `tokenDigest`, `expiresAt`, `consumedAt`, `requestedAt`; digest de token de alta entropia; índices sem token. |
| `MailOutbox` | tipo, destinatário protegido, template/version, payload cifrado, `availableAt`, `leaseUntil`, tentativas, estado, erro redigido, expiração/remoção. |
| `RateLimitBucket` | chave HMAC, ação, janela, contador; unique por chave/ação/janela. Alternativa externa exige decisão. |
| `EnvironmentalMeasurementDraft` | `userId`, `collectionDataId`, `laboratoryRoomId`, `formVersion`, `payload Json`, `revision`, status, timestamps, `confirmationKey?`; unique ativo por usuário/coleta. |
| `AreaImage` | `collectionAreaId @unique` no recorte capa, `cloudinaryAssetId @unique`, `publicId @unique`, `resourceType`, `deliveryType`, `version`, `secureUrl`, `format`, bytes, width/height, status e timestamps. |
| `ExternalCleanupJob` | provedor, asset ID, ação, idempotency key, lease/tentativas/estado; evita perda de cleanup. |

## Restrições e índices

- Índices de expiração/worker: `(status, availableAt)`, `(leaseUntil)` e `(expiresAt)`.
- Challenges: unique parcial conceitual para apenas um vigente; se Prisma não expressar, migration SQL + teste de schema.
- Draft: FKs compostas/contextuais devem impedir coleção de outro laboratório; `onDelete: Restrict` por padrão enquanto política não for confirmada.
- Imagem: ownership deriva de FK à área; cliente nunca associa um asset arbitrariamente.
- Campos sensíveis não entram em `AdministrativeAuditEvent` nem em logs. Auditoria registra ação/resultado, não prova.

## Transações

1. Cadastro: conta + challenge + outbox na mesma transação. Se SMTP falhar depois, conta/desafio permanecem recuperáveis por reenvio.
2. Verificação: atualizar challenge e `emailVerifiedAt` por condição no mesmo commit.
3. Reset: validar prova, atualizar hash, incrementar `credentialVersion`, consumir token e criar aviso/outbox no mesmo commit.
4. Draft-confirm: revalidar contexto, revisão, payload completo e cardinalidade; criar/recuperar `EnvironmentalMeasurementSet`; marcar draft no mesmo commit.
5. Imagem: upload externo ocorre antes; persistir nova referência e cleanup job da anterior no mesmo commit. Nunca destruir a antiga antes desse commit.

## Estratégia de migrations

### Fase compatível

1. Adicionar colunas nullable/defaults e novas tabelas sem mudar login atual.
2. Implantar leitura/escrita compatível e métricas, mantendo feature flags server-side.
3. Popular somente dados derivados com regra aprovada. Não preencher `emailVerifiedAt` de contas antigas por inferência.
4. Ativar emissão de JWT com `credentialVersion`; definir janela de compatibilidade ou invalidar sessões de forma comunicada.
5. Ativar gates de verificação somente após decisão `PD-CRI-001/002` e UI operacional.
6. Migrar `CollectionArea.image` somente após reconciliar valores reais: URL existente pode ser preservada como legado; não inventar `assetId/publicId` a partir de URL sem verificação Cloudinary.

### Preflight obrigatório futuro

- contagem de contas por estado e presença de imagem, sem exportar PII;
- duplicidades/collation de e-mail e regra de canonicalização;
- referências órfãs e tamanho/tipo de valores `CollectionArea.image`;
- migrations aplicadas versus repositório no destino isolado;
- capacidade/timeout direto versus pooled do PostgreSQL/Neon.

### Rollback/recovery

- Migration aditiva deve permitir rollback de aplicação sem apagar novas linhas.
- Depois de ativar verificação/revogação, rollback de comportamento exige plano específico; não remover `credentialVersion` nem marcar contas verificadas/desverificadas em massa.
- Objetos Cloudinary e e-mails são efeitos externos irreversíveis por transação SQL. Use jobs reconciliáveis, idempotency e relatório de órfãos; rollback nunca promete “desenviar” mensagem.
- Purge só ocorre após retenção aprovada, backup/observabilidade e seleção exata; nunca apagar históricos confirmados para liberar fixtures.
