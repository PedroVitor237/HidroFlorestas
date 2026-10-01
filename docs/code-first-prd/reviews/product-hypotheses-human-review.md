# Revisão humana das hipóteses de produto H01–H10

## Identificação e estado

| Campo | Registro |
|---|---|
| Iniciativa | `PRD Code-First` |
| Origem | anexo `obs-prd-hidroflorestas-formal.md` |
| Data declarada no anexo | 31 de agosto de 2026 |
| Data desta verificação | 6 de setembro de 2026 |
| Autor do anexo | não especificado |
| Função do autor | não especificada |
| Autoridade do autor | não especificada |
| Estado do anexo recebido | declarava a revisão concluída e todas as dez hipóteses validadas |
| Estado após verificação | `EM_REVISAO`; nenhuma conclusão normativa do anexo foi promovida a decisão aprovada |
| Autoridade da intenção | `REVISAO_HUMANA_PENDENTE_DE_AUTORIDADE` para H01–H10; autoridade científica adicional `NAO_ESPECIFICADO` para H08 |
| Fases | Fase 1 `CONCLUIDA`; `FASE_1_AMPLIADA_CONCLUIDA_EM_REVISAO`; Fase 2 `NAO_INICIADA` |

Este documento é a versão corrigida e rastreável das observações recebidas. A formulação humana é preservada, mas sua compatibilidade técnica e sua autoridade são avaliadas separadamente. Compatibilidade com código ou schema não aprova intenção, e o anexo não identifica quem poderia aprovar produto, dados, segurança ou ciência.

## Fontes e método

Foram usados somente código e configurações rastreados, [`../../../prisma/schema.prisma`](../../../prisma/schema.prisma), [`../../../TECH_DECISIONS.md`](../../../TECH_DECISIONS.md) com seus estados preservados, [`../../../PROJECT_CONTEXT.md`](../../../PROJECT_CONTEXT.md) apenas para identidade geral, o pacote atual em [`../`](../) e o anexo. Não foram usados `docs/raw/**`, matriz global, relatórios históricos, internet, Figma ou fontes externas. Aplicação, build, lint, testes, banco, migrations e deploy não foram executados.

As referências abaixo priorizam caminho, seção, model, campo e identificador `CF-*` ou `TD-*`. Números de linha do anexo não foram mantidos porque não identificavam de modo estável a versão atual do conteúdo.

## Matriz de resultado

