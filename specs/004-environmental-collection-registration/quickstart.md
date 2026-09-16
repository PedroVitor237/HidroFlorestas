# Quickstart de validação — Registro geral de coleta ambiental

## Estado e objetivo

Este documento é o guia de execução para validar a IMP-004 quando ela for implementada. Nesta etapa, a feature está **planejada, não implementada**: os comandos funcionais abaixo não foram executados e não devem ser usados para interpretar o código atual como aderente ao contrato.

Os critérios normativos estão em [spec.md](./spec.md), as decisões técnicas em [plan.md](./plan.md), a persistência em [data-model.md](./data-model.md) e a interface HTTP em [contracts/collection-registration-api.openapi.yaml](./contracts/collection-registration-api.openapi.yaml).

## Pré-requisito comprovado

T005 foi comprovado em 2026-09-16 após a integração da IMP-003. A evidência está em [implementation-evidence.md](./implementation-evidence.md). Antes de iniciar a implementação, preserve a base integrada, que fornece:

- `CollectionArea` vinculada diretamente a laboratório;
- papéis contextuais `OWNER`, `ADMIN` e `MEMBER`;
- guard compartilhado `authorizeLaboratoryAccess`;
- permissão `CREATE_COLLECTION` em laboratório ativo;
- leitura contextual em laboratório ativo ou inativo;
- isolamento uniforme para laboratório, vínculo e área;
- autoria derivada exclusivamente da sessão.

Na criação, o mapeamento técnico obrigatório é `authorizeLaboratoryAccess(principal, laboratoryId, "CREATE_COLLECTION", tx, true)`: o literal representa a permissão dos três papéis e `mutate=true` aplica o bloqueio de laboratório inativo. A área é consultada depois pelo par `{ id, laboratoryId }`; não duplicar o guard.

Se qualquer item divergir do contrato planejado, revisar coordenadamente `spec.md`, checklist, `plan.md`, `research.md`, `data-model.md`, OpenAPI, `quickstart.md` e `tasks.md` antes de criar código consumidor. Divergência funcional de intenção, comportamento externo, permissão, escopo, requisito ou critério interrompe a implementação e retorna ao fluxo de especificação e, quando necessário, esclarecimento, planejamento e tarefas. Divergência apenas técnica pode atualizar os artefatos técnicos e tarefas afetados, desde que preserve a intenção funcional. Não criar um guard, schema alternativo ou mudança contratual silenciosa para contornar a dependência.

## Ambiente seguro

Use somente um PostgreSQL descartável e identificado como teste. Antes de qualquer conexão, o harness deve falhar fechado salvo se todas estas condições forem verdadeiras:

1. `NODE_ENV=test`;
2. `TEST_DATABASE_URL` está definida e é diferente de `DATABASE_URL`;
3. a confirmação destrutiva exigida pelo harness corresponde exatamente ao valor documentado nele;
4. nome do banco, IDs e prefixos das fixtures pertencem às allowlists da suíte.

Não copie credenciais para este documento nem imprima URLs de conexão nos logs. Setup deve começar com cleanup allowlisted; teardown deve executar em `finally`/`afterAll`, respeitar a ordem das chaves estrangeiras e confirmar contagem final zero mesmo quando um cenário falhar.

## Sequência planejada de validação

Os nomes de arquivos abaixo são os alvos definidos no plano. Eles só serão executáveis depois da implementação correspondente.

### 1. Contrato, tempo e estado de interface

```bash
node --import=tsx --test \
  tests/unit/collection-openapi-contract.test.ts \
  tests/unit/collection-contracts.test.ts \
  tests/unit/collection-form-state.test.ts
```

Resultado esperado:

- o OpenAPI 3.1 é parseável, possui exatamente dois `operationId`, referências resolvidas e schemas de objetos fechados;
- o body aceita somente `{ occurredAt }` e o header exige `Idempotency-Key` UUID;
- uma chave UUID válida inédita inicia normalmente a primeira confirmação; somente chave ausente, malformada ou fora do perfil retorna `400 INVALID_REQUEST`, enquanto chave já usada com contexto ou payload divergente retorna `409 CONFLICT`;
- `occurredAt` aceita RFC 3339 com offset explícito e até milissegundos;
- horário local sem offset, `-00:00`, segundo `60`, data impossível, precisão maior que três casas e instante futuro são rejeitados;
- ocorrência igual ao relógio injetado é aceita;
- editar e revisar não produz request nem persistência; voltar preserva valores e nova alteração invalida a revisão;
- repetição da mesma confirmação reutiliza a chave; uma nova coleta intencional usa outra chave.

### 2. Serviço e autorização

```bash
node --import=tsx --test tests/unit/collections-service.test.ts
```

Resultado esperado:

- `OWNER`, `ADMIN` e `MEMBER` atuais criam em laboratório ativo;
- laboratório inativo é somente leitura e criação retorna `409 READ_ONLY`;
- consulta permanece disponível aos membros atuais em laboratório ativo ou inativo;
- acesso revogado, IDs cruzados e recursos fora do contexto não vazam existência;
- laboratório, área, autor, confirmação e papel são derivados ou revalidados no servidor;
- primeira chave cria uma coleta; replay idêntico devolve a mesma; reuso com outro contexto ou ocorrência retorna `409`;
- confirmações concorrentes com a mesma chave convergem para um único registro;
- não existe operação de atualizar ou excluir coleta confirmada.

