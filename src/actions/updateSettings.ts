"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { uploadImage } from "@/lib/upload"
import { logAdminAction } from "@/lib/audit" // <--- O Espião
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

// Helper para deletar arquivos físicos e economizar espaço no servidor
async function tryDeleteFile(path: string) {
    if (!path) return;
    try {
        const fullPath = join(process.cwd(), "public", path)
        if (existsSync(fullPath)) await unlink(fullPath)
    } catch (e) {
        console.error("Erro ao deletar arquivo físico:", e)
    }
}

export async function updateSiteSettings(formData: FormData) {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, message: "Acesso negado. Apenas administradores podem editar as configurações." }
    }

    const settingsId = formData.get("id") as string
    if (!settingsId) {
        return { success: false, message: "ID das configurações não encontrado." }
    }
    
    const data: any = {
      siteName: formData.get("siteName") as string,
      siteDescription: formData.get("siteDescription") as string,
      contactEmail: formData.get("contactEmail") as string,
      contactPhone: formData.get("contactPhone") as string,
      contactWhatsapp: formData.get("contactWhatsapp") as string,
      address: formData.get("address") as string,
      socialFacebook: formData.get("socialFacebook") as string,
      socialInstagram: formData.get("socialInstagram") as string,
      socialTwitter: formData.get("socialTwitter") as string,
      socialYoutube: formData.get("socialYoutube") as string,
      aboutTitle: formData.get("aboutTitle") as string,
      aboutDescription: formData.get("aboutDescription") as string,
      missionText: formData.get("missionText") as string,
      visionText: formData.get("visionText") as string,
      valuesText: formData.get("valuesText") as string,
      footerText: formData.get("footerText") as string,
    }

    // Busca os dados antigos para poder apagar as imagens velhas do HD se houver troca
    const oldSettings = await prisma.siteSettings.findUnique({ where: { id: settingsId } })

    const logoFile = formData.get("logo") as File
    const faviconFile = formData.get("favicon") as File

    if (logoFile && logoFile.size > 0) {
      try {
        const logoPath = await uploadImage(logoFile)
        if (logoPath) {
            data.logoUrl = logoPath
            if (oldSettings?.logoUrl) await tryDeleteFile(oldSettings.logoUrl) // Apaga a logo antiga
        }
      } catch (error: any) {
        return { success: false, message: `Erro no upload do logo: ${error.message}` }
      }
    }

    if (faviconFile && faviconFile.size > 0) {
      try {
        const faviconPath = await uploadImage(faviconFile)
        if (faviconPath) {
            data.faviconUrl = faviconPath
            if ((oldSettings as any)?.faviconUrl) await tryDeleteFile((oldSettings as any).faviconUrl) // Apaga o favicon antigo
        }
      } catch (error: any) {
        return { success: false, message: `Erro no upload do favicon: ${error.message}` }
      }
    }

    await prisma.siteSettings.update({
      where: { id: settingsId },
      data,
    })
    
    // Log de Auditoria
    await logAdminAction("EDITOU", "Configurações Globais", "Atualizou os dados principais do site")

    // Atualiza o cache das páginas afetadas
    revalidatePath("/")
    revalidatePath("/admin/settings")
    revalidatePath("/sobre")
    revalidatePath("/contato")
    // Revalidação do layout inteiro pois afeta header/footer
    revalidatePath("/", "layout")

    return { success: true, message: "Configurações atualizadas com sucesso!" }

  } catch (error) {
    console.error("Erro ao atualizar configurações:", error)
    return { success: false, message: "Erro interno ao atualizar as configurações do site." }
  }
}