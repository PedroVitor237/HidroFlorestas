# Evidências de integração e gate da IMP-004

## Estado desta comprovação

- Data da comprovação: 2026-09-16.
- Escopo: integração da IMP-003 aprovada em `development`, reconciliação dos contratos herdados e comprovação de T005.
- `EVIDENCIA_IMPLEMENTACAO`: a branch `004-environmental-collection-registration` recebeu `origin/development` por merge commit, sem conflitos e sem rebase ou squash.
- `DECISAO_DA_EQUIPE_PARA_ESTA_EXECUCAO`: não iniciar `$speckit-implement`, não acessar Neon e não repetir migration ou E2E remoto.

## Baselines e integração

| Item | Evidência observada |
|---|---|
| IMP-004 antes da integração | `a44ac7ab3d4ead5adae977e53fd9cb9dfe05368e`, sincronizada `0/0` com `origin/004-environmental-collection-registration` e árvore limpa |
| `origin/development` | `190e9afd06222b5155fcdee79741771edb592706`, merge do PR #23 |
| HEAD final da IMP-003 | `106e25f984df56384896729bf786e44104166570` |
| Merge na IMP-004 | `653a923a2e8d40804f9cbf75798e07098b83c65d`, mensagem `merge: integrate IMP-003 into IMP-004` |
| Conflitos | nenhum; merge automático pelo método `ort` |
| Ancestralidade | `190e9afd...` e `106e25f9...` são ancestrais do merge da IMP-004 |
| Artefatos da IMP-004 | os oito artefatos anteriores ao merge permaneceram presentes |

