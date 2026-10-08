# Implementation Plan: Verificação e recuperação de contas

**Branch**: `feat/account-verification-recovery` | **Date**: 2026-10-04 | **Spec**: [spec.md](spec.md)

## Summary

Entregar CRI-T007–T010 sobre a fundação `80ff1cfbe7799fccdde5be923530e3a6edf62010`, preservando R1. Serviços transacionais reutilizam desafios/outbox/limiter; sessões normais e restritas têm propósito/versionamento; telas entregam cadastro, retomada, reset e troca. Políticas e destinos foram aprovados pelo usuário no checkpoint em 2026-10-04. Gate A permite commits locais; Gate B exige operação real e continua separado.

## Technical Context

**Language/Version**: TypeScript, Node 24.19.0, npm e lockfile existentes.
**Primary Dependencies**: Next.js 16.3.6, Prisma 7.4.2, PostgreSQL, bcrypt 6, jsonwebtoken 9, Nodemailer 10; sem upgrade.
**Storage**: cluster próprio local porta 55427; bancos aplicação, teste e referência distintos; remotos isolados pelo checkpoint. Schema lifecycle sintético existente.
**Testing**: node:test/tsx, PostgreSQL real com relógio/barreiras, Playwright desktop/mobile/HTTPS e worker com transporte sintético determinístico capturado por IPC no harness; SMTP real tem gate separado.
**Target Platform**: Node.js/App Router, homologação autorizada independente dos juniors/produção.
**Project Type**: web full-stack.
**Performance Goals**: worker preserva lote4/concorrência2/lease90s/deadline15s; meta remota proposta acionamento60s/aceitação120s, sujeita ao destino.
**Constraints**: nenhuma edição em migrations/fundação documentais históricas, dados originais ou raw; nenhuma prova em DTO/log; baseline formal antes de banco novo; build e dev/E2E sequenciais.
**Scale/Scope**: homologação de baixo volume com allowlist; nenhum recurso fora de contas.

## Constitution Check

PASS antes e depois do design: feature própria e entrega vertical; TD-017 administrativa preservada; autoridade registrada no checkpoint, implementação separada de intenção; testes de riscos concretos; documentos históricos imutáveis; ownership separado backend/UI/infra/operação. Sem `.specify/extensions.yml` ou hooks instalados. Plan script executado via Git Bash do ambiente; branch física mantém nome autorizado independente do slug da spec.

## Project Structure

```text
specs/012-account-verification-recovery/{spec,plan,research,data-model,quickstart,tasks}.md
specs/012-account-verification-recovery/contracts/accounts.md
src/app/api/server/accounts/{policy,proof,contracts,service,http,maintenance}.ts
src/app/api/server/auth/{session,auth.core}.ts
src/app/api/auth/{sign-up,sign-in,email-verification,password-reset,change-password}/
src/app/{verify-email,forgot-password,reset-password}/
src/app/(private)/change-password/
prisma/migrations/20261004000200_account_verification_recovery/migration.sql
prisma/migrations/20261004000300_account_rate_limit_actions/migration.sql
tests/unit/{account-contracts,account-security-review,account-client-contracts,accounts-local-postgresql}.test.ts
tests/mail/account-proof.test.ts
tests/{contract,integration,migration}/account-*.test.ts
tests/e2e/account-verification-recovery.spec.ts
scripts/accounts-validation.ps1
scripts/accounts-local-postgresql.ps1
docs/operations/account-homologation-runbook.md
.env.accounts.example
vercel.json
```

**Structure Decision**: reutilizar infraestrutura existente, adicionar módulo focal de contas e contratos HTTP fechados; não criar segunda fila ou infraestrutura de CI.

## Estado inicial e responsabilidades

Worktree exclusivo `C:/projetos/consolidados/HidroFlorestas-accounts`, branch `feat/account-verification-recovery`, base `80ff1cfbe7799fccdde5be923530e3a6edf62010`, inicialmente limpo. Original readonly preserva AGENTS adicional, prompts/ZIPs e relatórios locais. Implementação own schema/backend/specs/testes focais; policy_audit own UI/types/context/E2E; foundation_audit own infra/Pg/fixtures/ignore; root own homologação/operação/evidências/checkpoint. Nenhum commit antes Gate A.

## Verificações obrigatórias antes do código

| Gate | Comando/ação | Critério |
|---|---|---|
| Instalação limpa | accounts-validation.ps1 -Gate CleanInstall | reproduzível pelo lock e geração Prisma |
| Unit/mail/R1 | accounts-validation.ps1 -Gate Unit; -Gate Mail; -Gate R1 | política, crypto, sessão, contratos e R1 preservados |
| PostgreSQL | accounts-validation.ps1 -Gate Integration; -Gate Migration; -Gate Contract | atomicidade, constraints, upgrade e concorrência |
| Preparação/bootstrap | accounts-validation.ps1 -Gate RegressionSetup; -Gate Bootstrap | baseline SQL + resolve correspondente + deploy de 11 migrations, sem db push/reset |
| UI | accounts-validation.ps1 -Gate E2E; -Gate Https | jornadas completas, regressão, mobile/teclado, cookie seguro |
| Qualidade | accounts-validation.ps1 -Gate Typecheck; -Gate Lint; -Gate Build | sequenciais à app/E2E, sem .next concorrente |
| Segurança | diff/secret/bundle/audit; accounts-validation.ps1 -Gate SchemaAudit | sem vazamento e sem fixture remanescente |
| Gate B | deployment + duas jornadas reais + scheduler | URL estável acessível, operação automática autorizada |

