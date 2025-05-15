import NextAuth, { NextAuthOptions } from "next-auth"; // Adicionei NextAuthOptions para tipagem
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
// Import adapter and database client if you are using a database for sessions/users
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import prisma from "@/lib/db"; // Assuming prisma client is in lib/db.ts

// authOptions agora é uma constante local, sem o 'export'
const authOptions: NextAuthOptions = { // Adicionei a tipagem NextAuthOptions
  // adapter: PrismaAdapter(prisma), // Uncomment if using Prisma Adapter
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    // ...add more providers here
  ],
  // secret: process.env.NEXTAUTH_SECRET, // Recommended for production
  // pages: { // Optional: customize sign-in, sign-out, error pages
  //   signIn: "/auth/signin",
  // },
  // callbacks: { // Optional: customize session, jwt, redirect callbacks
  //   async session({ session, token, user }) {
  //     // Send properties to the client, like an access_token and user id from a provider.
  //     // session.accessToken = token.accessToken; // Exemplo
  //     // if (session.user && token.sub) { // Exemplo de como adicionar id do usuário à sessão
  //     //   session.user.id = token.sub;
  //     // }
  //     return session;
  //   },
  //   async jwt({ token, user, account, profile, isNewUser }) {
  //     if (account) {
  //       // token.accessToken = account.access_token; // Exemplo
  //       // token.id = user?.id; // or profile.id depending on provider // Exemplo
  //     }
  //     return token;
  //   },
  // },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };