# Evidência de implementação — IMP-005

## Autorização e baseline — 2026-09-17

`DECISAO_CONFIRMADA`: usuário respondeu “Autorizado.” ao pedido de integrar development por merge e iniciar speckit-implement completo. Push não autorizado nem realizado.

`EVIDENCIA_IMPLEMENTACAO`: fetch concluído; development permaneceu em `37fb3a4`. Merge sem conflitos em `96b33e788ba3b3de230a77f6cdf45cf4ccb5b0ba`. Os contratos IMP-004, guard e componente de detalhe correspondem ao baseline do plano. `coverage-review.md` e `test-results/` preexistentes foram preservados; saídas novas de navegador usam diretório temporário separado.

T001 concluída. Nenhum fallback sobre schema antigo. Estado anterior da branch e revisão: [implementation-readiness.md](implementation-readiness.md).

## Implementação e ajustes técnicos

- Contrato v1 fechado, OpenAPI 3.1, normalização somente dos opcionais para null, preservação de zero/false, canonicalização/hash e enums públicos independentes do legado.
- Validação pura compartilhada em `src/types/environmental-data.validation.ts`, evitando importar crypto Node na UI. O módulo servidor mantém hash SHA-256. Essa separação é técnica e não altera domínio.
- Conjunto imutável em tabela própria; migration aditiva, FKs restritivas, unicidades e trigger. Nenhuma escrita no pai ou backfill.
- Serviço injetável/transacional, autorização contextual e replay com hash/versão; GET allowlisted, sem legado, autoria ou chave.
- Formulário, revisão e consulta nos quatro grupos, origem fixa, recuperação com mesma chave, campos opcionais explícitos e estados carregando/erro/inativo.
- Fixtures da IMP-005 em arquivo dedicado `tests/fixtures/environmental-data-fixtures.ts`; vetores puros em `environmental-data.ts`. IDs e domínios reservados próprios. Teardown remove apenas a allowlist e verifica resíduos; desabilitação de trigger restrita à transação de limpeza do banco isolado.

## Validação incremental

| Verificação | Resultado corrente |
|---|---|
| Parser RED → GREEN | Stub executado: 2 falhas esperadas; depois 16 testes passaram |
| OpenAPI | Teste escrito antes do arquivo; paridade passou |
| Preflight RED → GREEN | Stub recusou snapshot válido; implementação passou |
| Serviço escrita RED → GREEN | 2 testes falharam no stub; passaram após implementação |
| Serviço leitura RED → GREEN | Leitura falhou no stub; passou após implementação |
| Rota/formulário | Testes escritos antes dos módulos; passaram após implementação |
| Migration isolada | PASS: unicidade, FK, imutabilidade, pai/legado preservados e rollback transacional |
| Preflight banco E2E | PASS após aplicar pré-requisito IMP-004 ausente |
| Unitários | PASS final: 122/122 |
| Migrations | PASS final: 10/10 em schemas descartáveis |
| Lint | 0 erros, 4 warnings preexistentes fora da feature |
| Typecheck | PASS final |
| Integração/concorrência | PASS final: 41/41; inclui corridas PostgreSQL e teardown residual zero |
| E2E IMP-005 | PASS: 4/4; registro/retry/inativo e consulta/ausência/contexto/layouts |
| Revisão visual | PASS técnico: capturas ampla e móvel comparadas às referências; grupos por cor e texto, origem e ações coerentes; padding móvel ajustado para a navegação fixa |
| Build | PASS fora do sandbox; primeira tentativa ficou bloqueada somente pelo fetch de Poppins |

### Regressão E2E completa

`BLOQUEIO_AMBIENTAL`: a primeira tentativa dos 40 testes Playwright encontrou resíduos preexistentes das fixtures IMP-003 no banco compartilhado. A limpeza posterior foi limitada aos IDs reservados das fixtures IMP-001–005, e o timeout da fixture de área foi alinhado aos 30 segundos já usados pelas fixtures de coleta.

Na repetição completa, 22 testes passaram, 4 falharam e 14 não executaram por fail-fast. As falhas permaneceram fora dos fluxos IMP-005: cadastro manual de área não navegou ao detalhe dentro do timeout; login esperado como 200 retornou 401; criação de laboratório não encontrou o formulário antes de 30 segundos; e alteração de papel não atualizou o controle antes de 5 segundos. A maior parte da regressão IMP-003/004 passou, inclusive concorrência e imutabilidade da coleta. Os quatro testes IMP-005 passaram dentro da execução completa e também isoladamente, com teardown residual zero. O bloqueio não é apresentado como regressão integral aprovada.

