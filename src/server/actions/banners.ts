"use server"

import { revalidatePath } from "next/cache"
import {
  createBannerService,
  updateBannerService,
  deleteBannerService,
  toggleBannerActiveService,
} from "@/server/services/banners.service"

const revalidateBanners = () => {
  revalidatePath("/")
  revalidatePath("/parceiros")
  revalidatePath("/admin/banners")
}

export async function createBanner(formData: FormData) {
  const result = await createBannerService(formData)
  if (result.success) revalidateBanners()
  return result
}

export async function updateBanner(formData: FormData) {
  const result = await updateBannerService(formData)
  if (result.success) revalidateBanners()
  return result
}

export async function deleteBanner(data: string | FormData) {
  const id = typeof data === "string" ? data : data.get("id") as string
  if (!id) return { success: false, message: "ID inválido para exclusão." }
  const result = await deleteBannerService(id)
  if (result.success) revalidateBanners()
  return result
}

export async function toggleBannerActive(id: string, currentState: boolean) {
  if (!id) return { success: false, message: "ID do banner não fornecido." }
  const result = await toggleBannerActiveService(id, currentState)
  if (result.success) revalidateBanners()
  return result
}
