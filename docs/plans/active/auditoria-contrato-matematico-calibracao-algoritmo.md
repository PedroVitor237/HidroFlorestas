# Auditoria do contrato matemático, da calibração e do algoritmo

## Identificação e estado

- **Identificador:** `DOC-PLAN-004`
- **Título:** Auditoria do contrato matemático, da calibração regional e do algoritmo operacional do IHFR
- **Etapa:** 5
- **Estado atual:** `AGUARDANDO_REVISAO`
- **Data:** 2026-08-25
- **Responsável pela execução:** agente mantenedor
- **Revisão e validação científica:** não especificadas; dependentes de `PD-002`

## Objetivo e resultado esperado

Auditar documentalmente o contrato matemático do IHFR, a calibração regional e o algoritmo operacional, descrevendo de modo verificável o que as fontes declaram e comparando fórmulas, entradas, parâmetros, etapas e saídas. O resultado esperado é um relatório analítico em `EM_REVISAO`, com testes matemáticos documentais, achados e perguntas para futura validação, sem escolher formulação, pesos, calibração ou algoritmo normativos.

## Escopo

- Concluir administrativamente a Etapa 4 após o preflight e a correção conceitual delimitada de `SCI-FND-011`.
- Ler integralmente `DOC-RAW-002`, `DOC-RAW-010` e `DOC-RAW-013`.
- Consultar as seções matemáticas pertinentes de `DOC-RAW-007`, `DOC-RAW-008`, `DOC-RAW-009` e `DOC-RAW-011`.
- Inventariar glossário, símbolos, fórmulas, contrato das 17 variáveis, agregações, pesos, parâmetros regionais, passos operacionais e saídas.
- Executar testes documentais e matemáticos somente com regras das fontes.
- Registrar `FORM-NNN`, `REG-PAR-NNN`, `ALG-STEP-NNN`, `MATH-TEST-NNN`, `MATH-FND-NNN` e `MATH-Q-NNN`.
- Relacionar os resultados com `SCI-FND-NNN`, `SCI-Q-NNN`, `E5-001` a `E5-010`, `VAR-NNN`, `PD-002` e pendências existentes pertinentes.
- Atualizar somente os artefatos expressamente autorizados.

## Fora de escopo

- Validar cientificamente fórmulas, variáveis, pesos, faixas, parâmetros, calibração ou algoritmo.
- Escolher entre média simples, pesos equivalentes e pesos diferenciais.
- Declarar fórmula, calibração, contrato ou algoritmo oficial.
- Comparar com código, banco de dados, schemas, migrations, testes ou implementação.
- Consultar fontes externas ou a internet.
- Alterar `docs/raw/`, documentação científica normativa, código, dependências ou configurações.
- Atualizar `TRACEABILITY_MATRIX.md` ou criar pendências sem necessidade indispensável.
- Criar ADR, PRD ou documentos normativos candidatos.
- Iniciar a Etapa 6 ou posterior.

## Fontes e autoridade

| Assunto | Fonte | Autoridade e limite |
|---|---|---|
| Execução | Solicitação aprovada da Etapa 5 e `AGENTS.md` | Governam exclusivamente a execução autorizada. |
| Planejamento | `PLANS.md` | Define estados, histórico, validações e ponto de parada. |
| Classificações e conflitos | `docs/governance/SOURCE_AUTHORITY.md` | Define a classificação e impede resolver conflitos científicos por inferência. |
| Identidade documental | `docs/governance/DOCUMENT_REGISTER.md` | Governa IDs, caminhos e estados; inclusão não concede autoridade normativa. |
| Rastreabilidade | `docs/governance/TRACEABILITY_MATRIX.md` | Controle documental, sem autoridade científica, funcional ou técnica. |
| Pendência científica | `PD-002` em `docs/governance/PENDING_DECISIONS.md` | Mantém a validação científica e a escolha normativa pendentes. |
| Entrada analítica | `DOC-009` | Encaminhamentos e achados aprovados analiticamente; não é fonte científica primária. |
| Fontes primárias | `DOC-RAW-002`, `DOC-RAW-010`, `DOC-RAW-013` | Evidências históricas literais; nenhuma autoridade científica normativa presumida. |
| Fontes auxiliares | `DOC-RAW-007`, `DOC-RAW-008`, `DOC-RAW-009`, `DOC-RAW-011` | Comparação matemática pertinente; continuam históricas e sem precedência presumida. |
| Comparações e equivalências | Derivação interna das fontes | `INFERENCIA`, sempre rotulada. |
| Escolhas futuras | Questões sem autoridade suficiente | `PENDENCIA_DE_DECISAO`; nenhuma resposta será dada nesta etapa. |
| Orientações do agente | Encaminhamentos analíticos | `RECOMENDACAO`, sem autoridade decisória. |

