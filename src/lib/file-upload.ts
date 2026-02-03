import { UTApi } from "uploadthing/server";

// Inicializa a API do UploadThing
const utapi = new UTApi();

/**
 * Envia um arquivo para o UploadThing (Nuvem)
 * @param file O arquivo vindo do formulário
 * @param folder (Opcional - mantido apenas para compatibilidade, o UploadThing gerencia isso)
 * @returns A URL pública da imagem (https://utfs.io/...) ou string vazia se falhar
 */
export async function saveFile(file: File | null, folder: string = "general"): Promise<string> {
  // 1. Validações básicas (igual ao seu código antigo)
  if (!file || typeof file !== "object" || !file.size) return "";

  try {
    console.log(`Enviando para UploadThing: ${file.name}`);

    // 2. Envia para a nuvem
    // O UploadThing espera um array, então passamos [file]
    const response = await utapi.uploadFiles([file]);
    
    // Pegamos a resposta do primeiro (e único) arquivo
    const uploadedFile = response[0];

    // 3. Verifica erro na resposta da API
    if (uploadedFile.error) {
      console.error("Erro no UploadThing:", uploadedFile.error);
      return "";
    }

    // 4. Sucesso! Retorna o link https://...
    console.log("Upload concluído:", uploadedFile.data.url);
    return uploadedFile.data.url;

  } catch (error) {
    console.error("Erro fatal no upload:", error);
    return "";
  }
}