# Estabilização, relatórios e preparação da interface

- Identificador: `estabilizacao-relatorios-interface`.
- Estado da fase: `EM_ANDAMENTO`; primeira execução de inspeção e planejamento: `CONCLUIDO`; mapa resolvido conforme validação manual relatada pelo solicitante; etapa 2 concluída documentalmente; etapa 4 concluída com melhorias integradas e material Lovable preparado em 02/10. Etapa 5 iniciada com inspeção e handoff documental; geração externa parcial, sem telas prontas para revisão de integração.
- Data de corte dos relatórios: 2026-10-01, America/Fortaleza; baseline desta continuação `6832868`. O baseline preliminar anterior permanece no histórico.
- Responsável pela execução documental: Codex; responsáveis pelas etapas futuras: não especificado.
- Origem do mandato: solicitação da equipe anexada à conversa em 2026-10-01, intitulada “Estamos iniciando uma nova fase do HidroFlorestas após testes manuais…”.

## Objetivo e limites

Organizar a estabilização após testes manuais, preparar os dois documentos destinados à comunicação acadêmica e avaliar a sequência das melhorias em relação ao Lovable. A primeira execução permitiu somente documentação de planejamento e inspeção preliminar. O mandato adicional de 01/10 autoriza commit dos documentos existentes, investigação e menor correção comprovada do mapa, com atualização deste plano e da análise. Na rodada anterior, deploy de produção, relatórios e demais melhorias permaneceram fora do escopo; não houve alteração de código, dependências, banco ou configurações. A continuação atual autoriza os dois relatórios e a atualização deste plano/análise, preservando as exclusões de implementação e do prompt definitivo do Lovable.

`DECISAO_CONFIRMADA` — A equipe definiu no pedido desta execução a sequência **organização → mapa → dois relatórios → decisão sobre demais melhorias → melhorias escolhidas e preparação do Lovable → avaliação e integração futura da proposta**. A ordem estava `EM_AVALIACAO` naquela execução; foi confirmada na continuação pré-Lovable abaixo.

## Estado inicial da primeira execução e organização

`EVIDENCIA_IMPLEMENTACAO` — Branch `development`, commit `8d78d521cadf869379d1e25388ea8fd09fce17d4`; `git status --porcelain=v1` sem alterações no início. Nenhuma troca de branch será feita nesta execução. Não há `AGENTS.md` mais específico localizado no repositório.

O diretório segue [PLANS.md](../../../../PLANS.md), sob `docs/plans/active/`. O nome `PLAN.md` atende à solicitação expressa desta tarefa, como exceção local à convenção geral de kebab-case. Este é um plano transversal; futuras funcionalidades manterão spec, plano e tarefas em `specs/<feature>/**`, pelo fluxo Spec Kit, sem `TASKS.md` global ou artefatos OpenSpec duplicados.

## Fontes e autoridade

Aplicam-se [AGENTS.md](../../../../AGENTS.md), [PROJECT_CONTEXT.md](../../../../PROJECT_CONTEXT.md), [TECH_DECISIONS.md](../../../../TECH_DECISIONS.md), a [constituição](../../../../.specify/memory/constitution.md), a [política Code-First](../../../code-first-prd/governance/source-policy.md) e [SOURCE_AUTHORITY.md](../../../governance/SOURCE_AUTHORITY.md). Código comprova apenas implementação; documentos históricos e relatos preservam seus estados. Hipóteses serão `INFERENCIA`, orientações serão `RECOMENDACAO` e decisões sem autoridade suficiente serão `PENDENCIA_DE_DECISAO`. `docs/raw/` permanece imutável.

## Estado das atividades

| Etapa | Estado | Dependência e entrega |
|---|---|---|
| 0. Organização e análise preliminar | `CONCLUIDO` | Este plano e [análise rastreável](analise-preliminar.md); verificações documentais ao final. |
| 1. Diagnóstico e correção do mapa | `CONCLUIDO` no alcance do relato manual | Em 01/10, o solicitante confirmou OpenStreetMap em produção, configuração das duas variáveis na Vercel e mapa funcionando no site. Sem inspeção direta da Vercel ou comprovação individual das três telas pelo agente. Ver seção 8 da análise. |
| 2. Dois documentos | `CONCLUIDO` documentalmente | Dois relatórios datados produzidos, conferidos e entregues para revisão de conteúdo científico e atribuições; links na seção de encerramento desta continuação. |
| 3. Seleção das demais melhorias | `CONCLUIDO` | Etapa 2; decisão registrada sobre sequência e recortes. |
| 4. Melhorias escolhidas e preparação do Lovable | `CONCLUIDO` | PR #31 presente em development; [prompt autossuficiente](lovable-prompt.md) e [fontes/notas de integração](lovable-integration-notes.md) revisados em 02/10. |
| 5. Avaliação e incorporação da proposta | `EM_ANDAMENTO` somente na inspeção documental | [Handoff](lovable-handoff.md): main do Lovable em `d4cf1e5f28322132e094c0c0016c3ad531be7404`, estrutura inicial e home placeholder; telas ainda não prontas. Retomar geração por recortes; incorporação por outro desenvolvedor permanece futura. |

## Avaliação e recomendação de sequência

`RECOMENDACAO` — A fase é viável em entregas pequenas. A inspeção localizou a configuração comum aos mapas, os fluxos e contratos afetados pelas melhorias, fontes para ambos os relatórios e referências visuais reais. O frontend gerado exigirá avaliação e adaptação ao projeto; a estimativa de integração permanece aberta até existir uma proposta.