Declarações literais localizadas são `FATO_DOCUMENTADO`; ausências são `NAO_ESPECIFICADO`; maior completude ou recorrência não demonstra aprovação, precedência ou vigência.

## Estado inicial e preflight

- `git status --short`: vazio; nenhuma alteração modificada, adicionada ou não rastreada no início da solicitação.
- Commit inicial: `49c2b236f6f9efdc06f512e862d48c2f4a83ea23`.
- Branch inicial: `development`.
- Alterações preexistentes: nenhuma.
- `docs/raw/`: 13 arquivos regulares Markdown, sem delta Git inicial.
- Baseline: 13/13 caminhos, tipos, tamanhos, permissões, `mtime` e SHA-256 coincidentes com `DOC-PLAN-001` e `DOCUMENT_REGISTER.md`.
- Etapa 3: plano `DOC-PLAN-002` arquivado, `CONCLUIDO`, checksum `SHA-256:3fcf3757c25312a981b8a78ab2a2d7defe48d060b751788c711cdcd758036609`.
- Matriz: `CANONICO_ATUAL` somente para controle; 13 nós, 16 relações, 10 lacunas, cobertura 13/13; Figma opcional/secundário/não bloqueante; `GAP-008` em `OPCIONAL_NAO_BLOQUEANTE`; `PD-017` aberta.
- `PROJECT_CONTEXT.md`: referencia a matriz e nega autoridade científica, funcional ou técnica.
- Etapa 4 antes da transição: relatório `DOC-009` em `EM_REVISAO`; plano `DOC-PLAN-003` em `AGUARDANDO_REVISAO`; registro 26/26 nas tabelas.
- IDs livres confirmados: `DOC-010` e `DOC-PLAN-004`.
- Desvio instrumental: `rg` não está instalado; `grep`, `awk`, `sed`, `find` e utilitários existentes serão usados, sem instalação.

## Encerramento administrativo da Etapa 4

- Preflight aprovado sem divergência material.
- Correção aplicada a `SCI-FND-011`, `SCI-Q-009`, teste do conflito, `E5-001` e `E5-002`, distinguindo fatos literais de equivalência/incompatibilidade inferidas.
- Identificador, tipo `CONFLITO_DOCUMENTAL`, impacto, prioridade implícita, demais achados, perguntas não relacionadas e contagens foram preservados.
- Aprovação humana condicionada e verificações foram registradas no histórico de `DOC-PLAN-003`.
- Plano movido para `docs/plans/completed/auditoria-cientifica-fundamental.md`, estado `CONCLUIDO`, checksum `SHA-256:7a0ec452aa7e09861320b76bd9c1e053a9dd6ba1f1daa06996e05d6b763e1490`.
- Relatório promovido a `CANONICO_ATUAL` exclusivamente como análise aprovada, checksum `SHA-256:04726bd347de783ce64fd905d1ca11f2dd58fb3c06910919466169e395541e07`.
- A promoção não valida ciência, não cria regra normativa e não resolve `PD-002`.

