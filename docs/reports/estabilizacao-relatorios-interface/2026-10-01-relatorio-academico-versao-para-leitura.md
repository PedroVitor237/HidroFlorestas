# Desenvolvimento da plataforma HidroFlorestas: atividades, resultados e perspectivas

**Relatório de atividades com corte em 1º de outubro de 2026.**

## Resumo

O HidroFlorestas é uma plataforma web desenvolvida no contexto de uma iniciativa de extensão e startup, voltada à organização de informações ambientais e ao acompanhamento de áreas monitoradas. Seu núcleo científico é o Índice HidroFlorestal de Risco, denominado IHFR, cuja versão implementada possui caráter experimental. O trabalho registrado compreendeu análise da documentação inicial, definição de requisitos, planejamento por funcionalidades, desenvolvimento da plataforma e testes técnicos. A aplicação evoluiu de estruturas e telas iniciais para um fluxo que relaciona usuários, laboratórios, áreas, coletas, registros ambientais e diagnósticos.

Até 1º de outubro de 2026, as principais funcionalidades descritas neste relatório haviam sido implementadas e reunidas na versão principal do software. Os registros de teste demonstram a execução de operações isoladas e de percursos completos em ambientes preparados para essa finalidade. Permanecem necessárias avaliações com usuários, verificações de acessibilidade e desempenho e, especialmente, validação científica do IHFR. Este relatório apresenta as atividades e seus resultados, distinguindo o que foi construído, o que foi demonstrado nos testes e o que continua como perspectiva de trabalho.

## 1. Contexto e objetivos do trabalho

A proposta do HidroFlorestas envolve reunir informações de campo que precisam permanecer associadas ao lugar e ao momento em que foram obtidas. Para equipes de pesquisa e extensão, a plataforma pretende oferecer uma sequência organizada entre o cadastro de uma área, o registro de uma coleta, a inclusão de dados ambientais e a consulta de um diagnóstico. Essa é uma finalidade do projeto; seu benefício efetivo para as atividades de campo ainda precisa ser avaliado com os públicos envolvidos.

O IHFR busca sintetizar aspectos relacionados à água, ao solo, à vegetação e ao contexto territorial. Na versão experimental, observações dessas quatro dimensões são convertidas em pontuações e reunidas em um resultado de risco. A existência desse resultado no software não demonstra, por si só, que os pesos, os limites ou as categorias adotados sejam adequados a todos os territórios.

O objetivo central do trabalho de desenvolvimento foi construir uma plataforma capaz de manter essa cadeia de informações organizada e controlada, conservando os registros após o encerramento do acesso pelo usuário. Isso exigiu definir o que cada pessoa poderia fazer, quais dados seriam registrados, como relacioná-los e como preservar a origem das observações e dos resultados.

As atividades abrangeram quatro objetivos complementares: compreender e organizar a documentação existente; transformar necessidades em funcionalidades delimitadas; implementar e integrar essas funcionalidades; e verificar seu comportamento, registrando resultados e limitações. A validação científica do índice constitui uma frente relacionada, mas distinta da verificação técnica do sistema.

## 2. Organização e análise da documentação inicial

O projeto já possuía documentos sobre variáveis ambientais, cálculo do índice, procedimentos de campo, requisitos da plataforma, estruturas de dados e propostas de interface, isto é, de telas e formas de interação com a plataforma. Esses materiais não formavam uma descrição única e inteiramente conciliada. Havia diferenças entre fórmulas, categorias de uso da terra, regras para dados ausentes e significados atribuídos a termos como coleta e diagnóstico.

Entre agosto e setembro de 2026, a equipe organizou esse material e registrou as principais dúvidas. Os documentos originais foram preservados, permitindo reconhecer o que cada fonte dizia antes das decisões posteriores. Essa preservação foi importante porque uma escolha adotada durante o desenvolvimento não deveria apagar alternativas que poderiam ser úteis à revisão científica.

