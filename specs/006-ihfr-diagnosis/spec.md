# Feature Specification: Diagnóstico IHFR

**Feature Branch**: `006-ihfr-diagnosis`

**Created**: 2026-09-16

**Status**: Remediação documental focal concluída em 2026-09-20. A implementação técnica experimental T001–T134 foi encerrada em 2026-09-23 após a resolução explícita de `PD-018` e a repetição dos gates afetados. `G2-SCI` e a validação humana permanecem `VALIDACAO_POSTERIOR`.

**Input**: IMP-006 — calcular, tornar vigente e consultar um diagnóstico IHFR experimental ligado à coleta e à área de origem, com contrato versionado, proveniência e ciclo imutável. Esta consolidação prepara nova análise independente e não implementa a feature.

## Authority and Scope

- `DECISAO_CONFIRMADA` — a solicitação desta tarefa, em 2026-09-16, autoriza iniciar a documentação da IMP-006 a partir de `origin/development`, tratar IMP-001 a IMP-004 como integradas, consultar a IMP-005 publicada como trabalho em andamento e executar somente `$speckit-specify`. A solicitação não aprova conteúdo científico ausente nem libera implementação.
- `DECISAO_CONFIRMADA` — a solicitação de esclarecimento de 2026-09-16/17 autoriza executar somente `$speckit-clarify`, atualizar a spec e sua checklist e publicar as alterações na branch da IMP-006. Não autoriza planejamento, tarefas, implementação, alteração da IMP-005 ou documentação Code-First.
- `FATO_DOCUMENTADO` — o backlog Code-First identifica a IMP-006 como **Diagnóstico IHFR** e define como resultado que usuário autorizado obtenha ou consulte diagnóstico ligado à coleta e à área de origem. `CF-PRD-FR-008`, `CF-PRD-FR-009`, `CF-PRD-NFR-006`, `CF-UC-012`, `CF-UC-013` e `CF-PFLOW-006` sustentam associação, consulta, origem e versão disponível do algoritmo. O pacote permanece `EM_REVISAO`; seus requisitos são candidatos e não possuem aprovação normativa final.
- `FATO_DOCUMENTADO` — baseline original preservada: a IMP-006 nasceu sobre `origin/development` em `37fb3a4fbf7dda04b9bc3b9f2fc1c64ed3b14e13`, com a IMP-004 integrada. O levantamento inicial consultou a IMP-005 em `d3fade93e71473b88e44bb473fb2adb9718f2f4c`.
- `FATO_DOCUMENTADO` — reconciliação planejada preservada: em 2026-09-17, a revisão cruzada consultou a IMP-005 em `1235387ded9854be20a92f8639a502a80a2bd952`, commit `docs(spec): finalize IMP-005 contracts and tasks`. Naquele momento, `ihfr-measurement-v1`, o conjunto ambiental e sua fronteira HTTP ainda eram planejamento não integrado.
- `EVIDENCIA_IMPLEMENTACAO` — baseline integrada vigente: o PR #25 incorporou o head da IMP-005 `e775ebcdc1112c0d18117e4023a578a4ef62cf1c` a `origin/development` pelo merge commit `5d9ca6f8f848867e8152bc25e86abc9a6e73358f`. A branch IMP-006 incorporou essa baseline pelo merge normal `62b54fa8d98b2bce2c03d7b6e2181ed4c94ab07d`, preservando seus três commits documentais próprios.
- `EVIDENCIA_IMPLEMENTACAO` — a IMP-005 implementa a cadeia laboratório → área → coleta confirmada → `EnvironmentalMeasurementSet`, com associação contextual por UUID, um conjunto por coleta, payload JSONB fechado, autoria interna derivada da sessão, `confirmedAt` do servidor, imutabilidade, GET/POST contextual, idempotência/concorrência próprias, leitura em laboratório inativo e DTO público mínimo. O legado ambiental permanece preservado, sem backfill nem promoção para v1.
- `EVIDENCIA_IMPLEMENTACAO` — o conjunto ambiental persiste `measurementContractVersion = "ihfr-measurement-v1"`, `payloadHash` interno e `confirmationKey` própria. Não persiste `mathContractVersion`, `algorithmVersion` nem o `contractHash` normativo de um diagnóstico; esses elementos pertencem à futura cadeia científica do IHFR.
- `FATO_DOCUMENTADO` — a IMP-005 também publica `ihfr-math-contract-v1` como fronteira de formato e governança para consumo futuro. Ela exige manifesto e vetores dourados, mas não contém fórmula ativa, coeficientes, limiares ou aprovação científica do IHFR.
- `DECISAO_CONFIRMADA` — a solicitação da equipe de 2026-09-18 atribui ao professor Fábio Mesquita a concepção científica da formulação histórica, seleciona `DOC-RAW-013` como base da primeira versão experimental e autoriza um contrato provisório de engenharia. A decisão exige os rótulos `CONTRATO_EXPERIMENTAL`, `VALIDACAO_CIENTIFICA_PENDENTE`, `SUJEITO_A_RECALIBRACAO` e `NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO`.
- `DECISAO_CONFIRMADA` — [ADR-0001](../../docs/governance/ADR-0001-contrato-experimental-ihfr-v0-1.md) é o registro canônico da matemática, dos conflitos, da compatibilidade e do ciclo operacional. O manifesto ativo `ihfr-math-experimental-v0.1.1` tem `contractHash = sha256:f8104143f1505aceaa68a7ffa06fac50f4906cdfc4119609875d99c9fecc6f89`; a v0.1.0 permanece imutável e histórica.
- `DECISAO_EXPERIMENTAL_DE_ENGENHARIA` — a solicitação da equipe de 2026-09-19 confirmou focalmente a classificação de sete valores de `landUseType`, suas regras de predominância, invalidade, ausência, imutabilidade e aplicabilidade geral experimental. A seção 7 do ADR-0001 concentra fontes, hashes, alternativas e limites; não houve mudança do manifesto ou de seu hash.
- `EVIDENCIA_IMPLEMENTACAO` — o PR #27 incorporou a IMP-008 no merge `df856194b3341137d6d863feefcb0a203deb5905`, com head `c6c13f7dc97d4ed873f67cb99fb6c36d60579601`. A IMP-006 incorporou essa baseline pelo merge normal `96dac7c`, preservando seus 11 commits próprios e resolvendo somente metadados documentais concorrentes de governança.
- `EVIDENCIA_IMPLEMENTACAO` — a IMP-008 fornece uma projeção territorial privada e transitória de áreas-ponto e coletas confirmadas, com Leaflet/React-Leaflet, lista textual e endpoint próprio. Ela não consulta dados ambientais, não produz diagnóstico IHFR, não usa `landUseType`, não cria auditoria ou fonte de atividade e não altera schema, migrations ou contratos científicos integrados.
- `PENDENCIA_DE_DECISAO` — a validação científica definitiva por especialistas, os vetores científicos e os testes de campo permanecem futuros. Essa pendência não impede a construção experimental, mas impede apresentar seus resultados como ciência definitiva.
- `DECISAO_CONFIRMADA` — a remediação focal de 2026-09-20 resolve as inconsistências de entrada desconhecida, cardinalidade do suplemento, ordem executável, fixtures/teardown, contagem HTTP, condicionais do request, `areaId`, paralelismo, encerramento, migration path e checklist. Ela não implementa a feature nem antecipa validação científica.

