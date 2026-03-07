import { EventForm } from "@/components/admin/EventForm"
import { PageContainer, PageHeader, PageTitle, PageContent } from "@/components/admin/PageLayout"
import { CalendarDays } from "lucide-react"

export default function NewEventPage() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle 
            title="Novo Evento" 
            subtitle="Adicione um novo evento ao calendário."
            icon={CalendarDays} 
            backLink="/admin/events" 
        />
      </PageHeader>
      <PageContent>
         <EventForm />
      </PageContent>
    </PageContainer>
  )
}