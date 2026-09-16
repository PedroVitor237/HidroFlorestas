# Feature Specification: Cadastro e consulta espacial de área

**Feature Branch**: `003-area-registration-and-viewing`

**Created**: 2026-09-14

**Status**: Ready for Planning

**Input**: Especificar a entrega `IMP-003 — Cadastro e consulta espacial de área`, incluindo papéis contextuais mínimos do laboratório, seleção explícita e preservada do contexto, cadastro persistente de uma área representada por um ponto e consulta da área em listagem e detalhe.

## Objective and Product Outcome

Permitir que um participante autenticado escolha explicitamente um laboratório acessível e opere em um contexto identificável durante a navegação. Nesse contexto, proprietários e administradores de um laboratório ativo podem cadastrar uma área persistente representada por um ponto confirmado, e todos os membros vinculados podem reencontrar a área, consultar seus dados e visualizar o marcador correspondente.

O resultado vertical da IMP-003 estabelece as fronteiras de autorização, autoria, isolamento por laboratório e representação espacial necessárias à futura IMP-004, sem implementar coletas, análise territorial ou infraestrutura cartográfica avançada.

## Authority and Decision Record

As decisões desta seção têm origem na solicitação aprovada da equipe para a IMP-003, em 2026-09-14, e são classificadas como `DECISAO_DA_EQUIPE_PARA_A_ESPECIFICACAO`. Elas governam somente o recorte desta feature e não atualizam por si só os documentos canônicos externos ao diretório da feature.

- `DECISAO_DA_EQUIPE_PARA_A_ESPECIFICACAO` — os papéis do vínculo com o laboratório são `OWNER`, `ADMIN` e `MEMBER`; são contextuais e não alteram nem reutilizam a autorização global da plataforma.
- `DECISAO_DA_EQUIPE_PARA_A_ESPECIFICACAO` — cada laboratório possui exatamente um `OWNER`; o criador é proprietário, não há transferência, e somente o proprietário promove ou rebaixa membros entre `MEMBER` e `ADMIN` nesta entrega.
- `DECISAO_DA_EQUIPE_PARA_A_ESPECIFICACAO` — nenhum laboratório é selecionado automaticamente; a pessoa escolhe um laboratório acessível e a navegação mantém essa escolha explícita e identificável após reload.
- `DECISAO_DA_EQUIPE_PARA_A_ESPECIFICACAO` — a autorização é revalidada no servidor a cada operação, considerando conta `ACTIVE`, vínculo e papel atuais, estado do laboratório, ação solicitada e associação do recurso ao mesmo laboratório; um identificador nunca concede acesso por si só.
- `DECISAO_DA_EQUIPE_PARA_A_ESPECIFICACAO` — laboratório inativo permanece consultável pelos membros vinculados em modo somente leitura, sem criação de áreas ou outras atualizações de domínio; reativação não integra a feature.
- `DECISAO_DA_EQUIPE_PARA_A_ESPECIFICACAO` — a revogação de vínculo retira o acesso imediatamente sem apagar dados nem autoria histórica e sem permitir inferência sobre recursos antes acessíveis.
- `DECISAO_DA_EQUIPE_PARA_A_ESPECIFICACAO` — a representação espacial inicial da área é exclusivamente um ponto final confirmado por latitude e longitude; geolocalização do dispositivo é opcional, depende de ação explícita e nunca substitui a revisão da pessoa.
- `DECISAO_DA_EQUIPE_PARA_A_ESPECIFICACAO` — o mapa da IMP-003 é um instrumento local de cadastro e consulta de uma área; o ambiente territorial agregado, com múltiplos registros, filtros, camadas, agrupamentos, agregações e outras geometrias, pertence à IMP-008.
- `DECISAO_DA_EQUIPE_PARA_A_ESPECIFICACAO` — a autoria é derivada do principal autenticado e preservada internamente, mas o criador e seu identificador não são expostos nesta entrega; o DTO público de autenticação permanece `{ firstName, lastName, image }`.

Não foi localizado conflito material entre essas decisões e os contratos integrados da IMP-001 e da IMP-002. As decisões atuais especializam gaps anteriormente abertos sobre papéis, acesso, dados mínimos e representação espacial; alternativas técnicas cartográficas continuam sem seleção.

## Actors

