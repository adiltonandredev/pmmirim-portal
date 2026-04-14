"use client"

import { useState, useRef } from "react"
import { updateGalleryTitle } from "@/server/actions/gallery"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Pencil, Check, X, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface GalleryTitleFormProps {
  galleryId: string
  currentTitle: string
}

export function GalleryTitleForm({ galleryId, currentTitle }: GalleryTitleFormProps) {
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState(currentTitle)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleEdit = () => {
    setEditing(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const handleCancel = () => {
    setValue(currentTitle)
    setEditing(false)
  }

  const handleSave = async () => {
    if (value.trim() === currentTitle) { setEditing(false); return }
    setLoading(true)
    const result = await updateGalleryTitle(galleryId, value)
    setLoading(false)
    if (result.success) {
      toast.success(result.message)
      setEditing(false)
    } else {
      toast.error(result.message)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave()
    if (e.key === "Escape") handleCancel()
  }

  if (!editing) {
    return (
      <button
        onClick={handleEdit}
        className="group flex items-center gap-2 text-left hover:opacity-80 transition-opacity"
        title="Clique para editar o nome"
      >
        <span className="font-bold text-slate-800 text-xl leading-tight">{value}</span>
        <Pencil size={15} className="text-slate-400 group-hover:text-blue-500 transition-colors shrink-0 mt-0.5" />
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2 w-full max-w-md">
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
        className="h-9 text-base font-bold border-blue-300 focus:border-blue-500"
      />
      <Button
        size="sm"
        onClick={handleSave}
        disabled={loading}
        className="h-9 w-9 p-0 bg-green-600 hover:bg-green-700 text-white shrink-0"
      >
        {loading ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleCancel}
        disabled={loading}
        className="h-9 w-9 p-0 text-slate-500 hover:text-red-500 shrink-0"
      >
        <X size={15} />
      </Button>
    </div>
  )
}
