# Checkpoint de continuidade — fluxo integral pela interface

**Registro histórico de 2026-09-25:** os estados abaixo pertencem ao checkpoint original. Consulte a seção 12 do [relatório de validação](validation-report.md) para o estado e os gates de 2026-09-26.

## Estado protegido

- Data: 2026-09-25.
- Branch: `007-ihfr-evolution`.
- Código sob validação: `25756b09ec81431c898940a3c99918dd66df2ad6`.
- Checkpoint inicial vazio: `229550202d67d9b5887360c24eb604fe68233416`.
- Motivo do checkpoint vazio: após `git fetch`, `HEAD` e
  `origin/007-ihfr-evolution` coincidiam em `25756b0`, a árvore estava limpa e
  não havia mudança remota adicional em `docs/validation/` para reconciliar.
- Escopo versionado desta continuidade: somente
  `docs/validation/007-ihfr-evolution/`.

## Destino e isolamento confirmados

`INFORMACAO_FORNECIDA_PELO_RESPONSAVEL`: as branches Neon de desenvolvimento e
E2E estão corretas e configuradas. Nenhuma connection string, credencial ou
`branch_id` foi solicitada ou registrada.

`EVIDENCIA_EXECUCAO`: o processo removeu as variáveis herdadas de banco,
autenticação, servidor e `IMP006_*`, carregou somente `.env.e2e.local` e fixou
`IMP006_DATABASE_VARIABLE=TEST_DATABASE_URL`. O arquivo contém as variáveis
necessárias, a confirmação tem o literal esperado, os alvos normalizados de
desenvolvimento e teste são distintos e `PLAYWRIGHT_BASE_URL` não está definido.

O preflight conectou ao destino de teste em `BEGIN READ ONLY`, confirmou
`transaction_read_only=on`, schema `public`, database conectado com fingerprint
sanitizado `693fe5919fc2` e zero schemas `imp006_test_*`. O contexto persistente
selecionado para esta execução é:

- schema: `public` da branch E2E dedicada;
- fingerprint sanitizado do alvo normalizado: `d116d14859be`;
- servidor: processo Next.js próprio desta execução, ainda não iniciado;
- servidor externo: não permitido e não configurado.

O schema `public` foi escolhido porque pertence ao destino E2E dedicado e
permite conservar o cenário entre sessões. O lifecycle `IMP006_TEST_SCHEMA` não
foi usado: ele remove automaticamente o schema no `finally` e o caminho Neon
isolado continua sujeito a `F-007` sem alteração temporária de implementação.

## Preparação efetivamente executada

O `prisma migrate status` inicial encontrou as oito migrations versionadas
pendentes. `prisma migrate deploy`, com `DATABASE_URL` apontada explicitamente
para a forma direta de `TEST_DATABASE_URL`, aplicou com sucesso:

1. `20260523005224_init`;
2. `20260907120000_unique_laboratory_access_code`;
3. `20260914000100_area_registration_and_membership_roles`;
4. `20260915000100_collection_registration_metadata`;
5. `20260917000100_environmental_measurement_set`;
6. `20260919000100_user_administration`;
7. `20260920000100_ihfr_experimental_diagnosis`;
8. `20260920000100_remove_legacy_is_admin`.

Depois das migrations, o comando oficial `tests/fixtures/auth-users.ts setup`
criou quatro usuários sintéticos allowlisted. A auditoria posterior, novamente
em transação somente leitura, confirmou oito migrations concluídas, quatro
usuários de autenticação e zero laboratórios, áreas, coletas, conjuntos
ambientais e diagnósticos. Nenhum seed ou fixture de domínio foi executado.

## Estado do cenário de interface

- Identificador humano da rodada: `HF007-UI-20260925-2295502`.
- Conta sintética `ACTIVE`: preparada; senha permanece somente no ambiente
  local e não é reproduzida aqui.
- Login: pendente.
- Laboratório: pendente; nome previsto
  `HF007-UI-20260925-2295502 Laboratório`.
- Área, coleta, dados ambientais e diagnóstico: pendentes.

## Retomada segura

Antes de retomar, repetir o preflight somente leitura: remover variáveis
herdadas; carregar apenas `.env.e2e.local`; exigir a confirmação literal;
confirmar fingerprints distintos; forçar
`IMP006_DATABASE_VARIABLE=TEST_DATABASE_URL`; verificar schema `public`; e
recusar qualquer `PLAYWRIGHT_BASE_URL` herdado.

Com esse gate novamente verde:

1. executar `prisma migrate status` com `DATABASE_URL` definida, somente no
   processo filho, a partir da forma direta de `TEST_DATABASE_URL`;
