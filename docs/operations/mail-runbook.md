# Operação de e-mail transacional

Estado: infraestrutura local da Execução 1; consulte [evidência](../../specs/mail-foundation/implementation-evidence.md). Nenhum produtor de cadastro/reset, política de acesso, cron remoto ou deploy ativado. SMTP aceito não comprova caixa de entrada e retries podem duplicar mensagens se a resposta se perder.

`EVIDENCIA_IMPLEMENTACAO` vigente em 2026-10-04: snapshot `aedd43d949cdff51f749a99be541ccd8fece0286d7d03ae6fdf5fc40288ad6a8`, **aceite integral PASS**: 15 gates reexecutados, incluindo R1 17, Unit 255+12, Integration 132, Migration 27, Contract 2, E2E 55, HTTPS 2, instalação limpa e zero schemas de teste remanescentes. Nova senha configurada por formulário privado, sem reutilizar a recusada; diagnóstico SMTP PASS. Smoke completo em 20:26:37.171–20:26:42.294 UTC, uma aceitação SMTP; usuário confirmou separadamente a chegada. Revisões de privacidade, precedência, segurança, bundle e escopo PASS. Rejeições e bloqueios descritos nas narrativas seguintes são históricos e permanecem em [validation-results.json](../../specs/mail-foundation/validation-results.json).

## Instalação e banco

Node 24.19.x, npm, PostgreSQL. Execute `npm ci` e `npx prisma generate`. A migration nova é `prisma/migrations/20261004000100_mail_foundation/migration.sql`; confira `_prisma_migrations`, backup e baseline antes de aplicação futura autorizada. Não rode reset/db push sobre banco existente. O repositório já contém [procedimento formal de bootstrap](../../prisma/bootstrap/initial-database-bootstrap.md) e baseline legado versionado para banco novo com pré-condição vazia comprovada; `migrate deploy` direto em banco vazio falha. A contagem histórica de oito migrations desse procedimento antecede a migration de e-mail. Os testes desta frente usam baseline sintética e migrations incrementais; esta reconciliação não alega novo teste de bootstrap nem instalação de banco vazio validada no snapshot atual.

Os testes SMTP/TLS exigem Git e OpenSSL: no Windows usam o OpenSSL incluído no Git for Windows, localizado a partir de `git --exec-path`; em outros sistemas, `openssl` no PATH. Eles geram certificado/chave sintéticos temporários, iniciam servidor SMTP loopback e removem seus próprios arquivos no teardown. A CA de teste não entra na configuração de produção.

Para testes Windows, o harness existente usa cluster dedicado em `%LOCALAPPDATA%/HidroFlorestas/imp006-postgresql`, marcador de propriedade e porta loopback 55426. Binários ausentes exigem instalação de `embedded-postgres@17.10.0-beta.17` **nesse diretório dedicado**, nunca em diretório de dados real. Não execute Dispose/reset para obter verde. O harness cria schemas próprios por cenário e remove somente os schemas/fixtures da execução com marcador confirmado.

O startup aguarda somente `pg_ctl`, com limite de 30 s, sem esperar o daemon persistente. Se esse prazo vencer, consulte `./scripts/imp006-local-postgresql.ps1 -Action Status` antes da retomada: a inicialização pode terminar depois do timeout. Preserve o diretório e os marcadores.

```powershell
npm ci
npx prisma generate
./scripts/mail-validation.ps1 -Gate Unit
./scripts/mail-validation.ps1 -Gate RegressionSetup
./scripts/mail-validation.ps1 -Gate R1
./scripts/mail-validation.ps1 -Gate Integration
./scripts/mail-validation.ps1 -Gate Contract
./scripts/mail-validation.ps1 -Gate Migration
./scripts/mail-validation.ps1 -Gate E2E
./scripts/mail-validation.ps1 -Gate Https
./scripts/mail-validation.ps1 -Gate Typecheck
./scripts/mail-validation.ps1 -Gate Lint
./scripts/mail-validation.ps1 -Gate Build
./scripts/mail-validation.ps1 -Gate CleanInstall
```

As evidências redigidas do coletor ficam ignoradas em `.mail-validation`, separadas de `test-results` (que Playwright limpa ao iniciar). Compartilhe somente evidências redigidas. Nenhum SMTP real integra esses testes.

## Conta Google e variáveis privadas

Habilite verificação em duas etapas na conta Google de teste/operação. Gere senha de app pelo painel Google, injete-a pelo armazenamento privado do ambiente e nunca pelo chat. Contas organizacionais, Advanced Protection e uso exclusivo de chave física podem impedir senha de app. Trocar senha Google revoga senhas de aplicativo. Remetente/operador oficial continuam PD-CRI-003/004.

