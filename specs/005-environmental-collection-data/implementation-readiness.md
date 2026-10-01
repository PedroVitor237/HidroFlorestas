# Prontidão para implementação — IMP-005

Data: 2026-09-17. Estado: preparação documental revisada; integração Git pendente de autorização antes de codificar.

## Estado inicial e limites

`EVIDENCIA_IMPLEMENTACAO`: branch `005-environmental-collection-data`, HEAD `1235387ded9854be20a92f8639a502a80a2bd952`; base comum com a referência local `origin/development`: `f440282a9aefbbb85b5199d0610fdb9ecab3dc87`. A referência local de development aponta para `37fb3a4fbf7dda04b9bc3b9f2fc1c64ed3b14e13`. Não houve fetch; o estado remoto deve ser atualizado antes da integração.

Alterações preexistentes: `coverage-review.md` e `test-results/`, ambos não rastreados. Foram preservados. O primeiro é uma fotografia anterior e informa ausência de tasks/G2/G3 abertos; não representa o pacote vigente. Esta revisão sucede suas conclusões sem alterar esse arquivo.

`FATO_DOCUMENTADO`: spec, modelo e contratos registram a decisão técnica de 2026-09-17 que fecha G2/G3 para captura v1. Isso não aprova cálculo IHFR. G1 está atendido na referência de development, mas não no checkout da IMP-005. Os caminhos de coleta e guard necessários não existem no HEAD atual; foram conferidos na referência de development.

## Resultado da revisão

| Item | Resultado | Tratamento |
|---|---|---|
| Pré-requisitos da skill | PASS | Script retorna a feature correta e todos os artefatos exigidos |
| Checklist requirements | PASS, 16/16 | Marcadores preservados; não equivale a aceite funcional |
| Histórias/requisitos | 2 histórias, 19 FR, 6 SC | Cobertura documental abaixo |
| Tarefas | 38, nenhuma concluída | Codificação não iniciada |
| Integração IMP-003/004 | BLOQUEIO OPERACIONAL | Reconciliar a branch antes de T001/código |
| Ordem RED | Corrigida | T006/T007 antes de T005; T010 antes de T008/T009; T018 antes de T017 |
| Migration | Preparação corrigida | T009 inclui exceção em .gitignore; T010 explicita script; T034 executa test:migration |
| Visual | Preparação corrigida | Cinco imagens inspecionadas; direção e limites registrados no plan; comparação incluída nas tarefas |
| Relatório anterior | Histórico preservado | Este relatório registra o estado corrente |
| Hooks | Ausentes | .specify/extensions.yml não existe |

Revisão manual de consistência dentro da preparação do implement; não alegar execução formal de speckit-analyze. Não foram encontrados requisitos funcionais sem tarefa. As correções são técnicas/documentais, sem criação de regra de negócio.

## Cobertura de requisitos

O mapeamento é `INFERENCIA` de rastreabilidade por conteúdo das tarefas, não evidência de implementação.

| Requisito | Tarefas principais |
|---|---|
| FR-001 | T011, T014–T016, T024–T027 |
| FR-002 | T001, T014–T016, T024–T027 |
| FR-003 | T002–T007, T016 |
| FR-004 | T002–T007, T019, T028 |
| FR-005 | T003, T005–T007, T018–T019 |
| FR-006 | T008–T010, T014, T033 |
| FR-007 | T008, T012, T014, T033 |
| FR-008 | T012, T014, T020, T023, T025 |
| FR-009 | T012, T014, T018, T020, T032 |
| FR-010 | T024–T031 |
| FR-011 | T011, T015, T023–T031 |
| FR-012 | T015–T016, T024–T027 |
| FR-013 | T036 |
| FR-014 | T003–T010, T012, T014 |
| FR-015 | T011–T016, T024–T027 |
| FR-016 | T012, T014, T018, T020, T032 |
| FR-017 | T009–T010, T012, T032–T033 |
| FR-018 | T002–T007, T008, T014, T028 |
| FR-019 | T002–T007, T036 |
| SC-001 | T003, T012, T023–T031 |
| SC-002 | T015, T024, T026, T031 |
| SC-003 | T003, T006, T018, T023 |
| SC-004 | T015, T023–T027, T031 |
| SC-005 | T012, T023, T032–T033 |
| SC-006 | T037, avaliação humana; não substituível por automação |

T001–T010 são fundação rastreável aos contratos; T034/T035 são validação transversal; T038 é acompanhamento de governança. Cobertura documental: 19/19 FR e roteiro para 6/6 SC. Cobertura funcional executada: não medida.

## Próximo passo concreto

`RECOMENDACAO`: atualizar a referência remota e integrar development por merge na branch 005, preservando commits existentes e alterações locais, conferir T001 e então executar as quatro fases de tasks.md. A reconciliação exige autorização própria conforme o pré-requisito de tasks.md. Nenhum merge, rebase, commit ou push foi executado nesta revisão.

Solicitar aprovação conjunta para essa integração e para iniciar a codificação após T001 passar. Se a integração revelar divergência material de contrato, registrá-la antes de seguir; não inventar solução de domínio. A autorização de implementação não significa autorização de push/publicação.

## Validação e encerramento futuro

Revisão estática de contratos, fontes, dependências, imagens e scripts; verificar diff, links novos e IDs das tarefas. Não executados: unitários, integração, migration, navegador, lint, typecheck ou build, pois nenhuma implementação foi realizada e o checkout não contém o baseline necessário. Banco isolado e runtime ainda devem ser verificados durante implementação.

Não declarar 100% concluído antes dos testes, da evidência de migration/concorrência, da revisão visual e do registro honesto de SC-006. A governança global continua condicionada ao escopo de T038; a preparação atual altera somente arquivos da feature.
