# Implementation Plan: Dados ambientais da coleta

**Branch**: `005-environmental-collection-data` | **Date**: 2026-09-15 | **Spec**: [spec.md](spec.md)

**Input**: `specs/005-environmental-collection-data/spec.md`

**Status**: Planejamento documental condicionado concluído; implementação não liberada. G1–G3 permanecem abertos.

## Summary

Associar dados ambientais a uma coleta existente, preservando a cadeia laboratório → área → coleta → dados e a imutabilidade dos metadados da IMP-004. O plano separa invariantes já definidas, baseline técnico observado e escolhas que dependem de aprovação científica/de produto. O conteúdo científico, o modelo físico e a semântica final de escrita não são completados por suposição.

`RECOMENDACAO`: reutilizar autenticação, autorização contextual quando integrada, handlers finos, serviço testável e DTOs fechados. Nenhuma tecnologia ou dependência nova é necessária para esta etapa documental. Resultado da pesquisa em [research.md](research.md); contratos de fronteira em [contracts/environmental-data-boundary.md](contracts/environmental-data-boundary.md).

## Technical Context

**Language/Version**: TypeScript `^5`, React `19.2.4`; faixas declaradas no `package.json` do baseline, não versões de runtime verificadas.

**Primary Dependencies**: Next.js `^16.1.6`, Prisma/client `^7.4.2`, adapter Neon `^7.7.0`, Tailwind `^4`, Sonner `^2.0.7`; nenhuma instalação ou atualização nesta entrega.

**Storage**: PostgreSQL declarado em `prisma/schema.prisma`, adapter Neon conectado em `src/app/api/server/lib/prisma.ts`; estado de banco/migrations não consultado. Modelo científico definitivo depende de G2/G3.

**Testing**: `node:test` com `tsx`; Playwright; scripts existentes `test:unit`, `test:integration`, `test:e2e`, `lint`, `typecheck`, `build`. Nenhum executado nesta etapa documental.

**Target Platform**: aplicação web existente, com interface móvel e ampla; não há operação offline neste recorte.

**Project Type**: monólito Next.js com App Router e route handlers.

**Performance Goals**: não há meta numérica autorizada. Validar os resultados observáveis SC-001–SC-006; volume e tamanho de payload dependem do contrato aprovado, sem limites científicos arbitrários.

**Constraints**: autenticação e escopo no servidor; inativo somente leitura; inexistente/inacessível indistinguíveis; pai confirmado imutável; nenhuma exposição automática de legado ou campo interno; gates científicos não contornáveis.

**Scale/Scope**: registro e consulta de dados de uma coleta contextual; multiplicidade de observações/grupos ainda em G2. Sem diagnóstico, agregação, mapas ou histórico geral.

## Constitution Check

Gate documental avaliado antes da pesquisa e reavaliado após o design condicionado. Não confundir aprovação do recorte documental com liberação para implementar ciência desconhecida.

| Princípio | Antes da Phase 0 | Após Phase 1 |
|---|---|---|
| I — Hierarquia | Atendido: solicitação atual, contratos herdados e fontes em revisão separados | Atendido: ciência permanece G2; schema não foi promovido |
| II — Entrega vertical | Atendido: registrar/consultar dados de uma coleta | Atendido: jornada delimitada; execução depende G1–G3 |
| III — Feature própria | Atendido: branch exata e diretório IMP-005 | Atendido: apenas documentação da feature e seletor local da skill |
| IV — Evidência | Atendido: SHAs da base e IMP-004 fixados | Atendido: inventário de fontes e divergências; nada declarado implementado |
| V — Qualidade/segurança | Atendido: isolamento e legado identificados | Atendido: matriz de validação planejada; checks documentais realizados |
| VI — Evolução documental | Atendido: raw/governança preservados | Atendido: decisões pendentes registradas localmente; nenhum histórico reescrito |
| VII — Equipe/branch | Atendido: derivação de origin/development | Atendido: sem merge/rebase/cherry-pick, schema ou infraestrutura paralela |

