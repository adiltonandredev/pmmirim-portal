import { prisma } from "@/lib/prisma"
import { BirthdayForm } from "@/components/admin/BirthdayForm"
import { notFound } from "next/navigation"
import { PageContainer, PageHeader, PageTitle, PageContent } from "@/components/admin/PageLayout"
import { Pencil } from "lucide-react"
export const dynamic = "force-dynamic"

export default async function EditBirthdayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const birthday = await prisma.birthday.findUnique({ where: { id } })
  if (!birthday) return notFound()
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle title="Editar Aniversariante" subtitle="Atualize os dados." icon={Pencil} backLink="/admin/birthdays" />
      </PageHeader>
      <PageContent><BirthdayForm birthday={birthday} /></PageContent>
    </PageContainer>
  )
}