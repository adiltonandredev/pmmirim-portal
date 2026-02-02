import { PrismaClient, PostType } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando o seed...')

  // ===========================================
  // 1. CRIAR USUÁRIO ADMIN
  // ===========================================
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
  console.log('✅ Usuário Admin garantido:', user.email)
  
  // Upsert = Atualiza se existir, Cria se não existir
  const settings = await prisma.siteSettings.upsert({
    where: { id: 'default-settings' }, // Usamos um ID fixo para garantir que só tenha 1
    update: {}, // Se já existe, não faz nada
    create: {
      id: 'default-settings',
      siteName: 'Polícia MilitarMirim de Presidente Médici',
      legalName: 'Instituto Educacional Sargento de Lima',
      description: 'Site oficial da Polícia Mirim. Formando cidadãos para o futuro através da disciplina e honra.',
      cnpj: '08.826.487/0001-78', // Preencha com o real se tiver
      businessHours: 'Segunda a Sexta: 07:30 às 11:30 e 13:30 às 17:30',
      contactPhone: '(69) 99999-9999',
      contactEmail: 'contato@pmmirim.com.br',
      address: 'Rua Paraná, 3205 - Centro, Presidente Médici - RO',
    },
  })

  console.log('✅ Tudo pronto! Banco de dados povoado.')
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