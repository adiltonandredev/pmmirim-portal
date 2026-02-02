import Link from "next/link";
import Image from "next/image";
import { Shield, MapPin, Phone, Mail, Facebook, Instagram, Youtube, ArrowRight, MessageCircle, Linkedin, Github, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";

// 1. ADICIONAMOS 'missionText' NA INTERFACE
interface SiteInfo {
  logo: string | null;
  phone: string;
  email: string;
  address: string;
  openingHours?: string;
  missionText?: string | null; // <--- NOVO CAMPO
}

async function getInstagramFeed() {
  try {
    const settings = await prisma.instagramSettings.findFirst();
    if (!settings?.accessToken || !settings?.enabled) {
      return null;
    }
    const fields = "id,media_type,media_url,thumbnail_url,permalink,caption";
    const url = `https://graph.instagram.com/me/media?fields=${fields}&access_token=${settings.accessToken}&limit=6`;
    
    const res = await fetch(url, { next: { revalidate: 3600 } }); 
    if (!res.ok) throw new Error("Falha na API Instagram");
    
    const data = await res.json();
    return { photos: data.data, username: settings.username };
  } catch (error) {
    console.error("Erro ao carregar Instagram:", error);
    return null;
  }
}

export async function Footer({ siteInfo }: { siteInfo?: SiteInfo }) {
  const mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3923.473539829763!2d-61.90566492587786!3d-11.173859628043682!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x93c613007010a30d%3A0xc31c0344485303a7!2sPolicia%20Mirim%20de%20Presidente%20M%C3%A9dici!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"; 

  const instagramData = await getInstagramFeed();
  const hoursText = siteInfo?.openingHours || "Seg. a Sexta: 07:30 às 11:30\n13:30 às 17:30";
  
  // Texto padrão de backup
  const defaultMission = "Formando cidadãos conscientes, disciplinados e preparados para o futuro através da educação e valores cívicos.";

  return (
    <footer className="bg-brand-blue text-white/80 border-t border-white/10 relative overflow-hidden">
      
      {/* 1. FAIXA IDENTITÁRIA */}
      <div className="absolute top-0 left-0 w-full flex h-[4px] z-20">
        <div className="w-1/2 bg-brand-yellow"></div>
        <div className="w-1/2 bg-brand-green"></div>
      </div>

      {/* 2. EFEITO DE LUZ */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        {/* FEED DO INSTAGRAM (Mantido igual) */}
        {instagramData && instagramData.photos && instagramData.photos.length > 0 && (
          <div className="mb-12 pb-12 border-b border-white/10">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-white font-bold flex items-center gap-2 uppercase tracking-wider text-sm">
                  <Instagram size={18} className="text-brand-yellow"/> Siga-nos no Instagram 
                  <span className="text-white/50 lowercase font-normal">{instagramData.username}</span>
               </h3>
               <a 
                 href={`https://instagram.com/${instagramData.username?.replace('@', '')}`} 
                 target="_blank"
                 className="text-xs font-bold text-white/70 hover:text-brand-yellow flex items-center gap-1 transition-colors"
               >
                 Ver perfil completo <ArrowRight size={14} />
               </a>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {instagramData.photos.map((photo: any) => (
                <a key={photo.id} href={photo.permalink} target="_blank" className="relative aspect-square overflow-hidden rounded-lg border border-white/10 group bg-black/20">
                  <Image src={photo.media_type === "VIDEO" ? photo.thumbnail_url : photo.media_url} alt={photo.caption || "Foto Instagram"} fill className="object-cover group-hover:scale-110 transition-transform duration-500"/>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <Instagram className="text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* COLUNAS PRINCIPAIS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* COLUNA 1: Identidade */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              {siteInfo?.logo ? (
                <div className="relative w-12 h-12 overflow-hidden rounded-full border-2 border-white/20 shadow-lg bg-brand-white shrink-0">
                   <Image src={siteInfo.logo} alt="Logo" fill className="object-cover" />
                </div>
              ) : (
                <div className="w-10 h-10 bg-brand-white rounded-full flex items-center justify-center text-brand-blue shadow-lg shrink-0">
                  <Shield size={20} />
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-xl font-black text-white uppercase leading-none">Polícia Militar Mirim</span>
                <span className="text-[10px] font-bold text-brand-yellow tracking-widest uppercase mt-1">Presidente Médici</span>
              </div>
            </div>
            
            {/* 2. TEXTO DINÂMICO AQUI */}
            <p className="text-sm leading-relaxed text-white/70">
              {siteInfo?.missionText || defaultMission}
            </p>

            <div className="flex gap-4">
              <SocialLink href="https://instagram.com/policia_mirimpm" icon={<Instagram size={20} />} />
              <SocialLink href="https://facebook.com" icon={<Facebook size={20} />} />
              <SocialLink href="https://youtube.com" icon={<Youtube size={20} />} />
            </div>
          </div>

          {/* COLUNA 2: Navegação (Mantida igual) */}
          <div>
            <h3 className="text-white font-bold mb-6 flex items-center gap-2 uppercase tracking-wider text-sm">
              <span className="w-6 h-1 bg-brand-yellow rounded-full inline-block"></span> Navegação
            </h3>
            <ul className="space-y-3 text-sm font-medium">
              <li><FooterLink href="/">Início</FooterLink></li>
              <li><FooterLink href="/instituicao/historia">Nossa História</FooterLink></li>
              <li><FooterLink href="/projetos">Projetos Sociais</FooterLink></li>
              <li><FooterLink href="/noticias">Notícias</FooterLink></li>
              <li><FooterLink href="/contato">Fale Conosco</FooterLink></li>
            </ul>
          </div>

          {/* COLUNA 3: Contatos (Mantida igual) */}
          <div>
            <h3 className="text-white font-bold mb-6 flex items-center gap-2 uppercase tracking-wider text-sm">
              <span className="w-6 h-1 bg-brand-green rounded-full inline-block"></span> Contatos
            </h3>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-start gap-3">
                <MapPin className="text-brand-yellow mt-1 shrink-0" size={18} />
                <span className="whitespace-pre-line">{siteInfo?.address || "Endereço não informado"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-brand-yellow shrink-0" size={18} />
                <span>{siteInfo?.phone || "(69) 0000-0000"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-brand-yellow shrink-0" size={18} />
                <span>{siteInfo?.email || "contato@pmmirim.medici.br"}</span>
              </li>
              <li className="flex items-start gap-3 pt-2 border-t border-white/5 mt-2">
                <Clock className="text-brand-yellow shrink-0 mt-0.5" size={18} />
                <div className="flex flex-col">
                    <span className="font-bold text-white uppercase text-xs mb-0.5">Atendimento</span>
                    <div className="text-white/80 leading-snug">
                        {hoursText.split('\n').map((line, index) => (
                           <span key={index} className="block">{line}</span>
                        ))}
                    </div>
                </div>
              </li>
            </ul>
          </div>

          {/* COLUNA 4: Mapa (Mantida igual) */}
          <div className="flex flex-col h-full">
            <h3 className="text-white font-bold mb-6 flex items-center gap-2 uppercase tracking-wider text-sm">
               <span className="w-6 h-1 bg-brand-white rounded-full inline-block"></span> Localização
            </h3>
            <div className="flex-1 min-h-[160px] bg-white/5 rounded-xl overflow-hidden shadow-lg border border-white/10 group relative">
                <iframe 
                    src={mapSrc}
                    width="100%" height="100%" style={{ border: 0 }} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full absolute inset-0 opacity-70 group-hover:opacity-100 transition-all duration-700"
                ></iframe>
            </div>
            <p className="text-xs text-white/50 mt-2 text-center">Rua Paraná - Presidente Médici</p>
          </div>
        </div>
      </div>

      {/* RODAPÉ INFERIOR (Mantido igual) */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4 md:mb-6">
            <p className="text-sm text-white/60 text-center md:text-left">
              © {new Date().getFullYear()} Polícia Militar Mirim de Presidente Médici/RO. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-sm text-white/60">
               <Link href="/privacidade" className="hover:text-brand-yellow transition-colors">Privacidade</Link>
               <Link href="/termos" className="hover:text-brand-yellow transition-colors">Termos de Uso</Link>
               <Link href="/login" className="hover:text-brand-yellow transition-colors flex items-center gap-1">
                  <Shield size={12}/> Admin
               </Link>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center gap-3 pt-4 border-t border-white/5 text-xs text-white/30">
              <span className="flex items-center gap-1">
                Desenvolvido por <span className="font-bold text-white/50 hover:text-white transition-colors cursor-default">Adilton Andre</span>
              </span>
              <span className="hidden md:inline text-white/10 mx-2">|</span>
              <div className="flex items-center gap-4">
                 <a href="https://wa.me/5569999772514" target="_blank" className="hover:text-green-500 hover:scale-110 transition-all"><MessageCircle size={14} /></a>
                 <a href="https://instagram.com/adiltonandremcs" target="_blank" className="hover:text-pink-500 hover:scale-110 transition-all"><Instagram size={14} /></a>
                 <a href="https://linkedin.com/in/adiltonandre" target="_blank" className="hover:text-blue-500 hover:scale-110 transition-all"><Linkedin size={14} /></a>
                 <a href="https://github.com/adiltonandre" target="_blank" className="hover:text-white hover:scale-110 transition-all"><Github size={14} /></a>
              </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Componentes auxiliares (mantidos iguais)
function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
    return <Link href={href} className="text-white/70 hover:text-brand-yellow hover:translate-x-1 transition-all duration-300 block">{children}</Link>
}

function SocialLink({ href, icon }: { href: string, icon: React.ReactNode }) {
    return (
        <a href={href} target="_blank" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-brand-yellow hover:text-brand-blue transition-all duration-300 transform hover:scale-110">
            {icon}
        </a>
    )
}