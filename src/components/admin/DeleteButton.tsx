"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Trash2, AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface DeleteButtonProps {
    // AJUSTADO: Agora tipado para aceitar o retorno padrão das suas actions
    action: (id: string) => Promise<{ success: boolean; message?: string }>;
    itemId?: string;
    itemName?: string;
    className?: string;
}

export function DeleteButton({ action, itemId, itemName = "este item", className }: DeleteButtonProps) {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [mounted, setMounted] = useState(false)

    // Garante que o Portal só funcione no navegador (evita erro de hidratação)
    useEffect(() => {
        setMounted(true)
    }, [])

    const handleConfirm = async () => {
        // 1. Verificação de segurança para o TypeScript parar de reclamar
        if (!itemId) {
            toast.error("ID do item não encontrado.");
            return;
        }

        setIsDeleting(true);

        try {
            // 2. Agora o TS sabe que itemId é uma string garantida aqui
            const result = await action(itemId);

            if (!result.success) {
                toast.error(result.message || "Erro ao excluir.");
            } else {
                toast.success(result.message || "Item excluído com sucesso!");
                setIsOpen(false);
                router.refresh();
            }
        } catch (error) {
            console.error("Erro ao excluir", error);
            toast.error("Ocorreu um erro inesperado ao excluir.");
        } finally {
            setIsDeleting(false);
        }
    };

    // Se não estiver montado, não renderiza o botão ainda (evita mismatches do SSR)
    if (!mounted) return null;

    return (
        <>
            {/* BOTÃO LIXEIRA */}
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className={className || "bg-white/90 text-red-500 p-2 rounded-xl shadow-sm border border-slate-100 hover:bg-red-50 hover:text-red-600 transition-all hover:scale-110 z-20 group"}
                title="Excluir"
            >
                <Trash2 size={16} className="group-hover:stroke-[2.5px]" />
            </button>

            {/* MODAL VIA PORTAL */}
            {isOpen && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">

                        {/* Cabeçalho */}
                        <div className="bg-red-50 p-6 flex flex-col items-center justify-center border-b border-red-100 text-center">
                            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-3">
                                <AlertTriangle size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-red-900">Excluir Item?</h3>
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
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold shadow-md shadow-red-100 h-10 flex items-center justify-center"
                            >
                                {isDeleting ? <Loader2 className="animate-spin w-5 h-5" /> : "Sim, Excluir"}
                            </Button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}