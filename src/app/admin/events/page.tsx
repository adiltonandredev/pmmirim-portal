import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Plus, CalendarDays, MapPin, Clock, Pencil, Image as ImageIcon } from "lucide-react"
import { PageContainer, PageHeader, PageTitle, PageContent } from "@/components/admin/PageLayout"
import { deleteEvent } from "@/app/actions/events"
import { DeleteButton } from "@/components/admin/DeleteButton"

export const dynamic = "force-dynamic"

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({ orderBy: { date: 'asc' } })

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle 
            title="Agenda de Eventos" 
            subtitle="Gerencie as datas e atividades da instituição."
            icon={CalendarDays} 
        />
        <Link href="/admin/events/new" className="w-full md:w-auto">
          <Button className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold gap-2 shadow-md">
            <Plus size={18} /> Novo Evento
          </Button>
        </Link>
      </PageHeader>

      <PageContent>
        <div className="grid gap-4">
            {events.map((event) => {
                // CORREÇÃO: Validação robusta para aceitar pasta local (/uploads)
                const hasBanner = event.bannerUrl && (
                    event.bannerUrl.startsWith('data:') || 
                    event.bannerUrl.startsWith('http') || 
                    event.bannerUrl.startsWith('/')
                );

                return (
                <div key={event.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-5 hover:border-green-300 transition-all group">
                    
                    {/* DATA (DESTAQUE ESQUERDA - DESKTOP) */}
                    <div className="hidden md:flex flex-col items-center justify-center w-20 h-20 bg-green-50 rounded-lg border border-green-100 shrink-0 text-green-800">
                        <span className="text-2xl font-bold">{new Date(event.date).getDate()}</span>
                        <span className="text-xs font-bold uppercase">{new Date(event.date).toLocaleString('pt-BR', { month: 'short' }).replace('.', '')}</span>
                    </div>

                    {/* BANNER (DESTAQUE MOBILE / MINIATURA DESKTOP) */}
                    <div className="w-full md:w-32 h-40 md:h-20 relative bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                        {hasBanner ? (
                            <Image 
                                src={event.bannerUrl!} 
                                alt={event.title} 
                                fill 
                                className="object-cover transition-transform duration-500 group-hover:scale-105" 
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1">
                                <ImageIcon size={20} />
                                <span className="text-[9px] uppercase font-bold">Sem Capa</span>
                            </div>
                        )}
                        {/* Data Flutuante no Mobile */}
                        <div className="absolute top-2 left-2 md:hidden bg-white/90 backdrop-blur text-green-800 text-xs font-bold px-2 py-1 rounded shadow-sm">
                            {new Date(event.date).toLocaleDateString('pt-BR')}
                        </div>
                    </div>

                    {/* INFO */}
                    <div className="flex-1 min-w-0 space-y-1">
                        <h3 className="font-bold text-slate-800 text-lg leading-tight">{event.title}</h3>
                        
                        <div className="flex flex-wrap gap-3 text-xs text-slate-500 pt-1">
                            <div className="flex items-center gap-1">
                                <Clock size={14} className="text-green-600"/>
                                {new Date(event.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            {event.location && (
                                <div className="flex items-center gap-1">
                                    <MapPin size={14} className="text-red-500"/>
                                    <span className="truncate max-w-[200px]">{event.location}</span>
                                </div>
                            )}
                        </div>
                        
                        {event.description && (
                            <p className="text-sm text-slate-600 line-clamp-1 mt-1">{event.description}</p>
                        )}
                    </div>

                    {/* AÇÕES */}
                    <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t border-slate-100 md:border-t-0 md:border-l md:pl-5 self-stretch md:self-center justify-end">
                        <Link href={`/admin/events/${event.id}/edit`}>
                            <Button variant="outline" size="sm" className="text-slate-600 border-slate-200 hover:border-green-300 hover:text-green-700 font-bold h-9">
                                <Pencil size={16} className="mr-2" /> Editar
                            </Button>
                        </Link>
                        
                        <DeleteButton 
                            action={deleteEvent} 
                            itemId={event.id} 
                            itemName={`o evento "${event.title}"`}
                            className="h-9 w-9 p-0 bg-white border border-slate-200 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors shadow-sm"
                        />
                    </div>
                </div>
            )})}
        </div>

        {events.length === 0 && (
            <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 mt-6">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                    <CalendarDays size={32} className="text-green-200" />
                </div>
                <h3 className="font-bold text-slate-700 text-lg">Agenda Vazia</h3>
                <p className="text-sm text-slate-500 mt-1 mb-6">Nenhum evento próximo agendado.</p>
                <Link href="/admin/events/new">
                    <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50 font-bold">
                        Agendar Primeiro Evento
                    </Button>
                </Link>
            </div>
        )}
      </PageContent>
    </PageContainer>
  )
}