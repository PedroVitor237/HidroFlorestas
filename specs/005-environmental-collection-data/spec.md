# Feature Specification: Dados ambientais da coleta

**Feature Branch**: `005-environmental-collection-data`

**Created**: 2026-09-15

**Status**: Especificação finalizada e pronta para geração de tarefas; G1–G3 resolvidos no recorte da IMP-005.

**Input**: IMP-005 — permitir que uma coleta existente receba os dados ambientais exigidos pelo contrato científico aplicável, preservando laboratório → área → coleta → dados ambientais. Executar somente specify e plan, com commits e publicação da branch, sem implementação.

## Authority and Scope

- `DECISAO_CONFIRMADA` — a solicitação desta tarefa, em 2026-09-15, autoriza o incremento de dados ambientais vinculados a uma coleta existente, preservação de origem/autoria, isolamento, laboratório inativo somente leitura e exclusão de IHFR. A mesma solicitação autoriza documentação com dependências explícitas; não aprova conteúdo científico ausente.
- `EVIDENCIA_IMPLEMENTACAO` — a IMP-004 foi implementada e validada em `7c977147797ca8a8c167033fee6e7a8ab46f673f` e incorporada a `origin/development` pelo merge `37fb3a4fbf7dda04b9bc3b9f2fc1c64ed3b14e13`. A coleta existe em área e laboratório explícitos, deriva autoria da sessão, separa ocorrência de confirmação, preserva offset, usa idempotência por autor, mantém o registro confirmado imutável e oferece leitura contextual inclusive em laboratório inativo. A evidência fecha G1, mas não aprova ciência nem permissões específicas da IMP-005.
- `FATO_DOCUMENTADO` — `IMP-005`, `CF-PRD-FR-007`, `CF-UC-011` e `CF-PFLOW-005` descrevem registrar dados conforme contrato científico. Conservam o estado de direção candidata/em revisão. `CF-PRD-FR-014` é usado somente para preservar associação espacial pela área; não autoriza localização própria da medição.
- `EVIDENCIA_IMPLEMENTACAO` — existem estruturas técnicas para quatro grupos ambientais; sua presença não aprova grupos, campos, unidades, cardinalidades, nulabilidade, precisão ou faixas. O inventário técnico pertence ao plano.
- `PENDENCIA_DE_DECISAO` — `CF-PD-005`/`CF-Q-011` e `PD-002`/`PD-004` não fornecem contrato científico validado nem autoridade designada suficiente para resolver suas lacunas. Documentos históricos não suprem essa aprovação.
- `FATO_DOCUMENTADO` — revisão explícita, gravação integral e repetição segura foram inicialmente propostas; a decisão de 2026-09-17 abaixo as confirma com chave idempotente própria, sem reutilizar automaticamente a confirmação da IMP-004.
- `DECISAO_CONFIRMADA` — em 2026-09-17, a autoridade técnica desta sessão aprovou finalizar a IMP-005 usando a recomendação de contratos separados e versionados. A entrega adota um conjunto ambiental integral e imutável por coleta, quatro grupos técnicos v1, revisão/confirmar, idempotência própria, acesso de escrita para `OWNER`/`ADMIN`/`MEMBER` vinculados em laboratório ativo e leitura contextual em laboratório inativo. A decisão aprova o contrato de captura e a fronteira matemática; não afirma validação científica do cálculo IHFR.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registrar dados na coleta correta (Priority: P1)

Como participante autorizado, quero informar os dados ambientais aplicáveis a uma coleta existente e conferir o resultado do registro, para preservar observações de campo ligadas à sua origem.

**Why this priority**: É o resultado central da IMP-005 e evita observações sem origem ou com significado científico inventado.

**Independent Test**: Com coleta acessível preparada pela IMP-004, preencher um conjunto válido conforme `ihfr-measurement-v1`, concluir o ciclo aprovado e reabrir seu resultado no mesmo contexto. Não depende da história de consulta implementada para verificar persistência em teste isolado.

**Acceptance Scenarios**:

