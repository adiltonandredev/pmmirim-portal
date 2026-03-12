import { logAdminAction } from "@/lib/audit"
import { findInstitutionHistory, createInstitutionHistoryRecord, updateInstitutionHistoryRecord } from "@/server/repositories/institution.repository"

export async function updateInstitutionHistoryService(formData: FormData) {
  const title = formData.get("title") as string
  const content = formData.get("content") as string
  if (!title || !content) return { success: false, message: "O título e o conteúdo principal são obrigatórios." }
  const data = { title, content, mission: formData.get("mission"), vision: formData.get("vision"), values: formData.get("values"), principles: formData.get("principles") }
  const existing = await findInstitutionHistory()
  if (existing) {
    await updateInstitutionHistoryRecord(existing.id, data)
    await logAdminAction("EDITOU", "Página Institucional", "Atualizou a história, missão, visão ou valores")
  } else {
    await createInstitutionHistoryRecord(data)
    await logAdminAction("CRIOU", "Página Institucional", "Criou o registro inicial da instituição")
  }
  return { success: true, message: "Dados da instituição salvos com sucesso!" }
}
