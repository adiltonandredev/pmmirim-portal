"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { saveFile } from "@/lib/file-upload"
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { logAdminAction } from "@/lib/audit" // <--- O Espião

// --- CREATE ---
export async function createBirthday(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const role = formData.get("role") as string
    const dateStr = formData.get("date") as string 
    const active = formData.get("active") === "on"
    
    if (!name || !dateStr) {
      return { success: false, message: "Nome e Data são obrigatórios." }
    }

    let birthDate = new Date();
    if (dateStr) {
        birthDate = new Date(`${dateStr}T12:00:00`);
    }

    const file = formData.get("photoUrl") as File
    let photoUrl = null;
    
    if (file && file.size > 0) {
        photoUrl = await saveFile(file, "birthdays")
    }

    await prisma.birthday.create({
      data: {
        name,
        role,
        date: birthDate,
        photoUrl,
        active
      }
    })

    // Log de Auditoria
    await logAdminAction("CRIOU", "Aniversariante", `Nome: ${name}`);

    revalidatePath("/admin/birthdays")
    revalidatePath("/")
    
    return { success: true, message: "Aniversariante cadastrado com sucesso!" }

  } catch (error) {
    console.error("Erro ao criar aniversariante:", error)
    return { success: false, message: "Erro interno ao salvar aniversariante." }
  }
}

// --- UPDATE ---
export async function updateBirthday(formData: FormData) {
  try {
    const id = formData.get("id") as string
    if (!id) {
        return { success: false, message: "ID do aniversariante não encontrado." }
    }

    const name = formData.get("name") as string
    const role = formData.get("role") as string
    const dateStr = formData.get("date") as string
    const active = formData.get("active") === "on"

    let birthDate = new Date();
    if (dateStr) {
        birthDate = new Date(`${dateStr}T12:00:00`);
    }

    const file = formData.get("photoUrl") as File
    let photoUrl = formData.get("existingPhotoUrl") as string

    if (file && file.size > 0) {
        const uploadedPath = await saveFile(file, "birthdays")
        if (uploadedPath) photoUrl = uploadedPath
    }

    await prisma.birthday.update({
      where: { id },
      data: {
        name,
        role,
        date: birthDate,
        photoUrl,
        active
      }
    })

    // Log de Auditoria
    await logAdminAction("EDITOU", "Aniversariante", `Nome: ${name}`);

    revalidatePath("/admin/birthdays")
    revalidatePath("/")
    
    return { success: true, message: "Aniversariante atualizado com sucesso!" }

  } catch (error) {
    console.error("Erro ao atualizar aniversariante:", error)
    return { success: false, message: "Erro interno ao atualizar." }
  }
}

// --- DELETE ---
export async function deleteBirthday(formData: FormData) {
  try {
    const id = formData.get("id") as string
    if (!id) {
        return { success: false, message: "ID inválido para exclusão." }
    }

    // 1. Busca os dados primeiro para saber qual é a foto e o nome
    const birthday = await prisma.birthday.findUnique({ where: { id } })
    
    // 2. Tenta deletar a foto do HD se ela existir
    if (birthday?.photoUrl) {
        try {
            const filePath = join(process.cwd(), "public", birthday.photoUrl)
            if (existsSync(filePath)) await unlink(filePath)
        } catch (e) {
            console.error("Erro ao excluir arquivo físico da foto:", e)
        }
    }

    // 3. Deleta do banco de dados
    await prisma.birthday.delete({ where: { id } })
    
    // Log de Auditoria
    await logAdminAction("EXCLUIU", "Aniversariante", `Nome: ${birthday?.name || "ID: " + id}`);

    revalidatePath("/admin/birthdays")
    revalidatePath("/")
    
    return { success: true, message: "Aniversariante excluído com sucesso!" }

  } catch (error) {
    console.error("Erro ao excluir aniversariante:", error)
    return { success: false, message: "Erro interno ao excluir. Verifique se está em uso." }
  }
}