# Reanálise das pendências e do uso de Prisma na `007-ihfr-evolution`

**Data da análise:** 2026-09-25

**Branch analisada:** `007-ihfr-evolution`

**HEAD analisado:** `a7cf4e24f1b34891caeb8ac224e134b5b7e40854`

**Base local observada:** `origin/development@100351e07d9f89f34ebb0ea4de17b526297d6350`
**Estado Git inicial após atualização:** branch local e remota com divergência `0/0`; o arquivo não rastreado `specs/005-environmental-collection-data/coverage-review.md` permaneceu intocado.

## 1. Escopo, autoridade e limites

Este documento é uma reanálise técnica e documental solicitada pela equipe. Ele não implementa as soluções propostas, não altera o contrato matemático, não modifica migrations publicadas e não promove evidência técnica a validação científica.

Classificações usadas:

- `EVIDENCIA_IMPLEMENTACAO`: comportamento observado diretamente em código, configuração ou comando executado nesta análise.
- `FATO_DOCUMENTADO`: estado declarado pelos artefatos existentes, sem nova execução independente do respectivo ambiente.
- `INFERENCIA`: conclusão técnica derivada das evidências, ainda não confirmada por execução no ambiente indicado.
- `RECOMENDACAO`: solução proposta pelo agente; não constitui decisão aprovada.
- `PENDENCIA_DE_DECISAO`: depende de autoridade, credencial, ambiente ou validação externa.

O IHFR permanece `CONTRATO_EXPERIMENTAL`, `VALIDACAO_CIENTIFICA_PENDENTE`, `SUJEITO_A_RECALIBRACAO` e `NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO`.

## 2. Estado atual resumido

`EVIDENCIA_IMPLEMENTACAO`:

- a branch local foi atualizada por fast-forward de `25756b0` para `a7cf4e2`, sem merge commit;
- a branch está 51 commits à frente e zero atrás de `origin/development` na referência local verificada;
- existem 20 requisitos funcionais, 8 critérios de sucesso e 142 tarefas;
- 138 tarefas estão marcadas como concluídas e T137, T139, T140 e T141 permanecem abertas;
- F-001, F-002 e a validação booleana foram corrigidos e possuem testes locais;
- o cast `current_schema()::text` está versionado e passou com `PrismaPg` local, mas não foi executado nesta versão com `PrismaNeon`;
- o E2E integral desde login está implementado e é descoberto pelo Playwright, mas não foi executado no destino Neon dedicado;
- não havia variáveis de banco ou do full UI exportadas no processo desta análise; `.env.e2e.local` não existe e `.env.test.local` existe, mas seu conteúdo não foi lido nem carregado;
- nenhum teste com escrita PostgreSQL ou Neon foi executado nesta reanálise.

Conclusão operacional: a implementação experimental está tecnicamente forte no caminho local, mas a branch continua `EM_ANDAMENTO`. O fechamento seguro depende de compatibilidade Prisma/Neon, identidade do destino, auditoria remota e execução real do full UI.

## 3. Verificações executadas nesta reanálise

| Verificação | Resultado observado | Limite |
|---|---|---|
| `prisma validate` com datasource fictício sem conexão | PASS | Valida schema Prisma; não valida migration aplicada nem adapter Neon. |
| `prisma generate` | PASS, Client `7.4.2` | O schema embutido no Client passou a coincidir byte a byte com `prisma/schema.prisma`. |
| `npm run typecheck` | PASS | Não exercita banco. |
| `npm run test:unit` | PASS, 61 arquivos no relatório do Node 20 desta máquina | A documentação anterior, executada em Node 24, contabiliza 218 testes; a diferença de reporte não foi tratada como falha funcional. |
| `npm run lint` | PASS, zero erros e quatro avisos preexistentes | Avisos fora do recorte IHFR. |
| `npm run build` no sandbox | FAIL ao buscar Poppins no Google Fonts | Falha ambiental de rede, não atribuída ao código. |
| `npm run build` com rede liberada | PASS | Confirma compilação atual; continua dependente de recurso externo de fonte. |
| `npm run test:integration` sem configuração | Recusado antes da descoberta | Guarda falhou por ausência de confirmação do banco, sem escrita. |
| `npm run test:contract` sem configuração | Recusado antes da descoberta | Guarda falhou por ausência de confirmação do banco, sem escrita. |
| Descoberta do full UI com valores sintéticos | PASS, um teste descoberto | Nenhum navegador, servidor ou banco foi executado. |
| Estado do Prisma Client gerado | Schema gerado e fonte com o mesmo SHA-256 | Não prova compatibilidade de runtime entre Client e adapter Neon. |

