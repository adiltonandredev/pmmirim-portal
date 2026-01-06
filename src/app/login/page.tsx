"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // Tenta fazer o login usando o NextAuth
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false, // Não redireciona automático para podermos tratar erros
      });

      if (result?.error) {
        setError("E-mail ou senha incorretos.");
        setLoading(false);
      } else {
        // Sucesso! Vai para o painel admin
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <Card className="w-full max-w-md bg-white shadow-2xl border-0">
        <CardHeader className="space-y-1 flex flex-col items-center pb-2">
          <div className="bg-slate-100 p-3 rounded-full mb-2">
            <ShieldAlert className="w-8 h-8 text-blue-900" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-slate-900">
            Painel Administrativo
          </CardTitle>
          <CardDescription className="text-center">
            Acesso restrito à coordenação da PMMIRIM
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail Institucional</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input 
                  id="email" 
                  name="email"
                  placeholder="admin@pmmirim.org.br" 
                  type="email" 
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha de Acesso</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input 
                  id="password" 
                  name="password"
                  type={showPassword ? "text" : "password"} 
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800" disabled={loading}>
              {loading ? "Verificando..." : "Entrar no Sistema"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-900 hover:underline">
            ← Voltar para o site
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}