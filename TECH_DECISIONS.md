# Registro de decisões técnicas

## Como interpretar o registro

Cada entrada usa dimensões independentes:

- **Classificação da informação:** indica a natureza da afirmação e sua origem, conforme [docs/governance/SOURCE_AUTHORITY.md](docs/governance/SOURCE_AUTHORITY.md).
- **Estado decisório:** indica se a alternativa está `CONFIRMADO`, `PROPOSTO`, `EM_AVALIACAO`, `ADIADO`, `REJEITADO` ou `SUBSTITUIDO`.
- **Estado de implementação:** indica se está `IMPLEMENTADO_VERIFICADO`, `IMPLEMENTACAO_RELATADA_PENDENTE_DE_VERIFICACAO`, `NAO_IMPLEMENTADO`, `PARCIALMENTE_IMPLEMENTADO`, `NAO_AVALIADO` ou `NAO_APLICAVEL`.

Uma decisão `CONFIRMADO` não implica implementação verificada. Da mesma forma, implementação observada não substituiria a confirmação da intenção. Alterações futuras devem acrescentar uma linha ao histórico antes de atualizar o estado corrente; estados anteriores não devem ser apagados.

## Escolhas relatadas pela equipe

As escolhas `TD-001` a `TD-007` foram informadas como adotadas; sua classificação `DECISAO_RELATADA_PENDENTE_DE_VERIFICACAO` registra que a adoção foi relatada e que a implementação ainda não foi verificada. `TD-015` decorre da decisão da equipe registrada em 2026-09-18 e da clarificação normativa de validação de 2026-09-20. `TD-016` registra a decisão focal autorizada em 2026-09-19 como `DECISAO_EXPERIMENTAL_DE_ENGENHARIA`. Nenhuma das duas implica implementação ou validação científica definitiva.

| Identificador | Assunto | Decisão ou alternativa | Classificação | Estado decisório | Estado de implementação |
|---|---|---|---|---|---|
| `TD-001` | Framework full-stack | Adotar Next.js como framework full-stack. | `DECISAO_RELATADA_PENDENTE_DE_VERIFICACAO` | `CONFIRMADO` | `IMPLEMENTACAO_RELATADA_PENDENTE_DE_VERIFICACAO` |
| `TD-002` | Banco de dados | Adotar PostgreSQL. | `DECISAO_RELATADA_PENDENTE_DE_VERIFICACAO` | `CONFIRMADO` | `IMPLEMENTACAO_RELATADA_PENDENTE_DE_VERIFICACAO` |
| `TD-003` | Banco de desenvolvimento | Adotar Neon no plano gratuito para desenvolvimento. | `DECISAO_RELATADA_PENDENTE_DE_VERIFICACAO` | `CONFIRMADO` | `IMPLEMENTACAO_RELATADA_PENDENTE_DE_VERIFICACAO` |
| `TD-004` | ORM | Adotar Prisma ORM; a equipe relatou que já existe código relacionado. | `DECISAO_RELATADA_PENDENTE_DE_VERIFICACAO` | `CONFIRMADO` | `IMPLEMENTACAO_RELATADA_PENDENTE_DE_VERIFICACAO` |
| `TD-005` | Estilização | Adotar Tailwind CSS. | `DECISAO_RELATADA_PENDENTE_DE_VERIFICACAO` | `CONFIRMADO` | `IMPLEMENTACAO_RELATADA_PENDENTE_DE_VERIFICACAO` |
| `TD-006` | Ícones | Adotar Lucide React. | `DECISAO_RELATADA_PENDENTE_DE_VERIFICACAO` | `CONFIRMADO` | `IMPLEMENTACAO_RELATADA_PENDENTE_DE_VERIFICACAO` |
| `TD-007` | Hospedagem da aplicação | Adotar Vercel para hospedar a aplicação no contexto atualmente relatado. | `DECISAO_RELATADA_PENDENTE_DE_VERIFICACAO` | `CONFIRMADO` | `IMPLEMENTACAO_RELATADA_PENDENTE_DE_VERIFICACAO` |
| `TD-015` | Avaliador IHFR experimental v0.1 | Adotar avaliador determinístico server-side no backend TypeScript existente, regido para novos diagnósticos pelo manifesto `ihfr-math-experimental-v0.1.1`; preservar a v0.1.0 como histórica; não usar Python, FastAPI, serviço externo ou IA generativa nesta versão. | `DECISAO_CONFIRMADA` | `CONFIRMADO` | `PARCIALMENTE_IMPLEMENTADO` |
| `TD-016` | Classificação `landUseType` da v0.1 experimental | Adotar os sete valores e scores de `DOC-RAW-013`, exigir uma categoria predominante, rejeitar valor desconhecido e tratar ausência como insuficiência; preservar alternativas e perfil regional sem ativá-los. | `DECISAO_EXPERIMENTAL_DE_ENGENHARIA` | `CONFIRMADO` | `PARCIALMENTE_IMPLEMENTADO` |

