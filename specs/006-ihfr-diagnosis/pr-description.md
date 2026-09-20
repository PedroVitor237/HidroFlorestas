# Texto para a futura descrição do PR

## Contrato experimental do IHFR

- Fonte-base: `DOC-RAW-013` — `docs/raw/specificacao-do-ihfr-v0-1-mvp-contrato-matematico.md`, SHA-256 `d2382cf17561f557bbd70201875d08c554740a01bb31448f0d0713c8dd8f117a`.
- Fórmula selecionada: `IHFR = 0,25W + 0,25S + 0,25V + 0,25T`.
- Estado: `CONTRATO_EXPERIMENTAL`, `VALIDACAO_CIENTIFICA_PENDENTE`, `SUJEITO_A_RECALIBRACAO` e `NAO_APROVADO_COMO_CONTRATO_CIENTIFICO_DEFINITIVO`.
- Conflitos históricos: pesos, normalizações, limites, qualidade, APP, composição territorial, classes, precisão e ausências estão documentados e resolvidos somente para engenharia no [ADR-0001](../../docs/governance/ADR-0001-contrato-experimental-ihfr-v0-1.md).
- Alternativa regional: `0,35H + 0,30S + 0,25V + 0,10T` permanece preservada, inativa e dependente de calibração territorial própria.
- Compatibilidade: consome `ihfr-measurement-v1`, exige `slopePercent` e depende do suplemento imutável `ihfr-diagnosis-input-experimental-v0.1.0` para `landUseType`; drenagem, elevação, tamanho da área e `CollectionArea.landType` livre não substituem essa entrada.
- `landUseType`: `FOREST=0.2`, `AGROFORESTRY=0.25`, `CROPLAND=0.6`, `PASTURE=0.65`, `DEGRADED_PASTURE=0.8`, `BARE_SOIL=0.95`, `URBAN=0.7`; uso misto exige predominância, desconhecido é `INVALID_INPUT` e ausência é `INSUFFICIENT_DATA`. Decisão focal e alternativas: ADR-0001 §7.
- Versões: `mathContractVersion = ihfr-math-experimental-v0.1.0`; `algorithmVersion = ihfr-evaluator-ts-v0.1.0`.
- Hash: `contractHash = sha256:5285d52ec70e0b0f8a951d40dd54f052e02be1556dd310e3cef0b3b4f6bc684b`.
- Validação: os vetores desta entrega são técnicos e derivados do manifesto; vetores científicos, revisão especializada, calibração e testes de campo permanecem pendentes.
- Compromisso: evidência especializada ou de campo divergente produzirá nova versão/hash e novo diagnóstico, sem alterar resultados históricos.

## Integração territorial preservada

- A IMP-008 já está integrada pelo PR #27; seu mapa territorial Leaflet e sua lista textual permanecem preservados como projeção independente de áreas e coletas confirmadas.
- Esta entrega não adiciona score, classe, risco, cor, diagnóstico ou auditoria restrita ao mapa. Visualização territorial do IHFR permanece evolução futura com requisito, contrato e minimização próprios.
- Leaflet não executa nem substitui o cálculo IHFR. Coordenadas, projeções territoriais e `CollectionArea.landType` não substituem `landUseType` nem entradas científicas ausentes.
- Plotly permanece direção futura posterior à IMP-009 e não integra esta implementação.

Antes do futuro PR, T123 deve acrescentar links relativos para ADR-0001, manifesto, schema do suplemento, spec, plano, pesquisa, modelo de dados, OpenAPI, quickstart e evidência de implementação; T124 deve separar comandos realmente executados, evidências reaproveitadas, validações humanas pendentes e limitações, sem inventar resultados.
