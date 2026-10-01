# Plano de consolidação decisória da IMP-006

**Identificador**: `PLAN-IMP-006-CONTRATO-EXPERIMENTAL`

**Estado**: `CONCLUIDO`

**Início**: 2026-09-18

**Conclusão**: 2026-09-19

## Objetivo e resultado esperado

Consolidar uma decisão rastreável e implementável para o contrato experimental IHFR v0.1 antes de `$speckit-plan`, preservando os conflitos históricos, separando `G2-ENG` de `G2-SCI` e definindo o contrato operacional mínimo de G3 sem executar código ou promover validação científica definitiva.

## Escopo

- Ler as fontes científicas, matemáticas, operacionais e de governança autorizadas, sem usar `docs/code-first-prd/**`.
- Criar um único registro canônico da decisão e apontadores curtos nos documentos indicados pela equipe.
- Reconciliar a IMP-006 com `ihfr-measurement-v1`, registrar a evolução de entrada necessária e preparar texto para o futuro PR.
- Validar documentação, criar um commit documental e publicar a branch sem force.

## Fora de escopo

`speckit-plan`, tarefas, análise, implementação, código, schema, migration, banco, testes funcionais, PR e merge. `docs/raw/**` permaneceu imutável.

## Fontes e autoridade

- `DECISAO_CONFIRMADA`: solicitação da equipe de 2026-09-18 autorizou selecionar `DOC-RAW-013` como contrato experimental preferencial e definiu os limites dessa seleção.
- `HISTORICO_IMUTAVEL`: `docs/raw/**` forneceu conteúdo candidato e alternativas, sem validação científica definitiva.
- `EVIDENCIA_IMPLEMENTACAO`: IMP-005 e o repositório definiram a fronteira técnica já disponível.
- `PENDENCIA_DE_DECISAO`: validação científica especializada, calibração de campo e ativação de versões futuras.

## Estado inicial e riscos

- Branch `006-ihfr-diagnosis`, HEAD local/remoto `ab5e30b2cf1e78c5ab20c9467d003cba1041d8ec`, divergência `0/0`, árvore inicialmente limpa.
- `origin/development`: `5d9ca6f8f848867e8152bc25e86abc9a6e73358f`; head integrado da IMP-005 era ancestral.
- Riscos tratados: promoção indevida de evidência histórica; incompatibilidade de entrada oculta; duplicação do registro; alteração de contratos implementados fora do escopo.

## Resultado

- O [ADR-0001](../../governance/ADR-0001-contrato-experimental-ihfr-v0-1.md) tornou-se o registro canônico único da decisão.
- O manifesto `ihfr-math-experimental-v0.1.0` recebeu conteúdo ativável e hash canônico reproduzível.
- A matriz registrou 15 conflitos e preservou inativo o perfil regional `35/30/25/10`.
- `G2-ENG` ficou em `G2_ENG_DEPENDE_DE_EVOLUCAO_DE_ENTRADA`; `G2-SCI`, em `NAO_VERIFICADO_VALIDACAO_POSTERIOR`; G3 foi resolvido documentalmente para planejamento da v0.1.
- A evolução faltante foi limitada ao suplemento versionado de `landUseType` e à exigência de `slopePercent` presente.

## Validações concluídas

- Links locais dos documentos alterados: sem destinos ausentes.
- JSON, pesos, entradas, classes, labels e hash canônico do manifesto: consistentes.
- SHA-256 das sete fontes científicas/matemáticas principais e alternativas: reproduzidos.
- `docs/raw/**`, código, schema, migrations, dependências, contratos da IMP-005 e `.specify/feature.json`: fora do diff.
- Terminologia experimental, matriz de conflitos, alternativa regional, apontadores e texto para o futuro PR: revisados.
- Rechecagem remota: branch IMP-006 permaneceu `0/0`; avanço de `origin/development` para `10fdb8b` continha somente a IMP-007 e foi reconciliado documentalmente, sem merge.
- `git diff --check`: sem erros antes do arquivamento; repetição prevista imediatamente antes do commit.

## Histórico

| Data | Estado | Evento |
|---|---|---|
| 2026-09-18 | `EM_ANDAMENTO` | Gate Git concluído; leitura e consolidação iniciadas conforme solicitação da equipe. |
| 2026-09-19 | `CONCLUIDO` | Decisão, manifesto, reconciliação, apontadores e validações documentais concluídos; plano arquivado para o commit documental. |