T034/T035 estão concluídas quanto à execução e ao registro honesto dos resultados; a regressão Playwright IMP-001–004 permanece pendente por essas quatro falhas.

Limites do RED: falhas de importação por módulo ainda ausente não demonstram falha comportamental. O teste real de migration foi executado depois do SQL; não houve ciclo RED comportamental da migration antes da implementação. A primeira falha foi de fixture (vínculo OWNER ausente), corrigida; erro de rede do sandbox também não foi contado como RED.

## Banco de teste e migration

O guard confirmou ambiente de teste, confirmação explícita e URL distinta da aplicação. Apenas o banco de testes recebeu `20260915000100_collection_registration_metadata` e `20260917000100_environmental_measurement_set` por Prisma migrate deploy. Não houve migration no banco de desenvolvimento/produção.

Rollback: a migration IMP-005 não contém COMMIT próprio e pode ser revertida pela transação antes da confirmação (testado). Depois de aplicada com dados, não excluir a tabela nem desabilitar a proteção para rollback: preservar backup e registros, suspender novas escritas e preparar correção forward. Não há autorização para descarte de dados confirmados. Schemas descartáveis dos testes são removidos pelo harness e sua ausência é verificada.

## Aceite humano e governança

SC-006: `NAO_VERIFICADO`; inspeção automatizada ou pelo agente não substitui participante humano identificando origem, ausência e somente leitura. A avaliação deve registrar os três cenários e sua origem antes de marcar T037 concluída.

T038: registros globais não foram editados. A autorização confirmou integração e implementação do pacote da feature; atualizações de autoridade científica e governança global permanecem condicionadas ao respectivo escopo. Resolução G2/G3 permanece registrada em spec/contratos, sem declarar ciência do IHFR validada.

## Exclusões científicas verificadas — T036

Busca estática nos caminhos novos de API, serviço, tipos e componentes encontrou zero referência a `IHFRDiagnosis`, `algorithmVersion`, pesos, limiares ou aos models legados `WaterData`, `SoilData`, `VegetationData` e `TerrainData`. Os testes de contrato recusam grafias legadas e campos extras; a migration preserva o legado sem lê-lo ou reclassificá-lo. A IMP-005 armazena somente o payload validado de `ihfr-measurement-v1` e não produz diagnóstico.

## Retomada do gate de PR — 2026-09-18

`EVIDENCIA_IMPLEMENTACAO`: fetch confirmou `origin/development` em `37fb3a4` e a IMP-005 local/remota em `a8ac907`, com árvore inicialmente limpa e sem PR existente. O diagnóstico focal anterior classificou as falhas de login e cadastro de área como orquestração de fixture e sincronização E2E, sem regressão funcional atribuível à IMP-005.

Foram alterados somente quatro testes legados: autenticação e laboratório passaram a preparar/remover explicitamente os quatro usuários allowlisted; cadastro de área passou a aguardar e validar POST `201`, `Location`, identidade e navegação; alteração de papel passou a aguardar e validar os PATCH `200`. Nenhuma assertion funcional foi removida e nenhum código de produto, schema, migration ou contrato foi alterado.

Os quatro cenários anteriormente falhos passaram juntos, com um worker: área manual, login ativo, criação de laboratório e promoção/rebaixamento (`4/4`). A execução completa única iniciou com guard aprovado, banco de teste distinto e allowlists zeradas, mas terminou com `25 passed`, `4 failed` e `11 did not run`. Duas falhas trouxeram `ETIMEDOUT` explícito do endpoint remoto; a área foi redirecionada a login antes do POST, coerente com indisponibilidade na revalidação da sessão; o fluxo ambiental também perdeu a sessão durante a indisponibilidade. A quarta falha expôs uma expectativa legada preexistente: o teste espera `/dashboard`, enquanto a página canônica redireciona para `/workspace`. A regressão não foi repetida.

Teardown allowlisted posterior confirmou zero medições, usuários, laboratórios, vínculos, áreas e coletas reservados pelas fixtures IMP-001–005. A regressão completa permanece não aprovada por infraestrutura remota e pela expectativa legada de `/dashboard`; isso não é apresentado como falha funcional da IMP-005. `SC-006`/T037 continua `NAO_VERIFICADO` e não foi substituído por automação.

