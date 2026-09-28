# PRD Code-First

- **Nome da iniciativa:** `PRD Code-First`
- **Natureza:** iniciativa paralela, analítica
- **Estado da iniciativa:** `FASE_1_AMPLIADA_CONCLUIDA_EM_REVISAO`
- **Estado dos documentos desta base:** `EM_REVISAO`
- **Estado do PRD:** `EM_REVISAO`
- **Estado do Figma:** `NAO_AVALIADO`
- **Estado da validação cruzada:** `CONCLUIDA`
- **Estado da Fase 1:** `CONCLUIDA`
- **Estado da validação ampliada:** `CONCLUIDA`
- **Estado da Fase 1 ampliada:** `CONCLUIDA_EM_REVISAO`
- **Estado da Fase 2:** `NAO_INICIADA`
- **Aprovação normativa:** não concedida

## Atualização funcional de 2026-09-28

`EVIDENCIA_CODIGO` na branch `007-ihfr-evolution@94053df`: os [casos de uso revisados](specifications/use-cases.md) mantêm `CF-UC-001..015` e acrescentam `CF-UC-016..018`; as [histórias de usuário](specifications/user-stories.md) rastreiam as specs IMP-001 a IMP-009. O [roteiro de testes de uso](testing/roteiro-de-testes-de-uso.md) transforma essas jornadas em tarefas observáveis para o professor Fábio, participantes e equipe. A [revisão de merge](../validation/007-ihfr-evolution/2026-09-28-revisao-commits-e-merge.md) separa gates técnicos relatados dos estados Vercel: bloqueado no snapshot técnico anterior e concluído com sucesso no HEAD documental subsequente, sem causa histórica demonstrada.

As demais análises, requisitos, fluxos, modelos e diagramas deste pacote preservam o recorte histórico que cada arquivo declara; não foram revalidados integralmente neste trabalho. Esta atualização de uso continua `EM_REVISAO` e não promove o PRD, o contrato científico ou requisitos candidatos a norma aprovada. Ingresso em laboratório permanece indisponível; o mapa atual cobre áreas-ponto e coletas vinculadas, sem camada IHFR. A validação científica é etapa posterior do contrato experimental.

## Objetivo e limites

Esta iniciativa cria uma base verificável para compreender o produto atualmente observável no repositório, separar implementação de intenção e preparar perguntas para decisão humana. O código é a fonte inicial principal para reconstruir o produto que está sendo desenvolvido e formular hipóteses explícitas de intenção, sem presumir que essas hipóteses já representem o produto desejado. O PRD paralelo pode redigir requisitos candidatos explicitamente classificados, mas a iniciativa não aprova escolhas nem requisitos.

O `PRD Code-First` não substitui `docs/product/PRD.md`, não constitui continuação nem execução da Etapa 9 do processo documental original e não altera o estado de qualquer artefato anterior. O processo original permanece intacto; a Etapa 8 continua em revisão humana e a Etapa 9 não foi iniciada.

> Esta iniciativa não utiliza `docs/raw/**`, relatórios derivados desse corpus ou a matriz documental anterior como fontes de requisitos. O código demonstra o estado implementado, mas não converte automaticamente soluções provisórias, defeitos, mocks ou lacunas em comportamento desejado do produto.

## Fontes

### Permitidas

1. código rastreado e diretamente inspecionável;
2. `package.json`, lockfile e configurações rastreadas;
3. `prisma/schema.prisma`;
4. migration local somente como evidência de que existe um artefato local ignorado;
5. `TECH_DECISIONS.md`, preservando classificação e estados registrados;
6. inspeção Code-First anterior, somente quando a afirmação material é reconfirmável no repositório;
7. `PROJECT_CONTEXT.md`, somente para identidade, propósito e contexto geral;
8. documentos globais de governança, somente para autoridade, estado e separação entre iniciativas.
9. relato da equipe apresentado na revisão humana da iniciativa em 2026-08-27, somente para a referência organizacional do conceito de laboratório explicitamente classificada.
10. decisões humanas registradas nesta iniciativa, inclusive `CF-PD-001`, `CF-PD-004`, `CF-PD-007` e `CF-PD-008`, preservando seus limites e a inexistência de aprovação normativa final.
11. anexo `obs-prd-hidroflorestas-formal.md`, somente por meio da revisão H01–H10 que distingue compatibilidade técnica de autoridade e classifica suas direções como `REVISAO_HUMANA_PENDENTE_DE_AUTORIDADE`.

