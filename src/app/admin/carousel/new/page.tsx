"use client"

import { useState } from "react"
import { createCarouselItem } from "@/app/actions/createCarouselItem"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function NewCarouselPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    await createCarouselItem(formData)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Novo Slide do Carousel</h1>
        <Link href="/admin/carousel">
          <Button variant="outline">Cancelar</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-8 border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Imagem do Slide *
            </label>
            {imagePreview && (
              <div className="mb-4 relative h-64 rounded-lg overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <input
              name="image"
              type="file"
              accept="image/*"
              required
              onChange={handleImageChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Recomendado: 1920x600px. Máximo 5MB.
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Título
            </label>
            <input
              name="title"
              type="text"
              placeholder="Ex: Disciplina, Honra e Educação"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="Texto que aparece abaixo do título"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Link do Botão (opcional)
              </label>
              <input
                name="actionUrl"
                type="text"
                placeholder="/sobre"
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Texto do Botão
              </label>
              <input
                name="actionText"
                type="text"
                placeholder="Saiba Mais"
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                value="true"
                defaultChecked
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">Ativar slide (visível no site)</span>
            </label>
          </div>

          <div className="pt-4 flex justify-end border-t">
            <Button type="submit" disabled={loading} size="lg">
              {loading ? "Criando..." : "Criar Slide"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