O [PR #23](https://github.com/PedroVitor237/HidroFlorestas/pull/23) foi consultado em modo somente leitura e está `MERGED` em `development`, com `headRefOid` `106e25f9...` e merge commit `190e9afd...`. O status Vercel e o deployment associado constam como aprovados/`SUCCESS` e `Ready`. Nenhum deploy foi disparado nesta execução.

## Matriz de T005

| Requisito do gate | Resultado | Evidência e mapeamento técnico |
|---|---|---|
| `area.id` público, estável e opaco | PASS | `CollectionArea.id` é `@id @default(uuid())`; os DTOs e o OpenAPI expõem somente o UUID, sem semântica autorizativa. |
| Associação obrigatória área–laboratório | PASS | `CollectionArea.laboratoryRoomId` é obrigatório e possui relação obrigatória com `LaboratoryRoom`; criação deriva o valor do contexto autorizado. |
| Rotas contextuais por `laboratoryId` | PASS | `/api/laboratories/{laboratoryId}/areas` e `/api/laboratories/{laboratoryId}/areas/{areaId}` estão implementadas. |
| Recurso subordinado consultado por laboratório e ID | PASS | o detalhe usa `where: { id: areaId, laboratoryRoomId: laboratoryId }`; a IMP-004 mantém a mesma composição para área e futura coleta. |
| DTO mínimo da área | PASS | resumo: `id`, `name`, coordenadas, município e estado; detalhe acrescenta somente tipo, descrição, criação, laboratório público e `readOnly`. |
| Ausência de autoria/campos privilegiados | PASS | serializers não retornam `userId`, autor, e-mail, código de acesso, CEP, imagem, `isActive` legado ou identificador de coordenada. |
| Guard contextual reutilizável | PASS | `authorizeLaboratoryAccess` está centralizado em `src/app/api/server/areas/area.authorization.ts` e é reutilizado pelos serviços de área e vínculos. |
| Sequência de autorização | PASS | o guard valida principal/conta `ACTIVE`, consulta laboratório pelo vínculo atual, avalia papel/estado e permissão; o serviço consulta depois a área por `{ id, laboratoryId }`. A futura coleta permanece subordinada depois da área, no serviço da IMP-004. |
| Papéis contextuais | PASS | `LaboratoryMembershipRole` contém `OWNER`, `ADMIN` e `MEMBER`; migration, schema, serviços e testes usam os três valores. |
| Separação de `LaboratoryMembershipRole` e `UserRole` | PASS | enums distintos no schema; o guard obtém o papel exclusivamente de `ResearchersLinked.role`. |
| `UserRole.ADMIN` sem concessão contextual automática | PASS | o guard recebe apenas `principal.id` e decide pelo vínculo atual; `User.role` e `User.isAdmin` não participam da decisão contextual. |
| Autoria derivada do principal | PASS | criação de área recebe apenas o ID de `requireAuth()` e grava `userId` no servidor; body com identidade/contexto forjados é rejeitado. |
| Laboratório ativo para mutações | PASS | o guard lança `READ_ONLY` antes da matriz de papel quando chamado com `mutate=true` e o laboratório está inativo. |
| Laboratório inativo permite leitura | PASS | `READ_AREAS` retorna contexto com `status: INACTIVE` e `readOnly: true`; listagem e detalhe não filtram o laboratório inativo. |
| Modo somente leitura | PASS | contexto público contém `readOnly`; mutações contextuais retornam `409 READ_ONLY`. |
| Vínculo revogado sem acesso posterior | PASS | vínculo é reconsultado a cada operação; ausência/revogação converge em `404 NOT_FOUND`. |
| Isolamento entre laboratórios | PASS | vínculo e recursos são consultados dentro do `laboratoryId`; IDs cruzados não são consultados isoladamente. |
| `CREATE_COLLECTION` presente | PASS | o literal integra o tipo fechado `AreaPermission` do guard. |
| `CREATE_COLLECTION` para os três papéis | PASS | no guard integrado, as únicas restrições de papel são `MANAGE_ROLES → OWNER` e `CREATE_AREA → OWNER/ADMIN`; portanto `CREATE_COLLECTION` aceita `OWNER`, `ADMIN` e `MEMBER`. O mapeamento é fechado pelos tipos contextuais e não depende de `UserRole`. |
| Inatividade aplicada a `CREATE_COLLECTION` | PASS, com mapeamento técnico | a implementação separa permissão e natureza mutável. A IMP-004 deve chamar `authorizeLaboratoryAccess(principal, laboratoryId, "CREATE_COLLECTION", tx, true)`; o quinto argumento produz `409 READ_ONLY`. |
| Ausência de guard duplicado na IMP-004 | PASS | a assinatura integrada já suporta principal, laboratório, permissão, transação e mutabilidade; a área e a coleta subordinadas permanecem consultas do serviço após o guard. |

## Divergências

### Divergência técnica reconciliada

O planejamento descrevia o estado ativo como parte implícita da permissão mutável. A implementação real usa a permissão literal `CREATE_COLLECTION` e o argumento separado `mutate=true`. Os artefatos técnicos e a tarefa consumidora da IMP-004 foram atualizados para registrar a chamada exata. A intenção, a matriz dos três papéis, o comportamento `READ_ONLY` e o contrato externo não mudaram.

O guard não busca diretamente a área nem a futura coleta. Ele encerra a decisão contextual até a permissão; o serviço consumidor deve então consultar a área pelo par `{ id, laboratoryId }` e a coleta por `{ collectionId, areaId, laboratoryId }`. Isso corresponde à sequência funcional planejada sem criar autorização paralela.

### Divergências funcionais

Nenhuma divergência funcional foi encontrada em intenção do usuário, permissão, comportamento externo, requisito, critério de sucesso ou escopo.

## Evidências reaproveitadas da IMP-003

As validações abaixo não foram executadas nesta sessão. Elas foram reaproveitadas do corpo do PR #23 e do ledger da IMP-003; pertencem ao commit pai `7d95079d6ff794f63aabc5fb6b717cc7da8eb66d`, salvo os gates finais locais associados ao HEAD `106e25f9...`:

| Evidência reaproveitada | Resultado registrado |
|---|---|
| Tarefas IMP-003 | 112/112 encerradas; T111 marcado e fronteira da IMP-004 registrada |
| OpenAPI | 1/1 aprovado; cinco operações, referências locais e DTOs fechados |
| Unitários | 59/59 |
| Integração local/injetada | 30/30 |
| Migration Neon isolada | 5/5 |
| E2E Neon | 12/12, um worker, zero retries |
| Teardown | `users=0`, `laboratories=0`, `memberships=0`, `areas=0` |
| Integridade | zero áreas/vínculos órfãos; tabela legada `Coordinates` ausente |
| Regressões IMP-001/002 | aprovadas, incluindo DTO de autenticação, papéis globais e exclusão administrativa |
| Build | aprovado; Prisma Client gerado e 22 rotas/páginas compiladas |
| Deploy Vercel do PR #23 | aprovado; checks Vercel em sucesso e deployment `Ready` |

SC-009 e SC-010 da IMP-003 permanecem `NAO_VERIFICADO`, pois dependem de participantes representativos. Esse estado foi previsto e não foi convertido em aprovação por automação.

## Validações desta sessão

Foram limitadas a inspeção estática, histórico/ancestralidade Git, consulta somente leitura do PR #23, referências locais, contratos, schemas, numeração de tarefas, OpenAPI da IMP-004 e `git diff --check`.

- Numeração: IMP-003 contém T001–T112 contínuas e 112/112 marcadas; IMP-004 contém T001–T110 contínuas e somente T005 marcada nesta execução.
- OpenAPI IMP-004: versão 3.1.0, duas operações com `operationId` únicos, 44 referências locais resolvidas e nenhum schema de objeto aberto.
- Mapeamento focal do guard: PASS para `CREATE_COLLECTION` com `OWNER`, `ADMIN` e `MEMBER` em laboratório ativo; os três retornam `READ_ONLY` em laboratório inativo quando `mutate=true`.
- `git diff --check`: PASS.

Não houve acesso a Neon, migration, E2E remoto, instalação, atualização de dependências ou `npm audit fix`.

## Decisão do gate

T005 está comprovada: a IMP-003 está contida na branch, T111 possui implementação e evidência reais, os contratos necessários estão disponíveis, a divergência técnica foi reconciliada e não existe divergência funcional ou dependência crítica ausente para iniciar a implementação planejada.

`T005_COMPROVADO_IMP_004_LIBERADA_PARA_IMPLEMENTACAO`
