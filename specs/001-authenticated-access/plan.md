# Implementation Plan: Acesso autenticado seguro

**Branch**: `001-authenticated-access` | **Date**: 2026-09-07 | **Spec**: [spec.md](spec.md)

**Input**: especificação funcional validada em `specs/001-authenticated-access/spec.md`

**Estado**: implementação e validações técnicas concluídas em 2026-09-13; `$speckit-converge`
aprovado sem trabalho restante no recorte; SC-006 e SC-007 permanecem `NAO_VERIFICADO`

## Summary

Entregar login, restauração e logout para conta previamente cadastrada, concedendo acesso a
`/workspace/**` e `/dashboard/**` somente quando uma validação server-side confirmar JWT válido,
usuário existente e estado atual `ACTIVE`. O desenho preserva Next.js App Router, Prisma,
PostgreSQL/Neon, bcrypt, `jsonwebtoken` e cookie HTTP-only já conectados; introduz validação
runtime por allowlist, configuração única e obrigatória da sessão e DTO público explícito.

O proxy será apenas proteção otimista de navegação. A fronteira autoritativa ficará próxima aos
dados: layout server-side antes da renderização privada e validação própria em cada handler,
Server Action ou operação protegida. Não haverá cadastro, alteração de schema, migration,
administração ou autorização detalhada.

## Technical Context

**Language/Version**: TypeScript 5.9.3 em Node.js 20.19.2; React 19.2.4
**Primary Dependencies**: Next.js 16.1.6 App Router, Prisma Client 7.4.2, adapter Neon 7.7.0,
PostgreSQL/Neon, bcrypt 6.0.0, jsonwebtoken 9.0.3, Sonner 2.0.7
**Storage**: model `User` existente em PostgreSQL via Prisma; sessão JWT stateless em cookie, sem
entidade persistida nova
**Testing**: `node:test` + `tsx` 4.21.0 existentes para unitários/integração; `@playwright/test`
aprovado como única nova devDependency para E2E Chromium serial
**Target Platform**: aplicação web Next.js; servidor Node compatível com Next.js/Prisma e
navegadores suportados pelo baseline; Proxy em runtime Node.js fixo do Next.js 16
**Project Type**: aplicação web full-stack única com App Router e Route Handlers
**Performance Goals**: nenhuma meta nova de throughput; evitar consulta a banco no Proxy e manter
a jornada de login dentro do alvo de usabilidade de dois minutos de SC-006
**Constraints**: somente `ACTIVE`; nenhuma exposição de senha/hash/campos privilegiados; segredo
obrigatório; proteção fail-closed; sem schema, migration, cadastro, rate limiting ou auditoria
geral; não confiar em cookie, contexto React ou UI como autoridade
**Scale/Scope**: três jornadas, três endpoints de autenticação, duas árvores privadas e um usuário
por sessão; quatro estados de conta e seis condições principais de sessão

## Constitution Check

### Gate pré-design

| Princípio | Resultado | Evidência no plano |
|---|---|---|
| I. Hierarquia de fontes | PASS | `CF-ID-001`/`CF-DEL-001` governam produto; `CF-TECH-001`, aprovado em 2026-09-07, governa o pacote técnico somente desta feature; código e schema continuam apenas baseline. |
| II. Entrega vertical | PASS | Recorte demonstrável de login, restauração, proteção e logout; infraestrutura nova limitada a sessão e testes imediatos. |
| III. Especificação por funcionalidade | PASS | Todos os artefatos executáveis permanecem em `specs/001-authenticated-access/**`; `tasks.md` foi gerado nesse diretório e não há `TASKS.md` global ou OpenSpec. |
| IV. Evidência e rastreabilidade | PASS | Componentes e validações mapeiam FR-001–FR-014 e SC-001–SC-007; intenção e falhas observadas estão separadas. |
| V. Qualidade e segurança proporcionais | PASS | DTO allowlisted, segredo obrigatório, estado atual, limites server-side e matriz de testes cobrem riscos concretos de autenticação. |
| VI. Documentação evolutiva | PASS | Somente artefatos da feature são escritos; `docs/raw/**` e documentação global permanecem intactos. |
| VII. Trabalho em equipe | PASS | Branch/spec próprias, arquivos compartilhados identificados e propriedade temporária definida abaixo. |

