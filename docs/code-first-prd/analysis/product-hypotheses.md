# Hipóteses do produto derivadas do código

## Identificação

| Campo | Registro | Classificação |
|---|---|---|
| Iniciativa | `PRD Code-First` | `EVIDENCIA_DE_IMPLEMENTACAO` |
| Natureza | análise Code-First não normativa; não constitui PRD, requisito, decisão aprovada ou especificação | `NAO_BLOQUEANTE_DO_PRD` |
| Estado | `EM_REVISAO` | `EVIDENCIA_DE_IMPLEMENTACAO` |
| Baseline efetivo | branch `docs/code-first-prd`; HEAD `bc512b7d5f26ebd064d09ddd45c25f8f9eba24fa`, igual ao commit autorizado e ancestral de si mesmo | `EVIDENCIA_DE_IMPLEMENTACAO` |
| Estado Git usado | Estado A: HEAD no commit autorizado e alterações preexistentes não commitadas somente em `docs/code-first-prd/README.md`, `docs/code-first-prd/governance/source-policy.md`, `docs/code-first-prd/analysis/current-product-state.md` e `docs/code-first-prd/analysis/gaps-and-open-questions.md` | `EVIDENCIA_DE_IMPLEMENTACAO` |
| Método | inspeção estática e convergente de código rastreado, rotas, páginas, componentes, mocks, placeholders, `prisma/schema.prisma`, configurações, decisões técnicas e dos seis documentos então existentes nesta iniciativa | `EVIDENCIA_DE_IMPLEMENTACAO` |
| Runtime e Figma | runtime, build, lint, testes, banco, migration, deploy e Figma não foram executados nem acessados | `EVIDENCIA_DE_IMPLEMENTACAO` |
| Finalidade | oferecer uma hipótese integrada do produto, um escopo candidato e as decisões humanas mínimas para orientar um futuro `prd-code-first.md` expressamente autorizado | `PROPOSTA_PARA_CONFIRMACAO` |

`EVIDENCIA_DE_IMPLEMENTACAO`: as fontes analíticas locais são [`../README.md`](../README.md), [`../governance/source-policy.md`](../governance/source-policy.md), [`current-product-state.md`](current-product-state.md), [`decision-snapshot.md`](decision-snapshot.md), [`gaps-and-open-questions.md`](gaps-and-open-questions.md) e [`../inventories/repository-inventory.md`](../inventories/repository-inventory.md). As decisões técnicas foram consultadas em [`../../../TECH_DECISIONS.md`](../../../TECH_DECISIONS.md), e a identidade e o propósito geral, em [`../../../PROJECT_CONTEXT.md`](../../../PROJECT_CONTEXT.md).

### Como interpretar as classificações

Cada afirmação material deste documento recebe uma das classificações exigidas pela execução. `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` é uma `INFERENCIA` explicitamente marcada, e `PROPOSTA_PARA_CONFIRMACAO` é uma `RECOMENDACAO` sem autoridade normativa, nos termos da governança global. `EVIDENCIA_DE_IMPLEMENTACAO` descreve somente o estado estático observado e não aprova intenção, domínio ou ciência.

## Hipótese executiva do produto

> `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO`: o HidroFlorestas aparenta ser uma plataforma colaborativa de monitoramento ambiental organizada por laboratórios. Usuários criam ou ingressam em laboratórios, gerenciam áreas monitoradas, registram coletas e dados ambientais, produzem diagnósticos relacionados ao IHFR e acompanham resultados por dashboard, histórico e mapas.

`HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO`: a plataforma aparenta enfrentar a dispersão entre organização das equipes, registros de campo, consolidação de dados ambientais e leitura do diagnóstico hidroflorestal. Visitantes podem conhecer e acessar a plataforma; usuários cadastrados passam por um workspace de laboratórios; participantes do laboratório atuariam sobre áreas, coletas e resultados compartilhados. Essa síntese decorre da convergência entre autenticação conectada, workspace e telas de domínio parciais, schema de dados ambientais/IHFR e nomenclatura recorrente, não de uma landing, um mock ou o schema isoladamente.

> `RELATO_DA_EQUIPE_PENDENTE_DE_FORMALIZACAO`: o conceito de laboratório utiliza como referência organizacional salas semelhantes às do Google Classroom: espaços colaborativos nos quais participantes ingressam e compartilham recursos e atividades. A analogia não determina que o HidroFlorestas copie regras, terminologia ou interface do Google Classroom.

`NAO_ESPECIFICADO`: as regras exatas de criação, entrada, convite, aprovação, papéis, propriedade, participação em múltiplos laboratórios e saída ainda não foram formalizadas.

`EVIDENCIA_DE_IMPLEMENTACAO`: o estágio atual é parcial e prototípico. Cadastro, login, sessão e logout possuem conectividade estática; laboratório, dashboard, áreas e histórico usam estados locais, dados fixos ou ações sem persistência; o mapa é placeholder; dados ambientais e diagnóstico IHFR aparecem no schema, mas não têm API, serviço ou cálculo consumidor localizado. Rastreabilidade: `CF-CAP-002`, `CF-CAP-003`, `CF-CAP-004`, `CF-CAP-005`, `CF-CAP-007`, `CF-CAP-008`, `CF-CAP-009`, `CF-CAP-010`, `CF-CAP-011`, `CF-CAP-014`, `CF-FLOW-001`, `CF-FLOW-002`, `CF-FLOW-003`, `CF-FLOW-004`, `CF-FLOW-005`, `CF-FLOW-006`, `CF-FLOW-007`.

## Proposta de valor inferida

