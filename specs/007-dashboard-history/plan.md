# Implementation Plan: Dashboard e histórico básico

**Branch**: `007-dashboard-history` | **Date**: 2026-09-17 | **Spec**: [spec.md](spec.md)

**Input**: `specs/007-dashboard-history/spec.md`

**Status**: planejamento concluído para o incremento mínimo; extensões IMP-005/006 permanecem condicionadas à integração e à reconciliação de seus contratos reais.

## Summary

Substituir o encaminhamento e o histórico fixo atuais por um dashboard contextual do laboratório explicitamente selecionado. O servidor autoriza cada leitura e projeta, sem persistência paralela, (a) identidade/estado e contagens de áreas e coletas confirmadas e (b) uma união paginada de `área criada` e `coleta confirmada`, sempre ligada aos detalhes reais de origem.

`RECOMENDACAO`: manter o monólito e os padrões integrados das IMP-003/004: guard contextual único, handlers finos, serviço testável, DTOs fechados e `Cache-Control: no-store`. O desenho completo está fundamentado em [research.md](research.md), [data-model.md](data-model.md) e [contracts/dashboard-api.openapi.yaml](contracts/dashboard-api.openapi.yaml).

## Technical Context

**Language/Version**: TypeScript `^5`, React `19.2.4`; faixas declaradas no `package.json`, sem runtime executado nesta etapa.

**Primary Dependencies**: Next.js `^16.1.6` com App Router, Prisma/client `^7.4.2`, adapter Neon `^7.7.0`, Tailwind CSS `^4`, Lucide React `^1.16.0`; nenhuma dependência nova.

**Storage**: PostgreSQL declarado no schema Prisma. A feature somente lê `LaboratoryRoom`, `ResearchersLinked`, `CollectionArea` e `CollectionData`; não cria model, tabela, cópia, migration ou retenção de atividade.

**Testing**: `node:test` com `tsx`, testes de contrato OpenAPI, integração de route handlers e Playwright; regressão das suítes de áreas e coletas.

**Target Platform**: aplicação web responsiva existente, a partir de 320 px, com execução no servidor Next.js e navegador moderno; operação offline não faz parte do recorte.

**Project Type**: monólito web full-stack Next.js com App Router e route handlers.

**Performance Goals**: cada parte do histórico retorna no máximo 20 itens; cada consulta de fonte busca no máximo 21 candidatos para decidir continuidade. Não há latência, volume ou concorrência numéricos aprovados.

**Constraints**: laboratório explícito; autorização e elegibilidade revalidadas no servidor; laboratório inativo somente leitura; recurso ausente/inacessível indistinguível; datas de evento limitadas a `CollectionArea.createdAt` e `CollectionData.confirmedAt`; ausência de cache compartilhado; nenhuma auditoria inferida; privacidade por allowlist.

**Scale/Scope**: uma página contextual, dois endpoints de leitura, dois tipos de item e paginação por cursor. Busca, filtros, mapa, gráficos, IA, dados ambientais e diagnóstico ficam fora do incremento mínimo.

## Constitution Check

Gate avaliado antes da pesquisa e reavaliado após o design.

| Princípio | Antes da Phase 0 | Após Phase 1 |
|---|---|---|
| I — Hierarquia de fontes | PASS — solicitação e spec governam o recorte; código integrado comprova somente contratos atuais. | PASS — models integrados sustentam o mínimo; IMP-005/006 aparecem apenas como planejamento futuro identificado por SHA. |
| II — Entregas verticais | PASS — resumo e histórico de áreas/coletas são um resultado pequeno e verificável. | PASS — nenhuma dependência futura ou aprovação científica foi transformada em pré-requisito. |
| III — Especificação por funcionalidade | PASS — branch e diretório próprios confirmados pelo setup oficial. | PASS — plano, pesquisa, modelo, contrato e quickstart permanecem em `specs/007-dashboard-history/**`; `tasks.md` não foi criado. |
| IV — Evidência e rastreabilidade | PASS — baseline integrada, mocks atuais e branches futuras estão separados. | PASS — cada dado, instante, critério de inclusão e extensão futura aponta à fonte e à classificação aplicável. |
| V — Qualidade e segurança proporcionais | PASS — isolamento, perda de acesso, privacidade, paginação e estados de UI são os riscos centrais. | PASS — guard único, queries contextuais, DTOs mínimos, `no-store` e matriz de testes cobrem esses riscos. |
| VI — Documentação evolutiva | PASS — nenhum artefato histórico ou governança global será alterado. | PASS — não há promoção do schema legado ou da ciência; reconciliações futuras estão explícitas. |
| VII — Trabalho em equipe | PASS — branch correta, limpa e sincronizada; sem merge/rebase/reset/stash. | PASS — mudança futura fica concentrada na feature, sem schema, dependência ou infraestrutura compartilhada nova. |