| ID | Assunto | Compatibilidade técnica | Autoridade da intenção | Resultado | Síntese da correção |
|---|---|---|---|---|---|
| H01 | laboratório como unidade colaborativa e contexto ativo | `PARCIALMENTE_SUSTENTADA_PELO_CODIGO` | `REVISAO_HUMANA_PENDENTE_DE_AUTORIDADE` | `MANTIDA_COM_CORRECAO` | estrutura e interface sugerem o contexto; compartilhamento e propagação do laboratório ativo não estão implementados |
| H02 | participante de laboratório | `PARCIALMENTE_SUSTENTADA_PELO_CODIGO` | `REVISAO_HUMANA_PENDENTE_DE_AUTORIDADE` | `MANTIDA_COM_CORRECAO` | o vínculo existe; elegibilidade e denominação do ator não são definidas pelo schema |
| H03 | responsável pelo laboratório | `PARCIALMENTE_SUSTENTADA_PELO_CODIGO` | `REVISAO_HUMANA_PENDENTE_DE_AUTORIDADE` | `MANTIDA_COM_CORRECAO` | há vínculo técnico e texto de interface; responsabilidade, condução e permissões seguem abertas |
| H04 | participante de campo | `PARCIALMENTE_SUSTENTADA_PELO_CODIGO` | `REVISAO_HUMANA_PENDENTE_DE_AUTORIDADE` | `MANTIDA_COM_CORRECAO` | a coleta referencia um usuário; a especialização funcional e atuação em nome da equipe não são papéis implementados |
| H05 | vínculo pessoa–laboratório | `CONFIRMADA_PELO_CODIGO` | `REVISAO_HUMANA_PENDENTE_DE_AUTORIDADE` | `MANTIDA` | `ResearchersLinked` materializa o vínculo; suas regras operacionais continuam ausentes |
| H06 | recursos compartilhados e autoria | `PARCIALMENTE_SUSTENTADA_PELO_CODIGO` | `REVISAO_HUMANA_PENDENTE_DE_AUTORIDADE` | `DIVIDIDA` | contexto e vínculos técnicos existem; compartilhamento, propriedade e autoria de todos os recursos não estão definidos |
| H07 | coleta vinculada à área e ao usuário | `CONFIRMADA_PELO_CODIGO` | `REVISAO_HUMANA_PENDENTE_DE_AUTORIDADE` | `MANTIDA_COM_CORRECAO` | as duas FKs existem; “autor” permanece interpretação funcional do vínculo técnico |
| H08 | evolução dos dados e rastreabilidade científica | `PARCIALMENTE_SUSTENTADA_PELO_CODIGO` | `REVISAO_HUMANA_PENDENTE_DE_AUTORIDADE`; ciência `NAO_ESPECIFICADO` | `DIVIDIDA` | há grupos atuais, coleta, diagnóstico e versão do algoritmo; versão do contrato científico e cadeia integral não existem |
| H09 | analogia com Google Classroom | `NAO_VERIFICAVEL_NO_CODIGO` | `REVISAO_HUMANA_PENDENTE_DE_AUTORIDADE` | `RECLASSIFICADA` | permanece analogia humana exclusivamente conceitual, sem importar comportamento |
| H10 | administração global e moderação futura | `COMPATIVEL_MAS_NAO_COMPROVADA` e `NAO_VERIFICAVEL_NO_CODIGO` | `REVISAO_HUMANA_PENDENTE_DE_AUTORIDADE` | `DIVIDIDA` | interface global fora do núcleo já é direção de trabalho; atribuição de moderação à equipe não foi comprovada |

Distribuição dos resultados: 1 `MANTIDA`, 5 `MANTIDA_COM_CORRECAO`, 3 `DIVIDIDA`, 1 `RECLASSIFICADA`, 0 `RECUSADA_POR_CONFLITO` e 0 hipóteses inteiras classificadas apenas como `PENDENTE`. As parcelas não comprovadas de H06, H08 e H10 permanecem pendentes.

## Verificação individual

### H01 — Laboratório como unidade colaborativa e contexto ativo

**Formulação original:** “O laboratório é a unidade colaborativa que reúne participantes, áreas monitoradas, coletas e resultados. A navegação e as operações do usuário ocorrem no contexto de um laboratório ativo.”

- **Evidência técnica:** `LaboratoryRoom` agrega vínculos `ResearchersLinked` e áreas `CollectionArea`; áreas agregam `CollectionData`, que pode ter `IHFRDiagnosis`. A página [`../../../src/app/(private)/workspace/page.tsx`](../../../src/app/(private)/workspace/page.tsx) mostra criar, entrar e acessar um laboratório, mas usa estado local e card fixo.
- **Pacote relacionado:** `CF-CAP-007`, `CF-PRD-FR-003`, `CF-PRD-FR-004`, `CF-PRD-FR-011`, `CF-UC-004`, `CF-UC-005`, `CF-UC-006`, `CF-PFLOW-003`, `CF-PD-002`, `CF-PD-006`.
- **Correção:** tratar laboratório como contexto colaborativo candidato. O schema sustenta o encadeamento estrutural, mas não prova acesso compartilhado, seleção persistida nem propagação do contexto ativo pelas operações.
- **Impacto:** a hipótese permanece no PRD; `CF-PD-002` e `CF-PD-006` não são encerradas.

### H02 — Participante de laboratório

**Formulação original:** “O produto reconhece o ator ‘participante de laboratório’ como uma pessoa vinculada ao espaço colaborativo e às atividades nele realizadas, sem exigir que essa pessoa seja formalmente classificada como pesquisadora.”

- **Evidência técnica:** `ResearchersLinked` relaciona `User` e `LaboratoryRoom` por chave composta. O model não possui papel, status, qualificação profissional ou regra de elegibilidade.
- **Pacote relacionado:** seção “Atores” de [`../specifications/use-cases.md`](../specifications/use-cases.md), `CF-CLS-004`, `CF-PRD-FR-003`, `CF-PRD-FR-011`, `CF-PD-002`, `CF-PD-006`.
- **Correção:** o vínculo técnico é confirmado, mas o nome `ResearchersLinked` não obriga nem dispensa classificação formal como pesquisador. “Participante de laboratório” permanece denominação funcional candidata.
- **Impacto:** não foi criado papel persistido nem regra de elegibilidade.

### H03 — Responsável pelo laboratório

**Formulação original:** “O produto reconhece um responsável pelo laboratório, com responsabilidade pela criação ou condução do contexto colaborativo. As permissões específicas desse ator ainda devem ser definidas na matriz de acesso do produto.”

- **Evidência técnica:** `LaboratoryRoom.userId` exige um usuário relacionado; a página de workspace usa o texto “Seja responsável por um novo laboratório IHFR”. O schema não nomeia esse usuário como responsável, proprietário ou autor, e não há fluxo consumidor do laboratório.
- **Pacote relacionado:** ator “Responsável pelo laboratório” em [`../specifications/use-cases.md`](../specifications/use-cases.md), `CF-CLS-003`, `CF-UC-004`, `CF-PD-002`, `CF-PD-006`.
- **Correção:** distinguir vínculo técnico, criação sugerida pela interface e responsabilidade normativa. Condução, exclusividade, transferência e permissões continuam pendentes.
- **Impacto:** nenhuma matriz de acesso foi criada e nenhuma regra de propriedade foi decidida.

### H04 — Participante de campo

**Formulação original:** “O produto reconhece o participante de campo como o ator que registra coletas e dados ambientais em nome da equipe, preservando a autoria aplicável aos registros.”

- **Evidência técnica:** `CollectionData` referencia obrigatoriamente `User` e `CollectionArea`; os quatro grupos ambientais referenciam a coleta, não diretamente um usuário. Não existe papel técnico “participante de campo”.
- **Pacote relacionado:** ator “Participante de campo” em [`../specifications/use-cases.md`](../specifications/use-cases.md), `CF-PRD-FR-006`, `CF-PRD-FR-007`, `CF-PRD-FR-012`, `CF-UC-009`, `CF-UC-011`, `CF-PD-003`, `CF-PD-006`.
- **Correção:** “participante de campo” é especialização funcional candidata. O vínculo usuário–coleta é estrutural; atuação em nome da equipe, autoria dos dados ambientais e permissões não são comprovadas.
- **Impacto:** ciclo, revisão, edição e exclusão permanecem em `CF-PD-003`; papéis e autoria detalhada permanecem em `CF-PD-006`.

### H05 — Vínculo entre pessoa e laboratório

**Formulação original:** “O produto deve manter um vínculo explícito entre a pessoa e o laboratório. As regras operacionais de entrada, aprovação, papel, permanência, saída e datas do vínculo continuam sujeitas a detalhamento.”

- **Evidência técnica:** `ResearchersLinked` materializa uma associação explícita entre `User` e `LaboratoryRoom`. A chave composta impede duplicação do mesmo par no schema.
- **Pacote relacionado:** `CF-CLS-004`, `CF-PRD-FR-003`, `CF-PRD-FR-011`, `CF-UC-005`, `CF-PFLOW-003`, `CF-PD-002`, `CF-PD-006`.
- **Correção:** nenhuma além de preservar a separação entre estrutura observada e intenção aprovada. Papel, estado, convite, datas e saída não existem no model.
- **Impacto:** confirmação técnica não fecha `CF-PD-002` nem `CF-PD-006`.

### H06 — Recursos compartilhados e autoria individual

**Formulação original:** “Áreas, coletas, dados e resultados são recursos compartilhados no contexto do laboratório. Ao mesmo tempo, o produto deve preservar a autoria individual e a proveniência aplicáveis a cada registro.”

