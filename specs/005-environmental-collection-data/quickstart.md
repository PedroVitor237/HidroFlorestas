# Quickstart de validação — Dados ambientais da coleta

## Estado atual

Entrega documental: não há código, formulário, endpoint ou migration IMP-005. Os cenários funcionais abaixo são roteiro futuro, não testes executados. G1–G3 de [spec.md](spec.md) devem estar resolvidos antes de implementar ou validar a jornada.

## Validação documental reproduzível agora

Na raiz do repositório:

```bash
git branch --show-current
git merge-base HEAD origin/development
git diff --check origin/development...HEAD
git diff --name-only origin/development...HEAD
git status --short
```

Após os commits, resultado esperado: branch `005-environmental-collection-data`; base `f440282a9aefbbb85b5199d0610fdb9ecab3dc87` enquanto a referência remota não avançar; alterações publicadas somente nos oito documentos desta feature. `test-results/` preexistente pode aparecer não rastreado após a troca de branch e não deve ser incluído. `.specify/feature.json` é auxiliar local ignorado.

Conferir oito arquivos: spec, checklist, plan, research, data-model, quickstart, source-review e contracts/environmental-data-boundary. Conferir links locais, links de fontes em SHA fixo, ausência de placeholders e de `tasks.md`. A API foi documentada como fronteira em Markdown; não há YAML/OpenAPI IMP-005 para validar.

## Pré-requisitos futuros

1. G1: comprovar código integrado de IMP-003/004, migrations reconciliadas, guard/papéis, isolamento, leitura de inativo e trigger de imutabilidade. Documentação isolada não satisfaz o gate.
2. G2: obter contrato científico aprovado, versão no nível autorizado, mapeamento do legado e casos válidos/inválidos assinados pela autoridade competente.
3. G3: obter matriz de permissões específica e ciclo de registro/recuperação/autoria aprovado. Definir se há complementação; não presumir que está permitida.
4. Revisar artefatos coordenadamente e só então produzir tarefas em execução futura autorizada. Este guia não dispara skill adicional.

## Ambiente de teste futuro

Reutilizar o guard fail-closed e fixtures integrados: ambiente de teste explícito, URL de teste distinta da aplicação, recurso dedicado autorizado e confirmação exigida pelo harness. Nunca registrar valores de ambiente, cookies, tokens ou credenciais. Confirmar allowlist antes da conexão, executar cleanup antes do setup e teardown em `finally`/`afterAll`, na ordem das FKs, com contagem residual zero.

Não usar banco de desenvolvimento compartilhado ou produção. Não instalar dependências, subir servidor, gerar Prisma ou aplicar migration durante esta tarefa documental.

## Comandos existentes para a implementação futura

Somente depois dos gates, da implementação e da preparação segura do ambiente:

```bash
npm run test:unit
npm run test:integration
npm run test:e2e -- --workers=1
npm run lint
npm run typecheck
npm run build
```

Esses scripts existem no baseline, mas atualmente não comprovam a IMP-005. `build` executa Prisma generate e, portanto, não foi executado agora. Testes de banco/migration específicos deverão ter comandos definidos após o desenho físico e a integração G1; não há script `test:migration` no package.json desta base. Nenhum nome de teste futuro é apresentado como arquivo existente.

## Cenários independentes

### US1 — Registrar dados

Preparar uma coleta confirmada acessível, laboratório ativo, pessoa com permissão específica e contrato aprovado. Usar exclusivamente exemplos científicos aprovados em G2.

1. Abrir o registro pela coleta; conferir referências visíveis e campos/unidades correspondentes ao contrato.
2. Submeter exemplos inválidos, ausentes e nos limites aprovados; conferir mensagem por regra e ausência de resultado válido fabricado.
3. Submeter exemplo válido no ciclo aprovado; conferir persistência e igualdade dos valores conforme as conversões explicitamente permitidas.
4. Comparar antes/depois o pai: ID, ocorrência, offset, confirmação, autor, área, laboratório e metadados técnicos permanecem intactos.
5. Simular falha antes do commit, timeout depois do commit, reenvio e corrida; conferir unidade íntegra e recuperação sem duplicação da mesma operação, conforme G3.
6. Mudar vínculo/papel/elegibilidade/inatividade antes da gravação; conferir revalidação e recusa sem escrita quando acesso se perdeu.

Resultado esperado: SC-001–SC-005, sem IHFR. Teste isolado pode inspecionar persistência autorizada sem depender da UI US2.

### US2 — Consultar

Preparar registros válidos diretamente por fixture aprovada; a preparação não depende da UI US1. Usar dois laboratórios, duas áreas e coletas de contextos diferentes.

1. Consultar com cada combinação de papel/condição definida em G3; comparar projeção com a fixture e contrato usado.
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
