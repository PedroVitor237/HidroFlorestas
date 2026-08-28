# Validação cruzada final do pacote PRD Code-First

## Identificação e estado

| Campo | Registro | Classificação |
|---|---|---|
| Iniciativa | `PRD Code-First` | iniciativa paralela, analítica e não canônica |
| Estado do documento | `EM_REVISAO` | estado documental; requer revisão humana |
| Estado da validação | `CONCLUIDA` | resultado desta validação cruzada estática |
| Versão Code-First baseada no código | `CONCLUIDA_EM_REVISAO` | cobertura concluída, sem aprovação normativa |
| Fase 1 | `CONCLUIDA` | critério Code-First atendido |
| Fase 2 | `NAO_INICIADA` | depende de revisão humana e autorização explícita |
| Aprovação normativa | não concedida | `NAO_ESPECIFICADO` quanto à autoridade formal |
| Data civil | 2026-08-28 | data da execução |

## Objetivo, escopo e método

Esta validação determina se o produto observável no código, nas configurações, no schema Prisma e nas decisões atuais possui cobertura coerente no [`PRD`](../prd-code-first.md), no [`catálogo de requisitos`](../specifications/requirements.md), nos [`casos de uso`](../specifications/use-cases.md), no [`diagrama de classes`](../specifications/class-diagram.md), nos [`fluxos de produto`](../specifications/product-flows.md) e nas três representações [PlantUML](../diagrams/plantuml/). A conclusão avalia cobertura, classificação, coerência e rastreabilidade; não avalia segurança, qualidade do código ou prontidão para produção.

Foram inspecionados estaticamente rotas, páginas, layouts, navegação, formulários, contexto de autenticação, sessão, quatro endpoints de autenticação, serviços conectados, workspace, dashboard, áreas, coletas, dados ambientais, IHFR, histórico, mapa, suporte administrativo, tipos, classes, mocks, `package.json`, lockfile, configurações rastreadas, `prisma/schema.prisma`, `TECH_DECISIONS.md`, `PROJECT_CONTEXT.md` somente para identidade e os documentos desta iniciativa. Aplicação, build, lint, testes, banco, migrations, deploy, internet, Figma e fontes externas não foram executados ou utilizados.

O plano desta execução percorreu cinco etapas: baseline e fontes; inventário estático; gates cruzados; correções não materiais e matriz mestra; verificações mecânicas e consolidação. Todas foram concluídas sem exigir decisão humana nova. Alterações ficaram limitadas a `docs/code-first-prd/**`.

## Baseline e reconciliação

| Item | Resultado |
|---|---|
| Branch | `docs/code-first-prd` |
| HEAD inicial | `213918ec6a5f91ed4e35e54d9d0bef07ed156f36` |
| Upstream | `origin/docs/code-first-prd` no mesmo commit |
| Estado inicial | worktree limpo |
| Baseline informado | `4d6dd8c44582501faf47c913b567efc05d9454e6` |
| Reconciliação | o commit posterior `213918e` acrescentou e ajustou somente `docs/code-first-prd/**`; não houve alteração de código, configuração ou schema desde a base técnica inventariada |
| Alterações preexistentes | nenhuma no início desta execução |
| Commit e push | não realizados |

Não foi localizado conflito material entre o baseline informado e o HEAD atual. Os localizadores de código permanecem válidos porque a diferença posterior está restrita ao pacote documental.

## Fontes, autoridade e limitação processual

As classificações seguem [`../governance/source-policy.md`](../governance/source-policy.md) e a autoridade específica de assunto de [`../../../docs/governance/SOURCE_AUTHORITY.md`](../../../docs/governance/SOURCE_AUTHORITY.md). Código e schema são `EVIDENCIA_IMPLEMENTACAO`; decisões registradas preservam sua origem e estado; comportamentos derivados do código continuam candidatos ou `INFERENCIA`; schema não foi promovido a domínio ou contrato científico aprovado.

