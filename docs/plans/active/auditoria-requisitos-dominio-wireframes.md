# Auditoria de requisitos, domínio implícito e wireframes

## Identificação e estado

- **Identificador:** `DOC-PLAN-005`
- **Título:** Auditoria documental de requisitos, domínio implícito e wireframes históricos do MVP
- **Etapa:** 6
- **Estado atual:** `AGUARDANDO_REVISAO`
- **Data:** 2026-08-26
- **Responsável pela execução:** agente mantenedor
- **Autoridade de produto:** não especificada; dependente de `PD-003`
- **Autoridade de UX:** não especificada; dependente de `PD-005`
- **Autoridade de dados:** não especificada; dependente de `PD-004`

## Objetivo e resultado esperado

Auditar as declarações históricas de requisitos, atores, permissões, regras, conceitos, relações, fluxos e wireframes do MVP, confrontando `DOC-RAW-004` e `DOC-RAW-014` sem lhes conceder vigência normativa. O resultado esperado é `DOC-011` em `EM_REVISAO`, com inventários analíticos, avaliação de suficiência, cobertura rastreável, achados e perguntas, sem aprovar requisitos, definir o modelo normativo de domínio, comparar com implementação ou iniciar etapa posterior.

## Escopo

- Concluir e arquivar administrativamente a Etapa 5 após preflight consistente.
- Ler integralmente `DOC-RAW-004` e `DOC-RAW-014`.
- Identificar metadados, estrutura, alcance e limitações das duas fontes.
- Inventariar requisitos e candidatos como `PROD-REQ-NNN`.
- Avaliar a suficiência documental de cada candidato sem avaliar aprovação ou mérito.
- Inventariar atores e papéis como `ROLE-NNN`.
- Descrever conceitos `DOM-CON-NNN`, relações `DOM-REL-NNN` e regras `BUS-RULE-NNN` do domínio histórico implícito.
- Inventariar fluxos `FLOW-NNN`, telas/estados/componentes `SCREEN-NNN`, cobertura, achados `PROD-FND-NNN` e perguntas `PROD-Q-NNN`.
- Relacionar resultados a pendências existentes e registrar candidatos futuros sem alterar a matriz ou o registro de pendências.
- Atualizar somente os artefatos autorizados.

## Fora de escopo

- Aprovar requisitos, telas, fluxos, atores, permissões ou regras de negócio.
- Definir modelo normativo de domínio, conta, assinante, organização, laboratório ou área.
- Normalizar silenciosamente termos históricos diferentes.
- Auditar código, banco, schema, migrations, testes ou estado de implementação.
- Auditar Figma ou exigir artefatos externos; criar arquivos, páginas, frames ou telas fictícios.
- Consultar internet ou qualquer fonte externa.
- Alterar `docs/raw/`, `TRACEABILITY_MATRIX.md`, `PENDING_DECISIONS.md`, documentação normativa ou código.
- Criar ADR, PRD, pendência canônica ou relação de substituição.
- Executar a Etapa 7 ou etapa posterior.

## Fontes, autoridade e classificação

| Assunto | Fonte | Autoridade e limite |
|---|---|---|
| Execução | Solicitação aprovada da Etapa 6 e `AGENTS.md` | Governam somente o trabalho autorizado nesta etapa. |
| Planejamento | `PLANS.md` | Define estrutura, estados, validações, histórico e ponto de parada. |
| Classificação e conflitos | `docs/governance/SOURCE_AUTHORITY.md` | Impede converter histórico, recorrência ou wireframe em aprovação. |
| Identidade documental | `docs/governance/DOCUMENT_REGISTER.md` | Governa identificadores, caminhos e estados documentais. |
| Controle documental | `docs/governance/TRACEABILITY_MATRIX.md` | `CANONICO_ATUAL` somente como controle; não valida produto, UX ou domínio. |
| Pendências | `docs/governance/PENDING_DECISIONS.md` | `PD-003`, `PD-004`, `PD-005`, `PD-014`, `PD-015`, `PD-016` e `PD-017` permanecem abertas. |
| Dependências científicas | `DOC-009` e `DOC-010` | Entradas analíticas auxiliares; não são fontes primárias de requisitos. |
| Requisitos históricos | `DOC-RAW-004` | `HISTORICO_IMUTAVEL`; declaração literal é fato sobre a fonte, não requisito vigente. |
| Wireframes históricos | `DOC-RAW-014` | `HISTORICO_IMUTAVEL`; expectativa de tela não prova aprovação nem regra de negócio. |
| Relações deduzidas | Comparação interna das fontes | `INFERENCIA`, sempre rotulada. |
| Alternativas históricas | Recomendações, futuros e possibilidades nas fontes | `PROPOSTA` ou `EM_AVALIACAO`, sem aprovação presumida. |
| Orientações da auditoria | Encaminhamentos futuros | `RECOMENDACAO`, sem autoridade decisória. |

