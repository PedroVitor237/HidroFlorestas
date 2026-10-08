# Modelo de dados

Sem nova persistência. CollectionAttempt permanece volátil: occurredAt RFC 3339, contexto, fase, chave e erro; acrescentar valores dos controles locais/offset e modo dispositivo/manual. Editing → reviewing → submitting; falha retorna reviewing com mesma chave/dados. Entrada temporal inválida permanece editing. Coleta persistida continua instante Timestamptz(3) + occurrenceOffset VarChar(6). Suplemento IHFR mantém sete valores técnicos e imutabilidade. Sessão e transições existentes preservadas.
