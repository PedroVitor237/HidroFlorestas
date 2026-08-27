# Matriz global de rastreabilidade documental

## Identificação, estado e limites

- **Identificador documental:** `DOC-008`
- **Estado:** `CANONICO_ATUAL`
- **Natureza:** matriz canônica de governança documental
- **Data da atualização controlada:** 2026-08-26
- **Planos de execução:** [`DOC-PLAN-002`](../plans/completed/rastreabilidade-global-inicial.md) e [`DOC-PLAN-007`](../plans/active/consolidacao-auditoria-documental.md)
- **Aprovação:** baseline aprovado na Etapa 3; atualização analítica da Etapa 8 em revisão; responsável individual não especificado
- **Registro de metadados e integridade:** [`DOCUMENT_REGISTER.md`](DOCUMENT_REGISTER.md)
- **Política de autoridade:** [`SOURCE_AUTHORITY.md`](SOURCE_AUTHORITY.md)

Esta matriz representa a rastreabilidade documental dos 13 arquivos históricos de `docs/raw/` no nível de documentos e camadas. O baseline da Etapa 3 foi atualizado com evidências analíticas das auditorias das Etapas 4 a 7, consolidadas em [`DOC-013`](../reports/audits/2026-08-26-auditoria-documental-consolidada.md). Ela não resolve conflitos, não estabelece vigência normativa e não substitui os documentos de origem.

> Controle de rastreabilidade documental no nível de documentos e camadas, sem autoridade para validar conteúdo científico, requisitos, UX, dados ou arquitetura.

Os nós reutilizam exclusivamente os identificadores de `DOCUMENT_REGISTER.md`. Checksums e metadados completos não são repetidos aqui. A inclusão de um documento ou de uma relação não concede aprovação, correção, precedência, suficiência nem autoridade normativa atual.

## Convenções

- `FATO_DOCUMENTADO` identifica somente uma relação explicitamente declarada por fonte e localizador registrados.
- `INFERENCIA` identifica uma conexão derivada de função, título ou estrutura documental; não comprova dependência, aprovação, substituição ou vigência.
- `VERIFICADA_NA_FONTE` valida a presença da declaração, não o mérito de seu conteúdo.
- `VERIFICADA_ANALITICAMENTE` confirma que a relação foi examinada por uma auditoria de camada; quando classificada `INFERENCIA`, continua sem comprovar dependência, aprovação, precedência, substituição ou vigência.
- `PRELIMINAR_PENDENTE_DE_AUDITORIA` é preservado como estado histórico da versão inicial; nenhuma relação permanece nesse estado após as Etapas 4 a 7.
- `OPCIONAL_NAO_BLOQUEANTE` identifica lacuna de entrada suplementar que pode ser tratada futuramente sem impedir a auditoria ou a etapa relacionada.
- A direção `origem → destino` representa apenas a leitura documental registrada na linha.
- A alocação primária organiza o trabalho futuro e não altera autoridade ou estado documental.

## Catálogo de nós documentais

