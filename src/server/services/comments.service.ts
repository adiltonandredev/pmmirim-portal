import { createCommentRecord } from "@/server/repositories/comments.repository"
import { verifyTurnstile } from "@/lib/turnstile"

export async function createCommentService(formData: FormData) {
  const token = formData.get("cf-turnstile-response") as string
  if (!token) return { success: false, message: "Verificação de segurança necessária." }

  const isHuman = await verifyTurnstile(token)
  if (!isHuman) return { success: false, message: "Verificação de segurança falhou. Tente novamente." }

  const author = (formData.get("author") as string)?.trim()
  const content = (formData.get("content") as string)?.trim()
  const postId = formData.get("postId") as string

  if (!author || !content || !postId) return { success: false, message: "Preencha todos os campos obrigatórios." }
  if (author.length > 100) return { success: false, message: "Nome muito longo (máximo 100 caracteres)." }
  if (content.length > 2000) return { success: false, message: "Comentário muito longo (máximo 2000 caracteres)." }

  try {
    await createCommentRecord({ author, content, postId })
    return { success: true, message: "Comentário enviado com sucesso!" }
  } catch {
    return { success: false, message: "Erro ao salvar comentário. Tente novamente." }
  }
}
