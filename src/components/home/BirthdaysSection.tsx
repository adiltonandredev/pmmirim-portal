import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cake, Calendar } from "lucide-react";

/**
 * Componente que exibe aniversariantes do mês atual
 * Mostra foto, nome, data de aniversário e turma
 * Filtra automaticamente pelo mês atual
 */
interface Birthday {
  id: string;
  studentName: string;
  birthDate: Date;
  photoUrl: string | null;
  class: string | null;
}

export function BirthdaysSection({ birthdays }: { birthdays: Birthday[] }) {
  if (birthdays.length === 0) return null;

  const currentMonth = new Date().toLocaleDateString('pt-BR', { month: 'long' });

  return (
    <section className="container mx-auto px-4 py-12">
      <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl md:text-3xl">
            <div className="p-3 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl text-white shadow-lg">
              <Cake size={28} />
            </div>
            Aniversariantes de {currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {birthdays.map((birthday) => (
              <div
                key={birthday.id}
                className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden bg-pink-100">
                  {birthday.photoUrl ? (
                    <Image
                      src={birthday.photoUrl}
                      alt={birthday.studentName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-pink-400">
                      <Cake size={32} />
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-sm text-slate-900 mb-1 line-clamp-2">
                  {birthday.studentName}
                </h3>
                <div className="flex items-center justify-center gap-1 text-xs text-slate-600 mb-2">
                  <Calendar className="h-3 w-3" />
                  {new Date(birthday.birthDate).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                  })}
                </div>
                {birthday.class && (
                  <Badge variant="outline" className="text-xs">
                    {birthday.class}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
