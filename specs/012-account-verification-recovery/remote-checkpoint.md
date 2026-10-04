# Checkpoint único: políticas de contas e homologação

Data de referência: 2026-10-04, America/Sao_Paulo.

Estado: `DECISAO_CONFIRMADA` para políticas e destinos aprovados abaixo;
provisionamento e jornadas ainda não executados. Origem do requisito de checkpoint:
`execucao-02-contas-e-homologacao-sol-ultra.md`, seções 5.2, 6, 11 e 14,
explicitamente invocado pelo usuário. Nenhuma escrita remota foi realizada antes
da aprovação.

## Base observada

- `EVIDENCIA_IMPLEMENTACAO`: worktree separado
  `C:/projetos/consolidados/HidroFlorestas-accounts`, branch
  `feat/account-verification-recovery`, base
  `80ff1cfbe7799fccdde5be923530e3a6edf62010`.
- `EVIDENCIA_IMPLEMENTACAO`: o fechamento é descendente do commit funcional
  `a56cc9ea1cd23ee339d3a6c5b0154a07dd1ff917`; `origin/main` local ainda não o contém.
- `EVIDENCIA_IMPLEMENTACAO`: origin é `PedroVitor237/HidroFlorestas` no GitHub.
- `EVIDENCIA_IMPLEMENTACAO`: conector Vercel autenticado na equipe
  `thalesvalente`, ID `team_UKFNrfWtsO9TmGSRLCGcTME4`; consultas de projetos
  na conta/equipe e por repositório retornaram zero. Conta informa plano Hobby.
  Isso não prova acesso ao projeto dos juniors nem autorização para alterá-lo.
- `EVIDENCIA_IMPLEMENTACAO`: nenhum conector Neon/scheduler nem autenticação CLI
  dessas plataformas foi localizado. Autenticação humana pode ser necessária.
- `FATO_DOCUMENTADO`: a Fase 1 registrou SMTP Gmail e recebimento humano aprovados;
  reutilizar somente a configuração privada autorizada do remetente, sem pedir
  novamente senha de aplicativo e sem copiar o ambiente inteiro.

## Políticas recomendadas para homologação isolada

| Tema | Recomendação e impacto |
| --- | --- |
| Estado administrativo | Preservar TD-017: cadastro público `ACTIVE`; criações internas continuam `PENDING` por default. E-mail não verificado tem sessão restrita, sem workspace/admin/APIs privadas. |
| Verificação | Código textual de seis dígitos; 15 minutos; cinco tentativas; reenvio após 60 segundos; cinco emissões/hora por conta e origem confiável. Sessão restrita 30 minutos, retomada por login legítimo. |
| Recuperação | `ACTIVE`, incluindo ainda não verificada, pode recuperar por token opaco de 32 bytes/30 minutos/uso único; três pedidos/hora por endereço e origem, proteção global. Reset não verifica e-mail, reativa estado, muda papel nem cria vínculo. |
| Outros estados | `PENDING`, `INACTIVE`, `BLOCKED` não recebem recuperação pública nem acesso. Resposta pública permanece neutra. Admin `ACTIVE` segue a mesma política de elegibilidade e preserva autoridade. |
| Revogação | Reset e troca autenticada incrementam `credentialVersion` atomicamente, revogam sessões normais/restritas antigas, enfileiram aviso e exigem novo login. Troca exige senha atual e confirmação da nova. |
| Legado | Compatibilidade somente para coorte explicitamente existente antes da migration e versão zero; não preencher `emailVerifiedAt`. No ambiente novo, testar essa coorte exclusivamente com fixtures sintéticas. Nenhuma transição de contas reais está autorizada. |
| Identidade | Preservar endereço factual, usar forma canônica trim + lowercase consistentemente em cadastro/login/verificação/reset; preservar pontos e `+alias`. Preflight e índice único recusam colisões; nenhuma fusão/correção em massa. |
| Senha nova | Mínimo 15 caracteres Unicode, máximo 72 bytes UTF-8; sem composição obrigatória, trim, normalização, truncamento ou pré-hash. Manter bcrypt custo 10. Login legado não aplica o novo mínimo aos hashes existentes. |

As recomendações não são decisões históricas. A migration e o rollout estão
restritos aos bancos isolados desta fase; produção requer decisão e preflight
próprios.

## Plano remoto concreto proposto

1. Publicar exclusivamente `feat/account-verification-recovery` em
   `PedroVitor237/HidroFlorestas` após GATE A. Antes do push, conferir hooks,
   workflows e integrações; se disparar produção, impedir essa publicação.
   Sem merge, force, tag, mudança de visibilidade ou alteração da Fase 1.
