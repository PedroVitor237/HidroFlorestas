# Evidências de implementação da IMP-003

## Estado e escopo

- Data: 2026-09-14.
- `EVIDENCIA_IMPLEMENTACAO`: execução iniciada; funcionalidades ainda não implementadas.
- Autorização: solicitação do usuário nesta tarefa para implementar IMP-003 no checkout atual, preservar escopo, validar backend/build/ESLint e não realizar commit.
- Fonte funcional: spec, plano, pesquisa, modelo, OpenAPI, quickstart e tarefas desta feature. Constituição e instruções do projeto continuam aplicáveis.

## Baseline — T001–T003

- Checkout inicial: `development`, HEAD `a274c2a`, árvore versionada limpa.
- Referências remotas atualizadas via fetch, sem push.
- Checkout atual: `003-area-registration-and-viewing`, HEAD `7b71346b571afc32feac452545022da14fcfa549`, rastreando a branch homônima de origin.
- `origin/development`: `f440282a9aefbbb85b5199d0610fdb9ecab3dc87`, integrado à base da feature.
- Outro worktree preservado: `HidroFlorestas-002-criar-laboratorio`, branch `002-criar-laboratorio`, HEAD `c5d3871`.
- Inventário de alterações previstas: arquivos explicitamente enumerados em `plan.md` e tarefas T001–T112; schema/migration, serviços e APIs contextualizados, UI de contexto/membros/áreas, testes e documentação desta feature.
- Node `v20.19.2`; npm `9.2.0`.
- Manifesto/lockfile da branch fixam ESLint `9.39.5`; instalação herdada do checkout anterior executava ESLint `10.0.2`.
- Lint inicial: falha de ferramenta em `react/display-name` (`contextOrFilename.getFilename is not a function`), antes de estabelecer uma baseline válida. Reinstalação conforme lockfile concluída; nenhuma versão ou lockfile alterado para contornar o drift de node_modules.
- Pré-requisitos Spec Kit: PASS com `SPECIFY_FEATURE_DIRECTORY=specs/003-area-registration-and-viewing`.
- Checklist `requirements.md`: 16 marcados, zero pendentes; não modificado.

## Segurança e isolamento — T004

- Auditoria estática: fixtures exigem `NODE_ENV=test`, confirmação específica e URLs de teste/desenvolvimento distintas; teardown usa IDs e nomes/emails de fixtures allowlisted. Playwright injeta `TEST_DATABASE_URL` no servidor e usa um worker sem retries.
- Limite observado: o guard compara URLs normalizadas completas; isso não prova sozinho que apontam para bancos fisicamente distintos, pois credenciais/parâmetros/aliases podem diferir para o mesmo banco. Não declarar isolamento aprovado somente por esse teste.
- Neste checkout, `TEST_DATABASE_URL`, `TEST_DATABASE_CONFIRMATION` e `E2E_USER_PASSWORD` estão ausentes do ambiente do processo e do `.env`. Valores de configuração não foram exibidos.
- O recurso Neon isolado ainda não foi identificado/verificado nesta execução. A afirmação documental de ausência de produção não foi verificada externamente.
- Docker CLI existe, mas acesso ao daemon foi negado também fora do sandbox. Nenhum container criado.
- Nenhuma conexão com banco da aplicação foi realizada; nenhuma fixture ou migration aplicada.

## Histórico e migration — T005

- Única migration versionada: `20260907120000_unique_laboratory_access_code`, que cria índice sobre tabela já existente; não representa bootstrap completo de banco vazio.
- Histórico aplicado e drift: ainda não consultados por ausência de recurso isolado confirmado.
- Preflight, recuperação e backup/PITR de banco persistente são gates futuros de deploy. Testes devem usar banco descartável e limpeza comprovada.

## RED/GREEN

Nenhum ciclo funcional executado. Falhas de ambiente não contam como RED funcional.

## Validações

Verificações da baseline, sem converter seus resultados em conclusão da IMP-003:

| Verificação | Resultado |
|---|---|
| `npm ci --no-audit --no-fund` | PASS fora do sandbox, 538 pacotes. Primeira tentativa falhou por EPERM ao executar esbuild. |
| `npm run lint` | PASS, zero erros, quatro warnings preexistentes abaixo. |
| `npm run test:unit` | PASS, oito arquivos reportados pelo runner, zero falhas. |
| `npm run test:integration` | PASS, seis arquivos reportados pelo runner, zero falhas; handlers com dependências injetadas, não validação de banco real. |
| `npm run build` | PASS com acesso de rede autorizado; primeira tentativa falhou ao baixar Poppins. Prisma Client gerado e rotas compiladas. |
| `npm run typecheck` | PASS após build gerar `next-env.d.ts`; primeira tentativa sem esse artefato ignorado reportou tipos de imports PNG ausentes. |
| Migration / E2E / banco real | Não executados; isolamento e configuração pendentes. |

Warnings de `@typescript-eslint/no-unused-vars`: `error` em `src/app/api/auth/sign-up/route.ts:37`; `ShieldCheck` em `src/app/page.tsx:10`; `useAuth` em `src/components/user-profile/index.tsx:1`; `className` em `src/components/white-box/index.tsx:12`. Preservados por serem preexistentes e fora do recorte funcional atual.

Nenhum hook em `.specify/extensions.yml`: arquivo ausente.

## Bloqueios e próximo passo

- T004/T005 pendentes: confirmar recurso de teste seguro e histórico aplicado antes de acesso ao banco e da fase de fundamentos.
- As tarefas estabelecem: “nenhuma história começa antes de T006–T019 concluírem com banco descartável limpo”. Não ultrapassar esse gate por inferência.
- SC-009 e SC-010 permanecem `NAO_VERIFICADO`, dependentes de validação humana futura.

## Estado final

T001–T003 concluídas; T004–T005 parcialmente auditadas e pendentes de ambiente seguro. Demais tarefas não executadas. Execução aguardando configuração do banco isolado solicitado ao usuário; não houve relaxamento de gates.

Arquivos versionáveis alterados: este ledger e `tasks.md`. Nenhuma alteração funcional, de schema ou de manifesto/lockfile. Sem commit, push, deploy ou modificação de dados persistentes.


## Retomada em 2026-09-15 — checkpoint preservado

Esta seção atualiza o estado acima, que registra a primeira interrupção.

- Usuário criou e autorizou a branch Neon `imp-003-test`; configuração em `.env.test.local`, ignorada pelo Git, com permissão 0600. A conexão não substitui `DATABASE_URL` de desenvolvimento.
- Consulta somente leitura confirmou endpoint distinto (normalizando alias pooled), tabelas do baseline e zero laboratórios, áreas e coordenadas. Não se presume isolamento apenas pela senha ou query string.
- Histórico aplicado na branch: `20260523010444_init`; índice único de `accessCode` ausente. Repositório contém apenas a migration incremental IMP-002. Reconciliação será limitada à branch de teste; base vazia dos ensaios usa SQL de baseline gerado do schema anterior, sem alegar recuperação do histórico original.
- Guard de fixtures reforçado: credenciais, parâmetros e alias pooled não tornam o mesmo banco um destino diferente. RED observado: `Missing expected exception`; GREEN: 9 testes.
- Preflight puro: shell importável validado; RED de 4 testes por comportamento ausente; implementação passou nos 4 casos (limites, vínculos, referências e coordenadas). CLI operacional ainda será completada.
- Migration: shell SQL produziu RED funcional por ausência de `role` e por não rejeitar coordenadas inválidas. Após implementação, 2 testes reais passaram no Neon, incluindo conversão decimal, OWNER/MEMBER, índice, rollback e exclusão administrativa. Schemas temporários exclusivos foram removidos no finally com contagem zero verificada.
- Prisma format, validate e generate passaram após o novo schema.
- Fixtures: shell importável validado; RED observado por `NOT_IMPLEMENTED`; teste da estrutura passou após implementação. Setup/teardown real da T019 ainda não executado no checkpoint.
- Nenhuma migration aplicada ao schema public nem ao banco de desenvolvimento até este checkpoint. Sem commit ou push.


