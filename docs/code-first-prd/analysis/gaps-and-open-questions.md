# Lacunas e perguntas abertas

- **Iniciativa:** `PRD Code-First`
- **Estado:** `EM_REVISAO`
- **Perguntas:** abertas e não respondidas
- **Decisões:** preservadas; nenhuma resolução é proposta neste documento

“Bloqueia o PRD” significa que a ausência impede consolidar com segurança o futuro `prd-code-first.md`; não autoriza iniciar esse documento. Autoridades indicadas como necessárias são funções decisórias, não pessoas designadas.

## Lacunas

### Governança e autoridades

| ID | Descrição | Evidência | Impacto | Bloqueia o PRD | Autoridade necessária | Pergunta | Próximo tratamento |
|---|---|---|---|---|---|---|---|
| `CF-GAP-001` | Autoridade de produto e aprovador do PRD Code-First não estão designados. | `PROJECT_CONTEXT.md:13-25`; `docs/governance/SOURCE_AUTHORITY.md:20,24`; responsáveis não especificados em `TECH_DECISIONS.md:31-37`. | Não há quem aprove objetivo, escopo e requisitos. | `SIM` | governança e produto | `CF-Q-001` | designar autoridade e registrar origem/mandato antes de qualquer PRD. |
| `CF-GAP-002` | Autoridades de ciência/IHFR, dados, UX, arquitetura, segurança e operação não estão identificadas nesta iniciativa. | limites em `PROJECT_CONTEXT.md:13-25`; matriz de autoridade em `docs/governance/SOURCE_AUTHORITY.md:20-28`. | Decisões transversais não podem ser validadas nem arbitradas. | `SIM` | governança e equipe responsável | `CF-Q-002` | designar responsáveis por assunto e limites de aprovação. |

### Objetivos e escopo

| ID | Descrição | Evidência | Impacto | Bloqueia o PRD | Autoridade necessária | Pergunta | Próximo tratamento |
|---|---|---|---|---|---|---|---|
| `CF-GAP-003` | Usuários prioritários, problema, resultados e fronteira do MVP atual não foram decididos nas fontes permitidas. | `PROJECT_CONTEXT.md:3-10` limita-se a identidade/propósito; landing em `src/app/page.tsx:17-109` é texto comercial. | Não há base para priorização ou critérios de sucesso. | `SIM` | produto com limites institucionais aplicáveis | `CF-Q-003` | produzir decisão de objetivos, públicos, resultados e fora de escopo. |
| `CF-GAP-004` | Alegações de IA, mapas, diagnóstico automatizado e IHFR não foram classificadas como atuais, pretendidas ou fora de escopo. | `src/app/page.tsx:121-207`, `src/app/page.tsx:277-313`; ausência de consumidores em `src/app/(private)/dashboard/maps.tsx:18-46` e `prisma/schema.prisma:128-142`; `CF-RISK-011`. | Comunicação e escopo podem divergir materialmente. | `SIM` | produto, ciência e arquitetura | `CF-Q-004` | classificar cada alegação e corrigir apenas em execução futura autorizada. |

### Produto

