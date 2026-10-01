# Auditoria da implementação e da infraestrutura

## Identificação, estado e limites

- **Identificador:** `DOC-014`
- **Etapa:** 9
- **Data civil:** 2026-08-28
- **Estado:** `EM_REVISAO`
- **Plano:** [`DOC-PLAN-008`](../../plans/active/auditoria-implementacao-infraestrutura.md)
- **Baseline Git:** branch `development`, commit `2fe5541c068903fb512474d90f9b2c452c1143b2`
- **Responsável pela execução:** agente mantenedor
- **Revisão humana:** pendente
- **Natureza:** auditoria analítica, local e somente leitura da implementação rastreada
- **Autoridade normativa:** nenhuma sobre ciência, produto, domínio, UX, dados, segurança, arquitetura ou operação

Este relatório descreve o que foi localizado no baseline e os resultados de comandos locais seguros. `EVIDENCIA_IMPLEMENTACAO` comprova somente existência, ausência delimitada ou comportamento observável no código inspecionado; não comprova correção, segurança, operação externa, intenção normativa nem mérito científico. Propostas, recomendações e decisões relatadas permanecem com a classificação de suas fontes. Nenhum achado foi corrigido e nenhuma das pendências `PD-001`–`017` foi resolvida.

## Resultado executivo

`FATO_DOCUMENTADO` — A Etapa 9 foi concluída com ressalvas e aguarda revisão humana. Os 18 `CODE-CHECK-NNN` foram avaliados: 3 `IMPLEMENTADO_VERIFICADO`, 4 `PARCIALMENTE_IMPLEMENTADO`, 7 `NAO_IMPLEMENTADO` e 4 `NAO_AVALIADO`. A inspeção cobriu 63 arquivos técnicos ou vinculados à implementação, agrupados em 20 `IMP-ART-NNN`, além de um grupo contextual ignorado e excluído das contagens. Foram catalogadas 36 evidências e 18 achados.

As ressalvas principais são: operação de banco e implantação externa não testadas; contrato futuro de API, modelo de dados e política de operação inexistentes; motor IHFR, mapas, offline e testes não localizados; persistência científica apenas representada no schema; riscos críticos no fluxo de identidade; e lint bloqueado por incompatibilidade de tooling antes da análise das fontes.

## Encerramento formal da Etapa 8

`DECISAO_CONFIRMADA` — A solicitação desta etapa registra a aprovação humana da Etapa 8, exclusivamente em seu limite analítico. O gate foi reconfirmado antes da inspeção técnica.

| Verificação do gate | Resultado |
|---|---:|
| Achados brutos / consolidados / cobertura | 93 / 58 / 93 de 93 |
| Ocorrências bloqueantes / bloqueios únicos | 41 / 26 |
| Perguntas brutas / consolidadas / cobertura | 88 / 52 / 88 de 88 |
| Pacotes / verificações de código / camadas de prontidão | 15 / 18 / 12 |
| Nós / relações / lacunas | 13 / 22 / 16 |
| Pendências abertas | 17 |
| Tabelas Markdown estruturalmente válidas em `DOC-013` | 24 |
| Data civil | 2026-08-26 |
| `TR-003`–`016` | 14 de 14 com proveniência `INFERENCIA` e validação `VERIFICADA_ANALITICAMENTE` |
| Estado inicial de `CODE-CHECK-001`–`018` | 18 de 18 `NAO_AVALIADO` |

`DOC-PLAN-007` passou a `CONCLUIDO` e foi movido de `docs/plans/active/` para `docs/plans/completed/consolidacao-auditoria-documental.md`. `DOC-013` passou a `CANONICO_ATUAL` exclusivamente como análise consolidada aprovada. Os checksums finais, calculados após a última alteração da Etapa 8, são:

- `DOC-PLAN-007`: `SHA-256:aa511f36c9b5f01c153843e2a943772fd7fb07edb8f3c87c7a888c5383240876`;
- `DOC-013`: `SHA-256:59c7f5b5eb63a1fd072d59a56e5f2b5d7d9f21604e963dc3f21c22f998544b69`.

A aprovação não valida ciência, fórmula, requisitos, dados, UX, arquitetura ou implementação; não resolve decisões, não produz PRD e não concede autoridade normativa aos relatórios.

## Baseline técnico e método

| Item | Estado observado |
|---|---|
| Diretório | `/home/pedrovitor237/Documents/Projects/HidroFlorestas` |
| Branch / upstream | `development` / `origin/development` |
| Commit inicial | `2fe5541c068903fb512474d90f9b2c452c1143b2` |
| Worktree inicial | Limpo; sem staged, unstaged ou untracked |
| Arquivos rastreados | 96 |
| Arquivos do inventário técnico ampliado | 63, incluindo `README.md`; documentação e canônicos de governança excluídos |
| Submodules | Nenhum |
| Gerenciador | npm, determinado por `package.json` e `package-lock.json` versão 3 |
| Segredos | `.env` existe e está ignorado, mas não foi aberto; somente nomes de variáveis do exemplo rastreado foram considerados |
| Rede, banco e serviços | Não acessados |

Versões observadas: Git 2.47.3, Node.js v20.19.2, npm/npx 9.2.0, Next.js 16.1.6, React/React DOM 19.2.4, TypeScript 5.9.3, Prisma e `@prisma/client` 7.4.2, ESLint 10.0.2 e `tsx` 4.21.0. Python 3.13.5 e pip 25.1.1 existem no sistema, mas não integram o projeto. pnpm, Yarn, Bun, Prisma global e Docker não foram localizados.

`node_modules/` (aproximadamente 909 MiB), `.next/` (aproximadamente 322 MiB), `src/generated/` (aproximadamente 9,7 MiB) e `prisma/migrations/` existem localmente, estão ignorados e não foram usados para inflar o baseline. Seus `mtime` e o status técnico permaneceram estáveis após as verificações. Não havia `dist/`, `build/` ou cobertura gerada.

O método seguiu a cadeia declaração → configuração → importação → uso → integração → persistência → teste → execução. Ausências foram concluídas somente após busca nos manifests, configurações e fontes rastreadas plausíveis. Artefatos ignorados foram tratados apenas como contexto local não reproduzível a partir do commit.

## Inventário `IMP-ART-NNN`

### Contagens do universo rastreado

| Categoria | Arquivos |
|---|---:|
| Documentação técnica vinculada | 1 |
| Manifest | 1 |
| Lockfile | 1 |
| Configuração e tooling | 7 |
| Schema | 1 |
| Páginas | 7 |
| Layouts | 4 |
| Rotas de API | 4 |
| Proxy | 1 |
| Backend, serviços, middleware, script e tipos | 8 |
| Componentes de feature, compartilhados e contexto | 10 |
| CSS | 1 |
| Assets | 17 |
| **Total** | **63** |

| Linguagem ou formato | Arquivos |
|---|---:|
| TypeScript | 15 |
| TSX | 21 |
| PNG | 11 |
| SVG | 5 |
| JSON | 3 |
| MJS | 2 |
| Markdown | 1 |
| CSS | 1 |
| ICO | 1 |
| Prisma | 1 |
| `.gitignore` | 1 |
| Exemplo de ambiente | 1 |
| **Total** | **63** |

| Camada | Arquivos |
|---|---:|
| Documentação técnica | 1 |
| Tooling e configuração | 9 |
| Dados | 1 |
| Frontend | 39 |
| Backend, API e segurança | 13 |
| **Total** | **63** |

Estado de inclusão: 63 de 63 arquivos estão `RASTREADO_NO_BASELINE`; nenhum arquivo gerado ou ignorado foi contado. `IMP-ART-021` registra contexto local como `FORA_DO_BASELINE`.

### Catálogo de artefatos

| ID | Categoria; caminho; quantidade | Tipo, formato e camada | Função observável e entradas principais |
|---|---|---|---|
| `IMP-ART-001` | Documentação; `README.md`; 1 | Markdown; documentação técnica | Instruções de instalação, Prisma, execução e tecnologias; contém alegações operacionais, mas não é norma arquitetural. |
| `IMP-ART-002` | Manifest; `package.json`; 1 | JSON; tooling | Dependências e scripts `dev`, `build`, `start`, `create-super-admin` e `lint`. |
| `IMP-ART-003` | Lockfile; `package-lock.json`; 1 | JSON lock v3; tooling | Resoluções npm exatas e árvore de dependências. |
| `IMP-ART-004` | Configuração; `.gitignore`, `env.exemple`, `eslint.config.mjs`, `next.config.ts`, `postcss.config.mjs`, `prisma.config.ts`, `tsconfig.json`; 7 | Texto, TS, MJS e JSON; tooling | Ignore, nomes de ambiente, ESLint, Next, Tailwind/PostCSS, Prisma e TypeScript estrito/no-emit. |
| `IMP-ART-005` | Dados; `prisma/schema.prisma`; 1 | Prisma; dados | Datasource PostgreSQL, client gerado, 11 models, 10 enums, relações e constraints. |
| `IMP-ART-006` | Shell da aplicação; `src/app/layout.tsx`, `globals.css`, `favicon.ico`; 3 | TSX, CSS e ICO; frontend | Layout raiz, metadata pt-BR, fonte Poppins, `AuthProvider`, toaster e estilo Tailwind. |
| `IMP-ART-007` | Página pública; `src/app/page.tsx`; 1 | TSX; frontend | Landing page estática e navegação para autenticação. |
| `IMP-ART-008` | Identidade no cliente; `src/app/login/`, `register/`, `logout/`, `src/contexts/auth.context.tsx`; 4 | TSX; frontend | Formulários e contexto que chamam as quatro rotas de autenticação. |
| `IMP-ART-009` | Layouts privados; `src/app/(private)/layout.tsx`, `dashboard/layout.tsx`, `workspace/layout.tsx`; 3 | TSX; frontend | Estrutura privada, sidebar/top bar e validação assíncrona de sessão. |
| `IMP-ART-010` | Dashboard; `dashboard/page.tsx`, `activity-history.tsx`, `maps.tsx`; 3 | TSX; frontend | Resumo visual, histórico mock e placeholder de mapa. |
| `IMP-ART-011` | Coletas; `dashboard/collects/page.tsx`, `collect-card.tsx`, `collects-grid.tsx`; 3 | TSX; frontend | Cards e listagem mock; links para rota de detalhe não implementada. |
| `IMP-ART-012` | Workspace; `workspace/page.tsx`; 1 | TSX; frontend | Formulário local de coleta em etapas, sem persistência ou cálculo. |
| `IMP-ART-013` | Componentes compartilhados; `src/components/**`; 5 | TSX; frontend | Cabeçalho, sidebar, top bar, perfil e contêiner visual. |
| `IMP-ART-014` | API de identidade; `src/app/api/auth/{sign-up,sign-in,me,logout}/route.ts`; 4 | TypeScript; API | Quatro handlers `POST` para cadastro, login, sessão e logout. |
| `IMP-ART-015` | Infraestrutura de servidor; `src/app/api/server/lib/env.ts`, `lib/prisma.ts`; 2 | TypeScript; backend/dados | Ambiente, driver Neon, WebSocket, adapter e `PrismaClient`. |
| `IMP-ART-016` | Serviços; `auth.service.ts`, `users.service.ts`; 2 | TypeScript; backend | Hash de senha, JWT/cookie e operações Prisma sobre `User`. |
| `IMP-ART-017` | Proteção; `auth.middleware.ts`, `admin.middleware.ts`, `src/proxy.ts`; 3 | TypeScript; segurança | Verificação JWT, consulta de usuário, checagem administrativa e filtro de cookie por rota. |
| `IMP-ART-018` | Operação auxiliar; `superadmin.ts`, `database-tables.type.ts`; 2 | TypeScript; backend | CLI de superadministrador e tipo auxiliar de tabelas. |
| `IMP-ART-019` | Assets públicos; `public/*.svg`; 5 | SVG; frontend | Assets padrão, inclusive marca Vercel; não comprovam implantação. |
| `IMP-ART-020` | Imagens; `src/assets/**/*.png`; 11 | PNG; frontend | Logos, parceiros, landing, autenticação e imagem padrão de coleta. |
| `IMP-ART-021` | Contexto ignorado; `node_modules/`, `.next/`, `src/generated/`, `prisma/migrations/`; não contado | Gerado/ignorado; várias camadas | Dependências, build/cache, client Prisma e uma migration local; fora do commit e não reproduzíveis como evidência rastreada. |

