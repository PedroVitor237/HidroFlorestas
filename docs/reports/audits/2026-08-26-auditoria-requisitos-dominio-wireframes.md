# Auditoria de requisitos, domínio implícito e wireframes históricos do MVP

## Identificação, estado e limites

- **Identificador:** `DOC-011`
- **Título:** Auditoria documental de requisitos, domínio implícito e wireframes históricos do MVP HidroFlorestas
- **Estado documental:** `CANONICO_ATUAL`, exclusivamente como relatório analítico aprovado
- **Data:** 2026-08-26
- **Fontes primárias:** `DOC-RAW-004` e `DOC-RAW-014`
- **Plano relacionado:** [`DOC-PLAN-005`](../../plans/completed/auditoria-requisitos-dominio-wireframes.md)
- **Responsável pela execução:** agente mantenedor
- **Autoridade de produto:** não especificado; `PD-003` permanece aberta
- **Autoridade de UX:** não especificado; `PD-005` permanece aberta
- **Autoridade de dados:** não especificado; `PD-004` permanece aberta
- **Natureza:** relatório analítico de auditoria documental interna
- **Autoridade normativa:** nenhuma sobre produto, requisitos, domínio, UX, dados ou ciência

Este relatório descreve o conteúdo histórico das duas fontes e suas relações internas. Não aprova requisito, papel, permissão, regra, fluxo ou tela; não define modelo normativo de domínio; não compara com código ou implementação; não audita Figma; não atualiza documentação normativa; não resolve pendências; e não inicia a Etapa 7.

**Aprovação analítica:** a solicitação aprovada da Etapa 7 registra a aprovação humana desta análise, incluindo a correção de `PROD-REQ-055`. A promoção a `CANONICO_ATUAL` é exclusiva para este relatório analítico: não aprova requisitos nem wireframes, não define o modelo de domínio, não valida implementação e não resolve decisões de produto, UX ou dados.

Declarações localizadas são `FATO_DOCUMENTADO` sobre o que a fonte registra, não sobre vigência atual. Relações deduzidas são `INFERENCIA`; alternativas históricas sem aprovação são `PROPOSTA`; ausências são `NAO_ESPECIFICADO`; orientações desta auditoria são `RECOMENDACAO`. As duas fontes permanecem `HISTORICO_IMUTAVEL`.

## Método e alcance da leitura

`DOC-RAW-004` e `DOC-RAW-014` foram lidos integralmente com numeração de linhas, respectivamente 291 e 345 linhas físicas, totalizando 636. Foram percorridos títulos, parágrafos, listas, diagramas textuais, tabelas, campos, controles, exemplos e critérios de aceitação. Nenhum outro arquivo de `docs/raw/` foi reaberto em profundidade.

Os IDs deste relatório são exclusivamente analíticos. Listas e elementos de interface só foram convertidos em candidatos quando seu comportamento documental pôde ser localizado; a origem foi distinguida como requisito formulado, comportamento, expectativa de tela, proposta, exemplo, instrução ou inferência. Nenhuma recorrência foi usada como prova de aprovação.

Localizadores abreviados usam `004:Lx-Ly` para `DOC-RAW-004` e `014:Lx-Ly` para `DOC-RAW-014`.

## Identificação das fontes

| Campo | `DOC-RAW-004` | `DOC-RAW-014` |
|---|---|---|
| Identificador | `DOC-RAW-004` | `DOC-RAW-014` |
| Título interno | “DEFINIÇÃO DOS REQUISITOS DA PLATAFORMA HIDROFLORESTAS” (`004:L1`) | “WIREFRAMES FUNCIONAIS DO MVP DA PLATAFORMA HIDROFLORESTAS” (`014:L1`) |
| Caminho | `docs/raw/definicao-dos-requisitos-da-plataforma-hidroflorestas.md` | `docs/raw/wireframes-funcionais-mvp-plataforma-hidroflorestas.md` |
| Versão declarada | não especificado; há propostas para IHFR v0.1/v0.2, não versão documental (`004:L251-L268`) | não especificado |
| Data | não especificado | não especificado |
| Responsável | não especificado | não especificado |
| Objetivo declarado | Não há objetivo global único. A fonte declara finalidades de dashboard, mapa, módulos, MVP, perfis, jornadas, entidades, contrato do IHFR, aceite e requisitos não funcionais. | Descrever estrutura de telas, organização, entradas, resultados e navegação para orientar o desenvolvimento da interface (`014:L3-L10`). |
| Público | não especificado | não especificado; orientar desenvolvimento indica público técnico apenas por `INFERENCIA` |
| Escopo | Plataforma/MVP: dashboard, mapa, cadastro, coleta, cálculo, resultado, recomendações, papéis, dados e requisitos não funcionais (`004:L3-L291`). | Cinco telas do MVP, componentes, campos, ações, mapa e critérios (`014:L12-L345`). |
| Estado de aprovação | não especificado; “projeto aprovado” em `004:L198` e `004:L289` não aprova individualmente os requisitos desta fonte | não especificado |
| Proveniência | não especificado; preservada como evidência histórica pelo registro | não especificado; preservada como evidência histórica pelo registro |
| Estrutura | Perguntas e respostas, listas de recomendação, módulos, diagrama, escopo MVP/futuro, papéis, jornadas, entidades, contrato matemático, aceite e NFR. | Visão de fluxo, cinco telas em diagramas textuais, mapa, cores e quatro blocos de critérios. |
| Limitações | Mistura “deve”, “recomendado”, “possível”, “futuro”, exemplo e instruções; aceite detalhado apenas para dashboard; erros, segurança e ciclos de vida quase ausentes. | Não registra aprovação, atores por tela, estados vazios/carregamento/erros/confirmação, responsividade, acessibilidade ou regras de autorização. |
| Localizadores principais | `004:L3-L50`, `L52-L106`, `L108-L218`, `L219-L268`, `L270-L291` | `014:L3-L26`, `L28-L278`, `L280-L307`, `L309-L345` |

Nenhuma relação de substituição, cronologia ou precedência entre as fontes está declarada. `INFERENCIA` — A cobertura temática permite compará-las, mas não prova que uma deriva, implementa ou atualiza a outra.

## Inventário de requisitos e enunciados candidatos

### Convenções

- **Origem:** `REQUISITO_FORMULADO`, `COMPORTAMENTO_DESCRITO`, `EXPECTATIVA_DE_TELA`, `PROPOSTA`, `EXEMPLO`, `INSTRUCAO` ou `INFERENCIA_DA_AUDITORIA`.
- **Aprovação:** todos os 60 candidatos estão `NAO_ESPECIFICADO`; a coluna registra isso de forma abreviada como `NE`.
- Campos não presentes são registrados como `não especificado`, sem completar por convenção de produto ou UX.

### Identidade, semântica e proveniência

| ID | Enunciado histórico fiel e origem | Fonte/localizador | Tipo | Ator | Objeto, ação e resultado | Condição | Prioridade/fase | Classificação; aprovação | Ambiguidade ou lacuna principal |
|---|---|---|---|---|---|---|---|---|---|
| `PROD-REQ-001` | Possuir dashboard técnico inicial como painel territorial (`REQUISITO_FORMULADO`). | 004:L3-L5 | `FUNCIONAL` | plataforma/sistema | disponibilizar dashboard | acesso inicial | “precisa/deve”; fase não especificada | `FATO_DOCUMENTADO`; NE | ator humano, estados e aceite não especificados |
| `PROD-REQ-002` | Sintetizar no dashboard os dados coletados em campo (`COMPORTAMENTO_DESCRITO`). | 004:L7-L12 | `FUNCIONAL` | plataforma/sistema | sintetizar dados de campo | dados existentes | finalidade; fase não especificada | `FATO_DOCUMENTADO`; NE | regra de agregação e atualização ausente |
| `PROD-REQ-003` | Mostrar IHFR atual/último e classe de risco no dashboard (`REQUISITO_FORMULADO`). | 004:L16-L23,L270-L282; 014:L62-L110,L311-L317 | `FUNCIONAL` | usuário; sistema | exibir score e classe da última análise | ao menos um diagnóstico salvo no aceite | MVP no wireframe | `FATO_DOCUMENTADO`; NE | “atual” versus “última análise”; seleção da área ausente |
| `PROD-REQ-004` | Mostrar indicadores ambientais resumidos (`COMPORTAMENTO_DESCRITO`). | 004:L25-L30,L274-L280; 014:L92-L96 | `FUNCIONAL` | usuário; sistema | exibir disponibilidade, infiltração, cobertura e degradação | não especificado | recomendado; MVP aparente | `FATO_DOCUMENTADO`; NE | derivação, unidade e período não especificados |
| `PROD-REQ-005` | Apresentar classificação para restauração, potencial para SAF e necessidade de intervenção (`COMPORTAMENTO_DESCRITO`). | 004:L32-L36 | `FUNCIONAL` | usuário; sistema | exibir resultados analíticos adicionais | após análise, por `INFERENCIA` | recomendado | `FATO_DOCUMENTADO`; NE | conceitos, cálculo e formato não definidos |
| `PROD-REQ-006` | Listar diagnósticos e acompanhar evolução do IHFR; wireframe mostra histórico (`COMPORTAMENTO_DESCRITO`). | 004:L38-L42,L274-L282; 014:L68-L73,L106-L109,L311-L317 | `FUNCIONAL` | usuário; sistema | consultar histórico/evolução | diagnósticos salvos | dashboard MVP | `FATO_DOCUMENTADO`; NE | período, ordenação, filtros e escopo de acesso ausentes |
| `PROD-REQ-007` | Mostrar alertas de restauração prioritária e risco hídrico elevado (`COMPORTAMENTO_DESCRITO`). | 004:L43-L47,L274-L280 | `FUNCIONAL` | usuário; sistema | exibir alertas técnicos | critérios de disparo não especificados | recomendado; fase não especificada | `FATO_DOCUMENTADO`; NE | limiares, ciclo e confirmação ausentes |
| `PROD-REQ-008` | Ter mapa como elemento central da interface (`REQUISITO_FORMULADO`). | 004:L48-L50 | `FUNCIONAL` | usuário; sistema | disponibilizar interação territorial | não especificado | “essencial” | `FATO_DOCUMENTADO`; NE | “central” não possui critério verificável |
| `PROD-REQ-009` | No dashboard, mostrar áreas/propriedades e cor por classe IHFR (`EXPECTATIVA_DE_TELA`). | 004:L52-L67; 014:L98-L104,L280-L307,L313-L317 | `UX_OU_FLUXO` | usuário | visualizar áreas no mapa por classe | diagnóstico/área existentes | dashboard/MVP | `FATO_DOCUMENTADO`; NE | agregação de áreas e seleção não especificadas |
| `PROD-REQ-010` | Registrar nome, município, coordenadas/geometria, tamanho e uso da área (`COMPORTAMENTO_DESCRITO`). | 004:L69-L76,L114-L123,L236-L247; 014:L112-L158,L319-L325 | `DADO` | usuário | capturar dados básicos da área e salvá-la | cadastro de área | MVP | `FATO_DOCUMENTADO`; NE | obrigatoriedade, validação e formatos ausentes |
| `PROD-REQ-011` | Capturar “Estado” no cadastro (`EXPECTATIVA_DE_TELA`). | 014:L127-L134 | `DADO` | usuário | informar estado territorial | cadastro | MVP do wireframe | `FATO_DOCUMENTADO`; NE | campo não localizado em 004; formato e relação com município ausentes |
| `PROD-REQ-012` | Delimitar área por coordenadas, ponto ou polígono (`COMPORTAMENTO_DESCRITO`). | 004:L69-L76,L206-L212,L228-L232; 014:L146-L157,L280-L295,L319-L325 | `FUNCIONAL` | usuário | marcar/desenhar área no mapa | cadastro de área | MVP | `FATO_DOCUMENTADO`; NE | se alternativas são exclusivas/combináveis e validade geométrica ausentes |
| `PROD-REQ-013` | Registrar ponto de coleta na tela de área (`COMPORTAMENTO_DESCRITO`). | 004:L69-L76 | `FUNCIONAL` | usuário | registrar ponto de coleta | cadastro/análise, não especificado | fase não especificada | `FATO_DOCUMENTADO`; NE | não reaparece no wireframe; cardinalidade e vínculo ausentes |
| `PROD-REQ-014` | Capturar localização por GPS (`COMPORTAMENTO_DESCRITO`). | 004:L78-L82; 014:L150-L155,L280-L295 | `INTEGRACAO` | usuário; dispositivo | capturar coordenada/área | permissão/sinal não especificados | básica/MVP aparente | `FATO_DOCUMENTADO`; NE | precisão, falha, consentimento e uso offline ausentes |
| `PROD-REQ-015` | Upload de shapefile fica fora do MVP, como futuro (`REQUISITO_FORMULADO`). | 004:L78-L82,L214-L218 | `FORA_DE_ESCOPO` | não aplicável | excluir upload do escopo MVP | MVP | futuro explícito | `FATO_DOCUMENTADO`; NE | formato futuro e fase não definidos; escopo histórico claro |
| `PROD-REQ-016` | Camadas prontas de hidrografia, solos, vegetação e uso ficam futuras (`REQUISITO_FORMULADO`). | 004:L92-L97,L214-L218 | `FORA_DE_ESCOPO` | não aplicável | excluir camadas avançadas do MVP | MVP | futuro explícito | `FATO_DOCUMENTADO`; NE | fonte/dados e cronologia futura não definidos |
| `PROD-REQ-017` | Uma “tela de análise territorial” mostraria área, dados e IHFR (`EXPECTATIVA_DE_TELA`). | 004:L84-L90 | `UX_OU_FLUXO` | usuário | visualizar análise territorial em mapa | após análise, por `INFERENCIA` | fase não especificada | `FATO_DOCUMENTADO`; NE | não integra a lista das cinco telas; natureza como tela/painel não definida |
| `PROD-REQ-018` | Mapa poderá contextualizar análise/recomendação no assistente de IA (`PROPOSTA`). | 004:L99-L106 | `PROPOSTA` | usuário; assistente de IA | apresentar contexto espacial | uso de IA | não especificada | `PROPOSTA`; NE | fluxo, dados, decisão automatizada e fase ausentes |
| `PROD-REQ-019` | Adotar sistema modular de coleta, não formulário único nem totalmente separado (`PROPOSTA`). | 004:L108-L113 | `PROPOSTA` | usuário; sistema | organizar coleta em módulos | durante coleta | “recomendação técnica” | `PROPOSTA`; NE | quantidade/ordem/retomada dos módulos não especificadas |
| `PROD-REQ-020` | Coletar fonte, nascente, poço, disponibilidade e sazonalidade/dados hídricos (`COMPORTAMENTO_DESCRITO`). | 004:L124-L133; 014:L164-L190 | `DADO` | usuário | informar dados hídricos | módulo hídrico | MVP aparente | `FATO_DOCUMENTADO`; NE | salinização aparece no wireframe; sazonalidade é incorporada à disponibilidade, sem equivalência declarada |
| `PROD-REQ-021` | Coletar tipo/textura, infiltração, compactação, erosão e solo exposto (`COMPORTAMENTO_DESCRITO`). | 004:L134-L141; 014:L192-L216 | `DADO` | usuário | informar dados do solo | módulo solo | MVP aparente | `FATO_DOCUMENTADO`; NE | “tipo” e “textura” podem se sobrepor; unidades/validações ausentes |
| `PROD-REQ-022` | Coletar cobertura, fragmentação, APP/mata ciliar e degradação (`COMPORTAMENTO_DESCRITO`). | 004:L142-L148; 014:L218-L240 | `DADO` | usuário | informar vegetação/paisagem | módulo vegetação | MVP aparente | `FATO_DOCUMENTADO`; NE | APP versus mata ciliar e critérios das classes não definidos |
| `PROD-REQ-023` | Processar dados e calcular IHFR (`REQUISITO_FORMULADO`). | 004:L149-L157,L228-L234; 014:L21-L25,L239-L240,L344-L345 | `FUNCIONAL` | sistema | calcular IHFR | dados inseridos/ação calcular | MVP | `FATO_DOCUMENTADO`; NE | validade mínima, erro e regra aprovada dependem de ciência |
| `PROD-REQ-024` | Apresentar valor, classe e interpretação/explicação (`REQUISITO_FORMULADO`). | 004:L158-L163,L251-L263; 014:L243-L278,L335-L345 | `FUNCIONAL` | sistema; usuário | exibir resultado compreensível | cálculo concluído | MVP | `FATO_DOCUMENTADO`; NE | contrato de insuficiência, precisão e terminologia não definidos |
| `PROD-REQ-025` | Gerar recomendações de restauração, SAF, manejo e prioridade (`COMPORTAMENTO_DESCRITO`). | 004:L164-L173; 014:L266-L274,L335-L342 | `FUNCIONAL` | sistema; usuário | exibir recomendações | resultado calculado, por `INFERENCIA` | fase não especificada | `FATO_DOCUMENTADO`; NE | regra de geração, responsabilidade técnica e aceite ausentes |
| `PROD-REQ-026` | Recomendações poderão ser assistidas por IA contextual (`PROPOSTA`). | 004:L164-L173 | `PROPOSTA` | assistente de IA | auxiliar geração de recomendação | não especificado | possibilidade futura/não delimitada | `PROPOSTA`; NE | supervisão, transparência, privacidade e fase ausentes |
| `PROD-REQ-027` | MVP contém cinco telas: login, dashboard, cadastro, dados e resultado (`REQUISITO_FORMULADO`). | 004:L196-L212; 014:L12-L278 | `RESTRICAO` | produto/UX | delimitar conjunto principal de telas | MVP | estrutura mínima explícita | `FATO_DOCUMENTADO`; NE | subpáginas, modais e estados não estão contados; escopo histórico claro |
| `PROD-REQ-028` | Permitir acesso por email, senha e ação Entrar (`EXPECTATIVA_DE_TELA`). | 004:L198-L204,L228-L230; 014:L28-L60 | `FUNCIONAL` | usuário | autenticar e acessar dashboard | credenciais; regras ausentes | MVP | `FATO_DOCUMENTADO`; NE | criação, validação, erro, sessão e segurança não definidos |
| `PROD-REQ-029` | “Esqueceu senha?” sugere recuperação (`EXPECTATIVA_DE_TELA`). | 014:L49-L52 | `UX_OU_FLUXO` | usuário | iniciar recuperação de senha | senha esquecida | MVP do wireframe, não confirmado | `INFERENCIA`; NE | existe só como rótulo; nenhum comportamento ou resultado |
| `PROD-REQ-030` | “Criar conta” sugere cadastro de conta (`EXPECTATIVA_DE_TELA`). | 014:L49-L52 | `UX_OU_FLUXO` | usuário | iniciar criação de conta | não especificado | MVP do wireframe, não confirmado | `INFERENCIA`; NE | conta, elegibilidade, dados e aprovação ausentes |
| `PROD-REQ-031` | Menu sugere navegação para Áreas, Novo Diagnóstico, Histórico e Configurações (`EXPECTATIVA_DE_TELA`). | 014:L77-L85 | `UX_OU_FLUXO` | usuário | navegar entre destinos | acesso ao dashboard | MVP do wireframe | `INFERENCIA`; NE | destinos não têm telas/fluxos próprios; visibilidade por papel ausente |
| `PROD-REQ-032` | Inserir dados básicos, marcar e salvar área (`REQUISITO_FORMULADO`). | 014:L112-L158,L319-L325 | `FUNCIONAL` | usuário | salvar cadastro da área | dados/mapa informados | MVP | `FATO_DOCUMENTADO`; NE | validação, duplicidade, confirmação e erro ausentes |
| `PROD-REQ-033` | Tela deve aceitar dados hídricos, do solo e de vegetação (`REQUISITO_FORMULADO`). | 004:L228-L233; 014:L160-L240,L327-L334 | `FUNCIONAL` | usuário; sistema | aceitar dados ambientais | área/diagnóstico não declarados como pré-condição | MVP | `FATO_DOCUMENTADO`; NE | território não aparece como bloco; validações e salvamento parcial ausentes |
| `PROD-REQ-034` | Disponibilizar ação “CALCULAR IHFR” (`EXPECTATIVA_DE_TELA`). | 014:L239-L240 | `FUNCIONAL` | usuário; sistema | iniciar processamento | campos preenchidos, por `INFERENCIA` | MVP | `FATO_DOCUMENTADO`; NE | habilitação, progresso, erro e repetição ausentes |
| `PROD-REQ-035` | Mostrar componentes Água, Solo, Vegetação e Território (`EXPECTATIVA_DE_TELA`). | 014:L251-L265 | `DADO` | usuário; sistema | exibir componentes do índice | resultado disponível | MVP | `FATO_DOCUMENTADO`; NE | precisão, significado e relação com inputs não explicados |
| `PROD-REQ-036` | Salvar diagnóstico no histórico e refletir no dashboard (`COMPORTAMENTO_DESCRITO`). | 004:L228-L234; 014:L276,L311-L317 | `FUNCIONAL` | usuário; sistema | persistir resultado e atualizar histórico/dashboard | resultado disponível | MVP | `FATO_DOCUMENTADO`; NE | confirmação, idempotência, falha e edição não definidas |
| `PROD-REQ-037` | Voltar do resultado ao dashboard (`EXPECTATIVA_DE_TELA`). | 014:L276-L278 | `UX_OU_FLUXO` | usuário | navegar ao dashboard | resultado exibido | MVP | `FATO_DOCUMENTADO`; NE | comportamento com resultado não salvo ausente |
| `PROD-REQ-038` | Mapa permite zoom, navegação, visualização, polígono, ponto, GPS e cores (`REQUISITO_FORMULADO`). | 014:L280-L307 | `FUNCIONAL` | usuário | interagir com mapa | tela com mapa | MVP aparente | `FATO_DOCUMENTADO`; NE | autorização, acessibilidade, erro, precisão e dispositivos ausentes |
| `PROD-REQ-039` | Administrador/Técnico cria/edita áreas, lança análises, vê todas e pode exportar (`REQUISITO_FORMULADO`). | 004:L219-L225 | `PAPEL_OU_PERMISSAO` | Administrador/Técnico | executar ações administrativas/técnicas | perfil atribuído | MVP; exportação “se houver” | `FATO_DOCUMENTADO`; NE | papel composto, escopo de admin e exportação não definidos |
| `PROD-REQ-040` | Usuário de Campo cadastra área, insere dados e vê resultado (`REQUISITO_FORMULADO`). | 004:L219-L226 | `PAPEL_OU_PERMISSAO` | Usuário de Campo | operar coleta e consultar resultado | perfil atribuído | MVP | `FATO_DOCUMENTADO`; NE | convite, vínculo e permissão de edição ausentes |
| `PROD-REQ-041` | Usuário de Campo vê histórico da “própria área” (`REGRA_DE_PERMISSAO` descrita). | 004:L225-L226 | `PAPEL_OU_PERMISSAO` | Usuário de Campo | restringir histórico por própria área | propriedade/vínculo não definido | MVP | `FATO_DOCUMENTADO`; NE | “própria”, propriedade, múltiplos usuários e compartilhamento ambíguos |
| `PROD-REQ-042` | Manter entidade `User` (`COMPORTAMENTO_DESCRITO`). | 004:L236-L247 | `DADO` | sistema | representar usuário | MVP | mínimo | `FATO_DOCUMENTADO`; NE | atributos, identidade, conta e ciclo de vida ausentes |
| `PROD-REQ-043` | Manter `Area` com nome, município, geometria, tamanho e uso (`COMPORTAMENTO_DESCRITO`). | 004:L236-L247 | `DADO` | sistema | representar área | MVP | mínimo | `FATO_DOCUMENTADO`; NE | propriedade, cardinalidade, estado e exclusão ausentes |
| `PROD-REQ-044` | Manter `Survey/Diagnóstico` como rodada de coleta (`COMPORTAMENTO_DESCRITO`). | 004:L236-L247 | `DADO` | sistema | representar rodada/diagnóstico | MVP | mínimo | `FATO_DOCUMENTADO`; NE | relação com área/usuário e ciclo não declarados |
| `PROD-REQ-045` | Manter `SoilData` (`COMPORTAMENTO_DESCRITO`). | 004:L236-L247 | `DADO` | sistema | representar dados do solo | MVP | mínimo | `FATO_DOCUMENTADO`; NE | relação e cardinalidade apenas implícitas |
| `PROD-REQ-046` | Manter `WaterData` (`COMPORTAMENTO_DESCRITO`). | 004:L236-L247 | `DADO` | sistema | representar dados hídricos | MVP | mínimo | `FATO_DOCUMENTADO`; NE | relação e cardinalidade apenas implícitas |
| `PROD-REQ-047` | Manter `VegetationData` (`COMPORTAMENTO_DESCRITO`). | 004:L236-L247 | `DADO` | sistema | representar dados de vegetação | MVP | mínimo | `FATO_DOCUMENTADO`; NE | relação e cardinalidade apenas implícitas |
| `PROD-REQ-048` | Manter `IHFRResult` com valor, classe, componentes e versão (`COMPORTAMENTO_DESCRITO`). | 004:L236-L249 | `DADO` | sistema | representar resultado | MVP | mínimo | `FATO_DOCUMENTADO`; NE | relação com diagnóstico e versionamento não formalizados |
| `PROD-REQ-049` | Manter `Alerts` para prioridade/risco (`COMPORTAMENTO_DESCRITO`). | 004:L236-L247 | `DADO` | sistema | representar alertas | MVP | mínimo | `FATO_DOCUMENTADO`; NE | regra, destinatário, estado e histórico ausentes |
| `PROD-REQ-050` | Registrar versão do algoritmo no resultado (`REGRA_DE_NEGOCIO`). | 004:L246-L249; 014:L344-L345 | `REGRA_DE_NEGOCIO` | sistema | persistir versão com resultado | todo cálculo/resultado, por `INFERENCIA` | MVP | `FATO_DOCUMENTADO`; NE | formato, imutabilidade e relação com calibração ausentes |
| `PROD-REQ-051` | Contrato do IHFR precisa listar entradas/unidades/faixas, normalização, pesos, classe e explicação (`INSTRUCAO`). | 004:L251-L263 | `RESTRICAO` | responsáveis científicos/produto não especificados | fornecer contrato matemático mínimo | antes da implementação, por contexto | MVP | `FATO_DOCUMENTADO`; NE | autoridade e conteúdo aprovado ausentes; depende de `PD-002` |
| `PROD-REQ-052` | Usar pesos iguais por dimensão na v0.1 MVP (`PROPOSTA`). | 004:L265-L268 | `PROPOSTA` | não especificado | adotar pesos iguais | versão v0.1 | recomendação MVP | `PROPOSTA`; NE | proposta científica não validada; composição territorial imprecisa |
| `PROD-REQ-053` | Calibrar pesos com dados reais na v0.2 pós-campo (`PROPOSTA`). | 004:L267-L268 | `PROPOSTA` | responsáveis científicos não especificados | calibrar pesos | pós-campo/Meta 4 | futuro explícito | `PROPOSTA`; NE | dados, método, autoridade e relação com v0.1 ausentes |
| `PROD-REQ-054` | Com diagnóstico, dashboard mostra última classe e área colorida (`CRITERIO_DE_ACEITACAO`). | 004:L270-L282; 014:L309-L317 | `CRITERIO_DE_ACEITACAO` | usuário | verificar dashboard populado | ao menos um diagnóstico salvo | exemplo/MVP | `FATO_DOCUMENTADO`; NE | cenário alternativo, precisão e escopo de área ausentes |
| `PROD-REQ-055` | Repetir checklist/aceite para cadastro, dados e resultado (`INSTRUCAO`). | 004:L270-L284; 014:L319-L345 | `CRITERIO_DE_ACEITACAO` | não especificado | definir/verificar aceites das telas | telas correspondentes | MVP | `FATO_DOCUMENTADO`; NE | A instrução é explícita; 004 não formula cenários, e 014 lista resultados sem Given/When/Then, erros ou exceções; suficiência e aprovação permanecem não especificadas |
| `PROD-REQ-056` | Em baixa conectividade, no mínimo não perder dados (`REQUISITO_FORMULADO`). | 004:L286-L291 | `NAO_FUNCIONAL` | sistema; usuário | preservar dados | offline/baixa conectividade | mínimo indispensável | `FATO_DOCUMENTADO`; NE | duração, escopo, recuperação e teste ausentes |
| `PROD-REQ-057` | Idealmente salvar rascunho local e sincronizar depois, mesmo parcial (`PROPOSTA`). | 004:L288 | `PROPOSTA` | sistema; usuário | salvar/sincronizar rascunho | offline/retorno da conexão | ideal; MVP parcial possível | `PROPOSTA`; NE | conflito, segurança, volume e experiência não definidos |
| `PROD-REQ-058` | Algoritmos simples, transparentes e auditáveis (`REQUISITO_FORMULADO`). | 004:L286-L290 | `NAO_FUNCIONAL` | sistema/equipe | permitir auditabilidade | processamento IHFR | mínimo/princípio do projeto citado | `FATO_DOCUMENTADO`; NE | métricas de simplicidade/transparência e autoridade científica ausentes |
| `PROD-REQ-059` | Guardar entradas, versão e resultado para auditabilidade (`REQUISITO_FORMULADO`). | 004:L289-L290 | `NAO_FUNCIONAL` | sistema | persistir trilha mínima | cálculo realizado | consequência declarada | `FATO_DOCUMENTADO`; NE | retenção, acesso, integridade e privacidade ausentes |
| `PROD-REQ-060` | Resultados devem ser compreensíveis para não especialistas (`REQUISITO_FORMULADO`). | 004:L286-L291 | `NAO_FUNCIONAL` | usuário não especialista; sistema | apresentar resultado compreensível | exibição de resultado | mínimo indispensável | `FATO_DOCUMENTADO`; NE | público, linguagem, teste de usabilidade e acessibilidade ausentes |

