import { UTApi } from "uploadthing/server";

export async function saveFile(file: File | null, folder: string = "general"): Promise<string> {
  if (!file || typeof file !== "object" || !file.size) return "";

  if (!process.env.UPLOADTHING_TOKEN && !process.env.UPLOADTHING_SECRET) {
    console.warn("UPLOADTHING_TOKEN não configurado — upload ignorado.");
    return "";
  }

  try {
    const utapi = new UTApi();
    console.log(`Enviando para UploadThing: ${file.name}`);
    const response = await utapi.uploadFiles([file]);
    const uploadedFile = response[0];

    if (uploadedFile.error) {
      console.error("Erro no UploadThing:", uploadedFile.error);
      return "";
    }

    console.log("Upload concluído:", uploadedFile.data.url);
    return uploadedFile.data.url;

  } catch (error) {
    console.error("Erro fatal no upload:", error);
    return "";
  }
}