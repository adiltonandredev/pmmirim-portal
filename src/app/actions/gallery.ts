"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { saveFile } from "@/lib/file-upload"

// --- 1. CRIAR ÁLBUM ---
export async function createGallery(formData: FormData) {
  const title = formData.get("title") as string
  const coverFile = formData.get("coverImage") as File

  // Gera slug
  const slug = title.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "") + "_" + Date.now().toString().slice(-4)

  const coverUrl = await saveFile(coverFile, "gallery")

  const newGallery = await prisma.gallery.create({
    data: { title, slug, coverUrl },
  })

  return newGallery.id
}

// --- 2. UPLOAD DE MÚLTIPLAS FOTOS ---
export async function uploadGalleryImages(galleryId: string, formData: FormData) {
  const gallery = await prisma.gallery.findUnique({ where: { id: galleryId } })
  if (!gallery) return

  const files = formData.getAll("images") as File[]

  for (const file of files) {
    if (file.size > 0) {
      const url = await saveFile(file, "gallery")
      if (url) {
        await prisma.galleryImage.create({
          data: { galleryId: gallery.id, url }
        })
      }
    }
  }
  revalidatePath(`/admin/gallery/${galleryId}/edit`)
}

// --- 3. DELETAR FOTO ÚNICA ---
export async function deleteSingleImage(imageId: string, galleryId: string) {
  const image = await prisma.galleryImage.findUnique({ where: { id: imageId } })
  
  if (image) {
    try {
        const filePath = join(process.cwd(), "public", image.url)
        if (existsSync(filePath)) await unlink(filePath)
    } catch (e) { console.error("Erro ao apagar arquivo", e) }

    await prisma.galleryImage.delete({ where: { id: imageId } })
  }
  revalidatePath(`/admin/gallery/${galleryId}/edit`)
}

// --- 4. DELETAR ÁLBUM INTEIRO ---
export async function deleteGallery(formData: FormData) {
  const id = formData.get("id") as string
  const gallery = await prisma.gallery.findUnique({ where: { id }, include: { images: true } })

  if (gallery) {
    for (const img of gallery.images) {
        try {
            const filePath = join(process.cwd(), "public", img.url)
            if (existsSync(filePath)) await unlink(filePath)
        } catch (e) { console.error("Erro apagar img", e) }
    }
    if (gallery.coverUrl) {
        try {
            const coverPath = join(process.cwd(), "public", gallery.coverUrl)
            if (existsSync(coverPath)) await unlink(coverPath)
        } catch (e) { }
    }
    await prisma.gallery.delete({ where: { id } })
  }
  revalidatePath("/admin/gallery")
}

// --- 5. LISTAR ÁLBUNS ---
export async function getAlbums() {
  const albums = await prisma.gallery.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
        _count: { select: { images: true } }
    }
  })
  // Mapeia para o frontend não quebrar
  return albums.map(a => ({
    ...a,
    coverImage: a.coverUrl 
  }))
}

// --- 6. LISTAR UM ÁLBUM (ADMIN) ---
export async function getGallery(id: string) {
  return await prisma.gallery.findUnique({
    where: { id },
    include: { images: { orderBy: { id: 'desc' } } }
  })
}

// --- 7. (NOVO) BUSCAR POR SLUG (CORREÇÃO DO ERRO) ---
export async function getAlbum(slugOrId: string) {
  // 1. Tenta buscar pelo SLUG (padrão correto)
  let gallery = await prisma.gallery.findUnique({
    where: { slug: slugOrId },
    include: { images: { orderBy: { id: 'desc' } } }
  })

  // 2. FALLBACK: Se não achar e parecer um ID, tenta pelo ID
  // Isso resolve o seu erro 404 do print (pois a URL lá é um ID)
  if (!gallery) {
     gallery = await prisma.gallery.findUnique({
        where: { id: slugOrId },
        include: { images: { orderBy: { id: 'desc' } } }
     })
  }

  if (!gallery) return null

  // 3. Traduz os campos para a página entender
  return {
    ...gallery,
    coverImage: gallery.coverUrl, // A página pede .coverImage
    photos: gallery.images        // A página pede .photos
  }
}