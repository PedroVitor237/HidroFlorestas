# Operação de contas e homologação

Estado deste registro: `VALIDADO_LOCALMENTE; GATE_A_PASS; HOMOLOGACAO_EM_CONFIGURACAO; GATE_B_PENDENTE`.
Não existe deployment funcional aprovado nesta etapa. O checkpoint
[aprovado](../../specs/012-account-verification-recovery/remote-checkpoint.md)
define destinos, políticas e limites; aprovação não prova provisionamento.

Candidato original `d341fe402323ddfda705b8546e9aa55886815502` preservado, com 15
gates PASS no snapshot original. Retomada em 2026-10-05: autorizações oficiais
Neon/Vercel confirmadas por API; conector antigo removido; Vercel projeto próprio
`prj_OHzoR4hZ4MOrg2HOBvbZmiADrwaz`, equipe `team_YqedIK09zOGFeZ8M84kra0oM`,
sem Git; Neon projeto próprio `lingering-dream-37087260`, 11 migrations sem falhas
e zero contas importadas. SMTP autenticado e 27 variáveis cifradas configuradas
exclusivamente no target production desse projeto. Origem estável reservada
`https://hidroflorestas-accounts-homologatio.vercel.app`; ainda não é uma aplicação
publicada. A única mudança funcional é o destino exato do scheduler, validada
por 17/17 testes focais; nenhum gate não afetado foi repetido. A correção dos
destinatários no formulário privado, deployment, scheduler e jornadas reais
continuam pendentes. Push segue pendente da integração histórica (leitura 403).
Consultar [evidências](../../specs/012-account-verification-recovery/implementation-evidence.md)
antes de retomar as etapas; nenhuma nova autorização de políticas é necessária.

## Isolamento e configuração

Branch: `feat/account-verification-recovery`. Base da fundação:
`80ff1cfbe7799fccdde5be923530e3a6edf62010`. Worktree de execução:
`C:/projetos/consolidados/HidroFlorestas-accounts`. Não executar os wrappers
`imp006-local-postgresql.ps1` ou `mail-validation.ps1` para esta fase: seus
defaults continuam destinados à infraestrutura anterior.

O runner desta fase usa cluster próprio `%LOCALAPPDATA%/HidroFlorestas/accounts-postgresql`,
loopback `127.0.0.1:55427`, dono `accounts_owner`, marcador de propriedade e
credencial CLIXML privada. Os bancos `accounts_development`,
`accounts_regression_test` e `accounts_regression_reference` têm funções
distintas. URLs são injetadas privadamente no subprocesso e o ambiente é
restaurado ao terminar. O cluster dos juniors, porta 55426, não deve ser alterado.

Instalação limpa usa `npm ci` pelo lockfile e `npx prisma generate`. Consulte
[.env.accounts.example](../../.env.accounts.example) para nomes e parâmetros;
não copiar `.env` de outro ambiente. JWT, cifra de outbox, HMAC idempotente,
prova versionada e chave de operações têm finalidades e chaves separadas.
Remetente Gmail autorizado pode ser reutilizado sem reutilizar banco/JWT.

`ACCOUNT_POLICY_ENABLED=1` ativa o perfil aprovado. `ACCOUNT_TRUSTED_INGRESS`
deve corresponder ao ingresso realmente confiável (`vercel` remoto, `local`
somente loopback); header HTTP `Origin` é proteção CSRF, não identidade de IP.
Allowlist de testadores é server-side e específica da homologação; não é convite
de produto nem restrição de domínio Gmail. Não publicar sem lista pronta.

## Banco e validação local

Provisionar somente destinos próprios, com o baseline versionado descrito em
[initial-database-bootstrap.md](../../prisma/bootstrap/initial-database-bootstrap.md):
pré-condição vazio, SQL baseline transacional, `migrate resolve` correspondente
à primeira migration já materializada, `migrate deploy`, `migrate status` e smoke.
Nunca aplicar `db push`, `migrate reset`, criar migration `init` alternativa ou
registrar uma migration como aplicada sem executar seu efeito formal.

O comando desta fase que prepara os bancos isolados é:

```powershell
./scripts/accounts-validation.ps1 -Gate RegressionSetup
./scripts/accounts-validation.ps1 -Gate Bootstrap
```

Registre a contagem real de migrations, incluindo a nova migration de contas,
sem copiar as contagens antigas. O ensaio de bootstrap remove somente o banco
descartável que ele próprio criou, após conferir ownership.

Executar os gates no worktree desta fase:

```powershell
./scripts/accounts-validation.ps1 -Gate Unit
./scripts/accounts-validation.ps1 -Gate R1
./scripts/accounts-validation.ps1 -Gate Integration
./scripts/accounts-validation.ps1 -Gate Migration
./scripts/accounts-validation.ps1 -Gate Contract
./scripts/accounts-validation.ps1 -Gate Typecheck
./scripts/accounts-validation.ps1 -Gate Lint
./scripts/accounts-validation.ps1 -Gate Build
./scripts/accounts-validation.ps1 -Gate E2E
./scripts/accounts-validation.ps1 -Gate Https
./scripts/accounts-validation.ps1 -Gate CleanInstall
./scripts/accounts-validation.ps1 -Gate SchemaAudit
```

