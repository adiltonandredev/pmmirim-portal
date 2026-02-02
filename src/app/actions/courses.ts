"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { saveFile } from "@/lib/file-upload"

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

    // SALVA NA PASTA "courses"
    const coverFile = formData.get("coverImage") as File
    const coverImage = await saveFile(coverFile, "courses")

    const sponsorFile = formData.get("sponsorLogo") as File
    const sponsorLogo = await saveFile(sponsorFile, "courses")

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

    revalidatePath("/admin/courses")
    revalidatePath("/cursos")
    return { success: true }
  } catch (error) {
    console.error("Error creating course:", error)
    return { error: "Erro ao salvar curso." }
  }
}

// 2. ATUALIZAR CURSO
export async function updateCourse(formData: FormData) {
  try {
    const id = formData.get("id") as string
    
    // Atualiza Capa
    const coverFile = formData.get("coverImage") as File
    let coverImage = formData.get("existingCoverImage") as string
    if (coverFile && coverFile.size > 0) {
        coverImage = await saveFile(coverFile, "courses")
    }

    // Atualiza Logo Patrocinador
    const sponsorFile = formData.get("sponsorLogo") as File
    let sponsorLogo = formData.get("existingSponsorLogo") as string
    if (sponsorFile && sponsorFile.size > 0) {
        sponsorLogo = await saveFile(sponsorFile, "courses")
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

    revalidatePath("/admin/courses")
    revalidatePath("/cursos")
    return { success: true }
  } catch (error) {
    console.error("Error updating course:", error)
    return { error: "Erro ao atualizar curso." }
  }
}

// 3. EXCLUIR CURSO
export async function deleteCourse(formData: FormData) {
  const id = formData.get("id") as string
  if (!id) return

  try {
    await prisma.course.delete({ where: { id } })
    revalidatePath("/admin/courses")
    revalidatePath("/cursos")
  } catch (error) {
    console.error("Erro ao excluir curso:", error)
  }
}