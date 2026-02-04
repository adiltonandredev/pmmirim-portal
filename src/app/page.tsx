// src/app/page.tsx
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { FloatingSocial } from "@/components/layout/FloatingSocial";
import { FeaturedStudentSection } from "@/components/home/FeaturedStudentSection";
import { InstagramFeed } from "@/components/home/InstagramFeed";
import { PartnersAutoCarousel } from "@/components/home/PartnersAutoCarousel"; 
import { SponsorsCarousel } from "@/components/home/SponsorsCarousel";
import { InfoCards } from "@/components/home/InfoCards"; // <--- NOVO COMPONENTE
import { Button } from "@/components/ui/button";
import { Cake, Handshake, User, List, ArrowRight, Award, Newspaper, CalendarDays, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

type HeroSlide = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  actionUrl: string;
  actionText: string;
  order: number;
};

export default async function Home() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();

  const [
    latestPosts,       // 1
    projectPosts,      // 2
    settings,          // 3
    homeBanners,       // 4
    partnerBanners,    // 5
    sponsorBanners,    // 6
    birthdays,         // 7
    featuredStudent,   // 8
    instagramSettings, // 9
    nextEvent,         // 10 <--- NOVO (Evento Mais Próximo)
    latestNewsCard,    // 11 <--- NOVO (Última Notícia Única)
    institutionData    // 12 <--- NOVO (Dados da Instituição)
  ] = await Promise.all([
    // 1. Posts Gerais (Lista de baixo)
    prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
    // 2. Projetos
    prisma.post.findMany({
      where: { published: true, type: "PROJECT" },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
    // 3. Configurações
    getSiteSettings(),
    
    // 4. Banners HOME
    prisma.banner.findMany({
      where: { active: true, type: 'HOME' }, 
      orderBy: { order: 'asc' },
    }),

    // 5. Banners PARCEIROS
    prisma.banner.findMany({
      where: { active: true, type: 'PARTNER' },
      orderBy: { order: 'asc' },
    }),

    // 6. Banners PATROCINADORES
    prisma.banner.findMany({
      where: { active: true, type: 'SPONSOR' },
      orderBy: { order: 'asc' },
    }),

    // 7. Aniversariantes
    prisma.birthday.findMany({
        orderBy: { date: 'asc' }
    }), 
    
    // 8. Aluno Destaque
    prisma.featuredStudent.findFirst({
      where: { active: true },
      orderBy: { createdAt: 'desc' }
    }),
    
    // 9. Instagram
    prisma.instagramSettings.findFirst(),

    // 10. PRÓXIMO EVENTO (Lógica: Data >= Hoje, Ordenar Ascendente, Pegar o 1º)
    prisma.event.findFirst({
      where: { date: { gte: new Date() } }, 
      orderBy: { date: 'asc' },
      select: { id: true, title: true, date: true, location: true }
    }),

    // 11. ÚLTIMA NOTÍCIA (Para o Card do Topo)
    prisma.post.findFirst({
        where: { published: true, type: 'NEWS' }, // Garante que é notícia
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, slug: true, summary: true }
    }),

    // 12. Dados da Instituição
    prisma.institutionHistory.findFirst()
  ]);

  // --- Slides Hero ---
  const newsSlides: HeroSlide[] = latestPosts.map((post) => ({
    id: post.id,
    title: post.title,
    description: post.summary || "Confira os detalhes desta matéria.",
    imageUrl: post.coverImage || "/uploads/placeholder.jpg",
    actionUrl: `/noticias/${post.slug}`, 
    actionText: "Ler Matéria",
    order: -1 
  }));

  const dbSlides: HeroSlide[] = homeBanners.map((item) => ({
    id: item.id,
    title: item.title || "",
    description: item.description || "", 
    imageUrl: item.imageUrl,
    actionUrl: item.link || "#",
    actionText: item.link ? "Saiba Mais" : "",
    order: item.order
  }));

  const allHeroSlides = [...dbSlides, ...newsSlides].sort((a, b) => a.order - b.order);

  // === LÓGICA DE ANIVERSARIANTES ===
  const activeBirthdays = birthdays.filter(b => {
    const bDate = new Date(b.date);
    const bMonth = bDate.getUTCMonth() + 1;
    const bDay = bDate.getUTCDate();
    if (bMonth !== currentMonth) return false;
    if (bDay < currentDay) return false; 
    return true;
  });

  const sortedBirthdays = activeBirthdays.sort((a, b) => {
    const dayA = new Date(a.date).getUTCDate();
    const dayB = new Date(b.date).getUTCDate();
    return dayA - dayB;
  });

  const displayBirthdays = sortedBirthdays.slice(0, 4);
  const hasMore = sortedBirthdays.length > 4;

  // --- Parceiros ---
  const adaptedPartners = partnerBanners.map(banner => ({
    id: banner.id,
    name: banner.title || "Parceiro",
    logoUrl: banner.imageUrl,
    siteUrl: banner.link || "#"
  }));
  const shuffledPartners = shuffleArray(adaptedPartners);

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 relative overflow-x-hidden">
      
      <HeroCarousel items={allHeroSlides} />
      
      <FloatingSocial settings={settings} />

      {/* === CARDS DINÂMICOS (Missão, Próximo Evento, Última Notícia) === */}
      <InfoCards nextEvent={nextEvent} latestNews={latestNewsCard} missionText={institutionData?.mission}/>

      {/* NOTÍCIAS RECENTES (GRID) */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 border-l-8 border-blue-600 pl-4 uppercase">
                Aconteceu na Polícia Militar Mirim
            </h2>
            <Link href="/noticias" className="text-blue-600 font-bold hover:text-blue-800 flex items-center gap-2 group uppercase text-sm">
                Ver todas <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestPosts.map((post) => (
              <Link key={post.id} href={`/noticias/${post.slug}`} className="group h-full">
                <article className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full group-hover:-translate-y-1">
                  <div className="h-48 w-full relative bg-slate-200 overflow-hidden">
                    {post.coverImage ? (
                      <Image src={post.coverImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-bold bg-slate-100"><Newspaper size={48} /></div>
                    )}
                    <div className="absolute top-3 right-3 bg-blue-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded shadow-lg">
                        {post.type === "NEWS" ? "Notícia" : post.type === "EVENT" ? "Evento" : "Projeto"}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="text-xs text-slate-500 mb-2 flex items-center gap-2 font-bold uppercase">
                        <CalendarDays size={14} />
                        {new Date(post.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition line-clamp-2 leading-tight">{post.title}</h3>
                    <span className="text-blue-600 font-bold text-xs flex items-center gap-1 mt-auto uppercase">Ler matéria <ArrowRight size={12} /></span>
                  </div>
                </article>
              </Link>
            ))}
        </div>
      </section>

      {/* ALUNO DESTAQUE */}
      {featuredStudent && (
        <section className="w-full border-t border-b border-yellow-200">
             <FeaturedStudentSection student={featuredStudent} />
        </section>
      )}

      {/* ANIVERSARIANTES E PARCEIROS */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* ANIVERSARIANTES */}
            <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
                    <div className="p-2 bg-pink-100 rounded-lg text-pink-600"><Cake size={24} /></div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase">Aniversariantes de {currentDate.toLocaleString('pt-BR', { month: 'long' })}</h2>
                </div>

                {displayBirthdays.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {displayBirthdays.map((b) => {
                                const bDate = new Date(b.date);
                                const dayNumber = bDate.getUTCDate();
                                const isToday = dayNumber === currentDay;
                                return (
                                    <div key={b.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${isToday ? 'bg-pink-50 border-pink-300 shadow-md ring-2 ring-pink-100' : 'bg-white border-slate-100 shadow-sm'}`}>
                                        <div className={`w-16 h-16 shrink-0 rounded-full overflow-hidden border-2 ${isToday ? 'border-pink-500' : 'border-slate-200'} relative bg-slate-100`}>
                                            {b.photoUrl ? (
                                                <Image src={b.photoUrl} alt={b.name} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400"><User size={24} /></div>
                                            )}
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-sm font-bold uppercase tracking-wider ${isToday ? 'text-pink-600' : 'text-blue-600'}`}>Dia {dayNumber}</span>
                                                {isToday && <span className="text-[10px] bg-pink-500 text-white px-2 py-0.5 rounded-full font-bold uppercase animate-pulse">Hoje!</span>}
                                            </div>
                                            <h4 className={`font-black text-lg leading-tight break-words ${isToday ? 'text-pink-800' : 'text-slate-900'}`}>{b.name}</h4>
                                            <span className="text-xs text-slate-500 uppercase font-bold mt-1">{(b as any).role || "Polícia Mirim"}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {hasMore && (
                            <Link href="/instituicao/aniversariantes" className="mt-2">
                                <Button variant="outline" className="w-full border-pink-200 text-pink-600 hover:bg-pink-50 hover:text-pink-700 font-bold">
                                    <List className="mr-2" size={16} /> Ver lista completa ({sortedBirthdays.length - 4} mais)
                                </Button>
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="bg-slate-50 rounded-2xl p-8 text-center text-slate-400 border border-dashed border-slate-200">
                        <Cake size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Nenhum aniversariante encontrado para {currentDate.toLocaleString('pt-BR', { month: 'long' })}.</p>
                    </div>
                )}
            </div>

            {/* PARCEIROS */}
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Handshake size={24} /></div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase">Parceiros</h2>
                    </div>
                    <Link href="/parceiros" className="text-xs font-bold text-slate-500 hover:text-blue-600 uppercase transition-colors">Ver Todos</Link>
                </div>

                <div className="flex-1 flex items-center justify-center min-h-[200px]">
                    {shuffledPartners.length > 0 ? (
                        <PartnersAutoCarousel partners={shuffledPartners} />
                    ) : (
                        <div className="text-center text-slate-400 w-full py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                           <Handshake size={48} className="mx-auto mb-4 opacity-30" />
                           <p className="font-medium">Espaço reservado para sua empresa.</p>
                           <Link href="/contato" className="text-blue-600 text-sm font-bold mt-2 inline-block hover:underline">Seja um parceiro</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </section>

      {/* PROJETOS */}
      {projectPosts.length > 0 && (
        <section className="container mx-auto px-4 py-12 bg-white">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 border-l-4 border-green-600 pl-4">Projetos Polícia Militar Mirim</h2>
            <Link href="/projetos" className="text-green-600 font-semibold hover:text-green-700 flex items-center gap-2 group">Ver todos <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} /></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projectPosts.map((project) => (
              <Link key={project.id} href={`/projetos/${project.slug}`} className="group">
                <article className="bg-slate-50 rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full group-hover:-translate-y-1">
                  <div className="h-56 w-full relative bg-slate-200 overflow-hidden">
                    {project.coverImage ? (
                      <Image src={project.coverImage} alt={project.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-green-500 font-bold bg-green-50"><Award size={48} /></div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-green-600 transition line-clamp-2">{project.title}</h3>
                    <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-1 leading-relaxed">{project.summary}</p>
                    <span className="text-green-600 font-bold text-sm flex items-center gap-2 mt-auto">Conhecer projeto <ArrowRight size={16} /></span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA (CORRIGIDO: ShieldCheck IMPORTADO) */}
      <section className="relative py-32 bg-fixed bg-center bg-cover" style={{ backgroundImage: "url('/hero-bg-1.jpg')" }}>
         <div className="absolute inset-0 bg-blue-900/80 backdrop-blur-sm"></div>
         <div className="absolute top-0 left-0 w-full flex h-[6px] z-20">
            <div className="w-1/3 bg-yellow-400"></div><div className="w-1/3 bg-green-600"></div><div className="w-1/3 bg-white"></div>
         </div>
         <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center justify-center p-5 bg-white/5 backdrop-blur-md rounded-full mb-8 border border-white/20 shadow-2xl"><ShieldCheck size={56} className="text-yellow-400" /></div>
            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight uppercase tracking-tight text-white drop-shadow-lg">Faça Parte da <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">Polícia Militar Mirim</span></h2>
            <p className="text-blue-50 max-w-3xl mx-auto mb-12 text-lg md:text-xl leading-relaxed font-light">Educai as crianças para que não seja necessário punir os adultos. Junte-se a nós nessa missão transformadora.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 max-w-lg mx-auto">
                <Link href="/instituicao/historia" className="flex-1"><Button size="lg" className="w-full bg-yellow-500 text-blue-900 hover:bg-white hover:text-blue-900 font-black h-14 text-lg shadow-xl hover:shadow-yellow-500/20 transition-all border-0">Conheça nossa História</Button></Link>
                <Link href="/contato" className="flex-1"><Button size="lg" variant="outline" className="w-full bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white font-black h-14 text-lg backdrop-blur-sm">Fale Conosco</Button></Link>
            </div>
         </div>
      </section>

      {/* FEED DO INSTAGRAM*/}
      <InstagramFeed />

      {/* === SEÇÃO: PATROCINADORES === */}
      {sponsorBanners.length > 0 && (
        <section className="container mx-auto px-4 py-24 relative z-10">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 uppercase tracking-tight mb-4">
                  Nossos Patrocinadores
                </h2>
                <div className="w-16 h-1.5 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full mb-4"></div>
                <p className="text-slate-500 max-w-2xl mx-auto text-lg font-light">
                    Empresas que investem no futuro e na disciplina.
                </p>
            </div>
            <SponsorsCarousel sponsors={sponsorBanners} />
        </section>
      )}

    </main>
  );
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}