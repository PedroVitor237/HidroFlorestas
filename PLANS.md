# Política de planos de execução

## Quando um plano é obrigatório

Um plano de execução é obrigatório quando a tarefa apresentar pelo menos uma destas condições:

- for extensa ou envolver múltiplos arquivos;
- atravessar camadas documentais, como ciência, produto, UX, arquitetura e implementação;
- envolver decisões pendentes;
- alterar documentos normativos;
- comparar documentação com implementação;
- produzir mudanças difíceis de revisar ou reverter.

Tarefas pequenas e isoladas podem dispensar um arquivo de plano, desde que o escopo, a validação e os efeitos permaneçam claros.

## Local e convenção

Quando a estrutura for autorizada, os planos ativos serão mantidos em `docs/plans/active/` e os encerrados em `docs/plans/completed/`. A existência descrita aqui é futura; os diretórios não devem ser criados sem uma tarefa que os autorize.

Arquivos de plano são documentos de projeto e devem usar `kebab-case`, por exemplo `realinhar-documentacao-de-produto.md`.

## Estrutura mínima

Todo plano deve registrar:

1. identificador, título e estado do plano;
2. objetivo e resultado esperado;
3. escopo e fora de escopo;
4. fontes aplicáveis, autoridade por assunto e classificação das informações;
5. estado inicial, arquivos afetados e alterações preexistentes a preservar;
6. dependências, riscos e decisões pendentes;
7. etapas ordenadas, responsáveis quando conhecidos e critérios de conclusão;
8. pontos de parada para revisão humana;
9. verificações previstas e evidências de validação;
10. bloqueios, desvios e decisões tomadas durante a execução;
11. histórico de estados e resumo de encerramento.

Campos sem informação disponível devem usar `não especificado`. Propostas, inferências e recomendações devem ser rotuladas de acordo com [docs/governance/SOURCE_AUTHORITY.md](docs/governance/SOURCE_AUTHORITY.md).

## Estados e atualização

Use os seguintes estados do plano:

- `NAO_INICIADO`;
- `EM_ANDAMENTO`;
- `AGUARDANDO_REVISAO`;
- `BLOQUEADO`;
- `CONCLUIDO`;
- `CANCELADO`.

Atualize o plano quando uma etapa começar ou terminar, quando o escopo mudar, quando surgir um bloqueio ou quando uma validação alterar a compreensão do trabalho. Preserve o histórico: não substitua silenciosamente estados, evidências nem justificativas anteriores.

## Pontos de parada para revisão humana

Interrompa a parte afetada do trabalho e solicite revisão quando:

- uma fonte conflitante não puder ser resolvida pela autoridade definida;
- uma decisão pendente for necessária para prosseguir;
- houver mudança material de escopo ou de documento normativo;
- uma ação difícil de reverter não estiver explicitamente autorizada;
- forem necessárias validação científica, designação de autoridade ou aprovação de produto, dados, UX ou arquitetura;
- alterações preexistentes incompatíveis não puderem ser preservadas com segurança.

O plano pode avançar em partes independentes e seguras, desde que isso seja registrado e não antecipe a decisão pendente.

## Tratamento de bloqueios

Registre o bloqueio, o impacto, as fontes ou evidências, as tentativas seguras realizadas e a decisão necessária. Não contorne o bloqueio por inferência, não transforme ausência em requisito e não atribua responsável ou aprovação sem origem. Marque o plano como `BLOQUEADO` somente quando nenhuma etapa segura e independente puder prosseguir.

## Validações obrigatórias

Antes do encerramento, valide no mínimo:

- o diff completo e a aderência ao escopo autorizado;
- a preservação de alterações preexistentes e de áreas imutáveis;
- links, referências, terminologia, classificações e estados;
- ausência de segredos, credenciais e dados pessoais desnecessários;
- verificações automatizadas já configuradas e pertinentes;
- critérios de conclusão e pendências remanescentes.

Registre comandos, resultados e justificativas para verificações não executadas. Testes ou ferramentas não devem ser inventados ou instalados apenas para satisfazer o plano.

## Encerramento e arquivamento

Um plano só pode ser marcado `CONCLUIDO` quando o resultado, as validações, os arquivos afetados, as pendências e os bloqueios estiverem registrados. Após a revisão exigida, mova-o de `docs/plans/active/` para `docs/plans/completed/` sem apagar seu histórico. Planos cancelados também devem preservar a motivação e o estado alcançado. O arquivamento não substitui a atualização dos registros canônicos de decisões, documentos e pendências.
