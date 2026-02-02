"use client"

import { Facebook, Link as LinkIcon, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function ShareButtons({ title }: { title: string }) {
  
  const handleShare = (platform: 'whatsapp' | 'facebook' | 'copy') => {
    const url = window.location.href
    const text = `Confira esta notícia da Polícia Mirim: ${title}`

    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`, '_blank')
    } 
    else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
    } 
    else {
      navigator.clipboard.writeText(url)
      toast.success("Link copiado para a área de transferência!")
    }
  }

  return (
    <div className="flex flex-wrap gap-2 my-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
      <span className="w-full text-xs font-bold text-slate-500 uppercase mb-1">Compartilhar notícia:</span>
      
      <Button onClick={() => handleShare('whatsapp')} className="bg-green-500 hover:bg-green-600 text-white gap-2 font-bold flex-1 md:flex-none">
        <Smartphone size={18} /> WhatsApp
      </Button>

      <Button onClick={() => handleShare('facebook')} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 font-bold flex-1 md:flex-none">
        <Facebook size={18} /> Facebook
      </Button>

      <Button onClick={() => handleShare('copy')} variant="outline" className="gap-2 font-bold flex-1 md:flex-none">
        <LinkIcon size={18} /> Copiar Link
      </Button>
    </div>
  )
}