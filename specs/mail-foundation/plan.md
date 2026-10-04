# Implementation Plan: Fundação de e-mail

**Branch**: `feat/mail-foundation` | **Date**: 2026-10-04 | **Spec**: [spec.md](spec.md)

## Summary

CRI-T002–CRI-T006: outbox PostgreSQL transacional, payload AES-GCM, SMTP Gmail/Nodemailer, templates e worker limitado. CRI-T001 parcialmente reconciliada; políticas pré-verificação/legado continuam para Execução 2. Estado vigente: IMPLEMENTACAO_LOCAL_VALIDADA no snapshot `c09e78…df797`, com 13 gates locais PASS e setup privado estruturalmente pronto. Aceite integral BLOQUEIO_DE_SETUP: os dois diagnósticos Gmail falharam por AUTHENTICATION; smoke real ainda NAO_EXECUTADO nesse snapshot, sem envios e sem commits. Resultados reais e histórico em [implementation-evidence.md](implementation-evidence.md).

## Technical Context

**Language/Version**: TypeScript, Node 24.19.0, npm 12.0.2.
**Primary Dependencies**: Next 16.3.6, Prisma 7.4.2, pg, Nodemailer (sem upgrades amplos).
**Storage**: PostgreSQL; banco local isolado com marcadores e schemas próprios por caso.
**Testing**: node:test/tsx, Playwright, SMTP local controlado com TLS.
**Target Platform**: Windows local; Node serverless preparado, Vercel efetivo não confirmado.
**Project Type**: aplicação web full-stack.
**Performance Goals**: lote <=4, concorrência <=2; deadline 15s por SMTP; lease 90s.
**Constraints**: sem mudança auth/IHFR, segredos/banco real/envios reais sem setup autorizado.
**Scale/Scope**: somente fundação; nenhum endpoint/tela de contas novos.

## Constitution Check

PASS pré/pós-design: pedido atual prevalece sobre restrição histórica; feature/spec própria, integração próxima com Execução 2, fontes classificadas, testes proporcionais, nenhuma edição docs/raw/governança global. Nenhum hook `.specify/extensions.yml` instalado. Slug sem número oficial e branch local criada da mesma base; nenhum pull/merge/rebase.

## Project Structure

```text
specs/mail-foundation/{spec,plan,tasks,research,data-model,quickstart,implementation-evidence}.md
specs/mail-foundation/contracts/mail.md
src/app/api/server/mail/{contracts,config,crypto,templates,transport,outbox,worker,runtime,trigger}.ts
src/app/api/internal/mail/process/route.ts
scripts/mail-{worker,smoke,verify}.ts
tests/mail/{mail-core,mail-smtp}.test.ts
tests/{integration/mail-outbox,migration/mail-foundation}.test.ts
prisma/migrations/20261004000100_mail_foundation/migration.sql
docs/operations/mail-runbook.md
```

**Structure Decision**: manter fronteira e scripts/testes existentes; sem workflow CI paralelo.

## Estado inicial e preservação

Base `3102b07a0a3f0f15e10d6d0646036a6ba7c8beb3`, branch inicial `docs/contas-rascunhos-imagens`, upstream `origin/docs/contas-rascunhos-imagens`, único worktree `C:/projetos/consolidados/HidroFlorestas`. Preservar não rastreados: pacote zip, execucao/, docs/reports/007-ihfr-evolution/, imp006-final-stat.txt, imp006-final-status.txt, imp006-final.diff. Sem diff rastreado inicial. Não incluir prompt pré-existente em commits.

## Verificações obrigatórias definidas antes do código

| Gate | Comando/ação | Critério |
|---|---|---|
| Instalação limpa | npm ci; npx prisma generate | lock reproduzível, sem upgrades amplos |
| Unit + mail/TLS | npm run test:unit; npm run test:mail:unit | contratos/crypto/templates/redaction/TLS reais |
| Integração Pg | npm run test:integration via harness local | atomicidade, idempotência, concorrência, limites, leases, retry/cancel/cleanup |
| Contrato | npm run test:contract via harness local | auth/API atuais e endpoint máquina |
| Migration | npm run test:migration via harness local | base anterior/legado/constraints/reaplicação |
| E2E | npm run test:e2e via Regression | cadastro/login/logout/admin/vínculos e regressão existente |
| HTTPS E2E | npm run test:e2e:https via Regression | cookies/sessões HTTPS |
| Tipos/estilo/build | npm run typecheck; npm run lint; npm run build | todos PASS |
| Segurança/escopo | diff/check, bundle/secret audit, revisão | sem achados impeditivos |
| Smoke Gmail | npm run mail:smoke, setup autorizado | enqueue→worker→Gmail; aceitação separada de recebimento |

Registrar comando, hora America/Sao_Paulo, exit code, contagens e fingerprint em implementation-evidence.md. Qualquer FAIL/SKIP/BLOQUEIO_DE_SETUP/NAO_EXECUTADO obrigatório proíbe commits. CI remoto não executado por ausência de push é limitação explícita do pedido, não motivo para push.

## Dependências e andamento

