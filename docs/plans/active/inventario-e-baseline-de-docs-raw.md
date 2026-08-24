# Inventário e baseline de `docs/raw/`

## Identificação e estado

- **Identificador:** `DOC-PLAN-001`
- **Título:** Inventário e baseline de `docs/raw/`
- **Estado atual:** `AGUARDANDO_REVISAO`
- **Data do baseline:** 2026-08-24
- **Responsável:** não especificado

## Objetivo e resultado esperado

Inventariar individualmente os itens existentes em `docs/raw/` e estabelecer uma fotografia verificável do conjunto, com identidade técnica, metadados explicitamente declarados, classificação preliminar, limitações e checksums SHA-256. O resultado esperado é um baseline que permita identificar exatamente as fontes presentes em 2026-08-24 sem avaliar correção, vigência, coerência, suficiência ou compatibilidade de conteúdo.

## Escopo

Inclui a enumeração dos itens de `docs/raw/`, inspeção técnica, leitura controlada de elementos identificadores, cálculo de checksums, detecção de igualdade binária, atualização de `docs/governance/DOCUMENT_REGISTER.md` e manutenção deste plano.

## Fora de escopo

Não inclui auditoria aprofundada, resumo substantivo, extração de requisitos, regras, fórmulas, variáveis ou decisões, comparação entre fontes ou com o código, resolução de conflitos ou pendências, atualização normativa, criação de ADR ou PRD, nem qualquer alteração em `docs/raw/`.

## Fontes e autoridade

| Assunto | Fonte | Autoridade e limite nesta etapa |
|---|---|---|
| Execução | Solicitação aprovada da Etapa 2 e `AGENTS.md` | Governam somente a execução autorizada. |
| Planejamento | `PLANS.md` | Define estrutura, estados, validação e ponto de parada do plano. |
| Inventário | `docs/governance/DOCUMENT_REGISTER.md` | Define campos, estados e registro canônico. |
| Classificação e autoridade | `docs/governance/SOURCE_AUTHORITY.md` | Define classificações e limites; não autoriza auditoria nem resolução de conflitos. |
| Contexto mínimo | `PROJECT_CONTEXT.md` | Orienta identidade e camadas; não valida documentos individuais. |
| Metadados documentais | O próprio arquivo em `docs/raw/` | Autoriza registrar somente declarações explícitas. |
| Integridade técnica | Caminhos, tipos, bytes, permissões, timestamps e checksums observados | Comprova identidade técnica no baseline, não validade semântica. |
| Estado histórico | Localização em `docs/raw/` | Determina preservação histórica, sem conferir autoridade normativa atual. |

As informações observadas nesta etapa são `FATO_DOCUMENTADO` quando declaradas por fonte identificada e evidência técnica quando diretamente verificadas nos arquivos. Ausências permanecem `não especificado`; nenhuma inferência será convertida em decisão ou autoridade.

## Estado inicial

- `git status --short`: sem saída; árvore de trabalho limpa.
- Commit (`git rev-parse HEAD`): `806d3629f6154943a1d75ddfa7f3a6f92b0bbfb5`.
- Branch (`git branch --show-current`): `development`.
- Arquivos modificados ou não rastreados: nenhum.
- `docs/plans/active/`: ausente antes desta etapa; criado conforme autorização expressa.
- Total de itens diretamente em `docs/raw/`: 13.
- Arquivos regulares: 13.
- Outros tipos de entrada: 0.
- Formato técnico inicial: 13 arquivos Markdown, identificados tecnicamente como `text/plain`.
- Ordenação: caminho relativo completo sob `LC_ALL=C`.

### Baseline técnico inicial de `docs/raw/`

