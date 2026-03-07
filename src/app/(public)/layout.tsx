import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { getSiteSettings } from "@/lib/settings";
import { Footer } from "@/components/layout/Footer"; 
import { prisma } from "@/lib/prisma"; 

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Busca configurações gerais
  const settings = await getSiteSettings();

  // Pega a Missão no banco de dados
  const institution = await prisma.institutionHistory.findFirst();
  
  const siteInfo = {
    logo: settings?.logoUrl || null, 
    phone: settings?.contactPhone || "(69) 3471-0000",
    email: settings?.contactEmail || "contato@pmmirim.medici.br",
    address: settings?.address || "Rua Paraná, s/n - Presidente Médici - RO",
    openingHours: settings?.businessHours || "Seg. a Sexta: 07:30 às 11:30\n13:30 às 17:30",
    missionText: institution?.mission, 
  };

  return (
    <LayoutWrapper 
        siteInfo={siteInfo}
        footer={<Footer siteInfo={siteInfo} />} 
    >
        {children}
    </LayoutWrapper>
  );
}