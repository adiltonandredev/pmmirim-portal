"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FeedbackModal } from "@/components/admin/shared/FeedbackModal"
import { useFeedback } from "@/hooks/useFeedback"
import { createMemberCategory, updateMemberCategory, deleteMemberCategory } from "@/server/actions/memberCategories"
import { Plus, Pencil, Trash2, Save, X, Tag, GripVertical } from "lucide-react"
import { useRouter } from "next/navigation"

interface Category {
  id: string
  name: string
  slug: string
  order: number
  active: boolean
}

interface CategoriesManagerProps {
  categories: Category[]
}

export function CategoriesManager({ categories: initialCategories }: CategoriesManagerProps) {
  const router = useRouter()
  const { feedback, showSuccess, showError, close } = useFeedback()
  const [categories, setCategories] = useState(initialCategories)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editOrder, setEditOrder] = useState(0)
  const [newName, setNewName] = useState("")
  const [newOrder, setNewOrder] = useState(0)
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    if (!newName.trim()) { showError("Atenção", "Digite um nome para a categoria."); return }
    setLoading(true)
    const fd = new FormData()
    fd.set("name", newName.trim())
    fd.set("order", String(newOrder))
    const result = await createMemberCategory(fd)
    setLoading(false)
    if (result.success) {
      showSuccess("Criado!", result.message)
      setNewName("")
      setNewOrder(0)
      router.refresh()
    } else {
      showError("Erro", result.message)
    }
  }

  async function handleUpdate(id: string) {
    if (!editName.trim()) { showError("Atenção", "Nome não pode ser vazio."); return }
    setLoading(true)
    const fd = new FormData()
    fd.set("id", id)
    fd.set("name", editName.trim())
    fd.set("order", String(editOrder))
    const result = await updateMemberCategory(fd)
    setLoading(false)
    if (result.success) {
      showSuccess("Atualizado!", result.message)
      setEditingId(null)
      router.refresh()
    } else {
      showError("Erro", result.message)
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Excluir a categoria "${name}"? Os membros nesta categoria não serão excluídos, mas ficarão sem categoria associada no menu.`)) return
    setLoading(true)
    const result = await deleteMemberCategory(id)
    setLoading(false)
    if (result.success) {
      showSuccess("Excluído!", result.message)
      router.refresh()
    } else {
      showError("Erro", result.message)
    }
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id)
    setEditName(cat.name)
    setEditOrder(cat.order)
  }

  return (
    <>
      <FeedbackModal open={feedback.open} type={feedback.type} title={feedback.title} message={feedback.message} onClose={close} />

      <div className="max-w-2xl space-y-6">

        {/* FORMULÁRIO NOVA CATEGORIA */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-700 flex items-center gap-2 text-sm uppercase tracking-wide">
            <Plus size={16} className="text-blue-600" /> Nova Categoria
          </h3>
          <div className="flex gap-3">
            <Input
              placeholder="Ex: Diretoria Executiva"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCreate()}
              className="flex-1"
            />
            <div className="w-24">
              <Input
                type="number"
                placeholder="Ordem"
                value={newOrder}
                onChange={e => setNewOrder(parseInt(e.target.value) || 0)}
                title="Ordem de exibição no menu"
              />
            </div>
            <Button
              onClick={handleCreate}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 font-bold shrink-0"
            >
              <Plus size={16} className="mr-1" /> Adicionar
            </Button>
          </div>
          <p className="text-[11px] text-slate-400">
            A categoria criada aparecerá automaticamente no menu público "A Instituição" assim que houver membros cadastrados nela.
          </p>
        </div>

        {/* LISTA DE CATEGORIAS */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <Tag size={16} className="text-slate-400" />
            <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">
              Categorias Cadastradas ({initialCategories.length})
            </h3>
          </div>

          {initialCategories.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              <Tag size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Nenhuma categoria cadastrada ainda.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {initialCategories.map((cat) => (
                <div key={cat.id} className="px-5 py-4 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                  <GripVertical size={16} className="text-slate-200 shrink-0" />

                  {editingId === cat.id ? (
                    <>
                      <Input
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") handleUpdate(cat.id); if (e.key === "Escape") setEditingId(null) }}
                        className="flex-1 h-8 text-sm"
                        autoFocus
                      />
                      <Input
                        type="number"
                        value={editOrder}
                        onChange={e => setEditOrder(parseInt(e.target.value) || 0)}
                        className="w-20 h-8 text-sm"
                        title="Ordem"
                      />
                      <Button size="sm" onClick={() => handleUpdate(cat.id)} disabled={loading} className="h-8 bg-green-600 hover:bg-green-700">
                        <Save size={14} />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} className="h-8 text-slate-400">
                        <X size={14} />
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm">{cat.name}</p>
                        <p className="text-[11px] text-slate-400">/{cat.slug} · ordem {cat.order}</p>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => startEdit(cat)} className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600">
                        <Pencil size={14} />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(cat.id, cat.name)} disabled={loading} className="h-8 w-8 p-0 text-slate-400 hover:text-red-600">
                        <Trash2 size={14} />
                      </Button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
