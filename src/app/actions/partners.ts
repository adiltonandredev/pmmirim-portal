"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { saveFile } from "@/lib/file-upload"

// 1. Criar Parceiro
export async function createPartner(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const url = formData.get("url") as string
    const active = formData.get("active") === "on"
    
    // SALVA NA PASTA "partners"
    const file = formData.get("logoUrl") as File
    const logoUrl = await saveFile(file, "partners")

    if (!name) return { error: "Nome do parceiro é obrigatório." }

    await prisma.partner.create({
      data: {
        name,
        website: url || "",
        logoUrl,
        active,
      },
    })

    revalidatePath("/")
    revalidatePath("/admin/partners") // Adicionei para garantir
    return { success: true }
  } catch (error) {
    console.error("ERRO AO CRIAR PARCEIRO:", error)
    return { error: "Erro ao salvar parceiro." }
  }
}

// 2. Atualizar Parceiro
export async function updatePartner(formData: FormData) {
  try {
    const id = formData.get("id") as string
    if (!id) return { error: "ID não encontrado." }

    const name = formData.get("name") as string
    const url = formData.get("url") as string
    const active = formData.get("active") === "on"

    // ATUALIZAÇÃO DE IMAGEM
    const file = formData.get("logoUrl") as File
    let logoUrl = formData.get("existingLogoUrl") as string

    if (file && file.size > 0) {
        logoUrl = await saveFile(file, "partners")
    }

    await prisma.partner.update({
      where: { id },
      data: {
        name,
        url,
        logoUrl,
        active,
      },
    })

    revalidatePath("/")
    revalidatePath("/admin/partners")
    return { success: true }

  } catch (error) {
    console.error("ERRO AO ATUALIZAR PARCEIRO:", error)
    return { error: "Erro ao atualizar parceiro." }
  }
}

// 3. Deletar (Padronizado para FormData)
export async function deletePartner(formData: FormData) {
  const id = formData.get("id") as string
  if (!id) return

  try {
    await prisma.partner.delete({ where: { id } })
    revalidatePath("/admin/partners")
    revalidatePath("/")
  } catch (error) {
    console.error("Erro ao deletar:", error)
  }
}