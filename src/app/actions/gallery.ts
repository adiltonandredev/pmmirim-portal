"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { saveFile } from "@/lib/file-upload"

// ==========================================
// PARTE 1: FUNÇÕES EXIGIDAS PELO ALBUM MANAGER (NOVO)
// ==========================================

export async function saveAlbum(formData: FormData) {
  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const dateStr = formData.get("date") as string
  const active = formData.get("active") === "true"
  
  const coverFile = formData.get("coverImage") as File
  let coverImageUrl = undefined

  // Upload da capa se existir
  if (coverFile && coverFile.size > 0) {
     coverImageUrl = await saveFile(coverFile, "albums")
  }

  try {
    if (id) {
      // UPDATE
      await prisma.album.update({
        where: { id },
        data: {
          title,
          description,
          date: dateStr ? new Date(dateStr) : undefined,
          active,
          ...(coverImageUrl && { coverImage: coverImageUrl }),
        },
      })
    } else {
      // CREATE
      await prisma.album.create({
        data: {
          title,
          description,
          date: dateStr ? new Date(dateStr) : new Date(),
          active,
          coverImage: coverImageUrl || null,
        },
      })
    }

    revalidatePath("/admin/galeria")
    revalidatePath("/galeria")
    return { success: true }

  } catch (error) {
    console.error("Erro saveAlbum:", error)
    return { error: "Erro ao salvar álbum" }
  }
}

export async function deleteAlbum(formData: FormData) {
  const id = formData.get("id") as string
  if (!id) return

  try {
    const album = await prisma.album.findUnique({ where: { id }, include: { photos: true } })
    
    // Limpeza de arquivos (Opcional, mas recomendado)
    if (album) {
        if (album.coverImage) tryDeleteFile(album.coverImage)
        for (const photo of album.photos) {
            tryDeleteFile(photo.url)
        }
    }

    await prisma.album.delete({ where: { id } })
    revalidatePath("/admin/galeria")
  } catch (error) {
    console.error("Erro deleteAlbum:", error)
  }
}

export async function uploadAlbumPhotos(formData: FormData) {
  const albumId = formData.get("albumId") as string
  const files = formData.getAll("photos") as File[] // O componente deve enviar com name="photos"

  if (!albumId) return

  for (const file of files) {
    if (file.size > 0) {
      const url = await saveFile(file, "albums")
      if (url) {
        await prisma.photo.create({
          data: { albumId, url }
        })
      }
    }
  }
  revalidatePath(`/admin/galeria`) // Atualiza a lista
}

export async function deletePhoto(formData: FormData) {
  const id = formData.get("id") as string
  if (!id) return

  try {
    const photo = await prisma.photo.findUnique({ where: { id } })
    if (photo) {
        tryDeleteFile(photo.url)
        await prisma.photo.delete({ where: { id } })
    }
    revalidatePath("/admin/galeria")
  } catch (error) {
    console.error("Erro deletePhoto:", error)
  }
}

// Helper para deletar arquivos sem quebrar o app
async function tryDeleteFile(path: string) {
    try {
        const fullPath = join(process.cwd(), "public", path)
        if (existsSync(fullPath)) await unlink(fullPath)
    } catch (e) {}
}


// ==========================================
// PARTE 2: LEGADO / COMPATIBILIDADE (MODELO GALLERY)
// Mantivemos para não quebrar outras partes do site
// ==========================================

export async function createGallery(formData: FormData) {
  // ... (código existente mantido para compatibilidade)
  const title = formData.get("title") as string
  const coverFile = formData.get("coverImage") as File
  const slug = title.toLowerCase().replace(/\s+/g, "_") + "_" + Date.now().toString().slice(-4)
  const coverUrl = await saveFile(coverFile, "gallery")
  const newGallery = await prisma.gallery.create({ data: { title, slug, coverUrl } })
  return newGallery.id
}

export async function uploadGalleryImages(galleryId: string, formData: FormData) {
  // ... (código existente mantido)
  const files = formData.getAll("images") as File[]
  for (const file of files) {
      const url = await saveFile(file, "gallery")
      if (url) await prisma.galleryImage.create({ data: { galleryId, url } })
  }
}

export async function deleteSingleImage(imageId: string, galleryId: string) {
    // ... (código existente mantido)
    const image = await prisma.galleryImage.findUnique({ where: { id: imageId } })
    if (image) {
        tryDeleteFile(image.url)
        await prisma.galleryImage.delete({ where: { id: imageId } })
    }
}

export async function deleteGallery(formData: FormData) {
    // ... (código existente mantido)
    const id = formData.get("id") as string
    await prisma.gallery.delete({ where: { id } })
    revalidatePath("/admin/gallery")
}

export async function getAlbums() {
    // Busca do modelo Gallery (se for o que a página pública usa)
    // Se a página pública usar o modelo Album, troque aqui para prisma.album.findMany
    const albums = await prisma.gallery.findMany({
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { images: true } } }
    })
    return albums.map(a => ({ ...a, coverImage: a.coverUrl }))
}

export async function getGallery(id: string) {
    return await prisma.gallery.findUnique({
        where: { id },
        include: { images: { orderBy: { id: 'desc' } } }
    })
}

export async function getAlbum(slugOrId: string) {
    // Lógica híbrida para manter compatibilidade
    let gallery = await prisma.gallery.findUnique({
        where: { slug: slugOrId },
        include: { images: { orderBy: { id: 'desc' } } }
    })
    if (!gallery) {
         gallery = await prisma.gallery.findUnique({
            where: { id: slugOrId },
            include: { images: { orderBy: { id: 'desc' } } }
         })
    }
    if (!gallery) return null
    return { ...gallery, coverImage: gallery.coverUrl, photos: gallery.images }
}