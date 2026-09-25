# Achados da validação da `007-ihfr-evolution`

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
