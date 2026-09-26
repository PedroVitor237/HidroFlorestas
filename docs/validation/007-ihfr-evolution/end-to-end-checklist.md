# Checklist ponta a ponta da `007-ihfr-evolution`

**Registro histórico de 2026-09-25:** as caixas e os estados originais abaixo não foram marcados retroativamente. Consulte a seção 12 do [relatório de validação](validation-report.md) para a execução final de 2026-09-26.

## Estado do roteiro

Este roteiro foi preparado em 2026-09-25, mas nenhuma etapa abaixo foi executada
em navegador. Na continuidade da mesma data, o preflight somente leitura foi
executado, mas a liberação de escrita ficou bloqueada pela ausência de evidência
Neon endpoint → `branch_id`. Marcas vazias das etapas de navegador são
intencionais e preservam o estado daquela rodada.

Uma execução posterior, autorizada explicitamente pelo usuário, está registrada
na seção 6. Ela usou dados persistentes diferentes do vetor `0.29`; por isso as
marcas históricas das seções 1–5 não foram reescritas retroativamente.

## 1. Pré-condições externas à interface

- [ ] A revisão de segurança documentada em
  [`validation-report.md`](validation-report.md) liberou PostgreSQL/E2E.
- [ ] O endpoint de `TEST_DATABASE_URL` foi associado, pela Neon Console/API,
  ao `branch_id` de teste esperado.
- [ ] O endpoint de desenvolvimento foi associado a outro `branch_id`.
- [x] O processo de preflight foi iniciado sem variáveis herdadas de banco, servidor externo
  ou `IMP006_*`.
- [x] `NODE_ENV=test`, confirmação e
  `IMP006_DATABASE_VARIABLE=TEST_DATABASE_URL` foram verificados sem imprimir
  valores sensíveis.
- [x] Nenhum servidor externo/reutilizado foi configurado para o preflight.
- [ ] Nenhuma outra execução concorrente usa o mesmo destino no momento de uma
  futura escrita.
- [ ] Existe uma conta de teste `ACTIVE` conhecida. Essa conta é a única
  pré-condição de domínio preparada fora da interface.
- [ ] Nenhum laboratório, área, coleta, conjunto ambiental ou diagnóstico do
  cenário foi criado diretamente por fixture.

Se for necessário criar a conta, registrar separadamente se ela veio de uma
fixture isolada ou do fluxo `/register`; não apresentar esse preparo como parte
do fluxo iniciado em login.

### Resultado do preflight de 2026-09-25

- [x] Conexão PostgreSQL ao alvo selecionado em transação explicitamente
  somente leitura.
- [x] Banco configurado e banco conectado com o mesmo fingerprint sanitizado.
- [x] Alvos normalizados de teste e desenvolvimento distintos, inclusive por
  endpoint normalizado.
- [x] Alvo de teste identificado como Neon pooled; o sufixo `-pooler` foi
  removido somente para calcular a identidade sanitizada do endpoint.
- [x] Schema inicial observado como `public`, comportamento esperado antes da
  criação do schema temporário; isso não foi tratado como falha.
- [x] Zero schemas preexistentes com prefixo `imp006_test_` foram observados.
- [ ] Associação endpoint → `branch_id` confirmada pela Neon Console/API.
- [ ] Setup autorizado e schema aleatório efetivamente selecionado por lifecycle,
  fixtures, Next.js/Prisma, probes e limpeza. Esta verificação é posterior à
  liberação de escrita e não foi executada.

## 2. Vetor técnico do cenário feliz

O vetor abaixo deriva diretamente dos mapeamentos e fórmulas do manifesto
[`ihfr-math-experimental-v0.1.1.json`](../../../specs/006-ihfr-diagnosis/contracts/ihfr-math-experimental-v0.1.1.json).
Ele é um vetor técnico, não científico.

### Área e coleta

- Nome do laboratório: valor exclusivo da execução.
- Nome da área: valor exclusivo da execução.
- Latitude: `-3`.
- Longitude: `-38`.
- Ocorrência da coleta: instante passado em RFC 3339 com fuso explícito, por
  exemplo `2026-09-20T12:00:00-03:00`.

