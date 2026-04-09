import { prisma } from "@/lib/prisma"
import { MemberForm } from "@/components/admin/members/MemberForm"
import { PageContainer, PageHeader, PageTitle, PageContent } from "@/components/admin/shared/PageLayout"
import { UserPlus } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function NewTeamMemberPage() {
  const categories = await prisma.memberCategory.findMany({ orderBy: { order: "asc" } })

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle
          title="Novo Membro"
          subtitle="Adicione um integrante à equipe."
          icon={UserPlus}
          backLink="/admin/institution/team"
        />
      </PageHeader>
      <PageContent>
        <MemberForm categories={categories} />
      </PageContent>
    </PageContainer>
  )
}
