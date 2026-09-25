# Relatório de validação da `007-ihfr-evolution`

## 1. Baseline e método

O HEAD observado em 2026-09-25 foi
`3e6a97bdcaa8b598ee94b3e74c728b9cc104a41a`, igual ao baseline do relatório
anterior. O worktree estava limpo antes das verificações. Nenhuma alteração
preexistente precisou ser preservada.

Antes da continuidade, os quatro relatórios foram revisados quanto a segredos,
URLs de conexão e dados pessoais e receberam o checkpoint local
`498b26fd3355999ede1be1b528c1f186f109631e`. O commit contém somente este
diretório; não houve push.

A análise cruzou o código com FR-001–FR-020, SC-001–SC-008, ADR-0001, TD-015,
TD-016, PD-002 e o pacote Spec Kit em
[`specs/006-ihfr-diagnosis`](../../../specs/006-ihfr-diagnosis/). As 134 tarefas
possuem cobertura nominal no documento de tarefas, mas essa marcação é evidência
histórica e não substitui execução no HEAD.

Classificações usadas:

- `EVIDENCIA_IMPLEMENTACAO`: diretamente observada em código/configuração ou
  reproduzida por comando desta rodada;
- `INFERENCIA`: conclusão derivada de evidências identificadas;
- `RECOMENDACAO`: próximo passo proposto, sem equivaler a decisão da equipe;
- `PENDENCIA_DE_DECISAO`: depende de autoridade ou evidência externa.

## 2. Fluxo completo observado na interface

Os estados abaixo significam implementação por inspeção, não funcionamento
integrado comprovado.

| Etapa | Navegação e componente | Entrada, validação e permissão | API, serviço e persistência | Conclusão e estado |
|---|---|---|---|---|
| Login | `/login`; [`src/app/login/page.tsx`](../../../src/app/login/page.tsx) | E-mail e senha não vazios; credencial válida e usuário `ACTIVE` | `POST /api/auth/sign-in` → `AuthService` → leitura de `User`; cookie de sessão HTTP | Redirecionamento para `/workspace`. **Implementado por inspeção; runtime pendente.** |
| Criar laboratório | `/workspace`; [`LaboratoryWorkspace`](../../../src/components/workspace/laboratory-workspace.tsx) | Nome de 1–100 caracteres; principal autenticado; máximo de cinco vínculos | `POST /api/laboratories` → `LaboratoriesService.create` → transação em `LaboratoryRoom` e `ResearchersLinked`, com papel `OWNER` | Card do laboratório aparece após recarga da lista. **Implementado por inspeção; runtime pendente.** |
| Acessar laboratório | Botão “ACESSAR LABORATÓRIO” → `/dashboard/laboratories/{laboratoryId}` | Vínculo atual; laboratório novo nasce ativo | Layout contextual usa `getLaboratoryContext`; resumo e histórico consultam serviços contextuais | Cabeçalho mostra laboratório, papel e estado. **Implementado por inspeção; runtime pendente.** |
| Cadastrar/selecionar área | Navegação “Áreas” → `/areas`; “Nova área” → `/areas/new`; [`AreaForm`](../../../src/components/areas/area-form.tsx) | OWNER/ADMIN em laboratório ativo; nome, latitude `[-90,90]` e longitude `[-180,180]` obrigatórios; município, UF, tipo de terreno e descrição opcionais | `POST /api/laboratories/{lab}/areas` → `AreasService.create` → `CollectionArea` | Redirecionamento ao detalhe da área. Seleção posterior pela lista de áreas. **Implementado por inspeção; runtime pendente.** |
| Registrar coleta | Detalhe da área → “Registrar coleta” → `/areas/{areaId}/collections/new`; [`CollectionForm`](../../../src/components/collections/collection-form.tsx) | Laboratório ativo; data/hora RFC 3339, fuso explícito e instante não futuro; chave UUID gerada no cliente | `POST /api/laboratories/{lab}/areas/{area}/collections` → `CollectionsService` → `CollectionData` | Resposta 201, `Location` coerente e redirecionamento ao detalhe da coleta. **Implementado por inspeção; runtime pendente.** |
| Informar dados ambientais | Detalhe da coleta → “Ver dados ambientais” → estado vazio → “Registrar dados ambientais” → `/environmental-data/new`; [`EnvironmentalForm`](../../../src/components/environmental-data/environmental-data-form.tsx) | Quatro grupos e 17 campos. Dez obrigatórios; sete opcionais. Conjunto único, imutável e vinculado à coleta. Laboratório deve aceitar escrita | `POST .../environmental-data` → `EnvironmentalDataService.create` → `EnvironmentalMeasurementSet` | Confirmação redireciona ao detalhe e apresenta o conjunto persistido. **Implementado por inspeção; runtime pendente.** |
| Solicitar IHFR | Link “Voltar à coleta”; [`IHFRDiagnosisManagement`](../../../src/components/ihfr-diagnosis/ihfr-diagnosis-management.tsx) no detalhe da coleta | Somente OWNER/ADMIN em laboratório ativo. Usuário escolhe `landUseType`, origem e data da observação; versões/hash são enviados pelo cliente. `slopePercent` e `landUseType` são necessários para elegibilidade | `GET .../eligibility` e `POST .../ihfr-diagnosis/diagnoses` → `IHFRDiagnosisService` → suplemento, diagnóstico, operação, ponteiro corrente e eventos | `SUCCEEDED` cria diagnóstico `CURRENT`; insuficiência não cria diagnóstico. **Implementado por inspeção; runtime pendente.** |
| Consultar e reabrir | O detalhe da coleta lê o diagnóstico no servidor; após escrita a UI consulta `/current`. A atividade “Coleta confirmada” no histórico do laboratório aponta novamente ao detalhe da coleta | OWNER/ADMIN veem gestão; MEMBER vinculado vê somente leitura; laboratório inativo permite leitura | `GET .../current`/`GET .../diagnoses/{id}` → `IHFRDiagnosisService.readCurrent/readDetail` → projeção dos registros persistidos | Score e parte do contrato aparecem após criação/reload. **Parcial:** FR-005/SC-001 não são integralmente renderizados. |