| ID | Descrição | Evidência | Impacto | Bloqueia o PRD | Autoridade necessária | Pergunta | Próximo tratamento |
|---|---|---|---|---|---|---|---|
| `CF-GAP-005` | Regras de cadastro, validação, consentimento e feedback de erro não estão definidas. | `src/app/register/page.tsx:25-49`; `src/app/api/auth/sign-up/route.ts:9-40`; `CF-RISK-006`,`019`. | Fluxo atual pode ser descrito indevidamente como regra desejada. | `SIM` | produto, segurança e privacidade/dados | `CF-Q-005` | decidir política de onboarding e seus estados antes de normatizar o fluxo. |
| `CF-GAP-006` | Workspace, dashboard, áreas e histórico não têm fronteira decidida entre protótipo e produto. | mocks em `src/app/(private)/workspace/page.tsx:19-168`, `src/app/(private)/dashboard/collects/collects-grid.tsx:3-32`, `src/app/(private)/dashboard/activity-history.tsx:25-110`; `CF-RISK-009`. | Mocks podem virar escopo por acidente. | `SIM` | produto e UX | `CF-Q-003`,`CF-Q-010` | classificar cada interface como atual, pretendida, exploratória ou descartada. |
| `CF-GAP-007` | Ciclo de vida de conta e efeito de `PENDING`, `ACTIVE`, `INACTIVE` e `BLOCKED` não estão definidos. | `prisma/schema.prisma:18,36-41`; login em `src/app/api/server/services/auth.service.ts:85-97`; `CF-RISK-005`. | Acesso e aprovação de usuários permanecem ambíguos. | `SIM` | produto e segurança | `CF-Q-006` | decidir transições, responsáveis e efeito de cada estado na sessão. |

### Domínio

| ID | Descrição | Evidência | Impacto | Bloqueia o PRD | Autoridade necessária | Pergunta | Próximo tratamento |
|---|---|---|---|---|---|---|---|
| `CF-GAP-008` | Ciclo de vida de laboratório, convite/código, adesão e saída não está definido. | relações em `prisma/schema.prisma:51-74`; interface mock em `src/app/(private)/workspace/page.tsx:46-87`; `CF-RISK-009`. | Entidade central não possui comportamento normativo. | `SIM` | produto e dados | `CF-Q-007` | definir conceitos, estados e transições de laboratório e vínculo. |
| `CF-GAP-009` | Propriedade, autoria e isolamento entre usuário, laboratório, área e coleta não estão decididos. | chaves em `prisma/schema.prisma:23-26`, `prisma/schema.prisma:51-126`; ausência de serviços de domínio; `CF-RISK-008`. | Risco de modelo multitenant e autorização incorretos. | `SIM` | produto, dados e segurança | `CF-Q-008` | decidir fronteiras de tenant e regras de acesso antes de requisitos de dados. |

### Laboratórios e permissões

| ID | Descrição | Evidência | Impacto | Bloqueia o PRD | Autoridade necessária | Pergunta | Próximo tratamento |
|---|---|---|---|---|---|---|---|
| `CF-GAP-010` | Semântica de `role`, `isAdmin` e permissões por laboratório não foi definida. | `prisma/schema.prisma:16,21,29-34`; `src/app/api/server/middlewares/admin.middleware.ts:3-11`; `CF-RISK-012`. | Não há matriz autorizativa confiável. | `SIM` | produto e segurança | `CF-Q-009` | aprovar matriz de papéis, escopos e ações. |
| `CF-GAP-011` | Administração existe apenas como script e middleware sem consumidor; casos de uso administrativos não foram decididos. | `src/app/api/server/scripts/superadmin.ts:27-76`; `src/app/api/server/middlewares/admin.middleware.ts:1-12`; `CF-CAP-012`. | Pode-se confundir infraestrutura com capacidade administrativa. | `NAO` | produto, segurança e operação | `CF-Q-009`,`CF-Q-016` | classificar casos de uso e corrigir risco do script em execução futura separada. |

### Ciência e IHFR

| ID | Descrição | Evidência | Impacto | Bloqueia o PRD | Autoridade necessária | Pergunta | Próximo tratamento |
|---|---|---|---|---|---|---|---|
| `CF-GAP-012` | Fórmula, variáveis, unidades, pesos, classes, limiares, qualidade e versionamento do IHFR não estão validados. | campos em `prisma/schema.prisma:128-149`; limites científicos em `docs/governance/SOURCE_AUTHORITY.md:21-22`; `CF-RISK-020`. | Não é possível normatizar diagnóstico ou cálculo. | `SIM` | responsáveis científicos designados | `CF-Q-011` | obter validação científica explícita e rastreável, sem inferir pelo schema. |
| `CF-GAP-013` | Papel da explicação por IA e sua relação com o diagnóstico científico não foi decidido. | `explanationAI` em `prisma/schema.prisma:139`; alegação em `src/app/page.tsx:200-205`; ausência de serviço consumidor; `CF-RISK-011`. | IA pode ser confundida com cálculo, interpretação ou recomendação validada. | `SIM` | ciência, produto, segurança e arquitetura | `CF-Q-004`,`CF-Q-011` | definir se existe caso de uso, limites, revisão e responsabilidade. |

