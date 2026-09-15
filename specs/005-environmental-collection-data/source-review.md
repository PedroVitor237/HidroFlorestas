# Fontes consultadas e limites — IMP-005

**Date**: 2026-09-15

## Preparação Git

- Estado inicial observado: `003-area-registration-and-viewing`, árvore sem alterações rastreadas/não ignoradas.
- `git fetch origin --prune` concluído; a referência-base existe com nome exato `origin/development`.
- Base de criação: `f440282a9aefbbb85b5199d0610fdb9ecab3dc87`.
- Branch criada diretamente dessa referência: `005-environmental-collection-data`.
- IMP-004 consultada em `a44ac7ab3d4ead5adae977e53fd9cb9dfe05368e`, igual ao SHA observado na solicitação. Nenhum merge, rebase ou cherry-pick.
- `test-results/imp003-desktop.png` e `test-results/.last-run.json` preexistiam como ignorados na branch anterior. A regra `/test-results/` não existe no `.gitignore` desta base: arquivos preservados e excluídos dos commits.

## Fontes no commit remoto da IMP-004

Consultadas somente por `git show`/`git ls-tree`, com foco nos contratos herdados, ciência, rastreabilidade e gates. Links abaixo fixam o commit e não dependem da existência local da pasta IMP-004. Os identificadores de blob permitem conferir integridade; não representam aprovação.

