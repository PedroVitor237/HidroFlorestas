# Research: Diagnóstico IHFR experimental

**Date**: 2026-09-19
**Status**: Phase 0 concluída; nenhuma `NEEDS CLARIFICATION` remanescente.

## R-001 — Baseline da IMP-007

**Decision**: planejar sobre `origin/development` `10fdb8b`, incorporado à IMP-006 por merge normal. A IMP-007 está integrada pelo PR #26 e não será alterada.

**Rationale**: `9e3a818` é ancestral de `10fdb8b`; o merge possui os dois pais esperados. O delta implementa resumo e histórico derivado somente de área criada e coleta confirmada, sem entidade de atividade, auditoria ou diagnóstico.

**Alternatives considered**: ler a branch remota sem integrar, aplicável apenas ao Caso B; criar já variante de diagnóstico no dashboard, rejeitada por escopo.

## R-002 — Taxonomia e mapeamento de `landUseType`

**Decision**: usar exclusivamente `FOREST 0.2`, `AGROFORESTRY 0.25`, `CROPLAND 0.6`, `PASTURE 0.65`, `DEGRADED_PASTURE 0.8`, `BARE_SOIL 0.95` e `URBAN 0.7`.

**Rationale**: ADR-0001 §6 e `inputs`/`enumMappings` do manifesto fornecem domínio e mapeamento completos. É `DECISAO_CONFIRMADA` para o contrato experimental, embora `VALIDACAO_CIENTIFICA_PENDENTE`.

**Alternatives considered**: `CollectionArea.landType` livre, drenagem, elevação e tamanho, todos proibidos; inventar categoria ou score, não autorizado.

## R-003 — Forma do suplemento

**Decision**: request fechado com `inputContractVersion`, `landUseType` e proveniência observacional mínima; contexto, conjunto ambiental, autoria e timestamps finais são derivados no servidor. Persistir suplemento somente junto de diagnóstico concluído.

**Rationale**: reduz autoridade do cliente, liga o snapshot à coleta/conjunto exatos e o torna imutável desde a criação. Tentativa insuficiente pode ser recuperada pela operação, sem parecer entrada confirmada.

**Alternatives considered**: CRUD independente, que permite órfão/mutação; alterar IMP-005; reutilizar campo livre legado.

## R-004 — Avaliador e precisão

**Decision**: função pura TypeScript server-side, parametrizada pelo manifesto validado. Usar binary64 sem arredondamento intermediário, tolerância técnica `1e-12` e decimal half-up somente para `displayScore`.

**Rationale**: é o contrato ADR/manifesto e combina com o monólito. A aplicação fornece relógio e persistência; o avaliador retorna decomposição/insuficiência sem efeitos colaterais.

**Alternatives considered**: Python/FastAPI/serviço externo/IA, fora do G3; Decimal em todas as etapas; arredondar antes de classificar.

## R-005 — Declividade e transformações

**Decision**: exigir `terrain.slopePercent`. Ausência gera `INSUFFICIENT_DATA`; acima de 45 usa `clamp(value,0,45)/45` somente no avaliador e registra bruto, valor normalizado, score e saturação.

**Rationale**: preserva `ihfr-measurement-v1`, que aceita finito `>=0`, e torna auditável a transformação.

**Alternatives considered**: rejeitar acima de 45, atualizar a origem imutável ou substituir por drenagem/elevação.

## R-006 — Manifesto, canonicalização e hash

**Decision**: importar o manifesto server-side, validar versão/forma, excluir somente a propriedade raiz `contractHash`, ordenar recursivamente chaves de objetos, preservar arrays, serializar JSON compacto UTF-8 e calcular SHA-256 com prefixo `sha256:`.

**Rationale**: reproduz a regra normativa e o hash `sha256:5285d52ec70e0b0f8a951d40dd54f052e02be1556dd310e3cef0b3b4f6bc684b`. Qualquer divergência falha fechada.

**Alternatives considered**: confiar no hash embutido, corrigir automaticamente ou buscar manifesto remoto/no banco.

## R-007 — Persistência experimental versus legado

