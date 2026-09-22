# 01 — Estado atual e reconciliação

## Status inicial

EVIDENCIA_IMPLEMENTACAO de 2026-09-21: branch 006-ihfr-diagnosis, HEAD local/remoto 69f505a7ccebf3e074f848fd9695de1213c7ab2d, development 100351e07d9f89f34ebb0ea4de17b526297d6350, merge-base igual a development, ahead/behind 35/0. O único não rastreado inicial é specs/005-environmental-collection-data/coverage-review.md; preservá-lo. Este documento registra o snapshot depois de git fetch origin; a comparação precisa ser repetida no início da implementação.

## Tarefas Speckit abrangidas

Nenhuma tarefa funcional nova. Preflight do estado de T001–T082 e preparação do percurso T083 em diante. A T060 permanece pendente e está atribuída somente à etapa 08.

## Dependências

Ler AGENTS.md, PROJECT_CONTEXT.md, PLANS.md, TECH_DECISIONS.md, constituição, SOURCE_AUTHORITY.md, PENDING_DECISIONS.md, ADR-0001, spec/plan/tasks/data-model/research/quickstart/implementation-evidence/pr-description e os quatro contratos. Confirmar a branch e o estado do checkout antes de qualquer edição. Acesso a banco de teste só com confirmação de destino descartável; não usar dados reais.

## Estado de entrada esperado

Branch de feature sem alteração local funcional concorrente. O arquivo não rastreado da IMP-005 permanece fora do diff. origin/development é ancestral do HEAD; não há merge/rebase pendente. O status de banco atual não foi consultado nesta execução documental e não pode ser inferido dos testes históricos.

## O QUÊ

Reconciliar Git, documentação, código, migration, testes, UI e banco antes de retomar T083; detectar drift e preservar mudanças da feature. Distinguir status Vercel “Deployment was blocked” de resultados de build.

## POR QUÊ

Os arquivos de planejamento eram snapshots de 2026-09-20 e continham caminhos de evidência/página/teste incorretos. O código avançou até T082; rodar tarefas futuras com baseline presumida pode criar migration incompatível, teste falso ou perda de mudanças. Um bloqueio de deployment pode ocorrer sem que a build sequer tenha iniciado.

## Arquivos que provavelmente serão alterados

