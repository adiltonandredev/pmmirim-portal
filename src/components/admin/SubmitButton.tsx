"use client"

import { useFormStatus } from "react-dom"
import { Loader2, Save } from "lucide-react"

interface SubmitButtonProps {
  text?: string;
}

export function SubmitButton({ text = "Salvar" }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <button 
      type="submit" 
      disabled={pending}
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <Loader2 className="animate-spin" size={20} />
          <span>Salvando...</span>
        </>
      ) : (
        <>
          <Save size={20} />
          <span>{text}</span>
        </>
      )}
    </button>
  )
}