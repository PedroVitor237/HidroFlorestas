# Research: Cadastro e consulta espacial de área

**Feature**: IMP-003  
**Date**: 2026-09-14  
**Status**: complete

Este documento resolve as escolhas técnicas deixadas abertas pela especificação. `DECISAO_DE_PLANEJAMENTO` identifica escolhas deste plano; `EVIDENCIA_IMPLEMENTACAO` descreve apenas o baseline observado; `RECOMENDACAO_OPERACIONAL` não cria intenção de produto.

## R-001 — Papel contextual e identidade do vínculo

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: criar `LaboratoryMembershipRole` com `OWNER`, `ADMIN` e `MEMBER`; adicionar ao vínculo os campos `id String @unique @default(uuid())` e `role ... @default(MEMBER)`, preservando a chave composta `(userId, laboratoryRoomId)`.

**Rationale**: o papel pertence à relação conta–laboratório, não à conta global. O identificador próprio permite endereçar uma associação sem expor `userId`, enquanto a chave composta mantém a unicidade e compatibilidade já usadas pela IMP-002.

**Alternatives considered**:

- Reutilizar `UserRole`/`isAdmin`: rejeitado porque confundiria administração global e contextual e violaria FR-002.
- Endereçar alterações por `userId`: rejeitado por expor identificador pessoal desnecessário.
- Substituir imediatamente a chave composta pelo novo `id`: rejeitado por ampliar risco e mudança de compatibilidade sem necessidade.

## R-002 — Invariante de proprietário único

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: manter `LaboratoryRoom.userId` como criador/proprietário canônico e imutável nesta feature; materializar o mesmo participante como `OWNER` no vínculo. Usar índice único parcial para no máximo um proprietário e constraint trigger `DEFERRABLE INITIALLY DEFERRED` para exigir, no commit, exatamente um `OWNER` correspondente ao criador.

**Rationale**: a regra cruza tabelas e precisa aceitar, dentro da mesma transação, a criação do laboratório seguida do vínculo. O índice cobre concorrência para “no máximo um”; o trigger diferível cobre “exatamente um” e correspondência. PostgreSQL documenta índices parciais como índices sobre apenas as linhas que satisfazem um predicado: <https://www.postgresql.org/docs/17/indexes-partial.html>.

**Alternatives considered**:

- Validar somente na aplicação: rejeitado porque scripts, concorrência e futuras rotas poderiam violar a invariante.
- Permitir atualização de `OWNER`: rejeitado porque transferência está fora do escopo.
- Fazer apenas `UNIQUE(laboratoryRoomId, role)`: rejeitado porque impediria múltiplos `MEMBER` e `ADMIN`.

## R-003 — Backfill e migration integrada

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: executar preflight antes do deploy e uma migration transacional integrada. O criador recebe `OWNER`, demais vínculos recebem `MEMBER`, ninguém recebe `ADMIN`; esse backfill de papel é determinístico. Criador sem vínculo só é inserido após validar o limite de cinco laboratórios acessíveis e demais invariantes. IDs opacos são gerados em lote e verificados como únicos durante a migration. A remoção de `Coordinates` ocorre apenas depois de conversão e validação completas.

**Rationale**: papéis e ponto são predecessores do mesmo fluxo vertical. Uma transição integrada evita uma aplicação nova operar sobre estado parcialmente migrado. A migration deve abortar antes de qualquer drop se encontrar coordenadas inválidas, referências compartilhadas/órfãs, criadores inconsistentes ou impacto não resolvido no limite da IMP-002.

**Baseline risk (`EVIDENCIA_IMPLEMENTACAO`)**: o histórico atualmente versionado expõe apenas `prisma/migrations/20260907120000_unique_laboratory_access_code/migration.sql`, e `.gitignore` exige allowlist explícita para migrations. Portanto a implementação deve reconciliar `_prisma_migrations` por ambiente, validar bootstrap em banco descartável e versionar deliberadamente a nova pasta; não pode inferir que o histórico local representa todo o caminho aplicado em produção.

