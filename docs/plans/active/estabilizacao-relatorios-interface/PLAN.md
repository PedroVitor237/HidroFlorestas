# Estabilização, relatórios e preparação da interface

- Identificador: `estabilizacao-relatorios-interface`.
- Estado da fase: `AGUARDANDO_REVISAO`; primeira execução de inspeção e planejamento: `CONCLUIDO`.
- Data de corte preliminar: 2026-10-01, America/Fortaleza.
- Responsável pela execução documental: Codex; responsáveis pelas etapas futuras: não especificado.
- Origem do mandato: solicitação da equipe anexada à conversa em 2026-10-01, intitulada “Estamos iniciando uma nova fase do HidroFlorestas após testes manuais…”.

## Objetivo e limites

Organizar a estabilização após testes manuais, preparar os dois documentos destinados à comunicação acadêmica e avaliar a sequência das melhorias em relação ao Lovable. Esta execução permite somente documentação de planejamento e inspeção preliminar. Código, dependências, configurações, banco, migrations, deploy, merge, relatórios finais e prompt definitivo permanecem fora do escopo.

`DECISAO_CONFIRMADA` — A equipe definiu no pedido desta execução a sequência **organização → mapa → dois relatórios → decisão sobre demais melhorias → melhorias escolhidas e preparação do Lovable → avaliação e integração futura da proposta**. A ordem das demais melhorias em relação ao Lovable continua `EM_AVALIACAO`.

## Estado inicial e organização

`EVIDENCIA_IMPLEMENTACAO` — Branch `development`, commit `8d78d521cadf869379d1e25388ea8fd09fce17d4`; `git status --porcelain=v1` sem alterações no início. Nenhuma troca de branch será feita nesta execução. Não há `AGENTS.md` mais específico localizado no repositório.

O diretório segue [PLANS.md](../../../../PLANS.md), sob `docs/plans/active/`. O nome `PLAN.md` atende à solicitação expressa desta tarefa, como exceção local à convenção geral de kebab-case. Este é um plano transversal; futuras funcionalidades manterão spec, plano e tarefas em `specs/<feature>/**`, pelo fluxo Spec Kit, sem `TASKS.md` global ou artefatos OpenSpec duplicados.

## Fontes e autoridade

Aplicam-se [AGENTS.md](../../../../AGENTS.md), [PROJECT_CONTEXT.md](../../../../PROJECT_CONTEXT.md), [TECH_DECISIONS.md](../../../../TECH_DECISIONS.md), a [constituição](../../../../.specify/memory/constitution.md), a [política Code-First](../../../code-first-prd/governance/source-policy.md) e [SOURCE_AUTHORITY.md](../../../governance/SOURCE_AUTHORITY.md). Código comprova apenas implementação; documentos históricos e relatos preservam seus estados. Hipóteses serão `INFERENCIA`, orientações serão `RECOMENDACAO` e decisões sem autoridade suficiente serão `PENDENCIA_DE_DECISAO`. `docs/raw/` permanece imutável.

## Estado das atividades

| Etapa | Estado | Dependência e entrega |
|---|---|---|
| 0. Organização e análise preliminar | `CONCLUIDO` | Este plano e [análise rastreável](analise-preliminar.md); verificações documentais ao final. |
| 1. Diagnóstico e correção do mapa | `NAO_INICIADO` | Etapa 0; evidência local/publicada e validação das telas afetadas. |
| 2. Dois documentos | `NAO_INICIADO` | Etapa 1; ambiguidades/decisões e relatório acadêmico em Markdown. |
| 3. Seleção das demais melhorias | `NAO_INICIADO` | Etapa 2; decisão registrada sobre sequência e recortes. |
| 4. Melhorias escolhidas e preparação do Lovable | `NAO_INICIADO` | Etapa 3; entregas verificadas e prompt em momento posterior. |
| 5. Avaliação e incorporação da proposta | `NAO_INICIADO` | Etapa 4 e frontend gerado; revisão e integração por recortes. |

## Avaliação e recomendação de sequência

`RECOMENDACAO` — A fase é viável em entregas pequenas. A inspeção localizou a configuração comum aos mapas, os fluxos e contratos afetados pelas melhorias, fontes para ambos os relatórios e referências visuais reais. O frontend gerado exigirá avaliação e adaptação ao projeto; a estimativa de integração permanece aberta até existir uma proposta.