Não há violação constitucional nem decisão material pendente: a equipe do HidroFlorestas aprovou
em 2026-09-07 o pacote técnico registrado como `CF-TECH-001`, exclusivamente para esta feature. O
checklist da spec tem 16/16 itens aprovados e não há marcador de esclarecimento pendente.

### Rechecagem pós-design

**PASS** — pesquisa, modelo, contrato OpenAPI, quickstart e tarefas preservam o mesmo recorte;
nenhuma entidade persistida, dependência de produção ou funcionalidade excluída foi adicionada.
`@playwright/test` foi instalado e permanece isolado à validação. A
pendência de upgrade global do Next.js continua como risco externo, não incorporado à feature.

## Project Structure

### Documentation (this feature)

```text
specs/001-authenticated-access/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── tasks.md
├── checklists/
│   └── requirements.md
└── contracts/
    └── auth-api.openapi.yaml
```

`tasks.md` foi gerado pelo fluxo do Spec Kit e reconciliado após a aprovação técnica de 2026-09-07
e a decisão de fechamento de 2026-09-13. A implementação e os gates técnicos foram concluídos.

### Source Code (repository root)

```text
src/
├── app/
│   ├── (private)/
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   └── workspace/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── sign-in/route.ts
│   │   │   ├── me/route.ts
│   │   │   └── logout/route.ts
│   │   └── server/
│   │       ├── auth/
│   │       │   ├── auth.contracts.ts
│   │       │   ├── auth.core.ts
│   │       │   └── session.ts
│   │       ├── middlewares/auth.middleware.ts
│   │       └── services/
│   │           ├── auth.service.ts
│   │           └── users.service.ts
│   ├── login/page.tsx
│   └── logout/page.tsx
├── contexts/auth.context.tsx
├── types/auth.type.ts                            # contrato público sem imports server
└── proxy.ts

tests/
├── fixtures/auth-users.ts
├── unit/
├── integration/
└── e2e/

playwright.config.ts
package.json
package-lock.json
```

**Structure Decision**: preservar o projeto único. Contratos/validação/DTO e política de sessão
ficam em módulo server-side coeso sob a organização existente de `src/app/api/server/`; handlers
continuam em `src/app/api/auth/`, o layout privado protege páginas e o proxy permanece na
convenção `src/proxy.ts` exigida pelo Next.js quando existe `src/app`.

## Estado da implementação e componentes afetados

| Componente | Estado observado | Mudança planejada | Rastreabilidade |
|---|---|---|---|
| `src/app/login/page.tsx` | Valida vazio apenas no cliente e sem feedback; chama o contexto. | Manter validação de conveniência e apresentar falhas controladas; servidor continua soberano. | FR-001, FR-004, SC-006, SC-007 |
| `src/contexts/auth.context.tsx` | Usa tipo de banco, restaura depois do render, chama logout recursivamente em `401` e pode navegar após falha. | Usar DTO/estado público, separar limpeza local, tratar retorno de login/logout e usar `replace` + `refresh`. | FR-005, FR-006, FR-008, FR-010, FR-011 |
| `auth.service.ts` | bcrypt conectado; `PENDING` passa; retorno contém registro completo; JWT/configuração misturados. | Adaptar o serviço ao núcleo injetável, exigir igualdade `ACTIVE`, retornar resultado discriminado e DTO e delegar sessão ao módulo único. | FR-002–FR-004, FR-012, FR-013 |
| `users.service.ts` | Consultas retornam todas as colunas. | Adicionar consultas com `select` explícito para credenciais e identidade atual, incluindo `status` para validar e `isAdmin` para formar o principal interno. | FR-009, FR-012 |
| `auth/session.ts` proposto | Inexistente; emissão/verificação duplicadas. | Exigir `JWT_SECRET`, fixar HS256, validar payload, centralizar TTL e cookie. | FR-006–FR-013 |
| `auth/auth.core.ts` proposto | Inexistente; lógica depende hoje de serviços e APIs globais. | Concentrar casos de uso puros com dependências explícitas/injetáveis e produzir `AuthenticatedPrincipal` interno após elegibilidade. | FR-002–FR-009, FR-012, FR-013 |
| `auth/auth.contracts.ts` e `src/types/auth.type.ts` propostos | Tipo de persistência é usado como contrato cliente. | Separar tipo público compartilhável; validar sintaxe mínima do email; manter parser de envelope cliente e serializer campo a campo no servidor. | FR-004, FR-012, FR-013 |
| `sign-in/route.ts` | Confia em JSON e serializa usuário bruto. | Tornar adapter fino: adaptar request/response/cookie, chamar o núcleo, mapear erros e responder DTO. | FR-002–FR-005, FR-012, FR-013 |
| `me/route.ts` | `POST`, não exige `ACTIVE`, remove só senha por blacklist. | Tornar adapter `GET` fino, revalidar `AuthenticatedPrincipal`, serializar `PublicUserDto` e expirar cookie inválido. | FR-006–FR-009, FR-012, FR-013 |
| `logout/route.ts` | Caminho feliz idempotente com configuração separada. | Reutilizar política do cookie e manter idempotência. | FR-010, FR-011, FR-013 |
| `(private)/layout.tsx` | Client component renderiza `children` antes de `/me`. | Tornar layout server-side e redirecionar antes de renderizar quando a sessão não for elegível. | FR-005–FR-009, FR-011 |
| `src/proxy.ts` | Decide apenas pela presença e afasta do login qualquer cookie. | Limitar ao filtro otimista de ausência nas duas árvores; não consultar banco nem autorizar; remover redirect de login por presença. | FR-007, FR-008 |
| Schema Prisma | Estados e campos necessários já existem. | Nenhuma alteração. | FR-002, FR-003, FR-014 |