`docs/raw/**` permaneceu excluído de conteúdo e de evidência. Registra-se a limitação processual herdada: duas execuções anteriores localizaram `AGENTS.md` a partir da raiz sem exclusão explícita; nenhum caminho ou conteúdo de `docs/raw/**` foi exibido, aberto ou utilizado; essa ressalva não representa evidência de contaminação material. Nesta execução, uma tentativa inicial de invocar `rg --files` sem a exclusão explícita falhou antes da busca porque `rg` não está instalado e não exibiu qualquer caminho; todas as buscas efetivamente executadas e usadas como evidência aplicaram exclusão explícita de `docs/raw/**` ou leitura direta de arquivo permitido. Nenhum caminho ou conteúdo de `docs/raw/**` foi listado, lido, enumerado, pesquisado ou utilizado.

## Resultados quantitativos

| Artefato | Esperado | Localizado | Resultado |
|---|---:|---:|---|
| Requisitos funcionais `CF-PRD-FR-*` | 15 | 15 | aprovado |
| Requisitos não funcionais `CF-PRD-NFR-*` | 6 | 6 | aprovado |
| Requisitos totais | 21 | 21 | aprovado |
| Casos de uso `CF-UC-*` | 15 | 15 | aprovado |
| Elementos de classe `CF-CLS-*` | 30 | 30 | aprovado |
| Fluxos `CF-PFLOW-*` | 7 | 7 | aprovado |
| Representações PlantUML | 3 | 3 | aprovado |
| Models Prisma | 11 | 11 inventariados | aprovado |
| Enums Prisma | 10 | 10 inventariados | aprovado |

Os 30 elementos de classe se distribuem em 11 models Prisma, 10 enums Prisma, 5 tipos TypeScript, 2 classes de serviço conectadas e 2 tipos de mocks não persistidos.

## Matriz mestra

