# Evidências da implementação de contas

Estado deste registro: `VALIDADO_LOCALMENTE; GATE_A_PASS;
HOMOLOGACAO_BLOQUEADA`. Resultados finais estão consolidados em
[validation-results.json](validation-results.json). Aprovação de políticas e
destinos não equivale à aprovação de jornadas.

## Origem, base e preservação

`DECISAO_CONFIRMADA`: pedido integral do usuário para executar o documento
`execucao-02-contas-e-homologacao-sol-ultra.md` em GPT 6.1 Sol ultra, incluindo
isolamento, GATE A antes de commits candidatos e GATE B antes da conclusão.
Os agentes de implementação, auditoria e frontend foram configurados no modelo
solicitado, com reasoning ultra. Políticas/destinos adicionais foram aprovados
pelo usuário em 2026-10-04: “Aprovo as políticas e os destinos propostos”.
O [checkpoint](remote-checkpoint.md) preserva a proveniência dessa decisão.

`EVIDENCIA_IMPLEMENTACAO`: worktree próprio
`C:/projetos/consolidados/HidroFlorestas-accounts`, branch
`feat/account-verification-recovery`, baseado em
`80ff1cfbe7799fccdde5be923530e3a6edf62010`. A base é descendente do commit
funcional `a56cc9ea1cd23ee339d3a6c5b0154a07dd1ff917`. A fundação não está em
`origin/main`; a Fase 2 depende explicitamente da Fase 1. O remote autorizado
é `PedroVitor237/HidroFlorestas`.

O registro inicial do original era `feat/mail-foundation`, HEAD igual à base,
com `AGENTS.md` já modificado e estes itens não rastreados preservados:

- `docs/plans/active/contas-rascunhos-imagens.zip` e seu diretório `execucao/`;
- `docs/reports/007-ihfr-evolution/`;
- os três prompts `execucao-01-continuacao-emails-sol-ultra.md`,
  `execucao-01-emails-sol-ultra.md`, `execucao-02-contas-e-homologacao-sol-ultra.md`;
- `imp006-final-stat.txt`, `imp006-final-status.txt`, `imp006-final.diff`;
- `revisao-execucao-01-emails.zip`.

Não foram feitos merge, rebase, reset, clean, stash, force-push ou alteração
do worktree/ambiente/banco da Fase 1. O `AGENTS.md` do novo worktree recebeu
automaticamente o bloco de instruções Next durante os testes; essa alteração
de governança é registrada separadamente do candidato funcional.

## Fundação conferida

`FATO_DOCUMENTADO`: `currentAcceptance` e a continuação final da Fase 1 registram
15 gates PASS, snapshot
`aedd43d949cdff51f749a99be541ccd8fece0286d7d03ae6fdf5fc40288ad6a8`,
SMTP/smoke Gmail aceitos e recebimento humano confirmado. Esses resultados são
históricos, não resultados da Fase 2. O commit de fechamento tem somente os
quatro registros documentais da aceitação.

`EVIDENCIA_IMPLEMENTACAO`: inspeção de contratos, outbox, transporte, worker e
suite R1 confirmou fence SQL fresco antes do SMTP, margem de 2 s, orçamento
conservador mínimo 17 s, lease 90 s e deadline SMTP até 15 s independente da
validade da prova. Não há lock SQL durante SMTP; resultado final depende da
posse. Resposta SMTP perdida continua ambígua; não se promete exatamente uma
vez. A ampliação de templates não altera esse caminho de envio.

Não havia produtores/consumo de provas de contas, política de legado aprovada,
homologação publicada ou scheduler automático na entrega anterior. O baseline
formal em `prisma/bootstrap/` existe e foi reutilizado, sem novo init ou db push.

## Implementação e rastreabilidade

Os [contratos](contracts/accounts.md), [plano](plan.md), [tarefas](tasks.md),
[pesquisa](research.md) e [handoff](handoff.md) registram os requisitos e sua
reconciliação. A execução do Spec Kit instalado gerou os artefatos da feature;
a análise cruzada encontrou cobertura de 17 requisitos por 28 tarefas, sem
conflito constitucional ou achado crítico. Ajuste de ordem documental dos gates
foi indicado sem mudar o requisito de aceitação.

