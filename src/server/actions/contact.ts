"use server"
import { revalidatePath } from "next/cache"
import { sendContactMessageService } from "@/server/services/contact.service"

export async function sendContactMessage(formData: FormData) {
  const result = await sendContactMessageService(formData)
  if (result.success) { revalidatePath("/contato"); revalidatePath("/admin/mensagens") }
  return result
}
