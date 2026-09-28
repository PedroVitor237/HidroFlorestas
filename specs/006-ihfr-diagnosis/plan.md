# Implementation Plan: Diagnóstico IHFR experimental

**Branch**: `006-ihfr-diagnosis` | **Date**: 2026-09-20 | **Spec**: [spec.md](spec.md)

**Input**: `specs/006-ihfr-diagnosis/spec.md`

**Status atual**: `CONCLUIDO` para o fechamento técnico da continuidade `007-ihfr-evolution` T135–T143, após gates Neon, auditoria `assert-zero` e revisão final T141 em 2026-09-26. O fechamento T001–T134, inclusive a reabertura e nova conclusão de T116/T134 em 2026-09-24, permanece histórico. `G1`, `G2-ENG` e `G3-ENG` estão resolvidos; `G2-SCI` permanece `VALIDACAO_POSTERIOR` e a prova independente de `branch_id` permanece `EXTERNAL_VALIDATION`.

## Execução das pendências pós-`9b2c989` — 2026-09-27

- **Identificador/estado:** `007-pos-9b2c989-2026-09-27`, `CONCLUIDO_COM_PENDENCIAS_EXTERNAS`. Objetivo: corrigir as lacunas técnicas demonstradas pela avaliação de merge e repetir os gates aplicáveis sobre snapshot estável, sem aprovar merge por inferência.
- **Baseline e preservação:** branch `007-ihfr-evolution`, HEAD `9b2c9890393b34ab8300bf7dcc6a22f90875c22d`, igual ao remoto após `git fetch origin`; diff e staging rastreados vazios. Permanecem não rastreados e fora do staging `docs/reports/007-ihfr-evolution/2026-09-26-revisao-cinco-ultimos-commits.md` e `imp006-final-stat.txt`, `imp006-final-status.txt`, `imp006-final.diff`. O commit de avaliação acrescenta somente 148 linhas documentais.
- **Identidade do lockfile:** blob Git SHA-256 `dc2511c8cf67f06ce985eba30e2d11d1e4a10eb371fdf4b5e210170867785d32`, arquivo de trabalho SHA-256 `85c8a18b77565d3ee0a6e95b47332dae81d806fad5fea12d1fef95919a09925d`. A normalização CRLF→LF torna os bytes iguais; nenhuma mudança de dependência está planejada.
- **Fontes/autoridade:** solicitação atual, `AGENTS.md`, constituição, `SOURCE_AUTHORITY.md`, spec, ADR-0001 e código governam o recorte. O relatório `9b2c989` documenta uma execução anterior sobre `4348fd9`, sem promover seus resultados a gates atuais. `PD-002` e prova Neon endpoint→`branch_id` permanecem externos. A v0.1 conserva os quatro qualificadores experimentais do ADR.
- **Escopo:** preflight E2E com conta sintética própria e lease, prontidão de recursos/browser, instrumentação e oráculos full UI, regressão geral/HTTPS em PostgreSQL próprio, build padrão, auditoria e evidência. Produção só muda se defeito reproduzido o exigir. Fora do escopo: push, merge, rebase, deploy, mudança científica, ampliação de cinco vínculos, apagamento de históricos, escrita em DEV ou no endpoint ambíguo `568d60469278`.
- **Dependências/ordem:** (1) leitura e matriz E1–E7; (2) instalação limpa e preflight de recursos; (3) RED/GREEN local para seleção/lease/erros e full UI; (4) contas E2E guardadas e regressão local/HTTPS; (5) full UI serial no E2E autorizado; (6) gates finais, auditoria, documentação e commits locais. Escritas no mesmo banco e alterações de arquivos compartilhados são serializadas.
- **Riscos e pontos de parada:** alvo divergente, conta não autorizada/inativa, senha incompatível, lease concorrente, capacidade 5/5 ou recurso insuficiente impedem apenas a escrita afetada; não alterar contas antigas para contornar. Alteração científica, fonte conflitante ou ação irreversível fora do recorte exigem autoridade competente. Nenhum retry automático substitui primeira falha.
- **Validação prevista:** `npm ci`, versões instaladas, Prisma validate/generate, unit/typecheck/lint/build, audit, migration/contrato/integração/IHFR, Playwright geral/HTTPS em banco próprio, full UI integral com novo run ID, auditoria read-only antes/depois, revisão de diff/links/segredos e contagem de tarefas. Logs sanitizados duráveis; segredos e traces crus ficam ignorados.
- **Responsáveis e histórico:** coordenação desta execução pelo agente; autoridade de ambiente, ciência e aprovação de merge não especificadas. O plano abriu com 27/27 itens da checklist de requisitos marcados, HEAD `9b2c989` e dados preexistentes preservados. Resultados e desvios serão adicionados sem reescrever o fechamento anterior.
- **Execução e evidência final:** três commits técnicos locais (`ef698a2`, `073a9eb`, `b9d481f`) consolidaram 22 arquivos de runtime, hash agregado SHA-256 `916462fa77c8f8ee6ee56827c37433225ccc479b6cdb31a8ce36a89bff4de9aa` pelo método do [relatório da rodada](../../docs/validation/007-ihfr-evolution/2026-09-27-execucao-codex-ultra.md). Unitários 244/244, typecheck, lint sem erros, build padrão, migration E2E 26/26, contrato 2/2, integração 107/107, IHFR isolado 6/6, Playwright geral local 55/55, HTTPS local 2/2 e auditorias finais passaram. O full UI no E2E `6903ad2ff1ef` passou 1/1 na primeira tentativa em dois run IDs distintos; o segundo, `HF007-UI-POST9B2C989-20260927-02`, verifica o snapshot final, com capacidade 1/5→2/5 e zero CURRENT após REVOKE. Os bancos locais v2 próprios foram descartados sob guardas, recriados e auditados com zero linhas/schemas; o cluster foi parado, preservando v1. Nenhuma escrita ocorreu em DEV ou `568d60469278`.
- **Fechamento e limites:** o relatório E1–E7 distingue a primeira falha geral do gate posterior verde e mantém a causa da exceção migration histórica 25/26 como não determinada. A prova independente endpoint→`branch_id`, a identidade/limpeza do Neon `568d60469278`, `PD-002`/`G2-SCI` e a decisão humana de merge permanecem externas. O veredito técnico é `PRONTA_PARA_REVISAO_DE_MERGE`, sem autorizar merge, push ou deploy; os quatro qualificadores experimentais do ADR permanecem vigentes.

## Retomada das pendências A3–A5 em 2026-09-27

