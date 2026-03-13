import { prisma } from "@/lib/prisma"
import { ProjectForm } from "@/components/admin/others/ProjectForm"
import { notFound } from "next/navigation"
import { PageContainer, PageHeader, PageTitle, PageContent } from "@/components/admin/shared/PageLayout"
import { Pencil } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await prisma.post.findUnique({ where: { id } })
  if (!project) return notFound()

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle 
            title="Editar Projeto" 
            subtitle="Altere o conteúdo ou imagem." 
            icon={Pencil} 
            backLink="/admin/institution/projects" 
        />
      </PageHeader>
      <PageContent><ProjectForm project={project} /></PageContent>
    </PageContainer>
  )
}