Serialize gates que usam banco, portas ou `.next`; build e dev/E2E não podem
concorrer. Evidências privadas ficam em `.accounts-validation/`, sem provas nos
artefatos publicados. O transporte injetado dos testes é exclusivo de harness
guardado, sem SMTP/debug route. Seu resultado comprova GATE A, não GATE B.

Para desenvolvimento, após preparar a configuração privada e o banco próprio,
executar a aplicação no modo `Application`:

```powershell
./scripts/accounts-local-postgresql.ps1 -Action Run -DatabaseMode Application -Executable node -CommandArguments @('node_modules/next/dist/bin/next','dev','--hostname','127.0.0.1','--port','3001')
```

Em outro terminal, o comando abaixo processa **um lote** no mesmo banco próprio:

```powershell
./scripts/accounts-local-postgresql.ps1 -Action Run -DatabaseMode Application -Executable node -CommandArguments @('--conditions=react-server','--import=tsx','scripts/mail-worker.ts')
```

Esse lote é uma ferramenta do desenvolvedor; não comprova automação remota nem
é uma instrução para testadores. O perfil local privado usa HTTPS em
`APP_PUBLIC_URL` porque o contrato de links exige TLS. Os testes HTTP controlam
o destino de navegação pelo harness sintético; o gate HTTPS usa proxy TLS e
origem própria. Não entregar links localhost a testadores remotos.

O comando Next dev acima atende HTTP e, sozinho, não oferece TLS para um link
real de reset. A jornada SMTP local exige proxy TLS local compatível com a
origem HTTPS configurada; os gates usam harness próprio. A URL remota de
testadores só será entregue depois do deployment e GATE B.

Em arquivos dotenv privados, keyrings JSON devem estar entre aspas simples,
preservando as aspas duplas do JSON. `JSON.stringify` do valor inteiro produz
escapes que dotenv não desfaz. Validar a configuração sem imprimir seus valores.

## Homologação remota aprovada

Destinos autorizados: GitHub `PedroVitor237/HidroFlorestas`, somente branch nova;
Vercel projeto separado `hidroflorestas-accounts-homologation` na equipe
`hidrofloresta-8598` (`team_YqedIK09zOGFeZ8M84kra0oM`), conforme substituição
explicitamente autorizada pelo usuário em 2026-10-05; Neon organização
`HidroFloresta` (`org-autumn-meadow-54690835`), projeto vazio de mesmo nome e banco
`accounts_homologation`; cron-job.org a cada 60 segundos.

O target Vercel chamado `production` pertence somente ao projeto isolado de
homologação. Não usar essa semântica para operar a produção real do produto.
Antes de push, conferir automações/integradores; antes de cada escrita de banco,
conferir identidade e ausência de dados reais. Variáveis não podem ser herdadas
de todos os previews ou de branches não confiáveis. Configuração mínima fica
somente no ambiente autorizado; scheduler recebe URL e segredo do worker.

Publicar candidato somente depois de GATE A e da revisão de secrets/diff/commits.
Ainda sem merge, force, tags ou publicação da branch dos juniors. Registrar SHA,
deployment ID, URL estável, banco lógico, migrations, execução e limitações.

O bootstrap remoto versionado é `scripts/accounts-remote-bootstrap.ts`. Ele
exige endpoint **direto** do projeto Neon recém-criado, hostname igual ao
registro privado `ACCOUNTS_REMOTE_DATABASE_HOST`, banco `accounts_homologation`,
papel `accounts_owner`, TLS e confirmação
`ACCOUNTS_REMOTE_BOOTSTRAP_CONFIRMATION=NEW_AUTHORIZED_ACCOUNTS_HOMOLOGATION`.
Recusa URLs locais/teste, objetos desconhecidos e migrations com checksum
divergente. Materializa o baseline somente em banco vazio; não importa contas.
O procedimento remoto ainda depende de execução real e não herda o PASS do
bootstrap local.

Login de Vercel/Neon acontece pelos fluxos oficiais. A janela
`scripts/accounts-private-homologation-setup.ps1` grava somente caixas
autorizadas e a credencial administrativa do scheduler em diretório privado
com ACL/DPAPI. A aplicação recebe apenas seus próprios valores. `.vercelignore`
exclui dotenv, logs, saídas de testes e anexos de qualquer upload pelo CLI.

