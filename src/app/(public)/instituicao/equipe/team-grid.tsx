"use client"

import { useState } from "react"
import { User, Instagram, Mail, X, Briefcase, Tag, ExternalLink } from "lucide-react"
import Image from "next/image"

type TeamMember = {
  id: string
  name: string
  category: string
  image: string | null
  role: string
  bio: string | null
  instagram: string | null
  email: string | null
  order: number | null
}

interface TeamGridProps {
  teamMembers: TeamMember[]
}

const ORDERED_CATEGORIES = [
  "Coordenação",
  "Instrutores",
  "As Poderosas",
  "Conselho Fiscal",
  "Voluntários",
  "Outros",
]

function instagramHref(handle: string) {
  return `https://instagram.com/${handle.replace("@", "")}`
}

export function TeamGrid({ teamMembers }: TeamGridProps) {
  const [selected, setSelected] = useState<TeamMember | null>(null)

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-16">
        {ORDERED_CATEGORIES.map((category) => {
          const members = teamMembers.filter((m) => m.category === category)
          if (members.length === 0) return null

          return (
            <div key={category}>
              {/* Heading da categoria */}
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px bg-slate-200 flex-1" />
                <h2 className="text-xl font-black text-slate-700 uppercase tracking-widest px-2 flex items-center gap-2">
                  {category}
                  <span className="text-xs font-bold text-slate-400 normal-case tracking-normal">
                    ({members.length})
                  </span>
                </h2>
                <div className="h-px bg-slate-200 flex-1" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {members.map((member) => (
                  <article
                    key={member.id}
                    onClick={() => setSelected(member)}
                    className="group cursor-pointer bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col overflow-hidden"
                  >
                    {/* Foto */}
                    <div className="relative h-64 bg-slate-100 shrink-0 overflow-hidden">
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-200 bg-slate-50">
                          <User size={56} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-green-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {member.instagram && (
                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white">
                            <Instagram size={15} />
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Conteúdo */}
                    <div className="flex flex-col flex-1 p-5">
                      <span className="text-[10px] font-black uppercase text-green-700 bg-green-50 px-2.5 py-1 rounded-md border border-green-100 inline-block tracking-wider w-fit mb-3">
                        {member.role}
                      </span>

                      <h3 className="font-black text-slate-900 leading-snug mb-2 line-clamp-1 group-hover:text-green-700 transition-colors text-base">
                        {member.name}
                      </h3>

                      {member.bio && (
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 flex-1">
                          {member.bio}
                        </p>
                      )}

                      {(member.instagram || member.email) && (
                        <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100">
                          {member.instagram && (
                            <span
                              onClick={(e) => { e.stopPropagation(); window.open(instagramHref(member.instagram!), "_blank") }}
                              title="Instagram"
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors cursor-pointer border border-pink-100"
                            >
                              <Instagram size={14} />
                            </span>
                          )}
                          {member.email && (
                            <span
                              onClick={(e) => { e.stopPropagation(); window.open(`mailto:${member.email}`) }}
                              title="E-mail"
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-green-50 text-green-700 hover:bg-green-100 transition-colors cursor-pointer border border-green-100"
                            >
                              <Mail size={14} />
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── MODAL ── */}
      {selected && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header colorido */}
            <div className="relative h-32 bg-gradient-to-br from-green-900 to-green-700 rounded-t-3xl overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,white,transparent)]" />
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/25 text-white rounded-full z-10 transition-colors backdrop-blur-sm"
                aria-label="Fechar"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 sm:px-10 pb-8">
              {/* Foto + info */}
              <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-end -mt-16 mb-6">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-4 border-white shadow-xl bg-slate-100 overflow-hidden shrink-0 relative">
                  {selected.image ? (
                    <Image src={selected.image} alt={selected.name} fill className="object-cover object-top" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300"><User size={48} /></div>
                  )}
                </div>
                <div className="text-center sm:text-left pb-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-[11px] font-bold uppercase tracking-wider border border-green-100 mb-2">
                    <Tag size={11} /> {selected.category}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">{selected.name}</h2>
                  <p className="text-slate-500 font-medium flex items-center justify-center sm:justify-start gap-1.5 mt-1 text-sm">
                    <Briefcase size={15} className="text-slate-400 shrink-0" />
                    {selected.role}
                  </p>
                </div>
              </div>

              <hr className="border-slate-100 mb-6" />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-3">
                  <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                    <User size={16} className="text-green-600" /> Sobre
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm bg-slate-50 rounded-2xl p-5 border border-slate-100 whitespace-pre-wrap">
                    {selected.bio || "Nenhuma biografia informada."}
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                    <ExternalLink size={16} className="text-green-600" /> Redes & Contato
                  </h3>
                  <div className="space-y-2.5">
                    {selected.instagram && (
                      <a
                        href={instagramHref(selected.instagram)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 text-pink-700 hover:from-pink-100 hover:to-purple-100 transition-all group/link border border-pink-100"
                      >
                        <div className="w-9 h-9 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0 group-hover/link:scale-110 transition-transform">
                          <Instagram size={18} className="text-pink-600" />
                        </div>
                        <span className="font-semibold text-sm truncate">{selected.instagram}</span>
                      </a>
                    )}
                    {selected.email && (
                      <a
                        href={`mailto:${selected.email}`}
                        className="flex items-center gap-3 p-3.5 rounded-2xl bg-green-50 text-green-700 hover:bg-green-100 transition-all group/link border border-green-100"
                      >
                        <div className="w-9 h-9 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0 group-hover/link:scale-110 transition-transform">
                          <Mail size={18} className="text-green-700" />
                        </div>
                        <span className="font-semibold text-sm truncate">{selected.email}</span>
                      </a>
                    )}
                    {!selected.instagram && !selected.email && (
                      <p className="text-slate-400 text-sm italic p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                        Nenhum contato público disponível.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
