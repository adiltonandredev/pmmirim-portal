"use server"
import { parseError } from "@/lib/errors"

import { revalidatePath } from "next/cache"
import { createTeamMemberService, updateTeamMemberService, deleteTeamMemberService, getTeamMembersService } from "@/server/services/team.service"

const revalidateTeam = () => {
  revalidatePath("/admin/institution/team")
  revalidatePath("/instituicao/equipe")
  revalidatePath("/instituicao/diretoria")
  revalidatePath("/instituicao/membros", "layout")
}

export async function createTeamMember(formData: FormData) {
  try {
  const result = await createTeamMemberService(formData)
  if (result.success) revalidateTeam()
  return result
  } catch (error) { return { success: false, message: parseError(error) } }
}
export async function updateTeamMember(formData: FormData) {
  try {
  const result = await updateTeamMemberService(formData)
  if (result.success) revalidateTeam()
  return result
  } catch (error) { return { success: false, message: parseError(error) } }
}
export async function deleteTeamMember(data: string | FormData) {
  try {
  const id = typeof data === "string" ? data : data.get("id") as string
  if (!id) return { success: false, message: "ID inválido para exclusão." }
  const result = await deleteTeamMemberService(id)
  if (result.success) revalidateTeam()
  return result
  } catch (error) { return { success: false, message: parseError(error) } }
}
export async function getTeamMembers(category?: string) { return getTeamMembersService(category) }
