# Quickstart: Validar a IMP-003

**Feature**: Cadastro e consulta espacial de área  
**Branch**: `003-area-registration-and-viewing`  
**Purpose**: roteiro futuro de implementação e validação; nenhum comando deste documento foi executado durante `$speckit-plan`.

## 1. Preconditions

- Baseline integrado da IMP-001 e IMP-002.
- Node.js e dependências do repositório instalados conforme `package.json`/lockfile.
- PostgreSQL descartável para testes e credenciais separadas do ambiente de produção.
- Backup/PITR confirmado antes da migration em qualquer base persistente.
- Provedor de tiles aprovado para produção, com URL e atribuição configuradas; não usar infraestrutura pública do OSM em carga automatizada.
- Fixtures sem dados pessoais reais: proprietário, administrador, membro, participante sem vínculo; laboratórios ativo e inativo; áreas separadas por laboratório.

## 2. Migration rehearsal gate

Antes de iniciar a aplicação nova, executar o preflight em uma cópia representativa e registrar somente contagens/IDs técnicos necessários, sem segredos ou dados pessoais:

1. Confirmar que o schema aplicado contém a migration integrada da IMP-002 e não possui drift inesperado.
2. Comparar `_prisma_migrations` nos ambientes autorizados com o histórico versionado; o baseline local não deve ser tratado como histórico completo sem essa reconciliação.
3. Listar laboratórios cujo criador não possui vínculo.
4. Verificar se inserir qualquer vínculo ausente faria uma conta exceder o limite de cinco laboratórios acessíveis.
5. Confirmar que cada área referencia uma coordenada existente e que não há coordenada compartilhada ou órfã.
6. Validar que todas as strings de latitude/longitude são numéricas, finitas e estão nos ranges aceitos.
7. Medir o delta do arredondamento a seis casas; recusar qualquer caso acima de `0.0000005°`.
8. Fazer backup/PITR e ensaiar a migration completa, incluindo a allowlist necessária em `.gitignore` para versionar a nova pasta.
9. Após o ensaio, conferir contagens, proprietário único, ausência de `ADMIN` criado pelo backfill, coordenadas, constraints e regressão da IMP-002.

Qualquer falha bloqueia o deploy; não corrigir ou descartar dados silenciosamente.

## 3. Planned dependency integration

Durante a implementação, adicionar versões compatíveis e registrar no lockfile:

```bash
npm install leaflet@1.9.4 react-leaflet@5.0.0
npm install --save-dev @types/leaflet
```

A configuração deve fornecer ao cliente, no mínimo:

```dotenv
NEXT_PUBLIC_MAP_TILE_URL=https://approved-provider.example/{z}/{x}/{y}.png
NEXT_PUBLIC_MAP_ATTRIBUTION=Attribution required by the selected provider
```

Produção não avança sem valores aprovados. Desenvolvimento manual de baixo volume pode usar o fallback documentado para OSM, com atribuição visível, sem prefetch/offline e respeitando cache/referer.

## 4. Planned implementation order

1. Migration de papéis, vínculo opaco e ponto direto na área.
2. Adaptação da criação atômica da IMP-002 para gravar `OWNER`.
3. Guard contextual e matriz de permissões.
4. GET/PATCH de vínculos.
5. GET/POST de áreas e GET de detalhe.
6. Seleção explícita de laboratório e rotas contextualizadas.
7. Formulário, listagem, detalhe, mapa client-only e geolocalização.
8. Testes, regressão, acessibilidade e evidências.

Não integrar código que dependa do novo schema antes de a migration correspondente estar pronta e ensaiada.

## 5. Automated validation commands

Após a implementação e com ambiente de teste seguro:

```bash
npm run lint
npm run typecheck
npm run test:unit
npm run test:integration
npm run test:e2e
npm run build
```

Também executar a verificação específica da migration definida nas tarefas, em banco descartável. Os testes de browser devem interceptar requests de tiles; nenhuma suíte automatizada deve acessar `tile.openstreetmap.org` nem um provedor real.

## 6. Contract validation

Validar `contracts/area-registration-api.openapi.yaml` contra as rotas implementadas:

- Bodies com chaves desconhecidas retornam `400`.
- POST de área não aceita IDs, autoria, datas, CEP, imagem ou estado funcional.
- DTOs nunca retornam criador, `userId`, e-mail, access code, CEP, imagem ou ID de coordenadas.
- Opcionais são `null`, não campos ausentes.
- Coordenadas de resposta são números finitos e correspondem ao banco com tolerância `1e-6`.
- Respostas autenticadas têm `Cache-Control: no-store`.
- Recurso inexistente, de outro laboratório ou sem vínculo produz o mesmo `404` público.

## 7. Scenario matrix

### A. Roles and owner invariant

