# Pesquisa técnica: Dashboard e histórico básico

## Estado e fontes

- `DECISAO_CONFIRMADA` — a spec da IMP-007 limita o incremento a resumo e histórico derivados de áreas e coletas confirmadas integradas.
- `EVIDENCIA_IMPLEMENTACAO` — branch inspecionada: `007-dashboard-history` em `df87b2efa7ad37a4ac69316e042384d7dfc0e4fb`.
- `EVIDENCIA_IMPLEMENTACAO` — `origin/development` avançou para `5d9ca6f8f848867e8152bc25e86abc9a6e73358f` e foi incorporada à branch por merge normal sem conflitos.
- `EVIDENCIA_IMPLEMENTACAO` — IMP-003 `106e25f984df56384896729bf786e44104166570` e IMP-004 `7c977147797ca8a8c167033fee6e7a8ab46f673f` estão integradas.
- `EVIDENCIA_IMPLEMENTACAO` — a IMP-005 está integrada e implementa captura/leitura imutável de `EnvironmentalMeasurementSet`; a IMP-006 permanece publicada, mas não integrada.
- `FATO_DOCUMENTADO` — a primeira análise cruzada dos artefatos foi concluída e seus sete findings foram remediados documentalmente em 2026-09-17; uma nova análise independente permanece pendente.

## R-001 — Dashboard contextual

**Decision**: criar `/dashboard/laboratories/{laboratoryId}` como landing do laboratório e manter `/dashboard` redirecionando para `/workspace`, onde a seleção é explícita.

**Rationale**: hoje o acesso no workspace leva diretamente às áreas; o layout contextual já revalida vínculo, mostra nome/estado/papel e preserva o laboratório na URL. A nova landing entrega o resumo sem inventar contexto global implícito.

**Alternatives considered**:

- dashboard global com laboratório “atual”: rejeitado porque não existe seleção persistida confiável e FR-001 exige escolha explícita;
- manter áreas como landing e inserir resumo ali: rejeitado por misturar responsabilidades e dificultar falhas independentes;
- reutilizar `/dashboard/collects`: rejeitado porque a rota apenas redireciona e não é contextual.

## R-002 — Projeção sem persistência paralela

**Decision**: calcular resumo e histórico diretamente de `LaboratoryRoom`, `ResearchersLinked`, `CollectionArea` e `CollectionData`, sem model ou tabela de atividade.

**Rationale**: não existe auditoria integrada. A projeção transitória acompanha automaticamente acesso, correção, remoção e retenção das fontes, satisfazendo FR-014.

**Alternatives considered**:

- persistir `ActivityLog`: rejeitado por duplicar a verdade e inventar retenção/eventos;
- transformar `updatedAt` em eventos: rejeitado porque não registra verbo, autor nem causa confiável;
- conservar snapshot na UI: rejeitado por poder sobreviver à perda de acesso.

## R-003 — Fontes, datas e estados reais

**Decision**:

- `AREA_CREATED` usa `CollectionArea.createdAt`;
- `COLLECTION_CONFIRMED` usa `CollectionData.confirmedAt`;
- `occurredAt` é contexto secundário da coleta;
- nome/estado vêm de `LaboratoryRoom.name/isActive`;
- nenhum outro evento ou estado é projetado.

**Rationale**: são os únicos instantes que correspondem diretamente aos dois acontecimentos autorizados. `confirmedAt` é definido pelo servidor; `occurredAt` representa ocorrência em campo. `CollectionArea.isActive` existe, mas não é filtrado nem publicado pelo contrato integrado de áreas, logo não autoriza inferir “ativação” ou exclusão lógica.

**Alternatives considered**:

- ordenar coleta por `occurredAt`: rejeitado por mudar o significado de confirmação;
- usar `createdAt` técnico da coleta: rejeitado porque a confirmação possui campo próprio;
- usar `updatedAt`: rejeitado por sugerir auditoria inexistente.

## R-004 — Critério de inclusão

**Decision**: incluir todas as áreas do laboratório que a listagem integrada considera acessíveis e somente coletas cuja tupla `occurredAt`, `occurrenceOffset`, `confirmedAt` e `confirmationKey` esteja completa.

