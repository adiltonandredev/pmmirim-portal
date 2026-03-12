import { saveFile } from "@/lib/file-upload"
import { logAdminAction } from "@/lib/audit"
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import {
  findPostBySlug,
  findPostById,
  createPostRecord,
  updatePostRecord,
  deletePostRecord,
} from "@/server/repositories/posts.repository"

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
}

export async function createPostService(formData: FormData) {
  const title = formData.get("title") as string
  const summary = formData.get("summary") as string
  const content = formData.get("content") as string

  if (!title) return { success: false, message: "O título da notícia é obrigatório." }

  const file = formData.get("coverImage") as File
  let coverImage = null
  if (file && file.size > 0) coverImage = await saveFile(file, "news")

  let slug = generateSlug(title)
  const existing = await findPostBySlug(slug)
  if (existing) slug = `${slug}-${Date.now().toString().slice(-4)}`

  await createPostRecord({
    title, slug,
    summary: summary || "",
    content: content || "",
    coverImage,
    published: formData.get("published") === "on",
    featured: formData.get("featured") === "on",
  })

  await logAdminAction("CRIOU", "Notícia", `Título: ${title}`)
  return { success: true, message: "Notícia criada com sucesso!" }
}

export async function updatePostService(formData: FormData) {
  const id = formData.get("id") as string
  if (!id) return { success: false, message: "ID da notícia não encontrado." }

  const title = formData.get("title") as string
  const summary = formData.get("summary") as string
  const content = formData.get("content") as string

  const file = formData.get("coverImage") as File
  let coverImage = formData.get("existingCoverImage") as string
  if (file && file.size > 0) {
    const uploaded = await saveFile(file, "news")
    if (uploaded) coverImage = uploaded
  }

  await updatePostRecord(id, { title, summary, content, coverImage, published: formData.get("published") === "on", featured: formData.get("featured") === "on" })
  await logAdminAction("EDITOU", "Notícia", `Título: ${title}`)
  return { success: true, message: "Notícia atualizada com sucesso!" }
}

export async function deletePostService(id: string) {
  const post = await findPostById(id)

  if (post?.coverImage) {
    try {
      const filePath = join(process.cwd(), "public", post.coverImage)
      if (existsSync(filePath)) await unlink(filePath)
    } catch (e) {
      console.error("Erro ao excluir imagem do disco:", e)
    }
  }

  await deletePostRecord(id)
  await logAdminAction("EXCLUIU", "Notícia", `Título: ${post?.title || "ID: " + id}`)
  return { success: true, message: "Notícia excluída com sucesso!" }
}
