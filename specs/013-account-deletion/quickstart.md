# Validação da exclusão

Worktree `C:/projetos/consolidados/HidroFlorestas-account-deletion`, branch
`feat/account-deletion`, base `40190f7`; npm ci por lock e prisma generate.
Não copiar dotenv nem resetar banco de desenvolvimento/homologação.

```powershell
./scripts/accounts-local-postgresql.ps1 -Action Run -Executable npm.cmd -CommandArguments @('run','test:unit')
./scripts/accounts-local-postgresql.ps1 -Action Run -DatabaseMode Regression -Executable npm.cmd -CommandArguments @('run','test:integration')
./scripts/accounts-local-postgresql.ps1 -Action Run -Executable npm.cmd -CommandArguments @('run','test:migration')
./scripts/accounts-local-postgresql.ps1 -Action Run -DatabaseMode Regression -Executable node -CommandArguments @('--import=tsx','scripts/account-deletion-e2e.ts')
```

Usar schemas próprios do harness com fixtures sintéticas, nunca conta real dos
testadores. Validar rollback, FKs, admin/serialização, JWT/provas e R1. Executar
contract, type/lint/build e Playwright em banco descartável próprio.

No navegador: abrir Excluir conta; cancelar; senha errada preserva; senha correta
e checkbox excluem. Outra sessão/provas antigas devem falhar. Vínculos aparecem
por motivo/contagem e impedem envio. Sessão restrita permite só essa exclusão.
Conferir teclado/mobile e ausência de senha em URL/storage/log.