### Dados

| ID | Descrição | Evidência | Impacto | Bloqueia o PRD | Autoridade necessária | Pergunta | Próximo tratamento |
|---|---|---|---|---|---|---|---|
| `CF-GAP-014` | Schema implementado não foi aprovado como modelo de domínio/dados; nomes, enumerações e cardinalidades podem ser provisórios. | `prisma/schema.prisma:10-240`; inconsistências aparentes em `prisma/schema.prisma:183,193,200-240`; `CF-RISK-021`. | Requisitos podem cristalizar defeitos ou decisões implícitas. | `SIM` | produto, dados e ciência conforme o campo | `CF-Q-017` | revisar modelo por autoridade e classificar cada divergência sem corrigi-la aqui. |
| `CF-GAP-015` | Política de migrations e Prisma Client não garante reprodutibilidade versionada. | artefatos ignorados por `.gitignore:20-27,49`; build em `package.json:7`; `CF-RISK-022`. | Banco e client podem divergir entre ambientes. | `NAO` | arquitetura, dados e operação | `CF-Q-017`,`CF-Q-020` | decidir versionamento, geração e gate de migração em pacote técnico futuro. |

### UX e Figma

| ID | Descrição | Evidência | Impacto | Bloqueia o PRD | Autoridade necessária | Pergunta | Próximo tratamento |
|---|---|---|---|---|---|---|---|
| `CF-GAP-016` | Nenhum Figma concreto ou estado de aprovação de UX foi identificado nas fontes permitidas. | inventário rastreado sem arquivo/URL/ID concreto; regra de autoridade em `docs/governance/SOURCE_AUTHORITY.md:25`. | Fluxos implementados não podem ser tratados como UX pretendida. | `SIM` | UX e produto | `CF-Q-014` | identificar artefatos, proveniência e estado, ou decidir explicitamente sua ausência. |
| `CF-GAP-017` | Rotas e ações referenciadas não possuem destino implementado ou decisão registrada. | perfil em `src/components/sidebar/index.tsx:15-19`; detalhes em `src/app/(private)/dashboard/collects/collect-card.tsx:74-79`; links `#` em `src/components/top-bar/index.tsx:20-28`; `CF-RISK-010`,`018`. | Jornada atual é interrompida e intenção é ambígua. | `SIM` | produto e UX | `CF-Q-015` | classificar cada destino como requerido, futuro, exploratório ou removível. |
| `CF-GAP-018` | Estados de loading, vazio, erro, acessibilidade e comportamento mobile não foram especificados nem auditados. | `src/contexts/auth.context.tsx:46-73`; `src/app/login/page.tsx:20-25`; `src/components/sidebar/index.tsx:21-63`; `src/app/globals.css:3-6`; `CF-RISK-017`–`019`. | Experiência e inclusão não têm critérios verificáveis. | `NAO` | UX, produto e acessibilidade | `CF-Q-014`,`CF-Q-019` | definir estados e critérios não funcionais após classificação do fluxo. |

### Arquitetura

