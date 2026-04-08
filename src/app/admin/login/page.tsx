import { prisma } from "@/lib/prisma"
import { LoginForm } from "./LoginForm"

export default async function LoginPage() {
  const settings = await prisma.siteSettings.findFirst({
    orderBy: { updatedAt: "desc" },
    select: { logoUrl: true, siteName: true },
  })

  return <LoginForm logo={settings?.logoUrl ?? null} siteName={settings?.siteName ?? "Polícia Militar Mirim"} />
}
