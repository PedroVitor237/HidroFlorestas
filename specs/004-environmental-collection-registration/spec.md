# Feature Specification: Registro de coleta ambiental

**Feature Branch**: `004-environmental-collection-registration`

**Created**: 2026-09-14

**Status**: Specification and planning complete; first analysis remediated; ready for independent re-analysis. Implementation remains blocked by the IMP-003 gate.

**Input**: Especificar a entrega `IMP-004 — Registro de coleta ambiental`, permitindo que uma pessoa autenticada e autorizada registre, revise, confirme e consulte os metadados gerais de uma coleta ambiental vinculada a uma área acessível do laboratório explicitamente selecionado, sem antecipar medições ambientais, cálculo do IHFR nem funcionalidades posteriores.

## Objective and Product Outcome

Permitir que participantes autorizados registrem os metadados gerais de uma coleta ambiental no contexto inequívoco de um laboratório e de uma área monitorada, preservando o momento da ocorrência em campo, seu fuso horário, autoria, associação territorial e isolamento entre laboratórios. Antes da confirmação, a pessoa deve compreender e revisar o que será registrado; depois da confirmação, deve receber um resultado inequívoco e reencontrar o detalhe imutável do registro persistido.

O incremento estabelece a coleta geral como elo rastreável entre laboratório, área e autor, sem incorporar medições ambientais, calcular ou diagnosticar o IHFR e sem decidir arquitetura, persistência física ou tecnologia de mapas.

## Authority and Decision Record

### Decisões confirmadas para esta especificação

As decisões abaixo têm origem na solicitação aprovada da equipe para a IMP-004, em 2026-09-14, e nos contratos expressamente declarados como estabilizados pela IMP-003. Elas governam somente o recorte desta feature.

- `DECISAO_CONFIRMADA_PARA_A_ESPECIFICACAO` — a coleta pertence a uma única área acessível, cuja associação com o laboratório é imutável; o laboratório é sempre explícito no contexto.
- `DECISAO_CONFIRMADA_PARA_A_ESPECIFICACAO` — `OWNER`, `ADMIN` e `MEMBER` possuem `CREATE_COLLECTION` somente em laboratório ativo; `LaboratoryMembershipRole` permanece separado do `UserRole` global.
- `DECISAO_CONFIRMADA_PARA_A_ESPECIFICACAO` — a autorização segue a ordem principal e conta elegível → laboratório filtrado pelo vínculo → papel e estado → permissão → área subordinada → coleta subordinada.
- `DECISAO_CONFIRMADA_PARA_A_ESPECIFICACAO` — laboratório inativo permanece em modo somente leitura para membros atuais; nenhuma coleta pode ser criada ou alterada nesse estado.
- `DECISAO_CONFIRMADA_PARA_A_ESPECIFICACAO` — a autoria é derivada do principal autenticado e não pode ser fornecida ou substituída pela pessoa; dados internos e autoria não integram automaticamente a projeção pública.
- `DECISAO_CONFIRMADA_PARA_A_ESPECIFICACAO` — recursos inexistentes e inacessíveis têm comportamento indistinguível, nenhum identificador concede acesso isoladamente e nenhuma autorização depende exclusivamente de estado mantido pela interface.
- `DECISAO_CONFIRMADA_PARA_A_ESPECIFICACAO` — a ocorrência em campo é identificada por data e horário obrigatórios com fuso explícito; o instante de confirmação é registrado automaticamente e não substitui o momento da ocorrência.
- `DECISAO_CONFIRMADA_PARA_A_ESPECIFICACAO` — a IMP-004 registra somente metadados gerais autorizados; medições ambientais e seu contrato científico ficam adiados até validação da autoridade científica competente.
- `DECISAO_CONFIRMADA_PARA_A_ESPECIFICACAO` — não existe rascunho persistente; a revisão antecede a primeira persistência, a coleta confirmada é imutável nesta feature e sua consulta de detalhe integra o incremento.
- `DECISAO_CONFIRMADA_PARA_A_ESPECIFICACAO` — edição, exclusão, listagem e histórico de coletas, medições ambientais, cálculo e diagnóstico do IHFR, visualizações analíticas, mapa territorial e demais capacidades reservadas às IMP-005 a IMP-008 estão fora da IMP-004.

### Evidência, inferências e pendências

