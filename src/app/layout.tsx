import "./globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { CookieConsent } from "@/components/layout/CookieConsent";

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Polícia Militar Mirim - Presidente Médici",
    template: "%s | Polícia Militar Mirim",
  },
  description: "Portal Oficial da Polícia Militar Mirim de Presidente Médici - RO",
  openGraph: {
    siteName: "Polícia Militar Mirim - Presidente Médici",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className={`${font.className} flex flex-col min-h-screen`}>
        
        {/* Aqui entra o site público OU o painel admin */}
        {children}
        
        <Toaster richColors position="top-right" expand={true} closeButton />
        <CookieConsent /> 
      </body>
    </html>
  );
}