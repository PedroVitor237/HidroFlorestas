# 07 — Contratos, migration e segurança

## Status inicial

PENDENTE. tests/contract/ ainda não existe e package.json não define test:contract. Há migration, preflight, fixtures e alguns testes PostgreSQL focais; faltam os testes transversais de contrato, constraints, imutabilidade, rollback, segurança e privacidade exigidos por [tasks.md](../tasks.md).

## Tarefas Speckit abrangidas

T104, T105, T106, T107, T108, T109, T110, T111, T112 e T113.

## Dependências

US2 GREEN na [etapa 06](06-us2-green-checkpoint.md). OpenAPI 3.1, schema JSON do suplemento confirmado, ambos os manifestos, migration e [data-model.md](../data-model.md) são fontes do contrato. Banco de teste isolado e autorizado, cadeia real de migrations e triggers ativos.

## Estado de entrada esperado

Implementação aceita as seis operações e sete comportamentos e executa transações. Tests/migration/ihfr-diagnosis-preflight.test.ts e harness de schema isolado existem; nenhum teste novo deve exigir produção ou schemas compartilhados.

## O QUÊ

Criar tests/contract/ e testes de API/schema/manifestos; provar em PostgreSQL vazio e com legado FKs, uniques, cardinalidade, ponteiro, ledger, triggers, rollback, teardown; fechar matriz de segurança e privacidade com areaId coerente.

## POR QUÊ

Testes de história verificam jornadas, mas não necessariamente detectam drift de contrato, constraint ausente, vazamento por replay ou falha de teardown. A migration precisa preservar dados antigos e proteger invariantes mesmo quando a aplicação erra.

## Arquivos que provavelmente serão alterados

