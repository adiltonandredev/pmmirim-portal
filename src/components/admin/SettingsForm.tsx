"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updateSettings, updateInstagramSettings } from "@/app/actions/settings";
import { Save, Globe, Phone, Building2, Image as ImageIcon, MapPin, Mail, Facebook, Instagram, Youtube, Clock, Info, Loader2, Upload, Award, Users } from "lucide-react";
import Image from "next/image";
import { useState, ChangeEvent } from "react";

interface SettingsProps {
  siteSettings: any;
  instagramSettings: any;
}

const formatCNPJ = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .substring(0, 18);
};

const formatPhone = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .substring(0, 15);
};

export function SettingsForm({ siteSettings, instagramSettings }: SettingsProps) {
  const [loadingGeneral, setLoadingGeneral] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(siteSettings?.logoUrl || null);
  const [cnpj, setCnpj] = useState(siteSettings?.cnpj || "");
  const [phone, setPhone] = useState(siteSettings?.contactPhone || "");
  const [loadingInsta, setLoadingInsta] = useState(false);

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Imagem muito grande (Máx 5MB)");
        return;
      }
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleCnpjChange = (e: ChangeEvent<HTMLInputElement>) => setCnpj(formatCNPJ(e.target.value));
  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => setPhone(formatPhone(e.target.value));

  async function handleSubmitGeneral(formData: FormData) {
    const cleanCNPJ = cnpj.replace(/\D/g, '');
    
    // Validar CNPJ se preenchido
    if (cleanCNPJ.length > 0 && cleanCNPJ.length !== 14) {
        toast.warning("CNPJ incompleto");
        return;
    }
    
    formData.set("cnpj", cnpj);
    formData.set("contactPhone", phone);

    setLoadingGeneral(true);
    try {
        await updateSettings(formData);
        toast.success("Dados institucionais salvos!");
    } catch (err) {
        toast.error("Erro ao salvar dados gerais.");
    } finally {
        setLoadingGeneral(false);
    }
  }

  async function handleSubmitInstagram(formData: FormData) {
    setLoadingInsta(true);
    try {
        await updateInstagramSettings(formData);
        toast.success("Integração do Instagram salva!");
    } catch (err) {
        toast.error("Erro ao salvar Instagram.");
    } finally {
        setLoadingInsta(false);
    }
  }

  return (
    <div className="space-y-12 pb-10">
      
      {/* === FORMULÁRIO 1: DADOS GERAIS === */}
      <form action={handleSubmitGeneral} className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200">
        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <Building2 className="text-blue-600" size={24} /> Dados Institucionais
        </h3>
        
        {/* Logo e Campos Principais */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="w-full md:w-auto flex flex-col items-center">
                <label className="text-xs font-bold text-slate-500 uppercase mb-2">Logo do Site</label>
                <div className="relative w-40 h-40 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center overflow-hidden group hover:border-blue-400 transition-colors">
                    {logoPreview ? (
                        <Image src={logoPreview} alt="Logo" fill className="object-contain p-4" />
                    ) : (
                        <div className="text-slate-400 flex flex-col items-center">
                            <ImageIcon size={32} />
                            <span className="text-[10px] mt-1">Upload</span>
                        </div>
                    )}
                    <input type="file" name="logo" accept="image/*" onChange={handleLogoChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Nome Fantasia</label>
                    <input name="siteName" defaultValue={siteSettings?.siteName || ""} className="w-full mt-1 p-3 border border-slate-300 rounded focus:border-blue-500 outline-none" />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">CNPJ</label>
                    <input name="cnpj" value={cnpj} onChange={handleCnpjChange} className="w-full mt-1 p-3 border border-slate-300 rounded focus:border-blue-500 outline-none" placeholder="00.000.000/0001-00"/>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Razão Social</label>
                    <input name="legalName" defaultValue={siteSettings?.legalName || ""} className="w-full mt-1 p-3 border border-slate-300 rounded focus:border-blue-500 outline-none" />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Descrição (SEO)</label>
                    <input name="description" defaultValue={siteSettings?.description || ""} className="w-full mt-1 p-3 border border-slate-300 rounded focus:border-blue-500 outline-none" placeholder="Descrição para o Google" />
                </div>
            </div>
        </div>

        {/* Contato */}
        <h3 className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2 mb-4 mt-8"><Phone size={16}/> Contato</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="text-xs font-bold text-slate-700">Telefone / WhatsApp</label>
                <input name="contactPhone" value={phone} onChange={handlePhoneChange} className="w-full mt-1 p-3 border border-slate-300 rounded outline-none" placeholder="(00) 00000-0000" />
            </div>
            <div>
                <label className="text-xs font-bold text-slate-700">Email</label>
                <input name="contactEmail" defaultValue={siteSettings?.contactEmail} className="w-full mt-1 p-3 border border-slate-300 rounded outline-none" />
            </div>
            <div>
                <label className="text-xs font-bold text-slate-700">Horário de Atendimento</label>
                <input name="businessHours" defaultValue={siteSettings?.businessHours} className="w-full mt-1 p-3 border border-slate-300 rounded outline-none" />
            </div>
            <div>
                <label className="text-xs font-bold text-slate-700">Endereço</label>
                <input name="address" defaultValue={siteSettings?.address} className="w-full mt-1 p-3 border border-slate-300 rounded outline-none" />
            </div>
        </div>

        {/* Redes Sociais */}
        <h3 className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2 mb-4 mt-8"><Globe size={16}/> Links Redes Sociais</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center border border-slate-300 rounded px-3 py-2">
                <Instagram size={18} className="text-pink-600 mr-2"/>
                <input name="instagramUrl" defaultValue={siteSettings?.instagramUrl} placeholder="Link Instagram" className="flex-1 outline-none text-sm"/>
            </div>
            <div className="flex items-center border border-slate-300 rounded px-3 py-2">
                <Facebook size={18} className="text-blue-700 mr-2"/>
                <input name="facebookUrl" defaultValue={siteSettings?.facebookUrl} placeholder="Link Facebook" className="flex-1 outline-none text-sm"/>
            </div>
            <div className="flex items-center border border-slate-300 rounded px-3 py-2">
                <Youtube size={18} className="text-red-600 mr-2"/>
                <input name="youtubeUrl" defaultValue={siteSettings?.youtubeUrl} placeholder="Link Youtube" className="flex-1 outline-none text-sm"/>
            </div>
        </div>

        {/* --- NOVO: ESTATÍSTICAS DA PÁGINA PROJETOS --- */}
        <h3 className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2 mb-4 mt-8 pt-6 border-t border-slate-100">
            <Users size={16}/> Estatísticas de Impacto
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-lg border border-slate-200">
            <div>
                <label className="text-xs font-bold text-slate-700">Jovens Impactados</label>
                <input 
                    name="impactedYouth" 
                    defaultValue={siteSettings?.impactedYouth || "500+"} 
                    className="w-full mt-1 p-3 border border-slate-300 rounded outline-none focus:border-blue-500" 
                    placeholder="Ex: 1200+" 
                />
                <p className="text-[10px] text-slate-500 mt-1">Texto exibido no card "Jovens Impactados" na página Projetos.</p>
            </div>
            <div>
                <label className="text-xs font-bold text-slate-700">Anos de História</label>
                <input 
                    name="yearsOfHistory" 
                    defaultValue={siteSettings?.yearsOfHistory || "15"} 
                    className="w-full mt-1 p-3 border border-slate-300 rounded outline-none focus:border-blue-500" 
                    placeholder="Ex: 15" 
                />
                 <p className="text-[10px] text-slate-500 mt-1">Texto exibido no card "Anos de História".</p>
            </div>
        </div>

        <div className="flex justify-end pt-6 mt-6 border-t border-slate-100">
            <Button disabled={loadingGeneral} type="submit" className="bg-slate-800 hover:bg-slate-900 font-bold h-12 px-8">
                {loadingGeneral ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2" size={18}/>} Salvar Dados Gerais
            </Button>
        </div>
      </form>

      {/* === FORMULÁRIO 2: INSTAGRAM === */}
      <form action={handleSubmitInstagram} className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden ring-1 ring-pink-100">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"></div>

        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4 mt-2">
            <Instagram className="text-pink-600" size={24} /> Integração API Instagram
        </h3>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 text-sm text-blue-800 flex items-start gap-3">
            <Info className="shrink-0 mt-0.5" size={18} />
            <div>
                <strong className="block mb-1">Como funciona?</strong>
                Insira o token gerado no Facebook Developers para exibir as fotos mais recentes no rodapé do site.
            </div>
        </div>

        <input type="hidden" name="id" value={instagramSettings?.id || ""} />

        <div className="space-y-4">
            <div>
                <label className="text-sm font-bold text-slate-700">Usuário (@)</label>
                <input name="username" defaultValue={instagramSettings?.username} placeholder="@usuario" className="w-full mt-1 p-3 border border-slate-300 rounded focus:border-pink-500 outline-none" />
            </div>
            
            <div>
                <label className="text-sm font-bold text-slate-700">Token de Acesso (Long Lived)</label>
                <textarea name="accessToken" rows={3} defaultValue={instagramSettings?.accessToken} placeholder="Cole o token aqui..." className="w-full mt-1 p-3 border border-slate-300 rounded focus:border-pink-500 outline-none font-mono text-xs text-slate-600" />
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <input type="checkbox" id="showFeed" name="showFeed" defaultChecked={instagramSettings?.showFeed ?? true} className="w-5 h-5 text-pink-600 rounded cursor-pointer" />
                <label htmlFor="showFeed" className="font-bold text-slate-700 cursor-pointer">Ativar Feed no Rodapé</label>
            </div>
        </div>

        <div className="flex justify-end pt-6 mt-6 border-t border-slate-100">
            <Button disabled={loadingInsta} type="submit" className="bg-pink-600 hover:bg-pink-700 font-bold h-12 px-8 shadow-lg shadow-pink-200/50">
                {loadingInsta ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2" size={18}/>} Salvar Integração
            </Button>
        </div>
      </form>

    </div>
  );
}