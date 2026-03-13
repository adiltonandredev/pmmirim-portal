"use server"
import { revalidatePath } from "next/cache"
import {
  saveAlbumService, deleteAlbumService, uploadAlbumPhotosService, deletePhotoService,
  createGalleryService, deleteGalleryService, uploadGalleryImagesService, deleteSingleImageService,
  getAlbumsService, getAlbumService, getGalleryService,
} from "@/server/services/gallery.service"

export async function saveAlbum(formData: FormData) {
  const result = await saveAlbumService(formData)
  if (result.success) { revalidatePath("/admin/galeria"); revalidatePath("/galeria") }
  return result
}
export async function deleteAlbum(data: string | FormData) {
  const id = typeof data === "string" ? data : data.get("id") as string
  if (!id) return { success: false, message: "ID do álbum inválido." }
  const result = await deleteAlbumService(id)
  if (result.success) { revalidatePath("/admin/galeria"); revalidatePath("/galeria") }
  return result
}
export async function uploadAlbumPhotos(formData: FormData) {
  const result = await uploadAlbumPhotosService(formData)
  if (result.success) revalidatePath("/admin/galeria")
  return result
}
export async function deletePhoto(data: string | FormData) {
  const id = typeof data === "string" ? data : data.get("id") as string
  const result = await deletePhotoService(id)
  if (result.success) revalidatePath("/admin/galeria")
  return result
}
export async function createGallery(formData: FormData) {
  const result = await createGalleryService(formData)
  if (result.success) revalidatePath("/admin/gallery")
  return result
}
export async function deleteGallery(id: string) {
  const result = await deleteGalleryService(id)
  if (result.success) revalidatePath("/admin/gallery")
  return result
}
export async function uploadGalleryImages(galleryId: string, formData: FormData) {
  const result = await uploadGalleryImagesService(galleryId, formData)
  if (result.success) revalidatePath(`/admin/gallery/${galleryId}/edit`)
  return result
}
export async function deleteSingleImage(imageId: string, galleryId: string) {
  const result = await deleteSingleImageService(imageId)
  if (result.success) revalidatePath(`/admin/gallery/${galleryId}/edit`)
  return result
}
export async function getAlbums() { return getAlbumsService() }
export async function getAlbum(slugOrId: string) { return getAlbumService(slugOrId) }
export async function getGallery(id: string) { return getGalleryService(id) }
