# Rastreabilidade global inicial

## Identificação e estado

- **Identificador:** `DOC-PLAN-002`
- **Título:** Rastreabilidade global inicial
- **Estado atual:** `AGUARDANDO_REVISAO`
- **Data:** 2026-08-24
- **Responsável:** não especificado

## Objetivo e resultado esperado

Formalizar o encerramento aprovado da Etapa 2 e criar uma matriz global inicial de rastreabilidade no nível de documentos e camadas para os 13 arquivos históricos de `docs/raw/`. O resultado esperado é `docs/governance/TRACEABILITY_MATRIX.md` em revisão, com nós documentais, relações explicitamente declaradas separadas de inferências estruturais, cobertura descritiva, alocação primária nas auditorias futuras, lacunas preliminares e ponto de entrada para artefatos futuros do Figma.

O resultado não valida conteúdo científico, requisitos, UX, dados ou arquitetura; não estabelece vigência, não resolve possíveis divergências e não substitui as fontes históricas.

## Escopo

- Encerrar, arquivar e registrar o plano aprovado da Etapa 2.
- Criar e manter este plano da Etapa 3.
- Ler controladamente títulos, cabeçalhos, sumários, escopo, finalidade, entradas, saídas, referências, dependências e nomes de artefatos dos 13 arquivos de `docs/raw/`.
- Criar os 13 nós documentais e relações nos tipos autorizados.
- Descrever cobertura por camada e alocar cada documento exatamente uma vez nas futuras Etapas 4 a 7, conforme divisão aprovada.
- Registrar lacunas preliminares e vinculá-las às pendências existentes sem duplicá-las.
- Preparar a entrada futura de artefatos do Figma sem criar artefatos ou identificadores fictícios.
- Atualizar somente os artefatos expressamente autorizados.

## Fora de escopo

- Auditoria aprofundada das camadas ou do mérito dos documentos.
- Extração individual de requisitos, fórmulas, variáveis, regras ou decisões.
- Avaliação de correção, consistência matemática, completude ou qualidade.
- Reconstrução do domínio, avaliação de wireframes ou telas e auditoria do Figma.
- Comparação com código, schemas, migrations, configurações ou testes.
- Declaração ou resolução de conflitos, escolha de fonte correta ou estabelecimento de vigência normativa.
- Alteração de `docs/raw/`, de documentos normativos, científicos, técnicos, funcionais ou de produto.
- Criação de ADR ou PRD e início das Etapas 4 a 8.

## Fontes e autoridade

| Assunto | Fonte | Autoridade e limite nesta etapa |
|---|---|---|
| Execução | Solicitação aprovada da Etapa 3 e `AGENTS.md` | Governam a execução corrente dentro do escopo autorizado. |
| Planejamento | `PLANS.md` | Define estrutura, estados, validação, preservação de histórico e ponto de parada. |
| Classificação e autoridade | `docs/governance/SOURCE_AUTHORITY.md` | Define autoridade por assunto, classificações e protocolo; não autoriza conclusão semântica. |
| Identidade documental | `docs/governance/DOCUMENT_REGISTER.md` | Registro canônico de IDs, caminhos, metadados e estados; não confere autoridade normativa às fontes históricas. |
| Pendências existentes | `docs/governance/PENDING_DECISIONS.md` | Fonte dos identificadores `PD-001` a `PD-017`; não resolve as pendências. |
| Decisões e alternativas técnicas | `TECH_DECISIONS.md` | Usado apenas para reconhecer registros existentes e evitar converter propostas em decisões. |
| Relações explícitas | Declarações localizáveis nos 13 arquivos de `docs/raw/` | `FATO_DOCUMENTADO` somente para a ligação declarada; não valida mérito, vigência ou conteúdo relacionado. |
| Relações estruturais e temáticas | Título, função, camada ou estrutura documental observada | `INFERENCIA`, sempre pendente de confirmação na auditoria futura. |
| Alocação primária | Divisão aprovada na solicitação da Etapa 3 | Organiza o trabalho futuro; não concede autoridade normativa. |

