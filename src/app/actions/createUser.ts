"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { hash } from "bcryptjs"
import { revalidatePath } from "next/cache"
import { createUserSchema } from "@/lib/validations"

export async function createUser(formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Acesso negado." }
  }

  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    role: formData.get("role") as "ADMIN" | "EDITOR"
  }

  const validation = createUserSchema.safeParse(data)
  if (!validation.success) {
    return { error: validation.error.issues[0].message }
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: data.email }
  })

  if (existingUser) {
    return { error: "Este e-mail já está cadastrado." }
  }

  try {
    const hashedPassword = await hash(data.password, 10)

    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
      },
    })

    revalidatePath("/admin")
    return { success: "Usuário criado com sucesso!" }

  } catch (error) {
    console.error(error)
    return { error: "Erro ao criar usuário." }
  }
}