| ID | Descrição | Evidência | Impacto | Bloqueia o PRD | Autoridade necessária | Pergunta | Próximo tratamento |
|---|---|---|---|---|---|---|---|
| `CF-GAP-019` | Fronteiras entre route handlers, serviços, domínio, banco e futuros componentes científicos não estão decididas. | estrutura atual em `src/app/api/server/`; decisões abertas `TD-009`,`TD-012` em `TECH_DECISIONS.md:46,49`. | Capacidades futuras podem acoplar ciência, UI e persistência sem contrato. | `SIM` | arquitetura, ciência e dados | `CF-Q-018` | decidir responsabilidades e contratos após clarificar casos de uso. |
| `CF-GAP-020` | Política de erros, logs, observabilidade e operação não foi localizada. | serviços retornam `null`/mensagem genérica em `src/app/api/server/services/users.service.ts:6-18` e `src/app/api/server/services/auth.service.ts:65-67`; ausência de infraestrutura rastreada. | Falhas e incidentes não têm diagnóstico ou SLO. | `NAO` | arquitetura, operação e segurança | `CF-Q-019` | definir observabilidade e tratamento sem registrar dados sensíveis. |

### Mapas e Python

| ID | Descrição | Evidência | Impacto | Bloqueia o PRD | Autoridade necessária | Pergunta | Próximo tratamento |
|---|---|---|---|---|---|---|---|
| `CF-GAP-021` | Casos de uso de mapa, camadas, fontes, precisão, privacidade e interação não foram definidos. | mapa placeholder em `src/app/(private)/dashboard/maps.tsx:18-46`; coordenadas no schema `prisma/schema.prisma:43-49`; `TD-014` em `TECH_DECISIONS.md:51`. | Não há base para escolher arquitetura cartográfica. | `SIM` | produto, UX, dados e ciência | `CF-Q-012` | decidir necessidades antes de selecionar biblioteca ou provedor. |
| `CF-GAP-022` | Relação e escolha entre OpenStreetMap, Plotly e Leaflet permanece aberta. | `TECH_DECISIONS.md:45,47-48,51`; nenhuma dependência correspondente em `package.json:12-41`. | Alternativas com papéis distintos podem ser comparadas incorretamente. | `SIM` | arquitetura, produto e UX | `CF-Q-013` | elaborar comparação após `CF-Q-012`, sem promover proposta. |
| `CF-GAP-023` | Responsabilidade do Python no IHFR e estratégia Next.js/Python não estão definidas nem implementadas. | `TECH_DECISIONS.md:46,49`; ausência de artefatos Python; schema sem consumidor em `prisma/schema.prisma:128-142`. | Cálculo, API e deploy científico não têm fronteira. | `SIM` | ciência, arquitetura e operação | `CF-Q-011`,`CF-Q-013`,`CF-Q-018` | validar ciência e só então decidir runtime e integração. |

### Segurança

| ID | Descrição | Evidência | Impacto | Bloqueia o PRD | Autoridade necessária | Pergunta | Próximo tratamento |
|---|---|---|---|---|---|---|---|
| `CF-GAP-024` | Política de autenticação/sessão, segredo JWT, redaction, superadmin e proteção de rotas não foi aprovada; código contém riscos críticos. | `src/app/api/server/services/auth.service.ts:6-18,55-63,89-97`; `src/proxy.ts:3-18`; `src/app/api/server/scripts/superadmin.ts:48-67`; `CF-RISK-001`–`005`. | Segurança atual não pode ser convertida em requisito ou baseline aceitável. | `SIM` | segurança, produto e operação | `CF-Q-016` | decisão de política e correção de código somente em execução futura autorizada. |
| `CF-GAP-025` | Validação runtime, rate limiting, privacidade e tratamento de dados pessoais não foram definidos. | `src/app/api/auth/sign-up/route.ts:9-16`; `src/app/api/auth/sign-in/route.ts:8-11`; mock em `src/app/(private)/dashboard/activity-history.tsx:25-110`; `CF-RISK-006`,`007`,`023`. | Abuso, dados inválidos e exposição de dados podem ocorrer. | `SIM` | segurança, dados/privacidade e produto | `CF-Q-016`,`CF-Q-017` | aprovar controles e política de dados; não reproduzir dados pessoais. |

### Requisitos não funcionais

