# Lacunas e perguntas abertas

- **Iniciativa:** `PRD Code-First`
- **Estado:** `EM_REVISAO`
- **Perguntas:** abertas; parcelas funcionais de `CF-Q-004` e `CF-Q-012` relativas à presença e ao papel do mapa foram respondidas por `CF-PD-007`, sem encerrar o detalhamento cartográfico
- **Decisões:** preservadas; a direção humana do mapa é registrada sem promover decisões técnicas ou de UX

“Classificação do bloqueio” segue a taxonomia de [`../governance/source-policy.md`](../governance/source-policy.md): `BLOQUEANTE_GLOBAL` impede qualquer PRD confiável; `BLOQUEANTE_SE_NO_ESCOPO` impede somente a parte que dependa do assunto; `NAO_BLOQUEANTE_DO_PRD` encaminha o tema para arquitetura, engenharia, operação, backlog ou plano de implementação. A classificação não autoriza iniciar o PRD. Autoridades indicadas são funções decisórias, não pessoas designadas.

## Lacunas

### Governança e autoridades

| ID | Descrição | Evidência | Impacto | Classificação do bloqueio | Autoridade necessária | Pergunta | Próximo tratamento |
|---|---|---|---|---|---|---|---|
| `CF-GAP-001` | Autoridade de produto e aprovador do PRD Code-First não estão designados. | `PROJECT_CONTEXT.md:13-25`; `docs/governance/SOURCE_AUTHORITY.md:20,24`; responsáveis não especificados em `TECH_DECISIONS.md:31-37`. | Não há quem aprove objetivo, escopo e requisitos. | `BLOQUEANTE_GLOBAL` | governança e produto | `CF-Q-001` | designar autoridade e registrar origem/mandato antes de qualquer PRD. |
| `CF-GAP-002` | Autoridades de ciência/IHFR, dados, UX, arquitetura, segurança e operação não estão identificadas nesta iniciativa. | limites em `PROJECT_CONTEXT.md:13-25`; matriz de autoridade em `docs/governance/SOURCE_AUTHORITY.md:20-28`. | Decisões nos assuntos incluídos no escopo não podem ser validadas nem arbitradas. | `BLOQUEANTE_SE_NO_ESCOPO` | governança e equipe responsável | `CF-Q-002` | designar responsáveis para cada assunto que permanecer no escopo e seus limites de aprovação. |

### Objetivos e escopo

| ID | Descrição | Evidência | Impacto | Classificação do bloqueio | Autoridade necessária | Pergunta | Próximo tratamento |
|---|---|---|---|---|---|---|---|
| `CF-GAP-003` | Usuários prioritários, problema, resultados e fronteira do MVP atual não foram decididos nas fontes permitidas. | `PROJECT_CONTEXT.md:3-10` limita-se a identidade/propósito; landing em `src/app/page.tsx:17-109` é texto comercial. | Não há base para priorização ou critérios de sucesso. | `BLOQUEANTE_GLOBAL` | produto com limites institucionais aplicáveis | `CF-Q-003` | produzir decisão de objetivos, públicos, resultados e fora de escopo. |
| `CF-GAP-004` | Alegações de IA, diagnóstico automatizado e cálculo IHFR ainda não estão integralmente classificadas como atuais, pretendidas ou fora de escopo. | `src/app/page.tsx:121-207`, `src/app/page.tsx:277-313`; ausência de consumidor de IHFR em `prisma/schema.prisma:128-142`; `CF-RISK-011`. | As alegações podem divergir do escopo e da ciência. | `BLOQUEANTE_SE_NO_ESCOPO` | produto, ciência e arquitetura conforme a alegação | `CF-Q-004` | classificar separadamente IA, diagnóstico automatizado e cálculo IHFR. |

`DIRECAO_CONFIRMADA_PARA_RASCUNHO` — A parcela anterior de `CF-GAP-004` relativa ao mapa foi resolvida: o mapa integra o núcleo funcional do MVP. Seu detalhamento permanece em `CF-GAP-021`.

### Produto

