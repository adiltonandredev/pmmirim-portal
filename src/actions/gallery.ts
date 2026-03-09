"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { saveFile } from "@/lib/file-upload"
import { logAdminAction } from "@/lib/audit" // <--- O Espião

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
    } catch (e) {
        console.error("Erro ao deletar arquivo físico:", e)
    }
}

// ==========================================
// 1. SALVAR / ATUALIZAR ÁLBUM
// ==========================================
export async function saveAlbum(formData: FormData) {
  try {
    const id = formData.get("id") as string
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const dateStr = formData.get("date") as string
    const active = formData.get("active") === "true"
    
    if (!title) {
        return { success: false, message: "O título do álbum é obrigatório." }
    }

    const coverFile = formData.get("coverImage") as File
    let coverImageUrl = undefined

    if (coverFile && coverFile.size > 0) {
        coverImageUrl = await saveFile(coverFile, "albums")
    }

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
      await logAdminAction("EDITOU", "Álbum", `Título: ${title}`);
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
      await logAdminAction("CRIOU", "Álbum", `Título: ${title}`);
    }

    revalidatePath("/admin/galeria")
    revalidatePath("/galeria")
    
    return { success: true, message: id ? "Álbum atualizado com sucesso!" : "Álbum criado com sucesso!" }

  } catch (error) {
    console.error("Erro saveAlbum:", error)
    return { success: false, message: "Erro interno ao salvar o álbum." }
  }
}

// ==========================================
// 2. DELETAR ÁLBUM (Híbrido: String ou FormData)
// ==========================================
export async function deleteAlbum(data: string | FormData) {
  try {
    const id = getId(data)
    if (!id) return { success: false, message: "ID do álbum inválido." }

    const album = await prisma.album.findUnique({ where: { id }, include: { photos: true } })
    
    if (album) {
        // Deleta capa
        if (album.coverImage) await tryDeleteFile(album.coverImage)
        // Deleta todas as fotos de dentro
        for (const photo of album.photos) {
            await tryDeleteFile(photo.url)
        }
    }

    await prisma.album.delete({ where: { id } })
    
    await logAdminAction("EXCLUIU", "Álbum", `Título: ${album?.title || "ID: " + id}`);

    revalidatePath("/admin/galeria")
    revalidatePath("/galeria")
    
    return { success: true, message: "Álbum e todas as suas fotos foram excluídos!" } 
  } catch (error) {
    console.error("Erro deleteAlbum:", error)
    return { success: false, message: "Erro ao excluir o álbum." }
  }
}

// ==========================================
// 3. UPLOAD DE FOTOS (Com retorno de contagem)
// ==========================================
export async function uploadAlbumPhotos(formData: FormData) {
  try {
    const albumId = formData.get("albumId") as string
    const files = formData.getAll("photos") as File[] 

    if (!albumId) return { success: false, message: "ID do álbum faltando." }

    let count = 0
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
    
    if (count > 0) {
        await logAdminAction("EDITOU", "Álbum", `Adicionou ${count} fotos ao álbum ID: ${albumId}`);
    }

    revalidatePath(`/admin/galeria`)
    revalidatePath(`/galeria`)
    
    return { success: true, message: `${count} fotos enviadas com sucesso!`, count } 

  } catch (error) {
      console.error("Erro no upload de fotos:", error)
      return { success: false, message: "Erro ao enviar fotos. Tente novamente." }
  }
}

// ==========================================
// 4. DELETAR FOTO ÚNICA (Híbrido)
// ==========================================
export async function deletePhoto(data: string | FormData) {
  try {
    const id = getId(data)
    if (!id) return { success: false, message: "ID da foto inválido." }

    const photo = await prisma.photo.findUnique({ where: { id } })
    if (photo) {
        await tryDeleteFile(photo.url)
        await prisma.photo.delete({ where: { id } })
    }
    
    revalidatePath("/admin/galeria")
    revalidatePath("/galeria")
    
    return { success: true, message: "Foto excluída com sucesso!" }
  } catch (error) {
    console.error("Erro deletePhoto:", error)
    return { success: false, message: "Erro ao deletar foto." }
  }
}


// ==========================================
// PARTE LEGADO (GALLERY) - Mantida a compatibilidade e adicionado Auditoria
// ==========================================

export async function createGallery(formData: FormData) {
  const title = formData.get("title") as string
  const coverFile = formData.get("coverImage") as File
  const slug = title.toLowerCase().replace(/\s+/g, "_") + "_" + Date.now().toString().slice(-4)
  const coverUrl = await saveFile(coverFile, "gallery")
  const newGallery = await prisma.gallery.create({ data: { title, slug, coverUrl } })
  
  await logAdminAction("CRIOU", "Galeria (Legado)", `Título: ${title}`);
  return newGallery.id
}

export async function uploadGalleryImages(galleryId: string, formData: FormData) {
  const files = formData.getAll("images") as File[]
  for (const file of files) {
      const url = await saveFile(file, "gallery")
      if (url) await prisma.galleryImage.create({ data: { galleryId, url } })
  }
  await logAdminAction("EDITOU", "Galeria (Legado)", `Upload de imagens na Galeria ID: ${galleryId}`);
}

export async function deleteSingleImage(imageId: string, galleryId: string) {
    const image = await prisma.galleryImage.findUnique({ where: { id: imageId } })
    if (image) {
        await tryDeleteFile(image.url)
        await prisma.galleryImage.delete({ where: { id: imageId } })
    }
}

export async function deleteGallery(formData: FormData) {
    const id = formData.get("id") as string
    
    const gallery = await prisma.gallery.findUnique({ where: { id }, include: { images: true }})
    if (gallery) {
        if (gallery.coverUrl) await tryDeleteFile(gallery.coverUrl)
        for (const img of gallery.images) {
            await tryDeleteFile(img.url)
        }
    }

    await prisma.gallery.delete({ where: { id } })
    await logAdminAction("EXCLUIU", "Galeria (Legado)", `ID: ${id}`);
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
// ==========================================

export async function createGalleryItem(formData: FormData) {
  try {
    await createGallery(formData)
    return { success: true, message: "Galeria criada com sucesso!" }
  } catch (e) {
    return { success: false, message: "Erro ao criar galeria antiga." }
  }
}

export async function updateGalleryItem(formData: FormData) {
  try {
    const id = formData.get("id") as string
    const title = formData.get("title") as string
    const coverFile = formData.get("coverImage") as File 

    if (!id) return { success: false, message: "ID faltando" }

    let coverUrl = undefined
    if (coverFile && coverFile.size > 0) {
       coverUrl = await saveFile(coverFile, "gallery")
    }

    await prisma.gallery.update({
       where: { id },
       data: {
           title,
           ...(coverUrl && { coverUrl }) 
       }
    })
    
    await logAdminAction("EDITOU", "Galeria (Legado)", `Título: ${title}`);
    
    revalidatePath("/admin/gallery")
    revalidatePath("/galeria")
    
    return { success: true, message: "Galeria atualizada com sucesso!" }
  } catch (e) {
      console.error("Erro updateGalleryItem:", e)
      return { success: false, message: "Erro ao atualizar a galeria." }
  }
}