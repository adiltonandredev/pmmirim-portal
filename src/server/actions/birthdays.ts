"use server"
import { parseError } from "@/lib/errors"

import { revalidatePath } from "next/cache"
import { createBirthdayService, updateBirthdayService, deleteBirthdayService } from "@/server/services/birthdays.service"

const revalidateBirthdays = () => { revalidatePath("/admin/birthdays"); revalidatePath("/") }

export async function createBirthday(formData: FormData) {
  try {
  const result = await createBirthdayService(formData)
  if (result.success) revalidateBirthdays()
  return result
  } catch (error) { return { success: false, message: parseError(error) } }
}
export async function updateBirthday(formData: FormData) {
  try {
  const result = await updateBirthdayService(formData)
  if (result.success) revalidateBirthdays()
  return result
  } catch (error) { return { success: false, message: parseError(error) } }
}
export async function deleteBirthday(data: string | FormData) {
  try {
  const id = typeof data === "string" ? data : data.get("id") as string
  if (!id) return { success: false, message: "ID inválido para exclusão." }
  const result = await deleteBirthdayService(id)
  if (result.success) revalidateBirthdays()
  return result
  } catch (error) { return { success: false, message: parseError(error) } }
}
