# Decisões pendentes

## Uso do registro

Este registro reúne pontos que dependem de decisão, validação ou designação da equipe. Todas as entradas iniciais têm classificação `PENDENCIA_DE_DECISAO`; sua presença não aprova requisito, tecnologia, arquitetura, definição nem responsável. No campo Impacto, regras declaradas pelo mandato são `FATO_DOCUMENTADO` e efeitos derivados são `INFERENCIA`; nenhuma dessas classificações constitui decisão resultante da pendência.

Estados permitidos: `ABERTA`, `EM_ANALISE`, `AGUARDANDO_DECISAO`, `RESOLVIDA` e `CANCELADA`. Ao resolver uma entrada, registre a decisão, origem, data e responsável, atualize o documento canônico de destino e preserve esta linha como histórico `RESOLVIDA`. Cancelamentos também exigem origem registrada.

## Pendências abertas

| Identificador | Assunto | Descrição | Classificação | Impacto | Estado |
|---|---|---|---|---|---|
| `PD-001` | Autoridade sobre escopo institucional | Designar quem pode confirmar interpretação, vigência e mudanças no escopo institucional. | `PENDENCIA_DE_DECISAO` | `INFERENCIA` — Conflitos de escopo não podem ser resolvidos sem autoridade identificada. | `ABERTA` |
| `PD-002` | Autoridade sobre regras científicas | Designar responsáveis científicos para validar regras, variáveis e cálculo do IHFR. | `PENDENCIA_DE_DECISAO` | `FATO_DOCUMENTADO` — Conteúdo científico não pode receber validação normativa por inferência do agente. | `ABERTA` |
| `PD-003` | Autoridade sobre produto e requisitos | Designar quem aprova objetivos, requisitos e regras de negócio. | `PENDENCIA_DE_DECISAO` | `INFERENCIA` — Impede consolidar intenção de produto quando as fontes não bastarem. | `ABERTA` |
| `PD-004` | Autoridade sobre dados | Designar quem aprova conceitos, modelo pretendido e governança de dados. | `PENDENCIA_DE_DECISAO` | `INFERENCIA` — Impede resolver divergências sobre conceitos e modelo de dados. | `ABERTA` |
| `PD-005` | Autoridade sobre UX | Designar quem aprova fluxos, wireframes e estados de artefatos de UX. | `PENDENCIA_DE_DECISAO` | `FATO_DOCUMENTADO` — Explorações não são requisitos aprovados. | `ABERTA` |
| `PD-006` | Autoridade sobre arquitetura | Designar quem confirma decisões e aceita ADRs de arquitetura. | `PENDENCIA_DE_DECISAO` | `FATO_DOCUMENTADO` — Propostas técnicas não têm autoridade normativa enquanto não forem confirmadas. | `ABERTA` |
| `PD-007` | OpenStreetMap | Definir o status definitivo do uso de OpenStreetMap. | `PENDENCIA_DE_DECISAO` | `INFERENCIA` — Afeta a futura solução de mapas e suas dependências. | `ABERTA` |
| `PD-008` | Python | Definir o status do uso de Python para cálculos científicos e do IHFR. | `PENDENCIA_DE_DECISAO` | `INFERENCIA` — Afeta responsabilidades, integração e validação dos cálculos. | `ABERTA` |
| `PD-009` | Plotly | Definir o status do uso de Plotly em visualizações relacionadas ao mapa. | `PENDENCIA_DE_DECISAO` | `INFERENCIA` — Afeta a composição futura das visualizações. | `ABERTA` |
| `PD-010` | Leaflet | Definir o status da possibilidade de uso de Leaflet. | `PENDENCIA_DE_DECISAO` | `INFERENCIA` — Afeta a solução futura de mapas. `FATO_DOCUMENTADO` — Plotly ter sido considerado não implica rejeição de Leaflet. | `ABERTA` |
| `PD-011` | Integração entre Python e Next.js | Definir a estratégia de integração entre componentes Python e Next.js, caso Python seja aprovado. | `PENDENCIA_DE_DECISAO` | `INFERENCIA` — Afeta interfaces, responsabilidades, implantação e operação. | `ABERTA` |
| `PD-012` | Hospedagem futura | Definir a estratégia futura de hospedagem além da escolha atualmente relatada para a aplicação. | `PENDENCIA_DE_DECISAO` | `INFERENCIA` — Afeta a arquitetura e a operação futuras. | `ABERTA` |
| `PD-013` | Arquitetura de mapas e visualizações | Definir e aprovar a arquitetura definitiva para mapas e visualizações. | `PENDENCIA_DE_DECISAO` | `INFERENCIA` — Afeta a seleção, combinação e integração dos componentes. | `ABERTA` |
| `PD-014` | Modelo conceitual de assinantes, laboratórios e áreas monitoradas | Definir e aprovar o modelo conceitual dessas entidades e de seus relacionamentos. | `PENDENCIA_DE_DECISAO` | `INFERENCIA` — Afeta produto, dados, permissões e requisitos futuros. | `ABERTA` |
| `PD-015` | Terminologia e papéis | Definir assinante, usuário, laboratório, proprietário, membro, área monitorada e demais papéis relacionados. | `PENDENCIA_DE_DECISAO` | `INFERENCIA` — Ambiguidade terminológica compromete requisitos, dados e UX. | `ABERTA` |
| `PD-016` | Regras de laboratórios | Definir regras de criação, visualização, participação, propriedade e acesso aos laboratórios. | `PENDENCIA_DE_DECISAO` | `INFERENCIA` — Afeta requisitos, permissões, modelo de dados e fluxos de UX. | `ABERTA` |
| `PD-017` | Estado dos artefatos do Figma | Definir critérios para classificar arquivos, páginas, frames, telas ou fluxos como `APROVADO`, `EM_REVISAO`, `EXPLORACAO`, `SUBSTITUIDO` ou `IMPLEMENTADO_NAO_APROVADO`. | `PENDENCIA_DE_DECISAO` | `INFERENCIA` — Sem critérios, artefatos exploratórios podem ser confundidos com requisitos. | `ABERTA` |

