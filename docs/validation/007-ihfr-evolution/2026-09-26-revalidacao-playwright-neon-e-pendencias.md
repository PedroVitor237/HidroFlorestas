# Revalidação criteriosa Playwright, Neon e pendências da `007-ihfr-evolution`

**Data da execução:** 2026-09-26

**Branch:** `007-ihfr-evolution`

**Código testado:** `c6e43026f7946bb37f207402986b5df2077657c1`

**Base documental na publicação:** `b23790969e5f3bcca7cf38992f32c527b8913375`

**Estado do relatório:** `CONCLUIDO_COM_RESSALVAS`

## 1. Objetivo, autoridade e conclusão

Este relatório registra a revalidação solicitada da branch publicada no GitHub,
com três objetivos:

1. verificar a coerência entre `spec.md`, `plan.md`, `tasks.md`, constituição e
   implementação observada;
2. exercitar os fluxos existentes por Playwright e pelos gates de suporte;
3. identificar, explicar e priorizar as pendências remanescentes.

`DECISAO_CONFIRMADA`: o responsável autorizou o uso temporário do URL Neon
fornecido para testes. O valor integral da conexão não foi registrado neste
relatório, gravado em arquivo novo ou incluído em comando versionado.

`EVIDENCIA_EXECUCAO`: o núcleo do IHFR atende ao contrato técnico experimental
do Spec Kit e passou nos gates de contrato, integração, migration e Playwright
IHFR em PostgreSQL/Neon real. A branch, porém, não pode ser descrita como
integralmente verde para merge ou implantação: a suíte Playwright oficial ainda
contém expectativas desatualizadas, o runner HTTPS não inicia corretamente no
runtime exigido e o destino Neon fornecido nesta rodada não estava alinhado à
migration mais recente.

`CONCLUSAO`: a engenharia experimental do IHFR está apta a sustentar um piloto
controlado depois da preparação do ambiente. Isso não aprova uso em produção,
decisão ambiental real ou validação científica definitiva.

## 2. Baseline, sincronização e preservação do repositório

No início dos testes, a branch local foi sincronizada por fast-forward até
`c6e43026f7946bb37f207402986b5df2077657c1`, então idêntica a
`origin/007-ihfr-evolution`. Não havia mudanças rastreadas locais.

Antes da publicação deste relatório, um novo `git fetch` encontrou dois commits
documentais no remoto, `1158a0d` e `b237909`. A branch local foi novamente
avançada por fast-forward. O diff `c6e4302..b237909` altera somente seis arquivos
de documentação em `docs/validation/007-ihfr-evolution/`; não altera código,
dependências, testes, migrations ou configuração. Portanto, o runtime em
`b237909` é o mesmo runtime efetivamente testado em `c6e4302`.

O arquivo preexistente não rastreado
`specs/005-environmental-collection-data/coverage-review.md` foi preservado e
permanece fora deste relatório, do staging e do commit.

Nenhum merge em `development`, rebase, force-push ou alteração de histórico foi
realizado.

## 3. Método e separação de ambientes

Foram usados dois tipos de destino, sem tratar um como prova automática do
outro:

| Destino | Finalidade | Escritas realizadas | Encerramento |
|---|---|---|---|
| Neon fornecido pelo responsável | Testes de contrato, integração, migration em schemas isolados, Playwright IHFR e regressões que exigiam PrismaNeon | Somente schemas e fixtures temporários pertencentes aos runners; nenhuma migration aplicada em `public` | Todos os schemas criados nesta execução foram removidos |
| PostgreSQL local descartável em loopback | Suíte Playwright geral e fluxo full UI sem escrever no `public` remoto | Baseline, migrations, fixtures e dados sintéticos locais | Instância encerrada e diretórios temporários removidos |

O endpoint direto do Neon foi derivado somente em memória para os runners que
exigem criação de schema e `search_path`. O URL pooled não foi usado para essas
operações. A conexão integral e as credenciais não aparecem nas evidências.

`EVIDENCIA_EXECUCAO`: a auditoria read-only do destino Neon desta rodada usou o
fingerprint sanitizado `568d60469278`. Esse fingerprint é específico desta
execução e não deve ser confundido com os destinos E2E registrados em rodadas
anteriores ou nos commits documentais posteriores.

## 4. Consistência do Spec Kit

O pacote analisado foi `specs/006-ihfr-diagnosis/`, continuidade funcional da
branch `007-ihfr-evolution`.