Consulte [.env.mail.example](../../.env.mail.example): contém somente nomes/valores sintéticos, com secrets vazios. Configuração é lazy; configuração incompleta impede worker/envio, mas não inicializa SMTP no build/import de páginas. Não use NEXT_PUBLIC, logs SMTP, DTOs ou query string para secrets.

As CLIs carregam dotenv: `.env` por padrão ou o arquivo selecionado por `DOTENV_CONFIG_PATH`. O `.env.e2e.local` preexistente não é carregado automaticamente por essas CLIs e foi preservado. O coletor carrega o mesmo arquivo privado antes de copiar o ambiente/redigir a saída dos processos filhos, com `quiet: true` e `override: false`; as variáveis já fornecidas pelo harness de banco mantêm precedência. A redação cobre o JSON do keyring, suas chaves individuais e a senha bruta/normalizada. Segredos não entram em argumentos de comandos, chat, logs ou histórico.

Nesta execução, o pedido autorizou preparar um `.env` privado já suportado, ignorado, não rastreado/não staged, com ACL protegida para usuário atual e SYSTEM. As três chaves foram geradas por CSPRNG e verificadas como independentes, sem reutilização dos valores JWT/senhas disponíveis para comparação. Conta/senha e caixa autorizada foram fornecidas por interface local mascarada; uma segunda gravação somente de senha preservou conta e chaves. Esses controles e o formato aceito pelo runtime foram verificados sem registrar valores ou endereços. A origem HTTPS local é para conteúdo sintético do smoke, não aprovação de origem de produção.

| Nome | Regra |
|---|---|
| SMTP_HOST | smtp.gmail.com; nenhum preset service sobrescreve opções |
| SMTP_PORT/SMTP_SECURE/SMTP_REQUIRE_TLS | 465/true/true ou 587/false/true; nunca ignorar TLS/certificado |
| SMTP_USER/SMTP_APP_PASSWORD | mailbox simples e senha de app privada |
| MAIL_FROM | mailbox aprovada igual SMTP_USER; nomes/aliases ficam para contrato futuro |
| APP_PUBLIC_URL | origem HTTPS sem userinfo/path/query/fragment; escolhida por ambiente, nunca request Host/Origin |
| MAIL_PAYLOAD_ENCRYPTION_KEYS | JSON key-id → chave aleatória de 32 bytes em base64 |
| MAIL_PAYLOAD_ACTIVE_KEY_ID | id presente no keyring |
| MAIL_IDEMPOTENCY_KEY | chave aleatória independente de 32 bytes/base64; estabilidade durante retenção |
| MAIL_WORKER_SECRET | segredo aleatório base64url 32–128 caracteres para endpoint máquina |

A senha aceita estruturalmente pelo runtime tem somente caracteres ASCII alfanuméricos/espaços, 16–32 caracteres brutos e exatamente 16 caracteres ASCII alfanuméricos após remover espaços. Essa validação não substitui o diagnóstico autenticado no provedor.

Gere chaves com CSPRNG no gerenciador privado/secret store; não use o mesmo valor para JWT, cifra, HMAC ou acionamento. Não há fallback fixo nem fake em runtime.

## Execução, diagnóstico e agendamento

Com ambiente privado preparado, `npm run mail:verify` apenas testa conexão/auth. `npm run mail:worker` aguarda um lote de até 4, concorrência 2 e se encerra; requisições máquina GET/POST em `/api/internal/mail/process` exigem Authorization Bearer com MAIL_WORKER_SECRET. Query e body são recusados; não há destinatário escolhido pela requisição. HTTP 401 não processa; 503 indica configuração ou indisponibilidade; resposta Cache-Control no-store contém somente contadores. Clientes operacionais devem injetar o header secret pelo secret store, sem imprimir a requisição.

Diagnósticos reais desta execução: `npm run mail:verify` retornou exit 1/FAIL, classe AUTHENTICATION, em 18:38:41.250–18:38:44.184 UTC e novamente em 18:50:09.226–18:50:12.568 UTC após a troca privada da senha. Ambos tiveram zero envios. A causa específica na conta Google não foi comprovada pelo diagnóstico redigido. Corrigir o acesso à senha de aplicativo/autenticação no painel da conta autorizada e fornecê-la pela interface local mascarada; repetir diagnóstico antes do smoke. Não alterar TLS, trocar para OAuth ou reutilizar chaves como solução presumida. A autorização da caixa de teste não decide remetente/operador de produção.

