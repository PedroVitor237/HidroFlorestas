# Registro documental

## Escopo deste registro

Este é o registro canônico para o inventário documental. A estrutura está definida, mas o inventário completo ainda não foi executado. Nesta versão constam somente os documentos canônicos de governança e `docs/raw/` como um único conjunto de evidências históricas imutáveis. Os arquivos desse conjunto não estão inventariados individualmente.

## Colunas do inventário

| Coluna | Uso |
|---|---|
| Identificador | Chave estável do registro. |
| Título | Nome legível do documento ou conjunto. |
| Caminho | Localização no repositório. |
| Categoria | Tipo documental. |
| Camada | Domínio principal, como governança, ciência, produto, UX, arquitetura ou implementação. |
| Origem | Fonte ou processo que produziu o documento. |
| Versão | Versão declarada pela fonte. |
| Data | Data documental declarada ou conhecida. |
| Responsável | Responsável explicitamente identificado. |
| Estado documental | Estado conforme a legenda deste registro. |
| Autoridade | Assunto sobre o qual o documento tem autoridade e seus limites. |
| Caráter normativo ou histórico | Natureza normativa, informativa, operacional ou histórica. |
| Substitui | Identificador do documento anterior substituído. |
| Substituído por | Identificador do documento que passou a substituí-lo. |
| Última verificação | Data e alcance da verificação mais recente. |
| Checksum, quando aplicável | Algoritmo e valor usados para verificar integridade. |
| Observações | Restrições, pendências e contexto indispensável. |

Use `não especificado` quando a fonte não informar versão, data, responsável ou outro campo necessário. A inclusão no registro não concede autoridade além da definida em [SOURCE_AUTHORITY.md](SOURCE_AUTHORITY.md).

## Legenda de estados documentais

| Estado | Significado |
|---|---|
| `CANONICO_ATUAL` | Documento singular vigente para a finalidade delimitada no campo Autoridade. |
| `HISTORICO_IMUTAVEL` | Evidência preservada sem edição; não é automaticamente normativa na atualidade. |
| `EM_AUDITORIA` | Conteúdo em levantamento e confronto controlado, ainda sem conclusão. |
| `EM_REVISAO` | Documento em revisão pela autoridade competente. |
| `PROPOSTO` | Documento ou alteração sem aprovação registrada. |
| `SUBSTITUIDO` | Documento que teve sucessor explicitamente registrado. |
| `ARQUIVADO` | Documento retirado do uso corrente e mantido para histórico. |
| `NAO_AVALIADO` | Estado, origem ou autoridade ainda não avaliados. |

## Identificação e proveniência

| Identificador | Título | Caminho | Categoria | Camada | Origem | Versão | Data | Responsável |
|---|---|---|---|---|---|---|---|---|
| `DOC-001` | Instruções para agentes | `AGENTS.md` | Instrução canônica | Governança | Mandato de governança fornecido pela equipe | não especificado | 2026-08-24 | não especificado |
| `DOC-002` | Contexto do projeto HidroFlorestas | `PROJECT_CONTEXT.md` | Contexto canônico | Transversal e navegacional | Mandato de governança fornecido pela equipe; identidade básica do `README.md` | não especificado | 2026-08-24 | não especificado |
| `DOC-003` | Registro de decisões técnicas | `TECH_DECISIONS.md` | Registro vivo | Arquitetura | Mandato e relatos fornecidos pela equipe para a governança | não especificado | 2026-08-24 | não especificado |
| `DOC-004` | Política de planos de execução | `PLANS.md` | Política canônica | Governança | Mandato de governança fornecido pela equipe | não especificado | 2026-08-24 | não especificado |
| `DOC-005` | Autoridade das fontes | `docs/governance/SOURCE_AUTHORITY.md` | Política canônica | Governança | Mandato de governança fornecido pela equipe | não especificado | 2026-08-24 | não especificado |
| `DOC-006` | Registro documental | `docs/governance/DOCUMENT_REGISTER.md` | Registro canônico | Governança | Mandato de governança fornecido pela equipe | não especificado | 2026-08-24 | não especificado |
| `DOC-007` | Decisões pendentes | `docs/governance/PENDING_DECISIONS.md` | Registro vivo | Governança transversal | Mandato de governança fornecido pela equipe | não especificado | 2026-08-24 | não especificado |
| `DOC-RAW-001` | Evidências históricas de `docs/raw/` | `docs/raw/` | Conjunto documental | Múltiplas; ainda não avaliadas individualmente | Fontes históricas preexistentes; origens individuais não avaliadas | não especificado | não especificado | não especificado |

## Estado, autoridade e rastreabilidade

| Identificador | Estado documental | Autoridade | Caráter normativo ou histórico | Substitui | Substituído por | Última verificação | Checksum, quando aplicável | Observações |
|---|---|---|---|---|---|---|---|---|
| `DOC-001` | `CANONICO_ATUAL` | Instruções estáveis para agentes no escopo do repositório. | Normativo no próprio escopo. | não especificado | não especificado | 2026-08-24; existência, estrutura e escopo | não calculado nesta etapa | Não deve concentrar contexto, requisitos ou arquitetura volátil. |
| `DOC-002` | `CANONICO_ATUAL` | Contexto mínimo e navegação entre camadas e registros. | Canônico informativo; não valida as camadas referenciadas. | não especificado | não especificado | 2026-08-24; existência, estrutura e escopo | não calculado nesta etapa | Limites de validação registrados no próprio documento. |
| `DOC-003` | `CANONICO_ATUAL` | Estado das decisões e alternativas técnicas, conforme origem registrada. | Misto: normativo para intenção confirmada; informativo para propostas e implementação não verificada. | não especificado | não especificado | 2026-08-24; existência, campos e estados | não calculado nesta etapa | Estado decisório e estado de implementação são independentes. |
| `DOC-004` | `CANONICO_ATUAL` | Planejamento e acompanhamento de tarefas extensas. | Normativo no próprio escopo. | não especificado | não especificado | 2026-08-24; existência, estrutura e escopo | não calculado nesta etapa | Os diretórios futuros de planos não foram criados. |
| `DOC-005` | `CANONICO_ATUAL` | Autoridade por assunto, classificação de informações e protocolo de conflitos. | Normativo no próprio escopo. | não especificado | não especificado | 2026-08-24; existência, matriz e protocolo | não calculado nesta etapa | Não declara conflitos específicos como identificados ou resolvidos. |
| `DOC-006` | `CANONICO_ATUAL` | Estrutura e estado do inventário documental. | Canônico de controle. | não especificado | não especificado | 2026-08-24; estrutura e registros iniciais | não calculado nesta etapa | Inventário completo ainda não executado. |
| `DOC-007` | `CANONICO_ATUAL` | Estado e encaminhamento de pendências; não decide seus méritos. | Operacional, sem autoridade para resolver as pendências. | não especificado | não especificado | 2026-08-24; existência, campos e pendências iniciais | não calculado nesta etapa | Itens permanecem abertos até decisão com origem registrada. |
| `DOC-RAW-001` | `HISTORICO_IMUTAVEL` | Depende do assunto, da origem e da aprovação conforme `SOURCE_AUTHORITY.md`; não é automaticamente normativa atual. | Histórico imutável. | não aplicável ao conjunto | não especificado | 2026-08-24; nomes, caminhos e metadados de existência apenas | não calculado; arquivos individuais fora do inventário desta etapa | Conjunto com 13 arquivos; nenhum conteúdo foi auditado ou registrado individualmente nesta etapa. |

Novos registros, versões, relações de substituição e checksums só devem ser acrescentados quando verificados. O histórico anterior deve ser preservado.
