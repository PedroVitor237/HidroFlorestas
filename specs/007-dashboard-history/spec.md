# Feature Specification: Dashboard e histórico básico

**Feature Branch**: `007-dashboard-history`

**Created**: 2026-09-17

**Status**: Especificação, plano e tarefas reconciliados em 2026-09-18 com `origin/development` `5d9ca6f`, que integra a IMP-005. Nova análise independente pendente. A IMP-005 permanece fora do incremento mínimo por decisão explícita de escopo; a IMP-006 continua condicionada aos seus gates.

**Input**: IMP-007 — permitir que um participante acompanhe o ciclo do laboratório explicitamente selecionado por meio de um resumo e de um histórico básicos, rastreáveis e derivados dos registros de origem, sem criar uma fonte paralela de verdade.

## Authority and Scope

- `DECISAO_CONFIRMADA` — a solicitação desta tarefa exige implementar a IMP-007 sobre a `development` atual, preservar o incremento mínimo de resumo e histórico e não incluir cálculo, diagnóstico ou dados científicos. A mesma solicitação define o laboratório explicitamente selecionado como contexto do incremento e recomenda manter a IMP-005 fora do runtime quando nenhuma fonte autoritativa exigir sua inclusão.
- `FATO_DOCUMENTADO` — `IMP-007`, `CF-PRD-FR-010`, `CF-PRD-NFR-002`, `CF-UC-014` e `CF-PFLOW-007` sustentam acompanhamento por resumo e histórico com retorno ao registro de origem. O pacote Code-First permanece em revisão e seus requisitos continuam candidatos.
- `EVIDENCIA_IMPLEMENTACAO` — `origin/development` em `5d9ca6f8f848867e8152bc25e86abc9a6e73358f` contém as IMP-003, IMP-004 e IMP-005 integradas. Há laboratório contextual, áreas persistidas, coletas confirmadas, conjuntos ambientais imutáveis, leitura autorizada em laboratório inativo e destinos contextuais de detalhe. O dashboard atual somente encaminha ao seletor de contexto; o componente de histórico permanece desconectado e usa pessoas, datas, tipos e destinos fixos.
- `EVIDENCIA_IMPLEMENTACAO` — a IMP-005 integrada fornece `EnvironmentalMeasurementSet` único por coleta, `confirmedAt`, contrato versionado e detalhe contextual. Sua exclusão do dashboard básico é uma decisão de escopo desta entrega, não ausência de runtime. Uma extensão posterior pode projetá-la sem bloquear o mínimo atual. A IMP-006 continua sem contrato implementável integrado e mantém gates científicos e operacionais.
- `DECISAO_CONFIRMADA` — para esta entrega, conteúdo e eventos ficam limitados a projeções de leitura de registros de origem realmente integrados; retenção acompanha a disponibilidade desses registros; a projeção normal não expõe nome, e-mail ou identificador de autor. Isso resolve o incremento mínimo sem criar auditoria, retenção independente ou exposição pessoal por inferência.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver o resumo do laboratório selecionado (Priority: P1)

Como participante com vínculo atual, quero ver um resumo fiel do laboratório que selecionei, para reconhecer o estado do ciclo e seguir para seus registros reais.

**Why this priority**: O resumo estabelece o contexto seguro e entrega valor mesmo antes de existir qualquer módulo posterior.

**Independent Test**: Preparar um laboratório acessível com quantidades conhecidas de áreas e coletas confirmadas, abrir seu dashboard e comparar todos os totais e destinos com os registros de origem.

**Acceptance Scenarios**:

1. **Given** participante elegível, vínculo atual e laboratório ativo explicitamente selecionado, **When** abre o dashboard, **Then** vê identidade e estado do laboratório, total de áreas e total de coletas confirmadas derivados dos registros acessíveis daquele laboratório.
2. **Given** laboratório sem áreas ou coletas confirmadas, **When** abre o dashboard, **Then** vê zero para o total correspondente e orientação coerente com as ações que seu papel e o estado do laboratório permitem, sem cards ou resultados fictícios.
3. **Given** resumo carregado, **When** escolhe um atalho disponível, **Then** chega à listagem contextual de áreas ou ao registro real indicado, preservando o mesmo laboratório.

---

### User Story 2 - Reencontrar registros no histórico (Priority: P1)