### Critérios, relações e dependências por candidato

| ID | Critério de aceitação localizado | Requisito relacionado | Tela/fluxo relacionado | Dependência científica | Dependência de dados |
|---|---|---|---|---|---|
| `PROD-REQ-001` | não especificado | `PROD-REQ-002`–`009` | `SCREEN-002`; `FLOW-003` | não aplicável diretamente | `DOM-CON-004`, `010`, `015`, `021`, `022` |
| `PROD-REQ-002` | não especificado | `PROD-REQ-004`, `020`–`023` | `SCREEN-002`; `FLOW-003` | `DOC-009`; `PD-002` para significado dos dados | `DOM-CON-011`–`014` |
| `PROD-REQ-003` | `PROD-REQ-054` | `PROD-REQ-023`, `024`, `036` | `SCREEN-002`, `017`; `FLOW-003` | `DOC-010`; `PD-002` | `DOM-CON-015`, `016`, `018`, `022` |
| `PROD-REQ-004` | menção no checklist, sem valores verificáveis | `PROD-REQ-002`, `020`–`022` | `SCREEN-007`; `FLOW-003` | `DOC-009`/`DOC-010`; `PD-002` | `DOM-CON-011`–`014` |
| `PROD-REQ-005` | não especificado | `PROD-REQ-024`, `025` | dashboard, sem componente em 014; `FLOW-003` | `DOC-009`/`DOC-010`; `PD-002` | `DOM-CON-019`, `020` |
| `PROD-REQ-006` | histórico deve listar análises com diagnóstico salvo | `PROD-REQ-036` | `SCREEN-009`, `017`; `FLOW-003`, `007` | não aplicável diretamente | `DOM-CON-010`, `015`, `022` |
| `PROD-REQ-007` | não especificado | `PROD-REQ-025`, `049` | dashboard; `FLOW-003` | `DOC-009`/`DOC-010`; `PD-002` | `DOM-CON-021` |
| `PROD-REQ-008` | não especificado | `PROD-REQ-009`, `012`, `014`, `038` | `SCREEN-008`, `010`; `FLOW-003`, `004`, `010` | não aplicável diretamente | `DOM-CON-024` |
| `PROD-REQ-009` | área deve aparecer/colorir com diagnóstico salvo | `PROD-REQ-003`, `036`, `038` | `SCREEN-008`, `017`; `FLOW-003` | classe depende de `DOC-010`/`PD-002` | `DOM-CON-004`, `006`, `015`, `018`, `024` |
| `PROD-REQ-010` | inserir dados básicos, marcar e salvar | `PROD-REQ-012`, `032`, `043` | `SCREEN-003`; `FLOW-004` | uso da terra pode ter dependência científica em `DOC-009` | `DOM-CON-004`, `006`, `008`, `009`, `023` |
| `PROD-REQ-011` | não especificado | `PROD-REQ-010` | `SCREEN-003`; `FLOW-004` | não aplicável | conceito territorial específico não modelado; `DOM-CON-008` relacionado |
| `PROD-REQ-012` | marcar área e salvar | `PROD-REQ-010`, `014`, `032`, `038` | `SCREEN-010`; `FLOW-004` | não aplicável | `DOM-CON-004`, `006`, `023`, `024` |
| `PROD-REQ-013` | não especificado | `PROD-REQ-010`, `033` | tela de cadastro em 004; `FLOW-004` parcial | `DOC-009`; `PD-002` para protocolo | `DOM-CON-007`, `010` |
| `PROD-REQ-014` | ação visível no mapa; resultado não especificado | `PROD-REQ-012`, `038` | `SCREEN-010`; `FLOW-010` | não aplicável | `DOM-CON-006`, `023` |
| `PROD-REQ-015` | exclusão literal do MVP | `PROD-REQ-012`, `038` | `SCREEN-010`; fluxo futuro | não aplicável | `DOM-CON-006`, `024` |
| `PROD-REQ-016` | exclusão literal do MVP | `PROD-REQ-009`, `017` | mapas; fluxo futuro | camadas podem depender de ciência/dados, não especificado | `DOM-CON-024` |
| `PROD-REQ-017` | não especificado | `PROD-REQ-009`, `024` | tela não inventariada em 014; fluxo parcial | `DOC-010`; `PD-002` | `DOM-CON-004`, `014`, `015`, `024` |
| `PROD-REQ-018` | não especificado | `PROD-REQ-017`, `026` | não localizado em 014; fluxo inferido não formalizado | interpretação depende de `DOC-009`/`DOC-010` | `DOM-CON-019`, `020`, `024` |
| `PROD-REQ-019` | não especificado | `PROD-REQ-020`–`022`, `033` | `SCREEN-004`, `011`–`013`; `FLOW-005` | `DOC-009`; `PD-002` | `DOM-CON-011`–`014` |
| `PROD-REQ-020` | sistema deve aceitar dados hídricos | `PROD-REQ-019`, `033`, `046` | `SCREEN-011`; `FLOW-005` | `DOC-009`/`DOC-010`; `PD-002` | `DOM-CON-011`, `014` |
| `PROD-REQ-021` | sistema deve aceitar dados do solo | `PROD-REQ-019`, `033`, `045` | `SCREEN-012`; `FLOW-005` | `DOC-009`/`DOC-010`; `PD-002` | `DOM-CON-012`, `014` |
| `PROD-REQ-022` | sistema deve aceitar dados de vegetação | `PROD-REQ-019`, `033`, `047` | `SCREEN-013`; `FLOW-005` | `DOC-009`/`DOC-010`; `PD-002` | `DOM-CON-013`, `014` |
| `PROD-REQ-023` | cálculo deve usar especificação v0.1 e versão | `PROD-REQ-024`, `034`, `050`, `051` | `SCREEN-004`; `FLOW-006` | `DOC-010`; `PD-002` bloqueia norma | `DOM-CON-010`–`017`, `023` |
| `PROD-REQ-024` | mostrar valor, classe, explicação e recomendações | `PROD-REQ-023`, `025`, `035` | `SCREEN-005`, `015`; `FLOW-007` | `DOC-009`/`DOC-010`; `PD-002` | `DOM-CON-015`–`020` |
| `PROD-REQ-025` | recomendações devem aparecer | `PROD-REQ-024`, `026` | `SCREEN-016`; `FLOW-007` | `DOC-009`/`DOC-010`; `PD-002` | `DOM-CON-020` |
| `PROD-REQ-026` | não especificado | `PROD-REQ-025` | nenhum artefato em 014; fluxo não localizado | `DOC-009`/`DOC-010`; `PD-002` | dados/contexto para IA não especificados |
| `PROD-REQ-027` | as duas fontes apresentam as cinco telas | `PROD-REQ-001`, `028`, `032`–`037` | `SCREEN-001`–`005`; `FLOW-001` | não aplicável | múltiplos conceitos; não é requisito de dados |
| `PROD-REQ-028` | não especificado | `PROD-REQ-029`, `030` | `SCREEN-001`; `FLOW-002` | não aplicável | `DOM-CON-001`, `002` |
| `PROD-REQ-029` | não especificado | `PROD-REQ-028` | `SCREEN-001`; `FLOW-008` | não aplicável | `DOM-CON-001`, `002` |
| `PROD-REQ-030` | não especificado | `PROD-REQ-028`, `042` | `SCREEN-001`; `FLOW-009` | não aplicável | `DOM-CON-001`, `002` |
| `PROD-REQ-031` | não especificado | `PROD-REQ-001`, `006`, `032`, `036` | `SCREEN-006`; fluxos não detalhados | não aplicável | destinos sugerem `DOM-CON-004`, `010`, `022` |
| `PROD-REQ-032` | inserir básicos, marcar e salvar | `PROD-REQ-010`, `012` | `SCREEN-003`; `FLOW-004` | não aplicável diretamente | `DOM-CON-004`, `006`, `008`, `009`, `023` |
| `PROD-REQ-033` | aceitar três grupos de dados | `PROD-REQ-019`–`022` | `SCREEN-004`, `011`–`013`; `FLOW-005` | `DOC-009`; `PD-002` | `DOM-CON-010`–`014` |
| `PROD-REQ-034` | botão explícito; sucesso/erro não especificados | `PROD-REQ-023` | `SCREEN-004`; `FLOW-006` | `DOC-010`; `PD-002` | `DOM-CON-010`, `015` |
| `PROD-REQ-035` | quatro componentes são exibidos | `PROD-REQ-024`, `048` | `SCREEN-014`; `FLOW-007` | `DOC-010`; `PD-002` | `DOM-CON-015`, `017` |
| `PROD-REQ-036` | diagnóstico salvo aparece no histórico/dashboard | `PROD-REQ-006`, `023`, `024` | `SCREEN-005`, `009`, `017`; `FLOW-007` | resultado depende de `DOC-010` | `DOM-CON-010`, `015`, `022` |
| `PROD-REQ-037` | ação explícita de navegação | `PROD-REQ-036` | `SCREEN-005`; `FLOW-007` | não aplicável | não aplicável |
| `PROD-REQ-038` | lista de funções básicas/cadastro/visualização | `PROD-REQ-008`, `009`, `012`, `014` | `SCREEN-008`, `010`; `FLOW-003`, `004`, `010` | cor por classe depende de `DOC-010` | `DOM-CON-006`, `018`, `023`, `024` |
| `PROD-REQ-039` | não há critérios por ação/tela | `PROD-REQ-041` | nenhuma tela representa permissões; fluxos transversais | não aplicável | `DOM-CON-001`, `003`, `004`, `010` |
| `PROD-REQ-040` | não há critérios por ação/tela | `PROD-REQ-041` | `FLOW-004`–`007`; telas sem autorização | não aplicável | `DOM-CON-001`, `003`, `004`, `010` |
| `PROD-REQ-041` | não especificado | `PROD-REQ-039`, `040` | histórico/dashboard; `FLOW-003`, `007` | não aplicável | `DOM-CON-001`, `004`, `022` |
| `PROD-REQ-042` | não especificado | `PROD-REQ-028`, `030`, `039`–`041` | autenticação/perfis | não aplicável | `DOM-CON-001`, `002`, `003` |
| `PROD-REQ-043` | campos básicos aparecem no cadastro | `PROD-REQ-010`, `032` | `SCREEN-003`; `FLOW-004` | uso pode ter dependência científica | `DOM-CON-004`, `006`, `008`, `009` |
| `PROD-REQ-044` | “uma rodada de coleta” | `PROD-REQ-033`, `036` | `FLOW-005`–`007` | `DOC-009`/`DOC-010` | `DOM-CON-010`–`015` |
| `PROD-REQ-045` | campos de solo aparecem no bloco | `PROD-REQ-021`, `033` | `SCREEN-012`; `FLOW-005` | `DOC-009`; `PD-002` | `DOM-CON-012` |
| `PROD-REQ-046` | campos hídricos aparecem no bloco | `PROD-REQ-020`, `033` | `SCREEN-011`; `FLOW-005` | `DOC-009`; `PD-002` | `DOM-CON-011` |
| `PROD-REQ-047` | campos de vegetação aparecem no bloco | `PROD-REQ-022`, `033` | `SCREEN-013`; `FLOW-005` | `DOC-009`; `PD-002` | `DOM-CON-013` |
| `PROD-REQ-048` | valor/classe/componentes/versão localizados | `PROD-REQ-024`, `035`, `050` | `SCREEN-005`, `014`; `FLOW-007` | `DOC-010`; `PD-002` | `DOM-CON-015`–`018`, `023` |
| `PROD-REQ-049` | não especificado | `PROD-REQ-007` | dashboard; `FLOW-003` | regra de alerta pode depender de ciência | `DOM-CON-021` |
| `PROD-REQ-050` | versão deve ser registrada | `PROD-REQ-023`, `048`, `059` | resultado; `FLOW-006`, `007` | `DOC-010`; `PD-002` | `DOM-CON-015`, `023` |
| `PROD-REQ-051` | lista de cinco entregas, sem valores aprovados | `PROD-REQ-023`, `024`, `052`, `053` | cálculo/resultado | `DOC-009`/`DOC-010`; `PD-002` | entradas/resultados, modelo pretendido não normatizado |
| `PROD-REQ-052` | não há aceite; proposta matemática | `PROD-REQ-051`, `053` | cálculo, sem representação visual própria | `DOC-010`; `PD-002` | `DOM-CON-017`, `023` |
| `PROD-REQ-053` | fase pós-campo explicitada; aceite não | `PROD-REQ-051`, `052` | não aplicável ao MVP histórico | `DOC-010`; `PD-002` | dados reais/calibração não especificados |
| `PROD-REQ-054` | o próprio enunciado é o aceite | `PROD-REQ-003`, `009`, `036` | `SCREEN-017`; `FLOW-003` | classe depende de `DOC-010` | `DOM-CON-004`, `015`, `018` |
| `PROD-REQ-055` | listas parciais em 014:L319-L345 | `PROD-REQ-032`–`036` | `SCREEN-003`–`005`; `FLOW-004`–`007` | cálculo/resultado dependem de `DOC-010` | conceitos de área, coleta e resultado |
| `PROD-REQ-056` | “não perder dados”; métrica não especificada | `PROD-REQ-057`, `059` | coleta; fluxos offline não desenhados | não aplicável | `DOM-CON-014`, `025` |
| `PROD-REQ-057` | não especificado | `PROD-REQ-056` | fluxo offline não localizado | não aplicável | `DOM-CON-025`; sincronização/modelo ausentes |
| `PROD-REQ-058` | não especificado | `PROD-REQ-050`, `051`, `059` | cálculo/resultado | `DOC-010`; `PD-002` | `DOM-CON-023` e trilha de dados |
| `PROD-REQ-059` | guardar entradas/versão/resultado | `PROD-REQ-048`, `050`, `058` | `FLOW-006`, `007` | `DOC-010`; `PD-002` | `DOM-CON-010`–`015`, `023` |
| `PROD-REQ-060` | não especificado | `PROD-REQ-024`, `025` | `SCREEN-015`, `016`; `FLOW-007` | interpretação científica depende de `DOC-009`/`DOC-010` | `DOM-CON-019`, `020` |

