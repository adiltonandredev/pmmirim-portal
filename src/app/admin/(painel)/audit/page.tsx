import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ShieldCheck, Plus, Pencil, Trash2, LogIn, Activity, User, Clock, Search } from "lucide-react"
import { PageContainer, PageHeader, PageTitle, PageContent } from "@/components/admin/shared/PageLayout"

export const dynamic = "force-dynamic"

const ACTION_STYLE: Record<string, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  CRIOU:   { label: "Criou",   bg: "bg-emerald-100", text: "text-emerald-700", icon: <Plus size={11} strokeWidth={3} /> },
  EDITOU:  { label: "Editou",  bg: "bg-blue-100",    text: "text-blue-700",    icon: <Pencil size={11} strokeWidth={3} /> },
  EXCLUIU: { label: "Excluiu", bg: "bg-red-100",     text: "text-red-700",     icon: <Trash2 size={11} strokeWidth={3} /> },
  LOGIN:   { label: "Login",   bg: "bg-purple-100",  text: "text-purple-700",  icon: <LogIn size={11} strokeWidth={3} /> },
}

function ActionBadge({ action }: { action: string }) {
  const style = ACTION_STYLE[action] ?? { label: action, bg: "bg-slate-100", text: "text-slate-700", icon: <Activity size={11} /> }
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wide ${style.bg} ${style.text}`}>
      {style.icon} {style.label}
    </span>
  )
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-black text-slate-900">{value}</p>
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
      </div>
    </div>
  )
}

export default async function AuditPage() {
  const logs = await prisma.auditLog.findMany({
    take: 100,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  })

  const totalCriou   = logs.filter(l => l.action === "CRIOU").length
  const totalEditou  = logs.filter(l => l.action === "EDITOU").length
  const totalExcluiu = logs.filter(l => l.action === "EXCLUIU").length

  // Agrupa por data para exibição
  const grouped = logs.reduce<Record<string, typeof logs>>((acc, log) => {
    const day = format(log.createdAt, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    if (!acc[day]) acc[day] = []
    acc[day].push(log)
    return acc
  }, {})

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle
          title="Auditoria"
          subtitle="Histórico completo de ações realizadas no sistema."
          icon={ShieldCheck}
        />
      </PageHeader>

      <PageContent>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total de Ações" value={logs.length}     icon={Activity}    color="bg-slate-700" />
          <StatCard label="Criações"        value={totalCriou}     icon={Plus}        color="bg-emerald-600" />
          <StatCard label="Edições"         value={totalEditou}    icon={Pencil}      color="bg-blue-600" />
          <StatCard label="Exclusões"       value={totalExcluiu}   icon={Trash2}      color="bg-red-600" />
        </div>

        {logs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
            <Activity size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-500 font-medium">Nenhuma atividade registrada ainda.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([day, dayLogs]) => (
              <div key={day}>
                {/* Cabeçalho do dia */}
                <div className="flex items-center gap-3 mb-3">
                  <Clock size={14} className="text-slate-400" />
                  <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{day}</span>
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-bold">{dayLogs.length}</span>
                </div>

                {/* Logs do dia */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  {dayLogs.map((log, idx) => (
                    <div
                      key={log.id}
                      className={`flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 ${
                        idx !== dayLogs.length - 1 ? "border-b border-slate-100" : ""
                      } hover:bg-slate-50/70 transition-colors`}
                    >
                      {/* Hora */}
                      <div className="shrink-0 w-16 text-xs font-bold text-slate-400 font-mono">
                        {format(log.createdAt, "HH:mm:ss")}
                      </div>

                      {/* Usuário */}
                      <div className="flex items-center gap-2 shrink-0 w-44">
                        <div className="w-7 h-7 rounded-full bg-blue-900 flex items-center justify-center shrink-0">
                          <User size={13} className="text-white" />
                        </div>
                        <span className="text-sm font-bold text-slate-700 truncate">
                          {log.user?.name || log.user?.email || "Sistema"}
                        </span>
                      </div>

                      {/* Badge de ação */}
                      <div className="shrink-0">
                        <ActionBadge action={log.action} />
                      </div>

                      {/* Recurso */}
                      <div className="shrink-0">
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                          {log.resource}
                        </span>
                      </div>

                      {/* Detalhes */}
                      {log.details && (
                        <div className="flex-1 text-xs text-slate-400 italic truncate sm:text-right">
                          {log.details}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </PageContent>
    </PageContainer>
  )
}
