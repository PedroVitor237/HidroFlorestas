# Plano mínimo de implementação

## Objetivo técnico da etapa

Evoluir o baseline atual por entregas verticais pequenas e verificáveis, usando uma spec, um
plano e tarefas próprios para cada funcionalidade. A primeira entrega é **Acesso autenticado
seguro**, limitada ao login, restauração e encerramento de sessão e ao acesso protegido de um
usuário `ACTIVE` previamente cadastrado.

## Arquitetura e stack observadas

`EVIDENCIA_IMPLEMENTACAO` — O repositório contém uma aplicação web full-stack única em
TypeScript, estruturada com Next.js 16.1.6 App Router e React 19.2.4 sob `src/app/`. Route
handlers, serviços e middlewares do backend convivem com a interface no mesmo projeto. A
persistência usa Prisma 7.4.2, PostgreSQL e adapter Neon; a interface usa Tailwind CSS 4.2.1,
Lucide React 1.16.0 e Sonner 2.0.7. Bcrypt 6.0.0 e jsonwebtoken 9.0.3 participam do fluxo de
identidade. As versões foram observadas no lockfile e não constituem, por si, aprovação da
arquitetura futura.

## Módulos identificados

| Módulo | Estado observado |
|---|---|
| Identidade e sessão | Login, cadastro, consulta da sessão e logout possuem conexões estáticas; proteção e restauração são parciais e não foram validadas em runtime. |
| Laboratórios e workspace | Models e interface existem, mas a tela usa estado e conteúdo fixos e não há API de domínio conectada. |
| Áreas e coordenadas | Models e lista visual existem; a lista é mockada, a criação é placeholder e não há API conectada. |
| Coletas | Model e ação visual existem, sem fluxo persistido conectado. |
| Dados ambientais | Models de água, solo, vegetação e terreno existem sem consumidor; não representam contrato científico aprovado. |
| Diagnóstico IHFR | Model existe sem API ou cálculo conectado; ciência, produção e interpretação permanecem abertas. |
| Dashboard e histórico | Composição visual parcial e histórico mockado, sem fonte persistida localizada. |
| Mapa e visualização territorial | Placeholder visual e relações espaciais parciais no schema, sem tecnologia ou interação definidas. |
| Administração de usuários | Middleware e script local existem sem interface administrativa conectada; módulo fora do recorte inicial. |

## Dependências entre módulos

- Identidade e sessão habilitam qualquer rota e contexto autenticado.
- Criação mínima de laboratório depende do contrato de autenticação estabilizado.
- Contexto de laboratório ativo depende do laboratório persistido e do vínculo aplicável.
- Cadastro e consulta de área dependem de autenticação e contexto de laboratório.
- Coleta depende de área acessível; dados ambientais dependem de coleta e de contrato científico
  aplicável.
- Diagnóstico IHFR depende de coleta, dados e decisões científica e arquitetural ainda abertas.
- Dashboard, histórico e mapa consomem os módulos anteriores e não devem defini-los por
  inferência da interface atual.

## Ordem inicial recomendada

1. **Acesso autenticado seguro**.
2. **Criação mínima de laboratório**; sua especificação pode começar em paralelo após a
   estabilização do contrato de autenticação.
3. **Cadastro e consulta de área**, somente depois de autenticação e contexto de laboratório.

Coletas, dados ambientais, diagnóstico IHFR, acompanhamento e mapa entram depois conforme suas
dependências e decisões materiais forem resolvidas.

## Critérios para selecionar entregas

Selecionar recortes que produzam resultado de produto demonstrável, tenham aceitação verificável,
aproveitem o baseline conectado e reduzam risco para a próxima entrega. A feature deve ter
dependências materiais conhecidas, caber em uma branch e uma spec, evitar decisão prematura de
módulos futuros e permitir validação proporcional sem auditoria geral.

## Duas trilhas possíveis de trabalho

### Trilha A — entrega vertical corrente

Um integrante conduz spec, plano, tarefas, implementação e validação da feature selecionada. A
sequência começa por acesso autenticado seguro e preserva o recorte confirmado em `CF-DEL-001`.

### Trilha B — preparação da entrega seguinte