| Capacidade ou conceito | Evidência no código | PRD | Requisito | Caso de uso | Classe/model | Fluxo | Estado | Observação |
|---|---|---|---|---|---|---|---|---|
| Landing e entrada pública | `src/app/page.tsx:17-313` | contexto de entrada; texto comercial sem prova funcional | — | — | — | `CF-PFLOW-001` | `IMPLEMENTACAO_ATUAL`; `LIMITACAO_DA_EVIDENCIA` | A landing existe parcialmente, mas não cria capacidade nem requisito por alegação comercial. |
| Conta | formulário, `POST /api/auth/sign-up`, serviços e `User` | núcleo do MVP; identidade e acesso | `CF-PRD-FR-001`; `CF-PRD-NFR-003` | `CF-UC-001` | `CF-CLS-001`, `CF-CLS-022`, `CF-CLS-025`, `CF-CLS-026`, `CF-CLS-027`, `CF-CLS-028` | `CF-PFLOW-001`, `CF-PFLOW-002` | `NUCLEO_MVP`; implementação estática | Política de elegibilidade e estados permanece aberta. |
| Login | formulário, `POST /api/auth/sign-in`, hash, token e cookie | núcleo do MVP; identidade e acesso | `CF-PRD-FR-001`, `CF-PRD-FR-002` | `CF-UC-002` | `CF-CLS-001`, `CF-CLS-013`, `CF-CLS-023`, `CF-CLS-024`, `CF-CLS-026`, `CF-CLS-027`, `CF-CLS-028` | `CF-PFLOW-001`, `CF-PFLOW-002` | `NUCLEO_MVP`; implementação estática | Runtime e política de conta não validados. |
| Sessão | contexto React, `/api/auth/me`, JWT e proxy | núcleo do MVP; identidade e acesso | `CF-PRD-FR-002` | `CF-UC-003` | `CF-CLS-001`, `CF-CLS-023`, `CF-CLS-026`, `CF-CLS-027`, `CF-CLS-028` | `CF-PFLOW-002` | `NUCLEO_MVP`; `PARCIALMENTE_IMPLEMENTADO` | Proxy e restauração evidenciam mecanismo atual, não política aprovada. |
| Logout | `/logout`, `POST /api/auth/logout` e limpeza do contexto | núcleo do MVP; encerramento da sessão | `CF-PRD-FR-002` | `CF-UC-003` | `CF-CLS-026` | `CF-PFLOW-002` | `NUCLEO_MVP`; implementação estática | Não foi criada classe de sessão ou revogação inexistente. |
| Laboratório | workspace mockado; `LaboratoryRoom` | laboratório mínimo no núcleo | `CF-PRD-FR-003`, `CF-PRD-FR-011`; `CF-PRD-NFR-001` | `CF-UC-004` | `CF-CLS-001`, `CF-CLS-003` | `CF-PFLOW-001`, `CF-PFLOW-003` | `NUCLEO_MVP`; `INFERENCIA`; parcial/mock | Criação, responsabilidade e transferência dependem de `CF-PD-002`, `CF-PD-006`. |
| Vínculo | `ResearchersLinked`; ação de ingresso sem consumidor | laboratório mínimo no núcleo | `CF-PRD-FR-003`, `CF-PRD-FR-011`; `CF-PRD-NFR-001` | `CF-UC-005` | `CF-CLS-001`, `CF-CLS-003`, `CF-CLS-004` | `CF-PFLOW-003` | `INFERENCIA`; `PARCIALMENTE_IMPLEMENTADO` | Código, convite, aprovação e saída não foram escolhidos. |
| Contexto ativo | estado local e card no workspace | núcleo do MVP; contexto colaborativo candidato | `CF-PRD-FR-004`, `CF-PRD-FR-011` | `CF-UC-006` | — | `CF-PFLOW-001`, `CF-PFLOW-003` | `NUCLEO_MVP`; `INFERENCIA`; mock | Não há classe ou persistência localizada para contexto ativo. |
| Área | cards mockados e `CollectionArea` | núcleo do MVP; áreas monitoradas | `CF-PRD-FR-005`, `CF-PRD-FR-011`, `CF-PRD-FR-012` | `CF-UC-007`, `CF-UC-008` | `CF-CLS-001`, `CF-CLS-003`, `CF-CLS-005`, `CF-CLS-014`, `CF-CLS-030` | `CF-PFLOW-001`, `CF-PFLOW-004` | `NUCLEO_MVP`; parcial/schema/mock | Ciclo, campos finais e propriedade dependem de decisões abertas. |
| Representação espacial | `Coordinates`, FK obrigatória da área e mapa placeholder | mapa no núcleo por `CF-PD-007` | `CF-PRD-FR-013` | `CF-UC-007` | `CF-CLS-002`, `CF-CLS-005` | `CF-PFLOW-001`, `CF-PFLOW-004` | `DIRECAO_CONFIRMADA_PARA_RASCUNHO`; parcial | Não foram criadas geometria, camada, marcador ou entidade cartográfica inexistentes. |
| Coleta | ação placeholder e `CollectionData` | núcleo do MVP | `CF-PRD-FR-006`, `CF-PRD-FR-011`, `CF-PRD-FR-012` | `CF-UC-009` | `CF-CLS-001`, `CF-CLS-005`, `CF-CLS-006` | `CF-PFLOW-001`, `CF-PFLOW-005` | `NUCLEO_MVP`; parcial/schema | Data de campo, estados, revisão, edição e exclusão permanecem abertos. |
| Associação espacial da coleta | cadeia `Coordinates → CollectionArea → CollectionData` | mapa no núcleo por `CF-PD-007` | `CF-PRD-FR-014`; `CF-PRD-NFR-002` | `CF-UC-010` | `CF-CLS-002`, `CF-CLS-005`, `CF-CLS-006` | `CF-PFLOW-001`, `CF-PFLOW-005` | `DIRECAO_CONFIRMADA_PARA_RASCUNHO`; parcial | Associação ocorre indiretamente pela área; localização própria da coleta não foi inventada. |
| Dados ambientais | `WaterData`, `SoilData`, `VegetationData`, `TerrainData` e enums | núcleo condicionado ao contrato científico | `CF-PRD-FR-007`, `CF-PRD-FR-014`; `CF-PRD-NFR-002` | `CF-UC-011` | `CF-CLS-008`, `CF-CLS-009`, `CF-CLS-010`, `CF-CLS-011`, `CF-CLS-016`, `CF-CLS-017`, `CF-CLS-018`, `CF-CLS-019`, `CF-CLS-020`, `CF-CLS-021` | `CF-PFLOW-001`, `CF-PFLOW-005` | `NUCLEO_MVP`; schema sem consumidor; ciência aberta | Grupos e enums são evidência técnica, não taxonomia científica aprovada. |
| Diagnóstico IHFR | `IHFRDiagnosis` relacionado à coleta | ciclo do MVP chega ao diagnóstico | `CF-PRD-FR-008`; `CF-PRD-NFR-006` | `CF-UC-012` | `CF-CLS-006`, `CF-CLS-007`, `CF-CLS-015`, `CF-CLS-016` | `CF-PFLOW-001`, `CF-PFLOW-006` | `NUCLEO_MVP`; `PENDENCIA_DE_DECISAO`; schema sem consumidor | `CF-PD-005` mantém produção, fórmula e contrato abertos. |
| Consulta do resultado | campos do diagnóstico; consumidor não localizado | resultado consultável no núcleo | `CF-PRD-FR-009`; `CF-PRD-NFR-006` | `CF-UC-013` | `CF-CLS-005`, `CF-CLS-006`, `CF-CLS-007` | `CF-PFLOW-001`, `CF-PFLOW-006`, `CF-PFLOW-007` | `NUCLEO_MVP`; comportamento `NAO_LOCALIZADO` | Preserva origem e versão quando disponíveis, sem método inventado. |
| Dashboard e resumo | página agrega mapa, histórico e ação de coleta | acompanhamento básico no núcleo | `CF-PRD-FR-010` | `CF-UC-014` | — | `CF-PFLOW-001`, `CF-PFLOW-007` | `NUCLEO_MVP`; `PARCIALMENTE_IMPLEMENTADO` | Não há classe de resumo consolidado localizada. |
| Histórico | `ActivityLog`, busca, filtro e paginação sobre mock | acompanhamento básico no núcleo | `CF-PRD-FR-010`, `CF-PRD-FR-012`; `CF-PRD-NFR-002` | `CF-UC-014` | `CF-CLS-029` | `CF-PFLOW-001`, `CF-PFLOW-007` | `NUCLEO_MVP`; mock não persistido | Não foi criada entidade persistida de evento ou histórico. |
| Mapa territorial | placeholder, legenda e cadeia área/coleta/diagnóstico | mapa no núcleo por `CF-PD-007` | `CF-PRD-FR-015`; `CF-PRD-NFR-006` | `CF-UC-015` | `CF-CLS-002`, `CF-CLS-005`, `CF-CLS-006`, `CF-CLS-007` | `CF-PFLOW-001`, `CF-PFLOW-007` | `DIRECAO_CONFIRMADA_PARA_RASCUNHO`; placeholder | Tecnologia, camadas, precisão, simbologia e interação permanecem abertas. |
| Autoria | `User.collectionAreas`, `User.collectionData`; histórico mockado | suporte necessário ao núcleo | `CF-PRD-FR-012`; `CF-PRD-NFR-002` | `CF-UC-007`, `CF-UC-008`, `CF-UC-009`, `CF-UC-010`, `CF-UC-011`, `CF-UC-012`, `CF-UC-013`, `CF-UC-014`, `CF-UC-015` | `CF-CLS-001`, `CF-CLS-005`, `CF-CLS-006`, `CF-CLS-029` | `CF-PFLOW-004`, `CF-PFLOW-005`, `CF-PFLOW-006`, `CF-PFLOW-007` | requisito candidato; parcial | Autoria técnica não resolve propriedade ou edição por terceiros. |
| Segregação | relações por laboratório; nenhum enforcement de domínio conectado | garantia transversal candidata | `CF-PRD-NFR-001`, `CF-PRD-NFR-003`; apoio de `CF-PRD-FR-011` | `CF-UC-004`, `CF-UC-005`, `CF-UC-006`, `CF-UC-007`, `CF-UC-008`, `CF-UC-009`, `CF-UC-010`, `CF-UC-011`, `CF-UC-012`, `CF-UC-013`, `CF-UC-014`, `CF-UC-015` | `CF-CLS-003`, `CF-CLS-004`, `CF-CLS-005` | `CF-PFLOW-003`, `CF-PFLOW-004`, `CF-PFLOW-005`, `CF-PFLOW-006`, `CF-PFLOW-007` | `PENDENCIA_DE_DECISAO`; não validado | Matriz definitiva depende de `CF-PD-006`. |
| Administração | `UserRole`, `isAdmin`, `requireAdmin` e script local | fora do núcleo do MVP | — | — | `CF-CLS-001`, `CF-CLS-012` | — | `FORA_DO_MVP_CANDIDATO`; suporte técnico parcial | Sem ator funcional adicional, interface ou requisito administrativo no MVP. |
| IA | texto comercial e `IHFRDiagnosis.explanationAI?` | fora do núcleo do MVP | — | — | campo em `CF-CLS-007`; nenhuma classe de IA | — | `FORA_DO_MVP_CANDIDATO` | Campo e alegação não provam explicação, recomendação ou cálculo por IA. |
| Figma | nenhum artefato no código/configuração permitidos | fonte complementar e opcional | — | — | — | — | `CF-PD-008`; `NAO_AVALIADO` | Ausência não bloqueia esta versão; uso futuro exige identificação e classificação. |
| Formulários, feedback, erros e carregamento | login/cadastro, toasts, estados de loading e respostas HTTP | comportamento de acesso e limitações atuais | `CF-PRD-FR-001`, `CF-PRD-FR-002`; `CF-PRD-NFR-005` | `CF-UC-001`, `CF-UC-002`, `CF-UC-003` | `CF-CLS-024`, `CF-CLS-025`, `CF-CLS-026` | `CF-PFLOW-002` | comportamento candidato e implementação parcial | Não cria requisito de mecanismo técnico nem auditoria de qualidade. |
| Layouts, navegação e responsividade | layouts privados, top bar, sidebar/tab bar e breakpoints | suporte transversal ao ciclo | `CF-PRD-NFR-004`, `CF-PRD-NFR-005` | transversal aos 15 casos | — | transversal aos 7 fluxos | requisito candidato; implementação estática/parcial | Props de componentes não foram promovidas a classes de produto. |
| Perfil e atualização de usuário | link `/dashboard/profile` sem página; métodos `updateUser` e `updatePassword` sem route handler | não incluído como capacidade confirmada do núcleo | — | — | `CF-CLS-022`, `CF-CLS-027`, `CF-CLS-028` | — | `IMPLEMENTACAO_ATUAL_ISOLADA`; limitação | Métodos e link sem consumidor não provam requisito de perfil. |
| Tipos e mocks | tipos de autenticação, `ActivityLog` e `CollectCardData` | separados entre aplicação e apresentação mockada | requisitos diretamente relacionados no diagrama de classes | casos diretamente relacionados no diagrama de classes | `CF-CLS-022`, `CF-CLS-023`, `CF-CLS-024`, `CF-CLS-025`, `CF-CLS-026`, `CF-CLS-027`, `CF-CLS-028`, `CF-CLS-029`, `CF-CLS-030`, todos explicitados no documento de classes | fluxos aplicáveis | `EVIDENCIA_IMPLEMENTACAO`; mocks não persistidos | Nenhum mock foi tratado como persistência ou domínio aprovado. |
| Decisões técnicas atuais | Next.js, PostgreSQL, Neon, Prisma, Tailwind, Lucide e Vercel observados/relatados | decisões de trabalho com limites | — | — | classes técnicas somente quando conectadas ao produto | transversal | `TD-001`, `TD-002`, `TD-003`, `TD-004`, `TD-005`, `TD-006`, `TD-007` preservadas | Vercel continua alegado sem deploy verificado; nenhuma decisão foi promovida. |
| Alternativas técnicas abertas | OpenStreetMap, Python, Plotly, Leaflet, integração, hospedagem futura e arquitetura cartográfica | alternativas abertas, sem prescrição | dependências abertas apenas onde aplicáveis | casos cartográficos/IHFR aplicáveis | — | `CF-PFLOW-004`, `CF-PFLOW-005`, `CF-PFLOW-006`, `CF-PFLOW-007` | `TD-008`, `TD-009`, `TD-010`, `TD-011`, `TD-012`, `TD-013`, `TD-014` preservadas | Dependência instalada isolada não foi usada como prova; nenhuma alternativa foi selecionada. |
| Qualidade, testes, CI e deploy | configuração estática; ausência de testes/CI e deploy não verificado | limitações, fora do critério de conclusão desta fase | — | — | — | — | `LIMITACAO_DA_EVIDENCIA`; não bloqueante do PRD | Não houve auditoria de qualidade ou prontidão para produção. |

