import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
// Import adapter and database client if you are using a database for sessions/users
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import prisma from "@/lib/db"; // Assuming prisma client is in lib/db.ts

export const authOptions = {
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
  //     session.accessToken = token.accessToken;
  //     session.user.id = token.id;
  //     return session;
  //   },
  //   async jwt({ token, user, account, profile, isNewUser }) {
  //     if (account) {
  //       token.accessToken = account.access_token;
  //       token.id = user?.id; // or profile.id depending on provider
  //     }
  //     return token;
  //   },
  // },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

