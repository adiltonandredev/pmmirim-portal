"use client"

import { useRouter } from "next/navigation"
import { Shield, Home, ArrowLeft, AlertTriangle, ServerCrash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

interface ErrorModalProps {
  code: number
  title: string
  description: string
  type?: "not-found" | "error" | "forbidden"
}

const THEMES = {
  "not-found": {
    icon: Shield,
    iconBg: "bg-blue-900",
    iconColor: "text-yellow-400",
    codeBg: "from-blue-950 to-blue-900",
    codeColor: "text-yellow-400",
    badgeBg: "bg-blue-800/60",
    badgeText: "text-blue-200",
    stripe1: "bg-yellow-400",
    stripe2: "bg-blue-600",
    stripe3: "bg-white",
  },
  "error": {
    icon: ServerCrash,
    iconBg: "bg-red-900",
    iconColor: "text-red-300",
    codeBg: "from-red-950 to-red-900",
    codeColor: "text-red-300",
    badgeBg: "bg-red-800/60",
    badgeText: "text-red-200",
    stripe1: "bg-red-400",
    stripe2: "bg-red-700",
    stripe3: "bg-white",
  },
  "forbidden": {
    icon: AlertTriangle,
    iconBg: "bg-yellow-900",
    iconColor: "text-yellow-300",
    codeBg: "from-yellow-950 to-yellow-900",
    codeColor: "text-yellow-300",
    badgeBg: "bg-yellow-800/60",
    badgeText: "text-yellow-200",
    stripe1: "bg-yellow-400",
    stripe2: "bg-yellow-700",
    stripe3: "bg-white",
  },
}

export function ErrorModal({ code, title, description, type = "not-found" }: ErrorModalProps) {
  const router = useRouter()
  const theme = THEMES[type]
  const Icon = theme.icon

  // Fecha com ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.back()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [router])

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={(e) => { if (e.target === e.currentTarget) router.back() }}
    >
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">

        {/* Faixa Brasil no topo */}
        <div className="flex h-1.5 w-full">
          <div className={`flex-1 ${theme.stripe1}`} />
          <div className={`flex-1 ${theme.stripe2}`} />
          <div className={`flex-1 ${theme.stripe3}`} />
        </div>

        {/* Cabeçalho colorido */}
        <div className={`bg-gradient-to-br ${theme.codeBg} px-8 pt-10 pb-12 text-center relative overflow-hidden`}>
          {/* Círculos decorativos */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
          <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-white/5 rounded-full" />

          {/* Ícone */}
          <div className={`relative inline-flex items-center justify-center w-20 h-20 ${theme.iconBg} rounded-2xl mb-4 border border-white/10 shadow-xl mx-auto`}>
            <Icon size={40} className={theme.iconColor} />
          </div>

          {/* Código */}
          <div className={`text-8xl font-black ${theme.codeColor} leading-none mb-2 drop-shadow-lg`}>
            {code}
          </div>

          {/* Badge */}
          <span className={`inline-block ${theme.badgeBg} ${theme.badgeText} text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-white/10`}>
            Polícia Militar Mirim — Presidente Médici
          </span>
        </div>

        {/* Conteúdo */}
        <div className="px-8 py-8 text-center">
          <h1 className="text-2xl font-black text-slate-900 mb-3">{title}</h1>
          <p className="text-slate-500 leading-relaxed mb-8">{description}</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="gap-2 font-bold border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft size={18} /> Voltar
            </Button>
            <Button
              onClick={() => router.push("/")}
              className="gap-2 font-bold bg-blue-900 hover:bg-blue-800 text-white"
            >
              <Home size={18} /> Ir para o Início
            </Button>
          </div>

          <p className="mt-6 text-xs text-slate-400">
            Pressione <kbd className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-[10px] font-mono">ESC</kbd> ou clique fora para fechar
          </p>
        </div>

      </div>
    </div>
  )
}
