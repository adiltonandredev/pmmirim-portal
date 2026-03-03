"use client";

import { useRef, useState, ChangeEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createFeaturedStudent, updateFeaturedStudent } from "@/app/actions/students"; 
import { ArrowLeft, X, UploadCloud, User, Star, GraduationCap, Calendar, BookOpen } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Interface Flexível
export interface StudentData {
  id: string;
  studentName: string;
  achievement: string;
  class: string | null;
  description: string | null;
  photoUrl: string | null;
  month: number;
  year: number;
  active: boolean;
  [key: string]: unknown;
}

export function FeaturedStudentForm({ student }: { student?: StudentData | null }) {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState<string | null>(student?.photoUrl || null);
  const [isPending, setIsPending] = useState(false);

  // Dados atuais para padrão
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.warning("Arquivo muito grande!", { description: "Máximo 5MB." });
        return;
      }
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

  function handleRemoveImage() {
    setPreviewUrl(null);
    if (formRef.current) {
        const input = formRef.current.querySelector('input[name="photoUrl"]') as HTMLInputElement;
        if (input) input.value = "";
    }
  }

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const action = student ? updateFeaturedStudent : createFeaturedStudent;

    try {
        if (student?.id) {
            formData.set("id", student.id);
            if (!formData.get("photoUrl") || (formData.get("photoUrl") as File).size === 0) {
                 if (student.photoUrl) formData.set("existingPhotoUrl", student.photoUrl);
            }
        }
        
        await action(formData);
        toast.success(student ? "Atualizado com sucesso!" : "Aluno Destaque criado!");
        router.refresh();
        setTimeout(() => router.push("/admin/featured-student"), 500); 
    } catch (error) {
        console.error(error);
        toast.error("Erro ao salvar.");
        setIsPending(false);
    }
  }

  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
      
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            {student ? "Editar Destaque" : "Novo Aluno Destaque"}
            </h1>
            <p className="text-slate-500 text-sm mt-1">Configure quem será exibido no quadro de honra.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft size={16} className="mr-1" /> Voltar
        </Button>
      </div>
      
      <form ref={formRef} action={handleSubmit} className="space-y-6">
        {student && <input type="hidden" name="id" value={student.id} />}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* COLUNA ESQUERDA: DADOS */}
            <div className="md:col-span-2 space-y-6">
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-4">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2 mb-2">
                        <GraduationCap size={18} className="text-yellow-600"/> Dados do Aluno
                    </h3>
                    
                    {/* Nome e Turma */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                             <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Nome Completo *</label>
                             <input required defaultValue={student?.studentName} name="studentName" className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500" placeholder="Ex: João da Silva" />
                        </div>
                        <div>
                             <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Turma / Pelotão</label>
                             <input defaultValue={student?.class || ""} name="class" className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500" placeholder="Ex: Alfa Matutino" />
                        </div>
                    </div>

                    {/* Conquista (Título Principal) */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block flex items-center gap-1"><Star size={12}/> Motivo do Destaque (Título)</label>
                        <input required defaultValue={student?.achievement} name="achievement" className="w-full p-3 border border-slate-300 rounded-lg font-bold text-yellow-700 outline-none focus:ring-2 focus:ring-yellow-500" placeholder="Ex: Melhor Nota em Disciplina" />
                    </div>

                    {/* Descrição (Bio) */}
                    <div>
                         <label className="text-xs font-bold text-slate-500 uppercase mb-1 block flex items-center gap-1"><BookOpen size={12}/> Descrição / Biografia</label>
                         <textarea defaultValue={student?.description || ""} name="description" rows={4} className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500" placeholder="Conte um pouco sobre a conquista do aluno..." />
                    </div>
                </div>

                {/* Seleção de Data de Referência */}
                <div className="bg-white p-4 border border-slate-200 rounded-xl flex gap-4 items-center">
                    <Calendar className="text-slate-400" />
                    <div className="grid grid-cols-2 gap-4 flex-1">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Mês de Referência</label>
                            <select name="month" defaultValue={student?.month || currentMonth} className="w-full p-2 border border-slate-300 rounded-lg bg-white">
                                {months.map((m, i) => (
                                    <option key={i} value={i + 1}>{m}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Ano</label>
                            <select name="year" defaultValue={student?.year || currentYear} className="w-full p-2 border border-slate-300 rounded-lg bg-white">
                                {[currentYear - 1, currentYear, currentYear + 1].map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-4 border border-slate-100 rounded-xl bg-white shadow-sm">
                    <input type="checkbox" name="active" id="active" defaultChecked={student ? student.active : true} className="w-5 h-5 text-yellow-600 rounded focus:ring-yellow-500 cursor-pointer" />
                    <label htmlFor="active" className="text-sm font-bold text-slate-700 cursor-pointer select-none">Exibir na Página Inicial</label>
                </div>
            </div>

            {/* COLUNA DIREITA: FOTO */}
            <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-yellow-400 transition-colors">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-3 block text-center">Foto Oficial</label>
                    
                    <div className="relative group w-full aspect-[3/4] bg-slate-50 rounded-lg overflow-hidden border border-slate-100 mx-auto max-w-[200px] shadow-sm">
                        {previewUrl ? (
                            <>
                                <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center text-white cursor-pointer pointer-events-none">
                                    <UploadCloud size={24} className="mb-1"/>
                                    <span className="text-xs font-bold">Trocar</span>
                                </div>
                                <button type="button" onClick={handleRemoveImage} className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-md z-10" title="Remover"><X size={12} /></button>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 p-4 text-center">
                                <div className="bg-white p-3 rounded-full mb-3 shadow-sm">
                                    <User size={24} className="text-slate-300" />
                                </div>
                                <span className="text-[10px] font-medium text-slate-500">Nenhuma foto</span>
                            </div>
                        )}
                        <input type="file" name="photoUrl" accept="image/png, image/jpeg, image/jpg, image/webp" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    </div>
                    <p className="text-[10px] text-slate-400 text-center mt-2 font-medium">Formato vertical (3:4) recomendado.</p>
                </div>

                <Button type="submit" disabled={isPending} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold h-12 shadow-md hover:shadow-lg transition-all disabled:opacity-70">
                    {isPending ? "Salvando..." : (student ? "Salvar Alterações" : "Cadastrar Destaque")}
                </Button>
            </div>
        </div>
      </form>
    </div>
  );
}