### Rastreabilidade do inventário

| ID | Dependências/configuração | Testes e `CODE-CHECK` | Alegação e estado documental | Observação e limitação |
|---|---|---|---|---|
| `IMP-ART-001` | npm e Prisma descritos | Nenhum; `001`,`003`,`005` | Alegação do próprio README; `FATO_DOCUMENTADO`, sem autoridade normativa | Instrução de migration não corresponde a migration rastreada; link local de desenvolvimento aponta para busca externa. |
| `IMP-ART-002` | npm | Nenhum teste; `001`–`007`,`009`,`016` | `TD-001`–`007` e alternativas; classificações preservadas | Manifest declara dependências, não sua operação. |
| `IMP-ART-003` | npm | `npm ls`; `001`–`005`,`016` | Mesmas fontes do manifest | Lockfile prova resolução, não integração. |
| `IMP-ART-004` | Next, ESLint, Tailwind, Prisma, TS | Lint; `001`–`006`,`016`,`017` | Decisões relatadas e lacunas `ARCH`; estados preservados | `next.config.ts` é vazio; exemplo de banco conflita com provider/adapter e contém defaults sensíveis, não reproduzidos. |
| `IMP-ART-005` | Prisma/PostgreSQL | Sem validação executada; `003`,`005`,`008`,`012`,`018` | Modelo futuro não aprovado; `NAO_ESPECIFICADO`/propostas históricas | Schema é definição, não prova migration rastreada nem banco aplicado. |
| `IMP-ART-006` | Next, React, Tailwind, Sonner | Nenhum; `001`,`002` | `TD-001`,`005`; decisão relatada pendente de verificação no documento | Renderização/navegador não executados; fonte Google pode exigir rede no build. |
| `IMP-ART-007` | Next, React, assets | Nenhum; `001`,`002` | Fluxos históricos sem aprovação normativa | Conteúdo estático. |
| `IMP-ART-008` | React, API auth, Sonner | Nenhum; `001`,`002`,`010` | `CON-Q-026`,`027`,`039`; pendente | Validação predominantemente client-side e cobertura de acessibilidade parcial. |
| `IMP-ART-009` | Contexto auth e componentes | Nenhum; `010` | `ARCH-039`,`040` não especificados; `PD-003`–`006`,`016` | Renderiza filhos enquanto validação de sessão ocorre; não prova isolamento. |
| `IMP-ART-010` | React, Lucide, mocks | Nenhum; `002`,`009`,`014` | Requisitos/wireframes históricos não aprovados | Mapa é placeholder; dados pessoais aparentes de mock não foram reproduzidos. |
| `IMP-ART-011` | React, Next/Image, Lucide | Nenhum; `002`,`009`,`014` | Fluxos históricos; estado normativo pendente | Dados e links são mock; rota de detalhe não existe. |
| `IMP-ART-012` | React e componentes | Nenhum; `010`,`013`,`015`,`018` | Backlog/requisitos históricos; sem aprovação | Estado somente em memória; botão final não persiste nem calcula. |
| `IMP-ART-013` | React, Next, Lucide | Nenhum; `002`,`010` | UX histórica; `PD-005`,`017` | Há link para perfil sem página rastreada e controles sem nomes acessíveis. |
| `IMP-ART-014` | Next, serviços auth | Nenhum; `010`,`011` | Contrato futuro ausente; `CON-Q-049` | Só identidade; não há APIs de laboratório, área, coleta ou IHFR. |
| `IMP-ART-015` | Neon, Prisma, env, ws | Nenhum; `003`–`005` | `TD-002`–`004`; decisão relatada pendente de verificação | Integração estática localizada; serviço externo e conexão não avaliados. |
| `IMP-ART-016` | bcrypt, JWT, Prisma | Nenhum; `005`,`010`,`011` | Segurança/API não normatizadas | Fluxo conectado, mas contém riscos críticos registrados sem expor valores. |
| `IMP-ART-017` | JWT, Prisma, Next cookies | Nenhum; `010` | Matriz futura de autorização ausente | Proxy testa presença, não validade; middleware admin sem consumidor localizado. |
| `IMP-ART-018` | readline, env, Prisma | Nenhum; `010`,`016` | Ferramenta sem cobertura documental específica | Não executada por exigir segredo e escrita no banco; controle de chave não interrompe o fluxo após falha. |
| `IMP-ART-019` | Nenhuma material | Nenhum; `006` | Vercel relatada, implementação pendente | Asset padrão não é evidência de deploy. |
| `IMP-ART-020` | Next/Image em parte do frontend | Nenhum; `002` | UX histórica | Assets não comprovam fluxo funcional. |
| `IMP-ART-021` | Estado local ignorado | Não contado; `003`,`005`,`016` | Sem estado documental | Uma migration local possui 11 tabelas, 10 enums, 5 uniques e 13 FKs; não é evidência rastreada. |

## Catálogo `IMP-EVD-NNN`

Todos os itens abaixo foram observados no mesmo baseline Git identificado no início do relatório. “Ausência” significa ausência nos 96 arquivos rastreados, após busca nos locais plausíveis; não significa inexistência em ambientes externos. A coluna documental aponta a alegação ou classificação preservada, não a aprova.

| ID e título | Tipo | Caminho, símbolo ou comando | Resultado objetivo |
|---|---|---|---|
| `IMP-EVD-001` — universo rastreado | `RESULTADO_DE_COMANDO` | `git ls-files`, classificação mecânica por caminho/extensão | 96 arquivos rastreados; 63 no inventário técnico ampliado. |
| `IMP-EVD-002` — dependências e versões | `DECLARACAO_DE_DEPENDENCIA` | `package.json`, `package-lock.json`, `npm ls --depth=0` | Stack npm instalada; uma dependência transitiva extraneous foi listada. |
| `IMP-EVD-003` — Next.js e rotas | `INTEGRACAO` | `src/app/**`, `next.config.ts`, `package.json` | App Router, sete páginas, quatro layouts e quatro handlers conectados. |
| `IMP-EVD-004` — React | `INTEGRACAO` | 21 arquivos TSX, hooks e context provider | React efetivamente compõe páginas, estado e contexto da aplicação. |
| `IMP-EVD-005` — Tailwind | `USO_EFETIVO` | `postcss.config.mjs`, `globals.css`, 388 ocorrências de `className` | Plugin configurado e classes usadas extensivamente. |
| `IMP-EVD-006` — Lucide | `USO_EFETIVO` | imports `lucide-react` em dez arquivos | Ícones importados e usados em componentes. |
| `IMP-EVD-007` — datasource e exemplo | `CONFIGURACAO` | `prisma/schema.prisma`, `prisma.config.ts`, `env.exemple` | Provider PostgreSQL configurado; exemplo rastreado aponta outra família de banco e contém defaults sensíveis não reproduzidos. |
| `IMP-EVD-008` — Neon | `INTEGRACAO` | `src/app/api/server/lib/prisma.ts`, `PrismaNeon`, `neonConfig` | Adapter Neon é instanciado e entregue ao `PrismaClient`; conexão externa não executada. |
| `IMP-EVD-009` — operações Prisma | `PERSISTENCIA` | `users.service.ts`, chamadas `user.create`, `findUnique`, `update` | ORM é chamado pelo fluxo de identidade; somente model `User` possui operações localizadas. |
| `IMP-EVD-010` — artefatos de banco não rastreados | `AUSENCIA_APOS_BUSCA_DELIMITADA` | `git ls-files prisma/migrations src/generated` | Nenhuma migration ou client gerado está no baseline; ambos são ignorados. |
| `IMP-EVD-011` — migration local ignorada | `MIGRATION` | `prisma/migrations/20260523005224_init/`, contexto local | SQL local espelha 11 tabelas, 10 enums, 5 uniques e 13 FKs; não pertence ao commit. |
| `IMP-EVD-012` — Vercel | `AUSENCIA_APOS_BUSCA_DELIMITADA` | `git ls-files`, busca por `vercel.json`, workflows e deploy | Só asset padrão e regra de ignore; nenhuma evidência rastreada de implantação. |
| `IMP-EVD-013` — Python/FastAPI | `AUSENCIA_APOS_BUSCA_DELIMITADA` | manifests e fontes rastreadas | Nenhum arquivo Python, manifest, FastAPI, rota ou chamada integrada. |
| `IMP-EVD-014` — PostGIS | `AUSENCIA_APOS_BUSCA_DELIMITADA` | schema, migration contextual, fontes e dependências | Nenhuma extensão, tipo geometry/geography, índice ou consulta espacial. |
| `IMP-EVD-015` — pilha de mapas | `AUSENCIA_APOS_BUSCA_DELIMITADA` | `dashboard/maps.tsx`, manifests e fontes | Placeholder visual; Leaflet, OSM, Plotly, camadas, tiles e CRS não localizados. |
| `IMP-EVD-016` — fluxo de identidade | `INTEGRACAO` | páginas/contexto → `/api/auth/*` → serviços → Prisma | Cadastro, login, consulta de sessão e logout estão conectados no código. |
| `IMP-EVD-017` — sessão e proxy | `DEFINICAO` | `auth.service.ts`, `auth.middleware.ts`, `src/proxy.ts`, layout privado | Cookie HTTP-only e JWT existem; proxy só testa presença do cookie e há comportamento distinto sem variável JWT. |
| `IMP-EVD-018` — autorização/isolamento | `AUSENCIA_APOS_BUSCA_DELIMITADA` | middlewares, imports e chamadas Prisma | `requireAdmin` não tem consumidor; nenhuma matriz por recurso, tenant, laboratório ou ownership foi localizada. |
| `IMP-EVD-019` — inventário de APIs | `DEFINICAO` | quatro `route.ts` em `src/app/api/auth/` | Quatro rotas `POST`; nenhuma API de laboratório, área, coleta, dados ambientais ou IHFR. |
| `IMP-EVD-020` — validação e respostas | `DEFINICAO` | rotas e `auth.service.ts` | Validação de servidor é mínima; cadastro aceita corpo não filtrado e cadastro/login devolvem objeto Prisma não sanitizado. |
| `IMP-EVD-021` — models e enums | `DEFINICAO` | `prisma/schema.prisma` | 11 models e 10 enums inventariados. |
| `IMP-EVD-022` — relações e constraints | `DEFINICAO` | `@relation`, `@unique`, `@@id` no schema | 13 arestas de relação, 5 uniques e 1 chave primária composta; nenhum índice normal explícito. |
| `IMP-EVD-023` — 17 variáveis | `DEFINICAO` | `CollectionArea`, `WaterData`, `SoilData`, `VegetationData`, `TerrainData` | Correspondência nominal/estrutural 17 de 17; nenhuma faixa, unidade ou transformação codificada. |
| `IMP-EVD-024` — representação do diagnóstico | `DEFINICAO` | model `IHFRDiagnosis` | Agregado, classe, quatro componentes, qualidade e versão estão definidos; fluxo de escrita não existe. |
| `IMP-EVD-025` — motor IHFR | `AUSENCIA_APOS_BUSCA_DELIMITADA` | fontes, scripts, handlers e testes rastreados | Nenhuma função de entrada, normalização, peso, agregação, classe ou recomendação. |
| `IMP-EVD-026` — persistência de domínio | `AUSENCIA_APOS_BUSCA_DELIMITADA` | serviços e chamadas `prisma.*` | Nenhuma operação localizada para os dez models além de `User`. |
| `IMP-EVD-027` — auditabilidade | `DEFINICAO` | `IHFRDiagnosis` e models ambientais | Cobertura parcial de saída; snapshot, scores por variável, drivers, recomendações, autor/momento e histórico ausentes. |
| `IMP-EVD-028` — offline | `AUSENCIA_APOS_BUSCA_DELIMITADA` | manifests/configs/fontes | Nenhum web manifest, service worker, IndexedDB/localStorage, fila, sync ou conflito. |
| `IMP-EVD-029` — testes e CI | `AUSENCIA_APOS_BUSCA_DELIMITADA` | `package.json`, fontes, raiz e `.github` | Nenhum teste, fixture, configuração, script, cobertura ou workflow de CI. |
| `IMP-EVD-030` — lint | `RESULTADO_DE_COMANDO` | `npm run lint`; inspeção da árvore ESLint | Falhou antes de analisar fontes por incompatibilidade entre ESLint 10.0.2 e plugins carregados por `eslint-config-next` 16.1.6. |
| `IMP-EVD-031` — scripts e efeitos | `DECLARACAO_DE_DEPENDENCIA` | `npm run`, scripts do manifest, estado de caches | Só cinco scripts; build geraria client Prisma e pode requerer fonte externa; caches preexistentes permaneceram estáveis. |
| `IMP-EVD-032` — deploy/observabilidade | `AUSENCIA_APOS_BUSCA_DELIMITADA` | raiz, configs e fontes | Pipeline, ambientes, health, rollback, instrumentação e observabilidade estruturada não localizados. |
| `IMP-EVD-033` — protótipo frontend | `USO_EFETIVO` | dashboard, workspace, collections, sidebar | Mocks e alertas ocupam fluxos centrais; duas rotas vinculadas não existem. |
| `IMP-EVD-034` — UX/acessibilidade | `DEFINICAO` | formulários, botões e layouts | Responsividade em classes; labels não vinculados, botões só com ícone sem nome e ausência de `loading/error/not-found` de rota. |
| `IMP-EVD-035` — riscos de identidade | `DEFINICAO` | rotas/serviços/middlewares auth, schema `User`, script superadmin | Mass assignment, exposição de hash, sessão para pendente, marcadores de privilégio independentes, fallback sensível e fluxo administrativo que não interrompe após chave inválida. |
| `IMP-EVD-036` — localizadores documentais | `DEFINICAO` | `DOC-013` e `DOC-012`, `ARCH-043`,`044`,`048`,`049` | Fontes de testes e deploy/observabilidade estão trocadas entre `CODE-CHECK-016` e `017`. |

