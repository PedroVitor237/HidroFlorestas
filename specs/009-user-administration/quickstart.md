# Quickstart Validation Guide: Administracao de usuarios

Guia de evidencia futura; nao autoriza implementacao ou migration nesta fase.

## Prerequisites

- autorizacao explicita para implementar;
- banco de teste isolado, sem dados pessoais;
- duas contas ACTIVE+ADMIN e fixtures para demais papeis/estados e ADMIN apenas laboratorial;
- valores de runtime fornecidos fora de commits/logs.

## Automated Gates

```bash
npx prisma validate
npx prisma generate
npm run test:migration
npm run typecheck
npm run lint
npm run test:unit
npm run test:integration
npm run test:e2e
npm run build
```

Registrar cada gate separadamente; browser nao prova migration PostgreSQL nem validacao humana.

## Scenarios

1. **Read boundary**: lista/busca/filtros/detalhe como ADMIN e tentativas anonima, outros papeis e ADMIN laboratorial. Esperado: allowlist exclusiva, cursor estavel, campos proibidos ausentes.
2. **Status/session**: bloquear/inativar conta com sessao existente, testar proxima validacao, revisao obsoleta e no-op. Esperado: acesso negado, `409` para stale, um evento por sucesso e nenhum por no-op.
3. **Role**: promover outra conta, rebaixar ADMIN com sessao existente e tentar autoalteracao. Esperado: role atual revalidado; autoalteracao negada.
4. **Last-admin race**: duas requisicoes concorrentes tentam remover/desativar os dois ultimos ADMINs. Esperado: no maximo uma conclui e um ACTIVE+ADMIN permanece.
5. **Legacy preflight**: semear quatro classes `role/isAdmin`. Esperado: contradicoes bloqueiam automatismo e nunca concedem autoridade.
6. **Accessibility**: teclado em mobile/desktop por loading, vazio, detalhe, confirmacao, sucesso, erro e conflito. Esperado: foco logico/visivel, rotulos e anuncios textuais.

## Final Evidence

Registrar branch/commit, alvo de banco sem credenciais, migration, comandos/resultados, navegadores, inspecao de campos proibidos e gates humanos nao realizados. Confirmar ausencia de mudanca em `docs/raw/**`, IMP-006 e arquivos globais.

