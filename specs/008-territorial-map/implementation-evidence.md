# Evidências de implementação — IMP-008

**Data**: 2026-09-19

**Baseline integrada**: `origin/development@10fdb8bbb8e4895614575fedc9de8e08a5121afe`

**Merge na feature**: `46b22d183bc720c840cba8fbeb9a71b9e008bb66`

## Estado

`IMPLEMENTADO_COM_GATES_HUMANOS_E_DE_PERFORMANCE_PENDENTES` — a projeção, o endpoint, o mapa/lista e os estados contextuais existem e passam por typecheck, lint, testes unitários, integração PostgreSQL, E2E autenticado, regressões e build. Permanecem `NAO_VERIFICADO` a medição p95/`EXPLAIN`, a avaliação com tecnologia assistiva real e o estudo moderado com participantes.

## Banco e migrations

- O banco autorizado possuía a migration histórica `20260523010444_init`, ausente do repositório, e schema legado com 3 usuários, zero laboratórios, vínculos, áreas e coletas.
- `prisma migrate deploy` preservou essa entrada histórica e aplicou `20260907120000_unique_laboratory_access_code`, `20260914000100_area_registration_and_membership_roles`, `20260915000100_collection_registration_metadata` e `20260917000100_environmental_measurement_set`.
- O pós-deploy confirmou `Database schema is up to date!`.
- Após integração e E2E, permaneceram 3 usuários preexistentes e zero laboratórios, vínculos, áreas, coletas e medições de fixtures.

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
| `npm run test:integration` | PASS | 48/48 testes; inclui concorrência PostgreSQL real e rota territorial |
| `npx playwright test tests/e2e/territorial-map.spec.ts` | PASS | 3/3 cenários; lista/mapa, coleta parcial, isolamento, inativo, tiles, teclado e 320/768/1280 |
| regressões E2E de áreas/coletas | PASS | 18/18 testes em `area-registration`, `area-viewing` e `collection-registration` |
| `npm run lint` | PASS com avisos preexistentes | 0 erro, 4 warnings fora da IMP-008 |
| `npm run build` | PASS fora do sandbox | compilação, TypeScript, 15 páginas e novas rotas concluídos; primeira tentativa falhou apenas ao buscar Google Fonts |
| `git diff --check` | PASS nas alterações da IMP-008 | avisos no diff do merge pertenciam a arquivos preexistentes da IMP-007; diffs próprios limpos |

## Não verificado e risco residual

- p95 de 100 leituras, `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)` e interação sem tiles: `NAO_VERIFICADO`.
- Teclado e overflow foram automatizados em navegador nas larguras 320/768/1280. Tecnologia assistiva real e estudo moderado de usabilidade permanecem `NAO_VERIFICADO`.
- `npm ci` reportou 30 vulnerabilidades nas dependências travadas (2 baixas, 8 moderadas, 19 altas, 1 crítica); nenhuma atualização automática foi feita por ser trabalho transversal e potencialmente incompatível.

Essas pendências impedem declarar cumpridas as metas humana e de performance, mas os gates funcionais, de segurança automatizada, integração PostgreSQL, E2E, regressão e build estão aprovados.
