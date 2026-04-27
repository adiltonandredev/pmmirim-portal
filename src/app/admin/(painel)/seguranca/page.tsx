import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { TwoFactorSettings } from "@/components/admin/security/TwoFactorSettings"
import { ShieldCheck } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function SegurancaPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/admin/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { twoFactorEnabled: true },
  })

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-6 md:pl-16 md:pr-8">
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <ShieldCheck className="text-gray-600" /> Segurança da Conta
        </h1>
        <p className="text-gray-600">Gerencie a autenticação em duas etapas da sua conta.</p>
      </div>

      <TwoFactorSettings enabled={user?.twoFactorEnabled ?? false} />
    </div>
  )
}
