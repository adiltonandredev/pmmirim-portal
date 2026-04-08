"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Shield, Mail, Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react"

interface LoginFormProps {
  logo: string | null
  siteName: string
}

export function LoginForm({ logo, siteName }: LoginFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const result = await signIn("credentials", { email, password, redirect: false })
      if (result?.error) {
        setError("E-mail ou senha incorretos.")
        setLoading(false)
      } else {
        router.push("/admin")
        router.refresh()
      }
    } catch {
      setError("Ocorreu um erro ao tentar entrar.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-900">

      {/* Painel esquerdo — identidade visual */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Fundo com gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900" />
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />

        <div className="relative z-10 flex flex-col items-center text-center gap-8 max-w-sm">
          {/* Logo */}
          <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl relative bg-white/10 flex items-center justify-center">
            {logo ? (
              <Image src={logo} alt={siteName} fill className="object-cover" sizes="144px" priority />
            ) : (
              <Shield size={64} className="text-white/80" />
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold text-white leading-tight">{siteName}</h1>
            <p className="text-blue-200 text-sm mt-2 font-medium">Presidente Médici — Rondônia</p>
          </div>

          <div className="w-16 h-px bg-white/20" />

          <p className="text-blue-200/70 text-sm leading-relaxed">
            Sistema exclusivo para servidores autorizados. Acesso monitorado e registrado.
          </p>
        </div>
      </div>

      {/* Painel direito — formulário */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">

        {/* Logo visível só no mobile */}
        <div className="lg:hidden flex flex-col items-center gap-3 mb-10">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 shadow-xl relative bg-white/10 flex items-center justify-center">
            {logo ? (
              <Image src={logo} alt={siteName} fill className="object-cover" sizes="80px" priority />
            ) : (
              <Shield size={36} className="text-white/70" />
            )}
          </div>
          <h1 className="text-xl font-bold text-white">{siteName}</h1>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">Entrar no painel</h2>
            <p className="text-slate-400 text-sm mt-1">Área restrita a administradores</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300" htmlFor="email">E-mail</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-300" htmlFor="password">Senha</label>
                <Link href="/admin/login/esqueci-senha" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 mt-2"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Entrando...</>
              ) : (
                <>Acessar Painel <ArrowRight size={18} /></>
              )}
            </button>

          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
              ← Voltar para o site
            </Link>
          </div>

          <p className="text-center text-slate-600 text-xs mt-6">
            &copy; {new Date().getFullYear()} {siteName}. Acesso monitorado.
          </p>
        </div>
      </div>

    </div>
  )
}