| Dimensão | Hipótese integrada | Evidências principais | Classificação | Elemento ainda aberto |
|---|---|---|---|---|
| Valor aparente para o usuário | Reunir em um só ambiente a organização do trabalho, as áreas monitoradas, os registros de campo e a consulta de resultados ambientais. | workspace em `src/app/(private)/workspace/page.tsx:19-168`; dashboard em `src/app/(private)/dashboard/page.tsx:7-22`; áreas em `src/app/(private)/dashboard/collects/page.tsx:6-24`; `CF-CAP-007`, `CF-CAP-008`, `CF-CAP-009`. | `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` | usuário prioritário, frequência de uso, contexto de campo e resultado mensurável |
| Resultado ambiental/científico pretendido | Transformar dados ambientais associados a uma área e a uma coleta em diagnóstico IHFR rastreável para apoiar acompanhamento e interpretação. | `CollectionArea`, `CollectionData`, `IHFRDiagnosis`, `WaterData`, `SoilData`, `VegetationData` e `TerrainData` em `prisma/schema.prisma:76-198`; `CF-CAP-014`; `CF-GAP-012`. | `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` | validade científica, objetivo decisório do diagnóstico e critérios de sucesso |
| Valor colaborativo do laboratório | Criar um contexto compartilhado para participantes, áreas, coletas e atividades, com um responsável e vínculos de membros. | `LaboratoryRoom` e `ResearchersLinked` em `prisma/schema.prisma:51-74`; interface de criar/entrar/acessar em `src/app/(private)/workspace/page.tsx:46-168`; `CF-FLOW-005`; relato da equipe. | `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` | governança do espaço, propriedade, papéis, convite, múltiplos laboratórios e saída |
| Elementos não especificados | Autoridade formal, métricas quantitativas, regras científicas, modelo detalhado de colaboração e casos de uso de mapas permanecem sem aprovação. | `CF-GAP-001`, `CF-GAP-002`, `CF-GAP-008`, `CF-GAP-009`, `CF-GAP-012`, `CF-GAP-021`; `CF-Q-001`, `CF-Q-002`, `CF-Q-007`, `CF-Q-008`, `CF-Q-011`, `CF-Q-012`. | `NAO_ESPECIFICADO` | depende de `CF-PD-002`, `CF-PD-003`, `CF-PD-005`, `CF-PD-006` e `CF-PD-007`, além das autoridades ainda não designadas |

## Atores e papéis candidatos

| Ator candidato | Evidência | Comportamento atual observado | Hipótese de responsabilidade | Decisão pendente | Classificação |
|---|---|---|---|---|---|
| Visitante | landing, `/login` e `/register`; `CF-CAP-001`, `CF-CAP-002`, `CF-CAP-003` | pode navegar pela landing e iniciar cadastro ou login; alegações comerciais não comprovam capacidades | conhecer a proposta e criar ou acessar uma conta | elegibilidade, dados mínimos, consentimento e papel da landing no MVP (`CF-GAP-005`, `CF-Q-005`) | `EVIDENCIA_DE_IMPLEMENTACAO` |
| Usuário cadastrado | `User` em `prisma/schema.prisma:10-27`; autenticação em `CF-FLOW-001`, `CF-FLOW-002`, `CF-FLOW-003`, `CF-FLOW-004` | pode percorrer estaticamente cadastro, login, restauração de sessão e logout; o runtime não foi exercitado | possuir identidade na plataforma e acessar um workspace de laboratórios | ciclo de conta e efeito de `PENDING`, `ACTIVE`, `INACTIVE` e `BLOCKED` (`CF-GAP-007`, `CF-Q-006`) | `EVIDENCIA_DE_IMPLEMENTACAO` |
| Pesquisador ou participante de laboratório | vínculo `ResearchersLinked` em `prisma/schema.prisma:68-74`; histórico mockado com autoria; `CF-CAP-007`, `CF-CAP-010` | não há fluxo conectado de adesão, permissão ou atividade; existe apenas relação no schema e interface indicativa | colaborar dentro de um laboratório, consultar áreas e atribuir autoria a coletas/atividades | denominação, elegibilidade, ações permitidas, entrada, aprovação e saída (`CF-GAP-008`, `CF-GAP-010`, `CF-Q-007`, `CF-Q-009`) | `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` |
| Responsável ou criador de laboratório | `LaboratoryRoom.userId` em `prisma/schema.prisma:56-58`; texto “Seja responsável” e card de laboratório em `src/app/(private)/workspace/page.tsx:66-168` | criação alterna estado local; configurações não possuem ação conectada | criar e administrar o contexto do laboratório, seus participantes e recursos compartilhados | se criador é proprietário, moderador ou apenas autor; transferência, desativação e múltiplos responsáveis (`CF-GAP-008`, `CF-GAP-009`, `CF-Q-007`, `CF-Q-008`) | `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` |
| Administrador global | `User.role`, `User.isAdmin`, middleware `requireAdmin` e script local; `CF-CAP-012`, `CF-CAP-017`, `CF-FLOW-008` | existe infraestrutura parcial, sem API ou interface administrativa consumidora | exercer governança transversal de contas ou plataforma, separada da gestão de um laboratório | casos de uso, autoridade, relação entre `role` e `isAdmin` e presença no MVP (`CF-GAP-010`, `CF-GAP-011`, `CF-Q-009`) | `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` |
| `DEVELOPER` e `MODERATOR` | enum `UserRole` em `prisma/schema.prisma:29-34` | nenhum consumidor ou comportamento foi localizado | nenhuma responsabilidade pode ser inferida com segurança além de possíveis papéis futuros | manter, redefinir ou remover os papéis; escopo global ou por laboratório (`CF-GAP-010`, `CF-Q-009`) | `NAO_ESPECIFICADO` |

## Modelo conceitual candidato

`HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO`: o encadeamento conceitual candidato é laboratório → áreas monitoradas → coletas → dados ambientais → diagnóstico IHFR, com usuários vinculados ao laboratório e autoria ligada a áreas/coletas. Histórico, dashboard e mapa aparentam ser projeções de consulta sobre esse núcleo, não entidades necessariamente persistidas como estão nas interfaces.

