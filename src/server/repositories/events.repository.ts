import { prisma } from "@/lib/prisma"

export async function findEventById(id: string) {
  return prisma.event.findUnique({ where: { id } })
}
export async function createEventRecord(data: { title: string; date: Date; location: string; description: string; bannerUrl: string | null }) {
  return prisma.event.create({ data })
}
export async function updateEventRecord(id: string, data: { title: string; date: Date; location: string; description: string; bannerUrl: string }) {
  return prisma.event.update({ where: { id }, data })
}
export async function deleteEventRecord(id: string) {
  return prisma.event.delete({ where: { id } })
}
