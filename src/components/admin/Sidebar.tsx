"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { LogoutButton } from "./LogoutButton"
import { 
  LayoutDashboard, FileText, Settings, ChevronDown, ChevronRight,
  Cake, Medal, Users, Home, CalendarDays, Image as ImageIcon,
  GraduationCap, Briefcase, ScrollText, Network
} from "lucide-react"

interface SidebarProps {
  onNavigate?: () => void;
  logo?: string | null;
}

export function Sidebar({ onNavigate, logo }: SidebarProps) {
  const pathname = usePathname()
  
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
    institucional: true, 
    conteudo: true,
    sistema: true 
  })

  const toggleMenu = (key: string) => {
    setOpenMenus(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const isDashboardActive = pathname === '/admin'

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-300 overflow-y-auto border-r border-slate-900">
      
      {/* --- ÁREA DA LOGO (Topo da Sidebar) --- */}
      {/* MUDANÇA AQUI: Adicionei 'hidden md:flex' para esconder no mobile */}
      <div className={`p-6 border-b border-slate-900 hidden md:flex flex-col items-center justify-center shrink-0 ${logo ? 'min-h-[160px]' : 'min-h-[90px]'}`}>
        
        {logo ? (
            // 1. DESKTOP: LOGO + TEXTO
            <div className="flex flex-col items-center gap-3 w-full animate-in fade-in zoom-in duration-500">
                
                {/* Imagem Redonda */}
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-slate-800 shadow-xl bg-slate-900 group hover:scale-105 transition-transform duration-300">
                    <Image 
                        src={logo} 
                        alt="Logo PMM" 
                        fill 
                        className="object-cover"
                        sizes="80px"
                        priority
                    />
                </div>

                {/* Texto */}
                <div className="text-center space-y-0.5">
                    <h1 className="text-white font-black text-base leading-none tracking-tight uppercase">
                        Polícia Mirim
                    </h1>
                    <p className="text-yellow-500 font-bold text-[10px] tracking-widest uppercase">
                        Presidente Médici - RO
                    </p>
                </div>
            </div>
        ) : (
            // 2. SEM LOGO (Padrão)
            <div className="flex items-center gap-3">
                <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
                    <Settings size={18} className="text-white" />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">Painel Admin</h2>
                    <p className="text-[10px] text-slate-500">Gestão Polícia Mirim</p>
                </div>
            </div>
        )}
      </div>
      
      {/* --- CABEÇALHO SÓ PARA MOBILE (Opcional) --- */}
      {/* Se quiser um título simples no menu mobile pra não ficar vazio: */}
      <div className="md:hidden p-4 border-b border-slate-900 flex items-center gap-2 text-slate-400">
         <span className="text-xs font-bold uppercase tracking-widest">Menu de Navegação</span>
      </div>

      <nav className="flex-1 p-4 space-y-4">
        
        {/* Dashboard */}
        <Link 
          href="/admin" 
          onClick={onNavigate} 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
            isDashboardActive ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-900 text-slate-400'
          }`}
        >
          <LayoutDashboard size={20} />
          <span>Visão Geral</span>
        </Link>

        {/* GRUPO: INSTITUCIONAL */}
        <div>
          <button onClick={() => toggleMenu('institucional')} className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-slate-900 transition-colors text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
            <div className="flex items-center gap-2"><span>Institucional</span></div>
            {openMenus.institucional ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          
          {openMenus.institucional && (
            <div className="space-y-1 pl-2">
              <SidebarLink href="/admin/institution/history" icon={ScrollText} label="História e Valores" onClick={onNavigate} />
              <SidebarLink href="/admin/institution/team" icon={Users} label="Equipe / Diretoria" onClick={onNavigate} />
              <SidebarLink href="/admin/institution/structure" icon={Network} label="Estrutura Org." onClick={onNavigate} />
            </div>
          )}
        </div>

        {/* GRUPO: CONTEÚDO */}
        <div>
          <button onClick={() => toggleMenu('conteudo')} className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-slate-900 transition-colors text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
            <div className="flex items-center gap-2"><span>Gestão de Conteúdo</span></div>
            {openMenus.conteudo ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {openMenus.conteudo && (
            <div className="space-y-1 pl-2">
              <SidebarLink href="/admin/posts" icon={FileText} label="Notícias" onClick={onNavigate} />
              <SidebarLink href="/admin/events" icon={CalendarDays} label="Agenda de Eventos" onClick={onNavigate} />
              <SidebarLink href="/admin/banners" icon={ImageIcon} label="Gerenciar Banners" onClick={onNavigate} />
              <SidebarLink href="/admin/gallery" icon={ImageIcon} label="Galeria de Fotos" onClick={onNavigate} />
              <SidebarLink href="/admin/courses" icon={GraduationCap} label="Cursos Oferecidos" onClick={onNavigate} />
              <SidebarLink href="/admin/institution/projects" icon={Briefcase} label="Projetos Sociais" onClick={onNavigate} />
              <SidebarLink href="/admin/birthdays" icon={Cake} label="Aniversariantes" onClick={onNavigate} />
              <SidebarLink href="/admin/featured-student" icon={Medal} label="Aluno Destaque" onClick={onNavigate} />
            </div>
          )}
        </div>

        {/* GRUPO: SISTEMA */}
        <div>
           <button onClick={() => toggleMenu('sistema')} className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-slate-900 transition-colors text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
            <div className="flex items-center gap-2"><span>Configurações</span></div>
            {openMenus.sistema ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          {openMenus.sistema && (
            <div className="space-y-1 pl-2">
               <SidebarLink href="/admin/users" icon={Users} label="Usuários Admin" onClick={onNavigate} />
               <SidebarLink href="/admin/settings" icon={Settings} label="Configurações Gerais" onClick={onNavigate} />
            </div>
          )}
        </div>

        <div className="pt-6 mt-2 border-t border-slate-900 space-y-2">
           <Link 
            href="/" 
            target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-400 text-sm font-medium"
          >
            <Home size={18} />
            <span>Acessar Site</span>
          </Link>
          <LogoutButton />
        </div>

      </nav>
    </div>
  )
}

function SidebarLink({ href, icon: Icon, label, onClick }: { href: string, icon: any, label: string, onClick?: () => void }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link 
      href={href} 
      onClick={onClick} 
      className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-all duration-200 group ${
        isActive 
          ? 'text-white bg-blue-600/20 border-l-2 border-blue-500 font-bold pl-3' 
          : 'text-slate-400 hover:text-white hover:bg-slate-800'
      }`}
    >
      <Icon size={16} className={`${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
      <span>{label}</span>
    </Link>
  )
}