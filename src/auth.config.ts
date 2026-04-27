import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const path = nextUrl.pathname
      const twoFactorEnabled = auth?.user?.twoFactorEnabled ?? false
      const twoFactorVerified = auth?.user?.twoFactorVerified ?? true
      const is2FAPage = path === "/admin/2fa"
      const isLoginArea = path.startsWith("/admin/login")

      if (isLoginArea) {
        if (isLoggedIn && twoFactorVerified) {
          return Response.redirect(new URL("/admin", nextUrl))
        }
        return true
      }

      if (!isLoggedIn) return false

      // Bloqueia admin enquanto 2FA não for verificado
      if (path.startsWith("/admin")) {
        if (twoFactorEnabled && !twoFactorVerified) {
          if (is2FAPage) return true
          return Response.redirect(new URL("/admin/2fa", nextUrl))
        }
        return true
      }

      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.twoFactorEnabled = user.twoFactorEnabled ?? false
        token.twoFactorVerified = !(user.twoFactorEnabled ?? false)
      }
      return token
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.twoFactorEnabled = Boolean(token.twoFactorEnabled)
        session.user.twoFactorVerified = token.twoFactorVerified !== false
      }
      return session
    },
  },
  providers: [],
} satisfies NextAuthConfig;
