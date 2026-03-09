"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { saveFile } from "@/lib/file-upload"
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { logAdminAction } from "@/lib/audit" // <--- O Espião

// Helper para deletar arquivos
async function tryDeleteFile(path: string) {
    try {
        const fullPath = join(process.cwd(), "public", path)
        if (existsSync(fullPath)) await unlink(fullPath)
    } catch (e) {
        console.error("Erro ao deletar arquivo físico:", e)
    }
}

// 1. CRIAR MEMBRO
export async function createTeamMember(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const role = formData.get("role") as string
    const category = formData.get("category") as string
    const bio = formData.get("bio") as string
    const instagram = formData.get("instagram") as string
    const email = formData.get("email") as string
    const order = parseInt(formData.get("order") as string || "0")
    
    if (!name) {
        return { success: false, message: "O nome do membro da equipe é obrigatório." }
    }

    // SALVA NA PASTA "team"
    const file = formData.get("image") as File
    let image = null;
    if (file && file.size > 0) {
        image = await saveFile(file, "team")
    }

    await prisma.teamMember.create({
      data: { name, role, category, bio, image, instagram, email, order }
    })

    // Log de Auditoria
    await logAdminAction("CRIOU", "Membro da Equipe", `Nome: ${name} (${role})`);

    revalidatePath("/admin/institution/team")
    revalidatePath("/instituicao/equipe")
    revalidatePath("/instituicao/diretoria") 
    
    return { success: true, message: "Membro da equipe cadastrado com sucesso!" }

  } catch (error) {
    console.error("Erro ao criar membro da equipe:", error)
    return { success: false, message: "Erro interno ao salvar membro da equipe." }
  }
}

// 2. ATUALIZAR MEMBRO
export async function updateTeamMember(formData: FormData) {
  try {
    const id = formData.get("id") as string
    if (!id) {
        return { success: false, message: "ID do membro não encontrado." }
    }

    const name = formData.get("name") as string
    const role = formData.get("role") as string
    const category = formData.get("category") as string
    const bio = formData.get("bio") as string
    const instagram = formData.get("instagram") as string
    const email = formData.get("email") as string
    const order = parseInt(formData.get("order") as string || "0")

    // Foto
    const file = formData.get("image") as File
    let image = formData.get("existingImage") as string
    
    if (file && file.size > 0) {
        const uploadedPath = await saveFile(file, "team")
        if (uploadedPath) image = uploadedPath
    }

    await prisma.teamMember.update({
      where: { id },
      data: { name, role, category, bio, image, instagram, email, order }
    })

    // Log de Auditoria
    await logAdminAction("EDITOU", "Membro da Equipe", `Nome: ${name}`);

    revalidatePath("/admin/institution/team")
    revalidatePath("/instituicao/equipe")
    revalidatePath("/instituicao/diretoria")
    
    return { success: true, message: "Membro da equipe atualizado com sucesso!" }

  } catch (error) {
    console.error("Erro ao atualizar membro da equipe:", error)
    return { success: false, message: "Erro interno ao atualizar membro." }
  }
}

// 3. EXCLUIR MEMBRO
export async function deleteTeamMember(formData: FormData) {
  try {
    const id = formData.get("id") as string
    if (!id) {
        return { success: false, message: "ID inválido para exclusão." }
    }

    // Busca o membro para limpar a foto do HD
    const member = await prisma.teamMember.findUnique({ where: { id } })
    
    if (member?.image) {
        await tryDeleteFile(member.image)
    }

    await prisma.teamMember.delete({ where: { id } })
    
    // Log de Auditoria
    await logAdminAction("EXCLUIU", "Membro da Equipe", `Nome: ${member?.name || "ID: " + id}`);

    revalidatePath("/admin/institution/team")
    revalidatePath("/instituicao/equipe")
    revalidatePath("/instituicao/diretoria")
    
    return { success: true, message: "Membro excluído com sucesso!" }

  } catch (error) {
    console.error("Erro ao excluir membro:", error)
    return { success: false, message: "Erro ao excluir o membro da equipe." }
  }
}

// 4. BUSCAR MEMBROS (MANTIDO O RETORNO ARRAY)
export async function getTeamMembers(category?: string) {
  try {
    const where = category ? { category } : {};
    const members = await prisma.teamMember.findMany({
      where,
      orderBy: { order: 'asc' }
    })
    return members
  } catch (error) {
    console.error("Erro ao buscar equipe:", error)
    return []
  }
}