'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateInstitutionHistory(formData: FormData) {
  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const mission = formData.get("mission") as string
  const vision = formData.get("vision") as string
  const values = formData.get("values") as string
  // 1. ADICIONADO AQUI
  const principles = formData.get("principles") as string 
  
  const existing = await prisma.institutionHistory.findFirst()

  if (existing) {
    await prisma.institutionHistory.update({
      where: { id: existing.id },
      data: {
        title,
        content,
        mission,
        vision,
        values,
        principles, // 2. ADICIONADO AQUI
      },
    })
  } else {
    await prisma.institutionHistory.create({
      data: {
        title: title || "História da PMMirim",
        content: content || "",
        mission,
        vision,
        values,
        principles, // 3. ADICIONADO AQUI
      },
    })
  }

  revalidatePath("/instituicao/historia")
  revalidatePath("/admin/institution/history")
  
  return { success: true }
}