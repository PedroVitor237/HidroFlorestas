# Data Model: Dados ambientais da coleta

**Date**: 2026-09-17
**Status**: Modelo lógico aprovado para a captura v1; não valida a fórmula científica do IHFR.

## 1. Relações e cardinalidade

```text
Laboratório → Área → Coleta confirmada → 0..1 Conjunto ambiental confirmado
                                               │
                         ihfr-measurement-v1 + autoria própria
```

O conjunto pertence exclusivamente à coleta indicada pela cadeia contextual e não pode ser transferido. A coleta confirmada permanece imutável. Cada coleta admite no máximo um conjunto ambiental v1; água, solo, vegetação e terreno formam uma única unidade atômica.

## 2. Entidade física proposta

`EnvironmentalMeasurementSet`:

| Campo | Tipo/regra |
|---|---|
| `id` | UUID, chave primária |
| `collectionDataId` | FK obrigatória e única para `CollectionData`; exclusão restrita |
| `userId` | FK obrigatória para o autor autenticado; exclusão restrita |
| `measurementContractVersion` | texto obrigatório; valor v1: `ihfr-measurement-v1` |
| `payload` | JSON canônico fechado, produzido somente pelo parser do contrato v1 |
| `payloadHash` | hash do JSON canônico para verificar replay/conflito |
| `confirmedAt` | instante de confirmação no servidor |
| `confirmationKey` | UUID fornecido no header idempotente; não reutiliza a chave da coleta |
| `createdAt` | instante técnico de criação |

Constraints e índices:

- `UNIQUE(collectionDataId)` garante um conjunto por coleta;
- `UNIQUE(userId, confirmationKey)` identifica uma tentativa do autor;
- índices em `collectionDataId` e `measurementContractVersion` apoiam consulta/auditoria;
- trigger de banco bloqueia `UPDATE` e `DELETE` do conjunto confirmado;
- a transação cria apenas o dependente, sem atualizar `CollectionData`.

## 3. Payload canônico

O payload contém exatamente `water`, `soil`, `vegetation` e `terrain`, com os campos, enums, unidades, limites e nulabilidade de [measurement-contract-v1.md](contracts/measurement-contract-v1.md). Campos extras são recusados. Campo opcional ausente é normalizado explicitamente para `null`; zero e `false` permanecem valores informados.

O parser valida o request e produz uma ordenação estável antes do hash e da persistência. JSON é uma escolha de armazenamento versionado, não autorização para payload genérico. A projeção pública é criada por allowlist e nunca retorna `userId`, `confirmationKey` ou detalhes internos.

## 4. Autorização e estados

O servidor deriva principal, elegibilidade e vínculo. `OWNER`, `ADMIN` e `MEMBER` com vínculo atual podem registrar e consultar. Laboratório inativo permite consulta autorizada e impede escrita. IDs cruzados, inexistentes e inacessíveis não revelam diferenças de existência.

Estados de apresentação: carregando, ausência, preenchimento, revisão, envio, registro consultável, falha recuperável, acesso negado e somente leitura. Preenchimento/revisão ficam em memória; não há rascunho persistente. Depois da confirmação não há edição, complementação ou exclusão nesta feature.

## 5. Idempotência e concorrência

- primeira tentativa válida cria atomicamente o conjunto e retorna `201`;
- replay com mesmo autor, chave, coleta e payload canônico recupera o mesmo registro e retorna `200`;
- mesma chave com contexto ou payload diferente retorna conflito sem escrita;
- outra chave para coleta que já possui conjunto retorna conflito sem sobrescrever;
- falha antes do commit deixa zero conjunto; timeout depois do commit é recuperável pelo replay.

## 6. Legado e evolução

`WaterData`, `SoilData`, `VegetationData` e `TerrainData` são `EVIDENCIA_IMPLEMENTACAO` anterior, não o contrato normativo v1. Permanecem intactos, não recebem backfill, não são publicados pelo novo endpoint e não são apagados nesta entrega. Uma migração futura só poderá reconciliá-los mediante decisão científica e plano de preservação explícitos.

O conjunto registra a versão do contrato de medição. O contrato matemático e a versão do algoritmo são independentes, conforme [math-contract-v1.md](contracts/math-contract-v1.md). A IMP-005 não cria `IHFRDiagnosis` nem calcula, classifica ou recomenda qualquer resultado.
