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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
        console.log("[NextAuth Google Profile] Perfil recebido do Google:", JSON.stringify(profile, null, 2));
        console.log("[NextAuth Google Profile Debug] Tipo de profile.sub:", typeof profile.sub);
        console.log("[NextAuth Google Profile Debug] Tipo de profile.email:", typeof profile.email);
        try {
          return {
            id: profile.sub,
            name: profile.name,
            email: profile.email,
            image: profile.picture,
          };
        } catch (error) {
          console.error("[NextAuth Google Profile ERROR]", error);
          throw error;
        }
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      profile(profile) {
        console.log("[NextAuth GitHub Profile] Perfil recebido do GitHub:", JSON.stringify(profile, null, 2));
        try {
          return {
            id: profile.id.toString(),
            name: profile.name || profile.login,
            email: profile.email,
            image: profile.avatar_url,
          };
        } catch (error) {
          console.error("[NextAuth GitHub Profile ERROR]", error);
          throw error;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "database",
  },
  pages: {
    // signIn: "/auth/signin",
    error: "/api/auth/error", // Adicionando página de erro para capturar detalhes
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("[NextAuth Callback - signIn] ===== INÍCIO DO PROCESSO DE SIGNIN =====");
      console.log("[NextAuth Callback - signIn] User:", JSON.stringify(user, null, 2));
      console.log("[NextAuth Callback - signIn] Account:", JSON.stringify(account, null, 2));
      console.log("[NextAuth Callback - signIn] Profile:", JSON.stringify(profile, null, 2));
      console.log("[NextAuth Callback - signIn] Email:", JSON.stringify(email, null, 2));
      console.log("[NextAuth Callback - signIn] Credentials:", credentials ? "Definido" : "Não definido");
      
      // Verificações detalhadas
      if (!user) console.log("[NextAuth Callback - signIn] ALERTA: User está indefinido ou nulo");
      if (!account) console.log("[NextAuth Callback - signIn] ALERTA: Account está indefinido ou nulo");
      if (!profile) console.log("[NextAuth Callback - signIn] ALERTA: Profile está indefinido ou nulo");
      
      try {
        console.log("[NextAuth Callback - signIn] Permitindo signIn, retornando true");
        console.log("[NextAuth Callback - signIn] ===== FIM DO PROCESSO DE SIGNIN =====");
        return true;
      } catch (error) {
        console.error("[NextAuth Callback - signIn] ERRO durante signIn:", error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      console.log("[NextAuth Callback - redirect] ===== INÍCIO DO PROCESSO DE REDIRECT =====");
      console.log("[NextAuth Callback - redirect] URL:", url);
      console.log("[NextAuth Callback - redirect] BaseURL:", baseUrl);
      
      try {
        let redirectUrl;
        if (url.startsWith("/")) {
          redirectUrl = `${baseUrl}${url}`;
          console.log("[NextAuth Callback - redirect] URL começa com '/', redirecionando para:", redirectUrl);
        } else if (new URL(url).origin === baseUrl) {
          redirectUrl = url;
          console.log("[NextAuth Callback - redirect] URL tem mesma origem que baseUrl, redirecionando para:", redirectUrl);
        } else {
          redirectUrl = baseUrl;
          console.log("[NextAuth Callback - redirect] URL não reconhecida, redirecionando para baseUrl padrão:", redirectUrl);
        }
        console.log("[NextAuth Callback - redirect] ===== FIM DO PROCESSO DE REDIRECT =====");
        return redirectUrl;
      } catch (error) {
        console.error("[NextAuth Callback - redirect] ERRO durante redirect:", error);
        console.log("[NextAuth Callback - redirect] Redirecionando para baseUrl padrão devido a erro:", baseUrl);
        return baseUrl;
      }
    },
    async session({ session, user, token }) {
      console.log("[NextAuth Callback - session] ===== INÍCIO DO PROCESSO DE SESSION =====");
      console.log("[NextAuth Callback - session] Session ANTES:", JSON.stringify(session, null, 2));
      console.log("[NextAuth Callback - session] User:", JSON.stringify(user, null, 2));
      console.log("[NextAuth Callback - session] Token:", JSON.stringify(token, null, 2));
      
      try {
        if (user && session.user) {
          session.user.id = user.id;
          console.log("[NextAuth Callback - session] ID do usuário adicionado à sessão:", user.id);
        } else {
          console.log("[NextAuth Callback - session] ALERTA: Não foi possível adicionar ID à sessão");
          if (!user) console.log("[NextAuth Callback - session] ALERTA: User está indefinido ou nulo");
          if (!session.user) console.log("[NextAuth Callback - session] ALERTA: session.user está indefinido ou nulo");
        }
        
        console.log("[NextAuth Callback - session] Session DEPOIS:", JSON.stringify(session, null, 2));
        console.log("[NextAuth Callback - session] ===== FIM DO PROCESSO DE SESSION =====");
        return session;
      } catch (error) {
        console.error("[NextAuth Callback - session] ERRO durante geração de sessão:", error);
        return session;
      }
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log("[NextAuth Callback - jwt] ===== INÍCIO DO PROCESSO DE JWT =====");
      console.log("[NextAuth Callback - jwt] Token ANTES:", JSON.stringify(token, null, 2));
      console.log("[NextAuth Callback - jwt] User:", JSON.stringify(user, null, 2));
      console.log("[NextAuth Callback - jwt] Account:", JSON.stringify(account, null, 2));
      console.log("[NextAuth Callback - jwt] IsNewUser:", isNewUser);
      
      try {
        if (user?.id) {
          token.id = user.id;
          console.log("[NextAuth Callback - jwt] ID do usuário adicionado ao token:", user.id);
        }
        if (account?.access_token) {
          token.accessToken = account.access_token;
          console.log("[NextAuth Callback - jwt] Access token adicionado ao token");
        }
        
        console.log("[NextAuth Callback - jwt] Token DEPOIS:", JSON.stringify(token, null, 2));
        console.log("[NextAuth Callback - jwt] ===== FIM DO PROCESSO DE JWT =====");
        return token;
      } catch (error) {
        console.error("[NextAuth Callback - jwt] ERRO durante geração de JWT:", error);
        return token;
      }
    },
  },
  events: {
    async signIn(message) {
      console.log("[NextAuth Event - signIn] ===== EVENTO DE SIGNIN =====");
      console.log("[NextAuth Event - signIn] Usuário logado:", JSON.stringify(message, null, 2));
    },
    async signOut(message) {
      console.log("[NextAuth Event - signOut] ===== EVENTO DE SIGNOUT =====");
      console.log("[NextAuth Event - signOut] Usuário deslogado:", JSON.stringify(message, null, 2));
    },
    async createUser(message) {
      console.log("[NextAuth Event - createUser] ===== EVENTO DE CREATE USER =====");
      console.log("[NextAuth Event - createUser] Usuário criado via adapter:", JSON.stringify(message, null, 2));
    },
    async updateUser(message) {
      console.log("[NextAuth Event - updateUser] ===== EVENTO DE UPDATE USER =====");
      console.log("[NextAuth Event - updateUser] Usuário atualizado via adapter:", JSON.stringify(message, null, 2));
    },
    async linkAccount(message) {
      console.log("[NextAuth Event - linkAccount] ===== EVENTO DE LINK ACCOUNT =====");
      console.log("[NextAuth Event - linkAccount] Conta vinculada via adapter:", JSON.stringify(message, null, 2));
    }
  },
  debug: true, // Habilitando modo de depuração independente do ambiente
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
