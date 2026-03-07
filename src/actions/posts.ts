"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { saveFile } from "@/lib/file-upload"
// 1. IMPORTAÇÃO DA AUDITORIA
import { logAdminAction } from "@/lib/audit" 

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
        coverImage, 
        type: "NEWS",
        published: formData.get("published") === "on",
        featured: formData.get("featured") === "on",
      },
    })

    // 2. REGISTRA A CRIAÇÃO
    await logAdminAction("CRIOU", "Notícia", `Título: ${title}`);

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

    const file = formData.get("coverImage") as File;
    let coverImage = formData.get("existingCoverImage") as string;

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

    // 3. REGISTRA A EDIÇÃO
    await logAdminAction("EDITOU", "Notícia", `Título: ${title}`);

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
      // (Opcional) Buscamos o título antes de deletar para o log ficar bonito
      const post = await prisma.post.findUnique({ where: { id }, select: { title: true } });

      await prisma.post.delete({ where: { id } })
      
      // 4. REGISTRA A EXCLUSÃO
      await logAdminAction("EXCLUIU", "Notícia", `Título: ${post?.title || "ID: " + id}`);

      revalidatePath("/admin/posts")
      revalidatePath("/")
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
}