| Elemento | Contagem | Resultado |
|---|---:|---|
| Requisitos funcionais `FR-*` | 20 | Todos possuem cobertura nominal em tarefas |
| Critérios de sucesso `SC-*` | 8 | Todos possuem cobertura nominal em tarefas |
| IDs de tarefas | 143 | Contíguos e únicos |
| Tarefas marcadas concluídas | 143/143 | Cobertura mecânica de 100% |
| Tarefas abertas | 0 | Nenhuma marca `[ ]` no documento atual |

Não foi encontrado requisito funcional do pacote sem referência de execução ou
tarefa. A separação entre engenharia e ciência está preservada:

- `G1`, `G2-ENG` e `G3-ENG` são apresentados como resolvidos;
- `G2-SCI`, `PD-002`, revisão humana e calibração científica permanecem
  `VALIDACAO_POSTERIOR`;
- a prova independente endpoint Neon → `branch_id` permanece
  `EXTERNAL_VALIDATION`;
- os rótulos `CONTRATO_EXPERIMENTAL`, `VALIDACAO_CIENTIFICA_PENDENTE`,
  `SUJEITO_A_RECALIBRACAO` e
  `NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO` continuam obrigatórios.

`ACHADO`: a cobertura documental é completa, mas o estado `CONCLUIDO` e as
marcações T124/T141 precisam ser lidos como evidência dos destinos e datas
registrados. Eles não tornam automaticamente verde uma nova execução em outro
banco nem substituem a execução atual da suíte oficial.

## 5. Ambiente reproduzido

O ambiente foi alinhado ao lockfile e aos requisitos atuais do projeto:

| Componente | Versão observada |
|---|---|
| Node.js | `24.19.0` |
| Prisma CLI/Client | `7.4.2` |
| `@prisma/adapter-neon` | `7.4.2` |
| `@prisma/adapter-pg` | `7.4.2` |
| Next.js | `16.1.6` |
| Playwright | `1.51.1` |

`npm ci` foi executado a partir do lockfile, seguido de geração do Prisma
Client. Os artefatos gerados e de build são ignorados pelo Git e não produziram
mudança rastreada.

## 6. Matriz de gates executados

| Gate | Destino | Resultado | Observação |
|---|---|---|---|
| Instalação pelo lockfile | Local | **PASS** | Dependências alinhadas às versões versionadas |
| Prisma Client | Local | **PASS** | Geração com Prisma `7.4.2` |
| Testes unitários completos | Local | **PASS** | Zero falhas e zero skips reportados |
| Typecheck | Local | **PASS** | Saída zero |
| ESLint | Local | **PASS COM AVISOS** | Zero erros e quatro avisos de variáveis não usadas |
| Build de produção | Local | **PASS** | Exigiu rede para baixar Poppins por `next/font/google` |
| Contrato IHFR | Neon, schema isolado | **2/2 PASS** | Sem skips |
| Integração | Neon, schema isolado | **107/107 PASS** | Inclui autorização, contexto, idempotência, concorrência, insuficiência e ciclo |
| Migration | Neon, schema isolado | **26/26 PASS** | Inclui upgrade, integridade cruzada e rollback |
| Playwright IHFR | Neon, schema isolado | **6/6 PASS** | Leitura e gestão do diagnóstico |
| Full UI IHFR | PostgreSQL local descartável | **1/1 PASS** | CREATE, reload, histórico, REPLACE e REVOKE |
| `git diff --check` | Repositório | **PASS** | Nenhum erro de whitespace |

O build falhou inicialmente porque o sandbox não podia buscar a fonte do
Google. A repetição com rede autorizada passou. Isso confirma a dívida
operacional já registrada, não uma falha funcional do IHFR.

## 7. Cobertura Playwright dos fluxos existentes

Foram inventariados 19 arquivos `*.spec.ts` em `tests/e2e/`:

- autenticação HTTP e HTTPS;
- criação e contexto de laboratório;
- papéis de laboratório;
- cadastro e visualização de área;
- registro de coleta;
- captura e leitura de dados ambientais;
- dashboard, resumo e histórico;
- mapa territorial;
- administração global, auditoria, papel e estado de usuário;
- leitura e gestão IHFR;
- percurso full UI IHFR.

### 7.1 Suíte geral

A primeira execução das 15 specs gerais produziu:

- 37 testes aprovados;
- 4 falhas;
- 14 skips consequentes do modo serial depois das falhas.