| Capacidade | Implementação | Evidência automatizada pertinente |
| --- | --- | --- |
| Cadastro, propriedade, idempotência, atomicidade | accounts/contracts.ts, policy.ts, proof.ts, service.ts; sign-up route | account-contracts, account-verification-recovery integração, account-api contrato |
| Verificação, tentativas, reenvio, retomada | email-verification rotas; service; verify-email; auth context | integração Pg, account-security-review, jornadas E2E |
| Recuperação neutra, consumo único, revogação | password-reset rotas; service; forgot/reset-password | integração Pg, contrato HTTP, E2E em dois contextos |
| Troca autenticada, login, logout, coortes | auth.core/session/auth.service/users.service; change-password; superadmin | session/auth unit, matriz administrativa Pg, E2E/HTTPS |
| E-mails e avisos, limiter, R1 | fundação mail ampliada, runtime e endpoint máquina preservados | mail/account-proof, mail-outbox e R1/TLS existentes |
| Banco, bootstrap, colisões e constraints | migrations 012/013; scripts accounts; context opt-in | migrations de contas e cadeia existente, Bootstrap/SchemaAudit |
| UI, privacidade e acesso | forms, DTOs fechados, headers, fragments, menus | client-contracts, contrato HTTP, teclado/mobile/E2E e inspeção visual |
| Operação remota | remote-bootstrap, scheduler, .vercelignore, runbook | guards unit e sintaxe local; provisionamento/jornadas remotos ainda pendentes |

As migrations aditivas são
`20261004000200_account_verification_recovery` e
`20261004000300_account_rate_limit_actions`. A migration da Fase 1 permaneceu
intacta, assim como a 012 após aplicada. A 013 amplia explicitamente o CHECK dos
limites para oito ações; o enum acrescenta aviso sem challenge. Coorte existente
é fotografada na migração, sem preencher `emailVerifiedAt` por inferência.

Global 100/h é compartilhado entre workflows, cobrado antes dos locks de
identidade; reset negado termina sem nova busca/receipt/bucket subjetivo após
o gate global. TTL de requests 24 h tem limpeza limitada a 100 por invocação do
worker. Novas senhas preservam bytes/espaços, respeitam 15 codepoints/72 bytes
e recusam somente whitespace; login continua aceitando hashes legados.

## Matriz final do GATE A

`EVIDENCIA_IMPLEMENTACAO`: 15 gates obrigatórios PASS/exit 0 no fingerprint
`cc77f24e65c66fbe2b56e248698ea2b710400d92490cfa352ba6fe5fc651dbaa`,
entre 2026-10-04 22:38:19.443 e 22:45:44.095 UTC. O
[manifesto](functional-manifest.json) contém 473 arquivos únicos ordenados,
com SHA256 dos bytes exatos. Exclui dotenv, coletores, ZIPs, artefatos gerados
e documentos; configurações funcionais, scripts, migrations, dependências e
testes estão incluídos. Esse algoritmo não reescreve a evidência da Fase 1.

| Gate | Resultado final |
|---|---|
| Unit | 277/277 + suíte mail 17/17 |
| Mail isolado | 17/17 |
| Integration PostgreSQL | 157/157, incluindo 25 cenários de contas |
| Migration PostgreSQL | 33/33, incluindo seis cenários 012/013 |
| Contract HTTP | 6/6 |
| R1 | 17/17, preservado |
| E2E navegador | 62/62, incluindo sete cenários novos |
| E2E HTTPS production build | 2/2; teardown PASS, zero fixtures restantes |
| Typecheck / Lint / Build | PASS / PASS com três avisos preexistentes / PASS |
| CleanInstall | npm ci + geração Prisma + mail TLS 17/17 + typecheck PASS |
| RegressionSetup / Bootstrap | 11 migrations verificadas/concluídas, zero falhas |
| SchemaAudit pós-E2E/HTTPS | zero schemas de teste gerenciados |

Comandos, UTC, ambiente, exit, counts, base e cada snapshot estão no
[JSON](validation-results.json), que preserva 76 execuções históricas,
inclusive FAIL anteriores. Os totais das suítes se sobrepõem; não somá-los
como número de testes distintos. O teste visual da CLI continua FAIL como
diagnóstico de ferramenta; a inspeção visual pública foi registrada separadamente.

Scan final antes do commit: 108 arquivos candidatos e 42 arquivos do bundle,
zero ocorrências dos valores privados conhecidos. Revisão de diff/ownership
e segredos também concluída. `git diff --cached --check` PASS. A
[equivalência do conteúdo versionado](versioned-snapshot-equivalence.json)
confere todos os 473 arquivos, considerando bytes exatos e filtros Git para
CRLF/LF. Fingerprint funcional e SHA do commit são identificadores distintos.

## Infraestrutura local

Cluster PostgreSQL 17 próprio na porta 55427, owner `accounts_owner`, ACL
somente usuário local/SYSTEM e credenciais DPAPI. Bancos
`accounts_development`, `accounts_regression_test`,
`accounts_regression_reference` separados; o último permanece referência vazia.
Bootstrap local verificou 11 migrations, zero falhas, transação sintética
revertida e descarte somente do banco temporário de ownership próprio.

Remetente foi lido seletivamente da configuração privada autorizada. Chaves
JWT/cifra/HMAC/prova/worker são próprias; não houve rotação das chaves da Fase 1
nem cópia integral do ambiente. Dados/provas sintéticos trafegam somente por
IPC no harness guardado; nenhuma rota debug ou transporte falso é publicada.
Fixture compartilhada usa dois endereços sintéticos exatos por execução, sem
wildcard. Testes não substituem recebimento real por consulta de prova no banco.

`EVIDENCIA_IMPLEMENTACAO`: a nova validação `mail:verify`, em
2026-10-04 22:39:05.551–22:39:08.810 UTC, exit 0, no snapshot final
`cc77f24e65c66fbe2b56e248698ea2b710400d92490cfa352ba6fe5fc651dbaa`, confirmou conexão e
autenticação SMTP, **sem mensagem enviada**. Não é smoke remoto nem aceitação
humana da Fase 2.

## Falhas observadas e correções

O histórico do collector será preservado no JSON, além dos resultados finais.
Falhas focais anteriores também foram reportadas pelos agentes:

- Prisma 7 não desserializa `void` em advisory lock: cast explícito `::text`
  corrige cadastro/reset; 18 falhas focais iniciais demonstraram o defeito.
- Fixtures confundiam DTO público com ID interno; os testes passaram a obter
  ID apenas pelo seam controlado, mantendo o DTO público fechado. Fixture de
  notice SENT passou a incluir o timestamp exigido pela constraint.
- Typecheck encontrou cast inválido de elemento de formulário, tipos de
  headers/ambiente e IDs de fixture; correções preservaram validação estrita.
- Captura de campos antes da hidratação e seletores ambíguos do route announcer
  foram corrigidos no harness. Timeout de jornadas longas foi separado dos
  testes curtos.
- A normalização de loopback do Next para localhost causava 403 legítimo.
  Origem externa confiável agora vem do perfil configurado; Vercel usa somente
  APP_PUBLIC_URL HTTPS, local/HTTPS de testes exigem ownership explícito.
  Host/forwarded-host arbitrários e outros sites continuam recusados.
- Campo vazio de allowlist no child podia ser reposto pela carga dotenv;
  dois destinatários sintéticos exatos e não vazios corrigem o perfil de teste.
- Worker falso com PrismaPg sem timezone UTC expirava mensagem prematuramente;
  passou a usar o adapter PostgreSQL de testes já existente.
- JSON keyrings serializados com escapes em dotenv privado não eram parseáveis;
  reparo de aspas preservou as chaves, confirmado por validação sem valores.
- O assert histórico de último slot da cadeia de migrations precisava
  reconhecer a extensão aditiva, preservando a ordem de todos os slots antigos.
- CLI visual agent-browser teve falhas de inicialização/coleta; inspeção de
  imagens públicas registrou cadastro desktop e recuperação mobile legíveis.
  As falhas de ferramenta permanecem distintas das jornadas funcionais.
- Tipos gerados em `.next/dev/types` ficaram duplicados após execuções de dev;
  a falha de typecheck foi preservada, os arquivos gerados foram arquivados e
  o build regenerou os tipos. O primeiro lint seguinte examinou esse arquivo
  inativo e falhou; o arquivo foi preservado com extensão `.failure-evidence`,
  fora das extensões executáveis do lint. Nenhum arquivo fonte ou assertion foi
  excluído, e o typecheck/lint finais passaram sobre o mesmo código funcional.
- A primeira comparação de blobs usava somente filtros de limpeza do Git e
  apontou 11 diferenças porque a base já preserva CRLF em alguns blobs. A
  comparação final exige identidade do blob com os bytes exatos ou com o
  resultado do próprio filtro Git; todos os 473 arquivos passaram. O resultado
  preliminar está preservado no histórico privado. Nenhum conteúdo funcional
  foi alterado por essa correção do verificador.
- Revisão do scheduler corrigiu timeout gratuito de 30 s, rejeitou portas
  externas à origem aprovada, validou invariantes antes de habilitar, protegeu
  a credencial do worker e recusou coerção de IDs booleanos/fracionários/textuais.
  Parser PASS e exercício sintético Pester 3.4.0: 17/17 PASS, exit 0,
  22:37:41.728–22:37:47.382 UTC, mesmo snapshot final. As funções foram extraídas
  por AST no harness privado; nenhuma credencial real, entrypoint ou API foi
  executada. Esse exercício adicional não é dependência da instalação limpa.

## Dependências e achados de segurança

Lockfile e versões da stack foram preservados. Auditoria atual
`npm audit --omit=dev --json`: exit 0, zero alertas. Auditoria completa:
exit 1, dez alertas high na cadeia de ferramentas ESLint/Next lint:
`@eslint/config-array`, `@eslint/eslintrc`, `@next/eslint-plugin-next`,
`brace-expansion`, `braces`, `eslint`, `eslint-config-next`, `fast-glob`,
`micromatch`, `minimatch`. Não chamar esse segundo audit de PASS.

`INFERENCIA`: os achados de expansão/glob atingem a execução local de lint/build
com padrões/arquivos controlados pelo repositório; o runtime da aplicação não
inclui essa cadeia segundo o audit omit=dev. Isso não elimina o risco da
ferramenta ao processar entradas hostis. `RECOMENDACAO`: resolver em atualização
de tooling separada, sem aplicar o major/downgrade sugerido pelo audit e sem
trocar a stack nesta fase. A comparação do lockfile prova preexistência; nenhum
waiver foi atribuído a um novo pacote.

Lint atual tem zero erros e três avisos em arquivos preexistentes fora do
recorte (`app/page.tsx`, `user-profile/index.tsx`, `white-box/index.tsx`). O quarto
aviso histórico do contexto de autenticação foi eliminado pela integração.
Revisão independente verificou JWT/purpose/TTL/versão/coorte, revalidação após
bcrypt, ausência de writers de senha fora do serviço, constraints e SQL R1.
Uma segunda leitura independente confirmou o fechamento dos achados do
scheduler, inclusive pausa por ID próprio quando a configuração remota mudou.

## Candidato versionado

Commit funcional local: `d341fe402323ddfda705b8546e9aa55886815502`
(`feat(auth): add verified accounts and credential revocation`), descendente
direto da base `80ff1cfbe7799fccdde5be923530e3a6edf62010`. Criado somente após
os 15 gates locais PASS. Conferência pós-commit: todos os 473 arquivos
funcionais equivalentes ao HEAD e fingerprint `cc77f24e…1dbaa` preservado;
nenhum hook alterou fonte funcional. A atualização posterior trata somente
de documentação para registrar este SHA, sem amend ou autoatribuição de seu próprio SHA.

