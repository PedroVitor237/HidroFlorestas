# Handoff da proposta de frontend do Lovable

## Objetivo, corte e continuidade

Checkpoint documental de 02/10/2026, America/Fortaleza, para o desenvolvedor que continuará a geração e, posteriormente, avaliará a incorporação ao HidroFlorestas. A proposta deve explorar apresentação, organização, usabilidade, acessibilidade e responsividade da jornada conta → laboratório escolhido → área → coleta → medições → diagnóstico IHFR experimental. O [prompt](lovable-prompt.md) define o recorte; as [notas de integração](lovable-integration-notes.md) registram fontes e contratos; o [plano da fase](PLAN.md) mantém a sequência e o histórico.

`DECISAO_CONFIRMADA` — Origem: solicitação do usuário nesta execução. A futura incorporação será conduzida por outro desenvolvedor; nesta rodada somente este handoff e o plano podem mudar, com commit/push em `development`. Nenhum código gerado foi incorporado, e não houve branch, PR, merge ou deploy.

`FATO_DOCUMENTADO` — O usuário relatou o aviso do Lovable “Your work is paused because you're out of credits” e que novos créditos gratuitos chegariam depois. Não há evidência de clique em “Finish up”, retomada ou conclusão. O estado do editor e mudanças não sincronizadas ao GitHub são `NAO_ESPECIFICADO`; não foram consultados. A ausência de avanço no SHA público não resolve essas questões.

## Referências Git e método

