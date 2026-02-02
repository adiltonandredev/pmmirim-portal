"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { uploadImage } from "@/lib/upload"
import { createPostSchema } from "@/lib/validations"

export async function createPost(formData: FormData) {
  const session = await auth()
  
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return { error: "Não autorizado" }
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

  console.log("Form data received:", {
    title: data.title,
    summary: data.summary.substring(0, 50),
    content: data.content.substring(0, 50),
    type: data.type
  })

  const validation = createPostSchema.safeParse(data)
  if (!validation.success) {
    console.error("Validation errors:", validation.error.errors)
    return { error: validation.error.errors[0]?.message || "Erro de validação" }
  }
  
  const coverImageFile = formData.get("coverImage") as File
  
  let coverImageUrl = ""
  if (coverImageFile && coverImageFile.size > 0) {
    try {
      const uploadedPath = await uploadImage(coverImageFile)
      if (uploadedPath) coverImageUrl = uploadedPath
    } catch (error: any) {
      return { error: error.message || "Erro ao fazer upload da imagem" }
    }
  }

  const slug = data.title
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
    .replace(/[^a-z0-9]+/g, "-") 
    .replace(/^-+|-+$/g, "") 

  try {
    const post = await prisma.post.create({
      data: {
        title: data.title,
        slug,
        summary: data.summary,
        content: data.content,
        type: data.type,
        eventDate: data.eventDate ? new Date(data.eventDate) : null,
        location: data.location || null,
        isFeatured: data.isFeatured || false,
        published: data.published !== false,
        coverImage: coverImageUrl || null,
      },
    })

    if (data.isFeatured && coverImageUrl && data.published) {
      const maxOrder = await prisma.carouselItem.findFirst({
        orderBy: { order: 'desc' },
        select: { order: true }
      })

      await prisma.carouselItem.create({
        data: {
          title: data.title,
          description: data.summary,
          imageUrl: coverImageUrl,
          actionUrl: `/noticias/${slug}`,
          actionText: "Leia Mais",
          isActive: true,
          order: (maxOrder?.order || 0) + 1,
        },
      })

      console.log(`✅ Notícia "${data.title}" adicionada ao carousel automaticamente!`)
    }

  } catch (error) {
    console.error(error)
    return { error: "Erro ao criar post." }
  }

  revalidatePath("/admin/posts")
  revalidatePath("/")
  redirect("/admin/posts")
}