**Gate de implementação: BLOQUEADO**. O usuário autoriza expressamente planejamento com pendências; a regra geral da skill sobre desconhecidos não autoriza resolvê-los por inferência. O design é completo no limite documental permitido, sem contrato científico executável. G2/G3 não são simples detalhes técnicos dispensáveis.

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
└── contracts/environmental-data-boundary.md
```

Não criar `tasks.md` nesta execução. `.specify/feature.json` seleciona esta feature e é ignorado pelo repositório; será mantido localmente sem alterar `.gitignore` nem forçar inclusão.

### Source Code (repository root)

Caminhos reais inspecionados, sem modificações:

```text
prisma/schema.prisma
src/app/api/laboratories/route.ts
src/app/api/server/auth/auth.core.ts
src/app/api/server/middlewares/auth.middleware.ts
src/app/api/server/laboratories/laboratory.contracts.ts
src/app/api/server/services/laboratories.service.ts
src/app/api/server/lib/prisma.ts
tests/unit/
tests/integration/
tests/e2e/
tests/fixtures/
```

**Structure Decision (`RECOMENDACAO`)**: manter essas camadas. Depois dos gates, o serviço de dados ambientais e seus contratos poderão ficar ao lado dos serviços existentes, e a interface partirá do detalhe contextual de coleta da IMP-004. Nomes definitivos de arquivos consumidores e endpoints serão fechados após ciência e ciclo; nenhum esqueleto de código é gerado agora.

## Baseline and Divergence

Base exata: `f440282a9aefbbb85b5199d0610fdb9ecab3dc87` (`origin/development`). Fonte documental: `a44ac7ab3d4ead5adae977e53fd9cb9dfe05368e` (`origin/004-environmental-collection-registration`), mesmo SHA informado na solicitação. Estado inicial: branch `003-area-registration-and-viewing`, sem alterações rastreadas ou não ignoradas. Após a troca, `test-results/` preexistente ficou não ignorado porque a regra só existia na branch anterior; seus arquivos não pertencem a esta entrega.

| Assunto | Development observado | Contrato documentado da IMP-004 | Consequência IMP-005 |
|---|---|---|---|
| Autenticação/laboratórios | `requireAuth`, conta ACTIVE, serviço persistente de laboratório | Reutiliza autenticação; espera guard da IMP-003 | Reutilizar; não criar autorização temporária |
| Vínculo/papéis | `ResearchersLinked` sem papel contextual | OWNER/ADMIN/MEMBER e guard compartilhado da IMP-003 | G1 exige integração/testes reais |
| Área | model legado com Coordinates e associação ao laboratório | Área contextual estabilizada pela IMP-003 | Não importar automaticamente contrato planejado como código existente |
| Coleta | `CollectionData` com área, autor, timestamps técnicos e observações | Novos tempos/offset, laboratório, confirmationKey, FK composta e trigger | G1 exige coleta confirmada disponível e imutável |
| Interfaces | Envelope de laboratório `{ success, ... }`; sem rotas de coleta | `{ collection }` e `{ error: { code, message } }`, no-store | Verificar paridade após integração; preservar DTO IMP-004 fechado |
| Ciência | Quatro models legados, FK única por coleta, sem versão do contrato | Relações preservadas, medições excluídas | G2 bloqueia payload, validação, cardinalidade normativa e migração |

A IMP-004 depende do gate T111 da IMP-003 por sua T005; não declarou implementação executada. Nenhum comando nesta tarefa integrou essas branches.

## Phase 0 — Research Outcome

[research.md](research.md) registra alternativas, razões e conclusões R-001–R-008. Fontes científicas históricas pertinentes foram consultadas por rastreabilidade e mantidas como históricas. Não há aprovação suficiente para fechar conteúdo científico. O resultado responsável é explicitar G2/G3, não marcar a pesquisa como validação científica.

## Phase 1 — Conditional Design

1. **Contexto**: autenticar, resolver laboratório pelo vínculo atual, verificar papel/estado/permissão e resolver área/coleta/dados subordinados. Revalidar na gravação e recuperação; nunca usar estado do cliente como autoridade.
2. **Fronteira de ciência**: somente campos e regras de G2 podem integrar formulário, serialização e validação. Ausência do contrato bloqueia a capacidade; não criar endpoint genérico que aceite qualquer JSON.
3. **Persistência**: manter pai confirmado intacto. Após G2/G3, planejar dependentes e integridade referencial sem UPDATE do pai e sem reutilizar sua chave de confirmação. Revalidar a mesma cadeia de origem no limite da gravação.
4. **Consulta**: projeção mínima contextual, referência de contrato no nível aprovado, distinção entre ausência e valor; leitura de laboratório inativo conforme permissão. Legado não é automaticamente publicado como válido.
5. **Interface**: acesso contextual pelo detalhe da coleta, estados carregando/sem dados/erro/somente leitura e mensagens acessíveis. Revisão/confirmar/retry são recomendações sujeitas ao ciclo G3, não cópia obrigatória da IMP-004.
6. **Compatibilidade**: manter GET/POST e DTO existentes da IMP-004. Qualquer nova superfície de dados deve ter contrato próprio após G2/G3; nenhuma extensão silenciosa de schema fechado ou de permissão.

## Gates and Resumption

| Gate | Situação | Critério de saída | Autoridade/evidência |
|---|---|---|---|
| G1 | Aberto | IMP-003/004 integradas, schema/guard/rotas/migrations reconciliados e testes de isolamento, inatividade e imutabilidade aprovados | Equipe de implementação; commits e resultados executados, não só documentação |
| G2 | Aberto | Contrato aplicável validado, versionamento no nível autorizado, mapeamento e exemplos científicos completos | Responsáveis científicos/dados a designar; origem e aprovação registradas |
| G3 | Aberto | Matriz de permissão e ciclo definidos, unidade de escrita/repetição/concorrência, autoria própria e eventual complementação decididos | Produto/dados a designar; decisão explícita registrada |

Depois da liberação: revisar coordenadamente spec, checklist, pesquisa, modelo, contrato e quickstart; somente então fechar payload e estratégia física e solicitar/seguir a etapa de tarefas em execução futura autorizada. Nenhuma skill posterior é disparada por este plano.

## Validation Strategy

Documentação atual: revisão completa do diff, referências locais e em SHA fixo, headings e placeholders, escopo de arquivos, `git diff --check`, ausência de código/schema/migration/tasks e inspeção de conteúdo sensível.

Futura execução: [quickstart.md](quickstart.md) descreve testes independentes das duas histórias, matriz de acesso e ambiente seguro. Ciência usa exemplos aprovados; concorrência e proteção do pai usam PostgreSQL real isolado. Automação não substitui avaliação humana SC-006. Cada resultado será registrado separadamente.

## Risks and Mitigations

| Risco | Mitigação |
|---|---|
| Schema virar ciência normativa | G2, inventário classificado e ausência de payload fictício |
| Permissão de coleta virar permissão de medição | G3 e matriz explícita antes do guard consumidor |
| Escrita de filhos tocar pai imutável | Serviço não atualiza coleta; ensaio com trigger real após G1 |
| Backfill atribuir versão a legado sem prova | Nenhuma reclassificação automática; decisão de dados e preflight futuro |
| Mudança de contrato durante preenchimento | Regra de vigência aprovada em G2; impedir reinterpretação silenciosa |
| Resultado desconhecido criar duplicatas | Definir identidade da operação em G3, distinta da confirmação IMP-004 |
| Branch base errada ou conteúdo preexistente publicado | Base fixada, stage por caminhos exatos e revisão dos dois commits |

## Complexity Tracking

Nenhuma exceção constitucional proposta. Não há novas camadas, dependências, modelos genéricos ou infraestrutura científica escolhidos. Gates abertos são limites explícitos de implementação, não exceções autorizadas.

## Execution Boundary

Somente `$speckit-specify` e `$speckit-plan`. `setup-plan.sh --json` executado; `.specify/extensions.yml` ausente antes/depois das etapas. Sem tasks, analyze, coverage, implement, código, Prisma, migrations, build/testes funcionais ou PR. Registros globais não alterados: após decisões G2/G3, será necessário registrar sua resolução em governança sob autorização dos caminhos correspondentes, preservando histórico.
