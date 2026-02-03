"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { saveAlbum, deleteAlbum, deletePhoto, uploadAlbumPhotos } from "@/app/actions/gallery"
import { uploadImage } from "@/app/actions/upload"
import { Button } from "@/components/ui/button"
import { Trash2, Edit, Plus, Save, X, Upload, Image as ImageIcon, Calendar, ArrowLeft, Loader2, FolderOpen } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

export function AlbumManager({ initialAlbums }: { initialAlbums: any[] }) {
  const [albums, setAlbums] = useState(initialAlbums)
  const [view, setView] = useState<'list' | 'edit'>('list')
  const [currentAlbum, setCurrentAlbum] = useState<any>(null)
  
  // Estados de Loading
  const [isSavingAlbum, setIsSavingAlbum] = useState(false)
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false)
  
  // Estados para Upload de Fotos (Drag & Drop)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  
  const coverInputRef = useRef<HTMLInputElement>(null)
  const photosInputRef = useRef<HTMLInputElement>(null)

  // --- EFEITO PARA GERAR PREVIEWS ---
  useEffect(() => {
    // Cria URLs temporárias para as imagens selecionadas
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file))
    setPreviews(newPreviews)

    // Limpeza de memória quando os arquivos mudam
    return () => newPreviews.forEach(url => URL.revokeObjectURL(url))
  }, [selectedFiles])

  // --- NAVEGAÇÃO ---
  function handleNew() { setCurrentAlbum({}); setView('edit'); setSelectedFiles([]) }
  function handleEdit(album: any) { setCurrentAlbum(album); setView('edit'); setSelectedFiles([]) }
  function handleBack() { window.location.reload() } // Recarrega para garantir dados frescos

  // --- CAPA DO ÁLBUM ---
  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const toastId = toast.loading("Enviando capa...")
    try {
      const formData = new FormData()
      formData.append('file', file)
      const url = await uploadImage(formData)
      setCurrentAlbum({ ...currentAlbum, coverImage: url })
      toast.success("Capa atualizada!", { id: toastId })
    } catch (e) { toast.error("Erro no upload da capa", { id: toastId }) }
  }

  // --- SALVAR DADOS DO ÁLBUM ---
  async function handleSaveAlbum(formData: FormData) {
    setIsSavingAlbum(true)
    try {
        if (currentAlbum.coverImage) formData.set("coverImage", currentAlbum.coverImage)
        await saveAlbum(formData)
        toast.success("Dados do álbum salvos com sucesso!")
        
        // CORREÇÃO: Removemos o 'if' para que ele SEMPRE recarregue a página
        // Isso garante que tanto 'Novo' quanto 'Editar' voltem para a lista atualizada
        setTimeout(() => window.location.reload(), 1000)

    } catch (error) { toast.error("Erro ao salvar.") } 
    finally { setIsSavingAlbum(false) }
  }

  // CORREÇÃO 1: Delete via FormData
  async function handleDeleteAlbum(id: string) {
    if (!confirm("Isso apagará o álbum e todas as fotos. Confirmar?")) return
    
    const formData = new FormData()
    formData.append("id", id)
    
    await deleteAlbum(formData)
    toast.success("Álbum removido.")
    window.location.reload()
  }

  // --- LÓGICA DE DRAG & DROP E SELEÇÃO ---
  
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'))
      setSelectedFiles(prev => [...prev, ...newFiles])
    }
  }, [])

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setSelectedFiles(prev => [...prev, ...newFiles])
    }
  }

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  // --- UPLOAD FINAL DAS FOTOS ---
  async function handleConfirmUpload() {
    if (selectedFiles.length === 0) return
    if (!currentAlbum.id) {
        toast.warning("Salve o álbum antes de enviar fotos.")
        return
    }

    setIsUploadingPhotos(true)
    const toastId = toast.loading(`Enviando ${selectedFiles.length} fotos... Aguarde.`)
    
    try {
        const formData = new FormData()
        selectedFiles.forEach(file => {
           // CORREÇÃO 2: Nome do campo deve ser 'photos' para bater com a Action
           formData.append("photos", file)
        })

        // CORREÇÃO 3: Enviando tudo num único argumento
        formData.append("albumId", currentAlbum.id)
        
        const result = await uploadAlbumPhotos(formData)
        
        if (result && result.success) {
           toast.success(`${result.count} fotos enviadas com sucesso!`, { id: toastId })
           setSelectedFiles([]) // Limpa a seleção
           
           setTimeout(() => {
             window.location.reload()
           }, 1500)
        } else {
           toast.error(result?.error || "Erro ao processar.", { id: toastId })
        }

    } catch (e) {
        toast.error("Erro de conexão. Tente enviar menos fotos por vez.", { id: toastId })
    } finally {
        setIsUploadingPhotos(false)
    }
  }

  // CORREÇÃO 4: Delete Foto via FormData
  async function handleDeletePhoto(photoId: string) {
     if(!confirm("Apagar esta foto?")) return
     
     const formData = new FormData()
     formData.append("id", photoId)
     
     await deletePhoto(formData)
     
     const updatedPhotos = currentAlbum.photos.filter((p: any) => p.id !== photoId)
     setCurrentAlbum({ ...currentAlbum, photos: updatedPhotos })
     toast.success("Foto removida")
  }

  // === RENDERIZAÇÃO: LISTA ===
  if (view === 'list') {
    return (
      <div className="space-y-6 animate-in fade-in">
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200 gap-4">
           <div>
              <h2 className="font-bold text-slate-800 text-xl">Seus Álbuns</h2>
              <p className="text-slate-500">Gerencie as galerias de fotos dos eventos</p>
           </div>
           <Button onClick={handleNew} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-md w-full md:w-auto h-12">
              <Plus size={20} /> Novo Álbum
           </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {albums.length === 0 && (
              <div className="col-span-full py-20 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                  <ImageIcon className="mx-auto text-slate-300 mb-4" size={48} />
                  <p className="text-slate-500 font-medium">Nenhum álbum criado ainda.</p>
              </div>
           )}

           {albums.map((album) => (
             <div key={album.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="h-52 bg-slate-100 relative overflow-hidden">
                   {album.coverImage ? (
                     <Image src={album.coverImage} alt={album.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                   ) : (
                     <div className="flex items-center justify-center h-full text-slate-400 bg-slate-50"><ImageIcon size={48} opacity={0.2}/></div>
                   )}
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button variant="secondary" onClick={() => handleEdit(album)} className="shadow-lg"><Edit size={16} className="mr-2"/> Editar</Button>
                   </div>
                </div>
                <div className="p-5">
                   <h3 className="font-bold text-slate-800 truncate text-lg mb-1">{album.title}</h3>
                   <div className="flex justify-between items-center text-sm text-slate-500 mt-3 border-t border-slate-100 pt-3">
                      <span className="flex items-center gap-1.5"><Calendar size={14} className="text-blue-500"/> {new Date(album.date).toLocaleDateString('pt-BR')}</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded-full text-xs font-bold">{album.photos?.length || 0} FOTOS</span>
                   </div>
                   <Button variant="ghost" size="sm" className="w-full mt-3 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteAlbum(album.id)}>
                      <Trash2 size={14} className="mr-2"/> Excluir Álbum
                   </Button>
                </div>
             </div>
           ))}
        </div>
      </div>
    )
  }

  // === RENDERIZAÇÃO: EDIÇÃO ===
  return (
    <div className="space-y-6 bg-white rounded-xl shadow-lg border border-slate-200 p-6 md:p-8 animate-in fade-in zoom-in-95">
       <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-6">
         <div className="flex items-center gap-4">
             <Button variant="outline" size="icon" onClick={handleBack} className="rounded-full"><ArrowLeft size={20}/></Button>
             <div>
                <h2 className="text-2xl font-bold text-slate-800">{currentAlbum.id ? "Editar Álbum" : "Novo Álbum"}</h2>
                {currentAlbum.id && <p className="text-xs text-slate-400 font-mono mt-1">ID: {currentAlbum.id}</p>}
             </div>
         </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         
         {/* --- COLUNA ESQUERDA: DADOS --- */}
         <div className="lg:col-span-4 space-y-6">
             <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><ImageIcon size={18}/> Capa do Álbum</h3>
                <div className="relative w-full aspect-video bg-white rounded-lg border-2 border-dashed border-slate-300 overflow-hidden mb-4 group cursor-pointer hover:border-blue-400 transition-colors" onClick={() => coverInputRef.current?.click()}>
                   {currentAlbum.coverImage ? (
                      <Image src={currentAlbum.coverImage} alt="Capa" fill className="object-cover" />
                   ) : (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400">
                         <Upload size={32} className="mb-2 opacity-50"/> 
                         <span className="text-xs font-medium">Clique para enviar capa</span>
                      </div>
                   )}
                   <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm font-bold flex items-center gap-2"><Upload size={16}/> Alterar Capa</p>
                   </div>
                </div>
                <input type="file" ref={coverInputRef} onChange={handleCoverUpload} className="hidden" accept="image/*"/>
             </div>

             <form action={handleSaveAlbum} className="space-y-5">
                <input type="hidden" name="id" value={currentAlbum.id || ""} />
                <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700">Título do Evento *</label>
                   <input name="title" defaultValue={currentAlbum.title} required className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Formatura 2025" />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700">Data *</label>
                   <input type="date" name="date" defaultValue={currentAlbum.date ? new Date(currentAlbum.date).toISOString().split('T')[0] : ''} required className="w-full p-3 border border-slate-300 rounded-lg outline-none" />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700">Descrição</label>
                   <textarea name="description" defaultValue={currentAlbum.description} rows={4} className="w-full p-3 border border-slate-300 rounded-lg resize-none outline-none" placeholder="Detalhes do evento..." />
                </div>
                <Button type="submit" disabled={isSavingAlbum} className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-bold shadow-md">
                   {isSavingAlbum ? <Loader2 className="animate-spin mr-2"/> : <Save size={18} className="mr-2"/>}
                   {isSavingAlbum ? "Salvando..." : "Salvar Dados"}
                </Button>
             </form>
         </div>

         {/* --- COLUNA DIREITA: FOTOS (DRAG & DROP) --- */}
         <div className="lg:col-span-8 flex flex-col h-full min-h-[600px]">
             
             {/* 1. Área de Drag & Drop */}
             {currentAlbum.id ? (
                <div className="mb-6 space-y-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2"><FolderOpen size={18} className="text-blue-600"/> Adicionar Novas Fotos</h3>
                    
                    {/* DROP ZONE */}
                    <div 
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        onClick={() => photosInputRef.current?.click()}
                        className={`
                            border-3 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all
                            ${isDragging ? 'border-blue-500 bg-blue-50 scale-[1.01]' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}
                        `}
                    >
                        <input type="file" ref={photosInputRef} onChange={onFileSelect} multiple accept="image/*" className="hidden" />
                        <div className="bg-white p-4 rounded-full shadow-sm mb-3">
                            <Upload className={isDragging ? 'text-blue-600' : 'text-slate-400'} size={32} />
                        </div>
                        <p className="text-lg font-bold text-slate-700">Arraste fotos aqui</p>
                        <p className="text-sm text-slate-500">ou clique para selecionar do computador</p>
                    </div>

                    {/* PREVIEW DAS FOTOS SELECIONADAS (ANTES DE ENVIAR) */}
                    {selectedFiles.length > 0 && (
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 animate-in slide-in-from-top-2">
                            <div className="flex justify-between items-center mb-3">
                                <span className="font-bold text-blue-800">{selectedFiles.length} fotos prontas para envio</span>
                                <Button onClick={handleConfirmUpload} disabled={isUploadingPhotos} className="bg-blue-600 hover:bg-blue-700 text-white">
                                    {isUploadingPhotos ? <Loader2 className="animate-spin mr-2"/> : <Upload className="mr-2" size={16}/>}
                                    {isUploadingPhotos ? "Enviando..." : "Confirmar Upload"}
                                </Button>
                            </div>
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {previews.map((src, idx) => (
                                    <div key={idx} className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-blue-200 group">
                                        <Image src={src} alt="Preview" fill className="object-cover" />
                                        <button onClick={() => removeSelectedFile(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
             ) : (
                <div className="bg-yellow-50 text-yellow-800 p-6 rounded-xl border border-yellow-200 text-center mb-6">
                   <h4 className="font-bold text-lg mb-1">Salve o álbum primeiro</h4>
                   <p className="text-sm opacity-90">Você precisa salvar o título e data antes de começar a adicionar fotos.</p>
                </div>
             )}

             {/* 2. Fotos Já Salvas (Do Banco) */}
             <div className="flex-1">
                <div className="flex justify-between items-end mb-3 border-b border-slate-100 pb-2">
                    <h3 className="font-bold text-slate-700">Galeria Atual ({currentAlbum.photos?.length || 0})</h3>
                </div>

                <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 min-h-[300px]">
                    {currentAlbum.photos?.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10">
                            <ImageIcon size={48} className="mb-2 opacity-30"/>
                            <p>O álbum está vazio.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {currentAlbum.photos?.map((photo: any) => (
                                <div key={photo.id} className="group relative aspect-square bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-200">
                                    <Image src={photo.url} alt="Foto" fill className="object-cover" sizes="200px"/>
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button size="icon" variant="destructive" onClick={() => handleDeletePhoto(photo.id)} className="rounded-full h-8 w-8">
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
             </div>
         </div>
       </div>
    </div>
  )
}