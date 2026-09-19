# ADR-0001 — Contrato experimental IHFR v0.1

**Estado decisório**: `CONFIRMADO`

**Estado de implementação**: `NAO_IMPLEMENTADO`

**Data**: 2026-09-18

**Responsável pela decisão provisória**: equipe HidroFlorestas

**Origem científica informada pela equipe**: professor Fábio Mesquita

**Contrato**: `CONTRATO_EXPERIMENTAL`

**Ciência**: `VALIDACAO_CIENTIFICA_PENDENTE` · `SUJEITO_A_RECALIBRACAO` · `NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO`

## 1. Contexto, autoridade e limite

`DECISAO_CONFIRMADA` — A solicitação da equipe de 2026-09-18 informa que a formulação histórica do IHFR foi concebida pelo professor Fábio Mesquita, idealizador da startup e Engenheiro Florestal, escolhe essa formulação como base da primeira versão experimental e autoriza resolver os conflitos documentais para engenharia. A mesma decisão exige revisão científica especializada, comparação de formulações, vetores científicos de referência e testes de campo posteriores.

Esta decisão governa somente a versão experimental da IMP-006. Ela não declara validade científica definitiva, universalidade, calibração regional nem adequação para decisão pública, regulatória ou de alto impacto. A concepção científica informada não prova autoria material de cada arquivo de `docs/raw/`, cujos metadados de autoria permanecem não especificados.

Este ADR é o registro canônico completo. A spec, os registros globais, o README e `AGENTS.md` mantêm apenas resumos e apontadores.

## 2. Problema

As fontes históricas descrevem duas famílias de fórmula, normalizações incompatíveis, políticas diferentes para dados ausentes e intervalos de classe descontínuos. A captura integrada da IMP-005 fornece quase todas as medições, mas não fornece `landUseType` com taxonomia científica. Sem uma decisão explícita, a engenharia poderia misturar fontes, redistribuir pesos ou atribuir autoridade científica inexistente.

## 3. Inventário das fontes decisórias

Os arquivos são Markdown sem paginação; linhas e seções são os localizadores verificáveis. Os hashes abaixo foram recalculados em 2026-09-18.

| Código | Documento, versão e papel | SHA-256 | Seções/linhas relevantes |
|---|---|---|---|
| `R13` | `DOC-RAW-013`, *Especificação do IHFR v0.1 (MVP) — Contrato Matemático*, versão `v0.1 (MVP)`; base experimental principal | `d2382cf17561f557bbd70201875d08c554740a01bb31448f0d0713c8dd8f117a` | objetivo e saídas, L3–14; pesos/fórmula, L16–40; variáveis, L42–218; ausências/qualidade, L220–245; classes, L247–260 |
| `R02` | `DOC-RAW-002`, *Algoritmo Operacional — HidroFlorestas (MVP)*, sem versão documental; complemento operacional quando não contraditório | `896298b12bdce0b1970b2356756296aaf6b11cc481c76567775147d1ed52b2b6` | entradas, L15–56; validação, L58–90; dimensões, L92–150; qualidade/classes, L152–178; auditoria, L236–264 |
| `R07` | `DOC-RAW-007`, *Matriz de Variáveis do IHFR*, sem versão; confirmação conceitual | `dd2a40af070bdff1a44367aab7d868e2cd6cacd7c8e8588dfdf17fcb494973b4` | variáveis, L14–69; média simples, L75–90; classes, L92–99 |
| `R08` | `DOC-RAW-008`, *Modelo Científico do IHFR*, documento sem versão; menciona modelo `IHFR v0.1`; confirmação conceitual | `c90147a321306d2ec7f5ffce55cc7d7cce3e343555e4d16f3ea9a39f79ee4dd5` | formulação, L102–121; classes, L123–134; validação futura, L160–175 |
| `R06` | `DOC-RAW-006`, *Especificação Técnica do Sistema*, versão `1.0`; alternativa histórica | `0497d60c2d9a57363bd3f2d9ae8d68900c7e4680f34ea5761bc29595cad2e776` | fórmula ponderada, L49–68; normalizações alternativas, L70–189; classes, L191–200 |
| `R10` | `DOC-RAW-010`, *Modelo Regional do IHFR — Baixo Itapecuru*, sem versão; perfil regional alternativo | `b6671cac4ae1600c678af25e89db087d897b054c0d449b53f91bcbcca0c0b8ab` | recorte regional, L65–109; pesos, L111–128; exemplo, L130–168 |
| `R11` | `DOC-RAW-011`, *Protocolo de Campo do IHFR*, sem versão; perfil regional e procedimentos históricos | `026045aa408c784f5a4c4ece0285e445b792ccd571cc5d6f596c2b0850e166ca` | métodos, L36–208; fórmula/classes, L223–258 |

