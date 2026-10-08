# Feature Specification: Verificação e recuperação de contas

**Feature Branch**: `feat/account-verification-recovery`
**Created**: 2026-10-04
**Status**: políticas confirmadas; implementação em andamento
**Input**: execução integral do documento `execucao-02-contas-e-homologacao-sol-ultra.md`, sobre a fundação `80ff1cfbe7799fccdde5be923530e3a6edf62010`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cadastrar, verificar e retomar (Priority: P1)

Um participante cadastra uma conta, recebe código de seis dígitos, confirma o endereço e acessa as capacidades do seu papel. Pode sair, recarregar e retomar com sua senha, sem recriar a conta.

**Why this priority**: completa o cadastro com comprovação do endereço, preservando o estado administrativo `ACTIVE` determinado por TD-017.
**Independent Test**: conta sintética recebe mensagem pelo worker com transporte sintético de teste, confirma o código e faz login; antes disso todos os caminhos privados recusam acesso. SMTP real e recebimento humano são evidências de homologação separadas.
**Acceptance Scenarios**:

1. **Given** cadastro válido, **When** a criação confirma, **Then** conta, desafio e intenção de envio existem atomicamente, o código não retorna publicamente e somente verificação e logout são autorizados.
2. **Given** conta pendente, **When** sai ou a sessão expira, **Then** login legítimo retoma verificação; informar somente o endereço não permite assumir a conta.
3. **Given** código substituído ou vencido, **When** tenta confirmar, **Then** falha recuperável não verifica; reenvio respeita os limites do servidor.
4. **Given** falha do provedor após criação, **When** a fila é recuperada ou há reenvio permitido, **Then** permanece uma única conta com credenciais e perfil originais.
5. **Given** duas confirmações concorrentes, **When** disputam a mesma prova, **Then** uma única transição verifica o endereço; prova consumida não emite novas sessões.

### User Story 2 - Recuperar senha em outro dispositivo (Priority: P1)

O participante solicita recuperação, recebe link, abre sem sessão prévia, define e confirma senha e entra novamente. Senha e sessões anteriores ficam inválidas.

**Why this priority**: garante recuperação mesmo quando perdeu senha antes de verificar, sem ciclo impossível entre login e verificação.
**Independent Test**: sessão em contexto A e recuperação em B; link é entregue pelo transporte, reset revoga A e exige novo login em B.
**Acceptance Scenarios**:

1. **Given** endereço existente, inexistente ou inelegível, **When** solicita reset, **Then** resposta neutra tem o mesmo status, corpo e headers, sem afirmar existência.
2. **Given** link vigente, **When** apenas abre, **Then** nenhuma prova é consumida; confirmação explícita valida ambas as senhas.
3. **Given** confirmação válida, **When** confirma, **Then** senha, consumo, revogação e aviso de alteração confirmam juntos; reset não muda verificação, estado, papel ou vínculos.
4. **Given** reset concorrente ou resposta perdida, **When** repete, **Then** não regrava senha nem incrementa novamente; login com a nova senha permanece possível.

### User Story 3 - Alterar senha autenticado e preservar legado (Priority: P2)

O participante autenticado altera senha com a senha atual. Administradores e contas existentes conservam a autoridade e o tratamento de coorte aprovado.

**Why this priority**: impede brechas entre troca autenticada, recuperação e compatibilidade de sessões.
**Independent Test**: troca exige senha atual, revoga sessões anteriores e envia aviso sem segredo; coortes sintéticas demonstram política legada sem importar contas reais.
**Acceptance Scenarios**:

1. **Given** sessão normal e senha atual incorreta, **When** altera senha, **Then** nada muda; com senha correta, nova senha revoga todas as sessões e exige login.
2. **Given** conta `PENDING`, `INACTIVE` ou `BLOCKED`, **When** há prova de verificação ou reset, **Then** não recebe sessão normal nem reativação.
3. **Given** sessão antiga sem versão, **When** a conta não pertence à coorte permitida ou a credencial já mudou, **Then** a sessão falha.

### User Story 4 - Usar homologação operacional (Priority: P1)

Um testador autorizado usa URL HTTPS estável e sua caixa de e-mail, sem CLI, banco ou intervenção manual para despacho.

**Why this priority**: Gate B é requisito da missão e distinto do aceite técnico local.
**Independent Test**: duas jornadas reais e duas invocações automáticas do worker no deployment autorizado, com atraso e recuperação de backlog medidos.
**Acceptance Scenarios**:

1. **Given** homologação isolada autorizada, **When** cadastra e recupera, **Then** recebe mensagens automaticamente e conclui ambas as jornadas em navegador.
2. **Given** interrupção controlada do acionamento em mensagens sintéticas, **When** reinicia, **Then** o backlog é recuperado sem depender do computador do desenvolvedor.

### Edge Cases

