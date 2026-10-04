# Handoff de contas para equipe e testadores

Estado: `VALIDADO_LOCALMENTE; GATE_A_PASS; HOMOLOGACAO_BLOQUEADA`. Políticas e destinos foram aprovados pelo usuário em 2026-10-04, conforme [checkpoint](remote-checkpoint.md). **Não existe URL funcional de homologação nesta entrega local.** Não entregar localhost como destino de testadores nem declarar Gate B com testes sintéticos.

Matriz final do candidato: 15 gates PASS no fingerprint `cc77f24e65c66fbe2b56e248698ea2b710400d92490cfa352ba6fe5fc651dbaa`, incluindo E2E 62/62, HTTPS 2/2, integração 157/157, migration 33/33, contratos 6/6 e R1 17/17. Consultar [validation-results.json](validation-results.json) e [evidência](implementation-evidence.md) para horários, counts e limitações. As jornadas reais remotas não foram executadas.

Candidato funcional local: `d341fe402323ddfda705b8546e9aa55886815502`. Push/deploy/PR pendentes; comparação de revisão deve usar a base da Fase 1, e não main enquanto a fundação não estiver integrada. `api.vercel.com:443` não estabelece TCP desta máquina; Neon aguarda login no navegador, e lista privada de testadores/chave do scheduler ainda não foram salvas. O projeto Vercel anterior respondeu 403 e a eficácia da supressão de deploy Git precisa ser comprovada antes da publicação. Não há recurso remoto ou jornada real aprovado por esses testes locais.

Jornadas locais integradas verificadas no focal UI12: 7/7 PASS, em 2026-10-04 de 22:22:18.859 a 22:22:55.634 UTC, snapshot `36f50445eb0fdc925a9781ac8575676fe2659c3ea479dbfcc6155da174413f25`. Inclui cadastro/verificação, recuperação em outro contexto, revogação/troca e reset de ACTIVE ainda não verificada. Transporte sintético e verificação de GET/fragmento/storage comprovam o recorte local; não comprovam Gate B ou o fingerprint final após configuração de isolamento Git.

## Equipe de desenvolvimento

A branch de execução é `feat/account-verification-recovery`, worktree `C:/projetos/consolidados/HidroFlorestas-accounts`, sobre a fundação `80ff1cfbe7799fccdde5be923530e3a6edf62010`. O ambiente original e os bancos dos juniors permanecem preservados. Entradas e envelopes reais estão no [contrato HTTP](contracts/accounts.md); preparação e gates no [quickstart](quickstart.md); configuração em [.env.accounts.example](../../.env.accounts.example); operação remota no [runbook](../../docs/operations/account-homologation-runbook.md).

```powershell
./scripts/accounts-local-postgresql.ps1 -Action Status
./scripts/accounts-validation.ps1 -Gate RegressionSetup
./scripts/accounts-validation.ps1 -Gate Bootstrap
./scripts/accounts-validation.ps1 -Gate Unit
./scripts/accounts-validation.ps1 -Gate Integration
./scripts/accounts-validation.ps1 -Gate Contract
./scripts/accounts-validation.ps1 -Gate Migration
```

Os demais gates obrigatórios são CleanInstall/Mail/R1/Typecheck/Lint/Build/E2E/Https/SchemaAudit pelo mesmo runner. Serializar gates que compartilham banco, porta e `.next`; jamais concorrer build e dev/E2E. Cluster local próprio na porta 55427 exige ownership e ACL privada; aplicação/teste/referência são bancos distintos. Usar baseline formal e deploy das 11 migrations, incluindo 012+013. Não copiar env, usar db push/reset, editar migration aplicada ou operar o cluster antigo na porta 55426.

CSRF remoto valida o `APP_PUBLIC_URL` HTTPS exato com ingresso Vercel confirmado. Local próprio na porta 3001 usa Host loopback; harness HTTPS injeta `ACCOUNT_LOCAL_APP_ORIGIN` exato com flags/confirmação de teste. Não confiar x-forwarded-host, aceitar Origin nulo ou usar esse seam no Vercel. O transporte sintético do Gate A comprova app→outbox→worker→mensagem; não comprova SMTP real ou recebimento humano.

Antes de push, conferir `vercel.json`: somente a branch `feat/account-verification-recovery` tem deployment Git automático desativado. Existe integração observada no projeto Vercel anterior, portanto não confiar na ausência de workflows GitHub para isolamento. Publicação manual exige o projeto/equipe de homologação explicitamente vinculados; regra não bloqueia CLI/API externos nem comprova RootDirectory/settings privados. Nenhuma alteração do projeto anterior é autorizada.

