# Auditoria documental de dados, arquitetura e execução histórica

## Identificação, estado e limites

- **Identificador:** `DOC-012`
- **Estado documental:** `EM_REVISAO`
- **Data:** 2026-08-26
- **Plano:** [`DOC-PLAN-006`](../../plans/active/auditoria-dados-arquitetura-execucao.md)
- **Fontes primárias:** `DOC-RAW-003`, `DOC-RAW-005`, `DOC-RAW-006` e `DOC-RAW-012`
- **Responsável pela execução:** agente mantenedor
- **Autoridades de produto, dados, arquitetura e ciência:** não especificadas; `PD-002`, `PD-003`, `PD-004` e `PD-006`
- **Natureza:** relatório analítico de auditoria documental interna
- **Autoridade normativa:** nenhuma sobre requisitos, dados, ciência, algoritmo, arquitetura ou roadmap

Este relatório registra o conteúdo histórico das quatro fontes e o confronta apenas com os relatórios analíticos aprovados das Etapas 4 a 6 e os registros canônicos permitidos. Não compara documentação com código, não verifica implementação, não define modelo de dados ou arquitetura normativa, não escolhe tecnologia, não resolve pendências, não altera `TRACEABILITY_MATRIX.md` e não inicia a Etapa 8.

Declarações localizadas são fatos sobre o conteúdo da fonte, não sobre vigência ou implementação. Recomendações históricas continuam `PROPOSTA` ou `RECOMENDACAO`; decisões técnicas atuais mantêm o estado registrado em `TECH_DECISIONS.md`; todas as alegações de uso ou capacidade permanecem `NAO_AVALIADO`. `EVIDENCIA_IMPLEMENTACAO` não é usada.

## Método e alcance

As quatro fontes foram lidas integralmente: 400 linhas de backlog, 285 de dicionário, 365 de especificação e 305 de roadmap, totalizando 1355 linhas físicas. Foram percorridos títulos, histórias, critérios, tabelas, campos, enums, diagramas, fórmulas, endpoints, recomendações, fases e itens futuros. Outros documentos de `docs/raw/` não foram reabertos em profundidade.

Os localizadores abreviados são `003:Lx-Ly`, `005:Lx-Ly`, `006:Lx-Ly` e `012:Lx-Ly`. Relações derivadas estão marcadas `INFERENCIA`; nenhuma ausência foi completada. O critério estrito de conflito foi aplicado considerando assunto, aplicabilidade, período/versão, incompatibilidade e autoridade.

## Fontes e proveniência

| ID | Título/caminho | Extensão da leitura | Versão/data/responsável/aprovação | SHA-256 e limite de autoridade |
|---|---|---|---|---|
| `DOC-RAW-003` | “BACKLOG — HIDROFLORESTAS (MVP)”; `docs/raw/backlog-hidroflorestas-mvp.md` | integral, 400 linhas | todos não especificados, exceto “MVP” no título | `06dbbc47c88d740e824cf6c070300cb61e5ce3a220f7283ffdd82e259f48a2db`; backlog histórico não aprova requisito nem estado |
| `DOC-RAW-005` | “PLATAFORMA HIDROFLORESTAS — MVP”; `docs/raw/dicionario-de-dados.md` | integral, 285 linhas | versão/data/responsável/aprovação não especificados | `c60f1b8773d0f64c9ecc5eeff5f5c7931868790595fa9c8c63011bc6a4528ad1`; dicionário histórico não é modelo canônico |
| `DOC-RAW-006` | “ESPECIFICAÇÃO TÉCNICA DO SISTEMA”; `docs/raw/especificacao-tecnica-sistema-plataforma-hidroflorestas-mvp.md` | integral, 365 linhas | versão documental 1.0; data/responsável/aprovação não especificados | `0497d60c2d9a57363bd3f2d9ae8d68900c7e4680f34ea5761bc29595cad2e776`; especificação histórica não confirma arquitetura atual |
| `DOC-RAW-012` | “ROADMAP TECNOLÓGICO PLATAFORMA HIDROFLORESTAS”; `docs/raw/roadmap-tecnologico-arquitetura-recomendada-hidroflorestas.md` | integral, 305 linhas | versão/data/responsável/aprovação não especificados | `633de150a6b35d372f9f76341a441b7fb2a87114528e2e74c42cd6982723b93c`; roadmap e arquitetura recomendada são propostas |

Nenhuma fonte declara relação de substituição, precedência ou aprovação entre si.

## Inventário do backlog

### Identidade dos itens

Prioridade e estado declarado estão `NAO_ESPECIFICADO` para os 34 itens. A fase é `MVP` apenas porque o título da fonte delimita o documento; nenhuma história possui versão individual. Descrição é representada pelo título e pelo objetivo “Como/Quero/Para” quando presente.

| ID | ID original e título | Épico | Ator literal | Fase; prioridade; estado | Fonte/localizador |
|---|---|---|---|---|---|
| `BLG-001` | `US1.1` Login com email e senha | 1 Autenticação/perfis | usuário | MVP; NE; NE | 003:L9-L20 |
| `BLG-002` | `US1.2` Controle de acesso por papel | 1 | admin/field_user | MVP; NE; NE | 003:L21-L32 |
| `BLG-003` | `US2.1` Criar área com dados básicos | 2 Áreas/mapa | usuário | MVP; NE; NE | 003:L37-L48 |
| `BLG-004` | `US2.2` Desenhar polígono no mapa | 2 | usuário | MVP; NE; NE | 003:L49-L60 |
| `BLG-005` | `US2.3` Marcar ponto no mapa | 2 | usuário | MVP; NE; NE | 003:L61-L71 |
| `BLG-006` | `US2.4` Editar área cadastrada | 2 | usuário | MVP; NE; NE | 003:L72-L82 |
| `BLG-007` | `US3.1` Criar diagnóstico (`Survey`) | 3 Coleta modular | usuário | MVP; NE; NE | 003:L87-L97 |
| `BLG-008` | `US3.2` Formulário Água | 3 | usuário | MVP; NE; NE | 003:L98-L109 |
| `BLG-009` | `US3.3` Formulário Solo | 3 | usuário | MVP; NE; NE | 003:L110-L121 |
| `BLG-010` | `US3.4` Formulário Vegetação/Paisagem | 3 | usuário | MVP; NE; NE | 003:L122-L133 |
| `BLG-011` | `US3.5` Formulário Território/Contexto | 3 | usuário | MVP; NE; NE | 003:L134-L144 |
| `BLG-012` | `US3.6` Salvamento incremental/rascunho | 3 | usuário | MVP; NE; NE | 003:L145-L156 |
| `BLG-013` | `US4.1` Normalizar variáveis em risco 0–1 | 4 Motor IHFR | sistema | MVP; NE; NE | 003:L161-L171 |
| `BLG-014` | `US4.2` Calcular dimensões W/S/V/T | 4 | sistema | MVP; NE; NE | 003:L172-L182 |
| `BLG-015` | `US4.3` Calcular IHFR final e classe | 4 | sistema | MVP; NE; NE | 003:L183-L194 |
| `BLG-016` | `US4.4` Calcular `data_quality` | 4 | sistema | MVP; NE; NE | 003:L195-L205 |
| `BLG-017` | `US4.5` Persistir trilha completa | 4 | sistema | MVP; NE; NE | 003:L206-L217 |
| `BLG-018` | `US5.1` Selecionar dois drivers | 5 Interpretação/recomendação | sistema | MVP; NE; NE | 003:L222-L232 |
| `BLG-019` | `US5.2` Gerar explicação por templates | 5 | sistema | MVP; NE; NE | 003:L233-L243 |
| `BLG-020` | `US5.3` Gerar recomendações condicionais | 5 | sistema | MVP; NE; NE | 003:L244-L254 |
| `BLG-021` | `US6.1` Exibir score, classe e componentes | 6 Resultado | usuário | MVP; NE; NE | 003:L259-L270 |
| `BLG-022` | `US6.2` Exibir explicação/recomendações | 6 | usuário | MVP; NE; NE | 003:L271-L282 |
| `BLG-023` | `US7.1` Lista de áreas com último IHFR | 7 Dashboard/histórico | usuário | MVP; NE; NE | 003:L287-L297 |
| `BLG-024` | `US7.2` Histórico por área | 7 | usuário | MVP; NE; NE | 003:L298-L308 |
| `BLG-025` | `US7.3` Mapa com cores por classe | 7 | usuário | MVP; NE; NE | 003:L309-L320 |
| `BLG-026` | `US7.4` Alertas automáticos simples | 7 | usuário | MVP; NE; NE | 003:L321-L332 |
| `BLG-027` | `US8.1` Endpoints de autenticação | 8 API/integração | não especificado | MVP; NE; NE | 003:L337-L346 |
| `BLG-028` | `US8.2` Endpoints de áreas | 8 | não especificado | MVP; NE; NE | 003:L347-L353 |
| `BLG-029` | `US8.3` Endpoints de diagnósticos/dados | 8 | não especificado | MVP; NE; NE | 003:L354-L361 |
| `BLG-030` | `US8.4` Endpoint de cálculo | 8 | não especificado | MVP; NE; NE | 003:L362-L369 |
| `BLG-031` | `US8.5` Endpoints de histórico/alertas | 8 | não especificado | MVP; NE; NE | 003:L370-L374 |
| `BLG-032` | `US9.1` Testes unitários do IHFR | 9 Qualidade/testes/deploy | não especificado | MVP; NE; NE | 003:L379-L386 |
| `BLG-033` | `US9.2` Logs e rastreabilidade | 9 | não especificado | MVP; NE; NE | 003:L387-L393 |
| `BLG-034` | `US9.3` Deploy MVP | 9 | não especificado | MVP; NE; NE | 003:L394-L400 |

### Critérios, dependências, classificação e suficiência

Legenda: `FD/P/NE` = `FATO_DOCUMENTADO`, suficiência `PARCIAL`, aprovação `NAO_ESPECIFICADO`. Todas as histórias recebem essa combinação: possuem objetivo ou critério localizável, mas nenhuma registra proveniência/aprovação/prioridade/estado e todas omitem ao menos um aspecto operacional material. “Alegação” registra conclusão/implementação, não o comportamento desejado.

| ID | Critério de aceitação resumido | Requisito Etapa 6 | Dependência científica | Dependência de dados | Dependência arquitetural | Alegação; classe/suficiência/aprovação |
|---|---|---|---|---|---|---|
| `BLG-001` | sucesso, erro e persistência de sessão | `PROD-REQ-028` | não aplicável | `USER.email/password_hash` | autenticação/API | não localizada; FD/P/NE |
| `BLG-002` | visibilidade por papel e validação backend | `PROD-REQ-039`–`041` | não aplicável | `USER.role`, propriedade de Área | autorização | não localizada; FD/P/NE |
| `BLG-003` | cinco campos, lista/mapa e centroide | `PROD-REQ-010`–`012`,`032`,`043` | `VAR-016` para uso | `AREA` | mapa/persistência | não localizada; FD/P/NE |
| `BLG-004` | salvar polígono e área ha opcional/manual | `PROD-REQ-012`,`038` | não aplicável | geometry/area_size | mapas/geoprocessamento | não localizada; FD/P/NE |
| `BLG-005` | salvar ponto e mostrar marcador | `PROD-REQ-012`,`038` | não aplicável | geometry | mapas | não localizada; FD/P/NE |
| `BLG-006` | atualizar/persistir/refletir no mapa | `PROD-REQ-039` parcial | não aplicável | `AREA`; ciclo ausente | API/mapas | não localizada; FD/P/NE |
| `BLG-007` | vincular área/usuário, data e notas | `PROD-REQ-044`; `036` parcial | protocolo por `DOC-009` | `SURVEY` | persistência/API | não localizada; FD/P/NE |
| `BLG-008` | três campos obrigatórios, dois opcionais | `PROD-REQ-020`,`046` | `VAR-001`–`005`; `PD-002` | `WATER_DATA` | formulário/API | não localizada; FD/P/NE |
| `BLG-009` | quatro obrigatórios, um opcional, faixas | `PROD-REQ-021`,`045` | `VAR-006`–`010`; `PD-002` | `SOIL_DATA` | formulário/API | não localizada; FD/P/NE |
| `BLG-010` | três obrigatórios, APP opcional, faixa | `PROD-REQ-022`,`047` | `VAR-011`–`014`; `PD-002` | `VEGETATION_DATA` | formulário/API | não localizada; FD/P/NE |
| `BLG-011` | uso obrigatório e slope opcional | `PROD-REQ-010`,`033` parcial | `VAR-015`,`016`; `PD-002` | `AREA`,`TERRAIN_DATA` | formulário/API | não localizada; FD/P/NE |
| `BLG-012` | salvar `draft` e retomar preenchido | `PROD-REQ-056`,`057` | não aplicável | estado de Survey ausente | offline/sincronização | não localizada; FD/P/NE |
| `BLG-013` | mapear scores e bloquear fora de faixa | `PROD-REQ-023`,`051` | `DOC-010`; `PD-002` | 17 campos científicos | motor IHFR | não localizada; FD/P/NE |
| `BLG-014` | média e mínimo de duas variáveis | `PROD-REQ-023`,`035`,`051` | `MATH-FND-007`,`010`; `PD-002` | campos/scores | motor IHFR | não localizada; FD/P/NE |
| `BLG-015` | média, classe e insuficiente | `PROD-REQ-023`,`024`,`051` | `MATH-FND-003`,`011`; `PD-002` | `IHFR_RESULT` | motor IHFR | não localizada; FD/P/NE |
| `BLG-016` | cinco essenciais e high/medium/low | não localizada diretamente | `MATH-FND-006`; `PD-002` | `data_quality` | motor IHFR | não localizada; FD/P/NE |
| `BLG-017` | raw, scores, resultado, qualidade e versão | `PROD-REQ-050`,`058`,`059` | `MATH-FND-018`,`019` | Survey/módulos/Result | persistência/API | não localizada; FD/P/NE |
| `BLG-018` | ordenar dimensões e retornar duas | não localizado diretamente | `MATH-FND-017`; `PD-002` | drivers ausentes | motor/recomendação | não localizada; FD/P/NE |
| `BLG-019` | citar drivers e avisar baixa qualidade | `PROD-REQ-024`,`060` | `MATH-FND-017` | explanation; drivers ausentes | templates backend | não localizada; FD/P/NE |
| `BLG-020` | lista varia por classe/drivers | `PROD-REQ-025` | `DOC-009`,`010`; `PD-002` | recomendações ausentes | motor de recomendação | não localizada; FD/P/NE |
| `BLG-021` | score/classe/componentes/qualidade/versão | `PROD-REQ-024`,`035`,`048`,`050` | `DOC-010` | `IHFR_RESULT` | frontend/API | não localizada; FD/P/NE |
| `BLG-022` | texto/lista e ações salvar/voltar | `PROD-REQ-024`,`025`,`036`,`037` | `DOC-009`,`010` | explanation; recomendações ausentes | frontend/API | não localizada; FD/P/NE |
| `BLG-023` | área, última classe/data e navegação | `PROD-REQ-003`,`006`,`009` | classe sob `PD-002` | AREA/RESULT | dashboard/API | não localizada; FD/P/NE |
| `BLG-024` | lista por data e gráfico opcional | `PROD-REQ-006` | não aplicável diretamente | SURVEY/RESULT | histórico/visualização | não localizada; FD/P/NE |
| `BLG-025` | áreas, cor por classe e legenda | `PROD-REQ-008`,`009`,`038` | classe sob `PD-002` | geometry/class | mapas | não localizada; FD/P/NE |
| `BLG-026` | limiar crítico e salinidade confirmada | `PROD-REQ-007`,`049` | `PD-002` | ALERTS/salinidade | regras/backend/dashboard | não localizada; FD/P/NE |
| `BLG-027` | POST login/GET me, sessão/JWT e role | `PROD-REQ-028`,`039`–`042` | não aplicável | USER | contrato/auth | não localizada; FD/P/NE |
| `BLG-028` | criar/listar/obter/atualizar área | `PROD-REQ-010`,`012`,`032`,`039`,`040`,`043` | não aplicável | AREA | API | não localizada; FD/P/NE |
| `BLG-029` | criar Survey e quatro módulos | `PROD-REQ-033`,`044`–`047` | `DOC-009`; `PD-002` | SURVEY e módulos | API | não localizada; FD/P/NE |
| `BLG-030` | calcular e retornar payload padrão | `PROD-REQ-023`,`024`,`034`,`035` | `DOC-010`; `PD-002` | RESULT | API/motor | não localizada; FD/P/NE |
| `BLG-031` | obter histórico e alertas | `PROD-REQ-006`,`007`,`049` | alertas sob `PD-002` | RESULT/ALERTS | API | não localizada; FD/P/NE |
| `BLG-032` | testes de normalização/classes/missing | `PROD-REQ-058` parcial | `DOC-010` | fixtures não especificadas | testes | não localizada; FD/P/NE |
| `BLG-033` | logar validação e cálculo | `PROD-REQ-058`,`059` parcial | reprodutibilidade `DOC-010` | log não modelado | observabilidade | não localizada; FD/P/NE |
| `BLG-034` | staging, production e instalação | não localizado diretamente | não aplicável | não aplicável | deploy/ambientes | não localizada; FD/P/NE |

