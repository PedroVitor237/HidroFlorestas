# Evidências de integração e gate da IMP-004

## Ledger da implementação

Esta seção acompanha a execução de `$speckit-implement` iniciada em 2026-09-16. Os registros históricos da integração e da comprovação de T005 abaixo permanecem preservados.

### Baseline da execução

- Data: 2026-09-16, fuso `America/Fortaleza`.
- Branch: `004-environmental-collection-registration`.
- HEAD inicial: `adee2d027d32d1b169c1c76a810193e79bf65324` (`docs(spec): reconcile IMP-004 with integrated IMP-003`).
- Upstream: `origin/004-environmental-collection-registration`, no mesmo commit após `git fetch origin`.
- Divergência inicial: `0/0`.
- Working tree inicial: limpa.
- `origin/development` é ancestral do HEAD.
- Worktrees observados: o worktree atual da IMP-004 e os worktrees separados `docs/developer-guide` e `fix/eslint-9-compat`; nenhum deles foi alterado por esta execução.
- Inventário inicial dos caminhos de coleção previstos sob `prisma/`, `scripts/`, `src/` e `tests/`: nenhum arquivo específico da IMP-004 existia; os caminhos serão criados estritamente na ordem de `tasks.md`.
- `.specify/feature.json`: apontador local não rastreado, ignorado por `.specify/.gitignore:6`, corrigido localmente para a IMP-004 antes da retomada e ausente do status/diff.
- Runtime e ferramentas instaladas: Node `v20.19.2`, npm `9.2.0`, TypeScript `5.9.3`, Prisma CLI/Client `7.4.2`, Playwright `1.51.1`; `psql` não está instalado localmente.
- Stack focal instalada: Next.js `16.1.6`, React/React DOM `19.2.4`, `@neondatabase/serverless` `1.0.2`, `@prisma/adapter-neon` `7.7.0`, `tsx` `4.21.0`, ESLint `9.39.5` e `yaml` `2.8.1`.
- Scripts observados: `dev`, `build`, `start`, `create-super-admin`, `lint`, `test:fixtures:auth`, `test:unit`, `test:integration`, `test:e2e`, `test:e2e:https`, `test`, `typecheck` e `test:migration`; este último executa a suíte de migration da IMP-003 e será reutilizado/ajustado somente em T009.
- Lockfile: `package-lock.json` presente e não alterado.
- `npm ls --depth=0 --json`: executado com código 0; registrou um pacote local extraneous preexistente (`@emnapi/runtime@1.8.1`), sem alteração de dependências ou lockfile.
- Baseline de lint: `npm run lint`, código 0, `0` erros e `4` warnings históricos — `src/app/api/auth/sign-up/route.ts` (`error`), `src/app/page.tsx` (`ShieldCheck`), `src/components/user-profile/index.tsx` (`useAuth`) e `src/components/white-box/index.tsx` (`className`). Nenhum warning da IMP-004 existe neste baseline.
- Dependências para a IMP-004: `package.json` e `package-lock.json` permaneceram sem diff. UUID usa `node:crypto.randomUUID`; URL, `Date`, `fetch` e `structuredClone` nativos estão disponíveis; `node:test`, `tsx`, `yaml`, Prisma/Neon e Playwright já cobrem as camadas planejadas. Nenhuma dependência nova é necessária.
- Política desta execução: não executar `npm audit fix`, `npm audit fix --force`, atualização global de Next.js/ESLint nem alteração incidental do lockfile. A auditoria global permanece fora do escopo em `chore/dependency-security-audit`.

### Gate herdado da IMP-003

T005 permanece comprovado pelas evidências históricas deste documento.

Inspeção T006 concluída no baseline `adee2d0`:

