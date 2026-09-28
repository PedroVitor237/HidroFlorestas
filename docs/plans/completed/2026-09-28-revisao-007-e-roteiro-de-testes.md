# Plano concluído — revisão da 007 e roteiro de testes de uso

- **ID/estado:** `PLAN-2026-09-28-007-UX`, `CONCLUIDO` quanto à revisão documental; merge `AGUARDANDO_REVISAO`.
- **Objetivo:** avaliar os seis commits posteriores a `9b2c989`, atualizar casos de uso/histórias Code-First segundo a interface atual e oferecer roteiro para o professor Fábio, outros participantes e devs.
- **Escopo:** `docs/validation/007-ihfr-evolution/`, `docs/code-first-prd/specifications/`, `docs/code-first-prd/testing/`, índice Code-First e este plano. Fora de escopo: implementação, ciência definitiva, banco, alteração de dependências, merge e deploy.
- **Baseline:** `007-ihfr-evolution@94053dfee912ef9aa4c2444e3d10bea4eb2cbea1`; `development` estava 80 commits atrás e nenhum à frente no comparativo. Esta execução usou leitura GitHub do repositório; não havia checkout local do projeto no workspace. Assim, nenhum estado local de terceiros foi alterado.
- **Fontes:** `AGENTS.md`, `PLANS.md`, `PROJECT_CONTEXT.md`, política Code-First, specs IMP-001 a IMP-009, código atual de páginas/componentes/serviços e relatórios de validação de 27/09. Código evidencia implementação; o relatório anterior fornece execução identificada, sem transferência automática de autoridade científica ou de ambiente.

## Etapas e resultado

1. `CONCLUIDO`: comparar os seis commits, distinguir três técnicos e três documentais, conferir caminho de fast-forward e status remoto. O status Vercel do HEAD observado foi `failure: Deployment was blocked`; causa não disponível no GitHub.
2. `CONCLUIDO`: mapear `CF-UC-001..015` e histórias das nove specs aos fluxos presentes; preservar caso de ingresso como indisponível, mapa como áreas-ponto e IHFR como experimental. Adicionar `CF-UC-016..018` para membros, laboratório e administração global, e histórias locais `CF-US-*` com rastreabilidade.
3. `CONCLUIDO`: escrever roteiro humano com cenário principal, condições de conta/papel, resultados esperados, feedback e limite entre teste de uso e ciência.
4. `CONCLUIDO` após revisão: conferir links, escopo, IDs, ausência de credenciais/URLs de banco e coerência com specs e estado de merge. Nenhum teste de execução foi reivindicado para esta rodada documental.

## Pendências e critério de encerramento

- O detalhe do deployment Vercel e a política de gate remoto precisam ser examinados antes de um merge. Se for limite de conta/política da hospedagem, registrar a dispensa ou correção operacional; se indicar erro do runtime, corrigir e repetir o gate afetado.
- O vínculo independente endpoint E2E → `branch_id` permanece externo se a equipe o exige como controle de ambiente. O endpoint histórico de outro validador não recebeu ação nesta revisão.
- Ciência, calibração e campo permanecem futuros para o contrato experimental; não são apresentados como gate automático desta entrega técnica por orientação atual do responsável.
- Arquivos em `docs/code-first-prd/` seguem analíticos `EM_REVISAO`; decisões e requisitos candidatos não receberam aprovação normativa por esta atualização.