| Caminho | Tipo | Tamanho | Permissões | Timestamp de modificação | SHA-256 |
|---|---|---:|---|---|---|
| `docs/raw/algoritmo-operacional-hidroflorestas-mvp.md` | arquivo regular | 7336 bytes | `-rw-rw-r--` (`664`) | `2026-08-24 01:21:01.736029435 -0300` | `896298b12bdce0b1970b2356756296aaf6b11cc481c76567775147d1ed52b2b6` |
| `docs/raw/backlog-hidroflorestas-mvp.md` | arquivo regular | 10216 bytes | `-rw-rw-r--` (`664`) | `2026-08-24 01:37:06.676653600 -0300` | `06dbbc47c88d740e824cf6c070300cb61e5ce3a220f7283ffdd82e259f48a2db` |
| `docs/raw/definicao-dos-requisitos-da-plataforma-hidroflorestas.md` | arquivo regular | 7821 bytes | `-rw-rw-r--` (`664`) | `2026-08-24 01:26:23.894908873 -0300` | `bfa351db96acfe044671f66ffb27c758292572805085491e1d5da9393a5c8bbf` |
| `docs/raw/dicionario-de-dados.md` | arquivo regular | 6517 bytes | `-rw-rw-r--` (`664`) | `2026-08-24 01:18:29.210669986 -0300` | `c60f1b8773d0f64c9ecc5eeff5f5c7931868790595fa9c8c63011bc6a4528ad1` |
| `docs/raw/especificacao-tecnica-sistema-plataforma-hidroflorestas-mvp.md` | arquivo regular | 6689 bytes | `-rw-rw-r--` (`664`) | `2026-08-24 01:33:59.494982674 -0300` | `0497d60c2d9a57363bd3f2d9ae8d68900c7e4680f34ea5761bc29595cad2e776` |
| `docs/raw/matriz-de-variaveis-do-ihfr.md` | arquivo regular | 5737 bytes | `-rw-rw-r--` (`664`) | `2026-08-22 23:48:37.474134076 -0300` | `dd2a40af070bdff1a44367aab7d868e2cd6cacd7c8e8588dfdf17fcb494973b4` |
| `docs/raw/modelo-cientifico-do-ihfr.md` | arquivo regular | 8172 bytes | `-rw-rw-r--` (`664`) | `2026-08-22 23:12:45.349289094 -0300` | `c90147a321306d2ec7f5ffce55cc7d7cce3e343555e4d16f3ea9a39f79ee4dd5` |
| `docs/raw/modelo-conceitual-do-ihfr.md` | arquivo regular | 5520 bytes | `-rw-rw-r--` (`664`) | `2026-08-22 23:12:50.497116536 -0300` | `157d256a4db4b725ed7f277780fa234ee81ba60ae4582bfe0c93b34d6a68603a` |
| `docs/raw/modelo-regional-do-ihfr-calibracao-ecologica-baixo-itapecuru-maranhao.md` | arquivo regular | 5330 bytes | `-rw-rw-r--` (`664`) | `2026-08-23 00:01:16.576224639 -0300` | `b6671cac4ae1600c678af25e89db087d897b054c0d449b53f91bcbcca0c0b8ab` |
| `docs/raw/protocolo-de-campo-do-ihfr.md` | arquivo regular | 5627 bytes | `-rw-rw-r--` (`664`) | `2026-08-23 00:07:22.883088570 -0300` | `026045aa408c784f5a4c4ece0285e445b792ccd571cc5d6f596c2b0850e166ca` |
| `docs/raw/roadmap-tecnologico-arquitetura-recomendada-hidroflorestas.md` | arquivo regular | 5892 bytes | `-rw-rw-r--` (`664`) | `2026-08-24 01:31:41.341748799 -0300` | `633de150a6b35d372f9f76341a441b7fb2a87114528e2e74c42cd6982723b93c` |
| `docs/raw/specificacao-do-ihfr-v0-1-mvp-contrato-matematico.md` | arquivo regular | 7202 bytes | `-rw-rw-r--` (`664`) | `2026-08-22 23:56:47.099012128 -0300` | `d2382cf17561f557bbd70201875d08c554740a01bb31448f0d0713c8dd8f117a` |
| `docs/raw/wireframes-funcionais-mvp-plataforma-hidroflorestas.md` | arquivo regular | 5826 bytes | `-rw-rw-r--` (`664`) | `2026-08-24 01:29:39.720661813 -0300` | `80f2a41632c401a041503d4a001cd498e5e5ff1f8bb15bd47eb6c9151e31ac1b` |

