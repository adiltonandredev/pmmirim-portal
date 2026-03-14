"use server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { updateInstitutionHistoryService } from "@/server/services/institution.service"

export async function updateInstitutionHistory(formData: FormData) {
  const result = await updateInstitutionHistoryService(formData)
  if (result.success) { 
    revalidatePath("/instituicao/historia"); 
    revalidatePath("/admin/institution/history"); 
    revalidatePath("/") 
    redirect("/admin")  // ← ADICIONE ESTA LINHA
  }
  return result
}
