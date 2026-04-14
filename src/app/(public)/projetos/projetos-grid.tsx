"use client"

import { useState } from "react"
import { X, Award, Target, Users, ArrowRight, Lightbulb } from "lucide-react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Post } from "@prisma/client"

interface ProjetosGridProps {
  projects: Post[]
}

export function ProjetosGrid({ projects }: ProjetosGridProps) {
  const [selected, setSelected] = useState<Post | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {projects.map((project) => {
          const bgImage = project.coverImage || ""

          return (
            <article
              key={project.id}
              onClick={() => setSelected(project)}
              className="group cursor-pointer h-full"
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden bg-white flex flex-col rounded-2xl">
                <div className="relative h-60 overflow-hidden bg-slate-200">
                  {bgImage ? (
                    <Image
                      src={bgImage}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-emerald-400 bg-emerald-50">
                      <Award size={48} opacity={0.5} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-emerald-700 text-[10px] font-black px-3 py-1.5 rounded-md shadow-lg uppercase tracking-wider border border-white/50">
                    Projeto
                  </div>
                </div>

                <CardContent className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 mb-3 leading-tight">
                    {project.title}
                  </h3>
                  <p className="text-slate-600 text-sm line-clamp-3 mb-6 leading-relaxed text-justify flex-1">
                    {project.summary}
                  </p>
                  <div className="mt-auto pt-4 border-t border-slate-100">
                    <span className="text-emerald-600 font-bold text-xs uppercase tracking-wide flex items-center gap-2 group-hover:gap-3 transition-all">
                      Saiba mais <ArrowRight size={14} />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </article>
          )
        })}
      </div>

      {/* MODAL */}
      {selected && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão fechar */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white text-slate-500 hover:text-red-500 rounded-full shadow-md transition-colors"
            >
              <X size={22} />
            </button>

            {/* Capa */}
            {selected.coverImage && (
              <div className="relative w-full h-52 sm:h-64 rounded-t-3xl overflow-hidden bg-slate-200">
                <Image
                  src={selected.coverImage}
                  alt={selected.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-transparent to-transparent" />
              </div>
            )}

            <div className="p-6 sm:p-8 space-y-6">
              {/* Título */}
              <div className="text-center">
                <span className="inline-block bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-100 mb-3">
                  Projeto Social
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                  {selected.title}
                </h2>
                {selected.summary && (
                  <p className="text-slate-500 mt-2 text-sm leading-relaxed max-w-xl mx-auto">
                    {selected.summary}
                  </p>
                )}
              </div>

              {/* Cards Objetivo / Público / Impacto */}
              {(selected.objective || selected.targetAudience || selected.impact) && (
                <div className={`grid gap-4 ${
                  [selected.objective, selected.targetAudience, selected.impact].filter(Boolean).length === 1
                    ? "grid-cols-1 max-w-sm mx-auto"
                    : [selected.objective, selected.targetAudience, selected.impact].filter(Boolean).length === 2
                    ? "grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-1 sm:grid-cols-3"
                }`}>
                  {selected.objective && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2 text-emerald-700 font-bold text-sm">
                        <Target size={16} /> Objetivo
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{selected.objective}</p>
                    </div>
                  )}
                  {selected.targetAudience && (
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2 text-blue-700 font-bold text-sm">
                        <Users size={16} /> Público
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{selected.targetAudience}</p>
                    </div>
                  )}
                  {selected.impact && (
                    <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2 text-yellow-700 font-bold text-sm">
                        <Award size={16} /> Impacto
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{selected.impact}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Conteúdo completo */}
              {selected.content && (
                <div
                  className="prose prose-sm sm:prose-base prose-slate max-w-none
                    prose-headings:text-slate-900 prose-headings:font-bold
                    prose-p:text-slate-600 prose-p:leading-relaxed prose-p:text-justify
                    prose-a:text-emerald-600 prose-img:rounded-xl prose-img:shadow-md
                    prose-strong:text-slate-900
                    bg-slate-50 rounded-2xl p-5 border border-slate-100"
                  dangerouslySetInnerHTML={{ __html: selected.content }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
