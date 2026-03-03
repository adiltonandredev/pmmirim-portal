import { prisma } from "@/lib/prisma" 
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Plus, Shield, User, Pencil, Mail } from "lucide-react"
import { deleteUser } from "@/app/actions/users"
import { PageContainer, PageHeader, PageTitle, PageContent } from "@/components/admin/PageLayout"
import { DeleteButton } from "@/components/admin/DeleteButton"

export const dynamic = "force-dynamic"

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle 
            title="Usuários" 
            subtitle="Gerencie o acesso ao sistema." 
            icon={Users} 
        />
        <Link href="/admin/users/new" className="w-full md:w-auto">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 shadow-md w-full">
            <Plus size={18} /> Novo Usuário
          </Button>
        </Link>
      </PageHeader>

      <PageContent>
        
        {/* === VERSÃO MOBILE (CARTÕES) === */}
        {/* Esta parte só aparece em telas pequenas */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
            {users.map((user) => (
                <div key={user.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200 shrink-0">
                            <User size={24} />
                        </div>
                        <div className="overflow-hidden">
                            <div className="font-bold text-slate-800 text-lg truncate">{user.name}</div>
                            <div className="flex items-center gap-1 text-sm text-slate-500 truncate">
                                <Mail size={14} /> {user.email}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-1">
                        <div className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold border ${
                          user.role === 'ADMIN' 
                            ? 'bg-purple-50 text-purple-700 border-purple-100' 
                            : 'bg-blue-50 text-blue-700 border-blue-100'
                        }`}>
                          {user.role === 'ADMIN' && <Shield size={12} />}
                          {user.role || 'USER'}
                        </div>

                        <div className="flex items-center gap-2">
                            {/* BOTÃO EDITAR MOBILE */}
                            <Link href={`/admin/users/${user.id}/edit`}>
                                <Button variant="outline" size="sm" className="h-10 px-4 text-slate-600 hover:text-blue-600 border-slate-200 font-bold bg-slate-50">
                                    <Pencil size={16} className="mr-2" /> Editar
                                </Button>
                            </Link>

                            {/* BOTÃO EXCLUIR MOBILE */}
                            <DeleteButton 
                              action={deleteUser} 
                              itemId={user.id} 
                              itemName={user.name || "Usuário sem nome"}
                              className="h-10 w-10 p-0 bg-white border border-slate-200 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center shadow-sm"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* === VERSÃO DESKTOP (TABELA) === */}
        {/* Esta parte só aparece em telas médias ou maiores */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-5 font-semibold text-slate-700 text-sm uppercase tracking-wider">Usuário</th>
                <th className="p-5 font-semibold text-slate-700 text-sm uppercase tracking-wider">Cargo</th>
                <th className="p-5 font-semibold text-slate-700 text-sm uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200 shrink-0">
                            <User size={20} />
                        </div>
                        <div>
                            <div className="font-bold text-slate-800 text-base">{user.name}</div>
                            <div className="text-sm text-slate-500">{user.email}</div>
                        </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold border ${
                      user.role === 'ADMIN' 
                        ? 'bg-purple-50 text-purple-700 border-purple-100' 
                        : 'bg-blue-50 text-blue-700 border-blue-100'
                    }`}>
                      {user.role === 'ADMIN' && <Shield size={12} />}
                      {user.role || 'USER'}
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/users/${user.id}/edit`}>
                            <Button variant="outline" size="sm" className="h-8 px-3 text-slate-500 hover:text-blue-600 border-slate-200 text-xs font-bold flex items-center gap-2">
                                <Pencil size={14} /> Editar
                            </Button>
                        </Link>

                        <DeleteButton 
                          action={deleteUser} 
                          itemId={user.id} 
                          itemName={user.name || "Usuário sem nome"}
                        />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
            <div className="p-10 text-center text-slate-500 bg-white rounded-xl border border-slate-200 mt-4">
                Nenhum usuário encontrado.
            </div>
        )}

      </PageContent>
    </PageContainer>
  )
}