A análise também separou propostas de comportamento efetivamente implementado. Uma tela demonstrativa, por exemplo, pode apresentar cartões e indicadores preenchidos sem consultar registros reais. Da mesma forma, a existência de uma estrutura no banco de dados não significa que o usuário já consiga cadastrar ou consultar aquela informação. Foi necessário examinar a relação entre documentos, telas e funcionamento do software.

Essa etapa produziu uma base mais clara para o planejamento: algumas necessidades estavam suficientemente definidas para implementação, outras exigiam decisões locais da equipe e outras permaneciam dependentes de apreciação especializada. O trabalho evitou tratar toda proposta histórica como obrigação atual ou toda capacidade do código como prova de que o produto desejado já estivesse integralmente definido.

## 3. Planejamento e definição de requisitos

Os requisitos descrevem o comportamento que o sistema deve oferecer e as condições em que esse comportamento é aceitável. No HidroFlorestas, o planejamento passou a organizar o trabalho em entregas pequenas, cada uma com objetivo, regras, etapas de implementação e verificações próprias.

A sequência levou em conta dependências práticas. Antes de registrar uma coleta, era necessário identificar o usuário e a área à qual ela pertenceria. Antes de calcular o índice, era necessário dispor dos registros ambientais e de uma regra de cálculo explícita. Essa organização permitiu desenvolver partes do sistema sem antecipar decisões sobre todas as funcionalidades futuras.

Os critérios de aceitação foram associados a situações concretas. Entre elas estavam: manter o acesso após recarregar uma página; impedir que uma pessoa consulte dados de um laboratório ao qual não pertence; preservar o momento da coleta; evitar duplicação quando uma operação é repetida após falha de rede; e informar quando faltam dados para calcular o índice.

Também foi necessário distinguir responsabilidades. O administrador de um laboratório possui atribuições naquele espaço, enquanto o administrador global atua sobre contas da plataforma. A permissão para uma ação depende do vínculo e do estado atual do usuário e do laboratório. A interface, isoladamente, não é responsável por garantir essa proteção: as regras são novamente verificadas no servidor, a parte do sistema que processa as solicitações e acessa os dados.

O planejamento e a implementação não permaneceram sempre atualizados no mesmo ritmo em todos os documentos. Alguns textos conservaram descrições de etapas ainda previstas, embora registros posteriores mostrassem sua conclusão técnica. Por isso, a reconstrução das atividades considerou o momento de cada informação. Uma funcionalidade planejada não foi tratada como pronta, e uma funcionalidade integrada não foi considerada automaticamente aprovada em todos os testes ou por todos os usuários.

## 4. Evolução da plataforma e funcionalidades entregues

Os primeiros registros de desenvolvimento examinados datam de março de 2026. A fase inicial reuniu estrutura da aplicação, acesso de usuários e armazenamento. Nos meses seguintes, avançaram a modelagem dos dados e as interfaces de apresentação, acesso e áreas. Parte dessas interfaces utilizava conteúdo fixo, adequado para demonstrar a organização visual, mas ainda sem completar a interação com dados persistidos.

Em setembro, o trabalho concentrou-se em conectar as funcionalidades e estabelecer regras para sua utilização. O resultado passou a ser uma sequência de operações relacionadas, descrita a seguir.

### 4.1 Acesso do usuário

Foram desenvolvidos mecanismos para entrada com e-mail e senha, restauração do acesso ao recarregar a aplicação, proteção das páginas e encerramento da sessão. O acesso normal depende de a conta estar ativa. As respostas enviadas ao navegador foram limitadas às informações necessárias, evitando a exposição de dados sensíveis e de campos administrativos.

Em 28 de setembro, a equipe adotou uma regra específica para facilitar os testes com usuários: contas criadas pelo cadastro público passaram a ser criadas como ativas, permitindo entrar sem aprovação manual prévia. A decisão preservou os demais estados de conta, inclusive bloqueio e inativação. Ela se refere à fase de testes e não estabelece, por si só, a política definitiva de ingresso na plataforma.

### 4.2 Laboratório como espaço de organização