### Excluídas como conteúdo

- `docs/raw/**`, inclusive leitura, enumeração, pesquisa ou uso indireto de seu conteúdo;
- `docs/governance/TRACEABILITY_MATRIX.md`;
- relatórios e planos das auditorias documentais anteriores;
- conclusões fundamentadas apenas na documentação histórica;
- texto comercial da landing como prova de capacidade;
- fontes externas e Figma nesta execução.

## Código, decisões e Figma

Os três elementos têm funções distintas:

- o código, schema e configurações evidenciam o estado implementado que a inspeção consegue conectar e podem originar hipóteses de intenção explicitamente classificadas para confirmação humana;
- decisões da equipe expressam intenção conforme sua origem, autoridade e estado registrados; quando corroboradas nos termos da política local, podem ser usadas como decisões de trabalho no rascunho sem promoção normativa;
- Figma, quando fornecido e classificado, funciona como evidência complementar de intenção de UX; sua ausência não impede compreender o produto pelo código nem iniciar um rascunho autorizado.

Assim, estado implementado e estado pretendido permanecem em eixos independentes. Uma implementação sem decisão não se torna automaticamente comportamento desejado; uma decisão sem implementação não se torna funcionalidade atual.

## Documentos existentes

| Documento | Estado | Finalidade |
|---|---|---|
| [`governance/source-policy.md`](governance/source-policy.md) | `EM_REVISAO` | Hierarquia, classificações e limites das fontes. |
| [`inventories/repository-inventory.md`](inventories/repository-inventory.md) | `EM_REVISAO` | Inventário técnico reproduzível no commit-base. |
| [`analysis/current-product-state.md`](analysis/current-product-state.md) | `EM_REVISAO` | Capacidades, fluxos e riscos observados estaticamente. |
| [`analysis/decision-snapshot.md`](analysis/decision-snapshot.md) | `EM_REVISAO` | Snapshot não normativo de `TD-001` a `TD-014`. |
| [`analysis/gaps-and-open-questions.md`](analysis/gaps-and-open-questions.md) | `EM_REVISAO` | Lacunas e perguntas sem respostas ou decisões. |
| [`analysis/product-hypotheses.md`](analysis/product-hypotheses.md) | `EM_REVISAO` | Hipótese integrada do produto, escopo candidato e decisões mínimas derivadas do código. |
| [`analysis/code-first-package-validation.md`](analysis/code-first-package-validation.md) | `EM_REVISAO`; validação `CONCLUIDA` | Validação cruzada final, matriz mestra, gates, correções, limitações e estados da Fase 1. |
| [`reviews/product-hypotheses-human-review.md`](reviews/product-hypotheses-human-review.md) | `EM_REVISAO`; `REVISAO_HUMANA_PENDENTE_DE_AUTORIDADE` | Verificação corrigida de H01–H10 em compatibilidade técnica e autoridade da intenção, sem iniciar a Fase 2. |
| [`prd-code-first.md`](prd-code-first.md) | `EM_REVISAO` | Rascunho paralelo, não canônico e derivado do código, com requisitos candidatos e dependências abertas. |
| [`specifications/requirements.md`](specifications/requirements.md) | `EM_REVISAO` | Catálogo detalhado dos 15 requisitos funcionais e 6 não funcionais candidatos do pacote documental do PRD. |
| [`specifications/use-cases.md`](specifications/use-cases.md) | `EM_REVISAO`; revisão funcional 2026-09-28 | 18 casos de uso rastreáveis, com estados observados e limites da interface. |\n| [`specifications/user-stories.md`](specifications/user-stories.md) | `EM_REVISAO`; revisão funcional 2026-09-28 | 23 histórias locais ligadas às specs IMP-001 a IMP-009 e aos casos de uso. |\n| [`testing/roteiro-de-testes-de-uso.md`](testing/roteiro-de-testes-de-uso.md) | `EM_REVISAO`; roteiro de uso 2026-09-28 | Sessão orientada a pessoas, com jornada, observações e registro de feedback. |
| [`diagrams/plantuml/use-cases.puml`](diagrams/plantuml/use-cases.puml) | `EM_REVISAO`; revisão funcional 2026-09-28 | Diagrama PlantUML dos 18 casos de uso atuais; `CF-UC-005` marcado indisponível. |
| [`specifications/class-diagram.md`](specifications/class-diagram.md) | `EM_REVISAO` | Inventário e diagrama Mermaid do modelo implementado, com separação entre persistência, aplicação e mocks. |
| [`diagrams/plantuml/class-diagram.puml`](diagrams/plantuml/class-diagram.puml) | `EM_REVISAO` | Representação PlantUML semanticamente equivalente ao diagrama de classes Mermaid. |
| [`specifications/logical-data-model.md`](specifications/logical-data-model.md) | `EM_REVISAO` | Modelo lógico descritivo das entidades, atributos, identificadores, domínios e relacionamentos declarados. |
| [`diagrams/plantuml/logical-data-model.puml`](diagrams/plantuml/logical-data-model.puml) | `EM_REVISAO` | Representação PlantUML equivalente ao Mermaid do modelo lógico. |
| [`specifications/relational-data-model.md`](specifications/relational-data-model.md) | `EM_REVISAO` | Modelo relacional descritivo dos models, campos, chaves, restrições, nulabilidade, defaults e relações declarados. |
| [`diagrams/plantuml/relational-data-model.puml`](diagrams/plantuml/relational-data-model.puml) | `EM_REVISAO` | Representação PlantUML equivalente ao Mermaid do modelo relacional. |
| [`specifications/product-flows.md`](specifications/product-flows.md) | `EM_REVISAO` | Especificação textual dos sete fluxos do produto, com Mermaid, rastreabilidade e separação entre comportamento candidato e implementação atual. |
| [`diagrams/plantuml/product-flows.puml`](diagrams/plantuml/product-flows.puml) | `EM_REVISAO` | Sete diagramas de atividade PlantUML semanticamente equivalentes aos fluxos Mermaid. |
| [`implementation/`](implementation/) | `EM_EVOLUCAO` | Plano global mínimo e backlog de entregas para orientar a implementação por funcionalidade. |