| ID | Descrição | Evidência | Impacto | Classificação do bloqueio | Autoridade necessária | Pergunta | Próximo tratamento |
|---|---|---|---|---|---|---|---|
| `CF-GAP-005` | Regras de cadastro, validação, consentimento e feedback de erro não estão definidas. | `src/app/register/page.tsx:25-49`; `src/app/api/auth/sign-up/route.ts:9-40`; `CF-RISK-006`, `CF-RISK-019`. | Fluxo atual pode ser descrito indevidamente como regra desejada. | `BLOQUEANTE_SE_NO_ESCOPO` | produto, segurança e privacidade/dados | `CF-Q-005` | decidir política de onboarding se cadastro permanecer no escopo. |
| `CF-GAP-006` | Workspace, dashboard, áreas e histórico não têm fronteira decidida entre protótipo e produto. | mocks em `src/app/(private)/workspace/page.tsx:19-168`, `src/app/(private)/dashboard/collects/collects-grid.tsx:3-32`, `src/app/(private)/dashboard/activity-history.tsx:25-110`; `CF-RISK-009`. | Mocks podem virar escopo por acidente. | `BLOQUEANTE_SE_NO_ESCOPO` | produto e UX | `CF-Q-003`, `CF-Q-007`, `CF-Q-010` | classificar cada interface como atual, pretendida, exploratória ou descartada. |
| `CF-GAP-007` | Ciclo de vida de conta e efeito de `PENDING`, `ACTIVE`, `INACTIVE` e `BLOCKED` não estão definidos. | `prisma/schema.prisma:18,36-41`; login em `src/app/api/server/services/auth.service.ts:85-97`; `CF-RISK-005`. | Acesso e aprovação de usuários permanecem ambíguos. | `BLOQUEANTE_SE_NO_ESCOPO` | produto e segurança | `CF-Q-006` | decidir transições, responsáveis e efeito de cada estado se contas permanecerem no escopo. |

### Domínio

| ID | Descrição | Evidência | Impacto | Classificação do bloqueio | Autoridade necessária | Pergunta | Próximo tratamento |
|---|---|---|---|---|---|---|---|
| `CF-GAP-008` | Ciclo de vida de laboratório, convite/código, adesão e saída não está definido. | relações em `prisma/schema.prisma:51-74`; interface mock em `src/app/(private)/workspace/page.tsx:46-87`; `CF-RISK-009`. | Entidade central não possui comportamento normativo. | `BLOQUEANTE_SE_NO_ESCOPO` | produto e dados | `CF-Q-007` | definir conceitos, estados e transições se laboratório permanecer no escopo. |
| `CF-GAP-009` | Propriedade, autoria e isolamento entre usuário, laboratório, área e coleta não estão decididos. | chaves em `prisma/schema.prisma:23-26`, `prisma/schema.prisma:51-126`; ausência de serviços de domínio; `CF-RISK-008`. | Risco de modelo multitenant e autorização incorretos. | `BLOQUEANTE_SE_NO_ESCOPO` | produto, dados e segurança | `CF-Q-008` | decidir fronteiras de tenant e regras de acesso para os conceitos incluídos. |

### Laboratórios e permissões

| ID | Descrição | Evidência | Impacto | Classificação do bloqueio | Autoridade necessária | Pergunta | Próximo tratamento |
|---|---|---|---|---|---|---|---|
| `CF-GAP-010` | Semântica de `role`, `isAdmin` e permissões por laboratório não foi definida. | `prisma/schema.prisma:16,21,29-34`; `src/app/api/server/middlewares/admin.middleware.ts:3-11`; `CF-RISK-012`. | Não há matriz autorizativa confiável. | `BLOQUEANTE_SE_NO_ESCOPO` | produto e segurança | `CF-Q-009` | aprovar matriz de papéis, escopos e ações se permissões permanecerem no escopo. |
| `CF-GAP-011` | Administração existe apenas como script e middleware sem consumidor; casos de uso administrativos não foram decididos. | `src/app/api/server/scripts/superadmin.ts:27-76`; `src/app/api/server/middlewares/admin.middleware.ts:1-12`; `CF-CAP-012`; `CF-RISK-003`, `CF-RISK-012`. | Pode-se confundir infraestrutura com capacidade administrativa. | `BLOQUEANTE_SE_NO_ESCOPO` | produto e segurança para comportamento; operação para o script | `CF-Q-009`, `CF-Q-016` | classificar casos administrativos; corrigir o script somente em execução técnica separada. |

### Ciência e IHFR

