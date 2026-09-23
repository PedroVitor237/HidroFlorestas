# 04 — API HTTP e contrato de erros

## Status inicial

PENDENTE. As rotas GET current e GET detail estão implementadas; as outras quatro rotas chamam handlers 501 NOT_IMPLEMENTED. ihfr-diagnosis.http.ts ainda não mapeia a matriz completa e usa INTERNAL_ERROR genérico onde o [OpenAPI](../contracts/ihfr-diagnosis-api.openapi.yaml) pede TECHNICAL_FAILURE sanitizado. A leitura atual também diverge do PublicDiagnosis declarado: src/types/ihfr-diagnosis.type.ts expõe versions planas/labels e displayScore string/dataQuality MODERATE, enquanto o OpenAPI exige versions/scientificLabels, displayScore number/dataQuality MEDIUM, IDs de conjunto/suplemento, decomposição, drivers, explicação, validFrom e scientificState. O serviço de leitura não seleciona todos esses campos.

## Tarefas Speckit abrangidas

T091, T092, T093, T094 e T095.

## Dependências

Serviço da [etapa 03](03-transactional-lifecycle-and-idempotency.md) e autorização da etapa 02. Seis operações e schemas do OpenAPI 3.1; parser fechado já existente. No Next.js 16, route.ts exporta somente verbos HTTP e configuração permitida; fábricas injetáveis ficam em módulos irmãos de handler.

## Estado de entrada esperado

Serviço retorna outcomes tipados e lança erros de domínio reconhecíveis, sem capturar falha técnica como sucesso. Os testes RED de eligibility/write/idempotency/revocation continuam capazes de chamar handlers e banco isolado.

## O QUÊ

Conectar seis operações HTTP contextuais e sete comportamentos (CREATE e REPLACE compartilham POST) ao serviço. Validar query/header/body, serializar DTO allowlist e padronizar 200/201/400/401/403/404/409/422/500, no-store e Content-Type application/json.

## POR QUÊ

Um serviço correto sem fronteira HTTP segura ainda pode vazar existência, detalhes de erro ou aceitar requests malformados. O contrato de erro é parte da idempotência: o cliente precisa distinguir conflito, insuficiência recuperável e falha técnica antes de mostrar sucesso.

## Arquivos que provavelmente serão alterados

src/app/api/server/ihfr-diagnosis/ihfr-diagnosis-eligibility.handler.ts, ihfr-diagnosis-write.handler.ts, ihfr-diagnosis-operation.handler.ts, ihfr-diagnosis-revocation.handler.ts, ihfr-diagnosis.http.ts; seis route.ts sob src/app/api/laboratories/[laboratoryId]/areas/[areaId]/collections/[collectionId]/ihfr-diagnosis/ se a ligação exigir ajustes. Testes integration/ihfr-diagnosis-{eligibility-route,write-route,idempotency,revocation,current-route,detail-route}.test.ts.

## Procedimento ordenado

