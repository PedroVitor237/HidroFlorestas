# Evidência da Execução 1

**Atualização de 2026-10-04: aceite integral PASS no snapshot `aedd43d9…ad6a8`. Nova senha coletada privadamente, sem reutilizar a rejeitada; 15 gates aprovados, incluindo R1 e smoke completo Gmail. Uma aceitação SMTP e recebimento confirmado pelo usuário, registrados separadamente.** O relatório conserva os bloqueios/rejeições anteriores e os snapshots `69a5c648…`, `3898722d…` e `c09e78f8…`; o fechamento vigente está na última seção. Nenhuma alteração arquitetural ou inferência sobre a mudança de elegibilidade da conta.

**Estado histórico da primeira execução: implementação local realizada e validada; aceite integral então BLOQUEADO.** O smoke Gmail retornou `BLOQUEIO_DE_SETUP`, sem envio externo. A prontidão operacional dependia de configuração privada, caixa de teste autorizada, remetente/domínio oficiais e mecanismo/operador de agendamento. Nenhum commit havia sido criado naquele fechamento, conforme a regra explícita do prompt. As seções intermediárias abaixo conservam cada estado temporal; não representam o fechamento atual.

Classificação dos resultados: `EVIDENCIA_IMPLEMENTACAO`. As escolhas reversíveis em [research.md](research.md) são `RECOMENDACAO` aplicada dentro da autorização local, sem aprovação presumida de políticas de contas. O recebimento atual tem origem no relato explícito do usuário (`FATO_DOCUMENTADO`), separado da aceitação SMTP; não há alegação de validação de funcionalidades futuras ou CI remoto.

## Base, snapshot e preservação

Inspeção em 2026-10-04: branch inicial `docs/contas-rascunhos-imagens`, upstream `origin/docs/contas-rascunhos-imagens`, HEAD `3102b07a0a3f0f15e10d6d0646036a6ba7c8beb3`; único worktree `C:/projetos/consolidados/HidroFlorestas`, sem alterações rastreadas iniciais. Branch local de implementação `feat/mail-foundation` criada dessa mesma base, sem pull/merge/rebase. HEAD permanece igual; index sem arquivos staged; commits desta rodada: **0**.

Arquivos preexistentes preservados e fora do recorte: `docs/plans/active/contas-rascunhos-imagens.zip`, `docs/plans/active/contas-rascunhos-imagens/execucao/`, `docs/reports/007-ihfr-evolution/`, `imp006-final-stat.txt`, `imp006-final-status.txt` e `imp006-final.diff`. Nenhuma alteração a `docs/raw/**`, decisões/governança globais, auth/JWT, IHFR, rascunhos ou imagens.

Snapshot funcional final SHA-256: `69a5c64824fa1d4354d5ffb4eed5dee442d53d79812b808d44acdace9bf1c818`. Calculado sobre caminhos ordenados e bytes de src/tests/scripts/prisma, package/lock, configuração de testes/tipos/lint e .gitignore por `mailSnapshotFingerprint`. Inclui arquivos novos pertinentes; exclui artefatos gerados, documentação e estado local do Spec Kit. Não é SHA de commit nem resultado atribuído à base antiga. Todos os gates finais abaixo usaram esse fingerprint; revisões documentais posteriores não alteraram o código.

Ambiente: Windows/PowerShell, Node 24.19.0, npm 12.0.2, Next 16.3.6, Prisma 7.4.2, PostgreSQL 17 loopback dedicado, Chromium Playwright, OpenSSL do Git for Windows. Nodemailer 10.0.14 com tipos próprios, server-only 0.0.1; smtp-server 3.19.17 e @types/smtp-server 3.5.13 somente para desenvolvimento. Demais versões/engines/overrides preservados.

## Entrega e CRI-T001–CRI-T006

| Referência | Estado efetivo |
|---|---|
| CRI-T001 | Parcialmente reconciliada: comportamento ACTIVE/JWT/identidade exata preservado; PD-CRI-001/002 e normalização/colisões permanecem para Execução 2. Nenhuma política pendente foi aprovada por inferência. |
| CRI-T002 | Spec, plano, matriz pré-código, pesquisa, modelo, checklist e tasks em specs/mail-foundation. Slug local sem número IMP inventado. |
| CRI-T003 | Contratos tipados/server-only, configuração lazy, erros allowlisted, cifra/HMAC, interface de transporte e cancelamento/limiter transacionais implementados. |
| CRI-T004 | Migration aditiva e constraints/índices implementados e verificados em PostgreSQL isolado sobre baseline sintética e migrations anteriores. Sem backfill. |
| CRI-T005 | Nodemailer/Gmail e templates v1 implementados; SMTP/TLS real local aprovado. Envio Gmail real **não validado** por falta de setup. |
| CRI-T006 | Outbox/worker, endpoint autenticado, CLIs, métricas, cleanup/recovery e runbook implementados. Ativação periódica/produção pendente; execução manual não prova agendamento. |

Persistência adiciona `emailVerifiedAt` nullable e `credentialVersion=0` sem uso em autenticação; challenges preparatórios sem geração/consumo; outbox cifrada e buckets HMAC sem PII. Enqueue participa da transação Prisma do produtor, demonstra rollback/commit com fixture sintética e recusa mesma chave com conteúdo divergente.

Payload, destinatário e URL-base ficam sob AES-256-GCM com IV aleatório, AAD de id/template/key-id e keyring externo; compromisso idempotente usa HMAC independente e estável. Conteúdo sensível é apagado nos estados terminais; metadados são removidos após 7 dias. Idempotência dura enquanto a linha estiver retida, inclusive depois de limpar o payload.

Worker usa SKIP LOCKED, lote até 4, concorrência até 2, lease 90 s e token de posse. SMTP ocorre fora de transação; resultado tardio exige posse/lease/validade vigentes. Deadline é o menor entre 15 s e validade restante, com socket encerrado. Até 5 claims, backoff de 30 s exponencial com jitter até 25%, sem extensão/regeneração de prova. Consumidores são todos aguardados mesmo se escrita/log falhar. Aceitação com resposta perdida admite duplicação em retry; não há promessa exatamente uma vez.

Transporte é lazy e estrito: Gmail 465/TLS imediato ou 587/STARTTLS obrigatório, certificados válidos, arquivos/URLs arbitrários desabilitados. Templates HTML/texto PT-BR escapam conteúdo, preservam zeros, recebem expiresAt e usam origem HTTPS confiável; nenhum código/token em assunto/preheader. Endpoint GET/POST não aceita query/body/destinatário e retorna somente contadores no-store; autorização Bearer server-side com comparação segura.

## Matriz final executada

Data: **04/10/2026**, horários BRT (`America/Sao_Paulo`, UTC−03). Comandos reais, UTC com milissegundos, contagens, logs e histórico do coletor estão em [validation-results.json](validation-results.json). Os logs locais redigidos ficam em `.mail-validation/`, ignorados pelo Git e separados de `test-results/`.

| Gate / comando efetivo | Início–fim BRT | Exit | Contagem / resultado |
|---|---|---:|---|
| node --import=tsx scripts/imp006-local-regression-setup.ts | 13:28:55–13:28:56 | 0 | PASS; banco local com marcadores verificado, setup repetível |
| npm run test:unit | 13:28:56–13:29:04 | 0 | PASS; 255 existentes + 10 mail/TLS; 0 fail/skip |
| npm run test:integration | 13:29:04–13:29:39 | 0 | PASS; 118, incluindo 11 de outbox; 0 fail/skip |
| npm run test:migration | 13:29:39–13:29:48 | 0 | PASS; 27; 0 fail/skip |
| npm run test:contract | 13:29:48–13:29:51 | 0 | PASS; 2 contratos HTTP/OpenAPI existentes; acionamento mail coberto nos novos unitários |
| npm run typecheck | 13:29:51–13:29:53 | 0 | PASS |
| npm run lint | 13:29:53–13:30:01 | 0 | PASS; 0 erros, 4 warnings preexistentes |
| npm run build | 13:30:01–13:30:11 | 0 | PASS; Prisma generate + produção, sem configuração SMTP |
| npm run test:e2e | 13:30:33–13:32:18 | 0 | PASS; 55, incluindo cadastro/login/logout/admin/vínculos |
| npm run test:e2e:https | 13:33:09–13:33:37 | 0 | PASS; 2; teardown PASS, remainingFixtureUsers=0, temporaryArtifacts=REMOVED |
| node --import=tsx scripts/mail-clean-install.ts | 13:34:36–13:36:24 | 0 | PASS; npm ci + Prisma generate + 10 mail/TLS + typecheck em cópia isolada |
| npm run mail:smoke | 13:37:22–13:37:22 | 1 | **BLOQUEIO_DE_SETUP**; Gmail não acionado, nenhuma aceitação/inbox alegada |

