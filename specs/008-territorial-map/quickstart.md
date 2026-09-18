# Quickstart: Validação do mapa territorial

**Feature**: IMP-008

**Purpose**: guia de validação para a futura implementação; nenhum comando deste documento foi executado durante `$speckit-plan`.

## 1. Prerequisites

- branch de implementação baseada no commit que contém estes artefatos;
- Node.js 20.19.2 e dependências já travadas no repositório;
- banco de teste descartável e variáveis E2E protegidas pelos guards existentes;
- fixtures com IDs/prefixos allowlisted e teardown verificável;
- para teste manual com base cartográfica, `NEXT_PUBLIC_MAP_TILE_URL` e `NEXT_PUBLIC_MAP_ATTRIBUTION` de provedor aprovado;
- testes automatizados não devem usar tiles públicos.

Leia antes de validar:

- [spec.md](./spec.md);
- [plan.md](./plan.md);
- [data-model.md](./data-model.md);
- [territorial-map-api.openapi.yaml](./contracts/territorial-map-api.openapi.yaml).

## 2. Static and contract checks

Depois da implementação, executar:

```bash
npm run typecheck
npm run lint
npm run test:unit
npm run test:integration
git diff --check
```

Resultados esperados:

- OpenAPI 3.1 parseia, possui refs locais resolvidas e exatamente `getTerritorialMap`;
- `components.securitySchemes.cookieAuth` usa `type: apiKey`, `in: cookie` e `name: auth_token`, e a exigência global `security: [{ cookieAuth: [] }]` protege a operação sem override público;
- objetos do contrato são fechados;
- a API possui somente GET e os status `200/401/404/500`;
- todas as respostas declaram `Cache-Control: no-store`;
- DTO não contém `userId`, autoria, email, avatar, `accessCode`, observações, descrição, `confirmationKey`, dados ambientais ou IHFR;
- typecheck/lint não introduzem regressão no mapa da IMP-003.

## 3. Fixture matrix

Preparar no mínimo dois laboratórios e cinco áreas:

| Contexto | Área | Localização | Coletas elegíveis | Casos adicionais |
|---|---|---|---:|---|
| Lab A ativo | A1 | válida | 0 | OWNER |
| Lab A ativo | A2 | válida | 1 | MEMBER |
| Lab A ativo | A3 | mesma coordenada de A2 | 3 | linha parcial extra, não contar |
| Lab A ativo | A4 | indisponível/corrompida por fake controlado | 2 | sem marker |
| Lab B inativo | B1 | válida | 1 | leitura `readOnly` |

Adicionar:

- uma conta inelegível;
- um vínculo revogado;
- um participante sem vínculo com Lab B;
- coordenadas de fronteira `-90/90/-180/180` em testes unitários;
- nomes longos e IDs distintos em pontos coincidentes.

O cenário SC-001 usa pelo menos seis coletas confirmadas distribuídas entre os dois laboratórios. Dados de outro laboratório devem totalizar zero no payload corrente.

## 4. API scenarios

### 4.1 Authorized active laboratory

Solicitar:

```text
GET /api/laboratories/{labA}/territorial-map
```

Esperar:

- `200` e `Cache-Control: no-store`;
- contexto de Lab A, papel atual e `readOnly: false`;
- A1–A4 exatamente uma vez, em ordem determinística;
- A2 e A3 preservadas como registros distintos embora coincidam;
- A4 com `location: null`;
- somente coletas com a tupla IMP-004 completa;
- contagens deriváveis pelo tamanho dos arrays;
- nenhuma coordenada no objeto da coleta.

### 4.2 Inactive laboratory

Solicitar o endpoint de Lab B com vínculo atual.

Esperar `200`, dados legíveis, `status: INACTIVE`, `readOnly: true` e nenhuma ação de mutação na interface.

### 4.3 Access matrix

| Caso | Resultado |
|---|---|
| sem sessão/conta inelegível | `401`, erro sanitizado, zero dado |
| UUID inválido | `404`, mesmo envelope de recurso ausente |
| laboratório inexistente | `404` |
| vínculo ausente/revogado | `404` indistinguível |
| identificador de outro laboratório | `404`, sem nome/contagem/coordenada |
| falha inesperada injetada | `500` sanitizado, sem stack/SQL |

Comprovar que a autorização ocorre antes da query territorial e se repete em cada leitura.

## 5. Interface scenarios

Executar a futura spec E2E dedicada:

```bash
npx playwright test tests/e2e/territorial-map.spec.ts
```

### 5.1 P1 — áreas e navegação

1. Abrir `/dashboard/laboratories/{labA}/map`.
2. Confirmar carregamento sem zero/vazio falso.
3. Confirmar identidade de Lab A, quatro itens textuais e três markers válidos.
4. Verificar que o enquadramento inicial torna todos os pontos válidos alcançáveis.
5. Selecionar A2 pelo marker e pela lista; o mesmo painel deve mostrar nome, coordenadas, contagem e link.
6. Ativar o detalhe da área uma vez e verificar a rota contextual existente.
7. Trocar para Lab B e confirmar que nenhum dado de Lab A permanece.

### 5.2 P2 — coletas confirmadas

1. Selecionar A1, A2 e A3.
2. Confirmar estados textuais de zero, uma e múltiplas coletas.
3. Verificar ocorrência e confirmação sem autoria/observação/chave.
4. Ativar cada coleta e verificar `/dashboard/laboratories/{lab}/areas/{area}/collections/{collection}`.
5. Confirmar que a linha parcial não aparece nem altera contagem.
6. Confirmar que não existe marker adicional para coleta.

