# Implementation Plan: Mapa e visualização territorial

**Branch**: `008-territorial-map` | **Date**: 2026-09-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/008-territorial-map/spec.md`

## Summary

Entregar uma visão territorial somente leitura por laboratório, sustentada diretamente por `CollectionArea` e pelas coletas confirmadas da IMP-004. Um endpoint GET contextual formará uma projeção mínima, sem persistência, cache de domínio ou coordenada própria de coleta. A interface combinará uma lista textual completa e um mapa Leaflet de múltiplos pontos carregado somente no cliente; falha de tiles, de configuração ou do módulo cartográfico não removerá os dados e destinos já autorizados.

## Technical Context

**Language/Version**: TypeScript 5, Node.js 20.19.2 no baseline local

**Primary Dependencies**: Next.js 16.1.6 (App Router), React 19.2.4, Prisma ORM 7.4.2, PostgreSQL/Neon, Leaflet 1.9.4, React-Leaflet 5.0.0 e Tailwind CSS 4; nenhuma dependência nova

**Storage**: PostgreSQL via Prisma apenas como fonte integrada; nenhuma tabela, coluna, migration, índice ou cópia territorial nova

**Testing**: `node:test` com `tsx` para unidade/contrato/integração e Playwright para interface/E2E; verificação humana separada para tecnologia assistiva e teste moderado

**Target Platform**: aplicação web responsiva em navegadores modernos; servidor Next.js em Linux/Vercel e PostgreSQL Neon

**Project Type**: aplicação web full-stack monolítica

**Performance Goals**: uma leitura autorizada e uma projeção sem N+1; renderização inicial enquadra todos os pontos válidos; meta técnica de planejamento de p95 até 500 ms para o endpoint e interação textual em até 2 s numa matriz de 100 áreas/1.000 coletas confirmadas, excluindo latência de tiles externos

**Constraints**: reautorização server-side por leitura; isolamento por laboratório; laboratório inativo somente leitura; DTO fechado; coordenadas com no máximo seis casas; dados privados `no-store`; tiles com cache HTTP do provedor preservado; mapa não pode ser caminho único; sem filtros, clusters, camadas científicas, PostGIS, Plotly ou Python

**Scale/Scope**: quatro histórias, uma rota de página, um endpoint GET, uma projeção transitória, um mapa agregado e uma lista equivalente; fontes atuais pequenas e sem evidência de necessidade de paginação ou infraestrutura espacial

As metas de desempenho acima são `RECOMENDACAO_TECNICA` verificável na implementação, não critério de produto confirmado nem promessa de SLA. A ausência de telemetria e volumetria real impede promovê-las além deste plano.

## Constitution Check

*GATE: aprovado antes da pesquisa e revalidado após o design da Fase 1.*

| Princípio | Verificação antes da Fase 0 | Verificação após a Fase 1 |
|---|---|---|
| I. Hierarquia de fontes | PASS — a spec pronta governa o recorte; Code-First, IMP-003/004 e código integrado foram usados conforme seus estados. | PASS — decisões técnicas estão classificadas em `research.md`; branches não integradas não foram tratadas como capacidade. |
| II. Entregas verticais | PASS — mapa, lista e navegação formam um incremento pequeno sustentado por fontes integradas. | PASS — dados ambientais, IHFR, histórico, filtros e geometrias futuras permanecem fora e não bloqueiam o mínimo. |
| III. Especificação por funcionalidade | PASS — planejamento limitado a `specs/008-territorial-map/**`. | PASS — plano, pesquisa, modelo, contrato e quickstart estão no diretório; `tasks.md` não foi criado. |
| IV. Evidência e rastreabilidade | PASS — spec registra requisitos, baseline, Code-First e dependências publicadas. | PASS — artefatos distinguem `EVIDENCIA_IMPLEMENTACAO`, `DECISAO_DE_PLANEJAMENTO`, `PENDENCIA_DE_DECISAO` e reconciliação futura. |
| V. Qualidade e segurança proporcionais | PASS — riscos centrais são isolamento, minimização, coordenadas, fallback e acessibilidade. | PASS — guard integrado, query contextual, DTO fechado, `no-store`, lista independente e matriz de testes cobrem os riscos sem auditoria geral. |
| VI. Documentação evolutiva | PASS — `docs/raw/**` e registros históricos não serão alterados. | PASS — não há decisão global confirmada que exija mudar `TECH_DECISIONS.md`; Leaflet é escolha local desta feature, não arquitetura cartográfica definitiva. |
| VII. Trabalho em equipe | PASS — branch própria, baseline remota sincronizada e sem integração automática. | PASS — design evita schema/configuração global novos e concentra futuras alterações em arquivos da feature e pequeno compartilhamento de configuração de mapa. |

Não há violação constitucional a justificar. As decisões ainda abertas foram mantidas fora do incremento ou como pontos explícitos de reconciliação.

## Project Structure

### Documentation (this feature)

```text
specs/008-territorial-map/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── territorial-map-api.openapi.yaml
├── checklists/
│   └── requirements.md
└── tasks.md                 # criado somente por $speckit-tasks
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── (private)/dashboard/laboratories/[laboratoryId]/
│   │   ├── layout.tsx                         # adiciona destino Mapa
│   │   └── map/page.tsx                     # guard de página e visão contextual
│   └── api/
│       ├── laboratories/[laboratoryId]/territorial-map/route.ts
│       └── server/
│           ├── territorial-map/territorial-map.contracts.ts
│           └── services/territorial-map.service.ts
├── components/
│   ├── areas/
│   │   └── area-map.client.tsx              # preserva mapa de ponto da IMP-003
│   ├── maps/
│   │   └── map-config.ts                    # configuração de tiles compartilhada
│   └── territorial-map/
│       ├── territorial-map-view.tsx             # dados, estados, lista e seleção
│       ├── territorial-map.tsx                  # limite dinâmico e error boundary
│       ├── territorial-map.client.tsx           # Leaflet de múltiplos pontos
│       └── territorial-map-state.ts             # estado puro e formatação testável
└── types/
    └── territorial-map.type.ts

tests/
├── fixtures/territorial-map.ts
├── unit/
│   ├── territorial-map-contracts.test.ts
│   ├── territorial-map-openapi-contract.test.ts
│   ├── territorial-map-service.test.ts
│   └── territorial-map-state.test.ts
├── integration/territorial-map-route.test.ts
└── e2e/territorial-map.spec.ts
```

O placeholder cientificamente não sustentado em `src/app/(private)/dashboard/maps.tsx` deverá deixar de participar do código após a rota contextual estar conectada; não será adaptado como fonte nem manterá legenda de risco.

**Structure Decision**: manter o monólito Next.js e os padrões integrados de factories de handler, serviços testáveis, guard central e DTOs fechados. Reutilizar Leaflet, React-Leaflet, CSS, `divIcon` e a configuração de tiles como infraestrutura; criar um componente agregado próprio porque o componente da IMP-003 incorpora seleção/edição de um único ponto. Não criar repository genérico, camada espacial ou segundo mecanismo de autorização.

## Baseline, Remote State and Dependencies

- `HEAD` local e `origin/008-territorial-map`: `2d7f9b452c041ad2326a729ce46581a71bcdbf16`, divergência `0/0` antes dos artefatos.
- `origin/development`: `37fb3a4fbf7dda04b9bc3b9f2fc1c64ed3b14e13`, igual à baseline informada; não houve avanço a reconciliar.
- IMP-003 `106e25f984df56384896729bf786e44104166570` e IMP-004 `7c977147797ca8a8c167033fee6e7a8ab46f673f` estão integradas em `development` e sustentam o plano.
- IMP-005 `1235387ded9854be20a92f8639a502a80a2bd952`, IMP-006 `f5f6e27de2a81d64fa6e829d44d68669ba447739` e IMP-007 `b863a86242da9364216842e31d4b87145d9a3ea1` correspondem aos HEADs remotos publicados, não são ancestrais de `development` e não foram incorporadas.

`EVIDENCIA_IMPLEMENTACAO`: `CollectionArea` contém `Decimal(8,6)`/`Decimal(9,6)` e chave de laboratório; `CollectionData` contém a relação composta com área/laboratório e a tupla de confirmação; `authorizeLaboratoryAccess`, detalhes contextuais e mapas Leaflet de ponto estão conectados. Nenhuma branch futura é dependência material do mapa mínimo.

## Design and Delivery Strategy

### 1. Fonte, consulta e projeção transitória

O novo serviço abre uma transação de leitura, chama `authorizeLaboratoryAccess(principal, laboratoryId, "READ_AREAS", tx)` e consulta somente `CollectionArea.laboratoryRoomId = laboratoryId`. A seleção inclui `id`, `name`, `latitude`, `longitude` e a relação `collectionData` filtrada pela tupla integrada completa: `occurredAt`, `occurrenceOffset`, `confirmedAt` e `confirmationKey` não nulos. Das coletas, seleciona apenas `id`, `occurredAt`, `occurrenceOffset` e `confirmedAt`.

A resposta segue [territorial-map-api.openapi.yaml](./contracts/territorial-map-api.openapi.yaml): contexto mínimo e `areas[]`; cada área possui `location` válida ou `null` e `confirmedCollections[]`. A contagem é sempre `confirmedCollections.length`, sem contador persistido. A coleta é aninhada à área e não recebe latitude/longitude. Ordenação determinística usa nome/ID para áreas e ocorrência/ID para coletas.

Não se amplia o endpoint de áreas da IMP-003, porque isso adicionaria coletas a consumidores que não precisam delas. Não se consome endpoint de dashboard nem se persiste projeção.

### 2. Autorização, isolamento e respostas

`GET /api/laboratories/{laboratoryId}/territorial-map` deriva a pessoa somente da sessão. `401` cobre ausência de autenticação ou conta inelegível conforme o guard integrado. Laboratório inválido, inexistente, sem vínculo, revogado ou cruzado converge em `404`; a query nunca consulta área/coleta antes do guard. Laboratório inativo retorna `200`, `status: INACTIVE` e `readOnly: true` porque a operação é leitura.

Cada detalhe de área ou coleta usa as rotas existentes e reexecuta seus guards. O payload territorial nunca funciona como credencial. Se uma leitura posterior retornar perda de acesso, a interface elimina imediatamente a projeção anterior antes de mostrar o estado indisponível.

### 3. Precisão e minimização

O serializer converte `Prisma.Decimal` em número apenas depois de validar finitude e limites inclusivos. Valores ausentes, não finitos ou fora de `[-90,90]`/`[-180,180]` produzem `location: null`; nunca zero, centro padrão ou correção. A interface formata até seis casas e remove zeros finais, sem acrescentar precisão textual.

Não saem do servidor autoria, `userId`, email, avatar, papel global, `accessCode`, observações, descrição, `confirmationKey`, dados ambientais, diagnósticos ou evidências. `membershipRole` é contexto não pessoal necessário para orientação coerente da interface.

### 4. Carregamento do mapa e tiles

A página contextual monta `TerritorialMapView`, que busca o endpoint com `cache: "no-store"`, `AbortController` e geração de request. Mudança de `laboratoryId`, retry ou desmontagem invalida respostas anteriores. O mapa Leaflet é `next/dynamic` com `ssr: false` dentro de Client Component, carregado somente depois de a projeção ter pelo menos uma localização válida. A lista e os estados ficam fora do error boundary cartográfico.

`MapContainer` terá dimensão CSS explícita (`20rem` no móvel e `28rem` a partir de `sm`), largura total e `overflow-hidden`. Um filho controla `fitBounds`: um ponto usa zoom máximo moderado; múltiplos pontos usam padding e `maxZoom`, tornando todos alcançíveis. A seleção é um `areaId` compartilhado entre marcador e lista; a mesma região textual apresenta nome, coordenadas, contagem e destinos.

A configuração continua em `NEXT_PUBLIC_MAP_TILE_URL` e `NEXT_PUBLIC_MAP_ATTRIBUTION`, extraída para helper compartilhado. Produção sem par válido não tenta tiles e comunica base indisponível. Desenvolvimento pode manter o fallback OSM já existente somente para uso manual de baixo volume. URL não é hardcoded na visão territorial.

O `TileLayer` acompanha `loading`, `tileload`, `tileerror` e `load`: nenhum sucesso com erros no ciclo visível sinaliza indisponibilidade; mistura de sucessos/erros sinaliza degradação sem transformar registros em erro; atribuição permanece montada enquanto qualquer conteúdo do provedor estiver em uso. Testes não acessam tiles públicos.

### 5. Estados e continuidade útil

- **Carregamento de dados**: limpa projeção anterior e anuncia `role=status`; não mostra zero/vazio.
- **Vazio verdadeiro**: somente após `200` com `areas: []`; orienta sem inventar ação incompatível com papel/estado.
- **Erro de dados/perda de acesso**: mensagem sanitizada e retry; nenhum mock ou dado anterior.
- **Localização indisponível**: item continua na lista, selecionável e com destino de detalhe; não cria marcador.
- **Tiles indisponíveis**: mapa pode manter pontos sobre fundo neutro quando o runtime existe; lista, coordenadas, relações e links continuam normais.
- **Mapa indisponível**: error boundary substitui apenas a região cartográfica por mensagem; lista e painel permanecem.
- **Sucesso**: mapa e lista derivam do mesmo array, sem cópias independentes.

### 6. Acessibilidade, interação e responsividade

Cada marcador preserva `keyboard: true`, recebe nome único/descritivo por `title`/atributo acessível e ativa a mesma seleção com Enter/clique. Marcadores coincidentes continuam elementos distintos na ordem de teclado; a lista é o caminho inequívoco para todos. A lista usa semântica `ul/li`, botão de seleção separado dos links e foco visível. Um status vivo anuncia a área selecionada e o painel tem heading identificável.

Cor/posição não codificam estado único. Contagem, indisponibilidade, modo somente leitura e tiles são textuais. Atribuição não é escondida. Em 320 px, mapa e lista empilham; textos quebram, elementos usam `min-w-0` e nenhum container exige largura mínima superior ao viewport.

### 7. Cache, limites e desempenho

Todas as respostas territoriais, inclusive erro, usam `Cache-Control: no-store`; o fetch usa `cache: "no-store"`; não há cache de servidor, SWR, local storage, service worker ou reutilização entre laboratórios. Isso não se aplica aos tiles: o navegador deve respeitar os headers do provedor, sem `no-cache`, proxy ou prefetch, conforme a política da fonte.

A consulta é limitada semanticamente a um laboratório autorizado e a coletas confirmadas, com `select` fechado e sem N+1. Não haverá truncamento silencioso, pois FR-012 exige todas as áreas alcançáveis e não existe decisão de paginação/clustering. A matriz de 100/1.000 mede a hipótese de pequeno volume. O índice atual de área por `(laboratoryRoomId, createdAt)` e o de coleta por `(collectionAreaId, laboratoryRoomId)` são suficientes para iniciar; qualquer índice lab-wide, paginação ou infraestrutura espacial depende de evidência de `EXPLAIN`/latência/volume na implementação futura.

### 8. Estratégia de testes

| Camada | Cobertura planejada |
|---|---|
| Unidade — contrato/serializer | validade e limites inclusive extremos; `location: null`; seis casas; reconstrução temporal; allowlist; contagem derivada; ausência de campos proibidos. |
| Unidade — serviço | guard antes da query; todos os papéis; ativo/inativo; filtro por laboratório e tupla confirmada; zero/uma/múltiplas; contexto cruzado/revogado; consulta sem N+1; falha sanitizada. |
| Unidade — estado de UI | loading/vazio/erro/sucesso; retry; invalidação de request; seleção mapa/lista; formatação; ciclos de tile disponível/degradado/indisponível. |
| Contrato | OpenAPI 3.1 válido; refs resolvidas; um `operationId`; schemas fechados; UUIDs; exemplos; `200/401/404/500`; `no-store`; GET único. |
| Integração | factory do handler, params, principal derivado, status/envelopes/cache; inacessível indistinguível; inativo `200`; DTO não vaza contexto proibido. |
| Interface/E2E | mapa/lista/painel; fit inicial; pontos coincidentes; links em uma ativação; loading/vazio/retry; troca de lab/resposta tardia; localização inválida; tile abortado/config ausente/módulo falho; teclado, ARIA e 320/768/1280 px. |
| Desempenho | fixture sintética 100 áreas/1.000 coletas, tamanho do DTO, número de operações e meta técnica sem tiles; sem benchmark contra serviço público. |
| Regressão | testes unitários/integração e E2E de IMP-003/004, mais lint, typecheck e build na fase de implementação. |
| Humana | tecnologia assistiva real para a parcela de SC-007 e teste moderado de SC-008; ambos permanecem `NAO_VERIFICADO` até evidência registrada. |

Nenhum teste funcional, build, Prisma ou banco é executado nesta etapa de planejamento.

## Requirements Traceability

| Requisitos | Decisão de design | Validação principal |
|---|---|---|
| FR-001–FR-006 | guard integrado dentro da leitura, query contextual e projeção transitória | serviço, integração e E2E com revogação/inativo |
| FR-007–FR-013 | ponto atual validado, `location: null`, precisão e fit; sem geometria/agregação | serializer, estado e E2E de extremos/coincidência |
| FR-014–FR-018 | tupla confirmada IMP-004, coleção aninhada, contagem por tamanho e links contextuais | serviço, contrato e E2E de zero/uma/múltiplas |
| FR-019–FR-024 | máquina de estados, DTO fechado, `no-store` e descarte de resposta tardia | unidade, integração e E2E de erro/troca de lab |
| FR-025–FR-030 | uma projeção para mapa/lista, teclado, nomes, texto equivalente, breakpoints e atribuição | interface/E2E e verificação humana separada |
| FR-031–FR-035 | zero filtros/camadas/ciência; Leaflet como decisão local; reconciliação futura sem runtime especulativo | diff, contrato e revisão documental |

SC-001–SC-007 e SC-009 têm cenários automatizáveis detalhados em [quickstart.md](./quickstart.md). Automação não substitui a parcela humana de SC-007 nem SC-008.

## Implementation Phases

1. Criar contrato/tipos e testes RED da projeção mínima, coordenadas e tupla confirmada.
2. Implementar serviço de leitura sobre `authorizeLaboratoryAccess`, sem schema, migration ou cache.
3. Implementar handler GET injetável com erros sanitizados e `no-store`; validar o OpenAPI.
4. Extrair somente a configuração genérica de tiles e preservar o mapa de ponto da IMP-003.
5. Implementar rota, máquina de estados, lista/painel e mapa agregado cliente com fit, seleção, fallback e atribuição.
6. Conectar navegação contextual, retirar o placeholder/legenda de risco não sustentados e completar interface/E2E.
7. Executar matriz de segurança, acessibilidade automatizável, responsividade, desempenho proporcional e regressões IMP-003/004; registrar separadamente as validações humanas pendentes.

## Future Reconciliation Points

### IMP-005 — dados ambientais

O HEAD publicado planeja um `EnvironmentalMeasurementSet` único, imutável e vinculado à coleta, mas não prova integração. Depois do merge real, reler schema, DTO, rota, `confirmedAt`, versão, autorização e privacidade. Uma extensão territorial só pode usar projeção, unidade, precisão, legenda e retorno ao registro aprovados; payload, autoria, chave e hash não entram por antecipação.

### IMP-006 — diagnóstico IHFR

O HEAD publicado possui somente spec/checklist e gates G1–G3 abertos. Depois de implementação, integração e aceite científico/operacional, reler o contrato efetivo e decidir elegibilidade, data, destino, precisão, legenda e simbologia. Até lá não existe score, classe, risco, cor, gráfico ou diagnóstico territorial.

### IMP-007 — dashboard e histórico

O dashboard publicado exclui coordenadas e não é fonte do mapa. Após integração, harmonizar apenas navegação/layout contextual e, se útil, helpers de contexto já integrados. Mapa e dashboard mantêm endpoints, estados e projeções independentes sobre as mesmas fontes; nenhum persiste ou copia contagens do outro.

## Risks and Mitigations

| Risco | Mitigação planejada |
|---|---|
| Resposta tardia mistura laboratórios | abort, geração de request, limpeza antes de nova leitura e chave por `laboratoryId`. |
| IDs ou DTO viram atalho de autorização | guard na leitura e novamente em cada destino; `404` indistinguível. |
| Query inclui linha parcial/legada | filtro pela tupla completa de confirmação da IMP-004. |
| Coordenada corrompida quebra o mapa | validação server-side, `location: null` e lista textual. |
| Tile ou Leaflet derruba a visão | limites de erro independentes; lista/painel fora do mapa; tiles não alteram estado de dados. |
| Marcadores coincidentes ficam ambíguos | cada marker conserva identidade/teclado; lista distingue todos; sem cluster/jitter inventado. |
| DTO territorial vaza PII/ciência | `select` e schema fechados, testes de campos proibidos e `no-store`. |
| Volume futuro torna resposta integral pesada | medir matriz proporcional; não truncar; abrir decisão de paginação/agregação somente com evidência. |
| Contratos de 005/006/007 mudam ao integrar | zero adaptadores/placeholders agora e checklist de reconciliação por commit integrado. |
| Uso indevido de OSM público | configuração substituível, atribuição, sem prefetch/offline/testes e gate operacional de produção. |

## Deferred Possibilities

Permanecem `PENDENCIA_DE_DECISAO`, sem tipos, endpoints, flags ou placeholders: polígonos/linhas/buffers; localização própria da coleta; filtros/busca; clustering/deslocamento; camadas/heatmap; simbologia científica; dados ambientais; IHFR; comparação temporal; desenho/edição/medição; compartilhamento/exportação; generalização de precisão; acesso público; cache/offline de tiles; PostGIS, Plotly, Python ou nova biblioteca.

## Complexity Tracking

Não aplicável: o desenho reutiliza as camadas e dependências integradas, não altera persistência e não viola os gates constitucionais.
