import Image from "next/image"
import Link from "next/link"
import { Instagram } from "lucide-react"
import { getInstagramFeed } from "@/app/actions/instagram"
import { prisma } from "@/lib/prisma"

export async function InstagramFeed() {
  // Busca os dados (Token e Fotos)
  const settings = await prisma.instagramSettings.findFirst()
  const posts = await getInstagramFeed()

  // Se estiver desativado ou sem posts, não renderiza nada (ou renderiza um aviso se preferir)
  if (!settings?.enabled || posts.length === 0) return null

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
            <div className="text-center md:text-left">
                <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight flex items-center justify-center md:justify-start gap-3">
                    <span className="bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 text-transparent bg-clip-text">
                        Siga-nos
                    </span> 
                    <span className="text-slate-900">no Instagram</span>
                </h2>
                <p className="text-slate-500 mt-2 text-lg">
                    Acompanhe o dia a dia da nossa corporação.
                </p>
            </div>

            <Link 
                href={`https://instagram.com/${settings.username?.replace('@', '')}`} 
                target="_blank"
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
                <Instagram size={20} />
                {settings.username || "@policiamirim"}
            </Link>
        </div>

        {/* Grid de Fotos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {posts.map((post: any) => (
                <Link 
                    key={post.id} 
                    href={post.permalink} 
                    target="_blank"
                    className="group relative aspect-square overflow-hidden rounded-2xl bg-slate-100 block shadow-md hover:shadow-2xl transition-all duration-500"
                >
                    <Image
                        src={post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url}
                        alt={post.caption || "Instagram Post"}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Overlay com Ícone */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                        <Instagram className="text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 drop-shadow-md" size={32} />
                    </div>
                </Link>
            ))}
        </div>

      </div>
    </section>
  )
}