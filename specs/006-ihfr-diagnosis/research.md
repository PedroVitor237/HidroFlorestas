# Research: Diagnóstico IHFR experimental

**Date**: 2026-09-20
**Status**: Phase 0 concluída; nenhuma `NEEDS CLARIFICATION` remanescente.

## R-001 — Baseline da IMP-007

**Decision**: planejar sobre `origin/development` `10fdb8b`, incorporado à IMP-006 por merge normal. A IMP-007 está integrada pelo PR #26 e não será alterada.

**Rationale**: `9e3a818` é ancestral de `10fdb8b`; o merge possui os dois pais esperados. O delta implementa resumo e histórico derivado somente de área criada e coleta confirmada, sem entidade de atividade, auditoria ou diagnóstico.

**Alternatives considered**: ler a branch remota sem integrar, aplicável apenas ao Caso B; criar já variante de diagnóstico no dashboard, rejeitada por escopo.

## R-002 — Taxonomia e mapeamento de `landUseType`

**Decision**: usar exclusivamente `FOREST 0.2`, `AGROFORESTRY 0.25`, `CROPLAND 0.6`, `PASTURE 0.65`, `DEGRADED_PASTURE 0.8`, `BARE_SOIL 0.95` e `URBAN 0.7`.

**Rationale**: ADR-0001 §7 audita as 13 fontes históricas que mencionam o assunto. `DOC-RAW-013` L196–207 fornece o único domínio completo com sete scores; `DOC-RAW-005` L48–59 confirma as sete categorias sem scores; `DOC-RAW-007` L61–68 confirma os seis scores não urbanos e a predominância. A escolha é `DECISAO_EXPERIMENTAL_DE_ENGENHARIA`, embora `VALIDACAO_CIENTIFICA_PENDENTE`.

**Alternatives considered**: tabela conflitante de seis scores de `DOC-RAW-006`; taxonomia regional qualitativa de `DOC-RAW-011`; listas incompletas de UI; `CollectionArea.landType` livre; `soilTexture`, `landscapeDegradation`, `vegetationCoverPercent`, drenagem, elevação, declividade e tamanho como substitutos; categoria `OTHER`; composição ou média em uso misto. Todas permanecem documentadas e inativas.

**Operational rules**: o candidato registra uma única categoria predominante; se a predominância não puder ser determinada, retorna `INSUFFICIENT_DATA`. Token, alias ou caixa fora dos sete valores exatos retorna `INVALID_INPUT`. Ausência não persiste suplemento. Mudança posterior cria novo suplemento e diagnóstico por operação auditável. O perfil é `GENERAL_EXPERIMENTAL`, com aplicabilidade territorial científica não comprovada e sem herança regional.

## R-003 — Forma do suplemento

**Decision**: request fechado com `inputContractVersion`, proveniência observacional mínima e candidato de `landUseType`; o candidato pode estar ausente apenas para produzir `INSUFFICIENT_DATA`. Contexto, conjunto ambiental, autoria e timestamps finais são derivados no servidor. Persistir suplemento completo somente junto de diagnóstico concluído. O suplemento pertence à coleta, é deduplicado por `UNIQUE(collectionDataId,payloadHash)` e pode ser referenciado por N diagnósticos compatíveis; `inputSupplementId` não é único no diagnóstico.

**Rationale**: reduz autoridade do cliente, liga o snapshot à coleta/conjunto exatos e o torna imutável desde a criação. Tentativa insuficiente pode ser recuperada pela operação, sem parecer entrada confirmada. Nova observação cria novo suplemento; nova versão matemática compatível pode reutilizar o existente sem duplicá-lo.

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

**Rationale**: reproduz a regra normativa. A versão ativa `ihfr-math-experimental-v0.1.1` usa `sha256:f8104143f1505aceaa68a7ffa06fac50f4906cdfc4119609875d99c9fecc6f89`; a v0.1.0 e `sha256:5285d52ec70e0b0f8a951d40dd54f052e02be1556dd310e3cef0b3b4f6bc684b` permanecem imutáveis e históricas. Qualquer divergência falha fechada.

**Alternatives considered**: confiar no hash embutido, corrigir automaticamente ou buscar manifesto remoto/no banco.

## R-007 — Persistência experimental versus legado

**Decision**: criar modelos novos para suplemento, snapshot, ponteiro vigente, operação e evento. Não evoluir `IHFRDiagnosis` legado.

**Rationale**: o legado tem apenas scores agregados, classe, qualidade, default de algoritmo e `explanationAI`; faltam contratos, hash, decomposição, suplemento, origem, vigência e ciclo. Alterá-lo promoveria registros antigos ambiguamente.

**Alternatives considered**: muitas colunas nulas no legado; JSON único mutável; apagar/migrar legado.

## R-008 — Imutabilidade e ciclo

