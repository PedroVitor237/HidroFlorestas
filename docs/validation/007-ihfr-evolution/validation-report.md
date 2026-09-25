# Relatório de validação da `007-ihfr-evolution`

## 1. Baseline e método

O HEAD observado em 2026-09-25 foi
`3e6a97bdcaa8b598ee94b3e74c728b9cc104a41a`, igual ao baseline do relatório
anterior. O worktree estava limpo antes das verificações. Nenhuma alteração
preexistente precisou ser preservada.

A análise cruzou o código com FR-001–FR-020, SC-001–SC-008, ADR-0001, TD-015,
TD-016, PD-002 e o pacote Spec Kit em
[`specs/006-ihfr-diagnosis`](../../../specs/006-ihfr-diagnosis/). As 134 tarefas
possuem cobertura nominal no documento de tarefas, mas essa marcação é evidência
histórica e não substitui execução no HEAD.

Classificações usadas:

- `EVIDENCIA_IMPLEMENTACAO`: diretamente observada em código/configuração ou
  reproduzida por comando desta rodada;
- `INFERENCIA`: conclusão derivada de evidências identificadas;
- `RECOMENDACAO`: próximo passo proposto, sem equivaler a decisão da equipe;
- `PENDENCIA_DE_DECISAO`: depende de autoridade ou evidência externa.

## 2. Fluxo completo observado na interface

Os estados abaixo significam implementação por inspeção, não funcionamento
integrado comprovado.

| Etapa | Navegação e componente | Entrada, validação e permissão | API, serviço e persistência | Conclusão e estado |
|---|---|---|---|---|
| Login | `/login`; [`src/app/login/page.tsx`](../../../src/app/login/page.tsx) | E-mail e senha não vazios; credencial válida e usuário `ACTIVE` | `POST /api/auth/sign-in` → `AuthService` → leitura de `User`; cookie de sessão HTTP | Redirecionamento para `/workspace`. **Implementado por inspeção; runtime pendente.** |
| Criar laboratório | `/workspace`; [`LaboratoryWorkspace`](../../../src/components/workspace/laboratory-workspace.tsx) | Nome de 1–100 caracteres; principal autenticado; máximo de cinco vínculos | `POST /api/laboratories` → `LaboratoriesService.create` → transação em `LaboratoryRoom` e `ResearchersLinked`, com papel `OWNER` | Card do laboratório aparece após recarga da lista. **Implementado por inspeção; runtime pendente.** |
| Acessar laboratório | Botão “ACESSAR LABORATÓRIO” → `/dashboard/laboratories/{laboratoryId}` | Vínculo atual; laboratório novo nasce ativo | Layout contextual usa `getLaboratoryContext`; resumo e histórico consultam serviços contextuais | Cabeçalho mostra laboratório, papel e estado. **Implementado por inspeção; runtime pendente.** |
| Cadastrar/selecionar área | Navegação “Áreas” → `/areas`; “Nova área” → `/areas/new`; [`AreaForm`](../../../src/components/areas/area-form.tsx) | OWNER/ADMIN em laboratório ativo; nome, latitude `[-90,90]` e longitude `[-180,180]` obrigatórios; município, UF, tipo de terreno e descrição opcionais | `POST /api/laboratories/{lab}/areas` → `AreasService.create` → `CollectionArea` | Redirecionamento ao detalhe da área. Seleção posterior pela lista de áreas. **Implementado por inspeção; runtime pendente.** |
| Registrar coleta | Detalhe da área → “Registrar coleta” → `/areas/{areaId}/collections/new`; [`CollectionForm`](../../../src/components/collections/collection-form.tsx) | Laboratório ativo; data/hora RFC 3339, fuso explícito e instante não futuro; chave UUID gerada no cliente | `POST /api/laboratories/{lab}/areas/{area}/collections` → `CollectionsService` → `CollectionData` | Resposta 201, `Location` coerente e redirecionamento ao detalhe da coleta. **Implementado por inspeção; runtime pendente.** |
| Informar dados ambientais | Detalhe da coleta → “Ver dados ambientais” → estado vazio → “Registrar dados ambientais” → `/environmental-data/new`; [`EnvironmentalForm`](../../../src/components/environmental-data/environmental-data-form.tsx) | Quatro grupos e 17 campos. Dez obrigatórios; sete opcionais. Conjunto único, imutável e vinculado à coleta. Laboratório deve aceitar escrita | `POST .../environmental-data` → `EnvironmentalDataService.create` → `EnvironmentalMeasurementSet` | Confirmação redireciona ao detalhe e apresenta o conjunto persistido. **Implementado por inspeção; runtime pendente.** |
| Solicitar IHFR | Link “Voltar à coleta”; [`IHFRDiagnosisManagement`](../../../src/components/ihfr-diagnosis/ihfr-diagnosis-management.tsx) no detalhe da coleta | Somente OWNER/ADMIN em laboratório ativo. Usuário escolhe `landUseType`, origem e data da observação; versões/hash são enviados pelo cliente. `slopePercent` e `landUseType` são necessários para elegibilidade | `GET .../eligibility` e `POST .../ihfr-diagnosis/diagnoses` → `IHFRDiagnosisService` → suplemento, diagnóstico, operação, ponteiro corrente e eventos | `SUCCEEDED` cria diagnóstico `CURRENT`; insuficiência não cria diagnóstico. **Implementado por inspeção; runtime pendente.** |
| Consultar e reabrir | O detalhe da coleta lê o diagnóstico no servidor; após escrita a UI consulta `/current`. A atividade “Coleta confirmada” no histórico do laboratório aponta novamente ao detalhe da coleta | OWNER/ADMIN veem gestão; MEMBER vinculado vê somente leitura; laboratório inativo permite leitura | `GET .../current`/`GET .../diagnoses/{id}` → `IHFRDiagnosisService.readCurrent/readDetail` → projeção dos registros persistidos | Score e parte do contrato aparecem após criação/reload. **Parcial:** FR-005/SC-001 não são integralmente renderizados. |

