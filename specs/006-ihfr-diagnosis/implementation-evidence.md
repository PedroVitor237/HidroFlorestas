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

### Conclusão de T022 na cadeia integrada com a IMP-009

- A normalização foi implementada como função reutilizável no harness: aceita tanto `string[]` quanto a representação textual de arrays PostgreSQL retornada pelo driver, valida o envelope e rejeita valores malformados. A comparação estrutural deixou de depender da representação específica do driver sem alterar a migration.
- O preflight passou a comprovar a ordem lexicográfica publicada `user_administration` → `ihfr_experimental_diagnosis` → `remove_legacy_is_admin`. As migrations foram aplicadas nessa ordem nos cenários isolados; nenhuma migration publicada foi renomeada ou reescrita.
- Primeira rodada integrada: 8/9 testes passaram. A falha restante, PostgreSQL `42703`, era da fixture, que tentava inserir a coluna histórica `isAdmin` depois da migration que a remove. O catálogo foi consultado após a falha e confirmou zero schemas `imp006_test_*` residuais.
- Correção focal: as dependências legadas do terceiro cenário passaram a ser inseridas antes de `remove_legacy_is_admin`; a remoção continua ocorrendo antes das asserções do diagnóstico. Schema, migrations e dados de produto não foram alterados.
- Repetição integrada autorizada: 9/9 testes passaram. Foram comprovados banco vazio, preservação de uma linha legada, zero backfill experimental, constraints de score, cinco tabelas experimentais, constraints requeridas, 19 FKs `RESTRICT`, 15 índices com colunas/ordem/unicidade corretas, ausência de predicados parciais, nove triggers esperados e nomes PostgreSQL dentro de 63 bytes.
- A cardinalidade N:1 do suplemento, `UNIQUE(collectionDataId,payloadHash)`, ausência de `UNIQUE(inputSupplementId)`, ponteiro vigente único, ledger idempotente e triggers append-only permaneceram cobertos pelas asserções estruturais existentes. Triggers não foram desabilitados e nenhum teste destrutivo usou `public`.
- Inspeção final do catálogo após a rodada verde: zero schemas `imp006_test_*` residuais. T022 foi concluída somente após esse resultado.

### Fixtures e lifecycle — T024–T030

- Fixtures separadas cobrem seis usuários (OWNER, ADMIN contextual, MEMBER, sem vínculo, conta inativa e vínculo revogado representado pela ausência do vínculo vigente), dois laboratórios ativo/inativo, duas áreas, quatro coletas confirmadas/não confirmadas/próprias/cruzadas e conjuntos ambientais presente/ausente.
- O papel global de todos os atores contextuais permanece `User.role=USER`; somente `ResearchersLinked.role` concede OWNER/ADMIN/MEMBER no laboratório. Nenhuma fixture restaura ou escreve `User.isAdmin`.
- Estado de domínio: um suplemento válido reutilizado por três diagnósticos; projeções CURRENT, SUPERSEDED e REVOKED; quatro operações terminais, incluindo insuficiência; eventos com evidência restrita; candidatos inválido/ausente e conflito de idempotência sem persistir linha ilegal.
- Vetores técnicos registram os sete enums, limites de declividade/percentuais, opcionais conhecidos ausentes, campos/enums desconhecidos e versões histórica/ativa. São `TECHNICAL_CONTRACT_VECTOR`, não validação científica.
- Primeiras tentativas do smoke detectaram somente falhas estruturais de fixture antes do domínio: owner criado fora da mesma transação diferível (`IMP003_OWNER_INVARIANT`), placeholders não utilizados (`42P18`) e score sem casts distintos (`42P08`). Cada causa foi corrigida no harness/fixture; schema e migrations não foram alterados.
- Smoke final PostgreSQL: 2/2 testes passaram. Contagens dentro do schema: 6 usuários, 2 laboratórios, 1 suplemento, 3 diagnósticos, 1 ponteiro vigente, 4 operações e 3 eventos. A segunda execução injetou `INJECTED_FIXTURE_FAILURE` depois do setup e confirmou propagação da falha com teardown em `finally`.
- Inspeção final externa do catálogo: zero schemas `imp006_test_*` residuais. Os dois processos de teste terminaram; nenhum servidor foi iniciado. Triggers permaneceram ativos e nenhum cenário usou o schema `public`.

### Shells estruturais — T031–T040

- Foram criados tipos públicos fechados com `PublicDiagnosis.areaId` obrigatório; constantes de versões/hash/rótulos/capacidades; interfaces de store, relógio e transação; shells fail-closed do manifesto, avaliador, parser, HTTP e serviço.
- As seis operações contextuais possuem módulos `route.ts` compiláveis sob laboratório → área → coleta. Enquanto os testes RED ainda não definem o comportamento, respondem deliberadamente `501 NOT_IMPLEMENTED` com `Cache-Control: no-store`; nenhum shell concede autorização ou persiste dados.
- `npm run typecheck`: código 0. ESLint focal: zero erros e 21 warnings esperados de parâmetros ainda não usados nos shells. `git diff --check`: código 0.
- Não há import ou dependência da administração global; nenhum `isAdmin`; tipos internos de store/manifesto não fazem parte de `PublicDiagnosis`.

