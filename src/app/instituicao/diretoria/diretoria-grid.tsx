"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { User, ArrowRight, Instagram, Mail, X, Briefcase, Tag } from "lucide-react"
import Image from "next/image"

type TeamMember = {
  id: string;
  name: string;
  category: string;
  image: string | null;
  role: string;
  bio: string | null;
  instagram: string | null;
  email: string | null;
  order: number | null;
}

interface DiretoriaGridProps {
  boardMembers: TeamMember[]
}

export function DiretoriaGrid({ boardMembers }: DiretoriaGridProps) {
  // Estado que controla o Modal
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  return (
    <>
      {/* GRID DA DIRETORIA (HORIZONTAL) */}
      <div className="grid grid-cols-1 gap-8 max-w-5xl mx-auto">
        {boardMembers.length > 0 ? (
          boardMembers.map((member) => (
            <div key={member.id} className="block group cursor-pointer" onClick={() => setSelectedMember(member)}>
              <Card className="shadow-xl border-0 hover:shadow-2xl transition-all duration-300 bg-white flex flex-col md:flex-row min-h-[300px] p-4 gap-6 items-start relative hover:-translate-y-1">
                
                {/* Imagem do Card */}
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

                {/* CONTEÚDO DO CARD */}
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
                  
                  {/* Bio cortada para incentivar o clique */}
                  <p className="text-slate-600 text-lg leading-relaxed mb-6 line-clamp-3">
                    {member.bio || "Biografia não informada."}
                  </p>
                  
                  {/* Botão sutil para indicar o clique */}
                  <div className="mt-auto pt-6 border-t border-slate-100 flex items-center gap-2 text-blue-600 font-bold group-hover:translate-x-2 transition-transform">
                    <span>Ver perfil completo</span>
                    <ArrowRight size={18} />
                  </div>
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

      {/* MODAL GIGANTE POR CIMA DE TUDO (TEMA AZUL) */}
      {selectedMember && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 bg-slate-100 hover:bg-slate-200 hover:text-red-500 text-slate-500 rounded-full z-10 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="p-6 sm:p-10">
              
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start text-center md:text-left mb-8">
                <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl border-4 border-slate-50 shadow-md bg-slate-100 overflow-hidden shrink-0 relative mt-4 md:mt-0">
                  {selectedMember.image ? (
                    <Image src={selectedMember.image} alt={selectedMember.name} fill className="object-cover object-top" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <User size={64} />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-3 md:pt-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-100">
                    <Tag size={12} /> {selectedMember.category}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                    {selectedMember.name}
                  </h1>
                  <p className="text-lg text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2">
                    <Briefcase size={18} className="text-slate-400" /> {selectedMember.role}
                  </p>
                </div>
              </div>

              <hr className="border-slate-100 mb-8" />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-4">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <User size={20} className="text-blue-600" /> Sobre
                  </h2>
                  <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap text-justify bg-slate-50/50 p-6 rounded-2xl border border-slate-50">
                    {selectedMember.bio ? selectedMember.bio : "Nenhuma biografia detalhada foi informada."}
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Mail size={20} className="text-blue-600" /> Contato
                  </h2>
                  <div className="space-y-3">
                    {selectedMember.instagram && (
                      <a href={`https://instagram.com/${selectedMember.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-2xl bg-pink-50 text-pink-700 hover:bg-pink-100 transition-colors group border border-pink-100">
                        <div className="bg-white p-2 rounded-xl shadow-sm group-hover:scale-110 transition-transform shrink-0"><Instagram size={20} /></div>
                        <span className="font-medium text-sm truncate">{selectedMember.instagram}</span>
                      </a>
                    )}
                    {selectedMember.email && (
                      <a href={`mailto:${selectedMember.email}`} className="flex items-center gap-3 p-4 rounded-2xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors group border border-blue-100">
                        <div className="bg-white p-2 rounded-xl shadow-sm group-hover:scale-110 transition-transform shrink-0"><Mail size={20} /></div>
                        <span className="font-medium text-sm truncate" title={selectedMember.email}>{selectedMember.email}</span>
                      </a>
                    )}
                    {!selectedMember.instagram && !selectedMember.email && (
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                        <p className="text-slate-400 text-sm italic">Nenhum contato público disponível.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
          
          <div className="absolute inset-0 -z-10" onClick={() => setSelectedMember(null)}></div>
        </div>
      )}
    </>
  )
}