import { auth } from "@/auth"; 
import { prisma } from "@/lib/prisma";

export async function logAdminAction(action: string, resource: string, details?: string) {
  try {
    // 1. Descobre quem está logado
    const session = await auth();
    
    // Se não tiver ninguém logado (erro), ignora
    if (!session?.user?.email) return;

    // 2. Busca o ID do usuário no banco
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    // 3. Grava o log
    if (user) {
      await prisma.auditLog.create({
        data: {
          action,   // Ex: "CRIOU"
          resource, // Ex: "Notícia"
          details,  // Ex: "Título: Formatura"
          userId: user.id,
        },
      });
    }
  } catch (error) {
    console.error("Erro silencioso na auditoria:", error);
    // Não paramos o site se o log falhar
  }
}