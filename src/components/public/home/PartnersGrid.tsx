"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Handshake, ExternalLink, X, Maximize2, Globe } from "lucide-react"

/* eslint-disable @typescript-eslint/no-explicit-any */
interface PartnersGridProps {
  partners: any[]
}

export function PartnersGrid({ partners }: PartnersGridProps) {
  const [selected, setSelected] = useState<any>(null)

  return (
    <>
      {/* --- GRID DE CARDS (Mantido igual) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {partners.map((partner) => {
          const image = partner.imageUrl || partner.desktopImage || partner.mobileImage || partner.image || partner.coverUrl || partner.url || "";
          const name = partner.title || partner.name || "Parceiro";

          return (
            <div 
              key={partner.id} 
              onClick={() => setSelected(partner)}
              className="relative aspect-video rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 bg-slate-900 border border-slate-800"
            >
              {image && (
                <Image src={image} alt="Blur" fill className="object-cover opacity-50 blur-xl scale-110 z-0" />
              )}
              {image ? (
                <div className="absolute inset-0 z-10 p-2">
                    <Image src={image} alt={name} fill className="object-contain transition-transform duration-500 group-hover:scale-[1.02]" />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center z-10"><Handshake size={48} className="text-slate-500" /></div>
              )}
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 z-20 transition-opacity"></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-end z-30">
                <div className="absolute top-3 right-3 text-white opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                  <div className="bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10"><Maximize2 size={18} /></div>
                </div>
                <h3 className="font-bold text-white text-xl drop-shadow-md line-clamp-1 leading-tight transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{name}</h3>
                <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 overflow-hidden transition-all duration-500 ease-out">
                    <p className="text-blue-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2 pt-2">Ver Detalhes <ExternalLink size={12}/></p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* --- MODAL (JANELA POP-UP) --- */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelected(null)}>
          
          <div 
            // Aumentamos o modal para max-w-7xl para caber o banner wide bem grande
            className="bg-white rounded-2xl shadow-2xl w-full overflow-hidden relative animate-in zoom-in-95 duration-300 flex flex-col md:flex-row h-[85vh]"
            onClick={(e) => e.stopPropagation()} 
          >
            <button 
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors backdrop-blur-md border border-white/20 group shadow-xl"
            >
              <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* --- LADO ESQUERDO: ÁREA DA IMAGEM (75% DA TELA) --- */}
            {/* 'md:w-3/4' dá muito mais espaço para o banner esticar */}
            <div className="w-full md:w-3/4 bg-black relative flex items-center justify-center overflow-hidden h-[40vh] md:h-full">
                 {(selected.imageUrl || selected.desktopImage || selected.mobileImage || selected.image || selected.url) ? (
                      <>
                        {/* 1. Fundo Desfocado (Preenche TUDO) */}
                        <Image 
                          src={selected.imageUrl || selected.desktopImage || selected.mobileImage || selected.image || selected.url} 
                          alt="Background"
                          fill
                          className="object-cover opacity-40 blur-3xl scale-125"
                        />
                        
                        {/* 2. IMAGEM PRINCIPAL (Sem Padding, Colada nas bordas) */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            {/* w-full h-full força ocupar o espaço cinza todo */}
                            <div className="relative w-full h-full">
                                <Image 
                                src={selected.imageUrl || selected.desktopImage || selected.mobileImage || selected.image || selected.url} 
                                alt={selected.title || "Parceiro"}
                                fill
                                // object-contain garante que não corta NADA, mas como o container é 100%, ela vai até a borda
                                className="object-contain drop-shadow-2xl"
                                />
                            </div>
                        </div>
                      </>
                 ) : (
                    <Handshake size={100} className="text-slate-700" />
                 )}
            </div>

            {/* --- LADO DIREITO: INFORMAÇÕES (25% DA TELA) --- */}
            <div className="w-full md:w-1/4 flex flex-col bg-white border-l border-slate-100 h-full">
                 <div className="p-6 md:p-8 pb-4 border-b border-slate-50 shrink-0">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-3">
                        <Handshake size={12} /> Parceiro Oficial
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 leading-tight">
                        {selected.title || selected.name || "Parceiro"}
                    </h2>
                 </div>

                 <div className="p-6 md:p-8 py-6 flex-grow overflow-y-auto custom-scrollbar bg-slate-50/50">
                    {selected.description ? (
                        <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap">
                        {selected.description}
                        </p>
                    ) : (
                        <div className="text-center py-8 text-slate-400">
                            <Globe size={40} className="mx-auto mb-2 opacity-20" />
                            <p className="italic text-xs">Sem descrição disponível.</p>
                        </div>
                    )}
                 </div>

                 <div className="p-6 bg-white border-t border-slate-100 space-y-3 shrink-0">
                    {(selected.link || selected.url) && (
                        <Link 
                          href={selected.link || selected.url}
                          target="_blank"
                          className="flex items-center justify-center w-full gap-2 bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-blue-600 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-200 text-sm"
                        >
                           Visitar Site <ExternalLink size={16} />
                        </Link>
                    )}
                    <button 
                      onClick={() => setSelected(null)}
                      className="w-full py-2 text-slate-400 font-bold hover:text-slate-600 transition-colors text-xs uppercase tracking-wider"
                    >
                      Fechar
                    </button>
                 </div>
              </div>
          </div>
        </div>
      )}
    </>
  )
}