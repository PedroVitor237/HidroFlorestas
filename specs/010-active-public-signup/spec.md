# Feature Specification: Cadastro público ativo para testes com usuários

**Feature Branch**: `development` (branch solicitada para esta entrega)
**Created**: 2026-09-28
**Status**: Aprovada para implementação no recorte desta solicitação
**Input**: decisão da equipe no pedido anexado de 2026-09-28 sobre cadastro público `ACTIVE`.

## User Scenarios & Testing

### User Story 1 - Criar conta e entrar imediatamente (Priority: P1)

Como participante dos testes com usuários, quero criar uma conta e conseguir entrar com a mesma senha imediatamente para continuar o fluxo principal.

**Why this priority**: A espera por ativação manual interrompe a validação da jornada completa.

**Independent Test**: Cadastrar uma conta nova e autenticar a mesma identidade e senha, observando acesso elegível sem intervenção administrativa.

**Acceptance Scenarios**:

1. **Given** dados válidos de uma pessoa ainda não cadastrada, **When** ela conclui o cadastro público, **Then** a conta nasce `ACTIVE` e a resposta mantém somente os campos públicos da identidade.
2. **Given** uma conta recém-cadastrada, **When** a pessoa usa a mesma senha no login, **Then** autentica normalmente.
3. **Given** senha incorreta para essa conta, **When** tenta entrar, **Then** recebe `INVALID_CREDENTIALS` sem sessão.

### User Story 2 - Preservar estados de conta (Priority: P2)

Como administrador, quero que os estados de conta existentes continuem disponíveis para os fluxos administrativos e decisões futuras.

**Why this priority**: A regra temporária do cadastro público não deve modificar a política de login nem outros mecanismos de criação.

**Independent Test**: Verificar que contas `PENDING`, `INACTIVE` e `BLOCKED` não autenticam e que uma conta `ACTIVE` autentica com senha correta.

**Acceptance Scenarios**:

1. **Given** conta em `PENDING`, `INACTIVE` ou `BLOCKED`, **When** informa a senha correta, **Then** o login recusa todos os estados com a falha genérica vigente.
2. **Given** conta `ACTIVE`, **When** informa a senha correta, **Then** o login aceita a conta.

### Edge Cases

- Dados extras fornecidos ao cadastro público não podem escolher papel ou estado da conta.
- A senha persistida não pode ser texto puro.
- E-mail já existente ou falha de criação mantém resposta controlada, sem criar segunda conta.

## Requirements

### Functional Requirements

- **FR-001**: Durante a fase atual de validação com usuários, o cadastro público MUST criar explicitamente a conta como `ACTIVE`.
- **FR-002**: A conta recém-cadastrada MUST autenticar com a mesma senha, sem aprovação manual obrigatória.
- **FR-003**: A senha MUST continuar armazenada como hash.
- **FR-004**: O cadastro público MUST retornar somente os campos de identidade pública já usados pela autenticação; dados privados não devem aparecer no DTO.
- **FR-005**: O login MUST continuar permitindo somente `ACTIVE` e retornando `INVALID_CREDENTIALS` para senha incorreta e estados inelegíveis.
- **FR-006**: `PENDING`, `INACTIVE` e `BLOCKED` MUST continuar disponíveis no domínio e no fluxo administrativo.
- **FR-007**: A decisão MUST limitar-se ao cadastro público; outros mecanismos de criação não são obrigados a usar `ACTIVE`.

### Key Entities

- **Conta**: identidade, credencial, papel e estado; `ACTIVE` é elegível para login, os demais estados não.
- **Sessão**: acesso autenticado já existente, vinculado a uma conta elegível.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Em todos os cenários automatizados de cadastro público válido, a conta criada fica `ACTIVE` e autentica com a senha informada.
- **SC-002**: Em todos os cenários de estados inelegíveis e senha errada, nenhuma autenticação é concedida.
- **SC-003**: Em todas as respostas de cadastro inspecionadas, o DTO omite senha, hash, e-mail, estado e papel.

## Assumptions

- O fluxo público atual em `/register` e `/api/auth/sign-up` permanece a entrada de cadastro.
- A política de senha, recuperação, convite, verificação e moderação não é alterada nesta entrega.
- O default persistente do modelo permanece `PENDING`; a decisão é específica ao cadastro público.
- A origem normativa é a decisão explícita da equipe neste pedido; `CF-PRD-FR-001` e `CF-UC-001` permanecem referências Code-First em revisão.