Falhas reais são corrigidas e revalidadas; resultados históricos não contam. Fingerprint funcional exclui ZIPs/secrets/evidências documentais e registra manifesto. Gate B não será declarado por leitura de prova no banco ou worker manual.

## Design final e estado de verificação

Migration012 adiciona identidade/coorte/idempotência/aviso; migration013 amplia a constraint de ações do limiter sem reescrever SQL já aplicado. O contador `account-global` cobra uma única janela de 100 operações/hora compartilhada entre os workflows, em transação própria antes dos locks de identidade/conta. Sua cobrança permanece mesmo se a operação de domínio falhar; atomicidade de domínio continua abrangendo conta, desafio, outbox e idempotência. Tentativas erradas são confirmadas antes da resposta de erro. O consumo usa `clock_timestamp()` imediatamente na atualização condicional após awaits/hashing, sem confiar apenas em horário lido antes.

Novas senhas preservam seus espaços e Unicode; o requisito preexistente de conteúdo não vazio continua recusando valores compostos somente por whitespace, alinhado ao login. Não há trim do valor armazenado ou comparado. `AccountRequest` vence em 24 h e é removida em lotes de até 100 pelo maintenance executado no worker.

No reset público, negação global encerra antes da transação de identidade; negação por endereço/ingresso confirma os counters e encerra antes de lookup/receipt. O handler conserva resposta 202 neutra e piso de latência/jitter em ambos os casos. O harness de navegador usa somente destinatários sintéticos exatos injetados, sem ampliar a allowlist remota nem afrouxar CSRF.

A origem externa para CSRF é `APP_PUBLIC_URL` HTTPS no ingresso Vercel explicitamente confiável; cabeçalhos forwarded de host não são autoridade. O perfil local próprio resolve a normalização de loopback do Next com Host loopback na porta 3001 ou origem exata `ACCOUNT_LOCAL_APP_ORIGIN` injetada pelo harness. O seam HTTPS de produção exige flags de fixture/confirmação e nunca é aceito no Vercel; não altera a origem HTTPS usada por SMTP.

O preflight de publicação observou status Vercel no projeto existente, fora da equipe de homologação autorizada. `vercel.json` adiciona somente `git.deploymentEnabled['feat/account-verification-recovery']=false`, para impedir deploy automático por Git desta branch em projetos que leem a configuração. Deploy manual requer vínculo explícito ao novo projeto. Não altera settings do projeto antigo, não é Ignored Build Step e não desativa branches ausentes na regra. Consumo do arquivo por eventual RootDirectory customizado e webhooks externos continuam fora da evidência disponível; não declarar ausência de integração pela lista vazia da equipe nova.

O acesso somente leitura ao projeto antigo respondeu 403. A documentação oficial situa vercel.json na raiz do projeto/app, e não comprova leitura universal da raiz do repositório. Portanto, a recomendação de preflight é manter o push pendente desse controle ou de resolução explícita do risco material; o Gate A não substitui essa comprovação.

Verificações anteriores ao fechamento: unitários existentes e novos 273 PASS, provas/mail 5 PASS, contrato HTTP 4 PASS. UI12 integrada passou 7/7 no snapshot anterior à configuração Git. Auditoria independente confirmou no fingerprint `2df65d3ea2fff2e9f7579d18de5f0f36d5c6500a426524f14822af8cd7bee228`: Integration 157/157 PASS (25 cenários de contas), Migration 33/33 PASS (seis novos), Contract 6/6 PASS, R1 17/17 PASS e bootstrap/setup de 11 migrations sem falha, checksums iguais. Não substituem a matriz completa na [evidência consolidada](implementation-evidence.md), nem comprovam HTTPS ou Gate B. [Quickstart](quickstart.md), [handoff](handoff.md), [runbook](../../docs/operations/account-homologation-runbook.md) e [.env.accounts.example](../../.env.accounts.example) usam os caminhos reais desta fase.

## Retomada operacional — 2026-10-05

T024 avança com vínculos novos expressamente autorizados pelo usuário:
Vercel `hidrofloresta-8598`, Neon organização `HidroFloresta`. Login por API,
projetos separados, bootstrap remoto de 11 migrations, chaves próprias e
27 variáveis cifradas production-only concluídos. Conector `thalesvalente`
removido; nenhum projeto anterior foi alterado. Deploy será upload CLI direto,
sem conexão Git; push permanece pendente da integração histórica.

O alias estável efetivamente reservado pela API é
`https://hidroflorestas-accounts-homologatio.vercel.app`. Atualização limitada
ao guard do scheduler para equipe/origem exatas: Pester 17/17 PASS; demais
arquivos funcionais permanecem idênticos ao candidato validado, sem repetir
gates não afetados. Finalizar correção privada de destinatários antes de atualizar
a allowlist remota/publicar; depois configurar scheduler, observar execuções
automáticas/backlog e executar jornadas com recebimento/aprovação humanos.

## Continuação operacional vigente — 2026-10-05

T024 concluída: candidato `116afb0` publicado; scheduler GET autenticado sem corpo
operacional, conforme o contrato existente. Pester 17/17 PASS e apenas o script
de scheduler mudou; banco, aplicação e regressão preservados. Duas chamadas
automáticas e recuperação de fila comprovadas. Usuário confirmou cadastro,
verificação, login/logout, troca e aviso; relato de reset ainda diverge da
evidência técnica, e reenvio/substituição permanecem pendentes. T025/T028 abertos.
A solicitação posterior de exclusão de conta terá branch/spec próprias.
