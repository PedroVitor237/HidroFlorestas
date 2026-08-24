# Auditoria científica fundamental

## Identificação e estado

- **Identificador:** `DOC-PLAN-003`
- **Título:** Auditoria científica fundamental
- **Etapa:** 4
- **Estado atual:** `AGUARDANDO_REVISAO`
- **Data:** 2026-08-24
- **Responsável pela execução:** agente mantenedor
- **Revisão e aprovação científica:** não especificado; dependente de `PD-002`

## Objetivo e resultado esperado

Formalizar o encerramento aprovado da Etapa 3 e auditar, em profundidade documental interna, os fundamentos científicos, a matriz de variáveis, o modelo conceitual científico e o protocolo de campo do IHFR. O resultado esperado é um relatório rastreável de coerência, alinhamentos, divergências, ambiguidades, lacunas, duplicidades e suficiência documental, sem validação científica externa e sem atualização normativa.

## Escopo

- Concluir e arquivar `DOC-PLAN-002` e promover `DOC-008` a `CANONICO_ATUAL` no limite de controle documental.
- Registrar na matriz a orientação atual da equipe sobre o caráter opcional, secundário e não bloqueante do Figma e atualizar somente `GAP-008` entre as lacunas.
- Ler integralmente e auditar somente `DOC-RAW-007`, `DOC-RAW-008`, `DOC-RAW-009` e `DOC-RAW-011`.
- Inventariar o léxico científico, dimensões, componentes, processos, variáveis e procedimentos de campo.
- Mapear a cobertura variável × protocolo e as cadeias conceito/processo → dimensão → variável → método.
- Registrar achados `SCI-FND-NNN`, perguntas `SCI-Q-NNN` e encaminhamentos sem análise conclusiva para a Etapa 5.
- Atualizar o registro documental exclusivamente para os artefatos e transições autorizados.

## Fora de escopo

- Validar cientificamente regras, variáveis, métodos, fórmulas ou protocolos.
- Escolher entre alternativas, estabelecer pesos, criar fórmula oficial ou preencher informações ausentes.
- Usar fontes externas ou conhecimento externo para corrigir evidências históricas.
- Auditar profundamente os outros nove documentos de `docs/raw/`.
- Comparar documentação com código, configurações, schemas, migrations, testes ou comportamento.
- Resolver `PD-002`, alterar `PENDING_DECISIONS.md`, atualizar documentos normativos ou iniciar a Etapa 5.
- Alterar qualquer arquivo de `docs/raw/`.

## Fontes, autoridade e classificações

| Assunto | Fonte | Autoridade e limite |
|---|---|---|
| Execução da Etapa 4 | Solicitação aprovada da Etapa 4 e `AGENTS.md` | Governam o escopo e autorizam as alterações listadas, sem conceder autoridade científica ao agente. |
| Planejamento | `PLANS.md` | Define estrutura, estados, histórico, validação e ponto de parada. |
| Autoridade e classificação | `docs/governance/SOURCE_AUTHORITY.md` | Define autoridade por assunto, classificações e protocolo de conflitos. |
| Identidade e estado documental | `docs/governance/DOCUMENT_REGISTER.md` | Governa IDs, caminhos e estados; inclusão não concede autoridade normativa. |
| Pendência científica | `PD-002` em `docs/governance/PENDING_DECISIONS.md` | Mantém toda validação normativa científica dependente de responsáveis designados. |
| Rastreabilidade documental | `docs/governance/TRACEABILITY_MATRIX.md` | Controla documentos e camadas, sem validar o conteúdo das fontes. |
| Evidências científicas auditadas | `DOC-RAW-007`, `DOC-RAW-008`, `DOC-RAW-009`, `DOC-RAW-011` | `FATO_DOCUMENTADO` somente para declarações localizadas; fontes históricas, sem autoridade normativa atual presumida. |
| Relações derivadas | Confronto interno das quatro fontes | `INFERENCIA`, sempre rotulada e sem força normativa. |
| Questões dependentes da equipe | Achados relevantes sem autoridade suficiente | `PENDENCIA_DE_DECISAO`; não constituem solução. |
| Orientações analíticas | Encaminhamentos do agente | `RECOMENDACAO`; não constituem decisão da equipe. |

Ausências são registradas como `NAO_ESPECIFICADO` ou “não especificado”. Nenhum achado altera a autoridade das fontes.

## Estado inicial

