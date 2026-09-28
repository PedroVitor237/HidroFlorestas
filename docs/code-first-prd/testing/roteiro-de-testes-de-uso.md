# Roteiro de testes de uso do HidroFlorestas

**Versão:** 2026-09-28 · **Público:** professor Fábio, participantes convidados e equipe de desenvolvimento · **Base:** [casos de uso](../specifications/use-cases.md), [histórias de usuário](../specifications/user-stories.md), código da branch `007-ihfr-evolution@94053dfee912ef9aa4c2444e3d10bea4eb2cbea1`.

## O que este teste procura observar

Percorrer a jornada **entrar → criar/escolher laboratório → cadastrar área → registrar coleta → informar dados ambientais → consultar IHFR experimental → reencontrar os registros**, anotando se cada etapa é compreensível, funciona e deixa clara a origem dos dados. O resultado técnico IHFR **não** equivale a avaliação científica de campo; fórmula, classes e pesos permanecem sujeitos a validação e recalibração.

Tempo estimado: **35 a 60 minutos** para a jornada principal, conforme experiência da pessoa e velocidade do ambiente. Faça pausas quando necessário. O participante pode dizer em voz alta o que espera que aconteça; o facilitador registra dúvidas e obstáculos sem ensinar a interface antes de cada tentativa. Não é uma prova de habilidade da pessoa.

## Preparação do facilitador

