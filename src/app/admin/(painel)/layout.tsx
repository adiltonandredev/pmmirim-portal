import type { Metadata } from "next";
import AdminLayoutWrapper from "@/components/admin/shared/AdminLayoutWrapper";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma"; 
import { AutoLogout } from "@/components/admin/shared/AutoLogout"; 

export const metadata: Metadata = {
  title: "Painel Administrativo",
  description: "Gestão do Portal",
};

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  // Busca a logo no banco
  const settings = await prisma.siteSettings.findFirst();

  return (
    // 👇 MUDANÇA AQUI: Passamos o 'role' (cargo) da sessão para o Wrapper
    // O (session?.user as any)?.role evita erros de TypeScript se a tipagem não estiver 100%
    <AdminLayoutWrapper 
        logo={settings?.logoUrl} 
        role={(session?.user as any)?.role} 
    >
      <AutoLogout /> 
      
      {children}
    </AdminLayoutWrapper>
  );
}