Também foram lidos os demais documentos de `docs/raw/`, os relatórios `DOC-009`–`DOC-014`, os registros de governança, o contrato integrado da IMP-005 e os padrões das IMP-003/004/005. `docs/code-first-prd/**` foi integralmente excluído desta consolidação conforme a autorização da equipe.

## 4. Decisão experimental

### 4.1 Identidade, fórmula e escopo

- Nome humano: **IHFR v0.1 experimental**.
- `mathContractVersion`: `ihfr-math-experimental-v0.1.0`.
- `algorithmVersion` reservada para a implementação: `ihfr-evaluator-ts-v0.1.0`.
- Estado: `EXPERIMENTAL`.
- Fórmula: `IHFR = 0,25W + 0,25S + 0,25V + 0,25T`.
- Perfil: `GENERAL_EXPERIMENTAL`, sem afirmar universalidade ou calibração regional.
- Compatibilidade de medição: `ihfr-measurement-v1` mais o suplemento imutável `ihfr-diagnosis-input-experimental-v0.1.0`.
- Manifesto normativo experimental: [`../../specs/006-ihfr-diagnosis/contracts/ihfr-math-experimental-v0.1.0.json`](../../specs/006-ihfr-diagnosis/contracts/ihfr-math-experimental-v0.1.0.json).
- `contractHash`: `sha256:5285d52ec70e0b0f8a951d40dd54f052e02be1556dd310e3cef0b3b4f6bc684b`.

O hash é SHA-256 da serialização JSON UTF-8 sem espaços, com chaves de objetos ordenadas lexicograficamente de forma recursiva, ordem de arrays preservada e a propriedade raiz `contractHash` excluída. Qualquer alteração normativa exige nova versão e novo hash; edição retroativa é proibida.

### 4.2 Composição e suficiência

Cada variável produz risco entre 0 e 1 conforme o manifesto. Cada dimensão é a média aritmética dos scores disponíveis e requer pelo menos dois scores. A versão experimental exige as quatro dimensões válidas; se qualquer uma for insuficiente, o resultado é `INSUFFICIENT_DATA` e nenhum diagnóstico vigente é produzido. Essa regra preserva os quatro pesos de 0,25 e impede redistribuição implícita.

Na dimensão `T`, somente `terrain.slopePercent` e `supplement.landUseType` pontuam. Ambos são necessários. `area_size_ha` é apenas contextual; `drainageDensityKmPerKm2` e `elevationMeters` não participam da v0.1.

`null`, ausente, desconhecido e não aplicável nunca viram zero. Entradas opcionais sem score são excluídas da média da dimensão. Entrada inválida resulta em `INVALID_INPUT`; dimensão com menos de dois scores ou falta de `slopePercent`/`landUseType` resulta em `INSUFFICIENT_DATA`.

### 4.3 Qualidade, classes e precisão

`dataQuality` usa os cinco essenciais de `R13`: infiltração, compactação, cobertura vegetal, uso da terra e disponibilidade hídrica. `HIGH` corresponde a pelo menos 80% presentes; `MEDIUM`, de 50% inclusive a 80% exclusive; `LOW`, abaixo de 50%. Qualidade não substitui suficiência das quatro dimensões.