## Sequência técnica

1. Criar tipo público compartilhável, parser/serializer server-side com validação sintática mínima
   de email e módulo único de sessão, sem importar tipos de banco ou módulos server no cliente.
2. Criar núcleo de autenticação independente do Next.js, com dependências injetáveis para busca de
   usuário, comparação de senha e emissão/verificação de token; manter handlers e `requireAuth`
   como adapters finos de request, `cookies()` e response.
3. Restringir consultas a selects distintos: credencial interna e registro atual com `status`; após
   elegibilidade, produzir `AuthenticatedPrincipal { id, firstName, lastName, image, isAdmin }`.
4. Ajustar o serviço de login para validar senha com bcrypt, aceitar exclusivamente `ACTIVE`,
   emitir JWT somente depois da elegibilidade e devolver resultado discriminado com DTO público.
5. Ajustar `POST /api/auth/sign-in`, `GET /api/auth/me` e `POST /api/auth/logout` conforme o
   contrato, inclusive `Cache-Control: no-store`, cookie coerente e erros controlados.
6. Converter o layout do grupo privado em fronteira server-side que chama o validador completo
   antes de renderizar; exigir o mesmo helper em todo handler/ação protegida do recorte.
7. Restringir o proxy à navegação otimista nas árvores protegidas e eliminar qualquer concessão ou
   redirect de rota pública baseado somente em cookie.
8. Atualizar contexto, login e logout para fazer parse do envelope, decidir fluxo por `code`, usar
   `message` pública segura como fallback, impedir corridas e garantir que
   back/reload depois de logout concluído não recuperem acesso.
9. Adicionar scripts e testes: núcleo com fakes manuais; adapters/handlers via harness controlado;
   fixture protegida por quatro condições simultâneas; E2E HTTP serial com servidor real, Chromium
   instalado/verificado e banco exclusivo de teste.
10. Executar a matriz do quickstart, lint, tipos, build e revisão do diff durante implementação;
   registrar separadamente as metas manuais de usabilidade.

## Contratos e modelo

- [data-model.md](data-model.md) descreve somente usuário existente, `UserStatus`,
  `AuthenticatedPrincipal`, identidade pública e sessão conceitual; não cria tabela de sessão.
- [contracts/auth-api.openapi.yaml](contracts/auth-api.openapi.yaml) define login, restauração,
  logout, falhas e conjunto exato de campos públicos.
- O DTO público contém somente `{ firstName, lastName, image }`; `id` e `email` permanecem fora da
  resposta por não serem consumidos na jornada atual.