## Clarifications

### Session 2026-09-16

- Q: Sob qual procedimento um diagnóstico individual deve adquirir o estado “aceito” antes de poder ser associado a uma coleta? → A: A autoridade científica aprova o procedimento e as evidências exigidas; cada diagnóstico conforme recebe evidência registrada de aceite, e exceções exigem revisão científica individual.
- Q: Quantos diagnósticos aceitos podem estar vigentes e disponíveis na consulta principal para a mesma coleta? → A: No máximo um diagnóstico vigente por coleta; anteriores permanecem preservados como não vigentes conforme o ciclo aprovado.
- Q: Após a associação ser confirmada, como substituição, revogação e correção devem funcionar sem alterar a evidência original? → A: Diagnóstico e associação confirmados são imutáveis; um novo diagnóstico aceito pode substituir o vigente, a revogação registra motivo e torna-o não vigente, e correções exigem novo diagnóstico aceito.

### Session 2026-09-17

- Q: Quais atores devem poder associar um diagnóstico aceito e quais devem poder consultá-lo no laboratório? → A: OWNER e ADMIN podem associar, substituir ou revogar; processo explicitamente autorizado também pode associar; OWNER, ADMIN e MEMBER com vínculo atual podem consultar.
- Q: Quais informações de proveniência do aceite devem aparecer ao participante na consulta normal do diagnóstico? → A: Mostrar coleta, área, referências do contrato e algoritmo, estado, data e procedimento de aceite; ocultar identidades do produtor/revisor e detalhes da evidência, reservando-os à auditoria autorizada.

As sessões anteriores ficam preservadas como histórico. A expressão antiga “diagnóstico aceito” passa a significar somente conformidade técnica com a versão experimental; não constitui aceite científico.

### Session 2026-09-18

- Q: Qual contrato foi inicialmente selecionado? → A: `ihfr-math-experimental-v0.1.0`, baseado em `DOC-RAW-013`, com pesos iguais e estado experimental; ele foi posteriormente preservado como histórico e substituído pela clarificação v0.1.1, sem mudança matemática. O perfil regional `35/30/25/10` permanece inativo.
- Q: A entrada integrada é suficiente? → A: Não integralmente. `landUseType` deve ser fornecido por `ihfr-diagnosis-input-experimental-v0.1.0`, e `slopePercent` deve estar presente; ausência de qualquer deles produz `INSUFFICIENT_DATA`.
- Q: Como separar engenharia e ciência? → A: `G2-ENG` depende apenas dessa evolução de entrada; `G2-SCI` permanece `NAO_VERIFICADO_VALIDACAO_POSTERIOR`.
- Q: Qual é o ciclo operacional mínimo? → A: avaliador determinístico interno, execução explícita por OWNER/ADMIN, resultado imutável, um vigente por coleta, substituição/revogação auditáveis, idempotência própria, concorrência transacional e recuperação pela chave da operação.

### Session 2026-09-19

- Q: Qual classificação de uso da terra governa a v0.1? → A: Os sete valores e scores de `DOC-RAW-013`, representados em `UPPER_SNAKE_CASE`, sem agrupamento ou categoria criada por inferência; `DOC-RAW-007` corrobora os seis scores não urbanos e `DOC-RAW-005` o domínio completo.
- Q: Como tratar uso misto, valor desconhecido e ausência? → A: Registrar uma única categoria predominante; sem predominância determinável, retornar `INSUFFICIENT_DATA`; token fora dos sete valores retorna `INVALID_INPUT`; não existe `OTHER` nem média entre categorias.
- Q: Qual é o alcance da decisão? → A: `DECISAO_EXPERIMENTAL_DE_ENGENHARIA`, perfil `GENERAL_EXPERIMENTAL` com aplicabilidade territorial científica não comprovada; `G2-ENG — landUseType` fica `RESOLVIDO_E_RASTREAVEL_PARA_V0_1_EXPERIMENTAL` e `G2-SCI` permanece `NAO_VERIFICADO_VALIDACAO_POSTERIOR`.

