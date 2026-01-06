// auth.config.ts
import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdmin = nextUrl.pathname.startsWith("/admin")

      if (isOnAdmin) {
        if (isLoggedIn) return true
        return false // Redireciona para login
      }
      
      // Se estiver logado e tentar ir para login, manda pro admin
      if (isLoggedIn && nextUrl.pathname === "/login") {
        return Response.redirect(new URL("/admin", nextUrl))
      }
      
      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    }
  },
  providers: [], // Deixe vazio aqui por enquanto
} satisfies NextAuthConfig