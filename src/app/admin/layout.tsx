import type { Metadata } from "next";
import AdminLayoutWrapper from "@/components/admin/AdminLayoutWrapper";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma"; 
import { AutoLogout } from "@/components/admin/AutoLogout"; // <--- Importação (Já estava aqui)

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

  // Busca a logo
  const settings = await prisma.siteSettings.findFirst();

  return (
    <AdminLayoutWrapper logo={settings?.logoUrl}>
      {/* --- ADICIONE ESTA LINHA AQUI --- */}
      <AutoLogout /> 
      
      {children}
    </AdminLayoutWrapper>
  );
}