### Síntese do backlog

| Dimensão | Distribuição |
|---|---|
| Itens/épicos | 34 histórias em 9 épicos |
| Prioridade | 34 `NAO_ESPECIFICADO` |
| Estado declarado | 34 `NAO_ESPECIFICADO`; zero “feito/concluído” |
| Fase | 34 vinculados documentalmente ao MVP; cinco contêm opção/condição interna ou dependência de decisão |
| Classificação | 34 `FATO_DOCUMENTADO` sobre o backlog histórico |
| Suficiência | 34 `PARCIAL` |
| Aprovação | 34 `NAO_ESPECIFICADO`; zero aprovados com origem |
| Critérios | 34 com algum critério/lista; `BLG-028`,`029`,`031` têm apenas endpoints e `BLG-032`–`034` não têm formulação Como/Quero/Para |
| Alegações de conclusão | 0; critérios são comportamento desejado, não evidência de implementação |

## Inventário do dicionário de dados

### Entidades ou agregados históricos

| ID | Nome/descrição | Campos | Chaves/relações/ciclo | Fonte/localizador | Classificação; aprovação |
|---|---|---:|---|---|---|
| `DATA-ENT-001` | `USER`, usuários da plataforma | 8 | `id` é identificador, mas PK/unique não são declaradas; criação/atualização presentes | 005:L12-L31 | `FATO_DOCUMENTADO`; `NAO_ESPECIFICADO` |
| `DATA-ENT-002` | `AREA`, área cadastrada para diagnóstico | 11 | `user_id` associa usuário; criação presente; propriedade/ciclo ausentes | 005:L33-L59 | `FATO_DOCUMENTADO`; `NAO_ESPECIFICADO` |
| `DATA-ENT-003` | `SURVEY`, diagnóstico/coleta de campo | 6 | `area_id`/`user_id`; data/criação; estado e ciclo ausentes | 005:L61-L72 | `FATO_DOCUMENTADO`; `NAO_ESPECIFICADO` |
| `DATA-ENT-004` | `WATER_DATA`, dados hídricos | 7 | `survey_id`; ciclo/versionamento ausentes | 005:L74-L109 | `FATO_DOCUMENTADO`; `NAO_ESPECIFICADO` |
| `DATA-ENT-005` | `SOIL_DATA`, dados do solo | 7 | `survey_id`; ciclo/versionamento ausentes | 005:L111-L143 | `FATO_DOCUMENTADO`; `NAO_ESPECIFICADO` |
| `DATA-ENT-006` | `VEGETATION_DATA`, vegetação/paisagem | 6 | `survey_id`; ciclo/versionamento ausentes | 005:L145-L170 | `FATO_DOCUMENTADO`; `NAO_ESPECIFICADO` |
| `DATA-ENT-007` | `TERRAIN_DATA`, contexto territorial | 5 | `survey_id`; ciclo/versionamento ausentes | 005:L172-L182 | `FATO_DOCUMENTADO`; `NAO_ESPECIFICADO` |
| `DATA-ENT-008` | `IHFR_RESULT`, resultado do índice | 12 | `survey_id`; versão/criação presentes; recálculo/invalidação ausentes | 005:L184-L214 | `FATO_DOCUMENTADO`; `NAO_ESPECIFICADO` |
| `DATA-ENT-009` | `ALERTS`, alertas automáticos | 7 | `area_id`/`ihfr_result_id`; criação presente; reconhecimento/encerramento ausentes | 005:L216-L235 | `FATO_DOCUMENTADO`; `NAO_ESPECIFICADO` |

Não foram localizadas entidades de organização, laboratório, assinante, membro, assinatura, papel contextual, histórico de alteração, trilha de auditoria, recomendação ou sincronização. `USER.organization` é texto opcional, não entidade nem fronteira de isolamento.

### Campos

Todos os 69 campos abaixo são `FATO_DOCUMENTADO` sobre `DOC-RAW-005`, com aprovação `NAO_ESPECIFICADO`. “Req.” registra a obrigatoriedade literal; não implica requisito aprovado.

| ID | Entidade.campo | Tipo | Req. | Descrição/unidade ou enum | Fonte/localizador |
|---|---|---|---|---|---|
| `DATA-FLD-001` | USER.id | UUID | sim | identificador único | 005:L16-L25 |
| `DATA-FLD-002` | USER.name | string | sim | nome | 005:L16-L25 |
| `DATA-FLD-003` | USER.email | string | sim | email de login | 005:L16-L25 |
| `DATA-FLD-004` | USER.password_hash | string | sim | senha criptografada | 005:L16-L25 |
| `DATA-FLD-005` | USER.role | enum | sim | admin/technician/field_user | 005:L16-L31 |
| `DATA-FLD-006` | USER.organization | string | não | instituição ou grupo | 005:L16-L25 |
| `DATA-FLD-007` | USER.created_at | datetime | sim | criação | 005:L16-L25 |
| `DATA-FLD-008` | USER.updated_at | datetime | sim | atualização | 005:L16-L25 |
| `DATA-FLD-009` | AREA.id | UUID | sim | identificador | 005:L37-L49 |
| `DATA-FLD-010` | AREA.user_id | UUID | sim | usuário responsável | 005:L37-L49 |
| `DATA-FLD-011` | AREA.area_name | string | sim | nome da área | 005:L37-L49 |
| `DATA-FLD-012` | AREA.municipality | string | sim | município | 005:L37-L49 |
| `DATA-FLD-013` | AREA.state | string | sim | estado | 005:L37-L49 |
| `DATA-FLD-014` | AREA.geometry | geometry | sim | polígono ou ponto; CRS não especificado | 005:L37-L49 |
| `DATA-FLD-015` | AREA.centroid_lat | float | sim | latitude; unidade/CRS/faixa ausentes | 005:L37-L49 |
| `DATA-FLD-016` | AREA.centroid_lon | float | sim | longitude; unidade/CRS/faixa ausentes | 005:L37-L49 |
| `DATA-FLD-017` | AREA.area_size_ha | float | não | tamanho em ha | 005:L37-L49 |
| `DATA-FLD-018` | AREA.land_use_type | enum | sim | sete usos declarados | 005:L37-L59 |
| `DATA-FLD-019` | AREA.created_at | datetime | sim | criação | 005:L37-L49 |
| `DATA-FLD-020` | SURVEY.id | UUID | sim | identificador | 005:L65-L70 |
| `DATA-FLD-021` | SURVEY.area_id | UUID | sim | área analisada | 005:L65-L70 |
| `DATA-FLD-022` | SURVEY.user_id | UUID | sim | usuário executor | 005:L65-L70 |
| `DATA-FLD-023` | SURVEY.survey_date | date | sim | data da coleta | 005:L65-L70 |
| `DATA-FLD-024` | SURVEY.notes | text | não | observações | 005:L65-L70 |
| `DATA-FLD-025` | SURVEY.created_at | datetime | sim | registro | 005:L65-L70 |
| `DATA-FLD-026` | WATER_DATA.id | UUID | sim | identificador | 005:L78-L86 |
| `DATA-FLD-027` | WATER_DATA.survey_id | UUID | sim | diagnóstico associado | 005:L78-L86 |
| `DATA-FLD-028` | WATER_DATA.water_source_type | enum | sim | seis fontes | 005:L78-L99 |
| `DATA-FLD-029` | WATER_DATA.has_spring | boolean | sim | presença de nascente | 005:L78-L86 |
| `DATA-FLD-030` | WATER_DATA.well_depth_m | float | não | profundidade, m | 005:L78-L86 |
| `DATA-FLD-031` | WATER_DATA.water_availability | enum | sim | permanent/seasonal/scarce | 005:L78-L104 |
| `DATA-FLD-032` | WATER_DATA.salinity_indicator | enum | não | none/suspected/confirmed | 005:L78-L109 |
| `DATA-FLD-033` | SOIL_DATA.id | UUID | sim | identificador | 005:L115-L123 |
| `DATA-FLD-034` | SOIL_DATA.survey_id | UUID | sim | diagnóstico | 005:L115-L123 |
| `DATA-FLD-035` | SOIL_DATA.soil_texture | enum | sim | sandy/medium/clayey | 005:L115-L132 |
| `DATA-FLD-036` | SOIL_DATA.infiltration_rate_mm_h | float | sim | taxa, mm/h | 005:L115-L123 |
| `DATA-FLD-037` | SOIL_DATA.compaction_level | enum | sim | low/moderate/high | 005:L115-L137 |
| `DATA-FLD-038` | SOIL_DATA.erosion_signs | enum | sim | none/laminar/rills_gullies | 005:L115-L143 |
| `DATA-FLD-039` | SOIL_DATA.soil_exposed_percent | float | não | solo exposto, % | 005:L115-L123 |
| `DATA-FLD-040` | VEGETATION_DATA.id | UUID | sim | identificador | 005:L149-L156 |
| `DATA-FLD-041` | VEGETATION_DATA.survey_id | UUID | sim | diagnóstico | 005:L149-L156 |
| `DATA-FLD-042` | VEGETATION_DATA.vegetation_cover_percent | float | sim | cobertura, % | 005:L149-L156 |
| `DATA-FLD-043` | VEGETATION_DATA.fragmentation_level | enum | sim | low/moderate/high | 005:L149-L164 |
| `DATA-FLD-044` | VEGETATION_DATA.has_riparian_app | boolean | não | presença de APP | 005:L149-L156 |
| `DATA-FLD-045` | VEGETATION_DATA.landscape_degradation | enum | sim | low/moderate/high | 005:L149-L170 |
| `DATA-FLD-046` | TERRAIN_DATA.id | UUID | sim | identificador | 005:L176-L181 |
| `DATA-FLD-047` | TERRAIN_DATA.survey_id | UUID | sim | diagnóstico | 005:L176-L181 |
| `DATA-FLD-048` | TERRAIN_DATA.slope_percent | float | não | declividade, % | 005:L176-L181 |
| `DATA-FLD-049` | TERRAIN_DATA.elevation_m | float | não | altitude, m | 005:L176-L181 |
| `DATA-FLD-050` | TERRAIN_DATA.drainage_density | float | não | densidade; unidade/direção ausentes | 005:L176-L181 |
| `DATA-FLD-051` | IHFR_RESULT.id | UUID | sim | identificador | 005:L188-L201 |
| `DATA-FLD-052` | IHFR_RESULT.survey_id | UUID | sim | diagnóstico associado | 005:L188-L201 |
| `DATA-FLD-053` | IHFR_RESULT.ihfr_score | float | sim | valor do índice | 005:L188-L201 |
| `DATA-FLD-054` | IHFR_RESULT.ihfr_class | enum | sim | baixo/moderado/alto/crítico | 005:L188-L208 |
| `DATA-FLD-055` | IHFR_RESULT.water_score | float | sim | componente água | 005:L188-L201 |
| `DATA-FLD-056` | IHFR_RESULT.soil_score | float | sim | componente solo | 005:L188-L201 |
| `DATA-FLD-057` | IHFR_RESULT.vegetation_score | float | sim | componente vegetação | 005:L188-L201 |
| `DATA-FLD-058` | IHFR_RESULT.territory_score | float | sim | componente território | 005:L188-L201 |
| `DATA-FLD-059` | IHFR_RESULT.data_quality | enum | sim | high/medium/low | 005:L188-L214 |
| `DATA-FLD-060` | IHFR_RESULT.algorithm_version | string | sim | versão do algoritmo | 005:L188-L201 |
| `DATA-FLD-061` | IHFR_RESULT.explanation | text | sim | interpretação | 005:L188-L201 |
| `DATA-FLD-062` | IHFR_RESULT.created_at | datetime | sim | data do cálculo | 005:L188-L201 |
| `DATA-FLD-063` | ALERTS.id | UUID | sim | identificador | 005:L220-L228 |
| `DATA-FLD-064` | ALERTS.area_id | UUID | sim | área associada | 005:L220-L228 |
| `DATA-FLD-065` | ALERTS.ihfr_result_id | UUID | sim | diagnóstico/resultado | 005:L220-L228 |
| `DATA-FLD-066` | ALERTS.alert_type | enum | sim | quatro tipos | 005:L220-L235 |
| `DATA-FLD-067` | ALERTS.severity | enum | sim | valores permitidos não especificados | 005:L220-L228 |
| `DATA-FLD-068` | ALERTS.message | text | sim | descrição | 005:L220-L228 |
| `DATA-FLD-069` | ALERTS.created_at | datetime | sim | data | 005:L220-L228 |

### Relações

As associações decorrem dos campos nomeados e do diagrama. Nenhuma PK, FK, cardinalidade, cascata, unicidade ou obrigatoriedade relacional é formalmente declarada; por isso a associação é `FATO_DOCUMENTADO`, mas a natureza de chave/cardinalidade permanece `NAO_ESPECIFICADO`.

| ID | Origem → destino | Base/localizador | Cardinalidade/chave/ciclo | Classificação |
|---|---|---|---|---|
| `DATA-REL-001` | USER → AREA por `AREA.user_id` | 005:L37-L49,L257-L274 | todos não especificados | `FATO_DOCUMENTADO` |
| `DATA-REL-002` | USER → SURVEY por `SURVEY.user_id` | 005:L65-L70 | idem | `FATO_DOCUMENTADO` |
| `DATA-REL-003` | AREA → SURVEY por `SURVEY.area_id` | 005:L65-L70,L257-L274 | idem | `FATO_DOCUMENTADO` |
| `DATA-REL-004` | SURVEY → WATER_DATA por `survey_id` | 005:L78-L86,L257-L274 | idem | `FATO_DOCUMENTADO` |
| `DATA-REL-005` | SURVEY → SOIL_DATA por `survey_id` | 005:L115-L123,L257-L274 | idem | `FATO_DOCUMENTADO` |
| `DATA-REL-006` | SURVEY → VEGETATION_DATA por `survey_id` | 005:L149-L156,L257-L274 | idem | `FATO_DOCUMENTADO` |
| `DATA-REL-007` | SURVEY → TERRAIN_DATA por `survey_id` | 005:L176-L181,L257-L274 | idem | `FATO_DOCUMENTADO` |
| `DATA-REL-008` | SURVEY → IHFR_RESULT por `survey_id` | 005:L188-L201,L257-L274 | idem | `FATO_DOCUMENTADO` |
| `DATA-REL-009` | AREA → ALERTS por `area_id` | 005:L220-L228 | idem | `FATO_DOCUMENTADO` |
| `DATA-REL-010` | IHFR_RESULT → ALERTS por `ihfr_result_id` | 005:L220-L228,L257-L274 | idem | `FATO_DOCUMENTADO` |

### Restrições e regras

