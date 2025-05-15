"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation for App Router
import React, { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Se o status não for 'loading' e não houver sessão (usuário não autenticado),
    // redireciona para a página de login padrão do NextAuth.
    if (status !== "loading" && !session) {
      router.push("/api/auth/signin"); // Ou para uma página de login customizada se você tiver uma
    }
  }, [session, status, router]);

  // Enquanto estiver carregando a sessão, pode mostrar um loader
  if (status === "loading") {
    return <p>Carregando...</p>;
  }

  // Se não houver sessão (após o carregamento), não renderiza nada ou mostra mensagem de acesso negado
  // (o useEffect já deve ter redirecionado, mas é uma segurança adicional)
  if (!session) {
    return null; // Ou <p>Acesso negado. Você será redirecionado para o login.</p>;
  }

  // Se chegou até aqui, o usuário está autenticado
  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Dashboard Protegido</h1>
      <p>Bem-vindo, {session.user?.name || session.user?.email}!</p>
      <p>Esta página só pode ser acessada por usuários autenticados.</p>
      <button onClick={() => signOut({ callbackUrl: "/" })}>Sair</button>
      {/* Aqui você começaria a adicionar o conteúdo real do seu dashboard,
          como o Kanban, calendário, módulo financeiro, etc. */}
    </div>
  );
}

