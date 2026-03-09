"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { saveFile } from "@/lib/file-upload"
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { logAdminAction } from "@/lib/audit" // <--- O Espião

// --- CREATE ---
export async function createBoardMember(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const position = formData.get("position") as string
    const bio = formData.get("bio") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    
    if (!name || !position) {
        return { success: false, message: "Nome e Cargo são obrigatórios." }
    }

    // SALVA NA PASTA "board"
    const file = formData.get("photo") as File
    let photoUrl = null;

    if (file && file.size > 0) {
        photoUrl = await saveFile(file, "board")
    }
    
    // Se não fez upload, verifica se mandou URL manual (se houver essa opção)
    if (!photoUrl) {
        photoUrl = (formData.get("photoUrl") as string) || null
    }

    const active = formData.get("active") === "on"
    const order = parseInt(formData.get("order") as string) || 0

    await prisma.boardMember.create({
      data: {
        name,
        position,
        bio,
        email,
        phone,
        photoUrl,
        active,
        order
      },
    })

    // Log de Auditoria
    await logAdminAction("CRIOU", "Membro da Diretoria", `Nome: ${name} (${position})`);

    revalidatePath("/instituicao/diretoria")
    revalidatePath("/admin/diretoria")
    
    return { success: true, message: "Membro da diretoria cadastrado com sucesso!" }

  } catch (error) {
    console.error("Erro ao criar membro da diretoria:", error)
    return { success: false, message: "Erro interno ao salvar membro da diretoria." }
  }
}

// --- UPDATE ---
export async function updateBoardMember(id: string, formData: FormData) {
  try {
    if (!id) {
        return { success: false, message: "ID do membro não encontrado." }
    }

    const name = formData.get("name") as string
    const position = formData.get("position") as string
    const bio = formData.get("bio") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    
    const file = formData.get("photo") as File
    let photoUrl = formData.get("existingPhotoUrl") as string

    // Atualiza a foto se uma nova foi enviada
    if (file && file.size > 0) {
        const uploadedPath = await saveFile(file, "board")
        if (uploadedPath) photoUrl = uploadedPath
    }

    const active = formData.get("active") === "on"
    const order = parseInt(formData.get("order") as string) || 0

    await prisma.boardMember.update({
      where: { id },
      data: {
        name,
        position,
        bio,
        email,
        phone,
        photoUrl,
        active,
        order
      },
    })

    // Log de Auditoria
    await logAdminAction("EDITOU", "Membro da Diretoria", `Nome: ${name}`);

    revalidatePath("/instituicao/diretoria")
    revalidatePath("/admin/diretoria")
    
    return { success: true, message: "Membro da diretoria atualizado com sucesso!" }

  } catch (error) {
    console.error("Erro ao atualizar membro da diretoria:", error)
    return { success: false, message: "Erro interno ao atualizar membro." }
  }
}

// --- DELETE ---
export async function deleteBoardMember(id: string) {
  try {
    if (!id) {
        return { success: false, message: "ID inválido para exclusão." }
    }

    // 1. Busca os dados primeiro para limpar a foto
    const member = await prisma.boardMember.findUnique({ where: { id } })
    
    // 2. Tenta deletar a foto física
    if (member?.photoUrl) {
        try {
            const filePath = join(process.cwd(), "public", member.photoUrl)
            if (existsSync(filePath)) await unlink(filePath)
        } catch (e) {
            console.error("Erro ao excluir foto do membro:", e)
        }
    }

    // 3. Deleta do banco
    await prisma.boardMember.delete({ where: { id } })

    // Log de Auditoria
    await logAdminAction("EXCLUIU", "Membro da Diretoria", `Nome: ${member?.name || "ID: " + id}`);

    revalidatePath("/instituicao/diretoria")
    revalidatePath("/admin/diretoria")

    return { success: true, message: "Membro excluído com sucesso!" }

  } catch (error) {
    console.error("Erro ao excluir membro da diretoria:", error)
    return { success: false, message: "Erro ao excluir. O registro pode estar em uso." }
  }
}

// --- TOGGLE ACTIVE ---
export async function toggleBoardMemberActive(id: string, currentStatus: boolean) {
  try {
    if (!id) {
        return { success: false, message: "ID do membro não fornecido." }
    }

    await prisma.boardMember.update({
      where: { id },
      data: { active: !currentStatus },
    })

    const statusName = !currentStatus ? "Ativado" : "Inativado"
    await logAdminAction("EDITOU", "Membro da Diretoria", `Alterou status para: ${statusName}`);

    revalidatePath("/instituicao/diretoria")
    revalidatePath("/admin/diretoria")

    return { success: true, message: `Membro ${statusName.toLowerCase()} com sucesso!` }

  } catch (error) {
    console.error("Erro ao alternar status do membro:", error)
    return { success: false, message: "Erro ao alterar o status do membro." }
  }
}