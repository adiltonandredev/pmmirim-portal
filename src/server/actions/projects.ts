"use server"
import { parseError } from "@/lib/errors"

import { revalidatePath } from "next/cache"
import { createProjectService, updateProjectService, deleteProjectService } from "@/server/services/projects.service"

const revalidateProjects = () => { revalidatePath("/admin/institution/projects"); revalidatePath("/"); revalidatePath("/projetos") }

export async function createProject(formData: FormData) {
  try {
  const result = await createProjectService(formData)
  if (result.success) revalidateProjects()
  return result
  } catch (error) { return { success: false, message: parseError(error) } }
}
export async function updateProject(formData: FormData) {
  try {
  const result = await updateProjectService(formData)
  if (result.success) revalidateProjects()
  return result
  } catch (error) { return { success: false, message: parseError(error) } }
}
export async function deleteProject(data: string | FormData) {
  try {
  const id = typeof data === "string" ? data : data.get("id") as string
  if (!id) return { success: false, message: "ID inválido para exclusão." }
  const result = await deleteProjectService(id)
  if (result.success) revalidateProjects()
  return result
  } catch (error) { return { success: false, message: parseError(error) } }
}
