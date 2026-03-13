import { saveFile } from "@/lib/file-upload"
import { logAdminAction } from "@/lib/audit"
import { findSiteSettings, createSiteSettingsRecord, updateSiteSettingsRecord, findInstagramSettings, findInstagramSettingsById, createInstagramSettingsRecord, updateInstagramSettingsRecord } from "@/server/repositories/settings.repository"

export async function updateSettingsService(formData: FormData) {
  const existing = await findSiteSettings()
  const data = { siteName: formData.get("siteName"), description: formData.get("description"), legalName: formData.get("legalName"), cnpj: formData.get("cnpj"), businessHours: formData.get("businessHours"), contactEmail: formData.get("contactEmail"), contactPhone: formData.get("contactPhone"), address: formData.get("address"), instagramUrl: formData.get("instagramUrl"), facebookUrl: formData.get("facebookUrl"), youtubeUrl: formData.get("youtubeUrl"), impactedYouth: formData.get("impactedYouth"), yearsOfHistory: formData.get("yearsOfHistory") }
  const file = formData.get("logo") as File
  let logoUrl = existing?.logoUrl
  if (file && file.size > 0) { const up = await saveFile(file, "settings"); if (up) logoUrl = up }
  if (existing) { await updateSiteSettingsRecord(existing.id, { ...data, ...(logoUrl && { logoUrl }) }) }
  else { await createSiteSettingsRecord({ ...data, logoUrl }) }
  await logAdminAction("EDITOU", "Configurações Globais", "Atualizou dados institucionais do site")
  return { success: true, message: "Configurações salvas com sucesso!" }
}

export async function updateInstagramSettingsService(formData: FormData) {
  const id = formData.get("id") as string
  const data = { username: formData.get("username") as string, accessToken: formData.get("accessToken") as string, enabled: formData.get("showFeed") === "on" }
  const existing = id ? await findInstagramSettingsById(id) : await findInstagramSettings()
  if (existing) { await updateInstagramSettingsRecord(existing.id, data) }
  else { await createInstagramSettingsRecord(data) }
  await logAdminAction("EDITOU", "Configurações do Instagram", `Usuário: ${data.username || "Desconhecido"}`)
  return { success: true, message: "Configurações do Instagram salvas com sucesso!" }
}