| Conceito | Relação sugerida | Evidência no código/schema | Classificação | Ambiguidades |
|---|---|---|---|---|
| Usuário | cria laboratórios, pode participar de laboratórios e aparece como autor de áreas e coletas | relações de `User` em `prisma/schema.prisma:23-26`; autenticação em `CF-FLOW-001`, `CF-FLOW-002`, `CF-FLOW-003`, `CF-FLOW-004` | `EVIDENCIA_DE_IMPLEMENTACAO` | identidade, autoria, propriedade e permissão não são equivalentes e ainda não foram distinguidas |
| Laboratório | agrega participantes e áreas sob um contexto colaborativo | `LaboratoryRoom` em `prisma/schema.prisma:51-68`; workspace em `src/app/(private)/workspace/page.tsx:46-168`; `CF-CAP-007` | `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` | ciclo de vida, acesso por código, responsável, visibilidade e cardinalidade por usuário |
| Vínculo/membro | associa usuário e laboratório por chave composta | `ResearchersLinked` em `prisma/schema.prisma:70-81` | `EVIDENCIA_DE_IMPLEMENTACAO` | nome “pesquisador” pode não cobrir todos os participantes; faltam papel, status, convite e datas do vínculo |
| Área monitorada | pertence a um laboratório, possui autor, coordenadas, localização, tipo e várias coletas | `CollectionArea` em `prisma/schema.prisma:76-109`; cards mockados em `src/app/(private)/dashboard/collects/collects-grid.tsx:3-32`; `CF-CAP-009` | `EVIDENCIA_DE_IMPLEMENTACAO` | propriedade, edição, desativação, precisão geográfica, anexos e significado dos estados |
| Coleta | pertence a uma área e tem um usuário autor; reúne observação, dados ambientais e diagnósticos | `CollectionData` em `prisma/schema.prisma:110-126`; ações e histórico em `CF-FLOW-006`, `CF-FLOW-007` | `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` | conceito é chamado de “dados de coleta” no schema; faltam data de campo, estados, revisão e regras de edição |
| Dados ambientais | detalham uma coleta por famílias de água, solo, vegetação e terreno | `WaterData`, `SoilData`, `VegetationData` e `TerrainData` em `prisma/schema.prisma:151-198`; `CF-CAP-014` | `EVIDENCIA_DE_IMPLEMENTACAO` | campos, unidades, cardinalidades, obrigatoriedade e validade científica não estão aprovados |
| Diagnóstico IHFR | deriva de uma coleta e armazena resultado global, resultados dimensionais, classe, qualidade e versão | `IHFRDiagnosis` em `prisma/schema.prisma:128-142`; `CF-CAP-014` | `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` | fórmula, limiares, momento de geração, multiplicidade, versionamento e autoridade científica |
| Histórico | projeta ações de usuários e oferece busca, filtro, paginação e navegação para a área | mock `MOCK_LOGS` em `src/app/(private)/dashboard/activity-history.tsx:25-110`; `CF-CAP-010`, `CF-FLOW-007` | `EVIDENCIA_DE_IMPLEMENTACAO` | não existe entidade ou serviço de histórico; eventos, retenção, privacidade e auditabilidade não estão definidos |
| Mapa/visualização | projeta áreas/coletas por coordenadas e possivelmente resultados ou risco | `Coordinates` em `prisma/schema.prisma:43-49`; placeholder em `src/app/(private)/dashboard/maps.tsx:18-46`; `CF-CAP-011` | `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` | camadas, simbologia, fonte, precisão, privacidade, filtros e tecnologia cartográfica |

`RELATO_DA_EQUIPE_PENDENTE_DE_FORMALIZACAO`: laboratório semelhante a sala do Google Classroom é apenas analogia organizacional para um espaço colaborativo de ingresso e compartilhamento. Ela não aprova o modelo conceitual, as regras ou a interface de outro produto.

## Jornada principal candidata

| Etapa | Estado observado | Evidência e rastreabilidade | Leitura candidata | Decisão humana necessária | Classificação |
|---|---|---|---|---|---|
| 1. Cadastro ou login | implementada estaticamente | `CF-CAP-002`, `CF-CAP-003`, `CF-CAP-004`, `CF-CAP-005`, `CF-CAP-015`, `CF-CAP-016`; `CF-FLOW-001`, `CF-FLOW-002`, `CF-FLOW-003`, `CF-FLOW-004`; `/register`, `/login` e APIs em `src/app/api/auth/` | criar/restaurar identidade e seguir ao workspace | elegibilidade, ciclo de conta, dados e mensagens (`CF-Q-005`, `CF-Q-006`) | `EVIDENCIA_DE_IMPLEMENTACAO` |
| 2. Criação ou entrada em laboratório | mockada/parcial | botões e textos em `src/app/(private)/workspace/page.tsx:46-86`; relações e `accessCode` em `prisma/schema.prisma:51-74`; `CF-CAP-007`, `CF-GAP-008` | obter um contexto colaborativo novo ou ingressar em um existente | criação, convite/código, aprovação, saída e responsável (`CF-Q-007`) | `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` |
| 3. Seleção do laboratório | parcial, controlada por estado local | alternância `temLab`, card fixo e link para `/dashboard` em `src/app/(private)/workspace/page.tsx:19-168`; `CF-FLOW-005` | escolher o laboratório que contextualiza a navegação e os dados | um ou vários laboratórios, laboratório ativo e troca de contexto (`CF-Q-007`, `CF-Q-008`) | `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` |
| 4. Acesso ao dashboard | parcial | agregação de cabeçalho, mapa placeholder e histórico mockado em `src/app/(private)/dashboard/page.tsx:7-22`; `CF-CAP-008` | obter visão do laboratório, atividades, áreas e resultados | conteúdo, métricas, comunicados e relação com o laboratório selecionado (`CF-Q-003`, `CF-Q-010`) | `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` |
| 5. Criação ou seleção de área | lista mockada e ação placeholder | array fixo e cards em `src/app/(private)/dashboard/collects/collects-grid.tsx:3-50`; “Nova Área” usa `alert`; `CollectionArea` no schema; `CF-CAP-009`, `CF-FLOW-006` | definir o local persistente de monitoramento dentro do laboratório | dados mínimos, coordenadas, estados, propriedade, edição e exclusão (`CF-Q-008`, `CF-Q-010`, `CF-Q-015`) | `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` |
| 6. Registro de coleta e dados ambientais | hipótese sem consumidor | botão “Nova Coleta”, histórico mockado e `CollectionData`/famílias ambientais em `prisma/schema.prisma:110-198`; `CF-CAP-014`, `CF-FLOW-006`, `CF-FLOW-007` | registrar uma observação de campo vinculada à área, ao autor e às famílias de dados ambientais | fluxo, estados, validações, unidades, autoria e revisão (`CF-Q-010`, `CF-Q-017`) | `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` |
| 7. Geração ou consulta do diagnóstico IHFR | hipótese sem consumidor | `IHFRDiagnosis` em `prisma/schema.prisma:128-142`; descrição da tela de áreas; ausência de API/cálculo; `CF-CAP-014`, `CF-GAP-012` | produzir ou consultar uma leitura IHFR associada à coleta | papel funcional e contrato científico; regras matemáticas não podem ser inferidas (`CF-Q-011`) | `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` |
| 8. Acompanhamento em histórico, dashboard e mapa | dashboard parcial, histórico mockado e mapa placeholder | `CF-CAP-008`, `CF-CAP-010`, `CF-CAP-011`, `CF-FLOW-007`; `src/app/(private)/dashboard/activity-history.tsx:25-270`; `src/app/(private)/dashboard/maps.tsx:18-46` | acompanhar evolução, autoria, áreas e resultados no contexto do laboratório | quais projeções são núcleo, quais casos de uso cartográficos existem e quais destinos de navegação permanecem (`CF-Q-010`, `CF-Q-012`, `CF-Q-015`) | `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` |

