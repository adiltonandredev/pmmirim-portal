"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";

interface SiteInfo {
  logo: string | null;
  phone: string;
  email: string;
  address: string;
}

interface NavCategory {
  name: string
  slug: string
}

export default function LayoutWrapper({
  children,
  siteInfo,
  categories = [],
  footer,
}: {
  children: React.ReactNode;
  siteInfo: SiteInfo;
  categories?: NavCategory[];
  footer: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAdminPage = pathname?.startsWith("/admin");
  const isLoginPage = pathname?.startsWith("/login");
  const shouldHideInterface = isAdminPage || isLoginPage;

  return (
    <>
      {!shouldHideInterface && <Navbar logoUrl={siteInfo.logo} categories={categories} />}
      {children}
      {!shouldHideInterface && footer}
    </>
  );
}
