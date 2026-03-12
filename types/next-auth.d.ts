// types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string // Adicionamos o role aqui
    } & DefaultSession["user"]
  }

  interface User {
    role: string // E aqui
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string // E no token também
  }
}