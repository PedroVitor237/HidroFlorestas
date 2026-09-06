# Guia prático de desenvolvimento do HidroFlorestas

- **Versão do guia:** 1.0.0
- **Última revisão:** 2026-09-06
- **Versão compatível do Spec Kit:** 1.0.4
- **Estado:** pronto para revisão humana

Este guia é o roteiro operacional para entrar no projeto, escolher uma entrega, conduzir o fluxo
do Spec Kit e preparar uma contribuição para revisão. Ele também pode ser fornecido como contexto
a uma IA.

Os comandos sem marcadores foram confirmados no repositório ou no CLI Spec Kit 1.0.4. Textos entre
`<...>` são placeholders: substitua-os antes de executar ou enviar um prompt. Quando o fluxo, a
integração ou a versão adotada do Spec Kit mudar, atualize este guia na mesma tarefa de manutenção,
revise os comandos e links e registre a nova versão e data acima.

## Sumário

- [Início rápido](#1-objetivo-e-visão-rápida)
- [Preparação da máquina](#2-preparação-da-máquina)
- [Primeira leitura](#3-primeira-leitura-do-projeto)
- [Escolha do trabalho](#4-como-descobrir-e-escolher-o-próximo-trabalho)
- [Branch e worktree](#5-branch-e-worktree-por-funcionalidade)
- [Fluxo do Spec Kit](#6-fluxo-completo-do-spec-kit)
- [Implementação e validação](#7-implementação-e-validação)
- [Revisão e entrega](#8-revisão-e-entrega)
- [Decisões e autonomia](#9-decisões-autonomia-e-consulta-à-equipe)
- [Uso de IA](#10-como-pedir-ajuda-a-uma-ia)
- [Modelos de prompts](#11-modelos-reutilizáveis-de-prompts)
- [Referências e manutenção](#12-referências-e-manutenção-do-guia)

## 1. Objetivo e visão rápida

O HidroFlorestas trabalha com entregas verticais: cada funcionalidade deve produzir um resultado
pequeno, útil e verificável para o produto. O pacote [PRD Code-First](../README.md) mantém a visão
global, a intenção de produto em seu estado documentado, a rastreabilidade e o
[backlog](backlog.md). Cada entrega ganha seus próprios artefatos executáveis em
`specs/<numero-e-slug>/`: `spec.md`, `plan.md`, `tasks.md` e os documentos de desenho aplicáveis.

O [AGENTS.md](../../../AGENTS.md) define as regras de trabalho no repositório. A
[constituição](../../../.specify/memory/constitution.md) governa o fluxo por funcionalidade e a
[política de fontes](../governance/source-policy.md) impede que código, proposta ou documentação
histórica sejam apresentados como intenção aprovada. Cada funcionalidade usa branch própria para
manter o recorte rastreável, reduzir colisões e permitir revisão e integração independentes.

```text
Conhecer o projeto
→ configurar ambiente
→ escolher ou receber uma entrega
→ criar branch ou worktree
→ especificar
→ esclarecer quando necessário
→ planejar
→ gerar tarefas
→ analisar consistência
→ implementar
→ testar e convergir
→ atualizar documentação
→ abrir PR e revisar
```

### Regra central sobre a instalação

Cada desenvolvedor pode precisar instalar o **CLI do Spec Kit** na própria máquina, mas o
repositório HidroFlorestas **já está inicializado**. Um desenvolvedor comum não deve executar
`specify init` novamente. As estruturas `.specify/**` e `.agents/skills/**` já vêm do repositório.
Reinicializar ou atualizar essa estrutura exige tarefa própria, branch própria e revisão. OpenSpec
não integra o fluxo atual e não deve receber artefatos duplicados.

## 2. Preparação da máquina

### 2.1 Pré-requisitos comprováveis

- Git e Bash instalados. A integração versionada usa scripts Bash em `.specify/scripts/bash/`.
- Node.js `>=20.9.0`, requisito registrado para o Next.js 16.1.6 no lockfile. O repositório não
  fixa uma versão exata de Node.
- npm, gerenciador indicado por `package-lock.json` com lockfile v3. Não há declaração de
  `packageManager` no `package.json`.
- `uv`, usado para instalar o CLI do Spec Kit.
- Codex, no CLI ou editor, ou outro agente capaz de ler as instruções locais.

O shell interativo pode ser outro, mas os scripts do Spec Kit precisam ser executados por Bash;
executá-los diretamente por `sh` não é uma alternativa garantida. No Windows, use Git Bash ou
WSL. Mantenha Git, Node/npm, `uv` e o agente escolhido visíveis no `PATH` desse mesmo ambiente.

### 2.2 Obter ou atualizar o repositório com segurança

Em uma clonagem nova, substitua os placeholders:

```bash
git clone "<URL-DO-REPOSITORIO>" "<DIRETORIO-LOCAL>"
cd "<DIRETORIO-LOCAL>"
git status --short --branch
```

Em uma cópia existente, examine o estado antes de atualizar:

```bash
git status --short --branch
git worktree list
git fetch origin development
git rev-parse development
git rev-parse origin/development
```

Não faça `pull`, troca de branch, stash, reset ou limpeza sobre alterações que ainda não foram
identificadas. Se os dois hashes de `development` diferirem, atualize a branch apenas em um
worktree limpo que a contenha, com avanço rápido (`git merge --ff-only origin/development`), ou
peça ajuda à equipe. Nunca apague o trabalho local para obter uma base limpa.

### 2.3 Dependências e ambiente da aplicação

Em uma cópia limpa e com o lockfile presente:

```bash
node --version
npm --version
npm ci
npx prisma generate
```

O código e a configuração atuais consultam estes nomes:

- `DATABASE_URL`: conexão usada pelo Prisma e pelo adapter de banco;
- `JWT_SECRET`: segredo de assinatura e validação de sessão;
- `ROOT_PASSWORD`: usado somente pelo script autorizado de criação de superadministrador;
- `NODE_ENV`: indicador do ambiente, normalmente definido pelo runtime.

Na raiz do repositório, crie um arquivo `.env` vazio se ele ainda não existir, sem sobrescrever uma
configuração local existente. Antes de preenchê-lo, confirme a proteção e o estado do working tree:

```bash
git check-ignore .env
git status --short
```

O primeiro comando deve indicar que `.env` está ignorado. Se não indicar, pare e corrija a
proteção com a equipe antes de inserir qualquer valor. Depois da confirmação, preencha somente os
nomes necessários com valores recebidos pelo canal seguro definido pela equipe. Nunca coloque
valores reais no guia, em prompts, commits, mensagens, logs ou evidências de teste.

O arquivo rastreado `env.exemple` é uma referência parcial para nomes, está incompleto e não
constitui o contrato integral de configuração. Não copie automaticamente seus valores atuais; a
fonte efetiva dos valores é o canal seguro da equipe. Este guia não corrige `env.exemple`.

Não execute migrations ou scripts administrativos apenas como etapa de entrada. Eles podem mudar
estado compartilhado e só devem ser usados quando o plano da feature, o ambiente e a autorização
correspondente estiverem claros.

### 2.4 Instalar e verificar o Spec Kit 1.0.4

Primeiro verifique o `uv`:

```bash
uv --version
```

Se o comando não existir, instale o `uv` pelo
[procedimento oficial adequado ao seu sistema](https://docs.astral.sh/uv/getting-started/installation/)
e reabra o terminal. Em seguida, instale exatamente a versão adotada pelo projeto:

```bash
uv tool install specify-cli \
  --from git+https://github.com/github/spec-kit.git@v1.0.4
```

Para uma instalação existente em versão incompatível, o CLI 1.0.4 oferece atualização fixada. A
primeira linha apenas mostra a ação; a segunda a executa:

```bash
specify self upgrade --tag v1.0.4 --dry-run
specify self upgrade --tag v1.0.4
```

Se a versão antiga não tiver `specify self`, a reinstalação fixada equivalente confirmada pelo
próprio CLI 1.0.4 é:

```bash
uv tool install specify-cli --force \
  --from git+https://github.com/github/spec-kit.git@v1.0.4
```

Não instale a partir de `main`, não use versão `dev` e não atualize automaticamente para uma
versão que o repositório ainda não adotou.

Se `uv` instalar a ferramenta mas `specify` não for encontrado:

```bash
uv tool dir --bin
uv tool update-shell
```

Reabra o terminal e verifique novamente. O primeiro comando mostra o diretório que precisa estar
no `PATH`; não codifique no guia um caminho pessoal.

Na raiz do repositório, confirme CLI e integração sem reinicializar o projeto:

```bash
specify --version
specify check
specify integration status
```

O resultado esperado para este baseline é Spec Kit 1.0.4, integração padrão `codex` e nenhuma
ausência ou modificação em arquivos gerenciados. A integração usa `$speckit-...`, conforme
`.specify/integration.json`. Codex descobre as skills em `.agents/skills/`; outro agente deve ser
orientado a ler o `SKILL.md` da etapa e respeitar seus efeitos, mesmo que sua interface de
invocação seja diferente. Não reinstale nem troque a integração para acomodar um agente sem uma
tarefa estrutural própria.

### 2.5 Validação inicial da aplicação

Os scripts atualmente registrados são `dev`, `build`, `start`, `lint` e
`create-super-admin`. Para uma checagem inicial comum:

```bash
npm run lint
npm run build
```

`npm run build` também gera o Prisma Client. O repositório não possui script `test`; não invente
um comando nem instale uma ferramenta para completar um gate. Rode `npm run dev` somente depois
de configurar o ambiente aplicável. O script administrativo não é uma validação de entrada.

## 3. Primeira leitura do projeto

Leia nesta ordem curta antes de escolher ou alterar uma feature:

1. [AGENTS.md](../../../AGENTS.md);
2. [constituição do projeto](../../../.specify/memory/constitution.md);
3. [visão do PRD Code-First](../README.md);
4. [plano mínimo de implementação](implementation-plan.md);
5. [backlog de implementação](backlog.md);
6. `specs/<numero-e-slug>/spec.md`, quando a funcionalidade já existir.

Use as fontes conforme o assunto:

- Consulte o [PRD em revisão](../prd-code-first.md) e o
  [catálogo de requisitos](../specifications/requirements.md) para intenção de produto e
  rastreabilidade, sempre preservando a classificação registrada.
- Consulte [casos de uso](../specifications/use-cases.md) e
  [fluxos de produto](../specifications/product-flows.md) para atores, jornadas e alternativas.
- Consulte [TECH_DECISIONS.md](../../../TECH_DECISIONS.md) para saber se uma escolha técnica está
  confirmada, apenas relatada, proposta ou em avaliação.
- Consulte código, schema, testes e configurações para entender o baseline implementado, nunca
  para deduzir sozinho a intenção desejada.
- Consulte Figma apenas quando o artefato e seu estado forem identificados. No estado atual ele é
  apoio complementar de UX, não autoridade automática.
- Consulte documentação antiga somente quando a tarefa permitir, como contexto, proposta ou
  origem de perguntas. `docs/raw/**` é evidência histórica imutável.

A ordem de autoridade é: decisão atual confirmada para o assunto; intenção classificada no PRD
Code-First; implementação observável; decisão técnica em seu estado; documentação histórica;
referência visual classificada; proposta ou inferência. Se duas fontes relevantes divergirem e a
autoridade não resolver, registre `PENDENCIA_DE_DECISAO` em artefato autorizado e consulte a
equipe.

## 4. Como descobrir e escolher o próximo trabalho

Não escolha uma feature apenas pelo nome de uma página, model ou arquivo. Primeiro cruze produto,
dependências e coordenação.

### 4.1 Levantamento antes de reservar uma entrega

```bash
git status --short --branch
git fetch origin
git branch --all
git ls-remote --heads origin
git worktree list
find specs -mindepth 1 -maxdepth 1 -type d -print
gh pr list --base development --state open
```

Confirme primeiro que o working tree está identificado e preservado. `git fetch origin` atualiza as
referências remotas conhecidas; `git branch --all` mostra essas referências locais após o fetch, e
`git ls-remote --heads origin` consulta diretamente os heads remotos sem criar uma branch. O último
comando é opcional e exige GitHub CLI autenticado; sem ele, consulte os PRs no GitHub.

Leia também o [backlog](backlog.md) para verificar estado, prioridade, dependências, risco
decisório e paralelização. Compare os itens selecionados com specs existentes, branches locais e
remotas, worktrees, PRs em andamento e os arquivos que cada trabalho pretende alterar. A consulta
técnica não substitui a confirmação de atribuição com a equipe antes de reservar número e slug.

Uma boa entrega:

- produz resultado vertical e demonstrável para uma pessoa usuária;
- é pequena o suficiente para uma branch, uma spec e um PR revisável;
- tem valor de produto e requisito compreensível;
- possui dependências materiais conhecidas ou explicitamente excluídas;
- pode ser validada por cenários de aceitação independentes;
- evita arquivos compartilhados por outra entrega em andamento;
- não exige resolver antecipadamente todo um módulo futuro.

Registre ao menos o ID do backlog, resultado, responsável quando conhecido, branch/spec, baseline,
dependências, arquivos compartilhados e bloqueios. A pessoa pode propor um recorte; seleção e
prioridade continuam sujeitas à coordenação e às decisões com autoridade aplicável.

## 5. Branch e worktree por funcionalidade

O Spec Kit 1.0.4 deste repositório usa numeração sequencial para diretórios de spec. O formato é
`NNN-slug-em-kebab-case`, por exemplo `002-criar-laboratorio`. A branch é criada manualmente e é
tecnicamente independente do diretório, mas usar o mesmo `NNN-slug` nos dois é a convenção mais
rastreável. Verifique o próximo número; não o deduza apenas do backlog.

Antes de criar uma branch, execute o
[levantamento completo da seção 4.1](#41-levantamento-antes-de-reservar-uma-entrega). Depois do
fetch e da verificação de colisões, confirme especificamente a base:

```bash
git rev-parse development
git rev-parse origin/development
```

Os hashes de `development` e `origin/development` devem coincidir, e a base deve estar limpa e
identificada. Se já houver número, slug, branch, spec ou PR equivalente, pare e coordene com a
equipe.

Para trabalho simples em uma cópia limpa, o exemplo é:

```bash
git switch development
git status --short --branch
git switch -c "<NNN-SLUG>"
```

Use worktree separado quando outra feature já ocupa a cópia principal, quando for preciso manter
dois contextos ativos ou quando o risco de mistura for relevante:

```bash
git worktree add -b "<NNN-SLUG>" \
  "../HidroFlorestas-<NNN-SLUG>" development
cd "../HidroFlorestas-<NNN-SLUG>"
git status --short --branch
git rev-parse HEAD
```

Nunca reutilize diretório ou branch desconhecidos. Não faça checkout sobre a branch de outra
worktree. Se houver alterações locais, identifique autoria e finalidade, preserve-as e crie outro
worktree a partir da base correta; não use `stash`, `reset`, limpeza ou descarte sem autorização.

Combine previamente a propriedade de caminhos globais e compartilhados, especialmente schema e
migrations, autenticação, configuração global, lockfile e componentes usados por várias features.
O mesmo vale para documentação global cuja edição simultânea possa gerar decisões ou estados
incompatíveis.

Após `$speckit-specify`, `.specify/feature.json` aponta localmente para a spec ativa. Ele é estado
operacional ignorado e não deve ser commitado. As etapas seguintes resolvem a feature por esse
arquivo ou por `SPECIFY_FEATURE_DIRECTORY`; confirme o contexto antes de executar outra skill.

## 6. Fluxo completo do Spec Kit

Execute cada etapa pela skill instalada e leia o respectivo `SKILL.md` se o agente não a descobrir
automaticamente. Revise o resultado em checkpoints; a automação não pode inventar decisão de
produto, domínio, ciência, UX ou arquitetura.

### 6.1 `$speckit-specify` — definir o que e por quê

- **Entrada:** descrição confirmada da entrega, resultado para o usuário, limites, fontes e
  decisões aplicáveis; branch e baseline já preparados.
- **Saída:** `specs/<numero-e-slug>/spec.md`, checklist incorporado
  `checklists/requirements.md` e apontador local `.specify/feature.json`.
- **Quando executar:** uma vez para criar a feature ou para refinar a própria spec.
- **Próxima etapa:** siga diretamente para `$speckit-plan` somente quando histórias, requisitos,
  cenários, casos-limite e critérios de sucesso forem testáveis, o checklist estiver consistente e
  não houver ambiguidade material. Se uma ambiguidade material afetar comportamento observável,
  escopo ou critérios de aceitação, siga para `$speckit-clarify`. Se ela depender de decisão da
  equipe que as fontes autorizadas não resolvem, a spec permanece bloqueada até essa decisão.
- **Não pertence à etapa:** escolher stack, desenhar implementação, criar tarefas ou alterar
  código.

A skill gera o próximo número sequencial ao examinar os diretórios em `specs/`. Ela não cria a
branch nesta integração; diretório de spec e branch podem diferir, embora devam permanecer
rastreáveis.

### 6.2 `$speckit-clarify` — resolver ambiguidade material

- **Entrada:** spec existente e contexto das dúvidas.
- **Saída:** respostas registradas incrementalmente em `spec.md` e revalidação do checklist
  incorporado, quando ele existir.
- **Quando executar:** antes do plano, se uma escolha mudar materialmente escopo, aceitação,
  segurança, UX, modelo de dados ou decomposição. A skill pergunta uma questão por vez, até cinco.
- **Avance quando:** as ambiguidades materiais necessárias ao planejamento estiverem resolvidas;
  decisões da equipe estiverem registradas com origem; marcadores bloqueantes tiverem sido
  eliminados ou classificados como fora do recorte; e spec e checklist estiverem consistentes.
- **Não pertence à etapa:** perguntar preferências triviais, decidir detalhes de implementação que
  cabem no plano ou criar uma spec ausente.

Se a spec já estiver clara, esta etapa é condicional. Tornar uma pendência material visível não é
suficiente, por si só, para iniciar o plano técnico. Pular dúvidas materiais aumenta o risco de
retrabalho e não autoriza a IA a escolher por inferência.

### 6.3 `$speckit-plan` — definir como construir e validar

- **Entrada:** spec pronta, constituição, baseline de código e restrições/decisões técnicas
  aplicáveis.
- **Saída:** `plan.md`, `research.md`, `data-model.md`, `contracts/` e `quickstart.md` conforme a
  aplicabilidade. `research.md` registra decisão, justificativa e alternativas consideradas.
- **Quando executar:** depois da especificação e dos esclarecimentos materiais.
- **Avance quando:** o Constitution Check passar antes e depois do desenho, as incógnitas técnicas
  necessárias estiverem resolvidas e a validação ponta a ponta estiver descrita.
- **Não pertence à etapa:** criar `tasks.md`, escrever implementação ou ampliar o resultado da
  spec.

Artefatos não aplicáveis podem ser omitidos, mas `quickstart.md` deve permanecer um guia de
validação executável, sem conter a implementação completa.

### 6.4 `$speckit-tasks` — decompor trabalho executável

- **Entrada:** `spec.md`, `plan.md` e os artefatos de desenho disponíveis.
- **Saída:** `tasks.md` organizado por setup, fundações, histórias de usuário e acabamento, com
  IDs sequenciais, caminhos, dependências, oportunidades `[P]` e critérios de teste independente.
- **Quando executar:** depois de aprovar o plano.
- **Avance quando:** toda história e obrigação construível possuir cobertura, a ordem respeitar as
  dependências e cada tarefa for específica o bastante para execução.
- **Não pertence à etapa:** executar ou marcar tarefas, criar testes não solicitados ou duplicar
  um `TASKS.md` global.

### 6.5 `$speckit-checklist` — revisão opcional da qualidade dos requisitos

Essa skill pode ser usada depois de haver contexto suficiente e antes da implementação quando a
feature exigir revisão adicional de segurança, UX, API ou outro domínio. Ela cria ou acrescenta
um checklist em `checklists/`; não testa a implementação. Os itens começam desmarcados e pertencem
ao revisor. `[x]` significa que a qualidade do requisito foi revisada, não que o código está
pronto. `$speckit-implement` lê esses marcadores como gate e não deve alterá-los.

O `checklists/requirements.md` criado por `$speckit-specify` é uma exceção: sua manutenção cabe às
skills de especificação e esclarecimento.

### 6.6 `$speckit-analyze` — checar consistência antes de implementar

- **Entrada:** `spec.md`, `plan.md`, `tasks.md` completos e constituição.
- **Saída:** relatório em sessão sobre duplicidade, ambiguidade, cobertura, inconsistência e
  violações; nenhum arquivo é modificado.
- **Quando executar:** somente depois de `$speckit-tasks`; é especialmente útil em recortes com
  risco, múltiplas histórias ou decisões sensíveis.
- **Avance quando:** achados críticos forem corrigidos na etapa e no artefato responsáveis; achados
  menores estiverem resolvidos ou aceitos com justificativa.
- **Não pertence à etapa:** corrigir arquivos automaticamente, rebaixar a constituição ou iniciar
  código.

### 6.7 `$speckit-implement` — executar as tarefas aprovadas

- **Entrada:** `tasks.md`, `plan.md`, spec, artefatos de desenho e checklists.
- **Saída:** código, testes e documentação previstos, com tarefas concluídas marcadas `[X]`.
- **Quando executar:** depois de tarefas consistentes e dos gates de checklist. Se algum checklist
  estiver incompleto, a skill deve parar e pedir decisão explícita antes de prosseguir.
- **Avance quando:** todas as tarefas aprovadas forem concluídas e a feature passar por validação
  proporcional ao recorte.
- **Não pertence à etapa:** inventar tarefas fora da lista, alterar intenção, ignorar falha
  sequencial ou marcar trabalho não realizado.

Implemente por fase e por história, em incrementos pequenos. Tarefas `[P]` só são realmente
paralelas quando não dependem de trabalho incompleto e não editam os mesmos arquivos.

### 6.8 Testar e `$speckit-converge`

Execute os cenários do `quickstart.md`, os testes definidos pela feature e os scripts reais
pertinentes. No baseline atual existem:

```bash
npm run lint
npm run build
git diff --check
```

Depois que `$speckit-implement` tiver rodado, use `$speckit-converge` para comparar o estado atual
do código exclusivamente com a spec, o plano e as tarefas, sob a constituição. A skill não compara
branches nem histórico, não altera código, spec ou plano e não reescreve tarefas. Se encontrar
lacunas, acrescenta uma nova fase `Convergence` ao fim de `tasks.md`; se não encontrar, deixa o
arquivo byte a byte inalterado.

Quando forem acrescentadas tarefas, rode novamente `$speckit-implement`, valide e converja. Avance
para revisão somente quando o recorte estiver convergido ou quando pendências remanescentes forem
explicitamente aceitas pela autoridade competente.

### 6.9 Atualização documental

Atualize os artefatos da feature para refletir o resultado real e somente os documentos globais
diretamente afetados e autorizados. Preserve histórico e classificações. Mudança de ordem ou
estado pode exigir atualizar o backlog e o plano global; decisão confirmada pode exigir registro
canônico. Nunca edite `docs/raw/**`.

## 7. Implementação e validação

Siga `tasks.md` e o plano aprovado, mantendo cada incremento verificável por uma história ou
cenário. Para cada fase:

1. confirme entrada, arquivos e dependências;
2. implemente apenas o recorte da tarefa;
3. execute a validação mais próxima e registre o resultado;
4. revise segurança, privacidade e qualidade proporcionais ao módulo;
5. marque `[X]` somente após concluir e verificar a tarefa;
6. registre bloqueios, desvios e decisões sem ampliar escopo silenciosamente.

Falhas ou necessidades fora do recorte viram achado, pendência ou proposta para a equipe; não
viram automaticamente mais código na feature atual. Proteja dados sensíveis e campos
privilegiados, sobretudo em autenticação, administração e evidências de erro.

### Definição prática de pronto

Uma entrega está pronta quando:

- o resultado e todos os cenários de aceitação do recorte foram validados;
- `tasks.md` e implementação estão reconciliados, inclusive após convergência;
- riscos concretos foram tratados ou registrados com impacto e decisão necessária;
- dados sensíveis e campos privilegiados não são expostos;
- lint, build, testes existentes e cenários do quickstart aplicáveis passaram, com resultados
  registrados; qualquer omissão tem justificativa;
- o diff contém somente o escopo autorizado e passa em `git diff --check`;
- documentação diretamente afetada foi atualizada sem alterar evidência histórica;
- dependências, limitações e pendências para a próxima entrega estão explícitas.

## 8. Revisão e entrega

Antes de entregar:

```bash
git status --short --branch
git diff --stat
git diff
git diff --check
```

Rode também as validações definidas na feature. Em seguida, somente após revisar o diff e confirmar
que não há arquivos alheios:

```bash
git add "<CAMINHO-AUTORIZADO-1>" "<CAMINHO-AUTORIZADO-2>"
git diff --cached
git commit -m "<TIPO>: <RESUMO-DA-ENTREGA>"
git push -u origin "<NNN-SLUG>"
```

O PR deve ser pequeno e direcionado a `development`. Descreva o problema, as mudanças, o
comportamento resultante, a rastreabilidade com a spec, evidências de teste, riscos, pendências e
validações não executadas. Solicite revisão humana e trate os comentários na mesma trilha de
evidência.

Não use force push, merge automático ou exclusão destrutiva como padrão. Confirme a integração em
`development` antes de remover branch ou worktree; combine a limpeza com a equipe e preserve
qualquer arquivo local não integrado.

## 9. Decisões: autonomia e consulta à equipe

Dentro de uma spec e um plano aprovados, o desenvolvedor pode escolher detalhes locais e
reversíveis de implementação que respeitem as decisões técnicas vigentes, decompor tarefas,
escrever validações previstas, corrigir defeitos diretamente necessários ao cenário e atualizar a
documentação afetada com evidência observada.

Consulte a equipe antes de:

- mudar resultado, requisito, ator, regra de negócio, critério de aceitação ou fora de escopo;
- definir ciência, domínio, UX ou arquitetura onde haja mais de uma alternativa material;
- adotar nova dependência, serviço, formato persistido, interface pública ou estratégia de deploy;
- alterar schema, autenticação, configuração global ou componente compartilhado em paralelo;
- acessar, compartilhar ou criar credenciais e ambientes;
- escolher entre fontes conflitantes ou declarar uma proposta como decisão;
- aceitar risco relevante, pular gate material ou integrar trabalho incompleto.

Registre a origem. Use `DECISAO_CONFIRMADA` apenas com confirmação e autoridade identificadas;
rotule conclusão derivada como `INFERENCIA` e orientação do agente como `RECOMENDACAO`.

## 10. Como pedir ajuda a uma IA

### IA com acesso direto ao repositório

Peça que ela siga os [limites de autonomia](#9-decisões-autonomia-e-consulta-à-equipe) e comece
pelo [levantamento operacional](#41-levantamento-antes-de-reservar-uma-entrega). Ela deve examinar
os arquivos em vez de presumir seu conteúdo e trabalhar por checkpoints, interrompendo diante de
decisão material ou ação destrutiva não autorizada.

### Chat sem acesso ao repositório

Forneça este guia e apenas os arquivos relevantes, removendo segredos e dados pessoais. O chat não
pode confirmar branch, status, código, integração ou resultados de comandos; deve separar conteúdo
fornecido de evidência que exigiria inspeção local. Use-o para explicar ou gerar o próximo prompt,
nunca para alegar que uma ação local foi executada.

### Prompt curto de entrada

Copie, adapte o trecho entre `<...>` e envie à IA:

```text
Atue como guia passo a passo para eu trabalhar no HidroFlorestas em <OBJETIVO-INICIAL>.
Se necessário, identifique meu sistema operacional e shell. Verifique primeiro Git, Node/npm,
uv, o repositório e as alterações existentes. Instale somente o Spec Kit 1.0.4 se estiver
ausente ou incompatível. O projeto já está inicializado: não execute `specify init`, não altere
.specify/** nem adote OpenSpec.

Leia AGENTS.md, .specify/memory/constitution.md, este developer-guide.md, o PRD Code-First,
o plano de implementação e o backlog. Identifique o estado atual e me ajude a receber ou
escolher uma entrega sem colidir com branches, worktrees, specs ou PRs existentes. Preserve
mudanças locais e diferencie intenção, implementação observada, proposta e inferência.

Forneça somente o próximo checkpoint, com objetivo, comandos seguros e resultado esperado.
Não altere arquivos nem Git sem minha autorização específica para aquele passo. Avise
explicitamente quando spec, plano, tarefas, implementação, validação e entrega forem concluídos.
Se você não tiver acesso ao repositório, diga o que não pode verificar e peça apenas o contexto
mínimo necessário.
```

## 11. Modelos reutilizáveis de prompts

Remova todos os placeholders que não se aplicarem, substitua os demais e confira o escopo antes de
enviar. Os modelos orientam uma etapa por vez; não os combine em uma solicitação de implementação.

### Modelo 1 — criar a spec

```text
Use `$speckit-specify` para criar a especificação de <NUMERO-E-SLUG> —
<NOME-DA-ENTREGA>.

Resultado para o usuário:
<RESULTADO-PARA-O-USUARIO>

Decisões confirmadas, com origem:
<DECISOES_CONFIRMADAS>

Incluído:
<INCLUSO>

Fora do escopo:
<FORA-DO-ESCOPO>

Fontes específicas da feature:
<FONTES-ESPECIFICAS>

Antes de escrever, confirme a raiz, a branch própria, o baseline, o estado Git e a ausência de
colisão. Leia AGENTS.md, a constituição, o backlog, a política de fontes e as fontes acima.
Preserve alterações existentes e diferencie intenção classificada de implementação observada,
proposta e inferência.

Produza histórias de usuário priorizadas e independentemente testáveis, requisitos funcionais,
cenários de aceitação, casos-limite, entidades quando aplicáveis e critérios de sucesso
mensuráveis e independentes de tecnologia. Registre somente ambiguidades materiais que não
tenham resposta autorizada. Execute o checklist de qualidade incorporado da spec e corrija os
itens cabíveis dentro da etapa.

Não planeje, não gere tasks e não implemente. Ao final, relate branch e baseline, diretório da
feature, arquivos gerados ou alterados, resultado do checklist e pendências para esclarecer.
```

### Modelo 2 — criar o plano técnico

```text
Use `$speckit-plan` para planejar <NUMERO-E-SLUG>.

Stack relevante já confirmada ou observada:
<STACK-RELEVANTE>

Restrições técnicas:
<RESTRICOES-TECNICAS>

Riscos conhecidos:
<RISCOS-CONHECIDOS>

Validações esperadas:
<VALIDACOES-ESPERADAS>

Arquivos ou módulos relevantes:
<ARQUIVOS-OU-MODULOS-RELEVANTES>

Antes de planejar, confirme raiz, branch, baseline, feature ativa e que spec e checklist estão
prontos. Leia AGENTS.md, a constituição, a spec e a política de fontes. Inspecione a
implementação atual nos caminhos relevantes; não trate o código como intenção aprovada.

Pesquise somente incógnitas e decisões técnicas necessárias ao recorte. Para cada escolha,
registre decisão, justificativa, alternativas e consequências, sem encerrar decisão de produto,
domínio, ciência, UX ou arquitetura sem autoridade. Produza plan.md, research.md, data-model.md,
contracts/ e quickstart.md quando aplicáveis. Defina contratos, modelo de dados e estratégia de
testes no nível necessário e execute o Constitution Check antes e depois do desenho.

Não gere tasks e não implemente. Ao final, relate gates, pendências, riscos, decisões técnicas e
todos os arquivos gerados ou alterados, identificando os artefatos omitidos por não se aplicarem.
```

## 12. Referências e manutenção do guia

- [Configuração de inicialização](../../../.specify/init-options.json)
- [Estado da integração](../../../.specify/integration.json)
- [Skill de especificação](../../../.agents/skills/speckit-specify/SKILL.md)
- [Skill de esclarecimento](../../../.agents/skills/speckit-clarify/SKILL.md)
- [Skill de planejamento](../../../.agents/skills/speckit-plan/SKILL.md)
- [Skill de tarefas](../../../.agents/skills/speckit-tasks/SKILL.md)
- [Skill de análise](../../../.agents/skills/speckit-analyze/SKILL.md)
- [Skill de implementação](../../../.agents/skills/speckit-implement/SKILL.md)
- [Skill de checklist](../../../.agents/skills/speckit-checklist/SKILL.md)
- [Skill de convergência](../../../.agents/skills/speckit-converge/SKILL.md)

Essas referências são a fonte operacional para Spec Kit 1.0.4. Se divergirem deste guia após uma
atualização autorizada, interrompa o fluxo, preserve o estado e atualize o guia antes de orientar
novas entregas.
