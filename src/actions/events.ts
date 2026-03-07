"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { saveFile } from "@/lib/file-upload"
// 👇 1. IMPORTAÇÃO DO ESPIÃO
import { logAdminAction } from "@/lib/audit"

export async function createEvent(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const location = formData.get("location") as string;
    const description = formData.get("description") as string;
    const dateStr = formData.get("date") as string;
    
    let finalDate = new Date();
    if (dateStr) {
        finalDate = new Date(dateStr);
    }

    const file = formData.get("bannerUrl") as File;
    const bannerUrl = await saveFile(file, "events");

    if (!title) return { error: "O título do evento é obrigatório." };

    await prisma.event.create({
      data: {
        title,
        date: finalDate,
        location: location || "",
        description: description || "",
        bannerUrl,
      },
    })

    // 👇 2. LOG DE CRIAÇÃO
    await logAdminAction("CRIOU", "Evento", `Título: ${title}`);

    revalidatePath("/admin/events")
    revalidatePath("/")
    return { success: true };
  } catch (error) {
    console.error("ERRO AO CRIAR EVENTO:", error);
    return { error: "Erro ao agendar evento." };
  }
}

export async function updateEvent(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    if (!id) return { error: "ID do evento não encontrado." };

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
        bannerUrl = await saveFile(file, "events");
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

    // 👇 3. LOG DE EDIÇÃO
    await logAdminAction("EDITOU", "Evento", `Título: ${title}`);

    revalidatePath("/admin/events")
    revalidatePath("/")
    return { success: true };
  } catch (error) {
    console.error("ERRO AO ATUALIZAR EVENTO:", error);
    return { error: "Erro ao atualizar evento." };
  }
}

export async function deleteEvent(formData: FormData) {
    const id = formData.get("id") as string;
    if (!id) return;

    try {
      // (Opcional) Pega o nome antes de deletar
      const event = await prisma.event.findUnique({ where: { id }, select: { title: true } });

      await prisma.event.delete({ where: { id } })
      
      // 👇 4. LOG DE EXCLUSÃO
      await logAdminAction("EXCLUIU", "Evento", `Título: ${event?.title || id}`);

      revalidatePath("/admin/events")
      revalidatePath("/")
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
}