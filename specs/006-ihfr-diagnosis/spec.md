# Feature Specification: Diagnóstico IHFR

**Feature Branch**: `006-ihfr-diagnosis`

**Created**: 2026-09-16

**Status**: Especificação esclarecida para planejamento condicionado; implementação bloqueada pelos gates G1–G3.

**Input**: IMP-006 — permitir que usuário autorizado associe ou obtenha e consulte um diagnóstico IHFR ligado à coleta e à área de origem, sem presumir o mecanismo de produção nem o contrato científico ainda pendentes. Executar somente `$speckit-specify`, com commit e publicação da branch, sem implementação.

## Authority and Scope

- `DECISAO_CONFIRMADA` — a solicitação desta tarefa, em 2026-09-16, autoriza iniciar a documentação da IMP-006 a partir de `origin/development`, tratar IMP-001 a IMP-004 como integradas, consultar a IMP-005 publicada como trabalho em andamento e executar somente `$speckit-specify`. A solicitação não aprova conteúdo científico ausente nem libera implementação.
- `DECISAO_CONFIRMADA` — a solicitação de esclarecimento de 2026-09-16/17 autoriza executar somente `$speckit-clarify`, atualizar a spec e sua checklist e publicar as alterações na branch da IMP-006. Não autoriza planejamento, tarefas, implementação, alteração da IMP-005 ou documentação Code-First.
- `FATO_DOCUMENTADO` — o backlog Code-First identifica a IMP-006 como **Diagnóstico IHFR** e define como resultado que usuário autorizado obtenha ou consulte diagnóstico ligado à coleta e à área de origem. `CF-PRD-FR-008`, `CF-PRD-FR-009`, `CF-PRD-NFR-006`, `CF-UC-012`, `CF-UC-013` e `CF-PFLOW-006` sustentam associação, consulta, origem e versão disponível do algoritmo. O pacote permanece `EM_REVISAO`; seus requisitos são candidatos e não possuem aprovação normativa final.
- `EVIDENCIA_IMPLEMENTACAO` — `origin/development` em `37fb3a4fbf7dda04b9bc3b9f2fc1c64ed3b14e13` contém a IMP-004 integrada pelo merge `37fb3a4`. A presença histórica de estrutura técnica para diagnóstico não aprova resultado, fórmula, classes, limiares, validação ou mecanismo de produção.
- `FATO_DOCUMENTADO` — os artefatos da IMP-005 foram consultados diretamente em `origin/005-environmental-collection-data`, commit `d3fade93e71473b88e44bb473fb2adb9718f2f4c`. Eles planejam dados ambientais subordinados à coleta, referência do contrato científico, isolamento contextual, leitura de laboratório inativo e preservação da coleta confirmada.
- `FATO_DOCUMENTADO` — os contratos da IMP-005 são **planejados, ainda não integrados**: orientam dependências futuras, mas não comprovam código, schema, migration, contrato científico final ou comportamento integrado. Se a IMP-005 avançar, a IMP-006 MUST reconciliar seus contratos com o novo HEAD e com a base integrada antes de implementação.
- `PENDENCIA_DE_DECISAO` — `CF-PD-005` e `CF-Q-011` mantêm abertos contrato científico, conteúdo do resultado, fórmula, variáveis, pesos, classes, limiares, qualidade, validação, versões, relação contrato–algoritmo e forma de produção. Produto, ciência, dados e arquitetura devem decidir os respectivos assuntos com origem registrada.
- `RECOMENDACAO` — tratar associação e consulta como fronteiras separáveis permite especificar a rastreabilidade sem escolher cálculo interno, componente Python, importação, registro manual ou serviço externo. Esta recomendação não seleciona mecanismo nem libera implementação.

## Clarifications

### Session 2026-09-16

- Q: Sob qual procedimento um diagnóstico individual deve adquirir o estado “aceito” antes de poder ser associado a uma coleta? → A: A autoridade científica aprova o procedimento e as evidências exigidas; cada diagnóstico conforme recebe evidência registrada de aceite, e exceções exigem revisão científica individual.
- Q: Quantos diagnósticos aceitos podem estar vigentes e disponíveis na consulta principal para a mesma coleta? → A: No máximo um diagnóstico vigente por coleta; anteriores permanecem preservados como não vigentes conforme o ciclo aprovado.
- Q: Após a associação ser confirmada, como substituição, revogação e correção devem funcionar sem alterar a evidência original? → A: Diagnóstico e associação confirmados são imutáveis; um novo diagnóstico aceito pode substituir o vigente, a revogação registra motivo e torna-o não vigente, e correções exigem novo diagnóstico aceito.

