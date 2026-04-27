"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Shield, Loader2 } from "lucide-react"

export default function TwoFactorVerifyPage() {
  const { update } = useSession()
  const router = useRouter()
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const updated = await update({ twoFactorCode: code.trim() })

    if (updated?.user?.twoFactorVerified) {
      router.push("/admin")
      router.refresh()
    } else {
      setError("Código inválido ou expirado. Tente novamente.")
      setCode("")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
            <Shield size={32} className="text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Verificação em duas etapas</h1>
          <p className="text-slate-400 text-sm mt-2">
            Abra o aplicativo autenticador e insira o código de 6 dígitos.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            inputMode="numeric"
            pattern="\d{6}"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="000000"
            autoFocus
            required
            className="w-full text-center text-3xl tracking-[0.5em] py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 size={18} className="animate-spin" /> Verificando...</> : "Verificar"}
          </button>
        </form>

        <p className="text-center text-slate-600 text-xs mt-8">
          Usando Google Authenticator, Authy ou similar.
        </p>
      </div>
    </div>
  )
}
