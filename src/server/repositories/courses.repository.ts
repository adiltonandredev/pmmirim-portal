import { prisma } from "@/lib/prisma"

export async function findCourseById(id: string) {
  return prisma.course.findUnique({ where: { id } })
}
export async function createCourseRecord(data: { title: string; slug: string; description: string; content: string; duration: string; targetAge: string; sponsorName: string; active: boolean; coverImage: string | null; sponsorLogo: string | null; featured: boolean }) {
  return prisma.course.create({ data })
}
export async function updateCourseRecord(id: string, data: object) {
  return prisma.course.update({ where: { id }, data })
}
export async function deleteCourseRecord(id: string) {
  return prisma.course.delete({ where: { id } })
}