### Session 2026-09-20

- Q: Como distinguir ausência opcional de entrada desconhecida? → A: Campo opcional conhecido ausente, `null` permitido ou não aplicável é excluído da média; campo/enum desconhecido, alias, caixa divergente e `OTHER(S)` retornam `INVALID_INPUT`; `null` nunca vira zero. Dimensão obrigatória incalculável retorna `INSUFFICIENT_DATA`.
- Q: Um suplemento confirmado pode alimentar mais de um diagnóstico? → A: Sim. Ele pertence à coleta e pode ser referenciado por N diagnósticos compatíveis; a deduplicação é `UNIQUE(collectionDataId, payloadHash)`, sem unicidade de `inputSupplementId` no diagnóstico. Nova observação cria novo suplemento; nova versão matemática compatível pode reutilizá-lo.
- Q: Qual é o fechamento do contrato HTTP? → A: São seis operações HTTP e sete comportamentos; CREATE e REPLACE compartilham POST e usam `mode`. CREATE aceita ID vigente esperado ausente ou `null`; REPLACE exige UUID. Query de elegibilidade inválida retorna `400 INVALID_INPUT`, e `PublicDiagnosis.areaId` é obrigatório e derivado no servidor.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consultar diagnóstico experimental e sua origem (Priority: P1)

Como participante OWNER, ADMIN ou MEMBER com vínculo atual no laboratório, quero consultar o diagnóstico IHFR experimental vigente para uma coleta, para conhecer o resultado, seu caráter experimental e sua origem.

**Why this priority**: A consulta entrega valor verificável e impede que o resultado provisório seja confundido com validação científica definitiva.

**Independent Test**: Preparar um diagnóstico conforme ao manifesto experimental, ligado a uma coleta acessível, e verificar resultado, estado experimental, coleta, área, versões e `contractHash`.

**Acceptance Scenarios**:

1. **Given** diagnóstico experimental vigente e coleta acessível, **When** participante autorizado consulta, **Then** vê score, classe, componentes, qualidade, origem, vigência, versões, `contractHash` e os quatro rótulos de limitação, sem identidades ou evidências restritas (FR-001–FR-006, FR-009).
2. **Given** coleta acessível sem diagnóstico vigente, **When** participante consulta, **Then** vê ausência de diagnóstico, sem resultado, classe, qualidade, versão ou recomendação inventados (FR-005, FR-007).
3. **Given** laboratório inativo e participante ainda autorizado para leitura, **When** consulta diagnóstico existente, **Then** recebe a projeção permitida em modo somente leitura, sem ação de produção, associação ou alteração (FR-008).
4. **Given** recurso inexistente, pertencente a outro contexto ou vínculo revogado, **When** participante tenta consultar, **Then** não recebe dados e não consegue distinguir existência inacessível de inexistência (FR-001, FR-002, FR-009).
5. **Given** diagnóstico legado sem proveniência suficiente, **When** participante tenta consultá-lo pelo fluxo experimental, **Then** ele não é apresentado como conforme ao contrato experimental nem recebe referências fabricadas (FR-004, FR-010).

---

### User Story 2 - Calcular e tornar vigente o diagnóstico experimental (Priority: P2)

Como OWNER ou ADMIN com vínculo atual, quero iniciar o avaliador determinístico para uma coleta com entradas suficientes, para criar atomicamente um diagnóstico experimental rastreável e torná-lo vigente.

**Why this priority**: A decisão experimental agora define produção e ciclo; a dependência restante é a entrada suplementar versionada de uso da terra.

**Independent Test**: Com `ihfr-measurement-v1`, `slopePercent`, suplemento válido e manifesto pelo hash exato, calcular, persistir e consultar o único diagnóstico vigente, repetindo a chave para provar replay e concorrência segura.

**Acceptance Scenarios**:

1. **Given** coleta confirmada e acessível, entradas suficientes e OWNER/ADMIN autorizado, **When** inicia cálculo com chave própria, **Then** o backend avalia o manifesto exato e cria atomicamente um diagnóstico `CURRENT` ligado à cadeia de origem (FR-001–FR-004, FR-011–FR-014).
2. **Given** `landUseType` ou `slopePercent` ausente, dimensão insuficiente, contrato incompatível ou hash desconhecido, **When** há tentativa de cálculo, **Then** retorna `INSUFFICIENT_DATA` ou erro de compatibilidade sem criar diagnóstico vigente (FR-003, FR-004, FR-012).
3. **Given** coleta de outro contexto, **When** há tentativa de cálculo, **Then** a operação é recusada sem alterar coleta, conjunto ambiental ou diagnóstico existente (FR-002, FR-011, FR-012).
4. **Given** falha, timeout ou repetição da mesma tentativa, **When** o resultado é recuperado conforme G3, **Then** não há sucesso falso, associação parcial nem duplicação da mesma operação (FR-013).
5. **Given** laboratório inativo, **When** qualquer ator ou processo tenta produzir ou associar diagnóstico, **Then** a escrita é recusada mesmo por acesso direto (FR-008).
6. **Given** diagnóstico vigente e OWNER/ADMIN informa seu ID esperado, **When** confirma novo cálculo de substituição, **Then** o novo registro se torna o único `CURRENT` e o anterior fica `SUPERSEDED`, ambos imutáveis (FR-011, FR-013).
7. **Given** MEMBER ou processo interno sem contrato próprio, **When** tenta calcular, substituir ou revogar, **Then** a escrita é recusada (FR-001, FR-014).

### Edge Cases