| Identificador | Título | Caminho | Categoria | Camada | Papel documental preliminar | Estado | Auditoria futura responsável | Observações de limite |
|---|---|---|---|---|---|---|---|---|
| `DOC-RAW-002` | ALGORITMO OPERACIONAL — HIDROFLORESTAS (MVP) | `docs/raw/algoritmo-operacional-hidroflorestas-mvp.md` | Especificação operacional de algoritmo | Algoritmo | Descrever operacionalmente entradas, processamento e saídas do algoritmo. | `HISTORICO_IMUTAVEL` | Etapa 5 — Contrato matemático, calibração e algoritmo | Papel derivado da finalidade declarada; cálculo e aderência não avaliados. |
| `DOC-RAW-003` | BACKLOG — HIDROFLORESTAS (MVP) | `docs/raw/backlog-hidroflorestas-mvp.md` | Backlog | Produto | Organizar itens de trabalho em épicos, histórias e critérios. | `HISTORICO_IMUTAVEL` | Etapa 7 — Dados, arquitetura, especificação e backlog | Backlog não equivale a requisito aprovado. |
| `DOC-RAW-004` | DEFINIÇÃO DOS REQUISITOS DA PLATAFORMA HIDROFLORESTAS | `docs/raw/definicao-dos-requisitos-da-plataforma-hidroflorestas.md` | Definição de requisitos | Produto | Registrar declarações históricas de funções, fluxos e escopo de produto. | `HISTORICO_IMUTAVEL` | Etapa 6 — Produto, domínio implícito e UX | Vigência, qualidade e aprovação dos requisitos não avaliadas. |
| `DOC-RAW-005` | PLATAFORMA HIDROFLORESTAS — MVP | `docs/raw/dicionario-de-dados.md` | Dicionário de dados | Dados | Descrever campos, tipos, validações, obrigatoriedades e relações de dados. | `HISTORICO_IMUTAVEL` | Etapa 7 — Dados, arquitetura, especificação e backlog | Modelo pretendido e autoridade de dados não confirmados. |
| `DOC-RAW-006` | ESPECIFICAÇÃO TÉCNICA DO SISTEMA - PLATAFORMA HIDROFLORESTAS – MVP | `docs/raw/especificacao-tecnica-sistema-plataforma-hidroflorestas-mvp.md` | Especificação técnica | Arquitetura | Descrever uma especificação técnica para desenvolvimento do MVP. | `HISTORICO_IMUTAVEL` | Etapa 7 — Dados, arquitetura, especificação e backlog | Especificação histórica não estabelece arquitetura atual. |
| `DOC-RAW-007` | MATRIZ DE VARIÁVEIS DO IHFR | `docs/raw/matriz-de-variaveis-do-ihfr.md` | Matriz científica de variáveis | Ciência | Organizar indicadores ambientais por dimensões do índice. | `HISTORICO_IMUTAVEL` | Etapa 4 — Auditoria científica fundamental | Variáveis e critérios dependem de validação científica. |
| `DOC-RAW-008` | MODELO CIENTÍFICO DO IHFR | `docs/raw/modelo-cientifico-do-ihfr.md` | Modelo científico | Ciência | Apresentar fundamentos e estrutura científica do índice. | `HISTORICO_IMUTAVEL` | Etapa 4 — Auditoria científica fundamental | Mérito e autoridade científica não avaliados. |
| `DOC-RAW-009` | MODELO CONCEITUAL DO IHFR | `docs/raw/modelo-conceitual-do-ihfr.md` | Modelo conceitual científico | Ciência | Representar conceitualmente componentes e processos associados ao índice. | `HISTORICO_IMUTAVEL` | Etapa 4 — Auditoria científica fundamental | Não constitui reconstrução ou validação do modelo de domínio. |
| `DOC-RAW-010` | MODELO REGIONAL DO IHFR | `docs/raw/modelo-regional-do-ihfr-calibracao-ecologica-baixo-itapecuru-maranhao.md` | Modelo científico regional | Ciência | Registrar uma proposta de calibração ecológica regional. | `HISTORICO_IMUTAVEL` | Etapa 5 — Contrato matemático, calibração e algoritmo | Calibração, pesos e aplicabilidade não avaliados. |
| `DOC-RAW-011` | PROTOCOLO DE CAMPO DO IHFR | `docs/raw/protocolo-de-campo-do-ihfr.md` | Protocolo de campo | Campo | Descrever procedimentos de coleta de dados ambientais para o IHFR. | `HISTORICO_IMUTAVEL` | Etapa 4 — Auditoria científica fundamental | Procedimentos e critérios não foram validados. |
| `DOC-RAW-012` | ROADMAP TECNOLÓGICO PLATAFORMA HIDROFLORESTAS | `docs/raw/roadmap-tecnologico-arquitetura-recomendada-hidroflorestas.md` | Roadmap tecnológico e proposta arquitetural | Arquitetura | Descrever evolução tecnológica prevista e arquitetura recomendada. | `HISTORICO_IMUTAVEL` | Etapa 7 — Dados, arquitetura, especificação e backlog | Roadmap e recomendação não equivalem a decisão confirmada. |
| `DOC-RAW-013` | ESPECIFICAÇÃO DO IHFR v0.1 (MVP) — “CONTRATO MATEMÁTICO” | `docs/raw/specificacao-do-ihfr-v0-1-mvp-contrato-matematico.md` | Especificação matemática do IHFR | Ciência e algoritmo | Registrar um contrato matemático histórico de entradas e saídas do IHFR. | `HISTORICO_IMUTAVEL` | Etapa 5 — Contrato matemático, calibração e algoritmo | Fórmulas, variáveis e critérios não foram avaliados. |
| `DOC-RAW-014` | WIREFRAMES FUNCIONAIS DO MVP DA PLATAFORMA HIDROFLORESTAS | `docs/raw/wireframes-funcionais-mvp-plataforma-hidroflorestas.md` | Wireframes funcionais | UX | Descrever estrutura histórica de telas e fluxo do MVP. | `HISTORICO_IMUTAVEL` | Etapa 6 — Produto, domínio implícito e UX | Wireframe não equivale a UX aprovada. |

## Relações documentais

