"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { saveFile } from "@/lib/file-upload"
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { logAdminAction } from "@/lib/audit" // <--- O Espião

// --- CRIAR PARCEIRO ---
export async function createPartner(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const url = formData.get("url") as string
    const active = formData.get("active") === "on"
    
    if (!name) {
        return { success: false, message: "O nome do parceiro é obrigatório." }
    }

    // SALVA NA PASTA "partners"
    const file = formData.get("logoUrl") as File
    let logoUrl = null;
    if (file && file.size > 0) {
        logoUrl = await saveFile(file, "partners")
    }

    await prisma.partner.create({
      data: {
        name,
        website: url || "",
        logoUrl: logoUrl || "",
        active,
      },
    })

    // Log de Auditoria
    await logAdminAction("CRIOU", "Parceiro", `Nome: ${name}`);

    revalidatePath("/")
    revalidatePath("/admin/partners") 
    revalidatePath("/parceiros") 
    
    return { success: true, message: "Parceiro cadastrado com sucesso!" }

  } catch (error) {
    console.error("ERRO AO CRIAR PARCEIRO:", error)
    return { success: false, message: "Erro interno ao salvar o parceiro." }
  }
}

// --- ATUALIZAR PARCEIRO ---
export async function updatePartner(formData: FormData) {
  try {
    const id = formData.get("id") as string
    if (!id) {
        return { success: false, message: "ID do parceiro não encontrado." }
    }

    const name = formData.get("name") as string
    const url = formData.get("url") as string
    const active = formData.get("active") === "on"

    // ATUALIZAÇÃO DE IMAGEM
    const file = formData.get("logoUrl") as File
    let logoUrl = formData.get("existingLogoUrl") as string

    if (file && file.size > 0) {
        const uploadedPath = await saveFile(file, "partners")
        if (uploadedPath) logoUrl = uploadedPath
    }

    await prisma.partner.update({
      where: { id },
      data: {
        name,
        website: url || "",
        logoUrl,
        active,
      },
    })

    // Log de Auditoria
    await logAdminAction("EDITOU", "Parceiro", `Nome: ${name}`);

    revalidatePath("/")
    revalidatePath("/admin/partners")
    revalidatePath("/parceiros") 
    
    return { success: true, message: "Parceiro atualizado com sucesso!" }

  } catch (error) {
    console.error("ERRO AO ATUALIZAR PARCEIRO:", error)
    return { success: false, message: "Erro interno ao atualizar parceiro." }
  }
}

// --- DELETAR PARCEIRO ---
export async function deletePartner(formData: FormData) {
  try {
    const id = formData.get("id") as string
    if (!id) {
        return { success: false, message: "ID inválido para exclusão." }
    }

    // 1. Busca os dados primeiro para limpar a logo física
    const partner = await prisma.partner.findUnique({ where: { id } })
    
    // 2. Tenta deletar a logo do HD
    if (partner?.logoUrl) {
        try {
            const filePath = join(process.cwd(), "public", partner.logoUrl)
            if (existsSync(filePath)) await unlink(filePath)
        } catch (e) {
            console.error("Erro ao excluir arquivo físico da logo:", e)
        }
    }

    // 3. Deleta do banco
    await prisma.partner.delete({ where: { id } })
    
    // Log de Auditoria
    await logAdminAction("EXCLUIU", "Parceiro", `Nome: ${partner?.name || "ID: " + id}`);

    revalidatePath("/admin/partners")
    revalidatePath("/")
    revalidatePath("/parceiros") 
    
    return { success: true, message: "Parceiro excluído com sucesso!" }

  } catch (error) {
    console.error("Erro ao deletar parceiro:", error)
    return { success: false, message: "Erro ao excluir o parceiro. Ele pode estar em uso." }
  }
}