### Dados ambientais

| Grupo | Campo | Valor |
|---|---|---|
| Água | Fonte de água | `SPRING` |
| Água | Há nascente | `true` |
| Água | Profundidade do poço | não informado; não aplicável |
| Água | Disponibilidade hídrica | `PERMANENT` |
| Água | Indicador de salinidade | não informado |
| Solo | Textura | `MEDIUM` |
| Solo | Taxa de infiltração | `60 mm/h` |
| Solo | Compactação | `LOW` |
| Solo | Sinais de erosão | `NONE` |
| Solo | Solo exposto | não informado |
| Vegetação | Cobertura vegetal | `100%` |
| Vegetação | Fragmentação | `LOW` |
| Vegetação | APP ripária | `true` |
| Vegetação | Degradação da paisagem | `LOW` |
| Terreno | Densidade de drenagem | `1.5 km/km²` |
| Terreno | Elevação | `180 m` |
| Terreno | Declividade | `45%` |

### Suplemento IHFR

- Uso predominante da terra: `FOREST`.
- Origem: `FIELD_OBSERVATION`.
- Data da observação: instante válido anterior ou igual ao teste.

### Resultado técnico esperado, calculado independentemente

- Água: `(0.2 + 0.2 + 0.2) / 3 = 0.2`.
- Solo: `(0 + 0.2 + 0.2 + 0.4) / 4 = 0.2`.
- Vegetação: `(0 + 0.2 + 0.2 + 0.2) / 4 = 0.15`.
- Terreno/uso: `(1 + 0.2) / 2 = 0.6`.
- Raw: `0.25 × (0.2 + 0.2 + 0.15 + 0.6) = 0.2875`.
- Apresentação half-up: `0.29`.
- Classe: `MODERATE`.
- Qualidade: `HIGH` — cinco entradas essenciais presentes.
- Drivers, pela ordem de desempate declarada: `T`, depois `W`.

## 3. Etapas executadas pelo usuário

### Login e laboratório

- [ ] Abrir `/login`.
- [ ] Informar e-mail e senha da conta de teste.
- [ ] Selecionar “ENTRAR”.
- [ ] Confirmar redirecionamento para `/workspace` e sessão autenticada.
- [ ] Informar nome exclusivo no formulário “Criar laboratório”.
- [ ] Confirmar mensagem de sucesso e surgimento do card.
- [ ] Selecionar “ACESSAR LABORATÓRIO”.
- [ ] Confirmar nome, papel `OWNER` e estado ativo no cabeçalho contextual.

### Área

- [ ] Selecionar “Áreas”.
- [ ] Selecionar “Nova área”.
- [ ] Preencher nome, latitude e longitude do vetor.
- [ ] Opcionalmente preencher município, UF e descrição.
- [ ] Não usar `CollectionArea.landType` como substituto de `landUseType`.
- [ ] Selecionar “Confirmar ponto e cadastrar”.
- [ ] Confirmar redirecionamento ao detalhe e origem laboratorial correta.

### Coleta

- [ ] Selecionar “Registrar coleta”.
- [ ] Informar o instante RFC 3339 com fuso explícito.
- [ ] Selecionar “Revisar coleta”.
- [ ] Conferir laboratório, área e ocorrência.
- [ ] Selecionar “Confirmar coleta”.
- [ ] Confirmar redirecionamento ao detalhe e presença de `confirmedAt`.

### Dados ambientais

- [ ] Selecionar “Ver dados ambientais”.
- [ ] Confirmar estado “Nenhum dado ambiental registrado”.
- [ ] Selecionar “Registrar dados ambientais”.
- [ ] Preencher os quatro grupos com o vetor técnico.
- [ ] Confirmar que zero e “Não” são preservados como valores, não ausência.
- [ ] Selecionar “Revisar dados”.
- [ ] Conferir todos os campos e selecionar “Confirmar dados ambientais”.
- [ ] Confirmar retorno ao detalhe ambiental, contrato
  `ihfr-measurement-v1`, data de confirmação e imutabilidade declarada.
- [ ] Recarregar a página e confirmar os mesmos valores.

### Solicitação e consulta do IHFR