Ausências usam `NAO_ESPECIFICADO` ou `não especificado`, conforme o campo. `PENDENCIA_DE_DECISAO` é reservada a pontos que dependam da equipe, e `RECOMENDACAO` não será apresentada como decisão.

## Estado inicial

- `git status --short`:

  ```text
   M docs/governance/DOCUMENT_REGISTER.md
   M docs/plans/active/inventario-e-baseline-de-docs-raw.md
  ```

- Commit (`git rev-parse HEAD`): `6b71b420973b423875cd9030f203a13ca50aeffb`.
- Branch (`git branch --show-current`): `development`.
- Alterações modificadas ou não rastreadas: duas modificações rastreadas; nenhum item não rastreado.
- Alterações preexistentes: correção da observação de `DOC-004` em `DOCUMENT_REGISTER.md` e nova entrada histórica de revisão humana no plano da Etapa 2. Ambas foram inspecionadas, são compatíveis com o encerramento autorizado e devem ser preservadas.
- Plano da Etapa 2: `docs/plans/active/inventario-e-baseline-de-docs-raw.md`, estado `AGUARDANDO_REVISAO` no início desta etapa.
- `docs/plans/completed/`: ausente no início desta etapa.
- Registro documental: 22 identificadores em cada uma das duas tabelas complementares, com correspondência 22/22.
- Próximos IDs: `DOC-008` e `DOC-PLAN-002` confirmados como livres antes da edição.
- `docs/raw/`: 13 itens, todos arquivos regulares Markdown; os 13 caminhos registrados como `DOC-RAW-002` a `DOC-RAW-014` estavam presentes.
- Integridade inicial: 13/13 SHA-256 coincidentes com o baseline aprovado; caminhos, tipos, tamanhos, permissões e timestamps de modificação também coincidentes.
- Diff inicial de `docs/raw/`: vazio.

### Transição da Etapa 2 confirmada antes da matriz

- Plano marcado `CONCLUIDO`, com aprovação humana e novo evento histórico registrados.
- Arquivado em `docs/plans/completed/inventario-e-baseline-de-docs-raw.md`.
- `DOC-PLAN-001` atualizado para `ARQUIVADO`, sem relação de substituição.
- SHA-256 final do plano arquivado: `c4082a62338ae6f4309f46e193cb80c62a4db77e9203e9426b169b756796c8a0`, conferido contra o registro.
- Baseline e resultados da Etapa 2 preservados.

## Arquivos afetados

| Ação autorizada | Caminho | Finalidade |
|---|---|---|
| Mover e concluir | `docs/plans/completed/inventario-e-baseline-de-docs-raw.md` | Preservar como registro histórico a Etapa 2 aprovada. |
| Criar e manter | `docs/plans/active/rastreabilidade-global-inicial.md` | Planejar, registrar evidências e encaminhar a Etapa 3 para revisão. |
| Criar | `docs/governance/TRACEABILITY_MATRIX.md` | Registrar a matriz documental global inicial. |
| Alterar | `docs/governance/DOCUMENT_REGISTER.md` | Registrar o arquivamento, a matriz e o novo plano nas duas tabelas complementares. |

Nenhum outro caminho será criado, movido ou alterado.

## Método de leitura controlada

1. Partir de IDs, títulos, caminhos, categorias e camadas registrados em `DOCUMENT_REGISTER.md`.
2. Para cada fonte histórica, enumerar títulos e cabeçalhos e pesquisar somente termos de escopo, finalidade, entrada, saída, referência, dependência, integração, rastreabilidade e nomes dos demais documentos ou artefatos.
3. Abrir apenas trechos adicionais necessários para confirmar a declaração e seu localizador.
4. Parar quando a relação estiver confirmada ou quando a busca restrita não localizar evidência.
5. Não resumir conteúdo substantivo nem avaliar regras, fórmulas, requisitos ou alternativas técnicas.
6. Não consultar código nem qualquer área proibida.

