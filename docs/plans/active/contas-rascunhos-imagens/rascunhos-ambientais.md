# Rascunhos ambientais

## Dois escopos que não devem ser confundidos

| Escopo | Objeto | Estado |
|---|---|---|
| A — medições de coleta confirmada | payload parcial de água/solo/vegetação/terreno para `CollectionData` existente | `RECOMENDACAO` para primeiro recorte. |
| B — metadados antes de criar coleta | data/hora/observações e contexto ainda sem `CollectionData` | extensão futura independente. |

O recorte A atende diretamente ao preenchimento ambiental e preserva a coleta confirmada e a IMP-005.

## Propriedade e permissão recomendadas

- Um rascunho ativo pessoal por `(userId, collectionDataId)`.
- Criar/ler/editar/descartar/confirmar: dono `ACTIVE`, com vínculo atual e permissão atual para dados ambientais; laboratório precisa estar ativo para mutação.
- Outro membro não lê nem continua o rascunho no primeiro recorte. Compartilhamento exige decisão sobre autoria, conflito e privacidade.
- Perda de vínculo, conta bloqueada, área/coleta fora do contexto ou laboratório inativo bloqueia mutação; leitura/exportação excepcional depende de política.

## Payload parcial

Persistir envelope versionado, não forçar `EnvironmentalPayload` completo:

```json
{"formVersion":"environmental-draft-v1","fields":{"soil.infiltrationRateMmH":{"kind":"editing","raw":"12."},"water.hasSpring":{"kind":"value","value":false},"terrain.elevationM":{"kind":"absent"}}}
```

`PROPOSTA`: `absent` significa não informado; `editing.raw` preserva texto temporariamente inválido/decimal incompleto; `value` preserva `0` e `false`; vazio explícito pode remover um campo. O servidor limita chaves, tipos e tamanho, mas não aplica todos os requisitos de confirmação ao save.

Mudança de `formVersion` exige migrador explícito ou tela de revisão; não descartar nem reinterpretar silenciosamente campos antigos.

## UX de salvamento

Primeiro recorte: botão “Salvar rascunho”, não autosave obrigatório. Estados `Alterações não salvas`, `Salvando…`, `Salvo às HH:mm`, `Conflito` e `Falha ao salvar`; `aria-live` sem excesso. Ao sair com mudanças locais, aviso claro. Reload/outro dispositivo recupera apenas save persistido.

Autosave futuro pode usar debounce, abort de requests obsoletos e flush explícito, mas não deve ser presumido requisito. `localStorage` pode manter somente recuperação efêmera não sensível e nunca substitui o servidor; suporte offline está fora do escopo.

## Concorrência e promoção

- Cada resposta traz `revision`; PUT exige `expectedRevision`.
- Revisão obsoleta retorna 409 e cópia atual autorizada; usuário escolhe recarregar ou comparar. Não há last-write-wins silencioso.
- Confirmação recebe chave idempotente, revalida o contrato completo vigente e executa serializável/retry compatível com IMP-005.
- Se conjunto já foi confirmado: mesma operação/payload recupera resultado; outro payload retorna conflito e mantém o draft para decisão/arquivo.
- Editar versus confirmar: confirmação condiciona status/revisão; após `CONFIRMED`, edits falham terminalmente.
- Rede perdida depois do commit: repetir consulta operação/conjunto e não duplica.

## Retenção e exclusão

`PROPOSTA`: expirar após 30 dias sem edição, aviso visual a partir de 7 dias antes, descarte pelo usuário com período técnico curto de recuperação somente se aprovado, purge idempotente. Guardar métricas agregadas, não payload, depois do purge. Dados confirmados jamais são modificados ou apagados pelo cleanup de drafts.

Rascunhos ficam fora de dashboard, histórico de registros, mapas, elegibilidade e diagnósticos IHFR. A confirmação normal pode atualizar essas projeções porque cria o conjunto confirmado regular.
