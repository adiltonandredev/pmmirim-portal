import { CourseForm } from "@/components/admin/CourseForm"
import { PageContainer, PageHeader, PageTitle, PageContent } from "@/components/admin/PageLayout"
import { BookOpen } from "lucide-react"

export default function NewCoursePage() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle 
            title="Novo Curso" 
            subtitle="Adicione um novo curso, ementa e informações ao catálogo." 
            icon={BookOpen} 
            backLink="/admin/courses" 
        />
      </PageHeader>

      <PageContent>
         {/* Chamamos o formulário vazio para criar um novo */}
         <CourseForm />
      </PageContent>
    </PageContainer>
  )
}