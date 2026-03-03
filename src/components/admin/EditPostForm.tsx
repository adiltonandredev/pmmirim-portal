"use client"

import { useState } from "react"
import { updatePost } from "@/app/actions/updatePost"
import { RichTextEditor } from "./RichTextEditor"
import Image from "next/image"
import { X } from "lucide-react"

interface Post {
  id: string
  title: string
  summary: string
  content: string
  type: string
  published: boolean
  isFeatured: boolean
  coverImage: string | null
}

export function EditPostForm({ post }: { post: Post }) {
  const [content, setContent] = useState(post.content)
  const [coverImage, setCoverImage] = useState(post.coverImage)
  const [removeImage, setRemoveImage] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.set("content", content)
    
    if (removeImage) {
      formData.set("removeImage", "true")
    }

    await updatePost(formData)
  }

  function handleRemoveCurrentImage() {
    setRemoveImage(true)
    setCoverImage(null)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="id" value={post.id} />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
        <input 
          name="title" 
          type="text" 
          defaultValue={post.title}
          required 
          className="w-full border border-gray-300 rounded-md px-4 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imagem de Capa
        </label>
        
        {coverImage && !removeImage ? (
          <div className="mb-4 relative">
            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-300">
              <Image
                src={coverImage}
                alt="Capa atual"
                fill
                className="object-cover"
              />
            </div>
            <button
              type="button"
              onClick={handleRemoveCurrentImage}
              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 shadow-lg"
            >
              <X size={20} />
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Imagem atual. Clique no X para remover ou faça upload de uma nova abaixo.
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500 mb-2">
            {removeImage ? "Imagem será removida. " : "Nenhuma imagem atual. "}
            Faça upload de uma nova imagem abaixo.
          </p>
        )}

        <input 
          name="coverImage" 
          type="file" 
          accept="image/*"
          className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <p className="text-xs text-gray-500 mt-1">
          JPG, PNG ou WEBP. Máximo 5MB. Deixe em branco para manter a imagem atual.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
          <select 
            name="type" 
            defaultValue={post.type}
            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white"
          >
            <option value="NEWS">Notícia</option>
            <option value="EVENT">Evento</option>
            <option value="ACTIVITY">Atividade</option>
            <option value="PROJECT">Projeto</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select 
            name="status" 
            defaultValue={post.published ? "published" : "draft"}
            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white"
          >
            <option value="published">Publicado (Visível)</option>
            <option value="draft">Rascunho (Oculto)</option>
          </select>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <label className="block text-sm font-bold text-gray-700 mb-3">⭐ Destaque no Carousel</label>
        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              name="isFeatured" 
              value="true"
              defaultChecked={post.isFeatured}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">Adicionar ao CAROUSEL da home</span>
              <p className="text-xs text-gray-600 mt-1">
                Quando marcado, esta notícia aparecerá automaticamente como um slide no banner rotativo 
                da página inicial. O link direcionará para a leitura completa desta notícia.
              </p>
              <p className="text-xs text-orange-600 mt-2 font-medium">
                ⚠️ Requisitos: Imagem de capa obrigatória + Notícia publicada
              </p>
            </div>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Resumo</label>
        <textarea 
          name="summary" 
          rows={2}
          defaultValue={post.summary}
          required 
          className="w-full border border-gray-300 rounded-md px-4 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo</label>
        <RichTextEditor 
          content={content}
          onChange={setContent}
        />
      </div>

      <div className="pt-4 flex justify-end">
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition font-medium disabled:bg-blue-400"
        >
          {loading ? "Salvando..." : "Salvar Alterações"}
        </button>
      </div>
    </form>
  )
}