Push, deployment e PR não foram executados. O index será entregue limpo;
`AGENTS.md` do worktree permanece modificado pelo Next e fora do candidato.
O original conserva seu HEAD e o status inicial, inclusive todos os anexos e
alterações preexistentes. Não houve merge, force-push ou mudança em produção.

## Estado remoto

Destinos aprovados: GitHub somente a nova branch, Vercel projeto separado na
equipe `thalesvalente`, Neon novo vazio e cron-job.org a cada 60 s. Nenhuma
contratação paga autorizada. URL funcional, deployment, banco remoto e job ainda
**não comprovados**; não existe homologação pronta para testadores neste estado.

Logins oficiais Vercel/Neon foram preparados, assim como janela privada para
caixas autorizadas e credencial do scheduler. Ausência de autenticação/configuração
privada é precondição externa; não pedir credenciais pelo chat. Provisionamento,
push e deploy dependem de GATE A e dos acessos reais aos destinos.

`EVIDENCIA_IMPLEMENTACAO`: diagnóstico em 2026-10-04 22:48:48.350 UTC
demonstrou que `api.vercel.com:443` não estabelece TCP nesta máquina, antes
do TLS. Node retorna `UND_ERR_CONNECT_TIMEOUT`; Windows também expira.
DNS local coincide com duas consultas públicas independentes e o endereço
corroborado com SNI oficial reproduz o timeout. CA do sistema e preferência
IPv4 não resolveram; nenhuma verificação TLS foi desligada. A descoberta
OAuth de Vercel e Neon responde normalmente; os endpoints de device/token
Vercel dependem do host inacessível. `INFERENCIA`: esse bloqueio explica o
`fetch failed` do login, sem atribuir causa específica a firewall/gateway/provedor.
O [JSON](validation-results.json) contém o diagnóstico redigido.

Login Neon existente escuta callback local e ainda aguarda conclusão no
navegador. Configuração privada de caixas autorizadas e chave administrativa
do cron-job.org não foi salva. Etapa mínima: restabelecer conectividade
autorizada ao endpoint Vercel, concluir os logins oficiais e salvar o formulário
privado. A supressão de deploy da integração anterior também precisa ser
comprovada antes do push. Nenhuma credencial deve ser enviada pelo chat.

Projeto Vercel, banco lógico planejado `accounts_homologation`/owner
`accounts_owner` e job cron-job.org **não foram criados**. Nenhum deployment ID,
SHA implantado, job ID ou invocação automática existe para esta feature.

