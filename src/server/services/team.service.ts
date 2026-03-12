import { saveFile } from "@/lib/file-upload"
import { logAdminAction } from "@/lib/audit"
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { findTeamMemberById, findAllTeamMembers, createTeamMemberRecord, updateTeamMemberRecord, deleteTeamMemberRecord } from "@/server/repositories/team.repository"

async function tryDeleteFile(path: string) {
  try { const fp = join(process.cwd(), "public", path); if (existsSync(fp)) await unlink(fp) } catch (e) { console.error(e) }
}

export async function createTeamMemberService(formData: FormData) {
  const name = formData.get("name") as string
  if (!name) return { success: false, message: "O nome do membro da equipe é obrigatório." }
  const file = formData.get("image") as File
  let image = null
  if (file && file.size > 0) image = await saveFile(file, "team")
  await createTeamMemberRecord({ name, role: formData.get("role") as string, category: formData.get("category") as string, bio: formData.get("bio") as string, image, instagram: formData.get("instagram") as string, email: formData.get("email") as string, order: parseInt(formData.get("order") as string || "0") })
  await logAdminAction("CRIOU", "Membro da Equipe", `Nome: ${name}`)
  return { success: true, message: "Membro da equipe cadastrado com sucesso!" }
}

export async function updateTeamMemberService(formData: FormData) {
  const id = formData.get("id") as string
  if (!id) return { success: false, message: "ID do membro não encontrado." }
  const name = formData.get("name") as string
  const file = formData.get("image") as File
  let image = formData.get("existingImage") as string
  if (file && file.size > 0) { const up = await saveFile(file, "team"); if (up) image = up }
  await updateTeamMemberRecord(id, { name, role: formData.get("role") as string, category: formData.get("category") as string, bio: formData.get("bio") as string, image, instagram: formData.get("instagram") as string, email: formData.get("email") as string, order: parseInt(formData.get("order") as string || "0") })
  await logAdminAction("EDITOU", "Membro da Equipe", `Nome: ${name}`)
  return { success: true, message: "Membro da equipe atualizado com sucesso!" }
}

export async function deleteTeamMemberService(id: string) {
  const member = await findTeamMemberById(id)
  if (member?.image) await tryDeleteFile(member.image)
  await deleteTeamMemberRecord(id)
  await logAdminAction("EXCLUIU", "Membro da Equipe", `Nome: ${member?.name || "ID: " + id}`)
  return { success: true, message: "Membro excluído com sucesso!" }
}

export async function getTeamMembersService(category?: string) {
  return findAllTeamMembers(category)
}
