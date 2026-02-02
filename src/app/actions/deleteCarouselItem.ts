"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function deleteCarouselItem(itemId: string) {
  const session = await auth()
  
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Não autorizado" }
  }

  try {
    await prisma.carouselItem.delete({
      where: { id: itemId }
    })

    revalidatePath("/")
    revalidatePath("/admin/carousel")
    return { success: true }
  } catch (error) {
    return { error: "Erro ao excluir slide" }
  }
}