### Força, tecnologia, camada e vínculo

| Evidências | Força | Tecnologia/camada | `CODE-CHECK` | Alegação documental e limitação principal |
|---|---|---|---|---|
| `IMP-EVD-001`,`002` | `FORTE` | Git/npm; transversal | todos | Baseline e resolução local; não provam comportamento da aplicação. |
| `IMP-EVD-003`,`004` | `FORTE` | Next.js/React; frontend | `001` | `TD-001` é decisão relatada; build/navegador não executados. |
| `IMP-EVD-005`,`006` | `FORTE` | Tailwind/Lucide; frontend | `002` | `TD-005`,`006`; renderização não executada. |
| `IMP-EVD-007` | `MEDIA` | Prisma/PostgreSQL; dados | `003`,`005` | `TD-002`,`004`; conflito de configuração reduz reprodutibilidade. |
| `IMP-EVD-008` | `FORTE` | Neon/Prisma; dados | `004`,`005` | `TD-003`,`004`; operação externa permanece não avaliada. |
| `IMP-EVD-009`,`010` | `FORTE` | Prisma; backend/dados | `003`,`005`,`012` | Uso ORM comprovado e ausência Git delimitada; banco não executado. |
| `IMP-EVD-011` | `MEDIA` | PostgreSQL/Prisma; dados | `003`,`005`,`012` | Contexto ignorado, não reproduzível pelo baseline. |
| `IMP-EVD-012` | `MEDIA` | Vercel; operação | `006`,`017` | `TD-007`; eventual implantação fora do repo é inacessível. |
| `IMP-EVD-013` | `FORTE` | Python/FastAPI; backend | `007` | `TD-009`,`012` estão em avaliação; ausência não rejeita alternativa. |
| `IMP-EVD-014`,`015` | `FORTE` | PostGIS/mapas; dados/frontend | `008`,`009`,`014` | Recomendações/propostas, sem composição aprovada. |
| `IMP-EVD-016`–`020` | `FORTE` | Next/JWT/Prisma; API/segurança | `010`,`011` | Contratos futuros ausentes; execução com credencial não realizada. |
| `IMP-EVD-021`,`022` | `FORTE` | Prisma; dados | `012`,`018` | Modelo futuro não aprovado; schema não prova banco aplicado. |
| `IMP-EVD-023`–`027` | `FORTE` | Prisma/IHFR; ciência/dados | `013`,`018` | Cobertura estrutural, não validação científica ou fluxo executado. |
| `IMP-EVD-028`,`029` | `FORTE` | Web/testes; transversal | `015`,`016` | Ausência limitada ao baseline rastreado. |
| `IMP-EVD-030`,`031` | `FORTE` | ESLint/npm; qualidade | `016` | Lint não alcançou fontes; build não executado por efeitos/rede. |
| `IMP-EVD-032` | `MEDIA` | Operação; infraestrutura | `006`,`017` | Ausência local não exclui serviço externo. |
| `IMP-EVD-033` | `FORTE` | React/Next; frontend | `001`,`010`,`014` | Código observável; UX não executada em navegador. |
| `IMP-EVD-034` | `MEDIA` | React/HTML; UX | `002`,`010`,`016` | Inspeção estática, sem tecnologia assistiva/navegador. |
| `IMP-EVD-035` | `FORTE` | JWT/Prisma; segurança | `010`,`011` | Fluxos e dados não foram explorados; risco inferido diretamente da passagem de dados/controle. |
| `IMP-EVD-036` | `MEDIA` | Governança; documental | `016`,`017` | Inconsistência de referência, sem correção dos catálogos aprovados. |

Distribuição: 36 evidências — 11 `DEFINICAO`, 11 `AUSENCIA_APOS_BUSCA_DELIMITADA`, 4 `INTEGRACAO`, 3 `USO_EFETIVO`, 2 `RESULTADO_DE_COMANDO`, 2 `DECLARACAO_DE_DEPENDENCIA`, 1 `CONFIGURACAO`, 1 `PERSISTENCIA` e 1 `MIGRATION`; 30 de força `FORTE` e 6 `MEDIA`.

## Avaliação dos 18 `CODE-CHECK-NNN`

### Resultado, fonte e evidência

| ID | Alegação, fonte e classificação documental original | Escopo e evidências positivas/negativas | Resultado, justificativa e completude | Relação documental e testes |
|---|---|---|---|---|
| `CODE-CHECK-001` | Frontend usa a pilha relatada; `DOC-012`, `TECH_DECISIONS.md`; Next `DECISAO_RELATADA_PENDENTE_DE_VERIFICACAO`, React `RECOMENDACAO`; base comum `CON-FND-058` é `FATO_DOCUMENTADO` + `NAO_ESPECIFICADO`. | Manifest, lock, configs, App Router e TSX; `IMP-EVD-002`–`004`. Build/navegador não executados. | `IMPLEMENTADO_VERIFICADO`. Next.js e React estão conectados ao fluxo; completude integral no código, operação de build não confirmada. | `ALINHAMENTO_IMPLEMENTACAO_DOCUMENTO`; nenhum teste. |
| `CODE-CHECK-002` | UI usa componentes/estilos relatados; `DOC-012`, `TD-005`,`006`; `DECISAO_RELATADA_PENDENTE_DE_VERIFICACAO`. | PostCSS, CSS, 388 usos de `className` e Lucide em dez arquivos; `IMP-EVD-005`,`006`,`034`. | `IMPLEMENTADO_VERIFICADO`. Tailwind e Lucide têm uso efetivo; completude integral no código, renderização não executada. | `ALINHAMENTO_IMPLEMENTACAO_DOCUMENTO`; nenhum teste. |
| `CODE-CHECK-003` | Persistência usa PostgreSQL; `DOC-012`, `DAE-FND-021`, `TD-002`; `DECISAO_RELATADA_PENDENTE_DE_VERIFICACAO`. | Provider, adapter Neon e chamadas Prisma positivos; exemplo incompatível, zero migration rastreada e nenhuma operação executada; `IMP-EVD-007`–`011`. | `PARCIALMENTE_IMPLEMENTADO`. Integração estática aponta PostgreSQL, mas configuração reproduzível e persistência operacional são partes materiais não confirmadas. | `IMPLEMENTACAO_PARCIAL`; nenhum teste ou conexão. |
| `CODE-CHECK-004` | Serviço de banco relatado é usado; `DOC-012`, `DAE-FND-022`, `TD-003`; `DECISAO_RELATADA_PENDENTE_DE_VERIFICACAO`. | Dependência e `PrismaNeon` integrados; exemplo incompatível, conta, infraestrutura e conectividade externas não avaliadas; `IMP-EVD-007`,`008`. | `PARCIALMENTE_IMPLEMENTADO`. Adapter está conectado ao código, mas uso operacional do serviço Neon não foi comprovado. | `IMPLEMENTACAO_PARCIAL`; nenhum teste ou conexão. |
| `CODE-CHECK-005` | ORM relatado é usado; `DOC-012`, `DAE-FND-022`, `TD-004`; `DECISAO_RELATADA_PENDENTE_DE_VERIFICACAO`. | Manifest, schema, client e chamadas reais `User`; client/migrations ignorados; `IMP-EVD-002`,`007`–`011`. | `IMPLEMENTADO_VERIFICADO`. Prisma está efetivamente no fluxo auth; completude integral quanto ao uso do ORM, não quanto à operação do banco. | `ALINHAMENTO_IMPLEMENTACAO_DOCUMENTO`; nenhum teste. |
| `CODE-CHECK-006` | Aplicação possui implantação relatada; `DOC-012`, `TD-003`,`007`,`013`; atual `DECISAO_RELATADA_PENDENTE_DE_VERIFICACAO`, futuro `EM_AVALIACAO`. | Ausência local de config/workflow; asset padrão não prova deploy; ambiente Vercel externo proibido; `IMP-EVD-012`,`032`. | `NAO_AVALIADO`. A evidência externa é indispensável; completude bloqueada. | `BLOQUEIO_DE_VERIFICACAO`; nenhum teste. |
| `CODE-CHECK-007` | Componente científico separado, se alternativa adotada; `DOC-012`, `DAE-FND-020`,`024`, `TD-009`,`012`; Python `EM_AVALIACAO`, FastAPI `RECOMENDACAO`. | Nenhum manifest/arquivo/serviço/rota/chamada Python; `IMP-EVD-013`. | `NAO_IMPLEMENTADO` no baseline rastreado. Busca material completa; a condição de adoção permanece aberta. | `NAO_COMPARAVEL`; nenhum teste. |
| `CODE-CHECK-008` | Capacidades geoespaciais usam PostGIS; `DOC-012`, `ARCH-024`; `RECOMENDACAO`, não decisão. | Schema, dependências, migration contextual e consultas sem extensão/tipos/índices espaciais; coordenadas são strings; `IMP-EVD-014`. | `NAO_IMPLEMENTADO` no baseline. Busca material completa. | `NAO_COMPARAVEL`; nenhum teste. |
| `CODE-CHECK-009` | Pilha de mapas corresponde a alternativa aprovada; `DOC-012`, `TD-008`,`010`,`011`,`014`; `EM_AVALIACAO`/`PROPOSTA`/`RECOMENDACAO`. | Nenhuma dependência, provider ou componente real; placeholder e links mock; `IMP-EVD-015`,`033`. | `NAO_IMPLEMENTADO` no baseline. Nenhuma alternativa está implementada; nenhuma está aprovada. | `NAO_COMPARAVEL`; nenhum teste. |
| `CODE-CHECK-010` | Autenticação, sessão e autorização têm comportamento implementado; `DOC-011`,`012`, `ARCH-039`,`040`; mecanismo/modelo `NAO_ESPECIFICADO`. | Auth, JWT/cookie e Prisma conectados; autorização, status, tenant, ownership, sanitização e testes incompletos; `IMP-EVD-016`–`018`,`020`,`035`. | `PARCIALMENTE_IMPLEMENTADO`. Autenticação/sessão existem, mas autorização e isolamento materiais não. | `IMPLEMENTACAO_PARCIAL`; nenhum teste. |
| `CODE-CHECK-011` | APIs correspondem a contrato futuro aprovado; `DOC-012`, `ARCH-012`–`018`; propostas históricas e contrato futuro `NAO_ESPECIFICADO`. | Quatro rotas auth inventariadas; áreas/coletas/IHFR, schemas, versão e idempotência ausentes; contrato aprovado inexistente; `IMP-EVD-019`,`020`. | `NAO_AVALIADO`. A implementação pode ser descrita, mas não comparada responsavelmente a contrato futuro inexistente. | `NAO_COMPARAVEL`; nenhum teste. |
| `CODE-CHECK-012` | Modelo corresponde ao futuro modelo aprovado; `DOC-011`,`012`, `DATA-NNN`; fontes históricas mistas e futuro `NAO_ESPECIFICADO`. | 11 models, 10 enums, relações/constraints inventariados; sem modelo aprovado, tenant normativo ou banco aplicado; `IMP-EVD-021`,`022`. | `NAO_AVALIADO`. Definição futura indispensável ausente. | `NAO_COMPARAVEL`; nenhum teste ou validação Prisma executada. |
| `CODE-CHECK-013` | Cálculo corresponde ao contrato científico futuro; `DOC-009`,`010`,`012`; fatos históricos sem autoridade e futuro `NAO_ESPECIFICADO`. | Busca em fontes/scripts/handlers/testes não encontrou motor; apenas representação de saída; `IMP-EVD-024`,`025`. | `NAO_IMPLEMENTADO` no baseline. Ausência do motor é conclusiva localmente; conformidade científica não é avaliável. | `NAO_COMPARAVEL`; nenhum fixture/teste. |
| `CODE-CHECK-014` | Mapas implementam requisitos futuros; `DOC-011`,`012`; requisitos históricos `FATO_DOCUMENTADO`, futuro não aprovado. | Placeholder; sem camada, filtro, sobreposição, CRS, precisão ou teste; `IMP-EVD-015`,`033`. | `NAO_IMPLEMENTADO` no baseline. Busca material completa. | `NAO_COMPARAVEL`; nenhum teste. |
| `CODE-CHECK-015` | Existe offline/sincronização; `DOC-011`,`012`, `PROD-FND-014`; fatos históricos parciais e arquitetura `NAO_ESPECIFICADO`. | Manifest/config/fontes sem SW, storage, fila, sync ou conflito; `IMP-EVD-028`. | `NAO_IMPLEMENTADO` no baseline. Busca material completa. | `NAO_COMPARAVEL`; nenhum teste. |
| `CODE-CHECK-016` | Testes cobrem contratos futuros aprovados; `DOC-012`, `BLG-032`–`034`; estratégia `NAO_ESPECIFICADO`. | Nenhum teste, fixture, configuração, cobertura ou CI; lint falha no tooling; `IMP-EVD-029`,`030`. | `NAO_IMPLEMENTADO` no baseline. Ausência de infraestrutura de testes é completa; contratos futuros continuam não aprovados. | `NAO_COMPARAVEL`; zero teste executável. |
| `CODE-CHECK-017` | Deploy/observabilidade corresponde à política futura; `DOC-012`; política `NAO_ESPECIFICADO`, hospedagem atual relatada. | Sem pipeline, ambientes, logs estruturados, health, rollback; operação externa e política futura indisponíveis; `IMP-EVD-012`,`032`. | `NAO_AVALIADO`. Item combinado depende de política e ambiente externo; observabilidade local é ausente, mas a conclusão integral é bloqueada. | `BLOQUEIO_DE_VERIFICACAO`; nenhum teste. |
| `CODE-CHECK-018` | Variáveis, entradas, resultados e versão são persistidos auditavelmente; `DOC-010`,`012`; fatos históricos e modelo futuro não aprovado. | 17/17 campos e agregados definidos; 0/17 com fluxo, sem snapshot/intermediários/drivers/histórico; `IMP-EVD-023`–`027`. | `PARCIALMENTE_IMPLEMENTADO`. Representação parcial existe; persistência efetiva e auditabilidade material não. | `IMPLEMENTACAO_PARCIAL`; nenhum teste. |

