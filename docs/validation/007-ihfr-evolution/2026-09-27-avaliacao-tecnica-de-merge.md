# Avaliação técnica para merge da 007 — 2026-09-27

## Plano e recorte da rodada

- Identificador: `007-avaliacao-merge-2026-09-27`; estado do plano: `CONCLUIDO`, com gates técnicos pendentes. Objetivo: testar o HEAD remoto, auditar o E2E e emitir vereditos para `007-ihfr-evolution → development`.
- Escopo de edição: somente este relatório em `docs/validation/007-ihfr-evolution/`. Não houve mudança de produção, teste, runner, migration, configuração, dependência ou versão no checkout; não houve merge. Uma cópia por `git archive` em `/tmp` recebeu `npm ci` das versões **já travadas** para executar os gates; artefatos e logs dessa cópia não foram versionados.
- Fontes: solicitação desta rodada, `AGENTS.md`, `PLANS.md`, constituição, ADR-0001, [checklist técnico](end-to-end-checklist.md), [saneamento A1–A7](2026-09-26-saneamento-a1-a7.md), [retomada A3–A5](2026-09-27-retomada-a3-a5.md), código/testes/migrations do HEAD e observações desta execução. Os relatórios anteriores são históricos por HEAD, lockfile e destino. O ADR rege o contrato experimental; os testes provam somente comportamento técnico.
- Estado inicial: `007-ihfr-evolution@4348fd9ad385335bbb00995666376a53596415a4`, worktree e staging limpos, igual a `origin/007-ihfr-evolution` após `git fetch`; `origin/development@100351e07d9f89f34ebb0ea4de17b526297d6350`. Merge-base: `100351e`. Nenhuma alteração preexistente rastreada. O commit posterior ao relatório de 27/9 é `4348fd9`, que só ajusta a mensagem para URL inválida no runner HTTPS; `38cab4c` registrou o relatório, `a48d6fb` alterou testes/runners, e `89a2e57` alterou dependências/lockfile.
- Riscos e pontos de parada: destino E2E incorreto, escrita em DEV/históricos, fixture com teardown amplo, capacidade de cinco laboratórios, concorrência, resíduos de schema e falha de browser/build. A escrita só começou após a verificação read-only abaixo. A revisão final abrangeu diff, segredos, recursos, gates e remoto. Responsável por corrigir runner/ambiente e decidir merge: não especificado.
- Histórico do plano: aberto com Git limpo; preflight read-only confirmou destino e conta 3/5; testes executados em cópia temporária do HEAD; full UI persistiu dois cenários e terminou vermelho; suites isoladas passaram e limpeza foi auditada; vereditos abaixo encerram a análise sem aprovar merge.

## Identidade, isolamento e efeitos antes da escrita

`EVIDENCIA_IMPLEMENTACAO`: em processo sem variáveis herdadas de banco/servidor, `.env.e2e.local` ignorado foi carregado sem imprimir valores. O seletor direto E2E produziu fingerprint sanitizado `d116d14859be`; DEV, `ea062c117670`. São identidades normalizadas diferentes; o E2E conectou ao banco esperado, schema `public`, em `BEGIN READ ONLY` com `transaction_read_only=on`. `PLAYWRIGHT_BASE_URL` externo estava ausente; o full UI iniciou Next próprio em `127.0.0.1` e o encerrou. Não houve conexão, migration ou limpeza no endpoint histórico `568d60469278`, nem escrita em DEV. A confirmação operacional anterior da equipe identifica DEV/E2E; prova independente endpoint → `branch_id` pela Neon Console/API continua `NAO_ESPECIFICADO` nesta rodada.

Antes da escrita, havia nove migrations concluídas no E2E, inclusive a inicial histórica ignorada no Git; as oito migrations versionadas tinham checksum igual aos oito arquivos do HEAD. `prisma migrate status` no **E2E** saiu 0, `Database schema is up to date!`. Uma primeira invocação manual de *status*, somente leitura, apontou por erro do wrapper temporário para DEV e informou oito migrations pendentes **naquele destino**; o seletor foi corrigido antes de qualquer escrita. Não houve `migrate deploy`, seed, reset ou fixture de autenticação em `public`.

