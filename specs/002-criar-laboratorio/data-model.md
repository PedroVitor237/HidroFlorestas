# Data Model: Criação mínima de laboratório

## LaboratoryRoom

| Field | Rule | Public? |
|---|---|---|
| `id` | interno gerado | não |
| `name` | trim, 1–100; repetição permitida | sim |
| `createdAt` | instante de criação | sim |
| `updatedAt` | interno | não |
| `userId` | sempre `principal.id`; responsável inicial | não |
| `imageBanner` | default existente; não coletado | não |
| `isActive` | default; apresentado como status | via `status` |
| `accessCode` | criptográfico, único, persistido, não exibido | não |

## ResearchersLinked

- Vínculo inicial entre criador e laboratório, na mesma transação.
- Chave composta impede duplicar o mesmo par.
- Listagem acessível parte deste vínculo.
- Papéis, status, convites e saída ficam fora.

## Invariants

- No máximo cinco vínculos acessíveis totais por pessoa, somando criação e participação.
- Um responsável inicial e um vínculo inicial em todo laboratório criado pela feature.
- Nomes podem repetir; `accessCode` é único globalmente.
- Nenhum contexto ativo é criado ou persistido.

## State transition

```text
valid + authenticated + linked count < 5
  -> atomic LaboratoryRoom + ResearchersLinked
  -> available in list
failure -> neither record is created
```

## Migration assessment

O baseline não possui migration versionada e `accessCode` não é único. Será criada migration incremental apenas para a constraint. Aplicação remota exige inspeção de histórico/schema/duplicidades e autorização separada.

