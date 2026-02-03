"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { uploadImage } from "@/lib/upload"

export async function updateSiteSettings(formData: FormData) {
  const session = await auth()
  
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Apenas administradores podem editar as configurações" }
  }

  const settingsId = formData.get("id") as string
  
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

  const logoFile = formData.get("logo") as File
  const faviconFile = formData.get("favicon") as File

  if (logoFile && logoFile.size > 0) {
    try {
      const logoPath = await uploadImage(logoFile)
      if (logoPath) data.logoUrl = logoPath
    } catch (error: any) {
      return { error: `Erro no upload do logo: ${error.message}` }
    }
  }

  if (faviconFile && faviconFile.size > 0) {
    try {
      const faviconPath = await uploadImage(faviconFile)
      if (faviconPath) data.faviconUrl = faviconPath
    } catch (error: any) {
      return { error: `Erro no upload do favicon: ${error.message}` }
    }
  }

  try {
    await prisma.siteSettings.update({
      where: { id: settingsId },
      data,
    })
    
    revalidatePath("/")
    revalidatePath("/admin/settings")
    revalidatePath("/sobre")
    revalidatePath("/contato")

    return { success: "Configurações atualizadas com sucesso!" }
  } catch (error) {
    console.error(error)
    return { error: "Erro ao atualizar configurações" }
  }
}