`rg` foi confirmado como indisponível; serão usados `grep`, `awk`, `sed`, `find` e utilitários já existentes, sem instalar dependências.

## Método de classificação das relações

- Relações declaradas e localizáveis recebem `FATO_DOCUMENTADO` e `VERIFICADA_NA_FONTE`, usando somente `REFERENCIA_EXPLICITA`, `DEPENDENCIA_EXPLICITA` ou `ENTRADA_SAIDA_EXPLICITA`.
- Relações derivadas apenas de função, camada, título ou estrutura recebem `INFERENCIA` e `PRELIMINAR_PENDENTE_DE_AUDITORIA`, usando somente `RELACAO_ESTRUTURAL_PRELIMINAR` ou `SOBREPOSICAO_TEMATICA_PRELIMINAR`.
- `NAO_ESTABELECIDA` será usado apenas quando uma ausência relevante tiver sido verificada nesta leitura controlada.
- Proximidade temática, nomes semelhantes, sequência lógica, detalhamento, backlog, wireframe ou especificação não comprovam dependência, substituição, aprovação ou vigência.
- Não serão criadas relações inversas duplicadas nem tipos que afirmem conflito, correção, superação ou atualidade.

## Etapas e critérios de conclusão

| Etapa | Estado | Critério de conclusão |
|---|---|---|
| Registrar e validar estado inicial | Concluída | Git, plano anterior, diretórios, IDs, fontes e baseline conferidos. |
| Encerrar e arquivar a Etapa 2 | Concluída | Plano `CONCLUIDO`, aprovação registrada, arquivo movido e `DOC-PLAN-001` atualizado com checksum válido. |
| Fazer leitura estrutural controlada | Concluída | Declarações documentais pesquisadas sem auditoria substantiva. |
| Criar a matriz inicial | Concluída | Nós, relações, cobertura, alocação, lacunas e entrada do Figma registrados. |
| Atualizar o registro documental | Concluída | `DOC-008` e `DOC-PLAN-002` presentes uma vez em cada tabela, com estados corretos. |
| Validar e encaminhar para revisão | Concluída | Verificações aplicáveis aprovadas; plano em `AGUARDANDO_REVISAO` e matriz em `EM_REVISAO`. |

Responsável pela execução: agente mantenedor. Revisão e aprovação: equipe; responsáveis individuais não especificados.

## Riscos e limitações

- Uma expressão semelhante ao título de outro documento pode nomear um conceito, seção ou artefato diferente; toda relação explícita exige confirmação contextual e localizador.
- Ausência em busca controlada não prova inexistência semântica, conflito ou necessidade normativa.
- Relações inferidas podem mudar após auditoria aprofundada; permanecem preliminares.
- A alocação aprovada organiza auditorias e não valida a classificação ou o conteúdo dos documentos.
- A matriz não incorpora artefatos do Figma ainda não apresentados e não cria nós fictícios.
- Leitura pode atualizar `atime`; ele não integra o baseline aprovado. Caminhos, tipos, tamanhos, permissões, mtimes e checksums integram a verificação.
- Alteração inesperada em `docs/raw/` constitui bloqueio imediato.

## Verificações previstas

- Conferir o encerramento e checksum de `DOC-PLAN-001`.
- Conferir estados e localizações de `DOC-PLAN-002` e `DOC-008`.
- Contar 13 nós e alocação primária 13/13 sem duplicidade.
- Validar tipos, classificações, estados e localizadores das relações.
- Validar unicidade de `TR-NNN` e `GAP-NNN`.
- Validar existência de todos os `DOC-RAW-NNN` e `PD-NNN` referenciados.
- Conferir correspondência integral entre as duas tabelas do registro.
- Recalcular os 13 checksums contra o baseline, sem substituir o histórico.
- Revalidar caminhos, tipos, tamanhos, permissões e mtimes de `docs/raw/` e seu diff vazio.
- Validar links Markdown locais, termos proibidos no sentido declarativo e ausência de conteúdo sensível.
- Executar `git diff --check`, detectar lint Markdown já configurado e revisar o diff completo e o escopo.

