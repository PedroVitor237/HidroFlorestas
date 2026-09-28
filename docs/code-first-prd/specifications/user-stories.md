# Histórias de usuário Code-First — jornadas atuais

- **Revisão:** 2026-09-28, código `007-ihfr-evolution@94053dfee912ef9aa4c2444e3d10bea4eb2cbea1`.
- **Natureza:** índice descritivo em revisão, sem aprovação normativa. As histórias abaixo sintetizam as histórias das specs IMP-001 a IMP-009, preservando suas condições e indicando o comportamento disponível. Não substituem os cenários de aceite detalhados das specs.
- **Rastreabilidade:** [casos de uso](use-cases.md), [requisitos candidatos](requirements.md) e [roteiro humano](../testing/roteiro-de-testes-de-uso.md). Os IDs `CF-US-*` são referências locais novas; os IDs `CF-UC-*` existentes permanecem estáveis.

## Acesso e laboratório

| História e origem | Desejo da pessoa | Evidência observável e caso |
|---|---|---|
| `CF-US-001` Cadastro — código `/register` | Como visitante, quero informar meus dados de cadastro para obter uma conta. | A resposta do cadastro é controlada; a possibilidade de login depende do estado da conta. `CF-UC-001`. |
| `CF-US-002` Login — IMP-001 US1 | Como pessoa com conta `ACTIVE`, quero entrar com minhas credenciais para acessar meu espaço. | Login válido abre `/workspace` ou área administrativa autorizada; inválido não cria sessão. `CF-UC-002`. |
| `CF-US-003` Sessão — IMP-001 US2/US3 | Como pessoa autenticada, quero continuar após reload e sair com segurança. | A rota protegida é restaurada com sessão válida; após logout, o conteúdo requer nova autenticação. `CF-UC-003`. |
| `CF-US-004` Criação — IMP-002 US1 | Como participante elegível, quero criar um laboratório com nome próprio para iniciar meu trabalho. | Laboratório e vínculo `OWNER` aparecem juntos; acima de cinco vínculos, a criação é recusada. `CF-UC-004`. |
| `CF-US-005` Reencontro — IMP-002 US2/US3 | Como participante, quero encontrar meus laboratórios depois de recarregar e escolher um deles. | Workspace lista somente vínculos acessíveis; “ACESSAR LABORATÓRIO” abre contexto explícito com identidade visível. `CF-UC-006`. |
| `CF-US-006` Ingresso — candidato do PRD | Como participante, quero pedir acesso a um laboratório existente para colaborar. | `INDISPONIVEL`: interface anuncia etapa futura; não há aceite de ingresso a testar agora. `CF-UC-005`. |
| `CF-US-007` Papéis — IMP-003 US1 | Como `OWNER`, quero gerir papéis contextuais para controlar ações no meu laboratório. | Área de membros distingue `OWNER`/`ADMIN`/`MEMBER`; proprietário único é mantido. `CF-UC-016`. |
| `CF-US-008` Contexto — IMP-003 US2 | Como membro vinculado a mais de um laboratório, quero escolher o contexto sem misturar dados. | Navegação mantém `laboratoryId`, inclusive no reload, e não revela registros de outro laboratório. `CF-UC-006`. |

## Área, coleta e dados

| História e origem | Desejo da pessoa | Evidência observável e caso |
|---|---|---|
| `CF-US-009` Ponto — IMP-003 US3 | Como `OWNER`/`ADMIN`, quero informar nome e ponto de uma área para cadastrar o local monitorado. | Mapa ou coordenadas definem um ponto confirmado; a área aparece no laboratório correto. `CF-UC-007`. |
| `CF-US-010` Consulta — IMP-003 US4 | Como membro, quero localizar uma área e ver seus dados para conferir o registro. | Lista/detalhe mostram nome, ponto e contexto; área de outro laboratório permanece inacessível. `CF-UC-008`. |
| `CF-US-011` Início — IMP-004 US1 | Como membro autorizado, quero iniciar a coleta a partir da área correta para conservar sua origem. | Formulário identifica laboratório e área; vínculo territorial resulta da área, sem coordenada própria da coleta. `CF-UC-009/010`. |
| `CF-US-012` Ocorrência — IMP-004 US2 | Como participante de campo, quero informar data, hora e fuso da ocorrência para evitar ambiguidade temporal. | Ausência, futuro ou formato inválido são sinalizados sem registrar coleta errada. `CF-UC-009`. |
| `CF-US-013` Confirmação — IMP-004 US3/US4 | Como participante, quero revisar, confirmar e reabrir a coleta para conferir o que salvei. | Uma coleta confirmada persiste, pode ser reaberta e exibe área de origem e instante de confirmação. `CF-UC-009/010`. |
| `CF-US-014` Medição — IMP-005 US1 | Como membro autorizado, quero informar água, solo, vegetação e terreno para registrar observações da coleta. | Revisão precede confirmação; o conjunto `ihfr-measurement-v1` é associado à coleta e permanece imutável. `CF-UC-011`. |
| `CF-US-015` Leitura ambiental — IMP-005 US2 | Como membro, quero reabrir a medição para ver valores, unidades e sua origem. | Reload conserva o conjunto, inclusive zero, falso e ausência como estados distintos. `CF-UC-011`. |

