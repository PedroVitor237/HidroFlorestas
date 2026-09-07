# Feature Specification: Criação mínima de laboratório

**Feature Branch**: `002-criar-laboratorio`

**Created**: 2026-09-07

**Status**: Ready for planning

**Input**: Especificar a entrega `IMP-002 — Criação mínima de laboratório` como feature vertical em stacked branch baseada em `origin/001-authenticated-access` (`1cfbe43ee28532ed347e0a7129a931adbbc7a802`).

## Contexto, objetivo e classificação das fontes

O objetivo é permitir que uma pessoa autenticada e elegível crie um laboratório mínimo, receba o vínculo inicial aprovado e reencontre esse laboratório no workspace, inclusive após recarregar a página. A identidade da pessoa criadora deve ser determinada exclusivamente pela sessão validada no servidor; nenhuma identidade indicada pelo cliente pode ser usada como autoridade.

- `DECISAO_CONFIRMADA` — origem: solicitação aprovada da equipe nesta tarefa, 2026-09-07, autoridade solicitante não especificada: a entrega é `IMP-002`, usa a branch `002-criar-laboratorio`, depende temporariamente da `IMP-001` e exclui ingresso por código, convites, gestão de participantes, transferência, saída, áreas, coletas, IHFR, mapas, administração global e papéis avançados.
- `DECISAO_CONFIRMADA` — mesma origem: a criação e a consulta são protegidas; a identidade vem da sessão validada no servidor; o cliente não informa proprietário/criador; a persistência deve sobreviver a reload; falhas são controladas; acesso cruzado é proibido.
- `EVIDENCIA_IMPLEMENTACAO` — `origin/001-authenticated-access` fornece a fronteira autoritativa de sessão para usuário ainda `ACTIVE`; a integração e as validações pendentes da `IMP-001` continuam sendo risco da stacked branch.
- `EVIDENCIA_IMPLEMENTACAO` — o schema atual contém laboratório, usuário responsável técnico, código de acesso e vínculo pessoa–laboratório; o workspace atual é mockado e não há serviço ou rota de laboratório conectados. Essa evidência não aprova o modelo de produto.
- `PROPOSTA_PARA_CONFIRMACAO` / `PENDENCIA_DE_DECISAO` — `CF-PD-002` e `CF-PD-006` não definem com autoridade suficiente criação, papel inicial, cardinalidade, dados mínimos, código ou contexto ativo. A revisão humana anterior permanece `REVISAO_HUMANA_PENDENTE_DE_AUTORIDADE`.

## Clarifications

### Session 2026-09-07

- Q: Quem pode criar um laboratório e qual vínculo inicial essa pessoa recebe? → A: Qualquer usuário autenticado e `ACTIVE` pode criar; torna-se responsável inicial e recebe vínculo de participante. Origem: confirmação humana nesta tarefa em 2026-09-07, sob delegação explícita recebida em reuniões via Meet; responsável: pessoa usuária desta sessão, nome não especificado; autoridade: técnica, produto e dados para esta entrega; classificação: `DECISAO_CONFIRMADA`.
- Q: Quais dados devem ser exigidos na criação e como o código de acesso deve ser tratado? → A: Exigir somente nome; permitir nomes repetidos; gerar código único, persistido e não exibido. Origem: confirmação humana nesta tarefa em 2026-09-07, sob delegação explícita recebida em reuniões via Meet; responsável: pessoa usuária desta sessão, nome não especificado; autoridade: técnica, produto e dados para esta entrega; classificação: `DECISAO_CONFIRMADA`.
- Q: Como o workspace deve apresentar laboratórios e tratar o contexto ativo nesta entrega? → A: Permitir no máximo cinco laboratórios acessíveis por usuário, somando criados e participações; listar todos os acessíveis com nome, data de criação e status; o recém-criado aparece na lista sem seleção ativa automática. Origem: confirmação humana nesta tarefa em 2026-09-07, sob delegação explícita recebida em reuniões via Meet; responsável: pessoa usuária desta sessão, nome não especificado; autoridade: técnica, produto e dados para esta entrega; classificação: `DECISAO_CONFIRMADA`.
- Q: Em qual função ou autoridade as decisões estão sendo confirmadas? → A: Autoridade técnica de idealização do projeto e pessoa desenvolvedora responsável pelas decisões técnicas, com delegação explícita para decidir produto e dados desta entrega recebida em reuniões via Meet. Origem: declaração humana nesta tarefa em 2026-09-07; responsável: pessoa usuária desta sessão, nome não especificado; data das reuniões e pessoa delegante: não especificadas; classificação: `DECISAO_CONFIRMADA`.

## Actors