| ID | Descrição | Evidência | Impacto | Classificação do bloqueio | Autoridade necessária | Pergunta | Próximo tratamento |
|---|---|---|---|---|---|---|---|
| `CF-GAP-012` | Fórmula, variáveis, unidades, pesos, classes, limiares, qualidade e versionamento do IHFR não estão validados. O schema registra `algorithmVersion` no diagnóstico, mas não identifica a versão do contrato científico aplicada à coleta nem a cadeia integral contrato–algoritmo–diagnóstico. | `IHFRDiagnosis.collectionDataId`, `IHFRDiagnosis.algorithmVersion`, models ambientais em `prisma/schema.prisma`; `CF-RISK-020`; revisão H08 em [`../reviews/product-hypotheses-human-review.md`](../reviews/product-hypotheses-human-review.md). | A ausência não impede iniciar o rascunho geral, mas impede aprovar requisitos detalhados de cálculo, variáveis, pesos, agregação, classes, limiares e rastreabilidade científica integral do IHFR. | `BLOQUEANTE_SE_NO_ESCOPO` | responsáveis científicos designados; produto e dados para a rastreabilidade aplicável | `CF-Q-011` | registrar o IHFR como capacidade central com dependência científica explícita; obter validação antes de aprovar as partes dependentes; distinguir versão de contrato e versão de algoritmo sem inferir fórmula ou regra científica pelo schema. |
| `CF-GAP-013` | Papel da explicação por IA e sua relação com o diagnóstico científico não foi decidido. | `explanationAI` em `prisma/schema.prisma:139`; alegação em `src/app/page.tsx:200-205`; ausência de serviço consumidor; `CF-RISK-011`. | IA pode ser confundida com cálculo, interpretação ou recomendação validada. | `BLOQUEANTE_SE_NO_ESCOPO` | produto define escopo; ciência valida limites científicos; segurança e arquitetura tratam controles técnicos | `CF-Q-004` | definir se IA permanece no escopo e então separar comportamento, ciência e implementação. |

### Dados

| ID | Descrição | Evidência | Impacto | Classificação do bloqueio | Autoridade necessária | Pergunta | Próximo tratamento |
|---|---|---|---|---|---|---|---|
| `CF-GAP-014` | Schema implementado não foi aprovado como modelo de domínio/dados; nomes, enumerações e cardinalidades podem ser provisórios. | `prisma/schema.prisma:10-240`; inconsistências aparentes em `prisma/schema.prisma:183,193,200-240`; `CF-RISK-020`, `CF-RISK-021`. | O código pode ser confundido com modelo pretendido, embora o PRD possa definir conceitos sem aprovar o schema atual. | `NAO_BLOQUEANTE_DO_PRD` | produto, dados e ciência conforme o conceito | `CF-Q-017` | usar o schema como evidência de implementação e decidir conceitos pretendidos separadamente. |
| `CF-GAP-015` | Política de migrations e Prisma Client não assegura reprodutibilidade versionada. | artefatos ignorados por `.gitignore:20-27,49`; build em `package.json:7`; `CF-RISK-022`. | Banco e client podem divergir entre ambientes. | `NAO_BLOQUEANTE_DO_PRD` | arquitetura, dados e operação | `CF-Q-017`, `CF-Q-020` | decidir versionamento, geração e gate de migração em tratamento técnico futuro. |

### UX e Figma

| ID | Descrição | Evidência | Impacto | Classificação do bloqueio | Autoridade necessária | Pergunta | Próximo tratamento |
|---|---|---|---|---|---|---|---|
| `CF-GAP-016` | Nenhum Figma concreto ou estado de aprovação de UX foi identificado nas fontes permitidas. | inventário rastreado sem arquivo/URL/ID concreto; regra de autoridade em `docs/governance/SOURCE_AUTHORITY.md:25`. | A ausência não impede compreender o produto pelo código, formular hipóteses de UX, iniciar o rascunho ou definir jornadas com confirmação humana. | `NAO_BLOQUEANTE_DO_PRD` | UX e produto quando houver artefato aplicável | `CF-Q-014` | se fornecido, identificar e classificar o artefato, compará-lo com o código e usá-lo como evidência complementar; sem Figma, prosseguir com código, decisões e validação humana. |
| `CF-GAP-017` | Rotas e ações referenciadas não possuem destino implementado ou decisão registrada. | perfil em `src/components/sidebar/index.tsx:15-19`; detalhes em `src/app/(private)/dashboard/collects/collect-card.tsx:74-79`; links `#` em `src/components/top-bar/index.tsx:20-28`; `CF-RISK-010`. | Jornada atual é interrompida e intenção é ambígua. | `BLOQUEANTE_SE_NO_ESCOPO` | produto e UX | `CF-Q-015` | classificar cada destino incluído como requerido, futuro, exploratório ou removível. |
| `CF-GAP-018` | Estados de loading, vazio, erro, acessibilidade e comportamento mobile não foram especificados nem auditados. | `src/contexts/auth.context.tsx:46-73`; `src/app/login/page.tsx:20-25`; `src/components/sidebar/index.tsx:21-63`; `src/app/globals.css:3-6`; `CF-RISK-017`, `CF-RISK-018`, `CF-RISK-019`. | Experiência e inclusão não têm critérios verificáveis. | `BLOQUEANTE_SE_NO_ESCOPO` | UX, produto e acessibilidade | `CF-Q-014`, `CF-Q-019` | definir estados e critérios para as jornadas que permanecerem no escopo. |