- **Evidência técnica:** `CollectionArea` referencia laboratório e usuário; `CollectionData` referencia área e usuário; dados ambientais e diagnósticos são alcançáveis pela coleta. Não existe serviço de domínio ou autorização que demonstre compartilhamento. Dados ambientais e diagnósticos não possuem autor direto.
- **Pacote relacionado:** `CF-PRD-FR-011`, `CF-PRD-FR-012`, `CF-PRD-NFR-001`, `CF-PRD-NFR-002`, `CF-GAP-009`, `CF-PD-006`.
- **Correção:** dividir a afirmação em (a) associação técnica ao contexto do laboratório; (b) acesso compartilhado ainda não comprovado; (c) autoria técnica direta de áreas e coletas; e (d) proveniência indireta de dados e diagnósticos. Nenhuma dessas relações decide propriedade.
- **Impacto:** o pacote passa a explicitar que “compartilhado” não significa propriedade coletiva nem acesso já implementado.

### H07 — Coleta vinculada à área e ao autor

**Formulação original:** “Cada coleta constitui um registro de campo vinculado a uma área monitorada e a um autor identificável. As regras de ciclo de vida, revisão, edição e exclusão da coleta ainda devem ser detalhadas.”

- **Evidência técnica:** `CollectionData.collectionAreaId` e `CollectionData.userId` são FKs obrigatórias. Não há campo de data de campo, status, revisão ou exclusão.
- **Pacote relacionado:** `CF-CLS-006`, `CF-PRD-FR-006`, `CF-PRD-FR-012`, `CF-UC-009`, `CF-PFLOW-005`, `CF-PD-003`, `CF-PD-006`.
- **Correção:** usar “usuário relacionado à coleta, interpretado funcionalmente como autor candidato” ao descrever a intenção. A estrutura não prova propriedade nem política de edição.
- **Impacto:** o vínculo técnico é preservado sem encerrar ciclo de vida ou autoria normativa.

### H08 — Dados ambientais e evolução do contrato científico do IHFR

**Formulação original:** “Os dados ambientais permanecem associados à coleta e devem ser definidos pelo contrato científico aplicável. Água, solo, vegetação e terreno podem ser utilizados como grupos iniciais ou provisórios, mas não devem ser tratados como uma estrutura definitiva e imutável do domínio. À medida que o algoritmo do IHFR evoluir, os dados exigidos nas coletas poderão ser incluídos, removidos, reorganizados ou ter seus formatos, unidades e validações alterados para viabilizar o funcionamento correto do cálculo e da interpretação científica. Consequentemente, o PRD deve evitar fixar os campos atualmente observados no schema como contrato científico final, manter o modelo de coleta compatível com a evolução versionada do algoritmo e do contrato científico do IHFR, preservar a rastreabilidade entre os dados coletados, a versão do contrato científico e a versão do algoritmo utilizadas no diagnóstico e submeter mudanças nos dados de coleta à validação científica e à correspondente atualização das regras de produto e de dados.”

#### Separação obrigatória

| Parcela | Estado verificado | Evidência ou limite |
|---|---|---|
| Estrutura atual | `CONFIRMADA_PELO_CODIGO` | `WaterData`, `SoilData`, `VegetationData` e `TerrainData` referenciam `CollectionData`; `IHFRDiagnosis` referencia `CollectionData` |
| Conteúdo já previsto no PRD | presente como requisito candidato | `CF-PRD-FR-007`, `CF-PRD-FR-008`, `CF-PRD-FR-009` e `CF-PRD-NFR-006` evitam aprovar grupos, campos, unidades, fórmula e classes |
| Versão de algoritmo | `CONFIRMADA_PELO_CODIGO` como campo | `IHFRDiagnosis.algorithmVersion` existe com default textual `1.0.0`; sem produtor, consumidor ou semântica validada |
| Versão do contrato científico | `NAO_LOCALIZADO` | não há model, campo ou relação que identifique a versão do contrato aplicada à coleta |
| Cadeia `coleta → contrato → algoritmo → diagnóstico` | `NAO_LOCALIZADO` integralmente | existe `coleta → diagnóstico` e o diagnóstico contém `algorithmVersion`; o elo de contrato está ausente |
| Evolução de campos conforme algoritmo/contrato | `COMPATIVEL_MAS_NAO_COMPROVADA` | é direção humana nova; não há mecanismo de versionamento, migração, compatibilidade ou validação científica implementado |
| Definição de grupos, variáveis, unidades e validações | autoridade científica necessária | permanece em `CF-PD-005` e `CF-Q-011`; o anexo não identifica responsável científico autorizado |