- **Pessoa autenticada elegível**: qualquer pessoa com sessão válida e conta ainda `ACTIVE`, conforme a resposta humana registrada; não há elegibilidade adicional nesta entrega.
- **Pessoa vinculada ao laboratório**: pessoa que pode consultar o laboratório por possuir o vínculo mínimo aprovado; nesta entrega, só o vínculo inicial da pessoa criadora pode ser criado.
- **Responsável inicial**: a pessoa criadora do laboratório; também recebe o vínculo de participante. Permissões adicionais de responsável permanecem fora do escopo.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Criar laboratório persistente (Priority: P1)

Uma pessoa autenticada e elegível informa somente os dados mínimos aprovados e cria um laboratório sem poder escolher outra pessoa como criadora. Ao sucesso, o laboratório e seu vínculo inicial existem integralmente; em falha, nenhum estado parcial permanece.

**Why this priority**: Sem criação persistente, a entrega não produz o contexto mínimo que habilita as próximas funcionalidades.

**Independent Test**: Autenticar uma conta elegível, preencher os dados mínimos, concluir a ação e comprovar que exatamente um laboratório e o vínculo inicial esperado existem; repetir com entrada inválida, identidade extra e falha simulada no vínculo.

**Acceptance Scenarios**:

1. **Given** uma pessoa autenticada e elegível, **When** solicita a criação com todos os dados mínimos válidos, **Then** o laboratório e o vínculo inicial aprovado são criados integralmente para a identidade da sessão.
2. **Given** uma solicitação sem sessão, com sessão inválida/expirada ou de conta que deixou de ser elegível, **When** tenta criar, **Then** nenhum laboratório ou vínculo é criado e uma falha controlada é apresentada.
3. **Given** uma solicitação com campo de identidade, proprietário, criador ou outro campo não permitido, **When** é processada, **Then** ela é rejeitada como entrada inválida sem criar dados.
4. **Given** uma falha durante a criação do vínculo inicial, **When** a operação termina, **Then** o laboratório não fica órfão e a pessoa recebe resposta controlada.

---

### User Story 2 - Reencontrar laboratórios acessíveis (Priority: P2)

Uma pessoa autenticada visualiza no workspace somente os laboratórios aos quais possui o vínculo aprovado, com dados públicos mínimos, incluindo o laboratório recém-criado.

**Why this priority**: A persistência só entrega valor observável quando a pessoa consegue reencontrar o contexto criado com isolamento entre usuários.

**Independent Test**: Preparar duas pessoas e laboratórios com vínculos distintos, consultar e recarregar o workspace de cada uma e comprovar que cada resposta/interface contém apenas seus laboratórios acessíveis e apenas campos públicos aprovados.

**Acceptance Scenarios**:

1. **Given** uma pessoa autenticada com laboratórios acessíveis, **When** abre ou recarrega o workspace, **Then** todos e somente esses laboratórios são apresentados a partir do estado persistido.
2. **Given** uma pessoa autenticada sem laboratório acessível, **When** abre o workspace, **Then** vê estado vazio e a ação de criação conforme sua elegibilidade.
3. **Given** duas pessoas sem vínculo compartilhado, **When** cada uma consulta o workspace, **Then** nenhuma visualiza o laboratório exclusivo da outra.
4. **Given** uma falha de consulta, **When** o workspace tenta carregar, **Then** apresenta erro compreensível e opção segura de tentar novamente, sem mostrar dados mockados como reais.

---

### User Story 3 - Usar o laboratório criado como contexto disponível (Priority: P3)

Após a criação, a pessoa identifica claramente o laboratório como contexto disponível e consegue seguir para o acesso ao laboratório sem depender de estado temporário do navegador.

**Why this priority**: Fecha a jornada do workspace sem antecipar dashboard persistente, seleção global ou recursos internos do laboratório.

**Independent Test**: Criar um laboratório, observar o estado pós-sucesso, recarregar a página e verificar que a mesma ação disponível continua coerente com as decisões de contexto confirmadas.

**Acceptance Scenarios**:

1. **Given** uma criação concluída, **When** o workspace é atualizado, **Then** o laboratório aparece como contexto disponível sem depender de estado local anterior.
2. **Given** mais de um laboratório acessível, se essa cardinalidade for aprovada, **When** a pessoa usa o workspace, **Then** a apresentação e eventual contexto ativo seguem a regra humana registrada sem seleção implícita insegura.

### Edge Cases

