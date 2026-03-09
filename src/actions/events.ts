"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { saveFile } from "@/lib/file-upload"
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { logAdminAction } from "@/lib/audit" // <--- O Espião

// --- CREATE ---
export async function createEvent(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const location = formData.get("location") as string;
    const description = formData.get("description") as string;
    const dateStr = formData.get("date") as string;
    
    if (!title) {
        return { success: false, message: "O título do evento é obrigatório." };
    }

    let finalDate = new Date();
    if (dateStr) {
        finalDate = new Date(dateStr);
    }

    const file = formData.get("bannerUrl") as File;
    let bannerUrl = null;
    
    if (file && file.size > 0) {
        bannerUrl = await saveFile(file, "events");
    }

    await prisma.event.create({
      data: {
        title,
        date: finalDate,
        location: location || "",
        description: description || "",
        bannerUrl,
      },
    })

    // Log de Auditoria
    await logAdminAction("CRIOU", "Evento", `Título: ${title}`);

    revalidatePath("/admin/events")
    revalidatePath("/")
    
    return { success: true, message: "Evento criado com sucesso!" };

  } catch (error) {
    console.error("ERRO AO CRIAR EVENTO:", error);
    return { success: false, message: "Erro interno ao agendar evento." };
  }
}

// --- UPDATE ---
export async function updateEvent(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    if (!id) {
        return { success: false, message: "ID do evento não encontrado." };
    }

    const title = formData.get("title") as string;
    const location = formData.get("location") as string;
    const description = formData.get("description") as string;
    const dateStr = formData.get("date") as string;
    
    let finalDate = new Date();
    if (dateStr) {
        finalDate = new Date(dateStr);
    }

    const file = formData.get("bannerUrl") as File;
    let bannerUrl = formData.get("existingBannerUrl") as string;

    if (file && file.size > 0) {
        const uploadedPath = await saveFile(file, "events");
        if (uploadedPath) bannerUrl = uploadedPath;
    }

    await prisma.event.update({
      where: { id },
      data: {
        title,
        date: finalDate,
        location,
        description,
        bannerUrl,
      },
    })

    // Log de Auditoria
    await logAdminAction("EDITOU", "Evento", `Título: ${title}`);

    revalidatePath("/admin/events")
    revalidatePath("/")
    
    return { success: true, message: "Evento atualizado com sucesso!" };

  } catch (error) {
    console.error("ERRO AO ATUALIZAR EVENTO:", error);
    return { success: false, message: "Erro interno ao atualizar evento." };
  }
}

// --- DELETE ---
export async function deleteEvent(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    if (!id) {
        return { success: false, message: "ID inválido para exclusão." };
    }

    // 1. Pega os dados antes de deletar para limpar o arquivo físico
    const event = await prisma.event.findUnique({ where: { id } });

    // 2. Deleta o banner do HD, se existir
    if (event?.bannerUrl) {
        try {
            const filePath = join(process.cwd(), "public", event.bannerUrl);
            if (existsSync(filePath)) await unlink(filePath);
        } catch (e) {
            console.error("Erro ao excluir banner do evento do disco:", e);
        }
    }

    // 3. Deleta do banco de dados
    await prisma.event.delete({ where: { id } })
      
    // Log de Auditoria
    await logAdminAction("EXCLUIU", "Evento", `Título: ${event?.title || id}`);

    revalidatePath("/admin/events")
    revalidatePath("/")
    
    return { success: true, message: "Evento excluído com sucesso!" };

  } catch (error) {
    console.error("Erro ao deletar evento:", error);
    return { success: false, message: "Erro ao excluir o evento. Ele pode estar em uso." };
  }
}