- `git status --short`: vazio; nenhuma alteração preexistente modificada ou não rastreada.
- Commit: `2e0fdf9800bdf26df76d665209f2e52831d4952a`.
- Branch: `development`.
- Planos no início: `DOC-PLAN-001` em `docs/plans/completed/`, `CONCLUIDO`/`ARQUIVADO`; `DOC-PLAN-002` em `docs/plans/active/`, `AGUARDANDO_REVISAO`/`EM_REVISAO`.
- `DOC-008`: `EM_REVISAO`, com 13 nós, 16 relações, 10 lacunas e alocação primária 13/13.
- Próximos identificadores livres conferidos: `DOC-009` e `DOC-PLAN-003`.
- Autoridades pendentes `PD-001` a `PD-006`: seis de seis representadas na matriz; `PD-002` e `PD-017` abertas.
- Baseline científico: `DOC-RAW-007`, `DOC-RAW-008`, `DOC-RAW-009` e `DOC-RAW-011` presentes e correspondentes aos caminhos e SHA-256 registrados.
- Integridade de `docs/raw/`: 13/13 SHA-256 coincidentes com o baseline aprovado; diff inicial vazio.
- Ferramenta indisponível: `rg`; substituição por `grep`, `awk`, `sed`, `find` e utilitários existentes, sem instalação.

## Arquivos afetados

| Ação | Caminho | Finalidade |
|---|---|---|
| Mover e alterar | `docs/plans/completed/rastreabilidade-global-inicial.md` | Concluir, registrar aprovação e arquivar a Etapa 3. |
| Alterar | `docs/governance/TRACEABILITY_MATRIX.md` | Promover a matriz e registrar a orientação atual sobre o Figma. |
| Alterar | `docs/governance/DOCUMENT_REGISTER.md` | Atualizar estados, caminhos, checksums e registrar `DOC-009` e `DOC-PLAN-003`. |
| Alterar | `PROJECT_CONTEXT.md` | Acrescentar a matriz ao mapa canônico, sem mudar outro conteúdo. |
| Criar | `docs/plans/active/auditoria-cientifica-fundamental.md` | Planejar e registrar a execução da Etapa 4. |
| Criar | `docs/reports/audits/2026-08-24-auditoria-cientifica-fundamental.md` | Registrar a auditoria documental científica aprofundada. |

Nenhum outro caminho pode ser alterado.

## Método de auditoria

1. Conferir governança, estado inicial, IDs, baseline e integridade antes de editar.
2. Ler integralmente apenas as quatro fontes autorizadas, com numeração de linhas para localizadores.
3. Extrair literalmente os termos, as quatro dimensões e todas as variáveis de `DOC-RAW-007`, atribuindo IDs estáveis sem editar a fonte.
4. Buscar cada variável nas três outras fontes por nome, variação terminológica e contexto, sem presumir equivalência.
5. Mapear procedimentos do protocolo e registrar ausências apenas como resultado da busca completa interna.
6. Construir cadeias conceituais distinguindo ligações explícitas de ligações inferidas.
7. Verificar coerência de cada fonte e comparar transversalmente os quatro documentos.
8. Aplicar os critérios estritos de `CONFLITO_DOCUMENTAL`; usar tipos menos fortes quando não houver incompatibilidade mutuamente excludente.
9. Separar assuntos matemáticos e operacionais pertencentes à Etapa 5, sem análise conclusiva.
10. Validar identificadores, contagens, localizadores, referências, links, escopo Git e integridade de `docs/raw/`.

## Taxonomias

- **Informação:** `FATO_DOCUMENTADO`, `INFERENCIA`, `PENDENCIA_DE_DECISAO`, `RECOMENDACAO`, `NAO_ESPECIFICADO`.
- **Achado:** `ALINHAMENTO_DOCUMENTAL`, `DIVERGENCIA_DOCUMENTAL`, `CONFLITO_DOCUMENTAL`, `AMBIGUIDADE`, `LACUNA`, `DUPLICIDADE`, `NAO_COMPARAVEL`, `ENCAMINHAR_ETAPA_5`, `PENDENCIA_DE_VALIDACAO_CIENTIFICA`.
- **Impacto:** `BLOQUEANTE_PARA_NORMATIZACAO`, `ALTO`, `MEDIO`, `BAIXO`, `INFORMATIVO`.
- **Estado do achado:** `ABERTO`, `AGUARDANDO_VALIDACAO_CIENTIFICA`, `ENCAMINHADO_ETAPA_5`, `INFORMATIVO`.
- **Cobertura do protocolo:** `COBERTA_EXPLICITAMENTE`, `COBERTA_PARCIALMENTE`, `NAO_LOCALIZADA`, `NAO_APLICAVEL_DECLARADO`, `AMBIGUA`.

## Etapas e critérios de conclusão

