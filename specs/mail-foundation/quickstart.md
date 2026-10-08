# Validação rápida

Instalação reproduzível: `npm ci`, `npx prisma generate`. Consulte [runbook](../../docs/operations/mail-runbook.md) antes de configurar qualquer ambiente.

Testes focais: `npm run test:mail:unit`. PostgreSQL real pelo harness existente: primeiro `./scripts/mail-validation.ps1 -Gate RegressionSetup`, depois `./scripts/mail-validation.ps1 -Gate Integration`; gates `Migration` e `Contract` usam schemas sintéticos isolados. O coletor evita que stderr informativo do npm interrompa PowerShell e redige a saída.

Worker: `npm run mail:worker`; diagnóstico de conexão: `npm run mail:verify`; smoke autorizado: `npm run mail:smoke`. Nenhum deles usa fake como fallback. Configuração incompleta termina com erro redigido, sem afetar import/build de páginas independentes.

Aceite completo inclui regressão unit/integration/contract/migration/E2E/E2E HTTPS, typecheck/lint/build, instalação limpa, revisão e smoke Gmail. Consulte [evidência](implementation-evidence.md) para resultados reais; os comandos acima não implicam PASS.