## Fontes, alternativas e encaminhamento

| Identificador | Fontes relacionadas | Alternativas conhecidas | Responsável pela decisão | Prazo | Decisão resultante | Destino após resolução |
|---|---|---|---|---|---|---|
| `PD-001` | Mandato de governança; [SOURCE_AUTHORITY.md](SOURCE_AUTHORITY.md) | Pessoa ou grupo a designar; alternativas não especificadas. | não especificado | não especificado | não especificado | Atualizar `SOURCE_AUTHORITY.md` e manter esta entrada como `RESOLVIDA`. |
| `PD-002` | Mandato de governança; [SOURCE_AUTHORITY.md](SOURCE_AUTHORITY.md) | Responsável ou grupo científico a designar; alternativas não especificadas. | não especificado | não especificado | não especificado | Atualizar `SOURCE_AUTHORITY.md` e manter esta entrada como `RESOLVIDA`. |
| `PD-003` | Mandato de governança; [SOURCE_AUTHORITY.md](SOURCE_AUTHORITY.md) | Pessoa ou grupo a designar; alternativas não especificadas. | não especificado | não especificado | não especificado | Atualizar `SOURCE_AUTHORITY.md` e o registro normativo de produto aplicável; manter o histórico. |
| `PD-004` | Mandato de governança; [SOURCE_AUTHORITY.md](SOURCE_AUTHORITY.md) | Pessoa ou grupo a designar; alternativas não especificadas. | não especificado | não especificado | não especificado | Atualizar `SOURCE_AUTHORITY.md` e o registro normativo de dados aplicável; manter o histórico. |
| `PD-005` | Mandato de governança; [SOURCE_AUTHORITY.md](SOURCE_AUTHORITY.md) | Pessoa ou grupo a designar; alternativas não especificadas. | não especificado | não especificado | não especificado | Atualizar `SOURCE_AUTHORITY.md` e o registro normativo de UX aplicável; manter o histórico. |
| `PD-006` | Mandato de governança; [SOURCE_AUTHORITY.md](SOURCE_AUTHORITY.md) | Pessoa ou grupo a designar; alternativas não especificadas. | não especificado | não especificado | não especificado | Atualizar `SOURCE_AUTHORITY.md` e [../../TECH_DECISIONS.md](../../TECH_DECISIONS.md); manter o histórico. |
| `PD-007` | `TD-008` em [../../TECH_DECISIONS.md](../../TECH_DECISIONS.md) | Adotar OpenStreetMap; demais alternativas não especificadas. | não especificado | não especificado | não especificado | Atualizar `TECH_DECISIONS.md`; criar ADR somente se posteriormente aprovado e aplicável; manter o histórico. |
| `PD-008` | `TD-009` em [../../TECH_DECISIONS.md](../../TECH_DECISIONS.md) | Usar Python para cálculos científicos e do IHFR; demais alternativas não especificadas. | não especificado | não especificado | não especificado | Atualizar `TECH_DECISIONS.md`; registrar validações científicas aplicáveis; manter o histórico. |
| `PD-009` | `TD-010` em [../../TECH_DECISIONS.md](../../TECH_DECISIONS.md) | Usar Plotly nas visualizações relacionadas ao mapa; demais alternativas não especificadas. | não especificado | não especificado | não especificado | Atualizar `TECH_DECISIONS.md`; criar ADR somente se posteriormente aprovado e aplicável; manter o histórico. |
| `PD-010` | `TD-011` em [../../TECH_DECISIONS.md](../../TECH_DECISIONS.md) | Usar Leaflet; demais alternativas não especificadas. | não especificado | não especificado | não especificado | Atualizar `TECH_DECISIONS.md`; criar ADR somente se posteriormente aprovado e aplicável; manter o histórico. |
| `PD-011` | `TD-009` e `TD-012` em [../../TECH_DECISIONS.md](../../TECH_DECISIONS.md) | Estratégias de integração não especificadas. | não especificado | não especificado | não especificado | Atualizar `TECH_DECISIONS.md` e eventual ADR aceito; manter o histórico. |
| `PD-012` | `TD-007` e `TD-013` em [../../TECH_DECISIONS.md](../../TECH_DECISIONS.md) | A escolha atual relatada é Vercel; alternativas futuras não especificadas. | não especificado | não especificado | não especificado | Atualizar `TECH_DECISIONS.md` e eventual ADR aceito; manter o histórico. |
| `PD-013` | `TD-008`, `TD-010`, `TD-011` e `TD-014` em [../../TECH_DECISIONS.md](../../TECH_DECISIONS.md) | OpenStreetMap, Plotly e Leaflet estão registrados como itens separados; combinações e arquitetura não especificadas. | não especificado | não especificado | não especificado | Atualizar `TECH_DECISIONS.md` e eventual ADR aceito; manter o histórico. |
| `PD-014` | Mandato de governança; autoridade de dados ainda não designada | Alternativas não especificadas. | não especificado | não especificado | não especificado | Atualizar o registro normativo de dados aplicável após aprovação e manter o histórico. |
| `PD-015` | Mandato de governança; autoridades de produto e dados ainda não designadas | Definições não especificadas. | não especificado | não especificado | não especificado | Atualizar os registros normativos de produto e dados aplicáveis e manter o histórico. |
| `PD-016` | Mandato de governança; autoridades de produto, dados e UX ainda não designadas | Regras não especificadas. | não especificado | não especificado | não especificado | Atualizar os registros normativos de produto, dados e UX aplicáveis e manter o histórico. |
| `PD-017` | Mandato de governança; autoridade de UX ainda não designada | Estados a disciplinar: `APROVADO`, `EM_REVISAO`, `EXPLORACAO`, `SUBSTITUIDO` e `IMPLEMENTADO_NAO_APROVADO`; critérios não especificados. | não especificado | não especificado | não especificado | Atualizar o registro normativo de UX aplicável e manter o histórico. |

