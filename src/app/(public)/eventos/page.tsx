import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CalendarDays, Calendar } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { EventosGrid } from "./eventos-grid";

export const metadata: Metadata = {
  title: "Agenda de Eventos | Polícia Mirim",
  description: "Confira o calendário oficial de atividades, formaturas e eventos.",
};

export const dynamic = "force-dynamic";

export default async function EventsPage() {
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

      <PageHero
        title="Agenda Institucional"
        subtitle="Fique por dentro das formaturas, solenidades e atividades de campo da nossa instituição."
        icon={CalendarDays}
        bgColor="bg-blue-950"
        themeColor="blue"
        bgImage="/bg/bg-eventos.png"
        backLink="/"
        backText="Voltar ao Início"
      />

      <div className="flex-1 container mx-auto px-4 -mt-6 relative z-20 pb-20">
        {upcomingEvents.length === 0 ? (
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
          <EventosGrid events={upcomingEvents} />
        )}
      </div>
    </main>
  );
}