`EVIDENCIA_IMPLEMENTACAO`: claim usa SKIP LOCKED, token e lease de 90 s. Antes de enviar, um UPDATE condicional usa relógio fresco do banco, exige PROCESSING/token atual, prova/challenge vigente e pelo menos 15 s de orçamento SMTP + 2 s de margem na lease. O SELECT anterior é apenas recusa antecipada. O UPDATE devolve lease, validade efetiva e `fencedAt` do banco. Depois do await e da renderização com essa validade, o worker lê UTC local e tempo monotônico; desconta conservadoramente toda consulta/espera/retomada/renderização da janela devolvida pelo banco e combina o mínimo com a janela UTC local. Recusa tempo monotônico inválido, prova esgotada ou leaseBudget menor que 17 s, sem outro await antes do transporte. Não renova lease nem prolonga prova. A recusa mantém o item recuperável depois do vencimento da lease, enquanto validade e tentativas permitirem; a manutenção aplica expiração/cancelamento/esgotamento quando cabível.

`MailTransport.send` recebe `expiresAt` e `deadlineAt` separados. `expiresAt` permanece a validade absoluta efetiva mínima de outbox/challenge e também alimenta o template. Os orçamentos conservadores são `leaseBudget = min(leaseUntil − agora, leaseUntil − fencedAt − elapsed)` e `proofBudget = min(expiresAt − agora, expiresAt − fencedAt − elapsed)`, com elapsed de `performance.now()`. O prazo operacional é `deadlineAt = agora + min(15 s, leaseBudget − 2 s, proofBudget)`, sem estender prova ou lease. O adaptador encerra o socket em `min(início do adaptador + 15 s, expiresAt, deadlineAt)`. O endpoint tem maxDuration 60 s. Não há transação/lock de banco durante SMTP; a atualização final exige posse, lease e validade vigentes. Todos os consumidores são aguardados mesmo se uma escrita falhar, antes da resposta.

`RECOMENDACAO`: manter relógios do banco e da aplicação sincronizados em UTC na operação. O orçamento pré-envio combina relógio do banco, decurso monotônico e UTC local; um relógio local atrasado não aumenta a janela calculada do banco, sem depender de igualdade absoluta entre relógios. A margem técnica de 2 s reserva tempo para fechamento/persistência, sem garantir execução durante pausa ilimitada do processo/event loop. São escolhas locais do recorte, não aprovação de política de contas pela equipe. Cancelamento após a autorização final pode ocorrer antes ou durante SMTP e não consegue impedir ou desfazer todo efeito externo nessa janela. Resposta perdida após aceitação admite repetição no retry (`at-least-once`, limitado por validade/tentativas), sem garantia de exatamente uma vez, entrega ou inbox.

Vercel é direção relatada; plano efetivo/operador `NAO_ESPECIFICADO`. Hobby oferece cron diário, insuficiente para validade curta. **Não há vercel.json/cron ativado nesta entrega.** Operador/equipe precisam aprovar mecanismo frequente (cadência menor que validade, com margem para retry), verificar limite do plano e monitorar atraso antes de ativar produtores. Não contratar/deployar para resolver pendência. Uma execução manual não prova agendamento.

## Smoke real separado

É necessário cadastro explícito de uma caixa de teste autorizada e configuração SMTP/chaves. Injete privadamente MAIL_SMOKE_RECIPIENT e MAIL_SMOKE_ALLOWED_RECIPIENT com a mesma mailbox autorizada, MAIL_SMOKE_CONFIRMATION com `HIDROFLORESTAS_GMAIL_TEST`, e variáveis do banco **de teste isolado**. O script faz preflight e usa schema sintético próprio; nunca envia para contas reais da aplicação.

```powershell
./scripts/imp006-local-postgresql.ps1 -Action Run -Executable node -CommandArguments @('--conditions=react-server','--import=tsx','scripts/mail-smoke.ts')
```

O smoke usa enqueue → commit → worker → Gmail e conteúdo sintético. Uma aceitação imprime somente `smtpAccepted:1`, sem endereço/prova. Caixa de entrada deve ser observada pelo operador e registrada separadamente, sem screenshot com PII/secrets. O script não observa inbox automaticamente. Sem credencial/caixa autorizada é BLOQUEIO_DE_SETUP, não PASS; isto proíbe commits segundo o prompt da rodada. Não incluir smoke no CI comum.

No snapshot c09e78 a credencial e a autorização estão presentes e válidas estruturalmente, mas o diagnóstico AUTHENTICATION impede prosseguir para o smoke real: seu estado vigente é NAO_EXECUTADO. T014 e T017 permanecem abertos; gates locais PASS não autorizam commits sem esse aceite obrigatório. Depois de autenticação corrigida, executar o smoke autorizado e atualizar a evidência e a auditoria de privacidade, distinguindo aceitação SMTP de recebimento observado.