### Comandos, riscos, dependências e destinos

| ID | Comandos executados ou fonte de inspeção | Limitações e riscos | `CON-FND`; `CON-Q`; `DEC-PKG`; `PD` | Destino futuro |
|---|---|---|---|---|
| `001` | `git ls-files`, manifest/lock/config/fontes, `npm ls`; build não executado | Sem navegador/build; risco de confundir código com operação | `CON-FND-058`,`CON-FND-052`–`CON-FND-054`; `CON-Q-048`; `DEC-PKG-007`,`DEC-PKG-010`; `PD-006` | Revisão arquitetural futura, se autorizada |
| `002` | Manifest/config/imports/classes | Sem renderização/a11y dinâmica | `CON-FND-058`,`CON-FND-034`; `CON-Q-039`; `DEC-PKG-007`; `PD-005`,`PD-006` | Critérios UX e arquitetura futura |
| `003` | Schema/config/client/serviços e contexto de migration; sem banco | Exemplo incompatível, migration ignorada, operação externa | `CON-FND-058`,`CON-FND-047`,`CON-FND-051`; `CON-Q-042`,`CON-Q-047`; `DEC-PKG-008`,`DEC-PKG-010`; `PD-004`,`PD-006` | Modelo lógico e ambiente reproduzível futuros |
| `004` | Manifest/client/adapter, `npm ls`; sem rede | Conta/conectividade externas; versões adapter/client desalinhadas | `CON-FND-058`,`CON-FND-052`,`CON-FND-057`; `CON-Q-051`; `DEC-PKG-010`,`DEC-PKG-013`; `PD-006`,`PD-012` | Política de ambientes e arquitetura |
| `005` | Manifest/schema/client/chamadas Prisma; sem banco | Client/migrations ignorados; apenas `User` usado | `CON-FND-058`,`CON-FND-051`; `CON-Q-042`,`CON-Q-047`; `DEC-PKG-008`,`DEC-PKG-010`; `PD-004`,`PD-006` | Modelo lógico e operação futura |
| `006` | Busca local por deploy; nenhum acesso Vercel | Estado externo desconhecido | `CON-FND-058`,`CON-FND-057`; `CON-Q-051`; `DEC-PKG-013`; `PD-006`,`PD-012` | Evidência sanitizada de ambientes/deploy |
| `007` | Busca por extensões, manifests, imports e chamadas | Alternativa condicional não aprovada | `CON-FND-058`,`CON-FND-052`,`CON-FND-056`; `CON-Q-048`,`CON-Q-049`; `DEC-PKG-009`,`DEC-PKG-010`; `PD-008`,`PD-011` | Decisão/ADR apenas se aprovado |
| `008` | Busca no schema, SQL contextual, dependências e queries | Postgres não implica PostGIS | `CON-FND-058`,`CON-FND-049`,`CON-FND-055`; `CON-Q-044`,`CON-Q-050`; `DEC-PKG-008`,`DEC-PKG-011`; `PD-004`,`PD-006`,`PD-013` | Contrato geoespacial e decisão futura |
| `009` | Busca por dependências, imports, providers e componentes | Alternativas abertas; links externos não testados | `CON-FND-058`,`CON-FND-049`,`CON-FND-055`,`CON-FND-056`; `CON-Q-034`,`CON-Q-050`; `DEC-PKG-011`; `PD-007`,`PD-009`,`PD-010`,`PD-013` | Requisitos e ADR de mapas, se aprovados |
| `010` | Inspeção estática de rotas, serviços, middleware e UI | Não houve tentativa de exploração; riscos críticos de acesso/dados | `CON-FND-058`,`CON-FND-031`,`CON-FND-032`,`CON-FND-036`,`CON-FND-038`,`CON-FND-056`; `CON-Q-027`; `DEC-PKG-006`,`DEC-PKG-012`; `PD-003`–`PD-006`,`PD-016` | Requisitos de segurança e matriz de autorização |
| `011` | Árvore de rotas e handlers; sem requests autenticadas | Contrato futuro inexistente; respostas atuais têm risco | `CON-FND-058`,`CON-FND-024`,`CON-FND-052`,`CON-FND-056`; `CON-Q-049`; `DEC-PKG-008`–`DEC-PKG-010`; `PD-003`,`PD-004`,`PD-006`,`PD-011` | Contrato canônico de API |
| `012` | Leitura do schema e contexto local; sem validate/migrate | Futuro modelo ausente, banco não aplicado | `CON-FND-058`,`CON-FND-030`,`CON-FND-038`,`CON-FND-041`,`CON-FND-042`,`CON-FND-047`–`CON-FND-051`; `CON-Q-024`,`CON-Q-025`,`CON-Q-042`–`CON-Q-047`; `DEC-PKG-005`,`DEC-PKG-006`,`DEC-PKG-008`; `PD-004`,`PD-014`–`PD-016` | Modelo conceitual/lógico aprovado |
| `013` | Busca por termos, funções, scripts e testes | Ciência futura não aprovada; motor ausente | `CON-FND-058`,`CON-FND-002`–`CON-FND-026`; `CON-Q-003`,`CON-Q-009`–`CON-Q-021`; `DEC-PKG-002`–`DEC-PKG-004`; `PD-002` | Contrato científico e testes vetoriais futuros |
| `014` | Inspeção do placeholder e busca geoespacial | Requisitos futuros abertos | `CON-FND-058`,`CON-FND-038`,`CON-FND-049`,`CON-FND-055`; `CON-Q-029`,`CON-Q-034`,`CON-Q-044`; `DEC-PKG-006`,`DEC-PKG-007`,`DEC-PKG-011`; `PD-003`–`PD-006`,`PD-013` | Requisitos, UX e contrato geoespacial |
| `015` | Busca por manifest/SW/storage/sync | Ausência limitada ao baseline | `CON-FND-058`,`CON-FND-036`,`CON-FND-037`,`CON-FND-048`,`CON-FND-056`; `CON-Q-030`; `DEC-PKG-008`,`DEC-PKG-012`; `PD-003`,`PD-004`,`PD-006` | Contrato offline/sync futuro |
| `016` | Busca por testes/CI e `npm run lint` | Lint falha antes das fontes; localizadores documentais inconsistentes | `CON-FND-058`,`CON-FND-034`–`CON-FND-037`,`CON-FND-045`,`CON-FND-046`; `CON-Q-036`,`CON-Q-037`,`CON-Q-039`; `DEC-PKG-012`; `PD-002`–`PD-006` | Estratégia de testes após contratos aprovados |
| `017` | Busca local por pipeline/operação; sem deploy | Política futura e ambiente externo indisponíveis; localizadores trocados | `CON-FND-058`,`CON-FND-036`,`CON-FND-052`,`CON-FND-057`; `CON-Q-037`,`CON-Q-051`; `DEC-PKG-012`,`DEC-PKG-013`; `PD-006`,`PD-012` | Política de operação/ambientes e evidência externa |
| `018` | Schema e busca por writes/cálculo/testes; sem banco | Cobertura só estrutural; resultado não reproduzível | `CON-FND-058`,`CON-FND-024`–`CON-FND-026`,`CON-FND-050`; `CON-Q-019`,`CON-Q-020`,`CON-Q-045`,`CON-Q-046`; `DEC-PKG-003`,`DEC-PKG-004`,`DEC-PKG-008`; `PD-002`,`PD-004` | Contrato de persistência e auditabilidade |

Cobertura: 18 de 18, sem lacuna de identificação. Distribuição final: 3 `IMPLEMENTADO_VERIFICADO`, 4 `PARCIALMENTE_IMPLEMENTADO`, 7 `NAO_IMPLEMENTADO` e 4 `NAO_AVALIADO`. Os quatro não avaliados são `006`, `011`, `012` e `017`.

## Tecnologias e infraestrutura