- Submissões repetidas, duplo clique ou concorrência não podem criar laboratórios acidentalmente pela mesma ação em andamento; uma nova submissão intencional posterior pode criar outro laboratório, inclusive com o mesmo nome.
- Nome composto apenas por espaços, limites de tamanho e campos extras devem falhar de forma controlada conforme os dados mínimos aprovados.
- A indisponibilidade da persistência não pode fazer o workspace apresentar o laboratório como criado.
- Uma conta que deixa de ser elegível entre a abertura do formulário e a submissão deve ser recusada pelo servidor.
- Uma pessoa cujo vínculo deixa de existir não pode continuar vendo o laboratório por cache ou estado cliente.
- Uma pessoa que já possui cinco laboratórios acessíveis deve receber recusa controlada ao tentar criar outro, sem persistência parcial; o limite considera conjuntamente laboratórios criados e participações.
- Nenhuma falha pode expor identidade interna, código de acesso não aprovado, detalhes de persistência ou diagnóstico técnico.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O produto MUST permitir que qualquer pessoa autenticada e ainda `ACTIVE` crie um laboratório, seja registrada como responsável inicial e receba obrigatoriamente o vínculo inicial de participante.
- **FR-002**: O produto MUST exigir somente um nome para criar o laboratório, MUST permitir nomes repetidos e MUST gerar e persistir um código de acesso único que não será apresentado nesta entrega.
- **FR-003**: O produto MUST obter a identidade da pessoa criadora exclusivamente da sessão validada no servidor e MUST rejeitar qualquer campo cliente que tente informar identidade, proprietário ou criador.
- **FR-004**: O produto MUST validar de forma autoritativa todos os dados de criação antes de persistir qualquer parte da operação.
- **FR-005**: O produto MUST criar o laboratório e o vínculo inicial aprovado como uma única operação: ambos existem no sucesso ou nenhum existe na falha.
- **FR-006**: O produto MUST retornar apenas campos públicos explicitamente aprovados, sem expor registros internos completos, identificadores de usuário, relações ou metadados desnecessários.
- **FR-007**: O produto MUST permitir que uma pessoa autenticada consulte somente laboratórios para os quais possui o vínculo aprovado; possuir apenas a identidade de outra pessoa ou de outro laboratório não concede acesso.
- **FR-008**: O produto MUST limitar cada pessoa a cinco laboratórios acessíveis no total, somando os que criou e aqueles em que participa, e MUST listar no workspace todos e somente os acessíveis com nome, data de criação e status; o recém-criado aparece na lista sem se tornar automaticamente um contexto ativo.
- **FR-009**: O workspace MUST usar o estado persistido como fonte de verdade e MUST manter o laboratório visível após recarregar a página.
- **FR-010**: O fluxo MUST apresentar estados distinguíveis de vazio, carregamento, sucesso e erro, com nova tentativa segura após falha recuperável.
- **FR-011**: A ação de criação MUST prevenir submissão duplicada acidental enquanto uma solicitação estiver em andamento e MUST seguir a regra confirmada para duplicidade ou concorrência.
- **FR-012**: A criação e a consulta MUST negar de forma controlada sessão ausente, inválida ou expirada e pessoa que deixou de ser elegível.
- **FR-013**: A interface MUST ser utilizável por teclado, ter rótulos e foco perceptíveis, feedback compreensível e comportamento funcional em telas móveis e amplas.
- **FR-014**: O produto MUST manter fora deste recorte ingresso por código, convites, aprovação e administração de participantes, transferência, saída, edição, áreas, coletas, IHFR, mapas, dashboard/histórico persistentes, administração global e papéis avançados.
- **FR-015**: Qualquer pessoa vinculada MUST poder abrir as informações do laboratório e consultar uma lista rolável de membros contendo somente nome e avatar neutro formado pelas iniciais.
- **FR-016**: Somente a pessoa criadora MUST poder desativar ou excluir o laboratório; essa autorização MUST ser validada no servidor e não apenas ocultada na interface.
- **FR-017**: Desativação e exclusão MUST exigir que a pessoa digite exatamente o nome atual do laboratório, com confirmação validada novamente no servidor.
- **FR-018**: A exclusão MUST remover permanentemente o laboratório e seus vínculos em uma operação atômica, mas MUST ser recusada quando existirem áreas ou dados científicos dependentes.
- **FR-019**: Um laboratório desativado MUST continuar visível com status inativo; esta entrega não inclui reativação.

### Key Entities

- **Laboratório**: contexto colaborativo mínimo criado e persistido, com identidade própria, nome obrigatório não exclusivo e código de acesso único não público nesta entrega.
- **Vínculo inicial**: associação entre a identidade autenticada e o laboratório criado, cuja semântica/papel depende de confirmação humana.
- **Pessoa autenticada elegível**: principal validado pela dependência `IMP-001`; detalhes internos de sessão não integram o contrato público da feature.

## Dependencies, Risks, and Boundaries

