# Implementation Plan: Diagnóstico IHFR experimental

**Branch**: `006-ihfr-diagnosis` | **Date**: 2026-09-20 | **Spec**: [spec.md](spec.md)

**Input**: `specs/006-ihfr-diagnosis/spec.md`

**Status**: planejamento técnico remediado para a v0.1 experimental e reconciliado com a IMP-008 integrada pelo PR #27. `G1`, `G2-ENG` e `G3-ENG` estão resolvidos para planejamento; `G2-SCI` permanece futuro e não é simulado por testes técnicos. Execução parcial até T082; T060 e T083–T134 permanecem pendentes.

## Summary

Produzir, tornar vigente, consultar, substituir e revogar um diagnóstico IHFR experimental a partir do conjunto `ihfr-measurement-v1` integrado e de um suplemento fechado `ihfr-diagnosis-input-experimental-v0.1.0`. O backend TypeScript carrega e valida o manifesto versionado, confirma seu hash canônico, executa um avaliador puro, persiste resultado/decomposição imutáveis e controla a vigência em uma camada separada, com autorização contextual, idempotência própria e auditoria restrita.

`DECISAO_EXPERIMENTAL_DE_ENGENHARIA`: a auditoria focal de 2026-09-19 confirmou no ADR-0001 §7 a taxonomia `FOREST=0.2`, `AGROFORESTRY=0.25`, `CROPLAND=0.6`, `PASTURE=0.65`, `DEGRADED_PASTURE=0.8`, `BARE_SOIL=0.95` e `URBAN=0.7`. Uso misto exige uma categoria predominante; valor não reconhecido é `INVALID_INPUT`; ausência ou predominância indeterminável é `INSUFFICIENT_DATA`. Não existe lacuna focal de domínio ou mapeamento para esta versão.

`RECOMENDACAO`: não evoluir o model legado `IHFRDiagnosis`. Criar modelagem experimental aditiva porque o legado não preserva suplemento, manifesto/hash, decomposição, proveniência, idempotência nem ciclo imutável e possui `algorithmVersion = "1.0.0"` e `explanationAI`, incompatíveis com o contrato atual.

## Technical Context

**Language/Version**: TypeScript `^5`, React `19.2.4`, Node compatível com Next.js `^16.1.6`; cálculo server-side em IEEE-754 binary64.

**Primary Dependencies**: Next.js `^16.1.6`, Prisma/client `^7.4.2`, adapter Neon `^7.7.0`, `node:crypto`; nenhuma dependência, Python, FastAPI, IA ou serviço externo novo.

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

`.specify/feature.json` aponta localmente para esta feature e é ignorado pelo Git. `tasks.md` contém a sequência executável `T001–T134`; `pr-description.md` prepara somente o texto de um PR futuro.

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

[ihfr-diagnosis-api.openapi.yaml](contracts/ihfr-diagnosis-api.openapi.yaml) define seis operações HTTP e sete comportamentos funcionais: elegibilidade, vigente, detalhe, revogação, recuperação e o POST compartilhado para CREATE/REPLACE discriminado por `mode`. CREATE admite `expectedCurrentDiagnosisId` ausente ou `null`; REPLACE exige UUID. Elegibilidade malformada ou com categoria inválida retorna `400 INVALID_REQUEST`; ausência válida ou predominância indeterminável retorna outcome `INSUFFICIENT_DATA`. `PublicDiagnosis.areaId` é obrigatório e derivado no servidor. Não há listagem completa. Todas as respostas usam `Cache-Control: no-store` e DTOs fechados.

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
| FR-019 | OpenAPI com seis operações/sete comportamentos, discriminador `mode`, condicionais CREATE/REPLACE e `400 INVALID_REQUEST` |
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