- **Baseline:** `007-ihfr-evolution@38d26026ca50ca07b03a837800e9e5097d1331b4`, sem alterações rastreadas; os quatro arquivos não rastreados anteriores permanecem fora do escopo e serão preservados. Esta retomada responde à solicitação de tentar resolver as pendências e determinar a causa de A5.
- **A5:** reconstruir os dois eventos históricos separadamente. O POST ambiental `201` seguido do timeout visual de cinco segundos será confrontado com navegação e renderização; o 25/26 de migration será confrontado com o oráculo de SQLSTATE e a cadeia de erro. Reproduzir falhas controladas quando possível, corrigir a causa verificável e registrar como `NAO_ESPECIFICADO` qualquer detalhe histórico que a saída perdida não permita recuperar.
- **A3:** consultar advisories e metadados atuais, experimentar a remediação em lockfile isolado antes de alterar o projeto, validar audit e regressões proporcionais. Não suprimir alertas nem atribuir aceitação de risco à equipe.
- **A4 e ciência:** verificar somente por leitura a evidência disponível. Não escrever no Neon `568d60469278`, em DEV ou produção; não inferir `branch_id` nem aprovar PD-002 sem fonte competente.
- **Fechamento:** atualizar tarefas e relatório A1–A7 com causa, evidência, comandos, destinos, resultados e limites; revisar diff, segredos, resíduos e preservar o histórico de 2026-09-26. Sem push, merge, rebase ou deploy.
- **Resultado da retomada:** A3 foi remediada no lockfile SHA-256 `85C8A18B77565D3EE0A6E95B47332DAE81D806FAD5FEA12D1FEF95919A09925D`, com audit de produção e completo sem nós sinalizados; build, unitários 226/226, Playwright geral 55/55, HTTPS 2/2 e gates locais/E2E passaram. A5 teve a fragilidade de prazo visual reproduzida por GET de 6,5 segundos e corrigida com esperas por fase; o teste migration agora preserva SQLSTATE e causa inesperados. A exceção histórica do 25/26 não foi retida e continua `NAO_ESPECIFICADO`. O novo full UI foi impedido por conta E2E com cinco de cinco vínculos; uma guarda read-only faz o runner falhar cedo sem excluir dados. A4, ciência e a repetição do full UI com conta aprovada e capacidade permanecem pendentes. Evidência detalhada em [retomada A3–A5](../../docs/validation/007-ihfr-evolution/2026-09-27-retomada-a3-a5.md); prontidão de merge `NAO_PRONTA`.

## Saneamento corretivo A1–A7 iniciado em 2026-09-26

- **Identificador e estado:** `007-saneamento-a1-a7-2026-09-26`, `CONCLUIDO_COM_PENDENCIAS`. Esta rodada sucede o fechamento técnico histórico acima; não o apaga nem presume prontidão para merge.
- **Origem e objetivo:** solicitação atual para executar o prompt `prompt-hidroflorestas-saneamento-A1-A7-2026-09-26.md`, corrigindo bloqueios demonstrados da revisão dos cinco commits e entregando código, regressões, documentação e commits locais.
- **Baseline inicial:** branch `007-ihfr-evolution`, HEAD `392eebdc748b8e0bbf31b3bfa7fe00876792cd24`, igual à referência remota local. Node `24.19.0`, npm `12.0.2`, hash Git do `package-lock.json` `4382261797807f503dfa4da23c6c8337798005e9`. Sem alterações rastreadas/staged; quatro arquivos não rastreados preexistentes: `docs/reports/2026-09-26-revisao-cinco-ultimos-commits.md` e os três `imp006-final-*`. Preservá-los fora do staging desta rodada.
- **Escopo:** testes/fixtures/runners, dependências aplicáveis, bootstrap PostgreSQL descartável, inventário de migrations, evidência e documentos da IMP-006/007. Fora do escopo: push, merge, rebase, deploy, escrita em DEV/produção ou no destino Neon ambíguo `568d60469278`, exclusão de recursos antigos, mudança de matemática/manifestos e aprovação científica.
- **Fontes e autoridade:** solicitação atual e `AGENTS.md`; constituição, spec, ADR-0001 e decisões confirmadas para intenção experimental; código/migrations/testes e execução para implementação; relatórios anteriores como fatos documentados delimitados por HEAD/destino. `INFERENCIA` e `RECOMENDACAO` não são decisões da equipe. `PD-002` e prova independente de `branch_id` permanecem externas.
- **Trabalho coordenado:** A3 em `package.json`/lockfile; A2 em `tests/e2e` e `tests/fixtures`; A1/A6 em documentos de validação, ADR, TD e tarefas; A5/A7 em runners, bootstrap e verificação final. Nenhum teste com escrita no mesmo banco ocorre em paralelo; alteração compartilhada invalida gates anteriores do snapshot.
- **Etapas e critérios:** (1) leitura e preflight; (2) inventários read-only/audit e reproduções focais; (3) correções de código/teste/dependências com regressões; (4) bootstrap vazio real em recurso descartável; (5) contrato, integração, migration, Playwright geral, HTTPS e IHFR no diff final; (6) auditoria de recursos, reconciliação documental, commits locais atômicos e veredito separado por dimensão. Marcar nova tarefa `[X]` somente com sua evidência executada.
- **Pontos de parada:** suspender somente a escrita afetada se alvo/propriedade/isolamento não forem comprovados, se migration tocar dados alheios, se a autoridade científica/produto for necessária ou se houver mudança concorrente em HEAD/lockfile. Continuar verificações independentes. Nenhuma conclusão de `PRONTA` será inferida de um subconjunto verde.
- **Validação prevista:** comandos, versões, hash do lockfile, snapshot, destino/schema, pass/fail/skip/retry, audit sanitizado, diff/links/segredos e preservação dos arquivos preexistentes. O ambiente PostgreSQL local marcado como pertencente ao projeto estava parado no preflight e foi iniciado para os ensaios; nenhum banco remoto recebeu escrita nesta abertura.
- **Limite de repetição definido antes dos gates finais:** uma repetição focal para diagnosticar uma primeira falha e, após correção demonstrada, uma repetição integral da suíte afetada. Cada primeira falha continua registrada; não haverá repetição indefinida até obter verde.
- **Histórico:** 2026-09-26 — plano aberto após baseline e leitura da especificação; checklist `requirements.md` integralmente marcado. O script bash de pré-requisitos do Spec Kit não é executável neste shell Windows sem Bash; branch, feature, plan, tasks e checklist foram verificados por comandos locais equivalentes. Encerramento e desvios serão acrescentados sem sobrescrever este registro.
- **Fechamento técnico de 2026-09-27:** `CONCLUIDO_COM_PENDENCIAS` para o saneamento implementável, com evidência no [relatório A1–A7](../../docs/validation/007-ihfr-evolution/2026-09-26-saneamento-a1-a7.md). Next 16.3.6, Playwright 1.55.1 e lockfile novo passaram instalação, typecheck, lint, build, unitários 223/223, migrations locais 26/26, contrato 2/2, integração 107/107, Playwright geral 55/55 e HTTPS 2/2. IHFR isolado passou 6/6 no PostgreSQL local; no E2E `6903ad2ff1ef`, contrato 2/2, migration 26/26, integração 107/107, IHFR isolado 6/6 e full UI 1/1 passaram, seguidos de auditoria somente leitura com zero schemas temporários gerenciados. O bootstrap vazio direto falhou P3018 como reproduzido; baseline formal em banco novo concluiu 8/8 e smoke com rollback. O cluster local foi parado com dados preservados; o banco descartável de bootstrap foi removido; o E2E ficou com dados de UI intencionalmente preservados. A3 segue com audit de produção exit 1 e 14 nós sinalizados, sem aceite de risco; A4 permanece externa para `568d60469278`. `PRONTIDAO_PARA_MERGE=NAO_PRONTA`; `PD-002`, `G2-SCI` e prova independente endpoint → `branch_id` continuam fora do fechamento técnico.

