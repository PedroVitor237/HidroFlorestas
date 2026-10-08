# Handoff para implementação futura

## Antes de começar

1. Leia este pacote na ordem do [readme](readme.md), depois `AGENTS.md`, contexto, decisões, constituição e política de fontes atuais.
2. Atualize referências e registre branch, HEAD, upstream, worktree e alterações preexistentes. Não presuma que `cfda9df` ainda seja a base adequada.
3. Reconfira código, schema, migrations, dependências, versões, deploy e contratos consumidos pelo frontend/Lovable.
4. Resolva somente a pendência que bloqueia a etapa corrente, com origem, data, autoridade e recorte. Não promova recomendações deste pacote.
5. Crie/reconcilie spec, plano e tasks por funcionalidade usando as skills instaladas; não use este pacote como substituto nem crie requisito divergente.

## Decisões necessárias por início

- Verificação: `PD-CRI-001`, `PD-CRI-002` e normalização de e-mail.
- E-mail real: `PD-CRI-003/004`, conta Gmail de teste/operação, cron e secrets.
- Recuperação: política de senha, elegibilidade de não verificados e comunicação.
- Draft: `PD-CRI-005/006`, retenção e ownership.
- Imagem: `PD-CRI-007–010`, especialmente exposição pública e limites/quota.

## Checklist de implementação

- [ ] Baseline e preflight sem PII/secrets.
- [ ] Threat model e DTOs allowlisted.
- [ ] Migrations aditivas testadas em PostgreSQL isolado.
- [ ] Autoridade revalidada server-side dentro das transações.
- [ ] Idempotência, concorrência e efeitos externos reconciliáveis.
- [ ] Fakes determinísticos; smoke real só em contas de teste.
- [ ] UI mínima com recuperação, teclado, foco, mobile e `aria-live`.
- [ ] Build/testes registrados por SHA/ambiente/data, sem reaproveitar PASS histórico.
- [ ] Nenhuma conta real, e-mail real ou asset existente removido para facilitar fixture.
- [ ] Registros canônicos atualizados somente quando autorizados.

## Reconciliação da base

Se o cadastro, JWT, autoridade, modelo ambiental ou campo `CollectionArea.image` mudarem, refaça o baseline e ajuste os contratos. Preserve:

- estado/papel/vínculo atuais como autoridade, não claims antigos;
- dados ambientais confirmados imutáveis e separados de drafts;
- no máximo um conjunto ambiental confirmado por coleta;
- idempotência e isolamento entre laboratórios;
- diagnósticos apenas a partir de dados confirmados;
- IHFR `CONTRATO_EXPERIMENTAL`, `VALIDACAO_CIENTIFICA_PENDENTE`, `SUJEITO_A_RECALIBRACAO` e `NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO`.

## Critérios de conclusão futuros

Uma frente só termina quando comportamento, dados, autorização, concorrência, migrations, operação, UI mínima, testes e documentação correspondem à decisão aprovada. Cloudinary “subiu arquivo”, SMTP “aceitou mensagem” e build verde são evidências parciais, não conclusão isolada.

Integração Lovable deve adaptar a estrutura visual aos contratos implementados, nunca criar upload, sessão, estado ou permissão apenas no cliente. Qualquer nova exigência visual volta à spec/decisão correspondente.

## Estado desta entrega

Os 14 arquivos deste pacote são documentação de planejamento. Nenhuma funcionalidade, teste executável, migration, dependência, variável, envio real, upload real, banco, merge, deploy, push ou PR foi realizado. A branch documental contém somente commits locais do pacote e deve ser revisada antes de qualquer publicação futura.
