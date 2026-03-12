import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Trophy, ArrowRight, Quote, Star } from "lucide-react"

// Interface dos dados (Baseado no seu Schema)
interface StudentData {
  id: string;
  studentName: string;
  photoUrl: string | null;
  achievement: string;
  description: string | null;
  class: string | null;
  month: number;
  year: number;
}

export function FeaturedStudentSection({ student }: { student: StudentData }) {
  if (!student) return null;

  return (
    <section className="relative w-full bg-slate-900 text-white overflow-hidden py-16 md:py-24">
      {/* Background Decorativo */}
      <div className="absolute inset-0 opacity-10">
         <Image src="/hero-bg-1.jpg" alt="Background" fill className="object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900/80"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
            
            {/* Imagem do Aluno */}
            <div className="w-full md:w-1/2 flex justify-center md:justify-end">
                <div className="relative w-72 h-96 md:w-96 md:h-[500px] bg-slate-800 rounded-2xl p-3 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 border border-slate-700/50">
                    <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-700">
                        {student.photoUrl ? (
                            <Image 
                                src={student.photoUrl} 
                                alt={student.studentName} 
                                fill 
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full text-slate-500">
                                <Trophy size={64} />
                            </div>
                        )}
                        
                        {/* Selo de Destaque */}
                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-6 pt-20">
                            <div className="flex items-center gap-2 text-yellow-400 font-bold uppercase tracking-widest text-sm mb-1">
                                <Star size={16} fill="currentColor" />
                                Aluno Destaque
                            </div>
                            <h3 className="text-2xl font-black text-white">{student.studentName}</h3>
                        </div>
                    </div>
                    
                    {/* Badge Flutuante */}
                    <div className="absolute -top-6 -right-6 bg-yellow-500 text-slate-900 w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-lg border-4 border-slate-900 animate-pulse-slow">
                        <span className="text-xs font-bold uppercase">Mês de</span>
                        <span className="text-2xl font-black">{student.month}/{student.year}</span>
                    </div>
                </div>
            </div>

            {/* Conteúdo Texto */}
            <div className="w-full md:w-1/2 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 mb-6 font-bold text-sm uppercase tracking-wide">
                    <Trophy size={14} /> Reconhecimento Institucional
                </div>

                <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                    Destaque <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">Polícial Militar Mirim</span>
                </h2>

                <div className="relative bg-white/5 rounded-2xl p-8 border border-white/10 mb-8 backdrop-blur-sm">
                    <Quote className="absolute top-4 left-4 text-yellow-500/30 rotate-180" size={48} />
                    <p className="text-lg text-slate-300 italic leading-relaxed relative z-10">
                        "{student.description || "Pelo desempenho exemplar, dedicação aos estudos e conduta irrepreensível, servindo de inspiração para todo o batalhão."}"
                    </p>
                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-center md:justify-start gap-2">
                        <span className="text-yellow-500 font-bold uppercase text-xs tracking-widest">Conquista:</span>
                        <span className="font-bold text-white">{student.achievement}</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    {/* AQUI ESTAVA O ERRO DO LINK */}
                    <Link href="/alunos-destaque">
                        <Button size="lg" variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-slate-900 font-bold px-8 h-12">
                            Ver Galeria <ArrowRight className="ml-2" size={18} />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
      </div>
    </section>
  )
}