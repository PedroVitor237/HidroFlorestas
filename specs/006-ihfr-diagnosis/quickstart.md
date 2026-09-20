# Quickstart: validação do diagnóstico IHFR experimental

**Purpose**: guia executável para provar a implementação futura da IMP-006 sem confundir conformidade técnica com validação científica.

## 1. Prerequisites

- branch `006-ihfr-diagnosis` reconciliada com a baseline registrada em [plan.md](plan.md);
- Node/dependências do projeto instalados;
- PostgreSQL isolado autorizado para testes de migration/concorrência;
- banco de teste sem dados reais, credenciais ou PII;
- manifesto e contratos presentes em [contracts/](contracts/).

Nunca executar migration/fixtures contra produção, banco comum reutilizado silenciosamente ou banco não confirmado como descartável e explicitamente autorizado para teste. Não registrar valores de ambiente nos relatórios.

### Ordem da execução de implementação

Executar nesta ordem: guards e caracterização → preflight de banco/legado → design Prisma → criar `prisma/migrations/20260920000100_ihfr_experimental_diagnosis/migration.sql` → `prisma format` → inspecionar → `prisma validate` → aplicar em schema PostgreSQL isolado → `prisma generate` → fixtures → shells compiláveis → testes comportamentais RED → implementação → unitários verdes → integração PostgreSQL verde → E2E → regressões → teardown → evidências e encerramento. Parar se o caminho de migration já existir ou se migration posterior tornar a ordem inválida.

## 2. Static contract checks

```bash
npm run typecheck
npm run lint
npm run build
```

Validar JSON e YAML com parsers locais e executar os testes de contrato OpenAPI. Resultado esperado:

- suplemento e DTOs recusam campos extras;
- todas as respostas, inclusive erros, declaram `Cache-Control: no-store`;
- nenhuma rota omite laboratório, área ou coleta;
- nenhum DTO público contém `userId`, ator, chave idempotente, request/payload hash, credencial ou payload ambiental completo;
- o schema do suplemento expõe somente sete `landUseType`.
- o OpenAPI expõe seis operações HTTP e sete comportamentos, com CREATE/REPLACE no mesmo POST;
- `mode=CREATE` aceita `expectedCurrentDiagnosisId` ausente ou `null`, enquanto `mode=REPLACE` exige UUID;
- elegibilidade malformada/categoria inválida declara `400 INVALID_REQUEST`, enquanto ausência válida/predominância indeterminável retorna outcome `INSUFFICIENT_DATA`;
- `PublicDiagnosis.areaId` é obrigatório, UUID e derivado no servidor.

## 3. Reproduce the normative manifest hash

Algoritmo de verificação:

1. ler `ihfr-math-experimental-v0.1.1.json` como UTF-8;
2. validar JSON;
3. remover somente a propriedade raiz `contractHash`;
4. ordenar lexicograficamente, de modo recursivo, as chaves de cada objeto;
5. preservar a ordem dos arrays;
6. serializar sem whitespace;
7. calcular SHA-256 e prefixar `sha256:`.

Resultado obrigatório:

```text
sha256:f8104143f1505aceaa68a7ffa06fac50f4906cdfc4119609875d99c9fecc6f89
```

Qualquer diferença deve falhar o teste e bloquear ativação. O teste não pode reescrever o manifesto ou “corrigir” seu hash.

Repetir a verificação histórica da v0.1.0 e obter `sha256:5285d52ec70e0b0f8a951d40dd54f052e02be1556dd310e3cef0b3b4f6bc684b`; provar que o arquivo não mudou e que não é ativado para novos diagnósticos.

## 4. Unit validation — supplement and evaluator

Executar:

```bash
npm run test:unit
```

### Supplement matrix

| Caso | Esperado |
|---|---|
| cada um dos sete valores | aceita e usa o score exato do manifesto |
| valor desconhecido, alias, `OTHER`/`OTHERS` ou case divergente | `INVALID_INPUT`, sem fallback |
| `landUseType` ausente ou null | `INSUFFICIENT_DATA`, nunca zero |
| uso misto com categoria predominante documentada | aceita somente a categoria predominante |
| uso misto sem predominância determinável | `INSUFFICIENT_DATA`; não calcula composição ou média |
| campo extra | `INVALID_INPUT` |
| `CollectionArea.landType` disponível | ignorado pelo avaliador |
| `soilTexture`, degradação, cobertura, drenagem, elevação, declividade ou tamanho disponíveis | não substituem `landUseType` |