- Vínculo, papel, elegibilidade ou estado do laboratório muda entre abertura e ação: revalidar o contexto atual; negar escrita e limitar leitura conforme a autorização vigente.
- Coleta pertence a outra área ou laboratório: resolver toda a cadeia de origem e recusar o cruzamento, sem confiar em identificador isolado.
- Dados ambientais existem, mas não satisfazem o manifesto experimental: não produzir diagnóstico por completude aparente.
- Contrato ou algoritmo muda entre leitura e cálculo: não reinterpretar resultado; exigir compatibilidade e persistir as referências efetivamente usadas.
- Dados ambientais ou contrato mudam depois do cálculo: não recalcular, reinterpretar, substituir nem revogar automaticamente; nova versão exige nova operação e preserva o histórico.
- Uso misto: exigir que a observação/registro autorizado indique uma única categoria predominante; não calcular média nem composição. Sem predominância determinável, retornar `INSUFFICIENT_DATA`.
- Categoria de uso desconhecida, alias, diferença de caixa, `OTHER` ou `OTHERS`: retornar `INVALID_INPUT`, sem fallback ou score neutro.
- Versão do algoritmo está ausente em registro legado: não fabricar versão nem promover o registro; ele permanece fora do fluxo experimental v0.1.
- Duas tentativas concorrentes: serializar por coleta; a primeira transição válida vence e a segunda reavalia o estado e retorna conflito.
- Novo diagnóstico concorre com o vigente: exigir o ID vigente esperado; nunca apresentar dois `CURRENT`.
- Diagnóstico vigente revogado: registrar motivo, transitar para `REVOKED` e apresentar ausência até nova substituição.
- Erro exige correção: criar novo diagnóstico e usar substituição; nunca editar o original.
- Resultado da operação desconhecido após timeout: consultar pela chave própria antes de apresentar sucesso.
- Resultado contém campos técnicos não aprovados para participantes: projetar somente conteúdo autorizado; não expor parâmetros internos, credenciais ou detalhes privilegiados.
- A consulta não deve apresentar interpretação, recomendação, gráfico, mapa ou histórico que pertença às IMP-007/008.

## Requirements *(mandatory)*

### Functional Requirements

Os requisitos definem comportamento seguro e rastreável para a v0.1 experimental. G1 está satisfeito; `G2-ENG — landUseType` está resolvido e rastreável; G2-SCI permanece futuro; G3 está consolidado para planejamento.

- **FR-001**: Toda consulta ou escrita MUST exigir principal autenticado, autorização contextual vigente e laboratório explicitamente selecionado. OWNER, ADMIN e MEMBER vinculados podem consultar. Somente OWNER e ADMIN podem calcular, substituir ou revogar; MEMBER e processo sem contrato próprio não executam escrita.
- **FR-002**: A operação MUST resolver laboratório autorizado, área subordinada, coleta subordinada e diagnóstico subordinado nessa ordem. Identificadores isolados MUST NOT conceder acesso nem permitir associação cruzada.
- **FR-003**: Produção MUST usar exatamente o manifesto ativo `ihfr-math-experimental-v0.1.1` e seu `contractHash`; MUST identificar o resultado como `CONTRATO_EXPERIMENTAL`, `VALIDACAO_CIENTIFICA_PENDENTE`, `SUJEITO_A_RECALIBRACAO` e `NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO`. A v0.1.0 MUST permanecer imutável, histórica e não ativável para novos diagnósticos.
- **FR-004**: O diagnóstico conforme MUST preservar área derivada no servidor, coleta, conjunto ambiental, suplemento, scores, `measurementContractVersion`, versão do suplemento, `mathContractVersion`, `algorithmVersion`, `contractHash` e `calculatedAt`. `PublicDiagnosis.areaId` MUST ser obrigatório e coerente com a coleta contextual. Nenhuma referência substitui outra.
- **FR-005**: A consulta normal MUST apresentar resultado experimental, origem, versões, hash, vigência e datas, sem identidades internas, chave idempotente, hashes internos de payload ou evidências restritas.
- **FR-006**: Versões e hashes MUST ser mostrados sem alteração. Referência ausente ou incompatível MUST impedir produção/conformidade e MUST NOT ser fabricada.
- **FR-007**: Ausência de diagnóstico vigente, `INSUFFICIENT_DATA`, zero, falha e resultado revogado MUST permanecer estados distintos.
- **FR-008**: Laboratório inativo MUST permitir somente a leitura autorizada de diagnóstico existente e MUST recusar produção, associação, substituição ou qualquer outra escrita, inclusive por acesso direto.
- **FR-009**: Recursos inexistentes e inacessíveis MUST ser indistinguíveis. A auditoria restrita MUST ser separada do DTO normal.
- **FR-010**: Diagnóstico legado MUST ser preservado sem promoção automática ao contrato experimental e sem backfill inventado.
- **FR-011**: Criação e associação MUST ser atômicas e preservar a cadeia laboratório → área → coleta → conjunto ambiental/suplemento → diagnóstico. Entradas e resultado confirmados MUST ser imutáveis. Um suplemento pertence à coleta e MAY ser referenciado por N diagnósticos compatíveis; MUST ser deduplicado por `(collectionDataId, payloadHash)` e `inputSupplementId` MUST NOT ser único no diagnóstico. Nova observação de uso da terra MUST criar novo suplemento; nova matemática compatível MAY reutilizar o suplemento existente.
- **FR-012**: A IMP-006 MUST consumir `ihfr-measurement-v1` e `ihfr-diagnosis-input-experimental-v0.1.0`. `landUseType` MUST usar exatamente um dos sete valores do manifesto e representar o uso predominante. Campo ou enum desconhecido, alias, caixa divergente, `OTHER`/`OTHERS` ou categoria concorrente MUST produzir `INVALID_INPUT` e MUST NOT ser ignorado. Campo opcional conhecido ausente, `null` quando permitido ou não aplicável MUST ser excluído da média; `null` MUST NOT virar zero. Ausência de entrada obrigatória, falta de predominância determinável ou dimensão obrigatória incalculável MUST produzir `INSUFFICIENT_DATA`. `CollectionArea.landType` livre, `soilTexture`, `landscapeDegradation`, `vegetationCoverPercent`, estruturas legadas, drenagem, elevação, declividade ou tamanho da área MUST NOT substituir `landUseType`. `slopePercent` ausente também MUST produzir `INSUFFICIENT_DATA`, sem redistribuir pesos.
- **FR-013**: Cada coleta MUST ter no máximo um diagnóstico `CURRENT`. Substituição cria novo registro e transita o anterior para `SUPERSEDED`; revogação registra motivo e transita para `REVOKED`; correção usa substituição. Concorrência MUST serializar por coleta e substituição MUST informar o ID vigente esperado.
- **FR-014**: Cada escrita MUST usar chave UUID própria e hash canônico da requisição. Replay idêntico no mesmo contexto preserva o resultado e status contratados, inclusive `422 ErrorEnvelope` no POST incompatível, sem nova escrita; chave divergente retorna conflito; timeout é recuperado por consulta contextual da chave. GET operation MUST reautorizar leitura para o mesmo ator ainda vinculado como OWNER/ADMIN/MEMBER, mesmo em laboratório inativo, e devolver `200 OperationResponse` para terminal existente no mesmo contexto. Vínculo perdido, outro ator, contexto cruzado ou chave inexistente recebem 404; chave malformada recebe `400 INVALID_INPUT`. A `confirmationKey` ambiental MUST NOT ser reutilizada.
- **FR-015**: O avaliador MUST ser puro, determinístico, server-side e sem IA generativa. Para v0.1, a implementação principal é interna ao backend TypeScript; Python, FastAPI, serviço externo, importação manual e processo autônomo ficam fora do escopo.
- **FR-016**: O cálculo MUST seguir o manifesto: quatro dimensões válidas, pelo menos dois scores por dimensão, `clamp` nas normalizações declaradas, classes contínuas, score interno não arredondado e arredondamento somente de apresentação.
- **FR-017**: Auditoria restrita MUST registrar ator, chave, hash da requisição, entradas de origem, versões/hash, resultado, transição, motivo e timestamps. Retenção e acesso seguem as políticas gerais aplicáveis a serem materializadas no plano sem ampliar o DTO público.
- **FR-018**: Dashboard, histórico, mapa, gráficos, recomendações, edição/exclusão de coleta, manutenção da IMP-005, Python, serviço externo e validação científica definitiva permanecem fora desta feature.
- **FR-019**: O contrato HTTP MUST expor seis operações e sete comportamentos funcionais. O POST de cálculo MUST discriminar CREATE/REPLACE por `mode`; CREATE aceita `expectedCurrentDiagnosisId` ausente ou `null`, REPLACE exige UUID. Query de elegibilidade malformada ou categoria inválida MUST retornar `400 INVALID_INPUT`; ausência válida ou predominância indeterminável MUST retornar elegibilidade com outcome `INSUFFICIENT_DATA`. Body, query ou header estrutural/sintaticamente inválido, inclusive campo obrigatório ausente, propriedade extra, UUID, enum ou tipo inválido, ou formato inválido de versão/`contractHash`, MUST retornar `400 INVALID_INPUT` após autenticação e autorização contextual. `VersionSelection` bem formada com `measurementContractVersion`, `mathContractVersion`, `algorithmVersion` ou `contractHash` incompatível com a combinação ativa/suportada MUST retornar `422 INCOMPATIBLE_VERSION`; a versão incompatível da medição persistida segue a mesma regra. O POST 422, novo ou repetido de forma idêntica, MUST usar `ErrorEnvelope`; a operação MUST registrar um único terminal no ledger, sem criar suplemento confirmado, diagnóstico, `CURRENT` ou evento de ciclo. Replay idêntico MUST ser sem novas escritas, e GET operation MUST recuperar o terminal como `200 OperationResponse` com `outcome = INCOMPATIBLE_VERSION`. O schema de entrada MUST validar formato sem usar `const` para essas versões; a saída garantida do diagnóstico ativo MUST manter seus valores exatos.
- **FR-020**: Testes PostgreSQL MUST usar schema isolado por execução, fixtures explícitas para todos os papéis, contextos, entidades e estados, e teardown verificável mesmo após falha. Triggers de imutabilidade MUST NOT ser desabilitados por cenário; rollback transacional, limpeza entre cenários, descarte do schema e recuperação operacional MUST permanecer mecanismos distintos.

### Key Entities

