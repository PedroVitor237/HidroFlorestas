# Catálogo de requisitos Code-First

## Identificação e uso

| Campo | Registro | Classificação |
|---|---|---|
| Iniciativa | `PRD Code-First` | `DECISAO_DE_TRABALHO_PARA_RASCUNHO` |
| Estado do documento | `EM_ELABORACAO` | `DECISAO_DE_TRABALHO_PARA_RASCUNHO` |
| Estado dos requisitos | candidatos | `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO` |
| Natureza | especificação baseada no código, no schema e nas decisões de trabalho registradas | `DECISAO_DE_TRABALHO_PARA_RASCUNHO` |
| Aprovação normativa | inexistente | `NAO_ESPECIFICADO` |

O [`../prd-code-first.md`](../prd-code-first.md) permanece o documento central de visão, problema, usuários, escopo, jornada e critérios de sucesso. Este catálogo integra o mesmo pacote documental e mantém a especificação detalhada dos requisitos candidatos.

Nenhum requisito representa automaticamente comportamento já implementado. O campo “Estado da implementação” registra apenas evidência estática observável; implementação parcial não reduz a intenção candidata sustentada pelo código e pelas decisões de trabalho. Nenhuma formulação com “deverá” está `APROVADO`, e decisões futuras poderão completar ou revisar o catálogo sem renumerar silenciosamente seus requisitos.

Não há metas quantitativas inventadas. Água, solo, vegetação e terreno são apenas grupos sugeridos pelo schema atual, não um contrato científico aprovado. OpenStreetMap, Plotly e Leaflet permanecem alternativas abertas em `TD-008`, `TD-010` e `TD-011`; este catálogo não prescreve biblioteca, provedor, arquitetura, camadas, precisão, geometria, simbologia ou interação cartográfica.

## Requisitos funcionais candidatos

### `CF-PRD-FR-001` — Cadastro e login

- **Formulação:** O produto deverá permitir que uma pessoa elegível crie uma conta ou faça login para acessar o workspace.
- **Ator:** participante da equipe.
- **Prioridade no MVP:** núcleo do MVP.
- **Origem:** `CF-PD-001`, `CF-PD-004`.
- **Evidência:** `CF-CAP-002`, `CF-CAP-003`, `CF-CAP-015`, `CF-CAP-016`; `CF-FLOW-001`, `CF-FLOW-002`; `src/app/register/page.tsx:14-49`; `src/app/login/page.tsx:12-37`.
- **Estado da implementação:** `IMPLEMENTADO_VERIFICADO_ESTATICAMENTE`; runtime não validado.
- **Precondições conhecidas:** a pessoa atende à política de elegibilidade e possui os dados exigidos, ambos ainda a definir.
- **Comportamento ou fluxo principal:** informar os dados aceitos; concluir cadastro ou autenticação; alcançar o workspace.
- **Critérios de aceitação provisórios:** com dados aceitos pela política futura, a pessoa conclui um dos caminhos e acessa o workspace; falhas recebem tratamento compreensível segundo critérios ainda abertos.
- **Dependências abertas:** elegibilidade, dados mínimos, estados de conta, validações e mensagens (`CF-Q-005`, `CF-Q-006`).
- **Decisões relacionadas:** `CF-PD-001`, `CF-PD-004`.
- **Classificação:** `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO`.

### `CF-PRD-FR-002` — Sessão autenticada

- **Formulação:** O produto deverá manter e restaurar a sessão necessária para navegar no contexto autenticado e permitir encerrá-la.
- **Ator:** usuário cadastrado.
- **Prioridade no MVP:** núcleo do MVP.
- **Origem:** `CF-PD-004`.
- **Evidência:** `CF-CAP-004`, `CF-CAP-005`, `CF-CAP-006`; `CF-FLOW-003`, `CF-FLOW-004`; `src/contexts/auth.context.tsx:40-75`; `src/contexts/auth.context.tsx:159-171`.
- **Estado da implementação:** `PARCIALMENTE_IMPLEMENTADO`.
- **Precondições conhecidas:** autenticação válida e conta em estado que permita acesso, conforme política ainda aberta.
- **Comportamento ou fluxo principal:** autenticar; restaurar o contexto nas páginas incluídas; navegar; encerrar a sessão quando solicitado.
- **Critérios de aceitação provisórios:** o contexto autenticado é mantido ou restaurado nas jornadas incluídas e o logout encerra o acesso local, sem prescrever controles técnicos neste requisito.
- **Dependências abertas:** política de conta, sessão, expiração e estados de acesso (`CF-Q-006`).
- **Decisões relacionadas:** `CF-PD-004`.
- **Classificação:** `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO`.

