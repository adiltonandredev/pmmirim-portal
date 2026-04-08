import { prisma } from "@/lib/prisma"

export async function findSiteSettings() {
  return prisma.siteSettings.findFirst({ orderBy: { updatedAt: "desc" } })
}
export async function createSiteSettingsRecord(data: object) {
  return prisma.siteSettings.create({ data: data as never })
}
export async function updateSiteSettingsRecord(id: string, data: object) {
  return prisma.siteSettings.update({ where: { id }, data: data as never })
}
export async function findInstagramSettings() {
  return prisma.instagramSettings.findFirst({ orderBy: { updatedAt: "desc" } })
}
export async function findInstagramSettingsById(id: string) {
  return prisma.instagramSettings.findUnique({ where: { id } })
}
export async function createInstagramSettingsRecord(data: object) {
  return prisma.instagramSettings.create({ data: data as never })
}
export async function updateInstagramSettingsRecord(id: string, data: object) {
  return prisma.instagramSettings.update({ where: { id }, data: data as never })
}
