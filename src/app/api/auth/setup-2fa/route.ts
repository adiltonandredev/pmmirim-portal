import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { generateTOTPSecret, generateTOTPUri } from "@/lib/totp"
import { NextResponse } from "next/server"
import QRCode from "qrcode"

export async function POST() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })

  if (user.twoFactorEnabled) {
    return NextResponse.json({ error: "2FA já está ativado" }, { status: 400 })
  }

  const secret = generateTOTPSecret()
  const uri = generateTOTPUri(secret, user.email)
  const qrDataUrl = await QRCode.toDataURL(uri, { width: 256, margin: 2 })

  await prisma.user.update({
    where: { id: user.id },
    data: { twoFactorSecret: secret },
  })

  return NextResponse.json({ qrDataUrl, secret })
}
