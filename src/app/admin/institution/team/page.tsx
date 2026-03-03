import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Plus, Users, Pencil, User } from "lucide-react"
import { PageContainer, PageHeader, PageTitle, PageContent } from "@/components/admin/PageLayout"
import { DeleteButton } from "@/components/admin/DeleteButton"
import { deleteTeamMember } from "@/app/actions/team"

export const dynamic = "force-dynamic"

export default async function AdminTeamPage() {
  const members = await prisma.teamMember.findMany({
    orderBy: { order: 'asc' }
  })

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle 
            title="Equipe e Diretoria" 
            subtitle="Gerencie os membros da instituição e seus cargos."
            icon={Users} 
        />
        <Link href="/admin/institution/team/new" className="w-full md:w-auto">
          <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 shadow-md">
            <Plus size={18} /> Novo Membro
          </Button>
        </Link>
      </PageHeader>

      <PageContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {members.map((member) => {
                // CORREÇÃO AQUI: Adicionado verificação para '/'
                const hasValidImage = member.image && (
                    member.image.startsWith('data:') || 
                    member.image.startsWith('http') || 
                    member.image.startsWith('/')
                );

                return (
                <div key={member.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:border-blue-300 transition-all">
                    
                    {/* FOTO */}
                    <div className="relative aspect-[4/3] bg-slate-100 border-b border-slate-100">
                        {hasValidImage ? (
                            <Image 
                                src={member.image!} 
                                alt={member.name} 
                                fill 
                                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                                <User size={32} />
                                <span className="text-[10px] uppercase font-bold text-slate-300">Sem Foto</span>
                            </div>
                        )}
                        
                        {/* Overlay com Nome */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8">
                            <p className="text-white font-bold text-sm truncate">{member.name}</p>
                            <p className="text-white/80 text-xs truncate">{member.role}</p>
                        </div>
                    </div>

                    {/* DETALHES */}
                    <div className="p-4 flex flex-col gap-2 flex-1">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase">
                                {member.category}
                            </span>
                            <span className="text-[10px] text-slate-400">Ord: {member.order}</span>
                        </div>
                        
                        {/* AÇÕES */}
                        <div className="mt-auto pt-3 flex items-center justify-end gap-2 border-t border-slate-50">
                            <Link href={`/admin/institution/team/${member.id}/edit`}>
                                <Button variant="outline" size="sm" className="h-8 px-3 text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-700 text-xs font-bold">
                                    <Pencil size={14} className="mr-1.5" /> Editar
                                </Button>
                            </Link>

                            <DeleteButton 
                                action={deleteTeamMember} 
                                itemId={member.id} 
                                itemName={member.name}
                                className="h-8 w-8 p-0 bg-white border border-slate-200 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center shadow-sm"
                            />
                        </div>
                    </div>
                </div>
            )})}
        </div>
      </PageContent>
    </PageContainer>
  )
}