`PROPOSTA_PARA_CONFIRMACAO`: preservar todas as oito etapas no mapa de jornada, mesmo quando incompletas, evita que ausência de consumidor seja confundida com ausência de intenção. A ordem e o conteúdo permanecem candidatos, não requisitos.

## Capacidades candidatas do produto

| Grupo | Capacidades candidatas | Rastreabilidade | Leitura | Classificação |
|---|---|---|---|---|
| Núcleo provável do produto | identidade/sessão; criação ou entrada em laboratório; seleção do contexto; áreas; coletas; dados ambientais; diagnóstico IHFR; visão resumida e histórico | `CF-CAP-002`, `CF-CAP-003`, `CF-CAP-004`, `CF-CAP-005`, `CF-CAP-006`, `CF-CAP-007`, `CF-CAP-008`, `CF-CAP-009`, `CF-CAP-010`, `CF-CAP-013`, `CF-CAP-014`, `CF-CAP-015`, `CF-CAP-016`; `CF-FLOW-001`, `CF-FLOW-002`, `CF-FLOW-003`, `CF-FLOW-004`, `CF-FLOW-005`, `CF-FLOW-006`, `CF-FLOW-007` | encadeamento mínimo sugerido pela convergência entre UI, schema e fluxos | `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` |
| Suporte necessário ao núcleo | isolamento por laboratório, autoria, papéis mínimos, estados de conta, feedback, acessibilidade e responsividade proporcionais às jornadas incluídas | `CF-CAP-017`, `CF-CAP-018`, `CF-CAP-019`, `CF-CAP-020`; `CF-GAP-007`, `CF-GAP-009`, `CF-GAP-010`, `CF-GAP-018`, `CF-GAP-024`, `CF-GAP-025`, `CF-GAP-026` | comportamentos de suporte precisam ser definidos no nível de produto, sem prescrever correções técnicas | `PROPOSTA_PARA_CONFIRMACAO` |
| Experiência complementar | landing, mapa geral, filtros/paginação do histórico, links institucionais, perfil, comunicados e relatórios gerais | `CF-CAP-001`, `CF-CAP-008`, `CF-CAP-010`, `CF-CAP-011`; `CF-GAP-017`, `CF-Q-014`, `CF-Q-015` | podem melhorar descoberta e acompanhamento, mas sua prioridade não é comprovada pelo código | `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` |
| Alternativa técnica | OpenStreetMap, Python, Plotly, Leaflet, integração Next.js/Python e arquitetura definitiva de mapas | `TD-008`, `TD-009`, `TD-010`, `TD-011`, `TD-012`, `TD-014`; `CF-GAP-022`, `CF-GAP-023`; `CF-Q-013`, `CF-Q-018` | alternativas permanecem abertas e não definem valor, comportamento ou escopo | `NAO_ESPECIFICADO` |
| Hipótese futura | explicação assistida por IA, administração global com interface, visualizações cartográficas avançadas e estratégia futura de hospedagem | `CF-CAP-012`, `CF-CAP-017`, `CF-GAP-013`, `TD-013`; `prisma/schema.prisma:139` | sinais isolados não justificam inclusão automática no MVP | `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` |
| Fora do MVP candidato | IA explicativa, painel administrativo global, perfil completo, links institucionais, comunicados/relatórios avançados e arquitetura cartográfica sofisticada | `CF-CAP-001`, `CF-CAP-012`, `CF-GAP-013`, `CF-GAP-017`, `CF-GAP-022`; `TD-008`, `TD-009`, `TD-010`, `TD-011`, `TD-012`, `TD-014` | exclusão candidata reduz dispersão sem negar possível valor futuro | `PROPOSTA_PARA_CONFIRMACAO` |
| Não especificado | usuários prioritários, métricas, regras de laboratório, propriedade, papéis, estados de domínio, contrato científico e casos de uso de mapas | `CF-GAP-003`, `CF-GAP-008`, `CF-GAP-009`, `CF-GAP-010`, `CF-GAP-012`, `CF-GAP-021`; `CF-Q-003`, `CF-Q-007`, `CF-Q-008`, `CF-Q-009`, `CF-Q-010`, `CF-Q-011`, `CF-Q-012` | depende de resposta humana; o schema não decide esses assuntos | `NAO_ESPECIFICADO` |

## Escopo candidato do MVP

`PROPOSTA_PARA_CONFIRMACAO`: o recorte abaixo busca uma primeira jornada integrada e verificável. Ele não aprova funcionalidade por sua mera presença no schema nem exige que todos os mocks atuais sejam mantidos.

### Núcleo recomendado

| Capacidade candidata | Por que compõe uma jornada mínima | Evidência | Classificação |
|---|---|---|---|
| Conta e sessão básicas | cria a identidade necessária para autoria e acesso ao contexto colaborativo | `CF-CAP-002`, `CF-CAP-003`, `CF-CAP-004`, `CF-CAP-005`, `CF-FLOW-001`, `CF-FLOW-002`, `CF-FLOW-003`, `CF-FLOW-004` | `PROPOSTA_PARA_CONFIRMACAO` |
| Criar ou ingressar em um laboratório e selecionar o contexto ativo | estabelece a unidade colaborativa que organiza usuários e recursos | `CF-CAP-007`, `CF-FLOW-005`, `CF-GAP-008`; `prisma/schema.prisma:51-74` | `PROPOSTA_PARA_CONFIRMACAO` |
| Criar e consultar áreas monitoradas do laboratório | fornece o contexto geográfico e persistente para o acompanhamento | `CF-CAP-009`, `CF-CAP-013`, `CF-FLOW-006`; `prisma/schema.prisma:76-109` | `PROPOSTA_PARA_CONFIRMACAO` |
| Registrar uma coleta e seus grupos gerais de dados ambientais | conecta trabalho de campo, autoria, área e insumos do diagnóstico | `CF-CAP-014`, `CF-FLOW-006`; `prisma/schema.prisma:110-126`, `prisma/schema.prisma:151-198` | `PROPOSTA_PARA_CONFIRMACAO` |
| Gerar ou consultar um diagnóstico IHFR sob contrato científico validado | entrega o resultado científico candidato sem inventar fórmula, pesos ou limiares | `CF-CAP-014`, `CF-GAP-012`, `CF-Q-011`; `prisma/schema.prisma:128-142` | `PROPOSTA_PARA_CONFIRMACAO` |
| Acompanhar resumo do laboratório/área e histórico básico | fecha o ciclo entre registro e consulta ao longo do tempo | `CF-CAP-008`, `CF-CAP-010`, `CF-FLOW-007` | `PROPOSTA_PARA_CONFIRMACAO` |

