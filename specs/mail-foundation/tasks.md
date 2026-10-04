# Tasks: Fundação de e-mail

## Phase 1: Setup

- [x] T001 Reconciliar CRI-T001/baseline e preservar pendências em specs/mail-foundation/research.md.
- [x] T002 Criar CRI-T002/spec/plano/matriz e contratos em specs/mail-foundation/.
- [x] T003 Instalar Nodemailer/test SMTP reproduzivelmente em package.json e package-lock.json.

## Phase 2: Foundational

- [x] T004 Definir contratos/config/crypto server-only em src/app/api/server/mail/ e testes em tests/mail/.
- [x] T005 Implementar CRI-T004 schema/migration aditiva em prisma/schema.prisma e prisma/migrations/20261004000100_mail_foundation/migration.sql.
- [x] T006 Verificar migration/base anterior e limites compartilhados em tests/migration/mail-foundation.test.ts e tests/integration/mail-outbox.test.ts.

## Phase 3: User Story 1 — intenção durável

- [x] T007 [US1] Testar rollback/idempotência/cifra em tests/integration/mail-outbox.test.ts.
- [x] T008 [US1] Implementar enqueue/cancel/limiter transacional em src/app/api/server/mail/outbox.ts.

## Phase 4: User Story 2 — processamento seguro

- [x] T009 [US2] Testar dois workers, lease tardio, timeout, retries, invalidação e limpeza em tests/integration/mail-outbox.test.ts.
- [x] T010 [US2] Implementar claim/worker/observabilidade em src/app/api/server/mail/worker.ts.
- [x] T011 [US2] Implementar CRI-T005/templates/transporte e TLS real em src/app/api/server/mail/transport.ts, templates.ts e tests/mail/.

## Phase 5: User Story 3 — operação

- [x] T012 [US3] Proteger acionamento e CLI em src/app/api/internal/mail/process/route.ts e scripts/mail-worker.ts.
- [x] T013 [US3] Escrever CRI-T006/runbook/config exemplos/smoke em docs/operations/mail-runbook.md e scripts/mail-smoke.ts.
- [x] T014 [US3] Executar smoke Gmail autorizado e registrar em specs/mail-foundation/implementation-evidence.md (snapshot aedd43d9; SMTP aceito e recebimento confirmado pelo usuário).

## Phase 6: Polish

- [x] T015 Integrar testes nos scripts reais em package.json e rodar regressão/migrations/E2E/HTTPS/typecheck/lint/build/npm ci; registrar evidências em specs/mail-foundation/implementation-evidence.md.
- [x] T016 Revisar segurança/consistência/snapshot e gate em specs/mail-foundation/implementation-evidence.md (resultado global vigente: PASS no snapshot aedd43d9, incluindo smoke real e confirmação de recebimento).
- [x] T017 Somente se gate integral PASS, criar commits locais atômicos e registrar hashes em specs/mail-foundation/implementation-evidence.md (infraestrutura commitada após aceite; consolidação operacional/evidências no commit deste fechamento).

## Dependencies & strategy

Setup → fundação → US1 → US2 → US3 → validação. MVP técnico US1; aceite exige todas as histórias e gates. Pesquisa/revisão read-only podem ocorrer em paralelo; schema/auth/config são editados sequencialmente pelo agente principal. Sem agentes concorrentes de implementação compartilhada. Pendências futuras não marcam CRI-T001 integralmente concluída.

Estado vigente: T014/T025 concluídas; 15 gates e revisões PASS, uma aceitação SMTP no smoke e recebimento confirmado pelo usuário. T017 depende desse aceite integral e da criação efetiva de commits locais. Consulte [evidência](implementation-evidence.md) para resultados e entrega. As narrativas cronológicas abaixo são históricas: ausências, rejeições e bloqueios não foram reescritos como PASS.

## Phase 7: Continuação — R1 e novo aceite

- [x] T018 Reconstruir contexto, registrar worktree e comparar revisão independente com código atual, sem copiar/stagear anexos.
- [x] T019 Reproduzir R1 antes da correção em tests/integration/mail-outbox.test.ts, com PostgreSQL isolado e barreiras determinísticas; conservar FAIL.
- [x] T020 Corrigir fencing pré-SMTP e deadline operacional tipado, preservando validade, claim, retries e fencing final.
- [x] T021 Cobrir retomada tardia, recuperação/SENT concorrente, margem, cancelamento/invalidação e deadline/socket com testes permanentes.
- [x] T022 Reexecutar todos os gates no novo fingerprint e revisar segurança/escopo; manter histórico.
- [x] T023 Atualizar contratos/runbook/evidência existentes e registrar smoke ou BLOQUEIO_DE_SETUP. T014/T017 continuam condicionados ao aceite integral.

Continuação histórica, snapshot `3898722…e595`: R1 17/17; Unit 255+12; Integration 132 (25 outbox); Migration 27; Contract 2; E2E 55; HTTPS 2; Typecheck/Lint/Build/CleanInstall PASS. Auditoria de schemas: zero remanescentes. Smoke: BLOQUEIO_DE_SETUP, nenhum SMTP externo naquele snapshot. Os FAIL de reprodução e ajustes de fixtures permanecem no histórico; T014/T017 continuaram abertos.

