"use client";

import { useState } from "react";
import { Menu, X, Bell } from "lucide-react";
import { Sidebar } from "./Sidebar";
import Image from "next/image";

interface CurrentUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
}

interface AdminLayoutWrapperProps {
  children: React.ReactNode;
  logo?: string | null;
  role?: string;
  currentUser?: CurrentUser;
}

function roleLabel(role?: string | null) {
  if (role === "ADMIN") return "Administrador";
  if (role === "EDITOR") return "Editor";
  if (role === "VIEWER") return "Visualizador";
  return role ?? "";
}

function UserBadge({ user }: { user: CurrentUser }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-right hidden sm:block">
        <p className="text-sm font-bold text-slate-800 leading-tight">{user.name || "Usuário"}</p>
        <p className="text-xs text-slate-400 leading-tight">{roleLabel(user.role)}</p>
      </div>
      <div className="w-9 h-9 rounded-full bg-blue-100 border-2 border-blue-200 overflow-hidden relative flex items-center justify-center shrink-0">
        {user.image
          ? <Image src={user.image} alt={user.name || "Avatar"} fill className="object-cover" sizes="36px" />
          : <span className="text-blue-700 font-black text-sm">{(user.name || "U")[0].toUpperCase()}</span>
        }
      </div>
    </div>
  );
}

export default function AdminLayoutWrapper({ children, logo, role, currentUser }: AdminLayoutWrapperProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {/* Sidebar */}
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
          <Sidebar onNavigate={closeSidebar} logo={logo} role={role} currentUser={currentUser} />
        </div>
      </aside>

      {/* Overlay mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={closeSidebar}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar — desktop */}
        <header className="hidden md:flex bg-white border-b border-slate-200 px-8 py-3 items-center justify-between shadow-sm z-30 shrink-0">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <span className="font-medium text-slate-500">Painel Administrativo</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-400">Polícia Militar Mirim de Presidente Médici</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors relative">
              <Bell size={18} />
            </button>
            {currentUser && <UserBadge user={currentUser} />}
          </div>
        </header>

        {/* Topbar — mobile */}
        <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm z-30 shrink-0">
          <div className="flex items-center gap-3">
            {logo ? (
              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-slate-200 shadow-sm">
                <Image src={logo} alt="Logo" fill className="object-cover" sizes="36px" />
              </div>
            ) : null}
            <div>
              <h1 className="text-slate-900 font-black text-sm uppercase leading-none">Polícia Mirim</h1>
              <p className="text-yellow-600 font-bold text-[10px] tracking-wide uppercase mt-0.5">Pres. Médici - RO</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {currentUser && <UserBadge user={currentUser} />}
            <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-md active:bg-slate-200">
              <Menu size={24} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
}
