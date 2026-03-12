import { logAdminAction } from "@/lib/audit"
import { findInstagramSettings, createInstagramRecord, updateInstagramRecord } from "@/server/repositories/instagram.repository"

export async function saveInstagramSettingsService(formData: FormData) {
  const accessToken = formData.get("accessToken") as string
  const username = formData.get("username") as string
  const enabled = formData.get("enabled") === "on"
  const existing = await findInstagramSettings()
  if (existing) { await updateInstagramRecord(existing.id, { accessToken, username, enabled }) }
  else { await createInstagramRecord({ accessToken, username, enabled }) }
  const status = enabled ? "Ativado" : "Desativado"
  await logAdminAction("EDITOU", "Instagram", `Status: ${status}, Conta: ${username || "Sem nome"}`)
  return { success: true, message: "Integração com o Instagram salva com sucesso!" }
}

export async function getInstagramFeedService() {
  const settings = await findInstagramSettings()
  if (!settings || !settings.enabled || !settings.accessToken) return []
  try {
    const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${settings.accessToken}&limit=8`
    const response = await fetch(url, { next: { revalidate: 3600 } })
    if (!response.ok) { console.error("Erro ao buscar Instagram:", await response.text()); return [] }
    const data = await response.json()
    return data.data || []
  } catch (error) { console.error("Erro no feed do Instagram:", error); return [] }
}
