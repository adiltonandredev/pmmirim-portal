"use server";

import { UTApi } from "uploadthing/server";

// Inicializa a API do UploadThing
const utapi = new UTApi();

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadImage(file: File | null): Promise<string | null> {
  // 1. Validações Iniciais (Mantendo sua lógica original)
  if (!file || file.size === 0) return null;

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Tipo de arquivo não permitido. Use JPG, PNG, WEBP ou GIF.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Arquivo muito grande. Tamanho máximo: 5MB.");
  }

  try {
    console.log(`Enviando para UploadThing: ${file.name}`);

    // 2. Envia para a nuvem (Substituindo o fs.writeFile)
    const response = await utapi.uploadFiles([file]);
    const uploadedFile = response[0];

    // 3. Verifica erros do UploadThing
    if (uploadedFile.error) {
      console.error("Erro no UploadThing:", uploadedFile.error);
      // Retorna null para indicar falha, igual seu código original faria
      return null;
    }

    // 4. Sucesso! Retorna o link da nuvem
    console.log("Upload concluído:", uploadedFile.data.url);
    return uploadedFile.data.url;

  } catch (error) {
    console.error("Erro fatal no upload:", error);
    return null;
  }
}