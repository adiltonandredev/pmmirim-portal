"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

type ActionData = FormData | Record<string, unknown>;

function getValue(data: ActionData, key: string): unknown {
  if (data instanceof FormData) return data.get(key);
  return data[key];
}

// === PROCESSAMENTO DE IMAGEM ROBUSTO (Igual ao Aniversariantes) ===
async function processImage(photoInput: unknown, existingUrl?: string): Promise<string> {
  if (
    photoInput &&
    typeof photoInput === 'object' &&
    photoInput !== null &&
    'size' in photoInput &&
    'arrayBuffer' in photoInput &&
    (photoInput as any).size > 0
  ) {
    try {
      const file = photoInput as File;
      const buffer = await file.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      const mimeType = file.type || 'image/jpeg';
      return `data:${mimeType};base64,${base64}`;
    } catch (e) {
      console.error("Erro imagem aluno:", e);
      return existingUrl || "";
    }
  }
  return existingUrl || "";
}

// === ACTIONS ===

export async function createFeaturedStudent(data: ActionData) {
  try {
    const studentName = getValue(data, "studentName") as string;
    const achievement = getValue(data, "achievement") as string;
    const turma = getValue(data, "class") as string;
    const description = getValue(data, "description") as string;
    const month = Number(getValue(data, "month"));
    const year = Number(getValue(data, "year"));

    const photoInput = getValue(data, "photoUrl");
    const photoUrl = await processImage(photoInput);

    if (!studentName) throw new Error("Nome é obrigatório.");

    await prisma.featuredStudent.create({
      data: {
        studentName,
        achievement: achievement || "Destaque do Mês",
        class: turma || "",
        description: description || "",
        month: month || new Date().getMonth() + 1,
        year: year || new Date().getFullYear(),
        photoUrl,
        active: true,
      },
    })

    revalidatePath("/admin/featured-student")
    revalidatePath("/")
    return { success: true };
  } catch (error) {
    console.error("ERRO CRIAR ALUNO:", error);
    throw error;
  }
}

export async function updateFeaturedStudent(data: ActionData) {
  try {
    const id = getValue(data, "id") as string;
    const finalId = id || (data instanceof FormData ? data.get("id") as string : null);

    if (!finalId) throw new Error("ID não encontrado.");

    const studentName = getValue(data, "studentName") as string;
    const achievement = getValue(data, "achievement") as string;
    const turma = getValue(data, "class") as string;
    const description = getValue(data, "description") as string;
    const month = Number(getValue(data, "month"));
    const year = Number(getValue(data, "year"));

    const photoInput = getValue(data, "photoUrl");
    const existingPhotoUrl = getValue(data, "existingPhotoUrl") as string;
    const photoUrl = await processImage(photoInput, existingPhotoUrl);

    const activeRaw = getValue(data, "active");
    const active = activeRaw === "on" || activeRaw === true;

    await prisma.featuredStudent.update({
      where: { id: finalId },
      data: {
        studentName,
        achievement,
        class: turma,
        description,
        month,
        year,
        photoUrl,
        active,
      },
    })

    revalidatePath("/admin/featured-student")
    revalidatePath("/")
    return { success: true };
  } catch (error) {
    console.error("ERRO ATUALIZAR ALUNO:", error);
    throw error;
  }
}

export async function deleteFeaturedStudent(data: ActionData | string) {
    const id = typeof data === 'string' ? data : getValue(data, "id") as string;
    if (!id) return;

    try {
      await prisma.featuredStudent.delete({ where: { id } })
      revalidatePath("/admin/featured-student")
      revalidatePath("/")
      return { success: true };
    } catch (error) {
      console.error("Erro ao deletar:", error);
      throw error;
    }
}