- `prisma/schema.prisma` mantém `LaboratoryMembershipRole` separado de `UserRole`; `CollectionArea.id` é UUID opaco, `laboratoryRoomId` é obrigatório e a área possui relação direta com `LaboratoryRoom`; `CollectionData` ainda está no modelo legado e não contém antecipadamente campos da IMP-004.
- O histórico contém a migration inicial, a unicidade de código da IMP-002 e `20260914000100_area_registration_and_membership_roles`; a migration IMP-003 é transacional, faz preflight antes de mudanças, cria papéis contextuais, recupera `OWNER`, materializa latitude/longitude e preserva a fronteira administrativa testada.
- `authorizeLaboratoryAccess` revalida conta `ACTIVE`, vínculo pelo par usuário–laboratório, papel e estado; `CREATE_COLLECTION` integra o tipo fechado `AreaPermission`. A chamada consumidora obrigatória permanece `authorizeLaboratoryAccess(principal, laboratoryId, "CREATE_COLLECTION", tx, true)`.
- `assertLaboratoryPermission` aplica `READ_ONLY` antes da matriz de papel quando `mutate=true`; `CREATE_COLLECTION` não possui restrição adicional e, portanto, aceita `OWNER`, `ADMIN` e `MEMBER`. `User.role` e `User.isAdmin` não participam da decisão.
- `AreasService` usa transações, deriva autoria da sessão, filtra detalhe por `{ id, laboratoryRoomId }` e serializa DTO por allowlist. Rotas usam factories injetáveis, `requireAuth`, envelopes `{ area }`/`{ error }`, `Cache-Control: no-store` e erro `500` sanitizado.
- O OpenAPI integrado da IMP-003 possui cinco operações contextuais, schemas fechados, respostas uniformes e leitura de área em laboratório inativo. Testes unitários e de integração confirmam o guard, a ordem contextual, autoria derivada, filtros compostos e ausência de campos privilegiados.
- Nenhuma divergência funcional ou técnica nova foi encontrada contra o mapeamento já reconciliado em T005.

### Arquivos previstos

Os caminhos autorizados são os enumerados em `plan.md` e `tasks.md`. O inventário observado será consolidado por fase, sem incorporar arquivos alheios à IMP-004.

- T009: `test:migration` foi preservado sobre `node:test`/`tsx` e ajustado somente para execução serial de `tests/migration/*.test.ts`, permitindo manter a regressão IMP-003 e incluir a suíte IMP-004 sem versões ou scripts alheios alterados.
- T010: o harness IMP-003 foi reutilizado com prefixos de schema restritos a `imp003_test`/`imp004_test` e aplicação explícita da migration IMP-004; validação do ambiente continua anterior à conexão e o `finally` continua removendo exclusivamente o schema temporário gerado.
- T011: criado shell compilável e puro do preflight com retorno controlado `NOT_IMPLEMENTED`; ele não importa Prisma Client, não lê ambiente e não abre conexão.
- T019: a primeira tentativa de `npx prisma format` detectou relação inversa duplicada em `User` (P1012) e não foi aceita. O campo foi corrigido para `LaboratoryRoom`; repetição concluída com código 0 e `git diff --check` aprovado.
- T020: `prisma validate` executado com `.env.e2e.local` herdado pelo processo, código 0; schema válido, sem conexão nem exposição de URL.
- T021: `prisma generate` executado após format/validate, código 0, Client `7.4.2` gerado em `src/generated/prisma`; somente artefatos ignorados esperados foram produzidos e o lockfile permaneceu intacto.

### Ciclos RED/GREEN

T014 — RED da fundação:

- `node --import=tsx tests/unit/collection-migration-preflight.test.ts`: código 1, 0/7; causa comportamental explícita `NOT_IMPLEMENTED` do shell do preflight. A repetição inicial com `--test` ocultou detalhes do reporter, por isso a execução diagnóstica direta foi usada e não foi contada separadamente como RED.
- `node --env-file=.env.e2e.local --import=tsx tests/migration/collection-registration-migration.test.ts`: código 1, 0/4; conexão somente ao banco autorizado, quatro schemas temporários com teardown. Causas comportamentais: 0/5 colunas novas, `laboratoryRoomId` ausente, DDL/constraints ausentes e preflight transacional inexistente. O SQL-shell existia, portanto não houve falha por arquivo/migration ausente.
- RED aceito: testes compilaram, o banco autorizado respondeu e as falhas correspondem exclusivamente ao comportamento ainda não implementado.