### `CF-PRD-FR-003` — Criação ou ingresso em laboratório

- **Formulação:** O produto deverá permitir que uma equipe crie um laboratório mínimo ou ingresse em um laboratório existente.
- **Ator:** responsável ou participante do laboratório.
- **Prioridade no MVP:** núcleo do MVP.
- **Origem:** `CF-PD-004`; hipótese de laboratório derivada do código.
- **Evidência:** `CF-CAP-007`, `CF-FLOW-005`; `prisma/schema.prisma:51-81`; `src/app/(private)/workspace/page.tsx:46-86`.
- **Estado da implementação:** `PARCIALMENTE_IMPLEMENTADO`; interface mockada e relações no schema sem fluxo persistido localizado.
- **Precondições conhecidas:** conta com acesso ao workspace; regras de criação e ingresso ainda abertas.
- **Comportamento ou fluxo principal:** escolher criar ou ingressar; fornecer os dados aplicáveis; passar a visualizar o laboratório disponível.
- **Critérios de aceitação provisórios:** o usuário conclui um dos dois caminhos candidatos e obtém acesso ao laboratório conforme regras futuras, sem fixar convite, código ou aprovação.
- **Dependências abertas:** convite ou código, aprovação, saída, responsável e múltiplos espaços (`CF-PD-002`).
- **Decisões relacionadas:** `CF-PD-002`, `CF-PD-004`.
- **Classificação:** `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO`.

### `CF-PRD-FR-004` — Contexto de laboratório ativo

- **Formulação:** O produto deverá permitir selecionar um laboratório ativo para contextualizar áreas, coletas, diagnósticos, resumo e histórico.
- **Ator:** participante do laboratório.
- **Prioridade no MVP:** núcleo do MVP.
- **Origem:** `CF-PD-004`; hipótese de navegação derivada do código.
- **Evidência:** `CF-CAP-007`, `CF-FLOW-005`; `src/app/(private)/workspace/page.tsx:19-168`.
- **Estado da implementação:** `PARCIALMENTE_IMPLEMENTADO`; contexto atual é representado por estado local e card fixo.
- **Precondições conhecidas:** usuário vinculado a pelo menos um laboratório acessível.
- **Comportamento ou fluxo principal:** consultar laboratórios acessíveis; selecionar um; usar o mesmo contexto nas etapas subsequentes.
- **Critérios de aceitação provisórios:** após a seleção, as telas do ciclo identificam e usam o mesmo laboratório ativo; cardinalidade e troca permanecem abertas.
- **Dependências abertas:** cardinalidade, troca de contexto, vínculos e permissões (`CF-PD-002`, `CF-PD-006`).
- **Decisões relacionadas:** `CF-PD-002`, `CF-PD-004`, `CF-PD-006`.
- **Classificação:** `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO`.

### `CF-PRD-FR-005` — Áreas monitoradas

