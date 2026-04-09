"use server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { saveFile } from "@/lib/file-upload"
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { logAdminAction } from "@/lib/audit"

async function tryDeleteFile(path: string) {
  try {
    const fp = join(process.cwd(), "public", path)
    if (existsSync(fp)) await unlink(fp)
  } catch {}
}

const revalidate = () => {
  revalidatePath("/admin/institution/structure")
  revalidatePath("/instituicao/estrutura")
}

export async function createStructure(formData: FormData) {
  const title = (formData.get("title") as string)?.trim()
  if (!title) return { success: false, message: "Título é obrigatório." }

  const file = formData.get("chartImage") as File
  let chartImage: string | null = null
  if (file && file.size > 0) chartImage = await saveFile(file, "structure")

  await prisma.organizationalStructure.create({
    data: {
      title,
      description: (formData.get("description") as string) || null,
      content: (formData.get("content") as string) || null,
      chartImage,
      order: parseInt(formData.get("order") as string || "0"),
    },
  })
  await logAdminAction("CRIOU", "Estrutura Organizacional", `Título: ${title}`)
  revalidate()
  return { success: true, message: "Criado com sucesso!" }
}

export async function updateStructure(formData: FormData) {
  const id = formData.get("id") as string
  const title = (formData.get("title") as string)?.trim()
  if (!id || !title) return { success: false, message: "Dados inválidos." }

  const file = formData.get("chartImage") as File
  let chartImage = formData.get("existingChartImage") as string | null

  if (file && file.size > 0) {
    const uploaded = await saveFile(file, "structure")
    if (uploaded) {
      if (chartImage) await tryDeleteFile(chartImage)
      chartImage = uploaded
    }
  }

  if (formData.get("removeImage") === "true") {
    if (chartImage) await tryDeleteFile(chartImage)
    chartImage = null
  }

  await prisma.organizationalStructure.update({
    where: { id },
    data: {
      title,
      description: (formData.get("description") as string) || null,
      content: (formData.get("content") as string) || null,
      chartImage,
      order: parseInt(formData.get("order") as string || "0"),
    },
  })
  await logAdminAction("EDITOU", "Estrutura Organizacional", `Título: ${title}`)
  revalidate()
  return { success: true, message: "Atualizado com sucesso!" }
}

export async function deleteStructure(id: string) {
  const item = await prisma.organizationalStructure.findUnique({ where: { id } })
  if (item?.chartImage) await tryDeleteFile(item.chartImage)
  await prisma.organizationalStructure.delete({ where: { id } })
  await logAdminAction("EXCLUIU", "Estrutura Organizacional", `ID: ${id}`)
  revalidate()
  return { success: true, message: "Excluído com sucesso." }
}