### Arquitetura

| ID | Descrição | Evidência | Impacto | Classificação do bloqueio | Autoridade necessária | Pergunta | Próximo tratamento |
|---|---|---|---|---|---|---|---|
| `CF-GAP-019` | Fronteiras entre route handlers, serviços, domínio, banco e futuros componentes científicos não estão decididas. | estrutura atual em `src/app/api/server/`; decisões abertas `TD-009`, `TD-012` em `TECH_DECISIONS.md:46,49`. | Capacidades futuras podem acoplar ciência, UI e persistência sem contrato. | `NAO_BLOQUEANTE_DO_PRD` | arquitetura, com ciência e dados consultados nos contratos aplicáveis | `CF-Q-018` | decidir responsabilidades e contratos depois que ciência e casos de uso estiverem definidos. |
| `CF-GAP-020` | Política de erros, logs, observabilidade e operação não foi localizada. | serviços retornam `null`/mensagem genérica em `src/app/api/server/services/users.service.ts:6-18` e `src/app/api/server/services/auth.service.ts:65-67`; ausência de infraestrutura rastreada; `CF-RISK-019`. | Falhas e incidentes não têm diagnóstico ou SLO. | `NAO_BLOQUEANTE_DO_PRD` | arquitetura, operação e segurança | `CF-Q-019` | definir observabilidade e tratamento técnico sem registrar dados sensíveis. |

### Mapas e Python

| ID | Descrição | Evidência | Impacto | Classificação do bloqueio | Autoridade necessária | Pergunta | Próximo tratamento |
|---|---|---|---|---|---|---|---|
| `CF-GAP-021` | As funções do mapa no núcleo foram definidas por `CF-PD-007`, mas representação geométrica, dados espaciais, camadas, fontes, precisão, privacidade, filtros e interação não foram detalhados. | direção humana desta execução; mapa placeholder em `src/app/(private)/dashboard/maps.tsx:18-46`; coordenadas no schema `prisma/schema.prisma:43-49`; `TD-014` em `TECH_DECISIONS.md:51`; `CF-RISK-011`. | O PRD pode definir cadastro/representação de áreas, associação espacial e visualização territorial, mas ainda não pode aprovar o comportamento cartográfico detalhado. | `BLOQUEANTE_SE_NO_ESCOPO` | produto, UX, dados e ciência conforme o detalhe ou camada | `CF-Q-012` | detalhar os casos de uso confirmados e seus critérios antes da escolha de tecnologia. |
| `CF-GAP-022` | Resolvida parcialmente: Leaflet/React-Leaflet são a escolha local planejada para o mapa mínimo e Plotly foi confirmado para gráficos analíticos futuros; provedor, arquitetura cartográfica definitiva, integração frontend versus Plotly Python, entradas e gráficos concretos permanecem abertos. | `TD-010` confirmado em `TECH_DECISIONS.md`; `specs/008-territorial-map/**`; nenhuma dependência Plotly ou Python foi introduzida. | Confundir os papéis ainda poderia transformar Plotly em segundo motor cartográfico ou antecipar ciência/contratos não integrados. | `NAO_BLOQUEANTE_DO_PRD` | arquitetura, consultando produto, UX, dados e ciência quando aplicável | `CF-Q-013` | planejar a entrega Plotly somente após a IMP-009; preservar Leaflet no mapa mínimo e decidir integração/dados/gráficos sem antecipar implementação. |
| `CF-GAP-023` | Responsabilidade do Python no IHFR e estratégia Next.js/Python não estão definidas nem implementadas. | `TECH_DECISIONS.md:46,49`; ausência de artefatos Python; schema sem consumidor em `prisma/schema.prisma:128-142`. | Runtime, API e deploy científico não têm fronteira técnica definida. | `NAO_BLOQUEANTE_DO_PRD` | arquitetura; ciência fornece o contrato científico, não a escolha de runtime | `CF-Q-018` | após validar ciência e casos de uso, avaliar necessidade de Python e integração. |

