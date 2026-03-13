import { MemberForm } from "@/components/admin/members/MemberForm"
import { PageContainer, PageHeader, PageTitle, PageContent } from "@/components/admin/shared/PageLayout"
import { UserPlus } from "lucide-react"

export default function NewTeamMemberPage() {
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
         <MemberForm />
      </PageContent>
    </PageContainer>
  )
}