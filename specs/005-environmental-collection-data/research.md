# Research: Dados ambientais da coleta

**Date**: 2026-09-15
**Status**: Pesquisa finalizada; G1–G3 fechados para a captura v1. Não constitui validação científica do cálculo IHFR.

A solicitação atual permite explicitamente registrar gates científicos no planejamento. Isso limita a regra geral da skill de resolver desconhecidos: nenhuma pesquisa técnica substitui aprovação científica ou de produto. As decisões abaixo são `RECOMENDACAO`, salvo quando identificadas como fato ou evidência. Fontes e SHAs em [source-review.md](source-review.md).

## R-001 — Base real e integração

**Decision (`RECOMENDACAO`)**: consumir diretamente a coleta IMP-004 já integrada a `development`, após reconciliar a ancestralidade da branch IMP-005. Não criar fallback sobre os models legados nem copiar uma segunda implementação do guard, das rotas ou da coleta.

**Rationale**: `EVIDENCIA_IMPLEMENTACAO` — `origin/development` em `37fb3a4` contém `authorizeLaboratoryAccess`, `LaboratoryMembershipRole`, rotas contextuais, serviço injetável, campos temporais, idempotência, FK contextual e trigger de imutabilidade trazidos pela IMP-004 `7c97714`.

**Alternatives considered**: desenvolver um guard provisório continua descartado por duplicação e incompatibilidade. G1 está fechado; a branch IMP-005 ainda precisa reconciliar sua ancestralidade antes de implementação.

## R-002 — Autoridade científica

**Decision (`FATO_DOCUMENTADO` e `PENDENCIA_DE_DECISAO`)**: nenhuma lista normativa de medições foi localizada nas fontes autorizadas. Manter G2 e não emitir schema executável de payload ou modelo físico fechado.

**Rationale**: backlog IMP-005 declara `AGUARDANDO_DECISAO_CIENTIFICA`; FR-007, UC-011, CF-Q-011 e revisão H08 distinguem campo técnico de contrato aprovado. `PD-002` e `PD-004` mantêm autoridades pendentes. A matriz global classifica DOC-RAW-007 e DOC-RAW-011 como históricos sem validação científica. A leitura desses dois documentos confirma conteúdos candidatos, não aprovação. Há diferenças de representação, por exemplo presença binária de APP na matriz versus categorias de condição da mata ciliar no protocolo. Não escolher uma delas nem traduzi-las silenciosamente para `hasRiparian_app`.

**Alternatives considered**: copiar os quatro models atuais, usar a matriz histórica como norma ou interpretar H08 como aprovação foram descartados por extrapolação de autoridade. Não é necessário resolver fórmulas de IHFR para documentar a IMP-005; elas permanecem fora do escopo.

## R-003 — Permissões específicas

**Decision (`PENDENCIA_DE_DECISAO`)**: a capacidade `CREATE_COLLECTION` dos papéis OWNER/ADMIN/MEMBER cria metadados gerais; não comprova permissão para incluir, consultar ou complementar dados científicos. G3 deve aprovar a matriz específica, incluindo eventual restrição de autoria.

**Rationale**: a spec IMP-004 delimita suas permissões ao próprio incremento. A solicitação IMP-005 exige respeito ao papel contextual, sem definir uma nova matriz. Reaproveitar ordem de autorização é compatível; conceder uma capacidade nova automaticamente não é.

**Alternatives considered**: limitar tudo ao autor ou conceder escrita a qualquer membro são alternativas de produto, não defaults técnicos. Ambas ficam sem escolha. Inatividade, vínculo atual e indistinguibilidade já estão definidos e não precisam ser perguntados novamente.

## R-004 — Coleta imutável e anexação

**Decision (`RECOMENDACAO`)**: planejar persistência dos dados subordinados sem atualizar a linha de `CollectionData` confirmada. Nunca enfraquecer a imutabilidade para anexar medições.

**Rationale**: `FATO_DOCUMENTADO` — data-model/plan da IMP-004 planejam trigger contra UPDATE/DELETE de coleta confirmada. Um caminho que toque o pai, inclusive seu `updatedAt`, pode contrariar esse contrato. A resolução vigente exige inserção direta no dependente com referência revalidada e transação própria. A inclusão não deve alterar ocorrência, confirmação, autor ou território. Teste PostgreSQL deve provar a compatibilidade, não presumir comportamento de escrita aninhada.

**Alternatives considered**: PATCH da coleta, desabilitar trigger, recriar coleta ou reutilizar `observations` como JSON científico foram descartados por violar escopo e integridade. O formato definitivo do dependente permanece bloqueado por G2.

## R-005 — Versão do contrato e legado

**Decision (`PENDENCIA_DE_DECISAO`)**: preservar a necessidade de identificar o contrato no nível aprovado sem selecionar tabela de versões, JSON genérico, EAV ou versão única por coleta antes de G2.

**Rationale**: o schema só registra `IHFRDiagnosis.algorithmVersion`; não há representação da versão do contrato ambiental. Os filhos têm FKs únicas e não registram autor próprio ou referência de contrato. Relações reversas em lista não removem essa unicidade. Legado não pode receber uma versão inventada, ser convertido automaticamente ou aparecer como validado.

**Alternatives considered**: fixar `1.0.0` por semelhança com algoritmo, retirar unicidades para aceitar múltiplas observações ou impor exatamente quatro grupos foram descartados como decisões científicas/dados sem origem. Reuso ou evolução dos models depende de mapeamento aprovado.

