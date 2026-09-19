# Evidências de implementação — IMP-008

**Data**: 2026-09-19

**Baseline integrada**: `origin/development@10fdb8bbb8e4895614575fedc9de8e08a5121afe`

**Merge na feature**: `46b22d183bc720c840cba8fbeb9a71b9e008bb66`

## Estado

`PARCIALMENTE_IMPLEMENTADO` — a projeção, o endpoint, o mapa/lista e os estados contextuais existem e passam por typecheck, lint, testes unitários/handler e build. Os gates que exigem PostgreSQL de teste, sessão E2E autenticada, medição real, tecnologia assistiva ou participantes permanecem `NAO_VERIFICADO` porque `TEST_DATABASE_URL` e `DATABASE_URL` não estavam disponíveis no ambiente.

## Arquitetura e contrato

- `GET /api/laboratories/{laboratoryId}/territorial-map` deriva o principal da sessão, reutiliza `authorizeLaboratoryAccess(..., "READ_AREAS")` e responde sempre com `Cache-Control: no-store`.
- A consulta Prisma ocorre somente após autorização, filtra `CollectionArea.laboratoryRoomId` e a relação filha pelo mesmo laboratório, usa uma seleção aninhada e evita query por marcador.
- Coleta confirmada exige simultaneamente `occurredAt`, `occurrenceOffset`, `confirmedAt` e `confirmationKey` não nulos. A chave participa apenas do filtro.
- O DTO contém contexto mínimo, `id`/`name`/ponto de área e `id`/instantes de coleta. Não seleciona ou publica autoria, e-mail, observações, chaves, payload ambiental, diagnóstico ou credenciais.
- Laboratório inativo permanece legível com `readOnly: true`; inexistente, cruzado e vínculo ausente/revogado usam o mesmo `404` sanitizado.
- Nenhuma tabela, migration, índice, dependência, cache de domínio ou entidade territorial foi criada.

## Interface e navegação

- A rota `/dashboard/laboratories/{laboratoryId}/map` usa a página/layout contextual integrados pela IMP-007.
- A navegação do laboratório ganhou o destino “Mapa”; o placeholder global com legenda de risco não sustentada foi removido.
- Mapa e lista derivam do mesmo array. A lista, o painel e os destinos continuam funcionais sem tiles ou módulo cartográfico.
- Seleção por mapa/lista usa `areaId`; pontos coincidentes continuam registros distintos; o enquadramento inicial usa um ou múltiplos pontos sem clustering.
- Loading, vazio, erro/retry, localização indisponível, laboratório inativo, base ausente/degradada/indisponível e falha do módulo possuem estados separados.
- A troca/retry aborta a request anterior, limpa dados/seleção e usa geração monotônica para descartar resposta tardia.
- Marcadores têm nomes únicos, controles possuem foco perceptível, a seleção é anunciada, lista usa `ul/li`, erros usam `role="alert"` e estados usam `role="status"`.

## Fronteiras preservadas

- A IMP-005 está integrada, mas `EnvironmentalMeasurementSet` e seu payload não são consultados pela IMP-008. A exclusão é uma decisão explícita de escopo.
- A IMP-007 fornece landing, navegação, guard, critério de confirmação e padrões de estado; seus endpoints de resumo/histórico não são fonte do mapa e não foram duplicados.
- A IMP-006 permanece documental e não integrada. Nenhum score, classe, risco, cor temática, legenda científica ou diagnóstico foi implementado.
- Plotly, Python, PostGIS, polígonos, filtros, clustering, geocodificação e localização própria da coleta permanecem fora.

## Verificações executadas

| Comando | Resultado | Evidência |
|---|---|---|
| `npm ci` | PASS fora do sandbox | 544 pacotes instalados; 30 vulnerabilidades do lockfile reportadas, sem `npm audit fix` por escopo |
| `npx prisma generate` | PASS | Prisma Client 7.4.2 gerado |
| `npm run typecheck` | PASS | zero erro |
| testes territoriais direcionados | PASS | 4 arquivos unitários + 1 arquivo de handler |
| `npm run test:unit` | PASS | 37/37 arquivos, 0 falha |
| `npm run test:integration` | PARCIAL | 13/14 arquivos; rota territorial passou; `environmental-data-concurrency.test.ts` falhou sem `TEST_DATABASE_URL` |
| `npm run lint` | PASS com avisos preexistentes | 0 erro, 4 warnings fora da IMP-008 |
| `npm run build` | PASS fora do sandbox | compilação, TypeScript, 15 páginas e novas rotas concluídos; primeira tentativa falhou apenas ao buscar Google Fonts |
| `git diff --check` | PASS nas alterações da IMP-008 | avisos no diff do merge pertenciam a arquivos preexistentes da IMP-007; diffs próprios limpos |

## Não verificado e risco residual

- Integração real PostgreSQL, isolamento com fixtures persistidas, corrida e limpeza: `NAO_VERIFICADO` sem `TEST_DATABASE_URL`.
- `npx playwright test tests/e2e/territorial-map.spec.ts` e regressões E2E: `NAO_VERIFICADO`; a spec dedicada ainda não foi criada porque o fluxo autenticado depende das fixtures/banco autorizados.
- p95 de 100 leituras, `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)` e interação sem tiles: `NAO_VERIFICADO`.
- Teclado em navegador real nas larguras 320/768/1280, tecnologia assistiva real e estudo moderado de usabilidade: `NAO_VERIFICADO`.
- `npm ci` reportou 30 vulnerabilidades nas dependências travadas (2 baixas, 8 moderadas, 19 altas, 1 crítica); nenhuma atualização automática foi feita por ser trabalho transversal e potencialmente incompatível.

Essas pendências impedem declarar a IMP-008 completamente validada, embora os gates estáticos, unitários, de handler e build estejam aprovados.
