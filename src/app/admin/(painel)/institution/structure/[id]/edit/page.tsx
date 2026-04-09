import { prisma } from "@/lib/prisma"
import { StructureForm } from "@/components/admin/structure/StructureForm"
import { notFound } from "next/navigation"
import { PageContainer, PageHeader, PageTitle, PageContent } from "@/components/admin/shared/PageLayout"
import { Pencil } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function EditStructurePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const structure = await prisma.organizationalStructure.findUnique({ where: { id } })
  if (!structure) return notFound()

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle
          title="Editar Estrutura"
          subtitle="Atualize o organograma ou nível hierárquico."
          icon={Pencil}
          backLink="/admin/institution/structure"
        />
      </PageHeader>
      <PageContent>
        <StructureForm structure={structure} />
      </PageContent>
    </PageContainer>
  )
}
