# Quickstart de validação: acesso autenticado seguro

**Feature**: `001-authenticated-access`
**Uso**: roteiro reproduzível e registro das validações técnicas concluídas em 2026-09-13.

## Precondições

- Branch da feature baseada em `origin/development` e artefatos de spec/plano aprovados.
- Node.js compatível com o baseline (localmente 20.19.2) e dependências instaladas pelo lockfile.
- PostgreSQL/Neon **exclusivo de teste**, já contendo o schema atual. Este roteiro não cria nem
  executa migration.
- Nenhum ambiente de desenvolvimento compartilhado ou produção pode ser usado pelas fixtures.
- A implementação dos contratos em [contracts/auth-api.openapi.yaml](contracts/auth-api.openapi.yaml)
  e os scripts de `package.json` estão concluídos.
- `@playwright/test`, Chromium, Node.js e OpenSSL estão disponíveis; T039 não exige dependência
  adicional nem certificado persistente.

## Variáveis necessárias

Somente os nomes são registrados; valores devem vir do canal seguro da equipe.

| Nome | Uso | Regra |
|---|---|---|
| `DATABASE_URL` | Baseline para comparação; no servidor filho E2E recebe a URL de teste | Deve estar definida e ser sintaticamente válida; a fixture nunca a usa como fallback |
| `TEST_DATABASE_URL` | Conexão exclusiva da fixture e origem do servidor E2E | Obrigatória, sintaticamente válida e diferente de `DATABASE_URL` após normalização |
| `TEST_DATABASE_CONFIRMATION` | Confirmação explícita do destino de teste | Deve ser exatamente `HIDROFLORESTAS_AUTH_TEST` |
| `JWT_SECRET` | Emissão e verificação de sessão | Obrigatória, não vazia e sem fallback |
| `NODE_ENV` | Guard da fixture e seleção do atributo `Secure` | Deve ser `test` para fixtures; o servidor usa `Secure` em produção |
| `E2E_USER_PASSWORD` | Senha comum das contas fictícias | Obrigatória apenas para fixture/E2E; nunca registrar o valor |
| `PLAYWRIGHT_BASE_URL` | URL da aplicação sob teste | Opcional quando `playwright.config.ts` iniciar o servidor local |

`ROOT_PASSWORD` e cadastro não participam deste roteiro.

## Preparação dos usuários

A fixture `tests/fixtures/auth-users.ts` executa as seguintes proteções antes de abrir conexão ou
realizar escrita:

1. exigir simultaneamente `NODE_ENV=test`, `TEST_DATABASE_URL` definido e
   `TEST_DATABASE_CONFIRMATION=HIDROFLORESTAS_AUTH_TEST`;
2. validar sintaticamente `TEST_DATABASE_URL` e `DATABASE_URL`, normalizá-las e recusar URLs iguais;
3. não aceitar fallback de `TEST_DATABASE_URL` para `DATABASE_URL` e instanciar a conexão Prisma da
   fixture explicitamente com `TEST_DATABASE_URL`;
4. fazer `upsert` somente de quatro identidades fictícias e determinísticas, uma para cada estado
   `ACTIVE`, `PENDING`, `BLOCKED` e `INACTIVE`;
5. usar UUIDs determinísticos e emails reservados sob `auth-test.hidroflorestas.invalid`;
6. gerar hash bcrypt a partir de `E2E_USER_PASSWORD`, sem imprimir senha ou hash;
7. usar `role: USER`, `isAdmin: false` e nenhum dado pessoal real;
8. limitar setup, transição e teardown à interseção da allowlist exata de quatro IDs e emails;
9. não usar `truncate`, limpeza global ou `deleteMany` sem filtro estrito;
10. restaurar `ACTIVE` após o cenário que muda o estado da conta.

Qualquer condição ausente, URL inválida ou igualdade normalizada deve falhar de modo fechado antes
de conexão destrutiva, `upsert`, update ou delete. Testes unitários do guard cobrem isoladamente
cada condição ausente ou inválida e o único caminho válido.

O script não chama `/api/auth/sign-up`, não usa o script de superadmin, não altera schema e não
cria migration.

## Comandos de validação

O comando reproduzível de T039 executa build de produção, cria certificado efêmero em diretório
temporário, sobe Next.js e proxy HTTPS somente em loopback, prepara as quatro fixtures, roda a
cobertura Playwright complementar e sempre executa teardown e contagem final:

```bash
npm run test:e2e:https
```

Scripts disponíveis:

```text
test:fixtures:auth  -> carrega ou remove apenas as quatro fixtures allowlisted
test:unit           -> node --import=tsx --test tests/unit/*.test.ts
test:integration    -> node --import=tsx --test --test-concurrency=1 tests/integration/*.test.ts
test:e2e            -> playwright test
test:e2e:https      -> produção HTTPS temporária + cobertura Playwright de T039 + cleanup
test                -> unitários seguidos de integração
typecheck           -> tsc --noEmit
```

Sequência integral executada:

```bash
npm run test:unit
npm run test:integration
npm run lint
npm run typecheck
npm run build
npm run test:fixtures:auth -- setup
npm run test:e2e
npm run test:fixtures:auth -- teardown
npm run test:e2e:https
git diff --check
```

O teardown deve ser tentado ao final mesmo quando o E2E falhar, sempre preservando o guard e a
allowlist. Além da confirmação visual, o guard objetivo continua obrigatório. O processo filho do
servidor iniciado pelo Playwright recebe `TEST_DATABASE_URL` como seu `DATABASE_URL`; essa
substituição fica limitada ao processo filho controlado e nunca altera o ambiente pai.

## Fronteiras dos testes

- **Unitários**: exercitam o núcleo de autenticação sem APIs globais do Next.js, injetando fakes
  manuais para busca de usuário, comparação de senha e emissão/verificação de token; também cobrem
  parser, serializer, sessão e guard da fixture.
- **Integração**: exercitam adapters e handlers Next.js finos por um harness que fornece request,
  leitura/escrita de cookie e captura de response controladas. Não usam banco real; dependências do
  núcleo são fakes explícitos, enquanto bcrypt/JWT reais podem ser usados quando forem o objeto da
  integração.
- **E2E**: usam HTTP, servidor Next.js e banco de testes reais. Somente essa camada recebe
  `TEST_DATABASE_URL` como `DATABASE_URL` do servidor filho.

## Matriz de validação automatizada

### Unitários

| Cenário | Resultado esperado |
|---|---|
| Entrada com `email`/`password` válidos | Parser devolve objeto novo contendo somente as duas chaves |
| Email após trim satisfaz `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` | Entrada segue para verificação de credenciais |
| JSON não objeto, campo ausente, tipo errado, chave extra, whitespace ou email fora da regra | `400 INVALID_REQUEST`; nenhuma consulta ou sessão |
| Usuário `ACTIVE` versus demais estados | Somente `ACTIVE` é elegível |
| Serializer recebe registro interno | Saída tem exatamente `firstName`, `lastName`, `image`; `id`, `email`, `password`, `status`, `role`, `isAdmin`, `createdAt`, `updatedAt` e `token` estão ausentes |
| Segredo ausente/vazio | Emissão e verificação falham fechadas sem fallback |
| JWT válido, adulterado, expirado ou payload inválido | Somente o válido devolve `userId` |
| Política do cookie | TTL, atributos de criação e remoção são coerentes |
| Guard da fixture com cada variável ausente, URL inválida ou URLs normalizadas iguais | Recusa antes de conexão ou escrita; somente a combinação integralmente válida avança |

### Integração

| Cenário | Resultado esperado |
|---|---|
| Credencial correta de `ACTIVE` | `200`, DTO público e `Set-Cookie` seguro |
| Senha incorreta ou usuário ausente | `401 INVALID_CREDENTIALS`, sem cookie válido |
| Credencial correta de `PENDING`, `BLOCKED`, `INACTIVE` | Mesma falha genérica `401`, sem revelar estado |
| Erro de JSON/allowlist ou email sintaticamente inválido | `400 INVALID_REQUEST` antes de consulta/bcrypt |
| Restauração válida | `200`, `Cache-Control: no-store` e DTO público |
| Sessão ausente, inválida, expirada ou usuário inexistente | `401 UNAUTHENTICATED`, sem dados protegidos |
| Usuário deixa de ser `ACTIVE` | Próxima restauração falha e cookie obsoleto é expirado |
| Falha de repositório/configuração | `500 INTERNAL_ERROR` genérico; nenhuma sessão concedida |
| Logout com qualquer condição de sessão | `200`, cookie expirado; repetição permanece idempotente |

### Percurso completo principal

Executar Playwright com `workers: 1` e navegador/contexto limpo entre cenários:

1. fazer login com a fixture `ACTIVE` e confirmar chegada ao `/workspace`;
2. inspecionar a resposta de login e confirmar o conjunto exato do DTO e o cookie HTTP-only;
3. recarregar `/workspace` e abrir `/dashboard`; ambos permanecem disponíveis;
4. mudar diretamente a fixture de `ACTIVE` para `BLOCKED` via helper de teste;
5. recarregar/acessar novamente e confirmar redirecionamento controlado sem conteúdo protegido;
6. restaurar a fixture para `ACTIVE`, autenticar de novo e executar logout;
7. usar voltar, recarregar e acesso direto às duas árvores; todos exigem nova autenticação;
8. repetir logout sem sessão e confirmar estado não autenticado estável.

