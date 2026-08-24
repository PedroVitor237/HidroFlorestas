# Matriz global inicial de rastreabilidade documental

## Identificação, estado e limites

- **Identificador documental:** `DOC-008`
- **Estado:** `EM_REVISAO`
- **Natureza:** matriz canônica candidata de governança documental
- **Data da leitura controlada:** 2026-08-24
- **Plano de execução:** [`DOC-PLAN-002`](../plans/active/rastreabilidade-global-inicial.md)
- **Registro de metadados e integridade:** [`DOCUMENT_REGISTER.md`](DOCUMENT_REGISTER.md)
- **Política de autoridade:** [`SOURCE_AUTHORITY.md`](SOURCE_AUTHORITY.md)

Esta matriz representa a rastreabilidade documental inicial dos 13 arquivos históricos de `docs/raw/` no nível de documentos e camadas. Ela não constitui auditoria de conteúdo, não resolve possíveis conflitos, não estabelece vigência normativa e não substitui os documentos de origem. Relações preliminares deverão ser confirmadas nas auditorias futuras das camadas.

> Controle de rastreabilidade documental no nível de documentos e camadas, sem autoridade para validar conteúdo científico, requisitos, UX, dados ou arquitetura.

Os nós reutilizam exclusivamente os identificadores de `DOCUMENT_REGISTER.md`. Checksums e metadados completos não são repetidos aqui. A inclusão de um documento ou de uma relação não concede aprovação, correção, precedência, suficiência nem autoridade normativa atual.

## Convenções

