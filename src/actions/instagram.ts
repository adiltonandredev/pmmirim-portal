"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { logAdminAction } from "@/lib/audit" // <--- O Espião

// ==========================================
// 1. Salvar Configurações (Token e Usuário)
// ==========================================
export async function saveInstagramSettings(formData: FormData) {
  try {
    const accessToken = formData.get("accessToken") as string
    const username = formData.get("username") as string
    const enabled = formData.get("enabled") === "on"

    // Verifica se já existe, se não cria, se sim atualiza (Padrão Singleton)
    const existing = await prisma.instagramSettings.findFirst()

    if (existing) {
      await prisma.instagramSettings.update({
        where: { id: existing.id },
        data: { accessToken, username, enabled }
      })
    } else {
      await prisma.instagramSettings.create({
        data: { accessToken, username, enabled }
      })
    }

    // Log de Auditoria
    const status = enabled ? "Ativado" : "Desativado"
    await logAdminAction("EDITOU", "Instagram", `Status: ${status}, Conta: ${username || "Sem nome"}`);

    revalidatePath("/") // Atualiza a home para refletir se o Instagram vai aparecer ou sumir
    revalidatePath("/admin/instagram")
    
    return { success: true, message: "Integração com o Instagram salva com sucesso!" }

  } catch (error) {
    console.error("Erro ao salvar configurações do Instagram:", error)
    return { success: false, message: "Erro interno ao salvar as configurações." }
  }
}

// ==========================================
// 2. Buscar Fotos do Instagram (Para o componente da Home)
// NOTA: Esta função mantém o retorno original (Array) para não quebrar a UI do site.
// ==========================================
export async function getInstagramFeed() {
  try {
    const settings = await prisma.instagramSettings.findFirst()

    if (!settings || !settings.enabled || !settings.accessToken) {
      return []
    }

    // URL da API do Instagram
    const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${settings.accessToken}&limit=8`

    const response = await fetch(url, { next: { revalidate: 3600 } }) // Cache de alta performance por 1 hora
    
    if (!response.ok) {
      console.error("Erro ao buscar Instagram da API oficial:", await response.text())
      return []
    }

    const data = await response.json()
    return data.data || []

  } catch (error) {
    console.error("Erro no feed do Instagram:", error)
    return []
  }
}