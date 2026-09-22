# 02 — Autorização de escrita e elegibilidade

## Status inicial

PENDENTE. readCurrent/readDetail já revalidam conta/vínculo contextual; eligibility ainda lança IHFR_ELIGIBILITY_NOT_IMPLEMENTED. A permissão genérica CREATE_ENVIRONMENTAL_DATA não representa a regra da IMP-006: nela MEMBER também pode registrar dados ambientais. O handler de eligibility ainda responde 501.

## Tarefas Speckit abrangidas

T083 e T084.

## Dependências

Etapa [01](01-current-state-and-reconciliation.md) concluída; [ADR-0001 §7 e §10](../../../docs/governance/ADR-0001-contrato-experimental-ihfr-v0-1.md), [spec FR-001/002/008/011/012/014/019](../spec.md), [OpenAPI](../contracts/ihfr-diagnosis-api.openapi.yaml), contratos IMP-005 e fixtures de atores/contextos conferidos. Manifesto ativo e avaliador T077–T082 já existentes.

## Estado de entrada esperado

Schema/Prisma Client coerentes com migration; fixtures isoladas acessíveis. Serviço e handler permanecem fail-closed. Nenhum teste RED foi convertido em PASS por mock que evita a autorização real.

## O QUÊ

Criar capacidades próprias READ_IHFR_DIAGNOSIS e MANAGE_IHFR_DIAGNOSIS, revalidar conta e vínculo atuais, resolver a cadeia completa e avaliar elegibilidade sem INSERT/UPDATE/DELETE, ledger ou evento. A resposta de elegibilidade deve ser fechada: eligible, outcome, reasons, hasCurrentDiagnosis e currentDiagnosisId quando permitido.

## POR QUÊ

O papel global User.role não substitui ResearchersLinked.role contextual. Reuso cego da capacidade ambiental permitiria escrita por MEMBER. Verificar somente a UI deixa API e replay expostos. A elegibilidade deve orientar a ação sem reservar estado nem criar suplemento órfão.

## Arquivos que provavelmente serão alterados

src/app/api/server/services/ihfr-diagnosis.service.ts; possivelmente src/app/api/server/ihfr-diagnosis/ihfr-diagnosis.constants.ts e o helper de autorização contextual, somente se a nova capacidade puder ser adicionada sem alterar semântica das IMP-003/004/005. Testes: tests/integration/ihfr-diagnosis-eligibility-route.test.ts, ihfr-diagnosis-write-route.test.ts, ihfr-diagnosis-read-authorization.test.ts e tests/fixtures/ihfr-diagnosis-actors.ts. Registrar em [implementation-evidence.md](../implementation-evidence.md).

## Procedimento ordenado

1. Caracterizar o helper atual em area.authorization.ts e os papéis OWNER/ADMIN/MEMBER das fixtures. Definir uma checagem MANAGE_IHFR_DIAGNOSIS sem reaproveitar CREATE_ENVIRONMENTAL_DATA; identidade vem de requireAuth/session no servidor. User.status deve ser ACTIVE, vínculo ResearchersLinked deve ser atual e do laboratório da rota. Papel global ADMIN isolado não concede escrita contextual.
2. Validar laboratoryId, areaId e collectionId como UUID e resolver, em query filtrada pelo laboratório, LaboratoryRoom → CollectionArea → CollectionData confirmada → EnvironmentalMeasurementSet. Recusar área de outro laboratório, coleta de outra área e conjunto de outra coleta; não buscar recursos isolados para depois revelar qual ID existe. Revalidar o contexto em cada chamada, inclusive depois de troca de vínculo.
3. Para READ, permitir OWNER/ADMIN/MEMBER ativos com vínculo atual em laboratório ativo ou inativo. Para MANAGE, exigir OWNER/ADMIN contextuais e LaboratoryRoom.isActive=true. MEMBER retorna FORBIDDEN para escrita em contexto acessível; laboratório inativo retorna READ_ONLY/409 conforme contrato. Vínculo revogado/inexistente e recurso cruzado recebem 404 indistinguível; sessão ausente ou conta inativa segue 401, sem dados de recurso.
4. Construir eligibility como leitura pura sobre conjunto confirmado, versão ihfr-measurement-v1, slopePercent, valor opcional de landUseType, manifesto/hash e suficiência W/S/V/T. Aceitar somente FOREST, AGROFORESTRY, CROPLAND, PASTURE, DEGRADED_PASTURE, BARE_SOIL e URBAN. Uma categoria predominante é explícita; nunca inferir de CollectionArea.landType, cobertura, solo, declividade ou coordenadas.
5. Diferenciar query estruturalmente inválida, alias, caixa divergente, OTHER(S) ou campo extra como INVALID_REQUEST/400; landUseType ausente ou predominância indeterminável válida como INSUFFICIENT_DATA em 200, com MISSING_LAND_USE_TYPE; slope ausente, conjunto ausente ou dimensão com menos de dois scores como INSUFFICIENT_DATA; versão/hash não suportado como INCOMPATIBLE_VERSION sem ativação automática. O candidato não vira suplemento confirmado.
6. Verificar duas vezes a ausência de efeitos: contagens de suplemento, diagnóstico, ponteiro, operação e evento antes/depois de elegibilidade válida, inválida e concorrente. A resposta não contém payload ambiental, identidade, hashes internos nem evidência.

## Regras e invariantes

Autorização antecede projeção e replay. Não confundir User.role global com vínculo contextual. Não alterar as regras de captura da IMP-005. Zero writes na elegibilidade, inclusive para outcome incompatível. O avaliador e o manifesto permanecem puros; v0.1.0 não é ativada. Recurso inexistente e inacessível têm mesmo status, envelope e mensagem.

## Testes obrigatórios

Executar focalmente node --import=tsx --test tests/integration/ihfr-diagnosis-eligibility-route.test.ts e tests/integration/ihfr-diagnosis-read-authorization.test.ts com fixture PostgreSQL isolada; ampliar com casos de MEMBER, OWNER/ADMIN contextual, User.status inativo, vínculo revogado, laboratório inativo, área/coleta cruzadas, sete enums, ausência, alias/campo extra, slope nulo, versão incompatível e zero persistência. Rodar npm run typecheck. Um teste que só chama mock de service não substitui a prova PostgreSQL de ausência de writes.

## Evidências que devem ser registradas

HEAD, comando/exit code/PASS-FAIL-SKIP, matriz ator×estado×contexto, envelopes observados, contagens de cinco tabelas antes/depois, teardown e ausência de segredo. Classificar resultado como EVIDENCIA_IMPLEMENTACAO técnica, sem alegar validação científica.

## Condições de parada

Se precisar conceder escrita a MEMBER, derivar papel do global, consultar recurso fora do contexto ou persistir durante elegibilidade, parar e registrar conflito normativo. Se DB de teste não estiver isolado/autorizado, parar a verificação de banco e não marcar GREEN.

## Critérios de conclusão

OWNER/ADMIN ativos em laboratório ativo podem solicitar MANAGE; MEMBER não pode; inativo só lê; vínculo revogado/IDs cruzados não vazam existência; eligibility retorna os outcomes/códigos contratados e não altera nenhuma das cinco tabelas. Testes focais e typecheck verdes com execução real.

## Estado de saída esperado

Serviço possui uma fronteira de autorização reutilizável pelas transações da etapa 03; elegibilidade é segura e side effect free. Handler HTTP só será declarado concluído na etapa 04.

## Checkpoint/commit sugerido

Sugestão futura: feat(ihfr): enforce contextual write access and read-only eligibility. Escopo: serviço, helper estritamente necessário e testes focais; sem commit nesta execução.