- Zeros iniciais, Unicode/bytes em senha, espaços preservados sem trim; senha composta somente por whitespace é recusada como credencial vazia, assim como no login existente. E-mail com pontos e aliases preservados.
- Duplicidade por canonicalização e colisão de legado: falhar seguro, sem unir contas ou alterar ownership.
- Contagem de código errado confirma mesmo quando a resposta é erro; expiração é reavaliada depois de hashing e locks.
- Corridas login/reset, reset/reset e confirmar/reenviar têm revisão consistente; sessão restrita antiga nunca vira normal automaticamente.
- GET/HEAD/scanners não consomem reset; fragmento é removido antes de terceiros, sem armazenamento persistente de prova.
- Aviso de senha alterada não se vincula ao desafio consumido nem oferece reversão inexistente.
- Rollback de aplicação após ativação não pode restaurar bypass de verificação/revogação.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001 / EMAIL-FR-001–002**: cadastro público cria `ACTIVE`, papel padrão e nenhuma associação inventada; entrada fechada, senha validada, código textual aleatório de seis dígitos vinculado à conta/endereço/finalidade/desafio; provas não aparecem em DTO ou registro público.
- **FR-002 / EMAIL-FR-003–005**: confirmar consome somente desafio vigente e grava verificação atomicamente; reenvio invalida anteriores, cancela mensagens anteriores e aplica limites duráveis; não modifica status/papel/vínculos.
- **FR-003 / EMAIL-FR-006**: sessão restrita permite somente estado, confirmação, reenvio e sair; login legítimo retoma; emissão de sessão normal requer estado elegível e verificação ou coorte explícita aprovada.
- **FR-004 / RESET-FR-001–002**: solicitação neutra, limites compartilhados e link de alta entropia; repetição legítima é idempotente; conta `ACTIVE` não verificada deve ter recuperação segura sem ser marcada verificada.
- **FR-005 / RESET-FR-003–005**: confirmação valida senha/repetição, consome uma vez, grava senha protegida, revoga sessões e cria aviso na mesma operação; abrir link não muda estado; exige novo login.
- **FR-006**: centralizar política de novas senhas para cadastro/troca/reset/criação interna sem aplicar novo mínimo aos logins legados; rejeitar excesso em bytes sem truncar/trim/normalização.
- **FR-007**: nova sessão identifica finalidade, versão e emissor/audiência; todos os guards comparam estado/versão atuais; compatibilidade sem versão é limitada à coorte aprovada e versão zero.
- **FR-008 / DATA-NFR-002**: criação/reenvio/solicitação têm idempotência durável protegida; mesma chave com conteúdo divergente não sobrescreve; cadastro repetido não troca perfil/senha nem concede sessão por endereço.
- **FR-009 / SEC-NFR-001–002**: limites por conta/endereço e ingresso confiável, mais defesa global de 100 operações/hora compartilhada entre workflows; cobrança do orçamento de abuso persiste fora da transação de identidade, inclusive quando domínio falha. Não confiar em header arbitrário de cliente para ingresso; CSRF, cookies, redirects e caches seguros.
- **FR-010 / MAIL-FR-003–004**: reutilizar fundação durável existente e R1; adicionar aviso de alteração versionado, cifrado e sem prova, com retry/TTL apropriados.
- **FR-011 / UX-NFR-001**: telas em português com teclado, foco, labels, colagem, mensagens recuperáveis, estado ocupado, gerenciadores de senha, mobile e `aria-live`; mensagem enfileirada não equivale a entregue.
- **FR-012 / OPS-NFR-001**: homologação e bancos separados dos juniors/produção; URL HTTPS, envio automático hospedado, allowlist controlada e operação documentada; somente Gate B autoriza conclusão integral.
- **FR-013**: testes unitários, contrato, PostgreSQL real/constraints/concorrência, bootstrap/upgrade, UI desktop/mobile/HTTPS, regressão R1 e revisão de privacidade devem passar no candidato antes de commits (Gate A).

### Key Entities

- **Conta**: endereço factual e identidade canônica, senha protegida, versão de credencial, verificação independente de administração e coorte explícita.
- **Desafio**: conta, finalidade, compromisso protegido, chave versionada, validade, tentativas, consumo e invalidação.
- **Operação idempotente**: chave opaca e compromisso protegido da entrada, escopo/ator, resultado e retenção; nenhuma senha em claro.
- **Mensagem**: intenção cifrada de verificação, reset ou aviso, processada pela fundação existente.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: todos os cenários obrigatórios de propriedade, atomicidade, concorrência e revogação passam; zero transições de papel/status/vínculos causadas por verificar/reset.
- **SC-002**: zero provas/segredos/endereço completo em respostas públicas indevidas, logs e evidências compartilhadas.
- **SC-003**: cadastro/verificação e recuperação completos em desktop/mobile sem intervenção operacional, após autorização da homologação.
- **SC-004**: duas ou mais execuções automáticas distintas comprovam envio; meta proposta até 60 s de acionamento e 120 s de aceitação controlada, sujeita ao destino aprovado e sem SLA de inbox.

## Assumptions

- `DECISAO_CONFIRMADA`: missão/branch/Gates A e B pelo pedido atual; TD-017 preserva `ACTIVE`; transporte e código de seis dígitos pelo pacote e fundação.
- `DECISAO_CONFIRMADA`: usuário aprovou em 2026-10-04 o [checkpoint consolidado](remote-checkpoint.md), respondendo “Aprovo as políticas e os destinos propostos”: 15 min/5 tentativas/60 s/5 emissões por hora; sessão restrita 30 min; reset 32 bytes/30 min/3 pedidos por hora para `ACTIVE` mesmo não verificada, sem verificar automaticamente; normalização conservadora; novas senhas com mínimo de 15 caracteres Unicode e máximo de 72 bytes UTF-8, sem trim/normalização e bcrypt custo 10; coorte existente explicitamente legada, compatibilidade de token sem versão somente nela e versão zero. Não autoriza alteração do ambiente original ou contas reais fora do destino isolado.
- Rastreabilidade: CRI-T007–T010, reconciliação T001/T003, CF-PRD-FR-001/002, CF-UC-001/002 e contratos de IMP-001/009/010.
- Operação concreta em [quickstart.md](quickstart.md), [handoff.md](handoff.md), [runbook](../../docs/operations/account-homologation-runbook.md) e [.env.accounts.example](../../.env.accounts.example). Migrations012 e013 são aditivas; os resultados finais pertencem à [evidência do candidato](implementation-evidence.md).
- Fora: drafts, Cloudinary, IHFR, redesenho, login social, MFA, novo provedor, produção e branch dos juniors. `docs/raw/**` e documentação histórica da Fase 1 são preservados.
