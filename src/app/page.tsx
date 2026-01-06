import { Navbar } from "@/components/Navbar";
import { HeroCarousel } from "@/components/HeroCarousel";
import { Footer } from "@/components/Footer";
import { FloatingSocial } from "@/components/FloatingSocial";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Newspaper, ShieldCheck, ArrowRight, Users, Award, Target, Sparkles, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const [latestPosts, projectPosts, settings, carouselItems] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
    prisma.post.findMany({
      where: { published: true, type: "PROJECT" },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
    getSiteSettings(),
    prisma.carouselItem.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    }),
  ]);

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-white to-slate-50 relative">
      <Navbar settings={settings} />
      
      <HeroCarousel items={carouselItems} />

      {/* Floating Social Buttons */}
      <FloatingSocial settings={settings} />

      {/* Feature Cards */}
      <section className="container mx-auto px-4 py-12 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <Card className="shadow-xl border-t-4 border-t-blue-600 bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all hover:-translate-y-2 duration-300 group">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform">
                <ShieldCheck size={32} />
              </div>
              <CardTitle className="text-slate-800 group-hover:text-blue-600 transition-colors">Nossa Missão</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 leading-relaxed">
                Promover a cidadania e a disciplina através de atividades educacionais e sociais para jovens.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-t-4 border-t-green-600 bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all hover:-translate-y-2 duration-300 group">
             <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform">
                <CalendarDays size={32} />
              </div>
              <CardTitle className="text-slate-800 group-hover:text-green-600 transition-colors">Próximos Eventos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 leading-relaxed">
                Confira o calendário de formaturas, desfiles e atividades de campo da PMMIRIM.
              </p>
            </CardContent>
          </Card>

          <Link href="/noticias" className="block h-full">
            <Card className="shadow-xl border-t-4 border-t-yellow-500 bg-white/95 backdrop-blur-sm hover:bg-gradient-to-br hover:from-yellow-50 hover:to-white transition-all hover:-translate-y-2 duration-300 cursor-pointer h-full group">
                <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform">
                  <Newspaper size={32} />
                </div>
                <CardTitle className="text-slate-800 group-hover:text-yellow-600 transition-colors">Últimas Notícias</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">
                  Fique por dentro de tudo o que acontece. Clique aqui para ver o arquivo completo.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {projectPosts.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 border-l-4 border-green-600 pl-4">
              Projetos PMMIRIM
            </h2>
            <Link href="/projetos" className="text-green-600 font-semibold hover:text-green-700 flex items-center gap-2 group">
              Ver todos <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projectPosts.map((project, index) => (
              <Link key={project.id} href={`/projetos/${project.slug}`} className="group" style={{animationDelay: `${index * 100}ms`}}>
                <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-slate-200 flex flex-col h-full group-hover:-translate-y-2">
                  <div className="h-56 w-full relative bg-gradient-to-br from-green-200 to-green-300 overflow-hidden">
                    {project.coverImage ? (
                      <Image 
                        src={project.coverImage} 
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-green-500 font-bold bg-green-50">
                        <Award size={48} />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      Projeto
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-green-600 transition line-clamp-2">
                      {project.title}
                    </h3>
                    
                    <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-1 leading-relaxed">
                      {project.summary}
                    </p>
                    
                    <span className="text-green-600 font-bold text-sm flex items-center gap-2 mt-auto group-hover:gap-3 transition-all">
                      Saiba mais <ArrowRight size={16} />
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 border-l-4 border-blue-600 pl-4">
                Aconteceu na PMMIRIM
            </h2>
            <Link href="/noticias" className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2 group">
                Ver todas <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestPosts.map((post, index) => (
              <Link key={post.id} href={`/noticias/${post.slug}`} className="group" style={{animationDelay: `${index * 100}ms`}}>
                <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-slate-200 flex flex-col h-full group-hover:-translate-y-2">
                  <div className="h-48 w-full relative bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden">
                    {post.coverImage ? (
                      <Image 
                        src={post.coverImage} 
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-bold bg-slate-100">
                        <Newspaper size={48} />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        {post.type === "NEWS" ? "Notícia" : post.type === "EVENT" ? "Evento" : post.type === "ACTIVITY" ? "Atividade" : "Projeto"}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="text-xs text-slate-500 mb-3 flex items-center gap-2">
                       <CalendarDays size={14} />
                       {new Date(post.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-1 leading-relaxed">
                      {post.summary}
                    </p>
                    
                    <span className="text-blue-600 font-bold text-sm flex items-center gap-2 mt-auto group-hover:gap-3 transition-all">
                      Ler matéria completa <ArrowRight size={16} />
                    </span>
                  </div>
                </article>
              </Link>
            ))}

            {latestPosts.length === 0 && (
                <div className="col-span-3 text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-300">
                    <Newspaper className="mx-auto mb-4 text-slate-400" size={48} />
                    <p className="text-slate-500 text-lg">Nenhuma notícia publicada ainda.</p>
                </div>
            )}
        </div>
      </section>

      {/* Statistics Section - Enhanced */}
      <section className="container mx-auto px-4 py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-transparent to-green-50 rounded-3xl -z-10"></div>
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-3">
            <Sparkles className="text-blue-600" size={36} />
            Nosso Impacto
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Números que refletem nosso compromisso com a transformação social e desenvolvimento da juventude
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl transform group-hover:scale-105 transition-transform duration-300"></div>
            <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-blue-100 group-hover:shadow-2xl transition-all">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:rotate-12 transition-transform">
                <Users size={32} />
              </div>
              <h3 className="text-5xl font-bold text-slate-900 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
                500+
              </h3>
              <p className="text-slate-600 font-medium">Jovens Atendidos</p>
              <div className="mt-3 flex items-center justify-center gap-2 text-sm text-green-600">
                <TrendingUp size={16} />
                <span className="font-semibold">+20% este ano</span>
              </div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-50 rounded-2xl transform group-hover:scale-105 transition-transform duration-300"></div>
            <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-green-100 group-hover:shadow-2xl transition-all">
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:rotate-12 transition-transform">
                <CalendarDays size={32} />
              </div>
              <h3 className="text-5xl font-bold text-slate-900 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-800">
                50+
              </h3>
              <p className="text-slate-600 font-medium">Eventos Realizados</p>
              <div className="mt-3 flex items-center justify-center gap-2 text-sm text-green-600">
                <TrendingUp size={16} />
                <span className="font-semibold">Anualmente</span>
              </div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-2xl transform group-hover:scale-105 transition-transform duration-300"></div>
            <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-yellow-100 group-hover:shadow-2xl transition-all">
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:rotate-12 transition-transform">
                <Award size={32} />
              </div>
              <h3 className="text-5xl font-bold text-slate-900 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-yellow-800">
                15
              </h3>
              <p className="text-slate-600 font-medium">Anos de História</p>
              <div className="mt-3 flex items-center justify-center gap-2 text-sm text-slate-500">
                <Target size={16} />
                <span className="font-semibold">Desde 2010</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-24 mt-10 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
         
         {/* Floating Shapes */}
         <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
         <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
         <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-400/20 rounded-full blur-xl animate-pulse delay-500"></div>

         <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <ShieldCheck size={40} className="text-yellow-300" />
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Faça Parte da PMMIRIM
            </h2>
            
            <p className="text-blue-100 max-w-3xl mx-auto mb-10 text-lg md:text-xl leading-relaxed">
              A PMMIRIM é uma instituição dedicada a construir um futuro melhor através da educação, disciplina e valores.
              Venha fazer parte dessa história transformadora e ajude a formar os cidadãos do amanhã.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
                <Link href="/sobre" className="flex-1">
                  <Button size="lg" variant="secondary" className="w-full shadow-2xl hover:shadow-yellow-500/50 hover:scale-105 transition-all bg-white text-blue-700 hover:bg-yellow-400 hover:text-slate-900 font-bold">
                    Conheça nossa História
                  </Button>
                </Link>
                <Link href="/contato" className="flex-1">
                  <Button size="lg" variant="outline" className="w-full bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-700 shadow-2xl hover:shadow-white/50 hover:scale-105 transition-all font-bold">
                    Entre em Contato
                  </Button>
                </Link>
            </div>
         </div>
      </section>

      <Footer settings={settings} />
    </main>
  );
}