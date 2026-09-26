# Achados da validação da `007-ihfr-evolution`

**Registro histórico:** os estados e reproduções abaixo pertencem à inspeção em que foram escritos. Consulte a seção 12 do [relatório de validação](validation-report.md) para a reconciliação R-001–R-011 e os gates de 2026-09-26.

## F-001 — Ausência obrigatória é excluída pelo avaliador

- **Categoria:** Defeito comprovado por inspeção e reprodução sem banco.
- **Gravidade:** Alta. Viola FR-012/SC-007 e pode produzir diagnóstico quando a
  entrada deveria ser insuficiente.
- **Origem histórica:** herdado da `006-ihfr-diagnosis`; a condição foi
  introduzida em `69f505a` e já existia no head `97d9558` da `006`.
- **Evidência normativa:** somente entrada opcional conhecida ausente ou `null`
  quando permitido pode ser excluída; ausência obrigatória deve produzir
  `INSUFFICIENT_DATA`. Ver
  [`spec.md`](../../../specs/006-ihfr-diagnosis/spec.md) e
  [`ihfr-math-experimental-v0.1.1.json`](../../../specs/006-ihfr-diagnosis/contracts/ihfr-math-experimental-v0.1.1.json).
- **Evidência de implementação:** em
  [`evaluator.ts`](../../../src/app/api/server/ihfr-diagnosis/evaluator.ts), todo
  valor `undefined` entra no caminho de exclusão, independentemente de o campo
  pertencer ao conjunto opcional.

### Reprodução

1. Criar payload ambiental completo válido.
2. Remover `soil.infiltrationRateMmPerHour`.
3. Passar o payload diretamente a `evaluateIHFR` com `landUseType = FOREST`.

**Esperado:** `INSUFFICIENT_DATA`.

**Observado:** `SUFFICIENT`, raw `0.25027777777777777`, display `0.25`, classe
`MODERATE`; a decomposição simplesmente remove a infiltração da dimensão S.

Controle opcional: ao remover apenas `water.salinityIndicator`, o parser aceita
e normaliza para `null`, e o avaliador retorna `SUFFICIENT`, comportamento
compatível com o contrato.

### Alcance demonstrado

O parser de captura ambiental rejeitou o mesmo payload sem infiltração e apontou
`soil.infiltrationRateMmPerHour`. Assim, o happy path atual da interface impede
essa entrada antes da persistência. O impacto integrado não foi reproduzido e
depende de registro malformado, legado incompatível, corrupção ou outro escritor.
O defeito interno permanece real porque o serviço IHFR avalia o payload
persistido sem reaplicar `parseEnvironmentalInput`.

## F-002 — Consulta normal omite proveniência, versões, vigência e datas

- **Categoria:** Defeito comprovado por inspeção e renderização estática.
- **Gravidade:** Alta. Impede FR-005 e SC-001 mesmo quando o cálculo e a
  persistência funcionam.
- **Origem histórica:** o resumo incompleto surgiu em `9b41dc8`, na `006`. A
  `007`, em `5389796`, acrescentou matemática, algoritmo, hash e rótulos, mas
  manteve as demais omissões.
- **Evidência normativa:** FR-005 exige resultado experimental, origem, versões,
  hash, vigência e datas na consulta normal.
- **Evidência de implementação:** o DTO em
  [`ihfr-diagnosis.type.ts`](../../../src/types/ihfr-diagnosis.type.ts) contém os
  campos, mas
  [`experimental-diagnosis-summary.tsx`](../../../src/components/ihfr-diagnosis/experimental-diagnosis-summary.tsx)
  não os renderiza.

### Reprodução

A renderização de `ExperimentalDiagnosisSummary` com o fixture público confirmou:

| Campo | Observado |
|---|---|
| Score, classe, matemática, algoritmo e hash | presente |
| `measurementContractVersion` | ausente |
| `inputContractVersion` | ausente |
| `lifecycleState` | ausente |
| `calculatedAt`, `validFrom`, `transitionedAt` | ausentes |
| `environmentalMeasurementSetId`, `inputSupplementId` | ausentes |

**Impacto:** qualquer usuário autorizado recebe uma consulta incompleta. A
omissão independe de banco ou navegador; comportamento visual/responsivo final
ainda depende de navegador.

## F-003 — Prisma Client local estava desatualizado

- **Categoria:** Condição local reproduzida e resolvida sem banco.
- **Gravidade atual:** Resolvida no ambiente local; não foi demonstrada
  incompatibilidade efetiva do código.
