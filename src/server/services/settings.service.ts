import { saveFile } from "@/lib/file-upload"
import { logAdminAction } from "@/lib/audit"
import { prisma } from "@/lib/prisma"

function str(value: FormDataEntryValue | null, fallback: string | null = null): string | null {
  const v = value as string | null
  if (!v || v.trim() === "") return fallback
  return v.trim()
}

export async function updateSettingsService(formData: FormData) {
  try {
    // Busca o registro mais recente
    const existing = await prisma.siteSettings.findFirst({ orderBy: { updatedAt: "desc" } })

    const data = {
      siteName:       str(formData.get("siteName"),       "Polícia Militar Mirim") as string,
      description:    str(formData.get("description")),
      legalName:      str(formData.get("legalName")),
      cnpj:           str(formData.get("cnpj")),
      businessHours:  str(formData.get("businessHours")),
      contactEmail:   str(formData.get("contactEmail")),
      contactPhone:   str(formData.get("contactPhone")),
      address:        str(formData.get("address")),
      instagramUrl:   str(formData.get("instagramUrl")),
      facebookUrl:    str(formData.get("facebookUrl")),
      youtubeUrl:     str(formData.get("youtubeUrl")),
      impactedYouth:  str(formData.get("impactedYouth"),  "100+") as string,
      yearsOfHistory: str(formData.get("yearsOfHistory"), "20")   as string,
    }

    // Upload de logo (se enviado)
    const file = formData.get("logo") as File
    let logoUrl = existing?.logoUrl ?? null
    if (file && file.size > 0) {
      const uploaded = await saveFile(file, "settings")
      if (uploaded) logoUrl = uploaded
    }

    if (existing) {
      // Remove duplicatas e atualiza o registro canônico
      await prisma.siteSettings.deleteMany({ where: { id: { not: existing.id } } })
      await prisma.siteSettings.update({
        where: { id: existing.id },
        data: { ...data, logoUrl },
      })
    } else {
      await prisma.siteSettings.create({ data: { ...data, logoUrl } })
    }

    await logAdminAction("EDITOU", "Configurações Globais", "Atualizou dados institucionais")
    return { success: true, message: "Configurações salvas com sucesso!" }
  } catch (error: any) {
    console.error("Erro ao salvar configurações:", error)
    return { success: false, message: error?.message || "Erro ao salvar configurações." }
  }
}

export async function updateInstagramSettingsService(formData: FormData) {
  try {
    const id = formData.get("id") as string
    const data = {
      username:    str(formData.get("username")),
      accessToken: str(formData.get("accessToken")),
      enabled:     formData.get("showFeed") === "on" || formData.get("showFeed") === "true",
    }

    const existing = id
      ? await prisma.instagramSettings.findUnique({ where: { id } })
      : await prisma.instagramSettings.findFirst({ orderBy: { updatedAt: "desc" } })

    if (existing) {
      await prisma.instagramSettings.deleteMany({ where: { id: { not: existing.id } } })
      await prisma.instagramSettings.update({ where: { id: existing.id }, data })
    } else {
      await prisma.instagramSettings.create({ data })
    }

    await logAdminAction("EDITOU", "Instagram", `Usuário: ${data.username || "Desconhecido"}`)
    return { success: true, message: "Configurações do Instagram salvas com sucesso!" }
  } catch (error: any) {
    console.error("Erro ao salvar Instagram:", error)
    return { success: false, message: error?.message || "Erro ao salvar configurações do Instagram." }
  }
}