### Segurança

| ID | Descrição | Evidência | Impacto | Classificação do bloqueio | Autoridade necessária | Pergunta | Próximo tratamento |
|---|---|---|---|---|---|---|---|
| `CF-GAP-024` | Política de autenticação/sessão, segredo JWT, redaction, superadmin e proteção de rotas não foi aprovada; código contém riscos críticos. | `src/app/api/server/services/auth.service.ts:6-18,55-63,89-97`; `src/proxy.ts:3-18`; `src/app/api/server/scripts/superadmin.ts:48-67`; `CF-RISK-001`, `CF-RISK-002`, `CF-RISK-003`, `CF-RISK-004`, `CF-RISK-005`. | Comportamento pretendido e correção do código atual precisam permanecer separados. | `BLOQUEANTE_SE_NO_ESCOPO` | produto define comportamento; segurança e operação definem controles | `CF-Q-016` | definir política para os fluxos no escopo; corrigir código somente em execução futura autorizada. |
| `CF-GAP-025` | Validação runtime, rate limiting, privacidade e tratamento de dados pessoais não foram definidos. | `src/app/api/auth/sign-up/route.ts:9-16`; `src/app/api/auth/sign-in/route.ts:8-11`; mock em `src/app/(private)/dashboard/activity-history.tsx:25-110`; `CF-RISK-006`, `CF-RISK-007`, `CF-RISK-023`. | Abuso, dados inválidos e exposição de dados podem ocorrer. | `BLOQUEANTE_SE_NO_ESCOPO` | segurança, dados/privacidade e produto | `CF-Q-016`, `CF-Q-017` | definir comportamento e controles para entradas e dados pessoais que permanecerem no escopo. |

### Requisitos não funcionais

| ID | Descrição | Evidência | Impacto | Classificação do bloqueio | Autoridade necessária | Pergunta | Próximo tratamento |
|---|---|---|---|---|---|---|---|
| `CF-GAP-026` | Metas de acessibilidade, responsividade, desempenho, disponibilidade e observabilidade não estão especificadas. | implementação parcial em `src/app/globals.css:1-6`, `src/components/sidebar/index.tsx:21-63`; ausência de metas/configuração; `CF-RISK-017`, `CF-RISK-018`, `CF-RISK-019`. | Não há critérios mensuráveis de qualidade para os comportamentos incluídos. | `BLOQUEANTE_SE_NO_ESCOPO` | produto e UX para resultados; arquitetura e operação para métricas técnicas | `CF-Q-019` | aprovar NFRs mensuráveis para o escopo definido. |
| `CF-GAP-027` | Estratégia de testes e gate de qualidade não foi localizada; há relato anterior de falha de tooling no lint, não reproduzido nesta execução e `NAO_VERIFICADO`. | `package.json:5-10`; `eslint.config.mjs:1-18`; ausência de testes/CI; `CF-RISK-013`, `CF-RISK-014`, `CF-RISK-015`. | A implementação não possui gate automatizado evidenciado. | `NAO_BLOQUEANTE_DO_PRD` | arquitetura/engenharia | `CF-Q-019` | decidir estratégia de testes e verificar/corrigir tooling em tarefa separada. |

### Infraestrutura e deploy

| ID | Descrição | Evidência | Impacto | Classificação do bloqueio | Autoridade necessária | Pergunta | Próximo tratamento |
|---|---|---|---|---|---|---|---|
| `CF-GAP-028` | Ambientes, configuração, segredos, backup, restore e estratégia de deploy não estão evidenciados. | `prisma.config.ts:4-11`; `.gitignore:39-43`; `TD-013` em `TECH_DECISIONS.md:50`; `CF-RISK-002`, `CF-RISK-016`, `CF-RISK-022`. | Operação e recuperação não são reproduzíveis. | `NAO_BLOQUEANTE_DO_PRD` | arquitetura, segurança e operação | `CF-Q-020` | decidir topologia e controles por ambiente sem expor valores. |
| `CF-GAP-029` | Vercel atual e Neon gratuito são relatos sem dono, plano ou ambiente verificados. | `TECH_DECISIONS.md:21,25,33,37`; adapter em `src/app/api/server/lib/prisma.ts:1-13`; `CF-RISK-016`. | Limites, custo e disponibilidade podem ser assumidos incorretamente. | `NAO_BLOQUEANTE_DO_PRD` | arquitetura, operação e produto para restrições de custo/serviço | `CF-Q-020` | confirmar responsáveis, vigência e limites de cada serviço. |
| `CF-GAP-030` | CI/CD, controle de migrations e rollback não foram localizados. | ausência de workflows; migration ignorada por `.gitignore:21,27`; build em `package.json:7`; `CF-RISK-015`, `CF-RISK-022`. | Mudanças podem chegar a ambientes sem gate ou reversão. | `NAO_BLOQUEANTE_DO_PRD` | engenharia, dados e operação | `CF-Q-020` | decidir pipeline e política de schema antes de deploy verificável. |