Os identificadores da matriz são escritos explicitamente. Conceitos sem persistência ou tipo nomeado permanecem sem classe, conforme exigido.

## Gates de consistência

| Gate | Resultado | Evidência sintética |
|---|---|---|
| PRD → requisitos | aprovado | todo o núcleo possui FR; mapa está no núcleo em `CF-PRD-FR-013`, `CF-PRD-FR-014`, `CF-PRD-FR-015`; IA está fora; `CF-PRD-FR-008`, `CF-PRD-FR-009` e `CF-PRD-NFR-006` chegam ao diagnóstico sem definir método científico. |
| Requisitos → casos de uso | aprovado | 15 de 15 FRs têm cobertura direta ou transversal; 6 de 6 NFRs são cobertos e classificados; nenhum dos 15 casos introduz requisito funcional novo. |
| Casos de uso → fluxos | aprovado | os 15 casos aparecem no macrofluxo e em fluxos específicos; os 7 fluxos preservam atores, precondições, alternativas e resultados, sem escolher decisões abertas. |
| Classes → requisitos e fluxos | aprovado | 30 elementos têm origem direta; 11 models e 10 enums Prisma estão inventariados; tipos de aplicação e 2 mocks estão separados; ausências de classe estão declaradas; nenhuma entidade espacial foi inventada. |
| Mermaid → PlantUML | aprovado | mesmos 5 atores, 15 casos, associações e relação `include`; mesmos 30 elementos de classe, atributos, enums, relações e cardinalidades; mesmos 7 fluxos, etapas, decisões e ramificações. Diferenças são somente de agrupamento ou layout. |
| Estados e decisões | aprovado | `CF-PD-001`, `CF-PD-004`, `CF-PD-007`, `CF-PD-008` preservadas; `CF-PD-002`, `CF-PD-003`, `CF-PD-005`, `CF-PD-006` abertas; `TD-001`, `TD-002`, `TD-003`, `TD-004`, `TD-005`, `TD-006`, `TD-007`, `TD-008`, `TD-009`, `TD-010`, `TD-011`, `TD-012`, `TD-013`, `TD-014` mantidas sem promoção; mapa no núcleo, Figma complementar, IA fora, método IHFR e tecnologia cartográfica abertos. |
| Cobertura do código | aprovado | as 22 capacidades do estado atual e os conceitos adicionais mínimos receberam tratamento como núcleo, hipótese, implementação atual, fora do MVP, limitação ou decisão aberta; texto comercial e dependência isolada não foram usados como prova. |

