# Feature Specification: Diagnóstico IHFR

**Feature Branch**: `006-ihfr-diagnosis`

**Created**: 2026-09-16

**Status**: Especificação reconciliada com a IMP-005 integrada; G1 fechado; pronta somente para `$speckit-plan` condicionado, com implementação bloqueada por G2–G3.

**Input**: IMP-006 — permitir que usuário autorizado associe ou obtenha e consulte um diagnóstico IHFR ligado à coleta e à área de origem, sem presumir o mecanismo de produção nem o contrato científico ainda pendentes. Executar somente `$speckit-specify`, com commit e publicação da branch, sem implementação.

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
- `PENDENCIA_DE_DECISAO` — `CF-PD-005` e `CF-Q-011` mantêm abertos conteúdo do resultado, fórmula, normalizações, pesos, classes, limiares, qualidade científica, validação, versão matemática ativável, relação completa contrato–algoritmo e forma de produção. Produto, ciência, dados e arquitetura devem decidir os respectivos assuntos com origem registrada; a aprovação técnica de captura da IMP-005 não possui autoridade para encerrá-los.
- `RECOMENDACAO` — tratar associação e consulta como fronteiras separáveis permite especificar a rastreabilidade sem escolher cálculo interno, componente Python, importação, registro manual ou serviço externo. Esta recomendação não seleciona mecanismo nem libera implementação.

## Clarifications

### Session 2026-09-16

- Q: Sob qual procedimento um diagnóstico individual deve adquirir o estado “aceito” antes de poder ser associado a uma coleta? → A: A autoridade científica aprova o procedimento e as evidências exigidas; cada diagnóstico conforme recebe evidência registrada de aceite, e exceções exigem revisão científica individual.
- Q: Quantos diagnósticos aceitos podem estar vigentes e disponíveis na consulta principal para a mesma coleta? → A: No máximo um diagnóstico vigente por coleta; anteriores permanecem preservados como não vigentes conforme o ciclo aprovado.
- Q: Após a associação ser confirmada, como substituição, revogação e correção devem funcionar sem alterar a evidência original? → A: Diagnóstico e associação confirmados são imutáveis; um novo diagnóstico aceito pode substituir o vigente, a revogação registra motivo e torna-o não vigente, e correções exigem novo diagnóstico aceito.

### Session 2026-09-17

- Q: Quais atores devem poder associar um diagnóstico aceito e quais devem poder consultá-lo no laboratório? → A: OWNER e ADMIN podem associar, substituir ou revogar; processo explicitamente autorizado também pode associar; OWNER, ADMIN e MEMBER com vínculo atual podem consultar.
- Q: Quais informações de proveniência do aceite devem aparecer ao participante na consulta normal do diagnóstico? → A: Mostrar coleta, área, referências do contrato e algoritmo, estado, data e procedimento de aceite; ocultar identidades do produtor/revisor e detalhes da evidência, reservando-os à auditoria autorizada.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consultar diagnóstico e sua origem (Priority: P1)

Como participante OWNER, ADMIN ou MEMBER com vínculo atual no laboratório, quero consultar o diagnóstico IHFR já aceito para uma coleta, para conhecer o resultado disponível e confirmar de qual coleta e área ele se originou.

**Why this priority**: A consulta entrega valor verificável sem pressupor como o diagnóstico foi produzido e protege a rastreabilidade científica mínima da IMP-006.

**Independent Test**: Preparar um diagnóstico aceito segundo G2, ligado a uma coleta acessível, e verificar a consulta do resultado, da coleta, da área e das referências científicas aprovadas. O teste não precisa produzir um novo diagnóstico nem usar a jornada da história 2.

**Acceptance Scenarios**:

