import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"
import { authConfig } from "./auth.config"
import { checkRateLimit, resetRateLimit } from "./lib/rate-limit"
import { getClientIp } from "./lib/get-ip"
import { verifyTOTP } from "./lib/totp"

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },

  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, request) => {
        if (!credentials?.email || !credentials?.password) return null

        const email = credentials.email as string
        const ip = getClientIp(request as unknown as Request)

        const [emailLimit, ipLimit] = await Promise.all([
          checkRateLimit("login", email),
          checkRateLimit("login-ip", ip),
        ])

        if (!emailLimit.allowed) {
          const mins = Math.ceil((emailLimit.resetTime! - Date.now()) / 60000)
          throw new Error(`Muitas tentativas de login. Tente novamente em ${mins} minutos.`)
        }

        if (!ipLimit.allowed) {
          const mins = Math.ceil((ipLimit.resetTime! - Date.now()) / 60000)
          throw new Error(`Muitas tentativas de login. Tente novamente em ${mins} minutos.`)
        }

        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user) return null

        const isPasswordValid = await compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) return null

        await Promise.all([
          resetRateLimit("login", email),
          resetRateLimit("login-ip", ip),
        ])

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          twoFactorEnabled: user.twoFactorEnabled,
        }
      },
    }),

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: { scope: "openid email profile" }
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "COMMENTER",
          twoFactorEnabled: false,
        }
      }
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role
        token.twoFactorEnabled = user.twoFactorEnabled ?? false
        // Se 2FA está desativado, considera verificado automaticamente
        token.twoFactorVerified = !(user.twoFactorEnabled ?? false)
      }

      // Verificação do código TOTP via session update
      if (trigger === "update" && session?.twoFactorCode && token.sub) {
        const dbUser = await prisma.user.findUnique({ where: { id: token.sub } })
        if (dbUser?.twoFactorEnabled && dbUser.twoFactorSecret) {
          const isValid = verifyTOTP(session.twoFactorCode as string, dbUser.twoFactorSecret)
          if (isValid) token.twoFactorVerified = true
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string
        session.user.id = token.sub ?? ""
        session.user.twoFactorEnabled = Boolean(token.twoFactorEnabled)
        session.user.twoFactorVerified = token.twoFactorVerified !== false
      }
      return session
    },
  },
})
