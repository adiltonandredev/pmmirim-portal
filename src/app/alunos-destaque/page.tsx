// src/app/alunos-destaque/page.tsx
import { prisma } from "@/lib/prisma"
import { Trophy, Quote, Star, Calendar, Medal } from "lucide-react"
import Image from "next/image"
import { PageHero } from "@/components/ui/page-hero"
import { BackButton } from "@/components/ui/back-button"

export const dynamic = "force-dynamic"

export const metadata = {
  title: 'Galeria de Honra - PMMirim',
  description: 'Conheça os alunos que fizeram história na Polícia Mirim.',
}

export default async function FeaturedStudentsGalleryPage() {
  const students = await prisma.featuredStudent.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' }
  })

  // CONFIGURAÇÃO PARA 4 BIMESTRES
  const periodLabels = [
    "1º Bimestre",
    "2º Bimestre",
    "3º Bimestre",
    "4º Bimestre"
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* 1. HERO PADRONIZADO (Tema Amarelo) */}
      <PageHero 
        title="Galeria de Honra"
        subtitle="O reconhecimento aos alunos que se destacaram pela disciplina, dedicação e excelência em cada bimestre."
        icon={Trophy}
        bgColor="bg-yellow-950"
        themeColor="yellow"
        bgImage="/bg/bg-honra.png"
      />

      {/* 2. GRID DE DESTAQUES */}
      <main className="flex-1 container mx-auto px-4 -mt-10 relative z-20 pb-20">
        
        {students.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {students.map((student) => (
                  <div key={student.id} className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col group h-full relative">
                      
                      {/* Badge Flutuante */}
                      <div className="absolute top-0 right-0 z-20">
                          <div className="bg-yellow-400 text-slate-900 text-[10px] font-black uppercase py-1 px-4 rounded-bl-xl shadow-md tracking-wider flex items-center gap-1">
                              <Star size={10} fill="currentColor" /> Destaque
                          </div>
                      </div>

                      {/* Foto do Aluno */}
                      <div className="relative h-72 w-full bg-slate-200 overflow-hidden">
                          {student.photoUrl ? (
                              <Image 
                                  src={student.photoUrl} 
                                  alt={student.studentName} 
                                  fill 
                                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                              />
                          ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-slate-300 bg-slate-100">
                                  <Trophy size={64} opacity={0.3} />
                              </div>
                          )}
                          
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-90"></div>

                          {/* Data (BIMESTRE) */}
                          <div className="absolute bottom-4 left-4 text-white z-10">
                              <div className="flex items-center gap-2 text-yellow-400 font-bold text-xs uppercase tracking-widest mb-1">
                                  <Calendar size={12} /> 
                                  {/* LÓGICA CORRIGIDA: Usa periodLabels em vez de monthNames */}
                                  {periodLabels[(student.month - 1)] || `${student.month}º Bimestre`} / {student.year}
                              </div>
                              <h3 className="text-2xl font-black leading-none drop-shadow-md text-white">
                                  {student.studentName}
                              </h3>
                          </div>
                      </div>
                      
                      {/* Conteúdo */}
                      <div className="p-6 md:p-8 flex flex-col flex-1 bg-white">
                          
                          <div className="flex items-start gap-3 mb-6">
                              <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600 shrink-0 mt-1">
                                  <Medal size={20} />
                              </div>
                              <div>
                                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                      Conquista Alcançada
                                  </span>
                                  <p className="text-slate-800 font-bold leading-tight">
                                      {student.achievement}
                                  </p>
                              </div>
                          </div>
                          
                          <div className="relative bg-slate-50 rounded-xl p-5 border border-slate-100 flex-1">
                              <Quote size={24} className="text-slate-200 absolute -top-3 -left-2 bg-white rounded-full p-1" />
                              <p className="text-slate-600 text-sm italic leading-relaxed text-justify">
                                  "{student.description || "Demonstrou conduta exemplar, liderança e espírito de corpo, servindo de inspiração para todo o batalhão."}"
                              </p>
                          </div>

                          {student.class && (
                              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end text-xs font-bold text-slate-400 uppercase tracking-wider">
                                  Turma {student.class}
                              </div>
                          )}
                      </div>
                  </div>
              ))}
          </div>
        ) : (
             <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm col-span-full">
                <div className="bg-yellow-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-500">
                   <Trophy size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Galeria Vazia</h3>
                <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                    Ainda não há alunos registrados na Galeria de Honra. Os destaques serão adicionados em breve.
                </p>
             </div>
        )}

        
        <BackButton className="mt-16" />
      </main>
    </div>
  )
}