| Tecnologia | Estado documental | Declarada | Configurada | Importada/usada | Integrada | Testada | Dependência externa | Resultado analítico |
|---|---|---|---|---|---|---|---|---|
| Next.js | `TD-001`, decisão relatada confirmada | Sim | Sim, config mínima/App Router | Sim | Sim, frontend e APIs | Não | Não para inspeção estática; fonte/build podem exigir rede | `CODE-CHECK-001` verificado no código |
| React | Recomendação histórica; incluído na pilha relatada | Sim | Via Next | Sim | Sim | Não | Não | `CODE-CHECK-001` verificado no código |
| Tailwind CSS | `TD-005`, decisão relatada confirmada | Sim | Sim, PostCSS/CSS | Sim | Sim | Não | Não | `CODE-CHECK-002` verificado no código |
| Lucide React | `TD-006`, decisão relatada confirmada | Sim | Não aplicável | Sim, dez arquivos | Sim | Não | Não | `CODE-CHECK-002` verificado no código |
| PostgreSQL | `TD-002`, decisão relatada confirmada | Prisma/lock | Sim no schema | Via Prisma/Neon | Parcial | Não | Sim para operação | `CODE-CHECK-003` parcial; operação não confirmada |
| Neon | `TD-003`, decisão relatada confirmada | Sim | Sim no client | Sim | Adapter conectado ao Prisma | Não | Sim | `CODE-CHECK-004` parcial; serviço não confirmado |
| Prisma | `TD-004`, decisão relatada confirmada | Sim | Schema/client | Sim | Chamadas reais em auth | Não | Banco externo para operação | `CODE-CHECK-005` verificado no código |
| Vercel | `TD-007` atual relatado; `TD-013` futuro em avaliação | Não como pacote necessário | Não localizada | Não localizada | Não avaliada | Não | Sim | `CODE-CHECK-006` não avaliado |
| Python | `TD-009`, em avaliação | Não | Não | Não | Não | Não | Não | `CODE-CHECK-007` não implementado no baseline |
| FastAPI | Recomendação histórica, sem decisão | Não | Não | Não | Não | Não | Não | `CODE-CHECK-007` não implementado no baseline |
| PostGIS | Recomendação histórica, sem decisão | Não | Não | Não | Não | Não | Banco externo para operação | `CODE-CHECK-008` não implementado no baseline |
| OpenStreetMap | `TD-008`, em avaliação | Não | Não | Não | Não | Não | Tiles seriam externos | `CODE-CHECK-009` não implementado no baseline |
| Plotly | `TD-010`, em avaliação | Não | Não | Não | Não | Não | Não necessariamente | `CODE-CHECK-009` não implementado no baseline |
| Leaflet | `TD-011`, proposta | Não | Não | Não | Não | Não | Tiles/provedor seriam externos | `CODE-CHECK-009` não implementado no baseline |

O manifest também declara `@prisma/adapter-better-sqlite3`, mas nenhuma importação foi localizada. O adapter Neon resolvido está em 7.7.0, enquanto Prisma CLI/client estão em 7.4.2; `INFERENCIA` — o desalinhamento é risco de compatibilidade a verificar, não defeito confirmado. O exemplo de ambiente aponta outra família de banco e não constitui configuração operacional válida para o fluxo Neon/PostgreSQL observado.

## Frontend, rotas e UX

### Rotas de página

| Rota | Artefato | Estado observável |
|---|---|---|
| `/` | `src/app/page.tsx` | Landing page estática com navegação para login/cadastro. |
| `/login` | `src/app/login/page.tsx` | Formulário client-side ligado a `sign-in`; loading e toast locais. |
| `/register` | `src/app/register/page.tsx` | Formulário client-side ligado a `sign-up`; validação mínima no servidor. |
| `/logout` | `src/app/logout/page.tsx` | Aciona logout pelo contexto. |
| `/dashboard` | `src/app/(private)/dashboard/page.tsx` | Dashboard visual; ação de criação usa alerta, sem fluxo persistente. |
| `/dashboard/collects` | `src/app/(private)/dashboard/collects/page.tsx` | Grid mock de áreas/coletas. |
| `/workspace` | `src/app/(private)/workspace/page.tsx` | Formulário multi-etapas em estado local, sem gravação ou IHFR. |
| `/dashboard/profile` | Link no sidebar, sem `page.tsx` rastreado | Navegação aponta para rota inexistente no baseline. |
| `/dashboard/collects/area/{id}` | Links nos cards/histórico, sem rota dinâmica rastreada | Navegação aponta para rota inexistente no baseline. |

Há quatro layouts: raiz, privado, dashboard e workspace. Há dez componentes de feature/compartilhados/contexto, classes responsivas Tailwind, `lang="pt-BR"`, metadata, imagens com `alt`, toasts e algum estado de carregamento no fluxo auth. Não foram localizados gráficos nem um mapa funcional.

`EVIDENCIA_IMPLEMENTACAO` — Dashboard, histórico, coletas e workspace usam arrays, textos ou estado mock; ações centrais usam `alert`. O componente de mapas renderiza uma área cinza com ícone. Links externos de mock para mapas não equivalem a provider, tiles, camada ou geoprocessamento.

`EVIDENCIA_IMPLEMENTACAO` — Acessibilidade estática é parcial: labels não estão associados por `htmlFor`/`id`, botões somente com ícone não possuem nome acessível localizado, há elemento clicável que não é botão, e não foram encontrados atributos ARIA. Não existem `loading.tsx`, `error.tsx` ou `not-found.tsx`. Esta inspeção não executou navegador, tecnologia assistiva nem comparação visual com Figma; a ausência de Figma não foi tratada como bloqueio.

## APIs, autenticação e permissões

### Rotas implementadas

| Método e rota | Handler/serviço | Uso pelo frontend | Validação/erro observado |
|---|---|---|---|
| `POST /api/auth/sign-up` | `sign-up/route.ts` → `AuthService.signUp` → Prisma | Cadastro | Apenas presença básica; corpo inteiro segue para o serviço; erros genéricos. |
| `POST /api/auth/sign-in` | `sign-in/route.ts` → `AuthService.signIn` → Prisma | Login | Credenciais verificadas; sem schema formal/rate limit localizado. |
| `POST /api/auth/me` | `me/route.ts` → `requireAuth` | Contexto e layout privado | JWT e usuário consultados; esta rota omite o campo de senha. |
| `POST /api/auth/logout` | `logout/route.ts` → limpeza de cookie | Logout | Limpa cookie; sem estado persistente de revogação. |

Não há server actions. Não foram localizados endpoints para laboratórios, membros, áreas, coletas, módulos ambientais, diagnóstico ou cálculo; tampouco versionamento de API, idempotência, schema de payload ou serialização comum de erro. As rotas atuais diferem analiticamente das propostas históricas `ARCH-012`–`018`, mas essas propostas não formam contrato aprovado e a diferença não é não conformidade normativa.

### Controles e riscos observados

| Observação | Classificação e consequência analítica |
|---|---|
| O cadastro passa o JSON recebido e espalha os dados no `prisma.user.create`; o model aceita campos de papel, status e privilégio. | `EVIDENCIA_IMPLEMENTACAO`; `INFERENCIA` — mass assignment permite tentativa não autenticada de gravar campos adicionais de privilégio/status. Risco crítico, não explorado. |
| Cadastro e login devolvem o objeto Prisma completo; somente `/me` omite senha. | `EVIDENCIA_IMPLEMENTACAO`; o hash de senha integra a resposta desses dois fluxos. Risco crítico de exposição, sem reprodução de dado. |
| Cadastro cria sessão para usuário cujo default é pendente; login recusa dois estados, mas `requireAuth` não revalida status. | `EVIDENCIA_IMPLEMENTACAO`; `INFERENCIA` — políticas de ativação e invalidação são incompletas e token já emitido pode sobreviver a mudança de status. |
| O emissor JWT contém fallback literal rastreado, enquanto o middleware depende somente da variável de ambiente. | `EVIDENCIA_IMPLEMENTACAO`; risco de segredo previsível e de comportamento inconsistente quando a variável falta. O valor não é reproduzido. |
| Cookie é HTTP-only, secure em produção, SameSite lax e expira em sete dias; não há store/revogação localizada. | `EVIDENCIA_IMPLEMENTACAO`; sessão stateless parcial, sem conclusão de segurança normativa. |
| `src/proxy.ts` testa apenas a existência do cookie para rotas privadas. | `EVIDENCIA_IMPLEMENTACAO`; cookie arbitrário pode atravessar o proxy, enquanto a validação posterior é assíncrona. |
| `requireAdmin` consulta `isAdmin`, não tem consumidor localizado e o schema também possui `role` sem invariante entre ambos. | `EVIDENCIA_IMPLEMENTACAO`; autorização administrativa e coerência de papéis são parciais. |
| Relações de usuário, laboratório, área e coleta não têm constraint composta nem serviço que confirme membership/ownership. | `EVIDENCIA_IMPLEMENTACAO`; isolamento por recurso/laboratório não foi localizado. |
| O script de superadministrador registra chave root inválida, mas não interrompe antes da criação. | `EVIDENCIA_IMPLEMENTACAO`; risco crítico em comando não executado. |
| Exemplo de ambiente e comentário de login contêm valores de credencial previsíveis/aparentes. | `EVIDENCIA_IMPLEMENTACAO`; risco de higiene de segredo. Nenhum valor foi copiado. |

`CODE-CHECK-010` é, portanto, parcial: autenticação e sessão existem, mas autorização, status, isolamento, proteção de respostas e testes são partes materiais ausentes. A inspeção não usou credenciais, não criou usuário, não fez request nem acessou banco.

## Dados, Prisma e persistência

### Models

| Model | Finalidade observável | Chaves/constraints e relações | Operações localizadas |
|---|---|---|---|
| `User` | Conta, identidade e flags de acesso | UUID; email unique; relações com laboratório, vínculo, área e coleta | Create, find e update em auth/user service |
| `Coordinates` | Latitude/longitude textuais | UUID; 1:N com área | Nenhuma |
| `LaboratoryRoom` | Laboratório/sala, proprietário e código | UUID; FK user; `accessCode` não unique | Nenhuma |
| `ResearchersLinked` | Junção usuário↔laboratório | PK composta por duas FKs | Nenhuma |
| `CollectionArea` | Área, endereço, uso da terra e vínculos | UUID; FKs user/lab/coordinates | Nenhuma |
| `CollectionData` | Evento/conjunto de coleta | UUID; FKs area/user; relações com módulos e diagnóstico | Nenhuma |
| `IHFRDiagnosis` | Resultado agregado e componentes | UUID; FK collectionData; sem timestamp/unique | Nenhuma |
| `WaterData` | Cinco variáveis de água | UUID; FK collectionData unique | Nenhuma |
| `SoilData` | Cinco variáveis de solo | UUID; FK collectionData unique | Nenhuma |
| `VegetationData` | Quatro variáveis de vegetação | UUID; FK collectionData unique | Nenhuma |
| `TerrainData` | Densidade, elevação e declividade | UUID; FK collectionData unique | Nenhuma |

### Enums

| Enum | Valores/uso resumido |
|---|---|
| `UserRole` | Quatro papéis técnicos de conta |
| `UserStatus` | Ativo, inativo, pendente e bloqueado |
| `LandType` | Oito categorias de uso da terra |
| `IHFRClass` | Baixo, moderado, alto e crítico |
| `LevelBasicDefault` | Baixo, moderado e alto; reutilizado em variáveis e qualidade |
| `WaterSourceType` | Seis fontes de água |
| `WaterAvailability` | Permanente, sazonal e escassa |
| `SalinityIndicator` | Nenhuma, suspeita e confirmada |
| `SoilTexture` | Arenosa, média e argilosa |
| `ErosionSigns` | Nenhum, laminar e sulcos/voçorocas |

Alguns tokens dos enums de água, salinidade e erosão contêm grafia divergente do vocabulário documental. `INFERENCIA` — isso cria risco de contrato/serialização, mas não autoriza correção nem define o termo normativo.

### Relações, integridade e migrations

Foram contabilizadas 13 arestas: quatro de `User`, uma de `Coordinates`, duas de `LaboratoryRoom`, uma de `CollectionArea` e cinco de `CollectionData`. Há cinco `@unique` — email e as quatro FKs ambientais — e uma `@@id` composta. Não há índice normal explícito, transação, deleção, cascade declarado no schema, soft delete uniforme, retenção ou isolamento de tenant.

