import { prisma } from "@/lib/prisma"

export async function findStudentById(id: string) {
  return prisma.student.findUnique({ where: { id } })
}
export async function findStudentByMatricula(matricula: string) {
  return prisma.student.findUnique({ where: { matricula } })
}
export async function createStudentRecord(data: object) {
  return prisma.student.create({ data: data as never })
}
export async function updateStudentRecord(id: string, data: object) {
  return prisma.student.update({ where: { id }, data: data as never })
}
export async function deleteStudentRecord(id: string) {
  return prisma.student.delete({ where: { id } })
}
export async function findFeaturedStudentById(id: string) {
  return prisma.featuredStudent.findUnique({ where: { id } })
}
export async function createFeaturedStudentRecord(data: object) {
  return prisma.featuredStudent.create({ data: data as never })
}
export async function updateFeaturedStudentRecord(id: string, data: object) {
  return prisma.featuredStudent.update({ where: { id }, data: data as never })
}
export async function deleteFeaturedStudentRecord(id: string) {
  return prisma.featuredStudent.delete({ where: { id } })
}