| Identificador | Documento de origem | Documento de destino | Tipo de relação | Direção | Base ou localizador da evidência | Classificação | Estado de validação | Auditoria futura | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `TR-001` | `DOC-RAW-006` | `DOC-RAW-014` | `REFERENCIA_EXPLICITA` | `DOC-RAW-006` → `DOC-RAW-014` | `DOC-RAW-006`, seção “11. FLUXO OPERACIONAL”, frase posterior ao diagrama que remete aos “wireframes do MVP”. | `FATO_DOCUMENTADO` | `VERIFICADA_NA_FONTE` | Etapa 7, com confirmação cruzada na Etapa 6 | Confirma apenas a referência ao artefato documental de wireframes; não confirma aprovação ou aderência entre os conteúdos. |
| `TR-002` | `DOC-RAW-014` | `DOC-RAW-013` | `DEPENDENCIA_EXPLICITA` | `DOC-RAW-014` → `DOC-RAW-013` | `DOC-RAW-014`, seção “CRITÉRIOS DE ACEITAÇÃO” → “Resultado”, observação que determina uso da “ESPECIFICAÇÃO DO IHFR v0.1”. | `FATO_DOCUMENTADO` | `VERIFICADA_NA_FONTE` | Etapa 6, com confirmação do contrato na Etapa 5 | Confirma a dependência declarada pelo wireframe; não valida a especificação nem transforma o wireframe em UX aprovada. |
| `TR-003` | `DOC-RAW-009` | `DOC-RAW-008` | `RELACAO_ESTRUTURAL_VERIFICADA` | `DOC-RAW-009` → `DOC-RAW-008` | `DOC-009`, `SCI-FND-001`,`016`: estrutura em quatro dimensões e relações ecológicas alinhadas. | `INFERENCIA` | `VERIFICADA_ANALITICAMENTE` | Etapa 4; consolidação `DOC-013` | A ordem e a dependência entre os modelos continuam não declaradas. |
| `TR-004` | `DOC-RAW-008` | `DOC-RAW-007` | `RELACAO_ESTRUTURAL_VERIFICADA` | `DOC-RAW-008` → `DOC-RAW-007` | `DOC-009`, matriz de variáveis/cadeias e `SCI-FND-002`; cobertura conceitual parcial. | `INFERENCIA` | `VERIFICADA_ANALITICAMENTE` | Etapa 4; `DOC-013` | Não estabelece derivação, sucessão ou validação científica. |
| `TR-005` | `DOC-RAW-011` | `DOC-RAW-007` | `COBERTURA_PARCIAL_VERIFICADA` | `DOC-RAW-011` → `DOC-RAW-007` | `DOC-009`, cobertura protocolar: 10 explícitas, 1 parcial, 5 não localizadas e 1 ambígua. | `INFERENCIA` | `VERIFICADA_ANALITICAMENTE` | Etapa 4; `DOC-013` | Relação material auditada, mas incompleta e sem dependência declarada. |
| `TR-006` | `DOC-RAW-007` | `DOC-RAW-013` | `RELACAO_ESTRUTURAL_VERIFICADA` | `DOC-RAW-007` → `DOC-RAW-013` | `DOC-010`, `MATH-FND-001`: 16/17 variáveis com correspondência; densidade de drenagem ausente do contrato. | `INFERENCIA` | `VERIFICADA_ANALITICAMENTE` | Etapas 4 e 5; `DOC-013` | `area_size_ha` não foi tratado como substituição de densidade de drenagem. |
| `TR-007` | `DOC-RAW-008` | `DOC-RAW-013` | `SOBREPOSICAO_TEMATICA_VERIFICADA` | `DOC-RAW-008` → `DOC-RAW-013` | `DOC-010`, `MATH-FND-002`: formulações gerais matematicamente equivalentes. | `INFERENCIA` | `VERIFICADA_ANALITICAMENTE` | Etapas 4 e 5; `DOC-013` | Equivalência matemática não prova dependência, precedência ou validação. |
| `TR-008` | `DOC-RAW-010` | `DOC-RAW-013` | `DIVERGENCIA_DE_APLICABILIDADE_VERIFICADA` | `DOC-RAW-010` → `DOC-RAW-013` | `DOC-010`, `MATH-FND-003`,`004`,`013`: pesos diferenciais e relação geral–regional aberta. | `INFERENCIA` | `VERIFICADA_ANALITICAMENTE` | Etapa 5; `DOC-013` | Recorte regional impede classificar automaticamente como conflito ou substituição. |
| `TR-009` | `DOC-RAW-013` | `DOC-RAW-002` | `RELACAO_ESTRUTURAL_VERIFICADA` | `DOC-RAW-013` → `DOC-RAW-002` | `DOC-010`, matrizes de entradas/passos/testes; `MATH-FND-005`,`006` preservam dois conflitos. | `INFERENCIA` | `VERIFICADA_ANALITICAMENTE` | Etapa 5; `DOC-013` | Compartilhamento de versão/fluxo não estabelece precedência documental. |
| `TR-010` | `DOC-RAW-002` | `DOC-RAW-005` | `RELACAO_ESTRUTURAL_VERIFICADA` | `DOC-RAW-002` → `DOC-RAW-005` | `DOC-012`, matriz 7: 17/17 variáveis com campo histórico, 16/17 com entrada algorítmica. | `INFERENCIA` | `VERIFICADA_ANALITICAMENTE` | Etapas 5 e 7; `DOC-013` | Cadeia parcial; `VAR-017` permanece interrompida e conformidade não foi presumida. |
| `TR-011` | `DOC-RAW-004` | `DOC-RAW-003` | `COBERTURA_TEMATICA_PARCIAL_VERIFICADA` | `DOC-RAW-004` → `DOC-RAW-003` | `DOC-012`, matriz 1 e `DAE-FND-004`: núcleo alinhado e lacunas bidirecionais. | `INFERENCIA` | `VERIFICADA_ANALITICAMENTE` | Etapas 6 e 7; `DOC-013` | Backlog continua distinto de requisito aprovado; derivação não foi declarada. |
| `TR-012` | `DOC-RAW-004` | `DOC-RAW-014` | `COBERTURA_TEMATICA_PARCIAL_VERIFICADA` | `DOC-RAW-004` → `DOC-RAW-014` | `DOC-011`, `PROD-FND-001`–`003`: núcleo das cinco telas, dashboard/mapa, coleta e resultado. | `INFERENCIA` | `VERIFICADA_ANALITICAMENTE` | Etapa 6; `DOC-013` | Cobertura parcial não implica completude, derivação ou aprovação de UX. |
| `TR-013` | `DOC-RAW-004` | `DOC-RAW-005` | `COBERTURA_TEMATICA_PARCIAL_VERIFICADA` | `DOC-RAW-004` → `DOC-RAW-005` | `DOC-012`, matrizes 5 e 6; núcleo nominal presente, organizações/laboratórios e regras ausentes. | `INFERENCIA` | `VERIFICADA_ANALITICAMENTE` | Etapas 6 e 7; `DOC-013` | Não define autoridade nem valida o modelo de dados. |
| `TR-014` | `DOC-RAW-005` | `DOC-RAW-006` | `DIVERGENCIA_ESTRUTURAL_VERIFICADA` | `DOC-RAW-005` → `DOC-RAW-006` | `DOC-012`, `DAE-FND-018`: entidades modulares versus tabela ambiental única. | `INFERENCIA` | `VERIFICADA_ANALITICAMENTE` | Etapa 7; `DOC-013` | Divergência de granularidade, sem conflito estrito, dependência ou precedência. |
| `TR-015` | `DOC-RAW-003` | `DOC-RAW-006` | `COBERTURA_TEMATICA_PARCIAL_VERIFICADA` | `DOC-RAW-003` → `DOC-RAW-006` | `DOC-012`, matriz 4 e `E7-015`: épico de API versus declarações `ARCH-012`–`018`. | `INFERENCIA` | `VERIFICADA_ANALITICAMENTE` | Etapa 7; `DOC-013` | Cobertura parcial e rotas divergentes não provam implementação. |
| `TR-016` | `DOC-RAW-012` | `DOC-RAW-006` | `SOBREPOSICAO_TEMATICA_VERIFICADA` | `DOC-RAW-012` → `DOC-RAW-006` | `DOC-012`, matriz 10: alinhamentos, alternativas e diferenças de fase entre `ARCH-NNN` e `ROAD-NNN`. | `INFERENCIA` | `VERIFICADA_ANALITICAMENTE` | Etapa 7; `DOC-013` | Roadmap/recomendação não estabelece arquitetura atual, sucessão ou compatibilidade. |
| `TR-017` | `DOC-RAW-007` | `DOC-RAW-009` | `SOBREPOSICAO_TEMATICA_VERIFICADA` | `DOC-RAW-007` → `DOC-RAW-009` | `DOC-009`, `SCI-FND-001`,`002`,`016`: dimensões, variáveis e relações ecológicas. | `INFERENCIA` | `VERIFICADA_ANALITICAMENTE` | Etapa 4; `DOC-013` | Relação temática adicionada; não prova derivação ou precedência. |
| `TR-018` | `DOC-RAW-008` | `DOC-RAW-011` | `SOBREPOSICAO_TEMATICA_VERIFICADA` | `DOC-RAW-008` → `DOC-RAW-011` | `DOC-009`, matrizes de cobertura e `SCI-FND-004`,`007`–`009`. | `INFERENCIA` | `VERIFICADA_ANALITICAMENTE` | Etapa 4; `DOC-013` | Modelo e protocolo se sobrepõem, com cobertura incompleta. |
| `TR-019` | `DOC-RAW-010` | `DOC-RAW-011` | `SOBREPOSICAO_TEMATICA_VERIFICADA` | `DOC-RAW-010` → `DOC-RAW-011` | `DOC-009`,`010`: fórmula regional e parâmetros convergentes de infiltração, cobertura e APP. | `INFERENCIA` | `VERIFICADA_ANALITICAMENTE` | Etapas 4 e 5; `DOC-013` | Mesma temática regional; dependência e validação não declaradas. |
| `TR-020` | `DOC-RAW-004` | `DOC-RAW-013` | `DEPENDENCIA_CIENTIFICA_ANALITICA` | `DOC-RAW-004` → `DOC-RAW-013` | `DOC-011`, `PROD-FND-020`: cálculo, classes, indicadores, alertas e recomendações dependem de ciência validada. | `INFERENCIA` | `VERIFICADA_ANALITICAMENTE` | Etapa 6; `DOC-013` | Dependência analítica para normatização, não referência explícita nem aprovação do contrato. |
| `TR-021` | `DOC-RAW-003` | `DOC-RAW-012` | `SOBREPOSICAO_TEMATICA_VERIFICADA` | `DOC-RAW-003` → `DOC-RAW-012` | `DOC-012`, matrizes 10 e 11; backlog, fases e capacidades futuras. | `INFERENCIA` | `VERIFICADA_ANALITICAMENTE` | Etapa 7; `DOC-013` | Fase e natureza são eixos distintos; roadmap não aprova backlog. |
| `TR-022` | `DOC-RAW-004` | `DOC-RAW-009` | `SOBREPOSICAO_TEMATICA_VERIFICADA` | `DOC-RAW-004` → `DOC-RAW-009` | `DOC-009`,`011`: diagnóstico, indicadores e relações ecológicas aparecem em ciência e produto. | `INFERENCIA` | `VERIFICADA_ANALITICAMENTE` | Etapas 4 e 6; `DOC-013` | Sobreposição de conceitos não autoriza requisito científico. |