Como participante com acesso atual, quero percorrer acontecimentos derivados dos registros do laboratório, para reencontrar uma área ou coleta e verificar sua origem.

**Why this priority**: A rastreabilidade entre o acontecimento mostrado e o registro persistido é o resultado central da IMP-007.

**Independent Test**: Preparar áreas e coletas confirmadas com instantes conhecidos, consultar o histórico e verificar tipo, ordem, contexto e destino de cada item sem depender dos cards do resumo.

**Acceptance Scenarios**:

1. **Given** áreas criadas e coletas confirmadas no laboratório selecionado, **When** consulta o histórico, **Then** cada item identifica seu tipo, instante rastreável, contexto mínimo e registro de origem, em ordem do mais recente para o mais antigo.
2. **Given** dois itens com o mesmo instante, **When** o histórico é consultado repetidamente, **Then** a ordem relativa permanece determinística e nenhum item é duplicado ou omitido entre páginas.
3. **Given** item de área criada ou coleta confirmada, **When** o participante ativa seu destino, **Then** chega respectivamente ao detalhe da área ou ao detalhe da coleta dentro da cadeia laboratório → área → coleta autorizada.
4. **Given** nenhum registro elegível, **When** consulta o histórico, **Then** vê estado vazio que não implica falha nem inventa atividade.

---

### User Story 3 - Acompanhar mudanças e estados de leitura (Priority: P2)

Como participante, quero que o acompanhamento reflita mudanças confirmadas e comunique carregamento ou falha, para não agir sobre informação falsa ou ambígua.

**Why this priority**: Um resumo aparentemente atual, mas derivado de mock ou cache indefinido, compromete a confiança no ciclo.

**Independent Test**: Abrir o dashboard, criar um registro por um fluxo de origem autorizado, retornar ou atualizar a visão e exercitar carregamento, erro e nova tentativa.

**Acceptance Scenarios**:

1. **Given** uma área ou coleta acabou de ser confirmada com sucesso em seu fluxo de origem, **When** o participante retorna ao dashboard ou solicita atualização, **Then** o total e o histórico passam a refletir o registro persistido sem exigir duplicação manual de evento.
2. **Given** dados ainda estão sendo obtidos, **When** a visão é aberta, **Then** o estado de carregamento é perceptível e não apresenta zero ou vazio como resultado definitivo.
3. **Given** falha ao obter resumo ou histórico, **When** a visão termina de carregar, **Then** informa indisponibilidade sem conservar dados de outro laboratório e oferece nova tentativa segura.

---

### User Story 4 - Consultar com acesso e privacidade preservados (Priority: P2)

Como participante autorizado, quero consultar o acompanhamento sem expor dados de outro laboratório ou dados pessoais desnecessários, inclusive quando o contexto muda.

**Why this priority**: O dashboard agrega informação e, portanto, precisa preservar as mesmas fronteiras de acesso e minimização das fontes.

**Independent Test**: Exercitar a matriz com dois laboratórios, vínculo ativo, vínculo removido e laboratório inativo, verificando conteúdo, escrita ausente e respostas indistinguíveis para recurso inexistente ou inacessível.

**Acceptance Scenarios**:

1. **Given** dois laboratórios com registros distintos, **When** o participante abre um deles, **Then** resumo, histórico e destinos contêm somente registros autorizados do contexto selecionado.
2. **Given** laboratório inativo e vínculo atual, **When** o participante abre o dashboard, **Then** consulta os mesmos registros históricos autorizados em modo somente leitura, com estado inativo evidente e sem ações de criação ou alteração.
3. **Given** vínculo removido ou conta inelegível, **When** tenta abrir, atualizar ou seguir um item, **Then** nenhum dado do laboratório é entregue e a resposta não permite distinguir recurso inacessível de inexistente.
4. **Given** acompanhamento normal autorizado, **When** resumo e histórico são exibidos, **Then** nenhum nome, e-mail, avatar, identificador interno de autor ou dado científico detalhado desnecessário aparece.

### Edge Cases

