# Checkpoint de continuidade — fluxo integral pela interface

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
