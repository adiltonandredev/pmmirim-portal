"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { hash } from "bcryptjs"
import { revalidatePath } from "next/cache"
import { createUserSchema } from "@/lib/validations"
import { logAdminAction } from "@/lib/audit" // <--- O Espião

export async function createUser(formData: FormData) {
  try {
    const session = await auth()
    
    // 1. Verificação de Segurança (Apenas ADMIN pode criar usuários)
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, message: "Acesso negado. Apenas administradores podem criar novos usuários." }
    }

    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      role: formData.get("role") as "ADMIN" | "EDITOR"
    }

    // 2. Validação dos Dados
    const validation = createUserSchema.safeParse(data)
    if (!validation.success) {
      return { success: false, message: validation.error.issues[0]?.message || "Erro de validação nos campos." }
    }

    // 3. Verificação de E-mail Duplicado
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (existingUser) {
      return { success: false, message: "Este e-mail já está cadastrado no sistema." }
    }

    // 4. Encriptar a Senha e Criar no Banco
    const hashedPassword = await hash(data.password, 10)

    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
      },
    })

    // 5. Log de Auditoria
    await logAdminAction("CRIOU", "Usuário do Sistema", `Nome: ${data.name} (${data.role})`);

    // 6. Atualização da Tela
    revalidatePath("/admin/usuarios") // Se sua página de lista de usuários for essa
    revalidatePath("/admin")
    
    return { success: true, message: "Usuário criado com sucesso!" }

  } catch (error) {
    console.error("Erro ao criar usuário do sistema:", error)
    return { success: false, message: "Erro interno ao criar o usuário." }
  }
}