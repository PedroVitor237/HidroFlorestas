# Feature Specification: Exclusão da própria conta

**Feature Branch**: `feat/account-deletion`

**Created**: 2026-10-05

**Status**: Especificada; decisões materiais confirmadas

**Input**: User description: "Quero a implementacao de excluir conta".

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Excluir minha conta sem vínculos (Priority: P1)

O usuário autenticado acessa a exclusão, lê as consequências, confirma sua senha
atual e sua intenção e remove definitivamente a própria conta.

**Why this priority**: permitir encerrar a conta sem depender de um administrador.

**Independent Test**: conta sintética sem vínculos pode ser excluída; seus logins,
sessões e provas anteriores deixam de funcionar, inclusive em outra janela.

**Acceptance Scenarios**:

1. **Given** conta ativa sem vínculos, **When** senha atual e confirmação são
   fornecidas, **Then** a conta é removida e o usuário recebe confirmação clara.
2. **Given** senha incorreta, sessão vencida ou ausência de confirmação,
   **When** tenta excluir, **Then** nenhum dado da conta é removido.
3. **Given** conta com verificação pendente e sessão restrita válida,
   **When** confirma a exclusão com sua senha atual, **Then** consegue encerrar
   essa conta sem obter acesso às funcionalidades privadas.
4. **Given** exclusão concluída, **When** usa sessão antiga, código ou link
   anterior, **Then** esses acessos são recusados e não recriam a conta.

### User Story 2 - Compreender vínculos que impedem a exclusão (Priority: P1)

O usuário recebe uma explicação dos vínculos científicos ou administrativos
que precisam ser resolvidos antes da exclusão, preservando os registros.

**Why this priority**: evitar perda de dados científicos e de sua rastreabilidade.

**Independent Test**: cada categoria de vínculo relevante impede a operação
e aparece com descrição e contagem próprias, sem expor registros de terceiros.

**Acceptance Scenarios**:

1. **Given** laboratórios, participação, áreas, coletas ou registros científicos
   vinculados, **When** solicita excluir, **Then** a exclusão é bloqueada,
   os vínculos são explicados e todos os dados permanecem intactos.
2. **Given** histórico administrativo vinculado, **When** solicita excluir,
   **Then** o histórico não é apagado para contornar a restrição.
3. **Given** último administrador ativo, **When** solicita excluir,
   **Then** a operação é recusada até existir outro administrador ativo.
4. **Given** vínculo criado enquanto a exclusão é solicitada, **When** as
   operações concorrem, **Then** não há vínculo órfão nem remoção parcial.

### Edge Cases

- Duas solicitações concorrentes, ou repetição após falha de rede.
- Reset/troca de senha e exclusão concorrentes; sessão revogada durante confirmação.
- Dois administradores tentando remover/rebaixar contas simultaneamente.
- Mensagens de verificação/reset/avisos pendentes, em processamento ou antigos.
- Dependência nova não prevista pelo formulário: exclusão continua bloqueada.
- Senha de conta legada: confirmar a senha existente sem aplicar mínimo de senha nova.
- Falha transacional: conta, provas e mensagens permanecem consistentes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: somente o próprio titular autenticado pode excluir sua conta;
  o cliente não escolhe outro usuário ou papel para a operação.
- **FR-002**: exigir senha atual correta e confirmação explícita da intenção;
  abrir a página ou consultar o estado nunca exclui dados.
- **FR-003**: impedir a exclusão quando houver vínculos científicos ou
  administrativos, explicando as categorias e contagens que precisam ser resolvidas.
- **FR-004**: preservar o último administrador ativo e a consistência sob concorrência.
- **FR-005**: remover a conta e seus insumos de autenticação atomicamente, sem
  apagar dados científicos, históricos administrativos ou contas de terceiros.
- **FR-006**: sessões e provas anteriores não permitem acesso após a exclusão;
  remover o estado de autenticação do navegador que confirmou a operação.
- **FR-007**: impedir novos envios de mensagens pendentes pertencentes à conta
  excluída; preservar a limitação de que um transporte já autorizado/em andamento
  antes da exclusão pode terminar e não pode ser desfeito.
- **FR-008**: oferecer a opção também para verificação pendente, sem liberar
  acesso ao workspace para essa sessão restrita.
- **FR-009**: proteger confirmação contra requisições de outra origem,
  tentativas excessivas, campos inesperados e divulgação de credenciais.
- **FR-010**: funcionar por teclado e em tela móvel, com erros recuperáveis,
  confirmação de sucesso e alternativa clara para cancelar.
- **FR-011**: não oferecer exclusão administrativa, anonimização ou remoção
  em cascata de registros vinculados nesta feature.

### Key Entities

- **Conta**: identidade, credencial, papel, estado e versão de sessão do titular.
- **Vínculo impeditivo**: relação científica, de laboratório ou administrativa
  cuja integridade impede remover a conta.
- **Insumos de autenticação**: provas, pedidos e mensagens pertencentes à conta.

## Success Criteria *(mandatory)*

- **SC-001**: um titular sem vínculos conclui a exclusão usando somente a
  aplicação; nenhum login, sessão ou prova anterior resta utilizável.
- **SC-002**: todos os cenários de senha incorreta, falta de confirmação,
  outro titular e vínculo impeditivo preservam integralmente os dados.
- **SC-003**: concorrência não deixa conta parcialmente removida, vínculo órfão
  nem ambiente sem administrador ativo.
- **SC-004**: o usuário identifica cada categoria impeditiva e consegue cancelar
  o fluxo por teclado ou dispositivo móvel.

## Proveniência, pressupostos e limites

`DECISAO_CONFIRMADA`: nesta conversa em 2026-10-05, o usuário escolheu
"O próprio usuário, confirmando a senha atual" e
"Impedir a exclusão e explicar os vínculos que precisam ser resolvidos".
Exclusão administrativa está fora do escopo e não altera FR-022 da IMP-009.

`RECOMENDACAO` técnica adotada para realizar o pedido: confirmação explícita,
remoção física somente sem vínculos, invalidação de autenticação, limitação de
tentativas e proteção do último administrador ativo já existente no produto.
Reutilização posterior do endereço é novo cadastro, com nova identidade e
verificação; não restaura contas/provas anteriores.

Desenvolvimento em worktree próprio, base `40190f7` da Fase 2, sem alterar
a Fase 1, os ambientes dos juniors ou a homologação vigente durante implementação.
Validação automatizada de segurança, banco real e navegador é exigida por esta
spec devido ao caráter irreversível da operação. Não excluir contas reais dos
testadores para validar a implementação.