Criar tests/contract/ihfr-diagnosis-openapi.test.ts, ihfr-diagnosis-input-schema.test.ts e ihfr-diagnosis-manifests.test.ts. Se fizer sentido ao runner local, adicionar test:contract em package.json apontando apenas para tests/contract/*.test.ts; manter scripts existentes. Criar tests/migration/ihfr-diagnosis-{migration,constraints,immutability,rollback}.test.ts e tests/integration/ihfr-diagnosis-{security,privacy}.test.ts; ampliar tests/integration/ihfr-diagnosis-fixture-lifecycle.test.ts. Alterar produto/migration somente diante de defeito demonstrado, preservando ordem e histórico publicado.

## Procedimento ordenado

1. Fazer parsing e validação OpenAPI 3.1 com biblioteca já instalada ou validação local suficiente. Contar seis pares path+método e sete comportamentos, discriminação CREATE/REPLACE, expected ID ausente/null versus UUID, headers no-store, 400 eligibility, 200/201, 401/403/404/409/422/500 e schemas fechados. Conferir cada $ref e DTO publicado contra resposta real. Incluir teste que detecte a divergência atual do PublicDiagnosis (campos de origem/decomposição, versions/scientificLabels, displayScore e dataQuality) e só o tornar GREEN após reconciliação explícita; a existência de GET current/detail não comprova conformidade contratual. Não adicionar dependência sem necessidade concreta.
2. Validar schema JSON Draft 2020-12 do suplemento confirmado: required inputContractVersion/landUseType/provenance, additionalProperties=false em todos os objetos, sete enums exatos, observedAt e kind; candidato HTTP ausente/null deve produzir insuficiência sem satisfazer schema confirmado. Rejeitar aliases, caixa alternativa, OTHER(S) e campos derivados do servidor.
3. Reproduzir hashes por canonicalização independente: v0.1.1 = sha256:f8104143f1505aceaa68a7ffa06fac50f4906cdfc4119609875d99c9fecc6f89; v0.1.0 = sha256:5285d52ec70e0b0f8a951d40dd54f052e02be1556dd310e3cef0b3b4f6bc684b. Comparar fórmula, pesos e scores para provar que a diferença normativa é somente política de validação; v0.1.0 não pode ser selecionada para diagnóstico novo.
4. Em schema descartável vazio, aplicar a cadeia real de migrations; em outro com baseline legado, repetir. Antes/depois, comparar contagens e campos legados. Exigir zero backfill de IHFR experimental, nenhuma alteração de IHFRDiagnosis legado/EnvironmentalMeasurementSet e ordem real incluindo migrations de administração já integradas. Não marcar migration aplicada manualmente.
5. Consultar catálogo PostgreSQL e testar por INSERT/UPDATE/DELETE controlados: FKs RESTRICT, contexto coleta/conjunto coerente, UNIQUE(collectionDataId,payloadHash), FK diagnosis.inputSupplementId sem UNIQUE, múltiplos diagnósticos compatíveis por suplemento, PK de ponteiro por coleta, UNIQUE(actorUserId,idempotencyKey), referência operação/diagnóstico e triggers de contexto. Um segundo CURRENT e cruzamento entre coletas devem falhar no banco.
6. Provar append-only de suplemento, diagnóstico, operação terminal e evento por tentativas de UPDATE/DELETE recusadas com triggers ativos. Revogação e substituição devem mudar somente ponteiro e inserir eventos/novos snapshots; não editar histórico. Verificar que triggers não foram desabilitados no setup/teardown.
7. Separar quatro mecanismos: rollback transacional de falha de escrita (zero parcial); limpeza entre cenários de fixture (sem mexer em dados alheios); reversão de migration somente em schema descartável, com ausência de objetos parciais; recuperação operacional de produção como procedimento distinto, não executado sem autorização específica. Injetar falha de teste e provar finally descartando schema e fechando pools/processos.
8. Segurança: IDs forjados, laboratório/área/coleta/diagnóstico cruzados, vínculo ausente ou revogado, User.status inativo, MEMBER escrevendo, laboratório inativo, replay e operation após perda de autorização. Ausente e inacessível devem compartilhar status/corpo 404, sem consulta global por chave. Papel global ADMIN não substitui OWNER/ADMIN do vínculo.
9. Privacidade: inspecionar JSON de current/detail/write/replay/operation e HTML. Proibir ator, userId, Idempotency-Key, requestHash, payloadHash interno, payload ambiental completo, motivo de revogação, evento/evidence restritos, SQL e credencial. PublicDiagnosis.areaId é obrigatório e igual à área da coleta resolvida no servidor, nunca ao valor enviado pelo cliente. Testar tentativa de forjar areaId e área de outro laboratório.

## Regras e invariantes

Sem backfill e sem promoção de legado. Não alterar manifesto histórico ou hash para satisfazer teste. Evidência restrita fica em tabelas internas; não publicar endpoint de auditoria. Triggers sempre ativos. Um teste que consulta apenas o texto da migration precisa ser complementado por comportamento PostgreSQL para constraints e imutabilidade. A política de produção não é inferida do harness de teste.

## Testes obrigatórios

Executar os novos tests/contract/*.test.ts pelo script definido ou node --import=tsx --test; npm run test:migration e os arquivos integration de security/privacy/fixture-lifecycle com banco isolado; npm run typecheck. Registrar PASS/FAIL/SKIP de cada classe. Regressão geral fica para etapa 08.

## Evidências que devem ser registradas

Versão OpenAPI, contagem de operações/comportamentos, hashes reproduzidos, resultado de validação de schema, nomes de constraints/triggers consultados, contagens antes/depois do legado, matriz de ataques 401/403/404/409, amostras de DTO sanitizadas, schemas criados/removidos, zero órfãos e processos encerrados.

## Condições de parada

Migration altera legado, trigger pode ser desabilitado, duplicação de CURRENT, cardinalidade 1:N bloqueada, contexto cruzado aceito, 404 distinguível, replay vaza após revogação, areaId incoerente ou teardown deixa schema/processo. Tratar como defeito material antes de prosseguir.

## Critérios de conclusão

Três testes de contrato, quatro testes de migration, matriz de segurança/privacidade e lifecycle de falha executam GREEN em banco isolado, sem SKIP obrigatório; imutabilidade, zero backfill, cardinalidade, rollback e proteção de DTO são observados.

## Estado de saída esperado

Contrato e banco protegidos por testes comportamentais e catálogo, prontos para E2E completo e regressões de entregas vizinhas.

## Checkpoint/commit sugerido

Sugestão futura: test(ihfr): lock API database and privacy invariants. Escopo: tests/contract, testes migration/integration e script de teste se necessário; sem commit nesta execução.
