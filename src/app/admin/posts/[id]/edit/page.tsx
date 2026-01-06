import { prisma } from "@/lib/prisma"
import { updatePost } from "@/app/actions/updatePost"
import Link from "next/link"
import { notFound } from "next/navigation"
import { EditPostForm } from "@/components/EditPostForm"

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const { id } = await params
  
  const post = await prisma.post.findUnique({
    where: { id },
  })

  if (!post) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Editar Notícia</h1>
        <Link 
          href="/admin/posts"
          className="text-gray-500 hover:text-gray-700"
        >
          Cancelar
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-8 border border-gray-200">
        <EditPostForm post={post} />
      </div>
    </div>
  )
}