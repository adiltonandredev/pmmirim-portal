"use client"

import { useState, useRef } from "react"
import { uploadGalleryImages } from "@/app/actions/gallery"
import { Button } from "@/components/ui/button"
import { UploadCloud, X, Save, Loader2, ImagePlus, FileImage, Maximize2, AlertCircle, Plus } from "lucide-react"

interface GalleryUploaderProps {
  galleryId: string
}

export function GalleryUploader({ galleryId }: GalleryUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    const maxSize = 4 * 1024 * 1024 // 4MB

    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, msg: `O arquivo "${file.name}" não é JPG ou PNG.` }
    }
    if (file.size > maxSize) {
      return { isValid: false, msg: `O arquivo "${file.name}" é maior que 4MB.` }
    }
    return { isValid: true }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files)
      const validFiles: File[] = []
      const newPreviews: string[] = []

      for (const file of selectedFiles) {
        const validation = validateFile(file)
        if (!validation.isValid) {
            setError(validation.msg || "Erro ao adicionar arquivo.")
            return 
        }
        validFiles.push(file)
        newPreviews.push(URL.createObjectURL(file))
      }
      
      setFiles((prev) => [...prev, ...validFiles])
      setPreviews((prev) => [...prev, ...newPreviews])
    }
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index])
    setFiles(files.filter((_, i) => i !== index))
    setPreviews(previews.filter((_, i) => i !== index))
    if (files.length === 1) setError(null)
  }

  const clearAll = () => {
    previews.forEach(url => URL.revokeObjectURL(url))
    setFiles([])
    setPreviews([])
    setError(null)
  }

  const handleUpload = async () => {
    if (files.length === 0) return
    setLoading(true)
    const formData = new FormData()
    files.forEach((file) => formData.append("images", file))
    await uploadGalleryImages(galleryId, formData)
    clearAll()
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
      
      <div className="p-4 md:p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                <ImagePlus size={20} />
            </div>
            <div>
                <h3 className="font-bold text-slate-800 text-sm md:text-base">Adicionar Fotos</h3>
                <p className="text-xs text-slate-500 hidden md:block">Envie múltiplas imagens para este álbum</p>
            </div>
        </div>
        {files.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAll} className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 md:h-9 px-3 md:px-4 font-bold text-xs md:text-sm">
                Cancelar
            </Button>
        )}
      </div>

      <div className="p-4 md:p-6">
        
        {error && (
            <div className="mb-6 bg-red-50 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 text-sm border border-red-200 shadow-sm animate-in slide-in-from-top-2 font-medium">
                <AlertCircle size={20} className="shrink-0 text-red-600" />
                <span>{error}</span>
            </div>
        )}

        {files.length === 0 ? (
           <div className="relative group">
              <label 
                  htmlFor="multiUpload"
                  className={`
                    relative flex flex-col items-center justify-center w-full min-h-[220px] md:min-h-[280px] rounded-2xl cursor-pointer transition-all overflow-hidden bg-slate-50/50
                    border-4 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/30
                  `}
              >
                  <div className="flex flex-col items-center justify-center p-6 md:p-8 text-center w-full h-full">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-4 md:mb-5 shadow-sm transition-transform duration-300 bg-blue-100 text-blue-600 border-4 border-blue-50 group-hover:scale-110 group-hover:rotate-3">
                          <UploadCloud size={32} className="md:w-10 md:h-10" />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold mb-2 text-slate-800">
                          Selecione as fotos
                      </h3>
                      <p className="text-slate-500 text-xs md:text-base font-medium mb-4 md:mb-6">
                          Você pode selecionar várias de uma vez
                      </p>
                      
                      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 text-xs md:text-sm font-bold text-slate-600 bg-white/80 px-4 py-2 md:px-6 md:py-3 rounded-xl border border-slate-200 shadow-sm">
                          <div className="flex items-center gap-2">
                              <FileImage size={14} className="text-blue-500 md:w-4 md:h-4" />
                              <span>JPG, PNG</span>
                          </div>
                          <div className="w-px h-4 bg-slate-300"></div>
                          <div className="flex items-center gap-2">
                              <Maximize2 size={14} className="text-orange-500 md:w-4 md:h-4" />
                              <span>4MB</span>
                          </div>
                      </div>
                  </div>

                  <input 
                      id="multiUpload"
                      type="file" 
                      multiple 
                      accept="image/png, image/jpeg, image/webp" 
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                  />
              </label>
           </div>
        ) : (
           <div className="space-y-6 animate-in fade-in duration-300">
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                  {previews.map((src, index) => (
                      <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-sm group bg-white">
                          <img src={src} alt="Preview" className="w-full h-full object-cover" />
                          <button 
                            onClick={() => removeFile(index)}
                            className="absolute top-1.5 right-1.5 bg-white/90 text-red-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:text-white shadow-md transform hover:scale-110"
                          >
                              <X size={14} />
                          </button>
                      </div>
                  ))}
                  
                  <label className="relative aspect-square rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 cursor-pointer transition-all group bg-slate-50">
                      <Plus size={24} className="mb-1 group-hover:scale-110 transition-transform md:w-8 md:h-8" />
                      <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">Adicionar</span>
                      <input 
                          type="file" 
                          multiple 
                          accept="image/*" 
                          className="hidden"
                          onChange={handleFileSelect}
                      />
                  </label>
              </div>

              {/* BARRA DE AÇÃO AGORA ADAPTADA PARA MOBILE (flex-col no mobile) */}
              <div className="flex flex-col sm:flex-row items-center justify-between bg-blue-50 p-4 md:p-5 rounded-xl border border-blue-100 gap-4">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="bg-blue-600 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-sm text-sm shrink-0">
                        {files.length}
                      </div>
                      <div className="text-blue-900 text-sm font-medium leading-tight">
                          <strong className="block text-blue-950 text-sm md:text-base">Fotos selecionadas</strong>
                          <span className="text-xs md:text-sm">Prontas para envio.</span>
                      </div>
                  </div>
                  
                  <Button onClick={handleUpload} disabled={loading} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg shadow-green-100 h-12 px-6 text-base">
                      {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={20} />}
                      {loading ? "Enviando..." : "Confirmar Envio"}
                  </Button>
              </div>
           </div>
        )}
      </div>
    </div>
  )
}