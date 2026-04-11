import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/mail";
import { checkRateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "E-mail obrigatório" }, { status: 400 });
    }

    // Rate limiting: máximo 3 tentativas por e-mail a cada 15 minutos
    const rateLimit = checkRateLimit(`forgot-password:${email}`);
    if (!rateLimit.allowed) {
      const resetMinutes = Math.ceil((rateLimit.resetTime! - Date.now()) / 60000);
      return NextResponse.json(
        { error: `Muitas tentativas. Tente novamente em ${resetMinutes} minutos.` },
        { status: 429 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Resposta idêntica para e-mail existente ou não (evita enumeração de contas)
    if (!user) {
      return NextResponse.json({ message: "Processado" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

    await prisma.user.update({
      where: { email },
      data: { resetToken, resetTokenExpiry },
    });

    await sendPasswordResetEmail(email, resetToken);

    return NextResponse.json({ message: "Email enviado com sucesso!" });

  } catch (error: unknown) {
    console.error("Erro no forgot-password:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}