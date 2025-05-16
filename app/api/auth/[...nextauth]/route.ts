// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions"; // Importação com caminho absoluto

console.log("[NextAuth Route] Rota de autenticação carregada, importando authOptions de @/lib/authOptions.");

// Adicionando try-catch em volta da inicialização do handler para pegar erros de configuração
let handler;
try {
  console.log("[NextAuth Route] Tentando inicializar o handler NextAuth...");
  handler = NextAuth(authOptions);
  console.log("[NextAuth Route] Handler NextAuth inicializado com sucesso.");
} catch (error) {
  console.error("[NextAuth Route] ERRO CRÍTICO AO INICIALIZAR NEXTAUTH:", error);
  const errorHandler = (req: any, res: any) => {
    throw new Error("Falha ao inicializar o handler de autenticação.");
  };
  handler = { GET: errorHandler, POST: errorHandler };
}

export { handler as GET, handler as POST };