## Suficiência documental dos candidatos

A ordem do vetor é: ator; ação; objeto; pré-condição; fluxo principal; exceções; resultado; autorização; dados de entrada; dados de saída; validação; erro; critério de aceitação; prioridade; fase; dependência. Os códigos são `C` = `COMPLETO_NO_ESCOPO_DA_FONTE`, `P` = `PARCIAL`, `A` = `AMBIGUO`, `NE` = `NAO_ESPECIFICADO` e `NA` = `NAO_APLICAVEL`. O estado global não indica aprovação.

| ID | Vetor de suficiência | Estado global | Síntese |
|---|---|---|---|
| `PROD-REQ-001` | P/C/C/P/P/NE/C/NE/P/P/NE/NE/NE/C/P/P | `PARCIAL` | Dashboard é exigido, mas seu contrato operacional não. |
| `PROD-REQ-002` | P/C/C/P/P/NE/C/NE/P/C/NE/NE/NE/P/NE/P | `PARCIAL` | Finalidade clara; agregação e atualização ausentes. |
| `PROD-REQ-003` | P/C/C/C/P/NE/C/NE/P/C/NE/NE/C/P/C/P | `PARCIAL` | Condição e saída existem; seleção, erro e autorização faltam. |
| `PROD-REQ-004` | P/C/C/NE/P/NE/C/NE/P/C/NE/NE/P/P/P/P | `PARCIAL` | Indicadores nomeados, sem contrato de derivação. |
| `PROD-REQ-005` | P/C/A/P/P/NE/A/NE/P/A/NE/NE/NE/P/NE/P | `AMBIGUO` | Saídas adicionais não têm definição operacional. |
| `PROD-REQ-006` | P/C/C/C/P/NE/C/A/P/C/NE/NE/P/P/C/P | `PARCIAL` | Histórico é localizado; escopo, filtros e acesso não. |
| `PROD-REQ-007` | P/C/C/NE/P/NE/C/NE/P/C/NE/NE/NE/P/NE/P | `PARCIAL` | Alertas são nomeados, sem regra ou ciclo. |
| `PROD-REQ-008` | P/C/C/NE/P/NE/C/NE/P/P/NE/NE/NE/C/NE/P | `PARCIAL` | Essencialidade é clara; comportamento verificável não. |
| `PROD-REQ-009` | P/C/C/C/P/NE/C/NE/P/C/NE/NE/C/P/C/P | `PARCIAL` | Visualização e cores aparecem; agregação/seleção faltam. |
| `PROD-REQ-010` | C/C/C/P/P/NE/C/NE/C/P/NE/NE/P/C/C/P | `PARCIAL` | Campos e ação são claros, validações não. |
| `PROD-REQ-011` | C/C/A/P/P/NE/P/NE/C/P/NE/NE/NE/P/C/NE | `AMBIGUO` | Campo isolado e relação territorial não definidos. |
| `PROD-REQ-012` | C/C/C/P/C/NE/C/NE/C/P/NE/NE/P/C/C/P | `PARCIAL` | Alternativas geoespaciais explícitas, contrato geométrico ausente. |
| `PROD-REQ-013` | C/C/C/P/P/NE/P/NE/P/P/NE/NE/NE/P/NE/P | `PARCIAL` | Ponto é citado sem fluxo, cardinalidade ou resultado. |
| `PROD-REQ-014` | C/C/C/A/P/NE/P/NE/P/P/NE/NE/NE/P/P/P | `PARCIAL` | Ação GPS existe; permissões, precisão e falha não. |
| `PROD-REQ-015` | NA/C/C/C/NA/NA/C/NA/NA/NA/NA/NA/C/C/C/NA | `COMPLETO_NO_ESCOPO_DA_FONTE` | Declaração histórica de fora do MVP é suficiente no próprio escopo. |
| `PROD-REQ-016` | NA/C/C/C/NA/NA/C/NA/NA/NA/NA/NA/C/C/C/NA | `COMPLETO_NO_ESCOPO_DA_FONTE` | Exclusão futura das camadas está claramente delimitada. |
| `PROD-REQ-017` | P/C/A/P/A/NE/A/NE/P/P/NE/NE/NE/P/NE/P | `AMBIGUO` | Não se sabe se é tela adicional, painel ou estado. |
| `PROD-REQ-018` | P/P/A/P/A/NE/A/NE/P/P/NE/NE/NE/P/NE/P | `AMBIGUO` | Possibilidade de IA/mapa sem fluxo ou fase. |
| `PROD-REQ-019` | C/C/C/P/P/NE/C/NE/P/P/NE/NE/NE/C/P/P | `PARCIAL` | Estrutura modular é proposta, sem regras de navegação/retomada. |
| `PROD-REQ-020` | C/C/C/P/P/NE/C/NE/C/P/NE/NE/P/P/P/C | `PARCIAL` | Dados nomeados, contrato de campos e validade incompleto. |
| `PROD-REQ-021` | C/C/C/P/P/NE/C/NE/C/P/NE/NE/P/P/P/C | `PARCIAL` | Dados nomeados, critérios científicos/validação incompletos. |
| `PROD-REQ-022` | C/C/C/P/P/NE/C/NE/C/P/NE/NE/P/P/P/C | `PARCIAL` | Dados nomeados, equivalências e validação incompletas. |
| `PROD-REQ-023` | C/C/C/P/P/NE/C/NE/C/C/A/NE/P/C/C/C | `PARCIAL` | Cálculo e saída existem; mínimos, erros e regra validada faltam. |
| `PROD-REQ-024` | C/C/C/C/P/NE/C/NE/P/C/NE/NE/P/C/C/C | `PARCIAL` | Saídas claras, contrato de insuficiência/precisão ausente. |
| `PROD-REQ-025` | P/C/C/P/P/NE/C/NE/P/C/NE/NE/P/P/NE/C | `PARCIAL` | Recomendações aparecem, sem regra de derivação. |
| `PROD-REQ-026` | P/P/A/NE/A/NE/A/NE/NE/A/NE/NE/NE/P/NE/C | `AMBIGUO` | Assistência por IA não tem fronteira ou supervisão. |
| `PROD-REQ-027` | NA/C/C/C/C/NA/C/NA/NA/NA/NA/NA/C/C/C/NA | `COMPLETO_NO_ESCOPO_DA_FONTE` | As cinco telas históricas estão enumeradas e refletidas. |
| `PROD-REQ-028` | C/C/C/P/P/NE/C/NE/C/P/NE/NE/NE/C/C/P | `PARCIAL` | Entrada é desenhada; contrato de autenticação ausente. |
| `PROD-REQ-029` | C/P/P/C/NE/NE/NE/NE/NE/NE/NE/NE/NE/NE/P/NE | `NAO_ESPECIFICADO` | Rótulo não descreve requisito ou fluxo. |
| `PROD-REQ-030` | C/P/P/NE/NE/NE/NE/NE/NE/NE/NE/NE/NE/NE/P/NE | `NAO_ESPECIFICADO` | Rótulo não define conta, dados ou resultado. |
| `PROD-REQ-031` | C/P/P/C/NE/NE/NE/NE/NE/NE/NE/NE/NE/NE/P/NE | `NAO_ESPECIFICADO` | Menu não define destinos nem permissões. |
| `PROD-REQ-032` | C/C/C/P/P/NE/C/NE/C/P/NE/NE/P/C/C/P | `PARCIAL` | Aceite básico existe; validação, erro e confirmação faltam. |
| `PROD-REQ-033` | C/C/C/P/P/NE/C/NE/C/P/NE/NE/P/C/C/C | `PARCIAL` | Grupos aceitos, mas escopo territorial e validações faltam. |
| `PROD-REQ-034` | C/C/C/P/P/NE/P/NE/C/P/NE/NE/NE/P/C/C | `PARCIAL` | Gatilho explícito; estados de processamento ausentes. |
| `PROD-REQ-035` | C/C/C/C/P/NE/C/NE/P/C/NE/NE/P/P/C/C | `PARCIAL` | Componentes aparecem; significado/precisão não. |
| `PROD-REQ-036` | C/C/C/C/P/NE/C/NE/C/C/NE/NE/P/C/C/P | `PARCIAL` | Persistência/reflexo estão descritos, falhas não. |
| `PROD-REQ-037` | C/C/C/C/C/NE/C/NE/NA/NA/NE/NE/NE/P/C/NA | `PARCIAL` | Navegação explícita; estado não salvo é ausente. |
| `PROD-REQ-038` | C/C/C/P/P/NE/C/NE/P/P/NE/NE/NE/P/P/P | `PARCIAL` | Funções listadas, requisitos de qualidade/erro ausentes. |
| `PROD-REQ-039` | C/C/C/C/P/P/C/P/P/P/NE/NE/NE/C/C/P | `PARCIAL` | Permissões gerais existem; escopo e aplicação por tela não. |
| `PROD-REQ-040` | C/C/C/C/P/P/C/P/P/P/NE/NE/NE/C/C/P | `PARCIAL` | Permissões básicas existem; vínculo/convite não. |
| `PROD-REQ-041` | C/C/A/A/A/NE/A/A/P/P/NE/NE/NE/C/C/P | `AMBIGUO` | “Própria área” não define propriedade ou participação. |
| `PROD-REQ-042` | NA/C/C/C/P/NE/C/NE/P/P/NE/NE/NE/C/C/P | `PARCIAL` | Entidade mínima sem atributos/identidade/ciclo. |
| `PROD-REQ-043` | NA/C/C/C/P/NE/C/NE/C/P/NE/NE/P/C/C/P | `PARCIAL` | Campos mínimos existem; relações/ciclo faltam. |
| `PROD-REQ-044` | NA/C/C/C/P/NE/C/NE/P/P/NE/NE/NE/C/C/P | `PARCIAL` | Rodada é definida brevemente; vínculos e ciclo não. |
| `PROD-REQ-045` | NA/C/C/C/P/NE/C/NE/C/P/NE/NE/P/C/C/C | `PARCIAL` | Conteúdo nomeado; relação apenas implícita. |
| `PROD-REQ-046` | NA/C/C/C/P/NE/C/NE/C/P/NE/NE/P/C/C/C | `PARCIAL` | Conteúdo nomeado; relação apenas implícita. |
| `PROD-REQ-047` | NA/C/C/C/P/NE/C/NE/C/P/NE/NE/P/C/C/C | `PARCIAL` | Conteúdo nomeado; relação apenas implícita. |
| `PROD-REQ-048` | NA/C/C/C/P/NE/C/NE/C/C/NE/NE/P/C/C/C | `PARCIAL` | Conteúdo mínimo existe; versão/ciclo/relação faltam. |
| `PROD-REQ-049` | NA/C/C/C/P/NE/C/NE/P/P/NE/NE/NE/C/C/P | `PARCIAL` | Entidade existe; regras e ciclo não. |
| `PROD-REQ-050` | P/C/C/C/P/NE/C/NE/C/C/NE/NE/P/C/C/C | `PARCIAL` | Persistência da versão é explícita; formato/governança não. |
| `PROD-REQ-051` | P/C/C/P/P/NE/C/NE/C/C/P/NE/P/C/C/C | `PARCIAL` | Entregas mínimas listadas; valores e autoridade ausentes. |
| `PROD-REQ-052` | P/C/A/C/A/NE/A/NE/P/P/A/NE/NE/C/C/C | `AMBIGUO` | Pesos propostos, não validados; quarta dimensão imprecisa. |
| `PROD-REQ-053` | P/C/C/C/P/NE/C/NE/P/P/NE/NE/NA/C/C/C | `COMPLETO_NO_ESCOPO_DA_FONTE` | Proposta futura é delimitada como pós-campo, sem validar o método. |
| `PROD-REQ-054` | C/C/C/C/C/NE/C/NE/C/C/P/NE/C/P/C/C | `PARCIAL` | Cenário principal existe; alternativas e precisão faltam. |
| `PROD-REQ-055` | NE/P/P/P/NE/NE/NE/NE/P/P/NE/NE/NE/P/C/P | `NAO_ESPECIFICADO` | Instrução pede critérios que não são plenamente formulados. |
| `PROD-REQ-056` | C/C/C/C/P/NE/C/NE/C/P/A/NE/NE/C/P/P | `PARCIAL` | Resultado mínimo claro; métrica e recuperação ausentes. |
| `PROD-REQ-057` | C/C/C/C/P/NE/C/NE/C/P/NE/NE/NE/P/P/P | `PARCIAL` | Estratégia proposta sem contrato de sincronização. |
| `PROD-REQ-058` | P/C/C/P/P/NE/A/NE/P/P/NE/NE/NE/C/P/C | `PARCIAL` | Qualidades declaradas sem critérios mensuráveis. |
| `PROD-REQ-059` | P/C/C/C/P/NE/C/NE/C/C/NE/NE/P/C/P/C | `PARCIAL` | Trilha mínima explícita; retenção/acesso/privacidade faltam. |
| `PROD-REQ-060` | C/C/C/C/P/NE/A/NE/P/C/NE/NE/NE/C/P/C | `PARCIAL` | Público e resultado são indicados; teste de compreensão não. |

### Síntese quantitativa dos requisitos

| Tipo | Quantidade |
|---|---:|
| `FUNCIONAL` | 19 |
| `REGRA_DE_NEGOCIO` | 1 |
| `PAPEL_OU_PERMISSAO` | 3 |
| `DADO` | 14 |
| `UX_OU_FLUXO` | 6 |
| `INTEGRACAO` | 1 |
| `NAO_FUNCIONAL` | 4 |
| `RESTRICAO` | 2 |
| `CRITERIO_DE_ACEITACAO` | 2 |
| `FORA_DE_ESCOPO` | 2 |
| `PROPOSTA` | 6 |
| `NAO_CLASSIFICAVEL` | 0 |
| **Total** | **60** |

| Suficiência global | Quantidade |
|---|---:|
| `COMPLETO_NO_ESCOPO_DA_FONTE` | 4 |
| `PARCIAL` | 45 |
| `AMBIGUO` | 7 |
| `NAO_ESPECIFICADO` | 4 |
| `NAO_APLICAVEL` | 0 |
| **Total** | **60** |

| Classificação da informação | Quantidade |
|---|---:|
| `FATO_DOCUMENTADO` | 51 |
| `PROPOSTA` | 6 |
| `INFERENCIA` | 3 |
| **Total** | **60** |

| Estado de aprovação | Quantidade |
|---|---:|
| `NAO_ESPECIFICADO` | 60 |
| `APROVADO_COM_ORIGEM_REGISTRADA` | 0 |
| **Total** | **60** |

Os quatro itens completos são apenas declarações de escopo/fase documentalmente fechadas (`PROD-REQ-015`, `016`, `027`, `053`). Essa suficiência não aprova conteúdo, inclusive a proposta futura de `PROD-REQ-053`.

## Inventário de atores e papéis

| ID | Nome literal; termos relacionados | Fonte/localizador | Descrição e escopo | Ações/permissões | Restrições/objetos | Relações | Aprovação | Ambiguidades e pendência |
|---|---|---|---|---|---|---|---|---|
| `ROLE-001` | “Usuário” | 004:L71,L200,L226; 014:L8,L321 | Ator humano genérico; escopo global/contextual não especificado. | marcar área, inserir coordenadas; no wireframe, navegar e operar controles por `INFERENCIA` | autorização não aplicada às telas; objetos Área, Diagnóstico, Resultado, Mapa | termo geral pode abranger outros papéis, sem equivalência declarada | `NAO_ESPECIFICADO` | relação com conta, assinante, membro e perfis; `PD-015` |
| `ROLE-002` | “Administrador/Técnico (IFMA/HidroFlorestas)” | 004:L221-L225 | Papel composto do MVP; global ou contextual não especificado. | cria/edita áreas, lança análises, vê todas as áreas, exporta se houver | nenhuma restrição declarada; acesso a todas as áreas | relação entre Administrador e Técnico não definida | `NAO_ESPECIFICADO` | admin global ou local; técnico como papel ou profissão; `PD-003`, `PD-015`, `PD-016` |
| `ROLE-003` | “Usuário de Campo” | 004:L221-L226 | Papel do MVP ligado a operação de campo; escopo contextual não especificado. | cadastra área, insere dados, vê resultado e histórico da própria área | histórico limitado à “própria área”; demais restrições ausentes | parentético associa agricultor/liderança/técnico parceiro sem declarar equivalência | `NAO_ESPECIFICADO` | propriedade/participação/convite; `PD-015`, `PD-016` |
| `ROLE-004` | “agricultor” | 004:L225 | Termo entre parênteses relacionado a Usuário de Campo. | não especificado além das ações do rótulo composto, cuja herança é `INFERENCIA` | não especificado | possível exemplo, sinônimo ou subtipo de `ROLE-003` | `NAO_ESPECIFICADO` | natureza da relação; `PD-015` |
| `ROLE-005` | “liderança” | 004:L225 | Termo entre parênteses relacionado a Usuário de Campo. | não especificado além de possível herança inferida | não especificado | possível exemplo, sinônimo ou subtipo de `ROLE-003` | `NAO_ESPECIFICADO` | contexto comunitário/organizacional não definido; `PD-015` |
| `ROLE-006` | “técnico parceiro” | 004:L225 | Termo entre parênteses relacionado a Usuário de Campo. | não especificado além de possível herança inferida | não especificado | pode sobrepor “Técnico” de `ROLE-002`, sem regra | `NAO_ESPECIFICADO` | papel global/local, vínculo e sobreposição; `PD-015`, `PD-016` |
| `ROLE-007` | “IFMA/HidroFlorestas” | 004:L223 | Qualificador institucional parentético de Administrador/Técnico, não papel claramente definido. | não especificado | não especificado | associado a `ROLE-002` | `NAO_ESPECIFICADO` | se representa organização, equipe, origem do papel ou escopo de administração; `PD-015` |
| `ROLE-008` | “plataforma” / “sistema” | 004:L5,L153-L166,L263; 014:L329-L345 | Ator sistêmico analítico. | processa, calcula, gera/exibe/salva resultados e aceita dados | regras de falha e autorização ausentes | atende ações iniciadas pelos atores humanos | não aplicável como aprovação de papel humano | comportamento distribuído; responsabilidades entre plataforma e algoritmo não delimitadas |
| `ROLE-009` | “Assistente de IA” / “IA contextual” | 004:L99-L106,L173 | Ator sistêmico proposto. | contextualizar análise e assistir recomendações | supervisão, dados, restrições e fase ausentes | relacionado a mapa e recomendações | `NAO_ESPECIFICADO`; `PROPOSTA` | não localizado no wireframe; `PD-003`, `PD-005` |