### Síntese quantitativa das relações

| Dimensão | Valor |
|---|---:|
| Relações totais | 22 |
| `REFERENCIA_EXPLICITA` | 1 |
| `DEPENDENCIA_EXPLICITA` | 1 |
| `ENTRADA_SAIDA_EXPLICITA` | 0 |
| `RELACAO_ESTRUTURAL_VERIFICADA` | 5 |
| `COBERTURA_PARCIAL_VERIFICADA` | 1 |
| `COBERTURA_TEMATICA_PARCIAL_VERIFICADA` | 4 |
| `SOBREPOSICAO_TEMATICA_VERIFICADA` | 7 |
| `DIVERGENCIA_DE_APLICABILIDADE_VERIFICADA` | 1 |
| `DIVERGENCIA_ESTRUTURAL_VERIFICADA` | 1 |
| `DEPENDENCIA_CIENTIFICA_ANALITICA` | 1 |
| `FATO_DOCUMENTADO` / `VERIFICADA_NA_FONTE` | 2 |
| `INFERENCIA` / `VERIFICADA_ANALITICAMENTE` | 20 |
| `PRELIMINAR_PENDENTE_DE_AUDITORIA` | 0 |
| `NAO_ESTABELECIDA` | 0 |

## Cobertura documental por camada

