import { prisma } from "@/lib/prisma"

export async function findTeamMemberById(id: string) {
  return prisma.teamMember.findUnique({ where: { id } })
}
export async function findAllTeamMembers(category?: string) {
  return prisma.teamMember.findMany({ where: category ? { category } : {}, orderBy: { order: "asc" } })
}
export async function createTeamMemberRecord(data: { name: string; role: string; category: string; bio: string; image: string | null; instagram: string; email: string; order: number; birthDate?: Date | null }) {
  return prisma.teamMember.create({ data })
}
export async function updateTeamMemberRecord(id: string, data: object) {
  return prisma.teamMember.update({ where: { id }, data })
}
export async function deleteTeamMemberRecord(id: string) {
  return prisma.teamMember.delete({ where: { id } })
}