## 4. Achados e gravidade

### R-001 — Caminho `PrismaNeon` permanece sem validação nesta correção

- **Gravidade:** alta para fechamento; média para o comportamento local já testado.
- **Classificação:** `PENDENCIA_DE_DECISAO` e `FATO_DOCUMENTADO`.
- **Relação:** T137 e F-007.

O cast `SELECT current_schema()::text AS schema` foi incorporado ao serviço e ao lifecycle de testes. As regressões documentadas e as executadas localmente usam `PrismaPg`. O erro original ocorreu com Prisma/Neon, e não há nesta rodada evidência de que o adapter Neon:

1. aceite o parâmetro de startup `options=-csearch_path=...` em todas as conexões do pool;
2. reporte o schema esperado em `current_schema()::text`;
3. mantenha queries e transações serializáveis no schema isolado;
4. encerre o pool antes do teardown;
5. preserve a desserialização de `timestamptz`, `Decimal`, enums e JSONB usada pela IMP-006.

`RECOMENDACAO`: manter T137 aberta até uma execução focal no endpoint Neon direto e em branch descartável. O teste deve comprovar schema selecionado, leitura, escrita, rollback, desconexão e remoção do schema criado pela própria execução.

### R-002 — Versões Prisma estão desalinhadas

- **Gravidade:** alta enquanto T137 depender de Neon.
- **Classificação:** `EVIDENCIA_IMPLEMENTACAO`.

O lockfile instalado contém:

- `prisma`: `7.4.2`;
- `@prisma/client`: `7.4.2`;
- `@prisma/adapter-pg`: `7.4.2`;
- `@prisma/adapter-neon`: `7.7.0`;
- `@prisma/driver-adapter-utils` usado por Neon: `7.7.0`;
- `@prisma/driver-adapter-utils` usado por Pg: `7.4.2`.

TypeScript aceita a combinação estruturalmente, mas os testes locais exercitam principalmente a família `7.4.2`. A ausência de `peerDependencies` restritivos no pacote Neon não constitui prova de compatibilidade comportamental com Client `7.4.2`.

`RECOMENDACAO`: alinhar CLI, Client, adapters e utilitários Prisma na mesma versão exata antes da validação Neon. A alternativa de menor mudança é fixar toda a família na versão já comprovada localmente; uma atualização coordenada deve ser uma entrega separada, com regeneração do Client e repetição integral dos gates. Não atualizar diretamente para Prisma 8 como parte desta correção focal.

### R-003 — A identidade da branch Neon continua não comprovada independentemente

- **Gravidade:** alta antes de qualquer escrita remota.
- **Classificação:** `PENDENCIA_DE_DECISAO`.
- **Relação:** T139 e F-005.

O preflight atual comprova protocolo, database, schema, transação read-only, uso de endpoint direto e diferença entre identidades normalizadas de desenvolvimento e teste. Ele não comprova o `branch_id` fornecido pelo provedor.

`RECOMENDACAO`: confirmar na Neon Console ou API, fora dos logs do repositório, a associação dos dois endpoints aos respectivos `branch_id`. Registrar apenas IDs/fingerprints não secretos e a confirmação de que desenvolvimento e teste são branches diferentes. Não executar migration, fixture, E2E ou limpeza remota antes dessa confirmação.

### R-004 — O full UI escreve em `public` e preserva registros

- **Gravidade:** alta se usado fora de branch descartável; controlada em destino exclusivo.
- **Classificação:** `EVIDENCIA_IMPLEMENTACAO`.
- **Relação:** T140 e F-006.