### Papel dos riscos de segurança e qualidade

O catálogo de riscos permanece como contexto para impedir que defeitos atuais virem requisitos, não como plano de correção. Vulnerabilidades e problemas de privacidade, qualidade, deploy ou tooling não precisam ser resolvidos individualmente antes do primeiro rascunho. O PRD deve definir resultados de produto e requisitos não funcionais no nível adequado; redaction de hash, rotação JWT, CSRF, rate limiting, migrations, CI/CD e rollback pertencem principalmente à arquitetura, segurança e implementação. Somente decisões que alterem comportamento visível, acesso, papéis, privacidade ou escopo precisam ser confirmadas como decisões de produto.

### Distribuição das lacunas

| Grupo | Quantidade | `BLOQUEANTE_GLOBAL` | `BLOQUEANTE_SE_NO_ESCOPO` | `NAO_BLOQUEANTE_DO_PRD` |
|---|---:|---:|---:|---:|
| Governança e autoridades | 2 | 1 | 1 | 0 |
| Objetivos e escopo | 2 | 1 | 1 | 0 |
| Produto | 3 | 0 | 3 | 0 |
| Domínio | 2 | 0 | 2 | 0 |
| Laboratórios e permissões | 2 | 0 | 2 | 0 |
| Ciência e IHFR | 2 | 0 | 2 | 0 |
| Dados | 2 | 0 | 0 | 2 |
| UX e Figma | 3 | 0 | 2 | 1 |
| Arquitetura | 2 | 0 | 0 | 2 |
| Mapas e Python | 3 | 0 | 1 | 2 |
| Segurança | 2 | 0 | 2 | 0 |
| Requisitos não funcionais | 2 | 0 | 1 | 1 |
| Infraestrutura e deploy | 3 | 0 | 0 | 3 |
| **Total** | **30** | **2** | **17** | **11** |

## Perguntas abertas

As vinte perguntas abaixo são mantidas sem resposta. “Ordem recomendada” é `RECOMENDACAO` analítica de sequenciamento, não prioridade aprovada. `CF-Q-016`, `CF-Q-017`, `CF-Q-019` e `CF-Q-020` são inventários auxiliares e não precisam ser integralmente respondidos antes do primeiro rascunho do PRD.

