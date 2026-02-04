import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs"; // Se der erro vermelho aqui, mude para "bcrypt"
import { redirect } from "next/navigation";

export default function RescuePage() {
  
  // Esta função roda EXCLUSIVAMENTE no servidor da Vercel
  async function forcePasswordReset() {
    "use server";
    
    const emailAlvo = "SEU_EMAIL_AQUI@GMAIL.COM"; // <--- ⚠️ COLOQUE SEU E-MAIL EXATO AQUI
    const novaSenha = "123456";

    console.log("Iniciando reset de senha...");
    
    // 1. Criptografa a senha "123456"
    const senhaCriptografada = await hash(novaSenha, 10);

    // 2. Força a atualização no Banco de Dados Oficial
    await prisma.user.update({
      where: { email: emailAlvo },
      data: { password: senhaCriptografada },
    });

    // 3. Redireciona para o login
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-red-900 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">🚨 PÁGINA DE EMERGÊNCIA</h1>
        <p className="mb-6 text-gray-700">
          Ao clicar no botão abaixo, a senha do usuário definida no código será alterada forçadamente para: <strong>123456</strong>
        </p>
        
        <form action={forcePasswordReset}>
          <button 
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded transition-all"
          >
            RESETAR SENHA AGORA
          </button>
        </form>
      </div>
    </div>
  );
}