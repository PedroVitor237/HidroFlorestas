# Fontes e integração da proposta Lovable

## Corte, mandato e resultado

Data: 2026-10-02, America/Fortaleza. Base inspecionada: `development@b80d7b0bf4d5a94d4af80294d77ee07675bdaa1b`, após atualização remota. Esta entrega contém somente [prompt autossuficiente](lovable-prompt.md), estas notas e [atualização do plano](PLAN.md). O prompt é o único texto a copiar integralmente para o Lovable; estas notas servem à revisão e integração pelo Codex. Não é necessário anexar documentos do repositório para o prompt funcionar.

`DECISAO_CONFIRMADA` — Origem: solicitação do usuário nesta conversa em 02/10/2026, confirmando merge do PR #31 e autorizando inspeção, documentos, commit/push em development. Proposta externa preferencialmente em repositório separado na conta do solicitante; avaliação e adaptação posteriores pelo Codex. Não alterar funcionalidades, criar branch/PR, fazer merge de trabalho, deploy ou enviar ao Lovable. Responsável pela execução documental: Codex; revisão visual/produto e integração futura: não especificado.

`EVIDENCIA_IMPLEMENTACAO` — Estado inicial `fix/usabilidade-pre-lovable@eb7a75334698d845e4412dc87e3306e27acd35b2`, upstream correspondente e worktree limpo. `git fetch origin` concluído; `git switch development`; atualização local `git merge --ff-only origin/development`, de `f8b2a47` a `b80d7b0`. Esse comando apenas acompanhou o merge já realizado; não integrou trabalho novo. Referências locais/remotas coincidiram na base inspecionada. Nenhuma alteração preexistente foi incorporada/revertida; demais worktrees e branches foram preservados.

