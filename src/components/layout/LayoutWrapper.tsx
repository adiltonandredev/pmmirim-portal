"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";

interface SiteInfo {
  logo: string | null;
  phone: string;
  email: string;
  address: string;
}

export default function LayoutWrapper({
  children,
  siteInfo,
  footer,
}: {
  children: React.ReactNode;
  siteInfo: SiteInfo;
  footer: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const isAdminPage = pathname?.startsWith("/admin");
  const isLoginPage = pathname?.startsWith("/login");
  const shouldHideInterface = isAdminPage || isLoginPage;

  return (
    <>
      {/* CORREÇÃO FINAL: Usamos 'logoUrl' porque é assim que seu Navbar.tsx está escrito */}
      {!shouldHideInterface && <Navbar logoUrl={siteInfo.logo} />}
      
      {children}
      
      {!shouldHideInterface && footer}
    </>
  );
}