**Decision**: criar modelos novos para suplemento, snapshot, ponteiro vigente, operação e evento. Não evoluir `IHFRDiagnosis` legado.

**Rationale**: o legado tem apenas scores agregados, classe, qualidade, default de algoritmo e `explanationAI`; faltam contratos, hash, decomposição, suplemento, origem, vigência e ciclo. Alterá-lo promoveria registros antigos ambiguamente.

**Alternatives considered**: muitas colunas nulas no legado; JSON único mutável; apagar/migrar legado.

## R-008 — Imutabilidade e ciclo

**Decision**: snapshot do resultado e suplemento append-only; ponteiro vigente separado com `UNIQUE(collectionDataId)`; eventos append-only `CREATED`, `SUPERSEDED` e `REVOKED`. Estado público é derivado.

**Rationale**: permite trocar/remover vigência sem editar scores, entradas ou versões. A transação mantém no máximo um `CURRENT` e preserva anteriores.

**Alternatives considered**: atualizar `status` no resultado; soft-delete; um vigente por versão.

## R-009 — Idempotência, concorrência e timeout

**Decision**: chave UUID própria e request hash canônico incluindo ação, contexto, suplemento/versões, alvo/motivo. Ledger único por ator+chave; transação serializável e lock da coleta; replay idêntico retorna resposta terminal e divergente retorna `IDEMPOTENCY_CONFLICT`.

**Rationale**: preserva o padrão seguro sem reutilizar `confirmationKey`/`payloadHash`. `expectedCurrentDiagnosisId` impede lost update. Recuperação reautoriza o contexto.

**Alternatives considered**: chave por coleta sem ator; chave ambiental; apenas isolation sem constraint; retry cego.

## R-010 — Estados e falhas

**Decision**: separar ciclo (`CURRENT`, `SUPERSEDED`, `REVOKED`), avaliação (`SUFFICIENT`, `INSUFFICIENT_DATA`), protocolo (`INCOMPATIBLE_VERSION`, `IDEMPOTENCY_CONFLICT`, `STATE_CONFLICT`) e `TECHNICAL_FAILURE`.

**Rationale**: zero é score válido; “aceito” não significa ciência validada. Falha técnica faz rollback; insuficiência pode ser terminal idempotente sem diagnóstico.

**Alternatives considered**: enum único; diagnóstico com score nulo para insuficiência.

## R-011 — Autorização e privacidade

**Decision**: capacidades explícitas `READ_IHFR_DIAGNOSIS`/`MANAGE_IHFR_DIAGNOSIS`; revalidar conta, vínculo, papel e cadeia em toda operação. DTO público allowlist e auditoria sem endpoint normal.

**Rationale**: OWNER/ADMIN escrevem, MEMBER lê, inativo só lê e vínculo revogado perde acesso. Ausente/inacessível usa `404` indistinguível.

**Alternatives considered**: reutilizar `CREATE_ENVIRONMENTAL_DATA`; autorização só na UI; expor ator, chave, hashes ou payload completo.

## R-012 — API e histórico

**Decision**: rotas contextuais para elegibilidade, vigente, detalhe, criação/substituição, revogação e operação; nenhuma lista histórica completa.

**Rationale**: detalhe por ID preserva consulta contextual sem sobrepor a IMP-007. Auditoria não vira feed. Projeção futura deve derivar da fonte canônica.

**Alternatives considered**: rota global; histórico público; publicar auditoria diretamente.

## R-013 — Estratégia de testes

**Decision**: separar vetores técnicos derivados do manifesto de vetores científicos futuros. Avaliador/hash em unitários; autorização/ciclo/concorrência em integração; constraints/triggers em migration; jornada mínima E2E; regressões IMP-003/004/005/007.

**Rationale**: testes técnicos provam conformidade executável, não validade científica. PostgreSQL real é necessário para concorrência e triggers.

**Alternatives considered**: somente mocks; chamar vetores derivados de científicos; E2E como única camada.

## Resolved Unknowns

Não há decisão material aberta. `landUseType` possui domínio e mapeamento completos; `speckit-clarify` focal não é necessária antes de `$speckit-tasks`.
