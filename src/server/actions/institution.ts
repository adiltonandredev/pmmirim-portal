"use server"
import { parseError } from "@/lib/errors"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { updateInstitutionHistoryService } from "@/server/services/institution.service"

export async function updateInstitutionHistory(formData: FormData) {
  try {
  const result = await updateInstitutionHistoryService(formData)
  if (result.success) {
    revalidatePath("/instituicao/historia")
    revalidatePath("/admin/institution/history")
    revalidatePath("/")
  }
  return result
  } catch (error) { return { success: false, message: parseError(error) } }
}
