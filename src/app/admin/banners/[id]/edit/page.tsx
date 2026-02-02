import { prisma } from "@/lib/prisma"
import { BannerForm } from "@/components/admin/BannerForm"
import { notFound } from "next/navigation"
import { Pencil } from "lucide-react"
import { PageContainer, PageHeader, PageTitle, PageContent } from "@/components/admin/PageLayout"

interface Props {
    params: Promise<{ id: string }>
}

export default async function EditBannerPage({ params }: Props) {
  const { id } = await params
  const banner = await prisma.banner.findUnique({
    where: { id },
  })

  if (!banner) return notFound()

  return (
    <PageContainer>
      
      {/* O Título e o Botão Voltar ficam AQUI (Fora do cartão branco) */}
      <PageHeader>
        <PageTitle 
            title="Editar Banner" 
            subtitle="Altere as informações, imagem ou link de destino."
            icon={Pencil} 
            backLink="/admin/banners" 
        />
      </PageHeader>

      {/* O Formulário fica dentro do cartão branco limpo */}
      <PageContent>
         <BannerForm banner={banner} />
      </PageContent>

    </PageContainer>
  )
}