Na plataforma, o laboratório funciona como um espaço digital que reúne participantes e seus registros. O usuário pode criar e reencontrar laboratórios aos quais possui acesso, respeitado o limite atual de cinco vínculos acessíveis por conta. Ao criar um laboratório, o sistema registra o vínculo inicial correspondente.

A pessoa escolhe explicitamente o laboratório em que deseja trabalhar. Essa escolha permanece identificável durante a navegação, reduzindo a possibilidade de confundir registros de equipes diferentes. Foram implementadas configurações e regras para desativação ou exclusão, com restrições quando existem dados dependentes. Um laboratório inativo continua disponível para leitura autorizada, mas não para novas alterações.

### 4.3 Cadastro da área monitorada

Dentro do laboratório, usuários com permissão podem cadastrar uma área e indicar sua localização por latitude e longitude. A representação inicial é um ponto no mapa. O cadastro pode ser consultado posteriormente em uma lista e em uma página de detalhes.

Esse recorte oferece localização e vínculo territorial sem pressupor delimitação completa do imóvel ou desenho de polígonos. A localização pode ser informada manualmente, e o mapa não é o único meio de acesso às informações. A visualização territorial reúne áreas e suas coletas, preservando a associação entre os registros.

### 4.4 Coleta e registros ambientais

A coleta registra um evento vinculado a uma área, com informações sobre o momento da ocorrência. O sistema diferencia o horário observado em campo do horário em que o registro foi confirmado e preserva a informação de fuso associada à ocorrência. A identidade de quem realiza a operação vem do acesso autenticado.

Antes da confirmação, o usuário pode revisar o preenchimento. Depois, o registro confirmado é preservado sem alteração direta. Essa escolha busca evitar mudanças silenciosas em informações que sustentam etapas posteriores. Até o corte deste relatório, a revisão prévia era mantida durante o preenchimento, sem constituir um rascunho ambiental salvo para retomada futura.

À coleta pode ser associado um conjunto de registros ambientais organizado em água, solo, vegetação e terreno. Há regras explícitas de preenchimento, unidades e valores aceitos. Uma informação não preenchida permanece diferente de zero ou de uma resposta negativa. Os dados confirmados são armazenados em conjunto, preservando sua relação com a coleta e a área de origem.

### 4.5 Diagnóstico IHFR experimental

O diagnóstico é uma etapa posterior à coleta e ao registro dos dados ambientais. Antes do cálculo, o sistema verifica se as informações necessárias estão presentes e se são compatíveis com a versão de regras adotada. Na formulação experimental atual, as quatro dimensões precisam ter informação suficiente; declividade e uso da terra são necessários ao componente territorial.

O cálculo é determinístico, ou seja, as mesmas entradas submetidas à mesma versão das regras devem produzir o mesmo resultado. Foi implementado no próprio sistema, sem depender de uma inteligência artificial que gerasse livremente a conclusão. O resultado identifica a versão utilizada e preserva os dados necessários para compreender sua origem.

O usuário autorizado pode consultar o diagnóstico e seu histórico. Uma substituição gera um novo resultado e conserva o anterior. A revogação retira a condição de vigente, também preservando o registro. Há no máximo um diagnóstico vigente por coleta, o que evita apresentar simultaneamente duas conclusões como atuais.

Essa funcionalidade permite testar o processo de cálculo e gestão dos resultados. O conjunto de regras continua experimental, sujeito a recalibração, com validação científica pendente e sem aprovação como definição científica definitiva.

### 4.6 Acompanhamento e administração

Foi desenvolvido um painel de acompanhamento com contagens e histórico derivados de áreas e coletas confirmadas. As informações remetem aos registros de origem, em vez de depender de números fixos inseridos apenas para preencher a interface. O mapa territorial apresenta as áreas e suas coletas associadas, acompanhado de uma lista textual que permanece útil quando o mapa de referência utilizado como fundo não está disponível.

A administração global passou a oferecer consulta e alteração controlada de estados e papéis de contas, com registro das mudanças e proteção para impedir a remoção do último administrador ativo. Essa autoridade permanece separada das permissões dentro de cada laboratório.

