import { prisma } from "@/lib/prisma"
import { EventForm } from "@/components/admin/EventForm"
import { notFound } from "next/navigation"
import { CalendarDays } from "lucide-react"
import { PageContainer, PageHeader, PageTitle, PageContent } from "@/components/admin/PageLayout"

interface Props {
    params: Promise<{ id: string }>
}

export default async function EditEventPage({ params }: Props) {
  const { id } = await params
  const event = await prisma.event.findUnique({ where: { id } })

  if (!event) return notFound()

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle 
            title="Editar Evento" 
            subtitle="Altere data, local ou informações do evento."
            icon={CalendarDays} 
            backLink="/admin/events" 
        />
      </PageHeader>
      <PageContent>
         <EventForm event={event} />
      </PageContent>
    </PageContainer>
  )
}