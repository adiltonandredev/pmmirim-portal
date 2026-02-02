"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./Sidebar"; 
import Image from "next/image"; // <--- Importante: Adicione este import

interface AdminLayoutWrapperProps {
  children: React.ReactNode;
  logo?: string | null;
}

export default function AdminLayoutWrapper({ children, logo }: AdminLayoutWrapperProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* SIDEBAR / GAVETA (Menu Lateral) */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transition-transform duration-300 ease-in-out shadow-2xl
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:relative md:translate-x-0 
        `}
      >
        {/* Botão fechar (visível apenas no mobile dentro do menu) */}
        <div className="md:hidden absolute top-4 right-4 z-50">
            <button onClick={closeSidebar} className="text-white/70 hover:text-white p-1">
                <X size={24} />
            </button>
        </div>

        <div className="h-full">
             <Sidebar onNavigate={closeSidebar} logo={logo} /> 
        </div>
      </aside>

      {/* OVERLAY ESCURO */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* ÁREA PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* --- HEADER MOBILE (Barra Superior) --- */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between shadow-sm z-30 shrink-0 min-h-[70px]">
           
           {logo ? (
             // OPÇÃO 1: COM LOGO (Estilo Institucional Horizontal)
             <div className="flex items-center gap-3">
                {/* Logo Pequena */}
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 shadow-sm">
                    <Image 
                      src={logo} 
                      alt="Logo" 
                      fill 
                      className="object-cover" 
                      sizes="40px"
                    />
                </div>
                {/* Texto (Ajustado para Mobile) */}
                <div className="flex flex-col">
                    <h1 className="text-slate-900 font-black text-sm uppercase leading-none">
                      Polícia Mirim
                    </h1>
                    <p className="text-yellow-600 font-bold text-[10px] tracking-wide uppercase mt-0.5">
                      Pres. Médici - RO
                    </p>
                </div>
             </div>
           ) : (
             // OPÇÃO 2: SEM LOGO (Genérico)
             <span className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">ADMIN</span> 
                Painel
             </span>
           )}

           {/* Botão de Abrir Menu */}
           <button 
             onClick={() => setSidebarOpen(true)} 
             className="p-2 text-slate-600 hover:bg-slate-100 rounded-md active:bg-slate-200"
             aria-label="Abrir menu"
           >
             <Menu size={24} />
           </button>
        </header>

        {/* CONTEÚDO DA PÁGINA */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
           {children}
        </main>
      </div>
    </div>
  );
}