As fronteiras contínuas são:

- `LOW`: `0 ≤ score ≤ 0,25`;
- `MODERATE`: `0,25 < score ≤ 0,50`;
- `HIGH`: `0,50 < score ≤ 0,75`;
- `CRITICAL`: `0,75 < score ≤ 1`.

O cálculo usa IEEE-754 binary64 sem arredondamento intermediário e a classificação usa o score interno não arredondado. Apenas a apresentação arredonda para duas casas decimais pelo critério decimal *half up*. O score interno, o apresentado e a classe devem ser persistidos ou reproduzíveis sem usar o valor apresentado como nova entrada.

### 4.4 Explicação e saídas

A explicação é determinística, sem IA generativa, derivada dos dois maiores componentes. Empates seguem `W`, `S`, `V`, `T`. A saída preserva scores por variável e dimensão, drivers, qualidade, versões, hash e instante do cálculo. Recomendações terapêuticas, dashboard, mapa e histórico continuam fora da IMP-006.

## 5. Matriz de conflitos e resolução

Na coluna de fontes, `RNN` incorpora documento, hash integral e localizador da tabela da seção 3.

| Conflito | Fontes discordantes | Opção escolhida para v0.1 | Justificativa | Alternativa preservada | Consequência técnica | Estado científico | Condição de revisão |
|---|---|---|---|---|---|---|---|
| Pesos iguais versus `35/30/25/10` | `R13` L16–31; `R07` L75–90; `R08` L102–121 versus `R06` L49–68; `R10` L111–128; `R11` L223–238 | Pesos iguais | `R13` é a única especificação matemática versionada, foi selecionada pela equipe e exige menor composição entre fontes | Perfil regional inativo `0,35H+0,30S+0,25V+0,10T` | Resolver seleciona uma única versão; resultado persiste versão/hash; testes não combinam perfis | `VALIDACAO_CIENTIFICA_PENDENTE` | Parecer especializado e calibração regional |
| `clamp` versus rejeição | `R13` L65–71, L101–107, L189–194 versus `R02` L58–70 | `clamp` somente na normalização | Segue a fonte-base e preserva o valor bruto aceito por `ihfr-measurement-v1` | Rejeição operacional de `R02` | Avaliador não altera a medição; calcula com limite; testes cobrem limite e extrapolação | `VALIDACAO_CIENTIFICA_PENDENTE` | Evidência de domínio ou de campo sobre extrapolação |
| Profundidade acima de 60 m | `R13` L65–71 versus `R02` L58–70 | `risk = 1 - clamp(depth,0,60)/60`; acima de 60 pontua como 60 | É a função explícita da fonte-base e mantém compatibilidade com o domínio técnico atual | Bloquear cálculo | Parser de medição continua `>=0`; avaliador registra bruto e score | `VALIDACAO_CIENTIFICA_PENDENTE` | Parecer de especialista hídrico ou evidência de campo |
| Infiltração acima de 60 mm/h | `R13` L101–107 versus `R02` L58–70 | `risk = 1 - clamp(infiltration,0,60)/60` | É a função contínua documentada na fonte-base | Bloquear ou usar classes discretas | Testes incluem 60, imediatamente acima e valor elevado | `VALIDACAO_CIENTIFICA_PENDENTE` | Parecer de solos e protocolo de campo |
| Declividade acima de 45% | `R13` L189–194 versus `R02` L58–70 e contrato v1 que aceita `>=0` | `risk = clamp(slope,0,45)/45` | Preserva a medição aceita e aplica o teto explícito do contrato-base | Bloquear acima de 45 | `slopePercent` bruto é preservado; apenas score satura | `VALIDACAO_CIENTIFICA_PENDENTE` | Parecer territorial ou evidência de campo |
| Qualidade alta com 4/5 versus 5/5 | `R13` L233–245 versus `R02` L152–168 | `HIGH` com fração `>=0,8` | Segue literalmente o limiar percentual da fonte-base | `HIGH` apenas em 5/5 | Manifesto usa proporção; vetores cobrem 4/5 e 5/5 | `VALIDACAO_CIENTIFICA_PENDENTE` | Testes de campo sobre completude e confiança |
| APP binária versus parcialmente degradada | `R13` L163–166 versus `R10` L101–109 | Binária na versão geral; `null` é desconhecido, não parcial | É compatível com a fonte-base e com o booleano persistido, sem inventar conversão | Estado ternário do perfil regional | `ihfr-measurement-v1.hasRiparianApp` é consumido sem inventar parcial | `VALIDACAO_CIENTIFICA_PENDENTE` | Perfil regional e entrada enriquecida aprovados |
| Fonte hídrica e salinidade divergentes | `R13` L48–89 versus `R06` L77–101 | Mapeamentos de `R13` | Mantém uma única tabela completa sob o contrato selecionado | Mapeamentos discretos de `R06` | Enum mapping explícito no manifesto; nenhum fallback | `VALIDACAO_CIENTIFICA_PENDENTE` | Vetores científicos ou calibração hídrica |
| Funções lineares versus classes discretas | `R13` L65–71, L101–107, L189–194 versus `R06` L87–109 | Funções lineares com `clamp` | Evita compor as faixas de outra família e segue as equações explícitas da fonte-base | Faixas discretas | Avaliador puro; testes de monotonicidade e limites | `VALIDACAO_CIENTIFICA_PENDENTE` | Comparação especializada e evidência de campo; recalibrar em nova versão |
| Composição de `T` | `R13` L183–218; `R07` L61–90; `R02` L131–150 | Média de declividade e uso da terra; tamanho não pontua; drenagem/elevação não usadas | É a composição pontuável integralmente definida em `R13`; as demais variáveis não têm função aprovada | Drenagem em `R07`; tamanho contextual em `R13` | Exige suplemento `landUseType` e `slopePercent` presente | `VALIDACAO_CIENTIFICA_PENDENTE` | Revisão da variável territorial ou aprovação de perfil novo |
| Lacunas `0,25–0,26`, `0,50–0,51`, `0,75–0,76` | `R13` L247–254; `R02` L170–178; `R07` L92–99 | Cortes contínuos em 0,25/0,50/0,75 | Todo score real em `[0,1]` recebe uma classe sem depender de arredondamento prévio | Classificar score previamente arredondado | Classificação usa score bruto; testes abaixo/no/acima | `VALIDACAO_CIENTIFICA_PENDENTE` | Parecer sobre limiares científicos |
| Inclusividade | `R13` L247–254; `R02` L170–178; `R07` L92–99 | Primeiro intervalo fechado; seguintes abertos à esquerda e fechados à direita | Resolve fronteiras sem sobreposição e preserva a classe menor nos limites escritos | Inclusividade não especificada | Nenhum score em `[0,1]` fica sem classe | `VALIDACAO_CIENTIFICA_PENDENTE` | Parecer sobre fronteiras; alteração gera nova versão/hash |
| Precisão e `0,7225` versus `0,72` | `R10` L141–168 | Preservar `0,7225` internamente; `0,72` apenas apresentação | Mantém reprodutibilidade e separa cálculo de comunicação | Arredondar antes de classificar | Campos bruto/apresentação separados; tolerância técnica `1e-12` | `VALIDACAO_CIENTIFICA_PENDENTE` | Revisão da regra de comunicação e da tolerância |
| Diagnóstico com dimensão ausente | `R13` L220–231; `R02` L140–150 versus fórmula fixa de `R13` L16–29 | Recusar como `INSUFFICIENT_DATA`; não redistribuir 0,25 | Impede alterar silenciosamente os pesos iguais selecionados | Média apenas das dimensões válidas | Nenhum diagnóstico vigente parcial; UI explica a entrada faltante | `VALIDACAO_CIENTIFICA_PENDENTE` | Parecer sobre política de ausência e pesos efetivos |
| Fórmula geral versus aplicabilidade regional | `R08` L136–146 versus `R10` L3–17, L65–128 e `R11` L1–15 | Perfil geral apenas experimental e controlado, sem alegação universal | A fonte-base não demonstra calibração territorial; limitar escopo exige menos inferência | Perfil Baixo Itapecuru inativo | Manifesto declara escopo; seleção regional automática é proibida | `VALIDACAO_CIENTIFICA_PENDENTE` | Amostra, período, método, métricas e parecer regional |