Toda ausência é `NAO_ESPECIFICADO`. `DECISAO_CONFIRMADA` somente poderá ser usada para decisões canônicas cuja origem esteja registrada, como a orientação de que Figma é opcional e não bloqueante; ela não classifica nenhum artefato concreto.

## Estado inicial e alterações preexistentes

- `git status --short`: vazio no início da solicitação; nenhuma alteração modificada, adicionada ou não rastreada.
- Commit inicial: `e10b0b01c28906be7a046504c68334957dc6efe1`.
- Branch inicial: `development`.
- Alterações preexistentes: nenhuma.
- `docs/raw/`: 13 arquivos regulares Markdown; nenhum delta Git inicial.
- Baseline: 13 caminhos, tipos, tamanhos, permissões, `mtime` e SHA-256 registrados antes da edição; todos coincidentes com `DOCUMENT_REGISTER.md`.
- IDs livres confirmados antes da criação: `DOC-011` e `DOC-PLAN-005`.
- `DOC-009`: `CANONICO_ATUAL` exclusivamente como análise aprovada; `DOC-PLAN-003`: `ARQUIVADO`.
- `DOC-010` no preflight: `EM_REVISAO`; `DOC-PLAN-004`: ativo em `AGUARDANDO_REVISAO`.
- `PD-002`: `ABERTA`.
- Matriz: `CANONICO_ATUAL` somente como controle, 13 nós, 16 relações, 10 lacunas e cobertura primária 13/13.
- `GAP-008`: `OPCIONAL_NAO_BLOQUEANTE`; `PD-017`: `ABERTA`; Figma opcional, secundário e não bloqueante.
- Nenhum artefato concreto de Figma foi identificado no corpus ou nos caminhos registrados; ausência tratada como entrada externa opcional.

## Encerramento administrativo da Etapa 5

- Preflight consistente com `DOC-010` em `EM_REVISAO`: 16 fórmulas, 17 variáveis, 7 entradas adicionais, 13 parâmetros regionais, 21 passos, 32 testes, 20 achados, 18 perguntas, 2 conflitos próprios e 9 bloqueios para normatização.
- Ausência de escolha normativa, validação científica, comparação com código e resolução de `PD-002` confirmada.
- `DOC-PLAN-004` confirmado em `AGUARDANDO_REVISAO`, com caminho ativo, histórico das correções e ponto de parada corretos.
- Aprovação humana da Etapa 5 registrada na solicitação da Etapa 6.
- `DOC-PLAN-004` alterado para `CONCLUIDO` e arquivado em `docs/plans/completed/auditoria-contrato-matematico-calibracao-algoritmo.md`.
- Checksum final de `DOC-PLAN-004`: `SHA-256:4d5a26c9e19a3a721377f89f944425b03dd17e4eca883134dcffbf06664d8b0b`.
- `DOC-010` promovido a `CANONICO_ATUAL` exclusivamente como relatório analítico aprovado.
- Checksum final de `DOC-010`: `SHA-256:ded7d824e73552c651f3798dbbeec5f09261b15d0eae88f5feebbed153578e21`.
- A promoção não valida fórmulas, não escolhe pesos, não valida calibração, não resolve `PD-002` e não cria norma científica ou operacional.
- Nenhuma relação de substituição foi criada; os achados e limites da Etapa 5 foram preservados.

## Arquivos autorizados e afetados