| Documento | Blob Git |
|---|---|
| [.specify/memory/constitution.md](https://github.com/PedroVitor237/HidroFlorestas/blob/a44ac7ab3d4ead5adae977e53fd9cb9dfe05368e/.specify/memory/constitution.md) | `1340110c28c54c669e35355ab037812f051c20fb` |
| [AGENTS.md](https://github.com/PedroVitor237/HidroFlorestas/blob/a44ac7ab3d4ead5adae977e53fd9cb9dfe05368e/AGENTS.md) | `ee3b4e34af7fb407cf361079fb0b13a7e70ca59d` |
| [docs/governance/SOURCE_AUTHORITY.md](https://github.com/PedroVitor237/HidroFlorestas/blob/a44ac7ab3d4ead5adae977e53fd9cb9dfe05368e/docs/governance/SOURCE_AUTHORITY.md) | `1ac0ff37890bb0c29ba7b7582821ff68340d0221` |
| [docs/governance/PENDING_DECISIONS.md](https://github.com/PedroVitor237/HidroFlorestas/blob/a44ac7ab3d4ead5adae977e53fd9cb9dfe05368e/docs/governance/PENDING_DECISIONS.md) | `e521e473b3207f6527e7cf8c11fe6ede9dba59c3` |
| [docs/governance/DOCUMENT_REGISTER.md](https://github.com/PedroVitor237/HidroFlorestas/blob/a44ac7ab3d4ead5adae977e53fd9cb9dfe05368e/docs/governance/DOCUMENT_REGISTER.md) | `7a06fa9059446f40db0ea69404afb17f16b7b33d` |
| [docs/governance/TRACEABILITY_MATRIX.md](https://github.com/PedroVitor237/HidroFlorestas/blob/a44ac7ab3d4ead5adae977e53fd9cb9dfe05368e/docs/governance/TRACEABILITY_MATRIX.md) | `ae99ea7fdb2f85a2e90b0600416c9b3ba62683a9` |
| [docs/code-first-prd/implementation/backlog.md](https://github.com/PedroVitor237/HidroFlorestas/blob/a44ac7ab3d4ead5adae977e53fd9cb9dfe05368e/docs/code-first-prd/implementation/backlog.md) | `8a5b4146bf1f70f9481c73866a8b48ef5fcdd92d` |
| [docs/code-first-prd/specifications/requirements.md](https://github.com/PedroVitor237/HidroFlorestas/blob/a44ac7ab3d4ead5adae977e53fd9cb9dfe05368e/docs/code-first-prd/specifications/requirements.md) | `8f7173b53e8202775bc2f1093961ff7c4ffaf499` |
| [docs/code-first-prd/specifications/use-cases.md](https://github.com/PedroVitor237/HidroFlorestas/blob/a44ac7ab3d4ead5adae977e53fd9cb9dfe05368e/docs/code-first-prd/specifications/use-cases.md) | `599333e411c677095c7eb83441283af9126d9631` |
| [docs/code-first-prd/specifications/product-flows.md](https://github.com/PedroVitor237/HidroFlorestas/blob/a44ac7ab3d4ead5adae977e53fd9cb9dfe05368e/docs/code-first-prd/specifications/product-flows.md) | `18d8f29f9ab077a706f8f230dbd1c540a51530e8` |
| [docs/code-first-prd/specifications/logical-data-model.md](https://github.com/PedroVitor237/HidroFlorestas/blob/a44ac7ab3d4ead5adae977e53fd9cb9dfe05368e/docs/code-first-prd/specifications/logical-data-model.md) | `134175f501cf1ac80a69f02ec65c4411e189653a` |
| [docs/code-first-prd/specifications/relational-data-model.md](https://github.com/PedroVitor237/HidroFlorestas/blob/a44ac7ab3d4ead5adae977e53fd9cb9dfe05368e/docs/code-first-prd/specifications/relational-data-model.md) | `4d3d6af6478252853db4aba47aab9a1f0f2bb71c` |
| [docs/code-first-prd/specifications/class-diagram.md](https://github.com/PedroVitor237/HidroFlorestas/blob/a44ac7ab3d4ead5adae977e53fd9cb9dfe05368e/docs/code-first-prd/specifications/class-diagram.md) | `c5e285f8d0d5025c578b0d3761af8c6139018d54` |
| [specs/004-environmental-collection-registration/checklists/requirements.md](https://github.com/PedroVitor237/HidroFlorestas/blob/a44ac7ab3d4ead5adae977e53fd9cb9dfe05368e/specs/004-environmental-collection-registration/checklists/requirements.md) | `5b2bc9c073beb49edbeff360ff897ae5b7f9dc1c` |
| [specs/004-environmental-collection-registration/contracts/collection-registration-api.openapi.yaml](https://github.com/PedroVitor237/HidroFlorestas/blob/a44ac7ab3d4ead5adae977e53fd9cb9dfe05368e/specs/004-environmental-collection-registration/contracts/collection-registration-api.openapi.yaml) | `c06026c04f410a16b734899592134a543063a3cd` |
| [specs/004-environmental-collection-registration/data-model.md](https://github.com/PedroVitor237/HidroFlorestas/blob/a44ac7ab3d4ead5adae977e53fd9cb9dfe05368e/specs/004-environmental-collection-registration/data-model.md) | `ab6b68b10e2c449809e72516f606845253669287` |
| [specs/004-environmental-collection-registration/plan.md](https://github.com/PedroVitor237/HidroFlorestas/blob/a44ac7ab3d4ead5adae977e53fd9cb9dfe05368e/specs/004-environmental-collection-registration/plan.md) | `2a84eef9ec1ae8297b545f8aa7833873cdcb6c92` |
| [specs/004-environmental-collection-registration/quickstart.md](https://github.com/PedroVitor237/HidroFlorestas/blob/a44ac7ab3d4ead5adae977e53fd9cb9dfe05368e/specs/004-environmental-collection-registration/quickstart.md) | `e99089a6bc7088f324957d0e273e52340c7b155d` |
| [specs/004-environmental-collection-registration/research.md](https://github.com/PedroVitor237/HidroFlorestas/blob/a44ac7ab3d4ead5adae977e53fd9cb9dfe05368e/specs/004-environmental-collection-registration/research.md) | `bd868f1513d1e0c4b0f827b5939e73eedf5a9789` |
| [specs/004-environmental-collection-registration/spec.md](https://github.com/PedroVitor237/HidroFlorestas/blob/a44ac7ab3d4ead5adae977e53fd9cb9dfe05368e/specs/004-environmental-collection-registration/spec.md) | `2da0e35c0b69b83db1dce4d0fa9b6eb8f9b07b56` |
| [specs/004-environmental-collection-registration/tasks.md](https://github.com/PedroVitor237/HidroFlorestas/blob/a44ac7ab3d4ead5adae977e53fd9cb9dfe05368e/specs/004-environmental-collection-registration/tasks.md) | `cea413fdc56d564556bfbef2e9fbbea733e44fb2` |
| [docs/code-first-prd/analysis/gaps-and-open-questions.md](https://github.com/PedroVitor237/HidroFlorestas/blob/a44ac7ab3d4ead5adae977e53fd9cb9dfe05368e/docs/code-first-prd/analysis/gaps-and-open-questions.md) | `33dbef76c77fad015f4a2cf97d5e89c819f08bd0` |
| [docs/code-first-prd/reviews/product-hypotheses-human-review.md](https://github.com/PedroVitor237/HidroFlorestas/blob/a44ac7ab3d4ead5adae977e53fd9cb9dfe05368e/docs/code-first-prd/reviews/product-hypotheses-human-review.md) | `4ffcf187517b0fe69e25ef33ad8caa9642e57ad0` |
| [docs/raw/matriz-de-variaveis-do-ihfr.md](https://github.com/PedroVitor237/HidroFlorestas/blob/a44ac7ab3d4ead5adae977e53fd9cb9dfe05368e/docs/raw/matriz-de-variaveis-do-ihfr.md) | `55b8489a1c4e3535e154984db48eacf861c3fc7c` |
| [docs/raw/protocolo-de-campo-do-ihfr.md](https://github.com/PedroVitor237/HidroFlorestas/blob/a44ac7ab3d4ead5adae977e53fd9cb9dfe05368e/docs/raw/protocolo-de-campo-do-ihfr.md) | `c457ebbda28ef449c5f927a3285202159d662232` |

## Conclusões por autoridade

- `DECISAO_CONFIRMADA`: a solicitação atual autoriza apenas especificar/planejar a IMP-005 e publicar seus documentos, com o nome exato de branch e gates científicos preservados.
- `FATO_DOCUMENTADO`: IMP-004 spec define coleta geral imutável e leitura contextual; plan/model/API descrevem como pretendem implementá-la. Tasks/checklist registram implementação ainda bloqueada pela IMP-003. Não interpretar checklists documentais como testes de execução.
- `FATO_DOCUMENTADO`: backlog IMP-005, FR-007, UC-011, PFLOW-005 e H08 mantêm a ciência aberta. FR-014 é usado somente para associação territorial herdada. O macrofluxo candidato não supera a solicitação atual de usar coleta já existente.
- `PENDENCIA_DE_DECISAO`: PD-002/004, CF-PD-005/CF-Q-011 e os limites de ciclo/permissões exigem G2/G3. Autoridades nominais e prazos não especificados.
- `FATO_DOCUMENTADO`: DOCUMENT_REGISTER/TRACEABILITY_MATRIX classificam DOC-RAW-007 e DOC-RAW-011 como evidências históricas sem validação. Esses foram os únicos arquivos raw lidos, por pertinência direta às entradas/procedimentos e à divergência científica; nenhum raw foi alterado. Fórmulas históricas não foram incorporadas ao recorte.

## Baseline técnico inspecionado em development

`EVIDENCIA_IMPLEMENTACAO`, limitada à inspeção estática em `f440282a9aefbbb85b5199d0610fdb9ecab3dc87`:

- `package.json`: stack e comandos disponíveis; não comprova versões executadas.
- `prisma/schema.prisma`: CollectionData legado; quatro filhos com FK única; ausência de versão de contrato e de campos planejados IMP-004.
- `src/app/api/server/auth/auth.core.ts` e `src/app/api/server/middlewares/auth.middleware.ts`: fronteira de autenticação e conta elegível.
- `src/app/api/laboratories/route.ts`: handlers com injeção, no-store, parsing e envelope atual.
- `src/app/api/server/laboratories/laboratory.contracts.ts`: allowlist e serialização pública.
- `src/app/api/server/services/laboratories.service.ts`: consulta por vínculo, transação, retries e restrição de exclusão.
- `src/app/api/server/lib/prisma.ts`: adapter conectado; banco não acessado.
- `tests/fixtures/laboratories.ts`: composição de guard e limpeza por allowlist; não executado.
- Comparação `git diff f440282 a44ac7ab -- src prisma package.json`: sem diferenças nesses caminhos; fonte documental não fornece integração IMP-004.

AGENTS.md, constituição e SOURCE_AUTHORITY do HEAD IMP-004 foram comparados com os arquivos lidos da base, sem diferenças. PROJECT_CONTEXT.md e TECH_DECISIONS.md foram consultados como contexto e estados de decisões, sem promover propostas cartográficas/científicas.

## Execução e validação

Skills aplicadas: somente `speckit-specify` e `speckit-plan`. Templates resolvidos pelos scripts locais; `setup-plan.sh --json` executado. Não existem hooks em `.specify/extensions.yml`. O seletor local `.specify/feature.json` foi atualizado e permanece ignorado, sem inclusão forçada.

A verificação documental cobre presença dos oito artefatos, links, ausência de placeholders, revisão do diff, escopo e conteúdo sensível. Código, schema, migrations, tasks IMP-005, análise Spec Kit, coverage, implementação e PR estão fora da execução. Testes funcionais, Prisma, banco, build e navegador não foram executados; critérios funcionais não estão comprovados.

Após G2/G3, o registro de resolução poderá exigir atualização de PENDING_DECISIONS, DOCUMENT_REGISTER ou TECH_DECISIONS, conforme assunto. Esses caminhos não foram alterados porque a autorização atual limita a entrega aos documentos da feature e auxiliares das skills. Não há decisão científica nova a promover aos registros globais.
