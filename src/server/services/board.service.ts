import { saveFile } from "@/lib/file-upload"
import { logAdminAction } from "@/lib/audit"
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { findBoardMemberById, createBoardMemberRecord, updateBoardMemberRecord, deleteBoardMemberRecord, toggleBoardMemberRecord } from "@/server/repositories/board.repository"

async function tryDeleteFile(path: string) {
  try { const fp = join(process.cwd(), "public", path); if (existsSync(fp)) await unlink(fp) } catch (e) { console.error(e) }
}

export async function createBoardMemberService(formData: FormData) {
  const name = formData.get("name") as string
  const position = formData.get("position") as string
  if (!name || !position) return { success: false, message: "Nome e Cargo são obrigatórios." }
  const file = formData.get("photo") as File
  let photoUrl: string | null = null
  if (file && file.size > 0) photoUrl = await saveFile(file, "board")
  if (!photoUrl) photoUrl = (formData.get("photoUrl") as string) || null
  await createBoardMemberRecord({ name, position, bio: formData.get("bio"), email: formData.get("email"), phone: formData.get("phone"), photoUrl, active: formData.get("active") === "on", order: parseInt(formData.get("order") as string) || 0 })
  await logAdminAction("CRIOU", "Membro da Diretoria", `Nome: ${name} (${position})`)
  return { success: true, message: "Membro da diretoria cadastrado com sucesso!" }
}

export async function updateBoardMemberService(id: string, formData: FormData) {
  if (!id) return { success: false, message: "ID do membro não encontrado." }
  const name = formData.get("name") as string
  const file = formData.get("photo") as File
  let photoUrl = formData.get("existingPhotoUrl") as string
  if (file && file.size > 0) { const up = await saveFile(file, "board"); if (up) photoUrl = up }
  await updateBoardMemberRecord(id, { name, position: formData.get("position"), bio: formData.get("bio"), email: formData.get("email"), phone: formData.get("phone"), photoUrl, active: formData.get("active") === "on", order: parseInt(formData.get("order") as string) || 0 })
  await logAdminAction("EDITOU", "Membro da Diretoria", `Nome: ${name}`)
  return { success: true, message: "Membro da diretoria atualizado com sucesso!" }
}

export async function deleteBoardMemberService(id: string) {
  if (!id) return { success: false, message: "ID inválido para exclusão." }
  const member = await findBoardMemberById(id)
  if (member?.photoUrl) await tryDeleteFile(member.photoUrl)
  await deleteBoardMemberRecord(id)
  await logAdminAction("EXCLUIU", "Membro da Diretoria", `Nome: ${member?.name || "ID: " + id}`)
  return { success: true, message: "Membro excluído com sucesso!" }
}

export async function toggleBoardMemberActiveService(id: string, currentStatus: boolean) {
  if (!id) return { success: false, message: "ID do membro não fornecido." }
  await toggleBoardMemberRecord(id, !currentStatus)
  const statusName = !currentStatus ? "Ativado" : "Inativado"
  await logAdminAction("EDITOU", "Membro da Diretoria", `Alterou status para: ${statusName}`)
  return { success: true, message: `Membro ${statusName.toLowerCase()} com sucesso!` }
}
