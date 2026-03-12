import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      
      // Verifica se a rota começa com /admin
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      
      // Lógica de Proteção
      if (isOnAdmin) {
        if (isLoggedIn) return true; // Logado no admin? Pode entrar.
        return false; // Não logado no admin? Bloqueia (vai pro login).
      }
      
      // Lógica de Redirecionamento Inverso
      // (Se já está logado e tenta ver a tela de login, joga pro painel)
      if (isLoggedIn && nextUrl.pathname === "/login") {
         return Response.redirect(new URL("/admin", nextUrl));
      }
      
      // IMPORTANTE: Para qualquer outra página (Home, Sobre, etc),
      // retorna true para permitir o acesso público.
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        // @ts-ignore
        session.user.id = token.id as string;
        // @ts-ignore
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  providers: [], 
} satisfies NextAuthConfig;