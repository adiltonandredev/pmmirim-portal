import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma" // <--- 1. Melhor usar o import global
import { compare } from "bcryptjs"
import { authConfig } from "./auth.config"
import { checkRateLimit, resetRateLimit } from "./lib/rate-limit"

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

        // Aqui você devolve o role, mas precisa dos callbacks abaixo para salvar
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, 
        }
      },
    }),
  ],

  // 👇 2. ADICIONE ESTE BLOCO CALLBACKS (ESSENCIAL) 👇
  callbacks: {
    // Passo A: O Login acontece e o "user" (com o role) chega aqui.
    // Nós passamos o role para o TOKEN.
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    // Passo B: O navegador pede a sessão.
    // Nós pegamos o role do TOKEN e colocamos na SESSÃO.
    async session({ session, token }) {
      if (token && session.user) {
        // @ts-ignore (Ignora erro de tipo se não tiver configurado types)
        session.user.role = token.role as string;
        // @ts-ignore
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
})