| Camada | Documentos relacionados | Cobertura documental observada | Pendências de autoridade relacionadas | Auditoria futura | Observações |
|---|---|---|---|---|---|
| Escopo institucional | Não estabelecido entre os 13 nós históricos. | Nenhum dos 13 nós foi classificado no baseline como documento institucional aprovado. | `PD-001` | Etapa 8 — consolidação transversal, ou antes de qualquer atualização normativa que dependa do escopo institucional | A ausência de classificação no baseline não comprova que nenhum nó contenha material institucional e não autoriza nova auditoria nesta correção. |
| Ciência fundamental e campo | `DOC-RAW-007`, `DOC-RAW-008`, `DOC-RAW-009`, `DOC-RAW-011` | Matriz de variáveis, modelos científico e conceitual e protocolo de coleta estão representados como documentos históricos. | `PD-002` | Etapa 4 | Descrição de presença documental; não avalia o conteúdo científico. |
| Contrato matemático, calibração e algoritmo | `DOC-RAW-002`, `DOC-RAW-010`, `DOC-RAW-013` | Algoritmo operacional, modelo regional e contrato matemático estão representados. | `PD-002`; `PD-008` quando a auditoria alcançar eventual alternativa tecnológica, sem antecipá-la | Etapa 5 | A associação organiza a auditoria; não confirma fórmulas, calibração ou tecnologia. |
| Produto e domínio implícito | `DOC-RAW-003`, `DOC-RAW-004` | Backlog e definição de requisitos registram perspectivas históricas de produto. | `PD-003`, `PD-014`, `PD-015`, `PD-016` | Etapas 6 e 7, conforme alocação primária | Não transforma backlog ou requisitos históricos em intenção aprovada. |
| Dados | `DOC-RAW-005` | Um dicionário de dados histórico está representado. | `PD-004`, `PD-014`, `PD-015`, `PD-016` | Etapa 7 | Não confirma o modelo pretendido nem o compara à implementação. |
| UX | `DOC-RAW-014` | Um documento histórico de wireframes funcionais está representado; artefatos do Figma não estão presentes. | `PD-005`, `PD-016`, `PD-017` | Etapa 6 | Não avalia telas, fluxos ou estado de aprovação. |
| Arquitetura e especificação | `DOC-RAW-006`, `DOC-RAW-012` | Especificação técnica e roadmap com arquitetura recomendada estão representados. | `PD-006` a `PD-013` | Etapa 7 | Propostas e alternativas permanecem distintas de decisões confirmadas e de implementação. |

## Alocação primária nas auditorias futuras

