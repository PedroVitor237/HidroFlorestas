# Data Model: Cadastro e consulta espacial de área

**Feature**: IMP-003  
**Date**: 2026-09-14

Este é o modelo-alvo do planejamento. Ele não é uma migration executada. Nomes físicos legados são preservados quando indicado para reduzir risco de dados.

## Relationship Overview

```text
User 1 ── * ResearchersLinked * ── 1 LaboratoryRoom
  │                                           │
  └──────────────── 1 ── * CollectionArea ───┘

LaboratoryRoom.userId = único ResearchersLinked.userId com role OWNER
CollectionArea = exatamente um ponto (latitude, longitude)
```

## Enum: LaboratoryMembershipRole

| Value | Meaning in IMP-003 |
|---|---|
| `OWNER` | Criador e proprietário único; lê, cria área em laboratório ativo e gerencia `MEMBER ↔ ADMIN`. |
| `ADMIN` | Lê e cria área em laboratório ativo; não gerencia papéis. |
| `MEMBER` | Lê; não cria área nem gerencia papéis. |

Este enum é independente de `UserRole` e `User.isAdmin`.

## Entity: LaboratoryRoom

Campos relevantes existentes:

| Field | Type | Rules |
|---|---|---|
| `id` | UUID string | Identificador opaco. |
| `name` | String | Preserva contrato da IMP-002. |
| `userId` | UUID string | Criador e proprietário canônico; imutável nesta feature. |
| `isActive` | Boolean | `false` permite leitura e impede mutações de domínio. |
| `createdAt` | DateTime | Gerado pelo servidor. |
| `updatedAt` | DateTime | Atualizado pelo servidor. |
| `accessCode` | String | Preservado; nunca exposto pelos contratos desta feature. |

### Invariants

- Existe exatamente um vínculo `OWNER` por laboratório.
- O `userId` desse vínculo é igual a `LaboratoryRoom.userId`.
- `LaboratoryRoom.userId` não pode ser alterado pela IMP-003.
- Criação de laboratório e vínculo `OWNER` é atômica.
- `isActive = false` não remove vínculos ou áreas e não impede consultas autorizadas.

## Entity: ResearchersLinked

Modelo lógico-alvo:

```prisma
model ResearchersLinked {
  id               String                   @unique @default(uuid())
  userId           String
  laboratoryRoomId String
  role             LaboratoryMembershipRole @default(MEMBER)

  user           User           @relation(fields: [userId], references: [id])
  laboratoryRoom LaboratoryRoom @relation(fields: [laboratoryRoomId], references: [id])

  @@id([userId, laboratoryRoomId])
  @@index([laboratoryRoomId, role])
}
```

| Field | Type | Required | Source / validation |
|---|---|---:|---|
| `id` | UUID string | yes | Banco; opaco e único, usado no contrato de gestão. |
| `userId` | UUID string | yes | Relação existente; nunca exposto nesta feature. |
| `laboratoryRoomId` | UUID string | yes | Relação existente; derivado do contexto da rota. |
| `role` | Enum | yes | `OWNER`, `ADMIN` ou `MEMBER`; default seguro `MEMBER`. |

### Database invariants beyond Prisma

- Chave composta existente impede dois vínculos da mesma conta com o mesmo laboratório.
- Índice único parcial em `laboratoryRoomId WHERE role = 'OWNER'` impede mais de um proprietário.
- Constraint trigger diferível exige ao final da transação um `OWNER` e correspondência com `LaboratoryRoom.userId`.
- Alteração pública nunca aceita `OWNER`; somente `MEMBER → ADMIN` e `ADMIN → MEMBER`.
- Atualização usa condição simultânea `id`, `laboratoryRoomId` e `expectedRole`; zero linhas alteradas é conflito.

### Migration/backfill

1. Adicionar `id` e `role` inicialmente de forma compatível com dados existentes.
2. Gerar os IDs opacos dos vínculos existentes e verificar unicidade.
3. Confirmar que todo criador possui vínculo; inserir ausências apenas após preflight de limite/integridade.
4. Atribuir `OWNER` quando `ResearchersLinked.userId = LaboratoryRoom.userId`; demais recebem `MEMBER`.
5. Confirmar exatamente um proprietário por laboratório e nenhum `ADMIN` criado pelo backfill.
6. Tornar campos obrigatórios, criar índice parcial e trigger diferível.

## Entity: CollectionArea

Modelo lógico-alvo para os campos desta feature:

```prisma
model CollectionArea {
  id               String   @id @default(uuid())
  name             String
  latitude         Decimal  @db.Decimal(8, 6)
  longitude        Decimal  @db.Decimal(9, 6)
  municipality     String?
  state            String?
  landType         String?
  description      String?  @map("descriptionLandType")
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  userId           String
  laboratoryRoomId String

  // Campos legados não contratuais podem permanecer durante esta entrega:
  image    String?
  cep      String?
  isActive Boolean @default(true)

  user           User           @relation(fields: [userId], references: [id])
  laboratoryRoom LaboratoryRoom @relation(fields: [laboratoryRoomId], references: [id])

  collectionData CollectionData[]

  @@index([laboratoryRoomId, createdAt])
}
```

