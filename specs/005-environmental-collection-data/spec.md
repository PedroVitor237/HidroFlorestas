# Feature Specification: Dados ambientais da coleta

**Feature Branch**: `005-environmental-collection-data`

**Created**: 2026-09-15

**Status**: Especificação documental validada para planejamento condicionado; implementação bloqueada pelos gates G1–G3.

**Input**: IMP-005 — permitir que uma coleta existente receba os dados ambientais exigidos pelo contrato científico aplicável, preservando laboratório → área → coleta → dados ambientais. Executar somente specify e plan, com commits e publicação da branch, sem implementação.

## Authority and Scope

- `DECISAO_CONFIRMADA` — a solicitação desta tarefa, em 2026-09-15, autoriza o incremento de dados ambientais vinculados a uma coleta existente, preservação de origem/autoria, isolamento, laboratório inativo somente leitura e exclusão de IHFR. A mesma solicitação autoriza documentação com dependências explícitas; não aprova conteúdo científico ausente.
- `FATO_DOCUMENTADO` — a spec da IMP-004 registra decisões confirmadas pela equipe em 2026-09-14: coleta em uma área de laboratório explícito, autoria derivada da pessoa autenticada, ocorrência e confirmação distintas, coleta confirmada imutável, leitura contextual, conta elegível e vínculo atual. Fonte consultada: commit `a44ac7ab3d4ead5adae977e53fd9cb9dfe05368e`, `specs/004-environmental-collection-registration/spec.md`, seções Authority, FR-001–FR-008, FR-010–FR-012 e FR-023–FR-030. São contratos documentais herdados, não prova de integração.
- `FATO_DOCUMENTADO` — `IMP-005`, `CF-PRD-FR-007`, `CF-UC-011` e `CF-PFLOW-005` descrevem registrar dados conforme contrato científico. Conservam o estado de direção candidata/em revisão. `CF-PRD-FR-014` é usado somente para preservar associação espacial pela área; não autoriza localização própria da medição.
- `EVIDENCIA_IMPLEMENTACAO` — existem estruturas técnicas para quatro grupos ambientais; sua presença não aprova grupos, campos, unidades, cardinalidades, nulabilidade, precisão ou faixas. O inventário técnico pertence ao plano.
- `PENDENCIA_DE_DECISAO` — `CF-PD-005`/`CF-Q-011` e `PD-002`/`PD-004` não fornecem contrato científico validado nem autoridade designada suficiente para resolver suas lacunas. Documentos históricos não suprem essa aprovação.
- `RECOMENDACAO` — revisão explícita, gravação integral e repetição segura do envio dos dados são propostas locais de experiência e integridade para esta entrega. Os mecanismos da confirmação da coleta na IMP-004 não são automaticamente estendidos às medições. G3 exige confirmação do ciclo antes de implementar.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registrar dados na coleta correta (Priority: P1)

Como participante autorizado, quero informar os dados ambientais aplicáveis a uma coleta existente e conferir o resultado do registro, para preservar observações de campo ligadas à sua origem.

**Why this priority**: É o resultado central da IMP-005 e evita observações sem origem ou com significado científico inventado.

**Independent Test**: Com coleta acessível preparada pela IMP-004, contrato aprovado e permissões/ciclo definidos por G2/G3, preencher um conjunto válido, concluir o registro e reabrir seu resultado no mesmo contexto. Não depende da história de consulta implementada para verificar persistência em teste isolado.

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

### Key Entities

- **Coleta existente**: registro confirmado da IMP-004, com identidade, ocorrência, confirmação, autoria histórica e vínculo territorial preservados.
- **Dados ambientais associados**: observações registradas para essa coleta conforme contrato aplicável. Composição e multiplicidade científica permanecem pendentes em G2; não se define uma entidade por grupo presumido.
- **Referência do contrato científico**: identifica as regras aprovadas usadas no registro, com granularidade, vigência e compatibilidade a decidir pela autoridade competente. Não equivale à versão de cálculo.
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
| G1 — Coleta integrada | `FATO_DOCUMENTADO`: IMP-004 plan/quickstart e sua dependência da IMP-003 | Coleta confirmada integrada, guard contextual compartilhado, papéis, leitura/inatividade, metadados imutáveis e testes de isolamento comprovados; reconciliar contratos com a base real | Bloqueia implementação consumidora; documentação da IMP-004 não substitui código integrado |
| G2 — Ciência e dados | `PENDENCIA_DE_DECISAO`: CF-PD-005, CF-Q-011, PD-002, PD-004 | Autoridade científica/dados identificada; fonte validada; grupos, variáveis, tipos semânticos, unidades, cardinalidades, obrigatoriedade, ausências, precisão/faixas/validações, referência de versão, aplicabilidade e evolução aprovados; exemplos válidos/inválidos | Bloqueia formulário científico, validação, contrato de payload e desenho físico definitivo |
| G3 — Permissões e ciclo dos dados | `PENDENCIA_DE_DECISAO`: CF-PD-003/006 e limites de CREATE_COLLECTION na IMP-004 | Autoridade de produto/dados aprova quem registra/consulta, se há restrição ao autor, unidade do registro, revisão/confirmação, primeira gravação, repetição/conflito, eventual complementação e autoria própria | Bloqueia semântica das operações e autorização específica; não reabre a matriz já aprovada para criar a coleta |

`RECOMENDACAO`: em G3, avaliar registro inicial com revisão em memória, confirmação integral e recuperação da mesma tentativa. Não presumir rascunho persistido, complementação ou atualização. Recomendações não liberam gates.

O escopo e os gates podem ser especificados responsavelmente sem escolher respostas científicas. O planejamento é condicionado, não está pronto para tarefas executáveis ou implementação enquanto G1–G3 permanecerem abertos. Responsáveis nominais e prazos não foram especificados.

### Fora do escopo

Cálculo, classificação e diagnóstico IHFR; pesos, fórmulas, limiares e recomendações científicas; dashboards, gráficos, mapas agregados, histórico/acompanhamento geral; edição ou exclusão de coletas confirmadas; IMP-006/007/008; escolha de Python, Plotly, Leaflet, OpenStreetMap ou integração científica; offline, sincronização, sensores, hardware, importação em massa; código, schema, migrations e tarefas executáveis.

### Fontes e baseline

Base Git: `origin/development` em `f440282a9aefbbb85b5199d0610fdb9ecab3dc87`. Fonte IMP-004: `origin/004-environmental-collection-registration` em `a44ac7ab3d4ead5adae977e53fd9cb9dfe05368e`, consultada somente por leitura. Não houve merge, rebase ou cherry-pick. Requisitos Code-First e governança citados foram consultados no mesmo SHA da IMP-004; classificação e limites preservados. A solicitação atual prevalece sobre o macrofluxo histórico que reunia coleta e medições numa única confirmação.