- **Origem histórica:** o serviço de administração foi introduzido em `599bd41`,
  mas essa ancestralidade, isoladamente, não classifica a falha como
  preexistente. A evidência causal é a divergência entre schema e client gerado.

### Reprodução

Comando: `npm run typecheck`.

**Esperado:** saída zero.

**Observado antes da geração:** saída 2 e 11 erros. O schema contém
`User.revision` e o model `AdministrativeAuditEvent`, enquanto o Prisma Client
presente em `src/generated/prisma` não expunha esses elementos. Os erros atingiam
o serviço, fixtures e teste de concorrência de administração.

**Diagnóstico:** `prisma`, `@prisma/client` e lockfile usam `7.4.2`; TypeScript
usa `5.9.3`. O diretório `src/generated/prisma` é ignorado pelo Git, e seu
`schema.prisma` embutido não continha as declarações atuais. `prisma generate`
foi executado localmente com valor de datasource não sensível, sem conexão,
migration ou alteração versionada.

**Observado depois da geração:** `npm run typecheck` terminou com saída zero.

**Conclusão:** os 11 erros decorriam exclusivamente do Prisma Client local
desatualizado. O client regenerado permanece artefato ignorado e não integra os
commits documentais.

## F-004 — `test:contract` não é uma verificação sem banco

- **Categoria:** Risco de validação.
- **Gravidade:** Média. Um operador pode iniciar escrita PostgreSQL acreditando
  executar apenas validação de contrato.
- **Origem histórica:** o teste PostgreSQL de respostas reais integra a
  continuidade da IMP-006; não foi atribuída causalidade a um único commit nesta
  rodada.

`package.json` executa todos os arquivos em `tests/contract`, e
`tests/contract/ihfr-diagnosis-api.test.ts` chama
`withImp006PostgresqlSchema`, aplica migrations e instala fixtures no segundo
caso. Portanto, `npm run test:contract` foi bloqueado nesta rodada.

## F-005 — Identidade da branch Neon ainda não foi comprovada

- **Categoria:** Dúvida ou decisão pendente / bloqueio de validação.
- **Gravidade:** Alta antes de qualquer escrita remota.

A inspeção sanitizada confirmou dois alvos Neon normalizados distintos e um
arquivo E2E estruturalmente completo. Isso não demonstra que o endpoint de teste
pertence à branch Neon esperada. O lifecycle cria o schema antes de qualquer
verificação de identidade de branch.

O preflight PostgreSQL read-only conectou com sucesso ao alvo de teste, confirmou
o database por fingerprint, transação somente leitura, endpoint pooled distinto
do desenvolvimento e zero schemas `imp006_test_*` preexistentes. Essas são
evidências PostgreSQL/configuração; não substituem evidência da Neon. Não há
API key, CLI/configuração Neon ou `branch_id` disponível no ambiente.

**Falta verificar:** associação endpoint → `branch_id` pela Neon Console/API,
incluindo confirmação de que o endpoint de desenvolvimento pertence a branch
diferente. A menor intervenção é a equipe informar os dois `branch_id` ou
confirmar explicitamente essas associações na Console; nenhuma credencial do
provedor é necessária.

### Atualização posterior

O usuário declarou explicitamente um segundo endpoint como branch Neon de teste
e autorizou escrita para migrations, fixtures e E2E. A proteção local confirmou
que `DATABASE_URL` e `TEST_DATABASE_URL` apontavam para alvos normalizados
distintos. Isso forneceu autoridade operacional suficiente para a execução
solicitada, mas não produziu evidência independente de `branch_id`. Portanto,
`F-005` deixou de bloquear aquela execução autorizada e permanece como lacuna de
proveniência do provedor caso a equipe exija prova independente da associação.

## F-006 — Fluxo completo ainda não foi executado pela interface

- **Categoria:** Lacuna de validação.
- **Gravidade:** Alta para afirmar funcionamento ponta a ponta; não é, por si só,
  defeito de implementação.

Rotas, formulários, endpoints, serviços e persistência estão conectados por
inspeção, e 28 arquivos unitários focais passaram. Os E2E IHFR existentes partem
de laboratório, área, coleta e dados ambientais criados diretamente por fixture;
eles não comprovam criação desses recursos pela interface.

**Falta verificar:** executar
[`end-to-end-checklist.md`](end-to-end-checklist.md) em destino isolado, criar os
recursos pela UI, recarregar e reabrir a coleta pelo histórico.

Na continuidade de 2026-09-25 havia ferramenta de navegador disponível, mas o
fluxo não foi iniciado porque depende de setup com escrita. O bloqueio é o gate
de identidade da branch Neon, não ausência de automação de navegador.

### Atualização posterior

