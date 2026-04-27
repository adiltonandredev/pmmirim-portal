"use client"

import { useState } from "react"
import Image from "next/image"
import { Shield, ShieldCheck, ShieldOff, Loader2, Copy, Check } from "lucide-react"

interface Props {
  enabled: boolean
}

export function TwoFactorSettings({ enabled: initialEnabled }: Props) {
  const [enabled, setEnabled] = useState(initialEnabled)
  const [step, setStep] = useState<"idle" | "setup" | "disable">("idle")
  const [qrDataUrl, setQrDataUrl] = useState("")
  const [secret, setSecret] = useState("")
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  async function startSetup() {
    setLoading(true)
    setError("")
    const res = await fetch("/api/auth/setup-2fa", { method: "POST" })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error)
      setLoading(false)
      return
    }
    setQrDataUrl(data.qrDataUrl)
    setSecret(data.secret)
    setStep("setup")
    setLoading(false)
  }

  async function enableTwoFactor() {
    setLoading(true)
    setError("")
    const res = await fetch("/api/auth/enable-2fa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error)
      setLoading(false)
      return
    }
    setEnabled(true)
    setStep("idle")
    setCode("")
    setSecret("")
    setQrDataUrl("")
    setLoading(false)
  }

  async function disableTwoFactor() {
    setLoading(true)
    setError("")
    const res = await fetch("/api/auth/disable-2fa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error)
      setLoading(false)
      return
    }
    setEnabled(false)
    setStep("idle")
    setCode("")
    setLoading(false)
  }

  function copySecret() {
    navigator.clipboard.writeText(secret)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Status header */}
      <div className={`p-6 flex items-center gap-4 ${enabled ? "bg-emerald-50 border-b border-emerald-100" : "bg-slate-50 border-b border-slate-100"}`}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${enabled ? "bg-emerald-100" : "bg-slate-200"}`}>
          {enabled
            ? <ShieldCheck size={24} className="text-emerald-600" />
            : <Shield size={24} className="text-slate-500" />
          }
        </div>
        <div>
          <p className="font-bold text-slate-800">Autenticação em duas etapas (2FA)</p>
          <p className={`text-sm font-medium ${enabled ? "text-emerald-600" : "text-slate-500"}`}>
            {enabled ? "Ativado — sua conta está protegida" : "Desativado — sua conta usa apenas senha"}
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Idle state */}
        {step === "idle" && (
          <>
            {!enabled ? (
              <div className="space-y-4">
                <p className="text-slate-600 text-sm leading-relaxed">
                  Com o 2FA ativado, além da senha você precisará de um código gerado pelo seu aplicativo autenticador (Google Authenticator, Authy, etc.) para acessar o painel.
                </p>
                <button
                  onClick={startSetup}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                  Ativar 2FA
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-slate-600 text-sm leading-relaxed">
                  O 2FA está ativo. Para desativar, insira o código do seu aplicativo autenticador para confirmar.
                </p>
                <button
                  onClick={() => { setStep("disable"); setError("") }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-semibold rounded-lg transition-colors"
                >
                  <ShieldOff size={16} /> Desativar 2FA
                </button>
              </div>
            )}
          </>
        )}

        {/* Setup flow */}
        {step === "setup" && (
          <div className="space-y-6">
            <div>
              <p className="font-semibold text-slate-800 mb-1">1. Escaneie o QR Code</p>
              <p className="text-slate-500 text-sm mb-4">Abra o Google Authenticator ou Authy e escaneie o código abaixo.</p>
              {qrDataUrl && (
                <div className="inline-block p-3 bg-white border-2 border-slate-200 rounded-xl">
                  <Image src={qrDataUrl} alt="QR Code 2FA" width={200} height={200} unoptimized />
                </div>
              )}
            </div>

            <div>
              <p className="font-semibold text-slate-800 mb-1">Não consegue escanear?</p>
              <p className="text-slate-500 text-sm mb-2">Insira este código manualmente no aplicativo:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 bg-slate-100 rounded-lg text-sm font-mono text-slate-700 break-all">
                  {secret}
                </code>
                <button onClick={copySecret} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                  {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} className="text-slate-500" />}
                </button>
              </div>
            </div>

            <div>
              <p className="font-semibold text-slate-800 mb-1">2. Confirme o código</p>
              <p className="text-slate-500 text-sm mb-3">Digite o código de 6 dígitos gerado pelo aplicativo para confirmar a configuração.</p>
              <div className="flex gap-3">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="w-36 text-center text-xl tracking-widest px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={enableTwoFactor}
                  disabled={loading || code.length !== 6}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                  Confirmar e Ativar
                </button>
              </div>
            </div>

            <button onClick={() => { setStep("idle"); setCode(""); setError("") }} className="text-slate-500 text-sm hover:text-slate-700">
              Cancelar
            </button>
          </div>
        )}

        {/* Disable flow */}
        {step === "disable" && (
          <div className="space-y-4">
            <p className="text-slate-600 text-sm">
              Digite o código de 6 dígitos do seu aplicativo autenticador para confirmar a desativação do 2FA.
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-36 text-center text-xl tracking-widest px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                onClick={disableTwoFactor}
                disabled={loading || code.length !== 6}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                Desativar
              </button>
            </div>
            <button onClick={() => { setStep("idle"); setCode(""); setError("") }} className="text-slate-500 text-sm hover:text-slate-700">
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
