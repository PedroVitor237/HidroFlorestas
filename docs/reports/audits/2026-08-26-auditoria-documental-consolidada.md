# Auditoria documental consolidada das Etapas 4 a 7

## Identificação, estado e limites

- **Identificador documental:** `DOC-013`
- **Data:** 2026-08-26
- **Estado:** `CANONICO_ATUAL`, exclusivamente como análise documental consolidada aprovada
- **Plano:** [`DOC-PLAN-007`](../../plans/completed/consolidacao-auditoria-documental.md)
- **Natureza:** consolidação analítica e controle de rastreabilidade
- **Revisão humana:** aprovada pela equipe na solicitação da Etapa 9, em 2026-08-28
- **Autoridade normativa:** nenhuma sobre ciência, produto, domínio, UX, dados, arquitetura ou implementação

Este relatório consolida as auditorias `DOC-009`, `DOC-010`, `DOC-011` e `DOC-012`. Sua autoridade limita-se ao método, à cobertura, aos agrupamentos e às limitações aqui registrados. Ele não escolhe alternativas, não valida ciência, não aprova requisitos ou wireframes, não define domínio, dados ou arquitetura, não compara documentação com implementação e não inicia a Etapa 9.

Classificações normativas e analíticas seguem [`SOURCE_AUTHORITY.md`](../../governance/SOURCE_AUTHORITY.md). Toda avaliação de prontidão é `INFERENCIA`; toda ordem de tratamento é `RECOMENDACAO`. Não foi produzida `EVIDENCIA_IMPLEMENTACAO`.

## Corpus, método e baseline

As fontes analíticas primárias são os quatro relatórios por camada; os planos correspondentes, `DOCUMENT_REGISTER.md`, `PENDING_DECISIONS.md`, `TRACEABILITY_MATRIX.md` e `TECH_DECISIONS.md` foram usados somente como controles. Não houve releitura de conteúdo de `docs/raw/`, consulta externa, inspeção de código, schema, migration, teste, configuração, banco, deploy ou execução da aplicação.

Cada achado e pergunta de origem recebeu exatamente um vínculo primário. Agrupamentos exigiram o mesmo problema material, autoridade e decisão essencial; semelhança lexical isolada não foi suficiente. Facetas relacionadas, mas independentes, permaneceram separadas. Os localizadores compactos deste relatório apontam para a seção e o ID nos relatórios aprovados, onde permanecem os localizadores completos das fontes históricas.

| Auditoria | Relatório | Achados | Perguntas | Ocorrências bloqueantes para normatização |
|---|---|---:|---:|---:|
| Etapa 4 — ciência fundamental | `DOC-009` | 20 | 12 | 8 |
| Etapa 5 — matemática, calibração e algoritmo | `DOC-010` | 20 | 18 | 9 |
| Etapa 6 — produto, domínio e UX | `DOC-011` | 22 | 28 | 9 |
| Etapa 7 — dados, arquitetura e execução histórica | `DOC-012` | 31 | 30 | 15 |
| **Total bruto confirmado** | **quatro relatórios** | **93** | **88** | **41** |

As 41 ocorrências são linhas bloqueantes nos relatórios de origem; após deduplicação, correspondem a 26 problemas bloqueantes únicos. Nenhum bloqueio de execução da Etapa 8 foi encontrado.

## Catálogo mestre de problemas consolidados

### Convenções do catálogo

- A camada principal serve apenas para distribuição e não elimina as camadas afetadas.
- A classificação de um agrupamento preserva as classificações de origem; quando há mais de uma, a combinação é declarada.
- `BLOQUEANTE_PARA_NORMATIZACAO` nunca significa bloqueio desta auditoria.
- Os dois conflitos estritos da Etapa 5 permanecem autônomos em `CON-FND-012` e `CON-FND-014`.

### Identidade, conteúdo e origens

| ID | Título | Camada principal | Camadas afetadas | Tipo consolidado | Classificação | Descrição neutra | Achados de origem |
|---|---|---|---|---|---|---|---|
| `CON-FND-001` | Estrutura científica central | Ciência fundamental | Ciência | `ALINHAMENTO_DOCUMENTAL` | `FATO_DOCUMENTADO` + `INFERENCIA` transversal | Quatro dimensões e relações ecológicas centrais apresentam alinhamento histórico, sem validação científica. | `SCI-FND-001`, `SCI-FND-016` |
| `CON-FND-002` | Cadeia documental do núcleo de variáveis | Contrato matemático | Ciência, algoritmo, dados | `ALINHAMENTO_DOCUMENTAL` | `FATO_DOCUMENTADO` + `INFERENCIA` | Há correspondência parcial crescente entre variáveis, contrato, algoritmo e campos; os escopos numéricos diferem e não provam dependência normativa. | `SCI-FND-002`, `MATH-FND-001`, `DAE-FND-013` |
| `CON-FND-003` | Fórmula, pesos e relação geral–regional | Contrato matemático | Ciência, algoritmo, dados | `DIVERGENCIA_DOCUMENTAL` | `FATO_DOCUMENTADO` + `INFERENCIA` | Formulações gerais equivalentes coexistem com pesos regionais e relação de aplicabilidade não definida. | `SCI-FND-011`, `MATH-FND-002`, `MATH-FND-003`, `MATH-FND-004`, `DAE-FND-019` |
| `CON-FND-004` | Composição territorial e densidade de drenagem | Ciência fundamental | Ciência, algoritmo, dados | `DIVERGENCIA_DOCUMENTAL` | `FATO_DOCUMENTADO` | Componentes territoriais não estão reconciliados e a cadeia de densidade de drenagem não alcança de forma consistente a entrada algorítmica. | `SCI-FND-003`, `MATH-FND-008`, `DAE-FND-014` |
| `CON-FND-005` | Cobertura protocolar de variáveis | Protocolo de campo | Ciência, campo, dados | `LACUNA` | `NAO_ESPECIFICADO` | Cinco variáveis do conjunto científico não possuem procedimento localizado no protocolo auditado. | `SCI-FND-004` |
| `CON-FND-006` | APP e mata ciliar | Ciência fundamental | Ciência, campo, algoritmo | `DIVERGENCIA_DOCUMENTAL` | `FATO_DOCUMENTADO` | Conceito, cardinalidade e pontuação variam entre presença binária, três estados e recorte regional. | `SCI-FND-005`, `MATH-FND-014` |
| `CON-FND-007` | Papéis distintos de solo exposto | Ciência fundamental | Ciência, campo, matemática | `AMBIGUIDADE` | `FATO_DOCUMENTADO` | O termo ocorre como percentual pedológico e categoria territorial sem equivalência declarada. | `SCI-FND-006` |
| `CON-FND-008` | Desenho amostral e agregação | Protocolo de campo | Campo, ciência, matemática | `LACUNA` | `NAO_ESPECIFICADO` | Seleção, repetição e agregação espacial das medições não estão determinadas. | `SCI-FND-007` |
| `CON-FND-009` | Métodos, instrumentos e precisão de campo | Protocolo de campo | Campo, ciência, qualidade | `LACUNA` | `NAO_ESPECIFICADO` | Métodos, instrumentos, alternativas e precisão são insuficientemente especificados. | `SCI-FND-008` |
| `CON-FND-010` | Temporalidade, missing, mínimos e conjunto vazio | Contrato matemático | Campo, ciência, algoritmo, dados | `LACUNA` | `FATO_DOCUMENTADO` + `NAO_ESPECIFICADO` + `INFERENCIA` | Periodicidade, impossibilidade de coleta, obrigatoriedade, denominadores e saída sem dimensão válida permanecem incompletos. | `SCI-FND-009`, `MATH-FND-007`, `MATH-FND-010` |
| `CON-FND-011` | Transformação e normalização das variáveis | Contrato matemático | Ciência, matemática, algoritmo | `DIVERGENCIA_DOCUMENTAL` | `FATO_DOCUMENTADO` | Os níveis e relações entre fórmulas 0–1, normalização de dimensões e classes não foram reconciliados. | `SCI-FND-010` |
| `CON-FND-012` | Clamp versus bloqueio | Algoritmo operacional | Ciência, matemática, algoritmo | `CONFLITO_DOCUMENTAL` | `FATO_DOCUMENTADO` + `INFERENCIA` | Contrato e algoritmo da mesma v0.1 prescrevem comportamentos incompatíveis para entradas fora da faixa, sem recorte conciliador. | `MATH-FND-005` |
| `CON-FND-013` | Validação de enum, tipo e unidade | Algoritmo operacional | Ciência, algoritmo, dados | `LACUNA` | `NAO_ESPECIFICADO` + `INFERENCIA` | Categorias desconhecidas, tipos inválidos, unidades, conversões e não finitos não têm regra completa. | `MATH-FND-009` |
| `CON-FND-014` | `data_quality` para 4/5 essenciais | Algoritmo operacional | Algoritmo, produto, dados | `CONFLITO_DOCUMENTAL` | `FATO_DOCUMENTADO` | Contrato e algoritmo da mesma v0.1 retornam classes incompatíveis para a mesma completude. | `MATH-FND-006` |
| `CON-FND-015` | Classes, precisão e arredondamento | Contrato matemático | Ciência, algoritmo, produto, dados | `AMBIGUIDADE` | `FATO_DOCUMENTADO` + `INFERENCIA` | Faixas descontínuas e ausência de política uniforme de precisão deixam valores limítrofes sem tratamento inequívoco. | `SCI-FND-012`, `MATH-FND-011`, `MATH-FND-015` |
| `CON-FND-016` | Território e aplicabilidade regional | Ciência fundamental | Institucional, ciência, algoritmo | `AMBIGUIDADE` | `FATO_DOCUMENTADO` + `NAO_ESPECIFICADO` | Limites operacionais e relação entre modelo geral e recorte do Baixo Itapecuru não estão definidos. | `SCI-FND-013`, `MATH-FND-013` |
| `CON-FND-017` | Escalas de aplicação | Ciência fundamental | Institucional, ciência, produto | `DIVERGENCIA_DOCUMENTAL` | `FATO_DOCUMENTADO` | Propriedade, assentamento, comunidade, microbacia, bacia e município aparecem em escopos não reconciliados. | `SCI-FND-014` |
| `CON-FND-018` | Léxico científico | Ciência fundamental | Ciência, produto, dados | `AMBIGUIDADE` | `INFERENCIA` | Termos científicos próximos não possuem equivalências aprovadas. | `SCI-FND-015` |
| `CON-FND-019` | Proveniência científica | Ciência fundamental | Ciência, governança | `LACUNA` | `NAO_ESPECIFICADO` | Origem, base científica, autoria e ciclo documental são incompletos nas fontes auditadas. | `SCI-FND-017` |
| `CON-FND-020` | Autoridade e validação científica | Governança institucional | Ciência, produto, dados, governança | `PENDENCIA_DE_AUTORIDADE` | `PENDENCIA_DE_DECISAO` | Não há autoridade designada nem validação registrada para promover regras científicas e dependências de produto. | `SCI-FND-018`, `MATH-FND-020`, `PROD-FND-020` |
| `CON-FND-021` | Encaminhamento analítico Etapa 4 → Etapa 5 | Governança institucional | Ciência, matemática, governança | `ALINHAMENTO_DOCUMENTAL` | `FATO_DOCUMENTADO` | O encaminhamento das questões matemáticas foi registrado e coberto; é marcador de proveniência, não regra normativa. | `SCI-FND-019` |
| `CON-FND-022` | Fatores conceituais sem variável/procedimento comparável | Ciência fundamental | Ciência, campo | `NAO_COMPARAVEL` | `FATO_DOCUMENTADO` + `NAO_ESPECIFICADO` | Clima/precipitação, evapotranspiração e resiliência não possuem contraparte comparável como variável/procedimento no recorte auditado. | `SCI-FND-020` |
| `CON-FND-023` | Evidência empírica da calibração regional | Contrato matemático | Ciência, matemática | `LACUNA` | `NAO_ESPECIFICADO` | Parâmetros regionais não registram dados, amostra, período, método, incerteza e validação suficientes. | `MATH-FND-012` |
| `CON-FND-024` | Contrato de saída e resultado insuficiente | Algoritmo operacional | Ciência, algoritmo, produto, dados | `DIVERGENCIA_DOCUMENTAL` | `FATO_DOCUMENTADO` + `INFERENCIA` | Nomes, campos obrigatórios e representação de resultado insuficiente não são uniformes. | `MATH-FND-016`, `DAE-FND-016` |
| `CON-FND-025` | Determinismo de drivers, textos e recomendações | Algoritmo operacional | Ciência, algoritmo, produto | `AMBIGUIDADE` | `FATO_DOCUMENTADO` + `NAO_ESPECIFICADO` | Seleção, desempate, ordenação e versionamento das saídas interpretativas são incompletos. | `MATH-FND-017` |
| `CON-FND-026` | Auditabilidade, reprodutibilidade e persistência do IHFR | Dados | Ciência, algoritmo, dados | `LACUNA` | `FATO_DOCUMENTADO` + `NAO_ESPECIFICADO` + `INFERENCIA` | A intenção de trilha existe, mas snapshot, proveniência, intermediários, scores, drivers e recomendações não fecham a cadeia reprodutível. | `MATH-FND-018`, `MATH-FND-019`, `DAE-FND-015` |
| `CON-FND-027` | Núcleo funcional histórico do MVP | Produto e requisitos | Produto, UX, dados | `ALINHAMENTO_DOCUMENTAL` | `FATO_DOCUMENTADO` | Fluxo principal, dashboard/mapa, coleta e resultado apresentam cobertura cruzada histórica, sem aprovação. | `PROD-FND-001`, `PROD-FND-002`, `PROD-FND-003`, `DAE-FND-001` |
| `CON-FND-028` | Campo Estado no cadastro | Produto e requisitos | Produto, UX, dados | `DIVERGENCIA_DOCUMENTAL` | `FATO_DOCUMENTADO` | O wireframe acrescenta Estado ao conjunto mínimo de cadastro; não há proibição incompatível. | `PROD-FND-004` |
| `CON-FND-029` | Fronteira entre MVP, telas e futuro | Produto e requisitos | Produto, UX, arquitetura, backlog | `AMBIGUIDADE` | `FATO_DOCUMENTADO` + `INFERENCIA` | Análise territorial, destinos de menu e itens condicionais não estão claramente posicionados no MVP ou futuro. | `PROD-FND-005`, `DAE-FND-005` |
| `CON-FND-030` | Identidade entre Área e propriedade | Domínio e permissões | Produto, domínio, dados | `AMBIGUIDADE` | `FATO_DOCUMENTADO` + `INFERENCIA` | Área e propriedade aparecem no mesmo contexto sem equivalência declarada. | `PROD-FND-006` |
| `CON-FND-031` | Taxonomia de papéis | Domínio e permissões | Produto, domínio, dados, UX | `DIVERGENCIA_DOCUMENTAL` | `FATO_DOCUMENTADO` | Taxonomias compostas e o papel `technician` não formam um conjunto normalizado. | `PROD-FND-007`, `DAE-FND-006` |
| `CON-FND-032` | Matriz de autorização | Domínio e permissões | Produto, UX, dados | `LACUNA` | `NAO_ESPECIFICADO` + `INFERENCIA` | Permissões gerais não são aplicadas às ações, objetos e telas. | `PROD-FND-008` |
| `CON-FND-033` | Conta, recuperação e onboarding | UX | Produto, UX, domínio | `LACUNA` | `FATO_DOCUMENTADO` + `NAO_ESPECIFICADO` | Rótulos de recuperação e criação de conta não possuem fluxo, regras, elegibilidade ou efeitos. | `PROD-FND-009` |
| `CON-FND-034` | Estados e qualidade transversal de UX | UX | Produto, UX | `LACUNA` | `NAO_ESPECIFICADO` | Validação, erro, confirmação, vazio, carregamento, responsividade e acessibilidade não estão especificados. | `PROD-FND-010`, `PROD-FND-011` |
| `CON-FND-035` | Critérios de aceitação | Produto e requisitos | Produto, UX, backlog | `LACUNA` | `FATO_DOCUMENTADO` + `NAO_ESPECIFICADO` | Critérios não cobrem de forma verificável autorização, exceções, validação, NFR e alternativas. | `PROD-FND-012`, `DAE-FND-003` |
| `CON-FND-036` | Requisitos não funcionais e segurança | Produto e requisitos | Produto, dados, arquitetura, UX | `LACUNA` | `FATO_DOCUMENTADO` + `NAO_ESPECIFICADO` | NFR são esparsos, não mensuráveis e sem mecanismos/metas suficientes de segurança e operação. | `PROD-FND-013`, `DAE-FND-026` |
| `CON-FND-037` | Offline e sincronização | Produto e requisitos | Produto, UX, dados, arquitetura | `AMBIGUIDADE` | `FATO_DOCUMENTADO` + `PROPOSTA` | O mínimo de não perder dados e a solução ideal de rascunho/sincronização não têm fronteira nem contrato. | `PROD-FND-014` |
| `CON-FND-038` | Propriedade, privacidade e isolamento | Domínio e permissões | Produto, domínio, dados, segurança | `LACUNA` | `NAO_ESPECIFICADO` | Ownership, isolamento, acesso e fronteiras entre usuários/áreas/organizações não estão aprovados. | `PROD-FND-015`, `DAE-FND-009` |
| `CON-FND-039` | IA contextual | Produto e requisitos | Produto, UX, dados | `PROPOSTA_NAO_APROVADA` | `PROPOSTA` | IA em mapa/recomendações não possui fluxo, supervisão, dados ou fase aprovados. | `PROD-FND-016` |
| `CON-FND-040` | Expansões geoespaciais e futuras | Produto e requisitos | Produto, dados, arquitetura, backlog | `PROPOSTA_NAO_APROVADA` | `FATO_DOCUMENTADO` sobre fase + `PROPOSTA` | Shapefile, camadas e outras expansões permanecem itens futuros ou propostas, não escopo aprovado. | `PROD-FND-017`, `DAE-FND-028` |
| `CON-FND-041` | Cardinalidades e restrições do domínio | Dados | Domínio, dados, produto | `LACUNA` | `NAO_ESPECIFICADO` + `INFERENCIA` | Propriedade, participação, PK/FK, unicidade, cardinalidades, cascatas e constraints não fecham o modelo. | `PROD-FND-018`, `DAE-FND-010` |
| `CON-FND-042` | Organização, laboratório e assinante | Domínio e permissões | Produto, domínio, dados | `LACUNA` | `NAO_ESPECIFICADO` | Conceitos canônicos e relações de organização, laboratório, assinante e membro não aparecem de modo comparável. | `PROD-FND-019`, `DAE-FND-008` |
| `CON-FND-043` | Designação transversal de autoridades | Governança institucional | Institucional, produto, UX, dados, arquitetura, ciência | `PENDENCIA_DE_AUTORIDADE` | `PENDENCIA_DE_DECISAO` | Autoridades necessárias para aprovação e destinos normativos não estão designadas. | `PROD-FND-021`, `DAE-FND-031` |
| `CON-FND-044` | Figma opcional e ausente | UX | UX, produto, governança | `NAO_COMPARAVEL` | `DECISAO_CONFIRMADA` para opcionalidade + `NAO_ESPECIFICADO` para ausência | Nenhum artefato concreto foi apresentado; a ausência é opcional e não bloqueante. | `PROD-FND-022` |
| `CON-FND-045` | Governança do backlog e roadmap | Backlog | Produto, backlog, arquitetura | `LACUNA` | `NAO_ESPECIFICADO` | Prioridade, estado, evidência, datas, responsáveis, riscos e gates não estão governados. | `DAE-FND-002`, `DAE-FND-027` |
| `CON-FND-046` | Cobertura backlog ↔ requisitos | Backlog | Produto, backlog | `DIVERGENCIA_DOCUMENTAL` | `INFERENCIA` | Há correspondências parciais e lacunas bidirecionais, sem derivação ou aprovação presumida. | `DAE-FND-004` |
| `CON-FND-047` | Núcleo nominal domínio ↔ dados | Dados | Domínio, dados | `ALINHAMENTO_DOCUMENTAL` | `FATO_DOCUMENTADO` | Conceitos centrais têm correspondência nominal, sem validar modelo lógico ou autoridade. | `DAE-FND-007` |
| `CON-FND-048` | Ciclo de vida e retenção | Dados | Produto, domínio, dados | `LACUNA` | `NAO_ESPECIFICADO` | Rascunho, recálculo, invalidação, arquivamento, exclusão e retenção não estão definidos. | `DAE-FND-011` |
| `CON-FND-049` | Contrato geoespacial | Dados | Dados, arquitetura, produto | `LACUNA` | `NAO_ESPECIFICADO` | CRS, precisão, validade e proveniência geoespacial não estão especificados. | `DAE-FND-012` |
| `CON-FND-050` | Versionamento de algoritmo, calibração e schema | Dados | Ciência, algoritmo, dados, arquitetura | `AMBIGUIDADE` | `FATO_DOCUMENTADO` | Vigência, migração, compatibilidade e regra de recálculo entre versões não estão governadas. | `DAE-FND-017` |
| `CON-FND-051` | Granularidade do modelo de persistência | Dados | Dados, arquitetura | `DIVERGENCIA_DOCUMENTAL` | `FATO_DOCUMENTADO` | Módulos separados e tabela ambiental única descrevem estruturas não reconciliadas. | `DAE-FND-018` |
| `CON-FND-052` | Responsabilidades do backend | Arquitetura | Arquitetura, algoritmo, integração | `DIVERGENCIA_DOCUMENTAL` | `INFERENCIA` | Responsabilidades entre Next.js, Python e FastAPI não estão delimitadas. | `DAE-FND-020` |
| `CON-FND-053` | PostgreSQL como intenção relatada | Arquitetura | Arquitetura, dados | `ALINHAMENTO_DOCUMENTAL` | `DECISAO_RELATADA_PENDENTE_DE_VERIFICACAO` | Fontes técnicas e registro decisório convergem em PostgreSQL; implementação não foi verificada. | `DAE-FND-021` |
| `CON-FND-054` | Prisma e Neon sem comparação documental | Arquitetura | Arquitetura, dados, implementação futura | `NAO_COMPARAVEL` | `DECISAO_RELATADA_PENDENTE_DE_VERIFICACAO` | Itens relatados no registro decisório não possuem contraparte nas fontes técnicas auditadas. | `DAE-FND-022` |
| `CON-FND-055` | Alternativas de mapas | Arquitetura | Arquitetura, produto, UX | `PROPOSTA_NAO_APROVADA` | `PROPOSTA` + `EM_AVALIACAO` | OpenStreetMap, Plotly e Leaflet permanecem alternativas sem composição aprovada. | `DAE-FND-023` |
| `CON-FND-056` | Contrato de API e integração | Arquitetura | Produto, dados, arquitetura | `LACUNA` | `NAO_ESPECIFICADO` | Rotas, payloads, erros, autenticação, versionamento e fronteira de integração não formam contrato canônico. | `DAE-FND-024` |
| `CON-FND-057` | Hospedagem atual e futura | Arquitetura | Arquitetura, operação | `AMBIGUIDADE` | `FATO_DOCUMENTADO` + `DECISAO_RELATADA_PENDENTE_DE_VERIFICACAO` | Relato de escolha atual e estratégia futura aparecem em contextos distintos sem política consolidada. | `DAE-FND-025` |
| `CON-FND-058` | Estado e alegações de implementação | Implementação futura | Todas as camadas técnicas | `ALEGACAO_DE_IMPLEMENTACAO_NAO_VERIFICADA` | `FATO_DOCUMENTADO` + `NAO_ESPECIFICADO` | O estado de implementação não é comparável sem inspeção; linguagem histórica de uso permanece não verificada. | `DAE-FND-029`, `DAE-FND-030` |

