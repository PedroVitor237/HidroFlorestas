# PRD Code-First

## Identificação e estado

| Campo | Registro | Classificação |
|---|---|---|
| Nome | `PRD Code-First` | `DECISAO_DE_TRABALHO_PARA_RASCUNHO` |
| Estado | `EM_REVISAO` | `DECISAO_DE_TRABALHO_PARA_RASCUNHO` |
| Natureza | rascunho paralelo, não canônico e derivado do código | `DECISAO_DE_TRABALHO_PARA_RASCUNHO` |
| Público prioritário | equipes de pesquisa e extensão | `DIRECAO_CONFIRMADA_PARA_RASCUNHO` — `CF-PD-001` |
| Direção do MVP | demonstrar o ciclo completo laboratório → área monitorada e representada no mapa → coleta e dados associados espacialmente → diagnóstico IHFR → acompanhamento e visualização territorial | `DIRECAO_CONFIRMADA_PARA_RASCUNHO` — `CF-PD-004`, `CF-PD-007` |
| Baseline | branch `docs/code-first-prd`; HEAD e upstream `213918ec6a5f91ed4e35e54d9d0bef07ed156f36`; worktree inicialmente limpo; o baseline informado `4d6dd8c44582501faf47c913b567efc05d9454e6` foi reconciliado e os commits posteriores alteraram somente `docs/code-first-prd/**` | `EVIDENCIA_DE_IMPLEMENTACAO` |
| Baseline da ampliação dos modelos de dados | branch `docs/code-first-prd`; HEAD `b3c73fb7e3151c7badb23f8dfeac5c689e17983b`; upstream `origin/docs/code-first-prd`; worktree inicialmente limpo | `EVIDENCIA_IMPLEMENTACAO` |
| Método | análise Code-First estática, com separação entre direção humana, intenção inferida e estado implementado | `DECISAO_DE_TRABALHO_PARA_RASCUNHO` |
| Evidência de execução | runtime, aplicação, build, lint, testes, banco e deploy não foram validados nesta iniciativa; essa ausência limita a evidência sobre a implementação, mas não bloqueia a elaboração, a revisão ou a aprovação conceitual do PRD | `LIMITACAO_DA_EVIDENCIA` |
| Figma | fonte complementar e opcional; nenhum artefato foi avaliado ou utilizado nesta execução, e sua ausência não bloqueia a elaboração ou a aprovação do PRD | `DECISAO_DE_TRABALHO_PARA_RASCUNHO` — `CF-PD-008` |
| Decisões abertas | `CF-PD-002`, `CF-PD-003`, `CF-PD-005` e `CF-PD-006` | `DEPENDENCIA_ABERTA` |
| Autoridade para aprovação final | não designada | `NAO_ESPECIFICADO` — `CF-GAP-001`, `CF-Q-001` |
| Relação com a trilha original | não substitui nem cria `docs/product/PRD.md`, não inicia a Etapa 9 original e não altera seu estado | `DECISAO_DE_TRABALHO_PARA_RASCUNHO` |
| Validação cruzada | `CONCLUIDA`; relatório em [`analysis/code-first-package-validation.md`](analysis/code-first-package-validation.md) | `EVIDENCIA_DE_IMPLEMENTACAO` |
| Versão Code-First baseada no código | `CONCLUIDA_EM_REVISAO` | `DECISAO_DE_TRABALHO_PARA_RASCUNHO` |
| Fase 1 / Fase 2 | `CONCLUIDA` / `NAO_INICIADA` | ponto de parada da iniciativa |
| Fase 1 ampliada | `FASE_1_AMPLIADA_CONCLUIDA_EM_REVISAO` | quatro novos artefatos de modelos de dados validados estaticamente; não inicia a Fase 2 |

