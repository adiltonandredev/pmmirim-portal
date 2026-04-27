import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { verifyTOTP } from "@/lib/totp"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  const { code } = await req.json()
  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "Código obrigatório" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user?.twoFactorSecret) {
    return NextResponse.json({ error: "Configure o 2FA primeiro" }, { status: 400 })
  }

  if (!verifyTOTP(code.trim(), user.twoFactorSecret)) {
    return NextResponse.json({ error: "Código inválido. Tente novamente." }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { twoFactorEnabled: true },
  })

  return NextResponse.json({ message: "2FA ativado com sucesso!" })
}