| ID | Formulação neutra | Lacunas relacionadas | Decisão necessária | Autoridade | Impacto | Ordem recomendada | Destino após resposta |
|---|---|---|---|---|---|---:|---|
| `CF-Q-001` | Quem possui autoridade para definir objetivos, escopo, requisitos e aprovar um futuro PRD Code-First? | `CF-GAP-001` | designação formal e mandato | governança/equipe | habilita todas as aprovações de produto | 1 | registro de autoridade; depois, pacote de decisão e PRD se autorizado |
| `CF-Q-002` | Quem aprova, respectivamente, ciência/IHFR, dados, UX, arquitetura, segurança e operação, e quais são os limites de cada autoridade? | `CF-GAP-002` | designações por assunto | governança/equipe | evita decisões sem competência | 2 | registro de autoridades e protocolo de escalonamento |
| `CF-Q-003` | Quais são usuários prioritários, problema, resultados esperados, métricas e fronteira do MVP, incluindo fora de escopo? | `CF-GAP-003`, `CF-GAP-006` | direção de produto e escopo | produto | fundamenta priorização e critérios de sucesso | 3 | registro futuro de objetivos/escopo; depois, PRD se autorizado |
| `CF-Q-004` | Como devem ser classificadas as alegações atuais de IA, diagnóstico automatizado e cálculo IHFR: capacidade atual, intenção futura, exploração ou fora de escopo? | `CF-GAP-004`, `CF-GAP-013` | classificação das alegações ainda abertas | produto define escopo; ciência e arquitetura validam somente seus respectivos limites | impede que marketing seja tratado como requisito ou capacidade | 4 | registro de classificação e revisão futura da comunicação |
| `CF-Q-005` | Qual deve ser o fluxo de cadastro, incluindo elegibilidade, dados mínimos, validação, consentimento, mensagens e tratamento de duplicidade/erro? | `CF-GAP-005` | política de onboarding | produto, segurança e dados/privacidade | define entrada segura e compreensível | 9 | registro futuro de onboarding; depois, fluxo/requisitos se autorizados |
| `CF-Q-006` | Quais transições e permissões correspondem a `PENDING`, `ACTIVE`, `INACTIVE` e `BLOCKED`, quem as controla e quando uma sessão pode ser emitida ou revogada? | `CF-GAP-007` | ciclo de vida de conta/sessão | produto e segurança | resolve acesso de usuário pendente | 8 | política futura de conta e autenticação |
| `CF-Q-007` | Qual é o ciclo de vida de um laboratório, incluindo criação, código/convite, entrada, aprovação, saída, desativação e responsável? | `CF-GAP-006`, `CF-GAP-008` | domínio e fluxo de laboratório | produto e dados | define entidade central do workspace | 6 | modelo de domínio futuro para laboratório |
| `CF-Q-008` | Qual é a fronteira de isolamento entre usuários e laboratórios, e quem possui, visualiza ou altera áreas, coletas e diagnósticos? | `CF-GAP-009` | tenancy, propriedade e autoria | produto, dados e segurança | previne acesso cruzado e orienta consultas | 7 | política multitenant e matriz de acesso |
| `CF-Q-009` | Quais papéis existem, como `role` e `isAdmin` devem se relacionar e quais ações globais ou por laboratório cada papel pode executar? | `CF-GAP-010`, `CF-GAP-011` | matriz de papéis/permissões | produto e segurança | habilita autorização consistente | 10 | matriz futura de autorização e decisão administrativa |
| `CF-Q-010` | Qual é o fluxo pretendido de áreas e coletas, incluindo cadastro, edição, status, autoria, histórico, exclusão, anexos e diagnóstico? | `CF-GAP-006` | casos de uso e estados de domínio | produto, dados e ciência conforme os dados/diagnóstico | separa mocks do produto desejado | 11 | registro futuro de domínio/fluxos; depois, requisitos se autorizados |
| `CF-Q-011` | Qual contrato científico do IHFR está aprovado, incluindo entradas, unidades, validações, pesos, agregação, classes/limiares, qualidade dos dados, identificação da versão do contrato, versão do algoritmo e relação rastreável entre ambas? | `CF-GAP-012` | contrato científico do IHFR e rastreabilidade de suas versões | responsáveis científicos designados; produto e dados nas responsabilidades aplicáveis | bloqueia a aprovação das regras científicas detalhadas e da cadeia ampliada proposta em H08, mas não a compreensão das demais jornadas do produto | 5 | norma científica aprovada para as partes dependentes; decisão de dados sobre a representação das versões; decisões técnicas permanecem separadas |
| `CF-Q-012` | Para cadastro/representação espacial de áreas, associação espacial de coletas e dados e visualização territorial de coletas, gráficos e resultados IHFR, quais geometrias, dados espaciais, camadas, fontes, precisão, privacidade, filtros, interações e modos de operação são necessários? | `CF-GAP-021`; direção funcional em `CF-PD-007` | detalhamento funcional, de UX e de dados geoespaciais | produto, UX, dados e ciência conforme o aspecto | antecede escolha de tecnologia de mapa sem reabrir sua presença no MVP | 12 | pacote de caso de uso cartográfico |
| `CF-Q-013` | Qual provedor e arquitetura cartográfica definitiva atendem ao mapa Leaflet planejado e, na entrega posterior à IMP-009, como Plotly será integrado, com quais contratos de entrada e para quais gráficos concretos? | `CF-GAP-022` | arquitetura cartográfica e integração analítica ainda abertas | arquitetura decide; produto, UX, dados e ciência fornecem os critérios aplicáveis | preserva a separação entre mapa mínimo e gráficos futuros | 13 | planejar a entrega Plotly sem atribuir novo `IMP-*`, sem depender da IMP-010 e sem antecipar Python, PostGIS ou dados não integrados |
| `CF-Q-014` | Quais artefatos Figma/UX devem ser considerados e, para cada artefato fornecido, qual é seu estado e como ele se relaciona com jornadas, estados, acessibilidade, breakpoints e código observado? | `CF-GAP-016`, `CF-GAP-018` | classificação dos artefatos fornecidos e critérios de UX | UX e produto | acrescenta evidência complementar de intenção visual sem condicionar o PRD à existência de Figma | 14 | registro e comparação dos artefatos fornecidos; depois, especificação se autorizada |
| `CF-Q-015` | As rotas de perfil e detalhes de área, links institucionais e ações hoje placeholder devem existir, ser substituídos ou removidos? | `CF-GAP-017` | destino de navegação e ações | produto e UX | elimina rotas quebradas sem presumir requisito | 15 | decisão futura por rota/ação e backlog autorizado |
| `CF-Q-016` | Qual política de segurança deve reger hash nas respostas, segredo/rotação JWT, sessão/cookie, CSRF, proteção de rotas, superadmin, rate limiting, validação e auditoria? | `CF-GAP-011`, `CF-GAP-024`, `CF-GAP-025` | inventário guarda-chuva de decisões de autenticação e segurança | segurança; produto, operação e privacidade conforme cada subtema | trata riscos críticos sem normalizar o código atual | 16 | decompor por assunto e autoridade antes de qualquer futuro pacote de decisão |
| `CF-Q-017` | Qual modelo de dados é pretendido, com nomes, enumerações, cardinalidades, unidades, retenção, privacidade, migrations e dados de demonstração? | `CF-GAP-014`, `CF-GAP-015`, `CF-GAP-025` | inventário guarda-chuva de decisões de dados | dados; produto, ciência e privacidade conforme cada subtema | impede schema provisório de virar domínio aprovado | 17 | decompor por conceito, governança e operação antes de qualquer futuro pacote de decisão |
| `CF-Q-018` | Depois de definidos o contrato científico e os casos de uso, quais fronteiras e contratos devem separar frontend, APIs, serviços, Prisma/Neon e eventuais componentes Python, e quem responde por cada parte? | `CF-GAP-019`, `CF-GAP-023` | fronteiras técnicas e eventual necessidade/integração de Python | arquitetura decide; ciência fornece contrato, com dados e operação consultados | orienta integração e responsabilidades sem atribuir runtime à ciência | 18 | decisão arquitetural futura e ADR somente se justificável e autorizado |
| `CF-Q-019` | Quais metas não funcionais e gates são exigidos para acessibilidade, responsividade, desempenho, disponibilidade, observabilidade, erros, testes, lint e segurança? | `CF-GAP-018`, `CF-GAP-020`, `CF-GAP-026`, `CF-GAP-027` | inventário guarda-chuva de NFRs e validação | produto, UX, arquitetura, segurança e operação conforme cada subtema | cria critérios verificáveis de qualidade | 19 | decompor por atributo e autoridade antes de qualquer futuro pacote de decisão |
| `CF-Q-020` | Quais ambientes, provedores, planos, responsáveis e controles de CI/CD, segredos, backup, migrations, rollback e deploy devem ser adotados, incluindo o papel atual/futuro de Vercel e Neon? | `CF-GAP-015`, `CF-GAP-028`, `CF-GAP-029`, `CF-GAP-030` | inventário guarda-chuva de infraestrutura e deploy | arquitetura, operação, segurança e dados conforme cada subtema | torna implantação e recuperação reproduzíveis | 20 | decompor por ambiente e controle antes de qualquer futuro pacote de decisão |

## Ponto de parada

Há 30 lacunas: 2 `BLOQUEANTE_GLOBAL`, 17 `BLOQUEANTE_SE_NO_ESCOPO` e 11 `NAO_BLOQUEANTE_DO_PRD`, além de 20 perguntas catalogadas. `CF-PD-007` resolveu a presença e o papel funcional do mapa nas parcelas correspondentes de `CF-Q-004` e `CF-Q-012`, mas o detalhamento de `CF-Q-012` permanece aberto. Os dois bloqueios globais remanescentes são `CF-GAP-001`, sobre autoridade de produto e aprovação, e `CF-GAP-003`, sobre objetivos, usuários e escopo do MVP. Nenhum responsável individual foi atribuído e nenhum destino futuro foi criado. As perguntas `CF-Q-016`, `CF-Q-017`, `CF-Q-019` e `CF-Q-020` permanecem inventários auxiliares a decompor antes de eventual pacote de decisão, sem condicionar integralmente o primeiro rascunho.
