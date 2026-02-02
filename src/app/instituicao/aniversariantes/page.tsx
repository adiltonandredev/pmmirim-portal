// src/app/aniversariantes/page.tsx
import { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/ui/page-hero";
import { BackButton } from "@/components/ui/back-button"
import { Cake, Calendar, User, PartyPopper, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Aniversariantes | Polícia Mirim",
  description: "Galeria completa de aniversariantes da instituição.",
};

export const dynamic = "force-dynamic";

export default async function AniversariantesPage() {
  // Busca todos os aniversariantes ativos
  const birthdays = await prisma.birthday.findMany({
    where: { active: true },
  });

  // Nomes dos meses
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  // Agrupamento por mês
  const birthdaysByMonth: Record<number, typeof birthdays> = {};
  
  // Inicializa os arrays vazios
  monthNames.forEach((_, index) => {
    birthdaysByMonth[index] = [];
  });

  // Preenche os grupos
  birthdays.forEach((b) => {
    // CORREÇÃO 1: Usando 'date' em vez de 'birthDate'
    const dateObj = new Date(b.date); 
    const month = dateObj.getUTCMonth();
    
    if (birthdaysByMonth[month]) {
        birthdaysByMonth[month].push(b);
    }
  });

  // Ordena por dia dentro de cada mês
  Object.keys(birthdaysByMonth).forEach((key) => {
    const monthIndex = parseInt(key);
    birthdaysByMonth[monthIndex].sort((a, b) => {
        // CORREÇÃO 2: Usando 'date' aqui também
        return new Date(a.date).getUTCDate() - new Date(b.date).getUTCDate();
    });
  });

  // Começar pelo Mês Atual
  const currentMonthIndex = new Date().getMonth();
  const sortedMonthIndices = [
    ...Array.from({ length: 12 }, (_, i) => i).slice(currentMonthIndex),
    ...Array.from({ length: 12 }, (_, i) => i).slice(0, currentMonthIndex)
  ];

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <PageHero 
        title="Aniversariantes"
        subtitle="Celebrando a vida dos nossos guerreiros, instrutores e colaboradores."
        icon={Cake}
        bgColor="bg-yellow-950"
        themeColor="yellow"
        bgImage="/bg/bg-aniversario.png"
      />

      {/* 2. CONTEÚDO */}
      <div className="flex-1 container mx-auto px-4 -mt-10 relative z-20 pb-24">
        
        {birthdays.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl shadow-lg text-center max-w-2xl mx-auto border border-slate-100">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                   <Cake size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-600">Nenhum aniversariante</h3>
                <p className="text-slate-500 mt-2">A lista de aniversários está vazia no momento.</p>
            </div>
        ) : (
            <div className="space-y-16">
                {sortedMonthIndices.map((monthIndex) => {
                    const monthList = birthdaysByMonth[monthIndex];
                    if (!monthList || monthList.length === 0) return null;

                    const isCurrentMonth = monthIndex === currentMonthIndex;

                    return (
                        <div key={monthIndex} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            
                            {/* TÍTULO DO MÊS */}
                            <div className={`flex items-center gap-4 mb-8 p-4 rounded-xl border ${isCurrentMonth ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-slate-100 shadow-sm'}`}>
                                <div className={`p-2 rounded-lg ${isCurrentMonth ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-500'}`}>
                                    <Calendar size={24} />
                                </div>
                                <h2 className={`text-2xl font-black uppercase tracking-tight ${isCurrentMonth ? 'text-yellow-800' : 'text-slate-700'}`}>
                                    {monthNames[monthIndex]}
                                </h2>
                                
                                {isCurrentMonth && (
                                    <span className="ml-auto bg-yellow-400 text-yellow-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                                        <PartyPopper size={12} /> Mês Atual
                                    </span>
                                )}
                            </div>

                            {/* GRID DE PESSOAS */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {monthList.map((person) => {
                                    // CORREÇÃO 3: Usando 'date'
                                    const day = new Date(person.date).getUTCDate();
                                    const isToday = isCurrentMonth && day === new Date().getDate();

                                    return (
                                        <div key={person.id} className={`bg-white rounded-2xl overflow-hidden flex flex-col items-center text-center group transition-all duration-300 ${isToday ? 'shadow-2xl scale-105 ring-4 ring-yellow-400 ring-offset-2 z-10' : 'shadow-lg border border-slate-100 hover:-translate-y-2 hover:shadow-xl'}`}>
                                            
                                            {/* TOPO DECORATIVO */}
                                            <div className={`h-2 w-full ${isToday ? 'bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 animate-gradient' : 'bg-slate-100 group-hover:bg-yellow-400 transition-colors'}`}></div>
                                            
                                            <div className="p-6 w-full flex flex-col items-center">
                                                {/* FOTO */}
                                                <div className="relative mb-4">
                                                    <div className={`w-24 h-24 rounded-full overflow-hidden border-4 ${isToday ? 'border-yellow-400' : 'border-slate-100 group-hover:border-yellow-200'} shadow-md relative transition-colors`}>
                                                        {person.photoUrl ? (
                                                            <Image 
                                                                // CORREÇÃO 4: Adicionado || "" para evitar erro de null
                                                                src={person.photoUrl || ""} 
                                                                // CORREÇÃO 5: Usando 'name' em vez de 'studentName'
                                                                alt={person.name} 
                                                                fill 
                                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300">
                                                                <User size={40} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    {isToday && (
                                                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md whitespace-nowrap z-10 flex items-center gap-1 animate-bounce">
                                                            <Star size={10} fill="white" /> É HOJE!
                                                        </div>
                                                    )}
                                                </div>

                                                {/* DATA */}
                                                <div className="mb-2">
                                                    <span className={`inline-block px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${isToday ? 'bg-yellow-100 text-yellow-800' : 'bg-slate-100 text-slate-500'}`}>
                                                        Dia {day}
                                                    </span>
                                                </div>

                                                {/* NOME (CORRIGIDO PARA 'name') */}
                                                <h3 className="text-lg font-black text-slate-800 leading-tight mb-1 group-hover:text-yellow-600 transition-colors">
                                                    {person.name}
                                                </h3>
                                                
                                                {/* CARGO (Opcional: se não tiver 'role', removemos o 'class') */}
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                                                    Polícia Mirim
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
      </div>
        
        <BackButton className="mt-16" />
    </main>
  );
}