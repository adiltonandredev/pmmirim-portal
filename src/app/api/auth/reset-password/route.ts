import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/get-ip";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);

    const rateLimit = await checkRateLimit("reset-password", `ip:${ip}`);
    if (!rateLimit.allowed) {
      const resetMinutes = Math.ceil((rateLimit.resetTime! - Date.now()) / 60000);
      return NextResponse.json(
        { error: `Muitas tentativas. Tente novamente em ${resetMinutes} minutos.` },
        { status: 429, headers: { "Retry-After": String(resetMinutes * 60) } }
      );
    }

    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    if (typeof newPassword !== "string" || newPassword.length < 8) {
      return NextResponse.json({ error: "A senha deve ter no mínimo 8 caracteres" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Token inválido ou expirado" }, { status: 400 });
    }

    const hashedPassword = await hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({ message: "Senha redefinida com sucesso!" });
  } catch (error: unknown) {
    console.error("Erro ao redefinir senha:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