1. **Given** diagnóstico aceito e associado a coleta acessível, **When** participante autorizado consulta o resultado no contexto explícito do laboratório e da área, **Then** vê o conteúdo aprovado em G2, a coleta e a área de origem, as referências do contrato e algoritmo e o estado, a data e o procedimento de aceite, sem identidades ou evidências restritas (FR-001–FR-006, FR-009).
2. **Given** coleta acessível sem diagnóstico aceito, **When** participante consulta, **Then** vê ausência de diagnóstico, sem resultado, classe, qualidade, versão ou recomendação inventados (FR-005, FR-007).
3. **Given** laboratório inativo e participante ainda autorizado para leitura, **When** consulta diagnóstico existente, **Then** recebe a projeção permitida em modo somente leitura, sem ação de produção, associação ou alteração (FR-008).
4. **Given** recurso inexistente, pertencente a outro contexto ou vínculo revogado, **When** participante tenta consultar, **Then** não recebe dados e não consegue distinguir existência inacessível de inexistência (FR-001, FR-002, FR-009).
5. **Given** diagnóstico legado sem proveniência suficiente para G2, **When** participante tenta consultá-lo pelo fluxo validado, **Then** ele não é apresentado como diagnóstico cientificamente aceito nem recebe referências fabricadas (FR-004, FR-010).

---

### User Story 2 - Associar diagnóstico aceito à coleta (Priority: P2)

Como participante OWNER ou ADMIN com vínculo atual, ou como processo explicitamente autorizado e responsabilizado, quero associar um diagnóstico IHFR aceito à coleta que o originou, para preservar sua proveniência e torná-lo consultável no contexto correto.

**Why this priority**: A associação habilita novos diagnósticos, mas depende materialmente do contrato científico, do mecanismo de produção e da matriz de responsabilidade ainda abertos.

**Independent Test**: Com diagnóstico aceito preparado segundo G2/G3 e coleta com dados aplicáveis preparados pela IMP-005, executar apenas a associação autorizada e verificar a cadeia laboratório → área → coleta → diagnóstico. O teste não depende da interface de consulta da história 1 para conferir a relação em um ensaio isolado.

**Acceptance Scenarios**:

1. **Given** coleta confirmada e acessível, dados ambientais aplicáveis, diagnóstico aceito e ator autorizado pelo mecanismo aprovado, **When** solicita a associação, **Then** o diagnóstico fica ligado exatamente à coleta de origem e, por ela, à área e ao laboratório corretos (FR-001–FR-004, FR-011).
2. **Given** diagnóstico sem contrato, validação, proveniência ou compatibilidade exigida por G2, **When** há tentativa de associação, **Then** a operação permanece indisponível ou é recusada e nenhum diagnóstico válido é publicado (FR-003, FR-004, FR-010).
3. **Given** coleta e diagnóstico de contextos incompatíveis, **When** há tentativa de associação, **Then** a operação é recusada sem alterar coleta, dados ambientais ou diagnóstico já aceito (FR-002, FR-011, FR-012).
4. **Given** falha, timeout ou repetição da mesma tentativa, **When** o resultado é recuperado conforme G3, **Then** não há sucesso falso, associação parcial nem duplicação da mesma operação (FR-013).
5. **Given** laboratório inativo, **When** qualquer ator ou processo tenta produzir ou associar diagnóstico, **Then** a escrita é recusada mesmo por acesso direto (FR-008).
6. **Given** diagnóstico vigente e um novo diagnóstico aceito para a mesma coleta, **When** a substituição autorizada é confirmada, **Then** o novo diagnóstico se torna o único vigente e o anterior e sua associação permanecem imutáveis como não vigentes (FR-011, FR-013).
7. **Given** participante MEMBER ou processo sem autorização explícita, **When** tenta associar, substituir ou revogar, **Then** a escrita é recusada; o processo autorizado pode associar, mas não substituir nem revogar (FR-001).

### Edge Cases