- **Proprietário do laboratório (`OWNER`)**: criador e único proprietário contextual; consulta áreas, cadastra áreas em laboratório ativo e gerencia a promoção ou o rebaixamento dos demais membros.
- **Administrador do laboratório (`ADMIN`)**: membro promovido pelo proprietário; consulta áreas e cadastra áreas em laboratório ativo, mas não gerencia papéis.
- **Membro do laboratório (`MEMBER`)**: participante comum; consulta áreas do laboratório, mas não cadastra áreas nem gerencia papéis.
- **Participante autorizado**: termo coletivo para uma pessoa autenticada, com conta `ACTIVE` e vínculo atual cujo papel permite a ação solicitada.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Estabelecer papéis contextuais mínimos (Priority: P1)

Como proprietário de um laboratório, quero que cada vínculo tenha um papel contextual e poder promover ou rebaixar os demais membros, para que o cadastro de áreas tenha uma autorização inequívoca sem confundir administração do laboratório com administração global da plataforma.

**Why this priority**: A matriz de papéis é predecessora obrigatória das demais histórias; sem ela, não é possível distinguir quem pode cadastrar uma área nem preservar o proprietário único.

**Independent Test**: Preparar laboratórios novos e existentes com criadores e demais vínculos, verificar os papéis resultantes e exercer promoção e rebaixamento com cada papel, comprovando a unicidade do proprietário e a separação dos papéis globais.

**Acceptance Scenarios**:

1. **Given** um laboratório novo criado por uma pessoa elegível, **When** a criação é concluída, **Then** o laboratório e o vínculo dessa pessoa são criados atomicamente e ela é o único `OWNER`.
2. **Given** um laboratório e vínculos preexistentes, **When** os papéis passam a ser aplicados, **Then** o criador resulta como único `OWNER`, os demais vínculos resultam como `MEMBER` e ninguém se torna `ADMIN` automaticamente.
3. **Given** um `OWNER` e um `MEMBER` do mesmo laboratório, **When** o proprietário promove o membro, **Then** o vínculo passa a `ADMIN` sem alterar qualquer papel global da conta.
4. **Given** um `OWNER` e um `ADMIN` do mesmo laboratório, **When** o proprietário rebaixa o administrador, **Then** o vínculo passa a `MEMBER` sem alterar o proprietário.
5. **Given** um `ADMIN` ou `MEMBER`, **When** tenta gerenciar papéis, **Then** a operação é negada sem revelar ou alterar dados não autorizados.
6. **Given** qualquer tentativa de promover o proprietário, rebaixá-lo ou criar outro proprietário, **When** a operação é avaliada, **Then** ela é recusada e o laboratório mantém exatamente um `OWNER`.

---

### User Story 2 - Selecionar e preservar o contexto do laboratório (Priority: P2)

Como participante vinculado, quero escolher explicitamente um laboratório acessível e manter esse contexto visível durante reload e navegação, para saber em qual espaço estou operando e impedir ações acidentais ou cruzadas.

**Why this priority**: O laboratório contextualizado é a fronteira de isolamento para o cadastro e a consulta de áreas.

**Independent Test**: Preparar uma pessoa com dois laboratórios acessíveis, entrar sem contexto selecionado, escolher cada laboratório e navegar/recarregar, comprovando que não há seleção automática, que a escolha permanece identificável e que recursos do outro laboratório não são revelados.

**Acceptance Scenarios**:

1. **Given** uma pessoa com um ou mais laboratórios acessíveis e nenhum contexto escolhido, **When** acessa o workspace, **Then** nenhum laboratório é selecionado automaticamente e ela recebe uma escolha explícita.
2. **Given** uma escolha explícita de laboratório acessível, **When** a pessoa navega para áreas ou recarrega a página, **Then** o laboratório escolhido continua identificável e a navegação carrega explicitamente esse contexto.
3. **Given** um laboratório inativo e um membro ainda vinculado, **When** ele seleciona o laboratório, **Then** consegue consultar seu contexto e suas áreas em modo somente leitura.
4. **Given** vínculo revogado, laboratório inexistente, laboratório sem vínculo ou referência a área de outro laboratório, **When** a pessoa tenta usar o contexto ou o recurso, **Then** o acesso é negado com comportamento que não permite distinguir a existência do recurso inacessível.
5. **Given** uma conta que deixou de estar `ACTIVE` ou um papel/vínculo alterado depois de a página ter sido carregada, **When** ocorre a operação seguinte, **Then** o estado atual é revalidado e nenhum cache ou estado local preserva autorização anterior.

