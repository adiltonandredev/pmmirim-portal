"use server"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { createUserService, updateUserService, deleteUserService } from "@/server/services/users.service"

export async function createUser(formData: FormData) {
  const session = await auth()
  const result = await createUserService(formData, session?.user?.id ?? "", session?.user?.role ?? "")
  if (result.success) revalidatePath("/admin/users")
  return result
}
export async function updateUser(formData: FormData) {
  const session = await auth()
  const result = await updateUserService(formData, session?.user?.role ?? "")
  if (result.success) revalidatePath("/admin/users")
  return result
}
export async function deleteUser(data: string | FormData) {
  const session = await auth()
  const userId = typeof data === "string" ? data : data.get("id") as string
  const result = await deleteUserService(userId, session?.user?.id ?? "", session?.user?.role ?? "")
  if (result.success) revalidatePath("/admin/users")
  return result
}