- Vínculo, papel, elegibilidade ou estado do laboratório muda entre abertura e ação: revalidar o contexto atual; negar escrita e limitar leitura conforme a autorização vigente.
- Coleta pertence a outra área ou laboratório: resolver toda a cadeia de origem e recusar o cruzamento, sem confiar em identificador isolado.
- Dados ambientais existem, mas ainda não satisfazem o contrato científico aplicável: não produzir nem aceitar diagnóstico por completude aparente.
- Contrato científico ou algoritmo muda entre produção e associação: não reinterpretar resultado; aplicar somente regra de compatibilidade e vigência aprovada em G2.
- Dados ambientais ou seu contrato na IMP-005 mudam depois do aceite: não recalcular, reinterpretar, substituir nem revogar automaticamente o diagnóstico; o efeito depende de decisão científica, de produto e de dados em G2/G3.
- Versão do algoritmo está ausente em registro legado: não fabricar versão. G2 define se o registro pode ser classificado, migrado ou consultado e sob qual identificação.
- Duas tentativas concorrentes apresentam resultados diferentes para a mesma coleta: G3 deve definir identidade, precedência, transição de vigência e resolução; igualdade ou diferença de valores, isoladamente, não decide o conflito, e no máximo um diagnóstico pode terminar vigente.
- Um novo diagnóstico aceito concorre com o diagnóstico vigente da coleta: não apresentar ambos como vigentes; preservar o anterior como não vigente somente pela transição aprovada em G3.
- Um diagnóstico vigente é revogado: registrar o motivo, torná-lo não vigente sem apagar ou modificar o diagnóstico ou a associação original e apresentar ausência de diagnóstico vigente até eventual substituição aceita.
- Um diagnóstico contém erro que exige correção: não editar o registro aceito; exigir novo diagnóstico aceito e usar a transição de substituição.
- Diagnóstico foi produzido, mas sua associação tem resultado desconhecido: não mostrar sucesso até recuperar estado confiável conforme G3.
- Resultado contém campos técnicos não aprovados para participantes: projetar somente conteúdo autorizado; não expor parâmetros internos, credenciais ou detalhes privilegiados.
- A consulta não deve apresentar interpretação, recomendação, gráfico, mapa ou histórico que pertença às IMP-007/008.

## Requirements *(mandatory)*

### Functional Requirements

Os requisitos definem comportamento seguro e rastreável. G1 está satisfeito pela integração real da IMP-005; G2–G3 permanecem precondições materiais e impedem transformar o recorte condicionado em fluxo implementável.

