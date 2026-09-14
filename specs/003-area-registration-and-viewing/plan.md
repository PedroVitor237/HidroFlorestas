# Implementation Plan: Cadastro e consulta espacial de área

**Branch**: `003-area-registration-and-viewing` | **Date**: 2026-09-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-area-registration-and-viewing/spec.md`

## Summary

Entregar o primeiro fluxo territorial persistente do produto: a pessoa escolhe explicitamente um laboratório acessível, navega em um contexto identificado pelo `laboratoryId`, e consulta áreas; `OWNER` e `ADMIN` podem cadastrar uma área-ponto em laboratório ativo, enquanto `MEMBER` e participantes de laboratório inativo permanecem em consulta. A solução adiciona papéis contextuais ao vínculo, um guard central por laboratório, rotas aninhadas, coordenadas decimais diretamente na área, contratos públicos fechados e um mapa React-Leaflet carregado somente no cliente, sempre com entrada manual funcional.

## Technical Context

**Language/Version**: TypeScript 5, Node.js 20.19.2 no baseline local

**Primary Dependencies**: Next.js 16.1.6 (App Router), React 19.2.4, Prisma ORM 7.x, PostgreSQL/Neon; adição planejada de Leaflet 1.9.4, React-Leaflet 5.0.0 e `@types/leaflet`

**Storage**: PostgreSQL via Prisma; `Decimal(8,6)` para latitude e `Decimal(9,6)` para longitude

**Testing**: `node:test` com `tsx` para unidade/integração e Playwright para E2E

**Target Platform**: aplicação web responsiva em navegadores modernos; servidor Next.js em Linux/Vercel e PostgreSQL Neon

**Project Type**: aplicação web full-stack monolítica

**Performance Goals**: listagem e detalhe sem dependência de geocodificação; mapa carregado sob demanda; nenhuma chamada a tiles públicos nos testes; respostas privadas sem cache compartilhado

**Constraints**: autorização revalidada no servidor; isolamento por laboratório; laboratório inativo somente leitura; nenhuma seleção automática; ponto único; geolocalização opcional; entrada manual independente do mapa; sem exposição de autoria; sem ampliar `/api/auth/me`

**Scale/Scope**: quatro histórias, três papéis contextuais, três operações de área, duas operações de vínculo, três páginas de área e uma página de membros; sem coleta, edição/exclusão de área ou mapa agregado

## Constitution Check

*GATE: aprovado antes da pesquisa e revalidado após o design da Fase 1.*

| Princípio | Verificação antes da Fase 0 | Verificação após a Fase 1 |
|---|---|---|
| I. Hierarquia de fontes | PASS — decisões da spec governam o recorte; PRD Code-First e baseline implementado foram usados sem promover propostas antigas. | PASS — escolhas técnicas estão classificadas em `research.md`; nenhuma intenção de produto foi inferida do schema legado. |
| II. Entregas verticais | PASS — seleção de contexto, autorização, cadastro e consulta formam um fluxo verificável. | PASS — mapa agregado, coletas, edição e exclusão continuam fora do escopo. |
| III. Especificação por funcionalidade | PASS — planejamento limitado a `specs/003-area-registration-and-viewing/**`. | PASS — todos os artefatos estão no diretório da feature; `tasks.md` não é criado nesta etapa. |
| IV. Evidência e rastreabilidade | PASS — spec registra decisões, evidências e IDs Code-First. | PASS — plano, pesquisa, modelo e contratos preservam a distinção entre decisão, baseline e recomendação. |
| V. Qualidade e segurança proporcionais | PASS — riscos centrais são autorização, enumeração, migração espacial e privacidade. | PASS — contratos fechados, guard central, transações, checks de banco e matriz de testes cobrem os riscos. |
| VI. Documentação evolutiva | PASS — nenhuma alteração em `docs/raw/**` ou documentação histórica. | PASS — a entrega de planejamento não requer alterar registros canônicos fora do caminho autorizado. |
| VII. Trabalho em equipe | PASS — branch própria, baseline sincronizado com `origin/development`; schema e código não serão editados nesta etapa. | PASS — o plano explicita integração única de schema/migration e preservação dos contratos IMP-001/002. |

Não há violação constitucional a justificar.

## Project Structure

### Documentation (this feature)

```text
specs/003-area-registration-and-viewing/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── area-registration-api.openapi.yaml
├── checklists/
│   └── requirements.md
└── tasks.md                 # criado somente por $speckit-tasks
```

### Source Code (repository root)

```text
prisma/
├── schema.prisma
└── migrations/
    └── <timestamp>_area_registration_and_membership_roles/

src/
├── app/
│   ├── (private)/
│   │   ├── dashboard/
│   │   │   └── laboratories/[laboratoryId]/
│   │   │       ├── areas/
│   │   │       │   ├── page.tsx
│   │   │       │   ├── new/page.tsx
│   │   │       │   └── [areaId]/page.tsx
│   │   │       └── members/page.tsx
│   │   └── workspace/
│   │       └── page.tsx
│   └── api/
│       ├── laboratories/[laboratoryId]/
│       │   ├── areas/route.ts
│       │   ├── areas/[areaId]/route.ts
│       │   ├── memberships/route.ts
│       │   └── memberships/[membershipId]/route.ts
│       └── server/
│           ├── areas/
│           │   ├── area.contracts.ts
│           │   └── area.authorization.ts
│           ├── laboratories/
│           │   └── laboratory.contracts.ts
│           └── services/
│               ├── areas.service.ts
│               └── laboratories.service.ts
├── components/
│   └── areas/
│       ├── area-form.tsx
│       ├── area-map.client.tsx
│       └── area-map.tsx
└── types/
    ├── area.type.ts
    └── laboratory.type.ts

tests/
├── unit/
│   ├── area-contracts.test.ts
│   ├── area-authorization.test.ts
│   └── areas-service.test.ts
├── integration/
│   ├── areas-route.test.ts
│   └── laboratory-memberships-route.test.ts
└── e2e/
    └── area-registration-and-viewing.spec.ts
```

**Structure Decision**: manter o monólito Next.js existente. As páginas e APIs carregam o `laboratoryId` na rota; contratos, autorização e serviços ficam no núcleo servidor já existente. O mapa é isolado como Client Component importado dinamicamente, enquanto autorização e persistência permanecem no servidor.

## Design and Delivery Strategy

### 1. Migration and compatibility

Uma única migration integra papéis contextuais e coordenadas para evitar estados intermediários incompatíveis. Antes de qualquer alteração destrutiva, ela valida drift, criadores sem vínculo, impacto no limite de cinco laboratórios, strings de coordenadas inválidas, coordenadas compartilhadas e órfãs. O backfill atribui `OWNER` ao `LaboratoryRoom.userId`, `MEMBER` aos demais e nunca cria `ADMIN`; vínculos ausentes do criador são inseridos somente se o limite e as invariantes permitirem.

O histórico versionado atual contém apenas a migration allowlisted da IMP-002, enquanto a política de ignore não admite automaticamente novos diretórios. A implementação deve primeiro reconciliar o histórico realmente aplicado em cada ambiente, provar que uma base descartável pode atingir o baseline esperado e incluir de modo explícito a nova migration no versionamento; não deve assumir que o repositório atual reconstrói uma base vazia sem essa verificação.

O vínculo recebe `id` opaco e único e `role` com default `MEMBER`, preservando a chave composta atual. Um índice único parcial limita um `OWNER` por laboratório, e um constraint trigger diferível valida no commit que exista exatamente um e que corresponda a `LaboratoryRoom.userId`. Criação de laboratório e transições de papel continuam transacionais.

As coordenadas válidas são convertidas para seis casas decimais, copiadas à área e verificadas antes de tornar as colunas obrigatórias. A tabela `Coordinates` só é removida após validação do backfill na mesma migration. `municipality`, `state` e `landType` tornam-se opcionais; `landType` vira texto sem taxonomia presumida. O campo Prisma `description` reutiliza a coluna física `descriptionLandType` via `@map`. Campos legados `cep`, `image` e `isActive` não entram no contrato nem ganham comportamento nesta entrega.

### 2. Authorization and laboratory context

`authorizeLaboratoryAccess` aplica, nesta ordem: principal autenticado `ACTIVE`; laboratório e vínculo atuais; permissão do papel; estado do laboratório; e recurso consultado pelo par `{ id, laboratoryId }`. O resultado interno contém laboratório, vínculo, papel e `readOnly`, mas nunca é aceito do cliente.

As permissões nomeadas são `READ_AREAS`, `CREATE_AREA`, `MANAGE_ROLES` e a fronteira futura `CREATE_COLLECTION`. Recursos inexistentes e inacessíveis retornam o mesmo `404`; falta de autenticação retorna `401`; papel insuficiente retorna `403`; laboratório inativo ou conflito de concorrência retorna `409`. Respostas autenticadas de contexto, membros e áreas usam `Cache-Control: no-store`.

A seleção ocorre em `/workspace`; nenhum laboratório é escolhido automaticamente. A escolha navega para `/dashboard/laboratories/{laboratoryId}/areas`, de modo que reload, links e detalhe preservem contexto sem depender de storage local. Entradas antigas de dashboard orientam ou redirecionam para a seleção quando não carregam um identificador explícito.

### 3. Contracts and services

Os parsers rejeitam chaves desconhecidas e normalizam texto sem truncar. O POST de área aceita somente `name`, `latitude`, `longitude`, `municipality`, `state`, `landType` e `description`; laboratório, autoria, data e identificadores são derivados no servidor. Latitude e longitude são números JSON finitos, validados em seus intervalos e persistidos canonicamente com seis casas; DTOs convertem `Prisma.Decimal` explicitamente para número.

O serviço de criação executa autorização e inserção de uma única área em transação. Listagem ordena por `createdAt` e `id`, sempre filtra por `laboratoryId`, e detalhe consulta pelo par área/laboratório. Os DTOs não incluem criador, `userId`, e-mail, código de acesso, CEP, imagem ou estado funcional legado.

Os serviços existentes continuam como fronteira de domínio e encapsulam as consultas Prisma por dependências injetáveis, seguindo os handlers testáveis da IMP-001/002. Não será introduzida uma segunda camada genérica de repository: os pequenos ports de persistência necessários aos fakes permanecem definidos junto ao serviço que os consome.

A consulta de vínculos retorna somente `{ id, name, initials, role }`. A alteração de papel aceita exatamente `{ expectedRole, role }`, com transições `MEMBER ↔ ADMIN`; o compare-and-set evita sobrescrever mudança concorrente. Apenas o proprietário atual pode executar a operação, e nenhum contrato aceita ou produz `OWNER` como papel alterável.

A página mínima `/members` é acessível ao `OWNER`, lista nome, iniciais e papel e oferece um único controle contextual de promover/rebaixar para vínculos não proprietários. Ela distingue carregamento, vazio, erro, sucesso e conflito concorrente; em laboratório inativo mostra a lista em somente leitura. `ADMIN` e `MEMBER` não recebem controle nem acesso ao endpoint de gestão.

### 4. Map and geolocation

React-Leaflet 5 com Leaflet 1.9 é a solução de mapa. O componente é carregado com `dynamic(..., { ssr: false })` a partir de um Client Component; o CSS do Leaflet entra uma única vez e um `divIcon` próprio evita dependência dos caminhos de assets de marcadores padrão.

Os campos numéricos são a fonte canônica do ponto. Clique no mapa e geolocalização apenas propõem novos valores e sincronizam o marcador; somente o submit confirmado persiste. `getCurrentPosition` é chamado após ação explícita, com timeout finito e `maximumAge: 0`; erro, timeout ou resposta tardia não apagam nem sobrescrevem silenciosamente uma correção posterior.

O formulário mantém uma única submissão em voo: após a confirmação, desabilita novas confirmações até sucesso ou erro e ignora eventos repetidos da mesma ação. Isso cobre o duplo clique sem introduzir edição, deduplicação por conteúdo ou identidade artificial entre cadastros distintos que podem legitimamente ter o mesmo nome e ponto.

URL e atribuição de tiles são configuráveis. O servidor padrão do OpenStreetMap é permitido apenas como fallback de desenvolvimento/manual de baixo volume, respeitando atribuição, cache, referer e proibição de prefetch/offline. Produção exige provedor aprovado e configurado como gate operacional. Testes interceptam tiles e geolocalização, sem tráfego à infraestrutura pública; se mapa ou tiles falharem, o cadastro manual continua completo.

### 5. Verification strategy

- Unidade: parsers fechados, normalização, limites, não finitos, serialização decimal, matriz de permissões, transições e compare-and-set.
- Integração: autenticação, vínculo revogado, laboratório inativo, isolamento cruzado, `404` uniforme, `no-store`, autoria derivada, atomicidade e ausência de campos privados.
- Migration: preflight em cópia representativa, backfill determinístico, proprietário único, ranges, precisão, rollback por snapshot/PITR e falha antes do drop quando houver dado inválido.
- E2E: escolha explícita, reload e navegação contextual; criação por mapa, manual e geolocalização; negação/timeout; papéis; somente leitura; responsividade e teclado.
- Validação humana posterior: SC-009 e SC-010 permanecem `NAO_VERIFICADO` até sessões representativas.

## Implementation Phases

1. Preparar e validar a migration integrada, incluindo plano de backup/PITR e ensaio em cópia representativa.
2. Introduzir enum, papel/id do vínculo e invariantes de proprietário; adaptar criação de laboratório sem mudar os DTOs da IMP-002.
3. Implementar guard contextual e contratos/serviços de membros; cobrir a matriz de autorização.
4. Persistir o ponto diretamente na área e implementar contratos/serviços/rotas de área.
5. Construir seleção e navegação explícitas, listagem, cadastro, detalhe e modo somente leitura.
6. Integrar mapa e geolocalização com fallback manual e configuração operacional de tiles.
7. Completar testes unitários, de integração, migration e E2E; validar regressão de IMP-001/002 e documentar evidências.

## Risks and Mitigations

| Risco | Mitigação planejada |
|---|---|
| Dados legados impedirem proprietário único ou conversão de coordenadas | Preflight bloqueante, relatório sem dados pessoais, backup/PITR e ensaio antes do deploy. |
| Concorrência criar dois proprietários ou perder atualização de papel | Índice parcial, trigger diferível, transação e `expectedRole`. |
| Identificador revelar recurso de outro laboratório | Guard uniforme e consultas sempre compostas por recurso e laboratório. |
| Estado local preservar autorização revogada | Revalidação em toda operação e respostas `no-store`. |
| SSR ou assets quebrarem o mapa | Import dinâmico client-only, CSS único e marcador próprio. |
| Dependência indevida dos tiles OSM | Configuração explícita, gate de produção, política respeitada e fallback manual. |
| Arredondamento alterar ponto legado além do tolerável | Conversão explícita a seis casas, tolerância máxima de `0.0000005°` e validação antes do drop. |
| Mudança do vínculo quebrar IMP-002 | Preservar chave composta, DTOs e limite existentes; adicionar o papel sem alterar semântica pública. |

## Future Contract for IMP-004

A IMP-004 poderá consumir `area.id`, sua relação imutável com `laboratoryId`, as rotas contextualizadas e o mesmo guard com `CREATE_COLLECTION`. Os três papéis podem registrar coleta futuramente apenas em laboratório ativo; autoria continuará derivada do principal. Nenhuma coleta, schema paralelo ou alteração de área é implementada nesta feature.

## Complexity Tracking

Não aplicável: o design não viola os gates constitucionais.