- **Correção:** não chamar `algorithmVersion` genericamente de “versão científica” e não apresentar a cadeia integral como atual. A rastreabilidade completa permanece direção humana para futura complementação, pendente de autoridade de produto/dados e de validação científica.
- **Impacto:** o modelo lógico e o relacional continuam as-is e recebem somente nota de lacuna; nenhum campo foi acrescentado. `CF-PD-005` permanece aberta.

### H09 — Analogia organizacional com o Google Classroom

**Formulação original:** “A analogia com uma sala do Google Classroom representa adequadamente a intenção organizacional do laboratório: um responsável cria o contexto, participantes ingressam e recursos são compartilhados. A analogia é exclusivamente conceitual e não importa automaticamente regras, terminologia, fluxos, permissões ou elementos de interface do produto citado.”

- **Evidência técnica:** não há referência ao Google Classroom no código ou schema. A estrutura de laboratório, vínculos e interface de criar/entrar é compatível com várias organizações possíveis e não comprova a analogia.
- **Pacote relacionado:** seção “Laboratórios” do [`../prd-code-first.md`](../prd-code-first.md), `CF-PD-002`, `CF-PD-006` e relato humano anterior já classificado como pendente de formalização em [`../analysis/product-hypotheses.md`](../analysis/product-hypotheses.md).
- **Correção:** reclassificar a analogia como explicação humana exclusivamente conceitual, não como hipótese derivada do código nem como decisão aprovada.
- **Impacto:** nenhum comportamento do Google Classroom foi importado; convite, ingresso, papéis, compartilhamento, propriedade e interface permanecem abertos.

### H10 — Administração global fora do MVP e moderação futura

**Formulação original:** “O administrador global permanece fora do núcleo funcional do primeiro MVP, mas é reconhecido como um papel futuro. Esse papel será exercido pela equipe HidroFlorestas, responsável pela moderação e pelo controle administrativo da plataforma.”

#### Separação obrigatória

| Afirmação | Compatibilidade técnica | Autoridade | Resultado |
|---|---|---|---|
| Interface de administração global fica fora do núcleo do primeiro MVP | `COMPATIVEL_MAS_NAO_COMPROVADA` pelo código; direção de trabalho já registrada em `CF-PD-004` | origem humana de 2026-08-27 registrada, mas autoridade formal pendente | mantida como `FORA_DO_MVP_CANDIDATO`, sem aprovação normativa |
| Há infraestrutura técnica parcial de administração global | `CONFIRMADA_PELO_CODIGO` | não se aplica à intenção | `User.role`, `User.isAdmin`, `requireAdmin` e script de superadministrador existem; nenhuma interface ou API consumidora administrativa foi localizada |
| A equipe HidroFlorestas exercerá moderação e controle administrativo futuramente | `NAO_VERIFICAVEL_NO_CODIGO` | `REVISAO_HUMANA_PENDENTE_DE_AUTORIDADE` | `PENDENTE`; não há origem, responsável, papel institucional ou mandato identificados |

- **Correção:** não usar a exclusão da interface do MVP para confirmar quem operará a plataforma no futuro. Também não tratar `ADMIN`, `MODERATOR` e `isAdmin` como sinônimos.
- **Impacto:** `CF-PD-006`, `CF-GAP-010`, `CF-GAP-011` e `CF-Q-009` continuam abertos; não foi criado requisito administrativo.

## Observações corrigidas e decisões novas

As observações tecnicamente corretas são: existência do vínculo pessoa–laboratório; vínculos obrigatórios da coleta com área e usuário; associação dos grupos ambientais atuais à coleta; associação do diagnóstico à coleta; e presença de `algorithmVersion`. Também está correto manter convite, saída, permissões, propriedade, ciclo de vida e ciência em aberto.

Foram corrigidas as seguintes extrapolações:

- “validada” e “concluída” foram substituídas por resultados técnicos e autoridade pendente;
- laboratório ativo, compartilhamento e atores foram limitados ao que schema e mocks sustentam;
- autoria, responsabilidade e propriedade foram mantidas como conceitos diferentes;
- `algorithmVersion` foi separado de versão do contrato científico;
- a analogia com Google Classroom foi retirada da categoria derivada do código;
- H10 foi dividida entre escopo do MVP e atribuição futura de moderação.

As direções humanas novas identificadas, sem aprovação, são: evolução versionada dos dados de coleta; rastreabilidade explícita entre versão do contrato e versão do algoritmo; e atribuição futura da moderação à equipe HidroFlorestas. As três permanecem `REVISAO_HUMANA_PENDENTE_DE_AUTORIDADE`; as duas primeiras também dependem de autoridade científica e de dados nos aspectos aplicáveis.

## Impacto nas decisões abertas

| Decisão | Impacto desta revisão | Estado preservado |
|---|---|---|
| `CF-PD-002` | H01, H02, H03, H05 e H09 esclarecem o conceito, mas não decidem convite, aprovação, múltiplos laboratórios, saída, responsabilidade ou transferência | `DEPENDENCIA_ABERTA` |
| `CF-PD-003` | H04 e H07 confirmam relações estruturais da coleta, mas não decidem estados, data de campo, revisão, edição, exclusão ou eventos | `DEPENDENCIA_ABERTA` |
| `CF-PD-005` | H08 distingue versão do algoritmo de versão do contrato e registra a cadeia integral como lacuna/evolução pretendida, sem aprovar contrato, fórmula ou produção | `DEPENDENCIA_ABERTA` |
| `CF-PD-006` | H02, H03, H04, H05, H06, H07 e H10 reforçam a separação entre participante, responsável, autor, proprietário e administrador, sem decidir matriz de acesso, propriedade, transferência ou moderação | `DEPENDENCIA_ABERTA` |

## Impacto no pacote e ponto de parada

| Artefato | Impacto |
|---|---|
| [`../README.md`](../README.md) | registra esta revisão e seu estado |
| [`../governance/source-policy.md`](../governance/source-policy.md) | registra o uso limitado de revisão humana sem autoridade identificada |
| [`../prd-code-first.md`](../prd-code-first.md) | separa analogia humana de hipótese técnica, limita “compartilhamento”, divide H10 e distingue versão do algoritmo de contrato científico |
| [`../analysis/product-hypotheses.md`](../analysis/product-hypotheses.md) | registra o efeito da revisão sem promover as hipóteses ou fechar decisões abertas |
| [`../analysis/current-product-state.md`](../analysis/current-product-state.md) | separa a analogia humana H09 da evidência de implementação |
| [`../analysis/gaps-and-open-questions.md`](../analysis/gaps-and-open-questions.md) | explicita a ausência da versão do contrato e da cadeia integral em `CF-GAP-012`/`CF-Q-011` |
| [`../specifications/requirements.md`](../specifications/requirements.md) | corrige “versão científica” e registra a lacuna sem criar novo requisito |
| [`../specifications/use-cases.md`](../specifications/use-cases.md) | alinha consulta/associação do diagnóstico à versão de algoritmo realmente observada |
| [`../specifications/product-flows.md`](../specifications/product-flows.md) e [`../diagrams/plantuml/product-flows.puml`](../diagrams/plantuml/product-flows.puml) | separam versão de algoritmo presente de versão de contrato ausente e mantêm equivalência entre as representações |
| [`../specifications/class-diagram.md`](../specifications/class-diagram.md) | corrige o limite semântico de `algorithmVersion` |
| [`../specifications/logical-data-model.md`](../specifications/logical-data-model.md) | acrescenta nota de lacuna, sem alterar a estrutura as-is |
| [`../specifications/relational-data-model.md`](../specifications/relational-data-model.md) | acrescenta nota de lacuna, sem alterar campos ou relações as-is |

Esta revisão não inicia a Fase 2, não altera código ou schema e não conclui validação humana normativa. A próxima parada material continua sendo a identificação das autoridades aplicáveis e a decisão explícita sobre as parcelas pendentes de `CF-PD-002`, `CF-PD-003`, `CF-PD-005` e `CF-PD-006`.
