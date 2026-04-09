import { StructureForm } from "@/components/admin/structure/StructureForm"
import { PageContainer, PageHeader, PageTitle, PageContent } from "@/components/admin/shared/PageLayout"
import { Network } from "lucide-react"

export default function NewStructurePage() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle
          title="Nova Estrutura"
          subtitle="Adicione um organograma ou nível hierárquico."
          icon={Network}
          backLink="/admin/institution/structure"
        />
      </PageHeader>
      <PageContent>
        <StructureForm />
      </PageContent>
    </PageContainer>
  )
}
