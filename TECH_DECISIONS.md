# Registro de decisões técnicas

## Como interpretar o registro

Cada entrada usa dimensões independentes:

- **Classificação da informação:** indica a natureza da afirmação e sua origem, conforme [docs/governance/SOURCE_AUTHORITY.md](docs/governance/SOURCE_AUTHORITY.md).
- **Estado decisório:** indica se a alternativa está `CONFIRMADO`, `PROPOSTO`, `EM_AVALIACAO`, `ADIADO`, `REJEITADO` ou `SUBSTITUIDO`.
- **Estado de implementação:** indica se está `IMPLEMENTADO_VERIFICADO`, `IMPLEMENTACAO_RELATADA_PENDENTE_DE_VERIFICACAO`, `NAO_IMPLEMENTADO`, `PARCIALMENTE_IMPLEMENTADO`, `NAO_AVALIADO` ou `NAO_APLICAVEL`.

Uma decisão `CONFIRMADO` não implica implementação verificada. Da mesma forma, implementação observada não substituiria a confirmação da intenção. Alterações futuras devem acrescentar uma linha ao histórico antes de atualizar o estado corrente; estados anteriores não devem ser apagados.

## Escolhas relatadas pela equipe

Estas escolhas foram informadas como adotadas. A classificação `DECISAO_RELATADA_PENDENTE_DE_VERIFICACAO` registra que a adoção foi relatada e que a implementação ainda não foi verificada.

| Identificador | Assunto | Decisão ou alternativa | Classificação | Estado decisório | Estado de implementação |
|---|---|---|---|---|---|
| `TD-001` | Framework full-stack | Adotar Next.js como framework full-stack. | `DECISAO_RELATADA_PENDENTE_DE_VERIFICACAO` | `CONFIRMADO` | `IMPLEMENTACAO_RELATADA_PENDENTE_DE_VERIFICACAO` |
| `TD-002` | Banco de dados | Adotar PostgreSQL. | `DECISAO_RELATADA_PENDENTE_DE_VERIFICACAO` | `CONFIRMADO` | `IMPLEMENTACAO_RELATADA_PENDENTE_DE_VERIFICACAO` |
| `TD-003` | Banco de desenvolvimento | Adotar Neon no plano gratuito para desenvolvimento. | `DECISAO_RELATADA_PENDENTE_DE_VERIFICACAO` | `CONFIRMADO` | `IMPLEMENTACAO_RELATADA_PENDENTE_DE_VERIFICACAO` |
| `TD-004` | ORM | Adotar Prisma ORM; a equipe relatou que já existe código relacionado. | `DECISAO_RELATADA_PENDENTE_DE_VERIFICACAO` | `CONFIRMADO` | `IMPLEMENTACAO_RELATADA_PENDENTE_DE_VERIFICACAO` |
| `TD-005` | Estilização | Adotar Tailwind CSS. | `DECISAO_RELATADA_PENDENTE_DE_VERIFICACAO` | `CONFIRMADO` | `IMPLEMENTACAO_RELATADA_PENDENTE_DE_VERIFICACAO` |
| `TD-006` | Ícones | Adotar Lucide React. | `DECISAO_RELATADA_PENDENTE_DE_VERIFICACAO` | `CONFIRMADO` | `IMPLEMENTACAO_RELATADA_PENDENTE_DE_VERIFICACAO` |
| `TD-007` | Hospedagem da aplicação | Adotar Vercel para hospedar a aplicação no contexto atualmente relatado. | `DECISAO_RELATADA_PENDENTE_DE_VERIFICACAO` | `CONFIRMADO` | `IMPLEMENTACAO_RELATADA_PENDENTE_DE_VERIFICACAO` |

### Origem e evidências das escolhas relatadas

