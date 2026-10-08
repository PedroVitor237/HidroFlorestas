# Pesquisa e decisões de design

**Base**: `80ff1cfbe7799fccdde5be923530e3a6edf62010`; **data**: 2026-10-04.

## Autoridade

`DECISAO_CONFIRMADA`: [checkpoint](remote-checkpoint.md), aprovado pelo usuário em 2026-10-04 com “Aprovo as políticas e os destinos propostos”, aprova perfil de contas/senhas/coorte e homologação isolada. Não modifica o ambiente dos juniors. Pacote de planejamento histórico permanece proposta onde não foi confirmado. TD-017 continua estado administrativo `ACTIVE`; verificação é independente.

## Decisão: reutilizar os desafios e a outbox existentes

`RECOMENDACAO` técnica autorizada: usar `AccountEmailChallenge` para ambas as finalidades, HMAC da prova/contexto para código e HMAC do token aleatório para reset, keyring dedicado versionado; `enqueueMail` e `cancelChallengeMail` sempre dentro da transação. Invalidar expirados antes de criar para liberar unique parcial. Um aviso novo `password-changed-v1` não tem `challengeId`, TTL de 24 h e preserva R1.

Razão: fundação validada é dependência; outra fila/desafio físico duplicaria autoridade. Alternativas: SMTP direto (perda/ambiguidade); duplicar tabelas históricas (desnecessário).

## Decisão: isolamento, revisão e sessões

`RECOMENDACAO` técnica autorizada e `EVIDENCIA_IMPLEMENTACAO`: locks de conta serializam geração/consumo/reset/troca; hashing fora da transação e revalidação após hashing. O consumo e a tentativa errada usam atualização condicional com `clock_timestamp()` fresco depois dos awaits, rechecando validade na própria escrita; um horário anterior não autoriza consumo posterior ao vencimento. Login compara o hash de uma leitura e revalida esse hash/versão sob lock antes de emitir JWT. JWTs novos possuem issuer `hidroflorestas`, audience específica normal/verificação, purpose e credentialVersion; cookies separados. JWT restrito antigo continua restrito depois de verificar. JWT sem versão exige conta de coorte explícita e versão zero, nunca a versão atual. Os advisory locks retornam `::text`, compatível com a desserialização Prisma de PostgreSQL.

Alternativas: confiar só no claim/cookie (não revoga); adotar versão atual para token ausente (brecha); lock durante SMTP (impede recuperação).

## Decisão: identidade e coorte

`DECISAO_CONFIRMADA`: trim/case-insensitive conservador, sem remover pontos/aliases. `RECOMENDACAO` técnica: adicionar `emailCanonical` nullable e índice único; preflight recusa colisão antes do backfill derivado `lower(btrim(email))`, preservando email factual. Lookup legado verifica ambiguidade mesmo em criações internas sem canônico. Constraint funcional complementar impede duplicar identidade em writer interno. `verificationRequired` é true por default; migration marca false somente linhas já presentes naquele instante. Não preencher `emailVerifiedAt` por inferência.

## Decisão: idempotência e abuso

`RECOMENDACAO` técnica: `AccountRequest` guarda HMAC da entrada (incluindo senha, somente compromisso keyed), action/key/escopo/resultado/TTL. Lock advisory em action/key e conta; cadastro replay só reemite capacidade se credencial original ainda confere, mesma versão e verificação pendente; não concede conta existente por endereço. Reset request uniforme também registra requests inexistentes; endereço, ingresso e global têm limites duráveis. Header `Origin` é CSRF, separado da origem de limiter. Em Vercel confiar somente header de IP provido pelo ingresso quando explicitamente configurado; fora disso agregar no bucket desconhecido, sem bypass por header arbitrário.

`EVIDENCIA_IMPLEMENTACAO`: o contador único `account-global` permite 100 operações/hora no conjunto de signup/login/reenvio/confirmação/reset/troca, não 100 por ação. É cobrado em transação própria antes da transação de identidade; não se mantém lock global enquanto se espera lock de conta. Uma operação rejeitada ainda consome esse orçamento de abuso. Reset request continua neutro sob teto global e encerra sem lookup/receipt quando orçamento global ou quota por endereço/ingresso é negado; isso limita crescimento de dados após o teto. Migration013 aditiva amplia a constraint do limiter para oito ações; migration012 já aplicada não foi reescrita. O worker remove commitments idempotentes vencidos em lotes de até 100; TTL de 24 h não mantém prova/senha em claro.

`EVIDENCIA_IMPLEMENTACAO`: Next 16.3.6 normaliza os hostnames de loopback para `localhost` em `node_modules/next/dist/server/web/next-url.js`, linhas 15–20. Um Origin legítimo `127.0.0.1` difere assim de `NextRequest.url`. A proteção CSRF conserva rejeição de Origin nulo/arbitrário e Sec-Fetch-Site cross-site/same-site; no ingresso Vercel explicitamente confiável, compara somente o `APP_PUBLIC_URL` HTTPS configurado, nunca x-forwarded-host. No perfil local próprio, Host loopback na porta 3001 fornece origem externa HTTP ou o harness injeta `ACCOUNT_LOCAL_APP_ORIGIN` exato. Produção local HTTPS exige flags de fixture e confirmação de banco; Vercel nunca admite esse perfil local. Teste reproduz a normalização real do Next e valida proxy/negativas. Diagnósticos temporários de booleans foram removidos.

## Decisão: senha

`DECISAO_CONFIRMADA`: 15 Unicode code points mínimos, 72 UTF-8 bytes máximos, sem trim/normalização/composição, bcrypt custo 10. Login mantém comparação de hashes legados sem novo mínimo. Unicode inválido/NUL recusados em novas senhas. Limite bcrypt não pode truncar silenciosamente; sem pré-hash caseiro.

