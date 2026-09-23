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
- O OpenAPI declara seis operações HTTP e sete comportamentos. CREATE/REPLACE compartilham POST com discriminador `mode`; CREATE aceita ID vigente esperado ausente ou `null`, REPLACE exige UUID; elegibilidade inválida retorna `400 INVALID_INPUT`, enquanto ausência válida/predominância indeterminável retorna `INSUFFICIENT_DATA`; `PublicDiagnosis.areaId` é obrigatório e derivado no servidor.
- A migration aditiva já existe em `prisma/migrations/20260920000100_ihfr_experimental_diagnosis/migration.sql` e foi aplicada em schema PostgreSQL isolado conforme `implementation-evidence.md`; a aplicação em outros ambientes exige verificação própria da ordem e do destino.
- As tarefas agora seguem a ordem executável banco → Prisma/migration → aplicação isolada/generate → fixtures → shells → RED real → implementação → verdes/regressões → teardown/evidências → encerramento, com `[P]` somente em arquivos independentes.
- Testes PostgreSQL exigem schema isolado por execução, matriz explícita de fixtures, triggers sempre ativos e teardown verificável mesmo após falha.

## Contratos e artefatos

- [ADR-0001](../../docs/governance/ADR-0001-contrato-experimental-ihfr-v0-1.md)
- [manifesto ativo v0.1.1](contracts/ihfr-math-experimental-v0.1.1.json) e [manifesto histórico v0.1.0](contracts/ihfr-math-experimental-v0.1.0.json)
- [schema do suplemento](contracts/ihfr-diagnosis-input-experimental-v0.1.0.schema.json) e [OpenAPI](contracts/ihfr-diagnosis-api.openapi.yaml)
- [spec](spec.md), [plano](plan.md), [pesquisa](research.md), [modelo de dados](data-model.md), [quickstart](quickstart.md), [tarefas](tasks.md) e [checklist](checklists/requirements.md)

## Plano histórico de validação, executado nesta rodada

- Reproduzir ambos os hashes; validar JSON/YAML/OpenAPI e seis operações/sete comportamentos.
- Aplicar a migration em PostgreSQL isolado vazio e com legado; provar constraints, cardinalidade 1:N, triggers, concorrência, rollback e teardown.
- Executar unitários, integração PostgreSQL, E2E, regressões IMP-003/004/005/007/008, typecheck, lint e build na ordem do quickstart.
- Registrar somente comandos realmente executados e evidências sanitizadas; não inventar resultados.

## Verificação humana e limites

- Revisão especializada, vetores científicos aprovados, calibração e testes de campo: `NAO_VERIFICADO` (`VALIDACAO_POSTERIOR`).
- Esses itens não bloqueiam a implementação experimental devidamente rotulada, mas bloqueiam promoção para contrato científico definitivo.
- Esta observação pertence ao texto histórico de planejamento; os resultados efetivos de 2026-09-23 aparecem abaixo. Nenhum PR foi aberto.

## Delta implementado em 2026-09-23 — descrição preparada, não publicada

**Branch:** `007-ihfr-evolution`, derivada da feature `006-ihfr-diagnosis`; HEAD inicial e atual `97d95583fa62ed1f3dc88f7a7c69e150afddb968`; merge-base conferido com `origin/development`: `100351e07d9f89f34ebb0ea4de17b526297d6350`. As alterações estão na working tree, sem commit. A base alvo proposta para revisão é `development`; revalidar a base antes de qualquer PR futuro.

Identidade atual do código/testes/configuração/OpenAPI não commitados após a rodada corretiva focal: manifesto SHA-256 `0352e9cf9f8c5548d4d098890bfc63855b6ce2ba1f1d5fea1378a770ff0e6a0f` (59 arquivos; método e escopo em [implementation-evidence.md](implementation-evidence.md)). O fingerprint anterior `16f6eba1e280e32f98eb6836622add9c8122eee0c5b4e61de762aa3ec4564b8a` permanece como histórico. O `teste.txt` não rastreado foi preservado e está fora deste delta.

### Escopo entregue

- Serviço real com autorização contextual, elegibilidade sem escrita, CREATE/REPLACE/REVOKE transacionais, CURRENT único, eventos/snapshots imutáveis, ledger terminal, replay e recuperação reautorizada. O suplemento é fechado e deduplicado pela coleta/payload, com cardinalidade 1:N.
- Seis operações HTTP para sete comportamentos, `no-store`, envelopes fechados, projeção pública allowlist e DTOs conformes ao OpenAPI 3.1, com decomposição e versões explícitas. `PD-018` foi resolvida pela confirmação explícita da equipe em 2026-09-23: input estrutural/sintaticamente inválido recebe `400 INVALID_INPUT`; seleção de versão/hash bem formada porém incompatível, ou medição persistida incompatível, recebe `422 INCOMPATIBLE_VERSION` e terminal idempotente. O terminal não cria suplemento confirmado, diagnóstico, `CURRENT` ou evento; replay idêntico não escreve e GET operation o recupera como `200 OperationResponse`. O schema de entrada valida o formato, enquanto a saída do diagnóstico ativo preserva as constantes exatas.
- UI na página contextual existente para OWNER/ADMIN em laboratório ativo, com confirmação, teclado/foco, conflitos, insuficiência, incompatibilidade e recuperação com chave estável; MEMBER/inatividade só leem. Nenhuma camada IHFR foi adicionada a dashboard/mapa.
- Harness PostgreSQL local próprio e preservado para novas rodadas, schema exclusivo por execução, E2E com servidor Next próprio e auditoria de limpeza. O script [imp006-local-postgresql.ps1](../../scripts/imp006-local-postgresql.ps1) inclui `Dispose` futuro, mas ele **não foi executado** a pedido do usuário. Nenhum Python foi instalado/usado.

### Verificação observada

Comandos executados via `scripts/imp006-local-postgresql.ps1 -Action Run` nos modos `Schema` ou `Regression`, conforme [evidência detalhada](implementation-evidence.md):

| Suíte | Resultado |
|---|---|
| `npm test` | 204 unitários e 105 integrações, 0 FAIL/SKIP/TODO |
| `npm run test:migration` | 23/23 PASS, 0 FAIL/SKIP/TODO |
| `npm run test:contract` | 2/2 PASS, 0 FAIL/SKIP/TODO |
| `npm run test:e2e:ihfr` | 5/5 PASS, 0 FAIL/SKIP/TODO; inclui foco, reconciliação real, incompatibilidade 422 recuperável e replay sem nova linha |
| Playwright territorial `tests/e2e/territorial-map.spec.ts` | 3/3 PASS, 0 FAIL/SKIP/TODO; tiles interceptados |
| `npm run typecheck`, `npm run lint`, `npm run build` | PASS; lint com 0 erros e 4 warnings preexistentes fora da IMP-006 |
| `scripts/imp006-local-audit.ts` | 0 schemas temporários, 0 fixtures territoriais e 0 linhas IHFR públicas no banco próprio; 4 triggers de imutabilidade IHFR habilitados |
| `scripts/imp006-local-environment-smoke.ps1`; `git diff --check` | PASS; variáveis de processo restauradas após sucesso/falha e diff sem erro de whitespace |

### Correções focais após auditoria independente

- GET operation reautoriza leitura contextual para o mesmo ator ainda vinculado como OWNER/ADMIN/MEMBER, mesmo após inativação do laboratório ou perda da capacidade de escrita. Outro ator, vínculo perdido e contexto cruzado recebem 404; chave malformada 400 `INVALID_INPUT`.
- POST incompatível novo e replay idêntico retornam ambos `422 ErrorEnvelope`, sem nova escrita. GET operation recupera o mesmo terminal como `200 OperationResponse`. O OpenAPI, o serviço e os testes unitários, PostgreSQL, contrato e E2E cobrem essa distinção.
- A UI reconcilia CURRENT e elegibilidade após transições terminais e `STATE_CONFLICT`, move o foco para status/alerta conforme o resultado e preserva a chave somente quando o resultado é desconhecido. O diálogo mantém foco contido, Escape, cancelamento e retorno ao acionador.
- Os handlers de escrita autorizam o contexto antes de validar query, header e body. MEMBER recebe 403 e laboratório inativo 409 READ_ONLY com input válido ou malformado. O runner PostgreSQL restaura exatamente as sete variáveis de processo após sucesso/falha; há smoke automatizado sem exposição de credenciais.
- T116 e T134 foram reabertas e encerradas após os gates finais. A falha E2E intermitente anterior permanece registrada como histórico em [implementation-evidence.md](implementation-evidence.md), sem atribuição causal a esta correção.

### Limites para revisão

- `DECISAO_CONFIRMADA` `PD-018`: a equipe confirmou nesta conversa, em 2026-09-23, a precedência 400 estrutural / 422 incompatibilidade semântica. O contrato e a implementação foram corrigidos e os gates afetados foram repetidos conforme [evidência detalhada](implementation-evidence.md).
- T134 foi encerrada tecnicamente após a auditoria de recursos temporários. Uma repetição intermediária do E2E teve timeout intermitente no primeiro cenário; a suíte completa passou 5/5 na repetição final. `PD-002` e as validações científicas/humanas permanecem `VALIDACAO_POSTERIOR`.
- [Validação humana e científica](evidence/human-validation.md): revisão do professor Fábio/especialistas, vetores aprovados, calibração, campo e leitor de tela permanecem `NAO_VERIFICADO` (`VALIDACAO_POSTERIOR`). A ciência segue `CONTRATO_EXPERIMENTAL`, `VALIDACAO_CIENTIFICA_PENDENTE`, `SUJEITO_A_RECALIBRACAO` e `NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO`.
- A migration publicada, os manifestos e `docs/raw/**` não foram alterados. O cluster PostgreSQL permanece ativo para novas rodadas; só os recursos temporários da execução foram removidos. Nenhum PR/commit/push/merge/deploy foi realizado.
