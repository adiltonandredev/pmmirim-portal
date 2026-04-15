import Link from "next/link"
import { ShieldCheck, CalendarDays, Newspaper, ArrowRight, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface InfoCardsProps {
  nextEvent: {
    id: string;
    title: string;
    date: Date;
    location?: string | null;
  } | null;
  latestNews: {
    id: string;
    title: string;
    slug: string;
    summary?: string | null;
  } | null;
  missionText?: string | null;
}

const defaultMission =
  "Promover a cidadania e a disciplina através de atividades educacionais e sociais, formando jovens preparados para o futuro.";

export function InfoCards({ nextEvent, latestNews, missionText }: InfoCardsProps) {
  return (
    <section className="container mx-auto px-4 py-8 -mt-20 relative z-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* CARD 1 — MISSÃO */}
        <Card className="shadow-xl border-0 border-t-[3px] border-t-blue-600 bg-white/97 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group h-full animate-fade-in-up animation-delay-100">
          <CardHeader className="flex flex-row items-center gap-4 pb-2 pt-5 px-5">
            <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-md group-hover:scale-110 transition-transform duration-300 shrink-0">
              <ShieldCheck size={26} />
            </div>
            <CardTitle className="text-slate-800 group-hover:text-blue-600 transition-colors text-base font-black uppercase tracking-wide">
              Nossa Missão
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <p className="text-slate-500 leading-relaxed text-sm">
              {missionText || defaultMission}
            </p>
          </CardContent>
        </Card>

        {/* CARD 2 — PRÓXIMO EVENTO */}
        <Link href="/eventos" className="block h-full">
          <Card className="shadow-xl border-0 border-t-[3px] border-t-green-600 bg-white/97 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group h-full animate-fade-in-up animation-delay-200 cursor-pointer">
            <CardHeader className="flex flex-row items-center gap-4 pb-2 pt-5 px-5">
              <div className="p-2.5 bg-green-600 rounded-xl text-white shadow-md group-hover:scale-110 transition-transform duration-300 shrink-0">
                <CalendarDays size={26} />
              </div>
              <CardTitle className="text-slate-800 group-hover:text-green-600 transition-colors text-base font-black uppercase tracking-wide">
                Próximo Evento
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              {nextEvent ? (
                <div className="space-y-2">
                  <span className="text-green-700 font-black text-lg capitalize leading-none block">
                    {new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long" }).format(
                      new Date(nextEvent.date)
                    )}
                  </span>
                  <span className="text-slate-400 text-xs font-bold uppercase block">
                    {new Intl.DateTimeFormat("pt-BR", {
                      weekday: "long",
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(new Date(nextEvent.date))}
                  </span>
                  <p className="font-bold text-slate-800 leading-tight line-clamp-2">{nextEvent.title}</p>
                  {nextEvent.location && (
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin size={11} /> {nextEvent.location}
                    </p>
                  )}
                  <span className="inline-flex items-center text-xs font-black text-green-600 uppercase mt-1 group-hover:translate-x-1 transition-transform gap-1">
                    Ver todos os eventos <ArrowRight size={13} />
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-slate-400 italic">Nenhum evento futuro agendado.</p>
                  <span className="inline-flex items-center text-xs font-black text-green-600 uppercase mt-1 group-hover:translate-x-1 transition-transform gap-1">
                    Ver agenda <ArrowRight size={13} />
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </Link>

        {/* CARD 3 — ÚLTIMA NOTÍCIA */}
        <Link href={latestNews ? `/noticias/${latestNews.slug}` : "/noticias"} className="block h-full">
          <Card className="shadow-xl border-0 border-t-[3px] border-t-yellow-500 bg-white/97 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full group animate-fade-in-up animation-delay-300">
            <CardHeader className="flex flex-row items-center gap-4 pb-2 pt-5 px-5">
              <div className="p-2.5 bg-yellow-500 rounded-xl text-white shadow-md group-hover:scale-110 transition-transform duration-300 shrink-0">
                <Newspaper size={26} />
              </div>
              <CardTitle className="text-slate-800 group-hover:text-yellow-600 transition-colors text-base font-black uppercase tracking-wide">
                Últimas Notícias
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              {latestNews ? (
                <div className="space-y-2">
                  <p className="font-bold text-slate-800 leading-tight line-clamp-2">{latestNews.title}</p>
                  <p className="text-slate-500 text-xs line-clamp-2">
                    {latestNews.summary || "Clique para ler a matéria completa..."}
                  </p>
                  <span className="inline-flex items-center text-xs font-black text-yellow-600 uppercase mt-1 group-hover:translate-x-1 transition-transform gap-1">
                    Ler agora <ArrowRight size={13} />
                  </span>
                </div>
              ) : (
                <p className="text-slate-400 text-sm italic">Nenhuma notícia recente.</p>
              )}
            </CardContent>
          </Card>
        </Link>
      </div>
    </section>
  );
}