Estado vigente: configuração privada e autorização da caixa sintética foram preparadas; falta autenticação aceita pelo Gmail para executar o smoke obrigatório. Nenhum ponto de confirmação entre etapas técnicas autorizadas. A ação restante na conta Google depende do usuário; não há correção local demonstrada que substitua essa autenticação. Política operacional de produção permanece pendente.

Histórico inicial de 2026-10-04: SMTP/config/caixa autorizada estavam ausentes; código e testes independentes avançaram após inspeção e definição da matriz.

Fechamento local histórico de 2026-10-04, snapshot `69a5c648…1c818`: contratos/persistência/transporte/worker/runbook implementados; unit 255+10, integração 118, migration 27, contrato 2, E2E 55, HTTPS 2, typecheck/lint/build/npm ci PASS no snapshot final registrado. Smoke executado: BLOQUEIO_DE_SETUP. T014 e T017 permaneceram abertos; nenhuma execução remota/produção, nenhum commit. Auditoria completa dev apresentou 10 high preexistentes; cadeia de produção sem vulnerabilidades. Alterações preexistentes preservadas naquele fechamento.

## Continuação histórica de 2026-10-04 — snapshot 3898722

Estado: CORRECAO_R1_VALIDADA_LOCALMENTE; aceite integral BLOQUEIO_DE_SETUP. R1 reproduzido antes de corrigir em PostgreSQL real com barreiras sem sleeps. Os nove módulos coincidiam com a revisão independente; ela foi insumo, sem usar seu exit 0 como aprovação. Correção: UPDATE condicional fresco, orçamento monotônico conservador, recusa sem renovação e deadlineAt separado da validade. Toda a matriz local foi repetida no fingerprint `3898722dd01c9b26c0e532b38f117fcd0323ec98111beedd6cfc83272479e595`; FAIL anteriores preservados. Smoke novamente bloqueado antes de conexão/envio. Nenhum commit enquanto esse gate obrigatório estiver bloqueado.

Retomada: branch `feat/mail-foundation`, HEAD `3102b07a0a3f0f15e10d6d0646036a6ba7c8beb3`, sem upstream/staged, mesmo worktree. Preservar toda a implementação não commitada e também os anexos raiz `execucao-01-emails-sol-ultra.md`, `execucao-01-continuacao-emails-sol-ultra.md`, `revisao-execucao-01-emails.zip` e `src/app/api/server/mail.zip`. Manifesto inicial redigido em `.mail-validation/continuation-initial.json`.

## Estado validado antes da investigação focal — snapshot c09e78

`EVIDENCIA_IMPLEMENTACAO`: fingerprint funcional `c09e78f8536a029b15be66434f19586f6e2b07c18d9126e73ad13bef734df797`. R1 17/17; Unit 255+12; Integration 132 (25 outbox); Migration 27; Contract 2; E2E 55; HTTPS 2; RegressionSetup, Typecheck, Lint, Build, CleanInstall e SchemaAudit PASS. SchemaAudit encontrou zero remanescentes. Os 13 gates locais passaram; os FAIL anteriores, incluindo fixtures, E2E e lint, continuam registrados como histórico.

O `.env` privado usa o carregamento dotenv já suportado, está ignorado/não rastreado/não staged e tem ACL protegida para usuário atual e SYSTEM. Cifra, HMAC e segredo worker são três chaves CSPRNG independentes; conta, senha e autorização do smoke foram coletadas por interface local mascarada. A auditoria de 19:01:29.239–19:01:31.586 UTC confirmou presença/formato conforme o runtime, independência e nenhuma ocorrência dos valores atuais/PII nos escopos verificados. O relatório privado ignorado preserva também o FAIL intermediário causado por uma regra incorreta do auditor, posteriormente corrigida. Isso não comprova autenticação Gmail, remetente oficial de produção ou ausência de futuras escritas sensíveis.

SmtpVerify (`npm run mail:verify`) teve exit 1/FAIL por AUTHENTICATION em 18:38:41.250–18:38:44.184 UTC e, após nova gravação privada de senha, novamente em 18:50:09.226–18:50:12.568 UTC. Nenhuma mensagem foi enviada; Smoke nesse fingerprint permanece NAO_EXECUTADO. T014/T017 seguem abertos; T022/T023 registram execução e revisão locais, sem aceite integral. A retomada exige corrigir a autenticação na conta Google, repetir diagnóstico, executar o smoke autorizado e atualizar evidências/auditoria antes de considerar commits. Nenhum staging, commit, push, merge, PR ou deploy foi realizado.

Divergência de preservação observada ao final: `imp006-final-stat.txt`, `imp006-final-status.txt` e `imp006-final.diff` constam do manifesto inicial, mas não foram localizados na busca atual por nome no workspace. A causa não foi determinada; não foram restaurados nem atribuídos à implementação. Os demais anexos devem continuar preservados.

## Retomada focal — autenticação Gmail