- **Formulação:** O produto deverá permitir criar e consultar áreas monitoradas vinculadas ao laboratório ativo.
- **Ator:** participante de laboratório autorizado.
- **Prioridade no MVP:** núcleo do MVP.
- **Origem:** `CF-PD-004`; modelo derivado do código.
- **Evidência:** `CF-CAP-009`, `CF-CAP-013`, `CF-FLOW-006`; `prisma/schema.prisma:76-109`; `src/app/(private)/dashboard/collects/page.tsx:6-24`.
- **Estado da implementação:** `PARCIALMENTE_IMPLEMENTADO`; lista mockada, ação placeholder e schema sem consumidor de domínio localizado.
- **Precondições conhecidas:** laboratório ativo e permissão aplicável.
- **Comportamento ou fluxo principal:** iniciar cadastro; informar dados aplicáveis; vincular a área ao laboratório; reencontrar e consultar o registro.
- **Critérios de aceitação provisórios:** uma área criada no contexto ativo pode ser reencontrada e consultada nesse contexto.
- **Dependências abertas:** dados mínimos, estados, edição, remoção e propriedade (`CF-PD-003`, `CF-PD-006`).
- **Decisões relacionadas:** `CF-PD-003`, `CF-PD-004`, `CF-PD-006`.
- **Classificação:** `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO`.

### `CF-PRD-FR-006` — Registro de coleta

- **Formulação:** O produto deverá permitir registrar uma coleta vinculada a uma área monitorada e ao participante que a registrou.
- **Ator:** participante de campo.
- **Prioridade no MVP:** núcleo do MVP.
- **Origem:** `CF-PD-001`, `CF-PD-004`; modelo derivado do código.
- **Evidência:** `CF-CAP-014`, `CF-FLOW-006`; `CollectionData` em `prisma/schema.prisma:110-126`; ação placeholder em `src/app/(private)/dashboard/page.tsx:14-16`.
- **Estado da implementação:** `PARCIALMENTE_IMPLEMENTADO`; estrutura no schema e ação sem fluxo consumidor localizado.
- **Precondições conhecidas:** laboratório ativo, área acessível e participante autorizado.
- **Comportamento ou fluxo principal:** selecionar a área; iniciar a coleta; registrar as informações aplicáveis; preservar área e autor associados.
- **Critérios de aceitação provisórios:** a coleta registrada mantém associação verificável com a área e o autor e pode ser recuperada posteriormente.
- **Dependências abertas:** estados, data de campo, revisão, edição e exclusão (`CF-PD-003`).
- **Decisões relacionadas:** `CF-PD-003`, `CF-PD-004`.
- **Classificação:** `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO`.

### `CF-PRD-FR-007` — Dados ambientais da coleta

- **Formulação:** O produto deverá permitir registrar, para uma coleta, os dados ambientais definidos pelo contrato científico aplicável.
- **Ator:** participante de campo.
- **Prioridade no MVP:** núcleo do MVP.
- **Origem:** `CF-PD-004`; contrato científico a validar; schema somente como evidência de implementação.
- **Evidência:** `CF-CAP-014`; `prisma/schema.prisma:151-198`, que sugere grupos de água, solo, vegetação e terreno sem aprová-los como taxonomia científica.
- **Estado da implementação:** `PARCIALMENTE_IMPLEMENTADO`; estruturas no schema sem consumidor localizado.
- **Precondições conhecidas:** coleta existente e contrato científico aplicável definido para o uso.
- **Comportamento ou fluxo principal:** acessar a coleta; informar os dados exigidos pelo contrato; associá-los à coleta; disponibilizá-los para o ciclo aplicável.
- **Critérios de aceitação provisórios:** a coleta mantém os dados exigidos pelo contrato científico aplicável, sem que este catálogo defina ou aprove grupos, variáveis, unidades ou cardinalidades.
- **Dependências abertas:** contrato, campos normativos, unidades, obrigatoriedade e validações científicas (`CF-PD-003`, `CF-PD-005`, `CF-Q-011`).
- **Decisões relacionadas:** `CF-PD-003`, `CF-PD-004`, `CF-PD-005`.
- **Classificação:** `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO`.

### `CF-PRD-FR-008` — Associação do diagnóstico IHFR

