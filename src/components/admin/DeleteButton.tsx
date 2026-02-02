"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom" // <--- O SEGREDO ESTÁ AQUI
import { Trash2, AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DeleteButtonProps {
  action: (formData: FormData) => Promise<void>
  itemId?: string
  itemName?: string
  className?: string
}

export function DeleteButton({ action, itemId, itemName = "este item", className }: DeleteButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Garante que o Portal só funcione no navegador (evita erro de hidratação)
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleConfirm = async () => {
    setIsDeleting(true)
    
    const formData = new FormData()
    if (itemId) formData.append("id", itemId)
    
    try {
        await action(formData)
        setIsOpen(false)
    } catch (error) {
        console.error("Erro ao excluir", error)
    } finally {
        setIsDeleting(false)
    }
  }

  return (
    <>
      {/* BOTÃO LIXEIRA (Continua no lugar dele) */}
      <button 
        type="button"
        onClick={() => setIsOpen(true)}
        className={className || "bg-white/90 text-red-500 p-2 rounded-xl shadow-sm border border-slate-100 hover:bg-red-50 hover:text-red-600 transition-all hover:scale-110 z-20 group"}
        title="Excluir"
      >
        <Trash2 size={16} className="group-hover:stroke-[2.5px]" />
      </button>

      {/* MODAL VIA PORTAL (Renderiza fora de tudo, direto na tela) */}
      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
                
                {/* Cabeçalho */}
                <div className="bg-red-50 p-6 flex flex-col items-center justify-center border-b border-red-100 text-center">
                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-3">
                        <AlertTriangle size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-red-900">Excluir Foto?</h3>
                    <p className="text-sm text-red-700 mt-1 leading-relaxed">
                        Você tem certeza que deseja apagar <strong className="text-red-800">{itemName}</strong>?
                    </p>
                </div>

                {/* Botões */}
                <div className="p-4 bg-white flex gap-3">
                    <Button 
                        variant="ghost" 
                        onClick={() => setIsOpen(false)}
                        disabled={isDeleting}
                        className="flex-1 font-bold text-slate-600 hover:bg-slate-100 h-10"
                    >
                        Cancelar
                    </Button>

                    <Button 
                        onClick={handleConfirm}
                        disabled={isDeleting}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold shadow-md shadow-red-100 h-10"
                    >
                        {isDeleting ? <Loader2 className="animate-spin" size={18} /> : "Sim, Excluir"}
                    </Button>
                </div>
            </div>
        </div>,
        document.body // Joga o modal direto para o final do corpo do site
      )}
    </>
  )
}