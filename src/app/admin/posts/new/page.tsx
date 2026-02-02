import { PostForm } from "@/components/admin/PostForm"
import { PageContainer, PageHeader, PageTitle, PageContent } from "@/components/admin/PageLayout"
import { FileText } from "lucide-react"

export default function NewPostPage() {
  return (
    <PageContainer>
      
      {/* Cabeçalho Padronizado */}
      <PageHeader>
        <PageTitle 
            title="Nova Notícia" 
            subtitle="Escreva e publique novidades no portal."
            icon={FileText} 
            backLink="/admin/posts" 
        />
      </PageHeader>

      {/* Formulário (sem passar post, pois é criação) */}
      <PageContent>
         <PostForm />
      </PageContent>

    </PageContainer>
  )
}