---

### User Story 3 - Cadastrar uma área como ponto confirmado (Priority: P3)

Como `OWNER` ou `ADMIN` de um laboratório ativo, quero informar o nome de uma área e confirmar sua latitude e longitude por mapa, entrada manual ou localização atual, para criar um registro espacial persistente no laboratório selecionado.

**Why this priority**: Entrega o primeiro registro territorial persistente e estabelece a base necessária para a futura coleta.

**Independent Test**: Em um laboratório ativo, cadastrar áreas separadamente por clique no mapa, somente por coordenadas digitadas e pela localização do dispositivo corrigida antes de salvar; repetir com cada papel, coordenadas-limite, entradas inválidas e falhas de geolocalização.

**Acceptance Scenarios**:

1. **Given** um `OWNER` ou `ADMIN` em laboratório ativo, **When** informa nome válido, escolhe um ponto no mapa, revisa as coordenadas e confirma, **Then** a área é persistida no laboratório com o ponto final e a autoria interna da conta autenticada.
2. **Given** um cadastro sem ponto escolhido no mapa, **When** a pessoa digita latitude e longitude válidas e confirma, **Then** o marcador é posicionado nessas coordenadas e a área pode ser salva.
3. **Given** coordenadas já informadas, **When** a pessoa as altera manualmente, **Then** o marcador é reposicionado para o novo ponto antes da confirmação.
4. **Given** ação explícita para usar a localização do dispositivo e um resultado válido, **When** a localização é obtida, **Then** ela preenche uma proposta de ponto que a pessoa pode revisar e corrigir antes de salvar.
5. **Given** permissão negada, timeout, indisponibilidade ou resultado inválido da localização do dispositivo, **When** a tentativa termina, **Then** valores já preenchidos são preservados e a pessoa pode continuar por mapa ou entrada manual.
6. **Given** um `MEMBER`, um laboratório inativo ou vínculo/papel sem permissão atual, **When** tenta cadastrar uma área, **Then** a criação é negada sem persistência parcial.
7. **Given** latitude fora de `-90` a `90`, longitude fora de `-180` a `180`, valor não numérico/não finito ou nome vazio após normalização, **When** o cadastro é submetido, **Then** a entrada é recusada com orientação compreensível e nenhuma área é criada.

---

### User Story 4 - Reencontrar e consultar a área (Priority: P4)

Como qualquer membro vinculado, quero localizar uma área na listagem do laboratório e abrir seu detalhe com os dados e o marcador correspondentes, para confirmar o registro espacial sem alterar seu conteúdo.

**Why this priority**: Fecha a entrega vertical ao tornar observável e reutilizável a persistência criada na história anterior.

**Independent Test**: Preparar áreas em dois laboratórios, consultar listagem e detalhe com `OWNER`, `ADMIN` e `MEMBER`, comparar os dados ao registro de origem e repetir com laboratório inativo, área inexistente e identificador válido pertencente a outro laboratório.

**Acceptance Scenarios**:

1. **Given** uma área acessível no laboratório selecionado, **When** qualquer membro vinculado abre a listagem, **Then** encontra identificador, nome, coordenadas, município/UF quando informados, indicação espacial e acesso ao detalhe.
2. **Given** uma área acessível, **When** qualquer membro abre seu detalhe, **Then** vê o identificador, os dados previstos, a identificação pública mínima do laboratório e um mapa com exatamente o marcador correspondente ao ponto persistido.
3. **Given** um laboratório inativo, **When** um membro vinculado consulta a listagem ou o detalhe, **Then** os dados permanecem visíveis e o modo somente leitura fica claramente indicado.
4. **Given** uma área inexistente, inacessível ou vinculada a outro laboratório, **When** seu identificador é solicitado dentro do contexto atual, **Then** nenhum dado, autoria ou indício de existência inacessível é revelado.
5. **Given** uma área criada com sucesso, **When** a pessoa retorna à listagem ou recarrega a navegação contextualizada, **Then** reencontra a mesma área a partir do estado persistido.

### Edge Cases

- Latitude e longitude exatamente nos limites válidos são aceitas; qualquer valor além dos limites, vazio, ambíguo ou não finito é recusado.
- Alterar coordenadas após escolher o ponto mantém campos e marcador sincronizados; o ponto persistido é sempre o último confirmado.
- Uma resposta tardia da geolocalização não sobrescreve uma correção feita depois pela pessoa sem nova confirmação explícita.
- Cancelar ou falhar na geolocalização não limpa nome, coordenadas nem dados opcionais já preenchidos e não impede o cadastro manual.
- Submissão repetida enquanto uma criação está em andamento não produz áreas duplicadas pela mesma ação; falha de persistência não deixa ponto ou área órfãos.
- Mudança de conta, vínculo, papel ou estado do laboratório entre a abertura e a confirmação invalida a autorização anterior e aplica o estado mais recente.
- Um laboratório inativo pode ser consultado, mas qualquer tentativa de criar área, gerenciar papéis ou realizar outra mutação de domínio é recusada.
- Remoção do vínculo em outra operação ou feature retira imediatamente listagem e detalhe, mesmo que os dados tenham sido previamente carregados.
- Nome, município, UF, tipo de terreno e descrição que excedam limites definidos no planejamento são recusados sem truncamento silencioso.
- Estados vazio, carregando, erro e sucesso permanecem distinguíveis; uma falha recuperável oferece nova tentativa sem exibir mocks como dados reais.

## Requirements *(mandatory)*

### Functional Requirements

#### Papéis contextuais e invariantes

- **FR-001**: Cada vínculo entre conta e laboratório MUST possuir exatamente um papel contextual entre `OWNER`, `ADMIN` e `MEMBER`.
- **FR-002**: Os papéis contextuais MUST ser independentes dos papéis globais da plataforma e MUST NOT alterar a semântica ou os valores de `UserRole` e `User.isAdmin` nesta feature.
- **FR-003**: Cada laboratório MUST manter exatamente um `OWNER`; o criador de laboratório novo MUST receber esse papel na mesma operação atômica que cria o laboratório e o vínculo.
- **FR-004**: Para vínculos existentes, o criador do laboratório MUST resultar como `OWNER`, todos os demais vínculos MUST resultar como `MEMBER` e nenhum vínculo MUST resultar automaticamente como `ADMIN`.
- **FR-005**: Somente o `OWNER` atual MUST poder promover um `MEMBER` para `ADMIN` ou rebaixar um `ADMIN` para `MEMBER`; `ADMIN` e `MEMBER` MUST NOT gerenciar papéis.
- **FR-006**: O produto MUST impedir transferência, remoção, rebaixamento ou substituição do `OWNER` e MUST NOT incluir convite, ingresso ou remoção de membros nesta feature.
- **FR-007**: A matriz vigente nesta entrega MUST permitir cadastro de área para `OWNER` e `ADMIN`, consulta de áreas para `OWNER`, `ADMIN` e `MEMBER` e gestão de papéis somente para `OWNER`.

#### Contexto, autorização e estado do laboratório

- **FR-008**: O produto MUST exigir que a pessoa escolha explicitamente um laboratório entre os que lhe são acessíveis e MUST NOT selecionar laboratório automaticamente.
- **FR-009**: Após a escolha, a navegação MUST carregar explicitamente o identificador do laboratório e manter o contexto identificável após reload e entre listagem, cadastro e detalhe de área.
- **FR-010**: Antes de cada operação, o servidor MUST revalidar a autenticação, o estado atual `ACTIVE` da conta, o vínculo atual com o laboratório, o papel atual do vínculo, o estado atual do laboratório e a permissão correspondente à ação.
- **FR-011**: Em qualquer operação sobre área, o servidor MUST confirmar que a área pertence ao mesmo laboratório do contexto autorizado.
- **FR-012**: Identificadores de laboratório e área MUST funcionar somente como referências opacas ao recurso solicitado e MUST NOT conceder autorização isoladamente.
- **FR-013**: Laboratório inexistente, laboratório sem vínculo, vínculo revogado, área de outro laboratório e área inacessível MUST produzir comportamento que não permita ao solicitante inferir a existência de recursos aos quais não tem acesso.
- **FR-014**: Um laboratório inativo MUST continuar consultável pelos membros ainda vinculados em modo somente leitura e MUST recusar criação de áreas, gestão de papéis e qualquer outra atualização de domínio.
- **FR-015**: A revogação de vínculo MUST retirar o acesso nas operações seguintes, independentemente de cache ou estado local, sem apagar áreas, coletas futuras ou autoria histórica.