- `FATO_DOCUMENTADO` identifica somente uma relação explicitamente declarada por fonte e localizador registrados.
- `INFERENCIA` identifica uma conexão derivada de função, título ou estrutura documental; não comprova dependência, aprovação, substituição ou vigência.
- `VERIFICADA_NA_FONTE` valida a presença da declaração, não o mérito de seu conteúdo.
- `PRELIMINAR_PENDENTE_DE_AUDITORIA` mantém a relação aberta à confirmação nas futuras Etapas 4 a 7.
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
| `TR-003` | `DOC-RAW-009` | `DOC-RAW-008` | `RELACAO_ESTRUTURAL_PRELIMINAR` | `DOC-RAW-009` → `DOC-RAW-008` | Títulos e papéis declarados de modelo conceitual e modelo científico; cabeçalhos sobre princípio conceitual, fundamentos e estrutura do índice. | `INFERENCIA` | `PRELIMINAR_PENDENTE_DE_AUDITORIA` | Etapa 4 | A ordem e a dependência entre os modelos não estão declaradas. |
| `TR-004` | `DOC-RAW-008` | `DOC-RAW-007` | `RELACAO_ESTRUTURAL_PRELIMINAR` | `DOC-RAW-008` → `DOC-RAW-007` | Finalidades declaradas de apresentar a estrutura científica e organizar indicadores nas dimensões do índice. | `INFERENCIA` | `PRELIMINAR_PENDENTE_DE_AUDITORIA` | Etapa 4 | Não estabelece que a matriz deriva, implementa ou sucede o modelo. |
| `TR-005` | `DOC-RAW-011` | `DOC-RAW-007` | `RELACAO_ESTRUTURAL_PRELIMINAR` | `DOC-RAW-011` → `DOC-RAW-007` | Objetivo declarado do protocolo de coletar dados para o IHFR e papel declarado da matriz de organizar indicadores. | `INFERENCIA` | `PRELIMINAR_PENDENTE_DE_AUDITORIA` | Etapa 4 | O mapeamento entre coleta e variáveis não foi auditado nem declarado como relação documental. |
| `TR-006` | `DOC-RAW-007` | `DOC-RAW-013` | `RELACAO_ESTRUTURAL_PRELIMINAR` | `DOC-RAW-007` → `DOC-RAW-013` | Papéis declarados de matriz de variáveis e contrato matemático, ambos estruturados por dimensões do IHFR. | `INFERENCIA` | `PRELIMINAR_PENDENTE_DE_AUDITORIA` | Etapas 4 e 5 | Não comprova correspondência entre variáveis, pesos ou critérios. |
| `TR-007` | `DOC-RAW-008` | `DOC-RAW-013` | `SOBREPOSICAO_TEMATICA_PRELIMINAR` | `DOC-RAW-008` → `DOC-RAW-013` | Cabeçalhos de formulação matemática no modelo científico e de estrutura do índice no contrato matemático. | `INFERENCIA` | `PRELIMINAR_PENDENTE_DE_AUDITORIA` | Etapas 4 e 5 | Sobreposição temática não implica equivalência, conflito ou precedência. |
| `TR-008` | `DOC-RAW-010` | `DOC-RAW-013` | `SOBREPOSICAO_TEMATICA_PRELIMINAR` | `DOC-RAW-010` → `DOC-RAW-013` | Título e cabeçalhos de calibração/pesos regionais e de estrutura/pesos do contrato matemático. | `INFERENCIA` | `PRELIMINAR_PENDENTE_DE_AUDITORIA` | Etapa 5 | Nenhuma conclusão é feita sobre compatibilidade ou aplicação regional. |
| `TR-009` | `DOC-RAW-013` | `DOC-RAW-002` | `RELACAO_ESTRUTURAL_PRELIMINAR` | `DOC-RAW-013` → `DOC-RAW-002` | Papéis declarados de contrato matemático e algoritmo operacional, com seções de entradas e saídas. | `INFERENCIA` | `PRELIMINAR_PENDENTE_DE_AUDITORIA` | Etapa 5 | A sequência é organizacional; dependência documental não foi explicitamente declarada. |
| `TR-010` | `DOC-RAW-002` | `DOC-RAW-005` | `RELACAO_ESTRUTURAL_PRELIMINAR` | `DOC-RAW-002` → `DOC-RAW-005` | Seções de entradas, saídas e persistência do algoritmo e finalidade declarada do dicionário de servir ao processamento do IHFR. | `INFERENCIA` | `PRELIMINAR_PENDENTE_DE_AUDITORIA` | Etapas 5 e 7 | Não comprova correspondência de campos nem conformidade do modelo de dados. |
| `TR-011` | `DOC-RAW-004` | `DOC-RAW-003` | `RELACAO_ESTRUTURAL_PRELIMINAR` | `DOC-RAW-004` → `DOC-RAW-003` | Papéis documentais de definição de requisitos e organização do backlog em épicos, histórias e critérios. | `INFERENCIA` | `PRELIMINAR_PENDENTE_DE_AUDITORIA` | Etapas 6 e 7 | Backlog não é requisito aprovado e derivação não foi declarada. |
| `TR-012` | `DOC-RAW-004` | `DOC-RAW-014` | `RELACAO_ESTRUTURAL_PRELIMINAR` | `DOC-RAW-004` → `DOC-RAW-014` | Cabeçalhos de requisitos por tela e papel declarado dos wireframes de estruturar telas e fluxo. | `INFERENCIA` | `PRELIMINAR_PENDENTE_DE_AUDITORIA` | Etapa 6 | Não estabelece correspondência, completude ou aprovação de UX. |
| `TR-013` | `DOC-RAW-004` | `DOC-RAW-005` | `SOBREPOSICAO_TEMATICA_PRELIMINAR` | `DOC-RAW-004` → `DOC-RAW-005` | Cabeçalho de modelo de dados no documento de requisitos e finalidade declarada do dicionário de dados. | `INFERENCIA` | `PRELIMINAR_PENDENTE_DE_AUDITORIA` | Etapas 6 e 7 | Sobreposição temática não define autoridade de produto ou dados. |
| `TR-014` | `DOC-RAW-005` | `DOC-RAW-006` | `RELACAO_ESTRUTURAL_PRELIMINAR` | `DOC-RAW-005` → `DOC-RAW-006` | Finalidade declarada do dicionário para modelagem e API e cabeçalhos de banco de dados e API na especificação técnica. | `INFERENCIA` | `PRELIMINAR_PENDENTE_DE_AUDITORIA` | Etapa 7 | Dependência ou conformidade entre os documentos não foi declarada. |
| `TR-015` | `DOC-RAW-003` | `DOC-RAW-006` | `RELACAO_ESTRUTURAL_PRELIMINAR` | `DOC-RAW-003` → `DOC-RAW-006` | Papéis declarados de backlog do MVP e especificação técnica para desenvolvimento. | `INFERENCIA` | `PRELIMINAR_PENDENTE_DE_AUDITORIA` | Etapa 7 | Não afirma que a especificação implementa, deriva ou atende ao backlog. |
| `TR-016` | `DOC-RAW-012` | `DOC-RAW-006` | `SOBREPOSICAO_TEMATICA_PRELIMINAR` | `DOC-RAW-012` → `DOC-RAW-006` | Finalidades declaradas de arquitetura recomendada/evolução tecnológica e especificação técnica do sistema. | `INFERENCIA` | `PRELIMINAR_PENDENTE_DE_AUDITORIA` | Etapa 7 | Não estabelece arquitetura atual, sucessão ou compatibilidade. |

