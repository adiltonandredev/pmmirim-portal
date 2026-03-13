import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils" // Certifique-se que tem o utils do shadcn, ou remova o cn()

// 1. CONTAINER PRINCIPAL DA PÁGINA
// Use isso em volta de TODO o conteúdo da page.tsx
export function PageContainer({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("container mx-auto p-2 md:p-8 max-w-7xl space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500", className)}>
      {children}
    </div>
  )
}

// 2. CABEÇALHO DA PÁGINA
// Organiza o Título à esquerda e Botões de Ação (Salvar/Novo) à direita
export function PageHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-0 bg-white md:bg-transparent p-3 md:p-0 rounded-lg shadow-sm md:shadow-none border md:border-none border-slate-100">
      {children}
    </div>
  )
}

// 3. TÍTULO PADRÃO (Com suporte a botão voltar automático)
interface PageTitleProps {
  title: string
  subtitle?: string
  icon?: React.ElementType
  backLink?: string // Se passar isso, aparece o botão voltar
}

export function PageTitle({ title, subtitle, icon: Icon, backLink }: PageTitleProps) {
  return (
    <div className="flex items-center gap-3">
      {backLink && (
        <Link href={backLink}>
          <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10 rounded-full hover:bg-slate-100 text-slate-500 -ml-2 md:ml-0">
            <ArrowLeft className="h-4 w-4 md:h-6 md:w-6" />
          </Button>
        </Link>
      )}
      
      <div>
        <h1 className="text-base md:text-2xl font-bold text-slate-800 flex items-center gap-2">
          {Icon && (
            <span className="bg-blue-100 text-blue-600 p-1 md:p-1.5 rounded-lg">
               <Icon className="h-3 w-3 md:h-5 md:w-5" /> 
            </span>
          )}
          {title}
        </h1>
        {subtitle && (
            <p className="text-xs md:text-sm text-slate-500 mt-0.5 hidden md:block">
                {subtitle}
            </p>
        )}
      </div>
    </div>
  )
}

// 4. ÁREA DE CONTEÚDO (CARD BRANCO)
// Já vem com o padding apertado no mobile (p-3) e largo no PC (p-8)
export function PageContent({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("bg-white rounded-lg md:rounded-xl shadow-sm border border-slate-200 overflow-hidden", className)}>
      <div className="p-3 md:p-8">
        {children}
      </div>
    </div>
  )
}