#### Cadastro espacial da área

- **FR-016**: `OWNER` e `ADMIN` com vínculo atual em laboratório ativo MUST poder iniciar e concluir o cadastro de uma área; `MEMBER` MUST NOT poder cadastrá-la.
- **FR-017**: O cadastro MUST exigir nome, latitude e longitude e MUST representar a área exclusivamente por um ponto final confirmado nesta entrega.
- **FR-018**: A pessoa MUST poder selecionar o ponto por clique no mapa, consultar as coordenadas resultantes e corrigi-las manualmente antes de salvar.
- **FR-019**: A pessoa MUST poder cadastrar a área digitando latitude e longitude válidas sem clicar previamente no mapa.
- **FR-020**: O marcador e os campos de coordenadas MUST permanecer sincronizados e refletir o último ponto revisado antes da confirmação.
- **FR-021**: A obtenção da localização atual do dispositivo MUST ocorrer somente após ação explícita, MUST ser opcional e MUST permitir revisão e correção antes de qualquer persistência.
- **FR-022**: Permissão negada, timeout, indisponibilidade ou resultado inválido da localização do dispositivo MUST preservar valores preenchidos, apresentar resultado compreensível e manter mapa e entrada manual disponíveis como fallback.
- **FR-023**: O produto MUST NOT armazenar histórico, tentativas ou posições intermediárias de geolocalização e MUST persistir somente o ponto final confirmado.
- **FR-024**: Latitude MUST ser numérica, finita e estar entre `-90` e `90`; longitude MUST ser numérica, finita e estar entre `-180` e `180`.
- **FR-025**: O nome MUST conter conteúdo após normalização; limites adicionais de tamanho e formato definidos no planejamento MUST produzir recusa controlada, sem truncamento silencioso.
- **FR-026**: O laboratório da área MUST ser derivado do contexto autorizado, o criador MUST ser derivado exclusivamente do principal autenticado e a data de criação MUST ser gerada pelo servidor; nenhum desses valores pode ser confiado ao corpo enviado pelo cliente.
- **FR-027**: A criação MUST persistir área, ponto, laboratório, autoria e data de forma íntegra, sem deixar estado parcial quando qualquer parte falhar.
- **FR-028**: Município, estado/UF, tipo de terreno e descrição/observações MUST ser opcionais; imagem MUST permanecer fora desta entrega, e CEP MUST NOT integrar o contrato mínimo.
- **FR-029**: Um default técnico preexistente para estado funcional da área MUST NOT criar comportamento, filtro, transição ou permissão adicional nesta entrega.

#### Listagem, detalhe e privacidade

- **FR-030**: `OWNER`, `ADMIN` e `MEMBER` com vínculo atual MUST poder consultar as áreas do laboratório selecionado, inclusive quando o laboratório estiver inativo.
- **FR-031**: A listagem MUST apresentar identificador estável, nome, latitude, longitude, município e UF quando informados, indicação espacial correspondente como coordenadas textuais — sem mapa agregado —, acesso ao detalhe e indicação de somente leitura quando aplicável.
- **FR-032**: O detalhe MUST apresentar identificador estável, nome, latitude, longitude, mapa com um marcador no ponto persistido, município e UF quando informados, tipo de terreno quando informado, descrição quando informada, data de cadastro, identificação pública mínima do laboratório e indicação de somente leitura.
- **FR-033**: A área criada MUST reaparecer na listagem e no detalhe a partir do estado persistido, inclusive após reload.
- **FR-034**: A autoria da área MUST ser preservada internamente a partir do principal autenticado, mas o nome e o identificador do criador MUST NOT ser expostos na listagem, no detalhe nem em outros contratos públicos desta entrega.
- **FR-035**: A feature MUST preservar o DTO público de autenticação fechado em `{ firstName, lastName, image }` e MUST NOT ampliar o contrato público para obter autoria.
- **FR-036**: Listagem, cadastro, detalhe e gestão de papéis MUST apresentar estados de carregamento, vazio, sucesso, erro e somente leitura quando aplicáveis, com feedback compreensível e nova tentativa segura para falhas recuperáveis.
- **FR-037**: Controles, mensagens, mapa, marcador e entrada de coordenadas MUST ser utilizáveis por teclado quando a ação tiver equivalente não apontador, possuir rótulos e foco perceptíveis e permanecer funcionais em telas móveis e amplas.
- **FR-038**: A introdução dos papéis contextuais MUST preservar os contratos e invariantes da IMP-002 para criação atômica, limite de laboratórios acessíveis, consulta por vínculo, dados públicos, desativação e exclusão administrativa; o único refinamento deste recorte é o papel contextual atribuído ao vínculo e suas permissões aqui definidas.

