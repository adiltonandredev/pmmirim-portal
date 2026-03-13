import { saveFile } from "@/lib/file-upload"
import { logAdminAction } from "@/lib/audit"
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { findEventById, createEventRecord, updateEventRecord, deleteEventRecord } from "@/server/repositories/events.repository"

export async function createEventService(formData: FormData) {
  const title = formData.get("title") as string
  if (!title) return { success: false, message: "O título do evento é obrigatório." }
  const location = formData.get("location") as string
  const description = formData.get("description") as string
  const dateStr = formData.get("date") as string
  const date = dateStr ? new Date(dateStr) : new Date()
  const file = formData.get("bannerUrl") as File
  let bannerUrl = null
  if (file && file.size > 0) bannerUrl = await saveFile(file, "events")
  await createEventRecord({ title, date, location: location || "", description: description || "", bannerUrl })
  await logAdminAction("CRIOU", "Evento", `Título: ${title}`)
  return { success: true, message: "Evento criado com sucesso!" }
}

export async function updateEventService(formData: FormData) {
  const id = formData.get("id") as string
  if (!id) return { success: false, message: "ID do evento não encontrado." }
  const title = formData.get("title") as string
  const location = formData.get("location") as string
  const description = formData.get("description") as string
  const dateStr = formData.get("date") as string
  const date = dateStr ? new Date(dateStr) : new Date()
  const file = formData.get("bannerUrl") as File
  let bannerUrl = formData.get("existingBannerUrl") as string
  if (file && file.size > 0) { const up = await saveFile(file, "events"); if (up) bannerUrl = up }
  await updateEventRecord(id, { title, date, location, description, bannerUrl })
  await logAdminAction("EDITOU", "Evento", `Título: ${title}`)
  return { success: true, message: "Evento atualizado com sucesso!" }
}

export async function deleteEventService(id: string) {
  const event = await findEventById(id)
  if (event?.bannerUrl) {
    try { const fp = join(process.cwd(), "public", event.bannerUrl); if (existsSync(fp)) await unlink(fp) } catch (e) { console.error(e) }
  }
  await deleteEventRecord(id)
  await logAdminAction("EXCLUIU", "Evento", `Título: ${event?.title || id}`)
  return { success: true, message: "Evento excluído com sucesso!" }
}
