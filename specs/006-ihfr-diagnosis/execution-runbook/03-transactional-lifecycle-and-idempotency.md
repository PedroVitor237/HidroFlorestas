# 03 — Ciclo transacional, suplemento e idempotência

## Status inicial

PENDENTE. Migration e fixtures contêm suplemento, diagnóstico, ponteiro, operação e evento, com constraints e triggers. Parser de CREATE/REPLACE, request hash e avaliador puro existem. createOrReplace, revoke e operation ainda lançam IHFR_*_NOT_IMPLEMENTED; RED PostgreSQL de ciclo/concorrência foi registrado em [implementation-evidence.md](../implementation-evidence.md).

## Tarefas Speckit abrangidas

T085, T086, T087, T088, T089 e T090.

## Dependências

Autorização/eligibilidade da [etapa 02](02-write-authorization-and-eligibility.md); [data-model.md](../data-model.md), [research.md](../research.md), ADR-0001 §10, migration experimental e OpenAPI. Confirmar que triggers de imutabilidade permanecem ativos, que o suplemento é único por collectionDataId+payloadHash e que diagnosis.inputSupplementId não é único.

## Estado de entrada esperado

Schema isolado migrado, Prisma Client gerado, fixtures executáveis e RED focais ainda falhando somente por comportamento ausente. Nenhum endpoint público expõe as tabelas internas.

## O QUÊ

Implementar criação/reuso do suplemento, CREATE, REPLACE, REVOKE, ledger terminal, replay e recuperação contextual, serializando por coleta e mantendo rollback integral. A saída de sucesso é OperationResponse fechado; insuficiência não cria diagnóstico; falha técnica não deixa linha parcial.

## POR QUÊ

Um ponteiro separado preserva snapshots imutáveis e garante um único CURRENT. Chave e hash próprios permitem replay depois de timeout; lock, isolamento e ID vigente esperado impedem duas transições concorrentes incompatíveis. Ledger terminal inserido junto do domínio evita “sucesso” sem diagnóstico ou resposta.

## Arquivos que provavelmente serão alterados

src/app/api/server/services/ihfr-diagnosis.service.ts e, se necessário para transação/relógio injetáveis, src/app/api/server/services/ihfr-diagnosis.store.ts. Usar parser/hash já implementados em src/app/api/server/ihfr-diagnosis/ihfr-diagnosis.contracts.ts. Testes focais: tests/integration/ihfr-diagnosis-write-route.test.ts, ihfr-diagnosis-idempotency.test.ts, ihfr-diagnosis-concurrency.test.ts, ihfr-diagnosis-supplement-cardinality.test.ts e ihfr-diagnosis-revocation.test.ts.

## Procedimento ordenado

