// lib/authOptions.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db"; // Importação com caminho absoluto corrigida

console.log("[AuthOptions] Definindo authOptions...");
console.log("[AuthOptions Debug] NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
console.log("[AuthOptions Debug] NEXTAUTH_SECRET definido:", !!process.env.NEXTAUTH_SECRET);
console.log("[AuthOptions Debug] GOOGLE_CLIENT_ID definido:", !!process.env.GOOGLE_CLIENT_ID);
console.log("[AuthOptions Debug] GOOGLE_CLIENT_SECRET definido:", !!process.env.GOOGLE_CLIENT_SECRET);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Configuração simplificada do GoogleProvider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "database",
  },
  callbacks: {
    async session({ session, user }) {
      console.log("[NextAuth Callback - session] Gerando sessão");
      if (user && session.user) {
        session.user.id = user.id;
      }
      console.log("[NextAuth Callback - session] Session com user.id:", JSON.stringify(session, null, 2));
      return session;
    },
  },
  debug: true, // Habilitando modo de depuração
  logger: {
    error(code, metadata) {
      console.error("[NextAuth Logger - ERROR] Código:", code, "Metadata:", JSON.stringify(metadata, null, 2));
    },
    warn(code) {
      console.warn("[NextAuth Logger - WARN] Código:", code);
    },
    debug(code, metadata) {
      console.log("[NextAuth Logger - DEBUG] Código:", code, "Metadata:", metadata ? JSON.stringify(metadata, null, 2) : "");
    },
  },
};

console.log("[AuthOptions] authOptions definidos e exportados.");