O preflight observou uma integração Vercel do repositório em outra equipe:
`pedrovitor237s-projects/hidro-florestas`. O acesso somente leitura respondeu
403; Root Directory e configuração privada permanecem desconhecidos. A regra
de `vercel.json` desativa deploy Git somente desta branch, mas sua eficácia no
projeto anterior depende da localização configurada. A documentação exige o
arquivo na [raiz do projeto](https://vercel.com/docs/project-configuration/vercel-json).
Não foi feito push experimental. Publicação Git fica bloqueada por essa
comprovação; deploy CLI ao novo projeto pode avançar separadamente quando seus
acessos e GATE A estiverem prontos. Nenhuma alteração no projeto antigo foi feita.

GATE B exige duas invocações automáticas, recuperação de backlog, cadastro com
reenvio/invalidação e recuperação em outro contexto, com prova de recebimento
e revogação. SMTP aceito, leitura de mensagem pelo harness, recebimento humano
e aprovação de jornada humana são quatro observações distintas. Nenhuma jornada
humana da Fase 2 está atribuída à aprovação do checkpoint.

Runbook: [account-homologation-runbook.md](../../docs/operations/account-homologation-runbook.md).
Roteiro/equipe: [handoff.md](handoff.md). Rollout em produção permanece fora do
escopo, exige preflight real de colisões/coorte/administradores e decisão própria.

## Retomada com vínculos novos — 2026-10-05

`DECISAO_CONFIRMADA`: o usuário instruiu remover o vínculo com `thalesvalente`
e usar somente os vínculos novos confirmados. O conector Vercel antigo foi
desinstalado pela ferramenta Plugin Management; execução prossegue pela CLI
oficial autorizada. GET de identidade/teams confirmou equipe
`hidrofloresta-8598`, ID `team_YqedIK09zOGFeZ8M84kra0oM`, membership OWNER,
plano Hobby. Neon `me`/orgs confirmou organização `HidroFloresta`,
`org-autumn-meadow-54690835`, plano free. Nenhum login ou segredo foi publicado.

`EVIDENCIA_IMPLEMENTACAO`: projeto Vercel próprio
`prj_OHzoR4hZ4MOrg2HOBvbZmiADrwaz` criado sem Git, separado de `hidro-florestas`
existente. Alias verificado e reservado pela API:
`https://hidroflorestas-accounts-homologatio.vercel.app`. Ainda não há
deployment funcional ou aprovação de jornadas. Neon projeto novo
`lingering-dream-37087260`, PostgreSQL 17, aws-sa-east-1, compute 0,25 CU,
banco `accounts_homologation`/papel `accounts_owner`. Bootstrap formal remoto
PASS: 11 migrations concluídas, zero falhas, fresh=true, zero contas importadas.
Aplicação usará endpoint pooled; bootstrap usou endpoint direto, com TLS e
identidade conferidos. Conexões dos bancos antigos permaneceram intocadas.

Chaves de JWT, outbox, idempotência, worker e prova/request geradas exclusivamente
para homologação. Somente sete campos SMTP autorizados foram reutilizados;
não houve cópia integral do ambiente. Configuração e autenticação SMTP PASS,
zero mensagens reais enviadas. API Vercel verificou 27 variáveis encrypted
somente no target production do projeto isolado, sem herança preview.

Delta funcional único frente ao candidato preservado: constantes de equipe e
origem HTTPS no guard `scripts/accounts-homologation-scheduler.ps1`.
Fingerprint atual `306a64d0a477d446440101870d9f8533e1893e8bfb69ad8942d6e478fc075b31`,
473 arquivos; todos os demais arquivos funcionais byte-idênticos ao fechamento.
Pester focal 17/17 PASS, sem ler credenciais reais nem chamar API. A matriz
anterior de 15 gates mantém seus snapshots/contagens históricos; nenhum gate
não afetado foi repetido ou atribuído artificialmente ao delta novo.
Equivalência de todos os inputs funcionais com o INDEX PASS antes do commit
`6446280a26a6ac9c6064eb2ab5aee5000207374f`. Commits `d341fe4` e `3858c51`
permanecem ancestrais intactos.

O usuário pediu reabrir a configuração privada para corrigir um destinatário.
Formulário foi reaberto com caixas existentes e chave do cron-job.org mascarada,
sem pedir reenvio de credencial. Publicação/envios aguardam novo Save posterior
ao pedido; não usar a lista incorreta. Scheduler permanece sem job criado e
nenhuma chamada automática/jornada real foi atribuída a estes preflights.

GitHub ainda retorna o status histórico em `pedrovitor237s-projects/hidro-florestas`;
a leitura desse escopo continua 403. O projeto existente acessível na equipe nova
tem RootDirectory nulo, mas vincula `HidroFlorestaStartup/HidroFlorestas`, diferente
do origin autorizado `PedroVitor237/HidroFlorestas`. Isso não comprova equivalência
nem autoriza alterar origin/projetos antigos. Push fica pendente; upload CLI
separado não precisa dele. Não houve merge, force-push ou alteração de produção.

Continuação da retomada: correção dos dois destinatários salva privadamente;
allowlist atualizada no projeto novo e escopo das 27 variáveis novamente
verificado. Job cron-job.org próprio `8586345` criado **desabilitado**, com
cadência de 60 s, POST autenticado e armazenamento de respostas desativado.
Ainda não conta como invocação automática ou entrega de e-mail.
