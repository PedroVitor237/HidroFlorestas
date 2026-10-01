# Tasks: Usabilidade pré-Lovable

**Input**: spec.md, plan.md, research.md, data-model.md, contracts/ui.md, quickstart.md.
**Tests**: riscos concretos solicitados (tempo, valores enviados, sessão/erro e acessibilidade).

## Phase 1: Setup

- [x] T001 Conferir baseline, publicar documentação e registrar decisões em docs/plans/active/estabilizacao-relatorios-interface/PLAN.md.
- [x] T002 Criar artefatos focais e checklist de qualidade em specs/011-usabilidade-pre-lovable/.

## Phase 2: Foundational

- [x] T003 Inspecionar contratos e navegação, registrar conclusões em specs/011-usabilidade-pre-lovable/research.md.

## Phase 3: US1 — Logout (P1)

Goal: saída antes/depois de laboratório. Independent test: Tab/Enter, móvel, sucesso/falha/retry.

- [x] T004 [US1] Adicionar saída responsiva do workspace em src/components/top-bar/index.tsx e src/app/(private)/workspace/layout.tsx.
- [x] T005 [US1] Exercitar rota/contexto existentes e layouts por navegador offline em tests/ui/pre-lovable.spec.ts.

## Phase 4: US2 — Momento da coleta (P1)

Goal: sugestão editável sem deslocar instante. Independent test: três fusos, revisão/envio/consulta e erros.

- [x] T006 [US2] Adicionar testes de conversão, DST, edição e roundtrip em tests/unit/collection-date-time.test.ts e ajustar tests/unit/collection-form-state.test.ts.
- [x] T007 [US2] Implementar adapter e controles em src/lib/collection-date-time.ts e src/components/collections/collection-form-state.ts e collection-form.tsx.
- [x] T008 [US2] Aplicar apresentação comum na revisão/detalhe e consulta ambiental/mapa em src/components/collections/, src/components/environmental-data/environmental-data-page.tsx e src/components/territorial-map/territorial-map-view.tsx; adaptar tests/e2e/collection-registration.spec.ts, full-ui-flow.spec.ts, ihfr-diagnosis-manage.spec.ts e helper support/collection-occurrence.ts; verificar payload em tests/ui/pre-lovable.spec.ts.

## Phase 5: US3 — Uso da terra (P2)

Goal: sete rótulos com enum intacto. Independent test: opções e payload Floresta/Pastagem/SAF.

- [x] T009 [US3] Testar mapeamento e payload em tests/unit/land-use-labels.test.ts e tests/ui/pre-lovable.spec.ts.
- [x] T010 [US3] Implementar dicionário e ajuda rastreável em src/components/ihfr-diagnosis/land-use-labels.ts e ihfr-diagnosis-management.tsx.

## Phase 6: Polish

- [x] T011 Executar checks, documentar resultados/limites e atualizar docs/plans/active/estabilizacao-relatorios-interface/PLAN.md, analise-preliminar.md e specs/011-usabilidade-pre-lovable/implementation-evidence.md; commit/push final sem merge/deploy.

## Dependencies and Parallel Opportunities

T001 → T002 → T003 → histórias independentes → T011. US1: T004 → T005; US2: T006 → T007 → T008; US3: T009 → T010. Dicionário/adapter/testes usam arquivos distintos e permitem execução paralela técnica; implementação nesta sessão sequencial, sem delegação. Testes browser compartilham arquivo e são sequenciais.

## Implementation Strategy

MVP US1, validar; entregar US2 e US3 incrementalmente, validar; checks transversais e publicação da branch. Sem deploy. Onze tarefas (2 US1, 3 US2, 2 US3, 4 comuns); formato IDs/labels/paths conferido. Hooks ausentes.