Após a autorização explícita do destino de teste, a lacuna de runtime foi
reduzida por duas evidências complementares:

- Playwright isolado: `6/6`, incluindo criação de coleta, confirmação do payload
  ambiental completo, fallback de UUID em HTTP sem contexto seguro,
  elegibilidade e criação IHFR;
- cenário persistente no navegador: autenticação como `OWNER`, navegação por
  workspace, laboratório, área, coleta, dados ambientais, mapa e membros, além
  de `CREATE`, `CURRENT`, `REPLACE` e `REVOKE` do diagnóstico.

O cenário persistente terminou deliberadamente sem diagnóstico vigente após a
revogação. Nenhum erro de console foi observado. A reexecução não fecha
`F-001` ou `F-002`, que são defeitos contratuais independentes do happy path.

## F-007 — `current_schema()` é incompatível com o adapter Prisma/Neon sem cast

- **Categoria:** Defeito reproduzido no harness PostgreSQL remoto.
- **Gravidade:** Média para produção; alta para repetibilidade da validação Neon.
- **Alcance:** caminho de isolamento `IMP006_TEST_SCHEMA`, não o fluxo normal
  sem essa variável de teste.

Com `IMP006_DATABASE_VARIABLE=TEST_DATABASE_URL`, os testes IHFR falharam antes
da regra de negócio com:

```text
Failed to deserialize column of type 'name'
```

O PostgreSQL retorna `current_schema()` com o tipo interno `name`, que o Prisma
Client usado com o adapter Neon não desserializou. Há duas ocorrências:

- `tests/fixtures/postgresql-schema-lifecycle.ts`;
- `src/app/api/server/services/ihfr-diagnosis.service.ts`, dentro da proteção
  `IMP006_TEST_SCHEMA`.

Um ajuste temporário para `SELECT current_schema()::text AS schema` nas duas
consultas permitiu a execução integral em `106/106`. O ajuste foi revertido ao
final para que a rodada de validação não modificasse código de produção ou
teste.

`RECOMENDACAO`: incorporar o cast explícito para `text`, adicionar regressão
que execute o lifecycle com o adapter Neon e manter a comparação do schema
allowlisted. O cast não muda a identidade validada; somente converte o valor
para um tipo suportado pelo Prisma.

## F-008 — Pooler, endpoint direto e configuração do runner não são intercambiáveis

- **Categoria:** Risco de infraestrutura e configuração.
- **Gravidade:** Média.

O `prisma migrate status` contra o URL pooled retornou somente `Schema engine
error` na primeira tentativa. Uma tentativa direta ainda dentro do sandbox
também falhou sem diagnóstico útil; após liberar acesso de rede, o endpoint
direto da mesma branch respondeu e confirmou as sete migrations aplicadas.
Assim, a rodada não atribui causalidade exclusiva ao pooler para esse erro
genérico.

Em execuções anteriores do lifecycle, o pooler também recusou a opção de
startup usada para selecionar `search_path`. O endpoint direto funcionou para
migrations, criação de schemas isolados e testes transacionais. O
`PrismaNeon`, por sua vez, funcionou no teste de concorrência ambiental quando
recebeu o endpoint direto.

`RECOMENDACAO`:

1. manter uma variável direta, separada e explícita para migrations e testes
   que criam schemas;
2. reservar o URL pooled para runtime que não dependa de opções de startup não
   suportadas pelo pooler;
3. fazer o preflight registrar apenas fingerprints sanitizados do endpoint e
   qual adapter foi selecionado;
4. falhar cedo quando um runner de schema isolado receber URL pooled;
5. testar separadamente falha de DNS/sandbox, falha do pooler e falha do Prisma
   CLI, evitando classificá-las pelo mesmo `Schema engine error` genérico.

O driver `pg` também avisou que a semântica futura de `sslmode=require` mudará.
`RECOMENDACAO`: decidir conscientemente entre `sslmode=verify-full` para manter
o comportamento estrito atual ou `uselibpqcompat=true&sslmode=require` para
semântica libpq, validando a decisão antes de uma atualização maior de `pg`.

## F-009 — Execuções interrompidas podem deixar schema temporário marcado

- **Categoria:** Risco operacional de teardown.
- **Gravidade:** Baixa no destino exclusivo de teste; alta se o mesmo mecanismo
  for usado em destino compartilhado sem auditoria.

Após as execuções foi encontrado um schema `imp006_test_<uuid>` com 11 tabelas
e o marcador exato `hidroflorestas:imp006-test-harness`. As fixtures ambientais
já estavam em zero. O schema foi removido somente depois de confirmar prefixo,
nome exato e marcador; a verificação posterior confirmou zero schemas
temporários e zero usuários/laboratórios das fixtures ambientais.

