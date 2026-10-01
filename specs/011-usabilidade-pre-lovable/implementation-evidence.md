# Evidência de implementação — usabilidade pré-Lovable

Data de referência: 2026-10-01, America/Fortaleza. Branch `fix/usabilidade-pre-lovable`; base documental `f8b2a4755aa14f1543cd0bdd656c1c30c9b89f0a`, publicada em development e confirmada por git ls-remote antes da criação da branch. `EVIDENCIA_IMPLEMENTACAO` descreve somente os alcances abaixo. Commit/push final terão SHA confirmado na entrega, sem merge/deploy.

## Comportamento

- US1: TopBar do workspace oferece Sair em desktop/móvel; laboratório mantém Sidebar e administração mantém AdminShell, sem segunda saída no cabeçalho. Todos usam /logout → POST existente, com limpeza do estado e replace/refresh no sucesso; erro/retry preservados. Backend/autenticação não alterados.
- US2: controle datetime-local editável, sugestão atual uma vez no browser (depois da hidratação), com segundos/milissegundos. Offset visível; modo dispositivo usa a data escolhida e modo manual permite outro offset. Gaps DST e horas repetidas exigem correção/declaração explícita em vez de normalização silenciosa. Revisão, retorno, envio e erro mantêm horário/chave. API/serviço/schema preservados. Revisão, detalhe, consulta ambiental e painel territorial exibem ocorrência em português com offset registrado, independente do leitor.
- US3: sete rótulos portugueses conforme ADR-0001 §7; payload técnico intacto. Ajuda textual visível e aria-describedby explicam predominância, ausência e distinção de solo exposto. Texto científico quebra linha em móvel. Nenhum peso/score/categoria/cálculo modificado. Consulta de diagnóstico não expõe landUseType no DTO público atual; não foi inventada nova projeção. Uso livre da área é conceito distinto e não foi recategorizado.

## Checks e resultados

Runtime Node v24.19.0 instalado; nenhuma dependência nova.

| Verificação | Resultado e alcance |
|---|---|
| npm run test:unit | PASS fora do sandbox: 255/255 testes, 27 suítes. Inclui conversões, estados e roundtrip pelo CollectionsService existente com armazenamento em memória. Primeira execução restrita falhou em diagnósticos de subprocessos; repetida fora do sandbox passou. |
| node --import=tsx --test --test-isolation=none tests/integration/auth-logout.test.ts tests/integration/collections-route.test.ts | PASS: 7/7. Handlers reais com dependências simuladas: cookie expirado (Max-Age=0, Expires, Path, HttpOnly, SameSite), erro de remoção, POST/GET e envelopes. Sem banco. |
| npm exec -- playwright test --config tests/ui/playwright.config.ts --max-failures=1 | PASS final: 12/12, Chromium instalado, 16,4s. Seis cenários de saída desktop/375px; três temporais em America/Fortaleza, UTC e Asia/Kathmandu; três payloads FOREST/PASTURE/AGROFORESTRY com sete opções conferidas. Tab/Enter, toque no retorno à edição, falha/retry e ausência de overflow exercitados. |
| npm run typecheck | PASS; também inclui harness e ajustes dos E2E existentes. |
| npm run lint | PASS, zero erros e quatro warnings preexistentes em sign-up/route.ts, app/page.tsx, user-profile/index.tsx e white-box/index.tsx. |
| npm run build | BLOQUEADO no Turbopack por Operation not permitted ao criar processo/abrir porta no processamento CSS, inclusive repetição escalada. Geração Prisma concluída, sem migration/conexão ao banco. |
| npm exec -- next build --webpack | PASS: compilação, TypeScript, geração de páginas e rotas. Alternativa diagnóstica apenas; script padrão e dependências não alterados. |
| npm run test:integration | NÃO EXECUTADO além do preflight: falta TEST_DATABASE_CONFIRMATION; nenhuma operação de banco. |
| git diff --check; referências locais; diff/escopo | PASS na revisão final; relatórios de corte 01/10 e docs/raw intactos. Sem arquivos de ambiente/credenciais no commit. |