### Inclusões condicionais

| Capacidade | Condição para entrar no MVP | Rastreabilidade | Classificação |
|---|---|---|---|
| Mapa funcional básico | confirmar que localização espacial é necessária para validar a primeira jornada e definir a privacidade/precisão mínima | `CF-CAP-011`, `CF-GAP-021`, `CF-Q-012` | `PROPOSTA_PARA_CONFIRMACAO` |
| Cálculo automatizado do IHFR | dispor de contrato científico validado e decidir se o MVP calcula ou apenas registra/consulta diagnóstico produzido por processo externo | `CF-CAP-014`, `CF-GAP-012`, `CF-Q-011`; `TD-009`, `TD-012` | `PROPOSTA_PARA_CONFIRMACAO` |
| Múltiplos laboratórios, convite/aprovação e papéis diferenciados | comprovar necessidade para o público prioritário e definir troca de contexto e governança | `CF-GAP-008`, `CF-GAP-010`, `CF-Q-007`, `CF-Q-009` | `PROPOSTA_PARA_CONFIRMACAO` |
| Estados e edição avançada de áreas/coletas | confirmar o ciclo operacional real, inclusive revisão, inativação e exclusão | `CF-GAP-006`, `CF-Q-010`, `CF-Q-017` | `PROPOSTA_PARA_CONFIRMACAO` |

### Provável pós-MVP

| Capacidade | Razão para adiamento candidato | Rastreabilidade | Classificação |
|---|---|---|---|
| Explicação ou assistência por IA | aparece em texto comercial e campo opcional, sem papel de produto ou consumidor confirmado | `CF-GAP-004`, `CF-GAP-013`, `CF-Q-004`; `prisma/schema.prisma:139` | `PROPOSTA_PARA_CONFIRMACAO` |
| Administração global por interface e papéis técnicos | infraestrutura parcial não demonstra caso de uso necessário à primeira jornada | `CF-CAP-012`, `CF-CAP-017`, `CF-GAP-011`, `CF-Q-009` | `PROPOSTA_PARA_CONFIRMACAO` |
| Mapas e visualizações avançadas | casos de uso, camadas e tecnologias permanecem abertos | `CF-GAP-021`, `CF-GAP-022`, `CF-Q-012`, `CF-Q-013`; `TD-008`, `TD-010`, `TD-011`, `TD-014` | `PROPOSTA_PARA_CONFIRMACAO` |
| Perfil, recuperação de acesso, comunicados, relatórios avançados e conteúdo institucional ampliado | não fecham o ciclo mínimo área → coleta → diagnóstico → acompanhamento | `CF-CAP-001`, `CF-CAP-008`, `CF-GAP-017`, `CF-Q-015` | `PROPOSTA_PARA_CONFIRMACAO` |

### Não determinável pelo código

| Assunto | Resposta humana necessária | Rastreabilidade | Classificação |
|---|---|---|---|
| Direção do produto | público prioritário, problema e resultado foram fornecidos para o rascunho em `CF-PD-001`; métricas quantitativas e aprovação formal permanecem abertas | `CF-GAP-003`, `CF-Q-003`, `CF-PD-001` | `DECISAO_DE_TRABALHO_PARA_RASCUNHO` |
| Laboratórios e papéis | criação, convite, entrada, aprovação, saída, propriedade, múltiplos espaços e permissões | `CF-GAP-008`, `CF-GAP-009`, `CF-GAP-010`; `CF-Q-007`, `CF-Q-008`, `CF-Q-009` | `NAO_ESPECIFICADO` |
| Domínio operacional | dados mínimos, estados, autoria, revisão, edição e exclusão de áreas/coletas | `CF-GAP-006`, `CF-Q-010`, `CF-Q-017` | `NAO_ESPECIFICADO` |
| Ciência e resultado | função do IHFR na decisão do usuário e contrato científico aprovado | `CF-GAP-012`, `CF-Q-011` | `NAO_ESPECIFICADO` |
| Geoespacial e IA | papel no MVP, casos de uso, privacidade e limites da explicação assistida | `CF-GAP-004`, `CF-GAP-013`, `CF-GAP-021`; `CF-Q-004`, `CF-Q-012` | `NAO_ESPECIFICADO` |

## IHFR

| Aspecto de produto | Leitura segura | Evidência | Classificação |
|---|---|---|---|
| Papel provável | resultado diagnóstico central que conecta a coleta ambiental ao acompanhamento de uma área | identidade do projeto em `PROJECT_CONTEXT.md:3-10`; `IHFRDiagnosis` e relação com `CollectionData`; `CF-CAP-014` | `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` |
| Entradas gerais sugeridas | grupos de informações de água, solo, vegetação e terreno associados à coleta; os campos atuais são evidência técnica, não variáveis normativas | `prisma/schema.prisma:151-198`; `CF-CAP-014`, `CF-RISK-020` | `EVIDENCIA_DE_IMPLEMENTACAO` |
| Relação com áreas e coletas | área contém coletas; coleta referencia dados ambientais e um ou mais registros de diagnóstico no schema atual | `prisma/schema.prisma:76-142` | `EVIDENCIA_DE_IMPLEMENTACAO` |
| Resultados/visualizações sugeridos | resultado global, resultados por dimensão, classe, qualidade de dados, versão do algoritmo e eventual explicação; dashboard, histórico e mapa podem projetar parte desses resultados | `prisma/schema.prisma:128-142`; `CF-CAP-008`, `CF-CAP-010`, `CF-CAP-011` | `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` |
| Dependência científica | contrato científico deve definir entradas válidas, unidades, validação, fórmula, pesos, agregação, classes, limiares, qualidade e versionamento antes da aprovação de requisitos matemáticos | `CF-GAP-012`, `CF-Q-011`; autoridade científica em `docs/governance/SOURCE_AUTHORITY.md` | `NAO_ESPECIFICADO` |
| Limite desta hipótese | fórmula, pesos, variáveis normativas, limiares, classificações científicas e papel definitivo de Python ou IA não podem ser concluídos pelo schema | `CF-GAP-012`, `CF-GAP-013`, `CF-GAP-023`; `TD-009`, `TD-012` | `NAO_ESPECIFICADO` |