1. **Given** coleta confirmada acessível em laboratório ativo, participante autorizado e contrato aplicável aprovado, **When** inicia o registro, **Then** identifica laboratório, área e coleta e recebe somente os campos, unidades e orientações desse contrato (FR-001–FR-004).
2. **Given** uma entrada que viola uma regra do contrato aprovado, **When** solicita o registro, **Then** a violação é identificada e nenhum resultado é apresentado como registro válido; nenhum valor é corrigido silenciosamente (FR-005).
3. **Given** dados válidos e acesso ainda permitido, **When** conclui a operação conforme o ciclo aprovado em G3, **Then** reencontra os valores registrados e sua origem, sem alterar os metadados ou a autoria da coleta (FR-006–FR-008).
4. **Given** ausência de contrato científico aprovado/aplicável, **When** tenta registrar medições, **Then** a operação permanece indisponível e não usa valores ou regras presumidos como alternativa (FR-003).
5. **Given** falha de gravação ou resultado ainda desconhecido, **When** recebe retorno, **Then** não vê sucesso falso nem conjunto incompleto apresentado como válido; a recuperação segue o ciclo de envio definido em G3 (FR-009).

### User Story 2 - Consultar dados e sua origem (Priority: P2)

Como membro com acesso atual à coleta e autorização para seus dados, quero consultar o registro ambiental associado, para conferir o que foi informado e a referência científica usada.

**Why this priority**: Fecha a rastreabilidade sem depender de dashboards, histórico geral ou diagnóstico.

**Independent Test**: Usar dados previamente preparados conforme contrato aprovado e testar leitura em laboratório ativo/inativo, sem executar o formulário da história 1.

**Acceptance Scenarios**:

1. **Given** registro ambiental acessível, **When** consulta seu detalhe, **Then** vê os valores/unidades autorizados, referência do contrato no nível aprovado e vínculo com a coleta/área/laboratório de origem (FR-004, FR-007, FR-010).
2. **Given** laboratório inativo e vínculo atual com permissão de leitura, **When** consulta os dados, **Then** pode ler a projeção autorizada e vê indicação de somente leitura, sem ações de escrita (FR-011).
3. **Given** coleta acessível ainda sem registro ambiental, **When** consulta, **Then** vê ausência de registro, sem zeros, valores padrão, diagnóstico ou alegação de qualidade (FR-010).
4. **Given** identificador inexistente, recurso de outro laboratório ou vínculo revogado, **When** tenta consultar, **Then** não recebe dados nem consegue distinguir existência inacessível de inexistência (FR-001, FR-002, FR-012).

### Edge Cases

- Vínculo, papel, elegibilidade ou estado do laboratório muda entre abertura e envio: revalidar o contexto atual; negar escrita quando deixar de ser autorizada.
- Laboratório e área acessíveis, mas coleta pertencente a outra área: negar como recurso não encontrado/inacessível, sem seguir apenas o identificador da coleta.
- Ausente, zero, falso, desconhecido e não aplicável não são intercambiáveis; significado e representação dependem de G2.
- Contrato muda durante o preenchimento: não reinterpretar valores sob outra versão. Regra de vigência/compatibilidade deve estar decidida em G2 antes de implementar essa transição.
- Duplo envio, timeout e concorrência: G3 deve definir a unidade da operação e a recuperação, distinguindo repetição de outra observação legítima; igualdade de valores não prova duplicidade.
- Registros técnicos legados sem contrato identificável: preservá-los, sem declará-los cientificamente válidos, converter ou publicá-los automaticamente.
- Registrar medições não pode editar ocorrência, confirmação, autoria ou origem territorial da coleta confirmada.

## Requirements *(mandatory)*

### Functional Requirements

Os requisitos abaixo definem o resultado e as invariantes. Onde dependem de ciência ou ciclo ainda não aprovados, o gate é explícito e impede sua implementação prematura.