### Síntese quantitativa das relações

| Dimensão | Valor |
|---|---:|
| Relações totais | 16 |
| `REFERENCIA_EXPLICITA` | 1 |
| `DEPENDENCIA_EXPLICITA` | 1 |
| `ENTRADA_SAIDA_EXPLICITA` | 0 |
| `RELACAO_ESTRUTURAL_PRELIMINAR` | 10 |
| `SOBREPOSICAO_TEMATICA_PRELIMINAR` | 4 |
| `FATO_DOCUMENTADO` / `VERIFICADA_NA_FONTE` | 2 |
| `INFERENCIA` / `PRELIMINAR_PENDENTE_DE_AUDITORIA` | 14 |
| `NAO_ESTABELECIDA` | 0 |

## Cobertura documental por camada

| Camada | Documentos relacionados | Cobertura documental observada | Pendências de autoridade relacionadas | Auditoria futura | Observações |
|---|---|---|---|---|---|
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
| `GAP-001` | `METADADO_AUSENTE` | Origem, data e responsável não estão especificados para os 13 documentos; versão documental está especificada somente para dois, conforme o baseline. | `DOC-RAW-002` a `DOC-RAW-014` | Metadados registrados em `DOCUMENT_REGISTER.md`, sem nova auditoria substantiva. | `NAO_ESPECIFICADO` | Limita a proveniência e a interpretação do ciclo de vida documental. | não especificado | Etapas 4 a 7 | `AGUARDANDO_AUDITORIA` |
| `GAP-002` | `AUTORIDADE_PENDENTE` | A autoridade para validar conteúdo científico e cálculo do IHFR ainda depende de designação da equipe. | Ciência, campo, matemática e algoritmo | `SOURCE_AUTHORITY.md` e `PENDING_DECISIONS.md`. | `PENDENCIA_DE_DECISAO` | Impede converter evidência histórica científica em conteúdo normativo validado. | `PD-002` | Etapas 4 e 5 | `VINCULADA_A_PENDENCIA` |
| `GAP-003` | `AUTORIDADE_PENDENTE` | A autoridade para aprovar objetivos, requisitos, regras de negócio e definições relacionadas ainda depende de designação da equipe. | Produto e domínio implícito; `DOC-RAW-003`, `DOC-RAW-004` | `SOURCE_AUTHORITY.md` e `PENDING_DECISIONS.md`. | `PENDENCIA_DE_DECISAO` | Mantém backlog e requisitos históricos sem autoridade normativa atual presumida. | `PD-003`, `PD-014`, `PD-015`, `PD-016` | Etapas 6 e 7 | `VINCULADA_A_PENDENCIA` |
| `GAP-004` | `AUTORIDADE_PENDENTE` | A autoridade sobre conceitos e modelo de dados pretendido ainda depende de designação da equipe. | Dados; `DOC-RAW-005` | `SOURCE_AUTHORITY.md` e `PENDING_DECISIONS.md`. | `PENDENCIA_DE_DECISAO` | Impede confirmar como normativa a representação histórica de dados. | `PD-004`, `PD-014`, `PD-015`, `PD-016` | Etapa 7 | `VINCULADA_A_PENDENCIA` |
| `GAP-005` | `AUTORIDADE_PENDENTE` | A autoridade para aprovar UX, fluxos e estados dos artefatos ainda depende de designação da equipe. | UX; `DOC-RAW-014`; futura entrada do Figma | `SOURCE_AUTHORITY.md` e `PENDING_DECISIONS.md`. | `PENDENCIA_DE_DECISAO` | Mantém wireframes e futuros artefatos sem aprovação presumida. | `PD-005`, `PD-016`, `PD-017` | Etapa 6 | `VINCULADA_A_PENDENCIA` |
| `GAP-006` | `AUTORIDADE_PENDENTE` | A autoridade para confirmar arquitetura e aceitar ADRs ainda depende de designação da equipe. | Arquitetura; `DOC-RAW-006`, `DOC-RAW-012` | `SOURCE_AUTHORITY.md`, `PENDING_DECISIONS.md` e alternativas registradas em `TECH_DECISIONS.md`. | `PENDENCIA_DE_DECISAO` | Mantém especificação, roadmap e alternativas separados de arquitetura normativa atual. | `PD-006` a `PD-013` | Etapa 7 | `VINCULADA_A_PENDENCIA` |
| `GAP-007` | `RELACAO_NAO_DECLARADA` | A busca controlada identificou duas ligações nomeadas entre documentos; as demais conexões registradas nesta matriz não foram declaradas como relações documentais pelas fontes. | `DOC-RAW-002` a `DOC-RAW-014` | Cabeçalhos, referências e busca direcionada pelos títulos e tipos dos 13 documentos. | `NAO_ESPECIFICADO` | As 14 conexões estruturais ou temáticas permanecem inferenciais e não podem sustentar dependência, precedência ou substituição. | não especificado | Etapas 4 a 7 | `AGUARDANDO_AUDITORIA` |
| `GAP-008` | `ENTRADA_EXTERNA_PENDENTE` | Artefatos do Figma ainda precisam ser fornecidos ou registrados antes da auditoria aprofundada de produto, domínio e UX. | UX e produto; nenhum nó documental criado | Ausência informada na solicitação aprovada da Etapa 3. | `FATO_DOCUMENTADO` | A rastreabilidade de arquivos, páginas, frames, telas e fluxos do Figma ainda não pode ser estabelecida. | `PD-005`, `PD-017` | Etapa 6 | `AGUARDANDO_ENTRADA_EXTERNA` |
| `GAP-009` | `DESTINO_NORMATIVO_NAO_DEFINIDO` | Os destinos normativos que receberão o conteúdo consolidado após as auditorias das camadas não estão especificados para todos os assuntos. | Ciência, produto, dados, UX e arquitetura | `PROJECT_CONTEXT.md`, `SOURCE_AUTHORITY.md` e destinos condicionais descritos em `PENDING_DECISIONS.md`. | `NAO_ESPECIFICADO` | Resultados futuros deverão aguardar autoridade e destino identificados antes de qualquer consolidação normativa. | `PD-002` a `PD-006` | Etapas 4 a 7 | `VINCULADA_A_PENDENCIA` |

