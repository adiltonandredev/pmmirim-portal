import { prisma } from "@/lib/prisma"
import { Card } from "@/components/ui/card"
import { Users, User, ArrowRight, Instagram, Mail } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { BackButton } from "@/components/ui/back-button"
import { PageHero } from "@/components/ui/page-hero"

export const dynamic = "force-dynamic"

const ORDERED_CATEGORIES = [
  "Coordenação",
  "Instrutores",
  "As Poderosas",
  "Conselho Fiscal",
  "Voluntários",
  "Outros"
];

export default async function EquipePage() {
  const allMembers = await prisma.teamMember.findMany({ orderBy: { order: 'asc' } })
  const teamMembers = allMembers.filter(m => !m.category.includes("Diretoria"));

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <PageHero 
        title="Nossa Equipe"
        subtitle="Quem faz acontecer."
        icon={Users}
        themeColor="green"
        bgColor="bg-green-950"
        bgImage="/bg/bg-equipe.png"
      />

      {/* PADRÃO RESTAURADO: -mt-10 para sobrepor o banner */}
      <section className="container mx-auto px-4 relative z-20 -mt-6 pb-20">
        
        {/* CONTAINER BRANCO ÚNICO: Cria o efeito de sobreposição limpo (igual Cursos) */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 mb-10 border border-slate-100">
            <div className="max-w-7xl mx-auto space-y-16"> 
                
                {ORDERED_CATEGORIES.map((category) => {
                    const membersInCategory = teamMembers.filter(m => m.category === category);
                    if (membersInCategory.length === 0) return null;

                    return (
                        <div key={category} className="block group">
                            {/* Cabeçalho da Categoria */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-px bg-slate-200 flex-1"></div>
                                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                                    {category}
                                </h2>
                                <div className="h-px bg-slate-200 flex-1"></div>
                            </div>

                            {/* Grid de Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                                {membersInCategory.map((member) => (
                                    
                                    // CARD MEMBER
                                    <Card key={member.id} className="p-0 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 bg-slate-50 flex flex-col overflow-hidden group rounded-2xl h-full hover:-translate-y-1">
                                        
                                        {/* FOTO: Altura fixa (h-64) */}
                                        <div className="w-full relative bg-slate-200 shrink-0 h-64 border-b border-slate-100">
                                            {member.image ? (
                                                <Image 
                                                    src={member.image} 
                                                    alt={member.name} 
                                                    fill 
                                                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-100">
                                                    <User size={64} opacity={0.3} />
                                                </div>
                                            )}
                                            {/* Overlay leve */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                        </div>

                                        {/* CONTEÚDO */}
                                        <div className="flex flex-col p-5 flex-grow">
                                            <div className="mb-3">
                                                <span className="text-[10px] font-black uppercase text-green-700 bg-white px-2.5 py-1 rounded-md border border-green-100 inline-block tracking-wider shadow-sm">
                                                    {member.role}
                                                </span>
                                            </div>
                                            
                                            <h3 className="text-xl font-black text-slate-900 leading-tight mb-3 line-clamp-2 group-hover:text-green-700 transition-colors">
                                                {member.name}
                                            </h3>
                                            
                                            {member.bio && (
                                                <p className="text-slate-500 text-xs line-clamp-4 leading-relaxed flex-grow">
                                                    {member.bio}
                                                </p>
                                            )}

                                            {/* Rodapé de Contatos */}
                                            {(member.instagram || member.email) && (
                                                <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-start gap-4 text-slate-400">
                                                    {member.instagram && (
                                                        <Link href={`https://instagram.com/${member.instagram.replace('@', '')}`} target="_blank" className="hover:text-pink-600 hover:bg-white hover:shadow-sm transition-all p-2 rounded-full group/icon" title={member.instagram}>
                                                            <Instagram size={18} className="group-hover/icon:scale-110 transition-transform"/>
                                                        </Link>
                                                    )}
                                                    {member.email && (
                                                        <div className="hover:text-blue-600 hover:bg-white hover:shadow-sm transition-all p-2 rounded-full cursor-help group/icon" title={member.email}>
                                                            <Mail size={18} className="group-hover/icon:scale-110 transition-transform"/>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
        
        <BackButton className="mt-8" />
      </section>
    </main>
  )
}