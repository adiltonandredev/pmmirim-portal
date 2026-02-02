import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // 1. CRIAR USUÁRIO ADMIN
  const passwordHash = await hash('123456', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pmmirim.com' },
    update: {},
    create: {
      email: 'admin@pmmirim.com',
      name: 'Comandante Admin',
      password: passwordHash,
      role: 'ADMIN',
    },
  })
  console.log(`👤 Admin garantido: ${admin.email}`)

  // 2. CONFIGURAÇÕES DO SITE (Campos corrigidos pelo Schema atual)
  await prisma.siteSettings.upsert({
    where: { id: 'default-settings' },
    update: {},
    create: {
      id: 'default-settings', // Força um ID conhecido
      siteName: 'Polícia Mirim de Presidente Médici',
      description: 'Disciplina, Honra e Educação para o futuro.', // Campo correto (era siteDescription)
      contactEmail: 'contato@pmmirim.com',
      contactPhone: '(69) 99999-9999',
      address: 'Av. Principal, 123 - Centro, Presidente Médici - RO',
      businessHours: 'Segunda a Sexta: 08h às 17h',
      instagramUrl: 'https://instagram.com/pmmirim',
      facebookUrl: 'https://facebook.com/pmmirim',
      legalName: 'Associação da Polícia Mirim',
      cnpj: '00.000.000/0001-00',
    },
  })
  console.log('⚙️ Configurações criadas')

  // 3. HISTÓRIA E VALORES (Nova tabela)
  const history = await prisma.institutionHistory.findFirst()
  if (!history) {
    await prisma.institutionHistory.create({
      data: {
        title: 'Nossa História',
        content: 'A Polícia Mirim foi fundada em...',
        mission: 'Formar cidadãos conscientes e disciplinados.',
        vision: 'Ser referência em educação cívico-militar no estado.',
        values: 'Disciplina, Honra, Lealdade e Educação.',
        principles: 'Respeito à hierarquia e amor à pátria.',
      }
    })
    console.log('📜 História e Valores criados')
  }

  // 4. ANIVERSARIANTES
  // Usamos createMany. Se rodar de novo, ele cria duplicatas (não tem campo unique).
  // Para evitar "lixo", apagamos os antigos de teste primeiro (opcional).
  const countBirthdays = await prisma.birthday.count()
  if (countBirthdays === 0) {
    const today = new Date()
    await prisma.birthday.createMany({
      data: [
        {
          name: 'Ana Souza',
          role: '3º Pelotão',
          date: new Date(today.getFullYear(), today.getMonth(), 12),
          active: true,
        },
        {
          name: 'Carlos Oliveira',
          role: 'Instrutor',
          date: new Date(today.getFullYear(), today.getMonth(), 15),
          active: true,
        },
        {
          name: 'Sgt. Pereira',
          role: 'Diretoria',
          date: new Date(today.getFullYear(), today.getMonth() + 1, 5),
          active: true,
        },
      ],
    })
    console.log('🎂 Aniversariantes criados')
  }

  // 5. NOTÍCIAS E PROJETOS
  // "skipDuplicates: true" evita o erro de Slug duplicado
  await prisma.post.createMany({
    skipDuplicates: true, 
    data: [
      {
        title: 'Formatura da Turma 2025',
        slug: 'formatura-turma-2025',
        content: '<p>Foi realizada com grande êxito a formatura dos novos cadetes...</p>',
        summary: 'Cerimônia emocionante marcou o encerramento do ciclo de formação.',
        published: true,
        type: 'NEWS',
        featured: true,
        coverImage: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1000',
      },
      {
        title: 'Projeto Guardiões do Trânsito',
        slug: 'projeto-guardioes',
        content: '<p>O projeto visa integrar jovens na conscientização do trânsito...</p>',
        summary: 'Iniciativa social que leva educação de trânsito para as ruas.',
        published: true,
        type: 'PROJECT',
        coverImage: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=1000',
      },
      {
        title: 'Inscrições Abertas 2026',
        slug: 'inscricoes-2026',
        content: '<p>Garanta a vaga do seu filho...</p>',
        summary: 'Saiba como participar do processo seletivo.',
        published: true,
        type: 'NEWS',
        coverImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1000',
      },
    ],
  })
  console.log('📰 Notícias garantidas')

  // 6. ALUNO DESTAQUE
  const countFeatured = await prisma.featuredStudent.count()
  if (countFeatured === 0) {
    const today = new Date()
    await prisma.featuredStudent.create({
      data: {
        studentName: 'João Gabriel Peixoto',
        achievement: 'Nota Máxima em Disciplina',
        description: 'Aluno exemplar, sempre pontual e com uniforme impecável.',
        class: 'Pelotão Bravo',
        month: today.getMonth() + 1,
        year: today.getFullYear(),
        active: true,
        // Foto genérica
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000', 
      },
    })
    console.log('🏆 Aluno Destaque criado')
  }

  // 7. PARCEIROS
  await prisma.partner.createMany({
    skipDuplicates: true, // Evita erro se IDs colidirem (embora cuid seja aleatório)
    data: [
      { id: 'partner-1', name: 'Prefeitura Municipal', active: true, logoUrl: 'https://placehold.co/200x200/png?text=Prefeitura' },
      { id: 'partner-2', name: 'Comércio Local', active: true, logoUrl: 'https://placehold.co/200x200/png?text=Comercio' },
    ],
  })
  console.log('🤝 Parceiros criados')

  // 8. CURSOS
  await prisma.course.createMany({
    skipDuplicates: true,
    data: [
      {
        title: 'Informática Básica',
        slug: 'informatica-basica',
        description: 'Curso de inclusão digital.',
        content: 'Módulos de Windows, Word e Excel.',
        duration: '60 Horas',
        targetAge: '10 a 14 anos',
        active: true,
        featured: true,
      }
    ]
  })
  console.log('📚 Cursos criados')

  // 9. DIRETORIA (BoardMembers)
  const countBoard = await prisma.boardMember.count()
  if (countBoard === 0) {
    await prisma.boardMember.createMany({
      data: [
        { name: 'Capitão Silva', position: 'Presidente', order: 1 },
        { name: 'Sra. Maria', position: 'Diretora Pedagógica', order: 2 },
      ]
    })
    console.log('👔 Diretoria criada')
  }
  
  console.log('✅ Seed finalizado com sucesso!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })