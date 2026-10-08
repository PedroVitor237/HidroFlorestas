# Desenvolvimento do HidroFlorestas até 1º de outubro de 2026

**Natureza:** relatório acadêmico descritivo, baseado em documentos e evidências de desenvolvimento.

**Corte:** 01/10/2026, America/Fortaleza; código em `development@68328682cf2990d787b596493999330602e63cd3`, histórico remoto consultado nesta data e relato atual do solicitante sobre o mapa.

**Estado:** entregue para revisão de conteúdo e atribuições; sem aprovação científica ou institucional presumida.

**Elaboração:** Codex, por solicitação do usuário. Não foi fornecido modelo acadêmico institucional obrigatório.

## Resumo

O HidroFlorestas é uma plataforma web vinculada a uma iniciativa de extensão e startup, cujo núcleo científico é o Índice HidroFlorestal (IHFR). O desenvolvimento registrado evoluiu de uma base de autenticação, estrutura de dados e interfaces iniciais para um fluxo integrado de laboratórios, áreas monitoradas, coletas, medições ambientais e diagnóstico experimental. Paralelamente, a equipe organizou fontes históricas, documentou divergências e passou a especificar cada funcionalidade antes de implementá-la.

Até o corte, esse fluxo está integrado ao código de desenvolvimento e foi promovido à branch principal. Há registros de testes automatizados em ambientes identificados, mas eles não comprovam validade científica do índice, usabilidade com participantes ou funcionamento integral em produção. Em 01/10, o solicitante relatou a configuração da base OpenStreetMap na Vercel e confirmou o funcionamento do mapa publicado. Este relatório apresenta as entregas, as decisões, as contribuições rastreáveis e os limites dessa evidência.

## 1. Contexto e objetivos

**FATO_DOCUMENTADO.** O [contexto do projeto](../../../PROJECT_CONTEXT.md) identifica a natureza de extensão e startup e o IHFR como núcleo científico. O [PRD Code-First](../../code-first-prd/prd-code-first.md), ainda `EM_REVISAO`, apresenta como público prioritário equipes de pesquisa e extensão e como direção do MVP demonstrar o ciclo laboratório → área monitorada → coleta e dados ambientais → diagnóstico → acompanhamento territorial. Essa direção tem os estados próprios do rascunho; não equivale a aprovação normativa integral do produto.

A proposta busca organizar observações de campo e seus resultados em uma cadeia rastreável. Para isso, o software precisa saber em qual laboratório e área cada registro foi produzido, quem está autorizado a acessá-lo e qual versão de cálculo produziu um diagnóstico. O objetivo desta pesquisa documental é descrever como essas condições foram construídas, sem transformar funcionalidades previstas em resultados alcançados.

O relatório também distingue desenvolvimento do software de pesquisa científica sobre o índice. No estado atual, o IHFR é **`CONTRATO_EXPERIMENTAL`**, com **`VALIDACAO_CIENTIFICA_PENDENTE`**, **`SUJEITO_A_RECALIBRACAO`** e **`NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO`**, conforme o [ADR-0001](../../governance/ADR-0001-contrato-experimental-ihfr-v0-1.md).

## 2. Método e critérios de evidência

A consulta começou pelos planos, decisões, constituição do Spec Kit, especificações e PRD Code-First. Depois foram examinados o histórico Git e os PRs — propostas de integração de alterações —, incluindo títulos, descrições, autoria, destino, estado, comentários e revisões. Diffs selecionados, isto é, comparações entre versões, foram usados para esclarecer títulos genéricos, descrições vazias ou afirmações relevantes. Não houve nova execução de testes do aplicativo nesta pesquisa.

Foram aplicadas a [política de autoridade](../../governance/SOURCE_AUTHORITY.md) e a [política Code-First](../../code-first-prd/governance/source-policy.md). As afirmações documentais conservam a classificação **FATO_DOCUMENTADO**; observações diretas em código e Git são **EVIDENCIA_IMPLEMENTACAO**; escolhas com origem identificada são **DECISAO_CONFIRMADA** no respectivo recorte. Conclusões analíticas e orientações aparecem como **INFERENCIA** e **RECOMENDACAO**.

