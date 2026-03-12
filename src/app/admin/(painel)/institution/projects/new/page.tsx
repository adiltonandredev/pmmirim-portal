import { ProjectForm } from "@/components/admin/ProjectForm"
import { PageContainer, PageHeader, PageTitle, PageContent } from "@/components/admin/PageLayout"
import { Plus } from "lucide-react"

export default function NewProjectPage() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle 
            title="Novo Projeto" 
            subtitle="Adicione uma nova iniciativa social." 
            icon={Plus} 
            backLink="/admin/institution/projects" 
        />
      </PageHeader>
      <PageContent><ProjectForm /></PageContent>
    </PageContainer>
  )
}