### Síntese quantitativa das lacunas

| Dimensão | Valor |
|---|---:|
| Lacunas totais | 9 |
| `METADADO_AUSENTE` | 1 |
| `AUTORIDADE_PENDENTE` | 5 |
| `RELACAO_NAO_DECLARADA` | 1 |
| `ENTRADA_EXTERNA_PENDENTE` | 1 |
| `DESTINO_NORMATIVO_NAO_DEFINIDO` | 1 |
| `AGUARDANDO_AUDITORIA` | 2 |
| `VINCULADA_A_PENDENCIA` | 6 |
| `AGUARDANDO_ENTRADA_EXTERNA` | 1 |
| `PRELIMINAR` | 0 |

Nenhuma nova pendência foi incorporada ao registro vivo nesta etapa. A leitura restrita não identificou candidata decisória claramente distinta de `PD-001` a `PD-017`; as lacunas sem vínculo decisório permanecem para confirmação nas auditorias.

## Entrada futura dos artefatos do Figma

Os artefatos do Figma ainda precisam ser fornecidos ou registrados antes da auditoria aprofundada de produto, domínio e UX. Esta matriz não cria documento fictício nem identificador para arquivo inexistente e não audita o Figma nesta etapa.

Quando forem efetivamente apresentados, arquivos, páginas, frames, telas e fluxos deverão receber identificadores estáveis e proveniência, incluindo origem, localizador, data quando disponível, responsável quando identificado e relação com os nós documentais existentes. O estado de cada artefato deverá seguir os critérios que a equipe definir em `PD-017`, usando somente:

- `APROVADO`;
- `EM_REVISAO`;
- `EXPLORACAO`;
- `SUBSTITUIDO`;
- `IMPLEMENTADO_NAO_APROVADO`.

Até a resolução de `PD-005` e `PD-017` e a apresentação dos artefatos, nenhuma tela, fluxo ou estado de aprovação do Figma deve ser presumido.

## Método e ponto de parada

A matriz foi construída a partir do registro canônico, da enumeração de títulos e cabeçalhos dos 13 arquivos, de buscas direcionadas por escopo, finalidade, entradas, saídas, referências, dependências, integração, rastreabilidade e títulos dos documentos, e da leitura apenas dos trechos mínimos necessários a localizadores. O mérito de regras, fórmulas, requisitos, wireframes e escolhas técnicas não foi analisado.

Este documento permanece em `EM_REVISAO`. As relações inferenciais, as lacunas e a alocação deverão ser revisadas pela equipe antes da Etapa 4. Nenhuma auditoria aprofundada ou atualização normativa foi iniciada.
