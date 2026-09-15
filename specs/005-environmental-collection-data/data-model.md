# Data Model: Dados ambientais da coleta

**Date**: 2026-09-15
**Status**: Modelo lógico condicionado; não é schema Prisma, DDL ou contrato científico aprovado.

## 1. Relações estáveis

```text
Laboratório → Área → Coleta confirmada → Dados ambientais associados
                         │                         │
                 Autoria histórica       Contrato aplicável (G2)
```

A seta final indica subordinação à origem, não cardinalidade científica definida. Uma observação não pode ser transferida silenciosamente a outra coleta; o registro de dados não muda laboratório/área da coleta. A referência do contrato é requisito condicionado à aprovação de seu nível, vigência e representação, não uma nova tabela decidida.

## 2. Entidades e atributos conceituais

| Entidade/conceito | Atributos/relacionamentos conhecidos | Validação/limite |
|---|---|---|
| Laboratório | Identidade, estado e vínculos atuais | Resolver pelo vínculo; inativo somente leitura |
| Área | Identidade e laboratório de origem | Resolver subordinada ao laboratório; preservar referência espacial herdada |
| Coleta confirmada | Identidade, área, laboratório, autor histórico, ocorrência/offset e confirmação da IMP-004 | Contrato herdado; ausência desses elementos no baseline não autoriza fabricar valores |
| Registro ambiental | Referência à coleta e conteúdo conforme contrato aplicável | Campos, grupos e multiplicidade dependem de G2; autoria própria e unidade de gravação de G3 |
| Referência científica | Identificação do contrato/versão no nível aprovado | Representação física, aplicabilidade e evolução dependem de G2; não usar algorithmVersion |
| Contexto de operação | Principal autenticado, elegibilidade, vínculo/papel/estado/permissão | Derivado/revalidado no servidor; não aceito como autoridade no payload |

`FATO_DOCUMENTADO`: os atributos novos da coleta são planejados pela IMP-004, ainda não integrados na base. `RECOMENDACAO`: manter dependentes fisicamente separados do pai imutável; escolher campos e constraints apenas após G2/G3.

## 3. Inventário do schema observado

Fonte `EVIDENCIA_IMPLEMENTACAO`: `prisma/schema.prisma` em `f440282a9aefbbb85b5199d0610fdb9ecab3dc87`. Esta tabela descreve o legado, sem aprovar variáveis, unidades, precisão, enums, cardinalidades ou obrigatoriedade.

Todos os quatro models possuem `id String @id @default(uuid())`, `collectionDataId String @unique` e relação obrigatória com `CollectionData`. As listas reversas não superam o limite técnico de zero ou um filho de cada model por coleta.

| Model | Campos científicos declarados (tipo técnico) |
|---|---|
| WaterData | `waterSourceType WaterSourceType`, `hasSpring Boolean`, `wellDepth_m Float?`, `waterAvailability WaterAvailability`, `salinityIndicator SalinityIndicator?` |
| SoilData | `soilTexture SoilTexture`, `infiltrationRate_mm_h Float`, `compactionLevel LevelBasicDefault`, `erosionSigns ErosionSigns`, `soilExposedPercent Float?` |
| VegetationData | `vegetationCoverPercent Float`, `fragmentationLevel LevelBasicDefault`, `hasRiparian_app Boolean?`, `landscapeDegradation LevelBasicDefault` |
| TerrainData | `drainage_density Float?`, `elevation_m Float?`, `slopePercent Float?` |

`CollectionData` no baseline contém ID, `createdAt`, `updatedAt`, `collectionAreaId`, `userId` e `observations?`; as relações com esses filhos e `IHFRDiagnosis` existem. Não há campo de versão do contrato ambiental nem autoria própria nos quatro models. `IHFRDiagnosis.algorithmVersion` é campo de algoritmo e não preenche a lacuna.

## 4. Divergências a reconciliar

| Evidência atual | Contrato autorizado | Tratamento |
|---|---|---|
| Quatro tabelas com nomes ambientais | Taxonomia não aprovada | Não construir quatro abas obrigatórias por conveniência |
| FK única por grupo/coleta | Multiplicidade científica não aprovada | Não manter nem remover unicidade como decisão científica antes de G2 |
| Float e sufixos `_m`, `_mm_h`, `Percent` | Unidade, precisão, arredondamento e limites não aprovados | Não inferir faixas ou conversões pelo nome |
| Campos nullable/não nullable | Significado de desconhecido/não aplicável/ausente pendente | Não converter nulo em zero/falso nem exigir campo por causa do schema |
| Enums legados, inclusive grafias incomuns | Taxonomias/semântica não aprovadas | Preservar legado; qualquer mapeamento exige decisão explícita |
| Sem versão de contrato | Backlog exige contrato validado e versionado no nível aplicável | G2 decide representação e evolução; nenhuma versão retroativa fabricada |
| Sem autor específico dos filhos | Autoria histórica da coleta deve ser preservada | G3 define proveniência própria; não sobrescrever autor da coleta |

Não há contrato científico validado com o qual declarar equivalência campo a campo. A divergência comprovada é entre uma estrutura técnica já definida e a ausência de aprovação de sua semântica, além dos novos requisitos de rastreabilidade ainda sem representação. Fontes históricas apresentam alternativas, não resolvem essa divergência.

## 5. Invariantes e operações

- Revalidar a cadeia completa em leitura/escrita; FK isolada não substitui autorização.
- Nenhum update/delete na coleta confirmada; manter ocorrência, offset, confirmação, autor e origem. Não tocar `updatedAt` por conveniência.
- Não aceitar autor, laboratório ou área do body como autoridade para realocar dados.
- Validar o conteúdo segundo contrato aprovado; nunca aceitar objeto arbitrário para contornar G2.
- Não expor legado sem classificação/contrato definido; sua preservação física não o torna validado.
- Não criar diagnóstico nem usar o `confirmedAt` da coleta como momento de medição ou de submissão dos dados.

`RECOMENDACAO`: futura transação de registro revalida contexto, valida conteúdo e persiste a unidade aprovada em G3 nos dependentes. O modo exato de detectar repetição e conflito depende da multiplicidade G2/G3; nenhuma constraint idempotente é escolhida agora.

## 6. Estados

Estados de apresentação conhecidos: carregando, ausência de registro, registro consultável, acesso negado, falha e laboratório somente leitura. Não são enums novos de banco.

`RECOMENDACAO` para apreciação em G3: preparação → revisão → envio → resultado verificável, com falha recuperável sem sucesso falso. Não é ciclo aprovado, não define rascunho persistente e não permite transição de edição da coleta confirmada. Complementação/correção dos próprios dados não é decidida por este plano.

## 7. Evolução física futura

Após G1–G3, produzir mapeamento entre contrato aprovado e schema integrado. Avaliar conservação ou evolução dos filhos existentes sem duplicar a identidade de coleta. Antes de qualquer migration futura: inventariar registros/órfãos/constraints com contagens sem dados pessoais, separar legado sem contrato comprovado, ensaiar preservação e recuperação em base isolada e confirmar compatibilidade com a trigger da IMP-004.

Não realizar backfill científico por heurística. Se não houver mapeamento aprovado, bloquear essa parcela da evolução. Plano de recuperação deverá preservar registros anteriores e novos; nenhuma remoção ou normalização está autorizada por este documento.
