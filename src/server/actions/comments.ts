"use server"
import { parseError } from "@/lib/errors"

import { revalidatePath } from "next/cache"
import { createCommentService } from "@/server/services/comments.service"

export async function createComment(formData: FormData) {
  const result = await createCommentService(formData)
  if (result.success) { revalidatePath("/noticias/[slug]", "page"); revalidatePath("/projetos/[slug]", "page") }
  return result
}
