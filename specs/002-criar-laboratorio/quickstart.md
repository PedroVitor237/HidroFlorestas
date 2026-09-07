# Quickstart: Criação mínima de laboratório

## Safety

1. Confirmar branch/base/status.
2. Não usar banco compartilhado para fixtures destrutivas.
3. Banco E2E exige `TEST_DATABASE_URL` distinto, `NODE_ENV=test` e confirmação allowlisted, sem imprimir URLs/senhas.
4. Inspecionar histórico/schema/duplicidades antes de aplicar migration; aplicação remota não está autorizada.

## Automated gates

```bash
npx prisma format --check
npx prisma validate
npx prisma generate
npm run test:unit
npm run test:integration
npm run lint
npm run typecheck
npm run build
npm run test:e2e
git diff --check
```

Execute somente scripts existentes; E2E/banco dependem de ambiente isolado confirmado.

## Scenarios

- ACTIVE com 0–4 vínculos cria usando só nome; payload extra/`userId`, nome inválido e sessões inelegíveis não escrevem.
- Com cinco vínculos, recusa controlada; falha de vínculo reverte laboratório; nome repetido em submissão intencional é permitido.
- Workspace lista só vínculos do principal; segundo usuário não vê; reload mantém.
- Respostas não incluem `id`, `userId`, `accessCode`, relações ou principal.
- Exercitar vazio, loading, sucesso, limite e erro; móvel/amplo; teclado, foco, rótulos e botão desabilitado.

## Evidence log

Registrar cada gate com data, ambiente não sensível, resultado e limitação. Não declarar banco, HTTP, navegador, responsividade, acessibilidade, build ou E2E sem execução real.

### 2026-09-07

- `npx prisma format --check`: PASS.
- `npx prisma validate`: PASS.
- `npx prisma generate`: PASS após autorização para escrever o client gerado no worktree.
- `npm run test:unit`: PASS, 8/8 arquivos de teste, incluindo contratos e serviço de laboratório.
- `npm run test:integration`: PASS, 5/5 arquivos de teste, incluindo handlers de laboratório.
- `npm run lint`: BLOCKED no carregamento da regra `react/display-name`; ESLint 10.0.2 é incompatível com o plugin React trazido pelo `eslint-config-next` atual. A falha ocorre antes da análise dos arquivos da feature e não foi corrigida para não ampliar a IMP-002.
- `npm run typecheck`: PASS.
- `npm run build`: PASS; Next.js compilou e registrou `/api/laboratories` e `/workspace` como rotas dinâmicas.
- `npm run test:e2e`: NOT RUN; `TEST_DATABASE_URL`, confirmação allowlisted e demais valores do ambiente isolado não foram fornecidos. Nenhum banco foi acessado.
- `npm run test:e2e -- --list`: PASS; 14 cenários descobertos, incluindo 4 cenários próprios da IMP-002. Esse resultado valida descoberta/sintaxe, não comportamento E2E.
- Banco/migration/HTTP real: NOT RUN; a migration foi criada, mas não aplicada. Histórico remoto, duplicidades e destino precisam ser inspecionados antes de qualquer aplicação.
- Navegador, responsividade e acessibilidade manual: NOT RUN; o fluxo autenticado persistente depende do banco isolado/migration para validação real.
- TDD de T010: DEVIATION; os testes novos não foram observados falhando exclusivamente pela ausência da implementação. A primeira execução falhou por falta do Prisma Client gerado; após geração, os testes passaram. Não usar essa falha ambiental como evidência de TDD.
## Validação da ampliação de configurações — 2026-09-07

- `npm run test:unit`: aprovado, 8 arquivos de teste sem falhas.
- `npm run test:integration`: aprovado, 20 testes em 6 suítes, incluindo detalhes, confirmação textual e bloqueio por dados dependentes.
- `npx tsc --noEmit --incremental false`: aprovado.
- `npm run build`: aprovado, incluindo `/api/laboratories/[laboratoryId]` e `/workspace`.
- `git diff --check`: aprovado.
- Navegador autenticado com banco isolado, rolagem da lista, foco e viewports: pendente; não havia ambiente isolado confirmado nesta execução.