`NAO_BLOQUEANTE_DO_PRD`: a ausência do contrato científico detalhado não impede formular visão, atores e jornada, mas impede aprovar a parte matemática e científica correspondente.

## Mapas, IA e Figma

| Tema | Estado e hipótese | Decisão ainda aberta | Classificação |
|---|---|---|---|
| Mapa como função | há coordenadas no schema, links de localização nos cards e um placeholder de mapa geral; a hipótese funcional é localizar áreas/coletas e talvez representar resultados | casos de uso, camadas, simbologia, precisão, privacidade, filtros, interação e presença no MVP (`CF-GAP-021`, `CF-Q-012`) | `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` |
| Tecnologia cartográfica | OpenStreetMap, Plotly, Leaflet e a arquitetura definitiva têm papéis distintos e não estão implementados nem selecionados | comparação somente após definição dos casos de uso (`TD-008`, `TD-010`, `TD-011`, `TD-014`; `CF-Q-013`) | `NAO_ESPECIFICADO` |
| IA | existe alegação na landing e `explanationAI` opcional no schema, sem serviço consumidor; IA não está confirmada como cálculo, explicação, recomendação ou capacidade do MVP | manter fora do núcleo até produto e ciência definirem valor e limites (`CF-GAP-013`, `CF-Q-004`) | `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` |
| Figma | nenhum artefato foi acessado; se fornecido, pode complementar a intenção de UX, mas sua ausência não impede esta análise nem o início de um rascunho autorizado | produto/UX decidem se haverá artefato e seu estado (`CF-GAP-016`, `CF-Q-014`) | `NAO_BLOQUEANTE_DO_PRD` |

## Decisões técnicas de trabalho

`DECISAO_DE_TRABALHO_PARA_RASCUNHO`: as escolhas abaixo estruturam somente o rascunho analítico. Elas não são requisitos de valor, não provam runtime ou operação e não alteram os estados canônicos de [`../../../TECH_DECISIONS.md`](../../../TECH_DECISIONS.md).

| Referência | Decisão usada no rascunho | Consequência relevante para o produto/PRD | Classificação |
|---|---|---|---|
| `TD-001` | Next.js como framework full-stack | permite tratar interface e APIs atuais como uma aplicação integrada, sem fixar toda a arquitetura futura | `DECISAO_DE_TRABALHO_PARA_RASCUNHO` |
| `TD-002` | PostgreSQL | sustenta a hipótese de persistência relacional para identidade e domínio, sem aprovar o schema como modelo final | `DECISAO_DE_TRABALHO_PARA_RASCUNHO` |
| `TD-003` | Neon no contexto atual de desenvolvimento | oferece direção de ambiente para o rascunho técnico, sem prometer plano, conta, disponibilidade ou produção | `DECISAO_DE_TRABALHO_PARA_RASCUNHO` |
| `TD-004` | Prisma ORM | permite referenciar o schema como evidência de implementação, nunca como requisito ou domínio aprovado | `DECISAO_DE_TRABALHO_PARA_RASCUNHO` |
| `TD-005` | Tailwind CSS | preserva a direção atual de composição visual, sem converter estilos existentes em UX aprovada | `DECISAO_DE_TRABALHO_PARA_RASCUNHO` |
| `TD-006` | Lucide React | preserva a biblioteca atual de ícones, sem transformá-la em valor de produto ou regra de acessibilidade | `DECISAO_DE_TRABALHO_PARA_RASCUNHO` |
| `TD-007` | Vercel como direção atual de hospedagem | informa a direção corrente sem criar promessa de deploy, ambiente ou estratégia futura | `DECISAO_DE_TRABALHO_PARA_RASCUNHO` |

`NAO_ESPECIFICADO`: OpenStreetMap (`TD-008`), Python para IHFR (`TD-009`), Plotly (`TD-010`), Leaflet (`TD-011`), integração Next.js/Python (`TD-012`) e arquitetura definitiva de mapas (`TD-014`) permanecem alternativas abertas. A estratégia futura de hospedagem (`TD-013`) também permanece aberta e separada da direção atual de Vercel.

## Restrições e riscos secundários

| Categoria | Síntese limitada ao impacto de produto | Tratamento nesta execução | Classificação |
|---|---|---|---|
| Segurança e privacidade | autenticação, proteção de rotas, superadmin, validação e dados aparentes em mocks têm riscos catalogados; somente acesso, papéis, propriedade e privacidade que alterem o comportamento precisam aparecer como decisão de produto | preservar como contexto e não propor correções de código | `NAO_BLOQUEANTE_DO_PRD` |
| Qualidade | faltam validações executadas, testes/gates e critérios completos de erro, acessibilidade e responsividade; isso limita a confiança na implementação, não define o valor do produto | encaminhar critérios de experiência aplicáveis ao futuro PRD e detalhes de tooling à engenharia | `NAO_BLOQUEANTE_DO_PRD` |
| Operação | ambientes, migrations, CI/CD, backup, rollback, deploy e limites de provedores não estão comprovados | adiar decisões operacionais para arquitetura/engenharia, salvo restrição material de custo ou serviço | `NAO_BLOQUEANTE_DO_PRD` |
| Dependências científicas | schema e interfaces não validam fórmula, entradas, classes ou interpretação do IHFR | permitir o rascunho geral, mas impedir aprovação das partes científicas sem autoridade e contrato validados | `NAO_BLOQUEANTE_DO_PRD` |

## Decisões mínimas para o PRD

`DECISAO_DE_TRABALHO_PARA_RASCUNHO`: `CF-PD-001` e `CF-PD-004` receberam respostas na revisão humana da iniciativa em 2026-08-27 e orientam o primeiro rascunho sem promoção para `APROVADO`.

`NAO_ESPECIFICADO`: `CF-PD-002`, `CF-PD-003`, `CF-PD-005`, `CF-PD-006`, `CF-PD-007` e `CF-PD-008` permanecem abertas. As “hipóteses recomendadas” abaixo preservam as propostas derivadas do código que antecederam qualquer resposta. Os identificadores no formato `CF-PD-NNN` representam decisões candidatas, não requisitos nem decisões aprovadas.

