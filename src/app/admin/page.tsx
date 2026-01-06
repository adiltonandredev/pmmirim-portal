import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma" // Importamos do arquivo que acabamos de criar
import { DeleteUserButton } from "@/components/DeleteUserButton"
import { CreateUserModal } from "@/components/CreateUserModal"
import { EditUserModal } from "@/components/EditUserModal"

export default async function AdminPage() {
  const session = await auth()

  // 1. Segurança: Verifica Login e Cargo
  if (!session) redirect("/login")
  if (session.user.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-red-500 font-bold text-xl">Acesso Negado</h1>
        <p>Esta área é restrita para administradores.</p>
      </div>
    )
  }

  // 2. BUSCAR DADOS DO BANCO (Aqui é a novidade!)
  // Buscamos todos os usuários ordenados pelos mais recentes
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Painel Administrativo</h1>
          <p className="text-gray-500">Gerencie os usuários do sistema</p>
        </div>
        
        {/* Botão de Logout */}
        <form
          action={async () => {
            "use server"
            await signOut({ redirectTo: "/login" })
          }}
        >
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition shadow-sm">
            Sair
          </button>
        </form>
      </div>

      {/* Cartão com a Tabela */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="font-semibold text-gray-700">Usuários Cadastrados ({users.length})</h2>
          <CreateUserModal />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 font-medium">
              <tr>
                <th className="px-6 py-3">Nome / Email</th>
                <th className="px-6 py-3">Cargo (Role)</th>
                <th className="px-6 py-3">Data Cadastro</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  {/* Nome e Email */}
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{user.name || "Sem nome"}</div>
                    <div className="text-gray-400 text-xs">{user.email}</div>
                  </td>

                  {/* Badge de Cargo */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* Data Formatada */}
                  <td className="px-6 py-4">
                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </td>

                  {/* Botões de Ação (Apenas visual por enquanto) */}
                  <td className="px-6 py-4 text-right">
                    <EditUserModal user={user} />
                    <DeleteUserButton userId={user.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {users.length === 0 && (
            <div className="p-8 text-center text-gray-500">
                Nenhum usuário encontrado.
            </div>
        )}
      </div>
    </div>
  )
}