Os quatro módulos ambientais aparecem como listas em `CollectionData`, mas cada FK filha é unique. `EVIDENCIA_IMPLEMENTACAO` — a constraint limita a cardinalidade efetiva a no máximo um registro de cada tipo, embora a propriedade parental seja plural. O schema permite múltiplos diagnósticos por coleta sem timestamp próprio ou regra de ordenação. `LaboratoryRoom.accessCode` não é unique. Vínculos user/lab/area/collection não possuem constraint composta que assegure coerência de membership/ownership.

Nenhuma migration é rastreada. Uma migration local ignorada declara provider PostgreSQL e contém 11 tabelas, 10 enums, 5 índices unique e 13 FKs, com deletes restritos e updates em cascade; ela é contexto, não baseline. O client gerado também é ignorado e importado pelo código rastreado; uma clonagem exige geração. O script `build` gera o client, mas não aplica migrations.

Só foram localizadas leituras/escritas de `User`; os outros dez models não possuem repositório, handler ou serviço rastreado. Não houve validação de schema, migration, seed, consulta, transação ou conexão.

## Cálculo do IHFR e 17 variáveis científicas

`EVIDENCIA_IMPLEMENTACAO` — Não há entrada de cálculo, função, fórmula, pesos, normalização, transformação, clamp, intervalos, classificação, arredondamento, tratamento de missing, cálculo de `data_quality`, calibração, drivers ou recomendações. `IHFRDiagnosis` representa campos de saída, mas nenhum código os calcula ou grava.

### Cobertura individual 17 de 17

Para todas as linhas, “validação” significa apenas tipo, opcionalidade ou enum do Prisma; não há faixa/unidade de runtime. Não há transformação, participação no cálculo, fluxo de escrita nem teste localizado. O resultado comum é `DEFINIDO_SEM_FLUXO`.

| ID e nome documental | Campo e tipo no schema | Validação estrutural | Transformação/cálculo | Persistência/teste | Resultado |
|---|---|---|---|---|---|
| `VAR-001` `water_source_type` | `WaterData.waterSourceType: WaterSourceType` | Enum obrigatório | Nenhuma | Definida; sem write/teste | `DEFINIDO_SEM_FLUXO` |
| `VAR-002` `has_spring` | `WaterData.hasSpring: Boolean` | Boolean obrigatório | Nenhuma | Definida; sem write/teste | `DEFINIDO_SEM_FLUXO` |
| `VAR-003` `well_depth_m` | `WaterData.wellDepth_m: Float?` | Float opcional | Nenhuma | Definida; sem write/teste | `DEFINIDO_SEM_FLUXO` |
| `VAR-004` `water_availability` | `WaterData.waterAvailability: WaterAvailability` | Enum obrigatório | Nenhuma | Definida; sem write/teste | `DEFINIDO_SEM_FLUXO` |
| `VAR-005` `salinity_indicator` | `WaterData.salinityIndicator: SalinityIndicator?` | Enum opcional | Nenhuma | Definida; sem write/teste | `DEFINIDO_SEM_FLUXO` |
| `VAR-006` `infiltration_rate_mm_h` | `SoilData.infiltrationRate_mm_h: Float` | Float obrigatório | Nenhuma | Definida; sem write/teste | `DEFINIDO_SEM_FLUXO` |
| `VAR-007` `compaction_level` | `SoilData.compactionLevel: LevelBasicDefault` | Enum obrigatório | Nenhuma | Definida; sem write/teste | `DEFINIDO_SEM_FLUXO` |
| `VAR-008` `soil_texture` | `SoilData.soilTexture: SoilTexture` | Enum obrigatório | Nenhuma | Definida; sem write/teste | `DEFINIDO_SEM_FLUXO` |
| `VAR-009` `erosion_signs` | `SoilData.erosionSigns: ErosionSigns` | Enum obrigatório | Nenhuma | Definida; sem write/teste | `DEFINIDO_SEM_FLUXO` |
| `VAR-010` `soil_exposed_percent` | `SoilData.soilExposedPercent: Float?` | Float opcional | Nenhuma | Definida; sem write/teste | `DEFINIDO_SEM_FLUXO` |
| `VAR-011` `vegetation_cover_percent` | `VegetationData.vegetationCoverPercent: Float` | Float obrigatório | Nenhuma | Definida; sem write/teste | `DEFINIDO_SEM_FLUXO` |
| `VAR-012` `fragmentation_level` | `VegetationData.fragmentationLevel: LevelBasicDefault` | Enum obrigatório | Nenhuma | Definida; sem write/teste | `DEFINIDO_SEM_FLUXO` |
| `VAR-013` `has_riparian_app` | `VegetationData.hasRiparian_app: Boolean?` | Boolean opcional | Nenhuma | Definida; sem write/teste | `DEFINIDO_SEM_FLUXO` |
| `VAR-014` `landscape_degradation` | `VegetationData.landscapeDegradation: LevelBasicDefault` | Enum obrigatório | Nenhuma | Definida; sem write/teste | `DEFINIDO_SEM_FLUXO` |
| `VAR-015` `slope_percent` | `TerrainData.slopePercent: Float?` | Float opcional | Nenhuma | Definida; sem write/teste | `DEFINIDO_SEM_FLUXO` |
| `VAR-016` `land_use_type` | `CollectionArea.landType: LandType` | Enum obrigatório | Nenhuma | Definida fora da coleta; sem write/teste | `DEFINIDO_SEM_FLUXO`; correspondência `INFERENCIA` |
| `VAR-017` densidade de drenagem | `TerrainData.drainage_density: Float?` | Float opcional | Nenhuma | Definida; sem write/teste | `DEFINIDO_SEM_FLUXO` |

Cobertura nominal de schema: 17/17. Cobertura de fluxo de entrada/persistência localizado: 0/17. Cobertura de transformação/cálculo: 0/17. Cobertura por testes: 0/17. `elevation_m` é campo adicional e não foi contado como uma das 17 variáveis.

### Persistência e auditabilidade do diagnóstico

| Elemento | Estado observado |
|---|---|
| Entradas brutas | Definidas em tabelas modulares, sem fluxo de gravação localizado |
| Snapshot imutável das entradas | Não localizado |
| Valores normalizados | Não localizados |
| Scores por variável | Não localizados |
| Resultado agregado | `ihfrScore` definido; sem fluxo de gravação |
| Componentes | Quatro scores de dimensão definidos; sem fluxo de gravação |
| Classe | `ihfrClass` definida; sem classe explícita de insuficiência |
| Qualidade | `dataQuality` definida via enum genérico; sem cálculo |
| Drivers | Não localizados |
| Recomendações | Não localizadas |
| Explicação | `explanationAI` opcional, sem fluxo e sem equivalência assumida a drivers/recomendações |
| Versão | `algorithmVersion` com default; sem vínculo imutável a parâmetros/checksum |
| Autor e momento do cálculo | Não localizados no diagnóstico; vínculo indireto à coleta não substitui snapshot |
| Recálculo, invalidação e histórico | Não localizados; múltiplos diagnósticos são possíveis sem ordenação temporal própria |

O default de versão no schema e o vocabulário de qualidade diferem dos rótulos históricos. Isso é comparação analítica, não escolha de versão ou enum corretos.

Os conflitos clamp versus bloqueio e `data_quality` high versus medium para quatro de cinco campos essenciais permanecem `PENDENCIA_DE_DECISAO`. A implementação não contém validação ou motor que escolha entre eles e, portanto, não os resolve.

## Mapas, geoprocessamento e offline

| Tema | Evidência | Estado |
|---|---|---|
| Biblioteca/provider/tiles | Nenhuma dependência ou import Leaflet, OSM, Plotly ou equivalente; links mock externos não contam | `NAO_IMPLEMENTADO` no baseline |
| Visualização de mapa | `dashboard/maps.tsx` é placeholder visual | `NAO_IMPLEMENTADO` materialmente |
| Geometrias/CRS | Latitude/longitude são strings; sem geometry, GeoJSON, CRS, precisão ou proveniência | `NAO_IMPLEMENTADO` |
| PostGIS/consultas | Sem extensão, tipo, índice ou query espacial | `NAO_IMPLEMENTADO` |
| Camadas/filtros/sobreposição | Não localizados | `NAO_IMPLEMENTADO` |
| Geoprocessamento/cache | Não localizados | `NAO_IMPLEMENTADO` |
| Web manifest/service worker | Não localizados | `NAO_IMPLEMENTADO` |
| Storage/fila/sincronização/conflito | IndexedDB, localStorage, fila, sync e resolução de conflito não localizados | `NAO_IMPLEMENTADO` |

Nenhuma requisição a tile, link de mock ou serviço externo foi feita. As alternativas `TD-008`–`011`,`014` permanecem abertas/propostas; a ausência não as rejeita nem constitui divergência normativa.

## Testes, qualidade, build e deploy

### Scripts existentes

| Script | Comando | Estado nesta auditoria |
|---|---|---|
| `dev` | `next dev` | Não executado; servidor persistente e navegador não eram necessários. |
| `build` | `npx prisma generate && next build` | Não executado; gera client ignorado e o uso de fonte Google pode exigir rede. |
| `start` | `next start` | Não executado; depende de build e inicia servidor persistente. |
| `create-super-admin` | `tsx ./src/app/api/server/scripts/superadmin.ts` | Não executado; exige segredo e gravação em banco. |
| `lint` | `eslint` | Executado; falhou no tooling antes de analisar fontes. |

Não existem scripts de typecheck, teste, cobertura, validação de schema ou formatação. Não existem suítes, fixtures, configuração de runner ou CI rastreadas.

### Comandos técnicos executados

| Comando ou grupo | Resultado | Efeito observado |
|---|---|---|
| `git --version`, `node --version`, `npm --version`, `npx --version`, `python3 --version`, `pip --version`, buscas de executáveis | Versões registradas; ferramentas ausentes identificadas | Nenhum delta técnico |
| binários locais de Next, ESLint, TypeScript e Prisma | Versões 16.1.6, 10.0.2, 5.9.3 e 7.4.2 | Prisma carregou config/schema, sem conexão |
| `npm run` | Listou cinco scripts | Nenhum delta |
| `npm ls --depth=0` | Sucesso; dependências raiz instaladas e uma dependência extraneous | Nenhum delta |
| `npm ls eslint eslint-plugin-react eslint-config-next --depth=2` | `ELSPROBLEMS`; ESLint 10 inválido para peers transitivos aceitos até ESLint 9 | Confirma causa do bloqueio do lint; log npm fora do sandbox não foi gravado |
| `tsx --version` | Imprimiu 4.21.0 e depois falhou ao criar IPC local por `EPERM` | Nenhum delta; versão ainda observável |
| `npm run lint` | Falha: regra React carregada por `eslint-config-next` chamou API incompatível do contexto ESLint | Nenhuma fonte analisada; nenhuma correção feita |

Typecheck não foi executado porque não há script definido. Testes e cobertura não foram executados porque não existem comandos ou suítes. `prisma validate` não foi executado porque não é script do projeto e a política desta etapa restringiu execução aos comandos definidos e seguros. Build não foi usado como substituto por seus efeitos gerados e provável dependência de rede. Deploy, banco, migration e seed foram proibidos.

Não há `vercel.json`, `.github/`, Dockerfile, workflow, instrumentação, health check, rollback ou configuração de observabilidade. Logs `console` pontuais não constituem observabilidade estruturada. A operação Vercel, Neon e PostgreSQL permanece não avaliada.

## Comparação documentação × implementação

