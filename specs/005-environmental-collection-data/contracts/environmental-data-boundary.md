# Contrato de fronteira: dados ambientais da coleta

**Status**: contrato v1 aprovado para implementação da IMP-005.
**References**: [spec.md](../spec.md), [data-model.md](../data-model.md), [measurement-contract-v1.md](measurement-contract-v1.md), [math-contract-v1.md](math-contract-v1.md).

## C-001 — Contexto e autorização

Base: `/api/laboratories/{laboratoryId}/areas/{areaId}/collections/{collectionId}/environmental-data`.

O servidor autentica e revalida conta elegível, vínculo atual, papel, estado, área subordinada, coleta subordinada e conjunto subordinado. IDs da URL são referências, não credenciais. `OWNER`, `ADMIN` e `MEMBER` podem registrar e consultar; laboratório inativo é somente leitura. Recurso inexistente e inacessível retornam o mesmo `404` sem dados.

## C-002 — POST de confirmação

Headers: `Content-Type: application/json` e `Idempotency-Key: <UUID>`. O body fechado contém exatamente:

```json
{
  "water": {},
  "soil": {},
  "vegetation": {},
  "terrain": {}
}
```

Os objetos devem obedecer integralmente a [measurement-contract-v1.md](measurement-contract-v1.md); o exemplo acima mostra somente o envelope e não é payload válido. O servidor fixa `measurementContractVersion` em `ihfr-measurement-v1`, deriva autoria da sessão, canonicaliza e grava tudo numa transação sem atualizar a coleta.

Respostas: `201` na criação e `200` no replay idêntico, ambas com `Location` da API e `{ "environmentalData": <PublicEnvironmentalData> }`. Retorna `400` para header/body inválido; `401` sem autenticação; `403` para conta inelegível; `404` para contexto ausente/inacessível; `409` para laboratório somente leitura, chave divergente ou conjunto já existente; `500` sanitizado para falha inesperada. Todas usam `Cache-Control: no-store`.

## C-003 — GET de consulta

GET usa a mesma URL e retorna `{ "environmentalData": <PublicEnvironmentalData|null> }`. `null` representa ausência para uma coleta acessível; não fabrica zeros/falsos. Respostas de negação seguem C-002. Laboratório inativo continua consultável por vínculo atual.

`PublicEnvironmentalData` contém `id`, `collectionId`, `measurementContractVersion`, `confirmedAt`, `readOnly` derivado do contexto e os quatro grupos do payload. Não contém `userId`, `confirmationKey`, `payloadHash`, credenciais, campos privilegiados ou diagnóstico.

## C-004 — Idempotência, imutabilidade e erros

A chave idempotente é própria desta operação. Mesmo autor, chave, coleta e payload recuperam o registro; mudança de contexto ou conteúdo produz `409` e zero escrita. Um conjunto confirmado não aceita PATCH/PUT/DELETE nesta feature. Erros seguem `{ "error": { "code": string, "message": string, "details"?: object } }`; detalhes de validação podem apontar campos, sem vazar implementação.

## C-005 — Interface e aceite

A UI parte do detalhe da coleta, exibe contexto fixo, os quatro grupos, labels/unidades, erros por campo e uma etapa de revisão. A confirmação só anuncia sucesso após persistência. Deve suportar teclado, foco previsível, telas móveis/amplas, falha recuperável, ausência e modo somente leitura.

| Caso | Resultado |
|---|---|
| Payload válido e contexto ativo | Conjunto integral criado uma vez |
| Campo extra, enum/faixa inválida ou grupo ausente | `400`, zero escrita |
| Replay idêntico | Mesmo registro, `200` |
| Replay divergente ou segundo conjunto | `409`, registro original intacto |
| Laboratório inativo | GET permitido; POST `409` |
| Contexto cruzado/inacessível | `404` indistinguível |
| GET sem conjunto | `200` com `environmentalData: null` |
| Tentativa de editar pai ou produzir IHFR | Fora da superfície autorizada |

As rotas e DTOs da IMP-004 permanecem inalterados. O manifesto matemático define apenas a fronteira futura: nenhuma fórmula é executada pela IMP-005.
