"use client"

import { createPost } from "@/app/actions/createPost"
import Link from "next/link"
import { RichTextEditor } from "@/components/RichTextEditor"
import { useState } from "react"

export default function NewPostPage() {
  const [content, setContent] = useState("")

  return (
    <div className="max-w-4xl mx-auto pb-20"> {/* pb-20 para dar espaço no final */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Nova Notícia</h1>
        <Link href="/admin/posts" className="text-gray-500 hover:text-gray-700">Cancelar</Link>
      </div>

      <div className="bg-white rounded-lg shadow p-8 border border-gray-200">
        <form action={createPost} className="space-y-6">
          
          {/* Título */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Título</label>
            <input name="title" type="text" required className="w-full border border-gray-300 rounded-md px-4 py-2" placeholder="Digite o título da matéria" />
          </div>

          {/* UPLOAD DE IMAGEM (Mudança Aqui) */}
          <div className="bg-gray-50 p-4 rounded-md border border-dashed border-gray-300">
            <label className="block text-sm font-bold text-gray-700 mb-2">Imagem de Destaque (Capa)</label>
            <input 
              name="coverImage" 
              type="file" 
              accept="image/*" // Aceita apenas imagens
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-green-50 file:text-green-700
                hover:file:bg-green-100 cursor-pointer" 
            />
            <p className="text-xs text-gray-500 mt-2">Formatos aceitos: JPG, PNG, WEBP.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Categoria</label>
              <select name="type" className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white">
                <option value="NEWS">Notícia</option>
                <option value="EVENT">Evento</option>
                <option value="ACTIVITY">Atividade</option>
                <option value="PROJECT">Projeto</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Opções de Exibição</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="isFeatured" 
                    value="true"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    ⭐ Adicionar ao <strong>CAROUSEL</strong> (banner rotativo da home)
                  </span>
                </label>
                <p className="text-xs text-gray-500 ml-6">
                  A notícia aparecerá automaticamente no carousel com link para leitura completa
                </p>
                <label className="flex items-center gap-2 cursor-pointer mt-3">
                  <input 
                    type="checkbox" 
                    name="published" 
                    value="true"
                    defaultChecked
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">✅ Publicar imediatamente (visível no site)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Resumo */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Resumo Curto</label>
            <textarea name="summary" rows={2} required className="w-full border border-gray-300 rounded-md px-4 py-2" placeholder="Texto rápido para a página inicial..." />
          </div>

          {/* EDITOR RICO */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Conteúdo Completo</label>
            <div className="text-xs text-gray-500 mb-2">
               Dica: Para inserir vídeos, clique no botão <strong>🎥 YT</strong> e cole o link do YouTube.
            </div>
            
            <RichTextEditor content={content} onChange={setContent} />
            <input type="hidden" name="content" value={content} />
          </div>

          <div className="pt-4 flex justify-end border-t border-gray-100 mt-6">
            <button type="submit" className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition font-bold shadow-lg">
              Publicar Notícia
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}