### Session 2026-09-17

- Q: Quais atores devem poder associar um diagnóstico aceito e quais devem poder consultá-lo no laboratório? → A: OWNER e ADMIN podem associar, substituir ou revogar; processo explicitamente autorizado também pode associar; OWNER, ADMIN e MEMBER com vínculo atual podem consultar.
- Q: Quais informações de proveniência do aceite devem aparecer ao participante na consulta normal do diagnóstico? → A: Mostrar coleta, área, referências do contrato e algoritmo, estado, data e procedimento de aceite; ocultar identidades do produtor/revisor e detalhes da evidência, reservando-os à auditoria autorizada.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consultar diagnóstico e sua origem (Priority: P1)

Como participante OWNER, ADMIN ou MEMBER com vínculo atual no laboratório, quero consultar o diagnóstico IHFR já aceito para uma coleta, para conhecer o resultado disponível e confirmar de qual coleta e área ele se originou.

**Why this priority**: A consulta entrega valor verificável sem pressupor como o diagnóstico foi produzido e protege a rastreabilidade científica mínima da IMP-006.

**Independent Test**: Preparar um diagnóstico aceito segundo G2, ligado a uma coleta acessível, e verificar a consulta do resultado, da coleta, da área e das referências científicas aprovadas. O teste não precisa produzir um novo diagnóstico nem usar a jornada da história 2.

**Acceptance Scenarios**:

1. **Given** diagnóstico aceito e associado a coleta acessível, **When** participante autorizado consulta o resultado no contexto explícito do laboratório e da área, **Then** vê o conteúdo aprovado em G2, a coleta e a área de origem, as referências do contrato e algoritmo e o estado, a data e o procedimento de aceite, sem identidades ou evidências restritas (FR-001–FR-006, FR-009).
2. **Given** coleta acessível sem diagnóstico aceito, **When** participante consulta, **Then** vê ausência de diagnóstico, sem resultado, classe, qualidade, versão ou recomendação inventados (FR-005, FR-007).
3. **Given** laboratório inativo e participante ainda autorizado para leitura, **When** consulta diagnóstico existente, **Then** recebe a projeção permitida em modo somente leitura, sem ação de produção, associação ou alteração (FR-008).
4. **Given** recurso inexistente, pertencente a outro contexto ou vínculo revogado, **When** participante tenta consultar, **Then** não recebe dados e não consegue distinguir existência inacessível de inexistência (FR-001, FR-002, FR-009).
5. **Given** diagnóstico legado sem proveniência suficiente para G2, **When** participante tenta consultá-lo pelo fluxo validado, **Then** ele não é apresentado como diagnóstico cientificamente aceito nem recebe referências fabricadas (FR-004, FR-010).

---

### User Story 2 - Associar diagnóstico aceito à coleta (Priority: P2)

Como participante OWNER ou ADMIN com vínculo atual, ou como processo explicitamente autorizado e responsabilizado, quero associar um diagnóstico IHFR aceito à coleta que o originou, para preservar sua proveniência e torná-lo consultável no contexto correto.

**Why this priority**: A associação habilita novos diagnósticos, mas depende materialmente do contrato científico, do mecanismo de produção e da matriz de responsabilidade ainda abertos.

**Independent Test**: Com diagnóstico aceito preparado segundo G2/G3 e coleta com dados aplicáveis preparados pela IMP-005, executar apenas a associação autorizada e verificar a cadeia laboratório → área → coleta → diagnóstico. O teste não depende da interface de consulta da história 1 para conferir a relação em um ensaio isolado.

**Acceptance Scenarios**:

1. **Given** coleta confirmada e acessível, dados ambientais aplicáveis, diagnóstico aceito e ator autorizado pelo mecanismo aprovado, **When** solicita a associação, **Then** o diagnóstico fica ligado exatamente à coleta de origem e, por ela, à área e ao laboratório corretos (FR-001–FR-004, FR-011).
2. **Given** diagnóstico sem contrato, validação, proveniência ou compatibilidade exigida por G2, **When** há tentativa de associação, **Then** a operação permanece indisponível ou é recusada e nenhum diagnóstico válido é publicado (FR-003, FR-004, FR-010).
3. **Given** coleta e diagnóstico de contextos incompatíveis, **When** há tentativa de associação, **Then** a operação é recusada sem alterar coleta, dados ambientais ou diagnóstico já aceito (FR-002, FR-011, FR-012).
4. **Given** falha, timeout ou repetição da mesma tentativa, **When** o resultado é recuperado conforme G3, **Then** não há sucesso falso, associação parcial nem duplicação da mesma operação (FR-013).
5. **Given** laboratório inativo, **When** qualquer ator ou processo tenta produzir ou associar diagnóstico, **Then** a escrita é recusada mesmo por acesso direto (FR-008).
6. **Given** diagnóstico vigente e um novo diagnóstico aceito para a mesma coleta, **When** a substituição autorizada é confirmada, **Then** o novo diagnóstico se torna o único vigente e o anterior e sua associação permanecem imutáveis como não vigentes (FR-011, FR-013).
7. **Given** participante MEMBER ou processo sem autorização explícita, **When** tenta associar, substituir ou revogar, **Then** a escrita é recusada; o processo autorizado pode associar, mas não substituir nem revogar (FR-001).

### Edge Cases

- Vínculo, papel, elegibilidade ou estado do laboratório muda entre abertura e ação: revalidar o contexto atual; negar escrita e limitar leitura conforme a autorização vigente.
- Coleta pertence a outra área ou laboratório: resolver toda a cadeia de origem e recusar o cruzamento, sem confiar em identificador isolado.
- Dados ambientais existem, mas ainda não satisfazem o contrato científico aplicável: não produzir nem aceitar diagnóstico por completude aparente.
- Contrato científico ou algoritmo muda entre produção e associação: não reinterpretar resultado; aplicar somente regra de compatibilidade e vigência aprovada em G2.
- Dados ambientais ou seu contrato na IMP-005 mudam depois do aceite: não recalcular, reinterpretar, substituir nem revogar automaticamente o diagnóstico; o efeito depende de decisão científica, de produto e de dados em G2/G3.
- Versão do algoritmo está ausente em registro legado: não fabricar versão. G2 define se o registro pode ser classificado, migrado ou consultado e sob qual identificação.
- Duas tentativas concorrentes apresentam resultados diferentes para a mesma coleta: G3 deve definir identidade, precedência, transição de vigência e resolução; igualdade ou diferença de valores, isoladamente, não decide o conflito, e no máximo um diagnóstico pode terminar vigente.
- Um novo diagnóstico aceito concorre com o diagnóstico vigente da coleta: não apresentar ambos como vigentes; preservar o anterior como não vigente somente pela transição aprovada em G3.
- Um diagnóstico vigente é revogado: registrar o motivo, torná-lo não vigente sem apagar ou modificar o diagnóstico ou a associação original e apresentar ausência de diagnóstico vigente até eventual substituição aceita.
- Um diagnóstico contém erro que exige correção: não editar o registro aceito; exigir novo diagnóstico aceito e usar a transição de substituição.
- Diagnóstico foi produzido, mas sua associação tem resultado desconhecido: não mostrar sucesso até recuperar estado confiável conforme G3.
- Resultado contém campos técnicos não aprovados para participantes: projetar somente conteúdo autorizado; não expor parâmetros internos, credenciais ou detalhes privilegiados.
- A consulta não deve apresentar interpretação, recomendação, gráfico, mapa ou histórico que pertença às IMP-007/008.

## Requirements *(mandatory)*

### Functional Requirements

Os requisitos definem comportamento seguro e rastreável. G1–G3 são precondições materiais: enquanto abertos, a especificação não constitui fluxo implementável.

