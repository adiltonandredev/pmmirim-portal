import { createCommentRecord } from "@/server/repositories/comments.repository"

export async function createCommentService(formData: FormData) {
  const author = formData.get("author") as string
  const content = formData.get("content") as string
  const postId = formData.get("postId") as string
  if (!author || !content || !postId) return { success: false, message: "Preencha todos os campos obrigatórios." }
  await createCommentRecord({ author, content, postId })
  return { success: true, message: "Comentário enviado com sucesso!" }
}
