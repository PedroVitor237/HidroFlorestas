# Checklist ponta a ponta da `007-ihfr-evolution`

## Estado do roteiro

Este roteiro foi preparado em 2026-09-25, mas nenhuma etapa abaixo foi executada
em navegador nesta rodada. Marcas vazias são intencionais.

## 1. Pré-condições externas à interface

- [ ] A revisão de segurança documentada em
  [`validation-report.md`](validation-report.md) liberou PostgreSQL/E2E.
- [ ] O endpoint de `TEST_DATABASE_URL` foi associado, pela Neon Console/API,
  ao `branch_id` de teste esperado.
- [ ] O endpoint de desenvolvimento foi associado a outro `branch_id`.
- [ ] O processo foi iniciado sem variáveis herdadas de banco, servidor externo
  ou `IMP006_*`.
- [ ] `NODE_ENV=test`, confirmação e
  `IMP006_DATABASE_VARIABLE=TEST_DATABASE_URL` foram verificados sem imprimir
  valores sensíveis.
- [ ] Nenhuma outra execução concorrente usa o mesmo destino.
- [ ] Existe uma conta de teste `ACTIVE` conhecida. Essa conta é a única
  pré-condição de domínio preparada fora da interface.
- [ ] Nenhum laboratório, área, coleta, conjunto ambiental ou diagnóstico do
  cenário foi criado diretamente por fixture.

Se for necessário criar a conta, registrar separadamente se ela veio de uma
fixture isolada ou do fluxo `/register`; não apresentar esse preparo como parte
do fluxo iniciado em login.

## 2. Vetor técnico do cenário feliz

O vetor abaixo deriva diretamente dos mapeamentos e fórmulas do manifesto
[`ihfr-math-experimental-v0.1.1.json`](../../../specs/006-ihfr-diagnosis/contracts/ihfr-math-experimental-v0.1.1.json).
Ele é um vetor técnico, não científico.

### Área e coleta

- Nome do laboratório: valor exclusivo da execução.
- Nome da área: valor exclusivo da execução.
- Latitude: `-3`.
- Longitude: `-38`.
- Ocorrência da coleta: instante passado em RFC 3339 com fuso explícito, por
  exemplo `2026-09-20T12:00:00-03:00`.

### Dados ambientais

| Grupo | Campo | Valor |
|---|---|---|
| Água | Fonte de água | `SPRING` |
| Água | Há nascente | `true` |
| Água | Profundidade do poço | não informado; não aplicável |
| Água | Disponibilidade hídrica | `PERMANENT` |
| Água | Indicador de salinidade | não informado |
| Solo | Textura | `MEDIUM` |
| Solo | Taxa de infiltração | `60 mm/h` |
| Solo | Compactação | `LOW` |
| Solo | Sinais de erosão | `NONE` |
| Solo | Solo exposto | não informado |
| Vegetação | Cobertura vegetal | `100%` |
| Vegetação | Fragmentação | `LOW` |
| Vegetação | APP ripária | `true` |
| Vegetação | Degradação da paisagem | `LOW` |
| Terreno | Densidade de drenagem | `1.5 km/km²` |
| Terreno | Elevação | `180 m` |
| Terreno | Declividade | `45%` |

### Suplemento IHFR

- Uso predominante da terra: `FOREST`.
- Origem: `FIELD_OBSERVATION`.
- Data da observação: instante válido anterior ou igual ao teste.

### Resultado técnico esperado, calculado independentemente

- Água: `(0.2 + 0.2 + 0.2) / 3 = 0.2`.
- Solo: `(0 + 0.2 + 0.2 + 0.4) / 4 = 0.2`.
- Vegetação: `(0 + 0.2 + 0.2 + 0.2) / 4 = 0.15`.
- Terreno/uso: `(1 + 0.2) / 2 = 0.6`.
- Raw: `0.25 × (0.2 + 0.2 + 0.15 + 0.6) = 0.2875`.
- Apresentação half-up: `0.29`.
- Classe: `MODERATE`.
- Qualidade: `HIGH` — cinco entradas essenciais presentes.
- Drivers, pela ordem de desempate declarada: `T`, depois `W`.

## 3. Etapas executadas pelo usuário

### Login e laboratório

- [ ] Abrir `/login`.
- [ ] Informar e-mail e senha da conta de teste.
- [ ] Selecionar “ENTRAR”.
- [ ] Confirmar redirecionamento para `/workspace` e sessão autenticada.
- [ ] Informar nome exclusivo no formulário “Criar laboratório”.
- [ ] Confirmar mensagem de sucesso e surgimento do card.
- [ ] Selecionar “ACESSAR LABORATÓRIO”.
- [ ] Confirmar nome, papel `OWNER` e estado ativo no cabeçalho contextual.

### Área

- [ ] Selecionar “Áreas”.
- [ ] Selecionar “Nova área”.
- [ ] Preencher nome, latitude e longitude do vetor.
- [ ] Opcionalmente preencher município, UF e descrição.
- [ ] Não usar `CollectionArea.landType` como substituto de `landUseType`.
- [ ] Selecionar “Confirmar ponto e cadastrar”.
- [ ] Confirmar redirecionamento ao detalhe e origem laboratorial correta.

### Coleta

- [ ] Selecionar “Registrar coleta”.
- [ ] Informar o instante RFC 3339 com fuso explícito.
- [ ] Selecionar “Revisar coleta”.
- [ ] Conferir laboratório, área e ocorrência.
- [ ] Selecionar “Confirmar coleta”.
- [ ] Confirmar redirecionamento ao detalhe e presença de `confirmedAt`.

### Dados ambientais

- [ ] Selecionar “Ver dados ambientais”.
- [ ] Confirmar estado “Nenhum dado ambiental registrado”.
- [ ] Selecionar “Registrar dados ambientais”.
- [ ] Preencher os quatro grupos com o vetor técnico.
- [ ] Confirmar que zero e “Não” são preservados como valores, não ausência.
- [ ] Selecionar “Revisar dados”.
- [ ] Conferir todos os campos e selecionar “Confirmar dados ambientais”.
- [ ] Confirmar retorno ao detalhe ambiental, contrato
  `ihfr-measurement-v1`, data de confirmação e imutabilidade declarada.
- [ ] Recarregar a página e confirmar os mesmos valores.

### Solicitação e consulta do IHFR

- [ ] Selecionar “Voltar à coleta”.
- [ ] Escolher `FOREST` em “Uso predominante da terra”.
- [ ] Escolher `FIELD_OBSERVATION` e informar a data da observação.
- [ ] Selecionar “Verificar elegibilidade”.
- [ ] Confirmar `ELIGIBLE` e ausência de diagnóstico vigente.
- [ ] Selecionar “Criar diagnóstico” e confirmar o diálogo.
- [ ] Confirmar resultado `0.29`, classe `MODERATE`, qualidade `HIGH` e
  componentes `W=0.2`, `S=0.2`, `V=0.15`, `T=0.6`.
- [ ] Confirmar os quatro qualificadores experimentais obrigatórios.
- [ ] Registrar a omissão atualmente esperada por `F-002`: origem completa,
  versões de medição/suplemento, vigência e datas não aparecem no resumo.
- [ ] Recarregar o detalhe da coleta e confirmar que o mesmo diagnóstico
  permanece corrente.

### Reabrir sem URL manual

- [ ] Voltar ao resumo do laboratório.
- [ ] Localizar “Coleta confirmada” no histórico.
- [ ] Abrir a atividade e confirmar que ela leva ao mesmo detalhe da coleta.
- [ ] Confirmar novamente a persistência do conjunto ambiental e do diagnóstico.

## 4. Casos negativos mínimos posteriores

Executar somente depois do cenário feliz e com isolamento confirmado.

- [ ] Salvar um conjunto ambiental sem `slopePercent`; confirmar que o conjunto
  é aceito, mas a elegibilidade IHFR retorna `MISSING_SLOPE_PERCENT` e nenhum
  diagnóstico é criado.
- [ ] Deixar `landUseType` indeterminado; confirmar insuficiência e ausência de
  diagnóstico vigente.
- [ ] Repetir a mesma operação após resposta desconhecida usando a mesma chave;
  confirmar ausência de duplicação.
- [ ] Recarregar como MEMBER vinculado; confirmar leitura sem controles de
  escrita.
- [ ] Tornar o laboratório inativo em cenário isolado; confirmar leitura e
  recusa de novas escritas.

## 5. Evidências a guardar

- [ ] SHA e branch da execução.
- [ ] Identificadores sanitizados do cenário e timestamps.
- [ ] Fingerprint da identidade de banco/schema, sem URL ou credencial.
- [ ] Resultado de cada etapa e screenshot somente quando não contiver dado
  pessoal desnecessário.
- [ ] Resultado do teardown e comprovação de ausência do schema isolado.
- [ ] Falhas preservadas como falhas; nenhuma expectativa deve ser alterada para
  produzir aprovação.