O PRD central apresenta visão, problema, usuários, jornada, escopo e critérios de sucesso. O catálogo de requisitos é a referência detalhada de cada requisito candidato, a especificação de casos de uso detalha atores e interações, o diagrama de classes registra o modelo observável e a especificação de fluxos detalha etapas, alternativas sustentadas e relações. As representações diagramáticas dos fluxos e modelos preservam o baseline de cada arquivo; o diagrama PlantUML de casos de uso foi atualizado em 2026-09-28. Esses documentos integram o mesmo pacote, não possuem aprovação normativa e não transformam implementação observada em comportamento ou domínio aprovado.

O pacote Code-First mantém a visão global, a intenção de produto, o backlog e a rastreabilidade. As specs, os planos e as tarefas executáveis de cada funcionalidade ficam em `specs/<feature>/**`; o pacote será atualizado de forma evolutiva conforme cada entrega produzir novas evidências e decisões confirmadas.

## Representações do pacote

Os fluxos e os dois modelos de dados existem em representações complementares:

- [`specifications/product-flows.md`](specifications/product-flows.md), com especificação textual, tabelas e Mermaid;
- [`diagrams/plantuml/product-flows.puml`](diagrams/plantuml/product-flows.puml), com os sete diagramas de atividade equivalentes;
- [`specifications/logical-data-model.md`](specifications/logical-data-model.md) e [`diagrams/plantuml/logical-data-model.puml`](diagrams/plantuml/logical-data-model.puml), com entidades, atributos, identificadores e cardinalidades equivalentes;
- [`specifications/relational-data-model.md`](specifications/relational-data-model.md) e [`diagrams/plantuml/relational-data-model.puml`](diagrams/plantuml/relational-data-model.puml), com relações, campos escalares, chaves e cardinalidades equivalentes.

Convenção do pacote: os documentos Markdown contêm explicação e Mermaid; os arquivos `.puml` contêm a representação equivalente em PlantUML. Mermaid e PlantUML preservam os mesmos elementos e relações, sem exigir layout visual idêntico.

Na terminologia desta iniciativa, o modelo lógico descreve entidades, atributos, identificadores, domínios e relacionamentos; o modelo relacional descreve a mesma estrutura como relações representadas pelos models Prisma, campos e restrições declaradas. Ambos reproduzem o baseline Code-First e não aprovam o domínio nem comprovam banco implantado.

## Artefatos ainda não autorizados

Não estão autorizados nesta execução: outro PRD além do rascunho paralelo `prd-code-first.md`, catálogo normativo de requisitos, pacotes de decisão consolidados, ADRs, especificações normativas, atualização de registros globais, artefatos de UX/Figma ou alterações de código.

