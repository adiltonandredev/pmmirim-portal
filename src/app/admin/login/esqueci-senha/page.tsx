"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 relative overflow-hidden">
      {/* Fundo decorativo igual ao login */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl relative z-10">
        
        {status === "success" ? (
          // TELA DE SUCESSO
          <div className="text-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Verifique seu E-mail</h2>
            <p className="text-slate-600 mt-2 mb-6">
              Se o e-mail <strong>{email}</strong> estiver cadastrado, você receberá um link em instantes.
            </p>
            <Link href="/login" className="text-blue-900 font-bold hover:underline bg-blue-50 px-6 py-3 rounded-lg block w-full">
              Voltar para Login
            </Link>
          </div>
        ) : (
          // TELA DE FORMULÁRIO
          <>
            <div className="w-16 h-16 bg-blue-50 text-blue-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
              <Mail size={32} />
            </div>
            
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Recuperar Acesso</h1>
                <p className="text-slate-500 text-sm">
                Digite seu e-mail oficial para receber as instruções de redefinição de senha.
                </p>
            </div>

            {status === "error" && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                    <AlertCircle size={16} /> Erro ao enviar. Tente novamente.
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                  <label htmlFor="email" className="sr-only">E-mail</label>
                  <input 
                    type="email" 
                    id="email"
                    required 
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none transition-all"
                  />
              </div>
              
              <button 
                type="submit" 
                disabled={status === "loading"}
                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-lg transition-all flex justify-center items-center gap-2 shadow-lg hover:-translate-y-1"
              >
                {status === "loading" ? <Loader2 className="animate-spin" /> : "Enviar Link de Recuperação"}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <Link href="/login" className="text-sm text-slate-500 hover:text-blue-900 font-medium flex items-center justify-center gap-2 transition-colors">
                <ArrowLeft size={16} /> Voltar para o Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}