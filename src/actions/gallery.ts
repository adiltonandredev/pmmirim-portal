"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { saveFile } from "@/lib/file-upload"

// Helper para pegar ID seja vindo de Texto (Componente) ou FormData (Formulário)
function getId(data: string | FormData): string {
  if (typeof data === 'string') return data
  return data.get("id") as string
}

// Helper para deletar arquivos sem quebrar
async function tryDeleteFile(path: string) {
    try {
        const fullPath = join(process.cwd(), "public", path)
        if (existsSync(fullPath)) await unlink(fullPath)
    } catch (e) {}
}

// ==========================================
// 1. SALVAR / ATUALIZAR ÁLBUM
// ==========================================
export async function saveAlbum(formData: FormData) {
  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const dateStr = formData.get("date") as string
  const active = formData.get("active") === "true"
  
  const coverFile = formData.get("coverImage") as File
  let coverImageUrl = undefined

  if (coverFile && coverFile.size > 0) {
     coverImageUrl = await saveFile(coverFile, "albums")
  }

  try {
    if (id) {
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

// ==========================================
// 2. DELETAR ÁLBUM (Híbrido: String ou FormData)
// ==========================================
export async function deleteAlbum(data: string | FormData) {
  const id = getId(data)
  if (!id) return

  try {
    const album = await prisma.album.findUnique({ where: { id }, include: { photos: true } })
    
    if (album) {
        if (album.coverImage) tryDeleteFile(album.coverImage)
        for (const photo of album.photos) {
            tryDeleteFile(photo.url)
        }
    }

    await prisma.album.delete({ where: { id } })
    revalidatePath("/admin/galeria")
    return { success: true } // O componente espera esse retorno
  } catch (error) {
    console.error("Erro deleteAlbum:", error)
    return { error: "Erro ao deletar" }
  }
}

// ==========================================
// 3. UPLOAD DE FOTOS (Com retorno de contagem)
// ==========================================
export async function uploadAlbumPhotos(formData: FormData) {
  const albumId = formData.get("albumId") as string
  const files = formData.getAll("photos") as File[] 

  if (!albumId) return { success: false, error: "ID do álbum faltando" }

  let count = 0
  try {
    for (const file of files) {
        if (file.size > 0) {
        const url = await saveFile(file, "albums")
        if (url) {
            await prisma.photo.create({
            data: { albumId, url }
            })
            count++
        }
        }
    }
    revalidatePath(`/admin/galeria`)
    
    // RETORNO QUE O COMPONENTE ESPERA (result.success, result.count)
    return { success: true, count } 

  } catch (error) {
      console.error(error)
      return { success: false, error: "Erro ao enviar fotos" }
  }
}

// ==========================================
// 4. DELETAR FOTO ÚNICA (Híbrido)
// ==========================================
export async function deletePhoto(data: string | FormData) {
  const id = getId(data)
  if (!id) return

  try {
    const photo = await prisma.photo.findUnique({ where: { id } })
    if (photo) {
        tryDeleteFile(photo.url)
        await prisma.photo.delete({ where: { id } })
    }
    revalidatePath("/admin/galeria")
    return { success: true }
  } catch (error) {
    console.error("Erro deletePhoto:", error)
    return { error: "Erro ao deletar foto" }
  }
}


// ==========================================
// PARTE LEGADO (GALLERY) - Mantido para compatibilidade
// ==========================================

export async function createGallery(formData: FormData) {
  const title = formData.get("title") as string
  const coverFile = formData.get("coverImage") as File
  const slug = title.toLowerCase().replace(/\s+/g, "_") + "_" + Date.now().toString().slice(-4)
  const coverUrl = await saveFile(coverFile, "gallery")
  const newGallery = await prisma.gallery.create({ data: { title, slug, coverUrl } })
  return newGallery.id
}

export async function uploadGalleryImages(galleryId: string, formData: FormData) {
  const files = formData.getAll("images") as File[]
  for (const file of files) {
      const url = await saveFile(file, "gallery")
      if (url) await prisma.galleryImage.create({ data: { galleryId, url } })
  }
}

export async function deleteSingleImage(imageId: string, galleryId: string) {
    const image = await prisma.galleryImage.findUnique({ where: { id: imageId } })
    if (image) {
        tryDeleteFile(image.url)
        await prisma.galleryImage.delete({ where: { id: imageId } })
    }
}

export async function deleteGallery(formData: FormData) {
    const id = formData.get("id") as string
    await prisma.gallery.delete({ where: { id } })
    revalidatePath("/admin/gallery")
}

export async function getAlbums() {
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

// ==========================================
// COMPATIBILIDADE COM O FORMULÁRIO ANTIGO (GalleryForm)
// Adicionamos isso para o build não quebrar
// ==========================================

export async function createGalleryItem(formData: FormData) {
  try {
    // Reutiliza a função createGallery que já existe
    await createGallery(formData)
    return { success: true }
  } catch (e) {
    return { error: "Erro ao criar galeria" }
  }
}

export async function updateGalleryItem(formData: FormData) {
  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const coverFile = formData.get("coverImage") as File // O form antigo costuma usar esse nome

  if (!id) return { error: "ID faltando" }

  try {
    let coverUrl = undefined
    
    // Se enviou nova capa, salva
    if (coverFile && coverFile.size > 0) {
       coverUrl = await saveFile(coverFile, "gallery")
    }

    // Atualiza no banco (Modelo Gallery antigo)
    await prisma.gallery.update({
       where: { id },
       data: {
           title,
           ...(coverUrl && { coverUrl }) // Só atualiza se tiver url nova
       }
    })
    
    revalidatePath("/admin/gallery")
    revalidatePath("/galeria")
    return { success: true }
  } catch (e) {
      console.error("Erro updateGalleryItem:", e)
      return { error: "Erro ao atualizar" }
  }
}