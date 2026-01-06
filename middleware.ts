// middleware.ts
import NextAuth from "next-auth"
import { authConfig } from "./src/auth.config"

export default NextAuth(authConfig).auth

export const config = {
  // Protege todas as rotas exceto arquivos estáticos e imagens
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}