### Governança, evidências e encaminhamento

Em todas as linhas abaixo, “execução: não” significa que o problema não impediu a Etapa 8. Fontes como `DOC-009 §Achados → SCI-FND-...` são localizadores analíticos; os localizadores históricos completos permanecem na linha indicada do relatório-fonte.

| ID | Fontes, evidências e localizadores | Dependências | Impacto e bloqueio | Autoridade necessária; pendências | Estado | Destino futuro | Observações |
|---|---|---|---|---|---|---|---|
| `CON-FND-001` | `DOC-009 §Achados → SCI-FND-001,016`; `DOC-RAW-007`–`009`/`011` ali citados | `CON-FND-020` | `INFORMATIVO`; execução: não | Científica; `PD-002` | `INFORMATIVO` | Modelo científico normativo futuro | Alinhamento não é validação. |
| `CON-FND-002` | `DOC-009/010/012 §Achados → SCI-FND-002; MATH-FND-001; DAE-FND-013` | `CON-FND-005`, `010`, `020` | `INFORMATIVO`; execução: não | Científica, dados; `PD-002`,`004` | `INFORMATIVO` | Contrato de entrada e matriz de dados futuros | 17/17 têm campo histórico; 16/17 alcançam entrada algorítmica. |
| `CON-FND-003` | `DOC-009/010/012 §Achados → SCI-FND-011; MATH-FND-002`–`004`; `DAE-FND-019` | `CON-FND-016`, `020`, `023` | `BLOQUEANTE_PARA_NORMATIZACAO`; execução: não | Científica; `PD-001`,`002` | `AGUARDANDO_VALIDACAO_CIENTIFICA` | Contrato matemático normativo | O alinhamento geral foi preservado dentro da divergência transversal. |
| `CON-FND-004` | `DOC-009/010/012 §Achados → SCI-FND-003; MATH-FND-008; DAE-FND-014` | `CON-FND-002`, `005`, `020` | `BLOQUEANTE_PARA_NORMATIZACAO`; execução: não | Científica e dados; `PD-002`,`004` | `AGUARDANDO_VALIDACAO_CIENTIFICA` | Matriz de variáveis, contrato de entrada e modelo de dados | Mesma composição material, aprofundada em três camadas. |
| `CON-FND-005` | `DOC-009 §Achados → SCI-FND-004` | `CON-FND-009`, `020` | `BLOQUEANTE_PARA_NORMATIZACAO`; execução: não | Científica/protocolar; `PD-002` | `AGUARDANDO_VALIDACAO_CIENTIFICA` | Protocolo de campo normativo | Ausência localizada, não inexistência universal. |
| `CON-FND-006` | `DOC-009/010 §Achados → SCI-FND-005; MATH-FND-014` | `CON-FND-003`, `020` | `ALTO`; execução: não | Científica; `PD-002` | `AGUARDANDO_VALIDACAO_CIENTIFICA` | Glossário, protocolo e contrato matemático | Geral/regional não foi promovido a conflito estrito. |
| `CON-FND-007` | `DOC-009 §Achados → SCI-FND-006` | `CON-FND-018`, `020` | `ALTO`; execução: não | Científica; `PD-002` | `AGUARDANDO_VALIDACAO_CIENTIFICA` | Glossário e matriz de variáveis | Decisão independente de APP. |
| `CON-FND-008` | `DOC-009 §Achados → SCI-FND-007` | `CON-FND-009`, `010`, `026` | `BLOQUEANTE_PARA_NORMATIZACAO`; execução: não | Científica/protocolar; `PD-002` | `AGUARDANDO_VALIDACAO_CIENTIFICA` | Protocolo e regra de agregação | Agregação matemática é efeito dependente. |
| `CON-FND-009` | `DOC-009 §Achados → SCI-FND-008` | `CON-FND-005`, `008`, `013` | `ALTO`; execução: não | Científica/protocolar; `PD-002` | `AGUARDANDO_VALIDACAO_CIENTIFICA` | Protocolo e controle de qualidade | Método de campo não foi fundido com validação algorítmica. |
| `CON-FND-010` | `DOC-009/010 §Achados → SCI-FND-009; MATH-FND-007,010` | `CON-FND-005`, `008`, `013`, `024` | `BLOQUEANTE_PARA_NORMATIZACAO`; execução: não | Científica; produto/dados depois; `PD-002`–`004` | `ABERTO` | Protocolo, contrato de entrada e saída | Facetas compartilham a regra de ausência e mínimos. |
| `CON-FND-011` | `DOC-009 §Achados → SCI-FND-010` | `CON-FND-003`, `012`, `015`, `020` | `BLOQUEANTE_PARA_NORMATIZACAO`; execução: não | Científica; `PD-002` | `AGUARDANDO_VALIDACAO_CIENTIFICA` | Contrato matemático | Não absorve o conflito estrito de clamp. |
| `CON-FND-012` | `DOC-010 §Achados → MATH-FND-005`; testes `MATH-TEST-010,013,016` | `CON-FND-011`, `013`, `020` | `BLOQUEANTE_PARA_NORMATIZACAO`; execução: não | Científica e operacional futura; `PD-002` | `ABERTO` | Contrato de validação/algoritmo | Satisfaz os cinco critérios estritos; história preservada. |
| `CON-FND-013` | `DOC-010 §Achados → MATH-FND-009` | `CON-FND-009`, `010`, `012` | `ALTO`; execução: não | Científica e dados; `PD-002`,`004` | `ABERTO` | Contrato de validação | Resolução não determina política de clamp. |
| `CON-FND-014` | `DOC-010 §Achados → MATH-FND-006`; teste `MATH-TEST-027` | `CON-FND-010`, `020`, `024` | `ALTO`; execução: não | Científica, produto e dados; `PD-002`–`004` | `ABERTO` | Contrato de qualidade/saída | Satisfaz os cinco critérios estritos; problema autônomo. |
| `CON-FND-015` | `DOC-009/010 §Achados → SCI-FND-012; MATH-FND-011,015` | `CON-FND-003`, `020` | `BLOQUEANTE_PARA_NORMATIZACAO`; execução: não | Científica; `PD-002` | `AGUARDANDO_VALIDACAO_CIENTIFICA` | Contrato de classes e precisão | Intervalos e arredondamento são subdecisões do mesmo classificador. |
| `CON-FND-016` | `DOC-009/010 §Achados → SCI-FND-013; MATH-FND-013` | `CON-FND-003`, `017`, `023`; `GAP-010` | `BLOQUEANTE_PARA_NORMATIZACAO`; execução: não | Institucional e científica; `PD-001`,`002` | `AGUARDANDO_VALIDACAO_CIENTIFICA` | Escopo e aplicabilidade do modelo | Não afirma inexistência de fonte institucional fora do corpus. |
| `CON-FND-017` | `DOC-009 §Achados → SCI-FND-014` | `CON-FND-016`, `030` | `MEDIO`; execução: não | Científica e institucional; `PD-001`,`002`,`003` | `AGUARDANDO_VALIDACAO_CIENTIFICA` | Escopo do diagnóstico e requisitos | Escala não foi fundida com limite geográfico. |
| `CON-FND-018` | `DOC-009 §Achados → SCI-FND-015` | `CON-FND-006`, `007`, `030` | `MEDIO`; execução: não | Científica; produto/dados depois; `PD-002`,`015` | `AGUARDANDO_VALIDACAO_CIENTIFICA` | Glossário normativo | Equivalências não foram inferidas. |
| `CON-FND-019` | `DOC-009 §Achados → SCI-FND-017`; metadados nos quatro nós científicos | `CON-FND-020`, `023` | `ALTO`; execução: não | Científica/equipe; `PD-002` | `ABERTO` | Registro de proveniência científica | Ausência no corpus não prova ausência externa. |
| `CON-FND-020` | `DOC-009/010/011 §Achados → SCI-FND-018; MATH-FND-020; PROD-FND-020`; `SOURCE_AUTHORITY.md` | `PD-002`; precede `CON-FND-003`–`019`,`024`–`026` | `BLOQUEANTE_PARA_NORMATIZACAO`; execução: não | Equipe deve designar autoridade científica; `PD-002`,`003` | `AGUARDANDO_DESIGNACAO_DE_AUTORIDADE` | `SOURCE_AUTHORITY.md` e futuras normas após decisão | Agrupamento pela mesma autoridade e efeito de validação. |
| `CON-FND-021` | `DOC-009 §Achados → SCI-FND-019`; `DOC-010 §Cobertura E5` | Nenhuma material; registro histórico | `ALTO`; execução: não | Não aplicável ao mérito; governança analítica | `INFORMATIVO` | Matriz de rastreabilidade analítica | O impacto herdado não implica pendência material nova. |
| `CON-FND-022` | `DOC-009 §Achados → SCI-FND-020` | `CON-FND-001`, `020` | `MEDIO`; execução: não | Científica; `PD-002` | `INFORMATIVO` | Delimitação futura do modelo | Não comparável, não lacuna normativa presumida. |
| `CON-FND-023` | `DOC-010 §Achados → MATH-FND-012`; `REG-PAR-001`–`013` | `CON-FND-003`, `016`, `019`, `020` | `BLOQUEANTE_PARA_NORMATIZACAO`; execução: não | Científica; `PD-002` | `AGUARDANDO_VALIDACAO_CIENTIFICA` | Dossiê de calibração | Evidência empírica é distinta da designação de autoridade. |
| `CON-FND-024` | `DOC-010/012 §Achados → MATH-FND-016; DAE-FND-016` | `CON-FND-010`, `014`, `025`, `026` | `ALTO`; execução: não | Produto e dados, com ciência; `PD-002`–`004` | `AGUARDANDO_DECISAO` | Contrato canônico de saída | Mesma decisão sobre forma e insuficiência da saída. |
| `CON-FND-025` | `DOC-010 §Achados → MATH-FND-017` | `CON-FND-020`, `024`, `026` | `MEDIO`; execução: não | Científica e produto; `PD-002`,`003` | `ABERTO` | Regra de geração de saídas interpretativas | Separado da persistência das saídas. |
| `CON-FND-026` | `DOC-010/012 §Achados → MATH-FND-018,019; DAE-FND-015` | `CON-FND-002`, `024`, `025`, `050` | `BLOQUEANTE_PARA_NORMATIZACAO`; execução: não | Dados, com ciência; `PD-002`,`004` | `AGUARDANDO_DECISAO` | Contrato de auditabilidade e persistência | Intenção alinhada, materialização documental incompleta. |
| `CON-FND-027` | `DOC-011/012 §Achados → PROD-FND-001`–`003`; `DAE-FND-001` | `CON-FND-020`, `029`, `035` | `INFORMATIVO`; execução: não | Produto/UX; `PD-003`,`005` | `INFORMATIVO` | Requisitos e UX futuros | Agrupado como um único núcleo funcional histórico. |
| `CON-FND-028` | `DOC-011 §Achados → PROD-FND-004` | `CON-FND-030`, `041` | `MEDIO`; execução: não | Produto e dados; `PD-003`,`004` | `ABERTO` | Requisito e modelo de dados | Diferença de detalhe, não conflito. |
| `CON-FND-029` | `DOC-011/012 §Achados → PROD-FND-005; DAE-FND-005` | `CON-FND-035`, `040`, `045` | `MEDIO`; execução: não | Produto/UX/arquitetura; `PD-003`,`005`,`006` | `AGUARDANDO_DECISAO` | Escopo do MVP, requisitos e roadmap | Mesma decisão de fase; propostas específicas ficam separadas. |
| `CON-FND-030` | `DOC-011 §Achados → PROD-FND-006` | `CON-FND-038`, `041`, `042` | `ALTO`; execução: não | Dados/produto; `PD-014`,`015` | `AGUARDANDO_DECISAO` | Glossário e modelo conceitual | Identidade semântica independente das permissões. |
| `CON-FND-031` | `DOC-011/012 §Achados → PROD-FND-007; DAE-FND-006` | `CON-FND-032`, `038`, `042` | `BLOQUEANTE_PARA_NORMATIZACAO`; execução: não | Produto, com dados/UX; `PD-003`,`015`,`016` | `AGUARDANDO_DECISAO` | Glossário e catálogo de papéis | Mesma taxonomia decisória em produto e dados. |
| `CON-FND-032` | `DOC-011 §Achados → PROD-FND-008` | `CON-FND-031`, `038`, `041` | `BLOQUEANTE_PARA_NORMATIZACAO`; execução: não | Produto/UX; `PD-003`,`005`,`016` | `AGUARDANDO_DECISAO` | Matriz de autorização | Aplicação de permissão não é deduplicada com taxonomia. |
| `CON-FND-033` | `DOC-011 §Achados → PROD-FND-009` | `CON-FND-030`–`032`,`042` | `ALTO`; execução: não | Produto/UX; `PD-003`–`005`,`015` | `AGUARDANDO_DECISAO` | Requisitos e fluxos de identidade | Rótulos não provam escopo. |
| `CON-FND-034` | `DOC-011 §Achados → PROD-FND-010,011` | `CON-FND-035`, `036` | `ALTO`; execução: não | UX; `PD-003`,`005` | `AGUARDANDO_DECISAO` | Especificação UX e aceite | Agrupado porque a mesma decisão transversal define estados e critérios. |
| `CON-FND-035` | `DOC-011/012 §Achados → PROD-FND-012; DAE-FND-003` | `CON-FND-029`, `032`, `034`, `036` | `BLOQUEANTE_PARA_NORMATIZACAO`; execução: não | Produto/UX; `PD-003`,`005` | `AGUARDANDO_DECISAO` | Requisitos verificáveis e backlog | Mesma insuficiência de critérios verificáveis. |
| `CON-FND-036` | `DOC-011/012 §Achados → PROD-FND-013; DAE-FND-026` | `CON-FND-034`, `037`, `038` | `BLOQUEANTE_PARA_NORMATIZACAO`; execução: não | Produto/arquitetura; `PD-003`,`004`,`006` | `AGUARDANDO_DECISAO` | Catálogo de NFR e segurança | Produto e arquitetura descrevem a mesma ausência de metas. |
| `CON-FND-037` | `DOC-011 §Achados → PROD-FND-014` | `CON-FND-036`, `048`, `056` | `ALTO`; execução: não | Produto, com dados/UX; `PD-003`,`004`,`006` | `AGUARDANDO_DECISAO` | Contrato offline/sincronização | Mínimo e proposta ideal preservados. |
| `CON-FND-038` | `DOC-011/012 §Achados → PROD-FND-015; DAE-FND-009` | `CON-FND-030`–`032`,`041`,`042`,`048` | `BLOQUEANTE_PARA_NORMATIZACAO`; execução: não | Dados/produto; `PD-003`,`004`,`014`–`016` | `AGUARDANDO_DECISAO` | Política de isolamento e modelo de propriedade | Mesma fronteira material em duas camadas. |
| `CON-FND-039` | `DOC-011 §Achados → PROD-FND-016` | `CON-FND-029`, `035`, `040` | `MEDIO`; execução: não | Produto/UX/dados; `PD-003`–`005` | `AGUARDANDO_DECISAO` | Backlog/roadmap se aprovada | Não integra o MVP por inferência. |
| `CON-FND-040` | `DOC-011/012 §Achados → PROD-FND-017; DAE-FND-028` | `CON-FND-029`, `045`, `049`, `055` | `MEDIO`; execução: não | Produto/dados/arquitetura; `PD-001`–`006`,`013` | `ENCAMINHADO_A_FUTURO` | Backlog e roadmap governados | Agrupamento pela mesma natureza futura não aprovada. |
| `CON-FND-041` | `DOC-011/012 §Achados → PROD-FND-018; DAE-FND-010` | `CON-FND-030`–`032`,`038`,`042`,`048`,`051` | `BLOQUEANTE_PARA_NORMATIZACAO`; execução: não | Dados; `PD-004`,`014`–`016` | `AGUARDANDO_DECISAO` | Modelo conceitual e lógico | Ciclo de vida correlato permanece em `CON-FND-048`. |
| `CON-FND-042` | `DOC-011/012 §Achados → PROD-FND-019; DAE-FND-008` | `CON-FND-030`–`032`,`038`,`041` | `BLOQUEANTE_PARA_NORMATIZACAO`; execução: não | Dados/produto; `PD-014`–`016` | `AGUARDANDO_DECISAO` | Modelo conceitual | Não criar entidades por analogia. |
| `CON-FND-043` | `DOC-011/012 §Achados → PROD-FND-021; DAE-FND-031`; `SOURCE_AUTHORITY.md` | `PD-001`–`006`; precede toda promoção normativa | `BLOQUEANTE_PARA_NORMATIZACAO`; execução: não | Equipe; `PD-001`–`006` | `AGUARDANDO_DESIGNACAO_DE_AUTORIDADE` | Política de autoridade e destinos normativos | Não absorve as lacunas materiais. |
| `CON-FND-044` | `DOC-011 §Achados → PROD-FND-022`; `TRACEABILITY_MATRIX.md §GAP-008` | `PD-005`,`017` | `INFORMATIVO`; nenhum bloqueio; execução: não | UX se apresentado; `PD-017` | `INFORMATIVO` | Registro de UX opcional | Figma permanece secundário e não pré-requisito. |
| `CON-FND-045` | `DOC-012 §Achados → DAE-FND-002,027` | `CON-FND-029`, `035`, `040`, `046` | `ALTO`; execução: não | Produto; `PD-003`,`006` | `AGUARDANDO_DECISAO` | Backlog e roadmap normativos futuros | Gestão de itens e fases compartilha causa de governança. |
| `CON-FND-046` | `DOC-012 §Achados → DAE-FND-004`; matriz analítica 1 | `CON-FND-035`, `045` | `ALTO`; execução: não | Produto; `PD-003` | `AGUARDANDO_DECISAO` | Matriz requisito↔backlog | Cobertura parcial não implica derivação. |
| `CON-FND-047` | `DOC-012 §Achados → DAE-FND-007` | `CON-FND-041`, `042`, `048`, `051` | `INFORMATIVO`; execução: não | Dados; `PD-004` | `INFORMATIVO` | Modelo conceitual futuro | Alinhamento nominal não valida estrutura. |
| `CON-FND-048` | `DOC-012 §Achados → DAE-FND-011` | `CON-FND-038`, `041`, `050` | `BLOQUEANTE_PARA_NORMATIZACAO`; execução: não | Dados/produto; `PD-003`,`004` | `AGUARDANDO_DECISAO` | Política de ciclo e retenção | Separado de cardinalidades porque exige decisão própria. |
| `CON-FND-049` | `DOC-012 §Achados → DAE-FND-012` | `CON-FND-040`, `056` | `BLOQUEANTE_PARA_NORMATIZACAO`; execução: não | Dados/arquitetura; `PD-004`,`006`,`013` | `AGUARDANDO_DECISAO` | Contrato geoespacial | Não escolhe tecnologia de mapa. |
| `CON-FND-050` | `DOC-012 §Achados → DAE-FND-017` | `CON-FND-003`, `026`, `048`, `051` | `BLOQUEANTE_PARA_NORMATIZACAO`; execução: não | Dados, ciência e arquitetura; `PD-002`,`004`,`006` | `AGUARDANDO_DECISAO` | Política de versionamento | Versão de documento e versão de algoritmo permanecem distintas. |
| `CON-FND-051` | `DOC-012 §Achados → DAE-FND-018` | `CON-FND-041`, `047`, `050` | `BLOQUEANTE_PARA_NORMATIZACAO`; execução: não | Dados/arquitetura; `PD-004`,`006` | `AGUARDANDO_DECISAO` | Modelo lógico e eventual ADR | Divergência não virou conflito estrito. |
| `CON-FND-052` | `DOC-012 §Achados → DAE-FND-020`; `ARCH-NNN`/`TD-001,009` ali citados | `CON-FND-056`; `PD-008`,`011` | `BLOQUEANTE_PARA_NORMATIZACAO`; execução: não | Arquitetura; `PD-006`,`008`,`011` | `AGUARDANDO_DECISAO` | ADR futuro, se aprovado | Não escolhe Next.js, Python ou FastAPI. |
| `CON-FND-053` | `DOC-012 §Achados → DAE-FND-021`; `TD-002` | `CON-FND-051`, `054` | `INFORMATIVO`; execução: não | Arquitetura; `PD-006` | `INFORMATIVO` | `TECH_DECISIONS.md`/ADR após confirmação | Estado decisório não é estado de implementação. |
| `CON-FND-054` | `DOC-012 §Achados → DAE-FND-022`; `TECH_DECISIONS.md` | `CON-FND-051`, `053` | `INFORMATIVO`; execução: não | Arquitetura; `PD-006` | `INFORMATIVO` | Registro técnico/ADR futuro | Ausência nas duas fontes não rejeita Prisma ou Neon. |
| `CON-FND-055` | `DOC-012 §Achados → DAE-FND-023`; `TD-008,010,011,014` | `CON-FND-040`, `049`, `056` | `MEDIO`; execução: não | Arquitetura; `PD-007`,`009`,`010`,`013` | `AGUARDANDO_DECISAO` | ADR de mapas, se aprovado | Alternativas não foram completadas nem escolhidas. |
| `CON-FND-056` | `DOC-012 §Achados → DAE-FND-024`; `ARCH-012`–`018`; `TD-012` | `CON-FND-024`, `049`, `052`, `055` | `BLOQUEANTE_PARA_NORMATIZACAO`; execução: não | Arquitetura, produto e dados; `PD-003`,`004`,`006`,`008`,`011` | `AGUARDANDO_DECISAO` | Contrato de API e eventual ADR | Contrato ausente é distinto da divisão de backend. |
| `CON-FND-057` | `DOC-012 §Achados → DAE-FND-025`; `TD-003,007,013` | `CON-FND-036`, `052`, `056` | `ALTO`; execução: não | Arquitetura; `PD-012` | `AGUARDANDO_DECISAO` | Política de ambientes/hospedagem | Contextos atual e futuro preservados. |
| `CON-FND-058` | `DOC-012 §Achados → DAE-FND-029,030`; matriz analítica 12 | `CODE-CHECK-001`–`018` | `MEDIO`; execução: não | Auditoria futura; `PD-004`,`006` conforme assunto | `NAO_AVALIADO` | Futura inspeção autorizada | Nenhum resultado de implementação foi antecipado. |