Termos não localizados nas fontes: `assinante`, `subscriber`, `organização`, `organization`, `laboratório`, `membro`, `proprietário` como papel e `conta de cobrança`. “Criar conta” existe apenas como rótulo de interface; não define um papel. Essas ausências não criam requisito histórico.

## Modelo de domínio histórico implícito

### Conceitos

| ID | Nome literal | Definição/atributos mencionados | Identidade e ciclo de vida | Fonte/localizador | Requisitos/telas | Classificação | Ambiguidade |
|---|---|---|---|---|---|---|---|
| `DOM-CON-001` | `User` / usuário | Entidade mínima; nenhum atributo declarado em 004; email/senha no login de 014. | identidade, criação, ativação, cancelamento e exclusão não especificados | 004:L219-L247; 014:L28-L60 | `PROD-REQ-028`–`030`, `039`–`042`; `SCREEN-001` | `FATO_DOCUMENTADO` | User versus conta versus perfil; `PD-015` |
| `DOM-CON-002` | conta | Somente ação/rótulo “Criar conta”. | identidade e ciclo totalmente não especificados | 014:L49-L52 | `PROD-REQ-030`; `SCREEN-001` | `INFERENCIA` a partir da expectativa de tela | pessoa, credencial, assinatura ou organização não definidos |
| `DOM-CON-003` | papel/perfil | Dois papéis simples propostos para MVP, mais termos associados. | atribuição, mudança, coexistência e revogação não especificadas | 004:L219-L226 | `PROD-REQ-039`–`041` | `FATO_DOCUMENTADO` | global/contextual, técnico duplicado e admin indefinido; `PD-015` |
| `DOM-CON-004` | `Area` / área | nome, município, geometria/coordenadas, tamanho, uso; wireframe acrescenta estado. | criação e edição citadas; arquivamento/exclusão/transferência ausentes | 004:L69-L76,L114-L123,L236-L247; 014:L112-L158 | `PROD-REQ-010`–`013`, `032`, `043`; `SCREEN-003` | `FATO_DOCUMENTADO` | propriedade, compartilhamento, limites e equivalência com propriedade; `PD-014`, `PD-016` |
| `DOM-CON-005` | propriedade | Localização de propriedades, polígono da propriedade e contexto de exemplos. | identidade/ciclo não especificados | 004:L58-L60,L75; 014:L254 | `PROD-REQ-009`, `012`, `024` | `FATO_DOCUMENTADO` | equivalência com Área é `INFERENCIA`, não declaração |
| `DOM-CON-006` | geometria | ponto/polígono, coordenadas, mapa; shapefile futuro. | validação, versão e alteração não especificadas | 004:L69-L82,L209; 014:L146-L155,L280-L295 | `PROD-REQ-010`, `012`, `014`, `015`, `038`; `SCREEN-010` | `FATO_DOCUMENTADO` | se ponto e polígono coexistem; CRS, precisão e validade ausentes |
| `DOM-CON-007` | ponto de coleta | Ponto a registrar na tela de cadastro. | identidade, quantidade, edição e exclusão ausentes | 004:L69-L76 | `PROD-REQ-013` | `FATO_DOCUMENTADO` | relação com Área e Survey não declarada |
| `DOM-CON-008` | município | Campo básico da área; wireframe acrescenta Estado. | identidade/referência territorial não especificadas | 004:L118-L123,L241; 014:L127-L134 | `PROD-REQ-010`, `011`, `043`; `SCREEN-003` | `FATO_DOCUMENTADO` | validação e hierarquia territorial ausentes |
| `DOM-CON-009` | tipo de uso da terra | Dado básico/atributo de Área e campo com seis opções no wireframe. | mudança temporal e predominância não especificadas | 004:L118-L123,L241; 014:L136-L143 | `PROD-REQ-010`, `021`, `043`; `SCREEN-003` | `FATO_DOCUMENTADO` | relação com campo ambiental e categoria científica não resolvida |
| `DOM-CON-010` | `Survey/Diagnóstico` / análise | Uma “rodada” de coleta; “diagnóstico” também nomeia resultado/histórico. | criação/processamento/salvamento citados; rascunho, edição, cancelamento e exclusão ausentes | 004:L40,L228-L247; 014:L82,L106,L243-L278 | `PROD-REQ-006`, `023`, `036`, `044`; `SCREEN-005`, `009` | `FATO_DOCUMENTADO` | Survey, análise, rodada e diagnóstico podem não ser equivalentes |
| `DOM-CON-011` | `WaterData` / dados hídricos | fonte, nascente, poço, disponibilidade/sazonalidade e salinização no wireframe. | coleta citada; identidade/ciclo não | 004:L124-L133,L244; 014:L164-L190 | `PROD-REQ-020`, `046`; `SCREEN-011` | `FATO_DOCUMENTADO` | composição e obrigatoriedade divergem/estão incompletas |
| `DOM-CON-012` | `SoilData` / dados do solo | tipo/textura, infiltração, compactação, erosão e solo exposto. | coleta citada; identidade/ciclo não | 004:L134-L141,L243; 014:L192-L216 | `PROD-REQ-021`, `045`; `SCREEN-012` | `FATO_DOCUMENTADO` | tipo/textura e critérios não reconciliados |
| `DOM-CON-013` | `VegetationData` / vegetação/paisagem | cobertura, fragmentação, APP/mata ciliar, degradação. | coleta citada; identidade/ciclo não | 004:L142-L148,L245; 014:L218-L240 | `PROD-REQ-022`, `047`; `SCREEN-013` | `FATO_DOCUMENTADO` | APP/mata ciliar e classes não normalizadas |
| `DOM-CON-014` | dado ambiental | Termo agregado para dados coletados em campo e grupos hídrico/solo/vegetação. | coleta/processamento citados; proveniência/QC ausentes | 004:L9,L89,L203,L232; 014:L21,L160 | `PROD-REQ-002`, `020`–`023`, `033` | `FATO_DOCUMENTADO` | fronteira com território e dados derivados |
| `DOM-CON-015` | `IHFRResult` / resultado | valor, classe, componentes, versão; tela acrescenta interpretação/recomendações. | gerado e salvo; edição, invalidação, recálculo e exclusão ausentes | 004:L158-L163,L246-L249; 014:L243-L278 | `PROD-REQ-024`, `035`, `036`, `048`, `050`; `SCREEN-005` | `FATO_DOCUMENTADO` | resultado versus diagnóstico; imutabilidade/versionamento ausentes |
| `DOM-CON-016` | IHFR | Índice/valor de risco, núcleo do processamento histórico. | versões v0.1/v0.2 mencionadas; vigência não aprovada | 004:L18,L149-L163,L251-L268; 014:L253-L265,L339-L345 | `PROD-REQ-003`, `023`, `024`, `051`–`053`; `SCREEN-002`, `005` | `FATO_DOCUMENTADO` | fórmula e autoridade dependem de `PD-002` |
| `DOM-CON-017` | componente/dimensão do índice | Água, Solo, Vegetação, Território na tela de resultado; proposta usa “contexto da área”. | ciclo não aplicável; composição/versionamento não aprovados | 004:L267; 014:L260-L265 | `PROD-REQ-035`, `052`; `SCREEN-014` | `FATO_DOCUMENTADO` + `INFERENCIA` comparativa | território/contexto e pesos; `DOC-010`, `PD-002` |
| `DOM-CON-018` | classe de risco | baixo, moderado, alto, crítico; cores associadas. | calculada com resultado; alteração/reclassificação não especificadas | 004:L18-L23,L60-L67; 014:L100-L104,L257-L258,L300-L307 | `PROD-REQ-003`, `009`, `024`; `SCREEN-002`, `005`, `008` | `FATO_DOCUMENTADO` | “médio” em 004 versus “moderado” em 014; regra científica pendente |
| `DOM-CON-019` | interpretação / diagnóstico ambiental | Texto compreensível que explica condição/resultado. | gerado/exibido; revisão e autoria ausentes | 004:L158-L163,L263; 014:L245-L268,L335-L342 | `PROD-REQ-024`, `060`; `SCREEN-015` | `FATO_DOCUMENTADO` | interpretação, explicação e diagnóstico podem ter escopos distintos |
| `DOM-CON-020` | recomendação técnica | Restauração, SAF, manejo, intervenção e itens de exemplo. | gerada/exibida; aprovação, atualização e responsabilidade ausentes | 004:L164-L173; 014:L270-L274 | `PROD-REQ-025`, `026`; `SCREEN-016` | `FATO_DOCUMENTADO` | regra científica, IA e responsabilidade técnica ausentes |
| `DOM-CON-021` | `Alerts` / alerta técnico | prioridade de restauração/risco elevado. | geração e exibição sugeridas; reconhecimento/encerramento ausentes | 004:L43-L47,L247 | `PROD-REQ-007`, `049` | `FATO_DOCUMENTADO` | destinatário, regra e estado não definidos |
| `DOM-CON-022` | histórico de análises | lista de diagnósticos e evolução do IHFR; wireframe lista exemplos. | inclusão após salvar; retenção/remoção/ordem ausentes | 004:L38-L42,L228-L234; 014:L106-L109,L313-L317 | `PROD-REQ-006`, `036`, `041`; `SCREEN-009` | `FATO_DOCUMENTADO` | escopo por usuário/área e evolução não operacionalizados |
| `DOM-CON-023` | versão do algoritmo | Valor a guardar em `IHFRResult`; `IHFR v0.1` em 014. | registro com resultado; governança e substituição ausentes | 004:L246-L249,L267-L268; 014:L344-L345 | `PROD-REQ-050`–`053`, `058`, `059` | `FATO_DOCUMENTADO` | versão científica, algorítmica e documental não distinguidas |
| `DOM-CON-024` | mapa territorial | Componente geoespacial central que exibe/captura áreas e resultados. | atualização e fontes de camada ausentes | 004:L48-L106; 014:L98-L104,L146-L155,L280-L307 | `PROD-REQ-008`, `009`, `012`, `014`–`018`, `038`; `SCREEN-008`, `010` | `FATO_DOCUMENTADO` | mapa geral, cadastro e análise podem ser instâncias distintas |
| `DOM-CON-025` | rascunho local | Estado/artefato proposto para baixa conectividade e sincronização. | criar localmente e sincronizar depois; conflitos/expiração ausentes | 004:L288 | `PROD-REQ-056`, `057` | `PROPOSTA` | segurança, propriedade, retenção e escopo de dados não definidos |

### Relações históricas implícitas

Cardinalidade, obrigatoriedade, propriedade, compartilhamento, transferência e exclusão/arquivamento estão `NAO_ESPECIFICADO` em todas as relações, salvo a restrição textual indicada em `DOM-REL-008`. Nenhuma cardinalidade foi inventada.

| ID | Origem → relação → destino | Fonte/localizador | Declaração/cardinalidade | Obrigatoriedade/propriedade/ciclo | Classificação |
|---|---|---|---|---|---|
| `DOM-REL-001` | `User` → acessa por credenciais → plataforma | 014:L28-L60 | login com email/senha; cardinalidade não declarada | todos não especificados | `INFERENCIA` relacional apoiada em expectativa de tela |
| `DOM-REL-002` | Administrador/Técnico → cria/edita → Área | 004:L223-L225 | explícita; cardinalidade não declarada | propriedade/transferência/exclusão não especificadas | `FATO_DOCUMENTADO` |
| `DOM-REL-003` | Administrador/Técnico → lança → análise/diagnóstico | 004:L223-L225 | explícita | pré-condições/ciclo não especificados | `FATO_DOCUMENTADO` |
| `DOM-REL-004` | Administrador/Técnico → vê → todas as Áreas | 004:L223-L225 | explícita | “todas” não delimita organização/território | `FATO_DOCUMENTADO` |
| `DOM-REL-005` | Usuário de Campo → cadastra → Área | 004:L225-L226 | explícita | propriedade resultante não declarada | `FATO_DOCUMENTADO` |
| `DOM-REL-006` | Usuário de Campo → insere → dados ambientais | 004:L225-L226 | explícita | relação com área/diagnóstico é apenas implícita | `FATO_DOCUMENTADO` |
| `DOM-REL-007` | Usuário de Campo → vê → resultado | 004:L225-L226 | explícita | escopo do resultado não declarado | `FATO_DOCUMENTADO` |
| `DOM-REL-008` | Usuário de Campo → vê histórico → “própria área” | 004:L225-L226 | restrição textual explícita; cardinalidade não | “própria” sugere propriedade/vínculo, mas sem definição | `FATO_DOCUMENTADO` + `AMBIGUO` |
| `DOM-REL-009` | Área → é representada por → dados básicos/geometria | 004:L114-L123,L240-L242; 014:L112-L158 | atributos agrupados; cardinalidade não | obrigatoriedade/alteração não especificadas | `FATO_DOCUMENTADO` |
| `DOM-REL-010` | Área → recebe/é contexto de → Survey/Diagnóstico | 004:L182-L193,L228-L247 | sequência e entidades sugerem relação; não declarada formalmente | cardinalidade/propriedade/ciclo não especificados | `INFERENCIA` |
| `DOM-REL-011` | Survey/Diagnóstico → reúne → WaterData | 004:L184-L192,L242-L245 | relação deduzida do fluxo/entidades | todos não especificados | `INFERENCIA` |
| `DOM-REL-012` | Survey/Diagnóstico → reúne → SoilData | 004:L184-L192,L242-L245 | idem | todos não especificados | `INFERENCIA` |
| `DOM-REL-013` | Survey/Diagnóstico → reúne → VegetationData | 004:L184-L192,L242-L245 | idem | todos não especificados | `INFERENCIA` |
| `DOM-REL-014` | Survey/Diagnóstico → produz → IHFRResult | 004:L149-L163,L228-L247 | fluxo explícito, relação de entidade inferida | todos não especificados | `FATO_DOCUMENTADO` para fluxo + `INFERENCIA` relacional |
| `DOM-REL-015` | IHFRResult → contém → valor/classe/componentes/versão | 004:L246-L249; 014:L253-L265,L344-L345 | atributos explícitos | obrigatoriedade/imutabilidade não especificadas | `FATO_DOCUMENTADO` |
| `DOM-REL-016` | IHFRResult/Diagnóstico → entra em → histórico | 004:L228-L234; 014:L276,L313-L317 | salvar e listar são explícitos | retenção/remoção não especificadas | `FATO_DOCUMENTADO` |
| `DOM-REL-017` | Alerta → sinaliza → Área/risco/prioridade | 004:L43-L47,L247 | associação temática explícita, relação de entidade inferida | ciclo e destinatário não especificados | `INFERENCIA` |
| `DOM-REL-018` | Mapa → exibe → Áreas/propriedades/resultados | 004:L54-L90; 014:L98-L104,L280-L299 | explícita | agregação/visibilidade não especificadas | `FATO_DOCUMENTADO` |
| `DOM-REL-019` | Resultado/diagnóstico → fundamenta → recomendações | 004:L149-L173; 014:L266-L274 | sequência explícita; regra de derivação não | autoria/revisão/ciclo não especificados | `INFERENCIA` |
| `DOM-REL-020` | User → possivelmente cria/possui → conta | 014:L49-L52 | apenas rótulo “Criar conta”; relação não declarada | todos não especificados | `INFERENCIA` |

### Regras de negócio declaradas ou candidatas

| ID | Enunciado; condição → efeito | Ator/objeto | Exceção | Fonte/localizador | Requisito | Aprovação | Lacuna |
|---|---|---|---|---|---|---|---|
| `BUS-RULE-001` | No MVP histórico → conjunto principal limitado a cinco telas. | produto/UX; telas | subestados/componentes não contados | 004:L196-L212 | `PROD-REQ-027` | `NAO_ESPECIFICADO` | análise territorial/IA e destinos do menu não reconciliados |
| `BUS-RULE-002` | Classe IHFR → verde/amarelo/laranja/vermelho para baixo/moderado/alto/crítico. | sistema/mapa; classe | 004 usa “médio” no exemplo; regra científica pendente | 004:L60-L67; 014:L300-L307 | `PROD-REQ-009`, `038` | `NAO_ESPECIFICADO` | acessibilidade além de cor e classe insuficiente ausentes |
| `BUS-RULE-003` | Perfil Administrador/Técnico → criar/editar áreas, lançar análises e ver todas. | `ROLE-002`; Área/Diagnóstico | exportar somente “se houver” | 004:L223-L225 | `PROD-REQ-039` | `NAO_ESPECIFICADO` | escopo do admin e controles de tela ausentes |
| `BUS-RULE-004` | Perfil Usuário de Campo → cadastrar área, inserir dados e ver resultado. | `ROLE-003`; Área/Dados/Resultado | não especificado | 004:L225-L226 | `PROD-REQ-040` | `NAO_ESPECIFICADO` | convite/vínculo/edição ausentes |
| `BUS-RULE-005` | Usuário de Campo → histórico limitado à “própria área”. | `ROLE-003`; Histórico/Área | “própria” não definido | 004:L225-L226 | `PROD-REQ-041` | `NAO_ESPECIFICADO` | propriedade, compartilhamento e multiplicidade ausentes |
| `BUS-RULE-006` | Após inserir dados → sistema processa e produz IHFR, classe e interpretação. | sistema; Diagnóstico/Resultado | dados insuficientes/erro não especificados | 004:L149-L163,L228-L234 | `PROD-REQ-023`, `024` | `NAO_ESPECIFICADO` | depende de `PD-002` e contrato ainda histórico |
| `BUS-RULE-007` | Ao salvar resultado → diagnóstico integra histórico e aparece no dashboard. | usuário/sistema; Resultado/Histórico | falha/duplicidade não especificadas | 004:L228-L234; 014:L276,L313-L317 | `PROD-REQ-036` | `NAO_ESPECIFICADO` | confirmação, idempotência e atualização ausentes |
| `BUS-RULE-008` | Todo resultado deve registrar versão do algoritmo (`INFERENCIA` de abrangência). | sistema; IHFRResult | não especificado | 004:L246-L249; 014:L344-L345 | `PROD-REQ-050` | `NAO_ESPECIFICADO` | formato e governança de versão ausentes |
| `BUS-RULE-009` | Shapefile e camadas avançadas → fora do MVP/futuro. | produto; mapa | não especificado | 004:L214-L218 | `PROD-REQ-015`, `016` | `NAO_ESPECIFICADO` | cronologia futura ausente |
| `BUS-RULE-010` | Se há ao menos um diagnóstico salvo → dashboard mostra última classe e área colorida. | usuário/sistema; Dashboard | estado sem diagnóstico não especificado | 004:L282; 014:L313-L317 | `PROD-REQ-054` | `NAO_ESPECIFICADO` | qual área/última por quê e atualização ausentes |
| `BUS-RULE-011` | Em offline/baixa conectividade → no mínimo não perder dados. | sistema; dados em coleta | duração/limite não especificados | 004:L288 | `PROD-REQ-056` | `NAO_ESPECIFICADO` | persistência, recuperação e teste ausentes |
| `BUS-RULE-012` | Para auditabilidade → guardar entradas, versão e resultado. | sistema; trilha | retenção/acesso não especificados | 004:L289-L290 | `PROD-REQ-059` | `NAO_ESPECIFICADO` | privacidade, integridade e proveniência ausentes |
| `BUS-RULE-013` | Resultados/algoritmos → simples, transparentes, auditáveis e compreensíveis. | sistema/equipe; cálculo/resultado | métricas não especificadas | 004:L286-L291 | `PROD-REQ-058`, `060` | `NAO_ESPECIFICADO` | critérios de verificação, linguagem e acessibilidade ausentes |