| ID | Regra/restrição histórica | Fonte/localizador | Suficiência; classificação |
|---|---|---|---|
| `DATA-RULE-001` | USER.role ∈ admin, technician, field_user | 005:L27-L31 | parcial; `FATO_DOCUMENTADO` |
| `DATA-RULE-002` | land_use_type ∈ sete valores | 005:L51-L59 | parcial; `FATO_DOCUMENTADO` |
| `DATA-RULE-003` | water_source_type ∈ seis valores | 005:L88-L99 | parcial; `FATO_DOCUMENTADO` |
| `DATA-RULE-004` | water_availability ∈ três valores | 005:L100-L104 | parcial; `FATO_DOCUMENTADO` |
| `DATA-RULE-005` | salinity_indicator ∈ três valores | 005:L105-L109 | parcial; `FATO_DOCUMENTADO` |
| `DATA-RULE-006` | soil_texture ∈ três valores | 005:L125-L132 | parcial; `FATO_DOCUMENTADO` |
| `DATA-RULE-007` | compaction_level ∈ três valores | 005:L133-L137 | parcial; `FATO_DOCUMENTADO` |
| `DATA-RULE-008` | erosion_signs ∈ três valores | 005:L138-L143 | parcial; `FATO_DOCUMENTADO` |
| `DATA-RULE-009` | fragmentation_level ∈ low/moderate/high | 005:L158-L164 | parcial; `FATO_DOCUMENTADO` |
| `DATA-RULE-010` | landscape_degradation ∈ low/moderate/high | 005:L165-L170 | parcial; `FATO_DOCUMENTADO` |
| `DATA-RULE-011` | ihfr_class ∈ quatro classes | 005:L203-L208 | parcial; não inclui insuficiente; `FATO_DOCUMENTADO` |
| `DATA-RULE-012` | data_quality ∈ high/medium/low | 005:L210-L214 | parcial; regra de derivação ausente; `FATO_DOCUMENTADO` |
| `DATA-RULE-013` | alert_type ∈ quatro tipos | 005:L230-L235 | parcial; limiares/ciclo ausentes; `FATO_DOCUMENTADO` |
| `DATA-RULE-014` | valores percentuais entre 0 e 100 | 005:L237-L241 | campo-alvo não enumerado; `FATO_DOCUMENTADO` |
| `DATA-RULE-015` | infiltração entre 0 e 60 mm/h | 005:L243-L245 | limites inclusivos não especificados; `FATO_DOCUMENTADO` |
| `DATA-RULE-016` | declividade entre 0 e 45% | 005:L247-L250 | limites inclusivos não especificados; `FATO_DOCUMENTADO` |
| `DATA-RULE-017` | profundidade de poço entre 0 e 60 m | 005:L252-L255 | aplicabilidade sem poço ausente; `FATO_DOCUMENTADO` |
| `DATA-RULE-018` | AREA.geometry admite polígono ou ponto | 005:L40-L44 | formato, validade e CRS ausentes; `FATO_DOCUMENTADO` |
| `DATA-RULE-019` | algorithm_version = `IHFR_v0.1`; versões futuras v0.2/v1.0 | 005:L277-L285 | constante histórica + propostas futuras; `FATO_DOCUMENTADO`/`PROPOSTA` |

### Síntese e ausências materiais de dados

| Dimensão | Quantidade/resultado |
|---|---|
| Entidades | 9 |
| Campos | 69: 59 obrigatórios e 10 opcionais |
| Tipos | 19 UUID, 8 string, 14 enum, 15 float, 2 boolean, 6 datetime, 1 date, 3 text e 1 geometry |
| Relações | 10 associações; 0 cardinalidades/PK/FK/unique formalmente declaradas |
| Regras | 19; uma enum (`ALERTS.severity`) continua sem valores |
| Auditoria | `created_at` em 6 entidades; `updated_at` apenas em USER; sem autor de alteração, deleção, retenção ou trilha de mudança |
| Isolamento | não especificado; `organization` é string opcional e não define tenant/laboratório |
| Geoespacial | geometry, centroide, área, slope/elevation/drainage; CRS, precisão, validade e proveniência ausentes |
| IHFR/histórico | resultado e versão presentes; raw snapshot, scores por variável, drivers e recomendações ausentes |
| Qualidade/proveniência | `data_quality` sem regra; fonte, método, instrumento, QC, versão da coleta e proveniência não modelados |
| Ciclo de vida | rascunho, recálculo, invalidação, edição, arquivamento, retenção, exclusão e sincronização ausentes |

## Inventário das declarações arquiteturais

“Natureza” descreve a fonte histórica; “estado atual” vem exclusivamente de `TECH_DECISIONS.md` quando há correspondência. Implementação é `NAO_AVALIADO`, salvo as escolhas cujo registro canônico usa `IMPLEMENTACAO_RELATADA_PENDENTE_DE_VERIFICACAO`; isso continua sem verificação nesta etapa.

| ID | Assunto/enunciado | Natureza; fonte/localizador | Estado decisório/implementação; dependência ou divergência |
|---|---|---|---|
| `ARCH-001` | Sistema integra área→dados→normalização→IHFR→diagnóstico→recomendação | descrição histórica; 006:L5-L47 | não registrado; `NAO_AVALIADO`; produto/ciência |
| `ARCH-002` | IHFR = .35H+.30S+.25V+.10T | afirmação científica histórica; 006:L49-L68 | não decisão arquitetural; `NAO_AVALIADO`; diverge do contrato geral `DOC-010` |
| `ARCH-003` | Normalizar variáveis em 0–1 | afirmação operacional; 006:L70-L169 | não registrado; `NAO_AVALIADO`; `PD-002` |
| `ARCH-004` | Dimensões por média simples | afirmação operacional; 006:L171-L189 | não registrado; `NAO_AVALIADO`; missing não tratado |
| `ARCH-005` | Quatro classes em faixas decimais | afirmação operacional; 006:L191-L200 | não registrado; `NAO_AVALIADO`; gaps/precisão em `DOC-010` |
| `ARCH-006` | Recomendações por cinco regras iniciais | afirmação operacional; 006:L202-L230 | não registrado; `NAO_AVALIADO`; autoridade científica/produto |
| `ARCH-007` | Modelo de banco com usuários, áreas, diagnósticos e variáveis ambientais | proposta de modelo; 006:L232-L275 | não confirmado; `NAO_AVALIADO`; diverge em granularidade de `DOC-RAW-005` |
| `ARCH-008` | Tabela usuários com cinco campos | proposta de persistência; 006:L234-L240 | não confirmado; `NAO_AVALIADO`; omite role/organization/auditoria do dicionário |
| `ARCH-009` | Tabela áreas com sete campos | proposta de persistência; 006:L242-L251 | não confirmado; `NAO_AVALIADO`; omite land use/centroide do dicionário |
| `ARCH-010` | Tabela diagnósticos guarda IHFR/classe/versão | proposta de persistência; 006:L253-L260 | não confirmado; `NAO_AVALIADO`; mistura Survey/Result |
| `ARCH-011` | Uma tabela de variáveis ambientais com 11 campos | proposta de persistência; 006:L262-L275 | não confirmado; `NAO_AVALIADO`; dicionário separa quatro entidades |
| `ARCH-012` | `POST /users` cria conta | proposta de API; 006:L277-L283 | não registrado; `NAO_AVALIADO`; contrato ausente |
| `ARCH-013` | `POST /auth/login` | proposta de API; 006:L284-L287 | não registrado; `NAO_AVALIADO`; mecanismo ausente |
| `ARCH-014` | `POST /areas` | proposta de API; 006:L288-L291 | não registrado; `NAO_AVALIADO`; contrato ausente |
| `ARCH-015` | `GET /areas` | proposta de API; 006:L292-L295 | não registrado; `NAO_AVALIADO`; filtros/autorização ausentes |
| `ARCH-016` | `POST /diagnostico` | proposta de API; 006:L296-L299 | não registrado; `NAO_AVALIADO`; singular e idioma divergem do backlog |
| `ARCH-017` | `POST /calcular-ihfr` | proposta de API; 006:L300-L303 | não registrado; `NAO_AVALIADO`; diverge do endpoint aninhado do backlog |
| `ARCH-018` | `GET /diagnostico/{id}` | proposta de API; 006:L304-L305 | não registrado; `NAO_AVALIADO`; contrato ausente |
| `ARCH-019` | React no frontend | `RECOMENDACAO`; 006:L307-L313 | não registrado isoladamente; `NAO_AVALIADO` |
| `ARCH-020` | Next.js no frontend | `RECOMENDACAO`; 006:L307-L313 | `TD-001` `CONFIRMADO`; `IMPLEMENTACAO_RELATADA_PENDENTE_DE_VERIFICACAO`; TD confirma full-stack, não apenas frontend |
| `ARCH-021` | Python no backend | `RECOMENDACAO`; 006:L314-L316 | `TD-009` `EM_AVALIACAO`; `NAO_AVALIADO`; `PD-008` |
| `ARCH-022` | FastAPI no backend | `RECOMENDACAO`; 006:L314-L316 | não registrado como decisão; `NAO_AVALIADO`; depende de Python |
| `ARCH-023` | PostgreSQL | `RECOMENDACAO`; 006:L317-L319 | `TD-002` `CONFIRMADO`; `IMPLEMENTACAO_RELATADA_PENDENTE_DE_VERIFICACAO` |
| `ARCH-024` | PostGIS | `RECOMENDACAO`; 006:L317-L319 | não registrado; `NAO_AVALIADO`; não é implicado por PostgreSQL |
| `ARCH-025` | Leaflet | `RECOMENDACAO`; 006:L320-L323 | `TD-011` `PROPOSTO`; `NAO_AVALIADO`; `PD-010`,`013` |
| `ARCH-026` | OpenStreetMap | `RECOMENDACAO`; 006:L320-L323 | `TD-008` `EM_AVALIACAO`; `NAO_AVALIADO`; `PD-007`,`013` |
| `ARCH-027` | Arquitetura recomendada “permite” geoprocessamento/processamento eficiente | alegação histórica de capacidade; 006:L307-L323 | não aprovada; `NAO_AVALIADO`; métrica ausente |
| `ARCH-028` | Fluxo login→dashboard→área→dados→cálculo→resultado→recomendação corresponde aos wireframes | fato sobre relação documental; 006:L325-L343 | `NAO_APLICAVEL` como decisão; implementação `NAO_AVALIADO`; confirma `TR-001` apenas |
| `ARCH-029` | Diagnóstico registra id do usuário | restrição histórica; 006:L345-L355 | não registrado; `NAO_AVALIADO`; identidade/formato ausente |
| `ARCH-030` | Diagnóstico registra data da análise | restrição histórica; 006:L345-L355 | não registrado; `NAO_AVALIADO`; timezone/formato ausentes |
| `ARCH-031` | Diagnóstico registra área | restrição histórica; 006:L345-L355 | não registrado; `NAO_AVALIADO`; vínculo/cardinalidade ausentes |
| `ARCH-032` | Diagnóstico registra versão do algoritmo | restrição histórica; 006:L345-L355 | não registrado; `NAO_AVALIADO`; governança de versão ausente |
| `ARCH-033` | Diagnóstico registra dados utilizados | restrição histórica; 006:L345-L355 | não registrado; `NAO_AVALIADO`; snapshot/formato/proveniência ausentes |
| `ARCH-034` | Integração futura com imagens de satélite | `PROPOSTA`; 006:L357-L365 | não registrado; `NAO_AVALIADO` |
| `ARCH-035` | Integração futura com dados climáticos | `PROPOSTA`; 006:L357-L365 | não registrado; `NAO_AVALIADO` |
| `ARCH-036` | Integração futura com sensores ambientais | `PROPOSTA`; 006:L357-L365 | não registrado; `NAO_AVALIADO` |
| `ARCH-037` | Integração futura com modelagem hidrológica | `PROPOSTA`; 006:L357-L365 | não registrado; `NAO_AVALIADO` |
| `ARCH-038` | Integração futura com monitoramento de restauração | `PROPOSTA`; 006:L357-L365 | não registrado; `NAO_AVALIADO` |
| `ARCH-039` | Mecanismo de autenticação/sessão | `NAO_ESPECIFICADO`; leitura integral 006 | `NAO_ESPECIFICADO`; implementação `NAO_AVALIADO` |
| `ARCH-040` | Modelo de autorização e isolamento | `NAO_ESPECIFICADO`; leitura integral 006 | `NAO_ESPECIFICADO`; depende de `PD-003`,`004`,`006`,`014`–`016` |
| `ARCH-041` | Contrato de integração Next.js↔Python | `NAO_ESPECIFICADO`; leitura integral 006 | `TD-012` `EM_AVALIACAO`; `NAO_AVALIADO`; `PD-011` |
| `ARCH-042` | Transações, constraints, retenção e ciclo de persistência | `NAO_ESPECIFICADO`; leitura integral 006 | `NAO_ESPECIFICADO`; `NAO_AVALIADO` |
| `ARCH-043` | Hospedagem/deploy | `NAO_ESPECIFICADO`; leitura integral 006 | `TD-007` confirma Vercel atual e `TD-013` mantém futuro em avaliação; não comparável à ausência |
| `ARCH-044` | Observabilidade | `NAO_ESPECIFICADO`; leitura integral 006 | `NAO_ESPECIFICADO`; `NAO_AVALIADO` |
| `ARCH-045` | Desempenho/disponibilidade | `NAO_ESPECIFICADO`; leitura integral 006 | `NAO_ESPECIFICADO`; `NAO_AVALIADO` |
| `ARCH-046` | Offline/sincronização | `NAO_ESPECIFICADO`; leitura integral 006 | `NAO_ESPECIFICADO`; `NAO_AVALIADO`; requisitos históricos parciais em `DOC-011` |
| `ARCH-047` | Tratamento de erros | `NAO_ESPECIFICADO`; leitura integral 006 | `NAO_ESPECIFICADO`; `NAO_AVALIADO` |
| `ARCH-048` | Estratégia de testes | `NAO_ESPECIFICADO`; leitura integral 006 | `NAO_ESPECIFICADO`; backlog histórico tem itens, sem arquitetura |
| `ARCH-049` | Ambientes e versionamento de dependências/contratos | `NAO_ESPECIFICADO`; leitura integral 006 | `NAO_ESPECIFICADO`; `NAO_AVALIADO` |

### Síntese arquitetural

| Dimensão | Quantidade/resultado |
|---|---|
| Itens `ARCH-NNN` | 49 |
| Classificação de conteúdo | 13 `FATO_DOCUMENTADO`/declarações históricas, 8 `RECOMENDACAO`, 17 `PROPOSTA`, 11 `NAO_ESPECIFICADO` |
| Correspondência decisória confirmada | Next.js (`TD-001`) e PostgreSQL (`TD-002`) |
| Em avaliação/proposto | Python (`TD-009`), OSM (`TD-008`), Leaflet (`TD-011`) e integração (`TD-012`) |
| Sem decisão correspondente | React, FastAPI, PostGIS e demais detalhes históricos |
| Implementação | 2 escolhas com relato pendente de verificação; todas as demais `NAO_AVALIADO`; 0 `IMPLEMENTADO_VERIFICADO` |
| Contratos/qualidades ausentes | autenticação detalhada, autorização, integração, constraints/ciclo, deploy, observabilidade, desempenho, disponibilidade, offline, erros, testes e ambientes |

## Inventário do roadmap

Fases, entregas e tecnologias são planos/recomendações históricas. Nenhuma linha possui data, marco verificável, responsável, percentual ou estado de conclusão.