| Etapa | Estado | Critério |
|---|---|---|
| Inspecionar estado inicial e baseline | Concluída | Governança lida; Git, IDs, matriz, planos e 13 checksums conferidos. |
| Encerrar formalmente a Etapa 3 | Concluída | Plano `CONCLUIDO` e movido; matriz promovida; contexto atualizado. |
| Ler as quatro fontes autorizadas | Concluída | 809 linhas lidas integralmente com localizadores. |
| Extrair inventários e comparar fontes | Concluída | 21 termos, quatro dimensões, 14 componentes/processos, 17 variáveis, 13 procedimentos e 17 cadeias consolidados. |
| Registrar achados, perguntas e Etapa 5 | Concluída | 20 achados, 12 perguntas e 10 encaminhamentos localizados e classificados sem decisão indevida. |
| Atualizar o registro documental | Concluída | Transições e `DOC-009`/`DOC-PLAN-003` registrados em correspondência 26/26. |
| Executar verificações finais | Concluída | Contagens, links, escopo, checksums, referências, diff e critérios aplicáveis aprovados. |
| Encaminhar para revisão humana | Concluída | Plano em `AGUARDANDO_REVISAO` e relatório em `EM_REVISAO`. |

## Riscos

- Variações terminológicas podem parecer equivalentes sem declaração explícita; serão mantidas como `INFERENCIA` ou `AMBIGUIDADE`.
- A presença de um termo no protocolo pode corresponder a categoria de outra variável, e não a um procedimento próprio.
- Fórmulas e faixas podem revelar divergências documentais, mas sua análise normativa pertence à Etapa 5.
- Ausência de método na fonte não prova inexistência na prática científica externa.
- O volume tabular pode causar inconsistência de contagens; validações automatizadas locais serão combinadas com revisão integral.
- Qualquer mudança inesperada em `docs/raw/` bloqueia a etapa.

## Verificações previstas

- Estados, caminhos e checksums de `DOC-PLAN-002` e `DOC-008`.
- Preservação de 13 nós, 16 relações, 10 lacunas e dos nove `GAP-NNN` não autorizados para alteração substantiva.
- Estado opcional de `GAP-008` e permanência aberta e inalterada de `PD-017`.
- Cobertura 17/17 das variáveis, unicidade e localizadores de `VAR-NNN`.
- Busca protocolar 17/17 e registro de procedimentos sem variável correspondente.
- Unicidade e referências de `SCI-FND-NNN` e `SCI-Q-NNN` e correspondência perguntas–achados.
- Aplicação dos quatro critérios a todo `CONFLITO_DOCUMENTAL`.
- Rotulagem de inferências e encaminhamento dos assuntos matemáticos à Etapa 5.
- Correspondência integral das duas tabelas de `DOCUMENT_REGISTER.md`.
- Links Markdown locais e ausência de segredos ou dados pessoais desnecessários.
- SHA-256 e diff vazio dos 13 arquivos de `docs/raw/`.
- Escopo final do Git, `git diff --check`, detecção de lint Markdown configurado e revisão do diff integral.

## Resultados quantitativos

- Fontes lidas integralmente: 4, com 809 linhas físicas informadas por `wc -l`.
- Léxico: 21 termos.
- Estrutura científica: 4 dimensões e 14 componentes/processos adicionais.
- Variáveis: 17/17 de `DOC-RAW-007`, IDs `VAR-001` a `VAR-017` únicos e localizados.
- Procedimentos de campo/registro: 13, dos quais 2 transversais sem variável própria.
- Cobertura protocolar: 10 `COBERTA_EXPLICITAMENTE`, 1 `COBERTA_PARCIALMENTE`, 5 `NAO_LOCALIZADA`, 0 `NAO_APLICAVEL_DECLARADO` e 1 `AMBIGUA`.
- Cadeias conceituais: 17; 12 alcançam procedimento nomeado e 5 terminam sem procedimento localizado.
- Achados: 20 — 3 alinhamentos, 4 divergências, 1 conflito, 4 ambiguidades, 5 lacunas, 0 duplicidades, 1 não comparável, 1 encaminhamento e 1 pendência de validação.
- Impactos: 8 bloqueantes para normatização, 6 altos, 3 médios, 0 baixos e 3 informativos.
- Estados: 1 aberto, 11 aguardando validação, 4 encaminhados à Etapa 5 e 4 informativos.
- Perguntas científicas: 12. Encaminhamentos à Etapa 5: 10.

## Achados e bloqueios