| Field | Type | Required | Validation / source |
|---|---|---:|---|
| `id` | UUID string | yes | Banco; identificador estável e opaco. |
| `name` | String | yes | Normalizado; 1–100 caracteres; sem truncamento. |
| `latitude` | Decimal(8,6) | yes | Número JSON finito em `[-90, 90]`; seis casas canônicas. |
| `longitude` | Decimal(9,6) | yes | Número JSON finito em `[-180, 180]`; seis casas canônicas. |
| `municipality` | String | no | Se presente após normalização, 1–100 caracteres. |
| `state` | String | no | Se presente após normalização, 1–100 caracteres; não pressupõe enum territorial. |
| `landType` | String | no | Se presente após normalização, 1–100 caracteres; taxonomia livre nesta entrega. |
| `description` | String | no | Se presente após normalização, 1–2000 caracteres; coluna física existente é reutilizada. |
| `createdAt` | DateTime | yes | Gerado pelo servidor. |
| `updatedAt` | DateTime | yes | Gerado pelo servidor; não cria edição pública. |
| `userId` | UUID string | yes | Derivado exclusivamente do principal autenticado; interno. |
| `laboratoryRoomId` | UUID string | yes | Derivado do contexto autorizado; interno no create. |

### Coordinate invariants

- Checks de banco repetem os ranges de latitude e longitude.
- A API nunca aceita strings, `NaN`, `Infinity` ou `-Infinity` como coordenadas.
- A serialização converte decimal para número explicitamente; testes comparam com tolerância de `1e-6`.
- O marcador de detalhe usa somente os valores persistidos.
- Não há `coordinatesId` nem relação com `Coordinates` no modelo final desta feature.

### Legacy coordinate migration

1. Preflight identifica strings não numéricas/não finitas, ranges inválidos, referências ausentes, órfãs ou compartilhadas.
2. Adicionar `latitude` e `longitude` temporariamente anuláveis em `CollectionArea`.
3. Converter cada par com arredondamento explícito a seis casas; diferença máxima admitida: `0.0000005°`.
4. Validar contagem, ausência de nulos, ranges e correspondência com todas as áreas.
5. Aplicar checks e `NOT NULL` e criar índice de listagem.
6. Remover `coordinatesId`, relação e tabela `Coordinates` somente depois de todas as verificações, na mesma migration.

Se qualquer verificação falhar, a migration aborta antes da remoção. Nenhum valor inválido recebe correção heurística.

## Derived Domain View: LaboratoryAccessContext

Não é persistida. É produzida pelo guard após revalidação:

| Field | Type | Meaning |
|---|---|---|
| `laboratory.id` | string | Laboratório autorizado. |
| `laboratory.name` | string | Nome público mínimo. |
| `laboratory.status` | `ACTIVE \| INACTIVE` | Projeção pública de `isActive`. |
| `membership.id` | string | Vínculo atual. |
| `membership.role` | role enum | Papel reconsultado no banco. |
| `readOnly` | boolean | `true` quando o laboratório está inativo; restrições adicionais do papel são derivadas de `membershipRole`. |

O objeto interno pode carregar IDs necessários a consultas, mas os DTOs públicos seguem as allowlists do contrato.

## Permission State Machine

| Current state | Action | Result |
|---|---|---|
| `MEMBER`, active laboratory, actor is `OWNER` | promote | `ADMIN` |
| `ADMIN`, active laboratory, actor is `OWNER` | demote | `MEMBER` |
| `OWNER` | any public role mutation | rejected |
| Any role, inactive laboratory | role mutation | rejected as read-only |
| `OWNER` or `ADMIN`, active laboratory | create area | one persisted area |
| `MEMBER`, any laboratory state | create area | forbidden |
| Any current member, active/inactive laboratory | list/detail area | allowed |
| Revoked/missing membership | any operation | inaccessible (`404` after authentication) |

## Public DTO Projections

### Membership

```ts
type LaboratoryMembershipDto = {
  id: string;
  name: string;
  initials: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
};
```

### Area summary

```ts
type AreaSummaryDto = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  municipality: string | null;
  state: string | null;
};
```

### Area detail

```ts
type AreaDetailDto = AreaSummaryDto & {
  landType: string | null;
  description: string | null;
  createdAt: string;
  laboratory: {
    id: string;
    name: string;
    status: "ACTIVE" | "INACTIVE";
  };
  readOnly: boolean;
};
```

Optional values are always represented as `null`, never omitted. No DTO contains area creator, `userId`, email, access code, CEP, image, coordinate-record ID or `isActive`.

## Query and Ordering Rules

- List areas with `where: { laboratoryRoomId }`, ordered by `createdAt DESC, id DESC`.
- Read detail with a compound predicate `{ id: areaId, laboratoryRoomId }` after contextual authorization.
- Read/update membership with `{ id: membershipId, laboratoryRoomId }`; never by opaque ID alone.
- Do not filter area reads by legacy `CollectionArea.isActive` in IMP-003.
- Normalize the laboratory status at the contract boundary rather than exposing `isActive` directly.

## Deletion and Retention

IMP-003 introduces no deletion. Revoking a membership elsewhere removes access but retains areas and internal authorship. Existing IMP-002 administrative laboratory deletion semantics remain unchanged and must be covered by regression tests after the schema change.
