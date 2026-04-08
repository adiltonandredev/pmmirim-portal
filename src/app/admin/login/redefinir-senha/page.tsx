"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Lock, Loader2, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [msg, setMsg] = useState("")

  if (!token) {
    return (
      <div className="text-center">
        <div className="w-12 h-12 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={24} className="text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Link inválido</h2>
        <p className="text-slate-400 text-sm mb-6">Este link é inválido ou está incompleto.</p>
        <Link href="/admin/login/esqueci-senha" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
          Solicitar novo link
        </Link>
      </div>
    )
  }

  if (status === "success") {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} className="text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Senha alterada!</h2>
        <p className="text-slate-400 text-sm mb-2">Sua senha foi atualizada com sucesso.</p>
        <div className="flex items-center justify-center gap-2 text-slate-500 text-xs mt-6">
          <Loader2 size={12} className="animate-spin" /> Redirecionando para o login...
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setMsg("As senhas não coincidem."); return }
    if (password.length < 6) { setMsg("A senha deve ter no mínimo 6 caracteres."); return }

    setStatus("loading")
    setMsg("")

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      })

      if (res.ok) {
        setStatus("success")
        setTimeout(() => router.push("/admin/login"), 3000)
      } else {
        setStatus("error")
        setMsg("O link é inválido ou expirou. Solicite novamente.")
      }
    } catch {
      setStatus("error")
      setMsg("Erro de conexão. Tente novamente.")
    }
  }

  return (
    <>
      <div className="mb-8">
        <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-6">
          <Lock size={24} className="text-blue-400" />
        </div>
        <h1 className="text-2xl font-bold text-white">Criar nova senha</h1>
        <p className="text-slate-400 text-sm mt-1">Digite sua nova senha de acesso ao painel.</p>
      </div>

      {msg && (
        <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle size={16} className="shrink-0" /> {msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-300">Nova senha</label>
          <div className="relative">
            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <input
              type={showPass ? "text" : "password"}
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-300">Confirmar senha</label>
          <div className="relative">
            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <input
              type="password"
              required
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repita a nova senha"
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40"
        >
          {status === "loading" ? (
            <><Loader2 size={18} className="animate-spin" /> Salvando...</>
          ) : (
            "Salvar nova senha"
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-white/10 text-center">
        <Link href="/admin/login" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
          ← Voltar para o login
        </Link>
      </div>
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-sm">
        <Suspense fallback={<div className="flex justify-center"><Loader2 className="animate-spin text-blue-400" /></div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