- **FR-001**: Toda consulta ou associação MUST exigir principal autenticado, autorização contextual vigente e laboratório explicitamente selecionado. Para pessoas, conta elegível e vínculo atual são obrigatórios; autoria histórica ou papel global MUST NOT substituir vínculo vigente. OWNER, ADMIN e MEMBER com vínculo atual podem consultar. Somente OWNER e ADMIN com vínculo atual podem associar, substituir ou revogar. Processo com identidade, autorização explícita, responsabilização e vínculo contextual aprovados em G3 pode associar, mas não consultar, substituir nem revogar.
- **FR-002**: A operação MUST resolver laboratório autorizado, área subordinada, coleta subordinada e diagnóstico subordinado nessa ordem. Identificadores isolados MUST NOT conceder acesso nem permitir associação cruzada.
- **FR-003**: G1 está satisfeito pela integração da IMP-005. A capacidade de produzir, aceitar ou associar diagnóstico MUST permanecer indisponível até G2–G3 estarem satisfeitos. Nenhum mecanismo ou regra científica MUST ser inferido de schema, documentação histórica ou alternativa técnica.
- **FR-004**: Um diagnóstico aceito MUST possuir evidência registrada de conformidade emitida pelo procedimento e pelos critérios aprovados pela autoridade científica em G2, além de preservar a coleta de origem e as referências de proveniência. Quando aplicáveis, `measurementContractVersion`, `mathContractVersion`, `algorithmVersion` e `contractHash` MUST ser preservados separadamente no nível aprovado; nenhuma dessas referências substitui outra. Exceções ao procedimento MUST exigir revisão científica individual registrada. A evidência completa e as identidades do produtor/revisor MUST ficar restritas à auditoria autorizada.
- **FR-005**: A consulta normal MUST apresentar somente o conteúdo e a interpretação aprovados em G2, coleta e área de origem, referências do contrato e algoritmo e estado, data e procedimento de aceite. MUST NOT expor identidades do produtor/revisor, detalhes da evidência restrita nem afirmar fórmula, classe, limiar ou qualidade ausentes.
- **FR-006**: Quando uma referência aprovada de versão estiver disponível, a consulta MUST mostrá-la sem alteração. Quando uma referência exigida estiver ausente, o sistema MUST seguir a classificação decidida em G2 e MUST NOT inventá-la.
- **FR-007**: Ausência de diagnóstico aceito MUST ser distinguida de valor zero, classe mínima, falha de cálculo ou diagnóstico incompleto; nenhum resultado padrão MUST ser fabricado.
- **FR-008**: Laboratório inativo MUST permitir somente a leitura autorizada de diagnóstico existente e MUST recusar produção, associação, substituição ou qualquer outra escrita, inclusive por acesso direto.
- **FR-009**: Recursos inexistentes e inacessíveis MUST ter comportamento indistinguível. Respostas de consulta normal MUST NOT expor dados científicos não aprovados, identidades do produtor/revisor, autoria interna, evidências restritas, credenciais ou detalhes privilegiados. O mecanismo de auditoria autorizada não pertence à superfície normal desta feature.
- **FR-010**: Diagnóstico legado ou de proveniência insuficiente MUST ser preservado sem promoção automática a cientificamente aceito, sem backfill inventado e sem publicação no fluxo validado até decisão de G2.
- **FR-011**: Associar diagnóstico MUST preservar uma única cadeia de origem válida laboratório → área → coleta → diagnóstico e MUST NOT realocar ou editar a coleta confirmada nem seus dados ambientais. Diagnóstico e associação confirmados MUST permanecer imutáveis.
- **FR-012**: A IMP-006 MUST consumir somente o `EnvironmentalMeasurementSet` integrado e sua `measurementContractVersion`, pela cadeia contextual laboratório → área → coleta confirmada. MUST validar compatibilidade explícita com o contrato matemático aprovado, MUST NOT tratar as quatro estruturas legadas como `ihfr-measurement-v1` e MUST NOT completar, corrigir, converter ou reinterpretar dados para viabilizar um diagnóstico. A `confirmationKey` e a idempotência da operação ambiental MUST NOT ser reutilizadas automaticamente como identidade da produção, aceite ou associação do diagnóstico.
- **FR-013**: Cada coleta MUST possuir no máximo um diagnóstico vigente e disponível na consulta principal. Substituição MUST tornar vigente um novo diagnóstico aceito e preservar o anterior como não vigente; revogação MUST registrar motivo e tornar o diagnóstico não vigente; correção MUST ocorrer por novo diagnóstico aceito, nunca por edição do original. Falha, timeout, repetição ou concorrência MUST NOT resultar em sucesso falso, associação parcial, duplicação da mesma operação ou dois diagnósticos vigentes. Identidade, autorização das transições e recuperação MUST seguir G3.
- **FR-014**: A feature MUST manter neutra a forma de produção do diagnóstico até decisão competente; cálculo interno, componente Python, importação, registro manual e serviço externo não são aprovados por esta spec.
- **FR-015**: A feature MUST NOT incluir dashboard, histórico, mapa, gráficos, recomendações, IA, edição/exclusão de coleta, manutenção dos dados ambientais ou definição de arquitetura, schema, endpoints e bibliotecas.

### Key Entities