- `EVIDENCIA_IMPLEMENTACAO` — o baseline integrado contém relações estruturais candidatas entre coleta, área e usuário e grupos técnicos denominados água, solo, vegetação e terreno. Essa evidência não aprova domínio, taxonomia, variáveis, unidades, obrigatoriedade ou validações científicas.
- `DIRECAO_CODE_FIRST_EM_REVISAO` — `CF-PRD-FR-006`, `CF-PRD-FR-007`, `CF-PRD-FR-011`, `CF-PRD-FR-012` e `CF-PRD-FR-014`, `CF-UC-009` a `CF-UC-011` e `CF-PFLOW-005` sustentam o macrofluxo de coleta vinculada à área, autoria e dados ambientais, preservando as dependências abertas.
- `DECISAO_CONFIRMADA_PARA_A_ESPECIFICACAO` — a resposta da equipe nesta execução especializa `CF-PD-003` somente para a IMP-004: dados gerais mínimos, tratamento temporal e ciclo imutável com consulta de detalhe estão definidos nesta spec; os demais estados, eventos e formas de acompanhamento continuam fora do recorte.
- `PENDENCIA_DE_DECISAO_FORA_DO_ESCOPO` — `CF-PD-005` e `CF-Q-011` continuam sem aprovar contrato científico, grupos, variáveis, unidades, obrigatoriedade, faixas, validações ou versionamento; essa lacuna não bloqueia o registro geral da coleta porque nenhuma medição integra a IMP-004.

## Actors

- **Participante autorizado**: pessoa autenticada, com conta elegível, vínculo atual como `OWNER`, `ADMIN` ou `MEMBER`, laboratório ativo explicitamente selecionado e permissão contextual `CREATE_COLLECTION`.
- **Membro autorizado para leitura**: pessoa autenticada e elegível, com vínculo atual no laboratório da coleta; pode consultar o que o incremento disponibilizar, inclusive quando o laboratório estiver inativo.
- **Pessoa sem acesso atual**: conta sem vínculo atual, inelegível ou fora do laboratório contextual; não pode criar, consultar nem inferir a existência da coleta.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Iniciar coleta na área correta (Priority: P1)

Como participante autorizado, quero partir de uma área acessível do laboratório explicitamente selecionado e iniciar uma nova coleta, para evitar registrar dados no laboratório ou território incorreto.

**Why this priority**: O vínculo laboratório → área → coleta é a fronteira de integridade e isolamento de todo o incremento.

**Independent Test**: Preparar uma pessoa vinculada a dois laboratórios, selecionar uma área em cada contexto e iniciar o registro, comprovando que a coleta sempre referencia a área do contexto explícito e que referências cruzadas não revelam nem aceitam recursos.

**Acceptance Scenarios**:

1. **Given** uma conta elegível com vínculo atual e qualquer papel contextual em laboratório ativo, **When** escolhe uma área acessível nesse laboratório e inicia uma coleta, **Then** o registro em preparação identifica claramente o laboratório e a área escolhidos.
2. **Given** uma área pertencente a outro laboratório, inexistente ou inacessível, **When** a pessoa tenta iniciar uma coleta usando seu identificador, **Then** a operação é negada sem informar se a área existe em outro contexto.
3. **Given** um laboratório inativo, **When** um membro atual tenta iniciar uma coleta, **Then** a mutação é recusada como indisponível em modo somente leitura.

---

### User Story 2 - Informar e validar o momento da coleta (Priority: P2)

Como participante autorizado, quero informar a data e o horário em que a coleta ocorreu em campo, com fuso horário explícito e indicação precisa de ausências ou valores inválidos, para preparar um registro temporalmente rastreável sem confundir ocorrência e confirmação.

**Why this priority**: O registro geral só é rastreável quando informa de modo inequívoco quando a ocorrência aconteceu, independentemente do instante posterior de confirmação.

**Independent Test**: Preencher combinações válidas, ausentes, malformadas e futuras de data, horário e fuso da ocorrência, comprovando a identificação de cada problema, a preservação dos demais valores e o bloqueio da confirmação inválida.

**Acceptance Scenarios**:

1. **Given** o início válido de uma coleta, **When** a pessoa informa data e horário da ocorrência com fuso explícito, **Then** o momento completo é mantido para revisão associado à área selecionada.
2. **Given** data, horário ou fuso ausente ou malformado, **When** a pessoa solicita validação ou avança para revisão, **Then** cada campo e o motivo são apresentados de forma compreensível e nenhum registro é confirmado.
3. **Given** um momento de ocorrência posterior ao instante atual, **When** ele é validado, **Then** a entrada é recusada como incompatível com uma ocorrência já realizada, sem correção silenciosa.
4. **Given** uma falha recuperável durante o preenchimento, **When** a pessoa continua na mesma tentativa, **Then** os valores já informados permanecem disponíveis para correção enquanto o acesso atual continuar válido.