| Ação | Caminho | Finalidade |
|---|---|---|
| Mover e alterar | `docs/plans/completed/auditoria-contrato-matematico-calibracao-algoritmo.md` | Concluir e arquivar a Etapa 5. |
| Alterar | `docs/reports/audits/2026-08-25-auditoria-contrato-matematico-calibracao-algoritmo.md` | Registrar aprovação exclusivamente analítica da Etapa 5. |
| Criar e manter | `docs/plans/active/auditoria-requisitos-dominio-wireframes.md` | Planejar e evidenciar a Etapa 6. |
| Criar e manter | `docs/reports/audits/2026-08-26-auditoria-requisitos-dominio-wireframes.md` | Registrar a auditoria de produto, domínio implícito e UX histórica. |
| Alterar | `docs/governance/DOCUMENT_REGISTER.md` | Registrar o encerramento da Etapa 5 e os artefatos da Etapa 6. |

Nenhum outro caminho pode ser alterado.

## Riscos, dependências e decisões pendentes

- Títulos, listas de funções e elementos de tela podem parecer requisitos completos sem possuir ator, condição, erro ou critério.
- A terminologia `usuário`, `Administrador/Técnico`, `Usuário de Campo`, agricultor, liderança e técnico parceiro pode representar papéis sobrepostos sem relação declarada.
- `Area`, propriedade, diagnóstico, análise e histórico podem ter relações implícitas sem cardinalidade ou propriedade definida.
- A fonte de wireframes pode introduzir campos, ações ou navegação ausentes na fonte de requisitos; diferença não é conflito automático.
- Detalhes visuais, exemplos e conteúdo demonstrativo não podem ser promovidos a regras.
- Laboratório, organização, assinante, membro e conta de cobrança podem não aparecer; ausência não autoriza criar modelo.
- Dependências científicas do cálculo e das saídas permanecem vinculadas a `PD-002`, `DOC-009` e `DOC-010` sem virar requisitos atuais.
- `PD-003`, `PD-004`, `PD-005`, `PD-014`, `PD-015`, `PD-016` e `PD-017` bloqueiam futura normatização, não a auditoria.
- Mudança inesperada em `docs/raw/` ou em caminho não autorizado bloqueia a execução.

## Método

1. Numerar linhas das duas fontes sem alterar o corpus.
2. Registrar metadados literais, proveniência ausente, estrutura e limitações.
3. Separar requisito formulado, comportamento descrito, expectativa de tela, proposta, exemplo, justificativa, benefício e inferência.
4. Criar identificadores analíticos estáveis e registrar fonte/localizador em cada item.
5. Avaliar ator, ação, objeto, condições, fluxo, autorização, dados, validação, erro, aceite, prioridade, fase e dependências sem completar ausências.
6. Extrair atores e papéis literais sem unificá-los por semelhança.
7. Descrever conceitos e relações históricas; cardinalidade, propriedade, compartilhamento, transferência e exclusão somente quando declarados.
8. Reconstruir apenas fluxos e telas explícitos ou claramente parciais; toda ligação deduzida será `INFERENCIA`.
9. Confrontar terminologia, funções, campos, ações, estados e cobertura entre as duas fontes.
10. Aplicar o critério estrito de conflito; diferenças conciliáveis por fase, tipo de artefato ou detalhe não serão conflitos.
11. Registrar achados, perguntas e encaminhamentos sem responder ou resolver pendências.
12. Executar verificações de integridade, escopo, links, sequências, referências, contagens, classificações e segurança.

## Critérios analíticos

### Requisitos

- Cada `PROD-REQ-NNN` deve indicar formulação fiel, origem do enunciado, tipo, ator, objeto, ação, condição/resultado, prioridade/fase, aceite, relações, dependências, classificação, aprovação e lacuna.
- Suficiência usa somente `COMPLETO_NO_ESCOPO_DA_FONTE`, `PARCIAL`, `AMBIGUO`, `NAO_ESPECIFICADO` e `NAO_APLICAVEL`.
- “Completo” significa completude documental histórica, nunca aprovação.

### Domínio e regras

- `DOM-CON-NNN`, `DOM-REL-NNN` e `BUS-RULE-NNN` representam descrições históricas, não modelo normativo.
- Termos diferentes permanecem distintos; nenhuma cardinalidade será inventada.
- Laboratório, organização e assinante serão registrados apenas se aparecerem; ausências serão confrontadas com pendências existentes.

### Fluxos e telas

