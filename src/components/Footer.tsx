import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Youtube, MapPin, Mail, Phone, MessageCircle, ArrowRight, ShieldCheck } from "lucide-react"

export function Footer({ settings }: { settings?: any }) {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-b from-slate-900 via-slate-900 to-black text-slate-300 mt-auto relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              {settings?.logoUrl ? (
                <div className="relative w-40 h-12">
                  <Image
                    src={settings.logoUrl}
                    alt={settings.siteName || "PMMIRIM"}
                    fill
                    className="object-contain brightness-0 invert"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <ShieldCheck size={24} className="text-white" />
                  </div>
                  <span className="text-2xl font-bold text-white">
                    {settings?.siteName || "PMMIRIM"}
                  </span>
                </div>
              )}
            </div>
            <p className="text-sm leading-relaxed text-slate-400 mb-6">
              {settings?.siteDescription || "Transformando vidas através da educação, disciplina e cidadania."}
            </p>
            
            {/* Social Media Icons */}
            {(settings?.socialFacebook || settings?.socialInstagram || settings?.socialTwitter || settings?.socialYoutube) && (
              <div className="flex gap-3">
                {settings?.socialFacebook && (
                  <a 
                    href={settings.socialFacebook} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2.5 bg-slate-800 hover:bg-blue-600 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-600/50"
                    aria-label="Facebook"
                  >
                    <Facebook size={18} />
                  </a>
                )}
                {settings?.socialInstagram && (
                  <a 
                    href={settings.socialInstagram} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2.5 bg-slate-800 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-pink-600/50"
                    aria-label="Instagram"
                  >
                    <Instagram size={18} />
                  </a>
                )}
                {settings?.socialTwitter && (
                  <a 
                    href={settings.socialTwitter} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2.5 bg-slate-800 hover:bg-sky-500 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-sky-500/50"
                    aria-label="Twitter"
                  >
                    <Twitter size={18} />
                  </a>
                )}
                {settings?.socialYoutube && (
                  <a 
                    href={settings.socialYoutube} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2.5 bg-slate-800 hover:bg-red-600 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-600/50"
                    aria-label="YouTube"
                  >
                    <Youtube size={18} />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-6 flex items-center gap-2">
              <div className="h-1 w-8 bg-blue-600 rounded"></div>
              Navegação
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Início", href: "/" },
                { label: "Quem Somos", href: "/sobre" },
                { label: "Notícias", href: "/noticias" },
                { label: "Projetos", href: "/projetos" },
                { label: "Contato", href: "/contato" },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-slate-400 hover:text-white transition-all duration-200 flex items-center gap-2 group text-sm"
                  >
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-6 flex items-center gap-2">
              <div className="h-1 w-8 bg-green-600 rounded"></div>
              Contato
            </h3>
            <ul className="space-y-4">
              {settings?.address && (
                <li className="flex items-start gap-3 text-sm">
                  <MapPin size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-400 leading-relaxed">
                    {settings.address}
                  </span>
                </li>
              )}
              {settings?.contactEmail && (
                <li className="flex items-start gap-3 text-sm">
                  <Mail size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <a 
                    href={`mailto:${settings.contactEmail}`}
                    className="text-slate-400 hover:text-blue-400 transition-colors break-all"
                  >
                    {settings.contactEmail}
                  </a>
                </li>
              )}
              {settings?.contactPhone && (
                <li className="flex items-start gap-3 text-sm">
                  <Phone size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <a 
                    href={`tel:${settings.contactPhone}`}
                    className="text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    {settings.contactPhone}
                  </a>
                </li>
              )}
              {settings?.contactWhatsapp && (
                <li className="flex items-start gap-3 text-sm">
                  <MessageCircle size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <a 
                    href={`https://wa.me/${settings.contactWhatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-green-400 transition-colors"
                  >
                    {settings.contactWhatsapp}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter or CTA */}
          <div>
            <h3 className="text-white text-lg font-bold mb-6 flex items-center gap-2">
              <div className="h-1 w-8 bg-yellow-600 rounded"></div>
              Participe
            </h3>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Faça parte da família PMMIRIM e contribua para a formação de cidadãos de bem.
            </p>
            <Link href="/contato">
              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/50 flex items-center justify-center gap-2 group">
                Entre em Contato
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500 text-center md:text-left">
              {settings?.footerText || `© ${currentYear} PMMIRIM - Polícia Militar Mirim. Todos os direitos reservados.`}
            </p>
            <div className="flex gap-6 text-xs text-slate-500">
              <Link href="/admin" className="hover:text-slate-300 transition-colors">
                Área Restrita
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="h-1 bg-gradient-to-r from-blue-600 via-green-600 to-yellow-600"></div>
    </footer>
  )
}