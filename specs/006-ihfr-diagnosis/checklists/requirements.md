# Specification Quality Checklist: Diagnóstico IHFR

**Purpose**: Validar a completude e a qualidade da especificação antes de qualquer etapa posterior.
**Created**: 2026-09-16
**Feature**: [spec.md](../spec.md)

## Content Quality

- [x] No low-level implementation design beyond the architecture boundaries explicitly decided for G3
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

## Requirement Completeness

- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous within the explicitly gated scope
- [x] Success criteria are measurable
- [x] Success criteria are technology-agnostic (no implementation details)
- [x] All acceptance scenarios are defined
- [x] Edge cases are identified
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

## Feature Readiness

- [x] All functional requirements have clear acceptance criteria
- [x] User scenarios cover primary flows
- [x] Feature defines measurable outcomes in Success Criteria
- [x] No implementation details leak into specification

## Validation Evidence

As iterações 1 a 5 abaixo são evidências históricas preservadas e não são homologadas retroativamente. A Iteração 6 registra os achados da análise independente; somente a Iteração 7 representa o estado documental corrente.

Iteração 1: 16/16 critérios documentais atendidos. US1 cobre consulta, ausência, origem, inatividade, isolamento e legado; US2 cobre associação condicionada, rejeições, preservação e recuperação. FR-001–FR-015 são verificáveis pelos cenários e limites; SC-001–SC-007 definem resultados observáveis sem escolher arquitetura ou ciência ausentes.

Os gates G1–G3 são precondições materiais explícitas, não marcadores ocultos. A validação desta checklist confirma a qualidade do recorte documental e não declara prontidão para implementação. A produção do diagnóstico, o contrato científico, a relação contrato–algoritmo e o ciclo de associação permanecem pendentes; por isso, a spec declara a implementação bloqueada.

A IMP-005 foi consultada no commit remoto fixo `d3fade93e71473b88e44bb473fb2adb9718f2f4c` e classificada como planejada, ainda não integrada. A reconciliação com qualquer avanço posterior é requisito antes da implementação da IMP-006.

Iteração 2: 16/16 critérios documentais permanecem atendidos após a revisão cruzada com a IMP-005 em `1235387ded9854be20a92f8639a502a80a2bd952`. A spec agora distingue respostas técnicas/de dados, contratos ainda não integrados e pendências científicas. G1 continua aberto até implementação e integração da IMP-005; G2 continua aberto porque `ihfr-math-contract-v1` não contém fórmula ativa nem aprovação científica; G3 foi reduzido apenas pelos padrões planejados de captura, imutabilidade, idempotência e recuperação, sem definir o produtor ou a auditoria do diagnóstico.

Iteração 3: 16/16 critérios documentais permanecem atendidos após incorporar `origin/development` `5d9ca6f8f848867e8152bc25e86abc9a6e73358f` pelo merge normal `62b54fa8d98b2bce2c03d7b6e2181ed4c94ab07d` e reconciliar a IMP-005 implementada no head `e775ebcdc1112c0d18117e4023a578a4ef62cf1c`. A spec preserva as baselines históricas, fecha G1 pela entidade, migration, contratos, API, DTOs, autorização, imutabilidade, idempotência, concorrência e tratamento de legado efetivamente integrados, sem promover captura técnica a ciência do IHFR.

G2 permanece aberto para fórmula, normalizações, pesos, classes, limiares, ausências/insuficiência, qualidade/confiança, manifesto ativável, hash normativo, vetores dourados, validação, autoridade aprovadora e compatibilidade. G3 preserva as invariantes funcionais esclarecidas, mas permanece aberto para produtor, responsabilização, forma de produção, aceite, estados/transições persistidos, identidade/idempotência da operação, concorrência/precedência, recuperação e auditoria restrita. Nenhum `[NEEDS CLARIFICATION]` foi removido para ocultar essas pendências.

A reconciliação não declara implementação da IMP-006. A próxima etapa é somente `$speckit-plan` condicionado; `$speckit-tasks`, `$speckit-analyze` e `$speckit-implement` permanecem inaplicáveis até existir plano executável e tarefas. A IMP-007 foi consultada em `9e3a818be1690298e70586ac640151fecba02b82`, possui 64/65 tarefas marcadas, permanece não integrada e sem projeção de diagnóstico, portanto não bloqueia esse planejamento condicionado.

Hooks: `.specify/extensions.yml` ausente; nenhum hook anterior ou posterior a specify foi executado.

Iteração 4: os 16 critérios permanecem atendidos após a consolidação decisória de 2026-09-18. O [ADR-0001](../../../docs/governance/ADR-0001-contrato-experimental-ihfr-v0-1.md) é a fonte canônica para conflitos, matemática, compatibilidade e G3; a spec mantém requisitos verificáveis sem duplicar a decisão completa.

