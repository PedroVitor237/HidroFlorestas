# Contrato de fronteira: dados ambientais da coleta

**Status**: contrato documental condicionado; não é API executável nem aprovação de payload científico.
**References**: [spec.md](../spec.md), [data-model.md](../data-model.md), [plan.md](../plan.md).

## C-001 — Contexto e autorização

Entrada conceitual: referências explícitas a laboratório, área e coleta existente. São referências a revalidar, não credenciais. Principal, elegibilidade e vínculo vêm do servidor.

Ordem herdada: autenticar/conta elegível → laboratório filtrado pelo vínculo → papel/estado/permissão → área subordinada → coleta subordinada → dados subordinados. G3 define as permissões específicas dos dados; `CREATE_COLLECTION` não basta para autorizá-los automaticamente.

Saída autorizada: apenas a projeção pública definida para o registro e contexto. Saída negada: nenhuma diferença observável de existência entre recurso inacessível e inexistente. Laboratório inativo impede escrita e mantém leitura para quem conservar permissão.

## C-002 — Entrada científica

G2 é precondição: sem contrato aprovado e aplicável, a capacidade de registrar dados permanece indisponível. Não aceitar payload livre, campos dos quatro models como default ou conversões inferidas.

O contrato executável posterior deve identificar, para cada campo aprovado: significado, tipo semântico, unidade, precisão, obrigatoriedade/condicionalidade, ausência/não aplicável, cardinalidade, regras de validação e exemplos válidos/inválidos. Deve também fixar a referência de versão, sua aplicabilidade e tratamento de mudança durante o preenchimento.

Esta lista é uma exigência de completude documental do gate, não uma lista de variáveis a coletar. Nenhum campo científico está aprovado neste arquivo.

## C-003 — Registro e recuperação

Precondições: G1–G3 satisfeitos, coleta confirmada acessível, laboratório ativo e permissão específica vigente. O resultado deve preservar valores aprovados e origem, sem alterar a coleta ou gerar diagnóstico.

`RECOMENDACAO` sujeita a G3: revisão explícita e primeira gravação integral da unidade aprovada; sucesso somente depois da persistência; mesma tentativa recuperável após timeout; conflito visível quando houver envio divergente. Unidade, identidade e regras de repetição serão fechadas com o ciclo/multiplicidade. A chave de confirmação da IMP-004 não será reutilizada por suposição.

Não há método HTTP, URI de escrita, schema de request ou código de conflito novo fixado nesta fase. Fixá-los antes de decidir entre registro inicial, múltiplas observações ou complementação criaria semântica de produto não autorizada.

## C-004 — Consulta e projeção

A leitura usa o mesmo contexto e a mesma fronteira de acesso, com projeção por allowlist. Exibir valores/unidades e referência científica autorizados; permitir identificar a coleta e, por ela, a origem. Ausência de registro é apresentada como ausência, sem imputação de zeros ou classificação de qualidade.

Não expor autor interno, chave idempotente, tokens, códigos de acesso ou relações científicas legadas automaticamente. Eventual autoria própria/publicação depende de G3. O detalhe da coleta IMP-004 mantém seu DTO fechado; novas medições não podem ser acrescentadas silenciosamente a esse response.

## C-005 — Compatibilidade HTTP herdada

A IMP-004 documenta as operações abaixo, ainda não disponíveis no baseline desta branch:

- `POST /api/laboratories/{laboratoryId}/areas/{areaId}/collections`: somente `{ occurredAt }`, confirma metadados gerais.
- `GET /api/laboratories/{laboratoryId}/areas/{areaId}/collections/{collectionId}`: detalhe imutável, envelope `{ collection }`.

Ambas permanecem inalteradas por este planejamento. Seus erros usam `{ error: { code, message } }` e `Cache-Control: no-store`. `Location` da criação é URI de API, distinta da navegação da UI.

`RECOMENDACAO`: a futura superfície de dados deve preservar as mesmas convenções de autenticação, erro sanitizado, no-store e contexto. Após G1–G3, formalizar contrato próprio com métodos, rotas, status, allowlists, exemplos e testes. O baseline de laboratórios ainda usa `{ success, ... }`; não misturar os envelopes sem reconciliação explícita.

## C-006 — Interface de usuário

Entrada: detalhe contextual da coleta, quando integrado. Laboratório, área e coleta aparecem como referências, não como campos para reassociação. Mostrar estado de carregamento, ausência de dados, falha, indisponibilidade por contrato e somente leitura conforme situação e acesso.

`RECOMENDACAO`: campos com labels/unidades do contrato, erros associados aos campos, foco previsível, teclado, layout móvel/amplo e feedback de resultado. Revisão/confirmar/voltar são proposta sujeita a G3; não criar tela persistente de rascunho ou retomada. A interface não concede autorização e não substitui validação no servidor.

## C-007 — Matriz de contrato e aceite

| Caso | Resultado | Referência |
|---|---|---|
| Sem sessão/conta inelegível | Negação sem dados | FR-001 |
| Sem vínculo ou contexto cruzado/inexistente | Resultado indistinguível, sem dados | FR-002/012 |
| Inativo, leitura permitida | Projeção autorizada em somente leitura | FR-010/011 |
| Inativo, tentativa de escrita | Recusa e zero escrita | FR-011 |
| Ativo, papel sem permissão específica | Recusa; matriz detalhada depende G3 | FR-001/002 |
| Sem G2 | Nenhuma medição aceita como válida | FR-003/004 |
| Conteúdo inválido conforme G2 | Erro compreensível sem correção silenciosa | FR-005 |
| Registro válido | Origem preservada e resultado persistido verificável | FR-006–008 |
| Falha/repetição | Sem sucesso falso; sem duplicação da mesma operação conforme G3 | FR-009 |
| Consulta sem registro | Ausência, sem valores inventados | FR-010 |
| Tentativa de editar pai ou produzir IHFR | Fora da superfície autorizada | FR-006/013 |

## Limite de completude

Este contrato fixa fronteiras e pré-condições. G2/G3 impedem gerar OpenAPI científico completo, DTOs e exemplos de medições. Antes de tarefas executáveis, atualizar coordenadamente spec, checklist, plano, pesquisa, modelo, este contrato e quickstart com decisões e origem. Nenhum marcador vazio substitui essa aprovação.
