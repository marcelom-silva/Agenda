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
          
          // Tratamento simplificado de erros para compatibilidade com SQLite
          if (error instanceof Error) {
            console.error("[CredentialsProvider] Erro de conexão ou consulta:", error.message);
          }
          
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
    strategy: "jwt", // Alterado de "database" para "jwt" para melhor compatibilidade com SQLite
  },
  pages: {
    signIn: "/auth/login", // Página personalizada de login
    error: "/auth/error", // Página personalizada de erro
  },
  callbacks: {
    async session({ session, token }) {
      console.log("[NextAuth Callback - session] Gerando sessão");
      if (token && session.user) {
        session.user.id = token.sub as string;
      }
      console.log("[NextAuth Callback - session] Session com user.id:", JSON.stringify(session, null, 2));
      return session;
    },
  },
  debug: process.env.NODE_ENV !== "production",
};

console.log("[AuthOptions] authOptions definidos e exportados.");
