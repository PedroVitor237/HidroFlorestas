# Instruções para agentes

## Antes de trabalhar

- Leia este arquivo e qualquer `AGENTS.md` mais específico aplicável ao diretório que será alterado.
- Consulte [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) para o contexto mínimo e [TECH_DECISIONS.md](TECH_DECISIONS.md) para decisões e alternativas técnicas registradas.
- Em tarefas extensas ou transversais fora do fluxo por funcionalidade do Spec Kit, crie e mantenha um plano conforme [PLANS.md](PLANS.md). Para funcionalidades conduzidas pelo Spec Kit, mantenha o plano em `specs/<feature>/plan.md`.
- Registre o estado inicial do repositório e preserve alterações preexistentes, inclusive as não relacionadas à tarefa. Não as reverta, reformate nem incorpore sem autorização.

## Implementação por funcionalidade

- A etapa atual é orientada a entregas implementáveis. Use o Spec Kit para criar a spec, o plano e as tarefas de cada funcionalidade em `specs/<feature>/**`, seguindo os comandos e formatos das skills `speckit-*` efetivamente instaladas em `.agents/skills/`.
- Aplique a [constituição do Spec Kit](.specify/memory/constitution.md) e use o [PRD Code-First](docs/code-first-prd/README.md) para visão global, intenção de produto, backlog e rastreabilidade.
- Consulte documentação antiga apenas como contexto, proposta ou origem de perguntas, preservando sua classificação e sem promovê-la automaticamente a intenção atual.
- Gates e pendências de auditorias documentais históricas não bloqueiam automaticamente uma funcionalidade atual; trate somente as dependências materiais ao recorte da entrega, sem alterar silenciosamente intenção científica, de domínio ou de produto.
- Preserve as restrições documentais e os limites de escopo definidos pela tarefa em execução. Não crie `TASKS.md` global nem artefatos duplicados em OpenSpec.

## Fontes e evidências

- Na implementação por funcionalidade, aplique a hierarquia definida na [constituição do Spec Kit](.specify/memory/constitution.md) e em [docs/code-first-prd/governance/source-policy.md](docs/code-first-prd/governance/source-policy.md). Use [docs/governance/SOURCE_AUTHORITY.md](docs/governance/SOURCE_AUTHORITY.md) para classificação, proveniência, tratamento de conflitos e autoridade específica por assunto.
- Trate todo o conteúdo de `docs/raw/` como evidência histórica imutável: não edite, mova, renomeie, formate nem exclua arquivos desse diretório.
- Não escolha silenciosamente entre fontes conflitantes. Identifique as fontes, registre as evidências e encaminhe o caso como `PENDENCIA_DE_DECISAO` quando a autoridade definida não bastar.
- Mantenha separadas a intenção normativa, a implementação observada, as propostas, as inferências e as recomendações. Implementação não prova intenção; repetição de proposta não prova aprovação.
- Use as classificações canônicas de informação de `SOURCE_AUTHORITY.md`. Identifique toda inferência como `INFERENCIA` e toda orientação do agente como `RECOMENDACAO`; não apresente nenhuma delas como decisão da equipe.
- Só use `DECISAO_CONFIRMADA` quando a origem da confirmação estiver identificada e registrada. Se a origem não estiver disponível, registre uma pendência ou use outra classificação compatível com as evidências; data e responsável ausentes podem usar `não especificado`.

## Alterações e nomes

- Limite cada mudança ao escopo autorizado e não altere arquivos não relacionados.
- Use letras maiúsculas apenas em documentos canônicos singulares de governança, instrução, contexto ou estado global, como `AGENTS.md`, `PROJECT_CONTEXT.md`, `TECH_DECISIONS.md`, `PLANS.md` e o futuro `PRD.md`.
- Use `kebab-case` em documentação técnica, científica, funcional e de projeto e em nomes de diretórios.
- Nomeie ADRs futuros como `ADR-NNNN-titulo-em-kebab-case.md` e relatórios históricos datados como `YYYY-MM-DD-titulo-em-kebab-case.md`.
- Um relatório vivo pode usar maiúsculas apenas quando for um documento canônico singular claramente definido.
- Não renomeie arquivos existentes apenas para adequá-los à convenção sem autorização explícita.

## Segurança, validação e entrega

- Não registre dados pessoais desnecessários, segredos, credenciais, tokens, chaves ou valores de ambiente. Mascare ou omita qualquer dado sensível encontrado e comunique o risco sem reproduzi-lo.
- Valide as alterações de forma proporcional ao risco antes da entrega, incluindo escopo, diff, referências, terminologia e verificações automatizadas já disponíveis no repositório.
- Ao concluir, informe os arquivos alterados, as verificações executadas e seus resultados, as pendências, os bloqueios e qualquer verificação não realizada.
- Atualize, somente quando a tarefa autorizar os respectivos caminhos e a entrega realmente os afetar, os registros canônicos aplicáveis, preservando o histórico relevante: [TECH_DECISIONS.md](TECH_DECISIONS.md), [docs/governance/DOCUMENT_REGISTER.md](docs/governance/DOCUMENT_REGISTER.md) e [docs/governance/PENDING_DECISIONS.md](docs/governance/PENDING_DECISIONS.md). Quando uma atualização for materialmente necessária, mas o caminho não estiver autorizado, relate a necessidade sem editar o arquivo.