| ID | Fase/entrega/tecnologia | Natureza; fonte/localizador | Dependência/estado atual/alegação |
|---|---|---|---|
| `ROAD-001` | Fase 1 — MVP, validar modelo da startup | `PROPOSTA`; 012:L25-L35 | sem condição de saída; nenhuma conclusão alegada |
| `ROAD-002` | login/autenticação | `PROPOSTA`; 012:L36-L45 | produto/segurança; sem estado |
| `ROAD-003` | cadastro de áreas | `PROPOSTA`; 012:L36-L45 | dados/mapas; sem estado |
| `ROAD-004` | mapa básico | `PROPOSTA`; 012:L36-L45 | `PD-007`,`010`,`013`; sem estado |
| `ROAD-005` | coleta ambiental | `PROPOSTA`; 012:L36-L45 | ciência/dados; sem estado |
| `ROAD-006` | cálculo do IHFR | `PROPOSTA`; 012:L36-L45 | `PD-002`; sem estado |
| `ROAD-007` | geração de diagnóstico | `PROPOSTA`; 012:L36-L45 | ciência/produto; sem estado |
| `ROAD-008` | dashboard com indicadores | `PROPOSTA`; 012:L36-L45 | dados/UX; sem estado |
| `ROAD-009` | público inicial: técnicos/pesquisadores/agricultores/projetos | `PROPOSTA`; 012:L61-L66 | terminologia/papéis `PD-015`; sem estado |
| `ROAD-010` | Fase 2 — plataforma operacional | `PROPOSTA`; 012:L68-L72 | depende da Fase 1, sem gate declarado |
| `ROAD-011` | upload de shapefile | `PROPOSTA`; 012:L74-L80 | dados geoespaciais; sem estado |
| `ROAD-012` | integração com dados ambientais externos | `PROPOSTA`; 012:L74-L80 | contratos/proveniência; sem estado |
| `ROAD-013` | análise territorial automática | `PROPOSTA`; 012:L74-L80 | ciência/algoritmo; sem estado |
| `ROAD-014` | camadas de hidrografia/solos/cobertura/uso/declividade/bacias | `PROPOSTA`; 012:L80-L90 | fontes/CRS/licenças ausentes; sem estado |
| `ROAD-015` | calibração empírica | `PROPOSTA`; 012:L91-L93 | `PD-002`; sem método/estado |
| `ROAD-016` | pesos diferenciados | `PROPOSTA`; 012:L91-L93 | `MATH-FND-003`,`004`; sem estado |
| `ROAD-017` | análise espacial automatizada | `PROPOSTA`; 012:L91-L93 | arquitetura/dados; sem estado |
| `ROAD-018` | Fase 3 — inteligência territorial | `PROPOSTA`; 012:L94-L98 | depende da Fase 2, sem gate declarado |
| `ROAD-019` | modelos preditivos de risco hídrico | `PROPOSTA`; 012:L100-L106 | dados/ciência/modelagem; sem estado |
| `ROAD-020` | recomendação automática de restauração | `PROPOSTA`; 012:L100-L106 | ciência/produto; sem estado |
| `ROAD-021` | integração com sensores | `PROPOSTA`; 012:L100-L106 | hardware/contratos; sem estado |
| `ROAD-022` | monitoramento de áreas restauradas | `PROPOSTA`; 012:L100-L106 | temporalidade/dados; sem estado |
| `ROAD-023` | relatórios automáticos | `PROPOSTA`; 012:L100-L106 | produto/dados; sem estado |
| `ROAD-024` | aplicações em planejamento/água/restauração/agricultura | `PROPOSTA`; 012:L107-L111 | escopo institucional `PD-001`; sem estado |
| `ROAD-025` | React | `RECOMENDACAO`; 012:L117-L128 | sem decisão isolada; `NAO_AVALIADO` |
| `ROAD-026` | Next.js | `RECOMENDACAO`; 012:L117-L128 | `TD-001` `CONFIRMADO`; implementação relatada pendente |
| `ROAD-027` | Leaflet como biblioteca frontend | `RECOMENDACAO`; 012:L130-L136 | `TD-011` `PROPOSTO`; `PD-010`,`013` |
| `ROAD-028` | Mapbox como biblioteca frontend | `RECOMENDACAO`; 012:L130-L136 | sem decisão registrada; `NAO_AVALIADO` |
| `ROAD-029` | OpenLayers como biblioteca frontend | `RECOMENDACAO`; 012:L130-L136 | sem decisão registrada; `NAO_AVALIADO` |
| `ROAD-030` | Python para backend/cálculo/IA | `RECOMENDACAO`; 012:L138-L157 | `TD-009` `EM_AVALIACAO`; `PD-008` |
| `ROAD-031` | FastAPI | `RECOMENDACAO`; 012:L138-L151 | sem decisão registrada; depende de Python |
| `ROAD-032` | Node.js como alternativa | `RECOMENDACAO`; 012:L149-L151 | sem decisão registrada; relação com Next full-stack não definida |
| `ROAD-033` | PostgreSQL | `RECOMENDACAO`; 012:L159-L171 | `TD-002` `CONFIRMADO`; implementação relatada pendente |
| `ROAD-034` | PostGIS | `RECOMENDACAO`; 012:L159-L171 | sem decisão registrada; `NAO_AVALIADO` |
| `ROAD-035` | Mapbox para mapas | `RECOMENDACAO`; 012:L173-L187 | sem decisão registrada |
| `ROAD-036` | Leaflet para mapas | `RECOMENDACAO`; 012:L173-L187 | `TD-011` `PROPOSTO`; `PD-010`,`013` |
| `ROAD-037` | OpenLayers para mapas | `RECOMENDACAO`; 012:L173-L187 | sem decisão registrada |
| `ROAD-038` | Leaflet + OpenStreetMap suficiente para MVP | `RECOMENDACAO`; 012:L173-L187 | Leaflet proposto/OSM em avaliação; capacidade não verificada |
| `ROAD-039` | AWS como opção de hospedagem | `RECOMENDACAO`; 012:L189-L203 | sem decisão registrada |
| `ROAD-040` | Google Cloud como opção | `RECOMENDACAO`; 012:L189-L203 | sem decisão registrada |
| `ROAD-041` | Digital Ocean como opção | `RECOMENDACAO`; 012:L189-L203 | sem decisão registrada |
| `ROAD-042` | Digital Ocean suficiente para MVP | `RECOMENDACAO`; 012:L197-L203 | sem decisão registrada; alternativa não escolhida |
| `ROAD-043` | Vercel suficiente para MVP | `RECOMENDACAO`; 012:L197-L203 | `TD-007` `CONFIRMADO` para aplicação atual; implementação relatada pendente |
| `ROAD-044` | Supabase em combinação de MVP | `RECOMENDACAO`; 012:L197-L203 | sem decisão registrada; Neon atual em `TD-003` não equivale |
| `ROAD-045` | Arquitetura React→FastAPI→PostgreSQL/PostGIS→IHFR→mapa/dashboard | `RECOMENDACAO`; 012:L205-L217 | diverge da decisão Next.js full-stack; integração não definida |
| `ROAD-046` | Cálculo IHFR executado no backend | `RECOMENDACAO`; 012:L219-L237 | backend definitivo pendente; `PD-008`,`011` |
| `ROAD-047` | Cinco módulos: cadastro, coleta, análise, visualização, recomendação | `RECOMENDACAO`; 012:L239-L268 | dependem de produto/dados/ciência; sem estado |
| `ROAD-048` | Autenticação, armazenamento seguro, versão e rastreabilidade | `RECOMENDACAO`; 012:L270-L283 | critérios/mecanismos ausentes; sem estado |
| `ROAD-049` | Escala/expansão: banco, território, externos, satélite, remoto, restauração, carbono e planejamento | `RECOMENDACAO`; 012:L285-L303 | riscos, capacidade, dados e condições ausentes; sem estado |

### Síntese do roadmap

| Dimensão | Quantidade/resultado |
|---|---|
| Itens `ROAD-NNN` | 49 |
| Natureza | 24 `PROPOSTA` de fase/entrega/aplicação; 25 `RECOMENDACAO` técnica/operacional |
| Fases | 3; dependência sequencial inferível, mas sem datas, marcos, responsáveis ou gates |
| Decisões atuais coincidentes | Next.js, PostgreSQL e Vercel, com implementação apenas relatada e não verificada |
| Em avaliação/proposto | Python, OpenStreetMap e Leaflet; integração e arquitetura de mapas continuam abertas |
| Alternativas sem decisão | React isolado, FastAPI, Node.js, PostGIS, Mapbox, OpenLayers, AWS, Google Cloud, Digital Ocean e Supabase |
| Alegações de conclusão | 0; “é suficiente”/“permite” são recomendações de capacidade, não conclusão ou prova de implementação |
| Riscos/condições | não há seção de risco, cronograma, critério de avanço, orçamento ou dependência formal |

## Comparação transversal e matrizes de rastreabilidade

### Convenções

- `E` = relação temática localizada explicitamente nos dois itens; `P` = parcial; `A` = ambígua; `NL` = não localizada; `NA` = não aplicável.
- Salvo indicação diferente, as relações entre documentos são do tipo `RELACAO_TEMATICA`, classificação `INFERENCIA`, porque nenhuma fonte declara derivação ou conformidade.
- O localizador da origem é o registrado no inventário; os destinos mantêm seus IDs e localizadores nos relatórios/fontes correspondentes.
- Confiança/estado descreve a relação documental, não aprovação.

### 1–4. Backlog → requisito, ciência, dados e componente arquitetural

As quatro colunas de destino constituem quatro projeções explícitas da mesma matriz por item. Nenhuma história sem destino foi forçada.

| Origem | Requisito Etapa 6 | Ciência/algoritmo | Entidade/campo | Componente arquitetural | Estado; evidência/observação |
|---|---|---|---|---|---|
| `BLG-001` | `PROD-REQ-028` E | NA | USER.email/password P | `ARCH-013`,`039` P | P; 003:L9-L20; autenticação diverge em detalhe |
| `BLG-002` | `PROD-REQ-039`–`041` E | NA | USER.role; AREA.user_id P | `ARCH-040` NL | P; 003:L21-L32; isolamento/backend não especificado em 006 |
| `BLG-003` | `PROD-REQ-010`–`012`,`032`,`043` E | `VAR-016` P | AREA E | `ARCH-009`,`014`,`024` P | E/P; 003:L37-L48 |
| `BLG-004` | `PROD-REQ-012`,`038` E | NA | geometry/area_size E | `ARCH-024` P | P; 003:L49-L60; cálculo de área não especificado |
| `BLG-005` | `PROD-REQ-012`,`038` E | NA | geometry E | `ARCH-024` P | P; 003:L61-L71 |
| `BLG-006` | `PROD-REQ-039` P | NA | AREA P | API update em 006 NL | P; 003:L72-L82 |
| `BLG-007` | `PROD-REQ-044` E | protocolo `DOC-009` P | SURVEY E | `ARCH-010`,`016` P | P; 003:L87-L97 |
| `BLG-008` | `PROD-REQ-020`,`046` E | `VAR-001`–`005` E | WATER_DATA E | formulário/API P | E/P; 003:L98-L109 |
| `BLG-009` | `PROD-REQ-021`,`045` E | `VAR-006`–`010` E | SOIL_DATA E | formulário/API P | E/P; 003:L110-L121 |
| `BLG-010` | `PROD-REQ-022`,`047` E | `VAR-011`–`014` E | VEGETATION_DATA E | formulário/API P | E/P; 003:L122-L133 |
| `BLG-011` | `PROD-REQ-010`,`033` P | `VAR-015`,`016` E | AREA.land_use; TERRAIN.slope E | formulário/API P | P; 003:L134-L144; território ausente como bloco em Etapa 6 |
| `BLG-012` | `PROD-REQ-056`,`057` E | NA | estado draft NL | `ARCH-046` NL | P/NL; 003:L145-L156 |
| `BLG-013` | `PROD-REQ-023`,`051` E | `DOC-010` E | 17 campos P | `ARCH-003` E | P; 003:L161-L171; regras divergem entre fontes científicas |
| `BLG-014` | `PROD-REQ-023`,`035`,`051` E | `MATH-FND-007`,`010` E | scores/componentes P | `ARCH-004` E | P; 003:L172-L182 |
| `BLG-015` | `PROD-REQ-023`,`024`,`051` E | `MATH-FND-003`,`011` E | RESULT.score/class E | `ARCH-002`,`005` P | P; 003:L183-L194 |
| `BLG-016` | NL direto | `MATH-FND-006` E | RESULT.data_quality E | cálculo em 006 NL | P/NL; 003:L195-L205 |
| `BLG-017` | `PROD-REQ-050`,`058`,`059` E | `MATH-FND-018`,`019` E | módulos/RESULT P | `ARCH-029`–`033` E | P; 003:L206-L217; payload de auditoria incompleto no dicionário |
| `BLG-018` | NL direto | `MATH-FND-017` E | drivers NL | motor de recomendação P | P/NL; 003:L222-L232 |
| `BLG-019` | `PROD-REQ-024`,`060` E | `MATH-FND-017` E | explanation E; drivers NL | templates não detalhados | P; 003:L233-L243 |
| `BLG-020` | `PROD-REQ-025` E | `DOC-009`,`010` P | recommendations NL | `ARCH-006` P | P/NL; 003:L244-L254 |
| `BLG-021` | `PROD-REQ-024`,`035`,`048`,`050` E | `DOC-010` E | IHFR_RESULT P | frontend/API P | P; 003:L259-L270 |
| `BLG-022` | `PROD-REQ-024`,`025`,`036`,`037` E | `DOC-009`,`010` P | explanation E; recommendations NL | frontend/API P | P; 003:L271-L282 |
| `BLG-023` | `PROD-REQ-003`,`006`,`009` E | classe `DOC-010` P | AREA/RESULT E | dashboard/API P | P; 003:L287-L297 |
| `BLG-024` | `PROD-REQ-006` E | NA | SURVEY/RESULT E | histórico/API P | P; 003:L298-L308 |
| `BLG-025` | `PROD-REQ-008`,`009`,`038` E | classe `DOC-010` P | geometry/class E | `ARCH-024`–`026` P | P; 003:L309-L320 |
| `BLG-026` | `PROD-REQ-007`,`049` E | limiares `PD-002` P | ALERTS E | regras/backend P | P; 003:L321-L332 |
| `BLG-027` | `PROD-REQ-028`,`039`–`042` P | NA | USER P | `ARCH-013`,`039`,`040` P/NL | P; 003:L337-L346 |
| `BLG-028` | `PROD-REQ-010`,`012`,`032`,`039`,`040`,`043` P | NA | AREA E | `ARCH-014`,`015` P | P; 003:L347-L353; GET id/PUT não constam em 006 |
| `BLG-029` | `PROD-REQ-033`,`044`–`047` E | `DOC-009` P | SURVEY/módulos E | `ARCH-016` P | P; 003:L354-L361; quatro endpoints modulares não constam em 006 |
| `BLG-030` | `PROD-REQ-023`,`024`,`034`,`035` E | `DOC-010` E | RESULT P | `ARCH-017` P | P; 003:L362-L369; caminhos de endpoint divergem |
| `BLG-031` | `PROD-REQ-006`,`007`,`049` E | alertas `PD-002` P | RESULT/ALERTS E | endpoints em 006 NL | P/NL; 003:L370-L374 |
| `BLG-032` | `PROD-REQ-058` P | testes `DOC-010` P | fixtures NL | `ARCH-048` NL | P/NL; 003:L379-L386 |
| `BLG-033` | `PROD-REQ-058`,`059` P | reprodutibilidade P | log NL | `ARCH-044` NL | P/NL; 003:L387-L393 |
| `BLG-034` | NL | NA | NA | `ARCH-043`,`049` NL | NL; 003:L394-L400 |

Cobertura backlog→requisito: 29 itens com relação explícita/parcial a pelo menos um `PROD-REQ-NNN` e 5 sem requisito direto (`BLG-016`,`018`,`032`,`034` e parte contratual de `BLG-033`). Requisitos sem história direta ou apenas parcialmente cobertos incluem `PROD-REQ-005`,`013`–`019`,`026`,`027`,`029`–`031`,`052`–`055`,`057`,`060`; a lista não lhes atribui prioridade nem aprovação.

### 5. Conceito de domínio → entidade de dados

