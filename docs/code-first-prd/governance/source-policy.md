# Política de fontes do PRD Code-First

- **Iniciativa:** `PRD Code-First`
- **Natureza:** paralela e não canônica
- **Estado:** `EM_REVISAO`

## Princípio

Autoridade sobre intenção e evidência sobre implementação são dimensões independentes. Nenhuma fonte pode ter sua autoridade extrapolada para outro assunto, e nenhuma inferência pode ser promovida silenciosamente a fato, decisão ou requisito.

## Hierarquia

| Ordem | Fonte | Uso autorizado | Limite |
|---|---|---|---|
| 1 | Decisão explicitamente aprovada pela autoridade competente | Intenção pretendida no assunto aprovado. | Exige origem e autoridade identificadas; não prova implementação. |
| 2 | Código conectado e verificável | Estado implementado observável. | Não prova que o comportamento é desejado ou aprovado. |
| 3 | Schema, migration, configuração e testes | Evidência técnica conforme o alcance de cada artefato. | Schema não aprova domínio; migration local ignorada não é artefato versionado; teste prova somente o cenário executado. |
| 4 | Figma classificado | Intenção de UX conforme estado e aprovação identificados. | Artefato não classificado não possui autoridade normativa. |
| 5 | Contexto geral permitido | Identidade e propósito geral do HidroFlorestas. | Nunca fundamenta requisito detalhado, regra científica ou arquitetura. |
| 6 | Proposta, comentário, mock ou inferência | Informação não normativa para análise e perguntas. | Não pode ser apresentada como decisão, capacidade real ou requisito. |
| 7 | Fonte excluída | Nenhum uso permitido nesta iniciativa. | Não pode fundamentar conteúdo direta ou indiretamente. |

## Eixo 1 — estado da decisão

| Estado | Significado nesta iniciativa |
|---|---|
| `APROVADO` | Decisão explicitamente aprovada pela autoridade competente, com origem identificada. |
| `RELATADO_PENDENTE_DE_VERIFICACAO` | Adoção relatada, mas sem confirmação suficiente de origem, autoridade ou vigência. |
| `EM_AVALIACAO` | Alternativa ainda sob avaliação. |
| `PROPOSTO` | Alternativa sugerida e não aprovada. |
| `REJEITADO` | Alternativa explicitamente rejeitada pela autoridade competente. |
| `SUBSTITUIDO` | Decisão antes aplicável e explicitamente substituída. |
| `NAO_ESPECIFICADO` | As fontes permitidas não informam decisão aplicável. |

## Eixo 2 — estado da implementação

| Estado | Significado nesta iniciativa |
|---|---|
| `IMPLEMENTADO_VERIFICADO_ESTATICAMENTE` | Código e conexões necessárias foram localizados, sem execução. |
| `IMPLEMENTADO_VERIFICADO_EM_RUNTIME` | Comportamento foi exercitado em ambiente identificado e produziu evidência reproduzível. |
| `PARCIALMENTE_IMPLEMENTADO` | Somente parte do fluxo, da integração ou dos estados foi localizada. |
| `ALEGADO_NAO_VERIFICADO` | Há alegação, mas nenhuma evidência técnica suficiente foi verificada. |
| `NAO_LOCALIZADO` | A busca no escopo permitido não localizou implementação. |
| `NAO_AVALIADO` | A implementação não foi inspecionada. |

Nenhuma capacidade desta base recebeu `IMPLEMENTADO_VERIFICADO_EM_RUNTIME`, pois aplicação, build, banco, migrations e deploy não foram executados.

## Taxonomia de bloqueios do PRD

| Estado | Critério |
|---|---|
| `BLOQUEANTE_GLOBAL` | A ausência impede consolidar qualquer PRD confiável, independentemente do recorte funcional, por faltar autoridade, direção global ou base normativa transversal indispensável. |
| `BLOQUEANTE_SE_NO_ESCOPO` | A ausência impede somente a parte do PRD que dependa do assunto; deixa de bloquear quando o tema é explicitamente excluído do escopo aprovado. |
| `NAO_BLOQUEANTE_DO_PRD` | O assunto deve ser tratado em arquitetura, engenharia, operação, backlog ou plano de implementação, mas não impede definir o produto pretendido. |

