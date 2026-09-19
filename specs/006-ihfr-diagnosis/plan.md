# Implementation Plan: Diagnóstico IHFR experimental

**Branch**: `006-ihfr-diagnosis` | **Date**: 2026-09-19 | **Spec**: [spec.md](spec.md)

**Input**: `specs/006-ihfr-diagnosis/spec.md`

**Status**: planejamento técnico concluído para a v0.1 experimental. `G1`, `G2-ENG` e `G3-ENG` estão resolvidos para planejamento; `G2-SCI` permanece futuro e não é simulado por testes técnicos.

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

**Constraints**: exatamente um `CURRENT` por coleta; entradas/resultados imutáveis; laboratório inativo somente leitura; OWNER/ADMIN escrevem e MEMBER consulta; versões explicitamente compatíveis; `null` nunca vira zero; sem arredondamento intermediário; DTO mínimo e `Cache-Control: no-store`.

**Scale/Scope**: elegibilidade, cálculo/criação ou substituição, consulta do vigente, detalhe contextual, revogação e recuperação por chave. Dashboard, lista histórica pública, mapa, gráficos, recomendações, validação científica definitiva e manutenção da IMP-005/007 ficam fora.

## Constitution Check

Gate avaliado antes da Phase 0 e novamente após o design.

| Princípio | Antes da Phase 0 | Após Phase 1 |
|---|---|---|
| I — Hierarquia de fontes | PASS — ADR-0001, manifesto, spec/checklist e contratos integrados da IMP-005 governam seus assuntos; código comprova somente baseline. | PASS — o desenho não reabre os 15 conflitos nem promove histórico ou legado a contrato atual. |
| II — Entregas verticais | PASS — uma jornada contextual produz e consulta o diagnóstico experimental. | PASS — dashboard/histórico e ciência definitiva continuam fora; reconciliação com IMP-007 não bloqueia o núcleo. |
| III — Especificação por funcionalidade | PASS — branch e diretório `specs/006-ihfr-diagnosis/**` confirmados pelo setup. | PASS — plano, pesquisa, modelo, contratos e quickstart estão no diretório; nenhum `tasks.md` foi criado. |
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
└── contracts/
    ├── ihfr-math-experimental-v0.1.0.json
    ├── ihfr-diagnosis-input-experimental-v0.1.0.schema.json
    └── ihfr-diagnosis-api.openapi.yaml
```

`.specify/feature.json` aponta localmente para esta feature e é ignorado pelo Git. `tasks.md` pertence exclusivamente a uma execução posterior de `$speckit-tasks`.

### Source Code (repository root)

Estrutura planejada; nenhum destes arquivos de implementação é criado nesta etapa:

```text
prisma/schema.prisma
prisma/migrations/<timestamp>_experimental_ihfr_diagnosis/migration.sql
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

### Fronteira com a IMP-007 integrada

`EVIDENCIA_IMPLEMENTACAO`: a IMP-007 expõe somente resumo e itens derivados `AREA_CREATED`/`COLLECTION_CONFIRMED`, com destinos contextuais e allowlist sem PII, payload ambiental ou diagnóstico. Não cria tabela/fonte de atividade e não constitui auditoria.

A IMP-006 não modifica a IMP-007. `CREATED`, `SUPERSEDED` e `REVOKED` ficam em eventos internos restritos; nenhuma lista histórica pública é criada agora. Uma projeção futura para dashboard deve derivar dos registros canônicos da IMP-006, jamais copiar auditoria ou criar segunda fonte de verdade.

## Phase 0 — Research Outcome

[research.md](research.md) resolve taxonomia, avaliador, manifesto/hash, persistência, estados, idempotência, autorização, API, auditoria e fronteira com a IMP-007. Não restou `NEEDS CLARIFICATION`.

## Phase 1 — Design

### 1. Entrada suplementar

O contrato [ihfr-diagnosis-input-experimental-v0.1.0.schema.json](contracts/ihfr-diagnosis-input-experimental-v0.1.0.schema.json) descreve o suplemento confirmado fechado e contém `inputContractVersion`, `landUseType` e `provenance`. A fronteira HTTP aceita um candidato ainda sem `landUseType` somente para produzir `INSUFFICIENT_DATA`; ele não satisfaz o schema nem é persistido. IDs contextuais e autoria vêm do servidor. O suplemento válido é criado atomicamente com um diagnóstico bem-sucedido e nasce imutável, ligado a `CollectionData` e `EnvironmentalMeasurementSet`. Requests insuficientes/incompatíveis podem ter operação terminal recuperável, mas não fabricam suplemento confirmado nem diagnóstico. Legado não recebe backfill.

### 2. Manifesto e avaliador

O carregador lê o JSON empacotado server-side, valida forma/versão, remove somente `contractHash`, canonicaliza objetos por chaves lexicográficas recursivas preservando arrays e calcula SHA-256 UTF-8. O valor deve ser exatamente `sha256:5285d52ec70e0b0f8a951d40dd54f052e02be1556dd310e3cef0b3b4f6bc684b`; divergência impede ativação.

