"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { saveFile } from "@/lib/file-upload"
import { logAdminAction } from "@/lib/audit"

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
// 1. SALVAR / ATUALIZAR ÁLBUM (SISTEMA NOVO)
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
// 2. DELETAR ÁLBUM
// ==========================================
export async function deleteAlbum(data: string | FormData) {
  try {
    const id = getId(data)
    if (!id) return { success: false, message: "ID do álbum inválido." }

    const album = await prisma.album.findUnique({ where: { id }, include: { photos: true } })

    if (album) {
      if (album.coverImage) await tryDeleteFile(album.coverImage)
      for (const photo of album.photos) {
        await tryDeleteFile(photo.url)
      }
    }

    await prisma.album.delete({ where: { id } })
    await logAdminAction("EXCLUIU", "Álbum", `Título: ${album?.title || "ID: " + id}`);

    revalidatePath("/admin/galeria")
    revalidatePath("/galeria")

    return { success: true, message: "Álbum e fotos excluídos com sucesso!" }
  } catch (error) {
    return { success: false, message: "Erro ao excluir o álbum." }
  }
}

// ==========================================
// 3. UPLOAD DE FOTOS (ÁLBUM NOVO)
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
          await prisma.photo.create({ data: { albumId, url } })
          count++
        }
      }
    }

    if (count > 0) {
      await logAdminAction("EDITOU", "Álbum", `Adicionou ${count} fotos ao álbum ID: ${albumId}`);
    }

    revalidatePath(`/admin/galeria`)
    return { success: true, message: `${count} fotos enviadas!`, count }

  } catch (error) {
    return { success: false, message: "Erro ao enviar fotos." }
  }
}

// ==========================================
// 4. DELETAR FOTO ÚNICA (ÁLBUM NOVO)
// ==========================================
export async function deletePhoto(data: string | FormData) {
  try {
    const id = getId(data)
    const photo = await prisma.photo.findUnique({ where: { id } })
    if (photo) {
      await tryDeleteFile(photo.url)
      await prisma.photo.delete({ where: { id } })
    }

    revalidatePath("/admin/galeria")
    return { success: true, message: "Foto excluída!" }
  } catch (error) {
    return { success: false, message: "Erro ao deletar foto." }
  }
}

// ==========================================
// 5. PARTE LEGADO (GALLERY)
// ==========================================

export async function createGallery(formData: FormData) {
  try {
    const title = formData.get("title") as string
    const coverFile = formData.get("coverImage") as File
    const slug = title.toLowerCase().replace(/\s+/g, "_") + "_" + Date.now().toString().slice(-4)
    const coverUrl = await saveFile(coverFile, "gallery")

    await prisma.gallery.create({ data: { title, slug, coverUrl } })
    await logAdminAction("CRIOU", "Galeria (Legado)", `Título: ${title}`);

    revalidatePath("/admin/gallery")
    return { success: true, message: "Galeria criada!" }
  } catch (error) {
    return { success: false, message: "Erro ao criar galeria." }
  }
}

export async function createGalleryItem(formData: FormData) {
  try {
    const title = formData.get("title") as string
    const imageUrl = formData.get("imageUrl") as string

    await prisma.gallery.create({
      data: {
        title,
        coverUrl: imageUrl,
        slug: title.toLowerCase().replace(/\s+/g, "_") + "_" + Date.now().toString().slice(-4)
      }
    })

    revalidatePath("/admin/gallery")
    return { success: true, message: "Foto adicionada!" }
  } catch (error) {
    return { success: false, message: "Erro ao criar" }
  }
}

export async function updateGalleryItem(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string
    const imageUrl = formData.get("imageUrl") as string

    await prisma.gallery.update({
      where: { id },
      data: {
        title,
        coverUrl: imageUrl
      }
    })

    revalidatePath("/admin/gallery")
    return { success: true, message: "Atualizado com sucesso!" }
  } catch (error) {
    return { success: false, message: "Erro ao atualizar" }
  }
}

export async function deleteGallery(id: string) {
  try {
    await prisma.gallery.delete({ where: { id } })
    revalidatePath("/admin/gallery")
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}

export async function uploadGalleryImages(galleryId: string, formData: FormData) {
  try {
    const files = formData.getAll("images") as File[]
    let count = 0
    for (const file of files) {
      const url = await saveFile(file, "gallery")
      if (url) {
        await prisma.galleryImage.create({ data: { galleryId, url } })
        count++
      }
    }
    await logAdminAction("EDITOU", "Galeria (Legado)", `Upload de ${count} imagens`);
    revalidatePath(`/admin/gallery/${galleryId}/edit`)
    return { success: true, message: `${count} imagens adicionadas!` }
  } catch (error) {
    return { success: false, message: "Erro no upload." }
  }
}

export async function deleteSingleImage(imageId: string, galleryId: string) {
  try {
    const image = await prisma.galleryImage.findUnique({ where: { id: imageId } })
    if (image) {
      await tryDeleteFile(image.url)
      await prisma.galleryImage.delete({ where: { id: imageId } })
    }
    revalidatePath(`/admin/gallery/${galleryId}/edit`)
    return { success: true, message: "Imagem removida!" }
  } catch (error) {
    return { success: false, message: "Erro ao remover imagem." }
  }
}

// ==========================================
// 6. FUNÇÕES DE BUSCA (GETTERS)
// ==========================================

export async function getAlbums() {
  try {
    const albums = await prisma.gallery.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        images: { orderBy: { id: 'desc' } }
      }
    })

    return albums.map(a => ({
      ...a,
      coverImage: a.coverUrl,
      photos: a.images.map(img => ({
        id: img.id,
        url: img.url
      }))
    }))
  } catch (error) {
    console.error("Erro ao buscar álbuns:", error)
    return []
  }
}

export async function getAlbum(slugOrId: string) {
  try {
    const gallery = await prisma.gallery.findFirst({
      where: {
        OR: [{ slug: slugOrId }, { id: slugOrId }]
      },
      include: { images: { orderBy: { id: 'desc' } } }
    })

    if (!gallery) return null

    return {
      ...gallery,
      coverImage: gallery.coverUrl,
      photos: gallery.images.map(img => ({
        id: img.id,
        url: img.url
      }))
    }
  } catch (error) {
    return null
  }
}

export async function getGallery(id: string) {
  return await prisma.gallery.findUnique({
    where: { id },
    include: { images: { orderBy: { id: 'desc' } } }
  })
}