## Correção de integração observada em teste persistente — 2026-09-24

`FATO_DOCUMENTADO` — o log externo fornecido pela equipe relata `crypto.randomUUID is not a function` ao acessar a UI por HTTP da rede local e HTTP 500 na elegibilidade/criação IHFR após uma medição ambiental válida. O log contém dados de acesso ao ambiente de teste que não serão copiados para a evidência. `EVIDENCIA_IMPLEMENTACAO` — a investigação local confirmou três chamadas client-side diretas a `crypto.randomUUID()` e a divergência entre `EnvironmentalPayload.terrain` e a allowlist do evaluator; os fixtures IHFR omitiam os dois campos ambientais conhecidos.

**Ordem desta rodada**: preservar o baseline e os arquivos não rastreados → registrar testes RED para UUID ausente, payload completo e integração IMP-005 → IMP-006 → centralizar UUID v4 client-side com `getRandomValues` e alinhar a validação fechada do evaluator sem pontuar drenagem/elevação → tornar os fixtures completos → executar GREEN focal e E2E com `randomUUID` removido antes da hidratação → repetir gates aplicáveis, auditar schemas/fixtures/processos/triggers e diff → atualizar evidência/descrição e encerrar T116/T134 somente com resultados observados. Manifestos, hash ativo, fórmula, scores, classes, migrations e ciência ficam preservados.

## Rodada corretiva focal — 2026-09-23

`DECISAO_CONFIRMADA` — solicitação explícita da equipe nesta conversa: corrigir somente (1) autorização de leitura contextual e idempotente de GET operation, inclusive laboratório inativo e papel MEMBER do mesmo ator; (2) replay POST incompatível 422 sem nova escrita, com recuperação GET 200; (3) reconciliação de current/eligibility e foco programático da UI; (4) restauração exata das sete variáveis de processo pelo runner PowerShell; (5) precedência autorização/contexto antes da validação fechada do request de escrita. Não alterar matemática, manifestos, migrations ou ciência; preservar cluster PostgreSQL e alterações preexistentes.

**Execução**: T116/T134 reabertas → oráculos focais RED → correção de serviço/handlers/OpenAPI/UI/script → GREEN focal → `npm test`, contrato, E2E IHFR, regressões materiais, typecheck, lint, build e `git diff --check` → migration repetida pelo ajuste do runner PostgreSQL → auditoria de schemas/fixtures/processos/triggers → fingerprint e evidência atualizados → T116/T134 encerradas. Resultados observados em `implementation-evidence.md`.

## Execução crítica iniciada em 2026-09-23

**Estado**: `EM_ANDAMENTO`. O checkout atual está em `007-ihfr-evolution@97d95583fa62ed1f3dc88f7a7c69e150afddb968`, limpo e sem upstream configurado. Após `git fetch origin --prune`, `origin/006-ihfr-diagnosis` coincide com HEAD e `origin/development@100351e07d9f89f34ebb0ea4de17b526297d6350` é ancestral (0 atrás, 36 à frente). A identidade da feature decorre do conteúdo e da ancestralidade, não do nome da branch. O arquivo alheio `specs/005-environmental-collection-data/coverage-review.md` citado no runbook histórico não existe neste checkout. Nenhuma alteração preexistente foi encontrada.

**Ordem executável corrigida**: (1) auditoria A–H e segurança do banco; (2) oráculos de contrato, correção dos testes antigos e infraestrutura de schema/E2E que os gates usam; (3) autorização, elegibilidade e serviço transacional T083–T090; (4) handlers, DTO e UI T091–T098; (5) GREEN da US2 T099–T103; (6) contratos, migration e segurança T104–T113; (7) T060 e T114–T126 com fixture E2E persistente e limpeza em `finally`; (8) T127–T134 somente pelo aceite demonstrado. Antecipar a infraestrutura de T102/T060/T116 não marca essas tarefas como concluídas. Testes de serviço podem ser verificados antes do handler; API só é GREEN quando handler e serviço reais passam.

**Condição ambiental**: nenhum `DATABASE_URL`/`TEST_DATABASE_URL` nem binário PostgreSQL local foi encontrado no preflight. Banco e E2E permanecem sem prova até haver destino descartável autorizado e isolamento verificado nas conexões da aplicação. Nenhuma flag de confirmação será preenchida por inferência. O histórico abaixo e o runbook continuam como snapshots de suas datas.

## Summary

Produzir, tornar vigente, consultar, substituir e revogar um diagnóstico IHFR experimental a partir do conjunto `ihfr-measurement-v1` integrado e de um suplemento fechado `ihfr-diagnosis-input-experimental-v0.1.0`. O backend TypeScript carrega e valida o manifesto versionado, confirma seu hash canônico, executa um avaliador puro, persiste resultado/decomposição imutáveis e controla a vigência em uma camada separada, com autorização contextual, idempotência própria e auditoria restrita.

`DECISAO_EXPERIMENTAL_DE_ENGENHARIA`: a auditoria focal de 2026-09-19 confirmou no ADR-0001 §7 a taxonomia `FOREST=0.2`, `AGROFORESTRY=0.25`, `CROPLAND=0.6`, `PASTURE=0.65`, `DEGRADED_PASTURE=0.8`, `BARE_SOIL=0.95` e `URBAN=0.7`. Uso misto exige uma categoria predominante; valor não reconhecido é `INVALID_INPUT`; ausência ou predominância indeterminável é `INSUFFICIENT_DATA`. Não existe lacuna focal de domínio ou mapeamento para esta versão.

`RECOMENDACAO`: não evoluir o model legado `IHFRDiagnosis`. Criar modelagem experimental aditiva porque o legado não preserva suplemento, manifesto/hash, decomposição, proveniência, idempotência nem ciclo imutável e possui `algorithmVersion = "1.0.0"` e `explanationAI`, incompatíveis com o contrato atual.

## Technical Context

**Language/Version**: TypeScript `^5`, React `19.2.4`, Node compatível com Next.js `^16.1.6`; cálculo server-side em IEEE-754 binary64. Na rodada final, Node `24.19.0` foi fixado e exercitado com `npm ci`, unitários 220/220, typecheck, lint sem erros, build e suítes Neon verdes.

**Primary Dependencies (baseline histórico)**: Next.js `^16.1.6`, Prisma/client `^7.4.2`, adapter Neon `^7.7.0`, `node:crypto`; nenhuma dependência, Python, FastAPI, IA ou serviço externo novo. O saneamento atual alinhou a família Prisma em `7.4.2` exata, inclusive `@prisma/adapter-neon`; Client regenerado e gates Prisma/PostgreSQL/Neon passaram.

**Storage**: PostgreSQL via Prisma; novas relações aditivas para suplemento, resultado experimental, ponteiro vigente, operação idempotente e eventos de ciclo/auditoria. O manifesto continua versionado no repositório, não editável pelo banco.

**Testing**: `node:test` com `tsx`, testes de contrato OpenAPI, integração e migration em PostgreSQL isolado, Playwright E2E, além de `lint`, `typecheck` e `build` existentes.

**Target Platform**: monólito web Next.js, execução server-side e navegador moderno; sem operação autônoma ou offline neste recorte.

**Project Type**: aplicação web full-stack com App Router e route handlers contextuais.