| Auditoria futura | Documentos atribuídos | Quantidade |
|---|---|---:|
| Etapa 4 — Auditoria científica fundamental | `DOC-RAW-007`, `DOC-RAW-008`, `DOC-RAW-009`, `DOC-RAW-011` | 4 |
| Etapa 5 — Contrato matemático, calibração e algoritmo | `DOC-RAW-002`, `DOC-RAW-010`, `DOC-RAW-013` | 3 |
| Etapa 6 — Produto, domínio implícito e UX | `DOC-RAW-004`, `DOC-RAW-014` | 2 |
| Etapa 7 — Dados, arquitetura, especificação e backlog | `DOC-RAW-003`, `DOC-RAW-005`, `DOC-RAW-006`, `DOC-RAW-012` | 4 |
| **Total** | **13 documentos, cada um com uma única alocação primária** | **13** |

A alocação cobre `DOC-RAW-002` a `DOC-RAW-014` exatamente uma vez, sem omissão nem duplicidade primária. Relações secundárias entre camadas não mudam essa alocação. Nenhuma incompatibilidade material entre o papel documental observado e a alocação aprovada foi identificada na leitura estrutural restrita; isso não antecipa a auditoria do conteúdo.

## Lacunas preliminares de rastreabilidade

| Identificador | Tipo | Descrição neutra | Documentos ou camadas | Evidência ou ausência observada | Classificação | Impacto sobre a rastreabilidade | Pendência existente relacionada | Auditoria futura | Estado |
|---|---|---|---|---|---|---|---|---|---|
| `GAP-001` | `METADADO_AUSENTE` | Origem, data e responsável não estão especificados para os 13 documentos; versão documental está especificada somente para dois, conforme o baseline. | `DOC-RAW-002` a `DOC-RAW-014` | Metadados registrados em `DOCUMENT_REGISTER.md` e confirmados nas auditorias `DOC-009`–`013`. | `NAO_ESPECIFICADO` | Limita a proveniência e a interpretação do ciclo de vida documental. | não especificado | Consolidação `DOC-013`; futura governança de proveniência | `VERIFICADA_NAS_AUDITORIAS` |
| `GAP-002` | `AUTORIDADE_PENDENTE` | A autoridade para validar conteúdo científico e cálculo do IHFR ainda depende de designação da equipe. | Ciência, campo, matemática e algoritmo | `SOURCE_AUTHORITY.md` e `PENDING_DECISIONS.md`. | `PENDENCIA_DE_DECISAO` | Impede converter evidência histórica científica em conteúdo normativo validado. | `PD-002` | Etapas 4 e 5 | `VINCULADA_A_PENDENCIA` |
| `GAP-003` | `AUTORIDADE_PENDENTE` | A autoridade para aprovar objetivos, requisitos, regras de negócio e definições relacionadas ainda depende de designação da equipe. | Produto e domínio implícito; `DOC-RAW-003`, `DOC-RAW-004` | `SOURCE_AUTHORITY.md` e `PENDING_DECISIONS.md`. | `PENDENCIA_DE_DECISAO` | Mantém backlog e requisitos históricos sem autoridade normativa atual presumida. | `PD-003`, `PD-014`, `PD-015`, `PD-016` | Etapas 6 e 7 | `VINCULADA_A_PENDENCIA` |
| `GAP-004` | `AUTORIDADE_PENDENTE` | A autoridade sobre conceitos e modelo de dados pretendido ainda depende de designação da equipe. | Dados; `DOC-RAW-005` | `SOURCE_AUTHORITY.md` e `PENDING_DECISIONS.md`. | `PENDENCIA_DE_DECISAO` | Impede confirmar como normativa a representação histórica de dados. | `PD-004`, `PD-014`, `PD-015`, `PD-016` | Etapa 7 | `VINCULADA_A_PENDENCIA` |
| `GAP-005` | `AUTORIDADE_PENDENTE` | A autoridade para aprovar UX, fluxos e estados dos artefatos ainda depende de designação da equipe. | UX; `DOC-RAW-014`; futura entrada do Figma | `SOURCE_AUTHORITY.md` e `PENDING_DECISIONS.md`. | `PENDENCIA_DE_DECISAO` | Mantém wireframes e futuros artefatos sem aprovação presumida. | `PD-005`, `PD-016`, `PD-017` | Etapa 6 | `VINCULADA_A_PENDENCIA` |
| `GAP-006` | `AUTORIDADE_PENDENTE` | A autoridade para confirmar arquitetura e aceitar ADRs ainda depende de designação da equipe. | Arquitetura; `DOC-RAW-006`, `DOC-RAW-012` | `SOURCE_AUTHORITY.md`, `PENDING_DECISIONS.md` e alternativas registradas em `TECH_DECISIONS.md`. | `PENDENCIA_DE_DECISAO` | Mantém especificação, roadmap e alternativas separados de arquitetura normativa atual. | `PD-006` a `PD-013` | Etapa 7 | `VINCULADA_A_PENDENCIA` |
| `GAP-007` | `RELACAO_NAO_DECLARADA` | Duas ligações permanecem explicitamente nomeadas pelas fontes; as demais conexões da matriz são analíticas/inferenciais, ainda sem declaração documental de dependência, precedência ou substituição. | `DOC-RAW-002` a `DOC-RAW-014` | `DOC-009`–`013`; 20 relações inferenciais verificadas analiticamente. | `NAO_ESPECIFICADO` | As conexões organizam rastreabilidade, mas não sustentam autoridade, dependência normativa, precedência ou substituição. | não especificado | Destinos normativos futuros, se relações forem aprovadas | `VERIFICADA_NAS_AUDITORIAS` |
| `GAP-008` | `ENTRADA_EXTERNA_PENDENTE` | Artefatos do Figma constituem entrada suplementar, opcional e não bloqueante; sua ausência não impede as auditorias documentais nem a Etapa 6. | UX e produto; nenhum nó documental criado | Orientação atual da equipe registrada na solicitação aprovada da Etapa 4. | `DECISAO_CONFIRMADA` | A rastreabilidade de arquivos, páginas, frames, telas e fluxos do Figma poderá ser acrescentada, se esses artefatos forem apresentados, sem condicionar as auditorias. | `PD-005`, `PD-017` | Opcional na Etapa 6 ou posterior | `OPCIONAL_NAO_BLOQUEANTE` |
| `GAP-009` | `DESTINO_NORMATIVO_NAO_DEFINIDO` | Os destinos normativos que receberão o conteúdo consolidado após as auditorias das camadas não estão especificados para todos os assuntos. | Ciência, produto, dados, UX e arquitetura | `PROJECT_CONTEXT.md`, `SOURCE_AUTHORITY.md` e destinos condicionais descritos em `PENDING_DECISIONS.md`. | `NAO_ESPECIFICADO` | Resultados futuros deverão aguardar autoridade e destino identificados antes de qualquer consolidação normativa. | `PD-002` a `PD-006` | Etapas 4 a 7 | `VINCULADA_A_PENDENCIA` |
| `GAP-010` | `AUTORIDADE_PENDENTE` | A autoridade para confirmar a interpretação, a vigência e as mudanças no escopo institucional ainda depende de designação da equipe. | Escopo institucional; identidade e aplicabilidade da fonte institucional entre os nós históricos ainda não estabelecidas | `SOURCE_AUTHORITY.md`, `PENDING_DECISIONS.md` e ausência de um nó classificado no baseline como documento institucional aprovado. | `PENDENCIA_DE_DECISAO` | Limita o uso do escopo institucional como critério normativo na consolidação transversal, sem impedir o levantamento exploratório das camadas. | `PD-001` | Etapa 8 — consolidação transversal; confirmação necessária antes de atualizações normativas dependentes do escopo | `VINCULADA_A_PENDENCIA` |
| `GAP-011` | `CADEIA_TRANSVERSAL_INCOMPLETA` | A cadeia ciência → protocolo → entrada → algoritmo não fecha para cobertura, missing, qualidade e densidade de drenagem. | Ciência, campo, algoritmo e dados | `DOC-013`, `CON-FND-002`,`004`,`005`,`008`–`013`; auditorias `DOC-009`,`010`,`012`. | `INFERENCIA` | Impede normatizar uma entrada científica reproduzível de ponta a ponta. | `PD-002`,`004` | `DEC-PKG-003`,`004`,`008` | `VINCULADA_A_PENDENCIA` |
| `GAP-012` | `MODELO_TRANSVERSAL_INCOMPLETO` | Terminologia, papéis, laboratórios, propriedade/tenant, cardinalidades e ciclos não formam modelo coerente aprovado. | Produto, domínio, UX e dados | `DOC-013`, `CON-FND-030`–`032`,`038`,`041`,`042`,`048`. | `INFERENCIA` | Interrompe requisitos, autorização, isolamento e modelo lógico. | `PD-003`–`005`,`014`–`016` | `DEC-PKG-005`,`006`,`008` | `VINCULADA_A_PENDENCIA` |
| `GAP-013` | `COBERTURA_NORMATIVA_INCOMPLETA` | Escopo do MVP, critérios de aceitação, estados de UX e NFR permanecem incompletos e sem aprovação. | Produto, UX, backlog e arquitetura | `DOC-013`, `CON-FND-029`,`034`–`037`,`045`,`046`. | `INFERENCIA` | Requisitos e critérios verificáveis não podem ser promovidos. | `PD-003`,`005`,`006` | `DEC-PKG-007`,`012` | `VINCULADA_A_PENDENCIA` |
| `GAP-014` | `CADEIA_TRANSVERSAL_INCOMPLETA` | Modelo de dados, saída IHFR, API, integração e responsabilidades arquiteturais não fecham um contrato transversal. | Algoritmo, dados e arquitetura | `DOC-013`, `CON-FND-024`,`026`,`041`,`048`–`052`,`056`. | `INFERENCIA` | Impede rastrear entrada, processamento, persistência e interface de forma normativa. | `PD-002`–`004`,`006`,`008`,`011` | `DEC-PKG-008`–`010` | `VINCULADA_A_PENDENCIA` |
| `GAP-015` | `GOVERNANCA_DE_PLANEJAMENTO_INCOMPLETA` | Backlog e roadmap não possuem prioridade, estado, evidência, datas, responsáveis, riscos e gates suficientes. | Produto, backlog e arquitetura | `DOC-013`, `CON-FND-045`,`046`; `DOC-012`. | `INFERENCIA` | Limita cobertura auditável entre requisito, item, fase e entrega. | `PD-003`,`006` | `DEC-PKG-007`,`015` | `VINCULADA_A_PENDENCIA` |
| `GAP-016` | `INSPECAO_DE_IMPLEMENTACAO_PENDENTE` | Alegações e decisões documentais ainda não foram comparadas com código, configuração, dados, testes ou infraestrutura. | Implementação futura e todas as camadas técnicas | `DOC-012`, `DAE-FND-029`,`030`; `DOC-013`, `CODE-CHECK-001`–`018`. | `NAO_ESPECIFICADO` | O estado implementado permanece `NAO_AVALIADO`; ausência de inspeção não prova implementação nem ausência. | Pendências variam por item; nenhuma nova criada | Futura inspeção autorizada; `CODE-CHECK-001`–`018` | `AGUARDANDO_INSPECAO_FUTURA` |