- **Formulação:** O produto deverá permitir associar um diagnóstico IHFR à coleta que lhe deu origem e, por essa relação, à área monitorada.
- **Ator:** participante autorizado ou processo de diagnóstico ainda aberto.
- **Prioridade no MVP:** núcleo do MVP.
- **Origem:** `CF-PD-004`; modelo derivado do código.
- **Evidência:** `CF-CAP-014`; `IHFRDiagnosis` em `prisma/schema.prisma:128-142`.
- **Estado da implementação:** `PARCIALMENTE_IMPLEMENTADO`; estrutura no schema sem consumidor localizado.
- **Precondições conhecidas:** coleta existente; diagnóstico aceito pelo fluxo e pelo contrato científico futuros.
- **Comportamento ou fluxo principal:** obter ou registrar o diagnóstico por mecanismo ainda aberto; associá-lo à coleta; preservar acesso à área por essa relação.
- **Critérios de aceitação provisórios:** um diagnóstico aceito referencia a coleta de origem e permite alcançar a área correspondente, sem prescrever como foi produzido.
- **Dependências abertas:** forma de obtenção e contrato científico (`CF-PD-005`, `CF-Q-011`).
- **Decisões relacionadas:** `CF-PD-004`, `CF-PD-005`.
- **Classificação:** `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO`.

### `CF-PRD-FR-009` — Consulta do resultado IHFR

- **Formulação:** O produto deverá permitir consultar o resultado IHFR associado à coleta, preservando origem e versão científica quando disponíveis.
- **Ator:** participante do laboratório autorizado.
- **Prioridade no MVP:** núcleo do MVP.
- **Origem:** `CF-PD-004`; hipótese de resultado derivada do código.
- **Evidência:** `CF-CAP-014`; `prisma/schema.prisma:128-142`; ausência de consumidor registrada em `CF-GAP-012`.
- **Estado da implementação:** `NAO_LOCALIZADO` como comportamento de consulta; schema parcial existente.
- **Precondições conhecidas:** diagnóstico associado à coleta e acesso autorizado ao contexto.
- **Comportamento ou fluxo principal:** localizar a coleta ou seu resultado; consultar o IHFR; identificar origem e versão disponíveis.
- **Critérios de aceitação provisórios:** a consulta apresenta o resultado associado à coleta e a proveniência e versão disponíveis, sem inferir fórmula, classe ou limiar.
- **Dependências abertas:** conteúdo do resultado, método de obtenção, validação e versionamento científico (`CF-PD-005`).
- **Decisões relacionadas:** `CF-PD-004`, `CF-PD-005`.
- **Classificação:** `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO`.

### `CF-PRD-FR-010` — Resumo e histórico

- **Formulação:** O produto deverá permitir acompanhar o ciclo por um resumo e um histórico básicos no contexto do laboratório.
- **Ator:** participante do laboratório.
- **Prioridade no MVP:** núcleo do MVP.
- **Origem:** `CF-PD-004`; interfaces observadas no código.
- **Evidência:** `CF-CAP-008`, `CF-CAP-010`, `CF-FLOW-007`; `src/app/(private)/dashboard/page.tsx:7-22`; `src/app/(private)/dashboard/activity-history.tsx:25-270`.
- **Estado da implementação:** `PARCIALMENTE_IMPLEMENTADO`; dashboard parcial e histórico mockado.
- **Precondições conhecidas:** laboratório ativo e ao menos um registro do ciclo acessível.
- **Comportamento ou fluxo principal:** acessar resumo ou histórico; localizar o registro; relacioná-lo ao contexto e aos dados que o originaram.
- **Critérios de aceitação provisórios:** um registro concluído pode ser localizado posteriormente no resumo ou histórico e relacionado ao contexto de origem.
- **Dependências abertas:** conteúdo do resumo, eventos, filtros, retenção e destinos (`CF-PD-003`).
- **Decisões relacionadas:** `CF-PD-003`, `CF-PD-004`.
- **Classificação:** `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO`.

### `CF-PRD-FR-011` — Acesso autorizado no laboratório ativo

