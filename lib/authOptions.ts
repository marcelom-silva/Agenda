// lib/authOptions.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { compare } from "bcryptjs";

console.log("[AuthOptions] Definindo authOptions...");
console.log("[AuthOptions Debug] NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
console.log("[AuthOptions Debug] NEXTAUTH_SECRET definido:", !!process.env.NEXTAUTH_SECRET);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("[CredentialsProvider] Email ou senha não fornecidos");
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          if (!user || !user.password) {
            console.log("[CredentialsProvider] Usuário não encontrado ou sem senha definida");
            return null;
          }

          const isPasswordValid = await compare(credentials.password, user.password);

          if (!isPasswordValid) {
            console.log("[CredentialsProvider] Senha inválida");
            return null;
          }

          console.log("[CredentialsProvider] Autenticação bem-sucedida para:", user.email);
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image
          };
        } catch (error) {
          console.error("[CredentialsProvider] Erro durante autenticação:", error);
          return null;
        }
      }
    }),
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
  pages: {
    signIn: "/auth/login", // Página personalizada de login
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
  debug: true,
};

console.log("[AuthOptions] authOptions definidos e exportados.");
