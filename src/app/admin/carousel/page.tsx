import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { ArrowUp, ArrowDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeleteCarouselButton } from "@/components/DeleteCarouselButton"
import { ToggleCarouselButton } from "@/components/ToggleCarouselButton"

export default async function CarouselManagementPage() {
  const session = await auth()
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin")
  }

  const carouselItems = await prisma.carouselItem.findMany({
    orderBy: { order: 'asc' },
  })

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Gerenciar Carousel</h1>
          <p className="text-gray-600">Controle os slides do banner principal da página inicial</p>
        </div>
        <Link href="/admin/carousel/new">
          <Button className="gap-2">
            <Plus size={20} />
            Novo Slide
          </Button>
        </Link>
      </div>

      {carouselItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 mb-4">Nenhum slide cadastrado no carousel</p>
          <Link href="/admin/carousel/new">
            <Button>Criar Primeiro Slide</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {carouselItems.map((item, index) => (
            <div
              key={item.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden border-2 ${
                item.isActive ? 'border-green-500' : 'border-gray-300'
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                <div className="relative h-48 md:h-auto rounded-lg overflow-hidden bg-gray-200">
                  <Image
                    src={item.imageUrl}
                    alt={item.title || "Slide"}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="md:col-span-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Ordem: {item.order}
                      </span>
                      {item.isActive ? (
                        <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded">
                          ● Ativo
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          ○ Inativo
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {item.title || "Sem título"}
                    </h3>
                    <p className="text-gray-600 line-clamp-2 mb-3">
                      {item.description || "Sem descrição"}
                    </p>
                    
                    {item.actionUrl && (
                      <div className="text-sm text-blue-600">
                        → Link: {item.actionText || "Clique aqui"}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <Link href={`/admin/carousel/${item.id}/edit`}>
                      <Button variant="outline" size="sm">Editar</Button>
                    </Link>
                    
                    <ToggleCarouselButton 
                      itemId={item.id} 
                      isActive={item.isActive} 
                    />
                    
                    <DeleteCarouselButton itemId={item.id} />
                    
                    <div className="ml-auto flex gap-1">
                      {index > 0 && (
                        <form action={`/admin/carousel/${item.id}/move-up`} method="POST">
                          <Button variant="ghost" size="sm">
                            <ArrowUp size={16} />
                          </Button>
                        </form>
                      )}
                      {index < carouselItems.length - 1 && (
                        <form action={`/admin/carousel/${item.id}/move-down`} method="POST">
                          <Button variant="ghost" size="sm">
                            <ArrowDown size={16} />
                          </Button>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