- **Formulação:** O produto deverá permitir que um participante autorizado acesse os recursos do laboratório ativo compatíveis com seu vínculo e suas permissões.
- **Ator:** participante do laboratório.
- **Prioridade no MVP:** suporte necessário ao núcleo do MVP.
- **Origem:** `CF-PD-004`; hipótese provisória de acesso.
- **Evidência:** `CF-CAP-013`, `CF-CAP-017`; relações em `prisma/schema.prisma:51-142`; `CF-GAP-009`.
- **Estado da implementação:** `PARCIALMENTE_IMPLEMENTADO`; relações no schema sem matriz de acesso validada.
- **Precondições conhecidas:** laboratório ativo, vínculo e permissão aplicáveis.
- **Comportamento ou fluxo principal:** entrar no contexto ativo; consultar ou usar os recursos correspondentes às ações permitidas.
- **Critérios de aceitação provisórios:** o participante autorizado consegue acessar os recursos compatíveis com seu vínculo e permissões; a matriz definitiva permanece aberta.
- **Dependências abertas:** permissões, propriedade, ações e exceções (`CF-PD-006`).
- **Decisões relacionadas:** `CF-PD-004`, `CF-PD-006`.
- **Classificação:** `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO`.

### `CF-PRD-FR-012` — Associação e consulta da autoria

- **Formulação:** O produto deverá associar a autoria aos registros para os quais ela for aplicável e permitir sua consulta nos pontos pertinentes da jornada.
- **Ator:** participante de laboratório ou de campo.
- **Prioridade no MVP:** suporte necessário ao núcleo do MVP.
- **Origem:** `CF-PD-001`; hipótese provisória de autoria.
- **Evidência:** `CF-CAP-010`, `CF-CAP-013`, `CF-CAP-014`; `User.collectionAreas` e `User.collectionData` em `prisma/schema.prisma:23-26`; `CF-FLOW-007`.
- **Estado da implementação:** `PARCIALMENTE_IMPLEMENTADO`; chaves de autoria no schema e apresentação mockada, sem fluxo integral validado.
- **Precondições conhecidas:** registro sujeito a autoria e ator autorizado a criá-lo ou consultá-lo.
- **Comportamento ou fluxo principal:** criar ou consultar o registro; associar ou identificar o autor aplicável no ponto pertinente.
- **Critérios de aceitação provisórios:** a autoria aplicável pode ser associada e consultada sem definir por este requisito edição por terceiros ou propriedade.
- **Dependências abertas:** registros sujeitos a autoria, ações autorais, edição por terceiros, remoção e propriedade (`CF-PD-006`).
- **Decisões relacionadas:** `CF-PD-006`.
- **Classificação:** `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO`.

### `CF-PRD-FR-013` — Cadastro espacial da área

- **Formulação:** O produto deverá permitir cadastrar e representar espacialmente uma área monitorada utilizando o mapa.
- **Ator:** participante de laboratório autorizado.
- **Prioridade no MVP:** núcleo do MVP.
- **Origem:** direção humana confirmada nesta execução; `CF-PD-004`; `CF-PD-007`; mapa e coordenadas observados no código/schema; capacidades, riscos e lacunas Code-First aplicáveis.
- **Evidência:** `CF-CAP-009`, `CF-CAP-011`, `CF-CAP-013`; `CF-RISK-011`; `CF-GAP-021`, `CF-GAP-022`; `CF-Q-012`, `CF-Q-013`; `Coordinates` e `CollectionArea.coordinatesId` em `prisma/schema.prisma:43-49`, `prisma/schema.prisma:76-96`; placeholder em `src/app/(private)/dashboard/maps.tsx:18-46`; link de localização em `src/app/(private)/dashboard/collects/collect-card.tsx:66-72`.
- **Estado da implementação:** `PARCIALMENTE_IMPLEMENTADO`; há coordenadas e vínculo da área no schema, link mockado e placeholder, sem cadastro espacial conectado.
- **Precondições conhecidas:** laboratório ativo, permissão aplicável e início do cadastro de uma área.
- **Comportamento ou fluxo principal:** cadastrar a área; fornecer ou estabelecer sua referência espacial pelo mapa; manter a representação associada ao registro da área.
- **Critérios de aceitação provisórios:** uma área cadastrada pode ser representada no mapa e a representação permanece vinculada ao mesmo registro; ponto, polígono, coordenadas ou combinação não são definidos por este requisito.
- **Dependências abertas:** representação geométrica, dados espaciais mínimos, precisão, privacidade, validação, interação e tecnologia (`CF-PD-003`, `CF-PD-006`, `CF-Q-012`, `CF-Q-013`, `TD-008`, `TD-010`, `TD-011`, `TD-014`).
- **Decisões relacionadas:** `CF-PD-004`, `CF-PD-007`.
- **Classificação:** `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO`.

