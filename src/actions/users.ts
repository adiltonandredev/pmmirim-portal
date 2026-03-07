"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { hash } from "bcryptjs"
// 👇 1. IMPORTAÇÃO
import { logAdminAction } from "@/lib/audit"

// 1. CRIAR USUÁRIO
export async function createUser(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  
  const roleRaw = formData.get("role") as string
  const role = (roleRaw === "ADMIN" || roleRaw === "USER") ? roleRaw : "USER"

  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  const session = await auth()
  if (!session || session.user.role !== "ADMIN") return { error: "Sem permissão." }

  if (password !== confirmPassword) {
      return { error: "A confirmação de senha não confere." }
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return { error: "Email já cadastrado." }

  const hashedPassword = await hash(password, 10)

  await prisma.user.create({
    data: { 
        name, 
        email, 
        password: hashedPassword, 
        role: role as any 
    },
  })

  // 👇 2. LOG DE CRIAÇÃO
  await logAdminAction("CRIOU", "Usuário", `Nome: ${name} | Cargo: ${role}`);

  revalidatePath("/admin/users")
  return { success: "Criado com sucesso!" }
}

// 2. ATUALIZAR USUÁRIO
export async function updateUser(formData: FormData) {
  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  
  const roleRaw = formData.get("role") as string
  const role = (roleRaw === "ADMIN" || roleRaw === "USER") ? roleRaw : "USER"

  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  const session = await auth()
  if (!session || session.user.role !== "ADMIN") return { error: "Não autorizado" }

  const dataToUpdate: any = { name, email, role: role as any }

  if (password && password.trim() !== "") {
      if (password !== confirmPassword) return { error: "As senhas não conferem!" }
      dataToUpdate.password = await hash(password, 10)
  }

  try {
      await prisma.user.update({ where: { id }, data: dataToUpdate })
      
      // 👇 3. LOG DE EDIÇÃO
      await logAdminAction("EDITOU", "Usuário", `Nome: ${name}`);

      revalidatePath("/admin/users")
      return { success: "Atualizado!" }
  } catch (error) {
      return { error: "Erro ao atualizar." }
  }
}

// 3. EXCLUIR USUÁRIO
export async function deleteUser(formData: FormData) {
  const userId = formData.get("id") as string
  const session = await auth()
  
  if (!session || session.user.role !== "ADMIN") return 
  if (session.user.id === userId) return 

  try {
    // Busca o nome antes de excluir para o log ficar bonito
    const alvo = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } })

    await prisma.user.delete({ where: { id: userId } })

    // 👇 4. LOG DE EXCLUSÃO
    await logAdminAction("EXCLUIU", "Usuário", `Nome: ${alvo?.name || alvo?.email || userId}`);

    revalidatePath("/admin/users")
  } catch (error) {
    console.error("Erro ao excluir:", error)
  }
}