**Gate constitucional: APROVADO.** Não há violação a justificar nem `NEEDS CLARIFICATION` remanescente.

## Project Structure

### Documentation (this feature)

```text
specs/007-dashboard-history/
├── spec.md
├── checklists/requirements.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── dashboard-api.openapi.yaml
└── tasks.md                         # somente por $speckit-tasks
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── (private)/dashboard/
│   │   ├── page.tsx                                  # mantém redirecionamento para seleção
│   │   ├── activity-history.tsx                      # mock removido/substituído
│   │   └── laboratories/[laboratoryId]/
│   │       ├── layout.tsx                            # navegação contextual inclui Resumo
│   │       ├── page.tsx                              # novo dashboard contextual
│   │       ├── loading.tsx
│   │       └── error.tsx
│   └── api/
│       ├── laboratories/[laboratoryId]/dashboard/
│       │   ├── summary/route.ts
│       │   └── history/route.ts
│       └── server/
│           ├── areas/area.authorization.ts           # guard integrado reutilizado
│           ├── dashboard/dashboard.contracts.ts
│           └── services/dashboard.service.ts
├── components/
│   ├── dashboard/dashboard-summary.tsx
│   ├── dashboard/dashboard-history.tsx
│   └── workspace/laboratory-workspace.tsx            # seleção aponta ao resumo
└── types/dashboard.type.ts

tests/
├── unit/
│   ├── dashboard-contracts.test.ts
│   ├── dashboard-service.test.ts
│   └── dashboard-openapi-contract.test.ts
├── integration/dashboard-routes.test.ts
└── e2e/dashboard-history.spec.ts
```

**Structure Decision**: manter as camadas integradas. A nova landing contextual é `/dashboard/laboratories/{laboratoryId}`; as páginas de área e coleta continuam como destinos canônicos. Resumo e histórico usam endpoints independentes para suportar carregamento, erro e retry por região. Não haverá repository genérico, store global, rota sem laboratório nem fonte persistida de atividade.

## Baseline and Dependency Evidence

- Branch local/upstream no início: `007-dashboard-history` em `df87b2efa7ad37a4ac69316e042384d7dfc0e4fb`, divergência `0/0`, árvore limpa.
- Baseline de criação e `origin/development`: `37fb3a4fbf7dda04b9bc3b9f2fc1c64ed3b14e13`, divergência `0/0`; portanto não houve avanço a reconciliar.
- IMP-003 integrada: `106e25f984df56384896729bf786e44104166570`.
- IMP-004 integrada: `7c977147797ca8a8c167033fee6e7a8ab46f673f`.
- IMP-005 publicada, não integrada: `1235387ded9854be20a92f8639a502a80a2bd952`; contém somente planejamento e contratos da feature, sem código integrado.
- IMP-006 publicada, não integrada: `f5f6e27de2a81d64fa6e829d44d68669ba447739`; contém spec/checklist, sem contrato técnico implementável.
- Apontador local do Spec Kit: `.specify/feature.json` → `specs/007-dashboard-history`; checklist da spec: 16/16 itens aprovados.

