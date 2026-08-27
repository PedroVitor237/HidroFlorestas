# PRD Code-First

## Identificação e estado

| Campo | Registro | Classificação |
|---|---|---|
| Nome | `PRD Code-First` | `DECISAO_DE_TRABALHO_PARA_RASCUNHO` |
| Estado | `EM_ELABORACAO` | `DECISAO_DE_TRABALHO_PARA_RASCUNHO` |
| Natureza | rascunho paralelo, não canônico e derivado do código | `DECISAO_DE_TRABALHO_PARA_RASCUNHO` |
| Público prioritário | equipes de pesquisa e extensão | `DIRECAO_CONFIRMADA_PARA_RASCUNHO` — `CF-PD-001` |
| Direção do MVP | demonstrar o ciclo completo laboratório → área monitorada → coleta → dados ambientais → diagnóstico IHFR → acompanhamento básico | `DIRECAO_CONFIRMADA_PARA_RASCUNHO` — `CF-PD-004` |
| Baseline | branch `docs/code-first-prd`; HEAD `bc512b7d5f26ebd064d09ddd45c25f8f9eba24fa`; alterações anteriores não commitadas somente nos cinco caminhos autorizados da iniciativa | `DECISAO_DE_TRABALHO_PARA_RASCUNHO` |
| Método | análise Code-First estática, com separação entre direção humana, intenção inferida e estado implementado | `DECISAO_DE_TRABALHO_PARA_RASCUNHO` |
| Runtime | não validado; aplicação, build, lint, testes, banco e deploy não foram executados nesta iniciativa | `DEPENDENCIA_ABERTA` |
| Figma | opcional, não avaliado e não utilizado nesta execução | `DEPENDENCIA_ABERTA` — `CF-PD-008` |
| Decisões abertas | `CF-PD-002`, `CF-PD-003`, `CF-PD-005`, `CF-PD-006`, `CF-PD-007` e `CF-PD-008` | `DEPENDENCIA_ABERTA` |
| Autoridade para aprovação final | não designada | `NAO_ESPECIFICADO` — `CF-GAP-001`, `CF-Q-001` |
| Relação com a trilha original | não substitui nem cria `docs/product/PRD.md`, não inicia a Etapa 9 original e não altera seu estado | `DECISAO_DE_TRABALHO_PARA_RASCUNHO` |