## Resultados quantitativos

- Fontes históricas alvo e representadas: 13/13.
- Nós documentais: 13, de `DOC-RAW-002` a `DOC-RAW-014`.
- Relações totais: 16.
- Relações por tipo: 1 `REFERENCIA_EXPLICITA`, 1 `DEPENDENCIA_EXPLICITA`, 0 `ENTRADA_SAIDA_EXPLICITA`, 10 `RELACAO_ESTRUTURAL_PRELIMINAR` e 4 `SOBREPOSICAO_TEMATICA_PRELIMINAR`.
- Relações por classificação e estado: 2 `FATO_DOCUMENTADO` / `VERIFICADA_NA_FONTE` e 14 `INFERENCIA` / `PRELIMINAR_PENDENTE_DE_AUDITORIA`; 0 `NAO_ESTABELECIDA`.
- Lacunas totais: 10.
- Lacunas por tipo: 1 `METADADO_AUSENTE`, 6 `AUTORIDADE_PENDENTE`, 1 `RELACAO_NAO_DECLARADA`, 1 `ENTRADA_EXTERNA_PENDENTE` e 1 `DESTINO_NORMATIVO_NAO_DEFINIDO`.
- Lacunas por estado: 2 `AGUARDANDO_AUDITORIA`, 7 `VINCULADA_A_PENDENCIA`, 1 `AGUARDANDO_ENTRADA_EXTERNA` e 0 `PRELIMINAR`.
- Alocação primária: 13/13 documentos, 13 identificadores únicos, sem omissão ou duplicidade; Etapa 4 com 4, Etapa 5 com 3, Etapa 6 com 2 e Etapa 7 com 4.
- Registro documental final: 24 identificadores em cada tabela complementar, com correspondência 24/24.

## Lacunas preliminares

- `GAP-001`: metadados ausentes no baseline dos 13 documentos.
- `GAP-002` a `GAP-006`: autoridades pendentes nas camadas científica, produto, dados, UX e arquitetura, vinculadas às entradas existentes aplicáveis.
- `GAP-007`: apenas duas ligações nomeadas foram localizadas; as outras 14 relações permanecem inferenciais e aguardam auditoria.
- `GAP-008`: entrada externa do Figma pendente, vinculada a `PD-005` e `PD-017`.
- `GAP-009`: destinos normativos futuros não especificados para todos os assuntos, vinculados a `PD-002` a `PD-006`.
- `GAP-010`: autoridade sobre o escopo institucional pendente, vinculada a `PD-001`, sem impedir o levantamento exploratório das camadas.
- Cobertura institucional: acrescentada sem atribuir nenhum dos 13 nós como documento institucional aprovado; encaminhamento para a consolidação transversal da Etapa 8 ou para momento anterior a qualquer atualização normativa dependente do escopo.
- Candidatas novas a `PENDING_DECISIONS.md`: nenhuma claramente distinta de `PD-001` a `PD-017` foi identificada no escopo restrito; o registro vivo não foi alterado.

## Verificações executadas

