import { prisma } from "@/lib/prisma"

export async function createContactMessageRecord(data: { name: string; email: string; subject: string; message: string }) {
  return prisma.contactMessage.create({ data })
}