Após a sequência **mapa → relatórios**, a recomendação inicial é: corrigir acesso ao logout e entrada temporal antes do Lovable; incorporar rótulos/ajuda de uso da terra à reformulação; tratar geocodificação e rascunhos em funcionalidades próprias. Essas orientações não são decisões da equipe. Critérios técnicos e estimativas estão na [triagem](analise-preliminar.md#3-triagem-das-demais-melhorias).

## Etapas, dependências e critérios de conclusão

### Etapa 0 — Organização e análise preliminar

Entregáveis desta execução: este `PLAN.md` e `analise-preliminar.md`. Conclusão exige estado Git, limites da inspeção, fatos/hipóteses do mapa, roteiro e evidências necessárias, triagem A–E, fontes dos relatórios, leitura visual das cinco imagens e avaliação do Lovable, com referências conferíveis. Não depende de autorização para nomes rotineiros nem de resolver decisões futuras.

### Etapa 1 — Investigar e corrigir o mapa

Roteiro original preservado; o estado atual é o encerramento pelo relato manual registrado na continuação ao final. Dependia da etapa 0 e da execução solicitada. Responsável de engenharia/ambiente: não especificado. Entregáveis futuros: reprodução identificada por ambiente/SHA; diagnóstico sustentado; menor correção necessária; evidência de validação em cadastro, detalhe e mapa territorial. O roteiro detalhado e a matriz de aceite estão na [análise do mapa](analise-preliminar.md#2-mapa-fatos-hipótese-principal-e-diagnóstico-posterior).

Primeiro passo concreto: correlacionar o deployment e commit que exibem a frase com presença/validade de `NEXT_PUBLIC_MAP_TILE_URL` e `NEXT_PUBLIC_MAP_ATTRIBUTION` **no build**, observar se a camada/requisições de tiles existem e comparar com desenvolvimento/build local de produção. Não substituir diagnóstico por um fallback automático ou troca de biblioteca.

Critérios: base visível com atribuição no sucesso; coordenadas/lista e autorização preservadas na falha; evidências de console/rede/layout e configuração sanitizadas; testes focais e regressões proporcionais ao que mudar. Se não houver acesso publicado, documentar validação exclusivamente local e manter a resolução publicada pendente. O fechamento completo dessa etapa depende de demonstrar o resultado no ambiente afetado; uma limitação não pode ser convertida em sucesso.

Se for necessária mudança funcional, seguir o Spec Kit com recorte próprio e rastreabilidade para IMP-003/008, sem duplicar este plano transversal. Se a causa for somente operacional, registrar a correção/configuração e sua evidência no recorte pertinente. Provedor, acesso e responsabilidade de operação são decisões materiais somente se ainda faltarem para a correção escolhida.

### Etapa 2 — Produzir os dois documentos

Depende da etapa 1. Não iniciar reformulação visual para antecipar esta etapa. Responsáveis por elaboração/revisão: não especificado; destinatário do documento de ambiguidades: professor Fábio Mesquita de Souza.

Entregáveis de 01/10: [ambiguidades documentais e decisões](../../../reports/estabilizacao-relatorios-interface/2026-10-01-ambiguidades-documentais-e-decisoes.md) e [relatório acadêmico do desenvolvimento](../../../reports/estabilizacao-relatorios-interface/2026-10-01-relatorio-academico-do-desenvolvimento.md). Foram adotados nomes datados conforme AGENTS.md. A recomendação original previa esses dois temas, ainda sem arquivos na primeira rodada.

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
| FASE-01 | Encerrada para continuidade pelo relato manual de 01/10: OSM escolhido, variáveis configuradas e mapa publicado funcionando. Deployment/SHA, configuração efetiva e evidências individuais das três telas não coletados. | Não bloqueia os relatórios; não equivale à execução integral da matriz técnica pelo agente. Origem e limites na seção 8 da análise. |
| FASE-02 | Decisão de produto/integração: serviço e contrato de preenchimento Município/UF, proteção de valores manuais e escopo de localização compartilhada. | Somente se B for selecionado; não bloqueia mapa/relatórios. |
| FASE-03 | Decisão de captura: sugestão inicial de horário, precisão e edição/declaração de fuso, compatíveis com FR-015 da IMP-004. | Antes de implementar C; não mudar o instante silenciosamente. |
| FASE-04 | Conteúdo: quais descrições de uso da terra podem ser extraídas das definições existentes e quais exigem validação de domínio? | Rótulos têm fonte; definições/limiares novos continuam pendentes. |
| FASE-05 | Decisão de produto/dados: dono, compartilhamento, retenção, concorrência, retomada e promoção de rascunhos. | Nova feature E; não liberar incompletos ao IHFR. |
| FASE-06 | Decisão de recorte: itens A–E escolhidos para antes/junto/depois do Lovable e escopo de telas da primeira proposta. | Etapa 3; recomendações atuais não equivalem a aprovação. |
| FASE-07 | Pesquisa documental concluída no recorte: 30 PRs, histórico e diffs selecionados; contribuições e divergências temporais explicitadas. Resta revisão humana das atribuições e eventual adequação institucional. | Relatórios entregues; pesquisa não exaustiva e sem entrevistas ou revisão científica. |

Riscos principais: confundir desenvolvimento local com build de produção; interpretar testes de fallback como prova de tiles reais; sobrescrever entrada manual após geocodificação; deslocar instantes por UTC/fuso; tratar rascunho como confirmado; transportar funcionalidades ilustradas no Figma para o produto sem decisão; atribuir validação científica a testes técnicos. Mitigações concretas constam na análise.

Pendências históricas globais permanecem com sua autoridade e recorte. Não se tornam gates gerais desta fase. Na primeira execução, nenhuma decisão científica, de domínio ou arquitetura foi aprovada. Na continuação atual, a escolha operacional de OSM foi confirmada pelo solicitante, sem nova aprovação científica.

## Revisão humana e continuidade

A primeira execução terminou com a entrega documental, sem iniciar etapas 1–5. Na continuação atual, o mapa foi encerrado no alcance do relato do solicitante e a etapa 2 foi concluída documentalmente; etapas 3–5 permanecem não iniciadas. Na continuação, rotina de arquivos e nomes não exige nova consulta. Decisões materiais serão registradas e partes independentes seguirão avançando, conforme o mandato.

Revisão humana será necessária quando a solução depender de novo provedor/custo, política de captura, conteúdo científico, produto/persistência de rascunho, ou alteração de escopo/contrato que as fontes não resolvam. O responsável revisará a alternativa e suas evidências concretas. O plano não cria aprovação adicional para investigação de leitura já autorizada na etapa futura.

## Arquivos afetados e registros canônicos

Na primeira execução, somente este diretório de planejamento foi criado; os arquivos e pendências da continuação atual estão registrados ao final:

- `PLAN.md`: mandato, sequência, dependências, critérios, pendências e estado.
- `analise-preliminar.md`: evidências estáticas, roteiro do mapa, triagem, fontes dos relatórios e referências visuais.

Os registros canônicos foram consultados e preservados. Naquela primeira entrega, não houve decisão técnica nova confirmada que exigisse reescrever `TECH_DECISIONS.md` ou resolver `PENDING_DECISIONS.md`. A confirmação atual de OSM e a necessidade posterior de reconciliação estão registradas ao final. As divergências temporais localizadas estão registradas na análise. Se as etapas futuras mudarem decisão ou estado de artefato canônico, atualizar os registros aplicáveis dentro do escopo então autorizado, preservando histórico; não fazer uma reconciliação global nesta rodada.

## Verificação histórica da primeira entrega

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


## Continuação de 01/10/2026 — mapa prioritário

`DECISAO_CONFIRMADA` — A equipe autorizou esta continuação exclusivamente para investigar/corrigir o mapa, começando pelo commit do planejamento e proibindo deploy de produção. O encerramento documental anterior acima permanece como histórico, não como estado atual da etapa 1.

- Estado inicial reconferido: `development@8d78d521cadf869379d1e25388ea8fd09fce17d4`; somente os dois documentos preexistentes não rastreados. Commit solicitado concluído: `6832868`; sem push/merge/troca de branch.
- `EVIDENCIA_IMPLEMENTACAO`: produção sem par aceito de variáveis não monta tiles; seleção de coordenadas, recentralização e marcadores preservados. Reprodução local dos componentes reais distingue zero requisições por ausência de configuração de erro HTTP 503 com camada presente.
- `INFERENCIA`: configuração ausente/inválida incorporada ao build continua a hipótese para o incidente publicado; não foi acessado seu ambiente de build. Não atribuir falha ao provedor.
- Deployment GitHub identificado: Production `6718512946`, SHA inicial acima; URL específica protegida pela Vercel. Domínio público candidato `hidro-florestas.vercel.app` leva às páginas de login sem sessão. Alias/SHA e URL realmente afetada ainda não correlacionados.
- Correção preparada: roteiro Vercel para `NEXT_PUBLIC_MAP_TILE_URL` e `NEXT_PUBLIC_MAP_ATTRIBUTION` nos ambientes corretos, valores conforme provedor aprovado, reconstrução e validação autenticada. Não foi localizado provedor aprovado para produção; OSM continua apenas fallback local. Configuração remota não alterada. Menor intervenção permanece operacional, sem contornar a exigência no componente.
- Validação: quatro cenários de browser isolado (desenvolvimento, produção ausente, produção configurada e falha de tiles); seis casos do helper; dois arquivos unitários focais PASS em Node 22.23.2, com ressalva da engine do projeto. Nos cenários de sucesso, zero erros de console; 503 deliberados no cenário de falha. Não foram validadas as páginas completas, dados persistidos ou tiles de provedor real.
- Limitações: sem painel/token Vercel e sem sessão autenticada das telas; nenhum acesso Prisma/Neon realizado. Checks de código/build completo e suítes de banco/E2E não executados, pois não houve mudança de código e as suítes de telas alteram fixtures. Nada foi publicado.
- Arquivos alterados nesta continuação: apenas `PLAN.md` e `analise-preliminar.md`. Registros canônicos, `docs/raw/`, código e arquivos de ambiente preservados. Não há nova decisão técnica confirmada para promover aos registros globais.
- FASE-01 permanece aberta: confirmar URL/provedor; inspecionar configuração efetiva do build; aplicar o par aprovado; publicar novo build pelo operador e comprovar cadastro/detalhe/territorial no site. Etapa 1 não pode ser marcada concluída; etapas 2–5 não iniciadas.

Evidências, comandos, limites e instruções exatas de operação disponíveis na [seção 7 da análise](analise-preliminar.md#7-investigação-do-mapa--execução-de-2026-10-01). Estado desta rodada: investigação disponível para revisão; configuração/rebuild e resolução publicada pendentes. As verificações documentais finais são registradas na própria análise.


## Continuação de 01/10/2026 — confirmação do mapa e relatórios

`DECISAO_CONFIRMADA` — Origem: solicitação do usuário nesta conversa em 2026-10-01. OpenStreetMap foi escolhido para produção. O usuário autorizou a elaboração dos dois relatórios e proibiu iniciar logout, Município/UF, data/hora, uso da terra, rascunhos ambientais e prompt definitivo do Lovable.

`FATO_DOCUMENTADO` — O solicitante relatou ter configurado `NEXT_PUBLIC_MAP_TILE_URL` e `NEXT_PUBLIC_MAP_ATTRIBUTION` na Vercel para Production e confirmou o mapa funcionando no site publicado. Trata-se de **validação manual relatada pelo solicitante**. O agente não inspecionou o painel Vercel nem verificou diretamente cadastro, detalhe e mapa territorial nesta continuação. Não foram informados deployment/SHA, valores efetivos, navegador ou evidências individuais das três telas. O relato encerra o incidente para continuidade desta fase; não equivale ao cumprimento demonstrado de toda a matriz técnica anterior.

Baseline desta continuação: `development@68328682cf2990d787b596493999330602e63cd3`. Worktree inicialmente com modificações preexistentes somente em `PLAN.md` e `analise-preliminar.md` (investigação do mapa); preservadas, com cópia temporária para comparação. Os outros worktrees existentes não serão alterados. Nenhum commit, push ou deploy integra este mandato.

FASE-01 deixa de bloquear os relatórios. A escolha de provedor e o funcionamento publicado estão confirmados no alcance acima; evidências técnicas detalhadas permanecem não coletadas. `TECH_DECISIONS.md` (`TD-008`), `PENDING_DECISIONS.md` (`PD-007`) e o snapshot da política Code-First ainda refletem o estado anterior: é necessária atualização canônica posterior com esta origem, sem confundir relato operacional com inspeção direta. Os caminhos globais permanecem preservados neste recorte.

Etapa 2 iniciada: leitura de planejamento, decisões, Spec Kit e PRD Code-First antes da apuração de Git/PRs; exemplos de ambiguidades serão reconferidos no corpus original. Registros anteriores deste plano e da análise descrevem suas respectivas rodadas, inclusive pendências agora superadas.


## Encerramento documental da etapa 2 — 01/10/2026

Estado: `CONCLUIDO` quanto à elaboração e conferência dos dois relatórios; conteúdo entregue para revisão humana. A fase permanece `EM_ANDAMENTO`, com etapas 3–5 `NAO_INICIADO`. Não foram iniciadas melhorias de logout, Município/UF, data/hora, uso da terra ou rascunhos ambientais, nem produzido prompt definitivo do Lovable.

### Entregáveis e fontes

- [Relatório de ambiguidades e decisões para o professor Fábio](../../../reports/estabilizacao-relatorios-interface/2026-10-01-ambiguidades-documentais-e-decisoes.md): exemplos reconferidos no corpus original, decisões/origens/justificativas e alternativas, recorte experimental e pauta de pendências.
- [Relatório acadêmico do desenvolvimento](../../../reports/estabilizacao-relatorios-interface/2026-10-01-relatorio-academico-do-desenvolvimento.md): contexto, método, evolução, entregas, decisões, validações, dificuldades e contribuições sustentadas até o corte.
- Este plano e a [análise, seção 9](analise-preliminar.md#9-entrega-dos-relatórios--2026-10-01): estados e roteiro atualizados, sem substituir o histórico das duas rodadas anteriores.

Leitura iniciada por planos, TECH_DECISIONS/ADR, governança, constituição, specs 001–010 e PRD Code-First. Depois, histórico Git, metadados/corpos/comentários/reviews dos PRs #1–#30 e diffs selecionados. As auditorias consolidadas e temáticas orientaram o confronto com raw. Fontes e limites específicos estão vinculados nos relatórios; nenhuma revisão integral de todas as linhas do código ou de todos os achados históricos é alegada.

### Verificações e limites desta continuação

- Baseline: `development@68328682cf2990d787b596493999330602e63cd3`; modificações preexistentes apenas nos dois arquivos do plano, preservadas. Cópias temporárias foram guardadas antes da edição para comparação. Nenhum outro worktree foi alterado.
- Git: histórico de autores/committers, `git show`/`git diff` focais e ancestralidade. Merges #1–#29 são ancestrais do HEAD; `8d78d52` é ancestral do merge #30 `cf6a7bd`, e as duas árvores coincidem. #30 está integrado à main conforme API; não é ancestral deste HEAD de development. Nenhum merge, commit, push ou deploy foi realizado nesta continuação.
- GitHub: lista de 30 PRs e conexões de comentários/reviews sem próxima página; zero reviews formais retornados, comentários do bot Vercel. A conexão inicial restrita falhou e foi repetida com rede autorizada. A primeira consulta GraphQL excedeu limite de nós; consulta reduzida concluiu. Corpos antigos de #29/#30 ainda dizem “aberto/não mesclado”; campos de integração e Git foram usados para o estado atual.
- Integridade: SHA-256 dos 13 arquivos raw conferidos contra DOCUMENT_REGISTER, todos coincidentes. O corpus permanece sem edição.
- Verificação documental final: **PASS** — script Python temporário conferiu os quatro documentos, 162 referências locais (incluindo âncoras), cercas Markdown, IDs de decisões/achados e os PRs citados contra a consulta GitHub. Revisão textual de classificações, estados, atribuições e limites concluída. `git diff --check` sem erros; `git diff --no-index --check /dev/null <relatório>` sem mensagem de whitespace nos dois novos arquivos (exit 1 pela diferença contra arquivo vazio). Os anexos preexistentes de investigação/confirmação permanecem integralmente preservados. Branch/HEAD inalterados; escopo final: dois arquivos atualizados e dois relatórios novos, sem código, ambiente, dependências, registros globais ou raw no diff. Links GitHub foram confrontados com a consulta; fontes web externas preexistentes da análise não foram reconsultadas nesta rodada.
- Não executados: aplicação, banco, migrations, testes unitários/integração/E2E, lint/typecheck/build, navegador autenticado, painel Vercel e deploy. A alteração é exclusivamente documental; resultados de testes antigos são fontes, não novas execuções.

### Pendências remanescentes e próximo passo

- `PENDENCIA_DE_DECISAO`: revisão especializada, calibração, vetores e campo do IHFR conforme PD-002; nenhuma promoção científica neste fechamento.
- Revisão humana dos textos, contribuições e eventual formato institucional. Não há evidência suficiente para atribuir todo o desenvolvimento, decisões coletivas ou autoria científica a uma só pessoa.
- Atualização canônica posterior de TD-008/PD-007 e referências afetadas pela escolha OSM, preservando a origem da confirmação e o limite da validação manual relatada. Avaliar inclusão dos relatórios no DOCUMENT_REGISTER. Esses caminhos permanecem fora das edições desta entrega; não foram criados novos IDs globais.
- Divergências de snapshots e checkboxes, especialmente backlog global e IMP-008, são apontadas, sem reabrir auditoria geral nem marcar tarefas por inferência.
- `RECOMENDACAO`: revisar os relatórios e passar à etapa 3 para selecionar os recortes das melhorias. A recomendação anterior sobre logout/entrada temporal continua orientação, sem aprovação presumida. Prompt Lovable permanece posterior.

Não há bloqueio da entrega documental. O relato do mapa foi suficiente para continuar a fase, sem declarar inspeção direta da Vercel ou aceite individual das três telas. Ciência, validação humana, recortes futuros e reconciliação global mantêm seus limites próprios.

| Data | Evento adicional do histórico |
|---|---|
| 2026-10-01 | Estado inicial reconferido e alterações preexistentes preservadas; relato de OSM/configuração/funcionamento registrado como confirmação do solicitante. |
| 2026-10-01 | Dois relatórios produzidos com fontes locais, Git e PRs; etapa 2 concluída documentalmente e entregue para revisão; demais melhorias não iniciadas. |

## Continuação editorial — versões autossuficientes para leitura humana

- Estado: `CONCLUIDO` quanto à redação e revisão editorial; corte histórico preservado em 01/10/2026. Conteúdo científico e atribuições continuam sujeitos à apreciação humana já prevista.
- Origem: pedido do usuário anexado à conversa, iniciado por “Crie versões autossuficientes e destinadas à leitura humana dos dois relatórios”. Autoriza dois arquivos novos no diretório dos relatórios e atualização deste plano; exige manter intactos os dois relatórios anteriores.
- Baseline reconferido: `development@68328682cf2990d787b596493999330602e63cd3`; PLAN.md e analise-preliminar.md já modificados, dois relatórios documentais já existentes e ainda não rastreados. Hashes dos arquivos preexistentes e de raw guardados em registro temporário para conferência; nenhuma troca de branch.
- Etapas: leitura integral dos dois relatórios; recuperação focal de explicações nas fontes; redação independente para cada público; revisão editorial e de fidelidade; verificação de escopo, integridade e whitespace.
- Entregáveis previstos: `2026-10-01-ambiguidades-ihfr-versao-para-leitura.md` e `2026-10-01-relatorio-academico-versao-para-leitura.md`. O primeiro prioriza questões que afetam interpretação ambiental e cálculo; o segundo organiza atividades, resultados e aprendizado como relatório de extensão/estágio, sem inventar dados institucionais.
- Critérios: introdução própria, explicações completas, ausência de links/caminhos/códigos internos e remissões obrigatórias, termos técnicos explicados, atribuições qualificadas e distinção natural entre planejado, implementado, integrado e validado. Por instrução editorial explícita do usuário, as classificações e os quatro qualificadores experimentais serão expressos em linguagem comum nos novos textos, com o mesmo sentido e sem promoção de autoridade.
- Limites: nenhuma atualização do corte histórico, nova validação científica, pesquisa externa ampliada, implementação, banco, publicação ou avanço ao Lovable. A análise preliminar e os relatórios-base permanecem intocados nesta continuação.

### Resultado da continuação editorial

- [Ambiguidades IHFR — versão para leitura](../../../reports/estabilizacao-relatorios-interface/2026-10-01-ambiguidades-ihfr-versao-para-leitura.md): introdução própria; explicação de pesos, transformação de medições, ausências, qualidade, classes, categorias de uso, solo exposto, APP e separação entre coleta e diagnóstico. Cada tema apresenta alternativas, encaminhamento e limite científico; a pauta final permite manifestação dos especialistas sem acesso a arquivos externos.
- [Relatório acadêmico — versão para leitura](../../../reports/estabilizacao-relatorios-interface/2026-10-01-relatorio-academico-versao-para-leitura.md): atividades e resultados organizados como relatório de extensão/estágio, com fluxo explicado do acesso ao diagnóstico, termos técnicos definidos, contribuições individuais/coletivas e limitações de teste. Não inventa instituição, carga horária, autoria ou impacto ambiental.
- Os dois relatórios-base foram lidos integralmente; o ADR experimental e a definição matemática original foram consultados para confirmar explicações. A apresentação foi reescrita, sem simplesmente retirar links, e cada novo texto foi relido integralmente como documento independente.
- Validação: **PASS** — ausência de links, caminhos, hashes, números de PRs, códigos de tarefas/decisões e remissões dependentes nos novos documentos; revisão de clareza, termos, tabelas, origem das decisões e limites de autoria/testes concluída. Comparação SHA-256 confirmou os dois relatórios-base, a análise preliminar e os 13 arquivos raw intactos. Branch/HEAD preservados.
- `git diff --check`: **PASS**. Os dois novos arquivos também passaram em `git diff --no-index --check /dev/null <arquivo>`, sem mensagens de whitespace; exit 1 representa somente diferença contra arquivo vazio. Links dos entregáveis neste plano conferidos.
- Escopo desta rodada: dois arquivos novos e acréscimo desta seção ao PLAN.md. Alterações preexistentes preservadas; nenhum commit, push, deploy ou edição de registros canônicos globais. Não foram executados testes de aplicação, banco, lint/typecheck/build ou navegador, pois a mudança é editorial e não produz nova evidência funcional.
- Pendências: permanecem validação científica/campo, avaliações humanas, limites de atribuição e reconciliações documentais globais já registradas. Esta entrega não aprova melhorias nem inicia as etapas 3–5 ou o Lovable.

| Data de referência | Evento editorial |
|---|---|
| 2026-10-01 | Duas versões autossuficientes produzidas por solicitação do usuário, mantendo o corte histórico e os relatórios documentais anteriores; revisão editorial e verificações de integridade/escopo concluídas. |


## Continuação de 01/10/2026 — decisões aprovadas pré-Lovable

`DECISAO_CONFIRMADA` — Origem: pedido explícito do solicitante nesta conversa, anexo iniciado por “Execute nesta ordem”, em 2026-10-01; aprovação atribuída à equipe pelo solicitante. Implementar antes do Lovable: logout acessível em todos os contextos autenticados, inclusive workspace; entrada amigável da data/hora da coleta, inicializada uma vez pelo dispositivo e editável, preservando instante e contrato temporal; rótulos em português dos sete usos predominantes da terra, mantendo valores técnicos e regras experimentais. A recomendação anterior de deixar os rótulos junto da reformulação fica substituída por esta decisão, preservada como histórico.

`DECISAO_CONFIRMADA` — Município/UF automático e rascunhos ambientais ficam `ADIADO`, como funcionalidades separadas. Não integram esta implementação. Receber preferencialmente a proposta do Lovable em repositório separado na conta do solicitante; avaliar e integrar posteriormente pelo Codex, preservando contratos, regras e arquitetura. Não gerar o prompt Lovable, reformular visualmente, fazer merge ou deploy nesta execução.

Estado inicial: `development@68328682cf2990d787b596493999330602e63cd3`, remoto `origin` no repositório PedroVitor237/HidroFlorestas. Worktree principal e dois worktrees adicionais de documentação/compatibilidade identificados e preservados. Alterações preexistentes: este plano, análise preliminar e quatro relatórios (dois documentais e duas versões para leitura), todos conferidos para o commit inicial autorizado. Relatórios mantêm corte em 01/10/2026 e não receberão os resultados desta implementação. Nenhum arquivo de ambiente será incluído.

Sequência obrigatória desta rodada:

1. Registrar decisões; conferir documentos, referências, escopo e `git diff --check`; commit documental em development.
2. Push sem força e confirmação do SHA remoto. Se falhar, não iniciar implementação.
3. Criar `fix/usabilidade-pre-lovable`, após conferir inexistência local/remota; manter spec, plano e tarefas focais pelo Spec Kit.
4. Inspecionar navegação/logout, API e persistência temporal, e vocabulário em cadastro/consulta; executar as três melhorias.
5. Verificar logout com sucesso/falha, teclado/móvel, inicialização/edição/conversão/consulta temporal em fusos distintos e rótulos/payloads; executar checks pertinentes.
6. Atualizar este plano e análise com resultados, limites e pendências; commit e push da branch dedicada, sem merge/deploy.

FASE-03: sugestão atual e edição autorizadas pelo pedido; preservar segundos/offset e informar fuso, sem reinterpretar ocorrência. FASE-04: critérios ambientais por categoria continuam pendentes quando não sustentados por fonte; ajuda contextual pode usar somente definições rastreáveis. FASE-06: seleção concluída para as três melhorias; inventário/prompt Lovable continuam posteriores. Registros canônicos globais ficam preservados; a reconciliação de OSM já registrada continua pendente.

| Data | Evento pré-Lovable |
|---|---|
| 2026-10-01 | Sequência, três melhorias, adiamentos e preferência de repositório externo confirmados pelo solicitante; publicação documental deve preceder branch e código. |


### Resultado da execução pré-Lovable

- Publicação documental inicial: `f8b2a4755aa14f1543cd0bdd656c1c30c9b89f0a` em `origin/development`, push sem força e SHA confirmado por `git ls-remote --heads` antes de código. Branch dedicada `fix/usabilidade-pre-lovable` criada somente depois; inexistência local/remota conferida.
- `EVIDENCIA_IMPLEMENTACAO`: logout responsivo no workspace via rota existente; laboratório/AdminShell conservam saída única por viewport. Campo nativo data/hora com agora sugerido somente no browser, edição preservada, fuso visível/manual, validações temporais/instante/offset intactos e ocorrência portuguesa na revisão/consultas. Sete rótulos portugueses com enums inalterados e ajuda acessível rastreável; correção de quebra do texto científico no móvel.
- Fluxo Spec Kit aplicado em [011-usabilidade-pre-lovable](../../../../specs/011-usabilidade-pre-lovable/plan.md): três histórias, 11 tarefas, checklist de qualidade 16/16; sem hooks/delegação. Lista completa de arquivos e evidências em [implementation-evidence.md](../../../../specs/011-usabilidade-pre-lovable/implementation-evidence.md).
- PASS: 255/255 unitários, 7/7 testes de rotas sem banco, 12/12 cenários de navegador offline (teclado/toque, móvel, logout sucesso/falha/retry, três fusos e payloads), typecheck, lint (quatro warnings anteriores), compilação/páginas com Webpack e diff/check de referências/escopo.
- Limitações ambientais: build padrão Turbopack falha por criação de processo/porta no processamento CSS, inclusive após escalada; Webpack PASS não substitui declarar essa falha. `npm run test:integration` interrompido antes do banco por falta de confirmação do ambiente de testes. E2E dependentes de banco foram adaptados, mas não executados. Sem banco/migrations/dependências alterados e sem dados reais escritos.
- Limites da evidência: navegador utiliza componentes reais e CSS, mas navegação/API simuladas; cookie expirado testado no handler real; roundtrip pelo serviço com armazenamento em memória. Sem validação autenticada publicada, leitores de tela ou dispositivos físicos. Resultados não são validação científica.
- FASE-03 resolvida no recorte de UX aprovado, com fuso explícito e instantes preservados. FASE-04 permanece somente para descrições/critério de campo por categoria; ajuda não inventa limiares. FASE-02 e FASE-05 ADIADO; FASE-06 concluída para seleção. Reconciliações canônicas globais registradas anteriormente permanecem fora desta entrega.
- `RECOMENDACAO`: pronta para preparar prompt Lovable em próxima execução, completando inventário funcional e registrando limitações de ambiente. Nenhum prompt gerado; receber proposta preferencialmente em repositório separado, avaliar e incorporar posteriormente.
- Relatórios históricos e raw intactos. Atualizados somente artefatos focais, código/testes pertinentes, este plano e análise. Commit/push final da branch autorizados; SHA e confirmação de publicação serão informados na entrega. Sem merge/deploy/reformulação.

| Data | Evento de encerramento do recorte |
|---|---|
| 2026-10-01 | Três melhorias implementadas e verificadas no alcance descrito; etapa 4 mantém preparação do prompt futura. Artefatos prontos para commit/push final; fase global EM_ANDAMENTO. |

## Continuação de 02/10/2026 — material para o Lovable

`DECISAO_CONFIRMADA` — Origem: pedido do solicitante nesta conversa em 2026-10-02, que confirma o merge do PR #31 e autoriza preparar e publicar somente `lovable-prompt.md`, `lovable-integration-notes.md` e esta atualização do plano em `development`. Não criar branch/PR, alterar funcionalidades, fazer merge de trabalho, deploy nem enviar o prompt ao Lovable. A atualização local abaixo foi fast-forward para acompanhar o merge já realizado pelo solicitante.

- Estado inicial: `fix/usabilidade-pre-lovable@eb7a753`, upstream correspondente, worktree limpo; nenhuma alteração preexistente a incorporar ou reverter. Somente AGENTS.md raiz aplicável.
- `EVIDENCIA_IMPLEMENTACAO`: `git fetch origin`, troca para `development` e `git merge --ff-only origin/development` concluídos; base `b80d7b0bf4d5a94d4af80294d77ee07675bdaa1b`, igual ao remoto. Consulta somente leitura do PR #31 confirma `MERGED`, base development e merge em 01/10/2026 às 18:30:58 UTC−03; ancestralidade e arquivos das três melhorias conferidos.
- Escopo: inventário de telas/fluxos/formulários/contratos/permissões/estados, confronto focal com decisões, paleta real login/cadastro e inspeção visual das cinco imagens. Documentação transversal, sem nova feature Spec Kit.
- Sequência: inspeção → redação dos dois entregáveis → revisão isolada do prompt e cobertura → referências, escopo e `git diff --check` → commit/push somente dos três arquivos autorizados e confirmação do SHA remoto.
- Próximo passo após esta entrega: solicitante copiar o prompt ao Lovable e anexar as referências recomendadas; receber preferencialmente repositório separado na própria conta; avaliar a proposta concreta e planejar integração posterior por recortes. Sem promessa de integração automática.
- Estado desta continuação: `CONCLUIDO` documentalmente, pronta para publicação autorizada; fase global permanece `EM_ANDAMENTO`. Geração e avaliação externa não iniciadas por este agente.

### Resultado e verificação do material Lovable

- Entregáveis: `lovable-prompt.md` contém somente texto para o Lovable, com identidade visual real, composição das cinco imagens, 17 telas e três aliases, fluxos/permissões, 17 campos ambientais, sete rótulos e contratos necessários; `lovable-integration-notes.md` contém proveniência, limites/divergências, anexos e roteiro de recepção/adaptação. Nenhuma dependência de leitura de caminhos locais no prompt.
- Revisão: prompt lido isoladamente e comparado às rotas/DTOs/handlers/decisões. Preservados logout, ocorrência do dispositivo editável/offset, taxonomia portuguesa, contratos fechados, imutabilidade, idempotência e IHFR experimental. Demonstração com fixtures/adapter substituível, sem autorizar backend/auth/banco/motor novos. Captura opcional não foi confundida com suficiência do cálculo; funções ilustradas sem contrato foram excluídas.
- PASS: `python3 /tmp/hidro-lovable-doc-check.py` verifica 86 links locais/âncoras, 20/20 rotas de página (17 telas + três aliases), 27/27 caminhos HTTP, 17/17 campos ambientais, 7/7 pares de uso da terra, cinco identidades de versão/hash, quatro tokens OKLCH contra tema instalado/lockfile, whitespace e escopo de três arquivos. `git diff --check` e `git diff --cached --check` sem ocorrência; revisão textual de terminologia, referências, ausência de dados sensíveis e escopo concluída. Diff staged contém somente os três documentos autorizados.
- Não executados: testes de aplicação, lint/typecheck/build, runtime/navegador, banco/migrations e deploy; entrega exclusivamente documental, sem alteração funcional. Evidências antigas do PR #31 não foram reexecutadas nesta rodada. Contraste/teclado/responsividade serão verificados na proposta concreta, não declarados como validados agora.
- Pendências: avaliação humana da proposta, adaptação da estrutura realmente gerada, descrições ambientais, geocodificação/rascunhos adiados, política PENDING, ciência/campo e reconciliação canônica de mapas. Registradas nas notas, sem escolher silenciosamente política nova ou transformar defeito/limitação em requisito. Nenhum bloqueio desta entrega.
- Escopo final: somente os três documentos autorizados; código, configs, dependências, raw, relatórios históricos e registros canônicos globais intactos. Commit/push sem força em development; SHA e confirmação remota serão informados na entrega, sem inserir referência circular ao próprio commit.

| Data | Evento de preparação Lovable |
|---|---|
| 2026-10-02 | PR #31 confirmado em development atualizada; inspeção técnica/visual e redação concluídas; validação documental aprovada; etapa 4 encerrada. Próximo passo: solicitante gerar proposta externa e disponibilizar repositório/SHA para avaliação posterior. |


## Continuação de 02/10/2026 — checkpoint e handoff da proposta externa

`DECISAO_CONFIRMADA` — Origem: solicitação atual do usuário. Inspecionar documentalmente o repositório público do Lovable, criar [lovable-handoff.md](lovable-handoff.md) e atualizar somente este plano; commit/push em development, sem branch/PR, merge, deploy ou incorporação de código. Outro desenvolvedor conduzirá a futura incorporação. Esta seção atualiza o estado corrente e preserva as continuações anteriores como histórico; corte dos relatórios enviados permanece 01/10/2026.

- Estado inicial: `development@1cbd2e9beab607fce8c4197ad7820267aa633fd8`, worktree limpo e origin/development local coincidente; `git ls-remote --heads origin development` confirmou o mesmo SHA remoto antes da publicação. Nenhuma alteração preexistente a incorporar/reverter. AGENTS.md raiz aplicável.
- Sequência deste recorte: leitura de instruções/plano/prompt/notas → consulta Git remota e clone separado em /tmp → inspeção estática de rotas/estilos/adapter/fixtures/testes/docs → comparação de cobertura e redação → revisão do diff/referências/whitespace → commit apenas dos dois documentos e push sem força para development com confirmação remota.
- `EVIDENCIA_IMPLEMENTACAO`: branch padrão do [Lovable](https://github.com/PedroVitor237/HidroFlorestas-FrontEnd) é main; HEAD `d4cf1e5f28322132e094c0c0016c3ad531be7404`, confirmado por ls-remote, clone e reconferência antes da conclusão. Não houve avanço nessa referência em relação ao SHA anterior informado. Plano, TanStack Start/Vite, UI genérica, tipos/rótulos/utilitários, adapter mock e store de cenários existem; somente a rota `/` está registrada, com placeholder “Your app will live here!”. Telas de domínio, painel de demonstração e mapa conectado não localizados.
- `FATO_DOCUMENTADO`: usuário relatou pausa por falta de créditos e chegada posterior de créditos gratuitos. Clique em “Finish up”, retomada, conclusão e alterações não sincronizadas ao GitHub não têm evidência; não são afirmados. Não houve acesso ao editor Lovable.
- `INFERENCIA`: geração parcial, ainda em estrutura inicial; não pronta para avaliar integração das telas. Inspeção documental deste checkpoint `CONCLUIDO`; etapa 5 global permanece `EM_ANDAMENTO`, sem incorporação iniciada.
- Entregáveis: handoff com SHAs/referências, inventário de artefatos, matriz das 17 telas/três aliases e fluxos, lacunas, diferenças arquiteturais, critérios de revisão, regras de incorporação e etapas menores de geração. Mocks/adapters e testes de montagem não comprovam fluxos funcionais. Divergência de sessionStorage e simplificações de validação/idempotência/elegibilidade registradas para revisão, sem corrigir o clone.
- `RECOMENDACAO` — Próximo passo: quando houver créditos e o solicitante retomar, reconferir main/SHA e pedir primeiro landing/acesso/logout, identidade e shell de demonstração; avançar por recortes demonstráveis descritos no handoff. Depois das telas/estados navegáveis, outro desenvolvedor compara a proposta ao baseline atualizado do HidroFlorestas e planeja adaptação revisável ao App Router/API/guards reais. Sem migração automática de stack ou lógica de mock.
- Município/UF automáticos (FASE-02) e rascunhos de registros ambientais (FASE-05) continuam `ADIADO`, em funcionalidades separadas; responsáveis/prazos não especificados. Contratos reais, persistência/autorização e IHFR experimental preservados; validação científica continua pendente.
- Validação documental: revisão textual e diff completo dos dois arquivos, links locais conferidos e `git diff --check` sem ocorrência; antes do commit, `git diff --cached --check` e escopo staged conferidos. Referência pública do Lovable reconferida e idêntica. Raw, relatórios enviados, código/config/dependências e registros canônicos globais intactos.
- Não executados: instalação de dependências, testes/lint/typecheck/build/preview/navegador dos dois projetos, banco/migrations ou deploy. Escopo exclusivamente documental; inspeção estática não comprova runtime, responsividade, acessibilidade ou integração. Não há PASS funcional atribuído ao Lovable.
- Limitação de rede: consultas iniciais no sandbox falharam por DNS; repetidas com autorização fora dele, tiveram sucesso. Nenhum bloqueio documental remanescente. Publicação autorizada dos dois documentos em development; commit e confirmação do push serão informados na entrega, sem inserir SHA circular no próprio documento.

| Data | Evento de handoff |
|---|---|
| 2026-10-02 | SHA público reconferido; geração parcial documentada, telas não prontas para integração; handoff concluído e próximo recorte recomendado, sem alterar corte histórico ou incorporar código. |