Pedido atual: preservar runtime R1, setup privado e resultados concluídos; investigar precedência e correspondência de conta/senha. Inspeção real de processo, registro Windows e subprocesso CLI confirmou `.env` raiz atual, sem overrides antigos. Adaptador SMTP real retornou 535/AUTH/CREDENTIALS_REJECTED, sem envio. Formulário privado reaberto para comparar localmente a conta exibida pelo Google e receber nova senha mascarada; a comparação declarada da conta não substitui a autenticação SMTP.

Os três `imp006-final-*` reapareceram idênticos aos hashes iniciais; nenhuma recriação pelo agente, causa histórica indeterminada. O ZIP preexistente em src mudou e agora contém nove módulos idênticos aos atuais. Preservado sem staging/cópia; fingerprint vigente `aedd43d949cdff51f749a99be541ccd8fece0286d7d03ae6fdf5fc40288ad6a8`. Todos os PASS anteriores continuam com seu snapshot original. Prioridade: resolver autenticação, executar smoke real e atender gates obrigatórios do snapshot final antes de commits. Sem reconstrução de infraestrutura ou operações remotas.

## Restrição da conta — atualização posterior em 2026-10-04

O usuário informou que a própria interface Google declara Senhas de app indisponíveis e confirmou verificação em duas etapas ativada (`FATO_DOCUMENTADO`, origem: relato do usuário). Novas tentativas/coleta interrompidas e formulário encerrado. Registrar `BLOQUEIO_DE_SETUP / GOOGLE_APP_PASSWORDS_UNAVAILABLE`; causa específica ainda não demonstrada. Pesquisa oficial e comparação concluídas em research.md; consulta de elegibilidade somente de leitura, uma ação por vez. R1, configuração privada e PASS históricos preservados; nenhuma nova matriz ou smoke executado nessa etapa documental.

Limite expresso da autorização atual: não implementar OAuth ou trocar arquitetura/provedor antes de apresentar recomendação e impacto. Caso senha de app continue indisponível, apresentar a proposta documentada e manter a mudança como `PENDENCIA_DE_DECISAO`. Gates T014/T017 seguem obrigatórios; nenhuma proposta, botão de login, recebimento por fornecedor diferente ou PASS antigo substitui o contrato atual de aceite.

Resposta posterior do usuário: Proteção Avançada ativada (`FATO_DOCUMENTADO`, relato da configuração da conta). A regra oficial bloqueia Senhas de app; não repetir autenticação recusada. `RECOMENDACAO`: outra caixa Gmail de teste elegível preserva arquitetura e contrato, condicionada à disponibilidade/autorização da caixa e coleta local privada. Nenhuma outra conta configurada nem mudança implementada. OAuth próprio nesta conta deve atender a restrição de apps verificados; a proposta anterior não é desbloqueio automático. Setup/R1/gates históricos preservados; bloqueio integral e proibição de commits mantidos.

Exceção posterior expressamente solicitada pelo usuário: uma única nova verificação SMTP em 17:04:35–17:04:37 America/Sao_Paulo. Configuração atual confirmada, resultado FAIL/535/AUTHENTICATION, nenhum envio ou alteração. Histórico preservado e bloqueio mantido; nenhuma repetição automática, smoke ou commit liberado.

## Retomada autorizada com nova senha de aplicativo

O usuário informou posteriormente que a conta selecionada já tem verificação em duas etapas e que Senhas de app está disponível, e autorizou nova criação/coleta privada e diagnóstico, proibindo reutilizar a senha recusada (`FATO_DOCUMENTADO`, origem: pedido atual). Essa instrução permite retomar o método existente, sem implementar alternativa arquitetural. Não inferir qual ajuste na conta mudou a disponibilidade; os relatos e FAIL anteriores permanecem históricos.

Formulário local reaberto no modo RequireFreshPassword: coletar mailbox mascarada, criar a senha na interface Google pelo usuário e salvar mailbox/allowlist/confirmation/senha juntas somente ao final. Recusar a senha anterior por comparação em memória e verificar preservação de configuração de proteção/JWT; nenhum valor ou digest secreto em evidências. Após status completo/fresco, confirmar precedência/formato/privacidade, realizar diagnóstico e, se aceito, prosseguir aos gates obrigatórios e smoke autorizados. T014/T017 continuam condicionadas ao aceite efetivo; nenhuma senha antiga será usada para o diagnóstico desta retomada.

## Aceite integral da retomada — 2026-10-04

EVIDENCIA_IMPLEMENTACAO: snapshot `aedd43d949cdff51f749a99be541ccd8fece0286d7d03ae6fdf5fc40288ad6a8`, 15 gates reexecutados PASS; SMTP autenticado com nova senha coletada privadamente, smoke completo com uma aceitação e chegada confirmada pelo usuário. Privacidade, bundle, segurança e revisão de escopo PASS; nenhum runtime refeito. Bloqueios anteriores são históricos. AGENTS.md recebeu o bloco gerenciado por next dev, verificado no gerador instalado e preservado fora dos commits deste recorte. Anexos imp006-final-* presentes e iguais ao manifesto, sem recriação pelo agente. Entrega/commits e contrato da Execução 2 em implementation-evidence.md.
