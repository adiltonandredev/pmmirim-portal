"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { saveFile } from "@/lib/file-upload"

function generateSlug(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-");
}

export async function createProject(formData: FormData) {
  try {
    const title = formData.get("title") as string
    const summary = formData.get("summary") as string
    const content = formData.get("content") as string
    const published = formData.get("published") === "on"
    
    let slug = generateSlug(title);
    const slugExists = await prisma.post.findUnique({ where: { slug } });
    if (slugExists) slug = `${slug}-${Date.now()}`;

    // SALVA NA PASTA "projects"
    const file = formData.get("coverImage") as File
    const coverImage = await saveFile(file, "projects")

    if (!title) return { error: "O título do projeto é obrigatório." }

    await prisma.post.create({
      data: {
        title,
        slug,
        summary: summary || "",
        content: content || "",
        coverImage,
        published,
        type: "PROJECT",
        featured: false
      }
    })

    revalidatePath("/admin/institution/projects")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Erro ao criar projeto:", error)
    return { error: "Erro ao salvar projeto." }
  }
}

export async function updateProject(formData: FormData) {
  try {
    const id = formData.get("id") as string
    if (!id) return { error: "ID não encontrado." }

    const title = formData.get("title") as string
    const summary = formData.get("summary") as string
    const content = formData.get("content") as string
    const published = formData.get("published") === "on"

    // ATUALIZAÇÃO IMAGEM
    const file = formData.get("coverImage") as File
    let coverImage = formData.get("existingCoverImage") as string
    
    if (file && file.size > 0) {
        coverImage = await saveFile(file, "projects")
    }

    await prisma.post.update({
      where: { id },
      data: {
        title,
        summary,
        content,
        coverImage,
        published
      }
    })

    revalidatePath("/admin/institution/projects")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar:", error)
    return { error: "Erro ao atualizar." }
  }
}

export async function deleteProject(formData: FormData) {
  const id = formData.get("id") as string
  if (!id) return

  try {
    await prisma.post.delete({ where: { id } })
    revalidatePath("/admin/institution/projects")
    revalidatePath("/")
  } catch (error) {
    console.error("Erro ao excluir:", error)
  }
}