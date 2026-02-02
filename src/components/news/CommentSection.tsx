"use client"

import { createComment } from "@/app/actions/comments"
import { Button } from "@/components/ui/button"
import { User, MessageSquare } from "lucide-react"
import { useRef } from "react"
import { toast } from "sonner"

interface CommentProps {
    postId: string
    comments: {
        id: string
        author: string
        content: string
        createdAt: Date
    }[]
}

export function CommentSection({ postId, comments }: CommentProps) {
    const formRef = useRef<HTMLFormElement>(null)

    async function handleSubmit(formData: FormData) {
        const res = await createComment(formData)
        
        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success("Comentário enviado!")
            formRef.current?.reset()
        }
    }

    return (
        <div className="mt-12 border-t border-slate-200 pt-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <MessageSquare className="text-blue-600" /> Comentários ({comments.length})
            </h3>

            {/* LISTA */}
            <div className="space-y-6 mb-10">
                {comments.length === 0 ? (
                    <p className="text-slate-500 italic bg-slate-50 p-4 rounded-lg text-center">Seja o primeiro a comentar!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                    <User size={16} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">{comment.author}</p>
                                    <p className="text-[10px] text-slate-400">
                                        {new Date(comment.createdAt).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                            </div>
                            <p className="text-slate-600 text-sm ml-10">{comment.content}</p>
                        </div>
                    ))
                )}
            </div>

            {/* FORMULÁRIO */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-700 mb-4">Deixe seu comentário</h4>
                <form ref={formRef} action={handleSubmit} className="space-y-4">
                    <input type="hidden" name="postId" value={postId} />
                    
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Seu Nome</label>
                        <input required name="author" placeholder="Ex: João da Silva" className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mensagem</label>
                        <textarea required name="content" rows={3} placeholder="Escreva sua opinião aqui..." className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold w-full md:w-auto">
                        Enviar Comentário
                    </Button>
                </form>
            </div>
        </div>
    )
}