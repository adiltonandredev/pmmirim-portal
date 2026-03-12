import { saveFile } from "@/lib/file-upload"
import { logAdminAction } from "@/lib/audit"
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import {
  findAlbumById, findGalleryBySlugOrId, findGalleryById, findAllGalleries,
  createAlbumRecord, updateAlbumRecord, deleteAlbumRecord,
  createPhotoRecord, findPhotoById, deletePhotoRecord,
  createGalleryRecord, updateGalleryRecord, deleteGalleryRecord,
  createGalleryImageRecord, findGalleryImageById, deleteGalleryImageRecord,
} from "@/server/repositories/gallery.repository"

async function tryDeleteFile(path: string) {
  try { const fp = join(process.cwd(), "public", path); if (existsSync(fp)) await unlink(fp) } catch (e) { console.error(e) }
}

export async function saveAlbumService(formData: FormData) {
  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const dateStr = formData.get("date") as string
  const active = formData.get("active") === "true"
  if (!title) return { success: false, message: "O título do álbum é obrigatório." }
  const coverFile = formData.get("coverImage") as File
  let coverImageUrl = undefined
  if (coverFile && coverFile.size > 0) coverImageUrl = await saveFile(coverFile, "albums")
  if (id) {
    await updateAlbumRecord(id, { title, description, date: dateStr ? new Date(dateStr) : undefined, active, ...(coverImageUrl && { coverImage: coverImageUrl }) })
    await logAdminAction("EDITOU", "Álbum", `Título: ${title}`)
    return { success: true, message: "Álbum atualizado com sucesso!" }
  } else {
    await createAlbumRecord({ title, description, date: dateStr ? new Date(dateStr) : new Date(), active, coverImage: coverImageUrl || null })
    await logAdminAction("CRIOU", "Álbum", `Título: ${title}`)
    return { success: true, message: "Álbum criado com sucesso!" }
  }
}

export async function deleteAlbumService(id: string) {
  const album = await findAlbumById(id)
  if (album) {
    if (album.coverImage) await tryDeleteFile(album.coverImage)
    for (const photo of album.photos) await tryDeleteFile(photo.url)
  }
  await deleteAlbumRecord(id)
  await logAdminAction("EXCLUIU", "Álbum", `Título: ${album?.title || "ID: " + id}`)
  return { success: true, message: "Álbum e fotos excluídos com sucesso!" }
}

export async function uploadAlbumPhotosService(formData: FormData) {
  const albumId = formData.get("albumId") as string
  if (!albumId) return { success: false, message: "ID do álbum faltando." }
  const files = formData.getAll("photos") as File[]
  let count = 0
  for (const file of files) {
    if (file.size > 0) { const url = await saveFile(file, "albums"); if (url) { await createPhotoRecord(albumId, url); count++ } }
  }
  if (count > 0) await logAdminAction("EDITOU", "Álbum", `Adicionou ${count} fotos ao álbum ID: ${albumId}`)
  return { success: true, message: `${count} fotos enviadas!`, count }
}

export async function deletePhotoService(id: string) {
  const photo = await findPhotoById(id)
  if (photo) { await tryDeleteFile(photo.url); await deletePhotoRecord(id) }
  return { success: true, message: "Foto excluída!" }
}

export async function createGalleryService(formData: FormData) {
  const title = formData.get("title") as string
  const coverFile = formData.get("coverImage") as File
  const slug = title.toLowerCase().replace(/\s+/g, "_") + "_" + Date.now().toString().slice(-4)
  const coverUrl = await saveFile(coverFile, "gallery")
  await createGalleryRecord({ title, slug, coverUrl: coverUrl || "" })
  await logAdminAction("CRIOU", "Galeria (Legado)", `Título: ${title}`)
  return { success: true, message: "Galeria criada!" }
}

export async function deleteGalleryService(id: string) {
  await deleteGalleryRecord(id)
  return { success: true }
}

export async function uploadGalleryImagesService(galleryId: string, formData: FormData) {
  const files = formData.getAll("images") as File[]
  let count = 0
  for (const file of files) { const url = await saveFile(file, "gallery"); if (url) { await createGalleryImageRecord(galleryId, url); count++ } }
  await logAdminAction("EDITOU", "Galeria (Legado)", `Upload de ${count} imagens`)
  return { success: true, message: `${count} imagens adicionadas!` }
}

export async function deleteSingleImageService(imageId: string) {
  const image = await findGalleryImageById(imageId)
  if (image) { await tryDeleteFile(image.url); await deleteGalleryImageRecord(imageId) }
  return { success: true, message: "Imagem removida!" }
}

export async function getAlbumsService() {
  const albums = await findAllGalleries()
  return albums.map(a => ({ ...a, coverImage: a.coverUrl, photos: a.images.map(img => ({ id: img.id, url: img.url })) }))
}

export async function getAlbumService(slugOrId: string) {
  const gallery = await findGalleryBySlugOrId(slugOrId)
  if (!gallery) return null
  return { ...gallery, coverImage: gallery.coverUrl, photos: gallery.images.map(img => ({ id: img.id, url: img.url })) }
}

export async function getGalleryService(id: string) {
  return findGalleryById(id)
}
