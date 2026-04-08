import { hash } from "bcryptjs"
import { logAdminAction } from "@/lib/audit"
import { findUserById, findUserByEmail, createUserRecord, updateUserRecord, deleteUserRecord } from "@/server/repositories/users.repository"

export async function createUserService(formData: FormData, sessionUserId: string, sessionRole: string) {
  if (sessionRole !== "ADMIN") return { success: false, message: "Acesso negado. Apenas administradores podem criar usuários." }
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const roleRaw = formData.get("role") as string
  const role = (roleRaw === "ADMIN" || roleRaw === "EDITOR") ? roleRaw : "EDITOR"
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string
  if (!name || !email || !password) return { success: false, message: "Nome, e-mail e senha são obrigatórios." }
  if (confirmPassword && password !== confirmPassword) return { success: false, message: "A confirmação de senha não confere." }
  try {
    const existing = await findUserByEmail(email)
    if (existing) return { success: false, message: "Este e-mail já está cadastrado." }
    const hashedPassword = await hash(password, 10)
    await createUserRecord({ name, email, password: hashedPassword, role: role as import("@prisma/client").Role })
    await logAdminAction("CRIOU", "Usuário do Sistema", `Nome: ${name} | Cargo: ${role}`)
    return { success: true, message: "Usuário criado com sucesso!" }
  } catch (error: any) {
    console.error("Erro ao criar usuário:", error)
    return { success: false, message: error?.message || "Erro ao criar usuário." }
  }
}

export async function updateUserService(formData: FormData, sessionRole: string) {
  if (sessionRole !== "ADMIN") return { success: false, message: "Acesso negado. Apenas administradores podem editar usuários." }
  const id = formData.get("id") as string
  if (!id) return { success: false, message: "ID do usuário não encontrado." }
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const roleRaw = formData.get("role") as string
  const role = (roleRaw === "ADMIN" || roleRaw === "USER") ? roleRaw : "USER"
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string
  const dataToUpdate: Record<string, unknown> = { name, email, role }
  if (password && password.trim() !== "") {
    if (password !== confirmPassword) return { success: false, message: "As senhas digitadas não conferem." }
    dataToUpdate.password = await hash(password, 10)
  }
  await updateUserRecord(id, dataToUpdate)
  await logAdminAction("EDITOU", "Usuário do Sistema", `Nome: ${name}`)
  return { success: true, message: "Usuário atualizado com sucesso!" }
}

export async function deleteUserService(userId: string, sessionUserId: string, sessionRole: string) {
  if (sessionRole !== "ADMIN") return { success: false, message: "Acesso negado." }
  if (!userId) return { success: false, message: "ID do usuário inválido." }
  if (sessionUserId === userId) return { success: false, message: "Você não pode excluir sua própria conta." }
  const alvo = await findUserById(userId)
  if (!alvo) return { success: false, message: "Usuário não encontrado." }
  await deleteUserRecord(userId)
  await logAdminAction("EXCLUIU", "Usuário do Sistema", `Nome: ${alvo.name || alvo.email || userId}`)
  return { success: true, message: "Usuário excluído com sucesso!" }
}
