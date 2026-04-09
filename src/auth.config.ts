import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = nextUrl.pathname;

      // Rotas de login são sempre públicas (login, esqueci senha, redefinir senha)
      const isLoginArea = path.startsWith("/admin/login");
      if (isLoginArea) {
        // Se já está logado e tenta acessar o login, redireciona pro painel
        if (isLoggedIn) return Response.redirect(new URL("/admin", nextUrl));
        return true;
      }

      // Demais rotas /admin exigem autenticação
      if (path.startsWith("/admin")) {
        return isLoggedIn;
      }

      // Site público — sempre acessível
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