## 6. Compatibilidade campo a campo com `ihfr-measurement-v1`

Estratégias: `S1` contexto autorizado; `S2` extensão da medição; `S3` suplemento versionado do diagnóstico; `S4` não usada na v0.1; `S5` recusar como `INSUFFICIENT_DATA`.

| Variável científica | Entrada atual | Compatibilidade, transformação e perda | Recomendação técnica v0.1 | Recomendação científica futura |
|---|---|---|---|---|
| fonte hídrica | `water.waterSourceType` | Exata após mapeamento de caixa; tabela de `R13` | Consumir diretamente | Validar ordem de risco e scores por tipo de fonte hídrica |
| presença de nascente | `water.hasSpring` | Exata; booleano preservado | Consumir diretamente | Confirmar contraste de risco entre presença e ausência |
| profundidade | `water.wellDepthMeters` | Unidade exata; domínio técnico maior; `null` não vira zero | Aplicar `clamp`; excluir opcional ausente da média | Revisar direção, curva e teto de 60 m com especialista hídrico |
| disponibilidade | `water.waterAvailability` | Exata após mapeamento lexical | Consumir diretamente | Validar scores de permanente, sazonal e escassa por contexto |
| salinidade | `water.salinityIndicator` | Enum compatível; opcional na captura | Tratar `null` como desconhecido e excluir | Validar protocolo de observação e scores das três categorias |
| textura | `soil.soilTexture` | Enum compatível | Consumir diretamente | Revisar scores e dependência territorial, especialmente de solo argiloso |
| infiltração | `soil.infiltrationRateMmPerHour` | Unidade exata; domínio técnico maior | Aplicar `clamp` sem alterar o bruto | Validar curva contínua e teto de 60 mm/h com solo e campo |
| compactação | `soil.compactionLevel` | `MEDIUM` corresponde explicitamente a `moderate` | Usar mapeamento versionado | Calibrar categorias e reprodutibilidade do protocolo de campo |
| erosão | `soil.erosionSigns` | `RILLS_GULLIES` mantém a categoria combinada de `R13`; severidade interna entre sulco/voçoroca não existe | Consumir sem desagregar | Verificar se sulcos e voçorocas exigem categorias distintas em versão futura |
| solo exposto | `soil.soilExposedPercent` | Exata, opcional | Excluir `null`; preservar zero | Validar linearidade e variação sazonal do percentual |
| cobertura | `vegetation.vegetationCoverPercent` | Exata | Consumir diretamente | Validar linearidade, método de medição e sazonalidade |
| fragmentação | `vegetation.fragmentationLevel` | `MEDIUM` corresponde a `moderate` | Usar mapeamento versionado | Definir critério observável e calibrar as três categorias |
| APP | `vegetation.hasRiparianApp` | Compatível apenas com regra binária geral; não representa parcial | Usar binário; aplicar `S4` ao estado parcial | Definir e validar estado parcial antes de eventual perfil regional |
| degradação | `vegetation.landscapeDegradation` | `MEDIUM` corresponde a `moderate` | Usar mapeamento versionado | Definir rubrica e avaliar concordância entre observadores |
| declividade | `terrain.slopePercent` | Unidade exata, opcional e domínio maior | Exigir presença; aplicar `clamp`; ausente → `S5` | Validar curva e teto de 45% para o escopo territorial |
| uso da terra | inexistente | Entrada indispensável de `T`; `CollectionArea.landType` é texto livre opcional e não é snapshot normativo | `S3`: suplemento imutável `ihfr-diagnosis-input-experimental-v0.1.0`; ausente → `S5` | Validar taxonomia, scores e protocolo de classificação em campo |
| tamanho da área | não integra a medição | `R13` declara que não altera risco | `S4`; manter apenas contextual | Confirmar a não participação no risco ou definir função em nova versão |
| densidade de drenagem | `terrain.drainageDensityKmPerKm2` | Não há função aprovada na fonte-base | `S4`; não substituir uso da terra | Definir papel, método e normalização antes de qualquer uso futuro |
| elevação | `terrain.elevationMeters` | Sem papel matemático documentado | `S4` | Definir hipótese e função matemática antes de qualquer uso futuro |

