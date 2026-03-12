// src/app/eventos/page.tsx
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, MapPin, Clock, ArrowLeft, Calendar } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero"; // <--- Componente Padrão

export const metadata: Metadata = {
  title: "Agenda de Eventos | Polícia Mirim",
  description: "Confira o calendário oficial de atividades, formaturas e eventos.",
};

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  // 1. Busca eventos futuros (A partir de hoje 00:00)
  const upcomingEvents = await prisma.event.findMany({
    where: {
      date: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    },
    orderBy: { date: "asc" },
  });

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* 1. HERO PADRONIZADO (Tema Azul - Agenda) */}
      <PageHero 
        title="Agenda Institucional"
        subtitle="Fique por dentro das formaturas, solenidades e atividades de campo da nossa instituição."
        icon={CalendarDays}
        
        // Cores e Imagem (Pasta /bg/ conforme solicitado)
        bgColor="bg-blue-950"      // Fundo Azul Escuro
        themeColor="blue"          // Tema Azul
        bgImage="/bg/bg-eventos.png" // <--- CAMINHO ATUALIZADO (Crie a pasta 'bg' em public)
        
        backLink="/"
        backText="Voltar ao Início"
      />

      {/* 2. CONTEÚDO (Sobreposição -mt-10) */}
      <div className="flex-1 container mx-auto px-4 -mt-6 relative z-20 pb-20">
        
        {upcomingEvents.length === 0 ? (
            // ESTADO VAZIO (Sem eventos)
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-slate-100 max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar size={40} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Agenda Disponível em Breve</h3>
                <p className="text-slate-500">
                    No momento não temos eventos públicos agendados. <br />
                    Fique atento às nossas redes sociais para novidades.
                </p>
            </div>
        ) : (
            // LISTA DE EVENTOS
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map((event) => {
                    const eventDate = new Date(event.date);
                    
                    // Formatações de data
                    const day = eventDate.getDate();
                    const month = eventDate.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();
                    const time = eventDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                    const weekday = eventDate.toLocaleDateString('pt-BR', { weekday: 'long' });

                    return (
                        <Card key={event.id} className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full group bg-white rounded-2xl">
                            
                            {/* IMAGEM / BANNER */}
                            <div className="h-56 relative bg-slate-800 overflow-hidden">
                                {event.bannerUrl ? (
                                    <Image 
                                        src={event.bannerUrl} 
                                        alt={event.title} 
                                        fill 
                                        className="object-cover transition-transform duration-700 group-hover:scale-110" 
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                                        <CalendarDays className="text-slate-300" size={48} />
                                    </div>
                                )}

                                {/* SOBREPOSIÇÃO ESCURA NO HOVER (Igual às outras páginas) */}
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                                {/* BADGE DE DATA FLUTUANTE */}
                                <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg overflow-hidden text-center min-w-[60px] border border-slate-100">
                                    <div className="bg-blue-600 text-white text-[10px] font-bold uppercase py-1 px-2">
                                        {month}
                                    </div>
                                    <div className="py-2 px-2">
                                        <span className="text-2xl font-black text-slate-900 leading-none block">{day}</span>
                                    </div>
                                </div>

                                {/* TAG DE LOCAL */}
                                {event.location && ( // [cite: 27]
                                    <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-white/90 text-xs font-bold bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                                        <MapPin size={12} className="text-blue-400" />
                                        <span className="truncate max-w-[200px]">{event.location}</span>
                                    </div>
                                )}
                            </div>

                            <CardContent className="p-6 md:p-8 flex flex-col flex-1">
                                <div className="mb-4">
                                    <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase mb-2 tracking-wide">
                                        <Clock size={14} />
                                        {weekday} às {time}
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-blue-700 transition-colors mb-2">
                                        {event.title}
                                    </h3>
                                </div>

                                {event.description && ( // [cite: 26]
                                    <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3 text-justify flex-1">
                                        {event.description}
                                    </p>
                                )}

                                <div className="mt-auto pt-6 border-t border-slate-100">
                                    <Button className="w-full bg-slate-900 hover:bg-blue-700 text-white font-bold h-12 transition-all shadow-md">
                                        Confirmar Presença
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        )}
      </div>
    </main>
  );
}