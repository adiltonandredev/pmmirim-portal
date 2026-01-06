import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...")

  const existingSettings = await prisma.siteSettings.findFirst()
  
  if (!existingSettings) {
    console.log("📝 Criando configurações iniciais do site...")
    await prisma.siteSettings.create({
      data: {
        siteName: "PMMIRIM",
        siteDescription: "Portal oficial da Polícia Militar Mirim - Formando cidadãos conscientes e preparados para o futuro",
        contactEmail: "contato@pmmirim.org.br",
        contactPhone: "(11) 1234-5678",
        address: "Rua Exemplo, 123 - Centro\nCidade - Estado, CEP 12345-678",
        missionText: "Formar cidadãos conscientes, disciplinados e comprometidos com valores éticos.",
        visionText: "Ser referência em educação cidadã e formação de jovens.",
        valuesText: "Respeito, Disciplina, Responsabilidade, Honestidade, Solidariedade",
        footerText: "© 2026 PMMIRIM - Todos os direitos reservados",
      },
    })
    console.log("✅ Configurações criadas com sucesso!")
  } else {
    console.log("ℹ️  Configurações já existem, pulando...")
  }

  console.log("✅ Seed concluído!")
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