- **Diagnóstico IHFR aceito**: resultado reconhecido conforme procedimento e critérios aprovados pela autoridade científica em G2, com evidência registrada de conformidade ou, em caso de exceção, revisão científica individual registrada, associado a uma coleta de origem. A consulta normal expõe a cadeia de origem, referências, estado, data e procedimento de aceite, mas não identidades do produtor/revisor nem a evidência restrita. Cada coleta possui no máximo um diagnóstico vigente; o original e sua associação são imutáveis, e registros substituídos, revogados ou corrigidos permanecem preservados como não vigentes. Conteúdo, classes, qualidade, responsáveis pelas transições e demais estados do ciclo permanecem pendentes; a estrutura técnica existente não os aprova.
- **Coleta de origem**: registro confirmado integrado pela IMP-004, associado a área, laboratório e autoria histórica; não é editado pela associação do diagnóstico.
- **Dados ambientais aplicáveis**: `EnvironmentalMeasurementSet` integrado, integral, único e imutável por coleta, com água, solo, vegetação e terreno, autoria interna, `confirmedAt` e `measurementContractVersion = "ihfr-measurement-v1"`. Sua captura técnica implementada não prova adequação científica para cálculo IHFR. `payloadHash`, `confirmationKey` e autoria interna não pertencem automaticamente à projeção pública do diagnóstico.
- **Referência do contrato científico**: identifica as regras científicas sob as quais dados e diagnóstico podem ser aceitos; nível, vigência, evolução e representação dependem de G2.
- **Referência do algoritmo**: identifica a versão do procedimento que produziu o diagnóstico no nível aprovado; não prova aprovação científica e não substitui a referência do contrato.
- **Contexto de acesso**: pessoa elegível, vínculo atual, papel e estado do laboratório. OWNER, ADMIN e MEMBER podem consultar; OWNER e ADMIN podem associar e executar transições de vigência. Processo explicitamente autorizado e responsabilizado pode associar, mas não substituir nem revogar; sua identidade e responsabilização ainda devem ser definidas em G3.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em 100% dos cenários aprovados de consulta, o participante autorizado identifica o resultado, a coleta e a área de origem, as referências do contrato e algoritmo e o estado, a data e o procedimento de aceite, sem informação inventada nem identidade ou evidência restrita (US1).
- **SC-002**: Na matriz com ao menos dois laboratórios, duas áreas e duas coletas, zero diagnóstico é consultado ou associado fora de sua cadeia autorizada de origem (US1/US2).
- **SC-003**: Em 100% dos casos sem diagnóstico aceito, a experiência comunica ausência sem exibir zero, classe, qualidade, versão, recomendação ou resultado padrão (US1).
- **SC-004**: Para todos os casos válidos e inválidos aprovados em G2, somente diagnósticos que satisfazem integralmente o contrato são apresentados como aceitos; zero legado ou resultado incompleto é promovido por inferência (US1/US2).
- **SC-005**: Na matriz com OWNER, ADMIN, MEMBER, processo autorizado e processo não autorizado, há zero leitura indevida, MEMBER não executa escrita, processo autorizado limita-se à associação, processo não autorizado não executa escrita e laboratório inativo admite zero escrita; recursos inexistentes e inacessíveis permanecem indistinguíveis (US1/US2).
- **SC-006**: Todos os cenários de falha, repetição, concorrência, substituição, revogação e correção aprovados em G3 terminam sem sucesso falso, associação parcial, alteração da coleta/dados ambientais ou dos registros originais, duplicação da mesma operação ou mais de um diagnóstico vigente (US2).
- **SC-007**: Em avaliação de cada cenário principal com participante representativo, a pessoa consegue distinguir resultado aceito, ausência e somente leitura e localizar a origem do diagnóstico; registrar o resultado por cenário, sem presumir percentual antes do estudo (US1).

Esses critérios são metas verificáveis, não resultados já alcançados. Os exemplos científicos, a matriz de acesso e o ciclo específico ainda dependem de G2/G3.

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

O conjunto ambiental não implementa `mathContractVersion`, `algorithmVersion` nem `contractHash` normativo. O model legado `IHFRDiagnosis`, seu default `algorithmVersion = "1.0.0"`, classes, scores, qualidade e `explanationAI` são evidência técnica anterior sem consumidor e sem autoridade científica; não podem ser promovidos, migrados ou expostos como diagnóstico aceito por inferência.

