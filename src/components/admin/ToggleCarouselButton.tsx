"use client"

import { toggleCarouselItem } from "@/app/actions/toggleCarouselItem"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

export function ToggleCarouselButton({ itemId, isActive }: { itemId: string; isActive: boolean }) {
  async function handleToggle() {
    await toggleCarouselItem(itemId)
  }

  return (
    <Button
      variant={isActive ? "outline" : "default"}
      size="sm"
      onClick={handleToggle}
      className="gap-2"
    >
      {isActive ? <EyeOff size={16} /> : <Eye size={16} />}
      {isActive ? "Desativar" : "Ativar"}
    </Button>
  )
}
