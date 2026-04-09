import { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/ui/page-hero";
import { BackButton } from "@/components/ui/back-button";
import { Cake, Calendar, User, PartyPopper, Star, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Aniversariantes | Polícia Mirim",
  description: "Galeria completa de aniversariantes da instituição.",
};

export const dynamic = "force-dynamic";

type BirthdayPerson = {
  id: string
  name: string
  role: string
  photoUrl: string | null
  day: number
  month: number
  source: "birthday" | "team"
}

const monthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
]

export default async function AniversariantesPage() {
  const today = new Date()
  const currentMonth = today.getUTCMonth() // 0-indexed
  const currentDay = today.getUTCDate()

  const [birthdayRecords, teamMembers] = await Promise.all([
    prisma.birthday.findMany({ where: { active: true } }),
    prisma.teamMember.findMany({
      where: { active: true, birthDate: { not: null } },
      select: { id: true, name: true, role: true, image: true, birthDate: true },
    }),
  ])

  // Converte Birthday records
  const fromBirthday: BirthdayPerson[] = birthdayRecords.map(b => {
    const d = new Date(b.date)
    return {
      id: `b-${b.id}`,
      name: b.name,
      role: (b as any).role || "Aluno",
      photoUrl: b.photoUrl,
      day: d.getUTCDate(),
      month: d.getUTCMonth(), // 0-indexed
      source: "birthday" as const,
    }
  })

  // Converte TeamMember records
  const fromTeam: BirthdayPerson[] = teamMembers.map(m => {
    const d = new Date(m.birthDate!)
    return {
      id: `t-${m.id}`,
      name: m.name,
      role: m.role,
      photoUrl: m.image,
      day: d.getUTCDate(),
      month: d.getUTCMonth(), // 0-indexed
      source: "team" as const,
    }
  })

  const allPeople = [...fromBirthday, ...fromTeam]

  // Agrupa por mês, filtrando dias passados no mês atual e meses passados
  const byMonth: Record<number, BirthdayPerson[]> = {}
  monthNames.forEach((_, i) => { byMonth[i] = [] })

  allPeople.forEach(p => {
    const isPastMonth = p.month < currentMonth
    const isCurrentMonthPastDay = p.month === currentMonth && p.day < currentDay
    if (isPastMonth || isCurrentMonthPastDay) return // oculta
    byMonth[p.month].push(p)
  })

  // Ordena cada mês por dia
  Object.keys(byMonth).forEach(key => {
    byMonth[parseInt(key)].sort((a, b) => a.day - b.day)
  })

  // Ordena os meses: mês atual primeiro, depois os próximos
  const sortedMonthIndices = [
    ...Array.from({ length: 12 }, (_, i) => i).slice(currentMonth),
    ...Array.from({ length: 12 }, (_, i) => i).slice(0, currentMonth),
  ]

  const hasAny = Object.values(byMonth).some(arr => arr.length > 0)

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <PageHero
        title="Aniversariantes"
        subtitle="Celebrando a vida dos nossos guerreiros, instrutores e colaboradores."
        icon={Cake}
        bgColor="bg-yellow-950"
        themeColor="yellow"
        bgImage="/bg/bg-aniversario.png"
      />

      <div className="flex-1 container mx-auto px-4 -mt-10 relative z-20 pb-24">

        {!hasAny ? (
          <div className="bg-white p-12 rounded-2xl shadow-lg text-center max-w-2xl mx-auto border border-slate-100">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Cake size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-600">Nenhum aniversariante</h3>
            <p className="text-slate-500 mt-2">A lista de aniversários está vazia no momento.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {sortedMonthIndices.map((monthIndex) => {
              const monthList = byMonth[monthIndex]
              if (!monthList || monthList.length === 0) return null
              const isCurrentMonth = monthIndex === currentMonth

              return (
                <div key={monthIndex} className="animate-in fade-in slide-in-from-bottom-4 duration-700">

                  {/* CABEÇALHO DO MÊS */}
                  <div className={`flex items-center gap-4 mb-8 p-4 rounded-xl border ${isCurrentMonth ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <div className={`p-2 rounded-lg ${isCurrentMonth ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-500'}`}>
                      <Calendar size={24} />
                    </div>
                    <h2 className={`text-2xl font-black uppercase tracking-tight ${isCurrentMonth ? 'text-yellow-800' : 'text-slate-700'}`}>
                      {monthNames[monthIndex]}
                    </h2>
                    {isCurrentMonth && (
                      <span className="ml-auto bg-yellow-400 text-yellow-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        <PartyPopper size={12} /> Mês Atual
                      </span>
                    )}
                    <span className="text-xs text-slate-400 font-semibold ml-auto">
                      {monthList.length} {monthList.length === 1 ? "aniversariante" : "aniversariantes"}
                    </span>
                  </div>

                  {/* GRID DE PESSOAS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {monthList.map((person) => {
                      const isToday = isCurrentMonth && person.day === currentDay

                      return (
                        <div
                          key={person.id}
                          className={`bg-white rounded-2xl overflow-hidden flex flex-col items-center text-center group transition-all duration-300 ${
                            isToday
                              ? 'shadow-2xl scale-[1.03] ring-4 ring-yellow-400 ring-offset-2 z-10'
                              : 'shadow-lg border border-slate-100 hover:-translate-y-2 hover:shadow-xl'
                          }`}
                        >
                          {/* BARRA TOPO */}
                          <div className={`h-2 w-full ${isToday ? 'bg-gradient-to-r from-yellow-400 via-pink-500 to-yellow-400' : 'bg-slate-100 group-hover:bg-yellow-400 transition-colors'}`} />

                          <div className="p-6 w-full flex flex-col items-center">
                            {/* FOTO */}
                            <div className="relative mb-4">
                              <div className={`w-24 h-24 rounded-full overflow-hidden border-4 ${isToday ? 'border-yellow-400' : 'border-slate-100 group-hover:border-yellow-200'} shadow-md relative transition-colors`}>
                                {person.photoUrl ? (
                                  <Image src={person.photoUrl} alt={person.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                                ) : (
                                  <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300">
                                    <User size={40} />
                                  </div>
                                )}
                              </div>
                              {isToday && (
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-yellow-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md whitespace-nowrap z-10 flex items-center gap-1 animate-bounce">
                                  <Star size={10} fill="white" /> É HOJE!
                                </div>
                              )}
                            </div>

                            {/* DATA */}
                            <div className="mb-2 mt-1">
                              <span className={`inline-block px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${isToday ? 'bg-yellow-100 text-yellow-800' : 'bg-slate-100 text-slate-500'}`}>
                                Dia {person.day}
                              </span>
                            </div>

                            {/* NOME */}
                            <h3 className="text-lg font-black text-slate-800 leading-tight mb-1 group-hover:text-yellow-600 transition-colors">
                              {person.name}
                            </h3>

                            {/* FUNÇÃO / TIPO */}
                            <div className="flex items-center gap-1.5 mt-1">
                              {person.source === "team" ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
                                  <Users size={10} /> {person.role}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
                                  {person.role}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <BackButton className="mt-16" />
    </main>
  )
}
