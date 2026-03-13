import { BirthdayForm } from "@/components/admin/others/BirthdayForm"
import { PageContainer, PageHeader, PageTitle, PageContent } from "@/components/admin/shared/PageLayout"
import { Plus } from "lucide-react"

export default function NewBirthdayPage() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle title="Novo Aniversariante" subtitle="Adicione alguém à lista." icon={Plus} backLink="/admin/birthdays" />
      </PageHeader>
      <PageContent><BirthdayForm /></PageContent>
    </PageContainer>
  )
}