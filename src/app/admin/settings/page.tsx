import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getSiteSettings } from "@/lib/settings"
import { SettingsForm } from "@/components/SettingsForm"

export default async function SettingsPage() {
  const session = await auth()
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin")
  }

  const settings = await getSiteSettings()

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Configurações do Site</h1>
        <p className="text-gray-600">Gerencie as informações gerais, logo, contatos e redes sociais</p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  )
}