### `CF-PRD-FR-014` — Associação espacial das coletas

- **Formulação:** O produto deverá permitir associar coletas e seus dados ambientais à área e à referência espacial aplicável.
- **Ator:** participante de campo autorizado.
- **Prioridade no MVP:** núcleo do MVP.
- **Origem:** direção humana confirmada nesta execução; `CF-PD-004`; `CF-PD-007`; mapa, relações e coordenadas observados no código/schema; capacidades, riscos e lacunas Code-First aplicáveis.
- **Evidência:** `CF-CAP-011`, `CF-CAP-013`, `CF-CAP-014`; `CF-RISK-011`, `CF-RISK-020`, `CF-RISK-021`; `CF-GAP-021`, `CF-GAP-022`; `CF-Q-012`, `CF-Q-013`; encadeamento em `prisma/schema.prisma:43-49`, `prisma/schema.prisma:76-96`, `prisma/schema.prisma:110-142`, `prisma/schema.prisma:151-198`.
- **Estado da implementação:** `PARCIALMENTE_IMPLEMENTADO`; o schema liga área a coordenadas e coleta à área e aos dados, mas não há fluxo espacial consumidor localizado.
- **Precondições conhecidas:** laboratório ativo; área com referência espacial aplicável; coleta e dados autorizados para registro ou consulta.
- **Comportamento ou fluxo principal:** partir do laboratório ativo; selecionar a área e sua localização aplicável; registrar ou selecionar a coleta; associar seus dados ambientais, preservando a cadeia `laboratório → área → localização aplicável → coleta → dados ambientais`.
- **Critérios de aceitação provisórios:** a partir da coleta ou de seus dados, é possível identificar a área e a referência espacial aplicável, e o percurso inverso preserva o vínculo com a coleta; não se exige coordenada própria da coleta sem decisão futura.
- **Dependências abertas:** granularidade espacial, eventual localização própria da coleta, precisão, validação, privacidade e contrato dos dados ambientais (`CF-PD-003`, `CF-PD-005`, `CF-PD-006`, `CF-Q-011`, `CF-Q-012`, `CF-Q-013`).
- **Decisões relacionadas:** `CF-PD-003`, `CF-PD-004`, `CF-PD-005`, `CF-PD-006`, `CF-PD-007`.
- **Classificação:** `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO`.

### `CF-PRD-FR-015` — Visualização territorial