### Justificativas dos agrupamentos multi-origem

| Problema | Justificativa da convergência; limites preservados |
|---|---|
| `CON-FND-001` | Os dois achados descrevem o mesmo núcleo científico em dimensões e relações ecológicas; estrutura e relações continuam facetas distintas e não validadas. |
| `CON-FND-002` | Os três achados acompanham o mesmo inventário de variáveis entre ciência, contrato/algoritmo e dados; as coberturas 14/16/17 e a ruptura de `VAR-017` permanecem explícitas. |
| `CON-FND-003` | Os cinco achados tratam da mesma decisão sobre composição do IHFR e relação geral–regional; o alinhamento matemático geral, a divergência de pesos e a ambiguidade de aplicabilidade não são apagados. |
| `CON-FND-004` | A divergência territorial científica e matemática materializa-se na mesma interrupção de densidade de drenagem nos dados/algoritmo. |
| `CON-FND-006` | Conceito, cardinalidade e pontuação de APP/mata ciliar requerem a mesma validação científica; o possível recorte regional impede classificá-los como conflito. |
| `CON-FND-010` | Temporalidade, missing, obrigatoriedade, denominadores e conjunto vazio integram uma única política de completude da coleta ao cálculo; cada condição permanece enumerada. |
| `CON-FND-015` | Intervalos e política de precisão/arredondamento são subdecisões do mesmo classificador contínuo e reprodutível. |
| `CON-FND-016` | Os achados pedem a mesma delimitação operacional da aplicabilidade regional; escalas de produto permanecem em `CON-FND-017`. |
| `CON-FND-020` | Validação científica ausente e impossibilidade de promover dependências científicas de produto compartilham a autoridade de `PD-002`; autoridades não científicas continuam em `CON-FND-043`. |
| `CON-FND-024` | Os dois achados descrevem o mesmo objeto de saída, inclusive a representação de insuficiência, e exigem um contrato canônico conjunto. |
| `CON-FND-026` | A intenção de audit trail, a lacuna de reprodutibilidade e a persistência incompleta são elos da mesma cadeia de reprodução do resultado. |
| `CON-FND-027` | Fluxo principal, dashboard, mapa, coleta e resultado formam o mesmo núcleo funcional histórico; alinhamento não significa aprovação ou completude. |
| `CON-FND-029` | Tela de análise e backlog condicional/futuro dependem da mesma decisão de fronteira do MVP, sem absorver propostas específicas de IA e geoprocessamento. |
| `CON-FND-031` | Taxonomias de requisitos e dados descrevem os mesmos papéis sobrepostos e requerem um único glossário; a matriz de autorização é decisão posterior separada. |
| `CON-FND-034` | Erro/confirmação e vazio/loading/responsividade/acessibilidade são estados transversais do mesmo contrato de UX, preservados como subitens verificáveis. |
| `CON-FND-035` | Produto e backlog registram a mesma insuficiência de critérios verificáveis; prioridade/estado do backlog permanece em `CON-FND-045`. |
| `CON-FND-036` | Ausências de NFR em produto e arquitetura compartilham seleção, métricas e aprovação; offline mantém contrato próprio em `CON-FND-037`. |
| `CON-FND-038` | “Própria área”, ownership e isolamento são manifestações da mesma fronteira de acesso/tenant não aprovada. |
| `CON-FND-040` | Shapefile/camadas e expansões arquiteturais são explicitamente futuras ou propostas; cada capacidade continua identificável nas fontes. |
| `CON-FND-041` | O achado amplo de domínio e o detalhamento de chaves/cardinalidades requerem o mesmo modelo estrutural; ciclo e persistência têm decisões próprias em `CON-FND-048`/`051`. |
| `CON-FND-042` | As duas camadas constatam a mesma ausência de organização, laboratório e assinante; nenhuma entidade é criada por analogia. |
| `CON-FND-043` | As duas auditorias registram a mesma causa de governança: autoridades de aprovação e destinos não designados; as pendências por assunto não são fundidas nem resolvidas. |
| `CON-FND-045` | Prioridade/estado do backlog e metadados de roadmap compartilham a lacuna de governança de planejamento; cobertura requisito↔backlog fica separada em `CON-FND-046`. |
| `CON-FND-058` | Não inspeção e linguagem histórica de uso têm o mesmo limite probatório: estado implementado desconhecido; nenhuma alegação é confirmada. |

### Cobertura dos 93 achados de origem