| Referência | Branch e SHA exatos analisados | Evidência e alcance |
|---|---|---|
| [HidroFlorestas](https://github.com/PedroVitor237/HidroFlorestas) | `development@1cbd2e9beab607fce8c4197ad7820267aa633fd8` | HEAD local inicial; `origin/development` local coincidia, worktree limpo. Consulta remota de development antes da publicação registrada no plano. |
| [Proposta Lovable](https://github.com/PedroVitor237/HidroFlorestas-FrontEnd) | `main@d4cf1e5f28322132e094c0c0016c3ad531be7404` | `git ls-remote --symref … HEAD` confirmou branch padrão `main` e SHA; clone raso separado confirmou o mesmo HEAD. Igual à referência anterior informada pelo usuário. |

Clone público: `https://github.com/PedroVitor237/HidroFlorestas-FrontEnd.git`. A inspeção usou `/tmp/hidro-lovable-handoff-20261002`, sem copiar arquivos para o projeto principal. A referência é um snapshot, não uma garantia sobre commits futuros. [Árvore imutável analisada](https://github.com/PedroVitor237/HidroFlorestas-FrontEnd/tree/d4cf1e5f28322132e094c0c0016c3ad531be7404).

Foram lidos AGENTS.md raiz do HidroFlorestas e do clone, PROJECT_CONTEXT.md, TECH_DECISIONS.md, PLANS.md, constituição, política de fontes, SOURCE_AUTHORITY.md, plano da fase, prompt e notas. Não foi localizado AGENTS.md mais específico no principal. A inspeção do Lovable cobriu arquivos rastreados de rotas, estilos, adapter, domínio/cenários, testes, configuração e documentação. No destino, a comparação focal reconferiu package.json, rotas privadas e contexto de autenticação; não constitui auditoria completa.

`EVIDENCIA_IMPLEMENTACAO` neste documento significa inspeção estática, salvo declaração explícita de execução. **Nenhum comportamento de tela foi verificado em runtime.** Não foram instaladas dependências nem executados preview, testes, lint, typecheck ou build do clone. O checkout separado não tinha node_modules; essa rodada é uma avaliação documental breve. Não há PASS funcional, visual ou de acessibilidade.

## O que existe no commit

Todos os caminhos desta seção e da matriz referem-se à árvore imutável do Lovable acima.

| Artefato | Estado observado |
|---|---|
| `.lovable/plan/proposta-de-frontend-hidroflorestas-plano-de-construção-2026-10-02.md` | `PROPOSTA`: plano de identidade, navegação, telas, cenários e critérios; o texto não comprova execução. |
| `src/routes/index.tsx`, `__root.tsx`, `src/routeTree.gen.ts` | `EVIDENCIA_IMPLEMENTACAO`: somente `/` registrada como página; imagem com alt “Your app will live here!”. Shell com Outlet/QueryClient, erros/404 genéricos em inglês, `lang="en"` e título “Lovable App”. |
| `src/components/ui/*`, `src/hooks/use-mobile.tsx` | Componentes genéricos Radix/shadcn e apoio responsivo. Não foi localizada pasta `src/features/` nem interface de domínio conectada às rotas. |
| `src/styles.css` | Tailwind 4, tokens OKLCH genéricos claros/escuros. Poppins e a aplicação da paleta HidroFlorestas não localizadas; home usa fundo literal `#fcfbf8`. Tokens presentes não demonstram identidade aplicada. |
| `src/domain/{types,labels,permissions,time}.ts` | Tipos, enums, rótulos portugueses, versões/avisos científicos, matriz contextual e utilitários RFC3339/offset/fuso. São estrutura de apoio, sem formulário conectado. |
| `src/adapter/{api,index,mock}.ts` | Interface HidroApi e exportação de mockApi; simulações de conta, laboratórios, áreas, coletas, medições, resumo, mapa, IHFR e administração. Sem implementação de transporte HTTP real. |
| `src/demo/scenario.ts` | Store de cenários com latência/falhas/perfis; usa sessionStorage para escolha do cenário, incluindo sessionUserId. Nenhum painel visual localizado. O prompt pedia sessão fictícia em memória: revisar essa divergência. |
| `README.md`, `src/routes/README.md` | README principal genérico “Pixel Perfect Implementation”, com instalação/dev e link do editor; não documenta os fluxos do HidroFlorestas nem a adaptação ao App Router. README de rotas explica convenções TanStack. |
| `src/test/app-routing.test.tsx`, `src/domain/time.test.ts` | Dois casos genéricos de montagem de rota/404 e cinco casos de utilitários temporais (offsets, equivalência, calendário e transições sazonais). Lidos, não executados. Sem testes de jornadas/telas localizados. |

O teste de roteamento declara que verifica montagem, nunca conteúdo da página. Mesmo um eventual PASS não comprovaria landing, formulários, permissões ou jornada. Dependências Leaflet/React-Leaflet existem, mas nenhum componente de mapa conectado foi localizado. O mock contém resultados IHFR predefinidos e avisos experimentais; isso não prova que o usuário os vê.

## Matriz de telas e fluxos solicitados

Convenções do prompt: `L = /dashboard/laboratories/{laboratoryId}`; `C = L/areas/{areaId}/collections/{collectionId}`. **Não localizada** significa ausência de tela/rota no commit inspecionado, não afirmação sobre o editor ou outros commits. Todas as linhas têm comportamento runtime **não verificado**.

| Tela/fluxo pedido | Estado da interface | Evidência estática / apoio existente |
|---|---|---|
| `/`: apresentação, Entrar/Criar conta | Placeholder | `routes/index.tsx`; sem apresentação/CTAs solicitados. |
| `/login`: acesso e destino por papel | Não localizada | Mock signIn; sem rota ou formulário. |
| `/register`: quatro campos, conta ativa e sessão | Não localizada | Mock signUp; sem rota/revisão de campos. |
| `/logout`: andamento, erro/retry e saída acessível | Não localizada | Mock logout/failLogout; sem página ou botão Sair. |
| `/workspace`: selecionar/criar/configurar laboratório, limite cinco | Não localizada | Mock de lista/criação/desativação/exclusão e personas; sem escolha visual. |
| `L`: dois totais, histórico paginado e destinos | Não localizada | Mock summary/history; destinos são strings, sem páginas correspondentes. |
| `L/areas`: grade/lista, vazio e Nova área | Não localizada | Mock listAreas. |
| `L/areas/new`: ponto, dispositivo e revisão | Não localizada | AreaInput/createArea; flags geo sem consumidor visual. |
| `L/areas/{areaId}`: contexto/mapa e registrar coleta | Não localizada | Mock getArea. |
| `L/areas/{areaId}/collections/new`: ocorrência/fuso, corrigir/confirmar | Não localizada | Mock createCollection e time.ts/testes; sem inicialização de formulário demonstrada. |
| `C`: consulta imutável e gestão IHFR contextual | Não localizada | Mock getCollection e operações IHFR; sem confirmação/recuperação visual. |
| `C/environmental-data`: consulta ou ausência | Não localizada | Mock getEnvironmental. |
| `C/environmental-data/new`: quatro grupos, validar/revisar/confirmar | Não localizada | EnvironmentalInput e createEnvironmental; sem formulário/validador integral localizado. |
| `L/map`: pontos, lista acessível e coletas | Não localizada | Mock territorialMap/location:null, tilesFail; Leaflet declarado, sem mapa renderizado. |
| `L/members`: promover/rebaixar vínculos | Não localizada | Mock listMemberships/updateMembership e permissions.ts. |
| `/admin`: visão geral | Não localizada | Persona global e flag isGlobalAdmin; sem rota/layout. |
| `/admin/users`: filtros, alteração justificada, conflito e auditoria | Não localizada | Mock adminListUsers/adminChange/adminAudit; sem UI. |
| Aliases `/dashboard`, `/dashboard/collects`, `/dashboard/admin/users` | Não localizados | routeTree.gen.ts registra somente `/`; sem redirects solicitados. |
| Painel Demonstração, loading/vazio/erro/leitura/permissões, móvel/teclado/zoom | Não localizado / não avaliado visualmente | Store e biblioteca de UI não comprovam estados exercitáveis. |

`INFERENCIA` — A proposta está em estrutura inicial e planejamento, ainda **não pronta para avaliação de integração das telas**. É possível revisar os artefatos de apoio agora, mas falta interface navegável para julgar apresentação e usabilidade.

## Lacunas e diferenças de arquitetura

`EVIDENCIA_IMPLEMENTACAO` — Lovable usa TanStack Start/Router com SSR, Vite 8, React 19, Tailwind 4, QueryClient e bun.lock. O HidroFlorestas usa Next.js 16.3.6/App Router, React 19.2.4, Tailwind 4, APIs próprias, autenticação por cookie, Prisma/PostgreSQL e Leaflet/React-Leaflet. O clone inclui infraestrutura SSR/erros/CSRF genérica, que não é backend de domínio nem substitui o monólito existente.

`RECOMENDACAO` — Antes de incorporar, mapear rotas/links/layouts TanStack para App Router, fronteiras cliente/servidor, assets/fontes e mapas client-only. Revisar tokens e dependências Radix/Recharts/formulários antes de adotá-los; biblioteca instalada não aprova gráficos ou nova arquitetura. Não copiar configs, lockfile ou globals integralmente.

Revisão focal dos mocks encontrou simplificações que exigem avaliação: me acrescenta isGlobalAdmin ao contexto fictício; IDs de fixtures como lab-itapecuru não são UUIDs; signIn aceita senha não vazia de persona; eligibilityOf só verifica conjunto/declividade/uso, sem a suficiência real por dimensão; replay IHFR retorna pelo key sem comparar body/contexto e replay ambiental não compara payload. Criar área/coleta/conjunto não faz validação integral equivalente à API. Essas evidências estão em adapter/mock.ts e api.ts; **não são contratos reais nem lógica pronta para portar**.

Ainda falta gerar as telas, conectar rotas/componentes/adapter, aplicar identidade pt-BR, construir painel removível, formulários e estados de tentativa, mapa/fallback, navegação por contexto e README específico. Depois será necessário executar a proposta e conferir jornada, erros, permissões, contratos, responsividade e acessibilidade. O plano do Lovable promete esses itens, mas não demonstra entrega.

## Retomada em etapas menores

Todas as orientações abaixo são `RECOMENDACAO`, adequadas ao limite de créditos relatado. Ao retomar, conferir novamente main/HEAD; não presumir retomada automática. Preservar o prompt como contrato de referência e solicitar um recorte por vez, com demonstração e commit identificável antes do próximo:

1. Landing, login/cadastro/logout de demonstração, tokens/Poppins/pt-BR e shell; Sair com sucesso/falha. Documentar execução e painel de personas removível.
2. Workspace, seleção explícita, criar/configurar laboratório e estados vazio/limite/inativo; sem ingresso funcional.
3. Áreas: lista, cadastro de ponto com revisão, detalhe e mapa/fallback; Município/UF continuam manuais.
4. Coletas: data/hora inicial única/editável, offsets, revisão/consulta imutável; acesso pelo resumo/histórico e mapa.
5. Ambiental: 17 campos/quatro grupos, null/zero/false, validação/revisão/confirmação e tentativa incerta; sem rascunhos.
6. IHFR: ausência/insuficiência/incompatibilidade/vigente, criar/substituir/revogar e recuperação/replay, sempre simulado/experimental, sem calcular score.
7. Membros e administração; depois revisão transversal de teclado, foco, contraste, móvel/zoom e README com cenários/evidências.

Em cada pedido, reiterar dados sintéticos, adapter substituível, nenhum backend/auth/banco/cálculo novo e nenhuma ampliação do escopo. Evitar gastar créditos repetindo infraestrutura genérica; pedir tela e fluxo demonstráveis do recorte, incluindo erros/retornos.

## Critérios para revisão de integração

`RECOMENDACAO` — Considerar pronta para essa revisão quando:

- As 17 telas e três aliases estiverem conectados e a jornada completa puder ser demonstrada, com acesso a coletas existentes, seleção explícita de laboratório e Sair em todos os contextos.
- Cenários OWNER/ADMIN contextual/MEMBER/ADMIN global/sem laboratório/inativo e estados loading/vazio/falha/retry/permissão/recurso indisponível forem exercitados, identificando versão, ambiente e evidência.
- Formulários preservarem contratos, unidades/enums/null/false/zero, revisão, imutabilidade, instante/offset e mesma tentativa no resultado incerto; IHFR apresentar todos os estados/avisos sem cálculo local.
- Houver evidência de 375/768/1440px, zoom 200%, teclado/foco/diálogos e contraste AA; testes de montagem ou utilitários não substituírem essas verificações.
- README explicar execução, rotas, componentes/tokens, mocks/cenários, limitações, resultados de checks e diferenças para Next.js; não haver funcionalidades excluídas, dados reais ou credenciais.
- O desenvolvedor apresentar comparação com o baseline então atual do HidroFlorestas, lacunas e recortes de adaptação revisáveis. Prontidão para revisão não autoriza merge/deploy nem comprova integração real.

## Regras de futura incorporação e adiamentos

`DECISAO_CONFIRMADA` — Origem: solicitação desta execução, em continuidade ao prompt e ao mandato pré-Lovable. Preservar contratos e lógica do HidroFlorestas; usar a proposta como referência de apresentação/usabilidade. Revisar mocks e adapters, mantendo autenticação, permissões, persistência e cálculo IHFR ligados aos mecanismos reais do projeto. Remover sessão/painel fictícios do produto, usar guards e API reais, respeitar idempotência, escopo laboratório/área/coleta, conflitos e imutabilidade. Não transportar regras de simulação como autorização ou cálculo.

IHFR permanece `CONTRATO_EXPERIMENTAL`, `VALIDACAO_CIENTIFICA_PENDENTE`, `SUJEITO_A_RECALIBRACAO` e `NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO`, conforme [ADR-0001](../../../governance/ADR-0001-contrato-experimental-ihfr-v0-1.md). Testes técnicos ou protótipo não validam ciência. Funcionalidades futuras seguem Spec Kit em seus recortes; esta documentação não cria nova spec de implementação.

| Pendência adiada | Encaminhamento preservado |
|---|---|
| Município/UF automáticos — FASE-02 / LOV-03 | `ADIADO`, decisão pré-Lovable de 01/10 reafirmada pelo pedido atual. Feature própria: serviço/contrato de geocodificação e proteção de valores manuais. Sem geocodificação nesta proposta. |
| Rascunhos de registros ambientais — FASE-05 / LOV-03 | `ADIADO`, mesma origem. Feature própria: dono, compartilhamento, retenção, concorrência, retomada e promoção. Não persistir formulário como rascunho nem permitir incompletos no IHFR. |

Responsável e prazo dessas pendências: não especificado. Seleção visual final e contratos eventualmente novos exigem decisão no recorte pertinente. Reconciliações canônicas já registradas nas notas permanecem fora desta tarefa. Relatórios enviados mantêm corte histórico de 01/10; não foram alterados.

## Verificação do checkpoint

Inspeção estática e comparação documental concluídas no alcance acima. A rede falhou por DNS no sandbox; consultas Git foram repetidas com autorização fora dele e tiveram sucesso. Revisão de diff, referências locais, terminologia, escopo e git diff --check registradas no plano. Testes/build/preview do Lovable e do principal não executados: não houve mudança funcional e a proposta não tem telas de domínio conectadas. Publicação documental e confirmação remota são registradas na entrega, sem referência circular ao próprio commit.