**Performance Goals**: sem meta de latência ou volume autorizada. Uma operação lê um conjunto ambiental, um suplemento e um manifesto pequeno; serialização é por coleta e a resposta não executa consulta histórica geral.

**Constraints**: exatamente um `CURRENT` por coleta; entradas/resultados imutáveis; laboratório inativo somente leitura; OWNER/ADMIN escrevem e MEMBER consulta; versões explicitamente compatíveis; opcional conhecido ausente/`null` permitido é excluído, entrada desconhecida/alias/caixa/`OTHER(S)` é `INVALID_INPUT`, `null` nunca vira zero; sem arredondamento intermediário; DTO mínimo e `Cache-Control: no-store`.

**Scale/Scope**: elegibilidade, cálculo/criação ou substituição, consulta do vigente, detalhe contextual, revogação e recuperação por chave. Dashboard, lista histórica pública, mapa, gráficos, recomendações, validação científica definitiva e manutenção da IMP-005/007 ficam fora.

## Constitution Check

Gate avaliado antes da Phase 0 e novamente após o design.

| Princípio | Antes da Phase 0 | Após Phase 1 |
|---|---|---|
| I — Hierarquia de fontes | PASS — ADR-0001, manifesto, spec/checklist e contratos integrados da IMP-005 governam seus assuntos; código comprova somente baseline. | PASS — o desenho não reabre os 15 conflitos nem promove histórico ou legado a contrato atual. |
| II — Entregas verticais | PASS — uma jornada contextual produz e consulta o diagnóstico experimental. | PASS — dashboard/histórico e ciência definitiva continuam fora; reconciliação com IMP-007 não bloqueia o núcleo. |
| III — Especificação por funcionalidade | PASS — branch e diretório `specs/006-ihfr-diagnosis/**` confirmados pelo setup. | PASS — plano, pesquisa, modelo, contratos, quickstart e tarefas `T001–T134` remediadas estão no diretório da feature. |
| IV — Evidência e rastreabilidade | PASS — decisão, implementação, inferência e recomendação permanecem separadas. | PASS — cada resultado conserva quatro versões/referências, hash, origem, transformação e rótulos experimentais. |
| V — Qualidade e segurança | PASS — riscos centrais são isolamento, autorização, precisão, imutabilidade, concorrência e minimização. | PASS — API contextual, DTO fechado, transações, constraints, auditoria restrita e matriz de testes cobrem os riscos. |
| VI — Documentação evolutiva | PASS — `docs/raw/**` permanece imutável e G2-SCI explícito. | PASS — alteração normativa exige nova versão/hash e nunca reinterpreta resultado histórico. |
| VII — Trabalho em equipe | PASS — branch correta, limpa no início e sincronizada com sua upstream; IMP-007 verificada mecanicamente. | PASS — `origin/development` foi incorporada por merge normal sem conflito; mudanças planejadas ficam concentradas na feature. |

**Gate constitucional: APROVADO.** Não há violação a justificar nem `NEEDS CLARIFICATION` remanescente.

## Project Structure

### Documentation (this feature)

```text
specs/006-ihfr-diagnosis/
├── spec.md
├── checklists/requirements.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── tasks.md
├── pr-description.md
└── contracts/
    ├── ihfr-math-experimental-v0.1.0.json
    ├── ihfr-math-experimental-v0.1.1.json
    ├── ihfr-diagnosis-input-experimental-v0.1.0.schema.json
    └── ihfr-diagnosis-api.openapi.yaml
```

`.specify/feature.json` aponta localmente para esta feature e é ignorado pelo Git. O recorte original de `tasks.md` era T001–T134; a continuidade autorizada T135–T143 elevou o inventário atual a 143 tarefas, sem renumeração. `pr-description.md` prepara somente o texto de um PR futuro.

### Source Code (repository root)

Estrutura planejada no momento da elaboração do plano; schema, migration, rotas, componentes de leitura e testes focais já foram criados até T082, conforme `implementation-evidence.md`. O bloco abaixo registra a estrutura alvo e não o inventário atual:

```text
prisma/schema.prisma
prisma/migrations/20260920000100_ihfr_experimental_diagnosis/migration.sql
src/app/api/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/ihfr-diagnosis/
├── eligibility/route.ts
├── current/route.ts
├── diagnoses/route.ts
├── diagnoses/[diagnosisId]/route.ts
├── diagnoses/[diagnosisId]/revocations/route.ts
└── operations/[idempotencyKey]/route.ts
src/app/api/server/ihfr-diagnosis/{ihfr-diagnosis.contracts,ihfr-diagnosis.http,manifest-loader,evaluator}.ts
src/app/api/server/services/ihfr-diagnosis.service.ts
src/types/ihfr-diagnosis.type.ts
tests/{fixtures,unit,integration,migration,e2e}/
```

**Structure Decision**: preservar o monólito e as camadas integradas. O avaliador e o carregador de manifesto não conhecem Prisma, sessão ou relógio. O serviço resolve autorização, versões, transação, idempotência e projeções. Handlers são finos e todas as rotas carregam laboratório, área e coleta.

## Baseline and Git Evidence

- Estado inicial: branch `006-ihfr-diagnosis`, HEAD local/remoto `48c93121433932edbfb0496bbaa853497610e67d`, divergência `0/0`, working tree limpa.
- IMP-005: head `e775ebcdc1112c0d18117e4023a578a4ef62cf1c`, integrada pelo PR #25 no merge `5d9ca6f8f848867e8152bc25e86abc9a6e73358f` e já incorporada anteriormente à IMP-006 por `62b54fa8d98b2bce2c03d7b6e2181ed4c94ab07d`.
- IMP-007: head publicado `9e3a818be1690298e70586ac640151fecba02b82`, ancestral de `origin/development` `10fdb8bbb8e4895614575fedc9de8e08a5121afe`.
- Integração IMP-007: merge commit do PR #26 `10fdb8b`, pais `5d9ca6f` e `9e3a818`; merge normal, sem squash.
- Baseline deste plano: merge normal de `origin/development` na IMP-006, commit `36243f4`, sem conflito e preservando os commits próprios.
- IMP-008: head `c6c13f7dc97d4ed873f67cb99fb6c36d60579601`, integrada pelo PR #27 no merge `df856194b3341137d6d863feefcb0a203deb5905`.
- Baseline reconciliada atual: merge normal `96dac7c` de `origin/development@df85619` na IMP-006, com dois conflitos exclusivamente documentais em `TECH_DECISIONS.md` e `docs/governance/PENDING_DECISIONS.md`; a resolução preservou integralmente TD-009/TD-012/TD-015/TD-016 e a confirmação de TD-010. `origin/development` tornou-se ancestral do HEAD.
- Estado inicial desta remediação: HEAD local/remoto `66e22f486bec9ab5417c287a2379d0da631e61ae`, divergência `0/0`, working tree limpa; `origin/development@df856194b3341137d6d863feefcb0a203deb5905` e o head IMP-008 `c6c13f7dc97d4ed873f67cb99fb6c36d60579601` são ancestrais.

### Fronteira com a IMP-007 integrada

