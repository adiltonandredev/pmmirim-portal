import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs"; // <--- Agora vamos usar o gerador real
import { redirect } from "next/navigation";

export default function RescuePage() {
  
  async function forceReset() {
    "use server";
    
    // --- SEUS DADOS ---
    const emailAlvo = "adiltonandre.dev@gmail.com";
    const novaSenha = "123456";
    // ------------------

    console.log(`Iniciando resgate para ${emailAlvo}...`);

    try {
      // 1. Gera o hash MATEMATICAMENTE CORRETO
      // O número 10 é o "custo" padrão do bcrypt
      const senhaCriptografada = await hash(novaSenha, 10);
      
      console.log("Senha gerada com sucesso. Atualizando banco...");

      // 2. Atualiza (ou cria se não existir)
      // Usamos 'upsert' para garantir que o usuário exista
      await prisma.user.upsert({
        where: { email: emailAlvo },
        update: { password: senhaCriptografada },
        create: {
          email: emailAlvo,
          name: "Admin Resgatado",
          password: senhaCriptografada,
          role: "ADMIN" // Garante que você tenha permissão
        }
      });

      console.log("SUCESSO ABSOLUTO! Senha trocada.");
      
    } catch (error) {
      console.error("ERRO NO RESGATE:", error);
      // Se der erro, vamos lançar para aparecer na tela vermelha da Vercel
      throw error; 
    }

    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-blue-900 p-4 text-white">
      <div className="bg-white text-slate-900 p-8 rounded-lg shadow-xl text-center max-w-md">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">🔐 RESGATE FINAL</h1>
        <p className="mb-6 text-gray-600">
          Este script vai calcular uma nova criptografia válida para a senha <strong>123456</strong> e salvar no usuário <strong>{`adiltonandre.dev@gmail.com`}</strong>.
        </p>
        
        <form action={forceReset}>
          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded transition-all"
          >
            GERAR NOVA SENHA E SALVAR
          </button>
        </form>
      </div>
    </div>
  );
}