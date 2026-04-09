"use server"
import { parseError } from "@/lib/errors"

import { revalidatePath } from "next/cache"
import { createCourseService, updateCourseService, deleteCourseService } from "@/server/services/courses.service"

const revalidateCourses = () => { revalidatePath("/admin/courses"); revalidatePath("/cursos") }

export async function createCourse(formData: FormData) {
  try {
  const result = await createCourseService(formData)
  if (result.success) revalidateCourses()
  return result
  } catch (error) { return { success: false, message: parseError(error) } }
}
export async function updateCourse(formData: FormData) {
  try {
  const result = await updateCourseService(formData)
  if (result.success) revalidateCourses()
  return result
  } catch (error) { return { success: false, message: parseError(error) } }
}
export async function deleteCourse(data: string | FormData) {
  try {
  const id = typeof data === "string" ? data : data.get("id") as string
  if (!id) return { success: false, message: "ID inválido para exclusão." }
  const result = await deleteCourseService(id)
  if (result.success) revalidateCourses()
  return result
  } catch (error) { return { success: false, message: parseError(error) } }
}
