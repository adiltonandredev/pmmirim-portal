"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Menu, X, ChevronDown, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NavbarProps {
  logoUrl?: string | null;
}

export function Navbar({ logoUrl }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const pathname = usePathname()

  const menuItems = [
    { label: "Home", href: "/", isHighlight: false },
    { 
      label: "A Instituição", 
      href: "#", 
      submenu: [
        { label: "História", href: "/instituicao/historia" },
        { label: "Diretoria", href: "/instituicao/diretoria" },    
        { label: "Equipe", href: "/instituicao/equipe" },
      ]
    },
    { label: "Cursos", href: "/cursos"},
    { label: "Notícias", href: "/noticias" },    
    { label: "Projetos", href: "/projetos" },
    { label: "Parceiros", href: "/parceiros" },
    { label: "Galeria de Fotos", href: "/galeria" },
    { label: "Fale Conosco", href: "/contato", isHighlight: true },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Lógica para esconder/mostrar ao rolar rápido
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      // Lógica de transparência
      if (currentScrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header 
      // AQUI ESTÁ A CORREÇÃO DA COR DE FUNDO
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-0 lg:-translate-y-full"
      } ${
        isScrolled 
          // QUANDO ROLA: Fundo Escuro (Slate-900) com 90% Opacidade + Borda + Sombra + Blur
          ? "bg-slate-900/90 shadow-lg py-2 backdrop-blur-md border-b border-white/10"
          // NO TOPO: 100% Transparente (sem gradient) e sem borda
          : "bg-transparent py-4 border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* --- LOGO E NOME --- */}
          <Link href="/" className="flex items-center gap-3 md:gap-4 shrink-0 group">
            
            {logoUrl ? (
                <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-white/20 bg-slate-800 shadow-md group-hover:border-white/50 group-hover:scale-105 transition-all duration-300 shrink-0">
                    <Image 
                        src={logoUrl} 
                        alt="Logo Polícia Militar Mirim" 
                        fill 
                        className="object-cover"
                        sizes="(max-width: 768px) 48px, 56px"
                        priority
                    />
                </div>
            ) : (
                <div className="w-12 h-12 md:w-14 md:h-14 bg-white/10 rounded-full flex items-center justify-center text-white border-2 border-white/20 shadow-md group-hover:bg-white/20 transition-all">
                  <Shield size={24} />
                </div>
            )}
            
            <div className="flex flex-col">
              <span className="text-white font-black text-sm md:text-lg leading-none tracking-tight drop-shadow-md group-hover:text-yellow-400 transition-colors uppercase">
                Polícia Militar Mirim
              </span>
              <span className="text-yellow-400 font-bold text-[10px] md:text-xs tracking-[0.2em] drop-shadow-sm opacity-90 uppercase mt-0.5">
                Presidente Médici - RO
              </span>
            </div>
          </Link>

          {/* --- MENU DESKTOP --- */}
          <nav className="hidden lg:flex items-center gap-1">
            {menuItems.map((item) => {
                if (item.submenu) {
                    return (
                        <DropdownMenu key={item.label}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="text-white hover:text-yellow-400 hover:bg-white/10 font-bold gap-1 uppercase text-xs tracking-wide h-9 px-3">
                                    {item.label} <ChevronDown size={14} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-white border-slate-100 shadow-xl min-w-[200px] animate-in fade-in zoom-in-95 duration-200">
                                {item.submenu.map((subItem) => (
                                    <Link key={subItem.label} href={subItem.href}>
                                        <DropdownMenuItem className="cursor-pointer font-medium py-2.5 text-slate-600 focus:text-blue-900 focus:bg-slate-50">
                                            {subItem.label}
                                        </DropdownMenuItem>
                                    </Link>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )
                }
                
                if (item.isHighlight) {
                    return (
                        <Link key={item.label} href={item.href}>
                            <Button className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-black ml-4 border-none shadow-lg hover:shadow-yellow-400/20 transition-all uppercase text-xs tracking-wider h-9 px-5 rounded-full transform hover:-translate-y-0.5">
                                {item.label}
                            </Button>
                        </Link>
                    )
                }

                return (
                    <Link key={item.label} href={item.href}>
                        <Button variant="ghost" className={`font-bold uppercase text-xs tracking-wide h-9 px-3 transition-colors ${pathname === item.href ? "text-yellow-400 bg-white/5" : "text-white hover:text-yellow-400 hover:bg-white/10"}`}>
                            {item.label}
                        </Button>
                    </Link>
                )
            })}
          </nav>

          {/* --- MENU MOBILE --- */}
          <div className="lg:hidden">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-yellow-400 transition-colors" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </Button>
          </div>
        </div>
      </div>

      {/* --- MENU MOBILE DROPDOWN --- */}
      {isOpen && (
        <div className="lg:hidden absolute top-[100%] left-0 w-full bg-slate-900/95 border-t border-white/10 shadow-2xl backdrop-blur-xl h-[calc(100vh-64px)] overflow-y-auto animate-in slide-in-from-top-5 duration-300">
            <div className="flex flex-col p-4 gap-2 pb-20">
                {menuItems.map((item) => {
                    if (item.submenu) {
                        return (
                            <div key={item.label} className="space-y-1 bg-white/5 rounded-lg p-3">
                                <div className="px-2 py-1 text-yellow-400/80 font-black uppercase text-[10px] tracking-widest mb-1">
                                    {item.label}
                                </div>
                                {item.submenu.map(subItem => (
                                    <Link key={subItem.label} href={subItem.href} onClick={() => setIsOpen(false)}>
                                        <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 hover:text-yellow-400 pl-4 text-sm font-medium h-10 border-l-2 border-transparent hover:border-yellow-400 rounded-none transition-all">
                                            {subItem.label}
                                        </Button>
                                    </Link>
                                ))}
                            </div>
                        )
                    }
                    return (
                        <Link key={item.label} href={item.href} onClick={() => setIsOpen(false)}>
                            <Button 
                                variant={item.isHighlight ? "default" : "ghost"}
                                className={`w-full justify-start uppercase text-sm font-bold h-12 ${
                                    item.isHighlight 
                                    ? "bg-yellow-500 text-blue-900 hover:bg-yellow-400 mt-2 shadow-lg" 
                                    : "text-white hover:bg-white/10 hover:text-yellow-400"
                                }`}
                            >
                                {item.label}
                            </Button>
                        </Link>
                    )
                })}
            </div>
        </div>
      )}
    </header>
  )
}