`scripts/imp006-full-ui-e2e.ts` exige schema `public`, cria dados desde o login e declara que os registros de domínio são preservados para revisão. Portanto, esse roteiro não é um teste descartável equivalente aos schemas `imp006_test_*`.

`RECOMENDACAO`: executar exclusivamente em branch Neon dedicada e descartável, nunca em desenvolvimento ou produção. Usar conta sintética, `IMP006_UI_RUN_ID` único e plano explícito de descarte da branch após a revisão humana. Qualquer limpeza linha a linha deve ser uma operação separada, autorizada e auditada; a preferência é descartar a branch inteira.

### R-005 — `.env.e2e.local` é citado como pré-condição, mas o runner não o carrega

- **Gravidade:** média-alta para repetibilidade e segurança operacional.
- **Classificação:** `EVIDENCIA_IMPLEMENTACAO`.

A documentação atribui o bloqueio à ausência de `.env.e2e.local`. Entretanto, `scripts/imp006-full-ui-e2e.ts` não importa `dotenv/config` nem carrega esse arquivo explicitamente. Criar o arquivo, isoladamente, não tornaria as variáveis disponíveis ao preflight executado antes do Next.js.

`RECOMENDACAO`: escolher e documentar uma única estratégia:

1. carregar explicitamente `.env.e2e.local` no runner, exigir permissão `0600`, mantê-lo ignorado e nunca imprimir valores; ou
2. exigir injeção protegida das variáveis pelo processo/CI e remover das instruções a suposição de carregamento automático do arquivo.

Não usar `source`, histórico de shell ou comando reproduzido contendo URLs, senha, token ou segredo.

### R-006 — Integridade cruzada de ponteiro e eventos depende principalmente do serviço

- **Gravidade:** média-alta como defesa em profundidade; baixa no fluxo exclusivo pelo serviço atual.
- **Classificação:** `INFERENCIA` baseada na migration e no serviço.
- **Relação:** FR-011 e FR-017.

Os triggers verificam que diagnóstico, suplemento e coleta compartilham contexto. Porém, a migration não comprova no banco que:

- `CurrentExperimentalIHFRDiagnosis.operationId` pertence à mesma coleta, aponta para o mesmo diagnóstico e representa operação `SUCCEEDED` de criação/substituição;
- evento `CREATED_CURRENT` usa operação cujo `diagnosisId` é o diagnóstico criado;
- evento `SUPERSEDED` usa operação cujo `diagnosisId` é o diagnóstico substituto;
- evento `REVOKED` usa operação `REVOKE` do mesmo diagnóstico, coleta e ator.

O serviço cria essas relações corretamente, mas uma escrita administrativa, script ou futura implementação que contorne o serviço pode formar uma trilha incoerente sem violar as constraints atuais.

`RECOMENDACAO`: criar testes negativos em schema descartável. Se a lacuna for confirmada, criar migration aditiva com trigger/constraints de coerência. Não editar a migration `20260920000100_ihfr_experimental_diagnosis` já publicada.

### R-007 — A auditoria de schemas não falha quando encontra resíduos

- **Gravidade:** média.
- **Classificação:** `EVIDENCIA_IMPLEMENTACAO`.
- **Relação:** T139, T141 e F-009.

`npm run test:ihfr:audit` lista schemas candidatos e seus marcadores, mas não define código de saída diferente de zero quando encontra resíduos. Assim, um job pode ficar verde mesmo com schemas remanescentes.

`RECOMENDACAO`: separar dois modos:

- `list`: somente leitura, sempre lista e não remove;
- `assert-zero`: somente leitura, falha se houver qualquer candidato.

Limpeza deve continuar fora da auditoria e exigir nome exato, prefixo allowlisted, marcador esperado, prova de criação pela própria rodada e autorização explícita.

### R-008 — Estado e métricas do Spec Kit estão inconsistentes

- **Gravidade:** média; alta para alegar encerramento.
- **Classificação:** `EVIDENCIA_IMPLEMENTACAO`.

Inconsistências atuais:

- `spec.md` identifica a branch `006-ihfr-diagnosis` e encerra T001–T134, sem refletir a continuidade corrente da `007-ihfr-evolution`;
- `plan.md` declara `EM_ANDAMENTO` somente em seção posterior, enquanto o status inicial enfatiza encerramentos históricos;
- `tasks.md` contém 142 tarefas, mas a distribuição informa total 134;
- a regra afirma que T134 é a última tarefa real, embora T135–T142 tenham sido acrescentadas;
- T137 descreve aplicar o cast e executar regressões, ações já realizadas localmente, mas continua aberta por uma condição Neon que não aparece no enunciado;
- T140 diz “executar ou preparar”; está preparada, mas segue aberta porque a execução é o gate real;
- T141 combina gates locais concluídos e gates remotos pendentes;
- a matriz de rastreabilidade não inclui explicitamente T135–T142.

`RECOMENDACAO`: atualizar status, métricas, regra de encerramento, textos de T137/T140/T141 e rastreabilidade, preservando o histórico de T001–T134.

### R-009 — Runtime Node não está fixado

- **Gravidade:** média para reprodutibilidade.
- **Classificação:** `EVIDENCIA_IMPLEMENTACAO`.

A evidência anterior registra Node `24.19.0`; esta reanálise executou em Node `20.19.2`. `package.json` não declara `engines` nem mecanismo equivalente de fixação. Os gates passaram, mas a contagem reportada pelo test runner e detalhes de carregamento podem variar.

`RECOMENDACAO`: definir a versão suportada de Node em `package.json` e no mecanismo usado pela equipe/CI. Repetir os gates na versão escolhida antes do fechamento.

### R-010 — Build depende de Google Fonts em rede

- **Gravidade:** baixa para a feature; média para builds herméticos.
- **Classificação:** `EVIDENCIA_IMPLEMENTACAO`.

O build falhou no sandbox somente porque `next/font` não conseguiu buscar Poppins; com rede liberada, passou. Isso não é defeito IHFR, mas reduz reprodutibilidade offline.

`RECOMENDACAO`: considerar fonte local/self-hosted em entrega separada ou declarar acesso de rede como pré-condição do build. Não atribuir essa falha ao Prisma ou ao IHFR.

### R-011 — Validações científicas e humanas continuam externas

- **Gravidade:** crítica para promoção científica; não bloqueia a versão experimental rotulada.
- **Classificação:** `PENDENCIA_DE_DECISAO`.

Continuam sem evidência: revisão especializada, calibração, vetores científicos aprovados, testes de campo e revisão humana com leitor de tela.

`RECOMENDACAO`: manter essas validações separadas dos gates técnicos e impedir qualquer mudança dos quatro rótulos experimentais antes da aprovação competente.

## 5. Ordem proposta de remediação

1. Corrigir a coerência do Spec Kit sem marcar tarefas remotas como concluídas.
2. Alinhar versões Prisma em uma mudança focal e repetir `generate`, typecheck, unitários, contrato, integração, migrations e build.
3. Corrigir a estratégia de carregamento seguro da configuração full UI.
4. Adicionar preflight read-only executável isoladamente e modo de auditoria `assert-zero`.
5. Adicionar testes negativos de integridade cruzada operação/ponteiro/evento; se falharem, criar migration aditiva.
6. Obter prova independente dos `branch_id` e confirmação explícita do destino descartável.
7. Executar primeiro o teste focal `PrismaNeon` em schema isolado, com teardown e auditoria zero.
8. Executar contrato, integration e migration no destino descartável somente após o teste focal.
9. Executar full UI por último, em `public` da branch Neon exclusiva, preservando os registros apenas para revisão.
10. Após revisão, descartar a branch Neon dedicada ou realizar limpeza separada e autorizada.
11. Repetir gates finais, atualizar evidências e então avaliar T141.

## 6. Roteiro de testes seguros

### 6.1 Gates sem banco

Estes comandos não devem receber uma URL real:

```bash
DATABASE_URL='postgresql://audit:audit@127.0.0.1:65535/audit' npx prisma validate
DATABASE_URL='postgresql://audit:audit@127.0.0.1:65535/audit' npx prisma generate
npm run typecheck
npm run test:unit
npm run lint
DATABASE_URL='postgresql://audit:audit@127.0.0.1:65535/audit' npm run build
git diff --check
```

