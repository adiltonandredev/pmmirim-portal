"use client"

import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LogoutButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <LogOut size={16} />
      Sair
    </Button>
  )
}
