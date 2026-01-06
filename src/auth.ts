import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"
import { compare } from "bcryptjs"
import { authConfig } from "./auth.config"
import { checkRateLimit, resetRateLimit } from "./lib/rate-limit"

const prisma = new PrismaClient()

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null

        const rateLimitCheck = checkRateLimit(credentials.email as string)
        if (!rateLimitCheck.allowed) {
          const resetMinutes = Math.ceil((rateLimitCheck.resetTime! - Date.now()) / 60000)
          throw new Error(`Muitas tentativas de login. Tente novamente em ${resetMinutes} minutos.`)
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user) return null

        const isPasswordValid = await compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) return null

        resetRateLimit(credentials.email as string)

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
})