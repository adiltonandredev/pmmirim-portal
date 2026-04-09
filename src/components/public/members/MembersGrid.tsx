"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { User, ArrowRight, Instagram, Mail, X, Briefcase, Tag, Cake } from "lucide-react"
import Image from "next/image"

type Member = {
  id: string
  name: string
  category: string
  image: string | null
  role: string
  bio: string | null
  instagram: string | null
  email: string | null
  order: number
  birthDate?: Date | null
}

interface MembersGridProps {
  members: Member[]
}

function formatBirthDate(date: Date | null | undefined) {
  if (!date) return null
  return new Date(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })
}

export function MembersGrid({ members }: MembersGridProps) {
  const [selected, setSelected] = useState<Member | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {members.map((member) => (
          <Card
            key={member.id}
            className="relative p-0 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 bg-slate-50 flex flex-col overflow-hidden rounded-2xl h-full hover:-translate-y-1 cursor-pointer"
            onClick={() => setSelected(member)}
          >
            <div className="w-full relative bg-slate-200 shrink-0 h-64 border-b border-slate-100 group">
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>

            <div className="flex flex-col p-5 flex-grow">
              <div className="mb-3">
                <span className="text-[10px] font-black uppercase text-blue-700 bg-white px-2.5 py-1 rounded-md border border-blue-100 inline-block tracking-wider shadow-sm">
                  {member.role}
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 leading-tight mb-1 line-clamp-2 group-hover:text-blue-700 transition-colors">
                {member.name}
                <ArrowRight size={18} className="inline-block ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-600" />
              </h3>
              {member.birthDate && (
                <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                  <Cake size={11} /> {formatBirthDate(member.birthDate)}
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* MODAL DETALHE */}
      {selected && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 bg-slate-100 hover:bg-slate-200 hover:text-red-500 text-slate-500 rounded-full z-10 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="p-6 sm:p-10">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start text-center md:text-left mb-8">
                <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl border-4 border-slate-50 shadow-md bg-slate-100 overflow-hidden shrink-0 relative mt-4 md:mt-0">
                  {selected.image ? (
                    <Image src={selected.image} alt={selected.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300"><User size={64} /></div>
                  )}
                </div>

                <div className="flex-1 space-y-3 md:pt-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-100">
                    <Tag size={12} /> {selected.category}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">{selected.name}</h1>
                  <p className="text-lg text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2">
                    <Briefcase size={18} className="text-slate-400" /> {selected.role}
                  </p>
                  {selected.birthDate && (
                    <p className="text-sm text-slate-400 flex items-center justify-center md:justify-start gap-1.5">
                      <Cake size={15} className="text-pink-400" />
                      Aniversário: {formatBirthDate(selected.birthDate)}
                    </p>
                  )}
                </div>
              </div>

              <hr className="border-slate-100 mb-8" />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-4">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <User size={20} className="text-blue-600" /> Sobre
                  </h2>
                  <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap text-justify bg-slate-50/50 p-6 rounded-2xl border border-slate-50">
                    {selected.bio || "Nenhuma biografia detalhada foi informada."}
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Mail size={20} className="text-blue-600" /> Contato
                  </h2>
                  <div className="space-y-3">
                    {selected.instagram && (
                      <a href={`https://instagram.com/${selected.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-2xl bg-pink-50 text-pink-700 hover:bg-pink-100 transition-colors group border border-pink-100">
                        <div className="bg-white p-2 rounded-xl shadow-sm group-hover:scale-110 transition-transform shrink-0"><Instagram size={20} /></div>
                        <span className="font-medium text-sm truncate">{selected.instagram}</span>
                      </a>
                    )}
                    {selected.email && (
                      <a href={`mailto:${selected.email}`} className="flex items-center gap-3 p-4 rounded-2xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors group border border-blue-100">
                        <div className="bg-white p-2 rounded-xl shadow-sm group-hover:scale-110 transition-transform shrink-0"><Mail size={20} /></div>
                        <span className="font-medium text-sm truncate">{selected.email}</span>
                      </a>
                    )}
                    {!selected.instagram && !selected.email && (
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                        <p className="text-slate-400 text-sm italic">Nenhum contato público disponível.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 -z-10" onClick={() => setSelected(null)} />
        </div>
      )}
    </>
  )
}
