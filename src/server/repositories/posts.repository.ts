import { prisma } from "@/lib/prisma"

export async function findPostBySlug(slug: string) {
  return prisma.post.findUnique({ where: { slug } })
}

export async function findPostById(id: string) {
  return prisma.post.findUnique({ where: { id } })
}

export async function createPostRecord(data: {
  title: string
  slug: string
  summary: string
  content: string
  coverImage: string | null
  published: boolean
  featured: boolean
}) {
  return prisma.post.create({ data: { ...data, type: "NEWS" } })
}

export async function updatePostRecord(id: string, data: {
  title: string
  summary: string
  content: string
  coverImage: string
  published: boolean
  featured: boolean
}) {
  return prisma.post.update({ where: { id }, data: { ...data, type: "NEWS" } })
}

export async function deletePostRecord(id: string) {
  return prisma.post.delete({ where: { id } })
}
