// src/app/contato/page.tsx
import { Metadata } from "next"
import { ContactForm } from "@/components/contact/ContactForm"
import { Mail, MapPin, Phone, Clock, MessageSquare, Smartphone } from "lucide-react"
import { PageHero } from "@/components/ui/page-hero"
import { BackButton } from "@/components/ui/back-button"
import { getSiteSettings } from "@/lib/settings" // <--- Importa as configurações do banco

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSiteSettings();
    return {
        title: `Contato - ${settings.siteName || "PMMIRIM"}`,
        description: "Entre em contato com a Polícia Militar Mirim",
    }
}

export default async function ContatoPage() {
    // Busca as informações do banco de dados
    const settingsRaw = await getSiteSettings();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const settings: any = settingsRaw || {};

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">

            {/* 1. HERO PADRONIZADO (Tema Azul) */}
            <PageHero
                title="Fale Conosco"
                subtitle="Estamos à disposição para tirar dúvidas, receber sugestões e atender a comunidade."
                icon={Mail}
                themeColor="blue"
                bgColor="bg-blue-950"
                bgImage="/bg/bg-contato.png"
            />

            {/* 2. CONTEÚDO */}
            <main className="flex-1 container mx-auto px-4 -mt-6 relative z-20 pb-20">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                    {/* COLUNA DA ESQUERDA: Informações do Banco */}
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-10 space-y-8 h-full">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 mb-2 flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-600 p-2 rounded-lg"><MapPin size={24} /></span>
                                Canais de Atendimento
                            </h2>
                            <p className="text-slate-500 text-sm">
                                Escolha a forma mais conveniente para falar com nossa equipe.
                            </p>
                        </div>

                        <div className="space-y-8">
                            {/* Endereço */}
                            <div className="flex gap-4 group">
                                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shrink-0">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-blue-700 transition-colors">Sede Administrativa</h3>
                                    <p className="text-slate-600 leading-relaxed text-sm">
                                        {settings.address || "Endereço não cadastrado."}
                                    </p>
                                </div>
                            </div>

                            {/* Telefone Fixo */}
                            {settings.contactPhone && (
                                <div className="flex gap-4 group">
                                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shrink-0">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-1 group-hover:text-blue-700 transition-colors">Telefone</h3>
                                        <p className="text-slate-600 leading-relaxed text-sm">
                                            {settings.contactPhone}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* WhatsApp (Se existir) */}
                            {settings.whatsapp && (
                                <div className="flex gap-4 group">
                                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-green-50 group-hover:text-green-600 transition-colors shrink-0">
                                        <Smartphone size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-1 group-hover:text-green-700 transition-colors">WhatsApp</h3>
                                        <p className="text-slate-600 leading-relaxed text-sm">
                                            {settings.whatsapp}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Email */}
                            <div className="flex gap-4 group">
                                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shrink-0">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-blue-700 transition-colors">E-mail Oficial</h3>
                                    <p className="text-slate-600 leading-relaxed text-sm break-all">
                                        {settings.email || "contato@pmmirim.medici.br"}
                                    </p>
                                </div>
                            </div>

                            {/* Horário (Geralmente fixo, mas pode vir do banco se tiver campo 'openingHours') */}
                            <div className="flex gap-4 group">
                                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shrink-0">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-blue-700 transition-colors">Horário de Funcionamento</h3>
                                    <p className="text-slate-600 leading-relaxed text-sm">
                                        {(settings as any).openingHours || "Segunda a Sexta: 08h às 12h - 14h às 18h"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Box de Ajuda */}
                        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6 flex gap-4">
                            <div className="shrink-0 text-blue-500 mt-1">
                                <MessageSquare size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-blue-900 mb-1">Dúvidas Frequentes</h4>
                                <p className="text-blue-700/80 text-xs leading-relaxed text-justify">
                                    Antes de enviar sua mensagem, verifique se sua dúvida já foi respondida em nossa seção de perguntas frequentes no rodapé do site.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* COLUNA DA DIREITA: Formulário */}
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 md:p-10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600"></div>
                        <h2 className="text-2xl font-black text-slate-900 mb-6">
                            Envie sua Mensagem
                        </h2>
                        <ContactForm />
                    </div>

                </div>
        
        <BackButton className="mt-16" />
            </main>
        </div>
    )
}