"use client"

import { useEffect } from "react"
import { CheckCircle2, XCircle, X } from "lucide-react"

interface FeedbackModalProps {
  open: boolean
  type: "success" | "error"
  title: string
  message?: string
  onClose: () => void
}

export function FeedbackModal({ open, type, title, message, onClose }: FeedbackModalProps) {
  // Fecha com ESC
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, onClose])

  if (!open) return null

  const isSuccess = type === "success"

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 ${
          isSuccess ? "bg-emerald-50" : "bg-red-50"
        }`}>
          {isSuccess
            ? <CheckCircle2 size={36} className="text-emerald-500" />
            : <XCircle size={36} className="text-red-500" />
          }
        </div>

        <h3 className={`text-xl font-bold text-center mb-2 ${
          isSuccess ? "text-emerald-700" : "text-red-700"
        }`}>
          {title}
        </h3>

        {message && (
          <p className="text-sm text-slate-500 text-center leading-relaxed">{message}</p>
        )}

        <button
          onClick={onClose}
          className={`mt-6 w-full py-2.5 rounded-xl font-semibold text-white transition-colors ${
            isSuccess
              ? "bg-emerald-500 hover:bg-emerald-600"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {isSuccess ? "Ótimo!" : "Entendido"}
        </button>
      </div>
    </div>
  )
}
