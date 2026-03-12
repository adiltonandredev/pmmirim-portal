import { prisma } from "@/lib/prisma"

export async function createCommentRecord(data: { author: string; content: string; postId: string }) {
  return prisma.comment.create({ data })
}
