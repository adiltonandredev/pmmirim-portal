/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { PageHero } from "@/components/ui/page-hero"
import { BackButton } from "@/components/ui/back-button"
import { GraduationCap, Clock, ArrowRight } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function CursosPage() {
  const coursesRaw = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <PageHero 
        title="Cursos & Formação"
        subtitle="Atividades educacionais, treinamentos e oficinas oferecidos pela Polícia Mirim."
        icon={GraduationCap}
        themeColor="green"
        bgColor="bg-green-950"
        bgImage="/bg/bg-cursos.png"
      />

      <section className="container mx-auto px-4 relative z-20 -mt-6 pb-20">
        <div className="grid grid-cols-1 gap-8 max-w-6xl mx-auto"> 
            
            {coursesRaw.length > 0 ? (
                coursesRaw.map((c) => {
                    // --- VACINA: Convertendo para 'any' ---
                    const course = c as any;

                    // --- A CORREÇÃO MÁGICA ---
                    // Adicionei isso aqui. Ele tenta achar a imagem em qualquer lugar.
                    const image = course.imageUrl || course.coverImage || course.image || course.cover || "";

                    return (
                        <Link key={course.id} href={`/cursos/${course.slug || course.id}`} className="block group">
                            <Card className="shadow-xl border-0 hover:shadow-2xl transition-all duration-300 bg-white flex flex-col md:flex-row p-6 md:p-8 gap-8 items-start overflow-hidden relative">
                                
                                {/* FOTO */}
                                <div className="w-full md:w-[35%] relative bg-slate-100 shrink-0 h-[280px] md:h-auto self-stretch rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                                    {/* Aqui usamos a variável 'image' que criamos acima */}
                                    {image ? (
                                        <Image 
                                            src={image} 
                                            alt={course.title} 
                                            fill 
                                            className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-300">
                                            <GraduationCap size={64} opacity={0.3} />
                                        </div>
                                    )}
                                </div>

                                {/* CONTEÚDO */}
                                <div className="flex-1 flex flex-col justify-center py-2">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                                            Inscrições Abertas
                                        </span>
                                        {course.duration && (
                                            <span className="flex items-center gap-1.5 text-slate-500 text-xs font-bold uppercase tracking-wide">
                                                <Clock size={14} className="text-green-500" /> {course.duration}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-4 leading-tight group-hover:text-green-700 transition-colors">
                                            {course.title}
                                    </h3>

                                    <p className="text-slate-600 leading-relaxed mb-8 line-clamp-3 text-justify">
                                            {course.description}
                                    </p>

                                    <div className="mt-auto flex items-center font-bold text-green-700 uppercase tracking-wide text-sm group-hover:gap-2 transition-all">
                                            Ver Detalhes <ArrowRight size={18} className="ml-2 text-green-500" />
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    )
                })
            ) : (
                <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-slate-300">
                    <p className="text-slate-500">Nenhum curso disponível no momento.</p>
                </div>
            )}
        </div>
        
        <BackButton className="mt-16" />
      </section>
    </main>
  )
}