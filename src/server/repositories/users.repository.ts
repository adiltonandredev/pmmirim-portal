import { prisma } from "@/lib/prisma"

export async function findUserById(id: string) {
  return prisma.user.findUnique({ where: { id }, select: { name: true, email: true } })
}
export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } })
}
export async function createUserRecord(data: { name: string; email: string; password: string; role: import("@prisma/client").Role; image?: string | null }) {
  return prisma.user.create({ data })
}
export async function updateUserRecord(id: string, data: object) {
  return prisma.user.update({ where: { id }, data })
}
export async function deleteUserRecord(id: string) {
  return prisma.user.delete({ where: { id } })
}