- **FR-001**: Toda consulta ou associação MUST exigir principal autenticado, autorização contextual vigente e laboratório explicitamente selecionado. Para pessoas, conta elegível e vínculo atual são obrigatórios; autoria histórica ou papel global MUST NOT substituir vínculo vigente. OWNER, ADMIN e MEMBER com vínculo atual podem consultar. Somente OWNER e ADMIN com vínculo atual podem associar, substituir ou revogar. Processo com identidade, autorização explícita, responsabilização e vínculo contextual aprovados em G3 pode associar, mas não consultar, substituir nem revogar.
- **FR-002**: A operação MUST resolver laboratório autorizado, área subordinada, coleta subordinada e diagnóstico subordinado nessa ordem. Identificadores isolados MUST NOT conceder acesso nem permitir associação cruzada.
- **FR-003**: A capacidade de produzir, aceitar ou associar diagnóstico MUST permanecer indisponível até G1–G3 estarem satisfeitos. Nenhum mecanismo ou regra científica MUST ser inferido de schema, documentação histórica ou alternativa técnica.
- **FR-004**: Um diagnóstico aceito MUST possuir evidência registrada de conformidade emitida pelo procedimento e pelos critérios aprovados pela autoridade científica em G2, além de preservar a coleta de origem e as referências de proveniência, contrato científico e algoritmo no nível aprovado. Exceções ao procedimento MUST exigir revisão científica individual registrada. A evidência completa e as identidades do produtor/revisor MUST ficar restritas à auditoria autorizada. Versão de algoritmo MUST NOT substituir versão do contrato, nem o inverso.
- **FR-005**: A consulta normal MUST apresentar somente o conteúdo e a interpretação aprovados em G2, coleta e área de origem, referências do contrato e algoritmo e estado, data e procedimento de aceite. MUST NOT expor identidades do produtor/revisor, detalhes da evidência restrita nem afirmar fórmula, classe, limiar ou qualidade ausentes.
- **FR-006**: Quando uma referência aprovada de versão estiver disponível, a consulta MUST mostrá-la sem alteração. Quando uma referência exigida estiver ausente, o sistema MUST seguir a classificação decidida em G2 e MUST NOT inventá-la.
- **FR-007**: Ausência de diagnóstico aceito MUST ser distinguida de valor zero, classe mínima, falha de cálculo ou diagnóstico incompleto; nenhum resultado padrão MUST ser fabricado.
- **FR-008**: Laboratório inativo MUST permitir somente a leitura autorizada de diagnóstico existente e MUST recusar produção, associação, substituição ou qualquer outra escrita, inclusive por acesso direto.
- **FR-009**: Recursos inexistentes e inacessíveis MUST ter comportamento indistinguível. Respostas de consulta normal MUST NOT expor dados científicos não aprovados, identidades do produtor/revisor, autoria interna, evidências restritas, credenciais ou detalhes privilegiados. O mecanismo de auditoria autorizada não pertence à superfície normal desta feature.
- **FR-010**: Diagnóstico legado ou de proveniência insuficiente MUST ser preservado sem promoção automática a cientificamente aceito, sem backfill inventado e sem publicação no fluxo validado até decisão de G2.
- **FR-011**: Associar diagnóstico MUST preservar uma única cadeia de origem válida laboratório → área → coleta → diagnóstico e MUST NOT realocar ou editar a coleta confirmada nem seus dados ambientais. Diagnóstico e associação confirmados MUST permanecer imutáveis.
- **FR-012**: A IMP-006 MUST consumir os dados ambientais e a referência científica integrados pela IMP-005 somente após reconciliação. MUST NOT completar, corrigir, converter ou reinterpretar esses dados para viabilizar um diagnóstico.
- **FR-013**: Cada coleta MUST possuir no máximo um diagnóstico vigente e disponível na consulta principal. Substituição MUST tornar vigente um novo diagnóstico aceito e preservar o anterior como não vigente; revogação MUST registrar motivo e tornar o diagnóstico não vigente; correção MUST ocorrer por novo diagnóstico aceito, nunca por edição do original. Falha, timeout, repetição ou concorrência MUST NOT resultar em sucesso falso, associação parcial, duplicação da mesma operação ou dois diagnósticos vigentes. Identidade, autorização das transições e recuperação MUST seguir G3.
- **FR-014**: A feature MUST manter neutra a forma de produção do diagnóstico até decisão competente; cálculo interno, componente Python, importação, registro manual e serviço externo não são aprovados por esta spec.
- **FR-015**: A feature MUST NOT incluir dashboard, histórico, mapa, gráficos, recomendações, IA, edição/exclusão de coleta, manutenção dos dados ambientais ou definição de arquitetura, schema, endpoints e bibliotecas.

### Key Entities