A auditoria privada pós-troca, em 19:01:29.239–19:01:31.586 UTC, passou para presença/formato, ACL, independência e busca dos valores atuais/PII em todos os objetos Git alcançáveis por refs/reflog, arquivos versionados/escopo da tarefa, logs capturados, bundle cliente, histórico PSReadLine disponível do usuário e artefatos da interface. Não encontrou ocorrências. O relatório ignorado `.mail-validation/private-setup-audit-final.json` preserva a correção de uma regra anterior do auditor e o artefato intermediário FAIL. A busca exclui o `.env` legítimo em repouso, usa valores literais/PII sem expansão de arquivos compactados e cobre somente o estado lido. Nova credencial ou novas escritas em logs exigem rechecagem; não é prova de ausência de vazamento futuro.

## Monitoramento e falhas

Observe `mail-batch`: pending, queueAgeMs, claimed, accepted, retried, dead, expired, cancelled, recoveredLeases, stale, purged. `mail-result` inclui somente id UUID, template, tentativa, estado/classe. Nenhum endereço, prova, payload, ciphertext ou resposta SMTP crua. accepted indica aceitação SMTP, nunca entrega garantida. Alertas: fila envelhece em relação à validade do produtor, aumento de DEAD/TLS/AUTHENTICATION e leases recuperados.

`stale` também inclui recusa antes do SMTP por posse antiga, resposta atrasada ou janela de lease insuficiente. Investigue latência do banco, interrupções do processo, sincronização dos relógios e atraso da fila; aguarde recuperação normal em vez de renovar claims ou alongar provas manualmente.