| Achado de origem | Etapa | Problema consolidado | Tipo de relação | Observação |
|---|---:|---|---|---|
| `SCI-FND-001` | 4 | `CON-FND-001` | `ORIGEM_PRIMARIA_CONVERGENTE` | Estrutura em quatro dimensões. |
| `SCI-FND-002` | 4 | `CON-FND-002` | `ORIGEM_PRIMARIA_CONVERGENTE` | Núcleo científico de variáveis. |
| `SCI-FND-003` | 4 | `CON-FND-004` | `ORIGEM_PRIMARIA_CONVERGENTE` | Composição territorial. |
| `SCI-FND-004` | 4 | `CON-FND-005` | `ORIGEM_PRIMARIA_UNICA` | Cobertura do protocolo. |
| `SCI-FND-005` | 4 | `CON-FND-006` | `ORIGEM_PRIMARIA_CONVERGENTE` | APP/mata ciliar. |
| `SCI-FND-006` | 4 | `CON-FND-007` | `ORIGEM_PRIMARIA_UNICA` | Solo exposto. |
| `SCI-FND-007` | 4 | `CON-FND-008` | `ORIGEM_PRIMARIA_UNICA` | Amostragem/agregação. |
| `SCI-FND-008` | 4 | `CON-FND-009` | `ORIGEM_PRIMARIA_UNICA` | Métodos/instrumentos. |
| `SCI-FND-009` | 4 | `CON-FND-010` | `ORIGEM_PRIMARIA_CONVERGENTE` | Temporalidade/missing/QC. |
| `SCI-FND-010` | 4 | `CON-FND-011` | `ORIGEM_PRIMARIA_UNICA` | Transformações/normalização. |
| `SCI-FND-011` | 4 | `CON-FND-003` | `ORIGEM_PRIMARIA_CONVERGENTE` | Pesos gerais/regionais. |
| `SCI-FND-012` | 4 | `CON-FND-015` | `ORIGEM_PRIMARIA_CONVERGENTE` | Intervalos classificatórios. |
| `SCI-FND-013` | 4 | `CON-FND-016` | `ORIGEM_PRIMARIA_CONVERGENTE` | Aplicabilidade geográfica. |
| `SCI-FND-014` | 4 | `CON-FND-017` | `ORIGEM_PRIMARIA_UNICA` | Escalas de aplicação. |
| `SCI-FND-015` | 4 | `CON-FND-018` | `ORIGEM_PRIMARIA_UNICA` | Léxico científico. |
| `SCI-FND-016` | 4 | `CON-FND-001` | `ORIGEM_PRIMARIA_CONVERGENTE` | Relações ecológicas. |
| `SCI-FND-017` | 4 | `CON-FND-019` | `ORIGEM_PRIMARIA_UNICA` | Proveniência. |
| `SCI-FND-018` | 4 | `CON-FND-020` | `ORIGEM_PRIMARIA_CONVERGENTE` | Validação científica. |
| `SCI-FND-019` | 4 | `CON-FND-021` | `ORIGEM_PRIMARIA_UNICA` | Encaminhamento à Etapa 5. |
| `SCI-FND-020` | 4 | `CON-FND-022` | `ORIGEM_PRIMARIA_UNICA` | Fatores não comparáveis. |
| `MATH-FND-001` | 5 | `CON-FND-002` | `ORIGEM_PRIMARIA_CONVERGENTE` | Núcleo contrato↔algoritmo. |
| `MATH-FND-002` | 5 | `CON-FND-003` | `ORIGEM_PRIMARIA_CONVERGENTE` | Fórmulas gerais equivalentes. |
| `MATH-FND-003` | 5 | `CON-FND-003` | `ORIGEM_PRIMARIA_CONVERGENTE` | Pesos diferenciais. |
| `MATH-FND-004` | 5 | `CON-FND-003` | `ORIGEM_PRIMARIA_CONVERGENTE` | Relação geral–regional. |
| `MATH-FND-005` | 5 | `CON-FND-012` | `ORIGEM_PRIMARIA_UNICA` | Conflito clamp/bloqueio preservado. |
| `MATH-FND-006` | 5 | `CON-FND-014` | `ORIGEM_PRIMARIA_UNICA` | Conflito `data_quality` preservado. |
| `MATH-FND-007` | 5 | `CON-FND-010` | `ORIGEM_PRIMARIA_CONVERGENTE` | Obrigatoriedade/ausência. |
| `MATH-FND-008` | 5 | `CON-FND-004` | `ORIGEM_PRIMARIA_CONVERGENTE` | Composição territorial. |
| `MATH-FND-009` | 5 | `CON-FND-013` | `ORIGEM_PRIMARIA_UNICA` | Enum/unidade/tipo. |
| `MATH-FND-010` | 5 | `CON-FND-010` | `ORIGEM_PRIMARIA_CONVERGENTE` | Denominadores/conjunto vazio. |
| `MATH-FND-011` | 5 | `CON-FND-015` | `ORIGEM_PRIMARIA_CONVERGENTE` | Faixas descontínuas. |
| `MATH-FND-012` | 5 | `CON-FND-023` | `ORIGEM_PRIMARIA_UNICA` | Método empírico regional. |
| `MATH-FND-013` | 5 | `CON-FND-016` | `ORIGEM_PRIMARIA_CONVERGENTE` | Território regional. |
| `MATH-FND-014` | 5 | `CON-FND-006` | `ORIGEM_PRIMARIA_CONVERGENTE` | APP binária/ternária. |
| `MATH-FND-015` | 5 | `CON-FND-015` | `ORIGEM_PRIMARIA_CONVERGENTE` | Arredondamento. |
| `MATH-FND-016` | 5 | `CON-FND-024` | `ORIGEM_PRIMARIA_CONVERGENTE` | Contrato de saída. |
| `MATH-FND-017` | 5 | `CON-FND-025` | `ORIGEM_PRIMARIA_UNICA` | Drivers/textos/recomendações. |
| `MATH-FND-018` | 5 | `CON-FND-026` | `ORIGEM_PRIMARIA_CONVERGENTE` | Intenção de trilha. |
| `MATH-FND-019` | 5 | `CON-FND-026` | `ORIGEM_PRIMARIA_CONVERGENTE` | Reprodutibilidade. |
| `MATH-FND-020` | 5 | `CON-FND-020` | `ORIGEM_PRIMARIA_CONVERGENTE` | Validação científica. |
| `PROD-FND-001` | 6 | `CON-FND-027` | `ORIGEM_PRIMARIA_CONVERGENTE` | Cinco telas/fluxo. |
| `PROD-FND-002` | 6 | `CON-FND-027` | `ORIGEM_PRIMARIA_CONVERGENTE` | Dashboard/mapa. |
| `PROD-FND-003` | 6 | `CON-FND-027` | `ORIGEM_PRIMARIA_CONVERGENTE` | Coleta/resultado. |
| `PROD-FND-004` | 6 | `CON-FND-028` | `ORIGEM_PRIMARIA_UNICA` | Campo Estado. |
| `PROD-FND-005` | 6 | `CON-FND-029` | `ORIGEM_PRIMARIA_CONVERGENTE` | Tela/fase. |
| `PROD-FND-006` | 6 | `CON-FND-030` | `ORIGEM_PRIMARIA_UNICA` | Área/propriedade. |
| `PROD-FND-007` | 6 | `CON-FND-031` | `ORIGEM_PRIMARIA_CONVERGENTE` | Papéis. |
| `PROD-FND-008` | 6 | `CON-FND-032` | `ORIGEM_PRIMARIA_UNICA` | Permissões. |
| `PROD-FND-009` | 6 | `CON-FND-033` | `ORIGEM_PRIMARIA_UNICA` | Conta/recuperação. |
| `PROD-FND-010` | 6 | `CON-FND-034` | `ORIGEM_PRIMARIA_CONVERGENTE` | Validação/erro/confirmação. |
| `PROD-FND-011` | 6 | `CON-FND-034` | `ORIGEM_PRIMARIA_CONVERGENTE` | Estados/acessibilidade. |
| `PROD-FND-012` | 6 | `CON-FND-035` | `ORIGEM_PRIMARIA_CONVERGENTE` | Aceite parcial. |
| `PROD-FND-013` | 6 | `CON-FND-036` | `ORIGEM_PRIMARIA_CONVERGENTE` | NFR. |
| `PROD-FND-014` | 6 | `CON-FND-037` | `ORIGEM_PRIMARIA_UNICA` | Offline. |
| `PROD-FND-015` | 6 | `CON-FND-038` | `ORIGEM_PRIMARIA_CONVERGENTE` | Privacidade/isolamento. |
| `PROD-FND-016` | 6 | `CON-FND-039` | `ORIGEM_PRIMARIA_UNICA` | IA proposta. |
| `PROD-FND-017` | 6 | `CON-FND-040` | `ORIGEM_PRIMARIA_CONVERGENTE` | Shapefile/camadas futuras. |
| `PROD-FND-018` | 6 | `CON-FND-041` | `ORIGEM_PRIMARIA_CONVERGENTE` | Cardinalidades do domínio. |
| `PROD-FND-019` | 6 | `CON-FND-042` | `ORIGEM_PRIMARIA_CONVERGENTE` | Laboratório/organização/assinante. |
| `PROD-FND-020` | 6 | `CON-FND-020` | `ORIGEM_PRIMARIA_CONVERGENTE` | Dependência científica. |
| `PROD-FND-021` | 6 | `CON-FND-043` | `ORIGEM_PRIMARIA_CONVERGENTE` | Autoridades de produto/UX/dados. |
| `PROD-FND-022` | 6 | `CON-FND-044` | `ORIGEM_PRIMARIA_UNICA` | Figma opcional. |
| `DAE-FND-001` | 7 | `CON-FND-027` | `ORIGEM_PRIMARIA_CONVERGENTE` | Núcleo funcional/backlog. |
| `DAE-FND-002` | 7 | `CON-FND-045` | `ORIGEM_PRIMARIA_CONVERGENTE` | Gestão do backlog. |
| `DAE-FND-003` | 7 | `CON-FND-035` | `ORIGEM_PRIMARIA_CONVERGENTE` | Critérios. |
| `DAE-FND-004` | 7 | `CON-FND-046` | `ORIGEM_PRIMARIA_UNICA` | Cobertura backlog↔requisitos. |
| `DAE-FND-005` | 7 | `CON-FND-029` | `ORIGEM_PRIMARIA_CONVERGENTE` | MVP/futuro. |
| `DAE-FND-006` | 7 | `CON-FND-031` | `ORIGEM_PRIMARIA_CONVERGENTE` | Papéis. |
| `DAE-FND-007` | 7 | `CON-FND-047` | `ORIGEM_PRIMARIA_UNICA` | Domínio/dados. |
| `DAE-FND-008` | 7 | `CON-FND-042` | `ORIGEM_PRIMARIA_CONVERGENTE` | Organização/laboratório/assinante. |
| `DAE-FND-009` | 7 | `CON-FND-038` | `ORIGEM_PRIMARIA_CONVERGENTE` | Ownership/isolamento. |
| `DAE-FND-010` | 7 | `CON-FND-041` | `ORIGEM_PRIMARIA_CONVERGENTE` | Chaves/cardinalidades. |
| `DAE-FND-011` | 7 | `CON-FND-048` | `ORIGEM_PRIMARIA_UNICA` | Ciclo/retenção. |
| `DAE-FND-012` | 7 | `CON-FND-049` | `ORIGEM_PRIMARIA_UNICA` | Geoespacial. |
| `DAE-FND-013` | 7 | `CON-FND-002` | `ORIGEM_PRIMARIA_CONVERGENTE` | Variáveis/campos. |
| `DAE-FND-014` | 7 | `CON-FND-004` | `ORIGEM_PRIMARIA_CONVERGENTE` | Densidade de drenagem. |
| `DAE-FND-015` | 7 | `CON-FND-026` | `ORIGEM_PRIMARIA_CONVERGENTE` | Trilha/persistência. |
| `DAE-FND-016` | 7 | `CON-FND-024` | `ORIGEM_PRIMARIA_CONVERGENTE` | Resultado insuficiente. |
| `DAE-FND-017` | 7 | `CON-FND-050` | `ORIGEM_PRIMARIA_UNICA` | Versionamento. |
| `DAE-FND-018` | 7 | `CON-FND-051` | `ORIGEM_PRIMARIA_UNICA` | Persistência modular/única. |
| `DAE-FND-019` | 7 | `CON-FND-003` | `ORIGEM_PRIMARIA_CONVERGENTE` | Fórmula/aplicabilidade. |
| `DAE-FND-020` | 7 | `CON-FND-052` | `ORIGEM_PRIMARIA_UNICA` | Backend. |
| `DAE-FND-021` | 7 | `CON-FND-053` | `ORIGEM_PRIMARIA_UNICA` | PostgreSQL relatado. |
| `DAE-FND-022` | 7 | `CON-FND-054` | `ORIGEM_PRIMARIA_UNICA` | Prisma/Neon. |
| `DAE-FND-023` | 7 | `CON-FND-055` | `ORIGEM_PRIMARIA_UNICA` | Mapas. |
| `DAE-FND-024` | 7 | `CON-FND-056` | `ORIGEM_PRIMARIA_UNICA` | Integração/API. |
| `DAE-FND-025` | 7 | `CON-FND-057` | `ORIGEM_PRIMARIA_UNICA` | Hospedagem. |
| `DAE-FND-026` | 7 | `CON-FND-036` | `ORIGEM_PRIMARIA_CONVERGENTE` | Segurança/NFR. |
| `DAE-FND-027` | 7 | `CON-FND-045` | `ORIGEM_PRIMARIA_CONVERGENTE` | Governança do roadmap. |
| `DAE-FND-028` | 7 | `CON-FND-040` | `ORIGEM_PRIMARIA_CONVERGENTE` | Expansões. |
| `DAE-FND-029` | 7 | `CON-FND-058` | `ORIGEM_PRIMARIA_CONVERGENTE` | Implementação não comparável. |
| `DAE-FND-030` | 7 | `CON-FND-058` | `ORIGEM_PRIMARIA_CONVERGENTE` | Alegação não verificada. |
| `DAE-FND-031` | 7 | `CON-FND-043` | `ORIGEM_PRIMARIA_CONVERGENTE` | Autoridades transversais. |

Resultado mecânico: 93/93 origens, uma vez cada como vínculo primário; zero omissões e zero duplicações primárias.

### Contagens e distribuições dos problemas únicos

| Medida | Quantidade |
|---|---:|
| Achados brutos | 93 |
| Problemas consolidados únicos | 58 |
| Ocorrências bloqueantes brutas | 41 |
| Problemas bloqueantes únicos | 26 |
| Problemas não bloqueantes | 32 |

| Camada principal | Quantidade | Bloqueios únicos na camada |
|---|---:|---:|
| Ciência fundamental | 9 | 2 |
| Protocolo de campo | 3 | 2 |
| Contrato matemático | 6 | 5 |
| Algoritmo operacional | 5 | 1 |
| Produto e requisitos | 8 | 2 |
| Domínio e permissões | 5 | 4 |
| UX | 3 | 0 |
| Dados | 7 | 6 |
| Arquitetura | 6 | 2 |
| Backlog | 2 | 0 |
| Implementação futura | 1 | 0 |
| Governança institucional | 3 | 2 |
| **Total** | **58** | **26** |

| Tipo consolidado | Quantidade |
|---|---:|
| `ALINHAMENTO_DOCUMENTAL` | 6 |
| `DIVERGENCIA_DOCUMENTAL` | 11 |
| `CONFLITO_DOCUMENTAL` | 2 |
| `AMBIGUIDADE` | 10 |
| `LACUNA` | 20 |
| `NAO_COMPARAVEL` | 3 |
| `PROPOSTA_NAO_APROVADA` | 3 |
| `PENDENCIA_DE_AUTORIDADE` | 2 |
| `ALEGACAO_DE_IMPLEMENTACAO_NAO_VERIFICADA` | 1 |
| **Total** | **58** |

| Impacto consolidado | Quantidade |
|---|---:|
| `BLOQUEANTE_PARA_NORMATIZACAO` | 26 |
| `ALTO` | 15 |
| `MEDIO` | 10 |
| `INFORMATIVO` | 7 |
| **Total** | **58** |

| Autoridade líder necessária para tratamento | Quantidade |
|---|---:|
| Científica | 23 |
| Produto | 13 |
| Dados | 10 |
| UX | 3 |
| Arquitetura | 6 |
| Equipe/governança ou auditoria futura | 3 |
| **Total** | **58** |

Autoridades conjuntas permanecem explicitadas no catálogo; a distribuição usa uma única liderança analítica por problema apenas para impedir dupla contagem.

| Estado consolidado | Quantidade |
|---|---:|
| `INFORMATIVO` | 9 |
| `ABERTO` | 7 |
| `AGUARDANDO_VALIDACAO_CIENTIFICA` | 13 |
| `AGUARDANDO_DECISAO` | 25 |
| `AGUARDANDO_DESIGNACAO_DE_AUTORIDADE` | 2 |
| `ENCAMINHADO_A_FUTURO` | 1 |
| `NAO_AVALIADO` | 1 |
| **Total** | **58** |

### Bloqueios únicos para normatização

Os 26 bloqueios únicos são `CON-FND-003`, `004`, `005`, `008`, `010`, `011`, `012`, `015`, `016`, `020`, `023`, `026`, `031`, `032`, `035`, `036`, `038`, `041`, `042`, `043`, `048`, `049`, `050`, `051`, `052` e `056`.

| Autoridade líder | Bloqueios únicos | Quantidade |
|---|---|---:|
| Científica | `CON-FND-003`,`004`,`005`,`008`,`010`,`011`,`012`,`015`,`016`,`020`,`023` | 11 |
| Produto | `CON-FND-031`,`032`,`035`,`036` | 4 |
| Dados | `CON-FND-026`,`038`,`041`,`042`,`048`,`049`,`050`,`051` | 8 |
| Arquitetura | `CON-FND-052`,`056` | 2 |
| Equipe/governança | `CON-FND-043` | 1 |
| **Total** |  | **26** |

Nenhuma dessas pendências bloqueia a execução ou a revisão do relatório. Elas bloqueiam somente futura promoção normativa das partes afetadas.

### Conflitos estritos

`CON-FND-012` e `CON-FND-014` preservam, sem reclassificação, `MATH-FND-005` e `MATH-FND-006`. Em ambos há mesmo assunto, aplicabilidade, versão/estado pretendido, afirmações incompatíveis e autoridade insuficiente. Pesos gerais versus regionais, APP binária versus ternária e granularidade de persistência não atingem o critério estrito porque recorte ou relação ainda podem conciliar as fontes; permanecem divergência ou ambiguidade.

## Catálogo mestre de perguntas

Nenhuma pergunta foi respondida. “Ordem” remete à ordem processual recomendada de 1 a 15 descrita adiante e não atribui mérito ou responsável. O impacto é analítico sobre futura normatização.

| ID | Formulação neutra | Perguntas de origem | Camada | Autoridade necessária | Decisão ou validação exigida | Dependências | Impacto | Pendências | Ordem | Destino após resposta |
|---|---|---|---|---|---|---|---|---|---:|---|
| `CON-Q-001` | Quem possui autoridade e quais documentos receberão decisões de escopo, ciência, produto, UX, dados e arquitetura? | `DAE-Q-030` | Governança institucional | Equipe; não especificado | Designar autoridades e destinos com origem registrada. | `GAP-009`,`010` | `BLOQUEANTE` | `PD-001`–`006` | 1 | `SOURCE_AUTHORITY.md` e destinos normativos futuros |
| `CON-Q-002` | Quem pode aprovar a calibração científica e qual registro comprovará a validação? | `MATH-Q-004` | Ciência | Científica a designar | Designação e critério de validação. | `CON-FND-019`,`020`,`023` | `BLOQUEANTE` | `PD-002` | 2 | Política de autoridade e dossiê científico |
| `CON-Q-003` | Qual composição territorial deve ser validada e qual papel a densidade de drenagem possui no cálculo? | `SCI-Q-001`, `DAE-Q-015` | Ciência/dados | Científica e dados | Composição, entrada, normalização e aplicabilidade. | `CON-FND-002`,`004` | `BLOQUEANTE` | `PD-002`,`004` | 3 | Matriz de variáveis, contrato e dados futuros |
| `CON-Q-004` | Qual tratamento protocolar se aplica às cinco variáveis sem procedimento localizado? | `SCI-Q-002` | Protocolo | Científica/protocolar | Procedimento, impossibilidade e qualidade. | `CON-FND-005`,`009`,`010` | `BLOQUEANTE` | `PD-002` | 4 | Protocolo normativo futuro |
| `CON-Q-005` | Como APP e mata ciliar se relacionam, com qual cardinalidade, score e aplicabilidade geral/regional? | `SCI-Q-003`, `MATH-Q-018` | Ciência/matemática | Científica | Conceito, conversão, pontuação e escopo. | `CON-FND-006`,`016` | `ALTO` | `PD-002` | 3 | Glossário, protocolo e contrato matemático |
| `CON-Q-006` | Como distinguir ou relacionar percentual pedológico e categoria territorial “solo exposto”? | `SCI-Q-004` | Ciência | Científica | Equivalência ou separação dos dois papéis. | `CON-FND-007`,`018` | `ALTO` | `PD-002` | 3 | Glossário e matriz de variáveis |
| `CON-Q-007` | Qual desenho amostral e regra de agregação transforma pontos/unidades em valor territorial do IHFR? | `SCI-Q-005`, `MATH-Q-012` | Protocolo/matemática | Científica/protocolar | Amostra, repetição, seleção, unidade e agregação. | `CON-FND-008`,`026` | `BLOQUEANTE` | `PD-002` | 4 | Protocolo e contrato de agregação |
| `CON-Q-008` | Quais métodos, instrumentos, alternativas e precisões devem ser aprovados? | `SCI-Q-006` | Protocolo | Científica/protocolar | Método e qualidade por variável. | `CON-FND-005`,`009` | `ALTO` | `PD-002` | 4 | Protocolo e controle de qualidade |
| `CON-Q-009` | Quais variáveis são obrigatórias, como registrar missing/impossibilidade, quais controles temporais/QC se aplicam e qual mínimo/conjunto vazio é válido? | `SCI-Q-007`, `MATH-Q-010`, `MATH-Q-011`, `DAE-Q-014` | Campo/matemática/dados | Científica, depois dados/produto | Política ponta a ponta de completude, denominadores e saída. | `CON-FND-005`,`008`,`010`,`024` | `BLOQUEANTE` | `PD-002`–`004` | 4 | Protocolo, entrada, saída e dados futuros |
| `CON-Q-010` | Qual relação existe entre fórmulas 0–1, normalização de dimensões e classes, e em qual nível normalizar? | `SCI-Q-008` | Contrato matemático | Científica | Transformação e ordem de normalização. | `CON-FND-003`,`011`,`015` | `BLOQUEANTE` | `PD-002` | 3 | Contrato matemático |
| `CON-Q-011` | Qual fórmula governa o MVP e como se relacionam média, pesos, modelo geral, versão regional, território e finalidade? | `SCI-Q-009`, `MATH-Q-001`, `MATH-Q-002`, `MATH-Q-003`, `DAE-Q-020` | Contrato matemático | Científica | Fórmula, fonte de aprovação, pesos, versão e aplicabilidade. | `CON-FND-003`,`016`,`020`,`023` | `BLOQUEANTE` | `PD-001`,`002` | 3 | Contrato matemático normativo |
| `CON-Q-012` | Quais dados, amostra, período, método, incerteza e validação sustentam os parâmetros regionais? | `MATH-Q-006` | Calibração | Científica | Evidência empírica por parâmetro. | `CON-FND-019`,`020`,`023` | `BLOQUEANTE` | `PD-002` | 3 | Dossiê de calibração |
| `CON-Q-013` | Quais limites geográficos e critérios operacionais definem o Baixo Itapecuru e sua relação com as escalas gerais? | `SCI-Q-011`, `MATH-Q-005` | Institucional/ciência | Institucional e científica | Limite, unidade territorial, escala e aplicabilidade. | `GAP-010`; `CON-FND-016`,`017` | `BLOQUEANTE` | `PD-001`,`002` | 1 | Escopo institucional e aplicabilidade científica |
| `CON-Q-014` | Qual precisão/arredondamento precede cálculo, classe, exibição e persistência e como tornar contínuos os intervalos? | `SCI-Q-010`, `MATH-Q-008`, `MATH-Q-009` | Contrato matemático | Científica | Política numérica e cobertura total de classes. | `CON-FND-015`,`024`,`026` | `BLOQUEANTE` | `PD-002` | 3 | Contrato de classes e precisão |
| `CON-Q-015` | Quais equivalências devem ser aprovadas entre os termos científicos identificados? | `SCI-Q-012` | Ciência/glossário | Científica | Definições e equivalências. | `CON-FND-018` | `MEDIO` | `PD-002`,`015` | 5 | Glossário normativo |
| `CON-Q-016` | Entradas fora da faixa devem ser bloqueadas, submetidas a clamp ou tratadas de outra forma, e em qual ordem? | `MATH-Q-007` | Algoritmo | Científica e operacional futura | Resolver o comportamento incompatível. | `CON-FND-011`–`013` | `BLOQUEANTE` | `PD-002` | 3 | Contrato de validação e algoritmo |
| `CON-Q-017` | Como tratar categoria desconhecida, tipo/unidade inválidos, conversão e valor não finito? | `MATH-Q-013` | Algoritmo/dados | Científica e dados | Contrato de validação das entradas. | `CON-FND-009`,`010`,`013` | `ALTO` | `PD-002`,`004` | 3 | Contrato de entrada |
| `CON-Q-018` | Qual documento/versão prevalece entre contrato e algoritmo e como registrar exceções regionais? | `MATH-Q-014` | Governança matemática | Científica/equipe | Precedência, versionamento e exceções com origem. | `CON-FND-003`,`012`,`050` | `BLOQUEANTE` | `PD-002`,`006` | 3 | Registro de versão e contrato normativo |
| `CON-Q-019` | Quais requisitos de repetibilidade, desempate, ordenação, precisão e versionamento do algoritmo/calibração/schema/recálculo se aplicam? | `MATH-Q-015`, `DAE-Q-019` | Algoritmo/dados | Científica, dados e arquitetura | Determinismo e política de versões. | `CON-FND-025`,`026`,`050` | `BLOQUEANTE` | `PD-002`,`004`,`006` | 3 | Contrato de reprodutibilidade/versionamento |
| `CON-Q-020` | Quais saídas são obrigatórias, quais nomes são canônicos e como representar insuficiência, intermediários e timestamp? | `MATH-Q-016`, `DAE-Q-018` | Algoritmo/produto/dados | Científica, produto e dados | Contrato canônico de saída. | `CON-FND-010`,`014`,`024`,`026` | `ALTO` | `PD-002`–`004` | 3 | Contrato de saída e modelo de dados |
| `CON-Q-021` | Para 4/5 essenciais, `data_quality` é high ou medium e depende de algo além de completude? | `MATH-Q-017` | Algoritmo/produto | Científica, produto e dados | Resolver saída incompatível e regra de confiança. | `CON-FND-010`,`014`,`024` | `ALTO` | `PD-002`–`004` | 3 | Contrato de qualidade/saída |
| `CON-Q-022` | Qual é o público primário e como distinguir administrador, técnico, `technician`, técnico parceiro e usuário de campo, inclusive escopo? | `PROD-Q-001`–`004`, `DAE-Q-006` | Produto/domínio | Produto e dados | Taxonomia, sinônimos/subtipos e escopo. | `CON-FND-031`,`032` | `BLOQUEANTE` | `PD-003`,`015`,`016` | 5 | Glossário e catálogo de papéis |
| `CON-Q-023` | Usuário representa pessoa, conta, assinante ou outro conceito? | `PROD-Q-005` | Domínio | Produto e dados | Identidade e distinção conceitual. | `CON-FND-030`,`033`,`042` | `ALTO` | `PD-014`,`015` | 5 | Glossário e modelo conceitual |
| `CON-Q-024` | Organização/laboratório existe no modelo, como se relaciona a pessoa/conta e quais participações/papéis são permitidos? | `PROD-Q-006`, `PROD-Q-007`, `DAE-Q-007` | Domínio/dados | Dados e produto | Existência, relações, cardinalidades e papéis. | `CON-FND-031`,`041`,`042` | `BLOQUEANTE` | `PD-014`–`016` | 6 | Modelo conceitual e regras de participação |
| `CON-Q-025` | Quem possui uma Área; ela pode ser compartilhada/transferida; entre quem; com qual isolamento e histórico? | `PROD-Q-008`, `PROD-Q-009`, `DAE-Q-008`, `DAE-Q-009` | Domínio/dados | Dados e produto | Propriedade, compartilhamento, transferência, tenant e histórico. | `CON-FND-030`,`038`,`041`,`042`,`048` | `BLOQUEANTE` | `PD-003`,`004`,`014`–`016` | 6 | Modelo de propriedade e isolamento |
| `CON-Q-026` | Como funciona o ciclo de conta: criação, convite, vínculo, remoção, recuperação, cancelamento, retenção e exclusão? | `PROD-Q-010`, `PROD-Q-013`, `PROD-Q-016`, `PROD-Q-017` | Produto/UX/dados | Produto, UX e dados | Escopo e ciclo de identidade/conta. | `CON-FND-033`,`042`,`048` | `ALTO` | `PD-003`–`005`,`014`–`016` | 6 | Requisitos, fluxo e política de ciclo |
| `CON-Q-027` | Quais regras de autenticação, sessão, bloqueio/logout, autorização por ação/recurso e isolamento se aplicam? | `PROD-Q-011`, `PROD-Q-012`, `PROD-Q-015`, `DAE-Q-024` | Domínio/segurança | Produto, dados, UX e arquitetura | Contrato de identidade, autorização e isolamento. | `CON-FND-031`,`032`,`036`,`038`,`056` | `BLOQUEANTE` | `PD-003`–`006`,`016` | 12 | Requisitos de segurança, matriz de autorização e API |
| `CON-Q-028` | Quais telas e itens opcionais/condicionais compõem o compromisso mínimo do MVP e o que é painel, estado ou futuro? | `PROD-Q-014`, `DAE-Q-005` | Produto/UX/backlog | Produto/UX/arquitetura | Fronteira aprovada do MVP. | `CON-FND-027`,`029`,`035`,`040`,`045` | `ALTO` | `PD-003`,`005`,`006` | 7 | Requisitos e roadmap governados |
| `CON-Q-029` | Como GPS trata permissão, baixa precisão, indisponibilidade e correção manual? | `PROD-Q-018` | Produto/UX/geoespacial | Produto/UX | Comportamento de captura. | `CON-FND-034`,`049` | `ALTO` | `PD-003`,`005` | 11 | Requisito/fluxo geoespacial |
| `CON-Q-030` | Quais dados operam offline, por quanto tempo, com qual proteção local e como sincronização/conflitos são resolvidos? | `PROD-Q-019`, `DAE-Q-028` | Produto/dados/arquitetura | Produto, dados e arquitetura | Escopo e contrato offline/sync. | `CON-FND-036`,`037`,`048`,`056` | `ALTO` | `PD-003`,`004`,`006` | 12 | Requisitos, dados e arquitetura futuros |
| `CON-Q-031` | IA integra o MVP ou fase futura e quais supervisão, explicabilidade e uso de dados se aplicam? | `PROD-Q-020` | Produto/UX/dados | Produto, UX e dados | Fase, finalidade, supervisão e dados. | `CON-FND-029`,`039`,`040` | `MEDIO` | `PD-003`–`005` | 7 | Backlog/roadmap se aprovada |
| `CON-Q-032` | Exportação de relatório existe e quais formatos, conteúdo, atores e fase se aplicam? | `PROD-Q-021` | Produto | Produto | Escopo, conteúdo e fase. | `CON-FND-029`,`035` | `MEDIO` | `PD-003` | 7 | Requisitos/backlog futuros |
| `CON-Q-033` | Como alertas são calculados/direcionados, quais severidades existem e qual ciclo de reconhecimento/encerramento se aplica? | `PROD-Q-022`, `DAE-Q-010` | Produto/dados/ciência | Científica, produto e dados | Regra, destinatário, enum e ciclo. | `CON-FND-020`,`041`,`048` | `BLOQUEANTE` | `PD-002`–`004` | 7 | Regra de produto e modelo de dados |
| `CON-Q-034` | O mapa agrega quais áreas, com quais filtros, visibilidade e tratamento de sobreposição? | `PROD-Q-023` | Produto/UX/dados | Produto, UX e dados | Semântica, acesso e agregação do mapa. | `CON-FND-038`,`049`,`055` | `ALTO` | `PD-003`–`005`,`014`–`016` | 11 | Requisitos/UX/contrato geoespacial |
| `CON-Q-035` | Como indicadores resumidos, potencial SAF e prioridade são derivados e atualizados? | `PROD-Q-024` | Ciência/produto | Científica e produto | Derivação, atualização e fonte científica. | `CON-FND-020`,`024`,`025` | `BLOQUEANTE` | `PD-002`,`003` | 7 | Ciência validada e requisitos futuros |
| `CON-Q-036` | Quais critérios verificáveis cobrem fluxo, autorização, validação, erros e alternativas, e quem os aprova? | `PROD-Q-025`, `DAE-Q-003` | Produto/UX/backlog | Produto/UX | Cobertura, autoridade e registro do aceite. | `CON-FND-032`,`034`–`036` | `BLOQUEANTE` | `PD-003`,`005` | 7 | Requisitos e critérios do backlog |
| `CON-Q-037` | Quais NFR de segurança, privacidade, desempenho, disponibilidade e observabilidade se aplicam e com quais métricas? | `PROD-Q-026`, `DAE-Q-027` | Produto/arquitetura | Produto, dados e arquitetura | Seleção e mensuração dos NFR. | `CON-FND-034`,`036`–`038` | `BLOQUEANTE` | `PD-003`,`004`,`006` | 12 | Catálogo de NFR e segurança |
| `CON-Q-038` | Qual é o estado de aprovação dos wireframes históricos e quem pode aprová-los? | `PROD-Q-027` | UX/governança | UX a designar | Estado, proveniência e autoridade. | `CON-FND-043`,`044`; `GAP-008` | `INFORMATIVO` | `PD-005`,`017` | 7 | Registro normativo de UX, se aplicável |
| `CON-Q-039` | Quais requisitos de acessibilidade, responsividade, vazio/loading, erro e confirmação devem ser aprovados? | `PROD-Q-028` | UX/produto | Produto/UX | Critérios transversais de UX. | `CON-FND-034`–`036` | `ALTO` | `PD-003`,`005` | 7 | Especificação UX e aceite |
| `CON-Q-040` | Quais critérios ordenam o backlog e quais estados/evidências sustentam pronto, bloqueado ou equivalentes? | `DAE-Q-001`, `DAE-Q-002` | Backlog | Produto | Prioridade, estado, evidência e governança. | `CON-FND-045` | `ALTO` | `PD-003` | 7 | Backlog governado |
| `CON-Q-041` | Como tratar histórias sem requisito direto e requisitos sem história direta? | `DAE-Q-004` | Backlog/produto | Produto | Política de cobertura e exceção. | `CON-FND-035`,`045`,`046` | `ALTO` | `PD-003` | 7 | Matriz requisito↔backlog |
| `CON-Q-042` | Quais PK, FK, uniques, cardinalidades, cascatas e constraints se aplicam? | `DAE-Q-011` | Dados | Dados | Modelo lógico e integridade. | `CON-FND-030`,`038`,`041`,`042`,`051` | `BLOQUEANTE` | `PD-004`,`014`–`016` | 8 | Modelo lógico normativo |
| `CON-Q-043` | Quais regras de rascunho, recálculo, invalidação, retenção e exclusão se aplicam? | `DAE-Q-012` | Dados/produto | Dados e produto | Ciclo de vida e retenção. | `CON-FND-038`,`041`,`048`,`050` | `BLOQUEANTE` | `PD-003`,`004` | 8 | Política de ciclo/retenção futura |
| `CON-Q-044` | Qual contrato define CRS, precisão, validade e proveniência de geometria/centroide? | `DAE-Q-013` | Dados/geoespacial | Dados e arquitetura | Contrato geoespacial. | `CON-FND-049`,`055`,`056` | `BLOQUEANTE` | `PD-004`,`006`,`013` | 8 | Contrato geoespacial |
| `CON-Q-045` | Como preservar snapshot imutável, proveniência, scores por variável e vínculo ao resultado? | `DAE-Q-016` | Dados/algoritmo | Dados e científica | Contrato de auditabilidade. | `CON-FND-002`,`024`–`026`,`050` | `BLOQUEANTE` | `PD-002`,`004` | 8 | Persistência/auditoria |
| `CON-Q-046` | Como persistir drivers e recomendações mantendo versão e vínculo ao resultado? | `DAE-Q-017` | Dados/saída | Dados, científica e produto | Modelo de persistência da saída interpretativa. | `CON-FND-025`,`026`,`050` | `BLOQUEANTE` | `PD-002`–`004` | 8 | Contrato de saída e persistência |
| `CON-Q-047` | O modelo pretendido separa módulos ambientais ou usa tabela única, e como reconciliar a granularidade? | `DAE-Q-021` | Dados/arquitetura | Dados e arquitetura | Estrutura de persistência. | `CON-FND-041`,`047`,`051` | `BLOQUEANTE` | `PD-004`,`006` | 8 | Modelo lógico e eventual ADR |
| `CON-Q-048` | Quais responsabilidades ficam em Next.js e Python/FastAPI, se Python for aprovado? | `DAE-Q-022` | Arquitetura | Arquitetura | Fronteira de componentes. | `CON-FND-052`,`056` | `BLOQUEANTE` | `PD-006`,`008`,`011` | 10 | ADR futuro, se aprovado |
| `CON-Q-049` | Quais endpoints, payloads, erros, versões, idempotência, autenticação e autorização formam a API canônica? | `DAE-Q-023` | Arquitetura/API | Produto, dados e arquitetura | Contrato de API. | `CON-FND-024`,`032`,`052`,`056` | `BLOQUEANTE` | `PD-003`,`004`,`006`,`011` | 9 | Contrato canônico de API |
| `CON-Q-050` | Qual composição de OpenStreetMap, Leaflet, Plotly ou alternativas documentadas será adotada e segundo quais critérios? | `DAE-Q-025` | Arquitetura/mapas | Arquitetura | Seleção/composição entre alternativas já registradas. | `CON-FND-049`,`055`,`056` | `MEDIO` | `PD-007`,`009`,`010`,`013` | 11 | ADR de mapas, se aprovado |
| `CON-Q-051` | Quais provedores e ambientes atendem desenvolvimento, staging e produção e qual estratégia futura de hospedagem se aplica? | `DAE-Q-026` | Arquitetura/operação | Arquitetura | Ambientes, provedores e evolução. | `CON-FND-036`,`052`,`056`,`057` | `ALTO` | `PD-012` | 13 | Política de ambientes/hospedagem |
| `CON-Q-052` | Quais datas, marcos, responsáveis, riscos e gates governam as fases do roadmap? | `DAE-Q-029` | Backlog/roadmap | Produto e arquitetura | Governança das fases, sem somar eixo de natureza. | `CON-FND-029`,`040`,`045` | `ALTO` | `PD-003`,`006` | 7 | Roadmap governado |

### Justificativas das perguntas agrupadas

| Pergunta | Justificativa da equivalência; limites preservados |
|---|---|
| `CON-Q-003` | A composição territorial e o papel específico de densidade de drenagem são a decisão geral e sua faceta de cadeia de dados. |
| `CON-Q-005` | Conceito, cardinalidade, scores e recorte geral/regional de APP/mata ciliar exigem a mesma validação científica. |
| `CON-Q-007` | Desenho de coleta e agregação matemática são passos contíguos da mesma transformação espacial. |
| `CON-Q-009` | Periodicidade, impossibilidade, missing, obrigatoriedade, mínimos e conjunto vazio integram uma política única; cada condição permanece enumerada. |
| `CON-Q-011` | As cinco origens perguntam pela fórmula oficial e pela relação entre composição geral e regional; fonte de aprovação e versão não são omitidas. |
| `CON-Q-013` | Delimitação geográfica e relação das escalas definem conjuntamente a aplicabilidade, sem presumir escopo institucional. |
| `CON-Q-014` | Intervalos contínuos e precisão/arredondamento são requisitos conjuntos de uma classificação numérica total e reproduzível. |
| `CON-Q-019` | Determinismo e versionamento governam a reprodução histórica do mesmo cálculo, preservando algoritmo, calibração e schema como objetos separados. |
| `CON-Q-020` | Nomes, campos obrigatórios e resultado insuficiente são partes do mesmo contrato de saída. |
| `CON-Q-022` | Público, sinônimos/subtipos e escopo dos cinco rótulos de papel formam uma taxonomia única; permissões ficam em `CON-Q-027`. |
| `CON-Q-024` | Existência, relacionamento e participação em organização/laboratório dependem do mesmo modelo conceitual. |
| `CON-Q-025` | Propriedade, compartilhamento/transferência, isolamento e histórico compõem uma fronteira única de Área/tenant. |
| `CON-Q-026` | Criação, convite, remoção, recuperação e cancelamento são eventos do mesmo ciclo de conta, todos preservados como subitens. |
| `CON-Q-027` | Autenticação, sessão, autorização por recurso e isolamento formam o contrato de acesso; as dimensões não são tratadas como sinônimas. |
| `CON-Q-028` | As duas perguntas buscam o compromisso mínimo do MVP e a fase de itens condicionais, sem aprovar qualquer tela. |
| `CON-Q-030` | Produto e arquitetura perguntam pelo mesmo contrato offline/sync; proteção local permanece requisito explícito. |
| `CON-Q-033` | Regra do alerta e enum/ciclo da entidade são facetas do mesmo comportamento de domínio. |
| `CON-Q-036` | Completude verificável dos critérios e autoridade para aprová-los são necessárias ao mesmo fechamento de aceite. |
| `CON-Q-037` | As duas origens perguntam quais NFR selecionar e como medi-los, em camadas complementares. |
| `CON-Q-040` | Prioridade, estado e evidência são metadados indivisíveis para governança do backlog. |

