import { prisma } from "@/lib/prisma"
import { PageContainer, PageHeader, PageTitle, PageContent } from "@/components/admin/shared/PageLayout"
import { Tag } from "lucide-react"
import { CategoriesManager } from "@/components/admin/members/CategoriesManager"

export const dynamic = "force-dynamic"

export default async function MemberCategoriesPage() {
  const categories = await prisma.memberCategory.findMany({
    orderBy: { order: "asc" },
  })

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle
          title="Categorias de Membros"
          subtitle="Gerencie as categorias que aparecerão no menu público."
          icon={Tag}
          backLink="/admin/institution/team"
        />
      </PageHeader>
      <PageContent>
        <CategoriesManager categories={categories} />
      </PageContent>
    </PageContainer>
  )
}
