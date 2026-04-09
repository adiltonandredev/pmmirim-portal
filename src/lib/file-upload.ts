import { UTApi } from "uploadthing/server";

export async function saveFile(file: File | null, folder: string = "general"): Promise<string> {
  if (!file || typeof file !== "object" || !file.size) return "";

  if (!process.env.UPLOADTHING_TOKEN && !process.env.UPLOADTHING_SECRET) {
    console.warn("UPLOADTHING_TOKEN não configurado — upload ignorado.");
    return "";
  }

  const utapi = new UTApi();
  const response = await utapi.uploadFiles([file]);
  const uploadedFile = response[0];

  if (uploadedFile.error) {
    const errMsg = uploadedFile.error.message || ""
    if (/size|large|limit/i.test(errMsg))
      throw new Error(`O arquivo é muito grande para upload. Reduza o tamanho e tente novamente. (${errMsg})`)
    if (/type|format|mime/i.test(errMsg))
      throw new Error(`Formato de arquivo não suportado. Use JPG, PNG ou WEBP. (${errMsg})`)
    throw new Error(`Erro ao enviar arquivo para o servidor: ${errMsg}`)
  }

  return uploadedFile.data.url;
}