O suplemento contém somente `landUseType` nos sete valores do manifesto, é ligado à coleta e ao conjunto ambiental, registra autoria/instante/proveniência, torna-se imutável ao calcular e entra no hash canônico da requisição. Não modifica nem reclassifica `ihfr-measurement-v1`.

Resultado do gate: `G2_ENG_DEPENDE_DE_EVOLUCAO_DE_ENTRADA`. A evolução é fechada e planejável: criar a entrada suplementar acima e exigir `slopePercent` presente. Nenhuma decisão científica genérica adicional bloqueia `$speckit-plan`.

## 7. Manifesto e vetores

O manifesto JSON é a única representação ativável do conteúdo matemático experimental. O ADR explica sua origem e resolução de conflitos; não substitui o manifesto na execução.

A futura suíte deve separar:

- **vetores técnicos derivados**: verificam literalmente funções, enums, `null`, zero, falso, limites, `clamp`, classes, insuficiência, precisão, componentes e hash; não constituem evidência científica;
- **vetores científicos de referência**: fornecidos ou aprovados durante revisão especializada e testes de campo; continuam pendentes e podem exigir nova versão.

Casos mínimos técnicos: nominal por classe; abaixo/no/acima de cada fronteira; 4/5 e 5/5 essenciais; todos os opcionais ausentes; zero e falso; profundidade/infiltração/declividade no e acima do teto; `landUseType` ausente; `slopePercent` ausente; cada dimensão insuficiente; enum inválido; reprodução do score por variável, dimensão, final, apresentação, classe e qualidade.

