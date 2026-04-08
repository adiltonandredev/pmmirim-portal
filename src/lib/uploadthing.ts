"use server";

import { UTApi } from "uploadthing/server";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// ==========================================
// 1. FAZER UPLOAD PARA A NUVEM
// ==========================================
export async function uploadImage(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;

  if (!process.env.UPLOADTHING_TOKEN && !process.env.UPLOADTHING_SECRET) {
    console.warn("UPLOADTHING_TOKEN não configurado — upload ignorado.");
    return null;
  }

  const utapi = new UTApi();

  // Validações que as Actions vão capturar no Try/Catch
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Tipo de arquivo não permitido. Use JPG, PNG, WEBP ou GIF.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Arquivo muito grande. O tamanho máximo permitido é 5MB.");
  }

  try {
    const response = await utapi.uploadFiles([file]);
    const uploadedFile = response[0];

    // Se a nuvem recusar, joga o erro para a Action mostrar no Toast
    if (uploadedFile.error) {
      console.error("Erro no UploadThing:", uploadedFile.error);
      throw new Error(`Erro na nuvem: ${uploadedFile.error.message}`);
    }

    // Sucesso! Retorna apenas o link da nuvem
    return uploadedFile.data.url;

  } catch (error: any) {
    console.error("Erro fatal no upload:", error);
    // Repassa o erro para o frontend saber o que houve
    throw new Error(error.message || "Falha ao enviar a imagem para a nuvem.");
  }
}

// ==========================================
// 2. APAGAR IMAGEM DA NUVEM (BÔNUS DE OURO)
// ==========================================
export async function deleteImageFromCloud(fileUrl: string) {
  if (!fileUrl) return;
  if (!process.env.UPLOADTHING_TOKEN && !process.env.UPLOADTHING_SECRET) return;

  try {
    const utapi = new UTApi();
    const fileKey = fileUrl.split("/").pop();
    if (fileKey) await utapi.deleteFiles([fileKey]);
  } catch (error) {
    console.error(`Erro ao tentar apagar imagem da nuvem (${fileUrl}):`, error);
  }
}