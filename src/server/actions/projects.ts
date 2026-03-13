"use server"
import { revalidatePath } from "next/cache"
import { createProjectService, updateProjectService, deleteProjectService } from "@/server/services/projects.service"

const revalidateProjects = () => { revalidatePath("/admin/institution/projects"); revalidatePath("/"); revalidatePath("/projetos") }

export async function createProject(formData: FormData) {
  const result = await createProjectService(formData)
  if (result.success) revalidateProjects()
  return result
}
export async function updateProject(formData: FormData) {
  const result = await updateProjectService(formData)
  if (result.success) revalidateProjects()
  return result
}
export async function deleteProject(data: string | FormData) {
  const id = typeof data === "string" ? data : data.get("id") as string
  if (!id) return { success: false, message: "ID inválido para exclusão." }
  const result = await deleteProjectService(id)
  if (result.success) revalidateProjects()
  return result
}
