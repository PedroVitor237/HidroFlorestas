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
| `PD-017` | Estado das telas do Figma | Definir critérios para classificar telas como aprovadas, em revisão ou exploração. | `PENDENCIA_DE_DECISAO` | `INFERENCIA` — Sem critérios, artefatos exploratórios podem ser confundidos com requisitos. | `ABERTA` |

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
| `PD-017` | Mandato de governança; autoridade de UX ainda não designada | Estados a disciplinar: aprovado, em revisão e exploração; critérios não especificados. | não especificado | não especificado | não especificado | Atualizar o registro normativo de UX aplicável e manter o histórico. |

Plotly ter sido considerado não implica rejeição de Leaflet. Nenhuma entrada deste registro deve ser encerrada por inferência ou pela mera existência de uma implementação.
