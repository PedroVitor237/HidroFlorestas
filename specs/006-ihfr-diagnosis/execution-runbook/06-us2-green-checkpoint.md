# 06 — Checkpoint GREEN da US2

## Status inicial

PENDENTE. T065–T076 documentam RED comportamental; T077–T082 estão GREEN focal para manifesto, parser e avaliador. Serviço de escrita, handlers e UI ainda não satisfazem as suítes. E2E de gestão registrou SKIP, não PASS.

## Tarefas Speckit abrangidas

T099, T100, T101, T102 e T103.

## Dependências

Etapas [02](02-write-authorization-and-eligibility.md) a [05](05-management-ui-and-accessibility.md) implementadas. PostgreSQL isolado e autorizado com fixtures explícitas; para E2E, preparar antecipadamente a infraestrutura persistente descrita na etapa 08, sem executar a T060 antes da etapa 08. Manter schema/servidor vivos somente durante o bloco E2E, com finalização garantida.

## Estado de entrada esperado

Seis rotas ligadas ao serviço, no-store em respostas, transações de escrita sem stubs, UI com ações contextuais. RED anteriores preservados como evidência histórica; novos testes devem alcançar os pontos de comportamento e o banco reais.

## O QUÊ

Converter a US2 de RED para GREEN na ordem unitário → integração PostgreSQL → concorrência → replay → falhas injetadas → E2E → checkpoint de seis operações/sete comportamentos. Registrar resultados reais, não editar testes para aceitar 501 ou SKIP.

## POR QUÊ

Cada camada cobre risco distinto. Unitários verificam contrato matemático; integração prova persistência/autorização; disputa e injeção provam atomicidade; E2E prova jornada, foco e estados. Um PASS que não atinge a camada pretendida não demonstra o requisito.

## Arquivos que provavelmente serão alterados

Somente correções focais em serviço/handlers/UI ou nos testes quando o teste contradisser spec/ADR/OpenAPI com evidência explícita. Registro em [implementation-evidence.md](../implementation-evidence.md). Fixtures persistentes de E2E pertencem ao procedimento da etapa 08; não usar public compartilhado como atalho.

## Procedimento ordenado

1. Rodar npm run typecheck; depois npm run test:unit. Conferir canonicalização dos dois hashes, ativação exclusiva v0.1.1, sete enums, ausência/invalidade, W/S/V/T, mínimo de dois scores, clamp, classes sobre rawScore, qualidade 4/5 e 5/5, half-up e drivers. Anotar contagens e não chamar vetores técnicos de científicos.
2. Rodar os arquivos integration/ihfr-diagnosis-eligibility-route.test.ts, write-route.test.ts, supplement-cardinality.test.ts e revocation.test.ts contra schema PostgreSQL isolado. Conferir que testes não foram pulados por guard de ambiente e que a query real atingiu tabelas/constraints. Validar resultado suficiente, insuficiente, versão incompatível, MEMBER/inativo/conta inelegível/IDs cruzados.
3. Rodar integration/ihfr-diagnosis-concurrency.test.ts com barreiras determinísticas. Para CREATE×CREATE e REPLACE×REPLACE, exigir um vencedor mais conflito/replay contratual, exatamente um CURRENT e contagens coerentes. Cobrir REPLACE×REVOKE, mesma chave igual/divergente e revalidação do expected ID sob lock. Falha de conexão ou fixture é falha de ambiente, não GREEN.
4. Rodar integration/ihfr-diagnosis-idempotency.test.ts: mesma chave+ator+contexto+request devolve terminal igual sem novos registros; divergência 409; GET operation recupera após simular timeout; perda de vínculo recusa projeção; a chave da IMP-005 não vira chave de IHFR.
5. Rodar falhas injetadas nos pontos de suplemento, snapshot, ledger, ponteiro, evento e commit. Conferir rollback integral por queries de contagem e igualdade do snapshot/pointer antes/depois; conexão e schema encerrados em finally. Não tratar só ausência de exceção como sucesso.
6. Com fixture E2E persistida em schema isolado e visível ao mesmo processo Next.js, executar tests/e2e/ihfr-diagnosis-manage.spec.ts. Cobrir OWNER/ADMIN/MEMBER/inativo, CREATE/REPLACE/REVOKE/timeout, conflito e teclado/foco. Exigir zero SKIP. Se o fixture ainda não existir, esta etapa permanece pendente, mesmo que todos os unitários/integrações estejam GREEN; preparar a infraestrutura da etapa 08 e retornar aqui.
7. Registrar checkpoint com tabela das seis operações HTTP e sete comportamentos: eligibility, current, CREATE, REPLACE, detail, revocation, operation. Para cada um: status nominal/erro, ator, persistência, teste e evidência. Reexecutar leitura US1 focal para detectar regressão.

## Regras e invariantes

SKIP, TODO, teste que retorna cedo, mock que bypassa service/banco e teste não executado são estados pendentes. Cada GREEN deve citar comando, exit code e assertions que alcançaram comportamento. Falha de ferramenta/DB não é falha científica nem PASS. Nenhuma suíte pode desabilitar trigger de imutabilidade.

## Testes obrigatórios

npm run test:unit, npm run test:integration (ou arquivos focais com node --import=tsx --test --test-concurrency=1), Playwright tests/e2e/ihfr-diagnosis-manage.spec.ts e npm run typecheck. Para o checkpoint, usar PostgreSQL real com teardown, não somente mocks. A suíte geral/contratos e regressões vêm nas etapas 07–08.

## Evidências que devem ser registradas

Comandos exatos, HEAD, exit codes, duração, PASS/FAIL/SKIP, URL de ambiente omitida, contagens de tabelas, estado do ponteiro, hashes normativos reproduzidos, resultado da barreira e teardown. Vincular resultados a FR-001–FR-020 e SC-001–SC-008 aplicáveis.

## Condições de parada

Qualquer 501, SKIP obrigatório, fixture não visível ao Next.js, duas CURRENT, replay com nova escrita, rollback incompleto, perda de autorização ignorada ou resultado E2E anunciado sem terminal. Não marcar T103 até resolver a causa e reexecutar.

## Critérios de conclusão

Unitários, integração PostgreSQL, concorrência, replay, falhas injetadas e E2E US2 executados e verdes; zero SKIP; seis operações/sete comportamentos provados; US1 não regredida; evidência sanitizada ligada ao HEAD.

## Estado de saída esperado

US2 funcional e comprovada na jornada principal, apta à validação transversal de contrato/migration/segurança.

## Checkpoint/commit sugerido

Sugestão futura: test(ihfr): verify US2 lifecycle across unit database and browser. Escopo: correções necessárias e evidência de GREEN; sem commit nesta execução.
