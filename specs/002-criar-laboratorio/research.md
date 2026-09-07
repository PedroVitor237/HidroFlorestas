# Research: Criação mínima de laboratório

## R1 — Autenticação

- **Decision**: reutilizar `requireAuth()` em cada handler e somente `principal.id`.
- **Rationale**: a base já valida token, identidade atual e `ACTIVE`.
- **Alternatives considered**: contexto React, cookie, JWT direto ou `userId` cliente — sem autoridade.

## R2 — Modelo e migration

- **Decision**: preservar modelos e adicionar somente `@unique` a `LaboratoryRoom.accessCode`.
- **Rationale**: unicidade confirmada não está garantida; os demais campos suportam o recorte.
- **Alternatives considered**: checagem sem constraint — corrida; remodelar papéis — fora do escopo.

## R3 — Atomicidade e limite

- **Decision**: transação serializável com retry limitado para contar, criar laboratório e vínculo.
- **Rationale**: mantém limite total cinco e impede estado parcial.
- **Alternatives considered**: operações separadas ou transação sem isolamento — inseguras; idempotency key — escopo extra.

## R4 — Contrato e workspace

- **Decision**: entrada `{ name }`; DTO só `name`, `createdAt`, `status`; refetch no-store após POST.
- **Rationale**: corresponde aos cards aprovados, não expõe código/IDs e comprova persistência.
- **Alternatives considered**: model Prisma, código ou `userId` — exposição; estado otimista definitivo — divergência.

## R5 — Integração stacked

- **Decision**: consumir a IMP-001 sem editá-la e reconciliar somente após autorização.
- **Rationale**: preserva propriedade e reduz colisões.
- **Alternatives considered**: copiar auth, merge ou rebase agora — proibidos/desnecessários.