Quantidades do domínio histórico: 25 conceitos, 20 relações e 13 regras. Esses itens descrevem somente a estrutura implícita encontrada; não formam um modelo normativo.

## Fluxos de usuário

| ID | Nome/objetivo | Ator e gatilho | Pré-condições | Etapas e decisões localizadas | Exceções | Resultado | Requisitos/conceitos/telas | Fonte/localizador | Cobertura e ambiguidade |
|---|---|---|---|---|---|---|---|---|---|
| `FLOW-001` | Jornada principal do MVP: chegar ao resultado. | usuário; início no Login | conta/credenciais e demais pré-condições não especificadas | Login → Dashboard → Cadastro da Área → Inserção de Dados → Processamento → Resultado. Sem decisões explícitas. | nenhuma localizada | resultado IHFR exibido | `PROD-REQ-027`; `DOM-CON-001`, `004`, `010`, `015`; `SCREEN-001`–`005` | 004:L175-L194,L228-L234; 014:L12-L26 | `EXPLICITO`; salvar/retornar não integra o diagrama principal |
| `FLOW-002` | Autenticar e acessar dashboard. | `ROLE-001`; ação Entrar | email/senha; existência da conta não declarada | informar email → informar senha → Entrar; destino dashboard é explícito no fluxo geral | credencial inválida, bloqueio, sessão e logout não localizados | dashboard acessível | `PROD-REQ-028`; `DOM-CON-001`, `002`; `SCREEN-001`, `002` | 004:L228-L230; 014:L15-L18,L28-L60 | `PARCIAL`; contrato de autenticação ausente |
| `FLOW-003` | Consultar inteligência territorial no dashboard. | usuário; abrir dashboard | diagnóstico salvo apenas para estado populado | visualizar indicadores, mapa, histórico e possivelmente alertas; decisões/filtros não localizados | estado vazio, carregamento e erro ausentes | visão de áreas/resultados/histórico | `PROD-REQ-001`–`009`, `031`, `054`; `DOM-CON-015`, `018`, `021`, `022`, `024`; `SCREEN-002`, `006`–`009`, `017` | 004:L3-L67,L270-L282; 014:L62-L110,L311-L317 | `PARCIAL`; escopo de dados por papel não aplicado |
| `FLOW-004` | Cadastrar e salvar área. | usuário; “Cadastrar Área”/menu implícito | acesso à plataforma; autorização não aplicada | informar dados básicos → marcar ponto/desenhar polígono/capturar GPS → salvar área; escolha entre geometrias não definida | validação, duplicidade, GPS indisponível e erro de salvamento ausentes | Área registrada | `PROD-REQ-010`–`014`, `032`, `038`; `DOM-CON-004`, `006`, `008`, `009`, `023`; `SCREEN-003`, `010` | 004:L69-L82,L114-L123,L228-L232; 014:L112-L158,L319-L325 | `EXPLICITO` no núcleo; `PARCIAL` nos estados e decisões |
| `FLOW-005` | Inserir dados ambientais em módulos. | Usuário de Campo/usuário; iniciar diagnóstico | área existente é `INFERENCIA`, não declaração | preencher bloco hídrico → solo → vegetação; ordem visual existe, navegação/salvamento entre blocos não | ausência, inválido, rascunho e retorno não localizados | dados aceitos/prontos para cálculo | `PROD-REQ-019`–`022`, `033`; `DOM-CON-010`–`014`; `SCREEN-004`, `011`–`013` | 004:L108-L148,L228-L233; 014:L160-L240,L327-L334 | `PARCIAL`; módulo de identificação/território não aparece nesta tela |
| `FLOW-006` | Processar e calcular IHFR. | usuário/sistema; botão Calcular IHFR | dados inseridos; mínimo/validade não especificados | acionar cálculo → sistema processa → gera score/classe/interpretação; tela de processamento separada não existe | erro, insuficiência, progresso, cancelamento e repetição ausentes | `IHFRResult` | `PROD-REQ-023`, `034`, `050`–`053`; `DOM-CON-010`, `015`–`018`, `023`; `SCREEN-004`, `005` | 004:L149-L163,L228-L234,L251-L268; 014:L21-L25,L239-L240,L344-L345 | `EXPLICITO` no resultado; `PARCIAL` no contrato e estados |
| `FLOW-007` | Consultar, salvar resultado e retornar. | usuário; cálculo concluído | resultado disponível | ver score/classe/componentes/interpretação/recomendações → escolher salvar diagnóstico ou voltar ao dashboard; efeito de voltar sem salvar não definido | falha de salvamento, confirmação e descarte ausentes | diagnóstico salvo no histórico/dashboard ou navegação de retorno | `PROD-REQ-024`, `025`, `035`–`037`; `DOM-CON-015`, `019`, `020`, `022`; `SCREEN-005`, `014`–`016` | 004:L228-L234; 014:L243-L278,L335-L342 | `PARCIAL`; bifurcação explícita por botões, consequências incompletas |
| `FLOW-008` | Recuperar senha. | usuário; “Esqueceu senha?” | não especificadas | nenhuma etapa localizada | todas | não especificado | `PROD-REQ-029`; `DOM-CON-001`, `002`; `SCREEN-001` | 014:L49-L52 | `NAO_LOCALIZADO`; somente rótulo |
| `FLOW-009` | Criar conta. | usuário; “Criar conta” | não especificadas | nenhuma etapa localizada | todas | não especificado | `PROD-REQ-030`; `DOM-CON-001`, `002`; `SCREEN-001` | 014:L49-L52 | `NAO_LOCALIZADO`; somente rótulo |
| `FLOW-010` | Capturar GPS para cadastro. | usuário/dispositivo; ação GPS | permissões e sinal não especificados | acionar captura; resultado e edição não descritos | falha, recusa e baixa precisão ausentes | localização presumida por `INFERENCIA` | `PROD-REQ-014`, `038`; `DOM-CON-006`, `023`; `SCREEN-010` | 004:L78-L82; 014:L150-L155,L290-L295 | `PARCIAL`; integração e offline não definidos |

Síntese: 10 fluxos — 1 `EXPLICITO`, 7 `PARCIAL` (incluindo o núcleo explícito de cadastro) e 2 `NAO_LOCALIZADO`. Nenhum fluxo foi classificado como aprovado.

## Inventário de telas, estados e componentes

As cinco telas principais são também as cinco páginas históricas enumeradas; as contagens “páginas” e “telas” referem-se aos mesmos cinco itens e não devem ser somadas. Não foram localizados modal, variação responsiva ou tela separada de processamento.

### Conteúdo e comportamento

| ID | Natureza/nome literal | Ator aparente e objetivo | Fluxo/requisitos | Dados exibidos | Dados capturados | Ações/navegação | Fonte/localizador |
|---|---|---|---|---|---|---|---|
| `SCREEN-001` | `TELA_PRINCIPAL` / “TELA 1 — LOGIN” | usuário; permitir acesso | `FLOW-002`, `008`, `009`; `PROD-REQ-028`–`030` | marca/nome; links | email, senha | Entrar; Esqueceu senha?; Criar conta; destino dashboard pelo fluxo geral | 014:L28-L60 |
| `SCREEN-002` | `TELA_PRINCIPAL` / “TELA 2 — DASHBOARD” | usuário; painel territorial inicial | `FLOW-003`; `PROD-REQ-001`–`009`, `031`, `054` | IHFR/classe, indicadores, mapa, histórico | nenhum campo | navegação pelo menu; interações de mapa não detalhadas aqui | 014:L62-L110 |
| `SCREEN-003` | `TELA_PRINCIPAL` / “TELA 3 — CADASTRO DA ÁREA” | usuário; registrar área | `FLOW-004`; `PROD-REQ-010`–`014`, `032` | mapa, opções de uso | nome, município, estado, tamanho, uso, geometria/GPS | marcar ponto, desenhar polígono, capturar GPS, salvar área | 014:L112-L158 |
| `SCREEN-004` | `TELA_PRINCIPAL` / “TELA 4 — INSERÇÃO DE DADOS AMBIENTAIS” | usuário; coletar três grupos e iniciar cálculo | `FLOW-005`, `006`; `PROD-REQ-019`–`023`, `033`, `034` | opções/campos dos três blocos | dados hídricos, solo, vegetação | selecionar/preencher; Calcular IHFR | 014:L160-L240 |
| `SCREEN-005` | `TELA_PRINCIPAL` / “TELA 5 — RESULTADO DO IHFR” | usuário; apresentar diagnóstico | `FLOW-007`; `PROD-REQ-024`, `025`, `035`–`037` | área, score, classe, componentes, interpretação, recomendações | nenhum campo | Salvar diagnóstico; Voltar ao dashboard | 014:L243-L278 |
| `SCREEN-006` | `COMPONENTE_NAVEGACAO` / “MENU LATERAL” | usuário; acessar destinos | `FLOW-003`; `PROD-REQ-031` | Dashboard, Áreas, Novo Diagnóstico, Histórico, Configurações | nenhum | itens de navegação, destinos não detalhados | 014:L77-L85 |
| `SCREEN-007` | `PAINEL` / “Indicadores principais/ambientais” | usuário; resumir condição | `FLOW-003`; `PROD-REQ-003`, `004` | IHFR, classe, quatro indicadores | nenhum | nenhuma | 014:L86-L97 |
| `SCREEN-008` | `PAINEL` / “Mapa territorial” do dashboard | usuário; visualizar áreas por classe | `FLOW-003`; `PROD-REQ-008`, `009`, `038` | mapa e cores/classes | nenhum no painel descrito | zoom/navegação por seção geral do mapa | 014:L98-L104,L280-L307 |
| `SCREEN-009` | `PAINEL` / “Histórico de análises” | usuário; listar análises | `FLOW-003`, `007`; `PROD-REQ-006`, `036` | exemplos de áreas/scores | nenhum | seleção não especificada | 014:L106-L109,L313-L317 |
| `SCREEN-010` | `COMPONENTE_MAPA` / “Mapa da área” | usuário; delimitar/capturar área | `FLOW-004`, `010`; `PROD-REQ-012`, `014`, `038` | mapa | ponto, polígono, GPS | marcar, desenhar, capturar | 014:L146-L155,L290-L295 |
| `SCREEN-011` | `BLOCO_COMPONENTE` / “BLOCO 1 — DADOS HÍDRICOS” | usuário; coletar dados hídricos | `FLOW-005`; `PROD-REQ-020`, `033` | opções categóricas | fonte, nascente, profundidade, disponibilidade, salinização | selecionar/preencher | 014:L164-L190 |
| `SCREEN-012` | `BLOCO_COMPONENTE` / “BLOCO 2 — DADOS DO SOLO” | usuário; coletar dados do solo | `FLOW-005`; `PROD-REQ-021`, `033` | opções categóricas | tipo, infiltração, compactação, erosão, solo exposto | selecionar/preencher | 014:L192-L216 |
| `SCREEN-013` | `BLOCO_COMPONENTE` / “BLOCO 3 — VEGETAÇÃO E PAISAGEM” | usuário; coletar vegetação/paisagem | `FLOW-005`, `006`; `PROD-REQ-022`, `033`, `034` | opções categóricas | cobertura, fragmentação, APP/mata ciliar, degradação | selecionar/preencher; Calcular IHFR | 014:L218-L240 |
| `SCREEN-014` | `PAINEL` / “Componentes do índice” | usuário; explicar composição | `FLOW-007`; `PROD-REQ-035` | Água, Solo, Vegetação, Território e valores | nenhum | nenhuma | 014:L260-L265 |
| `SCREEN-015` | `PAINEL` / “Interpretação” | usuário; explicar resultado | `FLOW-007`; `PROD-REQ-024`, `060` | texto explicativo | nenhum | nenhuma | 014:L266-L268 |
| `SCREEN-016` | `PAINEL` / “Recomendações técnicas” | usuário; orientar ações | `FLOW-007`; `PROD-REQ-025`, `026` | lista de recomendações | nenhum | nenhuma | 014:L270-L274 |
| `SCREEN-017` | `ESTADO_CONDICIONAL` / dashboard com diagnóstico salvo | usuário; confirmar conteúdo populado | `FLOW-003`; `PROD-REQ-003`, `006`, `009`, `054` | IHFR, mapa/área, histórico | nenhum | abrir dashboard | 014:L311-L317; 004:L282 |

### Estados transversais, autorização e qualidade de UX

Em todos os itens, implementação é `NAO_AVALIADO` porque não houve comparação com código; aprovação é `NAO_ESPECIFICADO` porque nenhuma fonte registra autoridade ou aprovação. “NE” abaixo significa `NAO_ESPECIFICADO` na fonte, não uma recomendação de implementação.

| ID | Estado vazio | Carregamento | Erro | Confirmação | Autorização | Responsividade | Acessibilidade | Aprovação | Implementação | Lacuna específica |
|---|---|---|---|---|---|---|---|---|---|---|
| `SCREEN-001` | NE | NE | NE | NE | acesso é objetivo, regras NE | NE | NE | `NAO_ESPECIFICADO` | `NAO_AVALIADO` | sessão, logout, recuperação e criação de conta não especificados |
| `SCREEN-002` | NE | NE | NE | não aplicável aparente | visibilidade por papel NE | NE | NE | `NAO_ESPECIFICADO` | `NAO_AVALIADO` | dashboard sem diagnóstico e seleção de área ausentes |
| `SCREEN-003` | NE | NE | NE | NE após salvar | permissões por papel NE | NE | NE | `NAO_ESPECIFICADO` | `NAO_AVALIADO` | validação dos campos/geometria e falha GPS ausentes |
| `SCREEN-004` | NE | NE | NE | NE | permissões por papel NE | NE | NE | `NAO_ESPECIFICADO` | `NAO_AVALIADO` | obrigatoriedade, validação, rascunho e progresso ausentes |
| `SCREEN-005` | não aplicável aparente | NE | NE | NE após salvar/sair | acesso ao resultado NE | NE | NE | `NAO_ESPECIFICADO` | `NAO_AVALIADO` | insuficiência, precisão, salvamento e descarte ausentes |
| `SCREEN-006` | não aplicável | não aplicável | não aplicável | não aplicável | itens por papel NE | NE | NE | `NAO_ESPECIFICADO` | `NAO_AVALIADO` | destinos sem telas e estado ativo não especificado |
| `SCREEN-007` | NE | NE | NE | não aplicável | visibilidade NE | NE | NE | `NAO_ESPECIFICADO` | `NAO_AVALIADO` | unidade, período e explicação dos indicadores ausentes |
| `SCREEN-008` | NE | NE | NE | não aplicável | áreas visíveis por papel NE | NE | cor sem alternativa declarada | `NAO_ESPECIFICADO` | `NAO_AVALIADO` | legenda/seleção, sobreposição e alternativa à cor ausentes |
| `SCREEN-009` | NE | NE | NE | não aplicável | “própria área” não aplicada | NE | NE | `NAO_ESPECIFICADO` | `NAO_AVALIADO` | ordenação, filtros, seleção e escopo ausentes |
| `SCREEN-010` | NE | NE | NE | NE | criação/edição por papel NE | NE | interação não visual NE | `NAO_ESPECIFICADO` | `NAO_AVALIADO` | validade geométrica, precisão e conflito entre ferramentas ausentes |
| `SCREEN-011` | NE | NE | NE | não aplicável | inserção por papel NE | NE | NE | `NAO_ESPECIFICADO` | `NAO_AVALIADO` | required, ajuda, unidade, validação e “outro” ausentes |
| `SCREEN-012` | NE | NE | NE | não aplicável | inserção por papel NE | NE | NE | `NAO_ESPECIFICADO` | `NAO_AVALIADO` | required, faixas, mensagens e tipo/textura ambíguos |
| `SCREEN-013` | NE | NE | NE | NE para cálculo | inserção por papel NE | NE | NE | `NAO_ESPECIFICADO` | `NAO_AVALIADO` | required, faixas, APP/mata ciliar e habilitação do botão ausentes |
| `SCREEN-014` | não aplicável | NE | NE | não aplicável | visibilidade NE | NE | NE | `NAO_ESPECIFICADO` | `NAO_AVALIADO` | explicação dos componentes e precisão ausentes |
| `SCREEN-015` | não aplicável | NE | NE | não aplicável | visibilidade NE | NE | legibilidade/teste NE | `NAO_ESPECIFICADO` | `NAO_AVALIADO` | linguagem, autoria e relação com drivers ausentes |
| `SCREEN-016` | não aplicável | NE | NE | não aplicável | visibilidade NE | NE | legibilidade NE | `NAO_ESPECIFICADO` | `NAO_AVALIADO` | regra, responsabilidade e priorização ausentes |
| `SCREEN-017` | estado populado | NE | NE | não aplicável | visibilidade por papel NE | NE | NE | `NAO_ESPECIFICADO` | `NAO_AVALIADO` | contraparte vazia não localizada |

### Síntese das telas

| Natureza | Quantidade |
|---|---:|
| Páginas/telas principais (mesmos cinco itens) | 5 |
| Modais | 0 |
| Estados condicionais explícitos | 1 |
| Componentes/painéis/blocos | 11 |
| Variações responsivas | 0 |
| **Itens `SCREEN-NNN`** | **17** |

Os exemplos preenchidos de score, área e recomendações foram tratados como conteúdo demonstrativo de um estado populado, não como regras ou dados reais. A fonte não contém artefato concreto de Figma. `GAP-008` permanece `OPCIONAL_NAO_BLOQUEANTE`, `PD-017` permanece aberta, e Figma continua opcional, secundário e não bloqueante.

## Matriz analítica de cobertura

### Convenções

- `CE` = `COBERTO_EXPLICITAMENTE`
- `CP` = `COBERTO_PARCIALMENTE`
- `CI` = `COBERTURA_INFERIDA`
- `NC` = `NAO_COBERTO`
- `NA` = `NAO_APLICAVEL`
- `AM` = `AMBIGUO`

As relações abaixo não alteram `TRACEABILITY_MATRIX.md`. Todo vínculo `CI` é `INFERENCIA` desta auditoria.

### Requisito → ator, conceito, regra, fluxo, tela e dependência científica

