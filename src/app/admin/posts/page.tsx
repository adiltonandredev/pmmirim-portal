// src/app/admin/posts/page.tsx
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { DeletePostButton } from "@/components/DeletePostButton" // Vamos criar jájá

export default async function PostsPage() {
  // Busca posts ordenados por data (mais novos primeiro)
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gerenciar Notícias</h1>
          <p className="text-gray-500">Publique novidades e eventos do portal.</p>
        </div>
        
        <Link 
          href="/admin/posts/new"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition shadow-sm"
        >
          + Nova Notícia
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 font-medium">
            <tr>
              <th className="px-6 py-3">Título</th>
              <th className="px-6 py-3">Tipo</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Exibição</th>
              <th className="px-6 py-3">Data</th>
              <th className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {post.title}
                  <div className="text-xs text-gray-400 font-normal">/{post.slug}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {post.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {post.published ? (
                    <span className="text-green-600 font-bold text-xs">● Publicado</span>
                  ) : (
                    <span className="text-gray-400 text-xs">○ Rascunho</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {post.isFeatured && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-semibold">
                      ⭐ Destaque
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-3">
                  <Link href={`/admin/posts/${post.id}/edit`} className="text-blue-600 hover:underline">
                    Editar
                  </Link>
                  <DeletePostButton postId={post.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {posts.length === 0 && (
          <div className="p-10 text-center text-gray-500">
            Nenhuma notícia encontrada. Comece criando a primeira!
          </div>
        )}
      </div>
    </div>
  )
}