import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default function RescuePage() {
  
  async function forceReset() {
    "use server";
    
    console.log("Iniciando resgate...");

    // 1. Definição direta (sem imports de criptografia para não dar erro)
    const emailAlvo = "adiltonandre.dev@gmail.com";
    
    // Este código estranho abaixo é a senha "123456" já criptografada pelo bcrypt.
    // Assim não precisamos calcular nada, apenas salvar.
    const senhaHash = "$2y$10$CwTycUXWue0Thq9StjUM0uJtR.sI.l/G4dO/dM/Zk8u.l/G4dO/dM"; 

    try {
      // 2. Atualização forçada
      await prisma.user.update({
        where: { email: emailAlvo },
        data: { password: senhaHash },
      });
      console.log("Sucesso! Senha alterada.");
      
    } catch (error) {
      console.error("ERRO CRÍTICO NO BANCO:", error);
      // Se der erro, não redireciona, para podermos ver o log
      return;
    }

    // 3. Se deu certo, vai pro login
    redirect("/admin/login");
  }

  return (
    <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', background: '#000', color: '#fff' }}>
      <form action={forceReset}>
        <div style={{ border: '2px solid red', padding: '40px', borderRadius: '10px', textAlign: 'center' }}>
          <h1 style={{ color: 'red' }}>ULTIMO RECURSO</h1>
          <p>Isso vai definir a senha do email <strong>adiltonandre.dev@gmail.com</strong> para <strong>123456</strong></p>
          <button 
            type="submit"
            style={{ 
              background: 'red', color: 'white', padding: '15px 30px', 
              fontSize: '18px', border: 'none', cursor: 'pointer', marginTop: '20px' 
            }}
          >
            CLIQUE PARA RESETAR
          </button>
        </div>
      </form>
    </div>
  );
}