- **Diagnóstico IHFR experimental conforme**: resultado produzido exatamente pelo manifesto e algoritmo versionados, associado atomicamente à origem e rotulado como experimental. Não representa validação científica definitiva. Pode estar `CURRENT`, `SUPERSEDED` ou `REVOKED`; conteúdo e associação são imutáveis.
- **Coleta de origem**: registro confirmado integrado pela IMP-004, associado a área, laboratório e autoria histórica; não é editado pela associação do diagnóstico.
- **Dados ambientais aplicáveis**: `EnvironmentalMeasurementSet` integrado, integral, único e imutável por coleta, com água, solo, vegetação e terreno, autoria interna, `confirmedAt` e `measurementContractVersion = "ihfr-measurement-v1"`. Sua captura técnica implementada não prova adequação científica para cálculo IHFR. `payloadHash`, `confirmationKey` e autoria interna não pertencem automaticamente à projeção pública do diagnóstico.
- **Suplemento de diagnóstico**: entrada imutável `ihfr-diagnosis-input-experimental-v0.1.0`, pertencente à coleta e contendo o `landUseType` predominante com autoria derivada da sessão e instante. Pode ser referenciada por N diagnósticos compatíveis e é deduplicada por coleta/payload. Um candidato ausente pode gerar insuficiência, mas não vira suplemento confirmado.
- **Referência do contrato matemático experimental**: identifica manifesto, versão e hash exatos; não prova aprovação científica definitiva.
- **Referência do algoritmo**: identifica a implementação determinística usada e não substitui o contrato matemático.
- **Contexto de acesso**: pessoa elegível, vínculo atual, papel e estado do laboratório. OWNER/ADMIN escrevem e consultam; MEMBER somente consulta.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em 100% dos cenários de consulta, o participante autorizado identifica resultado, caráter experimental, origem, versões, `contractHash`, vigência e datas, sem identidade ou evidência restrita (US1).
- **SC-002**: Na matriz com ao menos dois laboratórios, duas áreas e duas coletas, zero diagnóstico é consultado ou associado fora de sua cadeia autorizada de origem (US1/US2).
- **SC-003**: Em 100% dos casos sem diagnóstico vigente, a experiência comunica ausência sem fabricar zero, classe, qualidade, versão ou resultado padrão (US1).
- **SC-004**: Todos os vetores técnicos do manifesto reproduzem scores por variável/dimensão, score final, apresentação, classe, qualidade e insuficiência dentro da tolerância `1e-12`; esses vetores não são chamados de científicos (US2).
- **SC-005**: Na matriz OWNER/ADMIN/MEMBER, MEMBER executa zero escrita, laboratório inativo admite zero escrita e recursos inexistentes/inacessíveis são indistinguíveis (US1/US2).
- **SC-006**: Falha, replay, concorrência, substituição, revogação, correção e timeout terminam sem sucesso falso, associação parcial, alteração das entradas, duplicação da operação ou mais de um `CURRENT` (US2).
- **SC-007**: Ausência de `landUseType`, ausência de `slopePercent` ou qualquer dimensão insuficiente produz `INSUFFICIENT_DATA` e zero diagnóstico vigente (US2).
- **SC-008**: Em toda execução PostgreSQL, fixtures cobrem OWNER/ADMIN/MEMBER, vínculo atual/revogado, laboratório ativo/inativo, contexto próprio/cruzado, coleta com/sem conjunto e diagnóstico CURRENT/SUPERSEDED/REVOKED; após sucesso ou falha, o schema isolado é removido sem registros órfãos nem processos deixados em execução.

Esses critérios são metas verificáveis, não resultados já alcançados. Vetores científicos, calibração e validação de campo permanecem em G2-SCI e não são substituídos pelos testes técnicos.

## Assumptions

### Baseline técnico integrado da IMP-005

`EVIDENCIA_IMPLEMENTACAO` — os contratos abaixo existem em `origin/development` `5d9ca6f8f848867e8152bc25e86abc9a6e73358f`, trazidos pelo head `e775ebcdc1112c0d18117e4023a578a4ef62cf1c` da IMP-005:

- `LaboratoryRoom` → `CollectionArea` → `CollectionData` confirmada → zero ou um `EnvironmentalMeasurementSet`, com UUIDs e verificação contextual de laboratório, área e coleta;
- `EnvironmentalMeasurementSet.collectionDataId` obrigatório e único, FKs restritivas e trigger que bloqueia `UPDATE`/`DELETE` depois da confirmação;
- payload JSONB fechado contendo obrigatoriamente os grupos `water`, `soil`, `vegetation` e `terrain`; campos extras, grupos ausentes, enums desconhecidos e números não finitos são recusados;
- opcionais ausentes são normalizados para `null`, enquanto zero e `false` permanecem valores informados;
- água: fonte enum obrigatória, `hasSpring` boolean obrigatório, profundidade opcional em metros `>= 0` apenas para poços, disponibilidade enum obrigatória e salinidade enum opcional;
- solo: textura, compactação e erosão obrigatórias, infiltração obrigatória em mm/h `>= 0` e solo exposto opcional entre 0% e 100%;
- vegetação: cobertura obrigatória entre 0% e 100%, fragmentação e degradação obrigatórias e presença de APP ripária opcional;
- terreno: densidade de drenagem opcional em km/km² `>= 0`, elevação opcional em metros com negativos permitidos e declividade opcional `>= 0`;
- `confirmedAt` definido no servidor, autoria interna derivada da sessão, `measurementContractVersion = "ihfr-measurement-v1"`, `payloadHash` SHA-256 interno e `confirmationKey` UUID própria da confirmação ambiental;
- POST cria com `201` ou recupera replay idêntico com `200`; divergência de chave/contexto/conteúdo e segundo conjunto geram conflito sem sobrescrita; concorrência preserva um único conjunto;
- GET retorna `{ environmentalData: PublicEnvironmentalData | null }`; o DTO público contém ID do conjunto, ID da coleta, versão de medição, confirmação, `readOnly` e os quatro grupos, sem `userId`, `confirmationKey`, `payloadHash`, credenciais ou diagnóstico;
- `OWNER`, `ADMIN` e `MEMBER` vinculados podem registrar e consultar; laboratório inativo mantém leitura e recusa mutação;
- `WaterData`, `SoilData`, `VegetationData` e `TerrainData` permanecem como legado sem backfill, publicação ou promoção automática a `ihfr-measurement-v1`.