1. Disponibilize a URL **do ambiente de teste autorizado**, navegador e conexão. Registre branch/versão implantada e data. Confirme que o ambiente realmente contém esta entrega; se for outra versão, registre a diferença e não atribua o resultado a `94053df`.
2. Forneça uma **conta de teste `ACTIVE`**, credenciais por canal apropriado e papel `OWNER` ou `ADMIN` de laboratório para chegar ao cálculo. Confirme que a conta pode criar laboratório: o limite é **cinco vínculos por conta**. Se estiver em 5/5, use outra conta sintética aprovada com capacidade; preserve laboratórios antigos. O professor pode testar leitura com `MEMBER` em uma sessão separada.
3. Combine nomes fictícios únicos, por exemplo `Teste de uso 28-09 — A`, para laboratório e área. Use observações simuladas; não peça senha, dados pessoais, localização real ou dados científicos não aprovados na ficha de respostas. Para testar a localização do dispositivo, use somente se a pessoa concordar; coordenadas digitadas também servem.
4. Deixe disponível uma **ficha de dados simulados** para os quatro grupos ambientais, com unidades e valores aceitos pelo formulário. Para o cenário técnico de referência, o [checklist da 007, seção 2](../../validation/007-ihfr-evolution/end-to-end-checklist.md#2-vetor-técnico-do-cenário-feliz) fornece os valores e o resultado esperado `0,29 / MODERATE / HIGH`. O facilitador deve distinguir esse vetor de uma medição real ou de uma meta científica.
5. Tenha anotado quem pode administrar o ambiente, como registrar incidentes e quais recursos de teste serão preservados. Evite ações de excluir/desativar laboratório ou administrar usuários no fluxo comum.

**Ficha da sessão:** participante/código ______ · facilitador ______ · data/hora ______ · ambiente/versão ______ · navegador/dispositivo ______ · papel de teste ______ · nomes fictícios da execução ______.

## Jornada principal — seguir pela interface

Marque **Concluiu / Precisou de ajuda / Não concluiu / Não executado** em cada etapa. Anote a frase exibida ou o comportamento observado quando diferir do esperado. Os caminhos abaixo são pontos de orientação ao facilitador; peça à pessoa que use menus e links da interface sempre que possível.

| Etapa e referência | Tarefa para a pessoa participante | O que observar como resultado esperado | Resultado/notas |
|---|---|---|---|
| 1. Entrada · `CF-UC-002`, `CF-US-002/003` | Abrir a página de login, entrar e recarregar a primeira página privada. | Credenciais corretas levam a workspace; reload mantém a sessão. Mensagem de erro não expõe dados de outra conta. | ______ |
| 2. Laboratório · `CF-UC-004/006`, `CF-US-004/005/008` | Criar laboratório com o nome fictício; localizar o novo item; selecionar “ACESSAR LABORATÓRIO”. | Confirmação clara; mesmo laboratório aparece após reload; nome e contexto visíveis na landing. Se houver 5/5, registrar bloqueio e usar conta apta, sem apagar dados. | ______ |
| 3. Área · `CF-UC-007/008`, `CF-US-009/010` | Ir a “Áreas”, iniciar “Nova área”, informar nome e um ponto no mapa **ou** digitar latitude/longitude; confirmar; voltar à lista e reabrir. | Detalhe exibe área e ponto coerentes, no laboratório escolhido. Município/UF e descrição são opcionais; não se espera polígono. | ______ |
| 4. Coleta · `CF-UC-009/010`, `CF-US-011/012/013` | No detalhe da área, iniciar “Registrar coleta”, informar data/hora de ocorrência passada com fuso explícito, revisar e confirmar. Reabrir o detalhe. | A revisão mostra área, laboratório e momento informado; a confirmação cria uma coleta recuperável na área correta. | ______ |
| 5. Dados ambientais · `CF-UC-011`, `CF-US-014/015` | Abrir “Ver dados ambientais”, registrar água, solo, vegetação e terreno com a ficha simulada, revisar, confirmar e recarregar. | Antes do registro há estado de ausência; depois os mesmos valores, unidades, origem e referência de contrato aparecem após reload. `Não`, `0` e campo não informado não devem parecer a mesma coisa. | ______ |
| 6. IHFR · `CF-UC-012/013`, `CF-US-016/017` | Voltar à coleta; informar uso predominante da terra, origem e data da observação; verificar elegibilidade e confirmar “Criar diagnóstico”. | Para vetor de referência completo, resultado técnico `0,29 / MODERATE / HIGH`; diagnóstico mostra origem, componentes, versões, estado vigente e indicação **experimental**. Caso faltem dados, explicar insuficiência sem inventar score. | ______ |
| 7. Reencontro · `CF-UC-013/014`, `CF-US-017/019` | Recarregar a coleta, voltar ao dashboard, procurar a coleta no histórico e abri-la novamente. | Mesma coleta e diagnóstico vigente reabrem, com dados ambientais preservados; links levam ao laboratório e à área certos. | ______ |
| 8. Mapa · `CF-UC-015`, `CF-US-020/021` | Abrir “Mapa”, selecionar a área pelo ponto e pela lista textual, conferir a coleta confirmada e abrir seu detalhe. | Ponto e item textual correspondem; contagem e link levam à área/coleta correta; informação essencial também é alcançável sem depender só do mapa. | ______ |
| 9. Saída · `CF-UC-003`, `CF-US-003` | Encerrar sessão e tentar voltar à página privada. | Logout conduz ao estado sem acesso; nova autenticação é exigida para visualizar o conteúdo privado. | ______ |

**Opcional com o facilitador e conta própria:** `OWNER`/`ADMIN` pode experimentar **REPLACE** com nova observação e depois **REVOKE** com justificativa, conferindo a mudança de `CURRENT` e ausência de vigente após a revogação (`CF-UC-012/013`). Faça isso somente em cenário fictício separado; esses atos alteram o diagnóstico e não são necessários para completar o teste comum.

## Perguntas ao final

1. Em que momento você soube com certeza em qual **laboratório, área e coleta** estava trabalhando? Em que momento ficou em dúvida?
2. Os nomes dos campos e suas unidades permitiram preencher a ficha simulada sem ajuda? Quais termos precisaram de explicação?
3. Você percebeu quando os dados estavam **em preparação**, **confirmados** e **disponíveis após recarregar**? O que a interface poderia esclarecer?
4. O resultado IHFR deixou claro que é **experimental** e mostrou de onde vieram os dados? O que você entendeu da classe e da qualidade exibidas?
5. Você conseguiu reencontrar a coleta pelo histórico e pelo mapa? Qual caminho foi mais fácil?
6. Houve texto pequeno, foco invisível, uso exclusivo de cor, dificuldade no celular ou navegação por teclado?
7. Qual foi o obstáculo mais importante? Que melhoria você priorizaria para a próxima rodada?

**Escala opcional (1 difícil → 5 fácil):** entrada ___ · laboratório ___ · área ___ · coleta ___ · dados ___ · IHFR ___ · reencontrar ___; confiança na clareza do estado experimental ___/5.

## Registro de resultado e encaminhamento

| Campo | Preenchimento |
|---|---|
| Etapa e ID (`CF-UC`/`CF-US`) | ______ |
| O que a pessoa tentou e esperava | ______ |
| O que apareceu, inclusive mensagem e momento | ______ |
| Conseguiu sem ajuda? | Sim / Com ajuda / Não / Não executado |
| Como reproduzir (sem senha ou dados pessoais) | ______ |
| Evidência autorizada (captura sanitizada, se útil) | ______ |
| Classificação provisória | Dúvida de uso / Comportamento funcional / Ambiente / Não determinado |
| Prioridade sugerida e responsável pela análise | ______ |

O facilitador consolida observações repetidas, separa **dificuldade de uso**, **falha técnica** e **problema do ambiente**, e encaminha ao desenvolvedor responsável sem alterar a implementação durante a sessão. Uma etapa não executada deve permanecer como tal. Se aparecer resposta incerta após confirmação, consulte o registro antes de repetir a ação; não crie cópias para tentar obter uma mensagem de sucesso.

**Limites de escopo:** ingresso em laboratório existente (`CF-UC-005`) ainda não está disponível; administração global (`CF-UC-018`), mudanças de papel (`CF-UC-016`) e desativação/exclusão (`CF-UC-017`) exigem roteiros isolados com pessoas autorizadas. O teste de uso não avalia o rigor científico da fórmula nem substitui validação de campo; essas etapas ocorrerão posteriormente conforme os responsáveis científicos.
