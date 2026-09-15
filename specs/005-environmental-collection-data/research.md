# Research: Dados ambientais da coleta

**Date**: 2026-09-15
**Status**: Pesquisa documental/técnica concluída no recorte permitido; G1–G3 permanecem abertos. Não é liberação para implementação.

A solicitação atual permite explicitamente registrar gates científicos no planejamento. Isso limita a regra geral da skill de resolver desconhecidos: nenhuma pesquisa técnica substitui aprovação científica ou de produto. As decisões abaixo são `RECOMENDACAO`, salvo quando identificadas como fato ou evidência. Fontes e SHAs em [source-review.md](source-review.md).

## R-001 — Base real e integração

**Decision (`RECOMENDACAO`)**: consumir a coleta IMP-004 somente após integração comprovada de suas dependências IMP-003 e de seu próprio contrato. Não criar fallback sobre os models legados nem importar implementação da branch documental.

**Rationale**: `EVIDENCIA_IMPLEMENTACAO` — development contém `requireAuth`, serviço de laboratórios, validação por allowlist e handlers com dependências injetáveis. Não contém `authorizeLaboratoryAccess`, `LaboratoryMembershipRole`, rotas contextuais de áreas/coletas ou os campos novos de confirmação. `git diff f440282 a44ac7ab -- src prisma package.json` não apresentou diferenças nesses caminhos; o HEAD IMP-004 é fonte de planejamento, não implementação adicional.

**Alternatives considered**: desenvolver um guard provisório foi descartado por duplicação e incompatibilidade; exigir integração antes de escrever documentação foi descartado porque a solicitação autoriza o plano condicionado. G1 continua aberto.

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

**Rationale**: `FATO_DOCUMENTADO` — data-model/plan da IMP-004 planejam trigger contra UPDATE/DELETE de coleta confirmada. Um caminho que toque o pai, inclusive seu `updatedAt`, pode contrariar esse contrato. Após G2/G3, avaliar inserção direta no dependente com referência revalidada, na mesma unidade transacional exigida pelo ciclo aprovado. A inclusão de filhos não deve alterar ocorrência, confirmação, autor ou território. Teste PostgreSQL deve provar a compatibilidade, não presumir comportamento de escrita aninhada.

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

**Rationale**: `src/app/api/laboratories/route.ts`, `src/app/api/server/laboratories/laboratory.contracts.ts` e `src/app/api/server/services/laboratories.service.ts` demonstram esses padrões. A IMP-004 planeja envelopes diferentes do atual `{ success, ... }`: reconciliar após G1 sem alterar as rotas anteriores. O DTO fechado IMP-004 não pode receber campos científicos silenciosamente.

**Alternatives considered**: serviço externo de ciência, biblioteca de formulário orientada a schema, framework genérico de medições ou arquitetura de mapas não são justificados por este recorte. Nenhuma dependência será adicionada nesta etapa.

## R-008 — Validação

**Decision (`RECOMENDACAO`)**: futuras validações devem separar testes de contrato científico, autorização, integridade transacional, UI, banco real e regressão; usar ferramentas já declaradas no repositório. O quickstart distingue comandos existentes de alvos futuros.

**Rationale**: scripts locais usam `node:test` com `tsx`, Playwright, lint, typecheck e build. Fixtures existentes têm guard de ambiente e cleanup por allowlist; estendê-las apenas depois de G1–G3. Repetição, preservação de pai e constraints exigem comprovação em PostgreSQL isolado. Runtime não foi executado nesta pesquisa.

**Alternatives considered**: tratar documentação, mocks ou teste simulado como prova de integração foi descartado. Não gerar medições sintéticas com significado científico inventado apenas para obter testes verdes.

## Resultado da pesquisa

- Conhecidos: arquitetura local, ferramentas declaradas, fronteiras herdadas, divergência de integração e risco concreto da trigger.
- Pendentes: G1 é integração verificável; G2 exige autoridade científica/dados; G3 exige decisão de produto/dados. Não foram resolvidos por pesquisa ou promovidos a decisões confirmadas.
- A skill solicitou pesquisa por agente. Um agente realizou inspeção parcial e apontou o risco da imutabilidade, mas foi interrompido por limite de uso; a conferência e a consolidação foram concluídas pelo agente principal nas fontes locais.