`G2-ENG` foi separado de `G2-SCI`: o primeiro está em `G2_ENG_DEPENDE_DE_EVOLUCAO_DE_ENTRADA`, com a dependência limitada ao suplemento `ihfr-diagnosis-input-experimental-v0.1.0` e à presença de `slopePercent`; o segundo está em `NAO_VERIFICADO_VALIDACAO_POSTERIOR`. G3 está `RESOLVIDO_DOCUMENTALMENTE_PARA_PLANEJAMENTO_V0_1`. Nenhum desses estados afirma validação científica definitiva.

O manifesto JSON é válido, seu hash canônico foi reproduzido e o perfil regional permanece inativo. Nenhum código, schema, migration, dependência, contrato da IMP-005 ou documento de `docs/raw/` foi alterado. A próxima skill aplicável é `$speckit-plan`; tasks, analyze e implement continuam posteriores.

A rechecagem remota de 2026-09-19 encontrou somente a integração da IMP-007 em `origin/development` `10fdb8b`; a branch IMP-006 permaneceu `0/0`. O dashboard integrado continua sem projeção de diagnóstico e nenhum merge foi executado nesta consolidação.

Iteração 5: os 16 critérios permanecem atendidos após a auditoria focal de `landUseType` de 2026-09-19. O ADR-0001 §7 registra as 13 fontes históricas pertinentes com hashes e localizadores, seleciona os sete valores/scores de `DOC-RAW-013` como `DECISAO_EXPERIMENTAL_DE_ENGENHARIA`, preserva tabelas concorrentes e explicita uso misto, categoria desconhecida, ausência, mudança posterior, aplicabilidade e autoridade operacional.

`G2-ENG — landUseType` está `RESOLVIDO_E_RASTREAVEL_PARA_V0_1_EXPERIMENTAL`; `G2-ENG` geral está `RESOLVIDO_PARA_PLANEJAMENTO`; `G2-SCI` permanece `NAO_VERIFICADO_VALIDACAO_POSTERIOR`. A fronteira HTTP distingue candidato incompleto, que produz `INSUFFICIENT_DATA`, de suplemento confirmado, que continua estrito e imutável. Manifesto, versão e hash matemáticos não mudaram. A próxima skill aplicável é `$speckit-tasks`; ela não foi executada nesta auditoria.

Iteração 6 — análise independente histórica: após incorporar `origin/development@df856194b3341137d6d863feefcb0a203deb5905` pelo merge normal `96dac7c`, a análise encontrou 12 inconsistências — 5 `HIGH`, 5 `MEDIUM` e 2 `LOW` — e não aprovou o pacote como pronto. A tabela preserva o estado aberto observado naquela iteração sem usar sintaxe de checklist vigente e sem simular aprovação retroativa. A coluna de remediação registra somente o tratamento posterior na Iteração 7.

| Finding histórico | Estado na Iteração 6 | Remediação posterior | Evidência atual |
|---|---|---|---|
| `HIGH` I1 — política contraditória para entrada desconhecida no manifesto | `IDENTIFICADO_ABERTO` | `RESOLVIDO_NA_ITERACAO_7` | [manifesto v0.1.1](../contracts/ihfr-math-experimental-v0.1.1.json), [spec](../spec.md) e [ADR-0001](../../../docs/governance/ADR-0001-contrato-experimental-ihfr-v0-1.md) |
| `HIGH` I2 — cardinalidade 1:1 do suplemento incompatível com reuso entre diagnósticos | `IDENTIFICADO_ABERTO` | `RESOLVIDO_NA_ITERACAO_7` | [modelo de dados](../data-model.md), [spec](../spec.md) e [tarefas](../tasks.md) |
| `HIGH` I3 — testes GREEN de US1 antes da persistência/fixtures necessárias | `IDENTIFICADO_ABERTO` | `RESOLVIDO_NA_ITERACAO_7` | [ordem executável das tarefas](../tasks.md) e [plano](../plan.md) |
| `HIGH` I4 — preflight, migration, aplicação, generate e GREEN em ordem não executável | `IDENTIFICADO_ABERTO` | `RESOLVIDO_NA_ITERACAO_7` | [Phase 2 e dependências](../tasks.md) e [quickstart](../quickstart.md) |
| `HIGH` G1 — fixtures, isolamento e teardown PostgreSQL insuficientemente definidos | `IDENTIFICADO_ABERTO` | `RESOLVIDO_NA_ITERACAO_7` | [modelo de dados §10.1](../data-model.md), [quickstart §5/§9](../quickstart.md) e [tarefas](../tasks.md) |
| `MEDIUM` I5 — contagem de seis operações HTTP versus sete comportamentos ambígua | `IDENTIFICADO_ABERTO` | `RESOLVIDO_NA_ITERACAO_7` | [OpenAPI](../contracts/ihfr-diagnosis-api.openapi.yaml), [plano](../plan.md) e [tarefas](../tasks.md) |
| `MEDIUM` U1 — condicionais CREATE/REPLACE e erro de elegibilidade incompletos no OpenAPI | `IDENTIFICADO_ABERTO` | `RESOLVIDO_NA_ITERACAO_7` | [OpenAPI](../contracts/ihfr-diagnosis-api.openapi.yaml) e [quickstart](../quickstart.md) |
| `MEDIUM` G2 — `PublicDiagnosis.areaId` ausente/inconsistente | `IDENTIFICADO_ABERTO` | `RESOLVIDO_NA_ITERACAO_7` | [OpenAPI](../contracts/ihfr-diagnosis-api.openapi.yaml), [spec](../spec.md) e [tarefas](../tasks.md) |
| `MEDIUM` I6 — marcações `[P]` concorrendo sobre os mesmos arquivos | `IDENTIFICADO_ABERTO` | `RESOLVIDO_NA_ITERACAO_7` | [tarefas e exemplos de paralelismo](../tasks.md) |
| `MEDIUM` I7 — encerramento antecedendo a regressão territorial | `IDENTIFICADO_ABERTO` | `RESOLVIDO_NA_ITERACAO_7` | [Phases 7 e 8](../tasks.md) |
| `LOW` U2 — caminho de migration ainda era placeholder | `IDENTIFICADO_ABERTO` | `RESOLVIDO_NA_ITERACAO_7` | [modelo de dados §10](../data-model.md), [quickstart](../quickstart.md) e [tarefas](../tasks.md) |
| `LOW` I8 — checklist não refletia a análise corrente | `IDENTIFICADO_ABERTO` | `RESOLVIDO_NA_ITERACAO_7` | Esta Iteração 7 e o histórico preservado acima |

