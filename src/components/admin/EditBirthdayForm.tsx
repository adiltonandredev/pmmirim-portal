"use client";

import { useRef } from "react";
import { toast } from "sonner"; 
import { Button } from "@/components/ui/button";
import { updateBirthday } from "@/app/actions/students"; // Certifique-se que essa action existe
import { Save, AlertCircle, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Interface para os dados que vêm do banco
interface EditBirthdayFormProps {
  data: {
    id: string;
    studentName: string;
    birthDate: Date;
    class: string | null;
    photoUrl: string | null;
  };
}

export function EditBirthdayForm({ data }: EditBirthdayFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  // Formata a data para o input (YYYY-MM-DD)
  const formattedDate = new Date(data.birthDate).toISOString().split('T')[0];

  async function handleSubmit(formData: FormData) {
    // === 1. VALIDAÇÃO CLIENTE ===
    const name = formData.get("studentName") as string;
    const file = formData.get("photo") as File;

    if (!name || name.length < 3) {
        toast.warning("Nome inválido", { description: "O nome deve ter no mínimo 3 caracteres." });
        return;
    }

    // Se o usuário enviou uma NOVA foto, validamos
    if (file && file.size > 0) {
        if (file.size > 5 * 1024 * 1024) { // 5MB
            toast.error("Arquivo muito grande", { description: "Máximo permitido: 5MB" });
            return;
        }
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            toast.error("Formato inválido", { description: "Use JPG, PNG ou WEBP." });
            return;
        }
    }

    // === 2. ENVIO PRO SERVIDOR ===
    // Precisamos enviar o ID junto para saber quem editar
    formData.append("id", data.id);

    const promise = updateBirthday(formData);

    toast.promise(promise, {
      loading: 'Atualizando dados...',
      success: 'Aniversariante atualizado com sucesso!',
      error: 'Erro ao atualizar. Tente novamente.',
    });
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 max-w-2xl mx-auto">
      
      <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Save size={18} className="text-blue-600" /> Editar Aniversariante
        </h3>
        <Link href="/admin/birthdays">
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-800">
                <ArrowLeft size={16} className="mr-1" /> Voltar
            </Button>
        </Link>
      </div>
      
      <form ref={formRef} action={handleSubmit} className="space-y-6">
        
        {/* FOTO ATUAL (Visualização) */}
        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0 bg-slate-200 flex items-center justify-center">
                {data.photoUrl ? (
                    <Image src={data.photoUrl} alt="Foto Atual" width={64} height={64} className="object-cover w-full h-full" />
                ) : (
                    <ImageIcon className="text-slate-400" />
                )}
            </div>
            <div>
                <p className="text-sm font-bold text-slate-700">Foto Atual</p>
                <p className="text-xs text-slate-500">Para trocar, basta selecionar um novo arquivo abaixo.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Nome Completo <span className="text-red-500">*</span></label>
                <input 
                    required 
                    defaultValue={data.studentName}
                    name="studentName" 
                    className="w-full p-2 border border-slate-300 rounded mt-1 text-sm focus:border-blue-500 outline-none" 
                />
            </div>
            
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Data Nasc. <span className="text-red-500">*</span></label>
                <input 
                    required 
                    defaultValue={formattedDate}
                    type="date" 
                    name="birthDate" 
                    className="w-full p-2 border border-slate-300 rounded mt-1 text-sm focus:border-blue-500 outline-none" 
                />
            </div>
            
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Turma/Cargo</label>
                <input 
                    defaultValue={data.class || ""}
                    name="class" 
                    className="w-full p-2 border border-slate-300 rounded mt-1 text-sm focus:border-blue-500 outline-none" 
                />
            </div>
        </div>

        <div>
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1 mb-1">
                Trocar Foto (Opcional)
            </label>
            <input 
                type="file" 
                name="photo" 
                accept="image/png, image/jpeg, image/webp" 
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border border-dashed border-slate-300 rounded-lg p-2" 
            />
            
            {/* ALERT BOX PADRÃO */}
            <div className="mt-3 bg-amber-50 border border-amber-100 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
                <div className="text-[11px] text-amber-800 leading-relaxed">
                    <strong>Regras da Imagem:</strong> JPG, PNG ou WEBP. Máximo 5MB.<br/>
                    Se não selecionar nada, a foto atual será mantida.
                </div>
            </div>
        </div>

        <div className="flex gap-3 pt-2">
            <Link href="/admin/birthdays" className="flex-1">
                <Button variant="outline" type="button" className="w-full font-bold">Cancelar</Button>
            </Link>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 font-bold shadow-md">
                Salvar Alterações
            </Button>
        </div>
      </form>
    </div>
  );
}