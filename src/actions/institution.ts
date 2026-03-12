"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { logAdminAction } from "@/lib/audit" // <--- O Espião

export async function updateInstitutionHistory(formData: FormData) {
  try {
    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const mission = formData.get("mission") as string
    const vision = formData.get("vision") as string
    const values = formData.get("values") as string
    const principles = formData.get("principles") as string 
    
    if (!title || !content) {
        return { success: false, message: "O título e o conteúdo principal são obrigatórios." }
    }

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
          principles, 
        },
      })
      
      // Log de Auditoria
      await logAdminAction("EDITOU", "Página Institucional", "Atualizou a história, missão, visão ou valores");
      
    } else {
      await prisma.institutionHistory.create({
        data: {
          title: title || "História da PMMirim",
          content: content || "",
          mission,
          vision,
          values,
          principles, 
        },
      })
      
      // Log de Auditoria
      await logAdminAction("CRIOU", "Página Institucional", "Criou o registro inicial da instituição");
    }

    revalidatePath("/instituicao/historia")
    revalidatePath("/admin/institution/history")
    revalidatePath("/") // <-- Atualiza a Home porque a Missão aparece lá nos Cards!
    
    return { success: true, message: "Dados da instituição salvos com sucesso!" }

  } catch (error) {
    console.error("Erro ao atualizar histórico da instituição:", error)
    return { success: false, message: "Erro interno ao salvar os dados da instituição." }
  }
}