| Origem | Destino | Tipo; classificação | Evidência/localizador | Estado/confiança; observação |
|---|---|---|---|---|
| `DOM-CON-001` User | `DATA-ENT-001` | correspondência nominal; `INFERENCIA` | `DOC-011`; 005:L12-L31 | E; conta/identidade continuam incompletas |
| `DOM-CON-002` conta | USER parcial | relação possível; `INFERENCIA` | `DOC-011`; 005:L12-L31 | A; dicionário não usa “conta” |
| `DOM-CON-003` papel/perfil | USER.role | atributo relacionado; `INFERENCIA` | `DOC-011`; 005:L16-L31 | P; taxonomias divergem |
| `DOM-CON-004` Area | `DATA-ENT-002` | correspondência nominal; `INFERENCIA` | `DOC-011`; 005:L33-L59 | E; propriedade/ciclo ausentes |
| `DOM-CON-005` propriedade | AREA parcial | aproximação; `INFERENCIA` | `DOC-011`; 005:L33-L59 | A; equivalência não declarada |
| `DOM-CON-006` geometria | AREA.geometry/centroid | atributo relacionado; `INFERENCIA` | `DOC-011`; 005:L37-L49 | E; CRS/validade ausentes |
| `DOM-CON-007` ponto de coleta | NL | não localizada; `NAO_ESPECIFICADO` | `DOC-011`; leitura 005 | NL; geometry não distingue ponto de coleta |
| `DOM-CON-008` município | AREA.municipality/state | atributos relacionados; `INFERENCIA` | `DOC-011`; 005:L37-L49 | E/P; hierarquia ausente |
| `DOM-CON-009` uso da terra | AREA.land_use_type | correspondência nominal; `INFERENCIA` | `DOC-011`; 005:L37-L59 | E |
| `DOM-CON-010` Survey/Diagnóstico | `DATA-ENT-003` | correspondência nominal; `INFERENCIA` | `DOC-011`; 005:L61-L72 | E; diagnóstico/resultado ainda ambíguos |
| `DOM-CON-011` WaterData | `DATA-ENT-004` | correspondência nominal; `INFERENCIA` | `DOC-011`; 005:L74-L109 | E |
| `DOM-CON-012` SoilData | `DATA-ENT-005` | correspondência nominal; `INFERENCIA` | `DOC-011`; 005:L111-L143 | E |
| `DOM-CON-013` VegetationData | `DATA-ENT-006` | correspondência nominal; `INFERENCIA` | `DOC-011`; 005:L145-L170 | E |
| `DOM-CON-014` dado ambiental | DATA-ENT-004–007 | agregado; `INFERENCIA` | `DOC-011`; 005:L74-L182 | P; fronteira/proveniência ausentes |
| `DOM-CON-015` IHFRResult | `DATA-ENT-008` | correspondência nominal; `INFERENCIA` | `DOC-011`; 005:L184-L214 | E |
| `DOM-CON-016` IHFR | RESULT.score | atributo relacionado; `INFERENCIA` | `DOC-011`; 005:L188-L201 | E |
| `DOM-CON-017` componente/dimensão | RESULT quatro scores | atributos relacionados; `INFERENCIA` | `DOC-011`; 005:L188-L201 | E; composição não persistida |
| `DOM-CON-018` classe de risco | RESULT.ihfr_class | atributo relacionado; `INFERENCIA` | `DOC-011`; 005:L203-L208 | E; insuficiente ausente |
| `DOM-CON-019` interpretação | RESULT.explanation | correspondência semântica; `INFERENCIA` | `DOC-011`; 005:L188-L201 | E |
| `DOM-CON-020` recomendação | NL | não localizada; `NAO_ESPECIFICADO` | `DOC-011`; leitura 005 | NL |
| `DOM-CON-021` Alerts | `DATA-ENT-009` | correspondência nominal; `INFERENCIA` | `DOC-011`; 005:L216-L235 | E; ciclo ausente |
| `DOM-CON-022` histórico | SURVEY/RESULT.created_at | cobertura parcial; `INFERENCIA` | `DOC-011`; 005:L61-L72,L184-L201 | P; retenção/ordem/imutabilidade ausentes |
| `DOM-CON-023` versão do algoritmo | RESULT.algorithm_version | correspondência nominal; `INFERENCIA` | `DOC-011`; 005:L188-L201,L277-L285 | E; governança ausente |
| `DOM-CON-024` mapa territorial | AREA.geometry/centroid | suporte de dados; `INFERENCIA` | `DOC-011`; 005:L37-L49 | P; camadas/CRS ausentes |
| `DOM-CON-025` rascunho local | NL | não localizada; `NAO_ESPECIFICADO` | `DOC-011`; leitura 005 | NL; sync ausente |

### 6. Requisito → entidade/campo

Todos os 60 requisitos são cobertos abaixo, individualmente ou em intervalos homogêneos. Relações são `INFERENCIA`; “NL” não converte ausência em requisito de dados.

| Origem | Destino de dados | Evidência/localizador | Estado; observação |
|---|---|---|---|
| `PROD-REQ-001`–`009` | AREA, SURVEY, RESULT, ALERTS e geometry | `DOC-011`; 005:L33-L72,L184-L235 | P; indicadores/último resultado/agregação não têm contrato |
| `PROD-REQ-010` | AREA.name/municipality/geometry/size/land_use | `DOC-011`; 005:L37-L59 | E |
| `PROD-REQ-011` | AREA.state | `DOC-011`; 005:L37-L49 | E; origem somente wireframe na Etapa 6 |
| `PROD-REQ-012` | AREA.geometry | `DOC-011`; 005:L37-L49 | E |
| `PROD-REQ-013` | NL | `DOC-011`; leitura 005 | NL; ponto de coleta não é distinguido |
| `PROD-REQ-014` | geometry/centroid | `DOC-011`; 005:L37-L49 | P; GPS/proveniência não modelados |
| `PROD-REQ-015`–`018` | geometry parcial; demais NL | `DOC-011`; leitura 005 | NL/P; shapefile/camadas/análise/IA ausentes |
| `PROD-REQ-019` | WATER/SOIL/VEGETATION/TERRAIN | `DOC-011`; 005:L74-L182 | E; ordem/retomada ausentes |
| `PROD-REQ-020` | WATER_DATA | `DOC-011`; 005:L74-L109 | E |
| `PROD-REQ-021` | SOIL_DATA | `DOC-011`; 005:L111-L143 | E |
| `PROD-REQ-022` | VEGETATION_DATA | `DOC-011`; 005:L145-L170 | E |
| `PROD-REQ-023` | quatro módulos + IHFR_RESULT | `DOC-011`; 005:L74-L214 | P; scores normalizados não persistidos |
| `PROD-REQ-024` | score/class/explanation | `DOC-011`; 005:L188-L208 | E/P; precisão/insuficiência ausentes |
| `PROD-REQ-025`,`026` | NL | `DOC-011`; leitura 005 | NL; recomendações/IA não modeladas |
| `PROD-REQ-027` | NA | `DOC-011` | NA; conjunto de telas não é contrato de dados |
| `PROD-REQ-028` | USER.email/password_hash | `DOC-011`; 005:L16-L25 | P; sessão/credencial/ciclo ausentes |
| `PROD-REQ-029` | NL | `DOC-011`; leitura 005 | NL; recuperação de senha ausente |
| `PROD-REQ-030` | USER parcial | `DOC-011`; 005:L12-L31 | A; “conta” não definida |
| `PROD-REQ-031` | NA | `DOC-011` | NA; menu não é dado persistido |
| `PROD-REQ-032` | AREA | `DOC-011`; 005:L33-L59 | E |
| `PROD-REQ-033` | SURVEY e quatro módulos | `DOC-011`; 005:L61-L182 | E |
| `PROD-REQ-034` | SURVEY/RESULT | `DOC-011`; 005:L61-L72,L184-L214 | P; estado de cálculo ausente |
| `PROD-REQ-035` | quatro component scores | `DOC-011`; 005:L188-L201 | E |
| `PROD-REQ-036` | SURVEY/RESULT.created_at | `DOC-011`; 005:L61-L72,L184-L201 | P; histórico/ciclo não formalizados |
| `PROD-REQ-037` | NA | `DOC-011` | NA; navegação |
| `PROD-REQ-038` | geometry/score/class | `DOC-011`; 005:L37-L49,L188-L208 | P; estilo/mapa não é dado modelado |
| `PROD-REQ-039`–`041` | USER.role, AREA.user_id, SURVEY.user_id | `DOC-011`; 005:L16-L31,L37-L70 | P/A; “própria” e escopo não definidos |
| `PROD-REQ-042` | USER | `DOC-011`; 005:L12-L31 | E |
| `PROD-REQ-043` | AREA | `DOC-011`; 005:L33-L59 | E |
| `PROD-REQ-044` | SURVEY | `DOC-011`; 005:L61-L72 | E |
| `PROD-REQ-045` | SOIL_DATA | `DOC-011`; 005:L111-L143 | E |
| `PROD-REQ-046` | WATER_DATA | `DOC-011`; 005:L74-L109 | E |
| `PROD-REQ-047` | VEGETATION_DATA | `DOC-011`; 005:L145-L170 | E |
| `PROD-REQ-048` | RESULT score/class/components/version | `DOC-011`; 005:L188-L214 | E |
| `PROD-REQ-049` | ALERTS | `DOC-011`; 005:L216-L235 | E/P; regra/ciclo ausentes |
| `PROD-REQ-050` | RESULT.algorithm_version | `DOC-011`; 005:L188-L201,L277-L285 | E |
| `PROD-REQ-051` | módulos/RESULT | `DOC-011`; 005:L74-L214 | P; contrato matemático não é validado pelo esquema |
| `PROD-REQ-052`,`053` | algorithm_version parcial | `DOC-011`; 005:L277-L285 | P; pesos/calibração não persistidos |
| `PROD-REQ-054` | AREA/RESULT | `DOC-011`; 005:L33-L59,L184-L214 | P; “último” não formalizado |
| `PROD-REQ-055` | NA | `DOC-011` | NA; instrução de aceite |
| `PROD-REQ-056`,`057` | NL | `DOC-011`; leitura 005 | NL; rascunho/sync ausentes |
| `PROD-REQ-058` | version e trilha parcial | `DOC-011`; 005:L184-L214 | P; transparência/auditoria não modeladas integralmente |
| `PROD-REQ-059` | módulos + RESULT/version | `DOC-011`; 005:L74-L214 | P; snapshot/imutabilidade/proveniência ausentes |
| `PROD-REQ-060` | RESULT.explanation | `DOC-011`; 005:L188-L201 | P; teste de compreensão ausente |

### 7. Variável científica → campo → entrada algorítmica

| Origem | Campo histórico | Entrada algorítmica da Etapa 5 | Tipo; evidência | Estado/observação |
|---|---|---|---|---|
| `VAR-001` | WATER.water_source_type | `water_source_type` | correspondência nominal; 005:L78-L99; `DOC-010` | E |
| `VAR-002` | WATER.has_spring | `has_spring` | nominal; 005:L78-L86; `DOC-010` | E |
| `VAR-003` | WATER.well_depth_m | `well_depth_m` | nominal/unidade; 005:L78-L86; `DOC-010` | E; opcional |
| `VAR-004` | WATER.water_availability | `water_availability` | nominal; 005:L78-L104; `DOC-010` | E |
| `VAR-005` | WATER.salinity_indicator | `salinity_indicator` | semântica; 005:L78-L109; `DOC-010` | E; opcional |
| `VAR-006` | SOIL.infiltration_rate_mm_h | `infiltration_rate_mm_h` | nominal/unidade; 005:L115-L123; `DOC-010` | E |
| `VAR-007` | SOIL.compaction_level | `compaction_level` | nominal; 005:L115-L137; `DOC-010` | E |
| `VAR-008` | SOIL.soil_texture | `soil_texture` | nominal; 005:L115-L132; `DOC-010` | E |
| `VAR-009` | SOIL.erosion_signs | `erosion_signs` | semântica; 005:L115-L143; `DOC-010` | E |
| `VAR-010` | SOIL.soil_exposed_percent | `soil_exposed_percent` | nominal/unidade; 005:L115-L123; `DOC-010` | E; opcional |
| `VAR-011` | VEGETATION.vegetation_cover_percent | `vegetation_cover_percent` | nominal/unidade; 005:L149-L156; `DOC-010` | E |
| `VAR-012` | VEGETATION.fragmentation_level | `fragmentation_level` | nominal; 005:L149-L164; `DOC-010` | E |
| `VAR-013` | VEGETATION.has_riparian_app | `has_riparian_app` | semântica; 005:L149-L156; `DOC-010` | E; opcional/binária, ciência também registra alternativa ternária |
| `VAR-014` | VEGETATION.landscape_degradation | `landscape_degradation` | nominal; 005:L149-L170; `DOC-010` | E |
| `VAR-015` | TERRAIN.slope_percent | `slope_percent` | nominal/unidade; 005:L176-L181; `DOC-010` | E; opcional |
| `VAR-016` | AREA.land_use_type | `land_use_type` | nominal; 005:L37-L59; `DOC-010` | E; pertence a AREA, não TERRAIN_DATA |
| `VAR-017` | TERRAIN.drainage_density | entrada não localizada em algoritmo | nominal; 005:L176-L181; `DOC-010` | campo E; cadeia ao algoritmo `NAO_LOCALIZADA` |

Resultado: 17/17 variáveis possuem campo histórico identificável; 16/17 chegam a uma entrada algorítmica inventariada na Etapa 5 e `VAR-017` não. Essa cobertura nominal não valida tipo, obrigatoriedade, normalização, calibração, proveniência ou modelo de dados.

### 8. Resultado IHFR → persistência → histórico

| Origem/saída `DOC-010` | Persistência em `DOC-RAW-005` | Histórico | Tipo; evidência | Estado/observação |
|---|---|---|---|---|
| score final | RESULT.ihfr_score | created_at + Survey | correspondência; 005:L184-L201 | E/P; imutabilidade ausente |
| classe | RESULT.ihfr_class | idem | correspondência; 005:L184-L208 | E; classe insuficiente ausente |
| dimensões | quatro `*_score` | idem | correspondência; 005:L184-L201 | E |
| scores por variável | NL | NL | ausência; leitura 005 | NL |
| explicação | RESULT.explanation | idem | correspondência; 005:L184-L201 | E |
| drivers | NL | NL | ausência; leitura 005 | NL |
| recomendações | NL | NL | ausência; leitura 005 | NL; ALERTS não equivalem |
| `data_quality` | RESULT.data_quality | idem | correspondência; 005:L184-L214 | E; regra diverge na ciência |
| versão | RESULT.algorithm_version | idem | correspondência; 005:L184-L201,L277-L285 | E; calibração não distinguida |
| raw inputs | módulos associados ao Survey | histórico apenas por relação inferida | cobertura parcial; 005:L61-L182 | P; snapshot/versão dos inputs ausentes |
| timestamp | RESULT.created_at/SURVEY.survey_date | histórico por data | correspondência parcial; 005:L61-L72,L184-L201 | P; timezone/origem ausentes |
| diagnóstico/mapa | explanation parcial/geometry separada | relação inferida | comparação; 005:L33-L59,L184-L201 | P/A; payload composto não modelado |

### 9. Declaração arquitetural → `TECH_DECISIONS.md`

| Origem | Destino | Tipo; classificação | Evidência/localizador | Estado/observação |
|---|---|---|---|---|
| `ARCH-020` Next.js frontend | `TD-001` Next.js full-stack | escopo divergente; `INFERENCIA` | 006:L307-L316; TD-001 | `CONFIRMADO`; implementação relatada pendente; papel de backend diverge |
| `ARCH-023` PostgreSQL | `TD-002` | alinhamento; `INFERENCIA` | 006:L317-L319; TD-002 | `CONFIRMADO`; implementação relatada pendente |
| ausência de provedor em 006 | `TD-003` Neon | não comparável | leitura 006; TD-003 | decisão confirmada não contradita pela ausência |
| ausência de ORM em 006 | `TD-004` Prisma | não comparável | leitura 006; TD-004 | decisão confirmada; implementação não verificada |
| ausência de styling em 006 | `TD-005` Tailwind | não comparável | leitura 006; TD-005 | decisão confirmada |
| ausência de ícones em 006 | `TD-006` Lucide | não comparável | leitura 006; TD-006 | decisão confirmada |
| `ARCH-043` hospedagem ausente | `TD-007`,`TD-013` | não comparável/pendência | leitura 006; TDs | Vercel atual confirmado; futuro em avaliação |
| `ARCH-026` OpenStreetMap | `TD-008` | correspondência; `INFERENCIA` | 006:L320-L323; TD-008 | `EM_AVALIACAO`; `PD-007` |
| `ARCH-021`,`022` Python/FastAPI | `TD-009` | correspondência parcial; `INFERENCIA` | 006:L314-L316; TD-009 | Python `EM_AVALIACAO`; FastAPI não confirmado |
| ausência de Plotly em 006 | `TD-010` | não comparável | leitura 006; TD-010 | `EM_AVALIACAO`; ausência não rejeita alternativa |
| `ARCH-025` Leaflet | `TD-011` | correspondência; `INFERENCIA` | 006:L320-L323; TD-011 | `PROPOSTO`; `PD-010` |
| `ARCH-041` integração ausente | `TD-012` | lacuna; `NAO_ESPECIFICADO` | leitura 006; TD-012 | `EM_AVALIACAO`; `PD-011` |
| `ARCH-043` hospedagem futura ausente | `TD-013` | lacuna; `NAO_ESPECIFICADO` | leitura 006; TD-013 | `EM_AVALIACAO`; `PD-012` |
| `ARCH-025`,`026` mapas | `TD-014` | cobertura parcial; `INFERENCIA` | 006:L320-L323; TD-014 | arquitetura definitiva `EM_AVALIACAO`; `PD-013` |

### 10. Especificação técnica → roadmap

