# Recuperação de senha

## Separação do fluxo vigente

A troca autenticada atual exige senha corrente e deve permanecer. Recuperação é pública, baseada em posse do e-mail, e nunca aceita o código de seis dígitos da verificação cadastral como prova de reset.

## Jornada recomendada

1. `POST /request`: validar forma do e-mail; aplicar limites compartilhados por origem e chave HMAC do e-mail; responder `202` com texto e latência comparáveis em todos os casos.
2. Para conta elegível, gerar 32 bytes por CSPRNG, codificar base64url, persistir digest criptográfico com finalidade/conta/expiração e criar outbox. Novo pedido invalida tokens anteriores da mesma finalidade.
3. Enviar URL construída de `APP_PUBLIC_URL`, não de headers. Token fica no fragmento ou é capturado e removido do endereço antes de carregar terceiros; política `Referrer-Policy: no-referrer`, sem analytics na página.
4. GET apenas apresenta formulário e pode validar forma/estado sem consumir.
5. POST confirma token, nova senha e confirmação. Aplicar mesma política de senha vigente (a ser explicitamente inventariada; hoje o serviço não demonstra política central forte).
6. Transação consome token, grava bcrypt, incrementa `credentialVersion` e agenda aviso. Sucesso expira cookie e exige novo login.

Parâmetros `PROPOSTA`: token válido 30 min; 3 solicitações/hora por e-mail/origem e limite global defensivo; resposta de sucesso não muda estado/papel.

## Contas especiais

- Inexistente: nenhuma outbox, mesma resposta externa.
- Não verificada: recomendação é direcionar para verificação, sem revelar existência na solicitação pública; decisão de elegibilidade necessária.
- `BLOCKED`/`INACTIVE`/`PENDING`: pode receber aviso conforme política, mas reset não ativa nem permite login.
- E-mail alterado: tokens vinculados ao e-mail/versão anterior são invalidados.
- Admin: mesmo fluxo e revogação; nenhuma exceção enfraquece prova.

## Revogação concreta

Hoje o JWT guarda só `userId` por sete dias; reconsultar `status` bloqueia contas desativadas, mas senha alterada não invalida o token. Proposta:

- incluir `credentialVersion` no JWT;
- no `requireAuth`, reconsultar versão atual junto a status/papel;
- reset incrementa versão atomicamente;
- token antigo falha na próxima request;
- opcionalmente manter `sessionIssuedAfter` para incidentes globais, sem substituir versão por credencial.

## Casos excepcionais

- Resposta perdida depois do commit: token já consumido; login com nova senha funciona; repetir mostra prova inválida sem reverter senha.
- Duas submissões: uma vence; a outra não regrava nem incrementa novamente.
- Expiração durante digitação: POST usa horário transacional; falha e oferece nova solicitação.
- Provedor atrasado: link expirado não é estendido; novo pedido invalida anterior.
- Aviso de senha alterada é notificação, não link de reversão; inclui orientação de suporte definida pela equipe.
