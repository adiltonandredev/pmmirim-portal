import { prisma } from "@/lib/prisma"

export async function findPartnerById(id: string) {
  return prisma.partner.findUnique({ where: { id } })
}
export async function createPartnerRecord(data: { name: string; website: string; logoUrl: string; active: boolean }) {
  return prisma.partner.create({ data })
}
export async function updatePartnerRecord(id: string, data: object) {
  return prisma.partner.update({ where: { id }, data })
}
export async function deletePartnerRecord(id: string) {
  return prisma.partner.delete({ where: { id } })
}
