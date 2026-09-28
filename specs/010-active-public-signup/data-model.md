# Modelo de dados: cadastro público ativo

`User` permanece o modelo existente. A criação pública define `status = ACTIVE` e senha com hash. O default do schema para criações sem estado explícito continua `PENDING`.

| Campo | Regra nesta entrega |
|---|---|
| `firstName`, `lastName`, `email` | Dados do cadastro público já existente. |
| `password` | Hash persistido; texto puro não retorna. |
| `status` | `ACTIVE` explícito no cadastro público. |
| `role` | Default `USER` do modelo, sem aceitar seleção pública. |
| `image` | Default existente; pode aparecer no DTO público. |

Os estados `PENDING`, `INACTIVE` e `BLOCKED` continuam disponíveis para administração. Somente `ACTIVE` é elegível para sessão.