- [ ] Selecionar “Voltar à coleta”.
- [ ] Escolher `FOREST` em “Uso predominante da terra”.
- [ ] Escolher `FIELD_OBSERVATION` e informar a data da observação.
- [ ] Selecionar “Verificar elegibilidade”.
- [ ] Confirmar `ELIGIBLE` e ausência de diagnóstico vigente.
- [ ] Selecionar “Criar diagnóstico” e confirmar o diálogo.
- [ ] Confirmar resultado `0.29`, classe `MODERATE`, qualidade `HIGH` e
  componentes `W=0.2`, `S=0.2`, `V=0.15`, `T=0.6`.
- [ ] Confirmar os quatro qualificadores experimentais obrigatórios.
- [ ] Registrar a omissão atualmente esperada por `F-002`: origem completa,
  versões de medição/suplemento, vigência e datas não aparecem no resumo.
- [ ] Recarregar o detalhe da coleta e confirmar que o mesmo diagnóstico
  permanece corrente.

### Reabrir sem URL manual

- [ ] Voltar ao resumo do laboratório.
- [ ] Localizar “Coleta confirmada” no histórico.
- [ ] Abrir a atividade e confirmar que ela leva ao mesmo detalhe da coleta.
- [ ] Confirmar novamente a persistência do conjunto ambiental e do diagnóstico.

## 4. Casos negativos mínimos posteriores

Executar somente depois do cenário feliz e com isolamento confirmado.

- [ ] Salvar um conjunto ambiental sem `slopePercent`; confirmar que o conjunto
  é aceito, mas a elegibilidade IHFR retorna `MISSING_SLOPE_PERCENT` e nenhum
  diagnóstico é criado.
- [ ] Deixar `landUseType` indeterminado; confirmar insuficiência e ausência de
  diagnóstico vigente.
- [ ] Repetir a mesma operação após resposta desconhecida usando a mesma chave;
  confirmar ausência de duplicação.
- [ ] Recarregar como MEMBER vinculado; confirmar leitura sem controles de
  escrita.
- [ ] Tornar o laboratório inativo em cenário isolado; confirmar leitura e
  recusa de novas escritas.

## 5. Evidências a guardar

- [ ] SHA e branch da execução.
- [ ] Identificadores sanitizados do cenário e timestamps.
- [ ] Fingerprint da identidade de banco/schema, sem URL ou credencial.
- [ ] Resultado de cada etapa e screenshot somente quando não contiver dado
  pessoal desnecessário.
- [ ] Resultado do teardown e comprovação de ausência do schema isolado.
- [ ] Falhas preservadas como falhas; nenhuma expectativa deve ser alterada para
  produzir aprovação.

## 6. Execução posterior registrada

### Ambiente e segurança

- [x] Usuário identificou explicitamente um segundo endpoint como branch Neon
  de teste e autorizou migrations, fixtures e navegador.
- [x] Guarda local confirmou que os alvos normalizados de desenvolvimento e
  teste eram diferentes.
- [ ] Associação endpoint → `branch_id` confirmada independentemente pela Neon
  Console/API.
- [x] Endpoint direto da branch de teste confirmou sete migrations aplicadas e
  schema atualizado.
- [x] URLs, senhas, tokens e valores integrais de ambiente foram omitidos das
  evidências documentais.

### Automação

- [x] `npm run typecheck` passou.
- [x] `npm run lint` passou com quatro avisos preexistentes e zero erros.
- [x] `npm run test:unit` passou em `59/59`.
- [x] `npm run test:contract` passou em `2/2` depois da autorização de banco.
- [x] Concorrência ambiental focal passou em `1/1` no banco físico separado.
- [x] Playwright IHFR em LAN passou em `6/6`.
- [x] Integração passou em `106/106` com cast temporário
  `current_schema()::text`.
- [ ] Integração Neon passa sem alteração temporária; bloqueada por `F-007`.

### Navegador e persistência

- [x] Sessão autenticada com usuário sintético `ACTIVE` e papel `OWNER`.
- [x] Workspace e contexto do laboratório carregados.
- [x] Dashboard, histórico, áreas e detalhe da área reabertos.
- [x] Coleta persistente reaberta.
- [x] Dados de água, solo, vegetação e terreno reabertos, incluindo drenagem,
  elevação e declividade.
