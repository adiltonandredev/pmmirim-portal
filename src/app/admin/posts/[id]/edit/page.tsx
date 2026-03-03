import { prisma } from "@/lib/prisma"
import { PostForm } from "@/components/admin/PostForm"
import { notFound } from "next/navigation"
import { FileText } from "lucide-react"
import { PageContainer, PageHeader, PageTitle, PageContent } from "@/components/admin/PageLayout"

export const dynamic = "force-dynamic"
type Props = { params: Promise<{ id: string }> }

export default async function EditPostPage(props: Props) {
  const params = await props.params;
  const post = await prisma.post.findUnique({ where: { id: params.id } })

  if (!post) return notFound()

  return (
    <PageContainer>
      
      {/* O Título e Botão Voltar ficam AQUI (Layout System) */}
      <PageHeader>
        <PageTitle 
            title="Editar Notícia" 
            subtitle="Gerencie o conteúdo desta publicação."
            icon={FileText} 
            backLink="/admin/posts" 
        />
      </PageHeader>

      {/* O Formulário limpo fica AQUI */}
      <PageContent>
         <PostForm post={post} />
      </PageContent>

    </PageContainer>
  )
}