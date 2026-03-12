"use server"
import { revalidatePath } from "next/cache"
import { createPartnerService, updatePartnerService, deletePartnerService } from "@/server/services/partners.service"

const revalidatePartners = () => { revalidatePath("/"); revalidatePath("/admin/partners"); revalidatePath("/parceiros") }

export async function createPartner(formData: FormData) {
  const result = await createPartnerService(formData)
  if (result.success) revalidatePartners()
  return result
}
export async function updatePartner(formData: FormData) {
  const result = await updatePartnerService(formData)
  if (result.success) revalidatePartners()
  return result
}
export async function deletePartner(formData: FormData) {
  const id = formData.get("id") as string
  if (!id) return { success: false, message: "ID inválido para exclusão." }
  const result = await deletePartnerService(id)
  if (result.success) revalidatePartners()
  return result
}