cron-job.org usa POST HTTPS `/api/internal/mail/process`, header Bearer privado,
body JSON `{}`, uma execução por minuto e timeout de **30 segundos**, sem
segredo em query string. O limite padrão gratuito de 30 s consta na
[FAQ oficial](https://cron-job.org/en/faq/); intervalo, método e campos da
requisição seguem a [API oficial](https://docs.cron-job.org/rest-api.html).
Provar duas invocações
automáticas distintas e recuperação de backlog sintético após interrupção
controlada; chamadas manuais não substituem essa evidência. Vercel Hobby não
tem cron nativo de minuto. Não colocar `setInterval` em função serverless ou
terminal do agente como automação remota.

`scripts/accounts-homologation-scheduler.ps1` cria somente um job inicialmente
desabilitado (`-Action CreateDisabled`), vinculado ao registro privado do
deployment e ao endpoint estável desse projeto. O registro deve identificar
projeto/equipe aprovados e `worker-credential.clixml` conter somente a chave do
worker. Antes de ativar, conferir app/allowlist/configuração/banco e acesso HTTPS.
Usar `-Action Enable`, `Status`, `History` e `Pause` para o job próprio. O script
exige destino HTTPS exato na porta 443 e confere identidade, método, timeout,
cadência, headers/body, notificações e armazenamento de respostas antes de
habilitar. A pausa continua disponível para o ID próprio mesmo se a
configuração remota divergir. As credenciais do scheduler e do worker exigem
ACL privada e ausência de reparse points. O script não imprime headers/credenciais
e guarda respostas de e-mail desabilitadas. Evidência pública de histórico
contém apenas IDs, timestamps, duração e status HTTP.

Custos: nenhum upgrade autorizado. Neon Free exige monitoramento: uma chamada
por minuto pode manter compute ativo e exceder 100 CU-hours/mês. Não prometer
gratuidade ilimitada, habilitar cobrança ou desligar silenciosamente. Meta de
60 s/120 s é medida de acionamento/aceitação SMTP controlados, não SLA de inbox.

## Fila, monitoramento e intervenção

Preservar R1: lote até quatro, concorrência até dois, lease 90 s, deadline SMTP
até 15 s e margem de dois segundos; fence fresco antes do envio e resultado
final condicionado à posse. Não manter lock SQL durante SMTP. Outbox cifrada e
limiter são duráveis. Reenvio invalida/cancela a intenção antiga na transação.
Aviso de senha alterada não usa challenge consumido.

O endpoint tem limite de runtime de 60 s, enquanto cron-job.org interrompe sua
espera em 30 s. Um lote com quatro mensagens, concorrência dois e SMTP de até
15 s pode ultrapassar a espera do scheduler ao incluir banco e outras etapas.
Não interpretar timeout do scheduler como prova de falha SMTP nem prometer que
o runtime continue após desconexão. GATE B deve medir duração/status do job,
backlog e recuperação de leases/retentativas após interrupção, preservando R1
e a ambiguidade de aceitação sem resposta. Nenhum upgrade pago está autorizado.

Monitorar backlog/idade, `PENDING`, `PROCESSING` e estados terminais
`SENT`, `DEAD`, `EXPIRED`, `CANCELLED` sem recipient/prova/payload em logs. Cinco
claims e retries finitos; não regenerar prova por falha do provedor. O envio
pode duplicar após aceitação SMTP com resposta perdida; não há promessa de
exatamente uma vez. `SENT` comprova aceitação SMTP, não recebimento humano.

Para pausar, desabilitar somente o job da homologação. Para retomar, reabilitar
o mesmo destino/segredo, conferir scheduler e drenagem limitada. Leases vencidos
são recuperáveis; provas vencidas exigem ação legítima do usuário. Não truncar
fila nem remover contas de testadores. Identidade do job, horários, cotas e
operador ainda precisam de evidência real; não inventar responsável.

## Rollback seguro

Depois de ativar verificação e revogação, voltar ao binário da Fase 1 restauraria
bypass. Não executar esse rollback. Preservar schema/dados/versões/coortes e
usar candidato anterior compatível com o contrato de contas, ou suspender as
mutações/scheduler afetados até correção mantendo os guards atuais. Não remover
colunas, zerar `credentialVersion`, preencher verificação por inferência,
grandfather contas novas ou reativar usuários para facilitar recuperação.

## Aceite remoto obrigatório

Com caixa autorizada: visitante → cadastro → recebimento automático → código →
acesso adequado → logout → login; incluir retomada, reenvio e rejeição do código
substituído. Em outro contexto: manter sessão A → pedir reset B → receber link
automático → nova senha → A recusada em requisição privada → senha antiga negada
→ nova aceita → link não reutilizável → aviso de alteração.

Abrir reset sem sessão do desenvolvedor/hosting, inclusive outro dispositivo ou
contexto equivalente. Nunca consultar prova no banco para substituir recebimento.
Se não existir leitura segura de inbox, pedir somente a execução humana no
navegador e confirmação do resultado; não pedir código/senha/token pelo chat.
Registrar teste do agente, aceitação SMTP, recebimento humano e jornada humana
separadamente. Só ambos os roteiros, scheduler, acesso e isolamento aprovados
permitem `FASE 2 CONCLUIDA — HOMOLOGACAO OPERACIONAL`.
