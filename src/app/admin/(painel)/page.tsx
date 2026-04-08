import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import {
  FileText, GraduationCap, Users, Cake, Trophy,
  ArrowUpRight, CalendarDays, Image as ImageIcon,
  Shield, Pencil, Eye, Clock, Plus, Settings,
  Activity, Briefcase, Medal, TrendingUp, BookOpen,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export const dynamic = "force-dynamic"

function roleLabel(role?: string | null) {
  if (role === "ADMIN") return "Administrador"
  if (role === "EDITOR") return "Editor"
  if (role === "VIEWER") return "Visualizador"
  return role ?? ""
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return "Bom dia"
  if (h < 18) return "Boa tarde"
  return "Boa noite"
}

const ACTION_STYLE: Record<string, { bg: string; text: string; dot: string }> = {
  CRIOU:   { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
  EDITOU:  { bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-400"    },
  EXCLUIU: { bg: "bg-red-50",     text: "text-red-700",     dot: "bg-red-400"     },
  LOGIN:   { bg: "bg-purple-50",  text: "text-purple-700",  dot: "bg-purple-400"  },
}

interface StatCardProps {
  label: string
  value: number | string
  sub?: string
  icon: React.ElementType
  color: string
  href?: string
}

function StatCard({ label, value, sub, icon: Icon, color, href }: StatCardProps) {
  const inner = (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-start justify-between group hover:shadow-md transition-all duration-200 ${href ? "cursor-pointer" : ""}`}>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-3xl font-bold text-slate-800">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
    </div>
  )
  if (href) return <Link href={href}>{inner}</Link>
  return inner
}

export default async function AdminDashboard() {
  const session = await auth()
  const sessionUserId = (session?.user as any)?.id

  const [
    currentUser,
    postsTotal,
    postsPublished,
    coursesCount,
    usersCount,
    birthdaysCount,
    featuredCount,
    eventsCount,
    galleriesCount,
    studentsCount,
    recentLogs,
  ] = await Promise.all([
    sessionUserId
      ? prisma.user.findUnique({ where: { id: sessionUserId }, select: { name: true, image: true, role: true } })
      : null,
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.course.count({ where: { active: true } }),
    prisma.user.count(),
    prisma.birthday.count({ where: { active: true } }),
    prisma.featuredStudent.count({ where: { active: true } }),
    prisma.event.count(),
    prisma.gallery.count(),
    prisma.student.count({ where: { active: true } }),
    prisma.auditLog.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, image: true } } },
    }),
  ])

  const today = format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">

      {/* Cabeçalho de boas-vindas */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          {currentUser?.image ? (
            <div className="w-14 h-14 rounded-2xl overflow-hidden relative border-2 border-white shadow-md shrink-0">
              <Image src={currentUser.image} alt={currentUser.name || "Avatar"} fill className="object-cover" sizes="56px" />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold text-2xl shadow-md shrink-0">
              {(currentUser?.name || "U")[0].toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-slate-500 text-sm font-medium">{greeting()},</p>
            <h1 className="text-2xl font-bold text-slate-900 leading-tight">
              {currentUser?.name?.split(" ")[0] ?? "Bem-vindo"}!
            </h1>
            <div className="flex items-center gap-2 mt-1">
              {currentUser?.role === "ADMIN" && <Shield size={12} className="text-purple-500" />}
              {currentUser?.role === "EDITOR" && <Pencil size={12} className="text-blue-500" />}
              {currentUser?.role === "VIEWER" && <Eye size={12} className="text-slate-400" />}
              <span className="text-xs font-bold text-slate-400">{roleLabel(currentUser?.role)}</span>
              <span className="text-slate-200">·</span>
              <span className="text-xs text-slate-400 capitalize">{today}</span>
            </div>
          </div>
        </div>

        {/* Ações rápidas */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/admin/posts/new"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm transition-colors">
            <Plus size={16} /> Nova Notícia
          </Link>
          <Link href="/admin/events/new"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm transition-colors">
            <CalendarDays size={16} /> Novo Evento
          </Link>
          <Link href="/admin/settings"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm transition-colors">
            <Settings size={16} />
          </Link>
        </div>
      </div>

      {/* Grid de métricas principais */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Resumo Geral</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <StatCard
            label="Notícias"
            value={postsPublished}
            sub={`${postsTotal - postsPublished} rascunho(s)`}
            icon={FileText}
            color="bg-blue-500"
            href="/admin/posts"
          />
          <StatCard
            label="Cursos Ativos"
            value={coursesCount}
            sub="Disponíveis no site"
            icon={GraduationCap}
            color="bg-emerald-500"
            href="/admin/courses"
          />
          <StatCard
            label="Eventos"
            value={eventsCount}
            sub="Agenda cadastrada"
            icon={CalendarDays}
            color="bg-orange-500"
            href="/admin/events"
          />
          <StatCard
            label="Galerias"
            value={galleriesCount}
            sub="Álbuns de fotos"
            icon={ImageIcon}
            color="bg-violet-500"
            href="/admin/gallery"
          />
          <StatCard
            label="Usuários Admin"
            value={usersCount}
            sub="Com acesso ao painel"
            icon={Users}
            color="bg-indigo-500"
            href="/admin/users"
          />
          <StatCard
            label="Aniversariantes"
            value={birthdaysCount}
            sub="Cadastros ativos"
            icon={Cake}
            color="bg-pink-500"
            href="/admin/birthdays"
          />
          <StatCard
            label="Alunos Ativos"
            value={studentsCount}
            sub="Área do aluno"
            icon={BookOpen}
            color="bg-teal-500"
            href="/admin/students"
          />
          <StatCard
            label="Aluno Destaque"
            value={featuredCount > 0 ? "Ativo" : "Vazio"}
            sub={featuredCount > 0 ? "Exibindo na home" : "Nenhum definido"}
            icon={Trophy}
            color={featuredCount > 0 ? "bg-yellow-500" : "bg-slate-400"}
            href="/admin/featured-student"
          />
        </div>
      </div>

      {/* Linha inferior: Atividade recente + Acesso rápido */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Atividade Recente */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-slate-500" />
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Atividade Recente</h3>
            </div>
            <Link href="/admin/audit" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
              Ver tudo <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentLogs.length === 0 && (
              <p className="text-center text-slate-400 text-sm py-10">Nenhuma atividade registrada.</p>
            )}
            {recentLogs.map((log) => {
              const style = ACTION_STYLE[log.action] ?? { bg: "bg-slate-50", text: "text-slate-700", dot: "bg-slate-400" }
              return (
                <div key={log.id} className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50/60 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden relative flex items-center justify-center shrink-0 mt-0.5">
                    {log.user.image
                      ? <Image src={log.user.image} alt={log.user.name || "U"} fill className="object-cover" sizes="32px" />
                      : <span className="text-slate-500 font-bold text-xs">{(log.user.name || "U")[0].toUpperCase()}</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-700 text-sm">{log.user.name || "Sistema"}</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${style.bg} ${style.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                        {log.action}
                      </span>
                      <span className="text-slate-600 text-sm font-medium">{log.resource}</span>
                    </div>
                    {log.details && (
                      <p className="text-xs text-slate-400 mt-0.5 truncate">{log.details}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 shrink-0 text-xs ml-2">
                    <Clock size={11} />
                    {format(new Date(log.createdAt), "dd/MM HH:mm")}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Acesso Rápido */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide flex items-center gap-2">
              <TrendingUp size={18} className="text-slate-500" /> Acesso Rápido
            </h3>
          </div>
          <div className="p-4 space-y-2">
            {[
              { href: "/admin/posts/new",          icon: FileText,     label: "Nova Notícia",        color: "text-blue-600   bg-blue-50   hover:bg-blue-100" },
              { href: "/admin/events/new",          icon: CalendarDays, label: "Novo Evento",         color: "text-orange-600 bg-orange-50 hover:bg-orange-100" },
              { href: "/admin/courses/new",         icon: GraduationCap,label: "Novo Curso",          color: "text-emerald-600 bg-emerald-50 hover:bg-emerald-100" },
              { href: "/admin/institution/team/new",icon: Users,        label: "Novo Membro",         color: "text-violet-600 bg-violet-50 hover:bg-violet-100" },
              { href: "/admin/gallery/new",         icon: ImageIcon,    label: "Nova Galeria",        color: "text-pink-600   bg-pink-50   hover:bg-pink-100" },
              { href: "/admin/institution/projects/new", icon: Briefcase, label: "Novo Projeto",     color: "text-teal-600   bg-teal-50   hover:bg-teal-100" },
              { href: "/admin/featured-student/new",icon: Medal,        label: "Aluno Destaque",      color: "text-yellow-600 bg-yellow-50 hover:bg-yellow-100" },
              { href: "/",                          icon: ArrowUpRight,  label: "Ver Site Público",   color: "text-slate-600  bg-slate-50  hover:bg-slate-100", target: "_blank" },
            ].map(({ href, icon: Icon, label, color, target }) => (
              <Link
                key={href}
                href={href}
                target={target}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${color}`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
