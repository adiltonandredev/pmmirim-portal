"use server"
import { parseError } from "@/lib/errors"

import { revalidatePath } from "next/cache"
import { updateSettingsService, updateInstagramSettingsService } from "@/server/services/settings.service"

export async function updateSettings(formData: FormData) {
  try {
  const result = await updateSettingsService(formData)
  if (result.success) { revalidatePath("/", "layout"); revalidatePath("/admin/settings"); revalidatePath("/projetos") }
  return result
  } catch (error) { return { success: false, message: parseError(error) } }
}
export async function updateInstagramSettings(formData: FormData) {
  try {
  const result = await updateInstagramSettingsService(formData)
  if (result.success) { revalidatePath("/"); revalidatePath("/admin/settings") }
  return result
  } catch (error) { return { success: false, message: parseError(error) } }
}