### Síntese quantitativa das lacunas

| Dimensão | Valor |
|---|---:|
| Lacunas totais | 16 |
| `METADADO_AUSENTE` | 1 |
| `AUTORIDADE_PENDENTE` | 6 |
| `RELACAO_NAO_DECLARADA` | 1 |
| `ENTRADA_EXTERNA_PENDENTE` | 1 |
| `DESTINO_NORMATIVO_NAO_DEFINIDO` | 1 |
| `CADEIA_TRANSVERSAL_INCOMPLETA` | 2 |
| `MODELO_TRANSVERSAL_INCOMPLETO` | 1 |
| `COBERTURA_NORMATIVA_INCOMPLETA` | 1 |
| `GOVERNANCA_DE_PLANEJAMENTO_INCOMPLETA` | 1 |
| `INSPECAO_DE_IMPLEMENTACAO_PENDENTE` | 1 |
| `VERIFICADA_NAS_AUDITORIAS` | 2 |
| `VINCULADA_A_PENDENCIA` | 12 |
| `OPCIONAL_NAO_BLOQUEANTE` | 1 |
| `AGUARDANDO_INSPECAO_FUTURA` | 1 |

Nenhuma nova pendência foi incorporada ao registro vivo na consolidação. `DOC-013` confirmou que `PD-001` a `PD-017` cobrem as decisões materiais; as novas lacunas descrevem rupturas de rastreabilidade e não duplicam decisões.