### RED da consulta — T041–T047

- `npm run typecheck`: código 0 antes da execução; imports, schema, client e fixtures permaneceram válidos.
- Execução focal Node: 1/5 conjuntos passou (autorização contextual de leitura ativa/inativa) e 4/5 falharam pelo comportamento deliberadamente ausente: parser contextual, projeção de ciclo e remoção do `501` nas rotas current/detail. Nenhuma falha foi de compilação ou infraestrutura.
- O E2E focal não possui `IMP006_E2E_COLLECTION_URL` autenticada configurada. Após liberar somente a inicialização do Chromium fora do sandbox, concluiu com `1 skipped`; não foi contado como PASS. A primeira tentativa sem permissão ampliada falhou na inicialização do sandbox do Chromium e não foi tratada como RED do produto.
- A topologia real do App Router usa `src/app/(private)/dashboard/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/page.tsx`; T057 será aplicada nesse caminho canônico, sem criar página duplicada.

### Implementação de leitura e GREEN focal — T048–T058

- Serviço Prisma resolve laboratório → área → coleta e somente modelos experimentais; diagnóstico legado não é fallback. Autorização reconsulta conta/vínculo contextual e permite leitura em laboratório inativo.
- Projeção allowlist deriva `areaId` do contexto validado, deriva CURRENT/SUPERSEDED/REVOKED de ponteiro/eventos e omite ator, chaves, hashes internos, payload ambiental e evidência.
- GET current/detail removem o `501`, autenticam no servidor, uniformizam 401/404/500 e usam `Cache-Control: no-store`.
- Página canônica da coleta recebeu resumo responsivo/read-only com os quatro rótulos e estado de ausência, sem controles de escrita.
- Typecheck: código 0. Testes focais Node: 5/5 PASS. ESLint focal: zero erros e warnings apenas nos shells de escrita ainda não implementados.
- T059–T064 foram consolidadas no checkpoint abaixo; o E2E continua pendente de revalidação final em T116 porque a execução focal permaneceu `SKIP`, não `PASS`.

### Checkpoint independente da consulta — T059–T064

- Integração PostgreSQL em schema isolado: 3/3 PASS. Foram exercitados fixtures de atores/contextos, diagnóstico CURRENT e legados SUPERSEDED/REVOKED, contexto cruzado, vínculos ausente/revogado e leitura contextual em laboratório inativo. A falha injetada propagou o erro e o teardown em `finally` passou.
- Inspeção externa pós-execução: zero schemas `imp006_test_*`. Triggers não foram desabilitados, o schema `public` não recebeu fixtures IMP-006 e nenhum segredo ou URL de banco foi registrado.
- Handlers current/detail passaram a aceitar dependências injetáveis. Contexto inválido agora compartilha o envelope 404 indistinguível; as rotas do App Router continuam exportando somente o método HTTP.
- Testes focais Node finais: 8/8 PASS, cobrindo autenticação encaminhada, contexto server-derived, ausência, lifecycle, DTO allowlist, privacidade, semântica acessível e ausência de controles de escrita. `PublicDiagnosis.areaId` permanece obrigatório e é projetado do contexto validado, não de payload do cliente.
- Privacidade/minimização: o corpo público não contém `actorUserId`, identidade do produtor/revisor, idempotency key, request/payload hash interno, payload ambiental, evidência, ledger/eventos internos, SQL ou campos fora da allowlist. Contextos cruzados e acesso sem vínculo retornam o mesmo 404.
- Laboratório inativo: OWNER, ADMIN contextual e MEMBER com vínculo atual mantêm permissão READ; a superfície entregue é estritamente read-only, sem criar/substituir/revogar. As rotas de escrita ainda estão fail-closed (`501`) e serão revalidadas após T083 e T096–T098.
- Automação de acessibilidade: PASS para região nomeada, hierarquia `h2`, listas de descrição `dl/dt/dd`, quatro rótulos em texto, estado de ausência sem score/classe inventados e ausência de botões de escrita. A suíte Playwright também contém verificações de teclado, overflow em 320/768/1280 e conteúdo textual, mas elas não executaram sem a fixture E2E isolada.
- Revisão humana com leitor de tela: `NAO_VERIFICADO`.
- E2E focal: 2 SKIP, não PASS. Foram inspecionados `playwright.config.ts`, scripts do `package.json`, cookie `auth_token` assinado, helpers administrativos e suítes das IMPs 003/004/005/007/008/009. A infraestrutura existente persiste fixtures E2E no schema `public` e não fornece `IMP006_E2E_COLLECTION_URL`, `IMP006_E2E_ABSENT_COLLECTION_URL`, `IMP006_E2E_INACTIVE_COLLECTION_URL` e `IMP006_E2E_ACTOR_ID` associados a um schema isolado visível pelo servidor. Reutilizá-la violaria o isolamento da IMP-006; o E2E fica explicitamente pendente para T116.
- Gates locais: `npm run typecheck` PASS; `git diff --check` PASS; nenhum processo Next, Playwright ou teste IHFR permaneceu ativo. O arquivo local `specs/005-environmental-collection-data/coverage-review.md` permaneceu intocado e fora do Git; `docs/raw/**` não mudou.

