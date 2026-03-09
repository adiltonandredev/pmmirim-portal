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
  // 1. ADICIONAMOS A PROPRIEDADE AQUI
  missionText?: string | null;
}

// 2. RECEBEMOS A PROPRIEDADE AQUI
export function InfoCards({ nextEvent, latestNews, missionText }: InfoCardsProps) {
  
  // Texto de backup caso o banco esteja vazio
  const defaultMission = "Promover a cidadania e a disciplina através de atividades educacionais e sociais, formando jovens preparados para o futuro.";

  return (
    <section className="container mx-auto px-4 py-12 -mt-20 relative z-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
        
        {/* === CARD 1: MISSÃO (Agora Dinâmico) === */}
        <Card className="shadow-xl border-t-4 border-t-blue-600 bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all hover:-translate-y-2 duration-300 group h-full">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform">
              <ShieldCheck size={32} />
            </div>
            <CardTitle className="text-slate-800 group-hover:text-blue-600 transition-colors">Nossa Missão</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 leading-relaxed text-sm">
              {/* 3. USAMOS A VARIÁVEL AQUI */}
              {missionText || defaultMission}
            </p>
          </CardContent>
        </Card>

        {/* === CARD 2: PRÓXIMO EVENTO (Dinâmico) === */}
        <Card className="shadow-xl border-t-4 border-t-green-600 bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all hover:-translate-y-2 duration-300 group h-full">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="p-3 bg-green-600 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform">
              <CalendarDays size={32} />
            </div>
            <CardTitle className="text-slate-800 group-hover:text-green-600 transition-colors">Próximo Evento</CardTitle>
          </CardHeader>
          <CardContent>
            {nextEvent ? (
                <div className="space-y-2">
                    <div className="flex flex-col">
                        {/* Data Formatada: Dia de Mês */}
                        <span className="text-green-700 font-black text-lg capitalize leading-none mb-1">
                            {new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long' }).format(new Date(nextEvent.date))}
                        </span>
                        {/* Dia da Semana e Hora */}
                        <span className="text-slate-400 text-xs font-bold uppercase">
                            {new Intl.DateTimeFormat('pt-BR', { weekday: 'long', hour: '2-digit', minute: '2-digit' }).format(new Date(nextEvent.date))}
                        </span>
                    </div>
                    <p className="font-bold text-slate-800 leading-tight line-clamp-2 min-h-[2.5em]">
                        {nextEvent.title}
                    </p>
                    {nextEvent.location && (
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                            <MapPin size={12}/> {nextEvent.location}
                        </p>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 py-2">
                    <p className="text-sm italic">Nenhum evento futuro agendado.</p>
                </div>
            )}
          </CardContent>
        </Card>

        {/* === CARD 3: ÚLTIMA NOTÍCIA (Dinâmico) === */}
        <Link href={latestNews ? `/noticias/${latestNews.slug}` : "/noticias"} className="block h-full">
          <Card className="shadow-xl border-t-4 border-t-yellow-500 bg-white/95 backdrop-blur-sm hover:bg-gradient-to-br hover:from-yellow-50 hover:to-white transition-all hover:-translate-y-2 duration-300 cursor-pointer h-full group">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="p-3 bg-yellow-500 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform">
                <Newspaper size={32} />
              </div>
              <CardTitle className="text-slate-800 group-hover:text-yellow-600 transition-colors">Últimas Notícias</CardTitle>
            </CardHeader>
            <CardContent>
              {latestNews ? (
                  <div className="space-y-2">
                    <p className="font-bold text-slate-800 leading-tight line-clamp-2 min-h-[2.5em]">
                        {latestNews.title}
                    </p>
                    <p className="text-slate-600 text-xs line-clamp-2">
                        {latestNews.summary || "Clique para ler a matéria completa..."}
                    </p>
                    <span className="inline-flex items-center text-xs font-bold text-yellow-600 uppercase mt-2 group-hover:translate-x-1 transition-transform">
                        Ler agora <ArrowRight size={14} className="ml-1" />
                    </span>
                  </div>
              ) : (
                  <p className="text-slate-500 text-sm italic py-2">Nenhuma notícia recente.</p>
              )}
            </CardContent>
          </Card>
        </Link>
      </div>
    </section>
  )
}