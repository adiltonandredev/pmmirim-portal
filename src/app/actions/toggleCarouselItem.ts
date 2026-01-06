"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function toggleCarouselItem(itemId: string) {
  const session = await auth()
  
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Não autorizado" }
  }

  try {
    const item = await prisma.carouselItem.findUnique({
      where: { id: itemId }
    })

    if (!item) {
      return { error: "Item não encontrado" }
    }

    await prisma.carouselItem.update({
      where: { id: itemId },
      data: { isActive: !item.isActive }
    })

    revalidatePath("/")
    revalidatePath("/admin/carousel")
    return { success: true }
  } catch (error) {
    return { error: "Erro ao atualizar status" }
  }
}
