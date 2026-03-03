import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils" // Utilitário padrão do shadcn/ui para juntar classes

interface BackButtonProps {
  href?: string
  label?: string
  className?: string
}

export function BackButton({ 
  href = "/", 
  label = "Voltar ao Início", 
  className 
}: BackButtonProps) {
  return (
    <div className={cn("text-center", className)}>
      <Link href={href}>
        <Button 
          variant="outline" 
          className="font-bold border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-900 px-8 h-12 transition-all"
        >
          <ArrowRight className="mr-2 rotate-180" size={18}/> 
          {label}
        </Button>
      </Link>
    </div>
  )
}