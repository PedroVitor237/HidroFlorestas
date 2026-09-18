# Implementation Plan: Dados ambientais da coleta

**Branch**: `005-environmental-collection-data` | **Date**: 2026-09-15 | **Spec**: [spec.md](spec.md)

**Input**: `specs/005-environmental-collection-data/spec.md`

**Status**: Planejamento finalizado; G1–G3 resolvidos para a captura v1 e feature pronta para tarefas.

## Summary

Associar dados ambientais a uma coleta existente, preservando a cadeia laboratório → área → coleta → dados e a imutabilidade dos metadados da IMP-004. O plano separa invariantes, baseline técnico e a captura técnica v1 aprovada. Fórmulas e validação científica do IHFR permanecem fora do recorte.

`RECOMENDACAO`: reutilizar autenticação e autorização contextual integradas, handlers finos, serviço testável e DTOs fechados. Nenhuma tecnologia ou dependência nova é necessária para esta etapa documental. Resultado da pesquisa em [research.md](research.md); contratos de fronteira em [contracts/environmental-data-boundary.md](contracts/environmental-data-boundary.md).

## Technical Context

**Language/Version**: TypeScript `^5`, React `19.2.4`; faixas declaradas no `package.json` do baseline, não versões de runtime verificadas.

**Primary Dependencies**: Next.js `^16.1.6`, Prisma/client `^7.4.2`, adapter Neon `^7.7.0`, Tailwind `^4`, Sonner `^2.0.7`; nenhuma instalação ou atualização nesta entrega.

**Storage**: PostgreSQL declarado em `prisma/schema.prisma`, adapter Neon conectado em `src/app/api/server/lib/prisma.ts`; conjunto ambiental versionado em entidade própria com payload JSON canônico fechado.

**Testing**: `node:test` com `tsx`; Playwright; scripts existentes `test:unit`, `test:integration`, `test:e2e`, `lint`, `typecheck`, `build`. Nenhum executado nesta etapa documental.

**Target Platform**: aplicação web existente, com interface móvel e ampla; não há operação offline neste recorte.

**Project Type**: monólito Next.js com App Router e route handlers.

**Performance Goals**: não há meta numérica autorizada. Validar os resultados observáveis SC-001–SC-006; volume e tamanho de payload dependem do contrato aprovado, sem limites científicos arbitrários.

**Constraints**: autenticação e escopo no servidor; inativo somente leitura; inexistente/inacessível indistinguíveis; pai confirmado imutável; nenhuma exposição automática de legado ou campo interno; gates científicos não contornáveis.

**Scale/Scope**: registro e consulta de no máximo um conjunto integral por coleta contextual. Sem diagnóstico, agregação, mapas ou histórico geral.

## Constitution Check

Gate documental avaliado antes da pesquisa e reavaliado após o design condicionado. Não confundir aprovação do recorte documental com liberação para implementar ciência desconhecida.

| Princípio | Antes da Phase 0 | Após Phase 1 |
|---|---|---|
| I — Hierarquia | Atendido: solicitação atual, contratos herdados e fontes em revisão separados | Atendido: captura v1 aprovada sem promover schema legado nem fórmula científica |
| II — Entrega vertical | Atendido: registrar/consultar dados de uma coleta | Atendido: jornada delimitada e pronta para implementação após reconciliação da branch |
| III — Feature própria | Atendido: branch exata e diretório IMP-005 | Atendido: apenas documentação da feature e seletor local da skill |
| IV — Evidência | Atendido: SHAs da base e IMP-004 fixados | Atendido: inventário de fontes e divergências; nada declarado implementado |
| V — Qualidade/segurança | Atendido: isolamento e legado identificados | Atendido: matriz de validação planejada; checks documentais realizados |
| VI — Evolução documental | Atendido: raw/governança preservados | Atendido: resolução G2/G3 registrada localmente; nenhum histórico reescrito |
| VII — Equipe/branch | Atendido: derivação de origin/development | Atendido: sem merge/rebase/cherry-pick, schema ou infraestrutura paralela |

**Gate de implementação: APROVADO PARA TASKS**. G1 foi fechado pela implementação integrada da IMP-004; G2/G3 foram resolvidos pela decisão de 2026-09-17 e pelos contratos v1. A IMP-005 implementa captura versionada, não cálculo IHFR.

## Project Structure

### Documentation (this feature)

```text
specs/005-environmental-collection-data/
├── spec.md
├── checklists/requirements.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── source-review.md
├── contracts/environmental-data-boundary.md
├── contracts/measurement-contract-v1.md
├── contracts/math-contract-v1.md
└── tasks.md
```

`.specify/feature.json` seleciona esta feature e é ignorado pelo repositório; será mantido localmente sem alterar `.gitignore` nem forçar inclusão.

### Source Code (repository root)

Caminhos reais inspecionados, sem modificações:

```text
prisma/schema.prisma
prisma/migrations/20260915000100_collection_registration_metadata/migration.sql
src/app/api/laboratories/[laboratoryId]/areas/[areaId]/collections/route.ts
src/app/api/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/route.ts
src/app/api/server/auth/auth.core.ts
src/app/api/server/middlewares/auth.middleware.ts
src/app/api/server/areas/area.authorization.ts
src/app/api/server/collections/collection.contracts.ts
src/app/api/server/services/collections.service.ts
src/app/api/server/lib/prisma.ts
src/types/collection.type.ts
tests/unit/collection-*.test.ts
tests/integration/collections-route.test.ts
tests/e2e/collection-registration.spec.ts
tests/fixtures/collections.ts
tests/migration/collection-registration-migration.test.ts
```

**Structure Decision (`DECISAO_CONFIRMADA`)**: manter essas camadas; criar contratos/serviço de dados ambientais ao lado dos existentes, API contextual em `.../collections/[collectionId]/environmental-data`, tipos públicos dedicados e formulário iniciado pelo detalhe da coleta. Persistir metadados e payload canônico fechado em entidade própria, sem modificar a coleta imutável e sem usar as quatro tabelas legadas como contrato normativo.

## Baseline and Divergence

Base original da branch: `f440282a9aefbbb85b5199d0610fdb9ecab3dc87`. Baseline integrado observado em 2026-09-16: IMP-004 `7c977147797ca8a8c167033fee6e7a8ab46f673f`, já ancestral de `origin/development` `37fb3a4fbf7dda04b9bc3b9f2fc1c64ed3b14e13`. A branch IMP-005 permanece tecnicamente baseada no commit original até reconciliação Git autorizada. `test-results/` e `coverage-review.md` preexistentes não pertencem a esta atualização.

| Assunto | Development observado | Contrato documentado da IMP-004 | Consequência IMP-005 |
|---|---|---|---|
| Autenticação/laboratórios | `requireAuth`, conta ACTIVE, serviço persistente de laboratório | Reutiliza autenticação; espera guard da IMP-003 | Reutilizar; não criar autorização temporária |
| Vínculo/papéis | OWNER/ADMIN/MEMBER integrados ao guard contextual | `CREATE_COLLECTION` disponível aos três papéis em laboratório ativo; mutabilidade separada da permissão | Criar capacidade explícita de dados ambientais para os três papéis; não depender semanticamente de `CREATE_COLLECTION` |
| Área | Área subordinada por `{id, laboratoryId}` e leitura contextual | FK/consulta contextual implementadas | Reutilizar a cadeia; não aceitar área ou laboratório do payload como autoridade |
| Coleta | `CollectionData` contém laboratório, área, autor, `occurredAt`, `occurrenceOffset`, `confirmedAt` e `confirmationKey` | FK composta, idempotência por autor e trigger bloqueando UPDATE/DELETE | Consumir como pai imutável; filhos não podem tocar `updatedAt` nem reutilizar `confirmationKey` |
| Interfaces | POST de confirmação e GET de detalhe executáveis | `{ collection }`, `{ error: { code, message } }`, `no-store`, `Location` de API | Criar contrato próprio da IMP-005 e preservar DTO fechado da coleta |
| Ciência | Quatro models legados, FK única por coleta, sem versão do contrato | Relações preservadas, medições excluídas | Preservar legado e implementar `ihfr-measurement-v1` em entidade própria |

A IMP-004 incorporou a IMP-003, concluiu seus gates automatizados e foi integrada a `development`. Esta revisão apenas observa os commits remotos; não faz merge, rebase ou cherry-pick na branch IMP-005.

## Phase 0 — Research Outcome

[research.md](research.md) registra alternativas, razões e conclusões R-001–R-009. Fontes científicas históricas permanecem históricas. A decisão atual fecha o contrato técnico de captura e o ciclo, sem marcar o conteúdo como fórmula cientificamente validada.

## Phase 1 — Conditional Design

1. **Contexto**: autenticar, resolver laboratório pelo vínculo atual, verificar papel/estado/permissão e resolver área/coleta/dados subordinados. Revalidar na gravação e recuperação; nunca usar estado do cliente como autoridade.
2. **Fronteira de ciência**: formulário, parser fechado e serializer seguem `ihfr-measurement-v1`; a persistência JSON não torna o endpoint genérico e qualquer campo extra é recusado.
3. **Persistência**: criar `EnvironmentalMeasurementSet` um-para-um com a coleta, contendo autor, versão, payload canônico, hash, confirmação e chave idempotente própria. Manter o pai confirmado intacto e proteger o conjunto contra UPDATE/DELETE.
4. **Consulta**: projeção mínima contextual, referência de contrato no nível aprovado, distinção entre ausência e valor; leitura de laboratório inativo conforme permissão. Legado não é automaticamente publicado como válido.
5. **Interface**: acesso contextual pelo detalhe da coleta, formulário dos quatro grupos, revisão em memória, confirmação, retry com chave estável e estados carregando/sem dados/erro/somente leitura.
6. **Compatibilidade**: manter GET/POST e DTO existentes da IMP-004. A nova superfície possui contrato próprio e não amplia silenciosamente o DTO da coleta nem reutiliza sua chave idempotente.