---

### User Story 3 - Revisar e confirmar o registro (Priority: P3)

Como participante autorizado, quero revisar a coleta completa antes de confirmá-la e receber um resultado inequívoco, para evitar persistir metadados gerais sem conferência ou repetir a coleta por incerteza.

**Why this priority**: A confirmação transforma dados em preparação em um registro persistido e precisa proteger integridade, autoria e associação contextual.

**Independent Test**: Preencher uma coleta válida, comparar a revisão com os valores informados, confirmar uma vez e repetir ações durante a operação, além de alterar vínculo, estado do laboratório ou acessibilidade da área antes da confirmação.

**Acceptance Scenarios**:

1. **Given** uma coleta válida em preparação, **When** a pessoa abre a revisão, **Then** vê o laboratório, a área e o momento da ocorrência com seu fuso, distinguindo dados informados de informações derivadas automaticamente.
2. **Given** a revisão correta e autorização ainda válida, **When** a pessoa confirma, **Then** exatamente um registro é persistido com a área e autoria corretas e uma confirmação clara é apresentada.
3. **Given** uma confirmação em andamento, **When** a mesma ação é disparada repetidamente, **Then** a tentativa não produz múltiplos registros e o resultado final permanece inequívoco.
4. **Given** falha antes da persistência integral, **When** a confirmação termina, **Then** nenhuma coleta parcial é disponibilizada e a pessoa recebe erro recuperável sem indicação falsa de sucesso.
5. **Given** perda de vínculo, inelegibilidade da conta, inativação do laboratório ou área que deixou de ser acessível antes da confirmação, **When** a pessoa confirma, **Then** o estado atual é revalidado e nenhum registro é criado.

---

### User Story 4 - Consultar a coleta confirmada (Priority: P4)

Como membro autorizado, quero reencontrar a coleta no laboratório e na área corretos, para verificar o que foi persistido sem expor autoria ou dados internos indevidos.

**Why this priority**: A consulta de detalhe fecha o incremento vertical ao tornar o registro confirmado verificável e reencontrável no contexto correto.

**Independent Test**: Confirmar uma coleta, consultá-la com cada papel no laboratório ativo e inativo e repetir com outro laboratório, vínculo revogado e identificadores inexistentes ou inacessíveis.

**Acceptance Scenarios**:

1. **Given** uma coleta confirmada e acessível, **When** um membro atual a consulta no contexto correto, **Then** vê a projeção aprovada do registro e sua área de origem, sem campos internos ou autoria privilegiada.
2. **Given** um laboratório inativo e uma coleta existente, **When** um membro atual a consulta, **Then** o registro permanece visível em modo somente leitura.
3. **Given** vínculo revogado, coleta de outro laboratório ou identificador inexistente, **When** a consulta é tentada, **Then** nenhum dado nem indício da existência inacessível é revelado.

### Edge Cases

- A área deixa de estar acessível, muda de disponibilidade ou é removida por outra operação entre a abertura e a confirmação; a autorização e a associação são revalidadas no momento da confirmação.
- O laboratório é inativado ou o vínculo, o papel ou a elegibilidade da conta muda durante o preenchimento; o estado anterior da interface não mantém permissão.
- A pessoa altera a área antes da revisão; os dados não são confirmados silenciosamente sob uma nova associação e a revisão precisa refletir inequivocamente a área final.
- Data, horário ou fuso vazios ou malformados são apontados individualmente, sem descarte dos demais valores nem correção silenciosa.
- O momento informado está no futuro quando comparado ao instante da validação; a confirmação é bloqueada sem substituir o valor pelo horário atual.
- Duplo clique, reenvio por latência ou repetição concorrente da mesma confirmação não produz mais de um registro para a mesma ação.
- Duas coletas intencionalmente distintas podem conter valores iguais; igualdade de conteúdo, por si só, não autoriza deduplicação silenciosa.
- Uma falha ocorre depois do envio e o resultado é inicialmente desconhecido; repetir a mesma confirmação não duplica a coleta e conduz ao mesmo resultado final de sucesso ou erro.
- Uma consulta usa um identificador opaco válido de outro laboratório; a resposta não distingue essa condição de um identificador inexistente.
- Um membro consulta uma coleta após o laboratório ser inativado; a leitura é permitida, mas toda ação mutável permanece indisponível.

