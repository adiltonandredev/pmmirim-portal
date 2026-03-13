import { saveFile } from "@/lib/file-upload"
import { logAdminAction } from "@/lib/audit"
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { findPartnerById, createPartnerRecord, updatePartnerRecord, deletePartnerRecord } from "@/server/repositories/partners.repository"

export async function createPartnerService(formData: FormData) {
  const name = formData.get("name") as string
  if (!name) return { success: false, message: "O nome do parceiro é obrigatório." }
  const file = formData.get("logoUrl") as File
  let logoUrl = null
  if (file && file.size > 0) logoUrl = await saveFile(file, "partners")
  await createPartnerRecord({ name, website: formData.get("url") as string || "", logoUrl: logoUrl || "", active: formData.get("active") === "on" })
  await logAdminAction("CRIOU", "Parceiro", `Nome: ${name}`)
  return { success: true, message: "Parceiro cadastrado com sucesso!" }
}

export async function updatePartnerService(formData: FormData) {
  const id = formData.get("id") as string
  if (!id) return { success: false, message: "ID do parceiro não encontrado." }
  const name = formData.get("name") as string
  const file = formData.get("logoUrl") as File
  let logoUrl = formData.get("existingLogoUrl") as string
  if (file && file.size > 0) { const up = await saveFile(file, "partners"); if (up) logoUrl = up }
  await updatePartnerRecord(id, { name, website: formData.get("url") as string || "", logoUrl, active: formData.get("active") === "on" })
  await logAdminAction("EDITOU", "Parceiro", `Nome: ${name}`)
  return { success: true, message: "Parceiro atualizado com sucesso!" }
}

export async function deletePartnerService(id: string) {
  const partner = await findPartnerById(id)
  if (partner?.logoUrl) {
    try { const fp = join(process.cwd(), "public", partner.logoUrl); if (existsSync(fp)) await unlink(fp) } catch (e) { console.error(e) }
  }
  await deletePartnerRecord(id)
  await logAdminAction("EXCLUIU", "Parceiro", `Nome: ${partner?.name || "ID: " + id}`)
  return { success: true, message: "Parceiro excluído com sucesso!" }
}