Não foi estabelecida causalidade entre esse resíduo e um processo específico.
Houve execuções deliberadamente falhas antes da rodada verde, o que reforça a
necessidade de auditoria independente do teardown.

`RECOMENDACAO`: manter a recusa de remoção sem marcador, registrar o schema
criado por execução, verificar ausência após cada cenário e disponibilizar um
comando de auditoria que apenas liste resíduos. Qualquer limpeza posterior deve
continuar exigindo alvo de teste explícito e validação do marcador.

## Estado da continuidade corretiva de 2026-09-25

| Achado | Estado no diff local atual | Limite da evidência |
|---|---|---|
| F-001 | `CORRIGIDO_VERIFICADO_LOCALMENTE`: ausências obrigatórias isoladas retornam insuficiência; teste controlado e teste com PostgreSQL real confirmam ledger terminal único sem suplemento/diagnóstico/CURRENT/evento novo. | O produtor normal já rejeitava a ausência; não há alegação de exploração pela UI. Adapter Neon remoto não executado neste diff. |
| F-002 | `CORRIGIDO_VERIFICADO_LOCALMENTE`: resumo normal mostra IDs de origem, versões, estado e datas UTC; fixtures CURRENT/SUPERSEDED/REVOKED cobertas. E2E local confirmou visibilidade, recarga e largura móvel; um desvio de três horas do `PrismaPg` em sessão não UTC foi reproduzido e corrigido ao selecionar `TimeZone=UTC` somente no harness local. | Browser do percurso integral pela UI no destino Neon ainda não executado. |
| F-003 | `RESOLVIDO_LOCALMENTE`: client ignorado regenerado com Prisma 7.4.2; typecheck verde. | Não implica alteração de schema nem execução de banco. |
| F-004 | `CORRIGIDO_VERIFICADO_LOCALMENTE`: comandos com banco passam por preflight único antes da descoberta; sem seleção falham antes da escrita; contrato, integração e migrations passaram em PostgreSQL local próprio. | Destino Neon E2E ainda não verificado nesta rodada. |
| F-005 | `PENDENCIA_EXTERNA`: autorização e identificação históricas preservadas. | Sem configuração E2E atual ou prova independente Neon endpoint → `branch_id`; nenhuma escrita remota feita. |
| F-006 | `PREPARADO_NAO_EXECUTADO`: E2E novo cria domínio pela UI desde login e valida recarga/histórico. | O E2E local 6/6 usa fixtures e não equivale a esse percurso. Sem destino/conta Neon neste processo; cenário histórico em `public` não foi consultado nem alterado. |
| F-007 | `CORRIGIDO_VERIFICADO_LOCALMENTE_PENDENTE_NEON`: dois casts `current_schema()::text` versionados e guarda de schema preservada; suites PostgreSQL/Prisma locais passaram sem patch temporário. | Regressão real pelo Prisma/adapter Neon não executada no diff. |
| F-008 | `MITIGADO_VERIFICADO_LOCALMENTE_PENDENTE_REDE`: endpoint direto exigido para schema isolado; preflight só leitura, fingerprints sanitizados; sessão local do `PrismaPg` fixa UTC. | DNS/conexão/auth/startup/CLI/TLS do Neon não diagnosticados nesta rodada. |
| F-009 | `MITIGADO_VERIFICADO_LOCALMENTE`: teardown exige marcador e propriedade desta execução; regressão injeta falha e confirma descarte do schema; auditoria somente leitura encontrou zero candidatos após falhas e sucesso do E2E. | Resíduos remotos não auditados; `public` persistente do checkpoint não foi tratado como resíduo. |

`CONTRATO_EXPERIMENTAL`, `VALIDACAO_CIENTIFICA_PENDENTE`, `SUJEITO_A_RECALIBRACAO`, `NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO` permanecem vigentes.

## Revisão focal posterior — 2026-09-25

`EVIDENCIA_IMPLEMENTACAO`: as três lacunas detalhadas no anexo da rodada foram conferidas contra o HEAD inicial `85ce3c7a`. O arquivo separado `revisao-independente-hidroflorestas-007.md` e o JSON opcional de sondas não estavam disponíveis; por isso a avaliação abaixo se limita aos achados descritos no anexo e às reproduções locais.

