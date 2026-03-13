import { saveFile } from "@/lib/file-upload"
import { logAdminAction } from "@/lib/audit"
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import {
  findBannerById,
  createBannerRecord,
  updateBannerRecord,
  deleteBannerRecord,
  toggleBannerActiveRecord,
} from "@/server/repositories/banners.repository"

type BannerType = "HOME" | "PARTNER" | "SPONSOR"

export async function createBannerService(formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const link = formData.get("link") as string
  const type = formData.get("type") as BannerType
  const order = parseInt(formData.get("order") as string) || 0
  const active = formData.get("active") === "on"

  const file = formData.get("image") as File
  const imageUrl = await saveFile(file, "banners")
  if (!imageUrl) return { success: false, message: "A imagem do banner é obrigatória." }

  await createBannerRecord({ title, description, link, imageUrl, order, active, type: type || "HOME" })
  await logAdminAction("CRIOU", "Banner", `Título: ${title} (${type})`)
  return { success: true, message: "Banner criado com sucesso!" }
}

export async function updateBannerService(formData: FormData) {
  const id = formData.get("id") as string
  if (!id) return { success: false, message: "ID do banner não encontrado." }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const link = formData.get("link") as string
  const type = formData.get("type") as BannerType
  const order = parseInt(formData.get("order") as string) || 0
  const active = formData.get("active") === "on"

  const file = formData.get("image") as File
  let imageUrl = formData.get("existingImageUrl") as string
  if (file && file.size > 0) imageUrl = await saveFile(file, "banners") || imageUrl

  await updateBannerRecord(id, { title, description, link, imageUrl, order, active, type })
  await logAdminAction("EDITOU", "Banner", `Título: ${title}`)
  return { success: true, message: "Banner atualizado com sucesso!" }
}

export async function deleteBannerService(id: string) {
  const banner = await findBannerById(id)

  if (banner?.imageUrl) {
    try {
      const filePath = join(process.cwd(), "public", banner.imageUrl)
      if (existsSync(filePath)) await unlink(filePath)
    } catch (e) {
      console.error("Erro ao excluir arquivo físico:", e)
    }
  }

  await deleteBannerRecord(id)
  await logAdminAction("EXCLUIU", "Banner", `Título: ${banner?.title || "ID: " + id}`)
  return { success: true, message: "Banner excluído com sucesso!" }
}

export async function toggleBannerActiveService(id: string, currentState: boolean) {
  await toggleBannerActiveRecord(id, !currentState)
  const statusName = !currentState ? "Ativado" : "Inativado"
  await logAdminAction("EDITOU", "Banner", `Alterou status para: ${statusName}`)
  return { success: true, message: `Banner ${statusName.toLowerCase()} com sucesso!` }
}
