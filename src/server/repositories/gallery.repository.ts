import { prisma } from "@/lib/prisma"

export async function findAlbumById(id: string) {
  return prisma.album.findUnique({ where: { id }, include: { photos: true } })
}
export async function findGalleryBySlugOrId(slugOrId: string) {
  return prisma.gallery.findFirst({ where: { OR: [{ slug: slugOrId }, { id: slugOrId }] }, include: { images: { orderBy: { id: "desc" } } } })
}
export async function findGalleryById(id: string) {
  return prisma.gallery.findUnique({ where: { id }, include: { images: { orderBy: { id: "desc" } } } })
}
export async function findAllGalleries() {
  return prisma.gallery.findMany({ orderBy: { createdAt: "desc" }, include: { images: { orderBy: { id: "desc" } } } })
}
export async function createAlbumRecord(data: { title: string; description: string; date: Date; active: boolean; coverImage: string | null }) {
  return prisma.album.create({ data })
}
export async function updateAlbumRecord(id: string, data: object) {
  return prisma.album.update({ where: { id }, data })
}
export async function deleteAlbumRecord(id: string) {
  return prisma.album.delete({ where: { id } })
}
export async function createPhotoRecord(albumId: string, url: string) {
  return prisma.photo.create({ data: { albumId, url } })
}
export async function findPhotoById(id: string) {
  return prisma.photo.findUnique({ where: { id } })
}
export async function deletePhotoRecord(id: string) {
  return prisma.photo.delete({ where: { id } })
}
export async function createGalleryRecord(data: { title: string; slug: string; coverUrl: string }) {
  return prisma.gallery.create({ data })
}
export async function updateGalleryRecord(id: string, data: object) {
  return prisma.gallery.update({ where: { id }, data })
}
export async function deleteGalleryRecord(id: string) {
  return prisma.gallery.delete({ where: { id } })
}
export async function createGalleryImageRecord(galleryId: string, url: string) {
  return prisma.galleryImage.create({ data: { galleryId, url } })
}
export async function findGalleryImageById(id: string) {
  return prisma.galleryImage.findUnique({ where: { id } })
}
export async function deleteGalleryImageRecord(id: string) {
  return prisma.galleryImage.delete({ where: { id } })
}
