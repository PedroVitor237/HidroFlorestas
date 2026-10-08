# Requisitos e critérios verificáveis

## Convenções

Cada requisito é futuro. `MUST` indica condição recomendada para aceite técnico, não implementação existente. Os parâmetros marcados `PROPOSTA` dependem das pendências em [decisões](decisoes-e-pendencias.md).

## Infraestrutura de e-mail

| ID | Ator/contexto e comportamento | Critério de aceitação |
|---|---|---|
| MAIL-FR-001 | Serviço server-side envia mensagem de verificação ou recuperação por Nodemailer/SMTP Gmail, nunca pelo cliente. | Nenhum segredo aparece em bundle, DTO, URL ou log; runtime Node.js validado. |
| MAIL-FR-002 | Configuração suporta 465/TLS imediato ou 587/STARTTLS obrigatório. | Certificado inválido ou ausência de STARTTLS falha fechado; `rejectUnauthorized` não é desativado. |
| MAIL-FR-003 | Operação persiste intenção antes do envio e tolera indisponibilidade temporária. | Falha SMTP mantém item repetível; request não depende de tarefa em memória após resposta. |
| MAIL-FR-004 | HTML e texto simples em português são gerados de dados escapados e URL-base confiável. | Testes snapshot/semânticos não contêm secrets, headers não confiáveis ou conteúdo não escapado. |
| MAIL-NFR-001 | Observabilidade registra `messageId`, tipo, estado, tentativas e erro classificado, sem código/token/endereço completo. | Auditoria de logs confirma redaction. |

## Verificação de e-mail

| ID | Jornada/regra | Critério de aceitação |
|---|---|---|
| EMAIL-FR-001 | Cadastro válido cria conta/desafio e agenda envio de código textual `^[0-9]{6}$`, preservando zero inicial. | Geração usa CSPRNG; nenhum `Math.random`; código não retorna da API. |
| EMAIL-FR-002 | Código se vincula a conta, e-mail normalizado, finalidade e desafio, com validade/uso único. | Código de outra conta/finalidade ou e-mail alterado falha sem transição. |
| EMAIL-FR-003 | Verificação consome atomicamente um desafio vigente. | Duas confirmações concorrentes produzem uma transição e uma resposta idempotente/terminal definida. |
| EMAIL-FR-004 | Reenvio invalida desafios anteriores e respeita cooldown/rate limit durável. | Mensagem atrasada antiga não verifica; disputa reenvio/validação tem um vencedor consistente. |
| EMAIL-FR-005 | Verificar define `emailVerifiedAt`, sem alterar `status`, `role` ou vínculos. | Conta `BLOCKED` continua bloqueada; nenhum privilégio é concedido. |
| EMAIL-FR-006 | Antes da verificação, somente capacidades do desafio são autorizadas. | Workspace e APIs privadas negam sessão restrita; reenviar/verificar permanecem acessíveis. |

## Recuperação de senha

| ID | Jornada/regra | Critério de aceitação |
|---|---|---|
| RESET-FR-001 | Solicitação pública aceita e-mail e responde uniformemente. | Conta existente, inexistente, bloqueada ou inelegível não é enumerável por corpo/status observável. |
| RESET-FR-002 | Conta elegível recebe link com token opaco de alta entropia, uso único e finalidade exclusiva. | Token de verificação não redefine senha; banco guarda somente prova protegida. |
| RESET-FR-003 | Nova senha é validada/confirmada e gravada com bcrypt no mesmo commit que consome token e incrementa versão da credencial. | Falha em qualquer escrita faz rollback; duas submissões não alteram duas vezes. |
| RESET-FR-004 | Sucesso exige novo login e invalida JWTs anteriores. | Guard rejeita token com versão antiga imediatamente após reset. |
| RESET-FR-005 | Abrir o link não consome token; página evita referrer/analytics indevidos. | GET não muda estado; POST explícito consome; token é removido da URL após captura segura. |

## Rascunhos ambientais

| ID | Jornada/regra | Critério de aceitação |
|---|---|---|
| DRAFT-FR-001 | Usuário `ACTIVE` com vínculo atual pode salvar parcialmente medições para coleta confirmada, em laboratório ativo. | Autorização/contexto são revalidados; cross-lab recebe resposta indistinguível de não encontrado. |
| DRAFT-FR-002 | Primeiro recorte mantém um rascunho pessoal ativo por usuário/coleta. | Upsert concorrente respeita `revision`; nenhuma sobrescrita silenciosa. |
| DRAFT-FR-003 | Payload parcial preserva ausente, vazio temporário, zero e `false`, junto à versão do formulário. | Serialização/retomada restaura exatamente os estados suportados. |
| DRAFT-FR-004 | Save explícito informa salvando/salvo/erro/conflito; sair não implica persistência. | UI acessível e reload/outro dispositivo recuperam apenas último save confirmado. |
| DRAFT-FR-005 | Confirmar revalida permissão e contrato integral, cria conjunto imutável e consome rascunho atomicamente. | Falha não consome rascunho; repetição com mesma chave/payload recupera resultado; payload divergente conflita. |
| DRAFT-FR-006 | Rascunho nunca entra em projeções confirmadas/IHFR. | Queries e testes asseguram ausência em dashboard, histórico, elegibilidade e diagnóstico. |

Extensão futura `DRAFT-FR-FUT-001`: rascunho pré-coleta de metadados terá entidade/fluxo próprios; não pode criar coleta silenciosamente no primeiro recorte.

## Imagens de áreas

| ID | Jornada/regra | Critério de aceitação |
|---|---|---|
| IMAGE-FR-001 | Usuário autorizado solicita assinatura/credencial curta para upload de imagem vinculada a uma área. | Backend valida conta, vínculo, papel, laboratório/área e parâmetros allowlisted antes de assinar. |
| IMAGE-FR-002 | Cliente envia diretamente ao Cloudinary com assinatura, preset restrito e identificador opaco. | `api_secret` nunca sai do servidor; pasta/public ID não são livremente escolhidos pelo cliente. |
| IMAGE-FR-003 | Finalização verifica resposta/asset no provedor e persiste metadados/ownership. | Asset alheio, tipo inesperado, tamanho/dimensão excedidos ou replay são recusados. |
| IMAGE-FR-004 | Primeiro recorte mantém uma capa por área; substituição é segura. | Imagem antiga continua válida até a nova estar persistida; cleanup posterior é repetível. |
| IMAGE-FR-005 | Exclusão autorizada remove referência primeiro e agenda destruição idempotente. | Falha Cloudinary não restaura referência indevida; órfão fica reconciliável. |
| IMAGE-NFR-001 | Limites e transformações controlam créditos do plano gratuito. | Métricas/alertas cobrem armazenamento, largura de banda e transformações; limites são configuráveis. |

## Requisitos transversais

- `SEC-NFR-001`: rate limits precisam de estado compartilhado entre instâncias; memória de processo não serve como autoridade.
- `SEC-NFR-002`: todos os DTOs são allowlists; códigos, tokens, HMACs, hashes, secrets e metadados internos nunca retornam.
- `DATA-NFR-001`: timestamps são UTC/timestamptz e comparados por relógio controlável em testes.
- `DATA-NFR-002`: operações mutáveis relevantes têm chave idempotente e semântica para payload divergente.
- `OPS-NFR-001`: limpeza/retry é observável, limitada e segura para repetição.
- `UX-NFR-001`: teclado, foco, `aria-live`, erros recuperáveis e estado ocupado são critérios de aceite.
