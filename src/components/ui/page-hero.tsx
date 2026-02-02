/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

// Interface relaxada para aceitar qualquer coisa sem erro
interface PageHeroProps {
  title: string
  subtitle?: string
  icon: any             // Aceita qualquer ícone
  bgImage?: string
  bgColor?: string
  themeColor?: any      // Aceita qualquer string de cor
  backLink?: string
  backText?: string
}

export function PageHero({ 
  title, 
  subtitle, 
  icon: Icon, 
  bgImage, 
  bgColor = "bg-slate-900", 
  themeColor = "yellow", 
  backLink, 
  backText 
}: PageHeroProps) {

  // Definição dos temas
  const themes: any = {
    yellow: { icon: "text-yellow-400", glow: "from-yellow-400/20 to-orange-500/20", border: "border-yellow-400/30", bar: "bg-yellow-400" },
    blue: { icon: "text-blue-400", glow: "from-blue-400/20 to-cyan-500/20", border: "border-blue-400/30", bar: "bg-blue-400" },
    green: { icon: "text-emerald-400", glow: "from-emerald-400/20 to-green-500/20", border: "border-emerald-400/30", bar: "bg-emerald-400" },
    red: { icon: "text-red-400", glow: "from-red-400/20 to-rose-500/20", border: "border-red-400/30", bar: "bg-red-400" },
    slate: { icon: "text-slate-400", glow: "from-slate-400/20 to-gray-500/20", border: "border-slate-400/30", bar: "bg-slate-400" }
  }

  const theme = themes[themeColor] || themes.yellow

  return (
    <section className={cn("relative text-white pt-32 pb-20 px-4 overflow-hidden border-b border-white/5 min-h-[400px] flex items-center justify-center", bgColor)}>
      {bgImage && (
        <div className="absolute inset-0 z-0 opacity-[0.2] bg-cover bg-center bg-no-repeat grayscale mix-blend-overlay"
            style={{ backgroundImage: `url('${bgImage}')` }} />
      )}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-black/20 via-black/50 to-black/80"></div>
      
      <div className="container mx-auto relative z-10 flex flex-col items-center text-center">
        {backLink && (
           <div className="absolute -top-16 left-0 hidden lg:block">
              <Link href={backLink} className="inline-flex items-center text-slate-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider group bg-black/20 hover:bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm border border-white/5">
                  <ArrowLeft size={16} className="mr-2"/> {backText || "Voltar"}
               </Link>
           </div>
        )}
        <div className="mb-8 relative group">
           <div className={`absolute -inset-4 bg-gradient-to-r ${theme.glow} rounded-full blur-xl opacity-50`}></div>
           <div className={`relative w-16 h-16 bg-black/20 rounded-2xl flex items-center justify-center border ${theme.border} backdrop-blur-md shadow-2xl`}>
              <Icon size={32} className={`${theme.icon} drop-shadow-md`} />
           </div>
        </div>
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4 text-white drop-shadow-xl max-w-4xl leading-tight">{title}</h1>
        {subtitle && (
          <div className="max-w-3xl mx-auto flex flex-col items-center">
             <p className="text-lg md:text-xl text-slate-300 font-light leading-relaxed drop-shadow-md">{subtitle}</p>
             <div className={`w-24 h-1.5 ${theme.bar} mt-6 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)]`}></div>
          </div>
        )}
      </div>
    </section>
  )
}