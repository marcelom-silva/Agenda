// lib/authOptions.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db"; // Importação com caminho absoluto corrigida

console.log("[AuthOptions] Definindo authOptions...");

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
        console.log("[NextAuth Google Profile] Perfil recebido do Google:", JSON.stringify(profile, null, 2));
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      profile(profile) {
        console.log("[NextAuth GitHub Profile] Perfil recebido do GitHub:", JSON.stringify(profile, null, 2));
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "database",
  },
  pages: {
    // signIn: "/auth/signin",
    // error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("[NextAuth Callback - signIn] Iniciando signIn.");
      console.log("[NextAuth Callback - signIn] User:", JSON.stringify(user, null, 2));
      console.log("[NextAuth Callback - signIn] Account:", JSON.stringify(account, null, 2));
      console.log("[NextAuth Callback - signIn] Email:", JSON.stringify(email, null, 2));
      console.log("[NextAuth Callback - signIn] Permitindo signIn.");
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log("[NextAuth Callback - redirect] URL:", url, "BaseURL:", baseUrl);
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      console.log("[NextAuth Callback - redirect] Redirecionando para baseUrl padrão:", baseUrl);
      return baseUrl;
    },
    async session({ session, user, token }) {
      console.log("[NextAuth Callback - session] Gerando sessão.");
      if (user && session.user) {
        session.user.id = user.id;
      }
      console.log("[NextAuth Callback - session] Session DEPOIS com user.id:", JSON.stringify(session, null, 2));
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log("[NextAuth Callback - jwt] Gerando JWT (se strategy for 'jwt').");
      if (user?.id) {
        token.id = user.id;
      }
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
  events: {
    async signIn(message) {
      console.log("[NextAuth Event - signIn] Usuário logado:", JSON.stringify(message, null, 2));
    },
    async signOut(message) {
      console.log("[NextAuth Event - signOut] Usuário deslogado:", JSON.stringify(message, null, 2));
    },
    async createUser(message) {
      console.log("[NextAuth Event - createUser] Usuário criado via adapter:", JSON.stringify(message, null, 2));
    },
    async updateUser(message) {
      console.log("[NextAuth Event - updateUser] Usuário atualizado via adapter:", JSON.stringify(message, null, 2));
    },
    async linkAccount(message) {
      console.log("[NextAuth Event - linkAccount] Conta vinculada via adapter:", JSON.stringify(message, null, 2));
    },
  },
  debug: process.env.NODE_ENV === "development",
};

console.log("[AuthOptions] authOptions definidos e exportados.");

