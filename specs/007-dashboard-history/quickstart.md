# Quickstart de validação: Dashboard e histórico básico

Este guia será executado depois da implementação. Nesta etapa de planejamento, não acessar banco, gerar Prisma, iniciar aplicação nem executar testes funcionais.

## Pré-requisitos

- branch `007-dashboard-history` implementada a partir do plano aprovado;
- dependências já instaladas pelo fluxo normal do projeto;
- ambiente de teste isolado e explicitamente confirmado conforme os guards de fixtures existentes;
- migrations integradas das IMP-003/004 aplicadas no banco descartável;
- nenhum dado real, credencial ou ambiente compartilhado usado em fixtures.

Referências:

- contrato HTTP: [contracts/dashboard-api.openapi.yaml](contracts/dashboard-api.openapi.yaml);
- projeções e critérios de inclusão: [data-model.md](data-model.md);
- decisões e alternativas: [research.md](research.md).

## 1. Validação estática e suites rápidas

```bash
npm run typecheck
npm run lint
npm run test:unit
npm run test:integration
```

Resultado esperado:

- contrato OpenAPI válido e compatível com serializers/handlers;
- cursor, ordem, empate, limite e privacidade aprovados;
- handlers reautorizam cada leitura, usam `no-store` e sanitizam erros;
- regressões de laboratório, área e coleta continuam aprovadas.

## 2. Build

```bash
npm run build
```

Resultado esperado: aplicação compila sem introduzir dependência, schema ou migration nova e sem expor import de servidor em componente cliente.

## 3. E2E isolado da feature

Use o mecanismo de ambiente E2E seguro já adotado pelo projeto e execute:

```bash
npx playwright test tests/e2e/dashboard-history.spec.ts
```

As fixtures devem criar IDs/prefixos allowlisted, limpar em `finally`/`afterAll` e comprovar contagem final zero.

## Cenário A — resumo fiel e vazio real

Preparação:

1. criar dois laboratórios acessíveis ao participante;
2. distribuir três áreas e quatro coletas confirmadas entre eles;
3. manter um terceiro laboratório acessível sem áreas/coletas.

Validação:

1. selecionar o primeiro laboratório no workspace;
2. confirmar URL `/dashboard/laboratories/{laboratoryId}`;
3. comparar nome, estado e totais com as fontes desse laboratório;
4. ativar o total/atalho de áreas e confirmar a listagem contextual;
5. abrir o laboratório vazio e confirmar zeros apenas após o carregamento bem-sucedido.

Esperado: nenhum total mistura laboratórios; loading e erro nunca aparecem como zero; não há card fictício.

## Cenário B — histórico, origem e paginação

Preparação:

1. criar áreas com `createdAt` conhecidos;
2. confirmar coletas com `confirmedAt` conhecidos e `occurredAt` diferentes;
3. criar mais de 20 origens elegíveis e empates de timestamp entre tipos e dentro do mesmo tipo.

Validação:

1. percorrer todas as partes por “Mais antigos”;
2. retornar por “Mais recentes”;
3. repetir a travessia sem alterar fontes;
4. ativar um item de área e um de coleta.

Esperado:

- ordem por confirmação/criação, não por ocorrência nem atualização;
- cada identidade aparece exatamente uma vez e na mesma ordem;
- máximo de 20 itens por resposta;
- destinos chegam em uma ativação aos detalhes contextuais corretos;
- nenhum item de atualização, exclusão, análise ou edição do dashboard aparece.

## Cenário C — atualização e falha parcial

1. abrir o dashboard e registrar os totais/primeiro item;
2. criar uma área por seu fluxo autorizado ou confirmar uma coleta;
3. retornar ao dashboard ou usar refresh;
4. provocar falha controlada apenas no resumo e depois apenas no histórico;
5. usar retry em cada região.

Esperado: nova origem aparece sem gravar atividade manual; a região saudável permanece utilizável; a região com falha limpa seu payload, comunica indisponibilidade e recupera por retry.

## Cenário D — isolamento, revogação e inatividade

1. consultar cada laboratório e verificar que somente suas origens aparecem;
2. tentar laboratório/área/coleta cruzados;
3. remover o vínculo entre duas leituras e solicitar refresh/navegação;
4. tornar a conta inelegível;
5. consultar um laboratório inativo mantendo o vínculo.

Esperado:

- cruzado, ausente e sem vínculo permanecem indistinguíveis como `404`;
- conta inelegível não recebe dados;
- nenhum payload anterior permanece após falha de acesso;
- laboratório inativo mantém leitura/destinos, mostra “somente leitura” e omite mutações.

## Cenário E — troca concorrente de contexto

1. atrasar artificialmente a resposta do laboratório A;
2. antes da conclusão, navegar ao laboratório B;
3. liberar a resposta de A.

Esperado: nenhuma contagem ou atividade de A aparece em B; requests antigos são abortados/ignorados e o cursor é reiniciado.

## Cenário F — privacidade e escopo

Inspecionar respostas e interface.

Esperado: ausentes nome/email/avatar/ID de autor, observações, coordenadas, chaves, hashes, payload ambiental, score/classe IHFR, mapa, gráficos, IA e qualquer texto que sugira auditoria persistida.

## Cenário G — acessibilidade e responsividade

Executar em 320 px, 768 px e 1280 px, depois navegar somente por teclado e inspecionar nomes/estados com tecnologia assistiva disponível.

Esperado:

- conteúdo principal sem rolagem horizontal;
- tipo, instante e destino de cada item permanecem visíveis;
- foco perceptível e ordem coerente;
- botões de retry/paginação e links têm nomes acessíveis;
- loading, erro, vazio, atualização e somente leitura não dependem de cor/ícone.

## 4. Regressões IMP-003/004

Além das suites completas, executar explicitamente:

```bash
npx playwright test tests/e2e/area-viewing.spec.ts tests/e2e/area-registration.spec.ts
npx playwright test tests/e2e/collection-registration.spec.ts
```

Esperado: listagem/detalhe de áreas, confirmação/detalhe de coletas, cadeia contextual, inatividade, revogação e isolamento mantêm o comportamento integrado.

## 5. Avaliação humana de SC-009

Após existir build utilizável, a equipe de produto/pesquisa deve moderar cada cenário principal com participantes representativos e registrar método, amostra e resultado. A meta é pelo menos 90% identificarem laboratório, estado e origem sem ajuda. Não substituir essa evidência por teste automatizado ou inspeção do agente.

## Critério de encerramento futuro

A implementação só estará pronta quando suites, build, cenários E2E, limpeza de fixtures, diff e gates constitucionais passarem; SC-009 deve ter estado explicitamente registrado, mesmo quando sua avaliação ficar agendada separadamente por depender de participantes.
