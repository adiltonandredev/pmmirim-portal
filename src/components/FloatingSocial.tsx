"use client";

import { Facebook, Instagram, Youtube, MessageCircle, Mail, Phone } from "lucide-react";
import { useState } from "react";

interface FloatingSocialProps {
  settings?: {
    socialFacebook?: string | null;
    socialInstagram?: string | null;
    socialYoutube?: string | null;
    contactWhatsapp?: string | null;
    contactEmail?: string | null;
    contactPhone?: string | null;
  };
}

export function FloatingSocial({ settings }: FloatingSocialProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const socialLinks = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      url: settings?.contactWhatsapp ? `https://wa.me/${settings.contactWhatsapp.replace(/\D/g, '')}` : null,
      color: "bg-green-500 hover:bg-green-600",
      delay: "delay-75"
    },
    {
      icon: Instagram,
      label: "Instagram",
      url: settings?.socialInstagram,
      color: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600",
      delay: "delay-100"
    },
    {
      icon: Facebook,
      label: "Facebook",
      url: settings?.socialFacebook,
      color: "bg-blue-600 hover:bg-blue-700",
      delay: "delay-150"
    },
    {
      icon: Youtube,
      label: "YouTube",
      url: settings?.socialYoutube,
      color: "bg-red-600 hover:bg-red-700",
      delay: "delay-200"
    },
    {
      icon: Mail,
      label: "Email",
      url: settings?.contactEmail ? `mailto:${settings.contactEmail}` : null,
      color: "bg-slate-600 hover:bg-slate-700",
      delay: "delay-[250ms]"
    },
    {
      icon: Phone,
      label: "Telefone",
      url: settings?.contactPhone ? `tel:${settings.contactPhone}` : null,
      color: "bg-emerald-600 hover:bg-emerald-700",
      delay: "delay-[300ms]"
    },
  ].filter(link => link.url);

  if (socialLinks.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3">
      {/* Social Icons */}
      <div className={`flex flex-col-reverse gap-3 transition-all duration-300 ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        {socialLinks.map((link, index) => (
          <a
            key={index}
            href={link.url!}
            target="_blank"
            rel="noopener noreferrer"
            className={`${link.color} ${link.delay} text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 hover:shadow-xl group relative`}
            aria-label={link.label}
          >
            <link.icon size={24} />
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {link.label}
            </span>
          </a>
        ))}
      </div>

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`${isExpanded ? 'bg-red-500 hover:bg-red-600 rotate-45' : 'bg-blue-600 hover:bg-blue-700'} text-white p-5 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center`}
        aria-label="Redes Sociais"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </button>

      {/* Pulse Effect */}
      {!isExpanded && (
        <div className="absolute bottom-0 right-0 w-[70px] h-[70px] bg-blue-600 rounded-full animate-ping opacity-20 pointer-events-none"></div>
      )}
    </div>
  );
}