T022 — GREEN da fundação:

- preflight unitário: código 0, 7/7;
- migration IMP-004 em schemas temporários: código 0, 4/4, com teardown por `finally` em todos os casos;
- o reset via Prisma CLI foi tentado com saída capturada/sanitizada e recusado pela camada de datasource/configuração, sem executar migrations; não foi contado como validação;
- recuperação aplicada somente em `TEST_DATABASE_URL`: schema público descartável reconstruído e quatro migrations versionadas aplicadas em ordem, com histórico e checksums registrados; código 0;
- preflight conectado após reconstrução: código 0, `collections=0`, todos os cinco grupos científicos `=0`, sem órfãos ou drift;
- nenhum valor de ambiente, URL ou credencial foi registrado.

T023 — recovery e preservação: migration reexecutada em quatro schemas temporários, código 0, 4/4. O caso legado manteve uma linha em cada `WaterData`, `SoilData`, `VegetationData`, `TerrainData` e `IHFRDiagnosis`; o caso órfão abortou antes das colunas aditivas e comprovou rollback. A recuperação do alvo descartável foi exercitada pela reconstrução versionada; para ambientes com dados, permanece obrigatório forward-fix ou snapshot/PITR ensaiado.

T027 — fixture/OpenAPI:

- `collection-fixture-guard.test.ts`: RED funcional, código 1, 2/4; guard e allowlists passam, mas setup/cleanup/disconnect ainda retornam `NOT_IMPLEMENTED` em vez da sequência esperada. Nenhuma conexão foi criada pelo shell.
- `collection-openapi-contract.test.ts`: baseline documental, código 0, 3/3; OpenAPI 3.1, dois `operationId`, refs locais, schemas fechados, UUID idempotente, `Location` de API e `no-store` já estavam conformes. Nenhum RED foi fabricado.
- T029: após implementar a fixture, `collection-fixture-guard.test.ts` passou com código 0, 4/4; guard anterior à factory, allowlists exclusivas, cleanup antes do setup e disconnect em sucesso/falha foram comprovados sem conexão real.
- T030: setup real no banco autorizado produziu contagens allowlisted `users=4`, `laboratories=3`, `memberships=7`, `areas=3`, `collections=1`; teardown em `finally` encerrou todas em zero. Um segundo ensaio induziu falha depois do setup e o cleanup interno novamente terminou com todas as cinco contagens em zero.
- T031: diff da fundação revisado; `package-lock.json` sem alterações, migration IMP-004 explicitamente allowlisted, nenhum campo científico novo e nenhuma remoção. O SQL só foi considerado completo após preflight 7/7, migration IMP-004 4/4, regressão serial IMP-003+IMP-004 9/9 e fixture real com teardown zero. `git diff --check`: PASS.

T035 — RED US1:

- estado unitário: código 1, 1/3; as duas falhas funcionais são `NOT_IMPLEMENTED` nas transições de tentativa/revisão, enquanto a ausência de storage/write já passa;
- Chromium serial: código 1, 0/1 na primeira versão do subconjunto; página contextual respondeu, mas o heading “Registrar coleta” não existia no shell. Browser, servidor, sessão, banco e fixture estavam disponíveis, portanto o RED é comportamental;
- teardown após o RED: `users=0`, `laboratories=0`, `memberships=0`, `areas=0`, `collections=0`.

T041 — GREEN US1 unitário/regressão: `collection-form-state.test.ts` 3/3; regressão `area-authorization`, `areas-service` e `areas-route` 3/3 arquivos, todos código 0. Contexto permanece derivado do serviço integrado e não há storage/write no estado volátil.

### Migration e segurança de banco

Nenhuma conexão nem write de banco foi realizado nesta execução.

Auditoria T007:

- `playwright.config.ts` força a validação fail-closed antes de iniciar browser/servidor, usa Chromium serial (`workers: 1`, `retries: 0`) e só redireciona o servidor para `TEST_DATABASE_URL` depois do guard.
- `validateAuthFixtureEnvironment` exige `NODE_ENV=test`, `TEST_DATABASE_URL`, `DATABASE_URL`, confirmação exata e destinos PostgreSQL distintos por identidade normalizada; não existe fallback para `DATABASE_URL`.
- Fixtures de autenticação, laboratório e área usam IDs/e-mails/prefixos delimitados, operações contextuais e cleanup filho-primeiro. A fixture de área declara a ordem `CollectionArea` → `ResearchersLinked` → `LaboratoryRoom` → `User`.
- Comando `node --import=tsx --test tests/unit/auth-fixture-guard.test.ts tests/unit/area-fixture-guard.test.ts`: código 0, `2/2` arquivos aprovados. Os testes comprovaram recusa antes da factory/conexão/write para variável ausente, `NODE_ENV` incorreto, confirmação incorreta, URL inválida/igual (inclusive alias pooler), ausência de senha e ausência de `TEST_DATABASE_URL`.
- Inspeção local sanitizada, sem valores: `.env` existe; `.env.test.local` não existe; `NODE_ENV=test` não está configurado; `TEST_DATABASE_URL` não está configurada; a confirmação exigida não está configurada; `E2E_USER_PASSWORD` não está configurada. `DATABASE_URL` de desenvolvimento está configurada, mas não foi exibida nem usada.
- Não há recurso PostgreSQL/Neon isolado explicitamente autorizado para a IMP-004. A antiga infraestrutura da IMP-003 não foi reutilizada.

T008 retomada após autorização explícita do recurso em `.env.e2e.local` para migration, fixtures, integração e E2E da IMP-004. O guard foi revalidado antes da conexão: `NODE_ENV=test`, ambas as URLs presentes e distintas, PostgreSQL/Neon reconhecido, SSL configurado, confirmação exata e senha E2E presente; nenhum valor foi impresso.

Reconciliação somente leitura do alvo autorizado:

- conexão de leitura: PASS;
- `_prisma_migrations`: presente, uma entrada concluída, nenhuma inacabada ou revertida;
- migration aplicada observada: `20260523010444_init`;
- migrations versionadas no repositório `20260523005224_init`, `20260907120000_unique_laboratory_access_code` e `20260914000100_area_registration_and_membership_roles`: não registradas como aplicadas nesse alvo;
- marcadores estruturais: `Coordinates` ainda existe e `CollectionArea.coordinatesId` está presente; papel contextual e latitude/longitude da IMP-003 não estão materializados;
- conclusão: drift de baseline descartável, sem dados a preservar conforme autorização da equipe. Não aplicar IMP-004 incrementalmente sobre esse estado.

Estratégia de desenvolvimento: reconstruir/resetar exclusivamente o destino de `TEST_DATABASE_URL` a partir do histórico versionado antes de integração/E2E; testes de migration usam schema temporário, DDL transacional, preflight e teardown. Estratégia de deploy futuro permanece separada: backup/snapshot/PITR antes de produção, preflight anterior a writes e forward-fix ou restauração ensaiada após existirem coletas IMP-004; nunca drop automático de colunas/dados científicos.

### Validações automatizadas

Pendente. Resultados serão registrados somente após execução real e separados por camada.

### Métricas humanas

SC-002 e SC-007 permanecem `NAO_VERIFICADO`. A avaliação futura pertence à equipe de produto/pesquisa e não será substituída por automação.

### Bloqueios e recuperações

O apontador local ignorado `.specify/feature.json` inicialmente referenciava a IMP-003. Após autorização explícita, somente seu valor `feature_directory` foi ajustado localmente para `specs/004-environmental-collection-registration`; o arquivo não é rastreado, não aparece no status/diff e não será commitado.

O bloqueio de T008 foi resolvido pela autorização explícita do recurso em `.env.e2e.local`. O drift observado pertence ao alvo descartável e será eliminado apenas dentro de `TEST_DATABASE_URL`, conforme a estratégia registrada acima.

