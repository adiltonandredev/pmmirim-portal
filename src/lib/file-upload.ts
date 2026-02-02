import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

/**
 * Salva um arquivo na pasta public/uploads/{folder}
 * @param file O arquivo vindo do formulário
 * @param folder O nome da subpasta (ex: 'news', 'team', 'banners')
 * @returns A URL pública para acessar a imagem (ex: /uploads/news/foto.jpg)
 */
export async function saveFile(file: File | null, folder: string = "general"): Promise<string> {
  if (!file || typeof file !== "object" || !file.size) return "";

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Limpa o nome do arquivo para evitar caracteres estranhos
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    // Cria um nome único: TIMESTAMP-NOME
    const filename = `${Date.now()}-${safeName}`;

    // Define o caminho no servidor: ./public/uploads/pasta
    const uploadDir = join(process.cwd(), "public", "uploads", folder);
    
    // Cria a pasta se ela não existir
    await mkdir(uploadDir, { recursive: true });

    // Caminho completo do arquivo
    const finalPath = join(uploadDir, filename);

    // Grava o arquivo no disco
    await writeFile(finalPath, buffer);

    // Retorna o caminho público (URL)
    return `/uploads/${folder}/${filename}`;
  } catch (error) {
    console.error(`Erro ao salvar arquivo em ${folder}:`, error);
    return "";
  }
}