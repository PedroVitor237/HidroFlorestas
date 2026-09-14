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

## Reconciliação com `origin/development` — 2026-09-13

- Baseline: branch local e remota sincronizadas em `c5d3871f8333ea80c6ae7b49ebe67a973b05d5cb`; `origin/development` em `5fa63ce03d80aa47a28abbd94cfc29653076de20`, contendo `abe16c4c5533d4241e1d0b6e81351f7c1f42af8a` e o merge do PR #20.
- Segurança: `safety/002-criar-laboratorio-pre-development-merge` criada localmente no HEAD original; `origin/development` incorporada por merge não fast-forward mantido sem commit durante as correções. O merge automático não apresentou conflitos.
- `npm ci`: PASS; 538 pacotes instalados conforme o lockfile. O audit informativo relatou vulnerabilidades de dependências já resolvidas pelo lockfile, sem `npm audit fix` por estar fora do escopo desta reconciliação.
- `npm audit --omit=dev --json`: `NAO_VERIFICADO`; a consulta ao endpoint do registry falhou mesmo após repetição com acesso de rede, portanto a contagem informativa de `npm ci` não foi usada para atribuir achados à IMP-002.
- `npx prisma format --check`: PASS.
- `npx prisma validate`: PASS.
- `npx prisma generate`: PASS; Prisma Client 7.4.2 gerado somente no caminho ignorado.
- `npm run lint`: PASS com `0 errors` e quatro warnings preexistentes em `development`; o único warning introduzido pela IMP-002 foi removido.
- `npm run test:unit`: PASS, 42 testes em 8 suítes/arquivos, incluindo contratos e serviço de laboratório.
- `npm run test:integration`: PASS, 22 testes em 6 suítes/arquivos, incluindo rejeição de criação sem sessão autoritativa e propagação exclusiva do principal autenticado nas configurações.
- `npm run typecheck`: PASS.
- `npm run build`: PASS com Next.js 16.1.6; o primeiro intento ficou bloqueado pelo sandbox ao buscar a fonte Poppins e o segundo passou com acesso de rede autorizado. As rotas `/api/laboratories`, `/api/laboratories/[laboratoryId]` e `/workspace` foram reconhecidas como dinâmicas.
- `npx playwright test tests/e2e/create-laboratory.spec.ts --list`: PASS; quatro cenários da IMP-002 descobertos.
- E2E da IMP-002: `NAO_VERIFICADO` por infraestrutura. O ambiente isolado passou pelos guards e o setup allowlisted concluiu, mas a conexão WebSocket com o provedor expirou no `beforeAll`, antes do primeiro cenário; três cenários não chegaram a iniciar. O teardown seletivo posterior passou e confirmou zero usuários-fixture de autenticação remanescentes.
- E2E conjunto da IMP-001/IMP-002: uma tentativa posterior descobriu 14 cenários e executou o único cenário inicial independente de persistência com sucesso. O primeiro cenário de autenticação dependente do banco recebeu a resposta interna controlada após indisponibilidade do provedor; a IMP-002 voltou a expirar no `beforeAll`. Resultado: 1 passou, 2 foram reportados como falha por conectividade e 11 não executaram. O locator do heading do workspace foi reconciliado.
- Limpeza E2E final: os comandos seletivos de laboratório e autenticação passaram. Uma contagem anterior após teardown confirmou zero usuários-fixture; a última recontagem ficou `NAO_VERIFICADO` porque a conexão expirou novamente. Nenhum valor de ambiente foi copiado ou exibido.
- `git diff --check` e `git diff --cached --check`: PASS após as correções, a atualização documental e o Converge e antes do merge commit.
- `$speckit-converge`: PASS após corrigir o apontador local ignorado de `specs/001-authenticated-access` para `specs/002-criar-laboratorio`; 19 FRs, 10 cenários de aceitação, 10 SCs, decisões do plano e 7 princípios constitucionais foram avaliados, sem findings acionáveis e sem nova fase/tarefa anexada.
- Checkpoint Git/PR: merge commit `9186299ea24a35bf0636842ec8e485d86fc04b29` criado e enviado por push normal; PR #21 atualizado para base `development`, aberto, não draft, mergeável e sem automerge. Os checks Vercel e Vercel Preview Comments estavam em sucesso; o PR não foi merged.
- Navegador autenticado, rolagem da lista, trap/restauração de foco, teclado, viewport móvel/ampla, percepção e conclusão em até dois minutos: `NAO_VERIFICADO`; follow-up humano não bloqueante, sem aprovação inventada.

## Fechamento técnico — 2026-09-13

- Baseline confirmado na branch `002-criar-laboratorio`: HEAD e upstream em `e245c012b624b788cc1cbb0976e5ab623fadaf39`, divergência `0/0`, working tree limpa e `origin/development` incorporado.
- Preflight E2E: PASS na conexão válida. Guard, isolamento entre banco E2E e banco de desenvolvimento, autenticação do adapter real e consulta simples de aquecimento passaram. A contagem allowlisted anterior ao setup confirmou `0` usuários, `0` laboratórios e `0` vínculos.
- Runtime E2E: `NAO_VERIFICADO` por indisponibilidade externa intermitente do Neon, não bloqueante para este merge. Duas execuções pararam por timeout de conexão durante o setup, antes de o Playwright iniciar os 14 cenários; portanto, nenhum cenário foi declarado aprovado, ignorado ou reprovado funcionalmente e nenhuma asserção falhou. Não houve nova execução neste checkpoint de fechamento.
- Teardown e isolamento: o cleanup allowlisted foi acionado obrigatoriamente; após a recuperação da conexão, a contagem final confirmou `0` usuários, `0` laboratórios e `0` vínculos. Nenhuma fixture conhecida permaneceu e o banco de desenvolvimento não foi acessado.
- Audit comparativo: `npm audit --omit=dev --json` executado tanto na branch quanto no lockfile de `origin/development`. Ambos retornaram exatamente `22` achados (`6` moderados, `15` altos e `1` crítico), sem vulnerabilidades adicionadas, removidas ou com severidade alterada e sem diferença nos pacotes responsáveis. `package.json` e `package-lock.json` também são idênticos entre os dois estados; logo, a IMP-002 não introduziu regressão de vulnerabilidade.
- Risco global preexistente: os `22` achados do grafo compartilhado, inclusive o crítico e os altos, exigem tratamento próprio antes da produção. Nenhuma dependência, lockfile ou código foi alterado e `npm audit fix` não foi executado.
- T010 permanece aberta como desvio histórico não recuperável. T031 permanece aberta como validação humana/runtime `NAO_VERIFICADO`, adiada e não bloqueante.