2. se necessário, restaurar apenas a fixture de login com
   `NODE_ENV=test IMP006_DATABASE_VARIABLE=TEST_DATABASE_URL node
   --env-file=.env.e2e.local --import=tsx tests/fixtures/auth-users.ts setup`,
   depois de remover as variáveis herdadas;
3. iniciar um Next.js próprio em loopback, com `DATABASE_URL` derivada de
   `TEST_DATABASE_URL` dentro do processo, sem reutilizar servidor e sem
   `IMP006_TEST_SCHEMA`;
4. continuar pelo nome exclusivo acima e registrar os IDs retornados pela
   aplicação antes de qualquer limpeza.

## Limpeza restrita

Não limpar durante a continuidade. Ao encerrar definitivamente, excluir em
ordem reversa somente diagnóstico/suplemento/operações/eventos, conjunto
ambiental, coleta, área, laboratório e vínculo cujos IDs tenham sido capturados
nesta rodada. Depois, executar `tests/fixtures/auth-users.ts teardown`, que usa
IDs e e-mails sintéticos allowlisted. Recusar limpeza por padrão amplo, por nome
parcial ou no banco de desenvolvimento. As migrations e o schema `public` não
integram a limpeza do cenário.

## Continuidade corretiva local de 2026-09-25

`EVIDENCIA_EXECUCAO_LOCAL`: HEAD `2c63c6749f43542cce4dafbdc452be773fee85fe`, branch `007-ihfr-evolution`. Os cinco documentos do ZIP local eram idênticos à cópia do repositório por SHA-256 antes desta atualização. Os arquivos não rastreados preexistentes foram preservados. O cliente Prisma local foi regenerado; typecheck e testes unitários passaram.

`EVIDENCIA_IMPLEMENTACAO`: o wrapper de PostgreSQL próprio em loopback executou preflight, contrato, migrations, integração e E2E IHFR em schemas descartáveis. O servidor Next.js próprio do E2E e o cluster PostgreSQL local foram encerrados; `test:ihfr:audit` retornou zero schemas candidatos após sucesso e falha tratável. A conexão local `PrismaPg` passou a selecionar `TimeZone=UTC` após reprodução de deslocamento de três horas em `timestamptz`, sem mudar o horário esperado no teste.

`EVIDENCIA_IMPLEMENTACAO`: neste workspace não estão presentes `.env.e2e.local` nem variáveis de banco/conta E2E. O preflight do checkpoint Neon, a consulta ao `public`, a reconfirmação dos quatro usuários sintéticos e a inspeção do cenário `HF007-UI-20260925-2295502` têm estado `NAO_EXECUTADO`. Nenhum servidor, fixture, migration, schema ou registro remoto foi criado/removido nesta rodada. Não reutilizar automaticamente os fingerprints/contagens anteriores como prova do destino atual.

O novo runner `npm run test:e2e:ihfr:full-ui` exige destino direto, confirmação, alvo de desenvolvimento distinto, conta sintética e run ID `HF007-UI-*`; verifica `prisma migrate status` e recusa por leitura o nome exato de laboratório já existente antes de iniciar servidor próprio em loopback. Para retomar o cenário histórico, primeiro consultar somente por leitura se o nome planejado já existe. Se já existir, não executar o teste de criação novamente com o mesmo ID: documentar a continuidade manual desse recurso. O E2E automatizado de criação completa deve usar um run ID exclusivo e registrar a relação com o checkpoint anterior. A retenção de dados de UI em `public` é intencional; `test:ihfr:audit` lista apenas schemas descartáveis e nunca limpa o cenário persistente.

## Checkpoint Neon E2E posterior — 2026-09-25

`FATO_DOCUMENTADO` — origem: instrução do responsável nesta conversa após a parada inicial. O primeiro endpoint é DEV, o segundo é E2E, e foi autorizada a derivação da conexão direta E2E removendo `-pooler` somente do hostname. O `.env.e2e.local` permanece ignorado e contém as configurações locais; não copiar seu conteúdo para docs ou Git. O preflight read-only passou com fingerprints DEV `ea797c501213` e E2E `6903ad2ff1ef`, banco esperado e schema `public`. `prisma migrate status` estava atualizado. A associação a `branch_id` pela Console/API ainda não foi comprovada independentemente.