2. Criar projeto Vercel separado `hidroflorestas-accounts-homologation` na equipe
   `thalesvalente`, apontado exclusivamente ao candidato da Fase 2. O target que
   Vercel denomina `production` pertence somente a esse projeto de homologação;
   não é produção real do HidroFlorestas. Ajustes de acesso limitados ao projeto
   novo; testadores usam a aplicação sem login Vercel.
3. Criar projeto Neon vazio `hidroflorestas-accounts-homologation`, banco lógico
   `accounts_homologation`, sem branching/cópia de banco com usuários reais.
   Executar bootstrap versionado e migrations somente após preflight de
   identidade/vazio, com configurações e chaves próprias.
4. Usar cron-job.org para POST HTTPS autenticado a cada 60 segundos no endpoint
   `/api/internal/mail/process` desse projeto. Compartilhar com o scheduler
   somente URL e `MAIL_WORKER_SECRET`; nunca banco/JWT/SMTP/chaves de prova/cifra.
   Sem cron de minuto nativo no Hobby, que só permite execução diária.
5. Reutilizar remetente de teste Gmail já autorizado. Autorizar destinatários por
   allowlist server-side preparada privadamente; não limitar domínios a Gmail
   nem tratar a caixa do desenvolvedor como lista definitiva dos testadores.
6. Manter homologação e scheduler operacionais após testes; não remover contas de
   testadores. Pausar só mediante acordo ou incidente material documentado.

## Limites e custos

- Nenhum upgrade/contratação paga está incluído. Recursos gratuitos dependem de
  conta, elegibilidade e cotas verificadas no provisionamento.
- Vercel Hobby não permite cron nativo a cada minuto. Fonte oficial consultada:
  <https://vercel.com/docs/cron-jobs/usage-and-pricing>.
- cron-job.org informa chamadas a cada minuto e serviço gratuito; API administrativa
  padrão tem 100 requisições/dia, diferente das execuções agendadas. Fontes:
  <https://cron-job.org/en/> e <https://docs.cron-job.org/rest-api.html>.
- Neon Free anuncia 100 CU-hours/projeto/mês e 1 GB/projeto na atualização de
  2026-10-02: <https://neon.com/blog/neon-free-plan-1-gb-per-project>.
- `INFERENCIA`: worker a cada minuto pode impedir scale-to-zero. Compute mínimo
  de 0,25 CU sempre ativo consumiria cerca de 180 CU-hours em 30 dias, acima de
  100. Portanto não prometer operação gratuita ilimitada. Monitorar a cota e
  apresentar nova autorização se extensão exigir custo/cadência diferente;
  não habilitar cobrança nem desligar silenciosamente.
- Meta de homologação: acionamento 60 s e aceitação SMTP normalmente até 120 s,
  medida com carga sintética; nenhuma promessa de entrega/inbox ou SLA externo.

## Configuração privada

Nomes previstos, sujeitos à correspondência exata com o código final:
`DATABASE_URL`, `JWT_SECRET`, `APP_PUBLIC_URL`, `SMTP_HOST`, `SMTP_PORT`,
`SMTP_SECURE`, `SMTP_REQUIRE_TLS`, `SMTP_USER`, `SMTP_APP_PASSWORD`, `MAIL_FROM`,
`MAIL_PAYLOAD_ENCRYPTION_KEYS`, `MAIL_PAYLOAD_ACTIVE_KEY_ID`,
`MAIL_IDEMPOTENCY_KEY`, `MAIL_WORKER_SECRET`, chave/keyring dedicado de challenge,
limites de contas e allowlist de testadores. Credenciais de administração dos
provedores ficam somente no mecanismo privado local/login oficial, nunca na
aplicação ou no scheduler.

Não solicitar senha, token, código, URL com credencial ou senha de aplicativo
pelo chat. Preparar fluxos oficiais de login quando faltarem sessões.

## Registro de aprovação

`DECISAO_CONFIRMADA`: em 2026-10-04 o usuário respondeu ao checkpoint apresentado
nesta conversa: **“Aprovo as políticas e os destinos propostos”**. A aprovação
abrange as políticas da tabela e os destinos/limites do plano remoto, sem
contratação paga, e conserva GATE A antes de publicação do candidato.

`PENDENCIA_DE_DECISAO`: identificação privada das caixas dos testadores e
operador/owner quando designado. Autenticação humana poderá ser necessária onde
não houver sessão; isso é precondição de execução, não autorização para pedir
credenciais pelo chat. IDs, URL efetiva, migrações e resultados serão registrados
como evidência após sua execução, sem transformar aprovação em resultado.
