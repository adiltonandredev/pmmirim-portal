import type { Metadata } from "next";
import AdminLayoutWrapper from "@/components/admin/AdminLayoutWrapper";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma"; // <--- 1. Importar o Prisma

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

  // 2. BUSCAR A LOGO NO BANCO DE DADOS
  const settings = await prisma.siteSettings.findFirst();

  return (
    // 3. ENVIAR A LOGO PARA O WRAPPER
    <AdminLayoutWrapper logo={settings?.logoUrl}>
      {children}
    </AdminLayoutWrapper>
  );
}