## Diagnóstico, acompanhamento e administração

| História e origem | Desejo da pessoa | Evidência observável e caso |
|---|---|---|
| `CF-US-016` Cálculo — IMP-006 US2 | Como `OWNER`/`ADMIN`, quero verificar a elegibilidade e gerar IHFR experimental rastreável. | Uso da terra, proveniência e observação são informados; dados suficientes produzem um único `CURRENT` com resultado e versões; insuficiência não inventa score. `CF-UC-012`. |
| `CF-US-017` Consulta — IMP-006 US1 | Como membro, quero consultar o resultado e sua origem sem confundi-lo com conclusão científica definitiva. | Reabertura apresenta score, classe, qualidade, componentes, proveniência e qualificadores experimentais; REPLACE/REVOKE atualizam vigência. `CF-UC-013`. |
| `CF-US-018` Resumo — IMP-007 US1/US3 | Como membro, quero ver os totais reais e distinguir carregamento, vazio e falha. | Dashboard reflete áreas/coletas confirmadas e atualização posterior, sem cards de mock. `CF-UC-014`. |
| `CF-US-019` Histórico e acesso — IMP-007 US2/US4 | Como membro, quero reencontrar registros do laboratório sem expor outro contexto. | Item de área/coleta abre origem correta; laboratório inativo conserva leitura autorizada. `CF-UC-014`. |
| `CF-US-020` Mapa — IMP-008 US1/US2 | Como membro, quero ver áreas-ponto e suas coletas para navegar pelos registros territoriais. | Marcador e lista textual correspondem; número de coletas confirmadas e links refletem a área. `CF-UC-015`. |
| `CF-US-021` Mapa acessível — IMP-008 US3/US4 | Como pessoa em tela pequena ou com teclado, quero usar lista e destinos mesmo com falha de tiles. | Estados de leitura são distinguíveis; lista textual e foco oferecem caminho equivalente. `CF-UC-015`. |
| `CF-US-022` Administração — IMP-009 US1–US4 | Como `ADMIN` global, quero consultar contas, mudar estado/papel de outra pessoa e ver auditoria. | Acesso restrito, justificativa, controle de versão e proteção do último administrador ativo. `CF-UC-018`; teste isolado. |
| `CF-US-023` Ciclo do laboratório — IMP-002 emenda de configurações | Como responsável, quero desativar ou excluir meu laboratório com confirmação explícita. | Inatividade preserva leitura; exclusão com áreas é impedida. `CF-UC-017`; fora do roteiro comum. |

## Estado e limites para validação

As histórias `CF-US-002`, `004`, `005`, `009` a `017` foram cobertas em percursos integrados relatados da branch 007, respeitando o HEAD e o destino identificados no [relatório](../../validation/007-ihfr-evolution/2026-09-27-execucao-codex-ultra.md). As demais têm código e testes versionados e exigem observação própria quando forem usadas como critério de aceite por pessoas. `CF-US-006` permanece indisponível. Papel contextual não se confunde com papel global; estado de conta e de laboratório influem na permissão de escrita. A revisão documental não executou estas histórias novamente.

`CF-US-016/017`: o cálculo, as classes e os pesos refletem somente `CONTRATO_EXPERIMENTAL`; `VALIDACAO_CIENTIFICA_PENDENTE`, `SUJEITO_A_RECALIBRACAO`, `NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO`. O teste de uso mede clareza, rastreabilidade e funcionamento técnico. Parecer científico e campo serão conduzidos posteriormente por especialistas, sem constituir bloqueio automático da entrega experimental conforme orientação atual do responsável.
