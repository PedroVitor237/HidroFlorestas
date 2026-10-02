# Proposta de frontend — HidroFlorestas

## Contexto e objetivo

Crie uma proposta navegável de frontend web em português do Brasil para o HidroFlorestas, plataforma de registro e consulta de monitoramento ambiental por laboratórios. A jornada principal é conta → laboratório escolhido → área de monitoramento → coleta confirmada → medições ambientais confirmadas → diagnóstico IHFR experimental, quando houver condições para isso.

O objetivo desta entrega é avaliar design, organização, usabilidade, acessibilidade e responsividade. O Codex avaliará o código gerado e adaptará a proposta posteriormente ao sistema existente. Preferimos receber o resultado em um repositório separado na conta GitHub do solicitante. Não há autorização para modificar o repositório HidroFlorestas, integrar automaticamente ou publicar em produção.

Este texto contém o contexto necessário; não pressupõe acesso a arquivos locais, ao repositório original ou ao backend. Eventuais imagens anexadas são referências complementares de composição. As regras funcionais e os contratos descritos aqui prevalecem sobre textos, campos, indicadores e ações dessas imagens. As orientações de design e organização abaixo são RECOMENDACAO para esta proposta, sujeita à avaliação humana; não constituem novas decisões científicas ou de produto.

## Público e tarefas principais

Pessoas pesquisadoras e equipes de campo registram ocorrências e observações; responsáveis e administradores de laboratório organizam áreas e gerenciam diagnósticos; administradores globais gerenciam contas. Privilegie leitura clara, preenchimento sem ambiguidade, revisão antes de confirmação e consulta da origem de cada resultado.

Separe os dois níveis de papéis: global (`USER`, `ADMIN`, `DEVELOPER`, `MODERATOR`) e contextual do laboratório (`OWNER`, `ADMIN`, `MEMBER`). Um administrador de laboratório não é automaticamente administrador global. Um administrador global precisa de vínculo para acessar dados de um laboratório.

## Identidade visual

Siga primeiro a identidade real das páginas atuais de login e cadastro. Use neutros como base e verde, azul e ocre como acentos controlados. Evite neon, brilho, glow, fundos saturados extensos e gradientes intensos. Não extraia a paleta principal das imagens complementares.

| Cor real ou token resolvido | Aplicação na proposta |
|---|---|
| `#F9FAFB` | Fundo geral claro. |
| `#FFFFFF` | Cabeçalhos, cartões, formulários e superfícies. |
| `#EFEFEF` | Fundo de campos e áreas discretas de apoio. |
| `#3E3E3E` | Texto principal e conteúdo legível. |
| `#858585` | Ícones e apoio; medir contraste antes de usar em texto pequeno ou placeholder essencial. |
| `#A1640B` | Ocre do cadastro: títulos, rótulos e links de apoio. |
| `oklch(55.5% 0.163 48.998)` | `amber-700` real do login: títulos e rótulos. Não é o mesmo valor que `#A1640B`. |
| `oklch(62.7% 0.194 149.214)` | `green-600` real do botão de login: ação/identidade verde, em áreas contidas. |
| `#00B51A` | Verde real do cadastro e da marca: acento localizado, sem intensificar a saturação. Não é equivalente a `green-600`. |
| `#0084DD` | Azul real da marca e hover de links: água, navegação secundária e acentos. |
| `#F3FAFF` → `#F4F4F4` | Gradiente muito suave do painel ilustrado do cadastro, com camada branca a 75% sobre eventual imagem. |
| Preto a 10% / 20% | Bordas e divisores discretos. |
| `oklch(52.7% 0.154 150.069)` | `green-700`, já usado no produto: alternativa existente para controles/foco com maior contraste, após medir. |
| `oklch(50.5% 0.213 27.518)` | `red-700`, já usado para erros no login: feedback semântico com texto e ícone. |

O sistema usa Tailwind CSS 4; os valores OKLCH acima são os tokens efetivos, não os hexadecimais antigos do Tailwind 3. Centralize os tokens da proposta. Se precisar de variação para acessibilidade, documente-a como ajuste proposto e meça o contraste; não trate as diferenças entre login e cadastro como uma paleta já unificada. Não use branco sobre todo verde/azul por padrão sem verificar contraste.

Use Poppins com fallback sans-serif. Inspire-se nos cartões de raio 20px, controles de raio 10px e sombra suave `0 4px 18px -3px rgba(0,0,0,0.25)` das páginas de acesso. Use espaçamento generoso, títulos claros e ícones Lucide acompanhados por rótulos. No login, cartão central de cerca de 500px; no cadastro desktop, painel ilustrado à esquerda e formulário à direita; no celular, formulário em uma coluna. A imagem decorativa é opcional. Se a marca original não for anexada, use um wordmark textual HidroFlorestas temporário e substituível; não apresente um novo logotipo como oficial.

### Tradução textual das cinco referências visuais

1. **Entrada/criação de laboratório:** cabeçalho branco com marca à esquerda e identidade da pessoa à direita; acolhimento central, título hierárquico e dois blocos de ação lado a lado. Aproveite a organização para explicar o contexto inicial. Criar laboratório é funcional; entrar/solicitar participação em outro laboratório ainda não é. Essa segunda opção pode ser omitida ou claramente marcada “Ainda indisponível”, sem ação de ingresso.
2. **Início após acessar laboratório:** cabeçalho, navegação lateral compacta, título de atividade, mapa largo, cartões de resumo e histórico abaixo. Reorganize em resumo e mapa navegáveis sem perder o laboratório selecionado. Use somente os totais e eventos contratados; não copie busca por e-mail, filtro por mês, legenda de risco ou cartões sem dados.
3. **Áreas monitoradas:** título à esquerda, “Nova área” à direita e grade de cartões com nome e “Ver detalhes”. Preserve essa hierarquia e use coordenadas/Município/UF quando informados. Fotografias, datas de última coleta e status individual da área ilustrados não têm contrato nesse cadastro; não invente upload nem esses campos. Use um ícone ou bloco neutro em lugar da foto.
4. **Detalhe da área e dados da água:** coluna principal com localização e informações, cartões de indicadores e grupos ambientais expansíveis. Aproveite a sequência contexto → dados → diagnóstico e os grupos Água, Solo, Vegetação, Terreno; no desktop pode haver painel lateral de contexto, no celular empilhe. Não reproduza HIDRO-AI, baixar PDF, configurações da área ou valores/unidades exemplificativos como capacidades reais.
5. **Cadastro de área:** formulário sobre superfície branca com título claro, campos alinhados e confirmação destacada. Pode ser uma página ou um diálogo acessível, mantendo as rotas. Inclua os campos reais e mapa de seleção de ponto. Não copie o upload ilustrado, não demarque polígonos.

## Inventário de telas e navegação

Os parâmetros entre chaves são UUIDs opacos; os caminhos abaixo são rotas de navegação ou HTTP, não arquivos que você precisa abrir. Preserve a associação laboratório → área → coleta. Para tornar a tabela legível, `L = /dashboard/laboratories/{laboratoryId}` e `C = L/areas/{areaId}/collections/{collectionId}`; expanda esses prefixos no roteamento gerado.

| Tela/rota | Conteúdo e ações |
|---|---|
| `/` | Apresentação curta do monitoramento e acesso a Entrar/Criar conta. Remova promessas de IA, previsões ou resultados científicos definitivos. |
| `/login` | E-mail, senha, mostrar/ocultar senha, entrar e link de cadastro. |
| `/register` | Nome, sobrenome, e-mail, senha, mostrar/ocultar, criar conta e voltar ao login. |
| `/logout` | Encerramento em andamento; erro e tentativa novamente; sucesso leva ao login. |
| `/workspace` | Sem laboratório, lista de laboratórios acessíveis, criação, limite atingido e configurações do laboratório em painel/diálogo. Escolha explícita de qual laboratório acessar. |
| `L` | Resumo do laboratório: total de áreas e coletas confirmadas, histórico paginado de áreas criadas/coletas confirmadas, atualização e links aos detalhes. |
| `L/areas` | Grade/lista de áreas, estado vazio e “Nova área” quando permitido. |
| `L/areas/new` | Cadastro de ponto e revisão explícita da localização antes de cadastrar. |
| `L/areas/{areaId}` | Nome, ponto no mapa, coordenadas, informações opcionais, data de cadastro e registrar coleta quando permitido. |
| `L/areas/{areaId}/collections/new` | Metadados da coleta: ocorrência, fuso, revisão, corrigir e confirmar. |
| `C` | Coleta imutável, ocorrência/confirmação distintas, link aos dados ambientais e diagnóstico atual ou ausência. Gestão IHFR no próprio contexto da coleta, quando permitida. |
| `C/environmental-data` | Conjunto confirmado ou ausência; link para cadastrar quando permitido. |
| `C/environmental-data/new` | Quatro grupos de medições, validação, revisão, corrigir e confirmação. Se já houver conjunto confirmado, mostrar consulta. |
| `L/map` | Visão territorial: mapa de pontos, lista alternativa acessível, painel de área selecionada e suas coletas confirmadas com links. |
| `L/members` | Proprietário consulta membros e promove/rebaixa entre membro e administrador de laboratório. |
| `/admin` | Visão geral administrativa e acesso à gestão de contas. |
| `/admin/users` | Busca/filtros/paginação de contas, detalhe selecionado, alteração de estado/papel com justificativa/confirmação e auditoria paginada. |

As rotas antigas `/dashboard` e `/dashboard/collects` levam a `/workspace`; `/dashboard/admin/users` leva a `/admin/users`. Não crie módulos separados para elas.

No ambiente autenticado, ofereça marca, identidade da pessoa, laboratório selecionado quando houver e Sair sempre visível/acessível, inclusive antes de escolher laboratório e na administração. Dentro do laboratório, navegação Resumo, Áreas, Mapa e Membros somente para proprietário. Ofereça retorno ao workspace e trilha de contexto/voltar nas telas profundas. Administração global aparece somente para quem tem autoridade global. Não selecione automaticamente o primeiro laboratório nem o recém-criado.

Não há uma listagem HTTP independente de coletas por área. A navegação às coletas já confirmadas existe pelo mapa territorial e histórico; preserve esses acessos. Pode melhorar sua apresentação usando esses mesmos dados, sem inventar endpoint ou metadados. Não ofereça Perfil editável, recuperação de senha ou links vazios como ações funcionais.

## Fluxos, permissões e comportamentos

### Conta e sessão

Cadastro público cria conta `ACTIVE` nesta fase de testes com usuários e estabelece a sessão, levando ao workspace. Não exigir aprovação manual, convite ou verificação de e-mail. Login só permite contas `ACTIVE`; credenciais inválidas ou conta não elegível usam mensagem genérica “Email ou senha inválidos.”. Login de `ADMIN` global leva a `/admin`; demais papéis levam a `/workspace`.

Na integração real, a sessão pertence ao backend existente e usa cookie HttpOnly com requisições autenticadas; não guardar tokens em localStorage, não criar JWT ou login paralelo. O perfil público contém somente `{firstName,lastName,image}`; não deduzir privilégios desse DTO nem acrescentar campos privilegiados ao cadastro. Permissões/contexto vêm de dados autorizados pelo sistema e precisam ser adaptados às verificações reais de servidor.

Sair só declara sucesso após resposta confirmada. Falha conserva o estado e oferece repetir. Sessão expirada leva ao login sem revelar recursos restritos. A confirmação de uma operação de dados não pode ser declarada apenas porque um botão foi acionado.

### Laboratórios e membros

Qualquer pessoa autenticada e ativa pode criar laboratório, informando somente nome (1–100 caracteres após trim); nomes repetidos são permitidos. O criador recebe `OWNER`; há exatamente um proprietário e nenhuma transferência de propriedade. Limite de cinco laboratórios acessíveis por pessoa, contando criações e participações, inclusive laboratórios inativos.

Configurações mostram nome, data, status e membros. Somente responsável/proprietário pode desativar ou excluir, com digitação exatamente igual ao nome do laboratório e confirmação explícita. Desativação conserva dados e permite consulta somente leitura; reativação não está disponível. Exclusão é recusada quando já houver qualquer área cadastrada. Não interpretar a mensagem genérica de “dados científicos” como autorização para excluir um laboratório que tenha áreas sem coletas. Não exibir código de acesso. Não implementar ingresso, convite ou adição/remoção de membros.

Somente `OWNER` pode promover/rebaixar vínculos existentes entre `MEMBER` e `ADMIN`, usando papel esperado para detectar concorrência. Proprietário não é alterável. Em laboratório inativo, não permitir essa escrita.

| Ação no laboratório | OWNER | ADMIN contextual | MEMBER |
|---|---|---|---|
| Consultar áreas, coletas, medições, diagnóstico, resumo e mapa | Sim | Sim | Sim |
| Criar área em laboratório ativo | Sim | Sim | Não |
| Registrar coleta e conjunto ambiental em laboratório ativo | Sim | Sim | Sim |
| Criar/substituir/revogar IHFR em laboratório ativo | Sim | Sim | Não |
| Gerenciar papéis dos vínculos existentes | Sim, ativo | Não | Não |
| Desativar/excluir laboratório | Somente proprietário, com condições acima | Não | Não |

Todos exigem conta ativa, vínculo atual e recursos associados ao mesmo laboratório. Laboratório inativo permite somente leitura dos dados e bloqueia mutações de domínio; a exclusão de laboratório vazio pelo proprietário segue sua regra específica. Ocultar/desabilitar ações melhora a UX, mas não substitui autorização do servidor. Acesso ausente ou recurso fora do contexto retorna estado genérico de recurso não encontrado; não revelar existência de dados de terceiros.

### Área e localização

Área é um ponto confirmado. Permitir coordenadas manuais, seleção por clique no mapa e localização do dispositivo somente após ação explícita. A resposta tardia de geolocalização não sobrescreve edições posteriores; pedir revisão antes de cadastrar. Negativa, timeout ou ausência de localização mantém os campos e oferece entrada manual/mapa. Município e UF são opcionais e manuais; não usar geocodificação reversa. Não há edição/exclusão de áreas neste recorte.

### Coleta e ocorrência

Laboratório e área já estão definidos pelo contexto; não pedir identidade de autor, pois ela é derivada no servidor. Data/hora de ocorrência é obrigatória. Inicializar uma única vez por nova tentativa com o momento do dispositivo, no navegador; permitir editar e preservar alterações durante renderizações, revisão e falhas. Oferecer fuso do dispositivo ou offset UTC manual visível e ajustável. Preservar segundos e milissegundos quando presentes.

Transportar `occurredAt` em RFC3339 com segundos e `Z` ou offset explícito, por exemplo `2026-10-01T14:35:20.125-03:00`, que representa o mesmo instante que `2026-10-01T17:35:20.125Z`. Nunca anexar `Z` diretamente a uma hora local. Offset máximo ±14:00, minutos 00–59, ±14 somente com minutos 00; `-00:00` é inválido. Validar calendário real, hora e instante não futuro. Em transições de horário sazonal, não corrigir silenciosamente hora inexistente; hora repetida exige escolha explícita de offset.

Revisão mostra laboratório, área, ocorrência legível e offset antes de confirmar. “Corrigir” volta com dados preservados; somente confirmar persiste. A consulta conserva o offset originalmente declarado, mesmo em dispositivo de outro fuso. `confirmedAt` é o instante separado da confirmação no sistema. A coleta confirmada é imutável: não oferecer editar/apagar. Confirmá-la não salva medições nem calcula IHFR automaticamente.

### Dados ambientais