## 8. G2 consolidado

- `G2-ENG`: `G2_ENG_DEPENDE_DE_EVOLUCAO_DE_ENTRADA` — matemática, manifesto, hash e políticas estão definidos; falta implementar o suplemento versionado de `landUseType` e exigir declividade para `T`.
- `G2-SCI`: `NAO_VERIFICADO_VALIDACAO_POSTERIOR` — revisão multidisciplinar, calibração, vetores científicos e campo continuam pendentes.

A pendência de `G2-SCI` não bloqueia a construção experimental, desde que todo resultado exponha estado experimental e preserve versões/hash/proveniência. Recalibração cria novo contrato e novos diagnósticos; nunca altera registros anteriores.

## 9. G3 — contrato operacional mínimo da v0.1

`DECISAO_CONFIRMADA` no escopo da solicitação de 2026-09-18:

A comparação com os padrões integrados das IMP-003/004/005 favorece autorização contextual pela sessão humana, transações no backend TypeScript, imutabilidade e idempotência por operação. Por isso, a v0.1 adia o processo autônomo — o repositório não possui identidade operacional própria para responsabilizá-lo — e adota um único `CURRENT` por coleta, mais estrito que um vigente por versão, para não apresentar duas interpretações simultâneas como atuais. Versões anteriores continuam preservadas e consultáveis no histórico autorizado.

