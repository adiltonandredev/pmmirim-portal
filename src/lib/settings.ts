import { prisma } from "@/lib/prisma"

const DEFAULTS = {
  siteName: "Polícia Militar Mirim",
  description: "Portal oficial da Polícia Militar Mirim - Formando cidadãos conscientes.",
  contactEmail: "contato@pmmirim.org.br",
  contactPhone: "(69) 99999-9999",
  address: "Rua Paraná, 3502 - Centro - CEP 76916-000 - Presidente Médici/RO",
  businessHours: "Segunda a Sexta: 08h às 17h",
  logoUrl: null,
  instagramUrl: null,
  facebookUrl: null,
  youtubeUrl: null,
  impactedYouth: "100+",
  yearsOfHistory: "20",
  legalName: null,
  cnpj: null,
}

export async function getSiteSettings() {
  const settings = await prisma.siteSettings.findFirst({ orderBy: { updatedAt: "desc" } })
  // Retorna os dados do banco ou os defaults — nunca cria registro automaticamente
  return settings ?? { id: null, ...DEFAULTS, createdAt: null, updatedAt: null }
}
