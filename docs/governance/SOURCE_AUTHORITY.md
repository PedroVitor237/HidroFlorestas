# Autoridade das fontes

## Princípios

A autoridade é específica ao assunto. Nenhuma fonte deve ter sua autoridade extrapolada para uma camada que ela não governa. Intenção, implementação, evidência histórica, proposta, inferência e recomendação devem permanecer separadas e identificadas.

- Código não é fonte absoluta para todo o projeto: comprova o estado implementado que for diretamente verificável.
- `docs/raw/` não é automaticamente a versão normativa atual: preserva evidências históricas, inclusive documentos que podem estar desatualizados.
- Uma decisão confirmada pode ainda não estar implementada.
- Uma implementação existente pode não corresponder à intenção atual.
- Regras científicas e cálculo do IHFR exigem validação dos responsáveis científicos designados.
- A equipe pode aprovar um contrato experimental de engenharia sem convertê-lo em validação científica definitiva, desde que versão, proveniência, conflitos, limitações e estado científico permaneçam explícitos.
- O documento institucional aprovado governa o escopo originalmente aprovado, mas não necessariamente as decisões técnicas atuais.

## Matriz por assunto

| Assunto | Fonte principal | Autoridade e limites |
|---|---|---|
| Instruções da tarefa em execução | Solicitação aprovada da equipe e `AGENTS.md` aplicáveis | Governam a execução corrente dentro do escopo autorizado. |
| Escopo institucional | Documento institucional aprovado armazenado em `docs/raw/` | Autoridade sobre o escopo originalmente aprovado; sua identidade e vigência devem ser registradas na auditoria apropriada. |
| Objetivos e direção atual do produto | Decisões explicitamente confirmadas pela equipe | Prevalecem como intenção atual quando não violarem o escopo institucional. Confirmação exige origem registrada. |
| Regras científicas | Documentos científicos validados e responsáveis científicos designados | Exigem validação científica; conflitos não podem ser resolvidos por inferência do agente. |
| Cálculo do IHFR | Documentos científicos validados e responsáveis científicos designados | Fórmulas, variáveis e critérios dependem de validação científica explícita. Implementação é evidência, não validação científica. |
| Contrato experimental IHFR v0.1 | Decisão da equipe de 2026-09-18 e [ADR-0001](ADR-0001-contrato-experimental-ihfr-v0-1.md) | Autoridade provisória para planejamento e implementação experimental. Não confere validade científica definitiva; exige `VALIDACAO_CIENTIFICA_PENDENTE`, proveniência, versionamento, hash, imutabilidade e recalibração por nova versão. |
| Modelo de dados | Decisões confirmadas pela autoridade de dados e registros normativos aceitos | Governa o modelo pretendido. Schemas e migrations demonstram apenas o estado implementado; enquanto a autoridade não for designada, divergências são pendências. |
| Requisitos funcionais | Decisões confirmadas pela autoridade de produto e requisitos, limitadas pelo escopo institucional | Propostas, backlog histórico e implementação não se tornam requisitos aprovados por recorrência ou existência. |
| UX e fluxos | Decisões de UX confirmadas e artefatos com estado de aprovação registrado | Wireframes e Figma são evidência conforme seu estado; explorações não são requisitos aprovados. |
| Arquitetura pretendida | Decisões técnicas confirmadas pela equipe e ADRs aceitos | Representa intenção normativa, mesmo quando ainda não implementada. Propostas arquiteturais não aprovadas não têm essa autoridade. |
| Estado implementado | Código, configurações, migrations, testes e comportamento verificável | Evidência do estado atual, não fonte absoluta do comportamento desejado. |
| Decisões técnicas confirmadas | Confirmações explícitas da equipe e ADRs aceitos | Governam a intenção técnica no assunto e devem registrar separadamente o estado de implementação. |
| Documentos de `docs/raw/` | Evidência histórica e documental | São imutáveis e podem estar desatualizados; a autoridade depende do assunto, da origem e do estado de aprovação. |
| Propostas e hipóteses | Registros com estado explícito | Não possuem autoridade normativa enquanto não forem confirmadas. |
| Recomendações do agente | Planos ou relatórios identificados como recomendação | Não representam decisão aprovada e não podem alterar a autoridade das fontes. |

## Classificação das informações

| Classificação | Critério |
|---|---|
| `FATO_DOCUMENTADO` | Informação declarada explicitamente por uma fonte identificada. |
| `EVIDENCIA_IMPLEMENTACAO` | Informação confirmada diretamente por código, configuração, migration, teste ou comportamento executável. |
| `DECISAO_CONFIRMADA` | Escolha explicitamente aprovada pela equipe, com origem identificada e registrada; data quando disponível. |
| `DECISAO_RELATADA_PENDENTE_DE_VERIFICACAO` | Escolha que a equipe informou ter adotado, mas cuja implementação ainda não foi verificada. |
| `PROPOSTA` | Alternativa sugerida, sem aprovação registrada. |
| `EM_AVALIACAO` | Alternativa sob análise, ainda sem decisão. |
| `INFERENCIA` | Conclusão derivada de evidências, mas não declarada diretamente por uma fonte. |
| `RECOMENDACAO` | Orientação do analista ou agente, sem autoridade decisória. |
| `PENDENCIA_DE_DECISAO` | Ponto que depende de decisão, validação ou designação de responsável. |
| `NAO_ESPECIFICADO` | Informação necessária que não consta nas fontes disponíveis. |

No IHFR v0.1, `CONTRATO_EXPERIMENTAL`, `VALIDACAO_CIENTIFICA_PENDENTE`, `SUJEITO_A_RECALIBRACAO` e `NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO` são qualificadores obrigatórios definidos no ADR-0001. Eles não substituem as classificações acima; delimitam o alcance da decisão confirmada.

Não converta ausência de informação em requisito, proposta recorrente em decisão ou implementação existente em intenção aprovada. Toda `INFERENCIA` deve ser identificada. `DECISAO_CONFIRMADA` exige origem identificada e registrada; origem `não especificado` não é suficiente. Sem essa origem, mantenha a informação como pendência ou use outra classificação compatível com as evidências. Data e responsável ausentes podem usar `não especificado`. Decisões já registradas com origem válida permanecem inalteradas.

## Estados de decisões técnicas

Os dois eixos são independentes e devem ser registrados separadamente.

**Estado decisório:** `CONFIRMADO`, `PROPOSTO`, `EM_AVALIACAO`, `ADIADO`, `REJEITADO` ou `SUBSTITUIDO`.

**Estado de implementação:** `IMPLEMENTADO_VERIFICADO`, `IMPLEMENTACAO_RELATADA_PENDENTE_DE_VERIFICACAO`, `NAO_IMPLEMENTADO`, `PARCIALMENTE_IMPLEMENTADO`, `NAO_AVALIADO` ou `NAO_APLICAVEL`.

## Protocolo para conflitos

Quando houver conflito entre fontes:

1. identificar as fontes envolvidas;
2. registrar as evidências sem sobrescrever o histórico;
3. aplicar a autoridade específica do assunto;
4. não extrapolar a autoridade de uma fonte para outro assunto;
5. registrar `PENDENCIA_DE_DECISAO` quando a autoridade não for suficiente;
6. aguardar decisão da equipe, sem escolher uma versão silenciosamente;
7. após a resolução, atualizar [../../TECH_DECISIONS.md](../../TECH_DECISIONS.md) e os demais registros canônicos aplicáveis, preservando o histórico.

O protocolo estabelece como tratar conflitos futuros; ele não declara que conflitos específicos já tenham sido identificados ou resolvidos.