Nesta etapa de implementação futura: somente [implementation-evidence.md](../implementation-evidence.md) e, se drift documental comprovado, os artefatos específicos da feature. Nesta execução documental foram corrigidos [tasks.md](../tasks.md), [spec.md](../spec.md), [plan.md](../plan.md), [TECH_DECISIONS.md](../../../TECH_DECISIONS.md) e o [README raiz](../../../README.md). Não editar docs/raw/** nem o arquivo não rastreado da IMP-005.

## Procedimento ordenado

1. Executar git status --short --branch, git branch --show-current, git rev-parse HEAD e git rev-parse --abbrev-ref --symbolic-full-name @{upstream}. Registrar saída sanitizada. Não incorporar o não rastreado de outra feature.
2. Executar git fetch origin; depois git rev-parse origin/development, git rev-parse origin/006-ihfr-diagnosis, git merge-base origin/development HEAD, git rev-list --left-right --count origin/development...HEAD e a comparação com upstream. Se o fetch falhar, registrar data e refs locais como não revalidadas; não afirmar estado remoto atual.
3. Executar git diff --name-status origin/development...HEAD e git diff --stat origin/development...HEAD. Comparar com o inventário no fim deste documento. Verificar também commits em development não contidos no HEAD por git log --oneline HEAD..origin/development. O inventário pode mudar até a retomada.
4. Inspecionar schema.prisma, migration 20260920000100_ihfr_experimental_diagnosis, fixtures PostgreSQL, modelos legados, Service, seis routes, quatro handlers de escrita, parser, carregador, avaliador, resumo/ausência e testes. Confirmar por leitura de método e comportamento, não por nome de arquivo ou checkbox. Comparar também o DTO real com PublicDiagnosis no OpenAPI: o tipo atual tem versões planas, labels, displayScore string e dataQuality MODERATE; o contrato exige versions aninhado, scientificLabels, displayScore number, dataQuality MEDIUM e outros campos obrigatórios de origem/decomposição. Essa divergência objetiva deve ser resolvida na etapa 04/07 antes de declarar conformidade, preservando minimização e autorização.
5. Validar no banco de teste autorizado e isolado: conectividade sem imprimir URL, prisma migrate status, ordem de migrations, presença de tabelas/índices/triggers e zero dados de produção. A migration já foi aplicada em schemas isolados segundo a evidência histórica; isso não prova o estado de qualquer banco atual. Não executar migrate deploy em banco compartilhado sem autorização explícita para esse destino.
6. Conferir referências e correções desta execução: evidence/implementation.md foi substituído por implementation-evidence.md em tasks; T057/T098 apontam para a página real sob (private)/dashboard; T121 usa dashboard-routes.test.ts; TD-015/TD-016 estão PARCIALMENTE_IMPLEMENTADO; README raiz usa migrations existentes. A evidência de T061 é semântica automatizada; teclado/foco E2E continuam pendentes. A T063 tem leitura PostgreSQL e teste unitário de controles, com E2E ainda pendente.
7. Para eventual drift de development, listar arquivos sobrepostos e a semântica alterada. Planejar integração normal de origin/development na feature em um momento autorizado e revisável; preservar schema, migration, contratos, testes e páginas da IMP-006 e adições de development. Resolver conflitos por análise de ambas as versões e repetir checks; nunca descartar mudanças, executar reset hard ou integrar a feature em development nesta etapa.
8. Investigar “Deployment was blocked” em trilha separada: obter ID/URL do deployment e commit associado, verificar logs/eventos e configuração/permissões Vercel, estado de checks GitHub e se houve início da build. Registrar causa observada com timestamp e referência. Sem esses dados, classificar motivo como NAO_VERIFICADO. Não usar o rótulo como evidência de falha de build nem como gate de implementação da feature.

## Regras e invariantes

Manifesto v0.1.1/hash ativo e v0.1.0 histórico não podem ser alterados para resolver falha de ambiente. Nenhum legado ambiental ou IHFR é promovido automaticamente. A branch development permanece intocada. Migrations publicadas não são renomeadas ou marcadas como aplicadas por suposição. Não revelar URL/segredo do banco.

## Testes obrigatórios

Nesta etapa: comandos Git acima, verificação estática de paths, contagem de tarefas e git diff --check. No preflight da implementação futura, executar preflight estático em tests/migration/ihfr-diagnosis-preflight.test.ts e, só com banco isolado autorizado, verificar prisma migrate status e fixtures. Não rodar a suíte comportamental completa só para reconciliar documentação.

## Evidências que devem ser registradas

HEAD/base/upstream/merge-base/ahead-behind, status inicial/final, delta de paths, snapshot de stubs e handlers, migration/índices/triggers observados, estado do banco distinguido de evidência histórica, causas de drift e resultado separado da investigação Vercel. O inventário de código observado é: schema e migration aditiva; fixtures isoladas; GET current/detail, DTO minimizado e UI read-only; manifestos/hashes, parser e avaliador puros; RED de escrita e GREEN focal até T082. Pendências observadas: eligibility, createOrReplace, revoke e operation em ihfr-diagnosis.service.ts lançam IHFR_*_NOT_IMPLEMENTED; handlers eligibility/write/operation/revocation retornam 501; UI de gestão e tests/contract ainda não existem.

## Condições de parada

Branch incorreta, alteração concorrente inesperada, refs remotas não verificáveis, migration conflitante, banco não autorizado, schema divergente, conflito normativo ou perda de isolamento. Parar somente a operação afetada e registrar o bloqueio; prosseguir com inspeções independentes.

## Critérios de conclusão

Baseline documentada com fontes atuais, stubs identificados, drift classificado, banco confirmado ou explicitamente não verificado, e plano seguro de reconciliação. Nenhuma tarefa funcional é marcada concluída nesta etapa.

## Estado de saída esperado

Agente pronto para T083 com invariantes e dependências conhecidas; development continua intacta e a evidência pertence ao HEAD efetivamente inspecionado.

## Checkpoint/commit sugerido

Sugestão futura, sem executar aqui: docs(ihfr): reconcile baseline and document execution preflight. Escopo: apenas evidência e correções documentais comprovadas.

## Inventário Git revalidado

Os comandos abaixo foram executados depois do fetch nesta execução. git status --short mostrou somente o arquivo não rastreado da IMP-005 antes das correções documentais. origin/development e merge-base: 100351e07d9f89f34ebb0ea4de17b526297d6350. HEAD/upstream: 69f505a7ccebf3e074f848fd9695de1213c7ab2d. Contagem development...HEAD: 0 atrás, 35 à frente; upstream...HEAD: 0/0. O baseline fornecido pelo solicitante coincide com as refs revalidadas. O delta de arquivos abaixo é entre origin/development e HEAD, sem as correções locais deste runbook:

~~~text
M	.gitignore
M	AGENTS.md
M	README.md
M	TECH_DECISIONS.md
A	docs/governance/ADR-0001-contrato-experimental-ihfr-v0-1.md
M	docs/governance/DOCUMENT_REGISTER.md
M	docs/governance/PENDING_DECISIONS.md
M	docs/governance/SOURCE_AUTHORITY.md
M	docs/governance/TRACEABILITY_MATRIX.md
A	docs/plans/completed/consolidacao-decisoria-imp-006.md
A	prisma/migrations/20260920000100_ihfr_experimental_diagnosis/migration.sql
M	prisma/schema.prisma
A	specs/006-ihfr-diagnosis/checklists/requirements.md
A	specs/006-ihfr-diagnosis/contracts/ihfr-diagnosis-api.openapi.yaml
A	specs/006-ihfr-diagnosis/contracts/ihfr-diagnosis-input-experimental-v0.1.0.schema.json
A	specs/006-ihfr-diagnosis/contracts/ihfr-math-experimental-v0.1.0.json
A	specs/006-ihfr-diagnosis/contracts/ihfr-math-experimental-v0.1.1.json
A	specs/006-ihfr-diagnosis/data-model.md
A	specs/006-ihfr-diagnosis/implementation-evidence.md
A	specs/006-ihfr-diagnosis/plan.md
A	specs/006-ihfr-diagnosis/pr-description.md
A	specs/006-ihfr-diagnosis/quickstart.md
A	specs/006-ihfr-diagnosis/research.md
A	specs/006-ihfr-diagnosis/spec.md
A	specs/006-ihfr-diagnosis/tasks.md
M	src/app/(private)/dashboard/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/page.tsx
A	src/app/api/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/ihfr-diagnosis/current/route.ts
A	src/app/api/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/ihfr-diagnosis/diagnoses/[diagnosisId]/revocations/route.ts
A	src/app/api/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/ihfr-diagnosis/diagnoses/[diagnosisId]/route.ts
A	src/app/api/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/ihfr-diagnosis/diagnoses/route.ts
A	src/app/api/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/ihfr-diagnosis/eligibility/route.ts
A	src/app/api/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/ihfr-diagnosis/operations/[idempotencyKey]/route.ts
A	src/app/api/server/ihfr-diagnosis/evaluator.ts
A	src/app/api/server/ihfr-diagnosis/ihfr-diagnosis-eligibility.handler.ts
A	src/app/api/server/ihfr-diagnosis/ihfr-diagnosis-operation.handler.ts
A	src/app/api/server/ihfr-diagnosis/ihfr-diagnosis-read.handlers.ts
A	src/app/api/server/ihfr-diagnosis/ihfr-diagnosis-revocation.handler.ts
A	src/app/api/server/ihfr-diagnosis/ihfr-diagnosis-write.handler.ts
A	src/app/api/server/ihfr-diagnosis/ihfr-diagnosis.constants.ts
A	src/app/api/server/ihfr-diagnosis/ihfr-diagnosis.contracts.ts
A	src/app/api/server/ihfr-diagnosis/ihfr-diagnosis.http.ts
A	src/app/api/server/ihfr-diagnosis/manifest-loader.ts
A	src/app/api/server/services/ihfr-diagnosis.service.ts
A	src/app/api/server/services/ihfr-diagnosis.store.ts
A	src/components/ihfr-diagnosis/experimental-diagnosis-summary.tsx
A	src/components/ihfr-diagnosis/no-current-diagnosis.tsx
A	src/types/ihfr-diagnosis.type.ts
A	tests/e2e/ihfr-diagnosis-manage.spec.ts
A	tests/e2e/ihfr-diagnosis-read.spec.ts
A	tests/fixtures/ihfr-diagnosis-actors.ts
A	tests/fixtures/ihfr-diagnosis-contexts.ts
A	tests/fixtures/ihfr-diagnosis-domain.ts
A	tests/fixtures/ihfr-diagnosis-fixtures.ts
A	tests/fixtures/ihfr-diagnosis-migration-baseline.ts
A	tests/fixtures/ihfr-diagnosis-technical-vectors.ts
A	tests/fixtures/postgresql-schema-lifecycle.ts
A	tests/integration/ihfr-diagnosis-concurrency.test.ts
A	tests/integration/ihfr-diagnosis-current-route.test.ts
A	tests/integration/ihfr-diagnosis-detail-route.test.ts
A	tests/integration/ihfr-diagnosis-eligibility-route.test.ts
A	tests/integration/ihfr-diagnosis-fixture-lifecycle.test.ts
A	tests/integration/ihfr-diagnosis-idempotency.test.ts
A	tests/integration/ihfr-diagnosis-postgresql-read.test.ts
A	tests/integration/ihfr-diagnosis-read-authorization.test.ts
A	tests/integration/ihfr-diagnosis-revocation.test.ts
A	tests/integration/ihfr-diagnosis-supplement-cardinality.test.ts
A	tests/integration/ihfr-diagnosis-write-route.test.ts
A	tests/migration/ihfr-diagnosis-migration.test.ts
A	tests/migration/ihfr-diagnosis-preflight.test.ts
M	tests/migration/migration-test-harness.ts
A	tests/unit/ihfr-diagnosis-contracts.test.ts
A	tests/unit/ihfr-diagnosis-evaluator.test.ts
A	tests/unit/ihfr-diagnosis-input-policy.test.ts
A	tests/unit/ihfr-diagnosis-lifecycle-projection.test.ts
A	tests/unit/ihfr-diagnosis-manifest-loader.test.ts
A	tests/unit/ihfr-diagnosis-public-dto.test.ts
A	tests/unit/ihfr-diagnosis-read-accessibility.test.tsx
~~~
