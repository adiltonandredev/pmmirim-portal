"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verifica no navegador se já existe o "aceite" gravado
    const consent = localStorage.getItem("pmm-cookie-consent");
    
    // Se NÃO tiver gravado, mostra o aviso após 1 segundo
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    // Grava no navegador que o usuário aceitou (para não mostrar de novo)
    localStorage.setItem("pmm-cookie-consent", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-slate-900/95 backdrop-blur-md border-t border-white/10 text-white z-[60] shadow-2xl animate-in slide-in-from-bottom-5 duration-500">
      <div className="container mx-auto px-4 py-4 md:py-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
          
          {/* Texto do Aviso */}
          <div className="flex-1 text-center md:text-left text-sm text-slate-300 leading-relaxed font-medium">
            <p>
              Coletamos dados para melhorar o desempenho e segurança do site, além de personalizar conteúdos. 
              Verifique mais informações em nossa{" "}
              <Link href="/privacidade" className="text-yellow-400 font-bold hover:underline underline-offset-4 transition-colors">
                Política de Privacidade
              </Link>.
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center gap-4 shrink-0">
            <button 
              onClick={handleAccept}
              className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-2.5 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg text-xs md:text-sm uppercase tracking-wider"
            >
              Concordar e Fechar
            </button>
            
            {/* Botão X discreto p/ fechar sem aceitar (opcional) */}
            <button 
               onClick={() => setIsVisible(false)}
               className="p-2 text-slate-500 hover:text-white transition-colors"
               aria-label="Fechar aviso"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}