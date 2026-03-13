"use server"

import { revalidatePath } from "next/cache"
import {
  createPostService,
  updatePostService,
  deletePostService,
} from "@/server/services/posts.service"

export async function createPost(formData: FormData) {
  const result = await createPostService(formData)
  if (result.success) {
    revalidatePath("/admin/posts")
    revalidatePath("/")
    revalidatePath("/noticias")
  }
  return result
}

export async function updatePost(formData: FormData) {
  const result = await updatePostService(formData)
  if (result.success) {
    revalidatePath("/admin/posts")
    revalidatePath("/")
    revalidatePath("/noticias")
  }
  return result
}

export async function deletePost(data: string | FormData) {
  const id = typeof data === "string" ? data : data.get("id") as string
  if (!id) return { success: false, message: "ID inválido para exclusão." }

  const result = await deletePostService(id)
  if (result.success) {
    revalidatePath("/admin/posts")
    revalidatePath("/")
    revalidatePath("/noticias")
  }
  return result
}