## Validações humanas

### RED unitário inicial da US2 — T065–T068

- Quatro arquivos definem o comportamento esperado de manifesto ativo/histórico e hashes exatos, parser fechado CREATE/REPLACE, avaliação determinística, precisão/drivers, ausência opcional conhecida e rejeição de campos/enums desconhecidos.
- `npm run typecheck`: PASS; portanto o RED não decorre de import, tipos, Prisma Client, schema ou fixture.
- Execução focal: 0/4 arquivos PASS e 4/4 FAIL pelos shells deliberadamente não implementados (`IHFR_MANIFEST_LOADER_NOT_IMPLEMENTED`, `IHFR_REQUEST_PARSER_NOT_IMPLEMENTED` e `IHFR_EVALUATOR_NOT_IMPLEMENTED`). Este RED não foi enfraquecido nem recebeu implementação antecipada.
- T069 é a primeira tarefa pendente; T076 permanece aberta até a matriz T065–T075 estar definida e executada.

### RED de elegibilidade — T069

- A autoridade foi reconciliada entre OpenAPI 3.1, spec, schema do suplemento e ADR-0001: elegibilidade é GET contextual, recebe somente `landUseType` opcional na query, retorna `400 INVALID_REQUEST` para query/categoria malformada e mantém ausência válida como outcome `INSUFFICIENT_DATA`.
- A matriz possui 10 casos: sessão ausente/inválida; 404 indistinguível para vínculo ausente/revogado e contexto cruzado; OWNER/ADMIN contextual/MEMBER; laboratório inativo somente leitura; sete enums exatos; aliases/caixa/OTHER/OTHERS/extra/duplicado; UUID malformado; cinco causas de insuficiência; versão incompatível; e ausência de efeitos colaterais.
- Foi criada somente uma factory estrutural injetável ainda fail-closed; a rota continua respondendo `501` e nenhum comportamento de T091 foi antecipado.
- Execução focal PostgreSQL: 1/10 PASS estrutural (contagens antes/depois idênticas para suplemento, diagnóstico, ponteiro, operação, evento, conjunto ambiental, coleta, área, laboratório e vínculo) e 9/10 RED comportamental exclusivamente pelo `501` esperado.
- Migration, fixtures, cliente PostgreSQL e teardown concluíram; nenhum trigger foi desabilitado e o schema isolado foi removido em `finally`.
- T070 é a primeira tarefa pendente. T076 permanece aberta.

### RED de CREATE/REPLACE — T070

- A matriz possui 10 grupos e cobre sessão, vínculo/contexto, OWNER/ADMIN contextual, MEMBER, laboratório inativo, CREATE ausente/null, parser fechado e chave UUID, CURRENT existente, REPLACE e IDs esperados conflitantes, oito causas de insuficiência, oito incompatibilidades e rollback em sete pontos.
- Foi adicionada somente uma factory estrutural injetável ainda fail-closed; POST diagnoses continua em `501` e nenhum comportamento T083–T095 foi implementado.
- Execução focal PostgreSQL: 1/10 PASS estrutural e 9/10 RED comportamental pelo `501`. O caso estrutural preservou contagens de suplemento, diagnóstico, ponteiro, operação e evento após falhas injetadas depois de suplemento/operação/diagnóstico, antes/depois do ponteiro, antes do evento e durante a resposta terminal.
- TypeScript, migration, fixtures e SQL permaneceram válidos; teardown removeu o schema isolado em `finally`, sem desabilitar triggers ou usar `public`.
- T071 é a primeira tarefa pendente. T076 permanece aberta.

| Validação | Estado |
|---|---|
| Revisão do professor Fábio e especialistas | `NAO_VERIFICADO` (`VALIDACAO_POSTERIOR`) |
| Vetores científicos aprovados | `NAO_VERIFICADO` (`VALIDACAO_POSTERIOR`) |
| Calibração | `NAO_VERIFICADO` (`VALIDACAO_POSTERIOR`) |
| Testes de campo | `NAO_VERIFICADO` (`VALIDACAO_POSTERIOR`) |

Essas pendências não bloqueiam a implementação experimental rotulada e bloqueiam promoção científica definitiva.
