import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Plus, Cake, Pencil, User, CalendarDays } from "lucide-react"
import { PageContainer, PageHeader, PageTitle, PageContent } from "@/components/admin/PageLayout"
import { DeleteButton } from "@/components/admin/DeleteButton"
import { deleteBirthday } from "@/app/actions/birthdays"

export const dynamic = "force-dynamic"

export default async function AdminBirthdaysPage() {
  const birthdays = await prisma.birthday.findMany({
    orderBy: { date: 'asc' }
  })

  // Formata data (Ex: 12 de Outubro)
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle 
            title="Aniversariantes" 
            subtitle="Gerencie as datas comemorativas da equipe e alunos."
            icon={Cake} 
        />
        <Link href="/admin/birthdays/new" className="w-full md:w-auto">
          <Button className="w-full md:w-auto bg-pink-600 hover:bg-pink-700 text-white font-bold gap-2 shadow-md">
            <Plus size={18} /> Novo Aniversariante
          </Button>
        </Link>
      </PageHeader>

      <PageContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {birthdays.map((person) => {
                // CORREÇÃO REALIZADA AQUI: Adicionado a verificação || person.photoUrl.startsWith('/')
                const hasValidImage = person.photoUrl && (
                    person.photoUrl.startsWith('data:') || 
                    person.photoUrl.startsWith('http') || 
                    person.photoUrl.startsWith('/')
                );

                return (
                <div key={person.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-row items-center p-4 gap-4 hover:border-pink-300 transition-all group">
                    
                    {/* FOTO REDONDA */}
                    <div className="relative w-16 h-16 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                        {hasValidImage ? (
                            <Image 
                                src={person.photoUrl!} 
                                alt={person.name} 
                                fill 
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <User size={24} />
                            </div>
                        )}
                    </div>

                    {/* DADOS */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-pink-600 uppercase mb-0.5 bg-pink-50 w-fit px-1.5 py-0.5 rounded">
                            <CalendarDays size={10} />
                            {formatDate(person.date)}
                        </div>
                        <h3 className="font-bold text-slate-800 truncate leading-tight">{person.name}</h3>
                        <p className="text-xs text-slate-500 truncate">{person.role || "Sem cargo"}</p>
                    </div>

                    {/* AÇÕES */}
                    <div className="flex flex-col gap-2 border-l border-slate-100 pl-3">
                        <Link href={`/admin/birthdays/${person.id}/edit`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md">
                                <Pencil size={16} />
                            </Button>
                        </Link>

                        <DeleteButton 
                            action={deleteBirthday} 
                            itemId={person.id} 
                            itemName={person.name}
                            className="h-8 w-8 p-0 bg-transparent text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center rounded-md"
                        />
                    </div>
                </div>
            )})}
        </div>

        {birthdays.length === 0 && (
            <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
                <Cake size={40} className="mx-auto mb-4 opacity-20" />
                <h3 className="text-sm font-bold text-slate-700">Lista Vazia</h3>
                <Link href="/admin/birthdays/new" className="mt-4 inline-block">
                    <Button variant="outline">Cadastrar Primeiro</Button>
                </Link>
            </div>
        )}
      </PageContent>
    </PageContainer>
  )
}