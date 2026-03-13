"use server"
import { revalidatePath } from "next/cache"
import { createBoardMemberService, updateBoardMemberService, deleteBoardMemberService, toggleBoardMemberActiveService } from "@/server/services/board.service"

const revalidateBoard = () => { revalidatePath("/instituicao/diretoria"); revalidatePath("/admin/diretoria") }

export async function createBoardMember(formData: FormData) {
  const result = await createBoardMemberService(formData)
  if (result.success) revalidateBoard()
  return result
}
export async function updateBoardMember(id: string, formData: FormData) {
  const result = await updateBoardMemberService(id, formData)
  if (result.success) revalidateBoard()
  return result
}
export async function deleteBoardMember(id: string) {
  const result = await deleteBoardMemberService(id)
  if (result.success) revalidateBoard()
  return result
}
export async function toggleBoardMemberActive(id: string, currentStatus: boolean) {
  const result = await toggleBoardMemberActiveService(id, currentStatus)
  if (result.success) revalidateBoard()
  return result
}