## Arquivos afetados

| Ação | Caminho | Finalidade |
|---|---|---|
| Alterar | `docs/reports/audits/2026-08-24-auditoria-cientifica-fundamental.md` | Aplicar a correção conceitual e registrar a aprovação analítica. |
| Mover e alterar | `docs/plans/completed/auditoria-cientifica-fundamental.md` | Concluir e arquivar a Etapa 4, preservando o histórico. |
| Criar e manter | `docs/plans/active/auditoria-contrato-matematico-calibracao-algoritmo.md` | Planejar, evidenciar e encaminhar a Etapa 5 à revisão. |
| Criar | `docs/reports/audits/2026-08-24-auditoria-contrato-matematico-calibracao-algoritmo.md` | Registrar a auditoria matemática, regional e operacional. |
| Alterar | `docs/governance/DOCUMENT_REGISTER.md` | Registrar as transições e os artefatos das Etapas 4 e 5. |

Nenhum outro caminho pode ser alterado.

## Riscos e dependências

- Fórmulas semelhantes podem ter escopos ou níveis de agregação distintos ainda não confirmados.
- Uma equivalência algébrica não constitui declaração literal nem aprovação científica.
- Formulações geral e regional podem coexistir, divergir ou depender de aplicabilidade não especificada.
- Campos ausentes não podem ser preenchidos por convenção matemática ou pseudocódigo novo.
- As 17 variáveis podem não possuir correspondência explícita nas três fontes primárias.
- Classes com fronteiras decimais podem depender de precisão/arredondamento ausentes.
- Qualquer mudança inesperada em `docs/raw/` bloqueia a execução.
- `PD-002` bloqueia futura normatização, mas não a auditoria documental.

## Método de comparação e classificação

1. Numerar linhas das sete fontes autorizadas sem alterar arquivos.
2. Extrair expressões e regras literalmente, mantendo fonte e localizador em cada registro.
3. Separar nível de variável, dimensão, índice, classe, diagnóstico e recomendação.
4. Registrar campos ausentes como `não especificado`, sem completar por convenção.
5. Classificar correspondências como explícitas, parciais, inferidas, ausentes ou ambíguas.
6. Calcular apenas consequências matemáticas das fórmulas documentadas; rotular cada derivação como `INFERENCIA`.
7. Aplicar `CONFLITO_DOCUMENTAL` somente quando os quatro critérios estritos forem satisfeitos.
8. Distinguir formulação geral, calibração regional e proposta futura sem presumir substituição ou ordem cronológica.
9. Reconstruir apenas o fluxo operacional declarado, sem pseudocódigo normativo.
10. Registrar perguntas sem respondê-las e candidatos futuros sem alterar a matriz ou as pendências.

## Etapas e critérios de conclusão

| Etapa | Estado | Critério |
|---|---|---|
| Inspecionar estado inicial e preflight | Concluída | Governança, transições, registro, matriz, pendências e baseline conferidos. |
| Corrigir e concluir a Etapa 4 | Concluída | Correção, aprovação analítica, movimento e checksums registrados. |
| Ler o corpus autorizado | Concluída | Três fontes primárias integrais e quatro fontes auxiliares nas seções pertinentes, com localizadores. |
| Inventariar contratos e fluxo | Concluída | 16 fórmulas, 17 variáveis, quatro dimensões, 13 parâmetros, 21 passos e 12 tipos de saída registrados. |
| Executar testes matemáticos | Concluída | 32 casos executados; resultados e comportamentos indefinidos classificados. |
| Registrar achados e perguntas | Concluída | 20 achados, 18 perguntas e rastreabilidade `E5-001` a `E5-010` completos, sem decisão científica. |
| Atualizar o registro documental | Concluída | Transições e `DOC-010`/`DOC-PLAN-004` registrados em correspondência 28/28. |
| Verificar e encaminhar à revisão | Concluída | Verificações aplicáveis registradas; plano em `AGUARDANDO_REVISAO`, relatório em `EM_REVISAO`. |

