import { prisma } from "@/lib/prisma"

type BannerType = "HOME" | "PARTNER" | "SPONSOR"

export async function findBannerById(id: string) {
  return prisma.banner.findUnique({ where: { id } })
}

export async function createBannerRecord(data: {
  title: string; description: string; link: string
  imageUrl: string; order: number; active: boolean; type: BannerType
}) {
  return prisma.banner.create({ data })
}

export async function updateBannerRecord(id: string, data: {
  title: string; description: string; link: string
  imageUrl: string; order: number; active: boolean; type: BannerType
}) {
  return prisma.banner.update({ where: { id }, data })
}

export async function deleteBannerRecord(id: string) {
  return prisma.banner.delete({ where: { id } })
}

export async function toggleBannerActiveRecord(id: string, active: boolean) {
  return prisma.banner.update({ where: { id }, data: { active } })
}