### Cobertura das 88 perguntas de origem

| Pergunta de origem | Etapa | Pergunta consolidada | Tipo de relação | Observação |
|---|---:|---|---|---|
| `SCI-Q-001` | 4 | `CON-Q-003` | `ORIGEM_PRIMARIA_CONVERGENTE` | Composição territorial. |
| `SCI-Q-002` | 4 | `CON-Q-004` | `ORIGEM_PRIMARIA_UNICA` | Cinco variáveis sem protocolo. |
| `SCI-Q-003` | 4 | `CON-Q-005` | `ORIGEM_PRIMARIA_CONVERGENTE` | APP/mata ciliar. |
| `SCI-Q-004` | 4 | `CON-Q-006` | `ORIGEM_PRIMARIA_UNICA` | Solo exposto. |
| `SCI-Q-005` | 4 | `CON-Q-007` | `ORIGEM_PRIMARIA_CONVERGENTE` | Amostragem/agregação. |
| `SCI-Q-006` | 4 | `CON-Q-008` | `ORIGEM_PRIMARIA_UNICA` | Métodos/instrumentos. |
| `SCI-Q-007` | 4 | `CON-Q-009` | `ORIGEM_PRIMARIA_CONVERGENTE` | Temporalidade/missing/QC. |
| `SCI-Q-008` | 4 | `CON-Q-010` | `ORIGEM_PRIMARIA_UNICA` | Normalização. |
| `SCI-Q-009` | 4 | `CON-Q-011` | `ORIGEM_PRIMARIA_CONVERGENTE` | Fórmula/pesos. |
| `SCI-Q-010` | 4 | `CON-Q-014` | `ORIGEM_PRIMARIA_CONVERGENTE` | Classes/precisão. |
| `SCI-Q-011` | 4 | `CON-Q-013` | `ORIGEM_PRIMARIA_CONVERGENTE` | Território/escalas. |
| `SCI-Q-012` | 4 | `CON-Q-015` | `ORIGEM_PRIMARIA_UNICA` | Terminologia científica. |
| `MATH-Q-001` | 5 | `CON-Q-011` | `ORIGEM_PRIMARIA_CONVERGENTE` | Fórmula oficial. |
| `MATH-Q-002` | 5 | `CON-Q-011` | `ORIGEM_PRIMARIA_CONVERGENTE` | Pesos/versões. |
| `MATH-Q-003` | 5 | `CON-Q-011` | `ORIGEM_PRIMARIA_CONVERGENTE` | Relação geral–regional. |
| `MATH-Q-004` | 5 | `CON-Q-002` | `ORIGEM_PRIMARIA_UNICA` | Autoridade/calibração. |
| `MATH-Q-005` | 5 | `CON-Q-013` | `ORIGEM_PRIMARIA_CONVERGENTE` | Limites geográficos. |
| `MATH-Q-006` | 5 | `CON-Q-012` | `ORIGEM_PRIMARIA_UNICA` | Evidência empírica. |
| `MATH-Q-007` | 5 | `CON-Q-016` | `ORIGEM_PRIMARIA_UNICA` | Clamp/bloqueio. |
| `MATH-Q-008` | 5 | `CON-Q-014` | `ORIGEM_PRIMARIA_CONVERGENTE` | Precisão/arredondamento. |
| `MATH-Q-009` | 5 | `CON-Q-014` | `ORIGEM_PRIMARIA_CONVERGENTE` | Intervalos contínuos. |
| `MATH-Q-010` | 5 | `CON-Q-009` | `ORIGEM_PRIMARIA_CONVERGENTE` | Required/missing. |
| `MATH-Q-011` | 5 | `CON-Q-009` | `ORIGEM_PRIMARIA_CONVERGENTE` | Mínimos/conjunto vazio. |
| `MATH-Q-012` | 5 | `CON-Q-007` | `ORIGEM_PRIMARIA_CONVERGENTE` | Agregação espacial. |
| `MATH-Q-013` | 5 | `CON-Q-017` | `ORIGEM_PRIMARIA_UNICA` | Categoria/tipo/unidade. |
| `MATH-Q-014` | 5 | `CON-Q-018` | `ORIGEM_PRIMARIA_UNICA` | Precedência documental. |
| `MATH-Q-015` | 5 | `CON-Q-019` | `ORIGEM_PRIMARIA_CONVERGENTE` | Reprodutibilidade. |
| `MATH-Q-016` | 5 | `CON-Q-020` | `ORIGEM_PRIMARIA_CONVERGENTE` | Saídas canônicas. |
| `MATH-Q-017` | 5 | `CON-Q-021` | `ORIGEM_PRIMARIA_UNICA` | `data_quality`. |
| `MATH-Q-018` | 5 | `CON-Q-005` | `ORIGEM_PRIMARIA_CONVERGENTE` | APP geral/regional. |
| `PROD-Q-001` | 6 | `CON-Q-022` | `ORIGEM_PRIMARIA_CONVERGENTE` | Público/papéis. |
| `PROD-Q-002` | 6 | `CON-Q-022` | `ORIGEM_PRIMARIA_CONVERGENTE` | Administrador/Técnico. |
| `PROD-Q-003` | 6 | `CON-Q-022` | `ORIGEM_PRIMARIA_CONVERGENTE` | Técnico/parceiro. |
| `PROD-Q-004` | 6 | `CON-Q-022` | `ORIGEM_PRIMARIA_CONVERGENTE` | Usuário de Campo. |
| `PROD-Q-005` | 6 | `CON-Q-023` | `ORIGEM_PRIMARIA_UNICA` | Pessoa/conta/assinante. |
| `PROD-Q-006` | 6 | `CON-Q-024` | `ORIGEM_PRIMARIA_CONVERGENTE` | Organização/laboratório. |
| `PROD-Q-007` | 6 | `CON-Q-024` | `ORIGEM_PRIMARIA_CONVERGENTE` | Participação/papéis. |
| `PROD-Q-008` | 6 | `CON-Q-025` | `ORIGEM_PRIMARIA_CONVERGENTE` | Propriedade de Área. |
| `PROD-Q-009` | 6 | `CON-Q-025` | `ORIGEM_PRIMARIA_CONVERGENTE` | Compartilhamento/transferência. |
| `PROD-Q-010` | 6 | `CON-Q-026` | `ORIGEM_PRIMARIA_CONVERGENTE` | Criação/vínculo/remoção. |
| `PROD-Q-011` | 6 | `CON-Q-027` | `ORIGEM_PRIMARIA_CONVERGENTE` | Ações por recurso. |
| `PROD-Q-012` | 6 | `CON-Q-027` | `ORIGEM_PRIMARIA_CONVERGENTE` | Isolamento. |
| `PROD-Q-013` | 6 | `CON-Q-026` | `ORIGEM_PRIMARIA_CONVERGENTE` | Cancelamento/retenção. |
| `PROD-Q-014` | 6 | `CON-Q-028` | `ORIGEM_PRIMARIA_CONVERGENTE` | Cinco telas/futuro. |
| `PROD-Q-015` | 6 | `CON-Q-027` | `ORIGEM_PRIMARIA_CONVERGENTE` | Autenticação/sessão. |
| `PROD-Q-016` | 6 | `CON-Q-026` | `ORIGEM_PRIMARIA_CONVERGENTE` | Recuperação de senha. |
| `PROD-Q-017` | 6 | `CON-Q-026` | `ORIGEM_PRIMARIA_CONVERGENTE` | Criação de conta. |
| `PROD-Q-018` | 6 | `CON-Q-029` | `ORIGEM_PRIMARIA_UNICA` | GPS. |
| `PROD-Q-019` | 6 | `CON-Q-030` | `ORIGEM_PRIMARIA_CONVERGENTE` | Offline/sync. |
| `PROD-Q-020` | 6 | `CON-Q-031` | `ORIGEM_PRIMARIA_UNICA` | IA. |
| `PROD-Q-021` | 6 | `CON-Q-032` | `ORIGEM_PRIMARIA_UNICA` | Relatórios. |
| `PROD-Q-022` | 6 | `CON-Q-033` | `ORIGEM_PRIMARIA_CONVERGENTE` | Alertas. |
| `PROD-Q-023` | 6 | `CON-Q-034` | `ORIGEM_PRIMARIA_UNICA` | Semântica do mapa. |
| `PROD-Q-024` | 6 | `CON-Q-035` | `ORIGEM_PRIMARIA_UNICA` | Indicadores. |
| `PROD-Q-025` | 6 | `CON-Q-036` | `ORIGEM_PRIMARIA_CONVERGENTE` | Critérios de aceitação. |
| `PROD-Q-026` | 6 | `CON-Q-037` | `ORIGEM_PRIMARIA_CONVERGENTE` | NFR. |
| `PROD-Q-027` | 6 | `CON-Q-038` | `ORIGEM_PRIMARIA_UNICA` | Aprovação de wireframes. |
| `PROD-Q-028` | 6 | `CON-Q-039` | `ORIGEM_PRIMARIA_UNICA` | UX transversal. |
| `DAE-Q-001` | 7 | `CON-Q-040` | `ORIGEM_PRIMARIA_CONVERGENTE` | Prioridade. |
| `DAE-Q-002` | 7 | `CON-Q-040` | `ORIGEM_PRIMARIA_CONVERGENTE` | Estados/evidências. |
| `DAE-Q-003` | 7 | `CON-Q-036` | `ORIGEM_PRIMARIA_CONVERGENTE` | Autoridade/aceite. |
| `DAE-Q-004` | 7 | `CON-Q-041` | `ORIGEM_PRIMARIA_UNICA` | Lacunas bidirecionais. |
| `DAE-Q-005` | 7 | `CON-Q-028` | `ORIGEM_PRIMARIA_CONVERGENTE` | Compromisso mínimo do MVP. |
| `DAE-Q-006` | 7 | `CON-Q-022` | `ORIGEM_PRIMARIA_CONVERGENTE` | `technician`. |
| `DAE-Q-007` | 7 | `CON-Q-024` | `ORIGEM_PRIMARIA_CONVERGENTE` | Organização/laboratório/assinante/membro. |
| `DAE-Q-008` | 7 | `CON-Q-025` | `ORIGEM_PRIMARIA_CONVERGENTE` | Ownership/isolamento. |
| `DAE-Q-009` | 7 | `CON-Q-025` | `ORIGEM_PRIMARIA_CONVERGENTE` | Compartilhamento/histórico. |
| `DAE-Q-010` | 7 | `CON-Q-033` | `ORIGEM_PRIMARIA_CONVERGENTE` | `ALERTS.severity`/ciclo. |
| `DAE-Q-011` | 7 | `CON-Q-042` | `ORIGEM_PRIMARIA_UNICA` | Chaves/cardinalidades. |
| `DAE-Q-012` | 7 | `CON-Q-043` | `ORIGEM_PRIMARIA_UNICA` | Ciclo/retenção. |
| `DAE-Q-013` | 7 | `CON-Q-044` | `ORIGEM_PRIMARIA_UNICA` | CRS/precisão/proveniência. |
| `DAE-Q-014` | 7 | `CON-Q-009` | `ORIGEM_PRIMARIA_CONVERGENTE` | Obrigatoriedade das 17 variáveis. |
| `DAE-Q-015` | 7 | `CON-Q-003` | `ORIGEM_PRIMARIA_CONVERGENTE` | Densidade de drenagem. |
| `DAE-Q-016` | 7 | `CON-Q-045` | `ORIGEM_PRIMARIA_UNICA` | Snapshot/proveniência/scores. |
| `DAE-Q-017` | 7 | `CON-Q-046` | `ORIGEM_PRIMARIA_UNICA` | Drivers/recomendações. |
| `DAE-Q-018` | 7 | `CON-Q-020` | `ORIGEM_PRIMARIA_CONVERGENTE` | Resultado insuficiente. |
| `DAE-Q-019` | 7 | `CON-Q-019` | `ORIGEM_PRIMARIA_CONVERGENTE` | Versionamento. |
| `DAE-Q-020` | 7 | `CON-Q-011` | `ORIGEM_PRIMARIA_CONVERGENTE` | Fórmula/aplicabilidade. |
| `DAE-Q-021` | 7 | `CON-Q-047` | `ORIGEM_PRIMARIA_UNICA` | Persistência modular/única. |
| `DAE-Q-022` | 7 | `CON-Q-048` | `ORIGEM_PRIMARIA_UNICA` | Responsabilidades backend. |
| `DAE-Q-023` | 7 | `CON-Q-049` | `ORIGEM_PRIMARIA_UNICA` | Contrato de API. |
| `DAE-Q-024` | 7 | `CON-Q-027` | `ORIGEM_PRIMARIA_CONVERGENTE` | Autenticação/autorização/isolamento. |
| `DAE-Q-025` | 7 | `CON-Q-050` | `ORIGEM_PRIMARIA_UNICA` | Composição de mapas. |
| `DAE-Q-026` | 7 | `CON-Q-051` | `ORIGEM_PRIMARIA_UNICA` | Provedores/ambientes. |
| `DAE-Q-027` | 7 | `CON-Q-037` | `ORIGEM_PRIMARIA_CONVERGENTE` | NFR/segurança. |
| `DAE-Q-028` | 7 | `CON-Q-030` | `ORIGEM_PRIMARIA_CONVERGENTE` | Offline/sync/proteção local. |
| `DAE-Q-029` | 7 | `CON-Q-052` | `ORIGEM_PRIMARIA_UNICA` | Roadmap. |
| `DAE-Q-030` | 7 | `CON-Q-001` | `ORIGEM_PRIMARIA_UNICA` | Autoridades/destinos. |

Resultado mecânico: 88/88 origens, uma vez cada como vínculo primário; zero omissões e zero duplicações primárias. As 88 perguntas convergem para 52 perguntas únicas.

## Pacotes de decisão

Os pacotes abaixo não respondem perguntas nem escolhem alternativas. A ordem é `RECOMENDACAO` de processo. Um problema pode sustentar mais de um pacote como dependência sem voltar a ser contado como origem.

### Escopo decisório e evidências

| Pacote | Assunto e objetivo da decisão | Autoridade necessária | Pendências | Achados consolidados | Perguntas consolidadas | Fontes relevantes | Alternativas já documentadas |
|---|---|---|---|---|---|---|---|
| `DEC-PKG-001` | Autoridade e escopo institucional — confirmar autoridade, fonte aplicável, vigência e recortes territoriais. | Equipe; autoridade institucional a designar | `PD-001` | `CON-FND-016`,`017`,`043` | `CON-Q-001`,`013` | `SOURCE_AUTHORITY.md`, `PENDING_DECISIONS.md`, `DOC-009`,`010`,`012` | Pessoa ou grupo a designar; demais alternativas não especificadas. |
| `DEC-PKG-002` | Autoridade científica — estabelecer quem valida e qual evidência registra a aprovação. | Científica a designar | `PD-002` | `CON-FND-001`,`018`–`023` | `CON-Q-002`,`012`,`015` | `DOC-009`,`010`,`011`; `SOURCE_AUTHORITY.md` | Responsável ou grupo científico a designar; alternativas não especificadas. |
| `DEC-PKG-003` | Fórmula, pesos, normalização, classes e calibração — fechar o contrato científico/matemático. | Científica | `PD-001`,`002` | `CON-FND-002`–`004`,`006`,`007`,`011`–`016`,`023`–`025`,`050` | `CON-Q-003`,`005`,`006`,`010`–`021` | `DOC-009`,`010`,`012` | Média/pesos equivalentes; pesos diferenciais regionais; clamp ou bloqueio; classes de `data_quality` já divergentes. |
| `DEC-PKG-004` | Protocolo e qualidade dos dados — definir coleta, amostra, instrumentos, missing e QC. | Científica/protocolar; dados depois | `PD-002`,`004` | `CON-FND-005`,`008`–`010`,`026` | `CON-Q-004`,`007`–`009`,`045`,`046` | `DOC-009`,`010`,`012` | Métodos/instrumentos e alternativas já inventariados em `DOC-009`; nenhuma escolha aprovada. |
| `DEC-PKG-005` | Terminologia e modelo de domínio — normalizar conceitos antes da estrutura lógica. | Produto e dados | `PD-003`,`004`,`014`,`015` | `CON-FND-018`,`030`,`042`,`047` | `CON-Q-015`,`022`–`024` | `DOC-009`,`011`,`012` | Pessoa, usuário, conta, assinante, Área e propriedade são termos documentados; equivalências não decididas. |
| `DEC-PKG-006` | Papéis, laboratórios, propriedade e isolamento — aprovar atores, relações, participação e autorização. | Produto, dados e UX | `PD-003`–`005`,`014`–`016` | `CON-FND-031`,`032`,`038`,`041`,`042`,`048` | `CON-Q-022`,`024`–`027`,`042`,`043` | `DOC-011`,`012` | Taxonomias documentadas de papéis; modelos alternativos de laboratório/tenant não especificados. |
| `DEC-PKG-007` | Escopo do MVP e requisitos — fechar compromisso mínimo, fluxos, critérios, backlog e propostas futuras. | Produto e UX; arquitetura para fase | `PD-003`,`005`,`006`,`017` | `CON-FND-027`–`029`,`033`–`035`,`039`,`040`,`044`–`046` | `CON-Q-026`,`028`,`031`–`036`,`038`–`041`,`052` | `DOC-011`,`012`; `GAP-008` | Núcleo de cinco telas; análise/IA como possibilidade; shapefile/camadas e expansões futuras; Figma opcional. |
| `DEC-PKG-008` | Modelo de dados — aprovar conceitos, chaves, ciclos, geoespacial, versões, granularidade e auditabilidade. | Dados, com ciência/produto/arquitetura | `PD-002`–`004`,`006`,`014`–`016` | `CON-FND-024`,`026`,`038`,`041`,`042`,`047`–`051` | `CON-Q-020`,`025`,`042`–`047` | `DOC-010`–`012` | Entidades modulares versus tabela ambiental única; representações históricas de resultado. |
| `DEC-PKG-009` | Contratos de API e integração — definir interface canônica sem escolher a arquitetura subjacente. | Produto, dados e arquitetura | `PD-003`,`004`,`006`,`008`,`011` | `CON-FND-024`,`052`,`056` | `CON-Q-049` | `DOC-012`; `TD-009`,`012` | Estratégias de integração não especificadas; rotas históricas não formam contrato aprovado. |
| `DEC-PKG-010` | Arquitetura Next.js/Python — delimitar componentes somente se as tecnologias forem aprovadas. | Arquitetura | `PD-006`,`008`,`011` | `CON-FND-052`–`054`,`056` | `CON-Q-048`,`049` | `DOC-012`; `TECH_DECISIONS.md` | Next.js relatado; Python/FastAPI como alternativa/relato; Prisma/Neon relatados sem comparação nas fontes da Etapa 7. |
| `DEC-PKG-011` | Mapas e geoprocessamento — decidir requisitos geoespaciais e depois composição tecnológica. | Produto, dados, UX e arquitetura | `PD-004`,`006`,`007`,`009`,`010`,`013` | `CON-FND-040`,`049`,`055`,`056` | `CON-Q-029`,`034`,`044`,`050` | `DOC-011`,`012`; `TECH_DECISIONS.md` | OpenStreetMap, Plotly e Leaflet; nenhuma composição aprovada. |
| `DEC-PKG-012` | Autenticação, offline e NFR — definir comportamento, métricas, segurança e resiliência. | Produto, UX, dados e arquitetura | `PD-003`–`006`,`016` | `CON-FND-032`–`038`,`048`,`056` | `CON-Q-026`,`027`,`030`,`037`,`039` | `DOC-011`,`012` | “Não perder dados” como mínimo; rascunho/sincronização como ideal; demais alternativas não especificadas. |
| `DEC-PKG-013` | Hospedagem e implantação — separar relato atual de estratégia futura e ambientes. | Arquitetura | `PD-006`,`012` | `CON-FND-036`,`052`,`057`,`058` | `CON-Q-051` | `DOC-012`; `TECH_DECISIONS.md` | Vercel é escolha relatada para a aplicação; hospedagem futura não definida. |
| `DEC-PKG-014` | Destinos normativos — registrar onde cada decisão aprovada será mantida sem converter auditoria em norma. | Equipe e autoridades por assunto | `PD-001`–`006` | `CON-FND-020`,`021`,`043` | `CON-Q-001`,`002` | `SOURCE_AUTHORITY.md`, `PENDING_DECISIONS.md`, `GAP-009` | Destinos condicionais existentes; alternativas completas não especificadas. |
| `DEC-PKG-015` | Critérios para PRD — definir pré-condições, autoridade, entradas e rastreabilidade antes de produzir o documento. | Institucional, produto e demais autoridades afetadas | `PD-001`–`006`,`014`–`016` | `CON-FND-027`,`029`,`035`,`036`,`045`,`046` | `CON-Q-028`,`036`,`037`,`040`,`041`,`052` | `DOC-011`,`012`,`DOC-013` | Nenhum PRD ou conjunto de critérios aprovado foi identificado no corpus de controle. |