- Token nunca integra resposta JSON; senha/hash existem apenas no caminho interno de comparação.
- O contrato do cliente não contém `status`, `role`, `isAdmin`, timestamps ou relações.
- O principal interno contém somente `{ id, firstName, lastName, image, isAdmin }`, preserva
  `requireAdmin` e nunca é enviado diretamente; `/api/auth/me` sempre usa o serializer público.

## Estratégia de validação

| Camada | Ferramenta planejada | Cobertura mínima |
|---|---|---|
| Unitária | `node:test` + `tsx` existentes | Parser/allowlist/formato de email, núcleo com fakes injetados, principal/serializer, guard da URL de teste, segredo, JWT e cookie. |
| Integração | `node:test` serial e harness explícito | Adapters/handlers finos com request, cookie e response controlados; bcrypt/JWT reais quando aplicável, sem banco real. |
| Percurso completo | `@playwright/test` aprovado, Chromium, `workers: 1`, app e PostgreSQL de teste | HTTP e servidor reais; login, reload, árvores privadas, condições de sessão, `ACTIVE → BLOCKED`, DTO e logout. |
| Navegador automatizado | Playwright Chromium serial, produção e HTTPS local temporário | Ausência de flash protegido sob latência, DTO/cache no tráfego real, atributos do cookie e ciclo pós-logout. |
| Humana futura | Sessão de usabilidade com participantes | SC-006/SC-007 permanecem `NAO_VERIFICADO`; follow-up de UX/produto não bloqueia a conclusão técnica. |
| Qualidade | scripts planejados e existentes | `test:fixtures:auth`, `test:unit`, `test:integration`, `test:e2e`, `lint`, `typecheck`, `build` e `git diff --check`. |

Os E2E usam somente usuários fictícios allowlisted e banco dedicado; não chamam cadastro. Antes de
qualquer conexão destrutiva ou escrita, o guard exige `NODE_ENV=test`, `TEST_DATABASE_URL`,
`TEST_DATABASE_CONFIRMATION=HIDROFLORESTAS_AUTH_TEST`, URLs sintaticamente válidas e URLs
normalizadas diferentes. A preparação detalhada está em [quickstart.md](quickstart.md).

## Dependências aprovadas

`DECISAO_CONFIRMADA` (`CF-TECH-001`) — Adicionar somente `@playwright/test` a `devDependencies`, em versão compatível
com o peer opcional do Next.js observado. A implementação atualizará `package.json` e
`package-lock.json`; o Chromium será instalado e verificado separadamente e não entra no lockfile. Não adotar
Vitest, Jest, Testing Library, jsdom, Cypress, Zod ou biblioteca nova de sessão nesta feature.

## Arquivos da implementação

### Adicionados

- `src/app/api/server/auth/auth.contracts.ts`
- `src/app/api/server/auth/auth.core.ts`
- `src/app/api/server/auth/session.ts`
- `src/types/auth.type.ts`
- `tests/fixtures/auth-users.ts`
- `tests/unit/*.test.ts`
- `tests/integration/*.test.ts`
- `tests/e2e/authenticated-access.spec.ts`
- `tests/e2e/authenticated-access-https.spec.ts`
- `tests/e2e/run-auth-https.mjs`
- `playwright.config.ts`

### Alterados

- `src/app/api/server/services/auth.service.ts`
- `src/app/api/server/services/users.service.ts`
- `src/app/api/server/middlewares/auth.middleware.ts`
- `src/app/api/auth/sign-in/route.ts`
- `src/app/api/auth/me/route.ts`
- `src/app/api/auth/logout/route.ts`
- `src/app/(private)/layout.tsx`
- `src/contexts/auth.context.tsx`
- `src/app/login/page.tsx`
- `src/app/logout/page.tsx`
- `src/proxy.ts`
- `package.json`
- `package-lock.json`

### Verificados, sem mudança planejada

- `prisma/schema.prisma` e `prisma/migrations/**`
- `src/app/api/auth/sign-up/route.ts` e `src/app/register/**`
- `src/app/api/server/middlewares/admin.middleware.ts`
- documentação global e módulos de domínio

## Limites

