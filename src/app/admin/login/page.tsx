"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Mail, Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Tenta logar usando as credenciais do seu sistema
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false, // Não redireciona automático para podermos controlar
      });

      if (result?.error) {
        setError("Email ou senha incorretos.");
        setLoading(false);
      } else {
        // Login com sucesso! Redireciona para o admin
        router.push("/admin"); 
        router.refresh();
      }
    } catch (err) {
      setError("Ocorreu um erro ao tentar entrar.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden">
      
      {/* Elementos de Fundo */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-yellow-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      {/* Card de Login */}
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl relative z-10 mx-4">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
            <Shield size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Acesso Restrito</h1>
          <p className="text-sm text-slate-500 mt-1">
            Painel Administrativo da Polícia Mirim
          </p>
        </div>

        {/* Mensagem de Erro (se houver) */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm animate-pulse">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="email">
              E-mail Oficial
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail size={20} />
              </div>
              <input 
                id="email"
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="seu@email.com"
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-slate-700" htmlFor="password">
                Senha
              </label>
              
              {/* --- NOVO: Link de Recuperação de Senha --- */}
              <Link 
                href="/login/esqueci-senha" 
                className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                Esqueceu a senha?
              </Link>
              {/* ------------------------------------------ */}

            </div>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock size={20} />
              </div>
              <input 
                id="password"
                type="password" 
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-800"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> Entrando...
              </>
            ) : (
              <>
                Acessar Painel <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <Link href="/" className="text-sm text-slate-500 hover:text-blue-700 font-medium flex items-center justify-center gap-2">
            ← Voltar para o Site
          </Link>
        </div>

      </div>
      
      <div className="absolute bottom-4 text-slate-500 text-xs text-center w-full opacity-50">
        &copy; {new Date().getFullYear()} Sistema de Gestão PMMIRIM. Acesso monitorado.
      </div>
    </div>
  );
}