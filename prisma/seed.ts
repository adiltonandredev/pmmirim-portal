import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Criptografando a senha "123456"
  const passwordHash = await hash('123456', 12)

  const user = await prisma.user.upsert({
    where: { email: 'admin@pmmirim.org.br' },
    update: {}, 
    create: {
      email: 'admin@pmmirim.org.br',
      name: 'Comandante Admin',
      password: passwordHash,
      role: 'ADMIN',
    },
  })

  console.log('✅ Usuário criado com sucesso!')
  console.log(user)
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