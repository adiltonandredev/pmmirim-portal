import { saveFile } from "@/lib/file-upload"
import { logAdminAction } from "@/lib/audit"
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { findCourseById, createCourseRecord, updateCourseRecord, deleteCourseRecord } from "@/server/repositories/courses.repository"

function generateCourseSlug(title: string): string {
  return title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") + "-" + Date.now().toString().slice(-4)
}

export async function createCourseService(formData: FormData) {
  const title = formData.get("title") as string
  if (!title) return { success: false, message: "O título do curso é obrigatório." }
  const coverFile = formData.get("coverImage") as File
  let coverImage = null
  if (coverFile && coverFile.size > 0) coverImage = await saveFile(coverFile, "courses")
  const sponsorFile = formData.get("sponsorLogo") as File
  let sponsorLogo = null
  if (sponsorFile && sponsorFile.size > 0) sponsorLogo = await saveFile(sponsorFile, "courses")
  const slug = generateCourseSlug(title)
  await createCourseRecord({ title, slug, description: formData.get("description") as string, content: formData.get("content") as string, duration: formData.get("duration") as string, targetAge: formData.get("targetAge") as string, sponsorName: formData.get("sponsorName") as string, active: formData.get("active") === "on", coverImage, sponsorLogo, featured: false })
  await logAdminAction("CRIOU", "Curso", `Título: ${title}`)
  return { success: true, message: "Curso criado com sucesso!" }
}

export async function updateCourseService(formData: FormData) {
  const id = formData.get("id") as string
  if (!id) return { success: false, message: "ID do curso não encontrado." }
  const coverFile = formData.get("coverImage") as File
  let coverImage = formData.get("existingCoverImage") as string
  if (coverFile && coverFile.size > 0) { const up = await saveFile(coverFile, "courses"); if (up) coverImage = up }
  const sponsorFile = formData.get("sponsorLogo") as File
  let sponsorLogo = formData.get("existingSponsorLogo") as string
  if (sponsorFile && sponsorFile.size > 0) { const up = await saveFile(sponsorFile, "courses"); if (up) sponsorLogo = up }
  const title = formData.get("title") as string
  await updateCourseRecord(id, { title, description: formData.get("description") as string, content: formData.get("content") as string, duration: formData.get("duration") as string, targetAge: formData.get("targetAge") as string, sponsorName: formData.get("sponsorName") as string, active: formData.get("active") === "on", coverImage, sponsorLogo })
  await logAdminAction("EDITOU", "Curso", `Título: ${title}`)
  return { success: true, message: "Curso atualizado com sucesso!" }
}

export async function deleteCourseService(id: string) {
  const course = await findCourseById(id)
  if (course?.coverImage) { try { const fp = join(process.cwd(), "public", course.coverImage); if (existsSync(fp)) await unlink(fp) } catch (e) { console.error(e) } }
  if (course?.sponsorLogo) { try { const fp = join(process.cwd(), "public", course.sponsorLogo); if (existsSync(fp)) await unlink(fp) } catch (e) { console.error(e) } }
  await deleteCourseRecord(id)
  await logAdminAction("EXCLUIU", "Curso", `Título: ${course?.title || "ID: " + id}`)
  return { success: true, message: "Curso excluído com sucesso!" }
}
