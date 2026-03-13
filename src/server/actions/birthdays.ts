"use server"
import { revalidatePath } from "next/cache"
import { createBirthdayService, updateBirthdayService, deleteBirthdayService } from "@/server/services/birthdays.service"

const revalidateBirthdays = () => { revalidatePath("/admin/birthdays"); revalidatePath("/") }

export async function createBirthday(formData: FormData) {
  const result = await createBirthdayService(formData)
  if (result.success) revalidateBirthdays()
  return result
}
export async function updateBirthday(formData: FormData) {
  const result = await updateBirthdayService(formData)
  if (result.success) revalidateBirthdays()
  return result
}
export async function deleteBirthday(data: string | FormData) {
  const id = typeof data === "string" ? data : data.get("id") as string
  if (!id) return { success: false, message: "ID inválido para exclusão." }
  const result = await deleteBirthdayService(id)
  if (result.success) revalidateBirthdays()
  return result
}
