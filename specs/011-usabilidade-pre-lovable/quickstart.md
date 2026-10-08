# Validação focal

Usar Node >=24.19.0 <25 e dependências já instaladas. Executar npm run test:unit, npm run typecheck, npm run lint e npm run build. Navegador offline possui config separada em tests/ui/playwright.config.ts, não carrega env/fixtures de banco.

1. Workspace em desktop/375px: Sair visível, foco por Tab/Enter; sucesso limpa usuário e redireciona ao login. Falha mostra alerta e retry; laboratório/AdminShell continuam acessíveis.
2. Novo formulário: sugestão agora do dispositivo em UTC, America/Fortaleza e Asia/Kathmandu. Editar horário; revisar/corrigir e provocar falha; mesma ocorrência/chave. Conferir payload e detalhe devolvido com offset. Datas futuras e gaps DST recusados; ambíguas exigem offset explícito.
3. Sete opções portuguesas com mesmos valores; selecionar Floresta/Pastagem/SAF; payload técnico. Ajuda visível por teclado/toque.

Ciclo real autenticado/banco requer ambiente isolado conforme guardas existentes; não utilizar dados reais para estes checks. Resultados/limitações em implementation-evidence.md.