### Permission Matrix

| Papel | Criar área nesta entrega | Consultar áreas nesta entrega | Registrar coleta futuramente | Excluir área futuramente | Gerenciar papéis nesta entrega |
|---|---:|---:|---:|---:|---:|
| `OWNER` | Sim | Sim | Sim | Sim | Sim |
| `ADMIN` | Sim | Sim | Sim | Sim | Não |
| `MEMBER` | Não | Sim | Sim | Não | Não |

As colunas futuras preservam a fronteira autorizativa para entregas posteriores, mas não autorizam implementar coleta ou exclusão de área na IMP-003.

### Key Entities

- **Laboratório**: contexto colaborativo já persistido pela IMP-002, com identificador, nome, estado ativo/inativo, exatamente um proprietário e conjunto de vínculos.
- **Vínculo com laboratório**: associação atual entre conta e laboratório, portadora de um único papel contextual `OWNER`, `ADMIN` ou `MEMBER`; sua existência e seu papel são revalidados por operação.
- **Área**: registro persistente pertencente a exatamente um laboratório, com identificador estável, nome, ponto confirmado, criador interno e data de criação; pode ter município, UF, tipo de terreno e descrição.
- **Ponto confirmado**: representação espacial única da área nesta entrega, composta por latitude e longitude válidas e correspondente ao marcador exibido.
- **Principal autenticado**: identidade interna revalidada da conta `ACTIVE`, usada para derivar autoria e autorização sem ampliar o DTO público.

## Dependencies, Risks, and Boundaries

### Dependencies

- A IMP-001 fornece sessão autenticada e revalidação da conta `ACTIVE`; seu DTO público fechado deve ser preservado.
- A IMP-002 fornece laboratório persistido, vínculo inicial atômico, listagem de laboratórios acessíveis, estado ativo/inativo e isolamento básico por vínculo.
- A implementação futura deverá tratar a atribuição de papéis aos vínculos existentes sem converter membros em administradores e sem violar a unicidade do proprietário; migration e backfill pertencem ao planejamento.
- A remoção de membro não integra esta feature, mas um vínculo revogado por qualquer mecanismo autorizado deve produzir imediatamente o comportamento de acesso definido aqui.

### Product and Security Boundaries

- A navegação preferencial pode seguir `/dashboard/laboratories/<laboratoryId>/areas` e `/dashboard/laboratories/<laboratoryId>/areas/<areaId>`, mas o desenho definitivo pertence ao planejamento; o requisito é que o contexto esteja explícito e preservado.
- Precisão, escala, tipo numérico, armazenamento, biblioteca, provedor cartográfico, fonte de mapa, contratos técnicos e desenho definitivo do modelo de dados pertencem ao planejamento.
- OpenStreetMap, Plotly e Leaflet permanecem, respectivamente, alternativa em avaliação, alternativa em avaliação e proposta; nenhuma é escolhida por esta especificação.
- CEP só poderá ser considerado opcional no planejamento mediante justificativa explícita e nunca poderá se tornar obrigatório nem integrar o contrato mínimo desta feature.
- A consulta de laboratório inativo em modo somente leitura não altera nem substitui a exclusão administrativa integrada pela IMP-002.

### Out of Scope

