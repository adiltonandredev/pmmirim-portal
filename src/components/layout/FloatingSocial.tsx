"use client";

import { useState } from "react";
import { Share2, X, Instagram, Facebook, Youtube, MessageCircle, Phone } from "lucide-react";

// Aceita as configurações vindas do banco
interface FloatingSocialProps {
  settings?: {
    instagramUrl?: string | null;
    facebookUrl?: string | null;
    youtubeUrl?: string | null;
    contactPhone?: string | null;
  } | null;
}

export function FloatingSocial({ settings }: FloatingSocialProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Função de Segurança: Garante https://
  const safeLink = (url: string | null | undefined) => {
    if (!url) return null;
    return url.startsWith("http") ? url : `https://${url}`;
  };

  const links = [
    { 
      icon: <Instagram size={20} />, 
      href: safeLink(settings?.instagramUrl), 
      color: "hover:bg-pink-600", 
      label: "Instagram",
      show: !!settings?.instagramUrl 
    },
    { 
      icon: <Facebook size={20} />, 
      href: safeLink(settings?.facebookUrl), 
      color: "hover:bg-blue-600", 
      label: "Facebook",
      show: !!settings?.facebookUrl 
    },
    { 
      icon: <Youtube size={20} />, 
      href: safeLink(settings?.youtubeUrl), 
      color: "hover:bg-red-600", 
      label: "Youtube",
      show: !!settings?.youtubeUrl 
    },
    // WhatsApp Automático (Se tiver telefone cadastrado)
    { 
      icon: <MessageCircle size={20} />, 
      href: settings?.contactPhone ? `https://wa.me/55${settings.contactPhone.replace(/\D/g, '')}` : null, 
      color: "hover:bg-green-500", 
      label: "WhatsApp",
      show: !!settings?.contactPhone 
    },
  ];

  // Filtra apenas os que têm link válido
  const activeLinks = links.filter(link => link.show && link.href);

  if (activeLinks.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 hidden md:flex">
      
      <div className={`flex flex-col gap-3 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-10 invisible'}`}>
        {activeLinks.map((item, index) => (
          <a
            key={index}
            href={item.href!} // A exclamação garante que não é null (já filtramos)
            target="_blank"
            rel="noopener noreferrer"
            className={`w-12 h-12 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md text-slate-700 shadow-lg border border-white/50 transition-all duration-200 transform hover:scale-110 hover:text-white ${item.color}`}
            title={item.label}
          >
            {item.icon}
          </a>
        ))}
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 flex items-center justify-center rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
          isOpen ? "bg-slate-800 text-white rotate-90" : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {isOpen ? <X size={24} /> : <Share2 size={24} />}
      </button>

    </div>
  );
}