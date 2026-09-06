<!--
Sync Impact Report
- Version change: template -> 1.0.0
- Added principles: source hierarchy; vertical delivery; per-feature specification;
  evidence and traceability; proportional quality and security; evolving documentation;
  teamwork.
- Added sections: delivery workflow; governance.
- Removed sections: none; template placeholders were resolved.
- Deferred items: none.
-->
# Constituição do HidroFlorestas

## Princípios Fundamentais

### I. Hierarquia de fontes

Cada entrega DEVE aplicar, por assunto, esta ordem: decisões atuais explicitamente
confirmadas; intenção registrada no PRD Code-First; código, schema, testes e configurações
como baseline implementado; decisões técnicas conforme seus estados; documentação antiga
como contexto, proposta ou origem de perguntas; e referências visuais como apoio de UX
conforme sua classificação. Nenhuma fonte pode ser promovida além de sua autoridade.

### II. Entregas verticais

Cada feature DEVE produzir um resultado pequeno e verificável. Infraestrutura DEVE estar
vinculada a uma entrega próxima, e decisões de módulos futuros não bloqueiam a feature atual
quando não forem dependências materiais do seu recorte.

### III. Especificação por funcionalidade

Specs, planos e tarefas executáveis DEVEM permanecer em `specs/<feature>/**`. O pacote
`docs/code-first-prd/**` mantém visão global, produto, backlog e rastreabilidade. Não criar
`TASKS.md` global nem duplicar artefatos com OpenSpec.

### IV. Evidência e rastreabilidade

Cada artefato DEVE distinguir comportamento observado, intenção, hipótese e decisão, além de
referenciar os requisitos Code-First aplicáveis. Documentação histórica não pode ser promovida
automaticamente a intenção atual.

### V. Qualidade e segurança proporcionais

Cada entrega DEVE validar o comportamento alterado, proteger dados sensíveis e impedir a
exposição de senha ou campos privilegiados. O trabalho DEVE tratar os riscos concretos do
módulo e não ampliar o recorte para auditorias gerais sem relação com a entrega.

### VI. Documentação evolutiva

A documentação afetada DEVE ser atualizada após cada entrega. `docs/raw/**` e a trilha
documental histórica DEVEM ser preservados; intenção científica ou de domínio não pode ser
alterada silenciosamente.

### VII. Trabalho em equipe

Cada funcionalidade DEVE usar uma branch e uma spec próprias. A equipe DEVE evitar edição
simultânea de schema, autenticação, configuração global e componentes compartilhados, manter
PRs pequenos e integrar com frequência.

## Fluxo de entrega

O fluxo padrão é `$speckit-specify`, esclarecimento quando material, `$speckit-plan`,
`$speckit-tasks`, análise de consistência quando útil, `$speckit-implement` e validação da
entrega. Os nomes, formatos e efeitos aplicáveis são os definidos pelas skills `speckit-*`
instaladas em `.agents/skills/`. Nenhuma etapa pode inventar decisão de produto, domínio,
ciência, UX ou arquitetura para eliminar uma pendência material.

## Governança

Esta constituição governa o fluxo de implementação por funcionalidade em conjunto com
`AGENTS.md` e as políticas de autoridade das fontes. Emendas exigem solicitação explícita da
equipe, registro do impacto e incremento semântico: MAJOR para incompatibilidade normativa,
MINOR para novo princípio ou expansão material e PATCH para esclarecimento sem mudança de
sentido. Toda revisão de feature DEVE verificar aderência ao recorte e registrar desvios ou
pendências sem rebaixar silenciosamente estes princípios.

**Versão**: 1.0.0 | **Ratificada**: 2026-09-06 | **Última emenda**: 2026-09-06
