"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { saveFile } from "@/lib/file-upload"
import { logAdminAction } from "@/lib/audit"

// --- ATUALIZAR CONFIGURAÇÕES GERAIS ---
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
        const uploadedPath = await saveFile(file, "settings")
        if (uploadedPath) logoUrl = uploadedPath
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

    // Log de Auditoria
    await logAdminAction("EDITOU", "Configurações Globais", "Atualizou dados institucionais do site");

    // Revalidação em massa (já que afeta o rodapé e cabeçalho de todas as páginas)
    revalidatePath("/", "layout")
    revalidatePath("/admin/settings")
    revalidatePath("/projetos")
    
    return { success: true, message: "Configurações salvas com sucesso!" }

  } catch (error) {
    console.error("Erro ao salvar configurações:", error)
    return { success: false, message: "Falha interna ao salvar as configurações." }
  }
}

// --- ATUALIZAR INSTAGRAM (LEGADO/DUPLICADO) ---
// Nota: Parece que você tem essa função aqui e também em outro arquivo (instagram.ts). 
// Recomendo manter apenas em um lugar, mas padronizei esta aqui também!
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
      enabled: formData.get("showFeed") === "on", // Adaptei o nome para bater com o banco
    }

    if (existing) {
      await prisma.instagramSettings.update({ where: { id: existing.id }, data })
    } else {
      await prisma.instagramSettings.create({ data })
    }
    
    // Log de Auditoria
    await logAdminAction("EDITOU", "Configurações do Instagram", `Usuário: ${data.username || "Desconhecido"}`);

    revalidatePath("/")
    revalidatePath("/admin/settings")
    
    return { success: true, message: "Configurações do Instagram salvas com sucesso!" }
    
  } catch (error) {
    console.error("Erro Instagram:", error)
    return { success: false, message: "Erro interno ao salvar dados do Instagram." }
  }
}