Não incluir cadastro, recuperação/troca de senha, aprovação/administração, autenticação social,
permissões detalhadas, laboratórios, áreas, mapas, IHFR, rate limiting, auditoria geral, refresh
token, blacklist persistida, schema, migration, CI global ou reestruturação ampla do backend. O
cadastro existente permanece fora, embora qualquer cookie que produza continue incapaz de
atravessar a validação server-side sem usuário `ACTIVE`.

## Riscos e pendências

| Risco/pendência | Tratamento no recorte | Estado |
|---|---|---|
| JWT furtado permanece válido até expiração | TTL único, cookie HTTP-only/SameSite/Secure e revalidação `ACTIVE`; revogação persistida fora do escopo. | Risco aceito no desenho stateless, a revisar antes de requisitos mais fortes. |
| Falha/rede durante logout | Não declarar sucesso antes da resposta; estado controlado e nova tentativa. | Coberto por integração/E2E. |
| Consulta duplicada entre layout e `/me` | Priorizar segurança e clareza; otimizar só com prova de equivalência. | Não bloqueante. |
| Fixture atingir banco indevido | Quatro condições simultâneas, parsing/normalização das URLs antes da comparação, conexão explícita por `TEST_DATABASE_URL`, IDs/emails reservados e operações estritamente filtradas. | Guard fail-closed e seus testes bloqueiam setup, update e teardown. |
| Nova devDependency e browser | Instalar somente na implementação; lockfile, download e smoke de lançamento headless explícitos; `--with-deps` apenas como contingência operacional. | Decisão aprovada em `CF-TECH-001`. |
| Next.js 16.1.6 abaixo do patch indicado por boletim de 2026-08 | Coordenar upgrade global separado antes de produção; não misturar no PR da feature. | Pendência externa, não bloqueia `$speckit-tasks`. |
| Metas SC-006/SC-007 exigem participantes | Preservar metas e registrar follow-up de UX/produto; automação não substitui usabilidade. | `NAO_VERIFICADO`; adiada por decisão confirmada de 2026-09-13 e não bloqueante para o fechamento técnico. |

## Trabalho paralelo e propriedade temporária

- **Exclusivos da feature neste checkpoint**: `specs/001-authenticated-access/**`.
- **Propriedade temporária recomendada ao implementador de autenticação**: `src/app/api/auth/**`
  no recorte, `src/app/api/server/{auth,middlewares,services}/**` afetados,
  `src/contexts/auth.context.tsx`, `src/proxy.ts`, layout privado e testes de autenticação.
- **Compartilhados que não devem mudar em paralelo**: `package.json`, `package-lock.json`,
  `playwright.config.ts`, autenticação, layouts globais/privados e tipos compartilhados.
- **Não editar em paralelo**: schema/migrations, configuração de testes e qualquer refatoração do
  serviço de usuário enquanto os contratos desta feature estiverem em implementação.
- **Trabalho independente possível**: pesquisa, rastreabilidade e refinamento documental de outra
  entrega em caminhos próprios, sem criar nesta execução outra spec e sem tocar em autenticação,
  schema ou configuração de testes. Implementação de laboratório deve aguardar estabilização do
  contrato autenticado.

## Reconciliação da implementação

`EVIDENCIA_IMPLEMENTACAO` — A matriz técnica foi executada em 2026-09-13: 34 unitários, 14 testes
de integração, os dez E2E preexistentes e dois cenários complementares de T039 em produção HTTPS
passaram. O lint terminou com zero erros e quatro warnings preexistentes; typecheck, build e
`git diff --check` passaram. O ciclo real do Neon E2E começou e terminou com contagem allowlisted
zero e usou somente as quatro fixtures determinísticas.

`DECISAO_CONFIRMADA` — A equipe do HidroFlorestas decidiu em 2026-09-13 que a automação objetiva
substitui a observação manual de T039 e que o adiamento de SC-006/SC-007 para UX/produto não bloqueia
a conclusão técnica de `IMP-001`. Ambas as metas permanecem `NAO_VERIFICADO`, sem resultado humano
inventado. O desenho JWT stateless mantém o risco aceito de cópia do token permanecer válida até
expirar; a atualização global de dependências continua trabalho futuro separado.

## Complexity Tracking

Não há violações a justificar. A solução reutiliza o projeto e as dependências de produção
existentes; a única dependência nova aprovada é exclusiva de validação E2E.