**Alternatives considered**:

- Tornar todos os vínculos `MEMBER`, inclusive o criador: rejeitado por violar a propriedade única.
- Promover automaticamente membros antigos: rejeitado porque não há evidência de intenção.
- Corrigir dados silenciosamente: rejeitado; conflitos são bloqueios operacionais documentados.

**Recovery (`RECOMENDACAO_OPERACIONAL`)**: exigir backup/PITR imediatamente anterior, ensaiar a migration em cópia representativa e preferir restauração/forward fix em caso de falha posterior; não prometer downgrade automático após drop de tabela.

## R-004 — Representação e precisão do ponto

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: armazenar `latitude Decimal @db.Decimal(8,6)` e `longitude Decimal @db.Decimal(9,6)` diretamente em `CollectionArea`, com checks SQL `[-90,90]` e `[-180,180]`. A API recebe e devolve números JSON, convertendo `Prisma.Decimal` explicitamente. O valor é arredondado canonicamente a seis casas, com erro máximo de meia unidade na última casa (`0.0000005°`).

**Rationale**: a área tem exatamente um ponto nesta entrega; colunas diretas expressam cardinalidade e atomicidade melhor que uma tabela um-para-muitos. Decimal evita representação binária como estado persistido e seis casas superam a precisão necessária para um marcador de cadastro. A referência Prisma mapeia `Decimal(p,s)` para tipos numéricos exatos e `Float` para ponto flutuante: <https://www.prisma.io/docs/orm/reference/prisma-schema-reference>.

**Alternatives considered**:

- Manter `Coordinates` um-para-muitos: rejeitado porque permite cardinalidade não autorizada e estado órfão.
- Usar `Float`: rejeitado para o estado canônico por arredondamento binário.
- Introduzir PostGIS/geometrias: rejeitado por exceder o ponto simples da IMP-003 e antecipar a IMP-008.

## R-005 — Compatibilidade de campos legados de área

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: `municipality`, `state` e `landType` passam a opcionais. `landType` vira texto opcional com limite de 100 caracteres; nenhuma taxonomia legada é promovida a regra atual. `description` é o nome no modelo e no contrato, mapeado à coluna física `descriptionLandType` para evitar rename destrutivo. `cep`, `image` e `isActive` podem permanecer internos/legados, mas não são aceitos, retornados ou usados como comportamento nesta entrega; CEP torna-se anulável apenas para permitir o cadastro mínimo.

**Rationale**: a spec determina quais campos são opcionais e exclui imagem, CEP e comportamento de estado. Preservar colunas sem promovê-las reduz risco de dados e mantém o contrato fechado.

**Alternatives considered**:

- Expor o enum legado de terreno: rejeitado por não haver decisão atual sobre taxonomia.
- Excluir todos os campos legados: rejeitado por risco desnecessário de perda de dados.
- Preencher CEP fictício: rejeitado por fabricar informação.

## R-006 — Autorização contextual

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: centralizar `authorizeLaboratoryAccess(principal, laboratoryId, permission)` com permissões `READ_AREAS`, `CREATE_AREA`, `MANAGE_ROLES` e a fronteira futura `CREATE_COLLECTION`. A ordem é autenticação/conta ativa, existência conjunta de laboratório e vínculo, papel, estado ativo quando a permissão muta e consulta do recurso pelo par `{ id, laboratoryId }`.

**Rationale**: uma única decisão autoritativa por operação reduz divergência entre rotas e garante revogação imediata. Consultas compostas impedem que um ID isolado atravesse a fronteira de laboratório.

**Alternatives considered**:

- Confiar no papel enviado ou armazenado no navegador: rejeitado por ser estado adulterável/desatualizado.
- Guards específicos duplicados por rota: rejeitado pelo risco de matriz inconsistente.
- Retornar `403` para laboratório/área conhecida mas inacessível: rejeitado porque permite enumeração.