O inventário inicial read-only encontrou três laboratórios, três áreas, três coletas, três medições, quatro diagnósticos, zero schemas temporários gerenciados e zero outras sessões ativas naquele instante. A conta `ACTIVE` de ID fixo e domínio `.invalid` da fixture `auth-users.ts` estava autorizada nos relatórios, tinha senha de teste compatível e **3/5 vínculos**. As outras três contas fixas estavam `PENDING`, `BLOCKED` e `INACTIVE`. Outras contas `.invalid` existentes não foram tratadas como autorizadas: a senha do ambiente não coincidia com elas e não havia procedimento de seleção aprovado. O resultado 5/5 da [retomada anterior](2026-09-27-retomada-a3-a5.md) pertence ao destino `6903ad2ff1ef`, não a este E2E `d116d14859be`.

`EVIDENCIA_IMPLEMENTACAO`: o full UI não chama `auth-users.ts setup/teardown`; cria somente recursos de domínio pela interface e os preserva em `public`. O `setup` da fixture fixa faria upsert de quatro contas, alterando senha/status, e o `teardown` apagaria as quatro por ID/e-mail. Por isso não foram executados em `public` com dados históricos. Migrations, contrato, integração e IHFR isolado criam schemas com marcador e `finally` de descarte; a auditoria read-only final confirmou zero candidatos `^imp00[34569]_test_`. Nenhum laboratório foi apagado ou desativado para liberar capacidade.

## Lockfile e gates no HEAD

`EVIDENCIA_IMPLEMENTACAO`: SHA-256 efetivo do `package-lock.json` do HEAD e da cópia testada: `dc2511c8cf67f06ce985eba30e2d11d1e4a10eb371fdf4b5e210170867785d32`. O blob é idêntico de `89a2e57` a `4348fd9`. O hash textual `85C8...` do relatório A3–A5 não corresponde aos bytes versionados desses commits; a causa da divergência documental não foi determinada. O `node_modules` preexistente no checkout continha Next 16.1.6 e Playwright 1.51.1 e era inválido para o lockfile; **não** foi usado. Na cópia em `/tmp`, Node 24.19.0 executou `npm ci --no-audit --no-fund` com sucesso, Next 16.3.6, Prisma/Client 7.4.2 e Playwright 1.55.1. O Chromium exigido pelo Playwright foi baixado somente para `/tmp` após a primeira tentativa abortar antes do navegador.

