"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Youtube from '@tiptap/extension-youtube'
import TextAlign from '@tiptap/extension-text-align'
import { 
  Bold, Italic, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, 
  Quote, Undo, Redo, Loader2, Youtube as YoutubeIcon, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  WrapText, Type, MoveVertical
} from 'lucide-react'
import { Toggle } from "@/components/ui/toggle"
import { uploadImage } from '@/app/actions/upload'
import { useRef, useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"

// 1. EXTENSÃO DE IMAGEM AVANÇADA (TIPO WORD)
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '100%',
        renderHTML: attributes => ({
          style: `width: ${attributes.width};`,
        }),
        parseHTML: element => element.style.width,
      },
      // Novo atributo para controlar o estilo de "Word"
      layoutStyle: {
        default: 'center', // inline, float-left, float-right, center
        parseHTML: element => element.getAttribute('data-layout'),
        renderHTML: attributes => {
          let style = `width: ${attributes.width}; transition: all 0.3s ease;`
          let className = 'rounded-lg border border-slate-200 shadow-sm'

          // Lógica estilo "Word" usando CSS
          switch (attributes.layoutStyle) {
            case 'float-left': // Quadrado Esq
              style += 'float: left; margin-right: 1.5rem; margin-bottom: 0.5rem; display: block;'
              break
            case 'float-right': // Quadrado Dir
              style += 'float: right; margin-left: 1.5rem; margin-bottom: 0.5rem; display: block;'
              break
            case 'inline': // Alinhado com texto
              style += 'display: inline; vertical-align: bottom; margin: 0 0.2rem;'
              break
            case 'center': // Superior/Inferior (Bloco)
            default:
              style += 'display: block; margin-left: auto; margin-right: auto; margin-bottom: 1rem; margin-top: 1rem;'
              break
          }

          return {
            style,
            class: className,
            'data-layout': attributes.layoutStyle
          }
        },
      },
    }
  },
})

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
}