### 2.1 Dados ambientais e suplemento

`EVIDENCIA_IMPLEMENTACAO`: o formulário ambiental não é mock. Ele cobre:

- Água: fonte, nascente, profundidade do poço, disponibilidade e salinidade.
- Solo: textura, infiltração, compactação, erosão e solo exposto.
- Vegetação: cobertura, fragmentação, APP ripária e degradação.
- Terreno: densidade de drenagem, elevação e declividade.

As regras estão em
[`environmental-data.validation.ts`](../../../src/types/environmental-data.validation.ts).
O parser rejeita grupos/campos desconhecidos e ausência dos campos ambientais
obrigatórios. Campos opcionais ausentes são normalizados para `null`.

`slopePercent` é opcional no contrato de captura ambiental, mas obrigatório para
um diagnóstico IHFR suficiente. A interface permite salvá-lo como `null`; a
elegibilidade deve então responder `MISSING_SLOPE_PERCENT`.

O `landUseType` não vem de `CollectionArea.landType` e não integra o conjunto
ambiental. Ele é um suplemento próprio, informado na gestão do diagnóstico junto
com `provenance.kind` e `observedAt`. O serviço consome o payload de
`EnvironmentalMeasurementSet` e esse suplemento no mesmo cálculo.

## 3. Verificações executadas sem banco

Nenhuma das execuções abaixo recebeu variáveis PostgreSQL. Os testes unitários
foram iniciados com `DATABASE_URL`, `TEST_DATABASE_URL`, confirmação e variáveis
`IMP006_*` removidas.

| Verificação | Resultado | Observação |
|---|---|---|
| `git diff --check` | **PASS** | Nenhum erro de whitespace no estado inicial. |
| `npm run typecheck`, antes de gerar | **FAIL** | 11 erros relacionados à administração de usuários e ao Prisma Client local: `revision` e `administrativeAuditEvent` existem no schema/serviço, mas não existiam no client gerado. |
| `prisma generate`, local | **PASS** | Prisma `7.4.2`; gerou somente `src/generated/prisma`, diretório ignorado pelo Git, sem conexão PostgreSQL ou alteração versionada. |
| `npm run typecheck`, depois de gerar | **PASS** | Saída zero; os 11 erros eram causados pelo client local desatualizado. |
| `npm run lint` | **PASS com avisos** | 0 erros e 4 avisos preexistentes de variáveis não usadas. |
| Oito testes unitários IHFR focais | **PASS** | 8 arquivos, 8 processos/subtests, 0 falhas. O teste de política de entrada passa com uma expectativa contrária a FR-012; o verde não aprova essa regra. |
| Vinte testes unitários do fluxo anterior ao IHFR | **PASS** | Autenticação, laboratório, área, coleta, histórico, dados ambientais e UUID; 20 arquivos/subtests, 0 falhas. Dependências persistentes foram simuladas. |
| Probe do avaliador | **REPRODUZIDO** | Entrada completa e ausência opcional: `SUFFICIENT`; ausência de `soil.infiltrationRateMmPerHour`: parser produtor rejeita, mas avaliador isolado retorna `SUFFICIENT`. |
| Renderização estática da consulta | **REPRODUZIDO** | Score, classe, matemática, algoritmo e hash presentes; origem, versões de medição/suplemento, ciclo e datas ausentes. |

Uma tentativa inicial dos dois probes com `tsx --eval` falhou antes da carga da
aplicação porque o CLI tentou abrir um socket IPC bloqueado pelo sandbox
(`EPERM`). Ambos foram repetidos com sucesso por `node --import=tsx`.

### Comandos deliberadamente não executados