`EVIDENCIA_IMPLEMENTACAO`: a IMP-007 expõe somente resumo e itens derivados `AREA_CREATED`/`COLLECTION_CONFIRMED`, com destinos contextuais e allowlist sem PII, payload ambiental ou diagnóstico. Não cria tabela/fonte de atividade e não constitui auditoria.

A IMP-006 não modifica a IMP-007. `CREATED`, `SUPERSEDED` e `REVOKED` ficam em eventos internos restritos; nenhuma lista histórica pública é criada agora. Uma projeção futura para dashboard deve derivar dos registros canônicos da IMP-006, jamais copiar auditoria ou criar segunda fonte de verdade.

### Fronteira com a IMP-008 integrada

`EVIDENCIA_IMPLEMENTACAO`: a IMP-008 expõe um mapa Leaflet/React-Leaflet e uma lista textual sobre `CollectionArea` e coletas confirmadas, por endpoint contextual privado e projeção transitória. Ela não altera schema, migrations, dependências, `EnvironmentalMeasurementSet`, contratos da IMP-005, permissões contextuais ou a semântica de laboratório inativo.

A IMP-006 não modifica o mapa nem projeta diagnóstico nesta entrega. Leaflet não calcula IHFR; coordenadas, pontos territoriais e `CollectionArea.landType` não substituem `landUseType` nem medições ausentes. Eventos e evidência restrita do diagnóstico não alimentam a API territorial. Qualquer score, classe, risco, cor, gráfico ou camada IHFR exige requisito, contrato de projeção, minimização e reconciliação futuros. Plotly continua posterior à IMP-009 e fora da v0.1.

## Phase 0 — Research Outcome

[research.md](research.md) resolve taxonomia, avaliador, manifesto/hash, persistência, estados, idempotência, autorização, API, auditoria e fronteiras com as IMP-007/008. Não restou `NEEDS CLARIFICATION`.

## Phase 1 — Design

### 1. Entrada suplementar

O contrato [ihfr-diagnosis-input-experimental-v0.1.0.schema.json](contracts/ihfr-diagnosis-input-experimental-v0.1.0.schema.json) descreve o suplemento confirmado fechado e contém `inputContractVersion`, `landUseType` e `provenance`. A fronteira HTTP aceita um candidato ainda sem `landUseType` somente para produzir `INSUFFICIENT_DATA`; ele não satisfaz o schema nem é persistido. IDs contextuais e autoria vêm do servidor. O suplemento válido é criado ou reutilizado atomicamente com um diagnóstico bem-sucedido e nasce imutável, pertencente a `CollectionData` e referenciando `EnvironmentalMeasurementSet`. A deduplicação é `UNIQUE(collectionDataId, payloadHash)`; um suplemento pode alimentar N diagnósticos compatíveis, sem `UNIQUE(inputSupplementId)`. Nova observação cria novo suplemento; nova versão matemática compatível pode reutilizar o existente. Requests insuficientes/incompatíveis podem ter operação terminal recuperável, mas não fabricam suplemento confirmado nem diagnóstico. Legado não recebe backfill.

### 2. Manifesto e avaliador

O carregador lê o JSON empacotado server-side, valida forma/versão, remove somente `contractHash`, canonicaliza objetos por chaves lexicográficas recursivas preservando arrays e calcula SHA-256 UTF-8. Para novos diagnósticos, o valor deve ser exatamente `sha256:f8104143f1505aceaa68a7ffa06fac50f4906cdfc4119609875d99c9fecc6f89` da versão `ihfr-math-experimental-v0.1.1`; divergência impede ativação. A v0.1.0 e seu hash ficam preservados somente para reprodutibilidade histórica.

`evaluate(input, manifest)` é puro: não usa banco, sessão, relógio ou rede. Aceita somente as quatro versões explicitadas e preserva valores brutos e cada transformação. Opcional conhecido ausente, `null` permitido ou não aplicável é excluído da média; campo/enum desconhecido, alias, caixa divergente e `OTHER(S)` retornam `INVALID_INPUT` e nunca são ignorados. `terrain.slopePercent = null` produz `INSUFFICIENT_DATA`; acima de 45 permanece intacto na origem e aparece na decomposição com `raw`, `normalizedInput=45`, fórmula, score e `clamped=true`.

### 3. Persistência e ciclo

[data-model.md](data-model.md) separa suplemento/resultado imutáveis, ponteiro vigente único por coleta, eventos append-only e operação idempotente. Substituição insere novos snapshots/eventos e troca o ponteiro na mesma transação serializável, exigindo `expectedCurrentDiagnosisId`. Revogação insere evento, remove o ponteiro e preserva o resultado. Constraints, FK `RESTRICT` e triggers protegem snapshots.

### 4. Estados e precedência

| Situação | Estado/erro externo | Persistência |
|---|---|---|
| Dados suficientes e operação válida | `CURRENT` | resultado, suplemento, ponteiro e evento |
| Resultado anterior substituído | `SUPERSEDED` derivado | resultado preservado; evento e novo ponteiro |
| Resultado revogado | `REVOKED` derivado | resultado preservado; evento e ponteiro removido |
| Entrada/dimensão ausente | `INSUFFICIENT_DATA` | operação terminal; nenhum diagnóstico vigente |
| Versão/hash não suportado | `INCOMPATIBLE_VERSION` | operação terminal; nenhum snapshot de domínio |
| Mesma chave e request diferente | `IDEMPOTENCY_CONFLICT` | nenhuma alteração |
| Corrida perdeu estado esperado | `STATE_CONFLICT` | rollback integral |
| Falha inesperada | `TECHNICAL_FAILURE` | rollback integral; resposta sanitizada |

Precedência: autenticar/autorizar → validar contexto/estado → resolver replay/conflito → bloquear coleta e revalidar estado esperado → verificar versões/hash → avaliar → persistir atomicamente. Replay só é projetado após reautorizar o contexto atual.

### 5. API, segurança e privacidade

[ihfr-diagnosis-api.openapi.yaml](contracts/ihfr-diagnosis-api.openapi.yaml) define seis operações HTTP e sete comportamentos funcionais: elegibilidade, vigente, detalhe, revogação, recuperação e o POST compartilhado para CREATE/REPLACE discriminado por `mode`. CREATE admite `expectedCurrentDiagnosisId` ausente ou `null`; REPLACE exige UUID. Elegibilidade malformada ou com categoria inválida retorna `400 INVALID_INPUT`; ausência válida ou predominância indeterminável retorna outcome `INSUFFICIENT_DATA`. `PublicDiagnosis.areaId` é obrigatório e derivado no servidor. Não há listagem completa. Todas as respostas usam `Cache-Control: no-store` e DTOs fechados.

O servidor exige conta ativa e vínculo atual, resolve laboratório → área → coleta → conjunto/suplemento/diagnóstico e retorna `404` indistinguível. OWNER/ADMIN escrevem em laboratório ativo; MEMBER consulta; laboratório inativo mantém leitura; vínculo revogado elimina acesso. Ator, chave, request hash, payload completo e evidência restrita não entram no DTO normal.

### 6. Testes

[quickstart.md](quickstart.md) cobre vetores técnicos, limites/classes/precisão/`clamp`, manifesto/hash/compatibilidade, parser fechado/null/legado, autorização/isolamento/inatividade, idempotência/timeout/concorrência, substituição/revogação, migration/OpenAPI/integração/E2E e regressões das IMP-003/004/005/007/008. PostgreSQL usa schema isolado por execução, fixtures explícitas e teardown obrigatório em finalização, sem desabilitar triggers. Vetores científicos permanecem pendentes.

