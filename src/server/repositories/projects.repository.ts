import { prisma } from "@/lib/prisma"

export async function findProjectById(id: string) {
  return prisma.post.findUnique({ where: { id } })
}
export async function findProjectBySlug(slug: string) {
  return prisma.post.findUnique({ where: { slug } })
}
export async function createProjectRecord(data: { title: string; slug: string; summary: string; content: string; coverImage: string | null; published: boolean; type: import("@prisma/client").PostType; featured: boolean }) {
  return prisma.post.create({ data })
}
export async function updateProjectRecord(id: string, data: object) {
  return prisma.post.update({ where: { id }, data })
}
export async function deleteProjectRecord(id: string) {
  return prisma.post.delete({ where: { id } })
}