### Informações faltantes, dependências e encaminhamento

| Pacote | Informações ausentes | Pré-requisitos | Decisões dependentes | Impacto se adiado | Camadas afetadas | Documentos que poderão ser atualizados depois | Ordem |
|---|---|---|---|---|---|---|---:|
| `DEC-PKG-001` | Fonte institucional aprovada, vigência, responsável e escopo. | Origem formal da designação. | Todos os recortes dependentes do escopo. | Aplicabilidade normativa permanece indeterminada. | Institucional, ciência, produto | `SOURCE_AUTHORITY.md` e documento institucional aplicável | 1 |
| `DEC-PKG-002` | Responsável, critérios, evidência e registro de aprovação. | `DEC-PKG-001` quando o território for material. | Pacotes 3 e 4; dependências científicas de 7 e 8. | Ciência histórica não pode virar norma. | Ciência, campo, algoritmo, produto | `SOURCE_AUTHORITY.md`, futuras normas científicas | 2 |
| `DEC-PKG-003` | Fórmula oficial, pesos, versão, relação regional, validações, classes e base empírica. | Pacotes 1 e 2. | Pacotes 4, 7 e 8. | Cálculo, saída e persistência não podem ser normatizados. | Ciência, matemática, algoritmo, dados | Contrato matemático/algoritmo normativos futuros | 3 |
| `DEC-PKG-004` | Amostra, método, precisão, periodicidade, missing, QC e agregação. | Pacotes 2 e 3. | Pacotes 7, 8 e 12. | Entrada e qualidade permanecem não reproduzíveis. | Campo, ciência, dados, produto | Protocolo, contrato de entrada e política de qualidade | 4 |
| `DEC-PKG-005` | Definições, equivalências e identidade dos conceitos. | Pacotes 1 e 2 quando termos científicos/institucionais. | Pacotes 6 a 8. | Modelo e requisitos continuam semanticamente instáveis. | Ciência, produto, domínio, dados | Glossário e modelo conceitual futuros | 5 |
| `DEC-PKG-006` | Cardinalidades, propriedade, compartilhamento, participação, tenant e permissões. | Pacote 5; designação de produto/dados/UX. | Pacotes 7, 8 e 12. | Autorização, isolamento e ciclo não podem ser aprovados. | Produto, domínio, UX, dados | Modelo conceitual, matriz de autorização e requisitos | 6 |
| `DEC-PKG-007` | Escopo mínimo, prioridade, critérios, estados, fase e aprovação UX. | Pacotes 2 a 6 conforme dependências. | Pacotes 8 a 12 e 15. | Backlog não equivale a requisito aprovado e MVP fica aberto. | Produto, UX, backlog, ciência | Requisitos normativos, backlog/roadmap governados, UX aprovada | 7 |
| `DEC-PKG-008` | Modelo conceitual/lógico, ciclo, versões, geoespacial e auditabilidade. | Pacotes 3 a 7. | Pacotes 9 a 13. | Persistência e contratos não podem ser normatizados. | Dados, domínio, ciência, arquitetura | Modelo de dados normativo e política de ciclo/versão | 8 |
| `DEC-PKG-009` | Rotas, payloads, erros, auth, versão, idempotência e responsabilidades. | Pacotes 7 e 8. | Pacotes 10 a 13. | Integração continua não testável documentalmente. | Produto, dados, arquitetura | Contrato de API e eventual ADR | 9 |
| `DEC-PKG-010` | Fronteiras, critérios e estado de aprovação das tecnologias. | Pacote 9; autoridade de arquitetura. | Pacotes 11 a 13. | Componentes e implantação permanecem propostas/relatos. | Arquitetura, algoritmo, dados | `TECH_DECISIONS.md` e ADR futuro, se aprovado | 10 |
| `DEC-PKG-011` | Requisitos geoespaciais, critérios de seleção e composição. | Pacotes 6 a 10. | Pacote 13. | Mapa não tem contrato funcional/técnico consolidado. | Produto, UX, dados, arquitetura | Requisitos, contrato geoespacial e ADR de mapas | 11 |
| `DEC-PKG-012` | Políticas de identidade/offline e metas mensuráveis de NFR. | Pacotes 6 a 10. | Pacote 13 e critérios de aceite. | Segurança, resiliência e qualidade não são verificáveis. | Produto, UX, dados, arquitetura | Requisitos, NFR, segurança e contratos técnicos | 12 |
| `DEC-PKG-013` | Ambientes, provedores, operação, observabilidade e estratégia futura. | Pacotes 9 a 12. | Inspeção futura e implantação normativa. | Estado operacional e estratégia não podem ser avaliados. | Arquitetura, operação, implementação futura | Política de ambientes, ADR e documentação de implantação | 13 |
| `DEC-PKG-014` | Tipo, dono, vigência e processo de cada destino. | Pacotes 1 a 13 conforme assunto. | Pacote 15 e qualquer atualização normativa. | Decisões podem ficar sem registro canônico. | Todas | Registros canônicos definidos pela equipe | 14 |
| `DEC-PKG-015` | Objetivo do PRD, autoridade, entradas aprovadas, política de versão e critério de pronto. | Pacotes 1 a 14. | Produção futura do PRD. | PRD prematuro poderia misturar histórico, proposta e norma. | Institucional, produto e transversal | Futuro `PRD.md`, somente após autorização | 15 |

## Ordem de dependência recomendada

`RECOMENDACAO` — A sequência abaixo reduz decisões tomadas sobre bases ainda não autorizadas; não escolhe mérito, alternativa ou responsável.

| Ordem | Análise humana recomendada | Pacote principal | Condição de saída processual |
|---:|---|---|---|
| 1 | Autoridade e escopo institucional | `DEC-PKG-001` | Origem, autoridade, vigência e recorte registrados. |
| 2 | Autoridade científica | `DEC-PKG-002` | Responsável e evidência de validação definidos. |
| 3 | Fórmula, pesos, normalização, classes e calibração | `DEC-PKG-003` | Decisões científicas versionadas, inclusive conflitos estritos. |
| 4 | Protocolo de campo e qualidade dos dados | `DEC-PKG-004` | Coleta, missing, QC e agregação especificados. |
| 5 | Terminologia e modelo de domínio | `DEC-PKG-005` | Glossário e identidades conceituais aprovados. |
| 6 | Papéis, laboratórios, propriedade e isolamento | `DEC-PKG-006` | Relações e fronteiras de acesso aprovadas. |
| 7 | Escopo do MVP e requisitos | `DEC-PKG-007` | Compromisso mínimo e critérios verificáveis aprovados. |
| 8 | Modelo de dados | `DEC-PKG-008` | Modelo conceitual/lógico, ciclo e versões aprovados. |
| 9 | Contratos de API e integração | `DEC-PKG-009` | Interface canônica aprovada. |
| 10 | Arquitetura Next.js/Python | `DEC-PKG-010` | Responsabilidades e alternativas registradas por decisão. |
| 11 | Mapas e geoprocessamento | `DEC-PKG-011` | Requisitos precedem a composição tecnológica. |
| 12 | Autenticação, offline e requisitos não funcionais | `DEC-PKG-012` | Políticas e métricas verificáveis aprovadas. |
| 13 | Hospedagem e implantação | `DEC-PKG-013` | Ambientes e estratégia operacional aprovados. |
| 14 | Destinos normativos | `DEC-PKG-014` | Cada decisão possui documento canônico e processo de atualização. |
| 15 | Critérios para PRD | `DEC-PKG-015` | Autoridade, entradas e critério de pronto aprovados antes da redação. |

## Matriz de prontidão documental

`INFERENCIA` — A matriz avalia somente prontidão dos documentos auditados para futura normatização. `PARCIALMENTE_APTO` indica material analítico utilizável, nunca autorização para publicar norma. Nenhuma camada foi classificada `APTO_PARA_NORMATIZACAO` porque todas dependem de autoridade ou decisão material.

| Camada | Estado | Evidências | Bloqueios | Autoridade pendente | Decisões necessárias | Documentos de origem | Próximo passo |
|---|---|---|---|---|---|---|---|
| Escopo institucional | `NAO_APTO` | `GAP-010`; `CON-FND-016`,`017`,`043` | Nenhum nó classificado como documento institucional aprovado. | `PD-001` | Fonte, vigência, responsável e recorte. | Controles; nenhum nó institucional aprovado identificado no corpus | `DEC-PKG-001` |
| Ciência fundamental | `PARCIALMENTE_APTO` | Inventários e achados de `DOC-009`,`010` | Composição, aplicabilidade, proveniência e validação. | `PD-002` | Modelo, terminologia e base científica. | `DOC-RAW-007`–`010`,`013` via relatórios | `DEC-PKG-002`,`003` |
| Protocolo de campo | `NAO_APTO` | Inventário protocolar de `DOC-009` | Cinco variáveis, amostra, métodos, periodicidade, missing e QC. | `PD-002` | Procedimentos e qualidade. | `DOC-RAW-011` via `DOC-009` | `DEC-PKG-004` |
| Contrato matemático | `NAO_APTO` | Fórmulas/testes documentais de `DOC-010` | Dois conflitos, pesos, regionalização, classes e calibração. | `PD-002` | Contrato científico versionado. | `DOC-RAW-010`,`013` via `DOC-010` | `DEC-PKG-003` |
| Algoritmo operacional | `PARCIALMENTE_APTO` | Passos/entradas/saídas inventariados em `DOC-010` | Validação, missing, saída, determinismo e versão. | `PD-002`; produto/dados depois | Comportamentos e contrato reprodutível. | `DOC-RAW-002` via `DOC-010` | `DEC-PKG-003`,`004` |
| Produto e requisitos | `PARCIALMENTE_APTO` | Núcleo funcional e 60 candidatos de `DOC-011`; backlog de `DOC-012` | Autoridade, MVP, aceite, NFR e dependências científicas. | `PD-003` | Requisitos e escopo aprovados. | `DOC-RAW-003`,`004` via relatórios | `DEC-PKG-007` |
| Domínio e permissões | `NAO_APTO` | Conceitos históricos de `DOC-011`,`012` | Papéis, laboratório, propriedade, cardinalidade, autorização e isolamento. | `PD-003`,`004`,`014`–`016` | Glossário/modelo/permissões. | `DOC-RAW-004`,`005`,`014` via relatórios | `DEC-PKG-005`,`006` |
| UX | `PARCIALMENTE_APTO` | Cinco telas históricas e matriz de cobertura de `DOC-011` | Autoridade, estados, acessibilidade, aceite e identidade. | `PD-005`,`017` | Fluxos/estados aprovados; Figma continua opcional. | `DOC-RAW-014` via `DOC-011` | `DEC-PKG-007`,`012` |
| Dados | `NAO_APTO` | 9 entidades, 69 campos, 10 relações e 19 regras em `DOC-012` | Modelo, ciclo, isolamento, geoespacial, auditabilidade, versão e granularidade. | `PD-004`,`014`–`016` | Modelo conceitual/lógico e governança. | `DOC-RAW-005` via `DOC-012` | `DEC-PKG-008` |
| Arquitetura | `PARCIALMENTE_APTO` | 49 declarações/ausências e 49 itens de roadmap em `DOC-012` | Autoridade, backend, API, mapas, NFR e hospedagem. | `PD-006`–`013` | Decisões/ADRs futuros e contratos. | `DOC-RAW-006`,`012` via `DOC-012` | `DEC-PKG-009`–`013` |
| Backlog | `PARCIALMENTE_APTO` | 9 épicos/34 histórias inventariados em `DOC-012` | Prioridade, estado, cobertura, gates e aprovação. | `PD-003` | Governança e relação com requisitos. | `DOC-RAW-003` via `DOC-012` | `DEC-PKG-007` |
| PRD | `NAO_APTO` | Apenas critérios de dependência desta consolidação | Autoridades, conteúdo normativo e destinos ainda pendentes. | `PD-001`–`006`,`014`–`016` | Objetivo, escopo, entradas, autoridade e pronto. | Nenhum PRD identificado no corpus de controle | `DEC-PKG-014`,`015` |

## Rastreabilidade transversal e atualização da matriz global

A atualização de `TRACEABILITY_MATRIX.md` preserva os 13 nós, `TR-001`–`016` e `GAP-001`–`010`. As 14 relações antes preliminares receberam evidência analítica das Etapas 4 a 7 e estado `VERIFICADA_ANALITICAMENTE`, sempre como `INFERENCIA`; isso não cria dependência, precedência ou autoridade normativa. Foram acrescentadas seis relações `TR-017`–`022` e seis lacunas `GAP-011`–`016`.

| Conjunto | Antes | Reclassificado/confirmado | Novo | Total final |
|---|---:|---:|---:|---:|
| Nós documentais | 13 | 13 preservados | 0 | 13 |
| Relações | 16 | 14 inferenciais verificadas analiticamente; 2 explícitas preservadas | 6 | 22 |
| Lacunas | 10 | `GAP-001`/`007` verificadas analiticamente; demais preservadas | 6 | 16 |

Novas relações:

- `TR-017`: matriz de variáveis ↔ modelo conceitual, sobreposição temática (`INFERENCIA`, `DOC-009`).
- `TR-018`: modelo científico ↔ protocolo, sobreposição temática e cobertura parcial (`INFERENCIA`, `DOC-009`).
- `TR-019`: modelo regional ↔ protocolo, sobreposição de formulação/procedimentos regionais (`INFERENCIA`, `DOC-009`,`010`).
- `TR-020`: requisitos ↔ contrato matemático, dependência científica analítica para cálculo/resultado (`INFERENCIA`, `DOC-011`).
- `TR-021`: backlog ↔ roadmap, sobreposição de fase e futuro (`INFERENCIA`, `DOC-012`).
- `TR-022`: requisitos ↔ modelo conceitual científico, sobreposição entre diagnóstico/produto e conceitos do IHFR (`INFERENCIA`, `DOC-009`,`011`).

Novas lacunas transversais, sem criar novas decisões:

- `GAP-011`: cadeia ciência→campo→entrada→algoritmo incompleta; destino `DEC-PKG-003`,`004`,`008`.
- `GAP-012`: domínio, papéis, tenant, cardinalidades e ciclo incompletos; destino `DEC-PKG-005`,`006`,`008`.
- `GAP-013`: requisitos, UX, aceite e NFR incompletos; destino `DEC-PKG-007`,`012`.
- `GAP-014`: contratos de dados, API e arquitetura incompletos; destino `DEC-PKG-008`–`010`.
- `GAP-015`: governança de backlog e roadmap incompleta; destino `DEC-PKG-007`,`015`.
- `GAP-016`: inspeção de implementação pendente; destino exclusivo na futura inspeção autorizada, `CODE-CHECK-001`–`018`.

As lacunas descrevem rupturas transversais de rastreabilidade; as decisões materiais continuam cobertas por `PD-001`–`017`, sem duplicação.

## Escopo institucional

`GAP-010` e `PD-001` permanecem abertos. Nenhum dos 13 documentos do corpus foi classificado no registro ou nos relatórios como documento institucional aprovado. Esta formulação não afirma que tal documento inexista fora do corpus e não converte falta de classificação em inexistência. Nenhuma nova auditoria ampla de `docs/raw/` foi realizada. O impacto é que alterações normativas dependentes de identidade, vigência, região ou escala devem aguardar fonte e autoridade institucional registradas.

## Figma e UX

