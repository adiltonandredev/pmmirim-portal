"use client"

import * as React from "react"
// Se você não tiver o arquivo utils, pode remover o import 'cn' e a função 'cn' abaixo,
// mas geralmente projetos Shadcn/Next já têm.
import { cn } from "@/lib/utils"

interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean
  onPressedChange?: (pressed: boolean) => void
  size?: "default" | "sm" | "lg"
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, pressed, onPressedChange, size = "default", onClick, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        // Lógica de clique: inverte o estado e chama a função original se existir
        onClick={(e) => {
          onClick?.(e)
          onPressedChange?.(!pressed)
        }}
        // Estilização condicional baseada se está pressionado ou não
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          // Estilos quando NÃO está pressionado (padrão)
          !pressed && "hover:bg-slate-100 hover:text-slate-900 text-slate-500 bg-transparent",
          // Estilos quando ESTÁ pressionado (ativo)
          pressed && "bg-slate-200 text-slate-900 font-bold",
          // Tamanhos
          size === "default" && "h-10 px-3",
          size === "sm" && "h-8 px-2 min-w-[2rem]",
          size === "lg" && "h-11 px-5",
          className
        )}
        {...props}
      />
    )
  }
)

Toggle.displayName = "Toggle"

export { Toggle }