## Preparação final do PR — 2026-09-18

`DECISAO_CONFIRMADA`: o usuário dispensou nova execução de migration, integração ou E2E dependente do Neon para a abertura do PR e proibiu qualquer acesso ou modificação nesse banco nesta execução. Resultados remotos incompletos permanecem incompletos e não são promovidos a aprovação.

`EVIDENCIA_IMPLEMENTACAO`: `origin/development` e o código atual definem `/workspace` como destino canônico de `/dashboard` por redirecionamento. A expectativa contrária em `authenticated-access.spec.ts` já existia na base e foi corrigida somente no teste, sem alteração de navegação de produto. A correção recebeu verificação estática; o cenário não foi executado porque depende do banco remoto e, portanto, não é declarado `GREEN` no novo HEAD.

Classificação individual dos quatro failures da execução remota anterior:

| Cenário | Evidência observada | Classificação | Relação com a IMP-005 e ação mínima |
|---|---|---|---|
| Área — `explicit context and manual registration survive reload without tiles` | A sessão foi desviada de `/dashboard` para `/login` antes do POST; o mesmo cenário havia passado na execução focal. | `INFRAESTRUTURA` | Sem relação causal demonstrada com a IMP-005; repetir em infraestrutura disponível, sem alterar produto. |
| Autenticação — `restores an ACTIVE session across reload and both private trees` | A navegação terminou em `/workspace`, enquanto o teste esperava `/dashboard`; a página canônica de `development` já redireciona para `/workspace`. | `TESTE_OU_FIXTURE` | Expectativa legada preexistente; corrigida estaticamente nesta preparação. Execução permanece pendente. |
| Dados ambientais — `registers through review, rejects invalid values and retries the same operation after lost response` | Perda de sessão e `ETIMEDOUT` explícito do endpoint remoto; o E2E específico da IMP-005 havia passado `4/4` no commit de produto. | `INFRAESTRUTURA` | Nenhuma regressão funcional material demonstrada; eventual repetição fica para infraestrutura autorizada. |
| Contexto de laboratório — `requires explicit selection and keeps laboratory context in links and reloads` | `ETIMEDOUT` explícito do endpoint remoto durante o fluxo. | `INFRAESTRUTURA` | Sem relação causal demonstrada com a IMP-005; repetir somente quando houver infraestrutura autorizada. |

Os 11 cenários `did not run` não têm resultado conclusivo nessa regressão. Foram interrompidos pelo modo serial após a falha do respectivo arquivo: área — `map selection remains editable and saves only on confirmation`, `late and denied geolocation preserve edited fields`, `essential flow and map have usable dimensions across viewports`; autenticação — `denies missing, malformed, tampered, expired, invalid-payload, and orphan sessions`, `denies sessions for every user that is not ACTIVE`, `expires an obsolete cookie through /me without exposing protected fields`, `revokes protected access on the next validation after ACTIVE becomes BLOCKED`, `logout prevents back, reload, and direct access to both private trees`, `repeated logout without a session remains stable`; dados ambientais — `inactive laboratory only permits reading and has no registration controls`; contexto de laboratório — `revoked and cross-laboratory access remain indistinguishable from missing resources`.

As evidências `122/122` unitários/OpenAPI, `10/10` migrations descartáveis, `41/41` integração/concorrência, E2E IMP-005 `4/4`, build, lint, typecheck e teardown residual zero pertencem ao commit de produto `a8ac907`. Os commits posteriores alteram apenas testes E2E e este registro de evidência; schema, migration, contratos e código de produto permanecem idênticos, razão pela qual essas evidências continuam aplicáveis ao produto, mas não são apresentadas como nova execução no HEAD do PR. `SC-006`/T037 permanece `NAO_VERIFICADO` e não é gate explícito para abrir o PR.

Validações locais desta preparação: unitários/OpenAPI `122/122`, typecheck `PASS`, build `PASS`, lint com 0 erros e os mesmos 4 warnings históricos, e `git diff --check` `PASS`. O primeiro build ficou bloqueado somente pelo acesso à fonte Poppins no Google Fonts; a repetição com acesso externo e variáveis de banco neutralizadas passou. Migration, integração e E2E dependentes do Neon não foram repetidos por decisão do usuário e não são declarados aprovados no novo HEAD.
