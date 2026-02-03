"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { uploadImage } from "@/lib/upload" // Se usar upload, mantenha. Se der erro, remova esta linha.

// === ACTIONS PARA ALUNOS DESTAQUE ===

// DELETE (Corrigido para aceitar FormData)
export async function deleteFeaturedStudent(formData: FormData) {
  const id = formData.get("id") as string

  if (!id) return

  try {
    await prisma.featuredStudent.delete({
      where: { id },
    })

    revalidatePath("/admin/featured-student")
    revalidatePath("/")
  } catch (error) {
    console.error("Erro ao deletar aluno destaque:", error)
    // Não lançamos erro (throw) para não quebrar a página, apenas logamos
  }
}

// CREATE (Se precisar manter a criação aqui, use esta estrutura simplificada)
export async function createFeaturedStudent(formData: FormData) {
  try {
    const studentName = formData.get("studentName") as string
    const achievement = formData.get("achievement") as string
    const description = formData.get("description") as string
    const photoFile = formData.get("photoUrl") as File
    
    let photoUrl = ""
    // Adicione aqui sua lógica de upload se necessário, ou deixe vazio por enquanto
    
    await prisma.featuredStudent.create({
      data: {
        studentName,
        achievement,
        description,
        month: Number(formData.get("month")) || new Date().getMonth() + 1,
        year: Number(formData.get("year")) || new Date().getFullYear(),
        photoUrl,
        active: true
      }
    })
    
    revalidatePath("/admin/featured-student")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Erro ao criar" }
  }
}

// UPDATE (Se precisar manter a atualização aqui)
export async function updateFeaturedStudent(formData: FormData) {
  // Implemente conforme necessário ou mantenha vazio se já tiver outro arquivo
}