Retries para CONNECTION/TIMEOUT/TEMPORARY: 30 s exponencial, teto 10 min, jitter até 25%, no máximo 5 claims, sempre dentro de expiresAt. AUTHENTICATION/TLS/CONFIGURATION/PERMANENT/PAYLOAD/UNKNOWN são terminais; corrigir configuração antes de solicitar novo envio. Sem regeneração/alongamento de prova como efeito de transporte. 454 é transitório, 535 autenticação permanente, 4xx temporário, 5xx permanente. Quotas Google variam; conferir conta e [documentação](https://support.google.com/mail/answer/22839), sem garantia fixa.

Não reabrir DEAD manualmente: payload terminal já foi apagado. A Execução 2 deverá produzir novo desafio/prova e nova intenção transacional após política de reenvio aprovada. Mesma chave idempotente recupera original e conteúdo divergente conflita. Idempotência limitada à retenção técnica de metadados, não garantia de efeitos SMTP exatamente uma vez.

## Rotação, limpeza e recovery

1. Distribuir keyring com chave nova e antiga a todas as instâncias.
2. Alterar activeKeyId para nova chave; versões anteriores continuam decifráveis.
3. Drenar/expirar mensagens de keyId anterior; verificar contagem **sem exportar ciphertext**. Somente então remover chave antiga. Caso uma chave seja comprometida, cancelar intenções afetadas e reemitir desafios sob política futura; não tentar decifrar com fallback.
4. Manter MAIL_IDEMPOTENCY_KEY estável enquanto há metadados da chave: alterá-la cedo causa conflito de conteúdo para a mesma idempotencyKey. Rotação dessa chave exige janela de drenagem/retirada e contrato futuro versionado; não é a rotação de cifra.
5. Rotacionar senha de app e segredo worker no armazenamento privado, distribuir/reiniciar consumidores e revogar antigo. Repetir diagnóstico e smoke autorizado.

Payload/recipient são apagados atomicamente ao SENT/DEAD/EXPIRED/CANCELLED. Maintenance por invocação termina até 100 ativos vencidos/invalidados, remove até 100 metadados terminais mais antigos que 7 dias e 100 buckets vencidos. Repetir invocação drena backlog sem limpeza abrangente. Esse TTL é escolha técnica local, não validade da prova; expiry vem do produtor. Challenges são preparatórios, sem purge/consumo/geração de prova ativados. Futuro produtor deve cancelar outbox no mesmo commit da invalidação; a janela após a autorização final de envio continua sujeita a efeito SMTP externo que o cancelamento não consegue desfazer.

Rollback de aplicação: parar acionamento e voltar versão de código compatível, preservando tabelas/linhas; migration aditiva não altera acesso legado. Não remover colunas/tabelas nem truncar fila para recuperar. Leases vencidos são recuperados e resultados antigos são recusados. Restaurar dados de backup requer reconciliação de efeitos SMTP já aceitos; restaurar SQL não permite “desenviar” e-mails.

Referências verificadas nesta rodada: [SMTP Nodemailer](https://nodemailer.com/smtp), [senha app Google](https://support.google.com/accounts/answer/185833), [cron Vercel](https://vercel.com/docs/cron-jobs/usage-and-pricing).

## Conta sem Senhas de app — bloqueio histórico de 2026-10-04

`FATO_DOCUMENTADO`, origem: relato do usuário sobre a interface autenticada Google. A conta de teste informa que Senhas de app não estão disponíveis; verificação em duas etapas informada como ativada. **Não repetir criação/coleta de senha nem diagnóstico SMTP com a credencial recusada enquanto o recurso estiver indisponível.** Formulário privado encerrado, setup preservado, nenhuma nova mensagem enviada. Status vigente BLOQUEIO_DE_SETUP; smoke NAO_EXECUTADO e T014/T017 pendentes. Os PASS locais anteriores continuam históricos, sem aceite integral.

`RECOMENDACAO`: consultar a restrição da própria conta somente de leitura, uma ação por vez. A [ajuda Google](https://support.google.com/accounts/answer/185833?hl=pt-BR) lista 2FA somente com chaves, conta organizacional e Proteção Avançada como possibilidades; nenhuma foi confirmada para esta conta. Não remover proteções para liberar SMTP. Ausência de recurso na conta não se corrige trocando variáveis ou regenerando chaves internas.

A [comparação técnica](../../specs/mail-foundation/research.md#gmail-recurso-indisponível-e-alternativas--2026-10-04) cobre SMTP Gmail OAuth2, Gmail API com escopo somente envio e SMTP transacional. Nenhum deles está configurado ou aprovado neste contrato: config.ts continua validando Gmail/senha de aplicativo. Se houver mudança autorizada, atualizar contratos/setup/transporte/redaction/testes, repetir gates no snapshot final e executar o smoke conforme o critério explicitamente aprovado. Recebimento na caixa Gmail por outro fornecedor não comprova o smoke SMTP Gmail atual. Nenhuma operação de deploy ou conta remota foi realizada.

Resposta posterior do usuário: **Proteção Avançada ativada** (`FATO_DOCUMENTADO`, relato direto). A [regra Google](https://support.google.com/accounts/answer/7539956?hl=pt-BR) bloqueia Senhas de app e revoga as existentes ao aderir. Não repetir autenticação com a credencial recusada; não orientar desativação da proteção. Para retomar o contrato atual, outra caixa de teste Gmail elegível precisa ser autorizada, coletada privadamente e validada antes de diagnóstico/smoke. A conta atual permanece configurada, sem novo envio; nenhuma outra caixa foi escolhida. OAuth para esta conta exige atender a restrição do programa sobre apps terceiros verificados; não basta um botão de login ou cliente OAuth não verificado.

Retomada posterior autorizada: usuário informou Senhas de app disponível na conta selecionada e pediu nova coleta/configuração, sem reutilizar a senha recusada. Essa informação permite retomar o mesmo método, sem inferir alteração de política da conta anterior. O formulário local RequireFreshPassword coleta mailbox e senha mascaradas, recusa a senha anterior por comparação em memória e grava conjuntamente os quatro papéis da caixa, confirmação e senha somente ao completar as duas etapas. Diagnóstico fica condicionado a configured/freshPasswordAccepted/protectedConfigurationPreserved e precedência/privacidade verificadas; somente presença/formato/resultados entram nas evidências. Nova disponibilidade declarada ou gravação local não constitui aceitação SMTP: registrar o resultado real antes de smoke/gates/commits.

## Aceite local vigente — nova senha e smoke recebido

Em 2026-10-04, o usuário informou disponibilidade de Senhas de app e concluiu coleta privada de senha nova; bloqueio de reutilização da recusada e preservação das chaves verificados. SmtpVerify PASS no snapshot aedd43d9. Smoke completo PASS, uma aceitação SMTP, recebimento confirmado pelo usuário em resposta “Sim”, separado da saída NOT_OBSERVED do script. Todos os 15 gates reexecutados e revisões de privacidade, segurança, bundle e escopo PASS. Os registros anteriores de indisponibilidade/rejeição são históricos. Não houve mudança de autenticação/arquitetura de e-mail nem prova sobre qual ajuste tornou a conta elegível. Consulte a última seção da evidência e a quarta continuação do JSON para comandos/horários/limites. Produção/agendamento e fluxos da Execução 2 continuam pendentes.
