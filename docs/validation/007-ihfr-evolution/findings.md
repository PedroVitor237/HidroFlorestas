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

## F-003 — Gate global de TypeScript falha no HEAD

- **Categoria:** Defeito comprovado por execução sem banco.
- **Gravidade:** Alta para integração da branch; não é um defeito específico do
  IHFR.
- **Origem histórica:** o serviço de administração foi introduzido em `599bd41`,
  ancestral da `006`; os arquivos principais não foram introduzidos pela `007`.

### Reprodução

Comando: `npm run typecheck`.

**Esperado:** saída zero.

**Observado:** saída 2 e 11 erros. O schema contém `User.revision` e o model
`AdministrativeAuditEvent`, enquanto o Prisma Client presente em
`src/generated/prisma` não expõe esses elementos. Os erros atingem o serviço,
fixtures e teste de concorrência de administração.

**Impacto:** a branch não passa o gate estático global. Não foi executado
`prisma generate`, pois ele alteraria artefatos versionados e esta rodada deve
preservar a implementação existente.

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

**Falta verificar:** associação endpoint → `branch_id` pela Neon Console/API e
uma conexão SQL somente leitura, imediatamente antes da liberação do runner.

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
