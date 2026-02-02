"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { uploadImage } from "@/lib/upload"

export async function updatePost(formData: FormData) {
  const session = await auth()
  
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return { error: "Não autorizado" }
  }

  const postId = formData.get("id") as string
  const title = formData.get("title") as string
  const summary = formData.get("summary") as string
  const content = formData.get("content") as string
  const type = formData.get("type") as any
  const status = formData.get("status") as string
  const isFeatured = formData.get("isFeatured") === "true"
  const removeImage = formData.get("removeImage") === "true"
  
  const coverImageFile = formData.get("coverImage") as File

  let coverImageUrl: string | null = null

  if (removeImage) {
    coverImageUrl = null
  } else if (coverImageFile && coverImageFile.size > 0) {
    try {
      const uploadedPath = await uploadImage(coverImageFile)
      if (uploadedPath) coverImageUrl = uploadedPath
    } catch (error: any) {
      return { error: error.message || "Erro ao fazer upload da imagem" }
    }
  }

  try {
    const updateData: any = {
      title,
      summary,
      content,
      type,
      published: status === "published",
      isFeatured,
    }

    if (coverImageUrl !== null || removeImage) {
      updateData.coverImage = coverImageUrl
    }

    const post = await prisma.post.update({
      where: { id: postId },
      data: updateData,
    })

    const existingCarouselItem = await prisma.carouselItem.findFirst({
      where: {
        actionUrl: `/noticias/${post.slug}`
      }
    })

    if (isFeatured && post.coverImage && status === "published") {
      if (existingCarouselItem) {
        await prisma.carouselItem.update({
          where: { id: existingCarouselItem.id },
          data: {
            title: post.title,
            description: post.summary,
            imageUrl: post.coverImage,
            isActive: true,
          }
        })
        console.log(`✅ Slide do carousel atualizado para "${post.title}"`)
      } else {
        const maxOrder = await prisma.carouselItem.findFirst({
          orderBy: { order: 'desc' },
          select: { order: true }
        })

        await prisma.carouselItem.create({
          data: {
            title: post.title,
            description: post.summary,
            imageUrl: post.coverImage,
            actionUrl: `/noticias/${post.slug}`,
            actionText: "Leia Mais",
            isActive: true,
            order: (maxOrder?.order || 0) + 1,
          },
        })
        console.log(`✅ Notícia "${post.title}" adicionada ao carousel!`)
      }
    } else if (!isFeatured && existingCarouselItem) {
      await prisma.carouselItem.delete({
        where: { id: existingCarouselItem.id }
      })
      console.log(`✅ Notícia "${post.title}" removida do carousel`)
    }

  } catch (error) {
    return { error: "Erro ao atualizar post." }
  }

  revalidatePath("/admin/posts")
  revalidatePath("/")
  revalidatePath("/noticias")
  redirect("/admin/posts")
}