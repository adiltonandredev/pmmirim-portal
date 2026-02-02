"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { uploadImage } from "@/lib/upload"

export async function createCarouselItem(formData: FormData) {
  const session = await auth()
  
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Não autorizado" }
  }

  const imageFile = formData.get("image") as File
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const actionUrl = formData.get("actionUrl") as string
  const actionText = formData.get("actionText") as string
  const isActive = formData.get("isActive") === "true"

  if (!imageFile || imageFile.size === 0) {
    return { error: "Imagem é obrigatória" }
  }

  try {
    const imageUrl = await uploadImage(imageFile)
    
    if (!imageUrl) {
      return { error: "Erro ao fazer upload da imagem" }
    }

    const maxOrder = await prisma.carouselItem.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true }
    })

    await prisma.carouselItem.create({
      data: {
        title: title || null,
        description: description || null,
        imageUrl,
        actionUrl: actionUrl || null,
        actionText: actionText || null,
        isActive,
        order: (maxOrder?.order || 0) + 1,
      },
    })

    revalidatePath("/")
    revalidatePath("/admin/carousel")
    redirect("/admin/carousel")
  } catch (error: any) {
    console.error(error)
    return { error: error.message || "Erro ao criar slide" }
  }
}