| ID | Pergunta | Hipótese recomendada derivada do código | Evidências | Alternativas realmente plausíveis | Impacto no PRD | Quem deve confirmar | Gate | Ordem | Classificação |
|---|---|---|---|---|---|---|---|---:|---|
| `CF-PD-001` | Quais usuários são prioritários, qual problema principal enfrentam e qual resultado valida valor? | Priorizar equipes de pesquisa/extensão e participantes de campo organizados em laboratórios; integrar registros ambientais e diagnóstico IHFR para acompanhar áreas com rastreabilidade. | `CF-CAP-001`, `CF-CAP-007`, `CF-CAP-009`, `CF-CAP-014`; `CF-GAP-003`; `CF-Q-003`; `PROJECT_CONTEXT.md:3-10`; `src/app/page.tsx:121-207` apenas como texto comercial convergente; resposta da revisão humana registrada abaixo. | ferramenta interna para pesquisadores; autosserviço direto para comunidades; ambiente educacional/científico multi-institucional | define visão, segmentos, problema, resultado e métricas | autoridade formal de produto ainda precisa aprovar; métricas quantitativas permanecem abertas | gate de direção atendido para iniciar o rascunho, sem aprovação final | 1 | `DECISAO_DE_TRABALHO_PARA_RASCUNHO` |
| `CF-PD-002` | Como funciona conceitualmente um laboratório: quem cria, como se entra, quais recursos são compartilhados, quantos espaços um usuário pode ter e como ocorre a saída? | Tratar laboratório como sala colaborativa: um responsável cria, participantes ingressam por convite/código e compartilham áreas, coletas e acompanhamento; regras de múltiplos espaços e saída permanecem para confirmação. | relato da equipe; `CF-CAP-007`, `CF-FLOW-005`; `CF-GAP-008`; `CF-Q-007`; `prisma/schema.prisma:51-74`; `src/app/(private)/workspace/page.tsx:46-168`. | espaço fechado criado por pesquisador; grupo atribuído por administrador; laboratório institucional sem propriedade individual | define a unidade central, onboarding colaborativo, navegação e cardinalidades do domínio | produto e dados; segurança para limites de acesso | permite rascunho como hipótese, mas impede aprovação da seção de laboratório | 2 | `PROPOSTA_PARA_CONFIRMACAO` |
| `CF-PD-003` | Qual é a jornada pretendida entre área, coleta, dados ambientais, diagnóstico e acompanhamento? | Laboratório selecionado → área → coleta com dados ambientais → diagnóstico IHFR → resumo/histórico e, condicionalmente, mapa. | `CF-CAP-008`, `CF-CAP-009`, `CF-CAP-010`, `CF-CAP-011`, `CF-CAP-013`, `CF-CAP-014`; `CF-FLOW-006`, `CF-FLOW-007`; `CF-GAP-006`; `CF-Q-010`; `prisma/schema.prisma:76-198`. | captura sem diagnóstico no MVP; diagnóstico importado de processo externo; jornada centrada primeiro em análise, com coleta fora da plataforma | organiza casos de uso, estados de domínio e critérios de sucesso da jornada | produto e dados; ciência para os pontos que alimentam ou exibem IHFR | permite rascunho como hipótese, mas impede aprovação da jornada | 3 | `PROPOSTA_PARA_CONFIRMACAO` |
| `CF-PD-004` | Qual é a fronteira do MVP e quais capacidades ficam explicitamente condicionais ou pós-MVP? | Incluir conta/sessão, laboratório mínimo, áreas, coleta/dados, diagnóstico IHFR sob contrato científico e acompanhamento básico; deixar mapa funcional como condicional e IA/administração/experiências avançadas para depois. | `CF-CAP-002`, `CF-CAP-003`, `CF-CAP-004`, `CF-CAP-005`, `CF-CAP-007`, `CF-CAP-008`, `CF-CAP-009`, `CF-CAP-010`, `CF-CAP-011`, `CF-CAP-012`, `CF-CAP-014`; `CF-GAP-003`, `CF-GAP-004`; `CF-Q-003`, `CF-Q-004`; resposta da revisão humana registrada abaixo. | MVP só de captura; MVP de diagnóstico sem colaboração; protótipo demonstrativo de ponta a ponta sem operação multiusuário | controla prioridade, exclusões, dependências e critérios do primeiro lançamento | autoridade formal de produto ainda precisa aprovar; ciência/UX/arquitetura confirmam suas dependências | gate de fronteira atendido para iniciar o rascunho, sem aprovação final | 4 | `DECISAO_DE_TRABALHO_PARA_RASCUNHO` |
| `CF-PD-005` | Qual papel funcional o IHFR cumpre na jornada e o MVP calcula, importa, registra ou apenas consulta o diagnóstico? | Usar o IHFR como resultado diagnóstico de uma coleta, exibindo síntese e dimensões com versão/qualidade; manter a forma de produção aberta até validação científica e arquitetural. | `CF-CAP-014`; `CF-GAP-012`; `CF-Q-011`; `prisma/schema.prisma:128-198`; `PROJECT_CONTEXT.md:3-10`. | cálculo automático interno; processamento científico externo e importação; registro manual validado; consulta somente | define proposta de valor, entradas/saídas, estados e dependência científica, sem definir fórmula | produto define função; responsáveis científicos validam contrato; arquitetura define execução depois | permite rascunho geral, mas impede aprovação da seção IHFR e de requisitos matemáticos | 5 | `PROPOSTA_PARA_CONFIRMACAO` |
| `CF-PD-006` | Quais papéis existem e quem possui, visualiza, cria, altera ou remove laboratórios, áreas, coletas e diagnósticos? | Separar administrador global de responsável do laboratório e participante; tratar recursos do laboratório como compartilhados sob regras do espaço, preservando autoria individual de áreas/coletas. | `CF-CAP-012`, `CF-CAP-017`; `CF-GAP-009`, `CF-GAP-010`, `CF-GAP-011`; `CF-Q-008`, `CF-Q-009`; `prisma/schema.prisma:10-34`, `prisma/schema.prisma:51-126`. | propriedade individual dos recursos; proprietário único com membros somente leitores; papéis granulares por laboratório; administração exclusivamente operacional | define autorização, tenancy, colaboração, autoria e propriedade de dados | produto e dados; segurança para enforcement e privacidade | permite rascunho como hipótese, mas impede aprovação de papéis, acesso e propriedade | 6 | `PROPOSTA_PARA_CONFIRMACAO` |
| `CF-PD-007` | Mapas e IA entram no MVP; se entrarem, qual função de usuário cada um cumpre? | Considerar mapa básico apenas se localização for necessária à primeira validação; manter IA fora do MVP até haver valor e limites científicos confirmados. | `CF-CAP-011`; `CF-GAP-004`, `CF-GAP-013`, `CF-GAP-021`, `CF-GAP-022`; `CF-Q-004`, `CF-Q-012`, `CF-Q-013`; `prisma/schema.prisma:43-49`, `prisma/schema.prisma:139`; `src/app/(private)/dashboard/maps.tsx:18-46`. | ambos fora; mapa no núcleo e IA fora; ambos condicionais; IA apenas pós-processamento explicativo | altera escopo, UX, dados, ciência, privacidade e arquitetura | produto; ciência para limites de interpretação; UX/dados para mapas; arquitetura depois do caso de uso | permite rascunho com itens marcados, mas impede aprovação das seções incluídas | 7 | `PROPOSTA_PARA_CONFIRMACAO` |
| `CF-PD-008` | O futuro PRD usará algum Figma como evidência complementar de UX ou seguirá com código, hipóteses e validação humana? | Prosseguir sem dependência de Figma; classificar e comparar qualquer artefato que venha a ser fornecido, sem promovê-lo automaticamente a fonte normativa. | `CF-GAP-016`; `CF-Q-014`; política em `docs/code-first-prd/governance/source-policy.md`; nenhum artefato acessado nesta execução. | sem Figma; Figma exploratório posterior; Figma aprovado antes de detalhar determinadas telas | altera o nível de detalhe e a evidência de UX, não a visão ou a possibilidade de iniciar o rascunho | produto e UX | não impede o início; condiciona somente o uso/aprovação da evidência visual correspondente | 8 | `PROPOSTA_PARA_CONFIRMACAO` |

