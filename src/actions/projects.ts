"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { saveFile } from "@/lib/file-upload"
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { logAdminAction } from "@/lib/audit" // <--- O Espião

function generateSlug(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-");
}

export async function createProject(formData: FormData) {
  try {
    const title = formData.get("title") as string
    const summary = formData.get("summary") as string
    const content = formData.get("content") as string
    const published = formData.get("published") === "on"
    
    if (!title) {
        return { success: false, message: "O título do projeto é obrigatório." }
    }

    let slug = generateSlug(title);
    const slugExists = await prisma.post.findUnique({ where: { slug } });
    if (slugExists) slug = `${slug}-${Date.now().toString().slice(-4)}`;

    // SALVA NA PASTA "projects"
    const file = formData.get("coverImage") as File
    let coverImage = null;
    
    if (file && file.size > 0) {
        coverImage = await saveFile(file, "projects")
    }

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

    // Log de Auditoria
    await logAdminAction("CRIOU", "Projeto", `Título: ${title}`);

    revalidatePath("/admin/institution/projects")
    revalidatePath("/")
    revalidatePath("/projetos") // Garantindo que a listagem de projetos atualize
    
    return { success: true, message: "Projeto criado com sucesso!" }

  } catch (error) {
    console.error("Erro ao criar projeto:", error)
    return { success: false, message: "Erro interno ao salvar o projeto." }
  }
}

export async function updateProject(formData: FormData) {
  try {
    const id = formData.get("id") as string
    if (!id) {
        return { success: false, message: "ID do projeto não encontrado." }
    }

    const title = formData.get("title") as string
    const summary = formData.get("summary") as string
    const content = formData.get("content") as string
    const published = formData.get("published") === "on"

    // ATUALIZAÇÃO IMAGEM
    const file = formData.get("coverImage") as File
    let coverImage = formData.get("existingCoverImage") as string
    
    if (file && file.size > 0) {
        const uploadedPath = await saveFile(file, "projects")
        if (uploadedPath) coverImage = uploadedPath
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

    // Log de Auditoria
    await logAdminAction("EDITOU", "Projeto", `Título: ${title}`);

    revalidatePath("/admin/institution/projects")
    revalidatePath("/")
    revalidatePath("/projetos")
    
    return { success: true, message: "Projeto atualizado com sucesso!" }

  } catch (error) {
    console.error("Erro ao atualizar projeto:", error)
    return { success: false, message: "Erro interno ao atualizar o projeto." }
  }
}

export async function deleteProject(formData: FormData) {
  try {
    const id = formData.get("id") as string
    if (!id) {
        return { success: false, message: "ID inválido para exclusão." }
    }

    // Busca a capa do projeto
    const project = await prisma.post.findUnique({ where: { id } })
    
    // Tenta deletar a capa física
    if (project?.coverImage) {
        try {
            const filePath = join(process.cwd(), "public", project.coverImage)
            if (existsSync(filePath)) await unlink(filePath)
        } catch (e) {
            console.error("Erro ao excluir imagem do projeto do disco:", e)
        }
    }

    await prisma.post.delete({ where: { id } })
    
    // Log de Auditoria
    await logAdminAction("EXCLUIU", "Projeto", `Título: ${project?.title || "ID: " + id}`);

    revalidatePath("/admin/institution/projects")
    revalidatePath("/")
    revalidatePath("/projetos")
    
    return { success: true, message: "Projeto excluído com sucesso!" }

  } catch (error) {
    console.error("Erro ao excluir projeto:", error)
    return { success: false, message: "Erro ao excluir o projeto. Ele pode estar em uso." }
  }
}