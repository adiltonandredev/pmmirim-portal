"use server"
import { revalidatePath } from "next/cache"
import { updateSettingsService, updateInstagramSettingsService } from "@/server/services/settings.service"

export async function updateSettings(formData: FormData) {
  const result = await updateSettingsService(formData)
  if (result.success) { revalidatePath("/", "layout"); revalidatePath("/admin/settings"); revalidatePath("/projetos") }
  return result
}
export async function updateInstagramSettings(formData: FormData) {
  const result = await updateInstagramSettingsService(formData)
  if (result.success) { revalidatePath("/"); revalidatePath("/admin/settings") }
  return result
}
