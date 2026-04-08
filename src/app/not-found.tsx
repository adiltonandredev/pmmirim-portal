import { ErrorModal } from "@/components/public/ErrorModal"

export default function NotFound() {
  return (
    <ErrorModal
      code={404}
      title="Página não encontrada"
      description="A página que você está procurando não existe, foi movida ou o endereço foi digitado incorretamente."
      type="not-found"
    />
  )
}
