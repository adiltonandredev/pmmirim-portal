"use server"
import { parseError } from "@/lib/errors"

import { revalidatePath } from "next/cache"
import { createStudentService, updateStudentService, deleteStudentService, createFeaturedStudentService, updateFeaturedStudentService, deleteFeaturedStudentService } from "@/server/services/students.service"

export async function createStudent(formData: FormData) {
  const result = await createStudentService(formData)
  if (result.success) revalidatePath("/admin/students")
  return result
}
export async function updateStudent(formData: FormData) {
  const result = await updateStudentService(formData)
  if (result.success) revalidatePath("/admin/students")
  return result
}
export async function deleteStudent(data: string | FormData) {
  const id = typeof data === "string" ? data : data.get("id") as string
  const result = await deleteStudentService(id)
  if (result.success) revalidatePath("/admin/students")
  return result
}
export async function createFeaturedStudent(formData: FormData) {
  const result = await createFeaturedStudentService(formData)
  if (result.success) { revalidatePath("/admin/featured-student"); revalidatePath("/") }
  return result
}
export async function updateFeaturedStudent(formData: FormData) {
  const result = await updateFeaturedStudentService(formData)
  if (result.success) { revalidatePath("/admin/featured-student"); revalidatePath("/") }
  return result
}
export async function deleteFeaturedStudent(data: string | FormData) {
  const id = typeof data === "string" ? data : data.get("id") as string
  const result = await deleteFeaturedStudentService(id)
  if (result.success) { revalidatePath("/admin/featured-student"); revalidatePath("/") }
  return result
}