## Verificações previstas

- Comparar estado final com o inicial e conferir o escopo Git autorizado.
- Recalcular e confrontar 13 caminhos, tipos, tamanhos, permissões, `mtime` e SHA-256 de `docs/raw/`; exigir diff vazio.
- Executar `git diff --check` e verificação equivalente nos arquivos novos.
- Revisar integralmente o diff e validar links Markdown locais.
- Conferir correspondência das duas tabelas do registro documental.
- Validar unicidade e sequência de todos os namespaces criados.
- Confirmar existência de todas as referências documentais e científicas.
- Conferir contagens, fontes/localizadores de fórmulas e passos algorítmicos e rótulos de inferência.
- Confirmar que nenhuma fórmula foi declarada oficial, `PD-002` permanece aberta e nenhuma fonte externa foi usada.
- Procurar segredos, credenciais e dados pessoais desnecessários.
- Executar lint Markdown somente se já configurado, sem instalar dependências.

## Resultados quantitativos

- Fontes primárias lidas integralmente: 3, totalizando 777 linhas físicas.
- Fontes auxiliares consultadas nas seções pertinentes: 4.
- Símbolos/termos: 20; fórmulas: 16; variáveis confrontadas: 17; entradas adicionais: 7.
- Dimensões: 4; parâmetros/ajustes regionais: 13; passos algorítmicos: 21; tipos de saída: 12.
- Testes documentais e matemáticos: 32.
- Achados: 20 — 3 alinhamentos, 4 divergências, 2 conflitos, 6 ambiguidades, 4 lacunas e 1 pendência de validação.
- Impactos: 9 bloqueantes para normatização, 5 altos, 3 médios, 0 baixos e 3 informativos.
- Estados: 7 abertos, 8 aguardando validação científica, 2 encaminhados a etapa posterior e 3 informativos.
- Perguntas: 18; encaminhamentos da Etapa 4 cobertos: 10/10.

## Achados, bloqueios e desvios

- Conflitos documentais estritos: `MATH-FND-005` (clamp versus bloqueio) e `MATH-FND-006` (`data_quality` high versus medium para 4/5 essenciais).
- Divergência/ambiguidade de pesos: formulações gerais equivalentes versus formulação regional diferencial, sem escolha nem relação normativa presumida.
- Bloqueios de execução: nenhum.
- Bloqueio para futura normatização: nove achados e `PD-002`; não impede a conclusão documental.
- Alterações preexistentes: nenhuma no estado inicial.
- Desvio instrumental: `rg` indisponível; substituído por `grep`, `awk`, `sed`, `find` e utilitários existentes.
- Desvio de cálculo sem impacto: a primeira invocação efêmera de Node.js teve erro de sintaxe, não alterou arquivos e foi repetida corretamente; nenhum script foi preservado.

## Verificações executadas