### 6.1 Ordem executável obrigatória

1. setup e guards; caracterização da baseline integrada;
2. preflight de banco/legado e reserva do caminho `prisma/migrations/20260920000100_ihfr_experimental_diagnosis/migration.sql`;
3. design Prisma, criação da migration, `prisma format`, inspeção, `prisma validate`, aplicação em banco isolado e `prisma generate`;
4. fixtures/lifecycle de schema e então shells compiláveis;
5. testes comportamentais realmente RED, implementação, unitários verdes, integração PostgreSQL verde e E2E;
6. regressões, incluindo a IMP-008 territorial, antes do teardown global;
7. teardown verificável, evidências, validações humanas registradas, PR e encerramento final.

Rollback transacional da operação, limpeza de fixture entre cenários, rollback da migration em schema descartável, descarte do schema da execução e recuperação operacional de produção são procedimentos distintos. O teardown deve ocorrer mesmo após falha e verificar ausência de schemas, registros órfãos e processos remanescentes.

### 7. Requirement coverage

| Requisitos | Cobertura principal |
|---|---|
| FR-001–FR-002 | autorização contextual, capacidades de leitura/escrita e resolução integral da cadeia na API/serviço |
| FR-003–FR-006 | carregador/hash, matriz de compatibilidade, snapshot com versões separadas e DTO público |
| FR-007–FR-010 | estados distintos, laboratório inativo, 404 indistinguível, auditoria separada e legado isolado |
| FR-011–FR-012 | transação atômica, modelos imutáveis, suplemento 1:N deduplicado, distinção entre ausência conhecida e entrada desconhecida, insuficiência por slope/land use |
| FR-013–FR-014 | ponteiro único, eventos de ciclo, expected current, ledger idempotente e recuperação |
| FR-015–FR-016 | avaliador puro TypeScript, quatro dimensões, clamp, precisão e apresentação |
| FR-017 | evento/evidência restritos, autoria interna e minimização do DTO |
| FR-018 | limites explícitos e não alteração das IMP-005/007/008 |
| FR-019 | OpenAPI com seis operações/sete comportamentos, discriminador `mode`, condicionais CREATE/REPLACE e `400 INVALID_INPUT` para input estruturalmente inválido |
| FR-020 | schema PostgreSQL isolado, fixtures completas, triggers ativos e teardown verificável |

Os cenários SC-001–SC-008 são materializados na matriz de unitários, integração, migration e E2E do quickstart. A cobertura é planejada; não afirma que a IMP-006 já esteja implementada.

## Gates

| Gate | Estado após o plano | Condição posterior |
|---|---|---|
| G1 — dados ambientais | **FECHADO** pela IMP-005 integrada | Preservar contrato e regressões |
| G2-ENG — contrato experimental | **RESOLVIDO PARA PLANEJAMENTO** | Implementar suplemento, manifesto/hash e avaliador exatamente como desenhados |
| G2-ENG — `landUseType` | **RESOLVIDO_E_RASTREAVEL_PARA_V0_1_EXPERIMENTAL** | Implementar as regras focais do ADR-0001 §7 sem ampliar enum ou aliases |
| G2-SCI — validação definitiva | **NAO_VERIFICADO_VALIDACAO_POSTERIOR** | Revisão, calibração, vetores científicos e campo; não bloqueia a v0.1 rotulada |
| G3-ENG — ciclo operacional | **RESOLVIDO DOCUMENTALMENTE PARA PLANEJAMENTO** | Implementar/testar autorização, transações, ciclo e auditoria |
| IMP-007 | **INTEGRADA E RECONCILIADA NO BASELINE** | Não alterar agora; extensão futura deriva da fonte canônica da IMP-006 |
| IMP-008 | **INTEGRADA E RECONCILIADA NO BASELINE** | Preservar mapa/lista sem camada IHFR; executar caracterização e regressão territorial antes de teardown/evidências; qualquer projeção diagnóstica permanece futura |

No encerramento da remediação documental de 2026-09-20, o plano e as tarefas `T001–T134` estavam preparados para análise independente; essa análise não foi executada naquela remediação. A execução posterior avançou parcialmente até T082, sem encerrar T060 nem T083–T134. A decisão experimental de `landUseType` não possui pendência focal de engenharia; a validação científica continua futura.

## Risks and Mitigations

| Risco | Mitigação |
|---|---|
| Legado parecer contrato atual | Models experimentais novos; nenhum backfill ou leitura do `IHFRDiagnosis` legado |
| Alteração silenciosa do manifesto | canonicalização independente, hash fixo e ativação fail-closed |
| Dois vigentes | ponteiro `UNIQUE(collectionDataId)`, lock da coleta e transação serializável |
| Suplemento bloqueado por cardinalidade errada | `UNIQUE(collectionDataId,payloadHash)` no suplemento e FK não única no diagnóstico; testes de reuso compatível |
| Resultado mutável para refletir ciclo | snapshot imutável; estado derivado de ponteiro + eventos |
| Replay vazar dado após perda de acesso | autorização contextual antes de qualquer projeção recuperada |
| Auditoria virar histórico público | eventos restritos sem endpoint normal; futura IMP-007 usa projeção mínima |
| Score apresentado alterar classe | classe sobre score bruto; half-up apenas na apresentação |
| G2-SCI confundido com testes verdes | quatro rótulos obrigatórios e separação de vetores técnicos/científicos |
| Vazamento de banco após falha de teste | schema por execução, finalização obrigatória e asserções de zero órfãos/processos |

## Complexity Tracking

Nenhuma violação constitucional. Separar snapshot, ponteiro, operação e evento é necessário para satisfazer imutabilidade, um único vigente, replay, concorrência e auditoria; o legado ou um JSON único não oferecem essas garantias.

## Atualização da execução de 2026-09-23

O plano acima registra a intenção histórica. O estado observado da implementação e os comandos executados estão em [implementation-evidence.md](implementation-evidence.md), com aceites por ID em [tasks.md](tasks.md). A infraestrutura foi antecipada conforme a ordem material: cluster PostgreSQL local próprio, schema isolado visível tanto pelo harness quanto por Prisma/Next, oráculos OpenAPI 3.1, serviço, handlers, UI, regressões e teardown. A migration e os manifestos publicados foram preservados.

O cluster local permanece instalado e ativo a pedido do usuário, com comando de descarte futuro em `scripts/imp006-local-postgresql.ps1 -Action Dispose`; o comando não foi executado. Schemas, fixtures e processos transitórios são removidos por rodada. Não foi usado Python nem um ambiente base/default.

