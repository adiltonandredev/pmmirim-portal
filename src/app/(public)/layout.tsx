import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { getSiteSettings } from "@/lib/settings";
import { Footer } from "@/components/layout/Footer"; 
import { prisma } from "@/lib/prisma"; 
import React from "react";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children
}: {
  children: React.ReactNode
}) {
  const [settings, institution, categories] = await Promise.all([
    getSiteSettings(),
    prisma.institutionHistory.findFirst(),
    prisma.memberCategory.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
  ])

  const siteInfo = {
    logo: settings?.logoUrl || null,
    phone: settings?.contactPhone || "(69) 3471-0000",
    email: settings?.contactEmail || "contato@pmmirim.medici.br",
    address: settings?.address || "Rua Paraná, s/n - Presidente Médici - RO",
    openingHours: settings?.businessHours || "Seg. a Sexta: 07:30 às 11:30\n13:30 às 17:30",
    missionText: institution?.mission,
  }

  return (
    <LayoutWrapper
      siteInfo={siteInfo}
      categories={categories}
      footer={<Footer siteInfo={siteInfo} />}
    >
      {children}
    </LayoutWrapper>
  )
}