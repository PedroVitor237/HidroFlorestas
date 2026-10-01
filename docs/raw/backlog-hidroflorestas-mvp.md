# BACKLOG — HIDROFLORESTAS (MVP)

**Estrutura: ÉPICOS → USER STORIES → CRITÉRIOS DE ACEITAÇÃO**

## EPIC 1 — Autenticação e Perfis de Usuário

**Objetivo:** permitir login e separar perfis básicos (admin/field_user).

### US1.1 — Login com email e senha

**Como** usuário  
**Quero** acessar a plataforma com email e senha  
**Para** utilizar as funcionalidades do sistema.

**Critérios de aceitação**

- Dado email/senha válidos, o usuário entra e é redirecionado ao Dashboard
- Dado email/senha inválidos, o sistema exibe mensagem de erro
- Sessão persiste enquanto o usuário estiver autenticado

### US1.2 — Controle de acesso por papel (role)

**Como** admin/field_user  
**Quero** permissões básicas por perfil  
**Para** restringir ações sensíveis.

**Critérios de aceitação**

- Admin vê todas as áreas e diagnósticos
- Field_user vê apenas suas áreas e diagnósticos
- API valida permissões no backend (não apenas no frontend)

## EPIC 2 — Cadastro e Gestão de Áreas (com Mapa)

**Objetivo:** criar/editar áreas com geometria e dados básicos.

### US2.1 — Criar área com dados básicos

**Como** usuário  
**Quero** cadastrar uma área  
**Para** realizar diagnósticos IHFR.

**Critérios de aceitação**

- Campos obrigatórios: nome da área, município, estado, uso da terra, geometria
- Área salva aparece na lista e no mapa
- Centróide (lat/lon) é armazenado automaticamente

### US2.2 — Desenhar polígono no mapa

**Como** usuário  
**Quero** desenhar o polígono da área no mapa  
**Para** registrar o perímetro.

**Critérios de aceitação**

- Usuário desenha polígono e salva
- Sistema calcula área (ha) (se implementado) ou permite input manual (MVP)
- Polígono fica visível ao reabrir a área

### US2.3 — Marcar ponto no mapa (modo simples)

**Como** usuário  
**Quero** marcar um ponto da área  
**Para** cadastrar rapidamente quando não houver perímetro.

**Critérios de aceitação**

- Ponto é salvo como geometria
- Área aparece no mapa como marcador

### US2.4 — Editar área cadastrada

**Como** usuário  
**Quero** editar dados da área  
**Para** corrigir informações.

**Critérios de aceitação**

- Usuário consegue atualizar dados básicos
- Alterações são persistidas e refletidas no mapa

## EPIC 3 — Coleta Modular de Dados Ambientais

**Objetivo:** permitir registrar dados de Água, Solo, Vegetação/Paisagem e Território.

### US3.1 — Criar diagnóstico (Survey)

**Como** usuário  
**Quero** criar um novo diagnóstico para uma área  
**Para** registrar a coleta de campo.

**Critérios de aceitação**

- Diagnóstico vincula area_id e user_id
- Registro inclui data e observações (opcional)

### US3.2 — Formulário módulo Água

**Como** usuário  
**Quero** preencher o módulo Água  
**Para** registrar condição hídrica.

**Critérios de aceitação**

- Campos obrigatórios: water_source_type, has_spring, water_availability
- Campos opcionais: well_depth_m, salinity_indicator
- Validações de enum e faixas (quando aplicável)

### US3.3 — Formulário módulo Solo

**Como** usuário  
**Quero** preencher o módulo Solo  
**Para** registrar condição do solo.

**Critérios de aceitação**

- Campos obrigatórios: soil_texture, infiltration_rate_mm_h, compaction_level, erosion_signs
- Campo opcional: soil_exposed_percent
- Validação: infiltration 0–60; solo exposto 0–100

### US3.4 — Formulário módulo Vegetação/Paisagem

**Como** usuário  
**Quero** preencher o módulo Vegetação  
**Para** registrar cobertura e paisagem.

**Critérios de aceitação**

- Campos obrigatórios: vegetation_cover_percent, fragmentation_level, landscape_degradation
- Campo opcional: has_riparian_app
- Validação: cobertura 0–100

### US3.5 — Formulário módulo Território/Contexto

**Como** usuário  
**Quero** registrar informações territoriais  
**Para** completar o cálculo do IHFR.

**Critérios de aceitação**

- Campos mínimos: land_use_type (obrigatório; já vem da área) e slope_percent (opcional no MVP)
- Validação: slope 0–45 (se preenchido)

### US3.6 — Salvamento incremental (rascunho)

**Como** usuário  
**Quero** salvar o diagnóstico como rascunho  
**Para** não perder dados em campo.

**Critérios de aceitação**

- Usuário pode salvar sem finalizar cálculo
- Diagnóstico marcado como “draft”
- Ao retornar, dados permanecem preenchidos

## EPIC 4 — Motor IHFR v0.1 (cálculo + classificação)

**Objetivo:** implementar o algoritmo IHFR v0.1 no backend com auditabilidade.

### US4.1 — Normalizar variáveis em escala de risco (0–1)

**Como** sistema  
**Quero** converter entradas em scores normalizados  
**Para** calcular as dimensões.

**Critérios de aceitação**

- Cada variável gera score conforme mapeamentos definidos
- Valores fora de faixa bloqueiam cálculo com erro claro

### US4.2 — Calcular dimensões W, S, V, T

**Como** sistema  
**Quero** calcular scores por dimensão  
**Para** compor o IHFR.

**Critérios de aceitação**

