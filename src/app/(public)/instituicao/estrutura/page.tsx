import { prisma } from "@/lib/prisma"
import { Network, BookOpen } from "lucide-react"
import { PageHero } from "@/components/ui/page-hero"
import { BackButton } from "@/components/ui/back-button"
import Image from "next/image"

export const dynamic = "force-dynamic"

export default async function EstruturaPage() {
  const structures = await prisma.organizationalStructure.findMany({
    orderBy: { order: "asc" },
  })

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <PageHero
        title="Estrutura Organizacional"
        subtitle="Conheça como nossa instituição está organizada e hierarquizada."
        icon={Network}
        bgColor="bg-blue-950"
        themeColor="blue"
        bgImage="/bg/bg-historia.png"
      />

      <div className="container mx-auto px-4 relative -mt-6 z-20 pb-20">

        {structures.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-16 text-center border border-slate-100">
            <div className="bg-slate-100 p-6 rounded-full w-fit mx-auto mb-4">
              <BookOpen size={48} className="text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Em construção</h2>
            <p className="text-slate-500 mt-2">A estrutura organizacional será publicada em breve.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {structures.map((s) => (
              <div key={s.id} className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">

                {/* CABEÇALHO */}
                <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-8 py-6">
                  <h2 className="text-2xl font-black text-white">{s.title}</h2>
                  {s.description && (
                    <p className="text-blue-200 mt-1 text-base">{s.description}</p>
                  )}
                </div>

                <div className="p-8 md:p-12">
                  {/* IMAGEM DO ORGANOGRAMA */}
                  {s.chartImage && (
                    <div className="mb-10 rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50">
                      <Image
                        src={s.chartImage}
                        alt={s.title}
                        width={1200}
                        height={700}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  )}

                  {/* TEXTO */}
                  {s.content && (
                    <div
                      className="prose prose-lg max-w-none text-slate-600 text-justify prose-headings:font-bold prose-headings:text-slate-900 prose-p:leading-loose prose-a:text-blue-600 prose-strong:text-blue-900"
                      dangerouslySetInnerHTML={{ __html: s.content }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <BackButton className="mt-12" />
      </div>
    </main>
  )
}
