import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Força a página a sempre buscar dados novos (não fazer cache)
export const dynamic = 'force-dynamic';

export default async function AuditPage() {
  // Busca os últimos 50 logs (do mais novo para o mais antigo)
  const logs = await prisma.auditLog.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: { user: true }, // Traz o nome do usuário junto
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-slate-800">🕵️ Auditoria</h1>
            <p className="text-slate-500">Quem fez o que e quando.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-slate-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-100 text-slate-700 uppercase font-bold border-b">
            <tr>
              <th className="px-6 py-3">Data</th>
              <th className="px-6 py-3">Quem</th>
              <th className="px-6 py-3">Ação</th>
              <th className="px-6 py-3">Onde</th>
              <th className="px-6 py-3">Detalhes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                  {format(log.createdAt, "dd/MM HH:mm", { locale: ptBR })}
                </td>
                <td className="px-6 py-4 font-bold text-slate-700">
                    {log.user?.name || log.user?.email}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${
                    log.action === "CRIOU" ? "bg-green-100 text-green-700" :
                    log.action === "EXCLUIU" ? "bg-red-100 text-red-700" :
                    log.action === "EDITOU" ? "bg-blue-100 text-blue-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">{log.resource}</td>
                <td className="px-6 py-4 text-slate-400 italic text-xs truncate max-w-[200px]">
                  {log.details}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                  Nenhuma atividade registrada ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}