## Requirements *(mandatory)*

### Functional Requirements

#### Contexto, autorização e associação

- **FR-001**: O produto MUST exigir principal autenticado e conta atualmente elegível antes de qualquer operação da coleta.
- **FR-002**: O produto MUST exigir um laboratório explicitamente selecionado e MUST NOT selecionar, inferir ou trocar automaticamente o laboratório da operação.
- **FR-003**: O produto MUST permitir `CREATE_COLLECTION` a vínculos atuais `OWNER`, `ADMIN` e `MEMBER` somente quando o laboratório selecionado estiver ativo.
- **FR-004**: O produto MUST revalidar, a cada operação, principal e elegibilidade → laboratório filtrado pelo vínculo → papel e estado → permissão → área subordinada → coleta subordinada.
- **FR-005**: O produto MUST aceitar para a nova coleta somente uma área acessível pertencente ao laboratório explicitamente selecionado e MUST preservar imutavelmente essa associação após a confirmação.
- **FR-006**: O produto MUST tratar laboratório, vínculo, área ou coleta inexistente e inacessível de modo uniforme, sem vazamento entre laboratórios.
- **FR-007**: O produto MUST recusar criação ou outra mutação de coleta em laboratório inativo e MUST permitir somente as leituras autorizadas.
- **FR-008**: A perda do vínculo ou da elegibilidade MUST retirar o acesso nas operações seguintes sem apagar a coleta nem sua autoria histórica.

#### Conteúdo e validação

- **FR-009**: O produto MUST atribuir à coleta um identificador opaco gerado pelo sistema e MUST NOT aceitar que a pessoa forneça ou escolha esse identificador.
- **FR-010**: O produto MUST derivar a autoria exclusivamente do principal autenticado e MUST NOT aceitar identificador de autor no conteúdo informado pela pessoa.
- **FR-011**: A coleta MUST registrar como dados gerais obrigatórios a data e o horário em que ocorreu em campo e o fuso horário explícito associado à ocorrência.
- **FR-012**: O produto MUST registrar automaticamente o instante de confirmação e MUST mantê-lo distinto do momento da ocorrência, sem usar um como substituto do outro.
- **FR-013**: O produto MUST distinguir, na revisão, o momento da ocorrência informado pela pessoa do laboratório, da área e da atribuição de autoria derivados do contexto; após a confirmação, o resultado e o detalhe MUST distinguir também o identificador e o instante gerados automaticamente.
- **FR-014**: O produto MUST identificar data, horário ou fuso obrigatório ausente, malformado ou inconsistente com uma ocorrência já realizada, com mensagem compreensível, e MUST NOT confirmar enquanto houver erro.
- **FR-015**: O produto MUST NOT inventar, converter, arredondar, truncar ou corrigir silenciosamente o momento da ocorrência ou seu fuso.
- **FR-016**: O produto MUST preservar os valores válidos já informados quando outro campo falhar na validação ou ocorrer erro recuperável durante a mesma tentativa, enquanto o acesso permanecer válido.

#### Revisão, confirmação e concorrência

- **FR-017**: O produto MUST apresentar uma etapa de revisão anterior à confirmação, contendo o laboratório, a área e todos os valores que serão persistidos.
- **FR-018**: O produto MUST exigir confirmação explícita depois da revisão e MUST revalidar conteúdo, autorização, estado do laboratório e associação da área no momento da confirmação.
- **FR-019**: Uma confirmação bem-sucedida MUST persistir atomicamente uma única coleta com seus metadados gerais, área e autoria; uma falha MUST NOT disponibilizar registro parcial.
- **FR-020**: Repetições concorrentes ou posteriores da mesma ação de confirmação MUST produzir no máximo uma coleta e MUST convergir para o mesmo resultado final.
- **FR-021**: O produto MUST apresentar sucesso somente após confirmação da persistência integral e MUST apresentar erro sanitizado, acionável e sem detalhes internos quando a operação falhar.
- **FR-022**: Se o resultado de uma confirmação for inicialmente indeterminado, o produto MUST permitir verificar ou repetir a mesma ação sem duplicar a coleta e MUST apresentar ao final sucesso ou erro inequívoco.

#### Ciclo e consulta

