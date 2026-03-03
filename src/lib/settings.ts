import { prisma } from "@/lib/prisma"

export async function getSiteSettings() {
  // Tenta encontrar a configuração existente
  let settings = await prisma.siteSettings.findFirst()

  // Se não existir, cria uma padrão com os campos CORRETOS do Schema atual
  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: {
        siteName: "Polícia Militar Mirim",
        // CORREÇÃO: No schema é 'description', não 'siteDescription'
        description: "Portal oficial da Polícia Militar Mirim - Formando cidadãos conscientes.",
        
        contactEmail: "contato@pmmirim.org.br",
        contactPhone: "(69) 99999-9999",
        address: "Rua Paraná, 3502 - Centro - CEP 76916-000 - Presidente Médidi/RO",
        
        // Removemos missionText, visionText, etc pois eles não existem mais nessa tabela
        businessHours: "Segunda a Sexta: 08h às 17h",
      },
    })
  }

  return settings
}