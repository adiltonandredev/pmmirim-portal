"use client"

import { LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

export function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/' })} // Redireciona para home após sair
      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-slate-400 hover:bg-red-500/10 hover:text-red-400 text-sm font-medium"
    >
      <LogOut size={18} />
      <span>Sair do Sistema</span>
    </button>
  )
}