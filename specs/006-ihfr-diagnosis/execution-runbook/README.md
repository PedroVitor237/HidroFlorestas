# Runbook de execução da IMP-006 — Diagnóstico IHFR

## Objetivo e público

Este runbook orienta o próximo agente de implementação e a revisão técnica desde o estado parcial atual até uma branch verificável e pronta para avaliação de merge. Ele complementa [spec.md](../spec.md), [plan.md](../plan.md), [tasks.md](../tasks.md), [data-model.md](../data-model.md), [quickstart.md](../quickstart.md), [ADR-0001](../../../docs/governance/ADR-0001-contrato-experimental-ihfr-v0-1.md) e os [contratos](../contracts/); não os substitui. Cada etapa tem entradas, saídas, verificações e parada próprias. A presente execução é exclusivamente documental: nenhuma tarefa funcional pendente foi implementada.

## Estado Git revalidado

Após git fetch origin, em 2026-09-21 (America/Fortaleza): branch 006-ihfr-diagnosis; HEAD e origin/006-ihfr-diagnosis = 69f505a7ccebf3e074f848fd9695de1213c7ab2d; upstream origin/006-ihfr-diagnosis; origin/development e merge-base = 100351e07d9f89f34ebb0ea4de17b526297d6350. A feature está 35 commits à frente e zero atrás de development; está 0/0 em relação ao upstream. O status inicial contém apenas o não rastreado specs/005-environmental-collection-data/coverage-review.md, de outra entrega, que deve permanecer intocado. O delta completo de arquivos e os comandos de revalidação constam em [01](01-current-state-and-reconciliation.md). Refazer o fetch e a comparação antes de implementar: esses SHAs são um snapshot, não uma garantia futura.

## Arquitetura e estado observado

O monólito Next.js/TypeScript usa Prisma/PostgreSQL. A cadeia autorizada é laboratório → área → coleta confirmada → EnvironmentalMeasurementSet imutável. A migration aditiva experimental já cria suplemento, snapshot de diagnóstico, ponteiro CURRENT, ledger de operações e eventos. Manifesto matemático v0.1.1 ativo, v0.1.0 histórico, hashes canônicos, parser fechado, request hash e avaliador puro determinístico estão no código e em testes focais. GET current/detail, DTO minimizado, resumo e ausência read-only existem. Os testes RED de escrita foram preparados; os focais até T082 têm evidência em [implementation-evidence.md](../implementation-evidence.md). Isso é EVIDENCIA_IMPLEMENTACAO técnica, sem aprovação científica.

Persistem quatro métodos de serviço como stubs e quatro handlers com 501 NOT_IMPLEMENTED: elegibilidade, CREATE/REPLACE, revogação e recuperação. Faltam autorização específica de escrita, transações, ledger, UI de gestão, fixtures E2E visíveis ao processo Next.js, testes de contrato/segurança/migration completos, regressão geral, teardown final e evidência de prontidão. T060 foi SKIP; a E2E de gestão também foi SKIP. As 81 tarefas marcadas até T082 não se tornam uma entrega integral.

## Estado ideal

Um novo diagnóstico usa exclusivamente o manifesto v0.1.1 e hash exato; v0.1.0 continua histórica e não ativável. O cálculo permanece puro, server-side e determinístico. OWNER/ADMIN contextuais ativos podem criar, substituir, revogar e recuperar; MEMBER apenas consulta; laboratório inativo é somente leitura. Cada coleta tem no máximo um CURRENT. Suplementos confirmados, snapshots, operações terminais e eventos são imutáveis; escrita, idempotência, concorrência e rollback são verificáveis em PostgreSQL. DTOs não expõem ator, chave, hashes internos, payload ambiental completo ou evidência restrita. Ausência não vira score zero. Todas as suítes obrigatórias executam sem SKIP, o schema temporário e processos são removidos, evidências correspondem ao HEAD, e a branch está reconciliada com development. O resultado continua CONTRATO_EXPERIMENTAL, VALIDACAO_CIENTIFICA_PENDENTE, SUJEITO_A_RECALIBRACAO e NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO.

## Ordem obrigatória e dependências

| Ordem | Arquivo | Saída que libera a próxima etapa |
|---|---|---|
| 01 | [Estado e reconciliação](01-current-state-and-reconciliation.md) | Baseline, drift, banco e stubs registrados |
| 02 | [Autorização e elegibilidade](02-write-authorization-and-eligibility.md) | Serviço nega escrita indevida e consulta elegibilidade sem persistir |
| 03 | [Ciclo e idempotência](03-transactional-lifecycle-and-idempotency.md) | CREATE/REPLACE/REVOKE/recuperação atômicos |
| 04 | [API HTTP](04-http-api-and-error-contract.md) | Seis operações e envelopes corretos |
| 05 | [UI e acessibilidade](05-management-ui-and-accessibility.md) | Jornada de gestão contextual pronta |
| 06 | [Checkpoint GREEN da US2](06-us2-green-checkpoint.md) | Unitários, PostgreSQL e E2E da US2 realmente verdes |
| 07 | [Contrato, migration e segurança](07-contract-migration-security-hardening.md) | Propriedades transversais demonstradas |
| 08 | [E2E, regressão e limpeza](08-e2e-regression-and-cleanup.md) | T060/T116 sem SKIP, regressões e teardown concluídos |
| 09 | [Evidência e merge](09-evidence-governance-and-merge-readiness.md) | Escopo, evidência e estado de branch aptos à revisão |

