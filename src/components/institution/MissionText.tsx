import { prisma } from "@/lib/prisma";

export async function MissionText() {
  // Busca o primeiro registro do histórico
  const history = await prisma.institutionHistory.findFirst();
  
  // Se não tiver nada no banco, usa um texto padrão
  const text = history?.mission || "Promover a cidadania e a disciplina através da educação.";

  // Retorna apenas o texto (em um fragmento) para não quebrar layout
  return <>{text}</>;
}