### Evaluator matrix

- reproduzir scores de cada enum;
- testar profundidade/infiltração nos limites 0, 60 e acima de 60;
- testar declividade 0, 45 e acima de 45;
- confirmar que declividade acima de 45 mantém `raw`, usa `normalizedInput=45`, marca `clamped=true` e não altera a origem;
- testar cobertura/solo exposto em 0 e 100;
- preservar `false` e zero informados;
- excluir da média somente opcionais conhecidos ausentes, `null` permitido ou não aplicáveis, nunca convertê-los em zero;
- recusar campo/enum desconhecido, alias, caixa divergente e `OTHER(S)` como `INVALID_INPUT`, nunca ignorá-los;
- exigir pelo menos dois scores em cada dimensão e as quatro dimensões válidas;
- conferir qualidade abaixo de 0.5, em 0.5, abaixo de 0.8, em 0.8 e em 1;
- conferir classes imediatamente abaixo, exatamente e acima de 0.25/0.50/0.75;
- conferir tolerância `1e-12`, ausência de arredondamento intermediário e half-up somente no display;
- confirmar desempate de drivers W, S, V, T;
- recusar combinações de versões/hash não allowlisted.

Esses são vetores técnicos derivados. Devem ser nomeados `TECHNICAL_CONTRACT_VECTOR`, nunca vetor científico aprovado.

## 5. Migration validation

Executar no banco PostgreSQL isolado:

```bash
npm run test:migration
```

Provar:

1. migration aditiva em banco vazio;
2. migration em banco com registros `IHFRDiagnosis` e ambientais legados;
3. zero backfill ou alteração do legado;
4. FK e exclusões `RESTRICT`;
5. um único ponteiro vigente por coleta;
6. operação única por ator/chave;
7. triggers impedem update/delete de suplemento, snapshot e evento;
8. rollback não deixa objetos parciais.
9. `UNIQUE(collectionDataId,payloadHash)` deduplica suplemento, sem `UNIQUE(inputSupplementId)` no diagnóstico;
10. um suplemento pode ser referenciado por N diagnósticos compatíveis, nova observação cria outro e nova matemática compatível pode reutilizá-lo.

### Fixtures e lifecycle do banco

Cada execução cria schema PostgreSQL isolado e fixtures explícitas para OWNER/ADMIN/MEMBER, vínculo atual/revogado, laboratório ativo/inativo, contexto próprio/cruzado, coleta com/sem conjunto, suplemento válido/inválido/ausente e diagnóstico `CURRENT`/`SUPERSEDED`/`REVOKED`. Triggers de imutabilidade permanecem ativos; nenhum cenário pode desabilitá-los linha a linha.

Rollback transacional valida atomicidade de uma operação. Limpeza entre cenários remove dados da fixture. Rollback da migration valida reversão somente em schema descartável. Descarte do schema termina a execução. Recuperação operacional de produção é procedimento separado, explicitamente autorizado e não é substituído por nenhum dos anteriores. O harness deve registrar finalização mesmo após falha.

## 6. Integration validation

Executar:

```bash
npm run test:integration
```

### Context and authorization

Montar pelo menos dois laboratórios, duas áreas e duas coletas:

- OWNER e ADMIN consultam e escrevem em laboratório ativo;
- MEMBER consulta, mas toda escrita retorna `403` sem efeito;
- laboratório inativo permite current/detail e recusa cálculo/substituição/revogação;
- ID cruzado, inexistente ou vínculo ausente retorna o mesmo `404`;
- após revogar vínculo, inclusive replay/operação por chave deixa de ser acessível;
- conta não ativa não lê nem escreve.

### Creation and insufficiency