### 5.3 P2 — estados e falhas

Executar separadamente:

- API pendente: loading perceptível;
- resposta `areas: []`: vazio verdadeiro;
- `500` e falha de rede: erro sanitizado e retry;
- retry bem-sucedido: dados atuais, sem mock/stale;
- A4: “localização indisponível”, sem marker, com links preservados;
- configuração de tiles ausente: mensagem separada e lista normal;
- abortar todas as requests de tile no Playwright: estado de base indisponível, atribuição preservada se a camada foi montada e todos os destinos funcionais;
- falha cartográfica injetada no boundary: fallback do mapa sem remover lista/painel;
- resposta atrasada de Lab A após navegação para Lab B: resposta ignorada.

Nunca transformar tile isolado em erro de dados. Para ciclo com ao menos um tile carregado e um falho, esperar estado degradado, não indisponibilidade completa.

### 5.4 P3 — keyboard, semantics and viewports

Nas larguras 320, 768 e 1280 px:

- percorrer toda a página somente por teclado;
- confirmar foco visível em markers, seletores, links e retry;
- usar Enter em marker e item textual e obter a mesma seleção;
- verificar nomes acessíveis únicos dos markers;
- confirmar `ul/li`, headings, `role=status`/`role=alert` e anúncio de seleção;
- confirmar que A2/A3 continuam alcançáveis por teclado/lista apesar da sobreposição;
- confirmar ausência de rolagem horizontal do conteúdo principal;
- confirmar atribuição visível e legível quando tiles aparecem.

## 6. Performance validation

Nenhum resultado numérico está pré-aprovado. A implementação deve registrar comandos, ambiente e resultados reais em `specs/008-territorial-map/implementation-evidence.md`.

### 6.1 Structural in-memory proof

Gerar fixture sintética protegida com 100 áreas e 1.000 coletas confirmadas no mesmo laboratório, além de ruído em outro laboratório.

Verificar:

- nenhuma consulta por área (sem N+1);
- seleção fechada de campos;
- zero linha de outro laboratório;
- payload integral sem truncamento;
- tamanho do JSON registrado como evidência, sem conter campos proibidos.

Esta prova roda em `tests/unit/territorial-map-service.test.ts`; ela não pode declarar p95 do endpoint, latência de PostgreSQL ou resultado de `EXPLAIN`.

### 6.2 Real endpoint and PostgreSQL measurement

Usar ambiente isolado, sem tráfego concorrente, com aplicação no commit avaliado e PostgreSQL de teste descartável. Registrar versão de Node.js e PostgreSQL, modo de execução, recursos de CPU/memória disponíveis, commit, configuração não sensível e comandos reproduzíveis. Preparar no banco o mesmo laboratório com 100 áreas e 1.000 coletas confirmadas, além de ruído em outro laboratório; não reutilizar dados pessoais ou ambiente de produção.

Procedimento:

1. confirmar autorização contextual, payload integral e tiles fora da medição;
2. executar 10 leituras autenticadas de aquecimento, sem incluí-las na estatística;
3. executar 100 leituras autenticadas sequenciais do endpoint e calcular p95 sobre essas 100 durações, usando relógio monotônico;
4. comparar o p95 observado com a meta técnica do plano de até 500 ms, sem declarar SLA;
5. executar `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)` da mesma projeção parametrizada, somente no PostgreSQL descartável, e registrar plano, cardinalidades e buffers sem dados sensíveis;
6. medir a lista interativa até a meta técnica de 2 s após a resposta, sem aguardar tiles;
7. registrar valores, ambiente, limitações, tamanho do JSON e evidências em `specs/008-territorial-map/implementation-evidence.md`.

Falha da meta não autoriza automaticamente índice, paginação ou cluster: registrar evidência e decidir a menor otimização sem comprometer FR-012.

## 7. Regression suite

Na fase de implementação, executar também:

```bash
npm run test
npx playwright test tests/e2e/area-registration.spec.ts
npx playwright test tests/e2e/area-viewing.spec.ts
npx playwright test tests/e2e/collection-registration.spec.ts
npm run build
```

Resultados esperados:

- cadastro/detalhe de área mantêm mapa de ponto, configuração e fallback;
- detalhe/coleta mantêm rotas, temporalidade, `no-store` e autorização;
- nenhum schema/migration/dependência foi alterado pela IMP-008;
- placeholder/legenda de risco antigos não participam da nova rota.

## 8. Human validation still required

Não declarar antecipadamente:

- a parcela de SC-007 que exige tecnologia assistiva real;
- SC-008, que exige teste moderado com participantes representativos.

Registrar ambiente, tecnologia assistiva, procedimento, participantes autorizados, resultado por cenário e limitações. Essas avaliações são posteriores ao incremento executável e independentes da aprovação estática deste plano.

## 9. Stop conditions

Interromper a implementação e reconciliar antes de continuar se:

- `origin/development` passar a conter contratos incompatíveis de área/coleta;
- a tupla de confirmação ou o guard integrado mudar;
- a implementação exigir truncar áreas sem decisão de UX/produto;
- uma extensão ambiental/IHFR for solicitada antes de sua integração e aprovação aplicável;
- produção depender do servidor público OSM sem provedor/política aprovados.