## Gates and Resumption

| Gate | Situação | Critério de saída | Autoridade/evidência |
|---|---|---|---|
| G1 | **Fechado** | Satisfeito por `7c97714` e merge `37fb3a4`: schema, guard, rotas, migrations, isolamento, inatividade, idempotência e imutabilidade validados | Evidência de implementação da IMP-004 e ancestralidade em `origin/development` |
| G2 | **Fechado para captura v1** | `measurement-contract-v1.md` fixa grupos, campos, tipos, unidades, nulabilidade, faixas estruturais, versão e casos; `math-contract-v1.md` separa cálculo futuro | Decisão técnica/de dados de 2026-09-17; não equivale a validação científica do IHFR |
| G3 | **Fechado** | OWNER/ADMIN/MEMBER vinculados; conjunto único, integral, imutável, confirmado e idempotente; inativo somente leitura | Decisão explícita de 2026-09-17 |

Tarefas geradas em `tasks.md`. Revisão de prontidão de 2026-09-17 em [implementation-readiness.md](implementation-readiness.md). A reconciliação da branch continua sendo pré-requisito operacional antes da codificação.

## Validation Strategy

Documentação atual: revisão completa do diff, referências locais e em SHA fixo, headings e placeholders, escopo de arquivos, `git diff --check`, ausência de código/schema/migration e inspeção de conteúdo sensível.

Futura execução: [quickstart.md](quickstart.md) descreve testes independentes das duas histórias, matriz de acesso e ambiente seguro. Ciência usa exemplos aprovados; concorrência e proteção do pai usam PostgreSQL real isolado. Automação não substitui avaliação humana SC-006. Cada resultado será registrado separadamente.

## Risks and Mitigations

| Risco | Mitigação |
|---|---|
| Schema virar ciência normativa | Contrato de medição explícito, legado classificado e cálculo separado |
| Permissão de coleta virar permissão de medição | Capacidade explícita de dados ambientais no guard consumidor |
| Escrita de filhos tocar pai imutável | Serviço não atualiza coleta; testes futuros devem provar compatibilidade com a trigger real já integrada |
| Backfill atribuir versão a legado sem prova | Nenhuma reclassificação automática; decisão de dados e preflight futuro |
| Mudança de contrato durante preenchimento | Versão fixada no servidor; impedir reinterpretação silenciosa |
| Resultado desconhecido criar duplicatas | Chave própria e hash canônico, distintos da confirmação IMP-004 |
| Branch base errada ou conteúdo preexistente publicado | Base fixada, stage por caminhos exatos e revisão dos dois commits |

## Complexity Tracking

Nenhuma exceção constitucional proposta. Não há novas camadas, dependências, modelos genéricos ou infraestrutura científica escolhidos. Gates abertos são limites explícitos de implementação, não exceções autorizadas.

## Execution Boundary

`$speckit-specify`, `$speckit-plan`, `$speckit-tasks` e a análise de consistência executados; `.specify/extensions.yml` ausente. Sem implement, código, Prisma, migrations, build/testes funcionais ou PR. Registros globais não alterados: a resolução G2/G3 deverá ser refletida na governança quando esses caminhos forem autorizados, preservando histórico.


## Direção visual da implementação — 2026-09-17

`DECISAO_CONFIRMADA` — origem: solicitação do usuário nesta revisão de prontidão, em 2026-09-17. As telas da IMP-005 devem seguir as imagens de `docs/figma-references/`, a documentação funcional e o padrão visual do sistema. A instrução atual torna o uso visual obrigatório para esta entrega, sem transformar as imagens em regras de negócio.

Referência principal: [indicadores ambientais](../../docs/figma-references/area-monitorada-com-formulario-de-dados-da-agua.jpg). Complementos: [áreas](../../docs/figma-references/areas-monitoradas.jpg), [formulário](../../docs/figma-references/cadastro-de-nova-area.jpg), [início](../../docs/figma-references/inicio-apos-acessar-laboratorio.jpg) e [laboratório](../../docs/figma-references/entrar-ou-criar-laboratorio.jpg).

`RECOMENDACAO` de aplicação: reutilizar o shell existente, superfícies claras, cartões brancos arredondados, títulos hierárquicos, ações primárias verdes e grupos ambientais identificados por texto e cor (água azul, solo ocre, vegetação verde e terreno em tom terroso). Adaptar as composições amplas ao móvel, preservando labels, foco, teclado e contraste; não depender apenas de cor. Comparar registro, revisão e consulta no navegador com as referências e registrar a evidência em T023/T031/T035.

Campos e valores vêm exclusivamente do contrato v1. A imagem mostra salinidade numérica e disponibilidade percentual; o contrato exige enums. A imagem também mostra IHFR, IA, PDF e histórico, todos fora desta entrega. Esses elementos não serão acrescentados à IMP-005. A seção de terreno integra a confirmação única dos quatro grupos, sem criar complementação posterior. O contexto é a coleta existente, sem recriar a confirmação da IMP-004.