- **Formulação:** O produto deverá permitir visualizar no mapa as áreas, coletas, dados, gráficos e resultados IHFR aplicáveis, mantendo vínculo rastreável com os registros que os originaram.
- **Ator:** participante do laboratório autorizado.
- **Prioridade no MVP:** núcleo do MVP.
- **Origem:** direção humana confirmada nesta execução; `CF-PD-004`; `CF-PD-007`; mapa e resultados observados no código/schema; capacidades, riscos e lacunas Code-First aplicáveis.
- **Evidência:** `CF-CAP-008`, `CF-CAP-009`, `CF-CAP-010`, `CF-CAP-011`, `CF-CAP-014`; `CF-RISK-011`, `CF-RISK-020`; `CF-GAP-012`, `CF-GAP-021`, `CF-GAP-022`; `CF-Q-011`, `CF-Q-012`, `CF-Q-013`; `src/app/(private)/dashboard/maps.tsx:18-46`; `prisma/schema.prisma:76-142`.
- **Estado da implementação:** `PARCIALMENTE_IMPLEMENTADO`; existe placeholder com indicação de áreas, mas não há visualização territorial conectada a coletas, dados, gráficos ou resultados IHFR.
- **Precondições conhecidas:** laboratório ativo; registros espaciais e resultados aplicáveis existentes; acesso autorizado.
- **Comportamento ou fluxo principal:** acessar o mapa; visualizar as áreas e projeções aplicáveis de coletas, dados, gráficos ou resultados; navegar ou correlacionar a representação com seus registros de origem.
- **Critérios de aceitação provisórios:** cada elemento territorial apresentado mantém vínculo identificável com a área, coleta, dado, gráfico ou resultado IHFR que o originou; conteúdo aplicável depende dos registros existentes e do contrato científico.
- **Dependências abertas:** conteúdo e forma dos gráficos, camadas, filtros, simbologia, interação, precisão, privacidade, tecnologia e contrato de apresentação do IHFR (`CF-PD-003`, `CF-PD-005`, `CF-PD-006`, `CF-Q-011`, `CF-Q-012`, `CF-Q-013`, `TD-008`, `TD-010`, `TD-011`, `TD-014`).
- **Decisões relacionadas:** `CF-PD-003`, `CF-PD-004`, `CF-PD-005`, `CF-PD-006`, `CF-PD-007`.
- **Classificação:** `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO`.

## Requisitos não funcionais candidatos

### `CF-PRD-NFR-001` — Segregação entre laboratórios

- **Categoria:** segurança e isolamento de contexto.
- **Resultado esperado:** O produto deverá garantir a segregação dos dados entre laboratórios conforme os contextos e vínculos permitidos.
- **Origem e evidência:** `CF-PD-004`, `CF-PD-006`; `CF-CAP-013`, `CF-CAP-017`; `prisma/schema.prisma:51-142`.
- **Alcance:** recursos e operações contextualizados por laboratório durante criação, consulta, alteração e acompanhamento.
- **Estado atual:** relações no schema, sem garantia de segregação validada.
- **Critério provisório de verificação:** operações em um laboratório não expõem, misturam nem alteram dados de outro sem vínculo permitido; exceções dependem da futura matriz de acesso.
- **Dependências abertas:** permissões, vínculos, exceções e isolamento definitivo (`CF-PD-006`).
- **Classificação:** `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO`.

### `CF-PRD-NFR-002` — Integridade da autoria e proveniência

- **Categoria:** integridade e rastreabilidade.
- **Resultado esperado:** O produto deverá preservar a integridade da autoria e da proveniência aplicáveis ao longo de todo o ciclo do registro.
- **Origem e evidência:** `CF-PD-001`, `CF-PD-004`, `CF-PD-006`; `CF-CAP-010`, `CF-CAP-013`, `CF-CAP-014`; `prisma/schema.prisma:23-26`, `prisma/schema.prisma:110-142`.
- **Alcance:** registros sujeitos a autoria, suas alterações, consultas, acompanhamento e diagnósticos derivados.
- **Estado atual:** chaves de autoria e origem no schema e histórico mockado, sem integridade validada.
- **Critério provisório de verificação:** autoria e origem permanecem consistentes e consultáveis ao longo do ciclo, e o diagnóstico preserva sua coleta de origem.
- **Dependências abertas:** papéis, edição por terceiros, eventos e regras de proveniência (`CF-PD-003`, `CF-PD-006`).
- **Classificação:** `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO`.

### `CF-PRD-NFR-003` — Proteção de dados pessoais

- **Categoria:** privacidade e acesso.
- **Resultado esperado:** O produto deverá proteger dados pessoais contra consulta ou exposição por atores não autorizados.
- **Origem e evidência:** `CF-GAP-025`, `CF-Q-017`; contexto de laboratório em `CF-PD-006`.
- **Alcance:** dados pessoais tratados nas jornadas e contextos incluídos no MVP.
- **Estado atual:** comportamento e política não especificados; implementação não validada.
- **Critério provisório de verificação:** dados pessoais são apresentados somente a atores com acesso aplicável ao contexto; política detalhada permanece aberta.
- **Dependências abertas:** política de privacidade, papéis, acesso e autoridades competentes (`CF-PD-006`).
- **Classificação:** `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO`.