Estado vigente (`EVIDENCIA_IMPLEMENTACAO`), fingerprint `c09e78f8536a029b15be66434f19586f6e2b07c18d9126e73ad13bef734df797`: os 13 gates locais PASS, com R1 17, Unit 255+12, Integration 132, Migration 27, Contract 2, E2E 55, HTTPS 2 e zero schemas remanescentes. Setup privado/ACL/chaves independentes e autorização do smoke foram verificados sem registrar valores. Auditoria pós-troca de senha PASS em 19:01:29.239–19:01:31.586 UTC; o FAIL intermediário do auditor está preservado e sua regra foi reconciliada com o runtime.

SmtpVerify FAIL/exit 1 por AUTHENTICATION em 18:38:41.250–18:38:44.184 UTC e novamente em 18:50:09.226–18:50:12.568 UTC após nova senha fornecida pela interface privada. Zero envios; Smoke vigente NAO_EXECUTADO. T022/T023 marcadas representam gates locais/revisão/documentação com resultado global BLOQUEIO_DE_SETUP, e não conclusão de T014/T017. Estes permanecem abertos, sem staging/commits, até diagnóstico e smoke autorizados passarem e as evidências serem atualizadas.

## Phase 8: Diagnóstico focal de autenticação

- [x] T024 Comparar configuração privada atual com processo, registro Windows e subprocesso dotenv; capturar somente códigos SMTP allowlisted e reconciliar os três anexos ausentes.
- [x] T025 Obter autenticação válida, preservando chaves e runtime R1. Após nova disponibilidade informada pelo usuário e coleta privada de senha diferente da rejeitada, SmtpVerify PASS no snapshot aedd43d9; bloqueios anteriores preservados abaixo.
- [x] T026 Registrar bloqueio informado pelo usuário e comparar alternativas com documentação oficial atual em research.md; interromper antes de qualquer alteração arquitetural. Verificação em duas etapas informada como ativada; a causa específica da restrição ainda depende de evidência da conta.

Inspeção: nenhum override antigo; 535/AUTH/CREDENTIALS_REJECTED, sem envio. Três `imp006-final-*` novamente presentes com hashes iniciais; agente não os recriou. ZIP preexistente atualizado pelo estado recebido, nove módulos iguais aos atuais, preservado fora do index. Snapshot vigente `aedd43d9…ad6a8`; os PASS anteriores permanecem ligados a `c09e78f8…`. T014/T017 continuam pendentes e condicionadas ao snapshot final aprovado.

Atualização posterior: usuário confirmou indisponibilidade de Senhas de app na própria conta e verificação em duas etapas ativada. Formulário encerrado; coleta e tentativas SMTP suspensas. T025 está em BLOQUEIO_DE_SETUP, com correspondência declarada da conta já concluída; causa específica depende de configuração da conta. Consulta de Proteção Avançada somente de leitura pendente. T026 não autoriza implementação da alternativa: o usuário exige parar antes de mudança arquitetural. Comparação e recomendação em research.md, sem novos commits.

Resposta posterior: usuário confirmou Proteção Avançada ativada; consulta de configuração concluída. A regra Google bloqueia Senhas de app, portanto não repetir tentativa/coleta na conta atual. T025/T014/T017 continuam abertas. Possível retomada sem alteração arquitetural: outra caixa Gmail de teste elegível e explicitamente autorizada, ainda não disponibilizada. Nenhuma conta/configuração privada alterada; requisitos de apps verificados são materiais para qualquer proposta OAuth nesta conta.

Exceção posterior: usuário pediu explicitamente uma nova tentativa; realizada somente uma verificação SMTP com a configuração atual, FAIL/535/AUTHENTICATION, exit 1, sem envio. T025/T014/T017 permanecem abertas; nenhum loop, formulário reaberto, alteração técnica ou commit.

Retomada posterior: usuário informou Senhas de app disponível na conta selecionada e autorizou formulário privado/nova senha/diagnóstico, sem reutilizar a senha recusada. T025 passa à coleta local pendente no modo RequireFreshPassword, com gravação conjunta apenas após a segunda etapa, recusa da senha anterior em memória e preservação das chaves internas. Autenticação só será considerada resolvida após diagnóstico aceito; T014/T017 continuam abertas. Nenhuma mudança de arquitetura autorizada ou implementada.

## Fechamento vigente — 2026-10-04

T025 e T014 concluídas no snapshot `aedd43d949cdff51f749a99be541ccd8fece0286d7d03ae6fdf5fc40288ad6a8`: nova senha privada diferente da recusada, SmtpVerify PASS, 15 gates reexecutados PASS e smoke real com uma aceitação SMTP. Recebimento confirmado pelo usuário com “Sim”. Privacidade/bundle/segurança/escopo PASS. As pendências e proibições descritas nas etapas cronológicas anteriores são históricas, preservadas. T017 liberada pelo gate integral, com execução/registro dos commits locais a seguir; nenhuma operação remota autorizada.

T017 concluída após aceite integral: infraestrutura, migration, R1, contratos e testes já commitados; consolidação operacional/histórico neste commit de documentação. Hashes e conferência em implementation-evidence.md, com hash do próprio fechamento consultável pelo Git para evitar autorreferência. Nenhum item desta Execução 1 permanece aberto; pendências de produto/operação para a Execução 2 estão explicitamente fora do recorte.
