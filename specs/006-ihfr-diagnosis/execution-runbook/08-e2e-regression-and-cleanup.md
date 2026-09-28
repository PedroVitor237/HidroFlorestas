# 08 — E2E, regressões e limpeza

## Status inicial

PENDENTE. tests/e2e/ihfr-diagnosis-read.spec.ts e ihfr-diagnosis-manage.spec.ts existem, mas foram SKIP porque URLs/atores persistidos em schema isolado não estavam visíveis pelo servidor Next.js. As fixtures PostgreSQL de integração são descartadas ao fim do processo de teste; não sustentam uma sessão Playwright separada. O E2E territorial existe e deve rodar antes do teardown global.

## Tarefas Speckit abrangidas

T060, T114, T115, T116, T117, T118, T119, T120, T121, T122, T123, T124, T125 e T126. T060 e T116 compartilham a infraestrutura E2E persistente e nenhum dos dois aceita SKIP.

## Dependências

Etapas 01–07 com US2 e hardening verdes; para a T102 da etapa 06, a infraestrutura de fixture descrita aqui pode ser preparada antes e depois reutilizada. Banco de teste explicitamente autorizado, descartável e isolado; variáveis guardadas sem revelar valor; servidor Next.js e Playwright apontam para o mesmo schema durante a jornada.

## Estado de entrada esperado

API/UI funcionais, migrations e contratos validados; harness tests/fixtures/postgresql-schema-lifecycle.ts e fixtures de atores/contextos/domínio disponíveis. Nenhum processo antigo de Next.js/Playwright ocupa a porta de teste. O arquivo não rastreado da IMP-005 permanece intocado.

## O QUÊ

Criar/usar fixtures E2E persistentes para OWNER, ADMIN contextual, MEMBER, laboratório inativo, diagnóstico presente/ausente e ciclo completo; executar E2E IHFR sem SKIP, regressões IMP-003/004/005/007/008, suíte geral, typecheck/lint/build; descartar schema e provar zero resíduo.

## POR QUÊ

Um teste que só roda com fixture em memória do processo Node não valida a página servida por Next.js. As entregas vizinhas compartilham autorização, schema, página de coleta e infraestrutura; precisam regressão antes de destruir o ambiente de teste. Limpeza verificável impede que fixture/servidor residual contamine execução seguinte.

## Arquivos que provavelmente serão alterados

tests/fixtures/ihfr-diagnosis-fixtures.ts, postgresql-schema-lifecycle.ts ou novo helper E2E restrito dentro de tests/fixtures/; tests/e2e/ihfr-diagnosis-read.spec.ts, ihfr-diagnosis-manage.spec.ts e, se necessário, playwright.config.ts sem enfraquecer outras suítes. tests/integration/dashboard-routes.test.ts é a superfície real para o teste da ausência de IHFR no dashboard. Registrar em [implementation-evidence.md](../implementation-evidence.md).

## Procedimento ordenado

