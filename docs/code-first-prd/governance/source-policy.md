# Política de fontes do PRD Code-First

- **Iniciativa:** `PRD Code-First`
- **Natureza:** paralela e não canônica
- **Estado:** `EM_REVISAO`

## Princípio

Autoridade sobre intenção e evidência sobre implementação são dimensões independentes. O código é a fonte inicial principal para reconstruir o produto que está sendo desenvolvido, mas nenhuma fonte pode ter sua autoridade extrapolada para outro assunto e nenhuma inferência pode ser promovida silenciosamente a fato, decisão ou requisito.

## Hierarquia

| Ordem | Fonte | Uso autorizado | Limite |
|---|---|---|---|
| 1 | Decisão explicitamente aprovada pela autoridade competente | Intenção pretendida no assunto aprovado. | Exige origem e autoridade identificadas; não prova implementação. |
| 2 | Código conectado e verificável | Estado implementado observável e origem de hipóteses de intenção explicitamente classificadas. | Não prova que o comportamento é desejado ou aprovado. |
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

A classificação deve avaliar a lacuna de intenção, não a urgência de corrigir o código atual. Biblioteca, provedor, CI/CD, migration, rollback, configuração de deploy ou defeito do schema não são automaticamente bloqueios globais. Riscos críticos de segurança exigem tratamento, mas a definição do comportamento pretendido e a correção da implementação são controles distintos. A ausência de Figma não bloqueia a compreensão do produto nem o início de um rascunho autorizado.

## Classificações de origem

| Classificação | Aplicação |
|---|---|
| `EVIDENCIA_CODIGO` | Evidência diretamente localizada em código, schema ou configuração permitida. |
| `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` | Hipótese analítica de comportamento ou estrutura pretendida, derivada da combinação coerente de código, interface, schema, nomenclatura e fluxos observados. Pode orientar perguntas e o rascunho do PRD quando explicitamente rotulada, mas requer confirmação humana antes de se tornar requisito aprovado. |
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

## Uso positivo do código

Rotas, telas, componentes, schema, nomes de entidades, mocks, placeholders e conexões técnicas podem revelar hipóteses coerentes de intenção do produto. Essas hipóteses devem ser classificadas como `HIPOTESE_DE_INTENCAO_DERIVADA_DO_CODIGO` e apresentadas à equipe para confirmação.

- Um mock não prova funcionalidade atual, mas pode evidenciar uma jornada pretendida.
- Um placeholder não prova capacidade implementada, mas pode indicar uma capacidade planejada.
- O schema não aprova o domínio, mas pode revelar conceitos que a implementação pretende representar.
- O texto da landing, quando coerente com código, schema e decisões, pode contribuir para uma hipótese de posicionamento ou intenção, embora não prove capacidade implementada.

## Decisões de trabalho para o rascunho

Uma decisão no estado local `RELATADO_PENDENTE_DE_VERIFICACAO` pode ser usada como `DECISAO_DE_TRABALHO_PARA_RASCUNHO` quando estiver registrada em `TECH_DECISIONS.md`, for corroborada pelo código conectado e não possuir divergência material localizada. Essa utilização:

- permite estruturar o PRD em `EM_ELABORACAO`;
- não promove a decisão para `APROVADO`;
- não dispensa o registro posterior de origem, autoridade e vigência antes da aprovação final;
- não exige reabrir preventivamente escolhas já relatadas e implementadas.

Nesta iniciativa, a regra de trabalho se aplica às seguintes direções, sem alterar `TECH_DECISIONS.md`:

| Decisão de trabalho | Referência | Corroboração e limite |
|---|---|---|
| Next.js como framework full-stack | `TD-001` | Framework, App Router e route handlers conectados; não aprova a arquitetura completa. |
| PostgreSQL como banco de dados | `TD-002` | Provider no schema e adapter conectado; não prova banco executado nem modelo de domínio aprovado. |
| Neon como direção atual do ambiente de desenvolvimento | `TD-003` | Adapter e dependências conectados; não prova conta, plano ou ambiente ativo. |
| Prisma ORM | `TD-004` | Schema, client, serviço e geração conectados; não aprova a política de migrations. |
| Tailwind CSS | `TD-005` | Configuração e uso conectado na interface; não aprova UX ou design system. |
| Lucide React | `TD-006` | Biblioteca conectada em componentes e telas; não aprova regras visuais ou de acessibilidade. |
| Vercel como direção atual de hospedagem | `TD-007` | Direção relatada coerente com a aplicação Next.js e sem divergência material localizada; não prova deploy, ambiente ou estratégia futura. |

OpenStreetMap, Plotly, Leaflet, Python e a integração Next.js/Python permanecem alternativas abertas: não estão implementados nem confirmados.

## Figma como evidência complementar

A ausência de Figma não impede compreender o produto pelo código, formular hipóteses de UX, iniciar o rascunho do PRD ou definir jornadas com confirmação humana. Se artefatos Figma forem fornecidos posteriormente, cada artefato deve ser identificado, ter seu estado classificado, ser comparado com o código e ser usado somente como evidência complementar de intenção de UX. Se não forem fornecidos, o PRD poderá ser construído com código, decisões e validação humana.

## Segurança, qualidade e implementação

Riscos de segurança, privacidade, qualidade, deploy e tooling são contexto para evitar que defeitos atuais virem requisitos; não formam um plano de correção e não precisam ser integralmente resolvidos para redigir o PRD. O PRD deve definir resultados de produto e requisitos não funcionais no nível adequado.

Mecanismos como redaction de hash, rotação JWT, CSRF, rate limiting, migrations, CI/CD e rollback pertencem principalmente à arquitetura, segurança e implementação. Somente decisões que alterem comportamento visível, acesso, papéis, privacidade ou escopo precisam ser confirmadas como decisões de produto.

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

As fontes permitidas são código e configurações rastreados, `package.json`, `package-lock.json`, `prisma/schema.prisma`, o estado ignorado da migration local, `TECH_DECISIONS.md`, contexto geral limitado de `PROJECT_CONTEXT.md`, governança global apenas para controle de autoridade e estado e o relato da equipe apresentado na revisão humana da iniciativa em 2026-08-27, limitado à referência organizacional do conceito de laboratório e explicitamente classificado como `DECISAO_RELATADA_PENDENTE_DE_VERIFICACAO`.

São `FONTE_EXCLUIDA`: `docs/raw/**`, `docs/governance/TRACEABILITY_MATRIX.md`, relatórios derivados do corpus histórico, planos de auditorias anteriores como fonte de conteúdo, conclusões exclusivamente históricas, texto comercial como prova funcional, internet e fontes externas. O relatório da Etapa 8 serve apenas para confirmar estado e ponto de parada, nunca para conteúdo de produto.

## Protocolo para divergências

1. registrar separadamente a fonte, o assunto e os dois eixos de estado;
2. preservar formulações e estados sem escolher uma versão por inferência;
3. classificar o conflito ou ausência como lacuna e formular pergunta neutra;
4. encaminhar à autoridade competente ainda que ela esteja `NAO_ESPECIFICADO`;
5. somente após resposta com origem registrada, atualizar um artefato futuro expressamente autorizado.
