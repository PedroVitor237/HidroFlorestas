# Consolidação da auditoria documental

## Identificação e estado

- **Identificador:** `DOC-PLAN-007`
- **Título:** Consolidação transversal das auditorias documentais das Etapas 4 a 7
- **Etapa:** 8
- **Data:** 2026-08-26
- **Estado inicial:** `NAO_INICIADO`
- **Estado atual:** `AGUARDANDO_REVISAO`
- **Responsável pela execução:** agente mantenedor
- **Revisão humana:** pendente
- **Relatório relacionado:** [`DOC-013`](../../reports/audits/2026-08-26-auditoria-documental-consolidada.md)

## Objetivo e resultado esperado

Encerrar formalmente a Etapa 7 após a aprovação humana registrada na solicitação da Etapa 8 e consolidar transversalmente as auditorias analíticas das Etapas 4 a 7. O resultado esperado é um relatório autossuficiente em `EM_REVISAO`, com cobertura integral dos achados e perguntas de origem, deduplicação justificada, bloqueios únicos, pacotes de decisão, prontidão documental, matriz global atualizada e escopo documental da futura inspeção de código, sem resolver decisões, validar conteúdo normativo, inspecionar implementação ou iniciar a Etapa 9.

## Escopo

- Verificar mecanicamente e encerrar `DOC-PLAN-006`/`DOC-012`, preservando seus resultados e limites.
- Confirmar o baseline quantitativo dos quatro relatórios analíticos aprovados ou em aprovação.
- Cobrir exatamente os achados `SCI-FND-001`–`020`, `MATH-FND-001`–`020`, `PROD-FND-001`–`022` e `DAE-FND-001`–`031`.
- Cobrir exatamente as perguntas `SCI-Q-001`–`012`, `MATH-Q-001`–`018`, `PROD-Q-001`–`028` e `DAE-Q-001`–`030`.
- Consolidar problemas `CON-FND-NNN`, perguntas `CON-Q-NNN`, pacotes `DEC-PKG-NNN` e verificações futuras `CODE-CHECK-NNN`.
- Diferenciar ocorrências brutas de problemas e bloqueios consolidados únicos.
- Atualizar `TRACEABILITY_MATRIX.md`, `PENDING_DECISIONS.md` e `DOCUMENT_REGISTER.md` somente como controles documentais.
- Avaliar prontidão documental como `INFERENCIA` e recomendar ordem de tratamento apenas como `RECOMENDACAO` de processo.

## Fora de escopo

- Inspecionar código, schemas, migrations, testes, configurações, dependências, banco, deploy, comportamento executável ou infraestrutura.
- Comparar documentação com implementação ou produzir `EVIDENCIA_IMPLEMENTACAO`.
- Reabrir amplamente ou alterar `docs/raw/`; consultar fontes externas ou internet.
- Validar ciência, escolher fórmula/pesos/calibração, aprovar requisito/wireframe/backlog, definir domínio/modelo de dados ou arquitetura.
- Resolver pendência, escolher alternativa, criar ADR/PRD ou atualizar documento normativo.
- Iniciar a Etapa 9 ou produzir seu prompt.

## Fontes e autoridade

| Assunto | Fonte | Autoridade e limite |
|---|---|---|
| Execução | Solicitação aprovada da Etapa 8 e `AGENTS.md` | Governam somente esta execução e autorizam os caminhos enumerados. |
| Planejamento | `PLANS.md` | Define estrutura, estados, histórico, validações e ponto de parada. |
| Classificação e conflitos | `SOURCE_AUTHORITY.md` | Impede transformar análise, recorrência, proposta ou implementação alegada em norma. |
| Identidade documental | `DOCUMENT_REGISTER.md` | Governa IDs, caminhos, estados e checksums; próximos IDs livres confirmados: `DOC-013` e `DOC-PLAN-007`. |
| Pendências | `PENDING_DECISIONS.md` | `PD-001` a `PD-017` permanecem abertas; nenhuma será resolvida nesta etapa. |
| Rastreabilidade | `TRACEABILITY_MATRIX.md` | Controle documental canônico sem autoridade científica, funcional ou técnica. |
| Etapa 4 | `DOC-009` e `DOC-PLAN-003` | Autoridade analítica sobre método, achados e limitações registrados; nenhuma autoridade científica normativa. |
| Etapa 5 | `DOC-010` e `DOC-PLAN-004` | Autoridade analítica sobre método, achados e limitações registrados; nenhuma autoridade científica/operacional normativa. |
| Etapa 6 | `DOC-011` e `DOC-PLAN-005` | Autoridade analítica sobre método, achados e limitações registrados; nenhuma autoridade de produto, UX ou dados. |
| Etapa 7 | `DOC-012` e `DOC-PLAN-006` | Autoridade analítica sobre método, achados e limitações registrados após a promoção delimitada desta execução. |