1. O avaliador é função pura e determinística executada server-side no backend existente; a implementação principal é TypeScript. Python, FastAPI, serviço externo, importação manual e IA generativa ficam fora da v0.1.
2. Somente OWNER ou ADMIN com vínculo atual e laboratório ativo inicia cálculo, substituição ou revogação. MEMBER apenas consulta. Processo interno autônomo fica adiado até possuir identidade e contrato próprios.
3. O cálculo consome conjunto ambiental confirmado e imutável, suplemento válido, versões compatíveis e o manifesto pelo hash exato. Conformidade técnica experimental é automática; não se chama aceite científico.
4. Criação do diagnóstico e associação à coleta são atômicas. Resultado, entradas consumidas, scores e versões são imutáveis.
5. Há no máximo um diagnóstico `CURRENT` por coleta. Novo cálculo de substituição cria outro registro e transita o anterior para `SUPERSEDED`; correção usa o mesmo mecanismo. Revogação transita para `REVOKED` com motivo. O histórico não é apagado.
6. Cada operação recebe chave UUID própria e hash canônico da requisição. A chave da IMP-005 nunca é reutilizada. Mesmo ator, chave, contexto e requisição retornam o resultado anterior; divergência com a mesma chave é conflito.
7. Operações concorrentes serializam por coleta. A primeira transição válida vence; a seguinte reavalia o estado e retorna conflito, sem dois vigentes. Substituição exige o ID vigente esperado para impedir perda de atualização.
8. Após timeout, o cliente consulta a operação pela chave no mesmo contexto autorizado. Sucesso só é apresentado após estado terminal confiável; falha não deixa associação parcial.
9. Auditoria restrita registra ator interno, chave, hash da requisição, conjunto/payload de origem, suplemento, versões/hash, resultado, transição, motivo e timestamps. O DTO normal omite identidades, chave idempotente, hashes internos e evidências restritas; mostra estado experimental, score, classe, componentes, qualidade, origem, versões, `contractHash`, estado de vigência e datas.
10. Laboratório inativo permite leitura autorizada e recusa toda escrita. Recurso inexistente e inacessível permanece indistinguível.

Estado: `G3-ENG: RESOLVIDO_DOCUMENTALMENTE_PARA_PLANEJAMENTO_V0_1`. Implementação e testes permanecem pendentes do fluxo Spec Kit.

## 10. Alternativa regional preservada

O perfil `0,35H + 0,30S + 0,25V + 0,10T`, presente em `R06`, `R10` e `R11`, permanece documentado, inativo e não selecionado. Sua ativação exige versão e hash próprios, aplicabilidade territorial explícita, conjunto de variáveis compatível, amostra, período, método de calibração, métricas, limites, vetores, parecer especializado e testes de campo. Ele não pode herdar silenciosamente o manifesto geral.

## 11. Consequências, riscos e recalibração

- A IMP-006 pode seguir para `$speckit-plan`, que deve incluir o suplemento de uso da terra antes do avaliador.
- Não há cálculo válido com `landUseType` ou `slopePercent` ausente.
- Scores experimentais devem ser identificados como tal em persistência, API e UI.
- Resultado produzido sob uma versão nunca é reinterpretado após mudança de contrato.
- Nova evidência especializada, vetor científico divergente, teste de campo, mudança territorial ou inconsistência reproduzível aciona revisão. Alteração normativa cria nova versão/hash e pode gerar novo diagnóstico, preservando o anterior.
- O maior risco científico é usar os resultados além do escopo experimental; o controle é rotulagem obrigatória, proveniência, imutabilidade e separação entre G2-ENG e G2-SCI.

## 12. Histórico da decisão

| Data | Evento |
|---|---|
| 2026-08-24 a 2026-08-28 | Auditorias `DOC-009`–`DOC-014` identificaram conflitos, lacunas de autoridade e ausência de cadeia reproduzível. |
| 2026-09-18 | IMP-005 integrada foi reconciliada na spec da IMP-006; G1 foi fechado e G2/G3 permaneceram abertos. |
| 2026-09-18 | A equipe confirmou origem científica, autorizou contrato provisório de engenharia, selecionou `R13` como base e exigiu validação futura e recalibração. |
| 2026-09-18 | Este ADR resolveu os conflitos para v0.1 experimental, preservou o perfil regional e separou G2-ENG de G2-SCI. |