Invocação das suítes: `./scripts/mail-validation.ps1 -Gate <nome>`; o JSON registra cada nome/invocação. Integration/E2E/Https usam banco de regressão local; Migration/Contract/Build usam contexto Schema. Preflight comprova destino isolado e marcadores antes de qualquer escrita. Fixtures e teardown são próprios; nenhum banco real foi resetado/dropado/truncado. A instalação limpa preservou node_modules do workspace e usou diretório temporário com npm ci pelo lock.

Cobertura nova: atomicidade produtor/enqueue, concorrência de enqueue, conteúdo divergente, limites compartilhados/rollback, cifra/adulteração/chave desconhecida/rotação/redaction, escape/zeros/validade/origem, TLS 465/587, rejeição de certificado/STARTTLS/auth, dois workers sem lock durante SMTP, lease recuperado/resultado antigo, falha pós-aceitação, indisponibilidade/backoff/5 tentativas, expiração entre ondas, invalidação/consumo/cancelamento em voo, limpeza limitada/repetível, espera de todos os consumidores, autenticação de máquina e migrations/legado/constraints.

## Correções e falhas registradas

Falhas anteriores não foram transformadas em PASS; a rodada final foi reexecutada após correções. O histórico persistente do coletor conserva inclusive o E2E FAIL do snapshot anterior. Alguns logs iniciais, antes da correção do diretório do coletor, foram removidos pelo comportamento de limpeza do Playwright; seus resultados não são usados como evidência de aprovação final.

- Implementação: corrigidos tipos de configuração/parâmetros, senha de app formada só por espaços, teste de adulteração determinístico, segredo ausente de teste independente do ambiente, barreira SMTP que poderia aguardar DATA depois de timeout e espera de consumidores por allSettled. Acrescentados testes concretos para falha de escrita enquanto outro consumidor envia e expiração entre ondas.
- Harness: npm escreve notices em stderr; coleta agora ocorre por subprocesso Node com saída redigida, evitando falso bloqueio PowerShell. Integração exige Regression, em vez de presumir que os fixtures atuais aceitam Schema. Diretório de evidências mudou para `.mail-validation` para sobreviver à limpeza Playwright. Condição react-server foi acrescentada aos testes/CLIs que importam server-only.
- Teste efetivo de Stop→Start detectou que a alteração inicial com Start-Process -Wait esperava o daemon PostgreSQL. Corrigido para Hidden/PassThru e WaitForExit(30000), com checagem exit/status e propriedade mantida. Stop preservou dados; Start real passou em aproximadamente 4 s. O fingerprint foi recalculado e todas as suítes finais repetidas depois dessa correção. [Referência Microsoft](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/start-process?view=powershell-5.1).
- Migration: atualizado o teste que presumiu a migration IMP-006 como última, preservando ordem/histórico anterior e reconhecendo a nova migration aditiva.
- Falha preexistente de helper E2E: Playwright rejeitava `datetime-local` com segundos `:00`, que Chromium normaliza sem segundos. Reprodução mínima confirmou equivalência. Ajustado somente o helper para remover segundos zero, preservando instante, offset, frações e assertions; nenhum comportamento de coleta foi alterado. E2E final 55/55.
- Next dev acrescentou bloco automático ao AGENTS.md. Removido somente esse bloco, após verificar que todo o corpo restante correspondia ao HEAD inicial; AGENTS.md sem diff final. Nenhuma instrução preexistente foi descartada.

## Segurança, escopo e limitações

Revisão somente leitura dos agentes e revisão principal: nenhum achado impeditivo introduzido no recorte. O endpoint e os módulos sensíveis têm fronteira server-only; nenhum transporte fake é fallback do runtime. A busca por nomes de configuração secreta e smtp.gmail.com em `.next/static` retornou zero arquivos. `.env.mail.example` contém apenas valores sintéticos e campos secretos vazios; nenhum `.env` privado foi preparado/staged.

Em 04/10/2026 às 13:23:50 BRT: `npm audit --omit=dev --json` → exit 0, PASS, zero vulnerabilidades. `npm audit --json` → exit 1, **FAIL preexistente**, 10 high na cadeia ESLint/glob; 18 registros afetados do lockfile idênticos à base, nenhuma vulnerabilidade associada às novas dependências de e-mail. Nenhum upgrade amplo/audit fix aplicado. Os quatro warnings de lint também são preexistentes em signup, página inicial, user-profile e white-box.

`git diff --check` PASS; referências/terminologia/snapshot e escopo conferidos ao fechar a documentação. Skills Spec Kit instaladas aplicadas, checklist da spec completo; checklist de qualidade não é aceite integral. Documentação técnica do Next instalado e skill vercel:nextjs consultadas para route handler/runtime/maxDuration. Revisões documentais esclareceram ordem RegressionSetup→Integration e retenção idempotente.

Configuração ausente confirmada por presença de nomes somente, incluindo dotenv: SMTP_HOST/PORT/SECURE/REQUIRE_TLS/USER/APP_PASSWORD, MAIL_FROM, APP_PUBLIC_URL, keyring/active-id/HMAC, MAIL_WORKER_SECRET e confirmação/caixa allowlisted do smoke. São bloqueios reais de configuração/autorização; não foram solicitados segredos pelo chat nem presumidos destinatários. Diagnóstico Gmail verify e observação de inbox: `NAO_EXECUTADO`; smoke separadamente executado e bloqueado antes de conexão/envio.

CI remoto: `NAO_EXECUTADO`, pois push não autorizado. Não há workflow GitHub/vercel.json existente a adaptar; novos testes entram nos scripts npm reais. Push, PR, merge, tag/release, deploy, cron/configuração remota e migration de produção não executados. Instalação de banco vazio por migrate deploy não validada: o histórico depende de baseline sintética nos testes, conforme runbook.

## Retomada segura e Execução 2

Consulte [mail-runbook.md](../../docs/operations/mail-runbook.md) e [.env.mail.example](../../.env.mail.example). Injete privadamente a configuração Google com 2FA/senha de aplicativo e chaves, origem HTTPS, e caixa de teste explicitamente autorizada. MAIL_SMOKE_RECIPIENT deve ser igual à allowlist privada MAIL_SMOKE_ALLOWED_RECIPIENT e MAIL_SMOKE_CONFIRMATION deve reconhecer o teste. Nunca enviar a usuários reais nem colar credenciais no chat.

Após setup privado, use o mesmo banco de teste isolado para smoke com evidência:

```powershell
./scripts/imp006-local-postgresql.ps1 -Action Run -Executable node -CommandArguments @('--import=tsx','scripts/mail-gate-runner.ts','Smoke','.mail-validation','mail:smoke')
```

O script exercita enqueue→commit→worker→Gmail, com dado sintético. Registra aceitação SMTP separada de inbox não observada. `npm run mail:verify` é somente diagnóstico, não substitui envio. `npm run mail:worker` executa lote aguardado; endpoint exige Bearer privado. Mudanças no código exigem recalcular fingerprint e repetir gates pertinentes antes de commits. Apenas com o gate integral aprovado, revisar/stagear exclusivamente arquivos deste recorte e criar commits atômicos; não incluir os anexos preexistentes.

Para Execução 2 estão disponíveis [contratos](contracts/mail.md): enqueue/cancel/limiter transacionais, templates, MailTransport com expiresAt, challenges e campos preparatórios. Permanecem PD-CRI-001/002 (pré-verificação/legado), formato/normalização de identidade com inspeção segura de colisões, política de validade/tentativas/reenvio, geração/HMAC/consumo de provas, endpoints/UI e uso futuro de credentialVersion no JWT/revogação. Nenhum desses fluxos foi iniciado nesta rodada. Remetente/domínio oficiais, operador e agendamento são pendências operacionais explícitas, sem contratação ou cron incompatível presumido.