`DECISAO_CONFIRMADA` — `PD-018`, confirmação explícita da equipe nesta conversa em 2026-09-23: o parser e o schema de entrada de `VersionSelection` validam somente a estrutura das três versões e do `contractHash`; formato, tipo, campo obrigatório ou propriedade extra inválidos geram `400 INVALID_INPUT`. Uma seleção bem formada que não corresponda à combinação ativa/suportada gera `422 INCOMPATIBLE_VERSION`, como já ocorre para a versão incompatível da medição persistida. Dentro da transação, depois de autorização, replay e verificação do estado vigente, a incompatibilidade registra um terminal idempotente no ledger, sem suplemento confirmado, diagnóstico, `CURRENT` ou evento de ciclo; repetição idêntica não escreve, e GET operation recupera `200 OperationResponse` com `outcome = INCOMPATIBLE_VERSION`. A saída de diagnóstico produzido sob a versão ativa mantém valores exatos no OpenAPI. T134 foi encerrada após a repetição dos gates afetados e a auditoria final documentadas em `implementation-evidence.md`. `G2-SCI` continua `NAO_VERIFICADO_VALIDACAO_POSTERIOR` e impede apenas a promoção científica definitiva.
# Continuidade corretiva da 007-ihfr-evolution (2026-09-25)

Estado: `EM_ANDAMENTO`. Autoridade: solicitação desta rodada, FR-005/FR-012/SC-001/SC-007 da spec e ADR-0001; os relatórios em `docs/validation/007-ihfr-evolution/` são evidência histórica. Baseline: branch `007-ihfr-evolution`, HEAD `2c63c6749f43542cce4dafbdc452be773fee85fe`, sem diff rastreado; preservar os não rastreados `docs/validation/007-ihfr-evolution.zip` e `imp006-final-*`. Não alterar manifesto, fórmula, migrations publicadas ou `docs/raw/**`.

| Campo | Captura | Diagnóstico | Ausente/`undefined` | `null` | Zero/`false` | Inválido/extra |
|---|---|---|---|---|---|---|
| `water.waterSourceType`, `water.hasSpring`, `water.waterAvailability` | obrigatório | obrigatório pontuado | insuficiente no avaliador | inválido | valor presente quando no domínio | `INVALID_INPUT` |
| `soil.soilTexture`, `soil.infiltrationRateMmPerHour`, `soil.compactionLevel`, `soil.erosionSigns` | obrigatório | obrigatório pontuado | insuficiente no avaliador | inválido | valor presente quando no domínio | `INVALID_INPUT` |
| `vegetation.vegetationCoverPercent`, `vegetation.fragmentationLevel`, `vegetation.landscapeDegradation` | obrigatório | obrigatório pontuado | insuficiente no avaliador | inválido | valor presente quando no domínio | `INVALID_INPUT` |
| `terrain.slopePercent` | opcional | obrigatório pontuado | insuficiente | insuficiente | valor presente | `INVALID_INPUT` |
| `supplement.landUseType` | fora da captura | obrigatório pontuado | insuficiente | insuficiente | não aplicável | `INVALID_INPUT` |
| `water.wellDepthMeters`, `water.salinityIndicator`, `soil.soilExposedPercent`, `vegetation.hasRiparianApp` | opcional | opcional pontuado | excluído da média | excluído da média | valor presente quando no domínio | `INVALID_INPUT` |
| `terrain.drainageDensityKmPerKm2`, `terrain.elevationMeters` | opcional | conhecido não pontuado | aceito | aceito | validado, sem score | `INVALID_INPUT` |

Seção/grupo ambiental ausente significa campos obrigatórios ausentes. O produtor de captura pode rejeitar ausências; o avaliador deve devolver `INSUFFICIENT_DATA` para ausências obrigatórias e manter rejeição fechada para valores inválidos. Nenhum campo de área substitui `landUseType`.

Ordem: reconciliar fontes/HEAD e obter RED sem banco; corrigir F-001/F-002/F-007; endurecer seleção/preflight/cleanup F-004/F-008/F-009; validar cliente Prisma F-003; repetir preflight read-only e somente então executar banco/navegador F-005/F-006; registrar resultados e pendências em evidências e validação. Um bloqueio externo afeta só os gates dependentes. Histórico anterior de T001–T134 permanece inalterado; T134 é fechamento da rodada anterior e as novas tarefas retomam a implementação.

Checkpoint de 2026-09-25: T135/T136/T138 concluídas com RED/GREEN, Client regenerado e consulta normal verificada em navegador local a 390 × 844 após reload. No PostgreSQL local próprio, integração 107/107, contrato 2/2, migrations 23/23 e E2E IHFR 6/6 passaram; auditoria encontrou zero schemas candidatos e os processos próprios foram encerrados. O harness `PrismaPg` passou a selecionar UTC após reprodução de desvio temporal local. T137/T139/T140/T141 permanecem abertas para adapter Neon, identidade/auditoria remota, percurso integral de UI e encerramento condicionado; a configuração E2E e a conta sintética não estão presentes neste workspace. Nenhuma escrita remota foi iniciada. O plano continua `EM_ANDAMENTO` apenas para essas dependências externas.

### Fechamento focal da revisão da 007 — 2026-09-25

`EVIDENCIA_IMPLEMENTACAO`: em T142, o avaliador passou a exigir `boolean` real para `water.hasSpring` e `vegetation.hasRiparianApp`, sem alterar manifesto ou cálculo. O teste E2E integral fornece novamente `observedAt` após reload e reabertura e usa um oráculo literal para W/S/V/T, score bruto e exibido, classe, qualidade, drivers e identidade do diagnóstico em CREATE, reload, histórico, REPLACE e REVOKE. O teste não chama o avaliador para gerar expectativas.

`EVIDENCIA_IMPLEMENTACAO`: RED/GREEN focal, unitários completos, typecheck, lint, build, contrato, integração, migration e E2E IHFR local passaram. A descoberta Playwright do percurso full UI passou, mas esse percurso e os gates Neon seguem `NAO_EXECUTADO` por ausência da configuração e da conta sintética. T137/T139/T140/T141 e G2-SCI conservam seus estados anteriores; o resultado técnico local não aprova a v0.1 cientificamente.

## Rodada final de saneamento da continuidade 007 — 2026-09-26

**Identificador e estado**: R-001–R-011 da [reanálise histórica](../../docs/validation/007-ihfr-evolution/2026-09-25-reanalise-pendencias-prisma.md), reconciliados com HEAD e com a [execução Neon posterior](../../docs/validation/007-ihfr-evolution/validation-report.md). Estado `EM_ANDAMENTO` até T139/T141 cumprirem seus critérios; a reanálise não reabre automaticamente achados já superados por evidência posterior.

**Objetivo e resultado esperado**: deixar a continuidade 007 tecnicamente coerente e auditável: defeitos reproduzidos corrigidos, gates no diff final, zero schemas `imp006_test_*` residuais comprovado por auditoria somente leitura, tarefas e matriz R-001–R-011 reconciliadas. `G2-SCI`, `PD-002` e validações humanas ficam explicitamente externas, sem promoção científica do contrato.

**Escopo e limites**: investigar integridade cruzada operação/CURRENT/eventos (R-006) em PostgreSQL descartável e só criar migration aditiva se o banco aceitar estado que viole FR-011/FR-017; implementar auditoria `list`/`assert-zero` (R-007); remover exclusivamente o schema residual nomeado na autorização atual, condicionado a destino E2E, nome, marcador, onze tabelas vazias e proteção de `public`; reconciliar Spec Kit (R-008), runtime Node (R-009) e dívidas de dependências/fontes (R-002/R-010). Não alterar manifestos científicos, hashes, fórmula, `docs/raw/**`, a migration publicada `20260920000100_ihfr_experimental_diagnosis` ou a branch base. A migration aditiva foi aplicada somente no E2E autorizado; não executar deploy da aplicação, nem migration em DEV/produção, push, merge ou rebase.