| Requisito | Ator | Conceito | Regra | Fluxo | Tela | Ciência |
|---|---|---|---|---|---|---|
| `PROD-REQ-001` | `ROLE-008` [CE] | `DOM-CON-022`,`024` [CI] | NA [NA] | `FLOW-003` [CP] | `SCREEN-002` [CE] | NA [NA] |
| `PROD-REQ-002` | `ROLE-008` [CE] | `DOM-CON-014` [CE] | NA [NA] | `FLOW-003` [CP] | `SCREEN-002` [CP] | `DOC-009` [CP] |
| `PROD-REQ-003` | `ROLE-001`,`008` [CP] | `DOM-CON-015`,`016`,`018` [CE] | `BUS-RULE-010` [CE] | `FLOW-003` [CE] | `SCREEN-002`,`017` [CE] | `DOC-010` [CP] |
| `PROD-REQ-004` | `ROLE-001`,`008` [CP] | `DOM-CON-011`–`014` [CI] | NA [NA] | `FLOW-003` [CP] | `SCREEN-007` [CE] | `DOC-009`,`010` [CP] |
| `PROD-REQ-005` | `ROLE-001`,`008` [CI] | `DOM-CON-019`,`020` [CP] | NA [NA] | `FLOW-003` [CP] | dashboard [NC] | `DOC-009`,`010` [CP] |
| `PROD-REQ-006` | `ROLE-001`,`008` [CP] | `DOM-CON-022` [CE] | `BUS-RULE-007`,`010` [CP] | `FLOW-003`,`007` [CP] | `SCREEN-009`,`017` [CE] | NA [NA] |
| `PROD-REQ-007` | `ROLE-001`,`008` [CI] | `DOM-CON-021` [CE] | NA [NA] | `FLOW-003` [CP] | dashboard [NC] | `DOC-009`,`010` [CP] |
| `PROD-REQ-008` | `ROLE-001` [CI] | `DOM-CON-024` [CE] | NA [NA] | `FLOW-003`,`004` [CP] | `SCREEN-008`,`010` [CE] | NA [NA] |
| `PROD-REQ-009` | `ROLE-001` [CI] | `DOM-CON-004`,`005`,`018`,`024` [CE] | `BUS-RULE-002`,`010` [CE] | `FLOW-003` [CE] | `SCREEN-008`,`017` [CE] | `DOC-010` [CP] |
| `PROD-REQ-010` | `ROLE-001` [CE] | `DOM-CON-004`,`006`,`008`,`009` [CE] | NA [NA] | `FLOW-004` [CE] | `SCREEN-003` [CE] | `DOC-009` [CP] |
| `PROD-REQ-011` | `ROLE-001` [CI] | `DOM-CON-008` [AM] | NA [NA] | `FLOW-004` [CP] | `SCREEN-003` [CE] | NA [NA] |
| `PROD-REQ-012` | `ROLE-001` [CE] | `DOM-CON-004`,`006` [CE] | NA [NA] | `FLOW-004` [CE] | `SCREEN-003`,`010` [CE] | NA [NA] |
| `PROD-REQ-013` | `ROLE-001` [CE] | `DOM-CON-007` [CE] | NA [NA] | `FLOW-004` [CP] | cadastro de 004 [NC] | `DOC-009` [CP] |
| `PROD-REQ-014` | `ROLE-001` [CI] | `DOM-CON-006`,`023` [CI] | NA [NA] | `FLOW-010` [CP] | `SCREEN-010` [CE] | NA [NA] |
| `PROD-REQ-015` | NA [NA] | `DOM-CON-006`,`024` [CI] | `BUS-RULE-009` [CE] | futuro [NA] | MVP [NA] | NA [NA] |
| `PROD-REQ-016` | NA [NA] | `DOM-CON-024` [CI] | `BUS-RULE-009` [CE] | futuro [NA] | MVP [NA] | ciência/dados futuros [CP] |
| `PROD-REQ-017` | `ROLE-001` [CI] | `DOM-CON-004`,`014`,`015`,`024` [CE] | NA [NA] | análise territorial [NC] | tela citada só em 004 [AM] | `DOC-010` [CP] |
| `PROD-REQ-018` | `ROLE-001`,`009` [CP] | `DOM-CON-019`,`020`,`024` [CI] | NA [NA] | IA/mapa [NC] | não localizada [NC] | `DOC-009`,`010` [CP] |
| `PROD-REQ-019` | `ROLE-001`,`008` [CP] | `DOM-CON-011`–`014` [CI] | NA [NA] | `FLOW-005` [CP] | `SCREEN-004`,`011`–`013` [CE] | `DOC-009` [CP] |
| `PROD-REQ-020` | `ROLE-001`,`003`,`008` [CP] | `DOM-CON-011`,`014` [CE] | `BUS-RULE-006` [CI] | `FLOW-005` [CE] | `SCREEN-011` [CE] | `DOC-009`,`010` [CP] |
| `PROD-REQ-021` | `ROLE-001`,`003`,`008` [CP] | `DOM-CON-012`,`014` [CE] | `BUS-RULE-006` [CI] | `FLOW-005` [CE] | `SCREEN-012` [CE] | `DOC-009`,`010` [CP] |
| `PROD-REQ-022` | `ROLE-001`,`003`,`008` [CP] | `DOM-CON-013`,`014` [CE] | `BUS-RULE-006` [CI] | `FLOW-005` [CE] | `SCREEN-013` [CE] | `DOC-009`,`010` [CP] |
| `PROD-REQ-023` | `ROLE-001`,`008` [CP] | `DOM-CON-010`,`015`,`016` [CE] | `BUS-RULE-006`,`008` [CE] | `FLOW-006` [CE] | `SCREEN-004`,`005` [CP] | `DOC-010` [CP] |
| `PROD-REQ-024` | `ROLE-001`,`008` [CP] | `DOM-CON-015`,`018`,`019` [CE] | `BUS-RULE-006`,`013` [CP] | `FLOW-007` [CE] | `SCREEN-005`,`015` [CE] | `DOC-009`,`010` [CP] |
| `PROD-REQ-025` | `ROLE-001`,`008` [CP] | `DOM-CON-020` [CE] | `BUS-RULE-006` [CI] | `FLOW-007` [CE] | `SCREEN-016` [CE] | `DOC-009`,`010` [CP] |
| `PROD-REQ-026` | `ROLE-009` [CE] | `DOM-CON-020` [CP] | NA [NA] | IA contextual [NC] | não localizada [NC] | `DOC-009`,`010` [CP] |
| `PROD-REQ-027` | produto/UX [NC] | telas [CE] | `BUS-RULE-001` [CE] | `FLOW-001` [CE] | `SCREEN-001`–`005` [CE] | NA [NA] |
| `PROD-REQ-028` | `ROLE-001` [CE] | `DOM-CON-001`,`002` [CP] | NA [NA] | `FLOW-002` [CP] | `SCREEN-001` [CE] | NA [NA] |
| `PROD-REQ-029` | `ROLE-001` [CI] | `DOM-CON-001`,`002` [CI] | NA [NA] | `FLOW-008` [NC] | `SCREEN-001` [CE] | NA [NA] |
| `PROD-REQ-030` | `ROLE-001` [CI] | `DOM-CON-001`,`002` [CI] | NA [NA] | `FLOW-009` [NC] | `SCREEN-001` [CE] | NA [NA] |
| `PROD-REQ-031` | `ROLE-001` [CI] | `DOM-CON-004`,`010`,`022` [CI] | NA [NA] | destinos [NC] | `SCREEN-006` [CE] | NA [NA] |
| `PROD-REQ-032` | `ROLE-001` [CE] | `DOM-CON-004`,`006` [CE] | `BUS-RULE-003`,`004` [CP] | `FLOW-004` [CE] | `SCREEN-003` [CE] | NA [NA] |
| `PROD-REQ-033` | `ROLE-001`,`003`,`008` [CP] | `DOM-CON-010`–`014` [CE] | `BUS-RULE-004`,`006` [CP] | `FLOW-005` [CE] | `SCREEN-004`,`011`–`013` [CE] | `DOC-009` [CP] |
| `PROD-REQ-034` | `ROLE-001`,`008` [CP] | `DOM-CON-010`,`015` [CI] | `BUS-RULE-006` [CE] | `FLOW-006` [CE] | `SCREEN-004` [CE] | `DOC-010` [CP] |
| `PROD-REQ-035` | `ROLE-001`,`008` [CP] | `DOM-CON-015`,`017` [CE] | `BUS-RULE-006` [CI] | `FLOW-007` [CE] | `SCREEN-014` [CE] | `DOC-010` [CP] |
| `PROD-REQ-036` | `ROLE-001`,`008` [CP] | `DOM-CON-010`,`015`,`022` [CE] | `BUS-RULE-007`,`010` [CE] | `FLOW-007` [CE] | `SCREEN-005`,`009`,`017` [CE] | `DOC-010` [CP] |
| `PROD-REQ-037` | `ROLE-001` [CI] | navegação [NA] | NA [NA] | `FLOW-007` [CE] | `SCREEN-005` [CE] | NA [NA] |
| `PROD-REQ-038` | `ROLE-001` [CI] | `DOM-CON-006`,`018`,`024` [CE] | `BUS-RULE-002` [CP] | `FLOW-003`,`004`,`010` [CP] | `SCREEN-008`,`010` [CE] | `DOC-010` [CP] |
| `PROD-REQ-039` | `ROLE-002` [CE] | `DOM-CON-001`,`003`,`004`,`010` [CE] | `BUS-RULE-003` [CE] | transversal [CP] | autorização nas telas [NC] | NA [NA] |
| `PROD-REQ-040` | `ROLE-003` [CE] | `DOM-CON-001`,`003`,`004`,`010` [CE] | `BUS-RULE-004` [CE] | `FLOW-004`–`007` [CP] | autorização nas telas [NC] | NA [NA] |
| `PROD-REQ-041` | `ROLE-003` [CE] | `DOM-CON-004`,`022` [AM] | `BUS-RULE-005` [CE] | `FLOW-003`,`007` [CP] | histórico/dashboard [NC] | NA [NA] |
| `PROD-REQ-042` | `ROLE-001` [CE] | `DOM-CON-001` [CE] | NA [NA] | `FLOW-002`,`009` [CP] | `SCREEN-001` [CP] | NA [NA] |
| `PROD-REQ-043` | `ROLE-001`,`008` [CI] | `DOM-CON-004` [CE] | NA [NA] | `FLOW-004` [CE] | `SCREEN-003` [CE] | `DOC-009` [CP] |
| `PROD-REQ-044` | `ROLE-003`,`008` [CI] | `DOM-CON-010` [CE] | `BUS-RULE-006`,`007` [CI] | `FLOW-005`–`007` [CP] | `SCREEN-004`,`005` [CI] | `DOC-009`,`010` [CP] |
| `PROD-REQ-045` | `ROLE-003`,`008` [CI] | `DOM-CON-012` [CE] | NA [NA] | `FLOW-005` [CE] | `SCREEN-012` [CE] | `DOC-009` [CP] |
| `PROD-REQ-046` | `ROLE-003`,`008` [CI] | `DOM-CON-011` [CE] | NA [NA] | `FLOW-005` [CE] | `SCREEN-011` [CE] | `DOC-009` [CP] |
| `PROD-REQ-047` | `ROLE-003`,`008` [CI] | `DOM-CON-013` [CE] | NA [NA] | `FLOW-005` [CE] | `SCREEN-013` [CE] | `DOC-009` [CP] |
| `PROD-REQ-048` | `ROLE-008` [CI] | `DOM-CON-015` [CE] | `BUS-RULE-008` [CP] | `FLOW-006`,`007` [CP] | `SCREEN-005`,`014` [CP] | `DOC-010` [CP] |
| `PROD-REQ-049` | `ROLE-008` [CI] | `DOM-CON-021` [CE] | NA [NA] | `FLOW-003` [CP] | dashboard [NC] | `DOC-009`,`010` [CP] |
| `PROD-REQ-050` | `ROLE-008` [CI] | `DOM-CON-015`,`023` [CE] | `BUS-RULE-008`,`012` [CE] | `FLOW-006`,`007` [CP] | resultado [CP] | `DOC-010` [CP] |
| `PROD-REQ-051` | responsáveis [NC] | `DOM-CON-016`,`023` [CP] | `BUS-RULE-013` [CP] | cálculo [CP] | não é expectativa de tela [NA] | `DOC-009`,`010` [CP] |
| `PROD-REQ-052` | responsáveis [NC] | `DOM-CON-017`,`023` [AM] | NA [NA] | `FLOW-006` [CP] | não aplicável [NA] | `DOC-010` [CP] |
| `PROD-REQ-053` | responsáveis [NC] | `DOM-CON-023` [CP] | NA [NA] | futuro [NA] | futuro [NA] | `DOC-010` [CP] |
| `PROD-REQ-054` | `ROLE-001`,`008` [CP] | `DOM-CON-004`,`015`,`018` [CE] | `BUS-RULE-010` [CE] | `FLOW-003` [CE] | `SCREEN-017` [CE] | `DOC-010` [CP] |
| `PROD-REQ-055` | ator [NC] | áreas/dados/resultados [CP] | NA [NA] | `FLOW-004`–`007` [CP] | `SCREEN-003`–`005` [CP] | `DOC-009`,`010` [CP] |
| `PROD-REQ-056` | `ROLE-001`,`008` [CP] | `DOM-CON-014`,`025` [CP] | `BUS-RULE-011` [CE] | offline [NC] | não localizada [NC] | NA [NA] |
| `PROD-REQ-057` | `ROLE-001`,`008` [CP] | `DOM-CON-025` [CE] | `BUS-RULE-011` [CP] | offline/sync [NC] | não localizada [NC] | NA [NA] |
| `PROD-REQ-058` | `ROLE-008` [CI] | `DOM-CON-016`,`023` [CP] | `BUS-RULE-012`,`013` [CE] | `FLOW-006` [CP] | não é tela específica [NA] | `DOC-010` [CP] |
| `PROD-REQ-059` | `ROLE-008` [CI] | `DOM-CON-010`–`015`,`023` [CE] | `BUS-RULE-012` [CE] | `FLOW-006`,`007` [CP] | não é tela específica [NA] | `DOC-010` [CP] |
| `PROD-REQ-060` | `ROLE-001`,`008` [CP] | `DOM-CON-019`,`020` [CE] | `BUS-RULE-013` [CE] | `FLOW-007` [CP] | `SCREEN-015`,`016` [CP] | `DOC-009`,`010` [CP] |

### Tela → requisito

| Tela | Requisitos relacionados | Estado | Observação |
|---|---|---|---|
| `SCREEN-001` | `PROD-REQ-027`–`030`, `042` | `COBERTO_PARCIALMENTE` | login explícito; recuperação/criação são apenas rótulos |
| `SCREEN-002` | `PROD-REQ-001`–`004`, `006`, `008`, `031`, `054` | `COBERTO_PARCIALMENTE` | alertas e resultados adicionais de 004 não aparecem |
| `SCREEN-003` | `PROD-REQ-010`–`012`, `014`, `032`, `038`, `043` | `COBERTO_EXPLICITAMENTE` | acrescenta Estado; ponto de coleta de 004 não aparece |
| `SCREEN-004` | `PROD-REQ-019`–`023`, `033`, `034` | `COBERTO_PARCIALMENTE` | modularidade coberta; identificação/território e estados faltam |
| `SCREEN-005` | `PROD-REQ-024`, `025`, `035`–`037`, `048` | `COBERTO_EXPLICITAMENTE` | exemplo não prova regra de geração |
| `SCREEN-006` | `PROD-REQ-031` | `COBERTURA_INFERIDA` | menu gera candidatos, não requisitos confirmados |
| `SCREEN-007` | `PROD-REQ-003`, `004` | `COBERTO_EXPLICITAMENTE` | dados derivados não explicados |
| `SCREEN-008` | `PROD-REQ-008`, `009`, `038` | `COBERTO_EXPLICITAMENTE` | permissões e alternativa à cor ausentes |
| `SCREEN-009` | `PROD-REQ-006`, `036`, `041` | `COBERTO_PARCIALMENTE` | própria área não aplicada |
| `SCREEN-010` | `PROD-REQ-012`, `014`, `038` | `COBERTO_EXPLICITAMENTE` | ponto de coleta não distinguido |
| `SCREEN-011` | `PROD-REQ-020`, `033`, `046` | `COBERTO_EXPLICITAMENTE` | sazonalidade/availability requer reconciliação |
| `SCREEN-012` | `PROD-REQ-021`, `033`, `045` | `COBERTO_EXPLICITAMENTE` | tipo/textura ambíguos |
| `SCREEN-013` | `PROD-REQ-022`, `033`, `034`, `047` | `COBERTO_EXPLICITAMENTE` | APP/mata ciliar sem regra comum |
| `SCREEN-014` | `PROD-REQ-035`, `048` | `COBERTO_EXPLICITAMENTE` | componentes localizados |
| `SCREEN-015` | `PROD-REQ-024`, `060` | `COBERTO_PARCIALMENTE` | compreensibilidade não possui teste |
| `SCREEN-016` | `PROD-REQ-025`, `026`, `060` | `COBERTO_PARCIALMENTE` | recomendações existem; IA não aparece |
| `SCREEN-017` | `PROD-REQ-003`, `006`, `009`, `054` | `COBERTO_EXPLICITAMENTE` | somente estado com diagnóstico salvo |

### Ação de tela → permissão

| Ação/tela | Papel relacionado | Estado | Evidência/lacuna |
|---|---|---|---|
| Entrar / `SCREEN-001` | `ROLE-001` | `COBERTURA_INFERIDA` | usuário genérico; regra de acesso não definida |
| Criar/editar área / `SCREEN-003` | `ROLE-002` | `COBERTO_PARCIALMENTE` | permissão em 004, mas wireframe não diferencia papel |
| Cadastrar área / `SCREEN-003` | `ROLE-003` | `COBERTO_PARCIALMENTE` | idem |
| Capturar GPS / `SCREEN-010` | `ROLE-001` | `COBERTURA_INFERIDA` | nenhuma regra por papel |
| Inserir dados / `SCREEN-004` | `ROLE-003` | `COBERTO_PARCIALMENTE` | ação permitida na fonte de requisitos; tela não autoriza |
| Calcular/lançar análise / `SCREEN-004` | `ROLE-002` | `COBERTO_PARCIALMENTE` | “lança análises”; botão visível sem papel |
| Calcular IHFR / `SCREEN-004` | `ROLE-003` | `AMBIGUO` | inserir dados é permitido, mas lançar/calcular não é dito explicitamente |
| Ver resultado / `SCREEN-005` | `ROLE-003` | `COBERTO_PARCIALMENTE` | permissão explícita, tela genérica |
| Salvar diagnóstico / `SCREEN-005` | papéis não especificados | `NAO_COBERTO` | botão sem regra de autorização |
| Ver todas as áreas / `SCREEN-002`,`008` | `ROLE-002` | `COBERTO_PARCIALMENTE` | permissão existe; dashboard não explicita escopo |
| Ver histórico próprio / `SCREEN-009` | `ROLE-003` | `AMBIGUO` | “própria área” não é operacionalizado |
| Exportar relatório | `ROLE-002` | `NAO_COBERTO` | permissão condicional “se houver”; ação/tela não localizada |

### Campo de tela → dado/conceito

| Campo/grupo | Conceito | Estado | Observação |
|---|---|---|---|
| email/senha | `DOM-CON-001`,`002` | `COBERTURA_INFERIDA` | atributos não declarados na entidade `User` |
| nome/município/tamanho | `DOM-CON-004`,`008` | `COBERTO_EXPLICITAMENTE` | tipos/validações ausentes |
| Estado | `DOM-CON-008` relacionado | `AMBIGUO` | conceito específico não consta em 004 |
| uso da terra | `DOM-CON-009` | `COBERTO_EXPLICITAMENTE` | sem regra de predominância |
| ponto/polígono/GPS | `DOM-CON-006`,`023` | `COBERTO_EXPLICITAMENTE` | formato/precisão ausentes |
| fonte/nascente/poço | `DOM-CON-011` | `COBERTO_EXPLICITAMENTE` | obrigatoriedade ausente |
| disponibilidade/salinização | `DOM-CON-011` | `COBERTO_EXPLICITAMENTE` | sazonalidade não é campo separado |
| tipo/textura do solo | `DOM-CON-012` | `AMBIGUO` | termos potencialmente sobrepostos |
| infiltração/compactação | `DOM-CON-012` | `COBERTO_EXPLICITAMENTE` | faixas/validação ausentes |
| erosão/solo exposto | `DOM-CON-012` | `COBERTO_EXPLICITAMENTE` | critérios/percentual ausentes |
| cobertura/fragmentação | `DOM-CON-013` | `COBERTO_EXPLICITAMENTE` | critérios/validação ausentes |
| APP ou mata ciliar | `DOM-CON-013` | `AMBIGUO` | termos unidos na pergunta, sem equivalência aprovada |
| degradação | `DOM-CON-013` | `COBERTO_EXPLICITAMENTE` | critérios ausentes |
| score/classe | `DOM-CON-015`,`016`,`018` | `COBERTO_EXPLICITAMENTE` | precisão/regra científica pendentes |
| componentes/interpretação/recomendações | `DOM-CON-017`,`019`,`020` | `COBERTO_EXPLICITAMENTE` | derivação e autoria ausentes |

### Fluxo → resultado

| Fluxo | Resultado | Estado | Lacuna |
|---|---|---|---|
| `FLOW-001` | `DOM-CON-015` exibido | `COBERTO_EXPLICITAMENTE` | persistência não consta do diagrama geral |
| `FLOW-002` | dashboard acessível | `COBERTO_PARCIALMENTE` | sucesso/erro/sessão ausentes |
| `FLOW-003` | visão territorial/histórico | `COBERTO_PARCIALMENTE` | estado vazio e escopo por papel ausentes |
| `FLOW-004` | `DOM-CON-004` salvo | `COBERTO_EXPLICITAMENTE` | confirmação/erro ausentes |
| `FLOW-005` | `DOM-CON-014` aceito | `COBERTO_PARCIALMENTE` | salvamento/validação ausentes |
| `FLOW-006` | `DOM-CON-015` calculado | `COBERTO_PARCIALMENTE` | insuficiência/erro/progresso ausentes |
| `FLOW-007` | diagnóstico salvo ou retorno | `AMBIGUO` | voltar sem salvar e confirmação não definidos |
| `FLOW-008` | não especificado | `NAO_COBERTO` | somente rótulo |
| `FLOW-009` | não especificado | `NAO_COBERTO` | somente rótulo |
| `FLOW-010` | localização capturada, por `INFERENCIA` | `COBERTURA_INFERIDA` | precisão/falha/recusa ausentes |

### Síntese quantitativa da cobertura

Cada célula/linha acima constitui uma relação analítica, inclusive `NAO_APLICAVEL`. As contagens foram extraídas mecanicamente dos estados registrados.