O conjunto ambiental não implementa `mathContractVersion`, `algorithmVersion` nem `contractHash`. O model legado `IHFRDiagnosis`, seu default `algorithmVersion = "1.0.0"`, classes, scores, qualidade e `explanationAI` não podem ser promovidos ao contrato experimental por inferência.

### Dependências e gates materiais

| Gate | Classificação e fonte | Evidência exigida para liberação | Impacto atual |
|---|---|---|---|
| G1 — Dados ambientais integrados | `EVIDENCIA_IMPLEMENTACAO`: IMP-005 `e775ebc` integrada pelo PR #25 no merge `5d9ca6f`; baseline incorporada à IMP-006 em `62b54fa` | Entidade, contrato, API, migration, autorização, testes, imutabilidade e legado reconciliados; conjunto confirmado disponível sem alterar a coleta | **FECHADO** em 2026-09-18. A IMP-006 deve consumir o contrato real descrito acima sem ampliar sua autoridade científica |
| G2-ENG — Contrato experimental | `DECISAO_CONFIRMADA`: ADR-0001 e manifesto ativo `ihfr-math-experimental-v0.1.1`; v0.1.0 histórica preservada | Manifesto/hash, fórmula, mapeamentos, ausências, classes, precisão, entrada suplementar e vetores técnicos definidos | `RESOLVIDO_PARA_PLANEJAMENTO`; implementação pendente |
| G2-ENG — `landUseType` | `DECISAO_EXPERIMENTAL_DE_ENGENHARIA`: ADR-0001 §7 | Sete categorias/scores, predominância, desconhecido, ausência, origem, imutabilidade, escopo e alternativas rastreados | `RESOLVIDO_E_RASTREAVEL_PARA_V0_1_EXPERIMENTAL` |
| G2-SCI — Validação definitiva | `PENDENCIA_DE_DECISAO`: revisão especializada e campo | Pareceres, calibração, comparação, vetores científicos, amostra, método, métricas e limitações | `NAO_VERIFICADO_VALIDACAO_POSTERIOR`; não bloqueia construção experimental rotulada, mas proíbe alegação definitiva |
| G3-ENG — Produção, responsabilidade e ciclo | `DECISAO_CONFIRMADA`: ADR-0001 §10 | Avaliador interno determinístico, OWNER/ADMIN, imutabilidade, estados, chave própria, concorrência, recuperação e auditoria definidos | `RESOLVIDO_DOCUMENTALMENTE_PARA_PLANEJAMENTO_V0_1`; implementação pendente |

O escopo documental, o plano e as tarefas `T001–T134` remediados estão prontos para nova execução independente de `$speckit-analyze`. A ordem executável começa por setup e caracterização da baseline, segue por preflight de banco, design Prisma, migration, validação/aplicação isolada, geração do client, fixtures, shells compiláveis, RED comportamental, implementação, verdes e regressões; teardown, evidências e encerramento vêm por último. Implementação permanece posterior e condicionada ao resultado dessa análise.

As invariantes de G3 vigentes são as do ADR-0001 §10: OWNER/ADMIN calculam e transitam; MEMBER consulta; processo autônomo fica adiado; há no máximo um `CURRENT`; registros e entradas são imutáveis; transições são auditáveis; consulta expõe proveniência mínima e estado experimental sem identidades restritas.

`DECISAO_CONFIRMADA` — correção, complementação ou mudança de versão nunca altera ou reinterpreta diagnóstico existente. Nova entrada/versão exige nova operação de substituição; o registro anterior permanece preservado.

### Reconciliação documental com a IMP-005

Histórico preservado: a primeira leitura usou `d3fade93e71473b88e44bb473fb2adb9718f2f4c`; a reconciliação planejada de 2026-09-17 usou `1235387ded9854be20a92f8639a502a80a2bd952`. A reconciliação vigente inspeciona a implementação `e775ebcdc1112c0d18117e4023a578a4ef62cf1c`, integrada em `origin/development` `5d9ca6f8f848867e8152bc25e86abc9a6e73358f`. Os estados abaixo distinguem contrato implementado de ciência e operação ainda pendentes.

