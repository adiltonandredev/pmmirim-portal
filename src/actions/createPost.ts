"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { uploadImage } from "@/lib/upload"
import { createPostSchema } from "@/lib/validations"
import { logAdminAction } from "@/lib/audit" // <--- O Espião

export async function createPost(formData: FormData) {
  try {
    const session = await auth()

    // 1. Verificação de Segurança
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
      return { success: false, message: "Acesso negado. Apenas administradores e editores podem criar posts." }
    }

    const data = {
      title: formData.get("title") as string || "",
      summary: formData.get("summary") as string || "",
      content: formData.get("content") as string || "",
      type: (formData.get("type") as any) || "NEWS",
      eventDate: (formData.get("eventDate") as string) || null,
      location: (formData.get("location") as string) || null,
      isFeatured: formData.get("isFeatured") === "true",
      published: formData.get("published") === "true"
    }

    // 2. Validação dos Dados
    const validation = createPostSchema.safeParse(data)
    if (!validation.success) {
      console.error("Validation errors:", validation.error.issues)
      return { success: false, message: validation.error.issues[0]?.message || "Erro de validação nos campos." }
    }

    // 3. Upload da Imagem
    const coverImageFile = formData.get("coverImage") as File
    let coverImageUrl = ""

    if (coverImageFile && coverImageFile.size > 0) {
      try {
        const uploadedPath = await uploadImage(coverImageFile)
        if (uploadedPath) coverImageUrl = uploadedPath
      } catch (error: any) {
        return { success: false, message: error.message || "Erro ao fazer upload da imagem de capa." }
      }
    }

    // 4. Geração de Slug Seguro (Com sufixo aleatório para evitar duplicação)
    const slug = data.title
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") + "-" + Date.now().toString().slice(-4)

    // 5. Salvando no Banco
    await prisma.post.create({
      data: {
        title: data.title,
        slug,
        summary: data.summary,
        content: data.content,
        type: data.type,
        eventDate: data.eventDate ? new Date(String(data.eventDate)) : null,
        location: data.location || null,
        featured: data.isFeatured || false,
        published: data.published !== false,
        coverImage: coverImageUrl || null,
      },
    })

    // 6. Log de Auditoria (Passando o ID de quem criou)
    const typeName = data.type === "NEWS" ? "Notícia" : data.type === "EVENT" ? "Evento" : "Projeto";
    await logAdminAction("CRIOU", "Post", `Título: ${data.title} (${typeName})`);

    // 7. Revalidação de Cache
    revalidatePath("/admin/posts")
    revalidatePath("/")
    revalidatePath("/noticias")
    revalidatePath("/projetos")

    return { success: true, message: "Post criado com sucesso!" }

  } catch (error) {
    console.error("Erro ao criar post:", error)
    return { success: false, message: "Erro interno ao salvar o post." }
  }
}