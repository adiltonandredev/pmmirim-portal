"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { GraduationCap, Clock, ArrowRight, X, Info, BookOpen } from "lucide-react"
import Image from "next/image"

// Usando o mesmo padrão de tipagem flexível que você usou na página original
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Course = any;

interface CursosGridProps {
  courses: Course[]
}

export function CursosGrid({ courses }: CursosGridProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  return (
    <>
      {/* GRID DE CURSOS (MANTÉM O SEU VISUAL ORIGINAL) */}
      <div className="grid grid-cols-1 gap-8 max-w-6xl mx-auto"> 
        {courses.length > 0 ? (
          courses.map((course) => {
            // A sua lógica mágica para pegar a imagem certa
            const image = course.imageUrl || course.coverImage || course.image || course.cover || "";

            return (
              <div 
                key={course.id} 
                className="block group cursor-pointer" 
                onClick={() => setSelectedCourse({ ...course, parsedImage: image })}
              >
                <Card className="shadow-xl border-0 hover:shadow-2xl transition-all duration-300 bg-white flex flex-col md:flex-row p-6 md:p-8 gap-8 items-start overflow-hidden relative hover:-translate-y-1">
                  
                  {/* FOTO */}
                  <div className="w-full md:w-[35%] relative bg-slate-100 shrink-0 h-[280px] md:h-auto self-stretch rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                    {image ? (
                      <Image 
                        src={image} 
                        alt={course.title} 
                        fill 
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 400px"
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
                      {course.description || "Descrição não informada."}
                    </p>

                    <div className="mt-auto flex items-center font-bold text-green-700 uppercase tracking-wide text-sm group-hover:gap-2 transition-all">
                      Ver Detalhes do Curso <ArrowRight size={18} className="ml-2 text-green-500" />
                    </div>
                  </div>
                </Card>
              </div>
            )
          })
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-slate-300">
            <p className="text-slate-500">Nenhum curso disponível no momento.</p>
          </div>
        )}
      </div>

      {/* MODAL GIGANTE POR CIMA DE TUDO (TEMA VERDE PARA CURSOS) */}
      {selectedCourse && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200 flex flex-col">
            
            {/* Botão Fechar Fixo */}
            <button 
              onClick={() => setSelectedCourse(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 bg-white/50 backdrop-blur-md hover:bg-white hover:text-red-500 text-slate-700 rounded-full z-20 transition-all shadow-sm border border-white/20"
            >
              <X size={24} />
            </button>

            {/* Capa do Curso no Modal */}
            <div className="w-full h-48 md:h-64 relative bg-slate-100 shrink-0">
              {selectedCourse.parsedImage ? (
                <Image src={selectedCourse.parsedImage} alt={selectedCourse.title} fill className="object-cover object-center" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-green-950 text-white/20">
                  <GraduationCap size={80} />
                </div>
              )}
              {/* Overlay gradiente para dar contraste com o botão fechar e o texto */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40"></div>
              
              {/* Badges Flutuantes sobre a imagem */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3">
                 <span className="bg-green-500 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg">
                    Curso / Formação
                 </span>
                 {selectedCourse.duration && (
                    <span className="flex items-center gap-1.5 text-white/90 bg-black/40 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg border border-white/10">
                      <Clock size={14} /> {selectedCourse.duration}
                    </span>
                 )}
              </div>
            </div>

            {/* Conteúdo do Curso */}
            <div className="p-6 sm:p-10 flex-1">
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-8">
                {selectedCourse.title}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Coluna Larga: Descrição Completa */}
                <div className="md:col-span-2 space-y-4">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                    <BookOpen size={20} className="text-green-600" /> Sobre o Curso
                  </h2>
                  <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap text-justify">
                    {selectedCourse.description ? selectedCourse.description : "Nenhum detalhe adicional informado."}
                  </div>
                </div>

                {/* Coluna Estreita: Info Extra */}
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Info size={20} className="text-green-600" /> Informações
                  </h2>
                  <div className="bg-green-50/50 border border-green-100 rounded-2xl p-5 space-y-4">
                    <div>
                      <span className="block text-xs font-bold text-green-700 uppercase tracking-wide mb-1">Status</span>
                      <span className="text-slate-700 font-medium">Inscrições Abertas</span>
                    </div>
                    {selectedCourse.duration && (
                      <div>
                        <span className="block text-xs font-bold text-green-700 uppercase tracking-wide mb-1">Duração</span>
                        <span className="text-slate-700 font-medium">{selectedCourse.duration}</span>
                      </div>
                    )}
                    {/* Botão de Ação Falso (Pode adaptar depois) */}
                    <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-sm">
                      Tenho Interesse
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
          
          {/* Fundo clicável para fechar */}
          <div className="absolute inset-0 -z-10" onClick={() => setSelectedCourse(null)}></div>
        </div>
      )}
    </>
  )
}