| Estado usado neste relatório | Evidência necessária | O que não permite concluir |
|---|---|---|
| Planejado | Spec, plano, contrato ou tarefa descreve a entrega. | Que o comportamento já existe. |
| Implementado | Código, esquema, migration ou diff mostra o comportamento conectado. | Que foi integrado, executado ou aprovado cientificamente. |
| Integrado | Merge do PR e ancestralidade Git identificam sua incorporação ao destino. | Que todas as verificações passaram ou que a produção usa esse exato código. |
| Validado no alcance indicado | Fonte registra comando ou observação, resultado, data e ambiente. | Validação universal, atual em outro ambiente ou de cenários não exercitados. |

A consulta à API retornou os PRs **#1 a #30**, todos com registro de merge. Foram obtidas as descrições completas e as conexões de comentários/reviews, sem páginas restantes. Os comentários retornados são do bot Vercel; a API não retornou reviews formais. Isso não prova ausência de revisão em reuniões ou outros canais. Comentários de deployment tampouco provam funcionamento das telas.

O histórico local contém os merges #1–#29 como ancestrais do corte. O merge #30, `cf6a7bd`, está na linha da `main`, não é ancestral da `development` examinada. Foi verificado que o conteúdo de `cf6a7bd` coincide com `8d78d52`, último commit anterior ao planejamento desta fase. O commit de corte `6832868` acrescenta somente o plano e a análise preliminar.

## 3. Organização do desenvolvimento

**FATO_DOCUMENTADO.** A organização registrada combina três conjuntos de documentos:

- `docs/raw/`: preserva as fontes históricas, com inventário, hashes e autoridade delimitada. Não é automaticamente a especificação atual.
- `docs/code-first-prd/`: reúne visão de produto, requisitos candidatos, modelos, fluxos e backlog, mantendo o estado de revisão.
- `specs/<feature>/`: reúne especificação, decisões locais, plano, contratos, tarefas e evidências de cada entrega implementável.