`EVIDENCIA_IMPLEMENTACAO`: o guard atual exige conta `ACTIVE`, vínculo corrente e UUID contextual; permite leitura em laboratório inativo e devolve `NOT_FOUND` para ID inválido ou ausência de vínculo. Área possui `createdAt` e detalhe contextual. Coleta integrada possui `confirmedAt` e detalhe filtrado simultaneamente por laboratório, área e coleta, mas somente linhas com a tupla de confirmação completa são detalháveis.

## Design and Delivery Strategy

### 1. Fonte de verdade e elegibilidade

O resumo é calculado no momento da leitura. `areaCount` conta as mesmas `CollectionArea` pertencentes ao laboratório que a listagem integrada expõe; `CollectionArea.isActive` não é usado como filtro porque o contrato integrado de leitura não lhe atribui esse significado. `confirmedCollectionCount` conta somente `CollectionData` do laboratório com `occurredAt`, `occurrenceOffset`, `confirmedAt` e `confirmationKey` não nulos, a mesma condição necessária para o detalhe integrado.

O histórico é uma união em memória de duas projeções limitadas:

| Tipo | Registro de origem | Instante do evento | Contexto e destino |
|---|---|---|---|
| `AREA_CREATED` | `CollectionArea` do laboratório | `createdAt` | nome e ID da área; `/dashboard/laboratories/{lab}/areas/{area}` |
| `COLLECTION_CONFIRMED` | `CollectionData` confirmada do laboratório | `confirmedAt` | ID da coleta e área `{id,name}`; `/dashboard/laboratories/{lab}/areas/{area}/collections/{collection}` |

`occurredAt` da coleta pode ser exibido como informação secundária, nunca como instante da confirmação. `updatedAt`, `isActive`, autoria e ausência de linha não geram eventos. Exclusão/correção na fonte apenas altera a elegibilidade da projeção; não há snapshot órfão ou reconstrução forense.

### 2. Ordenação e paginação

A ordem total é `eventAt DESC`, depois tipo (`AREA_CREATED` antes de `COLLECTION_CONFIRMED`) e `sourceId DESC`. A identidade pública estável é `${type}:${sourceId}`. O cursor opaco codifica e valida exatamente a última chave `(eventAt,type,sourceId)`; não concede acesso e nunca substitui a autorização.

Cada fonte consulta no máximo 21 candidatos posteriores ao cursor usando seu próprio instante e ID. O serviço combina, aplica a ordem total e devolve 20; o 21º determina `nextCursor`. Esse algoritmo evita leitura sem limite, duplicação e omissão entre tipos. O cliente mantém o cursor atual e a pilha de cursores anteriores na URL/estado da página, oferecendo “Mais antigos” e “Mais recentes”; refresh volta à primeira parte e relê as fontes. Inserções posteriores não entram retroativamente em uma travessia já iniciada; o contrato garante estabilidade quando as fontes não mudam, como exige SC-003.

### 3. Autorização, isolamento e perda de acesso

Cada método do serviço abre uma transação de leitura, chama `authorizeLaboratoryAccess(principal, laboratoryId, "READ_AREAS", tx)` e só então consulta por `laboratoryRoomId`. Não há confiança em contexto, papel, contagem, destino ou cursor vindo do cliente. IDs subordinados retornados são obtidos da query já filtrada.

Conta inelegível/sem sessão resulta em `401`; laboratório inválido, inexistente, cruzado ou sem vínculo resulta no mesmo `404`. Erros internos são sanitizados como `500`. Laboratório inativo retorna `200`, `status: INACTIVE` e `readOnly: true`; a UI mantém links de leitura e omite criação/alteração. Ações de laboratório ativo são derivadas somente de `membershipRole` e das regras integradas.

Se acesso for perdido, qualquer nova leitura limpa o payload anterior antes de apresentar o estado indisponível; navegar aos detalhes reexecuta os guards existentes. A troca de `laboratoryId` aborta requests anteriores e reinicializa dados/cursor, impedindo resposta tardia de aparecer no novo contexto.

### 4. Contratos, privacidade e cache

