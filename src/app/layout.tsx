import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { getSiteSettings } from "@/lib/settings";
import { Toaster } from "sonner"; 
import { Footer } from "@/components/layout/Footer"; 
import { CookieConsent } from "@/components/layout/CookieConsent";
import { prisma } from "@/lib/prisma"; // <--- 1. IMPORTANTE: Importar o Prisma

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Polícia Militar Mirim - Presidente Médici",
  description: "Portal Oficial da Polícia Militar Mirim de Presidente Médici - RO",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Busca configurações gerais
  const settings = await getSiteSettings();

  // 2. NOVA BUSCA: Pega a Missão no banco de dados
  const institution = await prisma.institutionHistory.findFirst();
  
  const siteInfo = {
    logo: settings?.logoUrl || null, 
    phone: settings?.contactPhone || "(69) 3471-0000",
    email: settings?.contactEmail || "contato@pmmirim.medici.br",
    address: settings?.address || "Rua Paraná, s/n - Presidente Médici - RO",
    openingHours: settings?.businessHours || "Seg. a Sexta: 07:30 às 11:30\n13:30 às 17:30",
    
    // 3. ADICIONADO: Passa o texto da missão para o Footer
    missionText: institution?.mission, 
  };

  return (
    <html lang="pt-br">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <LayoutWrapper 
            siteInfo={siteInfo}
            footer={<Footer siteInfo={siteInfo} />} 
        >
            {children}
        </LayoutWrapper>
        
        <Toaster richColors position="top-right" expand={true} closeButton />
        
        <CookieConsent /> 
        
      </body>
    </html>
  );
}