### Dependências e gates materiais

| Gate | Classificação e fonte | Evidência exigida para liberação | Impacto atual |
|---|---|---|---|
| G1 — Dados ambientais integrados | `EVIDENCIA_IMPLEMENTACAO`: IMP-005 `e775ebc` integrada pelo PR #25 no merge `5d9ca6f`; baseline incorporada à IMP-006 em `62b54fa` | Entidade, contrato, API, migration, autorização, testes, imutabilidade e legado reconciliados; conjunto confirmado disponível sem alterar a coleta | **FECHADO** em 2026-09-18. A IMP-006 deve consumir o contrato real descrito acima sem ampliar sua autoridade científica |
| G2 — Ciência e rastreabilidade | `PENDENCIA_DE_DECISAO`: `CF-PD-005`, `CF-Q-011`; Code-First em revisão. A IMP-005 decidiu a captura técnica e o formato da fronteira matemática, não uma versão matemática ativável | Autoridade científica e fontes validadas aprovam finalidade, fórmula, normalizações, pesos, classes, limiares, conteúdo do resultado, qualidade, política de ausências, validação, compatibilidade/evolução, manifesto, hash e vetores dourados. O procedimento de aceite e suas evidências também devem ser aprovados | **ABERTO**. `measurement-contract-v1.md` responde tipos/unidades/limites estruturais para captura; `math-contract-v1.md` somente enumera o que falta e não autoriza cálculo, aceitação científica ou classificação de legado |
| G3 — Produção, responsabilidade e ciclo | `PENDENCIA_DE_DECISAO`: `CF-PD-005`, `CF-PD-006`, alternativas `TD-009`/`TD-012`. A IMP-005 implementa autoria humana, confirmação, imutabilidade, idempotência e recuperação somente do conjunto ambiental; a IMP-006 decidiu invariantes funcionais próprias do diagnóstico | Produto decide a forma funcional; ciência valida contrato e aceite; dados aprovam estados/proveniência; segurança valida processo e auditoria; arquitetura decide execução. Identidade/autenticação e responsável do processo, forma de produção, procedimento/evidência de aceite, modelo persistido de estados/transições, chave/identidade da operação, idempotência, concorrência/precedência, recuperação após timeout e atores/retenção/superfície da auditoria restrita definidos | **ABERTO para o diagnóstico**. Nenhuma chave, permissão ou semântica operacional da IMP-005 é transferida automaticamente |

O escopo documental é completo no limite autorizado: origem, consulta, associação condicionada, segurança e gates são testáveis. G1 está fechado. G2 permite apenas `$speckit-plan` condicionado e continua bloqueando cálculo, produção e aceite científico. G3 mantém bloqueadas produção, associação e implementação até que seus contratos operacionais sejam decididos. `$speckit-tasks`, `$speckit-analyze` e `$speckit-implement` ainda são inaplicáveis porque não existem plano e tarefas executáveis. Responsáveis nominais e prazos não foram especificados.

As invariantes funcionais já confirmadas em G3 permanecem vigentes: OWNER/ADMIN associam, substituem e revogam; MEMBER consulta; processo explicitamente autorizado poderá associar quando seu contrato existir; há no máximo um diagnóstico vigente por coleta; anteriores são preservados; diagnóstico e associação confirmados são imutáveis; substituição, revogação e correção usam transições auditáveis; e a consulta normal mostra proveniência mínima sem identidades do produtor/revisor ou evidências restritas.

`PENDENCIA_DE_DECISAO` — ciência, produto e dados devem decidir, com origem registrada, o efeito de correção, complementação, substituição ou mudança de contrato da IMP-005 sobre um diagnóstico já aceito. Até essa decisão, nenhuma mudança nos dados ambientais recalcula, reinterpreta, substitui ou revoga automaticamente o diagnóstico. O tema não impede planejamento condicionado, mas bloqueia o ciclo implementável e os respectivos testes de compatibilidade.