Comando de navegador nesta máquina: prefixar PATH com o Node 24 instalado e `PLAYWRIGHT_CHROMIUM_EXECUTABLE=/home/pedrovitor237/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome`. A config permite override e continua usando browser padrão em outros ambientes. O executável esperado originalmente pelo Playwright não estava instalado; utilizado Chromium existente. Seu lançamento restrito foi bloqueado pelo sandbox e repetido com permissão.

O harness compila componentes reais com esbuild e CSS Tailwind existente. AuthProvider, LogoutPage, TopBar, WorkspaceLayout, Sidebar, AdminShell, CollectionForm/Detail e IHFRDiagnosisManagement são reais. Navigation/Link/Image e respostas API são simulados. A consulta browser usa projeção sintética; o roundtrip pelo serviço é testado separadamente com armazenamento em memória. Não equivale a E2E Next.js autenticado com PostgreSQL, invalidação real de cookie no navegador ou validação publicada. O handler real de cookie foi exercitado nos testes de rota.

Falhas intermediárias do ensaio: clock móvel avançava após instalação e contrariava comparação exata; passou com fixed time. Texto científico preexistente ultrapassava 375px; break-all resolveu e ensaio passou. Campo extra readOnly no contexto do harness foi removido após typecheck. Nada dessas falhas alterou contratos API/DB.

## Arquivos afetados

Código: `src/app/(private)/workspace/layout.tsx`; `src/components/top-bar/index.tsx`; `src/components/collections/collection-form-state.ts`, `collection-form.tsx`, `collection-review.tsx`, `collection-detail.tsx`; `src/types/collection.type.ts`; `src/lib/collection-date-time.ts`; `src/components/environmental-data/environmental-data-page.tsx`; `src/components/territorial-map/territorial-map-view.tsx`; `src/components/ihfr-diagnosis/land-use-labels.ts`, `ihfr-diagnosis-management.tsx`.

Testes: `tests/unit/collection-date-time.test.ts`, `collection-form-state.test.ts`, `collections-service.test.ts`, `land-use-labels.test.ts`; `tests/ui/harness.tsx`, `playwright.config.ts`, `pre-lovable.spec.ts`; atualização de `tests/e2e/collection-registration.spec.ts`, `full-ui-flow.spec.ts`, `ihfr-diagnosis-manage.spec.ts` e helper `tests/e2e/support/collection-occurrence.ts` para controles/rótulos novos. Os três E2E dependentes de banco foram ajustados, mas não executados sem ambiente isolado confirmado.

Documentação: artefatos deste diretório, plano transversal e análise preliminar. Ponteiro local ignorado `.specify/feature.json` atualizado pelo workflow; não integra commit. Sem hooks de extensão; checklist de requisitos 16/16 PASS, nenhuma aprovação extra exigida. Tarefas organizadas em três histórias, sem delegação.

## Limites e continuidade

`PENDENCIA_DE_DECISAO`: definições ambientais/limiares por categoria, especialmente pastagem degradada, ainda precisam de validação. Não há descrições científicas inventadas. Município/UF e rascunhos permanecem ADIADO. Ciência mantém CONTRATO_EXPERIMENTAL, VALIDACAO_CIENTIFICA_PENDENTE, SUJEITO_A_RECALIBRACAO e NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO.

Não foram executados E2E reais de banco/HTTPS, migrations ou suites científicas de integração/contrato porque o ambiente isolado não está confirmado e não houve mudança dessas camadas. Nenhum dado real foi alterado. Validação com leitores de tela, Safari/iOS/Android físicos e testes humanos permanecem futuros; controle nativo pode variar visualmente entre browsers.

`RECOMENDACAO`: fase apta a preparar o prompt Lovable em próxima execução, incorporando comportamentos aprovados e limitações; completar inventário de telas/estados/permissões e revalidar E2E real quando houver ambiente isolado. Prompt não gerado. Proposta preferencialmente em repositório separado; avaliação/integracão posteriores. Reconciliação canônica OSM/inventário de relatórios já registrada continua necessária e fora dos caminhos autorizados desta entrega.