`evaluate(input, manifest)` é puro: não usa banco, sessão, relógio ou rede. Aceita somente as quatro versões explicitadas e preserva valores brutos e cada transformação. `terrain.slopePercent = null` produz `INSUFFICIENT_DATA`; acima de 45 permanece intacto na origem e aparece na decomposição com `raw`, `normalizedInput=45`, fórmula, score e `clamped=true`.

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

[ihfr-diagnosis-api.openapi.yaml](contracts/ihfr-diagnosis-api.openapi.yaml) define elegibilidade, criação/substituição, vigente, detalhe, revogação e recuperação, sem listagem completa. Todas as respostas usam `Cache-Control: no-store` e DTOs fechados.

O servidor exige conta ativa e vínculo atual, resolve laboratório → área → coleta → conjunto/suplemento/diagnóstico e retorna `404` indistinguível. OWNER/ADMIN escrevem em laboratório ativo; MEMBER consulta; laboratório inativo mantém leitura; vínculo revogado elimina acesso. Ator, chave, request hash, payload completo e evidência restrita não entram no DTO normal.

### 6. Testes

[quickstart.md](quickstart.md) cobre vetores técnicos, limites/classes/precisão/`clamp`, manifesto/hash/compatibilidade, parser fechado/null/legado, autorização/isolamento/inatividade, idempotência/timeout/concorrência, substituição/revogação, migration/OpenAPI/integração/E2E e regressões das IMP-003/004/005/007. Vetores científicos permanecem pendentes.

### 7. Requirement coverage

| Requisitos | Cobertura principal |
|---|---|
| FR-001–FR-002 | autorização contextual, capacidades de leitura/escrita e resolução integral da cadeia na API/serviço |
| FR-003–FR-006 | carregador/hash, matriz de compatibilidade, snapshot com versões separadas e DTO público |
| FR-007–FR-010 | estados distintos, laboratório inativo, 404 indistinguível, auditoria separada e legado isolado |
| FR-011–FR-012 | transação atômica, modelos imutáveis, suplemento fechado e insuficiência por slope/land use |
| FR-013–FR-014 | ponteiro único, eventos de ciclo, expected current, ledger idempotente e recuperação |
| FR-015–FR-016 | avaliador puro TypeScript, quatro dimensões, clamp, precisão e apresentação |
| FR-017 | evento/evidência restritos, autoria interna e minimização do DTO |
| FR-018 | limites explícitos e não alteração das IMP-005/007 |

Os cenários SC-001–SC-007 são materializados na matriz de unitários, integração, migration e E2E do quickstart. A cobertura é planejada; não afirma que a IMP-006 já esteja implementada.

## Gates

| Gate | Estado após o plano | Condição posterior |
|---|---|---|
| G1 — dados ambientais | **FECHADO** pela IMP-005 integrada | Preservar contrato e regressões |
| G2-ENG — contrato experimental | **RESOLVIDO PARA PLANEJAMENTO** | Implementar suplemento, manifesto/hash e avaliador exatamente como desenhados |
| G2-ENG — `landUseType` | **RESOLVIDO_E_RASTREAVEL_PARA_V0_1_EXPERIMENTAL** | Implementar as regras focais do ADR-0001 §7 sem ampliar enum ou aliases |
| G2-SCI — validação definitiva | **NAO_VERIFICADO_VALIDACAO_POSTERIOR** | Revisão, calibração, vetores científicos e campo; não bloqueia a v0.1 rotulada |
| G3-ENG — ciclo operacional | **RESOLVIDO DOCUMENTALMENTE PARA PLANEJAMENTO** | Implementar/testar autorização, transações, ciclo e auditoria |
| IMP-007 | **INTEGRADA E RECONCILIADA NO BASELINE** | Não alterar agora; extensão futura deriva da fonte canônica da IMP-006 |

O plano está completo e `landUseType` não possui pendência. Antes de codificar, o fluxo esperado é `$speckit-tasks` e, recomendado, `$speckit-analyze`; eles não foram executados nesta etapa.

## Risks and Mitigations

| Risco | Mitigação |
|---|---|
| Legado parecer contrato atual | Models experimentais novos; nenhum backfill ou leitura do `IHFRDiagnosis` legado |
| Alteração silenciosa do manifesto | canonicalização independente, hash fixo e ativação fail-closed |
| Dois vigentes | ponteiro `UNIQUE(collectionDataId)`, lock da coleta e transação serializável |
| Resultado mutável para refletir ciclo | snapshot imutável; estado derivado de ponteiro + eventos |
| Replay vazar dado após perda de acesso | autorização contextual antes de qualquer projeção recuperada |
| Auditoria virar histórico público | eventos restritos sem endpoint normal; futura IMP-007 usa projeção mínima |
| Score apresentado alterar classe | classe sobre score bruto; half-up apenas na apresentação |
| G2-SCI confundido com testes verdes | quatro rótulos obrigatórios e separação de vetores técnicos/científicos |

## Complexity Tracking

Nenhuma violação constitucional. Separar snapshot, ponteiro, operação e evento é necessário para satisfazer imutabilidade, um único vigente, replay, concorrência e auditoria; o legado ou um JSON único não oferecem essas garantias.