| Verificação | Método | Resultado |
|---|---|---|
| Estado inicial e preflight | `git status --short`, `git rev-parse HEAD`, `git branch --show-current`, leitura integral de governança e planos | Aprovada; árvore inicialmente limpa, commit/branch registrados e nenhum bloqueio material. |
| Matriz e pendências | `grep`, `awk` e leitura controlada | Aprovada; 13 nós, 16 relações, 10 lacunas, 13/13, `GAP-008` opcional, Figma não bloqueante e `PD-017` aberta. |
| Encerramento da Etapa 4 | Estado/caminhos, revisão conceitual e `sha256sum` | Aprovada; plano `CONCLUIDO`/arquivado e relatório analítico `CANONICO_ATUAL`; checksums coincidentes com o registro. |
| Corpus autorizado | `nl -ba` e `wc -l` | Aprovada; 002/010/013 lidas integralmente (777 linhas físicas) e 007/008/009/011 consultadas nas seções pertinentes. |
| Cálculos | Comando efêmero `node -e`, revisado após erro de sintaxe inicial | Aprovada; somas, equivalência, cenário, extremos, clamp e lacunas de classe reproduzidos; nenhum arquivo temporário. |
| Namespaces e contagens | Extração seccional por `awk`/Node.js e comparação com sequências esperadas | Aprovada; `FORM-001`–`016`, `REG-PAR-001`–`013`, `ALG-STEP-001`–`021`, `MATH-TEST-001`–`032`, `MATH-FND-001`–`020` e `MATH-Q-001`–`018` únicos e completos. |
| Fórmulas e passos | Verificação das linhas de catálogo | Aprovada; 16/16 fórmulas e 21/21 passos possuem fonte e localizador. |
| Referências | Extração e confronto com registro, relatório da Etapa 4 e pendências | Aprovada; todas as referências `DOC-RAW`, `SCI-FND`, `SCI-Q`, `E5`, `PD` e `VAR` existem. |
| Contagens dos achados | Análise por colunas | Aprovada; tipos, impactos e estados coincidem com as três sínteses e totalizam 20. |
| Registro documental | Comparação independente das duas tabelas e teste dos caminhos | Aprovada; correspondência 28/28, sem ID duplicado e 28 caminhos existentes. |
| Links locais | Extração de links Markdown e resolução relativa por arquivo | Aprovada; nenhum destino ausente. |
| Integridade de `docs/raw/` | Confronto automatizado com `DOC-PLAN-001` por caminho, tipo, bytes, permissões, `mtime` e SHA-256; `git diff -- docs/raw` | Aprovada; 13/13 idênticos e diff vazio. |
| Escopo Git | `git status --short --untracked-files=all`, comparação com lista autorizada | Aprovada; somente os cinco destinos finais autorizados e a origem removida do movimento aparecem. |
| Whitespace | `git diff --check` e `git diff --no-index --check` nos dois arquivos novos | Aprovada; nenhuma mensagem de erro. O código 1 de `--no-index` indica existência de diff, não erro de whitespace. |
| Autoridade e fonte | Busca por “oficial”, revisão das classificações, `PD-002` e declaração de corpus | Aprovada; nenhuma fórmula declarada oficial, `PD-002` aberta e nenhuma fonte externa usada. |
| Segurança | Busca por padrões de segredo/credencial e revisão dos dados registrados | Aprovada; nenhum segredo, credencial ou dado pessoal desnecessário localizado. |
| Lint Markdown | Busca por configuração já existente | Não executada; nenhuma configuração de Markdown lint foi encontrada e nenhuma dependência foi instalada. |
| Diff integral | `git diff --find-renames`, diffs `--no-index` dos novos arquivos e revisão do conteúdo final | Aprovada; histórico preservado, movimento autorizado e nenhuma área proibida alterada. |

## Histórico de estados

| Data | Estado | Evento e evidência |
|---|---|---|
| 2026-08-25 | `EM_ANDAMENTO` | Plano criado após preflight aprovado, confirmação 13/13 do baseline, correção conceitual e encerramento administrativo da Etapa 4. Leitura integral das três fontes primárias iniciada. |
| 2026-08-26 | `AGUARDANDO_REVISAO` | Auditoria documental concluída com inventários, 32 testes, 20 achados, 18 perguntas e cobertura `E5-001` a `E5-010`; registro 28/28 e verificações aplicáveis aprovadas. O relatório permanece `EM_REVISAO`, sem validação científica, escolha normativa, consulta externa, comparação com código ou início da Etapa 6. |

## Ponto de parada

Este plano permanece ativo em `AGUARDANDO_REVISAO` e o relatório `DOC-010` permanece em `EM_REVISAO`. A Etapa 5 alcançou seu ponto de parada documental antes da Etapa 6. Nenhuma conclusão científica, escolha normativa, atualização da matriz ou comparação com implementação foi realizada.