## Gates do `prd-code-first.md`

### Gate aplicado para iniciar o rascunho

O início de `prd-code-first.md` em `EM_ELABORACAO` foi autorizado após o atendimento das seguintes condições:

1. revisão humana desta base;
2. autorização explícita para iniciar o documento;
3. hipótese inicial de produto, usuários e escopo;
4. uso explícito das classificações capacidade atual, `DECISAO_DE_TRABALHO_PARA_RASCUNHO`, `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO`, `PROPOSTA` e questão aberta;
5. indicação visível das decisões ainda pendentes.

O rascunho poderá conter hipóteses para confirmação, decisões de trabalho, seções incompletas, dependências científicas, perguntas abertas e marcações de conteúdo que ainda não pode ser aprovado.

### Gate para aprovação final

A aprovação final das partes aplicáveis dependerá de:

1. autoridade competente identificada;
2. confirmação das decisões relevantes;
3. tratamento das lacunas classificadas como `BLOQUEANTE_GLOBAL`;
4. tratamento das lacunas `BLOQUEANTE_SE_NO_ESCOPO` incluídas no escopo;
5. validação científica das partes normativas do IHFR;
6. classificação do Figma somente quando ele for usado como fonte de intenção;
7. rastreabilidade entre código, decisão, hipótese e requisito.

Esses gates são controles de prontidão, não requisitos de produto nem decisões da equipe. Código completo, ausência de defeitos, runtime validado e correção integral de vulnerabilidades não são condições para iniciar o rascunho.

## Ampliação da Fase 1 concluída em revisão

O baseline da ampliação é a branch `docs/code-first-prd`, HEAD `b3c73fb7e3151c7badb23f8dfeac5c689e17983b` e upstream `origin/docs/code-first-prd`, com worktree inicialmente limpo. Os quatro novos artefatos cobrem os 11 models, 10 enums, atributos/campos e 13 relações do schema atual, além da correspondência com `CF-CLS-*`, requisitos, casos de uso e fluxos diretamente relacionados.

Durante a execução, o encerramento ampliado foi mantido como `PENDENTE_VALIDACAO`. Após a aprovação dos gates materiais estáticos, o resultado passou a `FASE_1_AMPLIADA_CONCLUIDA_EM_REVISAO`. A validação anterior e seu baseline continuam preservados no relatório de [`analysis/code-first-package-validation.md`](analysis/code-first-package-validation.md). Nenhuma decisão aberta foi encerrada, o schema não foi promovido a domínio aprovado e a Fase 2 não começou.

## Ponto de parada

A validação cruzada final e sua ampliação estão registradas em [`analysis/code-first-package-validation.md`](analysis/code-first-package-validation.md) com estado `CONCLUIDA`. A revisão de H01–H10 está em [`reviews/product-hypotheses-human-review.md`](reviews/product-hypotheses-human-review.md): o anexo humano não identifica autor, função ou autoridade, e suas conclusões normativas permanecem `REVISAO_HUMANA_PENDENTE_DE_AUTORIDADE`. O PRD, o catálogo de requisitos, os casos de uso, o diagrama de classes, os modelos lógico e relacional, os fluxos e as cinco representações PlantUML permanecem `EM_REVISAO`; o Figma permanece `NAO_AVALIADO`. `CF-PD-001`, `CF-PD-004`, `CF-PD-007` e `CF-PD-008` mantêm os limites já registrados. Permanecem abertas `CF-PD-002`, `CF-PD-003`, `CF-PD-005` e `CF-PD-006`.

A versão Code-First baseada no código anterior permanece `CONCLUIDA_EM_REVISAO`. A Fase 1 original permanece `CONCLUIDA`; a ampliação está `FASE_1_AMPLIADA_CONCLUIDA_EM_REVISAO`. A Fase 2 está `NAO_INICIADA` e só poderá começar após revisão humana e autorização explícita. Nenhuma aprovação normativa foi concedida e a trilha documental original permanece inalterada.

`VERSAO_CODE_FIRST_BASEADA_NO_CODIGO_CONCLUIDA`

`FASE_1_AMPLIADA_CONCLUIDA_EM_REVISAO`

`FASE_2_COMPLEMENTACAO_INCREMENTAL_NAO_INICIADA`

`FASE_2_NAO_INICIADA`
