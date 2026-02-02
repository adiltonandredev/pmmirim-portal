"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Loader2, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";

// Componente do Formulário (separado para usar Suspense)
function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Pega o código da URL

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (password !== confirm) {
      setMsg("As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      setMsg("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setStatus("loading");
    setMsg("");

    try {
        const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
        });

        if (res.ok) {
        setStatus("success");
        setTimeout(() => router.push("/login"), 3000); // Redireciona após 3s
        } else {
        setStatus("error");
        setMsg("O link é inválido ou expirou. Solicite novamente.");
        }
    } catch (error) {
        setStatus("error");
        setMsg("Erro de conexão.");
    }
  };

  // Se não tiver token na URL, mostra erro
  if (!token) {
    return (
        <div className="text-center text-red-500 p-4">
            <AlertCircle className="mx-auto mb-2" size={40} />
            <p>Link inválido ou incompleto.</p>
        </div>
    )
  }

  // Tela de Sucesso
  if (status === "success") {
    return (
      <div className="text-center animate-in zoom-in">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Senha Alterada!</h2>
        <p className="text-slate-600 mt-2">Sua senha foi atualizada com sucesso.</p>
        <div className="mt-6 p-3 bg-slate-50 rounded-lg text-sm text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" size={14} /> Redirecionando para login...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-16 h-16 bg-blue-50 text-blue-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
        <Lock size={32} />
      </div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2 text-center">Criar Nova Senha</h1>
      <p className="text-slate-500 mb-6 text-sm text-center">Digite sua nova senha segura abaixo.</p>

      {msg && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 flex items-center gap-2 animate-pulse">
          <AlertCircle size={16} /> {msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Nova Senha */}
        <div className="relative">
             <input 
                type={showPass ? "text" : "password"}
                required 
                placeholder="Nova Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
             />
             <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
             </button>
        </div>

        {/* Confirmar */}
        <input 
          type="password" 
          required 
          placeholder="Confirmar Nova Senha"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
        />
        
        <button 
          type="submit" 
          disabled={status === "loading"}
          className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-lg transition-all flex justify-center items-center gap-2 shadow-lg hover:-translate-y-1"
        >
          {status === "loading" ? <Loader2 className="animate-spin" /> : "Salvar Nova Senha"}
        </button>
      </form>
    </>
  );
}

// Componente Principal (Com Suspense para evitar erro de build no Next.js)
export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 relative">
       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
       <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl relative z-10">
        <Suspense fallback={<div className="text-center p-10"><Loader2 className="animate-spin mx-auto text-blue-900" /></div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}