As fontes locais deste rascunho são [`README.md`](README.md), [`governance/source-policy.md`](governance/source-policy.md), [`inventories/repository-inventory.md`](inventories/repository-inventory.md), [`analysis/current-product-state.md`](analysis/current-product-state.md), [`analysis/decision-snapshot.md`](analysis/decision-snapshot.md), [`analysis/gaps-and-open-questions.md`](analysis/gaps-and-open-questions.md) e [`analysis/product-hypotheses.md`](analysis/product-hypotheses.md). Também foram usados código, schema e configurações permitidas, [`../../TECH_DECISIONS.md`](../../TECH_DECISIONS.md), [`../../PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md) apenas para identidade/propósito geral e as respostas humanas de `CF-PD-001` e `CF-PD-004` fornecidas em 2026-08-27.

### Classificações deste rascunho

| Classificação | Uso neste documento |
|---|---|
| `DECISAO_DE_TRABALHO_PARA_RASCUNHO` | decisão registrada que pode estruturar o documento em elaboração, sem aprovação final |
| `DIRECAO_CONFIRMADA_PARA_RASCUNHO` | conteúdo confirmado exclusivamente em `CF-PD-001` ou `CF-PD-004` |
| `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` | formulação provisória rastreada ao código e às direções do rascunho |
| `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` | inferência explícita sobre produto pretendido, ainda dependente de confirmação |
| `DEPENDENCIA_ABERTA` | decisão, validação ou contrato ainda necessário para consolidar a parte afetada |
| `FORA_DO_MVP_CANDIDATO` | capacidade excluída do núcleo do primeiro MVP por `CF-PD-004`, sem rejeição definitiva |
| `NAO_ESPECIFICADO` | informação ausente nas fontes permitidas ou ainda sem resposta aplicável |

Nenhuma dessas classificações equivale a `APROVADO`. Os requisitos escritos com “deverá” são candidatos deste rascunho e não possuem autoridade normativa final.

## Resumo executivo

`DIRECAO_CONFIRMADA_PARA_RASCUNHO` — O HidroFlorestas é tratado neste rascunho como uma plataforma de monitoramento ambiental para equipes de pesquisa e extensão. O primeiro MVP enfrenta a dispersão entre organização das equipes, áreas monitoradas, coletas, dados ambientais e diagnóstico IHFR, que hoje dificulta rastreabilidade e acompanhamento. O resultado de valor pretendido é permitir que essas equipes executem e acompanhem um ciclo ambiental rastreável, dos registros de campo ao diagnóstico IHFR (`CF-PD-001`).

`DIRECAO_CONFIRMADA_PARA_RASCUNHO` — O MVP deve demonstrar de ponta a ponta laboratório → área monitorada → coleta → dados ambientais → diagnóstico IHFR → acompanhamento básico. Conta/sessão, laboratório mínimo, criação ou entrada, seleção do contexto ativo, áreas, coletas, dados ambientais, obtenção/consulta do diagnóstico, resumo e histórico básicos compõem o núcleo (`CF-PD-004`).

`HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` — Laboratório aparenta ser a unidade colaborativa que contextualiza participantes e recursos. O código atual, entretanto, está em estágio parcial: autenticação possui conectividade estática; workspace, áreas e histórico são mockados ou parciais; mapa é placeholder; dados ambientais e IHFR existem no schema sem consumidor conectado. Produto pretendido e implementação atual, portanto, permanecem explicitamente distintos (`CF-CAP-002`, `CF-CAP-003`, `CF-CAP-004`, `CF-CAP-005`, `CF-CAP-007`, `CF-CAP-008`, `CF-CAP-009`, `CF-CAP-010`, `CF-CAP-011`, `CF-CAP-014`).

## Contexto e problema

`DIRECAO_CONFIRMADA_PARA_RASCUNHO` — As equipes prioritárias precisam articular sua organização, áreas monitoradas, atividades de campo, dados ambientais e diagnósticos IHFR. Quando esses elementos ficam dispersos, a equipe perde continuidade entre o trabalho executado, o local monitorado e o resultado consultado (`CF-PD-001`, `CF-GAP-003`, `CF-Q-003`).

`HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` — A organização por laboratório oferece um contexto colaborativo candidato para reunir participantes, áreas, coletas e resultados. O encadeamento do schema e das interfaces sugere que o acompanhamento de uma área depende de preservar relações entre laboratório, área, coleta, autor, dados ambientais e diagnóstico, mas regras detalhadas de colaboração ainda estão abertas (`CF-CAP-007`, `CF-CAP-009`, `CF-CAP-010`, `CF-CAP-013`, `CF-CAP-014`, `CF-GAP-008`, `CF-GAP-009`).

## Usuários prioritários e atores

| Ator | Papel no rascunho | Estado | Rastreabilidade |
|---|---|---|---|
| Equipes de pesquisa e extensão | público operacional prioritário do primeiro MVP | `DIRECAO_CONFIRMADA_PARA_RASCUNHO` | `CF-PD-001`, `CF-GAP-003`, `CF-Q-003` |
| Participante de laboratório | pessoa vinculada ao espaço colaborativo e às atividades nele realizadas; não se presume pesquisador formal | `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` | `CF-CAP-007`; `ResearchersLinked` em `prisma/schema.prisma:70-81`; `CF-PD-002` |
| Responsável pelo laboratório | ator candidato que cria ou responde pelo contexto colaborativo | `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` | `LaboratoryRoom.userId` em `prisma/schema.prisma:51-68`; `src/app/(private)/workspace/page.tsx:66-168`; `CF-PD-002`, `CF-PD-006` |
| Participante de campo | ator candidato que registra coletas e dados ambientais em nome da equipe | `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` | `CollectionData.userId` em `prisma/schema.prisma:110-126`; `CF-FLOW-006`, `CF-PD-003` |
| Administrador global futuro | possível ator transversal, fora do núcleo do MVP | `FORA_DO_MVP_CANDIDATO` | `CF-CAP-012`, `CF-CAP-017`, `CF-GAP-011`, `CF-PD-004`, `CF-PD-006` |

## Visão e proposta de valor

`DIRECAO_CONFIRMADA_PARA_RASCUNHO` — Oferecer às equipes de pesquisa e extensão uma plataforma na qual possam manter áreas monitoradas, registrar coletas e dados ambientais com rastreabilidade, obter e consultar um diagnóstico IHFR e acompanhar o ciclo por resumo e histórico (`CF-PD-001`, `CF-PD-004`).

`HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` — A colaboração seria organizada por laboratórios usados como contexto ativo para pessoas e recursos do ciclo (`CF-CAP-007`, `CF-FLOW-005`, `CF-PD-002`).

`HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` — O valor colaborativo decorre de compartilhar o contexto do laboratório sem perder a autoria individual dos registros. O valor ambiental/científico decorre de manter o diagnóstico ligado à coleta e à área, sem presumir pelo schema qual matemática, método de produção ou interpretação científica será adotada (`CF-CAP-013`, `CF-CAP-014`, `CF-GAP-009`, `CF-GAP-012`).

## Objetivos do MVP

| Ordem | Objetivo qualitativo | Classificação | Rastreabilidade |
|---:|---|---|---|
| 1 | organizar equipes em um contexto de laboratório | `DIRECAO_CONFIRMADA_PARA_RASCUNHO` | `CF-PD-001`, `CF-PD-004` |
| 2 | manter áreas monitoradas vinculadas ao laboratório ativo | `DIRECAO_CONFIRMADA_PARA_RASCUNHO` | `CF-PD-004`, `CF-CAP-009`, `CF-CAP-013` |
| 3 | registrar coletas e grupos de dados ambientais associados à área | `DIRECAO_CONFIRMADA_PARA_RASCUNHO` | `CF-PD-004`, `CF-CAP-014` |
| 4 | associar a coleta a um diagnóstico IHFR | `DIRECAO_CONFIRMADA_PARA_RASCUNHO` | `CF-PD-004`, `CF-CAP-014`, `CF-PD-005` |
| 5 | permitir acompanhamento básico e rastreável por resumo e histórico | `DIRECAO_CONFIRMADA_PARA_RASCUNHO` | `CF-PD-004`, `CF-CAP-008`, `CF-CAP-010` |
| 6 | demonstrar a jornada completa de ponta a ponta | `DIRECAO_CONFIRMADA_PARA_RASCUNHO` | `CF-PD-004` |

Métricas quantitativas, metas e limiares de sucesso permanecem `NAO_ESPECIFICADO` (`CF-PD-001`, `CF-GAP-003`, `CF-Q-003`).

## Fora do escopo do MVP candidato

| Capacidade | Tratamento | Classificação | Rastreabilidade |
|---|---|---|---|
| IA explicativa, recomendação ou interpretação automatizada | fora do núcleo; nenhuma alegação atual se torna requisito confirmado | `FORA_DO_MVP_CANDIDATO` | `CF-PD-004`, `CF-GAP-013`, `CF-Q-004` |
| Interface completa de administração global | fora do núcleo | `FORA_DO_MVP_CANDIDATO` | `CF-PD-004`, `CF-CAP-012`, `CF-CAP-017` |
| Mapas e visualizações avançadas | pós-MVP candidato | `FORA_DO_MVP_CANDIDATO` | `CF-PD-004`, `CF-GAP-021`, `CF-GAP-022` |
| Arquitetura definitiva de mapas | pós-MVP e dependente dos casos de uso | `FORA_DO_MVP_CANDIDATO` | `CF-PD-004`, `TD-014`, `CF-Q-013` |
| Relatórios avançados | pós-MVP candidato | `FORA_DO_MVP_CANDIDATO` | `CF-PD-004`, `CF-CAP-008` |
| Experiências institucionais ampliadas | pós-MVP candidato | `FORA_DO_MVP_CANDIDATO` | `CF-PD-004`, `CF-CAP-001` |
| Estratégia futura definitiva de hospedagem | decisão arquitetural posterior | `FORA_DO_MVP_CANDIDATO` | `TD-013`, `CF-Q-020` |
| Definição técnica final de Python/Next.js | decisão arquitetural posterior ao contrato científico | `FORA_DO_MVP_CANDIDATO` | `TD-009`, `TD-012`, `CF-GAP-023` |

Mapa básico não está definitivamente excluído: permanece `DEPENDENCIA_ABERTA` e inclusão condicional do MVP (`CF-PD-004`, `CF-PD-007`).

## Modelo conceitual do produto

```text
usuário
→ vínculo com laboratório
→ laboratório
→ área monitorada
→ coleta
→ dados ambientais
→ diagnóstico IHFR
→ resumo/histórico
```

| Conceito | Relação no rascunho | Estado | Regra ainda aberta | Evidência |
|---|---|---|---|---|
| Usuário | possui conta/sessão e atua no contexto de uma equipe | `DIRECAO_CONFIRMADA_PARA_RASCUNHO` | ciclo de conta e elegibilidade | `CF-PD-001`, `CF-PD-004`, `CF-CAP-002`, `CF-CAP-003`, `CF-CAP-004` |
| Vínculo com laboratório | conecta pessoa e espaço colaborativo | `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` | convite, aprovação, papel, saída e datas | `ResearchersLinked` em `prisma/schema.prisma:70-81`; `CF-PD-002` |
| Laboratório | contextualiza participantes e recursos do ciclo ambiental | `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` | criação, propriedade, múltiplos espaços e transferência | `CF-PD-004`, `CF-CAP-007`, `prisma/schema.prisma:51-68` |
| Área monitorada | pertence ao contexto do laboratório e reúne coletas | `DIRECAO_CONFIRMADA_PARA_RASCUNHO` | dados mínimos, estados e edição | `CF-PD-004`, `CF-CAP-009`, `prisma/schema.prisma:76-109` |
| Coleta | registro de campo ligado à área e a um autor | `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` | ciclo, revisão, edição e exclusão | `CF-PD-004`, `CF-FLOW-006`, `prisma/schema.prisma:110-126` |
| Dados ambientais | grupos de água, solo, vegetação e terreno associados à coleta | `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` | campos normativos, unidades e validações científicas | `CF-CAP-014`, `prisma/schema.prisma:151-198` |
| Diagnóstico IHFR | resultado associado à coleta e, por ela, à área | `DIRECAO_CONFIRMADA_PARA_RASCUNHO` | método de produção, matemática e contrato científico | `CF-PD-004`, `CF-PD-005`, `prisma/schema.prisma:128-142` |
| Resumo/histórico | projeção básica para acompanhamento posterior | `DIRECAO_CONFIRMADA_PARA_RASCUNHO` | eventos, filtros, retenção e conteúdo do resumo | `CF-PD-004`, `CF-CAP-008`, `CF-CAP-010`, `CF-FLOW-007` |
| Mapa | projeção condicional de áreas, coletas ou resultados | `DEPENDENCIA_ABERTA` | função, camadas, precisão, privacidade e tecnologia | `CF-CAP-011`, `CF-GAP-021`, `CF-PD-007` |

O schema evidencia relações implementadas, mas não aprova o domínio (`CF-GAP-014`, `CF-Q-017`).

## Laboratórios

`HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` — Laboratório é uma unidade colaborativa semelhante organizacionalmente a uma sala do Google Classroom: um responsável pode criar, participantes podem ingressar, áreas/coletas/resultados são compartilhados no contexto e a navegação utiliza um laboratório ativo. A analogia não importa regras, terminologia ou interface de outro produto (`CF-CAP-007`, `CF-FLOW-005`, `prisma/schema.prisma:51-81`).

`DEPENDENCIA_ABERTA` — `CF-PD-002` mantém abertas as regras de convite ou código, aprovação, múltiplos laboratórios, saída, transferência de responsabilidade, papéis e propriedade. O rascunho pode descrever o contexto colaborativo e o laboratório ativo, mas não pode aprovar essas regras (`CF-GAP-008`, `CF-GAP-009`, `CF-GAP-010`, `CF-Q-007`, `CF-Q-008`, `CF-Q-009`).

## Jornada principal

| Etapa | Comportamento pretendido candidato | Implementação atual | Diferença | Dependência aberta | Rastreabilidade | Classificação |
|---|---|---|---|---|---|---|
| Cadastro/login | permitir acesso por conta e credenciais ao workspace | fluxo conectado estaticamente, sem runtime | política de conta e validações não estão aprovadas | `CF-Q-005`, `CF-Q-006` | `CF-CAP-002`, `CF-CAP-003`, `CF-FLOW-001`, `CF-FLOW-002` | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| Criação ou entrada em laboratório | disponibilizar um contexto colaborativo à equipe | botões e estado local; relações somente no schema | não há fluxo persistido nem regra de adesão | `CF-PD-002` | `CF-CAP-007`, `CF-FLOW-005`, `prisma/schema.prisma:51-81` | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| Seleção do laboratório | manter um laboratório ativo como contexto da navegação | card fixo e link para dashboard | troca e cardinalidade não estão definidas | `CF-PD-002`, `CF-PD-006` | `CF-CAP-007`, `CF-FLOW-005`, `src/app/(private)/workspace/page.tsx:19-168` | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| Área monitorada | criar e consultar áreas dentro do laboratório ativo | lista mockada, ação placeholder e schema sem consumidor | CRUD e regras de domínio não existem como fluxo conectado | `CF-PD-003`, `CF-PD-006` | `CF-CAP-009`, `CF-FLOW-006`, `prisma/schema.prisma:76-109` | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| Coleta e dados ambientais | registrar coleta na área e seus grupos gerais de dados | botão placeholder e schema sem consumidor | fluxo, campos normativos e validações permanecem abertos | `CF-PD-003`, `CF-PD-005` | `CF-CAP-014`, `CF-FLOW-006`, `prisma/schema.prisma:110-198` | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| Obtenção/consulta do diagnóstico IHFR | associar e consultar um diagnóstico rastreável | estrutura no schema sem API, serviço ou tela consumidora | método de obtenção e ciência não estão definidos | `CF-PD-005` | `CF-CAP-014`, `CF-GAP-012`, `prisma/schema.prisma:128-142` | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| Resumo e histórico | permitir acompanhamento posterior do ciclo | dashboard parcial e histórico mockado | dados reais, eventos e destinos não estão conectados | `CF-PD-003` | `CF-CAP-008`, `CF-CAP-010`, `CF-FLOW-007` | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |

`DIRECAO_CONFIRMADA_PARA_RASCUNHO` — A sequência de alto nível é cadastro/login → criação ou entrada em laboratório → seleção do laboratório → área monitorada → coleta e dados ambientais → obtenção/consulta do diagnóstico IHFR → resumo e histórico (`CF-PD-004`). Os detalhes permanecem provisórios até `CF-PD-002`, `CF-PD-003`, `CF-PD-005` e `CF-PD-006` serem respondidas.

## Escopo funcional do MVP

### Identidade e acesso

`REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` — Conta e sessão integram o núcleo; cadastro, login e manutenção da sessão são comportamentos candidatos para acesso e autoria (`CF-PD-004`, `CF-CAP-002`, `CF-CAP-003`, `CF-CAP-004`, `CF-CAP-005`).

### Laboratório mínimo

`DIRECAO_CONFIRMADA_PARA_RASCUNHO` — O MVP inclui criar ou entrar em laboratório e selecionar o contexto ativo. Mecanismos de convite, aprovação, múltiplos espaços e papéis são dependências abertas (`CF-PD-004`, `CF-PD-002`, `CF-CAP-007`).

### Áreas monitoradas

`REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` — A equipe precisa criar e consultar áreas vinculadas ao laboratório ativo. Dados mínimos, estados, edição e remoção permanecem candidatos dependentes de `CF-PD-003` e `CF-PD-006` (`CF-PD-004`, `CF-CAP-009`, `CF-CAP-013`).

### Coletas e dados ambientais

`REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` — O MVP inclui registrar coletas ligadas à área e grupos gerais de dados ambientais. O schema sugere água, solo, vegetação e terreno, mas campos normativos, unidades e regras científicas não são aprovados (`CF-PD-004`, `CF-CAP-014`, `CF-GAP-012`, `CF-GAP-014`).

### Diagnóstico IHFR

`DIRECAO_CONFIRMADA_PARA_RASCUNHO` — O ciclo chega à obtenção e consulta de um diagnóstico IHFR associado à coleta. A forma de produção permanece aberta em `CF-PD-005`; o escopo não aprova cálculo interno, Python, importação, registro manual ou serviço externo (`CF-PD-004`, `CF-CAP-014`, `CF-GAP-012`, `CF-GAP-023`).

### Acompanhamento básico

`DIRECAO_CONFIRMADA_PARA_RASCUNHO` — Resumo e histórico básicos fecham o ciclo do MVP, permitindo reencontrar os registros e resultados. O conteúdo exato do resumo e os eventos do histórico permanecem provisórios (`CF-PD-004`, `CF-PD-003`, `CF-CAP-008`, `CF-CAP-010`).

### Mapa condicional

`DEPENDENCIA_ABERTA` — Um mapa básico pode integrar o MVP somente após confirmação de seu caso de uso. Mapa avançado e arquitetura cartográfica sofisticada são pós-MVP; OpenStreetMap, Plotly e Leaflet não estão selecionados (`CF-PD-004`, `CF-PD-007`, `CF-CAP-011`, `TD-008`, `TD-010`, `TD-011`, `TD-014`).

## Requisitos funcionais candidatos

Os requisitos abaixo são provisórios, derivados do código e das duas direções confirmadas para o rascunho. Nenhum está `APROVADO`.

| ID | Formulação candidata | Ator | Origem | Evidência | Estado da implementação | Dependência aberta | Decisão relacionada | Critério de aceitação provisório | Classificação |
|---|---|---|---|---|---|---|---|---|---|
| `CF-PRD-FR-001` | O produto deverá permitir que uma pessoa elegível crie uma conta ou faça login para acessar o workspace. | participante da equipe | `CF-PD-001`, `CF-PD-004` | `CF-CAP-002`, `CF-CAP-003`, `CF-CAP-015`, `CF-CAP-016`; `CF-FLOW-001`, `CF-FLOW-002`; `src/app/register/page.tsx:14-49`, `src/app/login/page.tsx:12-37` | `IMPLEMENTADO_VERIFICADO_ESTATICAMENTE` | elegibilidade, dados mínimos, estados de conta e mensagens (`CF-Q-005`, `CF-Q-006`) | `CF-PD-004` | com dados aceitos pela política ainda a definir, a pessoa conclui cadastro ou login e alcança o workspace; validação em runtime permanece pendente | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| `CF-PRD-FR-002` | O produto deverá manter e restaurar a sessão necessária para navegar no contexto autenticado e permitir encerrá-la. | usuário cadastrado | `CF-PD-004` | `CF-CAP-004`, `CF-CAP-005`, `CF-CAP-006`; `CF-FLOW-003`, `CF-FLOW-004`; `src/contexts/auth.context.tsx:40-75`, `src/contexts/auth.context.tsx:159-171` | `PARCIALMENTE_IMPLEMENTADO` | política de conta/sessão e estados de acesso (`CF-Q-006`) | `CF-PD-004` | após autenticação válida, o contexto é restaurado nas páginas incluídas e o logout encerra o acesso local; controles técnicos não são prescritos aqui | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| `CF-PRD-FR-003` | O produto deverá permitir que uma equipe crie um laboratório mínimo ou ingresse em um laboratório existente. | responsável ou participante do laboratório | `CF-PD-004`; hipótese de laboratório | `CF-CAP-007`, `CF-FLOW-005`; `prisma/schema.prisma:51-81`; `src/app/(private)/workspace/page.tsx:46-86` | `PARCIALMENTE_IMPLEMENTADO` | convite/código, aprovação, saída, responsável e múltiplos espaços (`CF-PD-002`) | `CF-PD-002`, `CF-PD-004` | o usuário conclui um dos dois caminhos candidatos e passa a visualizar o laboratório disponível; o mecanismo exato permanece aberto | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| `CF-PRD-FR-004` | O produto deverá permitir selecionar um laboratório ativo para contextualizar áreas, coletas, diagnósticos, resumo e histórico. | participante do laboratório | `CF-PD-004`; hipótese de navegação | `CF-CAP-007`, `CF-FLOW-005`; `src/app/(private)/workspace/page.tsx:19-168` | `PARCIALMENTE_IMPLEMENTADO` | cardinalidade, troca de contexto e permissões (`CF-PD-002`, `CF-PD-006`) | `CF-PD-002`, `CF-PD-004`, `CF-PD-006` | após a seleção, as telas do ciclo identificam e usam o mesmo contexto ativo; regras para múltiplos laboratórios permanecem abertas | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| `CF-PRD-FR-005` | O produto deverá permitir criar e consultar áreas monitoradas vinculadas ao laboratório ativo. | participante de laboratório autorizado | `CF-PD-004`; modelo derivado do código | `CF-CAP-009`, `CF-CAP-013`, `CF-FLOW-006`; `prisma/schema.prisma:76-109`; `src/app/(private)/dashboard/collects/page.tsx:6-24` | `PARCIALMENTE_IMPLEMENTADO` | dados mínimos, estados, edição, remoção e propriedade (`CF-PD-003`, `CF-PD-006`) | `CF-PD-003`, `CF-PD-004`, `CF-PD-006` | uma área criada no contexto ativo pode ser reencontrada e consultada nesse contexto; campos e ciclo detalhados permanecem abertos | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| `CF-PRD-FR-006` | O produto deverá permitir registrar uma coleta vinculada a uma área monitorada e ao participante que a registrou. | participante de campo | `CF-PD-001`, `CF-PD-004`; modelo derivado do código | `CF-CAP-014`, `CF-FLOW-006`; `CollectionData` em `prisma/schema.prisma:110-126`; ação placeholder em `src/app/(private)/dashboard/page.tsx:14-16` | `PARCIALMENTE_IMPLEMENTADO` | estados, data de campo, revisão, edição e exclusão (`CF-PD-003`) | `CF-PD-003`, `CF-PD-004` | a coleta registrada mantém associação verificável com a área e o autor e pode ser recuperada posteriormente | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| `CF-PRD-FR-007` | O produto deverá permitir registrar, para uma coleta, os grupos de dados ambientais aplicáveis de água, solo, vegetação e terreno. | participante de campo | `CF-PD-004`; schema como evidência | `CF-CAP-014`; `prisma/schema.prisma:151-198` | `PARCIALMENTE_IMPLEMENTADO` | campos normativos, unidades, obrigatoriedade, validações e contrato científico (`CF-PD-003`, `CF-PD-005`, `CF-Q-011`) | `CF-PD-003`, `CF-PD-004`, `CF-PD-005` | a coleta mantém os grupos aplicáveis aceitos pelo contrato futuro sem que este rascunho defina variáveis, unidades ou cardinalidades | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| `CF-PRD-FR-008` | O produto deverá permitir associar um diagnóstico IHFR à coleta que lhe deu origem e, por essa relação, à área monitorada. | participante autorizado ou processo de diagnóstico ainda aberto | `CF-PD-004`; modelo derivado do código | `CF-CAP-014`; `IHFRDiagnosis` em `prisma/schema.prisma:128-142` | `PARCIALMENTE_IMPLEMENTADO` | forma de obtenção e contrato científico (`CF-PD-005`, `CF-Q-011`) | `CF-PD-004`, `CF-PD-005` | um diagnóstico aceito pelo fluxo futuro referencia a coleta de origem e permite chegar à área correspondente, sem prescrever como foi produzido | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| `CF-PRD-FR-009` | O produto deverá permitir consultar o resultado IHFR associado à coleta, preservando origem e versão científica quando disponíveis. | participante do laboratório autorizado | `CF-PD-004`; hipótese de resultado | `CF-CAP-014`; `prisma/schema.prisma:128-142`; ausência de consumidor registrada em `CF-GAP-012` | `NAO_LOCALIZADO` | conteúdo do resultado, método de obtenção, validação e versionamento científico (`CF-PD-005`) | `CF-PD-004`, `CF-PD-005` | a consulta apresenta o resultado associado à coleta e a proveniência/versão disponíveis, sem inferir fórmula, classe ou limiar | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| `CF-PRD-FR-010` | O produto deverá permitir acompanhar o ciclo por um resumo e um histórico básicos no contexto do laboratório. | participante do laboratório | `CF-PD-004`; interfaces observadas | `CF-CAP-008`, `CF-CAP-010`, `CF-FLOW-007`; `src/app/(private)/dashboard/page.tsx:7-22`; `src/app/(private)/dashboard/activity-history.tsx:25-270` | `PARCIALMENTE_IMPLEMENTADO` | conteúdo do resumo, eventos, filtros, retenção e destinos (`CF-PD-003`) | `CF-PD-003`, `CF-PD-004` | um registro concluído pode ser localizado posteriormente no resumo ou histórico e relacionado ao contexto que o originou | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| `CF-PRD-FR-011` | O produto deverá isolar logicamente áreas, coletas, dados e diagnósticos pelo contexto do laboratório ao qual estão associados. | participante do laboratório | `CF-PD-004`; hipótese provisória de propriedade | `CF-CAP-013`, `CF-CAP-017`; relações em `prisma/schema.prisma:51-142`; lacuna `CF-GAP-009` | `PARCIALMENTE_IMPLEMENTADO` | fronteira definitiva, permissões, propriedade e exceções (`CF-PD-006`) | `CF-PD-004`, `CF-PD-006` | ao usar um laboratório ativo, recursos de outro contexto não aparecem sem vínculo permitido; a matriz de acesso permanece aberta | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| `CF-PRD-FR-012` | O produto deverá preservar a autoria individual de áreas, coletas e demais registros para os quais a autoria for aplicável. | participante de laboratório ou campo | `CF-PD-001`; hipótese provisória de autoria | `CF-CAP-010`, `CF-CAP-013`, `CF-CAP-014`; `User.collectionAreas` e `User.collectionData` em `prisma/schema.prisma:23-26`; `CF-FLOW-007` | `PARCIALMENTE_IMPLEMENTADO` | ações autorais, edição por terceiros, remoção e propriedade (`CF-PD-006`) | `CF-PD-006` | cada área/coleta criada mantém referência ao autor e essa referência pode ser consultada nos pontos aplicáveis; permissões permanecem abertas | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |

## IHFR

`DIRECAO_CONFIRMADA_PARA_RASCUNHO` — O ciclo do MVP chega a um diagnóstico IHFR, associado a uma coleta e à respectiva área, e permite ao usuário consultar seu resultado (`CF-PD-004`, `CF-PRD-FR-008`, `CF-PRD-FR-009`).

`REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` — A rastreabilidade candidata preserva a coleta de origem e a versão científica quando disponível (`CF-PRD-FR-008`, `CF-PRD-FR-009`, `CF-PRD-NFR-006`).

`DEPENDENCIA_ABERTA` — `CF-PD-005` não define se o diagnóstico será calculado internamente, produzido por componente Python, importado, registrado manualmente ou consultado de serviço externo. Também permanecem abertas a fórmula, pesos, variáveis normativas, classes, limiares, validações, qualidade e versionamento científicos (`CF-GAP-012`, `CF-GAP-023`, `CF-Q-011`, `TD-009`, `TD-012`).

Nenhum requisito deste rascunho define matemática do IHFR. `CF-PRD-FR-008`, `CF-PRD-FR-009` e `CF-PRD-NFR-006` tratam somente de presença, associação, consulta, integridade e rastreabilidade.

## Papéis e propriedade

`HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` — O rascunho usa provisoriamente responsável pelo laboratório e participante do laboratório. Administrador global permanece fora do núcleo. Recursos são tratados como pertencentes ao contexto colaborativo do laboratório, com autoria individual preservada (`CF-CAP-007`, `CF-CAP-012`, `CF-CAP-017`, `prisma/schema.prisma:51-126`).

`DEPENDENCIA_ABERTA` — `CF-PD-006` deve confirmar permissões, edição, remoção, propriedade, transferência, papéis adicionais e isolamento definitivo. Até essa resposta, `CF-PRD-FR-011`, `CF-PRD-FR-012`, `CF-PRD-NFR-001` e `CF-PRD-NFR-002` permanecem candidatos e não aprovam uma matriz de acesso.

## Mapas, IA e Figma

### Mapas

`DEPENDENCIA_ABERTA` — Mapa básico é inclusão condicional; mapa avançado é pós-MVP; tecnologia permanece aberta. O placeholder atual e as coordenadas do schema não aprovam função, camadas, precisão ou biblioteca (`CF-PD-004`, `CF-PD-007`, `CF-CAP-011`, `CF-GAP-021`, `CF-GAP-022`, `TD-008`, `TD-010`, `TD-011`, `TD-014`).

### IA

`FORA_DO_MVP_CANDIDATO` — IA está fora do núcleo. Alegações comerciais e `explanationAI` no schema não constituem requisito confirmado de explicação, recomendação ou cálculo (`CF-PD-004`, `CF-PD-007`, `CF-GAP-013`, `prisma/schema.prisma:139`).

### Figma

`DEPENDENCIA_ABERTA` — Figma é opcional, não foi utilizado e pode complementar UX futuramente. Sua ausência não bloqueia este rascunho; qualquer artefato futuro precisa ser identificado e classificado antes de uso (`CF-PD-008`, `CF-GAP-016`, `CF-Q-014`).

## Requisitos não funcionais candidatos

São requisitos de resultado em nível de produto, sem prescrição de JWT, CSRF, rate limiting, bibliotecas, CI/CD, migrations, backup, observabilidade ou deploy. Nenhum está `APROVADO` e nenhuma meta numérica foi inventada.

| ID | Resultado candidato | Origem e evidência | Estado atual | Dependência aberta | Critério de aceitação provisório | Classificação |
|---|---|---|---|---|---|---|
| `CF-PRD-NFR-001` | O produto deverá manter segregados os dados de cada laboratório conforme o contexto e os vínculos permitidos. | `CF-PD-004`, `CF-PD-006`; `CF-CAP-013`, `CF-CAP-017`; `prisma/schema.prisma:51-142` | relações no schema, sem enforcement de domínio localizado | permissões e isolamento definitivo em `CF-PD-006` | no contexto ativo, dados de outro laboratório não são exibidos sem vínculo permitido; exceções dependem da futura matriz de acesso | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| `CF-PRD-NFR-002` | O produto deverá manter rastreabilidade de autoria dos registros e de origem do diagnóstico. | `CF-PD-001`, `CF-PD-004`, `CF-PD-006`; `CF-CAP-010`, `CF-CAP-013`, `CF-CAP-014`; `prisma/schema.prisma:23-26`, `prisma/schema.prisma:110-142` | chaves de autoria/origem no schema e histórico mockado | papéis, edição por terceiros e eventos em `CF-PD-003`, `CF-PD-006` | um registro aplicável permite identificar seu autor; um diagnóstico permite identificar a coleta de origem | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| `CF-PRD-NFR-003` | O produto deverá proteger dados pessoais contra consulta ou exposição por atores não autorizados. | `CF-GAP-025`, `CF-Q-017`; contexto de laboratório em `CF-PD-006` | comportamento e política não especificados; implementação não validada | política de privacidade, papéis e acesso em `CF-PD-006` e autoridades competentes | dados pessoais são apresentados somente a atores com acesso aplicável ao contexto; política detalhada permanece aberta | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| `CF-PRD-NFR-004` | O ciclo principal deverá ser utilizável em layouts responsivos nos contextos de uso suportados. | `CF-CAP-019`; `CF-FLOW-001`, `CF-FLOW-002`, `CF-FLOW-005`, `CF-FLOW-006`, `CF-FLOW-007`; `src/components/sidebar/index.tsx:34-63` | responsividade verificada apenas estaticamente e menu mobile parcial | contextos/dispositivos suportados e critérios de UX em `CF-Q-019` | as etapas incluídas permanecem navegáveis e compreensíveis nos layouts suportados a definir; validação visual/runtime permanece pendente | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| `CF-PRD-NFR-005` | O ciclo principal deverá oferecer acessibilidade básica para percepção, identificação e operação de seus controles e estados. | `CF-CAP-018`, `CF-GAP-018`, `CF-GAP-026`; `src/app/layout.tsx:24-30`, `src/components/header-screen/index.tsx:21-27` | sinais parciais; nenhuma auditoria executada | critérios detalhados de acessibilidade e UX em `CF-Q-014`, `CF-Q-019` | controles e mensagens das etapas incluídas possuem identificação e operação compreensíveis segundo critérios ainda a confirmar | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| `CF-PRD-NFR-006` | O produto deverá preservar a integridade da associação entre diagnóstico, coleta e área e registrar versão científica quando disponível. | `CF-PD-004`, `CF-PD-005`; `CF-CAP-014`; `prisma/schema.prisma:76-142` | estrutura parcial no schema, sem consumidor ou validação científica | contrato, proveniência, método e versionamento em `CF-PD-005`, `CF-Q-011` | a consulta do diagnóstico mantém a cadeia área → coleta → resultado e apresenta a versão disponível sem inferir regra científica | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |

## Critérios de sucesso provisórios

`DIRECAO_CONFIRMADA_PARA_RASCUNHO` — O MVP demonstra valor qualitativo quando uma equipe consegue:

1. acessar a plataforma;
2. estabelecer um contexto de laboratório;
3. cadastrar ou selecionar uma área;
4. registrar uma coleta e seus grupos de dados ambientais;
5. obter ou registrar um diagnóstico IHFR válido segundo contrato futuro;
6. consultar o resultado;
7. acompanhar o registro posteriormente por resumo ou histórico.

Rastreabilidade: `CF-PD-001`, `CF-PD-004`, `CF-PRD-FR-001`, `CF-PRD-FR-003`, `CF-PRD-FR-004`, `CF-PRD-FR-005`, `CF-PRD-FR-006`, `CF-PRD-FR-007`, `CF-PRD-FR-008`, `CF-PRD-FR-009`, `CF-PRD-FR-010`. Métricas quantitativas permanecem `NAO_ESPECIFICADO`.

## Decisões e dependências abertas

| Decisão | Seções provisórias | O que já pode ser redigido | O que não pode ser aprovado | Quem deve confirmar | Estado |
|---|---|---|---|---|---|
| `CF-PD-002` | modelo conceitual, laboratórios, jornada, `CF-PRD-FR-003`, `CF-PRD-FR-004` | laboratório como contexto colaborativo e seleção de contexto ativo | convite/código, aprovação, múltiplos laboratórios, saída, transferência e regras de adesão | produto e dados; segurança para acesso | `DEPENDENCIA_ABERTA` |
| `CF-PD-003` | jornada, áreas, coletas, acompanhamento, `CF-PRD-FR-005`, `CF-PRD-FR-006`, `CF-PRD-FR-007`, `CF-PRD-FR-010` | macrofluxo área → coleta/dados → diagnóstico → acompanhamento | estados, dados mínimos, revisão, edição, exclusão, eventos e conteúdo detalhado | produto e dados; ciência nos dados que alimentam IHFR | `DEPENDENCIA_ABERTA` |
| `CF-PD-005` | IHFR, `CF-PRD-FR-007`, `CF-PRD-FR-008`, `CF-PRD-FR-009`, `CF-PRD-NFR-006` | presença, associação, consulta e rastreabilidade do diagnóstico | método de obtenção, fórmula, variáveis, pesos, classes, limiares e runtime científico | produto para função; ciência para contrato; arquitetura para execução | `DEPENDENCIA_ABERTA` |
| `CF-PD-006` | atores, papéis/propriedade, `CF-PRD-FR-004`, `CF-PRD-FR-005`, `CF-PRD-FR-011`, `CF-PRD-FR-012`, `CF-PRD-NFR-001`, `CF-PRD-NFR-002`, `CF-PRD-NFR-003` | responsável e participante como hipóteses; recursos no contexto e autoria individual | permissões, edição, remoção, propriedade, transferência, papéis adicionais e isolamento definitivo | produto, dados e segurança | `DEPENDENCIA_ABERTA` |
| `CF-PD-007` | mapa condicional e exclusão de IA | mapa básico como possibilidade e IA fora do núcleo por `CF-PD-004` | função do mapa, camadas, precisão, privacidade, tecnologia e eventual papel futuro da IA | produto; UX/dados/ciência para mapas; arquitetura após o caso de uso | `DEPENDENCIA_ABERTA` |
| `CF-PD-008` | identificação, UX e Figma | UX Code-First com hipóteses e validação humana | autoridade ou conteúdo de qualquer Figma futuro sem classificação | produto e UX | `DEPENDENCIA_ABERTA` |

## Decisões técnicas de trabalho

| Referência | Direção usada no rascunho | Limite |
|---|---|---|
| `TD-001` | Next.js como framework full-stack | não aprova arquitetura completa |
| `TD-002` | PostgreSQL | não aprova schema como domínio final nem comprova banco executado |
| `TD-003` | Neon no contexto atual de desenvolvimento | não comprova conta, plano ou ambiente ativo |
| `TD-004` | Prisma ORM | não aprova migrations ou modelo de dados pretendido |
| `TD-005` | Tailwind CSS | não aprova UX ou design system |
| `TD-006` | Lucide React | não aprova regras visuais ou de acessibilidade |
| `TD-007` | Vercel como direção atual de hospedagem | não comprova deploy nem resolve hospedagem futura |

Todas as linhas usam `DECISAO_DE_TRABALHO_PARA_RASCUNHO`. OpenStreetMap (`TD-008`), Python (`TD-009`), Plotly (`TD-010`), Leaflet (`TD-011`), integração Next.js/Python (`TD-012`), hospedagem futura (`TD-013`) e arquitetura de mapas (`TD-014`) permanecem `DEPENDENCIA_ABERTA`.

## Rastreabilidade local dos requisitos candidatos

Esta matriz é local ao rascunho e não altera a matriz global.

| Requisito | Decisão | Capacidade/fluxo | Evidência principal | Estado | Pendência |
|---|---|---|---|---|---|
| `CF-PRD-FR-001` | `CF-PD-001`, `CF-PD-004` | `CF-CAP-002`, `CF-CAP-003`; `CF-FLOW-001`, `CF-FLOW-002` | `src/app/register/page.tsx:14-49`; `src/app/login/page.tsx:12-37` | estático | `CF-Q-005`, `CF-Q-006` |
| `CF-PRD-FR-002` | `CF-PD-004` | `CF-CAP-004`, `CF-CAP-005`, `CF-CAP-006`; `CF-FLOW-003`, `CF-FLOW-004` | `src/contexts/auth.context.tsx:40-75`, `src/contexts/auth.context.tsx:159-171` | parcial | `CF-Q-006` |
| `CF-PRD-FR-003` | `CF-PD-002`, `CF-PD-004` | `CF-CAP-007`; `CF-FLOW-005` | `prisma/schema.prisma:51-81`; `src/app/(private)/workspace/page.tsx:46-86` | parcial/mock | `CF-PD-002` |
| `CF-PRD-FR-004` | `CF-PD-002`, `CF-PD-004`, `CF-PD-006` | `CF-CAP-007`; `CF-FLOW-005` | `src/app/(private)/workspace/page.tsx:19-168` | parcial/mock | `CF-PD-002`, `CF-PD-006` |
| `CF-PRD-FR-005` | `CF-PD-003`, `CF-PD-004`, `CF-PD-006` | `CF-CAP-009`, `CF-CAP-013`; `CF-FLOW-006` | `prisma/schema.prisma:76-109`; `src/app/(private)/dashboard/collects/page.tsx:6-24` | parcial/mock | `CF-PD-003`, `CF-PD-006` |
| `CF-PRD-FR-006` | `CF-PD-003`, `CF-PD-004` | `CF-CAP-014`; `CF-FLOW-006` | `prisma/schema.prisma:110-126` | parcial/sem consumidor | `CF-PD-003` |
| `CF-PRD-FR-007` | `CF-PD-003`, `CF-PD-004`, `CF-PD-005` | `CF-CAP-014` | `prisma/schema.prisma:151-198` | parcial/sem consumidor | `CF-PD-003`, `CF-PD-005`, `CF-Q-011` |
| `CF-PRD-FR-008` | `CF-PD-004`, `CF-PD-005` | `CF-CAP-014` | `prisma/schema.prisma:128-142` | parcial/sem consumidor | `CF-PD-005`, `CF-Q-011` |
| `CF-PRD-FR-009` | `CF-PD-004`, `CF-PD-005` | `CF-CAP-014` | `prisma/schema.prisma:128-142` | não localizado como consulta | `CF-PD-005` |
| `CF-PRD-FR-010` | `CF-PD-003`, `CF-PD-004` | `CF-CAP-008`, `CF-CAP-010`; `CF-FLOW-007` | `src/app/(private)/dashboard/activity-history.tsx:25-270` | parcial/mock | `CF-PD-003` |
| `CF-PRD-FR-011` | `CF-PD-004`, `CF-PD-006` | `CF-CAP-013`, `CF-CAP-017` | `prisma/schema.prisma:51-142` | parcial/schema | `CF-PD-006` |
| `CF-PRD-FR-012` | `CF-PD-001`, `CF-PD-006` | `CF-CAP-010`, `CF-CAP-013`, `CF-CAP-014`; `CF-FLOW-007` | `prisma/schema.prisma:23-26`, `prisma/schema.prisma:110-126` | parcial/schema/mock | `CF-PD-006` |
| `CF-PRD-NFR-001` | `CF-PD-004`, `CF-PD-006` | `CF-CAP-013`, `CF-CAP-017` | `prisma/schema.prisma:51-142` | parcial/schema | `CF-PD-006` |
| `CF-PRD-NFR-002` | `CF-PD-001`, `CF-PD-004`, `CF-PD-006` | `CF-CAP-010`, `CF-CAP-013`, `CF-CAP-014`; `CF-FLOW-007` | `prisma/schema.prisma:23-26`, `prisma/schema.prisma:110-142` | parcial | `CF-PD-003`, `CF-PD-006` |
| `CF-PRD-NFR-003` | `CF-PD-006` | `CF-CAP-017` | `CF-GAP-025`, `CF-Q-017` | não especificado | `CF-PD-006` |
| `CF-PRD-NFR-004` | `CF-PD-004` | `CF-CAP-019`; `CF-FLOW-001`, `CF-FLOW-002`, `CF-FLOW-005`, `CF-FLOW-006`, `CF-FLOW-007` | `src/components/sidebar/index.tsx:34-63` | estático/parcial | `CF-Q-019` |
| `CF-PRD-NFR-005` | `CF-PD-004` | `CF-CAP-018` | `src/app/layout.tsx:24-30`; `src/components/header-screen/index.tsx:21-27` | parcial/não auditado | `CF-Q-014`, `CF-Q-019` |
| `CF-PRD-NFR-006` | `CF-PD-004`, `CF-PD-005` | `CF-CAP-014` | `prisma/schema.prisma:76-142` | parcial/sem consumidor | `CF-PD-005`, `CF-Q-011` |

## Riscos e premissas

| Tema | Síntese | Estado |
|---|---|---|
| Código atual | autenticação é estática; núcleo de domínio permanece parcial, mockado ou sem consumidor | `DEPENDENCIA_ABERTA` |
| Runtime | nenhum comportamento foi validado em execução | `DEPENDENCIA_ABERTA` |
| Contrato científico | presença e rastreabilidade do IHFR podem ser redigidas; matemática e validação não podem ser aprovadas | `DEPENDENCIA_ABERTA` — `CF-PD-005` |
| Laboratórios e papéis | contexto colaborativo é hipótese; regras e propriedade permanecem abertas | `DEPENDENCIA_ABERTA` — `CF-PD-002`, `CF-PD-006` |
| Mapa e IA | mapa básico é condicional; mapa avançado e IA estão fora do núcleo | `DEPENDENCIA_ABERTA` — `CF-PD-007` |
| Figma | opcional e ausente nesta execução | `DEPENDENCIA_ABERTA` — `CF-PD-008` |

## Estado de elaboração e ponto de parada

Este documento permanece `EM_ELABORACAO`. `CF-PD-001` e `CF-PD-004` são decisões de trabalho com origem registrada, não decisões `APROVADO`. Os 12 requisitos funcionais e 6 requisitos não funcionais são candidatos. A próxima etapa permitida é revisão humana do rascunho e resposta às dependências abertas; aprovação final depende de autoridade formal, decisões aplicáveis e validação científica das partes do IHFR.
