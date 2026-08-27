# Inventário do repositório

- **Data civil da execução:** 2026-08-27
- **Branch de origem:** `development`
- **Branch da iniciativa:** `docs/code-first-prd`
- **Commit-base:** `2fe5541c068903fb512474d90f9b2c452c1143b2`
- **Estado Git inicial:** limpo (`git status --short` sem saída), um único worktree
- **Método:** inspeção estática; buscas com exclusão explícita de `docs/raw/**`
- **Estado do documento:** `EM_REVISAO`

## Baseline reproduzível

| Item | Resultado | Evidência ou comando |
|---|---|---|
| Branch e commit de origem | `development` no commit-base | `git branch --show-current`; `git rev-parse HEAD` antes da criação da branch. |
| Upstream | `origin/development` no mesmo commit | `git rev-parse --abbrev-ref --symbolic-full-name '@{upstream}'`; `git rev-parse '@{upstream}'`. |
| Estado inicial | limpo | `git status --short` sem saída. |
| Worktrees | um | `git worktree list --porcelain`. |
| Diretório da iniciativa | inexistente no baseline | `test -e docs/code-first-prd` retornou ausência. |
| Branch da iniciativa | inexistente no baseline; criada no commit-base | `git show-ref --verify refs/heads/docs/code-first-prd`; depois `git switch -c docs/code-first-prd 2fe5541...`. |

## Estrutura relevante

| Camada | Estrutura observada | Evidência e localizador |
|---|---|---|
| Aplicação | Next.js App Router em `src/app/`, com grupos público e privado. | `src/app/layout.tsx:1-32`; páginas rastreadas por `git ls-files 'src/app/**/page.tsx'`. |
| Frontend | React client components, Tailwind utilities, assets raster e Lucide. | `src/app/page.tsx:1-19`; `src/app/globals.css:1-6`; `src/components/sidebar/index.tsx:1-18`. |
| Backend | Quatro route handlers de autenticação e serviços no mesmo projeto. | `src/app/api/auth/sign-up/route.ts:1-43`; `src/app/api/auth/sign-in/route.ts:1-39`; `src/app/api/auth/me/route.ts:1-32`; `src/app/api/auth/logout/route.ts:1-13`. |
| Dados | Prisma Client com adapter Neon e variável `DATABASE_URL`. | `src/app/api/server/lib/prisma.ts:1-14`; `prisma.config.ts:4-11`. |
| Schema | PostgreSQL, usuários, laboratórios, pesquisadores, áreas, coletas e dados/diagnóstico IHFR. | `prisma/schema.prisma:1-27`, `prisma/schema.prisma:43-142`, `prisma/schema.prisma:151-240`. |
| Middleware de aplicação | Validação de JWT no servidor e verificação administrativa por `isAdmin`. | `src/app/api/server/middlewares/auth.middleware.ts:1-30`; `src/app/api/server/middlewares/admin.middleware.ts:1-12`. |
| Proxy de rotas | Protege `/dashboard` e `/workspace` apenas pela presença do cookie. | `src/proxy.ts:3-25`. |
| Documentação | Governança e auditorias preexistentes; a iniciativa nova vive somente em `docs/code-first-prd/`. | `PROJECT_CONTEXT.md:13-31`; inventário rastreado por `git ls-files ':!docs/raw/**'`. |

Não foram localizados diretórios rastreados separados para frontend, backend, Python, infraestrutura, `apps/` ou `packages/`; frontend e backend estão sob `src/`. Evidência de ausência: `git ls-files ':!docs/raw/**'` e verificações de existência para `python/`, `infra/`, `infrastructure/`, `frontend/`, `backend/`, `apps/` e `packages/` no commit-base.

## Stack e versões resolvidas