- `npm run test:contract`: um teste chama
  `withImp006PostgresqlSchema`, aplica migrations e cria fixtures. O nome do
  script não representa uma suíte sem banco.
- `npm test` e `npm run test:integration`: incluem integração PostgreSQL.
- `npm run test:migration`: cria e remove schemas.
- `npm run test:e2e`, `npm run test:e2e:ihfr` e
  `npm run test:e2e:https`: iniciam aplicação e/ou escrevem fixtures.
- `npm run build`: começa por `prisma generate`, altera artefatos gerados e pode
  avaliar módulos server-side; não foi necessário para esta etapa segura.

### 3.1 Diagnóstico do typecheck

As versões instaladas e resolvidas no lockfile coincidem: `prisma` e
`@prisma/client` `7.4.2`, TypeScript `5.9.3`. O schema atual inclui
`User.revision`, `AdministrativeAuditAction` e `AdministrativeAuditEvent`; o
schema copiado dentro do client gerado localmente antes desta rodada não os
incluía. O diretório inteiro é ignorado por `.gitignore`.

Uma primeira invocação de `env` falhou por ordem incorreta de argumentos antes
de carregar o Prisma. A invocação corrigida usou um valor de datasource não
sensível apenas para satisfazer a configuração, e `prisma generate` concluiu sem
acesso ao banco. O typecheck posterior passou. Assim, `EVIDENCIA_IMPLEMENTACAO`:
os 11 erros não demonstram incompatibilidade efetiva do código nem versões
divergentes; demonstram artefato local stale.

## 4. Reprodução do avaliador

Foi usado um payload válido completo com `landUseType = FOREST`.

| Caso | Resultado normativo esperado | Parser ambiental | Avaliador observado |
|---|---|---|---|
| Completo | `SUFFICIENT` | Aceito | `SUFFICIENT`, raw `0.2627777777777777`, display `0.26`, `MODERATE` |
| Sem `soil.infiltrationRateMmPerHour` | `INSUFFICIENT_DATA` por FR-012 | Rejeitado como campo obrigatório | `SUFFICIENT`, raw `0.25027777777777777`, display `0.25`, `MODERATE` |
| Sem `water.salinityIndicator` opcional | `SUFFICIENT`, com exclusão da média | Aceito e normalizado para `null` | `SUFFICIENT`, raw `0.27152777777777776`, display `0.27`, `MODERATE` |

`EVIDENCIA_IMPLEMENTACAO`: o defeito interno do avaliador está reproduzido.
Também está demonstrado que o fluxo normal de criação ambiental rejeita a
ausência obrigatória antes da persistência. Portanto, o impacto no happy path da
interface não foi reproduzido; ele depende de payload armazenado fora desse
produtor validado, corrupção, legado incompatível ou outro escritor.

## 5. Configuração e possível liberação de banco

Foi feita leitura local sanitizada de nomes/presença em `.env.e2e.local`, sem
exportar ou imprimir valores:

- `DATABASE_URL`, `TEST_DATABASE_URL`, confirmação, `JWT_SECRET` e senha E2E:
  presentes;
- confirmação: igual ao literal exigido;
- ambos os URLs: PostgreSQL e Neon;
- identidades normalizadas de host/porta/database: distintas;
- `PLAYWRIGHT_BASE_URL`, `IMP006_DATABASE_VARIABLE`, `IMP006_TEST_SCHEMA`, flags
  locais e `NODE_ENV`: ausentes.

Isso demonstra coerência estrutural, não identidade de branch Neon.

### Cadeia do runner IHFR quando controlada

Com processo limpo e `IMP006_DATABASE_VARIABLE=TEST_DATABASE_URL` forçado:

1. o lifecycle escolhe `TEST_DATABASE_URL` e cria schema aleatório
   `imp006_test_<uuid>`;
2. baseline, migrations e fixtures usam a mesma conexão e schema;
3. o runner cria e possui um servidor Next.js em loopback, substitui
   `DATABASE_URL` por `TEST_DATABASE_URL` e transmite o schema;
4. o Prisma seleciona `TEST_DATABASE_URL` pelo mesmo seletor e exige o schema
   allowlisted;
5. Playwright recebe o `baseURL` criado pelo runner, sem servidor externo;
6. o probe E2E consulta `TEST_DATABASE_URL` e o mesmo schema;
7. o lifecycle verifica marcador de propriedade e remove apenas esse schema.

Assim, a inconsistência observada quando o seletor é `DATABASE_URL` pode ser
eliminada por ambiente controlado, sem alteração versionada. Porém, o runner faz
`CREATE SCHEMA` como primeira operação após conectar; ele não comprova antes da
escrita que o endpoint pertence à branch Neon de teste.

### Preflight somente leitura executado