### Estado final

Implementação retomada após T008. T110 permanece futura e `NAO_VERIFICADO`.

## Estado desta comprovação

- Data da comprovação: 2026-09-16.
- Escopo: integração da IMP-003 aprovada em `development`, reconciliação dos contratos herdados e comprovação de T005.
- `EVIDENCIA_IMPLEMENTACAO`: a branch `004-environmental-collection-registration` recebeu `origin/development` por merge commit, sem conflitos e sem rebase ou squash.
- `DECISAO_DA_EQUIPE_PARA_ESTA_EXECUCAO`: não iniciar `$speckit-implement`, não acessar Neon e não repetir migration ou E2E remoto.

## Baselines e integração

| Item | Evidência observada |
|---|---|
| IMP-004 antes da integração | `a44ac7ab3d4ead5adae977e53fd9cb9dfe05368e`, sincronizada `0/0` com `origin/004-environmental-collection-registration` e árvore limpa |
| `origin/development` | `190e9afd06222b5155fcdee79741771edb592706`, merge do PR #23 |
| HEAD final da IMP-003 | `106e25f984df56384896729bf786e44104166570` |
| Merge na IMP-004 | `653a923a2e8d40804f9cbf75798e07098b83c65d`, mensagem `merge: integrate IMP-003 into IMP-004` |
| Conflitos | nenhum; merge automático pelo método `ort` |
| Ancestralidade | `190e9afd...` e `106e25f9...` são ancestrais do merge da IMP-004 |
| Artefatos da IMP-004 | os oito artefatos anteriores ao merge permaneceram presentes |