**Error policy**: `401` para ausência/invalidez de autenticação; `404` uniforme para laboratório, vínculo ou recurso inacessível; `403` para papel insuficiente dentro de contexto comprovadamente acessível; `409` para laboratório somente leitura ou conflito de compare-and-set.

## R-007 — Contratos de vínculo e concorrência

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: `GET /api/laboratories/{laboratoryId}/memberships` retorna somente `id`, `name`, `initials`, `role`. `PATCH /.../memberships/{membershipId}` aceita exatamente `{ expectedRole, role }`; ambos só podem ser `MEMBER` ou `ADMIN` e precisam representar a transição inversa.

**Rationale**: `expectedRole` viabiliza compare-and-set, retornando conflito quando outra ação já mudou o vínculo. Não aceitar `OWNER` torna impossível promover, substituir ou rebaixar o proprietário por esse contrato. A listagem é necessária para a gestão de papéis e não requer e-mail ou identificador da conta.

**Alternatives considered**:

- `PUT` com todo o vínculo: rejeitado por ampliar superfície de mass assignment.
- PATCH sem expectativa: rejeitado por perda silenciosa de atualização concorrente.
- Incluir e-mail/userId: rejeitado por minimização de dados.

## R-008 — Contratos de área e contexto explícito

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: usar rotas aninhadas sob `/api/laboratories/{laboratoryId}/areas` e páginas sob `/dashboard/laboratories/{laboratoryId}/areas`. O POST tem allowlist estrita; lista e detalhe incluem contexto mínimo e `readOnly`, mas não autoria. Todas as respostas privadas usam `Cache-Control: no-store`.

**Rationale**: o identificador na URL preserva o contexto após reload e torna a fronteira auditável. O servidor ainda deriva e valida o laboratório; a URL é referência, não autorização. Contratos separados preservam os DTOs fechados das IMP-001/002.

**Alternatives considered**:

- Contexto apenas em cookie/localStorage: rejeitado por seleção implícita e risco de ação no laboratório errado.
- Expandir `/api/auth/me`: rejeitado por FR-035.
- Retornar o autor da área: rejeitado por FR-034.

## R-009 — Biblioteca e renderização do mapa

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: planejar Leaflet 1.9.4 com React-Leaflet 5.0.0 e `@types/leaflet`. Isolar o mapa em Client Component carregado dinamicamente com `ssr: false`; importar CSS uma vez e usar `divIcon` próprio.

**Rationale**: React-Leaflet 5 declara peers compatíveis com React 19 e Leaflet 1.9, e sua instalação TypeScript requer os tipos do Leaflet: <https://react-leaflet.js.org/docs/start-installation/>. O Next.js documenta lazy loading de Client Components e restringe `ssr: false` a Client Components: <https://nextjs.org/docs/app/guides/lazy-loading>. APIs de navegador devem ficar no limite cliente: <https://nextjs.org/docs/app/getting-started/server-and-client-components>.

**Alternatives considered**:

- MapLibre GL: rejeitado nesta entrega pelo peso e complexidade extras para um único ponto, embora possa ser reavaliado na IMP-008.
- Canvas/mapa próprio: rejeitado por acessibilidade, interação e manutenção.
- Renderizar Leaflet no servidor: rejeitado porque depende de DOM.

## R-010 — Tiles e continuidade operacional

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: tornar URL e atribuição configuráveis. O servidor padrão do OpenStreetMap serve somente como fallback de desenvolvimento/manual de baixo volume. Produção tem gate de provedor aprovado/configurado. Nenhum teste usa tiles públicos, e entrada manual continua funcional quando mapa ou tiles falham.

**Rationale**: a política do OSM declara que os dados são livres, mas os servidores de tiles não, são best-effort e exigem atribuição visível, cache, referer e ausência de prefetch/offline: <https://operations.osmfoundation.org/policies/tiles/>.

**Alternatives considered**:

- Hardcode de `tile.openstreetmap.org` em produção: rejeitado por risco operacional e de política.
- Bloquear todo o formulário se o mapa falhar: rejeitado porque o caminho manual é requisito.
- Cache/offline próprio de tiles padrão: rejeitado pela política e pelo escopo.

## R-011 — Geolocalização e sincronização

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: chamar `navigator.geolocation.getCurrentPosition` somente após clique explícito, com timeout finito e `maximumAge: 0`. Cada solicitação recebe um token local; respostas tardias só atualizam a proposta se nenhuma edição posterior invalidou o token. Nada é persistido até submit.

**Rationale**: geolocalização requer contexto seguro e permissão explícita do usuário: <https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition>. O token impede que callback assíncrono sobrescreva coordenadas revisadas. Playwright permite conceder permissão e definir localização no contexto para E2E: <https://playwright.dev/docs/emulation>.

**Alternatives considered**:

- Solicitar localização ao carregar: rejeitado por FR-021 e pior experiência de permissão.
- `watchPosition`: rejeitado porque criaria atualizações intermediárias e risco de histórico.
- Salvar automaticamente a localização recebida: rejeitado porque elimina revisão e confirmação.

## R-012 — Estratégia de testes

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: manter a pilha existente (`node:test`/`tsx` e Playwright), injeção de fakes nos handlers e execução E2E serial com fixtures protegidas. Acrescentar verificações específicas de migration em banco descartável ou cópia sanitizada, sem usar infraestrutura pública de tiles.

**Rationale**: reaproveita padrões comprovados pelas IMP-001/002 e cobre separadamente contrato, serviço, autorização, banco, navegação e browser APIs. Tolerância numérica dos DTOs: `1e-6`.

**Alternatives considered**:

- Validar tudo por E2E: rejeitado por custo, diagnóstico ruim e cobertura insuficiente de concorrência/migration.
- Mockar autorização no E2E: rejeitado porque o isolamento contextual é risco central.
- Tornar SC-009/010 testes automatizados: rejeitado; continuam `NAO_VERIFICADO` até validação humana.

## R-012A — Fronteira de serviço e persistência

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: ampliar os serviços existentes para encapsular Prisma por interfaces pequenas e injetáveis junto a cada serviço; handlers permanecem finos. Não criar um repository genérico ou uma segunda infraestrutura de respostas/autenticação.

**Rationale**: é o menor desenho compatível com `requireAuth()`, handlers injetáveis e fakes já observados na IMP-001/002. Mantém consultas compostas e transações perto das invariantes sem introduzir abstração paralela.

**Alternatives considered**:

- Repository genérico para todas as entidades: rejeitado por complexidade sem benefício neste recorte.
- Prisma direto em cada handler: rejeitado por duplicar autorização, transação e dificultar testes unitários.

## R-013 — Compatibilidade e fronteira da IMP-004

**Decision (`DECISAO_DE_PLANEJAMENTO`)**: preservar os DTOs públicos e semântica da IMP-001/002; a criação de laboratório passa apenas a gravar `OWNER` explicitamente. Para a IMP-004, estabilizar `area.id`, a relação com `laboratoryId`, contexto na rota, autoria derivada e a permissão futura `CREATE_COLLECTION` para todos os três papéis em laboratório ativo.

**Rationale**: esses elementos são dependências materiais já autorizadas; implementar coleção, schema paralelo ou UI correspondente anteciparia escopo.

**Alternatives considered**:

- Criar agora tabelas/rotas de coleta: rejeitado por estar fora da IMP-003.
- Adiar toda a fronteira de permissão: rejeitado porque aumentaria risco de redesenho da autorização na entrega seguinte.

## Resolved Unknowns

Todos os pontos técnicos reservados ao planejamento pela spec foram resolvidos: papel e invariante, backfill, precisão, modelo espacial, compatibilidade legada, guard, contratos, rotas, biblioteca, tiles, geolocalização, testes e fronteira da IMP-004. Não restam marcadores `NEEDS CLARIFICATION`.
