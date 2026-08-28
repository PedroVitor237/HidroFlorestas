# PRD Code-First

- **Nome da iniciativa:** `PRD Code-First`
- **Natureza:** iniciativa paralela, analítica e não canônica
- **Estado da iniciativa:** `EM_ELABORACAO`
- **Estado dos documentos desta base:** `EM_REVISAO`
- **Estado do PRD:** `EM_ELABORACAO`
- **Estado do Figma:** `NAO_AVALIADO`

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
| [`prd-code-first.md`](prd-code-first.md) | `EM_ELABORACAO` | Rascunho paralelo, não canônico e derivado do código, com requisitos candidatos e dependências abertas. |
| [`specifications/requirements.md`](specifications/requirements.md) | `EM_ELABORACAO` | Catálogo detalhado dos 15 requisitos funcionais e 6 não funcionais candidatos do pacote documental do PRD. |
| [`specifications/use-cases.md`](specifications/use-cases.md) | `EM_ELABORACAO` | Especificação dos atores, 15 casos de uso candidatos, relações, cobertura e visão Mermaid. |
| [`diagrams/plantuml/use-cases.puml`](diagrams/plantuml/use-cases.puml) | `EM_ELABORACAO` | Representação PlantUML semanticamente equivalente à visão Mermaid dos casos de uso. |
| [`specifications/class-diagram.md`](specifications/class-diagram.md) | `EM_ELABORACAO` | Inventário e diagrama Mermaid do modelo implementado, com separação entre persistência, aplicação e mocks. |
| [`diagrams/plantuml/class-diagram.puml`](diagrams/plantuml/class-diagram.puml) | `EM_ELABORACAO` | Representação PlantUML semanticamente equivalente ao diagrama de classes Mermaid. |
| [`specifications/product-flows.md`](specifications/product-flows.md) | `EM_ELABORACAO` | Especificação textual dos sete fluxos do produto, com Mermaid, rastreabilidade e separação entre comportamento candidato e implementação atual. |
| [`diagrams/plantuml/product-flows.puml`](diagrams/plantuml/product-flows.puml) | `EM_ELABORACAO` | Sete diagramas de atividade PlantUML semanticamente equivalentes aos fluxos Mermaid. |

O PRD central apresenta visão, problema, usuários, jornada, escopo e critérios de sucesso. O catálogo de requisitos é a referência detalhada de cada requisito candidato, a especificação de casos de uso detalha atores e interações, o diagrama de classes registra o modelo observável e a especificação de fluxos detalha etapas, alternativas sustentadas e relações. As visões Mermaid possuem PlantUML equivalente. Esses documentos integram o mesmo pacote, não possuem aprovação normativa e não transformam implementação observada em comportamento ou domínio aprovado.

## Representações do pacote

Os fluxos do produto agora existem nas duas representações complementares:

- [`specifications/product-flows.md`](specifications/product-flows.md), com especificação textual, tabelas e Mermaid;
- [`diagrams/plantuml/product-flows.puml`](diagrams/plantuml/product-flows.puml), com os sete diagramas de atividade equivalentes.

Convenção do pacote: os documentos Markdown contêm explicação e Mermaid; os arquivos `.puml` contêm a representação equivalente em PlantUML. Mermaid e PlantUML preservam os mesmos elementos e relações, sem exigir layout visual idêntico.

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

## Ponto de parada

A execução termina com esta base em `EM_REVISAO` e o PRD, o catálogo de requisitos, os casos de uso, o diagrama de classes e os fluxos em `EM_ELABORACAO`; o Figma permanece `NAO_AVALIADO`. `CF-PD-001` e `CF-PD-004` orientam o rascunho como decisões de trabalho; `CF-PD-007` registra a direção funcional confirmada do mapa no núcleo do MVP; `CF-PD-008` mantém Figma como fonte complementar e não bloqueante. Permanecem abertas `CF-PD-002`, `CF-PD-003`, `CF-PD-005` e `CF-PD-006`. A Fase 1 não está concluída: ainda falta a validação cruzada final do PRD, requisitos, casos de uso, diagrama de classes e fluxos, sem consolidação normativa ou alteração da Etapa 9 original.