## Inconsistências não materiais corrigidas

| Inconsistência | Correção |
|---|---|
| Baseline textual ainda apontava para `4d6dd8c44582501faf47c913b567efc05d9454e6` | baseline dos artefatos correntes reconciliado para `213918ec6a5f91ed4e35e54d9d0bef07ed156f36`, preservando o histórico analítico anterior. |
| Cinco documentos principais permaneciam em `EM_ELABORACAO` e declaravam a validação pendente | estados alterados para `EM_REVISAO`; validação, versão e fases registradas nos pontos de parada. |
| Campos de rastreabilidade usavam intervalos e sufixos abreviados | identificadores de requisitos, casos, classes e fluxos foram expandidos explicitamente nos quatro documentos de especificação. |
| `CF-PFLOW-002` incluía `CF-CLS-029` no intervalo de tipos e serviços de autenticação | relação corrigida para `CF-CLS-022`, `CF-CLS-023`, `CF-CLS-024`, `CF-CLS-025`, `CF-CLS-026`, `CF-CLS-027`, `CF-CLS-028`; `CF-CLS-029` permanece exclusivamente como mock de histórico. |
| Não existia matriz mestra nem link para o fechamento da validação | este relatório foi criado e ligado pelo README e pelos cinco documentos principais. |

Nenhuma divergência semântica Mermaid–PlantUML exigiu alteração dos três arquivos `.puml`. Nenhuma correção material, novo ator, novo requisito, nova classe de domínio, nova relação persistente ou nova decisão humana foi necessária.