Em 1º de outubro, o conjunto desenvolvido foi incorporado à versão principal do software. Essa integração confirma que as entregas foram reunidas, mas não demonstra, isoladamente, que todas as telas do site publicado tenham sido testadas ou que todos os critérios de qualidade estejam atendidos.

## 5. Decisões técnicas e científicas durante o trabalho

O desenvolvimento utilizou uma aplicação web que reúne as telas e o processamento das operações. O Next.js fornece a estrutura para essa aplicação, enquanto o PostgreSQL é o sistema de banco de dados utilizado para armazenar as informações. Esses recursos ajudam a explicar a construção do produto, mas sua adoção não substitui a avaliação do comportamento efetivamente entregue.

Uma decisão importante foi separar a captura ambiental do cálculo. As regras para registrar uma observação podem ser definidas e testadas sem declarar aprovados todos os pesos e limites do índice. Isso permitiu avançar na organização dos dados enquanto permanecia aberta a avaliação científica da formulação.

Para tornar a primeira versão calculável, a equipe adotou em setembro um conjunto experimental de regras: quatro dimensões com pesos iguais, categorias de uso da terra explicitadas e tratamento definido para insuficiência de dados e limites entre classes. Fontes históricas apresentavam alternativas, incluindo pesos regionais diferentes. A escolha operacional não eliminou essas alternativas nem demonstrou superioridade científica da formulação selecionada.

Outra decisão foi proteger a repetição de operações. Uma conexão pode falhar depois que o servidor já registrou uma coleta, deixando o usuário sem confirmação visual. O sistema utiliza mecanismos para reconhecer a repetição da mesma solicitação e evitar criar registros duplicados. Essa preocupação também orientou a preservação de históricos e a recuperação de resultados após interrupções.

## 6. Atividades de teste e resultados demonstrados

Os testes abrangeram diferentes níveis. Testes de partes isoladas verificaram regras específicas, como validação de entradas e cálculos. Testes de integração verificaram o comportamento de componentes em conjunto, inclusive armazenamento e permissões em determinados ambientes. Testes de percurso completo utilizaram o navegador para executar sequências semelhantes às ações de um usuário. Também foram realizadas verificações de preparação da aplicação para execução e de compatibilidade entre seus componentes.

Essas atividades permitiram encontrar problemas de interface, interpretação de entradas, solicitações simultâneas e configuração dos ambientes. Os registros preservam tanto falhas intermediárias quanto resultados posteriores às correções. Um teste interrompido antes de começar por falta de conexão ou configuração adequada não foi considerado aprovado.

Na rodada de 27 de setembro, os registros técnicos relatam aprovação de testes isolados, integração com banco e percursos pelo navegador. Dois ensaios completos percorreram acesso, laboratório, área, coleta, registros ambientais e diagnóstico, incluindo recarga da página, substituição e revogação do resultado. O segundo ensaio utilizou o estado técnico final daquela rodada. Isso demonstrou o funcionamento integrado da sequência no ambiente de teste empregado.

Em 28 de setembro, parte das verificações foi repetida durante a revisão de integração, incluindo regras isoladas e preparação da aplicação. Os testes que exigiam banco de dados e navegador foram citados como resultados anteriores, sem serem apresentados como novas execuções nessa revisão.

Em 1º de outubro, uma nova rodada registrou **245 casos de teste de partes isoladas e 65 casos de integração com componentes simulados aprovados**. Nesses 65 casos, partes do sistema foram substituídas de forma controlada para verificar o comportamento sem acessar um banco real. Esses 310 casos não correspondem a toda a bateria disponível. As verificações que dependiam de uma conexão específica com banco foram interrompidas na preparação, e percursos adicionais pelo navegador não foram executados naquela rodada para evitar alterações em dados de teste já existentes.

Os testes utilizaram dados preparados para verificar o comportamento do sistema. O fato de uma entrada de teste produzir a pontuação esperada comprova aderência à regra programada; não demonstra que essa pontuação corresponda à condição ambiental real de uma área. A avaliação científica exige observações e referências independentes, além de análise especializada.

### Funcionamento do mapa publicado

