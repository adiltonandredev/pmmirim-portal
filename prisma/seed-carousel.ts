import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🎠 Criando slides padrão do carousel...")

  const existingItems = await prisma.carouselItem.count()
  
  if (existingItems === 0) {
    await prisma.carouselItem.createMany({
      data: [
        {
          title: "Disciplina, Honra e Educação",
          description: "Formando cidadãos conscientes e preparados para o futuro.",
          imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2574&auto=format&fit=crop",
          actionUrl: "/sobre",
          actionText: "Saiba Mais",
          isActive: true,
          order: 1,
        },
        {
          title: "Inscrições Abertas 2026",
          description: "Garanta a vaga do seu filho na nova turma.",
          imageUrl: "https://images.unsplash.com/photo-1577896335477-2858506f971d?q=80&w=2574&auto=format&fit=crop",
          actionUrl: "/contato",
          actionText: "Inscreva-se",
          isActive: true,
          order: 2,
        },
      ],
    })
    console.log("✅ 2 slides criados com sucesso!")
  } else {
    console.log("ℹ️  Carousel já possui slides, pulando...")
  }

  console.log("✅ Seed do carousel concluído!")
}

main()
  .catch((e) => {
    console.error("❌ Erro:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
