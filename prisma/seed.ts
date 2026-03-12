import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs' // Lembre-se que instalamos com: npm install bcryptjs

const prisma = new PrismaClient()

async function main() {
  console.log('A iniciar a criação do utilizador Admin...')

  // Encriptar a palavra-passe 'admin123'
  const hashedPassword = await bcrypt.hash('admin123', 10)

  // Criar o utilizador na base de dados (Upsert previne duplicação se correr 2 vezes)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pmmirim.com.br' },
    update: {},
    create: {
      name: 'Comandante',
      email: 'admin@pmmirim.com.br',
      password: hashedPassword,
      role: 'ADMIN', // Utiliza o Enum Role do seu schema
    },
  })

  console.log('✅ Utilizador Admin criado com sucesso!')
  console.log('E-mail:', admin.email)
  console.log('Palavra-passe: admin123')
}

main()
  .catch((e) => {
    console.error('❌ Erro ao criar utilizador:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })