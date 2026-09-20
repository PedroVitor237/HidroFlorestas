# Evidência de implementação da IMP-006

**Feature**: Diagnóstico IHFR experimental
**Branch**: `006-ihfr-diagnosis`
**Contrato**: `CONTRATO_EXPERIMENTAL` · `VALIDACAO_CIENTIFICA_PENDENTE` · `SUJEITO_A_RECALIBRACAO` · `NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO`

Este registro distingue conformidade técnica de validação científica. Valores de ambiente, URLs, credenciais, hashes internos de payload e PII não são registrados.

## Baseline e guards — T001–T010

- Baseline inicial: `63030412f595cf6fedd17e0bda225451409043da`, igual a `origin/006-ihfr-diagnosis`, divergência `0/0`, working tree e index limpos.
- `origin/development@df856194b3341137d6d863feefcb0a203deb5905` e IMP-008 `c6c13f7dc97d4ed873f67cb99fb6c36d60579601` são ancestrais.
- `.specify/feature.json` aponta para `specs/006-ihfr-diagnosis`; T001–T134 presentes, zero previamente concluídas e 41 marcações `[P]`.
- Checklist mecânica: 27 vigentes, 27 marcados e zero desmarcados. Os findings da Iteração 6 permanecem históricos; ciência/campo permanecem `NAO_VERIFICADO`.
- `.specify/extensions.yml` ausente; nenhum hook `before_implement` foi executado.
- Manifestos JSON válidos. Hash v0.1.0 histórico reproduzido como `sha256:5285d52ec70e0b0f8a951d40dd54f052e02be1556dd310e3cef0b3b4f6bc684b`; hash v0.1.1 ativo reproduzido como `sha256:f8104143f1505aceaa68a7ffa06fac50f4906cdfc4119609875d99c9fecc6f89`. A v0.1.0 não foi alterada e não será ativada.
- Stack caracterizada: Next.js 16, React 19, TypeScript 5, Prisma 7, PostgreSQL/Neon, `node:test`/`tsx` e Playwright. Scripts existentes: `test:unit`, `test:integration`, `test:migration`, `test:e2e`, `lint`, `typecheck` e `build`.
- Baseline integrada caracterizada: autorização contextual e laboratório inativo das IMP-003/004/005; `EnvironmentalMeasurementSet` imutável e `ihfr-measurement-v1`; dashboard IMP-007 derivado apenas de área/coleta; mapa IMP-008 transitório em Leaflet e sem IHFR.
- Stop conditions: divergência normativa/hash; migration reservada ocupada ou fora de ordem; guard do banco de teste inválido; falha de isolamento/autorização; regressão material; necessidade de alterar ciência ou as IMP-005/007/008 fora do recorte.

## Matriz de execução

| Etapa | Comando/ação | Resultado esperado | Estado |
|---|---|---|---|
| Contratos | parsing JSON/YAML, hashes e schemas | contratos íntegros | CONCLUÍDO para preflight |
| Migration | preflight, format, validate, aplicação isolada, generate | schema aditivo e client atual | PENDENTE |
| US1 | RED comportamental → implementação → unit/integration/E2E | consulta segura | PENDENTE |
| US2 | RED comportamental → implementação → unit/integration/E2E | ciclo completo | PENDENTE |
| Regressão | IMP-003/004/005/007/008, lint, typecheck, build | sem regressões | PENDENTE |
| Teardown | descarte allowlisted e contagens finais | zero resíduos | PENDENTE |

## Reconciliação com a IMP-009 — 2026-09-20

- `origin/development@100351e07d9f89f34ebb0ea4de17b526297d6350` foi integrado por merge normal na branch publicada, no commit `4816cd6` (`merge: integrate development into IMP-006`). Não houve rebase, force-push, merge em `development` nem abertura de PR.
- Os conflitos foram resolvidos por composição em `.gitignore`, `prisma/schema.prisma` e `tests/migration/migration-test-harness.ts`: permaneceram as migrations e relações IHFR; `User.revision`, `AdministrativeAuditEvent` e as relações administrativas foram incorporadas; `User.isAdmin` não foi restaurado no schema/runtime; e o harness passou a permitir os prefixos isolados das IMP-003/004/005/006/009.
- A ordem lexicográfica integrada foi comprovada como `20260919000100_user_administration` → `20260920000100_ihfr_experimental_diagnosis` → `20260920000100_remove_legacy_is_admin`. O preflight passou a verificar essa ordem real sem renomear ou reescrever migrations publicadas.
- Gates do merge: `npx prisma format`, `npx prisma validate`, `npx prisma generate`, `npm run typecheck` e `git diff --check` concluíram com código 0. Cinco arquivos focais de autenticação/autoridade administrativa passaram. O preflight IMP-006 concluiu quatro verificações estáticas e deixou uma verificação PostgreSQL explicitamente `SKIP` porque as variáveis protegidas não haviam sido carregadas naquele processo.
- Após o push, `HEAD` e `origin/006-ihfr-diagnosis` ficaram sincronizados (`0/0`). A branch integrada ficou 18 commits à frente e zero atrás de `origin/development`. O arquivo local não rastreado `specs/005-environmental-collection-data/coverage-review.md` foi preservado e não entrou no commit.

## RED/GREEN e comandos executados

| Etapa | Comando sanitizado | Código | Resultado |
|---|---|---:|---|
| Guard de ambiente | Node com `.env` e `.env.e2e.local` carregados explicitamente; somente booleanos emitidos | 0 | `NODE_ENV=test`; quatro variáveis obrigatórias presentes; URLs PostgreSQL válidas, normalizadas e distintas; confirmação literal e SSL válidos. Nenhum valor sensível registrado. |
| Preflight baseline T011/T012 | `node --import=tsx tests/migration/ihfr-diagnosis-preflight.test.ts` | 1 | Falha do próprio teste: `migration_lock.toml` foi inicialmente contado como diretório de migration. Nenhuma falha do produto ou do banco. |
| Preflight baseline corrigido | mesmo comando após filtrar somente diretórios | 0 | 2/2 testes aprovados; slot reservado livre, nenhuma migration posterior, legado e IMP-005 presentes. |
| Prisma format T016 | `npx prisma format --schema prisma/schema.prisma` | 0 | Schema formatado, sem warning. |
| Prisma validate T018 | `npx prisma validate --schema prisma/schema.prisma` | 0 | Schema Prisma válido, sem warning. |
| Preflight pós-design T022 parcial | `node --import=tsx tests/migration/ihfr-diagnosis-preflight.test.ts` | 0 | 3/3 testes estáticos aprovados: coexistência legado/IMP-005/IMP-006, cardinalidade 1:N, migration aditiva e triggers declarados. |
| Aplicação isolada T021 — tentativa 1 | Node/tsx com ambiente explícito, dois casos em schema `imp006_test_<uuid>` | 1 | 0/2; infraestrutura encerrou ambas as conexões antes de resultado de migration: `Connection terminated unexpectedly`. O `finally` tentou rollback/reset/drop. |
| Aplicação isolada T021 — repetição única | mesmo comando, conforme limite autorizado | 1 | 0/2; mesma indisponibilidade externa. Código não foi alterado para mascarar timeout. O `finally` tentou rollback/reset/drop. |

### Bloqueio material em T021

O banco de teste remoto permaneceu indisponível nas duas tentativas permitidas. Não foi possível provar a aplicação da migration nem confirmar por consulta final a ausência de schemas residuais. Por isso, T021 permanece aberta e `prisma generate`, fixtures, shells e RED comportamental não foram iniciados. A retomada deve começar por uma verificação de conectividade sanitizada, seguida da repetição de T021 e da confirmação de teardown; nenhum fallback para `DATABASE_URL` é permitido.

### Retomada autorizada de T021

- A árvore local foi inventariada antes do acesso: somente os arquivos esperados de T001–T020 estavam modificados ou novos; `git diff --check` passou e nenhuma alteração concorrente foi encontrada.
- O guard foi reexecutado com `.env` e `.env.e2e.local` carregados explicitamente, sem imprimir valores: `NODE_ENV=test`, URLs obrigatórias válidas/distintas, confirmação literal, SSL e senha E2E foram aprovados.
- `TEST_DATABASE_URL` foi classificada sanitizadamente como conexão pooled. `TEST_DIRECT_DATABASE_URL` e `DIRECT_URL` não estão presentes; nenhuma URL direta foi criada ou derivada.
- Verificação mínima autorizada com a URL pooled exatamente como fornecida: `SELECT 1`, código 1, `connected=false`, categoria sanitizada `CONNECTION_FAILURE`, duração aproximada inferior a 1 segundo e encerramento do pool solicitado.
- Conforme o gate da retomada, a migration não foi executada depois dessa falha mínima. Schemas `imp006_test_*` não puderam ser listados, ter propriedade comprovada, ser removidos ou ter ausência confirmada.
- O harness existente exige conexão direta por transformação de hostname. A nova autorização proíbe inferir/modificar o hostname e não existe variável direta de teste documentada; portanto T019/T021 continuam bloqueadas até existir conectividade pooled suficiente para o procedimento aprovado ou uma conexão direta de teste explícita, documentada e autorizada para o mesmo recurso.