- Troca do laboratório selecionado durante carregamento: resultados tardios do contexto anterior não podem aparecer no novo contexto.
- Vínculo, elegibilidade ou estado do laboratório muda entre a abertura e a leitura de uma página: cada leitura e navegação revalida o contexto atual.
- Registro de origem deixa de estar disponível conforme sua própria política: o item derivado deixa de ser elegível; não permanece uma cópia órfã no histórico.
- Coleta possui instante de ocorrência diferente do instante de confirmação: o evento “coleta confirmada” é ordenado pela confirmação, e a ocorrência pode ser mostrada separadamente sem substituir o instante do evento.
- Item de origem existe, mas seu destino deixa de ser autorizado: o dashboard não revela o registro e a navegação aplica a mesma resposta de recurso inexistente/inacessível.
- Falha parcial entre resumo e histórico: cada região identifica seu próprio estado; uma falha não transforma a outra em zero nem mistura dados antigos de contexto diferente.
- Registro novo é confirmado entre páginas: o cursor não cria snapshot. Uma continuação para itens mais antigos não repete itens já vistos; ao voltar para uma parte mais recente, essa parte é consultada novamente e pode refletir a nova origem. Refresh reinicia a travessia na primeira parte e inclui as fontes então elegíveis.
- Conteúdo da IMP-005, embora integrado, não aparece neste incremento por decisão de escopo; conteúdo da IMP-006 continua ausente até implementação e integração. Nenhum dos dois aparece como diagnóstico ou conclusão científica.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Toda leitura do dashboard MUST exigir participante autenticado e elegível, vínculo atual e laboratório explicitamente selecionado; autoria histórica, papel global ou identificador isolado MUST NOT conceder acesso.
- **FR-002**: Resumo, histórico, contagens e destinos MUST ser calculados apenas com registros autorizados cuja cadeia de origem pertença ao laboratório selecionado. Dados de laboratórios diferentes MUST NOT ser agregados, misturados ou entregues.
- **FR-003**: O resumo mínimo MUST identificar nome e estado do laboratório, total de áreas acessíveis e total de coletas confirmadas acessíveis. Cada total MUST ser derivado dos registros de origem e zero MUST significar ausência real, nunca carregamento ou falha.
- **FR-004**: O histórico mínimo MUST projetar somente os tipos `área criada` e `coleta confirmada` a partir dos registros integrados. Atualização, exclusão, mudança de estado, autoria de terceiros e outros verbos MUST NOT ser inferidos sem evento ou estado de origem confiável.
- **FR-005**: Cada item MUST conter identidade estável para paginação, tipo compreensível, instante do evento, identificação contextual mínima do registro e referência suficiente para validar e alcançar sua origem autorizada.
- **FR-006**: Itens MUST ser ordenados por instante do evento do mais recente para o mais antigo, usando criação da área para `área criada` e confirmação da coleta para `coleta confirmada`. Empates MUST ter desempate estável e não podem causar duplicidade ou omissão.
- **FR-007**: O histórico MUST disponibilizar resultados em partes de no máximo 20 itens e indicar quando há mais registros, preservando ordem e contexto entre avanços e retornos.
- **FR-008**: O destino de `área criada` MUST ser o detalhe autorizado da área; o destino de `coleta confirmada` MUST ser o detalhe autorizado da coleta dentro de seu laboratório e área. Destino genérico, inexistente ou construído sem a cadeia contextual MUST NOT ser exibido.
- **FR-009**: Resumo e histórico MUST distinguir carregamento, vazio e erro. Falha MUST apresentar mensagem compreensível e nova tentativa; dados de outro contexto, números fixos ou sucesso presumido MUST NOT servir como fallback.
- **FR-010**: Após uma mudança confirmada na fonte, retornar ao dashboard ou solicitar atualização MUST consultar novamente as fontes e refletir o estado persistido. Atualização em tempo real sem ação do participante não é exigida.
- **FR-011**: Laboratório inativo MUST manter leitura do resumo, histórico e destinos existentes para quem conservar acesso, sinalizar modo somente leitura e omitir ações de criação ou alteração. Laboratório ativo MUST mostrar somente ações compatíveis com o papel atual.
- **FR-012**: Perda de vínculo, inelegibilidade ou acesso a recurso de outro laboratório MUST interromper a entrega de dados em toda leitura e navegação. Recurso inexistente e inacessível MUST permanecer indistinguíveis.
- **FR-013**: A projeção normal MUST minimizar dados: não expor nome, e-mail, avatar ou identificador interno do autor, observações livres, coordenadas, credenciais, chaves, evidências restritas ou detalhes científicos. Autoria e proveniência continuam preservadas na fonte, sem serem copiadas ou publicadas desnecessariamente.
- **FR-014**: A IMP-007 MUST NOT criar entidade, cópia ou retenção independente de atividade. A elegibilidade e a duração de cada item MUST acompanhar o registro de origem e sua política; a feature não promete retenção permanente.
- **FR-015**: Dados ambientais da IMP-005 integrada ficam fora do incremento mínimo da IMP-007 por decisão de escopo. Uma extensão posterior MAY acrescentar existência de conjunto confirmado e o evento `dados ambientais confirmados` após especificação e análise próprias. Valores, grupos, qualidade ou conclusões MUST NOT ser expostos por esta entrega.
- **FR-016**: Diagnóstico da IMP-006 somente MAY compor futuramente resumo ou histórico após a feature ser implementada e integrada e seus gates científicos, de proveniência e de ciclo estarem satisfeitos. Ausência, estrutura legada ou planejamento MUST NOT ser apresentado como diagnóstico aceito, score, classe, risco ou conclusão.
- **FR-017**: A interface MUST manter leitura e navegação completas em larguras de 320 px ou superiores, sem rolagem horizontal para o conteúdo principal e sem perda de tipo, instante ou destino do item.
- **FR-018**: Controles e destinos MUST ser operáveis por teclado, possuir nome acessível e foco perceptível; estados de carregamento, erro, vazio, atualização e somente leitura MUST ser comunicados sem depender exclusivamente de cor ou ícone.
- **FR-019**: A IMP-007 MUST permanecer somente leitura sobre os registros acompanhados e MUST NOT calcular, aceitar ou alterar diagnóstico IHFR; capturar ou corrigir dados ambientais; editar registros de origem; criar auditoria; ou incluir mapa, gráficos analíticos, recomendações ou IA.