### Fechamento operacional dos fundamentos

- `prisma migrate deploy` executado somente em `imp-003-test`: migrations IMP-002 e IMP-003 aplicadas com sucesso, sem reset e preservando o histórico inicial remoto. Banco de desenvolvimento não alterado.
- T019: contagens anteriores zero; setup real 4 usuários/3 laboratórios/7 vínculos/3 áreas; teardown real com zero em todas as categorias.
- Typecheck após retomada: PASS.
- CLI somente leitura do preflight adicionada; não imprime dados pessoais nem conexão. Ensaios de dados legados permanecem no harness isolado porque o public de teste já está migrado.
- T020: shell importável e RED funcional do parser de transições registrados; implementação em andamento.

## Retomada final em 2026-09-15

### Implementação observada

- Papéis contextuais `OWNER`, `ADMIN` e `MEMBER`, proprietário único, promoção/rebaixamento com compare-and-set e bloqueio de mutações em laboratório inativo foram implementados em schema, serviço, handlers e UI.
- O contexto do laboratório é derivado da URL e revalidado no servidor a cada operação. Identidade e escopo vêm de `requireAuth()` e do vínculo atual; IDs de usuário enviados pelo cliente não são aceitos.
- Cadastro de área aceita somente DTO allowlisted, persiste autoria e laboratório derivados no servidor e valida coordenadas, limites e opcionais. Listagem e detalhe usam consultas subordinadas ao laboratório e DTOs sem autoria, e-mail, código de acesso, CEP, imagem ou estado legado.
- O mapa é client-only, mantém entrada manual funcional sem tiles, preserva atribuição e protege contra resposta tardia da geolocalização. A listagem mock antiga foi removida.
- O contrato OpenAPI 3.1 contém cinco operações, referências locais resolvidas, schemas fechados, exemplos públicos concretos e respostas `500 INTERNAL_ERROR` sanitizadas com `no-store`.

### Validações finais observadas

| Verificação | Resultado |
|---|---|
| OpenAPI isolado | PASS, 1 arquivo, 2 asserções de conformidade |
| `npm run test:migration` | PASS, 5/5 cenários em schemas temporários Neon; teardown do harness concluído |
| `npx prisma validate` | PASS |
| `npm run typecheck` | PASS |
| `npm run test:unit` | PASS, 17/17 arquivos |
| `npm run test:integration` | PASS, 8/8 arquivos, concorrência 1 |
| `npm run lint` | PASS, zero erros e os mesmos quatro warnings da baseline |
| `npm run build` | PASS, Prisma Client gerado e 22 rotas/páginas compiladas |
| `git diff --check` | PASS |

### E2E e estado do Neon

- Antes desta retomada, as suítes da IMP-003 passaram separadamente no recurso autorizado: 2 cenários de papéis e 5 cenários de área/contexto/mapa, com fixtures removidas ao final.
- Na tentativa final conjunta, o setup falhou antes dos cenários com `TableDoesNotExist`. Uma consulta posterior mostrou as tabelas base presentes, mas `prisma migrate status` informou as migrations IMP-002 e IMP-003 como pendentes. Isso indica que o estado migrado anteriormente observado no schema público da branch de teste não estava mais presente.
- O runner registrou 2 falhas de setup e 5 cenários não executados. Não houve falha funcional dentro de um cenário.
- Foram solicitadas uma reprodução allowlisted e a reaplicação das migrations somente na branch Neon `imp-003-test`; ambas as execuções foram recusadas pelo controle de autorização. Por isso, a contagem final de fixtures e órfãos não foi reconfirmada nesta última tentativa.

### Segurança e escopo