### 3. Migration em PostgreSQL descartável

```bash
node --import=tsx --test --test-concurrency=1 \
  tests/migration/collection-registration-migration.test.ts
```

Resultado esperado:

- base vazia e base com dados científicos legados migram sem perda;
- `laboratoryRoomId` é preenchido somente quando derivável da área e a migration aborta diante de órfão ou ambiguidade;
- linhas legadas preservam nulos na tupla de confirmação, sem ocorrência inventada;
- FK composta impede área e laboratório divergentes;
- checks impedem tupla parcial e offset inválido;
- unicidade por autor e chave impede duplicação concorrente;
- trigger impede `UPDATE` e `DELETE` de coleta IMP-004 confirmada;
- tabelas e relações legadas de água, solo, vegetação, terreno, diagnóstico e IHFR permanecem intactas;
- teardown remove somente fixtures allowlisted e termina com zero resíduos.

### 4. Rotas contextuais

```bash
node --import=tsx --test --test-concurrency=1 \
  tests/integration/collections-route.test.ts
```

Resultado esperado:

- `POST /api/laboratories/{laboratoryId}/areas/{areaId}/collections` retorna `201`, `Location` com a URI canônica da API, `Cache-Control: no-store` e `{ collection }`;
- replay idêntico retorna `200` com o mesmo ID e `Location`;
- `GET /api/laboratories/{laboratoryId}/areas/{areaId}/collections/{collectionId}` retorna o detalhe contextual imutável;
- `occurredAt` é apresentado no offset registrado e `confirmedAt` em UTC, como instantes distintos;
- respostas cobrem `400`, `401`, `403`, `404`, `409` e `500` conforme o OpenAPI;
- erro interno é sanitizado e DTO não expõe autoria, chave idempotente, timestamps legados, observações ou relações científicas;
- factories injetadas permitem provar principal exclusivo, params contextuais e nenhuma chamada extra.

### 5. Jornada no navegador

```bash
npx playwright test tests/e2e/collection-registration.spec.ts --workers=1
```

Resultado esperado:

- a jornada parte do detalhe contextual da área e abre “Registrar coleta” apenas quando a mutação é permitida;
- edição, revisão, correção e confirmação preservam foco, teclado e mensagens úteis;
- a revisão informa de forma acessível que a coleta será registrada pela pessoa autenticada, sem `userId`, email, papel global ou autoria editável;
- nenhum POST ocorre antes da confirmação explícita;
- após a confirmação, a interface valida separadamente o `Location` da API e constrói a rota `/dashboard/laboratories/{laboratoryId}/areas/{areaId}/collections/{collectionId}` com o contexto validado e o ID retornado no body, sem navegar diretamente pelo header;
- clique duplo, timeout e retry não criam duplicata;
- perda de acesso, laboratório inativo e tentativa de cruzar contexto são tratados sem vazamento;
- páginas funcionam em viewport móvel e ampla;
- `/dashboard/collects` não é transformado em listagem ou histórico.

### 6. Regressão final

```bash
npm run test:unit
npm run test:integration
npm run test:e2e -- --workers=1
npm run lint
npm run typecheck
npm run build
```

Resultado esperado: suítes da IMP-001, IMP-002, IMP-003 e IMP-004 passam no ambiente seguro, sem ampliar o contrato desta feature. SC-002 e SC-007 continuam `NAO_VERIFICADO` mesmo com automação verde; a equipe de produto/pesquisa deverá avaliá-los futuramente com participantes representativos depois de existir incremento executável em ambiente adequado, registrar as métricas na evidência e não tratar a avaliação pendente como bloqueio automático de implementação, PR ou merge.

## Inspeção manual mínima

Depois das suítes, confirme no navegador e nas respostas HTTP:

- laboratório e área aparecem como contexto visível, não como campos editáveis;
- revisão é claramente anterior à persistência;
- detalhe distingue “Ocorrência em campo” de “Confirmação no sistema”;
- laboratório inativo mostra somente leitura e não oferece nova coleta;
- não há edição, exclusão, rascunho, listagem, histórico, medição ou IHFR;
- requests autenticados e erros usam `Cache-Control: no-store`;
- logs não contêm cookie, token, chave idempotente, URL de banco ou stack retornada ao cliente.

## Validação desta etapa de planejamento

Nesta execução do `$speckit-plan`, realizar somente verificações estáticas dos documentos: presença dos cinco artefatos, ausência de placeholders e clarificações abertas, parse do YAML, resolução de referências OpenAPI, unicidade dos `operationId`, schemas fechados, escopo dos dois endpoints, coerência de links e diff restrito a `specs/004-environmental-collection-registration/**`.

Não executar nesta etapa: instalação, Prisma, migration, banco, servidor, build, lint, typecheck, testes unitários/integrados/E2E ou alteração de código.