Cada coleta comporta um único conjunto ambiental confirmado, contrato `ihfr-measurement-v1`, imutável. Formulário → validação integral → revisão dos quatro grupos → corrigir ou confirmar → consulta. Antes de confirmar, o preenchimento existe apenas na página, sem rascunho persistido/localStorage, autosave ou promessa de retomada.

Obrigatórios não podem ser `null`; opcionais vazios viram `null`, nunca zero ou falso. Zero e “Não” são valores informados. JSON envia números finitos, booleanos e enums técnicos, não textos traduzidos ou números como strings. Pode melhorar a entrada de decimais em pt-BR, convertendo claramente para número antes do envio. Não adicionar regras ambientais, limites ou descrições sem definição aprovada.

### IHFR experimental

Consulta aparece no detalhe da coleta; somente proprietário/administrador contextual de laboratório ativo gerencia. Criar, substituir e revogar são ações explícitas com confirmação. Não calcular automaticamente ao salvar dados, trocar área ou abrir tela.

Mostrar sempre “Diagnóstico IHFR experimental” e a mensagem “Validação científica pendente; sujeito a recalibração; não aprovado como contrato científico definitivo”. Preservar também os qualificadores `CONTRATO_EXPERIMENTAL`, `VALIDACAO_CIENTIFICA_PENDENTE`, `SUJEITO_A_RECALIBRACAO`, `NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO`, acessíveis em detalhes. Não comunicar validação universal, precisão científica estabelecida ou previsão.

O backend determina elegibilidade e calcula. Exige coleta confirmada, conjunto ambiental compatível, pelo menos dois scores disponíveis em cada dimensão W/S/V/T, as quatro dimensões válidas, declividade informada e uso predominante da terra. Declividade é opcional na captura, porém necessária ao diagnóstico; sem ela, informar insuficiência. Densidade de drenagem e elevação são contextuais e não pontuam nesta versão. `landType` livre da área não substitui `landUseType` do suplemento. Medições confirmadas ausentes não podem ser completadas por edição retroativa; não invente ação de correção desses registros.

O suplemento tem uso predominante (única categoria ou ausência), origem (`FIELD_OBSERVATION` = Observação em campo; `AUTHORIZED_RECORD` = Registro autorizado) e data/hora da observação obrigatória, enviada como instante RFC3339/ISO com fuso. Essa data é distinta da ocorrência da coleta; no código atual é preenchida pela pessoa e convertida para UTC. Não aplicar automaticamente a sugestão inicial da coleta a esse campo nem confundir os instantes.

| Rótulo visível | Valor técnico de landUseType |
|---|---|
| Floresta | `FOREST` |
| Sistema agroflorestal (SAF) | `AGROFORESTRY` |
| Agricultura | `CROPLAND` |
| Pastagem | `PASTURE` |
| Pastagem degradada | `DEGRADED_PASTURE` |
| Solo exposto | `BARE_SOIL` |
| Área urbanizada | `URBAN` |

Oferecer “Indeterminado ou ausente”, enviado como ausência ou `null`, preservando a possibilidade de `INSUFFICIENT_DATA`. Ajuda: “Selecione um único uso predominante. Se não puder determinar, mantenha indeterminado; pode haver insuficiência de dados. Solo exposto aqui é uma categoria territorial, diferente do percentual de solo exposto nos dados ambientais.” Não criar descrições ambientais por categoria, exemplos de enquadramento ou limiares.

Sem diagnóstico vigente, mostrar ausência, nunca score zero. Dados insuficientes mostram motivos; versão incompatível mostra erro próprio. Uma tentativa sem resultado suficiente não cria diagnóstico nem substitui um vigente anterior. Sucesso de substituição cria novo registro e mantém o anterior como `SUPERSEDED`; revogação com motivo obrigatório de 1–500 caracteres mantém registro `REVOKED` e retira a vigência. Estados são `CURRENT`/Vigente, `SUPERSEDED`/Substituído e `REVOKED`/Revogado; dados históricos não são editados.

Exibir `displayScore` retornado (0–1, duas casas decimais em pt-BR), classe retornada (`LOW`/Baixo, `MODERATE`/Moderado, `HIGH`/Alto, `CRITICAL`/Crítico) e qualidade retornada (`LOW`/Baixa, `MEDIUM`/Média, `HIGH`/Alta). Nunca recalcular classe pelo score arredondado nem confundir qualidade com risco. Componentes W/Água, S/Solo, V/Vegetação, T/Território podem virar cartões. Origem, IDs, versões, hash e datas do cálculo/vigência/transição ficam em detalhes acessíveis. Explicação retornada é determinística, sem IA; não inventar recomendações ambientais.

### Administração global

Somente conta ativa com papel global `ADMIN` acessa. Buscar contas existentes por nome/e-mail; filtrar por papel e estado; paginar; consultar detalhe e auditoria. Estados: `ACTIVE`/Ativa, `PENDING`/Pendente, `INACTIVE`/Inativa, `BLOCKED`/Bloqueada. Inativa significa desativação administrativa reversível; bloqueada significa negação por segurança; ambas perdem acesso normal.

Alterar papel ou estado de outra conta exige justificativa de 1–500 caracteres, revisão explícita do antes/depois e confirmação. Usar revisão e valor esperados do servidor para concorrência; em conflito, atualizar dados e pedir nova revisão, sem sobrescrever. Não permitir mudança do próprio papel/estado nem deixar a plataforma sem administrador ativo. O contrato atual permite selecionar `PENDING` como destino; a política futura de limitar esse estado à pré-ativação permanece pendente e não deve ser decidida nesta proposta. Não criar/excluir contas administrativas, impersonar nem recuperar senha.

## Formulários, validações e mensagens

Login exige e-mail válido e senha não vazia; não alterar senha com trim. Cadastro apresenta Nome, Sobrenome, E-mail e Senha como obrigatórios. Não adicionar aprovação manual, senha de laboratório, CPF, endereço, termos obrigatórios, confirmação de senha ou política de tamanho/complexidade não definida. Melhorar erros próximos dos campos e foco ao primeiro inválido.

Área: `name` obrigatório, 1–100 caracteres após normalização; `latitude` número de −90 a 90; `longitude` de −180 a 180. Opcionais: `municipality`, `state`, `landType`, até 100 caracteres cada, e `description`, até 2000. Textos vazios são `null`. UF permanece texto livre conforme contrato atual, sem impor tamanho dois ou lista exclusiva. A descrição opcional da área é texto do usuário já contratado; não equivale às descrições ambientais por categoria que permanecem fora do escopo.

### Campos ambientais exatos

Todos os quatro objetos `water`, `soil`, `vegetation`, `terrain` são necessários, ainda que campos opcionais do terreno estejam todos sem informação. `LEVELS` abaixo significa `LOW`/Baixo, `MEDIUM`/Médio, `HIGH`/Alto; adaptar gênero do rótulo sem mudar o enum.

| Grupo / chave JSON | Rótulo / tipo | Obrigação e domínio |
|---|---|---|
| `water.waterSourceType` | Fonte de água, seleção | Obrigatório: `RIVER_STREAM`/Rio ou riacho, `SPRING`/Nascente, `SHALLOW_WELL`/Poço raso, `TUBULAR_WELL`/Poço tubular, `CISTERN`/Cisterna, `OTHER`/Outra. |
| `water.hasSpring` | Há nascente, Sim/Não | Booleano obrigatório. |
| `water.wellDepthMeters` | Profundidade do poço (m) | Opcional, número ≥0; somente para poço raso/tubular, `null` nos demais. Se trocar a fonte com profundidade preenchida, pedir correção explícita; não salvar valor incompatível. |
| `water.waterAvailability` | Disponibilidade hídrica | Obrigatório: `PERMANENT`/Permanente, `SEASONAL`/Sazonal, `SCARCE`/Escassa. |
| `water.salinityIndicator` | Indicador de salinidade | Opcional: `NONE`/Nenhum, `SUSPECTED`/Suspeita, `CONFIRMED`/Confirmada ou `null`. Não é medida numérica em g/kg. |
| `soil.soilTexture` | Textura do solo | Obrigatório: `SANDY`/Arenosa, `MEDIUM`/Média, `CLAYEY`/Argilosa. |
| `soil.infiltrationRateMmPerHour` | Taxa de infiltração (mm/h) | Obrigatório, número ≥0, sem teto adicional na captura. |
| `soil.compactionLevel` | Compactação | Obrigatório, LEVELS. |
| `soil.erosionSigns` | Sinais de erosão | Obrigatório: `NONE`/Nenhum, `LAMINAR`/Laminar, `RILLS_GULLIES`/Sulcos ou ravinas. |
| `soil.soilExposedPercent` | Solo exposto (%) | Opcional, número 0–100 ou `null`. |
| `vegetation.vegetationCoverPercent` | Cobertura vegetal (%) | Obrigatório, número 0–100. |
| `vegetation.fragmentationLevel` | Fragmentação | Obrigatório, LEVELS. |
| `vegetation.hasRiparianApp` | Presença de APP ripária | Opcional, `true`/Sim, `false`/Não, `null`/Não informado; não criar “parcial”. |
| `vegetation.landscapeDegradation` | Degradação da paisagem | Obrigatório, LEVELS. |
| `terrain.drainageDensityKmPerKm2` | Densidade de drenagem (km/km²) | Opcional, número ≥0 ou `null`. |
| `terrain.elevationMeters` | Elevação (m) | Opcional, qualquer número finito, inclusive negativo, ou `null`. |
| `terrain.slopePercent` | Declividade (%) | Opcional na captura, número ≥0 ou `null`; não impor teto 45 ou 100 à medição. Necessária para o IHFR. |

Use mensagens claras: “Campo obrigatório.”, “Selecione uma opção válida.”, “Verifique os campos indicados.”, “Informe um número entre 0 e 100.”, “Profundidade é aplicável somente a poços.”, “Não foi possível conectar ao servidor.”, “Laboratório inativo — somente leitura.”. Para data futura, indicar que a ocorrência não pode ser posterior ao momento atual. Para falta de IHFR, “Sem diagnóstico experimental vigente”; para insuficiência, explicar os motivos recebidos. Mostrar sucesso somente ao receber a confirmação do adapter/servidor. Mensagens propostas podem melhorar clareza, mantendo significado e códigos dos contratos.

## Contratos HTTP relevantes para a camada substituível

