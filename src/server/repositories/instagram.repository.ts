import { prisma } from "@/lib/prisma"

export async function findInstagramSettings() {
  return prisma.instagramSettings.findFirst()
}
export async function createInstagramRecord(data: object) {
  return prisma.instagramSettings.create({ data: data as never })
}
export async function updateInstagramRecord(id: string, data: object) {
  return prisma.instagramSettings.update({ where: { id }, data: data as never })
}
