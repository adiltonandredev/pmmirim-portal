"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./Sidebar"; 
import Image from "next/image";

interface AdminLayoutWrapperProps {
  children: React.ReactNode;
  logo?: string | null;
  // 👇 1. ADICIONE ISSO: Aceitar o cargo do usuário
  role?: string; 
}

// 👇 2. ADICIONE O 'role' AQUI TAMBÉM
export default function AdminLayoutWrapper({ children, logo, role }: AdminLayoutWrapperProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transition-transform duration-300 ease-in-out shadow-2xl
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:relative md:translate-x-0 
        `}
      >
        <div className="md:hidden absolute top-4 right-4 z-50">
            <button onClick={closeSidebar} className="text-white/70 hover:text-white p-1">
                <X size={24} />
            </button>
        </div>

        <div className="h-full">
             {/* 👇 3. PASSE O ROLE PARA O SIDEBAR AQUI 👇 */}
             <Sidebar onNavigate={closeSidebar} logo={logo} role={role} /> 
        </div>
      </aside>

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={closeSidebar}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between shadow-sm z-30 shrink-0 min-h-[70px]">
           {logo ? (
             <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 shadow-sm">
                    <Image src={logo} alt="Logo" fill className="object-cover" sizes="40px" />
                </div>
                <div className="flex flex-col">
                    <h1 className="text-slate-900 font-black text-sm uppercase leading-none">Polícia Mirim</h1>
                    <p className="text-yellow-600 font-bold text-[10px] tracking-wide uppercase mt-0.5">Pres. Médici - RO</p>
                </div>
             </div>
           ) : (
             <span className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">ADMIN</span> 
                Painel
             </span>
           )}

           <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-md active:bg-slate-200">
             <Menu size={24} />
           </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
           {children}
        </main>
      </div>
    </div>
  );
}