import { prisma } from "@/lib/prisma"

export async function findBirthdayById(id: string) {
  return prisma.birthday.findUnique({ where: { id } })
}
export async function createBirthdayRecord(data: { name: string; role: string; date: Date; photoUrl: string | null; active: boolean }) {
  return prisma.birthday.create({ data })
}
export async function updateBirthdayRecord(id: string, data: { name: string; role: string; date: Date; photoUrl: string; active: boolean }) {
  return prisma.birthday.update({ where: { id }, data })
}
export async function deleteBirthdayRecord(id: string) {
  return prisma.birthday.delete({ where: { id } })
}
