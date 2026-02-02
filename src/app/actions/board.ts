'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { saveFile } from "@/lib/file-upload"

// Criar novo membro
export async function createBoardMember(formData: FormData) {
  const name = formData.get("name") as string
  const position = formData.get("position") as string
  const bio = formData.get("bio") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  
  // SALVA NA PASTA "board"
  const file = formData.get("photo") as File
  let photoUrl = await saveFile(file, "board")
  
  // Se não fez upload, verifica se mandou URL manual (se houver essa opção)
  if (!photoUrl) {
      photoUrl = (formData.get("photoUrl") as string) || ""
  }

  const active = formData.get("active") === "on"
  const order = parseInt(formData.get("order") as string) || 0

  await prisma.boardMember.create({
    data: {
      name,
      position,
      bio,
      email,
      phone,
      photoUrl,
      active,
      order
    },
  })

  revalidatePath("/instituicao/diretoria")
  revalidatePath("/admin/diretoria")
  redirect("/admin/diretoria")
}

// Atualizar membro existente
export async function updateBoardMember(id: string, formData: FormData) {
  const name = formData.get("name") as string
  const position = formData.get("position") as string
  const bio = formData.get("bio") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  
  const file = formData.get("photo") as File
  let photoUrl = formData.get("existingPhotoUrl") as string

  if (file && file.size > 0) {
      photoUrl = await saveFile(file, "board")
  }

  const active = formData.get("active") === "on"
  const order = parseInt(formData.get("order") as string) || 0

  await prisma.boardMember.update({
    where: { id },
    data: {
      name,
      position,
      bio,
      email,
      phone,
      photoUrl,
      active,
      order
    },
  })

  revalidatePath("/instituicao/diretoria")
  revalidatePath("/admin/diretoria")
  redirect("/admin/diretoria")
}

export async function deleteBoardMember(id: string) {
  await prisma.boardMember.delete({ where: { id } })
  revalidatePath("/instituicao/diretoria")
  revalidatePath("/admin/diretoria")
}

export async function toggleBoardMemberActive(id: string, currentStatus: boolean) {
  await prisma.boardMember.update({
    where: { id },
    data: { active: !currentStatus },
  })
  revalidatePath("/instituicao/diretoria")
  revalidatePath("/admin/diretoria")
}