`EVIDENCIA_IMPLEMENTACAO`: a validação preserva espaços no começo/fim e o valor completo, mas recusa senha composta somente por whitespace. Isso mantém o requisito de credencial não vazia já observado no login, sem converter o valor da senha nem inventar aprovação adicional. Testes incluem 15 espaços recusados e roundtrip bcrypt com espaços e Unicode preservados.

## Fontes técnicas consultadas

- Guia instalado Next.js 16.3.6 `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md` antes dos handlers; cookies assíncronos nos guias locais.
- Código primário instalado Next.js 16.3.6 `node_modules/next/dist/server/web/next-url.js:15`–`:20`, `parseURL`/`REGEX_LOCALHOST_HOSTNAME`, consultado em 2026-10-04; teste usa o NextRequest real instalado, não um mock da normalização.
- [OWASP Forgot Password](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html), consultado 2026-10-04: resposta uniforme, prova randômica/expirável/uso único, senha consistente, aviso e login após reset. Referência técnica, não aprovação de política do projeto.
- [OWASP Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html), consultado 2026-10-04: limitações bcrypt e proteção de senha; stack bcrypt preservada pelo pedido.
- [Prisma transactions](https://www.prisma.io/docs/orm/fundamentals/transactions), consultado 2026-10-04; API concreta Prisma 7.4.2 conferida nos tipos instalados e infraestrutura existente.
- [Vercel Git Configuration](https://vercel.com/docs/project-configuration/git-configuration#git.deploymentenabled), consultado 2026-10-04: regra exata de branch false impede commits dispararem deployment automático; branches ausentes permanecem true. [Guia oficial de GitHub Actions/CLI](https://vercel.com/kb/guide/how-can-i-use-github-actions-with-vercel#avoid-the-common-failure-modes-before-they-cost-you) descreve desabilitar integração Git conservando deploy CLI. Isso fundamenta o vercel.json desta branch; não comprova configurações privadas do projeto antigo nem bloqueia comandos externos manuais/API.

## Preflight remoto de publicação

`EVIDENCIA_IMPLEMENTACAO`: consultas GitHub somente leitura em 2026-10-04 observaram main remoto `cf6a7bdc9ca001d5a61845b1258395fe2cfb26c5` com contexto Vercel success, e base `80ff1cfbe7799fccdde5be923530e3a6edf62010` com Vercel failure, ambos apontando a `pedrovitor237s-projects/hidro-florestas`; `a56cc9ea1cd23ee339d3a6c5b0154a07dd1ff917` não tinha status. Base também tinha check `Vercel Preview Comments` completed/success. Workflow runs de todos os eventos filtrados por cada SHA retornaram zero; `.github/workflows` no main respondeu 404. Isso evidencia integração Vercel existente; não identifica production/preview, secrets, RootDirectory, deploy hooks ou webhooks administrativos. O acesso observado tem push, sem admin; não consultar segredos nem inferir permissão administrativa.

Consulta Vercel `get_project` do projeto `hidro-florestas`, scope `pedrovitor237s-projects`, retornou 403 Forbidden por falta de autorização. RootDirectory/customConfig/productionBranch continuam desconhecidos. A presença de um único package.json Next na raiz sustenta somente `INFERENCIA` de root padrão; não comprova a leitura de vercel.json pelo projeto antigo. A decisão de publicar requer tratar essa limitação material, sem alterar ou tentar contornar acesso do projeto anterior.

Os documentos oficiais [Static Configuration with vercel.json](https://vercel.com/docs/project-configuration/vercel-json) e [Using Monorepos](https://vercel.com/docs/monorepos), consultados em 2026-10-04, colocam o arquivo na raiz do projeto/app; o segundo mostra `apps/web/vercel.json`. Nenhuma evidência consultada garante que a regra Git na raiz do repositório seja consumida independentemente de Root Directory ou configuração personalizada. `RECOMENDACAO`: manter o push pendente até comprovar esse controle no projeto conectado ou resolver explicitamente o risco material no checkpoint. A regra local válida e os gates do código, isoladamente, não provam ausência de deployment automático no projeto antigo.

`RECOMENDACAO` técnica executada no escopo da publicação isolada já aprovado: regra Git exata false para esta branch, preservando as demais e deploy manual explícito somente no projeto novo. Sem push/deploy/settings remotos nesta implementação. Gate A deve incluir essa configuração no candidato/fingerprint antes de publicação.

Validação local de configuração: JSON válido e schemas oficiais das duas propriedades presentes (`$schema`/`git`) passaram, baixados de `https://openapi.vercel.sh/vercel.json`; não se alterou dependência. O schema completo usa Draft4 e o Ajv instalado usa Draft7; a tentativa inicial foi incompatível com o dialeto. A validação focal usa os fragmentos oficiais com keywords compartilhadas, sem afirmar validação integral de todas as propriedades do schema completo nem execução remota da supressão.

## Pendências

Gate B depende de banco/deployment/scheduler efetivos, autorização/recebimento nas caixas de testadores e operação persistente. Sem atribuir PASS por aprovação de destino ou SMTP isolado. Nenhuma pendência de política bloqueia agora os bancos sintéticos autorizados; produção permanece fora do escopo.

O preparo e os gates concretos usam `scripts/accounts-local-postgresql.ps1` e `scripts/accounts-validation.ps1`; operação/configuração em [runbook](../../docs/operations/account-homologation-runbook.md) e [.env.accounts.example](../../.env.accounts.example). Resultados focais não são resultados finais do candidato; o histórico de falhas, correções e fingerprint é consolidado pelo responsável em [implementation-evidence.md](implementation-evidence.md).