Durante a estabilização, foi identificado que a exibição do mapa no site publicado dependia de configuração própria, diferente da utilizada no ambiente local. OpenStreetMap foi escolhido como base cartográfica. Em 1º de outubro, a pessoa que realizou a configuração informou ter definido o endereço de carregamento do mapa e seu crédito de atribuição na Vercel, serviço de hospedagem da aplicação, e confirmou o mapa funcionando no site publicado.

Esse resultado é uma **validação manual relatada por quem realizou a configuração**. A elaboração deste relatório não incluiu inspeção independente do painel de hospedagem nem comprovação individual das telas de cadastro de área, detalhe da área e mapa territorial. Os testes locais anteriores haviam utilizado respostas simuladas para verificar o comportamento dos componentes, o que não equivalia a testar a base cartográfica real em produção.

## 7. Dificuldades encontradas e encaminhamentos

A primeira dificuldade foi conciliar documentos com níveis diferentes de detalhe e de aprovação. A equipe precisou identificar quais afirmações descreviam a intenção do projeto, quais eram alternativas e quais regras estavam suficientemente definidas para execução. O encaminhamento foi preservar os textos de origem, registrar decisões limitadas à versão experimental e manter abertas as questões científicas.

Outra dificuldade foi transformar interfaces demonstrativas em operações persistentes. Isso exigiu conectar telas ao armazenamento, estabelecer permissões, definir estados de erro e impedir que recursos de laboratórios diferentes fossem acessados indevidamente. A continuidade do trabalho passou a depender da coerência entre a informação apresentada e sua origem real.

Também ocorreram incompatibilidades entre ferramentas, diferenças de configuração e dificuldades de conexão com ambientes de teste. Foram feitos ajustes nas versões utilizadas, nas verificações de preparação e nas condições de execução. Os registros distinguem esses problemas das falhas efetivas do programa. Entre as correções funcionais documentadas estão a validação de respostas do tipo sim/não, a geração de identificadores no navegador e o reforço da consistência entre dados e diagnósticos armazenados.

A repetição de testes exigiu cuidado com os dados já existentes. Contas destinadas a ensaios podiam atingir o limite de laboratórios, e históricos preservados não deveriam ser apagados apenas para facilitar uma nova execução. Foram acrescentadas verificações de capacidade e procedimentos de isolamento. Em situações sem condições adequadas, a limitação foi registrada em vez de simular uma aprovação.

Por fim, o incidente do mapa mostrou que a presença da funcionalidade no código e seu funcionamento local não asseguram a configuração correta do serviço publicado. O relato de resolução após a configuração é compatível com a hipótese investigada, mas não permite reconstruir todos os detalhes do ambiente que apresentou o problema.

## 8. Participação individual e construção coletiva

Os registros disponíveis demonstram participação de diferentes pessoas. Eles permitem atribuir atividades específicas, mas não medir todas as horas dedicadas, identificar cada contribuição feita em reunião ou distribuir integralmente a autoria intelectual. A integração de uma entrega por uma pessoa também não significa que ela tenha desenvolvido sozinha todo o conteúdo.

**Pedro Vitor** aparece associado à base inicial da aplicação, às interfaces de acesso, à organização documental e do processo de desenvolvimento, às entregas de autenticação, áreas, coletas e registros ambientais, ao ajuste de cadastro ativo e à integração de entregas. Essas contribuições incluem desenvolvimento e organização do trabalho, sem sustentar atribuição exclusiva da plataforma ou do IHFR.

**Luciano Mendes** aparece associado à estrutura de dados e a recursos administrativos iniciais, às interfaces de apresentação e acompanhamento, à conexão com o banco, aos laboratórios, ao mapa e à administração de usuários. Também há contribuição registrada para a definição executável das regras e para o avaliador do diagnóstico experimental.

Um colaborador identificado nos registros como **“thalesvalente”** contribuiu para completar o ciclo do diagnóstico, corrigir entradas e comportamento no navegador, reforçar a integridade do banco e ampliar as verificações e os testes. O nome civil completo e o vínculo acadêmico dessa identidade não foram confirmados pelas fontes utilizadas, razão pela qual não são presumidos neste texto.

