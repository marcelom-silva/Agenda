import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/db"; // Ajuste o caminho se o seu prisma client estiver em outro lugar

// Defina suas authOptions aqui
export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    // ...outros provedores se houver
  ],
  // callbacks, pages, secret, etc., conforme necessário
  secret: process.env.NEXTAUTH_SECRET,
  // Adicione callbacks se precisar lidar com o ID do usuário na sessão
  callbacks: {
    async session({ session, user }: any) {
      if (session.user) {
        session.user.id = user.id; // Adiciona o ID do usuário à sessão
      }
      return session;
    },
  },
};

// Exporte os manipuladores GET e POST
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };