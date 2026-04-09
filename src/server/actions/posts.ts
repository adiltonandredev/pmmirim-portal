"use server"
import { parseError } from "@/lib/errors"


import { revalidatePath } from "next/cache"
import {
  createPostService,
  updatePostService,
  deletePostService,
} from "@/server/services/posts.service"

export async function createPost(formData: FormData) {
  try {
  const result = await createPostService(formData)
  if (result.success) {
    revalidatePath("/admin/posts")
    revalidatePath("/")
    revalidatePath("/noticias")
  }
  return result
  } catch (error) { return { success: false, message: parseError(error) } }
}

export async function updatePost(formData: FormData) {
  try {
  const result = await updatePostService(formData)
  if (result.success) {
    revalidatePath("/admin/posts")
    revalidatePath("/")
    revalidatePath("/noticias")
  }
  return result
  } catch (error) { return { success: false, message: parseError(error) } }
}

export async function deletePost(data: string | FormData) {
  try {
  const id = typeof data === "string" ? data : data.get("id") as string
  if (!id) return { success: false, message: "ID inválido para exclusão." }

  const result = await deletePostService(id)
  if (result.success) {
    revalidatePath("/admin/posts")
    revalidatePath("/")
    revalidatePath("/noticias")
  }
  return result
  } catch (error) { return { success: false, message: parseError(error) } }
}
