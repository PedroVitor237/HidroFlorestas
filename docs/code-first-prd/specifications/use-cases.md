# Casos de uso Code-First — estado observável da plataforma

- **Revisão:** 2026-09-28, `007-ihfr-evolution@94053dfee912ef9aa4c2444e3d10bea4eb2cbea1`.
- **Natureza:** documentação analítica em revisão; descreve jornadas implementadas e separa possibilidades ainda não disponíveis. Não concede aprovação normativa aos requisitos candidatos nem valida o IHFR cientificamente.
- **Fontes:** rotas/componentes/serviços versionados; specs das IMP-001 a IMP-009; [relatório técnico da 007](../../validation/007-ihfr-evolution/2026-09-27-execucao-codex-ultra.md). O relatório atesta seu próprio HEAD, destino e gates; esta revisão documental conferiu o código publicado, sem repetir testes em navegador ou banco.
- **Vínculos:** [histórias de usuário](user-stories.md), [requisitos candidatos](requirements.md), [fluxos](product-flows.md) e [roteiro para participantes](../testing/roteiro-de-testes-de-uso.md). Os identificadores `CF-UC-001` a `CF-UC-015` foram preservados; três casos adicionais descrevem capacidades incorporadas posteriormente.

## Atores e condições comuns

**Pessoa visitante:** acessa cadastro/login, mas não recursos privados. **Pessoa com conta `ACTIVE`:** inicia sessão e vê laboratórios aos quais está vinculada. **`OWNER`, `ADMIN`, `MEMBER` do laboratório:** são papéis contextuais; leitura por membro vinculado, alterações conforme cada operação e estado `ACTIVE` do laboratório. **`ADMIN` global:** pode administrar usuários no fluxo próprio; o papel contextual de laboratório não confere administração global.

O contexto de laboratório é escolhido explicitamente em `/workspace` e codificado na navegação `/dashboard/laboratories/{laboratoryId}`. Laboratório inativo pode permitir consulta em modo somente leitura conforme a spec da operação. Recursos inexistentes ou de outro laboratório não devem ser expostos. A criação de laboratórios tem limite de cinco vínculos por conta; teste com conta 5/5 exige outra conta de teste autorizada com capacidade. A entrada em laboratório existente continua indisponível pela interface.

**Legenda de evidência:** `IMPLEMENTADO_COM_EVIDENCIA_RUNTIME` indica cenário exercitado nos relatórios de validação identificados; `IMPLEMENTADO_CODIGO_TESTES` indica rota e testes versionados, sem nova execução individual nesta revisão; `INDISPONIVEL` indica ausência de jornada utilizável. Esses estados não qualificam decisão de produto ou implantação.

## Jornada principal