`DECISAO_CONFIRMADA` — Figma continua opcional, secundário e não bloqueante. `GAP-008` permanece `OPCIONAL_NAO_BLOQUEANTE`; `PD-017` permanece `ABERTA`. Nenhum arquivo, página, frame, tela ou fluxo concreto foi apresentado ou auditado. A ausência de Figma e a ausência de uma tela implementada não constituem divergência. Se artefatos forem apresentados futuramente, só ganharão autoridade conforme estado, proveniência e aprovação registrados; não são pré-requisito para a próxima análise.

## Registro de pendências

`PD-001`–`PD-017` permanecem `ABERTA`; nenhuma foi resolvida, cancelada, reclassificada ou recebeu responsável/prazo inferido. O registro vivo recebeu referências cruzadas aos 15 pacotes. A cobertura foi suficiente e nenhuma pendência material nova foi criada.

| Grupo de pendências | Pacotes principais |
|---|---|
| `PD-001` | `DEC-PKG-001`,`003`,`014`,`015` |
| `PD-002` | `DEC-PKG-002`–`004`,`008`,`014`,`015` |
| `PD-003`–`006` | `DEC-PKG-005`–`015`, conforme assunto |
| `PD-007`–`013` | `DEC-PKG-009`–`013` |
| `PD-014`–`016` | `DEC-PKG-005`–`008`,`012`,`015` |
| `PD-017` | `DEC-PKG-007`; Figma opcional e não bloqueante |

## Escopo documental da futura inspeção de código

Esta seção prepara, mas não executa, uma futura inspeção autorizada. Resultados permitidos naquela futura etapa serão `IMPLEMENTADO_VERIFICADO`, `PARCIALMENTE_IMPLEMENTADO`, `NAO_IMPLEMENTADO` ou `NAO_AVALIADO`. Nesta Etapa 8, todos permanecem `NAO_AVALIADO`. “Caminho não especificado” significa que nenhum caminho foi adotado aqui; não houve teste de existência.

| ID | Alegação documental a verificar | Fonte | Tecnologia/componente | Evidência futura esperada | Caminhos declarados e não verificados | Dependências | Risco | Decisão relacionada | Resultado atual |
|---|---|---|---|---|---|---|---|---|---|
| `CODE-CHECK-001` | Frontend usa a pilha relatada. | `DOC-012` `ARCH-NNN`; `TECH_DECISIONS.md` | Next.js, React | Manifestos, árvore de fontes, build e execução observável. | Não especificado neste relatório. | `DEC-PKG-007`,`010` | Alto: confundir intenção com estado. | `PD-006` | `NAO_AVALIADO` |
| `CODE-CHECK-002` | UI usa os componentes/estilos relatados. | `DOC-012`; `TECH_DECISIONS.md` | Tailwind, Lucide | Dependências, configuração, imports e componentes renderizados. | Não especificado neste relatório. | `CODE-CHECK-001` | Médio. | `PD-005`,`006` | `NAO_AVALIADO` |
| `CODE-CHECK-003` | Persistência usa PostgreSQL. | `DOC-012`, `DAE-FND-021`; `TD-002` | PostgreSQL | Configuração sanitizada, conexão, migrations/schema e consultas. | Não especificado neste relatório. | `DEC-PKG-008`,`010` | Alto: decisão relatada pode não estar implementada. | `PD-004`,`006` | `NAO_AVALIADO` |
| `CODE-CHECK-004` | O serviço de banco relatado é usado. | `DOC-012`, `DAE-FND-022`; `TECH_DECISIONS.md` | Neon | Dependência/configuração sanitizada e infraestrutura observável. | Não especificado neste relatório. | `CODE-CHECK-003` | Alto. | `PD-006`,`012` | `NAO_AVALIADO` |
| `CODE-CHECK-005` | A camada ORM relatada é usada. | `DOC-012`, `DAE-FND-022`; `TECH_DECISIONS.md` | Prisma | Dependência, schema, migrations e chamadas reais. | Não especificado neste relatório. | `CODE-CHECK-003` | Alto. | `PD-004`,`006` | `NAO_AVALIADO` |
| `CODE-CHECK-006` | A aplicação possui a implantação relatada. | `DOC-012`, `DAE-FND-025`; `TD-003`,`007`,`013` | Vercel | Configuração, ambientes e evidência de deploy sem expor segredos. | Não especificado neste relatório. | `DEC-PKG-013` | Alto. | `PD-006`,`012` | `NAO_AVALIADO` |
| `CODE-CHECK-007` | Existe componente científico separado, se a alternativa tiver sido adotada. | `DOC-012`, `DAE-FND-020`,`024`; `TD-009`,`012` | Python, FastAPI | Dependências, serviço, rotas, contratos e chamada integrada. | Não especificado neste relatório. | `DEC-PKG-003`,`009`,`010` | Alto: alternativa ainda aberta. | `PD-008`,`011` | `NAO_AVALIADO` |
| `CODE-CHECK-008` | Capacidades geoespaciais usam a extensão relatada. | `DOC-012` `ARCH-NNN` | PostGIS | Extensão/schema, tipos, índices e consultas espaciais. | Não especificado neste relatório. | `DEC-PKG-008`,`011` | Alto. | `PD-004`,`006`,`013` | `NAO_AVALIADO` |
| `CODE-CHECK-009` | A pilha de mapas corresponde a alguma alternativa aprovada. | `DOC-012`, `DAE-FND-023`; `TD-008`,`010`,`011`,`014` | OpenStreetMap, Plotly, Leaflet | Dependências, provedores, componentes, atribuição e comportamento. | Não especificado neste relatório. | `DEC-PKG-011` | Alto: nenhuma composição aprovada. | `PD-007`,`009`,`010`,`013` | `NAO_AVALIADO` |
| `CODE-CHECK-010` | Autenticação, sessão e autorização possuem comportamento implementado. | `DOC-011`,`012`; `ARCH-039`,`040` | Autenticação/autorização | Middleware/serviço, sessão, matriz de acesso e testes de isolamento. | Não especificado neste relatório. | `DEC-PKG-006`,`012` | Crítico: acesso indevido. | `PD-003`–`006`,`016` | `NAO_AVALIADO` |
| `CODE-CHECK-011` | APIs correspondem a contrato futuro aprovado. | `DOC-012`; `ARCH-012`–`018` | APIs | Rotas, schemas/payloads, erros, versão, idempotência, auth e testes. | Caminhos de rotas históricos constam de `DOC-012`; não foram verificados. | `DEC-PKG-008`–`010` | Alto. | `PD-003`,`004`,`006`,`011` | `NAO_AVALIADO` |
| `CODE-CHECK-012` | Modelo implementado corresponde ao futuro modelo aprovado. | `DOC-011`,`012`; inventário `DATA-NNN` | Modelo de dados | Schema/migrations, constraints, cardinalidades, tenant, ciclo e geoespacial. | Não especificado neste relatório. | `DEC-PKG-005`,`006`,`008` | Crítico: comparar antes de norma produziria falso desvio. | `PD-004`,`014`–`016` | `NAO_AVALIADO` |
| `CODE-CHECK-013` | Cálculo do IHFR corresponde ao contrato científico futuro aprovado. | `DOC-009`,`010`,`012` | Cálculo IHFR | Funções, parâmetros, validações, precisão, classes, fixtures e testes vetoriais. | Não especificado neste relatório. | `DEC-PKG-002`–`004` | Crítico: ciência ainda não validada. | `PD-002` | `NAO_AVALIADO` |
| `CODE-CHECK-014` | Mapas implementam os requisitos funcionais/geoespaciais futuros. | `DOC-011`,`012` | Mapas | Camadas, filtros, visibilidade, sobreposição, CRS, precisão e testes. | Não especificado neste relatório. | `DEC-PKG-006`,`007`,`011` | Alto. | `PD-003`–`006`,`013` | `NAO_AVALIADO` |
| `CODE-CHECK-015` | Existe comportamento offline/sincronização. | `DOC-011`,`012`; `PROD-FND-014` | Offline | Armazenamento local, fila/sync, conflitos, proteção, estados UX e testes. | Não especificado neste relatório. | `DEC-PKG-008`,`012` | Crítico: perda/exposição de dados. | `PD-003`,`004`,`006` | `NAO_AVALIADO` |
| `CODE-CHECK-016` | Testes cobrem requisitos, ciência, dados, API e NFR aprovados. | `DOC-012`; `BLG-032`–`034`; `ARCH-043`,`044` | Testes | Suítes, fixtures, cobertura útil, resultados reproduzíveis e CI. | Não especificado neste relatório. | `CODE-CHECK-010`–`015` e normas futuras | Alto. | `PD-002`–`006` | `NAO_AVALIADO` |
| `CODE-CHECK-017` | Processo de deploy/observabilidade corresponde à política futura. | `DOC-012`; `ARCH-048`,`049` | Deploy/operação | Pipeline, ambientes, logs, health checks, rollback e evidência sanitizada. | Não especificado neste relatório. | `DEC-PKG-012`,`013` | Alto. | `PD-006`,`012` | `NAO_AVALIADO` |
| `CODE-CHECK-018` | Variáveis científicas, entradas, resultados e versão do algoritmo são persistidos de modo auditável. | `DOC-010`,`012`; matrizes 7 e 8 da Etapa 7 | Variáveis e persistência IHFR | Campos, snapshots, intermediários, scores, drivers, recomendações, versão e histórico. | Não especificado neste relatório. | `DEC-PKG-003`,`004`,`008`; `CODE-CHECK-012`,`013` | Crítico: resultado não reproduzível. | `PD-002`,`004` | `NAO_AVALIADO` |

## Artefatos criados, movidos ou alterados

| Caminho | Ação | Estado | Finalidade |
|---|---|---|---|
| `docs/plans/active/auditoria-dados-arquitetura-execucao.md` | Removido por movimento controlado | origem encerrada | Arquivar o plano da Etapa 7 sem substituição documental. |
| `docs/plans/completed/auditoria-dados-arquitetura-execucao.md` | Movido e atualizado | `CONCLUIDO` / registro `ARQUIVADO` | Registrar aprovação, gate, limites e encerramento da Etapa 7. |
| `docs/reports/audits/2026-08-26-auditoria-dados-arquitetura-execucao.md` | Atualizado | `CANONICO_ATUAL`, somente analítico | Registrar aprovação delimitada e apontar para o plano arquivado. |
| `docs/plans/active/consolidacao-auditoria-documental.md` | Criado | `AGUARDANDO_REVISAO` / registro `EM_REVISAO` | Planejamento e evidências operacionais da Etapa 8. |
| `docs/reports/audits/2026-08-26-auditoria-documental-consolidada.md` | Criado | `EM_REVISAO` | Consolidação analítica autossuficiente. |
| `docs/governance/TRACEABILITY_MATRIX.md` | Atualizado | `CANONICO_ATUAL` de controle | Evidências analíticas, relações e lacunas transversais. |
| `docs/governance/PENDING_DECISIONS.md` | Atualizado | `CANONICO_ATUAL` de controle | Referências aos pacotes, sem mudança de estado. |
| `docs/governance/DOCUMENT_REGISTER.md` | Atualizado | `CANONICO_ATUAL` de controle | Estados, caminhos, verificações, checksums e novos IDs. |

Checksums finais da Etapa 7:

- `DOC-PLAN-006`: `SHA-256:a03f52497746a288efc5e1bd62cd650d9ccfdbd2e1efbbf8b8eb0667166a7041`.
- `DOC-012`: `SHA-256:e90639004de238ad550a4950e6bd86435c971e538aefb0d38b67aa1742add44d`.

Nenhum checksum final foi atribuído a `DOC-PLAN-007` ou `DOC-013` enquanto permanecem em revisão.

## Integridade de `docs/raw/`

O baseline final coincide integralmente com o inicial: 13 caminhos Markdown regulares, 13/13 tipos, tamanhos, permissões `664`, `mtime` com precisão de nanossegundos e SHA-256 idênticos; `git diff` e diff staged para `docs/raw/` estão vazios. Nenhum arquivo foi aberto para nova auditoria de conteúdo; a leitura binária ocorreu somente para a verificação obrigatória de checksum.

Os relatórios aprovados `DOC-009`, `DOC-010` e `DOC-011` também permanecem idênticos ao commit inicial `9c7c8dcba072169d564f89223c48dde0fa48a7fc`.

## Verificações executadas

| Verificação/comando equivalente | Resultado |
|---|---|
| `git status --short`, `git rev-parse HEAD`, branch e inventário inicial | Baseline limpo; commit `9c7c8dcba072169d564f89223c48dde0fa48a7fc`; branch `development`. |
| Gate Node/regex da Etapa 7 | 9 épicos; 34 histórias; 9 entidades; 69 campos; 10 relações; 19 regras; 49 `ARCH`; 49 `ROAD`; 12 matrizes; 20 cadeias; 31 achados; 30 perguntas; 15 bloqueios. |
| Projeção de natureza do roadmap | 49/49 linhas: 24 `PROPOSTA` + 25 `RECOMENDACAO`; três fases confirmadas como eixo sobreposto. |
| `sha256sum` de `DOC-PLAN-006`/`DOC-012` | Checksums finais acima, iguais ao registro. |
| Contagem direta de `DOC-009`–`012` | 20/12/8, 20/18/9, 22/28/9 e 31/30/15; totais 93/88/41. |
| Validador de cobertura e sequência | 93/93 achados, 88/88 perguntas, 58/58 `CON-FND`, 52/52 `CON-Q`, 15/15 `DEC-PKG`, 18/18 `CODE-CHECK`; zero omissão, repetição primária ou ID fora da sequência. |
| Validador de agrupamentos | 24/24 agrupamentos de achados e 20/20 de perguntas possuem justificativa. |
| Projeções de distribuição | Camada, tipo, impacto, autoridade líder e estado fecham em 58; 41 ocorrências convergem para 26 bloqueios únicos. |
| Validador da matriz | 13 nós, 22 relações, 16 lacunas; IDs únicos/sequenciais; endpoints nos 13 nós; tipos e estados fechados. |
| Validador de pendências | 17/17 linhas `ABERTA`; nenhuma nova, resolvida ou cancelada. |
| Validador do registro | Duas tabelas com 34/34 IDs em ordem idêntica; 34 caminhos existentes. |
| Validador de links e tabelas Markdown | Zero link local quebrado; zero linha com quantidade de colunas divergente nos sete artefatos finais. |
| `fs.stat`, SHA-256 e `git diff --quiet` para `docs/raw/` | 13/13 caminhos, tipos, bytes, modos, `mtime`, hashes e deltas aprovados. |
| `git diff --quiet <commit> -- DOC-009 DOC-010 DOC-011` | Relatórios das Etapas 4 a 6 idênticos ao baseline. |
| Varredura de segredos/dados pessoais nos sete arquivos finais | Zero padrão de chave privada, token conhecido, JWT ou endereço de e-mail real. |
| Validador de escopo por `git status --short --untracked-files=all` | Oito caminhos afetados, todos autorizados; zero caminho extra. |
| `git diff --check` | Aprovado, sem erro de whitespace. |

Desvios instrumentais: `rg` não está instalado, portanto foram usados `grep`, `sed`, `find` e validadores Node. Uma tentativa de encapsular `stat` como subprocesso Node recebeu `EPERM` do sandbox; a verificação equivalente foi refeita com `fs.stat`/`mtimeNs` e SHA-256 e foi aprovada.

Verificações não executadas:

- Markdown lint: nenhuma configuração/ferramenta foi estabelecida no corpus de controle permitido; não se inspecionou configuração técnica nem se instalou ferramenta.
- Código, schema, migrations, dependências, testes, configurações, banco, aplicação, deploy e infraestrutura: proibidos nesta etapa.
- Fontes externas, internet e Figma: fora de escopo; Figma continua opcional.

## Alterações preexistentes

O worktree inicial estava limpo; não havia alteração rastreada ou não rastreada a preservar ou conciliar. As mudanças finais pertencem exclusivamente a esta execução e aos oito caminhos autorizados. Nenhuma mudança externa incompatível de commit ou branch foi observada.

## Diff resumido

- 1 plano movido de `active/` para `completed/` e encerrado.
- 1 relatório analítico da Etapa 7 promovido com limites explícitos.
- 1 plano e 1 relatório consolidado da Etapa 8 criados.
- 3 controles canônicos atualizados.
- 8 caminhos Git afetados: 1 origem removida, 2 documentos novos de Etapa 8, 1 destino de movimento, 1 relatório da Etapa 7 e 3 controles.
- Zero alteração em `docs/raw/`, código, documentos normativos ou relatórios aprovados das Etapas 4 a 6.

## Limitações e bloqueios

- **Execução da Etapa 8:** nenhum bloqueio.
- **Consolidação:** nenhuma omissão ou inconsistência quantitativa; agrupamentos permanecem `INFERENCIA` sujeitos à revisão humana.
- **Normatização:** 26 problemas únicos bloqueantes; autoridades e decisões `PD-001`–`017` permanecem abertas.
- **Escopo institucional:** nenhum nó foi classificado como documento institucional aprovado no corpus; possível fonte externa ao corpus não foi avaliada.
- **Figma:** ausente, opcional, secundário e não bloqueante.
- **Implementação futura:** 18 verificações preparadas e todas `NAO_AVALIADO`; `GAP-016` aguarda autorização futura.
- **Etapa 9:** não iniciada; nenhum prompt, inventário ou inspeção foi produzido.

## Ponto de parada

Etapa 8 concluída em seu escopo analítico e de controle. `DOC-PLAN-007` permanece `AGUARDANDO_REVISAO` e `DOC-013` permanece `EM_REVISAO`. A execução para aqui obrigatoriamente, antes de qualquer inspeção de código, infraestrutura, dados executáveis ou início da Etapa 9.

## Encerramento após revisão humana

`DECISAO_CONFIRMADA` — A equipe aprovou formalmente a Etapa 8 na solicitação da Etapa 9, em 2026-08-28, após confirmação do gate mecânico e da verificação corretiva posterior. A aprovação confirma somente a qualidade, a cobertura e a consistência desta análise documental consolidada. Ela não aprova ciência, fórmula, requisitos, modelo de dados, UX ou arquitetura; não valida implementação; não transforma propostas em decisões; não resolve `PD-001`–`017`; não produz o PRD e não concede autoridade normativa a este relatório.

O ponto de parada acima registra o estado histórico ao fim da execução da Etapa 8. Após a revisão humana, `DOC-PLAN-007` passou a `CONCLUIDO` e foi arquivado; este `DOC-013` passou a `CANONICO_ATUAL` exclusivamente como relatório analítico aprovado. Os catálogos, agrupamentos e conclusões aprovados permanecem inalterados.