| Lacuna | Verificação e resolução | Estado |
|---|---|---|
| Strings em `water.hasSpring` e `vegetation.hasRiparianApp` | O parser ambiental exige booleanos. O RED focal confirmou aceitação de `"true"` pelo avaliador. Guarda de tipo mínima e GREEN 9/9 cobriram true/false, strings e tipos não booleanos, mantendo null/undefined do campo opcional. | `CORRIGIDO_VERIFICADO_LOCALMENTE` |
| `observedAt` após reload/histórico | O estado React reinicia vazio e a aplicação exige data para diagnosticar. O E2E agora repõe a data antes de REPLACE; a validação da aplicação foi preservada. | `CORRIGIDO_NO_TESTE_PENDENTE_E2E_INTEGRAL` |
| Oráculo e identidade no full UI | O teste passou a verificar o vetor literal completo e o mesmo ID após reload/histórico, novo ID/CURRENT após REPLACE e ausência de CURRENT após REVOKE. | `PREPARADO_NAO_EXECUTADO`: descoberta Playwright passou; destino/conta E2E ausentes |

`RECOMENDACAO`: quando houver configuração e conta sintética do destino dedicado, executar o roteiro integral, auditar o destino remoto e anexar os resultados reais à matriz de validação. Isso não substitui a prova Neon de `branch_id` nem a validação científica humana.

## Reclassificação no código `c6e4302` — 2026-09-26

| Achado | Estado reproduzido nesta rodada | Limite |
|---|---|---|
| F-001 | `CORRIGIDO_VERIFICADO`: o avaliador rejeita ausência obrigatória; teste `ihfr-insufficiency` em schema isolado passou 1/1 e confirmou operação terminal sem diagnóstico. | Não equivale a validação científica. |
| F-002 | `CORRIGIDO_VERIFICADO`: resumos históricos e novos exibiram, no navegador após reload/reabertura, IDs de origem, versões, hash, estado e datas UTC. | Evidência do destino E2E direto `d116d14859be`; não transferir automaticamente a outro destino. |
| F-005 | `PENDENCIA_EXTERNA`: DEV/E2E foram distintos no preflight e o destino E2E foi identificado pelo responsável. | Ainda não há prova independente endpoint → `branch_id` da Neon Console/API. |
| F-009 | `SEM_RESIDUO_OBSERVADO`: auditoria final encontrou zero schemas `imp006_test_*` neste destino. | Resultado pontual; recursos intencionais em `public` foram preservados. |

### F-010 — Timeout do runner full UI após persistir dados ambientais

- **Categoria:** Confiabilidade de teste/automação.
- **Gravidade:** Média para o gate de merge; defeito de produto não demonstrado.

`EVIDENCIA_EXECUCAO`: o runner versionado criou laboratório, área, coleta e medição por UI com respostas `201`, mas sua asserção `getByText(/Conjunto confirmado e imutável/).toBeVisible()` expirou após cinco segundos. A leitura SQL confirmou a medição persistida e nenhum diagnóstico naquele instante. Em sessão nova, a página de detalhe carregou sete valores ambientais, a elegibilidade foi `ELIGIBLE`, o CREATE retornou `201`, e o diagnóstico persistiu/reabriu. Não se repetiu o runner com o mesmo run ID. Uma sonda temporária de comparação de floats falhou por exigir igualdade exata de `0.2` contra `0.20000000000000004`; isso foi erro da sonda, não segunda falha do produto nem do teste versionado, que usa proximidade.

`INFERENCIA`: a evidência aponta para sincronização ou seletor/tempo de espera insuficiente na automação. A causa exata do timeout não foi demonstrada. `RECOMENDACAO`: instrumentar a transição após o POST ambiental, usar condição de espera ligada ao estado persistido e repetir o runner completo com run ID novo antes do merge, sem alterar dados já criados nesta rodada.

### F-011 — Alertas de segurança em dependência de produção não triados

- **Categoria:** Segurança de dependências.
- **Gravidade:** Alta até triagem de aplicabilidade.

`EVIDENCIA_EXECUCAO`: `npm audit --omit=dev --json` retornou código 1 e 22 achados no grafo analisado (6 moderados, 15 altos, 1 crítico); entre eles, `next@16.1.6` é dependência direta de produção com advisories altos/crítico e correção indicada pelo auditor. A contagem global não é apresentada como 22 vulnerabilidades exploráveis em produção: o npm usado também listou entradas de desenvolvimento. Não houve prova de exploração nem avaliação da aplicabilidade das condições de cada advisory à implantação deste projeto.

`RECOMENDACAO`: triagem de cada advisory relevante, atualização controlada da dependência e repetição dos gates; registrar aceitação de risco explícita se alguma atualização não for feita. Não tratar o resultado de testes funcionais como autorização de implantação.