- Fluxos usam `EXPLICITO`, `PARCIAL`, `INFERIDO`, `AMBIGUO` ou `NAO_LOCALIZADO`.
- Telas distinguem página/tela principal, painel, componente, estado, modal e variação responsiva.
- Estado de aprovação será `NAO_ESPECIFICADO` sem evidência explícita e implementação permanecerá `NAO_AVALIADO`.
- Ausência de estado vazio, carregamento, erro, confirmação, autorização, responsividade ou acessibilidade será registrada sem criar interface fictícia.

### Cobertura e achados

- Cobertura usa `COBERTO_EXPLICITAMENTE`, `COBERTO_PARCIALMENTE`, `COBERTURA_INFERIDA`, `NAO_COBERTO`, `NAO_APLICAVEL` ou `AMBIGUO`.
- Cada inferência deve ser rotulada e nenhuma tela será tratada automaticamente como requisito.
- `CONFLITO_DOCUMENTAL` exige comportamento simultaneamente incompatível, mesmo assunto e ausência de recorte conciliador.

## Etapas e critérios de conclusão

| Etapa | Estado | Critério |
|---|---|---|
| Inspecionar estado inicial e preflight | Concluída | Governança, IDs, matriz, pendências, baseline e ausência de alterações preexistentes confirmados. |
| Concluir administrativamente a Etapa 5 | Concluída | Aprovação, estados, movimento, limites e checksums registrados. |
| Ler o corpus primário | Concluída | `DOC-RAW-004` e `DOC-RAW-014` lidos integralmente, 636 linhas físicas no total. |
| Inventariar requisitos e suficiência | Concluída | 60 candidatos têm IDs, fontes, localizadores, classificação, aprovação e avaliação de suficiência. |
| Inventariar atores, domínio e regras | Concluída | 9 papéis, 25 conceitos, 20 relações e 13 regras descritos sem normalização. |
| Inventariar fluxos e telas | Concluída | 10 fluxos e 17 itens de página/estado/componente registrados com implementação `NAO_AVALIADO`. |
| Construir cobertura, achados e perguntas | Concluída | 414 relações em dez tipos, 22 achados e 28 perguntas rastreáveis registrados. |
| Atualizar registro e verificar | Concluída | Registro 30/30, escopo, links, contagens e integridade validados; estados finais aplicados. |

## Verificações previstas

- Comparar estado final com inicial e conferir somente caminhos autorizados.
- Recalcular caminhos, tipos, bytes, permissões, `mtime` e SHA-256 dos 13 arquivos de `docs/raw/`; exigir 13/13 idênticos e diff vazio.
- Recalcular checksums de `DOC-010` e `DOC-PLAN-004`.
- Executar `git diff --check` e verificação equivalente nos arquivos novos.
- Validar links Markdown locais e correspondência das tabelas do registro.
- Validar unicidade, sequência e referências dos nove namespaces da Etapa 6.
- Conferir contagens por tipo, suficiência, cobertura, impacto e estado.
- Confirmar fonte/localizador em cada requisito, conceito, papel, regra, fluxo e tela.
- Confirmar rótulos de inferência, aprovação não presumida e implementação `NAO_AVALIADO`.
- Confirmar Figma opcional/não bloqueante e ausência de escolha de modelo de laboratório.
- Confirmar ausência de comparação com código, fonte externa, segredo, credencial ou dado pessoal desnecessário.
- Executar lint Markdown somente se já configurado, sem instalar dependências.

## Resultados quantitativos

- Fontes primárias: 2, lidas integralmente, 636 linhas físicas.
- Requisitos/enunciados candidatos: 60 — 19 funcionais, 14 de dados, 6 de UX/fluxo, 6 propostas e 15 dos demais tipos.
- Suficiência global: 4 completos no escopo histórico, 45 parciais, 7 ambíguos e 4 não especificados; nenhum item aprovado.
- Atores/papéis: 9; conceitos: 25; relações: 20; regras: 13.
- Fluxos: 10; itens de tela/estado/componente: 17 — cinco páginas/telas, zero modais, um estado e 11 componentes.
- Cobertura: 414 relações — 144 explícitas, 125 parciais, 45 inferidas, 28 não cobertas, 62 não aplicáveis e 10 ambíguas.
- Achados: 22 — 3 alinhamentos, 1 divergência, 0 conflitos, 4 ambiguidades, 8 lacunas, 2 não comparáveis, 2 propostas não aprovadas e 2 pendências de autoridade.
- Impactos: 9 bloqueantes para normatização, 5 altos, 3 médios, 0 baixos e 5 informativos.
- Perguntas: 28; nenhuma respondida.