| ID | Descrição | Evidência | Impacto | Bloqueia o PRD | Autoridade necessária | Pergunta | Próximo tratamento |
|---|---|---|---|---|---|---|---|
| `CF-GAP-026` | Metas de acessibilidade, responsividade, desempenho, disponibilidade e observabilidade não estão especificadas. | implementação parcial em `src/app/globals.css:1-6`, `src/components/sidebar/index.tsx:21-63`; ausência de metas/configuração; `CF-RISK-017`–`019`. | Não há critérios mensuráveis de qualidade. | `SIM` | produto, UX, arquitetura e operação | `CF-Q-019` | aprovar NFRs mensuráveis e seus responsáveis. |
| `CF-GAP-027` | Estratégia de testes e gate de qualidade não existe; lint está bloqueado por tooling. | `package.json:5-10`; `eslint.config.mjs:1-18`; ausência de testes/CI; `CF-RISK-013`–`015`. | Critérios não terão validação automatizada. | `NAO` | arquitetura/engenharia | `CF-Q-019` | decidir pirâmide de testes e corrigir tooling em tarefa separada. |

### Infraestrutura e deploy

| ID | Descrição | Evidência | Impacto | Bloqueia o PRD | Autoridade necessária | Pergunta | Próximo tratamento |
|---|---|---|---|---|---|---|---|
| `CF-GAP-028` | Ambientes, configuração, segredos, backup, restore e estratégia de deploy não estão evidenciados. | `prisma.config.ts:4-11`; `.gitignore:39-43`; `TD-013` em `TECH_DECISIONS.md:50`; `CF-RISK-016`,`022`. | Operação e recuperação não são reproduzíveis. | `SIM` | arquitetura, segurança e operação | `CF-Q-020` | decidir topologia e controles por ambiente sem expor valores. |
| `CF-GAP-029` | Vercel atual e Neon gratuito são relatos sem dono, plano ou ambiente verificados. | `TECH_DECISIONS.md:21,25,33,37`; adapter em `src/app/api/server/lib/prisma.ts:1-13`. | Limites, custo e disponibilidade podem ser assumidos incorretamente. | `SIM` | arquitetura, operação e produto | `CF-Q-018`,`CF-Q-020` | confirmar responsáveis, vigência e limites de cada serviço. |
| `CF-GAP-030` | CI/CD, controle de migrations e rollback não foram localizados. | ausência de workflows; migration ignorada por `.gitignore:21,27`; build em `package.json:7`; `CF-RISK-015`,`022`. | Mudanças podem chegar a ambientes sem gate ou reversão. | `SIM` | engenharia, dados e operação | `CF-Q-020` | decidir pipeline e política de schema antes de deploy verificável. |

### Distribuição das lacunas

| Grupo | Quantidade | Bloqueantes |
|---|---:|---:|
| Governança e autoridades | 2 | 2 |
| Objetivos e escopo | 2 | 2 |
| Produto | 3 | 3 |
| Domínio | 2 | 2 |
| Laboratórios e permissões | 2 | 1 |
| Ciência e IHFR | 2 | 2 |
| Dados | 2 | 1 |
| UX e Figma | 3 | 2 |
| Arquitetura | 2 | 1 |
| Mapas e Python | 3 | 3 |
| Segurança | 2 | 2 |
| Requisitos não funcionais | 2 | 1 |
| Infraestrutura e deploy | 3 | 3 |
| **Total** | **30** | **25** |

## Perguntas abertas

As vinte perguntas abaixo são mantidas sem resposta. “Ordem recomendada” é `RECOMENDACAO` analítica de sequenciamento, não prioridade aprovada.

