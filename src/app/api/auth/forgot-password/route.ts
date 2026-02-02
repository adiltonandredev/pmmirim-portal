import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/mail";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    console.log(">>> 1. INICIANDO RESET DE SENHA");
    
    const body = await req.json();
    const { email } = body;
    console.log(">>> 2. E-mail recebido:", email);

    if (!email) {
        return NextResponse.json({ error: "E-mail obrigatório" }, { status: 400 });
    }

    // 1. Procura o usuário
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.log(">>> 3. Usuário não encontrado no banco.");
      // Retornamos sucesso fake por segurança
      return NextResponse.json({ message: "Processado" });
    }

    console.log(">>> 3. Usuário encontrado:", user.id);

    // 2. Gera Token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // + 1 hora

    // 3. Salva no Banco
    console.log(">>> 4. Salvando token...");
    await prisma.user.update({
      where: { email },
      data: { resetToken, resetTokenExpiry },
    });

    // 4. Envia o E-mail
    console.log(">>> 5. Enviando e-mail...");
    await sendPasswordResetEmail(email, resetToken);
    console.log(">>> 6. SUCESSO!");

    return NextResponse.json({ message: "Email enviado com sucesso!" });

  } catch (error: any) {
    console.error(">>> ERRO FATAL:", error);
    return NextResponse.json(
        { error: error.message || "Erro interno" }, 
        { status: 500 }
    );
  }
}