Os 14 cenários não executados foram repetidos de forma controlada. Dezenove
cenários recuperados passaram. Duas falhas dependentes do adapter/ambiente foram
repetidas no Neon e passaram. O estado comportamental final da suíte geral foi
53/55 cenários confirmados, com duas expectativas antigas ainda vermelhas.

#### Falha A — envelope de login desatualizado

`tests/e2e/authenticated-access.spec.ts` ainda espera somente `success` e
`user`. A API e os testes unitários atuais incluem intencionalmente
`destination`, derivado do papel global, para encaminhar `ADMIN` a `/admin` e
os demais usuários a `/workspace`.

`CLASSIFICACAO`: teste obsoleto; regressão do produto não demonstrada.

#### Falha B — destino do botão “ACESSAR LABORATÓRIO” desatualizado

`tests/e2e/laboratory-context.spec.ts` ainda exige navegação direta para
`/areas`. A tarefa T025 da IMP-007 e o componente atual determinam a landing
`/dashboard/laboratories/{laboratoryId}`.

`CLASSIFICACAO`: teste obsoleto; o comportamento atual corresponde à decisão da
IMP-007.

#### Falha transitória C — horário da coleta no adapter local

O teste de coleta observou deslocamento de três horas no PostgreSQL local. A
mesma suíte foi repetida no Neon e passou 10/10 com a expectativa contratual.

`CLASSIFICACAO`: inconsistência de timezone/fixture no harness local; defeito do
fluxo remoto não reproduzido.

#### Falha transitória D — fixture de laboratório força PrismaNeon

`tests/fixtures/laboratories.ts` instancia `PrismaNeon` diretamente. Quando a
suíte geral foi executada contra PostgreSQL local, a fixture tentou usar o
transporte WebSocket Neon no loopback. A suíte foi repetida no Neon e passou
4/4.

`CLASSIFICACAO`: falta de portabilidade da fixture; defeito funcional do fluxo
de laboratório não demonstrado.

### 7.2 Playwright IHFR

Os seis cenários IHFR passaram no Neon em schema isolado. Foram cobertos:

- consulta vigente e ausência de vigente;
- DTO público e rótulos experimentais;
- autorização OWNER/ADMIN/MEMBER;
- CREATE suficiente;
- insuficiência sem diagnóstico falso;
- replay/idempotência;
- REPLACE e estado `SUPERSEDED`;
- REVOKE e ausência de `CURRENT`;
- reload e reabertura pelo histórico;
- viewport móvel e ausência de erro de página.

### 7.3 Full UI

O percurso full UI passou 1/1 no PostgreSQL local descartável:

`login → laboratório → área → coleta → dados ambientais → elegibilidade →
CREATE → reload → histórico → REPLACE → REVOKE`.

A escolha do destino local foi deliberada: esse teste escreve recursos em
`public` e não deveria ser executado em um destino remoto compartilhado sem uma
branch Neon dedicada, conta sintética e run ID próprio.

### 7.4 HTTPS

O comando oficial `tests/e2e/run-auth-https.mjs` falhou antes de iniciar o
navegador. No Node 24, a importação nomeada das funções de
`tests/fixtures/auth-users.ts` não foi fornecida pelo carregamento atual do
`tsx`.

Uma execução direta equivalente confirmou:

- proteção contra flash de conteúdo privado: **PASS**;
- ciclo de login HTTPS: interrompido na mesma expectativa obsoleta do campo
  `destination`.

`CLASSIFICACAO`: o gate HTTPS oficial permanece vermelho por defeito de runner
e por expectativa antiga do contrato de autenticação.

## 8. Estado observado no Neon fornecido nesta rodada

### 8.1 Migrations

O repositório possui oito migrations. No destino fornecido, sete estavam
aplicadas e permanecia pendente:

`20260926000100_ihfr_lifecycle_reference_integrity`.

Essa migration acrescenta validações de integridade entre operação,
diagnóstico, ponteiro `CURRENT` e eventos do ciclo. Ela passou nos testes em
schema isolado, mas não foi aplicada ao schema `public` deste destino.

`MOTIVO_DA_NAO_APLICACAO`: a autorização para testar o banco não foi tratada
como autorização automática para alterar permanentemente `public`. Além disso,
o papel operacional do destino — DEV, E2E dedicado ou produção — não foi
comprovado de forma independente nesta rodada.

### 8.2 Auditoria de schemas temporários

Antes dos testes, a auditoria read-only listou um candidato:

`imp006_test_bce92440f0134780b9fcee23facfbeda`, com o marcador esperado do
harness.

Ao final de todos os testes remotos, a mesma auditoria encontrou exatamente um
candidato, com o mesmo nome e marcador. Portanto:

- todos os schemas criados por esta execução foram descartados;
- o candidato já existia antes desta execução;
- nenhuma causalidade ou autoria desta rodada foi atribuída a ele;
- ele foi preservado porque a guarda de limpeza exige propriedade demonstrada
  ou autorização específica.

### 8.3 Limite de transferência de evidência

Os commits documentais sincronizados antes da publicação registram outro
destino E2E no qual a migration foi aplicada e a auditoria terminou limpa. Isso
não atualiza nem limpa o destino `568d60469278` desta execução. Evidência de
schema, migration e teardown é específica por endpoint, database e momento.

## 9. Pendências atuais e por que existem

### 9.1 Banco e ambiente

| ID | Pendência | Por que existe | Impacto |
|---|---|---|---|
| P-DB-01 | Identificar formalmente o destino | A conexão funcionou, mas não houve prova independente de que o endpoint é DEV, E2E dedicado ou produção | Sem classificação não é seguro autorizar migration, limpeza ou piloto |
| P-DB-02 | Aplicar a migration pendente no ambiente escolhido | O `public` do destino desta rodada possui sete de oito migrations | As proteções cruzadas mais recentes não estão ativas nesse ambiente |
| P-DB-03 | Decidir sobre o schema residual | O schema existia antes dos testes e tem marcador esperado, mas autoria não comprovada | Remoção sem guarda poderia apagar evidência ou trabalho de outra execução |
| P-DB-04 | Revalidar após eventual migration/limpeza | Estado de banco muda depois dessas operações | É necessário repetir status, integridade, Playwright e auditoria final |

### 9.2 Testes e qualidade

| ID | Pendência | Por que existe | Impacto |
|---|---|---|---|
| P-QA-01 | Atualizar a expectativa de login | A API ganhou `destination`, mas o Playwright manteve o envelope antigo | Suíte geral oficialmente vermelha |
| P-QA-02 | Atualizar o destino do acesso ao laboratório | A IMP-007 introduziu a landing contextual, mas o teste ainda exige `/areas` | Suíte geral oficialmente vermelha |
| P-QA-03 | Corrigir o runner HTTPS para Node 24 | O import nomeado da fixture falha antes do browser | O fluxo HTTPS oficial não é reproduzível ponta a ponta |
| P-QA-04 | Usar seletor comum de adapter nas fixtures | A fixture de laboratório força `PrismaNeon` | A suíte local produz falso negativo em PostgreSQL direto |
| P-QA-05 | Normalizar timezone das fixtures locais | PrismaPg local e Neon produziram projeções horárias diferentes no teste de coleta | A mesma asserção não é portátil entre os destinos |
| P-QA-06 | Reexecutar as 19 specs em uma rodada final | As correções anteriores mudam apenas a qualidade do gate quando verificadas em conjunto | Sem rodada final não existe prova de zero falhas e zero skips involuntários |

### 9.3 Documentação e operação

| ID | Pendência | Por que existe | Impacto |
|---|---|---|---|
| P-DOC-01 | Reconciliar o ADR-0001 | O ADR ainda registra `NAO_IMPLEMENTADO`, enquanto `TECH_DECISIONS.md` registra `IMPLEMENTADO_VERIFICADO` | Contradição entre fontes canônicas de estado |
| P-DOC-02 | Qualificar os gates por ambiente e data | O Spec Kit registra auditoria zero e gates Neon de destinos anteriores | Leitura superficial pode transferir evidência para um banco diferente |
| P-OPS-01 | Completar o bootstrap de banco vazio | O histórico incremental não contém uma migration inicial autossuficiente | `prisma migrate deploy` não provisiona sozinho um PostgreSQL completamente vazio |
| P-OPS-02 | Resolver ou aceitar formalmente a fonte remota | `next/font/google` exige rede para obter Poppins durante o build | Builds offline ou com egress restrito podem falhar |

### 9.4 Validação de campo e ciência