| ID e nome | Ator, início e resultado esperado | Estado e referência |
|---|---|---|
| `CF-UC-001` Criar conta | Visitante usa `/register` e informa nome, sobrenome, e-mail e senha. Durante os testes atuais com usuários, o cadastro público cria conta `ACTIVE` e permite login imediato sem aprovação manual; uma política futura de ativação exige nova decisão. | `IMPLEMENTADO_CODIGO_TESTES`; `TD-017`, `specs/010-active-public-signup/spec.md`, `src/app/register/page.tsx`. |
| `CF-UC-002` Autenticar-se | Conta `ACTIVE` usa `/login`; credenciais válidas abrem sessão e levam ao workspace (ou à área administrativa para `ADMIN` global). Credenciais incorretas não liberam páginas privadas. | `IMPLEMENTADO_COM_EVIDENCIA_RUNTIME`; IMP-001, `CF-PRD-FR-001`. |
| `CF-UC-003` Restaurar/encerrar sessão | Recarregar rota privada conserva acesso válido; logout encerra a sessão e o retorno a rota protegida requer nova autenticação. | `IMPLEMENTADO_CODIGO_TESTES`; IMP-001, `CF-PRD-FR-002`. |
| `CF-UC-004` Criar laboratório | Em `/workspace`, conta elegível fornece nome e cria laboratório com vínculo inicial `OWNER`; a listagem passa a mostrá-lo. Em 5/5, a criação fica indisponível. | `IMPLEMENTADO_COM_EVIDENCIA_RUNTIME`; IMP-002/003, `CF-PRD-FR-003`. |
| `CF-UC-005` Ingressar em laboratório | Solicitar participação em laboratório alheio. A tela anuncia etapa futura; não há fluxo de ingresso de usuário final para testar como sucesso. | `INDISPONIVEL`; `src/components/workspace/laboratory-workspace.tsx`. |
| `CF-UC-006` Selecionar laboratório | No workspace, escolher “ACESSAR LABORATÓRIO”; abrir a landing contextual, conferir nome e usar navegação interna. O contexto permanece na URL após reload; seleção global implícita não é presumida. | `IMPLEMENTADO_COM_EVIDENCIA_RUNTIME`; IMP-003/007, `CF-PRD-FR-004`. |
| `CF-UC-007` Cadastrar área-ponto | `OWNER`/`ADMIN` no laboratório ativo escolhe um ponto pelo mapa, coordenadas ou localização do dispositivo, revisa e confirma; área e autoria ficam no laboratório. Não há cadastro de polígono. | `IMPLEMENTADO_COM_EVIDENCIA_RUNTIME`; IMP-003, `CF-PRD-FR-005/013`. |
| `CF-UC-008` Consultar área | Membro vinculado localiza área na lista e abre detalhe com dados e ponto correspondente; outro laboratório não pode ser consultado por troca de URL. | `IMPLEMENTADO_COM_EVIDENCIA_RUNTIME`; IMP-003, `CF-PRD-FR-005/011`. |
| `CF-UC-009` Registrar coleta | De uma área acessível, membro autorizado informa data/hora de ocorrência com fuso explícito, revisa e confirma; o detalhe recupera área e momento de confirmação. | `IMPLEMENTADO_COM_EVIDENCIA_RUNTIME`; IMP-004, `CF-PRD-FR-006`. |
| `CF-UC-010` Relacionar coleta à área | Ao confirmar a coleta, o vínculo ao ponto da área é preservado para lista, detalhe e mapa; a coleta não recebe coordenada própria inferida. | `IMPLEMENTADO_CODIGO_TESTES`; IMP-004/008, `CF-PRD-FR-014`. |
| `CF-UC-011` Registrar/consultar dados ambientais | Na coleta confirmada, preencher água, solo, vegetação e terreno conforme `ihfr-measurement-v1`, revisar e confirmar um conjunto imutável; recarregar e consultar valores, unidades e origem. | `IMPLEMENTADO_COM_EVIDENCIA_RUNTIME`; IMP-005, `CF-PRD-FR-007`. |
| `CF-UC-012` Gerar e gerir IHFR experimental | `OWNER`/`ADMIN` informa uso da terra, origem e data da observação; verifica elegibilidade, confirma CREATE. Conforme os controles disponíveis, pode REPLACE com nova entrada e REVOKE com justificativa. Insuficiência não deve inventar diagnóstico. | `IMPLEMENTADO_COM_EVIDENCIA_RUNTIME`; IMP-006, `CF-PRD-FR-008`. |
| `CF-UC-013` Consultar IHFR experimental | Membro vinculado reabre a coleta e consulta o diagnóstico vigente, score, classe, qualidade, componentes, proveniência, versões e condição experimental. Após revogação, não há CURRENT; histórico técnico permanece rastreável. | `IMPLEMENTADO_COM_EVIDENCIA_RUNTIME`; IMP-006, `CF-PRD-FR-009`. |
| `CF-UC-014` Acompanhar resumo e histórico | No dashboard contextual, consultar totais reais de áreas e coletas confirmadas, abrir item de histórico, retornar ao registro e observar atualização após novas confirmações. | `IMPLEMENTADO_CODIGO_TESTES`; IMP-007, `CF-PRD-FR-010`. |
| `CF-UC-015` Visualizar território | Em “Mapa” do laboratório, comparar pontos de áreas e lista textual; selecionar área, ver quantidade de coletas confirmadas e abrir seus detalhes. O mapa não representa polígono, localização própria da coleta ou camada IHFR/gráficos. | `IMPLEMENTADO_CODIGO_TESTES`; IMP-008, `CF-PRD-FR-015` no recorte mínimo. |

## Casos incorporados após o catálogo inicial

| ID e nome | Ator, início e resultado esperado | Estado e referência |
|---|---|---|
| `CF-UC-016` Administrar vínculo contextual | `OWNER` do laboratório consulta membros, promove/rebaixa papéis permitidos e mantém um único proprietário; `MEMBER` não recebe controles administrativos. Não equivale a `ADMIN` global. | `IMPLEMENTADO_CODIGO_TESTES`; IMP-003, `src/app/(private)/dashboard/laboratories/[laboratoryId]/members/page.tsx`. |
| `CF-UC-017` Desativar ou excluir laboratório | Pessoa autorizada acessa configurações no workspace e confirma pelo nome. Desativação preserva leitura; exclusão é bloqueada quando há áreas vinculadas. **Fora do teste exploratório padrão**, pois altera recursos compartilhados. | `IMPLEMENTADO_CODIGO_TESTES`; IMP-002, `src/components/workspace/laboratory-workspace.tsx`. |
| `CF-UC-018` Administrar contas globais | `ADMIN` global consulta contas, altera estado/papel de outra conta com justificativa e consulta auditoria; protege autoalteração, versão concorrente e último administrador ativo. **Fora do roteiro comum**; usar cenário isolado e permissão própria. | `IMPLEMENTADO_CODIGO_TESTES`; IMP-009, `src/app/(private)/admin/users/page.tsx`. |

## Encadeamento, exceções e limites

`CF-UC-002 → 004 → 006 → 007 → 009 → 011 → 012 → 013` forma o caminho de criação até IHFR; `008`, `010`, `014` e `015` permitem reencontrar e relacionar registros. Acesso negado, laboratório inativo, ausência de dados, falha de leitura e resposta desconhecida de uma operação exigem apresentação coerente e sem exposição cruzada. Um erro de conexão após confirmar uma operação não autoriza duplicá-la sem verificar o estado ou usar o mecanismo de recuperação da mesma operação.

`CF-PD-002/003/005/006/007` e questões abertas do PRD continuam registradas conforme suas fontes. O mapa mínimo atual exibe **áreas-ponto e coletas vinculadas**; gráficos, camadas IHFR e eventual polígono não foram promovidos a capacidade atual. O IHFR v0.1 permanece `CONTRATO_EXPERIMENTAL`, `VALIDACAO_CIENTIFICA_PENDENTE`, `SUJEITO_A_RECALIBRACAO`, `NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO`. A revisão científica e de campo ocorrerá depois do desenvolvimento técnico, por direção do responsável nesta conversa; isso não afirma aceitação científica presente.
