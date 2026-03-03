"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { saveFile } from "@/lib/file-upload" // <--- Importante

export async function createBirthday(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const role = formData.get("role") as string
    const dateStr = formData.get("date") as string 
    const active = formData.get("active") === "on"
    
    let birthDate = new Date();
    if (dateStr) {
        birthDate = new Date(`${dateStr}T12:00:00`);
    }

    // SALVA NA PASTA "birthdays"
    const file = formData.get("photoUrl") as File
    const photoUrl = await saveFile(file, "birthdays")

    if (!name || !dateStr) return { error: "Nome e Data são obrigatórios." }

    await prisma.birthday.create({
      data: {
        name,
        role,
        date: birthDate,
        photoUrl, // Salva o caminho /uploads/birthdays/...
        active
      }
    })

    revalidatePath("/admin/birthdays")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Erro ao criar:", error)
    return { error: "Erro ao salvar." }
  }
}

export async function updateBirthday(formData: FormData) {
  try {
    const id = formData.get("id") as string
    if (!id) return { error: "ID não encontrado." }

    const name = formData.get("name") as string
    const role = formData.get("role") as string
    const dateStr = formData.get("date") as string
    const active = formData.get("active") === "on"

    let birthDate = new Date();
    if (dateStr) {
        birthDate = new Date(`${dateStr}T12:00:00`);
    }

    // LÓGICA DE ATUALIZAÇÃO DE IMAGEM
    const file = formData.get("photoUrl") as File
    let photoUrl = formData.get("existingPhotoUrl") as string

    // Se enviou arquivo novo, salva e substitui
    if (file && file.size > 0) {
        photoUrl = await saveFile(file, "birthdays")
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

    revalidatePath("/admin/birthdays")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar:", error)
    return { error: "Erro ao atualizar." }
  }
}

export async function deleteBirthday(formData: FormData) {
  const id = formData.get("id") as string
  if (!id) return

  try {
    await prisma.birthday.delete({ where: { id } })
    revalidatePath("/admin/birthdays")
    revalidatePath("/")
  } catch (error) {
    console.error("Erro ao excluir:", error)
  }
}