import { saveFile } from "@/lib/file-upload"
import { logAdminAction } from "@/lib/audit"
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { findBirthdayById, createBirthdayRecord, updateBirthdayRecord, deleteBirthdayRecord } from "@/server/repositories/birthdays.repository"

export async function createBirthdayService(formData: FormData) {
  const name = formData.get("name") as string
  const role = formData.get("role") as string
  const dateStr = formData.get("date") as string
  const active = formData.get("active") === "on"
  if (!name || !dateStr) return { success: false, message: "Nome e Data são obrigatórios." }
  const date = new Date(`${dateStr}T12:00:00`)
  const file = formData.get("photoUrl") as File
  let photoUrl = null
  if (file && file.size > 0) photoUrl = await saveFile(file, "birthdays")
  await createBirthdayRecord({ name, role, date, photoUrl, active })
  await logAdminAction("CRIOU", "Aniversariante", `Nome: ${name}`)
  return { success: true, message: "Aniversariante cadastrado com sucesso!" }
}

export async function updateBirthdayService(formData: FormData) {
  const id = formData.get("id") as string
  if (!id) return { success: false, message: "ID do aniversariante não encontrado." }
  const name = formData.get("name") as string
  const role = formData.get("role") as string
  const dateStr = formData.get("date") as string
  const active = formData.get("active") === "on"
  const date = new Date(`${dateStr}T12:00:00`)
  const file = formData.get("photoUrl") as File
  let photoUrl = formData.get("existingPhotoUrl") as string
  if (file && file.size > 0) { const up = await saveFile(file, "birthdays"); if (up) photoUrl = up }
  await updateBirthdayRecord(id, { name, role, date, photoUrl, active })
  await logAdminAction("EDITOU", "Aniversariante", `Nome: ${name}`)
  return { success: true, message: "Aniversariante atualizado com sucesso!" }
}

export async function deleteBirthdayService(id: string) {
  const birthday = await findBirthdayById(id)
  if (birthday?.photoUrl) {
    try { const fp = join(process.cwd(), "public", birthday.photoUrl); if (existsSync(fp)) await unlink(fp) } catch (e) { console.error(e) }
  }
  await deleteBirthdayRecord(id)
  await logAdminAction("EXCLUIU", "Aniversariante", `Nome: ${birthday?.name || "ID: " + id}`)
  return { success: true, message: "Aniversariante excluído com sucesso!" }
}
