# Pesquisa: exclusão da própria conta

Pesquisa somente leitura de `deletion_research`, GPT 6.1 Sol ultra, em 2026-10-05.

## Integridade

`EVIDENCIA_IMPLEMENTACAO`: User tem FKs RESTRICT de LaboratoryRoom,
ResearchersLinked, CollectionArea, CollectionData, EnvironmentalMeasurementSet,
ExperimentalIHFRInputSupplement, IHFRDiagnosisOperation, IHFRDiagnosisLifecycleEvent
e AdministrativeAuditEvent (autor/alvo). Históricos também têm triggers imutáveis.

**Decision / RECOMENDACAO adotada**: contar todos, sem filtros de atividade, e
bloquear por categoria/contagem; FKs protegem contra corrida e relações futuras.
**Rationale**: realizar a decisão explícita do usuário preservando rastreabilidade.
**Alternatives considered**: cascade/anonimização fora do escopo; INACTIVE não
implementa exclusão física.

## Autenticação e concorrência

`EVIDENCIA_IMPLEMENTACAO`: requestReset adquire identidade antes de User;
administração protege último ADMIN ACTIVE com Serializable.

**Decision / RECOMENDACAO adotada**: limiter em transação própria, bcrypt antes
dos locks e revalidação de hash/versão/estado em Serializable; identidade antes
de User FOR UPDATE. Confirmar senha existente sem aplicar mínimo de senha nova.
**Rationale**: evitar inversão de locks e exclusão com credencial revogada.
**Alternatives considered**: senha dentro do lock e Read Committed descartados.

## Propriedade da mensagem e R1

`EVIDENCIA_IMPLEMENTACAO`: PASSWORD_CHANGED não tem challenge/dono; contentMac
tem fórmula histórica. AccountRequest.challengeId não tem FK. R1 confirma fence
antes do SMTP, sem lock durante transporte, e admite conclusão já iniciada.

**Decision / RECOMENDACAO adotada**: accountUserId opcional indexado/FK, backfill
por desafios, dono explícito dos avisos; inferir dono pelo desafio e recusar
divergência/replay sem mudar MAC histórico. Avisos antigos sem dono PENDING/
PROCESSING bloqueiam temporariamente exclusão, com índice parcial. Não decifrar
fila/atribuir dono por MAC histórico. Limpar requests por userId ou desafios próprios.
**Rationale**: preservar mensagens de terceiros e compatibilidade de chaves antigas.
**Alternatives considered**: enumerar versões/chaves ou criar outra fila recusados.
O guard depende do worker saudável, pois TTL sozinho não terminaliza linhas.
Transporte autorizado antes da exclusão pode terminar; completion tardio deve
resultar zero linhas, sem recriar estado. Não prometer recolhimento de e-mail.