1. Confirmar banco de teste com guard existente, NODE_ENV=test, URL de teste distinta/autorizada e confirmação literal. Criar schema imp006_test_<uuid> por execução, aplicar cadeia de migrations e semear fixtures explícitas. Definir como o mesmo schema será selecionado pelo processo Next.js e pelo seed/test runner; verificar por query de leitura que ambos enxergam a mesma coleta antes de iniciar Playwright. Não copiar credenciais para logs, não usar public compartilhado e não depender de IDs hardcoded de outra execução.
2. Persistir atores OWNER, ADMIN contextual e MEMBER com conta ACTIVE/vínculo atual; outsider e vínculo revogado; laboratórios ativo/inativo; duas áreas/coletas próprias e cruzadas; conjunto ambiental confirmado presente/ausente; diagnóstico CURRENT, ausência e históricos SUPERSEDED/REVOKED. Gerar URLs contextuais e IDs de fixture em canal local restrito ao processo, sem publicá-los na evidência. Preparar casos para CREATE/REPLACE/REVOKE/recovery e conflitos.
3. Iniciar servidor Next.js com configuração do schema isolado, esperar readiness e confirmar uma leitura contextual autenticada. Iniciar Playwright apontando ao servidor da mesma execução. Em finally, parar Playwright/Next.js, fechar pools e descartar schema mesmo se readiness ou teste falhar. Não desabilitar triggers de imutabilidade.
4. Executar definitivamente tests/e2e/ihfr-diagnosis-read.spec.ts e ihfr-diagnosis-manage.spec.ts. A T060 exige presente/ausente, laboratório inativo, rótulos, privacidade, teclado e responsividade; a T116 exige OWNER/ADMIN/MEMBER, CREATE/REPLACE/REVOKE/recovery, foco, erro/conflito/insuficiência/incompatibilidade. Verificar contagem SKIP=0; execução omitida ou SKIP mantém ambas abertas.
5. Executar testes de contrato/unitários completos (test:contract criado na etapa 07 ou comando node --import=tsx --test tests/contract/*.test.ts; npm run test:unit; e explicitamente node --import=tsx --test tests/unit/ihfr-diagnosis-read-accessibility.test.tsx). O script test:unit atual usa tests/unit/*.test.ts e não inclui .tsx. Executar integração/migration PostgreSQL completas (npm run test:integration; npm run test:migration). Registrar separadamente totais, duração, falhas, guards e teardown por suíte; não interpretar guard ausente como PASS.
6. Regressão IMP-003: tests/integration/areas-route.test.ts, laboratory-context-access.test.ts, laboratory-memberships-route.test.ts e E2E area-registration/area-viewing/laboratory-membership-roles, conforme scripts/fixtures autorizados. Verificar autenticação, laboratório, papéis e isolamento.
7. Regressão IMP-004: tests/integration/collections-route.test.ts, tests/migration/collection-registration-migration.test.ts e tests/e2e/collection-registration.spec.ts; confirmar confirmação/detalhe, origem e imutabilidade.
8. Regressão IMP-005: tests/integration/environmental-data-route.test.ts e environmental-data-concurrency.test.ts, tests/migration/environmental-data-migration.test.ts e E2E environmental-data-read/registration; confirmar parser, captura/leitura, idempotência e imutabilidade sem novo IHFR automático.
9. Regressão IMP-007: tests/integration/dashboard-routes.test.ts, tests/unit/dashboard-{contracts,service}.test.ts e tests/e2e/dashboard-history.spec.ts. Acrescentar assertion nesse teste de integração, se necessário, para garantir que resumo/histórico continuam derivados apenas de AREA_CREATED/COLLECTION_CONFIRMED, sem evento, score, classe ou projeção IHFR. Não criar dashboard-api.test.ts sem lacuna concreta.
10. Regressão IMP-008: tests/unit/territorial-map-*.test.ts, tests/integration/territorial-map-route.test.ts e tests/e2e/territorial-map.spec.ts, com tiles interceptados. Verificar lista textual/endpoint privados, mapa sem score/classe/risco/cor diagnóstica/landUseType/payload ambiental/auditoria. Rodar E2E territorial antes do teardown, com servidor e fixture ainda vivos.
11. Executar npm test, npm run test:migration, npm run typecheck, npm run lint e npm run build. Se build depender de rede externa, registrar falha ambiental com evidência; não a declarar GREEN. Reexecutar somente após remover a causa concreta. Inspecionar warnings existentes separadamente de erros.
12. Em finally, descartar o schema allowlisted da execução via lifecycle, verificar ausência em catálogo, zero registros órfãos e zero processos Next.js/Playwright/test runner/pools remanescentes. Não usar DROP em schema não marcado como pertencente à execução. Registrar que triggers nunca foram desabilitados. Após cleanup, confirmar git status e que nenhum arquivo de fixture sensível ficou no checkout.

## Regras e invariantes

T060 e T116 exigem navegador real e fixture persistente acessível ao Next.js. Não usar SKIP como conclusão, não compartilhar public, não mudar tests para contornar autenticação, não desligar trigger. Regressões ocorrem antes do teardown; zero resíduo é parte do aceite, inclusive no caminho de falha. Dashboard/mapa não recebem IHFR nesta entrega.

## Testes obrigatórios

Os comandos/arquivos das etapas 4–11, com PASS/FAIL/SKIP por suíte. Mínimo: E2E das duas jornadas IHFR e territorial-map.spec.ts, contrato, unitário, integração, migration, regressões 003/004/005/007/008, typecheck, lint e build. Revisão humana real de leitor de tela/usabilidade permanece verificação separada.

## Evidências que devem ser registradas

HEAD, schema identificável apenas por nome não sensível, confirmação de visibilidade Next.js, atores por papel sem PII, contagens de E2E PASS/FAIL/SKIP, matriz por IMP, comandos/exit codes, logs sanitizados de erro, zero schemas/órfãos/processos e status de triggers. Não publicar cookies, URLs de banco ou payload ambiental.

## Condições de parada

Servidor e runner enxergam schemas diferentes, fixture em public, SKIP em E2E obrigatório, regressão material, quebra de isolamento, processo remanescente ou falha de teardown. Mesmo após falha, executar finally de limpeza antes de encerrar a etapa.

## Critérios de conclusão

T060/T116 executadas GREEN sem SKIP, regressões de cinco IMPs e suíte geral verdes, typecheck/lint/build aprovados, teste territorial antes do teardown, schema/órfãos/processos zerados e triggers ativos. Falhas não resolvidas permanecem explicitamente pendentes.

## Estado de saída esperado

Ambiente de teste limpo e evidência técnica completa, pronto para revisão documental/merge na etapa 09.

## Checkpoint/commit sugerido

Sugestão futura: test(ihfr): complete browser and cross-feature regression with cleanup. Escopo: fixtures, E2E, regressões necessárias e evidência; sem commit nesta execução.