| Tipo de relação | CE | CP | CI | NC | NA | AM | Total |
|---|---:|---:|---:|---:|---:|---:|---:|
| requisito → ator | 12 | 19 | 22 | 5 | 2 | 0 | 60 |
| requisito → conceito | 37 | 8 | 11 | 0 | 1 | 3 | 60 |
| requisito → regra | 17 | 8 | 6 | 0 | 29 | 0 | 60 |
| requisito → fluxo | 22 | 27 | 0 | 8 | 3 | 0 | 60 |
| requisito → tela | 33 | 7 | 1 | 11 | 7 | 1 | 60 |
| requisito → ciência | 0 | 40 | 0 | 0 | 20 | 0 | 60 |
| tela → requisito | 10 | 6 | 1 | 0 | 0 | 0 | 17 |
| ação de tela → permissão | 0 | 6 | 2 | 2 | 0 | 2 | 12 |
| campo de tela → conceito | 11 | 0 | 1 | 0 | 0 | 3 | 15 |
| fluxo → resultado | 2 | 4 | 1 | 2 | 0 | 1 | 10 |
| **Total** | **144** | **125** | **45** | **28** | **62** | **10** | **414** |

## Comparações obrigatórias entre requisitos e wireframes

| Assunto | `DOC-RAW-004` | `DOC-RAW-014` | Resultado analítico |
|---|---|---|---|
| Terminologia | Área/propriedade; análise/diagnóstico; médio/moderado; APP; contexto da área. | Área; exemplo de Fazenda; diagnóstico; moderado; APP ou mata ciliar; Território. | `AMBIGUO`/parcialmente alinhado; equivalências não normalizadas. |
| Atores e permissões | Dois papéis compostos e permissões gerais. | Não identifica papel nem condiciona ação/visibilidade. | `NAO_COBERTO` nas telas; não é conflito. |
| Cadastro/autenticação | Lista Login/usuário e jornada Login → Dashboard. | Email, senha, Entrar, “Esqueceu senha?” e “Criar conta”. | Login coberto parcialmente; recuperação/conta são expectativas sem fluxo. |
| Áreas monitoradas | Dados básicos, ponto/polígono/coordenadas e acesso por papel. | Formulário acrescenta Estado; ponto/polígono/GPS. | Cobertura parcial; Estado é diferença documental, não conflito. |
| Coleta de dados | Módulos identificação, água, solo, vegetação e cálculo. | Uma tela com três blocos água/solo/vegetação; cálculo no último. | Alinhamento parcial; identificação é tela anterior e território não é bloco. |
| Cálculo/diagnóstico do IHFR | Processar, gerar valor, classe, interpretação e proposta de contrato. | Botão, resultado, componentes, explicação e referência à v0.1. | Cobertura explícita do fluxo; regra científica continua pendente. |
| Mapas | Central; dashboard, cadastro, análise territorial e IA; funções/futuros. | Dashboard e cadastro; funções básicas/cadastro/cores. | Núcleo alinhado; análise territorial/IA e camadas futuras não têm tela própria. |
| Recomendações | Restauração, SAF, manejo, prioridade e IA possível. | Lista demonstrativa no resultado. | Cobertura parcial; exemplo visual não prova regra. |
| Relatórios | Administrador/Técnico exporta “se houver”. | Nenhuma ação/tela de relatório. | `NAO_LOCALIZADO`; condição não cria obrigação de MVP. |
| Alertas | Alertas no dashboard e entidade `Alerts`. | Não aparecem no dashboard desenhado. | `NAO_COBERTO`; diferença não classificada como conflito. |
| Planos/assinaturas | não localizado | não localizado | `NAO_LOCALIZADO`; não convertido em lacuna obrigatória. |
| Organizações/laboratórios | não localizado; IFMA/HidroFlorestas é qualificador de papel. | não localizado | `NAO_LOCALIZADO`; `PD-014`–`016` permanecem abertas. |
| Estados vazios, erros e confirmações | Não especificados; há mínimo “não perder dados”. | Estado populado do dashboard; demais vazios/erros/confirmações ausentes. | Lacuna documental de UX; nenhuma tela fictícia criada. |
| Escopo MVP/futuro | Cinco telas; shapefile/camadas futuras; IA e v0.2 como possibilidades/propostas. | Cinco telas do MVP; não delimita futuros. | Cinco telas alinhadas; propostas não aprovadas preservadas. |
| Critérios de aceitação | Um exemplo para dashboard e instrução para repetir. | Listas para dashboard/cadastro/dados/resultado. | Parcial; não cobre erros, autorização, NFR ou cenários alternativos. |
| Requisitos não funcionais | Offline/não perder dados, auditabilidade e compreensibilidade. | Não há seção NFR. | Cobertura histórica esparsa, sem métricas. |
| Acessibilidade | não localizada | não localizada; cor é único canal explicitamente desenhado | `NAO_LOCALIZADO`; requisito não foi inventado. |
| Privacidade/isolamento | “própria área” sugere restrição; nada sobre privacidade/isolamento. | visibilidade não condicionada | `AMBIGUO`/não coberto; `PD-003`, `004`, `014`–`016`. |
| Offline e GPS | offline como mínimo/proposta; GPS em cadastro. | GPS desenhado; offline ausente. | GPS parcial; offline sem fluxo/estado. |
| IA | Mapa/assistência contextual como possibilidade. | não localizada | `PROPOSTA_NAO_APROVADA`; ausência não é divergência de implementação. |
| Recuperação de senha | não localizada | apenas “Esqueceu senha?” | `NAO_LOCALIZADO` como fluxo; expectativa de tela registrada. |
| Criação de conta | não localizada como requisito/domínio | apenas “Criar conta” | `NAO_LOCALIZADO` como fluxo; não define assinante/conta. |

## Achados

| ID | Título | Tipo | Impacto | Estado | Classificação | Fontes/localizadores | Descrição e efeito | Decisão necessária; pendência; destino |
|---|---|---|---|---|---|---|---|---|
| `PROD-FND-001` | Cinco telas e fluxo principal alinhados | `ALINHAMENTO_DOCUMENTAL` | `INFORMATIVO` | `INFORMATIVO` | `FATO_DOCUMENTADO` | 004:L175-L212,L228-L234; 014:L12-L26,L28-L278 | As duas fontes enumeram o mesmo núcleo Login→Dashboard→Área→Dados→Resultado. Não prova aprovação nem completude. | Preservar como evidência; futura consolidação após `PD-003`/`005`. |
| `PROD-FND-002` | Dashboard e mapa possuem núcleo comum | `ALINHAMENTO_DOCUMENTAL` | `INFORMATIVO` | `INFORMATIVO` | `FATO_DOCUMENTADO` | 004:L3-L67; 014:L62-L110,L280-L307 | IHFR, indicadores, mapa colorido e histórico têm cobertura cruzada. Alertas/resultados adicionais não aparecem em 014. | Preservar distinção entre núcleo e itens não cobertos. |
| `PROD-FND-003` | Coleta modular e resultado têm cobertura cruzada | `ALINHAMENTO_DOCUMENTAL` | `INFORMATIVO` | `INFORMATIVO` | `FATO_DOCUMENTADO` | 004:L108-L173; 014:L160-L278 | Três grupos de coleta, cálculo, valor/classe/interpretação/recomendações se correspondem documentalmente. | Manter vínculos como análise histórica; ciência sob `PD-002`. |
| `PROD-FND-004` | Campo Estado aparece somente no wireframe | `DIVERGENCIA_DOCUMENTAL` | `MEDIO` | `ABERTO` | `FATO_DOCUMENTADO` | 004:L114-L123,L240-L242; 014:L124-L143 | Wireframe acrescenta Estado ao cadastro. Não há incompatibilidade: 004 lista mínimo e 014 detalha tela. | Produto/dados devem decidir futuramente se o campo integra o modelo; `PD-003`,`004`; Etapa 8/7. |
| `PROD-FND-005` | Tela de análise territorial não se encaixa claramente nas cinco telas | `AMBIGUIDADE` | `MEDIO` | `AGUARDANDO_DECISAO_DE_UX` | `FATO_DOCUMENTADO` + `INFERENCIA` | 004:L84-L106,L196-L212; 014:L12-L278 | 004 nomeia tela de análise e mapa de IA, mas o MVP lista cinco telas e 014 não as separa. Pode ser painel/estado/futuro. | Definir natureza/fase sem inventar tela; `PD-003`,`005`; Etapa 8. |
| `PROD-FND-006` | Área e propriedade não têm equivalência declarada | `AMBIGUIDADE` | `ALTO` | `AGUARDANDO_DECISAO_DE_PRODUTO` | `FATO_DOCUMENTADO` + `INFERENCIA` | 004:L58-L76,L236-L247; 014:L112-L158,L254 | Termos aparecem no mesmo contexto territorial, mas nenhuma fonte diz que são idênticos. | Definir glossário e identidade; `PD-014`,`015`; Etapa 8. |
| `PROD-FND-007` | Taxonomia de papéis é composta e sobreposta | `AMBIGUIDADE` | `BLOQUEANTE_PARA_NORMATIZACAO` | `AGUARDANDO_DECISAO_DE_PRODUTO` | `FATO_DOCUMENTADO` | 004:L219-L226 | Administrador/Técnico e Usuário de Campo agrupam termos; “técnico parceiro” pode sobrepor Técnico; escopo global/local ausente. | Definir papéis e escopo; `PD-003`,`015`,`016`; Etapa 8. |
| `PROD-FND-008` | Permissões não são aplicadas às ações/telas | `LACUNA` | `BLOQUEANTE_PARA_NORMATIZACAO` | `AGUARDANDO_DECISAO_DE_PRODUTO` | `NAO_ESPECIFICADO` + `INFERENCIA` | 004:L219-L226; 014:L28-L278 | A fonte de requisitos lista permissões gerais; wireframes não condicionam criar, editar, calcular, salvar ou visualizar. | Definir matriz de autorização após papéis; `PD-003`,`005`,`016`; Etapa 8. |
| `PROD-FND-009` | Recuperação de senha e criação de conta são rótulos sem fluxo | `LACUNA` | `ALTO` | `AGUARDANDO_DECISAO_DE_PRODUTO` | `FATO_DOCUMENTADO` + `NAO_ESPECIFICADO` | 014:L49-L52; ausência em 004 | Não há campos, regras, confirmação, erro, elegibilidade ou relação de conta. | Decidir escopo de autenticação/conta; `PD-003`,`015`; futura norma de produto/UX. |
| `PROD-FND-010` | Validação, erro e confirmação não estão desenhados | `LACUNA` | `ALTO` | `AGUARDANDO_DECISAO_DE_UX` | `NAO_ESPECIFICADO` | 014:L28-L345; critérios 014:L309-L345 | Login, cadastro, coleta, cálculo e salvamento não têm estados de erro; confirmações não são especificadas. | Definir estados após requisitos aprovados; `PD-003`,`005`; futura especificação UX. |
| `PROD-FND-011` | Estados vazios, carregamento, responsividade e acessibilidade ausentes | `LACUNA` | `ALTO` | `AGUARDANDO_DECISAO_DE_UX` | `NAO_ESPECIFICADO` | 014:L28-L345 | Só há estado populado do dashboard. Cor é usada sem alternativa explícita; não há responsividade/acessibilidade. | Definir critérios de UX/acessibilidade; `PD-005`; futura norma UX. |
| `PROD-FND-012` | Critérios de aceitação são parciais | `LACUNA` | `BLOQUEANTE_PARA_NORMATIZACAO` | `AGUARDANDO_DECISAO_DE_PRODUTO` | `FATO_DOCUMENTADO` + `NAO_ESPECIFICADO` | 004:L270-L284; 014:L309-L345 | Um cenário detalhado e listas de capacidade não cobrem autorização, validação, exceção, NFR ou alternativas. | Autoridade de produto/UX deve aprovar critérios verificáveis; `PD-003`,`005`. |
| `PROD-FND-013` | Requisitos não funcionais são esparsos e não mensuráveis | `LACUNA` | `BLOQUEANTE_PARA_NORMATIZACAO` | `AGUARDANDO_DECISAO_DE_PRODUTO` | `FATO_DOCUMENTADO` + `NAO_ESPECIFICADO` | 004:L286-L291; ausência em 014 | Offline, auditabilidade e compreensão são citados sem métricas; desempenho, disponibilidade, segurança e compatibilidade não são localizados. | Decidir NFR aplicáveis sem transformar ausências em obrigações; `PD-003`; futura norma de produto. |
| `PROD-FND-014` | Offline mistura mínimo e solução ideal | `AMBIGUIDADE` | `ALTO` | `AGUARDANDO_DECISAO_DE_PRODUTO` | `FATO_DOCUMENTADO` + `PROPOSTA` | 004:L288 | “Não perder dados” é mínimo; rascunho/sincronização é ideal e talvez parcial no MVP. Fronteira e comportamento não estão fechados. | Definir escopo, dados e conflitos; `PD-003`,`004`; futura norma de produto/dados/UX. |
| `PROD-FND-015` | Privacidade e isolamento de dados não são especificados | `LACUNA` | `BLOQUEANTE_PARA_NORMATIZACAO` | `AGUARDANDO_DECISAO_DE_DADOS` | `NAO_ESPECIFICADO` | 004:L219-L249; 014:L62-L110 | “Própria área” e “todas as áreas” sugerem fronteiras, mas não definem isolamento, retenção ou acesso. | Definir após modelo de atores/áreas; `PD-003`,`004`,`014`–`016`; Etapa 8. |
| `PROD-FND-016` | IA contextual permanece proposta não aprovada | `PROPOSTA_NAO_APROVADA` | `MEDIO` | `AGUARDANDO_DECISAO_DE_PRODUTO` | `PROPOSTA` | 004:L99-L106,L164-L173; ausência em 014 | Mapa e recomendações poderiam usar IA, sem fluxo, supervisão, dados ou fase. | Avaliar posteriormente sob produto/UX/dados; `PD-003`–`005`; não incluir como MVP aprovado. |
| `PROD-FND-017` | Shapefile e camadas são futuros explícitos | `PROPOSTA_NAO_APROVADA` | `INFORMATIVO` | `ENCAMINHADO_A_ETAPA_POSTERIOR` | `FATO_DOCUMENTADO` sobre fase futura | 004:L78-L97,L214-L218 | Exclusão do MVP está clara; detalhes técnicos/dados pertencem à futura avaliação. | Encaminhar à Etapa 7/8 sem antecipar decisão; `PD-004`,`006`,`013`. |
| `PROD-FND-018` | Domínio não define cardinalidades nem ciclos de vida | `LACUNA` | `BLOQUEANTE_PARA_NORMATIZACAO` | `AGUARDANDO_DECISAO_DE_DADOS` | `NAO_ESPECIFICADO` + `INFERENCIA` | 004:L219-L249; 014:L28-L278 | User, Área, Survey e Resultado são nomeados, mas propriedade, participação, compartilhamento, transferência, arquivamento/exclusão e retenção faltam. | Definir modelo conceitual normativo depois; `PD-004`,`014`–`016`; Etapa 8. |
| `PROD-FND-019` | Laboratório, organização e assinante não são comparáveis ao corpus | `NAO_COMPARAVEL` | `BLOQUEANTE_PARA_NORMATIZACAO` | `AGUARDANDO_DECISAO_DE_DADOS` | `NAO_ESPECIFICADO` | leitura integral 004/014; `PD-014`–`016` | Os conceitos não aparecem. IFMA/HidroFlorestas qualifica um papel e não prova organização de domínio; conta é só rótulo. | Manter pendências abertas; não criar modelo por analogia; Etapa 8. |
| `PROD-FND-020` | Dependências científicas não autorizam requisitos atuais | `PENDENCIA_DE_AUTORIDADE` | `BLOQUEANTE_PARA_NORMATIZACAO` | `AGUARDANDO_DECISAO_DE_PRODUTO` | `PENDENCIA_DE_DECISAO` | 004:L149-L173,L251-L268; 014:L243-L345; `DOC-009`,`010`; `PD-002` | Cálculo, classes, indicadores, interpretação, alertas e recomendações dependem de conteúdo científico ainda não validado. | Resolver `PD-002` e autoridade de produto antes da norma; Etapa 8. |
| `PROD-FND-021` | Autoridades de produto, UX e dados não estão designadas | `PENDENCIA_DE_AUTORIDADE` | `BLOQUEANTE_PARA_NORMATIZACAO` | `AGUARDANDO_DECISAO_DE_PRODUTO` | `PENDENCIA_DE_DECISAO` | `SOURCE_AUTHORITY.md`; `PD-003`–`005` | Nenhum inventário, tela ou relação pode ser promovido por esta auditoria. | Designar autoridades e registrar aprovações; futuros documentos normativos. |
| `PROD-FND-022` | Figma ausente e não bloqueante | `NAO_COMPARAVEL` | `INFORMATIVO` | `INFORMATIVO` | `DECISAO_CONFIRMADA` para opcionalidade; ausência `NAO_ESPECIFICADO` | `TRACEABILITY_MATRIX.md` `GAP-008`; `PD-017`; corpus sem artefato | Nenhum arquivo/frame/tela concreto foi apresentado; a auditoria prossegue apenas com o wireframe histórico. | Preservar `GAP-008`/`PD-017`; entrada opcional futura. |

### Aplicação do critério estrito de conflito

Nenhum achado foi classificado como `CONFLITO_DOCUMENTAL`. Diferenças de campo, detalhe, cobertura ou estrutura não atendem simultaneamente aos quatro critérios: não há duas regras incompatíveis sobre o mesmo comportamento sem recorte conciliador. Em especial, a ausência de alertas, permissões ou telas no wireframe não nega a fonte de requisitos, e a presença de Estado não proíbe o conjunto mínimo de 004.

### Contagens dos achados

| Tipo | Quantidade |
|---|---:|
| `ALINHAMENTO_DOCUMENTAL` | 3 |
| `DIVERGENCIA_DOCUMENTAL` | 1 |
| `CONFLITO_DOCUMENTAL` | 0 |
| `AMBIGUIDADE` | 4 |
| `LACUNA` | 8 |
| `DUPLICIDADE` | 0 |
| `NAO_COMPARAVEL` | 2 |
| `PROPOSTA_NAO_APROVADA` | 2 |
| `PENDENCIA_DE_AUTORIDADE` | 2 |
| **Total** | **22** |

| Impacto | Quantidade |
|---|---:|
| `BLOQUEANTE_PARA_NORMATIZACAO` | 9 |
| `ALTO` | 5 |
| `MEDIO` | 3 |
| `BAIXO` | 0 |
| `INFORMATIVO` | 5 |
| **Total** | **22** |

| Estado | Quantidade |
|---|---:|
| `ABERTO` | 1 |
| `AGUARDANDO_DECISAO_DE_PRODUTO` | 10 |
| `AGUARDANDO_DECISAO_DE_UX` | 3 |
| `AGUARDANDO_DECISAO_DE_DADOS` | 3 |
| `ENCAMINHADO_A_ETAPA_POSTERIOR` | 1 |
| `INFORMATIVO` | 4 |
| **Total** | **22** |

Bloqueios para futura normatização: `PROD-FND-007`, `008`, `012`, `013`, `015`, `018`, `019`, `020` e `021`. Eles não bloqueiam esta auditoria documental.

## Perguntas para a equipe

As perguntas abaixo não são respondidas neste relatório.