| Pergunta ou dependência | Evidência precisa na IMP-005 | Estado | Autoridade da fonte | Impacto na IMP-006 | Ação necessária |
|---|---|---|---|---|---|
| 1. Identidade estável de coleta, área e laboratório | Schema, migration e lookup contextual em `environmental-data.service.ts` | `IMPLEMENTADA` | `EVIDENCIA_IMPLEMENTACAO` | A origem pode usar UUIDs e a cadeia integrada sem realocar a coleta | Reutilizar a cadeia; não confiar em ID isolado |
| 2. Estrutura ambiental consumível | `EnvironmentalMeasurementSet`, parser, tipos e migration; `measurement-contract-v1.md` | `IMPLEMENTADA` | `EVIDENCIA_IMPLEMENTACAO` técnica/de dados | Existe um conjunto único, fechado e imutável com quatro grupos | Consumir somente essa entidade/DTO; não usar tabelas legadas como v1 |
| 3. Campos, tipos, enums, unidades, nulabilidade e limites | `environmental-data.validation.ts`, tipos, OpenAPI, contrato e testes | `IMPLEMENTADA_PARA_CAPTURA` | `EVIDENCIA_IMPLEMENTACAO` | Compatível com o manifesto salvo `landUseType`; limites superiores são tratados por `clamp` no avaliador | Criar suplemento versionado e exigir declividade presente |
| 4. Versões e proveniência ambiental | Schema/DTO implementam `measurementContractVersion`; interno registra `payloadHash`, `confirmationKey`, autoria e `confirmedAt` | `PARCIALMENTE_RESPONDIDA` | `EVIDENCIA_IMPLEMENTACAO` | Versão ambiental existe; as referências matemáticas pertencerão ao diagnóstico | Persistir as quatro referências separadas e o suplemento |
| 5. Relação entre dados, versões e diagnóstico | `math-contract-v1.md`, ADR-0001 e manifesto experimental | `RESPONDIDA_PARA_V0_1_EXPERIMENTAL` | `DECISAO_CONFIRMADA` de engenharia; ciência definitiva pendente | Existe contrato ativável após a evolução de entrada | Verificar o hash e recusar incompatibilidade |
| 6. API e DTO ambiental | GET/POST contextual, OpenAPI, `PublicEnvironmentalData`, `no-store` e erros sanitizados | `IMPLEMENTADA` | `EVIDENCIA_IMPLEMENTACAO` | A IMP-006 consome a fronteira sem modificá-la | Planejar contrato próprio do suplemento/diagnóstico |
| 7. Imutabilidade, idempotência, concorrência e recuperação ambiental | Trigger, constraints, transação serializável, replay e testes | `IMPLEMENTADA_PARA_AMBIENTAL` | `EVIDENCIA_IMPLEMENTACAO` | Padrão observado; G3 definiu semântica própria do diagnóstico | Criar chave, hash e consulta de recuperação próprios |
| 8. Identidade e responsabilização do produtor | Autoria ambiental existe; ADR-0001 define iniciador humano e avaliador interno | `RESPONDIDA_PARA_V0_1` | `DECISAO_CONFIRMADA` | OWNER/ADMIN inicia; backend determinístico produz; processo autônomo adiado | Persistir ator na auditoria restrita |
| 9. Legado ambiental e `IHFRDiagnosis` | Migration aditiva e testes preservam legado; código IMP-005 não lê nem publica esses models | `RESPONDIDA_PARA_PRESERVACAO` | `EVIDENCIA_IMPLEMENTACAO` | Não há promoção, backfill ou autoridade científica implícita | Manter legado fora do fluxo experimental v0.1; não o promover automaticamente |
| 10. Efeito de mudanças posteriores | Contratos separam versões; ADR-0001 define imutabilidade e substituição | `RESPONDIDA_PARA_V0_1` | `DECISAO_CONFIRMADA` | Nenhum efeito automático; nova versão produz novo registro | Preservar histórico e compatibilidade explícita |

### Fronteiras com outras entregas

- **IMP-001 a IMP-004 — integradas**: fornecem acesso autenticado, laboratório, área e coleta confirmada. A IMP-006 deve preservar seus contratos observados na base integrada.
- **IMP-005 — integrada**: o head `e775ebc` fornece o conjunto ambiental versionado implementado; sua fronteira matemática futura continua sem ciência ativável.
- **IMP-007 — integrada sem projeção de diagnóstico**: o PR #26 integrou `9e3a818be1690298e70586ac640151fecba02b82` a `origin/development` no merge `10fdb8bbb8e4895614575fedc9de8e08a5121afe`. A IMP-006 incorporou essa baseline pelo merge normal `36243f4`. Resumo e histórico continuam sem DTO, evento, link, score, classe ou projeção de diagnóstico; a IMP-006 não modifica a IMP-007.
- **IMP-008 — integrada sem camada IHFR**: o PR #27 fornece mapa territorial Leaflet e lista acessível como fonte visual independente sobre áreas e coletas confirmadas. Coordenadas, pontos, relações territoriais e `CollectionArea.landType` não substituem `landUseType` nem qualquer entrada científica ausente. A IMP-006 não adiciona score, classe, risco, cor, gráfico ou diagnóstico ao mapa e não usa sua auditoria restrita como fonte pública. Visualização territorial do IHFR exige reconciliação futura, requisito e contrato próprios. Plotly permanece direção futura posterior à IMP-009 e fora desta implementação; Leaflet não executa nem substitui o avaliador IHFR.

### Fora do escopo

Validação científica definitiva, calibração regional, perfil `35/30/25/10`, Python/FastAPI, serviço externo, processo autônomo, edição dos dados da IMP-005, dashboard, histórico, mapa, gráficos, recomendações e IA. Esta consolidação atualiza as tarefas, mas não executa análise independente nem implementação.

### Fontes e baseline

Baseline original: `origin/development` `37fb3a4fbf7dda04b9bc3b9f2fc1c64ed3b14e13`, com IMP-004 integrada. Reconciliação planejada: IMP-005 `1235387ded9854be20a92f8639a502a80a2bd952`, sucedendo a leitura inicial `d3fade93e71473b88e44bb473fb2adb9718f2f4c`. Baselines integradas preservadas: head IMP-005 `e775ebcdc1112c0d18117e4023a578a4ef62cf1c`, merge PR #25 `5d9ca6f8f848867e8152bc25e86abc9a6e73358f`, incorporado à IMP-006 por `62b54fa8d98b2bce2c03d7b6e2181ed4c94ab07d`; head IMP-007 `9e3a818be1690298e70586ac640151fecba02b82`, merge PR #26 `10fdb8bbb8e4895614575fedc9de8e08a5121afe`, incorporado por `36243f4`; head IMP-008 `c6c13f7dc97d4ed873f67cb99fb6c36d60579601`, merge PR #27 e novo `origin/development` `df856194b3341137d6d863feefcb0a203deb5905`, incorporado à IMP-006 pelo merge normal `96dac7c`. `origin/development@df85619` é ancestral do HEAD reconciliado. Foram relidos os artefatos das IMP-006/008, os contratos relevantes das IMP-005/007 e o delta completo do PR #27. O pacote Code-First não foi promovido a autoridade científica; implementação técnica não foi promovida a aprovação científica.
