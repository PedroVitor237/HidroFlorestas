# Quickstart de validação — Dados ambientais da coleta

## Estado atual

Entrega documental: não há código, formulário, endpoint ou migration IMP-005. Os cenários funcionais abaixo são roteiro futuro, não testes executados. G1–G3 estão fechados para a captura v1; a branch ainda precisa ser reconciliada com `origin/development` antes da implementação.

## Validação documental reproduzível agora

Na raiz do repositório:

```bash
git branch --show-current
git merge-base HEAD origin/development
git diff --check origin/development...HEAD
git diff --name-only origin/development...HEAD
git status --short
```

Estado observado: branch `005-environmental-collection-data`; base original `f440282a9aefbbb85b5199d0610fdb9ecab3dc87`, enquanto `origin/development` avançou para `37fb3a4fbf7dda04b9bc3b9f2fc1c64ed3b14e13` com a IMP-004 integrada. `test-results/` e `coverage-review.md` são preexistentes e não devem ser incluídos sem autorização específica. `.specify/feature.json` é auxiliar local ignorado.

Conferir spec, checklist, plan, research, data-model, quickstart, source-review, três contratos e `tasks.md`. Conferir links locais, links de fontes em SHA fixo, ausência de placeholders e rastreabilidade das tarefas. A API foi documentada como fronteira em Markdown; não há YAML/OpenAPI IMP-005 nesta etapa.

## Pré-requisitos futuros

1. G1 — fechado: IMP-003/004 integradas em `origin/development`; migrations, guard/papéis, isolamento, leitura inativa, idempotência e trigger de imutabilidade possuem evidência registrada em `specs/004-environmental-collection-registration/implementation-evidence.md` no commit `7c97714`.
2. G2 — fechado para captura: `ihfr-measurement-v1` fixa os quatro grupos, tipos, unidades, nulabilidade e limites estruturais. Não equivale à validação científica do cálculo.
3. G3 — fechado: três papéis vinculados, conjunto único/integral/imutável, revisão, confirmação atômica e idempotência própria; sem complementação.
4. Reconciliar a branch com `origin/development`, executar análise de consistência e então implementar as tarefas na ordem indicada.

## Ambiente de teste futuro

Reutilizar o guard fail-closed e fixtures integrados: ambiente de teste explícito, URL de teste distinta da aplicação, recurso dedicado autorizado e confirmação exigida pelo harness. Nunca registrar valores de ambiente, cookies, tokens ou credenciais. Confirmar allowlist antes da conexão, executar cleanup antes do setup e teardown em `finally`/`afterAll`, na ordem das FKs, com contagem residual zero.

Não usar banco de desenvolvimento compartilhado ou produção. Não instalar dependências, subir servidor, gerar Prisma ou aplicar migration durante esta tarefa documental.

## Comandos existentes para a implementação futura

Somente depois da implementação e da preparação segura do ambiente:

```bash
npm run test:unit
npm run test:integration
npm run test:e2e -- --workers=1
npm run lint
npm run typecheck
npm run build
```

Esses scripts existem no baseline, mas atualmente não comprovam a IMP-005. `build` executa Prisma generate e, portanto, não foi executado agora. Testes de banco/migration específicos deverão ter comandos definidos após o desenho físico de G2/G3; a IMP-004 fornece harness e preflight reaproveitáveis depois da reconciliação da branch. Nenhum nome de teste futuro é apresentado como arquivo existente.

## Cenários independentes

### US1 — Registrar dados

Preparar uma coleta confirmada acessível, laboratório ativo e pessoa vinculada. Usar os casos do contrato `ihfr-measurement-v1`.

1. Abrir o registro pela coleta; conferir referências visíveis e campos/unidades correspondentes ao contrato.
2. Submeter exemplos inválidos, ausentes e nos limites aprovados; conferir mensagem por regra e ausência de resultado válido fabricado.
3. Submeter exemplo válido no ciclo aprovado; conferir persistência e igualdade dos valores conforme as conversões explicitamente permitidas.
4. Comparar antes/depois o pai: ID, ocorrência, offset, confirmação, autor, área, laboratório e metadados técnicos permanecem intactos.
5. Simular falha antes do commit, timeout depois do commit, reenvio e corrida; conferir unidade íntegra, replay idêntico e conflito divergente.
6. Mudar vínculo/papel/elegibilidade/inatividade antes da gravação; conferir revalidação e recusa sem escrita quando acesso se perdeu.

Resultado esperado: SC-001–SC-005, sem IHFR. Teste isolado pode inspecionar persistência autorizada sem depender da UI US2.

### US2 — Consultar

Preparar registros válidos diretamente por fixture aprovada; a preparação não depende da UI US1. Usar dois laboratórios, duas áreas e coletas de contextos diferentes.

1. Consultar como OWNER, ADMIN e MEMBER; comparar projeção com a fixture e contrato usado.
2. Inativar o laboratório mantendo vínculo de leitura: visualizar os mesmos dados autorizados, indicação de somente leitura e nenhuma escrita possível.
3. Revogar vínculo; cruzar IDs de laboratório, área e coleta; usar ID inexistente: comprovar respostas indistinguíveis e ausência de dados.
4. Consultar coleta sem registro: ver ausência, nunca zero/falso ou diagnóstico inventado.
5. Conferir ausência de campos internos e que o DTO original da IMP-004 não foi ampliado silenciosamente.
6. Verificar teclado, foco, labels, erro recuperável e layout móvel/amplo. Em avaliação humana, registrar se a pessoa identifica origem, ausência e somente leitura; não presumir aprovação SC-006 pela automação.

## Matriz de evidências futuras

| Camada | Prova esperada |
|---|---|
| Unidade científica | Casos aprovados, ausência/zero/falso, precisão, unidades e vigência conforme G2 |
| Autorização | Matriz G3, revogação, inativo, IDs cruzados e principal do servidor |
| Contrato | Payload fechado aprovado, projeção mínima, erros, no-store e sem extensão implícita de IMP-004 |
| PostgreSQL isolado | Preservação da trigger/pai, FKs, unidade transacional, concorrência, legado e recuperação |
| Navegador | US1/US2 completos, estados e acessibilidade |
| Regressão | IMP-001–004, lint, tipos e build, cada resultado registrado separadamente |
| Produto/pesquisa | SC-006 observado por cenário com participante representativo |

## Interpretação dos resultados

Falha de infraestrutura, banco ou browser não é sucesso funcional nem RED de TDD. Registrar cada bloqueio e não repetir indefinidamente. A documentação atual passa por verificação estática; métricas e resultados científicos/funcionais seguem **não verificados** até execução futura. Nenhum comando funcional desta seção foi executado nesta entrega.