- Dimensão = média das variáveis válidas
- Se dimensão tiver <2 variáveis válidas, dimension_score = null

### US4.3 — Calcular IHFR final e classe

**Como** sistema  
**Quero** calcular ihfr_score e ihfr_class  
**Para** entregar diagnóstico.

**Critérios de aceitação**

- IHFR = média das dimensões válidas
- Classe conforme intervalos (baixo/moderado/alto/crítico)
- Se IHFR null → classe “insuficiente”

### US4.4 — Calcular data_quality

**Como** sistema  
**Quero** estimar qualidade dos dados  
**Para** sinalizar confiabilidade do diagnóstico.

**Critérios de aceitação**

- Baseado nos campos essenciais (5 itens)
- Resultado: high/medium/low

### US4.5 — Persistir audit trail completo

**Como** sistema  
**Quero** salvar inputs + scores + versão do algoritmo  
**Para** garantir rastreabilidade.

**Critérios de aceitação**

- Salvar raw inputs, component_scores, ihfr_score, class, data_quality
- Salvar algorithm_version “IHFR_v0.1”
- Registro recuperável via API

## EPIC 5 — Interpretação Automática e Recomendações

**Objetivo:** gerar explicação e recomendações baseadas nos drivers do risco.

### US5.1 — Selecionar drivers (2 piores componentes)

**Como** sistema  
**Quero** identificar as dimensões mais críticas  
**Para** explicar o resultado.

**Critérios de aceitação**

- Ordena dimensões válidas por score desc
- Retorna 2 drivers

### US5.2 — Gerar explicação automática (templates)

**Como** sistema  
**Quero** gerar explanation  
**Para** comunicar o “porquê”.

**Critérios de aceitação**

- Texto cita drivers selecionados
- Se data_quality = low, incluir aviso “diagnóstico preliminar”

### US5.3 — Gerar recomendações condicionais

**Como** sistema  
**Quero** gerar lista de recomendações  
**Para** orientar ações de recuperação.

**Critérios de aceitação**

- Recomendações mudam conforme classe e drivers
- Recomendações retornam como lista (array)

## EPIC 6 — Tela de Resultado IHFR

**Objetivo:** exibir resultado completo para o usuário.

### US6.1 — Exibir score, classe e componentes

**Como** usuário  
**Quero** visualizar resultado do IHFR  
**Para** entender o diagnóstico.

**Critérios de aceitação**

- Mostrar ihfr_score, ihfr_class
- Mostrar water/soil/vegetation/territory scores
- Mostrar data_quality e version

### US6.2 — Exibir explicação e recomendações

**Como** usuário  
**Quero** ver o porquê e o que fazer  
**Para** agir na área.

**Critérios de aceitação**

- Mostrar explanation
- Mostrar recomendações em lista
- Botões: “Salvar diagnóstico” e “Voltar ao dashboard”

## EPIC 7 — Dashboard e Histórico

**Objetivo:** sintetizar indicadores e mostrar evolução.

### US7.1 — Lista de áreas com último IHFR

**Como** usuário  
**Quero** ver minhas áreas e o último risco  
**Para** priorizar ações.

**Critérios de aceitação**

- Lista mostra área + última classe + data
- Clique leva ao detalhe/resultado

### US7.2 — Histórico de diagnósticos por área

**Como** usuário  
**Quero** ver histórico de diagnósticos  
**Para** acompanhar evolução.

**Critérios de aceitação**

- Listar diagnósticos por data
- Exibir evolução do IHFR (lista; gráfico opcional)

### US7.3 — Mapa no dashboard com cores por classe

**Como** usuário  
**Quero** ver as áreas no mapa com cores  
**Para** interpretar espacialmente.

**Critérios de aceitação**

- Áreas renderizadas no mapa
- Cor conforme classe IHFR
- Legenda visível

### US7.4 — Alertas automáticos (MVP simples)

**Como** usuário  
**Quero** receber alertas  
**Para** priorizar intervenção.

**Critérios de aceitação**

- Se IHFR ≥ 0.76, gerar alert “risco crítico”
- Se salinity_indicator = confirmed, gerar alert “risco salinização”
- Alertas aparecem no dashboard

## EPIC 8 — API e Integração Backend/Frontend

**Objetivo:** endpoints mínimos para o MVP.

### US8.1 — Endpoints de autenticação

- POST /auth/login
- GET /auth/me

**Critérios**

- JWT ou sessão segura
- validação de role

### US8.2 — Endpoints de áreas

- POST /areas
- GET /areas
- GET /areas/{id}
- PUT /areas/{id}

### US8.3 — Endpoints de diagnósticos e dados

- POST /surveys
- POST /surveys/{id}/water
- POST /surveys/{id}/soil
- POST /surveys/{id}/vegetation
- POST /surveys/{id}/terrain

### US8.4 — Endpoint de cálculo IHFR

- POST /surveys/{id}/compute-ihfr

**Critérios**

- retorna payload padrão (score, class, components, explanation, recommendations)

### US8.5 — Endpoint de histórico e alertas

- GET /areas/{id}/history
- GET /alerts

## EPIC 9 — Qualidade, Testes e Deploy

**Objetivo:** garantir entrega confiável.

### US9.1 — Testes unitários do IHFR

**Critérios**

- teste de normalização
- teste de classes
- teste de dimensões com missing data

### US9.2 — Logs e rastreabilidade

**Critérios**

- logar erros de validação
- logar execuções do compute-ihfr

### US9.3 — Deploy MVP

**Critérios**

- ambiente staging
- ambiente production
- documentação básica de instalação