A [constituição do Spec Kit](../../../.specify/memory/constitution.md), ratificada em 06/09, estabeleceu entregas pequenas e verificáveis, rastreabilidade, validação proporcional e preservação das fontes. O [plano de implementação](../../code-first-prd/implementation/implementation-plan.md) e o [guia dos desenvolvedores](../../code-first-prd/implementation/developer-guide.md) documentam branches, revisão e integração. Os PRs [#17](https://github.com/PedroVitor237/HidroFlorestas/pull/17), [#18](https://github.com/PedroVitor237/HidroFlorestas/pull/18) e [#19](https://github.com/PedroVitor237/HidroFlorestas/pull/19) incorporaram o pacote Code-First, o fluxo Spec Kit e o guia.

**INFERENCIA.** Esse conjunto permite explicar por que uma regra foi escolhida e onde foi implementada, mas sua utilidade depende de atualizar ou contextualizar os estados antigos. No corte, alguns cabeçalhos ainda dizem “pronto para planejamento”, enquanto evidências posteriores e merges demonstram implementação. O relatório usa as fontes mais recentes pertinentes, preservando o valor histórico das anteriores.

## 4. Evolução registrada

As datas abaixo representam eventos no repositório ou registros documentais, não necessariamente o início real do trabalho fora dele. Datas de integração foram interpretadas em America/Fortaleza.

| Período | Evolução observada | Evidências e limites |
|---|---|---|
| Março de 2026 | Base inicial da aplicação, autenticação, contexto de sessão e Prisma. | Primeiro commit local `8024877`, de 08/03. A presença de código inicial não prova os controles de segurança acrescentados depois. |
| Abril–maio | Evolução do modelo de dados, scripts administrativos, landing, dashboard visual e conexão Neon. | PRs #1–#12; `bad2818` amplia o schema; o diff de [#12](https://github.com/PedroVitor237/HidroFlorestas/pull/12) substitui a alternância de adapters pela conexão Neon. Modelagem não equivale a fluxo completo de produto. |
| Julho–início de agosto | Interfaces de login/cadastro e áreas; navegação da landing. | [#13](https://github.com/PedroVitor237/HidroFlorestas/pull/13), [#16](https://github.com/PedroVitor237/HidroFlorestas/pull/16) e `6e106d1`. No diff do #16, a grade usa registros fixos: interface demonstrativa, não cadastro persistente de áreas. |
| 24–30 de agosto | Inventário das fontes, governança, auditorias científicas, matemáticas, funcionais e técnicas. | Planos históricos e auditorias; `2fe5541` e `82ad404` têm títulos genéricos de refatoração, mas seus arquivos alterados são documentais. Não foram classificados como refatoração de runtime. |
| 06–13 de setembro | Adoção do Spec Kit e integração de acesso autenticado e laboratórios. | PRs #17–#22; conclusão técnica da IMP-001 e escopo mínimo da IMP-002, com limitações E2E explícitas desta última. |
| 14–20 de setembro | Áreas persistentes, coletas, medições, dashboard, mapa e administração global. | Specs 003–009 e PRs #23–#28; as entregas têm critérios e níveis de validação distintos. |
| 18–28 de setembro | Consolidação do contrato experimental IHFR, implementação e correções de integridade, interface e testes. | ADR-0001, spec 006, série `007-ihfr-evolution` e [#29](https://github.com/PedroVitor237/HidroFlorestas/pull/29), integrado em 28/09. |
| 28 de setembro | Cadastro público passa a criar contas ativas para testes com usuários; roteiro de uso simplificado. | `208d639`, spec 010 e `TD-017`; `115c008` e `8d78d52`. |
| 1º de outubro | Promoção à branch principal, planejamento da estabilização e confirmação relatada do mapa publicado. | [#30](https://github.com/PedroVitor237/HidroFlorestas/pull/30), merge `cf6a7bd` às 03h32; `6832868`; relato do solicitante registrado no plano. |

Há duas distinções de nomenclatura: `007-dashboard-history` é a spec de dashboard; `007-ihfr-evolution` é a continuidade do IHFR incorporada com a IMP-006 no PR #29. Além disso, `IMP-010` no backlog é o acompanhamento humano de UX da autenticação, enquanto `specs/010-active-public-signup` é a entrega focal de cadastro ativo. O número isolado não identifica o mesmo trabalho.

## 5. Entregas alcançadas e seus limites

**EVIDENCIA_IMPLEMENTACAO**, apoiada em código/diffs, evidências das features e ancestralidade dos merges abaixo. As validações são registros históricos consultados, sem reprodução nesta rodada.

| Entrega e planejamento | Resultado implementado | Integração em `development` | Validação documentada e limite |
|---|---|---|---|
| [IMP-001 — acesso](../../../specs/001-authenticated-access/plan.md) | Login para conta `ACTIVE`, restauração, proteção no servidor e logout; resposta pública minimizada. | [#20](https://github.com/PedroVitor237/HidroFlorestas/pull/20), `5fa63ce`, 13/09. | 10/10 E2E funcionais e 2/2 HTTPS na rodada; SC-006/SC-007 humanos continuam não verificados. |
| [IMP-002 — laboratórios](../../../specs/002-criar-laboratorio/plan.md) | Criação/listagem persistente, vínculo inicial, limite de cinco laboratórios acessíveis e configurações protegidas. | [#21](https://github.com/PedroVitor237/HidroFlorestas/pull/21), `f440282`, 13/09. | Unitários, integração, tipagem e build registrados como aprovados. E2E daquele PR parou no setup por conexão; não houve aprovação 14/14. |
| [IMP-003 — áreas](../../../specs/003-area-registration-and-viewing/plan.md) | Laboratório escolhido explicitamente, papéis contextuais, cadastro de área-ponto e consulta isolada por vínculo. | [#23](https://github.com/PedroVitor237/HidroFlorestas/pull/23), `190e9af`, 15/09. | [Evidência](../../../specs/003-area-registration-and-viewing/implementation-evidence.md) registra migrations, integração e fechamento dos E2E; SC-009/SC-010 humanos pendentes. |
| [IMP-004 — coleta](../../../specs/004-environmental-collection-registration/plan.md) | Confirmação dos metadados, ocorrência com offset preservado, autoria da sessão e registro imutável; revisão prévia em memória. | [#24](https://github.com/PedroVitor237/HidroFlorestas/pull/24), `37fb3a4`, 16/09. | [Evidência](../../../specs/004-environmental-collection-registration/implementation-evidence.md) registra gates técnicos; SC-002/SC-007 humanos continuam abertos. Não há rascunho persistente neste recorte. |
| [IMP-005 — medições](../../../specs/005-environmental-collection-data/plan.md) | Um conjunto integral de água, solo, vegetação e terreno por coleta, com contrato versionado e confirmação imutável. | [#25](https://github.com/PedroVitor237/HidroFlorestas/pull/25), `5d9ca6f`, 18/09. | [Evidência](../../../specs/005-environmental-collection-data/implementation-evidence.md): 122/122 unitários, 10/10 migrations, 41/41 integração e 4/4 E2E focais; SC-006 humano pendente. Esses resultados não aprovam cálculo científico. |
| [IMP-007 — dashboard/histórico](../../../specs/007-dashboard-history/plan.md) | Contagens e eventos derivados de áreas e coletas confirmadas, com navegação à origem, sem histórico paralelo inventado. | [#26](https://github.com/PedroVitor237/HidroFlorestas/pull/26), `10fdb8b`, 19/09. | Fechamento em [tasks](../../../specs/007-dashboard-history/tasks.md): 25/25 E2E, incluindo sete do dashboard e 18 regressões. Tecnologia assistiva e estudo humano continuam pendentes. |
| [IMP-008 — mapa](../../../specs/008-territorial-map/plan.md) | Visão de áreas-ponto e coletas associadas, com lista equivalente e continuidade sem base cartográfica. | [#27](https://github.com/PedroVitor237/HidroFlorestas/pull/27), `df85619`, 19/09. | [Evidência](../../../specs/008-territorial-map/implementation-evidence.md): 3/3 E2E focais, com tiles interceptados; desempenho real e avaliação humana pendentes. Relato publicado de 01/10 é evidência separada. |
| [IMP-009 — administração](../../../specs/009-user-administration/plan.md) | Administração global por papel atual, mudanças de estado/papel, proteção do último administrador ativo e auditoria. | [#28](https://github.com/PedroVitor237/HidroFlorestas/pull/28), `100351e`, 20/09. | [Evidência](../../../specs/009-user-administration/implementation-evidence.md): 4/4 E2E focais; a suíte global naquela rodada teve falhas e cenários não executados. Revisão humana assistiva pendente. |
| [IMP-006 e continuidade IHFR](../../../specs/006-ihfr-diagnosis/plan.md) | Cálculo experimental determinístico, elegibilidade, criação, substituição, revogação, consulta e histórico com versões e integridade. | [#29](https://github.com/PedroVitor237/HidroFlorestas/pull/29), `edb0ca2`, 28/09. | Registros de unidade, contrato, migrations, integração e fluxo completo; detalhes na seção 7. [Validação humana/científica](../../../specs/006-ihfr-diagnosis/evidence/human-validation.md) continua não verificada. |
| [Cadastro público ativo](../../../specs/010-active-public-signup/plan.md) | Conta pública nasce `ACTIVE`, permitindo login imediato; outros estados e default Prisma `PENDING` preservados. | Commit direto autorizado `208d639`, 28/09; incluído no #30. | Teste em memória exercita cadastro/login, hash e resposta pública; não foi teste com novo cadastro em banco real nesta entrega. |

O merge #30 promoveu o conjunto à `main`. Sua descrição ainda contém checklist e frase de “não mesclado”; a evidência atual de integração é o campo `merged_at` da API e o commit de merge, não essa frase histórica. Não houve nesta pesquisa verificação de todas as páginas publicadas nem correspondência direta entre a produção atualmente acessada e o SHA do merge.

## 6. Decisões que orientaram a implementação

**Arquitetura observada.** A aplicação reúne interface e backend em TypeScript/Next.js, com Prisma e PostgreSQL/Neon. Isso foi observado no [pacote da aplicação](../../../package.json), no [schema](../../../prisma/schema.prisma) e nos serviços, e deve ser distinguido das escolhas inicialmente relatadas em `TD-001`–`TD-007`. A família de versões evoluiu durante o projeto; o pacote do corte exige Node `>=24.19.0 <25`. Versões de planos antigos descrevem seus próprios momentos.

**Autorização por contexto.** As specs 003 e 009 separam papel de laboratório e administração global. A identidade vem da sessão validada no servidor; o cliente não escolhe quem realizou a operação. Laboratório inativo conserva leitura autorizada e bloqueia alterações. Essa decisão evita confundir o título de administrador em um grupo com autoridade sobre toda a plataforma.

**Separação entre observar e calcular.** A decisão de 17/09 da IMP-005 separou o contrato de captura do contrato matemático. Uma medição confirmada preserva seu conteúdo; o cálculo tem versão própria. O ADR de 18/09 e sua decisão focal de 19/09 escolheram pesos, categorias e regras suficientes para a primeira execução experimental, preservando alternativas. O [relatório de ambiguidades](2026-10-01-ambiguidades-documentais-e-decisoes.md) apresenta as fontes e justificativas sem tratá-las como validação definitiva.

**Repetição segura e histórico.** Coletas, medições e operações de diagnóstico usam identificadores de operação para que uma repetição após falha de rede não crie resultados duplicados. Essa propriedade é chamada idempotência. O diagnóstico registra versões e uma assinatura do contrato, o hash, para permitir reconhecer a regra utilizada. Substituições preservam resultados anteriores; há no máximo um diagnóstico vigente por coleta.

**Recortes de visualização.** O mapa mínimo usa Leaflet/React-Leaflet e áreas-ponto. Plotly permanece direção futura de gráficos; polígonos, camadas científicas e IA generativa não foram incorporados por aparecerem em propostas históricas. Em 01/10, o solicitante confirmou OpenStreetMap para produção e relatou a configuração das duas variáveis públicas da base cartográfica. Essa decisão atual sucede o estado “em avaliação” ainda presente em `TD-008`/`PD-007`, cuja reconciliação global fica pendente.

**Cadastro para testes.** `TD-017`, de 28/09, autorizou contas públicas inicialmente ativas na fase de validação com usuários. O diff de `208d639` confirma a atribuição explícita de `ACTIVE` no serviço e a projeção de campos públicos. A regra não remove os demais estados de conta nem exige aprovação manual para esse fluxo atual.

## 7. Validação técnica: resultados e limites

Os resultados abaixo são **FATO_DOCUMENTADO** nas fontes citadas. Foram examinados nesta pesquisa, sem execução independente. Os números pertencem a diferentes suites e momentos; não devem ser somados como se formassem uma única campanha de testes.

| Rodada e ambiente | Resultado registrado | Alcance e ressalva |
|---|---|---|
| 27/09, continuidade IHFR; executor Windows, PostgreSQL local próprio e Neon E2E identificado no relatório | 244/244 unitários; 26/26 migrations; 2/2 contrato; 107/107 integração; 6/6 IHFR isolado; 55/55 Playwright geral; 2/2 HTTPS; dois percursos full UI 1/1. | [Execução de 27/09](../../validation/007-ihfr-evolution/2026-09-27-execucao-codex-ultra.md). O segundo percurso usou o snapshot técnico final. Falhas anteriores, primeira falha de locator e limites operacionais foram preservados. |
| 28/09, preparação do PR #29; Node 24.19.0 e cópia Linux | 244/244 unitários, tipagem, lint e build aprovados; auditorias de dependências registraram zero vulnerabilidades naquela consulta. | [PR #29](https://github.com/PedroVitor237/HidroFlorestas/pull/29). Testes de banco e navegador não foram repetidos nessa revisão; os resultados de 27/09 foram citados com essa distinção. |
| 01/10, preparação da promoção #30; Node 24.19.0 e dependências reinstaladas | 245 unitários e 65 casos de integração com dependências simuladas aprovados; tipagem, lint e build aprovados, com quatro avisos de lint. | [PR #30](https://github.com/PedroVitor237/HidroFlorestas/pull/30). Os 310 casos não equivalem ao `npm test` completo. Suites de banco foram interrompidas no preflight por configuração pooled onde se exigia endpoint direto; E2E gerais/HTTPS não foram executados para preservar dados existentes. |
| 01/10, investigação local do mapa em rodada anterior | Quatro cenários isolados de navegador e verificações focais distinguiram ausência de configuração de falha de tiles. | [Análise, seção 7](../../plans/active/estabilizacao-relatorios-interface/analise-preliminar.md). Não foram páginas completas autenticadas nem tiles de provedor real. |
| 01/10, site publicado | Solicitante confirmou o mapa funcionando após configurar `NEXT_PUBLIC_MAP_TILE_URL` e `NEXT_PUBLIC_MAP_ATTRIBUTION` na Vercel. | **Validação manual relatada pelo solicitante**. Sem inspeção direta do painel pelo agente, SHA/deployment informado ou comprovação individual de cadastro, detalhe e mapa territorial nesta rodada. |

O percurso full UI registrado passou por login, laboratório, área, coleta, dados ambientais e diagnóstico, incluindo recarga, substituição e revogação. Isso sustenta a integração técnica no ambiente do ensaio. O resultado calculado nesse teste é de uma fixture, um conjunto sintético de dados, e não demonstra acerto ambiental do IHFR em campo. A [revisão documental de 28/09](../../validation/007-ihfr-evolution/2026-09-28-revisao-commits-e-merge.md) explicita essa distinção entre execução relatada e reprodução independente.

Persistem avaliações humanas de compreensão e usabilidade em diversas features, revisão com tecnologia assistiva, métricas de desempenho do mapa e validação científica. A existência de testes de teclado e inspeção da interface não substitui participantes reais nem parecer de especialistas.

## 8. Dificuldades e tratamento adotado

**Fontes divergentes.** Fórmulas, tabelas e regras de ausência não eram uniformes. A solução registrada foi decidir um contrato experimental versionado e manter alternativas rastreáveis, conforme ADR-0001. A questão científica não foi declarada resolvida para facilitar implementação.

**Mudança de interfaces demonstrativas para dados reais.** O diff do PR #16 mostra uma grade de registros fixos. As features posteriores introduziram serviços, persistência e isolamento contextual. O diff de `10fdb8b` para `dashboard.service.ts` mostra contagens e histórico consultados nas fontes reais. Aparência de tela e disponibilidade de dados foram tratadas como evidências diferentes.

**Ambiente e dependências.** Houve incompatibilidade do ESLint tratada no [PR #22](https://github.com/PedroVitor237/HidroFlorestas/pull/22), falhas de download de fontes, limitações de executores, configuração de banco e necessidade de alinhar o runtime. As evidências registram também correções concretas, como tipos booleanos no avaliador (`2277ce3`), geração de UUID no navegador (`94017e3`) e integridade cruzada no banco (`4438a91`). Falha ambiental e defeito do produto não foram tratados como equivalentes.

**Dados de teste e repetibilidade.** Os relatórios de setembro mostram que contas de teste podiam atingir o limite de cinco laboratórios e que determinados históricos não deveriam ser apagados automaticamente. A continuidade acrescentou verificação de capacidade, isolamento e auditoria de resíduos. Os resultados de um banco não foram usados como aprovação de outro destino.

**Configuração do mapa publicado.** O diff de `eee3bd8` mostra que o helper comum exige URL HTTPS e atribuição em produção, e só fornece OSM automaticamente fora de produção. O solicitante informou ter configurado as variáveis e resolvido o incidente. **INFERENCIA:** o relato é compatível com a hipótese de configuração ausente ou inválida investigada antes, mas não substitui inspeção dos valores incorporados ao build problemático.

## 9. Contribuições individuais e trabalho coletivo

Esta atribuição descreve registros de desenvolvimento, não uma divisão completa de esforço ou propriedade intelectual. Autor de commit, autor de PR, responsável pelo merge e autor científico são papéis distintos. Foram confrontados nomes de autor/committer e metadados dos PRs, sem reproduzir e-mails. O histórico examinado não apresentou trailers `Co-authored-by`; isso não exclui colaboração sem esse registro.

| Pessoa ou identidade registrada | Contribuição sustentada pelas fontes | Limite da atribuição |
|---|---|---|
| Pedro Vitor / `PedroVitor237` | Base inicial `8024877`; autoria dos PRs de interfaces de acesso, Code-First, Spec Kit, guia, autenticação, áreas, coletas e medições (#13, #17–#20, #23–#25); registro de auditorias e planejamento; cadastro ativo `208d639`; autoria/merge dos PRs #29 e #30. | Integração do #29 não significa autoria exclusiva do IHFR. Decisões registradas como “equipe” não foram reatribuídas pessoalmente. |
| Luciano Mendes / `luciano-mendesz9` | Modelo e scripts iniciais, landing/dashboard e conexão Neon (PRs #1–#3, #6–#9, #12); interfaces de áreas #16; laboratórios #21; dashboard #26, mapa #27 e administração #28. Na IMP-006, commits como `de2e9e7` e `69f505a` implementam validação do manifesto e avaliador. | O histórico usa nome e login; os PRs sustentam a associação ao trabalho descrito. Autoria de PR não prova autoria de todas as linhas incorporadas. |
| Identidade Git `thalesvalente` | Ciclo do diagnóstico em `5389796`; correções de entrada/UUID, booleanos, integridade de banco, runtime, dependências e instrumentação/testes nos commits `94017e3`, `2277ce3`, `4438a91`, `6e45be8`, `ef698a2`, `073a9eb` e `b9d481f`. Relatórios de validação de setembro acompanham essa continuidade. | Nome civil, vínculo acadêmico e divisão de trabalho fora do Git não foram inferidos a partir do login. A ausência de PR próprio não apaga os commits integrados no #29. |
| Professor Fábio Mesquita | O ADR §1 registra que a equipe lhe atribuiu a concepção histórica do IHFR, em relato de 18/09. | Não comprova autoria material de cada arquivo raw nem aprovação das escolhas experimentais, da implementação ou da calibração. |
| Equipe HidroFlorestas | Decisões de produto/engenharia registradas nas specs, no ADR e em `TECH_DECISIONS.md`; integração de entregas de diferentes autores. | Não há fonte suficiente para distribuir reuniões, testes manuais, coleta de requisitos e esforço entre todos os participantes. |
| Solicitante desta rodada | Relatou a escolha operacional de OSM, a configuração na Vercel e o funcionamento do mapa publicado em 01/10. | O relato atual é atribuído ao solicitante, sem presumir identidade civil nem teste individual das três telas. |
| Assistência por Codex | Fluxo documentado nas skills/guia, registros de execução e elaboração deste relatório. | Nome de autor no Git não mede participação de ferramentas; não há contabilidade completa do uso de IA em cada alteração. |

**INFERENCIA.** O IHFR implementado é um exemplo concreto de contribuição coletiva: há planejamento e decisão registrados, base de manifesto/avaliador, complementação do ciclo e correções posteriores por diferentes identidades. Contar commits ou usar apenas quem abriu o PR apagaria parte dessa trajetória. Por isso, não foram estimadas horas, percentuais de autoria ou produtividade individual.

## 10. Resultados, pendências e continuidade

**EVIDENCIA_IMPLEMENTACAO.** O principal resultado de software é uma cadeia persistente e contextual de laboratório, área, coleta, medições e diagnóstico experimental, acompanhada de contratos, testes e documentação. O dashboard e o mapa oferecem projeções básicas dos registros; a administração global possui fronteira própria. O conjunto foi integrado à `main` em 01/10. O funcionamento publicado do mapa tem confirmação manual relatada pelo solicitante.

**INFERENCIA.** A contribuição metodológica observável é a passagem de documentos e interfaces heterogêneos para entregas com decisões, contratos e evidências rastreáveis. Isso aumenta a possibilidade de revisão, sem demonstrar ainda impacto ambiental, adoção institucional, eficácia em campo ou maturidade definitiva do produto.

Permanecem:

- **PENDENCIA_DE_DECISAO/validação científica:** pareceres, vetores científicos, desenho amostral, calibração e campo do IHFR; ver `PD-002` e ADR-0001.
- **Validação humana e operacional:** compreensão dos fluxos, tecnologia assistiva, desempenho do mapa e revalidação das suites que exigem ambiente de teste adequado. O relato de resolução do mapa encerra esse incidente para a fase, mas não aprova todos esses critérios.
- **Reconciliação documental:** backlog e cabeçalhos históricos, tarefas abertas e evidências posteriores precisam ser lidos em conjunto. Na IMP-008 há 22 checkboxes abertos apesar do registro de implementação; isso pede conferência, não declaração automática de 22 funcionalidades ausentes. Na IMP-006, T147 conserva investigação de um destino histórico de banco, sem transferir para ele o sucesso do E2E.
- **Registros canônicos:** incorporar posteriormente a origem da escolha de OSM em `TD-008`/`PD-007`, reconciliar referências afetadas e avaliar a inclusão destes relatórios no inventário. Os caminhos globais não foram editados nesta entrega.
- **Próximos recortes de produto:** seleção das melhorias de logout, Município/UF, data/hora, ajuda de uso da terra e rascunhos ambientais. Plotly e reformulação via Lovable continuam futuros; este relatório não os implementa nem aprova.

**RECOMENDACAO.** Revisar os dois relatórios quanto a conteúdo científico, atribuições e expectativas acadêmicas. Em seguida, registrar a escolha dos próximos recortes na etapa 3 do [plano de estabilização](../../plans/active/estabilizacao-relatorios-interface/PLAN.md). A recomendação já existente é priorizar acesso ao logout e entrada temporal, mas a decisão continua com a equipe. O prompt definitivo do Lovable depende dessa seleção e de inventário atualizado das telas e contratos.

## 11. Fontes, amostragem e limites da pesquisa

As fontes principais foram [PROJECT_CONTEXT](../../../PROJECT_CONTEXT.md), [TECH_DECISIONS](../../../TECH_DECISIONS.md), [PLANS](../../../PLANS.md), [governança e pendências](../../governance/PENDING_DECISIONS.md), [planos históricos](../../plans/completed/), [plano desta fase](../../plans/active/estabilizacao-relatorios-interface/PLAN.md), [constituição](../../../.specify/memory/constitution.md), [PRD Code-First](../../code-first-prd/README.md), seu [backlog](../../code-first-prd/implementation/backlog.md), specs 001–010 e evidências vinculadas nas seções anteriores. A [auditoria técnica de agosto](../audits/2026-08-28-auditoria-implementacao-infraestrutura.md) foi tratada como snapshot, sem transportar suas lacunas automaticamente ao código de outubro.

A apuração Git usou histórico de autores/committers, merges, listas de arquivos e comparações. A amostragem aprofundou: conexão Neon (#12); interface fixa de áreas (#16); arquivos das auditorias (`2fe5541`, `82ad404`); serviço do dashboard (#26); configuração compartilhada do mapa (`eee3bd8`); ciclo de escrita IHFR (`5389796`); validação de booleanos (`2277ce3`); cadastro ativo (`208d639`). Estatísticas e listas de arquivos complementaram a leitura em outros commits, sem alegar inspeção de todas as linhas.

A API do GitHub forneceu metadados, corpos, comentários e reviews dos 30 PRs, com paginação conferida. A primeira conexão restrita falhou e foi repetida com rede autorizada; uma consulta GraphQL excedeu o limite de nós e foi substituída por consulta menor, concluída sem páginas pendentes. Não foram consultados canais privados de reunião ou mensagens, nem obtidos depoimentos adicionais. Os exemplos raw pertencem à pesquisa complementar sobre ambiguidades, sem revisão bibliográfica externa.

Não houve nova execução de aplicação, testes, banco, migrations, build, navegador autenticado ou deploy nesta rodada documental. Não foi acessado o painel Vercel nem verificado o conjunto completo de telas publicadas. Resultados anteriores pertencem às datas, versões e ambientes indicados. O relatório não comprova cumprimento institucional, impacto socioambiental, validação científica ou distribuição exaustiva das contribuições. Essas limitações não alteram a integração Git diretamente verificada.
