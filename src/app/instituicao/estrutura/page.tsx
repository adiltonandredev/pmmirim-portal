import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

/**
 * Página pública que exibe a estrutura organizacional da instituição
 * Mostra organogramas e descrição da estrutura hierárquica
 */
export default async function EstruturaPage() {
  const settings = await getSiteSettings();
  
  const structures = await prisma.organizationalStructure.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Estrutura Organizacional
            </h1>
            <p className="text-lg text-blue-100 max-w-3xl">
              Conheça como nossa instituição está estruturada e organizada
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {structures.length > 0 ? (
            <div className="space-y-12">
              {structures.map((structure) => (
                <Card key={structure.id} className="overflow-hidden">
                  <CardHeader className="bg-slate-50">
                    <CardTitle className="text-2xl">{structure.title}</CardTitle>
                    {structure.description && (
                      <CardDescription className="text-base">
                        {structure.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="pt-6">
                    {structure.chartImage && (
                      <div className="mb-8 rounded-lg overflow-hidden border">
                        <Image
                          src={structure.chartImage}
                          alt={structure.title}
                          width={1200}
                          height={600}
                          className="w-full h-auto"
                        />
                      </div>
                    )}
                    <div
                      className="prose prose-lg max-w-none text-slate-700"
                      dangerouslySetInnerHTML={{ __html: structure.content }}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Card className="max-w-2xl mx-auto">
                <CardContent className="pt-6">
                  <p className="text-lg text-slate-600">
                    Estrutura organizacional em construção. Em breve mais informações.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