## R-006 — Ciclo, atomicidade e repetição

**Decision (`RECOMENDACAO`)**: submeter a G3 um ciclo mínimo de preparação e revisão em memória, envio explícito de uma unidade integral e retorno verificável; a mesma tentativa deve poder ser recuperada sem duplicação. Não introduzir rascunho persistido ou edição/complementação automaticamente.

**Rationale**: evita sucesso falso e associação parcial tratada como válida, sem confundir nova observação com retry. A IMP-004 já protege a confirmação da coleta, mas sua chave e tupla com `occurredAt` não identificam um envio de medições. Unidade científica, multiplicidade e fronteira de confirmação precisam ser decididas antes do desenho da chave ou constraint.

**Alternatives considered**: reutilizar `confirmationKey` da coleta ou deduplicar por conteúdo foram descartados; criar outro conjunto após timeout sem resolver o anterior também é inadequado. Contrato HTTP de escrita fica deliberadamente sem método/payload final até G3.

## R-007 — Organização e interfaces

**Decision (`RECOMENDACAO`)**: manter o monólito existente, autenticação e guard compartilhados, handlers finos, serviço com dependências injetáveis e projeções por allowlist. Documentar agora contrato de fronteira e interface em Markdown, sem OpenAPI com payload fictício.

**Rationale**: a IMP-004 implementa handlers finos, serviço injetável, `{ collection }`, `{ error: { code, message } }`, `Cache-Control: no-store` e DTO fechado. A IMP-005 deve preservar essas convenções sem acrescentar campos científicos ao detalhe da coleta.

**Alternatives considered**: serviço externo de ciência, biblioteca de formulário orientada a schema, framework genérico de medições ou arquitetura de mapas não são justificados por este recorte. Nenhuma dependência será adicionada nesta etapa.

## R-008 — Validação

**Decision (`RECOMENDACAO`)**: futuras validações devem separar testes de contrato científico, autorização, integridade transacional, UI, banco real e regressão; usar ferramentas já declaradas no repositório. O quickstart distingue comandos existentes de alvos futuros.

**Rationale**: a IMP-004 comprovou `node:test`, integração, Playwright, migration em PostgreSQL isolado, lint, typecheck, build, fixtures allowlisted e teardown zerado. A IMP-005 deve estender esses padrões somente depois de G2–G3, acrescentando vetores científicos aprovados.

**Alternatives considered**: tratar documentação, mocks ou teste simulado como prova de integração foi descartado. Não gerar medições sintéticas com significado científico inventado apenas para obter testes verdes.

## Resultado da pesquisa

- Conhecidos: arquitetura local, ferramentas declaradas, fronteiras herdadas, divergência de integração e risco concreto da trigger.
- G1 foi fechado pela implementação `7c97714` e pelo merge `37fb3a4`.
- `DECISAO_CONFIRMADA` em 2026-09-17: G2 foi fechado para captura técnica pelo contrato `ihfr-measurement-v1`; G3 foi fechado com os três papéis vinculados, conjunto único/integral/imutável, revisão, confirmação atômica e idempotência própria.
- As alternativas pendentes registradas em R-002, R-003, R-005 e R-006 preservam a justificativa histórica anterior à decisão. A resolução vigente está nos contratos v1, em `spec.md` e em `data-model.md`.
- Fórmulas, pesos, limiares e validação científica do IHFR continuam fora da IMP-005; o contrato matemático fixa somente a interface versionada para a IMP-006.

## R-009 — Forma recomendada do contrato matemático

**Decision (`RECOMENDACAO`)**: separar três artefatos versionados: (1) contrato de medição, com variáveis, tipos, unidades, precisão, ausências e aplicabilidade; (2) contrato matemático, com funções, normalizações, pesos, limiares e política de dados faltantes; e (3) versão do algoritmo executável. A versão de qualquer um não deve substituir as demais.

**Rationale**: essa separação permite evoluir o formulário sem reinterpretar medições antigas e evoluir o cálculo sem alterar o dado observado. Cada diagnóstico futuro deve registrar as versões exatas consumidas e um hash do manifesto aplicável.

**Alternatives considered**: fórmulas hardcoded na UI, pesos em colunas soltas e uso exclusivo de `IHFRDiagnosis.algorithmVersion` foram descartados como fonte única, pois misturam ciência, captura e execução e dificultam reprodução.

**RECOMENDACAO de estrutura**: representar o contrato matemático como manifesto declarativo e imutável, revisado pela autoridade científica, contendo IDs estáveis de entradas, unidade canônica, domínio, função de transformação/normalização, regra de composição, pesos cuja soma e escala sejam explicitadas, limiares inclusivos/exclusivos, tratamento de ausente/desconhecido/não aplicável, regra de qualidade/confiança e saídas. Manter casos dourados válidos, limites e inválidos em JSON/CSV independente da linguagem.

**RECOMENDACAO de execução**: começar com um avaliador puro e determinístico dentro do monólito, sem acesso direto ao banco, alimentado por DTO validado e manifesto fixo. TypeScript reduz custo de integração inicial; Python só deve ser adotado se a complexidade científica ou bibliotecas exigirem, conforme TD-009/TD-012. Em ambos os casos, os mesmos vetores dourados devem provar paridade.
- A skill solicitou pesquisa por agente. Um agente realizou inspeção parcial e apontou o risco da imutabilidade, mas foi interrompido por limite de uso; a conferência e a consolidação foram concluídas pelo agente principal nas fontes locais.