**Rationale**: a listagem de áreas não filtra `isActive`. O detalhe de coleta exige a tupla completa e a migration integrada garante tudo nulo ou tudo preenchido; repetir o predicado mantém defesa e compatibilidade com registros legados.

**Alternatives considered**:

- filtrar áreas por `isActive`: rejeitado por não existir semântica integrada que torne áreas inativas inacessíveis;
- considerar toda `CollectionData`: rejeitado porque linhas legadas/parciais não possuem confirmação ou destino legível;
- testar apenas `confirmedAt`: semanticamente suficiente sob a constraint, mas a tupla completa foi preferida para alinhar com o detalhe e falhar fechado diante de drift.

## R-005 — Autorização e isolamento

**Decision**: cada leitura chama `authorizeLaboratoryAccess(principal, laboratoryId, "READ_AREAS", tx)` e depois filtra todas as queries por `laboratoryRoomId`; detalhes continuam usando a cadeia contextual integrada.

**Rationale**: o guard revalida conta `ACTIVE`, vínculo e estado em cada chamada, permite leitura inativa e produz `NOT_FOUND` uniforme para ID inválido/sem vínculo. Autoria, papel global e posse histórica não concedem acesso.

**Alternatives considered**:

- confiar no layout ou em contexto do cliente: rejeitado porque acesso pode mudar entre renderização e leitura;
- usar apenas `LaboratoriesService.details`: rejeitado porque não fornece o contrato completo de papel/read-only nem substitui o guard;
- filtrar depois de buscar por ID: rejeitado por risco de inferência cruzada.

## R-006 — Endpoints independentes e cache

**Decision**: expor `summary` e `history` em GETs independentes, ambos com `Cache-Control: no-store`, e usar fetch `no-store` em componentes separados.

**Rationale**: permite loading, erro e retry por região, como exige a spec, e segue os contratos integrados. Não haverá cache partilhado, persistência cliente ou stale fallback.

**Alternatives considered**:

- um único envelope: rejeitado porque uma falha impede distinguir sucesso parcial;
- Server Component único: rejeitado porque o boundary de erro/loading seria comum e retry parcial ficaria artificial;
- cache/revalidate: rejeitado porque a feature exige refletir retorno/refresh e limpar dados após perda de acesso.

## R-007 — Paginação keyset da união

**Decision**: ordenar por `eventAt DESC`, `typeRank ASC` (`AREA_CREATED=0`, `COLLECTION_CONFIRMED=1`) e `sourceId DESC`; buscar até 21 candidatos por fonte após o cursor, mesclar e devolver 20.

**Rationale**: Prisma não oferece união tipada entre models. Duas consultas limitadas evitam carga integral e, com predicado lexicográfico por fonte, preservam uma ordem total determinística quando as fontes não mudam. O cursor inclui versão e a última chave, é validado, mas não é credencial nem snapshot. Uma inserção mais recente feita entre páginas não entra na continuação para itens mais antigos; voltar ou atualizar reconsulta a parte correspondente e pode refletir a inserção. Testes unitários e E2E devem caracterizar essa semântica sem prometer isolamento de snapshot.

**Alternatives considered**:

- offset: rejeitado por duplicar/omitir sob inserções e não compor bem duas tabelas;
- carregar tudo e paginar no cliente: rejeitado por consulta/payload sem limite;
- SQL `UNION ALL` raw: executável, mas rejeitado inicialmente porque aumenta superfície de SQL manual sem necessidade comprovada;
- timestamp sem desempate: rejeitado por SC-003.

## R-008 — DTO mínimo e destinos

**Decision**: retornar contexto mínimo, contagens, tipo/instantes, área mínima, ID opcional da coleta e `href` contextual construído pelo servidor. Não selecionar nem serializar autores ou dados científicos.

**Rationale**: os detalhes reais exigem a cadeia laboratório → área → coleta. O servidor já possui todos os IDs obtidos sob filtro autorizado; devolver o destino evita construção genérica e mantém uma ativação até a origem.

**Alternatives considered**:

- expor objetos de Prisma: rejeitado por PII/campos internos;
- expor autor “para contexto”: rejeitado expressamente por FR-013;
- link genérico por `referenceId`: rejeitado porque o mock atual aponta a rota inexistente e perde contexto.

## R-009 — Interface, acesso perdido e laboratório inativo

**Decision**: limpar dados ao iniciar nova leitura, abortar requests quando `laboratoryId` muda, comunicar estados textualmente e omitir mutações em laboratório inativo. `401/404` não mantêm conteúdo anterior e oferecem retorno ao seletor; detalhes revalidam seus próprios guards.

**Rationale**: o padrão com `AbortController`, loading/error/empty e retry já existe em `AreaList`. O layout contextual é dinâmico e o guard permite leitura inativa.

**Alternatives considered**:

- manter dados stale durante retry: rejeitado por poder revelar laboratório anterior ou acesso revogado;
- desabilitar link em vez de omitir ações mutáveis: rejeitado porque pode sugerir permissão existente;
- bloquear toda leitura inativa: rejeitado por contrariar o contrato integrado e FR-011.

## R-010 — Índices e coerência

**Decision**: não planejar migration no incremento mínimo. Limitar projeções e registrar a ausência de índice `CollectionData(laboratoryRoomId, confirmedAt, id)` como risco a medir na implementação; propor otimização separada apenas com evidência.

**Rationale**: áreas já têm índice `(laboratoryRoomId, createdAt)`; coletas não têm o índice ideal lab-wide. Não há volume ou meta de latência autorizados, e uma migration especulativa ampliaria o recorte. Cada resposta usa transação de leitura para autorizar e consultar; resumo e histórico não prometem snapshot conjunto entre endpoints.

**Alternatives considered**:

- adicionar índice agora: rejeitado sem evidência de escala/latência e por não ser necessário para correção;
- consulta ilimitada: rejeitada independentemente de índice;
- snapshot compartilhado entre endpoints: rejeitado por exigir coordenação/cache desnecessários.

## R-011 — Dependências futuras

**Decision**: criar apenas pontos de reconciliação documental; nenhum adaptador, enum ou placeholder de runtime para IMP-005/006 entra no mínimo.

**Rationale**: a IMP-005 agora possui código integrado, mas o recorte aprovado da IMP-007 continua limitado a áreas e coletas. Sua exclusão é decisão de escopo e uma extensão posterior pode usar `confirmedAt` e o destino contextual já existentes. A IMP-006 não possui contrato técnico integrado e mantém gates científicos/operacionais.

**Alternatives considered**:

- reservar tipos/eventos futuros no contrato atual: rejeitado por antecipar disponibilidade;
- bloquear o mínimo até IHFR: rejeitado pela constituição e pela spec;
- ler models científicos legados: rejeitado porque schema não prova contrato aprovado nem fluxo integrado.

## R-012 — Validação proporcional

**Decision**: combinar unidade, contrato, integração e E2E; executar regressões IMP-003/004 na implementação; verificar separadamente com tecnologia assistiva real a parcela humana de SC-008. SC-009 permanece avaliação moderada humana posterior e distinta.

**Rationale**: merge/cursor e privacidade são determinísticos em unidade; autorização/HTTP exigem integração; navegação, estados, teclado, ARIA e viewports possuem cobertura automatizável em E2E. Playwright não substitui interação com tecnologia assistiva real, assim como automação não simula resultado de pesquisa moderada.

**Alternatives considered**:

- somente E2E: rejeitado por baixa precisão para algoritmo de cursor;
- somente unidade: rejeitado por não provar handlers, navegação ou isolamento conectado;
- declarar SC-008 aprovada apenas por Playwright: rejeitado por não produzir evidência de tecnologia assistiva real;
- declarar SC-009 aprovado por inspeção: rejeitado por falta de participantes/evidência.

## Conclusão da pesquisa

Todas as incertezas técnicas necessárias ao mínimo foram resolvidas sem `NEEDS CLARIFICATION`. A ausência de política institucional de retenção e os contratos futuros não bloqueiam o desenho porque a IMP-007 não persiste histórico próprio e expõe apenas fontes atualmente autorizadas.