- **FR-023**: O ciclo mínimo da IMP-004 MUST consistir em iniciar o preenchimento, revisar, confirmar, persistir pela primeira vez e consultar o detalhe; MUST NOT existir rascunho persistente nem persistência anterior à confirmação.
- **FR-024**: Toda consulta incluída no incremento MUST partir do laboratório explícito e restringir a coleta simultaneamente ao laboratório e à área subordinada autorizados.
- **FR-025**: O detalhe consultável MUST apresentar o identificador opaco da coleta, data, horário e fuso da ocorrência, instante de confirmação, identificação pública mínima da área e do laboratório e indicação de somente leitura quando aplicável; MUST NOT expor identificador interno de autor, credenciais, códigos de acesso ou dados privilegiados.
- **FR-026**: Membros atuais MUST poder consultar a projeção aprovada de coletas acessíveis em laboratório inativo, com indicação clara de modo somente leitura.
- **FR-027**: A consulta MUST refletir os valores efetivamente confirmados e MUST permitir identificar a área de origem sem depender de estado anterior mantido pela interface.

#### Limites de escopo

- **FR-028**: Uma coleta confirmada MUST permanecer imutável nesta feature; nova coleta MUST NOT alterar retroativamente outra coleta, e edição e exclusão MUST permanecer fora do escopo.
- **FR-029**: A IMP-004 MUST NOT solicitar nem persistir medições ambientais, incluindo os grupos técnicos atuais de água, solo, vegetação e terreno, até existir contrato validado pela autoridade científica competente.
- **FR-030**: A IMP-004 MUST NOT calcular, classificar, diagnosticar nem apresentar resultado de IHFR.
- **FR-031**: A IMP-004 MUST NOT incluir listagem ou histórico de coletas, dashboard analítico, gráficos, mapa territorial agregado, modo offline, sincronização posterior, importação em massa, sensores ou integração com hardware.
- **FR-032**: A IMP-004 MUST NOT alterar área, transferir propriedade, convidar ou remover membros, reativar laboratório ou alterar os contratos funcionais das IMP-001, IMP-002 e IMP-003.

### Key Entities

- **Coleta ambiental**: registro geral identificado de forma opaca, subordinado a uma única área e, por ela, a um único laboratório; mantém autoria interna, momento da ocorrência e informações de confirmação.
- **Momento da ocorrência**: data e horário obrigatórios informados pela pessoa para representar quando a coleta ocorreu em campo, acompanhados de fuso horário explícito.
- **Instante de confirmação**: momento registrado automaticamente quando a coleta é confirmada e persistida; é distinto da ocorrência em campo.
- **Informações derivadas automaticamente**: identificador opaco, autoria autenticada, laboratório e área autorizados e instante de confirmação; não podem ser forjadas no conteúdo submetido.
- **Área monitorada**: recurso herdado da IMP-003, identificado por `area.id` opaco e associado imutavelmente ao laboratório; é a referência territorial da coleta neste incremento.
- **Laboratório**: contexto explícito e fronteira de isolamento; seu vínculo, estado e papel atuais governam cada operação.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em testes de aceitação, 100% das coletas confirmadas ficam associadas ao laboratório explícito, à área selecionada e ao principal autenticado corretos.
- **SC-002**: Pelo menos 90% dos participantes de teste conseguem iniciar, informar o momento da ocorrência, revisar e confirmar uma coleta válida na primeira tentativa, sem assistência externa.
- **SC-003**: Em 100% dos cenários com data, horário ou fuso ausente, malformado ou futuro, a pessoa identifica o campo e o motivo antes de qualquer persistência.
- **SC-004**: Em 100% dos testes de duplo envio e repetição concorrente da mesma confirmação, no máximo uma coleta é criada.
- **SC-005**: Em 100% dos cenários de laboratório incorreto, recurso cruzado, vínculo revogado, conta inelegível ou área inacessível, nenhuma coleta é criada e nenhum dado de outro laboratório é revelado.
- **SC-006**: Em 100% dos testes com laboratório inativo, membros atuais conseguem realizar as leituras incluídas no escopo e nenhuma mutação de coleta é concluída.
- **SC-007**: Pelo menos 90% dos participantes de teste distinguem corretamente, na revisão, o momento da ocorrência em campo, seu fuso, as informações derivadas e a associação da área antes de confirmar.
- **SC-008**: Após uma confirmação bem-sucedida, 100% dos registros podem ser reencontrados pela consulta de detalhe no laboratório e na área corretos.

