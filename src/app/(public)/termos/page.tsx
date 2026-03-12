import { Metadata } from "next";
import { Scale, AlertTriangle, FileCheck, ShieldAlert } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";

export const metadata: Metadata = {
  title: "Termos de Uso | Polícia Mirim",
  description: "Regras e condições para uso do nosso portal.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* 1. HERO PADRONIZADO (Tema Amarelo - Igual Galeria) */}
      <PageHero 
        title="Termos de Uso"
        subtitle="Regras e condições para uso do nosso portal. Ao acessar, você concorda com as diretrizes abaixo."
        icon={Scale}
        bgColor="bg-yellow-950" 
        themeColor="yellow"
        bgImage="/bg/bg-honra.png" // Reutilizando o BG da honra que combina com amarelo
        backLink="/"
      />

      {/* 2. CONTEÚDO */}
      <main className="flex-1 container mx-auto px-4 -mt-6 relative z-20 pb-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden p-8 md:p-12 animate-fade-in-up">
            
            <div className="space-y-12 text-slate-700 leading-relaxed text-lg">
                <Section icon={<FileCheck className="text-yellow-600"/>} title="1. Aceitação">
                    <p>Ao acessar ao site Polícia Mirim de Presidente Médici, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis.</p>
                </Section>

                <Section icon={<ShieldAlert className="text-yellow-600"/>} title="2. Propriedade Intelectual">
                    <p>Todo o conteúdo deste site (fotos, textos, logotipos) é propriedade exclusiva da Polícia Mirim. É estritamente proibido modificar, copiar ou usar as imagens dos alunos para qualquer fim comercial sem autorização.</p>
                </Section>

                <Section icon={<AlertTriangle className="text-yellow-600"/>} title="3. Isenção">
                    <p>Os materiais no site da Polícia Mirim são fornecidos 'como estão'. A instituição não oferece garantias, expressas ou implícitas, sobre a precisão ou confiabilidade do uso dos materiais.</p>
                </Section>

                <div className="text-center pt-8 border-t border-slate-100">
                    <p className="text-slate-400 text-sm">
                        Termos efetivos a partir de <strong>Janeiro de 2026</strong>.
                    </p>
                </div>
            </div>

        </div>
      </main>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) {
  return (
    <section>
      <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
        {icon} {title}
      </h2>
      <div className="text-slate-600 text-justify space-y-2">
        {children}
      </div>
    </section>
  )
}