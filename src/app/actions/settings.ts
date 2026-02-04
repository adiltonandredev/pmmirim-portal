'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { saveFile } from "@/lib/file-upload"
// 👇 1. IMPORTAÇÃO
import { logAdminAction } from "@/lib/audit"

export async function updateSettings(formData: FormData) {
  try {
    const existing = await prisma.siteSettings.findFirst()
    
    const data = {
      siteName: formData.get("siteName") as string,
      description: formData.get("description") as string,
      legalName: formData.get("legalName") as string,
      cnpj: formData.get("cnpj") as string,
      businessHours: formData.get("businessHours") as string,
      contactEmail: formData.get("contactEmail") as string,
      contactPhone: formData.get("contactPhone") as string,
      address: formData.get("address") as string,
      instagramUrl: formData.get("instagramUrl") as string,
      facebookUrl: formData.get("facebookUrl") as string,
      youtubeUrl: formData.get("youtubeUrl") as string,
      impactedYouth: formData.get("impactedYouth") as string,
      yearsOfHistory: formData.get("yearsOfHistory") as string,
    }

    const file = formData.get("logo") as File
    let logoUrl = existing?.logoUrl

    if (file && file.size > 0) {
        logoUrl = await saveFile(file, "settings")
    }

    if (existing) {
      await prisma.siteSettings.update({
        where: { id: existing.id },
        data: { ...data, ...(logoUrl && { logoUrl }) }
      })
    } else {
      await prisma.siteSettings.create({
        data: { ...data, logoUrl }
      })
    }

    // 👇 2. LOG DE ALTERAÇÃO GERAL
    await logAdminAction("EDITOU", "Configurações", "Atualizou dados institucionais do site");

    revalidatePath("/")
    revalidatePath("/admin/settings")
    revalidatePath("/projetos")
    
    return { success: true }

  } catch (error) {
    console.error("Erro ao salvar configurações:", error)
    return { error: "Falha ao salvar as configurações." }
  }
}

export async function updateInstagramSettings(formData: FormData) {
  try {
    const id = formData.get("id") as string
    let existing = null;

    if (id) {
       existing = await prisma.instagramSettings.findUnique({ where: { id } })
    } else {
       existing = await prisma.instagramSettings.findFirst()
    }

    const data = {
      username: formData.get("username") as string,
      accessToken: formData.get("accessToken") as string,
      showFeed: formData.get("showFeed") === "on", 
    }

    if (existing) {
      await prisma.instagramSettings.update({ where: { id: existing.id }, data })
    } else {
      await prisma.instagramSettings.create({ data })
    }
    
    // 👇 3. LOG DE ALTERAÇÃO DO INSTAGRAM
    await logAdminAction("EDITOU", "Instagram", `Usuário: ${data.username}`);

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Erro Instagram:", error)
    return { error: "Erro ao salvar dados do Instagram." }
  }
}