Não crie os endpoints: eles já existem no HidroFlorestas. Modele os DTOs e concentre chamadas em um adapter. Prefixos: `A = /api/laboratories/{laboratoryId}`; `B = A/areas/{areaId}/collections/{collectionId}`; `D = B/ihfr-diagnosis`. Não enviar campos adicionais em contratos fechados. Requisições reais usam JSON, sessão por cookie, `credentials: include` e leituras sem cache de dados privados; configuração cross-origin só será decidida na integração, sem contornar cookies/CORS.

| Endpoint | Entrada / retorno relevante |
|---|---|
| `POST /api/auth/sign-up` | `{firstName,lastName,email,password}` → `{success:true,user}`; falha `{success:false,message}`. |
| `POST /api/auth/sign-in` | `{email,password}` → `{success:true,user,destination}`. |
| `GET /api/auth/me` | `{success:true,user}`; user somente `{firstName,lastName,image}`. |
| `POST /api/auth/logout` | `{success:true}`. Login/me/logout falham com `{success:false,code,message}`. |
| `GET /api/laboratories` | `{success:true,laboratories:[{id,name,createdAt,status,isOwner}]}`. |
| `POST /api/laboratories` | `{name}` → `{success:true,laboratory}`. |
| `GET A` | `{success:true,details}`; details contém campos do laboratório e `members:[{name,initials}]`. |
| `PATCH A` / `DELETE A` | `{confirmationName}` → `{success:true,action:"DEACTIVATED" ou "DELETED"}`. Falhas de laboratório: `{success:false,code,message}`. |
| `GET A/memberships` / `PATCH A/memberships/{membershipId}` | Consulta `{context,memberships:[{id,name,initials,role}]}`; escrita `{expectedRole,role}` com valores `MEMBER`/`ADMIN` distintos → `{membership}`. |
| `GET A/areas` / `POST A/areas` | Consulta `{context,areas:[{id,name,latitude,longitude,municipality,state}]}`; escrita com os sete campos de área descritos → `{area}`. |
| `GET A/areas/{areaId}` | `{area}` com resumo, `landType,description,createdAt,laboratory:{id,name,status},readOnly`. |
| `POST A/areas/{areaId}/collections` | `{occurredAt}` + `Idempotency-Key` UUID → `{collection}`. |
| `GET B` | `{collection:{id,occurredAt,confirmedAt,area:{id,name},laboratory:{id,name,status},readOnly}}`. |
| `GET B/environmental-data` / `POST B/environmental-data` | Consulta `{environmentalData:null ou conjunto}`; escrita dos quatro objetos ambientais + `Idempotency-Key` → `{environmentalData}`. Conjunto contém os grupos mais `id,collectionId,measurementContractVersion,confirmedAt,readOnly`. |
| `GET A/dashboard/summary` | `{context,totals:{areas,confirmedCollections},links:{areas}}`; não há agregação de risco. |
| `GET A/dashboard/history?cursor=...` | `{context,items,page:{nextCursor}}`; eventos `AREA_CREATED`/`COLLECTION_CONFIRMED`, com `id,type,label,eventAt,area,destination`; coleta acrescenta `collection:{id},occurredAt`. Cursor opaco, páginas de até 20 itens; sem filtro mensal/e-mail. |
| `GET A/territorial-map` | `{context,areas:[{id,name,location:{latitude,longitude} ou null,confirmedCollections:[{id,occurredAt,confirmedAt}]}]}`. Sem classes IHFR, polígonos ou camadas analíticas. |
| `GET D/current` | `{diagnosis:null ou PublicDiagnosis}`. |
| `GET D/eligibility?landUseType=FOREST` | `{eligible,outcome,reasons,hasCurrentDiagnosis,currentDiagnosisId}`; omitir query se indeterminado. |
| `POST D/diagnoses` | Request IHFR abaixo + `Idempotency-Key` → `{outcome,diagnosis,insufficiencyReasons}`. |
| `GET D/diagnoses/{diagnosisId}` | `{diagnosis}` de registro específico conhecido; não existe endpoint de listagem completa do histórico IHFR. |
| `POST D/diagnoses/{diagnosisId}/revocations` | `{expectedCurrentDiagnosisId,reason}` + `Idempotency-Key` → OperationResponse. |
| `GET D/operations/{idempotencyKey}` | Recupera OperationResponse terminal da tentativa, inclusive incompatível. |
| `GET /api/admin/users?search=...&role=...&status=...&limit=25&cursor=...` | `{items,nextCursor}`; search até 120 caracteres; limit 1–50; cursor atrelado aos filtros, reiniciar ao mudá-los. |
| `GET /api/admin/users/{userId}` | DTO direto `{id,firstName,lastName,email,role,status,revision,createdAt,updatedAt}`. |
| `PATCH /api/admin/users/{userId}/status` | `{expectedStatus,expectedRevision,status,reason}` → DTO atualizado. |
| `PATCH /api/admin/users/{userId}/role` | `{expectedRole,expectedRevision,role,reason}` → DTO atualizado. |
| `GET /api/admin/users/{userId}/audit?cursor=...&limit=25` | `{items,nextCursor}`; eventos `{id,targetUserId,actorUserId,action,beforeValue,afterValue,reason,targetRevision,createdAt}`. Ações `ACCOUNT_STATUS_CHANGED`/`GLOBAL_ROLE_CHANGED`. |

