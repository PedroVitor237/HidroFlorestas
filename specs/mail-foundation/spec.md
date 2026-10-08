# Feature Specification: Fundação de e-mail transacional

**Feature Branch**: `feat/mail-foundation`
**Created**: 2026-10-04
**Status**: aceite integral PASS no snapshot aedd43d9; R1, 15 gates, SMTP e smoke Gmail aprovados; recebimento confirmado pelo usuário
**Input**: Pedido para executar `execucao-01-emails-sol-ultra.md` e sua continuação `execucao-01-continuacao-emails-sol-ultra.md`, CRI-T001–CRI-T006. Slug local sem atribuir número IMP oficial.

`EVIDENCIA_IMPLEMENTACAO` histórica em 2026-10-04: fingerprint `c09e78f8536a029b15be66434f19586f6e2b07c18d9126e73ad13bef734df797`; 13 gates locais PASS, incluindo R1 17, Unit 255+12, Integration 132, Migration 27, Contract 2, E2E 55 e HTTPS 2. Configuração privada, ACL, independência das três chaves e autorização da caixa sintética estavam estruturalmente verificadas. SmtpVerify falhou por AUTHENTICATION em 18:38:41.250–18:38:44.184 UTC e novamente em 18:50:09.226–18:50:12.568 UTC, após senha fornecida privadamente. Zero mensagens enviadas naquele fechamento; smoke então NAO_EXECUTADO. A auditoria privada pós-troca passou em 19:01:29.239–19:01:31.586 UTC; seu resultado não comprovava autenticação ou entrega. Os resultados e FAIL históricos dos snapshots `69a5c648…1c818` e `3898722…e595` permanecem em [implementation-evidence.md](implementation-evidence.md).

Retomada vigente: coleta mascarada gravou conjuntamente conta/allowlist/confirmação e senha diferente da recusada, sem regenerar chaves. Os 15 gates obrigatórios foram reexecutados e passaram no snapshot `aedd43d949cdff51f749a99be541ccd8fece0286d7d03ae6fdf5fc40288ad6a8`. SmtpVerify PASS em 20:18:17.545–20:18:19.704 UTC; smoke real `enqueue → commit → worker → Gmail` PASS em 20:26:37.171–20:26:42.294 UTC, uma aceitação SMTP. Recebimento observado foi confirmado separadamente pelo usuário com “Sim”. Privacidade, precedência, bundle, segurança e revisão de escopo PASS. Os bloqueios históricos não foram apagados; não houve mudança de arquitetura nem inferência sobre a causa da nova disponibilidade da conta.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registrar uma intenção recuperável (Priority: P1)

O serviço produtor registra uma mensagem de verificação ou recuperação junto à escrita de domínio, protegendo o destinatário e a prova temporária.

**Why this priority**: uma falha de envio não pode perder a intenção confirmada.
**Independent Test**: fixture sintética confirma ou reverte produtor e mensagem juntos; a mesma chave recupera a intenção, conteúdo divergente conflita.
**Acceptance Scenarios**:

1. **Given** um produtor válido, **When** a transação confirma, **Then** domínio e intenção existem juntos.
2. **Given** falha do produtor, **When** a transação reverte, **Then** nenhuma intenção permanece.
3. **Given** chave usada, **When** o conteúdo muda, **Then** a operação recusa o conflito sem sobrescrever o original.

### User Story 2 - Processar com segurança (Priority: P1)

O operador processa mensagens pendentes em lotes limitados e recupera interrupções sem expor dados sensíveis.

**Why this priority**: protege prova e evita perder trabalho entre instâncias.
**Independent Test**: dois processadores, interrupção, leitura/autorização atrasada, relógio local atrasado, decurso monotônico, posse expirada, janela de lease insuficiente, deadlines separados, resultado tardio, provedor indisponível e expiração, com tempo e barreiras controlados.
**Acceptance Scenarios**:

1. **Given** duas instâncias, **When** disputam uma mensagem vigente, **Then** uma posse válida é atribuída e resultado de posse antiga é recusado.
2. **Given** falha transitória, **When** uma tentativa falha, **Then** é reagendada dentro da validade e do limite técnico.
3. **Given** mensagem expirada ou desafio invalidado, **When** o processamento começa, **Then** não envia e remove conteúdo sensível.
4. **Given** aceitação com resposta perdida, **When** ocorre recuperação, **Then** mantém estado consistente, admitindo duplicação do efeito externo.
5. **Given** A recebe uma leitura antiga depois de sua lease vencer e B recuperar/finalizar o item, **When** A retoma, **Then** a autorização condicional fresca recusa sua posse e A não inicia outro SMTP.
6. **Given** autorização de envio bem-sucedida com resposta atrasada, **When** o orçamento do banco descontado pelo tempo monotônico da consulta/retomada/renderização, combinado com UTC local fresco, mostra lease com menos de 17 s ou prova vencida, **Then** recusa SMTP sem renovar lease nem prolongar prova.
7. **Given** lease próxima do fim, **When** resta menos que o orçamento SMTP de 15 s mais margem de 2 s, **Then** mantém o item recuperável para outra posse enquanto validade e tentativas permitirem.
8. **Given** validade de challenge menor que a da outbox ou deadline operacional menor que a validade da prova, **When** o adaptador inicia, **Then** limita o envio ao menor prazo e encerra o socket ao vencer.
9. **Given** relógio da aplicação 8 s atrasado e 81 s monotônicos transcorridos desde o início da autorização, **When** combina os orçamentos UTC e do banco, **Then** o atraso local não cria margem para SMTP e o worker recusa a janela insuficiente.

### User Story 3 - Operar e diagnosticar (Priority: P2)

O operador configura envio seguro, observa métricas redigidas e executa smoke somente em caixa de teste autorizada.

