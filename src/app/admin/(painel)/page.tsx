import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, GraduationCap, Users, Cake, Trophy, ArrowUpRight } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  // Busca os totais do banco de dados em paralelo (mais rápido)
  const [postsCount, coursesCount, teamCount, birthdaysCount, featuredCount] = await Promise.all([
    prisma.post.count(),
    prisma.course.count(),
    prisma.boardMember.count(),
    prisma.birthday.count(),
    prisma.featuredStudent.count({ where: { active: true } })
  ])

  return (
    <div className="container mx-auto p-8">
      
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Painel de Controle</h1>
        <p className="text-slate-500">Bem-vindo ao sistema de gestão da Polícia Militar Mirim.</p>
      </div>

      {/* Grid de Cards (Métricas) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Card Notícias */}
        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Notícias Publicadas</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{postsCount}</div>
            <p className="text-xs text-slate-400 mt-1">Artigos no blog</p>
          </CardContent>
        </Card>

        {/* Card Cursos */}
        <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Cursos Ativos</CardTitle>
            <GraduationCap className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{coursesCount}</div>
            <p className="text-xs text-slate-400 mt-1">Disponíveis no site</p>
          </CardContent>
        </Card>

        {/* Card Equipe */}
        <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Membros da Equipe</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{teamCount}</div>
            <p className="text-xs text-slate-400 mt-1">Diretoria e Instrutores</p>
          </CardContent>
        </Card>

        {/* Card Alunos/Aniversariantes */}
        <Card className="border-l-4 border-l-pink-500 shadow-sm hover:shadow-md transition">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Aniversariantes</CardTitle>
            <Cake className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{birthdaysCount}</div>
            <p className="text-xs text-slate-400 mt-1">Alunos cadastrados</p>
          </CardContent>
        </Card>

      </div>

      {/* Seção de Status Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 text-white">
          <div className="flex justify-between items-start mb-4">
             <div>
               <h3 className="font-bold text-lg">Destaque do Mês</h3>
               <p className="text-slate-400 text-sm">Aluno atualmente em evidência na home</p>
             </div>
             <Trophy className="text-yellow-400" size={24} />
          </div>
          
          {featuredCount > 0 ? (
            <div className="flex items-center gap-2 text-green-400 font-bold bg-green-400/10 py-2 px-3 rounded-lg w-fit">
               <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
               Destaque Ativo
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-400 font-bold bg-red-400/10 py-2 px-3 rounded-lg w-fit">
               <div className="w-2 h-2 rounded-full bg-red-400"></div>
               Nenhum Destaque Definido
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
           <h3 className="font-bold text-slate-800 mb-2">Acesso Rápido</h3>
           <div className="grid grid-cols-2 gap-4">
              <a href="/" target="_blank" className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition group">
                <span className="text-sm font-medium text-slate-600">Ver Site Público</span>
                <ArrowUpRight size={16} className="text-slate-400 group-hover:text-blue-600" />
              </a>
              <a href="/admin/posts/new" className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition group">
                <span className="text-sm font-medium text-slate-600">Nova Notícia</span>
                <ArrowUpRight size={16} className="text-slate-400 group-hover:text-blue-600" />
              </a>
           </div>
        </div>
      </div>

    </div>
  )
}