| Gate no HEAD/lockfile acima | Resultado desta rodada | Limite |
|---|---|---|
| `prisma validate`, `prisma generate`, `prisma migrate status` E2E | PASS; oito versionadas em dia, nove linhas aplicadas no destino | Nenhuma migration aplicada nesta rodada. |
| `npm run test:migration` via runner oficial E2E | **26/26 PASS**, primeira execução, 89.455 s | A falha histórica 25/26 não se reproduziu; causa exata histórica segue indeterminada. Log sanitizado em `/tmp/hidroflorestas-imp006-gate-hXgdQk/migration.log`. |
| `npm run test:contract` via runner oficial E2E | **2/2 PASS**, 19.337 s | Schema temporário. |
| `npm run test:integration` via runner oficial E2E | **107/107 PASS**, 416.936 s | Schema temporário; sem falha ou retry. |
| `npm run test:e2e:ihfr` via runner oficial E2E | **6/6 PASS**, servidor próprio encerrado | Schema temporário removido. |
| `npm run test:unit`, `npm run typecheck`, `npm run lint` | PASS: 64 testes reportados pelo Node nesta execução, typecheck sem erro, lint 0 erros/4 avisos conhecidos | Não equiparar a contagem 226 do relatório anterior sem reconciliar a forma de contagem dos runners. |
| `npm audit --omit=dev --json`, `npm audit --json` | Ambos exit 0, **zero nós sinalizados** no momento da consulta | Não é atestado permanente nem inspeção do artefato implantado. |
| `npm run build` padrão | FAIL no sandbox ao obter Poppins; repetição com rede FAIL por `Operation not permitted (os error 1)` quando Turbopack tentou criar processo/porta em `leaflet.css` | Limitação deste ambiente; não há defeito de código demonstrado por esse erro. |
| `npm run build -- --webpack` diagnóstico, sem editar arquivos | **PASS**; compilação, typecheck e 19 páginas estáticas | Confirma compilação com Webpack, mas não torna verde o gate padrão Turbopack. |
| Playwright geral e HTTPS oficiais | **NÃO EXECUTADOS neste HEAD** | O procedimento versionado de regressão local usa cluster PostgreSQL próprio via PowerShell/Windows; neste Linux não havia `postgres`/`pg_ctl`, e Docker negou acesso ao daemon mesmo após tentativa autorizada. O runner HTTPS exige zero usuários da allowlist antes do setup; o E2E `public` contém quatro contas e seu teardown afetaria dados preservados. A suite geral também usa fixtures em `public`; não foi apontada a ele. Os 55/55 e 2/2 de 27/9 são evidência histórica, não gate desta rodada. |
| Full UI oficial no E2E `public` | **0/1 nas duas execuções com navegador**; detalhes abaixo | O fluxo persistido avançou mais que o resultado do runner. Não há aprovação 1/1 no lockfile atual. |
| Auditoria `assert-zero` e SQL final `BEGIN READ ONLY` | PASS: zero schemas gerenciados, oito checksums versionados iguais, nenhuma sessão ativa concorrente no instante final | Os recursos `public` dos dois run IDs foram preservados. |

## Full UI e vetor independente

