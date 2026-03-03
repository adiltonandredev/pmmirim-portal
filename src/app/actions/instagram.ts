"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// 1. Salvar Configurações (Token e Usuário)
export async function saveInstagramSettings(formData: FormData) {
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

  revalidatePath("/") // Atualiza a home
  revalidatePath("/admin/instagram")
  return { success: true }
}

// 2. Buscar Fotos do Instagram (Para o componente da Home)
export async function getInstagramFeed() {
  try {
    const settings = await prisma.instagramSettings.findFirst()

    if (!settings || !settings.enabled || !settings.accessToken) {
      return []
    }

    // URL da API do Instagram
    const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${settings.accessToken}&limit=8`

    const response = await fetch(url, { next: { revalidate: 3600 } }) // Cache por 1 hora
    
    if (!response.ok) {
      console.error("Erro ao buscar Instagram:", await response.text())
      return []
    }

    const data = await response.json()
    return data.data || []

  } catch (error) {
    console.error("Erro no feed do Instagram:", error)
    return []
  }
}