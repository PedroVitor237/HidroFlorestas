# Quickstart de validação: acesso autenticado seguro

**Feature**: `001-authenticated-access`
**Uso**: roteiro aprovado para a fase de implementação; nada abaixo foi executado neste checkpoint
documental.

## Precondições

- Branch da feature baseada em `origin/development` e artefatos de spec/plano aprovados.
- Node.js compatível com o baseline (localmente 20.19.2) e dependências instaladas pelo lockfile.
- PostgreSQL/Neon **exclusivo de teste**, já contendo o schema atual. Este roteiro não cria nem
  executa migration.
- Nenhum ambiente de desenvolvimento compartilhado ou produção pode ser usado pelas fixtures.
- A implementação dos contratos em [contracts/auth-api.openapi.yaml](contracts/auth-api.openapi.yaml)
  e dos scripts planejados em `package.json` deve estar concluída.
- `@playwright/test` e Chromium devem ser instalados e verificados somente no checkpoint autorizado
  de implementação; não fazem parte do estado atual.

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

A fixture planejada `tests/fixtures/auth-users.ts` deve, antes de abrir conexão ou executar escrita:

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

## Comandos planejados

Após autorização para implementação, a adoção inicial da ferramenta E2E deverá atualizar
`package.json` e `package-lock.json`:

```bash
npm install --save-dev @playwright/test
npx playwright install chromium
node --input-type=module -e "import { chromium } from '@playwright/test'; const browser = await chromium.launch({ headless: true }); await browser.close();"
```

O último comando é o smoke de verificação da instalação e encerra o navegador imediatamente.
`--with-deps` não é requisito geral; pode ser usado somente como solução operacional eventual se o
ambiente realmente não possuir bibliotecas de sistema necessárias e houver autorização adequada.

Scripts a acrescentar durante a implementação:

```text
test:fixtures:auth  -> carrega ou remove apenas as quatro fixtures allowlisted
test:unit           -> node --import=tsx --test tests/unit/*.test.ts
test:integration    -> node --import=tsx --test --test-concurrency=1 tests/integration/*.test.ts
test:e2e            -> playwright test
test                -> unitários seguidos de integração
typecheck           -> tsc --noEmit
```

Sequência de validação prevista:

```bash
npm run test:fixtures:auth -- setup
npm run test:unit
npm run test:integration
npm run lint
npm run typecheck
npm run build
npm run test:e2e
npm run test:fixtures:auth -- teardown
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

## Verificações manuais

- Em Network/Application do navegador, confirmar que login e `/me` devolvem somente
  `firstName`, `lastName` e `image`, nunca `id`, `email`, senha, hash, `role`, `status`, `isAdmin`,
  timestamps ou relações.
- Sob rede lenta, confirmar ausência de flash de `/workspace` ou `/dashboard` antes da decisão do
  servidor.
- Após logout, confirmar manualmente voltar/reload/navegação direta.
- Em ambiente HTTPS controlado, confirmar `Secure`, `HttpOnly`, `SameSite=Lax`, `Path=/` e duração.
- Com participantes ou representantes definidos pela equipe, cronometrar SC-006 e verificar a
  compreensão de falhas de SC-007. Automação não substitui essas duas metas.

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
- Atributo `Secure` exige verificação em HTTPS, não apenas no servidor local HTTP.
- A disponibilidade do banco e os valores das variáveis pertencem à operação da equipe.
- O upgrade de segurança do Next.js indicado no plano é trabalho compartilhado separado.
