"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
// IMPORTA A NOVA FUNÇÃO DE SALVAR ARQUIVO
import { saveFile } from "@/lib/file-upload"

// Gerador de Slug
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
}

export async function createPost(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const summary = formData.get("summary") as string;
    const content = formData.get("content") as string;
    
    // --- MUDANÇA AQUI: USA O SAVEFILE ---
    // Salva na pasta "news"
    const file = formData.get("coverImage") as File;
    const coverImage = await saveFile(file, "news"); 

    if (!title) return { error: "O título é obrigatório." };

    let slug = generateSlug(title);
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    await prisma.post.create({
      data: {
        title,
        slug,
        summary: summary || "",
        content: content || "",
        coverImage, // Agora salva a URL: /uploads/news/arquivo.jpg
        type: "NEWS",
        published: formData.get("published") === "on",
        featured: formData.get("featured") === "on",
      },
    })

    revalidatePath("/admin/posts")
    revalidatePath("/")
    revalidatePath("/noticias")

    return { success: true };

  } catch (error) {
    console.error("ERRO AO CRIAR POST:", error);
    return { error: "Erro ao criar notícia." };
  }
}

export async function updatePost(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    if (!id) return { error: "ID não encontrado." };

    const title = formData.get("title") as string;
    const summary = formData.get("summary") as string;
    const content = formData.get("content") as string;

    // --- MUDANÇA AQUI: ---
    const file = formData.get("coverImage") as File;
    let coverImage = formData.get("existingCoverImage") as string;

    // Se enviou arquivo novo, salva no disco e substitui a URL
    if (file && file.size > 0) {
        coverImage = await saveFile(file, "news");
    }

    await prisma.post.update({
      where: { id },
      data: {
        title,
        summary,
        content,
        coverImage,
        type: "NEWS",
        published: formData.get("published") === "on",
        featured: formData.get("featured") === "on",
      },
    })

    revalidatePath("/admin/posts")
    revalidatePath("/")
    revalidatePath("/noticias")

    return { success: true };

  } catch (error) {
    console.error("ERRO AO ATUALIZAR POST:", error);
    return { error: "Erro ao atualizar notícia." };
  }
}

export async function deletePost(formData: FormData) {
    const id = formData.get("id") as string;
    if (!id) return;

    try {
      await prisma.post.delete({ where: { id } })
      revalidatePath("/admin/posts")
      revalidatePath("/")
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
}