Classificações admitidas: `FATO_DOCUMENTADO`, `DECISAO_CONFIRMADA`, `DECISAO_RELATADA_PENDENTE_DE_VERIFICACAO`, `PROPOSTA`, `EM_AVALIACAO`, `INFERENCIA`, `RECOMENDACAO`, `PENDENCIA_DE_DECISAO` e `NAO_ESPECIFICADO`. `EVIDENCIA_IMPLEMENTACAO` é proibida.

## Baseline e alterações preexistentes

- Commit inicial: `9c7c8dcba072169d564f89223c48dde0fa48a7fc`.
- Branch inicial: `development`.
- `git status --short --untracked-files=all`: vazio; nenhuma alteração preexistente rastreada ou não rastreada.
- `docs/raw/`: 13 arquivos regulares Markdown, permissões `664`, 13 caminhos e SHA-256 coincidentes com `DOCUMENT_REGISTER.md`; delta Git inicial vazio.
- `DOC-PLAN-006`: caminho ativo, estado interno `AGUARDANDO_REVISAO`, registro `EM_REVISAO`.
- `DOC-012`: `EM_REVISAO`.
- Registro documental: 32 identificadores nas duas tabelas, em mesma ordem; `DOC-013` e `DOC-PLAN-007` livres.
- Matriz global: 13 nós, 16 relações `TR-NNN` e 10 lacunas `GAP-NNN`.
- Pendências: `PD-001` a `PD-017`, todas `ABERTA`.

## Método de consolidação e deduplicação

1. Extrair cada achado e pergunta diretamente dos quatro relatórios, preservando ID e localizador.
2. Atribuir cada ocorrência a exatamente um problema/pergunta consolidado como origem primária.
3. Agrupar somente quando houver mesmo problema decisório/documental, causa material, autoridade e decisão essencial; registrar justificativa do agrupamento.
4. Manter separados itens com autoridade, aplicabilidade, período, estado ou resolução independentes.
5. Registrar relações secundárias sem duplicar a origem primária nem inflar contagens.
6. Aplicar `CONFLITO_DOCUMENTAL` somente quando os cinco critérios estritos da solicitação forem satisfeitos; preservar os dois conflitos próprios da Etapa 5.
7. Calcular distribuições mecanicamente a partir das tabelas finais, distinguindo eixos que não podem ser somados.
8. Relacionar problemas/perguntas a `PD-NNN` e `DEC-PKG-NNN` sem responder ou resolver decisões.

## Dependências, riscos e decisões pendentes

- `PD-001` limita o uso normativo do escopo institucional; nenhum dos 13 nós foi classificado como documento institucional aprovado.
- `PD-002`–`006` mantêm autoridades científica, produto, dados, UX e arquitetura não designadas.
- `PD-007`–`013` preservam alternativas técnicas sem decisão definitiva.
- `PD-014`–`016` preservam o modelo, a terminologia e as regras de laboratórios/áreas; `PD-017` preserva o estado de artefatos do Figma.
- Risco de falsa deduplicação por semelhança lexical; mitigação: exigir causa, autoridade e decisão comuns.
- Risco de confundir ocorrências bloqueantes com bloqueios únicos; mitigação: tabelas e contagens separadas.
- Risco de promover análise a norma; mitigação: classificação e limites explícitos em cada catálogo.
- Risco de referência quebrada em catálogos extensos; mitigação: verificações mecânicas de namespaces, cobertura e links.
- Mudança externa em `docs/raw/`, commit ou caminho não autorizado exige reavaliação imediata.

## Etapas e critérios de conclusão

