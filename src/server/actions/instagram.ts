"use server"
import { parseError } from "@/lib/errors"

import { revalidatePath } from "next/cache"
import { saveInstagramSettingsService, getInstagramFeedService } from "@/server/services/instagram.service"

export async function saveInstagramSettings(formData: FormData) {
  const result = await saveInstagramSettingsService(formData)
  if (result.success) { revalidatePath("/"); revalidatePath("/admin/instagram") }
  return result
}
export async function getInstagramFeed() {
  return getInstagramFeedService()
}
