# Evidência de implementação: IMP-009

## Estado inicial e autorização

- Autorização: pedidos explícitos do usuário para executar `speckit-implement`, finalizar a IMP-009 e usar o branch Neon de teste fornecido.
- Branch de código: `009-user-administration`; baseline publicada antes desta continuação: `599bd41`.
- Alvo de dados: branch Neon isolado, descartável em 24 horas; a credencial foi mantida apenas no ambiente efêmero e não foi registrada em arquivos, comandos de evidência ou commits.
- Escopo compartilhado necessário: autenticação, middleware administrativo, schema Prisma, sidebar, interface e testes correspondentes.
- `docs/raw/**` e `specs/006-*`: sem alterações.
- Esta continuação não realizou commit, push, PR ou merge.

## Autoridade final e legado

- `User.role === ADMIN` e `User.status === ACTIVE`, reconsultados no servidor em cada operação, são a única autoridade administrativa global.
- `ResearchersLinked.role` permanece estritamente contextual ao laboratório e nunca concede administração global.
- O JWT transporta somente identidade; papel/estado enviados pelo cliente ou presentes em estado antigo da interface não são aceitos como autoridade.
- `User.isAdmin` não possui consumidores/escritores atuais e foi removido do schema e do banco de teste pela migration `20260920000100_remove_legacy_is_admin`.
- Busca de zero consumidores: ocorrências remanescentes de `isAdmin` estão classificadas como migrations/preflight histórico, baselines SQL, asserções de campo proibido e documentação histórica. Nenhuma ocorrência em código de runtime ou schema atual.
- O fluxo de superadmin grava apenas `role: ADMIN` e `status: ACTIVE`.

## Evidência PostgreSQL

- Estado inicial do alvo: três usuários sintéticos/legados, zero laboratórios, vínculos, áreas e coletas; zero contradições entre `role` e `isAdmin`.
- As migrations locais pendentes foram executadas sequencialmente e registradas como aplicadas somente após sucesso do SQL correspondente.
- `prisma migrate status`: schema atualizado após as migrations de revisão/auditoria e remoção do legado.
- Verificação final: coluna `revision` presente; coluna `isAdmin` ausente; armazenamento/trigger de auditoria imutável presentes.
- Teste de migration em schema isolado comprova criação, restrições, imutabilidade, remoção do legado e rollback integral quando o preflight encontra contradição.
- Fixtures criaram 54 contas sintéticas `@test.invalid`. Eventos de auditoria são deliberadamente imutáveis; por isso a limpeza destrutiva não é tentada e o branch descartável é a fronteira de descarte.

## Implementação observada

- Cinco endpoints administrativos com DTOs allowlisted, `Cache-Control: no-store` e erros controlados.
- Lista/detalhe com busca, filtros e paginação keyset estável por `createdAt DESC, id DESC`.
- Mutações serializáveis com revisão esperada, autoalteração proibida, no-op não destrutivo, proteção concorrente do último ADMIN ativo e auditoria na mesma transação.
- Histórico funcional minimizado, imutável, filtrado pelo alvo e paginado.
- Página protegida e responsiva com navegação administrativa, filtros, carregamento/vazio/erro, detalhe, confirmação com justificativa, recuperação textual de conflito, histórico e foco gerenciado.
- O feedback de sucesso é preservado após a recarga de lista/histórico; o defeito foi detectado pelos E2E e corrigido antes do fechamento.

## Validação executada em 2026-09-20

| Gate | Resultado |
|---|---|
| Checklists | `requirements.md` 16/16; `security-authority.md` 35/35 |
| `npx prisma validate` | PASS |
| `npx prisma generate` | PASS |
| `npm run test:migration` | PASS: 12/12, incluindo 2 cenários IMP-009 em PostgreSQL isolado |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS sem erros; 4 avisos preexistentes fora da IMP-009 |
| `npm run test:unit` | PASS: 49/49 arquivos |
| `npm run test:integration` | PASS: 63/63, incluindo concorrência, último ADMIN e segurança |
| E2E direcionado IMP-009 | PASS: 4/4 em Chromium, desktop e viewport móvel exercitado |
| Desempenho | PASS: p95 de páginas allowlisted com 50 contas abaixo de 2 s |
| `npm run test:e2e` | IMP-009 PASS 4/4; suíte global: 42 passaram, 3 falharam e 9 não executaram. Duas falhas são guards preexistentes sem `DASHBOARD_FIXTURE_CONFIRMATION`; uma é expectativa preexistente de redirecionamento da rota de laboratório, fora do recorte IMP-009 |
| `npm run build` | PASS; cinco APIs e página administrativa compiladas |
| `git diff --check` | PASS antes da reconciliação documental final; repetir no fechamento |

## Gates humanos e limites de evidência

- A automação comprovou operação por teclado do diálogo, foco de alerta/resultado e viewport móvel nos fluxos cobertos.
- Revisão humana com leitor de tela ou outra tecnologia assistiva: `NAO_VERIFICADO`. Playwright e inspeção DOM não substituem esse gate.
- A possibilidade de retornar uma conta previamente ativada para `PENDING` continua `PENDENCIA_DE_DECISAO`; a implementação preserva o contrato aprovado sem inventar política normativa.

## Compensação e recuperação

- O branch Neon temporário funciona como ponto recuperável anterior à expiração; nenhuma migration foi aplicada a produção.
- Rollback após remoção física exige migration compensatória própria e nunca pode restaurar autoridade por booleano, apagar auditoria ou reduzir revisões.
- Falhas funcionais podem desabilitar UI/rotas preservando dados; autoridade permanece exclusivamente em `role`.

## Correcao arquitetural da area administrativa — 2026-09-20

- `EVIDENCIA_IMPLEMENTACAO_ATUAL`: `/admin` e a entrada global protegida e `/admin/users` e a unica pagina canonica de gestao de contas. O caminho `/dashboard/admin/users` executa somente redirecionamento server-side temporario.
- `EVIDENCIA_IMPLEMENTACAO_ATUAL`: o shell administrativo possui navegacao responsiva para visao geral, usuarios, ambiente principal e logout, com rota atual e foco perceptiveis.
- `EVIDENCIA_IMPLEMENTACAO_ATUAL`: a visao geral usa atalhos e orientacoes operacionais sem metricas ou endpoints decorativos.
- `EVIDENCIA_IMPLEMENTACAO_ATUAL`: login bem-sucedido recebe do servidor apenas um destino allowlisted: `/admin` para `ACTIVE + ADMIN` global e `/workspace` para os demais papeis ativos. Nenhum papel de laboratorio participa dessa decisao.
- `EVIDENCIA_IMPLEMENTACAO_ATUAL`: `/admin/**` reconsulta a identidade atual com `requireAuth`; nao ADMIN segue para `/workspace`, sessao ausente segue para `/login` pela fronteira privada e APIs preservam `requireAdmin` independente da UI.
- Testes direcionados: PASS, 16 unitarios de contrato/servico/autoridade e 10 integracoes de login/guardas/seguranca.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS sem erros; quatro avisos preexistentes fora da correcao.
- `npm run build`: PASS; o manifesto confirma `/admin`, `/admin/users` e a rota dinamica legada `/dashboard/admin/users`.
- E2E administrativo direcionado: `NAO_EXECUTADO`; o guard seguro interrompeu antes da inicializacao por ausencia de `TEST_DATABASE_CONFIRMATION` e credencial do banco isolado neste worktree. Nenhuma credencial antiga foi inferida ou reutilizada.
- Revisao humana com leitor de tela/tecnologia assistiva permanece `NAO_VERIFICADO`; automacao e build nao substituem esse gate.