**Commits realizados: nenhum.** O bloqueio obrigatório do smoke impede commits pela seção 8 do prompt. A implementação e as evidências permanecem no worktree local, com HEAD e arquivos preexistentes preservados.

## Continuação de 2026-10-04 — revisão independente, R1 e novo gate

Classificação: `EVIDENCIA_IMPLEMENTACAO`. A continuação foi autorizada pelo pedido para executar `execucao-01-continuacao-emails-sol-ultra.md`. Escolhas técnicas locais continuam `RECOMENDACAO`, sem confirmação presumida da equipe. **Estado final local: CORRECAO_R1_VALIDADA_LOCALMENTE; aceite integral BLOQUEIO_DE_SETUP; commits 0.**

Retomada em `feat/mail-foundation`, sem upstream, HEAD `3102b07a0a3f0f15e10d6d0646036a6ba7c8beb3`, único worktree já existente e index vazio. Toda a implementação não commitada foi preservada. Além dos anexos históricos, foram preservados os prompts raiz, `revisao-execucao-01-emails.zip` e `src/app/api/server/mail.zip`. O coletor vigente inclui arquivos em src, inclusive esse arquivo ZIP preexistente, no fingerprint; nenhum anexo foi copiado sobre código, staged ou versionado. Manifestos locais redigidos ficam em `.mail-validation/`, ignorados; o resumo está na nova entrada `continuations` de [validation-results.json](validation-results.json). Os campos históricos desse JSON foram conservados.

### Validação do insumo e reprodução antes da correção

ZIP usado: `C:/projetos/consolidados/HidroFlorestas/revisao-execucao-01-emails.zip`; SHA-256 `94b61029c8035a4d8b1d78b19e7af370c759015fde0132fd0284b0b17250c0af`. Extraído somente em `C:/Users/user/AppData/Local/Temp/hidro-mail-independent-review-44e4526038b64041b59b43cafd3b4115/revisao-execucao-01-emails`, fora do workspace. Conferidos caminhos canônicos, ausência de traversal/links/duplicatas e limites: 13 arquivos, 50.733 bytes.

README, results, harness, hashes e as nove cópias de módulos foram lidos integralmente. Os nove SHA-256 declarados coincidiam com os bytes do ZIP **e do repositório antes de corrigir**, inclusive worker `76cb285420fbc682e8848c997106f52e110febffe81642e04eed6bf97d825596`. Todos tinham LF; normalização de quebra de linha não alterou a comparação. O harness externo usa stubs Prisma/Nodemailer e VM com require normal, não constitui sandbox nem typecheck. Seus 16 PASS/exit 0 incluem a expectativa adversa de dois envios: são resultado histórico externo, sem aprovação do projeto. Não executei esse harness nem copiei seus resultados para o projeto; usei a reprodução real abaixo.

Em 14:51:55–14:51:57 BRT, `./scripts/mail-validation.ps1 -Gate R1` executou `npm run test:mail:r1` sobre `f29a0b3ceb3f435479db12f1c1b4a54991ffbcddb98bbfd7ae4b2e40d7e50af1`, com **worker ainda original**, PostgreSQL 17 isolado e duas barreiras: a consulta real executa no banco e somente a entrega de seu resultado é retida. O relógio controlado avança além dos 90 s; em um cenário outro worker recupera e conclui SENT. Ambos os testes falharam: `oldSends=1`, esperado 0; no cenário com recuperação houve um envio de B e um de A. O fencing final de A retornou STALE sem impedir o efeito. Exit 1, FAIL preservado. O runner inicial também contabilizava dois arquivos sem testes selecionados; essas entradas não representam assertions de aprovação.

Os ajustes seguintes também preservam seus FAIL: `b6e79f79…` expôs fixture com validade da mensagem maior que a do challenge, corretamente recusada pelo enqueue; a fixture passou a criar intenção válida antes de encurtar o challenge exclusivamente no teste. `9ed47731…` expôs assertion exata usando decurso real; esse caso passou a controlar também o relógio monotônico. Não foram relaxados invariantes do produtor ou assertions para permitir SMTP tardio. Revisão do diff identificou falha do novo UPDATE que poderia ser classificada como UNKNOWN e apagar payload sem SMTP; separada das falhas de payload/transporte e coberta por recuperação real.

### Correção e limites

Após decifrar/validar o payload, o worker executa UPDATE condicional autocommit: PROCESSING, token atual, prova/challenge vigente e lease com pelo menos 15 s + 2 s. Runtime usa `clock_timestamp()` do PostgreSQL; o relógio injetado existe para testes determinísticos. Retorna lease, validade efetiva mínima de outbox/challenge e instante `fencedAt`; renderiza com essa validade e verifica novamente imediatamente antes de chamar o transporte.

Desconta conservadoramente todo tempo monotônico da consulta/retomada/renderização e combina o menor orçamento do banco com o UTC local. Assim, resposta atrasada ou relógio local atrasado não concede tempo adicional. Recusa janela menor que 17 s sem renovar lease nem alongar prova; mantém PROCESSING recuperável, com validade e limite de tentativas existentes. Erro de banco no fence propaga por allSettled, aguarda os demais consumidores e preserva payload/claim para recuperação.

`MailTransport.send` exige `deadlineAt` separado de `expiresAt`. Deadline local é `agora + min(15 s, leaseBudget − 2 s, proofBudget)`; adaptador limita novamente a 15 s/validade/deadline, verifica datas finitas e prazo antes de abrir/concluir conexão, e destrói o socket ao vencer. A margem de 2 s reserva fechamento/persistência; não garante executar durante congelamento ilimitado do processo. Nenhuma transação/lock atravessa SMTP. Claim SKIP LOCKED, retries finitos, cifra, redaction, atualização final condicionada e espera de todos os consumidores permanecem.

Cancelamento antes do fence impede SMTP. Entre seu commit e o efeito externo continua uma janela distribuída em que cancelamento posterior não consegue impedir/desfazer todo envio. Resposta perdida após aceitação continua admitindo duplicação em retry, limitada por validade/tentativas; nenhuma promessa de exactly-once, entrega ou inbox.

Testes permanentes: 14 cenários R1 em PostgreSQL real e 3 focais de transporte/TLS. Cobrem atraso de SELECT/fence após lease, SENT de outro worker, recuperação, margem insuficiente, cancelamento/invalidação/consumo, expiry de mensagem/challenge, orçamento com relógio local atrasado, falha de banco sem perda de payload, caminho runtime com relógio PostgreSQL e socket fechado depois de DATA sem resposta. Suíte de outbox completa conserva também concorrência de dois workers, resultado tardio, cancelamento em voo, retries e espera de consumidores. Concorrência provada por barreiras, sem sleeps arbitrários.

### Matriz reexecutada no novo snapshot

Fingerprint final do coletor vigente: **`3898722dd01c9b26c0e532b38f117fcd0323ec98111beedd6cfc83272479e595`**. Ambiente Windows/PowerShell, Node 24.19.0/npm 12.0.2, Next 16.3.6, Prisma 7.4.2, PostgreSQL 17 loopback com propriedade confirmada, Chromium e OpenSSL do Git. Dependências e lock não foram atualizados nesta continuação. Cada gate abaixo pertence a esse fingerprint, com comando/invocação, UTC, exit, contagens e histórico no JSON existente.