- Achados: consolidados como `SCI-FND-001` a `SCI-FND-020` no relatório `DOC-009`.
- Bloqueio científico permanente para normatização: `PD-002` continua aberta; a auditoria pode ser concluída documentalmente, mas não pode validar as fontes.
- Bloqueios de execução: nenhum no estado inicial.
- Alterações preexistentes a preservar: nenhuma.

## Verificações executadas

| Verificação | Método | Resultado |
|---|---|---|
| Estado inicial | `git status --short`, `git rev-parse HEAD`, `git branch --show-current`, inspeção de planos e IDs | Aprovada; árvore inicialmente limpa, commit `2e0fdf9800bdf26df76d665209f2e52831d4952a`, branch `development`, IDs livres confirmados. |
| Baseline e fontes | `sha256sum docs/raw/*`, confronto com `DOCUMENT_REGISTER.md` e `git diff -- docs/raw` | Aprovada; 13/13 checksums coincidentes, quatro fontes no baseline e diff vazio. |
| Encerramento da Etapa 3 | Testes de caminho/estado, `grep` e `sha256sum` | Aprovada; `DOC-PLAN-002` `CONCLUIDO`/`ARQUIVADO`, checksum `3fcf3757c25312a981b8a78ab2a2d7defe48d060b751788c711cdcd758036609`; `DOC-008` canônico. |
| Matriz | Contagem seccional por `awk` e revisão do diff | Aprovada; 13 nós, 16 relações, 10 lacunas; somente `GAP-008` alterada entre as lacunas; novo estado na legenda; `PD-017` aberta. |
| Leitura autorizada | `nl -ba` integral de 007/008/009/011 e `wc -l` | Aprovada; somente quatro fontes profundamente lidas, 809 linhas físicas. |
| Variáveis e cadeias | Extração seccional, sequência esperada com `seq` e `cmp`, revisão de localizadores | Aprovada; 17/17 variáveis e 17 cadeias; IDs únicos e sequenciais; cada variável localizada. |
| Cobertura do protocolo | Matriz 17/17 e contagem de estados por `awk`/`grep` | Aprovada; 10 explícitas, 1 parcial, 5 não localizadas, 1 ambígua; dois procedimentos transversais registrados. |
| Achados, perguntas e conflito | Sequências com `seq`/`cmp`, contagens seccionais e inspeção dos localizadores | Aprovada; 20 achados e 12 perguntas únicos; somente `SCI-FND-011` atende aos quatro critérios de conflito. |
| Referências documentais | Extração de `DOC-RAW-NNN` e `PD-NNN`, `sort`, `comm` e confronto com registros | Aprovada; nenhuma referência inexistente. |
| Registro documental | Extração independente das duas tabelas, `sort` e `cmp` | Aprovada; correspondência 26/26, sem ID duplicado; novos registros presentes uma vez. |
| Links locais | Extração de destinos Markdown e `test -e` relativo a cada arquivo | Aprovada; todos os links locais resolvem. |
| Segurança e escopo | Busca por padrões de segredo/dados sensíveis, `git status --short --untracked-files=all` e revisão integral | Aprovada; nenhum dado sensível localizado; somente os caminhos autorizados afetados. |
| Whitespace | `git diff --check` e `git diff --no-index --check` para os dois arquivos novos | Aprovada; nenhum erro. |
| Lint Markdown | Busca por arquivos de configuração existentes com `find` | Não executada; nenhuma configuração de Markdown lint foi encontrada e nenhuma ferramenta foi instalada. |
| Diff integral | `git diff`, revisão integral dos novos arquivos e estatísticas com `git diff --stat`/`wc -l` | Aprovada; limites, taxonomias e ausência de alterações em `docs/raw/` confirmados. |

## Histórico de estados

| Data | Estado | Evento e evidência |
|---|---|---|
| 2026-08-24 | `EM_ANDAMENTO` | Plano criado após a inspeção inicial, a confirmação do baseline e o encerramento formal da Etapa 3; leitura integral das quatro fontes autorizadas concluída e inventários em elaboração. |
| 2026-08-24 | `AGUARDANDO_REVISAO` | Relatório `DOC-009` concluído documentalmente com inventários, cobertura, cadeias, 20 achados, 12 perguntas e 10 encaminhamentos; registro atualizado e verificações aplicáveis aprovadas, sem validação científica nem início da Etapa 5. |

## Ponto de parada

Este plano permanece ativo em `AGUARDANDO_REVISAO`, sem conclusão ou arquivamento, e o relatório permanece em `EM_REVISAO`. A Etapa 4 alcançou seu ponto de parada documental. Nenhuma validação científica, atualização normativa ou Etapa 5 pode ser iniciada sem revisão, autoridade e aprovação apropriadas.
