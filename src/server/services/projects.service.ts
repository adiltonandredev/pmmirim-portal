import { saveFile } from "@/lib/file-upload"
import { logAdminAction } from "@/lib/audit"
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { findProjectById, findProjectBySlug, createProjectRecord, updateProjectRecord, deleteProjectRecord } from "@/server/repositories/projects.repository"

function generateSlug(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-")
}

export async function createProjectService(formData: FormData) {
  const title = formData.get("title") as string
  if (!title) return { success: false, message: "O título do projeto é obrigatório." }
  let slug = generateSlug(title)
  const slugExists = await findProjectBySlug(slug)
  if (slugExists) slug = `${slug}-${Date.now().toString().slice(-4)}`
  const file = formData.get("coverImage") as File
  let coverImage = null
  if (file && file.size > 0) coverImage = await saveFile(file, "projects")
  await createProjectRecord({ title, slug, summary: formData.get("summary") as string || "", content: formData.get("content") as string || "", coverImage, published: formData.get("published") === "on", type: "PROJECT", featured: formData.get("featured") === "on" })
  await logAdminAction("CRIOU", "Projeto", `Título: ${title}`)
  return { success: true, message: "Projeto criado com sucesso!" }
}

export async function updateProjectService(formData: FormData) {
  const id = formData.get("id") as string
  if (!id) return { success: false, message: "ID do projeto não encontrado." }
  const title = formData.get("title") as string
  const file = formData.get("coverImage") as File
  let coverImage = formData.get("existingCoverImage") as string
  if (file && file.size > 0) { const up = await saveFile(file, "projects"); if (up) coverImage = up }
  await updateProjectRecord(id, { title, summary: formData.get("summary"), content: formData.get("content"), coverImage, published: formData.get("published") === "on", featured: formData.get("featured") === "on" })
  await logAdminAction("EDITOU", "Projeto", `Título: ${title}`)
  return { success: true, message: "Projeto atualizado com sucesso!" }
}

export async function deleteProjectService(id: string) {
  const project = await findProjectById(id)
  if (project?.coverImage) {
    try { const fp = join(process.cwd(), "public", project.coverImage); if (existsSync(fp)) await unlink(fp) } catch (e) { console.error(e) }
  }
  await deleteProjectRecord(id)
  await logAdminAction("EXCLUIU", "Projeto", `Título: ${project?.title || "ID: " + id}`)
  return { success: true, message: "Projeto excluído com sucesso!" }
}
