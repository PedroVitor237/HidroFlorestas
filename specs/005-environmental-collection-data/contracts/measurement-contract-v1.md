# Contrato de medição `ihfr-measurement-v1`

**Status**: `DECISAO_CONFIRMADA` para a captura técnica da IMP-005 em 2026-09-17. Não constitui validação do cálculo IHFR.

## Unidade de registro

Uma coleta confirmada admite zero ou um conjunto ambiental confirmado. O conjunto contém os quatro grupos abaixo, é persistido atomicamente, registra autoria derivada da sessão, `confirmedAt`, chave idempotente própria e `measurementContractVersion = "ihfr-measurement-v1"`. Depois da confirmação, não há edição, complementação ou exclusão nesta entrega.

O payload é fechado: laboratório, área, coleta, autor, versão e timestamps não são aceitos como autoridade do cliente. Números devem ser finitos; `null` só é aceito nos campos explicitamente opcionais; campo ausente, zero e falso não são equivalentes.

## Água

| Campo público | Tipo | Obrigatório | Unidade/regra |
|---|---|---:|---|
| `waterSourceType` | enum | sim | `RIVER_STREAM`, `SPRING`, `SHALLOW_WELL`, `TUBULAR_WELL`, `CISTERN`, `OTHER` |
| `hasSpring` | boolean | sim | `true`/`false` literal |
| `wellDepthMeters` | decimal | não | metros; quando informado, `>= 0` |
| `waterAvailability` | enum | sim | `PERMANENT`, `SEASONAL`, `SCARCE` |
| `salinityIndicator` | enum | não | `NONE`, `SUSPECTED`, `CONFIRMED` |

`wellDepthMeters` é aplicável quando a fonte for poço; nas demais fontes deve ser `null`. O adapter pode mapear grafias legadas internas, mas a API usa somente os valores canônicos acima.

## Solo

| Campo público | Tipo | Obrigatório | Unidade/regra |
|---|---|---:|---|
| `soilTexture` | enum | sim | `SANDY`, `MEDIUM`, `CLAYEY` |
| `infiltrationRateMmPerHour` | decimal | sim | mm/h; `>= 0` |
| `compactionLevel` | enum | sim | `LOW`, `MEDIUM`, `HIGH` |
| `erosionSigns` | enum | sim | `NONE`, `LAMINAR`, `RILLS_GULLIES` |
| `soilExposedPercent` | decimal | não | percentual entre `0` e `100`, inclusive |

## Vegetação

| Campo público | Tipo | Obrigatório | Unidade/regra |
|---|---|---:|---|
| `vegetationCoverPercent` | decimal | sim | percentual entre `0` e `100`, inclusive |
| `fragmentationLevel` | enum | sim | `LOW`, `MEDIUM`, `HIGH` |
| `hasRiparianApp` | boolean | não | presença conhecida; `null` significa não informado, não `false` |
| `landscapeDegradation` | enum | sim | `LOW`, `MEDIUM`, `HIGH` |

## Terreno

| Campo público | Tipo | Obrigatório | Unidade/regra |
|---|---|---:|---|
| `drainageDensityKmPerKm2` | decimal | não | km/km²; quando informado, `>= 0` |
| `elevationMeters` | decimal | não | metros; admite valores negativos |
| `slopePercent` | decimal | não | percentual; quando informado, `>= 0`; declividades acima de 100 são tecnicamente possíveis |

## Confirmação e concorrência

- A interface prepara e revisa o conjunto completo em memória antes do POST.
- O cliente envia `Idempotency-Key` UUID próprio do conjunto ambiental; não reutiliza a chave da coleta.
- Mesmo autor, mesma chave, mesma coleta e mesmo payload retornam o mesmo conjunto.
- Mesma chave com qualquer divergência retorna conflito e não altera dados.
- Uma segunda chave para coleta que já possui conjunto confirmado retorna conflito.
- Falha em qualquer grupo reverte todos os grupos; nenhum conjunto parcial é válido.

## Projeção pública

A leitura retorna identidade pública do conjunto, versão do contrato, confirmação, quatro grupos canônicos, contexto mínimo da coleta e `readOnly`. Não retorna IDs de usuário, chaves idempotentes, nomes internos de colunas, diagnósticos ou versões de algoritmo.

## Casos de contrato mínimos

Os testes devem cobrir: todos os opcionais ausentes; zeros válidos; falsos válidos; percentuais `0` e `100`; percentual fora da faixa; número não finito; enum desconhecido; campo extra; grupo ausente; poço sem profundidade; fonte não poço com profundidade; replay idêntico; replay divergente; conjunto já existente; contexto cruzado; laboratório inativo.
