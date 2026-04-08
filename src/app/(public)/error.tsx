"use client"

import { ErrorModal } from "@/components/public/ErrorModal"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <ErrorModal
      code={500}
      title="Algo deu errado"
      description="Ocorreu um erro inesperado. Nossa equipe foi notificada. Tente novamente ou volte para o início."
      type="error"
    />
  )
}