A classificação deve avaliar a lacuna de intenção, não a urgência de corrigir o código atual. Biblioteca, provedor, CI/CD, migration, rollback, configuração de deploy ou defeito do schema não são automaticamente bloqueios globais. Riscos críticos de segurança exigem tratamento, mas a definição do comportamento pretendido e a correção da implementação são controles distintos. A ausência de Figma requer classificar o artefato aplicável ou registrar explicitamente que não haverá fonte normativa de Figma.

## Classificações de origem

| Classificação | Aplicação |
|---|---|
| `EVIDENCIA_CODIGO` | Evidência diretamente localizada em código, schema ou configuração permitida. |
| `DECISAO_EQUIPE_CONFIRMADA` | Decisão da equipe com aprovação, origem e autoridade identificadas. |
| `DECISAO_RELATADA_PENDENTE_DE_VERIFICACAO` | Decisão relatada sem confirmação completa de origem, responsável, data ou implementação. |
| `CONTEXTO_GERAL_PERMITIDO` | Identidade ou propósito geral, sem autoridade para requisitos detalhados. |
| `FIGMA_APROVADO` | Artefato Figma com aprovação e escopo identificados. |
| `FIGMA_NAO_CLASSIFICADO` | Artefato Figma sem estado normativo identificado. |
| `PROPOSTA` | Alternativa não aprovada. |
| `INFERENCIA` | Conclusão derivada e explicitamente rotulada. |
| `NAO_VERIFICADO` | Alegação ou comportamento ainda sem evidência suficiente. |
| `NAO_ESPECIFICADO` | Informação ausente nas fontes permitidas. |
| `ORIGEM_INSUFICIENTE` | Informação existe, mas sua origem não sustenta o uso pretendido. |
| `FONTE_EXCLUIDA` | Fonte sem uso permitido nesta iniciativa. |

## Regras de interpretação

- Código inseguro é risco observado, nunca requisito.
- Mock é evidência de interface ou intenção local, não funcionalidade persistida.
- Schema evidencia estado de persistência, não modelo de domínio aprovado.
- Dependência instalada ou declarada não prova implementação nem uso conectado.
- Texto comercial não prova capacidade implementada.
- Decisão não implementada não pode ser apresentada como funcionalidade atual.
- Implementação sem decisão não pode ser apresentada automaticamente como produto desejado.
- Figma sem estado identificado não possui autoridade normativa.
- Divergências entre intenção, implementação e interface devem permanecer explícitas.
- Nenhuma inferência pode ser promovida silenciosamente.
- Ausência de evidência não prova inexistência fora do commit e do escopo inspecionados.
- Uma relação de rastreabilidade exige compatibilidade direta de assunto; menção tangencial não é vínculo.
- Campos de rastreabilidade devem escrever cada identificador por completo, sem intervalos ou sufixos abreviados.

## Fontes permitidas e excluídas

As fontes permitidas são código e configurações rastreados, `package.json`, `package-lock.json`, `prisma/schema.prisma`, o estado ignorado da migration local, `TECH_DECISIONS.md`, contexto geral limitado de `PROJECT_CONTEXT.md` e governança global apenas para controle de autoridade e estado.

São `FONTE_EXCLUIDA`: `docs/raw/**`, `docs/governance/TRACEABILITY_MATRIX.md`, relatórios derivados do corpus histórico, planos de auditorias anteriores como fonte de conteúdo, conclusões exclusivamente históricas, texto comercial como prova funcional, internet e fontes externas. O relatório da Etapa 8 serve apenas para confirmar estado e ponto de parada, nunca para conteúdo de produto.

## Protocolo para divergências

1. registrar separadamente a fonte, o assunto e os dois eixos de estado;
2. preservar formulações e estados sem escolher uma versão por inferência;
3. classificar o conflito ou ausência como lacuna e formular pergunta neutra;
4. encaminhar à autoridade competente ainda que ela esteja `NAO_ESPECIFICADO`;
5. somente após resposta com origem registrada, atualizar um artefato futuro expressamente autorizado.
