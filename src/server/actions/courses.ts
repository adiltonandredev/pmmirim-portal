"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { saveFile } from "@/lib/file-upload"
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { logAdminAction } from "@/lib/audit" // <--- O Espião

// 1. CRIAR CURSO
export async function createCourse(formData: FormData) {
  try {
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      content: formData.get("content") as string,
      duration: formData.get("duration") as string,
      targetAge: formData.get("targetAge") as string,
      sponsorName: formData.get("sponsorName") as string,
      active: formData.get("active") === "on",
    }

    if (!data.title) {
      return { success: false, message: "O título do curso é obrigatório." }
    }

    // SALVA NA PASTA "courses"
    const coverFile = formData.get("coverImage") as File
    let coverImage = null;
    if (coverFile && coverFile.size > 0) {
      coverImage = await saveFile(coverFile, "courses")
    }

    const sponsorFile = formData.get("sponsorLogo") as File
    let sponsorLogo = null;
    if (sponsorFile && sponsorFile.size > 0) {
      sponsorLogo = await saveFile(sponsorFile, "courses")
    }

    // Gera o slug automaticamente
    const slug = data.title
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") + "-" + Date.now().toString().slice(-4);

    await prisma.course.create({
      data: {
        ...data,
        slug,
        coverImage,
        sponsorLogo,
        featured: false,
      },
    })

    // Log de Auditoria
    await logAdminAction("CRIOU", "Curso", `Título: ${data.title}`);

    revalidatePath("/admin/courses")
    revalidatePath("/cursos")

    return { success: true, message: "Curso criado com sucesso!" }

  } catch (error) {
    console.error("Error creating course:", error)
    return { success: false, message: "Erro interno ao salvar curso." }
  }
}

// 2. ATUALIZAR CURSO
export async function updateCourse(formData: FormData) {
  try {
    const id = formData.get("id") as string
    if (!id) {
      return { success: false, message: "ID do curso não encontrado." }
    }

    // Atualiza Capa
    const coverFile = formData.get("coverImage") as File
    let coverImage = formData.get("existingCoverImage") as string
    if (coverFile && coverFile.size > 0) {
      const uploadedPath = await saveFile(coverFile, "courses")
      if (uploadedPath) coverImage = uploadedPath
    }

    // Atualiza Logo Patrocinador
    const sponsorFile = formData.get("sponsorLogo") as File
    let sponsorLogo = formData.get("existingSponsorLogo") as string
    if (sponsorFile && sponsorFile.size > 0) {
      const uploadedPath = await saveFile(sponsorFile, "courses")
      if (uploadedPath) sponsorLogo = uploadedPath
    }

    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      content: formData.get("content") as string,
      duration: formData.get("duration") as string,
      targetAge: formData.get("targetAge") as string,
      sponsorName: formData.get("sponsorName") as string,
      active: formData.get("active") === "on",
      coverImage,
      sponsorLogo,
    }

    await prisma.course.update({ where: { id }, data })

    // Log de Auditoria
    await logAdminAction("EDITOU", "Curso", `Título: ${data.title}`);

    revalidatePath("/admin/courses")
    revalidatePath("/cursos")

    return { success: true, message: "Curso atualizado com sucesso!" }

  } catch (error) {
    console.error("Error updating course:", error)
    return { success: false, message: "Erro interno ao atualizar curso." }
  }
}

// 3. EXCLUIR CURSO
export async function deleteCourse(data: string | FormData) {
  try {
    // Captura o ID de forma inteligente: se for string usa direto, se for FormData extrai o campo "id"
    const id = typeof data === "string" ? data : (data.get("id") as string)

    if (!id) {
      return { success: false, message: "ID inválido para exclusão." }
    }

    // 1. Busca os dados para limpar os arquivos físicos
    const course = await prisma.course.findUnique({ where: { id } })

    // 2. Deleta a imagem de capa se existir
    if (course?.coverImage) {
      try {
        const filePath = join(process.cwd(), "public", course.coverImage)
        if (existsSync(filePath)) await unlink(filePath)
      } catch (e) {
        console.error("Erro ao excluir foto de capa do curso:", e)
      }
    }

    // 3. Deleta a logo do patrocinador se existir
    if (course?.sponsorLogo) {
      try {
        const filePath = join(process.cwd(), "public", course.sponsorLogo)
        if (existsSync(filePath)) await unlink(filePath)
      } catch (e) {
        console.error("Erro ao excluir logo do patrocinador do curso:", e)
      }
    }

    // 4. Deleta do banco
    await prisma.course.delete({ where: { id } })

    // Log de Auditoria
    await logAdminAction("EXCLUIU", "Curso", `Título: ${course?.title || "ID: " + id}`);

    revalidatePath("/admin/courses")
    revalidatePath("/cursos")

    return { success: true, message: "Curso excluído com sucesso!" }

  } catch (error) {
    console.error("Erro ao excluir curso:", error)
    return { success: false, message: "Erro ao excluir curso. Ele pode estar em uso." }
  }
}