### Seleção explícita do banco atual e falha funcional de T021

- A autorização do responsável substituiu, exclusivamente para a IMP-006, a proibição anterior de selecionar `DATABASE_URL`. Nenhuma URL adicional, branch Neon ou banco foi criado; nenhuma conexão teve hostname inferido ou modificado.
- O guard carregou `.env.e2e.local` explicitamente e confirmou, sem revelar valores, as seis variáveis esperadas, `NODE_ENV=test` e a confirmação obrigatória existente.
- Teste mínimo ordenado: `TEST_DATABASE_URL` estava presente, era pooled, alcançou o provedor e falhou com categoria sanitizada `AUTHENTICATION_FAILURE` em aproximadamente 1 segundo; `DATABASE_URL` estava presente, era pooled e respondeu a `SELECT 1` em aproximadamente 2 segundos.
- `DATABASE_URL_SELECIONADA_COMO_BANCO_DE_TESTE_POR_AUTORIZACAO_DO_RESPONSAVEL`.
- O lifecycle T019 foi criado em `tests/fixtures/postgresql-schema-lifecycle.ts` e seleciona a variável nominalmente por `IMP006_DATABASE_VARIABLE` apenas no processo de teste. Ele exige o ambiente e a confirmação existentes, usa a URL sem transformação, aceita somente schemas gerados como `imp006_test_<uuid>`, rejeita `public`, marca o schema e executa rollback/reset/drop em `finally`.
- O inventário anterior a T021 encontrou zero schemas `imp006_test_*`; nenhuma remoção foi necessária e a contagem permaneceu zero.
- Validação local anterior ao banco: `npx tsc --noEmit`, preflight estático focal e `git diff --check` concluíram com código 0.
- T021 foi executada uma vez no destino selecionado. Os dois casos chegaram ao PostgreSQL e falharam funcionalmente: banco vazio com código PostgreSQL `42883`, porque `isfinite(double precision)` não existe; baseline legado com código `22P02`, porque `MEDIUM` não é valor válido de `LevelBasicDefault`.
- As falhas não foram classificadas como transitórias e, conforme o limite de repetição, a migration não foi repetida nem corrigida nesta execução. T021 permanece aberta.
- O teardown foi confirmado depois das duas falhas: zero schemas `imp006_test_*` antes da inspeção final, zero removidos e zero restantes. T019 está concluída com isolamento e limpeza comprovados em caminho de falha.

### Correção focal e conclusão de T021

- O diagnóstico tipado encontrou uma única chamada a `isfinite`, aplicada a `ExperimentalIHFRDiagnosis.rawScore`, coluna `DOUBLE PRECISION NOT NULL`. Ela foi substituída somente nessa constraint por comparações explícitas contra `NaN`, `Infinity` e `-Infinity`, preservando os limites inclusivos `[0,1]` de `rawScore` e `displayScore`.
- `LevelBasicDefault` foi comprovado no schema e na migration inicial como `LOW | MODERATE | HIGH`. A fixture legada passou de `MEDIUM` para o valor real e semanticamente equivalente `MODERATE`; o enum integrado não foi alterado. Os demais enums da fixture (`USER`, `ACTIVE`, `OWNER` e `MODERATE` de classe) também foram conferidos nas fontes integradas.
- Antes da repetição: `git diff --check`, preflight estático, `prisma format`, `prisma validate`, `tsc --noEmit`, busca completa de `isfinite`, busca de `MEDIUM` na fixture, auditoria dos enums e varredura de secrets passaram. `DATABASE_URL` respondeu a `SELECT 1`, e havia zero schemas `imp006_test_*`.
- Execução completa corrigida de T021: 3/3 testes aprovados. A migration aplicou no baseline vazio; preservou uma linha legada e produziu zero backfill experimental; aceitou `rawScore` finito `0.5` e zero; rejeitou `NaN`, `Infinity`, `-Infinity`, `null`, `-0.01` e `1.01`; e preservou a rejeição de `displayScore` abaixo de zero e acima de um.
- O teardown final foi confirmado por catálogo: zero schemas `imp006_test_*` antes da inspeção final, zero removidos e zero restantes. Nenhuma migration foi aplicada em `public`.
- Após T021 GREEN, `npx prisma generate --schema prisma/schema.prisma` concluiu com código 0 usando Prisma Client 7.4.2; os artefatos gerados permanecem no caminho já ignorado `src/generated/prisma`.