1. Verificar as seis assinaturas/paths do OpenAPI: GET eligibility, GET current, POST diagnoses, GET diagnoses/{diagnosisId}, POST diagnoses/{diagnosisId}/revocations e GET operations/{idempotencyKey}. Manter laboratório, área e coleta em todos os paths; detail/revocation incluem diagnóstico e recovery inclui chave.
2. GET eligibility: autenticar e resolver contexto, aceitar somente parâmetro opcional landUseType único e os sete tokens exatos. Query duplicada, desconhecida, inválida ou malformada retorna 400 INVALID_INPUT; ausência válida retorna 200 com outcome INSUFFICIENT_DATA e reason, sem write. Elegibilidade não exige Idempotency-Key.
3. GET current: manter 200 com {diagnosis: PublicDiagnosis | null}; coleta acessível sem vigente é null, nunca 404 de ausência de diagnóstico ou score zero. GET detail: 200 com snapshot contextual e lifecycle derivado; diagnóstico legado, inexistente ou cruzado recebe 404 indistinguível. MEMBER/inativo podem ler com vínculo atual. Antes de chamar essas rotas conformes ao OpenAPI, reconciliar a projeção real: selecionar os campos de origem/decomposição necessários, converter o enum interno de qualidade para o vocabulário contratual sem mudar a matemática, representar displayScore conforme o schema e manter versões/rótulos na forma declarada. Se a forma publicada pretendida for outra, registrar uma decisão de contrato e versionar a mudança, sem ajustar silenciosamente o OpenAPI ou enfraquecer o teste.
4. POST diagnoses: autenticar e autorizar escrita no contexto antes de validar Content-Type, body JSON fechado e Idempotency-Key UUID obrigatório. mode CREATE permite expectedCurrentDiagnosisId omitido ou null; REPLACE exige UUID. Suplemento candidato fechado, proveniência e versões bem formadas; autoria/areaId não são aceitos do cliente. SUCCEEDED novo retorna 201 e Location contextual; replay de sucesso ou INSUFFICIENT_DATA retorna 200 conforme OpenAPI. Incompatibilidade nova ou repetida por POST usa `422 ErrorEnvelope`, sem nova escrita nem ativação de v0.1.0.
5. POST revocations: exigir Content-Type, JSON fechado {expectedCurrentDiagnosisId, reason} e Idempotency-Key UUID, diagnóstico contextual no path. Sucesso/replay 200; motivo vazio, longo ou campo extra 400 INVALID_INPUT; estado obsoleto 409 STATE_CONFLICT. Motivo não entra no DTO público.
6. GET operation: autenticar e reautorizar leitura da conta ativa, vínculo atual OWNER/ADMIN/MEMBER e cadeia contextual, em laboratório ativo ou inativo, antes de procurar/projetar ledger por chave UUID. Terminal encontrado no mesmo contexto e ator retorna 200 OperationResponse, inclusive incompatibilidade; chave malformada retorna 400 INVALID_INPUT; ausente/inacessível retorna 404 uniforme. Não exigir autorização de escrita, não permitir buscar por chave global nem devolver responseSnapshot interno bruto.
7. Centralizar envelopes fechados {error:{code,message}}: 400 INVALID_INPUT para body/query/header estrutural ou sintaticamente inválido (incluindo query de elegibilidade/operação e formato de versão/hash), após autenticação/autorização contextual; 401 UNAUTHENTICATED para sessão/conta inelegível; 403 FORBIDDEN para MEMBER em escrita acessível; 404 NOT_FOUND indistinguível para inexistente/inacessível; 409 READ_ONLY, IDEMPOTENCY_CONFLICT ou STATE_CONFLICT; 422 INCOMPATIBLE_VERSION para seleção bem formada porém incompatível ou medição persistida incompatível; 500 TECHNICAL_FAILURE sanitizado. O POST 422 novo ou repetido retorna ErrorEnvelope, registra no máximo uma operação terminal recuperável por GET operation como 200 OperationResponse e não cria recursos de domínio. Não incluir stack, SQL, ID interno, motivo restrito, hash ou segredo. Todas as respostas, inclusive erro, 501 removido e replay, têm Cache-Control: no-store e JSON Content-Type.
8. Para cada operação, testar cabeçalhos, schema exato, status, no-store, autorização server-side e efeitos. Conferir que o status não revela mais do que o contrato permite. Não considerar route.ts implementado apenas porque importa uma factory ainda 501.

## Regras e invariantes

Seis operações HTTP, sete comportamentos funcionais; sem rota de histórico/auditoria. O serviço determina estado e contexto; handler não reconstrói domínio nem usa User.role global. Projeção pública sempre allowlist, areaId server-derived coerente com coleta. 404 de recurso cruzado deve ser indistinguível de 404 inexistente em corpo/status. Erros inesperados não podem se transformar em 200/201.

## Testes obrigatórios

Executar os testes de rota focais citados, mais testes de headers e corpos inválidos por método; npm run typecheck. Na etapa 07, tests/contract/ validará OpenAPI 3.1 e schemas. Exercitar 401/403/404/409/422/500 com injeção controlada, no-store e ausência de detalhes internos; conferir 201 novo, 200 replay, 200 insuficiente e 200 current null. Testes devem alcançar handler real e, para efeito de persistência, serviço com PostgreSQL isolado.

## Evidências que devem ser registradas

Matriz path+método→comportamento→status/envelope/header, contagem de chamadas de autorização, contagens no banco para falhas, resposta sanitizada e comando/exit code por teste. Guardar exemplos sem IDs de pessoas, chaves reais ou payload restrito.

## Condições de parada

Handler ainda 501, Content-Type aceito indevidamente, escrita sem chave, body aberto, 404 que distingue recurso cruzado, 500 com stack, replay sem reautorização ou divergência OpenAPI/implementação. Corrigir contrato apenas com decisão documentada se semântica normativa mudar.

## Critérios de conclusão

Seis rotas executam os sete comportamentos, todos os envelopes e headers contratados são observados, nenhum 501 resta no fluxo funcional, nenhum dado interno é exposto e os testes focais chegam à camada correta.

## Estado de saída esperado

API contextual pronta para UI e contract tests, preservando leitura já implementada e idempotência/rollback do serviço.

## Checkpoint/commit sugerido

Sugestão futura: feat(ihfr): expose contextual diagnosis lifecycle API. Escopo: handlers, route.ts estritamente necessário, adaptação HTTP e testes de rota; sem commit nesta execução.