As fontes locais deste rascunho são [`README.md`](README.md), [`governance/source-policy.md`](governance/source-policy.md), [`inventories/repository-inventory.md`](inventories/repository-inventory.md), [`analysis/current-product-state.md`](analysis/current-product-state.md), [`analysis/decision-snapshot.md`](analysis/decision-snapshot.md), [`analysis/gaps-and-open-questions.md`](analysis/gaps-and-open-questions.md), [`analysis/product-hypotheses.md`](analysis/product-hypotheses.md), a [`revisão de H01–H10`](reviews/product-hypotheses-human-review.md), o catálogo detalhado [`specifications/requirements.md`](specifications/requirements.md), a especificação do [`diagrama de classes`](specifications/class-diagram.md), o [`modelo lógico de dados`](specifications/logical-data-model.md) e o [`modelo relacional de dados`](specifications/relational-data-model.md). Também foram usados código, schema e configurações permitidas, [`../../TECH_DECISIONS.md`](../../TECH_DECISIONS.md), [`../../PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md) apenas para identidade/propósito geral e as respostas humanas de `CF-PD-001`, `CF-PD-004`, `CF-PD-007` e `CF-PD-008` fornecidas em 2026-08-27. O anexo revisto em H01–H10 não identifica autor, função ou autoridade e, por isso, não promove intenção normativa.

### Classificações deste rascunho

| Classificação | Uso neste documento |
|---|---|
| `DECISAO_DE_TRABALHO_PARA_RASCUNHO` | decisão registrada que pode estruturar o documento em elaboração, sem aprovação final |
| `DIRECAO_CONFIRMADA_PARA_RASCUNHO` | conteúdo confirmado em `CF-PD-001`, `CF-PD-004` ou `CF-PD-007`, sem aprovação normativa final |
| `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` | formulação provisória rastreada ao código e às direções do rascunho |
| `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` | inferência explícita sobre produto pretendido, ainda dependente de confirmação |
| `REVISAO_HUMANA_PENDENTE_DE_AUTORIDADE` | direção ou esclarecimento humano cuja autoria, função ou autoridade competente não foi identificada; não equivale a confirmação nem aprovação |
| `DEPENDENCIA_ABERTA` | decisão, validação ou contrato ainda necessário para consolidar a parte afetada |
| `LIMITACAO_DA_EVIDENCIA` | ausência de validação ou cobertura suficiente para concluir o estado da implementação; não constitui dependência do produto nem bloqueia elaboração, revisão ou aprovação conceitual do PRD |
| `FORA_DO_MVP_CANDIDATO` | capacidade excluída do núcleo do primeiro MVP por `CF-PD-004`, sem rejeição definitiva |
| `NAO_ESPECIFICADO` | informação ausente nas fontes permitidas ou ainda sem resposta aplicável |

Nenhuma dessas classificações equivale a `APROVADO`. Os requisitos escritos com “deverá” são candidatos deste rascunho e não possuem autoridade normativa final.

## Modelos de dados Code-First

O [`modelo lógico`](specifications/logical-data-model.md) apresenta as entidades, atributos, identificadores, domínios enumerados e relacionamentos observáveis no schema. O [`modelo relacional`](specifications/relational-data-model.md) apresenta a organização da mesma estrutura nos 11 models Prisma, diferenciando campos escalares potencialmente persistíveis de campos de relação, e registra chaves, FKs, unicidade, nulabilidade, defaults, índices e ações referenciais somente quando explicitamente declarados.

Os dois modelos são complementares e descritivos do baseline; não são propostas independentes, não redesenham o schema e não aprovam o domínio. O nome de um model ou campo não é apresentado como nome físico observado no banco, e a declaração do provider PostgreSQL não prova que o banco esteja implantado.

A correspondência com `CF-CLS-*`, requisitos, casos de uso e fluxos fica detalhada nos próprios modelos. O mapa permanece no MVP, mas a estrutura espacial declarada limita-se a `Coordinates` vinculado a `CollectionArea` e ao encadeamento indireto até `CollectionData`. O contrato científico e a forma de obtenção do IHFR, assim como regras de laboratório, participação, papéis e propriedade, continuam abertos.

## Resumo executivo

`DIRECAO_CONFIRMADA_PARA_RASCUNHO` — O HidroFlorestas é tratado neste rascunho como uma plataforma de monitoramento ambiental para equipes de pesquisa e extensão. O primeiro MVP enfrenta a dispersão entre organização das equipes, áreas monitoradas, coletas, dados ambientais e diagnóstico IHFR, que hoje dificulta rastreabilidade e acompanhamento. O resultado de valor pretendido é permitir que essas equipes executem e acompanhem um ciclo ambiental rastreável, dos registros de campo ao diagnóstico IHFR (`CF-PD-001`).

`DIRECAO_CONFIRMADA_PARA_RASCUNHO` — O MVP deve demonstrar de ponta a ponta laboratório → área monitorada → coleta → dados ambientais → diagnóstico IHFR → acompanhamento básico. Conta/sessão, laboratório mínimo, criação ou entrada, seleção do contexto ativo, áreas, coletas, dados ambientais, obtenção/consulta do diagnóstico, resumo e histórico básicos compõem o núcleo (`CF-PD-004`).

`DIRECAO_CONFIRMADA_PARA_RASCUNHO` — O mapa também integra o núcleo do primeiro MVP: participa do cadastro e da representação espacial das áreas monitoradas, da associação espacial das coletas e de seus dados e da visualização territorial das coletas, gráficos e resultados das análises IHFR. A direção funcional está confirmada; representação geométrica, precisão, camadas, interações e tecnologia permanecem abertas (`CF-PD-007`, `CF-PRD-FR-013`, `CF-PRD-FR-014`, `CF-PRD-FR-015`).

`HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` — Laboratório aparenta ser a unidade colaborativa que contextualiza participantes e recursos (`CF-CAP-007`).

`LIMITACAO_DA_EVIDENCIA` — O código atual está em estágio parcial: autenticação possui conectividade estática; workspace, áreas e histórico são mockados ou parciais; mapa é placeholder; dados ambientais e IHFR existem no schema sem consumidor conectado. Esses estados descrevem a implementação observada e limitam conclusões sobre ela; não constituem dependências para definir o produto pretendido (`CF-CAP-002`, `CF-CAP-003`, `CF-CAP-004`, `CF-CAP-005`, `CF-CAP-007`, `CF-CAP-008`, `CF-CAP-009`, `CF-CAP-010`, `CF-CAP-011`, `CF-CAP-014`).

## Contexto e problema

`DIRECAO_CONFIRMADA_PARA_RASCUNHO` — As equipes prioritárias precisam articular sua organização, áreas monitoradas, atividades de campo, dados ambientais e diagnósticos IHFR. Quando esses elementos ficam dispersos, a equipe perde continuidade entre o trabalho executado, o local monitorado e o resultado consultado (`CF-PD-001`, `CF-GAP-003`, `CF-Q-003`).

`HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` — A organização por laboratório oferece um contexto colaborativo candidato para reunir participantes, áreas, coletas e resultados. O encadeamento do schema e das interfaces sugere que o acompanhamento de uma área depende de preservar relações entre laboratório, área, coleta, autor, dados ambientais e diagnóstico, mas regras detalhadas de colaboração ainda estão abertas (`CF-CAP-007`, `CF-CAP-009`, `CF-CAP-010`, `CF-CAP-013`, `CF-CAP-014`, `CF-GAP-008`, `CF-GAP-009`).

## Usuários prioritários e atores

| Ator | Papel no rascunho | Estado | Rastreabilidade |
|---|---|---|---|
| Equipes de pesquisa e extensão | público operacional prioritário do primeiro MVP | `DIRECAO_CONFIRMADA_PARA_RASCUNHO` | `CF-PD-001`, `CF-GAP-003`, `CF-Q-003` |
| Participante de laboratório | denominação funcional candidata para a pessoa vinculada ao espaço colaborativo; o schema não define qualificação profissional | `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO`; H02 em `REVISAO_HUMANA_PENDENTE_DE_AUTORIDADE` | `CF-CAP-007`; `ResearchersLinked` em `prisma/schema.prisma`, model `ResearchersLinked`; `CF-PD-002`; revisão H02 |
| Responsável pelo laboratório | ator candidato associado à criação ou condução do contexto; vínculo técnico não define responsabilidade, propriedade ou permissão | `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO`; H03 em `REVISAO_HUMANA_PENDENTE_DE_AUTORIDADE` | `LaboratoryRoom.userId`; `src/app/(private)/workspace/page.tsx`, texto “Seja responsável”; `CF-PD-002`, `CF-PD-006`; revisão H03 |
| Participante de campo | especialização funcional candidata para quem registra a coleta; não é papel técnico implementado | `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO`; H04 em `REVISAO_HUMANA_PENDENTE_DE_AUTORIDADE` | `CollectionData.userId`; `CF-FLOW-006`, `CF-PD-003`; revisão H04 |
| Administrador global futuro | possível ator transversal; a interface global está fora do núcleo, mas o futuro operador não está definido | `FORA_DO_MVP_CANDIDATO`; parcela de H10 em `REVISAO_HUMANA_PENDENTE_DE_AUTORIDADE` | `CF-CAP-012`, `CF-CAP-017`, `CF-GAP-011`, `CF-PD-004`, `CF-PD-006`; revisão H10 |

## Visão e proposta de valor

`DIRECAO_CONFIRMADA_PARA_RASCUNHO` — Oferecer às equipes de pesquisa e extensão uma plataforma na qual possam manter e representar espacialmente áreas monitoradas, registrar coletas e dados ambientais com vínculo territorial, obter e consultar um diagnóstico IHFR e acompanhar o ciclo por resumo, histórico e mapa (`CF-PD-001`, `CF-PD-004`, `CF-PD-007`).

`HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` — A colaboração seria organizada por laboratórios usados como contexto ativo para pessoas e recursos do ciclo (`CF-CAP-007`, `CF-FLOW-005`, `CF-PD-002`).

`HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` — O valor colaborativo pode decorrer de contextualizar recursos no laboratório sem perder os vínculos de autoria aplicáveis. O schema associa áreas ao laboratório e ao usuário e coletas à área e ao usuário, mas não implementa acesso compartilhado, não atribui autor direto a todo dado ou diagnóstico e não define propriedade. O valor ambiental/científico decorre de manter o diagnóstico ligado à coleta e à área, sem presumir pelo schema qual matemática, método de produção ou interpretação científica será adotada (`CF-CAP-013`, `CF-CAP-014`, `CF-GAP-009`, `CF-GAP-012`; revisão H06).

## Objetivos do MVP

| Ordem | Objetivo qualitativo | Classificação | Rastreabilidade |
|---:|---|---|---|
| 1 | organizar equipes em um contexto de laboratório | `DIRECAO_CONFIRMADA_PARA_RASCUNHO` | `CF-PD-001`, `CF-PD-004` |
| 2 | manter áreas monitoradas vinculadas ao laboratório ativo e representadas espacialmente no mapa | `DIRECAO_CONFIRMADA_PARA_RASCUNHO` | `CF-PD-004`, `CF-PD-007`, `CF-CAP-009`, `CF-CAP-011`, `CF-CAP-013` |
| 3 | registrar coletas e dados ambientais definidos pelo contrato científico, associados à área e à referência espacial aplicável | `DIRECAO_CONFIRMADA_PARA_RASCUNHO` | `CF-PD-004`, `CF-PD-007`, `CF-CAP-014` |
| 4 | associar a coleta a um diagnóstico IHFR | `DIRECAO_CONFIRMADA_PARA_RASCUNHO` | `CF-PD-004`, `CF-CAP-014`, `CF-PD-005` |
| 5 | permitir acompanhamento básico e rastreável por resumo, histórico e visualização territorial de coletas, gráficos e resultados IHFR aplicáveis | `DIRECAO_CONFIRMADA_PARA_RASCUNHO` | `CF-PD-004`, `CF-PD-007`, `CF-CAP-008`, `CF-CAP-010`, `CF-CAP-011` |
| 6 | demonstrar a jornada completa de ponta a ponta | `DIRECAO_CONFIRMADA_PARA_RASCUNHO` | `CF-PD-004` |

Métricas quantitativas, metas e limiares de sucesso permanecem `NAO_ESPECIFICADO` (`CF-PD-001`, `CF-GAP-003`, `CF-Q-003`).

## Fora do escopo do MVP candidato

| Capacidade | Tratamento | Classificação | Rastreabilidade |
|---|---|---|---|
| IA explicativa, recomendação ou interpretação automatizada | fora do núcleo; nenhuma alegação atual se torna requisito confirmado | `FORA_DO_MVP_CANDIDATO` | `CF-PD-004`, `CF-GAP-013`, `CF-Q-004` |
| Interface completa de administração global | fora do núcleo | `FORA_DO_MVP_CANDIDATO` | `CF-PD-004`, `CF-CAP-012`, `CF-CAP-017` |
| Relatórios avançados | pós-MVP candidato | `FORA_DO_MVP_CANDIDATO` | `CF-PD-004`, `CF-CAP-008` |
| Experiências institucionais ampliadas | pós-MVP candidato | `FORA_DO_MVP_CANDIDATO` | `CF-PD-004`, `CF-CAP-001` |
| Estratégia futura definitiva de hospedagem | decisão arquitetural posterior | `FORA_DO_MVP_CANDIDATO` | `TD-013`, `CF-Q-020` |
| Definição técnica final de Python/Next.js | decisão arquitetural posterior ao contrato científico | `FORA_DO_MVP_CANDIDATO` | `TD-009`, `TD-012`, `CF-GAP-023` |

`DIRECAO_CONFIRMADA_PARA_RASCUNHO` — O mapa não integra esta lista de exclusões. Sua função no núcleo está confirmada por `CF-PD-007`; somente seu detalhamento técnico e de UX permanece aberto.

## Modelo conceitual do produto

```text
usuário
→ vínculo com laboratório
→ laboratório
→ área monitorada
→ representação espacial da área no mapa
→ coleta
→ associação espacial aplicável
→ dados ambientais
→ diagnóstico IHFR
→ resumo/histórico/visualização territorial
```

| Conceito | Relação no rascunho | Estado | Regra ainda aberta | Evidência |
|---|---|---|---|---|
| Usuário | possui conta/sessão e atua no contexto de uma equipe | `DIRECAO_CONFIRMADA_PARA_RASCUNHO` | ciclo de conta e elegibilidade | `CF-PD-001`, `CF-PD-004`, `CF-CAP-002`, `CF-CAP-003`, `CF-CAP-004` |
| Vínculo com laboratório | conecta pessoa e espaço colaborativo | `EVIDENCIA_IMPLEMENTACAO` para a associação técnica; intenção em `REVISAO_HUMANA_PENDENTE_DE_AUTORIDADE` | convite, aprovação, papel, saída e datas | model `ResearchersLinked`; `CF-PD-002`; revisão H05 |
| Laboratório | contextualiza participantes e recursos do ciclo ambiental | `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` | criação, propriedade, múltiplos espaços e transferência | `CF-PD-004`, `CF-CAP-007`, `prisma/schema.prisma:51-68` |
| Área monitorada | pertence ao contexto do laboratório e reúne coletas | `DIRECAO_CONFIRMADA_PARA_RASCUNHO` | dados mínimos, estados e edição | `CF-PD-004`, `CF-CAP-009`, `prisma/schema.prisma:76-109` |
| Coleta | registro ligado tecnicamente à área e a um usuário, interpretado funcionalmente como autor candidato | `EVIDENCIA_IMPLEMENTACAO` para as FKs; intenção em `REVISAO_HUMANA_PENDENTE_DE_AUTORIDADE` | ciclo, autoria normativa, revisão, edição e exclusão | `CF-PD-004`, `CF-FLOW-006`, model `CollectionData`; revisão H07 |
| Dados ambientais | dados associados à coleta; água, solo, vegetação e terreno são somente grupos do schema atual, sem status de contrato definitivo | `EVIDENCIA_IMPLEMENTACAO` para a estrutura; evolução em `REVISAO_HUMANA_PENDENTE_DE_AUTORIDADE` | contrato, identificação de sua versão, campos normativos, unidades, validações e evolução científica | `CF-CAP-014`, models `WaterData`, `SoilData`, `VegetationData`, `TerrainData`; revisão H08 |
| Diagnóstico IHFR | resultado associado à coleta e, por ela, à área | `DIRECAO_CONFIRMADA_PARA_RASCUNHO` | método de produção, matemática e contrato científico | `CF-PD-004`, `CF-PD-005`, `prisma/schema.prisma:128-142` |
| Resumo/histórico | projeção básica para acompanhamento posterior | `DIRECAO_CONFIRMADA_PARA_RASCUNHO` | eventos, filtros, retenção e conteúdo do resumo | `CF-PD-004`, `CF-CAP-008`, `CF-CAP-010`, `CF-FLOW-007` |
| Mapa | participa do cadastro e da representação espacial das áreas, da associação espacial das coletas e dados e da visualização territorial de coletas, gráficos e resultados IHFR aplicáveis | `DIRECAO_CONFIRMADA_PARA_RASCUNHO` | geometria, coordenadas, camadas, precisão, privacidade, filtros, interação e tecnologia | `CF-PD-007`, `CF-CAP-011`, `CF-GAP-021`, `CF-PRD-FR-013`, `CF-PRD-FR-014`, `CF-PRD-FR-015` |

O schema evidencia relações implementadas, mas não aprova o domínio (`CF-GAP-014`, `CF-Q-017`). O modelo implementado completo, seus tipos de aplicação e os mocks não persistidos estão inventariados em [`specifications/class-diagram.md`](specifications/class-diagram.md), com Mermaid no próprio documento e representação equivalente em [`diagrams/plantuml/class-diagram.puml`](diagrams/plantuml/class-diagram.puml). Os diagramas retratam o código e o schema reconciliados no baseline `213918ec6a5f91ed4e35e54d9d0bef07ed156f36`; não aprovam o schema como domínio final, não definem arquitetura de mapa e não validam o contrato científico do IHFR.

## Laboratórios

`HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` — Laboratório aparenta ser uma unidade colaborativa candidata: a interface sugere criar, entrar e acessar, e o schema relaciona laboratório, participantes e áreas. O contexto ativo é apenas estado local na interface, e compartilhamento, responsabilidade, papéis e acesso não estão implementados (`CF-CAP-007`, `CF-FLOW-005`, models `LaboratoryRoom` e `ResearchersLinked`; revisão H01, H02, H03, H04, H05 e H06).

`REVISAO_HUMANA_PENDENTE_DE_AUTORIDADE` — A analogia com uma sala do Google Classroom foi apresentada como explicação exclusivamente conceitual para criação de contexto, ingresso e compartilhamento. Ela não é verificável no código, não importa regras, terminologia, fluxos, permissões ou interface e não fecha `CF-PD-002` ou `CF-PD-006` (revisão H09).

`DEPENDENCIA_ABERTA` — `CF-PD-002` mantém abertas as regras de convite ou código, aprovação, múltiplos laboratórios, saída, transferência de responsabilidade, papéis e propriedade. O rascunho pode descrever o contexto colaborativo e o laboratório ativo, mas não pode aprovar essas regras (`CF-GAP-008`, `CF-GAP-009`, `CF-GAP-010`, `CF-Q-007`, `CF-Q-008`, `CF-Q-009`).

## Jornada principal

| Etapa | Comportamento pretendido candidato | Implementação atual | Limitação ou diferença da implementação | Dependência de produto aberta | Rastreabilidade | Classificação |
|---|---|---|---|---|---|---|
| Cadastro/login | permitir acesso por conta e credenciais ao workspace | fluxo conectado estaticamente, sem runtime | política de conta e validações não estão aprovadas | `CF-Q-005`, `CF-Q-006` | `CF-CAP-002`, `CF-CAP-003`, `CF-FLOW-001`, `CF-FLOW-002` | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| Criação ou entrada em laboratório | disponibilizar um contexto colaborativo à equipe | botões e estado local; relações somente no schema | não há fluxo persistido nem regra de adesão | `CF-PD-002` | `CF-CAP-007`, `CF-FLOW-005`, `prisma/schema.prisma:51-81` | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| Seleção do laboratório | manter um laboratório ativo como contexto da navegação | card fixo e link para dashboard | troca e cardinalidade não estão definidas | `CF-PD-002`, `CF-PD-006` | `CF-CAP-007`, `CF-FLOW-005`, `src/app/(private)/workspace/page.tsx:19-168` | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| Área monitorada | criar e consultar áreas dentro do laboratório ativo | lista mockada, ação placeholder e schema sem consumidor | CRUD e regras de domínio não existem como fluxo conectado | `CF-PD-003`, `CF-PD-006` | `CF-CAP-009`, `CF-FLOW-006`, `prisma/schema.prisma:76-109` | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| Cadastro espacial da área | cadastrar e representar a área monitorada utilizando o mapa | coordenadas e vínculo no schema, link mockado e mapa placeholder | fluxo espacial conectado e representação geométrica não estão definidos | `CF-PD-003`, `CF-PD-006`, `CF-Q-012`, `CF-Q-013` | `CF-PD-007`, `CF-CAP-011`, `prisma/schema.prisma:43-49`, `prisma/schema.prisma:76-96` | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| Coleta e dados ambientais | registrar coleta na área e os dados ambientais definidos pelo contrato científico aplicável | botão placeholder e schema sem consumidor, com água, solo, vegetação e terreno como grupos sugeridos | fluxo conectado não localizado; contrato, campos normativos e validações permanecem abertos | `CF-PD-003`, `CF-PD-005` | `CF-CAP-014`, `CF-FLOW-006`, `prisma/schema.prisma:110-198` | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| Associação espacial da coleta | associar coleta e dados ambientais à área e à referência espacial aplicável | relações entre coordenadas, área, coleta e dados no schema, sem consumidor | granularidade e fluxo espacial permanecem abertos | `CF-PD-003`, `CF-PD-005`, `CF-PD-006`, `CF-Q-012` | `CF-PD-007`, `prisma/schema.prisma:43-49`, `prisma/schema.prisma:76-126` | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| Obtenção/consulta do diagnóstico IHFR | associar e consultar um diagnóstico rastreável | estrutura no schema sem API, serviço ou tela consumidora | método de obtenção e ciência não estão definidos | `CF-PD-005` | `CF-CAP-014`, `CF-GAP-012`, `prisma/schema.prisma:128-142` | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| Resumo e histórico | permitir acompanhamento posterior do ciclo | dashboard parcial e histórico mockado | dados reais, eventos e destinos não estão conectados | `CF-PD-003` | `CF-CAP-008`, `CF-CAP-010`, `CF-FLOW-007` | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| Visualização territorial | visualizar no mapa áreas, coletas, dados, gráficos e resultados IHFR aplicáveis com vínculo aos registros de origem | mapa placeholder e estruturas de domínio sem projeção conectada | conteúdo, camadas, interação, tecnologia e contrato científico permanecem abertos | `CF-PD-003`, `CF-PD-005`, `CF-PD-006`, `CF-Q-012`, `CF-Q-013` | `CF-PD-007`, `CF-CAP-011`, `CF-CAP-014` | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |

`DIRECAO_CONFIRMADA_PARA_RASCUNHO` — A sequência de alto nível é acesso → laboratório → contexto ativo → área no mapa → coleta e associação espacial → dados ambientais → obter ou associar diagnóstico IHFR pelo mecanismo aplicável → consulta do resultado → mapa, resumo ou histórico (`CF-PD-004`, `CF-PD-007`). A forma de produção do IHFR permanece aberta em `CF-PD-005`; os demais detalhes continuam provisórios até `CF-PD-002`, `CF-PD-003`, `CF-PD-005` e `CF-PD-006` serem respondidas.

`LIMITACAO_DA_EVIDENCIA` — Fluxos estáticos, implementação parcial, mocks, placeholders e ausência de consumidor nas linhas acima contextualizam somente o estado observado. Eles não são dependências para definir os comportamentos pretendidos nem bloqueiam elaboração, revisão ou aprovação conceitual deste PRD.

O PRD mantém a visão, o escopo e a jornada de alto nível. A especificação separada [`specifications/use-cases.md`](specifications/use-cases.md) detalha atores e interações. Os sete fluxos completos, suas etapas, alternativas sustentadas, relações e diagramas Mermaid estão em [`specifications/product-flows.md`](specifications/product-flows.md), com representações de atividade equivalentes em [`diagrams/plantuml/product-flows.puml`](diagrams/plantuml/product-flows.puml). Os casos de uso também possuem representação equivalente em [`diagrams/plantuml/use-cases.puml`](diagrams/plantuml/use-cases.puml).

## Escopo funcional do MVP

### Identidade e acesso

`REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` — Conta e sessão integram o núcleo; cadastro, login e manutenção da sessão são comportamentos candidatos para acesso e autoria (`CF-PD-004`, `CF-CAP-002`, `CF-CAP-003`, `CF-CAP-004`, `CF-CAP-005`).

### Laboratório mínimo

`DIRECAO_CONFIRMADA_PARA_RASCUNHO` — O MVP inclui criar ou entrar em laboratório e selecionar o contexto ativo. Mecanismos de convite, aprovação, múltiplos espaços e papéis são dependências abertas (`CF-PD-004`, `CF-PD-002`, `CF-CAP-007`).

### Áreas monitoradas

`REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` — A equipe precisa criar e consultar áreas vinculadas ao laboratório ativo. Dados mínimos, estados, edição e remoção permanecem candidatos dependentes de `CF-PD-003` e `CF-PD-006` (`CF-PD-004`, `CF-CAP-009`, `CF-CAP-013`).

### Cadastro e associação espacial

`DIRECAO_CONFIRMADA_PARA_RASCUNHO` — O mapa integra o cadastro e a representação espacial da área e a associação das coletas e de seus dados à referência espacial aplicável. A relação candidata preservada é laboratório → área → localização aplicável → coleta → dados ambientais, sem determinar ponto, polígono, formato de coordenadas ou combinação (`CF-PD-007`, `CF-PRD-FR-013`, `CF-PRD-FR-014`).

### Coletas e dados ambientais

`REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` — O MVP inclui registrar coletas ligadas à área e os dados ambientais definidos pelo contrato científico aplicável. Água, solo, vegetação e terreno permanecem apenas como grupos sugeridos pelo schema atual e não constituem taxonomia científica aprovada (`CF-PD-004`, `CF-CAP-014`, `CF-GAP-012`, `CF-GAP-014`).

### Diagnóstico IHFR

`DIRECAO_CONFIRMADA_PARA_RASCUNHO` — O ciclo chega à obtenção e consulta de um diagnóstico IHFR associado à coleta. A forma de produção permanece aberta em `CF-PD-005`; o escopo não aprova cálculo interno, Python, importação, registro manual ou serviço externo (`CF-PD-004`, `CF-CAP-014`, `CF-GAP-012`, `CF-GAP-023`).

### Acompanhamento básico e territorial

`DIRECAO_CONFIRMADA_PARA_RASCUNHO` — Resumo, histórico e mapa fecham o ciclo do MVP, permitindo reencontrar os registros e visualizar territorialmente áreas, coletas, dados, gráficos e resultados IHFR aplicáveis com vínculo rastreável à origem. Conteúdo, eventos, camadas e interação permanecem provisórios (`CF-PD-003`, `CF-PD-004`, `CF-PD-007`, `CF-CAP-008`, `CF-CAP-010`, `CF-CAP-011`).

### Mapa no núcleo do MVP

`DIRECAO_CONFIRMADA_PARA_RASCUNHO` — O mapa integra o núcleo do primeiro MVP nas funções estabelecidas em `CF-PRD-FR-013`, `CF-PRD-FR-014` e `CF-PRD-FR-015`. Leaflet/React-Leaflet são a escolha local planejada para o mapa mínimo da IMP-008; provedor, arquitetura definitiva, representação geométrica adicional, camadas, precisão, privacidade e interações continuam decisões técnicas ou de UX abertas. `TD-010` confirma Plotly somente para gráficos analíticos futuros posteriores à IMP-009, sem implementação ou integração definida (`CF-PD-007`, `CF-CAP-011`, `TD-008`, `TD-010`, `TD-011`, `TD-014`).

## Requisitos funcionais candidatos

Os requisitos abaixo oferecem uma visão completa e resumida do escopo funcional. O detalhamento de ator, prioridade, origem, evidência, implementação, precondições, fluxo, critérios, dependências e decisões está em [`specifications/requirements.md`](specifications/requirements.md), referência detalhada dos requisitos candidatos. Nenhum requisito está `APROVADO` e sua existência não afirma implementação completa.

| ID | Formulação candidata | Ator | Origem | Evidência | Estado da implementação | Dependência de produto aberta | Decisão relacionada | Critério de aceitação provisório | Classificação |
|---|---|---|---|---|---|---|---|---|---|
| `CF-PRD-FR-001` | O produto deverá permitir que uma pessoa elegível crie uma conta ou faça login para acessar o workspace. | participante da equipe | `CF-PD-001`, `CF-PD-004` | `CF-CAP-002`, `CF-CAP-003`, `CF-CAP-015`, `CF-CAP-016`; `CF-FLOW-001`, `CF-FLOW-002`; `src/app/register/page.tsx:14-49`, `src/app/login/page.tsx:12-37` | `IMPLEMENTADO_VERIFICADO_ESTATICAMENTE` | elegibilidade, dados mínimos, estados de conta e mensagens (`CF-Q-005`, `CF-Q-006`) | `CF-PD-004` | com dados aceitos pela política ainda a definir, a pessoa conclui cadastro ou login e alcança o workspace; a validação em runtime não foi realizada e constitui `LIMITACAO_DA_EVIDENCIA` | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| `CF-PRD-FR-002` | O produto deverá manter e restaurar a sessão necessária para navegar no contexto autenticado e permitir encerrá-la. | usuário cadastrado | `CF-PD-004` | `CF-CAP-004`, `CF-CAP-005`, `CF-CAP-006`; `CF-FLOW-003`, `CF-FLOW-004`; `src/contexts/auth.context.tsx:40-75`, `src/contexts/auth.context.tsx:159-171` | `PARCIALMENTE_IMPLEMENTADO` | política de conta/sessão e estados de acesso (`CF-Q-006`) | `CF-PD-004` | após autenticação válida, o contexto é restaurado nas páginas incluídas e o logout encerra o acesso local; controles técnicos não são prescritos aqui | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| `CF-PRD-FR-003` | O produto deverá permitir que uma equipe crie um laboratório mínimo ou ingresse em um laboratório existente. | responsável ou participante do laboratório | `CF-PD-004`; hipótese de laboratório | `CF-CAP-007`, `CF-FLOW-005`; `prisma/schema.prisma:51-81`; `src/app/(private)/workspace/page.tsx:46-86` | `PARCIALMENTE_IMPLEMENTADO` | convite/código, aprovação, saída, responsável e múltiplos espaços (`CF-PD-002`) | `CF-PD-002`, `CF-PD-004` | o usuário conclui um dos dois caminhos candidatos e passa a visualizar o laboratório disponível; o mecanismo exato permanece aberto | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| `CF-PRD-FR-004` | O produto deverá permitir selecionar um laboratório ativo para contextualizar áreas, coletas, diagnósticos, resumo e histórico. | participante do laboratório | `CF-PD-004`; hipótese de navegação | `CF-CAP-007`, `CF-FLOW-005`; `src/app/(private)/workspace/page.tsx:19-168` | `PARCIALMENTE_IMPLEMENTADO` | cardinalidade, troca de contexto e permissões (`CF-PD-002`, `CF-PD-006`) | `CF-PD-002`, `CF-PD-004`, `CF-PD-006` | após a seleção, as telas do ciclo identificam e usam o mesmo contexto ativo; regras para múltiplos laboratórios permanecem abertas | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| `CF-PRD-FR-005` | O produto deverá permitir criar e consultar áreas monitoradas vinculadas ao laboratório ativo. | participante de laboratório autorizado | `CF-PD-004`; modelo derivado do código | `CF-CAP-009`, `CF-CAP-013`, `CF-FLOW-006`; `prisma/schema.prisma:76-109`; `src/app/(private)/dashboard/collects/page.tsx:6-24` | `PARCIALMENTE_IMPLEMENTADO` | dados mínimos, estados, edição, remoção e propriedade (`CF-PD-003`, `CF-PD-006`) | `CF-PD-003`, `CF-PD-004`, `CF-PD-006` | uma área criada no contexto ativo pode ser reencontrada e consultada nesse contexto; campos e ciclo detalhados permanecem abertos | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| `CF-PRD-FR-006` | O produto deverá permitir registrar uma coleta vinculada a uma área monitorada e ao participante que a registrou. | participante de campo | `CF-PD-001`, `CF-PD-004`; modelo derivado do código | `CF-CAP-014`, `CF-FLOW-006`; `CollectionData` em `prisma/schema.prisma:110-126`; ação placeholder em `src/app/(private)/dashboard/page.tsx:14-16` | `PARCIALMENTE_IMPLEMENTADO` | estados, data de campo, revisão, edição e exclusão (`CF-PD-003`) | `CF-PD-003`, `CF-PD-004` | a coleta registrada mantém associação verificável com a área e o autor e pode ser recuperada posteriormente | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| `CF-PRD-FR-007` | O produto deverá permitir registrar, para uma coleta, os dados ambientais definidos pelo contrato científico aplicável. | participante de campo | `CF-PD-004`; contrato científico a validar; schema somente como evidência de implementação | `CF-CAP-014`; `prisma/schema.prisma:151-198`, que sugere grupos de água, solo, vegetação e terreno sem aprová-los como taxonomia científica | `PARCIALMENTE_IMPLEMENTADO` | contrato, campos normativos, unidades, obrigatoriedade e validações científicas (`CF-PD-003`, `CF-PD-005`, `CF-Q-011`) | `CF-PD-003`, `CF-PD-004`, `CF-PD-005` | a coleta mantém os dados exigidos pelo contrato científico aplicável, sem que este rascunho defina ou aprove grupos, variáveis, unidades ou cardinalidades | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| `CF-PRD-FR-008` | O produto deverá permitir associar um diagnóstico IHFR à coleta que lhe deu origem e, por essa relação, à área monitorada. | participante autorizado ou processo de diagnóstico ainda aberto | `CF-PD-004`; modelo derivado do código | `CF-CAP-014`; `IHFRDiagnosis` em `prisma/schema.prisma:128-142` | `PARCIALMENTE_IMPLEMENTADO` | forma de obtenção e contrato científico (`CF-PD-005`, `CF-Q-011`) | `CF-PD-004`, `CF-PD-005` | um diagnóstico aceito pelo fluxo futuro referencia a coleta de origem e permite chegar à área correspondente, sem prescrever como foi produzido | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| `CF-PRD-FR-009` | O produto deverá permitir consultar o resultado IHFR associado à coleta, preservando a origem e a versão do algoritmo disponível. | participante do laboratório autorizado | `CF-PD-004`; hipótese de resultado | `CF-CAP-014`; `IHFRDiagnosis.collectionDataId` e `IHFRDiagnosis.algorithmVersion`; ausência de consumidor e de versão do contrato científico em `CF-GAP-012` | `NAO_LOCALIZADO` | conteúdo do resultado, método de obtenção, validação, versão do contrato científico e relação entre contrato e algoritmo (`CF-PD-005`) | `CF-PD-004`, `CF-PD-005` | a consulta apresenta o resultado associado à coleta e a proveniência/versão de algoritmo disponível, sem inferir contrato, fórmula, classe ou limiar | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| `CF-PRD-FR-010` | O produto deverá permitir acompanhar o ciclo por um resumo e um histórico básicos no contexto do laboratório. | participante do laboratório | `CF-PD-004`; interfaces observadas | `CF-CAP-008`, `CF-CAP-010`, `CF-FLOW-007`; `src/app/(private)/dashboard/page.tsx:7-22`; `src/app/(private)/dashboard/activity-history.tsx:25-270` | `PARCIALMENTE_IMPLEMENTADO` | conteúdo do resumo, eventos, filtros, retenção e destinos (`CF-PD-003`) | `CF-PD-003`, `CF-PD-004` | um registro concluído pode ser localizado posteriormente no resumo ou histórico e relacionado ao contexto que o originou | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| `CF-PRD-FR-011` | O produto deverá permitir que um participante autorizado acesse os recursos do laboratório ativo compatíveis com seu vínculo e suas permissões. | participante do laboratório | `CF-PD-004`; hipótese provisória de acesso | `CF-CAP-013`, `CF-CAP-017`; relações em `prisma/schema.prisma:51-142`; lacuna `CF-GAP-009` | `PARCIALMENTE_IMPLEMENTADO` | permissões, propriedade, ações e exceções (`CF-PD-006`) | `CF-PD-004`, `CF-PD-006` | ao usar um laboratório ativo, o participante autorizado consegue consultar e usar os recursos correspondentes às ações que lhe forem permitidas; a matriz de acesso permanece aberta | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| `CF-PRD-FR-012` | O produto deverá associar a autoria aos registros para os quais ela for aplicável e permitir sua consulta nos pontos pertinentes da jornada. | participante de laboratório ou campo | `CF-PD-001`; hipótese provisória de autoria | `CF-CAP-010`, `CF-CAP-013`, `CF-CAP-014`; `User.collectionAreas` e `User.collectionData` em `prisma/schema.prisma:23-26`; `CF-FLOW-007` | `PARCIALMENTE_IMPLEMENTADO` | registros sujeitos a autoria, ações autorais, edição por terceiros, remoção e propriedade (`CF-PD-006`) | `CF-PD-006` | ao criar ou consultar um registro sujeito a autoria, a pessoa autorizada consegue associar ou identificar o autor aplicável; permissões permanecem abertas | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| `CF-PRD-FR-013` | O produto deverá permitir cadastrar e representar espacialmente uma área monitorada utilizando o mapa. | participante de laboratório autorizado | direção humana desta execução; `CF-PD-004`, `CF-PD-007` | `CF-CAP-009`, `CF-CAP-011`, `CF-CAP-013`; `prisma/schema.prisma:43-49`, `prisma/schema.prisma:76-96`; `src/app/(private)/dashboard/maps.tsx:18-46` | `PARCIALMENTE_IMPLEMENTADO` | geometria, dados espaciais, precisão, privacidade, interação e tecnologia (`CF-Q-012`, `CF-Q-013`) | `CF-PD-004`, `CF-PD-007` | uma área cadastrada pode ser representada no mapa e permanece vinculada ao mesmo registro, sem fixar a forma geométrica | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| `CF-PRD-FR-014` | O produto deverá permitir associar coletas e seus dados ambientais à área e à referência espacial aplicável. | participante de campo autorizado | direção humana desta execução; `CF-PD-004`, `CF-PD-007` | `CF-CAP-011`, `CF-CAP-013`, `CF-CAP-014`; `prisma/schema.prisma:43-49`, `prisma/schema.prisma:76-126`, `prisma/schema.prisma:151-198` | `PARCIALMENTE_IMPLEMENTADO` | granularidade espacial, precisão, privacidade e contrato científico (`CF-Q-011`, `CF-Q-012`, `CF-Q-013`) | `CF-PD-003`, `CF-PD-004`, `CF-PD-005`, `CF-PD-006`, `CF-PD-007` | a cadeia laboratório → área → localização aplicável → coleta → dados ambientais permanece rastreável | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| `CF-PRD-FR-015` | O produto deverá permitir visualizar no mapa as áreas, coletas, dados, gráficos e resultados IHFR aplicáveis, mantendo vínculo rastreável com os registros que os originaram. | participante do laboratório autorizado | direção humana desta execução; `CF-PD-004`, `CF-PD-007` | `CF-CAP-008`, `CF-CAP-011`, `CF-CAP-014`; `src/app/(private)/dashboard/maps.tsx:18-46`; `prisma/schema.prisma:76-142` | `PARCIALMENTE_IMPLEMENTADO` | conteúdo, camadas, filtros, interação, tecnologia e contrato científico (`CF-Q-011`, `CF-Q-012`, `CF-Q-013`) | `CF-PD-003`, `CF-PD-004`, `CF-PD-005`, `CF-PD-006`, `CF-PD-007` | cada elemento territorial apresentado mantém vínculo identificável com seu registro de origem | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |

## IHFR

`DIRECAO_CONFIRMADA_PARA_RASCUNHO` — O ciclo do MVP chega a um diagnóstico IHFR, associado a uma coleta e à respectiva área, e permite ao usuário consultar seu resultado (`CF-PD-004`, `CF-PRD-FR-008`, `CF-PRD-FR-009`).

`REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` — A rastreabilidade candidata atualmente sustentada preserva a coleta de origem e a versão do algoritmo armazenada no diagnóstico (`IHFRDiagnosis.collectionDataId`, `IHFRDiagnosis.algorithmVersion`; `CF-PRD-FR-008`, `CF-PRD-FR-009`, `CF-PRD-NFR-006`). O schema não identifica a versão do contrato científico aplicada à coleta.

`REVISAO_HUMANA_PENDENTE_DE_AUTORIDADE` — H08 propõe a cadeia futura `coleta → versão do contrato científico → versão do algoritmo → diagnóstico`. Ela é compatível com a direção do produto, mas não está integralmente no schema: somente coleta → diagnóstico e `algorithmVersion` são observáveis. A inclusão de versão do contrato e as regras de compatibilidade/evolução dependem de `CF-PD-005`, de autoridade de produto/dados e de validação científica; não constituem implementação atual nem novo requisito aprovado.

`DEPENDENCIA_ABERTA` — `CF-PD-005` não define se o diagnóstico será calculado internamente, produzido por componente Python, importado, registrado manualmente ou consultado de serviço externo. Também permanecem abertas a fórmula, pesos, variáveis normativas, classes, limiares, validações, qualidade e versionamento científicos (`CF-GAP-012`, `CF-GAP-023`, `CF-Q-011`, `TD-009`, `TD-012`).

Nenhum requisito deste rascunho define matemática do IHFR. `CF-PRD-FR-008`, `CF-PRD-FR-009` e `CF-PRD-NFR-006` tratam somente de presença, associação, consulta, integridade e rastreabilidade.

## Papéis e propriedade

`HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` — O rascunho usa provisoriamente responsável pelo laboratório e participante do laboratório. A interface de administração global permanece fora do núcleo por `CF-PD-004`. O schema associa áreas ao laboratório e ao usuário e coletas à área e ao usuário; isso sustenta contexto e autoria técnica dessas duas entidades, mas não prova acesso compartilhado, autoria direta de todo recurso ou propriedade (`CF-CAP-007`, `CF-CAP-012`, `CF-CAP-017`; revisão H02, H03, H04, H05, H06, H07 e H10).

`REVISAO_HUMANA_PENDENTE_DE_AUTORIDADE` — A afirmação de H10 de que a equipe HidroFlorestas exercerá futuramente moderação e controle administrativo não tem autor, mandato ou autoridade identificados e não é comprovada por `UserRole`, `isAdmin`, `requireAdmin` ou pelo script de superadministrador. O futuro operador permanece `NAO_ESPECIFICADO`; `ADMIN`, `MODERATOR` e `isAdmin` não são tratados como sinônimos.

`DEPENDENCIA_ABERTA` — `CF-PD-006` deve confirmar permissões, edição, remoção, propriedade, transferência, papéis adicionais e isolamento definitivo. Até essa resposta, os quatro requisitos permanecem candidatos e não aprovam uma matriz de acesso: `CF-PRD-FR-011` descreve o comportamento de acesso autorizado aos recursos do laboratório ativo; `CF-PRD-NFR-001`, a garantia de segregação entre laboratórios; `CF-PRD-FR-012`, a associação e consulta da autoria aplicável; e `CF-PRD-NFR-002`, a preservação da integridade da autoria e da proveniência ao longo do ciclo.

## Mapas, IA e Figma

### Mapas

`DIRECAO_CONFIRMADA_PARA_RASCUNHO` — `CF-PD-007` confirma o mapa como parte do núcleo do primeiro MVP para cadastro e representação espacial de áreas, associação espacial de coletas e dados e visualização territorial de coletas, gráficos e resultados IHFR aplicáveis. O mapa mínimo foi planejado com Leaflet/React-Leaflet; provedor, arquitetura definitiva, geometrias adicionais, camadas, precisão e interação futura seguem abertos. Plotly é direção confirmada apenas para gráficos analíticos futuros posteriores à IMP-009, condicionados aos contratos integrados e à aprovação científica aplicável (`CF-CAP-011`, `CF-GAP-021`, `CF-GAP-022`, `TD-008`, `TD-010`, `TD-011`, `TD-014`).

### IA

`FORA_DO_MVP_CANDIDATO` — IA está fora do núcleo por `CF-PD-004`. Alegações comerciais e `explanationAI` no schema não constituem requisito confirmado de explicação, recomendação ou cálculo (`CF-GAP-013`, `prisma/schema.prisma:139`).

### Figma

`DECISAO_DE_TRABALHO_PARA_RASCUNHO` — Figma é fonte complementar e opcional. Sua ausência não bloqueia elaboração, revisão ou aprovação do PRD; qualquer artefato futuro só adquire autoridade depois de ser identificado e classificado (`CF-PD-008`, `CF-GAP-016`, `CF-Q-014`).

## Requisitos não funcionais candidatos

São requisitos de resultado em nível de produto, sem prescrição de JWT, CSRF, rate limiting, bibliotecas, CI/CD, migrations, backup, observabilidade ou deploy. Nenhum está `APROVADO` e nenhuma meta numérica foi inventada.

O detalhamento integral dos seis requisitos não funcionais também está em [`specifications/requirements.md`](specifications/requirements.md).

| ID | Resultado candidato | Origem e evidência | Estado atual | Dependência de produto aberta | Critério de aceitação provisório | Classificação |
|---|---|---|---|---|---|---|
| `CF-PRD-NFR-001` | O produto deverá garantir a segregação dos dados entre laboratórios conforme os contextos e vínculos permitidos. | `CF-PD-004`, `CF-PD-006`; `CF-CAP-013`, `CF-CAP-017`; `prisma/schema.prisma:51-142` | relações no schema, sem garantia de segregação validada | permissões e isolamento definitivo em `CF-PD-006` | operações realizadas em um laboratório não expõem, misturam nem alteram dados de outro laboratório sem vínculo permitido; exceções dependem da futura matriz de acesso | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| `CF-PRD-NFR-002` | O produto deverá preservar a integridade da autoria e da proveniência aplicáveis ao longo de todo o ciclo do registro. | `CF-PD-001`, `CF-PD-004`, `CF-PD-006`; `CF-CAP-010`, `CF-CAP-013`, `CF-CAP-014`; `prisma/schema.prisma:23-26`, `prisma/schema.prisma:110-142` | chaves de autoria/origem no schema e histórico mockado, sem integridade validada | papéis, edição por terceiros, eventos e regras de proveniência em `CF-PD-003`, `CF-PD-006` | autoria e origem permanecem consistentes e consultáveis após criação, alteração, consulta e acompanhamento do registro; o diagnóstico preserva sua coleta de origem | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| `CF-PRD-NFR-003` | O produto deverá proteger dados pessoais contra consulta ou exposição por atores não autorizados. | `CF-GAP-025`, `CF-Q-017`; contexto de laboratório em `CF-PD-006` | comportamento e política não especificados; implementação não validada | política de privacidade, papéis e acesso em `CF-PD-006` e autoridades competentes | dados pessoais são apresentados somente a atores com acesso aplicável ao contexto; política detalhada permanece aberta | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| `CF-PRD-NFR-004` | O ciclo principal deverá ser utilizável em layouts responsivos nos contextos de uso suportados. | `CF-CAP-019`; `CF-FLOW-001`, `CF-FLOW-002`, `CF-FLOW-005`, `CF-FLOW-006`, `CF-FLOW-007`; `src/components/sidebar/index.tsx:34-63` | responsividade verificada apenas estaticamente e menu mobile parcial | contextos/dispositivos suportados e critérios de UX em `CF-Q-019` | as etapas incluídas permanecem navegáveis e compreensíveis nos layouts suportados a definir; a validação visual em runtime não foi realizada e constitui `LIMITACAO_DA_EVIDENCIA` | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| `CF-PRD-NFR-005` | O ciclo principal deverá oferecer acessibilidade básica para percepção, identificação e operação de seus controles e estados. | `CF-CAP-018`, `CF-GAP-018`, `CF-GAP-026`; `src/app/layout.tsx:24-30`, `src/components/header-screen/index.tsx:21-27` | sinais parciais; nenhuma auditoria executada | critérios detalhados de acessibilidade e UX em `CF-Q-014`, `CF-Q-019` | controles e mensagens das etapas incluídas possuem identificação e operação compreensíveis segundo critérios ainda a confirmar | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| `CF-PRD-NFR-006` | O produto deverá preservar a integridade da associação entre diagnóstico, coleta e área e registrar a versão do algoritmo disponível. | `CF-PD-004`, `CF-PD-005`; `CF-CAP-014`; `IHFRDiagnosis.collectionDataId`, `IHFRDiagnosis.algorithmVersion` | estrutura parcial no schema, sem consumidor, versão do contrato ou validação científica | contrato, identificação de sua versão, proveniência, método e relação contrato–algoritmo em `CF-PD-005`, `CF-Q-011` | a consulta do diagnóstico mantém a cadeia área → coleta → resultado e apresenta a versão de algoritmo disponível sem inferir contrato ou regra científica | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |

## Critérios de sucesso provisórios

`DIRECAO_CONFIRMADA_PARA_RASCUNHO` — O MVP demonstra valor qualitativo quando uma equipe consegue:

1. acessar a plataforma;
2. estabelecer um contexto de laboratório;
3. cadastrar ou selecionar uma área e representá-la espacialmente no mapa;
4. registrar uma coleta e os dados ambientais definidos pelo contrato científico aplicável, associados à área e à referência espacial aplicável;
5. obter ou registrar um diagnóstico IHFR válido segundo contrato futuro;
6. consultar o resultado;
7. acompanhar o registro por resumo e histórico;
8. visualizar territorialmente no mapa as áreas, coletas, dados, gráficos e resultados IHFR aplicáveis com vínculo à origem.

Rastreabilidade: `CF-PD-001`, `CF-PD-004`, `CF-PD-007`, `CF-PRD-FR-001`, `CF-PRD-FR-003`, `CF-PRD-FR-004`, `CF-PRD-FR-005`, `CF-PRD-FR-006`, `CF-PRD-FR-007`, `CF-PRD-FR-008`, `CF-PRD-FR-009`, `CF-PRD-FR-010`, `CF-PRD-FR-013`, `CF-PRD-FR-014`, `CF-PRD-FR-015`. Métricas quantitativas permanecem `NAO_ESPECIFICADO`.

## Decisões e dependências abertas

| Decisão | Seções provisórias | O que já pode ser redigido | O que não pode ser aprovado | Quem deve confirmar | Estado |
|---|---|---|---|---|---|
| `CF-PD-002` | modelo conceitual, laboratórios, jornada, `CF-PRD-FR-003`, `CF-PRD-FR-004` | laboratório como contexto colaborativo e seleção de contexto ativo | convite/código, aprovação, múltiplos laboratórios, saída, transferência e regras de adesão | produto e dados; segurança para acesso | `DEPENDENCIA_ABERTA` |
| `CF-PD-003` | jornada, áreas, coletas, acompanhamento, `CF-PRD-FR-005`, `CF-PRD-FR-006`, `CF-PRD-FR-007`, `CF-PRD-FR-010`, `CF-PRD-FR-013`, `CF-PRD-FR-014`, `CF-PRD-FR-015` | macrofluxo área → coleta/dados → diagnóstico → acompanhamento e funções confirmadas do mapa | estados, dados mínimos, revisão, edição, exclusão, eventos e conteúdo detalhado | produto e dados; ciência nos dados que alimentam IHFR | `DEPENDENCIA_ABERTA` |
| `CF-PD-005` | IHFR, `CF-PRD-FR-007`, `CF-PRD-FR-008`, `CF-PRD-FR-009`, `CF-PRD-NFR-006` | presença, associação, consulta, coleta de origem e versão de algoritmo disponível | método de obtenção, fórmula, variáveis, pesos, classes, limiares, versão do contrato, relação contrato–algoritmo e forma técnica de execução científica | produto para função; ciência para contrato; dados para rastreabilidade; arquitetura para execução | `DEPENDENCIA_ABERTA` |
| `CF-PD-006` | atores, papéis/propriedade, `CF-PRD-FR-004`, `CF-PRD-FR-005`, `CF-PRD-FR-011`, `CF-PRD-FR-012`, `CF-PRD-FR-013`, `CF-PRD-FR-014`, `CF-PRD-FR-015`, `CF-PRD-NFR-001`, `CF-PRD-NFR-002`, `CF-PRD-NFR-003` | responsável e participante como hipóteses; recursos no contexto e autoria individual | permissões, edição, remoção, propriedade, transferência, papéis adicionais e isolamento definitivo | produto, dados e segurança | `DEPENDENCIA_ABERTA` |

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

Todas as linhas usam `DECISAO_DE_TRABALHO_PARA_RASCUNHO`. OpenStreetMap (`TD-008`), Python (`TD-009`), integração Next.js/Python (`TD-012`), hospedagem futura (`TD-013`) e arquitetura definitiva de mapas (`TD-014`) permanecem alternativas técnicas em avaliação posterior. Leaflet/React-Leaflet são a escolha planejada para o mapa mínimo da IMP-008, e Plotly (`TD-010`) é direção confirmada para gráficos analíticos futuros posteriores à IMP-009; sua arquitetura de execução, integração, entradas e gráficos concretos permanecem `NAO_ESPECIFICADO`. Nenhuma dessas escolhas prova implementação ou autoriza dependência nova.

## Rastreabilidade local dos requisitos candidatos

Esta matriz é local ao rascunho e não altera a matriz global.

| Requisito | Decisão | Capacidade/fluxo | Evidência principal | Estado da implementação | Pendência de produto |
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
| `CF-PRD-FR-013` | `CF-PD-004`, `CF-PD-007` | `CF-CAP-009`, `CF-CAP-011`, `CF-CAP-013` | `prisma/schema.prisma:43-49`, `prisma/schema.prisma:76-96`; `src/app/(private)/dashboard/maps.tsx:18-46` | parcial/schema/placeholder | `CF-PD-003`, `CF-PD-006`, `CF-Q-012`, `CF-Q-013` |
| `CF-PRD-FR-014` | `CF-PD-003`, `CF-PD-004`, `CF-PD-005`, `CF-PD-006`, `CF-PD-007` | `CF-CAP-011`, `CF-CAP-013`, `CF-CAP-014` | `prisma/schema.prisma:43-49`, `prisma/schema.prisma:76-126`, `prisma/schema.prisma:151-198` | parcial/schema/sem consumidor | `CF-PD-003`, `CF-PD-005`, `CF-PD-006`, `CF-Q-012` |
| `CF-PRD-FR-015` | `CF-PD-003`, `CF-PD-004`, `CF-PD-005`, `CF-PD-006`, `CF-PD-007` | `CF-CAP-008`, `CF-CAP-011`, `CF-CAP-014` | `src/app/(private)/dashboard/maps.tsx:18-46`; `prisma/schema.prisma:76-142` | parcial/placeholder/sem consumidor | `CF-PD-003`, `CF-PD-005`, `CF-PD-006`, `CF-Q-012`, `CF-Q-013` |
| `CF-PRD-NFR-001` | `CF-PD-004`, `CF-PD-006` | `CF-CAP-013`, `CF-CAP-017` | `prisma/schema.prisma:51-142` | parcial/schema | `CF-PD-006` |
| `CF-PRD-NFR-002` | `CF-PD-001`, `CF-PD-004`, `CF-PD-006` | `CF-CAP-010`, `CF-CAP-013`, `CF-CAP-014`; `CF-FLOW-007` | `prisma/schema.prisma:23-26`, `prisma/schema.prisma:110-142` | parcial | `CF-PD-003`, `CF-PD-006` |
| `CF-PRD-NFR-003` | `CF-PD-006` | `CF-CAP-017` | `CF-GAP-025`, `CF-Q-017` | não especificado | `CF-PD-006` |
| `CF-PRD-NFR-004` | `CF-PD-004` | `CF-CAP-019`; `CF-FLOW-001`, `CF-FLOW-002`, `CF-FLOW-005`, `CF-FLOW-006`, `CF-FLOW-007` | `src/components/sidebar/index.tsx:34-63` | estático/parcial | `CF-Q-019` |
| `CF-PRD-NFR-005` | `CF-PD-004` | `CF-CAP-018` | `src/app/layout.tsx:24-30`; `src/components/header-screen/index.tsx:21-27` | parcial/não auditado | `CF-Q-014`, `CF-Q-019` |
| `CF-PRD-NFR-006` | `CF-PD-004`, `CF-PD-005` | `CF-CAP-014` | `prisma/schema.prisma:76-142` | parcial/sem consumidor | `CF-PD-005`, `CF-Q-011` |

## Riscos e premissas

| Tema | Síntese | Estado |
|---|---|---|
| Código atual | autenticação é estática; núcleo de domínio permanece parcial, mockado ou sem consumidor; esse contexto limita conclusões sobre a implementação, não a definição do produto pretendido | `LIMITACAO_DA_EVIDENCIA` |
| Runtime, build, testes, banco e deploy | não foram validados nesta iniciativa; isso limita a confiança sobre o estado da implementação e não bloqueia elaboração, revisão ou aprovação conceitual do PRD | `LIMITACAO_DA_EVIDENCIA` |
| Contrato científico | presença e rastreabilidade do IHFR podem ser redigidas; matemática e validação não podem ser aprovadas | `DEPENDENCIA_ABERTA` — `CF-PD-005` |
| Laboratórios e papéis | contexto colaborativo é hipótese; regras e propriedade permanecem abertas | `DEPENDENCIA_ABERTA` — `CF-PD-002`, `CF-PD-006` |
| Mapa | integra o núcleo do MVP nas funções de cadastro/representação espacial, associação espacial e visualização territorial; detalhamento técnico e de UX permanece aberto | `DIRECAO_CONFIRMADA_PARA_RASCUNHO` — `CF-PD-007` |
| IA | fora do núcleo do MVP | `FORA_DO_MVP_CANDIDATO` — `CF-PD-004` |
| Figma | fonte complementar e opcional; ausente nesta execução sem bloquear o PRD; artefato futuro exige identificação e classificação antes de adquirir autoridade | `DECISAO_DE_TRABALHO_PARA_RASCUNHO` — `CF-PD-008` |

## Estado de revisão e ponto de parada

Este documento permanece `EM_REVISAO`. `CF-PD-001`, `CF-PD-004`, `CF-PD-007` e `CF-PD-008` têm origem humana registrada para orientar o rascunho, sem equivaler a `APROVADO`. H01–H10 foram verificadas em [`reviews/product-hypotheses-human-review.md`](reviews/product-hypotheses-human-review.md); como o anexo não identifica autor, função ou autoridade, suas parcelas normativas permanecem `REVISAO_HUMANA_PENDENTE_DE_AUTORIDADE`. Os 15 requisitos funcionais e 6 requisitos não funcionais são candidatos e estão detalhados em [`specifications/requirements.md`](specifications/requirements.md); os casos de uso candidatos estão detalhados em [`specifications/use-cases.md`](specifications/use-cases.md), o modelo implementado está registrado em [`specifications/class-diagram.md`](specifications/class-diagram.md), os modelos [`lógico`](specifications/logical-data-model.md) e [`relacional`](specifications/relational-data-model.md) descrevem o baseline do schema e os sete fluxos estão em [`specifications/product-flows.md`](specifications/product-flows.md).

A validação cruzada final e sua ampliação foram concluídas em [`analysis/code-first-package-validation.md`](analysis/code-first-package-validation.md). A versão Code-First baseada no código está `CONCLUIDA_EM_REVISAO`, a ampliação está `FASE_1_AMPLIADA_CONCLUIDA_EM_REVISAO` e a Fase 2 está `NAO_INICIADA`, aguardando revisão humana e autorização explícita. Permanecem abertas `CF-PD-002`, `CF-PD-003`, `CF-PD-005` e `CF-PD-006`. Aprovação final continua dependente de autoridade formal, decisões aplicáveis e validação científica das partes do IHFR; nenhuma aprovação normativa foi concedida.

`VERSAO_CODE_FIRST_BASEADA_NO_CODIGO_CONCLUIDA`

`FASE_1_AMPLIADA_CONCLUIDA_EM_REVISAO`

`FASE_2_COMPLEMENTACAO_INCREMENTAL_NAO_INICIADA`

`FASE_2_NAO_INICIADA`