- Exclusão ou edição geral de área.
- Transferência de propriedade do laboratório; convite, ingresso ou remoção de membros.
- Cadastro de coleta, dados ambientais, diagnóstico IHFR, dashboard ou histórico analítico.
- Mapa territorial agregado; múltiplas áreas no mesmo ambiente cartográfico; filtros, camadas, agrupamentos, agregações, gráficos ou resultados.
- Polígonos, linhas e desenho ou edição avançada de geometria.
- Exibição do criador ou de seu identificador e criação de DTO público de autoria.
- Reativação de laboratório.
- Alteração de `UserRole`, `User.isAdmin` ou ampliação de `/api/auth/me`.
- Imagem de área e comportamento funcional de estado da área.
- Tratamento global de vulnerabilidades de dependências e atualizações incidentais de ferramentas ou frameworks.
- Implementação, migration, backfill, schema definitivo e decisões técnicas de cartografia.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em 100% dos cenários de criação de laboratório novo e transição de vínculos existentes, cada laboratório termina com exatamente um `OWNER`, seu criador, e nenhum membro adicional se torna `ADMIN` automaticamente.
- **SC-002**: Em 100% dos testes da matriz de papéis, somente `OWNER` gerencia papéis, `OWNER` e `ADMIN` cadastram áreas em laboratório ativo e os três papéis consultam áreas.
- **SC-003**: Em 100% dos acessos sem escolha prévia, nenhum laboratório é selecionado automaticamente; após uma escolha válida, o mesmo contexto permanece identificável na listagem, no cadastro e no detalhe após navegação e reload.
- **SC-004**: Em 100% dos cenários negativos com conta inelegível, vínculo ausente/revogado, papel insuficiente, laboratório inacessível ou área de outro laboratório, nenhuma ação ou dado não autorizado é concedido e a resposta não permite inferir a existência do recurso inacessível.
- **SC-005**: Em 100% dos testes com laboratório inativo, os membros vinculados consultam listagem e detalhe em somente leitura, enquanto todas as tentativas de criação ou atualização de domínio são recusadas.
- **SC-006**: Em 100% dos cadastros válidos por clique no mapa, entrada exclusivamente manual ou localização do dispositivo revisada, uma única área persistente reaparece na listagem e seu detalhe mostra o mesmo ponto confirmado.
- **SC-007**: Em 100% dos testes de coordenadas inválidas, nome vazio, geolocalização com erro ou falha de persistência, nenhuma área parcial é criada; valores previamente informados permanecem disponíveis quando a falha for apenas da geolocalização.
- **SC-008**: Em 100% das inspeções de listagem, detalhe e contratos públicos da feature, nome e identificador do criador permanecem ausentes, enquanto a autoria interna corresponde à conta autenticada que criou a área.
- **SC-009**: Pelo menos 90% dos participantes representativos conseguem selecionar um laboratório, cadastrar uma área por um dos caminhos disponíveis e reencontrá-la no detalhe em até 4 minutos, sem assistência.
- **SC-010**: Pelo menos 90% dos participantes representativos identificam corretamente o laboratório em uso, o ponto que será salvo e o estado somente leitura quando aplicável, sem depender de explicação técnica.
- **SC-011**: Em validação nos tamanhos de tela suportados, 100% das ações essenciais de seleção, entrada manual, confirmação e consulta possuem alternativa operável sem geolocalização do dispositivo e sem interação exclusivamente por clique no mapa.

### Estado das validações humanas

- **SC-009 — `NAO_VERIFICADO`**: requer validação futura com participantes ou representantes do público-alvo; não pode ser inferido por testes automatizados.
- **SC-010 — `NAO_VERIFICADO`**: requer validação humana futura de compreensão de contexto, ponto e somente leitura.
- O estado `NAO_VERIFICADO` registra a natureza futura da evidência e não transforma a meta em critério humano impossível de automatizar durante o desenvolvimento técnico.

## Assumptions

- A pessoa chega à IMP-003 por uma sessão válida da IMP-001 e por laboratórios acessíveis fornecidos pela IMP-002; criação e ingresso em laboratório não são repetidos aqui.
- Município, UF, tipo de terreno e descrição podem permanecer em branco sem impedir o cadastro; quando informados, são apresentados sem criar busca, geocodificação ou validação territorial automática.
- A identificação pública mínima do laboratório no detalhe da área é suficiente para distinguir o contexto sem expor vínculos, códigos de acesso ou identificadores de pessoas.
- A lista de áreas representa somente o laboratório explicitamente selecionado; não existe busca ou visão agregada entre laboratórios nesta entrega.
- O modo somente leitura é visível na interface e também imposto na autorização da operação; ocultar um controle não é suficiente.
- A criação intencional de áreas distintas com o mesmo nome não é proibida por esta especificação; identificadores estáveis distinguem os registros.

## Evidence and Code-First Traceability