- **FR-001**: Toda operação MUST exigir autenticação, conta elegível, vínculo atual e autorização contextual, com laboratório explicitamente selecionado; papel global ou autoria histórica não substitui vínculo atual.
- **FR-002**: A operação MUST validar laboratório pelo vínculo, papel/estado e permissão, depois área subordinada, coleta subordinada e dados subordinados. Identificadores isolados MUST NOT conceder acesso.
- **FR-003**: Registrar dados MUST depender de contrato científico aprovado e aplicável. Sem G2 satisfeito, medições MUST NOT ser aceitas com regras inferidas do sistema atual ou da documentação histórica.
- **FR-004**: Entrada, validação e leitura MUST usar os grupos, campos, unidades, cardinalidades, precisão e regras de ausência aprovados em G2, preservando a referência da versão no nível autorizado; versão do algoritmo IHFR MUST NOT substituir essa referência.
- **FR-005**: Violações do contrato MUST ser informadas de modo compreensível; o sistema MUST NOT arredondar, converter, completar ou corrigir valores sem regra aprovada. A confirmação válida MUST permanecer impedida enquanto houver violação.
- **FR-006**: Dados registrados MUST permanecer associados à coleta de origem e, por ela, à mesma área e laboratório. A operação MUST NOT realocar ou editar a coleta confirmada.
- **FR-007**: Autoria e origem territorial históricas da coleta MUST ser preservadas mesmo após revogação de acesso. Eventual autoria própria da medição depende de G3 e MUST NOT ser confundida com a autoria da coleta.
- **FR-008**: O registro MUST ser verificável depois do envio e MUST refletir os valores efetivamente persistidos. Confirmação visual MUST corresponder ao resultado real, não ao simples envio.
- **FR-009**: Falha MUST NOT produzir sucesso falso ou conjunto parcial apresentado como válido. Unidade de gravação, revisão, confirmação, repetição e concorrência MUST seguir G3, sem deduplicar observações distintas apenas por valores iguais.
- **FR-010**: A consulta MUST identificar o contexto e disponibilizar somente a projeção autorizada dos dados e de seu contrato; ausência de registro MUST ser distinguida de valor zero, sem preencher lacunas nem calcular qualidade científica.
- **FR-011**: Laboratório inativo MUST permitir somente leitura a quem conservar acesso e permissão; qualquer tentativa de escrita MUST ser recusada, inclusive por acesso direto.
- **FR-012**: Recursos inexistentes e inacessíveis MUST ter comportamento indistinguível. Leitura, envio e recuperação MUST revalidar acesso e MUST NOT expor autoria interna, credenciais ou detalhes privilegiados por padrão.
- **FR-013**: A entrega MUST NOT calcular, classificar ou diagnosticar IHFR nem alterar ciência para viabilizar o formulário. A disponibilidade de dados para incrementos posteriores não autoriza executá-los.
- **FR-014**: Cada coleta MUST aceitar no máximo um conjunto ambiental v1 confirmado, contendo integralmente os quatro grupos água, solo, vegetação e terreno; ausência permitida em campo opcional MUST permanecer distinguível de zero e falso.
- **FR-015**: `OWNER`, `ADMIN` e `MEMBER` com vínculo atual MUST poder registrar e consultar o conjunto; laboratório inativo MUST impedir registro e manter leitura autorizada. A autoria MUST derivar da sessão e ser preservada historicamente.
- **FR-016**: O fluxo MUST revisar em memória antes de confirmar, persistir o conjunto em uma transação atômica e usar chave idempotente própria por autor, distinta de `confirmationKey` da coleta.
- **FR-017**: O conjunto confirmado MUST ser imutável nesta entrega; edição, complementação e exclusão ficam fora do escopo. Replay idêntico MUST recuperar o mesmo resultado e replay divergente MUST produzir conflito sem alterar o registro.
- **FR-018**: Cada conjunto MUST registrar `measurementContractVersion = "ihfr-measurement-v1"`; a referência não pode ser substituída por `algorithmVersion` nem pela versão futura do contrato matemático.
- **FR-019**: O contrato de medição v1 MUST seguir [measurement-contract-v1.md](contracts/measurement-contract-v1.md), e a fronteira para cálculo posterior MUST seguir [math-contract-v1.md](contracts/math-contract-v1.md), sem executar fórmulas nesta entrega.

### Key Entities

