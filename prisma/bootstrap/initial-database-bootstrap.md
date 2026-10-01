# Instalação inicial de um banco PostgreSQL vazio

`migrate deploy` diretamente em um banco vazio falha em
`20260907120000_unique_laboratory_access_code`: a migration cria um índice em
`LaboratoryRoom`, que ainda não existe (`P3018`, SQLSTATE `42P01`). As oito
migrations versionadas foram escritas para um esquema legado já existente.

O arquivo [initial-legacy-baseline.sql](initial-legacy-baseline.sql) formaliza
esse esquema legado para **instalações novas**. Ele deriva do esquema IMP-002
do commit `7b71346` e inclui o índice da primeira migration. A primeira
migration é então registrada como aplicada por `migrate resolve --applied`, e
`migrate deploy` executa as sete seguintes. O histórico de bancos existentes
não deve ser modificado por este procedimento.

## Pré-condições e execução

1. Use um banco novo, identificado e pertencente à instalação. Confirme por
   leitura que `public` não contém tabelas da aplicação nem
   `_prisma_migrations`. Interrompa se houver qualquer objeto ou histórico
   inesperado. Faça backup de qualquer destino que não seja descartável.
2. Com `DATABASE_URL` apontando **somente** para esse banco novo, execute o SQL
   em uma transação com parada no primeiro erro. Em PowerShell, o comando é
   `psql -d "$env:DATABASE_URL" -X -v ON_ERROR_STOP=1 -1 -f prisma/bootstrap/initial-legacy-baseline.sql`.
   Em shell POSIX, use `"$DATABASE_URL"` no lugar de `"$env:DATABASE_URL"`.
3. Confira que o índice `LaboratoryRoom_accessCode_key` existe e que a primeira
   migration versionada continua exatamente com o `CREATE UNIQUE INDEX`
   correspondente. Execute
   `npx prisma migrate resolve --applied 20260907120000_unique_laboratory_access_code`.
   Essa resolução declara o efeito SQL já materializado pelo baseline; ela não
   deve ser usada para contornar uma migration falha em banco existente.
4. Execute `npx prisma migrate deploy`, `npx prisma migrate status` e
   `npx prisma generate`. Verifique nominalmente oito migrations concluídas,
   nenhuma falha e as tabelas exigidas pela aplicação. Faça um smoke controlado
   de leitura/escrita e reverta seus dados de teste.

O ensaio automatizado `scripts/imp006-clean-bootstrap.ts` reproduz o caminho
direto que falha e, com `--with-versioned-baseline`, o procedimento acima em um
banco descartável criado no cluster PostgreSQL local marcado. Ele verifica
pré-condição vazia, os oito registros, tabelas principais e uma transação
sintética de leitura/escrita revertida. O script remove somente o banco que ele
mesmo criou após conferir seu marcador de propriedade.

Este baseline é uma dependência operacional de instalação inicial, não uma
nova migration aditiva nem uma aprovação científica do contrato IHFR.
O procedimento de registrar um baseline já materializado segue o
[fluxo oficial de baselining do Prisma](https://docs.prisma.io/docs/orm/v7/prisma-migrate/workflows/baselining)
e o comando [`migrate resolve`](https://www.prisma.io/docs/cli/v7/migrate/resolve).