Os endpoints são `GET /api/laboratories/{laboratoryId}/dashboard/summary` e `GET /api/laboratories/{laboratoryId}/dashboard/history?cursor=...`. Os DTOs do OpenAPI são allowlists e expõem apenas contexto do laboratório, totais, tipo, datas necessárias, nomes/IDs de área, ID da coleta e destinos contextuais. Não expõem usuário, email, avatar, `userId`, observações, coordenadas, `confirmationKey`, payload científico ou evidência restrita.

Toda resposta, inclusive erro, usa `Cache-Control: no-store`; fetches usam `cache: "no-store"`. Não há cache de servidor, revalidação temporal, local storage ou reutilização de dados entre laboratórios. Retorno ao dashboard, refresh explícito e navegação produzem nova leitura.

### 5. Interface e substituição de mocks

O acesso no workspace passa a apontar para `/dashboard/laboratories/{id}`. O layout contextual adiciona “Resumo” ao lado de “Áreas” e “Membros” quando aplicável. A página apresenta nome/estado, dois totais com links reais e histórico paginado. `activity-history.tsx`, seus usuários, emails, tipos inventados, datas fixas, busca/filtros de mock e destino genérico deixam de participar da interface; busca e filtros não serão reimplementados neste incremento.

Resumo e histórico são regiões independentes com loading (`role=status`), vazio real, erro (`role=alert`) e retry. Zero só aparece após resposta bem-sucedida. O estado inativo é textual; ações indisponíveis são omitidas. Controles têm nome acessível, foco visível e alvo adequado; datas usam `<time dateTime>` e rótulos distinguem criação, confirmação e ocorrência. Layout usa fluxo vertical em 320 px e amplia para grid sem rolagem horizontal.

### 6. Estratégia de testes

| Camada | Cobertura planejada |
|---|---|
| Unidade — contratos | Cursor válido/inválido, allowlists, serialização ISO, identidade/destino, ausência dos campos proibidos e mensagens sanitizadas. |
| Unidade — serviço | Contagens, critério de confirmação completa, duas fontes, ordem/empate/cursor, limite 20, remoção da fonte, inativo, revogação e isolamento. |
| Contrato | OpenAPI 3.1 válido, dois `operationId`, schemas fechados, status, exemplos, cursor e `no-store`. |
| Integração | `requireAuth`, params/cursor, revalidação por chamada, `200/400/401/404/500`, laboratório cruzado, perda de vínculo e falha independente. |
| UI | loading diferente de zero/vazio, retry, descarte de resposta tardia, pilha de cursores, links e omissão de ações em inativo. |
| E2E | quatro histórias, matriz de dois laboratórios, mais de 20 itens/empates, refresh após criação/confirmação, destinos em uma ativação, teclado e 320/768/1280 px. |
| Regressão | `test:unit`, `test:integration`, cenários E2E de área e coleta, `lint`, `typecheck` e `build` na futura implementação. |

SC-009 requer teste moderado com participantes representativos e permanece validação humana futura; automação não inventa seu resultado nem bloqueia a geração de tarefas. Nenhum teste funcional, build, Prisma ou banco é executado nesta etapa documental.

## Requirements Traceability

| Requisitos | Decisão de design | Validação principal |
|---|---|---|
| FR-001, FR-002, FR-012 | guard e queries contextuais em cada endpoint; `401/404` sem inferência | integração e E2E com dois laboratórios/revogação |
| FR-003, FR-010 | resumo transitório, tupla confirmada e `no-store` | unidade, integração e retorno/refresh E2E |
| FR-004, FR-005, FR-006, FR-008, FR-014 | duas projeções, datas reais, identidade derivada e destinos completos | unidade de serializer/ordem e E2E de origem |
| FR-007 | cursor keyset, 20 itens e desempate total | unidade e travessia E2E com empate e mais de 20 itens |
| FR-009 | endpoints/componentes independentes e estados explícitos | UI e E2E de loading/vazio/falha/retry |
| FR-011 | contexto `readOnly`, leitura preservada e mutações omitidas | integração e E2E de laboratório inativo |
| FR-013 | DTOs fechados sem PII, observações, coordenadas ou ciência | contrato, serializer e inspeção E2E |
| FR-015, FR-016 | somente pontos de reconciliação futura; zero tipo atual | contrato aceita apenas dois tipos e revisão documental |
| FR-017, FR-018 | fluxo responsivo, semântica, teclado, foco e mensagens textuais | E2E 320/768/1280 e tecnologia assistiva |
| FR-019 | serviço estritamente de leitura, sem ciência/mapa/gráficos/IA | diff, contrato e regressão |

