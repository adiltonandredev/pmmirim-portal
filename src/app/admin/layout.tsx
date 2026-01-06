// src/app/admin/layout.tsx
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LogoutButton } from "@/components/LogoutButton"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) redirect("/login")

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Barra de Navegação Superior */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-xl font-bold text-green-700">PMMirim Portal</span>
            
            <nav className="flex gap-4">
              <Link 
                href="/admin" 
                className="text-gray-600 hover:text-green-600 font-medium transition"
              >
                Usuários
              </Link>
              <Link 
                href="/admin/posts" 
                className="text-gray-600 hover:text-green-600 font-medium transition"
              >
                Notícias
              </Link>
              <Link 
                href="/admin/carousel" 
                className="text-gray-600 hover:text-green-600 font-medium transition"
              >
                Carousel
              </Link>
              {session.user.role === "ADMIN" && (
                <Link 
                  href="/admin/settings" 
                  className="text-gray-600 hover:text-green-600 font-medium transition"
                >
                  Configurações
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
             <Link href="/" target="_blank">
                <Button variant="outline" size="sm" className="gap-2">
                  <Home size={16} />
                  Ver Site
                </Button>
             </Link>
             <div className="h-6 w-px bg-gray-300"></div>
             <div className="text-sm text-right">
                <p className="font-medium text-gray-900">{session.user.name}</p>
                <p className="text-xs text-gray-500">{session.user.role}</p>
             </div>
             <LogoutButton />
          </div>
        </div>
      </header>

      {/* Conteúdo da Página (Usuários ou Notícias) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        {children}
      </main>
    </div>
  )
}