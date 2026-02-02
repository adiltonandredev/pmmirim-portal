import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, FileText, Building2 } from "lucide-react";

/**
 * Página admin para gerenciar informações da instituição
 * Gerencia: História, Estrutura Organizacional
 */
export default async function InstitutionAdminPage() {
  const [history, structures] = await Promise.all([
    prisma.institutionHistory.findFirst({
      orderBy: { updatedAt: "desc" },
    }),
    prisma.organizationalStructure.findMany({
      orderBy: { order: "asc" },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Gerenciar Instituição</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>História da Instituição</CardTitle>
                  <CardDescription>
                    Missão, visão, valores e princípios
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {history ? (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm font-medium text-slate-900 mb-2">{history.title}</p>
                  <Badge variant="outline">
                    Atualizado em {new Date(history.updatedAt).toLocaleDateString('pt-BR')}
                  </Badge>
                </div>
                <Link href="/admin/institution/history">
                  <Button className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar História
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-slate-600">Nenhum histórico cadastrado</p>
                <Link href="/admin/institution/history">
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar História
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle>Estrutura Organizacional</CardTitle>
                  <CardDescription>
                    Organogramas e hierarquia
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {structures.length > 0 ? (
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm font-medium text-slate-900 mb-2">
                    {structures.length} estrutura(s) cadastrada(s)
                  </p>
                </div>
              ) : (
                <p className="text-sm text-slate-600">Nenhuma estrutura cadastrada</p>
              )}
              <Link href="/admin/institution/structure">
                <Button className="w-full">
                  <Edit className="h-4 w-4 mr-2" />
                  Gerenciar Estruturas
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