| Gate / comando real | Início–fim BRT (04/10/2026) | Exit | Resultado |
|---|---|---:|---|
| npm run test:mail:r1 | 15:00:44–15:00:52 | 0 | PASS; 17, 0 fail/skip |
| node --import=tsx scripts/imp006-local-regression-setup.ts | 15:01:33–15:01:34 | 0 | PASS; destinos/marcadores verificados |
| npm run test:unit | 15:01:37–15:01:44 | 0 | PASS; 255 + 12 mail/TLS, 0 fail/skip |
| npm run test:integration | 15:01:48–15:02:28 | 0 | PASS; 132, incluindo 25 outbox, 0 fail/skip |
| npm run test:migration | 15:02:32–15:02:40 | 0 | PASS; 27, 0 fail/skip |
| npm run test:contract | 15:02:43–15:02:46 | 0 | PASS; 2, 0 fail/skip |
| npm run typecheck | 15:02:49–15:02:52 | 0 | PASS |
| npm run lint | 15:02:55–15:03:03 | 0 | PASS; 0 erros, 4 warnings preexistentes |
| npm run build | 15:03:06–15:03:18 | 0 | PASS; sem setup SMTP |
| npm run test:e2e | 15:03:57–15:05:45 | 0 | PASS; 55 |
| npm run test:e2e:https | 15:07:01–15:07:29 | 0 | PASS; 2, teardown PASS, fixtures 0 |
| node --import=tsx scripts/mail-clean-install.ts | 15:08:11–15:09:45 | 0 | PASS; npm ci, Prisma generate, 12 mail/TLS, typecheck em cópia isolada |
| npm run test:ihfr:audit:assert-zero | 15:08:23–15:08:24 | 0 | PASS; zero schemas de teste remanescentes |
| npm run mail:smoke | 15:08:28–15:08:29 | 1 | **BLOQUEIO_DE_SETUP**, antes de conexão/envio |

Invocações principais: `./scripts/mail-validation.ps1 -Gate <nome>`. Smoke e auditoria de schemas usaram o helper PostgreSQL com o coletor vigente e contextos Schema/Regression respectivamente; comandos exatos estão no JSON. A instalação limpa preservou node_modules do workspace. O Next dev acrescentou novamente seu bloco automático a AGENTS.md: removido apenas esse bloco, após conferir corpo canônico e restaurar as quebras de linha do worktree; AGENTS.md sem diff final. Nenhuma instrução preexistente foi descartada.

Em 15:06:16–15:06:21 BRT: audit produção exit 0, zero vulnerabilidades; audit completo exit 1, **FAIL preexistente**, 10 high de desenvolvimento, 18 registros afetados idênticos ao HEAD, sem novos achados na cadeia mail. Não houve audit fix/upgrade amplo. Bundle cliente: busca por secrets/runtime SMTP em `.next/static`, exit nativo 1 = zero arquivos correspondentes, PASS. Verificação estática do recorte: zero literais de chave privada/referências públicas secretas/secrets preenchidos no exemplo; links locais existentes; revisão de código e redaction aprovadas. Isso não é auditoria completa do histórico de segredos do repositório. `git diff --check`, escopo, fingerprint e preservação são conferidos novamente no fechamento.

Reconciliação documental: o repositório já possui [bootstrap formal](../../prisma/bootstrap/initial-database-bootstrap.md) e baseline legado versionado. A afirmação anterior sobre ausência de bootstrap completo era imprecisa; runbook/research agora reconhecem o procedimento. Sua contagem histórica de oito migrations antecede a nona, de e-mail. Não executei nem alego novo teste de bootstrap de banco vazio nesta continuação. **Nenhuma migration nova foi criada para R1**; permanece `20261004000100_mail_foundation`, validada novamente em isolamento.

### Bloqueio restante, commits e Execução 2

Presença/estrutura efetiva de configuração conferida novamente sem imprimir valores: os 15 nomes de SMTP/MAIL/APP_PUBLIC_URL e autorização/allowlist do smoke continuam ausentes; configuração estrutural, confirmação e allowlist não prontas. Foi solicitado somente preparo privado, sem segredos/endereço/provas no chat, enquanto todo trabalho local prosseguiu. O smoke oficial retornou BLOQUEIO_DE_SETUP; **Gmail não conectado, SMTP externo não aceito, inbox NOT_OBSERVED**. `mail:verify` diagnóstico: NAO_EXECUTADO por ausência de configuração; não substituiria o smoke.

Pelas seções 9 e 11 do prompt de continuação, o gate integral permanece bloqueado. **Commits realizados: nenhum, sem hashes/mensagens novos; nada staged.** HEAD e anexos preservados. Não houve push/PR/merge/tag/deploy/cron remoto/configuração remota/migration de produção. CI remoto NAO_EXECUTADO conforme proibição de push.

Retomada necessária ainda dentro da Execução 1: disponibilizar configuração privada e mailbox autorizada conforme runbook, executar o smoke pelo comando oficial já documentado, registrar aceitação SMTP separadamente de inbox, conferir que o snapshot permaneceu igual e somente então aplicar o gate de commits. Alteração funcional exige novo fingerprint e nova matriz. O código local não é declarado como aceite integral.

Execução 2 continua sem iniciar: políticas PD-CRI-001/002, identidade/colisões, validade/tentativas/reenvio de provas, geração/HMAC/consumo, endpoints/UI de verificação/reset e credentialVersion/revogação. Os produtores futuros devem usar o contrato atualizado `expiresAt` + `deadlineAt`; produção ainda depende de remetente/operador e acionamento periódico aprovados. Nenhuma pendência de produto foi resolvida por inferência nesta continuação.

## Continuação adicional — setup privado e autenticação Gmail

Classificação: `EVIDENCIA_IMPLEMENTACAO`. Autorização: pedido adicional do usuário para executar todo setup técnico local, gerar chaves próprias, coletar os dados Google por entrada local privada e continuar a validação. Os resultados anteriores permanecem históricos. **Estado vigente: CORRECAO_R1_VALIDADA_LOCALMENTE; SMTP_AUTHENTICATION_FAIL; aceite integral BLOQUEIO_DE_SETUP; commits 0.**

### Configuração preparada pelo agente

Inspeção confirmou que `mail:verify`, `mail:worker` e `mail:smoke` usam `dotenv/config`, cujo arquivo padrão é `.env` na raiz. A configuração `.env.e2e.local` existente não é carregada por esses CLIs e foi preservada. O agente criou o `.env` privado usando o mecanismo já suportado, comprovou que está ignorado e fora do index e restringiu a ACL ao usuário atual e SYSTEM, sem herança. Nenhum valor privado foi registrado nesta evidência.

Keyring AES-GCM, chave HMAC de idempotência e segredo de acionamento foram gerados localmente por chamadas independentes a `crypto.randomBytes(32)`. Formatos e independência dos bytes foram validados; sem reutilizar JWT ou senha Google. Foram preparados host Gmail, porta 587, STARTTLS obrigatório, confirmação exigida pelo contrato e origem HTTPS local para o smoke sintético. A origem local não decide o domínio oficial de produção.

A conta e a senha de aplicativo foram coletadas em formulário Windows local, com entrada mascarada e gravação privada atômica. A mesma caixa foi configurada para `SMTP_USER`, `MAIL_FROM`, destinatário e allowlist do smoke, após validação de formato/coerência. O formulário e seus metadados sanitizados ficam somente em `.mail-validation/`, ignorado; credenciais não passaram por argumentos, chat, comandos interativos ou relatórios. A etapa de senha pode ser reaberta mantendo conta e chaves. Não houve troca para OAuth: o prompt original, seção 3, especifica SMTP Gmail com senha de aplicativo.

Foi corrigido um erro do helper privado de gravação: em PowerShell 5, o argumento nulo de backup de `File.Replace` precisava ser `[NullString]::Value`. O teste de gravação do valor público de confirmação manteve bytes e ACL; nenhum segredo de teste foi enviado ao Google.

### Ajustes de validação e matriz vigente

O coletor passou a carregar o mesmo `.env` antes de capturar/redigir a saída, sem substituir as variáveis de banco injetadas pelo harness. A redaction cobre também cada chave individual do keyring e a senha de aplicativo sem espaços. Teste permanente verifica essas formas com valores sintéticos.

Na matriz intermediária `acbc…`, E2E encontrou dois headings homônimos após streaming: o seletor de contexto laboratorial passou a exigir o `h1` real, preservando a assertion e o comportamento da aplicação. No snapshot abaixo, lint inicialmente encontrou `require` no helper temporário de relatório ignorado; esse helper foi corrigido para import dinâmico. Os FAIL e suas execuções posteriores permanecem separados no histórico do coletor, sem reclassificação.

Fingerprint funcional: **`c09e78f8536a029b15be66434f19586f6e2b07c18d9126e73ad13bef734df797`**. Todos os gates locais abaixo foram repetidos nesse fingerprint. Horários UTC de 04/10/2026; invocações e logs constam na segunda continuação de [validation-results.json](validation-results.json).

