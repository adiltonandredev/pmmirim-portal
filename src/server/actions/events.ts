"use server"
import { revalidatePath } from "next/cache"
import { createEventService, updateEventService, deleteEventService } from "@/server/services/events.service"

const revalidateEvents = () => { revalidatePath("/admin/events"); revalidatePath("/") }

export async function createEvent(formData: FormData) {
  const result = await createEventService(formData)
  if (result.success) revalidateEvents()
  return result
}
export async function updateEvent(formData: FormData) {
  const result = await updateEventService(formData)
  if (result.success) revalidateEvents()
  return result
}
export async function deleteEvent(data: string | FormData) {
  const id = typeof data === "string" ? data : data.get("id") as string
  if (!id) return { success: false, message: "ID inválido para exclusão." }
  const result = await deleteEventService(id)
  if (result.success) revalidateEvents()
  return result
}