`context` do laboratório é `{id,name,status,membershipRole,readOnly}`; status `ACTIVE`/`INACTIVE`. Preservar envelopes distintos em vez de presumir um único `success` universal. Áreas, medições, coletas, dashboard, mapa, vínculos, IHFR e administração usam erros `{error:{code,message,...}}`; validação ambiental pode incluir `details:{fields:{"grupo.campo":"mensagem"}}`; administração pode incluir orientação `recovery`.

Coleta e medições: 201 na primeira confirmação, 200 no replay idêntico, `Location` aponta ao recurso HTTP confirmado. Idempotência usa UUID estável por tentativa e payload; duplo clique/retry não cria duplicata. Resultado desconhecido mantém a mesma chave e dados; medições oferecem consultar registro e repetir, sem liberar edição enquanto incerto. Chave reutilizada com outros dados ou conjunto ambiental já existente causa 409. Formulário preservado em memória não é funcionalidade de rascunho.

Request IHFR: `{mode:"CREATE" ou "REPLACE",expectedCurrentDiagnosisId?,supplement:{inputContractVersion,landUseType?,provenance:{kind,observedAt}},versions:{measurementContractVersion,mathContractVersion,algorithmVersion,contractHash}}`. Em CREATE, ID esperado ausente/null; em REPLACE, UUID do vigente obrigatório. Valores ativos fixos do adapter, nunca editáveis pela pessoa:

- `measurementContractVersion`: `ihfr-measurement-v1`.
- `inputContractVersion`: `ihfr-diagnosis-input-experimental-v0.1.0`.
- `mathContractVersion`: `ihfr-math-experimental-v0.1.1`.
- `algorithmVersion`: `ihfr-evaluator-ts-v0.1.0`.
- `contractHash`: `sha256:f8104143f1505aceaa68a7ffa06fac50f4906cdfc4119609875d99c9fecc6f89` (identificador público de contrato, não credencial).

`PublicDiagnosis` contém `id,areaId,collectionId,environmentalMeasurementSetId,inputSupplementId,lifecycleState,rawScore,displayScore,ihfrClass,dataQuality,componentScores:{W,S,V,T},decomposition,drivers,explanation,versions,calculatedAt,validFrom,transitionedAt,scientificState:"EXPERIMENTAL",scientificLabels`. `versions` inclui as cinco identidades acima; `drivers` aponta componentes; `decomposition` é detalhe retornado por variável, não licença para calcular no frontend.

OperationResponse usa outcomes `SUCCEEDED`, `INSUFFICIENT_DATA`, `INCOMPATIBLE_VERSION`; diagnosis pode ser `null`. Diagnóstico bem-sucedido novo: 201; replay: 200; insuficiência: 200 com motivos (`MISSING_ENVIRONMENTAL_DATA`, `MISSING_SLOPE_PERCENT`, `MISSING_LAND_USE_TYPE`, `INSUFFICIENT_DIMENSION`). Revogação bem-sucedida: 200. Entrada malformada: 400; combinação de versões bem formada incompatível: 422 `INCOMPATIBLE_VERSION`, terminal recuperável, sem criar diagnóstico/suplemento confirmado. `STATE_CONFLICT`/`IDEMPOTENCY_CONFLICT`: 409, atualizar vigente/elegibilidade antes de nova ação.

Falha de rede/500 IHFR significa resultado desconhecido, nunca sucesso ou “sem diagnóstico” presumido: preservar chave e body, oferecer recuperar operação e repetir exatamente a mesma tentativa. Recuperação 404 significa que não há resultado terminal recuperável; não iniciar nova chave automaticamente. Após resultado terminal, consultar vigente/elegibilidade novamente; eventual falha dessa atualização deve ser mostrada separadamente da operação já confirmada.

Em geral, distinguir 400 entrada inválida, 401 sessão perdida, 403 ação sem permissão, 404 recurso indisponível, 409 conflito/somente leitura e 500 falha técnica. Respeitar códigos específicos, especialmente os casos IHFR acima. Não traduzir códigos/enums no transporte; traduzir somente rótulos e mensagens de apresentação.

## Estados demonstráveis, responsividade e acessibilidade

Use dados totalmente sintéticos e um adapter substituível, com fixtures e atrasos/falhas controlados. Não criar outro backend, banco, Supabase/Lovable Cloud, autenticação paralela, server functions de domínio ou cálculo IHFR independente. A infraestrutura de roteamento/SSR eventualmente gerada não autoriza essas capacidades. Não solicitar credenciais do sistema real.

Para percorrer a proposta sem backend, disponibilize cenários de sessão fictícia em memória, claramente rotulados “Demonstração”, sem guardar senhas/tokens nem autenticar contas reais. Um painel de cenários exclusivo da demonstração pode trocar perfil e estado; deve ser separado da navegação de produto e fácil de remover. Resultados IHFR são fixtures predefinidas com “Resultado simulado — demonstração”; nenhuma função produz score a partir dos inputs. Exemplos de datas não devem ser futuros em relação ao relógio do dispositivo ao validar a coleta.

Demonstrar carregamento, vazio, sucesso, validação por campo, falha com repetir, somente leitura, permissão insuficiente e recurso indisponível nas telas pertinentes. Demonstrar também cinco laboratórios/limite, localização negada e retorno tardio, indisponibilidade de tiles com lista/coordenadas utilizáveis, medições ausentes/confirmadas, diagnóstico ausente/insuficiente/incompatível/vigente, substituição/revogação, resultado desconhecido com recuperação/replay e conflitos administrativos. Não mostrar números zerados quando os dados ainda não carregaram.

