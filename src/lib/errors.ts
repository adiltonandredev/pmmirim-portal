/**
 * Converts an unknown error into a human-friendly Portuguese message.
 * Used in server actions to return structured errors instead of throwing.
 */
export function parseError(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message

    // --- Upload / Arquivo ---
    if (/file.{0,20}size|too large|size.{0,20}limit|payload.{0,20}large|FileSizeMismatch/i.test(msg))
      return "O arquivo enviado é muito grande. Verifique o tamanho máximo permitido."
    if (/invalid.{0,20}file.{0,10}type|InvalidFileType|mime.{0,20}type|file.{0,20}format/i.test(msg))
      return "Formato de arquivo inválido. Use JPG, PNG ou WEBP."
    if (/upload|UploadThing|ufs\.sh|uploadfiles/i.test(msg))
      return "Erro ao enviar o arquivo. Verifique o tamanho e o formato (JPG, PNG, WEBP)."

    // --- Prisma / Banco de dados ---
    if (/unique constraint|P2002|already exists|duplicate/i.test(msg))
      return "Já existe um registro com esses dados. Verifique os campos únicos (ex: e-mail, slug)."
    if (/record.{0,20}not found|P2025|P2001/i.test(msg))
      return "Registro não encontrado. Pode ter sido excluído por outro usuário."
    if (/foreign key|P2003|P2014|related record/i.test(msg))
      return "Este item está vinculado a outros registros e não pode ser alterado diretamente."
    if (/P2034|P1008|P1009/i.test(msg))
      return "Tempo de espera do banco de dados esgotado. Tente novamente."
    if (/prisma|database error|db\serror/i.test(msg))
      return "Erro no banco de dados. Tente novamente em alguns instantes."

    // --- Rede / Servidor ---
    if (/ECONNREFUSED|ENOTFOUND|fetch failed|Network Error/i.test(msg))
      return "Falha na conexão com o servidor. Verifique sua internet."
    if (/timeout|timed out|ETIMEDOUT/i.test(msg))
      return "O servidor demorou muito para responder. Tente novamente."

    // --- Autorização ---
    if (/unauthorized|forbidden|401|403/i.test(msg))
      return "Você não tem permissão para realizar esta ação."

    // Retorna a mensagem original se for curta e legível
    if (msg.length < 120 && !/^\s*(Error:|at\s\w|\n)/.test(msg))
      return msg
  }

  return "Erro inesperado. Tente novamente ou contate o suporte."
}