Executar também cenários isolados para cookie ausente, token malformado, assinatura inválida,
expiração e token vinculado a usuário inexistente. O contexto de request do Playwright pode
inspecionar `/api/auth/me` usando os mesmos cookies do navegador.

## T039 automatizada e validações humanas futuras

`DECISAO_CONFIRMADA` — Em 2026-09-13, a equipe do HidroFlorestas substituiu a inspeção manual de
T039 por automação Playwright para tudo que o navegador pode comprovar objetivamente. A cobertura
HTTPS verifica respostas de login e `/api/auth/me`, conjunto exato do DTO, `Cache-Control:
no-store`, cookie `Secure`/`HttpOnly`/`SameSite=Lax`/`Path=/` com duração aproximada de 604.800
segundos, ausência de conteúdo protegido sob latência artificial e o ciclo de
reload/logout/voltar/reload/acesso direto/logout repetido.

- **SC-006 — `NAO_VERIFICADO`**: permanece a meta de pelo menos 90% das pessoas concluírem login e
  alcançarem o workspace em até dois minutos, sem assistência.
- **SC-007 — `NAO_VERIFICADO`**: permanece a meta de pelo menos 90% das pessoas compreenderem que
  não estão autenticadas e que o acesso protegido não foi concedido.
- Essas avaliações humanas foram adiadas para follow-up de UX/produto no backlog Code-First. O
  adiamento não bloqueia a conclusão técnica de `IMP-001`; os resultados não foram executados nem
  inferidos a partir da automação.

## Evidência executada em 2026-09-13

| Verificação | Resultado observado |
|---|---|
| Guard da fixture | 8/8 testes aprovados; adapter real autenticou; contagem inicial allowlisted `0` |
| T039 em produção HTTPS | build e TypeScript do Next.js aprovados; certificado temporário; 2/2 Playwright aprovados |
| Fixtures de T039 | setup `4`; teardown `PASS`; `remainingFixtureUsers: 0`; temporários removidos |
| E2E preexistente | 10/10 em Chromium serial; teardown `PASS`; `remainingFixtureUsers: 0` |
| Unitários | 34/34 aprovados |
| Integração | 14/14 aprovados |
| Lint | exit code `0`; `0 errors`; quatro warnings preexistentes |
| Typecheck | `npm run typecheck` aprovado |
| Build final | Prisma Client gerado; compilação e validação TypeScript do Next.js aprovadas |
| Integridade do diff | `git diff --check` aprovado |

Os quatro warnings preservados são `@typescript-eslint/no-unused-vars` em
`src/app/api/auth/sign-up/route.ts`, `src/app/page.tsx`, `src/components/user-profile/index.tsx` e
`src/components/white-box/index.tsx`. O E2E preexistente também emitiu o aviso não bloqueante do
Next.js dev sobre futura configuração de `allowedDevOrigins`; a validação T039 usa produção HTTPS.
Nenhuma evidência contém senha, URL de banco, JWT, cookie ou header sensível.

## Comportamento esperado consolidado

- Somente credencial correta de conta atualmente `ACTIVE` cria sessão.
- Reload restaura somente JWT válido vinculado a usuário existente e ainda `ACTIVE`.
- Proxy melhora a navegação, mas layout e handlers de servidor tomam a decisão autoritativa.
- O núcleo não acessa APIs globais do Next.js; adapters finos controlam request, cookies e response.
- `AuthenticatedPrincipal` permanece interno; `/me` serializa sempre `PublicUserDto`.
- Qualquer falha mantém estado não autenticado e nunca devolve conteúdo ou detalhes internos.
- Logout concluído remove o cookie e impede restauração por back/reload até novo login.
- Cadastro e administração não são exercitados para preparar ou validar a feature.

## Limitações conhecidas

- A sessão stateless não possui revogação individual de JWT copiado antes de expirar.
- O primeiro E2E cobre Chromium; outros navegadores podem ser acrescentados somente por necessidade
  comprovada.
- Atributo `Secure` foi verificado pela automação local em produção HTTPS temporária.
- A disponibilidade do banco e os valores das variáveis pertencem à operação da equipe.
- O upgrade de segurança do Next.js indicado no plano é trabalho compartilhado separado.
- SC-006 e SC-007 permanecem `NAO_VERIFICADO` até a avaliação humana futura.