| Verificação | Método | Resultado |
|---|---|---|
| Estado inicial e IDs livres | `git status --short`, `git rev-parse HEAD`, `git branch --show-current`, contagem e comparação por `awk`, `sort` e `cmp` | Aprovada; commit e branch registrados, duas modificações preexistentes preservadas, 22/22 IDs iniciais e `DOC-008`/`DOC-PLAN-002` livres. |
| Encerramento da Etapa 2 | Testes de caminho e estado, `grep`, `sha256sum` e confronto com `DOC-PLAN-001` | Aprovada; origem ativa ausente, arquivo arquivado `CONCLUIDO`, aprovação registrada, estado `ARQUIVADO` e checksum coincidente. |
| Leitura estrutural controlada | Enumeração de cabeçalhos e buscas direcionadas com `grep`; trechos mínimos com `sed` | Aprovada; 13 documentos percorridos, duas relações explícitas localizadas e nenhuma auditoria substantiva iniciada. |
| Estrutura e classificação da matriz | Contagem seccional e validação por colunas com `awk` | Aprovada; 13 nós, 16 relações e 10 lacunas; somente tipos, classificações e estados permitidos. |
| Unicidade e referências | Extração, ordenação, `comm`, `sort -u` e confronto com os registros canônicos | Aprovada; 16 IDs `TR-NNN` e 10 IDs `GAP-NNN` únicos; referências `DOC-RAW-NNN` e `PD-NNN` existentes. |
| Alocação primária | Extração dos IDs da tabela e comparação com a sequência esperada | Aprovada; 13/13, todos únicos e alocados uma vez. |
| Registro documental | Extração independente das duas tabelas e `cmp` | Aprovada; correspondência 24/24; matriz e plano registrados como `EM_REVISAO`. |
| Integridade final de `docs/raw/` | `find`, `stat`, `sha256sum -c` contra o baseline arquivado e `git diff -- docs/raw` | Aprovada; 13/13 caminhos, tipos, tamanhos, permissões, mtimes e SHA-256 coincidentes; diff vazio. |
| Entrada do Figma e limites | Busca dos cinco estados, de `PD-017`, da proibição de nó fictício e de SHA-256 na matriz | Aprovada; entrada futura registrada, nenhum artefato inventado e nenhum checksum do baseline duplicado na matriz. |
| Links Markdown locais | Extração de destinos e teste de existência relativo a cada arquivo | Aprovada; todos os destinos locais resolvem. |
| Escopo de arquivos | `git status --short --untracked-files=all`, normalização e comparação com os cinco caminhos autorizados | Aprovada; somente os artefatos autorizados aparecem no estado final. |
| Whitespace | `git diff --check` | Aprovada; nenhum erro reportado. |
| Lint de Markdown | Busca nominal por configuração existente, sem ler configurações proibidas nem instalar ferramenta | Não executada; nenhuma configuração de Markdown lint foi encontrada. |
| Diff completo, terminologia e conteúdo sensível | Revisão final dos diffs e dos novos arquivos no estado definitivo | Aprovada; alterações preexistentes preservadas, classificações e limites coerentes, sem segredo, credencial ou dado pessoal desnecessário. |

## Bloqueios e desvios

- Bloqueios materiais: nenhum.
- Desvio instrumental: `rg` indisponível, substituído por ferramentas existentes conforme autorizado.
- Desvio de verificação sem impacto: a primeira comparação de escopo usou a saída condensada do Git para o diretório novo `docs/plans/completed/` e produziu falso negativo; a repetição com `--untracked-files=all` enumerou o arquivo e aprovou exatamente os cinco caminhos autorizados.

## Histórico de estados

| Data | Estado | Evento e evidência |
|---|---|---|
| 2026-08-24 | `EM_ANDAMENTO` | Plano criado após a validação do estado inicial e a transição confirmada da Etapa 2; leitura estrutural controlada pendente. |
| 2026-08-24 | `AGUARDANDO_REVISAO` | Matriz criada com 13 nós, relações explícitas separadas de inferências, alocação 13/13, lacunas e entrada futura do Figma; registro atualizado e verificações aplicáveis aprovadas. |
| 2026-08-24 | `AGUARDANDO_REVISAO` | Revisão humana aprovou os 13 nós, as 16 relações e a alocação 13/13; identificou a omissão de `PD-001` na cobertura e nas lacunas e determinou a inclusão de `GAP-010`, sem iniciar nova auditoria. |

## Ponto de parada

Este plano permanece em `AGUARDANDO_REVISAO` em `docs/plans/active/`, e a matriz permanece em `EM_REVISAO`. Nenhuma Etapa 4 será iniciada sem revisão e aprovação da equipe.
