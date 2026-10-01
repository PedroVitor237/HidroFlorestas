# Research: Registro geral de coleta ambiental

**Feature**: IMP-004

**Date**: 2026-09-15

**Status**: complete

Este documento resolve as escolhas técnicas do planejamento. `EVIDENCIA_IMPLEMENTACAO` descreve somente o código integrado; `CONTRATO_PLANEJADO_HERDADO` descreve a IMP-003 ainda não implementada; `DECISAO_DE_PLANEJAMENTO` orienta a futura implementação sem alterar decisões de produto ou ciência.

## R-001 — Baseline arquitetural e gate da IMP-003

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: manter o monólito Next.js e reutilizar o `authorizeLaboratoryAccess` integrado e comprovado por T005, sem fallback ou guard paralelo. Para criação, usar a assinatura real com `"CREATE_COLLECTION"`, a transação corrente e `mutate=true`.

**Rationale**: handlers com factory/DI, contratos fechados, serviços com ports pequenos co-localizados e Prisma transacional são padrões integrados. A IMP-003 agora fornece papéis contextuais, área nova, rotas e guard em código. O literal `CREATE_COLLECTION` integra o tipo fechado de permissões; as três funções contextuais são aceitas e o argumento `mutate=true` aplica a precedência de laboratório inativo. A área continua sendo consultada no serviço pelo par `{ id, laboratoryId }` depois da decisão contextual.

**Alternatives considered**:

- Implementar um guard temporário de coleta sobre o schema atual: rejeitado por duplicar autorização e criar comportamento incompatível.
- Integrar ou reimplementar a IMP-003 dentro da IMP-004: rejeitado por violar escopo, branch e trabalho em equipe; a integração ocorreu por merge de `development`.
- Inferir atividade somente do nome `CREATE_COLLECTION`: rejeitado; a assinatura real exige `mutate=true` para aplicar `READ_ONLY`.

## R-002 — Representação temporal na API

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: aceitar `occurredAt` como um único timestamp em perfil canônico RFC 3339, com offset obrigatório e precisão de zero a três casas fracionárias: `YYYY-MM-DDTHH:mm:ss[.SSS](Z|±HH:MM)`. Rejeitar horário sem offset, `-00:00`, data civil impossível, segundo `:60`, offset inválido e fração acima de milissegundos.