1. Definir entradas fechadas. CREATE/REPLACE recebem contexto da rota, ator da sessão, UUID próprio em Idempotency-Key, mode, expectedCurrentDiagnosisId, candidato de suplemento e VersionSelection. REVOKE recebe diagnóstico da rota, expectedCurrentDiagnosisId igual ao vigente, motivo não vazio de 1–500 caracteres e nova chave UUID. A recuperação recebe ator/contexto/chave, sem payload de escrita.
2. Pré-validar sessão e contexto atual como na etapa 02 antes de consultar ledger ou resultado. Confirmar que request hash canônico inclui operação, mode, contexto, ID esperado, suplemento, versões e, na revogação, diagnóstico/motivo. Não usar confirmationKey da IMP-005. A mesma chave é única por actorUserId; hash ou contexto diferentes retornam IDEMPOTENCY_CONFLICT/409.
3. Iniciar transação Prisma com isolamento Serializable. Dentro dela, revalidar conta, vínculo, laboratório ativo e cadeia de origem; bloquear a coleta com lock transacional e reler o ponteiro. Retry limitado somente a erros conhecidos de conflito serializável/deadlock conforme código/driver, refazendo autorização e leitura do estado em cada tentativa. Nunca retry cego de erro técnico ou de regra de domínio.
4. Resolver replay terminal só depois de autorização contextual: se ator+chave e hash/contexto coincidem, projetar a resposta anterior sem criar suplemento, diagnóstico, evento ou novo ledger. Se a autorização foi perdida, retornar 404 indistinguível. Após timeout, GET operation faz a mesma reautorização e retorna apenas terminal confiável; operação ausente retorna 404, sem fabricar sucesso.
5. CREATE: exigir ausência de CURRENT sob lock. Verificar conjunto confirmado ihfr-measurement-v1, suplemento candidato válido, quatro dimensões suficientes, versões/hash exatos e manifesto v0.1.1. Para insuficiência, inserir apenas operação terminal INSUFFICIENT_DATA se o contrato de ledger assim exigir; não criar suplemento, diagnóstico, ponteiro ou evento. Para incompatibilidade, respeitar 422 INCOMPATIBLE_VERSION e manter zero snapshot/ponteiro; registrar terminal somente se contrato e teste de recuperação forem coerentes.
6. Para resultado SUFFICIENT, canonicalizar suplemento completo com referências de coleta e conjunto; calcular payloadHash interno; inserir ou reutilizar por (collectionDataId,payloadHash), validando compatibilidade e coerência do conjunto. Uma nova observação de landUseType/provenance cria outro hash e suplemento. Um suplemento existente pode alimentar N diagnósticos compatíveis, inclusive após uma futura mudança matemática autorizada. Nunca sobrescrever o suplemento.
7. Na mesma transação, inserir snapshot de diagnóstico com rawScore não arredondado, displayScore half-up, classe sobre rawScore, quatro componentes, decomposição, drivers, explicação determinística, quatro versões/hash, timestamps do servidor; inserir ledger terminal SUCCEEDED, ponteiro único e evento CREATED_CURRENT. Persistir ator e hashes só nas tabelas restritas. O commit é o limite único de visibilidade.
8. REPLACE: exigir CURRENT e expectedCurrentDiagnosisId igual ao lido sob lock. Criar/reusar suplemento compatível, inserir novo snapshot, trocar ponteiro e inserir SUPERSEDED do antigo mais CREATED_CURRENT do novo e ledger terminal na mesma transação. Nunca atualizar diagnóstico antigo nem seus scores/versões. ID ausente, obsoleto, revogado ou de outro contexto gera STATE_CONFLICT ou 404 conforme precedência/contexto, sem transição parcial.
9. REVOKE: exigir diagnóstico da rota igual ao CURRENT e ao ID esperado; validar motivo restrito. Remover ponteiro, inserir evento REVOKED e ledger terminal na mesma transação. Snapshot continua consultável por detalhe com estado derivado REVOKED; current passa a null. Após revogação, novo CREATE suficiente pode produzir novo CURRENT sem reescrever o revogado.
10. Testar falha injetada entre cada escrita (suplemento, snapshot, operação, ponteiro, evento) e imediatamente antes do commit. Em cada falha, conferir contagens, ponteiro, snapshots, timestamps e eventos iguais ao baseline. Injetar pares concorrentes CREATE×CREATE, REPLACE×REPLACE, REPLACE×REVOKE, REVOKE×REVOKE, mesma chave igual/divergente e payloads diferentes com barreira determinística, sem sleep como sincronização.

## Regras e invariantes

No máximo um CURRENT por coleta. Suplemento, snapshot, ledger terminal e evento são append-only; triggers nunca são desabilitados. Não existe UNIQUE(inputSupplementId). O ledger terminal nasce e comita junto da transição; uma linha PENDING não pode ser exposta como sucesso. Replay não contorna autorização vigente. Precedência contratual: autenticação → autorização/contexto → validação fechada/chave → replay ou conflito → lock/revalidação do ponteiro → versão/hash → suficiência → escritas atômicas. Se a ordem exata entre erros de estado e versão gerar divergência dos contratos, documentar o caso e ajustar o teste contratual antes de implementar, sem escolha silenciosa.

## Testes obrigatórios

Executar com PostgreSQL isolado os cinco arquivos de integração citados e npm run typecheck. Provar UNIQUE do suplemento e ledger, reuso 1:N, um CURRENT em concorrência, primeiro vencedor/segundo conflito ou replay, ID esperado, timeout, perda de vínculo, rollback em cada ponto, snapshots/eventos imutáveis e ausência de órfãos. Comparar responseSnapshot de replay com resposta original após projeção pública e reautorização. Testes de serviço mockado não substituem constraints e transação reais.

## Evidências que devem ser registradas

Matriz operação×resultado×contagens, códigos de conflito, número de retries conhecidos, ordem observada de transições, resultados da barreira de concorrência, hashes apenas como conformidade sem valores internos sensíveis, exit codes, schemas descartados, triggers ativos e nenhuma conexão/processo residual.

## Condições de parada

Mais de um CURRENT, escrita parcial, ledger sem terminal confiável, replay após perda de acesso, trigger desabilitado, alteração da origem ambiental, necessidade de editar resultado histórico, migração incompatível ou retry indiscriminado. Corrigir apenas a implementação autorizada e revalidar; não enfraquecer constraints/testes.

## Critérios de conclusão

CREATE/REPLACE/REVOKE produzem transições e respostas contratuais; insuficiência/incompatibilidade não criam domínio; mesma chave/request repete terminal sem novas linhas; mesma chave divergente conflita; recuperação é contextual; concorrência tem um estado vencedor; cada falha injetada reverte integralmente; teste PostgreSQL real GREEN.

## Estado de saída esperado

Serviço de domínio completo e independente de HTTP/UI, pronto para handlers da etapa 04, com invariantes conferidas no banco.

## Checkpoint/commit sugerido

Sugestão futura: feat(ihfr): persist atomic diagnosis lifecycle and terminal operations. Escopo: serviço/store e testes focais de persistência/concorrência; sem commit nesta execução.