## Alterações preexistentes a preservar

Nenhuma alteração modificada ou não rastreada foi observada no estado inicial. O diretório `.env` apareceu apenas como nome na inspeção geral da árvore e não foi lido. Nenhuma área fora dos dois artefatos autorizados será alterada.

## Método de inventário

1. Fixar lista ordenada, tipos, tamanhos, permissões, timestamps e checksums iniciais.
2. Examinar, para cada Markdown, nome, metadados técnicos, título, cabeçalhos iniciais e somente os trechos necessários a metadados explícitos.
3. Interromper a leitura de cada fonte assim que título, categoria, camada, origem, versão, data, autoria, aprovação e substituição forem identificados ou confirmados ausentes.
4. Atribuir identificadores estáveis em ordem de caminho e registrar cada item nas duas tabelas complementares.
5. Detectar apenas igualdade binária por checksum; não inferir equivalência semântica nem substituição.
6. Repetir o levantamento técnico final e comparar com este baseline.

## Critérios de classificação

- Título interno declarado tem precedência; título derivado do nome será explicitado.
- Categoria e camada são preliminares e descritivas, apoiadas em título e cabeçalhos identificadores.
- Origem, versão, data, responsável, aprovação e substituição exigem declaração explícita; caso contrário, recebem `não especificado`.
- Todo arquivo em `docs/raw/` recebe estado `HISTORICO_IMUTAVEL` e caráter `Histórico imutável`, sem implicar vigência.
- A autoridade individual permanece restrita ao assunto, origem e aprovação conforme `SOURCE_AUTHORITY.md`; não será presumida como normativa atual.
- Timestamp de filesystem não será usado como data documental.

## Etapas e critérios de conclusão

| Etapa | Estado | Critério de conclusão |
|---|---|---|
| Registrar baseline inicial | Concluída | Estado Git, árvore, tipos, estatísticas e checksums registrados. |
| Fazer leitura controlada | Concluída | Metadados identificadores dos 13 arquivos levantados sem auditoria substantiva. |
| Atualizar o registro canônico | Concluída | Plano e registros individuais presentes, com correspondência entre tabelas. |
| Validar integridade e consistência | Concluída | Baseline final idêntico, checksums recalculados e verificações obrigatórias aplicáveis aprovadas. |
| Encaminhar para revisão humana | Concluída | Estado `AGUARDANDO_REVISAO` e ponto de parada registrados. |

Responsáveis pelas etapas: agente mantenedor durante a execução; revisão e aprovação humanas pela equipe, responsáveis individuais não especificados.

## Dependências, riscos e limitações

- A classificação depende de metadados explicitamente declarados e de leitura estritamente controlada.
- Títulos ou nomes semelhantes não comprovam duplicidade, relação de substituição ou autoridade.
- Termos como “final”, “oficial” ou “aprovado” em nomes não comprovam vigência.
- Leitura pode atualizar `atime`, que não integra o invariante de integridade.
- Arquivo ilegível, checksum impossível, item não contabilizado ou mudança inesperada em `docs/raw/` constitui bloqueio ou ressalva material.
- Os 13 documentos são Markdown legível, identificado tecnicamente como `text/plain`; não há propriedades internas estruturadas equivalentes às de PDF ou DOCX.
- `rg` não está disponível no ambiente; a busca restrita por rótulos de metadados foi realizada com `grep`, sem instalação de dependências.
- O lint de Markdown não foi executado porque não foi encontrado comando ou configuração de Markdown lint no escopo inspecionado.

## Verificações executadas

