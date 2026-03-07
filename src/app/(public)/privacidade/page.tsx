import { Metadata } from "next";
import { Shield, Lock, Eye, FileText, Mail } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero"; // Importe o componente novo

export const metadata: Metadata = {
  title: "Política de Privacidade | Polícia Mirim",
  description: "Entenda como tratamos seus dados pessoais.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* 1. HERO PADRONIZADO (Tema Azul) */}
      <PageHero 
        title="Política de Privacidade"
        subtitle="Transparência e segurança são os pilares da nossa instituição. Entenda como cuidamos dos seus dados."
        icon={Shield}
        bgColor="bg-slate-900" 
        themeColor="blue"
        bgImage="/bg/bg-security.png" // Pode usar qualquer imagem sua aqui
        backLink="/"
      />

      {/* 2. CONTEÚDO (Card Branco Sobreposto) */}
      <main className="flex-1 container mx-auto px-4 -mt-6 relative z-20 pb-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden p-8 md:p-12 animate-fade-in-up">
            
            <div className="space-y-12 text-slate-700 leading-relaxed text-lg">
                <Section icon={<Lock className="text-blue-600"/>} title="1. Coleta de Informações">
                    <p>Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento.</p>
                </Section>

                <Section icon={<Eye className="text-blue-600"/>} title="2. Uso de Dados">
                    <p>Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis para evitar perdas e roubos.</p>
                </Section>

                <Section icon={<FileText className="text-blue-600"/>} title="3. Cookies">
                    <p>Nosso site utiliza cookies para melhorar a experiência do usuário. Você pode desativar os cookies nas configurações do seu navegador, mas isso pode afetar o funcionamento de algumas áreas do site.</p>
                </Section>

                <div className="bg-slate-50 p-8 rounded-xl border border-dashed border-slate-200 text-center">
                    <Mail className="text-blue-600 mx-auto mb-3" size={32} />
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Dúvidas?</h3>
                    <p className="text-slate-600 mb-4 text-sm">Entre em contato com nossa equipe administrativa.</p>
                    <a href="mailto:contato@pmmirim.medici.br" className="text-blue-600 font-bold hover:underline">contato@pmmirim.medici.br</a>
                </div>
            </div>

        </div>
      </main>
    </div>
  );
}

// Componente auxiliar local para os textos
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