| Relação | Assunto | Classificação | Base e limite |
|---|---|---|---|
| `CMP-001` | Next.js/React | `ALINHAMENTO_IMPLEMENTACAO_DOCUMENTO` | `CODE-CHECK-001`; código integrado, build não executado. |
| `CMP-002` | Tailwind/Lucide | `ALINHAMENTO_IMPLEMENTACAO_DOCUMENTO` | `CODE-CHECK-002`; configuração/imports/usos localizados. |
| `CMP-003` | PostgreSQL | `IMPLEMENTACAO_PARCIAL` | `CODE-CHECK-003`; integração estática, exemplo/migrations/operação incompletos. |
| `CMP-004` | Neon | `IMPLEMENTACAO_PARCIAL` | `CODE-CHECK-004`; adapter conectado, serviço externo não confirmado. |
| `CMP-005` | Prisma | `ALINHAMENTO_IMPLEMENTACAO_DOCUMENTO` | `CODE-CHECK-005`; schema, client e queries reais. |
| `CMP-006` | Vercel atual | `BLOQUEIO_DE_VERIFICACAO` | `CODE-CHECK-006`; evidência local insuficiente e ambiente externo proibido. |
| `CMP-007` | Python/FastAPI | `NAO_COMPARAVEL` | `CODE-CHECK-007`; alternativa/recomendação não aprovada, ausente no baseline. |
| `CMP-008` | PostGIS | `NAO_COMPARAVEL` | `CODE-CHECK-008`; recomendação não aprovada, ausente no baseline. |
| `CMP-009` | OSM/Plotly/Leaflet | `NAO_COMPARAVEL` | `CODE-CHECK-009`; alternativas abertas, nenhuma implementação. |
| `CMP-010` | Auth/sessão/autorização | `IMPLEMENTACAO_PARCIAL` | `CODE-CHECK-010`; auth existe, autorização/isolamento materiais não. |
| `CMP-011` | Contrato de API futuro | `NAO_COMPARAVEL` | `CODE-CHECK-011`; contrato aprovado inexistente; API atual inventariada separadamente. |
| `CMP-012` | Modelo de dados futuro | `NAO_COMPARAVEL` | `CODE-CHECK-012`; modelo aprovado inexistente. |
| `CMP-013` | Contrato científico futuro | `NAO_COMPARAVEL` | `CODE-CHECK-013`; motor ausente e contrato não aprovado. |
| `CMP-014` | Requisitos futuros de mapa | `NAO_COMPARAVEL` | `CODE-CHECK-014`; implementação ausente, requisito não aprovado. |
| `CMP-015` | Offline/sync | `NAO_COMPARAVEL` | `CODE-CHECK-015`; históricos parciais não formam obrigação aprovada. |
| `CMP-016` | Cobertura por testes | `NAO_COMPARAVEL` | `CODE-CHECK-016`; testes ausentes, contratos futuros não aprovados. |
| `CMP-017` | Política de deploy/observabilidade | `BLOQUEIO_DE_VERIFICACAO` | `CODE-CHECK-017`; política futura e ambiente externo indisponíveis. |
| `CMP-018` | Persistência auditável IHFR | `IMPLEMENTACAO_PARCIAL` | `CODE-CHECK-018`; schema parcial, nenhum fluxo. |
| `CMP-019` | Schema atual versus modelos históricos | `DIVERGENCIA_DOCUMENTACAO_IMPLEMENTACAO` | Estrutura, cardinalidade, enums e versão diferem; comparação analítica entre implementação e fontes históricas/propostas, nunca divergência normativa. |
| `CMP-020` | Detalhes de JWT/cookie e fluxos auth | `IMPLEMENTACAO_SEM_COBERTURA_DOCUMENTAL` | Código material mais específico que as alegações; existência não o aprova. |
| `CMP-021` | CLI de superadministrador | `IMPLEMENTACAO_SEM_COBERTURA_DOCUMENTAL` | Script material sem alegação documental correspondente localizada; não executado. |

Síntese de 21 relações: 3 alinhamentos, 4 implementações parciais, 1 divergência analítica, 0 alegações atuais não localizadas, 2 implementações sem cobertura documental, 9 não comparáveis e 2 bloqueios de verificação. Propostas não implementadas não foram tratadas como divergência; roadmap futuro não foi tratado como obrigação.

## Achados `IMP-FND-NNN`

### Catálogo e evidência

| ID e título | Tipo; classificação; camada | Descrição neutra | Evidências e localizadores |
|---|---|---|---|
| `IMP-FND-001` — pilha full-stack localizada | `ALINHAMENTO_IMPLEMENTACAO_DOCUMENTO`; `EVIDENCIA_IMPLEMENTACAO`; frontend | Next.js e React formam a aplicação rastreada. | `IMP-EVD-002`–`004`; manifest, configs e `src/app/**`; `CODE-CHECK-001`. |
| `IMP-FND-002` — UI relatada localizada | `ALINHAMENTO_IMPLEMENTACAO_DOCUMENTO`; `EVIDENCIA_IMPLEMENTACAO`; frontend | Tailwind e Lucide estão configurados/usados. | `IMP-EVD-005`,`006`; PostCSS, CSS e imports; `CODE-CHECK-002`. |
| `IMP-FND-003` — PostgreSQL/Neon somente parciais | `IMPLEMENTACAO_PARCIAL`; `EVIDENCIA_IMPLEMENTACAO`; dados/infra | Provider e adapter estão conectados, mas exemplo, migrations e operação não fecham evidência reproduzível. | `IMP-EVD-007`–`011`; schema/config/client; `CODE-CHECK-003`,`004`. |
| `IMP-FND-004` — Prisma usado, bootstrap não rastreado | `IMPLEMENTACAO_PARCIAL`; `EVIDENCIA_IMPLEMENTACAO`; dados/tooling | ORM é usado em `User`; client e migration estão ignorados e versões adapter/client diferem. | `IMP-EVD-008`–`011`; `.gitignore`, serviços e contexto local; `CODE-CHECK-005`. |
| `IMP-FND-005` — autenticação e sessão parciais | `IMPLEMENTACAO_PARCIAL`; `EVIDENCIA_IMPLEMENTACAO`; segurança | Cadastro/login/me/logout, bcrypt, JWT e cookie existem, sem ciclo/status/revogação completos. | `IMP-EVD-016`,`017`,`035`; rotas/serviços; `CODE-CHECK-010`. |
| `IMP-FND-006` — autorização e isolamento incompletos | `IMPLEMENTACAO_PARCIAL`; `EVIDENCIA_IMPLEMENTACAO`; segurança/dados | Proxy só vê cookie; admin não é consumido; tenant, membership e ownership não são garantidos. | `IMP-EVD-017`,`018`,`022`,`035`; proxy/middlewares/schema; `CODE-CHECK-010`,`012`. |
| `IMP-FND-007` — API restrita e validação insuficiente | `IMPLEMENTACAO_PARCIAL`; `EVIDENCIA_IMPLEMENTACAO`; API | Só quatro rotas auth; corpo de cadastro não é filtrado e respostas de dois fluxos não são sanitizadas. | `IMP-EVD-019`,`020`,`035`; routes/auth service; `CODE-CHECK-010`,`011`. |
| `IMP-FND-008` — modelo atual diverge de estruturas históricas | `DIVERGENCIA_DOCUMENTACAO_IMPLEMENTACAO`; `INFERENCIA`; dados | 11 models/10 enums, granularidade, cardinalidades e versão diferem dos modelos históricos; não há norma aprovada. | `IMP-EVD-021`,`022`,`024`; schema; `CODE-CHECK-012`,`018`. |
| `IMP-FND-009` — 17 variáveis apenas definidas | `IMPLEMENTACAO_PARCIAL`; `EVIDENCIA_IMPLEMENTACAO`; ciência/dados | Todas têm campo estrutural, nenhuma tem fluxo, faixa, unidade, transformação ou teste. | `IMP-EVD-023`,`026`; cinco models; `CODE-CHECK-018`. |
| `IMP-FND-010` — motor IHFR ausente | `NAO_COMPARAVEL`; `EVIDENCIA_IMPLEMENTACAO`; algoritmo | Nenhum código de fórmula/normalização/classe/qualidade/recomendação foi localizado. | `IMP-EVD-025`; busca delimitada; `CODE-CHECK-013`. |
| `IMP-FND-011` — auditabilidade parcial | `IMPLEMENTACAO_PARCIAL`; `EVIDENCIA_IMPLEMENTACAO`; dados/algoritmo | Agregado/componentes/qualidade/versão estão definidos; snapshot, intermediários, drivers e trilha não. | `IMP-EVD-024`,`027`; `IHFRDiagnosis`; `CODE-CHECK-018`. |
| `IMP-FND-012` — mapas/geoespacial ausentes | `NAO_COMPARAVEL`; `EVIDENCIA_IMPLEMENTACAO`; frontend/dados | Placeholder substitui mapa; não há pilha, CRS, geometrias ou PostGIS. | `IMP-EVD-014`,`015`,`033`; mapa/schema; `CODE-CHECK-008`,`009`,`014`. |
| `IMP-FND-013` — offline ausente | `NAO_COMPARAVEL`; `EVIDENCIA_IMPLEMENTACAO`; frontend/infra | Nenhum mecanismo local, fila, sincronização ou conflito. | `IMP-EVD-028`; busca delimitada; `CODE-CHECK-015`. |
| `IMP-FND-014` — testes/CI ausentes e lint bloqueado | `NAO_COMPARAVEL`; `EVIDENCIA_IMPLEMENTACAO`; qualidade | Não há testes/CI; lint falha na compatibilidade de tooling antes das fontes. | `IMP-EVD-029`–`031`; manifest e comandos; `CODE-CHECK-016`. |
| `IMP-FND-015` — deploy/operação não verificáveis | `BLOQUEIO_DE_VERIFICACAO`; `EVIDENCIA_IMPLEMENTACAO`; operação | Sem evidência local suficiente; política futura e ambientes externos indisponíveis. | `IMP-EVD-012`,`032`; busca local; `CODE-CHECK-006`,`017`. |
| `IMP-FND-016` — frontend de protótipo e UX parcial | `IMPLEMENTACAO_PARCIAL`; `EVIDENCIA_IMPLEMENTACAO`; frontend/UX | Mocks/alertas e rotas ausentes limitam fluxos; acessibilidade estática é parcial. | `IMP-EVD-033`,`034`; dashboard/workspace/componentes; `CODE-CHECK-001`,`002`,`010`,`014`. |
| `IMP-FND-017` — controles críticos de identidade | `IMPLEMENTACAO_SEM_COBERTURA_DOCUMENTAL`; `EVIDENCIA_IMPLEMENTACAO` + `INFERENCIA`; segurança | Mass assignment, hash em resposta, fallback sensível, flags divergentes e CLI que segue após chave inválida criam riscos críticos. | `IMP-EVD-020`,`035`; auth/schema/superadmin; `CODE-CHECK-010`,`011`. |
| `IMP-FND-018` — localizadores 016/017 inconsistentes | `INCONSISTENCIA_DOCUMENTAL`; `FATO_DOCUMENTADO`; governança | O catálogo troca referências de testes e deploy/observabilidade. | `IMP-EVD-036`; `DOC-013` e `DOC-012`, `ARCH-043`,`044`,`048`,`049`. |

### Impacto, autoridade e destino

