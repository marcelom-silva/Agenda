import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/db"; // Certifique-se que este caminho está correto para seu cliente Prisma

console.log("[NextAuth] Rota de autenticação carregada.");

const authOptions: NextAuthOptions = {
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
  secret: process.env.NEXTAUTH_SECRET, // É crucial para produção
  session: {
    strategy: "database", // Recomenda-se "database" quando usando um adapter
  },
  pages: {
    // signIn: 	"/auth/signin", // Se você tiver uma página de login customizada
    // error: 	"/auth/error", // Página para exibir erros (ex: falha no login)
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("[NextAuth Callback - signIn] Iniciando signIn.");
      console.log("[NextAuth Callback - signIn] User:", JSON.stringify(user, null, 2));
      console.log("[NextAuth Callback - signIn] Account:", JSON.stringify(account, null, 2));
      // console.log("[NextAuth Callback - signIn] Profile:", JSON.stringify(profile, null, 2)); // Profile pode ser grande
      console.log("[NextAuth Callback - signIn] Email:", JSON.stringify(email, null, 2));
      // console.log("[NextAuth Callback - signIn] Credentials:", JSON.stringify(credentials, null, 2));
      
      // Adicione aqui qualquer lógica customizada para o signIn
      // Por exemplo, verificar se o email é de um domínio permitido
      // const isAllowedToSignIn = true;
      // if (isAllowedToSignIn) {
      //   return true;
      // } else {
      //   console.log("[NextAuth Callback - signIn] Usuário não permitido para login.");
      //   return false; // Ou redirecionar para uma página de erro: 	return 	"/auth/error?error=AccessDenied"
      // }
      console.log("[NextAuth Callback - signIn] Permitindo signIn.");
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log("[NextAuth Callback - redirect] URL:", url, "BaseURL:", baseUrl);
      // Permite redirecionamentos relativos após o login
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Permite redirecionamentos para a baseUrl
      else if (new URL(url).origin === baseUrl) return url;
      // Por padrão, redireciona para a baseUrl se não for um dos casos acima
      console.log("[NextAuth Callback - redirect] Redirecionando para baseUrl padrão:", baseUrl);
      return baseUrl;
    },
    async session({ session, user, token }) {
      console.log("[NextAuth Callback - session] Gerando sessão.");
      // console.log("[NextAuth Callback - session] Session ANTES:", JSON.stringify(session, null, 2));
      // console.log("[NextAuth Callback - session] User (do adapter/DB):", JSON.stringify(user, null, 2));
      // console.log("[NextAuth Callback - session] Token (se usando JWT strategy):", JSON.stringify(token, null, 2));
      
      // Adiciona o ID do usuário do banco de dados à sessão
      // O objeto `user` aqui é o usuário como retornado pelo adapter (do banco de dados)
      if (user && session.user) {
        session.user.id = user.id;
      }
      console.log("[NextAuth Callback - session] Session DEPOIS com user.id:", JSON.stringify(session, null, 2));
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log("[NextAuth Callback - jwt] Gerando JWT (se strategy for 'jwt').");
      // console.log("[NextAuth Callback - jwt] Token ANTES:", JSON.stringify(token, null, 2));
      // console.log("[NextAuth Callback - jwt] User (no primeiro login com JWT):", JSON.stringify(user, null, 2));
      // console.log("[NextAuth Callback - jwt] Account:", JSON.stringify(account, null, 2));
      // console.log("[NextAuth Callback - jwt] Profile:", JSON.stringify(profile, null, 2));
      // console.log("[NextAuth Callback - jwt] IsNewUser:", isNewUser);

      // Persiste o ID do usuário no token JWT no primeiro login
      if (user?.id) {
        token.id = user.id;
      }
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      // console.log("[NextAuth Callback - jwt] Token DEPOIS:", JSON.stringify(token, null, 2));
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
    async session(message) {
      // console.log("[NextAuth Event - session] Sessão ativa:", JSON.stringify(message, null, 2));
    },
  },
  debug: process.env.NODE_ENV === "development", // Ativa logs de debug do NextAuth em desenvolvimento
  // adapter: PrismaAdapter(prisma), // Já definido no topo
};

// Adicionando try-catch em volta da inicialização do handler para pegar erros de configuração
let handler;
try {
  console.log("[NextAuth] Tentando inicializar o handler NextAuth...");
  handler = NextAuth(authOptions);
  console.log("[NextAuth] Handler NextAuth inicializado com sucesso.");
} catch (error) {
  console.error("[NextAuth] ERRO CRÍTICO AO INICIALIZAR NEXTAUTH:", error);
  // Em caso de erro crítico na inicialização, podemos exportar um handler que sempre retorna erro
  const errorHandler = (req: any, res: any) => {
    // Implementar uma resposta de erro adequada ou redirecionamento
    // Em um ambiente serverless como Vercel, a função pode simplesmente falhar em carregar
    // e os logs do Vercel para a função mostrarão o erro acima.
    throw new Error("Falha ao inicializar o handler de autenticação.");
  };
  handler = { GET: errorHandler, POST: errorHandler };
}

export { handler as GET, handler as POST };