- [x] Mapa territorial e membros carregados sem erro de console.
- [x] Elegibilidade `AGROFORESTRY` retornou `ELIGIBLE`.
- [x] `CREATE` retornou `201` e apresentou `0.26`, `MODERATE`, qualidade `HIGH`.
- [x] `REPLACE` com `URBAN` retornou `201` e apresentou `0.32`, `MODERATE`.
- [x] `REVOKE` retornou `200` e removeu o diagnóstico vigente.
- [x] Estado final “Nenhum diagnóstico IHFR vigente” confirmado.
- [x] Nenhum erro de console observado no fluxo persistente.

### Teardown

- [x] Zero usuários e laboratórios das fixtures ambientais após a suíte.
- [x] Schema residual identificado somente pelo prefixo allowlisted e marcador
  oficial do harness.
- [x] Schema residual removido após validação de propriedade.
- [x] Zero schemas `imp006_test_*` após a limpeza.
- [x] Ajustes temporários de código revertidos.

### Pendências mantidas abertas

- [ ] Corrigir ausência obrigatória aceita pelo avaliador (`F-001`).
- [ ] Renderizar proveniência, versões, vigência e datas (`F-002`).
- [ ] Incorporar o cast Prisma/Neon e sua regressão (`F-007`).
- [ ] Formalizar política de endpoint direto versus pooler (`F-008`).
- [ ] Obter prova independente de `branch_id`, se exigida pela governança
  operacional (`F-005`).
- [ ] Obter validação científica humana; a execução técnica não altera o estado
  experimental da v0.1.

## 7. Continuidade corretiva no diff local de 2026-09-25

Esta seção nova não altera as marcas históricas das seções 1–6.

- [x] F-001: RED de campo obrigatório ausente reproduzido; GREEN unitário com casos individuais, zero/false, opcionais, null e entrada inválida. Serviço exercitado com leitura controlada de payload persistido insuficiente: só operação terminal criada.
- [x] F-002: renderização estática de origem, versões, estado, datas UTC e valores técnicos do DTO para CURRENT/SUPERSEDED/REVOKED.
- [x] F-007: consultas Prisma no lifecycle e serviço usam `current_schema()::text`; teste puro de schema correto/divergente/inesperado passou.
- [x] F-003: Prisma Client local ignorado pelo Git regenerado com versão 7.4.2; typecheck passou.
- [x] F-004/F-008/F-009: preflight único, endpoint direto e auditoria somente leitura implementados; recusas puras verificadas.
- [x] Repetir no PostgreSQL local próprio: integração 107/107, contrato 2/2, migrations 23/23 e E2E IHFR 6/6, com schemas descartáveis e preflight somente leitura.
- [x] Confirmar descarte após falha tratável: teste de integração com falha injetada passou e auditoria somente leitura encontrou zero schemas candidatos após falhas e sucessos do E2E.
- [ ] Repetir os gates no Prisma/adapter Neon e auditar o destino E2E autorizado: `NAO_EXECUTADO`, configuração indisponível neste workspace.
- [ ] Executar `npm run test:e2e:ihfr:full-ui` com conta sintética e run ID próprio, após preflight no mesmo destino autorizado: `NAO_EXECUTADO`.
- [x] Confirmar por navegador local 390 × 844 a consulta CURRENT com origem/versões/datas UTC, quebra sem overflow e persistência após reload; estados SUPERSEDED/REVOKED também passaram na renderização estática.
- [ ] Confirmar reabertura pelo histórico e estados de ciclo no percurso integral de UI do destino dedicado: `NAO_EXECUTADO`.
- [ ] Prova independente Neon endpoint → `branch_id`: ausente; autorização operacional histórica não foi convertida em prova do provedor.

O novo E2E integral usa o vetor técnico 0.29 desta lista. Ele está preparado para criar laboratório, área, coleta, medição e IHFR pela UI; não injeta sessão nem recursos de domínio. Sua execução ainda depende do destino dedicado e da conta E2E. Nenhuma identidade ou ID do percurso persistente foi produzida nesta rodada. O E2E local 6/6 usou fixtures em schema descartável e servidor próprio, encerrado ao final.

