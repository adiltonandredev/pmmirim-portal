import { prisma } from "@/lib/prisma"

export async function findInstitutionHistory() {
  return prisma.institutionHistory.findFirst()
}
export async function createInstitutionHistoryRecord(data: object) {
  return prisma.institutionHistory.create({ data: data as never })
}
export async function updateInstitutionHistoryRecord(id: string, data: object) {
  return prisma.institutionHistory.update({ where: { id }, data: data as never })
}