**Rationale**: RFC 3339 define timestamps como instantes com relação explícita a UTC e desaconselha horário local não qualificado. Um valor completo elimina a combinação ambígua de data/hora separadas. `-00:00` significa offset local desconhecido no RFC original e contraria o requisito de fuso explícito. Segundo intercalar e precisão superior a milissegundos não são representados com segurança pelo baseline atual; recusar preserva o valor sem arredondamento silencioso. Fonte normativa: [RFC 3339](https://www.rfc-editor.org/rfc/rfc3339.html), especialmente seções 4.2, 4.3 e 5.6; atualização semântica consultada em [RFC 9557](https://www.rfc-editor.org/rfc/rfc9557.html).

**Alternatives considered**:

- Campos independentes de data, hora e fuso: rejeitados por ampliar estados inválidos e exigir montagem adicional.
- Horário local sem offset e fuso do navegador: rejeitado por ambiguidade e dependência de estado client-side.
- Aceitar qualquer string convertível por `Date`: rejeitado porque parsing permissivo varia e pode normalizar entradas inválidas.
- Truncar frações além de três dígitos: rejeitado por alterar silenciosamente o momento informado.

## R-003 — Persistência UTC, offset e IANA

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: persistir o instante em `occurredAt DateTime @db.Timestamptz(3)` e preservar separadamente `occurrenceOffset` canônico (`Z` ou `±HH:MM`). Persistir `confirmedAt DateTime @db.Timestamptz(3)` separadamente, definido automaticamente pelo serviço dentro da transação e sem default físico. Não adicionar identificador IANA.

**Rationale**: PostgreSQL normaliza `timestamp with time zone` como instante e não preserva a forma/origem do fuso; o offset separado permite reapresentar a hora civil registrada. Prisma suporta `timestamptz` como `DateTime @db.Timestamptz(x)`, enquanto o mapeamento padrão atual é `timestamp(3)` sem fuso. Fontes: [PostgreSQL Date/Time Types](https://www.postgresql.org/docs/current/datatype-datetime.html) e [Prisma PostgreSQL connector](https://docs.prisma.io/docs/orm/v6/overview/databases/postgresql). Uma coleta passada com offset explícito já é um instante desambiguado; IANA é necessária para regras territoriais/futuras, não para reproduzir esse offset.

**Alternatives considered**:

- Armazenar somente `timestamptz`: rejeitado porque perde o offset informado.
- Armazenar somente texto RFC 3339: rejeitado porque dificulta comparação e invariantes temporais.
- Armazenar offset e IANA: rejeitado como abstração especulativa; cria conflitos de consistência sem requisito atual.
- Reutilizar `createdAt` como confirmação: rejeitado porque timestamp técnico não prova confirmação, sobretudo em dados legados.

## R-004 — Validação de futuro e relógio

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: validar `occurredAt <= now` no servidor imediatamente antes da criação, usando relógio injetável nos testes. Igualdade é válida; qualquer valor futuro falha sem tolerância ou correção. Validação client-side serve apenas para feedback antecipado.

**Rationale**: a spec define uma ocorrência já realizada e proíbe correção silenciosa. O relógio server-side é a autoridade comum; injeção torna fronteiras determinísticas. Um check de banco com `now()` seria inadequado porque a condição muda com o tempo e não representa uma invariante estática.

**Alternatives considered**:

- Tolerância arbitrária para clock skew: rejeitada por não possuir decisão funcional.
- Corrigir automaticamente para o horário atual: rejeitado por alterar o dado informado.
- Confiar somente no navegador: rejeitado porque relógio e estado client-side não são autoridade.

## R-005 — Evolução compatível de `CollectionData`

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: evoluir `CollectionData` com `laboratoryRoomId`, `occurredAt`, `occurrenceOffset`, `confirmedAt` e `confirmationKey`, preservando `id`, `userId`, `collectionAreaId`, timestamps técnicos, `observations` e todas as relações científicas legadas. Não criar modelo científico nem tabela substituta.

**Rationale**: `prisma/schema.prisma` já declara `CollectionData` como o elo entre área, usuário e filhos científicos, embora não exista consumidor. Evolução incremental conserva FKs e dados. O novo serviço pode aplicar uma allowlist que ignora `observations`, diagnóstico, água, solo, vegetação e terreno sem promovê-los a requisito.

**Alternatives considered**:

- Criar `EnvironmentalCollection` paralelo: rejeitado por duplicar identidade e dificultar evolução futura.
- Remover modelos/campos científicos: rejeitado por risco de perda e por estar fora do escopo.
- Expor `observations` por já existir: rejeitado porque schema é evidência, não autorização de metadado.

## R-006 — Compatibilidade legada e migration

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: usar migration expand-first após a migration da IMP-003. Preencher apenas `laboratoryRoomId` por join determinístico com a área. Manter `occurredAt`, `occurrenceOffset`, `confirmedAt` e `confirmationKey` fisicamente anuláveis e aplicar check “todos nulos ou todos preenchidos”. A API nova cria/consulta somente a tupla completa; nenhuma ocorrência ou confirmação é inventada para linha legada.

**Rationale**: registros existentes não possuem momento de campo nem confirmação semântica. Copiar `createdAt` fabricaria ambos. A tupla distingue legado preservado de uma coleta confirmada pela IMP-004 sem novo status de produto. FK composta garante que laboratório e área não divirjam.

**Alternatives considered**:

- Backfill `occurredAt`/`confirmedAt = createdAt`: rejeitado por promover timestamp técnico.
- Exigir ausência total de legado: rejeitado por bloquear desnecessariamente uma expansão compatível.
- Deixar campos novos sem check: rejeitado porque permitiria registros parcialmente confirmados.
- Drop/recriação da tabela: rejeitado por ser destrutivo.

## R-007 — Idempotência e concorrência

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: exigir `Idempotency-Key` UUID por tentativa intencional, persistido como `confirmationKey` com unicidade `(userId, confirmationKey)`. A transação serializável revalida contexto, compara eventual registro existente e cria no máximo um. Repetição idêntica retorna o registro existente; mesma chave com rota ou ocorrência diferente retorna `409 CONFLICT`.

**Rationale**: a chave identifica a ação, não o conteúdo. Isso permite repetir após timeout sem duplicar e permite duas coletas intencionais com dados iguais. A restrição no banco protege corridas que o botão desabilitado não cobre. Os campos persistidos bastam para comparar a tupla, dispensando hash e dependência. O serviço de laboratórios já demonstra transação serializável e retry limitado para conflitos.

**Alternatives considered**:

- Desabilitar apenas o botão: rejeitado porque não cobre retries, múltiplas abas ou concorrência.
- Deduplicar por conteúdo: rejeitado porque medições gerais iguais podem ser coletas distintas.
- Tabela genérica de idempotência: rejeitada como camada desnecessária para duas operações.
- Chave global sem autor: rejeitada por permitir colisão entre usuários e ampliar a fronteira de acesso.

## R-008 — Imutabilidade

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: não oferecer `PATCH`/`DELETE`, não expor update/delete no port público do serviço e instalar trigger que rejeite update/delete de linhas IMP-004, identificadas por `confirmedAt IS NOT NULL`. A revisão permanece somente em memória e o primeiro write é a confirmação.

**Rationale**: ausência de rota protege a superfície pública, mas não impede alterações por outros caminhos Prisma futuros. A trigger materializa a invariante confirmada sem bloquear a preservação de linhas legadas. Uma feature futura deverá alterar explicitamente essa política se edição/exclusão for autorizada.

**Alternatives considered**:

- Imutabilidade somente no frontend: rejeitada por não ser fronteira de segurança.
- Imutabilidade somente no serviço: rejeitada porque outros serviços poderiam escrever.
- Trigger sobre toda `CollectionData`: rejeitada porque o estado e a finalidade das linhas legadas não foram aprovados.

## R-009 — Rotas, envelopes e DTOs

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: criar somente POST da coleção contextual e GET do detalhe contextual. Usar body `{ occurredAt }`, header `Idempotency-Key`, sucesso `{ collection }`, erros `{ error: { code, message } }`, `Location` em criação/replay e `Cache-Control: no-store` em todas as respostas. `Location` representa a URI canônica da API; a interface constrói sua própria rota com o contexto validado e o `collection.id` do body, sem abrir nem converter texto arbitrário do header. Fechar todos os schemas e serializar apenas coleta, área e laboratório públicos mínimos.

**Rationale**: rotas aninhadas tornam laboratório/área explícitos sem aceitá-los como autoridade no body. O envelope e erros seguem o contrato planejado mais recente da IMP-003. A divergência com o envelope legado da IMP-002 será verificada no gate de integração, não resolvida silenciosamente agora.

**Alternatives considered**:

- Rota `/collections` sem contexto: rejeitada por enfraquecer isolamento e navegabilidade.
- Body com `laboratoryId`, `areaId`, autor ou confirmação: rejeitado porque o cliente não é autoridade.
- Listagem para reencontrar o detalhe: rejeitada; `Location` e navegação direta atendem ao incremento.
- Incluir medições ou observações: rejeitado por ausência de autorização.

## R-010 — Interface e estado de revisão

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: criar páginas contextuais `collections/new` e `collections/[collectionId]`, com formulário/revisão em estado React volátil. A chave idempotente permanece estável durante correção, confirmação e retry; uma nova chave só surge quando a pessoa inicia outra coleta.

**Rationale**: memória do componente permite revisar e voltar sem persistir rascunho. A página contextual planejada da área é o ponto de entrada correto. O mock atual `/dashboard/collects` não possui contexto real e não deve virar listagem por conveniência.

**Alternatives considered**:

- `localStorage`/`sessionStorage`: rejeitado porque materializa retomada/rascunho não aprovado.
- POST temporário antes da revisão: rejeitado porque viola criação somente na confirmação.
- Reaproveitar o dashboard mock: rejeitado porque mistura áreas, histórico e IHFR fora do recorte.

## R-011 — Testes, fixtures e segurança operacional

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: aplicar TDD com shells compiláveis, RED funcional e camadas unitária, contrato, integração, migration PostgreSQL e E2E serial. Compor o guard fail-closed existente e fixtures IMP-003; cleanup allowlisted antes/depois e contagem final zero são obrigatórios.

**Rationale**: o repositório usa `node:test`/`tsx`, factories injetáveis e Playwright serial. O guard existente exige ambiente de teste, URL explícita distinta e confirmação antes de conectar. Migration, FK, trigger e concorrência precisam de PostgreSQL descartável real; fakes não comprovam invariantes do banco.

**Alternatives considered**:

- Adicionar biblioteca de testes: rejeitada; ferramentas atuais cobrem o escopo.
- Simular migration apenas em unidade: rejeitado por não provar DDL PostgreSQL.
- Reutilizar banco de desenvolvimento: rejeitado pelo guard e risco destrutivo.
- Considerar falha de import/configuração como RED: rejeitado; não comprova ausência funcional.

## R-012 — Dependências e possibilidades futuras

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: não adicionar dependência de produção ou desenvolvimento. Preservar como escopo adiado, sem abstrações atuais: medições validadas, rascunho/retomada, edição/exclusão, listagem/histórico, horário desconhecido/impreciso, IANA e IHFR.

**Rationale**: APIs nativas, stack atual e PostgreSQL atendem à feature. Criar campos/endpoints antecipados congelaria decisões ainda sem autoridade. Vulnerabilidades globais permanecem destinadas a `chore/dependency-security-audit`; nenhum `npm audit fix` integra esta entrega.

**Alternatives considered**:

- Biblioteca temporal: rejeitada porque parsing/serialização do perfil restrito é pequeno, testável e não exige regras IANA.
- Framework de idempotência: rejeitado pela estratégia local transacional.
- Preparar endpoints vazios futuros: rejeitado como escopo e abstração especulativos.

## Resolved Unknowns

Todos os pontos técnicos do `Technical Context` foram resolvidos, sem clarificações abertas. A pendência científica está fora do escopo; a dependência da IMP-003 é um gate explícito de implementação, não uma ambiguidade do plano.