### 2.1 Dados ambientais e suplemento

`EVIDENCIA_IMPLEMENTACAO`: o formulário ambiental não é mock. Ele cobre:

- Água: fonte, nascente, profundidade do poço, disponibilidade e salinidade.
- Solo: textura, infiltração, compactação, erosão e solo exposto.
- Vegetação: cobertura, fragmentação, APP ripária e degradação.
- Terreno: densidade de drenagem, elevação e declividade.

As regras estão em
[`environmental-data.validation.ts`](../../../src/types/environmental-data.validation.ts).
O parser rejeita grupos/campos desconhecidos e ausência dos campos ambientais
obrigatórios. Campos opcionais ausentes são normalizados para `null`.

`slopePercent` é opcional no contrato de captura ambiental, mas obrigatório para
um diagnóstico IHFR suficiente. A interface permite salvá-lo como `null`; a
elegibilidade deve então responder `MISSING_SLOPE_PERCENT`.

O `landUseType` não vem de `CollectionArea.landType` e não integra o conjunto
ambiental. Ele é um suplemento próprio, informado na gestão do diagnóstico junto
com `provenance.kind` e `observedAt`. O serviço consome o payload de
`EnvironmentalMeasurementSet` e esse suplemento no mesmo cálculo.

## 3. Verificações executadas sem banco

Nenhuma das execuções abaixo recebeu variáveis PostgreSQL. Os testes unitários
foram iniciados com `DATABASE_URL`, `TEST_DATABASE_URL`, confirmação e variáveis
`IMP006_*` removidas.

| Verificação | Resultado | Observação |
|---|---|---|
| `git diff --check` | **PASS** | Nenhum erro de whitespace no estado inicial. |
| `npm run typecheck` | **FAIL** | 11 erros relacionados à administração de usuários e Prisma Client: `revision` e `administrativeAuditEvent` existem no schema/serviço, mas não no client gerado presente no checkout. Não é um erro IHFR, mas bloqueia o gate global. |
| `npm run lint` | **PASS com avisos** | 0 erros e 4 avisos preexistentes de variáveis não usadas. |
| Oito testes unitários IHFR focais | **PASS** | 8 arquivos, 8 processos/subtests, 0 falhas. O teste de política de entrada passa com uma expectativa contrária a FR-012; o verde não aprova essa regra. |
| Vinte testes unitários do fluxo anterior ao IHFR | **PASS** | Autenticação, laboratório, área, coleta, histórico, dados ambientais e UUID; 20 arquivos/subtests, 0 falhas. Dependências persistentes foram simuladas. |
| Probe do avaliador | **REPRODUZIDO** | Entrada completa e ausência opcional: `SUFFICIENT`; ausência de `soil.infiltrationRateMmPerHour`: parser produtor rejeita, mas avaliador isolado retorna `SUFFICIENT`. |
| Renderização estática da consulta | **REPRODUZIDO** | Score, classe, matemática, algoritmo e hash presentes; origem, versões de medição/suplemento, ciclo e datas ausentes. |

Uma tentativa inicial dos dois probes com `tsx --eval` falhou antes da carga da
aplicação porque o CLI tentou abrir um socket IPC bloqueado pelo sandbox
(`EPERM`). Ambos foram repetidos com sucesso por `node --import=tsx`.

### Comandos deliberadamente não executados

- `npm run test:contract`: um teste chama
  `withImp006PostgresqlSchema`, aplica migrations e cria fixtures. O nome do
  script não representa uma suíte sem banco.
- `npm test` e `npm run test:integration`: incluem integração PostgreSQL.
- `npm run test:migration`: cria e remove schemas.
- `npm run test:e2e`, `npm run test:e2e:ihfr` e
  `npm run test:e2e:https`: iniciam aplicação e/ou escrevem fixtures.
- `npm run build`: começa por `prisma generate`, altera artefatos gerados e pode
  avaliar módulos server-side; não foi necessário para esta etapa segura.

## 4. Reprodução do avaliador

Foi usado um payload válido completo com `landUseType = FOREST`.