### Reconciliação documental com a IMP-005

Histórico preservado: a primeira leitura usou `d3fade93e71473b88e44bb473fb2adb9718f2f4c`; a reconciliação planejada de 2026-09-17 usou `1235387ded9854be20a92f8639a502a80a2bd952`. A reconciliação vigente inspeciona a implementação `e775ebcdc1112c0d18117e4023a578a4ef62cf1c`, integrada em `origin/development` `5d9ca6f8f848867e8152bc25e86abc9a6e73358f`. Os estados abaixo distinguem contrato implementado de ciência e operação ainda pendentes.

| Pergunta ou dependência | Evidência precisa na IMP-005 | Estado | Autoridade da fonte | Impacto na IMP-006 | Ação necessária |
|---|---|---|---|---|---|
| 1. Identidade estável de coleta, área e laboratório | Schema, migration e lookup contextual em `environmental-data.service.ts` | `IMPLEMENTADA` | `EVIDENCIA_IMPLEMENTACAO` | A origem pode usar UUIDs e a cadeia integrada sem realocar a coleta | Reutilizar a cadeia; não confiar em ID isolado |
| 2. Estrutura ambiental consumível | `EnvironmentalMeasurementSet`, parser, tipos e migration; `measurement-contract-v1.md` | `IMPLEMENTADA` | `EVIDENCIA_IMPLEMENTACAO` técnica/de dados | Existe um conjunto único, fechado e imutável com quatro grupos | Consumir somente essa entidade/DTO; não usar tabelas legadas como v1 |
| 3. Campos, tipos, enums, unidades, nulabilidade e limites | `environmental-data.validation.ts`, tipos, OpenAPI, contrato e testes | `IMPLEMENTADA_PARA_CAPTURA` | `EVIDENCIA_IMPLEMENTACAO`; sem autoridade científica de cálculo | Entrada técnica estável, mas elegibilidade científica e qualidade não estão aprovadas | G2 aprova significado científico, precisão, qualidade e casos de cálculo |
| 4. Versões e proveniência ambiental | Schema/DTO implementam `measurementContractVersion`; schema interno registra `payloadHash`, `confirmationKey`, autoria e `confirmedAt` | `PARCIALMENTE_RESPONDIDA` | `EVIDENCIA_IMPLEMENTACAO` | A versão de medição e a confirmação existem; versões matemáticas e do algoritmo não existem no conjunto | G2/G3 definem `mathContractVersion`, `algorithmVersion`, `contractHash` e datas do diagnóstico |
| 5. Relação entre dados, versões e diagnóstico | `math-contract-v1.md` separa quatro referências, sem versão ativável | `PARCIALMENTE_RESPONDIDA` | Formato/governança técnica; ciência ausente | Impede substituir uma versão por outra, mas não autoriza cálculo ou aceite | Aprovar manifesto ativável e compatibilidade antes de aceitar diagnóstico |
| 6. API e DTO ambiental | GET/POST contextual, OpenAPI, `PublicEnvironmentalData`, `no-store` e erros sanitizados | `IMPLEMENTADA` | `EVIDENCIA_IMPLEMENTACAO` | A IMP-006 pode planejar a fronteira de consumo sem ampliar o DTO da coleta | Criar contrato próprio do diagnóstico somente após G2/G3 |
| 7. Imutabilidade, idempotência, concorrência e recuperação ambiental | Trigger, constraints, transação serializável, replay e testes | `IMPLEMENTADA_PARA_AMBIENTAL` | `EVIDENCIA_IMPLEMENTACAO` | Fornece padrão observado, mas não decide identidade/operação do diagnóstico | Não reutilizar automaticamente chave, permissões ou semântica; decidir em G3 |
| 8. Identidade e responsabilização do processo produtor | `data-model.md` §2 registra `userId` do autor humano; `math-contract-v1.md` define avaliador puro sem identidade operacional | `NAO_RESPONDIDA` | Decisão técnica para autoria da medição; recomendação não normativa para o avaliador | Identifica quem capturou dados, mas não responde quem produziu/atestou o diagnóstico | G3 deve definir identidade, credencial contextual e responsável do processo produtor |
| 9. Legado ambiental e `IHFRDiagnosis` | Migration aditiva e testes preservam legado; código IMP-005 não lê nem publica esses models | `RESPONDIDA_PARA_PRESERVACAO` | `EVIDENCIA_IMPLEMENTACAO` | Não há promoção, backfill ou autoridade científica implícita | Manter legado fora do fluxo validado até decisão explícita |
| 10. Efeito de mudanças posteriores sobre diagnóstico aceito | `math-contract-v1.md` separa versões e exige hash; `data-model.md` §6 preserva legado; IMP-005 proíbe editar/complementar v1 | `PARCIALMENTE_RESPONDIDA` | Decisão técnica/de dados sobre imutabilidade/versionamento; sem decisão científica/produto para diagnóstico | Impede reinterpretação silenciosa, mas não decide revogação/substituição do diagnóstico | Ciência, produto e dados devem decidir compatibilidade e transição; nenhum efeito automático até lá |

