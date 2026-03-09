"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { hash } from "bcryptjs"
import { logAdminAction } from "@/lib/audit"
import { saveFile } from "@/lib/file-upload"
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

// Helper para deletar arquivos
async function tryDeleteFile(path: string) {
    try {
        const fullPath = join(process.cwd(), "public", path)
        if (existsSync(fullPath)) await unlink(fullPath)
    } catch (e) {
        console.error("Erro ao deletar arquivo físico:", e)
    }
}

// ==========================================
// FUNÇÕES PARA O ALUNO REGULAR
// ==========================================

export async function createStudent(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const matricula = formData.get("matricula") as string
    const password = formData.get("password") as string
    
    const schoolName = formData.get("schoolName") as string
    const schoolGrade = formData.get("schoolGrade") as string 
    const shift = formData.get("shift") as string 

    const cpf = formData.get("cpf") as string
    const phone = formData.get("phone") as string
    const birthDateStr = formData.get("birthDate") as string
    
    if (!name || !matricula || !password) {
        return { success: false, message: "Nome, Matrícula e Senha são obrigatórios." }
    }

    const existing = await prisma.student.findUnique({ where: { matricula } })
    if (existing) {
        return { success: false, message: "Esta matrícula já está em uso por outro aluno." }
    }

    const file = formData.get("photo") as File
    let photoUrl = null;
    if (file && file.size > 0) {
        photoUrl = await saveFile(file, "students")
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
    return { success: true, message: "Aluno cadastrado com sucesso!" }

  } catch (error) {
    console.error("Erro ao criar aluno:", error)
    return { success: false, message: "Erro interno ao cadastrar aluno." }
  }
}

export async function updateStudent(formData: FormData) {
  try {
    const id = formData.get("id") as string
    if (!id) return { success: false, message: "ID do aluno não encontrado." }

    const name = formData.get("name") as string
    const matricula = formData.get("matricula") as string
    const password = formData.get("password") as string 
    
    const schoolName = formData.get("schoolName") as string
    const schoolGrade = formData.get("schoolGrade") as string
    const shift = formData.get("shift") as string

    const cpf = formData.get("cpf") as string
    const phone = formData.get("phone") as string
    const birthDateStr = formData.get("birthDate") as string

    const file = formData.get("photo") as File
    let photoUrl = formData.get("existingPhotoUrl") as string
    if (file && file.size > 0) {
        const uploadedPath = await saveFile(file, "students")
        if (uploadedPath) photoUrl = uploadedPath
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

    if (password && password.trim() !== "") {
        data.password = await hash(password, 10)
    }

    await prisma.student.update({
        where: { id },
        data
    })

    await logAdminAction("EDITOU", "Aluno", `Nome: ${name}`)

    revalidatePath("/admin/students")
    return { success: true, message: "Dados do aluno atualizados com sucesso!" }

  } catch (error) {
    console.error("Erro ao editar aluno:", error)
    return { success: false, message: "Erro ao atualizar os dados do aluno." }
  }
}

export async function deleteStudent(formData: FormData) {
  try {
    const id = formData.get("id") as string
    if (!id) return { success: false, message: "ID inválido." }
    
    const student = await prisma.student.findUnique({ where: { id } })
    
    // Apaga a foto do HD
    if (student?.photoUrl) {
        await tryDeleteFile(student.photoUrl)
    }

    await prisma.student.delete({ where: { id } })
    
    await logAdminAction("EXCLUIU", "Aluno", `Nome: ${student?.name || id}`)
    
    revalidatePath("/admin/students")
    return { success: true, message: "Aluno excluído com sucesso!" }

  } catch (error) {
    console.error("Erro ao excluir aluno:", error)
    return { success: false, message: "Erro ao excluir o aluno." }
  }
}

// ==========================================
// FUNÇÕES PARA O ALUNO DESTAQUE (FEATURED)
// ==========================================

export async function createFeaturedStudent(formData: FormData) {
  try {
    const studentName = formData.get("studentName") as string;
    const studentClass = formData.get("class") as string; 
    const achievement = formData.get("achievement") as string;
    const description = formData.get("description") as string;
    const month = parseInt(formData.get("month") as string, 10);
    const year = parseInt(formData.get("year") as string, 10);
    const active = formData.get("active") === "on";

    if (!studentName || !achievement) {
        return { success: false, message: "Nome e Conquista são obrigatórios." }
    }

    const file = formData.get("photoUrl") as File;
    let photoUrl = null;
    if (file && file.size > 0) {
        photoUrl = await saveFile(file, "featured-students");
    }

    await prisma.featuredStudent.create({
      data: {
        studentName,
        class: studentClass,
        achievement,
        description,
        month,
        year,
        active,
        photoUrl
      }
    });

    await logAdminAction("CRIOU", "Aluno Destaque", `Nome: ${studentName}`);

    revalidatePath("/admin/featured-student");
    revalidatePath("/"); // Para atualizar a home
    return { success: true, message: "Aluno destaque adicionado com sucesso!" };

  } catch (error) {
    console.error("Erro ao criar aluno destaque:", error);
    return { success: false, message: "Erro interno ao cadastrar destaque." };
  }
}

export async function updateFeaturedStudent(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    if (!id) return { success: false, message: "ID não encontrado." }

    const studentName = formData.get("studentName") as string;
    const studentClass = formData.get("class") as string;
    const achievement = formData.get("achievement") as string;
    const description = formData.get("description") as string;
    const month = parseInt(formData.get("month") as string, 10);
    const year = parseInt(formData.get("year") as string, 10);
    const active = formData.get("active") === "on";

    const file = formData.get("photoUrl") as File;
    let photoUrl = formData.get("existingPhotoUrl") as string;
    if (file && file.size > 0) {
        const uploadedPath = await saveFile(file, "featured-students");
        if (uploadedPath) photoUrl = uploadedPath;
    }

    await prisma.featuredStudent.update({
      where: { id },
      data: {
        studentName,
        class: studentClass,
        achievement,
        description,
        month,
        year,
        active,
        photoUrl
      }
    });

    await logAdminAction("EDITOU", "Aluno Destaque", `Nome: ${studentName}`);

    revalidatePath("/admin/featured-student");
    revalidatePath("/"); // Atualiza home
    return { success: true, message: "Aluno destaque atualizado!" };

  } catch (error) {
    console.error("Erro ao editar destaque:", error);
    return { success: false, message: "Erro ao atualizar dados do destaque." };
  }
}

export async function deleteFeaturedStudent(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    if (!id) return { success: false, message: "ID inválido." }

    const student = await prisma.featuredStudent.findUnique({ where: { id } });
    
    // Apaga a foto do HD
    if (student?.photoUrl) {
        await tryDeleteFile(student.photoUrl)
    }

    await prisma.featuredStudent.delete({ where: { id } });
    
    await logAdminAction("EXCLUIU", "Aluno Destaque", `Nome: ${student?.studentName || id}`);
    
    revalidatePath("/admin/featured-student");
    revalidatePath("/"); 
    
    return { success: true, message: "Destaque excluído com sucesso!" };
  } catch (error) {
    console.error("Erro ao deletar aluno destaque:", error);
    return { success: false, message: "Erro ao excluir destaque." }
  }
}