O segundo integrante revisa rastreabilidade, critérios e riscos em arquivos não compartilhados.
Após a estabilização do contrato de autenticação, pode iniciar a spec da criação mínima de
laboratório. Não deve implementar laboratório contra contrato instável nem editar simultaneamente
schema, autenticação, configuração global ou componentes compartilhados pela Trilha A.

## Branches, worktrees e integração

- Usar uma branch e uma spec por funcionalidade; nomes de branch e diretório de spec devem ser
  curtos, em kebab-case, e rastreáveis entre si.
- Criar a branch a partir de `development` limpa e atual. Um worktree separado é opcional para o
  segundo integrante e deve apontar para outra branch, sem compartilhar arquivos em edição.
- Antes de começar, registrar branch, HEAD, upstream, worktrees e alterações preexistentes.
- Integrar por PR pequeno em `development`, com revisão e validações do recorte; atualizar a branch
  com frequência para reduzir divergência.
- Não editar em paralelo schema, autenticação, configuração global ou componentes compartilhados;
  combinar previamente a propriedade desses caminhos.

## Fluxo real do Spec Kit v1.0.4 com Codex

A instalação usa integração Codex baseada em skills em `.agents/skills/` e scripts shell em
`.specify/scripts/bash/`. Não há extensão Git instalada; portanto, a branch ou worktree deve ser
criada manualmente antes do fluxo.

1. `$speckit-specify` cria ou atualiza `specs/<feature>/spec.md`, o checklist de qualidade e o
   apontador local ignorado `.specify/feature.json`.
2. `$speckit-clarify` reduz ambiguidades materiais antes do plano, quando necessário.
3. `$speckit-plan` produz `plan.md` e os artefatos de pesquisa, modelo, contratos e quickstart
   aplicáveis.
4. `$speckit-tasks` gera `tasks.md` executável e organizado por história.
5. `$speckit-checklist` pode acrescentar checklists de qualidade dos requisitos; o revisor é o
   responsável por seus marcadores.
6. `$speckit-analyze` faz análise somente de leitura entre spec, plano e tarefas.
7. `$speckit-implement` executa e marca as tarefas aprovadas.
8. `$speckit-converge` avalia o código contra os artefatos e apenas acrescenta trabalho restante a
   `tasks.md`; `$speckit-taskstoissues` é opcional e cria issues somente mediante autorização e
   correspondência do remote GitHub.

## Definição de pronto

Uma entrega está pronta quando o resultado do recorte e seus cenários de aceitação foram validados,
os riscos concretos foram tratados ou registrados, dados sensíveis e campos privilegiados não são
expostos, as tarefas estão reconciliadas com a implementação, o diff contém somente o escopo
autorizado e a documentação afetada foi atualizada. Comandos executados, resultados, limitações e
verificações omitidas devem constar na entrega.

## Atualização documental após cada entrega

Atualizar a spec e os artefatos da feature com o resultado real; atualizar este plano e o backlog
quando ordem, dependências ou estado mudarem; e ajustar o pacote Code-First afetado com novas
evidências ou decisões confirmadas. Registros globais só mudam quando aplicáveis e autorizados.
Preservar `docs/raw/**`, o histórico e as classificações existentes.

## Guia curto para o segundo integrante

1. Receba uma feature com recorte confirmado ou escolha o próximo item elegível no
   [`backlog.md`](backlog.md), sem antecipar dependências abertas.
2. Parta de `development` limpa e atual; crie uma branch própria ou um worktree ligado a outra
   branch e registre o baseline.
3. Consulte o [PRD Code-First](../README.md), a
   [constituição](../../../.specify/memory/constitution.md) e `specs/<feature>/**`.
4. Leia e siga a skill `speckit-*` correspondente em `.agents/skills/`; prepare a branch
   manualmente, pois a integração instalada não inclui criação automática de branch.
5. Localize comandos reais em `package.json`, nos artefatos da feature e na configuração existente.
   Hoje há `lint` e `build`, mas nenhum script `test`; não invente nem instale um comando para
   completar um gate.
6. Registre dúvidas na spec ou como pendência classificada, com fonte e impacto; não decida por
   inferência.
7. Atualize a documentação afetada após validar a entrega e entregue um PR pequeno com diff,
   comandos, resultados, riscos e limitações.
8. Não edite simultaneamente schema, autenticação, configuração global ou componentes
   compartilhados; combine a propriedade desses caminhos antes de iniciar.