O [PR #23](https://github.com/PedroVitor237/HidroFlorestas/pull/23) foi consultado em modo somente leitura e está `MERGED` em `development`, com `headRefOid` `106e25f9...` e merge commit `190e9afd...`. O status Vercel e o deployment associado constam como aprovados/`SUCCESS` e `Ready`. Nenhum deploy foi disparado nesta execução.

## Matriz de T005

| Requisito do gate | Resultado | Evidência e mapeamento técnico |
|---|---|---|
| `area.id` público, estável e opaco | PASS | `CollectionArea.id` é `@id @default(uuid())`; os DTOs e o OpenAPI expõem somente o UUID, sem semântica autorizativa. |
| Associação obrigatória área–laboratório | PASS | `CollectionArea.laboratoryRoomId` é obrigatório e possui relação obrigatória com `LaboratoryRoom`; criação deriva o valor do contexto autorizado. |
| Rotas contextuais por `laboratoryId` | PASS | `/api/laboratories/{laboratoryId}/areas` e `/api/laboratories/{laboratoryId}/areas/{areaId}` estão implementadas. |
| Recurso subordinado consultado por laboratório e ID | PASS | o detalhe usa `where: { id: areaId, laboratoryRoomId: laboratoryId }`; a IMP-004 mantém a mesma composição para área e futura coleta. |
| DTO mínimo da área | PASS | resumo: `id`, `name`, coordenadas, município e estado; detalhe acrescenta somente tipo, descrição, criação, laboratório público e `readOnly`. |
| Ausência de autoria/campos privilegiados | PASS | serializers não retornam `userId`, autor, e-mail, código de acesso, CEP, imagem, `isActive` legado ou identificador de coordenada. |
| Guard contextual reutilizável | PASS | `authorizeLaboratoryAccess` está centralizado em `src/app/api/server/areas/area.authorization.ts` e é reutilizado pelos serviços de área e vínculos. |
| Sequência de autorização | PASS | o guard valida principal/conta `ACTIVE`, consulta laboratório pelo vínculo atual, avalia papel/estado e permissão; o serviço consulta depois a área por `{ id, laboratoryId }`. A futura coleta permanece subordinada depois da área, no serviço da IMP-004. |
| Papéis contextuais | PASS | `LaboratoryMembershipRole` contém `OWNER`, `ADMIN` e `MEMBER`; migration, schema, serviços e testes usam os três valores. |
| Separação de `LaboratoryMembershipRole` e `UserRole` | PASS | enums distintos no schema; o guard obtém o papel exclusivamente de `ResearchersLinked.role`. |
| `UserRole.ADMIN` sem concessão contextual automática | PASS | o guard recebe apenas `principal.id` e decide pelo vínculo atual; `User.role` e `User.isAdmin` não participam da decisão contextual. |
| Autoria derivada do principal | PASS | criação de área recebe apenas o ID de `requireAuth()` e grava `userId` no servidor; body com identidade/contexto forjados é rejeitado. |
| Laboratório ativo para mutações | PASS | o guard lança `READ_ONLY` antes da matriz de papel quando chamado com `mutate=true` e o laboratório está inativo. |
| Laboratório inativo permite leitura | PASS | `READ_AREAS` retorna contexto com `status: INACTIVE` e `readOnly: true`; listagem e detalhe não filtram o laboratório inativo. |
| Modo somente leitura | PASS | contexto público contém `readOnly`; mutações contextuais retornam `409 READ_ONLY`. |
| Vínculo revogado sem acesso posterior | PASS | vínculo é reconsultado a cada operação; ausência/revogação converge em `404 NOT_FOUND`. |
| Isolamento entre laboratórios | PASS | vínculo e recursos são consultados dentro do `laboratoryId`; IDs cruzados não são consultados isoladamente. |
| `CREATE_COLLECTION` presente | PASS | o literal integra o tipo fechado `AreaPermission` do guard. |
| `CREATE_COLLECTION` para os três papéis | PASS | no guard integrado, as únicas restrições de papel são `MANAGE_ROLES → OWNER` e `CREATE_AREA → OWNER/ADMIN`; portanto `CREATE_COLLECTION` aceita `OWNER`, `ADMIN` e `MEMBER`. O mapeamento é fechado pelos tipos contextuais e não depende de `UserRole`. |
| Inatividade aplicada a `CREATE_COLLECTION` | PASS, com mapeamento técnico | a implementação separa permissão e natureza mutável. A IMP-004 deve chamar `authorizeLaboratoryAccess(principal, laboratoryId, "CREATE_COLLECTION", tx, true)`; o quinto argumento produz `409 READ_ONLY`. |
| Ausência de guard duplicado na IMP-004 | PASS | a assinatura integrada já suporta principal, laboratório, permissão, transação e mutabilidade; a área e a coleta subordinadas permanecem consultas do serviço após o guard. |

## Divergências

### Divergência técnica reconciliada

O planejamento descrevia o estado ativo como parte implícita da permissão mutável. A implementação real usa a permissão literal `CREATE_COLLECTION` e o argumento separado `mutate=true`. Os artefatos técnicos e a tarefa consumidora da IMP-004 foram atualizados para registrar a chamada exata. A intenção, a matriz dos três papéis, o comportamento `READ_ONLY` e o contrato externo não mudaram.

O guard não busca diretamente a área nem a futura coleta. Ele encerra a decisão contextual até a permissão; o serviço consumidor deve então consultar a área pelo par `{ id, laboratoryId }` e a coleta por `{ collectionId, areaId, laboratoryId }`. Isso corresponde à sequência funcional planejada sem criar autorização paralela.

### Divergências funcionais

Nenhuma divergência funcional foi encontrada em intenção do usuário, permissão, comportamento externo, requisito, critério de sucesso ou escopo.

## Evidências reaproveitadas da IMP-003

As validações abaixo não foram executadas nesta sessão. Elas foram reaproveitadas do corpo do PR #23 e do ledger da IMP-003; pertencem ao commit pai `7d95079d6ff794f63aabc5fb6b717cc7da8eb66d`, salvo os gates finais locais associados ao HEAD `106e25f9...`:

| Evidência reaproveitada | Resultado registrado |
|---|---|
| Tarefas IMP-003 | 112/112 encerradas; T111 marcado e fronteira da IMP-004 registrada |
| OpenAPI | 1/1 aprovado; cinco operações, referências locais e DTOs fechados |
| Unitários | 59/59 |
| Integração local/injetada | 30/30 |
| Migration Neon isolada | 5/5 |
| E2E Neon | 12/12, um worker, zero retries |
| Teardown | `users=0`, `laboratories=0`, `memberships=0`, `areas=0` |
| Integridade | zero áreas/vínculos órfãos; tabela legada `Coordinates` ausente |
| Regressões IMP-001/002 | aprovadas, incluindo DTO de autenticação, papéis globais e exclusão administrativa |
| Build | aprovado; Prisma Client gerado e 22 rotas/páginas compiladas |
| Deploy Vercel do PR #23 | aprovado; checks Vercel em sucesso e deployment `Ready` |

SC-009 e SC-010 da IMP-003 permanecem `NAO_VERIFICADO`, pois dependem de participantes representativos. Esse estado foi previsto e não foi convertido em aprovação por automação.

## Validações desta sessão

Foram limitadas a inspeção estática, histórico/ancestralidade Git, consulta somente leitura do PR #23, referências locais, contratos, schemas, numeração de tarefas, OpenAPI da IMP-004 e `git diff --check`.

- Numeração: IMP-003 contém T001–T112 contínuas e 112/112 marcadas; IMP-004 contém T001–T110 contínuas e somente T005 marcada nesta execução.
- OpenAPI IMP-004: versão 3.1.0, duas operações com `operationId` únicos, 44 referências locais resolvidas e nenhum schema de objeto aberto.
- Mapeamento focal do guard: PASS para `CREATE_COLLECTION` com `OWNER`, `ADMIN` e `MEMBER` em laboratório ativo; os três retornam `READ_ONLY` em laboratório inativo quando `mutate=true`.
- `git diff --check`: PASS.

Não houve acesso a Neon, migration, E2E remoto, instalação, atualização de dependências ou `npm audit fix`.

## Decisão do gate

T005 está comprovada: a IMP-003 está contida na branch, T111 possui implementação e evidência reais, os contratos necessários estão disponíveis, a divergência técnica foi reconciliada e não existe divergência funcional ou dependência crítica ausente para iniciar a implementação planejada.

`T005_COMPROVADO_IMP_004_LIBERADA_PARA_IMPLEMENTACAO`

## T042 — GREEN do navegador para US1

- Execução: `collection-registration.spec.ts --grep "US1 starts"`, Chromium, um worker e zero retries, com `.env.e2e.local` carregado explicitamente e guard ativo.
- Resultado final: 1/1 cenário aprovado para `OWNER`, `ADMIN` e `MEMBER`; URL, laboratório e área contextuais foram verificados e a contagem permaneceu em uma única coleta de fixture, sem persistência pelo formulário.
- RED funcional intermediário: o navegador reportou `Illegal invocation` porque `crypto.randomUUID` havia sido desacoplado de `crypto`. A chamada foi vinculada por `() => crypto.randomUUID()` e coberta por teste unitário.
- Regressão unitária: `collection-form-state.test.ts` aprovado após a correção.
- Teardown: executado pelo `afterAll`; asserção final aprovada com `users=0`, `laboratories=0`, `memberships=0`, `areas=0`, `collections=0`.
- Aviso não bloqueante: Next.js registrou aviso de origem cruzada de desenvolvimento para assets `/_next/*`; não houve falha funcional ou de infraestrutura.

## T047 — RED funcional de US2

- T044, contratos temporais: RED válido; o shell compilou e respondeu `NOT_IMPLEMENTED` ao primeiro comportamento esperado. Não houve falha de import ou runtime.
- T045, estado do formulário: RED válido; o estado ainda avançava uma ocorrência vazia para revisão em vez de mantê-la editável com erro compreensível.
- T046, Chromium: RED válido; browser, servidor, autenticação, banco e fixture iniciaram, mas o submit vazio não produziu alerta temporal. O teste falhou na primeira asserção comportamental esperada.
- Teardown do RED E2E: `afterAll` concluiu sem erro e confirmou as cinco contagens zeradas.

## T052–T053 — GREEN de US2

- `collection-contracts.test.ts`: GREEN; body fechado, validação civil, RFC 3339, offsets `Z`/numéricos, limites, precisão, igualdade com clock, futuro, UTC e preservação do offset aprovados.
- `collection-form-state.test.ts`: GREEN; regressão US1 e validações de edição/revisão, preservação e invalidação aprovadas.
- `collection-fixture-guard.test.ts`: GREEN após explicitar `maxWait=15000` e `timeout=30000` nas transações allowlisted de setup/teardown; nenhuma operação ou allowlist foi ampliada.
- `npm run typecheck`: GREEN após corrigir dois estreitamentos em testes da própria IMP-004.
- Chromium US2: 1/1 GREEN, um worker, zero retries. Vazio, formato inválido e futuro permaneceram editáveis com mensagens acessíveis; valor válido avançou para revisão preservando texto e offset.
- Persistência: nenhum POST foi observado e a contagem permaneceu na única coleta da fixture durante o cenário.
- Teardown: `afterAll` aprovado com `users=0`, `laboratories=0`, `memberships=0`, `areas=0`, `collections=0`.
- Uma tentativa anterior ao GREEN foi classificada como infraestrutura: timeout ao iniciar a transação do setup, antes do cenário. Após limites explícitos da fixture, a repetição única passou.
- Checkpoint conjunto US1+US2: `collection-registration.spec.ts` completo em Chromium, 3/3 GREEN, um worker e zero retries; o teardown e as contagens finais foram aprovados pelo `afterAll`.

## T059 — RED funcional de US3

- Serviço: RED válido no shell `NOT_IMPLEMENTED`; testes carregaram e alcançaram a primeira criação esperada.
- POST: RED válido em resposta controlada 501 do shell; factory, imports e Request/Response funcionaram.
- Estado: RED válido nas transições compiláveis de submissão ainda `NOT_IMPLEMENTED`.
- Chromium US3: RED válido na ausência da indicação “Será registrada por você”; browser, servidor, autenticação, fixture e banco estavam operacionais.
- Teardown do RED E2E: `afterAll` concluiu e validou as cinco contagens em zero.
- `npm run typecheck`: GREEN antes das execuções RED.

## T067–T070 — GREEN de US3

- Unidade, executada por arquivo: `collections-service.test.ts`, `collection-contracts.test.ts` e `collection-form-state.test.ts` GREEN. Foram comprovados papéis contextuais, ordem de autorização, autoria/ID/confirmação server-side, replay, conflito, isolamento por autor, erro sanitizado, parser fechado, revisão, single-flight e chave estável.
- Integração injetada: `collections-route.test.ts` GREEN; `createEnvironmentalCollection` ficou em paridade com `201/200/400/401/403/404/409/500`, envelope fechado, `Location` canônico de API e `no-store`.
- PostgreSQL isolado: migration IMP-004 4/4 GREEN. Constraints de tupla/offset/FK contextual, unicidade por autor, triggers de `UPDATE`/`DELETE`, preservação legada e abort transacional sem parcial foram aprovados; cada schema temporário foi removido pelo harness.
- Concorrência real pelo POST: dois requests simultâneos com a mesma chave/autor/contexto/payload convergiram em `201` e `200`, retornaram o mesmo ID e elevaram a contagem em exatamente uma linha; replay divergente retornou `409` e não alterou a contagem.
- Chromium US3: GREEN em execuções limitadas para confirmação real com duplo clique (um POST), timeout/retry com a mesma chave, perda de acesso e concorrência/replay real. Nenhum POST ocorreu antes da confirmação explícita.
- Uma tentativa posterior de agregação dos três cenários encontrou timeout externo de rede antes do primeiro teste; foi classificada como infraestrutura e não repetida indefinidamente.
- Teardown explícito após a falha externa: PASS, com `users=0`, `laboratories=0`, `memberships=0`, `areas=0`, `collections=0`.
