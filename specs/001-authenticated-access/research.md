# Pesquisa técnica: acesso autenticado seguro

**Feature**: `001-authenticated-access`
**Data**: 2026-09-07
**Estado**: pacote técnico aprovado; implementação e validações técnicas concluídas em 2026-09-13

## Fontes e classificação

- `DECISAO_CONFIRMADA`: `CF-ID-001`, `CF-DEL-001` e `CF-TECH-001`, registradas na spec ou em
  `docs/code-first-prd/analysis/decision-snapshot.md`.
- `EVIDENCIA_IMPLEMENTACAO`: código, schema, configurações e lockfile inspecionados no commit
  `3c7591021439a8b18af9866996bff2ffc61c5ac4`.
- `DECISAO_CONFIRMADA`: a equipe do HidroFlorestas aprovou em 2026-09-07 as decisões técnicas
  abaixo para a feature `001-authenticated-access`. A aprovação não as transforma em padrão global
  e não prova que tenham sido implementadas.
- Referência externa limitada à documentação oficial das versões e ferramentas consideradas:
  [Proxy do Next.js 16.1.6](https://github.com/vercel/next.js/blob/v16.1.6/docs/01-app/03-api-reference/03-file-conventions/proxy.mdx),
  [autenticação no Next.js 16.1.6](https://github.com/vercel/next.js/blob/v16.1.6/docs/01-app/02-guides/authentication.mdx),
  [cookies no Next.js 16.1.6](https://github.com/vercel/next.js/blob/v16.1.6/docs/01-app/03-api-reference/04-functions/cookies.mdx),
  [Route Handlers no Next.js 16.1.6](https://github.com/vercel/next.js/blob/v16.1.6/docs/01-app/03-api-reference/03-file-conventions/route.mdx),
  [node-jsonwebtoken 9.0.3](https://github.com/auth0/node-jsonwebtoken/tree/v9.0.3),
  [runner de testes do Node](https://nodejs.org/api/test.html),
  [testes Playwright no Next.js](https://nextjs.org/docs/app/guides/testing/playwright) e
  [testes com Prisma Client](https://www.prisma.io/docs/orm/prisma-client/testing/integration-testing).

## Baseline observado

`EVIDENCIA_IMPLEMENTACAO` — O login compara a senha com bcrypt e emite JWT por sete dias, mas
rejeita apenas `BLOCKED` e `INACTIVE`; por isso `PENDING` ainda é elegível
(`src/app/api/server/services/auth.service.ts:70-97`). O mesmo serviço usa fallback de segredo,
enquanto o middleware lê a variável sem validação (`auth.service.ts:7-23` e
`src/app/api/server/middlewares/auth.middleware.ts:5-20`).

`EVIDENCIA_IMPLEMENTACAO` — A resposta de login serializa o registro Prisma completo, que contém
`password`, `role`, `status`, `isAdmin` e timestamps (`src/app/api/auth/sign-in/route.ts:17-20` e
`prisma/schema.prisma:10-21`). `/api/auth/me` remove somente `password` por blacklist e preserva
os demais campos (`src/app/api/auth/me/route.ts:8-13`).

`EVIDENCIA_IMPLEMENTACAO` — O proxy cobre `/dashboard/:path*` e `/workspace/:path*`, porém usa
somente a existência do cookie; o layout privado renderiza seus filhos antes da restauração
assíncrona no cliente (`src/proxy.ts:3-25` e `src/app/(private)/layout.tsx:1-17`). Esse mecanismo
é proteção de navegação parcial, não autenticação autoritativa.

`EVIDENCIA_IMPLEMENTACAO` — O schema já contém `UserStatus` com `ACTIVE`, `PENDING`, `BLOCKED` e
`INACTIVE`; não é necessária alteração de schema ou migration (`prisma/schema.prisma:10-41`).

## 1. Ciclo de vida da sessão

- **Decisão (`DECISAO_CONFIRMADA`)**: manter uma sessão JWT stateless no cookie `auth_token`, com duração
  única de sete dias, revalidada no servidor a cada restauração, renderização privada e operação
  protegida. Estados finais: ausente, inválida, expirada, órfã, inelegível ou autenticada.
- **Evidência**: a duração de sete dias já está alinhada entre `expiresIn` e `maxAge`; FR-006,
  FR-007, FR-009 e FR-011 exigem restauração, expiração, revalidação e encerramento.
- **Motivo**: preserva o mecanismo existente e entrega o recorte sem persistir uma nova entidade.
- **Alternativas**: sessão persistida/refresh token foram rejeitados porque exigiriam schema,
  migrations e revogação fora do escopo; sessão apenas em memória não sobreviveria a reload nem
  seria adequada a múltiplas instâncias.
- **Consequência**: o banco é consultado para confirmar existência e `ACTIVE` sempre que a
  identidade for usada autoritativamente.
- **Risco restante**: apagar o cookie encerra a sessão do navegador, mas uma cópia furtada do JWT
  pode continuar válida até expirar; blacklist e rotação ficam fora desta entrega.

## 2. Emissão e verificação do token

- **Decisão (`DECISAO_CONFIRMADA`)**: centralizar emissão e verificação em módulo exclusivo de servidor,
  manter payload mínimo `{ userId }`, exigir `userId` string não vazia em runtime, fixar `HS256`
  tanto em `sign` quanto na allowlist de `verify` e usar a mesma constante de sete dias.
- **Evidência**: hoje a verificação está duplicada, um método não é usado e o payload é aceito por
  cast TypeScript (`auth.service.ts:15-26`; `auth.middleware.ts:18`).
- **Motivo**: uma única configuração impede deriva e a allowlist de algoritmo torna o contrato
  criptográfico explícito, conforme a API oficial do `jsonwebtoken` 9.0.3.
- **Alternativas**: manter duplicação foi rejeitado; trocar para Auth.js ou outro provedor foi
  rejeitado por acrescentar dependência e reestruturar um fluxo já conectado.
- **Consequência**: tokens antigos compatíveis com `{ userId }` e `HS256` continuam verificáveis
  quando assinados pelo segredo correto; falhas viram resultados tipados, não casts.
- **Risco restante**: JWT não fornece revogação individual antes do vencimento.

## 3. Segredo obrigatório

- **Decisão (`DECISAO_CONFIRMADA`)**: `JWT_SECRET` deve existir e não ser vazio; ausência produz falha
  fechada e erro interno controlado, sem emitir ou aceitar sessão e sem fallback.
- **Evidência**: o emissor atual usa fallback conhecido e o verificador usa coerção `as string`,
  criando comportamento divergente quando a variável falta.
- **Motivo**: emissão e validação precisam compartilhar uma origem obrigatória.
- **Alternativas**: segredo default e geração efêmera no boot foram rejeitados por serem inseguros
  ou invalidarem sessões de forma não coordenada.
- **Consequência**: ambientes sem configuração não autenticam e precisam corrigir a variável.
- **Risco restante**: rotação e armazenamento do segredo são responsabilidades operacionais não
  definidas nesta feature; valores nunca entram nos artefatos ou logs.

## 4. Atributos do cookie

- **Decisão (`DECISAO_CONFIRMADA`)**: centralizar nome e opções: `httpOnly: true`, `secure` somente em
  produção, `sameSite: "lax"`, `path: "/"` e `maxAge: 604800`; remoção usa o mesmo nome e
  caminho, `maxAge: 0` e expiração no passado.
- **Evidência**: esses atributos já existem no login, mas criação e remoção estão espalhadas.
- **Motivo**: preserva comportamento adequado e elimina divergência entre emissão e logout.
- **Alternativas**: `SameSite=Strict` pode impedir navegações legítimas; `SameSite=None` exige
  `Secure` e amplia exposição cross-site sem necessidade; cookie acessível a JavaScript foi
  rejeitado.
- **Consequência**: o token não entra em JSON nem no estado React; o navegador o envia por cookie.
- **Risco restante**: `Secure` precisa ser confirmado em HTTPS de produção; domínio customizado e
  subdomínios não foram especificados.

## 5. Restauração da sessão

- **Decisão (`DECISAO_CONFIRMADA`)**: expor `GET /api/auth/me` sem cache; ler o cookie no servidor,
  validar JWT/payload, consultar o usuário atual, exigir `ACTIVE` e devolver apenas o DTO público.
  Falha de autenticação responde `401` e expira cookie obsoleto; falha interna responde `500`
  genérico sem conceder acesso.
- **Evidência**: o endpoint atual é `POST`, consulta o usuário, mas não revalida estado e usa
  blacklist de senha; o contexto já o chama para restaurar.
- **Motivo**: `GET` representa consulta idempotente e mantém o servidor como fonte da identidade.
- **Alternativas**: decodificar JWT no cliente ou confiar no usuário em memória foram rejeitados;
  conservar `POST` seria funcional, mas menos claro para um contrato de leitura.
- **Consequência**: reload restaura `ACTIVE`; sessão ausente/inválida/expirada/órfã/inelegível não
  popula o contexto.
- **Risco restante**: a restauração do contexto pode duplicar uma consulta já feita pelo layout;
  otimização posterior não deve enfraquecer os dois limites.

## 6. Revalidação do estado `ACTIVE`

- **Decisão (`DECISAO_CONFIRMADA`)**: toda validação autoritativa consulta o estado atual e aceita por
  igualdade estrita somente `ACTIVE`; os outros três estados compartilham a mesma recusa.
- **Evidência**: `CF-ID-001`, FR-002, FR-003 e FR-009 confirmam a regra; o schema já possui os
  estados e o baseline deixa `PENDING` passar no login e todos os estados passarem na restauração.
- **Motivo**: negar por padrão cobre estados presentes e futuros sem allowlist acidental.
- **Alternativas**: codificar apenas estados proibidos foi rejeitado porque já omitiu `PENDING`;
  confiar no estado embutido no JWT foi rejeitado porque ele fica obsoleto.
- **Consequência**: mudança posterior de `ACTIVE` para outro estado bloqueia a próxima validação.
- **Risco restante**: o intervalo até a próxima requisição continua aberto, inerente ao modelo web
  sem canal de revogação em tempo real.

## 7. Proteção das rotas

- **Decisão (`DECISAO_CONFIRMADA`)**: manter `src/proxy.ts` somente como filtro otimista de navegação
  para ausência de cookie em `/dashboard/:path*` e `/workspace/:path*`; remover o redirecionamento
  de `/login` baseado apenas na presença do cookie. A árvore `(private)` será bloqueada por layout
  server-side antes de renderizar conteúdo.
- **Evidência**: o matcher atual cobre raiz e descendentes; Next.js 16.1.6 executa Proxy em Node,
  mas sua documentação recomenda evitar consulta ao banco nessa camada porque ela também roda em
  prefetch e não deve ser a única defesa.
- **Motivo**: separa resposta rápida de navegação da validação completa junto aos dados.
- **Alternativas**: consultar Prisma no proxy foi rejeitado por custo e orientação oficial;
  verificar apenas assinatura no proxy é possível, mas não prova usuário existente ou `ACTIVE` e
  não elimina a validação autoritativa.
- **Consequência**: cookie arbitrário pode atravessar o filtro otimista, mas nunca o layout/handler
  de servidor; `/login` continua acessível para substituir cookie inválido.
- **Risco restante**: dois níveis precisam ser testados para evitar loop de redirecionamento.

## 8. Fronteira autoritativa no servidor

- **Decisão (`DECISAO_CONFIRMADA`)**: separar um núcleo de autenticação sem dependência das APIs
  globais do Next.js e adapters finos. O núcleo recebe explicitamente funções injetáveis de busca
  de usuário, comparação de senha e emissão/verificação de token; o adapter `requireAuth` lê
  `cookies()` e converte request/resultado para o Next.js. Após JWT + consulta atual + igualdade
  `ACTIVE`, o núcleo retorna `AuthenticatedPrincipal` com exatamente `id`, `firstName`, `lastName`,
  `image` e `isAdmin`. O layout privado chama o adapter antes de renderizar; cada Route Handler,
  Server Action ou operação protegida também valida no próprio limite.
- **Evidência**: o layout atual é client-side e renderiza filhos imediatamente; o guia oficial do
  Next.js exige checks próximos ao acesso de dados e trata UI/layout como insuficientes para
  proteger mutações ou endpoints.
- **Motivo**: proteção visual e contexto React não concedem autoridade.
- **Alternativas**: somente proxy ou somente `useEffect` foram rejeitados; validar apenas `/me`
  deixaria outras operações futuras dependentes de disciplina implícita.
- **Consequência**: `/workspace` e `/dashboard` não renderizam para sessão inelegível; endpoints
  protegidos permanecem responsáveis por sua própria validação. `requireAdmin` continua recebendo
  `isAdmin`; `AuthenticatedPrincipal` nunca é serializado diretamente para o cliente.
- **Risco restante**: novas operações podem esquecer o helper; testes de contrato e revisão de
  tarefas devem exigir o padrão.

## 9. DTO público do usuário

- **Decisão (`DECISAO_CONFIRMADA`)**: resposta exata `{ firstName, lastName, image }`, montada
  campo a campo por serializer a partir dos dados internos necessários; `AuthenticatedPrincipal`
  permanece separado. `id`, `email`, `password`, `role`, `status`, `isAdmin`, `createdAt`,
  `updatedAt` e relações nunca integram respostas de login ou restauração.
- **Evidência**: a UI consome nome e imagem; a spec permite somente dados necessários e proíbe
  senha/hash e campos privilegiados. O baseline retorna o registro completo.
- **Motivo**: allowlist torna novas colunas privadas por padrão.
- **Alternativas**: spread com `password: undefined`, `omit` genérico ou tipo Prisma no cliente
  foram rejeitados por blacklist incompleta e acoplamento.
- **Consequência**: o contexto passa a usar tipo público dedicado; consultas Prisma usam `select`
  explícito para credenciais e identidade.
- **Risco restante**: futuros módulos podem precisar de outro identificador público; essa ampliação
  exige contrato próprio e não deve antecipar dados nesta entrega.

## 10. Validação runtime

- **Decisão (`DECISAO_CONFIRMADA`)**: parser local sem nova biblioteca recebe `unknown`, exige objeto
  simples com exatamente `email` e `password`, rejeita chaves extras, exige strings e valores não
  vazios após teste de whitespace, apara somente o email e mantém a senha original para bcrypt.
  Depois do `trim`, o email deve satisfazer a regra conservadora e testável
  `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`; ela valida a forma mínima adotada pela feature sem alegar
  conformidade integral com todos os casos possíveis dos RFCs de email.
- **Evidência**: a API atual acessa `body.email`/`body.password` sem validação; a checagem visual
  pode ser contornada por requisição direta.
- **Motivo**: atende FR-004 e reduz a superfície sem introduzir Zod apenas para dois campos.
- **Alternativas**: confiar em TypeScript ou no formulário foi rejeitado; Zod/Yup continuam opções
  se o conjunto de contratos crescer, mas não se justificam neste recorte.
- **Consequência**: JSON inválido, tipos errados, campos ausentes/extras, whitespace e email
  sintaticamente inválido recebem `400 INVALID_REQUEST` antes da consulta de credenciais e sem
  criação de cookie. Credencial bem formada inexistente ou incorreta recebe
  `401 INVALID_CREDENTIALS`.
- **Risco restante**: limites máximos de credenciais não foram definidos como regra de produto; a
  validação sintática aprovada não inventa política de senha nem altera cadastro.

## 11. Erros controlados

- **Decisão (`DECISAO_CONFIRMADA`)**: resultados discriminados internos e envelope público estável.
  Entrada inválida usa `400 INVALID_REQUEST`; credencial incorreta ou conta inelegível usa a mesma
  resposta genérica `401 INVALID_CREDENTIALS`; sessão ausente/inválida/expirada/órfã/inelegível usa
  `401 UNAUTHENTICATED`; falha inesperada/configuração usa `500 INTERNAL_ERROR` sem detalhes.
- **Evidência**: hoje erros internos do serviço podem virar `401` e mensagens de estado distinguem
  a condição da conta.
- **Motivo**: separa responsabilidade técnica, evita enumeração de usuário e mantém estado negado.
- **Alternativas**: mensagem específica por estado e propagação de exceções foram rejeitadas.
- **Consequência**: o cliente faz parse do envelope tipado, decide o fluxo por `code` e usa somente
  a `message` pública e segura como fallback de apresentação. `INVALID_CREDENTIALS` conduz o login,
  `UNAUTHENTICATED` limpa o estado na restauração e falhas de logout não declaram encerramento.
- **Risco restante**: texto final de interface não é definido pela spec; a implementação deve
  preservar mensagens compreensíveis sem cristalizá-las como contrato técnico.

## 12. Logout

- **Decisão (`DECISAO_CONFIRMADA`)**: `POST /api/auth/logout` idempotente sempre expira o cookie com a
  configuração compartilhada e retorna sucesso mesmo se a sessão já estiver ausente/inválida. O
  cliente aguarda a resposta, limpa o DTO, usa `router.replace("/login")` e `router.refresh()`;
  repetição por Strict Mode continua segura.
- **Evidência**: o handler já é idempotente, mas o cliente não verifica `res.ok`, usa `push` e pode
  deixar cookie e estado local divergentes em falha.
- **Motivo**: garante que back/reload após logout não recuperem conteúdo no caminho concluído.
- **Alternativas**: logout por `GET`, apenas limpeza de estado React ou apenas expiração local
  foram rejeitados.
- **Consequência**: sessão ausente também chega a estado não autenticado controlado.
- **Risco restante**: falha de rede impede confirmar a remoção server-side; a UI deve informar a
  falha e não declarar logout concluído.

## 13. Estratégia de testes

- **Decisão (`DECISAO_CONFIRMADA`)**: usar `node:test` + `node:assert/strict` carregados por `tsx` já
  instalado para unitários/integração, e adicionar somente `@playwright/test` como nova
  `devDependency` para Chromium E2E serial. O núcleo de autenticação é testado com fakes manuais
  injetados; adapters/handlers finos são exercitados por harness que controla request, cookie e
  response sem depender de estado global implícito; somente E2E sobe servidor HTTP real e usa o
  banco isolado.
- **Evidência**: Node local é 20.19.2, `tsx` 4.21.0 já existe e não há script/test runner. Next.js
  recomenda E2E para integrações que unitários não representam bem.
- **Motivo**: menor conjunto que cobre funções puras, bcrypt/JWT reais, handlers e navegador com
  cookie/banco reais.
- **Alternativas**: Vitest foi rejeitado por requisitos correntes de Node e conjunto maior de
  dependências; Jest exige configuração/dependências adicionais; apenas manual não previne
  regressões; Cypress sobrepõe Playwright.
- **Consequência**: `package.json` e lockfile mudam na implementação; Chromium é instalado fora do
  lock por `npx playwright install chromium` e verificado com um lançamento headless controlado
  seguido de encerramento imediato pela API `chromium.launch()`. Scripts previstos: `test:unit`,
  `test:integration`, `test:e2e`, `test` e `typecheck`. `--with-deps` não é requisito geral e fica
  restrito a solução operacional eventual quando faltarem bibliotecas do sistema.
- **Risco restante**: E2E depende de banco isolado, browser instalado e ambiente configurado; nada
  será instalado neste checkpoint.

## 14. Dados e fixtures para validação

- **Decisão (`DECISAO_CONFIRMADA`)**: fixture exclusiva de teste faz `upsert` direto via Prisma de
  quatro usuários fictícios allowlisted (`ACTIVE`, `PENDING`, `BLOCKED`, `INACTIVE`), com UUIDs e
  emails reservados determinísticos, `USER`, `isAdmin: false` e hash bcrypt derivado de
  `E2E_USER_PASSWORD`; não usa `/api/auth/sign-up`.
- **Evidência**: FR-014 trata cadastro como precondição e a spec exige os quatro estados e sessões
  válidas/inválidas/expiradas. O schema atual já os representa.
- **Motivo**: cria precondições repetíveis sem incluir cadastro no produto, schema ou migration.
- **Alternativas**: script de superadmin não cobre a matriz; cadastro pela UI violaria o escopo;
  dados manuais não seriam reprodutíveis.
- **Consequência**: antes de conectar ou escrever, o guard exige simultaneamente `NODE_ENV=test`,
  `TEST_DATABASE_URL` definido, `TEST_DATABASE_CONFIRMATION=HIDROFLORESTAS_AUTH_TEST`, ambas as
  URLs sintaticamente válidas e `TEST_DATABASE_URL` normalizada diferente de `DATABASE_URL`. Não há
  fallback entre URLs; a fixture instancia sua conexão explicitamente com `TEST_DATABASE_URL`. O
  servidor filho controlado pelo Playwright recebe essa URL como seu `DATABASE_URL`. Setup,
  transição e teardown aceitam somente os quatro IDs/emails reservados e nunca usam `truncate` ou
  remoção sem filtro estrito; o cenário `ACTIVE → BLOCKED` restaura o estado ao final.
- **Risco restante**: a fixture realiza escritas somente no banco que passar por todos os guards;
  erro, ausência ou URL inválida produz recusa fail-closed anterior a conexão destrutiva, `upsert`,
  update ou delete. Testes unitários do próprio guard cobrem cada condição ausente, inválida, igual
  e a combinação válida.

## Pendência externa ao recorte

`RECOMENDACAO` — A versão fixada no lockfile é Next.js 16.1.6. Um
[boletim oficial de segurança de agosto de 2026](https://nextjs.org/blog/august-2026-security-release)
recomenda atualização da linha 16 para versão corrigida. A atualização do framework é mudança
global e não foi incorporada silenciosamente nesta feature; deve ser coordenada separadamente
antes de produção, sem bloquear a geração das tarefas de autenticação.

## 15. Fechamento técnico automatizado

- **Decisão (`DECISAO_CONFIRMADA`)**: a equipe do HidroFlorestas confirmou em 2026-09-13 que T039
  será uma validação Playwright automatizada de tudo que o navegador puder observar objetivamente,
  em aplicação de produção servida por HTTPS local temporário e loopback. A infraestrutura usa
  Node.js, OpenSSL e Playwright já disponíveis, certificado efêmero fora da árvore Git e somente a
  branch Neon E2E existente.
- **Motivo**: tornar reproduzíveis atributos do cookie, tráfego HTTP, ausência de flash sob
  latência e o ciclo pós-logout sem depender de uma inspeção manual irrepetível.
- **Limite**: SC-006 e SC-007 continuam sendo avaliações humanas, com suas metas percentuais
  intactas e estado `NAO_VERIFICADO`. O adiamento para UX/produto é não bloqueante para a conclusão
  técnica de `IMP-001`, mas automação alguma pode ser apresentada como resultado dessas metas.
- **Segurança operacional**: o runner deve validar o guard, autenticar com o adapter real, exigir
  allowlist vazia, instalar cleanup antes do setup, usar apenas as quatro fixtures determinísticas,
  executar teardown em `finally`, confirmar contagem final zero e sanitizar toda saída.
