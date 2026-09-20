# Texto para a futura descrição do PR

## Contrato experimental do IHFR

- Fonte-base: `DOC-RAW-013` — `docs/raw/specificacao-do-ihfr-v0-1-mvp-contrato-matematico.md`, SHA-256 `d2382cf17561f557bbd70201875d08c554740a01bb31448f0d0713c8dd8f117a`.
- Fórmula selecionada: `IHFR = 0,25W + 0,25S + 0,25V + 0,25T`.
- Estado: `CONTRATO_EXPERIMENTAL`, `VALIDACAO_CIENTIFICA_PENDENTE`, `SUJEITO_A_RECALIBRACAO` e `NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO`.
- Conflitos históricos: pesos, normalizações, limites, qualidade, APP, composição territorial, classes, precisão e ausências estão documentados e resolvidos somente para engenharia no [ADR-0001](../../docs/governance/ADR-0001-contrato-experimental-ihfr-v0-1.md).
- Alternativa regional: `0,35H + 0,30S + 0,25V + 0,10T` permanece preservada, inativa e dependente de calibração territorial própria.
- Compatibilidade: consome `ihfr-measurement-v1`, exige `slopePercent` e depende do suplemento imutável `ihfr-diagnosis-input-experimental-v0.1.0` para `landUseType`; drenagem, elevação, tamanho da área e `CollectionArea.landType` livre não substituem essa entrada.
- `landUseType`: `FOREST=0.2`, `AGROFORESTRY=0.25`, `CROPLAND=0.6`, `PASTURE=0.65`, `DEGRADED_PASTURE=0.8`, `BARE_SOIL=0.95`, `URBAN=0.7`; uso misto exige predominância, desconhecido é `INVALID_INPUT` e ausência é `INSUFFICIENT_DATA`. Decisão focal e alternativas: ADR-0001 §7.
- Política de entrada: opcional conhecido ausente, `null` permitido ou não aplicável é excluído da média; campo/enum desconhecido, alias, caixa divergente e `OTHER(S)` retornam `INVALID_INPUT`; `null` nunca vira zero; dimensão obrigatória incalculável retorna `INSUFFICIENT_DATA`.
- Versões: `mathContractVersion = ihfr-math-experimental-v0.1.1`; `algorithmVersion = ihfr-evaluator-ts-v0.1.0`.
- Hash ativo: `contractHash = sha256:f8104143f1505aceaa68a7ffa06fac50f4906cdfc4119609875d99c9fecc6f89`.
- Histórico: `ihfr-math-experimental-v0.1.0` e `sha256:5285d52ec70e0b0f8a951d40dd54f052e02be1556dd310e3cef0b3b4f6bc684b` permanecem imutáveis e foram substituídos antes da ativação; fórmula, pesos e scores não mudaram.
- Validação: os vetores desta entrega são técnicos e derivados do manifesto; vetores científicos, revisão especializada, calibração e testes de campo permanecem pendentes.
- Compromisso: evidência especializada ou de campo divergente produzirá nova versão/hash e novo diagnóstico, sem alterar resultados históricos.

## Integração territorial preservada

- A IMP-008 já está integrada pelo PR #27; seu mapa territorial Leaflet e sua lista textual permanecem preservados como projeção independente de áreas e coletas confirmadas.
- Esta entrega não adiciona score, classe, risco, cor, diagnóstico ou auditoria restrita ao mapa. Visualização territorial do IHFR permanece evolução futura com requisito, contrato e minimização próprios.
- Leaflet não executa nem substitui o cálculo IHFR. Coordenadas, projeções territoriais e `CollectionArea.landType` não substituem `landUseType` nem entradas científicas ausentes.
- Plotly permanece direção futura posterior à IMP-009 e não integra esta implementação.

## Remediação documental de 2026-09-20

- Os 12 achados da análise independente foram tratados em spec, plano, pesquisa, modelo, quickstart, tarefas, checklist, ADR, contratos e registros de governança.
- O suplemento pertence à coleta, usa `UNIQUE(collectionDataId,payloadHash)` e pode ser referenciado por N diagnósticos compatíveis; não existe `UNIQUE(inputSupplementId)` no diagnóstico.
- O OpenAPI declara seis operações HTTP e sete comportamentos. CREATE/REPLACE compartilham POST com discriminador `mode`; CREATE aceita ID vigente esperado ausente ou `null`, REPLACE exige UUID; elegibilidade inválida retorna `400 INVALID_REQUEST`, enquanto ausência válida/predominância indeterminável retorna `INSUFFICIENT_DATA`; `PublicDiagnosis.areaId` é obrigatório e derivado no servidor.
- A migration futura está reservada em `prisma/migrations/20260920000100_ihfr_experimental_diagnosis/migration.sql`; a implementação para se o caminho estiver ocupado ou a ordem estiver invalidada.
- As tarefas agora seguem a ordem executável banco → Prisma/migration → aplicação isolada/generate → fixtures → shells → RED real → implementação → verdes/regressões → teardown/evidências → encerramento, com `[P]` somente em arquivos independentes.
- Testes PostgreSQL exigem schema isolado por execução, matriz explícita de fixtures, triggers sempre ativos e teardown verificável mesmo após falha.

## Contratos e artefatos

- [ADR-0001](../../docs/governance/ADR-0001-contrato-experimental-ihfr-v0-1.md)
- [manifesto ativo v0.1.1](contracts/ihfr-math-experimental-v0.1.1.json) e [manifesto histórico v0.1.0](contracts/ihfr-math-experimental-v0.1.0.json)
- [schema do suplemento](contracts/ihfr-diagnosis-input-experimental-v0.1.0.schema.json) e [OpenAPI](contracts/ihfr-diagnosis-api.openapi.yaml)
- [spec](spec.md), [plano](plan.md), [pesquisa](research.md), [modelo de dados](data-model.md), [quickstart](quickstart.md), [tarefas](tasks.md) e [checklist](checklists/requirements.md)

## Validação futura da implementação

- Reproduzir ambos os hashes; validar JSON/YAML/OpenAPI e seis operações/sete comportamentos.
- Aplicar a migration em PostgreSQL isolado vazio e com legado; provar constraints, cardinalidade 1:N, triggers, concorrência, rollback e teardown.
- Executar unitários, integração PostgreSQL, E2E, regressões IMP-003/004/005/007/008, typecheck, lint e build na ordem do quickstart.
- Registrar somente comandos realmente executados e evidências sanitizadas; não inventar resultados.

## Verificação humana e limites

- Revisão especializada, vetores científicos aprovados, calibração e testes de campo: `NAO_VERIFICADO` (`VALIDACAO_POSTERIOR`).
- Esses itens não bloqueiam a implementação experimental devidamente rotulada, mas bloqueiam promoção para contrato científico definitivo.
- Este texto não afirma implementação concluída, testes verdes ou PR aberto; essas evidências devem ser acrescentadas somente quando existirem.