`EVIDENCIA_IMPLEMENTACAO`: contrato 2/2, integração 107/107, migrations 23/23 e E2E IHFR 6/6 passaram no Neon em schemas isolados. O fluxo full UI passou 1/1 com o run ID final `HF007-UI-a7f1d3d01e434ab0`: laboratório `b46c2813-7e5b-4e99-b6f8-1cdbd849dffd`, área `3fac45bc-9188-4fc9-97f6-584bdb7ced1c`, coleta `2a740c81-f19d-46f6-98a6-76903e156a0e`, diagnóstico inicial `08d23144-e1d0-4b81-9ac6-8e37f7197d37` (0.29), substituto `998829b1-b989-41f3-b795-9a9ccdd28b3c` (0.35). A consulta posterior mostrou o primeiro `SUPERSEDED`, o segundo `REVOKED` e nenhum CURRENT. Os recursos ficam em `public` para revisão.

Tentativas anteriores desta rodada também deixaram recursos sintéticos: `HF007-UI-7f49429ecccc4959` possui apenas laboratório `82a940f9-6d79-4efa-9e5b-d7547551c4cc`; `HF007-UI-8debba7646d2421e` possui laboratório `713cdccc-c820-4182-9b17-1ff2c70b5028`, área `23db89b9-499e-4132-bdd7-126c7d7c26c4`, coleta `4ffcf1ea-d801-405b-8082-7576602bf87e` e diagnóstico `4e625bb0-9605-40a2-9361-0a6e2ec0156b` ainda `CURRENT`. Não reutilizar esses run IDs no teste de criação; consultar o estado antes de qualquer ação manual. A consulta ao `public` atual não encontrou `HF007-UI-20260925-2295502`; seu checkpoint histórico permanece inalterado.

`EVIDENCIA_IMPLEMENTACAO`: a auditoria read-only encontrou `imp006_test_bce92440f0134780b9fcee23facfbeda` com marcador esperado, mas a autoria é `NAO_ESPECIFICADO` para esta rodada. A regra do harness proíbe removê-lo sem prova de criação aqui; nenhum schema foi removido manualmente. Todos os processos Next/Playwright próprios encerraram. Unitários 218/218, typecheck, lint com zero erros/quatro avisos preexistentes e build passaram no diff final. O arquivo local ficou preparado com novo run ID ainda não executado, `HF007-UI-c7c839d4168f4188`, para evitar reutilizar o cenário concluído. A prova independente endpoint → `branch_id` e a validação científica permanecem pendentes.

## Continuidade após revalidação do remoto — 2026-09-26

`EVIDENCIA_EXECUCAO`: código testado `c6e43026f7946bb37f207402986b5df2077657c1` após fast-forward e checkpoint local vazio `1158a0d020059ef479517e9d66923b1762f99583`. Esta execução usou **outro** alvo E2E direto, fingerprint `d116d14859be` (DEV `ea062c117670`), ambos confirmados distintos. Não transplantar conclusões de presença/ausência entre estes fingerprints. `.env.e2e.local` continua ignorado; não há URLs ou credenciais neste checkpoint.

No `public` deste E2E, a coleta histórica `f6e56569-a4c2-47e4-bc8d-c31311e0f344` e o diagnóstico `f98c2b71-cdc8-4992-b949-07681c54055c` permanecem íntegros e CURRENT. A UI reabriu ambos após reload/histórico, com 0.29 e metadados completos. A nona migration `20260926000100_ihfr_lifecycle_reference_integrity` foi a única aplicada após quatro verificações de consistência iguais a zero. Auditoria final: nove migrations, três triggers habilitados, zero schemas temporários.

Novo run `HF007-UI-20260926-c6e4302` preservado no `public`: laboratório `214be8a8-769f-4a40-956e-2a8cd83e4771`, área `c25e7077-0803-4b00-9261-c9fcfb2db1ba`, coleta `5d2b6340-f8d3-4922-abad-68b13b1011cc`, medição `f6e111f0-3fe3-4f95-a889-777106937a0f`, diagnóstico CURRENT `ad6ad25c-a48d-4708-9d8c-aebfe4541474`. O runner criou os quatro primeiros recursos e expirou na confirmação visual da medição; a continuação controlada criou uma única vez o diagnóstico e comprovou 0.29, reload e histórico. **Não** repetir a criação com esse run ID nem limpar por nome parcial. REPLACE/REVOKE não ocorreram neste cenário.

Para retomar, refazer preflight no E2E direto atual, conferir os IDs acima por leitura antes de escrever, usar novo run ID para repetir o teste integral e manter `public` intocado até decisão explícita sobre esses IDs. Os servidores próprios desta rodada foram encerrados. O relatório registra F-010 (runner vermelho) e F-011 (audit de dependências), que impedem declarar o merge pronto; a prova independente de `branch_id` e a validação científica seguem externas.