### `CF-PRD-NFR-004` — Responsividade do ciclo principal

- **Categoria:** usabilidade e compatibilidade de layout.
- **Resultado esperado:** O ciclo principal deverá ser utilizável em layouts responsivos nos contextos de uso suportados.
- **Origem e evidência:** `CF-CAP-019`; `CF-FLOW-001`, `CF-FLOW-002`, `CF-FLOW-005`, `CF-FLOW-006`, `CF-FLOW-007`; `src/components/sidebar/index.tsx:34-63`.
- **Alcance:** etapas incluídas do ciclo principal, inclusive mapa quando aplicável ao contexto suportado.
- **Estado atual:** responsividade verificada apenas estaticamente e menu mobile parcial; runtime visual não validado.
- **Critério provisório de verificação:** as etapas permanecem navegáveis e compreensíveis nos layouts suportados a definir.
- **Dependências abertas:** contextos, dispositivos e critérios de UX suportados (`CF-Q-019`).
- **Classificação:** `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO`.

### `CF-PRD-NFR-005` — Acessibilidade básica

- **Categoria:** acessibilidade e usabilidade.
- **Resultado esperado:** O ciclo principal deverá oferecer acessibilidade básica para percepção, identificação e operação de seus controles e estados.
- **Origem e evidência:** `CF-CAP-018`, `CF-GAP-018`, `CF-GAP-026`; `src/app/layout.tsx:24-30`; `src/components/header-screen/index.tsx:21-27`.
- **Alcance:** controles, mensagens, estados e representações das etapas incluídas, inclusive alternativas aplicáveis ao conteúdo territorial.
- **Estado atual:** sinais parciais; nenhuma auditoria executada.
- **Critério provisório de verificação:** controles, mensagens e estados possuem identificação e operação compreensíveis segundo critérios ainda a confirmar.
- **Dependências abertas:** critérios detalhados de acessibilidade e UX (`CF-Q-014`, `CF-Q-019`).
- **Classificação:** `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO`.

### `CF-PRD-NFR-006` — Integridade da cadeia diagnóstica

- **Categoria:** integridade científica e rastreabilidade.
- **Resultado esperado:** O produto deverá preservar a integridade da associação entre diagnóstico, coleta e área e registrar versão científica quando disponível.
- **Origem e evidência:** `CF-PD-004`, `CF-PD-005`; `CF-CAP-014`; `prisma/schema.prisma:76-142`.
- **Alcance:** criação, associação, consulta e projeção do diagnóstico, inclusive sua visualização territorial aplicável.
- **Estado atual:** estrutura parcial no schema, sem consumidor ou validação científica.
- **Critério provisório de verificação:** a consulta ou projeção do diagnóstico mantém a cadeia área → coleta → resultado e apresenta a versão disponível sem inferir regra científica.
- **Dependências abertas:** contrato, proveniência, método e versionamento (`CF-PD-005`, `CF-Q-011`).
- **Classificação:** `REQUISITO_CANDIDATO_DERIVADO_DO_CODIGO`.

## Distribuição e ponto de parada

| Tipo | Intervalo | Quantidade |
|---|---|---:|
| Requisitos funcionais | `CF-PRD-FR-001` a `CF-PRD-FR-015` | 15 |
| Requisitos não funcionais | `CF-PRD-NFR-001` a `CF-PRD-NFR-006` | 6 |
| **Total** | — | **21** |

Este catálogo permanece `EM_ELABORACAO`. As decisões de produto abertas são `CF-PD-002`, `CF-PD-003`, `CF-PD-005` e `CF-PD-006`. `CF-PD-007` registra a direção funcional confirmada do mapa, mas não encerra as decisões técnicas ou de UX sobre representação, dados espaciais, camadas, precisão, interação ou tecnologia. `CF-PD-008` permanece decisão de trabalho complementar e não bloqueante sobre Figma.
