# Feature Specification: Usabilidade pré-Lovable

**Feature Branch**: `fix/usabilidade-pre-lovable`
**Created**: 2026-10-01
**Status**: Approved for implementation in this scope
**Input**: Pedido explícito do solicitante, anexo “Execute nesta ordem”, nesta conversa. `DECISAO_CONFIRMADA`: três melhorias antes do Lovable; geocodificação e rascunhos adiados; proposta externa preferencialmente em repositório separado. Não gerar prompt, merge ou deploy.

## User Scenarios & Testing

### User Story 1 - Sair da conta em qualquer contexto (Priority: P1)

A pessoa encontra Sair no workspace, no laboratório e na administração, no computador ou celular.
**Why this priority**: Permite encerrar a sessão antes de selecionar laboratório.
**Independent Test**: Acionar Sair por teclado; repetir com falha de rede e sucesso.
**Acceptance Scenarios**:
1. Dada sessão no workspace, quando aciona Sair, então a sessão é encerrada e aparece login.
2. Dada falha ao sair, então a interface informa o erro e oferece nova tentativa, sem declarar sucesso.
3. Dado laboratório ou administração, então há uma saída visível em cada largura de tela sem duplicação desnecessária.

### User Story 2 - Registrar o momento da coleta (Priority: P1)

A pessoa recebe sugestão da data/hora atual do dispositivo, pode editar e revisar o momento com fuso explícito.
**Why this priority**: Evita exigir escrita técnica e deslocar o instante observado.
**Independent Test**: Inicializar, editar, revisar, corrigir, enviar e consultar em UTC−03, UTC e UTC+05:45.
**Acceptance Scenarios**:
1. Dado formulário novo, então sugere agora uma única vez; interações/revisão/erro não substituem a edição.
2. Dado horário editado, quando confirma, então o transporte preserva o instante, segundos e offset revisado.
3. Dado dispositivo em outro fuso ou transição sazonal, então o fuso é visível, ajustável e horários inexistentes não são corrigidos silenciosamente.
4. Dado horário futuro, vazio ou inválido, então continua sujeito às validações vigentes.
5. Dada consulta posterior, então ocorrência é legível com o offset registrado, independente do fuso do dispositivo leitor.

### User Story 3 - Entender as opções de uso da terra (Priority: P2)

A pessoa vê em português as sete categorias do diagnóstico experimental e envia a categoria técnica correspondente.
**Why this priority**: Reduz dúvida de preenchimento sem alterar classificação científica.
**Independent Test**: Conferir os sete pares rótulo/valor e enviar Floresta, Pastagem e Sistema agroflorestal.
**Acceptance Scenarios**:
1. Dadas opções, então todas possuem rótulos portugueses e mantêm os mesmos valores técnicos.
2. Dada categoria indeterminada, então preserva ausência e política de insuficiência.
3. Dada ajuda, então pode ser lida por teclado/toque; não cria critérios ambientais sem fonte.

### Edge Cases

Falha de logout; nova renderização; erro/repetição de envio com a mesma chave; data futura; virada de dia; offset fracionário; mudança sazonal; hora inexistente ou repetida; consulta em outro fuso; categoria ausente; laboratório somente leitura.

## Requirements

### Functional Requirements

- **FR-001**: Oferecer Sair em contextos autenticados sem depender de acesso a laboratório, por teclado e celular.
- **FR-002**: Reutilizar encerramento de sessão, mensagens de falha e repetição existentes.
- **FR-003**: Inicializar data/hora atual somente no dispositivo e uma vez por tentativa; permitir edição e preservar valores.
- **FR-004**: Oferecer entrada amigável e fuso UTC visível/ajustável, preservando segundos e milissegundos existentes.
- **FR-005**: Converter para o contrato temporal existente sem anexar Z a horário local; revisão mostra ocorrência e offset.
- **FR-006**: Manter validação de calendário e futuro, confirmação imutável e repetição segura.
- **FR-007**: Exibir ocorrência legível em revisão e consulta, preservando offset registrado.
- **FR-008**: Traduzir sete rótulos conforme ADR-0001 §7, mantendo valores, pesos, scores e regras experimentais.
- **FR-009**: Ajuda explica somente predominância e distinção de solo exposto sustentadas no ADR; descrições ambientais por categoria permanecem pendentes.

### Key Entities

Sessão existente; tentativa volátil de coleta com instante e offset; coleta confirmada imutável; uso predominante do suplemento experimental. Nenhuma nova entidade persistida.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Sair acessível nos três contextos em desktop e 375px; sucesso e erro/retry exercitados.
- **SC-002**: Três fusos, incluindo offset fracionário, preservam o mesmo instante no ciclo de envio/consulta.
- **SC-003**: Edição e erro preservam horário e chave; zero correções silenciosas de calendário.
- **SC-004**: Sete de sete rótulos correspondem aos valores vigentes; teclado e toque acessam ajuda.

## Assumptions

`RECOMENDACAO` técnica: usar fuso do dispositivo para sugerir o offset da data escolhida e permitir override explícito; horário sazonal ambíguo exige revisão/offset explícito. Inicialização não ocorre no servidor. Ciência segue experimental, com VALIDACAO_CIENTIFICA_PENDENTE e recalibração. Banco/dependências e contratos científicos permanecem preservados.

## Authority and Traceability

Mandato corrente governa UX neste recorte. IMP-001 e `CF-UC-002` (logout); IMP-004 FR-015, `CF-PRD-FR-006`, `CF-UC-009`, `CF-PFLOW-005` (momento/revisão/consulta); IMP-006, `CF-PRD-FR-008`, `CF-UC-012`, ADR-0001 §7 e TD-016 (uso da terra). Code-First continua EM_REVISAO. Não promover regras científicas a validação definitiva.
