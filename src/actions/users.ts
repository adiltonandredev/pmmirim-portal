"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { hash } from "bcryptjs"
import { logAdminAction } from "@/lib/audit"

// --- 1. CRIAR USUÁRIO ---
export async function createUser(formData: FormData) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
        return { success: false, message: "Acesso negado. Apenas administradores podem criar usuários." }
    }

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    
    const roleRaw = formData.get("role") as string
    const role = (roleRaw === "ADMIN" || roleRaw === "USER") ? roleRaw : "USER"

    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (!name || !email || !password) {
        return { success: false, message: "Nome, e-mail e senha são obrigatórios." }
    }

    if (password !== confirmPassword) {
        return { success: false, message: "A confirmação de senha não confere." }
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
        return { success: false, message: "Este e-mail já está cadastrado." }
    }

    const hashedPassword = await hash(password, 10)

    await prisma.user.create({
      data: { 
          name, 
          email, 
          password: hashedPassword, 
          role: role as any 
      },
    })

    // Log de Criação
    await logAdminAction("CRIOU", "Usuário do Sistema", `Nome: ${name} | Cargo: ${role}`);

    revalidatePath("/admin/users")
    return { success: true, message: "Usuário criado com sucesso!" }

  } catch (error) {
    console.error("Erro ao criar usuário:", error)
    return { success: false, message: "Erro interno ao criar usuário." }
  }
}

// --- 2. ATUALIZAR USUÁRIO ---
export async function updateUser(formData: FormData) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
        return { success: false, message: "Acesso negado. Apenas administradores podem editar usuários." }
    }

    const id = formData.get("id") as string
    if (!id) return { success: false, message: "ID do usuário não encontrado." }

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    
    const roleRaw = formData.get("role") as string
    const role = (roleRaw === "ADMIN" || roleRaw === "USER") ? roleRaw : "USER"

    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    const dataToUpdate: any = { name, email, role: role as any }

    if (password && password.trim() !== "") {
        if (password !== confirmPassword) {
            return { success: false, message: "As senhas digitadas não conferem." }
        }
        dataToUpdate.password = await hash(password, 10)
    }

    await prisma.user.update({ where: { id }, data: dataToUpdate })
    
    // Log de Edição
    await logAdminAction("EDITOU", "Usuário do Sistema", `Nome: ${name}`);

    revalidatePath("/admin/users")
    return { success: true, message: "Usuário atualizado com sucesso!" }

  } catch (error) {
    console.error("Erro ao atualizar usuário:", error)
    return { success: false, message: "Erro interno ao atualizar os dados." }
  }
}

// --- 3. EXCLUIR USUÁRIO ---
export async function deleteUser(formData: FormData) {
  try {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
        return { success: false, message: "Acesso negado." }
    }

    const userId = formData.get("id") as string
    if (!userId) {
        return { success: false, message: "ID do usuário inválido." }
    }

    // Trava de segurança maravilhosa!
    if (session.user.id === userId) {
        return { success: false, message: "Você não pode excluir sua própria conta." }
    }

    // Busca o nome antes de excluir para o log ficar bonito
    const alvo = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } })

    await prisma.user.delete({ where: { id: userId } })

    // Log de Exclusão
    await logAdminAction("EXCLUIU", "Usuário do Sistema", `Nome: ${alvo?.name || alvo?.email || userId}`);

    revalidatePath("/admin/users")
    return { success: true, message: "Usuário excluído com sucesso!" }

  } catch (error) {
    console.error("Erro ao excluir usuário:", error)
    return { success: false, message: "Erro ao excluir o usuário." }
  }
}