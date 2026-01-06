import { prisma } from "./prisma"

let cachedSettings: any = null
let lastFetch = 0
const CACHE_DURATION = 60000

export async function getSiteSettings() {
  const now = Date.now()
  
  if (cachedSettings && (now - lastFetch) < CACHE_DURATION) {
    return cachedSettings
  }

  let settings = await prisma.siteSettings.findFirst()

  if (!settings) {
    settings = await prisma.siteSettings.create({
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
  }

  cachedSettings = settings
  lastFetch = now
  
  return settings
}

export function clearSettingsCache() {
  cachedSettings = null
  lastFetch = 0
}
