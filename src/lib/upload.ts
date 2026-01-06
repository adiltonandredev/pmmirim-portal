import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function uploadImage(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Tipo de arquivo não permitido. Use JPG, PNG, WEBP ou GIF.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Arquivo muito grande. Tamanho máximo: 5MB.");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = join(process.cwd(), "public/uploads");
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (e) {
  }

  const extension = file.name.split('.').pop() || 'jpg';
  const fileName = `${uuidv4()}.${extension}`;
  
  const filePath = join(uploadDir, fileName);
  
  await writeFile(filePath, buffer);

  return `/uploads/${fileName}`;
}