| Caso | Resultado normativo esperado | Parser ambiental | Avaliador observado |
|---|---|---|---|
| Completo | `SUFFICIENT` | Aceito | `SUFFICIENT`, raw `0.2627777777777777`, display `0.26`, `MODERATE` |
| Sem `soil.infiltrationRateMmPerHour` | `INSUFFICIENT_DATA` por FR-012 | Rejeitado como campo obrigatório | `SUFFICIENT`, raw `0.25027777777777777`, display `0.25`, `MODERATE` |
| Sem `water.salinityIndicator` opcional | `SUFFICIENT`, com exclusão da média | Aceito e normalizado para `null` | `SUFFICIENT`, raw `0.27152777777777776`, display `0.27`, `MODERATE` |

`EVIDENCIA_IMPLEMENTACAO`: o defeito interno do avaliador está reproduzido.
Também está demonstrado que o fluxo normal de criação ambiental rejeita a
ausência obrigatória antes da persistência. Portanto, o impacto no happy path da
interface não foi reproduzido; ele depende de payload armazenado fora desse
produtor validado, corrupção, legado incompatível ou outro escritor.

## 5. Configuração e possível liberação de banco

Foi feita leitura local sanitizada de nomes/presença em `.env.e2e.local`, sem
exportar ou imprimir valores:

- `DATABASE_URL`, `TEST_DATABASE_URL`, confirmação, `JWT_SECRET` e senha E2E:
  presentes;
- confirmação: igual ao literal exigido;
- ambos os URLs: PostgreSQL e Neon;
- identidades normalizadas de host/porta/database: distintas;
- `PLAYWRIGHT_BASE_URL`, `IMP006_DATABASE_VARIABLE`, `IMP006_TEST_SCHEMA`, flags
  locais e `NODE_ENV`: ausentes.

Isso demonstra coerência estrutural, não identidade de branch Neon.

### Cadeia do runner IHFR quando controlada

Com processo limpo e `IMP006_DATABASE_VARIABLE=TEST_DATABASE_URL` forçado:

1. o lifecycle escolhe `TEST_DATABASE_URL` e cria schema aleatório
   `imp006_test_<uuid>`;
2. baseline, migrations e fixtures usam a mesma conexão e schema;
3. o runner cria e possui um servidor Next.js em loopback, substitui
   `DATABASE_URL` por `TEST_DATABASE_URL` e transmite o schema;
4. o Prisma seleciona `TEST_DATABASE_URL` pelo mesmo seletor e exige o schema
   allowlisted;
5. Playwright recebe o `baseURL` criado pelo runner, sem servidor externo;
6. o probe E2E consulta `TEST_DATABASE_URL` e o mesmo schema;
7. o lifecycle verifica marcador de propriedade e remove apenas esse schema.

Assim, a inconsistência observada quando o seletor é `DATABASE_URL` pode ser
eliminada por ambiente controlado, sem alteração versionada. Porém, o runner faz
`CREATE SCHEMA` como primeira operação após conectar; ele não comprova antes da
escrita que o endpoint pertence à branch Neon de teste.

### Preflight obrigatório para a próxima rodada

`RECOMENDACAO`:

1. Em processo limpo, remover todas as variáveis de banco, autenticação,
   `PLAYWRIGHT_BASE_URL` e `IMP006_*` herdadas.
2. Carregar exclusivamente `.env.e2e.local` e forçar, fora do arquivo,
   `NODE_ENV=test` e `IMP006_DATABASE_VARIABLE=TEST_DATABASE_URL`.
3. Derivar de forma local o endpoint ID de cada hostname, sem imprimir URL ou
   credencial.
4. Consultar por operação GET a Neon Console/API e confirmar que o endpoint de
   teste está associado ao `branch_id` de teste esperado e que o endpoint de
   desenvolvimento possui outro `branch_id`. A Neon documenta que cada compute
   pertence a uma branch e que a listagem de endpoints fornece `host`, `id` e
   `branch_id`: [Manage computes](https://neon.com/docs/manage/endpoints/) e
   [List branch endpoints](https://api-docs.neon.tech/reference/listprojectbranchendpoints).
5. Fazer uma conexão SQL explicitamente read-only ao URL de teste para confirmar
   autenticação, database e schema inicial; registrar somente fingerprints e
   igualdades, nunca valores.
6. Comparar o fingerprint usado no preflight com o que será passado ao lifecycle,
   servidor, Prisma, probe e cleanup.
7. Somente depois liberar o runner, sem `--lan`, sem servidor externo e sem
   outra execução concorrente sobre o mesmo destino.

**Decisão desta rodada:** testes com banco ainda não estão liberados. Há um
caminho sem alteração versionada, mas falta a evidência externa endpoint →
`branch_id` e o preflight SQL read-only imediatamente anterior à escrita.

## 6. Estado de prontidão

- Fluxo completo: **implementado por inspeção, não executado em navegador**.
- Cobertura de validação: **parcial**, com 28 arquivos unitários executados.
- Gate estático global: **bloqueado pelo typecheck**.
- Banco/E2E: **não executado e ainda não liberado**.
- Prontidão da branch: **bloqueada** pelos defeitos `F-001` e `F-002`, sem
  afirmar que as demais etapas funcionam em runtime.
- Validação científica definitiva: **pendente**, fora do alcance destes testes
  técnicos.