| ID | Assunto e pergunta | Fontes/achados | Pendência/destino |
|---|---|---|---|
| `PROD-Q-001` | Qual é o público primário do MVP e quais termos representam atores distintos? | `ROLE-001`–`007`; `PROD-FND-007` | `PD-003`,`015`; produto |
| `PROD-Q-002` | “Administrador/Técnico” é um papel único, dois papéis, administrador global ou contextual? | 004:L223-L225; `PROD-FND-007` | `PD-003`,`015`,`016` |
| `PROD-Q-003` | “Técnico” e “técnico parceiro” possuem permissões diferentes? | 004:L223-L226 | `PD-015`,`016` |
| `PROD-Q-004` | Agricultor, liderança e técnico parceiro são exemplos, sinônimos ou subtipos de Usuário de Campo? | 004:L225-L226 | `PD-015` |
| `PROD-Q-005` | O usuário é a pessoa, uma conta, um assinante ou outro conceito? | 004:L240; 014:L49-L52; `PROD-FND-009`,`019` | `PD-014`,`015` |
| `PROD-Q-006` | Organização ou laboratório existe no modelo pretendido, e como se relaciona a usuário/conta? | ausência em 004/014; `PROD-FND-019` | `PD-014`–`016`; Etapa 8 |
| `PROD-Q-007` | Uma pessoa pode participar de quantos laboratórios/organizações e com quais papéis? | ausência; pendências canônicas | `PD-014`–`016` |
| `PROD-Q-008` | O que torna uma área “própria” e quem é seu proprietário? | 004:L225-L226; `PROD-FND-006`,`015`,`018` | `PD-014`–`016` |
| `PROD-Q-009` | Área pode ser compartilhada ou transferida; entre quem e com que histórico? | ausência; `PROD-FND-018` | `PD-014`,`016` |
| `PROD-Q-010` | Como usuários são criados, convidados, vinculados e removidos? | 014:L49-L52; `PROD-FND-009` | `PD-003`,`004`,`015`,`016` |
| `PROD-Q-011` | Quem pode ver, editar, arquivar e excluir área, diagnóstico e resultado? | 004:L223-L226; `PROD-FND-008`,`018` | `PD-003`,`004`,`016` |
| `PROD-Q-012` | Qual isolamento de dados se aplica entre usuários, áreas, organizações ou laboratórios? | `PROD-FND-015`,`019` | `PD-003`,`004`,`014`–`016` |
| `PROD-Q-013` | Cancelamento de conta/assinatura, retenção e exclusão têm quais efeitos? | não localizado | `PD-003`,`004`,`014`,`015`; possível revisão futura |
| `PROD-Q-014` | O MVP tem somente cinco telas ou “análise territorial”, destinos do menu e IA são painéis/estados/futuro? | 004:L84-L106,L196-L212; `PROD-FND-005` | `PD-003`,`005` |
| `PROD-Q-015` | Quais regras de autenticação, sessão, bloqueio e logout se aplicam? | 014:L28-L60; `PROD-FND-009`,`010` | `PD-003`,`005` |
| `PROD-Q-016` | Recuperação de senha pertence ao MVP e qual é seu fluxo? | 014:L49-L52 | `PD-003`,`005` |
| `PROD-Q-017` | Criação de conta pertence ao MVP; quem pode criar e quais dados/aceites exige? | 014:L49-L52 | `PD-003`–`005`,`015` |
| `PROD-Q-018` | Como GPS trata permissão, baixa precisão, indisponibilidade e correção manual? | 004:L80; 014:L150-L155,L294 | `PD-003`,`005`; produto/UX |
| `PROD-Q-019` | Quais dados precisam operar offline, por quanto tempo e como resolver sincronização/conflitos? | 004:L288; `PROD-FND-014` | `PD-003`,`004`; produto/dados/UX |
| `PROD-Q-020` | IA integra o MVP ou fase futura; qual supervisão, explicabilidade e uso de dados? | 004:L99-L106,L173; `PROD-FND-016` | `PD-003`–`005` |
| `PROD-Q-021` | Exportação de relatório existe; quais formatos, conteúdo, atores e fase? | 004:L223-L225; ausência em 014 | `PD-003`; futura norma de produto |
| `PROD-Q-022` | Como alertas são calculados, direcionados, reconhecidos e encerrados? | 004:L43-L47,L247; `PROD-FND-002` | `PD-002`–`004` |
| `PROD-Q-023` | O mapa agrega quais áreas, com que filtros, visibilidade e tratamento de sobreposição? | 004:L54-L67; 014:L98-L104 | `PD-003`–`005`,`014`–`016` |
| `PROD-Q-024` | Como indicadores resumidos, potencial SAF e prioridade são derivados e atualizados? | 004:L25-L47; `PROD-FND-020` | `PD-002`,`003` |
| `PROD-Q-025` | Quais critérios de aceitação cobrem fluxo principal, autorização, validação, erro e cenários alternativos? | 004:L270-L284; 014:L309-L345; `PROD-FND-012` | `PD-003`,`005` |
| `PROD-Q-026` | Quais NFR realmente se aplicam e com quais métricas verificáveis? | 004:L286-L291; `PROD-FND-013` | `PD-003` |
| `PROD-Q-027` | Qual é o estado de aprovação dos wireframes históricos e quem pode aprová-los? | ausência em 014; `PROD-FND-021`,`022` | `PD-005`,`017` |
| `PROD-Q-028` | Quais requisitos de acessibilidade, responsividade, estados vazios, carregamento, erro e confirmação devem ser aprovados? | 014:L28-L345; `PROD-FND-010`,`011` | `PD-003`,`005` |

Quantidade: 28 perguntas sobre público, atores, assinante/conta, organização/laboratório, papéis, propriedade, participação, convite, visibilidade, ciclo de vida, isolamento, cancelamento, MVP, autenticação, GPS/offline, IA, relatórios, alertas, mapa, indicadores, aceite, NFR e estado dos wireframes.

## Rastreabilidade e encaminhamentos

### Candidatos à atualização futura da matriz

- `RECOMENDACAO` — Revisar futuramente `TR-012` para registrar que requisitos e wireframes compartilham o núcleo das cinco telas, com cobertura parcial e sem derivação, aprovação ou completude presumidas.
- `RECOMENDACAO` — Considerar relações analíticas entre `DOC-RAW-004`/`DOC-RAW-014` e os futuros documentos normativos de produto/UX somente após aprovação e identificação de autoridade.
- `RECOMENDACAO` — Registrar no futuro a dependência de requisitos de cálculo/resultado em relação ao contrato científico validado, sem converter `DOC-009`/`DOC-010` em fontes normativas.
- `RECOMENDACAO` — Manter diferenças de campo, papel, estado e fase como atributos da relação, não como substituição entre documentos.

Nenhuma relação candidata foi aplicada a `TRACEABILITY_MATRIX.md`.

### Lacunas candidatas

- Taxonomia de atores, escopo global/contextual e matriz de permissões (`PROD-FND-007`,`008`).
- Fluxos de recuperação de senha/criação de conta e modelo correspondente (`PROD-FND-009`).
- Validação, erros, confirmações, estados vazios/carregamento, responsividade e acessibilidade (`PROD-FND-010`,`011`).
- Critérios de aceitação completos e NFR mensuráveis (`PROD-FND-012`,`013`).
- Contrato offline/sincronização (`PROD-FND-014`).
- Privacidade, isolamento, cardinalidades e ciclos de vida (`PROD-FND-015`,`018`).
- Relação entre Area/propriedade e futuro modelo de assinante/organização/laboratório (`PROD-FND-006`,`019`).
- Autoridades e dependências científicas (`PROD-FND-020`,`021`).

### Pendências existentes relacionadas

- `PD-002`: validação das dependências científicas de cálculo, classe, indicadores, alertas, interpretação e recomendações.
- `PD-003`: aprovação de objetivos, requisitos, regras, MVP, autenticação e NFR.
- `PD-004`: conceitos, relações, isolamento, ciclos de vida e contrato de dados.
- `PD-005`: aprovação de fluxos, telas, estados, acessibilidade e responsividade.
- `PD-014`: modelo conceitual de assinantes, laboratórios e áreas.
- `PD-015`: terminologia e papéis.
- `PD-016`: criação, participação, propriedade, visualização e acesso a laboratórios/áreas.
- `PD-017`: estado de artefatos do Figma; permanece aberta e não bloqueante.

### Possíveis pendências genuinamente novas

Nenhuma foi identificada com necessidade inequívoca de novo registro. Autenticação, offline, NFR, privacidade, ciclo de vida e UX podem ser decididos sob `PD-003`–`005` e `PD-014`–`016`. Se as autoridades futuras considerarem essa cobertura insuficiente, poderão desdobrar pendências com origem registrada; esta auditoria não altera `PENDING_DECISIONS.md`.

### Possíveis documentos normativos futuros

- `RECOMENDACAO` — Especificação normativa de produto/requisitos do MVP, com estados de aprovação, prioridade, fase, aceite e NFR.
- `RECOMENDACAO` — Glossário de produto/domínio separado do glossário científico.
- `RECOMENDACAO` — Modelo conceitual normativo de usuários/contas/organizações/laboratórios/áreas/diagnósticos, após `PD-014`–`016`.
- `RECOMENDACAO` — Matriz de papéis e permissões com escopo e aplicação por ação.
- `RECOMENDACAO` — Especificação normativa de UX com fluxos, estados, responsividade e acessibilidade.
- `RECOMENDACAO` — Contrato de autenticação, privacidade, isolamento, retenção e operação offline.
- `RECOMENDACAO` — PRD somente na etapa autorizada e após consolidação/aprovações; nenhum PRD foi criado aqui.

### Assuntos destinados à Etapa 8

- Relação entre ciência validada e requisitos de cálculo/resultado.
- Glossário transversal: área/propriedade, survey/diagnóstico/análise, usuário/conta/papel e classe média/moderada.
- Modelo de assinante, organização, laboratório, membro, conta e área.
- Papéis globais/locais, propriedade, participação, compartilhamento e transferência.
- Escopo final do MVP, telas/painéis/estados e propostas futuras.
- Destinos normativos e atualização futura da rastreabilidade após aprovação.

### Dependências antes de atualização normativa

1. Designar autoridades em `PD-002`–`005`.
2. Resolver ou delimitar `PD-014`–`016` sem usar recorrência histórica como aprovação.
3. Validar dependências científicas aplicáveis.
4. Aprovar glossário, atores, papéis, escopo, regras e critérios de aceite.
5. Aprovar fluxos/telas e definir estado de artefatos sem exigir Figma como pré-requisito.
6. Definir destino normativo e só então revisar candidatos de matriz/pendências.

### Itens reservados para futura comparação com código

- Existência e comportamento das cinco telas, menu e estados.
- Autenticação, recuperação, criação de conta e autorização efetiva.
- Persistência/relacionamentos de User, Area, Survey, grupos de dados, IHFRResult e Alerts.
- Implementação de mapa, GPS, ponto/polígono, camadas e offline/sincronização.
- Cálculo, versionamento, trilha, histórico, alertas e recomendações.
- Validações, erros, confirmações, acessibilidade e responsividade observáveis.

Esses itens não foram inspecionados nesta etapa e permanecem `NAO_AVALIADO`.

## Resultados quantitativos consolidados

| Item | Quantidade |
|---|---:|
| Fontes primárias lidas integralmente | 2 |
| Linhas físicas das fontes | 636 |
| Requisitos/enunciados candidatos | 60 |
| Atores/papéis | 9 |
| Conceitos | 25 |
| Relações de domínio | 20 |
| Regras de negócio | 13 |
| Fluxos | 10 |
| Itens de tela/estado/componente | 17 |
| Relações da matriz de cobertura | 414 |
| Achados | 22 |
| Conflitos documentais estritos | 0 |
| Perguntas | 28 |

## Artefatos criados, movidos ou alterados

| Caminho | Ação | Finalidade | Estado final |
|---|---|---|---|
| `docs/plans/active/auditoria-contrato-matematico-calibracao-algoritmo.md` | origem removida pelo movimento autorizado | arquivar a Etapa 5 | não existe mais no caminho ativo |
| `docs/plans/completed/auditoria-contrato-matematico-calibracao-algoritmo.md` | movido e alterado | registrar aprovação, conclusão, limites e checksum da Etapa 5 | `CONCLUIDO`; registro `ARQUIVADO` |
| `docs/reports/audits/2026-08-25-auditoria-contrato-matematico-calibracao-algoritmo.md` | alterado | promover somente como relatório analítico aprovado | `CANONICO_ATUAL` analítico |
| `docs/plans/active/auditoria-requisitos-dominio-wireframes.md` | criado | planejar/evidenciar a Etapa 6 | `AGUARDANDO_REVISAO` ao ponto de parada |
| `docs/reports/audits/2026-08-26-auditoria-requisitos-dominio-wireframes.md` | criado | registrar esta auditoria | `EM_REVISAO` |
| `docs/governance/DOCUMENT_REGISTER.md` | alterado | registrar transições e os dois novos IDs | `CANONICO_ATUAL` de controle; correspondência 30/30 |

## Integridade de `docs/raw/`

| Arquivo | Tipo | Bytes | Permissão | `mtime` | SHA-256 final |
|---|---|---:|---:|---|---|
| `algoritmo-operacional-hidroflorestas-mvp.md` | arquivo regular | 7336 | 664 | 2026-08-24 01:21:01.736029435 -0300 | `896298b12bdce0b1970b2356756296aaf6b11cc481c76567775147d1ed52b2b6` |
| `backlog-hidroflorestas-mvp.md` | arquivo regular | 10216 | 664 | 2026-08-24 01:37:06.676653600 -0300 | `06dbbc47c88d740e824cf6c070300cb61e5ce3a220f7283ffdd82e259f48a2db` |
| `definicao-dos-requisitos-da-plataforma-hidroflorestas.md` | arquivo regular | 7821 | 664 | 2026-08-24 01:26:23.894908873 -0300 | `bfa351db96acfe044671f66ffb27c758292572805085491e1d5da9393a5c8bbf` |
| `dicionario-de-dados.md` | arquivo regular | 6517 | 664 | 2026-08-24 01:18:29.210669986 -0300 | `c60f1b8773d0f64c9ecc5eeff5f5c7931868790595fa9c8c63011bc6a4528ad1` |
| `especificacao-tecnica-sistema-plataforma-hidroflorestas-mvp.md` | arquivo regular | 6689 | 664 | 2026-08-24 01:33:59.494982674 -0300 | `0497d60c2d9a57363bd3f2d9ae8d68900c7e4680f34ea5761bc29595cad2e776` |
| `matriz-de-variaveis-do-ihfr.md` | arquivo regular | 5737 | 664 | 2026-08-22 23:48:37.474134076 -0300 | `dd2a40af070bdff1a44367aab7d868e2cd6cacd7c8e8588dfdf17fcb494973b4` |
| `modelo-cientifico-do-ihfr.md` | arquivo regular | 8172 | 664 | 2026-08-22 23:12:45.349289094 -0300 | `c90147a321306d2ec7f5ffce55cc7d7cce3e343555e4d16f3ea9a39f79ee4dd5` |
| `modelo-conceitual-do-ihfr.md` | arquivo regular | 5520 | 664 | 2026-08-22 23:12:50.497116536 -0300 | `157d256a4db4b725ed7f277780fa234ee81ba60ae4582bfe0c93b34d6a68603a` |
| `modelo-regional-do-ihfr-calibracao-ecologica-baixo-itapecuru-maranhao.md` | arquivo regular | 5330 | 664 | 2026-08-23 00:01:16.576224639 -0300 | `b6671cac4ae1600c678af25e89db087d897b054c0d449b53f91bcbcca0c0b8ab` |
| `protocolo-de-campo-do-ihfr.md` | arquivo regular | 5627 | 664 | 2026-08-23 00:07:22.883088570 -0300 | `026045aa408c784f5a4c4ece0285e445b792ccd571cc5d6f596c2b0850e166ca` |
| `roadmap-tecnologico-arquitetura-recomendada-hidroflorestas.md` | arquivo regular | 5892 | 664 | 2026-08-24 01:31:41.341748799 -0300 | `633de150a6b35d372f9f76341a441b7fb2a87114528e2e74c42cd6982723b93c` |
| `specificacao-do-ihfr-v0-1-mvp-contrato-matematico.md` | arquivo regular | 7202 | 664 | 2026-08-22 23:56:47.099012128 -0300 | `d2382cf17561f557bbd70201875d08c554740a01bb31448f0d0713c8dd8f117a` |
| `wireframes-funcionais-mvp-plataforma-hidroflorestas.md` | arquivo regular | 5826 | 664 | 2026-08-24 01:29:39.720661813 -0300 | `80f2a41632c401a041503d4a001cd498e5e5ff1f8bb15bd47eb6c9151e31ac1b` |

Resultado: 13/13 caminhos, tipos, tamanhos, permissões, `mtime` e SHA-256 coincidem com o estado inicial; `git diff -- docs/raw` está vazio.

## Verificações executadas

| Verificação | Comando/método | Resultado |
|---|---|---|
| Estado inicial | `git status --short`, `git rev-parse HEAD`, `git branch --show-current` | árvore inicialmente limpa; commit `e10b0b01c28906be7a046504c68334957dc6efe1`; branch `development` |
| Preflight Etapa 5 | leitura integral de plano/relatório, contagens, estados e limites | aprovado; sem inconsistência material |
| Checksums Etapa 5 | `sha256sum` | `DOC-PLAN-004` = `4d5a26...d8b0b`; `DOC-010` = `ded7d824...78e21`; registro coincidente |
| Corpus da Etapa 6 | `nl -ba`, `wc -l` | 004 com 291 e 014 com 345 linhas; 636 totais, lidas integralmente |
| Sequências e referências | verificação efêmera em Node.js dos nove namespaces | sequências completas e únicas: 60/9/25/20/13/10/17/22/28; todos os IDs referenciados existem |
| Contagens dos requisitos | extração mecânica da tabela mestra/suficiência | tipos totalizam 60; suficiência 4/45/7/4/0; classificação 51/6/3; aprovação 0/60 |
| Cobertura | extração mecânica dos estados | 414 relações: 144 CE, 125 CP, 45 CI, 28 NC, 62 NA e 10 AM |
| Achados | extração mecânica de tipo/impacto/estado | 22; sínteses coincidentes e zero conflitos estritos |
| Fontes/localizadores | contagem das tabelas mestras e revisão dos localizadores | todos os 60 requisitos, 9 papéis, 25 conceitos, 13 regras, 10 fluxos e 17 telas têm fonte/localizador |
| Registro documental | comparação mecânica das duas tabelas e teste dos caminhos | correspondência 30/30, IDs únicos, mesma ordem e caminhos existentes |
| Links Markdown locais | extração/resolução relativa em cinco arquivos finais | 3 links locais; nenhum destino ausente |
| Estrutura de tabelas | comparação mecânica da quantidade de colunas por bloco | nenhuma linha divergente |
| Integridade de `docs/raw/` | `sha256sum`, `stat`, confronto com estado inicial e `git diff -- docs/raw` | 13/13 idênticos; delta vazio |
| Escopo Git | `git status --short --untracked-files=all` e confronto com lista autorizada | somente cinco destinos finais autorizados e a origem removida do movimento |
| Whitespace | `git diff --check` e `git diff --no-index --check` nos arquivos novos | aprovado; nenhuma mensagem de erro |
| Implementação/autoridade | buscas direcionadas e revisão | implementação somente `NAO_AVALIADO`; nenhum requisito/tela aprovado sem origem; nenhum modelo de laboratório escolhido |
| Figma | corpus/registro e termos de governança | nenhum artefato concreto; `GAP-008` opcional/não bloqueante e `PD-017` aberta |
| Segurança | busca por padrões de chave/segredo/token e revisão dos exemplos | nenhum segredo, credencial real ou dado pessoal desnecessário localizado; nomes demonstrativos não foram tratados como dados reais |
| Lint Markdown | busca por configuração existente | não executado; `rg` e configuração de Markdown lint não estão disponíveis; nenhuma ferramenta/dependência instalada |

## Alterações preexistentes

O `git status --short` inicial estava vazio. Não havia alteração preexistente a conciliar; o corpus e os caminhos fora do escopo foram preservados.

## Diff resumido

- 1 plano da Etapa 5 movido do diretório ativo para o concluído e atualizado.
- 1 relatório da Etapa 5 alterado somente para registrar aprovação analítica.
- 1 plano e 1 relatório da Etapa 6 criados.
- 1 registro canônico de controle alterado.
- 5 destinos finais afetados, além da origem removida do movimento; nenhum caminho fora da lista autorizada.

## Limitações e bloqueios

- **Bloqueio de execução:** nenhum identificado.
- **Bloqueios para normatização:** nove achados e as autoridades/decisões em `PD-002`–`005` e `PD-014`–`017`; não impedem concluir a auditoria.
- **Entrada opcional ausente:** nenhum artefato concreto de Figma; `GAP-008` permanece `OPCIONAL_NAO_BLOQUEANTE`.
- Ausência significa somente “não localizado nas 636 linhas do corpus primário ou nos registros auxiliares permitidos”.
- Não houve fonte externa, comparação com implementação, inspeção de código, banco, schema, migration ou teste.
- Nenhuma relação inferida representa modelo normativo, obrigação de implementação ou decisão da equipe.

## Ponto de parada

Etapa 6 concluída documentalmente e aprovada exclusivamente em seu caráter analítico. A auditoria parou antes de qualquer aprovação normativa, atualização normativa, alteração da matriz/pendências ou comparação com implementação. O plano relacionado está `CONCLUIDO` e arquivado, este relatório está `CANONICO_ATUAL` exclusivamente como análise aprovada e Figma permanece opcional/não bloqueante.