| Componente | Versão resolvida | Uso observado | Evidência e localizador |
|---|---|---|---|
| Next.js | 16.1.6 | Framework App Router full-stack. | `package-lock.json:6507`; `package.json:21`; `src/app/layout.tsx:1-32`. |
| React / React DOM | 19.2.4 / 19.2.4 | Interface e contextos client-side. | `package-lock.json:7287`, `package-lock.json:7296`; `package.json:22-23`. |
| TypeScript | 5.9.3 | Código tipado com `strict` e `noEmit`. | `package-lock.json:8363`; `package.json:41`; `tsconfig.json:2-23`. |
| Tailwind CSS | 4.2.1 | Estilização por utilities via PostCSS. | `package-lock.json:8088`; `src/app/globals.css:1`; `postcss.config.mjs:1-5`. |
| Lucide React | 1.16.0 | Ícones em páginas e componentes. | `package-lock.json:6325`; `src/app/page.tsx:2-15`. |
| Prisma CLI / Client | 7.4.2 / 7.4.2 | Schema, geração do client e persistência de usuário. | `package-lock.json:7138`, `package-lock.json:1821`; `prisma/schema.prisma:5-8`; `src/app/api/server/services/users.service.ts:1-61`. |
| Adapter Neon / Neon serverless | 7.7.0 / 1.0.2 | Conexão PostgreSQL no serviço Prisma. | `package-lock.json:1795`, `package-lock.json:1565`; `src/app/api/server/lib/prisma.ts:1-13`. |
| bcrypt / jsonwebtoken | 6.0.0 / 9.0.3 | Hash de senha e token de sessão. | `package-lock.json:3295`, `package-lock.json:5828`; `src/app/api/server/services/auth.service.ts:1-18`. |
| Sonner | 2.0.7 | Feedback client-side de autenticação. | `package-lock.json:7854`; `src/contexts/auth.context.tsx:3-5`, `src/contexts/auth.context.tsx:88-113`. |
| ESLint / eslint-config-next | 10.0.2 / 16.1.6 | Lint configurado, mas não executado nesta iniciativa. | `package-lock.json:4189`, `package-lock.json:4245-4264`; `eslint.config.mjs:1-18`. |

Versões foram lidas do lockfile; intervalos declarados permanecem em `package.json:12-41`. A presença de dependência, isoladamente, não prova capacidade conectada.

## Gerenciador e scripts

O lockfile `package-lock.json:1-9` identifica npm e lockfile versão 3. Não há `packageManager` ou `engines` declarados no manifesto.

| Script | Comando declarado | Estado nesta execução | Evidência |
|---|---|---|---|
| `dev` | `next dev` | não executado | `package.json:6`. |
| `build` | `npx prisma generate && next build` | não executado | `package.json:7`. |
| `start` | `next start` | não executado | `package.json:8`. |
| `create-super-admin` | `tsx ./src/app/api/server/scripts/superadmin.ts` | não executado | `package.json:9`; `src/app/api/server/scripts/superadmin.ts:27-76`. |
| `lint` | `eslint` | não executado; há relato da inspeção Code-First anterior de falha de tooling, mas a condição não foi reproduzida nesta execução e permanece `NAO_VERIFICADO` | `package.json:10`; `eslint.config.mjs:1-18`; versões em `package-lock.json:4189` e `package-lock.json:4245-4264`. |

O lint global foi deliberadamente omitido pelo mandato desta execução. O relato anterior de falha de tooling não foi reproduzido e permanece `NAO_VERIFICADO`; não constitui diagnóstico atual.

## Frontend e navegação

| Área | Estado estático | Evidência e localizador |
|---|---|---|
| Landing | Página responsiva com conteúdo comercial e link para login; alegações não comprovam capacidades. | `src/app/page.tsx:17-109`, `src/app/page.tsx:121-207`, `src/app/page.tsx:277-313`. |
| Login e cadastro | Formulários client-side conectados ao contexto de autenticação. | `src/app/login/page.tsx:12-37`, `src/app/login/page.tsx:93-188`; `src/app/register/page.tsx:14-49`, `src/app/register/page.tsx:121-245`. |
| Workspace | Alterna laboratórios localmente e exibe dados fixos, sem consumidor de API de laboratório. | `src/app/(private)/workspace/page.tsx:19-49`, `src/app/(private)/workspace/page.tsx:61-87`, `src/app/(private)/workspace/page.tsx:99-168`. |
| Dashboard | Agrega mapa placeholder e histórico mockado. | `src/app/(private)/dashboard/page.tsx:7-22`; `src/app/(private)/dashboard/maps.tsx:18-46`; `src/app/(private)/dashboard/activity-history.tsx:25-110`. |
| Áreas | Grade abastecida por array fixo; ações usam `alert` ou rotas ausentes. | `src/app/(private)/dashboard/collects/page.tsx:6-24`; `src/app/(private)/dashboard/collects/collects-grid.tsx:3-50`; `src/app/(private)/dashboard/collects/collect-card.tsx:66-79`. |
| Responsividade | Há breakpoints Tailwind e navegação mobile distinta. | `src/app/register/page.tsx:65-102`; `src/app/(private)/dashboard/layout.tsx:8-17`; `src/components/sidebar/index.tsx:34-63`. |

## Backend, APIs e persistência

As APIs localizadas restringem-se a cadastro, login, consulta de sessão e logout. Foi localizado estaticamente o caminho cadastro/login → route handler → `AuthService` → `UserService` → Prisma e o caminho consulta de sessão → middleware JWT → consulta de usuário; o banco não foi exercitado. No logout, a API emite expiração do cookie. Evidências: `src/app/api/auth/sign-up/route.ts:6-35`, `src/app/api/auth/sign-in/route.ts:6-30`, `src/app/api/auth/me/route.ts:5-13`, `src/app/api/auth/logout/route.ts:4-12`, `src/app/api/server/services/auth.service.ts:29-102` e `src/app/api/server/services/users.service.ts:6-39`.