| Etapa | Estado | Critério |
|---|---|---|
| Preflight e baseline | Concluída | Governança, registros, quatro relatórios, três planos arquivados, plano ativo, Git, IDs e integridade inicial conferidos. |
| Gate mecânico da Etapa 7 | Concluída | 9/34, 9/69/10/19, 49 `ARCH`, 49 `ROAD`, 12 matrizes, 20 cadeias, 31 achados, 30 perguntas e 15 bloqueios confirmados; roadmap 24+25 e três fases sobrepostas confirmado. |
| Encerrar Etapa 7 | Concluída | Aprovação, limites, estados, movimento e checksums finais registrados. |
| Consolidar achados/perguntas | Concluída | Cobertura 93/93 e 88/88, unicidade primária, 24/20 agrupamentos justificados e contagens fechadas. |
| Estruturar decisão/prontidão/código futuro | Concluída | 15 pacotes, ordem, 12 camadas de prontidão e 18 `CODE-CHECK-NNN` completos sem decisões ou inspeção. |
| Atualizar controles canônicos | Concluída | Matriz, pendências e registro atualizados sem apagar histórico ou resolver pendências. |
| Validar e encaminhar à revisão | Concluída | Verificações aplicáveis aprovadas; plano `AGUARDANDO_REVISAO`, relatório `EM_REVISAO`. |

## Pontos de parada

- Contagem da Etapa 7 não resolvível mecanicamente: não encerrar a etapa nem iniciar consolidação.
- Fonte conflitante sem autoridade suficiente: registrar `PENDENCIA_DE_DECISAO` e não resolver.
- Decisão normativa ou validação científica necessária: parar somente a parte afetada e avançar em análises independentes.
- Alteração externa incompatível ou caminho fora do escopo: reavaliar antes de editar.
- Final desta execução: parar obrigatoriamente para revisão da equipe antes de qualquer inspeção de código ou infraestrutura.

## Verificações previstas

- Gate e encerramento da Etapa 7, movimento, estados, limites e SHA-256.
- Baseline 20/12/8, 20/18/9, 22/28/9 e 31/30/15; totais 93/88/41.
- Cobertura 93/93 dos achados e 88/88 das perguntas, uma origem primária por ocorrência.
- Unicidade/sequência de `CON-FND`, `CON-Q`, `DEC-PKG`, `CODE-CHECK`, novos `TR` e novos `GAP`.
- Justificativa de todos os agrupamentos e separação entre 41 ocorrências e bloqueios únicos.
- Somatórios por camada, tipo, impacto, autoridade e estado.
- Tratamento de `GAP-008`, `GAP-010` e `PD-001`; nenhuma pendência resolvida e nenhum `EVIDENCIA_IMPLEMENTACAO`.
- Treze nós preservados; contagens e legendas da matriz fechadas.
- Correspondência integral das duas tabelas do registro e validade de todos os caminhos.
- Links Markdown locais, estrutura de tabelas, segurança, escopo Git, `git diff --check` e revisão integral do diff.
- Identidade 13/13 de caminhos, tipos, bytes, permissões, `mtime`, SHA-256 e diff vazio em `docs/raw/`.
- Identidade dos relatórios aprovados das Etapas 4 a 6 contra o commit inicial.
- Lint Markdown somente se já configurado, sem instalar ferramenta.

## Histórico

| Data | Estado | Evento e evidência |
|---|---|---|
| 2026-08-26 | `NAO_INICIADO` | Próximos IDs `DOC-PLAN-007`/`DOC-013`, baseline limpo, corpus de controle e linha de base de `docs/raw/` confirmados antes da edição. |
| 2026-08-26 | `EM_ANDAMENTO` | Leitura integral obrigatória concluída; gate mecânico da Etapa 7 aprovado, incluindo 49 `ROAD-NNN` = 24 `PROPOSTA` + 25 `RECOMENDACAO` e três fases como eixo estrutural sobreposto. |
| 2026-08-26 | `AGUARDANDO_REVISAO` | Etapa 7 concluída/arquivada; `DOC-013` consolidou 93 achados em 58 problemas, 88 perguntas em 52, 41 ocorrências bloqueantes em 26 bloqueios únicos, 15 pacotes e 18 verificações futuras; controles atualizados e validações aplicáveis aprovadas sem inspeção de implementação. |

## Ponto de parada previsto

Ao final, este plano permanecerá em `AGUARDANDO_REVISAO` e `DOC-013` em `EM_REVISAO`. A execução deve parar antes de qualquer inventário de código, infraestrutura, schema, migration, teste, configuração, banco, deploy ou comportamento.