## Verificações mecânicas

| Verificação | Resultado |
|---|---|
| `git diff --check` | aprovado |
| Tabelas Markdown | aprovado; todas as linhas mantêm a quantidade de colunas de seu cabeçalho |
| Links e caminhos locais | aprovado; nenhum destino inexistente no pacote |
| Localizadores de código/schema | aprovado; arquivos e intervalos de linha referenciados existem |
| IDs `CF-PRD-FR-*`, `CF-PRD-NFR-*`, `CF-UC-*`, `CF-CLS-*`, `CF-PFLOW-*` | aprovado; sequências completas, sem duplicidade ou lacuna |
| Resolução `CF-*` e `TD-*` | aprovado no escopo do pacote e das decisões aplicáveis |
| Mermaid–PlantUML | aprovado por comparação de IDs, elementos, membros, relações, etapas, decisões e ramificações |
| Cobertura da matriz mestra | aprovado; todos os conceitos mínimos solicitados e capacidades relevantes do código receberam tratamento |
| Escopo do diff | aprovado; somente `docs/code-first-prd/**` foi alterado |
| Código e schema | preservados; nenhuma alteração em `src/**`, configurações, `package.json`, lockfile ou `prisma/schema.prisma` |
| `docs/raw/**` | nenhuma alteração, leitura ou evidência utilizada; limitação processual registrada acima |
| Aplicação, build, lint, testes, banco, migrations e deploy | não executados por determinação do escopo |
| Commit e push | não realizados |

## Bloqueios, pendências e conclusão

Não há bloqueio material para concluir a versão Code-First baseada no código. Permanecem como `PENDENCIA_DE_DECISAO`, sem bloquear esta conclusão de cobertura: `CF-PD-002` para laboratório; `CF-PD-003` para detalhes da jornada; `CF-PD-005` para função, contrato e produção do IHFR; `CF-PD-006` para papéis, propriedade e permissões. Também permanecem abertas as alternativas `TD-008`, `TD-009`, `TD-010`, `TD-011`, `TD-012`, `TD-013`, `TD-014`, a autoridade formal, a validação científica e a aprovação normativa.

A conclusão significa somente que o pacote representa e classifica de forma rastreável o estado observável e as intenções de trabalho atuais. Não significa código completo, runtime validado, correção de vulnerabilidades, contrato científico final, arquitetura cartográfica definitiva, Figma avaliado ou produto aprovado.

`VERSAO_CODE_FIRST_BASEADA_NO_CODIGO_CONCLUIDA`

`FASE_2_COMPLEMENTACAO_INCREMENTAL_NAO_INICIADA`