O processo removeu explicitamente variáveis herdadas de banco, autenticação,
servidor e `IMP006_*`, carregou apenas `.env.e2e.local` e forçou
`NODE_ENV=test` e `IMP006_DATABASE_VARIABLE=TEST_DATABASE_URL`. A primeira
tentativa foi impedida pelo DNS do sandbox antes da autenticação; a repetição
com acesso de rede autorizado concluiu.

Evidências sanitizadas de configuração e PostgreSQL:

- teste e desenvolvimento são PostgreSQL/Neon pooled e têm fingerprints de
  host, endpoint e alvo normalizado distintos;
- o sufixo pooled foi normalizado apenas para identificar o endpoint; a
  documentação Neon informa que `-pooler` é acrescentado ao ID do endpoint;
- a conexão ao teste ocorreu em `BEGIN TRANSACTION READ ONLY` e o servidor
  confirmou `transaction_read_only=on`;
- o fingerprint do database conectado coincide com o database do URL de teste;
- o schema inicial foi `public`, corretamente antes da criação do schema
  aleatório; não se exigiu que um schema ainda inexistente estivesse presente;
- havia zero schemas com prefixo `imp006_test_`; nenhuma criação ou remoção
  foi feita.

| Identidade sanitizada | Teste | Desenvolvimento/servidor |
|---|---|---|
| Endpoint normalizado, SHA-256/12 | `f3223a9f35cc` | `f0a8dcbe5d74` |
| Alvo host/porta/database, SHA-256/12 | `ad2ba58e9d1b` | `703409499f24` |
| Database configurado/conectado, SHA-256/12 | `693fe5919fc2` | `693fe5919fc2` |
| Endereço efetivo do servidor, SHA-256/12 | `aaf075b7b4bf` | não aplicável |

O mesmo nome de database nos dois URLs não implica o mesmo destino: os
endpoints e os alvos normalizados são distintos. A igualdade entre database de
teste configurado e conectado confirma a conexão SQL, não o `branch_id` Neon.