| ID | Formulação neutra | Lacunas relacionadas | Decisão necessária | Autoridade | Impacto | Ordem recomendada | Destino após resposta |
|---|---|---|---|---|---|---:|---|
| `CF-Q-001` | Quem possui autoridade para definir objetivos, escopo, requisitos e aprovar um futuro PRD Code-First? | `CF-GAP-001` | designação formal e mandato | governança/equipe | habilita todas as aprovações de produto | 1 | registro de autoridade; depois, pacote de decisão e PRD se autorizado |
| `CF-Q-002` | Quem aprova, respectivamente, ciência/IHFR, dados, UX, arquitetura, segurança e operação, e quais são os limites de cada autoridade? | `CF-GAP-002` | designações por assunto | governança/equipe | evita decisões sem competência | 2 | registro de autoridades e protocolo de escalonamento |
| `CF-Q-003` | Quais são usuários prioritários, problema, resultados esperados, métricas e fronteira do MVP, incluindo fora de escopo? | `CF-GAP-003`,`006` | direção de produto e escopo | produto | fundamenta priorização e critérios de sucesso | 3 | pacote de objetivos/escopo; depois, PRD se autorizado |
| `CF-Q-004` | Como devem ser classificadas as alegações atuais de IA, mapas, diagnóstico automatizado e cálculo IHFR: capacidade atual, intenção futura, exploração ou fora de escopo? | `CF-GAP-004`,`013` | classificação de alegações | produto, ciência e arquitetura | impede que marketing seja tratado como requisito ou capacidade | 4 | registro de classificação e revisão futura da comunicação |
| `CF-Q-005` | Qual deve ser o fluxo de cadastro, incluindo elegibilidade, dados mínimos, validação, consentimento, mensagens e tratamento de duplicidade/erro? | `CF-GAP-005`,`025` | política de onboarding | produto, segurança e dados/privacidade | define entrada segura e compreensível | 9 | pacote de decisão de onboarding; depois, fluxo/requisitos se autorizados |
| `CF-Q-006` | Quais transições e permissões correspondem a `PENDING`, `ACTIVE`, `INACTIVE` e `BLOCKED`, quem as controla e quando uma sessão pode ser emitida ou revogada? | `CF-GAP-007`,`024` | ciclo de vida de conta/sessão | produto e segurança | resolve acesso de usuário pendente | 8 | política de conta e autenticação |
| `CF-Q-007` | Qual é o ciclo de vida de um laboratório, incluindo criação, código/convite, entrada, aprovação, saída, desativação e responsável? | `CF-GAP-006`,`008` | domínio e fluxo de laboratório | produto e dados | define entidade central do workspace | 6 | modelo de domínio e pacote de laboratório |
| `CF-Q-008` | Qual é a fronteira de isolamento entre usuários e laboratórios, e quem possui, visualiza ou altera áreas, coletas e diagnósticos? | `CF-GAP-009` | tenancy, propriedade e autoria | produto, dados e segurança | previne acesso cruzado e orienta consultas | 7 | política multitenant e matriz de acesso |
| `CF-Q-009` | Quais papéis existem, como `role` e `isAdmin` devem se relacionar e quais ações globais ou por laboratório cada papel pode executar? | `CF-GAP-010`,`011` | matriz de papéis/permissões | produto e segurança | habilita autorização consistente | 10 | matriz de autorização e decisão administrativa |
| `CF-Q-010` | Qual é o fluxo pretendido de áreas e coletas, incluindo cadastro, edição, status, autoria, histórico, exclusão, anexos e diagnóstico? | `CF-GAP-006`,`014` | casos de uso e estados de domínio | produto, dados e ciência | separa mocks do produto desejado | 11 | pacote de domínio/fluxos; depois, requisitos se autorizados |
| `CF-Q-011` | Qual formulação científica do IHFR está aprovada, com entradas, unidades, validações, pesos, agregação, classes/limiares, qualidade, versionamento e papel da IA/Python? | `CF-GAP-012`,`013`,`023` | norma científica e fronteira computacional | responsáveis científicos; arquitetura para implementação | bloqueia qualquer requisito confiável de diagnóstico | 5 | norma científica aprovada e, depois, decisão de implementação |
| `CF-Q-012` | Quais casos de uso de mapa são necessários, com camadas, fonte cartográfica, coordenadas, precisão, privacidade, filtros, interação e operação offline/online? | `CF-GAP-021` | escopo funcional e de dados geoespaciais | produto, UX, dados e ciência | antecede escolha de tecnologia de mapa | 12 | pacote de caso de uso cartográfico |
| `CF-Q-013` | Após definir os casos de uso, quais papéis cabem a OpenStreetMap, Plotly, Leaflet e eventual Python, e qual arquitetura de integração atende aos critérios aprovados? | `CF-GAP-022`,`023` | seleção e arquitetura de mapas/cálculo | arquitetura com produto, UX e ciência | resolve `TD-008`–`TD-012`,`TD-014` sem promoção silenciosa | 13 | atualização futura de decisões técnicas/ADR se autorizada |
| `CF-Q-014` | Quais artefatos Figma/UX são aplicáveis, qual seu estado de aprovação e quais jornadas, estados, acessibilidade e breakpoints governam? | `CF-GAP-016`,`018` | fonte normativa de UX e critérios | UX e produto | separa implementação atual de intenção visual | 14 | registro/classificação de UX; depois, especificação se autorizada |
| `CF-Q-015` | As rotas de perfil e detalhes de área, links institucionais e ações hoje placeholder devem existir, ser substituídos ou removidos? | `CF-GAP-006`,`017` | destino de navegação e ações | produto e UX | elimina rotas quebradas sem presumir requisito | 15 | decisão por rota/ação e backlog futuro autorizado |
| `CF-Q-016` | Qual política de segurança deve reger hash nas respostas, segredo/rotação JWT, sessão/cookie, CSRF, proteção de rotas, superadmin, rate limiting, validação e auditoria? | `CF-GAP-005`,`007`,`011`,`024`,`025` | baseline de autenticação e segurança | segurança com produto/operação | trata riscos críticos sem normalizar o código atual | 16 | política de segurança e plano de correção separado |
| `CF-Q-017` | Qual modelo de dados é pretendido, com nomes, enumerações, cardinalidades, unidades, retenção, privacidade, migrations e dados de demonstração? | `CF-GAP-009`,`014`,`015`,`025` | governança/modelo de dados | dados, produto, ciência e privacidade | impede schema provisório de virar domínio aprovado | 17 | modelo de dados aprovado e política de migration |
| `CF-Q-018` | Quais fronteiras e contratos devem separar frontend, APIs, serviços, Prisma/Neon e futuros componentes científicos, e quem responde por cada parte? | `CF-GAP-019`,`023`,`029` | arquitetura e ownership | arquitetura, ciência, dados e operação | orienta integração e responsabilidades | 18 | decisão arquitetural e ADR futuro se justificável/autorizado |
| `CF-Q-019` | Quais metas não funcionais e gates são exigidos para acessibilidade, responsividade, desempenho, disponibilidade, observabilidade, erros, testes, lint e segurança? | `CF-GAP-018`,`020`,`026`,`027` | NFRs mensuráveis e validação | produto, UX, arquitetura, segurança e operação | cria critérios verificáveis de qualidade | 19 | catálogo de NFRs e estratégia de verificação futura |
| `CF-Q-020` | Quais ambientes, provedores, planos, responsáveis e controles de CI/CD, segredos, backup, migrations, rollback e deploy devem ser adotados, incluindo o papel atual/futuro de Vercel e Neon? | `CF-GAP-015`,`028`,`029`,`030` | estratégia de infraestrutura/deploy | arquitetura, operação, segurança e dados | torna implantação e recuperação reproduzíveis | 20 | estratégia operacional e atualização futura de decisões técnicas |

## Ponto de parada

Há 30 lacunas, das quais 25 bloqueiam a consolidação segura de um futuro PRD, e 20 perguntas abertas. Nenhuma pergunta foi respondida, nenhum responsável individual foi atribuído e nenhum destino futuro foi criado. A revisão humana deve confirmar cobertura, autoridades e ordem antes de qualquer pacote de decisão.