- Nenhuma URL ou credencial foi adicionada ao diff; `.env.test.local` permanece ignorado e não rastreado. `docs/raw/**` não foi alterado.
- A varredura encontrou credenciais apenas em arquivos locais ignorados e URLs fictícias em testes. Como a credencial do Neon foi compartilhada no chat e coincide com uma credencial local usada por outro endpoint, ela deve ser rotacionada no Neon.
- Nenhum `npm audit fix`, commit, push, PR, merge, reset ou alteração de produção foi executado.
- A dependência `yaml@2.8.1` foi adicionada como dev dependency exclusivamente para interpretar e validar semanticamente o OpenAPI; as versões de Leaflet permanecem exatamente `1.9.4` e `5.0.0`.

### Pendências honestas

- Reaplicar as migrations pendentes na branch Neon de teste e reexecutar as duas suítes E2E para recuperar o gate final.
- Confirmar contagens finais zero e ausência de órfãos após essa execução.
- Os arquivos separados previstos para testes de contexto e visualização não foram criados; a cobertura correspondente está consolidada em `tests/e2e/area-registration.spec.ts`.
- `SC-009` e `SC-010`: `NAO_VERIFICADO`, dependem de participantes reais e ficam como acompanhamento futuro.
- A implementação local está pronta para revisão, mas a IMP-003 não deve ser declarada 100% concluída enquanto o gate E2E final acima permanecer bloqueado.

### Gate de continuidade para IMP-004

- `area.id` permanece UUID opaco e estável; área mantém FK obrigatória para laboratório e autoria interna derivada da sessão.
- As rotas canônicas são `/api/laboratories/{laboratoryId}/areas` e `/api/laboratories/{laboratoryId}/areas/{areaId}`; consultas de detalhe usam conjuntamente os dois IDs.
- O guard revalida conta ativa, vínculo, papel e estado do laboratório no servidor. Laboratório inativo permite leitura para membro atual e bloqueia mutação; recurso inacessível ou cruzado retorna `404` uniforme.
- Os DTOs públicos permanecem mínimos e não expõem autoria nem campos privilegiados. Esses contratos estão adequados para a IMP-004, condicionado ao restabelecimento do gate E2E descrito acima.

## Encerramento do bloqueio E2E em 2026-09-15

- Causa raiz confirmada: o harness usava `SET search_path` em conexão pooled Neon. O backend do pool reutilizou a sessão depois que o schema temporário foi removido, levando Prisma a procurar `LaboratoryRoom` em um schema inexistente.
- Correção: migration harness e E2E passaram a usar o endpoint direto; o harness executa `RESET search_path` e `RESET statement_timeout` antes de remover o schema e liberar a conexão. O guard de separação entre desenvolvimento e teste foi preservado.
- Migration após a correção: 5/5 cenários passaram novamente, com schemas temporários removidos.
- E2E final conjunto: 12/12 cenários passaram em 2,1 minutos, um worker e zero retries. Tiles públicos foram interceptados; os cenários cobriram papéis, concorrência, inatividade, contexto explícito, reload, revogação, cruzamento, criação, geolocalização, fallback, lista, detalhe e viewports 390/768/1440.
- Teardown final: `users=0`, `laboratories=0`, `memberships=0`, `areas=0` para a allowlist da IMP-003.
- Integridade final no banco E2E: zero áreas órfãs, zero vínculos órfãos e tabela legada `Coordinates` ausente.
- Regressões finais: 17/17 arquivos unitários e 9/9 arquivos de integração passaram; contratos de autenticação, papéis globais e operações da IMP-002 permaneceram verdes. A transação real de exclusão administrativa está coberta no teste de migration e confirma commit aceito pela trigger diferível.
- Paridade final: OpenAPI, handlers, tipos públicos e quickstart descrevem as mesmas cinco operações, códigos de erro, DTOs fechados, contexto, coordenadas e política `no-store`.
- O bloqueio anterior está resolvido. A IMP-003 satisfaz os gates técnicos automatizados; `SC-009` e `SC-010` continuam `NAO_VERIFICADO` por dependerem de participantes reais, conforme previsto, sem bloquear a conclusão técnica.