SC-001–SC-008 são cobertos pelos cenários automatizáveis detalhados em [quickstart.md](quickstart.md). SC-009 exige avaliação humana registrada.

## Implementation Phases

1. Criar tipos/contratos do dashboard e testes RED de cursor, DTO e união determinística.
2. Implementar o serviço de leitura sobre o guard e os models existentes, sem schema ou persistência nova.
3. Implementar os dois route handlers com factories injetáveis, erros sanitizados e `no-store`.
4. Criar a landing contextual e regiões independentes de resumo/histórico; remover o mock do fluxo e atualizar navegação.
5. Completar contrato, integração, E2E, acessibilidade, responsividade e regressões IMP-003/004.
6. Registrar evidências da implementação e reler IMP-005/006 somente se alguma delas tiver sido integrada antes da execução.

## Future Reconciliation Points

### IMP-005 — dados ambientais

O SHA publicado `1235387...` planeja `EnvironmentalMeasurementSet` único, confirmado e imutável, ligado à coleta, com `confirmedAt` e versão de contrato. Após integração real, reler schema, DTO, rota, índices e semântica temporal; então uma extensão separada poderá projetar “dados ambientais confirmados” pelo `confirmedAt` e linkar ao detalhe contextual. Não expor autor, chave idempotente, hash nem payload no feed. O contrato publicado não prova disponibilidade atual.

### IMP-006 — diagnóstico

O SHA publicado `f5f6e27...` ainda não possui plano/contrato técnico e mantém gates de integração, ciência, produção e ciclo. Após implementação e integração, reconciliar estado vigente/aceite, data realmente persistida, procedência e destino antes de definir qualquer item ou total. Substituição/revogação não pode virar evento de auditoria sem registro persistido correspondente. Aprovação científica do IHFR não é pré-requisito do incremento mínimo atual.

## Risks and Mitigations

| Risco | Mitigação planejada |
|---|---|
| Mock continuar acessível ou parecer real | Remover o componente do fluxo, seus dados fixos e destinos genéricos; E2E verifica ausência. |
| Contar linha legada como coleta confirmada | Aplicar a tupla completa usada pelo detalhe integrado, não apenas existência ou `createdAt`. |
| Paginação omitir/duplicar em empate | Ordem total, cursor validado e 21 candidatos por fonte; testes com timestamps iguais e travessia completa. |
| Vazamento entre laboratórios ou após revogação | Guard dentro de cada leitura, filtro obrigatório por laboratório, DTO allowlist e limpeza imediata do estado cliente. |
| Requisição tardia contaminar novo contexto | `AbortController`, key por laboratório e reset atômico de payload/cursor. |
| Contagem e histórico divergirem durante concorrência | Cada endpoint é consistente em sua própria transação; regiões podem atualizar separadamente e refresh relê ambas. Não prometer snapshot cruzado. |
| Consulta de coleta degradar em volume futuro | Limite rígido evita payload amplo; observar plano de consulta durante implementação e propor índice em entrega própria se evidência justificar, sem migration especulativa agora. |
| Datas sugerirem auditoria inexistente | Rótulos e contrato nomeiam `createdAt` e `confirmedAt`; nenhuma atualização/exclusão/autor é inferida. |
| Contratos futuros contaminarem o mínimo | Adaptadores futuros só entram após integração e reconciliação explícita; testes atuais aceitam apenas dois tipos. |

## Complexity Tracking

Não aplicável. O design reutiliza autenticação, autorização, persistência e rotas contextuais existentes; não adiciona dependência, schema, fonte de verdade ou exceção constitucional.
