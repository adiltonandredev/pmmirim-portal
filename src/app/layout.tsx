import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner"; 
import { CookieConsent } from "@/components/layout/CookieConsent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Polícia Militar Mirim - Presidente Médici",
  description: "Portal Oficial da Polícia Militar Mirim de Presidente Médici - RO",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        
        {/* Aqui entra o site público OU o painel admin */}
        {children}
        
        <Toaster richColors position="top-right" expand={true} closeButton />
        <CookieConsent /> 
      </body>
    </html>
  );
}