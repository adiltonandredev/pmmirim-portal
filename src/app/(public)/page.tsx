// src/app/page.tsx
import { HeroCarousel } from "@/components/public/home/HeroCarousel";
import { FloatingSocial } from "@/components/layout/FloatingSocial";
import { FeaturedStudentSection } from "@/components/public/home/FeaturedStudentSection";
import { InstagramFeed } from "@/components/public/home/InstagramFeed";
import { PartnersAutoCarousel } from "@/components/public/home/PartnersAutoCarousel";
import { SponsorsCarousel } from "@/components/public/home/SponsorsCarousel";
import { InfoCards } from "@/components/public/home/InfoCards"; // <--- NOVO COMPONENTE
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
  // Usar UTC em tudo para coincidir com como o Prisma armazena datas (midnight UTC)
  const currentMonth = currentDate.getUTCMonth() + 1;
  const currentDay = currentDate.getUTCDate();

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
    nextEvent,         // 10
    latestNewsCard,    // 11
    institutionData,   // 12
    teamBirthdays,     // 13
  ] = await Promise.all([
    // 1. Posts Gerais — apenas notícias (exclui projetos para evitar duplicação)
    prisma.post.findMany({
      where: { published: true, type: "NEWS" },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
    // 2. Projetos em destaque — apenas os marcados como featured
    prisma.post.findMany({
      where: { published: true, type: "PROJECT", featured: true },
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

    // 7. Aniversariantes (tabela Birthday)
    prisma.birthday.findMany({
      where: { active: true },
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
    prisma.institutionHistory.findFirst(),

    // 13. Membros da equipe com aniversário cadastrado
    prisma.teamMember.findMany({
      where: { active: true, birthDate: { not: null } },
      select: { id: true, name: true, role: true, image: true, birthDate: true },
    }),
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

  // === LÓGICA DE ANIVERSARIANTES — próximos 7 dias (inclui hoje) ===
  // Gera os 7 próximos dias como pares {month, day}
  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(currentDate)
    d.setUTCDate(d.getUTCDate() + i)
    return { month: d.getUTCMonth() + 1, day: d.getUTCDate() }
  })
  const isInNext7Days = (month: number, day: number) =>
    next7Days.some(d => d.month === month && d.day === day)

  // Tipo unificado
  type BirthdayPerson = {
    id: string; name: string; role: string;
    photoUrl: string | null; day: number; month: number;
    isToday: boolean; source: "birthday" | "team"
  }

  const allBirthdayPeople: BirthdayPerson[] = [
    // Da tabela Birthday (alunos / cadastros manuais)
    ...birthdays
      .filter(b => { const d = new Date(b.date); return isInNext7Days(d.getUTCMonth() + 1, d.getUTCDate()) })
      .map(b => {
        const d = new Date(b.date)
        const day = d.getUTCDate(); const month = d.getUTCMonth() + 1
        return { id: b.id, name: b.name, role: (b as any).role || "Aluno", photoUrl: b.photoUrl, day, month, isToday: day === currentDay && month === currentMonth, source: "birthday" as const }
      }),
    // Da tabela TeamMember (equipe com birthDate)
    ...teamBirthdays
      .filter(m => { const d = new Date(m.birthDate!); return isInNext7Days(d.getUTCMonth() + 1, d.getUTCDate()) })
      .map(m => {
        const d = new Date(m.birthDate!)
        const day = d.getUTCDate(); const month = d.getUTCMonth() + 1
        return { id: m.id, name: m.name, role: m.role, photoUrl: m.image, day, month, isToday: day === currentDay && month === currentMonth, source: "team" as const }
      }),
  ]
  // Ordena: hoje primeiro, depois por dia
  allBirthdayPeople.sort((a, b) => {
    if (a.isToday && !b.isToday) return -1
    if (!a.isToday && b.isToday) return 1
    return a.day - b.day
  })

  const displayBirthdays = allBirthdayPeople.slice(0, 6)
  const hasMore = allBirthdayPeople.length > 6

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
      <InfoCards nextEvent={nextEvent} latestNews={latestNewsCard} missionText={institutionData?.mission} />

      {/* ── NOTÍCIAS RECENTES ── */}
      {latestPosts.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">Em destaque</p>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 border-l-[5px] border-blue-600 pl-4 uppercase leading-tight">
                Aconteceu na Polícia Militar Mirim
              </h2>
            </div>
            <Link href="/noticias" className="shrink-0 inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 group text-sm uppercase tracking-wide">
              Ver todas <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <Link key={post.id} href={`/noticias/${post.slug}`} className="group h-full">
                <article className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full group-hover:-translate-y-1.5">
                  <div className="h-48 w-full relative bg-slate-200 overflow-hidden">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-300 bg-slate-100">
                        <Newspaper size={44} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md tracking-wider">
                      {post.type === "NEWS" ? "Notícia" : post.type === "EVENT" ? "Evento" : "Projeto"}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="text-[11px] text-slate-400 mb-2 flex items-center gap-1.5 font-bold uppercase tracking-wide">
                      <CalendarDays size={12} />
                      {new Date(post.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    <span className="inline-flex items-center text-blue-600 font-bold text-xs gap-1 mt-auto uppercase tracking-wide group-hover:gap-2 transition-all">
                      Ler matéria <ArrowRight size={12} />
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ALUNO DESTAQUE */}
      {featuredStudent && (
        <section className="w-full border-t border-b border-yellow-200">
          <FeaturedStudentSection student={featuredStudent} />
        </section>
      )}

      {/* ── ANIVERSARIANTES E PARCEIROS ── */}
      <section className="container mx-auto px-4 py-16">
        <div className={`grid grid-cols-1 gap-12 ${displayBirthdays.length > 0 ? 'lg:grid-cols-2' : ''}`}>

          {/* ANIVERSARIANTES (SÓ APARECE SE TIVER ALGUM) */}
          {displayBirthdays.length > 0 && (
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
                <div className="p-2 bg-pink-100 rounded-lg text-pink-600"><Cake size={24} /></div>
                <h2 className="text-xl font-black text-slate-900 uppercase border-l-[5px] border-pink-400 pl-3">Aniversariantes da Semana</h2>
              </div>

              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {displayBirthdays.map((b) => (
                    <div key={`${b.source}-${b.id}`} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${b.isToday ? 'bg-gradient-to-br from-pink-50 to-yellow-50 border-pink-300 shadow-lg ring-2 ring-yellow-300' : 'bg-white border-slate-100 shadow-sm hover:shadow-md'}`}>
                      <div className={`relative w-16 h-16 shrink-0 rounded-full overflow-hidden border-2 ${b.isToday ? 'border-pink-400' : 'border-slate-200'} bg-slate-100`}>
                        {b.photoUrl ? (
                          <Image src={b.photoUrl} alt={b.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400"><User size={24} /></div>
                        )}
                        {b.isToday && (
                          <div className="absolute inset-0 rounded-full ring-4 ring-yellow-400 ring-offset-1 pointer-events-none" />
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-center min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          {b.isToday ? (
                            <span className="text-[11px] bg-gradient-to-r from-pink-500 to-yellow-500 text-white px-2 py-0.5 rounded-full font-black uppercase animate-pulse flex items-center gap-1">🎂 Hoje!</span>
                          ) : (
                            <span className="text-xs font-bold text-slate-400">Dia {b.day}</span>
                          )}
                        </div>
                        <h4 className={`font-black text-base leading-tight break-words ${b.isToday ? 'text-pink-800' : 'text-slate-900'}`}>{b.name}</h4>
                        <span className={`text-[11px] font-bold uppercase tracking-wide mt-0.5 ${b.isToday ? 'text-pink-500' : 'text-slate-400'}`}>{b.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {hasMore && (
                  <Link href="/instituicao/aniversariantes" className="mt-2">
                    <Button variant="outline" className="w-full border-pink-200 text-pink-600 hover:bg-pink-50 hover:text-pink-700 font-bold">
                      <List className="mr-2" size={16} /> Ver todos os aniversariantes
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* PARCEIROS */}
          <div className={`flex flex-col h-full ${displayBirthdays.length === 0 ? 'max-w-4xl mx-auto w-full' : ''}`}>
            <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Handshake size={24} /></div>
                <h2 className="text-xl font-black text-slate-900 uppercase border-l-[5px] border-blue-600 pl-3">Parceiros</h2>
              </div>
              <Link href="/parceiros" className="text-xs font-bold text-slate-500 hover:text-blue-600 uppercase transition-colors flex items-center gap-1 group">
                Ver Todos <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
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

      {/* ── PROJETOS ── */}
      {projectPosts.length > 0 && (
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
              <div>
                <p className="text-xs font-black text-green-600 uppercase tracking-widest mb-1">Impacto social</p>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 border-l-[5px] border-green-600 pl-4 uppercase leading-tight">
                  Projetos Polícia Militar Mirim
                </h2>
              </div>
              <Link href="/projetos" className="shrink-0 inline-flex items-center gap-2 text-green-600 font-bold hover:text-green-800 group text-sm uppercase tracking-wide">
                Ver todos <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {projectPosts.map((project) => (
                <Link key={project.id} href={`/projetos/${project.slug}`} className="group h-full">
                  <article className="bg-slate-50 rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full group-hover:-translate-y-1.5">
                    <div className="h-52 w-full relative bg-slate-200 overflow-hidden">
                      {project.coverImage ? (
                        <Image
                          src={project.coverImage}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-green-400 bg-green-50">
                          <Award size={44} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2 leading-snug">
                        {project.title}
                      </h3>
                      <p className="text-slate-500 text-sm line-clamp-3 mb-4 flex-1 leading-relaxed">{project.summary}</p>
                      <span className="inline-flex items-center text-green-600 font-bold text-xs gap-1 mt-auto uppercase tracking-wide group-hover:gap-2 transition-all">
                        Conhecer projeto <ArrowRight size={12} />
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
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

      {/* ── PATROCINADORES ── */}
      {sponsorBanners.length > 0 && (
        <section className="bg-slate-50 py-16 border-t border-slate-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-xs font-black text-yellow-600 uppercase tracking-widest mb-2">Quem acredita</p>
              <h2 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight mb-4">
                Nossos Patrocinadores
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full" />
              <p className="text-slate-500 max-w-xl mx-auto mt-4 text-sm font-light leading-relaxed">
                Empresas que acreditam e investem no futuro dos nossos jovens.
              </p>
            </div>
            <SponsorsCarousel sponsors={sponsorBanners} />
          </div>
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