**Why this priority**: código local não equivale a envio real ou agendamento operacional.
**Independent Test**: adaptador em SMTP local com TLS, acionamento autorizado, documentação executável e smoke Gmail separado.
**Acceptance Scenarios**:

1. **Given** configuração incompleta, **When** worker é acionado, **Then** falha fechado e páginas independentes continuam funcionando.
2. **Given** ausência de TLS obrigatório ou certificado inválido, **When** conecta, **Then** nenhum conteúdo é enviado.
3. **Given** segredo de máquina ausente/incorreto, **When** chama o endpoint, **Then** não processa a fila.

### Edge Cases

- Rotação mantém chaves antigas até mensagens pendentes serem migradas ou expirarem; adulteração e chave desconhecida falham fechado.
- Cancelamento depois da autorização final pode ocorrer antes ou durante SMTP; essa janela não admite garantia de impedir ou desfazer todo efeito externo. O resultado tardio não reabre a intenção cancelada.
- Resposta perdida depois de aceitação pode repetir o efeito externo no retry (`at-least-once` limitado por validade/tentativas); não há garantia de exatamente uma vez, entrega ou inbox.
- O orçamento pré-envio desconta todo decurso monotônico da consulta/retomada/renderização e usa o menor valor com UTC local; não presume igualdade absoluta entre relógios banco/aplicação. Sincronização operacional em UTC é recomendada. A margem de 2 s para fechamento/persistência não protege contra pausa ilimitada do processo/event loop.
- Código `000042` permanece textual; prova não aparece em assunto ou preheader.
- Mensagens terminais perdem destinatário/prova; metadados não perpetuam conteúdo.

## Requirements *(mandatory)*

### Functional Requirements

- **MAIL-FR-001**: envio exclusivamente no servidor, com transporte confirmado no pedido atual, configuração privada e inicialização sob demanda.
- **MAIL-FR-002**: conexão cifrada obrigatória e certificados válidos nas duas modalidades autorizadas.
- **MAIL-FR-003**: intenção durável e transacional, claim atômico, lease, posse, recuperação, tentativas limitadas e estados terminais. Autorizar SMTP por UPDATE condicional fresco que devolve `fencedAt`, lease e validade efetiva. Após await/renderização, descontar todo tempo monotônico da janela do banco e combinar o mínimo com UTC local; recusar leaseBudget menor que 17 s, sem renovação. Separar `expiresAt` absoluto efetivo de `deadlineAt = agora + min(15 s, leaseBudget − 2 s, proofBudget)`. Não manter transação/lock durante SMTP nem inserir await entre a checagem final e o início do transporte.
- **MAIL-FR-004**: mensagens versionadas de verificação e recuperação em português, HTML escapado e texto; validade fornecida pelo produtor e link de origem confiável.
- **MAIL-NFR-001**: métricas de idade, tentativas, sucesso, erro classificado e leases expirados sem destinatário/prova/resposta crua.
- **SEC-NFR-001**: primitiva compartilhada de limites duráveis; parâmetros são fornecidos pelo futuro produtor, sem ativar política de contas.
- **SEC-NFR-002**: entradas e respostas allowlisted, sem destinatários arbitrários no acionamento.
- **DATA-NFR-001**: timestamps UTC, tempo monotônico de consulta/retomada/renderização e testes com relógios/barreiras controláveis; timestamp anterior a um await não autoriza SMTP após atraso. Recomendar sincronização operacional dos relógios, sem depender de igualdade absoluta para calcular o orçamento pré-envio.
- **DATA-NFR-002**: idempotência inclui conflito para conteúdo divergente.
- **OPS-NFR-001**: limpeza limitada e repetível, rotação e recovery documentados.
- **COMPAT-001**: preservar signup ACTIVE, JWT, sessões, papéis, vínculos e contas legadas; nenhuma normalização em massa.

### Key Entities

- **Intenção de e-mail**: identificador opaco, chave idempotente opaca, conteúdo temporário protegido, tipo, validade, estado, tentativas e posse.
- **Desafio preparatório**: conta, finalidade, compromisso protegido da identidade/prova, validade e invalidação. Nenhum fluxo de geração/consumo é ativado.
- **Limite compartilhado**: compromisso opaco do sujeito, ação, janela e contador.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: todos os cenários de atomicidade, idempotência, concorrência, recusa de posse antiga/janela insuficiente e deadlines separados passam no ambiente isolado, incluindo recuperação normal e atualização condicional do resultado.
- **SC-002**: nenhuma informação sensível aparece nas saídas públicas ou registros capturados nos testes.
- **SC-003**: as suítes obrigatórias existentes preservam cadastro, login, logout, administração e vínculos.
- **SC-004**: smoke em caixa autorizada registra aceitação separadamente de recebimento observado; sem isso, aceite integral e commits permanecem bloqueados.

## Assumptions

- `DECISAO_CONFIRMADA`: autorização local e transporte provêm do pedido atual e DEC-001 do pacote. Restrição documental antiga não se aplica à rodada atual.
- `PENDENCIA_DE_DECISAO`: PD-CRI-001/002, normalização de identidade, parâmetros de desafios, remetente oficial, operador e agendamento; não bloqueiam testes independentes.
- A autorização atual para preparar configuração privada e usar uma caixa sintética no smoke não aprova remetente/domínio de produção nem resolve as políticas futuras de contas. Presença/formato da credencial não prova autenticação Gmail.
- Fora: endpoints/telas de verificação/reset, consumo de prova, revogação JWT, aviso de senha alterada, drafts, Cloudinary, IHFR, UX e deploy.
- `RECOMENDACAO`: detalhes técnicos locais reversíveis são documentados em research.md; não constituem decisões de produto/equipe.