| Gate | Início–fim UTC | Exit | Resultado |
|---|---|---:|---|
| R1 | 18:25:26–18:25:34 | 0 | PASS; 17 |
| RegressionSetup | 18:26:27–18:26:28 | 0 | PASS |
| Unit | 18:26:31–18:26:38 | 0 | PASS; 255 + 12 mail/TLS |
| Integration | 18:26:41–18:27:20 | 0 | PASS; 132, incluindo 25 outbox |
| Migration | 18:27:24–18:27:32 | 0 | PASS; 27 |
| Contract | 18:27:34–18:27:36 | 0 | PASS; 2 |
| Typecheck | 18:27:39–18:27:41 | 0 | PASS |
| Lint, execução corrigida | 18:28:40–18:28:48 | 0 | PASS; 0 erros, 4 warnings preexistentes |
| Lint, fechamento dos helpers/documentação | 19:00:51–19:03:14 | 0 | PASS; 0 erros, mesmos 4 warnings |
| Build | 18:31:07–18:31:17 | 0 | PASS |
| E2E | 18:31:20–18:33:02 | 0 | PASS; 55 |
| Https | 18:33:05–18:33:32 | 0 | PASS; 2, teardown 0 fixtures |
| CleanInstall | 18:33:35–18:35:07 | 0 | PASS; npm ci, Prisma generate, 12 mail/TLS, typecheck isolados |
| SchemaAudit | 18:36:24–18:36:24 | 0 | PASS; zero schemas remanescentes |
| SmtpVerify inicial | 18:38:41–18:38:44 | 1 | FAIL; Google rejeitou autenticação, sem envio |
| SmtpVerify após gravação privada da senha | 18:50:09–18:50:12 | 1 | FAIL; AUTHENTICATION novamente, sem envio |

O diagnóstico oficial usou `./scripts/imp006-local-postgresql.ps1 -Action Run -Executable node -CommandArguments @('--import=tsx','scripts/mail-gate-runner.ts','SmtpVerify','.mail-validation','mail:verify')`. Diagnóstico adicional expôs somente a classificação allowlisted `AUTHENTICATION` e `messageSent=false`, sem resposta crua do provedor. Presença e formato válidos não comprovam autorização da conta. Nenhuma mensagem foi enviada nesta etapa; o smoke completo deste snapshot permanece `NAO_EXECUTADO`, aguardando autenticação válida.

### Privacidade e bloqueio restante

Auditoria de 18:44:11–18:44:14 UTC confirmou `.env` protegido, ignorado, não tracked/staged, chaves independentes e estrutura da conta/allowlist/confirmação válida. Zero correspondências dos valores privados atuais, senha normalizada e endereço nos 3.490 objetos Git alcançáveis por refs/reflog, 663 arquivos versionados, 35 novos do recorte, 70 logs, 72 arquivos de bundle cliente, um histórico PowerShell e quatro artefatos do formulário. Nenhum arquivo temporário de gravação restou. O relatório local `.mail-validation/private-setup-audit-final.json` contém apenas resultados sanitizados. Essa leitura precede a segunda gravação privada da senha e exige nova conferência após ela.

Auditoria de dependências e bundle repetida no fingerprint `c09e78f8…`: produção exit 0, zero vulnerabilidades; audit completo exit 1, 10 high preexistentes de desenvolvimento, 18 registros do lock idênticos ao HEAD. Busca de nomes secretos/runtime Gmail no bundle cliente: zero arquivos correspondentes. Configuração estrutural, confirmação e allowlist prontas; autenticação real continua FAIL. Os resultados sanitizados ficam em `.mail-validation/continuation-security-final.json` e na entrada vigente do JSON de evidências.

Limites dessa auditoria: valores literais atuais, comparação sem distinção de caixa para o endereço, arquivos lidos no instante informado; ZIPs examinados como bytes, sem expandir todos os arquivos históricos; históricos PowerShell limitados aos locais configurados/padrão do usuário atual. O `.env` privado legítimo em repouso foi excluído da busca por vazamento. Alterar a senha ou produzir novos logs requer nova conferência; não há alegação de auditoria universal de todo segredo possível.

Nova auditoria depois da segunda gravação e do diagnóstico SMTP: **PASS em 19:01:29–19:01:31 UTC**, mesmo fingerprint, zero correspondências nos mesmos escopos, agora com 72 logs. Presença/formato seguem exatamente o contrato do runtime: 16 caracteres ASCII alfanuméricos após remover espaços, sem comprovar validade perante o Google. Um FAIL intermediário do auditor que exigia somente letras foi identificado como erro da verificação, preservado em `.mail-validation/private-setup-audit-intermediate-20261004185742792.json` e corrigido antes de repetir toda a auditoria. Nenhuma configuração privada foi alterada pelo auditor.

Conferência após o último lint, em 19:06:31 UTC: 88 artefatos privados redigidos e 11 documentos/JSON do recorte examinados, zero arquivos com valores secretos atuais ou endereço da caixa, zero links locais quebrados. `.mail-validation/closing-private-check.json` registra somente contagens/resultado. A leitura completa anterior do Git/bundle continua associada ao mesmo fingerprint; nenhum commit ou alteração funcional foi produzido depois dela.

Conferência final de preservação: os cinco anexos de prompts/ZIPs presentes mantêm seus hashes iniciais. Os três artefatos não rastreados `imp006-final-stat.txt`, `imp006-final-status.txt` e `imp006-final.diff`, registrados no manifesto inicial, não foram encontrados na busca atual no repositório. A causa permanece indeterminada; inspeção dos comandos e limpezas da rodada não encontrou operação que alcance esses três caminhos. Não foram recriados por suposição. Index vazio, AGENTS.md sem diff, fingerprint vigente e `git diff --check` aprovados. Essa observação atual não altera os registros históricos de presença.

A próxima ação dependente do usuário está exclusivamente na conta Google: obter uma senha de aplicativo autorizada para a mesma caixa e digitá-la no formulário local preparado. O agente continua responsável por configuração, diagnóstico, matriz final, smoke `enqueue → commit → worker → Gmail`, documentação e commits condicionais. Aceitação SMTP e observação de inbox serão registradas separadamente. **Nenhum commit enquanto o smoke obrigatório não passar.** Não houve push, PR, merge ou deploy; nenhuma migration nova para R1; Execução 2 e pendências de produção permanecem como registradas acima.

## Investigação focal de autenticação — retomada de 2026-10-04

`EVIDENCIA_IMPLEMENTACAO`: pedido atual do usuário mantém R1, setup privado e testes concluídos e concentra a rodada na rejeição Gmail, sem reconstruir infraestrutura. HEAD e branch continuam iguais, index vazio. Não foram regeneradas chaves, alterados módulos de runtime, banco, migrations ou testes. Os PASS do snapshot `c09e78f8…` permanecem associados àquela execução e não foram sobrescritos.

### Configuração realmente usada

Em 19:38 UTC, inspeção privada comparou os quinze campos SMTP/MAIL/origem do `.env` com o ambiente herdado, registros Windows de usuário/sistema, ambiente efetivo do coletor e subprocesso que importa o mesmo `dotenv/config` da CLI. **Nenhum override antigo encontrado**, nenhum seletor alternativo `DOTENV_CONFIG_PATH`, override de dotenv, encoding alternativo ou `NODE_OPTIONS` presente nos três níveis. Coletor e subprocesso usaram exatamente os valores atuais do arquivo raiz. CWD correto; quatro papéis de endereço iguais; conta com domínio Gmail pessoal; senha presente e no formato aceito pelo runtime. Foram registrados somente presença, igualdade e resultados, nunca valores. Relatório ignorado: `.mail-validation/gmail-private-precedence.json`.

