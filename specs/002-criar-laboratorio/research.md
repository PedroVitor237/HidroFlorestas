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

- **Decision**: entrada de criação `{ name }`; DTO de laboratório por allowlist com `id`, `name`, `createdAt`, `status` e `isOwner`; refetch no-store após POST.
- **Rationale**: corresponde aos cards e às configurações aprovadas; o identificador opaco endereça o laboratório sem expor identidade de usuário, código de acesso ou relações internas.
- **Alternatives considered**: model Prisma, código, `userId` ou principal público ampliado — exposição; estado otimista definitivo — divergência.

## R5 — Integração stacked

- **Decision**: consumir a IMP-001 por `AuthenticatedPrincipal` no servidor e reconciliar `origin/development` por merge não fast-forward autorizado, sem rebase.
- **Rationale**: preserva o DTO público `{ firstName, lastName, image }`, mantém a revalidação de sessão/`ACTIVE` e conserva o histórico das duas features.
- **Alternatives considered**: copiar autenticação, ampliar `/api/auth/me`, rebase ou force push — incompatíveis com o contrato e o checkpoint.

## R6 — Configurações e isolamento

- **Decision**: detalhes exigem vínculo; desativação e exclusão primeiro filtram o laboratório pelo vínculo autenticado e só então verificam a propriedade.
- **Rationale**: membros recebem as informações aprovadas, enquanto pessoas sem vínculo não conseguem enumerar a existência de laboratórios comparando `403` e `404`.
- **Alternatives considered**: buscar somente por ID e retornar `FORBIDDEN` a qualquer não proprietário — revela existência; confiar na ocultação do botão — não protege a API.
