"use client";

import { useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updateEvent } from "@/app/actions/events";
import { Save, AlertCircle, MapPin, Clock, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface EditEventFormProps {
  data: {
    id: string;
    title: string;
    description: string | null;
    date: Date;
    location: string | null;
    bannerUrl: string | null;
  };
}

export function EditEventForm({ data }: EditEventFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  // === SEPARAR DATA E HORA PARA OS INPUTS ===
  // O input type="date" precisa de YYYY-MM-DD
  // O input type="time" precisa de HH:MM
  const eventDateObj = new Date(data.date);
  
  // Ajuste de fuso horário simples para inputs locais
  // (Ou simplesmente pegamos a string ISO e cortamos, dependendo de como salvou)
  const dateStr = eventDateObj.toISOString().split('T')[0];
  const timeStr = eventDateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  async function handleSubmit(formData: FormData) {
    const title = formData.get("title") as string;
    const file = formData.get("banner") as File;

    if (!title || title.length < 3) {
        toast.warning("Título obrigatório");
        return;
    }

    // Valida banner APENAS se o usuário selecionou um novo
    if (file && file.size > 0) {
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Banner muito grande (Máx 5MB)");
            return;
        }
        if (!file.type.startsWith("image/")) {
            toast.error("Formato inválido (Use JPG/PNG)");
            return;
        }
    }

    // Adiciona ID e Banner Antigo ao FormData
    formData.append("id", data.id);
    if (data.bannerUrl) {
        formData.append("existingBannerUrl", data.bannerUrl);
    }

    const promise = updateEvent(formData);

    toast.promise(promise, {
      loading: 'Atualizando evento...',
      success: () => {
        setTimeout(() => router.push("/admin/events"), 1000); // Redireciona após 1s
        return `Evento atualizado com sucesso!`;
      },
      error: 'Erro ao atualizar. Tente novamente.',
    });
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 max-w-3xl mx-auto">
      
      <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Save size={18} className="text-blue-600" /> Editar Evento
        </h3>
        <Link href="/admin/events">
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-800">
                <ArrowLeft size={16} className="mr-1" /> Cancelar
            </Button>
        </Link>
      </div>
      
      <form ref={formRef} action={handleSubmit} className="space-y-5">
        
        {/* VISUALIZAÇÃO DO BANNER ATUAL */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex gap-4 items-start">
            <div className="relative w-32 h-20 bg-slate-200 rounded overflow-hidden shrink-0 border border-slate-300">
                {data.bannerUrl ? (
                    <Image src={data.bannerUrl} alt="Banner Atual" fill className="object-cover" />
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-400"><ImageIcon /></div>
                )}
            </div>
            <div>
                <p className="text-sm font-bold text-slate-700">Banner Atual</p>
                <p className="text-xs text-slate-500 mt-1">
                    Esta é a imagem que está no ar. Se quiser trocar, basta selecionar um novo arquivo abaixo.
                </p>
            </div>
        </div>

        <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Título do Evento <span className="text-red-500">*</span></label>
            <input 
                required 
                defaultValue={data.title}
                name="title" 
                className="w-full p-2 border border-slate-300 rounded mt-1 text-sm outline-none focus:border-blue-500 transition-colors" 
            />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><Clock size={10}/> Data</label>
                <input 
                    required 
                    defaultValue={dateStr}
                    type="date" 
                    name="date" 
                    className="w-full p-2 border border-slate-300 rounded mt-1 text-sm outline-none focus:border-blue-500" 
                />
            </div>
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><Clock size={10}/> Hora</label>
                <input 
                    required 
                    defaultValue={timeStr}
                    type="time" 
                    name="time" 
                    className="w-full p-2 border border-slate-300 rounded mt-1 text-sm outline-none focus:border-blue-500" 
                />
            </div>
        </div>

        <div>
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><MapPin size={10}/> Local</label>
            <input 
                defaultValue={data.location || ""}
                name="location" 
                className="w-full p-2 border border-slate-300 rounded mt-1 text-sm outline-none focus:border-blue-500" 
            />
        </div>

        <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Descrição</label>
            <textarea 
                defaultValue={data.description || ""}
                name="description" 
                rows={4} 
                className="w-full p-2 border border-slate-300 rounded mt-1 text-sm outline-none focus:border-blue-500 resize-none" 
            />
        </div>

        <div>
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1 mb-1">
                Trocar Banner (Opcional)
            </label>
            <input 
                type="file" 
                name="banner" 
                accept="image/*"
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border border-dashed border-slate-300 rounded-lg p-2" 
            />
            
            <div className="mt-2 bg-amber-50 p-2 rounded border border-amber-100 flex gap-2">
                <AlertCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                <p className="text-[10px] text-amber-700">
                    Se não selecionar nada, o banner atual será mantido. <br/>
                    Recomendado: Imagem horizontal, máx 5MB.
                </p>
            </div>
        </div>

        <div className="pt-2">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 font-bold shadow-md transition-all h-11 text-base">
                Salvar Alterações
            </Button>
        </div>
      </form>
    </div>
  );
}