- **Diagnóstico IHFR aceito**: resultado reconhecido conforme procedimento e critérios aprovados pela autoridade científica em G2, com evidência registrada de conformidade ou, em caso de exceção, revisão científica individual registrada, associado a uma coleta de origem. A consulta normal expõe a cadeia de origem, referências, estado, data e procedimento de aceite, mas não identidades do produtor/revisor nem a evidência restrita. Cada coleta possui no máximo um diagnóstico vigente; o original e sua associação são imutáveis, e registros substituídos, revogados ou corrigidos permanecem preservados como não vigentes. Conteúdo, classes, qualidade, responsáveis pelas transições e demais estados do ciclo permanecem pendentes; a estrutura técnica existente não os aprova.
- **Coleta de origem**: registro confirmado integrado pela IMP-004, associado a área, laboratório e autoria histórica; não é editado pela associação do diagnóstico.
- **Dados ambientais aplicáveis**: observações subordinadas à coleta e à referência científica planejadas pela IMP-005. Seus contratos no commit `d3fade93e71473b88e44bb473fb2adb9718f2f4c` ainda não estão integrados nem são finais.
- **Referência do contrato científico**: identifica as regras científicas sob as quais dados e diagnóstico podem ser aceitos; nível, vigência, evolução e representação dependem de G2.
- **Referência do algoritmo**: identifica a versão do procedimento que produziu o diagnóstico no nível aprovado; não prova aprovação científica e não substitui a referência do contrato.
- **Contexto de acesso**: pessoa elegível, vínculo atual, papel e estado do laboratório. OWNER, ADMIN e MEMBER podem consultar; OWNER e ADMIN podem associar e executar transições de vigência. Processo explicitamente autorizado e responsabilizado pode associar, mas não substituir nem revogar; sua identidade e responsabilização ainda devem ser definidas em G3.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em 100% dos cenários aprovados de consulta, o participante autorizado identifica o resultado, a coleta e a área de origem, as referências do contrato e algoritmo e o estado, a data e o procedimento de aceite, sem informação inventada nem identidade ou evidência restrita (US1).
- **SC-002**: Na matriz com ao menos dois laboratórios, duas áreas e duas coletas, zero diagnóstico é consultado ou associado fora de sua cadeia autorizada de origem (US1/US2).
- **SC-003**: Em 100% dos casos sem diagnóstico aceito, a experiência comunica ausência sem exibir zero, classe, qualidade, versão, recomendação ou resultado padrão (US1).
- **SC-004**: Para todos os casos válidos e inválidos aprovados em G2, somente diagnósticos que satisfazem integralmente o contrato são apresentados como aceitos; zero legado ou resultado incompleto é promovido por inferência (US1/US2).
- **SC-005**: Na matriz com OWNER, ADMIN, MEMBER, processo autorizado e processo não autorizado, há zero leitura indevida, MEMBER não executa escrita, processo autorizado limita-se à associação, processo não autorizado não executa escrita e laboratório inativo admite zero escrita; recursos inexistentes e inacessíveis permanecem indistinguíveis (US1/US2).
- **SC-006**: Todos os cenários de falha, repetição, concorrência, substituição, revogação e correção aprovados em G3 terminam sem sucesso falso, associação parcial, alteração da coleta/dados ambientais ou dos registros originais, duplicação da mesma operação ou mais de um diagnóstico vigente (US2).
- **SC-007**: Em avaliação de cada cenário principal com participante representativo, a pessoa consegue distinguir resultado aceito, ausência e somente leitura e localizar a origem do diagnóstico; registrar o resultado por cenário, sem presumir percentual antes do estudo (US1).

Esses critérios são metas verificáveis, não resultados já alcançados. Os exemplos científicos, a matriz de acesso e o ciclo específico ainda dependem de G2/G3.

## Assumptions

### Dependências e gates materiais

