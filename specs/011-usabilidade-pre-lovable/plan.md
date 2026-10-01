# Implementation Plan: Usabilidade pré-Lovable

**Branch**: `fix/usabilidade-pre-lovable` | **Date**: 2026-10-01 | **Spec**: [spec.md](spec.md)
**Estado**: CONCLUIDO no recorte de implementação/verificação focal; publicação final conforme mandato. Commit documental prévio `f8b2a4755aa14f1543cd0bdd656c1c30c9b89f0a` publicado e SHA remoto confirmado antes da criação da branch.

## Summary

Logout no TopBar apenas do workspace, responsivo; dashboard mantém Sidebar e administração mantém AdminShell. Data/hora nativa com offset explícito, inicialização somente no browser, adapter separado e formatação portuguesa determinística do offset registrado. Sete rótulos tipados conforme ADR, ajuda textual visível. Sem alterações de banco, dependências ou contratos API.

## Technical Context

TypeScript, Next.js 16.3.6/App Router, React 19.2.4; Node 24.19.0. PostgreSQL/Prisma existentes preservados. Testes node:test/tsx e navegador Playwright já instalado. UI desktop/móvel; sem nova integração externa. Conversão não trunca segundos/milissegundos; mesma chave na falha. Descrições científicas por categoria aguardam critérios de campo.

## Constitution Check

PASS antes/depois do design: mandato atual registrado; um recorte de estabilização com três histórias independentes autorizado em branch única; rastreabilidade às IMP-001/004/006; regras científicas, fontes históricas e alterações preexistentes preservadas; checks proporcionais. Nenhuma decisão de ciência/arquitetura nova. Geocodificação e rascunhos adiados. Sem hooks `.specify/extensions.yml`. Não há desconhecidos que exijam pesquisa delegada: fontes locais fecham o recorte técnico.

## Project Structure

Artefatos: spec, checklist, plan, research, data-model, contracts/ui, quickstart, tasks e implementation-evidence neste diretório.
Código: `src/components/top-bar/index.tsx`; `src/app/(private)/workspace/layout.tsx`; `src/components/collections/{collection-form-state,collection-form,collection-review,collection-detail}.tsx` (estado .ts); adapter `src/lib/collection-date-time.ts`; uso da terra em `src/components/ihfr-diagnosis/ihfr-diagnosis-management.tsx` e dicionário `land-use-labels.ts`. Consulta ambiental/mapa usa formatação comum. Testes focais em `tests/unit/` e navegador offline sem banco em `tests/ui/`.

## Complexity Tracking

Sem violação material. Scripts Spec Kit retornam identificador lógico 011-usabilidade-pre-lovable; branch Git permanece a sugerida pelo usuário. Testes offline de componentes reais exercitam fetch e navegação simulados; não serão apresentados como sessão/DB reais.

## Validation and Execution

Executar tarefas por história; teclado/móvel, sucesso/falha logout, campos e payloads em fusos distintos; suíte unitária, typecheck, lint e build. Testes existentes que exigem banco devem passar preflight de isolamento; se impedidos, registrar ambiente separadamente. Relatórios históricos ficam intactos; atualizar plano transversal/análise e publicar branch sem merge/deploy.


## Resultado

Três histórias implementadas; 11 tarefas concluídas. Checklist de qualidade 16/16; hooks ausentes. 255 unitários, 7 testes de rotas e 12 cenários offline de navegador PASS; typecheck/lint e build Webpack PASS. Build padrão bloqueado por porta do Turbopack e integração PostgreSQL interrompida no preflight sem confirmação. Arquivos, comandos, falhas intermediárias e limites completos em [implementation-evidence.md](implementation-evidence.md). Merge/deploy e prompt não realizados; relatórios históricos preservados.
