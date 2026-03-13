"use server"
import { revalidatePath } from "next/cache"
import { createTeamMemberService, updateTeamMemberService, deleteTeamMemberService, getTeamMembersService } from "@/server/services/team.service"

const revalidateTeam = () => { revalidatePath("/admin/institution/team"); revalidatePath("/instituicao/equipe"); revalidatePath("/instituicao/diretoria") }

export async function createTeamMember(formData: FormData) {
  const result = await createTeamMemberService(formData)
  if (result.success) revalidateTeam()
  return result
}
export async function updateTeamMember(formData: FormData) {
  const result = await updateTeamMemberService(formData)
  if (result.success) revalidateTeam()
  return result
}
export async function deleteTeamMember(data: string | FormData) {
  const id = typeof data === "string" ? data : data.get("id") as string
  if (!id) return { success: false, message: "ID inválido para exclusão." }
  const result = await deleteTeamMemberService(id)
  if (result.success) revalidateTeam()
  return result
}
export async function getTeamMembers(category?: string) { return getTeamMembersService(category) }