### Fronteiras com outras entregas

- **IMP-001 a IMP-004 — integradas**: fornecem acesso autenticado, laboratório, área e coleta confirmada. A IMP-006 deve preservar seus contratos observados na base integrada.
- **IMP-005 — integrada**: o head `e775ebc` fornece o conjunto ambiental versionado implementado; sua fronteira matemática futura continua sem ciência ativável.
- **IMP-007 — publicada, em implementação e não integrada**: `origin/007-dashboard-history` está em `56dc1c51305c944ff77fb84ebf29470f468d47da`, contém 61/65 tarefas marcadas e continua fora de `origin/development`. Seu dashboard mínimo aceita somente `AREA_CREATED` e `COLLECTION_CONFIRMED`; não existe DTO, evento, link ou projeção integrada de diagnóstico. Após a integração de ambas as features será necessária reconciliação específica; a IMP-007 não bloqueia o planejamento condicionado da IMP-006.
- **IMP-008 — posterior**: mapa, gráficos, visualização analítica e acompanhamento territorial não pertencem à IMP-006.

### Fora do escopo

Definir ou implementar fórmula, pesos, variáveis, classes, limiares e interpretação científica; escolher mecanismo de produção ou arquitetura; selecionar Python, integração, serviço externo, schema, endpoints ou bibliotecas; registrar ou editar dados ambientais; editar/excluir coleta; dashboards, histórico, mapa, gráficos e recomendações; IA; código, Prisma, migrations, dependências e banco. Esta reconciliação documental não executa `$speckit-plan`, tasks, análise ou implementação.

### Fontes e baseline

Baseline original: `origin/development` `37fb3a4fbf7dda04b9bc3b9f2fc1c64ed3b14e13`, com IMP-004 integrada. Reconciliação planejada: IMP-005 `1235387ded9854be20a92f8639a502a80a2bd952`, sucedendo a leitura inicial `d3fade93e71473b88e44bb473fb2adb9718f2f4c`. Baseline integrada vigente em 2026-09-18: head IMP-005 `e775ebcdc1112c0d18117e4023a578a4ef62cf1c`, merge PR #25 `5d9ca6f8f848867e8152bc25e86abc9a6e73358f`, incorporado à IMP-006 por `62b54fa8d98b2bce2c03d7b6e2181ed4c94ab07d`. Foram relidos spec, checklist, plan, research, modelo, quickstart, source review, tasks, evidências, schema, migration, serviços, DTOs, OpenAPI, contratos e testes da IMP-005. O pacote Code-First permanece `EM_REVISAO`; implementação técnica não foi promovida a aprovação científica.
