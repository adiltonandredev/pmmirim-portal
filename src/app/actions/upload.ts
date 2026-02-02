'use server'

import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File
  
  if (!file) {
    throw new Error('Nenhum arquivo enviado')
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Cria um nome único para o arquivo para não substituir outros
  const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`
  
  // Caminho onde será salvo (dentro de public/uploads)
  const uploadDir = join(process.cwd(), 'public', 'uploads')
  
  // Garante que a pasta existe
  try {
    await mkdir(uploadDir, { recursive: true })
  } catch (e) {
    // Ignora erro se a pasta já existir
  }

  const path = join(uploadDir, filename)

  // Salva o arquivo no disco
  await writeFile(path, buffer)

  // Retorna a URL pública para o editor usar
  return `/uploads/${filename}`
}