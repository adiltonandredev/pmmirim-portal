import { prisma } from "@/lib/prisma"
import { CourseForm } from "@/components/admin/CourseForm"
import { notFound } from "next/navigation"
import { PageContainer, PageHeader, PageTitle, PageContent } from "@/components/admin/PageLayout"
import { Pencil } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const course = await prisma.course.findUnique({
    where: { id }
  })

  if (!course) return notFound()

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle 
            title={`Editar: ${course.title}`} 
            subtitle="Altere as informações, conteúdo ou status do curso." 
            icon={Pencil} 
            backLink="/admin/courses" 
        />
      </PageHeader>

      <PageContent>
         <CourseForm course={course} />
      </PageContent>
    </PageContainer>
  )
}