| Origem 006 | Destino 012 | Tipo; classificação | Evidência | Estado/observação |
|---|---|---|---|---|
| `ARCH-001` fluxo MVP | `ROAD-001`–`008` | alinhamento; `INFERENCIA` | 006:L16-L47; 012:L25-L66 | E; não prova derivação/aprovação |
| `ARCH-002` fórmula diferencial | `ROAD-015`,`016`,`046` | parcial; `INFERENCIA` | 006:L49-L68; 012:L91-L93,L219-L237 | A; roadmap não fixa fórmula |
| `ARCH-003`–`006` motor | `ROAD-006`,`007`,`020`,`046` | alinhamento parcial; `INFERENCIA` | seções 3–7; 012:L36-L45,L100-L106,L219-L237 | P; ciência pendente |
| `ARCH-007`–`011` banco | `ROAD-033`,`034`,`045` | suporte tecnológico; `INFERENCIA` | 006:L232-L275; 012:L159-L217 | P; modelo lógico não aparece no roadmap |
| `ARCH-012`–`018` API | `ROAD-045` | interface implícita; `INFERENCIA` | 006:L277-L305; 012:L205-L217 | P; endpoints não constam no roadmap |
| `ARCH-019`,`020` frontend | `ROAD-025`,`026` | alinhamento nominal; `INFERENCIA` | 006:L307-L313; 012:L117-L128 | E; Next current full-stack altera papel |
| `ARCH-021`,`022` backend | `ROAD-030`–`032`,`045`,`046` | alinhamento/alternativa; `INFERENCIA` | 006:L314-L316; 012:L138-L157,L205-L237 | P; roadmap acrescenta Node |
| `ARCH-023`,`024` banco | `ROAD-033`,`034`,`045` | alinhamento nominal; `INFERENCIA` | 006:L317-L319; 012:L159-L171,L205-L217 | E; PostGIS não confirmado |
| `ARCH-025`,`026` mapas | `ROAD-027`–`029`,`035`–`038` | alinhamento + alternativas; `INFERENCIA` | 006:L320-L323; 012:L130-L187 | P; roadmap amplia opções |
| `ARCH-028` fluxo/wireframes | `ROAD-001`–`008`,`047` | alinhamento; `INFERENCIA` | 006:L325-L343; 012:L25-L66,L239-L268 | E/P |
| `ARCH-029`–`033` rastreabilidade | `ROAD-048` | alinhamento parcial; `INFERENCIA` | 006:L345-L355; 012:L270-L283 | P; dados utilizados/área não repetidos integralmente |
| `ARCH-034` satélite | `ROAD-049` | alinhamento; `INFERENCIA` | 006:L357-L365; 012:L293-L303 | E; futuro não aprovado |
| `ARCH-035` clima | `ROAD-012`,`014`,`049` | cobertura parcial; `INFERENCIA` | 006:L357-L365; 012:L74-L90,L293-L303 | P |
| `ARCH-036`,`038` sensores/restauração | `ROAD-021`,`022`,`049` | alinhamento; `INFERENCIA` | 006:L357-L365; 012:L100-L106,L293-L303 | E; futuro |
| `ARCH-037` modelagem hidrológica | `ROAD-019`,`049` parcial | correspondência temática; `INFERENCIA` | 006:L357-L365; 012:L100-L106,L293-L303 | P; tipo de modelo não igualado |

### 11. Backlog → MVP ou futuro

| Origem | Destino/fase | Tipo; classificação | Evidência/localizador | Estado/observação |
|---|---|---|---|---|
| `BLG-001`–`002` | MVP | fase pelo título; `FATO_DOCUMENTADO` | 003:L1-L32 | E; prioridade/estado ausentes |
| `BLG-003`–`006` | MVP | idem | 003:L33-L82 | E; cálculo de área “se implementado” é condicional interna |
| `BLG-007`–`012` | MVP | idem | 003:L83-L156 | E; sincronização proposta como critério de rascunho |
| `BLG-013`–`017` | MVP v0.1 | fase explícita; `FATO_DOCUMENTADO` | 003:L157-L217 | E; conteúdo científico não aprovado |
| `BLG-018`–`020` | MVP no backlog | fase pelo título | 003:L218-L254 | E; regras dependem de ciência/produto |
| `BLG-021`–`022` | MVP | fase pelo título | 003:L255-L282 | E |
| `BLG-023`–`026` | MVP | fase pelo título | 003:L283-L332 | E; gráfico é opcional e alertas “MVP simples” |
| `BLG-027`–`031` | MVP | fase pelo título | 003:L333-L374 | E; contratos diferem da especificação |
| `BLG-032`–`034` | MVP | fase pelo título | 003:L375-L400 | E; staging/production não têm cronologia/estado |

### 12. Alegação histórica → estado de implementação

| Origem/declaração | Destino | Tipo; classificação | Evidência | Estado/observação |
|---|---|---|---|---|
| Dicionário: campos “utilizados pela plataforma” | modelo em `DOC-RAW-005` | alegação de uso; `ALEGACAO_DE_IMPLEMENTACAO_NAO_VERIFICADA` | 005:L3-L10 | `NAO_AVALIADO`; fato apenas sobre a frase |
| Especificação: “plataforma é um sistema digital” | sistema histórico | descrição presente; `FATO_DOCUMENTADO` | 006:L5-L14 | `NAO_AVALIADO`; não comprova execução |
| Especificação: arquitetura “permite” processamento eficiente | `ARCH-027` | alegação de capacidade; `FATO_DOCUMENTADO` | 006:L307-L323 | `NAO_AVALIADO`; sem benchmark |
| Especificação: fluxo corresponde aos wireframes | `ARCH-028` | relação documental | 006:L325-L343 | `NAO_APLICAVEL` à implementação; confirma somente referência |
| Roadmap: plataforma “deve operar” | `ROAD-001`–`024` | proposta; `PROPOSTA` | 012:L5-L23 | `NAO_AVALIADO`; intenção futura |
| Roadmap: opções “são suficientes” | `ROAD-038`,`042`–`044` | recomendação de capacidade | 012:L173-L203 | `NAO_AVALIADO`; não prova adoção |
| 34 critérios do backlog | `BLG-001`–`034` | comportamento desejado | 003:L9-L400 | `NAO_AVALIADO`; nenhuma marcação “feito/concluído” |

Nenhuma linha foi convertida em `EVIDENCIA_IMPLEMENTACAO`. Não houve inspeção de código, schema, migration, banco, teste, configuração ou comportamento.

### Separação entre intenção, proposta e implementação

| Dimensão | Estado sustentado pelas fontes permitidas | Limite |
|---|---|---|
| Modelo de dados pretendido | `NAO_ESPECIFICADO` | Nenhuma decisão da autoridade de dados está registrada; `PD-004` permanece aberta. |
| Modelo de dados histórico declarado | 9 entidades/69 campos de `DOC-RAW-005`, como `FATO_DOCUMENTADO` sobre a fonte | Não é canônico, aprovado nem verificado. |
| Modelo de dados alternativo/proposto | Quatro tabelas/grupos de `DOC-RAW-006`, `PROPOSTA` histórica | Diverge em granularidade do dicionário; não há precedência. |
| Arquitetura pretendida atual | Somente intenções confirmadas em `TD-001` a `TD-007`, todas `DECISAO_RELATADA_PENDENTE_DE_VERIFICACAO` | Confirmação decisória não equivale a implementação. |
| Recomendações arquiteturais | React/Next, Python/FastAPI, PostgreSQL/PostGIS, Leaflet/OSM e alternativas de `DOC-RAW-006`/`012` | Permanecem recomendação/proposta salvo componente confirmado de forma independente. |
| Alegações históricas de uso/capacidade | Frases mapeadas na matriz 12 | São fatos sobre a alegação; estado executável `NAO_AVALIADO`. |
| Estado implementado | `NAO_AVALIADO` | Código e comportamento ficaram integralmente fora do escopo. |

## Achados

Cada evidência literal abaixo é curta e localizada. A conclusão derivada aparece separadamente como `INFERENCIA`; nenhum destino recomendado é decisão da equipe.

| ID | Assunto; tipo; classificação | Fontes/localizadores e evidência literal | Descrição neutra; inferência | Impacto; estado | Autoridade; pendência; destino recomendado |
|---|---|---|---|---|---|
| `DAE-FND-001` | Núcleo funcional; `ALINHAMENTO_DOCUMENTAL`; `FATO_DOCUMENTADO` | 003:L5-L374; `DOC-011`; “login”, “área”, “dados”, “IHFR”, “dashboard” | Backlog e requisitos compartilham o núcleo histórico. `INFERENCIA`: há cobertura temática, não derivação/aprovação. | `INFORMATIVO`; `INFORMATIVO` | produto; `PD-003`; Etapa 8/matriz futura |
| `DAE-FND-002` | Gestão do backlog; `LACUNA`; `NAO_ESPECIFICADO` | leitura integral 003; nenhuma coluna de prioridade/estado | Os 34 itens não registram prioridade nem estado. `INFERENCIA`: o backlog não ordena execução verificavelmente. | `ALTO`; `AGUARDANDO_DECISAO_DE_PRODUTO` | produto; `PD-003`; backlog normativo futuro |
| `DAE-FND-003` | Critérios; `LACUNA`; `FATO_DOCUMENTADO` + `NAO_ESPECIFICADO` | 003:L9-L400; “Critérios de aceitação” | Há listas, mas faltam exceções, autorização, segurança e estados em vários itens. `INFERENCIA`: não bastam para aceite normativo. | `ALTO`; `AGUARDANDO_DECISAO_DE_PRODUTO` | produto/UX; `PD-003`,`005`; especificação de requisitos |
| `DAE-FND-004` | Cobertura backlog↔requisitos; `DIVERGENCIA_DOCUMENTAL`; `INFERENCIA` | matriz 1; 003:L195-L205,L222-L232,L379-L400; `DOC-011` | Data quality, drivers, testes/deploy não têm requisito direto; outros requisitos não têm história direta. | `ALTO`; `AGUARDANDO_DECISAO_DE_PRODUTO` | produto; `PD-003`; Etapa 8 |
| `DAE-FND-005` | Fronteira MVP/futuro; `AMBIGUIDADE`; `FATO_DOCUMENTADO` | 003:L49-L60,L298-L308,L394-L400; “se implementado”, “opcional”, staging/production | Itens condicionais/opcionais convivem no backlog MVP. `INFERENCIA`: compromisso mínimo e ordem não são distinguíveis. | `MEDIO`; `AGUARDANDO_DECISAO_DE_PRODUTO` | produto/arquitetura; `PD-003`,`006`; roadmap/requisitos futuros |
| `DAE-FND-006` | Papéis; `DIVERGENCIA_DOCUMENTAL`; `FATO_DOCUMENTADO` | 003:L5-L32; 005:L27-L31; “admin/field_user” versus “admin/technician/field_user” | O enum acrescenta technician e a Etapa 6 registra taxonomia composta. `INFERENCIA`: permissões/escopo não podem ser normalizados. | `BLOQUEANTE_PARA_NORMATIZACAO`; `AGUARDANDO_DECISAO_DE_PRODUTO` | produto/dados; `PD-003`,`015`,`016`; glossário/matriz de permissões |
| `DAE-FND-007` | Núcleo de domínio/dados; `ALINHAMENTO_DOCUMENTAL`; `FATO_DOCUMENTADO` | 005:L12-L235; `DOM-CON-001`,`004`,`010`–`015`,`021` | USER, AREA, SURVEY, módulos, RESULT e ALERTS têm correspondência nominal. `INFERENCIA`: não valida cardinalidade/modelo. | `INFORMATIVO`; `INFORMATIVO` | dados; `PD-004`; modelo futuro |
| `DAE-FND-008` | Organização/laboratório/assinante; `LACUNA`; `NAO_ESPECIFICADO` | leitura integral 005; `USER.organization` 005:L16-L25 | Não há entidades correspondentes. `INFERENCIA`: string opcional não define organização, laboratório, assinante ou tenant. | `BLOQUEANTE_PARA_NORMATIZACAO`; `AGUARDANDO_DECISAO_DE_DADOS` | dados/produto; `PD-014`–`016`; modelo conceitual |
| `DAE-FND-009` | Propriedade/isolamento; `LACUNA`; `NAO_ESPECIFICADO` | 005:L37-L70,L257-L274; “usuário responsável” | user_id existe, mas compartilhamento, tenant e visibilidade não. `INFERENCIA`: não há fronteira de isolamento aprovada. | `BLOQUEANTE_PARA_NORMATIZACAO`; `AGUARDANDO_DECISAO_DE_DADOS` | dados/produto; `PD-003`,`004`,`014`–`016`; norma de segurança/dados |
| `DAE-FND-010` | Chaves/cardinalidades; `LACUNA`; `NAO_ESPECIFICADO` | 005:L12-L274; “Estrutura relacional” | IDs e campos `_id` são nomeados sem PK/FK/unique/cardinalidade/cascata. `INFERENCIA`: diagrama não supre constraints. | `BLOQUEANTE_PARA_NORMATIZACAO`; `AGUARDANDO_DECISAO_DE_DADOS` | dados; `PD-004`,`014`–`016`; modelo lógico futuro |
| `DAE-FND-011` | Ciclo/retensão; `LACUNA`; `NAO_ESPECIFICADO` | leitura integral 005; created_at/updated_at pontuais | Rascunho, edição, recálculo, invalidação, arquivamento, retenção e exclusão faltam. | `BLOQUEANTE_PARA_NORMATIZACAO`; `AGUARDANDO_DECISAO_DE_DADOS` | dados/produto; `PD-003`,`004`; política de ciclo/retenção |
| `DAE-FND-012` | Geoespacial; `LACUNA`; `NAO_ESPECIFICADO` | 005:L37-L49,L172-L181; “geometry”, “latitude”, “longitude” | CRS, precisão, validade, derivação do centroide e proveniência faltam. | `BLOQUEANTE_PARA_NORMATIZACAO`; `AGUARDANDO_DECISAO_DE_DADOS` | dados/arquitetura; `PD-004`,`006`,`013`; contrato geoespacial |
| `DAE-FND-013` | Variáveis; `ALINHAMENTO_DOCUMENTAL`; `INFERENCIA` | matriz 7; 005:L74-L182; `VAR-001`–`017`; `SCI-FND-010` | Todas as 17 variáveis possuem campo histórico identificável. A correspondência não valida método, tipo ou regra. | `INFORMATIVO`; `INFORMATIVO` | ciência/dados; `PD-002`,`004`; Etapa 8 |
| `DAE-FND-014` | Densidade de drenagem; `DIVERGENCIA_DOCUMENTAL`; `FATO_DOCUMENTADO` | 005:L176-L181; `DOC-010`; `SCI-FND-003`; “drainage_density” | Dicionário contém o campo; contrato/algoritmo da Etapa 5 não têm entrada. `INFERENCIA`: cadeia variável→algoritmo fica interrompida. | `BLOQUEANTE_PARA_NORMATIZACAO`; `AGUARDANDO_DECISAO_DE_DADOS` | ciência/dados; `PD-002`,`004`; contrato de entrada/modelo |
| `DAE-FND-015` | Trilha IHFR; `LACUNA`; `NAO_ESPECIFICADO` | 005:L184-L214; `MATH-FND-018`; “algorithm_version”, “explanation” | Resultado não contém raw snapshot, scores por variável, drivers ou recomendações. `INFERENCIA`: audit trail do backlog/algoritmo não é plenamente representado. | `BLOQUEANTE_PARA_NORMATIZACAO`; `AGUARDANDO_DECISAO_DE_DADOS` | dados/ciência; `PD-002`,`004`; contrato de persistência |
| `DAE-FND-016` | Resultado insuficiente; `DIVERGENCIA_DOCUMENTAL`; `FATO_DOCUMENTADO` | 005:L203-L208; 003:L183-L194; “baixo/moderado/alto/crítico” versus “insuficiente” | Dicionário não enumera insuficiente previsto pelo backlog/algoritmo. `INFERENCIA`: cardinalidade da saída diverge. | `ALTO`; `AGUARDANDO_DECISAO_DE_DADOS` | ciência/produto/dados; `PD-002`–`004`; contrato de saída |
| `DAE-FND-017` | Versionamento; `AMBIGUIDADE`; `FATO_DOCUMENTADO` | 005:L277-L285; “IHFR_v0.1”, “v0.2”, “v1.0” | Há campo/constante e versões futuras, sem governança, calibração, vigência ou migração. | `BLOQUEANTE_PARA_NORMATIZACAO`; `AGUARDANDO_DECISAO_DE_DADOS` | ciência/dados/arquitetura; `PD-002`,`004`,`006`; política de versão |
| `DAE-FND-018` | Modelo de persistência; `DIVERGENCIA_DOCUMENTAL`; `FATO_DOCUMENTADO` | 005:L74-L182; 006:L232-L275; quatro entidades versus “variáveis ambientais” | Dicionário separa módulos; especificação propõe tabela única e mistura diagnóstico/resultado. `INFERENCIA`: granularidade/aplicabilidade não permitem conflito estrito. | `BLOQUEANTE_PARA_NORMATIZACAO`; `AGUARDANDO_DECISAO_DE_DADOS` | dados/arquitetura; `PD-004`,`006`; modelo lógico/ADR futuro |
| `DAE-FND-019` | Fórmula IHFR; `DIVERGENCIA_DOCUMENTAL`; `FATO_DOCUMENTADO` | 006:L49-L68; `DOC-010`; `SCI-FND-011`; “0.35H + 0.30S + 0.25V + 0.10T” | Especificação usa pesos diferenciais sem recorte; Etapa 5 distingue fórmula geral equivalente e regional diferencial. Versão/aplicabilidade não coincidem comprovadamente, portanto não é conflito estrito. | `BLOQUEANTE_PARA_NORMATIZACAO`; `AGUARDANDO_VALIDACAO_CIENTIFICA` | ciência; `PD-002`; contrato matemático futuro |
| `DAE-FND-020` | Backend; `DIVERGENCIA_DOCUMENTAL`; `INFERENCIA` | 006:L307-L323; 012:L138-L157,L205-L217; `TD-001`,`009` | Fontes recomendam Python/FastAPI separado; decisão atual confirma Next.js full-stack e mantém Python em avaliação. Período/autoridade resolvem parte, sem definir integração final. | `BLOQUEANTE_PARA_NORMATIZACAO`; `AGUARDANDO_DECISAO_DE_ARQUITETURA` | arquitetura; `PD-006`,`008`,`011`; ADR após decisão |
| `DAE-FND-021` | PostgreSQL; `ALINHAMENTO_DOCUMENTAL`; `DECISAO_RELATADA_PENDENTE_DE_VERIFICACAO` | 006:L317-L319; 012:L159-L171; `TD-002`; “PostgreSQL” | As fontes recomendam e o registro confirma intenção. Implementação não foi verificada; PostGIS não é confirmado. | `INFORMATIVO`; `INFORMATIVO` | arquitetura; `PD-006` para ADR; TECH_DECISIONS |
| `DAE-FND-022` | Prisma/Neon; `NAO_COMPARAVEL`; `DECISAO_RELATADA_PENDENTE_DE_VERIFICACAO` | leitura 006/012; `TD-003`,`004` | Fontes não citam as escolhas atuais. `INFERENCIA`: ausência histórica não contradiz decisões posteriores. | `INFORMATIVO`; `AGUARDANDO_DECISAO_DE_ARQUITETURA` | arquitetura; `PD-006`; registro/ADR futuro |
| `DAE-FND-023` | Mapas; `PROPOSTA_NAO_APROVADA`; `PROPOSTA`/`EM_AVALIACAO` | 006:L320-L323; 012:L130-L187; `TD-008`,`010`,`011`,`014` | Leaflet/OSM são recomendações; Plotly é alternativa externa ao corpus; arquitetura final aberta. | `MEDIO`; `AGUARDANDO_DECISAO_DE_ARQUITETURA` | arquitetura; `PD-007`,`009`,`010`,`013`; ADR futuro |
| `DAE-FND-024` | Integração; `LACUNA`; `NAO_ESPECIFICADO` | leitura 006/012; `TD-012`; diagramas usam seta | Não há contrato Next/Python, responsabilidade, API interna, implantação, erro ou versionamento. | `BLOQUEANTE_PARA_NORMATIZACAO`; `AGUARDANDO_DECISAO_DE_ARQUITETURA` | arquitetura; `PD-008`,`011`; contrato/ADR |
| `DAE-FND-025` | Hospedagem; `AMBIGUIDADE`; `FATO_DOCUMENTADO` + decisão relatada | 012:L189-L203; `TD-003`,`007`,`013`; “Digital Ocean ou Vercel + Supabase” | Roadmap oferece combinações; decisões atuais registram Vercel e Neon no desenvolvimento; futuro continua aberto. Contextos diferentes evitam conflito. | `ALTO`; `AGUARDANDO_DECISAO_DE_ARQUITETURA` | arquitetura/operação; `PD-012`; estratégia de ambientes/hospedagem |
| `DAE-FND-026` | Segurança/NFR; `LACUNA`; `NAO_ESPECIFICADO` | 006:L345-L355; 012:L270-L289; “armazenamento seguro” | Segurança é enunciada sem mecanismos; desempenho, disponibilidade, privacidade, observabilidade e metas faltam. | `BLOQUEANTE_PARA_NORMATIZACAO`; `AGUARDANDO_DECISAO_DE_ARQUITETURA` | produto/dados/arquitetura; `PD-003`,`004`,`006`; NFR/segurança |
| `DAE-FND-027` | Governança do roadmap; `LACUNA`; `NAO_ESPECIFICADO` | 012:L25-L303; “três fases principais” | Fases não têm datas, marcos, responsáveis, riscos, gates ou estados. `INFERENCIA`: não é plano executável/auditável. | `ALTO`; `AGUARDANDO_DECISAO_DE_ARQUITETURA` | produto/arquitetura; `PD-003`,`006`; roadmap governado |
| `DAE-FND-028` | Expansões; `PROPOSTA_NAO_APROVADA`; `PROPOSTA` | 006:L357-L365; 012:L68-L111,L293-L303 | Satélite, sensores, modelos e carbono são possibilidades/fases futuras sem aprovação ou dependências suficientes. | `MEDIO`; `AGUARDANDO_DECISAO_DE_ARQUITETURA` | produto/ciência/arquitetura; `PD-001`–`006`; backlog/roadmap futuros |
| `DAE-FND-029` | Estado implementado; `NAO_COMPARAVEL`; `NAO_ESPECIFICADO` | limites desta etapa; `TECH_DECISIONS.md` | Nenhum código/comportamento foi inspecionado. `INFERENCIA`: conformidade documental↔implementação não pode ser concluída. | `INFORMATIVO`; `INFORMATIVO` | futura auditoria autorizada; nenhuma pendência resolvida |
| `DAE-FND-030` | Linguagem de uso; `ALEGACAO_DE_IMPLEMENTACAO_NAO_VERIFICADA`; `FATO_DOCUMENTADO` | 005:L3-L10; “campos ... utilizados pela plataforma” | A frase alega uso, sem evidência executável. Estado permanece `NAO_AVALIADO`. | `MEDIO`; `INFORMATIVO` | dados/implementação futura; `PD-004`; futura comparação autorizada |
| `DAE-FND-031` | Autoridades; `PENDENCIA_DE_AUTORIDADE`; `PENDENCIA_DE_DECISAO` | `SOURCE_AUTHORITY.md`; `PD-002`–`006`; ausência nas fontes | Autoridades não estão designadas; nenhum inventário pode ser promovido a norma. | `BLOQUEANTE_PARA_NORMATIZACAO`; `AGUARDANDO_DESIGNACAO_DE_AUTORIDADE` | equipe; `PD-002`–`006`; registros normativos futuros |

