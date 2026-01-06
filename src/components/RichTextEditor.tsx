"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Youtube from '@tiptap/extension-youtube'
import Link from '@tiptap/extension-link'
import { useEffect } from 'react'

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Youtube.configure({ width: 640, height: 480 }),
      Link.configure({ openOnClick: false })
    ],
    content: content,
    // A CORREÇÃO ESTÁ AQUI:
    immediatelyRender: false, 
    
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] px-4 py-2',
      },
    },
  })

  // Sincroniza conteúdo se mudar externamente
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
       // Verificação extra para evitar loops se o conteúdo for vazio
       if (editor.getText() === "" && content === "") return
       // Se precisar forçar atualização externa, descomente abaixo com cuidado:
       // editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) return null

  const addImage = () => {
    const url = window.prompt('URL da Imagem:')
    if (url) editor.chain().focus().setImage({ src: url }).run()
  }

  const addYoutube = () => {
    const url = window.prompt('URL do vídeo do YouTube:')
    if (url) editor.commands.setYoutubeVideo({ src: url })
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL do link', previousUrl)
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden bg-white">
      {/* Barra de Ferramentas */}
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-2">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-1 rounded ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}><strong>B</strong></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-1 rounded ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}><em>I</em></button>
        
        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`p-1 rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}`}>Esq</button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`p-1 rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}`}>Cen</button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`p-1 rounded ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}`}>Dir</button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <button type="button" onClick={setLink} className={`p-1 rounded ${editor.isActive('link') ? 'bg-gray-200' : ''}`}>Link</button>
        <button type="button" onClick={addImage} className="p-1 rounded hover:bg-gray-200">📷 Img</button>
        <button type="button" onClick={addYoutube} className="p-1 rounded hover:bg-gray-200">🎥 YT</button>
      </div>

      {/* Área de Edição */}
      <EditorContent editor={editor} className="min-h-[300px]" />
    </div>
  )
}