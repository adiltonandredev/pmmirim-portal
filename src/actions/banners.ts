"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { saveFile } from "@/lib/file-upload"
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { logAdminAction } from "@/lib/audit"

type BannerType = "HOME" | "PARTNER" | "SPONSOR";

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

    if (!imageUrl) {
      return { success: false, message: "A imagem do banner é obrigatória." }
    }

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

    await logAdminAction("CRIOU", "Banner", `Título: ${title} (${type})`);

    revalidatePath("/")
    revalidatePath("/parceiros")
    revalidatePath("/admin/banners")
    
    return { success: true, message: "Banner criado com sucesso!" }

  } catch (error) {
    console.error("Erro ao criar banner:", error)
    return { success: false, message: "Erro interno ao salvar o banner." }
  }
}

// --- UPDATE ---
export async function updateBanner(formData: FormData) {
  try {
    const id = formData.get("id") as string
    if (!id) {
      return { success: false, message: "ID do banner não encontrado." }
    }

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const link = formData.get("link") as string
    const type = formData.get("type") as BannerType
    const order = parseInt(formData.get("order") as string) || 0
    const active = formData.get("active") === "on"
    
    const file = formData.get("image") as File
    let imageUrl = formData.get("existingImageUrl") as string

    if (file && file.size > 0) {
        imageUrl = await saveFile(file, "banners") || imageUrl
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

    await logAdminAction("EDITOU", "Banner", `Título: ${title}`);

    revalidatePath("/")
    revalidatePath("/parceiros")
    revalidatePath("/admin/banners")
    
    return { success: true, message: "Banner atualizado com sucesso!" }

  } catch (error) {
    console.error("Erro ao atualizar banner:", error)
    return { success: false, message: "Erro interno ao atualizar o banner." }
  }
}

// --- DELETE ---
export async function deleteBanner(data: string | FormData) {
  try {
    const id = getId(data)
    if (!id) {
      return { success: false, message: "ID inválido para exclusão." }
    }

    const banner = await prisma.banner.findUnique({ where: { id } })
    
    if (banner?.imageUrl) {
        try {
            const filePath = join(process.cwd(), "public", banner.imageUrl)
            if (existsSync(filePath)) await unlink(filePath)
        } catch (e) {
            console.error("Erro ao excluir arquivo físico:", e)
        }
    }

    await prisma.banner.delete({ where: { id } })
    
    await logAdminAction("EXCLUIU", "Banner", `Título: ${banner?.title || "ID: " + id}`);

    revalidatePath("/admin/banners")
    revalidatePath("/")
    
    return { success: true, message: "Banner excluído com sucesso!" }
    
  } catch (error) {
    console.error("Erro ao excluir banner:", error)
    return { success: false, message: "Erro ao excluir o banner. Ele pode estar em uso." }
  }
}

// --- TOGGLE ACTIVE ---
export async function toggleBannerActive(id: string, currentState: boolean) {
    try {
      if (!id) {
        return { success: false, message: "ID do banner não fornecido." }
      }
  
      await prisma.banner.update({
        where: { id },
        data: { active: !currentState }
      })

      const statusName = !currentState ? "Ativado" : "Inativado"
      await logAdminAction("EDITOU", "Banner", `Alterou status para: ${statusName}`);
        
      revalidatePath("/admin/banners")
      revalidatePath("/")
      
      return { success: true, message: `Banner ${statusName.toLowerCase()} com sucesso!` }
      
    } catch (error) {
      console.error("Erro ao alternar banner:", error)
      return { success: false, message: "Erro ao alterar o status do banner." }
    }
}