## Orientação atual sobre os artefatos do Figma

`DECISAO_CONFIRMADA` — A solicitação aprovada da Etapa 4 registra que os artefatos do Figma são uma entrada opcional, secundária e não bloqueante. Não são pré-requisito para a Etapa 6, sua ausência não bloqueia auditorias documentais e a ausência de implementação não constitui divergência. Telas não implementadas não geram obrigação de implementação.

Os artefatos podem divergir dos documentos históricos, representar exploração ou alternativas ainda não implementadas e ser alterados posteriormente sem, por si só, exigir realinhamento normativo. Também podem ser alterados sem dificuldade relevante conforme a orientação atual da equipe. Eles não prevalecem sobre o escopo institucional, decisões aprovadas, requisitos normativos ou regras de negócio.

Por padrão, um artefato do Figma deve ser tratado como `EXPLORACAO` ou `EM_REVISAO`. Somente aprovação explícita por autoridade identificada permite o estado `APROVADO`. `PD-017` permanece aberto e inalterado porque os critérios formais e a autoridade de UX ainda não foram definidos; a orientação atual não resolve essa pendência.

Quando forem efetivamente apresentados, arquivos, páginas, frames, telas e fluxos deverão receber identificadores estáveis e proveniência, incluindo origem, localizador, data quando disponível, responsável quando identificado e relação com os nós documentais existentes. Esta matriz não cria documento fictício nem identificador para arquivo inexistente e não audita o Figma nesta etapa.

## Método e ponto de parada

A matriz foi construída na Etapa 3 a partir do registro canônico e de leitura estrutural controlada. Na Etapa 8, foi atualizada exclusivamente com as evidências analíticas registradas em `DOC-009` a `DOC-013`, sem nova leitura ampla de `docs/raw/` e sem inspeção de implementação. O mérito de regras, fórmulas, requisitos, wireframes e escolhas técnicas não foi validado.

Este documento foi promovido a `CANONICO_ATUAL` após aprovação humana da Etapa 3, exclusivamente para controle documental, e permanece canônico durante a atualização analítica em revisão da Etapa 8. As relações inferenciais continuam identificadas como inferências, as lacunas preservam seus limites e a alocação não concede autoridade normativa. A atualização não valida conteúdo científico, funcional, de UX, de dados ou técnico e não substitui as auditorias de cada camada.
