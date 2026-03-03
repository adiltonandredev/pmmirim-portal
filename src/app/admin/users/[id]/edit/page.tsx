import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { EditUserForm } from "./EditUserForm"
import { PageContainer, PageHeader, PageTitle, PageContent } from "@/components/admin/PageLayout"
import { UserCog } from "lucide-react"

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) return notFound()

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle title={`Editar ${user.name}`} subtitle="Altere dados ou redefina a senha." icon={UserCog} backLink="/admin/users" />
      </PageHeader>
      <PageContent>
         <EditUserForm user={user} />
      </PageContent>
    </PageContainer>
  )
}