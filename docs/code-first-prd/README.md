# PRD Code-First

- **Nome da iniciativa:** `PRD Code-First`
- **Natureza:** iniciativa paralela, analítica e não canônica
- **Estado da iniciativa:** `EM_ELABORACAO`
- **Estado dos documentos desta base:** `EM_REVISAO`
- **Estado do PRD:** `NAO_INICIADO`
- **Estado do Figma:** `NAO_AVALIADO`

## Objetivo e limites

Esta iniciativa cria uma base verificável para compreender o produto atualmente observável no repositório, separar implementação de intenção e preparar perguntas para decisão humana. Ela não redige requisitos, não aprova escolhas e não presume que o código represente o produto desejado.

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

### Excluídas como conteúdo

- `docs/raw/**`, inclusive leitura, enumeração, pesquisa ou uso indireto de seu conteúdo;
- `docs/governance/TRACEABILITY_MATRIX.md`;
- relatórios e planos das auditorias documentais anteriores;
- conclusões fundamentadas apenas na documentação histórica;
- texto comercial da landing como prova de capacidade;
- fontes externas e Figma nesta execução.

## Código, decisões e Figma

Os três elementos têm funções distintas:

- o código, schema e configurações evidenciam apenas o estado implementado que a inspeção consegue conectar;
- decisões da equipe expressam intenção somente conforme sua origem, autoridade e estado registrados, independentemente da implementação;
- Figma pode expressar intenção de UX apenas quando o artefato e seu estado de aprovação forem identificados; nenhum artefato concreto foi avaliado nesta iniciativa.

Assim, estado implementado e estado pretendido permanecem em eixos independentes. Uma implementação sem decisão não se torna automaticamente comportamento desejado; uma decisão sem implementação não se torna funcionalidade atual.

## Documentos existentes

| Documento | Estado | Finalidade |
|---|---|---|
| [`governance/source-policy.md`](governance/source-policy.md) | `EM_REVISAO` | Hierarquia, classificações e limites das fontes. |
| [`inventories/repository-inventory.md`](inventories/repository-inventory.md) | `EM_REVISAO` | Inventário técnico reproduzível no commit-base. |
| [`analysis/current-product-state.md`](analysis/current-product-state.md) | `EM_REVISAO` | Capacidades, fluxos e riscos observados estaticamente. |
| [`analysis/decision-snapshot.md`](analysis/decision-snapshot.md) | `EM_REVISAO` | Snapshot não normativo de `TD-001` a `TD-014`. |
| [`analysis/gaps-and-open-questions.md`](analysis/gaps-and-open-questions.md) | `EM_REVISAO` | Lacunas e perguntas sem respostas ou decisões. |

## Artefatos ainda não autorizados

Não estão autorizados nesta execução: `prd-code-first.md`, PRD de qualquer natureza, catálogo de requisitos, pacotes de decisão consolidados, ADRs, especificações normativas, atualização de registros globais, artefatos de UX/Figma ou alterações de código.

## Condições para um futuro `prd-code-first.md`

Sua criação dependerá cumulativamente de:

1. revisão humana desta base;
2. autorização explícita para iniciar o documento;
3. designação das autoridades de produto, ciência/IHFR, dados, UX, arquitetura e segurança afetadas;
4. confirmação ou rejeição explícita das decisões necessárias, com origem registrada;
5. tratamento das lacunas classificadas como bloqueantes;
6. classificação do Figma aplicável ou decisão explícita sobre sua ausência;
7. separação rastreável entre capacidade atual, risco, proposta e comportamento pretendido.

Essas condições são controles de prontidão, não requisitos de produto nem decisões da equipe.

## Ponto de parada

A execução termina com esta base em `EM_REVISAO`, o PRD em `NAO_INICIADO`, o Figma em `NAO_AVALIADO` e todas as decisões abertas preservadas. O próximo passo permitido é revisão humana; nenhuma consolidação normativa está autorizada.