- com `ihfr-measurement-v1`, suplemento válido, versões/hash exatos e quatro dimensões suficientes: `201`, um diagnóstico `CURRENT`;
- sem conjunto ambiental, slope ou land use: `INSUFFICIENT_DATA`, nenhum diagnóstico/pointer;
- dimensão com menos de dois scores: `INSUFFICIENT_DATA`;
- hash ou versão divergente: `422 INCOMPATIBLE_VERSION`, sem ativação;
- score zero válido continua resultado, distinto de ausência/insuficiência.

### Idempotency and timeout

- mesma chave, ator, contexto e request: replay retorna o mesmo resultado, sem novo snapshot/evento;
- mesma chave com contexto/body/`mode`/motivo diferente: `409 IDEMPOTENCY_CONFLICT`;
- chave ambiental ou da coleta não é reutilizada internamente;
- após simular perda da resposta, GET da operação no mesmo contexto recupera o terminal;
- recuperação depois de perda de vínculo retorna `404`, sem vazamento.

### Concurrency and transitions

- duas criações concorrentes: no máximo um `CURRENT`; perdedora reavalia e conflita;
- duas substituições com mesmo expected ID: primeira vence, segunda `STATE_CONFLICT`;
- substituição cria novo snapshot, cria ou reutiliza suplemento compatível, torna o anterior `SUPERSEDED` e não edita snapshots/suplementos;
- revogação do vigente registra motivo restrito, torna-o `REVOKED`, remove current e mantém detalhe;
- revogar/substituir alvo não vigente retorna conflito;
- falha injetada em cada ponto transacional resulta em rollback integral.

## 7. API and E2E validation

Executar:

```bash
npm run test:e2e
```

Jornadas mínimas:

1. OWNER abre coleta elegível, informa suplemento, calcula e consulta o vigente;
2. MEMBER vê resultado, origem, versões/hash, vigência, datas e quatro rótulos, sem controles de escrita;
3. ausência de vigente é apresentada como ausência, não zero;
4. OWNER substitui usando o ID esperado e o detalhe antigo aparece `SUPERSEDED`;
5. ADMIN revoga com motivo; current retorna null e detalhe preservado aparece `REVOKED`;
6. inativo apresenta somente leitura;
7. timeout recupera a operação sem anunciar sucesso antes do terminal;
8. nenhum texto chama o resultado de cientificamente “aceito”, definitivo ou universal.

Não exigir nesta feature dashboard, feed histórico, mapa, gráfico, recomendação, PDF ou IA.

## 8. Regression suite

```bash
npm test
npm run test:migration
npm run typecheck
npm run lint
npm run build
```

Confirmar explicitamente:

- autenticação, laboratórios e papéis da IMP-003;
- confirmação/detalhe de coleta e imutabilidade da IMP-004;
- captura/leitura ambiental, parser, idempotência e imutabilidade da IMP-005;
- resumo/histórico, paginação e minimização da IMP-007;
- dashboard continua contendo somente `AREA_CREATED` e `COLLECTION_CONFIRMED` nesta entrega;
- mapa territorial, lista textual, endpoint privado e minimização da IMP-008;
- mapa permanece sem score, classe, risco, cor, diagnóstico, `landUseType`, payload ambiental ou auditoria restrita da IMP-006;
- nenhuma nova fonte paralela de atividade/auditoria.

Executar também os testes territoriais unitários e de integração e a spec E2E `tests/e2e/territorial-map.spec.ts`, com tiles interceptados conforme o contrato da IMP-008. Essa regressão preserva o mapa existente; não autoriza adicionar camada IHFR.

## 9. Teardown verificável

Após todas as regressões — inclusive a territorial — executar o teardown global em bloco de finalização, também quando algum teste falhar. Verificar e registrar:

- schema isolado removido;
- zero registros órfãos da execução;
- zero processos de servidor/test runner deixados em execução;
- triggers nunca desabilitados;
- nenhuma credencial ou valor de ambiente copiado à evidência.

## 10. Evidence record

Para cada comando registrar commit, ambiente sanitizado, resultado e falhas. Separar:

- `CONFORMIDADE_TECNICA_VERIFICADA`: contrato, código, banco e API;
- `VALIDACAO_CIENTIFICA_PENDENTE`: revisão especializada, calibração, vetores científicos e campo.

Testes verdes não removem `CONTRATO_EXPERIMENTAL`, `SUJEITO_A_RECALIBRACAO` ou `NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO`.