| Resultado desta feature | Requisitos Code-First | Casos de uso e fluxos | Decisões, gaps e perguntas relacionados | Tratamento nesta spec |
|---|---|---|---|---|
| Papéis contextuais, proprietário único e matriz mínima | `CF-PRD-FR-011`, `CF-PRD-FR-012` | `CF-UC-006`, `CF-UC-007`, `CF-UC-008`; `CF-PFLOW-003`, `CF-PFLOW-004` | `CF-PD-002`, `CF-PD-006`; `CF-GAP-009`, `CF-GAP-010`, `CF-GAP-011`; `CF-Q-008`, `CF-Q-009` | As parcelas necessárias à IMP-003 são resolvidas pela decisão atual; convite, remoção, transferência e administração global permanecem fora do recorte. |
| Seleção explícita e contexto preservado | `CF-PRD-FR-004`, `CF-PRD-FR-011` | `CF-UC-006`; `CF-PFLOW-003` | `CF-PD-002`, `CF-PD-006`; `CF-GAP-008`, `CF-GAP-009`; `CF-Q-007`, `CF-Q-008` | Define escolha sem seleção automática, contexto explícito na navegação e revalidação autoritativa por operação. |
| Cadastro persistente e autoria da área | `CF-PRD-FR-005`, `CF-PRD-FR-011`, `CF-PRD-FR-012`, `CF-PRD-FR-013` | `CF-UC-007`; `CF-PFLOW-004` | `CF-PD-003`, `CF-PD-006`, `CF-PD-007`; `CF-GAP-006`, `CF-GAP-009`, `CF-GAP-014`, `CF-GAP-021`, `CF-GAP-025`; `CF-Q-010`, `CF-Q-012`, `CF-Q-017` | Define dados mínimos, ponto, validações, autoria interna e privacidade; reserva schema, precisão e tecnologia ao planejamento. |
| Listagem e detalhe contextualizados | `CF-PRD-FR-005`, `CF-PRD-FR-011`, `CF-PRD-FR-012`, `CF-PRD-FR-013` | `CF-UC-008`; `CF-PFLOW-004` | `CF-PD-003`, `CF-PD-006`, `CF-PD-007`; `CF-GAP-006`, `CF-GAP-017`, `CF-GAP-018`, `CF-GAP-021`, `CF-GAP-026`; `CF-Q-010`, `CF-Q-012`, `CF-Q-015`, `CF-Q-019` | Confirma o destino de detalhe no recorte, campos visíveis, marcador único, estados de UX e somente leitura. |
| Fronteira IMP-003/IMP-008 e dependência IMP-004 | `CF-PRD-FR-005`, `CF-PRD-FR-013` | `CF-UC-007`, `CF-UC-008`; `CF-PFLOW-004` | `CF-PD-003`, `CF-PD-007`; `CF-GAP-021`, `CF-GAP-022`; `CF-Q-012`, `CF-Q-013`; `TD-008`, `TD-010`, `TD-011`, `TD-014` | Mantém o mapa local de ponto nesta entrega, adia ambiente territorial e não seleciona tecnologia. |

### Baseline Evidence

- `EVIDENCIA_IMPLEMENTACAO` — `origin/development` em `f440282` integra o PR #21/IMP-002, a IMP-001 e o PR #22.
- `EVIDENCIA_IMPLEMENTACAO` — a IMP-001 mantém o DTO público `{ firstName, lastName, image }` e revalida sessão e estado `ACTIVE` nas operações protegidas.
- `EVIDENCIA_IMPLEMENTACAO` — a IMP-002 cria laboratório e vínculo inicial atomicamente, lista laboratórios por vínculo, mantém laboratórios inativos consultáveis e restringe ações destrutivas ao criador.
- `EVIDENCIA_IMPLEMENTACAO` — o baseline contém conceitos de laboratório, vínculo, área, coordenadas e autoria, além de listagem e mapa ainda parciais; isso não aprova o desenho definitivo nem transforma mocks em requisitos.

### Future Dependency: IMP-004

A futura IMP-004 poderá depender de área persistida e identificável, laboratório explicitamente contextualizado, vínculo e papel revalidados, laboratório ativo para mutação, autoria derivada do principal e consulta da área por todos os membros vinculados. Esta seção estabelece fronteiras, mas não implementa coleta.