1. Criar um laboratório pelo fluxo IMP-002.
2. Confirmar que laboratório e vínculo surgem atomicamente e o vínculo é `OWNER`.
3. Confirmar exatamente um proprietário no banco e correspondência com `LaboratoryRoom.userId`.
4. Como `OWNER`, promover `MEMBER → ADMIN` com `expectedRole: MEMBER`.
5. Rebaixar `ADMIN → MEMBER` com `expectedRole: ADMIN`.
6. Repetir com expectativa obsoleta e esperar `409`, sem sobrescrever o papel atual.
7. Tentar qualquer mutação envolvendo `OWNER`, como `ADMIN` e como `MEMBER`; nenhuma altera dados.
8. Confirmar que `User.role`, `User.isAdmin` e `/api/auth/me` não mudaram.

### B. Explicit laboratory context

1. Autenticar uma pessoa com dois laboratórios acessíveis e abrir `/workspace`.
2. Confirmar que nenhum laboratório foi selecionado automaticamente.
3. Escolher um laboratório e chegar a `/dashboard/laboratories/{id}/areas`.
4. Navegar para novo cadastro e detalhe; recarregar cada página e confirmar nome/status/contexto.
5. Revogar o vínculo por mecanismo de fixture e repetir a chamada; esperar `404` e nenhum dado anterior.
6. Trocar manualmente IDs por laboratório/área cruzados e confirmar comportamento indistinguível de inexistência.

### C. Create an area manually

1. Como `OWNER` ou `ADMIN` de laboratório ativo, abrir `/areas/new`.
2. Informar nome e coordenadas sem clicar no mapa.
3. Confirmar sincronização do marcador e salvar.
4. Verificar uma única área persistida, autoria interna da sessão e contexto derivado da rota.
5. Durante uma submissão pendente, repetir clique/Enter e confirmar que o cliente mantém uma única operação em voo e uma única área.
6. Recarregar a listagem e abrir o detalhe; comparar o ponto persistido.

### D. Create with map and geolocation

1. Clicar no mapa, revisar os campos, alterá-los e confirmar que o marcador acompanha o último valor.
2. Conceder geolocalização no Playwright e definir coordenadas conhecidas; acionar explicitamente, revisar e salvar.
3. Simular permissão negada, timeout, indisponibilidade e coordenadas inválidas; preservar valores existentes e permitir cadastro manual.
4. Disparar uma resposta de geolocalização tardia após edição manual; ela não pode sobrescrever a correção.
5. Derrubar/interceptar tiles; campos e submit continuam funcionais.

### E. Validation boundaries

Testar exatamente e além dos limites:

| Input | Expected |
|---|---|
| latitude `-90` / `90` | accepted |
| latitude menor que `-90` ou maior que `90` | `400` |
| longitude `-180` / `180` | accepted |
| longitude fora do range | `400` |
| `NaN`, infinidade, string numérica, vazio | `400` |
| nome após normalização com 1/100 chars | accepted |
| nome vazio ou 101 chars | `400` |
| opcional ausente/nulo | persisted and returned as `null` |
| município/UF/tipo com 101 chars | `400` |
| descrição com 2001 chars | `400` |
| chave extra | `400` |

### F. Read-only and permissions

| Actor/context | List/detail | Create area | Manage roles |
|---|---:|---:|---:|
| `OWNER`, active | yes | yes | yes |
| `ADMIN`, active | yes | yes | no |
| `MEMBER`, active | yes | no | no |
| Any linked role, inactive | yes | no | no |
| Missing/revoked link | no | no | no |
| Account not `ACTIVE` | no | no | no |

Confirmar que o modo somente leitura é visível na UI e imposto no servidor.

## 8. IMP-001/002 regression

- Sign-in, sign-out, `/api/auth/me` e revalidação `ACTIVE` continuam passando.
- DTO público de autenticação continua exatamente `{ firstName, lastName, image }`.
- Criação de laboratório, limite de cinco, listagem por vínculo, consulta de laboratório inativo, desativação e exclusão administrativa mantêm a semântica integrada.
- Contratos públicos da IMP-002 não ganham `userId`, access code ou campos de área.
- A adição do papel não transforma administrador global em `ADMIN` contextual.

## 9. Accessibility and responsive checks

- Seleção, formulário, confirmação e links de detalhe operáveis por teclado.
- Campos possuem labels associados; erros e estados têm anúncio compreensível e foco útil.
- Mapa não é o único meio de escolher ou compreender o ponto.
- Marcador e feedback visual não dependem somente de cor.
- Fluxo essencial funciona em viewport móvel e ampla.
- Laboratório, papel e estado somente leitura permanecem visíveis durante navegação.

## 10. Completion evidence

Registrar na entrega:

- migration/preflight e resultado do ensaio;
- arquivos alterados e diff revisado;
- comandos de validação e resultados;
- matriz de papéis e isolamento cruzado;
- evidência de nenhum tráfego público de tiles nos testes;
- regressão IMP-001/002;
- provider/attribution operacionais;
- SC-009 e SC-010 como `NAO_VERIFICADO` até validação humana real.