### Key Entities

- **Contexto do laboratório**: laboratório explicitamente selecionado, seu estado, o vínculo e o papel atuais que delimitam toda leitura e navegação.
- **Resumo do ciclo**: projeção transitória de identidade, estado e totais derivados dos registros autorizados; não é uma entidade persistida nem fonte de verdade.
- **Item de histórico derivado**: representa a criação de uma área ou a confirmação de uma coleta a partir do registro de origem, com tipo, instante e destino contextual; não é um log de auditoria.
- **Área de origem**: registro persistido do laboratório que fornece identidade, nome e instante de criação e constitui o destino de um item de área.
- **Coleta de origem**: registro confirmado ligado a uma área e ao laboratório, que fornece identidade, ocorrência, confirmação e destino do item de coleta.
- **Fonte futura condicionada**: dados ambientais confirmados ou diagnóstico aceito que só se tornam elegíveis depois de implementação, integração e reconciliação dos contratos correspondentes.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em uma matriz com ao menos dois laboratórios, três áreas e quatro coletas confirmadas distribuídas entre eles, 100% dos totais e itens do dashboard correspondem ao laboratório selecionado e zero registro cruza contextos.
- **SC-002**: Para 100% dos itens dos dois tipos integrados, o participante autorizado alcança o detalhe correto de origem em uma única ativação a partir do item, sem destino quebrado ou genérico.
- **SC-003**: Em conjuntos com instantes iguais e mais de 20 registros, 100% dos itens aparecem uma única vez ao percorrer todas as partes e mantêm a mesma ordem em consultas repetidas sem mudança das fontes.
- **SC-004**: Em 100% dos cenários de carregamento, vazio, erro, laboratório inativo e perda de acesso, participantes distinguem corretamente o estado apresentado; zero cenário usa mock, zero ou dado de outro contexto como fallback.
- **SC-005**: Na matriz de acesso com vínculo atual, vínculo removido, conta inelegível e dois laboratórios, ocorrem zero leituras indevidas e zero exposições dos dados pessoais e sensíveis proibidos por FR-013.
- **SC-006**: Após criação ou confirmação bem-sucedida na fonte, 100% dos cenários de retorno ou atualização mostram o novo total e item sem registro manual de atividade.
- **SC-007**: Em verificação nas larguras de 320 px, 768 px e 1280 px, 100% das informações essenciais e destinos permanecem visíveis e operáveis sem rolagem horizontal do conteúdo principal.
- **SC-008**: Em verificação apenas por teclado e com tecnologia assistiva, 100% dos controles do fluxo principal recebem foco perceptível, têm nome compreensível e comunicam os estados sem depender somente de cor.
- **SC-009**: Em teste moderado de cada cenário principal com participantes representativos, pelo menos 90% identificam o laboratório, distinguem o estado da visão e localizam um registro de origem sem ajuda.