**Fontes e autoridade**: solicitação atual da equipe e `AGENTS.md` governam o recorte; [spec.md](spec.md), [ADR-0001](../../docs/governance/ADR-0001-contrato-experimental-ihfr-v0-1.md) e políticas de fonte governam intenção experimental; código, schema, migration, testes e execução Neon demonstram apenas implementação. A reanálise de 2026-09-25 é evidência de HEAD anterior, não status atual. Toda inferência/recomendação mantém rótulo próprio, e prova independente endpoint → `branch_id` continua validação externa se a Console/API não estiver autenticada.

**Baseline preservado**: branch `007-ihfr-evolution`, HEAD inicial `e491cb2278d3d098928abc2fb4c08276ff43ccda`, diff rastreado vazio. Os não rastreados preexistentes `imp006-final-stat.txt`, `imp006-final-status.txt` e `imp006-final.diff`, além de `.env.e2e.local` ignorado, ficam fora dos commits. O cenário full UI já comprovado permanece em `public` da branch Neon E2E para revisão; nenhuma limpeza de `public` é autorizada.

**Dependências e ordem**:

1. Reconciliar R-001–R-011 com HEAD e evidência Neon posterior; registrar condições realmente abertas. T137 e T140 já têm prova Neon, e T143 registra o setup executado.
2. Exercitar casos negativos R-006 em schema descartável; se reproduzidos, corrigir com migration nova mínima e repetir testes afetados, inclusive full UI quando o fluxo puder ter mudado.
3. Separar auditoria read-only em `list` e `assert-zero`, testar saída/código e executar limpeza somente do schema autorizado após verificar todas as guardas. Repetir ambas as auditorias e exigir zero candidatos antes de fechar T139.
4. Resolver estratégia de runtime Node e classificar R-002/R-010 por risco real; atualizar documentação executável sem inferir validação científica ou prova de `branch_id`.
5. Repetir `prisma validate`, `prisma generate`, `npm run test:unit`, `npm run typecheck`, `npm run lint`, `npm run build`, contrato, migration, integração, E2E IHFR e, se afetado, full UI no destino E2E autorizado. Fazer auditoria `assert-zero`, revisar diff, links, segredos, escopo e processos; fechar T141 só após resultados observados.

**Estratégia técnica executada e verificada**: `prisma`, `@prisma/client`, `@prisma/adapter-pg` e `@prisma/adapter-neon` foram alinhados em `7.4.2` exata; Node foi fixado em `24.19.0`, `engines >=24.19.0 <25` e `@types/node 24.19.0`. `npm ci`, Client regenerado e suítes Prisma/PostgreSQL/Neon passaram, sem migração para Prisma 8. R-002/R-009 estão `FIXED_AND_VERIFIED`. R-010 fica classificado `TECHNICAL_DEBT_ACCEPTED`: Poppins via `next/font/google` requer rede para build, e não há asset local aprovado para substituição; esse limite operacional não altera a ciência nem bloqueia a 007.

**Responsáveis e pontos de revisão**: engenharia da rodada executa e registra os gates; responsável por prova independente da Neon Console/API e autoridade científica: não especificado. Uma guarda de banco divergente impede apenas a remoção afetada. Mudança científica, fonte conflitante sem autoridade ou alteração material de escopo exige revisão competente antes da parte dependente; etapas independentes prosseguem. O schema residual não será removido se qualquer guarda falhar.

**Evidência e histórico de estado**: em 2026-09-25, Neon passou contrato 2/2, integração 107/107, migrations 23/23, E2E IHFR 6/6 e full UI 1/1; unitários 218/218, typecheck, lint sem erros e build passaram. Naquela rodada a auditoria listou um candidato, de modo que `assert-zero` ainda não tinha prova. Em 2026-09-26, a reconciliação mantém T139/T141 abertas até auditoria e gates finais, preservando o fechamento histórico T001–T134. Resultados novos, desvios e decisão de encerramento serão registrados em [implementation-evidence.md](implementation-evidence.md), [tasks.md](tasks.md) e no relatório de validação da 007.

**Checkpoint de 2026-09-26**: a remoção do único schema residual passou após guardas exatas e a auditoria read-only posterior retornou `list=0` e `assert-zero=PASS` no E2E autorizado. `npm ci`, `prisma generate` e `npm ls` passaram em Node `24.19.0` com Prisma `7.4.2` alinhado. R-006 foi reproduzido por RED 12/12 inconsistências aceitas; a migration aditiva `20260926000100_ihfr_lifecycle_reference_integrity` rejeitou 15/15 casos negativos, com migration local 26/26 e integração local 107/107. Inspeção read-only dos dados E2E, deploy versionado e gates Neon após essa migration continuam pendentes neste checkpoint. T139/T141 seguem abertas até a revisão final integrada; a prova independente de `branch_id` e a validação científica permanecem externas.

**Checkpoint Neon pós-migration**: quatro consultas somente leitura pré-deploy retornaram zero inconsistências; a migration nova foi aplicada em `public` do E2E autorizado e `prisma migrate status` confirmou banco atualizado. Contrato 2/2, migration 26/26 e integração 107/107 passaram no Neon; unitários 220/220, `prisma validate`, `prisma generate`, typecheck, lint zero erros/quatro avisos e build passaram. E2E IHFR, full UI e auditoria final após todos os gates ainda estão em andamento. A marcação de T139/T141 e o estado `CONCLUIDO` continuam condicionados a esses resultados e à revisão final do diff.

**Checkpoint dos gates finais Neon**: E2E IHFR 6/6, full UI 1/1 em novo run ID `HF007-UI-c7c839d4168f4188`, auditoria pós-gates `list=0` e `assert-zero=PASS` com exit 0. Consulta read-only confirmou dois diagnósticos, três operações, quatro eventos e nenhum CURRENT após REVOKE; o preflight recusou reuso do run ID antes de iniciar servidor. T139 foi concluída, com prova independente de `branch_id` classificada como `EXTERNAL_VALIDATION`. T141 e o estado `CONCLUIDO` aguardam somente inspeção final do diff/segredos/commits e registro de fechamento; ciência permanece pendente.

**Encerramento técnico da rodada**: quatro commits locais de runtime, integridade, auditoria e testes (`6e45be8`, `4438a91`, `2feff47`, `d2c71df`) tiveram diff staged inspecionado antes de cada commit, `git diff --check` e varredura de segredos limpos. A documentação da feature passou em contagem mecânica de 143 IDs únicos, links relativos, diff check e revisão de segredos; o arquivo `.env.e2e.local` permanece ignorado. T139/T141 estão `[X]`, a matriz R-001–R-011 e os gates constam no [relatório de validação](../../docs/validation/007-ihfr-evolution/validation-report.md), e a engenharia da continuidade está `CONCLUIDO`. O commit documental será realizado somente depois de inspecionar seu staging; não houve push, merge ou rebase. `G2-SCI`, `PD-002`, revisão humana e prova independente endpoint → `branch_id` seguem externos, sem impedir o encerramento técnico experimental.