Ao **professor Fábio Mesquita de Souza**, a equipe atribuiu a concepção histórica do IHFR. Essa atribuição não comprova autoria de cada documento inicial nem aprovação científica das escolhas realizadas durante a implementação. A revisão especializada do índice permanece uma atividade necessária.

Decisões registradas em nome da equipe foram mantidas como coletivas. Ferramentas de assistência por inteligência artificial, incluindo Codex, participaram do processo documentado de desenvolvimento e redação; não há informação suficiente para quantificar sua participação em cada alteração.

A trajetória do diagnóstico evidencia essa construção coletiva: organização das regras, implementação do avaliador, complementação do fluxo e correções posteriores aparecem distribuídas entre participantes. O registro das contribuições permite reconhecer esse encadeamento sem reduzir o trabalho à pessoa que reuniu ou apresentou a entrega final.

## 9. Contribuições, aprendizado e limitações

O principal resultado técnico foi a construção de uma sequência persistente entre laboratório, área, coleta, registros ambientais e diagnóstico experimental. Essa sequência é acompanhada por controle de acesso, histórico, visualização territorial básica e documentação das regras adotadas. Há demonstração técnica de percursos completos em ambientes de teste e confirmação manual relatada do funcionamento do mapa publicado.

A análise das atividades permite destacar um aprendizado metodológico: documentação, implementação e validação precisam ser examinadas em conjunto. A definição de regras antes de programar ajudou a tornar explícitas as dúvidas; os testes revelaram situações que exigiram correções; e o registro dos resultados permitiu distinguir avanços efetivos de intenções ainda não realizadas. Essa contribuição diz respeito ao processo de desenvolvimento, sem representar uma avaliação independente de seu impacto institucional.

Os limites continuam relevantes. Não foram apresentados resultados suficientes de campo, calibração concluída ou parecer científico definitivo para o IHFR. As avaliações com usuários sobre compreensão e facilidade de uso permanecem incompletas. Testes automatizados de teclado e apresentação visual não substituem o uso de leitores de tela e outras tecnologias assistivas por pessoas. Também faltam medições previstas de desempenho do mapa e novas execuções de testes em ambientes apropriados para os casos ainda não verificados.

A pesquisa que fundamenta este relatório é documental, baseada em planejamento, decisões, histórico de alterações e registros de testes. Sua elaboração não constituiu uma nova campanha de testes, entrevistas ou observações de campo. Tampouco forneceu elementos para afirmar carga horária, cumprimento de edital, adoção institucional, impacto socioambiental ou distribuição completa do esforço individual.

## 10. Atividades futuras

A continuidade deve combinar avaliação científica e aperfeiçoamento do uso da plataforma. Para o IHFR, permanecem necessárias a definição dos responsáveis pela revisão, a comparação entre formulações, a escolha de casos de referência e o planejamento de observações de campo. Qualquer alteração das regras deve preservar a identificação da versão utilizada e os resultados anteriores.

Na avaliação com usuários, os próximos trabalhos incluem verificar a compreensão da origem dos registros, das mensagens de ausência de dados, das permissões e do caráter experimental dos diagnósticos. Acessibilidade e desempenho devem ser examinados com procedimentos adequados, sem transformar o sucesso de testes técnicos em aprovação humana presumida.

Entre as melhorias de interface levantadas estão tornar mais fácil encontrar a opção de sair da conta, aperfeiçoar o preenchimento de município e unidade federativa, facilitar a entrada de data e hora, esclarecer categorias de uso da terra e estudar o salvamento de rascunhos ambientais. Até o corte, esses itens constituíam propostas para seleção e planejamento. Também permaneciam futuras a ampliação das visualizações analíticas e uma reformulação visual mais abrangente.

O encerramento das atividades aqui descritas corresponde, portanto, à disponibilização de uma base funcional integrada e testada em condições delimitadas. A etapa seguinte é ampliar e qualificar sua avaliação, preservando a distinção entre funcionamento do software, experiência de uso e validade científica do diagnóstico ambiental.