**Estado de validação humana**: a parcela de SC-008 que exige tecnologia assistiva permanece `NAO_VERIFICADO` até execução manual registrada; testes automatizados de teclado, foco e ARIA não a substituem. SC-009 também permanece `NAO_VERIFICADO` e depende de estudo moderado separado com participantes representativos.

## Assumptions

### Baseline, dependências e gates

| Gate | Classificação e fonte | Estado para IMP-007 | Consequência |
|---|---|---|---|
| G1 — Laboratório, área e coleta | `EVIDENCIA_IMPLEMENTACAO`: IMP-003, IMP-004 e IMP-005 integradas em `origin/development` `5d9ca6f8f848867e8152bc25e86abc9a6e73358f` | **FECHADO** para o incremento mínimo | Permite resumo de áreas/coletas e itens `área criada`/`coleta confirmada`, consumindo os contratos reais integrados. |
| G2 — Dados ambientais | `EVIDENCIA_IMPLEMENTACAO`: IMP-005 integrada em `5d9ca6f8f848867e8152bc25e86abc9a6e73358f`, com `EnvironmentalMeasurementSet` e detalhe contextual | **FECHADO** quanto à disponibilidade; **FORA DO ESCOPO** da IMP-007 mínima | Não bloqueia o dashboard básico. Qualquer projeção ambiental será extensão posterior explicitamente especificada, sem expor payload científico. |
| G3 — Diagnóstico IHFR | `FATO_DOCUMENTADO`: especificação da IMP-006 em `f5f6e27de2a81d64fa6e829d44d68669ba447739`, com gates científicos e operacionais abertos | **ABERTO** para projeção diagnóstica | Não bloqueia o incremento mínimo nem o planejamento; bloqueia qualquer resultado, estado, score, classe ou evento diagnóstico. |

### Decisões de recorte

- O resumo inicial contém somente identidade/estado do laboratório e totais de áreas e coletas confirmadas. Não há indicador científico ou percentual de conclusão.
- O histórico inicial é uma união ordenada de projeções dos registros de origem, não uma trilha normativa de auditoria.
- Retenção, correção e remoção pertencem às fontes. Esta feature não conserva snapshot independente e, portanto, não promete reconstrução forense de estados anteriores.
- A atualização exigida ocorre ao retornar ou pedir nova leitura; sincronização em tempo real e notificações ficam fora do escopo.
- Busca textual e filtros adicionais não são necessários para o incremento mínimo; a paginação temporal e os tipos explícitos sustentam a localização básica.

### Pendências não bloqueantes e reconciliação futura

- `PENDENCIA_DE_DECISAO` — uma política institucional de retenção dos registros de origem não foi localizada. A IMP-007 permanece implementável porque não cria retenção própria; qualquer futura exigência de histórico imutável ou forense exigirá decisão e outra entrega.
- `PENDENCIA_DE_DECISAO` — uma extensão futura da IMP-007 deverá decidir se e como publicar acontecimentos da IMP-005 integrada; a IMP-006 ainda exige reconciliação após implementação. Essas extensões não entram no escopo implementável atual.
- Antes de implementar itens futuros, reler os commits efetivamente integrados; os hashes publicados consultados nesta especificação não provam integração nem permanecem necessariamente como HEAD.

### Fora do escopo

Cálculo, aceite, associação ou alteração de diagnóstico IHFR; captura ou correção de dados ambientais; edição de área ou coleta; trilha de auditoria nova; retenção permanente; nomes/e-mails de autores no histórico normal; mapa territorial; gráficos analíticos; IA; notificações; sincronização em tempo real; definição de tecnologia, schema, endpoints ou bibliotecas.

### Fontes consultadas

Base Git reconciliada: `origin/development` em `5d9ca6f8f848867e8152bc25e86abc9a6e73358f`. IMP-003, IMP-004 e IMP-005 estão integradas; a IMP-006 permanece publicada e não integrada. Foram consultados o backlog, os contratos e a implementação real de laboratório, área, coleta e dados ambientais. A `development` foi incorporada na branch IMP-007 por merge normal, sem conflitos.
