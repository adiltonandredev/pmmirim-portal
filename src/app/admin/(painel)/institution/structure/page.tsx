import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Network, Plus, Pencil, ImageIcon } from "lucide-react"
import { PageContainer, PageHeader, PageTitle, PageContent } from "@/components/admin/shared/PageLayout"
import { DeleteButton } from "@/components/admin/shared/DeleteButton"
import { deleteStructure } from "@/server/actions/structure"

export const dynamic = "force-dynamic"

export default async function AdminStructurePage() {
  const structures = await prisma.organizationalStructure.findMany({
    orderBy: { order: "asc" },
  })

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle
          title="Estrutura Organizacional"
          subtitle="Gerencie o organograma e hierarquia da instituição."
          icon={Network}
        />
        <Link href="/admin/institution/structure/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 shadow-md">
            <Plus size={18} /> Novo Item
          </Button>
        </Link>
      </PageHeader>

      <PageContent>
        {structures.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-slate-200 p-16 text-center">
            <Network size={48} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-lg font-bold text-slate-600 mb-2">Nenhum item cadastrado</h3>
            <p className="text-slate-400 text-sm mb-6">Adicione o organograma ou estrutura hierárquica da instituição.</p>
            <Link href="/admin/institution/structure/new">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2">
                <Plus size={16} /> Adicionar Primeiro Item
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {structures.map((s) => (
              <div key={s.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row gap-0">

                {/* IMAGEM (se houver) */}
                {s.chartImage && (
                  <div className="relative w-full md:w-48 h-32 md:h-auto shrink-0 bg-slate-100 border-b md:border-b-0 md:border-r border-slate-100">
                    <Image src={s.chartImage} alt={s.title} fill className="object-cover" />
                  </div>
                )}
                {!s.chartImage && (
                  <div className="hidden md:flex w-48 shrink-0 bg-slate-50 border-r border-slate-100 items-center justify-center">
                    <ImageIcon size={32} className="text-slate-200" />
                  </div>
                )}

                {/* CONTEÚDO */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg">{s.title}</h3>
                        {s.description && <p className="text-sm text-slate-500 mt-1">{s.description}</p>}
                      </div>
                      <span className="text-[11px] text-slate-400 shrink-0 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
                        Ord: {s.order}
                      </span>
                    </div>
                    {s.content && (
                      <p className="text-sm text-slate-400 mt-2 line-clamp-2">{s.content.replace(/<[^>]*>/g, "")}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-50">
                    <Link href={`/admin/institution/structure/${s.id}/edit`}>
                      <Button variant="outline" size="sm" className="h-8 px-3 text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-700 text-xs font-bold">
                        <Pencil size={14} className="mr-1.5" /> Editar
                      </Button>
                    </Link>
                    <DeleteButton
                      action={deleteStructure}
                      itemId={s.id}
                      itemName={s.title}
                      className="h-8 w-8 p-0 bg-white border border-slate-200 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center shadow-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </PageContent>
    </PageContainer>
  )
}
