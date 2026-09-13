# Modelo de dados: acesso autenticado seguro

**Feature**: `001-authenticated-access`
**Natureza**: modelo de implementação da feature, sem alteração persistente
**Fonte do baseline**: `prisma/schema.prisma` no commit
`3c7591021439a8b18af9866996bff2ffc61c5ac4`

## Limite do modelo

Este documento modela somente a conta já existente, seu estado, a identidade pública derivada e
o conceito de sessão. Não cria entidade de sessão, tabela, coluna, enum, migration ou regra de
administração. O schema é `EVIDENCIA_IMPLEMENTACAO`, não aprovação ampla do domínio.

## Conta de usuário persistida

Entidade existente: `User`.

| Campo relevante | Tipo observado | Uso nesta feature | Exposição ao cliente |
|---|---|---|---|
| `id` | UUID em `String` | Identificador interno e vínculo do JWT | Proibida no DTO desta jornada |
| `email` | `String`, único | Localização da conta no login | Proibida na resposta; existe só na entrada |
| `firstName` | `String` | Identidade apresentada | Permitida no DTO público |
| `lastName` | `String` | Identidade apresentada | Permitida no DTO público |
| `password` | `String` | Hash usado exclusivamente na comparação bcrypt | Proibida |
| `image` | `String`, default vazio | Apresentação opcional | Permitida no DTO público |
| `status` | `UserStatus`, default `PENDING` | Elegibilidade atual da sessão | Interna; não necessária no DTO |
| `role` | `UserRole` | Fora da autenticação básica | Proibida neste contrato |
| `isAdmin` | `Boolean` | Compatibilidade interna com `requireAdmin` após autenticação | Proibida no DTO público |
| `createdAt`, `updatedAt` | `DateTime` | Sem uso na jornada | Proibida neste contrato |
| relações | coleções Prisma | Fora do recorte | Proibidas neste contrato |

### Regras de acesso aos dados

1. A consulta de credenciais seleciona apenas os campos necessários à comparação, à elegibilidade
   e à construção da identidade pública.
2. O hash pode existir na memória do servidor somente até concluir a comparação bcrypt; handlers,
   logs, erros e respostas nunca o recebem.
3. A consulta de sessão por `id` seleciona somente `id`, `firstName`, `lastName`, `image`, `status`
   e `isAdmin`; `status` é consumido pela elegibilidade e não integra o principal retornado.
4. Após confirmar `status === ACTIVE`, o núcleo constrói `AuthenticatedPrincipal`; o adapter nunca
   devolve o registro consultado diretamente.
5. O serializer público constrói um novo objeto campo a campo; nenhuma resposta usa spread de
   registro Prisma.

## Estado da conta

Enum existente: `UserStatus`.

| Estado | Pode iniciar sessão | Pode restaurar/usar sessão | Resultado nesta feature |
|---|---:|---:|---|
| `ACTIVE` | Sim, se credenciais forem válidas | Sim, se o JWT também for válido | Identidade pública e acesso protegido |
| `PENDING` | Não | Não | Falha controlada, sem cookie/sessão válida |
| `BLOCKED` | Não | Não | Falha controlada, sem cookie/sessão válida |
| `INACTIVE` | Não | Não | Falha controlada, sem cookie/sessão válida |

Transições administrativas entre esses estados estão fora do escopo. A feature apenas lê o valor
atual. Qualquer transição posterior de `ACTIVE` para outro estado torna a sessão inelegível na
próxima validação autoritativa.

## Identidade pública

`PublicUserDto` é uma projeção não persistida e um contrato allowlisted.

```text
PublicUserDto
├── firstName: string
├── lastName: string
└── image: string
```

O conjunto de chaves é fechado. Em especial, não admite `id`, `email`, `password`, hash,
`status`, `role`, `isAdmin`, timestamps ou relações. Login e restauração usam exatamente a mesma
representação. `id` continua interno à sessão e `email` continua entrada de credencial.

## Principal autenticado interno

`AuthenticatedPrincipal` é uma projeção interna, não persistida e separada de `PublicUserDto`.
Ela só pode ser construída depois de validar JWT, existência atual do usuário e
`status === ACTIVE`.

```text
AuthenticatedPrincipal
├── id: string
├── firstName: string
├── lastName: string
├── image: string
└── isAdmin: boolean
```

`status` participa da consulta e da decisão de elegibilidade, mas não integra o principal após a
validação. `password`, `email`, `role`, timestamps e relações também não integram o principal.
`isAdmin` é mantido exclusivamente para que o consumidor existente `requireAdmin` continue
recebendo o dado mínimo necessário. `/api/auth/me` sempre transforma o principal pelo serializer
de `PublicUserDto`; `AuthenticatedPrincipal` nunca é enviado diretamente ao cliente.

## Sessão autenticada

Sessão é um conceito transitório e não uma entidade Prisma.

| Elemento | Representação | Regra |
|---|---|---|
| Credencial do navegador | cookie `auth_token` | HTTP-only; não acessível ao estado React |
| Payload JWT | `userId`, `iat`, `exp` | `userId` é string não vazia; sem senha, email, status ou privilégios |
| Algoritmo | `HS256` | Allowlist igual na emissão e verificação |
| Segredo | `JWT_SECRET` | Obrigatório e não vazio; sem fallback |
| Duração | 604800 segundos | Mesma duração no JWT e no cookie |
| Vínculo | `payload.userId → User.id` | Usuário precisa existir na consulta atual |
| Elegibilidade | `User.status === ACTIVE` | Avaliada no banco, nunca inferida do payload |

### Estados derivados da sessão

```text
AUSENTE
  └─ login válido + usuário ACTIVE ─> AUTENTICADA

AUTENTICADA
  ├─ reload/acesso + JWT válido + usuário ACTIVE ─> AUTENTICADA
  ├─ expiração/adulteração/payload inválido ───────> NÃO AUTENTICADA
  ├─ usuário removido ou deixa de ser ACTIVE ─────> NÃO AUTENTICADA
  └─ logout concluído ─────────────────────────────> NÃO AUTENTICADA

NÃO AUTENTICADA
  └─ logout repetido ──────────────────────────────> NÃO AUTENTICADA
```

Os estados “inválida”, “expirada”, “órfã” e “inelegível” não são persistidos; são resultados da
validação. Todos negam conteúdo e produzem resposta controlada.

## Invariantes

- Nenhuma sessão é emitida antes de credencial válida e `status === ACTIVE`.
- Assinatura válida isoladamente não autentica: usuário existente e `ACTIVE` também são
  obrigatórios.
- Presença isolada do cookie não autentica.
- `AuthenticatedPrincipal` existe somente após elegibilidade atual e nunca cruza a fronteira HTTP.
- Identidade pública nunca contém campos fora da allowlist.
- Logout não cria sessão e é idempotente para sessão ausente ou inválida.
- Não existe mudança de schema ou migration associada a este modelo.
