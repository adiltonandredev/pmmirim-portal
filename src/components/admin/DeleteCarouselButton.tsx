"use client"

import { deleteCarouselItem } from "@/app/actions/deleteCarouselItem"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useState } from "react"

export function DeleteCarouselButton({ itemId }: { itemId: string }) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir este slide?")) return
    
    setLoading(true)
    await deleteCarouselItem(itemId)
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
      className="gap-2"
    >
      <Trash2 size={16} />
      {loading ? "Excluindo..." : "Excluir"}
    </Button>
  )
}
