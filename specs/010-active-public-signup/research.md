# Pesquisa e escolhas: cadastro público ativo

## Estado da conta

- **Decision**: `AuthService.signUp` envia `status: "ACTIVE"` explicitamente ao criar o usuário.
- **Rationale**: o login já exige `ACTIVE`; o default `PENDING` pode continuar servindo outros fluxos.
- **Alternatives considered**: mudar o default Prisma ampliaria o efeito para qualquer criação sem estado explícito e exigiria mudança de schema físico sem necessidade nesta entrega.

## Segurança da entrada e saída

- **Decision**: encaminhar apenas nome, sobrenome, e-mail e hash para a criação, com estado definido pelo servidor; devolver `serializePublicUser`.
- **Rationale**: o corpo JSON pode conter campos extras em runtime, apesar do tipo TypeScript da rota. O DTO público vigente tem somente `firstName`, `lastName` e `image`.
- **Alternatives considered**: propagar `...data` deixaria papel e estado controláveis por campos extras; retornar o registro persistido revelaria campos privados.

## Verificação

- **Decision**: injetar dependências apenas para exercitar `signUp` e `signIn` com uma conta em memória e bcrypt real no teste unitário.
- **Rationale**: comprova a transição entre os dois serviços sem qualquer escrita em Neon.
- **Alternatives considered**: E2E exigiria banco e guardas dedicadas; não é necessário para a regra focal nesta entrega.