### Origem e evidências das escolhas relatadas

| Identificador | Origem | Data | Responsável | Evidências | Dependências | Observações | ADR relacionado |
|---|---|---|---|---|---|---|---|
| `TD-001` | relato da equipe fornecido para a governança | não especificado | não especificado | Relato da equipe; implementação não verificada. | não especificado | Nenhuma inspeção do código foi realizada para esta entrada. | não especificado |
| `TD-002` | relato da equipe fornecido para a governança | não especificado | não especificado | Relato da equipe; implementação não verificada. | não especificado | Nenhuma inspeção de schema, migration ou configuração foi realizada para esta entrada. | não especificado |
| `TD-003` | relato da equipe fornecido para a governança | não especificado | não especificado | Relato da equipe; implementação não verificada. | não especificado | A escolha relatada limita-se ao plano gratuito para desenvolvimento; outros ambientes não foram especificados. | não especificado |
| `TD-004` | relato da equipe fornecido para a governança | não especificado | não especificado | Relato da equipe de que a escolha foi adotada e de que existe código relacionado; código não verificado. | não especificado | Existência, abrangência e conformidade da implementação permanecem sem avaliação. | não especificado |
| `TD-005` | relato da equipe fornecido para a governança | não especificado | não especificado | Relato da equipe; implementação não verificada. | não especificado | Nenhuma inspeção do código foi realizada para esta entrada. | não especificado |
| `TD-006` | relato da equipe fornecido para a governança | não especificado | não especificado | Relato da equipe; implementação não verificada. | não especificado | Nenhuma inspeção do código foi realizada para esta entrada. | não especificado |
| `TD-007` | relato da equipe fornecido para a governança | não especificado | não especificado | Relato da equipe; implementação não verificada. | não especificado | Não resolve a estratégia futura de hospedagem registrada em `TD-013`. | não especificado |
| `TD-015` | solicitação da equipe para consolidação e remediação focal da IMP-006 | 2026-09-18; clarificação 2026-09-20 | equipe HidroFlorestas | [ADR-0001](docs/governance/ADR-0001-contrato-experimental-ihfr-v0-1.md), manifestos, `src/app/api/server/ihfr-diagnosis/manifest-loader.ts`, `evaluator.ts` e testes unitários focais; ciclo de escrita ainda ausente. | suplemento `ihfr-diagnosis-input-experimental-v0.1.0`; `ihfr-measurement-v1` | A v0.1.1 distingue ausência opcional conhecida de entrada desconhecida sem alterar fórmula, pesos ou scores; `VALIDACAO_CIENTIFICA_PENDENTE` e recalibração futura preservadas. | `ADR-0001` |
| `TD-016` | solicitação da equipe para auditoria e consolidação focal de `landUseType` | 2026-09-19 | equipe HidroFlorestas | [ADR-0001 §7](docs/governance/ADR-0001-contrato-experimental-ihfr-v0-1.md#7-decisão-focal-de-landusetype), manifesto, `evaluator.ts` e `tests/unit/ihfr-diagnosis-input-policy.test.ts`; suplemento ainda não é criado pelo serviço. | suplemento `ihfr-diagnosis-input-experimental-v0.1.0`; `TD-015` | Perfil `GENERAL_EXPERIMENTAL`; aplicabilidade territorial científica não comprovada; ciclo de escrita e validação científica pendentes. | `ADR-0001` |

## Decisões confirmadas ainda não implementadas

| Identificador | Assunto | Decisão ou alternativa | Classificação | Estado decisório | Estado de implementação |
|---|---|---|---|---|---|
| `TD-010` | Gráficos e visualizações analíticas territoriais | Adotar Plotly como direção para gráficos e visualizações analíticas futuros relacionados aos registros do contexto territorial, sempre em entrega posterior à IMP-009. A entrega poderá ocorrer em paralelo com a IMP-010, sem depender dela. | `DECISAO_CONFIRMADA` | `CONFIRMADO` | `NAO_IMPLEMENTADO` |

O registro inicial de `TD-010` era uma avaliação sem aprovação. A confirmação acima substitui esse estado decisório sem apagar o evento histórico e sem alterar o estado de implementação; integração, entradas e gráficos concretos continuam abertos.

### Origem, condições e limites da decisão confirmada

| Identificador | Origem | Data | Responsável | Evidências | Dependências | Observações | ADR relacionado |
|---|---|---|---|---|---|---|---|
| `TD-010` | confirmação explícita da equipe nas solicitações aprovadas de atualização documental da IMP-008 | 2026-09-18 | equipe solicitante | Decisão registrada em `specs/008-territorial-map/spec.md`, `plan.md` e `research.md`; nenhuma implementação ou dependência Plotly foi verificada. | Condição temporal: entrega futura somente após a IMP-009. Dados ambientais e IHFR exigem contratos integrados e, quando aplicável, aprovação científica. | Plotly não integra o mapa mínimo da IMP-008; Leaflet/React-Leaflet permanecem a escolha local planejada para esse mapa. Permanecem abertas arquitetura de execução, frontend versus Plotly Python, dados/contratos de entrada e gráficos concretos. Não autoriza Python, PostGIS, nova dependência ou segundo motor do mapa. Paralelismo eventual com a IMP-010 não cria dependência. | não especificado |

## Alternativas ainda não aprovadas

As entradas abaixo não têm autoridade normativa e não devem ser tratadas como decisões confirmadas.

| Identificador | Assunto | Decisão ou alternativa | Classificação | Estado decisório | Estado de implementação |
|---|---|---|---|---|---|
| `TD-008` | Base cartográfica | Avaliar o uso de OpenStreetMap. | `EM_AVALIACAO` | `EM_AVALIACAO` | `NAO_AVALIADO` |
| `TD-009` | Cálculos científicos | Avaliar o uso futuro de Python para cálculos científicos e do IHFR; alternativa não selecionada para a v0.1 experimental. | `EM_AVALIACAO` | `ADIADO` | `NAO_IMPLEMENTADO` |
| `TD-011` | Biblioteca de mapas | Considerar a possibilidade de uso de Leaflet. | `PROPOSTA` | `PROPOSTO` | `NAO_AVALIADO` |
| `TD-012` | Integração de componentes | Avaliar futuramente a integração Python–Next.js caso Python seja aprovado; não aplicável à v0.1 experimental. | `EM_AVALIACAO` | `ADIADO` | `NAO_IMPLEMENTADO` |
| `TD-013` | Hospedagem futura | Avaliar a estratégia futura de hospedagem. | `EM_AVALIACAO` | `EM_AVALIACAO` | `NAO_AVALIADO` |
| `TD-014` | Mapas e visualizações | Avaliar a arquitetura definitiva para mapas e visualizações. | `EM_AVALIACAO` | `EM_AVALIACAO` | `NAO_AVALIADO` |

### Origem e evidências das alternativas

| Identificador | Origem | Data | Responsável | Evidências | Dependências | Observações | ADR relacionado |
|---|---|---|---|---|---|---|---|
| `TD-008` | Item informado pela equipe para registro de governança, sem aprovação | não especificado | não especificado | Registro da alternativa; não constitui aprovação nem evidência de implementação. | `PD-007` em `docs/governance/PENDING_DECISIONS.md` | Critérios de adoção não especificados. | não especificado |
| `TD-009` | Item informado pela equipe para registro de governança, sem aprovação | não especificado | não especificado | Registro da alternativa; não constitui aprovação nem evidência de implementação. | `PD-008` em `docs/governance/PENDING_DECISIONS.md` | Escopo dos componentes e critérios científicos não especificados. | não especificado |
| `TD-011` | Item informado pela equipe para registro de governança, sem aprovação | não especificado | não especificado | Registro da proposta; não constitui aprovação nem evidência de implementação. | `PD-010` em `docs/governance/PENDING_DECISIONS.md` | A consideração de Plotly não rejeita nem substitui esta proposta. | não especificado |
| `TD-012` | Item informado pela equipe para registro de governança, sem aprovação | não especificado | não especificado | Registro do tema em avaliação; estratégia não definida. | `PD-011` em `docs/governance/PENDING_DECISIONS.md` | Interfaces, responsabilidades e forma de implantação não especificadas. | não especificado |
| `TD-013` | Item informado pela equipe para registro de governança, sem aprovação | não especificado | não especificado | Registro do tema em avaliação; estratégia futura não definida. | `PD-012` em `docs/governance/PENDING_DECISIONS.md` | A escolha relatada de Vercel não resolve automaticamente a estratégia futura. | não especificado |
| `TD-014` | Item informado pela equipe para registro de governança, sem aprovação | não especificado | não especificado | Registro do tema em avaliação; arquitetura não definida. | `PD-013` em `docs/governance/PENDING_DECISIONS.md` | A avaliação dos componentes não define sua combinação nem a arquitetura definitiva. | não especificado |

## Histórico de estados

Cada mudança deve acrescentar uma linha com a origem e manter as linhas anteriores.

| Entrada | Data | Evento | Estado decisório registrado | Estado de implementação registrado | Origem |
|---|---|---|---|---|---|
| `TD-001` | não especificado | Registro inicial | `CONFIRMADO` | `IMPLEMENTACAO_RELATADA_PENDENTE_DE_VERIFICACAO` | relato da equipe fornecido para a governança |
| `TD-002` | não especificado | Registro inicial | `CONFIRMADO` | `IMPLEMENTACAO_RELATADA_PENDENTE_DE_VERIFICACAO` | relato da equipe fornecido para a governança |
| `TD-003` | não especificado | Registro inicial | `CONFIRMADO` | `IMPLEMENTACAO_RELATADA_PENDENTE_DE_VERIFICACAO` | relato da equipe fornecido para a governança |
| `TD-004` | não especificado | Registro inicial | `CONFIRMADO` | `IMPLEMENTACAO_RELATADA_PENDENTE_DE_VERIFICACAO` | relato da equipe fornecido para a governança |
| `TD-005` | não especificado | Registro inicial | `CONFIRMADO` | `IMPLEMENTACAO_RELATADA_PENDENTE_DE_VERIFICACAO` | relato da equipe fornecido para a governança |
| `TD-006` | não especificado | Registro inicial | `CONFIRMADO` | `IMPLEMENTACAO_RELATADA_PENDENTE_DE_VERIFICACAO` | relato da equipe fornecido para a governança |
| `TD-007` | não especificado | Registro inicial | `CONFIRMADO` | `IMPLEMENTACAO_RELATADA_PENDENTE_DE_VERIFICACAO` | relato da equipe fornecido para a governança |
| `TD-008` | não especificado | Registro inicial | `EM_AVALIACAO` | `NAO_AVALIADO` | Item informado pela equipe para registro de governança, sem aprovação |
| `TD-009` | não especificado | Registro inicial | `EM_AVALIACAO` | `NAO_AVALIADO` | Item informado pela equipe para registro de governança, sem aprovação |
| `TD-010` | não especificado | Registro inicial | `EM_AVALIACAO` | `NAO_AVALIADO` | Item informado pela equipe para registro de governança, sem aprovação |
| `TD-011` | não especificado | Registro inicial | `PROPOSTO` | `NAO_AVALIADO` | Item informado pela equipe para registro de governança, sem aprovação |
| `TD-012` | não especificado | Registro inicial | `EM_AVALIACAO` | `NAO_AVALIADO` | Item informado pela equipe para registro de governança, sem aprovação |
| `TD-013` | não especificado | Registro inicial | `EM_AVALIACAO` | `NAO_AVALIADO` | Item informado pela equipe para registro de governança, sem aprovação |
| `TD-014` | não especificado | Registro inicial | `EM_AVALIACAO` | `NAO_AVALIADO` | Item informado pela equipe para registro de governança, sem aprovação |
| `TD-009` | 2026-09-18 | Python não selecionado para a v0.1 experimental; avaliação futura preservada | `ADIADO` | `NAO_IMPLEMENTADO` | solicitação da equipe e `ADR-0001` |
| `TD-012` | 2026-09-18 | Integração Python–Next.js tornou-se inaplicável à v0.1 e permanece futura | `ADIADO` | `NAO_IMPLEMENTADO` | solicitação da equipe e `ADR-0001` |
| `TD-015` | 2026-09-18 | Registro inicial do avaliador experimental interno | `CONFIRMADO` | `NAO_IMPLEMENTADO` | solicitação da equipe e `ADR-0001` |
| `TD-015` | 2026-09-20 | v0.1.0 preservada como histórica; v0.1.1 ativada para clarificar validação de entrada, sem mudança matemática | `CONFIRMADO` | `NAO_IMPLEMENTADO` | solicitação de remediação focal e `ADR-0001` v1.2 |
| `TD-016` | 2026-09-19 | Registro inicial da classificação focal de `landUseType` para a v0.1 experimental | `CONFIRMADO` | `NAO_IMPLEMENTADO` | solicitação da equipe e `ADR-0001` §7 |
| `TD-010` | 2026-09-18 | Plotly confirmado somente como direção de gráficos e visualizações analíticas futuros, posteriores à IMP-009; forma de integração e gráficos concretos permanecem abertos | `CONFIRMADO` | `NAO_IMPLEMENTADO` | confirmação explícita da equipe nas solicitações aprovadas de atualização documental da IMP-008 |
| `TD-015` | 2026-09-21 | Manifestos e hashes verificáveis, parser fechado, avaliador determinístico e testes unitários focais observados; autorização, elegibilidade, escrita, ledger e UI seguem pendentes | `CONFIRMADO` | `PARCIALMENTE_IMPLEMENTADO` | `src/app/api/server/ihfr-diagnosis/{manifest-loader,evaluator,ihfr-diagnosis.contracts}.ts`, testes unitários focais, stubs em `ihfr-diagnosis.service.ts` e `specs/006-ihfr-diagnosis/implementation-evidence.md` |
| `TD-016` | 2026-09-21 | Sete valores/scores, rejeição de desconhecidos e insuficiência por ausência implementados no parser/avaliador; persistência do suplemento e fluxo de escrita ainda pendentes | `CONFIRMADO` | `PARCIALMENTE_IMPLEMENTADO` | `src/app/api/server/ihfr-diagnosis/{evaluator,ihfr-diagnosis.contracts}.ts`, `tests/unit/ihfr-diagnosis-input-policy.test.ts`, stub `IHFRDiagnosisService.createOrReplace` |

`TD-015` e `TD-016` possuem `ADR-0001`. As demais entradas continuam sem ADR relacionado; novos ADRs exigem decisão aprovada e natureza compatível.
