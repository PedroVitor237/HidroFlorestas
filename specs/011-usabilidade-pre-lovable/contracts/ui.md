# Contratos de apresentação

Sair navega a /logout, POST /api/auth/logout com credentials include; somente sucesso limpa sessão/redireciona, falha oferece retry.

Datetime-local recebe data civil com segundos/milissegundos. Offset UTC ±HH:MM visível, editável; modo dispositivo sugere offset na data escolhida, horário inexistente/ambíguo exige ajuste explícito. POST de coleta continua {occurredAt: RFC3339} e Idempotency-Key; revisão/devolução ao formulário não recalcula ocorrência. Backend continua autoridade para calendário/futuro. Leitura exibe DD/MM/AAAA HH:mm:ss[.SSS] (UTC±HH:MM) a partir da representação devolvida, sem converter para fuso do leitor. Datas de confirmação conservam significado próprio.

FOREST → Floresta; AGROFORESTRY → Sistema agroflorestal (SAF); CROPLAND → Agricultura; PASTURE → Pastagem; DEGRADED_PASTURE → Pastagem degradada; BARE_SOIL → Solo exposto; URBAN → Área urbanizada. Valores enviados e cálculo permanecem idênticos. Indeterminado continua ausência. Ajuda textual acessível por aria-describedby e toque; descrições ambientais por categoria pendentes.