### Aplicação do critério estrito de conflito

Nenhum `CONFLITO_DOCUMENTAL` próprio foi identificado. As divergências de fórmula, persistência, papéis, backend e hospedagem não satisfazem simultaneamente igualdade comprovada de versão/período/aplicabilidade e ausência de recorte conciliador. Os dois conflitos já documentados na Etapa 5 não foram reabertos nem resolvidos.

### Contagens dos achados

| Tipo | Quantidade |
|---|---:|
| `ALINHAMENTO_DOCUMENTAL` | 4 |
| `DIVERGENCIA_DOCUMENTAL` | 7 |
| `CONFLITO_DOCUMENTAL` | 0 |
| `AMBIGUIDADE` | 3 |
| `LACUNA` | 11 |
| `DUPLICIDADE` | 0 |
| `NAO_COMPARAVEL` | 2 |
| `PROPOSTA_NAO_APROVADA` | 2 |
| `ALEGACAO_DE_IMPLEMENTACAO_NAO_VERIFICADA` | 1 |
| `PENDENCIA_DE_AUTORIDADE` | 1 |
| **Total** | **31** |

| Impacto | Quantidade |
|---|---:|
| `BLOQUEANTE_PARA_NORMATIZACAO` | 15 |
| `ALTO` | 6 |
| `MEDIO` | 4 |
| `INFORMATIVO` | 6 |
| **Total** | **31** |

| Estado | Quantidade |
|---|---:|
| `AGUARDANDO_DECISAO_DE_PRODUTO` | 5 |
| `AGUARDANDO_DECISAO_DE_DADOS` | 10 |
| `AGUARDANDO_VALIDACAO_CIENTIFICA` | 1 |
| `AGUARDANDO_DECISAO_DE_ARQUITETURA` | 8 |
| `AGUARDANDO_DESIGNACAO_DE_AUTORIDADE` | 1 |
| `INFORMATIVO` | 6 |
| **Total** | **31** |

Bloqueios para futura normatização: `DAE-FND-006`,`008`–`012`,`014`,`015`,`017`–`020`,`024`,`026` e `031`. Eles não bloqueiam a conclusão desta auditoria nem a futura Etapa 8 após aprovação desta etapa.

## Perguntas para a equipe

As perguntas não são respondidas neste relatório.

| ID | Pergunta | Fontes/achados | Pendência/destino |
|---|---|---|---|
| `DAE-Q-001` | Quais critérios ordenam a prioridade dos 34 itens? | `DAE-FND-002`; leitura 003 | `PD-003`; backlog normativo |
| `DAE-Q-002` | Quais estados e evidências devem sustentar “pronto”, “bloqueado” ou equivalente? | `DAE-FND-002`,`029` | `PD-003`; governança de backlog |
| `DAE-Q-003` | Quem pode aprovar histórias e critérios, e onde registrar a origem? | `DAE-FND-003`,`031` | `PD-003`; requisitos futuros |
| `DAE-Q-004` | Como tratar histórias sem requisito direto e requisitos sem história direta? | `DAE-FND-004`; matriz 1 | `PD-003`; Etapa 8 |
| `DAE-Q-005` | Quais itens condicionais/opcionais são compromisso mínimo do MVP? | `DAE-FND-005` | `PD-003`,`006`; produto/roadmap |
| `DAE-Q-006` | Technician é papel distinto, sinônimo ou subtipo, e qual escopo possui? | `DAE-FND-006`; 003/005 | `PD-015`,`016`; glossário/permissões |
| `DAE-Q-007` | Organização, laboratório, assinante e membro existem no modelo pretendido? | `DAE-FND-008` | `PD-014`–`016`; modelo conceitual |
| `DAE-Q-008` | Quem possui uma Área e qual fronteira de isolamento se aplica? | `DAE-FND-009` | `PD-003`,`004`,`014`–`016` |
| `DAE-Q-009` | Áreas/diagnósticos podem ser compartilhados ou transferidos e com qual histórico? | `DAE-FND-009`–`011` | `PD-014`–`016`; modelo/ciclo |
| `DAE-Q-010` | Quais valores e ciclo se aplicam a `ALERTS.severity`? | DATA-FLD-067; `DAE-FND-011` | `PD-003`,`004`; contrato de alertas |
| `DAE-Q-011` | Quais PK, FK, unique, cardinalidades, cascatas e constraints são pretendidas? | `DAE-FND-010`,`018` | `PD-004`; modelo lógico |
| `DAE-Q-012` | Quais regras de rascunho, recálculo, invalidação, retenção e exclusão se aplicam? | `DAE-FND-011` | `PD-003`,`004`; política de ciclo |
| `DAE-Q-013` | Qual CRS, precisão, validade e proveniência devem ser usados para geometrias/centroides? | `DAE-FND-012` | `PD-004`,`006`,`013`; contrato geoespacial |
| `DAE-Q-014` | Quais das 17 variáveis são obrigatórias e como missing altera dimensão/qualidade? | matriz 7; `DOC-010`; `DAE-FND-013` | `PD-002`,`004`; contrato de entrada |
| `DAE-Q-015` | `drainage_density` integra o cálculo; se sim, com qual normalização e versão? | `DAE-FND-014` | `PD-002`,`004`; ciência/dados |
| `DAE-Q-016` | Como preservar snapshot imutável, proveniência, scores por variável e vínculo ao resultado? | `DAE-FND-015` | `PD-002`,`004`; persistência/auditoria |
| `DAE-Q-017` | Drivers e recomendações devem ser persistidos; com qual formato e ordem? | `DAE-FND-015`; `MATH-FND-017`,`018` | `PD-002`–`004`; contrato de saída |
| `DAE-Q-018` | Como representar resultado insuficiente e reconciliar as classes? | `DAE-FND-016`; `MATH-FND-010`,`011` | `PD-002`–`004` |
| `DAE-Q-019` | Como versionar algoritmo, calibração, parâmetros, schema e recálculo histórico? | `DAE-FND-017` | `PD-002`,`004`,`006`; política de versão |
| `DAE-Q-020` | Qual fórmula/aplicabilidade deve governar o MVP e como registrar aprovação? | `DAE-FND-019`; `DOC-010` | `PD-002`; contrato matemático |
| `DAE-Q-021` | O modelo pretendido separa módulos de dados ou usa tabela ambiental única? | `DAE-FND-018` | `PD-004`,`006`; modelo/ADR futuro |
| `DAE-Q-022` | Next.js full-stack executará quais responsabilidades e Python/FastAPI terá qual papel, se aprovado? | `DAE-FND-020`,`024` | `PD-006`,`008`,`011`; ADR |
| `DAE-Q-023` | Quais endpoints, payloads, erros, versões, idempotência e autorização formam o contrato canônico? | ARCH-012–018; backlog épico 8 | `PD-003`,`004`,`006`; contrato de API |
| `DAE-Q-024` | Qual mecanismo de autenticação/sessão e modelo de autorização/isolamento deve ser aprovado? | ARCH-039`,`040`; `DAE-FND-026` | `PD-003`,`004`,`006`,`016` |
| `DAE-Q-025` | Qual composição de OSM, Leaflet, Plotly ou outras opções será adotada e com quais critérios? | `DAE-FND-023` | `PD-007`,`009`,`010`,`013` |
| `DAE-Q-026` | Quais provedores/ambientes atendem desenvolvimento, staging e produção, e qual é a estratégia futura? | `DAE-FND-025`; `TD-003`,`007`,`013` | `PD-012`; arquitetura/operação |
| `DAE-Q-027` | Quais metas de segurança, privacidade, desempenho, disponibilidade e observabilidade se aplicam? | `DAE-FND-026` | `PD-003`,`004`,`006`; NFR |
| `DAE-Q-028` | Quais dados operam offline e como sincronização, conflitos e proteção local funcionam? | `BLG-012`; ARCH-046; `PROD-FND-014` | `PD-003`,`004`,`006`; produto/dados/arquitetura |
| `DAE-Q-029` | Quais datas, marcos, responsáveis, riscos e condições de avanço governam as três fases? | `DAE-FND-027`,`028` | `PD-003`,`006`; roadmap governado |
| `DAE-Q-030` | Quem possui autoridade e quais documentos normativos receberão decisões de ciência, produto, dados e arquitetura? | `DAE-FND-031`; `GAP-009` | `PD-001`–`006`; governança |

Quantidade: 30 perguntas sobre backlog, papéis, domínio, isolamento, ciclo, geoespacial, variáveis, auditabilidade, versionamento, fórmula, modelo, APIs, autenticação, integração, mapas, hospedagem, NFR, offline, roadmap e autoridade.

## Rastreabilidade e encaminhamentos

### Cadeias `E7-NNN`

| ID | Cadeia origem → destino | Tipo; classificação | Evidência/localizador | Estado/observação |
|---|---|---|---|---|
| `E7-001` | BLG-001 → PROD-REQ-028 → USER.email/password → ARCH-013/039 | cadeia temática; `INFERENCIA` | 003:L9-L20; `DOC-011`; 005:L16-L25; 006:L284-L287 | P; mecanismo ausente |
| `E7-002` | BLG-002 → PROD-REQ-039–041 → USER.role/AREA.user_id → ARCH-040 | cadeia de autorização; `INFERENCIA` | 003:L21-L32; 005:L16-L49 | P/A; `PD-015`,`016` |
| `E7-003` | BLG-003 → requisitos de Área → DATA-ENT-002 → API/mapa | cadeia nominal; `INFERENCIA` | 003:L37-L48; 005:L33-L59; 006:L288-L323 | E/P |
| `E7-004` | BLG-004/005 → geometry → PostGIS/mapas recomendados | cadeia geoespacial; `INFERENCIA` | 003:L49-L71; 005:L37-L49; 006:L317-L323 | P; CRS/decisão ausentes |
| `E7-005` | BLG-008 → VAR-001–005 → WATER_DATA → cálculo | cadeia científico-dados; `INFERENCIA` | 003:L98-L109; 005:L74-L109; `DOC-010` | E/P; ciência pendente |
| `E7-006` | BLG-009 → VAR-006–010 → SOIL_DATA → cálculo | idem | 003:L110-L121; 005:L111-L143; `DOC-010` | E/P |
| `E7-007` | BLG-010 → VAR-011–014 → VEGETATION_DATA → cálculo | idem | 003:L122-L133; 005:L145-L170; `DOC-010` | E/P |
| `E7-008` | BLG-011 → VAR-015/016/017 → AREA/TERRAIN → cálculo | cadeia parcial; `INFERENCIA` | 003:L134-L144; 005:L37-L59,L172-L181 | P; VAR-017 interrompida |
| `E7-009` | BLG-013–016 → PROD-REQ-023/051 → DOC-010 → IHFR_RESULT | cadeia algorítmica; `INFERENCIA` | 003:L161-L205; 005:L184-L214 | P; conflitos/ambiguidades anteriores preservados |
| `E7-010` | BLG-021 → resultado científico → IHFR_RESULT → tela/API | cadeia de saída; `INFERENCIA` | 003:L259-L270; `DOC-010`; 005:L184-L214 | P; insuficiente ausente |
| `E7-011` | BLG-017 → PROD-REQ-059 → trilha DOC-010 → módulos/RESULT | cadeia de auditabilidade; `INFERENCIA` | 003:L206-L217; 005:L61-L214 | P; snapshot/scores faltam |
| `E7-012` | BLG-018–020 → drivers/recomendação → persistência | cadeia incompleta; `INFERENCIA` | 003:L222-L254; leitura 005 | `NAO_LOCALIZADA` no destino de dados |
| `E7-013` | BLG-023/024 → AREA/SURVEY/RESULT → histórico | cadeia temporal; `INFERENCIA` | 003:L287-L308; 005:L33-L72,L184-L201 | P; “último”/retenção ausentes |
| `E7-014` | BLG-026 → salinidade/IHFR → ALERTS | cadeia de alerta; `INFERENCIA` | 003:L321-L332; 005:L78-L109,L216-L235 | P; regra/severity/ciclo ausentes |
| `E7-015` | BLG-027–031 → endpoints backlog → ARCH-012–018 | comparação de contrato; `INFERENCIA` | 003:L333-L374; 006:L277-L305 | P/divergente; rotas e cobertura variam |
| `E7-016` | BLG-032–034 → testes/logs/deploy → ARCH-043/044/048/049 | cadeia não coberta; `INFERENCIA` | 003:L375-L400; leitura 006 | `NAO_LOCALIZADA` na especificação |
| `E7-017` | ARCH-020/ROAD-026 → TD-001 | correspondência decisória | 006:L307-L313; 012:L117-L128; TD-001 | decisão relatada confirmada; implementação pendente |
| `E7-018` | ARCH-023/ROAD-033 → TD-002 | correspondência decisória | 006:L317-L319; 012:L159-L171; TD-002 | idem |
| `E7-019` | ARCH-025/026 + ROAD-027–038 → TD-008/010/011/014 | alternativas; `INFERENCIA` | seções de mapas; TDs | em avaliação/proposto; arquitetura aberta |
| `E7-020` | ROAD-010–024/049 → ciência/dados/arquitetura futuras | encaminhamento; `RECOMENDACAO` | 012:L68-L111,L285-L303 | propostas sem aprovação; Etapa 8 após revisão |

### Pendências existentes relacionadas

| Pendência | Cobertura nesta etapa | Resultado |
|---|---|---|
| `PD-001` | escopo/aplicações e expansão territorial | permanece aberta; nenhuma vigência institucional inferida |
| `PD-002` | fórmula, variáveis, missing, qualidade, alertas, recomendações | suficiente; nenhuma nova pendência científica criada |
| `PD-003` | backlog, MVP, critérios, papéis, APIs e NFR | suficiente; permanece aberta |
| `PD-004` | modelo, constraints, proveniência, isolamento, ciclo e histórico | suficiente; permanece aberta |
| `PD-005` | formulários, mapas, erros, offline e apresentação | suficiente; permanece aberta |
| `PD-006` | arquitetura e ADRs | suficiente; permanece aberta |
| `PD-007`–`013` | OSM, Python, Plotly, Leaflet, integração, hospedagem, mapas | cobrem integralmente as alternativas identificadas; estados inalterados |
| `PD-014`–`016` | organização/laboratório/assinante, termos, propriedade/acesso | cobrem ausências de domínio/dados; estados inalterados |
| `PD-017` | Figma | relacionado apenas indiretamente; continua opcional e não bloqueante |

Nenhuma decisão material genuinamente nova e não abrangida foi identificada; `PENDING_DECISIONS.md` permaneceu inalterado.

### Candidatos para atualização futura da matriz global

- `RECOMENDACAO` — Revisar `TR-010` para registrar que `DOC-RAW-005` representa campos para 17/17 `VAR-NNN`, mas somente 16/17 possuem entrada algorítmica na Etapa 5; manter a relação inferencial e `VAR-017` como lacuna.
- `RECOMENDACAO` — Revisar `TR-011` com a cobertura backlog↔requisitos: núcleo alinhado, itens sem correspondência direta e nenhuma aprovação/derivação presumida.
- `RECOMENDACAO` — Revisar `TR-013` com as correspondências entre requisitos/conceitos e 9 entidades/69 campos, preservando as relações inferenciais e ausências de organização/laboratório.
- `RECOMENDACAO` — Revisar `TR-014` para registrar a divergência de granularidade entre entidades modulares do dicionário e tabela única de variáveis da especificação, sem declarar conflito ou precedência.
- `RECOMENDACAO` — Revisar `TR-015` com a cobertura parcial e divergência de rotas entre backlog e especificação técnica.
- `RECOMENDACAO` — Revisar `TR-016` com alinhamentos, alternativas adicionais e diferenças de fase entre especificação e roadmap, sem promover recomendações.
- `RECOMENDACAO` — Considerar futura relação de controle entre `DOC-RAW-006`/`DOC-RAW-012` e `TECH_DECISIONS.md`, registrando estados por tecnologia e separando intenção de implementação.

Nenhum candidato foi aplicado a `TRACEABILITY_MATRIX.md`; a consolidação permanece reservada à Etapa 8.

### Lacunas candidatas para a matriz

- Backlog sem prioridade, estado, aprovação e correspondência completa a requisitos.
- Modelo sem organização/laboratório/assinante, isolamento, cardinalidades, ciclo e retenção.
- Contrato geoespacial sem CRS, validade, precisão e proveniência.
- Cadeia interrompida de `VAR-017` e contrato incompleto de auditabilidade/resultados.
- Divergência entre representação modular e tabela ambiental única.
- Contrato de API, autenticação, autorização e integração ausente.
- Alternativas de mapas/hospedagem e arquitetura futura não decididas.
- Roadmap sem datas, marcos, gates, responsáveis, riscos ou estados.

### Candidatos a documentos normativos futuros

- `RECOMENDACAO` — Backlog/especificação de requisitos aprovada, com prioridade, estado, fase, aceite e dependências.
- `RECOMENDACAO` — Modelo conceitual e lógico de dados, com glossário, tenant/laboratório, ownership, chaves, cardinalidades e ciclo.
- `RECOMENDACAO` — Contrato científico-dados versionado, incluindo 17 variáveis, missing, proveniência, QC e cadeia algorítmica.
- `RECOMENDACAO` — Contrato de resultado/auditoria, com snapshots, scores, drivers, recomendações, precisão e histórico.
- `RECOMENDACAO` — Especificação geoespacial com CRS, geometria, centroide, camadas e qualidade.
- `RECOMENDACAO` — Contrato de API/autenticação/autorização e matriz de isolamento.
- `RECOMENDACAO` — ADRs somente após decisões de backend, integração, mapas, dados e hospedagem.
- `RECOMENDACAO` — Especificação de segurança/NFR/observabilidade e política de ambientes/deploy.
- `RECOMENDACAO` — Roadmap governado com marcos, gates, riscos, responsáveis e evidência de estado.
- `RECOMENDACAO` — PRD somente após a Etapa 8 e aprovações necessárias; nenhum PRD foi criado.

### Cobertura dos assuntos de atenção

| Assunto exigido | Resultado/localizador analítico |
|---|---|
| Entidades versus domínio implícito | matriz 5; `DAE-FND-007`–`010` |
| Organização/laboratório/assinante | `DAE-FND-008`; `DAE-Q-007` |
| Propriedade/isolamento de áreas/diagnósticos | `DAE-FND-009`; matrizes 5/6 |
| Papéis/permissões | `DAE-FND-006`,`009`; `E7-002` |
| Versionamento do algoritmo | `DAE-FND-017`; matriz 8 |
| Preservação de entradas científicas | `DAE-FND-015`; matrizes 7/8 |
| Geometrias/dados territoriais | `DAE-FND-012`,`014`; `E7-004`,`008` |
| Histórico temporal do IHFR | matriz 8; `DAE-FND-011`,`015`–`017` |
| Missing/qualidade | BLG-014/016; matriz 7; `DOC-010` |
| Contratos entre componentes | `DAE-FND-024`; matrizes 9/10 |
| Next.js full-stack/Python | `DAE-FND-020`; `E7-017` |
| Prisma/PostgreSQL/Neon | matriz 9; `DAE-FND-021`,`022` |
| OSM/Plotly/Leaflet | matriz 9; `DAE-FND-023`; `E7-019` |
| Estratégia de integração | ARCH-041; `DAE-FND-024` |
| Hospedagem atual/futura | `DAE-FND-025`; ROAD-039–044 |
| Autenticação | ARCH-013/039/040; `E7-001`,`002` |
| GPS/offline | BLG-004/005/012; ARCH-046; `DAE-Q-013`,`028` |
| Segurança/NFR | `DAE-FND-026`; ARCH-039–049 |
| Proposta versus decisão | matrizes 9/10; inventários ARCH/ROAD |
| Backlog versus implementação | matriz 12; `DAE-FND-029`,`030` |

## Resultados quantitativos consolidados

| Item | Quantidade |
|---|---:|
| Fontes primárias lidas integralmente | 4 |
| Linhas físicas | 1355 |
| Épicos/histórias do backlog | 9/34 |
| Entidades/campos/relações/regras | 9/69/10/19 |
| Variáveis científicas com campo / com entrada algorítmica | 17/17 e 16/17 |
| Declarações/ausências `ARCH-NNN` | 49 |
| Itens `ROAD-NNN` | 49 |
| Matrizes/projeções obrigatórias | 12/12 |
| Cadeias `E7-NNN` | 20 |
| Achados/conflitos próprios | 31/0 |
| Perguntas | 30 |
| Evidências de implementação | 0 |

## Limitações e bloqueios

- **Bloqueio de execução:** nenhum.
- **Bloqueios para futura normatização:** 15 achados listados na síntese e `PD-002` a `PD-006`, além das pendências técnicas/de domínio relacionadas; não impedem concluir a auditoria.
- Ausência significa somente “não localizada no corpus documental autorizado”, não inexistência no projeto ou obrigação de criação.
- Metadados de origem, data, responsável e aprovação das quatro fontes continuam não especificados.
- Nenhuma fórmula, campo, entidade, relação, tecnologia, fase ou recomendação foi aprovada pela auditoria.
- Nenhum estado de implementação foi verificado; escolhas relatadas mantiveram exatamente o estado de `TECH_DECISIONS.md`.
- Não houve internet, fonte externa, código, schema, migration, banco, teste, configuração, deploy ou comportamento executável.
- A Etapa 8, a atualização da matriz global e documentos normativos não foram iniciados.

## Artefatos criados, movidos ou alterados

| Caminho | Ação | Estado/finalidade |
|---|---|---|
| `docs/plans/active/auditoria-requisitos-dominio-wireframes.md` | origem removida por movimento autorizado | não existe mais no caminho ativo |
| `docs/plans/completed/auditoria-requisitos-dominio-wireframes.md` | movido/alterado | `CONCLUIDO`; Etapa 6 arquivada |
| `docs/reports/audits/2026-08-26-auditoria-requisitos-dominio-wireframes.md` | alterado | `CANONICO_ATUAL` exclusivamente analítico |
| `docs/plans/active/auditoria-dados-arquitetura-execucao.md` | criado | `AGUARDANDO_REVISAO`; plano da Etapa 7 |
| `docs/reports/audits/2026-08-26-auditoria-dados-arquitetura-execucao.md` | criado | `EM_REVISAO`; esta auditoria |
| `docs/governance/DOCUMENT_REGISTER.md` | alterado | registrar encerramento da Etapa 6 e artefatos da Etapa 7 |

`PENDING_DECISIONS.md` não foi alterado porque todas as decisões necessárias já estão cobertas.

## Integridade de `docs/raw/`

| Arquivo | Tipo | Bytes | Permissão | `mtime` inicial/final | SHA-256 inicial/final |
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

Resultado esperado e posteriormente confirmado nas verificações finais: 13/13 caminhos, tipos, bytes, permissões, `mtime` e SHA-256 idênticos; `git diff -- docs/raw` vazio.

## Verificações executadas

| Verificação | Comando/método | Resultado |
|---|---|---|
| Git inicial/final | `git status --short --untracked-files=all`, `git rev-parse HEAD`, `git branch --show-current` | commit/branch estáveis; somente caminhos autorizados da tarefa no final |
| Encerramento Etapa 6 | leitura/contagem, movimento e `sha256sum` | 60/51/6/3, 414, 22, 28 e 9 confirmados; checksums registrados |
| Corpus primário | `sed`, `nl -ba`, `wc -l` | 4/4 fontes; 1355 linhas lidas integralmente |
| Namespaces/referências | verificação mecânica efêmera | sequências completas/únicas e referências válidas |
| Contagens | extração mecânica das tabelas | somatórios de backlog, dados, arquitetura, roadmap e achados fecham |
| Fontes/localizadores | revisão mecânica das tabelas mestras | todos os itens inventariados têm fonte/localizador |
| Registro documental | comparação das duas tabelas e caminhos | correspondência exata, IDs únicos e caminhos válidos |
| Links Markdown locais | extração/resolução relativa | nenhum destino local ausente |
| Estrutura de tabelas | contagem de delimitadores por bloco | nenhuma linha de dados com quantidade divergente de colunas |
| Integridade `docs/raw/` | `find`, `stat`, `sha256sum`, diff Git | 13/13 idênticos; delta vazio |
| Escopo/whitespace | status Git, `git diff --check` e checks equivalentes dos novos arquivos | aprovado; somente caminhos autorizados |
| Autoridade/implementação | buscas dirigidas e revisão integral | zero `EVIDENCIA_IMPLEMENTACAO`; tecnologias propostas não promovidas |
| Segurança | busca de padrões e revisão | nenhum segredo, credencial real ou dado pessoal desnecessário |
| Markdown lint | busca de configuração existente | não executado; `rg` e configuração de lint Markdown não estão disponíveis; nenhuma ferramenta instalada |

## Alterações preexistentes

O estado inicial estava limpo no commit `a44a69d69f896e4912ed4acca0d88a7edc11a2c3`, branch `development`. Não havia alterações rastreadas ou não rastreadas a conciliar. A correção de `PROD-REQ-055` já integrava o baseline e foi preservada. Nenhuma mudança externa de commit/worktree foi observada.

## Diff resumido

- 1 plano da Etapa 6 movido do diretório ativo para o concluído e atualizado.
- 1 relatório da Etapa 6 alterado somente para estado/aprovação analítica e caminho do plano.
- 1 plano e 1 relatório da Etapa 7 criados.
- 1 registro canônico de controle alterado.
- 5 destinos finais afetados, além da origem removida pelo movimento; nenhum caminho proibido alterado.

## Ponto de parada

Etapa 7 concluída documentalmente. `DOC-PLAN-006` permanece em `AGUARDANDO_REVISAO` e este relatório em `EM_REVISAO`. Nenhum modelo de dados, requisito, fórmula, algoritmo, tecnologia, arquitetura, roadmap ou estado de implementação foi aprovado; nenhuma atualização normativa ou da matriz global foi feita; a Etapa 8 não foi iniciada.