| Verificação | Método | Resultado |
|---|---|---|
| Estado e escopo Git | `git status --short`, `git diff --check`, `git diff --stat` e revisão de `git diff` | Aprovada; somente os dois artefatos autorizados foram criados ou alterados, e o diff não contém erros de whitespace. |
| Integridade de `docs/raw/` | Repetição de `find`, `stat`, `sha256sum` e `git diff -- docs/raw` | Aprovada; caminhos, tipos, tamanhos, permissões, timestamps de modificação e checksums permanecem iguais ao baseline; diff vazio. |
| Contagem e cobertura | Comparação estruturada entre lista ordenada e tabelas | Aprovada; 13 de 13 arquivos possuem exatamente um registro individual em cada tabela. |
| Identificadores e caminhos | Análise por coluna com `awk` | Aprovada; nenhum identificador ou caminho individual duplicado ou omitido. |
| Correspondência entre tabelas | Contagem e comparação dos identificadores | Aprovada; 22 identificadores em cada tabela, incluindo `DOC-RAW-001`, `DOC-PLAN-001` e os 13 registros individuais. |
| Checksums registrados | Recalculo por arquivo e comparação por identificador | Aprovada; os 13 checksums SHA-256 coincidem com os valores registrados. |
| Igualdade binária | Agrupamento dos checksums recalculados | Nenhum grupo com SHA-256 idêntico. |
| Links Markdown locais | Extração dos links dos arquivos alterados e teste de existência dos destinos | Aprovada; o único link local encontrado, `SOURCE_AUTHORITY.md`, resolve para arquivo existente. |
| Terminologia e limites | Revisão manual das duas tabelas e do plano | Aprovada; ausências usam `não especificado`, não há título derivado, autoridade normativa atual ou substituição inferida, e `HISTORICO_IMUTAVEL` permanece distinto de aprovação. |
| Conteúdo sensível | Revisão das alterações produzidas | Aprovada; nenhum segredo, credencial ou dado pessoal desnecessário foi incluído. |
| Lint de Markdown | Detecção de comando e configuração disponíveis | Não executada; nenhuma ferramenta ou configuração de Markdown lint foi encontrada e nenhuma dependência foi instalada. |

## Resultados quantitativos

- Estado inicial e final: 13 itens, 13 arquivos regulares e 0 outros tipos de entrada.
- Formatos: 13 arquivos Markdown identificados como `text/plain`.
- Registros individuais criados: 13, de `DOC-RAW-002` a `DOC-RAW-014`.
- Registro operacional criado: `DOC-PLAN-001`, primeiro identificador livre no namespace.
- Checksums: 13 SHA-256 recalculados e coincidentes; 13 valores distintos; nenhuma igualdade binária.
- Metadados: 13 títulos internos declarados; 2 versões documentais declaradas; 13 origens, 13 datas documentais e 13 responsáveis não especificados; 11 versões documentais não especificadas; nenhuma aprovação documental ou relação de substituição explicitamente declarada identificada.
- Títulos derivados do nome do arquivo: 0.

## Bloqueios e desvios

Nenhum bloqueio material foi identificado. Como desvios instrumentais sem impacto no repositório: `rg` não estava disponível e foi substituído por `grep`; a primeira tentativa de um verificador auxiliar teve erro de quoting ao tratar acentos graves Markdown, não alterou arquivos e foi descartada, sendo repetida com comparação por colunas e resultado aprovado.

## Ponto de parada

Este plano permanece em `AGUARDANDO_REVISAO`. Não será movido para `docs/plans/completed/`, e nenhuma Etapa 3 será iniciada sem revisão e aprovação da equipe.

## Histórico de estados

| Data | Estado | Evento e evidência |
|---|---|---|
| 2026-08-24 | `EM_ANDAMENTO` | Plano criado após levantamento do estado inicial; leitura controlada ainda pendente. |
| 2026-08-24 | `AGUARDANDO_REVISAO` | Inventário individual, baseline final e verificações aplicáveis concluídos; arquivos de `docs/raw/` permaneceram inalterados. |

## Resumo de encerramento

Etapa 2 executada com 13 arquivos inventariados individualmente e integridade técnica confirmada antes e depois. O plano permanece ativo e aguarda revisão humana; nenhuma etapa posterior foi iniciada.