O projeto anterior respondeu 403 ao acesso somente leitura. A [documentação oficial](https://vercel.com/docs/project-configuration/vercel-json) exige o arquivo na raiz do projeto; sua localização efetiva permanece desconhecida. O preflight recomenda manter o push pendente até comprovar a supressão naquele projeto ou resolver explicitamente esse risco material, mesmo depois de Gate A. Não usar um push experimental para verificar a proteção.

| Ação | Endpoint real | Condição |
|---|---|---|
| Cadastro | POST `/api/auth/sign-up` | firstName,lastName,email,password; Idempotency-Key UUID; resposta 201/200 e sessão restrita |
| Retomada/login | POST `/api/auth/sign-in` | email,password; destino conforme verificação/papel |
| Estado | GET `/api/auth/email-verification` | cookie verification_token |
| Confirmar código | POST `/api/auth/email-verification/confirm` | challengeId,code textual de seis dígitos |
| Reenviar | POST `/api/auth/email-verification/resend` | objeto vazio, Idempotency-Key UUID e sessão restrita |
| Solicitar reset | POST `/api/auth/password-reset/request` | email, Idempotency-Key UUID; 202 neutro |
| Confirmar reset | POST `/api/auth/password-reset/confirm` | token,newPassword,confirmPassword |
| Trocar senha | POST `/api/auth/change-password` | sessão normal,currentPassword,newPassword,confirmPassword |
| Sair | POST `/api/auth/logout` | expira cookies normal e restrito |
| Usuário atual | GET `/api/auth/me` | sessão normal vigente, DTO público |

Código de seis dígitos dura 15 min/cinco tentativas, reenvio 60 s/cinco emissões por conta/ingresso por hora; token de reset tem 32 bytes e dura 30 min/três pedidos por endereço/ingresso por hora. Global 100/h é compartilhado entre workflows e cobrado fora da transação de identidade. Quando global ou quota de reset nega, a resposta continua neutra e encerra antes de lookup/novo receipt. Nova senha tem mínimo de 15 codepoints e máximo de 72 bytes UTF-8, bcrypt custo 10; espaços preservados, valor somente whitespace recusado. Reset/troca revogam todas as sessões e provas anteriores, exigem novo login e enviam aviso sem link de reversão.

## Roteiro de navegador para testadores autorizados

Este roteiro usa somente a URL HTTPS a ser registrada acima e a caixa autorizada. Nenhum testador precisa de CLI, banco ou acesso ao hosting. Não enviar senha, código ou token por chat; usar esses dados apenas na página correta. Mensagem enfileirada não prova recebimento.

1. Abra a URL, acesse cadastro e preencha seus dados autorizados. Use senha com pelo menos 15 caracteres e até 72 bytes UTF-8, confirmando que seu gerenciador preserva espaços se houver.
2. Confira a tela de verificação pendente e a mensagem automática recebida. Digite os seis dígitos, mantendo zeros iniciais. Um código incorreto deve apresentar erro recuperável; reenvio deve aguardar o prazo indicado e recusar código substituído.
3. Antes de confirmar, recarregue e teste Sair/Entrar com sua senha: o fluxo deve retomar a verificação. Após confirmar, confira acesso adequado ao seu papel, saia e entre novamente.
4. Mantenha essa sessão no navegador A. Em navegador B/janela privada ou outro dispositivo, abra Recuperar senha, informe o endereço e confira a resposta neutra.
5. Abra o link recebido no contexto B sem sessão prévia. A abertura só mostra o formulário; o token deve desaparecer da barra de endereço. Defina e confirme nova senha e envie explicitamente.
6. No contexto A, tente uma ação privada: a sessão anterior deve ser recusada. No contexto B, senha antiga deve falhar, nova senha deve entrar e o link já usado deve ser recusado sem nova mudança. Confira o aviso automático de senha alterada.
7. Autenticado, acesse Alterar senha no menu; senha atual incorreta não deve mudar nada. Com senha atual correta e confirmação igual, deve exigir novo login e enviar aviso.

Se o código/link vencer, solicite outro pelo fluxo indicado. Se recarregar a página de reset e perder o token em memória, reabra o link do e-mail ou solicite novo. Recuperação de conta ACTIVE não verificada mantém a verificação pendente; contas PENDING/INACTIVE/BLOCKED não são reativadas por recuperação.

## Registro e fechamento

Registrar resultado de cada jornada, horário, contexto/dispositivo e recebimento sem reproduzir endereço completo/prova. Aceitação SMTP, recebimento humano, testes do agente e execução humana são evidências distintas. Gate B exige as duas jornadas e duas invocações automáticas do scheduler hospedado, incluindo recuperação controlada de backlog, com app acessível sem depender do computador do agente.

O responsável consolida SHA/fingerprint/gates em [implementation-evidence.md](implementation-evidence.md) e validation-results.json. Atualizar este estado e URL somente após comprovação; commits candidatos dependem de Gate A e a conclusão integral depende de Gate B. Não restaurar aplicação anterior que ignore verificação ou revogação; preservar schema/dados/versões/coorte e seguir o runbook para suspensão/correção compatível.
