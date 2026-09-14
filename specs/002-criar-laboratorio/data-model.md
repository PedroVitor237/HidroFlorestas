# Data Model: Criação mínima de laboratório

## LaboratoryRoom

| Field | Rule | Public? |
|---|---|---|
| `id` | interno gerado; identificador opaco usado para endereçar configurações | sim |
| `name` | trim, 1–100; repetição permitida | sim |
| `createdAt` | instante de criação | sim |
| `updatedAt` | interno | não |
| `userId` | sempre `principal.id`; responsável inicial | não |
| `imageBanner` | default existente; não coletado | não |
| `isActive` | default; apresentado como status | via `status` |
| `accessCode` | criptográfico, único, persistido, não exibido | não |

O DTO público acrescenta `isOwner`, derivado por comparação server-side com o principal autenticado. Ele não serializa `userId`, `accessCode`, relações ou registros Prisma completos.

## ResearchersLinked

- Vínculo inicial entre criador e laboratório, na mesma transação.
- Chave composta impede duplicar o mesmo par.
- Listagem acessível parte deste vínculo.
- Papéis, status, convites e saída ficam fora.
- A consulta de detalhes retorna somente `name` e iniciais derivadas dos nomes dos membros; email e identificadores de usuário permanecem fora do contrato.

## Invariants

- No máximo cinco vínculos acessíveis totais por pessoa, somando criação e participação.
- Um responsável inicial e um vínculo inicial em todo laboratório criado pela feature.
- Nomes podem repetir; `accessCode` é único globalmente.
- Nenhum contexto ativo é criado ou persistido.
- Detalhes e ações de risco exigem vínculo; desativação e exclusão exigem também que o principal seja o `userId` responsável, sem serializar esse campo.

## State transition

```text
valid + authenticated + linked count < 5
  -> atomic LaboratoryRoom + ResearchersLinked
  -> available in list
failure -> neither record is created
```

## Migration assessment

O baseline não possui migration versionada e `accessCode` não é único. Será criada migration incremental apenas para a constraint. Aplicação remota exige inspeção de histórico/schema/duplicidades e autorização separada.
