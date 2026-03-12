import { prisma } from "@/lib/prisma"
import { FeaturedStudentForm, StudentData } from "@/components/admin/FeaturedStudentForm" 
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"
type Props = { params: Promise<{ id: string }> }

export default async function EditStudentPage(props: Props) {
  const params = await props.params;
  const student = await prisma.featuredStudent.findUnique({ where: { id: params.id } })

  if (!student) return notFound()

  return (
    <div className="container mx-auto p-8 max-w-5xl">
      <FeaturedStudentForm student={JSON.parse(JSON.stringify(student)) as unknown as StudentData} />
    </div>
  )
}