`FATO_DOCUMENTADO` — Consulta `gh pr view 31 --json number,title,state,mergedAt,mergeCommit,baseRefName,headRefName,url,files`: [PR #31](https://github.com/PedroVitor237/HidroFlorestas/pull/31) `MERGED`, base development, origem fix/usabilidade-pre-lovable, merge `b80d7b0`, em 01/10/2026 às 18:30:58 UTC−03. `git merge-base --is-ancestor b80d7b0bf4d5a94d4af80294d77ee07675bdaa1b HEAD` retornou 0. Arquivos das três melhorias presentes e inspecionados; não se presume runtime publicado a partir do merge.

## Autoridade e fontes consultadas

Aplicam-se [AGENTS.md](../../../../AGENTS.md), [PROJECT_CONTEXT.md](../../../../PROJECT_CONTEXT.md), [TECH_DECISIONS.md](../../../../TECH_DECISIONS.md), [PLANS.md](../../../../PLANS.md), [constituição](../../../../.specify/memory/constitution.md), [SOURCE_AUTHORITY.md](../../../governance/SOURCE_AUTHORITY.md), [política Code-First](../../../code-first-prd/governance/source-policy.md) e [índice Code-First](../../../code-first-prd/README.md). Somente AGENTS.md raiz foi localizado. O [plano da fase](PLAN.md) e a [análise preliminar](analise-preliminar.md) foram lidos como histórico e orientação de continuidade, reconferindo os fatos utilizados no SHA atual. `docs/raw/**` não foi alterado nem precisou ser reaberto nesta entrega.

Código comprova comportamento implementado; decisões atuais governam intenção em seu recorte; imagens são referência complementar sem aprovação normativa. As escolhas de apresentação, arquitetura da proposta e verificações futuras são `RECOMENDACAO`, não novas decisões da equipe. Nenhuma validação científica foi produzida.

| Fontes inspecionadas | Alcance e uso |
|---|---|
| [Login](../../../../src/app/login/page.tsx), [cadastro](../../../../src/app/register/page.tsx), [estilos globais](../../../../src/app/globals.css), [layout raiz](../../../../src/app/layout.tsx), tema instalado `node_modules/tailwindcss/theme.css` e [package.json](../../../../package.json) | Paleta literal, resolução dos tokens Tailwind 4.2.1 local, Poppins, imagens/raios/sombra; dependências do destino. Não foram usados valores Tailwind 3 como equivalentes. |
| [Rotas da aplicação](../../../../src/app), layouts privados/workspace/dashboard/laboratório/admin, [sidebar](../../../../src/components/sidebar/index.tsx), [top bar](../../../../src/components/top-bar/index.tsx), [AdminShell](../../../../src/components/admin-shell/admin-shell.tsx) | Inventário completo dos caminhos de páginas, aliases e navegação; guards e disponibilidade de Sair. Inspeção focal dos componentes conectados, sem alegar auditoria de todo o código. |
| [Contexto de autenticação](../../../../src/contexts/auth.context.tsx), [tipos públicos](../../../../src/types/auth.type.ts), [contrato de auth](../../../../src/app/api/server/auth/auth.contracts.ts), serviços/middlewares e handlers auth | Cadastro ativo, DTO público, destinos, cookie, falhas e logout/retry; comparação de assinatura versus retorno real. |
| [Workspace](../../../../src/components/workspace/laboratory-workspace.tsx), [contratos de laboratório](../../../../src/app/api/server/laboratories), [serviço de laboratório](../../../../src/app/api/server/services/laboratories.service.ts), serviço/handlers de memberships | Limite cinco, nome, popup, confirmação textual, desativar/excluir, bloqueio por existência de área, promoção/rebaixamento. |
| [Áreas](../../../../src/components/areas), [contratos/autorização](../../../../src/app/api/server/areas), serviço de áreas e páginas/API vinculadas | Ponto, geolocalização opcional, preservação de edição tardia, campos/limites, OWNER/ADMIN/MEMBER, readOnly e escopo por recurso. |
| [Componentes de coleta](../../../../src/components/collections), [contrato temporal](../../../../src/app/api/server/collections/collection.contracts.ts), [data/hora](../../../../src/lib/collection-date-time.ts), tipos/serviço e rotas de coleta | Inicialização no browser, offsets, revisão, confirmação imutável, idempotência e Location; sem endpoint GET de listagem por área. |
| [Dados ambientais](../../../../src/components/environmental-data), [tipos](../../../../src/types/environmental-data.type.ts), [validação](../../../../src/types/environmental-data.validation.ts), [HTTP ambiental](../../../../src/app/api/server/environmental-data/environmental-data.http.ts), serviço e páginas | Todos os campos, enums, unidades, null/false/zero, dependência profundidade/fonte, conjunto único, revisão/retry/resultado incerto. |
| [Gestão IHFR](../../../../src/components/ihfr-diagnosis/ihfr-diagnosis-management.tsx), [resumo](../../../../src/components/ihfr-diagnosis/experimental-diagnosis-summary.tsx), [rótulos](../../../../src/components/ihfr-diagnosis/land-use-labels.ts), [tipos](../../../../src/types/ihfr-diagnosis.type.ts), [contratos/constants/handlers](../../../../src/app/api/server/ihfr-diagnosis), [serviço](../../../../src/app/api/server/services/ihfr-diagnosis.service.ts) e avaliador | Elegibilidade, versão/hash, seis operações HTTP, CREATE/REPLACE/revogar, recuperação terminal, ausência/insuficiência/incompatibilidade, estado científico e lifecycle. Cálculo permanece no backend; prompt não copia fórmula nem motor. |
| [Dashboard](../../../../src/components/dashboard), [tipos](../../../../src/types/dashboard.type.ts), serviço/contratos/handlers | Dois totais, dois eventos, destino, cursor e página de até 20 itens; ausência de risco, autores públicos e filtros ilustrados. |
| [Mapa territorial](../../../../src/components/territorial-map), [tipos](../../../../src/types/territorial-map.type.ts), serviço/contratos e [configuração comum](../../../../src/components/maps/map-config.ts) | Pontos das áreas, lista/painel/coletas, localização nula, leitura, fallback de tiles e atribuição. Sem geometria/cálculo/filtro analítico. |
| [Administração](../../../../src/components/user-administration/user-administration-page.tsx), [contratos/autoridade/HTTP](../../../../src/app/api/server/user-administration), serviço e handlers admin | Contas existentes, filtros/cursor, justificativa, revisão otimista, proteções de autoadministração/último ADMIN e auditoria. |
| [Spec 002](../../../../specs/002-criar-laboratorio/spec.md), [003](../../../../specs/003-area-registration-and-viewing/spec.md), [009](../../../../specs/009-user-administration/spec.md), [010](../../../../specs/010-active-public-signup/spec.md), [011](../../../../specs/011-usabilidade-pre-lovable/spec.md) e contrato UI 011 | Decisões focais e origens aprovadas: laboratório, acesso/ponto, administração, cadastro ativo e melhorias PR #31. Evidências históricas permanecem com seus limites. |
| [ADR-0001](../../../governance/ADR-0001-contrato-experimental-ihfr-v0-1.md) e [pendências globais](../../../governance/PENDING_DECISIONS.md) | TD-015/016, condições IHFR, PD-002 científica aberta e PD-018 resolvida. Não reabre ciência para gerar UI. |
| [Cinco imagens e README](../../../figma-references/README.md) | Todas abertas por `view_image` e examinadas visualmente em 02/10. Composição descrita no prompt, sem copiar dados pessoais exemplificativos. |

As specs 004–008 permanecem rastreabilidade contextual no plano/Code-First; contratos atuais foram conferidos diretamente no código conectado. Não se afirma revisão integral de cada documento nem reexecução das evidências antigas.

## Cobertura conferida

`EVIDENCIA_IMPLEMENTACAO` — Inventário de páginas via `find 'src/app/(private)' -type f` e APIs via `find src/app/api -type f -name route.ts`; handlers e DTOs focais inspecionados. Resumo para revisar a cobertura do prompt:

| Contexto | Rotas/fluxos cobertos | Estados e condições essenciais |
|---|---|---|
| Público | `/`, `/login`, `/register`, `/logout` | Cadastro ativo → sessão/workspace; login conforme destino; loading/validação/credenciais/rede; logout erro/retry. Landing não aprova funcionalidades anunciadas. |
| Workspace | `/workspace`, criar, acessar, configurações, desativar/excluir | Sem vínculos, lista, limite cinco, concorrência, confirmação de nome, proprietário, área impede exclusão; sem ingresso funcional. |
| Laboratório | `/dashboard/laboratories/{id}`, `/areas`, `/map`, `/members` | Seleção explícita, resumo/histórico independentes, vazio/erro/paginação; leitura em inativo; membros somente OWNER. |
| Área | `/areas/new`, `/areas/{id}` | Obrigatórios/opcionais, coordenadas/mapa/dispositivo, localizar negado/tardio; registro somente OWNER/ADMIN ativo. |
| Coleta | `/areas/{id}/collections/new`, `/collections/{id}` | Conta ativa vinculada de qualquer papel; agora único/editável, offset, calendário/futuro, revisão/corrigir/confirmar/replay, consulta imutável. |
| Ambiental | `/collections/{id}/environmental-data` e `/new` | Ausente, formulário, revisão, invalidade por campo, confirmar, rede/resultado incerto, único confirmado imutável, readOnly. |
| IHFR na coleta | Consulta e gestão no detalhe; APIs current/detail/eligibility/write/revoke/operation | MEMBER lê; OWNER/ADMIN ativo gerencia; confirmação explícita; quatro dimensões, declividade/uso, insuficiência/incompatibilidade, conflitos, replay/recuperação, vigência versus histórico. |
| Territorial | `/map`, lista/painel/destinos | Localização válida/nula; coletas confirmadas; sem áreas/sem coletas, API/tiles indisponíveis, seleção por teclado e atribuição. |
| Global | `/admin`, `/admin/users` | Somente ADMIN global ativo; busca/role/status/cursor, detalhe, alteração com motivo/revisão, auditoria, autoadmin/último ADMIN/conflito. |
| Compatibilidade | `/dashboard`, `/dashboard/collects`, `/dashboard/admin/users` | Redirects existentes, sem gerar telas fictícias. |

O prompt incorpora todos os 17 campos ambientais, quatro grupos obrigatórios, sete pares de uso da terra, matriz contextual, rotas, envelopes distintos e contratos de idempotência/temporal/IHFR/admin. IDs técnicos ficam em detalhes, sem sobrecarregar a tarefa primária. Instantes de ocorrência, observação do suplemento, confirmação e cálculo são distintos.

## Decisões preservadas e divergências tratadas

| Tema | Classificação, origem e tratamento |
|---|---|
| Melhorias integradas | `DECISAO_CONFIRMADA`: pedido pré-Lovable de 01/10, registrado no plano e spec 011; `EVIDENCIA_IMPLEMENTACAO`: PR #31. Logout nos três contextos, agora uma vez/editável e rótulos portugueses mantidos no prompt. Não nova feature. |
| Cadastro ACTIVE | `DECISAO_CONFIRMADA`: TD-017/spec 010, pedido de 28/09. Backend define ACTIVE e contexto estabelece sessão. Não copiar fluxo antigo de aprovação manual nem criar verificação paralela. |
| OWNER e seleção | `DECISAO_CONFIRMADA`: especificação 003, origem equipe em 14/09, especializando 002. Papel contextual explícito, um proprietário, sem seleção automática ou transferência; papéis globais independentes. |
| Localização ilustrada como pendente | `FATO_DOCUMENTADO`: README Figma conserva alternativas. `DECISAO_CONFIRMADA` posterior da IMP-003 escolheu ponto final e geolocalização opcional; `EVIDENCIA_IMPLEMENTACAO`: formulário coordenadas/clique/dispositivo. Usa-se a decisão do recorte, sem promover polígonos ou geocodificação. README histórico não é reescrito. |
| Desativar/excluir | `DECISAO_CONFIRMADA`: ampliação da spec 002 inclui essas ações com confirmação. `EVIDENCIA_IMPLEMENTACAO`: serviço impede exclusão já com área, embora mensagem diga “dados científicos”. Prompt exige ausência de áreas; não promove a ambiguidade da mensagem a permissão de apagar área sem coleta. |
| Dados opcionais versus suficiência | `EVIDENCIA_IMPLEMENTACAO`: slope opcional em capture v1. `DECISAO_CONFIRMADA`: ADR §4 exige slope + landUse para T e ≥2 scores por dimensão. UI explica insuficiência; não torna campo globalmente obrigatório nem atribui score zero a ausência. `landType` livre não é suplemento científico. |
| IHFR e versões | `DECISAO_CONFIRMADA`: TD-015/016 e ADR; manifesto ativo v0.1.1, suplemento v0.1.0, avaliador TS v0.1.0. `PENDENCIA_DE_DECISAO`: PD-002, validação científica/campo/calibração. Prompt preserva os quatro qualificadores, sem outro motor/IA/fórmula client-side. |
| 400/422 IHFR | `DECISAO_CONFIRMADA`: PD-018, origem confirmação explícita de 23/09; handlers atuais conferidos. Malformado 400, seleção bem formada incompatível 422 terminal; GET operation recupera 200. Insuficiência 200 é resultado terminal sem novo diagnóstico, não falha genérica. |
| Figma versus funcionamento | `FATO_DOCUMENTADO`: imagens complementares não normativas. Cards com foto/status/datas, busca por e-mail/mês, legenda de risco, HIDRO-AI, PDF, perfil e upload não têm contratos conectados neste recorte. Prompt aproveita composição e exclui essas ações. O terceiro cartão ilustrado não vira métrica inventada. |
| Paleta divergente entre acessos | `EVIDENCIA_IMPLEMENTACAO`: login green-600/amber-700 e cadastro #00B51A/#A1640B são valores diferentes. `RECOMENDACAO`: tokens documentados, acentos contidos e ajuste de contraste avaliado; nenhuma falsa equivalência ou paleta nova aprovada. |
| Feedback/foco atual | `EVIDENCIA_IMPLEMENTACAO`: cadastro pode retornar sem feedback para campo vazio, labels sem associação explícita; login contém utilitário de foco concatenado e links `#`. `RECOMENDACAO`: corrigir apresentação/semântica na proposta e não reproduzir esses defeitos como requisitos. Código atual não foi alterado. |
| Campos do cadastro/API | `EVIDENCIA_IMPLEMENTACAO`: UI pede os quatro campos; sign-up server-side não tem parser fechado tão estrito quanto login, e tipagem não equivale a validação runtime. `RECOMENDACAO`: UI clara/adapter com payload mínimo. Endurecimento do backend exige recorte futuro, sem impor nova política de senha ou corrigir nesta documentação. |
| Autoridade global no DTO de auth | `EVIDENCIA_IMPLEMENTACAO`: me retorna somente user; sign-in retorna destination; layouts server-side conhecem papel. `RECOMENDACAO`: contexto de permissão da demonstração é substituível; ao integrar, usar guards/layouts reais. Não inferir ADMIN por nome/destino nem acrescentar role ao DTO. |
| Acesso às coletas/histórico IHFR | `EVIDENCIA_IMPLEMENTACAO`: detalhe da área não lista coletas; mapa/histórico dão acesso. API collections é POST, sem listagem; IHFR GET detail exige ID e não lista histórico completo. `RECOMENDACAO`: melhorar descobribilidade com dados existentes; qualquer endpoint novo exige spec posterior. Não transformar ausência de listagem em design desejado. |
| Mapas e gráficos globais | `DECISAO_CONFIRMADA`: OSM escolhido no relato do usuário de 01/10 registrado no plano; `EVIDENCIA_IMPLEMENTACAO`: Leaflet/React-Leaflet e config comum. TECH_DECISIONS/PD globais ainda têm alternativas antigas; reconciliação já pendente, fora dos três caminhos autorizados. TD-010 aprova direção Plotly futura, não funcionalidade pronta. Prompt não amplia mapas/gráficos. |
| Administração PENDING | `PENDENCIA_DE_DECISAO`: spec 009 mantém aberto limitar PENDING à pré-ativação; contrato atual aceita todos os estados. Prompt preserva apresentação do contrato atual sem aprovar nova política ou exigir PENDING no cadastro público. |
| Exclusões desta fase | `DECISAO_CONFIRMADA`: pedido de 01/10 e mandato de 02/10 adiam Município/UF automático, rascunhos e descrições ambientais não aprovadas. Não confundir descrição livre já contratada da área com critérios científicos por categoria. |

Não foi identificado conflito que exija decidir ciência/produto para escrever esta proposta. As pendências abaixo delimitam integração e itens futuros, sem impedir a entrega documental.

## Paleta rastreável e limites de acessibilidade

`EVIDENCIA_IMPLEMENTACAO` — Hexadecimais, opacidades, raios e sombra do prompt são literais de login/register; Poppins vem do layout e globals. OKLCH amber-700/green-600/red-700 vêm do tema efetivo do Tailwind 4.2.1 instalado, corroborado pelo lockfile; green-700 já aparece nos componentes focais e oferece opção existente para avaliar contraste. O tema não foi editado e nenhum asset foi gerado.

`RECOMENDACAO` — Manter fundo #F9FAFB/branco, #3E3E3E no texto e #EFEFEF nos campos; ocre em hierarquia, verde nas ações, azul em navegação/água, com uso moderado. Não usar #858585 para informação essencial pequena sem medir, nem supor que branco sobre #00B51A cumpre AA. Ajustes visuais para contraste devem ser apresentados como proposta, não alteração já aprovada da identidade. Contraste, renderização e leitura assistiva serão medidos sobre a proposta concreta; não há PASS de acessibilidade nesta entrega documental.

## Imagens recomendadas como anexos

Todas as cinco foram inspecionadas visualmente. `RECOMENDACAO`: anexar na ordem abaixo; se houver limite no envio, priorizar início, detalhe ambiental e cadastro de área, completando as duas restantes em mensagem seguinte. O texto funciona mesmo sem anexos. Nomes/e-mails exemplificativos visíveis devem ser mascarados antes de compartilhar, e não reutilizados em dados sintéticos; não foram criadas versões sanitizadas nesta execução, cujo escopo é somente os três documentos.

| Anexo | Elementos úteis e adaptação concreta |
|---|---|
| [entrar-ou-criar-laboratorio.jpg](../../../figma-references/entrar-ou-criar-laboratorio.jpg) | Cabeçalho branco, saudação e duas opções amplas. Criar funcional; ingresso marcado indisponível/omitido. Não reproduzir a faixa preta/paleta lateral como navegação. |
| [inicio-apos-acessar-laboratorio.jpg](../../../figma-references/inicio-apos-acessar-laboratorio.jpg) | Barra lateral, mapa largo, cartões e histórico. Usar somente dois totais, eventos e paginação reais; sem legendas de risco/filtros ilustrados. |
| [areas-monitoradas.jpg](../../../figma-references/areas-monitoradas.jpg) | Grade de cartões e CTA no cabeçalho, nome e detalhe. Usar ícone/neutro em vez de foto, coordenadas reais do DTO; não inventar status de área/última coleta. |
| [area-monitorada-com-formulario-de-dados-da-agua.jpg](../../../figma-references/area-monitorada-com-formulario-de-dados-da-agua.jpg) | Mapa/contexto, hierarquia de indicadores e grupos expansíveis. Seguir fluxo coleta/medição real; painel lateral pode receber contexto, nunca HIDRO-AI/PDF. Salinidade e disponibilidade são enums, não medidas ilustradas. |
| [cadastro-de-nova-area.jpg](../../../figma-references/cadastro-de-nova-area.jpg) | Título, alinhamento de campos, confirmação destacada. Reorganizar com os sete campos contratados e seletor de ponto; sem upload/polígono. |

Opcional, se desejar maior fidelidade de marca: fornecer também `src/assets/logo/logo-hf.png` e `src/assets/logo/logo.png` como assets; imagem decorativa do cadastro `src/assets/auth/register-background.png` pode ser anexada. O prompt não exige esses anexos nem pede abrir seus caminhos; usa wordmark substituível na ausência. Não anexar .env, dados reais, dumps ou código de servidor para este objetivo.

## Como gerar e receber o repositório

`FATO_DOCUMENTADO` externo — Na consulta de 02/10/2026, a documentação oficial informa que conectar um projeto Lovable ao GitHub cria um novo repositório e não importa o HidroFlorestas existente. Isso sustenta a preferência já autorizada por proposta separada. [GitHub Git sync e limitações](https://docs.lovable.dev/integrations/github#limitations).

`FATO_DOCUMENTADO` externo — A FAQ consultada informa TanStack Start com SSR para novos apps desde 13/05/2026; apps anteriores usam React/Vite. Portanto, não presumir exportação Next.js nem afirmar que todo projeto Lovable será Vite. [FAQ — How Lovable works](https://docs.lovable.dev/introduction/faq#how-lovable-works).

`RECOMENDACAO` — Procedimento a cargo do solicitante, posterior a esta entrega:

1. Criar projeto novo de proposta e colar todo o conteúdo de lovable-prompt.md. Anexar as referências como inspiração com os cuidados descritos; não fornecer documentos locais como dependência.
2. Conferir que o preview usa adapter/fixtures e cenários fictícios, sem ativar Cloud/Supabase/auth/cálculo de domínio. Se o Lovable sugerir esses serviços, reiterar o escopo frontend/demonstração.
3. Exportar/sincronizar o projeto para novo repositório na própria conta, por Project settings → Git → GitHub, conforme opções efetivamente disponíveis na conta. Esta etapa é do usuário; nenhuma conexão/repo externo foi criada aqui.
4. Entregar ao Codex URL do repositório, branch/SHA a avaliar, como executar o preview e README com rotas, componentes, adapter, estados e diferenças da arquitetura. Relatar quais decisões visuais quer manter e quais quer rever. Não é necessário transmitir credenciais de backend.
5. Revisar a proposta concreta antes de autorizar integração funcional. Repositório separado e preview não significam merge/deploy aprovado nem garantem reaproveitamento integral.

## Adaptação posterior ao HidroFlorestas

`EVIDENCIA_IMPLEMENTACAO` — Destino: Next.js 16.3.6/App Router, React 19.2.4, TypeScript, Tailwind 4, Lucide; APIs server-side existentes, Prisma/PostgreSQL; Leaflet 1.9.4/React-Leaflet 5.0.0, auth por cookie. Versões verificadas no package.json; futuras execuções devem reconferir o baseline.

Todas as orientações deste roteiro são `RECOMENDACAO`. A estimativa e o plano por recortes dependem do código recebido; não há promessa de integração automática.

| Parte gerada | Adaptação e condição de aceite |
|---|---|
| Rotas, links, loaders/SSR TanStack ou React Router/Vite | Mapear telas para rotas/layouts App Router, retirar infraestrutura paralela de roteamento e manter UUIDs/contexto/destinos. Componentes visuais podem ser portados; entrypoint/build não substituem o projeto. |
| Guards e sessão fictícia | Remover seletor/mock de sessão do produto, reutilizar AuthProvider/requireAuth/requireAdmin/layouts e permissões atuais. Auth/me não fornece role; resolver visibilidade pelo servidor/contexto autorizado, sem novo campo/endpoint implicitamente aprovado. |
| Adapter de dados e fixtures | Substituir pelo transporte real respeitando envelopes, nulls, erros, no-store e cookie. Confinar fixtures à demonstração/testes. Não copiar backend simulado. |
| Formulários | Preservar validators compartilhados e máquina de tentativa; labels traduzidos transportam valores técnicos. Reutilizar conversão temporal/idempotência existentes; não corrigir silenciosamente hora ou trocar chave de tentativa incerta. |
| IHFR | Reutilizar gestão e contratos atuais; versão/hash centralizados; manter server-side, operação terminal e reconsulta de vigente/elegibilidade. Scores/explicações do mock não podem permanecer como resultados reais. |
| Mapas e imagens | Mapa client-only com import dinâmico/altura explícita, CSS/ícones/config/atribuição existentes; adaptar next/image e assets reais. Sem nova geometria, geocodificação ou provedor obrigatório. |
| Tokens, Tailwind, fontes e dependências | Transpor tokens com namespace/escopo, revisar contraste e utilitários v4, usar Poppins/next/font e Lucide reais; inspecionar bibliotecas geradas antes de adicioná-las. Evitar sobrescrever globals, lockfile ou configuração por cópia integral. |
| Administração | Preservar DTO/revision/expected values, reason, auditoria, guards e proteção do último ADMIN. Melhorias de layout/foco não alteram política de conta. |

Próxima execução deve comparar proposta × prompt × baseline atualizado; registrar lacunas e pendências materiais. Funcionalidades alteradas usam o fluxo Spec Kit e plano por feature, com autorização correspondente; ajustes visuais seguem recorte revisável. Validar jornada e regressões de autorização, instante/offset, null/false/zero, imutabilidade, idempotência, lifecycle e estados incertos. Executar testes pertinentes existentes de UI, unitários/contrato e, quando o ambiente estiver explicitamente preparado, integração/E2E. Medir contraste, teclado, diálogos, 375/768/1440px e zoom 200% sobre a implementação concreta. Merge/deploy serão tratados pelo mandato futuro.

## Pendências, bloqueios e limites

Todas as pendências sem designação têm responsável e prazo `não especificado`. Não bloqueiam a proposta documental; bloqueiam somente a ampliação correspondente.

| ID local | Classificação e pendência | Encaminhamento |
|---|---|---|
| LOV-01 | `PENDENCIA_DE_DECISAO`: seleção visual final, ajustes de contraste e código/stack efetivamente gerados. | Avaliar preview/repositório concretos antes de integrar. |
| LOV-02 | `PENDENCIA_DE_DECISAO`: descrições/limiares de uso da terra (FASE-04). | Permanecem excluídos; solicitar validação de domínio em recorte próprio. |
| LOV-03 | `PENDENCIA_DE_DECISAO`: Município/UF automático e rascunhos (FASE-02/05, ADIADO). | Novas specs/decisões de produto/dados; não incluir no frontend atual. |
| LOV-04 | `PENDENCIA_DE_DECISAO`: política de retorno de contas a PENDING, já aberta na spec 009. | Preservar contrato observado até confirmação; não reinterpretar TD-017. |
| LOV-05 | `PENDENCIA_DE_DECISAO`: PD-002 científica, calibração e campo. | Preservar experimentalidade; testes técnicos não resolvem ciência. |
| LOV-06 | `PENDENCIA_DE_DECISAO`: reconciliação canônica de mapas/OSM/Leaflet anteriormente registrada no plano. | TECH_DECISIONS/PENDING_DECISIONS fora dos caminhos autorizados; atualização necessária em rodada autorizada, preservando histórico. |
| LOV-07 | `RECOMENDACAO`: revisão futura da validação de signup, descobribilidade das coletas e eventuais novos contratos de listagem. | Defeitos/lacunas registrados não viram funcionalidades desejadas; não autoriza backend novo nesta proposta. |

Bloqueios desta execução: nenhum. Há ausência de validação runtime nesta rodada e de evidência publicada nova. Evidências dos testes do PR #31 continuam históricas no plano/spec 011; não foram reexecutadas nem promovidas a PASS atual. Arquivos canônicos globais e registro de documentos foram preservados; o plano local registra os novos entregáveis, sem reconciliação global ou nova decisão técnica/científica.

## Revisão e verificações desta entrega

PASS documental: prompt lido isoladamente, conferindo que todas as informações necessárias estão no texto; não depende de links locais/assets/anexos. Rotas no prompt são contratos de navegação, não pedidos de leitura de arquivos. `python3 /tmp/hidro-lovable-doc-check.py` conferiu 86 links locais/âncoras, 20/20 rotas de página, 27/27 caminhos HTTP, 17 campos ambientais, sete pares de uso da terra, cinco identidades de versão/hash, quatro tokens OKLCH/lockfile, whitespace e escopo de três arquivos. Revisão textual, `git diff --check` e `git diff --cached --check` sem ocorrência; diff staged restrito aos três documentos autorizados. Nenhum dado real de pessoa/segredo/valor de ambiente foi transcrito para os entregáveis; o hash IHFR é identidade pública do contrato.

Não executados: testes de aplicação, lint, typecheck, build, navegador, banco, migrations ou deploy. A alteração é exclusivamente documental; não produziria evidência nova de comportamento ao rodar suites de aplicação, e runners de banco podem preparar fixtures. A inspeção visual refere-se às imagens, não ao runtime da aplicação ou ao frontend ainda inexistente. Resultado dos checks e encaminhamento de publicação registrados no PLAN.md; SHA publicado e confirmação remota serão informados na entrega.