Diagnóstico em 19:40:10–19:40:12 UTC usou `verify()` do adaptador real do projeto, sem envio e sem mudar TLS/timeouts/autenticação: **FAIL AUTHENTICATION; resposta SMTP 535; fase AUTH; CREDENTIALS_REJECTED**. A observação reteve apenas códigos/classificações fechadas antes que o adaptador descarte a resposta crua. Nodemailer 10 possui exports diferentes para import/require; o primeiro observador importou a variante ESM e não capturou detalhes do adaptador CJS. Corrigido somente o observador privado para o mesmo export do CLI; nenhum transporte fake, fallback ou mudança de runtime. Ambas as tentativas FAIL estão preservadas em `.mail-validation/gmail-auth-diagnostic-history.jsonl`. [Códigos oficiais Gmail](https://support.google.com/mail/answer/3726730).

`FATO_DOCUMENTADO`: senha de aplicativo requer verificação em duas etapas e pode ser revogada por mudança da senha Google, conforme [Google](https://support.google.com/accounts/answer/185833). O código 535 confirma rejeição das credenciais; não distingue sozinho senha de outra conta, senha revogada ou erro de digitação. Não foi atribuída causa sem evidência.

A senha não traz um identificador de conta inspecionável. A comparação restante foi preparada no formulário privado: o usuário informa localmente o e-mail exibido na página Google, comparado ao configurado sem alterar os quatro endereços. A origem dessa comparação é `USER_LOCAL_ENTRY_FROM_GOOGLE_PAGE`, e não acesso autenticado do agente à conta. Divergência impede salvar senha nesse modo; correspondência permite entrada mascarada de nova senha e preserva keyring/HMAC/segredo worker. A autenticação SMTP bem-sucedida continua sendo a verificação efetiva do par conta/senha. Janela reaberta com uma ação por vez; nenhuma credencial solicitada pelo chat.

Auditoria privada repetida em 19:48:50–19:48:51 UTC: **PASS**, sem correspondências de valores secretos atuais ou endereço nos 663 arquivos versionados, 35 novos do recorte, 99 artefatos privados de diagnóstico, 72 arquivos de bundle, histórico PowerShell padrão do usuário e 3.492 objetos Git por refs/reflog. `.env` continua ignorado, não tracked/staged e com ACL protegida usuário/SYSTEM; três chaves de 32 bytes independentes; arquivo privado estável durante a leitura. Limites: valores literais atuais, histórico padrão disponível, ZIPs em bytes brutos (os nove módulos do ZIP mail foram comparados separadamente) e arquivos lidos no horário informado. Relatório ignorado `.mail-validation/gmail-auth-privacy-audit.json`, também incluído na terceira continuação do JSON de evidências.

### Reconciliação dos anexos e fingerprint

Na inspeção de 19:37:35 UTC, **os três `imp006-final-stat.txt`, `imp006-final-status.txt` e `imp006-final.diff` estão novamente presentes e byte a byte correspondem aos hashes do manifesto inicial**. Não houve recriação/restauração pelo agente. A ausência observada na rodada anterior fica preservada como fato histórico; sua causa não foi determinada. Não há ausência atual desses três arquivos.

O ZIP preexistente `src/app/api/server/mail.zip` está presente com bytes diferentes do manifesto inicial, modificado em 19:25:34 UTC. Inspeção sem extração mostrou nove módulos, todos idênticos aos nove módulos atuais, sem entradas inesperadas. Foi preservado, sem copiá-lo sobre código e sem staging. Os outros sete anexos do manifesto mantêm hashes iniciais. Isso altera o fingerprint vigente para **`aedd43d949cdff51f749a99be541ccd8fece0286d7d03ae6fdf5fc40288ad6a8`**, pois o coletor já inclui ZIPs dentro de src.

`INFERENCIA`: timestamps sustentam que essa mudança de fingerprint está ligada ao ZIP; ele é o único dos 418 caminhos do coletor com mtime posterior ao R1 final de 18:25:26 UTC. Timestamps não provam identidade de todos os bytes históricos. Manifesto por arquivo da retomada: `.mail-validation/gmail-auth-source-files.json`. Não foi alterado o algoritmo do coletor para aproveitar PASS antigos; verificações obrigatórias para commits precisam satisfazer o snapshot final conforme o contrato. O usuário solicitou foco na autenticação, portanto nenhuma matriz extensa foi repetida antes de resolver esse bloqueio.

**Estado ao encerrar a investigação técnica anterior: SMTP_AUTHENTICATION_FAIL; formulário privado reaberto; smoke completo NAO_EXECUTADO; commits 0.** R1 e os testes históricos preservados. Nenhum push, PR, merge ou deploy.

## Bloqueio confirmado na interface da conta e pesquisa de alternativas — 2026-10-04

`FATO_DOCUMENTADO`, proveniência: relato direto do usuário após autenticação/QR na conta Google, nesta continuação. A página de Senhas de app exibiu **“A configuração que você está procurando não está disponível para sua conta.”** Posteriormente, o usuário informou que a verificação em duas etapas está **Ativada**. O agente não acessou a página autenticada e não atribui à conta Proteção Avançada, política de organização ou uso exclusivo de chaves sem evidência adicional. O requisito de 2FA informado está atendido; sua ausência não explica o bloqueio atual.

`EVIDENCIA_IMPLEMENTACAO`: formulário privado encerrado; confirmação de processo ausente em 19:56:20 UTC. Status sanitizado do formulário: correspondência de conta declarada localmente confirmada, nova senha não gravada. Os diagnósticos 535 registrados anteriormente ocorreram antes do pedido de interrupção; não houve nova tentativa SMTP, envio ou coleta de senha após esse pedido. Setup privado e as três chaves internas foram preservados, sem mudança de arquitetura, schema, migration ou testes.

`FATO_DOCUMENTADO`: a [documentação oficial Google](https://support.google.com/accounts/answer/185833?hl=pt-BR) apresenta outras condições de indisponibilidade apesar de 2FA ativada. A causa específica permanece indeterminada. Consulta somente de leitura sobre o status de Proteção Avançada solicitada ao usuário, uma ação por vez; não foi recomendado desativá-la. QR não foi usado como prova de causa ou de configuração.

Pesquisa e comparação de segurança, complexidade, operação, testes e deploy foram incorporadas ao [research.md](research.md#gmail-recurso-indisponível-e-alternativas--2026-10-04), com fontes oficiais, distinção entre fatos, inferências e recomendações. `RECOMENDACAO`: se for necessária evolução mantendo Gmail, preferir OAuth/API com escopo somente envio; SMTP OAuth2 é tecnicamente possível, mas exige escopo amplo. Provedor SMTP transacional preserva o worker, porém muda o fornecedor e o critério do smoke. Nenhuma dessas propostas foi implementada ou considerada aprovada. A escolha e eventual evolução do contrato permanecem `PENDENCIA_DE_DECISAO`, conforme o pedido explícito de parar antes da mudança arquitetural.

**Estado vigente: BLOQUEIO_DE_SETUP / GOOGLE_APP_PASSWORDS_UNAVAILABLE; smoke completo NAO_EXECUTADO; inbox NOT_OBSERVED; commits 0.** Testes locais PASS permanecem no snapshot `c09e78f8…`; snapshot focal `aedd43d9…`, sem atribuição indevida de PASS históricos. T014/T017/T025 abertas. Sem nova matrix extensa enquanto esta rodada se limita à pesquisa e à restrição da conta. Nenhum push, PR, merge, deploy ou configuração remota.

Verificação focal: 418/418 arquivos do manifesto técnico da retomada mantiveram os hashes; nenhuma alteração funcional nesta pesquisa. Auditoria de privacidade em 19:59:45.686–19:59:47.449 UTC **PASS**: mesmos 663 versionados, 35 novos do recorte, 72 arquivos cliente, histórico padrão, 3.492 objetos Git e agora 103 artefatos privados. Nenhuma correspondência dos valores atuais/endereço nos escopos lidos; `.env` ignorado/não tracked/não staged, ACL protegida, chaves independentes e configuração estável durante a auditoria. Histórico de testes e as duas continuações anteriores preservados no JSON; nenhum diagnóstico SMTP novo nessa validação documental.

### Resposta posterior: Proteção Avançada ativada

`FATO_DOCUMENTADO`, origem: resposta do usuário “ta ativado” à consulta sobre Programa Proteção Avançada. A [ajuda oficial Google, consultada novamente em 2026-10-04](https://support.google.com/accounts/answer/7539956?hl=pt-BR), informa que o programa bloqueia apps autenticados por Senhas de app e revoga as senhas existentes ao aderir. `INFERENCIA`: a configuração informada explica uma restrição suficiente para a indisponibilidade observada, sem provar a causa exclusiva do 535 histórico. Não é necessário repetir a tentativa recusada para demonstrar essa incompatibilidade.

`RECOMENDACAO`: preservar a proteção da conta atual. Para concluir o contrato Gmail/senha de aplicativo sem alterar a arquitetura, usar outra caixa Gmail exclusivamente de teste e elegível, somente após autorização da caixa e coleta local privada; não há outra caixa selecionada/configurada nesta etapa. Se isso não for possível, a alternativa de autenticação/transporte precisa de decisão explícita. OAuth nesta conta também exige considerar a regra de acesso sensível somente por apps terceiros verificados; criar apenas um cliente OAuth local de testes não demonstra compatibilidade. A recomendação anterior de Gmail API para menor permissão permanece condicionada a essa elegibilidade/verificação, não é desbloqueio automático.

Nenhum formulário reaberto, `.env` alterado, credencial coletada, diagnóstico SMTP repetido ou mensagem enviada após esta resposta. R1/testes e setup preservados. Resultado continua BLOQUEIO_DE_SETUP, smoke NAO_EXECUTADO, commits 0.

Validação documental desta resposta: hashes dos 418 caminhos técnicos sem mudança; duas continuações anteriores preservadas; index vazio, HEAD original e git diff --check PASS. Auditoria de privacidade em 20:03:36.736–20:03:38.477 UTC PASS nos escopos informados pelo relatório, incluindo 105 artefatos privados e 3.486 objetos Git então alcançáveis. Nenhuma correspondência de valores atuais/endereço; `.env` ignorado/não tracked/não staged, ACL protegida e chaves independentes. O JSON focal foi atualizado com a nova proveniência e regra oficial. Corrigida também a codificação do texto público da mensagem Google no registro sanitizado, anteriormente degradada pelo pipe PowerShell; não houve alteração de credenciais. Nenhuma suíte funcional repetida por esta atualização exclusivamente documental.

### Tentativa única posterior, solicitada explicitamente pelo usuário

Após o registro acima, o usuário pediu “vamos tentar logar novamente por favor”. Essa nova instrução autorizou uma única verificação SMTP com a configuração existente, sem coleta/geração de senha, mensagem ou mudança de arquitetura. A suspensão anterior teve somente essa exceção; não foi criado loop de tentativas.

`EVIDENCIA_IMPLEMENTACAO`: inspeção de precedência novamente PASS, arquivo privado raiz atual usado pelo coletor/CLI, sem overrides antigos ou seletores alternativos; conta/allowlist coerentes e senha válida apenas estruturalmente. Comando real: `node --conditions=react-server --import=tsx .mail-validation/gmail-auth-diagnostic.mjs`. De 20:04:35.682 a 20:04:37.455 UTC (17:04:35–17:04:37 America/Sao_Paulo), exit 1, **FAIL AUTHENTICATION / EAUTH / 535 / AUTH / CREDENTIALS_REJECTED**, fingerprint `aedd43d949cdff51f749a99be541ccd8fece0286d7d03ae6fdf5fc40288ad6a8`. Adaptador real, somente verify; zero mensagens enviadas e nenhuma resposta SMTP crua registrada. Resultado acrescido ao histórico ignorado de diagnósticos e à terceira continuação do JSON, sem reescrever os FAIL anteriores ou os PASS históricos.

A restrição informada de Proteção Avançada permanece material; essa tentativa não desbloqueou o método atual. Smoke NAO_EXECUTADO, inbox NOT_OBSERVED, commits 0. Nenhuma outra caixa disponibilizada ou configurada; `.env`/chaves, runtime R1, migrations e testes preservados. Não repetir novas verificações automaticamente com a mesma configuração recusada.

Auditoria posterior à tentativa em 20:05:25.550–20:05:27.355 UTC: PASS, nenhuma correspondência dos valores atuais/endereço nos escopos lidos, incluindo 106 artefatos privados; controles de Git/ACL/chaves permaneceram aprovados. Atualização de evidências não autoriza commits nem substitui o smoke pendente.

## Retomada com Senhas de app disponível — coleta privada pendente

`FATO_DOCUMENTADO`, proveniência: pedido posterior do usuário informa verificação em duas etapas ativada e opção Senhas de app agora disponível na conta selecionada. Autorização explícita para reabrir formulário, gerar/configurar nova senha e diagnosticar, sem reutilizar a senha recusada. O agente não observou a interface autenticada nem inferiu qual mudança tornou a conta elegível; os relatos sobre restrição anterior e todos os FAIL permanecem no histórico.

`EVIDENCIA_IMPLEMENTACAO`: janela privada reaberta em 20:13:15 UTC, modo RequireFreshPassword. Sintaxe PowerShell verificada, sem erros; processo visível confirmado. E-mail e senha continuam mascarados. Somente entrada do e-mail não altera `.env`: os quatro papéis da caixa, confirmação literal exigida e nova senha serão gravados atomicamente após a segunda etapa. A senha anterior permanece apenas como comparação em memória no processo e é recusada como nova entrada; configuração de proteção/JWT é comparada antes/depois sem persistir valores ou digests. Não houve regeneração de chaves, mudança de infraestrutura ou novo diagnóstico usando a credencial antiga nesta retomada. Coleta completa e aceitação SMTP ainda pendentes; smoke/commits não liberados.

Primeira tentativa do formulário: saveFailed, configured false, nova senha não gravada segundo status e configuração protegida preservada. A causa não foi capturada pelo primeiro tratamento genérico; não foi atribuída ao usuário ou ao Google. Acrescentados somente tipo da exceção e número de linha ao diagnóstico sanitizado, sem mensagem/stack/valores. Controle real de gravação da confirmação existente: PASS, bytes e ACL idênticos. Fluxo de eventos com e-mail/senha sintéticos e gravador substituído: PASS, sem escrita privada real; esse teste não prova toda gravação real conjunta. Janela reaberta com o mesmo bloqueio de reutilização, aguardando entrada privada. Nenhum diagnóstico SMTP usando a senha antiga nesta etapa. Quarta continuação no JSON preserva os três registros anteriores e documenta a coleta pendente; runtime/snapshot técnico continuam iguais.

## Fechamento vigente — nova credencial, smoke Gmail e aceite integral

Data: 2026-10-04. Classificação: EVIDENCIA_IMPLEMENTACAO, exceto recebimento e relatos de conta, que são FATO_DOCUMENTADO com origem explícita no usuário. Branch feat/mail-foundation, base 3102b07a0a3f0f15e10d6d0646036a6ba7c8beb3. Fingerprint funcional: `aedd43d949cdff51f749a99be541ccd8fece0286d7d03ae6fdf5fc40288ad6a8`. Os 418 caminhos do manifesto focal continuam byte a byte iguais; nenhuma reimplementação de infraestrutura ou alteração de R1 nesta retomada. Configuração privada não integra o fingerprint nem o Git.

A segunda coleta local terminou com configured/freshPasswordAccepted/protectedConfigurationPreserved true. Mailbox, quatro papéis de envio/allowlist, confirmação exigida e senha nova foram gravados conjuntamente pelo mecanismo dotenv já suportado. Senha anterior recusada como nova entrada; chaves independentes preservadas, não regeneradas. Arquivo privado ignorado, não rastreado/não staged, ACL protegida. Inspeção do processo, registro Windows e subprocessos PASS: arquivo atual efetivamente usado, nenhum override antigo ou seletor alternativo. Correspondência operacional dos quatro papéis validada localmente; não alegar observação independente da página autenticada Google. O motivo da nova disponibilidade de Senhas de app não foi determinado.

### Matriz final reexecutada no mesmo snapshot

Horários UTC, com milissegundos. Todos os gates abaixo têm exit 0. Invocações completas, ambiente, contagens, logs locais redigidos e histórico estão na quarta continuação de [validation-results.json](validation-results.json). Gates comuns: `./scripts/mail-validation.ps1 -Gate <nome>`; SchemaAudit, SmtpVerify e Smoke usam o harness PostgreSQL isolado e mail-gate-runner, com comandos completos no JSON. Logs ficam ignorados em .mail-validation.

| Gate | Início–fim UTC | Exit | Resultado |
|---|---|---:|---|
| SmtpVerify | 20:18:17.545–20:18:19.704 | 0 | PASS; diagnóstico autenticado, sem envio |
| RegressionSetup | 20:18:42.306–20:18:44.749 | 0 | PASS; concluído |
| Unit | 20:18:42.161–20:19:04.547 | 0 | PASS; 255 + 12 |
| R1 | 20:19:07.979–20:19:18.266 | 0 | PASS; 17; PostgreSQL e SMTP/TLS |
| Lint | 20:32:46.407–20:32:53.719 | 0 | PASS; zero erros, quatro warnings preexistentes |
| Typecheck | 20:19:43.312–20:20:01.045 | 0 | PASS; concluído |
| CleanInstall | 20:18:42.220–20:20:25.322 | 0 | PASS; npm ci + Prisma generate + 12 mail/TLS + typecheck |
| Integration | 20:19:43.472–20:20:28.789 | 0 | PASS; 132, incluindo 25 de outbox |
| Migration | 20:20:44.728–20:20:55.176 | 0 | PASS; 27 |
| Contract | 20:21:47.892–20:21:54.864 | 0 | PASS; 2 |
| Build | 20:22:13.900–20:23:23.425 | 0 | PASS; concluído |
| E2E | 20:23:16.840–20:25:20.688 | 0 | PASS; 55 |
| Https | 20:25:53.093–20:26:20.838 | 0 | PASS; 2; teardown PASS, zero fixtures |
| SchemaAudit | 20:26:33.640–20:26:34.278 | 0 | PASS; zero schemas de teste remanescentes |
| Smoke | 20:26:37.171–20:26:42.294 | 0 | PASS; uma aceitação SMTP; inbox confirmada separadamente |

R1 mantém 17 testes permanentes: resposta/retomada atrasada além da lease, worker B recuperando e concluindo SENT antes da retomada de A, margem pré-envio, relógio monotônico/UTC, deadlines distintos de lease/prova, recuperação/fencing final, cancelamento/invalidação e socket encerrado. Os FAIL locais antes da correção e todos os FAIL históricos permanecem preservados. Lint desta retomada inicialmente falhou por variável chamada module em um atualizador privado; renomeada para diagnosticsModule, reexecutada e aprovada, sem alteração funcional. A primeira falha de gravação do formulário também permanece registrada com causa não determinada; teste sintético com gravador substituído não é apresentado como prova de gravação real.

### SMTP e observação humana

SmtpVerify PASS, sem envio. Smoke real PASS: enqueue transacional → commit SQL → worker real → Gmail, fixture sintética em schema próprio, allowlist da caixa explicitamente fornecida no formulário. Uma mensagem aceita pelo SMTP, fixture/schema removidos pelo harness. O script reporta inboxReceipt NOT_OBSERVED, corretamente: não observa a caixa. Em resposta posterior à pergunta exata “a mensagem chegou?”, o usuário respondeu “Sim”; origem USER_EXPLICIT_REPLY_TO_INBOX_RECEIPT_QUESTION, registrada separadamente em inboxEvidence. Isso fecha o critério humano de recebimento, sem endereço, prova ou screenshot. Nenhum segundo envio foi necessário.

### Revisões finais e preservação

Privacidade PASS para valores literais atuais/endereço, configuração, ACL, independência, versionados, novos do recorte, artefatos privados/logs, bundle cliente, histórico PSReadLine padrão disponível e objetos Git alcançáveis por refs/reflog. Nenhum valor registrado. Limites: arquivo privado legítimo em repouso excluído da busca, arquivos compactados inspecionados por bytes; mail.zip comparado separadamente por módulo; resultado restrito aos arquivos lidos e ao instante registrado. Rechecagem antes de cada commit e após entrega. Bundle sem módulos/segredos de e-mail expostos.

Segurança de dependências reavaliada em 20:22:24.077–20:22:27.529 UTC: npm audit --omit=dev --json PASS, zero achados de produção. npm audit --json exit 1 registra dez achados high preexistentes de desenvolvimento; os 18 registros afetados do lock são idênticos à base e todos dev-only. Nenhum achado impeditivo novo, nenhum audit fix amplo. Quatro warnings preexistentes de lint preservados.

Revisão final de escopo: anexos preservados, 418 hashes iguais, referências relativas sem alvos ausentes e git diff --check PASS. A primeira revisão marcou FAIL ao detectar alteração adicional em AGENTS.md. Inspeção do diff e do gerador instalado node_modules/next/dist/server/lib/generate-agent-files.js confirmou o bloco gerenciado de instruções que next dev acrescenta; conteúdo lido, preservado e excluído dos commits de e-mail conforme o escopo autorizado. Revisão reexecutada com essa classificação explícita PASS; FAIL anterior conservado em histórico local. Sem exclusão silenciosa de alteração funcional.

Os três imp006-final-stat.txt, imp006-final-status.txt e imp006-final.diff, ausentes na observação histórica de 18:56 UTC, estão presentes desde a inspeção de 19:37 UTC e mantêm os hashes iniciais. Causa da ausência/reaparecimento indeterminada; o agente não os recriou. src/app/api/server/mail.zip difere do manifesto anterior, mas coincide com os nove módulos do snapshot focal; preservado fora do index e não usado como fonte de implementação. Prompt, revisão independente e demais anexos preexistentes preservados fora dos commits.

### Contrato entregue e limites

Uma migration aditiva: `20261004000100_mail_foundation`; nenhuma migration adicional na retomada R1/autenticação. Outbox cifrada, enqueue/cancel/limiter transacionais, claim SKIP LOCKED, fencing fresco pré-SMTP e final, timeout absoluto/socket fechado, retries limitados, expiração/limpeza, transporte/templates server-only, endpoint máquina, CLIs e runbook prontos. Nenhuma transação/lock durante SMTP; possibilidade de repetição após aceitação com resposta perdida continua documentada, sem exactly-once.

Sem bloqueio atual de ambiente/configuração para o aceite local. Execução 2 ainda precisa definir política pendente de contas/normalização/colisões e implementar produtores, geração/consumo de challenges, cadastro/verificação e recuperação/reset com os contratos autorizados. Remetente/origem oficiais, operador/cadência do worker, configuração de produção, migrations de produção, CI remoto e deploy permanecem fora desta entrega; smoke manual não prova agendamento. Nenhum push, PR, merge, tag, deploy ou contratação realizado.

### Commits locais e conferência de entrega

Gate integral PASS antes do primeiro staging/commit. Revisão do diff completo e do index, git diff --cached --check, auditoria de segredos e correspondência blob/workspace aprovadas antes de cada commit. Identidade Git existente usada; sem invenção de issue, assinatura/trailer, sem --no-verify e sem reescrita de histórico.

- `a56cc9ea1cd23ee339d3a6c5b0154a07dd1ff917` — `feat(mail): add encrypted outbox and lease-fenced Gmail worker`: 42 arquivos; implementação, migration, R1, contratos/Spec Kit, testes e ajustes mínimos de harness juntos, evitando intermediário funcional incompleto.
- `docs(mail): record R1 validation and Gmail smoke acceptance`: consolidação do runbook, evidência, JSON histórico e T017 neste commit. Seu hash deve ser consultado com `git log -1 --format=%H --grep='^docs(mail): record R1 validation and Gmail smoke acceptance$'`; não se grava o próprio hash dentro do conteúdo para evitar autorreferência/amend em ciclo. Os dois hashes reais constam também da resposta de entrega e do ledger local ignorado.

Conferência posterior: fonte funcional do workspace mantém o fingerprint aedd43d9 e todos os 418 hashes do manifesto; blobs versionados correspondem aos arquivos testados, considerando apenas a normalização de linhas realizada pelo Git. O arquivo mail.zip, incluído no fingerprint vigente pelo coletor existente, é um anexo preexistente fora do Git e não uma dependência de build/runtime; sua exclusão do commit não altera os módulos executados. AGENTS.md permanece alterado pelo bloco gerenciado de next dev, preservado fora do index, assim como os prompts, ZIPs, imp006-final-* e relatórios preexistentes. Nenhum arquivo privado foi staged. Nenhuma modificação funcional por hooks/staging e nenhuma operação remota.
