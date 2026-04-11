"use client";

import { useState } from "react";
import { Share2, X, Instagram, Facebook, Youtube, MessageCircle } from "lucide-react";

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

  const safeLink = (url: string | null | undefined) => {
    if (!url) return null;
    return url.startsWith("http") ? url : `https://${url}`;
  };

  const whatsappHref = settings?.contactPhone
    ? `https://wa.me/55${settings.contactPhone.replace(/\D/g, "")}`
    : null;

  const socialLinks = [
    {
      icon: <Instagram size={20} />,
      href: safeLink(settings?.instagramUrl),
      color: "hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500",
      label: "Instagram",
      show: !!settings?.instagramUrl,
    },
    {
      icon: <Facebook size={20} />,
      href: safeLink(settings?.facebookUrl),
      color: "hover:bg-blue-600",
      label: "Facebook",
      show: !!settings?.facebookUrl,
    },
    {
      icon: <Youtube size={20} />,
      href: safeLink(settings?.youtubeUrl),
      color: "hover:bg-red-600",
      label: "Youtube",
      show: !!settings?.youtubeUrl,
    },
    {
      icon: <MessageCircle size={20} />,
      href: whatsappHref,
      color: "hover:bg-green-500",
      label: "WhatsApp",
      show: !!whatsappHref,
    },
  ];

  const activeLinks = socialLinks.filter((l) => l.show && l.href);

  // Nenhuma rede configurada → não renderiza nada
  if (activeLinks.length === 0) return null;

  return (
    <>
      {/* ── BOTÃO WHATSAPP FLUTUANTE NO MOBILE ── */}
      {whatsappHref && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Fale pelo WhatsApp"
          className="md:hidden fixed bottom-5 right-5 z-50 w-14 h-14 flex items-center justify-center rounded-full bg-green-500 text-white shadow-xl hover:bg-green-400 transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <MessageCircle size={26} />
          {/* Pulsação de atenção */}
          <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-30 pointer-events-none" />
        </a>
      )}

      {/* ── PAINEL SOCIAL FLUTUANTE — APENAS DESKTOP ── */}
      <div className="hidden md:flex fixed bottom-6 right-6 z-50 flex-col items-end gap-3">
        {/* Links expandidos */}
        <div
          className={`flex flex-col gap-3 transition-all duration-300 ${
            isOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-6 pointer-events-none"
          }`}
        >
          {activeLinks.map((item, index) => (
            <a
              key={index}
              href={item.href!}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-12 h-12 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md text-slate-700 shadow-lg border border-white/60 transition-all duration-200 hover:scale-110 hover:text-white ${item.color}`}
              title={item.label}
            >
              {item.icon}
            </a>
          ))}
        </div>

        {/* Botão toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Fechar redes sociais" : "Abrir redes sociais"}
          className={`w-14 h-14 flex items-center justify-center rounded-full shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 ${
            isOpen
              ? "bg-slate-800 text-white rotate-90"
              : "bg-blue-700 text-white hover:bg-blue-600"
          }`}
        >
          {isOpen ? <X size={22} /> : <Share2 size={22} />}
        </button>
      </div>
    </>
  );
}