### Human evaluation status

`SC-002` and `SC-007` remain `NAO_VERIFICADO`. Their percentages require a future evaluation led by the HidroFlorestas product/research team, after an executable increment is available in an appropriate environment, using representative participants and recording the observed metrics in the feature evidence. Automated, integration and E2E tests support the journey but do not replace this evaluation. The absence of that post-implementation measurement does not automatically block implementation, PR or merge and must not be reported in advance as approval or failure.

## Assumptions

- A IMP-001 fornece autenticação e elegibilidade da conta; a IMP-002 fornece o laboratório e o vínculo; a IMP-003 fornece contexto explícito, papéis, estado somente leitura, guard contextual, área persistida e `area.id` opaco.
- A área é a única referência espacial da coleta na IMP-004; localização própria da coleta não é inferida nem adicionada.
- Os três papéis contextuais herdam `CREATE_COLLECTION` conforme a fronteira estabilizada pela IMP-003; não são criados novos papéis nesta entrega.
- Uma ação única de confirmação deve ser protegida contra repetição acidental, mas coletas intencionalmente distintas podem ter conteúdo igual.
- Conectividade contínua durante a confirmação é uma precondição desta entrega; modo offline e sincronização posterior estão fora do escopo.
- A definição de medições ambientais virá de autoridade científica identificada em uma entrega posterior; estruturas hoje observadas no schema são evidência, não contrato aprovado.
- Como a pessoa declara o momento em que a coleta já ocorreu em campo, um momento futuro em relação à validação é inconsistente e impede a confirmação; nenhuma tolerância ou correção automática é presumida.

## Dependencies and Traceability

| Subject | Authorized source or inherited contract | Application in IMP-004 |
|---|---|---|
| Autenticação e conta elegível | IMP-001 | Precondição de todas as operações; sem alteração do contrato público. |
| Laboratório, vínculo e estado | IMP-002 e contratos estabilizados pela IMP-003 | Contexto explícito, vínculo atual e modo somente leitura. |
| Papéis e permissão | IMP-003; `CREATE_COLLECTION` | `OWNER`, `ADMIN` e `MEMBER` criam somente em laboratório ativo. |
| Área e isolamento | IMP-003; `area.id`; associação área–laboratório | Toda coleta é subordinada a uma área do mesmo contexto. |
| Macrofluxo da coleta | `CF-PRD-FR-006`, `CF-UC-009`, `CF-PFLOW-005`; decisão da equipe para Q1 e Q3 | Selecionar área, informar ocorrência, revisar, confirmar e consultar o detalhe imutável. |
| Dados ambientais | `CF-PRD-FR-007`, `CF-UC-011`, `CF-Q-011`; decisão da equipe para Q2 | Medições adiadas até contrato científico validado; grupos técnicos atuais não são requisitos. |
| Associação espacial | `CF-PRD-FR-014`, `CF-UC-010`, `CF-PD-007` | Coleta alcança a referência espacial somente por sua área, sem coordenada própria inferida. |
| Autoria e privacidade | `CF-PRD-FR-012`, `CF-PRD-NFR-001` a `CF-PRD-NFR-005`; IMP-003 | Autoria derivada, projeções mínimas, revalidação e isolamento. |
| Ciclo e consulta | `CF-PD-003`; decisão da equipe para Q3 | Sem rascunho persistente; confirmação cria registro imutável; detalhe incluído; edição, exclusão, listagem e histórico excluídos. |

## Out of Scope

- Medições ambientais, inclusive grupos, variáveis, unidades, faixas, fórmulas e procedimentos de água, solo, vegetação ou terreno, até validação científica competente.
- Cálculo, diagnóstico, pesos, classes, limiares ou resultado do IHFR.
- Rascunho persistente, edição ou exclusão de coleta confirmada, listagem, histórico, gráficos, dashboards analíticos ou visualização territorial reservada a incrementos posteriores.
- Seleção de Python, Plotly, biblioteca cartográfica, PostGIS, arquitetura, banco, componentes ou contratos técnicos.
- Edição ou exclusão de área, transferência de propriedade, convite ou remoção de membros e reativação de laboratório.
- Atualização de dependências, tratamento global de vulnerabilidades, modo offline, sincronização posterior, importação em massa, sensores e hardware.
- Implementação de código, schema, migration ou antecipação das IMP-005, IMP-006, IMP-007 e IMP-008.
