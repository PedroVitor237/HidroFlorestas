# Validação da Fase 2

Executar no worktree `C:/projetos/consolidados/HidroFlorestas-accounts`, branch `feat/account-verification-recovery`, Node 24.19/npm/lockfile do projeto. A configuração privada desta fase segue [.env.accounts.example](../../.env.accounts.example); consultar o [runbook](../../docs/operations/account-homologation-runbook.md). Não copiar o ambiente dos juniors.

## Preparação local

O wrapper `scripts/accounts-local-postgresql.ps1` usa somente o cluster próprio accounts, loopback na porta 55427, dono/marcador/ACL privados e bancos aplicação/teste/referência separados. Acesso exige marcador e ACL compatíveis; não apontar o wrapper da Fase 1 ao novo banco.

Aplicação local da fase usa `ACCOUNT_TRUSTED_INGRESS=local` no perfil próprio e porta 3001. O harness HTTPS injeta `ACCOUNT_LOCAL_APP_ORIGIN` server-side com a origem de loopback exata, flags de teste e confirmação de banco; nenhuma dessas exceções serve ao deployment Vercel. Remoto usa ingresso `vercel`, `VERCEL=1` e `APP_PUBLIC_URL` HTTPS exato para CSRF. Não relaxar Origin/cross-site nem alterar a origem pública de SMTP para HTTP.

```powershell
./scripts/accounts-local-postgresql.ps1 -Action Status
./scripts/accounts-validation.ps1 -Gate CleanInstall
./scripts/accounts-validation.ps1 -Gate RegressionSetup
./scripts/accounts-validation.ps1 -Gate Bootstrap
```

Instalação limpa executa `npm ci` e geração Prisma; não atualizar lockfile. Bootstrap segue [baseline formal](../../prisma/bootstrap/initial-database-bootstrap.md): baseline SQL → resolve da primeira migration já materializada → deploy → status. Ledger final tem 11 migrations, incluindo `20261004000200_account_verification_recovery` e `20261004000300_account_rate_limit_actions`; não executar db push/reset ou reescrever migrations aplicadas.

## Gates locais

Coordenar um processo por vez quando compartilham banco, porta ou `.next`. Build e dev/E2E são sequenciais. O runner guarda logs/tempos/fingerprint em `.accounts-validation/`; somente evidência redigida vai para a feature.

```powershell
./scripts/accounts-validation.ps1 -Gate Unit
./scripts/accounts-validation.ps1 -Gate Mail
./scripts/accounts-validation.ps1 -Gate R1
./scripts/accounts-validation.ps1 -Gate Integration
./scripts/accounts-validation.ps1 -Gate Contract
./scripts/accounts-validation.ps1 -Gate Migration
./scripts/accounts-validation.ps1 -Gate Typecheck
./scripts/accounts-validation.ps1 -Gate Lint
./scripts/accounts-validation.ps1 -Gate Build
./scripts/accounts-validation.ps1 -Gate E2E
./scripts/accounts-validation.ps1 -Gate Https
./scripts/accounts-validation.ps1 -Gate SchemaAudit
```

`Unit` já inclui a suíte de mail; `Mail` registra o gate isolado. `R1` conserva a revisão de validade/lease/posse durante envio. Testes novos cobrem atomicidade, requests idempotentes, código 000042, tentativas duráveis, clock fresco, revogação e orçamento global 100 entre workflows. Gate final exige instalação limpa/candidato estável, não apenas execução focal anterior.

## Jornada e homologação

Jornada sintética: cadastrar endereço autorizado com senha de 15+ caracteres → observar verificação pendente → conferir mensagem recebida pelo worker com transporte sintético → testar erro/reenvio → confirmar → sair/entrar → solicitar reset em outro contexto → abrir mensagem/link → confirmar nova senha → sessão anterior/senha antiga recusadas → novo login e aviso. Novas senhas respeitam 72 bytes UTF-8 e preservam espaços; valores somente whitespace são recusados, sem trim do valor.

Gate B exige a URL HTTPS estável publicada e o scheduler remoto autorizado; ambos continuam dependentes de evidência. [Handoff](handoff.md) contém o roteiro de navegador, sem CLI para testadores. Não consultar prova no banco como substituto de recebimento humano. Configuração/smoke reais são separados de CI determinístico; um worker manual local não prova despacho automático remoto.
