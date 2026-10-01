# Contexto do projeto HidroFlorestas

## Identidade e propósito

- `FATO_DOCUMENTADO` — O HidroFlorestas é uma plataforma web desenvolvida no contexto de uma iniciativa de extensão e startup. Fonte: contexto fornecido pela equipe para a governança e identidade básica apresentada no `README.md`.
- `FATO_DOCUMENTADO` — O Índice HidroFlorestal (IHFR) constitui o núcleo científico da plataforma. Fonte: contexto fornecido pela equipe para a governança.
- `FATO_DOCUMENTADO` — O projeto está em uma fase de auditoria e realinhamento documental. A governança mínima precede a análise, a reconciliação e a atualização dos documentos. Fonte: mandato de governança fornecido pela equipe.

Este contexto é navegacional. Ele não valida requisitos, fórmulas, arquitetura nem estado de implementação.

## Camadas documentais

As camadas devem permanecer distinguíveis e rastreáveis:

- **Ciência:** regras científicas, variáveis, protocolos e cálculo do IHFR, sujeitos à validação dos responsáveis científicos.
- **Produto:** objetivos, escopo, requisitos e regras de negócio aprovados pela autoridade competente.
- **UX:** fluxos, wireframes e telas, com estado de aprovação explícito.
- **Arquitetura:** intenção técnica confirmada, propostas e ADRs aceitos.
- **Implementação:** evidências observáveis em código, configurações, migrations, testes e comportamento executável; não equivale automaticamente à intenção aprovada.
- **PRD:** futuro documento normativo de produto, a ser elaborado ou atualizado somente após a consolidação das fontes e as aprovações necessárias.

## Evidências históricas

`docs/raw/` é um conjunto de evidências históricas imutáveis. Seus documentos podem registrar escopo, conhecimento científico, requisitos, propostas ou estados anteriores, mas não constituem automaticamente a versão normativa atual. A autoridade de cada fonte depende do assunto e do estado de aprovação, conforme [docs/governance/SOURCE_AUTHORITY.md](docs/governance/SOURCE_AUTHORITY.md).

## Documentos canônicos de governança

| Documento | Função |
|---|---|
| [AGENTS.md](AGENTS.md) | Instruções estáveis para agentes e mantenedores. |
| [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) | Contexto mínimo e mapa navegacional do projeto. |
| [TECH_DECISIONS.md](TECH_DECISIONS.md) | Registro vivo de decisões, alternativas e seus estados decisório e de implementação. |
| [PLANS.md](PLANS.md) | Política para planejar e acompanhar trabalhos extensos. |
| [docs/governance/SOURCE_AUTHORITY.md](docs/governance/SOURCE_AUTHORITY.md) | Autoridade das fontes, classificações e protocolo de conflitos. |
| [docs/governance/DOCUMENT_REGISTER.md](docs/governance/DOCUMENT_REGISTER.md) | Estrutura do inventário e estado dos documentos. |
| [docs/governance/PENDING_DECISIONS.md](docs/governance/PENDING_DECISIONS.md) | Questões que ainda dependem de decisão ou designação da equipe. |
| [docs/governance/TRACEABILITY_MATRIX.md](docs/governance/TRACEABILITY_MATRIX.md) | Matriz canônica de rastreabilidade documental e de camadas, sem autoridade científica, funcional ou técnica. |

## Limites de validação atuais

Permanecem `NAO_ESPECIFICADO` ou não validados nesta base de contexto:

- o conteúdo e a vigência individual dos documentos de `docs/raw/`;
- a correspondência entre documentação e implementação;
- a validação das regras científicas e do cálculo do IHFR pelos responsáveis designados;
- a consolidação dos objetivos, requisitos, termos, regras de negócio e fluxos de UX;
- a arquitetura técnica definitiva e a implementação das escolhas relatadas;
- o conteúdo e a aprovação de um PRD.

Essas ausências não devem ser convertidas em requisitos, decisões, conflitos resolvidos ou evidências de implementação.
