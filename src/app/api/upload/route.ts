"use server"

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { uploadImage } from "@/lib/upload"

export async function POST(request: NextRequest) {
  const session = await auth()
  
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json({ error: "Arquivo não fornecido" }, { status: 400 })
    }

    const imageUrl = await uploadImage(file)
    
    if (!imageUrl) {
      return NextResponse.json({ error: "Erro ao fazer upload" }, { status: 500 })
    }

    return NextResponse.json({ url: imageUrl })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro ao fazer upload" }, { status: 500 })
  }
}