### Bloqueio estrutural em T022

- A verificação isolada de T022 aprovou os três preflights estáticos, criou a cadeia integrada e comprovou tabelas, constraints e 19 FKs `RESTRICT`, mas parou na comparação dos nomes de índices.
- Três nomes declarados na migration excedem o limite PostgreSQL de 63 bytes e são truncados pelo servidor: `ExperimentalIHFRInputSupplement_collectionDataId_payloadHash_key` (64), `ExperimentalIHFRInputSupplement_environmentalMeasurementSetId_idx` (65) e `IHFRDiagnosisOperation_laboratoryRoomId_collectionAreaId_collectionDataId_idx` (77). A consulta pelos nomes declarados encontrou 12 dos 15 índices esperados.
- A falha é determinística e T022 permanece aberta. Nenhuma correção de nomenclatura foi feita nesta execução depois da falha sequencial.
- O lifecycle descartou o schema da tentativa. A inspeção final confirmou zero schemas `imp006_test_*` antes da limpeza, zero removidos e zero restantes.

### Retomada de T022 — nomes físicos PostgreSQL

- Checkpoint anterior à correção: `c1bc88b62fa367884ab9840d0adfd55b521d163d` (`feat(ihfr): checkpoint diagnosis schema and migration`), publicado em `origin/006-ihfr-diagnosis` com divergência `0/0`. O commit preserva T021 GREEN e T022 aberta.
- Mapeamentos de índices, todos ASCII e explícitos no Prisma/SQL:
  - `ExperimentalIHFRInputSupplement_collectionDataId_payloadHash_key` (64 bytes) → `ExperimentalIHFRInput_collection_payload_key` (44 bytes).
  - `ExperimentalIHFRInputSupplement_environmentalMeasurementSetId_idx` (65 bytes) → `ExperimentalIHFRInput_measurement_idx` (37 bytes).
  - `IHFRDiagnosisOperation_laboratoryRoomId_collectionAreaId_collectionDataId_idx` (77 bytes) → `IHFRDiagnosisOperation_context_idx` (34 bytes).
- A auditoria completa de identificadores encontrou também a FK `ExperimentalIHFRInputSupplement_environmentalMeasurementSetId_fkey` (66 bytes), corrigida para `ExperimentalIHFRInput_measurement_fkey` (38 bytes).
- Somente nomes físicos e expectativas relacionadas foram alterados; colunas, ordem, unicidade, predicados, cardinalidade e estratégia de consulta foram preservados.
- O gate pré-banco aprovou `git diff --check`, `prisma format`, `prisma validate`, `prisma generate`, `tsc --noEmit`, testes estáticos, busca de nomes antigos e secrets. A auditoria encontrou 66 identificadores explícitos, todos ASCII, sem duplicidade, com máximo de 62 bytes.
- Antes da rodada PostgreSQL, `DATABASE_URL` respondeu a `SELECT 1` e havia zero schemas `imp006_test_*`.
- A rodada combinada aprovou novamente banco vazio, legado, finitude e os quatro testes estáticos. A verificação estrutural comprovou os 15 nomes de índices, unicidade dos nomes, limite de 63 bytes e ausência de predicados parciais antes de falhar na primeira comparação de colunas.
- Novo bloqueio determinístico de T022: código `ERR_ASSERTION`; o driver retornou a coluna agregada PostgreSQL como texto `"{diagnosisId}"`, enquanto o teste esperava o array JavaScript `["diagnosisId"]`. A migration não emitiu erro PostgreSQL, mas a ordem completa das colunas, unicidade dos índices, triggers e zero backfill não foram todos alcançados pela asserção corrente; T022 permanece aberta e não houve repetição automática.
- O teardown da rodada foi confirmado: zero schemas `imp006_test_*` antes da inspeção final, zero removidos e zero restantes. Nenhuma alteração foi aplicada em `public`.

## Validações humanas

| Validação | Estado |
|---|---|
| Revisão do professor Fábio e especialistas | `NAO_VERIFICADO` (`VALIDACAO_POSTERIOR`) |
| Vetores científicos aprovados | `NAO_VERIFICADO` (`VALIDACAO_POSTERIOR`) |
| Calibração | `NAO_VERIFICADO` (`VALIDACAO_POSTERIOR`) |
| Testes de campo | `NAO_VERIFICADO` (`VALIDACAO_POSTERIOR`) |

Essas pendências não bloqueiam a implementação experimental rotulada e bloqueiam promoção científica definitiva.