// O NOME AGORA É RichTextEditor PARA MANTER O PADRÃO
export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [, forceUpdate] = useState({})

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      CustomImage.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-blue-600 underline cursor-pointer' },
      }),
      Youtube.configure({
        controls: false,
        nocookie: true,
        HTMLAttributes: { class: 'rounded-xl overflow-hidden shadow-lg border border-slate-200 inline-block' },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph', 'youtube'], // Removemos imagem daqui pois controlamos manualmente
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm md:prose-base max-w-none focus:outline-none min-h-[400px] px-6 py-4 after:content-[""] after:block after:clear-both', // clear-both evita bugs com float
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    onSelectionUpdate: () => forceUpdate({}),
    onTransaction: () => forceUpdate({})
  })

  // Sincroniza conteúdo externo se necessário (ex: carregamento inicial)
  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
        if (editor.getText() === "") {
             editor.commands.setContent(content)
        }
    }
  }, [content, editor])

  // === AÇÕES ===

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert("Selecione apenas arquivos de imagem.")
      return
    }
    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('file', file)
      const url = await uploadImage(formData)
      if (url && editor) {
        editor.chain().focus().setImage({ src: url }).run()
      }
    } catch (error) {
      console.error(error)
      alert("Erro ao enviar imagem.")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function addYoutubeVideo() {
    const url = prompt('Cole a URL do vídeo do YouTube:')
    if (url && editor) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run()
    }
  }

  // === CONTROLADORES ESTILO WORD ===

  const setImageLayout = (layout: 'inline' | 'float-left' | 'float-right' | 'center') => {
    if (editor?.isActive('image')) {
      editor.chain().focus().updateAttributes('image', { layoutStyle: layout }).run()
    }
  }

  const setMediaSize = (percentage: string) => {
    if (!editor) return
    if (editor.isActive('image')) {
        editor.chain().focus().updateAttributes('image', { width: percentage }).run()
    }
    if (editor.isActive('youtube')) {
       let width = 640; let height = 480
       if (percentage === '100%') { width = 800; height = 450 }
       if (percentage === '75%') { width = 600; height = 340 }
       if (percentage === '50%') { width = 400; height = 225 }
       if (percentage === '25%') { width = 200; height = 115 }
       editor.chain().focus().updateAttributes('youtube', { width, height }).run()
    }
  }

  if (!editor) return null

  const isImageSelected = editor.isActive('image')
  const isYoutubeSelected = editor.isActive('youtube')
  const isMediaSelected = isImageSelected || isYoutubeSelected

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white flex flex-col shadow-sm">
      <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />

      {/* === TOOLBAR === */}
      <div className="bg-slate-50 border-b border-slate-200 p-2 flex flex-wrap gap-1 sticky top-0 z-20 items-center min-h-[50px]">
        
        {/* BARRA DE TEXTO (Aparece se não for imagem) */}
        {!isMediaSelected && (
          <>
            <div className="flex gap-1 pr-2 border-r border-slate-300">
                <Toggle size="sm" pressed={editor.isActive('bold')} onPressedChange={() => editor.chain().focus().toggleBold().run()}><Bold size={18} /></Toggle>
                <Toggle size="sm" pressed={editor.isActive('italic')} onPressedChange={() => editor.chain().focus().toggleItalic().run()}><Italic size={18} /></Toggle>
                <Toggle size="sm" pressed={editor.isActive('blockquote')} onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={18} /></Toggle>
            </div>
            <div className="flex gap-1 px-2 border-r border-slate-300">
                <Toggle size="sm" pressed={editor.isActive({ textAlign: 'left' })} onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}><AlignLeft size={18} /></Toggle>
                <Toggle size="sm" pressed={editor.isActive({ textAlign: 'center' })} onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}><AlignCenter size={18} /></Toggle>
                <Toggle size="sm" pressed={editor.isActive({ textAlign: 'right' })} onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}><AlignRight size={18} /></Toggle>
                <Toggle size="sm" pressed={editor.isActive({ textAlign: 'justify' })} onPressedChange={() => editor.chain().focus().setTextAlign('justify').run()}><AlignJustify size={18} /></Toggle>
            </div>
            <div className="flex gap-1 px-2 border-r border-slate-300">
                <Toggle size="sm" pressed={editor.isActive('bulletList')} onPressedChange={() => editor.chain().focus().toggleBulletList().run()}><List size={18} /></Toggle>
                <Toggle size="sm" pressed={editor.isActive('orderedList')} onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={18} /></Toggle>
            </div>
          </>
        )}

        {/* BARRA DE IMAGEM (ESTILO WORD) */}
        {isImageSelected && (
           <div className="flex gap-2 items-center px-2 bg-blue-50 rounded-md border border-blue-100 mr-2 flex-1 animate-in fade-in zoom-in duration-200 overflow-x-auto">
              <span className="text-[10px] font-bold text-blue-600 uppercase whitespace-nowrap">Layout da Imagem:</span>
              
              <div className="flex gap-1 border-r border-blue-200 pr-2 mr-2">
                 {/* Alinhado com Texto */}
                 <Button variant="ghost" size="sm" onClick={() => setImageLayout('inline')} className="h-8 px-2 text-slate-600 hover:text-blue-700 hover:bg-blue-100" title="Alinhado com Texto">
                    <Type size={16} className="mr-1"/> <span className="text-xs">Texto</span>
                 </Button>

                 {/* Quadrado Esquerda */}
                 <Button variant="ghost" size="sm" onClick={() => setImageLayout('float-left')} className="h-8 px-2 text-slate-600 hover:text-blue-700 hover:bg-blue-100" title="Quadrado à Esquerda">
                    <WrapText size={16} className="mr-1"/> <span className="text-xs">Esq.</span>
                 </Button>

                 {/* Superior e Inferior */}
                 <Button variant="ghost" size="sm" onClick={() => setImageLayout('center')} className="h-8 px-2 text-slate-600 hover:text-blue-700 hover:bg-blue-100" title="Superior e Inferior">
                    <MoveVertical size={16} className="mr-1"/> <span className="text-xs">Centro</span>
                 </Button>

                 {/* Quadrado Direita */}
                 <Button variant="ghost" size="sm" onClick={() => setImageLayout('float-right')} className="h-8 px-2 text-slate-600 hover:text-blue-700 hover:bg-blue-100" title="Quadrado à Direita">
                    <span className="text-xs mr-1">Dir.</span> <WrapText size={16} className="scale-x-[-1]"/> 
                 </Button>
              </div>

              {/* Tamanho */}
              <div className="flex gap-1">
                 <Button type="button" variant="outline" size="sm" onClick={() => setMediaSize('25%')} className="h-7 text-xs px-2 bg-white border-blue-200">25%</Button>
                 <Button type="button" variant="outline" size="sm" onClick={() => setMediaSize('50%')} className="h-7 text-xs px-2 bg-white border-blue-200">50%</Button>
                 <Button type="button" variant="outline" size="sm" onClick={() => setMediaSize('75%')} className="h-7 text-xs px-2 bg-white border-blue-200">75%</Button>
                 <Button type="button" variant="outline" size="sm" onClick={() => setMediaSize('100%')} className="h-7 text-xs px-2 bg-white border-blue-200">100%</Button>
              </div>
           </div>
        )}

        {/* BARRA DE VÍDEO (YOUTUBE) */}
        {isYoutubeSelected && (
            <div className="flex gap-2 items-center px-2 bg-red-50 rounded-md border border-red-100 mr-2 flex-1 animate-in fade-in zoom-in duration-200">
                <span className="text-[10px] font-bold text-red-600 uppercase whitespace-nowrap">Vídeo:</span>
                <div className="flex gap-1">
                 <Button type="button" variant="outline" size="sm" onClick={() => setMediaSize('50%')} className="h-7 text-xs px-2 bg-white border-red-200">Pequeno</Button>
                 <Button type="button" variant="outline" size="sm" onClick={() => setMediaSize('75%')} className="h-7 text-xs px-2 bg-white border-red-200">Médio</Button>
                 <Button type="button" variant="outline" size="sm" onClick={() => setMediaSize('100%')} className="h-7 text-xs px-2 bg-white border-red-200">Grande</Button>
              </div>
            </div>
        )}

        {/* BOTÕES FIXOS (Direita) */}
        <div className="flex gap-1 pl-2 ml-auto">
            <Toggle size="sm" pressed={editor.isActive('link')} onPressedChange={() => {
                const url = window.prompt('URL:', editor.getAttributes('link').href);
                if (url) editor.chain().focus().setLink({ href: url }).run();
            }}><LinkIcon size={18} /></Toggle>
            <Toggle size="sm" onPressedChange={() => fileInputRef.current?.click()} disabled={isUploading}>
              {isUploading ? <Loader2 size={18} className="animate-spin text-blue-600" /> : <ImageIcon size={18} />}
            </Toggle>
            <Toggle size="sm" pressed={editor.isActive('youtube')} onPressedChange={addYoutubeVideo}><YoutubeIcon size={18} /></Toggle>
            <div className="w-px h-6 bg-slate-300 mx-1 self-center hidden sm:block" />
            <Toggle size="sm" onPressedChange={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}><Undo size={18} /></Toggle>
            <Toggle size="sm" onPressedChange={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}><Redo size={18} /></Toggle>
        </div>
      </div>

      <EditorContent editor={editor} className="bg-white min-h-[400px]" />
    </div>
  )
}