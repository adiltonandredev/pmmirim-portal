"use server"
import { parseError } from "@/lib/errors"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

const revalidateAll = () => {
  revalidatePath("/admin/institution/team/categories")
  revalidatePath("/admin/institution/team")
  revalidatePath("/")
  revalidatePath("/instituicao")
}

export async function createMemberCategory(formData: FormData) {
  const name = (formData.get("name") as string)?.trim()
  if (!name) return { success: false, message: "Nome da categoria é obrigatório." }
  const slug = slugify(name)
  const order = parseInt(formData.get("order") as string || "0")
  try {
    await prisma.memberCategory.create({ data: { name, slug, order } })
    revalidateAll()
    return { success: true, message: "Categoria criada com sucesso!" }
  } catch {
    return { success: false, message: "Esta categoria já existe ou houve um erro ao salvar." }
  }
}

export async function updateMemberCategory(formData: FormData) {
  const id = formData.get("id") as string
  const name = (formData.get("name") as string)?.trim()
  if (!id || !name) return { success: false, message: "Dados inválidos." }
  const slug = slugify(name)
  const order = parseInt(formData.get("order") as string || "0")
  try {
    await prisma.memberCategory.update({ where: { id }, data: { name, slug, order } })
    revalidateAll()
    return { success: true, message: "Categoria atualizada com sucesso!" }
  } catch {
    return { success: false, message: "Erro ao atualizar a categoria." }
  }
}

export async function deleteMemberCategory(id: string) {
  try {
    await prisma.memberCategory.delete({ where: { id } })
    revalidateAll()
    return { success: true, message: "Categoria excluída com sucesso." }
  } catch {
    return { success: false, message: "Não é possível excluir esta categoria." }
  }
}
