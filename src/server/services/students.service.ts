import { hash } from "bcryptjs"
import { logAdminAction } from "@/lib/audit"
import { saveFile } from "@/lib/file-upload"
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { findStudentById, findStudentByMatricula, createStudentRecord, updateStudentRecord, deleteStudentRecord, findFeaturedStudentById, createFeaturedStudentRecord, updateFeaturedStudentRecord, deleteFeaturedStudentRecord } from "@/server/repositories/students.repository"

async function tryDeleteFile(path: string) {
  try { const fp = join(process.cwd(), "public", path); if (existsSync(fp)) await unlink(fp) } catch (e) { console.error(e) }
}

export async function createStudentService(formData: FormData) {
  const name = formData.get("name") as string
  const matricula = formData.get("matricula") as string
  const password = formData.get("password") as string
  if (!name || !matricula || !password) return { success: false, message: "Nome, Matrícula e Senha são obrigatórios." }
  const existing = await findStudentByMatricula(matricula)
  if (existing) return { success: false, message: "Esta matrícula já está em uso por outro aluno." }
  const file = formData.get("photo") as File
  let photoUrl = null
  if (file && file.size > 0) photoUrl = await saveFile(file, "students")
  const hashedPassword = await hash(password, 10)
  const birthDateStr = formData.get("birthDate") as string
  await createStudentRecord({ name, matricula, password: hashedPassword, schoolName: formData.get("schoolName"), schoolGrade: formData.get("schoolGrade"), shift: formData.get("shift"), cpf: formData.get("cpf"), phone: formData.get("phone"), birthDate: birthDateStr ? new Date(birthDateStr) : null, photoUrl })
  await logAdminAction("CRIOU", "Aluno", `Nome: ${name} | Matrícula: ${matricula}`)
  return { success: true, message: "Aluno cadastrado com sucesso!" }
}

export async function updateStudentService(formData: FormData) {
  const id = formData.get("id") as string
  if (!id) return { success: false, message: "ID do aluno não encontrado." }
  const name = formData.get("name") as string
  const file = formData.get("photo") as File
  let photoUrl = formData.get("existingPhotoUrl") as string
  if (file && file.size > 0) { const up = await saveFile(file, "students"); if (up) photoUrl = up }
  const password = formData.get("password") as string
  const birthDateStr = formData.get("birthDate") as string
  const data: Record<string, unknown> = { name, matricula: formData.get("matricula"), schoolName: formData.get("schoolName"), schoolGrade: formData.get("schoolGrade"), shift: formData.get("shift"), cpf: formData.get("cpf"), phone: formData.get("phone"), birthDate: birthDateStr ? new Date(birthDateStr) : null, photoUrl }
  if (password && password.trim() !== "") data.password = await hash(password, 10)
  await updateStudentRecord(id, data)
  await logAdminAction("EDITOU", "Aluno", `Nome: ${name}`)
  return { success: true, message: "Dados do aluno atualizados com sucesso!" }
}

export async function deleteStudentService(id: string) {
  const student = await findStudentById(id)
  if (student?.photoUrl) await tryDeleteFile(student.photoUrl)
  await deleteStudentRecord(id)
  await logAdminAction("EXCLUIU", "Aluno", `Nome: ${student?.name || id}`)
  return { success: true, message: "Aluno excluído com sucesso!" }
}

export async function createFeaturedStudentService(formData: FormData) {
  const studentName = formData.get("studentName") as string
  const achievement = formData.get("achievement") as string
  if (!studentName || !achievement) return { success: false, message: "Nome e Conquista são obrigatórios." }
  const file = formData.get("photoUrl") as File
  let photoUrl = null
  if (file && file.size > 0) photoUrl = await saveFile(file, "featured-students")
  await createFeaturedStudentRecord({ studentName, class: formData.get("class"), achievement, description: formData.get("description"), month: parseInt(formData.get("month") as string, 10), year: parseInt(formData.get("year") as string, 10), active: formData.get("active") === "on", photoUrl })
  await logAdminAction("CRIOU", "Aluno Destaque", `Nome: ${studentName}`)
  return { success: true, message: "Aluno destaque adicionado com sucesso!" }
}

export async function updateFeaturedStudentService(formData: FormData) {
  const id = formData.get("id") as string
  if (!id) return { success: false, message: "ID não encontrado." }
  const studentName = formData.get("studentName") as string
  const file = formData.get("photoUrl") as File
  let photoUrl = formData.get("existingPhotoUrl") as string
  if (file && file.size > 0) { const up = await saveFile(file, "featured-students"); if (up) photoUrl = up }
  await updateFeaturedStudentRecord(id, { studentName, class: formData.get("class"), achievement: formData.get("achievement"), description: formData.get("description"), month: parseInt(formData.get("month") as string, 10), year: parseInt(formData.get("year") as string, 10), active: formData.get("active") === "on", photoUrl })
  await logAdminAction("EDITOU", "Aluno Destaque", `Nome: ${studentName}`)
  return { success: true, message: "Aluno destaque atualizado!" }
}

export async function deleteFeaturedStudentService(id: string) {
  const student = await findFeaturedStudentById(id)
  if (student?.photoUrl) await tryDeleteFile(student.photoUrl)
  await deleteFeaturedStudentRecord(id)
  await logAdminAction("EXCLUIU", "Aluno Destaque", `Nome: ${student?.studentName || id}`)
  return { success: true, message: "Destaque excluído com sucesso!" }
}