| Gate | Classificação e fonte | Evidência exigida para liberação | Impacto atual |
|---|---|---|---|
| G1 — Dados ambientais integrados | `FATO_DOCUMENTADO`: contratos da IMP-005 **planejados, ainda não integrados**, no commit `d3fade93e71473b88e44bb473fb2adb9718f2f4c`; IMP-004 integrada em `origin/development` `37fb3a4fbf7dda04b9bc3b9f2fc1c64ed3b14e13` | IMP-005 integrada sobre a base vigente; contrato, código, schema, migrations, autorização e testes reconciliados; coleta confirmada e dados aplicáveis disponíveis sem violar imutabilidade | Bloqueia implementação consumidora. Se a IMP-005 avançar, reler seu novo HEAD e reconciliar divergências antes de implementar |
| G2 — Ciência e rastreabilidade | `PENDENCIA_DE_DECISAO`: `CF-PD-005`, `CF-Q-011`; Code-First em revisão. O procedimento de aceite foi esclarecido nesta sessão, sem aprovação de seu conteúdo científico | Autoridade científica e fontes validadas; finalidade, fórmula, variáveis, pesos, classes, limiares, conteúdo do resultado, qualidade, validação, aplicabilidade, versões, compatibilidade/evolução, exemplos válidos/inválidos, procedimento de aceite e evidências verificáveis aprovados. Cada diagnóstico conforme recebe evidência registrada; exceções exigem revisão científica individual registrada | Bloqueia produção, aceitação, projeção científica e classificação de legado enquanto o procedimento e seu conteúdo não forem aprovados; schema e documentos históricos não satisfazem o gate |
| G3 — Produção, responsabilidade e ciclo | `PENDENCIA_DE_DECISAO`: `CF-PD-005`, `CF-PD-006`, alternativas `TD-009`/`TD-012`. O aceite científico permanece separado da associação operacional; foram decididos um único diagnóstico vigente, imutabilidade, transições por acréscimo e a matriz funcional OWNER/ADMIN/MEMBER/processo | Produto decide a forma funcional; ciência valida o contrato e o procedimento de aceite; dados aprovam proveniência e os demais estados; segurança valida a matriz decidida; arquitetura decide execução. Identidade e responsabilização do processo, identidade do produtor, repetição, concorrência e recuperação definidos | Bloqueia a associação por processo e o ciclo executável enquanto identidade/responsabilidade e controles restantes não forem definidos. Nenhuma alternativa técnica é escolhida nesta spec |

O escopo documental é completo no limite autorizado: origem, consulta, associação condicionada, segurança e gates são testáveis. A implementação permanece bloqueada porque G1–G3 contêm contratos indispensáveis. Responsáveis nominais e prazos não foram especificados.

`PENDENCIA_DE_DECISAO` — ciência, produto e dados devem decidir, com origem registrada, o efeito de correção, complementação, substituição ou mudança de contrato da IMP-005 sobre um diagnóstico já aceito. Até essa decisão, nenhuma mudança nos dados ambientais recalcula, reinterpreta, substitui ou revoga automaticamente o diagnóstico. O tema não impede planejamento condicionado, mas bloqueia o ciclo implementável e os respectivos testes de compatibilidade.

### Fronteiras com outras entregas

- **IMP-001 a IMP-004 — integradas**: fornecem acesso autenticado, laboratório, área e coleta confirmada. A IMP-006 deve preservar seus contratos observados na base integrada.
- **IMP-005 — em andamento**: fornece dados ambientais e referência científica para a coleta. Seus documentos no SHA consultado são planejamento, não implementação ou contrato final.
- **IMP-007/008 — posteriores**: dashboard, histórico, mapas, gráficos, visualização analítica e acompanhamento territorial não pertencem à IMP-006.

### Fora do escopo

Definir ou implementar fórmula, pesos, variáveis, classes, limiares e interpretação científica; escolher mecanismo de produção ou arquitetura; selecionar Python, integração, serviço externo, schema, endpoints ou bibliotecas; registrar ou editar dados ambientais; editar/excluir coleta; dashboards, histórico, mapa, gráficos e recomendações; IA; código, Prisma, migrations, dependências, banco, tasks e `$speckit-plan`.

### Fontes e baseline

Base Git: `origin/development` em `37fb3a4fbf7dda04b9bc3b9f2fc1c64ed3b14e13`, com IMP-004 integrada pelo merge `37fb3a4`. Fonte IMP-005: `origin/005-environmental-collection-data` em `d3fade93e71473b88e44bb473fb2adb9718f2f4c`, consultada por leitura direta de `spec.md`, `plan.md`, `research.md`, `data-model.md`, `quickstart.md`, `source-review.md`, `contracts/environmental-data-boundary.md` e `checklists/requirements.md`. Não houve checkout, merge, cherry-pick ou rebase da IMP-005. O pacote Code-First foi usado conforme sua classificação `EM_REVISAO`; código/schema não foram promovidos a ciência ou intenção aprovada.