| Identificador | Origem | Data | Responsável | Evidências | Dependências | Observações | ADR relacionado |
|---|---|---|---|---|---|---|---|
| `TD-001` | relato da equipe fornecido para a governança | não especificado | não especificado | Relato da equipe; implementação não verificada. | não especificado | Nenhuma inspeção do código foi realizada para esta entrada. | não especificado |
| `TD-002` | relato da equipe fornecido para a governança | não especificado | não especificado | Relato da equipe; implementação não verificada. | não especificado | Nenhuma inspeção de schema, migration ou configuração foi realizada para esta entrada. | não especificado |
| `TD-003` | relato da equipe fornecido para a governança | não especificado | não especificado | Relato da equipe; implementação não verificada. | não especificado | A escolha relatada limita-se ao plano gratuito para desenvolvimento; outros ambientes não foram especificados. | não especificado |
| `TD-004` | relato da equipe fornecido para a governança | não especificado | não especificado | Relato da equipe de que a escolha foi adotada e de que existe código relacionado; código não verificado. | não especificado | Existência, abrangência e conformidade da implementação permanecem sem avaliação. | não especificado |
| `TD-005` | relato da equipe fornecido para a governança | não especificado | não especificado | Relato da equipe; implementação não verificada. | não especificado | Nenhuma inspeção do código foi realizada para esta entrada. | não especificado |
| `TD-006` | relato da equipe fornecido para a governança | não especificado | não especificado | Relato da equipe; implementação não verificada. | não especificado | Nenhuma inspeção do código foi realizada para esta entrada. | não especificado |
| `TD-007` | relato da equipe fornecido para a governança | não especificado | não especificado | Relato da equipe; implementação não verificada. | não especificado | Não resolve a estratégia futura de hospedagem registrada em `TD-013`. | não especificado |

## Alternativas ainda não aprovadas

As entradas abaixo não têm autoridade normativa e não devem ser tratadas como decisões confirmadas.

| Identificador | Assunto | Decisão ou alternativa | Classificação | Estado decisório | Estado de implementação |
|---|---|---|---|---|---|
| `TD-008` | Base cartográfica | Avaliar o uso de OpenStreetMap. | `EM_AVALIACAO` | `EM_AVALIACAO` | `NAO_AVALIADO` |
| `TD-009` | Cálculos científicos | Avaliar o uso de Python para cálculos científicos e do IHFR. | `EM_AVALIACAO` | `EM_AVALIACAO` | `NAO_AVALIADO` |
| `TD-010` | Visualizações de mapa | Avaliar o uso de Plotly em visualizações relacionadas ao mapa. | `EM_AVALIACAO` | `EM_AVALIACAO` | `NAO_AVALIADO` |
| `TD-011` | Biblioteca de mapas | Considerar a possibilidade de uso de Leaflet. | `PROPOSTA` | `PROPOSTO` | `NAO_AVALIADO` |
| `TD-012` | Integração de componentes | Avaliar a estratégia de integração entre componentes Python e Next.js. | `EM_AVALIACAO` | `EM_AVALIACAO` | `NAO_AVALIADO` |
| `TD-013` | Hospedagem futura | Avaliar a estratégia futura de hospedagem. | `EM_AVALIACAO` | `EM_AVALIACAO` | `NAO_AVALIADO` |
| `TD-014` | Mapas e visualizações | Avaliar a arquitetura definitiva para mapas e visualizações. | `EM_AVALIACAO` | `EM_AVALIACAO` | `NAO_AVALIADO` |

### Origem e evidências das alternativas

| Identificador | Origem | Data | Responsável | Evidências | Dependências | Observações | ADR relacionado |
|---|---|---|---|---|---|---|---|
| `TD-008` | Item informado pela equipe para registro de governança, sem aprovação | não especificado | não especificado | Registro da alternativa; não constitui aprovação nem evidência de implementação. | `PD-007` em `docs/governance/PENDING_DECISIONS.md` | Critérios de adoção não especificados. | não especificado |
| `TD-009` | Item informado pela equipe para registro de governança, sem aprovação | não especificado | não especificado | Registro da alternativa; não constitui aprovação nem evidência de implementação. | `PD-008` em `docs/governance/PENDING_DECISIONS.md` | Escopo dos componentes e critérios científicos não especificados. | não especificado |
| `TD-010` | Item informado pela equipe para registro de governança, sem aprovação | não especificado | não especificado | Registro da alternativa; não constitui aprovação nem evidência de implementação. | `PD-009` em `docs/governance/PENDING_DECISIONS.md` | Plotly ter sido considerado não implica rejeição de Leaflet. | não especificado |
| `TD-011` | Item informado pela equipe para registro de governança, sem aprovação | não especificado | não especificado | Registro da proposta; não constitui aprovação nem evidência de implementação. | `PD-010` em `docs/governance/PENDING_DECISIONS.md` | A consideração de Plotly não rejeita nem substitui esta proposta. | não especificado |
| `TD-012` | Item informado pela equipe para registro de governança, sem aprovação | não especificado | não especificado | Registro do tema em avaliação; estratégia não definida. | `PD-011` em `docs/governance/PENDING_DECISIONS.md` | Interfaces, responsabilidades e forma de implantação não especificadas. | não especificado |
| `TD-013` | Item informado pela equipe para registro de governança, sem aprovação | não especificado | não especificado | Registro do tema em avaliação; estratégia futura não definida. | `PD-012` em `docs/governance/PENDING_DECISIONS.md` | A escolha relatada de Vercel não resolve automaticamente a estratégia futura. | não especificado |
| `TD-014` | Item informado pela equipe para registro de governança, sem aprovação | não especificado | não especificado | Registro do tema em avaliação; arquitetura não definida. | `PD-013` em `docs/governance/PENDING_DECISIONS.md` | A avaliação dos componentes não define sua combinação nem a arquitetura definitiva. | não especificado |

## Histórico de estados

Cada mudança deve acrescentar uma linha com a origem e manter as linhas anteriores.

| Entrada | Data | Evento | Estado decisório registrado | Estado de implementação registrado | Origem |
|---|---|---|---|---|---|
| `TD-001` | não especificado | Registro inicial | `CONFIRMADO` | `IMPLEMENTACAO_RELATADA_PENDENTE_DE_VERIFICACAO` | relato da equipe fornecido para a governança |
| `TD-002` | não especificado | Registro inicial | `CONFIRMADO` | `IMPLEMENTACAO_RELATADA_PENDENTE_DE_VERIFICACAO` | relato da equipe fornecido para a governança |
| `TD-003` | não especificado | Registro inicial | `CONFIRMADO` | `IMPLEMENTACAO_RELATADA_PENDENTE_DE_VERIFICACAO` | relato da equipe fornecido para a governança |
| `TD-004` | não especificado | Registro inicial | `CONFIRMADO` | `IMPLEMENTACAO_RELATADA_PENDENTE_DE_VERIFICACAO` | relato da equipe fornecido para a governança |
| `TD-005` | não especificado | Registro inicial | `CONFIRMADO` | `IMPLEMENTACAO_RELATADA_PENDENTE_DE_VERIFICACAO` | relato da equipe fornecido para a governança |
| `TD-006` | não especificado | Registro inicial | `CONFIRMADO` | `IMPLEMENTACAO_RELATADA_PENDENTE_DE_VERIFICACAO` | relato da equipe fornecido para a governança |
| `TD-007` | não especificado | Registro inicial | `CONFIRMADO` | `IMPLEMENTACAO_RELATADA_PENDENTE_DE_VERIFICACAO` | relato da equipe fornecido para a governança |
| `TD-008` | não especificado | Registro inicial | `EM_AVALIACAO` | `NAO_AVALIADO` | Item informado pela equipe para registro de governança, sem aprovação |
| `TD-009` | não especificado | Registro inicial | `EM_AVALIACAO` | `NAO_AVALIADO` | Item informado pela equipe para registro de governança, sem aprovação |
| `TD-010` | não especificado | Registro inicial | `EM_AVALIACAO` | `NAO_AVALIADO` | Item informado pela equipe para registro de governança, sem aprovação |
| `TD-011` | não especificado | Registro inicial | `PROPOSTO` | `NAO_AVALIADO` | Item informado pela equipe para registro de governança, sem aprovação |
| `TD-012` | não especificado | Registro inicial | `EM_AVALIACAO` | `NAO_AVALIADO` | Item informado pela equipe para registro de governança, sem aprovação |
| `TD-013` | não especificado | Registro inicial | `EM_AVALIACAO` | `NAO_AVALIADO` | Item informado pela equipe para registro de governança, sem aprovação |
| `TD-014` | não especificado | Registro inicial | `EM_AVALIACAO` | `NAO_AVALIADO` | Item informado pela equipe para registro de governança, sem aprovação |

Não há ADR relacionado registrado para nenhuma entrada. Um ADR só poderá ser criado após a aprovação da decisão correspondente e quando a natureza da decisão justificar esse registro.
