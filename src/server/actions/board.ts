"use server"
import { parseError } from "@/lib/errors"

import { revalidatePath } from "next/cache"
import { createBoardMemberService, updateBoardMemberService, deleteBoardMemberService, toggleBoardMemberActiveService } from "@/server/services/board.service"

const revalidateBoard = () => { revalidatePath("/instituicao/diretoria"); revalidatePath("/admin/diretoria") }

export async function createBoardMember(formData: FormData) {
  try {
  const result = await createBoardMemberService(formData)
  if (result.success) revalidateBoard()
  return result
  } catch (error) { return { success: false, message: parseError(error) } }
}
export async function updateBoardMember(id: string, formData: FormData) {
  try {
  const result = await updateBoardMemberService(id, formData)
  if (result.success) revalidateBoard()
  return result
  } catch (error) { return { success: false, message: parseError(error) } }
}
export async function deleteBoardMember(id: string) {
  try {
  const result = await deleteBoardMemberService(id)
  if (result.success) revalidateBoard()
  return result
  } catch (error) { return { success: false, message: parseError(error) } }
}
export async function toggleBoardMemberActive(id: string, currentStatus: boolean) {
  try {
  const result = await toggleBoardMemberActiveService(id, currentStatus)
  if (result.success) revalidateBoard()
  return result
  } catch (error) { return { success: false, message: parseError(error) } }
}