Após a sequência **mapa → relatórios**, a recomendação inicial é: corrigir acesso ao logout e entrada temporal antes do Lovable; incorporar rótulos/ajuda de uso da terra à reformulação; tratar geocodificação e rascunhos em funcionalidades próprias. Essas orientações não são decisões da equipe. Critérios técnicos e estimativas estão na [triagem](analise-preliminar.md#3-triagem-das-demais-melhorias).

## Etapas, dependências e critérios de conclusão

### Etapa 0 — Organização e análise preliminar

Entregáveis desta execução: este `PLAN.md` e `analise-preliminar.md`. Conclusão exige estado Git, limites da inspeção, fatos/hipóteses do mapa, roteiro e evidências necessárias, triagem A–E, fontes dos relatórios, leitura visual das cinco imagens e avaliação do Lovable, com referências conferíveis. Não depende de autorização para nomes rotineiros nem de resolver decisões futuras.

### Etapa 1 — Investigar e corrigir o mapa

Depende da etapa 0 e da próxima execução solicitada. Responsável de engenharia/ambiente: não especificado. Entregáveis futuros: reprodução identificada por ambiente/SHA; diagnóstico sustentado; menor correção necessária; evidência de validação em cadastro, detalhe e mapa territorial. O roteiro detalhado e a matriz de aceite estão na [análise do mapa](analise-preliminar.md#2-mapa-fatos-hipótese-principal-e-diagnóstico-posterior).

Primeiro passo concreto: correlacionar o deployment e commit que exibem a frase com presença/validade de `NEXT_PUBLIC_MAP_TILE_URL` e `NEXT_PUBLIC_MAP_ATTRIBUTION` **no build**, observar se a camada/requisições de tiles existem e comparar com desenvolvimento/build local de produção. Não substituir diagnóstico por um fallback automático ou troca de biblioteca.

Critérios: base visível com atribuição no sucesso; coordenadas/lista e autorização preservadas na falha; evidências de console/rede/layout e configuração sanitizadas; testes focais e regressões proporcionais ao que mudar. Se não houver acesso publicado, documentar validação exclusivamente local e manter a resolução publicada pendente. O fechamento completo dessa etapa depende de demonstrar o resultado no ambiente afetado; uma limitação não pode ser convertida em sucesso.

Se for necessária mudança funcional, seguir o Spec Kit com recorte próprio e rastreabilidade para IMP-003/008, sem duplicar este plano transversal. Se a causa for somente operacional, registrar a correção/configuração e sua evidência no recorte pertinente. Provedor, acesso e responsabilidade de operação são decisões materiais somente se ainda faltarem para a correção escolhida.

### Etapa 2 — Produzir os dois documentos

Depende da etapa 1. Não iniciar reformulação visual para antecipar esta etapa. Responsáveis por elaboração/revisão: não especificado; destinatário do documento de ambiguidades: professor Fábio Mesquita de Souza.

`RECOMENDACAO` — Criar futuramente `docs/reports/estabilizacao-relatorios-interface/ambiguidades-documentais-e-decisoes.md` e `docs/reports/estabilizacao-relatorios-interface/relatorio-academico-do-desenvolvimento.md`. Esses arquivos **não existem como entregáveis desta execução**. Os nomes poderão incorporar a data de corte se forem arquivados como relatórios históricos datados, conforme AGENTS.md.

Documento 1: explicar inconsistências/ambiguidades, consequência prática, alternativas, decisão/origem/justificativa e estado resolvido/provisório/pendente por questão. Partir dos registros existentes, conferir exemplos raw e preservar alternativas, sem atribuição pessoal indevida ou revisão silenciosa de ciência. Critério: cada decisão tem origem verificável, cada exemplo tem localizador, pendências são explícitas e linguagem é compreensível ao destinatário.

Documento 2: reconstruir contexto, objetivos, método, organização, decisões, planejamento, implementação, validações, dificuldades, resultados e pendências. Começar em planos/Spec Kit/decisões; depois commits, PRs (títulos/corpos/comentários/reviews/estado), evidências e diffs selecionados. Critério: corte/data/SHA, distinção planejado–implementado–integrado–validado, resultados históricos com datas/ambientes e contribuições individuais/coletivas sustentadas. Ausência de fonte ou acesso vira limitação, não paralisa as partes independentes.

Fontes, exemplo já confirmado e lacunas estão no [desenho dos relatórios](analise-preliminar.md#4-fontes-e-desenho-dos-relatórios-futuros). No momento de redigir, atualizar o corte e verificar mudanças posteriores ao baseline desta rodada. A revisão humana do conteúdo científico/atribuições ocorrerá sobre os textos concretos, sem transformar a mera redação em aprovação das decisões descritas.

### Etapa 3 — Escolher o recorte das demais melhorias

Depende dos relatórios. Entregável: decisão registrada por item A–E, justificativa e sequência relativa ao Lovable. Usar impacto nos testes, risco de dados, dependências externas, custo e retrabalho. Não basta classificar uma mudança como visual quando ela altera captura, persistência ou permissões.

Critério: itens escolhidos para antes do Lovable separados dos que acompanharão a UI e dos futuros, pendências materiais com responsável quando designado e critérios de aceite definidos. Atualizar este plano preservando a recomendação original no histórico. Não presumir aprovação das sugestões desta análise.

### Etapa 4 — Executar as melhorias escolhidas e preparar o Lovable

Depende da etapa 3. Funcionalidades seguirão as skills `speckit-*` instaladas em `.agents/skills/`, cada uma com spec/plano/tarefas e referências Code-First pertinentes. Não há invocação de skill de implementação nesta execução de planejamento transversal.

Entregáveis futuros: melhorias selecionadas verificadas, inventário completo de telas/campos/estados/permissões/contratos, dicionário e paleta rastreáveis e prompt definitivo para o Lovable no momento apropriado. Reutilizar a [inspeção visual e técnica](analise-preliminar.md#5-lovable-viabilidade-referências-reais-e-limites), completando-a no commit então vigente.

Critério: prompt descreve capacidades reais, restrições e estados; hierarquia lógica/decisões e estilo login/cadastro → imagens preservada; sem novas regras de negócio, backend, permissões ou capacidades fictícias. Orientação sem neon fundamentada na paleta real. Revisar contratos e proposta de compartilhamento de contexto antes do uso externo; esta tarefa não envia material ao Lovable.

### Etapa 5 — Avaliar e incorporar a proposta de frontend

Depende do frontend gerado e de sua avaliação. Entregáveis futuros: comparação funcional/visual, lacunas e ajustes, integração em incrementos revisáveis, testes pertinentes e atualização documental do que de fato mudar.

Critério: compatibilidade com Next.js/App Router, autenticação e API reais; nenhuma regressão em autorização, idempotência, instantes/fusos, imutabilidade e IHFR experimental; UI responsiva/acessível com estados reais; revisão antes de integração. Merge/deploy dependem do mandato futuro correspondente e não fazem parte desta primeira execução.

## Questões pendentes e riscos materiais

Todas as questões abaixo são `PENDENCIA_DE_DECISAO` ou lacunas de evidência conforme indicado; responsáveis e prazos: não especificado. Não são novos IDs do registro canônico global.

| ID local | Questão e evidência necessária | Momento/impacto |
|---|---|---|
| FASE-01 | Evidência: qual domínio/deployment/SHA apresentou o problema e quais variáveis públicas estavam válidas no build? Existe provedor aprovado de produção, atribuição e acesso operacional? | Necessário para concluir o mapa publicado; diagnóstico estático já concluído. Não reabrir escolha de provedor se houver decisão suficiente. |
| FASE-02 | Decisão de produto/integração: serviço e contrato de preenchimento Município/UF, proteção de valores manuais e escopo de localização compartilhada. | Somente se B for selecionado; não bloqueia mapa/relatórios. |
| FASE-03 | Decisão de captura: sugestão inicial de horário, precisão e edição/declaração de fuso, compatíveis com FR-015 da IMP-004. | Antes de implementar C; não mudar o instante silenciosamente. |
| FASE-04 | Conteúdo: quais descrições de uso da terra podem ser extraídas das definições existentes e quais exigem validação de domínio? | Rótulos têm fonte; definições/limiares novos continuam pendentes. |
| FASE-05 | Decisão de produto/dados: dono, compartilhamento, retenção, concorrência, retomada e promoção de rascunhos. | Nova feature E; não liberar incompletos ao IHFR. |
| FASE-06 | Decisão de recorte: itens A–E escolhidos para antes/junto/depois do Lovable e escopo de telas da primeira proposta. | Etapa 3; recomendações atuais não equivalem a aprovação. |
| FASE-07 | Evidência/autoria: completar amostragem de PRs e diffs, reconciliação dos snapshots e fontes de contribuições; conferir expectativas acadêmicas de formato se fornecidas. | Durante os relatórios; Markdown já definido, sem bloquear por ausência de modelo institucional. |

Riscos principais: confundir desenvolvimento local com build de produção; interpretar testes de fallback como prova de tiles reais; sobrescrever entrada manual após geocodificação; deslocar instantes por UTC/fuso; tratar rascunho como confirmado; transportar funcionalidades ilustradas no Figma para o produto sem decisão; atribuir validação científica a testes técnicos. Mitigações concretas constam na análise.

Pendências históricas globais permanecem com sua autoridade e recorte. Não se tornam gates gerais desta fase. Nenhuma decisão científica, domínio ou arquitetura foi aprovada nesta execução.

## Revisão humana e continuidade

Esta execução termina com a entrega documental; etapas 1–5 não foram iniciadas. Na continuação, rotina de arquivos e nomes não exige nova consulta. Decisões materiais serão registradas e partes independentes seguirão avançando, conforme o mandato.

Revisão humana será necessária quando a solução depender de novo provedor/custo, política de captura, conteúdo científico, produto/persistência de rascunho, ou alteração de escopo/contrato que as fontes não resolvam. O responsável revisará a alternativa e suas evidências concretas. O plano não cria aprovação adicional para investigação de leitura já autorizada na etapa futura.

## Arquivos afetados e registros canônicos

Somente este diretório de planejamento foi criado:

- `PLAN.md`: mandato, sequência, dependências, critérios, pendências e estado.
- `analise-preliminar.md`: evidências estáticas, roteiro do mapa, triagem, fontes dos relatórios e referências visuais.

Os registros canônicos foram consultados e preservados. Não houve decisão técnica nova confirmada que exija reescrever `TECH_DECISIONS.md` ou resolver `PENDING_DECISIONS.md`. As divergências temporais localizadas estão registradas na análise. Se as etapas futuras mudarem decisão ou estado de artefato canônico, atualizar os registros aplicáveis dentro do escopo então autorizado, preservando histórico; não fazer uma reconciliação global nesta rodada.

## Verificação desta entrega

- Estado inicial: `git status --porcelain=v1` limpo; `git rev-parse HEAD` e branch registrados.
- Inspeção estática e visual concluída no alcance descrito na análise; nenhuma afirmação de revisão integral.
- GitHub: consultas somente leitura de metadados, amostra de descrições/comentários e reviews; PRs acessíveis, lacunas de profundidade explícitas.
- Verificação final: **PASS** — 83 links locais (incluindo âncoras) conferidos por script Python, sem alvo ausente; revisão textual dos dois arquivos concluída. `git diff --check` sem ocorrência; `git diff --no-index --check -- /dev/null <arquivo>` sem mensagem de whitespace nos dois arquivos novos (código 1 representa diferença contra arquivo vazio). `git diff HEAD --name-only` vazio; `git ls-files --others --exclude-standard` lista somente os dois documentos; branch `development` e HEAD inicial preservados. `docs/raw/`, código, configurações e dependências permanecem sem mudanças.
- Não executados: testes de aplicação, lint/typecheck/build, E2E, migrations, banco, reprodução local/publicada ou deploy. Alterações exclusivamente documentais; executar runners de aplicação seria desproporcional e poderia preparar/remover fixtures.
- Bloqueios desta primeira execução: nenhum. Acesso/configuração/evidências publicados e decisões dos itens futuros permanecem pendentes para suas etapas.

## Histórico

| Data | Evento |
|---|---|
| 2026-10-01 | Plano aberto; estado inicial registrado; leitura de governança e inspeção estática em andamento. |
| 2026-10-01 | Análise preliminar concluída: pista de configuração do mapa, triagem A–E, fontes dos relatórios e cinco imagens examinadas; fase aguarda revisão/continuação, sem executar correções ou relatórios. |
| 2026-10-01 | Verificação documental final aprovada: referências locais, whitespace, escopo e baseline Git preservados; encerrada somente a etapa 0. |