Evidência Neon ainda ausente: não há API key, CLI/configuração Neon,
`project_id` ou `branch_id` disponível. A documentação oficial estabelece que
o endpoint pertence a uma branch e que a Console/API expõe `endpoint.id`, `host`
e `branch_id`: [Manage computes](https://neon.com/docs/manage/endpoints/),
[List branch endpoints](https://api-docs.neon.tech/reference/listprojectbranchendpoints)
e [connection pooling](https://neon.com/blog/postgres-support-case-recap).
Uma conexão SQL, mesmo bem-sucedida, não comprova por si só esse `branch_id`.

### Auditoria antes de migrations e fixtures

Foram inspecionados o baseline, as seis migrations aplicadas pelo setup IHFR,
o harness, as fixtures, o lifecycle, o runner, a configuração Playwright e o
adaptador Prisma. Os SQLs do caminho remoto não contêm referência a `public`,
outro schema, criação/remoção de database ou role, extensão, `dblink`, FDW ou
`COPY PROGRAM`; os objetos são não qualificados e dependem do `search_path`
temporário. O setup local de regressão que usa `public` é um caminho separado e
não seria invocado.

Por inspeção, o lifecycle seleciona o URL escolhido sem reescrita, cria nome
aleatório allowlisted, seleciona esse schema antes do baseline e passa a mesma
conexão/schema a fixtures e Prisma. O runner cria servidor próprio em loopback,
substitui `DATABASE_URL` pelo alvo de teste e transmite seletor, schema e
`baseURL`; o Prisma exige o schema allowlisted e aplica qualificação/opção de
startup. Os probes E2E usam `TEST_DATABASE_URL` e selecionam o mesmo schema. A
limpeza exige marcador de propriedade antes de `DROP SCHEMA`.

Essa coerência é evidência estática; a seleção efetiva após setup só pode ser
confirmada depois que a escrita estiver liberada.

### Gate restante e menor intervenção

`RECOMENDACAO`:

1. Consultar por operação GET a Neon Console/API e confirmar que o endpoint de
   teste está associado ao `branch_id` de teste esperado e que o endpoint de
   desenvolvimento possui outro `branch_id`.
2. A equipe pode fornecer somente os dois `branch_id`/associações observados na
   Console; não é necessário compartilhar credencial do provedor.
3. Somente depois repetir o preflight read-only imediatamente antes da execução
   e liberar o runner, sem `--lan`, servidor externo ou concorrência.

**Decisão desta rodada:** testes com banco ainda não estão liberados. Há um
caminho sem alteração versionada, mas falta a evidência externa endpoint →
`branch_id`. Como o gate é cumulativo, nenhuma migration, fixture, setup, servidor
Next.js ou escrita foi iniciada.

## 6. Cobertura real de navegador

Há Playwright/Chromium disponível e o roteiro está documentado, mas a aplicação
isolada depende da criação do schema e de uma conta de teste. Como a escrita não
foi liberada, nenhuma etapa do fluxo foi executada em navegador. Não houve
screenshot, recurso criado, teardown ou resíduo desta rodada.

O E2E IHFR existente não seria suficiente para aprovar o objetivo completo: ele
usa fixture para laboratório, área e parte do contexto e cobre principalmente a
continuidade coleta → ambiental → IHFR. A validação solicitada deve criar
laboratório, área, coleta e dados ambientais pela interface; somente a conta de
login pode ser pré-condição externa identificada.

## 7. Respostas finais e prontidão

1. **O fluxo completo funciona?** Não demonstrado. Está implementado por
   inspeção, mas não foi executado no navegador.
2. **O resultado observado atende ao contrato experimental?** Não houve
   resultado E2E nesta rodada. As reproduções sem banco mantêm `F-001` e `F-002`:
   o avaliador interno aceita uma ausência obrigatória direta e a consulta omite
   campos exigidos. O contrato permanece `CONTRATO_EXPERIMENTAL`,
   `VALIDACAO_CIENTIFICA_PENDENTE`, `SUJEITO_A_RECALIBRACAO` e
   `NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO`.
3. **Critérios ainda descumpridos:** execução integral por navegador, geração e
   persistência observadas, reload/reabertura, apresentação integral de
   FR-005/SC-001, tratamento de ausência obrigatória de FR-012/SC-007 e prova
   Neon endpoint → `branch_id` antes da escrita.
4. **Prontidão:** **não pronta**. O typecheck local está resolvido, mas o E2E
   permanece bloqueado pelo gate Neon e dois defeitos contratuais reproduzidos
   continuam sem correção, conforme o escopo de apenas validar.

## 8. Continuidade posterior autorizada com PostgreSQL e navegador

Esta seção registra uma execução posterior no mesmo chat. Ela complementa o
estado histórico das seções 1–7; não reescreve como executado aquilo que estava
pendente na rodada documental inicial.

### 8.1 Baseline, autorização e separação de destinos

- código efetivamente testado: `3e6a97bdcaa8b598ee94b3e74c728b9cc104a41a`;
- os commits posteriores `498b26f` e `c8003bf` adicionaram somente estes
  documentos, sem mudar código, testes, schema Prisma ou migrations;
- o usuário forneceu e identificou explicitamente um segundo endpoint Neon como
  branch de teste e autorizou migrations, fixtures e fluxo E2E;
- a validação do projeto confirmou alvos normalizados distintos para
  `DATABASE_URL` e `TEST_DATABASE_URL`;
- URLs, senhas e segredos não foram registrados nos comandos reproduzidos nem
  nesta documentação;
- a associação endpoint → `branch_id` continuou sem prova independente pela
  Neon Console/API. A execução baseou-se na identificação e autorização
  explícitas do usuário.

O `prisma migrate status` pelo endpoint direto, depois da liberação de rede,
encontrou sete migrations e informou `Database schema is up to date`. Nenhuma
migration nova precisou ser aplicada.

### 8.2 Verificações automatizadas

| Verificação | Resultado | Observação |
|---|---:|---|
| `npm run typecheck` | **PASS** | Prisma Client regenerado na rodada anterior. |
| `npm run lint` | **PASS com 4 avisos** | Avisos preexistentes de símbolos não usados; zero erros. |
| `npm run test:unit` | **59/59 PASS** | Incluiu fallback e caminho normal de UUID. |
| `npm run test:contract` | **2/2 PASS** | Executado com destino PostgreSQL autorizado. |
| `npm run test:e2e:ihfr -- --lan` | **6/6 PASS** | Playwright em HTTP sem contexto seguro e fallback de UUID. |
| Concorrência ambiental focal | **1/1 PASS** | Banco físico de teste separado. |
| `npm run test:integration` | **106/106 PASS** | Exigiu cast temporário descrito em `F-007`. |

O teste focal de concorrência comprovou:

- uma única criação efetiva para requisições idênticas concorrentes;
- replay idempotente para a mesma chave e mesmo conteúdo;
- `CONFLICT` para chaves ou payloads divergentes disputando a mesma coleta;
- cardinalidade final de um conjunto ambiental por coleta;
- autorização contextual para `OWNER`, `ADMIN` e `MEMBER` e indistinguibilidade
  do usuário externo;
- bloqueio de escrita em laboratório inativo com leitura `readOnly`;
- preservação do registro pai imutável;
- limpeza das fixtures mesmo após a corrida.

### 8.3 Fluxo Playwright e cenário persistente

O servidor Next.js foi executado em `0.0.0.0:3001`. A suíte Playwright isolada
passou nos seis cenários:

1. coleta, confirmação ambiental e criação IHFR sem
   `crypto.randomUUID` disponível;
2. criação, substituição, revogação e recuperação pelo `OWNER`/`ADMIN`;
3. permissões de `MEMBER` e laboratório inativo;
4. versão incompatível com recuperação controlada;
5. DTO público, acessibilidade e layout responsivo;
6. ausência honesta e modo somente leitura.

No cenário persistente, um usuário sintético `ACTIVE` com papel contextual
`OWNER` acessou o mesmo laboratório, área e coleta durante a rodada. Foram
reabertas e verificadas as telas de workspace, dashboard, áreas, detalhe da área,
dados ambientais, mapa territorial e membros.

O conjunto persistido continha os quatro grupos do contrato:

- água;
- solo;
- vegetação;
- terreno, incluindo densidade de drenagem, elevação e declividade.

A elegibilidade com `AGROFORESTRY` retornou `ELIGIBLE`. O primeiro diagnóstico
foi criado com resposta HTTP `201`, score apresentado `0.26`, classe `MODERATE`
e qualidade `HIGH`. A substituição com `URBAN` também respondeu `201` e passou a
apresentar score `0.32`, classe `MODERATE`. A revogação respondeu `200` e deixou
o estado esperado “Nenhum diagnóstico IHFR vigente”.

O histórico do servidor registrou `200` para elegibilidade, leitura corrente,
dashboard, áreas, mapa e membros. Não houve erro no console do navegador durante
essas operações. Esses scores pertencem ao conjunto persistente usado na rodada
e não substituem o vetor independente `0.29` do checklist.

### 8.4 Falhas encontradas durante a execução

#### Seleção explícita do banco IMP-006

A primeira execução integral terminou em `81/106` porque
`IMP006_DATABASE_VARIABLE` não estava definido. As 25 falhas tinham a mesma
origem de guarda, antes da regra de negócio:

```text
Set IMP006_DATABASE_VARIABLE explicitly for the IMP-006 test process
```

Depois de fixar `IMP006_DATABASE_VARIABLE=TEST_DATABASE_URL`, essa classe de
falha desapareceu. `RECOMENDACAO`: o script npm remoto deve definir ou exigir
essa escolha antes de iniciar a descoberta dos testes, com mensagem de preflight
única em vez de repetir a falha em cada cenário.

#### Tipo PostgreSQL `name` no Prisma/Neon

Com o seletor correto, o lifecycle falhou em `current_schema()` porque o Prisma
não desserializou o tipo PostgreSQL `name`. O cast temporário abaixo foi aplicado
nas duas consultas do caminho de teste:

```sql
SELECT current_schema()::text AS schema
```

Com o cast, `106/106` passaram em aproximadamente 200 segundos. O cast foi
revertido antes do encerramento; o defeito e a solução proposta estão em
`F-007`.

#### Pooler, endpoint direto e sandbox

O URL pooled devolveu `Schema engine error` ao Prisma CLI na tentativa inicial.
O endpoint direto ainda falhou enquanto sujeito à restrição de rede do sandbox,
mas funcionou depois que o acesso de rede foi autorizado. Isso impede atribuir
o erro genérico somente ao pooler. Separadamente, o lifecycle já havia observado
incompatibilidade do pooler com a seleção de `search_path` por opção de startup.

Para esta rodada, endpoint direto foi usado em migrations e testes que criam
schemas. O adapter `PrismaNeon` funcionou no teste de concorrência ambiental com
esse endpoint. A política recomendada está em `F-008`.

#### Aviso TLS do driver `pg`

O driver informou que `sslmode=require`, `prefer` e `verify-ca` são tratados
atualmente como aliases de `verify-full`, mas que essa semântica mudará na
próxima versão maior. A rodada não alterou a conexão. Antes de atualizar `pg`, a
equipe deve decidir entre preservar a validação estrita com
`sslmode=verify-full` ou adotar semântica libpq explicitamente.

### 8.5 Teardown e estado final

Após os testes, uma auditoria independente encontrou:

- zero usuários de fixture ambiental;
- zero laboratórios de fixture ambiental;
- um schema `imp006_test_<uuid>` residual, com 11 tabelas e marcador oficial do
  harness.

O schema residual foi removido somente após validação do nome allowlisted e do
marcador `hidroflorestas:imp006-test-harness`. A consulta posterior confirmou
zero schemas temporários. Não foi possível atribuir o resíduo a uma execução
específica; as execuções falhas anteriores são uma hipótese, não uma conclusão.

Todas as modificações temporárias de código foram revertidas. Ao fim da
validação, a branch continuava sem diferenças rastreadas e o arquivo local
preexistente `specs/005-environmental-collection-data/coverage-review.md`
permaneceu não rastreado e fora do escopo.

### 8.6 Conclusão atualizada

1. **Fluxo técnico integrado:** demonstrado para os cenários executados, com
   persistência, reload, permissões, concorrência e ciclo IHFR.
2. **Pendência de concorrência ambiental:** fechada em banco físico de teste
   separado.
3. **Repetibilidade Neon sem alteração local:** ainda bloqueada por `F-007` até
   que o cast `::text` seja incorporado.
4. **Conformidade integral do contrato:** ainda bloqueada por `F-001` e `F-002`.
5. **Identidade Neon independente:** `F-005` permanece como lacuna de
   proveniência, embora a execução tenha sido autorizada pelo usuário.
6. **Validação científica:** continua pendente; nenhum teste técnico aprova a
   v0.1 como contrato científico definitivo.

## 9. Continuidade corretiva no HEAD `2c63c674` (2026-09-25)

Esta seção registra o diff de trabalho desta rodada, separado das execuções históricas das seções 1–8. Branch `007-ihfr-evolution`; HEAD inicial `2c63c6749f43542cce4dafbdc452be773fee85fe`; diff rastreado inicial vazio. Permanecem não rastreados e intocados os arquivos preexistentes `docs/validation/007-ihfr-evolution.zip`, `imp006-final-stat.txt`, `imp006-final-status.txt` e `imp006-final.diff`. O ZIP continha os cinco documentos com SHA-256 idêntico aos do repositório antes das edições. Ferramentas locais/lockfile: Prisma e Client 7.4.2, TypeScript 5.9.3, Node 24.19.0.

### 9.1 Matriz de leitura e autoridade

| Documento e seção lida | Requisito ou achado extraído | Tarefa |
|---|---|---|
| `README.md` — objetivo, baseline, continuidade posterior e índice | A branch 007 continua a IMP-006; `3e6a97b` é baseline histórico e 106/106 dependeu de cast revertido. | T135–T141 |
| `findings.md` — F-001–F-009 | Reproduções de ausência obrigatória, omissão de DTO e incompatibilidade `name`; riscos de comando, destino e teardown. | T135–T139 |
| `validation-report.md` — §§1–8.6 | Distinguir rodada sem escrita, execução posterior autorizada, 7 migrations e cast temporário; não transferir aceite ao HEAD. | T135–T141 |
| `end-to-end-checklist.md` — estado, §§1–6 | Vetor independente 0.29 e jornada UI; 0.26/0.32 pertencem a outro cenário; login e criação pela UI ainda não comprovados. | T140 |
| `continuity-checkpoint.md` — estado, destino, preparação, cenário, retomada e limpeza | `25756b0`/`2295502`, oito migrations em contexto posterior, `public` E2E preservado e cenário `HF007-UI-20260925-2295502` ainda sem login registrado. | T139–T140 |

`FATO_DOCUMENTADO`: FR-005/FR-012/SC-001/SC-007 em `specs/006-ihfr-diagnosis/spec.md` delimitam os requisitos. `EVIDENCIA_IMPLEMENTACAO`: o manifesto v0.1.1 e o parser ambiental delimitam os formatos executáveis. `INFERENCIA`: as contagens de sete e oito migrations referem a contextos/instantes distintos e não demonstram defeito de migration. `PENDENCIA_DE_DECISAO`: a validação científica continua PD-002; nenhuma decisão científica nova foi inferida.

### 9.2 Matriz F-001–F-009 no diff atual

| ID | Estado documental → HEAD inicial | Requisito e reprodução | Mudança desta rodada e teste | Dependência / evidência final |
|---|---|---|---|---|
| F-001 | Bug reproduzido → presente | FR-012/SC-007; remover `soil.infiltrationRateMmPerHour` de payload completo dava `SUFFICIENT`. | RED 3 falhas pelo motivo contratual; avaliador agora exige cada entrada obrigatória, preserva opcionais/null/zero/false e fecha enums; testes controlado e PostgreSQL real verificam terminal único sem diagnóstico/CURRENT/evento. | `CORRIGIDO_VERIFICADO_LOCALMENTE`; Neon remoto pendente. |
| F-002 | DTO completo, resumo incompleto → presente | FR-005/SC-001; renderização estática omitia origem, versões e datas. | Resumo expõe somente DTO público, UTC explícito, estado e IDs com quebra; CURRENT/SUPERSEDED/REVOKED em teste estático e CURRENT em navegador local a 390 × 844 com reload. Desvio de três horas do `PrismaPg` em sessão local não UTC foi reproduzido por consultas comparadas e corrigido selecionando UTC na conexão local. | `CORRIGIDO_VERIFICADO_LOCALMENTE`; percurso integral no Neon pendente. |
| F-003 | Client local desatualizado resolvido na rodada anterior → sem defeito de schema demonstrado | Typecheck e versão do client. | Regeneração local ignorada pelo Git; `npm run typecheck` verde. | Resolvido localmente; nenhum schema alterado. |
| F-004 | `test:contract` escreve → confirmado | Evitar descoberta de testes com escrita sem destino. | `test:contract`, `test:integration` e `test:migration` usam preflight único read-only e seleção explícita. | Sem env, comando recusou antes da descoberta; com PostgreSQL local próprio: contrato 2/2, integração 107/107, migrations 23/23. |
| F-005 | Alvo autorizado historicamente, prova independente ausente → sem env atual | Revalidar mesmo destino, confirmação e identidade antes de escrita. | Preflight exige destino direto e selecionado, confirmação, identidade distinta para remoto e recusa servidor externo/flags herdadas. | `PENDENCIA_EXTERNA`; sem configuração E2E atual ou prova Console/API; zero escrita remota nesta rodada. |
| F-006 | E2E semeado e cenário `public` preparado → sem login UI comprovado | Criar recursos pela UI, vetor 0.29, reload/histórico. | `full-ui-flow.spec.ts` e runner dedicado/servidor próprio preparados. | `NAO_EXECUTADO`: falta destino e conta neste processo; sem IDs novos. |
| F-007 | Cast temporário revertido → consultas sem cast | Prisma/Neon falha ao desserializar `name`. | Cast `::text` nas duas consultas Prisma, com schema correto/divergente/inesperado e regressão PostgreSQL/Prisma local sem patch temporário. | `CORRIGIDO_VERIFICADO_LOCALMENTE`; adapter Neon ainda pendente. |
| F-008 | Pooler/startup/CLI ambíguos → sem política executável | Schema isolado requer endpoint direto; não atribuir erro CLI genérico ao pooler. | Guarda rejeita URL pooled sem reescrever host; preflight verifica banco/schema em transação read-only; conexão `PrismaPg` local seleciona UTC. | Rede/auth/TLS/CLI do Neon não avaliados nesta rodada. |
| F-009 | Schema residual histórico removido → teardown tinha marcador sem prova de propriedade se comentário falhasse | Limpeza restrita da própria rodada. | Nome aleatório exato, criação local e marcador exato exigidos; comando `test:ihfr:audit` só lista resíduos. | Teste PostgreSQL com falha injetada confirmou descarte; auditoria local encontrou zero candidatos após falhas/sucessos. Auditoria remota pendente. |

O wrapper local histórico continua aceito somente com `IMP006_LOCAL_POSTGRESQL=1` e ambos os URLs em `127.0.0.1:55426`, cluster próprio da regressão. Para Neon remoto, os alvos precisam ser distintos e o URL de teste precisa ser direto. O runner de UI persistente recusa o modo local.

### 9.3 Matriz de comandos e resultados desta rodada

| Comando | Classe/destino/cleanup | Resultado |
|---|---|---|
| `npm run test:unit` | Sem banco; nenhum recurso criado. | 217/217 PASS após a correção do adaptador local. |
| `npm run typecheck` | Sem banco; Client local gerado. | PASS. |
| `npm run lint` | Sem banco. | PASS, 0 erros e 4 avisos preexistentes fora do patch. |
| `npm run build` | Sem banco real; datasource fictício local apenas para geração do Client. | PASS; Prisma Client 7.4.2 gerado e Next.js compilado. |
| `playwright test --config=playwright.imp006-full-ui.config.ts --list` | Apenas descoberta, sem servidor/banco; variáveis sintéticas. | PASS: um teste de percurso UI encontrado, não executado. |
| `npm run test:contract` | Preflight; PostgreSQL local próprio com schema descartável. | Sem env, recusado antes da descoberta; no banco local, 2/2 PASS. |
| `npm run test:integration` | PostgreSQL local próprio, bases de regressão separadas e schemas descartáveis. | 107/107 PASS, inclusive insuficiência persistida e descarte após falha injetada. |
| `npm run test:migration` | PostgreSQL local próprio, schemas descartáveis e triggers ativos. | 23/23 PASS. |
| `npm run test:e2e:ihfr` | PostgreSQL local próprio, Next.js próprio, Playwright e schema descartável. | 6/6 PASS no diff final; uma tentativa intermediária falhou pela sessão local `PrismaPg` fora de UTC, corrigida sem alterar a expectativa contratual. Servidor encerrado. |
| `npm run test:e2e:ihfr:full-ui` | PostgreSQL `public` da branch E2E dedicada, servidor próprio; cenário preservado. | Recusado antes de conexão: conta e run ID E2E ausentes. |
| `npm run test:ihfr:audit` | Somente leitura no PostgreSQL local próprio. | PASS: zero schemas candidatos após E2E falho e verde; banco remoto não auditado. |
| `git -c core.safecrlf=false diff --check` | Escopo local, sem banco. | PASS; nenhum erro de whitespace. |

Somente o PostgreSQL local próprio recebeu schemas/fixtures descartáveis; o harness os removeu e a auditoria encontrou zero candidatos. O servidor Next.js local usado pelo E2E foi encerrado, assim como o cluster local após os gates. Nenhuma migration foi aplicada em Neon nesta rodada e o checkpoint histórico em `public` não foi consultado nem tocado. O aviso TLS e a prova independente de `branch_id` permanecem assuntos distintos. O contrato segue `CONTRATO_EXPERIMENTAL`, `VALIDACAO_CIENTIFICA_PENDENTE`, `SUJEITO_A_RECALIBRACAO` e `NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO`.