| ID | Pendência | Por que existe | Impacto |
|---|---|---|---|
| P-SCI-01 | Revisão humana especializada | Os testes comprovam execução técnica, não correção científica dos pesos e classes | Impede declarar o contrato cientificamente validado |
| P-SCI-02 | Definir protocolo de campo | Ainda faltam amostra, responsáveis, procedimentos, evidências e critérios de aceite | Um piloto sem protocolo gera observação, não validação científica formal |
| P-SCI-03 | Calibração e vetores científicos aprovados | Os vetores atuais são oráculos técnicos do contrato experimental | Resultados podem exigir recalibração após o campo |
| P-SCI-04 | Provar independentemente endpoint → `branch_id` | A identificação foi operacional, sem confirmação pela Console/API Neon nesta rodada | Limita a rastreabilidade formal do ambiente |

## 10. Reconciliação com os dois commits documentais posteriores

Após os testes deste relatório e antes de sua publicação, o remoto passou a
registrar duas evidências adicionais de outra execução sobre o mesmo runtime:

- `F-010`: timeout do runner full UI depois de persistir a medição ambiental;
  a continuação controlada demonstrou que o produto podia prosseguir, mas o
  runner integral permaneceu vermelho;
- `F-011`: `npm audit` reportou advisories de produção que ainda precisam de
  triagem de aplicabilidade e atualização controlada.

`FATO_DOCUMENTADO`: essas evidências pertencem à execução registrada nos
commits `1158a0d`/`b237909`, não foram reproduzidas como parte dos comandos
deste relatório. Elas não alteram o resultado positivo do núcleo IHFR, mas
reforçam o veredito de que a branch ainda não está pronta para merge ou
implantação sem ressalvas.

Pendências adicionais consolidadas:

| ID | Pendência | Motivo |
|---|---|---|
| P-QA-07 | Instrumentar e repetir o runner full UI integral | Uma execução posterior persistiu a medição, mas expirou aguardando a confirmação visual |
| P-SEC-01 | Triar os advisories de dependências | O resultado do auditor inclui severidades altas/crítica e precisa de análise de alcance real antes de implantação |

## 11. Prontidão para validação de campo

| Uso pretendido | Veredito | Condições |
|---|---|---|
| Piloto técnico supervisionado | `PRONTO_COM_CONDICOES` | Ambiente dedicado, migration atualizada, auditoria limpa, contas/dados sintéticos ou governados e protocolo registrado |
| Validação científica formal | `PODE_INICIAR_COMO_PROCESSO` | Autoridade científica, amostra, método, evidências, análise e critérios de aprovação ainda precisam ser definidos |
| Produção ou decisão ambiental real | `NAO_PRONTO` | Ciência pendente, suíte oficial vermelha, ambiente fornecido desalinhado e triagem de segurança aberta |

As falhas atuais do Playwright não demonstraram defeito no cálculo ou no ciclo
IHFR. Mesmo assim, corrigir e repetir os gates antes do campo estabelece uma
baseline auditável e reduz a chance de atribuir a problema científico uma falha
de automação, ambiente ou navegação.

## 12. Sequência recomendada

1. Corrigir P-QA-01 a P-QA-05 sem alterar o contrato IHFR.
2. Instrumentar F-010/P-QA-07 e repetir o runner integral com run ID novo.
3. Triar P-SEC-01 e registrar correção ou aceitação explícita de risco.
4. Confirmar formalmente o papel do destino Neon que sustentará o piloto.
5. Aplicar a migration pendente somente nesse destino autorizado, após
   preflight de integridade e plano de recuperação.
6. Resolver o schema residual somente com autoria ou autorização específica.
7. Reexecutar unitários, contrato, integração, migration, 19 specs Playwright,
   HTTPS, build e auditoria final.
8. Reconciliar ADR-0001 e o estado dos gates por ambiente/data.
9. Congelar a baseline técnica e iniciar o protocolo de campo supervisionado.

## 13. Encerramento e limpeza desta execução

`EVIDENCIA_EXECUCAO`:

- o PostgreSQL local descartável foi encerrado;
- os diretórios temporários próprios foram removidos;
- não permaneceu processo PostgreSQL próprio;
- todos os schemas Neon criados nesta execução foram descartados;
- o único schema residual final já existia antes da execução e foi preservado;
- nenhuma migration foi aplicada ao `public` do Neon fornecido;
- nenhuma credencial foi versionada ou reproduzida;
- nenhum arquivo de código, teste, migration ou documento canônico foi editado
  durante a fase de testes;
- este relatório é a única alteração nova preparada para publicação nesta
  solicitação.

O resultado final permanece: **núcleo técnico experimental aprovado; branch e
ambiente ainda com pendências antes de merge, implantação ou uso de campo sem
supervisão**.
