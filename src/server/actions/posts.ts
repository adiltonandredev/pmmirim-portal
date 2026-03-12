"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { saveFile } from "@/lib/file-upload"
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { logAdminAction } from "@/lib/audit" // 1. IMPORTAÇÃO DA AUDITORIA

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

// --- CRIAR POST (NOTÍCIA) ---
export async function createPost(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const summary = formData.get("summary") as string;
    const content = formData.get("content") as string;

    if (!title) {
      return { success: false, message: "O título da notícia é obrigatório." };
    }

    const file = formData.get("coverImage") as File;
    let coverImage = null;

    if (file && file.size > 0) {
      coverImage = await saveFile(file, "news");
    }

    let slug = generateSlug(title);
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString().slice(-4)}`;

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

    return { success: true, message: "Notícia criada com sucesso!" };

  } catch (error) {
    console.error("ERRO AO CRIAR POST:", error);
    return { success: false, message: "Erro interno ao criar notícia." };
  }
}

// --- ATUALIZAR POST (NOTÍCIA) ---
export async function updatePost(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    if (!id) {
      return { success: false, message: "ID da notícia não encontrado." };
    }

    const title = formData.get("title") as string;
    const summary = formData.get("summary") as string;
    const content = formData.get("content") as string;

    const file = formData.get("coverImage") as File;
    let coverImage = formData.get("existingCoverImage") as string;

    if (file && file.size > 0) {
      const uploadedPath = await saveFile(file, "news");
      if (uploadedPath) coverImage = uploadedPath;
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

    return { success: true, message: "Notícia atualizada com sucesso!" };

  } catch (error) {
    console.error("ERRO AO ATUALIZAR POST:", error);
    return { success: false, message: "Erro interno ao atualizar notícia." };
  }
}

// --- DELETAR POST (NOTÍCIA) ---
export async function deletePost(data: string | FormData) {
  try {
    // 1. Identificação segura do ID para evitar erros de tipo no VS Code
    let id: string;

    if (typeof data === "string") {
      id = data;
    } else {
      id = data.get("id") as string;
    }

    if (!id) {
      return { success: false, message: "ID inválido para exclusão." };
    }

    // 2. Buscamos a notícia para saber qual é a imagem de capa dela
    const post = await prisma.post.findUnique({ where: { id } });

    // 3. Apagamos a imagem física do HD
    if (post?.coverImage) {
      try {
        const filePath = join(process.cwd(), "public", post.coverImage);
        if (existsSync(filePath)) await unlink(filePath);
      } catch (e) {
        console.error("Erro ao excluir imagem da notícia do disco:", e);
      }
    }

    // 4. Deletamos do banco
    await prisma.post.delete({ where: { id } })

    // 5. REGISTRA A EXCLUSÃO NA AUDITORIA
    await logAdminAction("EXCLUIU", "Notícia", `Título: ${post?.title || "ID: " + id}`);

    revalidatePath("/admin/posts")
    revalidatePath("/")
    revalidatePath("/noticias")

    return { success: true, message: "Notícia excluída com sucesso!" };

  } catch (error) {
    console.error("Erro ao deletar notícia:", error);
    return { success: false, message: "Erro ao excluir a notícia. Ela pode estar em uso." };
  }
}