Métodos para atualizar senha e usuário existem nos serviços, mas nenhum route handler consumidor foi localizado (`src/app/api/server/services/auth.service.ts:104-154`; inventário de quatro arquivos `src/app/api/**/route.ts`). Não foram localizadas APIs conectadas para laboratórios, membros, áreas, coletas, mapas ou IHFR.

## Schema, migration e gerados

- O schema versionado define persistência PostgreSQL e o output do client em `src/generated/prisma` (`prisma/schema.prisma:1-8`).
- Há uma migration local em `prisma/migrations/20260523005224_init/migration.sql` e um lock local em `prisma/migrations/migration_lock.toml`; ambos são ignorados por `prisma/migrations` em `.gitignore:21` e `.gitignore:27`. Seu conteúdo não fundamenta este inventário e os arquivos não são tratados como versionados.
- O Prisma Client gerado existe localmente sob `src/generated/prisma/`, é consumido por `src/app/api/server/lib/prisma.ts:1` e é ignorado por `.gitignore:20` e `.gitignore:49`.
- O build declara geração do client antes do Next build (`package.json:7`), mas não foi executado.

O schema contém entidades e campos de IHFR, água, solo, vegetação e terreno (`prisma/schema.prisma:110-198`), porém nenhuma API, serviço ou cálculo consumidor foi localizado. Isso é infraestrutura de persistência sem funcionalidade de produto conectada e não valida o modelo de domínio nem a ciência.

## Testes, CI, deploy e infraestrutura

| Tema | Resultado | Evidência e limite |
|---|---|---|
| Testes | nenhum teste ou configuração de runner rastreado foi localizado | `git ls-files ':!docs/raw/**'` sem caminhos de teste; `package.json:5-10` não declara script `test`. |
| CI | nenhum workflow ou diretório `.github/`/`.gitlab/` rastreado foi localizado | inventário `git ls-files ':!docs/raw/**'` e checagem de existência no commit-base. |
| Vercel | implantação não verificada | não há `vercel.json` nem configuração rastreada; `.vercel` é apenas ignorado em `.gitignore:42-43`; `TD-007` permanece relato em `TECH_DECISIONS.md:25,37`. |
| Infraestrutura | nenhum Dockerfile, compose, Terraform ou diretório de infraestrutura rastreado foi localizado | inventário `git ls-files ':!docs/raw/**'`. |
| Python / mapas | nenhum diretório, dependência ou integração Python, OpenStreetMap, Plotly ou Leaflet foi localizado | `package.json:12-41`; inventário rastreado e busca textual no código/configuração permitidos. |
| Figma | nenhum arquivo, URL ou identificador concreto de Figma foi localizado no código/configuração permitidos | inventário rastreado; governança apenas estabelece que UX exige estado identificado em `docs/governance/SOURCE_AUTHORITY.md:25`. |

## Artefatos ignorados relevantes

| Artefato local | Estado | Evidência |
|---|---|---|
| `.env` | existe e está ignorado; conteúdo não lido | `.gitignore:39-40`; `git check-ignore -v .env`. |
| `.next/` | existe e está ignorado | `.gitignore:16-18`; `git check-ignore -v .next`. |
| `node_modules/` | existe e está ignorado | `.gitignore:3-4`; `git status --ignored --short`. |
| `prisma/migrations/` | existe e está ignorado | `.gitignore:21,27`; `git check-ignore -v prisma/migrations/20260523005224_init/migration.sql`. |
| `src/generated/prisma/` | existe, é consumido e está ignorado | `.gitignore:20,49`; `src/app/api/server/lib/prisma.ts:1`; `git check-ignore -v src/generated/prisma/index.js`. |

Nenhum segredo ou valor de ambiente foi lido ou reproduzido.

## Limitações da inspeção

- Não houve runtime, build, lint, testes, banco, migration, deploy, rede ou Figma.
- Conectividade é conclusão estática; nenhum comportamento recebeu verificação em runtime.
- Ausências são relativas ao commit-base, ao worktree e às fontes permitidas.
- O conteúdo da migration ignorada e os arquivos gerados não foram usados para definir intenção ou requisitos.
- Há relato da inspeção Code-First anterior de falha de tooling no lint, mas a condição não foi reproduzida nesta execução e permanece `NAO_VERIFICADO`.
- Alegações da landing foram classificadas como texto comercial, nunca como evidência funcional.