## 8. Revisão focal posterior — 2026-09-25

`EVIDENCIA_IMPLEMENTACAO`: o roteiro automatizado `full-ui-flow.spec.ts` agora exige:

- [x] Preencher novamente `Data e hora da observação` após reload/reabertura, antes de REPLACE.
- [x] Declarar oráculo independente W=0.20, S=0.20, V=0.15, T=0.60, raw=0.2875, display=0.29, MODERATE, HIGH e drivers=[T,W].
- [x] Comparar o ID do diagnóstico criado com o CURRENT após CREATE, reload e retorno pelo histórico.
- [x] Exigir ID diferente e CURRENT após REPLACE; exigir `diagnosis: null` após REVOKE.
- [ ] Executar esse roteiro no destino E2E dedicado e registrar os IDs/resultados reais: `NAO_EXECUTADO` sem `.env.e2e.local` e conta sintética.

As quatro marcas concluídas acima descrevem asserções versionadas e descoberta Playwright, não um percurso executado. O E2E local 6/6 pertence à outra suíte. As pendências Neon, prova independente de `branch_id` e validação científica mantêm seus estados anteriores.

## 9. Execução no Neon E2E — 2026-09-25

- [x] Conferir branch, HEAD, commits anteriores e arquivos locais preexistentes.
- [x] Configurar `.env.e2e.local` ignorado: primeiro endpoint DEV, segundo E2E conforme identificação explícita do responsável; derivar somente o hostname direto E2E e usar senha sintética exclusiva. Nenhum segredo foi versionado.
- [x] Confirmar por preflight read-only os alvos distintos, o endpoint E2E direto, banco e schema `public`; confirmar migrations atualizadas e quatro contas sintéticas.
- [x] Executar no Neon: contrato 2/2, integração 107/107, migrations 23/23 e E2E IHFR 6/6 em schemas isolados.
- [x] Corrigir no teste full UI seletores ambíguos de senha, navegação e resumo; repetir com novo run ID após cada criação parcial.
- [x] Executar `HF007-UI-a7f1d3d01e434ab0` pela interface: login → laboratório `b46c2813-7e5b-4e99-b6f8-1cdbd849dffd` → área `3fac45bc-9188-4fc9-97f6-584bdb7ced1c` → coleta `2a740c81-f19d-46f6-98a6-76903e156a0e` → medição → IHFR.
- [x] Confirmar CREATE `08d23144-e1d0-4b81-9ac6-8e37f7197d37` e vetor W=0.20/S=0.20/V=0.15/T=0.60, bruto 0.2875, exibição 0.29, `MODERATE`, `HIGH`, `[T,W]`; manter a identidade após reload e histórico em 390 × 844.
- [x] Confirmar REPLACE `998829b1-b989-41f3-b795-9a9ccdd28b3c` distinto, 0.35 e `CURRENT`, e REVOKE seguido de consulta `diagnosis: null`. A inspeção read-only posterior encontrou o anterior `SUPERSEDED`, o segundo `REVOKED` e nenhum ponteiro CURRENT.
- [x] Repetir unitários 218/218, typecheck, lint sem erros e build; auditar processos próprios encerrados.
- [x] Auditar schemas remotamente: um candidato marcado (`imp006_test_bce92440f0134780b9fcee23facfbeda`) sem autoria desta rodada comprovada. Preservar até atribuição; o auditor não executa limpeza.
- [ ] Obter prova independente endpoint → `branch_id` na Neon Console/API e atribuir o schema candidato antes de eventual limpeza.

As tentativas parciais `HF007-UI-7f49429ecccc4959` (laboratório somente) e `HF007-UI-8debba7646d2421e` (laboratório, área, coleta e um diagnóstico CURRENT 0.29) permanecem em `public` para revisão. O checkpoint histórico `HF007-UI-20260925-2295502` não apareceu na consulta read-only ao destino atual. A execução comprova o fluxo técnico experimental, sem aprovação científica definitiva.