- **Coleta existente**: registro confirmado da IMP-004, com identidade, ocorrência, confirmação, autoria histórica e vínculo territorial preservados.
- **Dados ambientais associados**: conjunto integral único e imutável, composto pelos grupos água, solo, vegetação e terreno conforme `ihfr-measurement-v1`.
- **Referência do contrato de medição**: identifica as regras v1 usadas no registro e permanece separada da versão futura do contrato matemático e do algoritmo.
- **Contexto de acesso**: pessoa elegível, vínculo atual, papel, estado do laboratório e permissões específicas, independentes de autoria histórica.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Para cada caso válido aprovado em G2, os valores registrados e consultados correspondem exatamente aos esperados pelo contrato; zero mudança não autorizada de unidade, precisão ou significado (US1/US2).
- **SC-002**: Cada registro consultado resolve uma única cadeia de origem laboratório → área → coleta; zero associação cruzada aceita na matriz com dois laboratórios e duas áreas (US1/US2).
- **SC-003**: Todos os casos de entrada inválida aprovados em G2 impedem resultado válido e identificam a regra violada; nenhum caso fabrica valor ausente (US1).
- **SC-004**: Na matriz de acesso definida em G3, zero leitura indevida e zero escrita em laboratório inativo, com comportamento equivalente entre inexistente e inacessível (US1/US2).
- **SC-005**: Cada caso de falha/repetição aprovado em G3 termina sem sucesso falso, sem perda dos metadados da coleta e sem duplicação da mesma operação (US1).
- **SC-006**: No roteiro de consulta, o participante consegue identificar a coleta de origem, distinguir ausência de dado de valor informado e reconhecer o modo somente leitura. Registrar resultado observado por cenário; não impor percentual ou tempo sem estudo (US2).

Esses critérios são metas verificáveis, não resultados alcançados. Os conjuntos de casos científicos e a matriz específica de permissões ainda devem ser aprovados; não há alegação de aceite funcional executado.

## Assumptions

### Dependências e gates materiais

| Gate | Classificação e fonte | Evidência exigida para liberação | Impacto atual |
|---|---|---|---|
| G1 — Coleta integrada | `EVIDENCIA_IMPLEMENTACAO`: IMP-004 `7c97714`, merge PR #24 `37fb3a4` e `implementation-evidence.md` | Coleta confirmada integrada, guard contextual, papéis, leitura/inatividade, idempotência, imutabilidade e isolamento comprovados | **FECHADO** em 2026-09-16; a IMP-005 deve consumir os contratos reais sem ampliá-los silenciosamente |
| G2 — Ciência e dados | `DECISAO_CONFIRMADA`: instrução de 2026-09-17 e contratos v1 desta feature | Quatro grupos e campos técnicos v1, unidades explícitas quando conhecidas, nulabilidade, faixas estruturais, versão e exemplos fixados; cálculo científico separado | **FECHADO para captura v1**; validade científica do IHFR permanece responsabilidade da IMP-006/autoridade científica |
| G3 — Permissões e ciclo dos dados | `DECISAO_CONFIRMADA`: instrução de 2026-09-17 | Três papéis vinculados registram/leem; conjunto único, integral, imutável, confirmado e idempotente; inativo somente leitura | **FECHADO** para a IMP-005 |

O ciclo confirmado usa revisão em memória, confirmação integral e recuperação da mesma tentativa. Não há rascunho persistido, complementação ou atualização nesta entrega.

O escopo está pronto para tarefas executáveis. O contrato v1 é uma decisão técnica/de dados para captura; não deve ser apresentado como validação científica do IHFR nem usado para calcular diagnóstico nesta feature.

### Fora do escopo

Cálculo, classificação e diagnóstico IHFR; pesos, fórmulas, limiares e recomendações científicas; dashboards, gráficos, mapas agregados, histórico/acompanhamento geral; edição ou exclusão de coletas confirmadas; IMP-006/007/008; escolha de Python, Plotly, Leaflet, OpenStreetMap ou integração científica; offline, sincronização, sensores, hardware e importação em massa.

### Fontes e baseline

Base original da branch: `origin/development` em `f440282a9aefbbb85b5199d0610fdb9ecab3dc87`. Reconciliação atual: `origin/004-environmental-collection-registration` em `7c977147797ca8a8c167033fee6e7a8ab46f673f`, contida em `origin/development` no merge `37fb3a4fbf7dda04b9bc3b9f2fc1c64ed3b14e13`. A branch IMP-005 ainda não foi atualizada/rebaseada; esta revisão documental não altera ancestralidade Git. A solicitação atual prevalece sobre o macrofluxo histórico que reunia coleta e medições numa única confirmação.