| ID | Alegação/fontes; vínculos | Impacto e risco | Bloqueio; autoridade necessária | Estado; destino; limitações |
|---|---|---|---|---|
| `001` | `TD-001`, `DOC-012`; `CON-FND-052`–`054`,`058`; `PD-006` | `INFORMATIVO`; risco de inferir operação/norma | Nenhum de execução; arquitetura para norma | `REGISTRADO_EM_REVISAO`; futura revisão arquitetural; sem build |
| `002` | `TD-005`,`006`; `CON-FND-034`,`058`; `PD-005`,`006` | `INFORMATIVO`; renderização não confirmada | UX/arquitetura para norma | `REGISTRADO_EM_REVISAO`; critérios UX; sem navegador |
| `003` | `TD-002`,`003`; `CON-FND-051`,`052`,`057`,`058`; `PD-004`,`006`,`012` | `MEDIO`; configuração não reproduzível/operação desconhecida | Verificação externa e normatização de ambiente | `REGISTRADO_EM_REVISAO`; política de dados/ambientes; sem banco/rede |
| `004` | `TD-004`; `CON-FND-047`,`051`,`058`; `PD-004`,`006` | `ALTO`; clone não reproduz bootstrap integralmente | Correção futura e modelo lógico | `REGISTRADO_EM_REVISAO`; engenharia futura; contexto ignorado não é baseline |
| `005` | `ARCH-039`; `CON-FND-033`,`036`,`058`; `PD-003`–`006` | `ALTO`; ciclo/status/revogação incompletos | Requisitos de segurança e correção futura | `REGISTRADO_EM_REVISAO`; contrato auth; não executado |
| `006` | `ARCH-040`; `CON-FND-031`,`032`,`038`,`041`,`042`,`056`,`058`; `PD-003`–`006`,`014`–`016` | `CRITICO`; acesso/isolamento indevido | Produto, dados e segurança; correção futura | `REGISTRADO_EM_REVISAO`; matriz de autorização/modelo; sem exploração |
| `007` | `ARCH-012`–`018`; `CON-FND-024`,`032`,`052`,`056`,`058`; `PD-003`,`004`,`006`,`011` | `ALTO`; superfície incompleta e resposta/entrada inseguras | Contrato API e correção futura | `REGISTRADO_EM_REVISAO`; API futura; nenhum request |
| `008` | `DOC-011`,`012`; `CON-FND-030`,`038`,`041`,`042`,`047`–`051`; `PD-004`,`014`–`016` | `ALTO`; semântica/cardinalidade instáveis | Autoridade de dados; normatização | `REGISTRADO_EM_REVISAO`; modelo conceitual/lógico; fontes históricas não normativas |
| `009` | `DOC-010`,`012`; `CON-FND-002`–`010`,`024`,`026`; `PD-002`,`004` | `ALTO`; captura/cálculo não reproduzíveis | Ciência/dados e implementação futura | `REGISTRADO_EM_REVISAO`; contrato de entrada/persistência; só schema |
| `010` | `DOC-009`,`010`,`012`; `CON-FND-002`–`025`; `PD-002` | `CRITICO`; produto não calcula IHFR | Ciência e implementação futura | `REGISTRADO_EM_REVISAO`; contrato/motor futuro; ausência limitada ao baseline |
| `011` | `DOC-010`,`012`; `CON-FND-024`–`026`,`050`; `PD-002`,`004` | `CRITICO`; resultado não reproduzível/auditável | Ciência/dados; modelo e implementação | `REGISTRADO_EM_REVISAO`; persistência/auditoria; sem banco |
| `012` | `DOC-011`,`012`, `TD-008`,`010`,`011`,`014`; `CON-FND-038`,`049`,`055`,`056`; `PD-004`,`006`,`007`,`009`,`010`,`013` | `ALTO`; fluxo geoespacial inexistente | Produto/dados/UX/arquitetura | `REGISTRADO_EM_REVISAO`; requisitos/ADR futuros; alternativas abertas |
| `013` | `DOC-011`,`012`; `CON-FND-036`,`037`,`048`,`056`; `PD-003`,`004`,`006` | `ALTO`; resiliência/coleta offline inexistentes | Produto/dados/arquitetura | `REGISTRADO_EM_REVISAO`; contrato offline; baseline apenas |
| `014` | `DOC-012`; `CON-FND-034`–`037`,`045`,`046`,`058`; `PD-002`–`006` | `ALTO`; nenhuma regressão/aceite automatizado e lint indisponível | Contratos aprovados e correção de tooling futuras | `REGISTRADO_EM_REVISAO`; estratégia de qualidade; lint não alcançou fontes |
| `015` | `TD-007`,`013`; `CON-FND-036`,`052`,`057`,`058`; `PD-006`,`012` | `ALTO`; estado operacional desconhecido | Acesso externo e autoridade de arquitetura/operação | `REGISTRADO_EM_REVISAO`; ambientes/deploy; sem rede/credencial |
| `016` | `DOC-011`; `CON-FND-027`–`035`,`044`; `PD-003`,`005`,`017` | `MEDIO`; fluxos e acessibilidade incompletos | Produto/UX e correção futura | `REGISTRADO_EM_REVISAO`; requisitos/UX; sem navegador/Figma |
| `017` | Sem cobertura documental específica; `CON-FND-032`,`036`,`058`; `PD-003`–`006`,`016` | `CRITICO`; elevação/exposição/segredo/admin | Segurança/produto e correção futura | `REGISTRADO_EM_REVISAO`; triagem futura; valores sanitizados, sem exploração |
| `018` | `DOC-013`, `DOC-012`; `CON-FND-058`; `PD-006` | `MEDIO`; rastreabilidade equivocada | Revisão documental futura, fora deste catálogo aprovado | `REGISTRADO_EM_REVISAO`; correção documental futura; não alterado nesta etapa |

Distribuição por impacto: 4 críticos, 9 altos, 3 médios e 2 informativos. Todos os 18 achados estão `REGISTRADO_EM_REVISAO`; nenhum foi corrigido ou promovido a decisão.

## Perguntas reutilizadas e pendências

Nenhuma `IMP-Q-NNN` foi criada. Os achados estão cobertos pelas 52 perguntas consolidadas e pelas 17 pendências existentes.

| Frente da implementação | Perguntas consolidadas reutilizadas | Pendências preservadas |
|---|---|---|
| Ciência, 17 variáveis, fórmula, validação e qualidade | `CON-Q-003`,`009`–`021`,`045`,`046` | `PD-001`,`002`,`004` |
| Identidade, papéis, laboratórios, ownership e autorização | `CON-Q-022`–`027`,`036`,`037`,`042`,`043` | `PD-003`–`006`,`014`–`016` |
| API e fronteira Next/Python | `CON-Q-048`,`049` | `PD-003`,`004`,`006`,`008`,`011` |
| Modelo, ciclo, constraints e auditabilidade | `CON-Q-023`–`025`,`042`–`047` | `PD-004`,`014`–`016` |
| Mapas, geoespacial e offline | `CON-Q-029`,`030`,`034`,`044`,`050` | `PD-003`–`007`,`009`,`010`,`013` |
| UX, acessibilidade e estados | `CON-Q-028`,`036`,`039` | `PD-003`,`005`,`017` |
| Testes, NFR, ambientes, deploy e observabilidade | `CON-Q-037`,`039`,`051` | `PD-002`–`006`,`012` |

`PD-001`–`017` foram revisadas 17 de 17 e permanecem `ABERTA`, sem responsável, prazo ou decisão inferidos. A implementação acrescenta evidência às decisões futuras, mas não responde qual comportamento deveria prevalecer. Nenhuma pendência material nova foi necessária.

## Matriz global e `GAP-016`

Os 13 nós, `TR-001`–`022` e `GAP-001`–`016` foram preservados. Nenhum arquivo de código virou nó, nenhuma relação ou lacuna nova foi criada e as 21 comparações `CMP-NNN` permanecem internas a este relatório.

`GAP-016` recebeu `EVIDENCIA_IMPLEMENTACAO` de `DOC-014` e estado `INSPECAO_REALIZADA_COM_LIMITACOES`: a cobertura metodológica é 18/18, com 3 verificações implementadas, 4 parciais, 7 não implementadas e 4 não avaliadas. Implantação externa, contrato futuro de API/modelo e política futura de operação impedem conclusão integral. Assim, a matriz permanece com 13 nós, 22 relações e 16 lacunas; somente o estado e a evidência de `GAP-016` foram atualizados.

## Artefatos criados, movidos ou alterados

| Caminho | Ação | Estado final | Finalidade |
|---|---|---|---|
| `docs/plans/active/consolidacao-auditoria-documental.md` | Removido por movimento controlado | Origem encerrada | Arquivar `DOC-PLAN-007`. |
| `docs/plans/completed/consolidacao-auditoria-documental.md` | Movido e atualizado | `CONCLUIDO`; registro `ARQUIVADO` | Registrar aprovação, gate, histórico e checksum da Etapa 8. |
| `docs/reports/audits/2026-08-26-auditoria-documental-consolidada.md` | Atualizado | `CANONICO_ATUAL`, somente analítico | Registrar revisão humana e limites de `DOC-013`. |
| `docs/plans/active/auditoria-implementacao-infraestrutura.md` | Criado e atualizado | `AGUARDANDO_REVISAO`; registro `EM_REVISAO` | Plano e evidências operacionais da Etapa 9. |
| `docs/reports/audits/2026-08-28-auditoria-implementacao-infraestrutura.md` | Criado | `EM_REVISAO` | Este relatório `DOC-014`. |
| `docs/governance/TRACEABILITY_MATRIX.md` | Atualizado | `CANONICO_ATUAL` | Registrar origem analítica e tratar `GAP-016` com limitações. |
| `docs/governance/DOCUMENT_REGISTER.md` | Atualizado | `CANONICO_ATUAL` | Registrar 36/36 documentos, caminhos e estados. |
| `docs/governance/PENDING_DECISIONS.md` | Atualizado | `CANONICO_ATUAL` | Acrescentar referências de implementação sem mudar 17 estados. |

## Integridade e preservação

- `docs/raw/` permanece com os mesmos 13 Markdown rastreados, modos, tamanhos e SHA-256 do baseline; nenhum arquivo foi lido integralmente, editado, movido ou excluído nesta etapa.
- Código, assets, manifests, lockfile, schema, migration local, testes, configurações e arquivos de ambiente não têm delta Git.
- Diretórios gerados/ignorados preexistentes foram preservados; nenhum cleanup amplo foi realizado.
- Nenhum segredo, hash, credencial, cookie, connection string ou dado pessoal encontrado foi copiado para este relatório.
- Não houve instalação, conexão de banco, request externo, deploy, seed, migration, criação de usuário, commit ou alteração staged.
- `AGENTS.md`, canônicos proibidos e relatórios das Etapas 4 a 7 permaneceram inalterados.

## Verificações documentais e de controle

Foram planejadas e executadas verificações mecânicas de: sequência/unicidade de `IMP-ART-001`–`021`, `IMP-EVD-001`–`036` e `IMP-FND-001`–`018`; cobertura 18/18 e 17/17; somatórios por arquivo, formato, camada, resultado, relação e impacto; 11 models, 10 enums, 13 relações e migrations; duas tabelas do registro; 13 nós, 22 relações e 16 lacunas; 17 pendências abertas; links Markdown locais; estrutura de tabelas; escopo do diff; integridade raw; ausência de delta técnico; whitespace; e padrões sensíveis sanitizados.

Os resultados finais e os comandos exatos são registrados no plano `DOC-PLAN-008`. Markdown lint não foi executado porque não há configuração própria. Verificações que exigiriam navegador, serviço, credencial, banco, rede, instalação ou mutação permaneceram explicitamente não executadas.

## Alterações preexistentes

O worktree inicial estava limpo. Não havia alteração staged, unstaged ou não rastreada a preservar. Todas as oito entradas finais no status pertencem a esta execução; o movimento não staged de `DOC-PLAN-007` aparece mecanicamente como origem removida e destino não rastreado, sem duplicação no filesystem.

## Limitações e bloqueios

| Categoria | Limitação ou bloqueio |
|---|---|
| Execução | Lint bloqueado na camada de tooling; `tsx --version` sofreu restrição de IPC após informar a versão. |
| Verificação | Sem navegador, typecheck/testes inexistentes, schema validate não definido e build não seguro para esta auditoria. |
| Implementação | Auth/autorização/API/dados parciais; motor IHFR, mapas, offline, testes e operação rastreada ausentes ou não avaliáveis. |
| Normatização | Ciência, requisitos, modelo, UX e arquitetura continuam sem as decisões/autoridades necessárias; 17 pendências abertas. |
| Ambiente externo | PostgreSQL, Neon, Vercel, tiles e observabilidade externa não acessados; ausência no repo não prova ausência externa. |
| Etapas futuras | Correção, ADR, documentação normativa, PRD e Etapa 10 estão fora de escopo e não foram iniciados. |

## Diff resumido

O estado final afeta somente os oito caminhos documentais autorizados listados acima: três artefatos criados/destino de movimento, uma origem removida e quatro documentos controlados modificados. Não há arquivo staged nem commit novo. O diff técnico e `docs/raw/` são vazios.

## Ponto de parada

> Etapa 9 concluída. A implementação e a infraestrutura do HidroFlorestas foram inventariadas e comparadas com as alegações documentais por meio dos 18 `CODE-CHECK-NNN`, sem alterar o código, corrigir achados, resolver decisões, validar conteúdo científico ou normativo, produzir o PRD ou iniciar a Etapa 10. O plano permanece em `AGUARDANDO_REVISAO` e o relatório em `EM_REVISAO`. Aguardando revisão e aprovação da equipe.
