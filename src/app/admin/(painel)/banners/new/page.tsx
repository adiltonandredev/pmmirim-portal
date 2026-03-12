import { BannerForm } from "@/components/admin/BannerForm"
import { PageContainer, PageHeader, PageTitle, PageContent } from "@/components/admin/PageLayout"
import { Plus } from "lucide-react"

export default function NewBannerPage() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle 
            title="Novo Banner" 
            subtitle="Adicione um novo destaque ou parceiro ao site." 
            icon={Plus} 
            backLink="/admin/banners" // <--- O botão de voltar (setinha) aparece por causa disso
        />
      </PageHeader>

      <PageContent>
         {/* O formulário vazio para criar */}
         <BannerForm />
      </PageContent>
    </PageContainer>
  )
}