"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { saveFile } from "@/lib/file-upload"

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
    
    // SALVA NA PASTA "team"
    const file = formData.get("image") as File
    const image = await saveFile(file, "team")

    if (!name) return { error: "Nome é obrigatório." }

    await prisma.teamMember.create({
      data: { name, role, category, bio, image, instagram, email, order }
    })

    revalidatePath("/admin/institution/team")
    revalidatePath("/instituicao/equipe")
    revalidatePath("/instituicao/diretoria") 
    return { success: true }
  } catch (error) {
    console.error("Erro ao criar membro:", error)
    return { error: "Erro ao salvar." }
  }
}

// 2. ATUALIZAR MEMBRO
export async function updateTeamMember(formData: FormData) {
  try {
    const id = formData.get("id") as string
    if (!id) return { error: "ID não encontrado." }

    const name = formData.get("name") as string
    const role = formData.get("role") as string
    const category = formData.get("category") as string
    const bio = formData.get("bio") as string
    const instagram = formData.get("instagram") as string
    const email = formData.get("email") as string
    const order = parseInt(formData.get("order") as string || "0")

    const file = formData.get("image") as File
    let image = formData.get("existingImage") as string
    
    if (file && file.size > 0) {
        image = await saveFile(file, "team")
    }

    await prisma.teamMember.update({
      where: { id },
      data: { name, role, category, bio, image, instagram, email, order }
    })

    revalidatePath("/admin/institution/team")
    revalidatePath("/instituicao/equipe")
    revalidatePath("/instituicao/diretoria")
    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar membro:", error)
    return { error: "Erro ao atualizar." }
  }
}

// 3. EXCLUIR MEMBRO
export async function deleteTeamMember(formData: FormData) {
  const id = formData.get("id") as string
  if (!id) return

  try {
    await prisma.teamMember.delete({ where: { id } })
    revalidatePath("/admin/institution/team")
    revalidatePath("/instituicao/equipe")
    revalidatePath("/instituicao/diretoria")
  } catch (error) {
    console.error("Erro ao excluir:", error)
  }
}

// 4. BUSCAR MEMBROS
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