- A feature é uma stacked branch temporariamente dependente de `IMP-001`; a integração futura exigirá atualização de refs, confirmação do commit-base em `development`, autorização para rebase/reconciliação e repetição integral das validações.
- A `IMP-001` ainda registra validações pendentes, especialmente E2E, lint, typecheck, build, validação manual e reconciliação documental. A presente feature não as marca, corrige nem declara concluídas.
- Arquivos de autenticação são dependências de leitura/consumo e não devem ter seu contrato público alterado pela `IMP-002`.
- `INFERENCIA`: o schema atual parece capaz de armazenar laboratório e vínculo, mas a necessidade de migration só pode ser concluída no plano após as decisões de dados; o schema não define intenção.
- `RECOMENDACAO`: preservar o schema se ele suportar integralmente as decisões confirmadas e usar uma operação atômica com consultas filtradas pelo vínculo autenticado.
- `DECISAO_CONFIRMADA`: a autoridade técnica declarou ter recebido delegação explícita, em reuniões via Meet, para decidir requisitos de produto e modelo de dados desta entrega; data das reuniões e identidade da pessoa delegante não foram especificadas.

## Out of Scope

- Cadastro, login, logout, reestruturação ou correções gerais da autenticação.
- Entrada por código, convites, aprovação, listagem ou administração de participantes.
- Transferência de responsabilidade, saída, remoção ou edição de membros, reativação e edição dos dados do laboratório.
- Papéis avançados, administração global, áreas monitoradas, coletas, dados ambientais, IHFR, mapas, dashboard e histórico persistentes.
- Rate limiting, revisão geral de segurança, redesign completo, novas dependências sem aprovação, mudanças científicas ou mudanças não relacionadas de schema/migrations.

## Assumptions

- A fronteira da `IMP-001` continuará validando a sessão e a elegibilidade básica `ACTIVE` e fornecendo uma identidade interna estável; qualquer mudança incompatível deve ser reconciliada antes de implementar.
- Validação no cliente é somente conveniência; servidor e persistência são autoritativos.
- Mensagens de falha não revelam existência de outros usuários, laboratórios ou detalhes internos.
- Decisões ainda não respondidas não são suposições: permanecem `PENDENCIA_DE_DECISAO` e bloqueiam o plano.

## Traceability

- Backlog: `IMP-002`.
- Produto e domínio: `CF-PD-002`, `CF-PD-006`, `CF-Q-007`, `CF-Q-008`, `CF-Q-009`.
- Lacunas: `CF-GAP-006`, `CF-GAP-008`, `CF-GAP-009`, `CF-GAP-010`.
- Requisitos Code-First: `CF-PRD-FR-003`, `CF-PRD-FR-004`, `CF-PRD-FR-011`, `CF-PRD-NFR-001`.
- Casos e fluxos: `CF-UC-004`, `CF-UC-005`, `CF-UC-006`, `CF-PFLOW-003`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em 100% dos cenários autorizados de teste, uma criação válida produz exatamente um laboratório persistente e o vínculo inicial aprovado, sem estado parcial.
- **SC-002**: Em 100% dos cenários negativos de sessão, elegibilidade, entrada inválida e identidade fornecida pelo cliente, nenhum laboratório ou vínculo é criado.
- **SC-003**: Em 100% dos testes com duas identidades isoladas, cada pessoa visualiza somente laboratórios aos quais possui o vínculo aprovado.
- **SC-004**: O laboratório criado permanece disponível após reload em 100% dos cenários de persistência bem-sucedida.
- **SC-005**: Uma pessoa consegue concluir o fluxo mínimo de criação em até 2 minutos, sem assistência, usando apenas os campos confirmados.
- **SC-006**: Todos os estados do fluxo — vazio, carregamento, sucesso e erro — são identificáveis e acionáveis por teclado em viewport móvel e ampla.
- **SC-007**: Em 100% das respostas exercitadas, nenhum campo de identidade interna, relação ou metadado não aprovado é exposto.
- **SC-008**: Em 100% dos testes no limite, uma pessoa com menos de cinco laboratórios acessíveis pode criar e uma pessoa com cinco recebe recusa controlada sem qualquer novo laboratório ou vínculo.
- **SC-009**: Em 100% dos testes de autorização, membros consultam informações, mas somente a pessoa criadora consegue desativar ou excluir após confirmação textual exata.
- **SC-010**: A lista de membros permanece utilizável com rolagem quando excede o espaço disponível e não expõe email, ID ou outros dados pessoais.

## Amendment — Configurações do laboratório (2026-09-07)

`DECISAO_CONFIRMADA`: a autoridade técnica desta sessão ampliou expressamente a IMP-002 para incluir popup de informações, lista rolável de membros, desativação e exclusão com confirmação textual no padrão GitHub. Esta decisão substitui apenas as exclusões de escopo conflitantes; as demais fronteiras permanecem.