### Respostas confirmadas para o rascunho

#### `CF-PD-001` — direção do produto

- **Pergunta e hipótese anteriores:** preservadas na tabela acima.
- **Usuários operacionais prioritários do primeiro MVP:** equipes de pesquisa e extensão.
- **Problema principal:** dispersão entre organização das equipes, áreas monitoradas, coletas, dados ambientais e diagnóstico IHFR, dificultando rastreabilidade e acompanhamento.
- **Resultado de valor:** permitir que essas equipes executem e acompanhem um ciclo ambiental rastreável, dos registros de campo ao diagnóstico IHFR.
- **Origem:** revisão humana da iniciativa PRD Code-First em 2026-08-27.
- **Limite:** autoridade formal, métricas quantitativas e aprovação final permanecem pendentes.
- **Classificação:** `DECISAO_DE_TRABALHO_PARA_RASCUNHO`.

#### `CF-PD-004` — fronteira do MVP

- **Pergunta e hipótese anteriores:** preservadas na tabela acima.
- **Ciclo ponta a ponta:** laboratório → área monitorada → coleta → dados ambientais → diagnóstico IHFR → acompanhamento básico.
- **Núcleo:** conta e sessão; laboratório mínimo; criação ou entrada no laboratório; seleção do contexto ativo; áreas monitoradas; coletas; dados ambientais; obtenção e consulta de diagnóstico IHFR; resumo e histórico básicos.
- **Inclusão condicional:** mapa funcional.
- **Fora do núcleo:** IA e administração global por interface.
- **Pós-MVP:** experiências avançadas, relatórios avançados e arquitetura cartográfica sofisticada.
- **Dependência preservada:** demonstrar o ciclo até o IHFR não determina que o cálculo seja realizado dentro da aplicação; `CF-PD-005` permanece aberta.
- **Origem:** revisão humana da iniciativa PRD Code-First em 2026-08-27.
- **Limite:** autoridade formal e aprovação final permanecem pendentes.
- **Classificação:** `DECISAO_DE_TRABALHO_PARA_RASCUNHO`.

## Base segura para o rascunho

| Uso futuro | Conteúdo seguro | Classificação |
|---|---|---|
| Pode entrar como decisão de trabalho | direção de produto em `CF-PD-001`; fronteira do MVP em `CF-PD-004`; Next.js, PostgreSQL, Neon no desenvolvimento atual, Prisma, Tailwind CSS, Lucide React e Vercel como direção atual, com os limites registrados em `TD-001`, `TD-002`, `TD-003`, `TD-004`, `TD-005`, `TD-006`, `TD-007` | `DECISAO_DE_TRABALHO_PARA_RASCUNHO` |
| Pode entrar como hipótese marcada | plataforma colaborativa por laboratórios; encadeamento usuário/laboratório/área/coleta/dados/diagnóstico; dashboard, histórico e mapa como formas candidatas de acompanhamento; escopo candidato descrito neste documento | `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` |
| Depende de resposta humana | conceito de laboratório e jornada (`CF-PD-002`, `CF-PD-003`); papel do IHFR, papéis/propriedade, mapas/IA e Figma (`CF-PD-005`, `CF-PD-006`, `CF-PD-007`, `CF-PD-008`) | `NAO_ESPECIFICADO` |
| Pode ser adiado para arquitetura/engenharia | tecnologias de mapas, eventual Python, integração Next.js/Python, desenho técnico de segurança, tooling, CI/CD, migrations, backup, rollback, observabilidade e deploy | `NAO_BLOQUEANTE_DO_PRD` |
| Gates mínimos atendidos para iniciar `prd-code-first.md` | direção confirmada para o rascunho em `CF-PD-001`, fronteira confirmada para o rascunho em `CF-PD-004`, revisão humana desta base e autorização explícita para criar o documento; as demais decisões permanecem visivelmente abertas e bloqueiam a aprovação das seções correspondentes | `DECISAO_DE_TRABALHO_PARA_RASCUNHO` |

`NAO_BLOQUEANTE_DO_PRD`: Figma, correções de vulnerabilidades, lint, testes, CI/CD, migrations e configuração operacional não são pré-condições para compreender o produto ou iniciar um rascunho autorizado. Permanecem necessários em seus tratamentos próprios e não foram convertidos em requisitos.

`DECISAO_DE_TRABALHO_PARA_RASCUNHO`: os dois gates mínimos foram atendidos e o primeiro `prd-code-first.md` foi autorizado em `EM_ELABORACAO`. Permanecem necessárias a revisão humana do rascunho, as respostas às seis decisões abertas e a designação da autoridade formal antes de qualquer aprovação.
