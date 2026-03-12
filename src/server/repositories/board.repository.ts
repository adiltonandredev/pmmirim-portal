import { prisma } from "@/lib/prisma"

export async function findBoardMemberById(id: string) {
  return prisma.boardMember.findUnique({ where: { id } })
}
export async function createBoardMemberRecord(data: object) {
  return prisma.boardMember.create({ data: data as never })
}
export async function updateBoardMemberRecord(id: string, data: object) {
  return prisma.boardMember.update({ where: { id }, data: data as never })
}
export async function deleteBoardMemberRecord(id: string) {
  return prisma.boardMember.delete({ where: { id } })
}
export async function toggleBoardMemberRecord(id: string, active: boolean) {
  return prisma.boardMember.update({ where: { id }, data: { active } })
}