## Verificações executadas

| Verificação | Resultado |
|---|---|
| Estado inicial/preflight | Árvore inicialmente limpa; commit/branch/baseline, matriz 13/16/10/13, `GAP-008`, `PD-002` e `PD-017` confirmados. |
| Encerramento da Etapa 5 | `DOC-PLAN-004` concluído/arquivado e `DOC-010` analítico aprovado; checksums `4d5a26...d8b0b` e `ded7d824...78e21`; limites preservados. |
| Corpus | 004/014 lidos integralmente; 291 + 345 = 636 linhas. |
| Namespaces/referências | Nove sequências completas e únicas; todos os IDs referenciados existem. |
| Contagens | Requisitos, suficiência, cobertura, achados e perguntas coincidem com as sínteses. |
| Fontes/localizadores | Todos os requisitos, papéis, conceitos, regras, fluxos e telas têm fonte/localizador. |
| Registro | Tabelas em correspondência 30/30, mesma ordem, IDs únicos e caminhos existentes. |
| Links/tabelas | Três links locais válidos; nenhuma inconsistência de colunas. |
| `docs/raw/` | 13/13 caminhos, tipos, bytes, permissões, `mtime` e SHA-256 idênticos; diff vazio. |
| Escopo/whitespace | Somente caminhos autorizados; `git diff --check` e checks equivalentes dos arquivos novos aprovados. |
| Autoridade/implementação/Figma | Aprovação não presumida, implementação `NAO_AVALIADO`, nenhum modelo de laboratório, Figma opcional/não bloqueante. |
| Segurança | Nenhum segredo, credencial real ou dado pessoal desnecessário. |
| Markdown lint | Não executado; `rg` e configuração de lint Markdown não disponíveis; nenhuma instalação. |

## Bloqueios e desvios

- Bloqueios de execução atuais: nenhum.
- Bloqueios para futura normatização: `PROD-FND-007`, `008`, `012`, `013`, `015`, `018`, `019`, `020` e `021`, além de `PD-002` a `PD-005` e `PD-014` a `PD-017`.
- Entrada opcional ausente: artefatos concretos do Figma; `GAP-008` permanece `OPCIONAL_NAO_BLOQUEANTE` e não interrompe a auditoria.
- Desvio instrumental: `rg` e configuração de lint Markdown não estão disponíveis; verificações equivalentes foram executadas com Node.js, `grep`, `find` e utilitários existentes, sem instalação.

## Histórico de estados

| Data | Estado | Evento e evidência |
|---|---|---|
| 2026-08-26 | `EM_ANDAMENTO` | Plano criado após preflight consistente, encerramento administrativo da Etapa 5 e leitura integral das duas fontes primárias. O corpus histórico permanece imutável e nenhuma autoridade normativa foi presumida. |
| 2026-08-26 | `AGUARDANDO_REVISAO` | Auditoria concluída com 60 candidatos, 9 papéis, 25 conceitos, 20 relações, 13 regras, 10 fluxos, 17 itens de interface, 414 relações de cobertura, 22 achados e 28 perguntas. Registro 30/30 e verificações aplicáveis aprovadas; relatório `DOC-011` permanece `EM_REVISAO`, implementação `NAO_AVALIADO`, Figma opcional/não bloqueante e Etapa 7 não iniciada. |
| 2026-08-26 | `AGUARDANDO_REVISAO` | Revisão humana identificou que a instrução de `PROD-REQ-055` está explicitamente documentada; classificação corrigida para 51 `FATO_DOCUMENTADO`, 6 `PROPOSTA` e 3 `INFERENCIA`. Nenhum outro requisito, relação, achado, pergunta ou bloqueio foi alterado. |

## Ponto de parada

Este plano está em `AGUARDANDO_REVISAO` e `DOC-011` em `EM_REVISAO`. Nenhum requisito, tela, fluxo, papel, regra ou modelo de domínio foi aprovado; nenhum código foi comparado; Figma permaneceu opcional e não bloqueante; a Etapa 7 não foi iniciada.
