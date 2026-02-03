"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { saveFile } from "@/lib/file-upload"
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

type BannerType = "HOME" | "PARTNER" | "SPONSOR";

// HELPER: Pega o ID não importa se veio Texto ou FormData
function getId(data: string | FormData): string {
  if (typeof data === 'string') return data
  return data.get("id") as string
}

// --- CREATE ---
export async function createBanner(formData: FormData) {
  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const link = formData.get("link") as string
    const type = formData.get("type") as BannerType
    const order = parseInt(formData.get("order") as string) || 0
    const active = formData.get("active") === "on"
    
    const file = formData.get("image") as File
    const imageUrl = await saveFile(file, "banners")

    if (!imageUrl) return { error: "A imagem do banner é obrigatória." }

    await prisma.banner.create({
      data: {
        title,
        description,
        link,
        imageUrl,
        order,
        active,
        type: type || "HOME"
      }
    })

    revalidatePath("/")
    revalidatePath("/parceiros")
    revalidatePath("/admin/banners")
    return { success: true }

  } catch (error) {
    console.error("Erro ao criar banner:", error)
    return { error: "Erro ao salvar banner." }
  }
}

// --- UPDATE ---
export async function updateBanner(formData: FormData) {
  try {
    const id = formData.get("id") as string
    if (!id) return { error: "ID não encontrado." }

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const link = formData.get("link") as string
    const type = formData.get("type") as BannerType
    const order = parseInt(formData.get("order") as string) || 0
    const active = formData.get("active") === "on"
    
    const file = formData.get("image") as File
    let imageUrl = formData.get("existingImageUrl") as string

    if (file && file.size > 0) {
        imageUrl = await saveFile(file, "banners")
    }

    await prisma.banner.update({
      where: { id },
      data: {
        title,
        description,
        link,
        imageUrl,
        order,
        active,
        type
      }
    })

    revalidatePath("/")
    revalidatePath("/parceiros")
    revalidatePath("/admin/banners")
    return { success: true }

  } catch (error) {
    console.error("Erro ao atualizar banner:", error)
    return { error: "Erro ao atualizar." }
  }
}

// --- DELETE (CORRIGIDO / HÍBRIDO) ---
// Aceita 'data' sendo STRING (do .bind) ou FORMDATA (do botão DeleteButton)
export async function deleteBanner(data: string | FormData) {
  const id = getId(data)
  if (!id) return

  try {
    const banner = await prisma.banner.findUnique({ where: { id } })
    if (banner?.imageUrl) {
        try {
            const filePath = join(process.cwd(), "public", banner.imageUrl)
            if (existsSync(filePath)) await unlink(filePath)
        } catch (e) {}
    }

    await prisma.banner.delete({ where: { id } })
    
    revalidatePath("/admin/banners")
    revalidatePath("/")
  } catch (error) {
    console.error("Erro ao excluir banner:", error)
  }
}

// --- TOGGLE ACTIVE ---
export async function toggleBannerActive(id: string, currentState: boolean) {
    if (!id) return
  
    try {
      await prisma.banner.update({
        where: { id },
        data: { active: !currentState }
      })
        
      revalidatePath("/admin/banners")
      revalidatePath("/")
      
    } catch (error) {
      console.error("Erro ao alternar banner:", error)
    }
}