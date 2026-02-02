import { prisma } from "@/lib/prisma"
import { Card } from "@/components/ui/card"
import { UserCog, User, ArrowRight } from "lucide-react"
import Image from "next/image"
import { BackButton } from "@/components/ui/back-button"
import { PageHero } from "@/components/ui/page-hero"

export const dynamic = "force-dynamic"

export default async function DiretoriaPage() {
  const allMembers = await prisma.teamMember.findMany({
    orderBy: { order: 'asc' }
  })
  const boardMembers = allMembers.filter(m => m.category.includes("Diretoria"));

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <PageHero 
        title="Diretoria Executiva"
        subtitle="Liderança estratégica e administrativa responsável pela gestão da instituição."
        icon={UserCog}
        themeColor="blue"
        bgColor="bg-blue-950"
        bgImage="/bg/bg-diretoria.png"
      />

      <section className="container mx-auto px-4 relative z-20 -mt-6 pb-20">
        <div className="grid grid-cols-1 gap-8 max-w-5xl mx-auto">

            {boardMembers.length > 0 ? (
                boardMembers.map((member) => (
                    <div key={member.id} className="block group">
                        <Card className="shadow-xl border-0 hover:shadow-2xl transition-all duration-300 bg-white flex flex-col md:flex-row min-h-[300px] p-4 gap-6 items-start">

                            <div className="w-full md:w-[280px] h-[350px] md:h-full min-h-[300px] relative bg-slate-100 shrink-0 rounded-xl overflow-hidden shadow-sm">
                                {member.image ? (
                                    <Image 
                                        src={member.image} 
                                        alt={member.name} 
                                        fill 
                                        className="object-cover object-top group-hover:scale-105 transition-transform duration-700" 
                                        sizes="(max-width: 768px) 100vw, 280px"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                                        <User size={64} opacity={0.2} className="mb-4"/>
                                        <span className="text-sm font-bold opacity-60">Sem foto</span>
                                    </div>
                                )}
                            </div>

                            {/* CONTEÚDO */}
                            <div className="flex-1 py-4 pr-4 flex flex-col justify-center">
                                <div className="mb-6">
                                    <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-wider border border-blue-100 mb-4">
                                        {member.role}
                                    </span>
                                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight group-hover:text-blue-800 transition-colors">
                                        {member.name}
                                    </h2>
                                    <p className="text-sm text-slate-400 font-bold uppercase mt-1 tracking-wide">{member.category}</p>
                                </div>
                                
                                <p className="text-slate-600 text-lg leading-relaxed mb-6">
                                    {member.bio || "Biografia não informada."}
                                </p>
                                
                                {(member.instagram || member.email) && (
                                    <div className="mt-auto pt-6 border-t border-slate-100 flex flex-wrap gap-4 text-sm">
                                        {member.instagram && (
                                            <span className="flex items-center gap-2 font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-md hover:bg-blue-100 transition-colors">
                                                📸 {member.instagram}
                                            </span>
                                        )}
                                        {member.email && (
                                            <span className="flex items-center gap-2 text-slate-500 bg-slate-50 px-3 py-1 rounded-md">
                                                ✉️ {member.email}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                ))
            ) : (
                <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                    <p>Nenhum membro encontrado.</p>
                </div>
            )}
        </div>
        
        <BackButton className="mt-16" />
      </section>
    </main>
  )
}