Mapa utiliza pontos de áreas e mantém lista alternativa selecionável por teclado, inclusive áreas com `location:null`. Cada área conserva suas coletas; não criar marcadores de coletas em coordenadas inventadas. Tiles disponíveis têm atribuição visível; falha cartográfica não elimina registros. Use componente substituível, preferindo Leaflet/React-Leaflet para reduzir adaptação, sem exigir chave de novo provedor ou adicionar geocodificação. Na falta de mapa real no preview, mostrar claramente “Mapa de demonstração” com dados sintéticos e estados de fallback.

Projete para 375px, 768px e 1440px e zoom de 200%, sem perda de campos ou rolagem horizontal da página. Desktop: navegação lateral, conteúdo com largura confortável e colunas onde houver ganho. Celular: navegação compacta/drawer ou barra inferior com texto, sem encobrir conteúdo, confirmações ou Sair; formulários e painéis em uma coluna. Tabelas/listas administrativas podem virar cartões. Mapas têm altura explícita e não prendem a navegação.

Use HTML semântico, rótulos associados, instruções/unidades visíveis, foco perceptível, ordem de tabulação lógica, botões com nomes acessíveis e áreas de toque de pelo menos 44×44px. Contraste WCAG AA: 4,5:1 para texto comum, 3:1 para texto grande/componentes aplicáveis. Não depender só de cor para status, risco ou erro. Não usar placeholder como único rótulo. Feedback com `role=status`/`role=alert` e leitura assistiva; erros ligados ao campo e foco ao primeiro inválido. Diálogos devem controlar foco, restaurá-lo ao fechar, permitir Escape quando seguro e impedir interação com fundo. Suportar teclado, toque e redução de movimento; não reproduzir transição global indiscriminada ou falhas de foco das telas atuais.

## Restrições de arquitetura e entrega aproveitável

O projeto de destino usa Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4 e Lucide; APIs e autorização são server-side no próprio monólito, com Prisma/PostgreSQL. Nada dessa infraestrutura deve ser recriado na proposta. Preserve nomes/valores dos DTOs e separe apresentação, estado de formulário, navegação e acesso a dados. Evite lógica de domínio dentro de cartões ou CSS global que afete a aplicação inteira.

Se o ambiente gerar TanStack Start, React/Vite ou outro roteador, a proposta continua útil como componentes React e tokens, mas suas rotas, loaders, SSR, imagens, fontes, estilos, imports e adapter terão de ser adaptados pelo Codex ao App Router, incluindo fronteiras cliente/servidor e mapas apenas no cliente. Registre essa diferença em README; não prometa compatibilidade automática nem migre o HidroFlorestas para a estrutura gerada. Mantenha router/auth específicos atrás de módulos substituíveis.

Não incluir como funcionalidade disponível: Município/UF automáticos, rascunhos ambientais, descrições ambientais por categoria sem definição aprovada, upload de imagens de áreas, polígonos, ingresso por código/convites, perfil editável, recuperação de senha, IA generativa, relatórios PDF, exportações, filtros/camadas analíticas ou gráficos Plotly. Também não fabricar métricas de risco no dashboard/mapa, status individual de área, autores públicos de coletas ou listas de histórico IHFR sem contrato. Limitações atuais delimitam esta proposta; bugs de feedback, foco ou disposição não são comportamentos desejados a reproduzir.

## Critérios objetivos de conclusão

1. Todas as telas da tabela são navegáveis e a jornada completa pode ser demonstrada com dados sintéticos, incluindo retornos e acesso a coletas existentes pelo histórico/mapa.
2. Há cenários OWNER, ADMIN contextual, MEMBER, ADMIN global, conta sem laboratório e laboratório inativo; ações disponíveis refletem a matriz, sem seleção automática de laboratório. Sair funciona visualmente em workspace, laboratório e administração, em desktop e celular, com sucesso e erro/retry.
3. Formulários preservam campos, unidades, enums, null/zero/false e limites. Coleta demonstra inicialização única, edição, revisão e transporte equivalente em UTC−03:00, UTC e UTC+05:45. Confirmados não possuem editar/apagar.
4. IHFR demonstra ausência, suficiência, insuficiência, versão incompatível, confirmação de criar/substituir/revogar e recuperação de tentativa incerta. Resultados simulados e estado científico experimental ficam visíveis; nenhum cálculo local existe.
5. Neutros e acentos seguem os valores reais fornecidos, sem neon; referência visual está traduzida em hierarquia, componentes e navegação, sem copiar funcionalidades ilustradas sem contrato.
6. As larguras e o zoom indicados funcionam; formulários, diálogos e navegação podem ser percorridos por teclado; contraste e foco foram conferidos, e eventuais ajustes de cor estão documentados.
7. Código e README permitem localizar componentes, tokens, rotas, adapter, fixtures e seletor de cenários; descrevem como executar, estados demonstrados e adaptações necessárias. Sem backend/banco/auth/cálculo novo, segredos ou dados reais.
8. Entregar a proposta e sua documentação para avaliação em repositório separado/exportação. Integração e deploy no HidroFlorestas serão decisões posteriores sobre o resultado concreto.