O [checklist §2](end-to-end-checklist.md#2-vetor-técnico-do-cenário-feliz) calcula o vetor **sem chamar o avaliador** a partir do manifesto `ihfr-math-experimental-v0.1.1`: W=.20, S=.20, V=.15, T=.60; `(W+S+V+T)/4=.2875`, exibição half-up `.29`, `MODERATE`, `HIGH`, drivers `[T,W]`. `tests/e2e/full-ui-flow.spec.ts` declara essas expectativas literais e compara a resposta real; não usa a resposta do avaliador para construir o esperado. É referência técnica independente do código de cálculo, **não** vetor científico validado.

1. `HF007-UI-MERGE-20260927-4348fd9-01`: o primeiro disparo parou em 3,210 ms antes de abrir Chromium (binário ausente), sem recursos. Após instalar o binário travado em `/tmp`, a execução com navegador criou laboratório `bb119261-194a-4940-83cf-47ab3a311703`, área `4de389f2-d8a5-4cf4-99ff-860dfbfc9050` e coleta `b1462ac0-a2ee-426a-aac4-b38f118e8f3c` (`POST 201`). `expect(page).toHaveURL` expirou em 5 s ainda em `/collections/new`; o snapshot mostrava “Confirmando…”. O SQL read-only confirmou a coleta persistida, zero medições e zero diagnósticos. Duração do gate: **40.772 ms**. O run ID não foi reutilizado.
2. `HF007-UI-MERGE-20260927-4348fd9-02`: com a conta em 4/5, novo run ID criou laboratório `72d9b7c3-6f0f-4855-9eb4-876917b76de7`, área `20deecfa-0fb7-4401-ad04-c2dfe61c45e6`, coleta `f54c1335-5d47-4f96-9714-d3b51fb6cb81` e medição `4ab721b8-df39-4e65-aa34-59733bca3bff`. Passou pelas asserções de CREATE, vetor literal, reload, histórico e REPLACE; o primeiro diagnóstico `8766b88d-37f0-4ba5-af52-e69e3a541afc` tem bruto `.2875`, exibido `.29`, `MODERATE/HIGH`, `[T,W]`; o segundo `f20d71ef-4ba2-4b9d-8424-4330d997cd0a` tem `.35`. O servidor registrou `POST /revocations 200`, mas o Playwright atingiu **180.000 ms** totais em `page.waitForResponse` na revogação (gate **183.367 ms** incluindo processo). O snapshot mostrou “Resultado desconhecido”. Durante esta etapa o Turbopack reportou `No space left on device (os error 28)` no cache de `/tmp`; o Chromium completo baixado nesta rodada foi removido, liberando espaço, sem tocar no headless shell em uso. Não há evidência suficiente para atribuir o timeout especificamente ao disco, à rede ou ao waiter.

`EVIDENCIA_IMPLEMENTACAO`: a auditoria posterior do segundo cenário encontrou uma medição, dois diagnósticos, operações `CREATE_OR_REPLACE`, `CREATE_OR_REPLACE`, `REVOKE` todas `SUCCEEDED`, eventos `CREATED_CURRENT`, `SUPERSEDED`, `CREATED_CURRENT`, `REVOKED` e **zero ponteiro CURRENT**. Logo, a revogação persistiu. O navegador não concluiu suas asserções finais; `FULL_UI_GATE=FAIL/PENDENTE`. Não transferir o full UI verde de 26/9 ou do outro destino para este HEAD/lockfile.

## Vereditos separados e encaminhamento

| Eixo | Veredito | Fundamentação |
|---|---|---|
| Fluxo funcional experimental | **Persistência técnica demonstrada; gate visual pendente** | Login → laboratório → área → coleta → dados → IHFR esperado → reload → histórico → REPLACE foi observado no segundo run; REVOKE 200 e estado final foram confirmados em SQL read-only. A asserção visual após REVOKE não terminou. |
| Gates técnicos | **Parcial** | Migrations, contrato, integração, IHFR isolado, unitários, typecheck, lint e audit verdes; build padrão vermelho neste ambiente; Playwright geral/HTTPS não repetidos; full UI vermelho. |
| Segurança dos dados E2E | **Preservação/isolamento confirmados no alcance observado** | DEV distinto e sem escrita, `public` histórico preservado, nenhum teardown de contas, zero schema temporário final. A conta fixa agora tem 5/5 vínculos e exige preparo controlado para outra execução; prova independente de `branch_id` permanece externa. |
| Prontidão para merge técnico | **NÃO PRONTA** | Exigir full UI 1/1 no HEAD/lockfile final, Playwright geral/HTTPS atuais em destino seguro e build padrão verde em ambiente apto ou evidência equivalente de CI; revisar as falhas do runner abaixo. Nenhuma falha histórica de migration continua bloqueante por si só após 26/26 atual. |

**Defeitos de produção confirmados nesta rodada:** nenhum. **Fragilidades de teste/runner observadas:** asserção de URL da coleta com limite implícito de 5 s após `POST 201`; timeout global de 180 s consumido antes da asserção final da revogação; o runner seleciona somente a conta informada e falha em 5/5. São fatos do código/teste e da execução; a causa exata de cada timeout não foi provada. **Limitações de ambiente/conta:** Chromium inicialmente ausente, `/tmp` esgotado durante full UI, build Turbopack com `EPERM`, ausência de cluster PostgreSQL local acessível e conta fixa agora 5/5. **Causas indeterminadas:** falha histórica 25/26, latência/navegação exata do primeiro run e a razão pela qual `page.waitForResponse` não concluiu apesar do POST 200 no segundo.

`RECOMENDACAO` ao desenvolvedor responsável, **somente documental nesta rodada**:

1. Explicitar nas instruções e no runner o limite de **cinco vínculos de laboratório por conta**. Antes de iniciar navegador/servidor, consultar em modo read-only status, allowlist, credencial disponível, capacidade, conflito de run ID e eventual execução concorrente; registrar a conta por identificador sintético sem expor e-mail/senha. Selecionar apenas conta `ACTIVE` previamente aprovada com vaga.
2. Definir procedimento versionado de preparo de uma **pequena reserva reutilizável** de contas sintéticas E2E ou de branch E2E descartável, com guarda de destino, propriedade, lease, auditoria e limpeza/recriação controlada após revisão. Não acumular contas/recursos a cada run; não excluir/desativar laboratórios históricos para liberar vaga e não usar `auth-users.ts teardown` em `public` histórico. Encaminhar ao responsável pelo ambiente a provisão de conta apta ou ambiente descartável para nova execução; a identidade/autoridade de outras contas `.invalid` não foi estabelecida.
3. Instrumentar o full UI com fases, duração, resposta HTTP e navegação após cada escrita; separar espera pela resposta da espera pela rota/renderização, e rever os limites com evidência de latência remota sem mascarar falhas. Guardar também o log sanitizado **do servidor** junto ao log Playwright e o estado da operação recuperável em timeout. Repetir o gate com run ID novo e capacidade comprovada, sem reutilizar `-01`/`-02`.
4. Providenciar procedimento Linux/CI seguro para Playwright geral e HTTPS sobre banco local/descartável marcado. Investigar o `EPERM` do build padrão no executor; o build Webpack verde é evidência auxiliar. Não aplicar correções de produção ou alterações de teste sem revisão própria.

`PENDENCIA_DE_DECISAO`: a autoridade do ambiente pode fornecer prova Neon endpoint → `branch_id` e aprovar a estratégia de conta/branch E2E reutilizável. Isso não altera retroativamente o isolamento observado. `PD-002`/`G2-SCI`, revisão científica, vetores científicos, calibração e campo são etapas posteriores. O IHFR v0.1 continua `CONTRATO_EXPERIMENTAL`, `VALIDACAO_CIENTIFICA_PENDENTE`, `SUJEITO_A_RECALIBRACAO` e `NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO`; tais etapas não bloqueiam automaticamente o merge **técnico**.

## Logs completos sanitizados dos dois timeouts Playwright

As transcrições abaixo preservam todas as linhas dos logs oficiais `full-ui.log`, removendo apenas códigos ANSI de cor. Destino `d116d14859be`, schema `public`; SQLSTATE: **não houve erro PostgreSQL reportado**; fase, duração e saída estão nas linhas `START/END`. O servidor próprio terminou em ambos os runs; recursos `public` preservados e schemas temporários finais: zero. O erro de disco apareceu no **stdout do servidor**, não no log Playwright salvo pelo runner, e está registrado acima. Os originais sanitizados permanecem em `/tmp/hidroflorestas-imp006-gate-hfXWw8/full-ui.log` e `/tmp/hidroflorestas-imp006-gate-gzkplM/full-ui.log` nesta sessão.

### Run `-01`: navegação da coleta

```text
[2026-09-27T17:54:53.650Z] START phase=full-ui attempt=1 target=d116d14859be schema=public run=HF007-UI-MERGE-20260927-4348fd9-01
stdout:
stdout: Running 1 test using 1 worker
stdout:
stderr: (node:41605) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
stderr: (Use `node --trace-warnings ...` to show where the warning was created)
stderr: (node:41605) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
stderr: (Use `node --trace-warnings ...` to show where the warning was created)
stdout:   ✘  1 tests/e2e/full-ui-flow.spec.ts:8:5 › login creates laboratory, area, collection, measurement and IHFR through the UI (36.5s)
stdout:
stdout:
stdout:   1) tests/e2e/full-ui-flow.spec.ts:8:5 › login creates laboratory, area, collection, measurement and IHFR through the UI
stdout:
stdout:     Error: expect(page).toHaveURL(expected) failed
stdout:     Expected pattern: /\/collections\/[0-9a-f-]{36}$/i
stdout:     Received string: "http://127.0.0.1:33653/dashboard/laboratories/bb119261-194a-4940-83cf-47ab3a311703/areas/4de389f2-d8a5-4cf4-99ff-860dfbfc9050/collections/new"
stdout:     Timeout: 5000ms
stdout:
stdout:     Call log:
stdout:       - Expect "toHaveURL" with timeout 5000ms
stdout:       9 × unexpected value "http://127.0.0.1:33653/dashboard/laboratories/bb119261-194a-4940-83cf-47ab3a311703/areas/4de389f2-d8a5-4cf4-99ff-860dfbfc9050/collections/new"
stdout:
stdout:       41 |   await page.getByRole("button", { name: "Revisar coleta" }).click();
stdout:       42 |   await page.getByRole("button", { name: "Confirmar coleta" }).click();
stdout:     > 43 |   await expect(page).toHaveURL(/\/collections\/[0-9a-f-]{36}$/i);
stdout:          |                      ^
stdout:       44 |   const collectionUrl = page.url();
stdout:       45 |   const collectionId = collectionUrl.match(/collections\/([0-9a-f-]{36})/i)?.[1];
stdout:       46 |   expect(collectionId).toBeTruthy();
stdout:         at /tmp/hf007-merge-validation-4348fd9/tests/e2e/full-ui-flow.spec.ts:43:22
stdout:
stdout:     Error Context: test-results/full-ui-flow-login-creates-e9839-ent-and-IHFR-through-the-UI/error-context.md
stdout:
stdout:   1 failed
stdout:     tests/e2e/full-ui-flow.spec.ts:8:5 › login creates laboratory, area, collection, measurement and IHFR through the UI
[2026-09-27T17:55:34.422Z] END phase=full-ui attempt=1 target=d116d14859be schema=public run=HF007-UI-MERGE-20260927-4348fd9-01 exit=1 duration_ms=40772
```

### Run `-02`: revogação

```text
[2026-09-27T17:59:16.068Z] START phase=full-ui attempt=1 target=d116d14859be schema=public run=HF007-UI-MERGE-20260927-4348fd9-02
stdout:
stdout: Running 1 test using 1 worker
stdout:
stderr: (node:44289) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
stderr: (Use `node --trace-warnings ...` to show where the warning was created)
stderr: (node:44289) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
stderr: (Use `node --trace-warnings ...` to show where the warning was created)
stdout:   ✘  1 tests/e2e/full-ui-flow.spec.ts:8:5 › login creates laboratory, area, collection, measurement and IHFR through the UI (3.0m)
stdout:
stdout:
stdout:   1) tests/e2e/full-ui-flow.spec.ts:8:5 › login creates laboratory, area, collection, measurement and IHFR through the UI
stdout:
stdout:     Test timeout of 180000ms exceeded.
stdout:     Error: page.waitForResponse: Test timeout of 180000ms exceeded.
stdout:
stdout:       132 |   await page.getByLabel("Motivo da revogação").fill("Verificação E2E do ciclo experimental");
stdout:       133 |   await page.getByRole("button", { name: "Revogar diagnóstico" }).click();
stdout:     > 134 |   const revokedResponse = page.waitForResponse(response => response.request().method() === "POST" && response.url().endsWith(`/ihfr-diagnosis/diagnoses/${secondDiagnosisId}/revocations`));
stdout:           |                                ^
stdout:       135 |   await page.getByRole("dialog").getByRole("button", { name: "Confirmar" }).click();
stdout:       136 |   expect((await revokedResponse).status()).toBe(200);
stdout:       137 |   await expect(page.getByText("Nenhum diagnóstico IHFR vigente para esta coleta.")).toBeVisible();
stdout:         at /tmp/hf007-merge-validation-4348fd9/tests/e2e/full-ui-flow.spec.ts:134:32
stdout:
stdout:     Error Context: test-results/full-ui-flow-login-creates-e9839-ent-and-IHFR-through-the-UI/error-context.md
stdout:
stdout:   1 failed
stdout:     tests/e2e/full-ui-flow.spec.ts:8:5 › login creates laboratory, area, collection, measurement and IHFR through the UI
[2026-09-27T18:02:19.435Z] END phase=full-ui attempt=1 target=d116d14859be schema=public run=HF007-UI-MERGE-20260927-4348fd9-02 exit=1 duration_ms=183367
```
