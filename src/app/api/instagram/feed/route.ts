import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * API Route para buscar feed do Instagram
 * Utiliza Instagram Basic Display API
 * Requer token de acesso configurado nas configurações
 * 
 * GET /api/instagram/feed
 * Retorna os últimos posts do Instagram
 */
export async function GET() {
  try {
    const settings = await prisma.instagramSettings.findFirst();

    if (!settings || !settings.enabled || !settings.accessToken) {
      return NextResponse.json(
        { error: "Instagram não configurado" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,timestamp&access_token=${settings.accessToken}&limit=12`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar feed do Instagram");
    }

    const data = await response.json();

    return NextResponse.json({
      posts: data.data || [],
      username: settings.username,
    });
  } catch (error) {
    console.error("Erro ao buscar feed do Instagram:", error);
    return NextResponse.json(
      { error: "Erro ao buscar feed do Instagram" },
      { status: 500 }
    );
  }
}