Plotly ter sido considerado não implica rejeição de Leaflet. Nenhuma entrada deste registro deve ser encerrada por inferência ou pela mera existência de uma implementação.

## Referências da consolidação transversal

`FATO_DOCUMENTADO` — A auditoria consolidada [`DOC-013`](../reports/audits/2026-08-26-auditoria-documental-consolidada.md) relacionou as 17 pendências existentes aos pacotes abaixo. Esta seção acrescenta rastreabilidade; não altera assunto, estado, responsável, prazo, alternativas ou decisão resultante.

| Pendência | Pacotes relacionados | Evidência adicional da consolidação | Impacto preservado |
|---|---|---|---|
| `PD-001` | `DEC-PKG-001`,`003`,`014`,`015` | `GAP-010`; `CON-FND-016`,`017`,`043` | Escopo institucional continua sem autoridade/fonte aprovada identificada no corpus. |
| `PD-002` | `DEC-PKG-002`–`004`,`008`,`014`,`015` | `CON-FND-002`–`026`, conforme assunto; 17 ocorrências bloqueantes científicas nas Etapas 4 e 5 antes da deduplicação | Ciência não pode ser promovida por inferência; os dois conflitos próprios permanecem abertos. |
| `PD-003` | `DEC-PKG-005`–`009`,`012`,`014`,`015` | `CON-FND-027`–`046`, conforme assunto | MVP, requisitos, regras, aceite, backlog e NFR continuam sem aprovação. |
| `PD-004` | `DEC-PKG-004`–`006`,`008`,`009`,`011`,`012`,`014`,`015` | `CON-FND-026`,`030`,`038`,`041`,`042`,`047`–`051`,`056` | Modelo, ciclo, isolamento, geoespacial, auditabilidade e versão continuam pendentes. |
| `PD-005` | `DEC-PKG-006`,`007`,`012`,`014`,`015` | `CON-FND-032`–`035`,`044` | Fluxos, estados, acessibilidade e aprovação de UX permanecem pendentes; Figma continua opcional. |
| `PD-006` | `DEC-PKG-007`–`015` | `CON-FND-036`,`040`,`049`–`057` | Arquitetura, contratos, mapas, NFR e hospedagem continuam sem confirmação normativa. |
| `PD-007` | `DEC-PKG-011` | `CON-FND-055`; `CON-Q-050` | Estado de OpenStreetMap continua aberto. |
| `PD-008` | `DEC-PKG-009`,`010` | `CON-FND-052`,`056`; `CON-Q-048`,`049` | Uso de Python e sua fronteira continuam abertos. |
| `PD-009` | `DEC-PKG-011` | `CON-FND-055`; `CON-Q-050` | Estado de Plotly continua aberto. |
| `PD-010` | `DEC-PKG-011` | `CON-FND-055`; `CON-Q-050` | Estado de Leaflet continua aberto; Plotly não implica rejeição. |
| `PD-011` | `DEC-PKG-009`,`010` | `CON-FND-052`,`056`; `CON-Q-048`,`049` | Estratégia de integração continua não especificada. |
| `PD-012` | `DEC-PKG-013` | `CON-FND-057`; `CON-Q-051` | Relato atual e estratégia futura de hospedagem permanecem distintos. |
| `PD-013` | `DEC-PKG-011` | `CON-FND-040`,`049`,`055`; `CON-Q-034`,`044`,`050` | Arquitetura de mapas/geoprocessamento continua não aprovada. |
| `PD-014` | `DEC-PKG-005`,`006`,`008`,`015` | `CON-FND-030`,`038`,`041`,`042` | Modelo de assinantes, laboratórios e áreas continua ausente/incompleto no corpus. |
| `PD-015` | `DEC-PKG-005`,`006`,`015` | `CON-FND-018`,`030`,`031`,`042`; `CON-Q-022`–`026` | Terminologia e papéis continuam não normalizados. |
| `PD-016` | `DEC-PKG-006`,`008`,`012`,`015` | `CON-FND-031`,`032`,`038`,`041`,`042`,`048` | Participação, propriedade, acesso e isolamento continuam pendentes. |
| `PD-017` | `DEC-PKG-007` | `CON-FND-044`; `CON-Q-038`; `GAP-008` | Critérios de estado/proveniência permanecem abertos; a ausência de Figma continua não bloqueante. |

As 17 pendências cobrem todas as decisões materiais identificadas por `DOC-013`; nenhuma nova pendência foi necessária.