**Decision**: snapshot do resultado e suplemento append-only; suplemento 1:N para diagnósticos; ponteiro vigente separado com `UNIQUE(collectionDataId)`; eventos append-only `CREATED`, `SUPERSEDED` e `REVOKED`. Estado público é derivado.

**Rationale**: permite trocar/remover vigência sem editar scores, entradas ou versões. A transação mantém no máximo um `CURRENT` e preserva anteriores.

**Alternatives considered**: atualizar `status` no resultado; soft-delete; um vigente por versão.

## R-009 — Idempotência, concorrência e timeout

**Decision**: chave UUID própria e request hash canônico incluindo `mode`, contexto, suplemento/versões, alvo/motivo. Ledger único por ator+chave; transação serializável e lock da coleta; replay idêntico retorna resposta terminal e divergente retorna `IDEMPOTENCY_CONFLICT`.

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

**Decision**: seis operações HTTP contextuais e sete comportamentos: elegibilidade, vigente, detalhe, revogação, recuperação e um POST discriminado por `mode` para CREATE/REPLACE; nenhuma lista histórica completa. CREATE aceita `expectedCurrentDiagnosisId` ausente ou `null`; REPLACE exige UUID. Elegibilidade inválida retorna `400 INVALID_REQUEST`; ausência válida ou predominância indeterminável retorna outcome `INSUFFICIENT_DATA`. `PublicDiagnosis.areaId` é obrigatório e derivado no servidor.

**Rationale**: detalhe por ID preserva consulta contextual sem sobrepor a IMP-007. Auditoria não vira feed. Projeção futura deve derivar da fonte canônica.

**Alternatives considered**: rota global; histórico público; publicar auditoria diretamente.

## R-013 — Estratégia de testes

**Decision**: separar vetores técnicos derivados do manifesto de vetores científicos futuros. Avaliador/hash em unitários; autorização/ciclo/concorrência em integração; constraints/triggers em migration; jornada mínima E2E; regressões IMP-003/004/005/007/008. PostgreSQL usa schema isolado por execução, fixtures explícitas e teardown em finalização mesmo após falha, sem desabilitar triggers.

**Rationale**: testes técnicos provam conformidade executável, não validade científica. PostgreSQL real é necessário para concorrência e triggers.

**Alternatives considered**: somente mocks; chamar vetores derivados de científicos; E2E como única camada.

## R-014 — Baseline territorial da IMP-008

**Decision**: planejar sobre `origin/development` `df856194b3341137d6d863feefcb0a203deb5905`, que integrou a IMP-008 pelo PR #27 com head `c6c13f7dc97d4ed873f67cb99fb6c36d60579601`, incorporado à IMP-006 pelo merge normal `96dac7c`. Preservar o mapa territorial como projeção independente e executar sua regressão explícita antes de teardown, evidências e encerramento.

**Rationale**: o delta real da IMP-008 não altera schema, migrations, dependências, medições ambientais, contratos científicos, autorização ou semântica de laboratório inativo. O endpoint territorial consulta apenas áreas e a tupla confirmada de coletas, não cria fonte paralela, não expõe auditoria e não contém diagnóstico, `landUseType`, score, classe, Plotly ou camada científica.

**Alternatives considered**: projetar IHFR automaticamente no mapa, rejeitada por ausência de requisito e contrato próprios; usar coordenadas ou `CollectionArea.landType` como entrada científica, rejeitada por incompatibilidade com o suplemento imutável; alimentar o mapa pela auditoria restrita, rejeitada por privacidade e fonte de verdade; omitir regressão territorial, rejeitada porque a integração introduziu uma superfície existente que a IMP-006 deve preservar.

## R-015 — Remediação de consistência e ordem executável

**Decision**: ativar a v0.1.1 para clarificar validação sem alterar matemática; reservar a migration `prisma/migrations/20260920000100_ihfr_experimental_diagnosis/migration.sql`; ordenar setup → caracterização → preflight → Prisma/migration → validação/aplicação isolada → generate → fixtures → shells → RED real → implementação → verdes → regressões → teardown → evidências → encerramento. A implementação deve parar se o caminho de migration estiver ocupado ou uma migration posterior invalidar a ordem.

**Rationale**: testes comportamentais não podem ficar RED por falta de schema/client/fixtures, paralelismo não pode atingir os mesmos arquivos e o encerramento não pode preceder regressões ou teardown. A v0.1.1 resolve a contradição entre ignorar desconhecidos e rejeitar enums/aliases sem reescrever a v0.1.0 histórica.

**Alternatives considered**: editar retroativamente a v0.1.0, proibido pela governança de versionamento; criar testes antes da infraestrutura mínima, que produz RED falso; teardown parcial ou manual, que deixa estado residual; manter migration placeholder, que não é executável.

## Resolved Unknowns

Não há decisão material aberta. `landUseType` possui domínio e mapeamento completos; `speckit-clarify` focal não é necessária antes de `$speckit-tasks`.
