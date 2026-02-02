import { prisma } from "@/lib/prisma"
import { MemberForm } from "@/components/admin/MemberForm"
import { notFound } from "next/navigation"
import { PageContainer, PageHeader, PageTitle, PageContent } from "@/components/admin/PageLayout"
import { Pencil } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const member = await prisma.teamMember.findUnique({ where: { id } })
  if (!member) return notFound()

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle 
            title={`Editar Membro`} 
            subtitle="Atualize os dados do integrante." 
            icon={Pencil} 
            backLink="/admin/institution/team" 
        />
      </PageHeader>
      <PageContent>
         <MemberForm member={member} />
      </PageContent>
    </PageContainer>
  )
}