O build atual requer acesso ao Google Fonts. Se falhar apenas nessa busca, repetir em ambiente autorizado com rede e registrar separadamente a falha ambiental e o resultado final.

### 6.2 Preparação do destino Neon

Antes de qualquer escrita:

1. criar ou selecionar uma branch Neon descartável exclusiva;
2. confirmar na Neon Console/API o `branch_id` e o endpoint direto;
3. confirmar que o endpoint de desenvolvimento pertence a outra branch;
4. usar usuário de teste sem privilégios administrativos globais desnecessários;
5. confirmar que `TEST_DATABASE_URL` é direto, não pooled;
6. manter `DATABASE_URL` e `TEST_DATABASE_URL` distintos;
7. definir `TEST_DATABASE_CONFIRMATION` e `IMP006_DATABASE_VARIABLE` somente no processo protegido;
8. não registrar os valores no terminal compartilhado, documentação, Git ou saída de testes.

O preflight existente é somente leitura, mas os comandos `test:integration`, `test:contract` e `test:migration` continuam imediatamente para fases com escrita após o preflight. Eles só podem ser usados depois da autorização explícita do destino.

### 6.3 Validação focal do adapter Prisma/Neon

Depois de alinhar versões e obter autorização de escrita no destino descartável:

1. executar o menor teste de lifecycle que cria um schema allowlisted;
2. confirmar `current_schema()::text` pelo `pg` e pelo `PrismaNeon`;
3. executar uma leitura e uma escrita Prisma dentro do schema;
4. confirmar transação serializável e rollback;
5. desconectar o Prisma antes do teardown;
6. remover somente o schema criado pela própria rodada;
7. executar auditoria read-only e exigir zero candidatos.

Se qualquer etapa falhar, parar. Não avançar para migration, suíte geral ou full UI e não tentar limpeza ampla.

### 6.4 Suítes PostgreSQL

Após o teste focal Neon ficar verde:

1. executar o teste de insuficiência persistida;
2. executar contrato;
3. executar migrations em schema descartável;
4. executar integração completa;
5. executar E2E IHFR com fixture isolada;
6. executar auditoria `assert-zero` proposta.

Cada suíte deve usar schema aleatório allowlisted, marker esperado, timeout, `finally`, desconexão do adapter e verificação de ausência posterior. Nenhuma suíte deve desabilitar triggers.

### 6.5 Full UI

Executar somente quando todos os gates anteriores estiverem verdes:

1. usar a branch Neon descartável e schema `public` exclusivo dela;
2. confirmar migrations como atualizadas; não executar deploy automaticamente se houver pendência;
3. usar conta sintética e `IMP006_UI_RUN_ID` único;
4. verificar que não existe laboratório com o mesmo run ID;
5. executar o fluxo desde login;
6. revisar IDs, vetor 0.2875/0.29, CURRENT, reload, histórico, REPLACE e REVOKE;
7. registrar somente IDs/fingerprints não secretos;
8. encerrar servidor e navegador;
9. revisar os registros preservados;
10. descartar a branch Neon inteira após autorização.

O full UI não deve ser executado contra desenvolvimento, produção ou uma branch compartilhada. O teste não realiza teardown dos registros de domínio e não deve ser apresentado como descartável.

## 7. Critério de fechamento proposto

T141 só deve ser marcada como concluída quando houver evidência de:

- versões Prisma alinhadas e lockfile reproduzível;
- Client regenerado e gates sem banco verdes;
- identidade independente da branch Neon;
- `PrismaNeon` validado no schema isolado, sem patch temporário;
- contrato, integração, migrations e E2E IHFR verdes no destino autorizado;
- auditoria remota com zero schemas candidatos;
- full UI executado desde login no destino dedicado;
- revisão e descarte autorizado dos registros/branch de teste;
- documentos Spec Kit reconciliados com 142 tarefas e estado `EM_ANDAMENTO` ou `CONCLUIDO` coerente;
- validações científicas ainda explicitamente separadas, caso continuem pendentes.

Até lá, o estado recomendado é `EM_ANDAMENTO_COM_IMPLEMENTACAO_LOCAL_VERIFICADA_E_GATES_NEON_PENDENTES`.
