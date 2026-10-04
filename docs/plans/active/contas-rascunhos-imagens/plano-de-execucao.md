# Plano de execução futuro

**ID:** PLAN-CRI-001

**Estado:** `AGUARDANDO_REVISAO`

**Resultado desta rodada:** planejamento completo; nenhuma tarefa implementada.

## Escopo, riscos e pontos de parada

Escopo futuro: contratos/decisões, e-mail, verificação, recuperação, drafts, imagens e regressão. Fora: convites, pagamentos, geocodificação, IA, reformulação visual completa e mudança científica do IHFR.

Pontos de parada humanos: `PD-CRI-001/002` antes do gate de verificação; responsável/cron antes de e-mail real; política de compartilhamento antes de draft colaborativo; privacidade/capa versus galeria antes de entrega de imagens; qualquer conflito de autoridade ou migration destrutiva.

## Etapas e tarefas

| ID | Objetivo/dependências | Arquivos/símbolos candidatos | Mudança/testes futuros | Conclusão |
|---|---|---|---|---|
| CRI-T001 | Resolver política pré-verificação e legado. | specs 001/009/010, governança autorizada | registrar decisão e matriz de estados | origem, autoridade e rollout aprovados. |
| CRI-T002 | Criar specs separadas/reconciliadas pelo Spec Kit. Dep.: T001 quando material. | `specs/<feature>/**` | análise cruzada, IDs deste pacote | sem requisitos duplicados/conflitantes. |
| CRI-T003 | Definir contratos compartilhados, erros, rate limit e env. | auth contracts, env validation | unit/contract | DTOs/ameaças aprovados. |
| CRI-T004 | Migration aditiva de e-mail/outbox/challenges. | `prisma/schema.prisma`, migration, generated client | preflight/migration PostgreSQL | rerun/recovery e legado demonstrados. |
| CRI-T005 | Transporte Nodemailer e templates. Dep.: T003/T004. | novos módulos server-only | TEST-001–003 | fake SMTP determinístico verde. |
| CRI-T006 | Worker/outbox/cron e runbook. Dep.: T005/decisão operacional. | route/script protegido, provider config | leases, duas instâncias, retry | nenhum job em memória; observabilidade pronta. |
| CRI-T007 | Verificação cadastro backend. Dep.: T001–T006. | signup/auth/session/guards + routes | TEST-004–009 | código/consumo/rate limit/guards provados. |
| CRI-T008 | UI mínima de verificação. | register + nova tela/componentes | E2E teclado/reenvio/erros | jornada recuperável, sem workspace indevido. |
| CRI-T009 | Reset backend e revogação. Dep.: T003–T006. | session/auth/users + routes | TEST-010–013 | token único e JWT antigo recusado. |
| CRI-T010 | UI mínima de reset. | login + páginas públicas | E2E/referrer/foco | resposta uniforme e novo login. |
| CRI-T011 | Spec/decisões do draft A. | IMP-005 e nova spec | revisão autoridade/form version | dono/retention/contrato aprovados. |
| CRI-T012 | Persistência/API draft. Dep.: T011. | schema, environmental-data services/routes | TEST-014/015/017–019 | OCC e promoção transacional provados. |
| CRI-T013 | UI draft explícito. | environmental form/state | TEST-016 + acessibilidade | save/reload/conflito claros. |
| CRI-T014 | Decidir privacidade/limites Cloudinary. | nova spec + console/docs atuais | threat/cost review | tipo de entrega e limites aprovados. |
| CRI-T015 | Modelo/assinatura/finalização de capa. Dep.: T014. | schema, areas contracts/service/routes | TEST-020–024 | ownership e substituição segura. |
| CRI-T016 | UI de capa e integração visual futura. | area form/detail/list | E2E responsivo/a11y | fallback e estados de upload claros. |
| CRI-T017 | Hardening e operação. | todos + runbooks | TEST-025, suite, smoke | métricas, alertas e rollback exercitados. |
| CRI-T018 | Reconciliação documental autorizada. | specs, TECH_DECISIONS/registers se autorizados | links/diff/checks | implementação e evidência separadas. |

## Paralelismo e ordem

Após contratos, T005/T006 podem avançar em paralelo documental com T011 e T014, mas e-mail é dependência de T007/T009. Draft e imagem não dependem um do outro. Mudanças em schema/auth/config compartilhados exigem coordenação e PRs pequenos.

Ordem recomendada: T001–T003 → T004–T006 → T007–T010 → T011–T013 → T014–T016 → T017–T018.

## Plano de commits/PRs futuros

1. `docs/specs: define mail and auth proof contracts`
2. `feat(mail): add durable outbox and Gmail transport`
3. `feat(auth): require email verification`
4. `feat(auth): add password recovery and session revocation`
5. `feat(environmental): persist personal drafts`
6. `feat(areas): add Cloudinary cover images`
7. `test/docs: harden providers and reconcile evidence`

Cada recorte deve usar branch/spec própria conforme registro vigente no início; não foram inventados números IMP, datas ou responsáveis. Migrations/configuração devem evitar PRs concorrentes.

## Validação e encerramento do plano documental

Nesta rodada: conferir 14 arquivos, links relativos, referências de código, IDs, terminologia, escopo, segredos e `git diff --check`; registrar commits locais apenas do pacote. O plano fica `AGUARDANDO_REVISAO`, porque decisões pendentes impedem declarar arquitetura definitiva aprovada, mas não a completude do material de handoff.

## Histórico

| Data | Estado | Evento |
|---|---|---|
| 2026-10-03 | `EM_ANDAMENTO` | Base remota confirmada; worktree isolado; pesquisa local/externa. |
| 2026-10-03 | `AGUARDANDO_REVISAO` | Pacote redigido; implementação permanece não iniciada. |
