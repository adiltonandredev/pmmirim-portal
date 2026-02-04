"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { hash } from "bcryptjs"
import { logAdminAction } from "@/lib/audit"
import { saveFile } from "@/lib/file-upload"

// --- CRIAR ALUNO ---
export async function createStudent(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const matricula = formData.get("matricula") as string
    const password = formData.get("password") as string
    
    // Dados da Escola
    const schoolName = formData.get("schoolName") as string
    const schoolGrade = formData.get("schoolGrade") as string // Ex: 7º Ano
    const shift = formData.get("shift") as string // Matutino/Vespertino

    // Dados Pessoais
    const cpf = formData.get("cpf") as string
    const phone = formData.get("phone") as string
    const birthDateStr = formData.get("birthDate") as string
    
    // Foto (Opcional)
    const file = formData.get("photo") as File
    const photoUrl = await saveFile(file, "students")

    if (!name || !matricula || !password) {
        return { error: "Nome, Matrícula e Senha são obrigatórios." }
    }

    // Verifica se matrícula já existe
    const existing = await prisma.student.findUnique({ where: { matricula } })
    if (existing) {
        return { error: "Esta matrícula já está em uso." }
    }

    const hashedPassword = await hash(password, 10)

    await prisma.student.create({
      data: {
        name,
        matricula,
        password: hashedPassword,
        schoolName,
        schoolGrade,
        shift,
        cpf,
        phone,
        birthDate: birthDateStr ? new Date(birthDateStr) : null,
        photoUrl
      }
    })

    await logAdminAction("CRIOU", "Aluno", `Nome: ${name} | Matrícula: ${matricula}`)

    revalidatePath("/admin/students")
    return { success: true }

  } catch (error) {
    console.error("Erro ao criar aluno:", error)
    return { error: "Erro interno ao cadastrar aluno." }
  }
}

// --- ATUALIZAR ALUNO ---
export async function updateStudent(formData: FormData) {
  try {
    const id = formData.get("id") as string
    const name = formData.get("name") as string
    const matricula = formData.get("matricula") as string
    const password = formData.get("password") as string // Se vier vazio, não troca
    
    const schoolName = formData.get("schoolName") as string
    const schoolGrade = formData.get("schoolGrade") as string
    const shift = formData.get("shift") as string

    const cpf = formData.get("cpf") as string
    const phone = formData.get("phone") as string
    const birthDateStr = formData.get("birthDate") as string

    // Foto
    const file = formData.get("photo") as File
    let photoUrl = formData.get("existingPhotoUrl") as string
    if (file && file.size > 0) {
        photoUrl = await saveFile(file, "students")
    }

    const data: any = {
        name,
        matricula,
        schoolName,
        schoolGrade,
        shift,
        cpf,
        phone,
        birthDate: birthDateStr ? new Date(birthDateStr) : null,
        photoUrl
    }

    // Só atualiza senha se o admin digitou uma nova
    if (password && password.trim() !== "") {
        data.password = await hash(password, 10)
    }

    await prisma.student.update({
        where: { id },
        data
    })

    await logAdminAction("EDITOU", "Aluno", `Nome: ${name}`)

    revalidatePath("/admin/students")
    return { success: true }

  } catch (error) {
    console.error("Erro ao editar aluno:", error)
    return { error: "Erro ao atualizar dados." }
  }
}

// --- EXCLUIR ALUNO ---
export async function deleteStudent(formData: FormData) {
    const id = formData.get("id") as string
    
    try {
        const student = await prisma.student.findUnique({ where: { id } })
        await prisma.student.delete({ where: { id } })
        
        await logAdminAction("EXCLUIU", "Aluno", `Nome: ${student?.name || id}`)
        
        revalidatePath("/admin/students")
    } catch (error) {
        console.error(error)
    }
}