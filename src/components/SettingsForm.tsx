"use client"

import { useState } from "react"
import { updateSiteSettings } from "@/app/actions/updateSettings"
import Image from "next/image"
import { Save, Upload } from "lucide-react"

export function SettingsForm({ settings }: { settings: any }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    const result = await updateSiteSettings(formData)

    if (result.success) {
      setMessage({ type: "success", text: result.success })
    } else if (result.error) {
      setMessage({ type: "error", text: result.error })
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <input type="hidden" name="id" value={settings.id} />

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          🎨 Identidade Visual
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo do Site
            </label>
            {settings.logoUrl && (
              <div className="mb-3 relative w-48 h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
                <Image
                  src={settings.logoUrl}
                  alt="Logo atual"
                  fill
                  className="object-contain p-2"
                />
              </div>
            )}
            <input
              type="file"
              name="logo"
              accept="image/*"
              className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              PNG ou SVG recomendado. Máximo 5MB.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Favicon (ícone da aba)
            </label>
            {settings.faviconUrl && (
              <div className="mb-3 relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
                <Image
                  src={settings.faviconUrl}
                  alt="Favicon atual"
                  fill
                  className="object-contain p-1"
                />
              </div>
            )}
            <input
              type="file"
              name="favicon"
              accept="image/*"
              className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Quadrado 32x32 ou 64x64 pixels.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Site
            </label>
            <input
              type="text"
              name="siteName"
              defaultValue={settings.siteName}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição (SEO)
            </label>
            <input
              type="text"
              name="siteDescription"
              defaultValue={settings.siteDescription}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          📞 Informações de Contato
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email de Contato
            </label>
            <input
              type="email"
              name="contactEmail"
              defaultValue={settings.contactEmail || ""}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefone
            </label>
            <input
              type="text"
              name="contactPhone"
              defaultValue={settings.contactPhone || ""}
              placeholder="(11) 1234-5678"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              WhatsApp
            </label>
            <input
              type="text"
              name="contactWhatsapp"
              defaultValue={settings.contactWhatsapp || ""}
              placeholder="(11) 98765-4321"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endereço
            </label>
            <textarea
              name="address"
              defaultValue={settings.address || ""}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          🌐 Redes Sociais
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Facebook
            </label>
            <input
              type="url"
              name="socialFacebook"
              defaultValue={settings.socialFacebook || ""}
              placeholder="https://facebook.com/pmmirim"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instagram
            </label>
            <input
              type="url"
              name="socialInstagram"
              defaultValue={settings.socialInstagram || ""}
              placeholder="https://instagram.com/pmmirim"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Twitter / X
            </label>
            <input
              type="url"
              name="socialTwitter"
              defaultValue={settings.socialTwitter || ""}
              placeholder="https://twitter.com/pmmirim"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              YouTube
            </label>
            <input
              type="url"
              name="socialYoutube"
              defaultValue={settings.socialYoutube || ""}
              placeholder="https://youtube.com/@pmmirim"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          📄 Textos Institucionais
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título da Página Sobre
            </label>
            <input
              type="text"
              name="aboutTitle"
              defaultValue={settings.aboutTitle || ""}
              placeholder="Sobre a PMMIRIM"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição Sobre Nós
            </label>
            <textarea
              name="aboutDescription"
              defaultValue={settings.aboutDescription || ""}
              rows={4}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Missão
            </label>
            <textarea
              name="missionText"
              defaultValue={settings.missionText || ""}
              rows={2}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Visão
            </label>
            <textarea
              name="visionText"
              defaultValue={settings.visionText || ""}
              rows={2}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valores
            </label>
            <textarea
              name="valuesText"
              defaultValue={settings.valuesText || ""}
              rows={2}
              placeholder="Separe por vírgulas ou linhas"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Texto do Rodapé
            </label>
            <input
              type="text"
              name="footerText"
              defaultValue={settings.footerText || ""}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 sticky bottom-4 bg-white rounded-lg shadow-xl border border-gray-300 p-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition font-medium disabled:bg-blue-400 flex items-center gap-2 shadow-lg"
        >
          <Save size={20} />
          {loading ? "Salvando..." : "Salvar Configurações"}
        </button>
      </div>
    </form>
  )
}
