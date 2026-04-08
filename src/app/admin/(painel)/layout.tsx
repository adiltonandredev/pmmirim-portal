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
  if (!session) redirect("/admin/login");

  const sessionUserId = (session?.user as any)?.id;

  const [settings, currentUser] = await Promise.all([
    prisma.siteSettings.findFirst({ orderBy: { updatedAt: "desc" } }),
    sessionUserId
      ? prisma.user.findUnique({
          where: { id: sessionUserId },
          select: { id: true, name: true, email: true, image: true, role: true },
        })
      : null,
  ]);

  return (
    <AdminLayoutWrapper
      logo={settings?.logoUrl}
      role={currentUser?.role ?? (session?.user as any)?.role}
      currentUser={currentUser ?? undefined}
    >
      <AutoLogout />
      {children}
    </AdminLayoutWrapper>
  );
}