Iteração 7 — remediação focal corrente, 2026-09-20: os 16 critérios de qualidade documental estão novamente atendidos no conteúdo atual, sem alterar o registro histórico da Iteração 6. A v0.1.0 foi preservada integralmente; a clarificação normativa gera `ihfr-math-experimental-v0.1.1` e hash novo, sem mudança de fórmula, pesos ou scores.

- [x] I1 — ausência opcional conhecida é excluída; campo/enum desconhecido, alias, caixa e `OTHER(S)` retornam `INVALID_INPUT`; `null` nunca vira zero
- [x] I2 — suplemento pertence à coleta, é deduplicado por `(collectionDataId,payloadHash)` e tem relação 1:N com diagnósticos
- [x] I3/I4 — tarefas ordenam setup, caracterização, banco/Prisma/migration, apply/generate, fixtures, shells, RED real, implementação e verdes
- [x] G1 — schema por execução, matriz explícita de fixtures, triggers ativos e teardown após falha estão definidos
- [x] I5/U1 — OpenAPI declara seis operações/sete comportamentos, `mode` discriminado, condicionais e `400 INVALID_REQUEST`
- [x] G2 — `PublicDiagnosis.areaId` é obrigatório, UUID, coerente e derivado no servidor
- [x] I6 — `[P]` foi recalculado somente para arquivos independentes
- [x] I7 — regressão territorial antecede teardown, evidências e fechamento; o fechamento é a última tarefa real
- [x] U2 — caminho reservado é `prisma/migrations/20260920000100_ihfr_experimental_diagnosis/migration.sql`, com stop condition
- [x] I8 — esta iteração registra a remediação sem reclassificar as anteriores
- [x] A nova análise independente sobre o commit `530e4924035b2fa1e9fb020e2991c3e8a198b012` confirmou os 12 findings como resolvidos, encontrou zero finding material novo e emitiu `IMP_006_PRONTA_PARA_IMPLEMENTACAO`

### Validações humanas futuras — estado informativo

Estas validações não integram a checklist documental vigente e não recebem marca de conclusão automática:

| Validação futura | Estado | Efeito |
|---|---|---|
| Revisão do professor Fábio e de especialistas | `NAO_VERIFICADO` (`VALIDACAO_POSTERIOR`) | Não bloqueia a implementação experimental; bloqueia alegação científica definitiva. |
| Vetores científicos aprovados | `NAO_VERIFICADO` (`VALIDACAO_POSTERIOR`) | Pode exigir nova versão/hash; não reescreve diagnósticos históricos. |
| Calibração científica e regional | `NAO_VERIFICADO` (`VALIDACAO_POSTERIOR`) | Mantém o perfil regional inativo. |
| Testes de campo | `NAO_VERIFICADO` (`VALIDACAO_POSTERIOR`) | Evidência divergente aciona revisão futura, sem alterar resultados anteriores. |

Nenhuma implementação foi executada nesta remediação editorial. O próximo passo autorizado é uma nova execução de `$speckit-implement`.
