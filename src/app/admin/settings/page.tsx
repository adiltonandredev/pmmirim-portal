import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma" // Usamos prisma direto para pegar tudo
import { SettingsForm } from "@/components/admin/SettingsForm"
import { Settings } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  const session = await auth()
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin")
  }

  // 1. Busca Configurações Gerais
  const siteSettings = await prisma.siteSettings.findFirst()

  // 2. Busca Configurações do Instagram (NOVO)
  const instagramSettings = await prisma.instagramSettings.findFirst()

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-6 md:pl-16 md:pr-8">
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Settings className="text-gray-600" /> Configurações do Sistema
        </h1>
        <p className="text-gray-600">Gerencie as informações gerais, logo, contatos e integrações.</p>
      </div>

      {/* Passamos os DOIS objetos */}
      <SettingsForm 
        siteSettings={siteSettings} 
        instagramSettings={instagramSettings} 
      />
    </div>
  )
}