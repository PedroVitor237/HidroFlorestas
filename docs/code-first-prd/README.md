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

A execução termina com esta base em `EM_REVISAO`, o PRD paralelo em `EM_ELABORACAO` e o Figma em `NAO_AVALIADO`. `CF-PD-001` e `CF-PD-004` orientam o rascunho como decisões de trabalho; `CF-PD-002`, `CF-PD-003`, `CF-PD-005`, `CF-PD-006`, `CF-PD-007` e `CF-PD-008` permanecem abertas. O próximo passo permitido é revisão humana do rascunho; nenhuma consolidação normativa ou alteração da Etapa 9 original está autorizada.