01 é preflight obrigatório. 02 alimenta 03; 03 alimenta 04/05; 04/05 alimentam 06; 06 alimenta 07; 07 precede regressões e limpeza de 08; 09 só fecha depois de 08. Teardown ocorre em bloco de finalização mesmo quando uma etapa de banco falha. Se 06 precisar de fixtures E2E persistentes, antecipar somente a infraestrutura descrita em 08 e executar a T060 junto da T116 na etapa 08. T001–T059 e T061–T082 não devem ser refeitas, salvo regressão comprovada; conferir seus resultados anteriores ao começar.

## Mapa exclusivo das 53 tarefas pendentes

A tabela abaixo é a única atribuição de cada tarefa pendente a uma etapa.

| Etapa | Tarefas atribuídas | Quantidade |
|---|---|---:|
| 01 | Nenhuma tarefa funcional nova; revalidação do baseline | 0 |
| 02 | T083, T084 | 2 |
| 03 | T085, T086, T087, T088, T089, T090 | 6 |
| 04 | T091, T092, T093, T094, T095 | 5 |
| 05 | T096, T097, T098 | 3 |
| 06 | T099, T100, T101, T102, T103 | 5 |
| 07 | T104, T105, T106, T107, T108, T109, T110, T111, T112, T113 | 10 |
| 08 | T060, T114, T115, T116, T117, T118, T119, T120, T121, T122, T123, T124, T125, T126 | 14 |
| 09 | T127, T128, T129, T130, T131, T132, T133, T134 | 8 |
| **Total** | **53 IDs distintos** | **53** |

## Autoridade, paradas e evidência

Por assunto, aplicar a [constituição](../../../.specify/memory/constitution.md), [SOURCE_AUTHORITY.md](../../../docs/governance/SOURCE_AUTHORITY.md), ADR-0001 e os contratos da feature. Distinguir DECISAO_CONFIRMADA de EVIDENCIA_IMPLEMENTACAO, INFERENCIA, RECOMENDACAO e PENDENCIA_DE_DECISAO. docs/raw/** é histórico imutável. O código demonstra comportamento observado; testes técnicos não substituem revisão científica. PD-002, revisão especializada, calibração, vetores científicos aprovados e campo continuam NAO_VERIFICADO / VALIDACAO_POSTERIOR e impedem promoção definitiva, sem bloquear a entrega experimental rotulada.

Parar a parte afetada se mudar o manifesto/hash, a taxonomia, a fórmula ou o escopo sem nova decisão; se banco não for descartável/autorizado; se schema/migration divergirem; se falhar isolamento, autorização, imutabilidade ou teardown; se uma regressão exigir alterar IMP-005/007/008 fora do recorte; se houver conflito de fonte sem autoridade; ou se a integração futura de development ameaçar descartar trabalho. Registrar origem, impacto e decisão necessária. Não marcar GREEN com SKIP, teste não executado, fixture em banco compartilhado ou evidência de HEAD diferente.

Para cada comando, registrar em [implementation-evidence.md](../implementation-evidence.md) HEAD, ambiente sanitizado, comando, exit code, contagem PASS/FAIL/SKIP, motivo, schemas/processos residuais e ligação com tarefa/FR/SC. Não registrar URL, credencial, token, PII ou payload restrito. Guardar revisão humana separadamente, em evidence/human-validation.md quando T128/T129 forem executadas. Na fase atual, esse arquivo ainda não existe.

## Definição global de pronto e fora do escopo

Pronto para avaliação de merge exige T001–T134 concluídas ou justificativas explícitas aceitas pelo contrato de encerramento, inclusive T060 e T116 executadas; seis operações/sete comportamentos; testes unitários, contrato, integração, migration, E2E, regressão, typecheck, lint e build verdes; zero resíduos; branch/base e PR preparados coerentes com HEAD; diff revisado; e ciência ainda rotulada como pendente. O merge depende da revisão e autorização do fluxo da equipe; este runbook não concede essa autorização.

Fora do escopo: implementar qualquer funcionalidade nesta execução documental; aprovação científica definitiva; perfil regional, Python/FastAPI, IA generativa, serviço externo, PostGIS ou motor novo; processo autônomo; editar a IMP-005; acrescentar IHFR ao dashboard, histórico, mapa, gráficos ou recomendações; modificar docs/raw/**; operar banco de produção; criar commit, push, merge, rebase ou PR nesta execução.
